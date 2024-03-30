/*
 * Copyright (c) 2024. Matis Byar — MIT
 */

function log(type, processName, message) {
  if (message === void 0) {
    message = '';
  }
  var timestamp = new Date().toISOString();
  var processNameStringSize = 10;
  var whiteSpace = ' ';
  switch (type.toUpperCase()) {
    case 'SUCCESS':
      type = "\x1B[32m" + type + "\x1B[0m";
      break;
    case 'INFO':
      type = "\x1B[34m" + type + "\x1B[0m";
      break;
    case 'WARNING':
      type = "\x1B[33m" + type + "\x1B[0m";
      break;
    case 'ERROR':
      type = "\x1B[31m" + type + "\x1B[0m";
      break;
    default:
      type = "\x1B[37m" + type + "\x1B[0m";
  }
  if (processName.length > processNameStringSize) processName = processName.substring(0, processNameStringSize - 1) + "…";
  processName = "\x1B[1m" + processName + "\x1B[0m " + whiteSpace.repeat(processNameStringSize - processName.length);
  console.log("[" + timestamp + "] " + type + " \u2014 " + processName + ": " + message);
}
module.exports = {
  log: log
};

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

var processPool = function processPool() {
  try {
    if (pool.length === 0) return Promise.resolve();
    var _temp = _forTo(pool, function (i) {
      var _pool$i;
      return Promise.resolve((_pool$i = pool[i]).methodToRun.apply(_pool$i, pool[i].args)).then(function () {});
    });
    return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
var Cron = require("node-cron");
var _require = require("./src/logger"),
  log$1 = _require.log;
var pool = [];
Cron.schedule("*/5 * * * *", function () {
  return Promise.resolve(processPool()).then(function () {});
});
function addToPool(methodToRun, args, attempts) {
  var methodKey = generateMethodKey(methodToRun);
  var existingRequestIndex = pool.findIndex(function (request) {
    return request.methodKey === methodKey && JSON.stringify(request.args) === JSON.stringify(args);
  });
  if (existingRequestIndex !== -1) {
    pool[existingRequestIndex].attempts--;
    if (pool[existingRequestIndex].attempts <= 0) {
      removeFromPool(methodKey, args);
      log$1("ERROR", "Error Handler", "Failed to execute request. Removed from pool.");
      return;
    }
    log$1("WARNING", "Error Handler", "Updated request in pool. " + pool[existingRequestIndex].attempts + " attempts left.");
  } else {
    pool.push({
      methodKey: methodKey,
      methodToRun: methodToRun,
      args: args,
      attempts: attempts
    });
    log$1("WARNING", "Error Handler", "Added request to pool. " + attempts + " attempts left.");
  }
}
function generateMethodKey(methodToRun) {
  return methodToRun.name;
}
function removeFromPool(methodKey, args) {
  pool.splice(pool.findIndex(function (elem) {
    return elem.methodKey === methodKey && JSON.stringify(elem.args) === JSON.stringify(args);
  }), 1);
}
module.exports = {
  addToPool: addToPool
};
var errorHandler = module.exports;

exports.errorHandler = errorHandler;
exports.logger = log;
//# sourceMappingURL=index.js.map
