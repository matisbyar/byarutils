/*
 * Copyright (c) 2024. Matis Byar — MIT
 */

declare module 'byarutils' {

  /**
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
  export function addToPool(methodToRun: Function, args: any[], attempts: number): void;

  /**
   * @description
   * This module provides a function for logging messages to the console with various log levels.
   *
   * @example
   * log('INFO', 'Example', 'This is an example');
   * // Output: [2003-12-06T12:45:00.000Z] INFO — ProcessName: message
   *
   * @param {string} type - The log level, one of 'SUCCESS', 'INFO', 'WARNING', or 'ERROR'.
   * @param {string} processName - The name of the process or component.
   * @param {string} [message] - The message to log (optional).
   *
   * @author Matis Byar
   */
  export function log(type: string, processName: string, message: string): void;
}
