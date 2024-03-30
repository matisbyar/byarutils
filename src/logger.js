/*
 * Copyright (c) 2023-2024. Matis Byar — MIT
 */

/**
 * @module Logger
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
function log(type, processName, message = '') {
  // Get the current timestamp
  const timestamp = new Date().toISOString();
  // Define the maximum length of the process name
  const processNameStringSize = 10;
  // Define the white space character
  const whiteSpace = ' ';

  // Colorize and format the log type
  switch (type.toUpperCase()) {
    case 'SUCCESS':
      type = `\x1b[32m${type}\x1b[0m`;
      break;
    case 'INFO':
      type = `\x1b[34m${type}\x1b[0m`;
      break;
    case 'WARNING':
      type = `\x1b[33m${type}\x1b[0m`;
      break;
    case 'ERROR':
      type = `\x1b[31m${type}\x1b[0m`;
      break;
    default:
      type = `\x1b[37m${type}\x1b[0m`;
  }

  // Truncate the process name if it exceeds the maximum length
  if (processName.length > processNameStringSize) processName = processName.substring(0, processNameStringSize - 1) + "…";

  // Format and style the process name
  processName = `\x1b[1m${processName}\x1b[0m ${whiteSpace.repeat(processNameStringSize - processName.length)}`;

  // Print the log message to the console
  console.log(`[${timestamp}] ${type} — ${processName}: ${message}`);
}

module.exports = {
  log
};

export default log;
