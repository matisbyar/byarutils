/*
 * Copyright (c) 2023. Matis Byar — MIT
 */

/**
 * @module ErrorHandler
 * @description
 * The ErrorHandler module manages a pool of failed requests, providing a mechanism to retry them later.
 *
 * This module facilitates the retry of failed requests, whether due to errors or connectivity issues. Each request in the pool is represented by an object with the following properties:
 * - methodToRun: The function to call
 * - args: The arguments to pass to the function
 * - attempts: The remaining number of retry attempts
 *
 * @note
 * To initiate retries, this module relies on a scheduled task, such as a cron job, to invoke the `processPool` function. By default, the `processPool` function is called every 5 minutes.
 * Furthermore, this module relies on the `log` function from the `Logger` module to log messages.
 *
 * @author Matis Byar
 */

const Cron = require("node-cron");
const { log } = require("./logger");

/**
 * Pool of failed requests.
 * @type {Object[]}
 */
const pool = [];

/**
 * Schedule the `processPool` function to run at fixed intervals using a cron job.
 */
Cron.schedule("*/5 * * * *", async () => {
  await processPool();
});

/**
 * Adds a request to the error pool or updates an existing request.
 *
 * This function generates a unique key for the method to run and checks if a request with the same methodKey and arguments exists in the pool. If it exists, it updates the retry attempts for the existing request. If the request does not exist, it adds a new request to the pool. If there are no retry attempts left, the request is removed from the pool.
 *
 * @param {Function} methodToRun - The function to call.
 * @param {any[]} args - The arguments to pass to the function.
 * @param {number} attempts - The number of retry attempts that are left.
 */
function addToPool(methodToRun, args, attempts) {
  const methodKey = generateMethodKey(methodToRun);

  const existingRequestIndex = pool.findIndex(request => {
    // Check if a request with the same methodKey and arguments exists in the pool
    return request.methodKey === methodKey && JSON.stringify(request.args) === JSON.stringify(args);
  });

  if (existingRequestIndex !== -1) {
    // Update the retry attempts for the existing request
    pool[existingRequestIndex].attempts--;

    if (pool[existingRequestIndex].attempts <= 0) {
      removeFromPool(methodKey, args);
      log("ERROR", "Error Handler", "Failed to execute request. Removed from pool.");
      return;
    }

    log("WARNING", "Error Handler", `Updated request in pool. ${pool[existingRequestIndex].attempts} attempts left.`);
  } else {
    // Add a new request to the pool
    pool.push({ methodKey, methodToRun, args, attempts });
    log("WARNING", "Error Handler", `Added request to pool. ${attempts} attempts left.`);
  }
}

/**
 * Generates a unique key for a method.
 *
 * @param {Function} methodToRun - The function to call.
 * @returns {string} A unique key for the method, typically the function's name.
 */
function generateMethodKey(methodToRun) {
  return methodToRun.name; // Use the function name as the key
}

/**
 * Process the error pool of failed requests recursively.
 */
async function processPool() {
  if (pool.length === 0)
    return;

  for (let i = 0; i < pool.length; i++) {
    await pool[i].methodToRun(...pool[i].args);
  }
}

/**
 * Removes a request from the error pool.
 *
 * @param {string} methodKey - The unique identifier for the function.
 * @param {any[]} args - The arguments associated with the request.
 */
function removeFromPool(methodKey, args) {
  pool.splice(pool.findIndex(elem => {
    return elem.methodKey === methodKey && JSON.stringify(elem.args) === JSON.stringify(args);
  }), 1);
}

module.exports = {
  addToPool
};
