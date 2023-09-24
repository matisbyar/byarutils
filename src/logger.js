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

  // Format and style the process name
  processName = `\x1b[1m${processName}\x1b[0m`;

  // Print the log message to the console
  console.log(`[${timestamp}] ${type} — ${processName}: ${message}`);
}

module.exports = {
  log
};
