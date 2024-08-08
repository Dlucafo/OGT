/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/complain/index.js":
/*!****************************************!*\
  !*** ./node_modules/complain/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var StackParser = __webpack_require__(/*! error-stack-parser */ "./node_modules/error-stack-parser/error-stack-parser.js");
var env = typeof process !== 'undefined' && "development";
var isDevelopment = !env || env === 'dev' || env === 'development';
var showModuleComplains = typeof process !== 'undefined' && Boolean(process.env.SHOW_MODULE_COMPLAINS);
var showNestedComplains = typeof process !== 'undefined' && Boolean(process.env.SHOW_NESTED_COMPLAINS);
var logger = typeof console !== 'undefined' && console.warn && console;
var cwd = typeof process !== 'undefined' && process.cwd() + '/' || '';
var linebreak = typeof process !== 'undefined' && 'win32' === process.platform ? '\r\n' : '\n';
var newline = /(\r\n|\r|\n)/g;
var slice = [].slice;
var ignoredLocation = "[ignore]";
var hits = {};

complain = isDevelopment ? complain : noop;
complain.method = isDevelopment ? method : noop;
complain.fn = isDevelopment ? fn : noopReturn;
complain.log = log;
complain.stream = typeof process !== 'undefined' && process.stderr;
complain.silence = false;
complain.color = complain.stream && complain.stream.isTTY;
complain.colors = { warning:'\x1b[31;1m', notice:'\x1b[33;1m', message:false, location:'\u001b[90m' };
complain.getModuleName = getModuleName;

/* istanbul ignore next */
if ( true && module.exports) {
  module.exports = complain;
} else if(typeof window !== 'undefined') {
  window.complain = complain;
}

function complain() {
  var options;
  var location;
  var locationIndex;
  var headingColor;
  var heading;
  var level;
  var args = arguments;

  if(complain.silence) return;

  if(typeof args[args.length-1] === 'object') {
    options = args[args.length-1];
    args = slice.call(args, 0, -1);
  } else {
    options = {};
  }

  level = options.level || 2;
  heading = options.heading || (level == 2 ? "WARNING!!" : "NOTICE");
  headingColor = options.headingColor || (level == 2 ? complain.colors.warning : complain.colors.notice);

  // Default to the location of the call to the deprecated function
  locationIndex = options.locationIndex == null ? 1 : options.locationIndex;

  // When the user sets location to false,
  // We will use the location of the call to complain()
  // To limit the log to only occurring once
  if(options.location === false) {
    locationIndex = 0;
  }

  location = options.location || getLocation(locationIndex);
  
  var moduleName = complain.getModuleName(location);

  if (moduleName && !showModuleComplains) {
    if (!hits[moduleName]) {
      var output = format("NOTICE", complain.colors.notice);
      output += linebreak + format('The module ['+moduleName+'] is using deprecated features.', complain.colors.message);
      output += linebreak + format('Run with process.env.SHOW_MODULE_COMPLAINS=1 to see all warnings.', complain.colors.message);
      complain.log(linebreak + output + linebreak);
      hits[moduleName] = true;
    }
    return;
  }

  /* istanbul ignore next */
  // Location is only missing in older browsers.
  if(location) {
    if(hits[location] || location === ignoredLocation) return;
    else hits[location] = true;
  }

  var output = format(heading, headingColor);

  for(var i = 0; i < args.length; i++) {
    output += linebreak + format(args[i], complain.colors.message);
  }

  if(options.location !== false && location) {
    output += linebreak + format('  at '+location.replace(cwd, ''), complain.colors.location);
  }

  complain.log(linebreak + output + linebreak);
};

function method(object, methodName) {
    var originalMethod = object[methodName];
    var args = slice.call(arguments, 2);

    object[methodName] = function() {
        complain.apply(null, args);
        return originalMethod.apply(this, arguments);
    };
}

function fn(original) {
  var args = slice.call(arguments, 1);

  return function() {
    complain.apply(null, args);
    return original.apply(this, arguments);
  }
}

function log(message, color) {
  var formatted = format(message, color);
  if(complain.stream) {
    complain.stream.write(formatted+linebreak);
  } else if(logger) {
    logger.warn(formatted);
  }
}

function format(message, color) {
  return color && complain.color ? color + message + '\x1b[0m' : message;
}

function getLocation(locationIndex) {
  var location = '';
  var targetIndex = locationIndex + 2;

  /**
   * Stack index descriptions.
   * 
   * 0: In getLocation(), the call to new Error()
   * 1: In complain(), the call to getLocation()
   * 2: In the deprecated function, the call to complain()
   * 3: The call to the deprecated function (THIS IS THE DEFAULT)
   */

  try {
    var locations = StackParser.parse(new Error()).map(function(frame) {
      return frame.fileName+':'+frame.lineNumber+':'+frame.columnNumber;
    });
    if (!showNestedComplains) {
      for (var i = locations.length-1; i > targetIndex; i--) {
        if (hits[locations[i]]) {
          return ignoredLocation;
        }
      }
    }
    location = locations[targetIndex];
  } catch(e) {}

  return location;
}

function getModuleName(location) {
  var locationParts = location.replace(cwd, '').split(/\/|\\/g);
  for(var i = locationParts.length-1; i >= 0; i--) {
    if (locationParts[i] === 'node_modules') {
      var moduleName = locationParts[i+1];
      return (moduleName[0] === '@') ? moduleName+'/'+locationParts[i+2] : moduleName;
    }
  }
}

function noop(){};
function noopReturn(r) { return r; };


/***/ }),

/***/ "./node_modules/error-stack-parser/error-stack-parser.js":
/*!***************************************************************!*\
  !*** ./node_modules/error-stack-parser/error-stack-parser.js ***!
  \***************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! stackframe */ "./node_modules/stackframe/stackframe.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return filtered.map(function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '');
                }
                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '');

                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
                // case it has spaces in it, as the string is split on \s+ later on
                var location = sanitizedLine.match(/ (\(.+\)$)/);

                // remove the parenthesized location from the line, if it was matched
                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

                // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
                // because this line doesn't have function name
                var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
                var functionName = location && sanitizedLine || undefined;
                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame({
                    functionName: functionName,
                    fileName: fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return filtered.map(function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame({
                        functionName: line
                    });
                } else {
                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                    var matches = line.match(functionNameRegex);
                    var functionName = matches && matches[1] ? matches[1] : undefined;
                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

                    return new StackFrame({
                        functionName: functionName,
                        fileName: locationParts[0],
                        lineNumber: locationParts[1],
                        columnNumber: locationParts[2],
                        source: line
                    });
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    }));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame({
                            functionName: match[3] || undefined,
                            fileName: match[2],
                            lineNumber: match[1],
                            source: lines[i]
                        })
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return filtered.map(function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                    .replace(/<anonymous function(: (\w+))?>/, '$2')
                    .replace(/\([^)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');

                return new StackFrame({
                    functionName: functionName,
                    args: args,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        }
    };
}));


/***/ }),

/***/ "./node_modules/events-light/src/index.js":
/*!************************************************!*\
  !*** ./node_modules/events-light/src/index.js ***!
  \************************************************/
/***/ ((module) => {

/* jshint newcap:false */
var slice = Array.prototype.slice;

function isFunction(arg) {
    return typeof arg === 'function';
}

function checkListener(listener) {
    if (!isFunction(listener)) {
        throw TypeError('Invalid listener');
    }
}

function invokeListener(ee, listener, args) {
    switch (args.length) {
        // fast cases
        case 1:
            listener.call(ee);
            break;
        case 2:
            listener.call(ee, args[1]);
            break;
        case 3:
            listener.call(ee, args[1], args[2]);
            break;
            // slower
        default:
            listener.apply(ee, slice.call(args, 1));
    }
}

function addListener(eventEmitter, type, listener, prepend) {
    checkListener(listener);

    var events = eventEmitter.$e || (eventEmitter.$e = {});

    var listeners = events[type];
    if (listeners) {
        if (isFunction(listeners)) {
            events[type] = prepend ? [listener, listeners] : [listeners, listener];
        } else {
            if (prepend) {
                listeners.unshift(listener);
            } else {
                listeners.push(listener);
            }
        }

    } else {
        events[type] = listener;
    }
    return eventEmitter;
}

function EventEmitter() {
    this.$e = this.$e || {};
}

EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype = {
    $e: null,

    emit: function(type) {
        var args = arguments;

        var events = this.$e;
        if (!events) {
            return;
        }

        var listeners = events && events[type];
        if (!listeners) {
            // If there is no 'error' event listener then throw.
            if (type === 'error') {
                var error = args[1];
                if (!(error instanceof Error)) {
                    var context = error;
                    error = new Error('Error: ' + context);
                    error.context = context;
                }

                throw error; // Unhandled 'error' event
            }

            return false;
        }

        if (isFunction(listeners)) {
            invokeListener(this, listeners, args);
        } else {
            listeners = slice.call(listeners);

            for (var i=0, len=listeners.length; i<len; i++) {
                var listener = listeners[i];
                invokeListener(this, listener, args);
            }
        }

        return true;
    },

    on: function(type, listener) {
        return addListener(this, type, listener, false);
    },

    prependListener: function(type, listener) {
        return addListener(this, type, listener, true);
    },

    once: function(type, listener) {
        checkListener(listener);

        function g() {
            this.removeListener(type, g);

            if (listener) {
                listener.apply(this, arguments);
                listener = null;
            }
        }

        this.on(type, g);

        return this;
    },

    // emits a 'removeListener' event iff the listener was removed
    removeListener: function(type, listener) {
        checkListener(listener);

        var events = this.$e;
        var listeners;

        if (events && (listeners = events[type])) {
            if (isFunction(listeners)) {
                if (listeners === listener) {
                    delete events[type];
                }
            } else {
                for (var i=listeners.length-1; i>=0; i--) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                    }
                }
            }
        }

        return this;
    },

    removeAllListeners: function(type) {
        var events = this.$e;
        if (events) {
            delete events[type];
        }
    },

    listenerCount: function(type) {
        var events = this.$e;
        var listeners = events && events[type];
        return listeners ? (isFunction(listeners) ? 1 : listeners.length) : 0;
    }
};

module.exports = EventEmitter;

/***/ }),

/***/ "./node_modules/listener-tracker/lib/listener-tracker.js":
/*!***************************************************************!*\
  !*** ./node_modules/listener-tracker/lib/listener-tracker.js ***!
  \***************************************************************/
/***/ ((module, exports) => {

var INDEX_EVENT = 0;
var INDEX_USER_LISTENER = 1;
var INDEX_WRAPPED_LISTENER = 2;
var DESTROY = "destroy";

function isNonEventEmitter(target) {
  return !target.once;
}

function EventEmitterWrapper(target) {
    this.$__target = target;
    this.$__listeners = [];
    this.$__subscribeTo = null;
}

EventEmitterWrapper.prototype = {
    $__remove: function(test, testWrapped) {
        var target = this.$__target;
        var listeners = this.$__listeners;

        this.$__listeners = listeners.filter(function(curListener) {
            var curEvent = curListener[INDEX_EVENT];
            var curListenerFunc = curListener[INDEX_USER_LISTENER];
            var curWrappedListenerFunc = curListener[INDEX_WRAPPED_LISTENER];

            if (testWrapped) {
                // If the user used `once` to attach an event listener then we had to
                // wrap their listener function with a new function that does some extra
                // cleanup to avoid a memory leak. If the `testWrapped` flag is set to true
                // then we are attempting to remove based on a function that we had to
                // wrap (not the user listener function)
                if (curWrappedListenerFunc && test(curEvent, curWrappedListenerFunc)) {
                    target.removeListener(curEvent, curWrappedListenerFunc);

                    return false;
                }
            } else if (test(curEvent, curListenerFunc)) {
                // If the listener function was wrapped due to it being a `once` listener
                // then we should remove from the target EventEmitter using wrapped
                // listener function. Otherwise, we remove the listener using the user-provided
                // listener function.
                target.removeListener(curEvent, curWrappedListenerFunc || curListenerFunc);

                return false;
            }

            return true;
        });

        // Fixes https://github.com/raptorjs/listener-tracker/issues/2
        // If all of the listeners stored with a wrapped EventEmitter
        // have been removed then we should unregister the wrapped
        // EventEmitter in the parent SubscriptionTracker
        var subscribeTo = this.$__subscribeTo;

        if (!this.$__listeners.length && subscribeTo) {
            var self = this;
            var subscribeToList = subscribeTo.$__subscribeToList;
            subscribeTo.$__subscribeToList = subscribeToList.filter(function(cur) {
                return cur !== self;
            });
        }
    },

    on: function(event, listener) {
        this.$__target.on(event, listener);
        this.$__listeners.push([event, listener]);
        return this;
    },

    once: function(event, listener) {
        var self = this;

        // Handling a `once` event listener is a little tricky since we need to also
        // do our own cleanup if the `once` event is emitted. Therefore, we need
        // to wrap the user's listener function with our own listener function.
        var wrappedListener = function() {
            self.$__remove(function(event, listenerFunc) {
                return wrappedListener === listenerFunc;
            }, true /* We are removing the wrapped listener */);

            listener.apply(this, arguments);
        };

        this.$__target.once(event, wrappedListener);
        this.$__listeners.push([event, listener, wrappedListener]);
        return this;
    },

    removeListener: function(event, listener) {
        if (typeof event === 'function') {
            listener = event;
            event = null;
        }

        if (listener && event) {
            this.$__remove(function(curEvent, curListener) {
                return event === curEvent && listener === curListener;
            });
        } else if (listener) {
            this.$__remove(function(curEvent, curListener) {
                return listener === curListener;
            });
        } else if (event) {
            this.removeAllListeners(event);
        }

        return this;
    },

    removeAllListeners: function(event) {

        var listeners = this.$__listeners;
        var target = this.$__target;

        if (event) {
            this.$__remove(function(curEvent, curListener) {
                return event === curEvent;
            });
        } else {
            for (var i = listeners.length - 1; i >= 0; i--) {
                var cur = listeners[i];
                target.removeListener(cur[INDEX_EVENT], cur[INDEX_USER_LISTENER]);
            }
            this.$__listeners.length = 0;
        }

        return this;
    }
};

function EventEmitterAdapter(target) {
    this.$__target = target;
}

EventEmitterAdapter.prototype = {
    on: function(event, listener) {
        this.$__target.addEventListener(event, listener);
        return this;
    },

    once: function(event, listener) {
        var self = this;

        // need to save this so we can remove it below
        var onceListener = function() {
          self.$__target.removeEventListener(event, onceListener);
          listener();
        };
        this.$__target.addEventListener(event, onceListener);
        return this;
    },

    removeListener: function(event, listener) {
        this.$__target.removeEventListener(event, listener);
        return this;
    }
};

function SubscriptionTracker() {
    this.$__subscribeToList = [];
}

SubscriptionTracker.prototype = {

    subscribeTo: function(target, options) {
        var addDestroyListener = !options || options.addDestroyListener !== false;
        var wrapper;
        var nonEE;
        var subscribeToList = this.$__subscribeToList;

        for (var i=0, len=subscribeToList.length; i<len; i++) {
            var cur = subscribeToList[i];
            if (cur.$__target === target) {
                wrapper = cur;
                break;
            }
        }

        if (!wrapper) {
            if (isNonEventEmitter(target)) {
              nonEE = new EventEmitterAdapter(target);
            }

            wrapper = new EventEmitterWrapper(nonEE || target);
            if (addDestroyListener && !nonEE) {
                wrapper.once(DESTROY, function() {
                    wrapper.removeAllListeners();

                    for (var i = subscribeToList.length - 1; i >= 0; i--) {
                        if (subscribeToList[i].$__target === target) {
                            subscribeToList.splice(i, 1);
                            break;
                        }
                    }
                });
            }

            // Store a reference to the parent SubscriptionTracker so that we can do cleanup
            // if the EventEmitterWrapper instance becomes empty (i.e., no active listeners)
            wrapper.$__subscribeTo = this;
            subscribeToList.push(wrapper);
        }

        return wrapper;
    },

    removeAllListeners: function(target, event) {
        var subscribeToList = this.$__subscribeToList;
        var i;

        if (target) {
            for (i = subscribeToList.length - 1; i >= 0; i--) {
                var cur = subscribeToList[i];
                if (cur.$__target === target) {
                    cur.removeAllListeners(event);

                    if (!cur.$__listeners.length) {
                        // Do some cleanup if we removed all
                        // listeners for the target event emitter
                        subscribeToList.splice(i, 1);
                    }

                    break;
                }
            }
        } else {
            for (i = subscribeToList.length - 1; i >= 0; i--) {
                subscribeToList[i].removeAllListeners();
            }
            subscribeToList.length = 0;
        }
    }
};

exports = module.exports = SubscriptionTracker;

exports.wrap = function(targetEventEmitter) {
    var nonEE;
    var wrapper;

    if (isNonEventEmitter(targetEventEmitter)) {
      nonEE = new EventEmitterAdapter(targetEventEmitter);
    }

    wrapper = new EventEmitterWrapper(nonEE || targetEventEmitter);
    if (!nonEE) {
      // we don't set this for non EE types
      targetEventEmitter.once(DESTROY, function() {
          wrapper.$__listeners.length = 0;
      });
    }

    return wrapper;
};

exports.createTracker = function() {
    return new SubscriptionTracker();
};


/***/ }),

/***/ "./ui/marko/components/left-menu/index.marko":
/*!***************************************************!*\
  !*** ./ui/marko/components/left-menu/index.marko ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marko/src/runtime/vdom/index.js */ "./node_modules/marko/src/runtime/vdom/index.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! marko/src/runtime/components/renderer.js */ "./node_modules/marko/src/runtime/components/renderer.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! marko/src/runtime/components/registry.js */ "./node_modules/marko/src/runtime/components/registry.js");
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! marko/src/runtime/components/defineComponent.js */ "./node_modules/marko/src/runtime/components/defineComponent.js");
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_3__);
// Compiled using marko@5.33.14 - DO NOT EDIT

const _marko_componentType = "ui\\marko\\components\\left-menu\\index.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);


(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_2__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {
  onCreate() {
    this.state = {
      menu_item: [],
      menu_link: []
    };
  },
  onInput(input) {
    this.state.menu_item = input.params;
    console.log(input);
  },
  onMount() {
    let listGroup = document.querySelector(".list-group");
    let aList = listGroup.querySelectorAll('a');
    this.state.menu_link = aList;
  },
  menuButtonClick(element) {
    let target = element.target.id;
    this.state.menu_link.forEach(el => {
      if (el.id === target) {
        el.classList.add("active");
        el.ariaCurrent = "true";
      } else {
        el.classList.remove("active");
        el.removeAttribute("aria-current");
      }
    });
    this.emit('changedHomePage', target);
  }
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_1___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", {
    "id": "left-menu"
  }, "0", _component, null, 1);
  out.be("div", {
    "class": "list-group"
  }, "1", _component, null, 1);
  {
    let _index = 0;
    const array = state.menu_item;
    for (const el of array) {
      let index = _index++;
      const _keyScope = `[${index}]`;
      out.be("a", {
        "href": "#",
        "id": el.id + "-button",
        "class": "list-group-item list-group-item-action"
      }, "2" + _keyScope, _component, null, 0, {
        "onclick": _componentDef.d("click", 'menuButtonClick', false)
      });
      out.t(el.name, _component);
      out.ee();
    }
  }
  out.ee();
  out.ee();
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_3___default()(_marko_component, _marko_template._);

/***/ }),

/***/ "./ui/marko/home/components/password.marko":
/*!*************************************************!*\
  !*** ./ui/marko/home/components/password.marko ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marko/src/runtime/vdom/index.js */ "./node_modules/marko/src/runtime/vdom/index.js");
/* harmony import */ var _utility_utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utility/utility.js */ "./utility/utility.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! marko/src/runtime/components/renderer.js */ "./node_modules/marko/src/runtime/components/renderer.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! marko/src/runtime/components/registry.js */ "./node_modules/marko/src/runtime/components/registry.js");
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! marko/src/runtime/components/defineComponent.js */ "./node_modules/marko/src/runtime/components/defineComponent.js");
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4__);
// Compiled using marko@5.33.14 - DO NOT EDIT

const _marko_componentType = "ui\\marko\\home\\components\\password.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);



(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {
  onCreate() {
    this.state = {};
  },
  onMount() {},
  async onSave(event) {
    event.preventDefault();
    let old_pass = document.getElementById("old-pass").value;
    let new_pass = document.getElementById("new-pass").value;
    let confirm_pass = document.getElementById("confirm-pass").value;
    if (old_pass === new_pass) {
      alert('Attenzione! La vecchia e la nuova password non possono essere uguali.');
      return;
    }
    if (new_pass != confirm_pass) {
      alert('Attenzione! La nuova password non corrisponde.');
      return;
    }
    let options = {
      url: '/users/' + Store.state.user + '/isPasswordCorrect',
      method: 'GET',
      params: {
        old_pass: old_pass
      }
    };
    let response = await _utility_utility_js__WEBPACK_IMPORTED_MODULE_1__["default"].makeRequest(options);
    if (!response.data.check) {
      alert('Attenzione! La vecchia password non corrisponde. Controllarla e riprovare');
      return;
    }
    options = {
      url: '/users/' + Store.state.user + '/editPassword',
      method: 'POST',
      params: {
        new_pass: new_pass
      }
    };
    response = await _utility_utility_js__WEBPACK_IMPORTED_MODULE_1__["default"].makeRequest(options);
    if (500 === response.status) {
      alert('Errore durante il cambio della password.');
      return;
    }
    alert('OK');
    Store.NewState(showHome());
  }
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", null, "0", _component, null, 0);
  out.be("form", {
    "action": "/v1.0/app/passwordChange",
    "method": "post"
  }, "1", _component, null, 0);
  out.be("div", {
    "class": "password-change-form"
  }, "2", _component, null, 1);
  out.be("div", {
    "class": "new-password"
  }, "3", _component, null, 1);
  out.be("label", {
    "for": "old-pass"
  }, "4", _component, null, 0);
  out.t("Vecchia Password:", _component);
  out.ee();
  out.e("input", {
    "id": "old-pass",
    "type": "password",
    "name": "old-pass",
    "autocomplete": "current-password",
    "class": "form-control input-sm chat-input",
    "placeholder": "Vecchia password",
    "required": "",
    "autofocus": ""
  }, "5", _component, 0, 0);
  out.ee();
  out.be("div", {
    "class": "new-password"
  }, "6", _component, null, 1);
  out.be("label", {
    "for": "new-pass"
  }, "7", _component, null, 0);
  out.t("Nuova Password:", _component);
  out.ee();
  out.e("input", {
    "id": "new-pass",
    "type": "password",
    "name": "new-pass",
    "class": "form-control input-sm chat-input",
    "placeholder": "Nuova password",
    "required": ""
  }, "8", _component, 0, 0);
  out.ee();
  out.be("div", {
    "class": "new-password"
  }, "9", _component, null, 1);
  out.be("label", {
    "for": "confirm-pass"
  }, "10", _component, null, 0);
  out.t("Conferma Nuova Password:", _component);
  out.ee();
  out.e("input", {
    "id": "confirm-pass",
    "type": "password",
    "name": "confirm-pass",
    "class": "form-control input-sm chat-input",
    "placeholder": "Conferma Nuova Password",
    "required": ""
  }, "11", _component, 0, 0);
  out.ee();
  out.be("div", {
    "class": "button-wrapper-pass"
  }, "12", _component, null, 1);
  out.e("input", {
    "type": "submit",
    "name": "Salva",
    "class": "btn btn-success",
    "value": "Salva"
  }, "13", _component, 0, 0, {
    "onclick": _componentDef.d("click", "onSave", false)
  });
  out.ee();
  out.ee();
  out.ee();
  out.ee();
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4___default()(_marko_component, _marko_template._);

/***/ }),

/***/ "./ui/marko/home/home.marko":
/*!**********************************!*\
  !*** ./ui/marko/home/home.marko ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marko/src/runtime/vdom/index.js */ "./node_modules/marko/src/runtime/vdom/index.js");
/* harmony import */ var _components_left_menu_index_marko__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/left-menu/index.marko */ "./ui/marko/components/left-menu/index.marko");
/* harmony import */ var marko_src_runtime_helpers_render_tag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! marko/src/runtime/helpers/render-tag.js */ "./node_modules/marko/src/runtime/helpers/render-tag.js");
/* harmony import */ var marko_src_runtime_helpers_render_tag_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_helpers_render_tag_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! marko/src/runtime/components/renderer.js */ "./node_modules/marko/src/runtime/components/renderer.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! marko/src/runtime/components/registry.js */ "./node_modules/marko/src/runtime/components/registry.js");
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! marko/src/runtime/components/defineComponent.js */ "./node_modules/marko/src/runtime/components/defineComponent.js");
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_5__);
// Compiled using marko@5.33.14 - DO NOT EDIT

const _marko_componentType = "ui\\marko\\home\\home.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);




(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_4__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {
  onCreate() {
    this.state = {
      menu_item: [{
        id: 'password',
        name: 'Cambio Password'
      }, {
        id: 'anagrafica',
        name: 'Dati Anagrafici'
      }],
      menu_link: []
    };
  },
  onMount() {
    let listGroup = document.querySelector(".list-group");
    let aList = listGroup.querySelectorAll('a');
    this.state.menu_link = aList;
  },
  changedHomePage(target) {
    let output = document.getElementById('home-content');
    Store.NewState(updateHomeContent(target, output));
  }
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_3___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", {
    "class": "home-container"
  }, "0", _component, null, 1);
  marko_src_runtime_helpers_render_tag_js__WEBPACK_IMPORTED_MODULE_2___default()(_components_left_menu_index_marko__WEBPACK_IMPORTED_MODULE_1__["default"], {
    "params": state.menu_item
  }, out, _componentDef, "1", [["changedHomePage", 'changedHomePage', false]]);
  out.t(" ", _component);
  out.be("div", {
    "id": "home-content"
  }, "2", _component, null, 1);
  out.be("p", null, "3", _component, null, 0);
  out.t("Benvenuti sul sito di gestione prenotazioni del servizio sanitario nazionale.", _component);
  out.ee();
  out.be("p", null, "4", _component, null, 0);
  out.t("Da questa pagina potete raggiungere le pagine per la gestione del vostro account.", _component);
  out.ee();
  out.ee();
  out.ee();
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_5___default()(_marko_component, _marko_template._);

/***/ }),

/***/ "./node_modules/marko/src/node_modules/@internal/components-beginComponent/index-browser.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/marko/src/node_modules/@internal/components-beginComponent/index-browser.js ***!
  \**************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ComponentDef = __webpack_require__(/*! ../../../runtime/components/ComponentDef */ "./node_modules/marko/src/runtime/components/ComponentDef.js");

module.exports = function beginComponent(
  componentsContext,
  component,
  key,
  ownerComponentDef
) {
  var componentId = component.id;
  var componentDef = (componentsContext.___componentDef = new ComponentDef(
    component,
    componentId,
    componentsContext
  ));
  componentsContext.___globalContext.___renderedComponentsById[
    componentId
  ] = true;
  componentsContext.___components.push(componentDef);

  var out = componentsContext.___out;
  out.bc(component, key, ownerComponentDef && ownerComponentDef.___component);
  return componentDef;
};


/***/ }),

/***/ "./node_modules/marko/src/node_modules/@internal/components-endComponent/index-browser.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/marko/src/node_modules/@internal/components-endComponent/index-browser.js ***!
  \************************************************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function endComponent(out) {
  out.ee(); // endElement() (also works for VComponent nodes pushed on to the stack)
};


/***/ }),

/***/ "./node_modules/marko/src/node_modules/@internal/components-registry/index-browser.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/marko/src/node_modules/@internal/components-registry/index-browser.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var complain =  true && __webpack_require__(/*! complain */ "./node_modules/complain/index.js");
var setImmediate = (__webpack_require__(/*! @internal/set-immediate */ "./node_modules/marko/src/node_modules/@internal/set-immediate/index-browser.js").___setImmediate);
var warp10Finalize = __webpack_require__(/*! warp10/finalize */ "./node_modules/warp10/finalize.js");
var defineComponent = __webpack_require__(/*! ../../../runtime/components/defineComponent */ "./node_modules/marko/src/runtime/components/defineComponent.js");
var eventDelegation = __webpack_require__(/*! ../../../runtime/components/event-delegation */ "./node_modules/marko/src/runtime/components/event-delegation.js");
var createFragmentNode =
  (__webpack_require__(/*! ../../../runtime/vdom/morphdom/fragment */ "./node_modules/marko/src/runtime/vdom/morphdom/fragment.js").___createFragmentNode);
var ComponentDef = __webpack_require__(/*! ../../../runtime/components/ComponentDef */ "./node_modules/marko/src/runtime/components/ComponentDef.js");
var domData = __webpack_require__(/*! ../../../runtime/components/dom-data */ "./node_modules/marko/src/runtime/components/dom-data.js");
var componentsUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var req = __webpack_require__(/*! @internal/require */ "./node_modules/marko/src/node_modules/@internal/require/index-webpack.js");
var componentLookup = componentsUtil.___componentLookup;
var addComponentRootToKeyedElements =
  componentsUtil.___addComponentRootToKeyedElements;
var keyedElementsByComponentId = domData.___ssrKeyedElementsByComponentId;
var componentsByDOMNode = domData.___componentByDOMNode;
var serverComponentRootNodes = {};
var serverRenderedMeta = {};
var win = window;

var DEFAULT_RUNTIME_ID = "M";
var FLAG_WILL_RERENDER_IN_BROWSER = 1;
// var FLAG_HAS_RENDER_BODY = 2;

var registered = {};
var loaded = {};
var componentTypes = {};
var deferredDefs;
var pendingDefs;

function register(type, def) {
  var pendingForType;
  if (pendingDefs) {
    pendingForType = pendingDefs[type];
  }
  registered[type] = def;
  delete loaded[type];
  delete componentTypes[type];

  if (pendingForType) {
    delete pendingDefs[type];
    setImmediate(function () {
      pendingForType.forEach(function (args) {
        tryHydrateComponent(args[0], args[1], args[2], args[3])();
      });
    });
  }

  return type;
}

function addPendingDef(def, type, meta, host, runtimeId) {
  if (!pendingDefs) {
    pendingDefs = {};

    // eslint-disable-next-line no-constant-condition
    if (true) {
      document.addEventListener("load", function () {
        var pendingComponentIds = Object.keys(pendingDefs);
        if (pendingComponentIds.length) {
          complain(
            "Marko templates were never loaded for: " + pendingComponentIds
          );
        }
      });
    }
  }
  (pendingDefs[type] = pendingDefs[type] || []).push([
    def,
    meta,
    host,
    runtimeId,
  ]);
}

function load(typeName, isLegacy) {
  var target = loaded[typeName];
  if (!target) {
    target = registered[typeName];

    if (target) {
      target = target();
    } else if (isLegacy) {
      target = exports.___legacy.load(typeName);
    } else {
      target = req(typeName);
      // eslint-disable-next-line no-constant-condition
      if (true) {
        complain(
          "Looks like you used `require:` in your browser.json to load a component.  This requires that Marko has knowledge of how lasso generates paths and will be removed in a future version.  `marko-dependencies:/path/to/template.marko` should be used instead."
        );
      }
    }

    if (!target) {
      throw Error("Component not found: " + typeName);
    }

    loaded[typeName] = target;
  }

  return target;
}

function getComponentClass(typeName, isLegacy) {
  var ComponentClass = componentTypes[typeName];

  if (ComponentClass) {
    return ComponentClass;
  }

  ComponentClass = load(typeName, isLegacy);

  ComponentClass = ComponentClass.Component || ComponentClass;

  if (!ComponentClass.___isComponent) {
    ComponentClass = defineComponent(ComponentClass, ComponentClass.renderer);
  }

  // Make the component "type" accessible on each component instance
  ComponentClass.prototype.___type = typeName;

  // eslint-disable-next-line no-constant-condition
  if (true) {
    var classNameMatch =
      /\/([^/]+?)(?:\/index|\/template|)(?:\.marko|\.component(?:-browser)?|)$/.exec(
        typeName
      );
    var className = classNameMatch ? classNameMatch[1] : "AnonymousComponent";
    className = className.replace(/-(.)/g, function (g) {
      return g[1].toUpperCase();
    });
    className = className
      .replace(/\$\d+\.\d+\.\d+$/, "")
      .replace(/^[^a-z$_]/i, "_$&")
      .replace(/[^0-9a-z$_]+/gi, "_");
    className = className[0].toUpperCase() + className.slice(1);
    // eslint-disable-next-line no-unused-vars
    var OldComponentClass = ComponentClass;
    ComponentClass = {
      [className]: function (id, doc) {
        OldComponentClass.call(this, id, doc);
      },
    }[className];
    ComponentClass.prototype = OldComponentClass.prototype;
  }

  componentTypes[typeName] = ComponentClass;

  return ComponentClass;
}

function createComponent(typeName, id, isLegacy) {
  var ComponentClass = getComponentClass(typeName, isLegacy);
  return new ComponentClass(id);
}

function indexServerComponentBoundaries(node, runtimeId, stack) {
  var componentId;
  var ownerId;
  var ownerComponent;
  var keyedElements;
  var nextSibling;
  var runtimeLength = runtimeId.length;
  stack = stack || [];

  node = node.firstChild;
  while (node) {
    nextSibling = node.nextSibling;
    if (node.nodeType === 8) {
      // Comment node
      var commentValue = node.nodeValue;
      if (commentValue.slice(0, runtimeLength) === runtimeId) {
        var firstChar = commentValue[runtimeLength];

        if (firstChar === "^" || firstChar === "#") {
          stack.push(node);
        } else if (firstChar === "/") {
          var endNode = node;
          var startNode = stack.pop();
          var rootNode;

          if (startNode.parentNode === endNode.parentNode) {
            rootNode = createFragmentNode(startNode.nextSibling, endNode);
          } else {
            rootNode = createFragmentNode(
              endNode.parentNode.firstChild,
              endNode
            );
          }

          componentId = startNode.nodeValue.substring(runtimeLength + 1);
          firstChar = startNode.nodeValue[runtimeLength];

          if (firstChar === "^") {
            var parts = componentId.split(/ /g);
            var key = parts[2];
            ownerId = parts[1];
            componentId = parts[0];
            if ((ownerComponent = componentLookup[ownerId])) {
              keyedElements = ownerComponent.___keyedElements;
            } else {
              keyedElements =
                keyedElementsByComponentId[ownerId] ||
                (keyedElementsByComponentId[ownerId] = {});
            }
            addComponentRootToKeyedElements(
              keyedElements,
              key,
              rootNode,
              componentId
            );
          }

          serverComponentRootNodes[componentId] = rootNode;

          startNode.parentNode.removeChild(startNode);
          endNode.parentNode.removeChild(endNode);
        }
      }
    } else if (node.nodeType === 1) {
      // HTML element node
      var markoKey = node.getAttribute("data-marko-key");
      var markoProps = componentsUtil.___getMarkoPropsFromEl(node);
      if (markoKey) {
        var separatorIndex = markoKey.indexOf(" ");
        ownerId = markoKey.substring(separatorIndex + 1);
        markoKey = markoKey.substring(0, separatorIndex);
        if ((ownerComponent = componentLookup[ownerId])) {
          keyedElements = ownerComponent.___keyedElements;
        } else {
          keyedElements =
            keyedElementsByComponentId[ownerId] ||
            (keyedElementsByComponentId[ownerId] = {});
        }
        keyedElements[markoKey] = node;
      }
      if (markoProps) {
        Object.keys(markoProps).forEach(function (key) {
          if (key.slice(0, 2) === "on") {
            eventDelegation.___addDelegatedEventHandler(key.slice(2));
          }
        });
      }
      indexServerComponentBoundaries(node, runtimeId, stack);
    }

    node = nextSibling;
  }
}

function invokeComponentEventHandler(component, targetMethodName, args) {
  var method = component[targetMethodName];
  if (!method) {
    throw Error("Method not found: " + targetMethodName);
  }

  method.apply(component, args);
}

function addEventListenerHelper(el, eventType, isOnce, listener) {
  var eventListener = listener;
  if (isOnce) {
    eventListener = function (event) {
      listener(event);
      el.removeEventListener(eventType, eventListener);
    };
  }

  el.addEventListener(eventType, eventListener, false);

  return function remove() {
    el.removeEventListener(eventType, eventListener);
  };
}

function addDOMEventListeners(
  component,
  el,
  eventType,
  targetMethodName,
  isOnce,
  extraArgs,
  handles
) {
  var removeListener = addEventListenerHelper(
    el,
    eventType,
    isOnce,
    function (event) {
      var args = [event, el];
      if (extraArgs) {
        args = extraArgs.concat(args);
      }

      invokeComponentEventHandler(component, targetMethodName, args);
    }
  );
  handles.push(removeListener);
}

function initComponent(componentDef, host) {
  var component = componentDef.___component;

  if (!component || !component.___isComponent) {
    return; // legacy
  }

  component.___reset();
  component.___host = host;

  var isExisting = componentDef.___isExisting;

  if (isExisting) {
    component.___removeDOMEventListeners();
  }

  var domEvents = componentDef.___domEvents;
  if (domEvents) {
    var eventListenerHandles = [];

    domEvents.forEach(function (domEventArgs) {
      // The event mapping is for a direct DOM event (not a custom event and not for bubblign dom events)

      var eventType = domEventArgs[0];
      var targetMethodName = domEventArgs[1];
      var eventEl = component.___keyedElements[domEventArgs[2]];
      var isOnce = domEventArgs[3];
      var extraArgs = domEventArgs[4];

      addDOMEventListeners(
        component,
        eventEl,
        eventType,
        targetMethodName,
        isOnce,
        extraArgs,
        eventListenerHandles
      );
    });

    if (eventListenerHandles.length) {
      component.___domEventListenerHandles = eventListenerHandles;
    }
  }

  if (component.___mounted) {
    component.___emitUpdate();
  } else {
    component.___mounted = true;
    component.___emitMount();
  }
}

/**
 * This method is used to initialized components associated with UI components
 * rendered in the browser. While rendering UI components a "components context"
 * is added to the rendering context to keep up with which components are rendered.
 * When ready, the components can then be initialized by walking the component tree
 * in the components context (nested components are initialized before ancestor components).
 * @param  {Array<marko-components/lib/ComponentDef>} componentDefs An array of ComponentDef instances
 */
function initClientRendered(componentDefs, host) {
  if (!host) host = document;
  // Ensure that event handlers to handle delegating events are
  // always attached before initializing any components
  eventDelegation.___init(host);
  var len = componentDefs.length;
  var componentDef;
  var i;

  for (i = len; i--; ) {
    componentDef = componentDefs[i];
    trackComponent(componentDef);
  }

  for (i = len; i--; ) {
    componentDef = componentDefs[i];
    initComponent(componentDef, host);
  }
}

/**
 * This method initializes all components that were rendered on the server by iterating over all
 * of the component IDs.
 */
function initServerRendered(renderedComponents, host) {
  var type = typeof renderedComponents;
  var globalKey = "$";
  var runtimeId;

  if (type !== "object") {
    if (type === "string") {
      runtimeId = renderedComponents;
      globalKey += runtimeId + "_C";
    } else {
      globalKey += (runtimeId = DEFAULT_RUNTIME_ID) + "C";
    }

    renderedComponents = win[globalKey];

    // eslint-disable-next-line no-constant-condition
    if (true) {
      if (
        renderedComponents &&
        renderedComponents.i !== undefined &&
        renderedComponents.i !== componentsUtil.___runtimeId
      ) {
        console.warn(
          "Multiple instances of Marko have attached to the same runtime id. This could mean that more than one copy of Marko is loaded on the page, or that the script containing Marko has executed more than once."
        );
      }
    }

    var fakeArray = (win[globalKey] = {
      r: runtimeId,
      concat: initServerRendered,
    });

    // eslint-disable-next-line no-constant-condition
    if (true) {
      fakeArray.i = componentsUtil.___runtimeId;
    }

    if (renderedComponents && renderedComponents.forEach) {
      renderedComponents.forEach(function (renderedComponent) {
        fakeArray.concat(renderedComponent);
      });
    }

    return fakeArray;
  }

  var isFromSerializedGlobals = this.concat === initServerRendered;
  renderedComponents = warp10Finalize(renderedComponents);

  if (isFromSerializedGlobals) {
    runtimeId = this.r;
    host = document;
  } else {
    runtimeId = renderedComponents.r || DEFAULT_RUNTIME_ID;
    if (!host) host = document;

    // eslint-disable-next-line no-constant-condition
    if (true) {
      complain(
        "Passing serialized data to `require('marko/components).init` is deprecated. Instead set '$global.runtimeId' and provide the 'runtimeId' option to your Marko bundler plugin."
      );
    }
  }

  // eslint-disable-next-line no-constant-condition
  if (true) {
    if (host !== document) {
      complain(
        "Passing a document other than the current document to `require('marko/components).init` is deprecated."
      );
    }
  }

  var prefix = renderedComponents.p || "";
  var meta = serverRenderedMeta[prefix];
  var isLast = renderedComponents.l;

  if (meta) {
    if (isLast) {
      delete serverRenderedMeta[prefix];
    }
  } else {
    meta = {};

    if (!isLast) {
      serverRenderedMeta[prefix] = meta;
    }
  }

  // Ensure that event handlers to handle delegating events are
  // always attached before initializing any components
  indexServerComponentBoundaries(host, runtimeId);
  eventDelegation.___init(host);

  if (renderedComponents.g) {
    meta.___globals = renderedComponents.g;
  }

  if (renderedComponents.t) {
    meta.___types = meta.___types
      ? meta.___types.concat(renderedComponents.t)
      : renderedComponents.t;
  }

  // hydrate components top down (leaf nodes last)
  // and return an array of functions to mount these components
  (renderedComponents.w || [])
    .map(function (componentDef) {
      var typeName = meta.___types[componentDef[1]];

      return registered[typeName] ||
        document.readyState === "complete" ||
        req.e(typeName)
        ? tryHydrateComponent(componentDef, meta, host, runtimeId)
        : addPendingDef(componentDef, typeName, meta, host, runtimeId);
    })
    .reverse()
    .forEach(tryInvoke);

  return this;
}

function tryHydrateComponent(rawDef, meta, host, runtimeId) {
  var componentDef = ComponentDef.___deserialize(
    rawDef,
    meta.___types,
    meta.___globals,
    exports
  );
  var mount = hydrateComponentAndGetMount(componentDef, host);

  if (!mount) {
    // hydrateComponentAndGetMount will return false if there is not rootNode
    // for the component.  If this is the case, we'll wait until the
    // DOM has fully loaded to attempt to init the component again.
    if (deferredDefs) {
      deferredDefs.push(componentDef);
    } else {
      deferredDefs = [componentDef];
      document.addEventListener("DOMContentLoaded", function () {
        indexServerComponentBoundaries(host, runtimeId);
        deferredDefs
          .map(function (componentDef) {
            return hydrateComponentAndGetMount(componentDef, host);
          })
          .reverse()
          .forEach(tryInvoke);
        deferredDefs.length = 0;
      });
    }
  }

  return mount;
}

function hydrateComponentAndGetMount(componentDef, host) {
  var componentId = componentDef.id;
  var component = componentDef.___component;
  var rootNode = serverComponentRootNodes[componentId];
  var renderResult;

  if (rootNode) {
    delete serverComponentRootNodes[componentId];

    component.___rootNode = rootNode;
    componentsByDOMNode.set(rootNode, component);

    if (componentDef.___flags & FLAG_WILL_RERENDER_IN_BROWSER) {
      component.___host = host;
      renderResult = component.___rerender(component.___input, true);
      trackComponent(componentDef);
      return function mount() {
        renderResult.afterInsert(host);
      };
    } else {
      trackComponent(componentDef);
    }

    return function mount() {
      initComponent(componentDef, host);
    };
  }
}

function trackComponent(componentDef) {
  var component = componentDef.___component;
  if (component) {
    componentLookup[component.id] = component;
  }
}

function tryInvoke(fn) {
  if (fn) fn();
}

exports.r = register;
exports.___createComponent = createComponent;
exports.___getComponentClass = getComponentClass;
exports.___initServerRendered = win.$initComponents = initServerRendered;

(__webpack_require__(/*! ../../../runtime/components/ComponentsContext */ "./node_modules/marko/src/runtime/components/ComponentsContext.js").___initClientRendered) =
  initClientRendered;


/***/ }),

/***/ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var domData = __webpack_require__(/*! ../../../runtime/components/dom-data */ "./node_modules/marko/src/runtime/components/dom-data.js");
var componentsByDOMNode = domData.___componentByDOMNode;
var keysByDOMNode = domData.___keyByDOMNode;
var vElementsByDOMNode = domData.___vElementByDOMNode;
var vPropsByDOMNode = domData.___vPropsByDOMNode;
var markoUID = window.$MUID || (window.$MUID = { i: 0 });
var runtimeId = markoUID.i++;

var componentLookup = {};

var EMPTY_OBJECT = {};

function getComponentForEl(el, host) {
  var node =
    typeof el == "string"
      ? ((host ? host.ownerDocument : host) || document).getElementById(el)
      : el;
  var component;
  var vElement;

  while (node) {
    if (node.fragment) {
      if (node.fragment.endNode === node) {
        node = node.fragment.startNode;
      } else {
        node = node.fragment;
        component = componentsByDOMNode.get(node);
      }
    } else if ((vElement = vElementsByDOMNode.get(node))) {
      component = vElement.___ownerComponent;
    }

    if (component) {
      return component;
    }

    node = node.previousSibling || node.parentNode;
  }
}

function destroyComponentForNode(node) {
  var componentToDestroy = componentsByDOMNode.get(node.fragment || node);
  if (componentToDestroy) {
    componentToDestroy.___destroyShallow();
    delete componentLookup[componentToDestroy.id];
  }
}
function destroyNodeRecursive(node, component) {
  destroyComponentForNode(node);
  if (node.nodeType === 1 || node.nodeType === 12) {
    var key;

    if (component && (key = keysByDOMNode.get(node))) {
      if (node === component.___keyedElements[key]) {
        if (componentsByDOMNode.get(node) && /\[\]$/.test(key)) {
          delete component.___keyedElements[key][
            componentsByDOMNode.get(node).id
          ];
        } else {
          delete component.___keyedElements[key];
        }
      }
    }

    var curChild = node.firstChild;
    while (curChild && curChild !== node.endNode) {
      destroyNodeRecursive(curChild, component);
      curChild = curChild.nextSibling;
    }
  }
}

function nextComponentId() {
  // Each component will get an ID that is unique across all loaded
  // marko runtimes. This allows multiple instances of marko to be
  // loaded in the same window and they should all place nice
  // together
  return "c" + markoUID.i++;
}

function nextComponentIdProvider() {
  return nextComponentId;
}

function attachBubblingEvent(
  componentDef,
  handlerMethodName,
  isOnce,
  extraArgs
) {
  if (handlerMethodName) {
    var componentId = componentDef.id;
    if (extraArgs) {
      return [handlerMethodName, componentId, isOnce, extraArgs];
    } else {
      return [handlerMethodName, componentId, isOnce];
    }
  }
}

function getMarkoPropsFromEl(el) {
  var vElement = vElementsByDOMNode.get(el);
  var virtualProps;

  if (vElement) {
    virtualProps = vElement.___properties;
  } else {
    virtualProps = vPropsByDOMNode.get(el);
    if (!virtualProps) {
      virtualProps = el.getAttribute("data-marko");
      vPropsByDOMNode.set(
        el,
        (virtualProps = virtualProps ? JSON.parse(virtualProps) : EMPTY_OBJECT)
      );
    }
  }

  return virtualProps;
}

function normalizeComponentKey(key, parentId) {
  if (key[0] === "#") {
    key = key.replace("#" + parentId + "-", "");
  }
  return key;
}

function addComponentRootToKeyedElements(
  keyedElements,
  key,
  rootNode,
  componentId
) {
  if (/\[\]$/.test(key)) {
    var repeatedElementsForKey = (keyedElements[key] =
      keyedElements[key] || {});
    repeatedElementsForKey[componentId] = rootNode;
  } else {
    keyedElements[key] = rootNode;
  }
}

// eslint-disable-next-line no-constant-condition
if (true) {
  var warnNodeRemoved = function (event) {
    var fragment = event.target.fragment;
    if (fragment) {
      var baseError = new Error(
        "Fragment boundary marker removed.  This will cause an error when the fragment is updated."
      );
      fragment.___markersRemovedError = function (message) {
        var error = new Error(message + " Boundary markers missing.");

        baseError.stack = baseError.stack.replace(/.*warnNodeRemoved.*\n/, "");

        // eslint-disable-next-line no-console
        console.warn(baseError);
        return error;
      };
    }
  };
  exports.___startDOMManipulationWarning = function (host) {
    host.addEventListener("DOMNodeRemoved", warnNodeRemoved);
  };
  exports.___stopDOMManipulationWarning = function (host) {
    host.removeEventListener("DOMNodeRemoved", warnNodeRemoved);
  };
}

exports.___runtimeId = runtimeId;
exports.___componentLookup = componentLookup;
exports.___getComponentForEl = getComponentForEl;
exports.___destroyComponentForNode = destroyComponentForNode;
exports.___destroyNodeRecursive = destroyNodeRecursive;
exports.___nextComponentIdProvider = nextComponentIdProvider;
exports.___attachBubblingEvent = attachBubblingEvent;
exports.___getMarkoPropsFromEl = getMarkoPropsFromEl;
exports.___addComponentRootToKeyedElements = addComponentRootToKeyedElements;
exports.___normalizeComponentKey = normalizeComponentKey;


/***/ }),

/***/ "./node_modules/marko/src/node_modules/@internal/require/index-webpack.js":
/*!********************************************************************************!*\
  !*** ./node_modules/marko/src/node_modules/@internal/require/index-webpack.js ***!
  \********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

load.e = exists;
module.exports = load;

function load(id) {
  return interopRequire(__webpack_require__(id));
}

function exists() {
  return false;
}

function interopRequire(mod) {
  return mod.default || mod;
}


/***/ }),

/***/ "./node_modules/marko/src/node_modules/@internal/set-immediate/index-browser.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/marko/src/node_modules/@internal/set-immediate/index-browser.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var queue = [];
var msg = "" + Math.random();
window.addEventListener("message", function (ev) {
  if (ev.data === msg) {
    var callbacks = queue;
    queue = [];
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
  }
});

exports.___setImmediate = function (callback) {
  if (queue.push(callback) === 1) {
    window.postMessage(msg, "*");
  }
};

exports.___queueMicrotask = __webpack_require__(/*! ./queueMicrotask */ "./node_modules/marko/src/node_modules/@internal/set-immediate/queueMicrotask.js");


/***/ }),

/***/ "./node_modules/marko/src/node_modules/@internal/set-immediate/queueMicrotask.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/marko/src/node_modules/@internal/set-immediate/queueMicrotask.js ***!
  \***************************************************************************************/
/***/ ((module) => {

var promise;
module.exports =
  typeof queueMicrotask === "function"
    ? queueMicrotask
    : ((promise = Promise.resolve()),
      function (cb) {
        promise.then(cb);
      });


/***/ }),

/***/ "./node_modules/marko/src/runtime/RenderResult.js":
/*!********************************************************!*\
  !*** ./node_modules/marko/src/runtime/RenderResult.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var domInsert = __webpack_require__(/*! ./dom-insert */ "./node_modules/marko/src/runtime/dom-insert.js");
var complain =  true && __webpack_require__(/*! complain */ "./node_modules/complain/index.js");

function getRootNode(el) {
  var cur = el;
  while (cur.parentNode) cur = cur.parentNode;
  return cur;
}

function getComponentDefs(result) {
  var componentDefs = result.___components;

  if (!componentDefs) {
    throw Error("No component");
  }
  return componentDefs;
}

function RenderResult(out) {
  this.out = this.___out = out;
  this.___components = undefined;
}

module.exports = RenderResult;

var proto = (RenderResult.prototype = {
  getComponent: function () {
    return this.getComponents()[0];
  },
  getComponents: function (selector) {
    if (this.___components === undefined) {
      throw Error("Not added to DOM");
    }

    var componentDefs = getComponentDefs(this);

    var components = [];

    componentDefs.forEach(function (componentDef) {
      var component = componentDef.___component;
      if (!selector || selector(component)) {
        components.push(component);
      }
    });

    return components;
  },

  afterInsert: function (host) {
    var out = this.___out;
    var componentsContext = out.___components;
    if (componentsContext) {
      this.___components = componentsContext.___initComponents(host);
    } else {
      this.___components = null;
    }

    return this;
  },
  getNode: function (host) {
    return this.___out.___getNode(host);
  },
  getOutput: function () {
    return this.___out.___getOutput();
  },
  toString: function () {
    return this.___out.toString();
  },
  document: typeof document === "object" && document,
});

Object.defineProperty(proto, "html", {
  get: function () {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      complain(
        'The "html" property is deprecated. Please use "toString" instead.',
      );
    }
    return this.toString();
  },
});

Object.defineProperty(proto, "context", {
  get: function () {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      complain(
        'The "context" property is deprecated. Please use "out" instead.',
      );
    }
    return this.___out;
  },
});

// Add all of the following DOM methods to Component.prototype:
// - appendTo(referenceEl)
// - replace(referenceEl)
// - replaceChildrenOf(referenceEl)
// - insertBefore(referenceEl)
// - insertAfter(referenceEl)
// - prependTo(referenceEl)
domInsert(
  proto,
  function getEl(renderResult, referenceEl) {
    return renderResult.getNode(getRootNode(referenceEl));
  },
  function afterInsert(renderResult, referenceEl) {
    return renderResult.afterInsert(getRootNode(referenceEl));
  },
);


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/Component.js":
/*!****************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/Component.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* jshint newcap:false */

var complain =  true && __webpack_require__(/*! complain */ "./node_modules/complain/index.js");
var EventEmitter = __webpack_require__(/*! events-light */ "./node_modules/events-light/src/index.js");
var SubscriptionTracker = __webpack_require__(/*! listener-tracker */ "./node_modules/listener-tracker/lib/listener-tracker.js");
var inherit = __webpack_require__(/*! raptor-util/inherit */ "./node_modules/raptor-util/inherit.js");
var componentsUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var componentLookup = componentsUtil.___componentLookup;
var destroyNodeRecursive = componentsUtil.___destroyNodeRecursive;
var defaultCreateOut = __webpack_require__(/*! ../createOut */ "./node_modules/marko/src/runtime/createOut.js");
var domInsert = __webpack_require__(/*! ../dom-insert */ "./node_modules/marko/src/runtime/dom-insert.js");
var RenderResult = __webpack_require__(/*! ../RenderResult */ "./node_modules/marko/src/runtime/RenderResult.js");
var morphdom = __webpack_require__(/*! ../vdom/morphdom */ "./node_modules/marko/src/runtime/vdom/morphdom/index.js");
var getComponentsContext =
  (__webpack_require__(/*! ./ComponentsContext */ "./node_modules/marko/src/runtime/components/ComponentsContext.js").___getComponentsContext);
var domData = __webpack_require__(/*! ./dom-data */ "./node_modules/marko/src/runtime/components/dom-data.js");
var eventDelegation = __webpack_require__(/*! ./event-delegation */ "./node_modules/marko/src/runtime/components/event-delegation.js");
var updateManager = __webpack_require__(/*! ./update-manager */ "./node_modules/marko/src/runtime/components/update-manager.js");
var componentsByDOMNode = domData.___componentByDOMNode;
var keyedElementsByComponentId = domData.___ssrKeyedElementsByComponentId;
var CONTEXT_KEY = "__subtree_context__";

var hasOwnProperty = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

var COMPONENT_SUBSCRIBE_TO_OPTIONS;
var NON_COMPONENT_SUBSCRIBE_TO_OPTIONS = {
  addDestroyListener: false,
};

var emit = EventEmitter.prototype.emit;
var ELEMENT_NODE = 1;

function removeListener(removeEventListenerHandle) {
  removeEventListenerHandle();
}

function walkFragments(fragment) {
  var node;

  while (fragment) {
    node = fragment.firstChild;

    if (!node) {
      break;
    }

    fragment = node.fragment;
  }

  return node;
}

function handleCustomEventWithMethodListener(
  component,
  targetMethodName,
  args,
  extraArgs,
) {
  // Remove the "eventType" argument
  args.push(component);

  if (extraArgs) {
    args = extraArgs.concat(args);
  }

  var targetComponent = componentLookup[component.___scope];
  var targetMethod =
    typeof targetMethodName === "function"
      ? targetMethodName
      : targetComponent[targetMethodName];
  if (!targetMethod) {
    throw Error("Method not found: " + targetMethodName);
  }

  targetMethod.apply(targetComponent, args);
}

function resolveKeyHelper(key, index) {
  return index ? key + "_" + index : key;
}

function resolveComponentIdHelper(component, key, index) {
  return component.id + "-" + resolveKeyHelper(key, index);
}

/**
 * This method is used to process "update_<stateName>" handler functions.
 * If all of the modified state properties have a user provided update handler
 * then a rerender will be bypassed and, instead, the DOM will be updated
 * looping over and invoking the custom update handlers.
 * @return {boolean} Returns true if if the DOM was updated. False, otherwise.
 */
function processUpdateHandlers(component, stateChanges, oldState) {
  var handlerMethod;
  var handlers;

  for (var propName in stateChanges) {
    if (hasOwnProperty.call(stateChanges, propName)) {
      var handlerMethodName = "update_" + propName;

      handlerMethod = component[handlerMethodName];
      if (handlerMethod) {
        (handlers || (handlers = [])).push([propName, handlerMethod]);
      } else {
        // This state change does not have a state handler so return false
        // to force a rerender
        return;
      }
    }
  }

  // If we got here then all of the changed state properties have
  // an update handler or there are no state properties that actually
  // changed.
  if (handlers) {
    // Otherwise, there are handlers for all of the changed properties
    // so apply the updates using those handlers

    handlers.forEach(function (handler) {
      var propertyName = handler[0];
      handlerMethod = handler[1];

      var newValue = stateChanges[propertyName];
      var oldValue = oldState[propertyName];
      handlerMethod.call(component, newValue, oldValue);
    });

    component.___emitUpdate();
    component.___reset();
  }

  return true;
}

function checkInputChanged(existingComponent, oldInput, newInput) {
  if (oldInput != newInput) {
    if (oldInput == null || newInput == null) {
      return true;
    }

    var oldKeys = Object.keys(oldInput);
    var newKeys = Object.keys(newInput);
    var len = oldKeys.length;
    if (len !== newKeys.length) {
      return true;
    }

    for (var i = len; i--; ) {
      var key = oldKeys[i];
      if (!(key in newInput && oldInput[key] === newInput[key])) {
        return true;
      }
    }
  }

  return false;
}

var componentProto;

/**
 * Base component type.
 *
 * NOTE: Any methods that are prefixed with an underscore should be considered private!
 */
function Component(id) {
  EventEmitter.call(this);
  this.id = id;
  this.___state = null;
  this.___rootNode = null;
  this.___subscriptions = null;
  this.___domEventListenerHandles = null;
  this.___bubblingDomEvents = null; // Used to keep track of bubbling DOM events for components rendered on the server
  this.___customEvents = null;
  this.___scope = null;
  this.___renderInput = null;
  this.___input = undefined;
  this.___mounted = false;
  this.___global = undefined;
  this.___destroyed = false;
  this.___updateQueued = false;
  this.___dirty = false;
  this.___settingInput = false;
  this.___host = undefined;

  var ssrKeyedElements = keyedElementsByComponentId[id];

  if (ssrKeyedElements) {
    this.___keyedElements = ssrKeyedElements;
    delete keyedElementsByComponentId[id];
  } else {
    this.___keyedElements = {};
  }
}

Component.prototype = componentProto = {
  ___isComponent: true,

  subscribeTo: function (target) {
    if (!target) {
      throw TypeError();
    }

    var subscriptions =
      this.___subscriptions ||
      (this.___subscriptions = new SubscriptionTracker());

    var subscribeToOptions = target.___isComponent
      ? COMPONENT_SUBSCRIBE_TO_OPTIONS
      : NON_COMPONENT_SUBSCRIBE_TO_OPTIONS;

    return subscriptions.subscribeTo(target, subscribeToOptions);
  },

  emit: function (eventType) {
    var customEvents = this.___customEvents;
    var target;

    if (customEvents && (target = customEvents[eventType])) {
      var targetMethodName = target[0];
      var isOnce = target[1];
      var extraArgs = target[2];
      var args = slice.call(arguments, 1);

      handleCustomEventWithMethodListener(
        this,
        targetMethodName,
        args,
        extraArgs,
      );

      if (isOnce) {
        delete customEvents[eventType];
      }
    }

    return emit.apply(this, arguments);
  },
  getElId: function (key, index) {
    if (!key) {
      return this.id;
    }
    return resolveComponentIdHelper(this, key, index);
  },
  getEl: function (key, index) {
    if (key) {
      var resolvedKey = resolveKeyHelper(key, index);
      var keyedElement = this.___keyedElements["@" + resolvedKey];
      if (keyedElement && keyedElement.nodeType === 12 /** FRAGMENT_NODE */) {
        // eslint-disable-next-line no-constant-condition
        if (true) {
          complain(
            "Accessing the elements of a child component using 'component.getEl' is deprecated.",
          );
        }

        return walkFragments(keyedElement);
      }

      return keyedElement;
    } else {
      return this.el;
    }
  },
  getEls: function (key) {
    key = key + "[]";

    var els = [];
    var i = 0;
    var el;
    while ((el = this.getEl(key, i))) {
      els.push(el);
      i++;
    }
    return els;
  },
  getComponent: function (key, index) {
    var rootNode = this.___keyedElements["@" + resolveKeyHelper(key, index)];
    if (/\[\]$/.test(key)) {
      // eslint-disable-next-line no-constant-condition
      if (true) {
        complain(
          "A repeated key[] was passed to getComponent. Use a non-repeating key if there is only one of these components.",
        );
      }
      rootNode = rootNode && rootNode[Object.keys(rootNode)[0]];
    }
    return rootNode && componentsByDOMNode.get(rootNode);
  },
  getComponents: function (key) {
    var lookup = this.___keyedElements["@" + key + "[]"];
    return lookup
      ? Object.keys(lookup)
          .map(function (key) {
            return componentsByDOMNode.get(lookup[key]);
          })
          .filter(Boolean)
      : [];
  },
  destroy: function () {
    if (this.___destroyed) {
      return;
    }

    var root = this.___rootNode;

    this.___destroyShallow();

    var nodes = root.nodes;

    nodes.forEach(function (node) {
      destroyNodeRecursive(node);

      if (eventDelegation.___handleNodeDetach(node) !== false) {
        node.parentNode.removeChild(node);
      }
    });

    root.detached = true;

    delete componentLookup[this.id];
    this.___keyedElements = {};
  },

  ___destroyShallow: function () {
    if (this.___destroyed) {
      return;
    }

    this.___emitDestroy();
    this.___destroyed = true;

    componentsByDOMNode.set(this.___rootNode, undefined);

    this.___rootNode = null;

    // Unsubscribe from all DOM events
    this.___removeDOMEventListeners();

    var subscriptions = this.___subscriptions;
    if (subscriptions) {
      subscriptions.removeAllListeners();
      this.___subscriptions = null;
    }
  },

  isDestroyed: function () {
    return this.___destroyed;
  },
  get state() {
    return this.___state;
  },
  set state(newState) {
    var state = this.___state;
    if (!state && !newState) {
      return;
    }

    if (!state) {
      state = this.___state = new this.___State(this);
    }

    state.___replace(newState || {});

    if (state.___dirty) {
      this.___queueUpdate();
    }

    if (!newState) {
      this.___state = null;
    }
  },
  setState: function (name, value) {
    var state = this.___state;

    if (!state) {
      state = this.___state = new this.___State(this);
    }
    if (typeof name == "object") {
      // Merge in the new state with the old state
      var newState = name;
      for (var k in newState) {
        if (hasOwnProperty.call(newState, k)) {
          state.___set(k, newState[k], true /* ensure:true */);
        }
      }
    } else {
      state.___set(name, value, true /* ensure:true */);
    }
  },

  setStateDirty: function (name, value) {
    var state = this.___state;

    if (arguments.length == 1) {
      value = state[name];
    }

    state.___set(
      name,
      value,
      true /* ensure:true */,
      true /* forceDirty:true */,
    );
  },

  replaceState: function (newState) {
    this.___state.___replace(newState);
  },

  get input() {
    return this.___input;
  },
  set input(newInput) {
    if (this.___settingInput) {
      this.___input = newInput;
    } else {
      this.___setInput(newInput);
    }
  },

  ___setInput: function (newInput, onInput, out) {
    onInput = onInput || this.onInput;
    var updatedInput;

    var oldInput = this.___input;
    this.___input = undefined;
    this.___context = (out && out[CONTEXT_KEY]) || this.___context;

    if (onInput) {
      // We need to set a flag to preview `this.input = foo` inside
      // onInput causing infinite recursion
      this.___settingInput = true;
      updatedInput = onInput.call(this, newInput || {}, out);
      this.___settingInput = false;
    }

    newInput = this.___renderInput = updatedInput || newInput;

    if ((this.___dirty = checkInputChanged(this, oldInput, newInput))) {
      this.___queueUpdate();
    }

    if (this.___input === undefined) {
      this.___input = newInput;
      if (newInput && newInput.$global) {
        this.___global = newInput.$global;
      }
    }

    return newInput;
  },

  forceUpdate: function () {
    this.___dirty = true;
    this.___queueUpdate();
  },

  ___queueUpdate: function () {
    if (!this.___updateQueued) {
      this.___updateQueued = true;
      updateManager.___queueComponentUpdate(this);
    }
  },

  update: function () {
    if (this.___destroyed === true || this.___isDirty === false) {
      return;
    }

    var input = this.___input;
    var state = this.___state;

    if (this.___dirty === false && state !== null && state.___dirty === true) {
      if (processUpdateHandlers(this, state.___changes, state.___old, state)) {
        state.___dirty = false;
      }
    }

    if (this.___isDirty === true) {
      // The UI component is still dirty after process state handlers
      // then we should rerender

      if (this.shouldUpdate(input, state) !== false) {
        this.___scheduleRerender();
      }
    }

    this.___reset();
  },

  get ___isDirty() {
    return (
      this.___dirty === true ||
      (this.___state !== null && this.___state.___dirty === true)
    );
  },

  ___reset: function () {
    this.___dirty = false;
    this.___updateQueued = false;
    this.___renderInput = null;
    var state = this.___state;
    if (state) {
      state.___reset();
    }
  },

  shouldUpdate: function () {
    return true;
  },

  ___scheduleRerender: function () {
    var self = this;
    var renderer = self.___renderer;

    if (!renderer) {
      throw TypeError();
    }

    var input = this.___renderInput || this.___input;

    updateManager.___batchUpdate(function () {
      self.___rerender(input, false).afterInsert(self.___host);
    });

    this.___reset();
  },

  ___rerender: function (input, isHydrate) {
    var host = this.___host;
    var globalData = this.___global;
    var rootNode = this.___rootNode;
    var renderer = this.___renderer;
    var createOut = renderer.createOut || defaultCreateOut;
    var out = createOut(globalData);
    out.sync();
    out.___host = this.___host;
    out[CONTEXT_KEY] = this.___context;

    var componentsContext = getComponentsContext(out);
    var globalComponentsContext = componentsContext.___globalContext;
    globalComponentsContext.___rerenderComponent = this;
    globalComponentsContext.___isHydrate = isHydrate;

    renderer(input, out);

    var result = new RenderResult(out);

    var targetNode = out.___getOutput().___firstChild;

    morphdom(rootNode, targetNode, host, componentsContext);

    return result;
  },

  ___detach: function () {
    var root = this.___rootNode;
    root.remove();
    return root;
  },

  ___removeDOMEventListeners: function () {
    var eventListenerHandles = this.___domEventListenerHandles;
    if (eventListenerHandles) {
      eventListenerHandles.forEach(removeListener);
      this.___domEventListenerHandles = null;
    }
  },

  get ___rawState() {
    var state = this.___state;
    return state && state.___raw;
  },

  ___setCustomEvents: function (customEvents, scope) {
    var finalCustomEvents = (this.___customEvents = {});
    this.___scope = scope;

    customEvents.forEach(function (customEvent) {
      var eventType = customEvent[0];
      var targetMethodName = customEvent[1];
      var isOnce = customEvent[2];
      var extraArgs = customEvent[3];

      if (targetMethodName) {
        finalCustomEvents[eventType] = [targetMethodName, isOnce, extraArgs];
      }
    });
  },

  get el() {
    return walkFragments(this.___rootNode);
  },

  get els() {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      complain(
        'The "this.els" attribute is deprecated. Please use "this.getEls(key)" instead.',
      );
    }
    return (this.___rootNode ? this.___rootNode.nodes : []).filter(
      function (el) {
        return el.nodeType === ELEMENT_NODE;
      },
    );
  },

  ___emit: emit,
  ___emitCreate(input, out) {
    this.onCreate && this.onCreate(input, out);
    this.___emit("create", input, out);
  },

  ___emitRender(out) {
    this.onRender && this.onRender(out);
    this.___emit("render", out);
  },

  ___emitUpdate() {
    this.onUpdate && this.onUpdate();
    this.___emit("update");
  },

  ___emitMount() {
    this.onMount && this.onMount();
    this.___emit("mount");
  },

  ___emitDestroy() {
    this.onDestroy && this.onDestroy();
    this.___emit("destroy");
  },
};

componentProto.elId = componentProto.getElId;
componentProto.___update = componentProto.update;
componentProto.___destroy = componentProto.destroy;

// Add all of the following DOM methods to Component.prototype:
// - appendTo(referenceEl)
// - replace(referenceEl)
// - replaceChildrenOf(referenceEl)
// - insertBefore(referenceEl)
// - insertAfter(referenceEl)
// - prependTo(referenceEl)
domInsert(
  componentProto,
  function getEl(component) {
    return component.___detach();
  },
  function afterInsert(component) {
    return component;
  },
);

inherit(Component, EventEmitter);

module.exports = Component;


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/ComponentDef.js":
/*!*******************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/ComponentDef.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var complain =  true && __webpack_require__(/*! complain */ "./node_modules/complain/index.js");
var extend = __webpack_require__(/*! raptor-util/extend */ "./node_modules/raptor-util/extend.js");
var w10Noop = (__webpack_require__(/*! warp10/constants */ "./node_modules/warp10/constants.js").NOOP);
var componentUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var attachBubblingEvent = componentUtil.___attachBubblingEvent;
var addDelegatedEventHandler =
  (__webpack_require__(/*! ./event-delegation */ "./node_modules/marko/src/runtime/components/event-delegation.js").___addDelegatedEventHandler);
var KeySequence = __webpack_require__(/*! ./KeySequence */ "./node_modules/marko/src/runtime/components/KeySequence.js");
var EMPTY_OBJECT = {};

var FLAG_WILL_RERENDER_IN_BROWSER = 1;
var FLAG_HAS_RENDER_BODY = 2;
var FLAG_IS_LEGACY = 4;
var FLAG_OLD_HYDRATE_NO_CREATE = 8;

/**
 * A ComponentDef is used to hold the metadata collected at runtime for
 * a single component and this information is used to instantiate the component
 * later (after the rendered HTML has been added to the DOM)
 */
function ComponentDef(component, componentId, componentsContext) {
  this.___componentsContext = componentsContext; // The AsyncWriter that this component is associated with
  this.___component = component;
  this.id = componentId;

  this.___domEvents = undefined; // An array of DOM events that need to be added (in sets of three)

  this.___isExisting = false;

  this.___renderBoundary = false;
  this.___flags = 0;

  this.___nextIdIndex = 0; // The unique integer to use for the next scoped ID
  this.___keySequence = null;
}

ComponentDef.prototype = {
  ___nextKey: function (key) {
    return (
      this.___keySequence || (this.___keySequence = new KeySequence())
    ).___nextKey(key);
  },

  /**
   * This helper method generates a unique and fully qualified DOM element ID
   * that is unique within the scope of the current component.
   */
  elId: function (nestedId) {
    var id = this.id;

    if (nestedId == null) {
      return id;
    } else {
      if (typeof nestedId !== "string") {
        // eslint-disable-next-line no-constant-condition
        if (true) {
          complain("Using non strings as keys is deprecated.");
        }

        nestedId = String(nestedId);
      }

      if (nestedId.indexOf("#") === 0) {
        id = "#" + id;
        nestedId = nestedId.substring(1);
      }

      return id + "-" + nestedId;
    }
  },
  /**
   * Returns the next auto generated unique ID for a nested DOM element or nested DOM component
   */
  ___nextComponentId: function () {
    return this.id + "-c" + this.___nextIdIndex++;
  },

  d: function (eventName, handlerMethodName, isOnce, extraArgs) {
    addDelegatedEventHandler(eventName);
    return attachBubblingEvent(this, handlerMethodName, isOnce, extraArgs);
  },

  get ___type() {
    return this.___component.___type;
  },
};

ComponentDef.prototype.nk = ComponentDef.prototype.___nextKey;

ComponentDef.___deserialize = function (o, types, global, registry) {
  var id = o[0];
  var typeName = types[o[1]];
  var input = o[2] || null;
  var extra = o[3] || EMPTY_OBJECT;

  var state = extra.s;
  var componentProps = extra.w || EMPTY_OBJECT;
  var flags = extra.f;
  var isLegacy = flags & FLAG_IS_LEGACY;
  var renderBody = flags & FLAG_HAS_RENDER_BODY ? w10Noop : extra.r;

  var component =
    typeName /* legacy */ &&
    registry.___createComponent(typeName, id, isLegacy);

  // Prevent newly created component from being queued for update since we area
  // just building it from the server info
  component.___updateQueued = true;

  if (isLegacy) {
    component.widgetConfig = componentProps;
    component.___widgetBody = renderBody;
  } else if (renderBody) {
    (input || (input = {})).renderBody = renderBody;
  }

  if (
    !isLegacy &&
    flags & FLAG_WILL_RERENDER_IN_BROWSER &&
    !(flags & FLAG_OLD_HYDRATE_NO_CREATE)
  ) {
    if (component.onCreate) {
      component.onCreate(input, { global: global });
    }
    if (component.onInput) {
      input = component.onInput(input, { global: global }) || input;
    }
  } else {
    if (state) {
      var undefinedPropNames = extra.u;
      if (undefinedPropNames) {
        undefinedPropNames.forEach(function (undefinedPropName) {
          state[undefinedPropName] = undefined;
        });
      }
      // We go through the setter here so that we convert the state object
      // to an instance of `State`
      component.state = state;
    }

    if (!isLegacy && componentProps) {
      extend(component, componentProps);
    }
  }

  component.___input = input;

  if (extra.b) {
    component.___bubblingDomEvents = extra.b;
  }

  var scope = extra.p;
  var customEvents = extra.e;
  if (customEvents) {
    component.___setCustomEvents(customEvents, scope);
  }

  component.___global = global;

  return {
    id: id,
    ___component: component,
    ___domEvents: extra.d,
    ___flags: extra.f || 0,
  };
};

module.exports = ComponentDef;


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/ComponentsContext.js":
/*!************************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/ComponentsContext.js ***!
  \************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

var GlobalComponentsContext = __webpack_require__(/*! ./GlobalComponentsContext */ "./node_modules/marko/src/runtime/components/GlobalComponentsContext.js");

function ComponentsContext(out, parentComponentsContext) {
  var globalComponentsContext;
  var componentDef;

  if (parentComponentsContext) {
    globalComponentsContext = parentComponentsContext.___globalContext;
    componentDef = parentComponentsContext.___componentDef;

    var nestedContextsForParent;
    if (
      !(nestedContextsForParent = parentComponentsContext.___nestedContexts)
    ) {
      nestedContextsForParent = parentComponentsContext.___nestedContexts = [];
    }

    nestedContextsForParent.push(this);
  } else {
    globalComponentsContext = out.global.___components;
    if (globalComponentsContext === undefined) {
      out.global.___components = globalComponentsContext =
        new GlobalComponentsContext(out);
    }
  }

  this.___globalContext = globalComponentsContext;
  this.___components = [];
  this.___out = out;
  this.___componentDef = componentDef;
  this.___nestedContexts = undefined;
  this.___isPreserved =
    parentComponentsContext && parentComponentsContext.___isPreserved;
}

ComponentsContext.prototype = {
  ___initComponents: function (host) {
    var componentDefs = this.___components;

    ComponentsContext.___initClientRendered(componentDefs, host);

    this.___out.emit("___componentsInitialized");

    // Reset things stored in global since global is retained for
    // future renders
    this.___out.global.___components = undefined;

    return componentDefs;
  },
};

function getComponentsContext(out) {
  return out.___components || (out.___components = new ComponentsContext(out));
}

module.exports = exports = ComponentsContext;

exports.___getComponentsContext = getComponentsContext;


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/GlobalComponentsContext.js":
/*!******************************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/GlobalComponentsContext.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nextComponentIdProvider =
  (__webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js").___nextComponentIdProvider);

function GlobalComponentsContext(out) {
  this.___renderedComponentsById = {};
  this.___rerenderComponent = undefined;
  this.___nextComponentId = nextComponentIdProvider(out);
}

module.exports = GlobalComponentsContext;


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/KeySequence.js":
/*!******************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/KeySequence.js ***!
  \******************************************************************/
/***/ ((module) => {

function KeySequence() {
  this.___lookup = Object.create(null);
}

KeySequence.prototype.___nextKey = function (key) {
  var lookup = this.___lookup;

  if (lookup[key]) {
    return key + "_" + lookup[key]++;
  }

  lookup[key] = 1;
  return key;
};

module.exports = KeySequence;


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/State.js":
/*!************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/State.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var extend = __webpack_require__(/*! raptor-util/extend */ "./node_modules/raptor-util/extend.js");

function ensure(state, propertyName) {
  var proto = state.constructor.prototype;
  if (!(propertyName in proto)) {
    Object.defineProperty(proto, propertyName, {
      get: function () {
        return this.___raw[propertyName];
      },
      set: function (value) {
        this.___set(propertyName, value, false /* ensure:false */);
      },
    });
  }
}

function State(component) {
  this.___component = component;
  this.___raw = {};

  this.___dirty = false;
  this.___old = null;
  this.___changes = null;
  this.___forced = null; // An object that we use to keep tracking of state properties that were forced to be dirty

  Object.seal(this);
}

State.prototype = {
  ___reset: function () {
    var self = this;

    self.___dirty = false;
    self.___old = null;
    self.___changes = null;
    self.___forced = null;
  },

  ___replace: function (newState) {
    var state = this;
    var key;

    var rawState = this.___raw;

    for (key in rawState) {
      if (!(key in newState)) {
        state.___set(
          key,
          undefined,
          false /* ensure:false */,
          false /* forceDirty:false */,
        );
      }
    }

    for (key in newState) {
      state.___set(
        key,
        newState[key],
        true /* ensure:true */,
        false /* forceDirty:false */,
      );
    }
  },
  ___set: function (name, value, shouldEnsure, forceDirty) {
    var rawState = this.___raw;

    if (shouldEnsure) {
      ensure(this, name);
    }

    if (forceDirty) {
      var forcedDirtyState = this.___forced || (this.___forced = {});
      forcedDirtyState[name] = true;
    } else if (rawState[name] === value) {
      return;
    }

    if (!this.___dirty) {
      // This is the first time we are modifying the component state
      // so introduce some properties to do some tracking of
      // changes to the state
      this.___dirty = true; // Mark the component state as dirty (i.e. modified)
      this.___old = rawState;
      this.___raw = rawState = extend({}, rawState);
      this.___changes = {};
      this.___component.___queueUpdate();
    }

    this.___changes[name] = value;

    if (value === undefined) {
      // Don't store state properties with an undefined or null value
      delete rawState[name];
    } else {
      // Otherwise, store the new value in the component state
      rawState[name] = value;
    }
  },
  toJSON: function () {
    return this.___raw;
  },
};

module.exports = State;


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/defineComponent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/defineComponent.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* jshint newcap:false */

var inherit = __webpack_require__(/*! raptor-util/inherit */ "./node_modules/raptor-util/inherit.js");
var BaseComponent = __webpack_require__(/*! ./Component */ "./node_modules/marko/src/runtime/components/Component.js");
var BaseState = __webpack_require__(/*! ./State */ "./node_modules/marko/src/runtime/components/State.js");

module.exports = function defineComponent(def, renderer) {
  if (def.___isComponent) {
    return def;
  }

  var ComponentClass = function () {};
  var proto;

  var type = typeof def;

  if (type == "function") {
    proto = def.prototype;
  } else if (type == "object") {
    proto = def;
  } else {
    throw TypeError();
  }

  ComponentClass.prototype = proto;

  // We don't use the constructor provided by the user
  // since we don't invoke their constructor until
  // we have had a chance to do our own initialization.
  // Instead, we store their constructor in the "initComponent"
  // property and that method gets called later inside
  // init-components-browser.js
  function Component(id) {
    BaseComponent.call(this, id);
  }

  if (!proto.___isComponent) {
    // Inherit from Component if they didn't already
    inherit(ComponentClass, BaseComponent);
  }

  // The same prototype will be used by our constructor after
  // we he have set up the prototype chain using the inherit function
  proto = Component.prototype = ComponentClass.prototype;

  // proto.constructor = def.constructor = Component;

  // Set a flag on the constructor function to make it clear this is
  // a component so that we can short-circuit this work later
  Component.___isComponent = true;

  function State(component) {
    BaseState.call(this, component);
  }
  inherit(State, BaseState);
  proto.___State = State;
  proto.___renderer = renderer;

  return Component;
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/dom-data.js":
/*!***************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/dom-data.js ***!
  \***************************************************************/
/***/ ((module) => {

module.exports = {
  ___vPropsByDOMNode: new WeakMap(),
  ___vElementByDOMNode: new WeakMap(),
  ___componentByDOMNode: new WeakMap(),
  ___detachedByDOMNode: new WeakMap(),
  ___keyByDOMNode: new WeakMap(),
  ___ssrKeyedElementsByComponentId: {},
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/event-delegation.js":
/*!***********************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/event-delegation.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var componentsUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var runtimeId = componentsUtil.___runtimeId;
var componentLookup = componentsUtil.___componentLookup;
var getMarkoPropsFromEl = componentsUtil.___getMarkoPropsFromEl;

var TEXT_NODE = 3;

// We make our best effort to allow multiple marko runtimes to be loaded in the
// same window. Each marko runtime will get its own unique runtime ID.
var listenersAttachedKey = "$MDE" + runtimeId;
var delegatedEvents = {};

function getEventFromEl(el, eventName) {
  var virtualProps = getMarkoPropsFromEl(el);
  var eventInfo = virtualProps[eventName];

  if (typeof eventInfo === "string") {
    eventInfo = eventInfo.split(" ");
    if (eventInfo[2]) {
      eventInfo[2] = eventInfo[2] === "true";
    }
    if (eventInfo.length == 4) {
      eventInfo[3] = parseInt(eventInfo[3], 10);
    }
  }

  return eventInfo;
}

function delegateEvent(node, eventName, target, event) {
  var targetMethod = target[0];
  var targetComponentId = target[1];
  var isOnce = target[2];
  var extraArgs = target[3];

  if (isOnce) {
    var virtualProps = getMarkoPropsFromEl(node);
    delete virtualProps[eventName];
  }

  var targetComponent = componentLookup[targetComponentId];

  if (!targetComponent) {
    return;
  }

  var targetFunc =
    typeof targetMethod === "function"
      ? targetMethod
      : targetComponent[targetMethod];
  if (!targetFunc) {
    throw Error("Method not found: " + targetMethod);
  }

  if (extraArgs != null) {
    if (typeof extraArgs === "number") {
      extraArgs = targetComponent.___bubblingDomEvents[extraArgs];
    }
  }

  // Invoke the component method
  if (extraArgs) {
    targetFunc.apply(targetComponent, extraArgs.concat(event, node));
  } else {
    targetFunc.call(targetComponent, event, node);
  }
}

function addDelegatedEventHandler(eventType) {
  if (!delegatedEvents[eventType]) {
    delegatedEvents[eventType] = true;
  }
}

function addDelegatedEventHandlerToHost(eventType, host) {
  var listeners = (host[listenersAttachedKey] =
    host[listenersAttachedKey] || {});
  if (!listeners[eventType]) {
    (host.body || host).addEventListener(
      eventType,
      (listeners[eventType] = function (event) {
        var curNode = event.target;
        if (!curNode) {
          return;
        }

        curNode =
          // event.target of an SVGElementInstance does not have a
          // `getAttribute` function in IE 11.
          // See https://github.com/marko-js/marko/issues/796
          curNode.correspondingUseElement ||
          // in some browsers the event target can be a text node
          // one example being dragenter in firefox.
          (curNode.nodeType === TEXT_NODE ? curNode.parentNode : curNode);

        // Search up the tree looking DOM events mapped to target
        // component methods
        var propName = "on" + eventType;
        var target;

        // Attributes will have the following form:
        // on<event_type>("<target_method>|<component_id>")

        if (event.bubbles) {
          var propagationStopped = false;

          // Monkey-patch to fix #97
          var oldStopPropagation = event.stopPropagation;

          event.stopPropagation = function () {
            oldStopPropagation.call(event);
            propagationStopped = true;
          };

          do {
            if ((target = getEventFromEl(curNode, propName))) {
              delegateEvent(curNode, propName, target, event);

              if (propagationStopped) {
                break;
              }
            }
          } while ((curNode = curNode.parentNode) && curNode.getAttribute);
        } else if ((target = getEventFromEl(curNode, propName))) {
          delegateEvent(curNode, propName, target, event);
        }
      }),
      true,
    );
  }
}

function noop() {}

exports.___handleNodeAttach = noop;
exports.___handleNodeDetach = noop;
exports.___delegateEvent = delegateEvent;
exports.___getEventFromEl = getEventFromEl;
exports.___addDelegatedEventHandler = addDelegatedEventHandler;
exports.___init = function (host) {
  Object.keys(delegatedEvents).forEach(function (eventType) {
    addDelegatedEventHandlerToHost(eventType, host);
  });
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/registry.js":
/*!***************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/registry.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! @internal/components-registry */ "./node_modules/marko/src/node_modules/@internal/components-registry/index-browser.js");


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/renderer.js":
/*!***************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/renderer.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyProps = __webpack_require__(/*! raptor-util/copyProps */ "./node_modules/raptor-util/copyProps.js");
var beginComponent = __webpack_require__(/*! @internal/components-beginComponent */ "./node_modules/marko/src/node_modules/@internal/components-beginComponent/index-browser.js");
var endComponent = __webpack_require__(/*! @internal/components-endComponent */ "./node_modules/marko/src/node_modules/@internal/components-endComponent/index-browser.js");
var registry = __webpack_require__(/*! @internal/components-registry */ "./node_modules/marko/src/node_modules/@internal/components-registry/index-browser.js");
var componentsUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var componentLookup = componentsUtil.___componentLookup;

var ComponentsContext = __webpack_require__(/*! ./ComponentsContext */ "./node_modules/marko/src/runtime/components/ComponentsContext.js");
var getComponentsContext = ComponentsContext.___getComponentsContext;
var isServer = componentsUtil.___isServer === true;

var COMPONENT_BEGIN_ASYNC_ADDED_KEY = "$wa";

function resolveComponentKey(key, parentComponentDef) {
  if (key[0] === "#") {
    return key.substring(1);
  } else {
    return parentComponentDef.id + "-" + parentComponentDef.___nextKey(key);
  }
}

function trackAsyncComponents(out) {
  if (out.isSync() || out.global[COMPONENT_BEGIN_ASYNC_ADDED_KEY]) {
    return;
  }

  out.on("beginAsync", handleBeginAsync);
  out.on("beginDetachedAsync", handleBeginDetachedAsync);
  out.global[COMPONENT_BEGIN_ASYNC_ADDED_KEY] = true;
}

function handleBeginAsync(event) {
  var parentOut = event.parentOut;
  var asyncOut = event.out;
  var componentsContext = parentOut.___components;

  if (componentsContext !== undefined) {
    // We are going to start a nested ComponentsContext
    asyncOut.___components = new ComponentsContext(asyncOut, componentsContext);
  }
  // Carry along the component arguments
  asyncOut.c(
    parentOut.___assignedComponentDef,
    parentOut.___assignedKey,
    parentOut.___assignedCustomEvents,
  );
}

function handleBeginDetachedAsync(event) {
  var asyncOut = event.out;
  handleBeginAsync(event);
  asyncOut.on("beginAsync", handleBeginAsync);
  asyncOut.on("beginDetachedAsync", handleBeginDetachedAsync);
}

function createRendererFunc(
  templateRenderFunc,
  componentProps,
  renderingLogic,
) {
  var onInput = renderingLogic && renderingLogic.onInput;
  var typeName = componentProps.t;
  var isSplit = componentProps.s === true;
  var isImplicitComponent = componentProps.i === true;

  var shouldApplySplitMixins = renderingLogic && isSplit;

  // eslint-disable-next-line no-constant-condition
  if (true) {
    if (!componentProps.d) {
      throw new Error(
        "Component was compiled in a different NODE_ENV than the Marko runtime is using.",
      );
    }
  } else {}

  return function renderer(input, out) {
    trackAsyncComponents(out);

    var componentsContext = getComponentsContext(out);
    var globalComponentsContext = componentsContext.___globalContext;

    var component = globalComponentsContext.___rerenderComponent;
    var isRerender = component !== undefined;
    var id;
    var isExisting;
    var customEvents;
    var parentComponentDef = componentsContext.___componentDef;
    var ownerComponentDef = out.___assignedComponentDef;
    var ownerComponentId = ownerComponentDef && ownerComponentDef.id;
    var key = out.___assignedKey;

    if (component) {
      // If component is provided then we are currently rendering
      // the top-level UI component as part of a re-render
      id = component.id; // We will use the ID of the component being re-rendered
      isExisting = true; // This is a re-render so we know the component is already in the DOM
      globalComponentsContext.___rerenderComponent = null;
    } else {
      // Otherwise, we are rendering a nested UI component. We will need
      // to match up the UI component with the component already in the
      // DOM (if any) so we will need to resolve the component ID from
      // the assigned key. We also need to handle any custom event bindings
      // that were provided.
      if (parentComponentDef) {
        // console.log('componentArgs:', componentArgs);
        customEvents = out.___assignedCustomEvents;

        if (key != null) {
          id = resolveComponentKey(key.toString(), parentComponentDef);
        } else {
          id = parentComponentDef.___nextComponentId();
        }
      } else {
        id = globalComponentsContext.___nextComponentId();
      }
    }

    if (isServer) {
      // If we are rendering on the server then things are simplier since
      // we don't need to match up the UI component with a previously
      // rendered component already mounted to the DOM. We also create
      // a lightweight ServerComponent
      component = registry.___createComponent(
        renderingLogic,
        id,
        input,
        out,
        typeName,
        customEvents,
        ownerComponentId,
      );

      // This is the final input after running the lifecycle methods.
      // We will be passing the input to the template for the `input` param
      input = component.___updatedInput;
    } else {
      if (!component) {
        if (
          isRerender &&
          (component = componentLookup[id]) &&
          component.___type !== typeName
        ) {
          // Destroy the existing component since
          component.destroy();
          component = undefined;
        }

        if (component) {
          isExisting = true;
        } else {
          isExisting = false;
          // We need to create a new instance of the component
          component = registry.___createComponent(typeName, id);

          if (shouldApplySplitMixins === true) {
            shouldApplySplitMixins = false;

            var renderingLogicProps =
              typeof renderingLogic == "function"
                ? renderingLogic.prototype
                : renderingLogic;

            copyProps(renderingLogicProps, component.constructor.prototype);
          }
        }

        // Set this flag to prevent the component from being queued for update
        // based on the new input. The component is about to be rerendered
        // so we don't want to queue it up as a result of calling `setInput()`
        component.___updateQueued = true;

        if (customEvents) {
          component.___setCustomEvents(customEvents, ownerComponentId);
        }

        if (isExisting === false) {
          component.___emitCreate(input, out);
        }

        input = component.___setInput(input, onInput, out);

        if (isExisting === true) {
          if (
            component.___isDirty === false ||
            component.shouldUpdate(input, component.___state) === false
          ) {
            // We put a placeholder element in the output stream to ensure that the existing
            // DOM node is matched up correctly when using morphdom. We flag the VElement
            // node to track that it is a preserve marker
            out.___preserveComponent(component);
            globalComponentsContext.___renderedComponentsById[id] = true;
            component.___reset(); // The component is no longer dirty so reset internal flags
            return;
          }
        }
      }

      component.___global = out.global;
      component.___emitRender(out);
    }

    var componentDef = beginComponent(
      componentsContext,
      component,
      key,
      ownerComponentDef,
      isSplit,
      isImplicitComponent,
    );

    componentDef.___isExisting = isExisting;

    // Render the template associated with the component using the final template
    // data that we constructed
    templateRenderFunc(
      input,
      out,
      componentDef,
      component,
      component.___rawState,
      out.global,
    );

    endComponent(out, componentDef);
    componentsContext.___componentDef = parentComponentDef;
  };
}

module.exports = createRendererFunc;

// exports used by the legacy renderer
createRendererFunc.___resolveComponentKey = resolveComponentKey;
createRendererFunc.___trackAsyncComponents = trackAsyncComponents;


/***/ }),

/***/ "./node_modules/marko/src/runtime/components/update-manager.js":
/*!*********************************************************************!*\
  !*** ./node_modules/marko/src/runtime/components/update-manager.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var updatesScheduled = false;
var batchStack = []; // A stack of batched updates
var unbatchedQueue = []; // Used for scheduled batched updates

var setImmediate = (__webpack_require__(/*! @internal/set-immediate */ "./node_modules/marko/src/node_modules/@internal/set-immediate/index-browser.js").___setImmediate);

/**
 * This function is called when we schedule the update of "unbatched"
 * updates to components.
 */
function updateUnbatchedComponents() {
  if (unbatchedQueue.length) {
    try {
      updateComponents(unbatchedQueue);
    } finally {
      // Reset the flag now that this scheduled batch update
      // is complete so that we can later schedule another
      // batched update if needed
      updatesScheduled = false;
    }
  }
}

function scheduleUpdates() {
  if (updatesScheduled) {
    // We have already scheduled a batched update for the
    // nextTick so nothing to do
    return;
  }

  updatesScheduled = true;

  setImmediate(updateUnbatchedComponents);
}

function updateComponents(queue) {
  // Loop over the components in the queue and update them.
  // NOTE: It is okay if the queue grows during the iteration
  //       since we will still get to them at the end
  for (var i = 0; i < queue.length; i++) {
    var component = queue[i];
    component.___update(); // Do the actual component update
  }

  // Clear out the queue by setting the length to zero
  queue.length = 0;
}

function batchUpdate(func) {
  // If the batched update stack is empty then this
  // is the outer batched update. After the outer
  // batched update completes we invoke the "afterUpdate"
  // event listeners.
  var batch = [];

  batchStack.push(batch);

  try {
    func();
  } finally {
    try {
      // Update all of the components that where queued up
      // in this batch (if any)
      updateComponents(batch);
    } finally {
      // Now that we have completed the update of all the components
      // in this batch we need to remove it off the top of the stack
      batchStack.length--;
    }
  }
}

function queueComponentUpdate(component) {
  var batchStackLen = batchStack.length;

  if (batchStackLen) {
    // When a batch update is started we push a new batch on to a stack.
    // If the stack has a non-zero length then we know that a batch has
    // been started so we can just queue the component on the top batch. When
    // the batch is ended this component will be updated.
    batchStack[batchStackLen - 1].push(component);
  } else {
    // We are not within a batched update. We need to schedule a batch update
    // for the nextTick (if that hasn't been done already) and we will
    // add the component to the unbatched queue
    scheduleUpdates();
    unbatchedQueue.push(component);
  }
}

exports.___queueComponentUpdate = queueComponentUpdate;
exports.___batchUpdate = batchUpdate;


/***/ }),

/***/ "./node_modules/marko/src/runtime/createOut.js":
/*!*****************************************************!*\
  !*** ./node_modules/marko/src/runtime/createOut.js ***!
  \*****************************************************/
/***/ ((module) => {

var actualCreateOut;

function setCreateOut(createOutFunc) {
  actualCreateOut = createOutFunc;
}

function createOut(globalData) {
  return actualCreateOut(globalData);
}

createOut.___setCreateOut = setCreateOut;

module.exports = createOut;


/***/ }),

/***/ "./node_modules/marko/src/runtime/dom-insert.js":
/*!******************************************************!*\
  !*** ./node_modules/marko/src/runtime/dom-insert.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var extend = __webpack_require__(/*! raptor-util/extend */ "./node_modules/raptor-util/extend.js");
var componentsUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var destroyComponentForNode = componentsUtil.___destroyComponentForNode;
var destroyNodeRecursive = componentsUtil.___destroyNodeRecursive;
var helpers = __webpack_require__(/*! ./vdom/morphdom/helpers */ "./node_modules/marko/src/runtime/vdom/morphdom/helpers.js");

var insertBefore = helpers.___insertBefore;
var insertAfter = helpers.___insertAfter;
var removeChild = helpers.___removeChild;

function resolveEl(el) {
  if (typeof el == "string") {
    var elId = el;
    el = document.getElementById(elId);
    if (!el) {
      throw Error("Not found: " + elId);
    }
  }
  return el;
}

function beforeRemove(referenceEl) {
  destroyNodeRecursive(referenceEl);
  destroyComponentForNode(referenceEl);
}

module.exports = function (target, getEl, afterInsert) {
  extend(target, {
    appendTo: function (referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl(this, referenceEl);
      insertBefore(el, null, referenceEl);
      return afterInsert(this, referenceEl);
    },
    prependTo: function (referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl(this, referenceEl);
      insertBefore(el, referenceEl.firstChild || null, referenceEl);
      return afterInsert(this, referenceEl);
    },
    replace: function (referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl(this, referenceEl);
      beforeRemove(referenceEl);
      insertBefore(el, referenceEl, referenceEl.parentNode);
      removeChild(referenceEl);
      return afterInsert(this, referenceEl);
    },
    replaceChildrenOf: function (referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl(this, referenceEl);

      var curChild = referenceEl.firstChild;
      while (curChild) {
        var nextSibling = curChild.nextSibling; // Just in case the DOM changes while removing
        beforeRemove(curChild);
        curChild = nextSibling;
      }

      referenceEl.innerHTML = "";
      insertBefore(el, null, referenceEl);
      return afterInsert(this, referenceEl);
    },
    insertBefore: function (referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl(this, referenceEl);
      insertBefore(el, referenceEl, referenceEl.parentNode);
      return afterInsert(this, referenceEl);
    },
    insertAfter: function (referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl(this, referenceEl);
      insertAfter(el, referenceEl, referenceEl.parentNode);
      return afterInsert(this, referenceEl);
    },
  });
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/helpers/_change-case.js":
/*!****************************************************************!*\
  !*** ./node_modules/marko/src/runtime/helpers/_change-case.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var camelToDashLookup = Object.create(null);
var dashToCamelLookup = Object.create(null);

/**
 * Helper for converting camelCase to dash-case.
 */
exports.___camelToDashCase = function camelToDashCase(name) {
  var nameDashed = camelToDashLookup[name];
  if (!nameDashed) {
    nameDashed = camelToDashLookup[name] = name
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase();

    if (nameDashed !== name) {
      dashToCamelLookup[nameDashed] = name;
    }
  }

  return nameDashed;
};

/**
 * Helper for converting dash-case to camelCase.
 */
exports.___dashToCamelCase = function dashToCamelCase(name) {
  var nameCamel = dashToCamelLookup[name];
  if (!nameCamel) {
    nameCamel = dashToCamelLookup[name] = name.replace(
      /-([a-z])/g,
      matchToUpperCase,
    );

    if (nameCamel !== name) {
      camelToDashLookup[nameCamel] = name;
    }
  }

  return nameCamel;
};

function matchToUpperCase(_, char) {
  return char.toUpperCase();
}


/***/ }),

/***/ "./node_modules/marko/src/runtime/helpers/class-value.js":
/*!***************************************************************!*\
  !*** ./node_modules/marko/src/runtime/helpers/class-value.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function classHelper(arg) {
  switch (typeof arg) {
    case "string":
      return arg || undefined;
    case "object":
      var result = "";
      var sep = "";

      if (Array.isArray(arg)) {
        for (var i = 0, len = arg.length; i < len; i++) {
          var value = classHelper(arg[i]);
          if (value) {
            result += sep + value;
            sep = " ";
          }
        }
      } else {
        for (var key in arg) {
          if (arg[key]) {
            result += sep + key;
            sep = " ";
          }
        }
      }

      return result || undefined;
  }
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/helpers/render-tag.js":
/*!**************************************************************!*\
  !*** ./node_modules/marko/src/runtime/helpers/render-tag.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Helper to render a custom tag
 */
module.exports = function renderTagHelper(
  handler,
  input,
  out,
  componentDef,
  key,
  customEvents,
) {
  out.c(componentDef, key, customEvents);
  (handler._ || (handler._ = handler.render || handler.renderer || handler))(
    input,
    out,
  );
  out.___assignedComponentDef = null;
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/helpers/style-value.js":
/*!***************************************************************!*\
  !*** ./node_modules/marko/src/runtime/helpers/style-value.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var changeCase = __webpack_require__(/*! ./_change-case */ "./node_modules/marko/src/runtime/helpers/_change-case.js");

/**
 * Helper for generating the string for a style attribute
 */
module.exports = function styleHelper(style) {
  if (!style) {
    return;
  }

  var type = typeof style;

  if (type !== "string") {
    var styles = "";
    var sep = "";

    if (Array.isArray(style)) {
      for (var i = 0, len = style.length; i < len; i++) {
        var next = styleHelper(style[i]);
        if (next) {
          styles += sep + next;
          sep = ";";
        }
      }
    } else if (type === "object") {
      for (var name in style) {
        var value = style[name];
        if (value != null && value !== false) {
          if (typeof value === "number" && value) {
            value += "px";
          }

          styles += sep + changeCase.___camelToDashCase(name) + ":" + value;
          sep = ";";
        }
      }
    }

    return styles || undefined;
  }

  return style;
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/renderable.js":
/*!******************************************************!*\
  !*** ./node_modules/marko/src/runtime/renderable.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var extend = __webpack_require__(/*! raptor-util/extend */ "./node_modules/raptor-util/extend.js");
var setImmediate = (__webpack_require__(/*! @internal/set-immediate */ "./node_modules/marko/src/node_modules/@internal/set-immediate/index-browser.js").___setImmediate);
var defaultCreateOut = __webpack_require__(/*! ./createOut */ "./node_modules/marko/src/runtime/createOut.js");

function safeRender(renderFunc, finalData, finalOut, shouldEnd) {
  try {
    renderFunc(finalData, finalOut);

    if (shouldEnd) {
      finalOut.end();
    }
  } catch (err) {
    var actualEnd = finalOut.end;
    finalOut.end = function () {};

    setImmediate(function () {
      finalOut.end = actualEnd;
      finalOut.error(err);
    });
  }
  return finalOut;
}

module.exports = function (target, renderer) {
  var renderFunc =
    renderer && (renderer.renderer || renderer.render || renderer);
  var createOut = target.createOut || renderer.createOut || defaultCreateOut;

  return extend(target, {
    _: renderFunc,
    createOut: createOut,

    renderToString: function (data, callback) {
      var localData = data || {};
      var render = renderFunc || this._;
      var globalData = localData.$global;
      var out = createOut(globalData);

      out.global.template = this;

      if (globalData) {
        localData.$global = undefined;
      }

      if (callback) {
        out
          .on("finish", function () {
            callback(null, out.toString(), out);
          })
          .once("error", callback);

        return safeRender(render, localData, out, true);
      } else {
        out.sync();
        render(localData, out);
        return out.toString();
      }
    },

    renderSync: function (data) {
      var localData = data || {};
      var render = renderFunc || this._;
      var globalData = localData.$global;
      var out = createOut(globalData);
      out.sync();

      out.global.template = this;

      if (globalData) {
        localData.$global = undefined;
      }

      render(localData, out);
      return out.___getResult();
    },

    /**
     * Renders a template to nodes and inserts them into the DOM relative
     * to the provided reference based on the optional position parameter.
     *
     * Supported signatures:
     *
     * mount(data, reference)
     * mount(data, reference, position)
     *
     * @param  {Object} data The view model data for the template
     * @param  {Node} reference DOM node to insert the rendered node(s) relative to
     * @param  {string} [position] A string representing the position relative to the `reference`; must match (case-insensitively) one of the following strings:
     *  'beforebegin': Before the targetElement itself.
     *  'afterbegin': Just inside the targetElement, before its first child.
     *  'beforeend': Just inside the targetElement, after its last child.
     *  'afterend': After the targetElement itself.
     * @return {TemplateInstance} Object with `update` and `dispose` methods
     */
    mount: function (data, reference, position) {
      const result = this.renderSync(data);

      switch (position) {
        case "afterbegin":
          result.prependTo(reference);
          break;
        case "afterend":
          result.insertAfter(reference);
          break;
        case "beforebegin":
          result.insertBefore(reference);
          break;
        default:
          result.appendTo(reference);
          break;
      }

      const component = result.getComponent();

      return {
        update(input) {
          component.input = input;
          component.update();
        },
        destroy() {
          component.destroy();
        },
      };
    },

    /**
     * Renders a template to either a stream (if the last
     * argument is a Stream instance) or
     * provides the output to a callback function (if the last
     * argument is a Function).
     *
     * Supported signatures:
     *
     * render(data)
     * render(data, out)
     * render(data, stream)
     * render(data, callback)
     *
     * @param  {Object} data The view model data for the template
     * @param  {AsyncStream/AsyncVDOMBuilder} out A Stream, an AsyncStream/AsyncVDOMBuilder instance, or a callback function
     * @return {AsyncStream/AsyncVDOMBuilder} Returns the AsyncStream/AsyncVDOMBuilder instance that the template is rendered to
     */
    render: function (data, out) {
      var callback;
      var finalOut;
      var finalData;
      var globalData;
      var render = renderFunc || this._;
      var shouldBuffer = this.___shouldBuffer;
      var shouldEnd = true;

      if (data) {
        finalData = data;
        if ((globalData = data.$global)) {
          finalData.$global = undefined;
        }
      } else {
        finalData = {};
      }

      if (out && out.___isOut) {
        finalOut = out;
        shouldEnd = false;
        extend(out.global, globalData);
      } else if (typeof out == "function") {
        finalOut = createOut(globalData);
        callback = out;
      } else {
        finalOut = createOut(
          globalData, // global
          out, // writer(AsyncStream) or parentNode(AsyncVDOMBuilder)
          undefined, // parentOut
          shouldBuffer, // ignored by AsyncVDOMBuilder
        );
      }

      if (callback) {
        finalOut
          .on("finish", function () {
            callback(null, finalOut.___getResult(), finalOut);
          })
          .once("error", callback);
      }

      globalData = finalOut.global;

      globalData.template = globalData.template || this;

      return safeRender(render, finalData, finalOut, shouldEnd);
    },
  });
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/AsyncVDOMBuilder.js":
/*!*****************************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/AsyncVDOMBuilder.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var EventEmitter = __webpack_require__(/*! events-light */ "./node_modules/events-light/src/index.js");
var RenderResult = __webpack_require__(/*! ../RenderResult */ "./node_modules/marko/src/runtime/RenderResult.js");
var attrsHelper = __webpack_require__(/*! ./helpers/attrs */ "./node_modules/marko/src/runtime/vdom/helpers/attrs.js");
var morphdom = __webpack_require__(/*! ./morphdom */ "./node_modules/marko/src/runtime/vdom/morphdom/index.js");
var vdom = __webpack_require__(/*! ./vdom */ "./node_modules/marko/src/runtime/vdom/vdom.js");
var VElement = vdom.___VElement;
var VDocumentFragment = vdom.___VDocumentFragment;
var VText = vdom.___VText;
var VComponent = vdom.___VComponent;
var VFragment = vdom.___VFragment;
var virtualizeHTML = vdom.___virtualizeHTML;

var EVENT_UPDATE = "update";
var EVENT_FINISH = "finish";

function State(tree) {
  this.___events = new EventEmitter();
  this.___tree = tree;
  this.___finished = false;
}

function AsyncVDOMBuilder(globalData, parentNode, parentOut) {
  if (!parentNode) {
    parentNode = new VDocumentFragment();
  }

  var state;

  if (parentOut) {
    state = parentOut.___state;
  } else {
    state = new State(parentNode);
  }

  this.___remaining = 1;
  this.___lastCount = 0;
  this.___last = null;
  this.___parentOut = parentOut;

  this.data = {};
  this.___state = state;
  this.___parent = parentNode;
  this.global = globalData || {};
  this.___stack = [parentNode];
  this.___sync = false;
  this.___vnode = undefined;
  this.___components = null;

  this.___assignedComponentDef = null;
  this.___assignedKey = null;
  this.___assignedCustomEvents = null;
}

var proto = (AsyncVDOMBuilder.prototype = {
  ___isOut: true,
  ___host: typeof document === "object" && document,

  bc: function (component, key, ownerComponent) {
    var vComponent = new VComponent(component, key, ownerComponent);
    return this.___beginNode(vComponent, 0, true);
  },

  ___preserveComponent: function (component, key, ownerComponent) {
    var vComponent = new VComponent(component, key, ownerComponent, true);
    this.___beginNode(vComponent, 0);
  },

  ___beginNode: function (child, childCount, pushToStack) {
    this.___parent.___appendChild(child);
    if (pushToStack === true) {
      this.___stack.push(child);
      this.___parent = child;
    }
    return childCount === 0 ? this : child;
  },

  element: function (tagName, attrs, key, component, childCount, flags, props) {
    var element = new VElement(
      tagName,
      attrs,
      key,
      component,
      childCount,
      flags,
      props,
    );
    return this.___beginNode(element, childCount);
  },

  ___elementDynamic: function (tagName, attrs, key, componentDef, props) {
    return this.element(
      tagName,
      attrsHelper(attrs),
      key,
      componentDef.___component,
      0,
      0,
      props,
    );
  },

  n: function (node, component) {
    // NOTE: We do a shallow clone since we assume the node is being reused
    //       and a node can only have one parent node.
    var clone = node.___cloneNode();
    this.node(clone);
    clone.___ownerComponent = component;

    return this;
  },

  node: function (node) {
    this.___parent.___appendChild(node);
    return this;
  },

  text: function (text, ownerComponent) {
    var type = typeof text;

    if (type != "string") {
      if (text == null) {
        return;
      } else if (type === "object") {
        if (text.toHTML) {
          return this.h(text.toHTML(), ownerComponent);
        }
      }

      text = text.toString();
    }

    this.___parent.___appendChild(new VText(text, ownerComponent));
    return this;
  },

  html: function (html, ownerComponent) {
    if (html != null) {
      var vdomNode = virtualizeHTML(html, ownerComponent);
      this.node(vdomNode);
    }

    return this;
  },

  beginElement: function (
    tagName,
    attrs,
    key,
    component,
    childCount,
    flags,
    props,
  ) {
    var element = new VElement(
      tagName,
      attrs,
      key,
      component,
      childCount,
      flags,
      props,
    );
    this.___beginNode(element, childCount, true);
    return this;
  },

  ___beginElementDynamic: function (tagName, attrs, key, componentDef, props) {
    return this.beginElement(
      tagName,
      attrsHelper(attrs),
      key,
      componentDef.___component,
      0,
      0,
      props,
    );
  },

  bf: function (key, component, preserve) {
    var fragment = new VFragment(key, component, preserve);
    this.___beginNode(fragment, null, true);
    return this;
  },

  ef: function () {
    this.endElement();
  },

  endElement: function () {
    var stack = this.___stack;
    stack.pop();
    this.___parent = stack[stack.length - 1];
  },

  end: function () {
    this.___parent = undefined;

    var remaining = --this.___remaining;
    var parentOut = this.___parentOut;

    if (remaining === 0) {
      if (parentOut) {
        parentOut.___handleChildDone();
      } else {
        this.___doFinish();
      }
    } else if (remaining - this.___lastCount === 0) {
      this.___emitLast();
    }

    return this;
  },

  ___handleChildDone: function () {
    var remaining = --this.___remaining;

    if (remaining === 0) {
      var parentOut = this.___parentOut;
      if (parentOut) {
        parentOut.___handleChildDone();
      } else {
        this.___doFinish();
      }
    } else if (remaining - this.___lastCount === 0) {
      this.___emitLast();
    }
  },

  ___doFinish: function () {
    var state = this.___state;
    state.___finished = true;
    state.___events.emit(EVENT_FINISH, this.___getResult());
  },

  ___emitLast: function () {
    var lastArray = this._last;

    var i = 0;

    function next() {
      if (i === lastArray.length) {
        return;
      }
      var lastCallback = lastArray[i++];
      lastCallback(next);

      if (!lastCallback.length) {
        next();
      }
    }

    next();
  },

  error: function (e) {
    try {
      this.emit("error", e);
    } finally {
      // If there is no listener for the error event then it will
      // throw a new Error here. In order to ensure that the async fragment
      // is still properly ended we need to put the end() in a `finally`
      // block
      this.end();
    }

    return this;
  },

  beginAsync: function (options) {
    if (this.___sync) {
      throw Error(
        "Tried to render async while in sync mode. Note: Client side await is not currently supported in re-renders (Issue: #942).",
      );
    }

    var state = this.___state;

    if (options) {
      if (options.last) {
        this.___lastCount++;
      }
    }

    this.___remaining++;

    var documentFragment = this.___parent.___appendDocumentFragment();
    var asyncOut = new AsyncVDOMBuilder(this.global, documentFragment, this);

    state.___events.emit("beginAsync", {
      out: asyncOut,
      parentOut: this,
    });

    return asyncOut;
  },

  createOut: function () {
    return new AsyncVDOMBuilder(this.global);
  },

  flush: function () {
    var events = this.___state.___events;

    if (events.listenerCount(EVENT_UPDATE)) {
      events.emit(EVENT_UPDATE, new RenderResult(this));
    }
  },

  ___getOutput: function () {
    return this.___state.___tree;
  },

  ___getResult: function () {
    return this.___result || (this.___result = new RenderResult(this));
  },

  on: function (event, callback) {
    var state = this.___state;

    if (event === EVENT_FINISH && state.___finished) {
      callback(this.___getResult());
    } else if (event === "last") {
      this.onLast(callback);
    } else {
      state.___events.on(event, callback);
    }

    return this;
  },

  once: function (event, callback) {
    var state = this.___state;

    if (event === EVENT_FINISH && state.___finished) {
      callback(this.___getResult());
    } else if (event === "last") {
      this.onLast(callback);
    } else {
      state.___events.once(event, callback);
    }

    return this;
  },

  emit: function (type, arg) {
    var events = this.___state.___events;
    switch (arguments.length) {
      case 1:
        events.emit(type);
        break;
      case 2:
        events.emit(type, arg);
        break;
      default:
        events.emit.apply(events, arguments);
        break;
    }
    return this;
  },

  removeListener: function () {
    var events = this.___state.___events;
    events.removeListener.apply(events, arguments);
    return this;
  },

  sync: function () {
    this.___sync = true;
  },

  isSync: function () {
    return this.___sync;
  },

  onLast: function (callback) {
    var lastArray = this._last;

    if (lastArray === undefined) {
      this._last = [callback];
    } else {
      lastArray.push(callback);
    }

    return this;
  },

  ___getNode: function (host) {
    var node = this.___vnode;
    if (!node) {
      var vdomTree = this.___getOutput();

      if (!host) host = this.___host;
      this.___vnode = node = vdomTree.___actualize(host, null);
      morphdom(node, vdomTree, host, this.___components);
    }
    return node;
  },

  toString: function (host) {
    var docFragment = this.___getNode(host);
    var html = "";

    var child = docFragment.firstChild;
    while (child) {
      var nextSibling = child.nextSibling;
      if (child.nodeType != 1) {
        var container = docFragment.ownerDocument.createElement("div");
        container.appendChild(child.cloneNode());
        html += container.innerHTML;
      } else {
        html += child.outerHTML;
      }

      child = nextSibling;
    }

    return html;
  },

  then: function (fn, fnErr) {
    var out = this;
    var promise = new Promise(function (resolve, reject) {
      out.on("error", reject).on(EVENT_FINISH, function (result) {
        resolve(result);
      });
    });

    return Promise.resolve(promise).then(fn, fnErr);
  },

  catch: function (fnErr) {
    return this.then(undefined, fnErr);
  },

  isVDOM: true,

  c: function (componentDef, key, customEvents) {
    this.___assignedComponentDef = componentDef;
    this.___assignedKey = key;
    this.___assignedCustomEvents = customEvents;
  },
});

proto.e = proto.element;
proto.be = proto.beginElement;
proto.ee = proto.___endElement = proto.endElement;
proto.t = proto.text;
proto.h = proto.w = proto.write = proto.html;

module.exports = AsyncVDOMBuilder;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/VComponent.js":
/*!***********************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/VComponent.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var inherit = __webpack_require__(/*! raptor-util/inherit */ "./node_modules/raptor-util/inherit.js");
var VNode = __webpack_require__(/*! ./VNode */ "./node_modules/marko/src/runtime/vdom/VNode.js");

function VComponent(component, key, ownerComponent, preserve) {
  this.___VNode(null /* childCount */, ownerComponent);
  this.___key = key;
  this.___component = component;
  this.___preserve = preserve;
}

VComponent.prototype = {
  ___nodeType: 2,
};

inherit(VComponent, VNode);

module.exports = VComponent;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/VDocumentFragment.js":
/*!******************************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/VDocumentFragment.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var extend = __webpack_require__(/*! raptor-util/extend */ "./node_modules/raptor-util/extend.js");
var inherit = __webpack_require__(/*! raptor-util/inherit */ "./node_modules/raptor-util/inherit.js");
var VNode = __webpack_require__(/*! ./VNode */ "./node_modules/marko/src/runtime/vdom/VNode.js");

function VDocumentFragmentClone(other) {
  extend(this, other);
  this.___parentNode = null;
  this.___nextSiblingInternal = null;
}

function VDocumentFragment(out) {
  this.___VNode(null /* childCount */);
  this.___out = out;
}

VDocumentFragment.prototype = {
  ___nodeType: 11,

  ___DocumentFragment: true,

  ___cloneNode: function () {
    return new VDocumentFragmentClone(this);
  },

  ___actualize: function (host) {
    return (host.ownerDocument || host).createDocumentFragment();
  },
};

inherit(VDocumentFragment, VNode);

VDocumentFragmentClone.prototype = VDocumentFragment.prototype;

module.exports = VDocumentFragment;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/VElement.js":
/*!*********************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/VElement.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* jshint newcap:false */

var complain =  true && __webpack_require__(/*! complain */ "./node_modules/complain/index.js");
var inherit = __webpack_require__(/*! raptor-util/inherit */ "./node_modules/raptor-util/inherit.js");
var componentsUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var domData = __webpack_require__(/*! ../components/dom-data */ "./node_modules/marko/src/runtime/components/dom-data.js");
var vElementByDOMNode = domData.___vElementByDOMNode;
var VNode = __webpack_require__(/*! ./VNode */ "./node_modules/marko/src/runtime/vdom/VNode.js");
var ATTR_XLINK_HREF = "xlink:href";
var xmlnsRegExp = /^xmlns(:|$)/;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var NS_XLINK = "http://www.w3.org/1999/xlink";
var NS_HTML = "http://www.w3.org/1999/xhtml";
var NS_MATH = "http://www.w3.org/1998/Math/MathML";
var NS_SVG = "http://www.w3.org/2000/svg";
var DEFAULT_NS = {
  svg: NS_SVG,
  math: NS_MATH,
};

var FLAG_SIMPLE_ATTRS = 1;
var FLAG_CUSTOM_ELEMENT = 2;
var FLAG_SPREAD_ATTRS = 4;

var ATTR_HREF = "href";
var EMPTY_OBJECT = Object.freeze(Object.create(null));
var specialElHandlers = {
  option: {
    selected: function (fromEl, value) {
      fromEl.selected = value !== undefined;
    },
  },
  input: {
    value: function (fromEl, value) {
      fromEl.value = value === undefined ? "" : value;
    },
    checked: function (fromEl, value) {
      fromEl.checked = value !== undefined;
    },
  },
};

function normalizeValue(value) {
  if (value === true) {
    return "";
  }

  if (value == null || value === false) {
    return;
  }

  switch (typeof value) {
    case "string":
      return value;
    case "object":
      switch (value.toString) {
        case Object.prototype.toString:
        case Array.prototype.toString:
          // eslint-disable-next-line no-constant-condition
          if (true) {
            complain(
              "Relying on JSON.stringify for attribute values is deprecated, in future versions of Marko these will be cast to strings instead.",
            );
          }
          return JSON.stringify(value);
        case RegExp.prototype.toString:
          return value.source;
      }
      break;
  }

  return value + "";
}

function assign(a, b) {
  for (var key in b) {
    if (hasOwnProperty.call(b, key)) {
      a[key] = b[key];
    }
  }
}

function VElementClone(other) {
  this.___firstChildInternal = other.___firstChildInternal;
  this.___parentNode = null;
  this.___nextSiblingInternal = null;

  this.___key = other.___key;
  this.___attributes = other.___attributes;
  this.___properties = other.___properties;
  this.___nodeName = other.___nodeName;
  this.___flags = other.___flags;
  this.___valueInternal = other.___valueInternal;
  this.___constId = other.___constId;
}

function VElement(
  tagName,
  attrs,
  key,
  ownerComponent,
  childCount,
  flags,
  props,
) {
  this.___VNode(childCount, ownerComponent);

  var constId;

  if (props) {
    constId = props.i;
  }

  this.___key = key;
  this.___flags = flags || 0;
  this.___attributes = attrs || EMPTY_OBJECT;
  this.___properties = props || EMPTY_OBJECT;
  this.___nodeName = tagName;
  this.___valueInternal = "";
  this.___constId = constId;
  this.___preserve = false;
  this.___preserveBody = false;
}

VElement.prototype = {
  ___nodeType: 1,

  ___cloneNode: function () {
    return new VElementClone(this);
  },

  /**
   * Shorthand method for creating and appending an HTML element
   *
   * @param  {String} tagName    The tag name (e.g. "div")
   * @param  {int|null} attrCount  The number of attributes (or `null` if not known)
   * @param  {int|null} childCount The number of child nodes (or `null` if not known)
   */
  e: function (tagName, attrs, key, ownerComponent, childCount, flags, props) {
    var child = this.___appendChild(
      new VElement(
        tagName,
        attrs,
        key,
        ownerComponent,
        childCount,
        flags,
        props,
      ),
    );

    if (childCount === 0) {
      return this.___finishChild();
    } else {
      return child;
    }
  },

  /**
   * Shorthand method for creating and appending a static node. The provided node is automatically cloned
   * using a shallow clone since it will be mutated as a result of setting `nextSibling` and `parentNode`.
   *
   * @param  {String} value The value for the new Comment node
   */
  n: function (node, ownerComponent) {
    node = node.___cloneNode();
    node.___ownerComponent = ownerComponent;
    this.___appendChild(node);
    return this.___finishChild();
  },

  ___actualize: function (host, parentNamespaceURI) {
    var tagName = this.___nodeName;
    var attributes = this.___attributes;
    var namespaceURI = DEFAULT_NS[tagName] || parentNamespaceURI || NS_HTML;

    var flags = this.___flags;
    var el = (host.ownerDocument || host).createElementNS(
      namespaceURI,
      tagName,
    );

    if (flags & FLAG_CUSTOM_ELEMENT) {
      assign(el, attributes);
    } else {
      for (var attrName in attributes) {
        var attrValue = normalizeValue(attributes[attrName]);

        if (attrValue !== undefined) {
          if (attrName == ATTR_XLINK_HREF) {
            el.setAttributeNS(NS_XLINK, ATTR_HREF, attrValue);
          } else {
            el.setAttribute(attrName, attrValue);
          }
        }
      }

      if (tagName === "textarea") {
        el.defaultValue = this.___valueInternal;
      }
    }

    vElementByDOMNode.set(el, this);

    return el;
  },
};

inherit(VElement, VNode);

VElementClone.prototype = VElement.prototype;

function virtualizeElement(node, virtualizeChildNodes, ownerComponent) {
  var attributes = node.attributes;
  var attrCount = attributes.length;

  var attrs = null;
  var props = null;

  if (attrCount) {
    attrs = {};
    for (var i = 0; i < attrCount; i++) {
      var attr = attributes[i];
      var attrName = attr.name;
      if (!xmlnsRegExp.test(attrName)) {
        if (attrName === "data-marko") {
          props = componentsUtil.___getMarkoPropsFromEl(node);
        } else if (attr.namespaceURI === NS_XLINK) {
          attrs[ATTR_XLINK_HREF] = attr.value;
        } else {
          attrs[attrName] = attr.value;
        }
      }
    }
  }

  var tagName = node.nodeName;

  if (node.namespaceURI === NS_HTML) {
    tagName = tagName.toLowerCase();
  }

  var vdomEl = new VElement(
    tagName,
    attrs,
    null /*key*/,
    ownerComponent,
    0 /*child count*/,
    0 /*flags*/,
    props,
  );

  if (vdomEl.___nodeName === "textarea") {
    vdomEl.___valueInternal = node.value;
  } else if (virtualizeChildNodes) {
    virtualizeChildNodes(node, vdomEl, ownerComponent);
  }

  return vdomEl;
}

VElement.___virtualize = virtualizeElement;

VElement.___morphAttrs = function (fromEl, vFromEl, toEl) {
  var fromFlags = vFromEl.___flags;
  var toFlags = toEl.___flags;
  var attrs = toEl.___attributes;

  if (toFlags & FLAG_CUSTOM_ELEMENT) {
    return assign(fromEl, attrs);
  }

  var props = toEl.___properties;
  var attrName;

  // We use expando properties to associate the previous HTML
  // attributes provided as part of the VDOM node with the
  // real VElement DOM node. When diffing attributes,
  // we only use our internal representation of the attributes.
  // When diffing for the first time it's possible that the
  // real VElement node will not have the expando property
  // so we build the attribute map from the expando property

  var oldAttrs = vFromEl.___attributes;

  if (oldAttrs === attrs) {
    // For constant attributes the same object will be provided
    // every render and we can use that to our advantage to
    // not waste time diffing a constant, immutable attribute
    // map.
    return;
  }

  var attrValue;

  if (toFlags & FLAG_SIMPLE_ATTRS && fromFlags & FLAG_SIMPLE_ATTRS) {
    if (oldAttrs["class"] !== (attrValue = attrs["class"])) {
      if (attrValue) {
        fromEl.className = attrValue;
      } else {
        fromEl.removeAttribute("class");
      }
    }
    if (oldAttrs.id !== (attrValue = attrs.id)) {
      if (attrValue) {
        fromEl.id = attrValue;
      } else {
        fromEl.removeAttribute("id");
      }
    }
    if (oldAttrs.style !== (attrValue = attrs.style)) {
      if (attrValue) {
        fromEl.style.cssText = attrValue;
      } else {
        fromEl.removeAttribute("style");
      }
    }
    return;
  }

  var preserve = (props && props.pa) || EMPTY_OBJECT;
  var specialAttrs = specialElHandlers[toEl.___nodeName] || EMPTY_OBJECT;
  var specialAttr;

  // Loop over all of the attributes in the attribute map and compare
  // them to the value in the old map. However, if the value is
  // null/undefined/false then we want to remove the attribute
  for (attrName in attrs) {
    if (
      !preserve[attrName] &&
      normalizeValue(oldAttrs[attrName]) !==
        (attrValue = normalizeValue(attrs[attrName]))
    ) {
      if ((specialAttr = specialAttrs[attrName])) {
        specialAttr(fromEl, attrValue);
      } else if (attrName === ATTR_XLINK_HREF) {
        if (attrValue === undefined) {
          fromEl.removeAttributeNS(NS_XLINK, ATTR_HREF);
        } else {
          fromEl.setAttributeNS(NS_XLINK, ATTR_HREF, attrValue);
        }
      } else if (attrValue === undefined) {
        fromEl.removeAttribute(attrName);
      } else {
        fromEl.setAttribute(attrName, attrValue);
      }
    }
  }

  // If there are any old attributes that are not in the new set of attributes
  // then we need to remove those attributes from the target node
  //
  // NOTE: We can skip this if the the element is keyed and didn't have spread attributes
  //       because we know we already processed all of the attributes for
  //       both the target and original element since target VElement nodes will
  //       have all attributes declared. However, we can only skip if the node
  //       was not a virtualized node (i.e., a node that was not rendered by a
  //       Marko template, but rather a node that was created from an HTML
  //       string or a real DOM node).
  if (toEl.___key === null || fromFlags & FLAG_SPREAD_ATTRS) {
    for (attrName in oldAttrs) {
      if (!(attrName in attrs)) {
        if ((specialAttr = specialAttrs[attrName])) {
          specialAttr(fromEl, undefined);
        } else if (attrName === ATTR_XLINK_HREF) {
          fromEl.removeAttributeNS(ATTR_XLINK_HREF, ATTR_HREF);
        } else {
          fromEl.removeAttribute(attrName);
        }
      }
    }
  }
};

module.exports = VElement;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/VFragment.js":
/*!**********************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/VFragment.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var inherit = __webpack_require__(/*! raptor-util/inherit */ "./node_modules/raptor-util/inherit.js");
var domData = __webpack_require__(/*! ../components/dom-data */ "./node_modules/marko/src/runtime/components/dom-data.js");
var keysByDOMNode = domData.___keyByDOMNode;
var vElementByDOMNode = domData.___vElementByDOMNode;
var createFragmentNode = (__webpack_require__(/*! ./morphdom/fragment */ "./node_modules/marko/src/runtime/vdom/morphdom/fragment.js").___createFragmentNode);
var VNode = __webpack_require__(/*! ./VNode */ "./node_modules/marko/src/runtime/vdom/VNode.js");

function VFragment(key, ownerComponent, preserve) {
  this.___VNode(null /* childCount */, ownerComponent);
  this.___key = key;
  this.___preserve = preserve;
}

VFragment.prototype = {
  ___nodeType: 12,
  ___actualize: function () {
    var fragment = createFragmentNode();
    keysByDOMNode.set(fragment, this.___key);
    vElementByDOMNode.set(fragment, this);
    return fragment;
  },
};

inherit(VFragment, VNode);

module.exports = VFragment;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/VNode.js":
/*!******************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/VNode.js ***!
  \******************************************************/
/***/ ((module) => {

/* jshint newcap:false */
function VNode() {}

VNode.prototype = {
  ___VNode: function (finalChildCount, ownerComponent) {
    this.___finalChildCount = finalChildCount;
    this.___childCount = 0;
    this.___firstChildInternal = null;
    this.___lastChild = null;
    this.___parentNode = null;
    this.___nextSiblingInternal = null;
    this.___ownerComponent = ownerComponent;
  },

  get ___firstChild() {
    var firstChild = this.___firstChildInternal;

    if (firstChild && firstChild.___DocumentFragment) {
      var nestedFirstChild = firstChild.___firstChild;
      // The first child is a DocumentFragment node.
      // If the DocumentFragment node has a first child then we will return that.
      // Otherwise, the DocumentFragment node is not *really* the first child and
      // we need to skip to its next sibling
      return nestedFirstChild || firstChild.___nextSibling;
    }

    return firstChild;
  },

  get ___nextSibling() {
    var nextSibling = this.___nextSiblingInternal;

    if (nextSibling) {
      if (nextSibling.___DocumentFragment) {
        var firstChild = nextSibling.___firstChild;
        return firstChild || nextSibling.___nextSibling;
      }
    } else {
      var parentNode = this.___parentNode;
      if (parentNode && parentNode.___DocumentFragment) {
        return parentNode.___nextSibling;
      }
    }

    return nextSibling;
  },

  ___appendChild: function (child) {
    this.___childCount++;

    if (this.___nodeName === "textarea") {
      if (child.___Text) {
        this.___valueInternal += child.___nodeValue;
      } else {
        throw TypeError();
      }
    } else {
      var lastChild = this.___lastChild;

      child.___parentNode = this;

      if (lastChild) {
        lastChild.___nextSiblingInternal = child;
      } else {
        this.___firstChildInternal = child;
      }

      this.___lastChild = child;
    }

    return child;
  },

  ___finishChild: function finishChild() {
    if (this.___childCount === this.___finalChildCount && this.___parentNode) {
      return this.___parentNode.___finishChild();
    } else {
      return this;
    }
  },

  // ,toJSON: function() {
  //     var clone = Object.assign({
  //         nodeType: this.nodeType
  //     }, this);
  //
  //     for (var k in clone) {
  //         if (k.startsWith('_')) {
  //             delete clone[k];
  //         }
  //     }
  //     delete clone._nextSibling;
  //     delete clone._lastChild;
  //     delete clone.parentNode;
  //     return clone;
  // }
};

module.exports = VNode;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/VText.js":
/*!******************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/VText.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var inherit = __webpack_require__(/*! raptor-util/inherit */ "./node_modules/raptor-util/inherit.js");
var VNode = __webpack_require__(/*! ./VNode */ "./node_modules/marko/src/runtime/vdom/VNode.js");

function VText(value, ownerComponent) {
  this.___VNode(-1 /* no children */, ownerComponent);
  this.___nodeValue = value;
}

VText.prototype = {
  ___Text: true,

  ___nodeType: 3,

  ___actualize: function (host) {
    return (host.ownerDocument || host).createTextNode(this.___nodeValue);
  },

  ___cloneNode: function () {
    return new VText(this.___nodeValue);
  },
};

inherit(VText, VNode);

module.exports = VText;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/helpers/attrs.js":
/*!**************************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/helpers/attrs.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var complain =  true && __webpack_require__(/*! complain */ "./node_modules/complain/index.js");
var classHelper = __webpack_require__(/*! ../../helpers/class-value */ "./node_modules/marko/src/runtime/helpers/class-value.js");
var styleHelper = __webpack_require__(/*! ../../helpers/style-value */ "./node_modules/marko/src/runtime/helpers/style-value.js");
var parseHTML = __webpack_require__(/*! ../parse-html */ "./node_modules/marko/src/runtime/vdom/parse-html.js");

/**
 * Helper for processing dynamic attributes
 */
module.exports = function (attributes) {
  if (typeof attributes === "string") {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      complain(
        "Passing a string as a dynamic attribute value is deprecated - More details: https://github.com/marko-js/marko/wiki/Deprecation:-String-as-dynamic-attribute-value",
      );
    }
    return parseAttrs(attributes);
  }

  if (attributes) {
    var newAttributes = {};

    for (var attrName in attributes) {
      var val = attributes[attrName];
      if (attrName === "renderBody") {
        continue;
      }

      if (attrName === "class") {
        val = classHelper(val);
      } else if (attrName === "style") {
        val = styleHelper(val);
      }

      newAttributes[attrName] = val;
    }

    return newAttributes;
  }

  return attributes;
};

function parseAttrs(str) {
  if (str === "") {
    return {};
  }

  var attrs = parseHTML("<a " + str + ">").attributes;
  var result = {};
  var attr;

  for (var len = attrs.length, i = 0; i < len; i++) {
    attr = attrs[i];
    result[attr.name] = attr.value;
  }

  return result;
}


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/index.js":
/*!******************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


window.Marko = {
  Component: function () {},
};

/**
 * Method is for internal usage only. This method
 * is invoked by code in a compiled Marko template and
 * it is used to create a new Template instance.
 * @private
 */
exports.t = function createTemplate(typeName) {
  return new Template(typeName);
};

function Template(typeName) {
  this.path = this.___typeName = typeName;
}

var AsyncVDOMBuilder = __webpack_require__(/*! ./AsyncVDOMBuilder */ "./node_modules/marko/src/runtime/vdom/AsyncVDOMBuilder.js");
(__webpack_require__(/*! ../createOut */ "./node_modules/marko/src/runtime/createOut.js").___setCreateOut)(
  (Template.prototype.createOut = function createOut(
    globalData,
    parent,
    parentOut,
  ) {
    return new AsyncVDOMBuilder(globalData, parent, parentOut);
  }),
);

__webpack_require__(/*! ../renderable */ "./node_modules/marko/src/runtime/renderable.js")(Template.prototype);


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/morphdom/fragment.js":
/*!******************************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/morphdom/fragment.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var helpers = __webpack_require__(/*! ./helpers */ "./node_modules/marko/src/runtime/vdom/morphdom/helpers.js");
var insertBefore = helpers.___insertBefore;

var fragmentPrototype = {
  nodeType: 12,
  get firstChild() {
    var firstChild = this.startNode.nextSibling;
    return firstChild === this.endNode ? undefined : firstChild;
  },
  get lastChild() {
    var lastChild = this.endNode.previousSibling;
    return lastChild === this.startNode ? undefined : lastChild;
  },
  get parentNode() {
    var parentNode = this.startNode.parentNode;
    return parentNode === this.detachedContainer ? undefined : parentNode;
  },
  get namespaceURI() {
    return this.startNode.parentNode.namespaceURI;
  },
  get nextSibling() {
    return this.endNode.nextSibling;
  },
  get nodes() {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      if (this.___markersRemovedError) {
        throw this.___markersRemovedError("Cannot get fragment nodes.");
      }
    }
    var nodes = [];
    var current = this.startNode;
    while (current !== this.endNode) {
      nodes.push(current);
      current = current.nextSibling;
    }
    nodes.push(current);
    return nodes;
  },
  insertBefore: function (newChildNode, referenceNode) {
    var actualReference = referenceNode == null ? this.endNode : referenceNode;
    return insertBefore(
      newChildNode,
      actualReference,
      this.startNode.parentNode,
    );
  },
  insertInto: function (newParentNode, referenceNode) {
    this.nodes.forEach(function (node) {
      insertBefore(node, referenceNode, newParentNode);
    }, this);
    return this;
  },
  remove: function () {
    this.nodes.forEach(function (node) {
      this.detachedContainer.appendChild(node);
    }, this);
  },
};

function createFragmentNode(startNode, nextNode, parentNode) {
  var fragment = Object.create(fragmentPrototype);
  var isRoot = startNode && startNode.ownerDocument === startNode.parentNode;
  fragment.startNode = isRoot
    ? document.createComment("")
    : document.createTextNode("");
  fragment.endNode = isRoot
    ? document.createComment("")
    : document.createTextNode("");
  fragment.startNode.fragment = fragment;
  fragment.endNode.fragment = fragment;
  var detachedContainer = (fragment.detachedContainer =
    document.createDocumentFragment());
  parentNode =
    parentNode || (startNode && startNode.parentNode) || detachedContainer;
  insertBefore(fragment.startNode, startNode, parentNode);
  insertBefore(fragment.endNode, nextNode, parentNode);
  return fragment;
}

function beginFragmentNode(startNode, parentNode) {
  var fragment = createFragmentNode(startNode, null, parentNode);
  fragment.___finishFragment = function (nextNode) {
    fragment.___finishFragment = null;
    insertBefore(
      fragment.endNode,
      nextNode,
      parentNode || startNode.parentNode,
    );
  };
  return fragment;
}

exports.___createFragmentNode = createFragmentNode;
exports.___beginFragmentNode = beginFragmentNode;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/morphdom/helpers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/morphdom/helpers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

function insertBefore(node, referenceNode, parentNode) {
  if (node.insertInto) {
    return node.insertInto(parentNode, referenceNode);
  }
  return parentNode.insertBefore(
    node,
    (referenceNode && referenceNode.startNode) || referenceNode,
  );
}

function insertAfter(node, referenceNode, parentNode) {
  return insertBefore(
    node,
    referenceNode && referenceNode.nextSibling,
    parentNode,
  );
}

function nextSibling(node) {
  var next = node.nextSibling;
  var fragment = next && next.fragment;
  if (fragment) {
    return next === fragment.startNode ? fragment : null;
  }
  return next;
}

function firstChild(node) {
  var next = node.firstChild;
  return (next && next.fragment) || next;
}

function removeChild(node) {
  if (node.remove) node.remove();
  else node.parentNode.removeChild(node);
}

exports.___insertBefore = insertBefore;
exports.___insertAfter = insertAfter;
exports.___nextSibling = nextSibling;
exports.___firstChild = firstChild;
exports.___removeChild = removeChild;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/morphdom/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/morphdom/index.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var componentsUtil = __webpack_require__(/*! @internal/components-util */ "./node_modules/marko/src/node_modules/@internal/components-util/index-browser.js");
var existingComponentLookup = componentsUtil.___componentLookup;
var destroyNodeRecursive = componentsUtil.___destroyNodeRecursive;
var addComponentRootToKeyedElements =
  componentsUtil.___addComponentRootToKeyedElements;
var normalizeComponentKey = componentsUtil.___normalizeComponentKey;
var domData = __webpack_require__(/*! ../../components/dom-data */ "./node_modules/marko/src/runtime/components/dom-data.js");
var eventDelegation = __webpack_require__(/*! ../../components/event-delegation */ "./node_modules/marko/src/runtime/components/event-delegation.js");
var KeySequence = __webpack_require__(/*! ../../components/KeySequence */ "./node_modules/marko/src/runtime/components/KeySequence.js");
var VElement = (__webpack_require__(/*! ../vdom */ "./node_modules/marko/src/runtime/vdom/vdom.js").___VElement);
var fragment = __webpack_require__(/*! ./fragment */ "./node_modules/marko/src/runtime/vdom/morphdom/fragment.js");
var helpers = __webpack_require__(/*! ./helpers */ "./node_modules/marko/src/runtime/vdom/morphdom/helpers.js");
var virtualizeElement = VElement.___virtualize;
var morphAttrs = VElement.___morphAttrs;
var keysByDOMNode = domData.___keyByDOMNode;
var componentByDOMNode = domData.___componentByDOMNode;
var vElementByDOMNode = domData.___vElementByDOMNode;
var detachedByDOMNode = domData.___detachedByDOMNode;

var insertBefore = helpers.___insertBefore;
var insertAfter = helpers.___insertAfter;
var nextSibling = helpers.___nextSibling;
var firstChild = helpers.___firstChild;
var removeChild = helpers.___removeChild;
var createFragmentNode = fragment.___createFragmentNode;
var beginFragmentNode = fragment.___beginFragmentNode;

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var COMPONENT_NODE = 2;
var FRAGMENT_NODE = 12;
var DOCTYPE_NODE = 10;

// var FLAG_SIMPLE_ATTRS = 1;
// var FLAG_CUSTOM_ELEMENT = 2;
// var FLAG_SPREAD_ATTRS = 4;

function isAutoKey(key) {
  return key[0] !== "@";
}

function compareNodeNames(fromEl, toEl) {
  return fromEl.___nodeName === toEl.___nodeName;
}

function caseInsensitiveCompare(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function onNodeAdded(node, componentsContext) {
  if (node.nodeType === ELEMENT_NODE) {
    eventDelegation.___handleNodeAttach(node, componentsContext);
  }
}

function morphdom(fromNode, toNode, host, componentsContext) {
  var globalComponentsContext;
  var isHydrate = false;
  var keySequences = Object.create(null);

  if (componentsContext) {
    globalComponentsContext = componentsContext.___globalContext;
    isHydrate = globalComponentsContext.___isHydrate;
  }

  function insertVirtualNodeBefore(
    vNode,
    key,
    referenceEl,
    parentEl,
    ownerComponent,
    parentComponent,
  ) {
    var realNode = vNode.___actualize(host, parentEl.namespaceURI);
    insertBefore(realNode, referenceEl, parentEl);

    if (
      vNode.___nodeType === ELEMENT_NODE ||
      vNode.___nodeType === FRAGMENT_NODE
    ) {
      if (key) {
        keysByDOMNode.set(realNode, key);
        (isAutoKey(key) ? parentComponent : ownerComponent).___keyedElements[
          key
        ] = realNode;
      }

      if (vNode.___nodeName !== "textarea") {
        morphChildren(realNode, vNode, parentComponent);
      }

      onNodeAdded(realNode, componentsContext);
    }
  }

  function insertVirtualComponentBefore(
    vComponent,
    referenceNode,
    referenceNodeParentEl,
    component,
    key,
    ownerComponent,
    parentComponent,
  ) {
    var rootNode = (component.___rootNode = insertBefore(
      createFragmentNode(),
      referenceNode,
      referenceNodeParentEl,
    ));
    componentByDOMNode.set(rootNode, component);

    if (key && ownerComponent) {
      key = normalizeComponentKey(key, parentComponent.id);
      addComponentRootToKeyedElements(
        ownerComponent.___keyedElements,
        key,
        rootNode,
        component.id,
      );
      keysByDOMNode.set(rootNode, key);
    }

    morphComponent(component, vComponent);
  }

  function morphComponent(component, vComponent) {
    morphChildren(component.___rootNode, vComponent, component);
  }

  var detachedNodes = [];

  function detachNode(node, parentNode, ownerComponent) {
    if (node.nodeType === ELEMENT_NODE || node.nodeType === FRAGMENT_NODE) {
      detachedNodes.push(node);
      detachedByDOMNode.set(node, ownerComponent || true);
    } else {
      destroyNodeRecursive(node);
      removeChild(node);
    }
  }

  function destroyComponent(component) {
    component.destroy();
  }

  function morphChildren(fromNode, toNode, parentComponent) {
    var curFromNodeChild = firstChild(fromNode);
    var curToNodeChild = toNode.___firstChild;

    var curToNodeKey;
    var curFromNodeKey;
    var curToNodeType;

    var fromNextSibling;
    var toNextSibling;
    var matchingFromEl;
    var matchingFromComponent;
    var curVFromNodeChild;
    var fromComponent;

    outer: while (curToNodeChild) {
      toNextSibling = curToNodeChild.___nextSibling;
      curToNodeType = curToNodeChild.___nodeType;
      curToNodeKey = curToNodeChild.___key;

      // Skip <!doctype>
      if (curFromNodeChild && curFromNodeChild.nodeType === DOCTYPE_NODE) {
        curFromNodeChild = nextSibling(curFromNodeChild);
      }

      var ownerComponent = curToNodeChild.___ownerComponent || parentComponent;
      var referenceComponent;

      if (curToNodeType === COMPONENT_NODE) {
        var component = curToNodeChild.___component;
        if (
          (matchingFromComponent = existingComponentLookup[component.id]) ===
          undefined
        ) {
          if (isHydrate) {
            var rootNode = beginFragmentNode(curFromNodeChild, fromNode);
            component.___rootNode = rootNode;
            componentByDOMNode.set(rootNode, component);

            if (ownerComponent && curToNodeKey) {
              curToNodeKey = normalizeComponentKey(
                curToNodeKey,
                parentComponent.id,
              );
              addComponentRootToKeyedElements(
                ownerComponent.___keyedElements,
                curToNodeKey,
                rootNode,
                component.id,
              );

              keysByDOMNode.set(rootNode, curToNodeKey);
            }

            morphComponent(component, curToNodeChild);

            curFromNodeChild = nextSibling(rootNode);
          } else {
            insertVirtualComponentBefore(
              curToNodeChild,
              curFromNodeChild,
              fromNode,
              component,
              curToNodeKey,
              ownerComponent,
              parentComponent,
            );
          }
        } else {
          if (matchingFromComponent.___rootNode !== curFromNodeChild) {
            if (
              curFromNodeChild &&
              (fromComponent = componentByDOMNode.get(curFromNodeChild)) &&
              globalComponentsContext.___renderedComponentsById[
                fromComponent.id
              ] === undefined
            ) {
              // The component associated with the current real DOM node was not rendered
              // so we should just remove it out of the real DOM by destroying it
              curFromNodeChild = nextSibling(fromComponent.___rootNode);
              destroyComponent(fromComponent);
              continue;
            }

            // We need to move the existing component into
            // the correct location
            insertBefore(
              matchingFromComponent.___rootNode,
              curFromNodeChild,
              fromNode,
            );
          } else {
            curFromNodeChild =
              curFromNodeChild && nextSibling(curFromNodeChild);
          }

          if (!curToNodeChild.___preserve) {
            morphComponent(component, curToNodeChild);
          }
        }

        curToNodeChild = toNextSibling;
        continue;
      } else if (curToNodeKey) {
        curVFromNodeChild = undefined;
        curFromNodeKey = undefined;
        var curToNodeKeyOriginal = curToNodeKey;

        if (isAutoKey(curToNodeKey)) {
          if (ownerComponent !== parentComponent) {
            curToNodeKey += ":" + ownerComponent.id;
          }
          referenceComponent = parentComponent;
        } else {
          referenceComponent = ownerComponent;
        }

        // We have a keyed element. This is the fast path for matching
        // up elements
        curToNodeKey = (
          keySequences[referenceComponent.id] ||
          (keySequences[referenceComponent.id] = new KeySequence())
        ).___nextKey(curToNodeKey);

        if (curFromNodeChild) {
          curFromNodeKey = keysByDOMNode.get(curFromNodeChild);
          curVFromNodeChild = vElementByDOMNode.get(curFromNodeChild);
          fromNextSibling = nextSibling(curFromNodeChild);
        }

        if (curFromNodeKey === curToNodeKey) {
          // Elements line up. Now we just have to make sure they are compatible
          if (!curToNodeChild.___preserve) {
            // We just skip over the fromNode if it is preserved

            if (
              curVFromNodeChild &&
              curToNodeType === curVFromNodeChild.___nodeType &&
              (curToNodeType !== ELEMENT_NODE ||
                compareNodeNames(curToNodeChild, curVFromNodeChild))
            ) {
              if (curToNodeType === ELEMENT_NODE) {
                morphEl(
                  curFromNodeChild,
                  curVFromNodeChild,
                  curToNodeChild,
                  parentComponent,
                );
              } else {
                morphChildren(
                  curFromNodeChild,
                  curToNodeChild,
                  parentComponent,
                );
              }
            } else {
              // Remove the old node
              detachNode(curFromNodeChild, fromNode, ownerComponent);

              // Incompatible nodes. Just move the target VNode into the DOM at this position
              insertVirtualNodeBefore(
                curToNodeChild,
                curToNodeKey,
                curFromNodeChild,
                fromNode,
                ownerComponent,
                parentComponent,
              );
            }
          }
        } else {
          matchingFromEl = referenceComponent.___keyedElements[curToNodeKey];
          if (
            matchingFromEl === undefined ||
            matchingFromEl === curFromNodeChild
          ) {
            if (isHydrate && curFromNodeChild) {
              if (
                curFromNodeChild.nodeType === ELEMENT_NODE &&
                (curToNodeChild.___preserve ||
                  caseInsensitiveCompare(
                    curFromNodeChild.nodeName,
                    curToNodeChild.___nodeName || "",
                  ))
              ) {
                curVFromNodeChild = virtualizeElement(curFromNodeChild);
                curVFromNodeChild.___nodeName = curToNodeChild.___nodeName;
                keysByDOMNode.set(curFromNodeChild, curToNodeKey);
                referenceComponent.___keyedElements[curToNodeKey] =
                  curFromNodeChild;

                if (curToNodeChild.___preserve) {
                  vElementByDOMNode.set(curFromNodeChild, curVFromNodeChild);
                } else {
                  morphEl(
                    curFromNodeChild,
                    curVFromNodeChild,
                    curToNodeChild,
                    parentComponent,
                  );
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue;
              } else if (
                curToNodeChild.___nodeType === FRAGMENT_NODE &&
                curFromNodeChild.nodeType === COMMENT_NODE
              ) {
                var content = curFromNodeChild.nodeValue;
                if (content == "F#" + curToNodeKeyOriginal) {
                  var endNode = curFromNodeChild.nextSibling;
                  var depth = 0;
                  var nodeValue;

                  // eslint-disable-next-line no-constant-condition
                  while (true) {
                    if (endNode.nodeType === COMMENT_NODE) {
                      nodeValue = endNode.nodeValue;
                      if (nodeValue === "F/") {
                        if (depth === 0) {
                          break;
                        } else {
                          depth--;
                        }
                      } else if (nodeValue.indexOf("F#") === 0) {
                        depth++;
                      }
                    }
                    endNode = endNode.nextSibling;
                  }

                  var fragment = createFragmentNode(
                    curFromNodeChild,
                    endNode.nextSibling,
                    fromNode,
                  );
                  keysByDOMNode.set(fragment, curToNodeKey);
                  vElementByDOMNode.set(fragment, curToNodeChild);
                  referenceComponent.___keyedElements[curToNodeKey] = fragment;
                  removeChild(curFromNodeChild);
                  removeChild(endNode);

                  if (!curToNodeChild.___preserve) {
                    morphChildren(fragment, curToNodeChild, parentComponent);
                  }

                  curToNodeChild = toNextSibling;
                  curFromNodeChild = fragment.nextSibling;
                  continue;
                }
              }
            }

            insertVirtualNodeBefore(
              curToNodeChild,
              curToNodeKey,
              curFromNodeChild,
              fromNode,
              ownerComponent,
              parentComponent,
            );
            fromNextSibling = curFromNodeChild;
          } else {
            if (detachedByDOMNode.get(matchingFromEl) !== undefined) {
              detachedByDOMNode.set(matchingFromEl, undefined);
            }

            if (!curToNodeChild.___preserve) {
              curVFromNodeChild = vElementByDOMNode.get(matchingFromEl);

              if (
                curVFromNodeChild &&
                curToNodeType === curVFromNodeChild.___nodeType &&
                (curToNodeType !== ELEMENT_NODE ||
                  compareNodeNames(curVFromNodeChild, curToNodeChild))
              ) {
                if (fromNextSibling === matchingFromEl) {
                  // Single element removal:
                  // A <-> A
                  // B <-> C <-- We are here
                  // C     D
                  // D
                  //
                  // Single element swap:
                  // A <-> A
                  // B <-> C <-- We are here
                  // C     B

                  if (
                    toNextSibling &&
                    toNextSibling.___key === curFromNodeKey
                  ) {
                    // Single element swap

                    // We want to stay on the current real DOM node
                    fromNextSibling = curFromNodeChild;

                    // But move the matching element into place
                    insertBefore(matchingFromEl, curFromNodeChild, fromNode);
                  } else {
                    // Single element removal

                    // We need to remove the current real DOM node
                    // and the matching real DOM node will fall into
                    // place. We will continue diffing with next sibling
                    // after the real DOM node that just fell into place
                    fromNextSibling = nextSibling(fromNextSibling);

                    if (curFromNodeChild) {
                      detachNode(curFromNodeChild, fromNode, ownerComponent);
                    }
                  }
                } else {
                  // A <-> A
                  // B <-> D <-- We are here
                  // C
                  // D

                  // We need to move the matching node into place
                  insertAfter(matchingFromEl, curFromNodeChild, fromNode);

                  if (curFromNodeChild) {
                    detachNode(curFromNodeChild, fromNode, ownerComponent);
                  }
                }

                if (curToNodeType === ELEMENT_NODE) {
                  morphEl(
                    matchingFromEl,
                    curVFromNodeChild,
                    curToNodeChild,
                    parentComponent,
                  );
                } else {
                  morphChildren(
                    matchingFromEl,
                    curToNodeChild,
                    parentComponent,
                  );
                }
              } else {
                insertVirtualNodeBefore(
                  curToNodeChild,
                  curToNodeKey,
                  curFromNodeChild,
                  fromNode,
                  ownerComponent,
                  parentComponent,
                );
                detachNode(matchingFromEl, fromNode, ownerComponent);
              }
            } else {
              // preserve the node
              // but still we need to diff the current from node
              insertBefore(matchingFromEl, curFromNodeChild, fromNode);
              fromNextSibling = curFromNodeChild;
            }
          }
        }

        curToNodeChild = toNextSibling;
        curFromNodeChild = fromNextSibling;
        continue;
      }

      // The know the target node is not a VComponent node and we know
      // it is also not a preserve node. Let's now match up the HTML
      // element, text node, comment, etc.
      while (curFromNodeChild) {
        fromNextSibling = nextSibling(curFromNodeChild);

        if ((fromComponent = componentByDOMNode.get(curFromNodeChild))) {
          // The current "to" element is not associated with a component,
          // but the current "from" element is associated with a component

          // Even if we destroy the current component in the original
          // DOM or not, we still need to skip over it since it is
          // not compatible with the current "to" node
          curFromNodeChild = fromNextSibling;

          if (
            !globalComponentsContext.___renderedComponentsById[fromComponent.id]
          ) {
            destroyComponent(fromComponent);
          }

          continue; // Move to the next "from" node
        }

        var curFromNodeType = curFromNodeChild.nodeType;

        var isCompatible = undefined;

        if (curFromNodeType === curToNodeType) {
          if (curFromNodeType === ELEMENT_NODE) {
            // Both nodes being compared are Element nodes
            curVFromNodeChild = vElementByDOMNode.get(curFromNodeChild);
            if (curVFromNodeChild === undefined) {
              if (isHydrate) {
                curVFromNodeChild = virtualizeElement(curFromNodeChild);

                if (
                  caseInsensitiveCompare(
                    curVFromNodeChild.___nodeName,
                    curToNodeChild.___nodeName,
                  )
                ) {
                  curVFromNodeChild.___nodeName = curToNodeChild.___nodeName;
                }
              } else {
                // Skip over nodes that don't look like ours...
                curFromNodeChild = fromNextSibling;
                continue;
              }
            } else if ((curFromNodeKey = curVFromNodeChild.___key)) {
              // We have a keyed element here but our target VDOM node
              // is not keyed so this not doesn't belong
              isCompatible = false;
            }

            isCompatible =
              isCompatible !== false &&
              compareNodeNames(curVFromNodeChild, curToNodeChild) === true;

            if (isCompatible === true) {
              // We found compatible DOM elements so transform
              // the current "from" node to match the current
              // target DOM node.
              morphEl(
                curFromNodeChild,
                curVFromNodeChild,
                curToNodeChild,
                parentComponent,
              );
            }
          } else if (
            curFromNodeType === TEXT_NODE ||
            curFromNodeType === COMMENT_NODE
          ) {
            // Both nodes being compared are Text or Comment nodes
            isCompatible = true;
            var curToNodeValue = curToNodeChild.___nodeValue;
            var curFromNodeValue = curFromNodeChild.nodeValue;
            if (curFromNodeValue !== curToNodeValue) {
              if (
                isHydrate &&
                toNextSibling &&
                curFromNodeType === TEXT_NODE &&
                toNextSibling.___nodeType === TEXT_NODE &&
                curFromNodeValue.startsWith(curToNodeValue) &&
                toNextSibling.___nodeValue.startsWith(
                  curFromNodeValue.slice(curToNodeValue.length),
                )
              ) {
                // In hydrate mode we can use splitText to more efficiently handle
                // adjacent text vdom nodes that were merged.
                fromNextSibling = curFromNodeChild.splitText(
                  curToNodeValue.length,
                );
              } else {
                // Simply update nodeValue on the original node to
                // change the text value
                curFromNodeChild.nodeValue = curToNodeValue;
              }
            }
          }
        }

        if (isCompatible === true) {
          // Advance both the "to" child and the "from" child since we found a match
          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;
          continue outer;
        }

        detachNode(curFromNodeChild, fromNode, ownerComponent);
        curFromNodeChild = fromNextSibling;
      } // END: while (curFromNodeChild)

      // If we got this far then we did not find a candidate match for
      // our "to node" and we exhausted all of the children "from"
      // nodes. Therefore, we will just append the current "to" node
      // to the end
      insertVirtualNodeBefore(
        curToNodeChild,
        curToNodeKey,
        curFromNodeChild,
        fromNode,
        ownerComponent,
        parentComponent,
      );

      curToNodeChild = toNextSibling;
      curFromNodeChild = fromNextSibling;
    }

    // We have processed all of the "to nodes".
    if (fromNode.___finishFragment) {
      // If we are in an unfinished fragment, we have reached the end of the nodes
      // we were matching up and need to end the fragment
      fromNode.___finishFragment(curFromNodeChild);
    } else {
      // If curFromNodeChild is non-null then we still have some from nodes
      // left over that need to be removed
      var fragmentBoundary =
        fromNode.nodeType === FRAGMENT_NODE ? fromNode.endNode : null;

      while (curFromNodeChild && curFromNodeChild !== fragmentBoundary) {
        fromNextSibling = nextSibling(curFromNodeChild);

        if ((fromComponent = componentByDOMNode.get(curFromNodeChild))) {
          curFromNodeChild = fromNextSibling;
          if (
            !globalComponentsContext.___renderedComponentsById[fromComponent.id]
          ) {
            destroyComponent(fromComponent);
          }
          continue;
        }

        curVFromNodeChild = vElementByDOMNode.get(curFromNodeChild);
        curFromNodeKey = keysByDOMNode.get(fromNode);

        // For transcluded content, we need to check if the element belongs to a different component
        // context than the current component and ensure it gets removed from its key index.
        if (!curFromNodeKey || isAutoKey(curFromNodeKey)) {
          referenceComponent = parentComponent;
        } else {
          referenceComponent =
            curVFromNodeChild && curVFromNodeChild.___ownerComponent;
        }

        detachNode(curFromNodeChild, fromNode, referenceComponent);

        curFromNodeChild = fromNextSibling;
      }
    }
  }

  function morphEl(fromEl, vFromEl, toEl, parentComponent) {
    var nodeName = toEl.___nodeName;
    var constId = toEl.___constId;
    vElementByDOMNode.set(fromEl, toEl);

    if (constId !== undefined && vFromEl.___constId === constId) {
      return;
    }

    morphAttrs(fromEl, vFromEl, toEl);

    if (toEl.___preserveBody) {
      return;
    }

    if (nodeName === "textarea") {
      if (toEl.___valueInternal !== vFromEl.___valueInternal) {
        fromEl.value = toEl.___valueInternal;
      }
    } else {
      morphChildren(fromEl, toEl, parentComponent);
    }
  } // END: morphEl(...)

  // eslint-disable-next-line no-constant-condition
  if (true) {
    componentsUtil.___stopDOMManipulationWarning(host);
  }

  morphChildren(fromNode, toNode, toNode.___component);

  detachedNodes.forEach(function (node) {
    var detachedFromComponent = detachedByDOMNode.get(node);

    if (detachedFromComponent !== undefined) {
      detachedByDOMNode.set(node, undefined);

      var componentToDestroy = componentByDOMNode.get(node);
      if (componentToDestroy) {
        componentToDestroy.destroy();
      } else if (node.parentNode) {
        destroyNodeRecursive(
          node,
          detachedFromComponent !== true && detachedFromComponent,
        );

        if (eventDelegation.___handleNodeDetach(node) != false) {
          removeChild(node);
        }
      }
    }
  });

  // eslint-disable-next-line no-constant-condition
  if (true) {
    componentsUtil.___startDOMManipulationWarning(host);
  }
}

module.exports = morphdom;


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/parse-html.js":
/*!***********************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/parse-html.js ***!
  \***********************************************************/
/***/ ((module) => {

var parseHTML = function (html) {
  var container = document.createElement("template");
  parseHTML = container.content
    ? function (html) {
        container.innerHTML = html;
        return container.content;
      }
    : function (html) {
        container.innerHTML = html;
        return container;
      };

  return parseHTML(html);
};

module.exports = function (html) {
  return parseHTML(html).firstChild;
};


/***/ }),

/***/ "./node_modules/marko/src/runtime/vdom/vdom.js":
/*!*****************************************************!*\
  !*** ./node_modules/marko/src/runtime/vdom/vdom.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var parseHTML = __webpack_require__(/*! ./parse-html */ "./node_modules/marko/src/runtime/vdom/parse-html.js");
var VComponent = __webpack_require__(/*! ./VComponent */ "./node_modules/marko/src/runtime/vdom/VComponent.js");
var VDocumentFragment = __webpack_require__(/*! ./VDocumentFragment */ "./node_modules/marko/src/runtime/vdom/VDocumentFragment.js");
var VElement = __webpack_require__(/*! ./VElement */ "./node_modules/marko/src/runtime/vdom/VElement.js");
var VFragment = __webpack_require__(/*! ./VFragment */ "./node_modules/marko/src/runtime/vdom/VFragment.js");
var VNode = __webpack_require__(/*! ./VNode */ "./node_modules/marko/src/runtime/vdom/VNode.js");
var VText = __webpack_require__(/*! ./VText */ "./node_modules/marko/src/runtime/vdom/VText.js");

var specialHtmlRegexp = /[&<]/;

function virtualizeChildNodes(node, vdomParent, ownerComponent) {
  var curChild = node.firstChild;
  while (curChild) {
    vdomParent.___appendChild(virtualize(curChild, ownerComponent));
    curChild = curChild.nextSibling;
  }
}

function virtualize(node, ownerComponent) {
  switch (node.nodeType) {
    case 1:
      return VElement.___virtualize(node, virtualizeChildNodes, ownerComponent);
    case 3:
      return new VText(node.nodeValue, ownerComponent);
    case 11:
      var vdomDocFragment = new VDocumentFragment();
      virtualizeChildNodes(node, vdomDocFragment, ownerComponent);
      return vdomDocFragment;
  }
}

function virtualizeHTML(html, ownerComponent) {
  if (!specialHtmlRegexp.test(html)) {
    return new VText(html, ownerComponent);
  }

  var vdomFragment = new VDocumentFragment();
  var curChild = parseHTML(html);

  while (curChild) {
    vdomFragment.___appendChild(virtualize(curChild, ownerComponent));
    curChild = curChild.nextSibling;
  }

  return vdomFragment;
}

var Node_prototype = VNode.prototype;

/**
 * Shorthand method for creating and appending a Text node with a given value
 * @param  {String} value The text value for the new Text node
 */
Node_prototype.t = function (value) {
  var type = typeof value;
  var vdomNode;

  if (type !== "string") {
    if (value == null) {
      value = "";
    } else if (type === "object") {
      if (value.toHTML) {
        vdomNode = virtualizeHTML(value.toHTML());
      }
    }
  }

  this.___appendChild(vdomNode || new VText(value.toString()));
  return this.___finishChild();
};

Node_prototype.___appendDocumentFragment = function () {
  return this.___appendChild(new VDocumentFragment());
};

exports.___VDocumentFragment = VDocumentFragment;
exports.___VElement = VElement;
exports.___VText = VText;
exports.___VComponent = VComponent;
exports.___VFragment = VFragment;
exports.___virtualize = virtualize;
exports.___virtualizeHTML = virtualizeHTML;


/***/ }),

/***/ "./node_modules/raptor-util/copyProps.js":
/*!***********************************************!*\
  !*** ./node_modules/raptor-util/copyProps.js ***!
  \***********************************************/
/***/ ((module) => {

module.exports = function copyProps(from, to) {
    Object.getOwnPropertyNames(from).forEach(function(name) {
        var descriptor = Object.getOwnPropertyDescriptor(from, name);
        Object.defineProperty(to, name, descriptor);
    });
};

/***/ }),

/***/ "./node_modules/raptor-util/extend.js":
/*!********************************************!*\
  !*** ./node_modules/raptor-util/extend.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = function extend(target, source) { //A simple function to copy properties from one object to another
    if (!target) { //Check if a target was provided, otherwise create a new empty object to return
        target = {};
    }

    if (source) {
        for (var propName in source) {
            if (source.hasOwnProperty(propName)) { //Only look at source properties that are not inherited
                target[propName] = source[propName]; //Copy the property
            }
        }
    }

    return target;
};

/***/ }),

/***/ "./node_modules/raptor-util/inherit.js":
/*!*********************************************!*\
  !*** ./node_modules/raptor-util/inherit.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyProps = __webpack_require__(/*! ./copyProps */ "./node_modules/raptor-util/copyProps.js");

function inherit(ctor, superCtor, shouldCopyProps) {
    var oldProto = ctor.prototype;
    var newProto = ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            writable: true,
            configurable: true
        }
    });
    if (oldProto && shouldCopyProps !== false) {
        copyProps(oldProto, newProto);
    }
    ctor.$super = superCtor;
    ctor.prototype = newProto;
    return ctor;
}


module.exports = inherit;
inherit._inherit = inherit;


/***/ }),

/***/ "./node_modules/stackframe/stackframe.js":
/*!***********************************************!*\
  !*** ./node_modules/stackframe/stackframe.js ***!
  \***********************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function() {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function() {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];
    var objectProps = ['evalOrigin'];

    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

    function StackFrame(obj) {
        if (!obj) return;
        for (var i = 0; i < props.length; i++) {
            if (obj[props[i]] !== undefined) {
                this['set' + _capitalize(props[i])](obj[props[i]]);
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function() {
            return this.args;
        },
        setArgs: function(v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function() {
            return this.evalOrigin;
        },
        setEvalOrigin: function(v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function() {
            var fileName = this.getFileName() || '';
            var lineNumber = this.getLineNumber() || '';
            var columnNumber = this.getColumnNumber() || '';
            var functionName = this.getFunctionName() || '';
            if (this.getIsEval()) {
                if (fileName) {
                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                }
                return '[eval]:' + lineNumber + ':' + columnNumber;
            }
            if (functionName) {
                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
            }
            return fileName + ':' + lineNumber + ':' + columnNumber;
        }
    };

    StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf('(');
        var argsEndIndex = str.lastIndexOf(')');

        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
        var locationString = str.substring(argsEndIndex + 1);

        if (locationString.indexOf('@') === 0) {
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
            var fileName = parts[1];
            var lineNumber = parts[2];
            var columnNumber = parts[3];
        }

        return new StackFrame({
            functionName: functionName,
            args: args || undefined,
            fileName: fileName,
            lineNumber: lineNumber || undefined,
            columnNumber: columnNumber || undefined
        });
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
            return function(v) {
                this[p] = Boolean(v);
            };
        })(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
            return function(v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        })(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
            return function(v) {
                this[p] = String(v);
            };
        })(stringProps[k]);
    }

    return StackFrame;
}));


/***/ }),

/***/ "./node_modules/warp10/constants.js":
/*!******************************************!*\
  !*** ./node_modules/warp10/constants.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./src/constants */ "./node_modules/warp10/src/constants.js");

/***/ }),

/***/ "./node_modules/warp10/finalize.js":
/*!*****************************************!*\
  !*** ./node_modules/warp10/finalize.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./src/finalize */ "./node_modules/warp10/src/finalize.js");

/***/ }),

/***/ "./node_modules/warp10/src/constants.js":
/*!**********************************************!*\
  !*** ./node_modules/warp10/src/constants.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var win = typeof window !== "undefined" ? window : __webpack_require__.g;
exports.NOOP = win.$W10NOOP = win.$W10NOOP || function () {};

/***/ }),

/***/ "./node_modules/warp10/src/finalize.js":
/*!*********************************************!*\
  !*** ./node_modules/warp10/src/finalize.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var constants = __webpack_require__(/*! ./constants */ "./node_modules/warp10/src/constants.js");
var isArray = Array.isArray;

function resolve(object, path, len) {
    var current = object;
    for (var i=0; i<len; i++) {
        current = current[path[i]];
    }

    return current;
}

function resolveType(info) {
    if (info.type === 'Date') {
        return new Date(info.value);
    } else if (info.type === 'URL') {
        return new URL(info.value);
    } else if (info.type === 'URLSearchParams') {
        return new URLSearchParams(info.value);
    } else if (info.type === 'NOOP') {
        return constants.NOOP;
    } else {
        throw new Error('Bad type');
    }
}

module.exports = function finalize(outer) {
    if (!outer) {
        return outer;
    }

    var assignments = outer.$$;
    if (assignments) {
        var object = outer.o;
        var len;

        if (assignments && (len=assignments.length)) {
            for (var i=0; i<len; i++) {
                var assignment = assignments[i];

                var rhs = assignment.r;
                var rhsValue;

                if (isArray(rhs)) {
                    rhsValue = resolve(object, rhs, rhs.length);
                } else {
                    rhsValue = resolveType(rhs);
                }

                var lhs = assignment.l;
                var lhsLast = lhs.length-1;

                if (lhsLast === -1) {
                    object = outer.o = rhsValue;
                    break;
                } else {
                    var lhsParent = resolve(object, lhs, lhsLast);
                    lhsParent[lhs[lhsLast]] = rhsValue;
                }
            }
        }

        assignments.length = 0; // Assignments have been applied, do not reapply

        return object == null ? null : object;
    } else {
        return outer;
    }

};

/***/ }),

/***/ "./ui/content.js":
/*!***********************!*\
  !*** ./ui/content.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _marko_home_components_password_marko__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./marko/home/components/password.marko */ "./ui/marko/home/components/password.marko");


let CONTENT = {};

CONTENT.Execute = function() {
  switch(Store.state.action) {
    case Action.UPDATE_HOME_CONTENT:
      let output = Store.state.output;
      switch(Store.state.target) {
        case 'password-button':
          CONTENT.render = _marko_home_components_password_marko__WEBPACK_IMPORTED_MODULE_0__["default"].renderSync().replaceChildrenOf(output);
          break;
      }
      break;
  }
}

Store.Bind(CONTENT.Execute);

/***/ }),

/***/ "./ui/init.js":
/*!********************!*\
  !*** ./ui/init.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _marko_home_home_marko__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./marko/home/home.marko */ "./ui/marko/home/home.marko");

let output = document.getElementById("main-container");

let INIT = {};

INIT.Execute = function() {
  switch(Store.state.action) {
    case Action.START:
      INIT.render = _marko_home_home_marko__WEBPACK_IMPORTED_MODULE_0__["default"].renderSync().replaceChildrenOf(output);
      break;
    case Action.SHOW_HOME:
      INIT.render = _marko_home_home_marko__WEBPACK_IMPORTED_MODULE_0__["default"].renderSync().replaceChildrenOf(output);
    default:
      console.log("error?")
  }
}

Store.Bind(INIT.Execute);

/***/ }),

/***/ "./ui/main_menu/index.js":
/*!*******************************!*\
  !*** ./ui/main_menu/index.js ***!
  \*******************************/
/***/ (() => {

$(function () {
  $('#toolbar').w2toolbar({
      name : 'myToolbar',
      items: [
          { type: 'radio',  id: 'home', group: '1', caption: 'Home', img: 'icon-add', checked: true },
          { type: 'break' },
          { type: 'menu',   id: 'personeMenu', caption: 'Drop Down', img: 'icon-folder', 
              items: [
                  { text: 'Item 1', img: 'icon-page' }, 
                  { text: 'Item 2', img: 'icon-page' }, 
                  { text: 'Item 3', img: 'icon-page' }
              ]
          },
          { type: 'break' },
          { type: 'radio',  id: 'persone',  group: '1', caption: 'Persone', img: 'icon-page' },
          { type: 'radio',  id: 'strutture',  group: '1', caption: 'Strutture', img: 'icon-page' },
          { type: 'spacer' },
          { type: 'button',  id: 'item5',  caption: 'LogOut', class: 'log-out-icon', img: 'icon-logout' }
      ],

      onClick: function(event) {
        switch(event.target) {
          case 'home':
            Store.NewState(showHome());
            break;
          default:
            console.log('no main menu action find');
            break;
        }
      }
  });
});

/***/ }),

/***/ "./utility/utility.js":
/*!****************************!*\
  !*** ./utility/utility.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");


let u = {};

u.makeRequest = function(options) {
  return axios__WEBPACK_IMPORTED_MODULE_0__["default"].request(options)
  .then(res => {
    return res;
  })
  .catch(err => {
    console.log(err);
  })
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (u);


/***/ }),

/***/ "./node_modules/axios/lib/adapters/adapters.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/adapters/adapters.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./http.js */ "./node_modules/axios/lib/helpers/null.js");
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr.js */ "./node_modules/axios/lib/adapters/xhr.js");
/* harmony import */ var _fetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetch.js */ "./node_modules/axios/lib/adapters/fetch.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");






const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetch: _fetch_js__WEBPACK_IMPORTED_MODULE_2__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),

/***/ "./node_modules/axios/lib/adapters/fetch.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/adapters/fetch.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/composeSignals.js */ "./node_modules/axios/lib/helpers/composeSignals.js");
/* harmony import */ var _helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/trackStream.js */ "./node_modules/axios/lib/helpers/trackStream.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/settle.js */ "./node_modules/axios/lib/core/settle.js");










const fetchProgressDecorator = (total, fn) => {
  const lengthComputable = total != null;
  return (loaded) => setTimeout(() => fn({
    lengthComputable,
    total,
    loaded
  }));
}

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const supportsRequestStream = isReadableStreamSupported && (() => {
  let duplexAccessed = false;

  const hasContentType = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
})();

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported && !!(()=> {
  try {
    return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isReadableStream(new Response('').body);
  } catch(err) {
    // return undefined
  }
})();

const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"](`Response type '${type}' is not supported`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isBlob(body)) {
    return body.size;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isSpecCompliantForm(body)) {
    return (await new Request(body).arrayBuffer()).byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBufferView(body)) {
    return body.byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isURLSearchParams(body)) {
    body = body + '';
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let [composedSignal, stopTimeout] = (signal || cancelToken || timeout) ?
    (0,_helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__["default"])([signal, cancelToken], timeout) : [];

  let finished, request;

  const onFinish = () => {
    !finished && setTimeout(() => {
      composedSignal && composedSignal.unsubscribe();
    });

    finished = true;
  }

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        data = (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_5__.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, fetchProgressDecorator(
          requestContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(onUploadProgress)
        ), null, encodeText);
      }
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(withCredentials)) {
      withCredentials = withCredentials ? 'cors' : 'omit';
    }

    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      withCredentials
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(response.headers.get('content-length'));

      response = new Response(
        (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_5__.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onDownloadProgress && fetchProgressDecorator(
          responseContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(onDownloadProgress, true)
        ), isStreamResponse && onFinish, encodeText),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && onFinish();

    stopTimeout && stopTimeout();

    return await new Promise((resolve, reject) => {
      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_7__["default"])(resolve, reject, {
        data: responseData,
        headers: _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__["default"].from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    onFinish();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].from(err, err && err.code, config, request);
  }
}));




/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../core/settle.js */ "./node_modules/axios/lib/core/settle.js");
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers/parseProtocol.js */ "./node_modules/axios/lib/helpers/parseProtocol.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])(config);
    let requestData = _config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(_config.headers).normalize();
    let {responseType} = _config;
    let onCanceled;
    function done() {
      if (_config.cancelToken) {
        _config.cancelToken.unsubscribe(onCanceled);
      }

      if (_config.signal) {
        _config.signal.removeEventListener('abort', onCanceled);
      }
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED, _config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_NETWORK, _config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__["default"];
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED,
        _config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (typeof _config.onDownloadProgress === 'function') {
      request.addEventListener('progress', (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof _config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_config.onUploadProgress));
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__["default"])(_config.url);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_9__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Axios.js */ "./node_modules/axios/lib/core/Axios.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cancel/CancelToken.js */ "./node_modules/axios/lib/cancel/CancelToken.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./helpers/spread.js */ "./node_modules/axios/lib/helpers/spread.js");
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/isAxiosError.js */ "./node_modules/axios/lib/helpers/isAxiosError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./helpers/HttpStatusCode.js */ "./node_modules/axios/lib/helpers/HttpStatusCode.js");




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__["default"].getAdapter;

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (axios);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelToken);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanceledError);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isCancel)
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InterceptorManager.js */ "./node_modules/axios/lib/core/InterceptorManager.js");
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dispatchRequest.js */ "./node_modules/axios/lib/core/dispatchRequest.js");
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/validator.js */ "./node_modules/axios/lib/helpers/validator.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;

        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Axios);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosError);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosHeaders.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosHeaders.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/parseHeaders.js */ "./node_modules/axios/lib/helpers/parseHeaders.js");





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosHeaders);


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InterceptorManager);


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildFullPath)
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/isAbsoluteURL.js */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/combineURLs.js */ "./node_modules/axios/lib/helpers/combineURLs.js");





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL)) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dispatchRequest)
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transformData.js */ "./node_modules/axios/lib/core/transformData.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeConfig)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ settle)
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ transformData)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/toURLEncodedForm.js */ "./node_modules/axios/lib/helpers/toURLEncodedForm.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isResponse(data) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)) {
      return data;
    }

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = "1.7.2";

/***/ }),

/***/ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosURLSearchParams);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/HttpStatusCode.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/HttpStatusCode.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HttpStatusCode);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bind)
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildURL)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ combineURLs)
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/composeSignals.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/composeSignals.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");



const composeSignals = (signals, timeout) => {
  let controller = new AbortController();

  let aborted;

  const onabort = function (cancel) {
    if (!aborted) {
      aborted = true;
      unsubscribe();
      const err = cancel instanceof Error ? cancel : this.reason;
      controller.abort(err instanceof _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? err : new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__["default"](err instanceof Error ? err.message : err));
    }
  }

  let timer = timeout && setTimeout(() => {
    onabort(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](`timeout ${timeout} of ms exceeded`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ETIMEDOUT))
  }, timeout)

  const unsubscribe = () => {
    if (signals) {
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach(signal => {
        signal &&
        (signal.removeEventListener ? signal.removeEventListener('abort', onabort) : signal.unsubscribe(onabort));
      });
      signals = null;
    }
  }

  signals.forEach((signal) => signal && signal.addEventListener && signal.addEventListener('abort', onabort));

  const {signal} = controller;

  signal.unsubscribe = unsubscribe;

  return [signal, () => {
    timer && clearTimeout(timer);
    timer = null;
  }];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (composeSignals);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path) && cookie.push('path=' + path);

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });



/***/ }),

/***/ "./node_modules/axios/lib/helpers/formDataToJSON.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/formDataToJSON.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formDataToJSON);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAbsoluteURL)
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAxiosError)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// eslint-disable-next-line strict
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (null);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseProtocol)
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/progressEventReducer.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/progressEventReducer.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedometer.js */ "./node_modules/axios/lib/helpers/speedometer.js");
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./throttle.js */ "./node_modules/axios/lib/helpers/throttle.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = (0,_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return (0,_throttle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  }, freq);
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/resolveConfig.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/resolveConfig.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isURLSameOrigin.js */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
/* harmony import */ var _cookies_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cookies.js */ "./node_modules/axios/lib/helpers/cookies.js");
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _buildURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((config) => {
  const newConfig = (0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(headers);

  newConfig.url = (0,_buildURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__["default"])(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFormData(data)) {
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv) {
    withXSRFToken && _utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && (0,_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__["default"])(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && _cookies_js__WEBPACK_IMPORTED_MODULE_7__["default"].read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});



/***/ }),

/***/ "./node_modules/axios/lib/helpers/speedometer.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/speedometer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedometer);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ spread)
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/throttle.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/throttle.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1000 / freq;
  let timer = null;
  return function throttled() {
    const force = this === true;

    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, arguments);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        timestamp = Date.now();
        return fn.apply(null, arguments);
      }, threshold - (now - timestamp));
    }
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (throttle);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/node/classes/FormData.js */ "./node_modules/axios/lib/helpers/null.js");




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSpecCompliantForm(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        ((_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]')) && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toFormData);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toURLEncodedForm.js":
/*!************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toURLEncodedForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toURLEncodedForm)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/trackStream.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/trackStream.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readBytes: () => (/* binding */ readBytes),
/* harmony export */   streamChunk: () => (/* binding */ streamChunk),
/* harmony export */   trackStream: () => (/* binding */ trackStream)
/* harmony export */ });


const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize, encode) {
  for await (const chunk of iterable) {
    yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : (await encode(String(chunk))), chunkSize);
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish, encode) => {
  const iterator = readBytes(stream, chunkSize, encode);

  let bytes = 0;

  return new ReadableStream({
    type: 'bytes',

    async pull(controller) {
      const {done, value} = await iterator.next();

      if (done) {
        controller.close();
        onFinish();
        return;
      }

      let len = value.byteLength;
      onProgress && onProgress(bytes += len);
      controller.enqueue(new Uint8Array(value));
    },
    cancel(reason) {
      onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assertOptions,
  validators
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/Blob.js":
/*!*****************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/Blob.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof Blob !== 'undefined' ? Blob : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/FormData.js":
/*!*********************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/FormData.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof FormData !== 'undefined' ? FormData : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":
/*!****************************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/URLSearchParams.js */ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js");
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/FormData.js */ "./node_modules/axios/lib/platform/browser/classes/FormData.js");
/* harmony import */ var _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/Blob.js */ "./node_modules/axios/lib/platform/browser/classes/Blob.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob: _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/common/utils.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/platform/common/utils.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasBrowserEnv: () => (/* binding */ hasBrowserEnv),
/* harmony export */   hasStandardBrowserEnv: () => (/* binding */ hasStandardBrowserEnv),
/* harmony export */   hasStandardBrowserWebWorkerEnv: () => (/* binding */ hasStandardBrowserWebWorkerEnv),
/* harmony export */   origin: () => (/* binding */ origin)
/* harmony export */ });
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = (
  (product) => {
    return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
  })(typeof navigator !== 'undefined' && navigator.product);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';




/***/ }),

/***/ "./node_modules/axios/lib/platform/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/platform/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _common_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils.js */ "./node_modules/axios/lib/platform/common/utils.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ..._common_utils_js__WEBPACK_IMPORTED_MODULE_0__,
  ..._node_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]
});


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./ui/index.marko ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marko/src/runtime/vdom/index.js */ "./node_modules/marko/src/runtime/vdom/index.js");
/* harmony import */ var _main_menu_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./main_menu/index.js */ "./ui/main_menu/index.js");
/* harmony import */ var _main_menu_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_main_menu_index_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _init_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./init.js */ "./ui/init.js");
/* harmony import */ var _content_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./content.js */ "./ui/content.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! marko/src/runtime/components/renderer.js */ "./node_modules/marko/src/runtime/components/renderer.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! marko/src/runtime/components/registry.js */ "./node_modules/marko/src/runtime/components/registry.js");
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! marko/src/runtime/components/defineComponent.js */ "./node_modules/marko/src/runtime/components/defineComponent.js");
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_6__);
// Compiled using marko@5.33.14 - DO NOT EDIT

const _marko_componentType = "ui\\index.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);





(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_5__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_4___default()(function (input, out, _componentDef, _component, state, $global) {}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_6___default()(_marko_component, _marko_template._);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFhO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLElBQWE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FB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QUFXLG1CQUFPLENBQUMsNkRBQVE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVI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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixlQUFlO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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T0FBTyxTQUFTOztBQUVoQjtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZDtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2Q7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2Q7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZDtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2Q7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZDtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZDtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2Q7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTs7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O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQzBEO0FBQzFEO0FBQ0Esb0JBQW9CLGtFQUFFO0FBQ3RCLGlFQUFlLGVBQWUsRUFBQztBQUNEO0FBQ1g7QUFDRztBQUNpRDtBQUNrQjtBQUN6RiwyRUFBd0I7QUFDeEI7QUFDQSxvQkFBb0IsK0VBQWUsb0VBQW9FO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDb0Y7QUFDckYsNEJBQTRCLHNGQUFzQixzQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvY29tcGxhaW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvZXJyb3Itc3RhY2stcGFyc2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvZXZlbnRzLWxpZ2h0L3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2xpc3RlbmVyLXRyYWNrZXIvbGliL2xpc3RlbmVyLXRyYWNrZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL21hcmtvL2NvbXBvbmVudHMvbGVmdC1tZW51L2luZGV4Lm1hcmtvIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9tYXJrby9ob21lL2NvbXBvbmVudHMvcGFzc3dvcmQubWFya28iLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL21hcmtvL2hvbWUvaG9tZS5tYXJrbyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL2NvbXBvbmVudHMtYmVnaW5Db21wb25lbnQvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL2NvbXBvbmVudHMtZW5kQ29tcG9uZW50L2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLXJlZ2lzdHJ5L2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLXV0aWwvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL3JlcXVpcmUvaW5kZXgtd2VicGFjay5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL3NldC1pbW1lZGlhdGUvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL3NldC1pbW1lZGlhdGUvcXVldWVNaWNyb3Rhc2suanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9SZW5kZXJSZXN1bHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50RGVmLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnRzQ29udGV4dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvR2xvYmFsQ29tcG9uZW50c0NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0tleVNlcXVlbmNlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9TdGF0ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZXZlbnQtZGVsZWdhdGlvbi5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL3JlbmRlcmVyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy91cGRhdGUtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NyZWF0ZU91dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2RvbS1pbnNlcnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL19jaGFuZ2UtY2FzZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2hlbHBlcnMvY2xhc3MtdmFsdWUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL3JlbmRlci10YWcuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL3N0eWxlLXZhbHVlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvcmVuZGVyYWJsZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vQXN5bmNWRE9NQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVkNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVkRvY3VtZW50RnJhZ21lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZFbGVtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WRnJhZ21lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZOb2RlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WVGV4dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vaGVscGVycy9hdHRycy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL21vcnBoZG9tL2ZyYWdtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9oZWxwZXJzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vcGFyc2UtaHRtbC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vdmRvbS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3JhcHRvci11dGlsL2NvcHlQcm9wcy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3JhcHRvci11dGlsL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3JhcHRvci11dGlsL2luaGVyaXQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9zdGFja2ZyYW1lL3N0YWNrZnJhbWUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy93YXJwMTAvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL2ZpbmFsaXplLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy93YXJwMTAvc3JjL2ZpbmFsaXplLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9jb250ZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9pbml0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9tYWluX21lbnUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3V0aWxpdHkvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy9hZGFwdGVycy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy9mZXRjaC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zSGVhZGVycy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvdHJhbnNpdGlvbmFsLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2Vudi9kYXRhLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvQXhpb3NVUkxTZWFyY2hQYXJhbXMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9IdHRwU3RhdHVzQ29kZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tcG9zZVNpZ25hbHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbnVsbC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlUHJvdG9jb2wuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wcm9ncmVzc0V2ZW50UmVkdWNlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3Jlc29sdmVDb25maWcuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcGVlZG9tZXRlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3Rocm90dGxlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3RvVVJMRW5jb2RlZEZvcm0uanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90cmFja1N0cmVhbS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9icm93c2VyL2NsYXNzZXMvQmxvYi5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9icm93c2VyL2NsYXNzZXMvRm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL1VSTFNlYXJjaFBhcmFtcy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2NvbW1vbi91dGlscy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL2luZGV4Lm1hcmtvIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFN0YWNrUGFyc2VyID0gcmVxdWlyZSgnZXJyb3Itc3RhY2stcGFyc2VyJyk7XG52YXIgZW52ID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WO1xudmFyIGlzRGV2ZWxvcG1lbnQgPSAhZW52IHx8IGVudiA9PT0gJ2RldicgfHwgZW52ID09PSAnZGV2ZWxvcG1lbnQnO1xudmFyIHNob3dNb2R1bGVDb21wbGFpbnMgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihwcm9jZXNzLmVudi5TSE9XX01PRFVMRV9DT01QTEFJTlMpO1xudmFyIHNob3dOZXN0ZWRDb21wbGFpbnMgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihwcm9jZXNzLmVudi5TSE9XX05FU1RFRF9DT01QTEFJTlMpO1xudmFyIGxvZ2dlciA9IHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlLndhcm4gJiYgY29uc29sZTtcbnZhciBjd2QgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5jd2QoKSArICcvJyB8fCAnJztcbnZhciBsaW5lYnJlYWsgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3dpbjMyJyA9PT0gcHJvY2Vzcy5wbGF0Zm9ybSA/ICdcXHJcXG4nIDogJ1xcbic7XG52YXIgbmV3bGluZSA9IC8oXFxyXFxufFxccnxcXG4pL2c7XG52YXIgc2xpY2UgPSBbXS5zbGljZTtcbnZhciBpZ25vcmVkTG9jYXRpb24gPSBcIltpZ25vcmVdXCI7XG52YXIgaGl0cyA9IHt9O1xuXG5jb21wbGFpbiA9IGlzRGV2ZWxvcG1lbnQgPyBjb21wbGFpbiA6IG5vb3A7XG5jb21wbGFpbi5tZXRob2QgPSBpc0RldmVsb3BtZW50ID8gbWV0aG9kIDogbm9vcDtcbmNvbXBsYWluLmZuID0gaXNEZXZlbG9wbWVudCA/IGZuIDogbm9vcFJldHVybjtcbmNvbXBsYWluLmxvZyA9IGxvZztcbmNvbXBsYWluLnN0cmVhbSA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLnN0ZGVycjtcbmNvbXBsYWluLnNpbGVuY2UgPSBmYWxzZTtcbmNvbXBsYWluLmNvbG9yID0gY29tcGxhaW4uc3RyZWFtICYmIGNvbXBsYWluLnN0cmVhbS5pc1RUWTtcbmNvbXBsYWluLmNvbG9ycyA9IHsgd2FybmluZzonXFx4MWJbMzE7MW0nLCBub3RpY2U6J1xceDFiWzMzOzFtJywgbWVzc2FnZTpmYWxzZSwgbG9jYXRpb246J1xcdTAwMWJbOTBtJyB9O1xuY29tcGxhaW4uZ2V0TW9kdWxlTmFtZSA9IGdldE1vZHVsZU5hbWU7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjb21wbGFpbjtcbn0gZWxzZSBpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuY29tcGxhaW4gPSBjb21wbGFpbjtcbn1cblxuZnVuY3Rpb24gY29tcGxhaW4oKSB7XG4gIHZhciBvcHRpb25zO1xuICB2YXIgbG9jYXRpb247XG4gIHZhciBsb2NhdGlvbkluZGV4O1xuICB2YXIgaGVhZGluZ0NvbG9yO1xuICB2YXIgaGVhZGluZztcbiAgdmFyIGxldmVsO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICBpZihjb21wbGFpbi5zaWxlbmNlKSByZXR1cm47XG5cbiAgaWYodHlwZW9mIGFyZ3NbYXJncy5sZW5ndGgtMV0gPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IGFyZ3NbYXJncy5sZW5ndGgtMV07XG4gICAgYXJncyA9IHNsaWNlLmNhbGwoYXJncywgMCwgLTEpO1xuICB9IGVsc2Uge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldmVsID0gb3B0aW9ucy5sZXZlbCB8fCAyO1xuICBoZWFkaW5nID0gb3B0aW9ucy5oZWFkaW5nIHx8IChsZXZlbCA9PSAyID8gXCJXQVJOSU5HISFcIiA6IFwiTk9USUNFXCIpO1xuICBoZWFkaW5nQ29sb3IgPSBvcHRpb25zLmhlYWRpbmdDb2xvciB8fCAobGV2ZWwgPT0gMiA/IGNvbXBsYWluLmNvbG9ycy53YXJuaW5nIDogY29tcGxhaW4uY29sb3JzLm5vdGljZSk7XG5cbiAgLy8gRGVmYXVsdCB0byB0aGUgbG9jYXRpb24gb2YgdGhlIGNhbGwgdG8gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb25cbiAgbG9jYXRpb25JbmRleCA9IG9wdGlvbnMubG9jYXRpb25JbmRleCA9PSBudWxsID8gMSA6IG9wdGlvbnMubG9jYXRpb25JbmRleDtcblxuICAvLyBXaGVuIHRoZSB1c2VyIHNldHMgbG9jYXRpb24gdG8gZmFsc2UsXG4gIC8vIFdlIHdpbGwgdXNlIHRoZSBsb2NhdGlvbiBvZiB0aGUgY2FsbCB0byBjb21wbGFpbigpXG4gIC8vIFRvIGxpbWl0IHRoZSBsb2cgdG8gb25seSBvY2N1cnJpbmcgb25jZVxuICBpZihvcHRpb25zLmxvY2F0aW9uID09PSBmYWxzZSkge1xuICAgIGxvY2F0aW9uSW5kZXggPSAwO1xuICB9XG5cbiAgbG9jYXRpb24gPSBvcHRpb25zLmxvY2F0aW9uIHx8IGdldExvY2F0aW9uKGxvY2F0aW9uSW5kZXgpO1xuICBcbiAgdmFyIG1vZHVsZU5hbWUgPSBjb21wbGFpbi5nZXRNb2R1bGVOYW1lKGxvY2F0aW9uKTtcblxuICBpZiAobW9kdWxlTmFtZSAmJiAhc2hvd01vZHVsZUNvbXBsYWlucykge1xuICAgIGlmICghaGl0c1ttb2R1bGVOYW1lXSkge1xuICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdChcIk5PVElDRVwiLCBjb21wbGFpbi5jb2xvcnMubm90aWNlKTtcbiAgICAgIG91dHB1dCArPSBsaW5lYnJlYWsgKyBmb3JtYXQoJ1RoZSBtb2R1bGUgWycrbW9kdWxlTmFtZSsnXSBpcyB1c2luZyBkZXByZWNhdGVkIGZlYXR1cmVzLicsIGNvbXBsYWluLmNvbG9ycy5tZXNzYWdlKTtcbiAgICAgIG91dHB1dCArPSBsaW5lYnJlYWsgKyBmb3JtYXQoJ1J1biB3aXRoIHByb2Nlc3MuZW52LlNIT1dfTU9EVUxFX0NPTVBMQUlOUz0xIHRvIHNlZSBhbGwgd2FybmluZ3MuJywgY29tcGxhaW4uY29sb3JzLm1lc3NhZ2UpO1xuICAgICAgY29tcGxhaW4ubG9nKGxpbmVicmVhayArIG91dHB1dCArIGxpbmVicmVhayk7XG4gICAgICBoaXRzW21vZHVsZU5hbWVdID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgLy8gTG9jYXRpb24gaXMgb25seSBtaXNzaW5nIGluIG9sZGVyIGJyb3dzZXJzLlxuICBpZihsb2NhdGlvbikge1xuICAgIGlmKGhpdHNbbG9jYXRpb25dIHx8IGxvY2F0aW9uID09PSBpZ25vcmVkTG9jYXRpb24pIHJldHVybjtcbiAgICBlbHNlIGhpdHNbbG9jYXRpb25dID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBvdXRwdXQgPSBmb3JtYXQoaGVhZGluZywgaGVhZGluZ0NvbG9yKTtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dCArPSBsaW5lYnJlYWsgKyBmb3JtYXQoYXJnc1tpXSwgY29tcGxhaW4uY29sb3JzLm1lc3NhZ2UpO1xuICB9XG5cbiAgaWYob3B0aW9ucy5sb2NhdGlvbiAhPT0gZmFsc2UgJiYgbG9jYXRpb24pIHtcbiAgICBvdXRwdXQgKz0gbGluZWJyZWFrICsgZm9ybWF0KCcgIGF0ICcrbG9jYXRpb24ucmVwbGFjZShjd2QsICcnKSwgY29tcGxhaW4uY29sb3JzLmxvY2F0aW9uKTtcbiAgfVxuXG4gIGNvbXBsYWluLmxvZyhsaW5lYnJlYWsgKyBvdXRwdXQgKyBsaW5lYnJlYWspO1xufTtcblxuZnVuY3Rpb24gbWV0aG9kKG9iamVjdCwgbWV0aG9kTmFtZSkge1xuICAgIHZhciBvcmlnaW5hbE1ldGhvZCA9IG9iamVjdFttZXRob2ROYW1lXTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcblxuICAgIG9iamVjdFttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb21wbGFpbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZm4ob3JpZ2luYWwpIHtcbiAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNvbXBsYWluLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIHJldHVybiBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvZyhtZXNzYWdlLCBjb2xvcikge1xuICB2YXIgZm9ybWF0dGVkID0gZm9ybWF0KG1lc3NhZ2UsIGNvbG9yKTtcbiAgaWYoY29tcGxhaW4uc3RyZWFtKSB7XG4gICAgY29tcGxhaW4uc3RyZWFtLndyaXRlKGZvcm1hdHRlZCtsaW5lYnJlYWspO1xuICB9IGVsc2UgaWYobG9nZ2VyKSB7XG4gICAgbG9nZ2VyLndhcm4oZm9ybWF0dGVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXQobWVzc2FnZSwgY29sb3IpIHtcbiAgcmV0dXJuIGNvbG9yICYmIGNvbXBsYWluLmNvbG9yID8gY29sb3IgKyBtZXNzYWdlICsgJ1xceDFiWzBtJyA6IG1lc3NhZ2U7XG59XG5cbmZ1bmN0aW9uIGdldExvY2F0aW9uKGxvY2F0aW9uSW5kZXgpIHtcbiAgdmFyIGxvY2F0aW9uID0gJyc7XG4gIHZhciB0YXJnZXRJbmRleCA9IGxvY2F0aW9uSW5kZXggKyAyO1xuXG4gIC8qKlxuICAgKiBTdGFjayBpbmRleCBkZXNjcmlwdGlvbnMuXG4gICAqIFxuICAgKiAwOiBJbiBnZXRMb2NhdGlvbigpLCB0aGUgY2FsbCB0byBuZXcgRXJyb3IoKVxuICAgKiAxOiBJbiBjb21wbGFpbigpLCB0aGUgY2FsbCB0byBnZXRMb2NhdGlvbigpXG4gICAqIDI6IEluIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9uLCB0aGUgY2FsbCB0byBjb21wbGFpbigpXG4gICAqIDM6IFRoZSBjYWxsIHRvIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9uIChUSElTIElTIFRIRSBERUZBVUxUKVxuICAgKi9cblxuICB0cnkge1xuICAgIHZhciBsb2NhdGlvbnMgPSBTdGFja1BhcnNlci5wYXJzZShuZXcgRXJyb3IoKSkubWFwKGZ1bmN0aW9uKGZyYW1lKSB7XG4gICAgICByZXR1cm4gZnJhbWUuZmlsZU5hbWUrJzonK2ZyYW1lLmxpbmVOdW1iZXIrJzonK2ZyYW1lLmNvbHVtbk51bWJlcjtcbiAgICB9KTtcbiAgICBpZiAoIXNob3dOZXN0ZWRDb21wbGFpbnMpIHtcbiAgICAgIGZvciAodmFyIGkgPSBsb2NhdGlvbnMubGVuZ3RoLTE7IGkgPiB0YXJnZXRJbmRleDsgaS0tKSB7XG4gICAgICAgIGlmIChoaXRzW2xvY2F0aW9uc1tpXV0pIHtcbiAgICAgICAgICByZXR1cm4gaWdub3JlZExvY2F0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxvY2F0aW9uID0gbG9jYXRpb25zW3RhcmdldEluZGV4XTtcbiAgfSBjYXRjaChlKSB7fVxuXG4gIHJldHVybiBsb2NhdGlvbjtcbn1cblxuZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZShsb2NhdGlvbikge1xuICB2YXIgbG9jYXRpb25QYXJ0cyA9IGxvY2F0aW9uLnJlcGxhY2UoY3dkLCAnJykuc3BsaXQoL1xcL3xcXFxcL2cpO1xuICBmb3IodmFyIGkgPSBsb2NhdGlvblBhcnRzLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuICAgIGlmIChsb2NhdGlvblBhcnRzW2ldID09PSAnbm9kZV9tb2R1bGVzJykge1xuICAgICAgdmFyIG1vZHVsZU5hbWUgPSBsb2NhdGlvblBhcnRzW2krMV07XG4gICAgICByZXR1cm4gKG1vZHVsZU5hbWVbMF0gPT09ICdAJykgPyBtb2R1bGVOYW1lKycvJytsb2NhdGlvblBhcnRzW2krMl0gOiBtb2R1bGVOYW1lO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBub29wKCl7fTtcbmZ1bmN0aW9uIG5vb3BSZXR1cm4ocikgeyByZXR1cm4gcjsgfTtcbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ2Vycm9yLXN0YWNrLXBhcnNlcicsIFsnc3RhY2tmcmFtZSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnc3RhY2tmcmFtZScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LkVycm9yU3RhY2tQYXJzZXIgPSBmYWN0b3J5KHJvb3QuU3RhY2tGcmFtZSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyKFN0YWNrRnJhbWUpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgRklSRUZPWF9TQUZBUklfU1RBQ0tfUkVHRVhQID0gLyhefEApXFxTKzpcXGQrLztcbiAgICB2YXIgQ0hST01FX0lFX1NUQUNLX1JFR0VYUCA9IC9eXFxzKmF0IC4qKFxcUys6XFxkK3xcXChuYXRpdmVcXCkpL207XG4gICAgdmFyIFNBRkFSSV9OQVRJVkVfQ09ERV9SRUdFWFAgPSAvXihldmFsQCk/KFxcW25hdGl2ZSBjb2RlXSk/JC87XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2l2ZW4gYW4gRXJyb3Igb2JqZWN0LCBleHRyYWN0IHRoZSBtb3N0IGluZm9ybWF0aW9uIGZyb20gaXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIG9iamVjdFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX0gb2YgU3RhY2tGcmFtZXNcbiAgICAgICAgICovXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZShlcnJvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvci5zdGFja3RyYWNlICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZXJyb3JbJ29wZXJhI3NvdXJjZWxvYyddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmEoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjayAmJiBlcnJvci5zdGFjay5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlVjhPcklFKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZGT3JTYWZhcmkoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBwYXJzZSBnaXZlbiBFcnJvciBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBTZXBhcmF0ZSBsaW5lIGFuZCBjb2x1bW4gbnVtYmVycyBmcm9tIGEgc3RyaW5nIG9mIHRoZSBmb3JtOiAoVVJJOkxpbmU6Q29sdW1uKVxuICAgICAgICBleHRyYWN0TG9jYXRpb246IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJGV4dHJhY3RMb2NhdGlvbih1cmxMaWtlKSB7XG4gICAgICAgICAgICAvLyBGYWlsLWZhc3QgYnV0IHJldHVybiBsb2NhdGlvbnMgbGlrZSBcIihuYXRpdmUpXCJcbiAgICAgICAgICAgIGlmICh1cmxMaWtlLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3VybExpa2VdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVnRXhwID0gLyguKz8pKD86OihcXGQrKSk/KD86OihcXGQrKSk/JC87XG4gICAgICAgICAgICB2YXIgcGFydHMgPSByZWdFeHAuZXhlYyh1cmxMaWtlLnJlcGxhY2UoL1soKV0vZywgJycpKTtcbiAgICAgICAgICAgIHJldHVybiBbcGFydHNbMV0sIHBhcnRzWzJdIHx8IHVuZGVmaW5lZCwgcGFydHNbM10gfHwgdW5kZWZpbmVkXTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZVY4T3JJRTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VWOE9ySUUoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWxpbmUubWF0Y2goQ0hST01FX0lFX1NUQUNLX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignKGV2YWwgJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2V2YWwgY29kZS9nLCAnZXZhbCcpLnJlcGxhY2UoLyhcXChldmFsIGF0IFteKCldKil8KCwuKiQpL2csICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHNhbml0aXplZExpbmUgPSBsaW5lLnJlcGxhY2UoL15cXHMrLywgJycpLnJlcGxhY2UoL1xcKGV2YWwgY29kZS9nLCAnKCcpLnJlcGxhY2UoL14uKj9cXHMrLywgJycpO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FwdHVyZSBhbmQgcHJlc2V2ZSB0aGUgcGFyZW50aGVzaXplZCBsb2NhdGlvbiBcIigvZm9vL215IGJhci5qczoxMjo4NylcIiBpblxuICAgICAgICAgICAgICAgIC8vIGNhc2UgaXQgaGFzIHNwYWNlcyBpbiBpdCwgYXMgdGhlIHN0cmluZyBpcyBzcGxpdCBvbiBcXHMrIGxhdGVyIG9uXG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gc2FuaXRpemVkTGluZS5tYXRjaCgvIChcXCguK1xcKSQpLyk7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHBhcmVudGhlc2l6ZWQgbG9jYXRpb24gZnJvbSB0aGUgbGluZSwgaWYgaXQgd2FzIG1hdGNoZWRcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZWRMaW5lID0gbG9jYXRpb24gPyBzYW5pdGl6ZWRMaW5lLnJlcGxhY2UobG9jYXRpb25bMF0sICcnKSA6IHNhbml0aXplZExpbmU7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBhIGxvY2F0aW9uIHdhcyBtYXRjaGVkLCBwYXNzIGl0IHRvIGV4dHJhY3RMb2NhdGlvbigpIG90aGVyd2lzZSBwYXNzIGFsbCBzYW5pdGl6ZWRMaW5lXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGlzIGxpbmUgZG9lc24ndCBoYXZlIGZ1bmN0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKGxvY2F0aW9uID8gbG9jYXRpb25bMV0gOiBzYW5pdGl6ZWRMaW5lKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gbG9jYXRpb24gJiYgc2FuaXRpemVkTGluZSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gWydldmFsJywgJzxhbm9ueW1vdXM+J10uaW5kZXhPZihsb2NhdGlvblBhcnRzWzBdKSA+IC0xID8gdW5kZWZpbmVkIDogbG9jYXRpb25QYXJ0c1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbk51bWJlcjogbG9jYXRpb25QYXJ0c1syXSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZUZGT3JTYWZhcmk6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlRkZPclNhZmFyaShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFsaW5lLm1hdGNoKFNBRkFSSV9OQVRJVkVfQ09ERV9SRUdFWFApO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZC5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZXZhbCBpbmZvcm1hdGlvbiB1bnRpbCB3ZSBpbXBsZW1lbnQgc3RhY2t0cmFjZS5qcy9zdGFja2ZyYW1lIzhcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCcgPiBldmFsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC8gbGluZSAoXFxkKykoPzogPiBldmFsIGxpbmUgXFxkKykqID4gZXZhbDpcXGQrOlxcZCsvZywgJzokMScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJ0AnKSA9PT0gLTEgJiYgbGluZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSBldmFsIGZyYW1lcyBvbmx5IGhhdmUgZnVuY3Rpb24gbmFtZXMgYW5kIG5vdGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBsaW5lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWVSZWdleCA9IC8oKC4qXCIuK1wiW15AXSopP1teQF0qKSg/OkApLztcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBsaW5lLm1hdGNoKGZ1bmN0aW9uTmFtZVJlZ2V4KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IG1hdGNoZXMgJiYgbWF0Y2hlc1sxXSA/IG1hdGNoZXNbMV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24obGluZS5yZXBsYWNlKGZ1bmN0aW9uTmFtZVJlZ2V4LCAnJykpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbk51bWJlcjogbG9jYXRpb25QYXJ0c1syXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhKGUpIHtcbiAgICAgICAgICAgIGlmICghZS5zdGFja3RyYWNlIHx8IChlLm1lc3NhZ2UuaW5kZXhPZignXFxuJykgPiAtMSAmJlxuICAgICAgICAgICAgICAgIGUubWVzc2FnZS5zcGxpdCgnXFxuJykubGVuZ3RoID4gZS5zdGFja3RyYWNlLnNwbGl0KCdcXG4nKS5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTkoZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFlLnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTEwKGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhMTEoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTk6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmE5KGUpIHtcbiAgICAgICAgICAgIHZhciBsaW5lUkUgPSAvTGluZSAoXFxkKykuKnNjcmlwdCAoPzppbiApPyhcXFMrKS9pO1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gZS5tZXNzYWdlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDIsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gbGluZVJFLmV4ZWMobGluZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhMTA6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmExMChlKSB7XG4gICAgICAgICAgICB2YXIgbGluZVJFID0gL0xpbmUgKFxcZCspLipzY3JpcHQgKD86aW4gKT8oXFxTKykoPzo6IEluIGZ1bmN0aW9uIChcXFMrKSk/JC9pO1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gZS5zdGFja3RyYWNlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gbGluZVJFLmV4ZWMobGluZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IG1hdGNoWzNdIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lc1tpXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gT3BlcmEgMTAuNjUrIEVycm9yLnN0YWNrIHZlcnkgc2ltaWxhciB0byBGRi9TYWZhcmlcbiAgICAgICAgcGFyc2VPcGVyYTExOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTEoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWxpbmUubWF0Y2goRklSRUZPWF9TQUZBUklfU1RBQ0tfUkVHRVhQKSAmJiAhbGluZS5tYXRjaCgvXkVycm9yIGNyZWF0ZWQgYXQvKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gbGluZS5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24odG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25DYWxsID0gKHRva2Vucy5zaGlmdCgpIHx8ICcnKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25DYWxsXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC88YW5vbnltb3VzIGZ1bmN0aW9uKDogKFxcdyspKT8+LywgJyQyJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcKFteKV0qXFwpL2csICcnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3NSYXc7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmN0aW9uQ2FsbC5tYXRjaCgvXFwoKFteKV0qKVxcKS8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NSYXcgPSBmdW5jdGlvbkNhbGwucmVwbGFjZSgvXlteKF0rXFwoKFteKV0qKVxcKSQvLCAnJDEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSAoYXJnc1JhdyA9PT0gdW5kZWZpbmVkIHx8IGFyZ3NSYXcgPT09ICdbYXJndW1lbnRzIG5vdCBhdmFpbGFibGVdJykgP1xuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQgOiBhcmdzUmF3LnNwbGl0KCcsJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGxvY2F0aW9uUGFydHNbMF0sXG4gICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbk51bWJlcjogbG9jYXRpb25QYXJ0c1syXSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG59KSk7XG4iLCIvKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBsaXN0ZW5lcicpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlTGlzdGVuZXIoZWUsIGxpc3RlbmVyLCBhcmdzKSB7XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwoZWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwoZWUsIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwoZWUsIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBzbG93ZXJcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KGVlLCBzbGljZS5jYWxsKGFyZ3MsIDEpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2ZW50RW1pdHRlciwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgIHZhciBldmVudHMgPSBldmVudEVtaXR0ZXIuJGUgfHwgKGV2ZW50RW1pdHRlci4kZSA9IHt9KTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV07XG4gICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgICAgICAgICBldmVudHNbdHlwZV0gPSBwcmVwZW5kID8gW2xpc3RlbmVyLCBsaXN0ZW5lcnNdIDogW2xpc3RlbmVycywgbGlzdGVuZXJdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHByZXBlbmQpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gICAgfVxuICAgIHJldHVybiBldmVudEVtaXR0ZXI7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgICB0aGlzLiRlID0gdGhpcy4kZSB8fCB7fTtcbn1cblxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSA9IHtcbiAgICAkZTogbnVsbCxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuJGU7XG4gICAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gZXZlbnRzICYmIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gYXJnc1sxXTtcbiAgICAgICAgICAgICAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignRXJyb3I6ICcgKyBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICAgICAgICAgIGludm9rZUxpc3RlbmVyKHRoaXMsIGxpc3RlbmVycywgYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBzbGljZS5jYWxsKGxpc3RlbmVycyk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MCwgbGVuPWxpc3RlbmVycy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaW52b2tlTGlzdGVuZXIodGhpcywgbGlzdGVuZXIsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIG9uOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgcHJlcGVuZExpc3RlbmVyOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH0sXG5cbiAgICBvbmNlOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgICBmdW5jdGlvbiBnKCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuICAgIHJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy4kZTtcbiAgICAgICAgdmFyIGxpc3RlbmVycztcblxuICAgICAgICBpZiAoZXZlbnRzICYmIChsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV0pKSB7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVycyA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9bGlzdGVuZXJzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyc1tpXSA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLiRlO1xuICAgICAgICBpZiAoZXZlbnRzKSB7XG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGxpc3RlbmVyQ291bnQ6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuJGU7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBldmVudHMgJiYgZXZlbnRzW3R5cGVdO1xuICAgICAgICByZXR1cm4gbGlzdGVuZXJzID8gKGlzRnVuY3Rpb24obGlzdGVuZXJzKSA/IDEgOiBsaXN0ZW5lcnMubGVuZ3RoKSA6IDA7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7IiwidmFyIElOREVYX0VWRU5UID0gMDtcbnZhciBJTkRFWF9VU0VSX0xJU1RFTkVSID0gMTtcbnZhciBJTkRFWF9XUkFQUEVEX0xJU1RFTkVSID0gMjtcbnZhciBERVNUUk9ZID0gXCJkZXN0cm95XCI7XG5cbmZ1bmN0aW9uIGlzTm9uRXZlbnRFbWl0dGVyKHRhcmdldCkge1xuICByZXR1cm4gIXRhcmdldC5vbmNlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXJXcmFwcGVyKHRhcmdldCkge1xuICAgIHRoaXMuJF9fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuJF9fbGlzdGVuZXJzID0gW107XG4gICAgdGhpcy4kX19zdWJzY3JpYmVUbyA9IG51bGw7XG59XG5cbkV2ZW50RW1pdHRlcldyYXBwZXIucHJvdG90eXBlID0ge1xuICAgICRfX3JlbW92ZTogZnVuY3Rpb24odGVzdCwgdGVzdFdyYXBwZWQpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuJF9fdGFyZ2V0O1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy4kX19saXN0ZW5lcnM7XG5cbiAgICAgICAgdGhpcy4kX19saXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZmlsdGVyKGZ1bmN0aW9uKGN1ckxpc3RlbmVyKSB7XG4gICAgICAgICAgICB2YXIgY3VyRXZlbnQgPSBjdXJMaXN0ZW5lcltJTkRFWF9FVkVOVF07XG4gICAgICAgICAgICB2YXIgY3VyTGlzdGVuZXJGdW5jID0gY3VyTGlzdGVuZXJbSU5ERVhfVVNFUl9MSVNURU5FUl07XG4gICAgICAgICAgICB2YXIgY3VyV3JhcHBlZExpc3RlbmVyRnVuYyA9IGN1ckxpc3RlbmVyW0lOREVYX1dSQVBQRURfTElTVEVORVJdO1xuXG4gICAgICAgICAgICBpZiAodGVzdFdyYXBwZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdXNlciB1c2VkIGBvbmNlYCB0byBhdHRhY2ggYW4gZXZlbnQgbGlzdGVuZXIgdGhlbiB3ZSBoYWQgdG9cbiAgICAgICAgICAgICAgICAvLyB3cmFwIHRoZWlyIGxpc3RlbmVyIGZ1bmN0aW9uIHdpdGggYSBuZXcgZnVuY3Rpb24gdGhhdCBkb2VzIHNvbWUgZXh0cmFcbiAgICAgICAgICAgICAgICAvLyBjbGVhbnVwIHRvIGF2b2lkIGEgbWVtb3J5IGxlYWsuIElmIHRoZSBgdGVzdFdyYXBwZWRgIGZsYWcgaXMgc2V0IHRvIHRydWVcbiAgICAgICAgICAgICAgICAvLyB0aGVuIHdlIGFyZSBhdHRlbXB0aW5nIHRvIHJlbW92ZSBiYXNlZCBvbiBhIGZ1bmN0aW9uIHRoYXQgd2UgaGFkIHRvXG4gICAgICAgICAgICAgICAgLy8gd3JhcCAobm90IHRoZSB1c2VyIGxpc3RlbmVyIGZ1bmN0aW9uKVxuICAgICAgICAgICAgICAgIGlmIChjdXJXcmFwcGVkTGlzdGVuZXJGdW5jICYmIHRlc3QoY3VyRXZlbnQsIGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcihjdXJFdmVudCwgY3VyV3JhcHBlZExpc3RlbmVyRnVuYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVzdChjdXJFdmVudCwgY3VyTGlzdGVuZXJGdW5jKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiB3YXMgd3JhcHBlZCBkdWUgdG8gaXQgYmVpbmcgYSBgb25jZWAgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICAvLyB0aGVuIHdlIHNob3VsZCByZW1vdmUgZnJvbSB0aGUgdGFyZ2V0IEV2ZW50RW1pdHRlciB1c2luZyB3cmFwcGVkXG4gICAgICAgICAgICAgICAgLy8gbGlzdGVuZXIgZnVuY3Rpb24uIE90aGVyd2lzZSwgd2UgcmVtb3ZlIHRoZSBsaXN0ZW5lciB1c2luZyB0aGUgdXNlci1wcm92aWRlZFxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcihjdXJFdmVudCwgY3VyV3JhcHBlZExpc3RlbmVyRnVuYyB8fCBjdXJMaXN0ZW5lckZ1bmMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL3JhcHRvcmpzL2xpc3RlbmVyLXRyYWNrZXIvaXNzdWVzLzJcbiAgICAgICAgLy8gSWYgYWxsIG9mIHRoZSBsaXN0ZW5lcnMgc3RvcmVkIHdpdGggYSB3cmFwcGVkIEV2ZW50RW1pdHRlclxuICAgICAgICAvLyBoYXZlIGJlZW4gcmVtb3ZlZCB0aGVuIHdlIHNob3VsZCB1bnJlZ2lzdGVyIHRoZSB3cmFwcGVkXG4gICAgICAgIC8vIEV2ZW50RW1pdHRlciBpbiB0aGUgcGFyZW50IFN1YnNjcmlwdGlvblRyYWNrZXJcbiAgICAgICAgdmFyIHN1YnNjcmliZVRvID0gdGhpcy4kX19zdWJzY3JpYmVUbztcblxuICAgICAgICBpZiAoIXRoaXMuJF9fbGlzdGVuZXJzLmxlbmd0aCAmJiBzdWJzY3JpYmVUbykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHN1YnNjcmliZVRvTGlzdCA9IHN1YnNjcmliZVRvLiRfX3N1YnNjcmliZVRvTGlzdDtcbiAgICAgICAgICAgIHN1YnNjcmliZVRvLiRfX3N1YnNjcmliZVRvTGlzdCA9IHN1YnNjcmliZVRvTGlzdC5maWx0ZXIoZnVuY3Rpb24oY3VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1ciAhPT0gc2VsZjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy4kX190YXJnZXQub24oZXZlbnQsIGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy4kX19saXN0ZW5lcnMucHVzaChbZXZlbnQsIGxpc3RlbmVyXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBvbmNlOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIEhhbmRsaW5nIGEgYG9uY2VgIGV2ZW50IGxpc3RlbmVyIGlzIGEgbGl0dGxlIHRyaWNreSBzaW5jZSB3ZSBuZWVkIHRvIGFsc29cbiAgICAgICAgLy8gZG8gb3VyIG93biBjbGVhbnVwIGlmIHRoZSBgb25jZWAgZXZlbnQgaXMgZW1pdHRlZC4gVGhlcmVmb3JlLCB3ZSBuZWVkXG4gICAgICAgIC8vIHRvIHdyYXAgdGhlIHVzZXIncyBsaXN0ZW5lciBmdW5jdGlvbiB3aXRoIG91ciBvd24gbGlzdGVuZXIgZnVuY3Rpb24uXG4gICAgICAgIHZhciB3cmFwcGVkTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuJF9fcmVtb3ZlKGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lckZ1bmMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd3JhcHBlZExpc3RlbmVyID09PSBsaXN0ZW5lckZ1bmM7XG4gICAgICAgICAgICB9LCB0cnVlIC8qIFdlIGFyZSByZW1vdmluZyB0aGUgd3JhcHBlZCBsaXN0ZW5lciAqLyk7XG5cbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4kX190YXJnZXQub25jZShldmVudCwgd3JhcHBlZExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy4kX19saXN0ZW5lcnMucHVzaChbZXZlbnQsIGxpc3RlbmVyLCB3cmFwcGVkTGlzdGVuZXJdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGlzdGVuZXIgPSBldmVudDtcbiAgICAgICAgICAgIGV2ZW50ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0ZW5lciAmJiBldmVudCkge1xuICAgICAgICAgICAgdGhpcy4kX19yZW1vdmUoZnVuY3Rpb24oY3VyRXZlbnQsIGN1ckxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50ID09PSBjdXJFdmVudCAmJiBsaXN0ZW5lciA9PT0gY3VyTGlzdGVuZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy4kX19yZW1vdmUoZnVuY3Rpb24oY3VyRXZlbnQsIGN1ckxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyID09PSBjdXJMaXN0ZW5lcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzOiBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLiRfX2xpc3RlbmVycztcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuJF9fdGFyZ2V0O1xuXG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy4kX19yZW1vdmUoZnVuY3Rpb24oY3VyRXZlbnQsIGN1ckxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50ID09PSBjdXJFdmVudDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKGN1cltJTkRFWF9FVkVOVF0sIGN1cltJTkRFWF9VU0VSX0xJU1RFTkVSXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRfX2xpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyQWRhcHRlcih0YXJnZXQpIHtcbiAgICB0aGlzLiRfX3RhcmdldCA9IHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyQWRhcHRlci5wcm90b3R5cGUgPSB7XG4gICAgb246IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLiRfX3RhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBvbmNlOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIG5lZWQgdG8gc2F2ZSB0aGlzIHNvIHdlIGNhbiByZW1vdmUgaXQgYmVsb3dcbiAgICAgICAgdmFyIG9uY2VMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYuJF9fdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIG9uY2VMaXN0ZW5lcik7XG4gICAgICAgICAgbGlzdGVuZXIoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy4kX190YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgb25jZUxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy4kX190YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBTdWJzY3JpcHRpb25UcmFja2VyKCkge1xuICAgIHRoaXMuJF9fc3Vic2NyaWJlVG9MaXN0ID0gW107XG59XG5cblN1YnNjcmlwdGlvblRyYWNrZXIucHJvdG90eXBlID0ge1xuXG4gICAgc3Vic2NyaWJlVG86IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgYWRkRGVzdHJveUxpc3RlbmVyID0gIW9wdGlvbnMgfHwgb3B0aW9ucy5hZGREZXN0cm95TGlzdGVuZXIgIT09IGZhbHNlO1xuICAgICAgICB2YXIgd3JhcHBlcjtcbiAgICAgICAgdmFyIG5vbkVFO1xuICAgICAgICB2YXIgc3Vic2NyaWJlVG9MaXN0ID0gdGhpcy4kX19zdWJzY3JpYmVUb0xpc3Q7XG5cbiAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49c3Vic2NyaWJlVG9MaXN0Lmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1ciA9IHN1YnNjcmliZVRvTGlzdFtpXTtcbiAgICAgICAgICAgIGlmIChjdXIuJF9fdGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB3cmFwcGVyID0gY3VyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3cmFwcGVyKSB7XG4gICAgICAgICAgICBpZiAoaXNOb25FdmVudEVtaXR0ZXIodGFyZ2V0KSkge1xuICAgICAgICAgICAgICBub25FRSA9IG5ldyBFdmVudEVtaXR0ZXJBZGFwdGVyKHRhcmdldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIgPSBuZXcgRXZlbnRFbWl0dGVyV3JhcHBlcihub25FRSB8fCB0YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGFkZERlc3Ryb3lMaXN0ZW5lciAmJiAhbm9uRUUpIHtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLm9uY2UoREVTVFJPWSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN1YnNjcmliZVRvTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZVRvTGlzdFtpXS4kX190YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBTdWJzY3JpcHRpb25UcmFja2VyIHNvIHRoYXQgd2UgY2FuIGRvIGNsZWFudXBcbiAgICAgICAgICAgIC8vIGlmIHRoZSBFdmVudEVtaXR0ZXJXcmFwcGVyIGluc3RhbmNlIGJlY29tZXMgZW1wdHkgKGkuZS4sIG5vIGFjdGl2ZSBsaXN0ZW5lcnMpXG4gICAgICAgICAgICB3cmFwcGVyLiRfX3N1YnNjcmliZVRvID0gdGhpcztcbiAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdC5wdXNoKHdyYXBwZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfSxcblxuICAgIHJlbW92ZUFsbExpc3RlbmVyczogZnVuY3Rpb24odGFyZ2V0LCBldmVudCkge1xuICAgICAgICB2YXIgc3Vic2NyaWJlVG9MaXN0ID0gdGhpcy4kX19zdWJzY3JpYmVUb0xpc3Q7XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YnNjcmliZVRvTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXIgPSBzdWJzY3JpYmVUb0xpc3RbaV07XG4gICAgICAgICAgICAgICAgaWYgKGN1ci4kX190YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBjdXIucmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ci4kX19saXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEbyBzb21lIGNsZWFudXAgaWYgd2UgcmVtb3ZlZCBhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxpc3RlbmVycyBmb3IgdGhlIHRhcmdldCBldmVudCBlbWl0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChpID0gc3Vic2NyaWJlVG9MaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0W2ldLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBTdWJzY3JpcHRpb25UcmFja2VyO1xuXG5leHBvcnRzLndyYXAgPSBmdW5jdGlvbih0YXJnZXRFdmVudEVtaXR0ZXIpIHtcbiAgICB2YXIgbm9uRUU7XG4gICAgdmFyIHdyYXBwZXI7XG5cbiAgICBpZiAoaXNOb25FdmVudEVtaXR0ZXIodGFyZ2V0RXZlbnRFbWl0dGVyKSkge1xuICAgICAgbm9uRUUgPSBuZXcgRXZlbnRFbWl0dGVyQWRhcHRlcih0YXJnZXRFdmVudEVtaXR0ZXIpO1xuICAgIH1cblxuICAgIHdyYXBwZXIgPSBuZXcgRXZlbnRFbWl0dGVyV3JhcHBlcihub25FRSB8fCB0YXJnZXRFdmVudEVtaXR0ZXIpO1xuICAgIGlmICghbm9uRUUpIHtcbiAgICAgIC8vIHdlIGRvbid0IHNldCB0aGlzIGZvciBub24gRUUgdHlwZXNcbiAgICAgIHRhcmdldEV2ZW50RW1pdHRlci5vbmNlKERFU1RST1ksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdyYXBwZXIuJF9fbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcHBlcjtcbn07XG5cbmV4cG9ydHMuY3JlYXRlVHJhY2tlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uVHJhY2tlcigpO1xufTtcbiIsIi8vIENvbXBpbGVkIHVzaW5nIG1hcmtvQDUuMzMuMTQgLSBETyBOT1QgRURJVFxuaW1wb3J0IHsgdCBhcyBfdCB9IGZyb20gXCJtYXJrby9zcmMvcnVudGltZS92ZG9tL2luZGV4LmpzXCI7XG5jb25zdCBfbWFya29fY29tcG9uZW50VHlwZSA9IFwidWlcXFxcbWFya29cXFxcY29tcG9uZW50c1xcXFxsZWZ0LW1lbnVcXFxcaW5kZXgubWFya29cIixcbiAgX21hcmtvX3RlbXBsYXRlID0gX3QoX21hcmtvX2NvbXBvbmVudFR5cGUpO1xuZXhwb3J0IGRlZmF1bHQgX21hcmtvX3RlbXBsYXRlO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHtcbiAgb25DcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lbnVfaXRlbTogW10sXG4gICAgICBtZW51X2xpbms6IFtdXG4gICAgfTtcbiAgfSxcbiAgb25JbnB1dChpbnB1dCkge1xuICAgIHRoaXMuc3RhdGUubWVudV9pdGVtID0gaW5wdXQucGFyYW1zO1xuICAgIGNvbnNvbGUubG9nKGlucHV0KTtcbiAgfSxcbiAgb25Nb3VudCgpIHtcbiAgICBsZXQgbGlzdEdyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0LWdyb3VwXCIpO1xuICAgIGxldCBhTGlzdCA9IGxpc3RHcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdhJyk7XG4gICAgdGhpcy5zdGF0ZS5tZW51X2xpbmsgPSBhTGlzdDtcbiAgfSxcbiAgbWVudUJ1dHRvbkNsaWNrKGVsZW1lbnQpIHtcbiAgICBsZXQgdGFyZ2V0ID0gZWxlbWVudC50YXJnZXQuaWQ7XG4gICAgdGhpcy5zdGF0ZS5tZW51X2xpbmsuZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZiAoZWwuaWQgPT09IHRhcmdldCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICBlbC5hcmlhQ3VycmVudCA9IFwidHJ1ZVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlZEhvbWVQYWdlJywgdGFyZ2V0KTtcbiAgfVxufTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge1xuICBvdXQuYmUoXCJkaXZcIiwge1xuICAgIFwiaWRcIjogXCJsZWZ0LW1lbnVcIlxuICB9LCBcIjBcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5iZShcImRpdlwiLCB7XG4gICAgXCJjbGFzc1wiOiBcImxpc3QtZ3JvdXBcIlxuICB9LCBcIjFcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIHtcbiAgICBsZXQgX2luZGV4ID0gMDtcbiAgICBjb25zdCBhcnJheSA9IHN0YXRlLm1lbnVfaXRlbTtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGFycmF5KSB7XG4gICAgICBsZXQgaW5kZXggPSBfaW5kZXgrKztcbiAgICAgIGNvbnN0IF9rZXlTY29wZSA9IGBbJHtpbmRleH1dYDtcbiAgICAgIG91dC5iZShcImFcIiwge1xuICAgICAgICBcImhyZWZcIjogXCIjXCIsXG4gICAgICAgIFwiaWRcIjogZWwuaWQgKyBcIi1idXR0b25cIixcbiAgICAgICAgXCJjbGFzc1wiOiBcImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tYWN0aW9uXCJcbiAgICAgIH0sIFwiMlwiICsgX2tleVNjb3BlLCBfY29tcG9uZW50LCBudWxsLCAwLCB7XG4gICAgICAgIFwib25jbGlja1wiOiBfY29tcG9uZW50RGVmLmQoXCJjbGlja1wiLCAnbWVudUJ1dHRvbkNsaWNrJywgZmFsc2UpXG4gICAgICB9KTtcbiAgICAgIG91dC50KGVsLm5hbWUsIF9jb21wb25lbnQpO1xuICAgICAgb3V0LmVlKCk7XG4gICAgfVxuICB9XG4gIG91dC5lZSgpO1xuICBvdXQuZWUoKTtcbn0sIHtcbiAgdDogX21hcmtvX2NvbXBvbmVudFR5cGUsXG4gIGQ6IHRydWVcbn0sIF9tYXJrb19jb21wb25lbnQpO1xuaW1wb3J0IF9tYXJrb19kZWZpbmVDb21wb25lbnQgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50LmpzXCI7XG5fbWFya29fdGVtcGxhdGUuQ29tcG9uZW50ID0gX21hcmtvX2RlZmluZUNvbXBvbmVudChfbWFya29fY29tcG9uZW50LCBfbWFya29fdGVtcGxhdGUuXyk7IiwiLy8gQ29tcGlsZWQgdXNpbmcgbWFya29ANS4zMy4xNCAtIERPIE5PVCBFRElUXG5pbXBvcnQgeyB0IGFzIF90IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanNcIjtcbmNvbnN0IF9tYXJrb19jb21wb25lbnRUeXBlID0gXCJ1aVxcXFxtYXJrb1xcXFxob21lXFxcXGNvbXBvbmVudHNcXFxccGFzc3dvcmQubWFya29cIixcbiAgX21hcmtvX3RlbXBsYXRlID0gX3QoX21hcmtvX2NvbXBvbmVudFR5cGUpO1xuZXhwb3J0IGRlZmF1bHQgX21hcmtvX3RlbXBsYXRlO1xuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0eS91dGlsaXR5LmpzJztcbmltcG9ydCBfbWFya29fcmVuZGVyZXIgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IHIgYXMgX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanNcIjtcbl9tYXJrb19yZWdpc3RlckNvbXBvbmVudChfbWFya29fY29tcG9uZW50VHlwZSwgKCkgPT4gX21hcmtvX3RlbXBsYXRlKTtcbmNvbnN0IF9tYXJrb19jb21wb25lbnQgPSB7XG4gIG9uQ3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfSxcbiAgb25Nb3VudCgpIHt9LFxuICBhc3luYyBvblNhdmUoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCBvbGRfcGFzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib2xkLXBhc3NcIikudmFsdWU7XG4gICAgbGV0IG5ld19wYXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctcGFzc1wiKS52YWx1ZTtcbiAgICBsZXQgY29uZmlybV9wYXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25maXJtLXBhc3NcIikudmFsdWU7XG4gICAgaWYgKG9sZF9wYXNzID09PSBuZXdfcGFzcykge1xuICAgICAgYWxlcnQoJ0F0dGVuemlvbmUhIExhIHZlY2NoaWEgZSBsYSBudW92YSBwYXNzd29yZCBub24gcG9zc29ubyBlc3NlcmUgdWd1YWxpLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobmV3X3Bhc3MgIT0gY29uZmlybV9wYXNzKSB7XG4gICAgICBhbGVydCgnQXR0ZW56aW9uZSEgTGEgbnVvdmEgcGFzc3dvcmQgbm9uIGNvcnJpc3BvbmRlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgIHVybDogJy91c2Vycy8nICsgU3RvcmUuc3RhdGUudXNlciArICcvaXNQYXNzd29yZENvcnJlY3QnLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBvbGRfcGFzczogb2xkX3Bhc3NcbiAgICAgIH1cbiAgICB9O1xuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHV0aWxpdHkubWFrZVJlcXVlc3Qob3B0aW9ucyk7XG4gICAgaWYgKCFyZXNwb25zZS5kYXRhLmNoZWNrKSB7XG4gICAgICBhbGVydCgnQXR0ZW56aW9uZSEgTGEgdmVjY2hpYSBwYXNzd29yZCBub24gY29ycmlzcG9uZGUuIENvbnRyb2xsYXJsYSBlIHJpcHJvdmFyZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvcHRpb25zID0ge1xuICAgICAgdXJsOiAnL3VzZXJzLycgKyBTdG9yZS5zdGF0ZS51c2VyICsgJy9lZGl0UGFzc3dvcmQnLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbmV3X3Bhc3M6IG5ld19wYXNzXG4gICAgICB9XG4gICAgfTtcbiAgICByZXNwb25zZSA9IGF3YWl0IHV0aWxpdHkubWFrZVJlcXVlc3Qob3B0aW9ucyk7XG4gICAgaWYgKDUwMCA9PT0gcmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICBhbGVydCgnRXJyb3JlIGR1cmFudGUgaWwgY2FtYmlvIGRlbGxhIHBhc3N3b3JkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhbGVydCgnT0snKTtcbiAgICBTdG9yZS5OZXdTdGF0ZShzaG93SG9tZSgpKTtcbiAgfVxufTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge1xuICBvdXQuYmUoXCJkaXZcIiwgbnVsbCwgXCIwXCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQuYmUoXCJmb3JtXCIsIHtcbiAgICBcImFjdGlvblwiOiBcIi92MS4wL2FwcC9wYXNzd29yZENoYW5nZVwiLFxuICAgIFwibWV0aG9kXCI6IFwicG9zdFwiXG4gIH0sIFwiMVwiLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgb3V0LmJlKFwiZGl2XCIsIHtcbiAgICBcImNsYXNzXCI6IFwicGFzc3dvcmQtY2hhbmdlLWZvcm1cIlxuICB9LCBcIjJcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5iZShcImRpdlwiLCB7XG4gICAgXCJjbGFzc1wiOiBcIm5ldy1wYXNzd29yZFwiXG4gIH0sIFwiM1wiLCBfY29tcG9uZW50LCBudWxsLCAxKTtcbiAgb3V0LmJlKFwibGFiZWxcIiwge1xuICAgIFwiZm9yXCI6IFwib2xkLXBhc3NcIlxuICB9LCBcIjRcIiwgX2NvbXBvbmVudCwgbnVsbCwgMCk7XG4gIG91dC50KFwiVmVjY2hpYSBQYXNzd29yZDpcIiwgX2NvbXBvbmVudCk7XG4gIG91dC5lZSgpO1xuICBvdXQuZShcImlucHV0XCIsIHtcbiAgICBcImlkXCI6IFwib2xkLXBhc3NcIixcbiAgICBcInR5cGVcIjogXCJwYXNzd29yZFwiLFxuICAgIFwibmFtZVwiOiBcIm9sZC1wYXNzXCIsXG4gICAgXCJhdXRvY29tcGxldGVcIjogXCJjdXJyZW50LXBhc3N3b3JkXCIsXG4gICAgXCJjbGFzc1wiOiBcImZvcm0tY29udHJvbCBpbnB1dC1zbSBjaGF0LWlucHV0XCIsXG4gICAgXCJwbGFjZWhvbGRlclwiOiBcIlZlY2NoaWEgcGFzc3dvcmRcIixcbiAgICBcInJlcXVpcmVkXCI6IFwiXCIsXG4gICAgXCJhdXRvZm9jdXNcIjogXCJcIlxuICB9LCBcIjVcIiwgX2NvbXBvbmVudCwgMCwgMCk7XG4gIG91dC5lZSgpO1xuICBvdXQuYmUoXCJkaXZcIiwge1xuICAgIFwiY2xhc3NcIjogXCJuZXctcGFzc3dvcmRcIlxuICB9LCBcIjZcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5iZShcImxhYmVsXCIsIHtcbiAgICBcImZvclwiOiBcIm5ldy1wYXNzXCJcbiAgfSwgXCI3XCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQudChcIk51b3ZhIFBhc3N3b3JkOlwiLCBfY29tcG9uZW50KTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lKFwiaW5wdXRcIiwge1xuICAgIFwiaWRcIjogXCJuZXctcGFzc1wiLFxuICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXG4gICAgXCJuYW1lXCI6IFwibmV3LXBhc3NcIixcbiAgICBcImNsYXNzXCI6IFwiZm9ybS1jb250cm9sIGlucHV0LXNtIGNoYXQtaW5wdXRcIixcbiAgICBcInBsYWNlaG9sZGVyXCI6IFwiTnVvdmEgcGFzc3dvcmRcIixcbiAgICBcInJlcXVpcmVkXCI6IFwiXCJcbiAgfSwgXCI4XCIsIF9jb21wb25lbnQsIDAsIDApO1xuICBvdXQuZWUoKTtcbiAgb3V0LmJlKFwiZGl2XCIsIHtcbiAgICBcImNsYXNzXCI6IFwibmV3LXBhc3N3b3JkXCJcbiAgfSwgXCI5XCIsIF9jb21wb25lbnQsIG51bGwsIDEpO1xuICBvdXQuYmUoXCJsYWJlbFwiLCB7XG4gICAgXCJmb3JcIjogXCJjb25maXJtLXBhc3NcIlxuICB9LCBcIjEwXCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQudChcIkNvbmZlcm1hIE51b3ZhIFBhc3N3b3JkOlwiLCBfY29tcG9uZW50KTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lKFwiaW5wdXRcIiwge1xuICAgIFwiaWRcIjogXCJjb25maXJtLXBhc3NcIixcbiAgICBcInR5cGVcIjogXCJwYXNzd29yZFwiLFxuICAgIFwibmFtZVwiOiBcImNvbmZpcm0tcGFzc1wiLFxuICAgIFwiY2xhc3NcIjogXCJmb3JtLWNvbnRyb2wgaW5wdXQtc20gY2hhdC1pbnB1dFwiLFxuICAgIFwicGxhY2Vob2xkZXJcIjogXCJDb25mZXJtYSBOdW92YSBQYXNzd29yZFwiLFxuICAgIFwicmVxdWlyZWRcIjogXCJcIlxuICB9LCBcIjExXCIsIF9jb21wb25lbnQsIDAsIDApO1xuICBvdXQuZWUoKTtcbiAgb3V0LmJlKFwiZGl2XCIsIHtcbiAgICBcImNsYXNzXCI6IFwiYnV0dG9uLXdyYXBwZXItcGFzc1wiXG4gIH0sIFwiMTJcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5lKFwiaW5wdXRcIiwge1xuICAgIFwidHlwZVwiOiBcInN1Ym1pdFwiLFxuICAgIFwibmFtZVwiOiBcIlNhbHZhXCIsXG4gICAgXCJjbGFzc1wiOiBcImJ0biBidG4tc3VjY2Vzc1wiLFxuICAgIFwidmFsdWVcIjogXCJTYWx2YVwiXG4gIH0sIFwiMTNcIiwgX2NvbXBvbmVudCwgMCwgMCwge1xuICAgIFwib25jbGlja1wiOiBfY29tcG9uZW50RGVmLmQoXCJjbGlja1wiLCBcIm9uU2F2ZVwiLCBmYWxzZSlcbiAgfSk7XG4gIG91dC5lZSgpO1xuICBvdXQuZWUoKTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lZSgpO1xufSwge1xuICB0OiBfbWFya29fY29tcG9uZW50VHlwZSxcbiAgZDogdHJ1ZVxufSwgX21hcmtvX2NvbXBvbmVudCk7XG5pbXBvcnQgX21hcmtvX2RlZmluZUNvbXBvbmVudCBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanNcIjtcbl9tYXJrb190ZW1wbGF0ZS5Db21wb25lbnQgPSBfbWFya29fZGVmaW5lQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnQsIF9tYXJrb190ZW1wbGF0ZS5fKTsiLCIvLyBDb21waWxlZCB1c2luZyBtYXJrb0A1LjMzLjE0IC0gRE8gTk9UIEVESVRcbmltcG9ydCB7IHQgYXMgX3QgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvdmRvbS9pbmRleC5qc1wiO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudFR5cGUgPSBcInVpXFxcXG1hcmtvXFxcXGhvbWVcXFxcaG9tZS5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgX2xlZnRNZW51IGZyb20gXCIuLi9jb21wb25lbnRzL2xlZnQtbWVudS9pbmRleC5tYXJrb1wiO1xuaW1wb3J0IF9tYXJrb190YWcgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2hlbHBlcnMvcmVuZGVyLXRhZy5qc1wiO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHtcbiAgb25DcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lbnVfaXRlbTogW3tcbiAgICAgICAgaWQ6ICdwYXNzd29yZCcsXG4gICAgICAgIG5hbWU6ICdDYW1iaW8gUGFzc3dvcmQnXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiAnYW5hZ3JhZmljYScsXG4gICAgICAgIG5hbWU6ICdEYXRpIEFuYWdyYWZpY2knXG4gICAgICB9XSxcbiAgICAgIG1lbnVfbGluazogW11cbiAgICB9O1xuICB9LFxuICBvbk1vdW50KCkge1xuICAgIGxldCBsaXN0R3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3QtZ3JvdXBcIik7XG4gICAgbGV0IGFMaXN0ID0gbGlzdEdyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcbiAgICB0aGlzLnN0YXRlLm1lbnVfbGluayA9IGFMaXN0O1xuICB9LFxuICBjaGFuZ2VkSG9tZVBhZ2UodGFyZ2V0KSB7XG4gICAgbGV0IG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob21lLWNvbnRlbnQnKTtcbiAgICBTdG9yZS5OZXdTdGF0ZSh1cGRhdGVIb21lQ29udGVudCh0YXJnZXQsIG91dHB1dCkpO1xuICB9XG59O1xuX21hcmtvX3RlbXBsYXRlLl8gPSBfbWFya29fcmVuZGVyZXIoZnVuY3Rpb24gKGlucHV0LCBvdXQsIF9jb21wb25lbnREZWYsIF9jb21wb25lbnQsIHN0YXRlLCAkZ2xvYmFsKSB7XG4gIG91dC5iZShcImRpdlwiLCB7XG4gICAgXCJjbGFzc1wiOiBcImhvbWUtY29udGFpbmVyXCJcbiAgfSwgXCIwXCIsIF9jb21wb25lbnQsIG51bGwsIDEpO1xuICBfbWFya29fdGFnKF9sZWZ0TWVudSwge1xuICAgIFwicGFyYW1zXCI6IHN0YXRlLm1lbnVfaXRlbVxuICB9LCBvdXQsIF9jb21wb25lbnREZWYsIFwiMVwiLCBbW1wiY2hhbmdlZEhvbWVQYWdlXCIsICdjaGFuZ2VkSG9tZVBhZ2UnLCBmYWxzZV1dKTtcbiAgb3V0LnQoXCIgXCIsIF9jb21wb25lbnQpO1xuICBvdXQuYmUoXCJkaXZcIiwge1xuICAgIFwiaWRcIjogXCJob21lLWNvbnRlbnRcIlxuICB9LCBcIjJcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5iZShcInBcIiwgbnVsbCwgXCIzXCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQudChcIkJlbnZlbnV0aSBzdWwgc2l0byBkaSBnZXN0aW9uZSBwcmVub3RhemlvbmkgZGVsIHNlcnZpemlvIHNhbml0YXJpbyBuYXppb25hbGUuXCIsIF9jb21wb25lbnQpO1xuICBvdXQuZWUoKTtcbiAgb3V0LmJlKFwicFwiLCBudWxsLCBcIjRcIiwgX2NvbXBvbmVudCwgbnVsbCwgMCk7XG4gIG91dC50KFwiRGEgcXVlc3RhIHBhZ2luYSBwb3RldGUgcmFnZ2l1bmdlcmUgbGUgcGFnaW5lIHBlciBsYSBnZXN0aW9uZSBkZWwgdm9zdHJvIGFjY291bnQuXCIsIF9jb21wb25lbnQpO1xuICBvdXQuZWUoKTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lZSgpO1xufSwge1xuICB0OiBfbWFya29fY29tcG9uZW50VHlwZSxcbiAgZDogdHJ1ZVxufSwgX21hcmtvX2NvbXBvbmVudCk7XG5pbXBvcnQgX21hcmtvX2RlZmluZUNvbXBvbmVudCBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanNcIjtcbl9tYXJrb190ZW1wbGF0ZS5Db21wb25lbnQgPSBfbWFya29fZGVmaW5lQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnQsIF9tYXJrb190ZW1wbGF0ZS5fKTsiLCJ2YXIgQ29tcG9uZW50RGVmID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnREZWZcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVnaW5Db21wb25lbnQoXG4gIGNvbXBvbmVudHNDb250ZXh0LFxuICBjb21wb25lbnQsXG4gIGtleSxcbiAgb3duZXJDb21wb25lbnREZWZcbikge1xuICB2YXIgY29tcG9uZW50SWQgPSBjb21wb25lbnQuaWQ7XG4gIHZhciBjb21wb25lbnREZWYgPSAoY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmID0gbmV3IENvbXBvbmVudERlZihcbiAgICBjb21wb25lbnQsXG4gICAgY29tcG9uZW50SWQsXG4gICAgY29tcG9uZW50c0NvbnRleHRcbiAgKSk7XG4gIGNvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtcbiAgICBjb21wb25lbnRJZFxuICBdID0gdHJ1ZTtcbiAgY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudERlZik7XG5cbiAgdmFyIG91dCA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX291dDtcbiAgb3V0LmJjKGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudERlZiAmJiBvd25lckNvbXBvbmVudERlZi5fX19jb21wb25lbnQpO1xuICByZXR1cm4gY29tcG9uZW50RGVmO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuZENvbXBvbmVudChvdXQpIHtcbiAgb3V0LmVlKCk7IC8vIGVuZEVsZW1lbnQoKSAoYWxzbyB3b3JrcyBmb3IgVkNvbXBvbmVudCBub2RlcyBwdXNoZWQgb24gdG8gdGhlIHN0YWNrKVxufTtcbiIsInZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG52YXIgc2V0SW1tZWRpYXRlID0gcmVxdWlyZShcIkBpbnRlcm5hbC9zZXQtaW1tZWRpYXRlXCIpLl9fX3NldEltbWVkaWF0ZTtcbnZhciB3YXJwMTBGaW5hbGl6ZSA9IHJlcXVpcmUoXCJ3YXJwMTAvZmluYWxpemVcIik7XG52YXIgZGVmaW5lQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnRcIik7XG52YXIgZXZlbnREZWxlZ2F0aW9uID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9ldmVudC1kZWxlZ2F0aW9uXCIpO1xudmFyIGNyZWF0ZUZyYWdtZW50Tm9kZSA9XG4gIHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL3Zkb20vbW9ycGhkb20vZnJhZ21lbnRcIikuX19fY3JlYXRlRnJhZ21lbnROb2RlO1xudmFyIENvbXBvbmVudERlZiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50RGVmXCIpO1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgcmVxID0gcmVxdWlyZShcIkBpbnRlcm5hbC9yZXF1aXJlXCIpO1xudmFyIGNvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzID1cbiAgY29tcG9uZW50c1V0aWwuX19fYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cztcbnZhciBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZCA9IGRvbURhdGEuX19fc3NyS2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWQ7XG52YXIgY29tcG9uZW50c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIHNlcnZlckNvbXBvbmVudFJvb3ROb2RlcyA9IHt9O1xudmFyIHNlcnZlclJlbmRlcmVkTWV0YSA9IHt9O1xudmFyIHdpbiA9IHdpbmRvdztcblxudmFyIERFRkFVTFRfUlVOVElNRV9JRCA9IFwiTVwiO1xudmFyIEZMQUdfV0lMTF9SRVJFTkRFUl9JTl9CUk9XU0VSID0gMTtcbi8vIHZhciBGTEFHX0hBU19SRU5ERVJfQk9EWSA9IDI7XG5cbnZhciByZWdpc3RlcmVkID0ge307XG52YXIgbG9hZGVkID0ge307XG52YXIgY29tcG9uZW50VHlwZXMgPSB7fTtcbnZhciBkZWZlcnJlZERlZnM7XG52YXIgcGVuZGluZ0RlZnM7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKHR5cGUsIGRlZikge1xuICB2YXIgcGVuZGluZ0ZvclR5cGU7XG4gIGlmIChwZW5kaW5nRGVmcykge1xuICAgIHBlbmRpbmdGb3JUeXBlID0gcGVuZGluZ0RlZnNbdHlwZV07XG4gIH1cbiAgcmVnaXN0ZXJlZFt0eXBlXSA9IGRlZjtcbiAgZGVsZXRlIGxvYWRlZFt0eXBlXTtcbiAgZGVsZXRlIGNvbXBvbmVudFR5cGVzW3R5cGVdO1xuXG4gIGlmIChwZW5kaW5nRm9yVHlwZSkge1xuICAgIGRlbGV0ZSBwZW5kaW5nRGVmc1t0eXBlXTtcbiAgICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgcGVuZGluZ0ZvclR5cGUuZm9yRWFjaChmdW5jdGlvbiAoYXJncykge1xuICAgICAgICB0cnlIeWRyYXRlQ29tcG9uZW50KGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB0eXBlO1xufVxuXG5mdW5jdGlvbiBhZGRQZW5kaW5nRGVmKGRlZiwgdHlwZSwgbWV0YSwgaG9zdCwgcnVudGltZUlkKSB7XG4gIGlmICghcGVuZGluZ0RlZnMpIHtcbiAgICBwZW5kaW5nRGVmcyA9IHt9O1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBlbmRpbmdDb21wb25lbnRJZHMgPSBPYmplY3Qua2V5cyhwZW5kaW5nRGVmcyk7XG4gICAgICAgIGlmIChwZW5kaW5nQ29tcG9uZW50SWRzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgICAgXCJNYXJrbyB0ZW1wbGF0ZXMgd2VyZSBuZXZlciBsb2FkZWQgZm9yOiBcIiArIHBlbmRpbmdDb21wb25lbnRJZHNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgKHBlbmRpbmdEZWZzW3R5cGVdID0gcGVuZGluZ0RlZnNbdHlwZV0gfHwgW10pLnB1c2goW1xuICAgIGRlZixcbiAgICBtZXRhLFxuICAgIGhvc3QsXG4gICAgcnVudGltZUlkLFxuICBdKTtcbn1cblxuZnVuY3Rpb24gbG9hZCh0eXBlTmFtZSwgaXNMZWdhY3kpIHtcbiAgdmFyIHRhcmdldCA9IGxvYWRlZFt0eXBlTmFtZV07XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGFyZ2V0ID0gcmVnaXN0ZXJlZFt0eXBlTmFtZV07XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQoKTtcbiAgICB9IGVsc2UgaWYgKGlzTGVnYWN5KSB7XG4gICAgICB0YXJnZXQgPSBleHBvcnRzLl9fX2xlZ2FjeS5sb2FkKHR5cGVOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0ID0gcmVxKHR5cGVOYW1lKTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgXCJMb29rcyBsaWtlIHlvdSB1c2VkIGByZXF1aXJlOmAgaW4geW91ciBicm93c2VyLmpzb24gdG8gbG9hZCBhIGNvbXBvbmVudC4gIFRoaXMgcmVxdWlyZXMgdGhhdCBNYXJrbyBoYXMga25vd2xlZGdlIG9mIGhvdyBsYXNzbyBnZW5lcmF0ZXMgcGF0aHMgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSB2ZXJzaW9uLiAgYG1hcmtvLWRlcGVuZGVuY2llczovcGF0aC90by90ZW1wbGF0ZS5tYXJrb2Agc2hvdWxkIGJlIHVzZWQgaW5zdGVhZC5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcihcIkNvbXBvbmVudCBub3QgZm91bmQ6IFwiICsgdHlwZU5hbWUpO1xuICAgIH1cblxuICAgIGxvYWRlZFt0eXBlTmFtZV0gPSB0YXJnZXQ7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRDbGFzcyh0eXBlTmFtZSwgaXNMZWdhY3kpIHtcbiAgdmFyIENvbXBvbmVudENsYXNzID0gY29tcG9uZW50VHlwZXNbdHlwZU5hbWVdO1xuXG4gIGlmIChDb21wb25lbnRDbGFzcykge1xuICAgIHJldHVybiBDb21wb25lbnRDbGFzcztcbiAgfVxuXG4gIENvbXBvbmVudENsYXNzID0gbG9hZCh0eXBlTmFtZSwgaXNMZWdhY3kpO1xuXG4gIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQ29tcG9uZW50IHx8IENvbXBvbmVudENsYXNzO1xuXG4gIGlmICghQ29tcG9uZW50Q2xhc3MuX19faXNDb21wb25lbnQpIHtcbiAgICBDb21wb25lbnRDbGFzcyA9IGRlZmluZUNvbXBvbmVudChDb21wb25lbnRDbGFzcywgQ29tcG9uZW50Q2xhc3MucmVuZGVyZXIpO1xuICB9XG5cbiAgLy8gTWFrZSB0aGUgY29tcG9uZW50IFwidHlwZVwiIGFjY2Vzc2libGUgb24gZWFjaCBjb21wb25lbnQgaW5zdGFuY2VcbiAgQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlLl9fX3R5cGUgPSB0eXBlTmFtZTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICB2YXIgY2xhc3NOYW1lTWF0Y2ggPVxuICAgICAgL1xcLyhbXi9dKz8pKD86XFwvaW5kZXh8XFwvdGVtcGxhdGV8KSg/OlxcLm1hcmtvfFxcLmNvbXBvbmVudCg/Oi1icm93c2VyKT98KSQvLmV4ZWMoXG4gICAgICAgIHR5cGVOYW1lXG4gICAgICApO1xuICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVNYXRjaCA/IGNsYXNzTmFtZU1hdGNoWzFdIDogXCJBbm9ueW1vdXNDb21wb25lbnRcIjtcbiAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUucmVwbGFjZSgvLSguKS9nLCBmdW5jdGlvbiAoZykge1xuICAgICAgcmV0dXJuIGdbMV0udG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICBjbGFzc05hbWUgPSBjbGFzc05hbWVcbiAgICAgIC5yZXBsYWNlKC9cXCRcXGQrXFwuXFxkK1xcLlxcZCskLywgXCJcIilcbiAgICAgIC5yZXBsYWNlKC9eW15hLXokX10vaSwgXCJfJCZcIilcbiAgICAgIC5yZXBsYWNlKC9bXjAtOWEteiRfXSsvZ2ksIFwiX1wiKTtcbiAgICBjbGFzc05hbWUgPSBjbGFzc05hbWVbMF0udG9VcHBlckNhc2UoKSArIGNsYXNzTmFtZS5zbGljZSgxKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgT2xkQ29tcG9uZW50Q2xhc3MgPSBDb21wb25lbnRDbGFzcztcbiAgICBDb21wb25lbnRDbGFzcyA9IHtcbiAgICAgIFtjbGFzc05hbWVdOiBmdW5jdGlvbiAoaWQsIGRvYykge1xuICAgICAgICBPbGRDb21wb25lbnRDbGFzcy5jYWxsKHRoaXMsIGlkLCBkb2MpO1xuICAgICAgfSxcbiAgICB9W2NsYXNzTmFtZV07XG4gICAgQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlID0gT2xkQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlO1xuICB9XG5cbiAgY29tcG9uZW50VHlwZXNbdHlwZU5hbWVdID0gQ29tcG9uZW50Q2xhc3M7XG5cbiAgcmV0dXJuIENvbXBvbmVudENsYXNzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQodHlwZU5hbWUsIGlkLCBpc0xlZ2FjeSkge1xuICB2YXIgQ29tcG9uZW50Q2xhc3MgPSBnZXRDb21wb25lbnRDbGFzcyh0eXBlTmFtZSwgaXNMZWdhY3kpO1xuICByZXR1cm4gbmV3IENvbXBvbmVudENsYXNzKGlkKTtcbn1cblxuZnVuY3Rpb24gaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKG5vZGUsIHJ1bnRpbWVJZCwgc3RhY2spIHtcbiAgdmFyIGNvbXBvbmVudElkO1xuICB2YXIgb3duZXJJZDtcbiAgdmFyIG93bmVyQ29tcG9uZW50O1xuICB2YXIga2V5ZWRFbGVtZW50cztcbiAgdmFyIG5leHRTaWJsaW5nO1xuICB2YXIgcnVudGltZUxlbmd0aCA9IHJ1bnRpbWVJZC5sZW5ndGg7XG4gIHN0YWNrID0gc3RhY2sgfHwgW107XG5cbiAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBuZXh0U2libGluZyA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgIC8vIENvbW1lbnQgbm9kZVxuICAgICAgdmFyIGNvbW1lbnRWYWx1ZSA9IG5vZGUubm9kZVZhbHVlO1xuICAgICAgaWYgKGNvbW1lbnRWYWx1ZS5zbGljZSgwLCBydW50aW1lTGVuZ3RoKSA9PT0gcnVudGltZUlkKSB7XG4gICAgICAgIHZhciBmaXJzdENoYXIgPSBjb21tZW50VmFsdWVbcnVudGltZUxlbmd0aF07XG5cbiAgICAgICAgaWYgKGZpcnN0Q2hhciA9PT0gXCJeXCIgfHwgZmlyc3RDaGFyID09PSBcIiNcIikge1xuICAgICAgICAgIHN0YWNrLnB1c2gobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmlyc3RDaGFyID09PSBcIi9cIikge1xuICAgICAgICAgIHZhciBlbmROb2RlID0gbm9kZTtcbiAgICAgICAgICB2YXIgc3RhcnROb2RlID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlO1xuXG4gICAgICAgICAgaWYgKHN0YXJ0Tm9kZS5wYXJlbnROb2RlID09PSBlbmROb2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHJvb3ROb2RlID0gY3JlYXRlRnJhZ21lbnROb2RlKHN0YXJ0Tm9kZS5uZXh0U2libGluZywgZW5kTm9kZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJvb3ROb2RlID0gY3JlYXRlRnJhZ21lbnROb2RlKFxuICAgICAgICAgICAgICBlbmROb2RlLnBhcmVudE5vZGUuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgZW5kTm9kZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb21wb25lbnRJZCA9IHN0YXJ0Tm9kZS5ub2RlVmFsdWUuc3Vic3RyaW5nKHJ1bnRpbWVMZW5ndGggKyAxKTtcbiAgICAgICAgICBmaXJzdENoYXIgPSBzdGFydE5vZGUubm9kZVZhbHVlW3J1bnRpbWVMZW5ndGhdO1xuXG4gICAgICAgICAgaWYgKGZpcnN0Q2hhciA9PT0gXCJeXCIpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGNvbXBvbmVudElkLnNwbGl0KC8gL2cpO1xuICAgICAgICAgICAgdmFyIGtleSA9IHBhcnRzWzJdO1xuICAgICAgICAgICAgb3duZXJJZCA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgY29tcG9uZW50SWQgPSBwYXJ0c1swXTtcbiAgICAgICAgICAgIGlmICgob3duZXJDb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbb3duZXJJZF0pKSB7XG4gICAgICAgICAgICAgIGtleWVkRWxlbWVudHMgPSBvd25lckNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAga2V5ZWRFbGVtZW50cyA9XG4gICAgICAgICAgICAgICAga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbb3duZXJJZF0gfHxcbiAgICAgICAgICAgICAgICAoa2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbb3duZXJJZF0gPSB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzKFxuICAgICAgICAgICAgICBrZXllZEVsZW1lbnRzLFxuICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgIHJvb3ROb2RlLFxuICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZXJ2ZXJDb21wb25lbnRSb290Tm9kZXNbY29tcG9uZW50SWRdID0gcm9vdE5vZGU7XG5cbiAgICAgICAgICBzdGFydE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdGFydE5vZGUpO1xuICAgICAgICAgIGVuZE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbmROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgLy8gSFRNTCBlbGVtZW50IG5vZGVcbiAgICAgIHZhciBtYXJrb0tleSA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1tYXJrby1rZXlcIik7XG4gICAgICB2YXIgbWFya29Qcm9wcyA9IGNvbXBvbmVudHNVdGlsLl9fX2dldE1hcmtvUHJvcHNGcm9tRWwobm9kZSk7XG4gICAgICBpZiAobWFya29LZXkpIHtcbiAgICAgICAgdmFyIHNlcGFyYXRvckluZGV4ID0gbWFya29LZXkuaW5kZXhPZihcIiBcIik7XG4gICAgICAgIG93bmVySWQgPSBtYXJrb0tleS5zdWJzdHJpbmcoc2VwYXJhdG9ySW5kZXggKyAxKTtcbiAgICAgICAgbWFya29LZXkgPSBtYXJrb0tleS5zdWJzdHJpbmcoMCwgc2VwYXJhdG9ySW5kZXgpO1xuICAgICAgICBpZiAoKG93bmVyQ29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW293bmVySWRdKSkge1xuICAgICAgICAgIGtleWVkRWxlbWVudHMgPSBvd25lckNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtleWVkRWxlbWVudHMgPVxuICAgICAgICAgICAga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbb3duZXJJZF0gfHxcbiAgICAgICAgICAgIChrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSA9IHt9KTtcbiAgICAgICAgfVxuICAgICAgICBrZXllZEVsZW1lbnRzW21hcmtvS2V5XSA9IG5vZGU7XG4gICAgICB9XG4gICAgICBpZiAobWFya29Qcm9wcykge1xuICAgICAgICBPYmplY3Qua2V5cyhtYXJrb1Byb3BzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5LnNsaWNlKDAsIDIpID09PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIGV2ZW50RGVsZWdhdGlvbi5fX19hZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIoa2V5LnNsaWNlKDIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKG5vZGUsIHJ1bnRpbWVJZCwgc3RhY2spO1xuICAgIH1cblxuICAgIG5vZGUgPSBuZXh0U2libGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDb21wb25lbnRFdmVudEhhbmRsZXIoY29tcG9uZW50LCB0YXJnZXRNZXRob2ROYW1lLCBhcmdzKSB7XG4gIHZhciBtZXRob2QgPSBjb21wb25lbnRbdGFyZ2V0TWV0aG9kTmFtZV07XG4gIGlmICghbWV0aG9kKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJNZXRob2Qgbm90IGZvdW5kOiBcIiArIHRhcmdldE1ldGhvZE5hbWUpO1xuICB9XG5cbiAgbWV0aG9kLmFwcGx5KGNvbXBvbmVudCwgYXJncyk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJIZWxwZXIoZWwsIGV2ZW50VHlwZSwgaXNPbmNlLCBsaXN0ZW5lcikge1xuICB2YXIgZXZlbnRMaXN0ZW5lciA9IGxpc3RlbmVyO1xuICBpZiAoaXNPbmNlKSB7XG4gICAgZXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGlzdGVuZXIoZXZlbnQpO1xuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50TGlzdGVuZXIpO1xuICAgIH07XG4gIH1cblxuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRMaXN0ZW5lciwgZmFsc2UpO1xuXG4gIHJldHVybiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50TGlzdGVuZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRET01FdmVudExpc3RlbmVycyhcbiAgY29tcG9uZW50LFxuICBlbCxcbiAgZXZlbnRUeXBlLFxuICB0YXJnZXRNZXRob2ROYW1lLFxuICBpc09uY2UsXG4gIGV4dHJhQXJncyxcbiAgaGFuZGxlc1xuKSB7XG4gIHZhciByZW1vdmVMaXN0ZW5lciA9IGFkZEV2ZW50TGlzdGVuZXJIZWxwZXIoXG4gICAgZWwsXG4gICAgZXZlbnRUeXBlLFxuICAgIGlzT25jZSxcbiAgICBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBhcmdzID0gW2V2ZW50LCBlbF07XG4gICAgICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgICAgIGFyZ3MgPSBleHRyYUFyZ3MuY29uY2F0KGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICBpbnZva2VDb21wb25lbnRFdmVudEhhbmRsZXIoY29tcG9uZW50LCB0YXJnZXRNZXRob2ROYW1lLCBhcmdzKTtcbiAgICB9XG4gICk7XG4gIGhhbmRsZXMucHVzaChyZW1vdmVMaXN0ZW5lcik7XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wb25lbnQoY29tcG9uZW50RGVmLCBob3N0KSB7XG4gIHZhciBjb21wb25lbnQgPSBjb21wb25lbnREZWYuX19fY29tcG9uZW50O1xuXG4gIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuX19faXNDb21wb25lbnQpIHtcbiAgICByZXR1cm47IC8vIGxlZ2FjeVxuICB9XG5cbiAgY29tcG9uZW50Ll9fX3Jlc2V0KCk7XG4gIGNvbXBvbmVudC5fX19ob3N0ID0gaG9zdDtcblxuICB2YXIgaXNFeGlzdGluZyA9IGNvbXBvbmVudERlZi5fX19pc0V4aXN0aW5nO1xuXG4gIGlmIChpc0V4aXN0aW5nKSB7XG4gICAgY29tcG9uZW50Ll9fX3JlbW92ZURPTUV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICB2YXIgZG9tRXZlbnRzID0gY29tcG9uZW50RGVmLl9fX2RvbUV2ZW50cztcbiAgaWYgKGRvbUV2ZW50cykge1xuICAgIHZhciBldmVudExpc3RlbmVySGFuZGxlcyA9IFtdO1xuXG4gICAgZG9tRXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGRvbUV2ZW50QXJncykge1xuICAgICAgLy8gVGhlIGV2ZW50IG1hcHBpbmcgaXMgZm9yIGEgZGlyZWN0IERPTSBldmVudCAobm90IGEgY3VzdG9tIGV2ZW50IGFuZCBub3QgZm9yIGJ1YmJsaWduIGRvbSBldmVudHMpXG5cbiAgICAgIHZhciBldmVudFR5cGUgPSBkb21FdmVudEFyZ3NbMF07XG4gICAgICB2YXIgdGFyZ2V0TWV0aG9kTmFtZSA9IGRvbUV2ZW50QXJnc1sxXTtcbiAgICAgIHZhciBldmVudEVsID0gY29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbZG9tRXZlbnRBcmdzWzJdXTtcbiAgICAgIHZhciBpc09uY2UgPSBkb21FdmVudEFyZ3NbM107XG4gICAgICB2YXIgZXh0cmFBcmdzID0gZG9tRXZlbnRBcmdzWzRdO1xuXG4gICAgICBhZGRET01FdmVudExpc3RlbmVycyhcbiAgICAgICAgY29tcG9uZW50LFxuICAgICAgICBldmVudEVsLFxuICAgICAgICBldmVudFR5cGUsXG4gICAgICAgIHRhcmdldE1ldGhvZE5hbWUsXG4gICAgICAgIGlzT25jZSxcbiAgICAgICAgZXh0cmFBcmdzLFxuICAgICAgICBldmVudExpc3RlbmVySGFuZGxlc1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGlmIChldmVudExpc3RlbmVySGFuZGxlcy5sZW5ndGgpIHtcbiAgICAgIGNvbXBvbmVudC5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcyA9IGV2ZW50TGlzdGVuZXJIYW5kbGVzO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjb21wb25lbnQuX19fbW91bnRlZCkge1xuICAgIGNvbXBvbmVudC5fX19lbWl0VXBkYXRlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29tcG9uZW50Ll9fX21vdW50ZWQgPSB0cnVlO1xuICAgIGNvbXBvbmVudC5fX19lbWl0TW91bnQoKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gaW5pdGlhbGl6ZWQgY29tcG9uZW50cyBhc3NvY2lhdGVkIHdpdGggVUkgY29tcG9uZW50c1xuICogcmVuZGVyZWQgaW4gdGhlIGJyb3dzZXIuIFdoaWxlIHJlbmRlcmluZyBVSSBjb21wb25lbnRzIGEgXCJjb21wb25lbnRzIGNvbnRleHRcIlxuICogaXMgYWRkZWQgdG8gdGhlIHJlbmRlcmluZyBjb250ZXh0IHRvIGtlZXAgdXAgd2l0aCB3aGljaCBjb21wb25lbnRzIGFyZSByZW5kZXJlZC5cbiAqIFdoZW4gcmVhZHksIHRoZSBjb21wb25lbnRzIGNhbiB0aGVuIGJlIGluaXRpYWxpemVkIGJ5IHdhbGtpbmcgdGhlIGNvbXBvbmVudCB0cmVlXG4gKiBpbiB0aGUgY29tcG9uZW50cyBjb250ZXh0IChuZXN0ZWQgY29tcG9uZW50cyBhcmUgaW5pdGlhbGl6ZWQgYmVmb3JlIGFuY2VzdG9yIGNvbXBvbmVudHMpLlxuICogQHBhcmFtICB7QXJyYXk8bWFya28tY29tcG9uZW50cy9saWIvQ29tcG9uZW50RGVmPn0gY29tcG9uZW50RGVmcyBBbiBhcnJheSBvZiBDb21wb25lbnREZWYgaW5zdGFuY2VzXG4gKi9cbmZ1bmN0aW9uIGluaXRDbGllbnRSZW5kZXJlZChjb21wb25lbnREZWZzLCBob3N0KSB7XG4gIGlmICghaG9zdCkgaG9zdCA9IGRvY3VtZW50O1xuICAvLyBFbnN1cmUgdGhhdCBldmVudCBoYW5kbGVycyB0byBoYW5kbGUgZGVsZWdhdGluZyBldmVudHMgYXJlXG4gIC8vIGFsd2F5cyBhdHRhY2hlZCBiZWZvcmUgaW5pdGlhbGl6aW5nIGFueSBjb21wb25lbnRzXG4gIGV2ZW50RGVsZWdhdGlvbi5fX19pbml0KGhvc3QpO1xuICB2YXIgbGVuID0gY29tcG9uZW50RGVmcy5sZW5ndGg7XG4gIHZhciBjb21wb25lbnREZWY7XG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IGxlbjsgaS0tOyApIHtcbiAgICBjb21wb25lbnREZWYgPSBjb21wb25lbnREZWZzW2ldO1xuICAgIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZik7XG4gIH1cblxuICBmb3IgKGkgPSBsZW47IGktLTsgKSB7XG4gICAgY29tcG9uZW50RGVmID0gY29tcG9uZW50RGVmc1tpXTtcbiAgICBpbml0Q29tcG9uZW50KGNvbXBvbmVudERlZiwgaG9zdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpbml0aWFsaXplcyBhbGwgY29tcG9uZW50cyB0aGF0IHdlcmUgcmVuZGVyZWQgb24gdGhlIHNlcnZlciBieSBpdGVyYXRpbmcgb3ZlciBhbGxcbiAqIG9mIHRoZSBjb21wb25lbnQgSURzLlxuICovXG5mdW5jdGlvbiBpbml0U2VydmVyUmVuZGVyZWQocmVuZGVyZWRDb21wb25lbnRzLCBob3N0KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHJlbmRlcmVkQ29tcG9uZW50cztcbiAgdmFyIGdsb2JhbEtleSA9IFwiJFwiO1xuICB2YXIgcnVudGltZUlkO1xuXG4gIGlmICh0eXBlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJ1bnRpbWVJZCA9IHJlbmRlcmVkQ29tcG9uZW50cztcbiAgICAgIGdsb2JhbEtleSArPSBydW50aW1lSWQgKyBcIl9DXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbEtleSArPSAocnVudGltZUlkID0gREVGQVVMVF9SVU5USU1FX0lEKSArIFwiQ1wiO1xuICAgIH1cblxuICAgIHJlbmRlcmVkQ29tcG9uZW50cyA9IHdpbltnbG9iYWxLZXldO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGlmIChcbiAgICAgICAgcmVuZGVyZWRDb21wb25lbnRzICYmXG4gICAgICAgIHJlbmRlcmVkQ29tcG9uZW50cy5pICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgcmVuZGVyZWRDb21wb25lbnRzLmkgIT09IGNvbXBvbmVudHNVdGlsLl9fX3J1bnRpbWVJZFxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBcIk11bHRpcGxlIGluc3RhbmNlcyBvZiBNYXJrbyBoYXZlIGF0dGFjaGVkIHRvIHRoZSBzYW1lIHJ1bnRpbWUgaWQuIFRoaXMgY291bGQgbWVhbiB0aGF0IG1vcmUgdGhhbiBvbmUgY29weSBvZiBNYXJrbyBpcyBsb2FkZWQgb24gdGhlIHBhZ2UsIG9yIHRoYXQgdGhlIHNjcmlwdCBjb250YWluaW5nIE1hcmtvIGhhcyBleGVjdXRlZCBtb3JlIHRoYW4gb25jZS5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBmYWtlQXJyYXkgPSAod2luW2dsb2JhbEtleV0gPSB7XG4gICAgICByOiBydW50aW1lSWQsXG4gICAgICBjb25jYXQ6IGluaXRTZXJ2ZXJSZW5kZXJlZCxcbiAgICB9KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBmYWtlQXJyYXkuaSA9IGNvbXBvbmVudHNVdGlsLl9fX3J1bnRpbWVJZDtcbiAgICB9XG5cbiAgICBpZiAocmVuZGVyZWRDb21wb25lbnRzICYmIHJlbmRlcmVkQ29tcG9uZW50cy5mb3JFYWNoKSB7XG4gICAgICByZW5kZXJlZENvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbiAocmVuZGVyZWRDb21wb25lbnQpIHtcbiAgICAgICAgZmFrZUFycmF5LmNvbmNhdChyZW5kZXJlZENvbXBvbmVudCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFrZUFycmF5O1xuICB9XG5cbiAgdmFyIGlzRnJvbVNlcmlhbGl6ZWRHbG9iYWxzID0gdGhpcy5jb25jYXQgPT09IGluaXRTZXJ2ZXJSZW5kZXJlZDtcbiAgcmVuZGVyZWRDb21wb25lbnRzID0gd2FycDEwRmluYWxpemUocmVuZGVyZWRDb21wb25lbnRzKTtcblxuICBpZiAoaXNGcm9tU2VyaWFsaXplZEdsb2JhbHMpIHtcbiAgICBydW50aW1lSWQgPSB0aGlzLnI7XG4gICAgaG9zdCA9IGRvY3VtZW50O1xuICB9IGVsc2Uge1xuICAgIHJ1bnRpbWVJZCA9IHJlbmRlcmVkQ29tcG9uZW50cy5yIHx8IERFRkFVTFRfUlVOVElNRV9JRDtcbiAgICBpZiAoIWhvc3QpIGhvc3QgPSBkb2N1bWVudDtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgXCJQYXNzaW5nIHNlcmlhbGl6ZWQgZGF0YSB0byBgcmVxdWlyZSgnbWFya28vY29tcG9uZW50cykuaW5pdGAgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCBzZXQgJyRnbG9iYWwucnVudGltZUlkJyBhbmQgcHJvdmlkZSB0aGUgJ3J1bnRpbWVJZCcgb3B0aW9uIHRvIHlvdXIgTWFya28gYnVuZGxlciBwbHVnaW4uXCJcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgaWYgKGhvc3QgIT09IGRvY3VtZW50KSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgXCJQYXNzaW5nIGEgZG9jdW1lbnQgb3RoZXIgdGhhbiB0aGUgY3VycmVudCBkb2N1bWVudCB0byBgcmVxdWlyZSgnbWFya28vY29tcG9uZW50cykuaW5pdGAgaXMgZGVwcmVjYXRlZC5cIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcHJlZml4ID0gcmVuZGVyZWRDb21wb25lbnRzLnAgfHwgXCJcIjtcbiAgdmFyIG1ldGEgPSBzZXJ2ZXJSZW5kZXJlZE1ldGFbcHJlZml4XTtcbiAgdmFyIGlzTGFzdCA9IHJlbmRlcmVkQ29tcG9uZW50cy5sO1xuXG4gIGlmIChtZXRhKSB7XG4gICAgaWYgKGlzTGFzdCkge1xuICAgICAgZGVsZXRlIHNlcnZlclJlbmRlcmVkTWV0YVtwcmVmaXhdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtZXRhID0ge307XG5cbiAgICBpZiAoIWlzTGFzdCkge1xuICAgICAgc2VydmVyUmVuZGVyZWRNZXRhW3ByZWZpeF0gPSBtZXRhO1xuICAgIH1cbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGF0IGV2ZW50IGhhbmRsZXJzIHRvIGhhbmRsZSBkZWxlZ2F0aW5nIGV2ZW50cyBhcmVcbiAgLy8gYWx3YXlzIGF0dGFjaGVkIGJlZm9yZSBpbml0aWFsaXppbmcgYW55IGNvbXBvbmVudHNcbiAgaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKGhvc3QsIHJ1bnRpbWVJZCk7XG4gIGV2ZW50RGVsZWdhdGlvbi5fX19pbml0KGhvc3QpO1xuXG4gIGlmIChyZW5kZXJlZENvbXBvbmVudHMuZykge1xuICAgIG1ldGEuX19fZ2xvYmFscyA9IHJlbmRlcmVkQ29tcG9uZW50cy5nO1xuICB9XG5cbiAgaWYgKHJlbmRlcmVkQ29tcG9uZW50cy50KSB7XG4gICAgbWV0YS5fX190eXBlcyA9IG1ldGEuX19fdHlwZXNcbiAgICAgID8gbWV0YS5fX190eXBlcy5jb25jYXQocmVuZGVyZWRDb21wb25lbnRzLnQpXG4gICAgICA6IHJlbmRlcmVkQ29tcG9uZW50cy50O1xuICB9XG5cbiAgLy8gaHlkcmF0ZSBjb21wb25lbnRzIHRvcCBkb3duIChsZWFmIG5vZGVzIGxhc3QpXG4gIC8vIGFuZCByZXR1cm4gYW4gYXJyYXkgb2YgZnVuY3Rpb25zIHRvIG1vdW50IHRoZXNlIGNvbXBvbmVudHNcbiAgKHJlbmRlcmVkQ29tcG9uZW50cy53IHx8IFtdKVxuICAgIC5tYXAoZnVuY3Rpb24gKGNvbXBvbmVudERlZikge1xuICAgICAgdmFyIHR5cGVOYW1lID0gbWV0YS5fX190eXBlc1tjb21wb25lbnREZWZbMV1dO1xuXG4gICAgICByZXR1cm4gcmVnaXN0ZXJlZFt0eXBlTmFtZV0gfHxcbiAgICAgICAgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8XG4gICAgICAgIHJlcS5lKHR5cGVOYW1lKVxuICAgICAgICA/IHRyeUh5ZHJhdGVDb21wb25lbnQoY29tcG9uZW50RGVmLCBtZXRhLCBob3N0LCBydW50aW1lSWQpXG4gICAgICAgIDogYWRkUGVuZGluZ0RlZihjb21wb25lbnREZWYsIHR5cGVOYW1lLCBtZXRhLCBob3N0LCBydW50aW1lSWQpO1xuICAgIH0pXG4gICAgLnJldmVyc2UoKVxuICAgIC5mb3JFYWNoKHRyeUludm9rZSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIHRyeUh5ZHJhdGVDb21wb25lbnQocmF3RGVmLCBtZXRhLCBob3N0LCBydW50aW1lSWQpIHtcbiAgdmFyIGNvbXBvbmVudERlZiA9IENvbXBvbmVudERlZi5fX19kZXNlcmlhbGl6ZShcbiAgICByYXdEZWYsXG4gICAgbWV0YS5fX190eXBlcyxcbiAgICBtZXRhLl9fX2dsb2JhbHMsXG4gICAgZXhwb3J0c1xuICApO1xuICB2YXIgbW91bnQgPSBoeWRyYXRlQ29tcG9uZW50QW5kR2V0TW91bnQoY29tcG9uZW50RGVmLCBob3N0KTtcblxuICBpZiAoIW1vdW50KSB7XG4gICAgLy8gaHlkcmF0ZUNvbXBvbmVudEFuZEdldE1vdW50IHdpbGwgcmV0dXJuIGZhbHNlIGlmIHRoZXJlIGlzIG5vdCByb290Tm9kZVxuICAgIC8vIGZvciB0aGUgY29tcG9uZW50LiAgSWYgdGhpcyBpcyB0aGUgY2FzZSwgd2UnbGwgd2FpdCB1bnRpbCB0aGVcbiAgICAvLyBET00gaGFzIGZ1bGx5IGxvYWRlZCB0byBhdHRlbXB0IHRvIGluaXQgdGhlIGNvbXBvbmVudCBhZ2Fpbi5cbiAgICBpZiAoZGVmZXJyZWREZWZzKSB7XG4gICAgICBkZWZlcnJlZERlZnMucHVzaChjb21wb25lbnREZWYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZERlZnMgPSBbY29tcG9uZW50RGVmXTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKGhvc3QsIHJ1bnRpbWVJZCk7XG4gICAgICAgIGRlZmVycmVkRGVmc1xuICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGNvbXBvbmVudERlZikge1xuICAgICAgICAgICAgcmV0dXJuIGh5ZHJhdGVDb21wb25lbnRBbmRHZXRNb3VudChjb21wb25lbnREZWYsIGhvc3QpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgIC5mb3JFYWNoKHRyeUludm9rZSk7XG4gICAgICAgIGRlZmVycmVkRGVmcy5sZW5ndGggPSAwO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1vdW50O1xufVxuXG5mdW5jdGlvbiBoeWRyYXRlQ29tcG9uZW50QW5kR2V0TW91bnQoY29tcG9uZW50RGVmLCBob3N0KSB7XG4gIHZhciBjb21wb25lbnRJZCA9IGNvbXBvbmVudERlZi5pZDtcbiAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudERlZi5fX19jb21wb25lbnQ7XG4gIHZhciByb290Tm9kZSA9IHNlcnZlckNvbXBvbmVudFJvb3ROb2Rlc1tjb21wb25lbnRJZF07XG4gIHZhciByZW5kZXJSZXN1bHQ7XG5cbiAgaWYgKHJvb3ROb2RlKSB7XG4gICAgZGVsZXRlIHNlcnZlckNvbXBvbmVudFJvb3ROb2Rlc1tjb21wb25lbnRJZF07XG5cbiAgICBjb21wb25lbnQuX19fcm9vdE5vZGUgPSByb290Tm9kZTtcbiAgICBjb21wb25lbnRzQnlET01Ob2RlLnNldChyb290Tm9kZSwgY29tcG9uZW50KTtcblxuICAgIGlmIChjb21wb25lbnREZWYuX19fZmxhZ3MgJiBGTEFHX1dJTExfUkVSRU5ERVJfSU5fQlJPV1NFUikge1xuICAgICAgY29tcG9uZW50Ll9fX2hvc3QgPSBob3N0O1xuICAgICAgcmVuZGVyUmVzdWx0ID0gY29tcG9uZW50Ll9fX3JlcmVuZGVyKGNvbXBvbmVudC5fX19pbnB1dCwgdHJ1ZSk7XG4gICAgICB0cmFja0NvbXBvbmVudChjb21wb25lbnREZWYpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgICAgICByZW5kZXJSZXN1bHQuYWZ0ZXJJbnNlcnQoaG9zdCk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFja0NvbXBvbmVudChjb21wb25lbnREZWYpO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICAgIGluaXRDb21wb25lbnQoY29tcG9uZW50RGVmLCBob3N0KTtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZikge1xuICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudDtcbiAgaWYgKGNvbXBvbmVudCkge1xuICAgIGNvbXBvbmVudExvb2t1cFtjb21wb25lbnQuaWRdID0gY29tcG9uZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeUludm9rZShmbikge1xuICBpZiAoZm4pIGZuKCk7XG59XG5cbmV4cG9ydHMuciA9IHJlZ2lzdGVyO1xuZXhwb3J0cy5fX19jcmVhdGVDb21wb25lbnQgPSBjcmVhdGVDb21wb25lbnQ7XG5leHBvcnRzLl9fX2dldENvbXBvbmVudENsYXNzID0gZ2V0Q29tcG9uZW50Q2xhc3M7XG5leHBvcnRzLl9fX2luaXRTZXJ2ZXJSZW5kZXJlZCA9IHdpbi4kaW5pdENvbXBvbmVudHMgPSBpbml0U2VydmVyUmVuZGVyZWQ7XG5cbnJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50c0NvbnRleHRcIikuX19faW5pdENsaWVudFJlbmRlcmVkID1cbiAgaW5pdENsaWVudFJlbmRlcmVkO1xuIiwidmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGNvbXBvbmVudHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2NvbXBvbmVudEJ5RE9NTm9kZTtcbnZhciBrZXlzQnlET01Ob2RlID0gZG9tRGF0YS5fX19rZXlCeURPTU5vZGU7XG52YXIgdkVsZW1lbnRzQnlET01Ob2RlID0gZG9tRGF0YS5fX192RWxlbWVudEJ5RE9NTm9kZTtcbnZhciB2UHJvcHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZQcm9wc0J5RE9NTm9kZTtcbnZhciBtYXJrb1VJRCA9IHdpbmRvdy4kTVVJRCB8fCAod2luZG93LiRNVUlEID0geyBpOiAwIH0pO1xudmFyIHJ1bnRpbWVJZCA9IG1hcmtvVUlELmkrKztcblxudmFyIGNvbXBvbmVudExvb2t1cCA9IHt9O1xuXG52YXIgRU1QVFlfT0JKRUNUID0ge307XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudEZvckVsKGVsLCBob3N0KSB7XG4gIHZhciBub2RlID1cbiAgICB0eXBlb2YgZWwgPT0gXCJzdHJpbmdcIlxuICAgICAgPyAoKGhvc3QgPyBob3N0Lm93bmVyRG9jdW1lbnQgOiBob3N0KSB8fCBkb2N1bWVudCkuZ2V0RWxlbWVudEJ5SWQoZWwpXG4gICAgICA6IGVsO1xuICB2YXIgY29tcG9uZW50O1xuICB2YXIgdkVsZW1lbnQ7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZS5mcmFnbWVudCkge1xuICAgICAgaWYgKG5vZGUuZnJhZ21lbnQuZW5kTm9kZSA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gbm9kZS5mcmFnbWVudC5zdGFydE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gbm9kZS5mcmFnbWVudDtcbiAgICAgICAgY29tcG9uZW50ID0gY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgodkVsZW1lbnQgPSB2RWxlbWVudHNCeURPTU5vZGUuZ2V0KG5vZGUpKSkge1xuICAgICAgY29tcG9uZW50ID0gdkVsZW1lbnQuX19fb3duZXJDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmcgfHwgbm9kZS5wYXJlbnROb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlKG5vZGUpIHtcbiAgdmFyIGNvbXBvbmVudFRvRGVzdHJveSA9IGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KG5vZGUuZnJhZ21lbnQgfHwgbm9kZSk7XG4gIGlmIChjb21wb25lbnRUb0Rlc3Ryb3kpIHtcbiAgICBjb21wb25lbnRUb0Rlc3Ryb3kuX19fZGVzdHJveVNoYWxsb3coKTtcbiAgICBkZWxldGUgY29tcG9uZW50TG9va3VwW2NvbXBvbmVudFRvRGVzdHJveS5pZF07XG4gIH1cbn1cbmZ1bmN0aW9uIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKG5vZGUsIGNvbXBvbmVudCkge1xuICBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZShub2RlKTtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gMTIpIHtcbiAgICB2YXIga2V5O1xuXG4gICAgaWYgKGNvbXBvbmVudCAmJiAoa2V5ID0ga2V5c0J5RE9NTm9kZS5nZXQobm9kZSkpKSB7XG4gICAgICBpZiAobm9kZSA9PT0gY29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNba2V5XSkge1xuICAgICAgICBpZiAoY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZSkgJiYgL1xcW1xcXSQvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgIGRlbGV0ZSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1trZXldW1xuICAgICAgICAgICAgY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZSkuaWRcbiAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjdXJDaGlsZCAmJiBjdXJDaGlsZCAhPT0gbm9kZS5lbmROb2RlKSB7XG4gICAgICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShjdXJDaGlsZCwgY29tcG9uZW50KTtcbiAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5leHRDb21wb25lbnRJZCgpIHtcbiAgLy8gRWFjaCBjb21wb25lbnQgd2lsbCBnZXQgYW4gSUQgdGhhdCBpcyB1bmlxdWUgYWNyb3NzIGFsbCBsb2FkZWRcbiAgLy8gbWFya28gcnVudGltZXMuIFRoaXMgYWxsb3dzIG11bHRpcGxlIGluc3RhbmNlcyBvZiBtYXJrbyB0byBiZVxuICAvLyBsb2FkZWQgaW4gdGhlIHNhbWUgd2luZG93IGFuZCB0aGV5IHNob3VsZCBhbGwgcGxhY2UgbmljZVxuICAvLyB0b2dldGhlclxuICByZXR1cm4gXCJjXCIgKyBtYXJrb1VJRC5pKys7XG59XG5cbmZ1bmN0aW9uIG5leHRDb21wb25lbnRJZFByb3ZpZGVyKCkge1xuICByZXR1cm4gbmV4dENvbXBvbmVudElkO1xufVxuXG5mdW5jdGlvbiBhdHRhY2hCdWJibGluZ0V2ZW50KFxuICBjb21wb25lbnREZWYsXG4gIGhhbmRsZXJNZXRob2ROYW1lLFxuICBpc09uY2UsXG4gIGV4dHJhQXJnc1xuKSB7XG4gIGlmIChoYW5kbGVyTWV0aG9kTmFtZSkge1xuICAgIHZhciBjb21wb25lbnRJZCA9IGNvbXBvbmVudERlZi5pZDtcbiAgICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgICByZXR1cm4gW2hhbmRsZXJNZXRob2ROYW1lLCBjb21wb25lbnRJZCwgaXNPbmNlLCBleHRyYUFyZ3NdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW2hhbmRsZXJNZXRob2ROYW1lLCBjb21wb25lbnRJZCwgaXNPbmNlXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWFya29Qcm9wc0Zyb21FbChlbCkge1xuICB2YXIgdkVsZW1lbnQgPSB2RWxlbWVudHNCeURPTU5vZGUuZ2V0KGVsKTtcbiAgdmFyIHZpcnR1YWxQcm9wcztcblxuICBpZiAodkVsZW1lbnQpIHtcbiAgICB2aXJ0dWFsUHJvcHMgPSB2RWxlbWVudC5fX19wcm9wZXJ0aWVzO1xuICB9IGVsc2Uge1xuICAgIHZpcnR1YWxQcm9wcyA9IHZQcm9wc0J5RE9NTm9kZS5nZXQoZWwpO1xuICAgIGlmICghdmlydHVhbFByb3BzKSB7XG4gICAgICB2aXJ0dWFsUHJvcHMgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1hcmtvXCIpO1xuICAgICAgdlByb3BzQnlET01Ob2RlLnNldChcbiAgICAgICAgZWwsXG4gICAgICAgICh2aXJ0dWFsUHJvcHMgPSB2aXJ0dWFsUHJvcHMgPyBKU09OLnBhcnNlKHZpcnR1YWxQcm9wcykgOiBFTVBUWV9PQkpFQ1QpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2aXJ0dWFsUHJvcHM7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNvbXBvbmVudEtleShrZXksIHBhcmVudElkKSB7XG4gIGlmIChrZXlbMF0gPT09IFwiI1wiKSB7XG4gICAga2V5ID0ga2V5LnJlcGxhY2UoXCIjXCIgKyBwYXJlbnRJZCArIFwiLVwiLCBcIlwiKTtcbiAgfVxuICByZXR1cm4ga2V5O1xufVxuXG5mdW5jdGlvbiBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzKFxuICBrZXllZEVsZW1lbnRzLFxuICBrZXksXG4gIHJvb3ROb2RlLFxuICBjb21wb25lbnRJZFxuKSB7XG4gIGlmICgvXFxbXFxdJC8udGVzdChrZXkpKSB7XG4gICAgdmFyIHJlcGVhdGVkRWxlbWVudHNGb3JLZXkgPSAoa2V5ZWRFbGVtZW50c1trZXldID1cbiAgICAgIGtleWVkRWxlbWVudHNba2V5XSB8fCB7fSk7XG4gICAgcmVwZWF0ZWRFbGVtZW50c0ZvcktleVtjb21wb25lbnRJZF0gPSByb290Tm9kZTtcbiAgfSBlbHNlIHtcbiAgICBrZXllZEVsZW1lbnRzW2tleV0gPSByb290Tm9kZTtcbiAgfVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG5pZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gIHZhciB3YXJuTm9kZVJlbW92ZWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBldmVudC50YXJnZXQuZnJhZ21lbnQ7XG4gICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICB2YXIgYmFzZUVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICBcIkZyYWdtZW50IGJvdW5kYXJ5IG1hcmtlciByZW1vdmVkLiAgVGhpcyB3aWxsIGNhdXNlIGFuIGVycm9yIHdoZW4gdGhlIGZyYWdtZW50IGlzIHVwZGF0ZWQuXCJcbiAgICAgICk7XG4gICAgICBmcmFnbWVudC5fX19tYXJrZXJzUmVtb3ZlZEVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UgKyBcIiBCb3VuZGFyeSBtYXJrZXJzIG1pc3NpbmcuXCIpO1xuXG4gICAgICAgIGJhc2VFcnJvci5zdGFjayA9IGJhc2VFcnJvci5zdGFjay5yZXBsYWNlKC8uKndhcm5Ob2RlUmVtb3ZlZC4qXFxuLywgXCJcIik7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS53YXJuKGJhc2VFcnJvcik7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICBleHBvcnRzLl9fX3N0YXJ0RE9NTWFuaXB1bGF0aW9uV2FybmluZyA9IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgaG9zdC5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIiwgd2Fybk5vZGVSZW1vdmVkKTtcbiAgfTtcbiAgZXhwb3J0cy5fX19zdG9wRE9NTWFuaXB1bGF0aW9uV2FybmluZyA9IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgaG9zdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIiwgd2Fybk5vZGVSZW1vdmVkKTtcbiAgfTtcbn1cblxuZXhwb3J0cy5fX19ydW50aW1lSWQgPSBydW50aW1lSWQ7XG5leHBvcnRzLl9fX2NvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudExvb2t1cDtcbmV4cG9ydHMuX19fZ2V0Q29tcG9uZW50Rm9yRWwgPSBnZXRDb21wb25lbnRGb3JFbDtcbmV4cG9ydHMuX19fZGVzdHJveUNvbXBvbmVudEZvck5vZGUgPSBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZTtcbmV4cG9ydHMuX19fZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBkZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbmV4cG9ydHMuX19fbmV4dENvbXBvbmVudElkUHJvdmlkZXIgPSBuZXh0Q29tcG9uZW50SWRQcm92aWRlcjtcbmV4cG9ydHMuX19fYXR0YWNoQnViYmxpbmdFdmVudCA9IGF0dGFjaEJ1YmJsaW5nRXZlbnQ7XG5leHBvcnRzLl9fX2dldE1hcmtvUHJvcHNGcm9tRWwgPSBnZXRNYXJrb1Byb3BzRnJvbUVsO1xuZXhwb3J0cy5fX19hZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzID0gYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cztcbmV4cG9ydHMuX19fbm9ybWFsaXplQ29tcG9uZW50S2V5ID0gbm9ybWFsaXplQ29tcG9uZW50S2V5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5sb2FkLmUgPSBleGlzdHM7XG5tb2R1bGUuZXhwb3J0cyA9IGxvYWQ7XG5cbmZ1bmN0aW9uIGxvYWQoaWQpIHtcbiAgcmV0dXJuIGludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oaWQpKTtcbn1cblxuZnVuY3Rpb24gZXhpc3RzKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGludGVyb3BSZXF1aXJlKG1vZCkge1xuICByZXR1cm4gbW9kLmRlZmF1bHQgfHwgbW9kO1xufVxuIiwidmFyIHF1ZXVlID0gW107XG52YXIgbXNnID0gXCJcIiArIE1hdGgucmFuZG9tKCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2KSB7XG4gIGlmIChldi5kYXRhID09PSBtc2cpIHtcbiAgICB2YXIgY2FsbGJhY2tzID0gcXVldWU7XG4gICAgcXVldWUgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FsbGJhY2tzW2ldKCk7XG4gICAgfVxuICB9XG59KTtcblxuZXhwb3J0cy5fX19zZXRJbW1lZGlhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYgKHF1ZXVlLnB1c2goY2FsbGJhY2spID09PSAxKSB7XG4gICAgd2luZG93LnBvc3RNZXNzYWdlKG1zZywgXCIqXCIpO1xuICB9XG59O1xuXG5leHBvcnRzLl9fX3F1ZXVlTWljcm90YXNrID0gcmVxdWlyZShcIi4vcXVldWVNaWNyb3Rhc2tcIik7XG4iLCJ2YXIgcHJvbWlzZTtcbm1vZHVsZS5leHBvcnRzID1cbiAgdHlwZW9mIHF1ZXVlTWljcm90YXNrID09PSBcImZ1bmN0aW9uXCJcbiAgICA/IHF1ZXVlTWljcm90YXNrXG4gICAgOiAoKHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKSksXG4gICAgICBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKGNiKTtcbiAgICAgIH0pO1xuIiwidmFyIGRvbUluc2VydCA9IHJlcXVpcmUoXCIuL2RvbS1pbnNlcnRcIik7XG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xuXG5mdW5jdGlvbiBnZXRSb290Tm9kZShlbCkge1xuICB2YXIgY3VyID0gZWw7XG4gIHdoaWxlIChjdXIucGFyZW50Tm9kZSkgY3VyID0gY3VyLnBhcmVudE5vZGU7XG4gIHJldHVybiBjdXI7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudERlZnMocmVzdWx0KSB7XG4gIHZhciBjb21wb25lbnREZWZzID0gcmVzdWx0Ll9fX2NvbXBvbmVudHM7XG5cbiAgaWYgKCFjb21wb25lbnREZWZzKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJObyBjb21wb25lbnRcIik7XG4gIH1cbiAgcmV0dXJuIGNvbXBvbmVudERlZnM7XG59XG5cbmZ1bmN0aW9uIFJlbmRlclJlc3VsdChvdXQpIHtcbiAgdGhpcy5vdXQgPSB0aGlzLl9fX291dCA9IG91dDtcbiAgdGhpcy5fX19jb21wb25lbnRzID0gdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlclJlc3VsdDtcblxudmFyIHByb3RvID0gKFJlbmRlclJlc3VsdC5wcm90b3R5cGUgPSB7XG4gIGdldENvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldENvbXBvbmVudHMoKVswXTtcbiAgfSxcbiAgZ2V0Q29tcG9uZW50czogZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgaWYgKHRoaXMuX19fY29tcG9uZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIk5vdCBhZGRlZCB0byBET01cIik7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBvbmVudERlZnMgPSBnZXRDb21wb25lbnREZWZzKHRoaXMpO1xuXG4gICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcblxuICAgIGNvbXBvbmVudERlZnMuZm9yRWFjaChmdW5jdGlvbiAoY29tcG9uZW50RGVmKSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudDtcbiAgICAgIGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3IoY29tcG9uZW50KSkge1xuICAgICAgICBjb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBjb21wb25lbnRzO1xuICB9LFxuXG4gIGFmdGVySW5zZXJ0OiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBvdXQgPSB0aGlzLl9fX291dDtcbiAgICB2YXIgY29tcG9uZW50c0NvbnRleHQgPSBvdXQuX19fY29tcG9uZW50cztcbiAgICBpZiAoY29tcG9uZW50c0NvbnRleHQpIHtcbiAgICAgIHRoaXMuX19fY29tcG9uZW50cyA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2luaXRDb21wb25lbnRzKGhvc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fX2NvbXBvbmVudHMgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBnZXROb2RlOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHJldHVybiB0aGlzLl9fX291dC5fX19nZXROb2RlKGhvc3QpO1xuICB9LFxuICBnZXRPdXRwdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19vdXQuX19fZ2V0T3V0cHV0KCk7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fb3V0LnRvU3RyaW5nKCk7XG4gIH0sXG4gIGRvY3VtZW50OiB0eXBlb2YgZG9jdW1lbnQgPT09IFwib2JqZWN0XCIgJiYgZG9jdW1lbnQsXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBcImh0bWxcIiwge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgY29tcGxhaW4oXG4gICAgICAgICdUaGUgXCJodG1sXCIgcHJvcGVydHkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBcInRvU3RyaW5nXCIgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgfSxcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIFwiY29udGV4dFwiLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgJ1RoZSBcImNvbnRleHRcIiBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIFwib3V0XCIgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX19fb3V0O1xuICB9LFxufSk7XG5cbi8vIEFkZCBhbGwgb2YgdGhlIGZvbGxvd2luZyBET00gbWV0aG9kcyB0byBDb21wb25lbnQucHJvdG90eXBlOlxuLy8gLSBhcHBlbmRUbyhyZWZlcmVuY2VFbClcbi8vIC0gcmVwbGFjZShyZWZlcmVuY2VFbClcbi8vIC0gcmVwbGFjZUNoaWxkcmVuT2YocmVmZXJlbmNlRWwpXG4vLyAtIGluc2VydEJlZm9yZShyZWZlcmVuY2VFbClcbi8vIC0gaW5zZXJ0QWZ0ZXIocmVmZXJlbmNlRWwpXG4vLyAtIHByZXBlbmRUbyhyZWZlcmVuY2VFbClcbmRvbUluc2VydChcbiAgcHJvdG8sXG4gIGZ1bmN0aW9uIGdldEVsKHJlbmRlclJlc3VsdCwgcmVmZXJlbmNlRWwpIHtcbiAgICByZXR1cm4gcmVuZGVyUmVzdWx0LmdldE5vZGUoZ2V0Um9vdE5vZGUocmVmZXJlbmNlRWwpKTtcbiAgfSxcbiAgZnVuY3Rpb24gYWZ0ZXJJbnNlcnQocmVuZGVyUmVzdWx0LCByZWZlcmVuY2VFbCkge1xuICAgIHJldHVybiByZW5kZXJSZXN1bHQuYWZ0ZXJJbnNlcnQoZ2V0Um9vdE5vZGUocmVmZXJlbmNlRWwpKTtcbiAgfSxcbik7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cblxudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzLWxpZ2h0XCIpO1xudmFyIFN1YnNjcmlwdGlvblRyYWNrZXIgPSByZXF1aXJlKFwibGlzdGVuZXItdHJhY2tlclwiKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBjb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG52YXIgZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBjb21wb25lbnRzVXRpbC5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbnZhciBkZWZhdWx0Q3JlYXRlT3V0ID0gcmVxdWlyZShcIi4uL2NyZWF0ZU91dFwiKTtcbnZhciBkb21JbnNlcnQgPSByZXF1aXJlKFwiLi4vZG9tLWluc2VydFwiKTtcbnZhciBSZW5kZXJSZXN1bHQgPSByZXF1aXJlKFwiLi4vUmVuZGVyUmVzdWx0XCIpO1xudmFyIG1vcnBoZG9tID0gcmVxdWlyZShcIi4uL3Zkb20vbW9ycGhkb21cIik7XG52YXIgZ2V0Q29tcG9uZW50c0NvbnRleHQgPVxuICByZXF1aXJlKFwiLi9Db21wb25lbnRzQ29udGV4dFwiKS5fX19nZXRDb21wb25lbnRzQ29udGV4dDtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4vZG9tLWRhdGFcIik7XG52YXIgZXZlbnREZWxlZ2F0aW9uID0gcmVxdWlyZShcIi4vZXZlbnQtZGVsZWdhdGlvblwiKTtcbnZhciB1cGRhdGVNYW5hZ2VyID0gcmVxdWlyZShcIi4vdXBkYXRlLW1hbmFnZXJcIik7XG52YXIgY29tcG9uZW50c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkID0gZG9tRGF0YS5fX19zc3JLZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZDtcbnZhciBDT05URVhUX0tFWSA9IFwiX19zdWJ0cmVlX2NvbnRleHRfX1wiO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgQ09NUE9ORU5UX1NVQlNDUklCRV9UT19PUFRJT05TO1xudmFyIE5PTl9DT01QT05FTlRfU1VCU0NSSUJFX1RPX09QVElPTlMgPSB7XG4gIGFkZERlc3Ryb3lMaXN0ZW5lcjogZmFsc2UsXG59O1xuXG52YXIgZW1pdCA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdDtcbnZhciBFTEVNRU5UX05PREUgPSAxO1xuXG5mdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihyZW1vdmVFdmVudExpc3RlbmVySGFuZGxlKSB7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJIYW5kbGUoKTtcbn1cblxuZnVuY3Rpb24gd2Fsa0ZyYWdtZW50cyhmcmFnbWVudCkge1xuICB2YXIgbm9kZTtcblxuICB3aGlsZSAoZnJhZ21lbnQpIHtcbiAgICBub2RlID0gZnJhZ21lbnQuZmlyc3RDaGlsZDtcblxuICAgIGlmICghbm9kZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZnJhZ21lbnQgPSBub2RlLmZyYWdtZW50O1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUN1c3RvbUV2ZW50V2l0aE1ldGhvZExpc3RlbmVyKFxuICBjb21wb25lbnQsXG4gIHRhcmdldE1ldGhvZE5hbWUsXG4gIGFyZ3MsXG4gIGV4dHJhQXJncyxcbikge1xuICAvLyBSZW1vdmUgdGhlIFwiZXZlbnRUeXBlXCIgYXJndW1lbnRcbiAgYXJncy5wdXNoKGNvbXBvbmVudCk7XG5cbiAgaWYgKGV4dHJhQXJncykge1xuICAgIGFyZ3MgPSBleHRyYUFyZ3MuY29uY2F0KGFyZ3MpO1xuICB9XG5cbiAgdmFyIHRhcmdldENvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFtjb21wb25lbnQuX19fc2NvcGVdO1xuICB2YXIgdGFyZ2V0TWV0aG9kID1cbiAgICB0eXBlb2YgdGFyZ2V0TWV0aG9kTmFtZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHRhcmdldE1ldGhvZE5hbWVcbiAgICAgIDogdGFyZ2V0Q29tcG9uZW50W3RhcmdldE1ldGhvZE5hbWVdO1xuICBpZiAoIXRhcmdldE1ldGhvZCkge1xuICAgIHRocm93IEVycm9yKFwiTWV0aG9kIG5vdCBmb3VuZDogXCIgKyB0YXJnZXRNZXRob2ROYW1lKTtcbiAgfVxuXG4gIHRhcmdldE1ldGhvZC5hcHBseSh0YXJnZXRDb21wb25lbnQsIGFyZ3MpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpIHtcbiAgcmV0dXJuIGluZGV4ID8ga2V5ICsgXCJfXCIgKyBpbmRleCA6IGtleTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUNvbXBvbmVudElkSGVscGVyKGNvbXBvbmVudCwga2V5LCBpbmRleCkge1xuICByZXR1cm4gY29tcG9uZW50LmlkICsgXCItXCIgKyByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gcHJvY2VzcyBcInVwZGF0ZV88c3RhdGVOYW1lPlwiIGhhbmRsZXIgZnVuY3Rpb25zLlxuICogSWYgYWxsIG9mIHRoZSBtb2RpZmllZCBzdGF0ZSBwcm9wZXJ0aWVzIGhhdmUgYSB1c2VyIHByb3ZpZGVkIHVwZGF0ZSBoYW5kbGVyXG4gKiB0aGVuIGEgcmVyZW5kZXIgd2lsbCBiZSBieXBhc3NlZCBhbmQsIGluc3RlYWQsIHRoZSBET00gd2lsbCBiZSB1cGRhdGVkXG4gKiBsb29waW5nIG92ZXIgYW5kIGludm9raW5nIHRoZSBjdXN0b20gdXBkYXRlIGhhbmRsZXJzLlxuICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGlmIHRoZSBET00gd2FzIHVwZGF0ZWQuIEZhbHNlLCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NVcGRhdGVIYW5kbGVycyhjb21wb25lbnQsIHN0YXRlQ2hhbmdlcywgb2xkU3RhdGUpIHtcbiAgdmFyIGhhbmRsZXJNZXRob2Q7XG4gIHZhciBoYW5kbGVycztcblxuICBmb3IgKHZhciBwcm9wTmFtZSBpbiBzdGF0ZUNoYW5nZXMpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzdGF0ZUNoYW5nZXMsIHByb3BOYW1lKSkge1xuICAgICAgdmFyIGhhbmRsZXJNZXRob2ROYW1lID0gXCJ1cGRhdGVfXCIgKyBwcm9wTmFtZTtcblxuICAgICAgaGFuZGxlck1ldGhvZCA9IGNvbXBvbmVudFtoYW5kbGVyTWV0aG9kTmFtZV07XG4gICAgICBpZiAoaGFuZGxlck1ldGhvZCkge1xuICAgICAgICAoaGFuZGxlcnMgfHwgKGhhbmRsZXJzID0gW10pKS5wdXNoKFtwcm9wTmFtZSwgaGFuZGxlck1ldGhvZF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyBzdGF0ZSBjaGFuZ2UgZG9lcyBub3QgaGF2ZSBhIHN0YXRlIGhhbmRsZXIgc28gcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vIHRvIGZvcmNlIGEgcmVyZW5kZXJcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHdlIGdvdCBoZXJlIHRoZW4gYWxsIG9mIHRoZSBjaGFuZ2VkIHN0YXRlIHByb3BlcnRpZXMgaGF2ZVxuICAvLyBhbiB1cGRhdGUgaGFuZGxlciBvciB0aGVyZSBhcmUgbm8gc3RhdGUgcHJvcGVydGllcyB0aGF0IGFjdHVhbGx5XG4gIC8vIGNoYW5nZWQuXG4gIGlmIChoYW5kbGVycykge1xuICAgIC8vIE90aGVyd2lzZSwgdGhlcmUgYXJlIGhhbmRsZXJzIGZvciBhbGwgb2YgdGhlIGNoYW5nZWQgcHJvcGVydGllc1xuICAgIC8vIHNvIGFwcGx5IHRoZSB1cGRhdGVzIHVzaW5nIHRob3NlIGhhbmRsZXJzXG5cbiAgICBoYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICB2YXIgcHJvcGVydHlOYW1lID0gaGFuZGxlclswXTtcbiAgICAgIGhhbmRsZXJNZXRob2QgPSBoYW5kbGVyWzFdO1xuXG4gICAgICB2YXIgbmV3VmFsdWUgPSBzdGF0ZUNoYW5nZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgIHZhciBvbGRWYWx1ZSA9IG9sZFN0YXRlW3Byb3BlcnR5TmFtZV07XG4gICAgICBoYW5kbGVyTWV0aG9kLmNhbGwoY29tcG9uZW50LCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgY29tcG9uZW50Ll9fX2VtaXRVcGRhdGUoKTtcbiAgICBjb21wb25lbnQuX19fcmVzZXQoKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjaGVja0lucHV0Q2hhbmdlZChleGlzdGluZ0NvbXBvbmVudCwgb2xkSW5wdXQsIG5ld0lucHV0KSB7XG4gIGlmIChvbGRJbnB1dCAhPSBuZXdJbnB1dCkge1xuICAgIGlmIChvbGRJbnB1dCA9PSBudWxsIHx8IG5ld0lucHV0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBvbGRLZXlzID0gT2JqZWN0LmtleXMob2xkSW5wdXQpO1xuICAgIHZhciBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3SW5wdXQpO1xuICAgIHZhciBsZW4gPSBvbGRLZXlzLmxlbmd0aDtcbiAgICBpZiAobGVuICE9PSBuZXdLZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IGxlbjsgaS0tOyApIHtcbiAgICAgIHZhciBrZXkgPSBvbGRLZXlzW2ldO1xuICAgICAgaWYgKCEoa2V5IGluIG5ld0lucHV0ICYmIG9sZElucHV0W2tleV0gPT09IG5ld0lucHV0W2tleV0pKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxudmFyIGNvbXBvbmVudFByb3RvO1xuXG4vKipcbiAqIEJhc2UgY29tcG9uZW50IHR5cGUuXG4gKlxuICogTk9URTogQW55IG1ldGhvZHMgdGhhdCBhcmUgcHJlZml4ZWQgd2l0aCBhbiB1bmRlcnNjb3JlIHNob3VsZCBiZSBjb25zaWRlcmVkIHByaXZhdGUhXG4gKi9cbmZ1bmN0aW9uIENvbXBvbmVudChpZCkge1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcbiAgdGhpcy5pZCA9IGlkO1xuICB0aGlzLl9fX3N0YXRlID0gbnVsbDtcbiAgdGhpcy5fX19yb290Tm9kZSA9IG51bGw7XG4gIHRoaXMuX19fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gIHRoaXMuX19fZG9tRXZlbnRMaXN0ZW5lckhhbmRsZXMgPSBudWxsO1xuICB0aGlzLl9fX2J1YmJsaW5nRG9tRXZlbnRzID0gbnVsbDsgLy8gVXNlZCB0byBrZWVwIHRyYWNrIG9mIGJ1YmJsaW5nIERPTSBldmVudHMgZm9yIGNvbXBvbmVudHMgcmVuZGVyZWQgb24gdGhlIHNlcnZlclxuICB0aGlzLl9fX2N1c3RvbUV2ZW50cyA9IG51bGw7XG4gIHRoaXMuX19fc2NvcGUgPSBudWxsO1xuICB0aGlzLl9fX3JlbmRlcklucHV0ID0gbnVsbDtcbiAgdGhpcy5fX19pbnB1dCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fX19tb3VudGVkID0gZmFsc2U7XG4gIHRoaXMuX19fZ2xvYmFsID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX2Rlc3Ryb3llZCA9IGZhbHNlO1xuICB0aGlzLl9fX3VwZGF0ZVF1ZXVlZCA9IGZhbHNlO1xuICB0aGlzLl9fX2RpcnR5ID0gZmFsc2U7XG4gIHRoaXMuX19fc2V0dGluZ0lucHV0ID0gZmFsc2U7XG4gIHRoaXMuX19faG9zdCA9IHVuZGVmaW5lZDtcblxuICB2YXIgc3NyS2V5ZWRFbGVtZW50cyA9IGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW2lkXTtcblxuICBpZiAoc3NyS2V5ZWRFbGVtZW50cykge1xuICAgIHRoaXMuX19fa2V5ZWRFbGVtZW50cyA9IHNzcktleWVkRWxlbWVudHM7XG4gICAgZGVsZXRlIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW2lkXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9fX2tleWVkRWxlbWVudHMgPSB7fTtcbiAgfVxufVxuXG5Db21wb25lbnQucHJvdG90eXBlID0gY29tcG9uZW50UHJvdG8gPSB7XG4gIF9fX2lzQ29tcG9uZW50OiB0cnVlLFxuXG4gIHN1YnNjcmliZVRvOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cblxuICAgIHZhciBzdWJzY3JpcHRpb25zID1cbiAgICAgIHRoaXMuX19fc3Vic2NyaXB0aW9ucyB8fFxuICAgICAgKHRoaXMuX19fc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb25UcmFja2VyKCkpO1xuXG4gICAgdmFyIHN1YnNjcmliZVRvT3B0aW9ucyA9IHRhcmdldC5fX19pc0NvbXBvbmVudFxuICAgICAgPyBDT01QT05FTlRfU1VCU0NSSUJFX1RPX09QVElPTlNcbiAgICAgIDogTk9OX0NPTVBPTkVOVF9TVUJTQ1JJQkVfVE9fT1BUSU9OUztcblxuICAgIHJldHVybiBzdWJzY3JpcHRpb25zLnN1YnNjcmliZVRvKHRhcmdldCwgc3Vic2NyaWJlVG9PcHRpb25zKTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAoZXZlbnRUeXBlKSB7XG4gICAgdmFyIGN1c3RvbUV2ZW50cyA9IHRoaXMuX19fY3VzdG9tRXZlbnRzO1xuICAgIHZhciB0YXJnZXQ7XG5cbiAgICBpZiAoY3VzdG9tRXZlbnRzICYmICh0YXJnZXQgPSBjdXN0b21FdmVudHNbZXZlbnRUeXBlXSkpIHtcbiAgICAgIHZhciB0YXJnZXRNZXRob2ROYW1lID0gdGFyZ2V0WzBdO1xuICAgICAgdmFyIGlzT25jZSA9IHRhcmdldFsxXTtcbiAgICAgIHZhciBleHRyYUFyZ3MgPSB0YXJnZXRbMl07XG4gICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgaGFuZGxlQ3VzdG9tRXZlbnRXaXRoTWV0aG9kTGlzdGVuZXIoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHRhcmdldE1ldGhvZE5hbWUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIGV4dHJhQXJncyxcbiAgICAgICk7XG5cbiAgICAgIGlmIChpc09uY2UpIHtcbiAgICAgICAgZGVsZXRlIGN1c3RvbUV2ZW50c1tldmVudFR5cGVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIGdldEVsSWQ6IGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb2x2ZUNvbXBvbmVudElkSGVscGVyKHRoaXMsIGtleSwgaW5kZXgpO1xuICB9LFxuICBnZXRFbDogZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgcmVzb2x2ZWRLZXkgPSByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpO1xuICAgICAgdmFyIGtleWVkRWxlbWVudCA9IHRoaXMuX19fa2V5ZWRFbGVtZW50c1tcIkBcIiArIHJlc29sdmVkS2V5XTtcbiAgICAgIGlmIChrZXllZEVsZW1lbnQgJiYga2V5ZWRFbGVtZW50Lm5vZGVUeXBlID09PSAxMiAvKiogRlJBR01FTlRfTk9ERSAqLykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICAgIFwiQWNjZXNzaW5nIHRoZSBlbGVtZW50cyBvZiBhIGNoaWxkIGNvbXBvbmVudCB1c2luZyAnY29tcG9uZW50LmdldEVsJyBpcyBkZXByZWNhdGVkLlwiLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd2Fsa0ZyYWdtZW50cyhrZXllZEVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5ZWRFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9XG4gIH0sXG4gIGdldEVsczogZnVuY3Rpb24gKGtleSkge1xuICAgIGtleSA9IGtleSArIFwiW11cIjtcblxuICAgIHZhciBlbHMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGVsO1xuICAgIHdoaWxlICgoZWwgPSB0aGlzLmdldEVsKGtleSwgaSkpKSB7XG4gICAgICBlbHMucHVzaChlbCk7XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBlbHM7XG4gIH0sXG4gIGdldENvbXBvbmVudDogZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcbiAgICB2YXIgcm9vdE5vZGUgPSB0aGlzLl9fX2tleWVkRWxlbWVudHNbXCJAXCIgKyByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpXTtcbiAgICBpZiAoL1xcW1xcXSQvLnRlc3Qoa2V5KSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICBcIkEgcmVwZWF0ZWQga2V5W10gd2FzIHBhc3NlZCB0byBnZXRDb21wb25lbnQuIFVzZSBhIG5vbi1yZXBlYXRpbmcga2V5IGlmIHRoZXJlIGlzIG9ubHkgb25lIG9mIHRoZXNlIGNvbXBvbmVudHMuXCIsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByb290Tm9kZSA9IHJvb3ROb2RlICYmIHJvb3ROb2RlW09iamVjdC5rZXlzKHJvb3ROb2RlKVswXV07XG4gICAgfVxuICAgIHJldHVybiByb290Tm9kZSAmJiBjb21wb25lbnRzQnlET01Ob2RlLmdldChyb290Tm9kZSk7XG4gIH0sXG4gIGdldENvbXBvbmVudHM6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgbG9va3VwID0gdGhpcy5fX19rZXllZEVsZW1lbnRzW1wiQFwiICsga2V5ICsgXCJbXVwiXTtcbiAgICByZXR1cm4gbG9va3VwXG4gICAgICA/IE9iamVjdC5rZXlzKGxvb2t1cClcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzQnlET01Ob2RlLmdldChsb29rdXBba2V5XSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICA6IFtdO1xuICB9LFxuICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19fZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHJvb3QgPSB0aGlzLl9fX3Jvb3ROb2RlO1xuXG4gICAgdGhpcy5fX19kZXN0cm95U2hhbGxvdygpO1xuXG4gICAgdmFyIG5vZGVzID0gcm9vdC5ub2RlcztcblxuICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKG5vZGUpO1xuXG4gICAgICBpZiAoZXZlbnREZWxlZ2F0aW9uLl9fX2hhbmRsZU5vZGVEZXRhY2gobm9kZSkgIT09IGZhbHNlKSB7XG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJvb3QuZGV0YWNoZWQgPSB0cnVlO1xuXG4gICAgZGVsZXRlIGNvbXBvbmVudExvb2t1cFt0aGlzLmlkXTtcbiAgICB0aGlzLl9fX2tleWVkRWxlbWVudHMgPSB7fTtcbiAgfSxcblxuICBfX19kZXN0cm95U2hhbGxvdzogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9fX2Rlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX19fZW1pdERlc3Ryb3koKTtcbiAgICB0aGlzLl9fX2Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICBjb21wb25lbnRzQnlET01Ob2RlLnNldCh0aGlzLl9fX3Jvb3ROb2RlLCB1bmRlZmluZWQpO1xuXG4gICAgdGhpcy5fX19yb290Tm9kZSA9IG51bGw7XG5cbiAgICAvLyBVbnN1YnNjcmliZSBmcm9tIGFsbCBET00gZXZlbnRzXG4gICAgdGhpcy5fX19yZW1vdmVET01FdmVudExpc3RlbmVycygpO1xuXG4gICAgdmFyIHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9fX3N1YnNjcmlwdGlvbnM7XG4gICAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHN1YnNjcmlwdGlvbnMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLl9fX3N1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICBpc0Rlc3Ryb3llZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX2Rlc3Ryb3llZDtcbiAgfSxcbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3N0YXRlO1xuICB9LFxuICBzZXQgc3RhdGUobmV3U3RhdGUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuICAgIGlmICghc3RhdGUgJiYgIW5ld1N0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgc3RhdGUgPSB0aGlzLl9fX3N0YXRlID0gbmV3IHRoaXMuX19fU3RhdGUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGUuX19fcmVwbGFjZShuZXdTdGF0ZSB8fCB7fSk7XG5cbiAgICBpZiAoc3RhdGUuX19fZGlydHkpIHtcbiAgICAgIHRoaXMuX19fcXVldWVVcGRhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAoIW5ld1N0YXRlKSB7XG4gICAgICB0aGlzLl9fX3N0YXRlID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIHNldFN0YXRlOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgc3RhdGUgPSB0aGlzLl9fX3N0YXRlID0gbmV3IHRoaXMuX19fU3RhdGUodGhpcyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAvLyBNZXJnZSBpbiB0aGUgbmV3IHN0YXRlIHdpdGggdGhlIG9sZCBzdGF0ZVxuICAgICAgdmFyIG5ld1N0YXRlID0gbmFtZTtcbiAgICAgIGZvciAodmFyIGsgaW4gbmV3U3RhdGUpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwobmV3U3RhdGUsIGspKSB7XG4gICAgICAgICAgc3RhdGUuX19fc2V0KGssIG5ld1N0YXRlW2tdLCB0cnVlIC8qIGVuc3VyZTp0cnVlICovKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5fX19zZXQobmFtZSwgdmFsdWUsIHRydWUgLyogZW5zdXJlOnRydWUgKi8pO1xuICAgIH1cbiAgfSxcblxuICBzZXRTdGF0ZURpcnR5OiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgdmFsdWUgPSBzdGF0ZVtuYW1lXTtcbiAgICB9XG5cbiAgICBzdGF0ZS5fX19zZXQoXG4gICAgICBuYW1lLFxuICAgICAgdmFsdWUsXG4gICAgICB0cnVlIC8qIGVuc3VyZTp0cnVlICovLFxuICAgICAgdHJ1ZSAvKiBmb3JjZURpcnR5OnRydWUgKi8sXG4gICAgKTtcbiAgfSxcblxuICByZXBsYWNlU3RhdGU6IGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgIHRoaXMuX19fc3RhdGUuX19fcmVwbGFjZShuZXdTdGF0ZSk7XG4gIH0sXG5cbiAgZ2V0IGlucHV0KCkge1xuICAgIHJldHVybiB0aGlzLl9fX2lucHV0O1xuICB9LFxuICBzZXQgaW5wdXQobmV3SW5wdXQpIHtcbiAgICBpZiAodGhpcy5fX19zZXR0aW5nSW5wdXQpIHtcbiAgICAgIHRoaXMuX19faW5wdXQgPSBuZXdJbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX19zZXRJbnB1dChuZXdJbnB1dCk7XG4gICAgfVxuICB9LFxuXG4gIF9fX3NldElucHV0OiBmdW5jdGlvbiAobmV3SW5wdXQsIG9uSW5wdXQsIG91dCkge1xuICAgIG9uSW5wdXQgPSBvbklucHV0IHx8IHRoaXMub25JbnB1dDtcbiAgICB2YXIgdXBkYXRlZElucHV0O1xuXG4gICAgdmFyIG9sZElucHV0ID0gdGhpcy5fX19pbnB1dDtcbiAgICB0aGlzLl9fX2lucHV0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX19fY29udGV4dCA9IChvdXQgJiYgb3V0W0NPTlRFWFRfS0VZXSkgfHwgdGhpcy5fX19jb250ZXh0O1xuXG4gICAgaWYgKG9uSW5wdXQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gc2V0IGEgZmxhZyB0byBwcmV2aWV3IGB0aGlzLmlucHV0ID0gZm9vYCBpbnNpZGVcbiAgICAgIC8vIG9uSW5wdXQgY2F1c2luZyBpbmZpbml0ZSByZWN1cnNpb25cbiAgICAgIHRoaXMuX19fc2V0dGluZ0lucHV0ID0gdHJ1ZTtcbiAgICAgIHVwZGF0ZWRJbnB1dCA9IG9uSW5wdXQuY2FsbCh0aGlzLCBuZXdJbnB1dCB8fCB7fSwgb3V0KTtcbiAgICAgIHRoaXMuX19fc2V0dGluZ0lucHV0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbmV3SW5wdXQgPSB0aGlzLl9fX3JlbmRlcklucHV0ID0gdXBkYXRlZElucHV0IHx8IG5ld0lucHV0O1xuXG4gICAgaWYgKCh0aGlzLl9fX2RpcnR5ID0gY2hlY2tJbnB1dENoYW5nZWQodGhpcywgb2xkSW5wdXQsIG5ld0lucHV0KSkpIHtcbiAgICAgIHRoaXMuX19fcXVldWVVcGRhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fX19pbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9fX2lucHV0ID0gbmV3SW5wdXQ7XG4gICAgICBpZiAobmV3SW5wdXQgJiYgbmV3SW5wdXQuJGdsb2JhbCkge1xuICAgICAgICB0aGlzLl9fX2dsb2JhbCA9IG5ld0lucHV0LiRnbG9iYWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0lucHV0O1xuICB9LFxuXG4gIGZvcmNlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX19kaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fX19xdWV1ZVVwZGF0ZSgpO1xuICB9LFxuXG4gIF9fX3F1ZXVlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9fX3VwZGF0ZVF1ZXVlZCkge1xuICAgICAgdGhpcy5fX191cGRhdGVRdWV1ZWQgPSB0cnVlO1xuICAgICAgdXBkYXRlTWFuYWdlci5fX19xdWV1ZUNvbXBvbmVudFVwZGF0ZSh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19fZGVzdHJveWVkID09PSB0cnVlIHx8IHRoaXMuX19faXNEaXJ0eSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaW5wdXQgPSB0aGlzLl9fX2lucHV0O1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAodGhpcy5fX19kaXJ0eSA9PT0gZmFsc2UgJiYgc3RhdGUgIT09IG51bGwgJiYgc3RhdGUuX19fZGlydHkgPT09IHRydWUpIHtcbiAgICAgIGlmIChwcm9jZXNzVXBkYXRlSGFuZGxlcnModGhpcywgc3RhdGUuX19fY2hhbmdlcywgc3RhdGUuX19fb2xkLCBzdGF0ZSkpIHtcbiAgICAgICAgc3RhdGUuX19fZGlydHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fX19pc0RpcnR5ID09PSB0cnVlKSB7XG4gICAgICAvLyBUaGUgVUkgY29tcG9uZW50IGlzIHN0aWxsIGRpcnR5IGFmdGVyIHByb2Nlc3Mgc3RhdGUgaGFuZGxlcnNcbiAgICAgIC8vIHRoZW4gd2Ugc2hvdWxkIHJlcmVuZGVyXG5cbiAgICAgIGlmICh0aGlzLnNob3VsZFVwZGF0ZShpbnB1dCwgc3RhdGUpICE9PSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9fX3NjaGVkdWxlUmVyZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9fX3Jlc2V0KCk7XG4gIH0sXG5cbiAgZ2V0IF9fX2lzRGlydHkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX19fZGlydHkgPT09IHRydWUgfHxcbiAgICAgICh0aGlzLl9fX3N0YXRlICE9PSBudWxsICYmIHRoaXMuX19fc3RhdGUuX19fZGlydHkgPT09IHRydWUpXG4gICAgKTtcbiAgfSxcblxuICBfX19yZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX19fZGlydHkgPSBmYWxzZTtcbiAgICB0aGlzLl9fX3VwZGF0ZVF1ZXVlZCA9IGZhbHNlO1xuICAgIHRoaXMuX19fcmVuZGVySW5wdXQgPSBudWxsO1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGF0ZS5fX19yZXNldCgpO1xuICAgIH1cbiAgfSxcblxuICBzaG91bGRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBfX19zY2hlZHVsZVJlcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZW5kZXJlciA9IHNlbGYuX19fcmVuZGVyZXI7XG5cbiAgICBpZiAoIXJlbmRlcmVyKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgaW5wdXQgPSB0aGlzLl9fX3JlbmRlcklucHV0IHx8IHRoaXMuX19faW5wdXQ7XG5cbiAgICB1cGRhdGVNYW5hZ2VyLl9fX2JhdGNoVXBkYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX19fcmVyZW5kZXIoaW5wdXQsIGZhbHNlKS5hZnRlckluc2VydChzZWxmLl9fX2hvc3QpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fX19yZXNldCgpO1xuICB9LFxuXG4gIF9fX3JlcmVuZGVyOiBmdW5jdGlvbiAoaW5wdXQsIGlzSHlkcmF0ZSkge1xuICAgIHZhciBob3N0ID0gdGhpcy5fX19ob3N0O1xuICAgIHZhciBnbG9iYWxEYXRhID0gdGhpcy5fX19nbG9iYWw7XG4gICAgdmFyIHJvb3ROb2RlID0gdGhpcy5fX19yb290Tm9kZTtcbiAgICB2YXIgcmVuZGVyZXIgPSB0aGlzLl9fX3JlbmRlcmVyO1xuICAgIHZhciBjcmVhdGVPdXQgPSByZW5kZXJlci5jcmVhdGVPdXQgfHwgZGVmYXVsdENyZWF0ZU91dDtcbiAgICB2YXIgb3V0ID0gY3JlYXRlT3V0KGdsb2JhbERhdGEpO1xuICAgIG91dC5zeW5jKCk7XG4gICAgb3V0Ll9fX2hvc3QgPSB0aGlzLl9fX2hvc3Q7XG4gICAgb3V0W0NPTlRFWFRfS0VZXSA9IHRoaXMuX19fY29udGV4dDtcblxuICAgIHZhciBjb21wb25lbnRzQ29udGV4dCA9IGdldENvbXBvbmVudHNDb250ZXh0KG91dCk7XG4gICAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZXJlbmRlckNvbXBvbmVudCA9IHRoaXM7XG4gICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19faXNIeWRyYXRlID0gaXNIeWRyYXRlO1xuXG4gICAgcmVuZGVyZXIoaW5wdXQsIG91dCk7XG5cbiAgICB2YXIgcmVzdWx0ID0gbmV3IFJlbmRlclJlc3VsdChvdXQpO1xuXG4gICAgdmFyIHRhcmdldE5vZGUgPSBvdXQuX19fZ2V0T3V0cHV0KCkuX19fZmlyc3RDaGlsZDtcblxuICAgIG1vcnBoZG9tKHJvb3ROb2RlLCB0YXJnZXROb2RlLCBob3N0LCBjb21wb25lbnRzQ29udGV4dCk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIF9fX2RldGFjaDogZnVuY3Rpb24gKCkge1xuICAgIHZhciByb290ID0gdGhpcy5fX19yb290Tm9kZTtcbiAgICByb290LnJlbW92ZSgpO1xuICAgIHJldHVybiByb290O1xuICB9LFxuXG4gIF9fX3JlbW92ZURPTUV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50TGlzdGVuZXJIYW5kbGVzID0gdGhpcy5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcztcbiAgICBpZiAoZXZlbnRMaXN0ZW5lckhhbmRsZXMpIHtcbiAgICAgIGV2ZW50TGlzdGVuZXJIYW5kbGVzLmZvckVhY2gocmVtb3ZlTGlzdGVuZXIpO1xuICAgICAgdGhpcy5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcyA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIGdldCBfX19yYXdTdGF0ZSgpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuICAgIHJldHVybiBzdGF0ZSAmJiBzdGF0ZS5fX19yYXc7XG4gIH0sXG5cbiAgX19fc2V0Q3VzdG9tRXZlbnRzOiBmdW5jdGlvbiAoY3VzdG9tRXZlbnRzLCBzY29wZSkge1xuICAgIHZhciBmaW5hbEN1c3RvbUV2ZW50cyA9ICh0aGlzLl9fX2N1c3RvbUV2ZW50cyA9IHt9KTtcbiAgICB0aGlzLl9fX3Njb3BlID0gc2NvcGU7XG5cbiAgICBjdXN0b21FdmVudHMuZm9yRWFjaChmdW5jdGlvbiAoY3VzdG9tRXZlbnQpIHtcbiAgICAgIHZhciBldmVudFR5cGUgPSBjdXN0b21FdmVudFswXTtcbiAgICAgIHZhciB0YXJnZXRNZXRob2ROYW1lID0gY3VzdG9tRXZlbnRbMV07XG4gICAgICB2YXIgaXNPbmNlID0gY3VzdG9tRXZlbnRbMl07XG4gICAgICB2YXIgZXh0cmFBcmdzID0gY3VzdG9tRXZlbnRbM107XG5cbiAgICAgIGlmICh0YXJnZXRNZXRob2ROYW1lKSB7XG4gICAgICAgIGZpbmFsQ3VzdG9tRXZlbnRzW2V2ZW50VHlwZV0gPSBbdGFyZ2V0TWV0aG9kTmFtZSwgaXNPbmNlLCBleHRyYUFyZ3NdO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gd2Fsa0ZyYWdtZW50cyh0aGlzLl9fX3Jvb3ROb2RlKTtcbiAgfSxcblxuICBnZXQgZWxzKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgJ1RoZSBcInRoaXMuZWxzXCIgYXR0cmlidXRlIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgXCJ0aGlzLmdldEVscyhrZXkpXCIgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLl9fX3Jvb3ROb2RlID8gdGhpcy5fX19yb290Tm9kZS5ub2RlcyA6IFtdKS5maWx0ZXIoXG4gICAgICBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREU7XG4gICAgICB9LFxuICAgICk7XG4gIH0sXG5cbiAgX19fZW1pdDogZW1pdCxcbiAgX19fZW1pdENyZWF0ZShpbnB1dCwgb3V0KSB7XG4gICAgdGhpcy5vbkNyZWF0ZSAmJiB0aGlzLm9uQ3JlYXRlKGlucHV0LCBvdXQpO1xuICAgIHRoaXMuX19fZW1pdChcImNyZWF0ZVwiLCBpbnB1dCwgb3V0KTtcbiAgfSxcblxuICBfX19lbWl0UmVuZGVyKG91dCkge1xuICAgIHRoaXMub25SZW5kZXIgJiYgdGhpcy5vblJlbmRlcihvdXQpO1xuICAgIHRoaXMuX19fZW1pdChcInJlbmRlclwiLCBvdXQpO1xuICB9LFxuXG4gIF9fX2VtaXRVcGRhdGUoKSB7XG4gICAgdGhpcy5vblVwZGF0ZSAmJiB0aGlzLm9uVXBkYXRlKCk7XG4gICAgdGhpcy5fX19lbWl0KFwidXBkYXRlXCIpO1xuICB9LFxuXG4gIF9fX2VtaXRNb3VudCgpIHtcbiAgICB0aGlzLm9uTW91bnQgJiYgdGhpcy5vbk1vdW50KCk7XG4gICAgdGhpcy5fX19lbWl0KFwibW91bnRcIik7XG4gIH0sXG5cbiAgX19fZW1pdERlc3Ryb3koKSB7XG4gICAgdGhpcy5vbkRlc3Ryb3kgJiYgdGhpcy5vbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9fX2VtaXQoXCJkZXN0cm95XCIpO1xuICB9LFxufTtcblxuY29tcG9uZW50UHJvdG8uZWxJZCA9IGNvbXBvbmVudFByb3RvLmdldEVsSWQ7XG5jb21wb25lbnRQcm90by5fX191cGRhdGUgPSBjb21wb25lbnRQcm90by51cGRhdGU7XG5jb21wb25lbnRQcm90by5fX19kZXN0cm95ID0gY29tcG9uZW50UHJvdG8uZGVzdHJveTtcblxuLy8gQWRkIGFsbCBvZiB0aGUgZm9sbG93aW5nIERPTSBtZXRob2RzIHRvIENvbXBvbmVudC5wcm90b3R5cGU6XG4vLyAtIGFwcGVuZFRvKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlQ2hpbGRyZW5PZihyZWZlcmVuY2VFbClcbi8vIC0gaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUVsKVxuLy8gLSBpbnNlcnRBZnRlcihyZWZlcmVuY2VFbClcbi8vIC0gcHJlcGVuZFRvKHJlZmVyZW5jZUVsKVxuZG9tSW5zZXJ0KFxuICBjb21wb25lbnRQcm90byxcbiAgZnVuY3Rpb24gZ2V0RWwoY29tcG9uZW50KSB7XG4gICAgcmV0dXJuIGNvbXBvbmVudC5fX19kZXRhY2goKTtcbiAgfSxcbiAgZnVuY3Rpb24gYWZ0ZXJJbnNlcnQoY29tcG9uZW50KSB7XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgfSxcbik7XG5cbmluaGVyaXQoQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xudmFyIHcxME5vb3AgPSByZXF1aXJlKFwid2FycDEwL2NvbnN0YW50c1wiKS5OT09QO1xudmFyIGNvbXBvbmVudFV0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBhdHRhY2hCdWJibGluZ0V2ZW50ID0gY29tcG9uZW50VXRpbC5fX19hdHRhY2hCdWJibGluZ0V2ZW50O1xudmFyIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlciA9XG4gIHJlcXVpcmUoXCIuL2V2ZW50LWRlbGVnYXRpb25cIikuX19fYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyO1xudmFyIEtleVNlcXVlbmNlID0gcmVxdWlyZShcIi4vS2V5U2VxdWVuY2VcIik7XG52YXIgRU1QVFlfT0JKRUNUID0ge307XG5cbnZhciBGTEFHX1dJTExfUkVSRU5ERVJfSU5fQlJPV1NFUiA9IDE7XG52YXIgRkxBR19IQVNfUkVOREVSX0JPRFkgPSAyO1xudmFyIEZMQUdfSVNfTEVHQUNZID0gNDtcbnZhciBGTEFHX09MRF9IWURSQVRFX05PX0NSRUFURSA9IDg7XG5cbi8qKlxuICogQSBDb21wb25lbnREZWYgaXMgdXNlZCB0byBob2xkIHRoZSBtZXRhZGF0YSBjb2xsZWN0ZWQgYXQgcnVudGltZSBmb3JcbiAqIGEgc2luZ2xlIGNvbXBvbmVudCBhbmQgdGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIHRvIGluc3RhbnRpYXRlIHRoZSBjb21wb25lbnRcbiAqIGxhdGVyIChhZnRlciB0aGUgcmVuZGVyZWQgSFRNTCBoYXMgYmVlbiBhZGRlZCB0byB0aGUgRE9NKVxuICovXG5mdW5jdGlvbiBDb21wb25lbnREZWYoY29tcG9uZW50LCBjb21wb25lbnRJZCwgY29tcG9uZW50c0NvbnRleHQpIHtcbiAgdGhpcy5fX19jb21wb25lbnRzQ29udGV4dCA9IGNvbXBvbmVudHNDb250ZXh0OyAvLyBUaGUgQXN5bmNXcml0ZXIgdGhhdCB0aGlzIGNvbXBvbmVudCBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgdGhpcy5fX19jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gIHRoaXMuaWQgPSBjb21wb25lbnRJZDtcblxuICB0aGlzLl9fX2RvbUV2ZW50cyA9IHVuZGVmaW5lZDsgLy8gQW4gYXJyYXkgb2YgRE9NIGV2ZW50cyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgKGluIHNldHMgb2YgdGhyZWUpXG5cbiAgdGhpcy5fX19pc0V4aXN0aW5nID0gZmFsc2U7XG5cbiAgdGhpcy5fX19yZW5kZXJCb3VuZGFyeSA9IGZhbHNlO1xuICB0aGlzLl9fX2ZsYWdzID0gMDtcblxuICB0aGlzLl9fX25leHRJZEluZGV4ID0gMDsgLy8gVGhlIHVuaXF1ZSBpbnRlZ2VyIHRvIHVzZSBmb3IgdGhlIG5leHQgc2NvcGVkIElEXG4gIHRoaXMuX19fa2V5U2VxdWVuY2UgPSBudWxsO1xufVxuXG5Db21wb25lbnREZWYucHJvdG90eXBlID0ge1xuICBfX19uZXh0S2V5OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX19fa2V5U2VxdWVuY2UgfHwgKHRoaXMuX19fa2V5U2VxdWVuY2UgPSBuZXcgS2V5U2VxdWVuY2UoKSlcbiAgICApLl9fX25leHRLZXkoa2V5KTtcbiAgfSxcblxuICAvKipcbiAgICogVGhpcyBoZWxwZXIgbWV0aG9kIGdlbmVyYXRlcyBhIHVuaXF1ZSBhbmQgZnVsbHkgcXVhbGlmaWVkIERPTSBlbGVtZW50IElEXG4gICAqIHRoYXQgaXMgdW5pcXVlIHdpdGhpbiB0aGUgc2NvcGUgb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50LlxuICAgKi9cbiAgZWxJZDogZnVuY3Rpb24gKG5lc3RlZElkKSB7XG4gICAgdmFyIGlkID0gdGhpcy5pZDtcblxuICAgIGlmIChuZXN0ZWRJZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgbmVzdGVkSWQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICAgICAgY29tcGxhaW4oXCJVc2luZyBub24gc3RyaW5ncyBhcyBrZXlzIGlzIGRlcHJlY2F0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmVzdGVkSWQgPSBTdHJpbmcobmVzdGVkSWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVzdGVkSWQuaW5kZXhPZihcIiNcIikgPT09IDApIHtcbiAgICAgICAgaWQgPSBcIiNcIiArIGlkO1xuICAgICAgICBuZXN0ZWRJZCA9IG5lc3RlZElkLnN1YnN0cmluZygxKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlkICsgXCItXCIgKyBuZXN0ZWRJZDtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuZXh0IGF1dG8gZ2VuZXJhdGVkIHVuaXF1ZSBJRCBmb3IgYSBuZXN0ZWQgRE9NIGVsZW1lbnQgb3IgbmVzdGVkIERPTSBjb21wb25lbnRcbiAgICovXG4gIF9fX25leHRDb21wb25lbnRJZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlkICsgXCItY1wiICsgdGhpcy5fX19uZXh0SWRJbmRleCsrO1xuICB9LFxuXG4gIGQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGhhbmRsZXJNZXRob2ROYW1lLCBpc09uY2UsIGV4dHJhQXJncykge1xuICAgIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlcihldmVudE5hbWUpO1xuICAgIHJldHVybiBhdHRhY2hCdWJibGluZ0V2ZW50KHRoaXMsIGhhbmRsZXJNZXRob2ROYW1lLCBpc09uY2UsIGV4dHJhQXJncyk7XG4gIH0sXG5cbiAgZ2V0IF9fX3R5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fY29tcG9uZW50Ll9fX3R5cGU7XG4gIH0sXG59O1xuXG5Db21wb25lbnREZWYucHJvdG90eXBlLm5rID0gQ29tcG9uZW50RGVmLnByb3RvdHlwZS5fX19uZXh0S2V5O1xuXG5Db21wb25lbnREZWYuX19fZGVzZXJpYWxpemUgPSBmdW5jdGlvbiAobywgdHlwZXMsIGdsb2JhbCwgcmVnaXN0cnkpIHtcbiAgdmFyIGlkID0gb1swXTtcbiAgdmFyIHR5cGVOYW1lID0gdHlwZXNbb1sxXV07XG4gIHZhciBpbnB1dCA9IG9bMl0gfHwgbnVsbDtcbiAgdmFyIGV4dHJhID0gb1szXSB8fCBFTVBUWV9PQkpFQ1Q7XG5cbiAgdmFyIHN0YXRlID0gZXh0cmEucztcbiAgdmFyIGNvbXBvbmVudFByb3BzID0gZXh0cmEudyB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHZhciBmbGFncyA9IGV4dHJhLmY7XG4gIHZhciBpc0xlZ2FjeSA9IGZsYWdzICYgRkxBR19JU19MRUdBQ1k7XG4gIHZhciByZW5kZXJCb2R5ID0gZmxhZ3MgJiBGTEFHX0hBU19SRU5ERVJfQk9EWSA/IHcxME5vb3AgOiBleHRyYS5yO1xuXG4gIHZhciBjb21wb25lbnQgPVxuICAgIHR5cGVOYW1lIC8qIGxlZ2FjeSAqLyAmJlxuICAgIHJlZ2lzdHJ5Ll9fX2NyZWF0ZUNvbXBvbmVudCh0eXBlTmFtZSwgaWQsIGlzTGVnYWN5KTtcblxuICAvLyBQcmV2ZW50IG5ld2x5IGNyZWF0ZWQgY29tcG9uZW50IGZyb20gYmVpbmcgcXVldWVkIGZvciB1cGRhdGUgc2luY2Ugd2UgYXJlYVxuICAvLyBqdXN0IGJ1aWxkaW5nIGl0IGZyb20gdGhlIHNlcnZlciBpbmZvXG4gIGNvbXBvbmVudC5fX191cGRhdGVRdWV1ZWQgPSB0cnVlO1xuXG4gIGlmIChpc0xlZ2FjeSkge1xuICAgIGNvbXBvbmVudC53aWRnZXRDb25maWcgPSBjb21wb25lbnRQcm9wcztcbiAgICBjb21wb25lbnQuX19fd2lkZ2V0Qm9keSA9IHJlbmRlckJvZHk7XG4gIH0gZWxzZSBpZiAocmVuZGVyQm9keSkge1xuICAgIChpbnB1dCB8fCAoaW5wdXQgPSB7fSkpLnJlbmRlckJvZHkgPSByZW5kZXJCb2R5O1xuICB9XG5cbiAgaWYgKFxuICAgICFpc0xlZ2FjeSAmJlxuICAgIGZsYWdzICYgRkxBR19XSUxMX1JFUkVOREVSX0lOX0JST1dTRVIgJiZcbiAgICAhKGZsYWdzICYgRkxBR19PTERfSFlEUkFURV9OT19DUkVBVEUpXG4gICkge1xuICAgIGlmIChjb21wb25lbnQub25DcmVhdGUpIHtcbiAgICAgIGNvbXBvbmVudC5vbkNyZWF0ZShpbnB1dCwgeyBnbG9iYWw6IGdsb2JhbCB9KTtcbiAgICB9XG4gICAgaWYgKGNvbXBvbmVudC5vbklucHV0KSB7XG4gICAgICBpbnB1dCA9IGNvbXBvbmVudC5vbklucHV0KGlucHV0LCB7IGdsb2JhbDogZ2xvYmFsIH0pIHx8IGlucHV0O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHZhciB1bmRlZmluZWRQcm9wTmFtZXMgPSBleHRyYS51O1xuICAgICAgaWYgKHVuZGVmaW5lZFByb3BOYW1lcykge1xuICAgICAgICB1bmRlZmluZWRQcm9wTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAodW5kZWZpbmVkUHJvcE5hbWUpIHtcbiAgICAgICAgICBzdGF0ZVt1bmRlZmluZWRQcm9wTmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gV2UgZ28gdGhyb3VnaCB0aGUgc2V0dGVyIGhlcmUgc28gdGhhdCB3ZSBjb252ZXJ0IHRoZSBzdGF0ZSBvYmplY3RcbiAgICAgIC8vIHRvIGFuIGluc3RhbmNlIG9mIGBTdGF0ZWBcbiAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cblxuICAgIGlmICghaXNMZWdhY3kgJiYgY29tcG9uZW50UHJvcHMpIHtcbiAgICAgIGV4dGVuZChjb21wb25lbnQsIGNvbXBvbmVudFByb3BzKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnQuX19faW5wdXQgPSBpbnB1dDtcblxuICBpZiAoZXh0cmEuYikge1xuICAgIGNvbXBvbmVudC5fX19idWJibGluZ0RvbUV2ZW50cyA9IGV4dHJhLmI7XG4gIH1cblxuICB2YXIgc2NvcGUgPSBleHRyYS5wO1xuICB2YXIgY3VzdG9tRXZlbnRzID0gZXh0cmEuZTtcbiAgaWYgKGN1c3RvbUV2ZW50cykge1xuICAgIGNvbXBvbmVudC5fX19zZXRDdXN0b21FdmVudHMoY3VzdG9tRXZlbnRzLCBzY29wZSk7XG4gIH1cblxuICBjb21wb25lbnQuX19fZ2xvYmFsID0gZ2xvYmFsO1xuXG4gIHJldHVybiB7XG4gICAgaWQ6IGlkLFxuICAgIF9fX2NvbXBvbmVudDogY29tcG9uZW50LFxuICAgIF9fX2RvbUV2ZW50czogZXh0cmEuZCxcbiAgICBfX19mbGFnczogZXh0cmEuZiB8fCAwLFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnREZWY7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBHbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IHJlcXVpcmUoXCIuL0dsb2JhbENvbXBvbmVudHNDb250ZXh0XCIpO1xuXG5mdW5jdGlvbiBDb21wb25lbnRzQ29udGV4dChvdXQsIHBhcmVudENvbXBvbmVudHNDb250ZXh0KSB7XG4gIHZhciBnbG9iYWxDb21wb25lbnRzQ29udGV4dDtcbiAgdmFyIGNvbXBvbmVudERlZjtcblxuICBpZiAocGFyZW50Q29tcG9uZW50c0NvbnRleHQpIHtcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQ7XG4gICAgY29tcG9uZW50RGVmID0gcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmO1xuXG4gICAgdmFyIG5lc3RlZENvbnRleHRzRm9yUGFyZW50O1xuICAgIGlmIChcbiAgICAgICEobmVzdGVkQ29udGV4dHNGb3JQYXJlbnQgPSBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19uZXN0ZWRDb250ZXh0cylcbiAgICApIHtcbiAgICAgIG5lc3RlZENvbnRleHRzRm9yUGFyZW50ID0gcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19fbmVzdGVkQ29udGV4dHMgPSBbXTtcbiAgICB9XG5cbiAgICBuZXN0ZWRDb250ZXh0c0ZvclBhcmVudC5wdXNoKHRoaXMpO1xuICB9IGVsc2Uge1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gb3V0Lmdsb2JhbC5fX19jb21wb25lbnRzO1xuICAgIGlmIChnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXQuZ2xvYmFsLl9fX2NvbXBvbmVudHMgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9XG4gICAgICAgIG5ldyBHbG9iYWxDb21wb25lbnRzQ29udGV4dChvdXQpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX19fZ2xvYmFsQ29udGV4dCA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0O1xuICB0aGlzLl9fX2NvbXBvbmVudHMgPSBbXTtcbiAgdGhpcy5fX19vdXQgPSBvdXQ7XG4gIHRoaXMuX19fY29tcG9uZW50RGVmID0gY29tcG9uZW50RGVmO1xuICB0aGlzLl9fX25lc3RlZENvbnRleHRzID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX2lzUHJlc2VydmVkID1cbiAgICBwYXJlbnRDb21wb25lbnRzQ29udGV4dCAmJiBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19pc1ByZXNlcnZlZDtcbn1cblxuQ29tcG9uZW50c0NvbnRleHQucHJvdG90eXBlID0ge1xuICBfX19pbml0Q29tcG9uZW50czogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICB2YXIgY29tcG9uZW50RGVmcyA9IHRoaXMuX19fY29tcG9uZW50cztcblxuICAgIENvbXBvbmVudHNDb250ZXh0Ll9fX2luaXRDbGllbnRSZW5kZXJlZChjb21wb25lbnREZWZzLCBob3N0KTtcblxuICAgIHRoaXMuX19fb3V0LmVtaXQoXCJfX19jb21wb25lbnRzSW5pdGlhbGl6ZWRcIik7XG5cbiAgICAvLyBSZXNldCB0aGluZ3Mgc3RvcmVkIGluIGdsb2JhbCBzaW5jZSBnbG9iYWwgaXMgcmV0YWluZWQgZm9yXG4gICAgLy8gZnV0dXJlIHJlbmRlcnNcbiAgICB0aGlzLl9fX291dC5nbG9iYWwuX19fY29tcG9uZW50cyA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBjb21wb25lbnREZWZzO1xuICB9LFxufTtcblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50c0NvbnRleHQob3V0KSB7XG4gIHJldHVybiBvdXQuX19fY29tcG9uZW50cyB8fCAob3V0Ll9fX2NvbXBvbmVudHMgPSBuZXcgQ29tcG9uZW50c0NvbnRleHQob3V0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IENvbXBvbmVudHNDb250ZXh0O1xuXG5leHBvcnRzLl9fX2dldENvbXBvbmVudHNDb250ZXh0ID0gZ2V0Q29tcG9uZW50c0NvbnRleHQ7XG4iLCJ2YXIgbmV4dENvbXBvbmVudElkUHJvdmlkZXIgPVxuICByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKS5fX19uZXh0Q29tcG9uZW50SWRQcm92aWRlcjtcblxuZnVuY3Rpb24gR2xvYmFsQ29tcG9uZW50c0NvbnRleHQob3V0KSB7XG4gIHRoaXMuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZCA9IHt9O1xuICB0aGlzLl9fX3JlcmVuZGVyQ29tcG9uZW50ID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX25leHRDb21wb25lbnRJZCA9IG5leHRDb21wb25lbnRJZFByb3ZpZGVyKG91dCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsQ29tcG9uZW50c0NvbnRleHQ7XG4iLCJmdW5jdGlvbiBLZXlTZXF1ZW5jZSgpIHtcbiAgdGhpcy5fX19sb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuXG5LZXlTZXF1ZW5jZS5wcm90b3R5cGUuX19fbmV4dEtleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIGxvb2t1cCA9IHRoaXMuX19fbG9va3VwO1xuXG4gIGlmIChsb29rdXBba2V5XSkge1xuICAgIHJldHVybiBrZXkgKyBcIl9cIiArIGxvb2t1cFtrZXldKys7XG4gIH1cblxuICBsb29rdXBba2V5XSA9IDE7XG4gIHJldHVybiBrZXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleVNlcXVlbmNlO1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG5cbmZ1bmN0aW9uIGVuc3VyZShzdGF0ZSwgcHJvcGVydHlOYW1lKSB7XG4gIHZhciBwcm90byA9IHN0YXRlLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgaWYgKCEocHJvcGVydHlOYW1lIGluIHByb3RvKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgcHJvcGVydHlOYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19fcmF3W3Byb3BlcnR5TmFtZV07XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fX19zZXQocHJvcGVydHlOYW1lLCB2YWx1ZSwgZmFsc2UgLyogZW5zdXJlOmZhbHNlICovKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gU3RhdGUoY29tcG9uZW50KSB7XG4gIHRoaXMuX19fY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB0aGlzLl9fX3JhdyA9IHt9O1xuXG4gIHRoaXMuX19fZGlydHkgPSBmYWxzZTtcbiAgdGhpcy5fX19vbGQgPSBudWxsO1xuICB0aGlzLl9fX2NoYW5nZXMgPSBudWxsO1xuICB0aGlzLl9fX2ZvcmNlZCA9IG51bGw7IC8vIEFuIG9iamVjdCB0aGF0IHdlIHVzZSB0byBrZWVwIHRyYWNraW5nIG9mIHN0YXRlIHByb3BlcnRpZXMgdGhhdCB3ZXJlIGZvcmNlZCB0byBiZSBkaXJ0eVxuXG4gIE9iamVjdC5zZWFsKHRoaXMpO1xufVxuXG5TdGF0ZS5wcm90b3R5cGUgPSB7XG4gIF9fX3Jlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5fX19kaXJ0eSA9IGZhbHNlO1xuICAgIHNlbGYuX19fb2xkID0gbnVsbDtcbiAgICBzZWxmLl9fX2NoYW5nZXMgPSBudWxsO1xuICAgIHNlbGYuX19fZm9yY2VkID0gbnVsbDtcbiAgfSxcblxuICBfX19yZXBsYWNlOiBmdW5jdGlvbiAobmV3U3RhdGUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzO1xuICAgIHZhciBrZXk7XG5cbiAgICB2YXIgcmF3U3RhdGUgPSB0aGlzLl9fX3JhdztcblxuICAgIGZvciAoa2V5IGluIHJhd1N0YXRlKSB7XG4gICAgICBpZiAoIShrZXkgaW4gbmV3U3RhdGUpKSB7XG4gICAgICAgIHN0YXRlLl9fX3NldChcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgIGZhbHNlIC8qIGVuc3VyZTpmYWxzZSAqLyxcbiAgICAgICAgICBmYWxzZSAvKiBmb3JjZURpcnR5OmZhbHNlICovLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoa2V5IGluIG5ld1N0YXRlKSB7XG4gICAgICBzdGF0ZS5fX19zZXQoXG4gICAgICAgIGtleSxcbiAgICAgICAgbmV3U3RhdGVba2V5XSxcbiAgICAgICAgdHJ1ZSAvKiBlbnN1cmU6dHJ1ZSAqLyxcbiAgICAgICAgZmFsc2UgLyogZm9yY2VEaXJ0eTpmYWxzZSAqLyxcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICBfX19zZXQ6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgc2hvdWxkRW5zdXJlLCBmb3JjZURpcnR5KSB7XG4gICAgdmFyIHJhd1N0YXRlID0gdGhpcy5fX19yYXc7XG5cbiAgICBpZiAoc2hvdWxkRW5zdXJlKSB7XG4gICAgICBlbnN1cmUodGhpcywgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKGZvcmNlRGlydHkpIHtcbiAgICAgIHZhciBmb3JjZWREaXJ0eVN0YXRlID0gdGhpcy5fX19mb3JjZWQgfHwgKHRoaXMuX19fZm9yY2VkID0ge30pO1xuICAgICAgZm9yY2VkRGlydHlTdGF0ZVtuYW1lXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChyYXdTdGF0ZVtuYW1lXSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX19fZGlydHkpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgd2UgYXJlIG1vZGlmeWluZyB0aGUgY29tcG9uZW50IHN0YXRlXG4gICAgICAvLyBzbyBpbnRyb2R1Y2Ugc29tZSBwcm9wZXJ0aWVzIHRvIGRvIHNvbWUgdHJhY2tpbmcgb2ZcbiAgICAgIC8vIGNoYW5nZXMgdG8gdGhlIHN0YXRlXG4gICAgICB0aGlzLl9fX2RpcnR5ID0gdHJ1ZTsgLy8gTWFyayB0aGUgY29tcG9uZW50IHN0YXRlIGFzIGRpcnR5IChpLmUuIG1vZGlmaWVkKVxuICAgICAgdGhpcy5fX19vbGQgPSByYXdTdGF0ZTtcbiAgICAgIHRoaXMuX19fcmF3ID0gcmF3U3RhdGUgPSBleHRlbmQoe30sIHJhd1N0YXRlKTtcbiAgICAgIHRoaXMuX19fY2hhbmdlcyA9IHt9O1xuICAgICAgdGhpcy5fX19jb21wb25lbnQuX19fcXVldWVVcGRhdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fX2NoYW5nZXNbbmFtZV0gPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBEb24ndCBzdG9yZSBzdGF0ZSBwcm9wZXJ0aWVzIHdpdGggYW4gdW5kZWZpbmVkIG9yIG51bGwgdmFsdWVcbiAgICAgIGRlbGV0ZSByYXdTdGF0ZVtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBzdG9yZSB0aGUgbmV3IHZhbHVlIGluIHRoZSBjb21wb25lbnQgc3RhdGVcbiAgICAgIHJhd1N0YXRlW25hbWVdID0gdmFsdWU7XG4gICAgfVxuICB9LFxuICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19yYXc7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG5cbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL0NvbXBvbmVudFwiKTtcbnZhciBCYXNlU3RhdGUgPSByZXF1aXJlKFwiLi9TdGF0ZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVDb21wb25lbnQoZGVmLCByZW5kZXJlcikge1xuICBpZiAoZGVmLl9fX2lzQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIGRlZjtcbiAgfVxuXG4gIHZhciBDb21wb25lbnRDbGFzcyA9IGZ1bmN0aW9uICgpIHt9O1xuICB2YXIgcHJvdG87XG5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgZGVmO1xuXG4gIGlmICh0eXBlID09IFwiZnVuY3Rpb25cIikge1xuICAgIHByb3RvID0gZGVmLnByb3RvdHlwZTtcbiAgfSBlbHNlIGlmICh0eXBlID09IFwib2JqZWN0XCIpIHtcbiAgICBwcm90byA9IGRlZjtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgfVxuXG4gIENvbXBvbmVudENsYXNzLnByb3RvdHlwZSA9IHByb3RvO1xuXG4gIC8vIFdlIGRvbid0IHVzZSB0aGUgY29uc3RydWN0b3IgcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgLy8gc2luY2Ugd2UgZG9uJ3QgaW52b2tlIHRoZWlyIGNvbnN0cnVjdG9yIHVudGlsXG4gIC8vIHdlIGhhdmUgaGFkIGEgY2hhbmNlIHRvIGRvIG91ciBvd24gaW5pdGlhbGl6YXRpb24uXG4gIC8vIEluc3RlYWQsIHdlIHN0b3JlIHRoZWlyIGNvbnN0cnVjdG9yIGluIHRoZSBcImluaXRDb21wb25lbnRcIlxuICAvLyBwcm9wZXJ0eSBhbmQgdGhhdCBtZXRob2QgZ2V0cyBjYWxsZWQgbGF0ZXIgaW5zaWRlXG4gIC8vIGluaXQtY29tcG9uZW50cy1icm93c2VyLmpzXG4gIGZ1bmN0aW9uIENvbXBvbmVudChpZCkge1xuICAgIEJhc2VDb21wb25lbnQuY2FsbCh0aGlzLCBpZCk7XG4gIH1cblxuICBpZiAoIXByb3RvLl9fX2lzQ29tcG9uZW50KSB7XG4gICAgLy8gSW5oZXJpdCBmcm9tIENvbXBvbmVudCBpZiB0aGV5IGRpZG4ndCBhbHJlYWR5XG4gICAgaW5oZXJpdChDb21wb25lbnRDbGFzcywgQmFzZUNvbXBvbmVudCk7XG4gIH1cblxuICAvLyBUaGUgc2FtZSBwcm90b3R5cGUgd2lsbCBiZSB1c2VkIGJ5IG91ciBjb25zdHJ1Y3RvciBhZnRlclxuICAvLyB3ZSBoZSBoYXZlIHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluIHVzaW5nIHRoZSBpbmhlcml0IGZ1bmN0aW9uXG4gIHByb3RvID0gQ29tcG9uZW50LnByb3RvdHlwZSA9IENvbXBvbmVudENsYXNzLnByb3RvdHlwZTtcblxuICAvLyBwcm90by5jb25zdHJ1Y3RvciA9IGRlZi5jb25zdHJ1Y3RvciA9IENvbXBvbmVudDtcblxuICAvLyBTZXQgYSBmbGFnIG9uIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBtYWtlIGl0IGNsZWFyIHRoaXMgaXNcbiAgLy8gYSBjb21wb25lbnQgc28gdGhhdCB3ZSBjYW4gc2hvcnQtY2lyY3VpdCB0aGlzIHdvcmsgbGF0ZXJcbiAgQ29tcG9uZW50Ll9fX2lzQ29tcG9uZW50ID0gdHJ1ZTtcblxuICBmdW5jdGlvbiBTdGF0ZShjb21wb25lbnQpIHtcbiAgICBCYXNlU3RhdGUuY2FsbCh0aGlzLCBjb21wb25lbnQpO1xuICB9XG4gIGluaGVyaXQoU3RhdGUsIEJhc2VTdGF0ZSk7XG4gIHByb3RvLl9fX1N0YXRlID0gU3RhdGU7XG4gIHByb3RvLl9fX3JlbmRlcmVyID0gcmVuZGVyZXI7XG5cbiAgcmV0dXJuIENvbXBvbmVudDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgX19fdlByb3BzQnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX192RWxlbWVudEJ5RE9NTm9kZTogbmV3IFdlYWtNYXAoKSxcbiAgX19fY29tcG9uZW50QnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19kZXRhY2hlZEJ5RE9NTm9kZTogbmV3IFdlYWtNYXAoKSxcbiAgX19fa2V5QnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19zc3JLZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZDoge30sXG59O1xuIiwidmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgcnVudGltZUlkID0gY29tcG9uZW50c1V0aWwuX19fcnVudGltZUlkO1xudmFyIGNvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBnZXRNYXJrb1Byb3BzRnJvbUVsID0gY29tcG9uZW50c1V0aWwuX19fZ2V0TWFya29Qcm9wc0Zyb21FbDtcblxudmFyIFRFWFRfTk9ERSA9IDM7XG5cbi8vIFdlIG1ha2Ugb3VyIGJlc3QgZWZmb3J0IHRvIGFsbG93IG11bHRpcGxlIG1hcmtvIHJ1bnRpbWVzIHRvIGJlIGxvYWRlZCBpbiB0aGVcbi8vIHNhbWUgd2luZG93LiBFYWNoIG1hcmtvIHJ1bnRpbWUgd2lsbCBnZXQgaXRzIG93biB1bmlxdWUgcnVudGltZSBJRC5cbnZhciBsaXN0ZW5lcnNBdHRhY2hlZEtleSA9IFwiJE1ERVwiICsgcnVudGltZUlkO1xudmFyIGRlbGVnYXRlZEV2ZW50cyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRFdmVudEZyb21FbChlbCwgZXZlbnROYW1lKSB7XG4gIHZhciB2aXJ0dWFsUHJvcHMgPSBnZXRNYXJrb1Byb3BzRnJvbUVsKGVsKTtcbiAgdmFyIGV2ZW50SW5mbyA9IHZpcnR1YWxQcm9wc1tldmVudE5hbWVdO1xuXG4gIGlmICh0eXBlb2YgZXZlbnRJbmZvID09PSBcInN0cmluZ1wiKSB7XG4gICAgZXZlbnRJbmZvID0gZXZlbnRJbmZvLnNwbGl0KFwiIFwiKTtcbiAgICBpZiAoZXZlbnRJbmZvWzJdKSB7XG4gICAgICBldmVudEluZm9bMl0gPSBldmVudEluZm9bMl0gPT09IFwidHJ1ZVwiO1xuICAgIH1cbiAgICBpZiAoZXZlbnRJbmZvLmxlbmd0aCA9PSA0KSB7XG4gICAgICBldmVudEluZm9bM10gPSBwYXJzZUludChldmVudEluZm9bM10sIDEwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXZlbnRJbmZvO1xufVxuXG5mdW5jdGlvbiBkZWxlZ2F0ZUV2ZW50KG5vZGUsIGV2ZW50TmFtZSwgdGFyZ2V0LCBldmVudCkge1xuICB2YXIgdGFyZ2V0TWV0aG9kID0gdGFyZ2V0WzBdO1xuICB2YXIgdGFyZ2V0Q29tcG9uZW50SWQgPSB0YXJnZXRbMV07XG4gIHZhciBpc09uY2UgPSB0YXJnZXRbMl07XG4gIHZhciBleHRyYUFyZ3MgPSB0YXJnZXRbM107XG5cbiAgaWYgKGlzT25jZSkge1xuICAgIHZhciB2aXJ0dWFsUHJvcHMgPSBnZXRNYXJrb1Byb3BzRnJvbUVsKG5vZGUpO1xuICAgIGRlbGV0ZSB2aXJ0dWFsUHJvcHNbZXZlbnROYW1lXTtcbiAgfVxuXG4gIHZhciB0YXJnZXRDb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbdGFyZ2V0Q29tcG9uZW50SWRdO1xuXG4gIGlmICghdGFyZ2V0Q29tcG9uZW50KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRhcmdldEZ1bmMgPVxuICAgIHR5cGVvZiB0YXJnZXRNZXRob2QgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyB0YXJnZXRNZXRob2RcbiAgICAgIDogdGFyZ2V0Q29tcG9uZW50W3RhcmdldE1ldGhvZF07XG4gIGlmICghdGFyZ2V0RnVuYykge1xuICAgIHRocm93IEVycm9yKFwiTWV0aG9kIG5vdCBmb3VuZDogXCIgKyB0YXJnZXRNZXRob2QpO1xuICB9XG5cbiAgaWYgKGV4dHJhQXJncyAhPSBudWxsKSB7XG4gICAgaWYgKHR5cGVvZiBleHRyYUFyZ3MgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGV4dHJhQXJncyA9IHRhcmdldENvbXBvbmVudC5fX19idWJibGluZ0RvbUV2ZW50c1tleHRyYUFyZ3NdO1xuICAgIH1cbiAgfVxuXG4gIC8vIEludm9rZSB0aGUgY29tcG9uZW50IG1ldGhvZFxuICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgdGFyZ2V0RnVuYy5hcHBseSh0YXJnZXRDb21wb25lbnQsIGV4dHJhQXJncy5jb25jYXQoZXZlbnQsIG5vZGUpKTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXRGdW5jLmNhbGwodGFyZ2V0Q29tcG9uZW50LCBldmVudCwgbm9kZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyKGV2ZW50VHlwZSkge1xuICBpZiAoIWRlbGVnYXRlZEV2ZW50c1tldmVudFR5cGVdKSB7XG4gICAgZGVsZWdhdGVkRXZlbnRzW2V2ZW50VHlwZV0gPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlclRvSG9zdChldmVudFR5cGUsIGhvc3QpIHtcbiAgdmFyIGxpc3RlbmVycyA9IChob3N0W2xpc3RlbmVyc0F0dGFjaGVkS2V5XSA9XG4gICAgaG9zdFtsaXN0ZW5lcnNBdHRhY2hlZEtleV0gfHwge30pO1xuICBpZiAoIWxpc3RlbmVyc1tldmVudFR5cGVdKSB7XG4gICAgKGhvc3QuYm9keSB8fCBob3N0KS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgZXZlbnRUeXBlLFxuICAgICAgKGxpc3RlbmVyc1tldmVudFR5cGVdID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBjdXJOb2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoIWN1ck5vZGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJOb2RlID1cbiAgICAgICAgICAvLyBldmVudC50YXJnZXQgb2YgYW4gU1ZHRWxlbWVudEluc3RhbmNlIGRvZXMgbm90IGhhdmUgYVxuICAgICAgICAgIC8vIGBnZXRBdHRyaWJ1dGVgIGZ1bmN0aW9uIGluIElFIDExLlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFya28tanMvbWFya28vaXNzdWVzLzc5NlxuICAgICAgICAgIGN1ck5vZGUuY29ycmVzcG9uZGluZ1VzZUVsZW1lbnQgfHxcbiAgICAgICAgICAvLyBpbiBzb21lIGJyb3dzZXJzIHRoZSBldmVudCB0YXJnZXQgY2FuIGJlIGEgdGV4dCBub2RlXG4gICAgICAgICAgLy8gb25lIGV4YW1wbGUgYmVpbmcgZHJhZ2VudGVyIGluIGZpcmVmb3guXG4gICAgICAgICAgKGN1ck5vZGUubm9kZVR5cGUgPT09IFRFWFRfTk9ERSA/IGN1ck5vZGUucGFyZW50Tm9kZSA6IGN1ck5vZGUpO1xuXG4gICAgICAgIC8vIFNlYXJjaCB1cCB0aGUgdHJlZSBsb29raW5nIERPTSBldmVudHMgbWFwcGVkIHRvIHRhcmdldFxuICAgICAgICAvLyBjb21wb25lbnQgbWV0aG9kc1xuICAgICAgICB2YXIgcHJvcE5hbWUgPSBcIm9uXCIgKyBldmVudFR5cGU7XG4gICAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgICAgLy8gQXR0cmlidXRlcyB3aWxsIGhhdmUgdGhlIGZvbGxvd2luZyBmb3JtOlxuICAgICAgICAvLyBvbjxldmVudF90eXBlPihcIjx0YXJnZXRfbWV0aG9kPnw8Y29tcG9uZW50X2lkPlwiKVxuXG4gICAgICAgIGlmIChldmVudC5idWJibGVzKSB7XG4gICAgICAgICAgdmFyIHByb3BhZ2F0aW9uU3RvcHBlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgLy8gTW9ua2V5LXBhdGNoIHRvIGZpeCAjOTdcbiAgICAgICAgICB2YXIgb2xkU3RvcFByb3BhZ2F0aW9uID0gZXZlbnQuc3RvcFByb3BhZ2F0aW9uO1xuXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb2xkU3RvcFByb3BhZ2F0aW9uLmNhbGwoZXZlbnQpO1xuICAgICAgICAgICAgcHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKCh0YXJnZXQgPSBnZXRFdmVudEZyb21FbChjdXJOb2RlLCBwcm9wTmFtZSkpKSB7XG4gICAgICAgICAgICAgIGRlbGVnYXRlRXZlbnQoY3VyTm9kZSwgcHJvcE5hbWUsIHRhcmdldCwgZXZlbnQpO1xuXG4gICAgICAgICAgICAgIGlmIChwcm9wYWdhdGlvblN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gd2hpbGUgKChjdXJOb2RlID0gY3VyTm9kZS5wYXJlbnROb2RlKSAmJiBjdXJOb2RlLmdldEF0dHJpYnV0ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKHRhcmdldCA9IGdldEV2ZW50RnJvbUVsKGN1ck5vZGUsIHByb3BOYW1lKSkpIHtcbiAgICAgICAgICBkZWxlZ2F0ZUV2ZW50KGN1ck5vZGUsIHByb3BOYW1lLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0cnVlLFxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmV4cG9ydHMuX19faGFuZGxlTm9kZUF0dGFjaCA9IG5vb3A7XG5leHBvcnRzLl9fX2hhbmRsZU5vZGVEZXRhY2ggPSBub29wO1xuZXhwb3J0cy5fX19kZWxlZ2F0ZUV2ZW50ID0gZGVsZWdhdGVFdmVudDtcbmV4cG9ydHMuX19fZ2V0RXZlbnRGcm9tRWwgPSBnZXRFdmVudEZyb21FbDtcbmV4cG9ydHMuX19fYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyID0gYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyO1xuZXhwb3J0cy5fX19pbml0ID0gZnVuY3Rpb24gKGhvc3QpIHtcbiAgT2JqZWN0LmtleXMoZGVsZWdhdGVkRXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudFR5cGUpIHtcbiAgICBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXJUb0hvc3QoZXZlbnRUeXBlLCBob3N0KTtcbiAgfSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtcmVnaXN0cnlcIik7XG4iLCJ2YXIgY29weVByb3BzID0gcmVxdWlyZShcInJhcHRvci11dGlsL2NvcHlQcm9wc1wiKTtcbnZhciBiZWdpbkNvbXBvbmVudCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy1iZWdpbkNvbXBvbmVudFwiKTtcbnZhciBlbmRDb21wb25lbnQgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtZW5kQ29tcG9uZW50XCIpO1xudmFyIHJlZ2lzdHJ5ID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXJlZ2lzdHJ5XCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xuXG52YXIgQ29tcG9uZW50c0NvbnRleHQgPSByZXF1aXJlKFwiLi9Db21wb25lbnRzQ29udGV4dFwiKTtcbnZhciBnZXRDb21wb25lbnRzQ29udGV4dCA9IENvbXBvbmVudHNDb250ZXh0Ll9fX2dldENvbXBvbmVudHNDb250ZXh0O1xudmFyIGlzU2VydmVyID0gY29tcG9uZW50c1V0aWwuX19faXNTZXJ2ZXIgPT09IHRydWU7XG5cbnZhciBDT01QT05FTlRfQkVHSU5fQVNZTkNfQURERURfS0VZID0gXCIkd2FcIjtcblxuZnVuY3Rpb24gcmVzb2x2ZUNvbXBvbmVudEtleShrZXksIHBhcmVudENvbXBvbmVudERlZikge1xuICBpZiAoa2V5WzBdID09PSBcIiNcIikge1xuICAgIHJldHVybiBrZXkuc3Vic3RyaW5nKDEpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXJlbnRDb21wb25lbnREZWYuaWQgKyBcIi1cIiArIHBhcmVudENvbXBvbmVudERlZi5fX19uZXh0S2V5KGtleSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhY2tBc3luY0NvbXBvbmVudHMob3V0KSB7XG4gIGlmIChvdXQuaXNTeW5jKCkgfHwgb3V0Lmdsb2JhbFtDT01QT05FTlRfQkVHSU5fQVNZTkNfQURERURfS0VZXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG91dC5vbihcImJlZ2luQXN5bmNcIiwgaGFuZGxlQmVnaW5Bc3luYyk7XG4gIG91dC5vbihcImJlZ2luRGV0YWNoZWRBc3luY1wiLCBoYW5kbGVCZWdpbkRldGFjaGVkQXN5bmMpO1xuICBvdXQuZ2xvYmFsW0NPTVBPTkVOVF9CRUdJTl9BU1lOQ19BRERFRF9LRVldID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQmVnaW5Bc3luYyhldmVudCkge1xuICB2YXIgcGFyZW50T3V0ID0gZXZlbnQucGFyZW50T3V0O1xuICB2YXIgYXN5bmNPdXQgPSBldmVudC5vdXQ7XG4gIHZhciBjb21wb25lbnRzQ29udGV4dCA9IHBhcmVudE91dC5fX19jb21wb25lbnRzO1xuXG4gIGlmIChjb21wb25lbnRzQ29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gV2UgYXJlIGdvaW5nIHRvIHN0YXJ0IGEgbmVzdGVkIENvbXBvbmVudHNDb250ZXh0XG4gICAgYXN5bmNPdXQuX19fY29tcG9uZW50cyA9IG5ldyBDb21wb25lbnRzQ29udGV4dChhc3luY091dCwgY29tcG9uZW50c0NvbnRleHQpO1xuICB9XG4gIC8vIENhcnJ5IGFsb25nIHRoZSBjb21wb25lbnQgYXJndW1lbnRzXG4gIGFzeW5jT3V0LmMoXG4gICAgcGFyZW50T3V0Ll9fX2Fzc2lnbmVkQ29tcG9uZW50RGVmLFxuICAgIHBhcmVudE91dC5fX19hc3NpZ25lZEtleSxcbiAgICBwYXJlbnRPdXQuX19fYXNzaWduZWRDdXN0b21FdmVudHMsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJlZ2luRGV0YWNoZWRBc3luYyhldmVudCkge1xuICB2YXIgYXN5bmNPdXQgPSBldmVudC5vdXQ7XG4gIGhhbmRsZUJlZ2luQXN5bmMoZXZlbnQpO1xuICBhc3luY091dC5vbihcImJlZ2luQXN5bmNcIiwgaGFuZGxlQmVnaW5Bc3luYyk7XG4gIGFzeW5jT3V0Lm9uKFwiYmVnaW5EZXRhY2hlZEFzeW5jXCIsIGhhbmRsZUJlZ2luRGV0YWNoZWRBc3luYyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlbmRlcmVyRnVuYyhcbiAgdGVtcGxhdGVSZW5kZXJGdW5jLFxuICBjb21wb25lbnRQcm9wcyxcbiAgcmVuZGVyaW5nTG9naWMsXG4pIHtcbiAgdmFyIG9uSW5wdXQgPSByZW5kZXJpbmdMb2dpYyAmJiByZW5kZXJpbmdMb2dpYy5vbklucHV0O1xuICB2YXIgdHlwZU5hbWUgPSBjb21wb25lbnRQcm9wcy50O1xuICB2YXIgaXNTcGxpdCA9IGNvbXBvbmVudFByb3BzLnMgPT09IHRydWU7XG4gIHZhciBpc0ltcGxpY2l0Q29tcG9uZW50ID0gY29tcG9uZW50UHJvcHMuaSA9PT0gdHJ1ZTtcblxuICB2YXIgc2hvdWxkQXBwbHlTcGxpdE1peGlucyA9IHJlbmRlcmluZ0xvZ2ljICYmIGlzU3BsaXQ7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgaWYgKCFjb21wb25lbnRQcm9wcy5kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiQ29tcG9uZW50IHdhcyBjb21waWxlZCBpbiBhIGRpZmZlcmVudCBOT0RFX0VOViB0aGFuIHRoZSBNYXJrbyBydW50aW1lIGlzIHVzaW5nLlwiLFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY29tcG9uZW50UHJvcHMuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlJ1bnRpbWUvTk9ERV9FTlYgTWlzbWF0Y2hcIik7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gcmVuZGVyZXIoaW5wdXQsIG91dCkge1xuICAgIHRyYWNrQXN5bmNDb21wb25lbnRzKG91dCk7XG5cbiAgICB2YXIgY29tcG9uZW50c0NvbnRleHQgPSBnZXRDb21wb25lbnRzQ29udGV4dChvdXQpO1xuICAgIHZhciBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQ7XG5cbiAgICB2YXIgY29tcG9uZW50ID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVyZW5kZXJDb21wb25lbnQ7XG4gICAgdmFyIGlzUmVyZW5kZXIgPSBjb21wb25lbnQgIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaWQ7XG4gICAgdmFyIGlzRXhpc3Rpbmc7XG4gICAgdmFyIGN1c3RvbUV2ZW50cztcbiAgICB2YXIgcGFyZW50Q29tcG9uZW50RGVmID0gY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmO1xuICAgIHZhciBvd25lckNvbXBvbmVudERlZiA9IG91dC5fX19hc3NpZ25lZENvbXBvbmVudERlZjtcbiAgICB2YXIgb3duZXJDb21wb25lbnRJZCA9IG93bmVyQ29tcG9uZW50RGVmICYmIG93bmVyQ29tcG9uZW50RGVmLmlkO1xuICAgIHZhciBrZXkgPSBvdXQuX19fYXNzaWduZWRLZXk7XG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAvLyBJZiBjb21wb25lbnQgaXMgcHJvdmlkZWQgdGhlbiB3ZSBhcmUgY3VycmVudGx5IHJlbmRlcmluZ1xuICAgICAgLy8gdGhlIHRvcC1sZXZlbCBVSSBjb21wb25lbnQgYXMgcGFydCBvZiBhIHJlLXJlbmRlclxuICAgICAgaWQgPSBjb21wb25lbnQuaWQ7IC8vIFdlIHdpbGwgdXNlIHRoZSBJRCBvZiB0aGUgY29tcG9uZW50IGJlaW5nIHJlLXJlbmRlcmVkXG4gICAgICBpc0V4aXN0aW5nID0gdHJ1ZTsgLy8gVGhpcyBpcyBhIHJlLXJlbmRlciBzbyB3ZSBrbm93IHRoZSBjb21wb25lbnQgaXMgYWxyZWFkeSBpbiB0aGUgRE9NXG4gICAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZXJlbmRlckNvbXBvbmVudCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgd2UgYXJlIHJlbmRlcmluZyBhIG5lc3RlZCBVSSBjb21wb25lbnQuIFdlIHdpbGwgbmVlZFxuICAgICAgLy8gdG8gbWF0Y2ggdXAgdGhlIFVJIGNvbXBvbmVudCB3aXRoIHRoZSBjb21wb25lbnQgYWxyZWFkeSBpbiB0aGVcbiAgICAgIC8vIERPTSAoaWYgYW55KSBzbyB3ZSB3aWxsIG5lZWQgdG8gcmVzb2x2ZSB0aGUgY29tcG9uZW50IElEIGZyb21cbiAgICAgIC8vIHRoZSBhc3NpZ25lZCBrZXkuIFdlIGFsc28gbmVlZCB0byBoYW5kbGUgYW55IGN1c3RvbSBldmVudCBiaW5kaW5nc1xuICAgICAgLy8gdGhhdCB3ZXJlIHByb3ZpZGVkLlxuICAgICAgaWYgKHBhcmVudENvbXBvbmVudERlZikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnY29tcG9uZW50QXJnczonLCBjb21wb25lbnRBcmdzKTtcbiAgICAgICAgY3VzdG9tRXZlbnRzID0gb3V0Ll9fX2Fzc2lnbmVkQ3VzdG9tRXZlbnRzO1xuXG4gICAgICAgIGlmIChrZXkgIT0gbnVsbCkge1xuICAgICAgICAgIGlkID0gcmVzb2x2ZUNvbXBvbmVudEtleShrZXkudG9TdHJpbmcoKSwgcGFyZW50Q29tcG9uZW50RGVmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZCA9IHBhcmVudENvbXBvbmVudERlZi5fX19uZXh0Q29tcG9uZW50SWQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWQgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19uZXh0Q29tcG9uZW50SWQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNTZXJ2ZXIpIHtcbiAgICAgIC8vIElmIHdlIGFyZSByZW5kZXJpbmcgb24gdGhlIHNlcnZlciB0aGVuIHRoaW5ncyBhcmUgc2ltcGxpZXIgc2luY2VcbiAgICAgIC8vIHdlIGRvbid0IG5lZWQgdG8gbWF0Y2ggdXAgdGhlIFVJIGNvbXBvbmVudCB3aXRoIGEgcHJldmlvdXNseVxuICAgICAgLy8gcmVuZGVyZWQgY29tcG9uZW50IGFscmVhZHkgbW91bnRlZCB0byB0aGUgRE9NLiBXZSBhbHNvIGNyZWF0ZVxuICAgICAgLy8gYSBsaWdodHdlaWdodCBTZXJ2ZXJDb21wb25lbnRcbiAgICAgIGNvbXBvbmVudCA9IHJlZ2lzdHJ5Ll9fX2NyZWF0ZUNvbXBvbmVudChcbiAgICAgICAgcmVuZGVyaW5nTG9naWMsXG4gICAgICAgIGlkLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgb3V0LFxuICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgY3VzdG9tRXZlbnRzLFxuICAgICAgICBvd25lckNvbXBvbmVudElkLFxuICAgICAgKTtcblxuICAgICAgLy8gVGhpcyBpcyB0aGUgZmluYWwgaW5wdXQgYWZ0ZXIgcnVubmluZyB0aGUgbGlmZWN5Y2xlIG1ldGhvZHMuXG4gICAgICAvLyBXZSB3aWxsIGJlIHBhc3NpbmcgdGhlIGlucHV0IHRvIHRoZSB0ZW1wbGF0ZSBmb3IgdGhlIGBpbnB1dGAgcGFyYW1cbiAgICAgIGlucHV0ID0gY29tcG9uZW50Ll9fX3VwZGF0ZWRJbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzUmVyZW5kZXIgJiZcbiAgICAgICAgICAoY29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW2lkXSkgJiZcbiAgICAgICAgICBjb21wb25lbnQuX19fdHlwZSAhPT0gdHlwZU5hbWVcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gRGVzdHJveSB0aGUgZXhpc3RpbmcgY29tcG9uZW50IHNpbmNlXG4gICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICBjb21wb25lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgaXNFeGlzdGluZyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNFeGlzdGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vIFdlIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgICBjb21wb25lbnQgPSByZWdpc3RyeS5fX19jcmVhdGVDb21wb25lbnQodHlwZU5hbWUsIGlkKTtcblxuICAgICAgICAgIGlmIChzaG91bGRBcHBseVNwbGl0TWl4aW5zID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzaG91bGRBcHBseVNwbGl0TWl4aW5zID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciByZW5kZXJpbmdMb2dpY1Byb3BzID1cbiAgICAgICAgICAgICAgdHlwZW9mIHJlbmRlcmluZ0xvZ2ljID09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgID8gcmVuZGVyaW5nTG9naWMucHJvdG90eXBlXG4gICAgICAgICAgICAgICAgOiByZW5kZXJpbmdMb2dpYztcblxuICAgICAgICAgICAgY29weVByb3BzKHJlbmRlcmluZ0xvZ2ljUHJvcHMsIGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGlzIGZsYWcgdG8gcHJldmVudCB0aGUgY29tcG9uZW50IGZyb20gYmVpbmcgcXVldWVkIGZvciB1cGRhdGVcbiAgICAgICAgLy8gYmFzZWQgb24gdGhlIG5ldyBpbnB1dC4gVGhlIGNvbXBvbmVudCBpcyBhYm91dCB0byBiZSByZXJlbmRlcmVkXG4gICAgICAgIC8vIHNvIHdlIGRvbid0IHdhbnQgdG8gcXVldWUgaXQgdXAgYXMgYSByZXN1bHQgb2YgY2FsbGluZyBgc2V0SW5wdXQoKWBcbiAgICAgICAgY29tcG9uZW50Ll9fX3VwZGF0ZVF1ZXVlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGN1c3RvbUV2ZW50cykge1xuICAgICAgICAgIGNvbXBvbmVudC5fX19zZXRDdXN0b21FdmVudHMoY3VzdG9tRXZlbnRzLCBvd25lckNvbXBvbmVudElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0V4aXN0aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgIGNvbXBvbmVudC5fX19lbWl0Q3JlYXRlKGlucHV0LCBvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5wdXQgPSBjb21wb25lbnQuX19fc2V0SW5wdXQoaW5wdXQsIG9uSW5wdXQsIG91dCk7XG5cbiAgICAgICAgaWYgKGlzRXhpc3RpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjb21wb25lbnQuX19faXNEaXJ0eSA9PT0gZmFsc2UgfHxcbiAgICAgICAgICAgIGNvbXBvbmVudC5zaG91bGRVcGRhdGUoaW5wdXQsIGNvbXBvbmVudC5fX19zdGF0ZSkgPT09IGZhbHNlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBXZSBwdXQgYSBwbGFjZWhvbGRlciBlbGVtZW50IGluIHRoZSBvdXRwdXQgc3RyZWFtIHRvIGVuc3VyZSB0aGF0IHRoZSBleGlzdGluZ1xuICAgICAgICAgICAgLy8gRE9NIG5vZGUgaXMgbWF0Y2hlZCB1cCBjb3JyZWN0bHkgd2hlbiB1c2luZyBtb3JwaGRvbS4gV2UgZmxhZyB0aGUgVkVsZW1lbnRcbiAgICAgICAgICAgIC8vIG5vZGUgdG8gdHJhY2sgdGhhdCBpdCBpcyBhIHByZXNlcnZlIG1hcmtlclxuICAgICAgICAgICAgb3V0Ll9fX3ByZXNlcnZlQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW2lkXSA9IHRydWU7XG4gICAgICAgICAgICBjb21wb25lbnQuX19fcmVzZXQoKTsgLy8gVGhlIGNvbXBvbmVudCBpcyBubyBsb25nZXIgZGlydHkgc28gcmVzZXQgaW50ZXJuYWwgZmxhZ3NcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50Ll9fX2dsb2JhbCA9IG91dC5nbG9iYWw7XG4gICAgICBjb21wb25lbnQuX19fZW1pdFJlbmRlcihvdXQpO1xuICAgIH1cblxuICAgIHZhciBjb21wb25lbnREZWYgPSBiZWdpbkNvbXBvbmVudChcbiAgICAgIGNvbXBvbmVudHNDb250ZXh0LFxuICAgICAgY29tcG9uZW50LFxuICAgICAga2V5LFxuICAgICAgb3duZXJDb21wb25lbnREZWYsXG4gICAgICBpc1NwbGl0LFxuICAgICAgaXNJbXBsaWNpdENvbXBvbmVudCxcbiAgICApO1xuXG4gICAgY29tcG9uZW50RGVmLl9fX2lzRXhpc3RpbmcgPSBpc0V4aXN0aW5nO1xuXG4gICAgLy8gUmVuZGVyIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhlIGNvbXBvbmVudCB1c2luZyB0aGUgZmluYWwgdGVtcGxhdGVcbiAgICAvLyBkYXRhIHRoYXQgd2UgY29uc3RydWN0ZWRcbiAgICB0ZW1wbGF0ZVJlbmRlckZ1bmMoXG4gICAgICBpbnB1dCxcbiAgICAgIG91dCxcbiAgICAgIGNvbXBvbmVudERlZixcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIGNvbXBvbmVudC5fX19yYXdTdGF0ZSxcbiAgICAgIG91dC5nbG9iYWwsXG4gICAgKTtcblxuICAgIGVuZENvbXBvbmVudChvdXQsIGNvbXBvbmVudERlZik7XG4gICAgY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmID0gcGFyZW50Q29tcG9uZW50RGVmO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVJlbmRlcmVyRnVuYztcblxuLy8gZXhwb3J0cyB1c2VkIGJ5IHRoZSBsZWdhY3kgcmVuZGVyZXJcbmNyZWF0ZVJlbmRlcmVyRnVuYy5fX19yZXNvbHZlQ29tcG9uZW50S2V5ID0gcmVzb2x2ZUNvbXBvbmVudEtleTtcbmNyZWF0ZVJlbmRlcmVyRnVuYy5fX190cmFja0FzeW5jQ29tcG9uZW50cyA9IHRyYWNrQXN5bmNDb21wb25lbnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB1cGRhdGVzU2NoZWR1bGVkID0gZmFsc2U7XG52YXIgYmF0Y2hTdGFjayA9IFtdOyAvLyBBIHN0YWNrIG9mIGJhdGNoZWQgdXBkYXRlc1xudmFyIHVuYmF0Y2hlZFF1ZXVlID0gW107IC8vIFVzZWQgZm9yIHNjaGVkdWxlZCBiYXRjaGVkIHVwZGF0ZXNcblxudmFyIHNldEltbWVkaWF0ZSA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvc2V0LWltbWVkaWF0ZVwiKS5fX19zZXRJbW1lZGlhdGU7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB3ZSBzY2hlZHVsZSB0aGUgdXBkYXRlIG9mIFwidW5iYXRjaGVkXCJcbiAqIHVwZGF0ZXMgdG8gY29tcG9uZW50cy5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlVW5iYXRjaGVkQ29tcG9uZW50cygpIHtcbiAgaWYgKHVuYmF0Y2hlZFF1ZXVlLmxlbmd0aCkge1xuICAgIHRyeSB7XG4gICAgICB1cGRhdGVDb21wb25lbnRzKHVuYmF0Y2hlZFF1ZXVlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gUmVzZXQgdGhlIGZsYWcgbm93IHRoYXQgdGhpcyBzY2hlZHVsZWQgYmF0Y2ggdXBkYXRlXG4gICAgICAvLyBpcyBjb21wbGV0ZSBzbyB0aGF0IHdlIGNhbiBsYXRlciBzY2hlZHVsZSBhbm90aGVyXG4gICAgICAvLyBiYXRjaGVkIHVwZGF0ZSBpZiBuZWVkZWRcbiAgICAgIHVwZGF0ZXNTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVVcGRhdGVzKCkge1xuICBpZiAodXBkYXRlc1NjaGVkdWxlZCkge1xuICAgIC8vIFdlIGhhdmUgYWxyZWFkeSBzY2hlZHVsZWQgYSBiYXRjaGVkIHVwZGF0ZSBmb3IgdGhlXG4gICAgLy8gbmV4dFRpY2sgc28gbm90aGluZyB0byBkb1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHVwZGF0ZXNTY2hlZHVsZWQgPSB0cnVlO1xuXG4gIHNldEltbWVkaWF0ZSh1cGRhdGVVbmJhdGNoZWRDb21wb25lbnRzKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50cyhxdWV1ZSkge1xuICAvLyBMb29wIG92ZXIgdGhlIGNvbXBvbmVudHMgaW4gdGhlIHF1ZXVlIGFuZCB1cGRhdGUgdGhlbS5cbiAgLy8gTk9URTogSXQgaXMgb2theSBpZiB0aGUgcXVldWUgZ3Jvd3MgZHVyaW5nIHRoZSBpdGVyYXRpb25cbiAgLy8gICAgICAgc2luY2Ugd2Ugd2lsbCBzdGlsbCBnZXQgdG8gdGhlbSBhdCB0aGUgZW5kXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY29tcG9uZW50ID0gcXVldWVbaV07XG4gICAgY29tcG9uZW50Ll9fX3VwZGF0ZSgpOyAvLyBEbyB0aGUgYWN0dWFsIGNvbXBvbmVudCB1cGRhdGVcbiAgfVxuXG4gIC8vIENsZWFyIG91dCB0aGUgcXVldWUgYnkgc2V0dGluZyB0aGUgbGVuZ3RoIHRvIHplcm9cbiAgcXVldWUubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gYmF0Y2hVcGRhdGUoZnVuYykge1xuICAvLyBJZiB0aGUgYmF0Y2hlZCB1cGRhdGUgc3RhY2sgaXMgZW1wdHkgdGhlbiB0aGlzXG4gIC8vIGlzIHRoZSBvdXRlciBiYXRjaGVkIHVwZGF0ZS4gQWZ0ZXIgdGhlIG91dGVyXG4gIC8vIGJhdGNoZWQgdXBkYXRlIGNvbXBsZXRlcyB3ZSBpbnZva2UgdGhlIFwiYWZ0ZXJVcGRhdGVcIlxuICAvLyBldmVudCBsaXN0ZW5lcnMuXG4gIHZhciBiYXRjaCA9IFtdO1xuXG4gIGJhdGNoU3RhY2sucHVzaChiYXRjaCk7XG5cbiAgdHJ5IHtcbiAgICBmdW5jKCk7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFVwZGF0ZSBhbGwgb2YgdGhlIGNvbXBvbmVudHMgdGhhdCB3aGVyZSBxdWV1ZWQgdXBcbiAgICAgIC8vIGluIHRoaXMgYmF0Y2ggKGlmIGFueSlcbiAgICAgIHVwZGF0ZUNvbXBvbmVudHMoYmF0Y2gpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIGNvbXBsZXRlZCB0aGUgdXBkYXRlIG9mIGFsbCB0aGUgY29tcG9uZW50c1xuICAgICAgLy8gaW4gdGhpcyBiYXRjaCB3ZSBuZWVkIHRvIHJlbW92ZSBpdCBvZmYgdGhlIHRvcCBvZiB0aGUgc3RhY2tcbiAgICAgIGJhdGNoU3RhY2subGVuZ3RoLS07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1ZXVlQ29tcG9uZW50VXBkYXRlKGNvbXBvbmVudCkge1xuICB2YXIgYmF0Y2hTdGFja0xlbiA9IGJhdGNoU3RhY2subGVuZ3RoO1xuXG4gIGlmIChiYXRjaFN0YWNrTGVuKSB7XG4gICAgLy8gV2hlbiBhIGJhdGNoIHVwZGF0ZSBpcyBzdGFydGVkIHdlIHB1c2ggYSBuZXcgYmF0Y2ggb24gdG8gYSBzdGFjay5cbiAgICAvLyBJZiB0aGUgc3RhY2sgaGFzIGEgbm9uLXplcm8gbGVuZ3RoIHRoZW4gd2Uga25vdyB0aGF0IGEgYmF0Y2ggaGFzXG4gICAgLy8gYmVlbiBzdGFydGVkIHNvIHdlIGNhbiBqdXN0IHF1ZXVlIHRoZSBjb21wb25lbnQgb24gdGhlIHRvcCBiYXRjaC4gV2hlblxuICAgIC8vIHRoZSBiYXRjaCBpcyBlbmRlZCB0aGlzIGNvbXBvbmVudCB3aWxsIGJlIHVwZGF0ZWQuXG4gICAgYmF0Y2hTdGFja1tiYXRjaFN0YWNrTGVuIC0gMV0ucHVzaChjb21wb25lbnQpO1xuICB9IGVsc2Uge1xuICAgIC8vIFdlIGFyZSBub3Qgd2l0aGluIGEgYmF0Y2hlZCB1cGRhdGUuIFdlIG5lZWQgdG8gc2NoZWR1bGUgYSBiYXRjaCB1cGRhdGVcbiAgICAvLyBmb3IgdGhlIG5leHRUaWNrIChpZiB0aGF0IGhhc24ndCBiZWVuIGRvbmUgYWxyZWFkeSkgYW5kIHdlIHdpbGxcbiAgICAvLyBhZGQgdGhlIGNvbXBvbmVudCB0byB0aGUgdW5iYXRjaGVkIHF1ZXVlXG4gICAgc2NoZWR1bGVVcGRhdGVzKCk7XG4gICAgdW5iYXRjaGVkUXVldWUucHVzaChjb21wb25lbnQpO1xuICB9XG59XG5cbmV4cG9ydHMuX19fcXVldWVDb21wb25lbnRVcGRhdGUgPSBxdWV1ZUNvbXBvbmVudFVwZGF0ZTtcbmV4cG9ydHMuX19fYmF0Y2hVcGRhdGUgPSBiYXRjaFVwZGF0ZTtcbiIsInZhciBhY3R1YWxDcmVhdGVPdXQ7XG5cbmZ1bmN0aW9uIHNldENyZWF0ZU91dChjcmVhdGVPdXRGdW5jKSB7XG4gIGFjdHVhbENyZWF0ZU91dCA9IGNyZWF0ZU91dEZ1bmM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU91dChnbG9iYWxEYXRhKSB7XG4gIHJldHVybiBhY3R1YWxDcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG59XG5cbmNyZWF0ZU91dC5fX19zZXRDcmVhdGVPdXQgPSBzZXRDcmVhdGVPdXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlT3V0O1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZSA9IGNvbXBvbmVudHNVdGlsLl9fX2Rlc3Ryb3lDb21wb25lbnRGb3JOb2RlO1xudmFyIGRlc3Ryb3lOb2RlUmVjdXJzaXZlID0gY29tcG9uZW50c1V0aWwuX19fZGVzdHJveU5vZGVSZWN1cnNpdmU7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuL3Zkb20vbW9ycGhkb20vaGVscGVyc1wiKTtcblxudmFyIGluc2VydEJlZm9yZSA9IGhlbHBlcnMuX19faW5zZXJ0QmVmb3JlO1xudmFyIGluc2VydEFmdGVyID0gaGVscGVycy5fX19pbnNlcnRBZnRlcjtcbnZhciByZW1vdmVDaGlsZCA9IGhlbHBlcnMuX19fcmVtb3ZlQ2hpbGQ7XG5cbmZ1bmN0aW9uIHJlc29sdmVFbChlbCkge1xuICBpZiAodHlwZW9mIGVsID09IFwic3RyaW5nXCIpIHtcbiAgICB2YXIgZWxJZCA9IGVsO1xuICAgIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxJZCk7XG4gICAgaWYgKCFlbCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJOb3QgZm91bmQ6IFwiICsgZWxJZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gYmVmb3JlUmVtb3ZlKHJlZmVyZW5jZUVsKSB7XG4gIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKHJlZmVyZW5jZUVsKTtcbiAgZGVzdHJveUNvbXBvbmVudEZvck5vZGUocmVmZXJlbmNlRWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIGdldEVsLCBhZnRlckluc2VydCkge1xuICBleHRlbmQodGFyZ2V0LCB7XG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCBudWxsLCByZWZlcmVuY2VFbCk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgcHJlcGVuZFRvOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICAgIGluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlRWwuZmlyc3RDaGlsZCB8fCBudWxsLCByZWZlcmVuY2VFbCk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgcmVwbGFjZTogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBiZWZvcmVSZW1vdmUocmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VFbCwgcmVmZXJlbmNlRWwucGFyZW50Tm9kZSk7XG4gICAgICByZW1vdmVDaGlsZChyZWZlcmVuY2VFbCk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgcmVwbGFjZUNoaWxkcmVuT2Y6IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuXG4gICAgICB2YXIgY3VyQ2hpbGQgPSByZWZlcmVuY2VFbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nOyAvLyBKdXN0IGluIGNhc2UgdGhlIERPTSBjaGFuZ2VzIHdoaWxlIHJlbW92aW5nXG4gICAgICAgIGJlZm9yZVJlbW92ZShjdXJDaGlsZCk7XG4gICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIHJlZmVyZW5jZUVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIG51bGwsIHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VFbCwgcmVmZXJlbmNlRWwucGFyZW50Tm9kZSk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QWZ0ZXIoZWwsIHJlZmVyZW5jZUVsLCByZWZlcmVuY2VFbC5wYXJlbnROb2RlKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjYW1lbFRvRGFzaExvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG52YXIgZGFzaFRvQ2FtZWxMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAqIEhlbHBlciBmb3IgY29udmVydGluZyBjYW1lbENhc2UgdG8gZGFzaC1jYXNlLlxuICovXG5leHBvcnRzLl9fX2NhbWVsVG9EYXNoQ2FzZSA9IGZ1bmN0aW9uIGNhbWVsVG9EYXNoQ2FzZShuYW1lKSB7XG4gIHZhciBuYW1lRGFzaGVkID0gY2FtZWxUb0Rhc2hMb29rdXBbbmFtZV07XG4gIGlmICghbmFtZURhc2hlZCkge1xuICAgIG5hbWVEYXNoZWQgPSBjYW1lbFRvRGFzaExvb2t1cFtuYW1lXSA9IG5hbWVcbiAgICAgIC5yZXBsYWNlKC8oW0EtWl0pL2csIFwiLSQxXCIpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChuYW1lRGFzaGVkICE9PSBuYW1lKSB7XG4gICAgICBkYXNoVG9DYW1lbExvb2t1cFtuYW1lRGFzaGVkXSA9IG5hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWVEYXNoZWQ7XG59O1xuXG4vKipcbiAqIEhlbHBlciBmb3IgY29udmVydGluZyBkYXNoLWNhc2UgdG8gY2FtZWxDYXNlLlxuICovXG5leHBvcnRzLl9fX2Rhc2hUb0NhbWVsQ2FzZSA9IGZ1bmN0aW9uIGRhc2hUb0NhbWVsQ2FzZShuYW1lKSB7XG4gIHZhciBuYW1lQ2FtZWwgPSBkYXNoVG9DYW1lbExvb2t1cFtuYW1lXTtcbiAgaWYgKCFuYW1lQ2FtZWwpIHtcbiAgICBuYW1lQ2FtZWwgPSBkYXNoVG9DYW1lbExvb2t1cFtuYW1lXSA9IG5hbWUucmVwbGFjZShcbiAgICAgIC8tKFthLXpdKS9nLFxuICAgICAgbWF0Y2hUb1VwcGVyQ2FzZSxcbiAgICApO1xuXG4gICAgaWYgKG5hbWVDYW1lbCAhPT0gbmFtZSkge1xuICAgICAgY2FtZWxUb0Rhc2hMb29rdXBbbmFtZUNhbWVsXSA9IG5hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWVDYW1lbDtcbn07XG5cbmZ1bmN0aW9uIG1hdGNoVG9VcHBlckNhc2UoXywgY2hhcikge1xuICByZXR1cm4gY2hhci50b1VwcGVyQ2FzZSgpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xhc3NIZWxwZXIoYXJnKSB7XG4gIHN3aXRjaCAodHlwZW9mIGFyZykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBhcmcgfHwgdW5kZWZpbmVkO1xuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgICAgdmFyIHNlcCA9IFwiXCI7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNsYXNzSGVscGVyKGFyZ1tpXSk7XG4gICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc2VwICsgdmFsdWU7XG4gICAgICAgICAgICBzZXAgPSBcIiBcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhcmcpIHtcbiAgICAgICAgICBpZiAoYXJnW2tleV0pIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzZXAgKyBrZXk7XG4gICAgICAgICAgICBzZXAgPSBcIiBcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdCB8fCB1bmRlZmluZWQ7XG4gIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBIZWxwZXIgdG8gcmVuZGVyIGEgY3VzdG9tIHRhZ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlbmRlclRhZ0hlbHBlcihcbiAgaGFuZGxlcixcbiAgaW5wdXQsXG4gIG91dCxcbiAgY29tcG9uZW50RGVmLFxuICBrZXksXG4gIGN1c3RvbUV2ZW50cyxcbikge1xuICBvdXQuYyhjb21wb25lbnREZWYsIGtleSwgY3VzdG9tRXZlbnRzKTtcbiAgKGhhbmRsZXIuXyB8fCAoaGFuZGxlci5fID0gaGFuZGxlci5yZW5kZXIgfHwgaGFuZGxlci5yZW5kZXJlciB8fCBoYW5kbGVyKSkoXG4gICAgaW5wdXQsXG4gICAgb3V0LFxuICApO1xuICBvdXQuX19fYXNzaWduZWRDb21wb25lbnREZWYgPSBudWxsO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY2hhbmdlQ2FzZSA9IHJlcXVpcmUoXCIuL19jaGFuZ2UtY2FzZVwiKTtcblxuLyoqXG4gKiBIZWxwZXIgZm9yIGdlbmVyYXRpbmcgdGhlIHN0cmluZyBmb3IgYSBzdHlsZSBhdHRyaWJ1dGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHlsZUhlbHBlcihzdHlsZSkge1xuICBpZiAoIXN0eWxlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3R5bGU7XG5cbiAgaWYgKHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICB2YXIgc3R5bGVzID0gXCJcIjtcbiAgICB2YXIgc2VwID0gXCJcIjtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHN0eWxlKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0eWxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBuZXh0ID0gc3R5bGVIZWxwZXIoc3R5bGVbaV0pO1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHN0eWxlcyArPSBzZXAgKyBuZXh0O1xuICAgICAgICAgIHNlcCA9IFwiO1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHN0eWxlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHN0eWxlW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICYmIHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSArPSBcInB4XCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3R5bGVzICs9IHNlcCArIGNoYW5nZUNhc2UuX19fY2FtZWxUb0Rhc2hDYXNlKG5hbWUpICsgXCI6XCIgKyB2YWx1ZTtcbiAgICAgICAgICBzZXAgPSBcIjtcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXMgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHN0eWxlO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcbnZhciBzZXRJbW1lZGlhdGUgPSByZXF1aXJlKFwiQGludGVybmFsL3NldC1pbW1lZGlhdGVcIikuX19fc2V0SW1tZWRpYXRlO1xudmFyIGRlZmF1bHRDcmVhdGVPdXQgPSByZXF1aXJlKFwiLi9jcmVhdGVPdXRcIik7XG5cbmZ1bmN0aW9uIHNhZmVSZW5kZXIocmVuZGVyRnVuYywgZmluYWxEYXRhLCBmaW5hbE91dCwgc2hvdWxkRW5kKSB7XG4gIHRyeSB7XG4gICAgcmVuZGVyRnVuYyhmaW5hbERhdGEsIGZpbmFsT3V0KTtcblxuICAgIGlmIChzaG91bGRFbmQpIHtcbiAgICAgIGZpbmFsT3V0LmVuZCgpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdmFyIGFjdHVhbEVuZCA9IGZpbmFsT3V0LmVuZDtcbiAgICBmaW5hbE91dC5lbmQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICBmaW5hbE91dC5lbmQgPSBhY3R1YWxFbmQ7XG4gICAgICBmaW5hbE91dC5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBmaW5hbE91dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCByZW5kZXJlcikge1xuICB2YXIgcmVuZGVyRnVuYyA9XG4gICAgcmVuZGVyZXIgJiYgKHJlbmRlcmVyLnJlbmRlcmVyIHx8IHJlbmRlcmVyLnJlbmRlciB8fCByZW5kZXJlcik7XG4gIHZhciBjcmVhdGVPdXQgPSB0YXJnZXQuY3JlYXRlT3V0IHx8IHJlbmRlcmVyLmNyZWF0ZU91dCB8fCBkZWZhdWx0Q3JlYXRlT3V0O1xuXG4gIHJldHVybiBleHRlbmQodGFyZ2V0LCB7XG4gICAgXzogcmVuZGVyRnVuYyxcbiAgICBjcmVhdGVPdXQ6IGNyZWF0ZU91dCxcblxuICAgIHJlbmRlclRvU3RyaW5nOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBsb2NhbERhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgdmFyIHJlbmRlciA9IHJlbmRlckZ1bmMgfHwgdGhpcy5fO1xuICAgICAgdmFyIGdsb2JhbERhdGEgPSBsb2NhbERhdGEuJGdsb2JhbDtcbiAgICAgIHZhciBvdXQgPSBjcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG5cbiAgICAgIG91dC5nbG9iYWwudGVtcGxhdGUgPSB0aGlzO1xuXG4gICAgICBpZiAoZ2xvYmFsRGF0YSkge1xuICAgICAgICBsb2NhbERhdGEuJGdsb2JhbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIG91dFxuICAgICAgICAgIC5vbihcImZpbmlzaFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBvdXQudG9TdHJpbmcoKSwgb3V0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbmNlKFwiZXJyb3JcIiwgY2FsbGJhY2spO1xuXG4gICAgICAgIHJldHVybiBzYWZlUmVuZGVyKHJlbmRlciwgbG9jYWxEYXRhLCBvdXQsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnN5bmMoKTtcbiAgICAgICAgcmVuZGVyKGxvY2FsRGF0YSwgb3V0KTtcbiAgICAgICAgcmV0dXJuIG91dC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXJTeW5jOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGxvY2FsRGF0YSA9IGRhdGEgfHwge307XG4gICAgICB2YXIgcmVuZGVyID0gcmVuZGVyRnVuYyB8fCB0aGlzLl87XG4gICAgICB2YXIgZ2xvYmFsRGF0YSA9IGxvY2FsRGF0YS4kZ2xvYmFsO1xuICAgICAgdmFyIG91dCA9IGNyZWF0ZU91dChnbG9iYWxEYXRhKTtcbiAgICAgIG91dC5zeW5jKCk7XG5cbiAgICAgIG91dC5nbG9iYWwudGVtcGxhdGUgPSB0aGlzO1xuXG4gICAgICBpZiAoZ2xvYmFsRGF0YSkge1xuICAgICAgICBsb2NhbERhdGEuJGdsb2JhbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKGxvY2FsRGF0YSwgb3V0KTtcbiAgICAgIHJldHVybiBvdXQuX19fZ2V0UmVzdWx0KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgYSB0ZW1wbGF0ZSB0byBub2RlcyBhbmQgaW5zZXJ0cyB0aGVtIGludG8gdGhlIERPTSByZWxhdGl2ZVxuICAgICAqIHRvIHRoZSBwcm92aWRlZCByZWZlcmVuY2UgYmFzZWQgb24gdGhlIG9wdGlvbmFsIHBvc2l0aW9uIHBhcmFtZXRlci5cbiAgICAgKlxuICAgICAqIFN1cHBvcnRlZCBzaWduYXR1cmVzOlxuICAgICAqXG4gICAgICogbW91bnQoZGF0YSwgcmVmZXJlbmNlKVxuICAgICAqIG1vdW50KGRhdGEsIHJlZmVyZW5jZSwgcG9zaXRpb24pXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgVGhlIHZpZXcgbW9kZWwgZGF0YSBmb3IgdGhlIHRlbXBsYXRlXG4gICAgICogQHBhcmFtICB7Tm9kZX0gcmVmZXJlbmNlIERPTSBub2RlIHRvIGluc2VydCB0aGUgcmVuZGVyZWQgbm9kZShzKSByZWxhdGl2ZSB0b1xuICAgICAqIEBwYXJhbSAge3N0cmluZ30gW3Bvc2l0aW9uXSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBgcmVmZXJlbmNlYDsgbXVzdCBtYXRjaCAoY2FzZS1pbnNlbnNpdGl2ZWx5KSBvbmUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdzOlxuICAgICAqICAnYmVmb3JlYmVnaW4nOiBCZWZvcmUgdGhlIHRhcmdldEVsZW1lbnQgaXRzZWxmLlxuICAgICAqICAnYWZ0ZXJiZWdpbic6IEp1c3QgaW5zaWRlIHRoZSB0YXJnZXRFbGVtZW50LCBiZWZvcmUgaXRzIGZpcnN0IGNoaWxkLlxuICAgICAqICAnYmVmb3JlZW5kJzogSnVzdCBpbnNpZGUgdGhlIHRhcmdldEVsZW1lbnQsIGFmdGVyIGl0cyBsYXN0IGNoaWxkLlxuICAgICAqICAnYWZ0ZXJlbmQnOiBBZnRlciB0aGUgdGFyZ2V0RWxlbWVudCBpdHNlbGYuXG4gICAgICogQHJldHVybiB7VGVtcGxhdGVJbnN0YW5jZX0gT2JqZWN0IHdpdGggYHVwZGF0ZWAgYW5kIGBkaXNwb3NlYCBtZXRob2RzXG4gICAgICovXG4gICAgbW91bnQ6IGZ1bmN0aW9uIChkYXRhLCByZWZlcmVuY2UsIHBvc2l0aW9uKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJlbmRlclN5bmMoZGF0YSk7XG5cbiAgICAgIHN3aXRjaCAocG9zaXRpb24pIHtcbiAgICAgICAgY2FzZSBcImFmdGVyYmVnaW5cIjpcbiAgICAgICAgICByZXN1bHQucHJlcGVuZFRvKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJhZnRlcmVuZFwiOlxuICAgICAgICAgIHJlc3VsdC5pbnNlcnRBZnRlcihyZWZlcmVuY2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYmVmb3JlYmVnaW5cIjpcbiAgICAgICAgICByZXN1bHQuaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmVzdWx0LmFwcGVuZFRvKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHJlc3VsdC5nZXRDb21wb25lbnQoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXBkYXRlKGlucHV0KSB7XG4gICAgICAgICAgY29tcG9uZW50LmlucHV0ID0gaW5wdXQ7XG4gICAgICAgICAgY29tcG9uZW50LnVwZGF0ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgIGNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIGEgdGVtcGxhdGUgdG8gZWl0aGVyIGEgc3RyZWFtIChpZiB0aGUgbGFzdFxuICAgICAqIGFyZ3VtZW50IGlzIGEgU3RyZWFtIGluc3RhbmNlKSBvclxuICAgICAqIHByb3ZpZGVzIHRoZSBvdXRwdXQgdG8gYSBjYWxsYmFjayBmdW5jdGlvbiAoaWYgdGhlIGxhc3RcbiAgICAgKiBhcmd1bWVudCBpcyBhIEZ1bmN0aW9uKS5cbiAgICAgKlxuICAgICAqIFN1cHBvcnRlZCBzaWduYXR1cmVzOlxuICAgICAqXG4gICAgICogcmVuZGVyKGRhdGEpXG4gICAgICogcmVuZGVyKGRhdGEsIG91dClcbiAgICAgKiByZW5kZXIoZGF0YSwgc3RyZWFtKVxuICAgICAqIHJlbmRlcihkYXRhLCBjYWxsYmFjaylcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBUaGUgdmlldyBtb2RlbCBkYXRhIGZvciB0aGUgdGVtcGxhdGVcbiAgICAgKiBAcGFyYW0gIHtBc3luY1N0cmVhbS9Bc3luY1ZET01CdWlsZGVyfSBvdXQgQSBTdHJlYW0sIGFuIEFzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXIgaW5zdGFuY2UsIG9yIGEgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJuIHtBc3luY1N0cmVhbS9Bc3luY1ZET01CdWlsZGVyfSBSZXR1cm5zIHRoZSBBc3luY1N0cmVhbS9Bc3luY1ZET01CdWlsZGVyIGluc3RhbmNlIHRoYXQgdGhlIHRlbXBsYXRlIGlzIHJlbmRlcmVkIHRvXG4gICAgICovXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoZGF0YSwgb3V0KSB7XG4gICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICB2YXIgZmluYWxPdXQ7XG4gICAgICB2YXIgZmluYWxEYXRhO1xuICAgICAgdmFyIGdsb2JhbERhdGE7XG4gICAgICB2YXIgcmVuZGVyID0gcmVuZGVyRnVuYyB8fCB0aGlzLl87XG4gICAgICB2YXIgc2hvdWxkQnVmZmVyID0gdGhpcy5fX19zaG91bGRCdWZmZXI7XG4gICAgICB2YXIgc2hvdWxkRW5kID0gdHJ1ZTtcblxuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZmluYWxEYXRhID0gZGF0YTtcbiAgICAgICAgaWYgKChnbG9iYWxEYXRhID0gZGF0YS4kZ2xvYmFsKSkge1xuICAgICAgICAgIGZpbmFsRGF0YS4kZ2xvYmFsID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaW5hbERhdGEgPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYgKG91dCAmJiBvdXQuX19faXNPdXQpIHtcbiAgICAgICAgZmluYWxPdXQgPSBvdXQ7XG4gICAgICAgIHNob3VsZEVuZCA9IGZhbHNlO1xuICAgICAgICBleHRlbmQob3V0Lmdsb2JhbCwgZ2xvYmFsRGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvdXQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGZpbmFsT3V0ID0gY3JlYXRlT3V0KGdsb2JhbERhdGEpO1xuICAgICAgICBjYWxsYmFjayA9IG91dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbmFsT3V0ID0gY3JlYXRlT3V0KFxuICAgICAgICAgIGdsb2JhbERhdGEsIC8vIGdsb2JhbFxuICAgICAgICAgIG91dCwgLy8gd3JpdGVyKEFzeW5jU3RyZWFtKSBvciBwYXJlbnROb2RlKEFzeW5jVkRPTUJ1aWxkZXIpXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBwYXJlbnRPdXRcbiAgICAgICAgICBzaG91bGRCdWZmZXIsIC8vIGlnbm9yZWQgYnkgQXN5bmNWRE9NQnVpbGRlclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgZmluYWxPdXRcbiAgICAgICAgICAub24oXCJmaW5pc2hcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZmluYWxPdXQuX19fZ2V0UmVzdWx0KCksIGZpbmFsT3V0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbmNlKFwiZXJyb3JcIiwgY2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICBnbG9iYWxEYXRhID0gZmluYWxPdXQuZ2xvYmFsO1xuXG4gICAgICBnbG9iYWxEYXRhLnRlbXBsYXRlID0gZ2xvYmFsRGF0YS50ZW1wbGF0ZSB8fCB0aGlzO1xuXG4gICAgICByZXR1cm4gc2FmZVJlbmRlcihyZW5kZXIsIGZpbmFsRGF0YSwgZmluYWxPdXQsIHNob3VsZEVuZCk7XG4gICAgfSxcbiAgfSk7XG59O1xuIiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHMtbGlnaHRcIik7XG52YXIgUmVuZGVyUmVzdWx0ID0gcmVxdWlyZShcIi4uL1JlbmRlclJlc3VsdFwiKTtcbnZhciBhdHRyc0hlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvYXR0cnNcIik7XG52YXIgbW9ycGhkb20gPSByZXF1aXJlKFwiLi9tb3JwaGRvbVwiKTtcbnZhciB2ZG9tID0gcmVxdWlyZShcIi4vdmRvbVwiKTtcbnZhciBWRWxlbWVudCA9IHZkb20uX19fVkVsZW1lbnQ7XG52YXIgVkRvY3VtZW50RnJhZ21lbnQgPSB2ZG9tLl9fX1ZEb2N1bWVudEZyYWdtZW50O1xudmFyIFZUZXh0ID0gdmRvbS5fX19WVGV4dDtcbnZhciBWQ29tcG9uZW50ID0gdmRvbS5fX19WQ29tcG9uZW50O1xudmFyIFZGcmFnbWVudCA9IHZkb20uX19fVkZyYWdtZW50O1xudmFyIHZpcnR1YWxpemVIVE1MID0gdmRvbS5fX192aXJ0dWFsaXplSFRNTDtcblxudmFyIEVWRU5UX1VQREFURSA9IFwidXBkYXRlXCI7XG52YXIgRVZFTlRfRklOSVNIID0gXCJmaW5pc2hcIjtcblxuZnVuY3Rpb24gU3RhdGUodHJlZSkge1xuICB0aGlzLl9fX2V2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgdGhpcy5fX190cmVlID0gdHJlZTtcbiAgdGhpcy5fX19maW5pc2hlZCA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBBc3luY1ZET01CdWlsZGVyKGdsb2JhbERhdGEsIHBhcmVudE5vZGUsIHBhcmVudE91dCkge1xuICBpZiAoIXBhcmVudE5vZGUpIHtcbiAgICBwYXJlbnROb2RlID0gbmV3IFZEb2N1bWVudEZyYWdtZW50KCk7XG4gIH1cblxuICB2YXIgc3RhdGU7XG5cbiAgaWYgKHBhcmVudE91dCkge1xuICAgIHN0YXRlID0gcGFyZW50T3V0Ll9fX3N0YXRlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlID0gbmV3IFN0YXRlKHBhcmVudE5vZGUpO1xuICB9XG5cbiAgdGhpcy5fX19yZW1haW5pbmcgPSAxO1xuICB0aGlzLl9fX2xhc3RDb3VudCA9IDA7XG4gIHRoaXMuX19fbGFzdCA9IG51bGw7XG4gIHRoaXMuX19fcGFyZW50T3V0ID0gcGFyZW50T3V0O1xuXG4gIHRoaXMuZGF0YSA9IHt9O1xuICB0aGlzLl9fX3N0YXRlID0gc3RhdGU7XG4gIHRoaXMuX19fcGFyZW50ID0gcGFyZW50Tm9kZTtcbiAgdGhpcy5nbG9iYWwgPSBnbG9iYWxEYXRhIHx8IHt9O1xuICB0aGlzLl9fX3N0YWNrID0gW3BhcmVudE5vZGVdO1xuICB0aGlzLl9fX3N5bmMgPSBmYWxzZTtcbiAgdGhpcy5fX192bm9kZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fX19jb21wb25lbnRzID0gbnVsbDtcblxuICB0aGlzLl9fX2Fzc2lnbmVkQ29tcG9uZW50RGVmID0gbnVsbDtcbiAgdGhpcy5fX19hc3NpZ25lZEtleSA9IG51bGw7XG4gIHRoaXMuX19fYXNzaWduZWRDdXN0b21FdmVudHMgPSBudWxsO1xufVxuXG52YXIgcHJvdG8gPSAoQXN5bmNWRE9NQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gIF9fX2lzT3V0OiB0cnVlLFxuICBfX19ob3N0OiB0eXBlb2YgZG9jdW1lbnQgPT09IFwib2JqZWN0XCIgJiYgZG9jdW1lbnQsXG5cbiAgYmM6IGZ1bmN0aW9uIChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQpIHtcbiAgICB2YXIgdkNvbXBvbmVudCA9IG5ldyBWQ29tcG9uZW50KGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCk7XG4gICAgcmV0dXJuIHRoaXMuX19fYmVnaW5Ob2RlKHZDb21wb25lbnQsIDAsIHRydWUpO1xuICB9LFxuXG4gIF9fX3ByZXNlcnZlQ29tcG9uZW50OiBmdW5jdGlvbiAoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50KSB7XG4gICAgdmFyIHZDb21wb25lbnQgPSBuZXcgVkNvbXBvbmVudChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQsIHRydWUpO1xuICAgIHRoaXMuX19fYmVnaW5Ob2RlKHZDb21wb25lbnQsIDApO1xuICB9LFxuXG4gIF9fX2JlZ2luTm9kZTogZnVuY3Rpb24gKGNoaWxkLCBjaGlsZENvdW50LCBwdXNoVG9TdGFjaykge1xuICAgIHRoaXMuX19fcGFyZW50Ll9fX2FwcGVuZENoaWxkKGNoaWxkKTtcbiAgICBpZiAocHVzaFRvU3RhY2sgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuX19fc3RhY2sucHVzaChjaGlsZCk7XG4gICAgICB0aGlzLl9fX3BhcmVudCA9IGNoaWxkO1xuICAgIH1cbiAgICByZXR1cm4gY2hpbGRDb3VudCA9PT0gMCA/IHRoaXMgOiBjaGlsZDtcbiAgfSxcblxuICBlbGVtZW50OiBmdW5jdGlvbiAodGFnTmFtZSwgYXR0cnMsIGtleSwgY29tcG9uZW50LCBjaGlsZENvdW50LCBmbGFncywgcHJvcHMpIHtcbiAgICB2YXIgZWxlbWVudCA9IG5ldyBWRWxlbWVudChcbiAgICAgIHRhZ05hbWUsXG4gICAgICBhdHRycyxcbiAgICAgIGtleSxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIGNoaWxkQ291bnQsXG4gICAgICBmbGFncyxcbiAgICAgIHByb3BzLFxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuX19fYmVnaW5Ob2RlKGVsZW1lbnQsIGNoaWxkQ291bnQpO1xuICB9LFxuXG4gIF9fX2VsZW1lbnREeW5hbWljOiBmdW5jdGlvbiAodGFnTmFtZSwgYXR0cnMsIGtleSwgY29tcG9uZW50RGVmLCBwcm9wcykge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQoXG4gICAgICB0YWdOYW1lLFxuICAgICAgYXR0cnNIZWxwZXIoYXR0cnMpLFxuICAgICAga2V5LFxuICAgICAgY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudCxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgfSxcblxuICBuOiBmdW5jdGlvbiAobm9kZSwgY29tcG9uZW50KSB7XG4gICAgLy8gTk9URTogV2UgZG8gYSBzaGFsbG93IGNsb25lIHNpbmNlIHdlIGFzc3VtZSB0aGUgbm9kZSBpcyBiZWluZyByZXVzZWRcbiAgICAvLyAgICAgICBhbmQgYSBub2RlIGNhbiBvbmx5IGhhdmUgb25lIHBhcmVudCBub2RlLlxuICAgIHZhciBjbG9uZSA9IG5vZGUuX19fY2xvbmVOb2RlKCk7XG4gICAgdGhpcy5ub2RlKGNsb25lKTtcbiAgICBjbG9uZS5fX19vd25lckNvbXBvbmVudCA9IGNvbXBvbmVudDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdGV4dDogZnVuY3Rpb24gKHRleHQsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgdGV4dDtcblxuICAgIGlmICh0eXBlICE9IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmICh0ZXh0LnRvSFRNTCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmgodGV4dC50b0hUTUwoKSwgb3duZXJDb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRleHQgPSB0ZXh0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kQ2hpbGQobmV3IFZUZXh0KHRleHQsIG93bmVyQ29tcG9uZW50KSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgaHRtbDogZnVuY3Rpb24gKGh0bWwsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgaWYgKGh0bWwgIT0gbnVsbCkge1xuICAgICAgdmFyIHZkb21Ob2RlID0gdmlydHVhbGl6ZUhUTUwoaHRtbCwgb3duZXJDb21wb25lbnQpO1xuICAgICAgdGhpcy5ub2RlKHZkb21Ob2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBiZWdpbkVsZW1lbnQ6IGZ1bmN0aW9uIChcbiAgICB0YWdOYW1lLFxuICAgIGF0dHJzLFxuICAgIGtleSxcbiAgICBjb21wb25lbnQsXG4gICAgY2hpbGRDb3VudCxcbiAgICBmbGFncyxcbiAgICBwcm9wcyxcbiAgKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBuZXcgVkVsZW1lbnQoXG4gICAgICB0YWdOYW1lLFxuICAgICAgYXR0cnMsXG4gICAgICBrZXksXG4gICAgICBjb21wb25lbnQsXG4gICAgICBjaGlsZENvdW50LFxuICAgICAgZmxhZ3MsXG4gICAgICBwcm9wcyxcbiAgICApO1xuICAgIHRoaXMuX19fYmVnaW5Ob2RlKGVsZW1lbnQsIGNoaWxkQ291bnQsIHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9fX2JlZ2luRWxlbWVudER5bmFtaWM6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBjb21wb25lbnREZWYsIHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuYmVnaW5FbGVtZW50KFxuICAgICAgdGFnTmFtZSxcbiAgICAgIGF0dHJzSGVscGVyKGF0dHJzKSxcbiAgICAgIGtleSxcbiAgICAgIGNvbXBvbmVudERlZi5fX19jb21wb25lbnQsXG4gICAgICAwLFxuICAgICAgMCxcbiAgICAgIHByb3BzLFxuICAgICk7XG4gIH0sXG5cbiAgYmY6IGZ1bmN0aW9uIChrZXksIGNvbXBvbmVudCwgcHJlc2VydmUpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBuZXcgVkZyYWdtZW50KGtleSwgY29tcG9uZW50LCBwcmVzZXJ2ZSk7XG4gICAgdGhpcy5fX19iZWdpbk5vZGUoZnJhZ21lbnQsIG51bGwsIHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGVmOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmRFbGVtZW50KCk7XG4gIH0sXG5cbiAgZW5kRWxlbWVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGFjayA9IHRoaXMuX19fc3RhY2s7XG4gICAgc3RhY2sucG9wKCk7XG4gICAgdGhpcy5fX19wYXJlbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgfSxcblxuICBlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9fX3BhcmVudCA9IHVuZGVmaW5lZDtcblxuICAgIHZhciByZW1haW5pbmcgPSAtLXRoaXMuX19fcmVtYWluaW5nO1xuICAgIHZhciBwYXJlbnRPdXQgPSB0aGlzLl9fX3BhcmVudE91dDtcblxuICAgIGlmIChyZW1haW5pbmcgPT09IDApIHtcbiAgICAgIGlmIChwYXJlbnRPdXQpIHtcbiAgICAgICAgcGFyZW50T3V0Ll9fX2hhbmRsZUNoaWxkRG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX19kb0ZpbmlzaCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVtYWluaW5nIC0gdGhpcy5fX19sYXN0Q291bnQgPT09IDApIHtcbiAgICAgIHRoaXMuX19fZW1pdExhc3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfX19oYW5kbGVDaGlsZERvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVtYWluaW5nID0gLS10aGlzLl9fX3JlbWFpbmluZztcblxuICAgIGlmIChyZW1haW5pbmcgPT09IDApIHtcbiAgICAgIHZhciBwYXJlbnRPdXQgPSB0aGlzLl9fX3BhcmVudE91dDtcbiAgICAgIGlmIChwYXJlbnRPdXQpIHtcbiAgICAgICAgcGFyZW50T3V0Ll9fX2hhbmRsZUNoaWxkRG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX19kb0ZpbmlzaCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVtYWluaW5nIC0gdGhpcy5fX19sYXN0Q291bnQgPT09IDApIHtcbiAgICAgIHRoaXMuX19fZW1pdExhc3QoKTtcbiAgICB9XG4gIH0sXG5cbiAgX19fZG9GaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuICAgIHN0YXRlLl9fX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICBzdGF0ZS5fX19ldmVudHMuZW1pdChFVkVOVF9GSU5JU0gsIHRoaXMuX19fZ2V0UmVzdWx0KCkpO1xuICB9LFxuXG4gIF9fX2VtaXRMYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RBcnJheSA9IHRoaXMuX2xhc3Q7XG5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgaWYgKGkgPT09IGxhc3RBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGxhc3RDYWxsYmFjayA9IGxhc3RBcnJheVtpKytdO1xuICAgICAgbGFzdENhbGxiYWNrKG5leHQpO1xuXG4gICAgICBpZiAoIWxhc3RDYWxsYmFjay5sZW5ndGgpIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5leHQoKTtcbiAgfSxcblxuICBlcnJvcjogZnVuY3Rpb24gKGUpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGxpc3RlbmVyIGZvciB0aGUgZXJyb3IgZXZlbnQgdGhlbiBpdCB3aWxsXG4gICAgICAvLyB0aHJvdyBhIG5ldyBFcnJvciBoZXJlLiBJbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgYXN5bmMgZnJhZ21lbnRcbiAgICAgIC8vIGlzIHN0aWxsIHByb3Blcmx5IGVuZGVkIHdlIG5lZWQgdG8gcHV0IHRoZSBlbmQoKSBpbiBhIGBmaW5hbGx5YFxuICAgICAgLy8gYmxvY2tcbiAgICAgIHRoaXMuZW5kKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgYmVnaW5Bc3luYzogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fX19zeW5jKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgXCJUcmllZCB0byByZW5kZXIgYXN5bmMgd2hpbGUgaW4gc3luYyBtb2RlLiBOb3RlOiBDbGllbnQgc2lkZSBhd2FpdCBpcyBub3QgY3VycmVudGx5IHN1cHBvcnRlZCBpbiByZS1yZW5kZXJzIChJc3N1ZTogIzk0MikuXCIsXG4gICAgICApO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMubGFzdCkge1xuICAgICAgICB0aGlzLl9fX2xhc3RDb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX19fcmVtYWluaW5nKys7XG5cbiAgICB2YXIgZG9jdW1lbnRGcmFnbWVudCA9IHRoaXMuX19fcGFyZW50Ll9fX2FwcGVuZERvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB2YXIgYXN5bmNPdXQgPSBuZXcgQXN5bmNWRE9NQnVpbGRlcih0aGlzLmdsb2JhbCwgZG9jdW1lbnRGcmFnbWVudCwgdGhpcyk7XG5cbiAgICBzdGF0ZS5fX19ldmVudHMuZW1pdChcImJlZ2luQXN5bmNcIiwge1xuICAgICAgb3V0OiBhc3luY091dCxcbiAgICAgIHBhcmVudE91dDogdGhpcyxcbiAgICB9KTtcblxuICAgIHJldHVybiBhc3luY091dDtcbiAgfSxcblxuICBjcmVhdGVPdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IEFzeW5jVkRPTUJ1aWxkZXIodGhpcy5nbG9iYWwpO1xuICB9LFxuXG4gIGZsdXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50cyA9IHRoaXMuX19fc3RhdGUuX19fZXZlbnRzO1xuXG4gICAgaWYgKGV2ZW50cy5saXN0ZW5lckNvdW50KEVWRU5UX1VQREFURSkpIHtcbiAgICAgIGV2ZW50cy5lbWl0KEVWRU5UX1VQREFURSwgbmV3IFJlbmRlclJlc3VsdCh0aGlzKSk7XG4gICAgfVxuICB9LFxuXG4gIF9fX2dldE91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3N0YXRlLl9fX3RyZWU7XG4gIH0sXG5cbiAgX19fZ2V0UmVzdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fcmVzdWx0IHx8ICh0aGlzLl9fX3Jlc3VsdCA9IG5ldyBSZW5kZXJSZXN1bHQodGhpcykpO1xuICB9LFxuXG4gIG9uOiBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmIChldmVudCA9PT0gRVZFTlRfRklOSVNIICYmIHN0YXRlLl9fX2ZpbmlzaGVkKSB7XG4gICAgICBjYWxsYmFjayh0aGlzLl9fX2dldFJlc3VsdCgpKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcImxhc3RcIikge1xuICAgICAgdGhpcy5vbkxhc3QoY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5fX19ldmVudHMub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmIChldmVudCA9PT0gRVZFTlRfRklOSVNIICYmIHN0YXRlLl9fX2ZpbmlzaGVkKSB7XG4gICAgICBjYWxsYmFjayh0aGlzLl9fX2dldFJlc3VsdCgpKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcImxhc3RcIikge1xuICAgICAgdGhpcy5vbkxhc3QoY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5fX19ldmVudHMub25jZShldmVudCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uICh0eXBlLCBhcmcpIHtcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5fX19zdGF0ZS5fX19ldmVudHM7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGV2ZW50cy5lbWl0KHR5cGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgZXZlbnRzLmVtaXQodHlwZSwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBldmVudHMuZW1pdC5hcHBseShldmVudHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudHMgPSB0aGlzLl9fX3N0YXRlLl9fX2V2ZW50cztcbiAgICBldmVudHMucmVtb3ZlTGlzdGVuZXIuYXBwbHkoZXZlbnRzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHN5bmM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9fX3N5bmMgPSB0cnVlO1xuICB9LFxuXG4gIGlzU3luYzogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3N5bmM7XG4gIH0sXG5cbiAgb25MYXN0OiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgbGFzdEFycmF5ID0gdGhpcy5fbGFzdDtcblxuICAgIGlmIChsYXN0QXJyYXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fbGFzdCA9IFtjYWxsYmFja107XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3RBcnJheS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfX19nZXROb2RlOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBub2RlID0gdGhpcy5fX192bm9kZTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHZhciB2ZG9tVHJlZSA9IHRoaXMuX19fZ2V0T3V0cHV0KCk7XG5cbiAgICAgIGlmICghaG9zdCkgaG9zdCA9IHRoaXMuX19faG9zdDtcbiAgICAgIHRoaXMuX19fdm5vZGUgPSBub2RlID0gdmRvbVRyZWUuX19fYWN0dWFsaXplKGhvc3QsIG51bGwpO1xuICAgICAgbW9ycGhkb20obm9kZSwgdmRvbVRyZWUsIGhvc3QsIHRoaXMuX19fY29tcG9uZW50cyk7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9LFxuXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBkb2NGcmFnbWVudCA9IHRoaXMuX19fZ2V0Tm9kZShob3N0KTtcbiAgICB2YXIgaHRtbCA9IFwiXCI7XG5cbiAgICB2YXIgY2hpbGQgPSBkb2NGcmFnbWVudC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgdmFyIG5leHRTaWJsaW5nID0gY2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICBpZiAoY2hpbGQubm9kZVR5cGUgIT0gMSkge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jRnJhZ21lbnQub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGQuY2xvbmVOb2RlKCkpO1xuICAgICAgICBodG1sICs9IGNvbnRhaW5lci5pbm5lckhUTUw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBodG1sICs9IGNoaWxkLm91dGVySFRNTDtcbiAgICAgIH1cblxuICAgICAgY2hpbGQgPSBuZXh0U2libGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfSxcblxuICB0aGVuOiBmdW5jdGlvbiAoZm4sIGZuRXJyKSB7XG4gICAgdmFyIG91dCA9IHRoaXM7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBvdXQub24oXCJlcnJvclwiLCByZWplY3QpLm9uKEVWRU5UX0ZJTklTSCwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihmbiwgZm5FcnIpO1xuICB9LFxuXG4gIGNhdGNoOiBmdW5jdGlvbiAoZm5FcnIpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgZm5FcnIpO1xuICB9LFxuXG4gIGlzVkRPTTogdHJ1ZSxcblxuICBjOiBmdW5jdGlvbiAoY29tcG9uZW50RGVmLCBrZXksIGN1c3RvbUV2ZW50cykge1xuICAgIHRoaXMuX19fYXNzaWduZWRDb21wb25lbnREZWYgPSBjb21wb25lbnREZWY7XG4gICAgdGhpcy5fX19hc3NpZ25lZEtleSA9IGtleTtcbiAgICB0aGlzLl9fX2Fzc2lnbmVkQ3VzdG9tRXZlbnRzID0gY3VzdG9tRXZlbnRzO1xuICB9LFxufSk7XG5cbnByb3RvLmUgPSBwcm90by5lbGVtZW50O1xucHJvdG8uYmUgPSBwcm90by5iZWdpbkVsZW1lbnQ7XG5wcm90by5lZSA9IHByb3RvLl9fX2VuZEVsZW1lbnQgPSBwcm90by5lbmRFbGVtZW50O1xucHJvdG8udCA9IHByb3RvLnRleHQ7XG5wcm90by5oID0gcHJvdG8udyA9IHByb3RvLndyaXRlID0gcHJvdG8uaHRtbDtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3luY1ZET01CdWlsZGVyO1xuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWQ29tcG9uZW50KGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCwgcHJlc2VydmUpIHtcbiAgdGhpcy5fX19WTm9kZShudWxsIC8qIGNoaWxkQ291bnQgKi8sIG93bmVyQ29tcG9uZW50KTtcbiAgdGhpcy5fX19rZXkgPSBrZXk7XG4gIHRoaXMuX19fY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB0aGlzLl9fX3ByZXNlcnZlID0gcHJlc2VydmU7XG59XG5cblZDb21wb25lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMixcbn07XG5cbmluaGVyaXQoVkNvbXBvbmVudCwgVk5vZGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZDb21wb25lbnQ7XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcblxuZnVuY3Rpb24gVkRvY3VtZW50RnJhZ21lbnRDbG9uZShvdGhlcikge1xuICBleHRlbmQodGhpcywgb3RoZXIpO1xuICB0aGlzLl9fX3BhcmVudE5vZGUgPSBudWxsO1xuICB0aGlzLl9fX25leHRTaWJsaW5nSW50ZXJuYWwgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBWRG9jdW1lbnRGcmFnbWVudChvdXQpIHtcbiAgdGhpcy5fX19WTm9kZShudWxsIC8qIGNoaWxkQ291bnQgKi8pO1xuICB0aGlzLl9fX291dCA9IG91dDtcbn1cblxuVkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMTEsXG5cbiAgX19fRG9jdW1lbnRGcmFnbWVudDogdHJ1ZSxcblxuICBfX19jbG9uZU5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZEb2N1bWVudEZyYWdtZW50Q2xvbmUodGhpcyk7XG4gIH0sXG5cbiAgX19fYWN0dWFsaXplOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHJldHVybiAoaG9zdC5vd25lckRvY3VtZW50IHx8IGhvc3QpLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgfSxcbn07XG5cbmluaGVyaXQoVkRvY3VtZW50RnJhZ21lbnQsIFZOb2RlKTtcblxuVkRvY3VtZW50RnJhZ21lbnRDbG9uZS5wcm90b3R5cGUgPSBWRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gVkRvY3VtZW50RnJhZ21lbnQ7XG4iLCIvKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG5cbnZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIHZFbGVtZW50QnlET01Ob2RlID0gZG9tRGF0YS5fX192RWxlbWVudEJ5RE9NTm9kZTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xudmFyIEFUVFJfWExJTktfSFJFRiA9IFwieGxpbms6aHJlZlwiO1xudmFyIHhtbG5zUmVnRXhwID0gL154bWxucyg6fCQpLztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgTlNfWExJTksgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIjtcbnZhciBOU19IVE1MID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG52YXIgTlNfTUFUSCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO1xudmFyIE5TX1NWRyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbnZhciBERUZBVUxUX05TID0ge1xuICBzdmc6IE5TX1NWRyxcbiAgbWF0aDogTlNfTUFUSCxcbn07XG5cbnZhciBGTEFHX1NJTVBMRV9BVFRSUyA9IDE7XG52YXIgRkxBR19DVVNUT01fRUxFTUVOVCA9IDI7XG52YXIgRkxBR19TUFJFQURfQVRUUlMgPSA0O1xuXG52YXIgQVRUUl9IUkVGID0gXCJocmVmXCI7XG52YXIgRU1QVFlfT0JKRUNUID0gT2JqZWN0LmZyZWV6ZShPYmplY3QuY3JlYXRlKG51bGwpKTtcbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgb3B0aW9uOiB7XG4gICAgc2VsZWN0ZWQ6IGZ1bmN0aW9uIChmcm9tRWwsIHZhbHVlKSB7XG4gICAgICBmcm9tRWwuc2VsZWN0ZWQgPSB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIChmcm9tRWwsIHZhbHVlKSB7XG4gICAgICBmcm9tRWwudmFsdWUgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHZhbHVlO1xuICAgIH0sXG4gICAgY2hlY2tlZDogZnVuY3Rpb24gKGZyb21FbCwgdmFsdWUpIHtcbiAgICAgIGZyb21FbC5jaGVja2VkID0gdmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICB9LFxufTtcblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBzd2l0Y2ggKHZhbHVlLnRvU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZzpcbiAgICAgICAgY2FzZSBBcnJheS5wcm90b3R5cGUudG9TdHJpbmc6XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgICAgICBcIlJlbHlpbmcgb24gSlNPTi5zdHJpbmdpZnkgZm9yIGF0dHJpYnV0ZSB2YWx1ZXMgaXMgZGVwcmVjYXRlZCwgaW4gZnV0dXJlIHZlcnNpb25zIG9mIE1hcmtvIHRoZXNlIHdpbGwgYmUgY2FzdCB0byBzdHJpbmdzIGluc3RlYWQuXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBjYXNlIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmc6XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLnNvdXJjZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlICsgXCJcIjtcbn1cblxuZnVuY3Rpb24gYXNzaWduKGEsIGIpIHtcbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChiLCBrZXkpKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIFZFbGVtZW50Q2xvbmUob3RoZXIpIHtcbiAgdGhpcy5fX19maXJzdENoaWxkSW50ZXJuYWwgPSBvdGhlci5fX19maXJzdENoaWxkSW50ZXJuYWw7XG4gIHRoaXMuX19fcGFyZW50Tm9kZSA9IG51bGw7XG4gIHRoaXMuX19fbmV4dFNpYmxpbmdJbnRlcm5hbCA9IG51bGw7XG5cbiAgdGhpcy5fX19rZXkgPSBvdGhlci5fX19rZXk7XG4gIHRoaXMuX19fYXR0cmlidXRlcyA9IG90aGVyLl9fX2F0dHJpYnV0ZXM7XG4gIHRoaXMuX19fcHJvcGVydGllcyA9IG90aGVyLl9fX3Byb3BlcnRpZXM7XG4gIHRoaXMuX19fbm9kZU5hbWUgPSBvdGhlci5fX19ub2RlTmFtZTtcbiAgdGhpcy5fX19mbGFncyA9IG90aGVyLl9fX2ZsYWdzO1xuICB0aGlzLl9fX3ZhbHVlSW50ZXJuYWwgPSBvdGhlci5fX192YWx1ZUludGVybmFsO1xuICB0aGlzLl9fX2NvbnN0SWQgPSBvdGhlci5fX19jb25zdElkO1xufVxuXG5mdW5jdGlvbiBWRWxlbWVudChcbiAgdGFnTmFtZSxcbiAgYXR0cnMsXG4gIGtleSxcbiAgb3duZXJDb21wb25lbnQsXG4gIGNoaWxkQ291bnQsXG4gIGZsYWdzLFxuICBwcm9wcyxcbikge1xuICB0aGlzLl9fX1ZOb2RlKGNoaWxkQ291bnQsIG93bmVyQ29tcG9uZW50KTtcblxuICB2YXIgY29uc3RJZDtcblxuICBpZiAocHJvcHMpIHtcbiAgICBjb25zdElkID0gcHJvcHMuaTtcbiAgfVxuXG4gIHRoaXMuX19fa2V5ID0ga2V5O1xuICB0aGlzLl9fX2ZsYWdzID0gZmxhZ3MgfHwgMDtcbiAgdGhpcy5fX19hdHRyaWJ1dGVzID0gYXR0cnMgfHwgRU1QVFlfT0JKRUNUO1xuICB0aGlzLl9fX3Byb3BlcnRpZXMgPSBwcm9wcyB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHRoaXMuX19fbm9kZU5hbWUgPSB0YWdOYW1lO1xuICB0aGlzLl9fX3ZhbHVlSW50ZXJuYWwgPSBcIlwiO1xuICB0aGlzLl9fX2NvbnN0SWQgPSBjb25zdElkO1xuICB0aGlzLl9fX3ByZXNlcnZlID0gZmFsc2U7XG4gIHRoaXMuX19fcHJlc2VydmVCb2R5ID0gZmFsc2U7XG59XG5cblZFbGVtZW50LnByb3RvdHlwZSA9IHtcbiAgX19fbm9kZVR5cGU6IDEsXG5cbiAgX19fY2xvbmVOb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWRWxlbWVudENsb25lKHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgbWV0aG9kIGZvciBjcmVhdGluZyBhbmQgYXBwZW5kaW5nIGFuIEhUTUwgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRhZ05hbWUgICAgVGhlIHRhZyBuYW1lIChlLmcuIFwiZGl2XCIpXG4gICAqIEBwYXJhbSAge2ludHxudWxsfSBhdHRyQ291bnQgIFRoZSBudW1iZXIgb2YgYXR0cmlidXRlcyAob3IgYG51bGxgIGlmIG5vdCBrbm93bilcbiAgICogQHBhcmFtICB7aW50fG51bGx9IGNoaWxkQ291bnQgVGhlIG51bWJlciBvZiBjaGlsZCBub2RlcyAob3IgYG51bGxgIGlmIG5vdCBrbm93bilcbiAgICovXG4gIGU6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBvd25lckNvbXBvbmVudCwgY2hpbGRDb3VudCwgZmxhZ3MsIHByb3BzKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5fX19hcHBlbmRDaGlsZChcbiAgICAgIG5ldyBWRWxlbWVudChcbiAgICAgICAgdGFnTmFtZSxcbiAgICAgICAgYXR0cnMsXG4gICAgICAgIGtleSxcbiAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgIGNoaWxkQ291bnQsXG4gICAgICAgIGZsYWdzLFxuICAgICAgICBwcm9wcyxcbiAgICAgICksXG4gICAgKTtcblxuICAgIGlmIChjaGlsZENvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX19maW5pc2hDaGlsZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgbWV0aG9kIGZvciBjcmVhdGluZyBhbmQgYXBwZW5kaW5nIGEgc3RhdGljIG5vZGUuIFRoZSBwcm92aWRlZCBub2RlIGlzIGF1dG9tYXRpY2FsbHkgY2xvbmVkXG4gICAqIHVzaW5nIGEgc2hhbGxvdyBjbG9uZSBzaW5jZSBpdCB3aWxsIGJlIG11dGF0ZWQgYXMgYSByZXN1bHQgb2Ygc2V0dGluZyBgbmV4dFNpYmxpbmdgIGFuZCBgcGFyZW50Tm9kZWAuXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIHZhbHVlIGZvciB0aGUgbmV3IENvbW1lbnQgbm9kZVxuICAgKi9cbiAgbjogZnVuY3Rpb24gKG5vZGUsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgbm9kZSA9IG5vZGUuX19fY2xvbmVOb2RlKCk7XG4gICAgbm9kZS5fX19vd25lckNvbXBvbmVudCA9IG93bmVyQ29tcG9uZW50O1xuICAgIHRoaXMuX19fYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgcmV0dXJuIHRoaXMuX19fZmluaXNoQ2hpbGQoKTtcbiAgfSxcblxuICBfX19hY3R1YWxpemU6IGZ1bmN0aW9uIChob3N0LCBwYXJlbnROYW1lc3BhY2VVUkkpIHtcbiAgICB2YXIgdGFnTmFtZSA9IHRoaXMuX19fbm9kZU5hbWU7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLl9fX2F0dHJpYnV0ZXM7XG4gICAgdmFyIG5hbWVzcGFjZVVSSSA9IERFRkFVTFRfTlNbdGFnTmFtZV0gfHwgcGFyZW50TmFtZXNwYWNlVVJJIHx8IE5TX0hUTUw7XG5cbiAgICB2YXIgZmxhZ3MgPSB0aGlzLl9fX2ZsYWdzO1xuICAgIHZhciBlbCA9IChob3N0Lm93bmVyRG9jdW1lbnQgfHwgaG9zdCkuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgbmFtZXNwYWNlVVJJLFxuICAgICAgdGFnTmFtZSxcbiAgICApO1xuXG4gICAgaWYgKGZsYWdzICYgRkxBR19DVVNUT01fRUxFTUVOVCkge1xuICAgICAgYXNzaWduKGVsLCBhdHRyaWJ1dGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgYXR0clZhbHVlID0gbm9ybWFsaXplVmFsdWUoYXR0cmlidXRlc1thdHRyTmFtZV0pO1xuXG4gICAgICAgIGlmIChhdHRyVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChhdHRyTmFtZSA9PSBBVFRSX1hMSU5LX0hSRUYpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKE5TX1hMSU5LLCBBVFRSX0hSRUYsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRhZ05hbWUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgICBlbC5kZWZhdWx0VmFsdWUgPSB0aGlzLl9fX3ZhbHVlSW50ZXJuYWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGVsLCB0aGlzKTtcblxuICAgIHJldHVybiBlbDtcbiAgfSxcbn07XG5cbmluaGVyaXQoVkVsZW1lbnQsIFZOb2RlKTtcblxuVkVsZW1lbnRDbG9uZS5wcm90b3R5cGUgPSBWRWxlbWVudC5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIHZpcnR1YWxpemVFbGVtZW50KG5vZGUsIHZpcnR1YWxpemVDaGlsZE5vZGVzLCBvd25lckNvbXBvbmVudCkge1xuICB2YXIgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcbiAgdmFyIGF0dHJDb3VudCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xuXG4gIHZhciBhdHRycyA9IG51bGw7XG4gIHZhciBwcm9wcyA9IG51bGw7XG5cbiAgaWYgKGF0dHJDb3VudCkge1xuICAgIGF0dHJzID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyQ291bnQ7IGkrKykge1xuICAgICAgdmFyIGF0dHIgPSBhdHRyaWJ1dGVzW2ldO1xuICAgICAgdmFyIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgaWYgKCF4bWxuc1JlZ0V4cC50ZXN0KGF0dHJOYW1lKSkge1xuICAgICAgICBpZiAoYXR0ck5hbWUgPT09IFwiZGF0YS1tYXJrb1wiKSB7XG4gICAgICAgICAgcHJvcHMgPSBjb21wb25lbnRzVXRpbC5fX19nZXRNYXJrb1Byb3BzRnJvbUVsKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHIubmFtZXNwYWNlVVJJID09PSBOU19YTElOSykge1xuICAgICAgICAgIGF0dHJzW0FUVFJfWExJTktfSFJFRl0gPSBhdHRyLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0dHJzW2F0dHJOYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgdGFnTmFtZSA9IG5vZGUubm9kZU5hbWU7XG5cbiAgaWYgKG5vZGUubmFtZXNwYWNlVVJJID09PSBOU19IVE1MKSB7XG4gICAgdGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHZhciB2ZG9tRWwgPSBuZXcgVkVsZW1lbnQoXG4gICAgdGFnTmFtZSxcbiAgICBhdHRycyxcbiAgICBudWxsIC8qa2V5Ki8sXG4gICAgb3duZXJDb21wb25lbnQsXG4gICAgMCAvKmNoaWxkIGNvdW50Ki8sXG4gICAgMCAvKmZsYWdzKi8sXG4gICAgcHJvcHMsXG4gICk7XG5cbiAgaWYgKHZkb21FbC5fX19ub2RlTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgdmRvbUVsLl9fX3ZhbHVlSW50ZXJuYWwgPSBub2RlLnZhbHVlO1xuICB9IGVsc2UgaWYgKHZpcnR1YWxpemVDaGlsZE5vZGVzKSB7XG4gICAgdmlydHVhbGl6ZUNoaWxkTm9kZXMobm9kZSwgdmRvbUVsLCBvd25lckNvbXBvbmVudCk7XG4gIH1cblxuICByZXR1cm4gdmRvbUVsO1xufVxuXG5WRWxlbWVudC5fX192aXJ0dWFsaXplID0gdmlydHVhbGl6ZUVsZW1lbnQ7XG5cblZFbGVtZW50Ll9fX21vcnBoQXR0cnMgPSBmdW5jdGlvbiAoZnJvbUVsLCB2RnJvbUVsLCB0b0VsKSB7XG4gIHZhciBmcm9tRmxhZ3MgPSB2RnJvbUVsLl9fX2ZsYWdzO1xuICB2YXIgdG9GbGFncyA9IHRvRWwuX19fZmxhZ3M7XG4gIHZhciBhdHRycyA9IHRvRWwuX19fYXR0cmlidXRlcztcblxuICBpZiAodG9GbGFncyAmIEZMQUdfQ1VTVE9NX0VMRU1FTlQpIHtcbiAgICByZXR1cm4gYXNzaWduKGZyb21FbCwgYXR0cnMpO1xuICB9XG5cbiAgdmFyIHByb3BzID0gdG9FbC5fX19wcm9wZXJ0aWVzO1xuICB2YXIgYXR0ck5hbWU7XG5cbiAgLy8gV2UgdXNlIGV4cGFuZG8gcHJvcGVydGllcyB0byBhc3NvY2lhdGUgdGhlIHByZXZpb3VzIEhUTUxcbiAgLy8gYXR0cmlidXRlcyBwcm92aWRlZCBhcyBwYXJ0IG9mIHRoZSBWRE9NIG5vZGUgd2l0aCB0aGVcbiAgLy8gcmVhbCBWRWxlbWVudCBET00gbm9kZS4gV2hlbiBkaWZmaW5nIGF0dHJpYnV0ZXMsXG4gIC8vIHdlIG9ubHkgdXNlIG91ciBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYXR0cmlidXRlcy5cbiAgLy8gV2hlbiBkaWZmaW5nIGZvciB0aGUgZmlyc3QgdGltZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlXG4gIC8vIHJlYWwgVkVsZW1lbnQgbm9kZSB3aWxsIG5vdCBoYXZlIHRoZSBleHBhbmRvIHByb3BlcnR5XG4gIC8vIHNvIHdlIGJ1aWxkIHRoZSBhdHRyaWJ1dGUgbWFwIGZyb20gdGhlIGV4cGFuZG8gcHJvcGVydHlcblxuICB2YXIgb2xkQXR0cnMgPSB2RnJvbUVsLl9fX2F0dHJpYnV0ZXM7XG5cbiAgaWYgKG9sZEF0dHJzID09PSBhdHRycykge1xuICAgIC8vIEZvciBjb25zdGFudCBhdHRyaWJ1dGVzIHRoZSBzYW1lIG9iamVjdCB3aWxsIGJlIHByb3ZpZGVkXG4gICAgLy8gZXZlcnkgcmVuZGVyIGFuZCB3ZSBjYW4gdXNlIHRoYXQgdG8gb3VyIGFkdmFudGFnZSB0b1xuICAgIC8vIG5vdCB3YXN0ZSB0aW1lIGRpZmZpbmcgYSBjb25zdGFudCwgaW1tdXRhYmxlIGF0dHJpYnV0ZVxuICAgIC8vIG1hcC5cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgYXR0clZhbHVlO1xuXG4gIGlmICh0b0ZsYWdzICYgRkxBR19TSU1QTEVfQVRUUlMgJiYgZnJvbUZsYWdzICYgRkxBR19TSU1QTEVfQVRUUlMpIHtcbiAgICBpZiAob2xkQXR0cnNbXCJjbGFzc1wiXSAhPT0gKGF0dHJWYWx1ZSA9IGF0dHJzW1wiY2xhc3NcIl0pKSB7XG4gICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgIGZyb21FbC5jbGFzc05hbWUgPSBhdHRyVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvbGRBdHRycy5pZCAhPT0gKGF0dHJWYWx1ZSA9IGF0dHJzLmlkKSkge1xuICAgICAgaWYgKGF0dHJWYWx1ZSkge1xuICAgICAgICBmcm9tRWwuaWQgPSBhdHRyVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKFwiaWRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvbGRBdHRycy5zdHlsZSAhPT0gKGF0dHJWYWx1ZSA9IGF0dHJzLnN0eWxlKSkge1xuICAgICAgaWYgKGF0dHJWYWx1ZSkge1xuICAgICAgICBmcm9tRWwuc3R5bGUuY3NzVGV4dCA9IGF0dHJWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHByZXNlcnZlID0gKHByb3BzICYmIHByb3BzLnBhKSB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHZhciBzcGVjaWFsQXR0cnMgPSBzcGVjaWFsRWxIYW5kbGVyc1t0b0VsLl9fX25vZGVOYW1lXSB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHZhciBzcGVjaWFsQXR0cjtcblxuICAvLyBMb29wIG92ZXIgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIGluIHRoZSBhdHRyaWJ1dGUgbWFwIGFuZCBjb21wYXJlXG4gIC8vIHRoZW0gdG8gdGhlIHZhbHVlIGluIHRoZSBvbGQgbWFwLiBIb3dldmVyLCBpZiB0aGUgdmFsdWUgaXNcbiAgLy8gbnVsbC91bmRlZmluZWQvZmFsc2UgdGhlbiB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlXG4gIGZvciAoYXR0ck5hbWUgaW4gYXR0cnMpIHtcbiAgICBpZiAoXG4gICAgICAhcHJlc2VydmVbYXR0ck5hbWVdICYmXG4gICAgICBub3JtYWxpemVWYWx1ZShvbGRBdHRyc1thdHRyTmFtZV0pICE9PVxuICAgICAgICAoYXR0clZhbHVlID0gbm9ybWFsaXplVmFsdWUoYXR0cnNbYXR0ck5hbWVdKSlcbiAgICApIHtcbiAgICAgIGlmICgoc3BlY2lhbEF0dHIgPSBzcGVjaWFsQXR0cnNbYXR0ck5hbWVdKSkge1xuICAgICAgICBzcGVjaWFsQXR0cihmcm9tRWwsIGF0dHJWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09PSBBVFRSX1hMSU5LX0hSRUYpIHtcbiAgICAgICAgaWYgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZU5TKE5TX1hMSU5LLCBBVFRSX0hSRUYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGVOUyhOU19YTElOSywgQVRUUl9IUkVGLCBhdHRyVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGVyZSBhcmUgYW55IG9sZCBhdHRyaWJ1dGVzIHRoYXQgYXJlIG5vdCBpbiB0aGUgbmV3IHNldCBvZiBhdHRyaWJ1dGVzXG4gIC8vIHRoZW4gd2UgbmVlZCB0byByZW1vdmUgdGhvc2UgYXR0cmlidXRlcyBmcm9tIHRoZSB0YXJnZXQgbm9kZVxuICAvL1xuICAvLyBOT1RFOiBXZSBjYW4gc2tpcCB0aGlzIGlmIHRoZSB0aGUgZWxlbWVudCBpcyBrZXllZCBhbmQgZGlkbid0IGhhdmUgc3ByZWFkIGF0dHJpYnV0ZXNcbiAgLy8gICAgICAgYmVjYXVzZSB3ZSBrbm93IHdlIGFscmVhZHkgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgYXR0cmlidXRlcyBmb3JcbiAgLy8gICAgICAgYm90aCB0aGUgdGFyZ2V0IGFuZCBvcmlnaW5hbCBlbGVtZW50IHNpbmNlIHRhcmdldCBWRWxlbWVudCBub2RlcyB3aWxsXG4gIC8vICAgICAgIGhhdmUgYWxsIGF0dHJpYnV0ZXMgZGVjbGFyZWQuIEhvd2V2ZXIsIHdlIGNhbiBvbmx5IHNraXAgaWYgdGhlIG5vZGVcbiAgLy8gICAgICAgd2FzIG5vdCBhIHZpcnR1YWxpemVkIG5vZGUgKGkuZS4sIGEgbm9kZSB0aGF0IHdhcyBub3QgcmVuZGVyZWQgYnkgYVxuICAvLyAgICAgICBNYXJrbyB0ZW1wbGF0ZSwgYnV0IHJhdGhlciBhIG5vZGUgdGhhdCB3YXMgY3JlYXRlZCBmcm9tIGFuIEhUTUxcbiAgLy8gICAgICAgc3RyaW5nIG9yIGEgcmVhbCBET00gbm9kZSkuXG4gIGlmICh0b0VsLl9fX2tleSA9PT0gbnVsbCB8fCBmcm9tRmxhZ3MgJiBGTEFHX1NQUkVBRF9BVFRSUykge1xuICAgIGZvciAoYXR0ck5hbWUgaW4gb2xkQXR0cnMpIHtcbiAgICAgIGlmICghKGF0dHJOYW1lIGluIGF0dHJzKSkge1xuICAgICAgICBpZiAoKHNwZWNpYWxBdHRyID0gc3BlY2lhbEF0dHJzW2F0dHJOYW1lXSkpIHtcbiAgICAgICAgICBzcGVjaWFsQXR0cihmcm9tRWwsIHVuZGVmaW5lZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IEFUVFJfWExJTktfSFJFRikge1xuICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGVOUyhBVFRSX1hMSU5LX0hSRUYsIEFUVFJfSFJFRik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVkVsZW1lbnQ7XG4iLCJ2YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9kb20tZGF0YVwiKTtcbnZhciBrZXlzQnlET01Ob2RlID0gZG9tRGF0YS5fX19rZXlCeURPTU5vZGU7XG52YXIgdkVsZW1lbnRCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZFbGVtZW50QnlET01Ob2RlO1xudmFyIGNyZWF0ZUZyYWdtZW50Tm9kZSA9IHJlcXVpcmUoXCIuL21vcnBoZG9tL2ZyYWdtZW50XCIpLl9fX2NyZWF0ZUZyYWdtZW50Tm9kZTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWRnJhZ21lbnQoa2V5LCBvd25lckNvbXBvbmVudCwgcHJlc2VydmUpIHtcbiAgdGhpcy5fX19WTm9kZShudWxsIC8qIGNoaWxkQ291bnQgKi8sIG93bmVyQ29tcG9uZW50KTtcbiAgdGhpcy5fX19rZXkgPSBrZXk7XG4gIHRoaXMuX19fcHJlc2VydmUgPSBwcmVzZXJ2ZTtcbn1cblxuVkZyYWdtZW50LnByb3RvdHlwZSA9IHtcbiAgX19fbm9kZVR5cGU6IDEyLFxuICBfX19hY3R1YWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBjcmVhdGVGcmFnbWVudE5vZGUoKTtcbiAgICBrZXlzQnlET01Ob2RlLnNldChmcmFnbWVudCwgdGhpcy5fX19rZXkpO1xuICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChmcmFnbWVudCwgdGhpcyk7XG4gICAgcmV0dXJuIGZyYWdtZW50O1xuICB9LFxufTtcblxuaW5oZXJpdChWRnJhZ21lbnQsIFZOb2RlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWRnJhZ21lbnQ7XG4iLCIvKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG5mdW5jdGlvbiBWTm9kZSgpIHt9XG5cblZOb2RlLnByb3RvdHlwZSA9IHtcbiAgX19fVk5vZGU6IGZ1bmN0aW9uIChmaW5hbENoaWxkQ291bnQsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgdGhpcy5fX19maW5hbENoaWxkQ291bnQgPSBmaW5hbENoaWxkQ291bnQ7XG4gICAgdGhpcy5fX19jaGlsZENvdW50ID0gMDtcbiAgICB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbCA9IG51bGw7XG4gICAgdGhpcy5fX19sYXN0Q2hpbGQgPSBudWxsO1xuICAgIHRoaXMuX19fcGFyZW50Tm9kZSA9IG51bGw7XG4gICAgdGhpcy5fX19uZXh0U2libGluZ0ludGVybmFsID0gbnVsbDtcbiAgICB0aGlzLl9fX293bmVyQ29tcG9uZW50ID0gb3duZXJDb21wb25lbnQ7XG4gIH0sXG5cbiAgZ2V0IF9fX2ZpcnN0Q2hpbGQoKSB7XG4gICAgdmFyIGZpcnN0Q2hpbGQgPSB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbDtcblxuICAgIGlmIChmaXJzdENoaWxkICYmIGZpcnN0Q2hpbGQuX19fRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgdmFyIG5lc3RlZEZpcnN0Q2hpbGQgPSBmaXJzdENoaWxkLl9fX2ZpcnN0Q2hpbGQ7XG4gICAgICAvLyBUaGUgZmlyc3QgY2hpbGQgaXMgYSBEb2N1bWVudEZyYWdtZW50IG5vZGUuXG4gICAgICAvLyBJZiB0aGUgRG9jdW1lbnRGcmFnbWVudCBub2RlIGhhcyBhIGZpcnN0IGNoaWxkIHRoZW4gd2Ugd2lsbCByZXR1cm4gdGhhdC5cbiAgICAgIC8vIE90aGVyd2lzZSwgdGhlIERvY3VtZW50RnJhZ21lbnQgbm9kZSBpcyBub3QgKnJlYWxseSogdGhlIGZpcnN0IGNoaWxkIGFuZFxuICAgICAgLy8gd2UgbmVlZCB0byBza2lwIHRvIGl0cyBuZXh0IHNpYmxpbmdcbiAgICAgIHJldHVybiBuZXN0ZWRGaXJzdENoaWxkIHx8IGZpcnN0Q2hpbGQuX19fbmV4dFNpYmxpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpcnN0Q2hpbGQ7XG4gIH0sXG5cbiAgZ2V0IF9fX25leHRTaWJsaW5nKCkge1xuICAgIHZhciBuZXh0U2libGluZyA9IHRoaXMuX19fbmV4dFNpYmxpbmdJbnRlcm5hbDtcblxuICAgIGlmIChuZXh0U2libGluZykge1xuICAgICAgaWYgKG5leHRTaWJsaW5nLl9fX0RvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBuZXh0U2libGluZy5fX19maXJzdENoaWxkO1xuICAgICAgICByZXR1cm4gZmlyc3RDaGlsZCB8fCBuZXh0U2libGluZy5fX19uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHBhcmVudE5vZGUgPSB0aGlzLl9fX3BhcmVudE5vZGU7XG4gICAgICBpZiAocGFyZW50Tm9kZSAmJiBwYXJlbnROb2RlLl9fX0RvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudE5vZGUuX19fbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRTaWJsaW5nO1xuICB9LFxuXG4gIF9fX2FwcGVuZENoaWxkOiBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICB0aGlzLl9fX2NoaWxkQ291bnQrKztcblxuICAgIGlmICh0aGlzLl9fX25vZGVOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGlmIChjaGlsZC5fX19UZXh0KSB7XG4gICAgICAgIHRoaXMuX19fdmFsdWVJbnRlcm5hbCArPSBjaGlsZC5fX19ub2RlVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxhc3RDaGlsZCA9IHRoaXMuX19fbGFzdENoaWxkO1xuXG4gICAgICBjaGlsZC5fX19wYXJlbnROb2RlID0gdGhpcztcblxuICAgICAgaWYgKGxhc3RDaGlsZCkge1xuICAgICAgICBsYXN0Q2hpbGQuX19fbmV4dFNpYmxpbmdJbnRlcm5hbCA9IGNoaWxkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX19maXJzdENoaWxkSW50ZXJuYWwgPSBjaGlsZDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fX19sYXN0Q2hpbGQgPSBjaGlsZDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0sXG5cbiAgX19fZmluaXNoQ2hpbGQ6IGZ1bmN0aW9uIGZpbmlzaENoaWxkKCkge1xuICAgIGlmICh0aGlzLl9fX2NoaWxkQ291bnQgPT09IHRoaXMuX19fZmluYWxDaGlsZENvdW50ICYmIHRoaXMuX19fcGFyZW50Tm9kZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX19fcGFyZW50Tm9kZS5fX19maW5pc2hDaGlsZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sXG5cbiAgLy8gLHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gIC8vICAgICB2YXIgY2xvbmUgPSBPYmplY3QuYXNzaWduKHtcbiAgLy8gICAgICAgICBub2RlVHlwZTogdGhpcy5ub2RlVHlwZVxuICAvLyAgICAgfSwgdGhpcyk7XG4gIC8vXG4gIC8vICAgICBmb3IgKHZhciBrIGluIGNsb25lKSB7XG4gIC8vICAgICAgICAgaWYgKGsuc3RhcnRzV2l0aCgnXycpKSB7XG4gIC8vICAgICAgICAgICAgIGRlbGV0ZSBjbG9uZVtrXTtcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgICBkZWxldGUgY2xvbmUuX25leHRTaWJsaW5nO1xuICAvLyAgICAgZGVsZXRlIGNsb25lLl9sYXN0Q2hpbGQ7XG4gIC8vICAgICBkZWxldGUgY2xvbmUucGFyZW50Tm9kZTtcbiAgLy8gICAgIHJldHVybiBjbG9uZTtcbiAgLy8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWTm9kZTtcbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcblxuZnVuY3Rpb24gVlRleHQodmFsdWUsIG93bmVyQ29tcG9uZW50KSB7XG4gIHRoaXMuX19fVk5vZGUoLTEgLyogbm8gY2hpbGRyZW4gKi8sIG93bmVyQ29tcG9uZW50KTtcbiAgdGhpcy5fX19ub2RlVmFsdWUgPSB2YWx1ZTtcbn1cblxuVlRleHQucHJvdG90eXBlID0ge1xuICBfX19UZXh0OiB0cnVlLFxuXG4gIF9fX25vZGVUeXBlOiAzLFxuXG4gIF9fX2FjdHVhbGl6ZTogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICByZXR1cm4gKGhvc3Qub3duZXJEb2N1bWVudCB8fCBob3N0KS5jcmVhdGVUZXh0Tm9kZSh0aGlzLl9fX25vZGVWYWx1ZSk7XG4gIH0sXG5cbiAgX19fY2xvbmVOb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWVGV4dCh0aGlzLl9fX25vZGVWYWx1ZSk7XG4gIH0sXG59O1xuXG5pbmhlcml0KFZUZXh0LCBWTm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVlRleHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBjbGFzc0hlbHBlciA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2NsYXNzLXZhbHVlXCIpO1xudmFyIHN0eWxlSGVscGVyID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvc3R5bGUtdmFsdWVcIik7XG52YXIgcGFyc2VIVE1MID0gcmVxdWlyZShcIi4uL3BhcnNlLWh0bWxcIik7XG5cbi8qKlxuICogSGVscGVyIGZvciBwcm9jZXNzaW5nIGR5bmFtaWMgYXR0cmlidXRlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gIGlmICh0eXBlb2YgYXR0cmlidXRlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgXCJQYXNzaW5nIGEgc3RyaW5nIGFzIGEgZHluYW1pYyBhdHRyaWJ1dGUgdmFsdWUgaXMgZGVwcmVjYXRlZCAtIE1vcmUgZGV0YWlsczogaHR0cHM6Ly9naXRodWIuY29tL21hcmtvLWpzL21hcmtvL3dpa2kvRGVwcmVjYXRpb246LVN0cmluZy1hcy1keW5hbWljLWF0dHJpYnV0ZS12YWx1ZVwiLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlQXR0cnMoYXR0cmlidXRlcyk7XG4gIH1cblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIHZhciBuZXdBdHRyaWJ1dGVzID0ge307XG5cbiAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICB2YXIgdmFsID0gYXR0cmlidXRlc1thdHRyTmFtZV07XG4gICAgICBpZiAoYXR0ck5hbWUgPT09IFwicmVuZGVyQm9keVwiKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ck5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICB2YWwgPSBjbGFzc0hlbHBlcih2YWwpO1xuICAgICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgIHZhbCA9IHN0eWxlSGVscGVyKHZhbCk7XG4gICAgICB9XG5cbiAgICAgIG5ld0F0dHJpYnV0ZXNbYXR0ck5hbWVdID0gdmFsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdBdHRyaWJ1dGVzO1xuICB9XG5cbiAgcmV0dXJuIGF0dHJpYnV0ZXM7XG59O1xuXG5mdW5jdGlvbiBwYXJzZUF0dHJzKHN0cikge1xuICBpZiAoc3RyID09PSBcIlwiKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgdmFyIGF0dHJzID0gcGFyc2VIVE1MKFwiPGEgXCIgKyBzdHIgKyBcIj5cIikuYXR0cmlidXRlcztcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICB2YXIgYXR0cjtcblxuICBmb3IgKHZhciBsZW4gPSBhdHRycy5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhdHRyID0gYXR0cnNbaV07XG4gICAgcmVzdWx0W2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG53aW5kb3cuTWFya28gPSB7XG4gIENvbXBvbmVudDogZnVuY3Rpb24gKCkge30sXG59O1xuXG4vKipcbiAqIE1ldGhvZCBpcyBmb3IgaW50ZXJuYWwgdXNhZ2Ugb25seS4gVGhpcyBtZXRob2RcbiAqIGlzIGludm9rZWQgYnkgY29kZSBpbiBhIGNvbXBpbGVkIE1hcmtvIHRlbXBsYXRlIGFuZFxuICogaXQgaXMgdXNlZCB0byBjcmVhdGUgYSBuZXcgVGVtcGxhdGUgaW5zdGFuY2UuXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLnQgPSBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZSh0eXBlTmFtZSkge1xuICByZXR1cm4gbmV3IFRlbXBsYXRlKHR5cGVOYW1lKTtcbn07XG5cbmZ1bmN0aW9uIFRlbXBsYXRlKHR5cGVOYW1lKSB7XG4gIHRoaXMucGF0aCA9IHRoaXMuX19fdHlwZU5hbWUgPSB0eXBlTmFtZTtcbn1cblxudmFyIEFzeW5jVkRPTUJ1aWxkZXIgPSByZXF1aXJlKFwiLi9Bc3luY1ZET01CdWlsZGVyXCIpO1xucmVxdWlyZShcIi4uL2NyZWF0ZU91dFwiKS5fX19zZXRDcmVhdGVPdXQoXG4gIChUZW1wbGF0ZS5wcm90b3R5cGUuY3JlYXRlT3V0ID0gZnVuY3Rpb24gY3JlYXRlT3V0KFxuICAgIGdsb2JhbERhdGEsXG4gICAgcGFyZW50LFxuICAgIHBhcmVudE91dCxcbiAgKSB7XG4gICAgcmV0dXJuIG5ldyBBc3luY1ZET01CdWlsZGVyKGdsb2JhbERhdGEsIHBhcmVudCwgcGFyZW50T3V0KTtcbiAgfSksXG4pO1xuXG5yZXF1aXJlKFwiLi4vcmVuZGVyYWJsZVwiKShUZW1wbGF0ZS5wcm90b3R5cGUpO1xuIiwidmFyIGhlbHBlcnMgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xudmFyIGluc2VydEJlZm9yZSA9IGhlbHBlcnMuX19faW5zZXJ0QmVmb3JlO1xuXG52YXIgZnJhZ21lbnRQcm90b3R5cGUgPSB7XG4gIG5vZGVUeXBlOiAxMixcbiAgZ2V0IGZpcnN0Q2hpbGQoKSB7XG4gICAgdmFyIGZpcnN0Q2hpbGQgPSB0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZztcbiAgICByZXR1cm4gZmlyc3RDaGlsZCA9PT0gdGhpcy5lbmROb2RlID8gdW5kZWZpbmVkIDogZmlyc3RDaGlsZDtcbiAgfSxcbiAgZ2V0IGxhc3RDaGlsZCgpIHtcbiAgICB2YXIgbGFzdENoaWxkID0gdGhpcy5lbmROb2RlLnByZXZpb3VzU2libGluZztcbiAgICByZXR1cm4gbGFzdENoaWxkID09PSB0aGlzLnN0YXJ0Tm9kZSA/IHVuZGVmaW5lZCA6IGxhc3RDaGlsZDtcbiAgfSxcbiAgZ2V0IHBhcmVudE5vZGUoKSB7XG4gICAgdmFyIHBhcmVudE5vZGUgPSB0aGlzLnN0YXJ0Tm9kZS5wYXJlbnROb2RlO1xuICAgIHJldHVybiBwYXJlbnROb2RlID09PSB0aGlzLmRldGFjaGVkQ29udGFpbmVyID8gdW5kZWZpbmVkIDogcGFyZW50Tm9kZTtcbiAgfSxcbiAgZ2V0IG5hbWVzcGFjZVVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydE5vZGUucGFyZW50Tm9kZS5uYW1lc3BhY2VVUkk7XG4gIH0sXG4gIGdldCBuZXh0U2libGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbmROb2RlLm5leHRTaWJsaW5nO1xuICB9LFxuICBnZXQgbm9kZXMoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGlmICh0aGlzLl9fX21hcmtlcnNSZW1vdmVkRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5fX19tYXJrZXJzUmVtb3ZlZEVycm9yKFwiQ2Fubm90IGdldCBmcmFnbWVudCBub2Rlcy5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5zdGFydE5vZGU7XG4gICAgd2hpbGUgKGN1cnJlbnQgIT09IHRoaXMuZW5kTm9kZSkge1xuICAgICAgbm9kZXMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICBub2Rlcy5wdXNoKGN1cnJlbnQpO1xuICAgIHJldHVybiBub2RlcztcbiAgfSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAobmV3Q2hpbGROb2RlLCByZWZlcmVuY2VOb2RlKSB7XG4gICAgdmFyIGFjdHVhbFJlZmVyZW5jZSA9IHJlZmVyZW5jZU5vZGUgPT0gbnVsbCA/IHRoaXMuZW5kTm9kZSA6IHJlZmVyZW5jZU5vZGU7XG4gICAgcmV0dXJuIGluc2VydEJlZm9yZShcbiAgICAgIG5ld0NoaWxkTm9kZSxcbiAgICAgIGFjdHVhbFJlZmVyZW5jZSxcbiAgICAgIHRoaXMuc3RhcnROb2RlLnBhcmVudE5vZGUsXG4gICAgKTtcbiAgfSxcbiAgaW5zZXJ0SW50bzogZnVuY3Rpb24gKG5ld1BhcmVudE5vZGUsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICB0aGlzLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGluc2VydEJlZm9yZShub2RlLCByZWZlcmVuY2VOb2RlLCBuZXdQYXJlbnROb2RlKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICB0aGlzLmRldGFjaGVkQ29udGFpbmVyLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnROb2RlKHN0YXJ0Tm9kZSwgbmV4dE5vZGUsIHBhcmVudE5vZGUpIHtcbiAgdmFyIGZyYWdtZW50ID0gT2JqZWN0LmNyZWF0ZShmcmFnbWVudFByb3RvdHlwZSk7XG4gIHZhciBpc1Jvb3QgPSBzdGFydE5vZGUgJiYgc3RhcnROb2RlLm93bmVyRG9jdW1lbnQgPT09IHN0YXJ0Tm9kZS5wYXJlbnROb2RlO1xuICBmcmFnbWVudC5zdGFydE5vZGUgPSBpc1Jvb3RcbiAgICA/IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJcIilcbiAgICA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICBmcmFnbWVudC5lbmROb2RlID0gaXNSb290XG4gICAgPyBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiXCIpXG4gICAgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgZnJhZ21lbnQuc3RhcnROb2RlLmZyYWdtZW50ID0gZnJhZ21lbnQ7XG4gIGZyYWdtZW50LmVuZE5vZGUuZnJhZ21lbnQgPSBmcmFnbWVudDtcbiAgdmFyIGRldGFjaGVkQ29udGFpbmVyID0gKGZyYWdtZW50LmRldGFjaGVkQ29udGFpbmVyID1cbiAgICBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpO1xuICBwYXJlbnROb2RlID1cbiAgICBwYXJlbnROb2RlIHx8IChzdGFydE5vZGUgJiYgc3RhcnROb2RlLnBhcmVudE5vZGUpIHx8IGRldGFjaGVkQ29udGFpbmVyO1xuICBpbnNlcnRCZWZvcmUoZnJhZ21lbnQuc3RhcnROb2RlLCBzdGFydE5vZGUsIHBhcmVudE5vZGUpO1xuICBpbnNlcnRCZWZvcmUoZnJhZ21lbnQuZW5kTm9kZSwgbmV4dE5vZGUsIHBhcmVudE5vZGUpO1xuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbmZ1bmN0aW9uIGJlZ2luRnJhZ21lbnROb2RlKHN0YXJ0Tm9kZSwgcGFyZW50Tm9kZSkge1xuICB2YXIgZnJhZ21lbnQgPSBjcmVhdGVGcmFnbWVudE5vZGUoc3RhcnROb2RlLCBudWxsLCBwYXJlbnROb2RlKTtcbiAgZnJhZ21lbnQuX19fZmluaXNoRnJhZ21lbnQgPSBmdW5jdGlvbiAobmV4dE5vZGUpIHtcbiAgICBmcmFnbWVudC5fX19maW5pc2hGcmFnbWVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlKFxuICAgICAgZnJhZ21lbnQuZW5kTm9kZSxcbiAgICAgIG5leHROb2RlLFxuICAgICAgcGFyZW50Tm9kZSB8fCBzdGFydE5vZGUucGFyZW50Tm9kZSxcbiAgICApO1xuICB9O1xuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbmV4cG9ydHMuX19fY3JlYXRlRnJhZ21lbnROb2RlID0gY3JlYXRlRnJhZ21lbnROb2RlO1xuZXhwb3J0cy5fX19iZWdpbkZyYWdtZW50Tm9kZSA9IGJlZ2luRnJhZ21lbnROb2RlO1xuIiwiZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKG5vZGUsIHJlZmVyZW5jZU5vZGUsIHBhcmVudE5vZGUpIHtcbiAgaWYgKG5vZGUuaW5zZXJ0SW50bykge1xuICAgIHJldHVybiBub2RlLmluc2VydEludG8ocGFyZW50Tm9kZSwgcmVmZXJlbmNlTm9kZSk7XG4gIH1cbiAgcmV0dXJuIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKFxuICAgIG5vZGUsXG4gICAgKHJlZmVyZW5jZU5vZGUgJiYgcmVmZXJlbmNlTm9kZS5zdGFydE5vZGUpIHx8IHJlZmVyZW5jZU5vZGUsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGluc2VydEFmdGVyKG5vZGUsIHJlZmVyZW5jZU5vZGUsIHBhcmVudE5vZGUpIHtcbiAgcmV0dXJuIGluc2VydEJlZm9yZShcbiAgICBub2RlLFxuICAgIHJlZmVyZW5jZU5vZGUgJiYgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZyxcbiAgICBwYXJlbnROb2RlLFxuICApO1xufVxuXG5mdW5jdGlvbiBuZXh0U2libGluZyhub2RlKSB7XG4gIHZhciBuZXh0ID0gbm9kZS5uZXh0U2libGluZztcbiAgdmFyIGZyYWdtZW50ID0gbmV4dCAmJiBuZXh0LmZyYWdtZW50O1xuICBpZiAoZnJhZ21lbnQpIHtcbiAgICByZXR1cm4gbmV4dCA9PT0gZnJhZ21lbnQuc3RhcnROb2RlID8gZnJhZ21lbnQgOiBudWxsO1xuICB9XG4gIHJldHVybiBuZXh0O1xufVxuXG5mdW5jdGlvbiBmaXJzdENoaWxkKG5vZGUpIHtcbiAgdmFyIG5leHQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gIHJldHVybiAobmV4dCAmJiBuZXh0LmZyYWdtZW50KSB8fCBuZXh0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVDaGlsZChub2RlKSB7XG4gIGlmIChub2RlLnJlbW92ZSkgbm9kZS5yZW1vdmUoKTtcbiAgZWxzZSBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG59XG5cbmV4cG9ydHMuX19faW5zZXJ0QmVmb3JlID0gaW5zZXJ0QmVmb3JlO1xuZXhwb3J0cy5fX19pbnNlcnRBZnRlciA9IGluc2VydEFmdGVyO1xuZXhwb3J0cy5fX19uZXh0U2libGluZyA9IG5leHRTaWJsaW5nO1xuZXhwb3J0cy5fX19maXJzdENoaWxkID0gZmlyc3RDaGlsZDtcbmV4cG9ydHMuX19fcmVtb3ZlQ2hpbGQgPSByZW1vdmVDaGlsZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgZXhpc3RpbmdDb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG52YXIgZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBjb21wb25lbnRzVXRpbC5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbnZhciBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzID1cbiAgY29tcG9uZW50c1V0aWwuX19fYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cztcbnZhciBub3JtYWxpemVDb21wb25lbnRLZXkgPSBjb21wb25lbnRzVXRpbC5fX19ub3JtYWxpemVDb21wb25lbnRLZXk7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi8uLi9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGV2ZW50RGVsZWdhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9jb21wb25lbnRzL2V2ZW50LWRlbGVnYXRpb25cIik7XG52YXIgS2V5U2VxdWVuY2UgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9LZXlTZXF1ZW5jZVwiKTtcbnZhciBWRWxlbWVudCA9IHJlcXVpcmUoXCIuLi92ZG9tXCIpLl9fX1ZFbGVtZW50O1xudmFyIGZyYWdtZW50ID0gcmVxdWlyZShcIi4vZnJhZ21lbnRcIik7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XG52YXIgdmlydHVhbGl6ZUVsZW1lbnQgPSBWRWxlbWVudC5fX192aXJ0dWFsaXplO1xudmFyIG1vcnBoQXR0cnMgPSBWRWxlbWVudC5fX19tb3JwaEF0dHJzO1xudmFyIGtleXNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2tleUJ5RE9NTm9kZTtcbnZhciBjb21wb25lbnRCeURPTU5vZGUgPSBkb21EYXRhLl9fX2NvbXBvbmVudEJ5RE9NTm9kZTtcbnZhciB2RWxlbWVudEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fdkVsZW1lbnRCeURPTU5vZGU7XG52YXIgZGV0YWNoZWRCeURPTU5vZGUgPSBkb21EYXRhLl9fX2RldGFjaGVkQnlET01Ob2RlO1xuXG52YXIgaW5zZXJ0QmVmb3JlID0gaGVscGVycy5fX19pbnNlcnRCZWZvcmU7XG52YXIgaW5zZXJ0QWZ0ZXIgPSBoZWxwZXJzLl9fX2luc2VydEFmdGVyO1xudmFyIG5leHRTaWJsaW5nID0gaGVscGVycy5fX19uZXh0U2libGluZztcbnZhciBmaXJzdENoaWxkID0gaGVscGVycy5fX19maXJzdENoaWxkO1xudmFyIHJlbW92ZUNoaWxkID0gaGVscGVycy5fX19yZW1vdmVDaGlsZDtcbnZhciBjcmVhdGVGcmFnbWVudE5vZGUgPSBmcmFnbWVudC5fX19jcmVhdGVGcmFnbWVudE5vZGU7XG52YXIgYmVnaW5GcmFnbWVudE5vZGUgPSBmcmFnbWVudC5fX19iZWdpbkZyYWdtZW50Tm9kZTtcblxudmFyIEVMRU1FTlRfTk9ERSA9IDE7XG52YXIgVEVYVF9OT0RFID0gMztcbnZhciBDT01NRU5UX05PREUgPSA4O1xudmFyIENPTVBPTkVOVF9OT0RFID0gMjtcbnZhciBGUkFHTUVOVF9OT0RFID0gMTI7XG52YXIgRE9DVFlQRV9OT0RFID0gMTA7XG5cbi8vIHZhciBGTEFHX1NJTVBMRV9BVFRSUyA9IDE7XG4vLyB2YXIgRkxBR19DVVNUT01fRUxFTUVOVCA9IDI7XG4vLyB2YXIgRkxBR19TUFJFQURfQVRUUlMgPSA0O1xuXG5mdW5jdGlvbiBpc0F1dG9LZXkoa2V5KSB7XG4gIHJldHVybiBrZXlbMF0gIT09IFwiQFwiO1xufVxuXG5mdW5jdGlvbiBjb21wYXJlTm9kZU5hbWVzKGZyb21FbCwgdG9FbCkge1xuICByZXR1cm4gZnJvbUVsLl9fX25vZGVOYW1lID09PSB0b0VsLl9fX25vZGVOYW1lO1xufVxuXG5mdW5jdGlvbiBjYXNlSW5zZW5zaXRpdmVDb21wYXJlKGEsIGIpIHtcbiAgcmV0dXJuIGEudG9Mb3dlckNhc2UoKSA9PT0gYi50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBvbk5vZGVBZGRlZChub2RlLCBjb21wb25lbnRzQ29udGV4dCkge1xuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgZXZlbnREZWxlZ2F0aW9uLl9fX2hhbmRsZU5vZGVBdHRhY2gobm9kZSwgY29tcG9uZW50c0NvbnRleHQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1vcnBoZG9tKGZyb21Ob2RlLCB0b05vZGUsIGhvc3QsIGNvbXBvbmVudHNDb250ZXh0KSB7XG4gIHZhciBnbG9iYWxDb21wb25lbnRzQ29udGV4dDtcbiAgdmFyIGlzSHlkcmF0ZSA9IGZhbHNlO1xuICB2YXIga2V5U2VxdWVuY2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICBpZiAoY29tcG9uZW50c0NvbnRleHQpIHtcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQ7XG4gICAgaXNIeWRyYXRlID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19faXNIeWRyYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgdk5vZGUsXG4gICAga2V5LFxuICAgIHJlZmVyZW5jZUVsLFxuICAgIHBhcmVudEVsLFxuICAgIG93bmVyQ29tcG9uZW50LFxuICAgIHBhcmVudENvbXBvbmVudCxcbiAgKSB7XG4gICAgdmFyIHJlYWxOb2RlID0gdk5vZGUuX19fYWN0dWFsaXplKGhvc3QsIHBhcmVudEVsLm5hbWVzcGFjZVVSSSk7XG4gICAgaW5zZXJ0QmVmb3JlKHJlYWxOb2RlLCByZWZlcmVuY2VFbCwgcGFyZW50RWwpO1xuXG4gICAgaWYgKFxuICAgICAgdk5vZGUuX19fbm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSB8fFxuICAgICAgdk5vZGUuX19fbm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREVcbiAgICApIHtcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAga2V5c0J5RE9NTm9kZS5zZXQocmVhbE5vZGUsIGtleSk7XG4gICAgICAgIChpc0F1dG9LZXkoa2V5KSA/IHBhcmVudENvbXBvbmVudCA6IG93bmVyQ29tcG9uZW50KS5fX19rZXllZEVsZW1lbnRzW1xuICAgICAgICAgIGtleVxuICAgICAgICBdID0gcmVhbE5vZGU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2Tm9kZS5fX19ub2RlTmFtZSAhPT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4ocmVhbE5vZGUsIHZOb2RlLCBwYXJlbnRDb21wb25lbnQpO1xuICAgICAgfVxuXG4gICAgICBvbk5vZGVBZGRlZChyZWFsTm9kZSwgY29tcG9uZW50c0NvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydFZpcnR1YWxDb21wb25lbnRCZWZvcmUoXG4gICAgdkNvbXBvbmVudCxcbiAgICByZWZlcmVuY2VOb2RlLFxuICAgIHJlZmVyZW5jZU5vZGVQYXJlbnRFbCxcbiAgICBjb21wb25lbnQsXG4gICAga2V5LFxuICAgIG93bmVyQ29tcG9uZW50LFxuICAgIHBhcmVudENvbXBvbmVudCxcbiAgKSB7XG4gICAgdmFyIHJvb3ROb2RlID0gKGNvbXBvbmVudC5fX19yb290Tm9kZSA9IGluc2VydEJlZm9yZShcbiAgICAgIGNyZWF0ZUZyYWdtZW50Tm9kZSgpLFxuICAgICAgcmVmZXJlbmNlTm9kZSxcbiAgICAgIHJlZmVyZW5jZU5vZGVQYXJlbnRFbCxcbiAgICApKTtcbiAgICBjb21wb25lbnRCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBjb21wb25lbnQpO1xuXG4gICAgaWYgKGtleSAmJiBvd25lckNvbXBvbmVudCkge1xuICAgICAga2V5ID0gbm9ybWFsaXplQ29tcG9uZW50S2V5KGtleSwgcGFyZW50Q29tcG9uZW50LmlkKTtcbiAgICAgIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gICAgICAgIG93bmVyQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHMsXG4gICAgICAgIGtleSxcbiAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgIGNvbXBvbmVudC5pZCxcbiAgICAgICk7XG4gICAgICBrZXlzQnlET01Ob2RlLnNldChyb290Tm9kZSwga2V5KTtcbiAgICB9XG5cbiAgICBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIHZDb21wb25lbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9ycGhDb21wb25lbnQoY29tcG9uZW50LCB2Q29tcG9uZW50KSB7XG4gICAgbW9ycGhDaGlsZHJlbihjb21wb25lbnQuX19fcm9vdE5vZGUsIHZDb21wb25lbnQsIGNvbXBvbmVudCk7XG4gIH1cblxuICB2YXIgZGV0YWNoZWROb2RlcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGRldGFjaE5vZGUobm9kZSwgcGFyZW50Tm9kZSwgb3duZXJDb21wb25lbnQpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREUpIHtcbiAgICAgIGRldGFjaGVkTm9kZXMucHVzaChub2RlKTtcbiAgICAgIGRldGFjaGVkQnlET01Ob2RlLnNldChub2RlLCBvd25lckNvbXBvbmVudCB8fCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdHJveU5vZGVSZWN1cnNpdmUobm9kZSk7XG4gICAgICByZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGNvbXBvbmVudC5kZXN0cm95KCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3JwaENoaWxkcmVuKGZyb21Ob2RlLCB0b05vZGUsIHBhcmVudENvbXBvbmVudCkge1xuICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZmlyc3RDaGlsZChmcm9tTm9kZSk7XG4gICAgdmFyIGN1clRvTm9kZUNoaWxkID0gdG9Ob2RlLl9fX2ZpcnN0Q2hpbGQ7XG5cbiAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgIHZhciBjdXJGcm9tTm9kZUtleTtcbiAgICB2YXIgY3VyVG9Ob2RlVHlwZTtcblxuICAgIHZhciBmcm9tTmV4dFNpYmxpbmc7XG4gICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgdmFyIG1hdGNoaW5nRnJvbUVsO1xuICAgIHZhciBtYXRjaGluZ0Zyb21Db21wb25lbnQ7XG4gICAgdmFyIGN1clZGcm9tTm9kZUNoaWxkO1xuICAgIHZhciBmcm9tQ29tcG9uZW50O1xuXG4gICAgb3V0ZXI6IHdoaWxlIChjdXJUb05vZGVDaGlsZCkge1xuICAgICAgdG9OZXh0U2libGluZyA9IGN1clRvTm9kZUNoaWxkLl9fX25leHRTaWJsaW5nO1xuICAgICAgY3VyVG9Ob2RlVHlwZSA9IGN1clRvTm9kZUNoaWxkLl9fX25vZGVUeXBlO1xuICAgICAgY3VyVG9Ob2RlS2V5ID0gY3VyVG9Ob2RlQ2hpbGQuX19fa2V5O1xuXG4gICAgICAvLyBTa2lwIDwhZG9jdHlwZT5cbiAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkICYmIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGUgPT09IERPQ1RZUEVfTk9ERSkge1xuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvd25lckNvbXBvbmVudCA9IGN1clRvTm9kZUNoaWxkLl9fX293bmVyQ29tcG9uZW50IHx8IHBhcmVudENvbXBvbmVudDtcbiAgICAgIHZhciByZWZlcmVuY2VDb21wb25lbnQ7XG5cbiAgICAgIGlmIChjdXJUb05vZGVUeXBlID09PSBDT01QT05FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gY3VyVG9Ob2RlQ2hpbGQuX19fY29tcG9uZW50O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKG1hdGNoaW5nRnJvbUNvbXBvbmVudCA9IGV4aXN0aW5nQ29tcG9uZW50TG9va3VwW2NvbXBvbmVudC5pZF0pID09PVxuICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaXNIeWRyYXRlKSB7XG4gICAgICAgICAgICB2YXIgcm9vdE5vZGUgPSBiZWdpbkZyYWdtZW50Tm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG4gICAgICAgICAgICBjb21wb25lbnQuX19fcm9vdE5vZGUgPSByb290Tm9kZTtcbiAgICAgICAgICAgIGNvbXBvbmVudEJ5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChvd25lckNvbXBvbmVudCAmJiBjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5ID0gbm9ybWFsaXplQ29tcG9uZW50S2V5KFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQuaWQsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gICAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50cyxcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmlkLFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGtleXNCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBjdXJUb05vZGVLZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIGN1clRvTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG5leHRTaWJsaW5nKHJvb3ROb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5zZXJ0VmlydHVhbENvbXBvbmVudEJlZm9yZShcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICBjb21wb25lbnQsXG4gICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtYXRjaGluZ0Zyb21Db21wb25lbnQuX19fcm9vdE5vZGUgIT09IGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCAmJlxuICAgICAgICAgICAgICAoZnJvbUNvbXBvbmVudCA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCkpICYmXG4gICAgICAgICAgICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbXG4gICAgICAgICAgICAgICAgZnJvbUNvbXBvbmVudC5pZFxuICAgICAgICAgICAgICBdID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAvLyBUaGUgY29tcG9uZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCByZWFsIERPTSBub2RlIHdhcyBub3QgcmVuZGVyZWRcbiAgICAgICAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGp1c3QgcmVtb3ZlIGl0IG91dCBvZiB0aGUgcmVhbCBET00gYnkgZGVzdHJveWluZyBpdFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbmV4dFNpYmxpbmcoZnJvbUNvbXBvbmVudC5fX19yb290Tm9kZSk7XG4gICAgICAgICAgICAgIGRlc3Ryb3lDb21wb25lbnQoZnJvbUNvbXBvbmVudCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIG1vdmUgdGhlIGV4aXN0aW5nIGNvbXBvbmVudCBpbnRvXG4gICAgICAgICAgICAvLyB0aGUgY29ycmVjdCBsb2NhdGlvblxuICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICBtYXRjaGluZ0Zyb21Db21wb25lbnQuX19fcm9vdE5vZGUsXG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9XG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgJiYgbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgbW9ycGhDb21wb25lbnQoY29tcG9uZW50LCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAoY3VyVG9Ob2RlS2V5KSB7XG4gICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdW5kZWZpbmVkO1xuICAgICAgICBjdXJGcm9tTm9kZUtleSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGN1clRvTm9kZUtleU9yaWdpbmFsID0gY3VyVG9Ob2RlS2V5O1xuXG4gICAgICAgIGlmIChpc0F1dG9LZXkoY3VyVG9Ob2RlS2V5KSkge1xuICAgICAgICAgIGlmIChvd25lckNvbXBvbmVudCAhPT0gcGFyZW50Q29tcG9uZW50KSB7XG4gICAgICAgICAgICBjdXJUb05vZGVLZXkgKz0gXCI6XCIgKyBvd25lckNvbXBvbmVudC5pZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50ID0gcGFyZW50Q29tcG9uZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudCA9IG93bmVyQ29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgaGF2ZSBhIGtleWVkIGVsZW1lbnQuIFRoaXMgaXMgdGhlIGZhc3QgcGF0aCBmb3IgbWF0Y2hpbmdcbiAgICAgICAgLy8gdXAgZWxlbWVudHNcbiAgICAgICAgY3VyVG9Ob2RlS2V5ID0gKFxuICAgICAgICAgIGtleVNlcXVlbmNlc1tyZWZlcmVuY2VDb21wb25lbnQuaWRdIHx8XG4gICAgICAgICAgKGtleVNlcXVlbmNlc1tyZWZlcmVuY2VDb21wb25lbnQuaWRdID0gbmV3IEtleVNlcXVlbmNlKCkpXG4gICAgICAgICkuX19fbmV4dEtleShjdXJUb05vZGVLZXkpO1xuXG4gICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBrZXlzQnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJGcm9tTm9kZUtleSA9PT0gY3VyVG9Ob2RlS2V5KSB7XG4gICAgICAgICAgLy8gRWxlbWVudHMgbGluZSB1cC4gTm93IHdlIGp1c3QgaGF2ZSB0byBtYWtlIHN1cmUgdGhleSBhcmUgY29tcGF0aWJsZVxuICAgICAgICAgIGlmICghY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUpIHtcbiAgICAgICAgICAgIC8vIFdlIGp1c3Qgc2tpcCBvdmVyIHRoZSBmcm9tTm9kZSBpZiBpdCBpcyBwcmVzZXJ2ZWRcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCAmJlxuICAgICAgICAgICAgICBjdXJUb05vZGVUeXBlID09PSBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlVHlwZSAmJlxuICAgICAgICAgICAgICAoY3VyVG9Ob2RlVHlwZSAhPT0gRUxFTUVOVF9OT0RFIHx8XG4gICAgICAgICAgICAgICAgY29tcGFyZU5vZGVOYW1lcyhjdXJUb05vZGVDaGlsZCwgY3VyVkZyb21Ob2RlQ2hpbGQpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmIChjdXJUb05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKFxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb2xkIG5vZGVcbiAgICAgICAgICAgICAgZGV0YWNoTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSwgb3duZXJDb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgIC8vIEluY29tcGF0aWJsZSBub2Rlcy4gSnVzdCBtb3ZlIHRoZSB0YXJnZXQgVk5vZGUgaW50byB0aGUgRE9NIGF0IHRoaXMgcG9zaXRpb25cbiAgICAgICAgICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGluZ0Zyb21FbCA9IHJlZmVyZW5jZUNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2N1clRvTm9kZUtleV07XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbWF0Y2hpbmdGcm9tRWwgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgbWF0Y2hpbmdGcm9tRWwgPT09IGN1ckZyb21Ob2RlQ2hpbGRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChpc0h5ZHJhdGUgJiYgY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgKGN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlIHx8XG4gICAgICAgICAgICAgICAgICBjYXNlSW5zZW5zaXRpdmVDb21wYXJlKFxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZC5fX19ub2RlTmFtZSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2aXJ0dWFsaXplRWxlbWVudChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlTmFtZSA9IGN1clRvTm9kZUNoaWxkLl9fX25vZGVOYW1lO1xuICAgICAgICAgICAgICAgIGtleXNCeURPTU5vZGUuc2V0KGN1ckZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbY3VyVG9Ob2RlS2V5XSA9XG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICAgICAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVkZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlID09PSBDT01NRU5UX05PREVcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGVudCA9PSBcIkYjXCIgKyBjdXJUb05vZGVLZXlPcmlnaW5hbCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGVuZE5vZGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgdmFyIGRlcHRoID0gMDtcbiAgICAgICAgICAgICAgICAgIHZhciBub2RlVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmROb2RlLm5vZGVUeXBlID09PSBDT01NRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBub2RlVmFsdWUgPSBlbmROb2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZVZhbHVlID09PSBcIkYvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlVmFsdWUuaW5kZXhPZihcIkYjXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXB0aCsrO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbmROb2RlID0gZW5kTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgdmFyIGZyYWdtZW50ID0gY3JlYXRlRnJhZ21lbnROb2RlKFxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBlbmROb2RlLm5leHRTaWJsaW5nLFxuICAgICAgICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBrZXlzQnlET01Ob2RlLnNldChmcmFnbWVudCwgY3VyVG9Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChmcmFnbWVudCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbY3VyVG9Ob2RlS2V5XSA9IGZyYWdtZW50O1xuICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICByZW1vdmVDaGlsZChlbmROb2RlKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKGZyYWdtZW50LCBjdXJUb05vZGVDaGlsZCwgcGFyZW50Q29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyYWdtZW50Lm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGV0YWNoZWRCeURPTU5vZGUuZ2V0KG1hdGNoaW5nRnJvbUVsKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGRldGFjaGVkQnlET01Ob2RlLnNldChtYXRjaGluZ0Zyb21FbCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChtYXRjaGluZ0Zyb21FbCk7XG5cbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkICYmXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlVHlwZSA9PT0gY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZVR5cGUgJiZcbiAgICAgICAgICAgICAgICAoY3VyVG9Ob2RlVHlwZSAhPT0gRUxFTUVOVF9OT0RFIHx8XG4gICAgICAgICAgICAgICAgICBjb21wYXJlTm9kZU5hbWVzKGN1clZGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCkpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgZWxlbWVudCByZW1vdmFsOlxuICAgICAgICAgICAgICAgICAgLy8gQSA8LT4gQVxuICAgICAgICAgICAgICAgICAgLy8gQiA8LT4gQyA8LS0gV2UgYXJlIGhlcmVcbiAgICAgICAgICAgICAgICAgIC8vIEMgICAgIERcbiAgICAgICAgICAgICAgICAgIC8vIERcbiAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgZWxlbWVudCBzd2FwOlxuICAgICAgICAgICAgICAgICAgLy8gQSA8LT4gQVxuICAgICAgICAgICAgICAgICAgLy8gQiA8LT4gQyA8LS0gV2UgYXJlIGhlcmVcbiAgICAgICAgICAgICAgICAgIC8vIEMgICAgIEJcblxuICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nICYmXG4gICAgICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcuX19fa2V5ID09PSBjdXJGcm9tTm9kZUtleVxuICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHN3YXBcblxuICAgICAgICAgICAgICAgICAgICAvLyBXZSB3YW50IHRvIHN0YXkgb24gdGhlIGN1cnJlbnQgcmVhbCBET00gbm9kZVxuICAgICAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEJ1dCBtb3ZlIHRoZSBtYXRjaGluZyBlbGVtZW50IGludG8gcGxhY2VcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgZWxlbWVudCByZW1vdmFsXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byByZW1vdmUgdGhlIGN1cnJlbnQgcmVhbCBET00gbm9kZVxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlIG1hdGNoaW5nIHJlYWwgRE9NIG5vZGUgd2lsbCBmYWxsIGludG9cbiAgICAgICAgICAgICAgICAgICAgLy8gcGxhY2UuIFdlIHdpbGwgY29udGludWUgZGlmZmluZyB3aXRoIG5leHQgc2libGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgcmVhbCBET00gbm9kZSB0aGF0IGp1c3QgZmVsbCBpbnRvIHBsYWNlXG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGZyb21OZXh0U2libGluZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gQSA8LT4gQVxuICAgICAgICAgICAgICAgICAgLy8gQiA8LT4gRCA8LS0gV2UgYXJlIGhlcmVcbiAgICAgICAgICAgICAgICAgIC8vIENcbiAgICAgICAgICAgICAgICAgIC8vIERcblxuICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBtb3ZlIHRoZSBtYXRjaGluZyBub2RlIGludG8gcGxhY2VcbiAgICAgICAgICAgICAgICAgIGluc2VydEFmdGVyKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGRldGFjaE5vZGUobWF0Y2hpbmdGcm9tRWwsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIHByZXNlcnZlIHRoZSBub2RlXG4gICAgICAgICAgICAgIC8vIGJ1dCBzdGlsbCB3ZSBuZWVkIHRvIGRpZmYgdGhlIGN1cnJlbnQgZnJvbSBub2RlXG4gICAgICAgICAgICAgIGluc2VydEJlZm9yZShtYXRjaGluZ0Zyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUpO1xuICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBrbm93IHRoZSB0YXJnZXQgbm9kZSBpcyBub3QgYSBWQ29tcG9uZW50IG5vZGUgYW5kIHdlIGtub3dcbiAgICAgIC8vIGl0IGlzIGFsc28gbm90IGEgcHJlc2VydmUgbm9kZS4gTGV0J3Mgbm93IG1hdGNoIHVwIHRoZSBIVE1MXG4gICAgICAvLyBlbGVtZW50LCB0ZXh0IG5vZGUsIGNvbW1lbnQsIGV0Yy5cbiAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgIGlmICgoZnJvbUNvbXBvbmVudCA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgLy8gVGhlIGN1cnJlbnQgXCJ0b1wiIGVsZW1lbnQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIGNvbXBvbmVudCxcbiAgICAgICAgICAvLyBidXQgdGhlIGN1cnJlbnQgXCJmcm9tXCIgZWxlbWVudCBpcyBhc3NvY2lhdGVkIHdpdGggYSBjb21wb25lbnRcblxuICAgICAgICAgIC8vIEV2ZW4gaWYgd2UgZGVzdHJveSB0aGUgY3VycmVudCBjb21wb25lbnQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgLy8gRE9NIG9yIG5vdCwgd2Ugc3RpbGwgbmVlZCB0byBza2lwIG92ZXIgaXQgc2luY2UgaXQgaXNcbiAgICAgICAgICAvLyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW2Zyb21Db21wb25lbnQuaWRdXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBkZXN0cm95Q29tcG9uZW50KGZyb21Db21wb25lbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRpbnVlOyAvLyBNb3ZlIHRvIHRoZSBuZXh0IFwiZnJvbVwiIG5vZGVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgIHZhciBpc0NvbXBhdGlibGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gY3VyVG9Ob2RlVHlwZSkge1xuICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2RWxlbWVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgICBpZiAoY3VyVkZyb21Ob2RlQ2hpbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBpZiAoaXNIeWRyYXRlKSB7XG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2aXJ0dWFsaXplRWxlbWVudChjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGNhc2VJbnNlbnNpdGl2ZUNvbXBhcmUoXG4gICAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZC5fX19ub2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVOYW1lID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNraXAgb3ZlciBub2RlcyB0aGF0IGRvbid0IGxvb2sgbGlrZSBvdXJzLi4uXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgoY3VyRnJvbU5vZGVLZXkgPSBjdXJWRnJvbU5vZGVDaGlsZC5fX19rZXkpKSB7XG4gICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBrZXllZCBlbGVtZW50IGhlcmUgYnV0IG91ciB0YXJnZXQgVkRPTSBub2RlXG4gICAgICAgICAgICAgIC8vIGlzIG5vdCBrZXllZCBzbyB0aGlzIG5vdCBkb2Vzbid0IGJlbG9uZ1xuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXNDb21wYXRpYmxlID1cbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlICE9PSBmYWxzZSAmJlxuICAgICAgICAgICAgICBjb21wYXJlTm9kZU5hbWVzKGN1clZGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCkgPT09IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgIC8vIHRoZSBjdXJyZW50IFwiZnJvbVwiIG5vZGUgdG8gbWF0Y2ggdGhlIGN1cnJlbnRcbiAgICAgICAgICAgICAgLy8gdGFyZ2V0IERPTSBub2RlLlxuICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBjdXJGcm9tTm9kZVR5cGUgPT09IFRFWFRfTk9ERSB8fFxuICAgICAgICAgICAgY3VyRnJvbU5vZGVUeXBlID09PSBDT01NRU5UX05PREVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIFRleHQgb3IgQ29tbWVudCBub2Rlc1xuICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVWYWx1ZSA9IGN1clRvTm9kZUNoaWxkLl9fX25vZGVWYWx1ZTtcbiAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVZhbHVlID0gY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlVmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGlzSHlkcmF0ZSAmJlxuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZVR5cGUgPT09IFRFWFRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcuX19fbm9kZVR5cGUgPT09IFRFWFRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlVmFsdWUuc3RhcnRzV2l0aChjdXJUb05vZGVWYWx1ZSkgJiZcbiAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nLl9fX25vZGVWYWx1ZS5zdGFydHNXaXRoKFxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVWYWx1ZS5zbGljZShjdXJUb05vZGVWYWx1ZS5sZW5ndGgpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gaHlkcmF0ZSBtb2RlIHdlIGNhbiB1c2Ugc3BsaXRUZXh0IHRvIG1vcmUgZWZmaWNpZW50bHkgaGFuZGxlXG4gICAgICAgICAgICAgICAgLy8gYWRqYWNlbnQgdGV4dCB2ZG9tIG5vZGVzIHRoYXQgd2VyZSBtZXJnZWQuXG4gICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5zcGxpdFRleHQoXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTaW1wbHkgdXBkYXRlIG5vZGVWYWx1ZSBvbiB0aGUgb3JpZ2luYWwgbm9kZSB0b1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0aGUgdGV4dCB2YWx1ZVxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlID0gY3VyVG9Ob2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNDb21wYXRpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgLy8gQWR2YW5jZSBib3RoIHRoZSBcInRvXCIgY2hpbGQgYW5kIHRoZSBcImZyb21cIiBjaGlsZCBzaW5jZSB3ZSBmb3VuZCBhIG1hdGNoXG4gICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9IC8vIEVORDogd2hpbGUgKGN1ckZyb21Ob2RlQ2hpbGQpXG5cbiAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgIC8vIG91ciBcInRvIG5vZGVcIiBhbmQgd2UgZXhoYXVzdGVkIGFsbCBvZiB0aGUgY2hpbGRyZW4gXCJmcm9tXCJcbiAgICAgIC8vIG5vZGVzLiBUaGVyZWZvcmUsIHdlIHdpbGwganVzdCBhcHBlbmQgdGhlIGN1cnJlbnQgXCJ0b1wiIG5vZGVcbiAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICk7XG5cbiAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgfVxuXG4gICAgLy8gV2UgaGF2ZSBwcm9jZXNzZWQgYWxsIG9mIHRoZSBcInRvIG5vZGVzXCIuXG4gICAgaWYgKGZyb21Ob2RlLl9fX2ZpbmlzaEZyYWdtZW50KSB7XG4gICAgICAvLyBJZiB3ZSBhcmUgaW4gYW4gdW5maW5pc2hlZCBmcmFnbWVudCwgd2UgaGF2ZSByZWFjaGVkIHRoZSBlbmQgb2YgdGhlIG5vZGVzXG4gICAgICAvLyB3ZSB3ZXJlIG1hdGNoaW5nIHVwIGFuZCBuZWVkIHRvIGVuZCB0aGUgZnJhZ21lbnRcbiAgICAgIGZyb21Ob2RlLl9fX2ZpbmlzaEZyYWdtZW50KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBjdXJGcm9tTm9kZUNoaWxkIGlzIG5vbi1udWxsIHRoZW4gd2Ugc3RpbGwgaGF2ZSBzb21lIGZyb20gbm9kZXNcbiAgICAgIC8vIGxlZnQgb3ZlciB0aGF0IG5lZWQgdG8gYmUgcmVtb3ZlZFxuICAgICAgdmFyIGZyYWdtZW50Qm91bmRhcnkgPVxuICAgICAgICBmcm9tTm9kZS5ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERSA/IGZyb21Ob2RlLmVuZE5vZGUgOiBudWxsO1xuXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCAmJiBjdXJGcm9tTm9kZUNoaWxkICE9PSBmcmFnbWVudEJvdW5kYXJ5KSB7XG4gICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgIGlmICgoZnJvbUNvbXBvbmVudCA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtmcm9tQ29tcG9uZW50LmlkXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgZGVzdHJveUNvbXBvbmVudChmcm9tQ29tcG9uZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBrZXlzQnlET01Ob2RlLmdldChmcm9tTm9kZSk7XG5cbiAgICAgICAgLy8gRm9yIHRyYW5zY2x1ZGVkIGNvbnRlbnQsIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIGVsZW1lbnQgYmVsb25ncyB0byBhIGRpZmZlcmVudCBjb21wb25lbnRcbiAgICAgICAgLy8gY29udGV4dCB0aGFuIHRoZSBjdXJyZW50IGNvbXBvbmVudCBhbmQgZW5zdXJlIGl0IGdldHMgcmVtb3ZlZCBmcm9tIGl0cyBrZXkgaW5kZXguXG4gICAgICAgIGlmICghY3VyRnJvbU5vZGVLZXkgfHwgaXNBdXRvS2V5KGN1ckZyb21Ob2RlS2V5KSkge1xuICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudCA9IHBhcmVudENvbXBvbmVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQgPVxuICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgJiYgY3VyVkZyb21Ob2RlQ2hpbGQuX19fb3duZXJDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCByZWZlcmVuY2VDb21wb25lbnQpO1xuXG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW9ycGhFbChmcm9tRWwsIHZGcm9tRWwsIHRvRWwsIHBhcmVudENvbXBvbmVudCkge1xuICAgIHZhciBub2RlTmFtZSA9IHRvRWwuX19fbm9kZU5hbWU7XG4gICAgdmFyIGNvbnN0SWQgPSB0b0VsLl9fX2NvbnN0SWQ7XG4gICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGZyb21FbCwgdG9FbCk7XG5cbiAgICBpZiAoY29uc3RJZCAhPT0gdW5kZWZpbmVkICYmIHZGcm9tRWwuX19fY29uc3RJZCA9PT0gY29uc3RJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB2RnJvbUVsLCB0b0VsKTtcblxuICAgIGlmICh0b0VsLl9fX3ByZXNlcnZlQm9keSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICBpZiAodG9FbC5fX192YWx1ZUludGVybmFsICE9PSB2RnJvbUVsLl9fX3ZhbHVlSW50ZXJuYWwpIHtcbiAgICAgICAgZnJvbUVsLnZhbHVlID0gdG9FbC5fX192YWx1ZUludGVybmFsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtb3JwaENoaWxkcmVuKGZyb21FbCwgdG9FbCwgcGFyZW50Q29tcG9uZW50KTtcbiAgICB9XG4gIH0gLy8gRU5EOiBtb3JwaEVsKC4uLilcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBjb21wb25lbnRzVXRpbC5fX19zdG9wRE9NTWFuaXB1bGF0aW9uV2FybmluZyhob3N0KTtcbiAgfVxuXG4gIG1vcnBoQ2hpbGRyZW4oZnJvbU5vZGUsIHRvTm9kZSwgdG9Ob2RlLl9fX2NvbXBvbmVudCk7XG5cbiAgZGV0YWNoZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIGRldGFjaGVkRnJvbUNvbXBvbmVudCA9IGRldGFjaGVkQnlET01Ob2RlLmdldChub2RlKTtcblxuICAgIGlmIChkZXRhY2hlZEZyb21Db21wb25lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGV0YWNoZWRCeURPTU5vZGUuc2V0KG5vZGUsIHVuZGVmaW5lZCk7XG5cbiAgICAgIHZhciBjb21wb25lbnRUb0Rlc3Ryb3kgPSBjb21wb25lbnRCeURPTU5vZGUuZ2V0KG5vZGUpO1xuICAgICAgaWYgKGNvbXBvbmVudFRvRGVzdHJveSkge1xuICAgICAgICBjb21wb25lbnRUb0Rlc3Ryb3kuZGVzdHJveSgpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgZGVzdHJveU5vZGVSZWN1cnNpdmUoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBkZXRhY2hlZEZyb21Db21wb25lbnQgIT09IHRydWUgJiYgZGV0YWNoZWRGcm9tQ29tcG9uZW50LFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChldmVudERlbGVnYXRpb24uX19faGFuZGxlTm9kZURldGFjaChub2RlKSAhPSBmYWxzZSkge1xuICAgICAgICAgIHJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBjb21wb25lbnRzVXRpbC5fX19zdGFydERPTU1hbmlwdWxhdGlvbldhcm5pbmcoaG9zdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtb3JwaGRvbTtcbiIsInZhciBwYXJzZUhUTUwgPSBmdW5jdGlvbiAoaHRtbCkge1xuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICBwYXJzZUhUTUwgPSBjb250YWluZXIuY29udGVudFxuICAgID8gZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHJldHVybiBjb250YWluZXIuY29udGVudDtcbiAgICAgIH1cbiAgICA6IGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgICAgfTtcblxuICByZXR1cm4gcGFyc2VIVE1MKGh0bWwpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaHRtbCkge1xuICByZXR1cm4gcGFyc2VIVE1MKGh0bWwpLmZpcnN0Q2hpbGQ7XG59O1xuIiwidmFyIHBhcnNlSFRNTCA9IHJlcXVpcmUoXCIuL3BhcnNlLWh0bWxcIik7XG52YXIgVkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL1ZDb21wb25lbnRcIik7XG52YXIgVkRvY3VtZW50RnJhZ21lbnQgPSByZXF1aXJlKFwiLi9WRG9jdW1lbnRGcmFnbWVudFwiKTtcbnZhciBWRWxlbWVudCA9IHJlcXVpcmUoXCIuL1ZFbGVtZW50XCIpO1xudmFyIFZGcmFnbWVudCA9IHJlcXVpcmUoXCIuL1ZGcmFnbWVudFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xudmFyIFZUZXh0ID0gcmVxdWlyZShcIi4vVlRleHRcIik7XG5cbnZhciBzcGVjaWFsSHRtbFJlZ2V4cCA9IC9bJjxdLztcblxuZnVuY3Rpb24gdmlydHVhbGl6ZUNoaWxkTm9kZXMobm9kZSwgdmRvbVBhcmVudCwgb3duZXJDb21wb25lbnQpIHtcbiAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICB2ZG9tUGFyZW50Ll9fX2FwcGVuZENoaWxkKHZpcnR1YWxpemUoY3VyQ2hpbGQsIG93bmVyQ29tcG9uZW50KSk7XG4gICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiB2aXJ0dWFsaXplKG5vZGUsIG93bmVyQ29tcG9uZW50KSB7XG4gIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBWRWxlbWVudC5fX192aXJ0dWFsaXplKG5vZGUsIHZpcnR1YWxpemVDaGlsZE5vZGVzLCBvd25lckNvbXBvbmVudCk7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIG5ldyBWVGV4dChub2RlLm5vZGVWYWx1ZSwgb3duZXJDb21wb25lbnQpO1xuICAgIGNhc2UgMTE6XG4gICAgICB2YXIgdmRvbURvY0ZyYWdtZW50ID0gbmV3IFZEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICB2aXJ0dWFsaXplQ2hpbGROb2Rlcyhub2RlLCB2ZG9tRG9jRnJhZ21lbnQsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgIHJldHVybiB2ZG9tRG9jRnJhZ21lbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmlydHVhbGl6ZUhUTUwoaHRtbCwgb3duZXJDb21wb25lbnQpIHtcbiAgaWYgKCFzcGVjaWFsSHRtbFJlZ2V4cC50ZXN0KGh0bWwpKSB7XG4gICAgcmV0dXJuIG5ldyBWVGV4dChodG1sLCBvd25lckNvbXBvbmVudCk7XG4gIH1cblxuICB2YXIgdmRvbUZyYWdtZW50ID0gbmV3IFZEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBjdXJDaGlsZCA9IHBhcnNlSFRNTChodG1sKTtcblxuICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICB2ZG9tRnJhZ21lbnQuX19fYXBwZW5kQ2hpbGQodmlydHVhbGl6ZShjdXJDaGlsZCwgb3duZXJDb21wb25lbnQpKTtcbiAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIHZkb21GcmFnbWVudDtcbn1cblxudmFyIE5vZGVfcHJvdG90eXBlID0gVk5vZGUucHJvdG90eXBlO1xuXG4vKipcbiAqIFNob3J0aGFuZCBtZXRob2QgZm9yIGNyZWF0aW5nIGFuZCBhcHBlbmRpbmcgYSBUZXh0IG5vZGUgd2l0aCBhIGdpdmVuIHZhbHVlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHZhbHVlIFRoZSB0ZXh0IHZhbHVlIGZvciB0aGUgbmV3IFRleHQgbm9kZVxuICovXG5Ob2RlX3Byb3RvdHlwZS50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICB2YXIgdmRvbU5vZGU7XG5cbiAgaWYgKHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgdmFsdWUgPSBcIlwiO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgaWYgKHZhbHVlLnRvSFRNTCkge1xuICAgICAgICB2ZG9tTm9kZSA9IHZpcnR1YWxpemVIVE1MKHZhbHVlLnRvSFRNTCgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLl9fX2FwcGVuZENoaWxkKHZkb21Ob2RlIHx8IG5ldyBWVGV4dCh2YWx1ZS50b1N0cmluZygpKSk7XG4gIHJldHVybiB0aGlzLl9fX2ZpbmlzaENoaWxkKCk7XG59O1xuXG5Ob2RlX3Byb3RvdHlwZS5fX19hcHBlbmREb2N1bWVudEZyYWdtZW50ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fX19hcHBlbmRDaGlsZChuZXcgVkRvY3VtZW50RnJhZ21lbnQoKSk7XG59O1xuXG5leHBvcnRzLl9fX1ZEb2N1bWVudEZyYWdtZW50ID0gVkRvY3VtZW50RnJhZ21lbnQ7XG5leHBvcnRzLl9fX1ZFbGVtZW50ID0gVkVsZW1lbnQ7XG5leHBvcnRzLl9fX1ZUZXh0ID0gVlRleHQ7XG5leHBvcnRzLl9fX1ZDb21wb25lbnQgPSBWQ29tcG9uZW50O1xuZXhwb3J0cy5fX19WRnJhZ21lbnQgPSBWRnJhZ21lbnQ7XG5leHBvcnRzLl9fX3ZpcnR1YWxpemUgPSB2aXJ0dWFsaXplO1xuZXhwb3J0cy5fX192aXJ0dWFsaXplSFRNTCA9IHZpcnR1YWxpemVIVE1MO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb3B5UHJvcHMoZnJvbSwgdG8pIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhmcm9tKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZyb20sIG5hbWUpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodG8sIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH0pO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQsIHNvdXJjZSkgeyAvL0Egc2ltcGxlIGZ1bmN0aW9uIHRvIGNvcHkgcHJvcGVydGllcyBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlclxuICAgIGlmICghdGFyZ2V0KSB7IC8vQ2hlY2sgaWYgYSB0YXJnZXQgd2FzIHByb3ZpZGVkLCBvdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5IG9iamVjdCB0byByZXR1cm5cbiAgICAgICAgdGFyZ2V0ID0ge307XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7IC8vT25seSBsb29rIGF0IHNvdXJjZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBpbmhlcml0ZWRcbiAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcE5hbWVdID0gc291cmNlW3Byb3BOYW1lXTsgLy9Db3B5IHRoZSBwcm9wZXJ0eVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07IiwidmFyIGNvcHlQcm9wcyA9IHJlcXVpcmUoJy4vY29weVByb3BzJyk7XG5cbmZ1bmN0aW9uIGluaGVyaXQoY3Rvciwgc3VwZXJDdG9yLCBzaG91bGRDb3B5UHJvcHMpIHtcbiAgICB2YXIgb2xkUHJvdG8gPSBjdG9yLnByb3RvdHlwZTtcbiAgICB2YXIgbmV3UHJvdG8gPSBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG9sZFByb3RvICYmIHNob3VsZENvcHlQcm9wcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgY29weVByb3BzKG9sZFByb3RvLCBuZXdQcm90byk7XG4gICAgfVxuICAgIGN0b3IuJHN1cGVyID0gc3VwZXJDdG9yO1xuICAgIGN0b3IucHJvdG90eXBlID0gbmV3UHJvdG87XG4gICAgcmV0dXJuIGN0b3I7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBpbmhlcml0O1xuaW5oZXJpdC5faW5oZXJpdCA9IGluaGVyaXQ7XG4iLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24gKFVNRCkgdG8gc3VwcG9ydCBBTUQsIENvbW1vbkpTL05vZGUuanMsIFJoaW5vLCBhbmQgYnJvd3NlcnMuXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKCdzdGFja2ZyYW1lJywgW10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuU3RhY2tGcmFtZSA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBfaXNOdW1iZXIobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jYXBpdGFsaXplKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0dGVyKHApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbcF07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGJvb2xlYW5Qcm9wcyA9IFsnaXNDb25zdHJ1Y3RvcicsICdpc0V2YWwnLCAnaXNOYXRpdmUnLCAnaXNUb3BsZXZlbCddO1xuICAgIHZhciBudW1lcmljUHJvcHMgPSBbJ2NvbHVtbk51bWJlcicsICdsaW5lTnVtYmVyJ107XG4gICAgdmFyIHN0cmluZ1Byb3BzID0gWydmaWxlTmFtZScsICdmdW5jdGlvbk5hbWUnLCAnc291cmNlJ107XG4gICAgdmFyIGFycmF5UHJvcHMgPSBbJ2FyZ3MnXTtcbiAgICB2YXIgb2JqZWN0UHJvcHMgPSBbJ2V2YWxPcmlnaW4nXTtcblxuICAgIHZhciBwcm9wcyA9IGJvb2xlYW5Qcm9wcy5jb25jYXQobnVtZXJpY1Byb3BzLCBzdHJpbmdQcm9wcywgYXJyYXlQcm9wcywgb2JqZWN0UHJvcHMpO1xuXG4gICAgZnVuY3Rpb24gU3RhY2tGcmFtZShvYmopIHtcbiAgICAgICAgaWYgKCFvYmopIHJldHVybjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9ialtwcm9wc1tpXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXNbJ3NldCcgKyBfY2FwaXRhbGl6ZShwcm9wc1tpXSldKG9ialtwcm9wc1tpXV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgU3RhY2tGcmFtZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldEFyZ3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJncztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0QXJnczogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3MgbXVzdCBiZSBhbiBBcnJheScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcmdzID0gdjtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRFdmFsT3JpZ2luOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWxPcmlnaW47XG4gICAgICAgIH0sXG4gICAgICAgIHNldEV2YWxPcmlnaW46IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIGlmICh2IGluc3RhbmNlb2YgU3RhY2tGcmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZhbE9yaWdpbiA9IHY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2YWxPcmlnaW4gPSBuZXcgU3RhY2tGcmFtZSh2KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXZhbCBPcmlnaW4gbXVzdCBiZSBhbiBPYmplY3Qgb3IgU3RhY2tGcmFtZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHRoaXMuZ2V0RmlsZU5hbWUoKSB8fCAnJztcbiAgICAgICAgICAgIHZhciBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5OdW1iZXIoKSB8fCAnJztcbiAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0aGlzLmdldEZ1bmN0aW9uTmFtZSgpIHx8ICcnO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0SXNFdmFsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdbZXZhbF0gKCcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXIgKyAnKSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAnW2V2YWxdOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZ1bmN0aW9uTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbk5hbWUgKyAnICgnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyICsgJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlcjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTdGFja0ZyYW1lLmZyb21TdHJpbmcgPSBmdW5jdGlvbiBTdGFja0ZyYW1lJCRmcm9tU3RyaW5nKHN0cikge1xuICAgICAgICB2YXIgYXJnc1N0YXJ0SW5kZXggPSBzdHIuaW5kZXhPZignKCcpO1xuICAgICAgICB2YXIgYXJnc0VuZEluZGV4ID0gc3RyLmxhc3RJbmRleE9mKCcpJyk7XG5cbiAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHN0ci5zdWJzdHJpbmcoMCwgYXJnc1N0YXJ0SW5kZXgpO1xuICAgICAgICB2YXIgYXJncyA9IHN0ci5zdWJzdHJpbmcoYXJnc1N0YXJ0SW5kZXggKyAxLCBhcmdzRW5kSW5kZXgpLnNwbGl0KCcsJyk7XG4gICAgICAgIHZhciBsb2NhdGlvblN0cmluZyA9IHN0ci5zdWJzdHJpbmcoYXJnc0VuZEluZGV4ICsgMSk7XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uU3RyaW5nLmluZGV4T2YoJ0AnKSA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gL0AoLis/KSg/OjooXFxkKykpPyg/OjooXFxkKykpPyQvLmV4ZWMobG9jYXRpb25TdHJpbmcsICcnKTtcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgdmFyIGxpbmVOdW1iZXIgPSBwYXJ0c1syXTtcbiAgICAgICAgICAgIHZhciBjb2x1bW5OdW1iZXIgPSBwYXJ0c1szXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3MgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlciB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGNvbHVtbk51bWJlciB8fCB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9vbGVhblByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydnZXQnICsgX2NhcGl0YWxpemUoYm9vbGVhblByb3BzW2ldKV0gPSBfZ2V0dGVyKGJvb2xlYW5Qcm9wc1tpXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUoYm9vbGVhblByb3BzW2ldKV0gPSAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3BdID0gQm9vbGVhbih2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKGJvb2xlYW5Qcm9wc1tpXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW1lcmljUHJvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShudW1lcmljUHJvcHNbal0pXSA9IF9nZXR0ZXIobnVtZXJpY1Byb3BzW2pdKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShudW1lcmljUHJvcHNbal0pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIGlmICghX2lzTnVtYmVyKHYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IocCArICcgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzW3BdID0gTnVtYmVyKHYpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkobnVtZXJpY1Byb3BzW2pdKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrID0gMDsgayA8IHN0cmluZ1Byb3BzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydnZXQnICsgX2NhcGl0YWxpemUoc3RyaW5nUHJvcHNba10pXSA9IF9nZXR0ZXIoc3RyaW5nUHJvcHNba10pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKHN0cmluZ1Byb3BzW2tdKV0gPSAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3BdID0gU3RyaW5nKHYpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoc3RyaW5nUHJvcHNba10pO1xuICAgIH1cblxuICAgIHJldHVybiBTdGFja0ZyYW1lO1xufSkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9zcmMvY29uc3RhbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvZmluYWxpemUnKTsiLCJ2YXIgd2luID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IGdsb2JhbDtcbmV4cG9ydHMuTk9PUCA9IHdpbi4kVzEwTk9PUCA9IHdpbi4kVzEwTk9PUCB8fCBmdW5jdGlvbiAoKSB7fTsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzXCIpO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5mdW5jdGlvbiByZXNvbHZlKG9iamVjdCwgcGF0aCwgbGVuKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBvYmplY3Q7XG4gICAgZm9yICh2YXIgaT0wOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50W3BhdGhbaV1dO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlVHlwZShpbmZvKSB7XG4gICAgaWYgKGluZm8udHlwZSA9PT0gJ0RhdGUnKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShpbmZvLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGluZm8udHlwZSA9PT0gJ1VSTCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVUkwoaW5mby52YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLnR5cGUgPT09ICdVUkxTZWFyY2hQYXJhbXMnKSB7XG4gICAgICAgIHJldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKGluZm8udmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoaW5mby50eXBlID09PSAnTk9PUCcpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0YW50cy5OT09QO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHR5cGUnKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluYWxpemUob3V0ZXIpIHtcbiAgICBpZiAoIW91dGVyKSB7XG4gICAgICAgIHJldHVybiBvdXRlcjtcbiAgICB9XG5cbiAgICB2YXIgYXNzaWdubWVudHMgPSBvdXRlci4kJDtcbiAgICBpZiAoYXNzaWdubWVudHMpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IG91dGVyLm87XG4gICAgICAgIHZhciBsZW47XG5cbiAgICAgICAgaWYgKGFzc2lnbm1lbnRzICYmIChsZW49YXNzaWdubWVudHMubGVuZ3RoKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFzc2lnbm1lbnQgPSBhc3NpZ25tZW50c1tpXTtcblxuICAgICAgICAgICAgICAgIHZhciByaHMgPSBhc3NpZ25tZW50LnI7XG4gICAgICAgICAgICAgICAgdmFyIHJoc1ZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkocmhzKSkge1xuICAgICAgICAgICAgICAgICAgICByaHNWYWx1ZSA9IHJlc29sdmUob2JqZWN0LCByaHMsIHJocy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJoc1ZhbHVlID0gcmVzb2x2ZVR5cGUocmhzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbGhzID0gYXNzaWdubWVudC5sO1xuICAgICAgICAgICAgICAgIHZhciBsaHNMYXN0ID0gbGhzLmxlbmd0aC0xO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxoc0xhc3QgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IG91dGVyLm8gPSByaHNWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxoc1BhcmVudCA9IHJlc29sdmUob2JqZWN0LCBsaHMsIGxoc0xhc3QpO1xuICAgICAgICAgICAgICAgICAgICBsaHNQYXJlbnRbbGhzW2xoc0xhc3RdXSA9IHJoc1ZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFzc2lnbm1lbnRzLmxlbmd0aCA9IDA7IC8vIEFzc2lnbm1lbnRzIGhhdmUgYmVlbiBhcHBsaWVkLCBkbyBub3QgcmVhcHBseVxuXG4gICAgICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IG51bGwgOiBvYmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG91dGVyO1xuICAgIH1cblxufTsiLCJpbXBvcnQgcGFzc3dvcmRfcGFnZSBmcm9tICcuL21hcmtvL2hvbWUvY29tcG9uZW50cy9wYXNzd29yZC5tYXJrbyc7XHJcblxyXG5sZXQgQ09OVEVOVCA9IHt9O1xyXG5cclxuQ09OVEVOVC5FeGVjdXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgc3dpdGNoKFN0b3JlLnN0YXRlLmFjdGlvbikge1xyXG4gICAgY2FzZSBBY3Rpb24uVVBEQVRFX0hPTUVfQ09OVEVOVDpcclxuICAgICAgbGV0IG91dHB1dCA9IFN0b3JlLnN0YXRlLm91dHB1dDtcclxuICAgICAgc3dpdGNoKFN0b3JlLnN0YXRlLnRhcmdldCkge1xyXG4gICAgICAgIGNhc2UgJ3Bhc3N3b3JkLWJ1dHRvbic6XHJcbiAgICAgICAgICBDT05URU5ULnJlbmRlciA9IHBhc3N3b3JkX3BhZ2UucmVuZGVyU3luYygpLnJlcGxhY2VDaGlsZHJlbk9mKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcblN0b3JlLkJpbmQoQ09OVEVOVC5FeGVjdXRlKTsiLCJpbXBvcnQgaG9tZSBmcm9tIFwiLi9tYXJrby9ob21lL2hvbWUubWFya29cIlxyXG5sZXQgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNvbnRhaW5lclwiKTtcclxuXHJcbmxldCBJTklUID0ge307XHJcblxyXG5JTklULkV4ZWN1dGUgPSBmdW5jdGlvbigpIHtcclxuICBzd2l0Y2goU3RvcmUuc3RhdGUuYWN0aW9uKSB7XHJcbiAgICBjYXNlIEFjdGlvbi5TVEFSVDpcclxuICAgICAgSU5JVC5yZW5kZXIgPSBob21lLnJlbmRlclN5bmMoKS5yZXBsYWNlQ2hpbGRyZW5PZihvdXRwdXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgQWN0aW9uLlNIT1dfSE9NRTpcclxuICAgICAgSU5JVC5yZW5kZXIgPSBob21lLnJlbmRlclN5bmMoKS5yZXBsYWNlQ2hpbGRyZW5PZihvdXRwdXQpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgY29uc29sZS5sb2coXCJlcnJvcj9cIilcclxuICB9XHJcbn1cclxuXHJcblN0b3JlLkJpbmQoSU5JVC5FeGVjdXRlKTsiLCIkKGZ1bmN0aW9uICgpIHtcclxuICAkKCcjdG9vbGJhcicpLncydG9vbGJhcih7XHJcbiAgICAgIG5hbWUgOiAnbXlUb29sYmFyJyxcclxuICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgIHsgdHlwZTogJ3JhZGlvJywgIGlkOiAnaG9tZScsIGdyb3VwOiAnMScsIGNhcHRpb246ICdIb21lJywgaW1nOiAnaWNvbi1hZGQnLCBjaGVja2VkOiB0cnVlIH0sXHJcbiAgICAgICAgICB7IHR5cGU6ICdicmVhaycgfSxcclxuICAgICAgICAgIHsgdHlwZTogJ21lbnUnLCAgIGlkOiAncGVyc29uZU1lbnUnLCBjYXB0aW9uOiAnRHJvcCBEb3duJywgaW1nOiAnaWNvbi1mb2xkZXInLCBcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdJdGVtIDEnLCBpbWc6ICdpY29uLXBhZ2UnIH0sIFxyXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdJdGVtIDInLCBpbWc6ICdpY29uLXBhZ2UnIH0sIFxyXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdJdGVtIDMnLCBpbWc6ICdpY29uLXBhZ2UnIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyB0eXBlOiAnYnJlYWsnIH0sXHJcbiAgICAgICAgICB7IHR5cGU6ICdyYWRpbycsICBpZDogJ3BlcnNvbmUnLCAgZ3JvdXA6ICcxJywgY2FwdGlvbjogJ1BlcnNvbmUnLCBpbWc6ICdpY29uLXBhZ2UnIH0sXHJcbiAgICAgICAgICB7IHR5cGU6ICdyYWRpbycsICBpZDogJ3N0cnV0dHVyZScsICBncm91cDogJzEnLCBjYXB0aW9uOiAnU3RydXR0dXJlJywgaW1nOiAnaWNvbi1wYWdlJyB9LFxyXG4gICAgICAgICAgeyB0eXBlOiAnc3BhY2VyJyB9LFxyXG4gICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgIGlkOiAnaXRlbTUnLCAgY2FwdGlvbjogJ0xvZ091dCcsIGNsYXNzOiAnbG9nLW91dC1pY29uJywgaW1nOiAnaWNvbi1sb2dvdXQnIH1cclxuICAgICAgXSxcclxuXHJcbiAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgc3dpdGNoKGV2ZW50LnRhcmdldCkge1xyXG4gICAgICAgICAgY2FzZSAnaG9tZSc6XHJcbiAgICAgICAgICAgIFN0b3JlLk5ld1N0YXRlKHNob3dIb21lKCkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBtYWluIG1lbnUgYWN0aW9uIGZpbmQnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfSk7XHJcbn0pOyIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcblxyXG5sZXQgdSA9IHt9O1xyXG5cclxudS5tYWtlUmVxdWVzdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICByZXR1cm4gYXhpb3MucmVxdWVzdChvcHRpb25zKVxyXG4gIC50aGVuKHJlcyA9PiB7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHU7XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgaHR0cEFkYXB0ZXIgZnJvbSAnLi9odHRwLmpzJztcbmltcG9ydCB4aHJBZGFwdGVyIGZyb20gJy4veGhyLmpzJztcbmltcG9ydCBmZXRjaEFkYXB0ZXIgZnJvbSAnLi9mZXRjaC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5cbmNvbnN0IGtub3duQWRhcHRlcnMgPSB7XG4gIGh0dHA6IGh0dHBBZGFwdGVyLFxuICB4aHI6IHhockFkYXB0ZXIsXG4gIGZldGNoOiBmZXRjaEFkYXB0ZXJcbn1cblxudXRpbHMuZm9yRWFjaChrbm93bkFkYXB0ZXJzLCAoZm4sIHZhbHVlKSA9PiB7XG4gIGlmIChmbikge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sICduYW1lJywge3ZhbHVlfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgJ2FkYXB0ZXJOYW1lJywge3ZhbHVlfSk7XG4gIH1cbn0pO1xuXG5jb25zdCByZW5kZXJSZWFzb24gPSAocmVhc29uKSA9PiBgLSAke3JlYXNvbn1gO1xuXG5jb25zdCBpc1Jlc29sdmVkSGFuZGxlID0gKGFkYXB0ZXIpID0+IHV0aWxzLmlzRnVuY3Rpb24oYWRhcHRlcikgfHwgYWRhcHRlciA9PT0gbnVsbCB8fCBhZGFwdGVyID09PSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRBZGFwdGVyOiAoYWRhcHRlcnMpID0+IHtcbiAgICBhZGFwdGVycyA9IHV0aWxzLmlzQXJyYXkoYWRhcHRlcnMpID8gYWRhcHRlcnMgOiBbYWRhcHRlcnNdO1xuXG4gICAgY29uc3Qge2xlbmd0aH0gPSBhZGFwdGVycztcbiAgICBsZXQgbmFtZU9yQWRhcHRlcjtcbiAgICBsZXQgYWRhcHRlcjtcblxuICAgIGNvbnN0IHJlamVjdGVkUmVhc29ucyA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbmFtZU9yQWRhcHRlciA9IGFkYXB0ZXJzW2ldO1xuICAgICAgbGV0IGlkO1xuXG4gICAgICBhZGFwdGVyID0gbmFtZU9yQWRhcHRlcjtcblxuICAgICAgaWYgKCFpc1Jlc29sdmVkSGFuZGxlKG5hbWVPckFkYXB0ZXIpKSB7XG4gICAgICAgIGFkYXB0ZXIgPSBrbm93bkFkYXB0ZXJzWyhpZCA9IFN0cmluZyhuYW1lT3JBZGFwdGVyKSkudG9Mb3dlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKGFkYXB0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKGBVbmtub3duIGFkYXB0ZXIgJyR7aWR9J2ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGFwdGVyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZWplY3RlZFJlYXNvbnNbaWQgfHwgJyMnICsgaV0gPSBhZGFwdGVyO1xuICAgIH1cblxuICAgIGlmICghYWRhcHRlcikge1xuXG4gICAgICBjb25zdCByZWFzb25zID0gT2JqZWN0LmVudHJpZXMocmVqZWN0ZWRSZWFzb25zKVxuICAgICAgICAubWFwKChbaWQsIHN0YXRlXSkgPT4gYGFkYXB0ZXIgJHtpZH0gYCArXG4gICAgICAgICAgKHN0YXRlID09PSBmYWxzZSA/ICdpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBlbnZpcm9ubWVudCcgOiAnaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgYnVpbGQnKVxuICAgICAgICApO1xuXG4gICAgICBsZXQgcyA9IGxlbmd0aCA/XG4gICAgICAgIChyZWFzb25zLmxlbmd0aCA+IDEgPyAnc2luY2UgOlxcbicgKyByZWFzb25zLm1hcChyZW5kZXJSZWFzb24pLmpvaW4oJ1xcbicpIDogJyAnICsgcmVuZGVyUmVhc29uKHJlYXNvbnNbMF0pKSA6XG4gICAgICAgICdhcyBubyBhZGFwdGVyIHNwZWNpZmllZCc7XG5cbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBgVGhlcmUgaXMgbm8gc3VpdGFibGUgYWRhcHRlciB0byBkaXNwYXRjaCB0aGUgcmVxdWVzdCBgICsgcyxcbiAgICAgICAgJ0VSUl9OT1RfU1VQUE9SVCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkYXB0ZXI7XG4gIH0sXG4gIGFkYXB0ZXJzOiBrbm93bkFkYXB0ZXJzXG59XG4iLCJpbXBvcnQgcGxhdGZvcm0gZnJvbSBcIi4uL3BsYXRmb3JtL2luZGV4LmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5pbXBvcnQgY29tcG9zZVNpZ25hbHMgZnJvbSBcIi4uL2hlbHBlcnMvY29tcG9zZVNpZ25hbHMuanNcIjtcbmltcG9ydCB7dHJhY2tTdHJlYW19IGZyb20gXCIuLi9oZWxwZXJzL3RyYWNrU3RyZWFtLmpzXCI7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuLi9jb3JlL0F4aW9zSGVhZGVycy5qc1wiO1xuaW1wb3J0IHByb2dyZXNzRXZlbnRSZWR1Y2VyIGZyb20gXCIuLi9oZWxwZXJzL3Byb2dyZXNzRXZlbnRSZWR1Y2VyLmpzXCI7XG5pbXBvcnQgcmVzb2x2ZUNvbmZpZyBmcm9tIFwiLi4vaGVscGVycy9yZXNvbHZlQ29uZmlnLmpzXCI7XG5pbXBvcnQgc2V0dGxlIGZyb20gXCIuLi9jb3JlL3NldHRsZS5qc1wiO1xuXG5jb25zdCBmZXRjaFByb2dyZXNzRGVjb3JhdG9yID0gKHRvdGFsLCBmbikgPT4ge1xuICBjb25zdCBsZW5ndGhDb21wdXRhYmxlID0gdG90YWwgIT0gbnVsbDtcbiAgcmV0dXJuIChsb2FkZWQpID0+IHNldFRpbWVvdXQoKCkgPT4gZm4oe1xuICAgIGxlbmd0aENvbXB1dGFibGUsXG4gICAgdG90YWwsXG4gICAgbG9hZGVkXG4gIH0pKTtcbn1cblxuY29uc3QgaXNGZXRjaFN1cHBvcnRlZCA9IHR5cGVvZiBmZXRjaCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgUmVzcG9uc2UgPT09ICdmdW5jdGlvbic7XG5jb25zdCBpc1JlYWRhYmxlU3RyZWFtU3VwcG9ydGVkID0gaXNGZXRjaFN1cHBvcnRlZCAmJiB0eXBlb2YgUmVhZGFibGVTdHJlYW0gPT09ICdmdW5jdGlvbic7XG5cbi8vIHVzZWQgb25seSBpbnNpZGUgdGhlIGZldGNoIGFkYXB0ZXJcbmNvbnN0IGVuY29kZVRleHQgPSBpc0ZldGNoU3VwcG9ydGVkICYmICh0eXBlb2YgVGV4dEVuY29kZXIgPT09ICdmdW5jdGlvbicgP1xuICAgICgoZW5jb2RlcikgPT4gKHN0cikgPT4gZW5jb2Rlci5lbmNvZGUoc3RyKSkobmV3IFRleHRFbmNvZGVyKCkpIDpcbiAgICBhc3luYyAoc3RyKSA9PiBuZXcgVWludDhBcnJheShhd2FpdCBuZXcgUmVzcG9uc2Uoc3RyKS5hcnJheUJ1ZmZlcigpKVxuKTtcblxuY29uc3Qgc3VwcG9ydHNSZXF1ZXN0U3RyZWFtID0gaXNSZWFkYWJsZVN0cmVhbVN1cHBvcnRlZCAmJiAoKCkgPT4ge1xuICBsZXQgZHVwbGV4QWNjZXNzZWQgPSBmYWxzZTtcblxuICBjb25zdCBoYXNDb250ZW50VHlwZSA9IG5ldyBSZXF1ZXN0KHBsYXRmb3JtLm9yaWdpbiwge1xuICAgIGJvZHk6IG5ldyBSZWFkYWJsZVN0cmVhbSgpLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGdldCBkdXBsZXgoKSB7XG4gICAgICBkdXBsZXhBY2Nlc3NlZCA9IHRydWU7XG4gICAgICByZXR1cm4gJ2hhbGYnO1xuICAgIH0sXG4gIH0pLmhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKTtcblxuICByZXR1cm4gZHVwbGV4QWNjZXNzZWQgJiYgIWhhc0NvbnRlbnRUeXBlO1xufSkoKTtcblxuY29uc3QgREVGQVVMVF9DSFVOS19TSVpFID0gNjQgKiAxMDI0O1xuXG5jb25zdCBzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtID0gaXNSZWFkYWJsZVN0cmVhbVN1cHBvcnRlZCAmJiAhISgoKT0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShuZXcgUmVzcG9uc2UoJycpLmJvZHkpO1xuICB9IGNhdGNoKGVycikge1xuICAgIC8vIHJldHVybiB1bmRlZmluZWRcbiAgfVxufSkoKTtcblxuY29uc3QgcmVzb2x2ZXJzID0ge1xuICBzdHJlYW06IHN1cHBvcnRzUmVzcG9uc2VTdHJlYW0gJiYgKChyZXMpID0+IHJlcy5ib2R5KVxufTtcblxuaXNGZXRjaFN1cHBvcnRlZCAmJiAoKChyZXMpID0+IHtcbiAgWyd0ZXh0JywgJ2FycmF5QnVmZmVyJywgJ2Jsb2InLCAnZm9ybURhdGEnLCAnc3RyZWFtJ10uZm9yRWFjaCh0eXBlID0+IHtcbiAgICAhcmVzb2x2ZXJzW3R5cGVdICYmIChyZXNvbHZlcnNbdHlwZV0gPSB1dGlscy5pc0Z1bmN0aW9uKHJlc1t0eXBlXSkgPyAocmVzKSA9PiByZXNbdHlwZV0oKSA6XG4gICAgICAoXywgY29uZmlnKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKGBSZXNwb25zZSB0eXBlICcke3R5cGV9JyBpcyBub3Qgc3VwcG9ydGVkYCwgQXhpb3NFcnJvci5FUlJfTk9UX1NVUFBPUlQsIGNvbmZpZyk7XG4gICAgICB9KVxuICB9KTtcbn0pKG5ldyBSZXNwb25zZSkpO1xuXG5jb25zdCBnZXRCb2R5TGVuZ3RoID0gYXN5bmMgKGJvZHkpID0+IHtcbiAgaWYgKGJvZHkgPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYodXRpbHMuaXNCbG9iKGJvZHkpKSB7XG4gICAgcmV0dXJuIGJvZHkuc2l6ZTtcbiAgfVxuXG4gIGlmKHV0aWxzLmlzU3BlY0NvbXBsaWFudEZvcm0oYm9keSkpIHtcbiAgICByZXR1cm4gKGF3YWl0IG5ldyBSZXF1ZXN0KGJvZHkpLmFycmF5QnVmZmVyKCkpLmJ5dGVMZW5ndGg7XG4gIH1cblxuICBpZih1dGlscy5pc0FycmF5QnVmZmVyVmlldyhib2R5KSkge1xuICAgIHJldHVybiBib2R5LmJ5dGVMZW5ndGg7XG4gIH1cblxuICBpZih1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhib2R5KSkge1xuICAgIGJvZHkgPSBib2R5ICsgJyc7XG4gIH1cblxuICBpZih1dGlscy5pc1N0cmluZyhib2R5KSkge1xuICAgIHJldHVybiAoYXdhaXQgZW5jb2RlVGV4dChib2R5KSkuYnl0ZUxlbmd0aDtcbiAgfVxufVxuXG5jb25zdCByZXNvbHZlQm9keUxlbmd0aCA9IGFzeW5jIChoZWFkZXJzLCBib2R5KSA9PiB7XG4gIGNvbnN0IGxlbmd0aCA9IHV0aWxzLnRvRmluaXRlTnVtYmVyKGhlYWRlcnMuZ2V0Q29udGVudExlbmd0aCgpKTtcblxuICByZXR1cm4gbGVuZ3RoID09IG51bGwgPyBnZXRCb2R5TGVuZ3RoKGJvZHkpIDogbGVuZ3RoO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0ZldGNoU3VwcG9ydGVkICYmIChhc3luYyAoY29uZmlnKSA9PiB7XG4gIGxldCB7XG4gICAgdXJsLFxuICAgIG1ldGhvZCxcbiAgICBkYXRhLFxuICAgIHNpZ25hbCxcbiAgICBjYW5jZWxUb2tlbixcbiAgICB0aW1lb3V0LFxuICAgIG9uRG93bmxvYWRQcm9ncmVzcyxcbiAgICBvblVwbG9hZFByb2dyZXNzLFxuICAgIHJlc3BvbnNlVHlwZSxcbiAgICBoZWFkZXJzLFxuICAgIHdpdGhDcmVkZW50aWFscyA9ICdzYW1lLW9yaWdpbicsXG4gICAgZmV0Y2hPcHRpb25zXG4gIH0gPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG5cbiAgcmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlID8gKHJlc3BvbnNlVHlwZSArICcnKS50b0xvd2VyQ2FzZSgpIDogJ3RleHQnO1xuXG4gIGxldCBbY29tcG9zZWRTaWduYWwsIHN0b3BUaW1lb3V0XSA9IChzaWduYWwgfHwgY2FuY2VsVG9rZW4gfHwgdGltZW91dCkgP1xuICAgIGNvbXBvc2VTaWduYWxzKFtzaWduYWwsIGNhbmNlbFRva2VuXSwgdGltZW91dCkgOiBbXTtcblxuICBsZXQgZmluaXNoZWQsIHJlcXVlc3Q7XG5cbiAgY29uc3Qgb25GaW5pc2ggPSAoKSA9PiB7XG4gICAgIWZpbmlzaGVkICYmIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29tcG9zZWRTaWduYWwgJiYgY29tcG9zZWRTaWduYWwudW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcblxuICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGxldCByZXF1ZXN0Q29udGVudExlbmd0aDtcblxuICB0cnkge1xuICAgIGlmIChcbiAgICAgIG9uVXBsb2FkUHJvZ3Jlc3MgJiYgc3VwcG9ydHNSZXF1ZXN0U3RyZWFtICYmIG1ldGhvZCAhPT0gJ2dldCcgJiYgbWV0aG9kICE9PSAnaGVhZCcgJiZcbiAgICAgIChyZXF1ZXN0Q29udGVudExlbmd0aCA9IGF3YWl0IHJlc29sdmVCb2R5TGVuZ3RoKGhlYWRlcnMsIGRhdGEpKSAhPT0gMFxuICAgICkge1xuICAgICAgbGV0IF9yZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBkdXBsZXg6IFwiaGFsZlwiXG4gICAgICB9KTtcblxuICAgICAgbGV0IGNvbnRlbnRUeXBlSGVhZGVyO1xuXG4gICAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSAmJiAoY29udGVudFR5cGVIZWFkZXIgPSBfcmVxdWVzdC5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpKSB7XG4gICAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoY29udGVudFR5cGVIZWFkZXIpXG4gICAgICB9XG5cbiAgICAgIGlmIChfcmVxdWVzdC5ib2R5KSB7XG4gICAgICAgIGRhdGEgPSB0cmFja1N0cmVhbShfcmVxdWVzdC5ib2R5LCBERUZBVUxUX0NIVU5LX1NJWkUsIGZldGNoUHJvZ3Jlc3NEZWNvcmF0b3IoXG4gICAgICAgICAgcmVxdWVzdENvbnRlbnRMZW5ndGgsXG4gICAgICAgICAgcHJvZ3Jlc3NFdmVudFJlZHVjZXIob25VcGxvYWRQcm9ncmVzcylcbiAgICAgICAgKSwgbnVsbCwgZW5jb2RlVGV4dCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF1dGlscy5pc1N0cmluZyh3aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICB3aXRoQ3JlZGVudGlhbHMgPSB3aXRoQ3JlZGVudGlhbHMgPyAnY29ycycgOiAnb21pdCc7XG4gICAgfVxuXG4gICAgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybCwge1xuICAgICAgLi4uZmV0Y2hPcHRpb25zLFxuICAgICAgc2lnbmFsOiBjb21wb3NlZFNpZ25hbCxcbiAgICAgIG1ldGhvZDogbWV0aG9kLnRvVXBwZXJDYXNlKCksXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLm5vcm1hbGl6ZSgpLnRvSlNPTigpLFxuICAgICAgYm9keTogZGF0YSxcbiAgICAgIGR1cGxleDogXCJoYWxmXCIsXG4gICAgICB3aXRoQ3JlZGVudGlhbHNcbiAgICB9KTtcblxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gICAgY29uc3QgaXNTdHJlYW1SZXNwb25zZSA9IHN1cHBvcnRzUmVzcG9uc2VTdHJlYW0gJiYgKHJlc3BvbnNlVHlwZSA9PT0gJ3N0cmVhbScgfHwgcmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKTtcblxuICAgIGlmIChzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmIChvbkRvd25sb2FkUHJvZ3Jlc3MgfHwgaXNTdHJlYW1SZXNwb25zZSkpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuICAgICAgWydzdGF0dXMnLCAnc3RhdHVzVGV4dCcsICdoZWFkZXJzJ10uZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgb3B0aW9uc1twcm9wXSA9IHJlc3BvbnNlW3Byb3BdO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlQ29udGVudExlbmd0aCA9IHV0aWxzLnRvRmluaXRlTnVtYmVyKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LWxlbmd0aCcpKTtcblxuICAgICAgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoXG4gICAgICAgIHRyYWNrU3RyZWFtKHJlc3BvbnNlLmJvZHksIERFRkFVTFRfQ0hVTktfU0laRSwgb25Eb3dubG9hZFByb2dyZXNzICYmIGZldGNoUHJvZ3Jlc3NEZWNvcmF0b3IoXG4gICAgICAgICAgcmVzcG9uc2VDb250ZW50TGVuZ3RoLFxuICAgICAgICAgIHByb2dyZXNzRXZlbnRSZWR1Y2VyKG9uRG93bmxvYWRQcm9ncmVzcywgdHJ1ZSlcbiAgICAgICAgKSwgaXNTdHJlYW1SZXNwb25zZSAmJiBvbkZpbmlzaCwgZW5jb2RlVGV4dCksXG4gICAgICAgIG9wdGlvbnNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlIHx8ICd0ZXh0JztcblxuICAgIGxldCByZXNwb25zZURhdGEgPSBhd2FpdCByZXNvbHZlcnNbdXRpbHMuZmluZEtleShyZXNvbHZlcnMsIHJlc3BvbnNlVHlwZSkgfHwgJ3RleHQnXShyZXNwb25zZSwgY29uZmlnKTtcblxuICAgICFpc1N0cmVhbVJlc3BvbnNlICYmIG9uRmluaXNoKCk7XG5cbiAgICBzdG9wVGltZW91dCAmJiBzdG9wVGltZW91dCgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBoZWFkZXJzOiBBeGlvc0hlYWRlcnMuZnJvbShyZXNwb25zZS5oZWFkZXJzKSxcbiAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdFxuICAgICAgfSlcbiAgICB9KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBvbkZpbmlzaCgpO1xuXG4gICAgaWYgKGVyciAmJiBlcnIubmFtZSA9PT0gJ1R5cGVFcnJvcicgJiYgL2ZldGNoL2kudGVzdChlcnIubWVzc2FnZSkpIHtcbiAgICAgIHRocm93IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIG5ldyBBeGlvc0Vycm9yKCdOZXR3b3JrIEVycm9yJywgQXhpb3NFcnJvci5FUlJfTkVUV09SSywgY29uZmlnLCByZXF1ZXN0KSxcbiAgICAgICAge1xuICAgICAgICAgIGNhdXNlOiBlcnIuY2F1c2UgfHwgZXJyXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICB0aHJvdyBBeGlvc0Vycm9yLmZyb20oZXJyLCBlcnIgJiYgZXJyLmNvZGUsIGNvbmZpZywgcmVxdWVzdCk7XG4gIH1cbn0pO1xuXG5cbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBzZXR0bGUgZnJvbSAnLi8uLi9jb3JlL3NldHRsZS5qcyc7XG5pbXBvcnQgdHJhbnNpdGlvbmFsRGVmYXVsdHMgZnJvbSAnLi4vZGVmYXVsdHMvdHJhbnNpdGlvbmFsLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyc7XG5pbXBvcnQgcGFyc2VQcm90b2NvbCBmcm9tICcuLi9oZWxwZXJzL3BhcnNlUHJvdG9jb2wuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi4vY29yZS9BeGlvc0hlYWRlcnMuanMnO1xuaW1wb3J0IHByb2dyZXNzRXZlbnRSZWR1Y2VyIGZyb20gJy4uL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMnO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuXG5jb25zdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgPSB0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgJiYgZnVuY3Rpb24gKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IF9jb25maWcgPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG4gICAgbGV0IHJlcXVlc3REYXRhID0gX2NvbmZpZy5kYXRhO1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oX2NvbmZpZy5oZWFkZXJzKS5ub3JtYWxpemUoKTtcbiAgICBsZXQge3Jlc3BvbnNlVHlwZX0gPSBfY29uZmlnO1xuICAgIGxldCBvbkNhbmNlbGVkO1xuICAgIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICBpZiAoX2NvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgICBfY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgX2NvbmZpZy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgcmVxdWVzdC5vcGVuKF9jb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIF9jb25maWcudXJsLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gX2NvbmZpZy50aW1lb3V0O1xuXG4gICAgZnVuY3Rpb24gb25sb2FkZW5kKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICBjb25zdCByZXNwb25zZUhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShcbiAgICAgICAgJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCAmJiByZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gICAgICApO1xuICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gIXJlc3BvbnNlVHlwZSB8fCByZXNwb25zZVR5cGUgPT09ICd0ZXh0JyB8fCByZXNwb25zZVR5cGUgPT09ICdqc29uJyA/XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShmdW5jdGlvbiBfcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gX3JlamVjdChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCdvbmxvYWRlbmQnIGluIHJlcXVlc3QpIHtcbiAgICAgIC8vIFVzZSBvbmxvYWRlbmQgaWYgYXZhaWxhYmxlXG4gICAgICByZXF1ZXN0Lm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZSB0byBlbXVsYXRlIG9ubG9hZGVuZFxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlYWR5c3RhdGUgaGFuZGxlciBpcyBjYWxsaW5nIGJlZm9yZSBvbmVycm9yIG9yIG9udGltZW91dCBoYW5kbGVycyxcbiAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGNhbGwgb25sb2FkZW5kIG9uIHRoZSBuZXh0ICd0aWNrJ1xuICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsIF9jb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBfY29uZmlnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIGxldCB0aW1lb3V0RXJyb3JNZXNzYWdlID0gX2NvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIF9jb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcgOiAndGltZW91dCBleGNlZWRlZCc7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uYWwgPSBfY29uZmlnLnRyYW5zaXRpb25hbCB8fCB0cmFuc2l0aW9uYWxEZWZhdWx0cztcbiAgICAgIGlmIChfY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IF9jb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyBBeGlvc0Vycm9yLkVUSU1FRE9VVCA6IEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELFxuICAgICAgICBfY29uZmlnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgcmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCAmJiByZXF1ZXN0SGVhZGVycy5zZXRDb250ZW50VHlwZShudWxsKTtcblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLnRvSlNPTigpLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChfY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFfY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBfY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBfY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnRSZWR1Y2VyKF9jb25maWcub25Eb3dubG9hZFByb2dyZXNzLCB0cnVlKSk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIF9jb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50UmVkdWNlcihfY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpKTtcbiAgICB9XG5cbiAgICBpZiAoX2NvbmZpZy5jYW5jZWxUb2tlbiB8fCBfY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBjYW5jZWwgPT4ge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgY2FuY2VsLnR5cGUgPyBuZXcgQ2FuY2VsZWRFcnJvcihudWxsLCBjb25maWcsIHJlcXVlc3QpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIF9jb25maWcuY2FuY2VsVG9rZW4gJiYgX2NvbmZpZy5jYW5jZWxUb2tlbi5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICBpZiAoX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgX2NvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IF9jb25maWcuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwYXJzZVByb3RvY29sKF9jb25maWcudXJsKTtcblxuICAgIGlmIChwcm90b2NvbCAmJiBwbGF0Zm9ybS5wcm90b2NvbHMuaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1Vuc3VwcG9ydGVkIHByb3RvY29sICcgKyBwcm90b2NvbCArICc6JywgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCBiaW5kIGZyb20gJy4vaGVscGVycy9iaW5kLmpzJztcbmltcG9ydCBBeGlvcyBmcm9tICcuL2NvcmUvQXhpb3MuanMnO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gJy4vY29yZS9tZXJnZUNvbmZpZy5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgZm9ybURhdGFUb0pTT04gZnJvbSAnLi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzJztcbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbFRva2VuIGZyb20gJy4vY2FuY2VsL0NhbmNlbFRva2VuLmpzJztcbmltcG9ydCBpc0NhbmNlbCBmcm9tICcuL2NhbmNlbC9pc0NhbmNlbC5qcyc7XG5pbXBvcnQge1ZFUlNJT059IGZyb20gJy4vZW52L2RhdGEuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi9oZWxwZXJzL3RvRm9ybURhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IHNwcmVhZCBmcm9tICcuL2hlbHBlcnMvc3ByZWFkLmpzJztcbmltcG9ydCBpc0F4aW9zRXJyb3IgZnJvbSAnLi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL2NvcmUvQXhpb3NIZWFkZXJzLmpzXCI7XG5pbXBvcnQgYWRhcHRlcnMgZnJvbSAnLi9hZGFwdGVycy9hZGFwdGVycy5qcyc7XG5pbXBvcnQgSHR0cFN0YXR1c0NvZGUgZnJvbSAnLi9oZWxwZXJzL0h0dHBTdGF0dXNDb2RlLmpzJztcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm5zIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICBjb25zdCBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICBjb25zdCBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0LCB7YWxsT3duS2V5czogdHJ1ZX0pO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQsIG51bGwsIHthbGxPd25LZXlzOiB0cnVlfSk7XG5cbiAgLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuICBpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgaW5zdGFuY2VDb25maWcpKTtcbiAgfTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxuY29uc3QgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWxlZEVycm9yID0gQ2FuY2VsZWRFcnJvcjtcbmF4aW9zLkNhbmNlbFRva2VuID0gQ2FuY2VsVG9rZW47XG5heGlvcy5pc0NhbmNlbCA9IGlzQ2FuY2VsO1xuYXhpb3MuVkVSU0lPTiA9IFZFUlNJT047XG5heGlvcy50b0Zvcm1EYXRhID0gdG9Gb3JtRGF0YTtcblxuLy8gRXhwb3NlIEF4aW9zRXJyb3IgY2xhc3NcbmF4aW9zLkF4aW9zRXJyb3IgPSBBeGlvc0Vycm9yO1xuXG4vLyBhbGlhcyBmb3IgQ2FuY2VsZWRFcnJvciBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuYXhpb3MuQ2FuY2VsID0gYXhpb3MuQ2FuY2VsZWRFcnJvcjtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcblxuYXhpb3Muc3ByZWFkID0gc3ByZWFkO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSBpc0F4aW9zRXJyb3I7XG5cbi8vIEV4cG9zZSBtZXJnZUNvbmZpZ1xuYXhpb3MubWVyZ2VDb25maWcgPSBtZXJnZUNvbmZpZztcblxuYXhpb3MuQXhpb3NIZWFkZXJzID0gQXhpb3NIZWFkZXJzO1xuXG5heGlvcy5mb3JtVG9KU09OID0gdGhpbmcgPT4gZm9ybURhdGFUb0pTT04odXRpbHMuaXNIVE1MRm9ybSh0aGluZykgPyBuZXcgRm9ybURhdGEodGhpbmcpIDogdGhpbmcpO1xuXG5heGlvcy5nZXRBZGFwdGVyID0gYWRhcHRlcnMuZ2V0QWRhcHRlcjtcblxuYXhpb3MuSHR0cFN0YXR1c0NvZGUgPSBIdHRwU3RhdHVzQ29kZTtcblxuYXhpb3MuZGVmYXVsdCA9IGF4aW9zO1xuXG4vLyB0aGlzIG1vZHVsZSBzaG91bGQgb25seSBoYXZlIGEgZGVmYXVsdCBleHBvcnRcbmV4cG9ydCBkZWZhdWx0IGF4aW9zXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4vQ2FuY2VsZWRFcnJvci5qcyc7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKlxuICogQHJldHVybnMge0NhbmNlbFRva2VufVxuICovXG5jbGFzcyBDYW5jZWxUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKGV4ZWN1dG9yKSB7XG4gICAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIGxldCByZXNvbHZlUHJvbWlzZTtcblxuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXM7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHRoaXMucHJvbWlzZS50aGVuKGNhbmNlbCA9PiB7XG4gICAgICBpZiAoIXRva2VuLl9saXN0ZW5lcnMpIHJldHVybjtcblxuICAgICAgbGV0IGkgPSB0b2tlbi5fbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgICAgdG9rZW4uX2xpc3RlbmVyc1tpXShjYW5jZWwpO1xuICAgICAgfVxuICAgICAgdG9rZW4uX2xpc3RlbmVycyA9IG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHRoaXMucHJvbWlzZS50aGVuID0gb25mdWxmaWxsZWQgPT4ge1xuICAgICAgbGV0IF9yZXNvbHZlO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgICBfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB9KS50aGVuKG9uZnVsZmlsbGVkKTtcblxuICAgICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICAgIHRva2VuLnVuc3Vic2NyaWJlKF9yZXNvbHZlKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSwgY29uZmlnLCByZXF1ZXN0KSB7XG4gICAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWxlZEVycm9yKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCk7XG4gICAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIGBDYW5jZWxlZEVycm9yYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICAgKi9cbiAgdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICAgIHRocm93IHRoaXMucmVhc29uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgdG8gdGhlIGNhbmNlbCBzaWduYWxcbiAgICovXG5cbiAgc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLnJlYXNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZSBmcm9tIHRoZSBjYW5jZWwgc2lnbmFsXG4gICAqL1xuXG4gIHVuc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAgICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAgICovXG4gIHN0YXRpYyBzb3VyY2UoKSB7XG4gICAgbGV0IGNhbmNlbDtcbiAgICBjb25zdCB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgICBjYW5jZWwgPSBjO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbixcbiAgICAgIGNhbmNlbFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIEEgYENhbmNlbGVkRXJyb3JgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdD19IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3Q9fSByZXF1ZXN0IFRoZSByZXF1ZXN0LlxuICpcbiAqIEByZXR1cm5zIHtDYW5jZWxlZEVycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsZWRFcnJvcihtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gIEF4aW9zRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlID09IG51bGwgPyAnY2FuY2VsZWQnIDogbWVzc2FnZSwgQXhpb3NFcnJvci5FUlJfQ0FOQ0VMRUQsIGNvbmZpZywgcmVxdWVzdCk7XG4gIHRoaXMubmFtZSA9ICdDYW5jZWxlZEVycm9yJztcbn1cblxudXRpbHMuaW5oZXJpdHMoQ2FuY2VsZWRFcnJvciwgQXhpb3NFcnJvciwge1xuICBfX0NBTkNFTF9fOiB0cnVlXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsZWRFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgYnVpbGRVUkwgZnJvbSAnLi4vaGVscGVycy9idWlsZFVSTC5qcyc7XG5pbXBvcnQgSW50ZXJjZXB0b3JNYW5hZ2VyIGZyb20gJy4vSW50ZXJjZXB0b3JNYW5hZ2VyLmpzJztcbmltcG9ydCBkaXNwYXRjaFJlcXVlc3QgZnJvbSAnLi9kaXNwYXRjaFJlcXVlc3QuanMnO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gJy4vbWVyZ2VDb25maWcuanMnO1xuaW1wb3J0IGJ1aWxkRnVsbFBhdGggZnJvbSAnLi9idWlsZEZ1bGxQYXRoLmpzJztcbmltcG9ydCB2YWxpZGF0b3IgZnJvbSAnLi4vaGVscGVycy92YWxpZGF0b3IuanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuL0F4aW9zSGVhZGVycy5qcyc7XG5cbmNvbnN0IHZhbGlkYXRvcnMgPSB2YWxpZGF0b3IudmFsaWRhdG9ycztcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuY2xhc3MgQXhpb3Mge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZUNvbmZpZykge1xuICAgIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGNvbmZpZ09yVXJsIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAgICogQHBhcmFtIHs/T2JqZWN0fSBjb25maWdcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICAgKi9cbiAgYXN5bmMgcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9yZXF1ZXN0KGNvbmZpZ09yVXJsLCBjb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIGxldCBkdW1teTtcblxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA/IEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15ID0ge30pIDogKGR1bW15ID0gbmV3IEVycm9yKCkpO1xuXG4gICAgICAgIC8vIHNsaWNlIG9mZiB0aGUgRXJyb3I6IC4uLiBsaW5lXG4gICAgICAgIGNvbnN0IHN0YWNrID0gZHVtbXkuc3RhY2sgPyBkdW1teS5zdGFjay5yZXBsYWNlKC9eLitcXG4vLCAnJykgOiAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoIWVyci5zdGFjaykge1xuICAgICAgICAgICAgZXJyLnN0YWNrID0gc3RhY2s7XG4gICAgICAgICAgICAvLyBtYXRjaCB3aXRob3V0IHRoZSAyIHRvcCBzdGFjayBsaW5lc1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhY2sgJiYgIVN0cmluZyhlcnIuc3RhY2spLmVuZHNXaXRoKHN0YWNrLnJlcGxhY2UoL14uK1xcbi4rXFxuLywgJycpKSkge1xuICAgICAgICAgICAgZXJyLnN0YWNrICs9ICdcXG4nICsgc3RhY2tcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpZ25vcmUgdGhlIGNhc2Ugd2hlcmUgXCJzdGFja1wiIGlzIGFuIHVuLXdyaXRhYmxlIHByb3BlcnR5XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIF9yZXF1ZXN0KGNvbmZpZ09yVXJsLCBjb25maWcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gICAgaWYgKHR5cGVvZiBjb25maWdPclVybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICAgIGNvbmZpZy51cmwgPSBjb25maWdPclVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0gY29uZmlnT3JVcmwgfHwge307XG4gICAgfVxuXG4gICAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAgIGNvbnN0IHt0cmFuc2l0aW9uYWwsIHBhcmFtc1NlcmlhbGl6ZXIsIGhlYWRlcnN9ID0gY29uZmlnO1xuXG4gICAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyh0cmFuc2l0aW9uYWwsIHtcbiAgICAgICAgc2lsZW50SlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICBjbGFyaWZ5VGltZW91dEVycm9yOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pXG4gICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24ocGFyYW1zU2VyaWFsaXplcikpIHtcbiAgICAgICAgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIgPSB7XG4gICAgICAgICAgc2VyaWFsaXplOiBwYXJhbXNTZXJpYWxpemVyXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKHBhcmFtc1NlcmlhbGl6ZXIsIHtcbiAgICAgICAgICBlbmNvZGU6IHZhbGlkYXRvcnMuZnVuY3Rpb24sXG4gICAgICAgICAgc2VyaWFsaXplOiB2YWxpZGF0b3JzLmZ1bmN0aW9uXG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCBjb25maWcubWV0aG9kXG4gICAgY29uZmlnLm1ldGhvZCA9IChjb25maWcubWV0aG9kIHx8IHRoaXMuZGVmYXVsdHMubWV0aG9kIHx8ICdnZXQnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gICAgbGV0IGNvbnRleHRIZWFkZXJzID0gaGVhZGVycyAmJiB1dGlscy5tZXJnZShcbiAgICAgIGhlYWRlcnMuY29tbW9uLFxuICAgICAgaGVhZGVyc1tjb25maWcubWV0aG9kXVxuICAgICk7XG5cbiAgICBoZWFkZXJzICYmIHV0aWxzLmZvckVhY2goXG4gICAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICAgIChtZXRob2QpID0+IHtcbiAgICAgICAgZGVsZXRlIGhlYWRlcnNbbWV0aG9kXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uZmlnLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuY29uY2F0KGNvbnRleHRIZWFkZXJzLCBoZWFkZXJzKTtcblxuICAgIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgICBjb25zdCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICAgIGxldCBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICAgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgaWYgKHR5cGVvZiBpbnRlcmNlcHRvci5ydW5XaGVuID09PSAnZnVuY3Rpb24nICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgJiYgaW50ZXJjZXB0b3Iuc3luY2hyb25vdXM7XG5cbiAgICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcHJvbWlzZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbjtcblxuICAgIGlmICghc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzKSB7XG4gICAgICBjb25zdCBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QuYmluZCh0aGlzKSwgdW5kZWZpbmVkXTtcbiAgICAgIGNoYWluLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICAgIGNoYWluLnB1c2guYXBwbHkoY2hhaW4sIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbik7XG4gICAgICBsZW4gPSBjaGFpbi5sZW5ndGg7XG5cbiAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICAgICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbltpKytdLCBjaGFpbltpKytdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgbGVuID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoO1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IGNvbmZpZztcblxuICAgIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIGNvbnN0IG9uRnVsZmlsbGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW5baSsrXTtcbiAgICAgIGNvbnN0IG9uUmVqZWN0ZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbltpKytdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG9uUmVqZWN0ZWQuY2FsbCh0aGlzLCBlcnJvcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBwcm9taXNlID0gZGlzcGF0Y2hSZXF1ZXN0LmNhbGwodGhpcywgbmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9XG5cbiAgICBpID0gMDtcbiAgICBsZW4gPSByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4ocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluW2krK10sIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbltpKytdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGdldFVyaShjb25maWcpIHtcbiAgICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmV0dXJuIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG4gIH1cbn1cblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2QsXG4gICAgICB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVIVFRQTWV0aG9kKGlzRm9ybSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBodHRwTWV0aG9kKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgICBtZXRob2QsXG4gICAgICAgIGhlYWRlcnM6IGlzRm9ybSA/IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ211bHRpcGFydC9mb3JtLWRhdGEnXG4gICAgICAgIH0gOiB7fSxcbiAgICAgICAgdXJsLFxuICAgICAgICBkYXRhXG4gICAgICB9KSk7XG4gICAgfTtcbiAgfVxuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZ2VuZXJhdGVIVFRQTWV0aG9kKCk7XG5cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZCArICdGb3JtJ10gPSBnZW5lcmF0ZUhUVFBNZXRob2QodHJ1ZSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXSBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5mdW5jdGlvbiBBeGlvc0Vycm9yKG1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgRXJyb3IuY2FsbCh0aGlzKTtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgfVxuXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMubmFtZSA9ICdBeGlvc0Vycm9yJztcbiAgY29kZSAmJiAodGhpcy5jb2RlID0gY29kZSk7XG4gIGNvbmZpZyAmJiAodGhpcy5jb25maWcgPSBjb25maWcpO1xuICByZXF1ZXN0ICYmICh0aGlzLnJlcXVlc3QgPSByZXF1ZXN0KTtcbiAgcmVzcG9uc2UgJiYgKHRoaXMucmVzcG9uc2UgPSByZXNwb25zZSk7XG59XG5cbnV0aWxzLmluaGVyaXRzKEF4aW9zRXJyb3IsIEVycm9yLCB7XG4gIHRvSlNPTjogZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHV0aWxzLnRvSlNPTk9iamVjdCh0aGlzLmNvbmZpZyksXG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBzdGF0dXM6IHRoaXMucmVzcG9uc2UgJiYgdGhpcy5yZXNwb25zZS5zdGF0dXMgPyB0aGlzLnJlc3BvbnNlLnN0YXR1cyA6IG51bGxcbiAgICB9O1xuICB9XG59KTtcblxuY29uc3QgcHJvdG90eXBlID0gQXhpb3NFcnJvci5wcm90b3R5cGU7XG5jb25zdCBkZXNjcmlwdG9ycyA9IHt9O1xuXG5bXG4gICdFUlJfQkFEX09QVElPTl9WQUxVRScsXG4gICdFUlJfQkFEX09QVElPTicsXG4gICdFQ09OTkFCT1JURUQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ0VSUl9ORVRXT1JLJyxcbiAgJ0VSUl9GUl9UT09fTUFOWV9SRURJUkVDVFMnLFxuICAnRVJSX0RFUFJFQ0FURUQnLFxuICAnRVJSX0JBRF9SRVNQT05TRScsXG4gICdFUlJfQkFEX1JFUVVFU1QnLFxuICAnRVJSX0NBTkNFTEVEJyxcbiAgJ0VSUl9OT1RfU1VQUE9SVCcsXG4gICdFUlJfSU5WQUxJRF9VUkwnXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuXS5mb3JFYWNoKGNvZGUgPT4ge1xuICBkZXNjcmlwdG9yc1tjb2RlXSA9IHt2YWx1ZTogY29kZX07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQXhpb3NFcnJvciwgZGVzY3JpcHRvcnMpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgJ2lzQXhpb3NFcnJvcicsIHt2YWx1ZTogdHJ1ZX0pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuQXhpb3NFcnJvci5mcm9tID0gKGVycm9yLCBjb2RlLCBjb25maWcsIHJlcXVlc3QsIHJlc3BvbnNlLCBjdXN0b21Qcm9wcykgPT4ge1xuICBjb25zdCBheGlvc0Vycm9yID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuXG4gIHV0aWxzLnRvRmxhdE9iamVjdChlcnJvciwgYXhpb3NFcnJvciwgZnVuY3Rpb24gZmlsdGVyKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IEVycm9yLnByb3RvdHlwZTtcbiAgfSwgcHJvcCA9PiB7XG4gICAgcmV0dXJuIHByb3AgIT09ICdpc0F4aW9zRXJyb3InO1xuICB9KTtcblxuICBBeGlvc0Vycm9yLmNhbGwoYXhpb3NFcnJvciwgZXJyb3IubWVzc2FnZSwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSk7XG5cbiAgYXhpb3NFcnJvci5jYXVzZSA9IGVycm9yO1xuXG4gIGF4aW9zRXJyb3IubmFtZSA9IGVycm9yLm5hbWU7XG5cbiAgY3VzdG9tUHJvcHMgJiYgT2JqZWN0LmFzc2lnbihheGlvc0Vycm9yLCBjdXN0b21Qcm9wcyk7XG5cbiAgcmV0dXJuIGF4aW9zRXJyb3I7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBeGlvc0Vycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHBhcnNlSGVhZGVycyBmcm9tICcuLi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyc7XG5cbmNvbnN0ICRpbnRlcm5hbHMgPSBTeW1ib2woJ2ludGVybmFscycpO1xuXG5mdW5jdGlvbiBub3JtYWxpemVIZWFkZXIoaGVhZGVyKSB7XG4gIHJldHVybiBoZWFkZXIgJiYgU3RyaW5nKGhlYWRlcikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiB1dGlscy5pc0FycmF5KHZhbHVlKSA/IHZhbHVlLm1hcChub3JtYWxpemVWYWx1ZSkgOiBTdHJpbmcodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRva2VucyhzdHIpIHtcbiAgY29uc3QgdG9rZW5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgY29uc3QgdG9rZW5zUkUgPSAvKFteXFxzLDs9XSspXFxzKig/Oj1cXHMqKFteLDtdKykpPy9nO1xuICBsZXQgbWF0Y2g7XG5cbiAgd2hpbGUgKChtYXRjaCA9IHRva2Vuc1JFLmV4ZWMoc3RyKSkpIHtcbiAgICB0b2tlbnNbbWF0Y2hbMV1dID0gbWF0Y2hbMl07XG4gIH1cblxuICByZXR1cm4gdG9rZW5zO1xufVxuXG5jb25zdCBpc1ZhbGlkSGVhZGVyTmFtZSA9IChzdHIpID0+IC9eWy1fYS16QS1aMC05XmB8fiwhIyQlJicqKy5dKyQvLnRlc3Qoc3RyLnRyaW0oKSk7XG5cbmZ1bmN0aW9uIG1hdGNoSGVhZGVyVmFsdWUoY29udGV4dCwgdmFsdWUsIGhlYWRlciwgZmlsdGVyLCBpc0hlYWRlck5hbWVGaWx0ZXIpIHtcbiAgaWYgKHV0aWxzLmlzRnVuY3Rpb24oZmlsdGVyKSkge1xuICAgIHJldHVybiBmaWx0ZXIuY2FsbCh0aGlzLCB2YWx1ZSwgaGVhZGVyKTtcbiAgfVxuXG4gIGlmIChpc0hlYWRlck5hbWVGaWx0ZXIpIHtcbiAgICB2YWx1ZSA9IGhlYWRlcjtcbiAgfVxuXG4gIGlmICghdXRpbHMuaXNTdHJpbmcodmFsdWUpKSByZXR1cm47XG5cbiAgaWYgKHV0aWxzLmlzU3RyaW5nKGZpbHRlcikpIHtcbiAgICByZXR1cm4gdmFsdWUuaW5kZXhPZihmaWx0ZXIpICE9PSAtMTtcbiAgfVxuXG4gIGlmICh1dGlscy5pc1JlZ0V4cChmaWx0ZXIpKSB7XG4gICAgcmV0dXJuIGZpbHRlci50ZXN0KHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRIZWFkZXIoaGVhZGVyKSB7XG4gIHJldHVybiBoZWFkZXIudHJpbSgpXG4gICAgLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKFthLXpcXGRdKShcXHcqKS9nLCAodywgY2hhciwgc3RyKSA9PiB7XG4gICAgICByZXR1cm4gY2hhci50b1VwcGVyQ2FzZSgpICsgc3RyO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBidWlsZEFjY2Vzc29ycyhvYmosIGhlYWRlcikge1xuICBjb25zdCBhY2Nlc3Nvck5hbWUgPSB1dGlscy50b0NhbWVsQ2FzZSgnICcgKyBoZWFkZXIpO1xuXG4gIFsnZ2V0JywgJ3NldCcsICdoYXMnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG1ldGhvZE5hbWUgKyBhY2Nlc3Nvck5hbWUsIHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIHJldHVybiB0aGlzW21ldGhvZE5hbWVdLmNhbGwodGhpcywgaGVhZGVyLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgICAgIH0sXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgfSk7XG59XG5cbmNsYXNzIEF4aW9zSGVhZGVycyB7XG4gIGNvbnN0cnVjdG9yKGhlYWRlcnMpIHtcbiAgICBoZWFkZXJzICYmIHRoaXMuc2V0KGhlYWRlcnMpO1xuICB9XG5cbiAgc2V0KGhlYWRlciwgdmFsdWVPclJld3JpdGUsIHJld3JpdGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIHNldEhlYWRlcihfdmFsdWUsIF9oZWFkZXIsIF9yZXdyaXRlKSB7XG4gICAgICBjb25zdCBsSGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoIWxIZWFkZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdoZWFkZXIgbmFtZSBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHNlbGYsIGxIZWFkZXIpO1xuXG4gICAgICBpZigha2V5IHx8IHNlbGZba2V5XSA9PT0gdW5kZWZpbmVkIHx8IF9yZXdyaXRlID09PSB0cnVlIHx8IChfcmV3cml0ZSA9PT0gdW5kZWZpbmVkICYmIHNlbGZba2V5XSAhPT0gZmFsc2UpKSB7XG4gICAgICAgIHNlbGZba2V5IHx8IF9oZWFkZXJdID0gbm9ybWFsaXplVmFsdWUoX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzZXRIZWFkZXJzID0gKGhlYWRlcnMsIF9yZXdyaXRlKSA9PlxuICAgICAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCAoX3ZhbHVlLCBfaGVhZGVyKSA9PiBzZXRIZWFkZXIoX3ZhbHVlLCBfaGVhZGVyLCBfcmV3cml0ZSkpO1xuXG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QoaGVhZGVyKSB8fCBoZWFkZXIgaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yKSB7XG4gICAgICBzZXRIZWFkZXJzKGhlYWRlciwgdmFsdWVPclJld3JpdGUpXG4gICAgfSBlbHNlIGlmKHV0aWxzLmlzU3RyaW5nKGhlYWRlcikgJiYgKGhlYWRlciA9IGhlYWRlci50cmltKCkpICYmICFpc1ZhbGlkSGVhZGVyTmFtZShoZWFkZXIpKSB7XG4gICAgICBzZXRIZWFkZXJzKHBhcnNlSGVhZGVycyhoZWFkZXIpLCB2YWx1ZU9yUmV3cml0ZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0hlYWRlcnMoaGVhZGVyKSkge1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaGVhZGVyLmVudHJpZXMoKSkge1xuICAgICAgICBzZXRIZWFkZXIodmFsdWUsIGtleSwgcmV3cml0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWRlciAhPSBudWxsICYmIHNldEhlYWRlcih2YWx1ZU9yUmV3cml0ZSwgaGVhZGVyLCByZXdyaXRlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldChoZWFkZXIsIHBhcnNlcikge1xuICAgIGhlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpO1xuXG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleSh0aGlzLCBoZWFkZXIpO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1trZXldO1xuXG4gICAgICAgIGlmICghcGFyc2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnNlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZVRva2Vucyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihwYXJzZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlci5jYWxsKHRoaXMsIHZhbHVlLCBrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzUmVnRXhwKHBhcnNlcikpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VyLmV4ZWModmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncGFyc2VyIG11c3QgYmUgYm9vbGVhbnxyZWdleHB8ZnVuY3Rpb24nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYXMoaGVhZGVyLCBtYXRjaGVyKSB7XG4gICAgaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKGhlYWRlcik7XG5cbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHRoaXMsIGhlYWRlcik7XG5cbiAgICAgIHJldHVybiAhIShrZXkgJiYgdGhpc1trZXldICE9PSB1bmRlZmluZWQgJiYgKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUodGhpcywgdGhpc1trZXldLCBrZXksIG1hdGNoZXIpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZGVsZXRlKGhlYWRlciwgbWF0Y2hlcikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGxldCBkZWxldGVkID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBkZWxldGVIZWFkZXIoX2hlYWRlcikge1xuICAgICAgX2hlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihfaGVhZGVyKTtcblxuICAgICAgaWYgKF9oZWFkZXIpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleShzZWxmLCBfaGVhZGVyKTtcblxuICAgICAgICBpZiAoa2V5ICYmICghbWF0Y2hlciB8fCBtYXRjaEhlYWRlclZhbHVlKHNlbGYsIHNlbGZba2V5XSwga2V5LCBtYXRjaGVyKSkpIHtcbiAgICAgICAgICBkZWxldGUgc2VsZltrZXldO1xuXG4gICAgICAgICAgZGVsZXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheShoZWFkZXIpKSB7XG4gICAgICBoZWFkZXIuZm9yRWFjaChkZWxldGVIZWFkZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGVIZWFkZXIoaGVhZGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVsZXRlZDtcbiAgfVxuXG4gIGNsZWFyKG1hdGNoZXIpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcyk7XG4gICAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgICBsZXQgZGVsZXRlZCA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUodGhpcywgdGhpc1trZXldLCBrZXksIG1hdGNoZXIsIHRydWUpKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzW2tleV07XG4gICAgICAgIGRlbGV0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWxldGVkO1xuICB9XG5cbiAgbm9ybWFsaXplKGZvcm1hdCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGhlYWRlcnMgPSB7fTtcblxuICAgIHV0aWxzLmZvckVhY2godGhpcywgKHZhbHVlLCBoZWFkZXIpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkoaGVhZGVycywgaGVhZGVyKTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBzZWxmW2tleV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIGRlbGV0ZSBzZWxmW2hlYWRlcl07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGZvcm1hdCA/IGZvcm1hdEhlYWRlcihoZWFkZXIpIDogU3RyaW5nKGhlYWRlcikudHJpbSgpO1xuXG4gICAgICBpZiAobm9ybWFsaXplZCAhPT0gaGVhZGVyKSB7XG4gICAgICAgIGRlbGV0ZSBzZWxmW2hlYWRlcl07XG4gICAgICB9XG5cbiAgICAgIHNlbGZbbm9ybWFsaXplZF0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZF0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjb25jYXQoLi4udGFyZ2V0cykge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmNvbmNhdCh0aGlzLCAuLi50YXJnZXRzKTtcbiAgfVxuXG4gIHRvSlNPTihhc1N0cmluZ3MpIHtcbiAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLCAodmFsdWUsIGhlYWRlcikgPT4ge1xuICAgICAgdmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgKG9ialtoZWFkZXJdID0gYXNTdHJpbmdzICYmIHV0aWxzLmlzQXJyYXkodmFsdWUpID8gdmFsdWUuam9pbignLCAnKSA6IHZhbHVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy50b0pTT04oKSlbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMudG9KU09OKCkpLm1hcCgoW2hlYWRlciwgdmFsdWVdKSA9PiBoZWFkZXIgKyAnOiAnICsgdmFsdWUpLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgIHJldHVybiAnQXhpb3NIZWFkZXJzJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHRoaW5nKSB7XG4gICAgcmV0dXJuIHRoaW5nIGluc3RhbmNlb2YgdGhpcyA/IHRoaW5nIDogbmV3IHRoaXModGhpbmcpO1xuICB9XG5cbiAgc3RhdGljIGNvbmNhdChmaXJzdCwgLi4udGFyZ2V0cykge1xuICAgIGNvbnN0IGNvbXB1dGVkID0gbmV3IHRoaXMoZmlyc3QpO1xuXG4gICAgdGFyZ2V0cy5mb3JFYWNoKCh0YXJnZXQpID0+IGNvbXB1dGVkLnNldCh0YXJnZXQpKTtcblxuICAgIHJldHVybiBjb21wdXRlZDtcbiAgfVxuXG4gIHN0YXRpYyBhY2Nlc3NvcihoZWFkZXIpIHtcbiAgICBjb25zdCBpbnRlcm5hbHMgPSB0aGlzWyRpbnRlcm5hbHNdID0gKHRoaXNbJGludGVybmFsc10gPSB7XG4gICAgICBhY2Nlc3NvcnM6IHt9XG4gICAgfSk7XG5cbiAgICBjb25zdCBhY2Nlc3NvcnMgPSBpbnRlcm5hbHMuYWNjZXNzb3JzO1xuICAgIGNvbnN0IHByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xuXG4gICAgZnVuY3Rpb24gZGVmaW5lQWNjZXNzb3IoX2hlYWRlcikge1xuICAgICAgY29uc3QgbEhlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihfaGVhZGVyKTtcblxuICAgICAgaWYgKCFhY2Nlc3NvcnNbbEhlYWRlcl0pIHtcbiAgICAgICAgYnVpbGRBY2Nlc3NvcnMocHJvdG90eXBlLCBfaGVhZGVyKTtcbiAgICAgICAgYWNjZXNzb3JzW2xIZWFkZXJdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlscy5pc0FycmF5KGhlYWRlcikgPyBoZWFkZXIuZm9yRWFjaChkZWZpbmVBY2Nlc3NvcikgOiBkZWZpbmVBY2Nlc3NvcihoZWFkZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuQXhpb3NIZWFkZXJzLmFjY2Vzc29yKFsnQ29udGVudC1UeXBlJywgJ0NvbnRlbnQtTGVuZ3RoJywgJ0FjY2VwdCcsICdBY2NlcHQtRW5jb2RpbmcnLCAnVXNlci1BZ2VudCcsICdBdXRob3JpemF0aW9uJ10pO1xuXG4vLyByZXNlcnZlZCBuYW1lcyBob3RmaXhcbnV0aWxzLnJlZHVjZURlc2NyaXB0b3JzKEF4aW9zSGVhZGVycy5wcm90b3R5cGUsICh7dmFsdWV9LCBrZXkpID0+IHtcbiAgbGV0IG1hcHBlZCA9IGtleVswXS50b1VwcGVyQ2FzZSgpICsga2V5LnNsaWNlKDEpOyAvLyBtYXAgYHNldGAgPT4gYFNldGBcbiAgcmV0dXJuIHtcbiAgICBnZXQ6ICgpID0+IHZhbHVlLFxuICAgIHNldChoZWFkZXJWYWx1ZSkge1xuICAgICAgdGhpc1ttYXBwZWRdID0gaGVhZGVyVmFsdWU7XG4gICAgfVxuICB9XG59KTtcblxudXRpbHMuZnJlZXplTWV0aG9kcyhBeGlvc0hlYWRlcnMpO1xuXG5leHBvcnQgZGVmYXVsdCBBeGlvc0hlYWRlcnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcblxuY2xhc3MgSW50ZXJjZXB0b3JNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gICAqL1xuICB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICAgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgICBmdWxmaWxsZWQsXG4gICAgICByZWplY3RlZCxcbiAgICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgICAgcnVuV2hlbjogb3B0aW9ucyA/IG9wdGlvbnMucnVuV2hlbiA6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGludGVyY2VwdG9yIHdhcyByZW1vdmVkLCBgZmFsc2VgIG90aGVyd2lzZVxuICAgKi9cbiAgZWplY3QoaWQpIHtcbiAgICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIGludGVyY2VwdG9ycyBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLmhhbmRsZXJzKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gICAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZvckVhY2goZm4pIHtcbiAgICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICAgIGZuKGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGlzQWJzb2x1dGVVUkwgZnJvbSAnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMLmpzJztcbmltcG9ydCBjb21iaW5lVVJMcyBmcm9tICcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdHJhbnNmb3JtRGF0YSBmcm9tICcuL3RyYW5zZm9ybURhdGEuanMnO1xuaW1wb3J0IGlzQ2FuY2VsIGZyb20gJy4uL2NhbmNlbC9pc0NhbmNlbC5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vZGVmYXVsdHMvaW5kZXguanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuLi9jb3JlL0F4aW9zSGVhZGVycy5qcyc7XG5pbXBvcnQgYWRhcHRlcnMgZnJvbSBcIi4uL2FkYXB0ZXJzL2FkYXB0ZXJzLmpzXCI7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGVkRXJyb3JgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cblxuICBpZiAoY29uZmlnLnNpZ25hbCAmJiBjb25maWcuc2lnbmFsLmFib3J0ZWQpIHtcbiAgICB0aHJvdyBuZXcgQ2FuY2VsZWRFcnJvcihudWxsLCBjb25maWcpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICpcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgY29uZmlnLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShjb25maWcuaGVhZGVycyk7XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICBjb25maWcsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICBpZiAoWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLmluZGV4T2YoY29uZmlnLm1ldGhvZCkgIT09IC0xKSB7XG4gICAgY29uZmlnLmhlYWRlcnMuc2V0Q29udGVudFR5cGUoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsIGZhbHNlKTtcbiAgfVxuXG4gIGNvbnN0IGFkYXB0ZXIgPSBhZGFwdGVycy5nZXRBZGFwdGVyKGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXIpO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgY29uZmlnLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlLFxuICAgICAgcmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmVzcG9uc2UuaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKHJlc3BvbnNlLmhlYWRlcnMpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZVxuICAgICAgICApO1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL0F4aW9zSGVhZGVycy5qc1wiO1xuXG5jb25zdCBoZWFkZXJzVG9PYmplY3QgPSAodGhpbmcpID0+IHRoaW5nIGluc3RhbmNlb2YgQXhpb3NIZWFkZXJzID8geyAuLi50aGluZyB9IDogdGhpbmc7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIGNvbnN0IGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlLCBjYXNlbGVzcykge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UuY2FsbCh7Y2FzZWxlc3N9LCB0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMoYSwgYiwgY2FzZWxlc3MpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoYSwgYiwgY2FzZWxlc3MpO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGEpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhLCBjYXNlbGVzcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIoYSwgYikge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYikpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKGEsIGIpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBiKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChhKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhhLCBiLCBwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGEsIGIpO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtZXJnZU1hcCA9IHtcbiAgICB1cmw6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgbWV0aG9kOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIGRhdGE6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgYmFzZVVSTDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHBhcmFtc1NlcmlhbGl6ZXI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdGltZW91dDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0aW1lb3V0TWVzc2FnZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB3aXRoQ3JlZGVudGlhbHM6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgd2l0aFhTUkZUb2tlbjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBhZGFwdGVyOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHJlc3BvbnNlVHlwZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmQ29va2llTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmSGVhZGVyTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBvblVwbG9hZFByb2dyZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG9uRG93bmxvYWRQcm9ncmVzczogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBkZWNvbXByZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG1heENvbnRlbnRMZW5ndGg6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgbWF4Qm9keUxlbmd0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBiZWZvcmVSZWRpcmVjdDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc3BvcnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgaHR0cEFnZW50OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGh0dHBzQWdlbnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgY2FuY2VsVG9rZW46IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgc29ja2V0UGF0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICByZXNwb25zZUVuY29kaW5nOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHZhbGlkYXRlU3RhdHVzOiBtZXJnZURpcmVjdEtleXMsXG4gICAgaGVhZGVyczogKGEsIGIpID0+IG1lcmdlRGVlcFByb3BlcnRpZXMoaGVhZGVyc1RvT2JqZWN0KGEpLCBoZWFkZXJzVG9PYmplY3QoYiksIHRydWUpXG4gIH07XG5cbiAgdXRpbHMuZm9yRWFjaChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCBjb25maWcxLCBjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgY29uc3QgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gbWVyZ2UoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSwgcHJvcCk7XG4gICAgKHV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZ1ZhbHVlKSAmJiBtZXJnZSAhPT0gbWVyZ2VEaXJlY3RLZXlzKSB8fCAoY29uZmlnW3Byb3BdID0gY29uZmlnVmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuL0F4aW9zRXJyb3IuanMnO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSByZXNwb25zZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgY29uc3QgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIFtBeGlvc0Vycm9yLkVSUl9CQURfUkVRVUVTVCwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFXVtNYXRoLmZsb29yKHJlc3BvbnNlLnN0YXR1cyAvIDEwMCkgLSA0XSxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHBhcmFtIHs/T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGZucywgcmVzcG9uc2UpIHtcbiAgY29uc3QgY29uZmlnID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgY29uc3QgY29udGV4dCA9IHJlc3BvbnNlIHx8IGNvbmZpZztcbiAgY29uc3QgaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGNvbnRleHQuaGVhZGVycyk7XG4gIGxldCBkYXRhID0gY29udGV4dC5kYXRhO1xuXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4uY2FsbChjb25maWcsIGRhdGEsIGhlYWRlcnMubm9ybWFsaXplKCksIHJlc3BvbnNlID8gcmVzcG9uc2Uuc3RhdHVzIDogdW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgaGVhZGVycy5ub3JtYWxpemUoKTtcblxuICByZXR1cm4gZGF0YTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgdHJhbnNpdGlvbmFsRGVmYXVsdHMgZnJvbSAnLi90cmFuc2l0aW9uYWwuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi4vaGVscGVycy90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCB0b1VSTEVuY29kZWRGb3JtIGZyb20gJy4uL2hlbHBlcnMvdG9VUkxFbmNvZGVkRm9ybS5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuaW1wb3J0IGZvcm1EYXRhVG9KU09OIGZyb20gJy4uL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMnO1xuXG4vKipcbiAqIEl0IHRha2VzIGEgc3RyaW5nLCB0cmllcyB0byBwYXJzZSBpdCwgYW5kIGlmIGl0IGZhaWxzLCBpdCByZXR1cm5zIHRoZSBzdHJpbmdpZmllZCB2ZXJzaW9uXG4gKiBvZiB0aGUgaW5wdXRcbiAqXG4gKiBAcGFyYW0ge2FueX0gcmF3VmFsdWUgLSBUaGUgdmFsdWUgdG8gYmUgc3RyaW5naWZpZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJzZXIgLSBBIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIGEgc3RyaW5nIGludG8gYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVuY29kZXIgLSBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSB2YWx1ZSBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZ2lmaWVkIHZlcnNpb24gb2YgdGhlIHJhd1ZhbHVlLlxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cbiAgdHJhbnNpdGlvbmFsOiB0cmFuc2l0aW9uYWxEZWZhdWx0cyxcblxuICBhZGFwdGVyOiBbJ3hocicsICdodHRwJywgJ2ZldGNoJ10sXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gaGVhZGVycy5nZXRDb250ZW50VHlwZSgpIHx8ICcnO1xuICAgIGNvbnN0IGhhc0pTT05Db250ZW50VHlwZSA9IGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSA+IC0xO1xuICAgIGNvbnN0IGlzT2JqZWN0UGF5bG9hZCA9IHV0aWxzLmlzT2JqZWN0KGRhdGEpO1xuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCAmJiB1dGlscy5pc0hUTUxGb3JtKGRhdGEpKSB7XG4gICAgICBkYXRhID0gbmV3IEZvcm1EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRm9ybURhdGEgPSB1dGlscy5pc0Zvcm1EYXRhKGRhdGEpO1xuXG4gICAgaWYgKGlzRm9ybURhdGEpIHtcbiAgICAgIHJldHVybiBoYXNKU09OQ29udGVudFR5cGUgPyBKU09OLnN0cmluZ2lmeShmb3JtRGF0YVRvSlNPTihkYXRhKSkgOiBkYXRhO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1JlYWRhYmxlU3RyZWFtKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnLCBmYWxzZSk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBpc0ZpbGVMaXN0O1xuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCkge1xuICAgICAgaWYgKGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRvVVJMRW5jb2RlZEZvcm0oZGF0YSwgdGhpcy5mb3JtU2VyaWFsaXplcikudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChpc0ZpbGVMaXN0ID0gdXRpbHMuaXNGaWxlTGlzdChkYXRhKSkgfHwgY29udGVudFR5cGUuaW5kZXhPZignbXVsdGlwYXJ0L2Zvcm0tZGF0YScpID4gLTEpIHtcbiAgICAgICAgY29uc3QgX0Zvcm1EYXRhID0gdGhpcy5lbnYgJiYgdGhpcy5lbnYuRm9ybURhdGE7XG5cbiAgICAgICAgcmV0dXJuIHRvRm9ybURhdGEoXG4gICAgICAgICAgaXNGaWxlTGlzdCA/IHsnZmlsZXNbXSc6IGRhdGF9IDogZGF0YSxcbiAgICAgICAgICBfRm9ybURhdGEgJiYgbmV3IF9Gb3JtRGF0YSgpLFxuICAgICAgICAgIHRoaXMuZm9ybVNlcmlhbGl6ZXJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNPYmplY3RQYXlsb2FkIHx8IGhhc0pTT05Db250ZW50VHlwZSApIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nLCBmYWxzZSk7XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2FmZWx5KGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICBjb25zdCB0cmFuc2l0aW9uYWwgPSB0aGlzLnRyYW5zaXRpb25hbCB8fCBkZWZhdWx0cy50cmFuc2l0aW9uYWw7XG4gICAgY29uc3QgZm9yY2VkSlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLmZvcmNlZEpTT05QYXJzaW5nO1xuICAgIGNvbnN0IEpTT05SZXF1ZXN0ZWQgPSB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nO1xuXG4gICAgaWYgKHV0aWxzLmlzUmVzcG9uc2UoZGF0YSkgfHwgdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgJiYgdXRpbHMuaXNTdHJpbmcoZGF0YSkgJiYgKChmb3JjZWRKU09OUGFyc2luZyAmJiAhdGhpcy5yZXNwb25zZVR5cGUpIHx8IEpTT05SZXF1ZXN0ZWQpKSB7XG4gICAgICBjb25zdCBzaWxlbnRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuc2lsZW50SlNPTlBhcnNpbmc7XG4gICAgICBjb25zdCBzdHJpY3RKU09OUGFyc2luZyA9ICFzaWxlbnRKU09OUGFyc2luZyAmJiBKU09OUmVxdWVzdGVkO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHN0cmljdEpTT05QYXJzaW5nKSB7XG4gICAgICAgICAgaWYgKGUubmFtZSA9PT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICAgICAgdGhyb3cgQXhpb3NFcnJvci5mcm9tKGUsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVNQT05TRSwgdGhpcywgbnVsbCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIGVudjoge1xuICAgIEZvcm1EYXRhOiBwbGF0Zm9ybS5jbGFzc2VzLkZvcm1EYXRhLFxuICAgIEJsb2I6IHBsYXRmb3JtLmNsYXNzZXMuQmxvYlxuICB9LFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH0sXG5cbiAgaGVhZGVyczoge1xuICAgIGNvbW1vbjoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCddLCAobWV0aG9kKSA9PiB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNpbGVudEpTT05QYXJzaW5nOiB0cnVlLFxuICBmb3JjZWRKU09OUGFyc2luZzogdHJ1ZSxcbiAgY2xhcmlmeVRpbWVvdXRFcnJvcjogZmFsc2Vcbn07XG4iLCJleHBvcnQgY29uc3QgVkVSU0lPTiA9IFwiMS43LjJcIjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4vdG9Gb3JtRGF0YS5qcyc7XG5cbi8qKlxuICogSXQgZW5jb2RlcyBhIHN0cmluZyBieSByZXBsYWNpbmcgYWxsIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IGluIHRoZSB1bnJlc2VydmVkIHNldCB3aXRoXG4gKiB0aGVpciBwZXJjZW50LWVuY29kZWQgZXF1aXZhbGVudHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBlbmNvZGUuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGVuY29kZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBlbmNvZGUoc3RyKSB7XG4gIGNvbnN0IGNoYXJNYXAgPSB7XG4gICAgJyEnOiAnJTIxJyxcbiAgICBcIidcIjogJyUyNycsXG4gICAgJygnOiAnJTI4JyxcbiAgICAnKSc6ICclMjknLFxuICAgICd+JzogJyU3RScsXG4gICAgJyUyMCc6ICcrJyxcbiAgICAnJTAwJzogJ1xceDAwJ1xuICB9O1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCl+XXwlMjB8JTAwL2csIGZ1bmN0aW9uIHJlcGxhY2VyKG1hdGNoKSB7XG4gICAgcmV0dXJuIGNoYXJNYXBbbWF0Y2hdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHBhcmFtcyBvYmplY3QgYW5kIGNvbnZlcnRzIGl0IHRvIGEgRm9ybURhdGEgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBGb3JtRGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBvYmplY3QgcGFzc2VkIHRvIHRoZSBBeGlvcyBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKSB7XG4gIHRoaXMuX3BhaXJzID0gW107XG5cbiAgcGFyYW1zICYmIHRvRm9ybURhdGEocGFyYW1zLCB0aGlzLCBvcHRpb25zKTtcbn1cblxuY29uc3QgcHJvdG90eXBlID0gQXhpb3NVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlO1xuXG5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gYXBwZW5kKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX3BhaXJzLnB1c2goW25hbWUsIHZhbHVlXSk7XG59O1xuXG5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhlbmNvZGVyKSB7XG4gIGNvbnN0IF9lbmNvZGUgPSBlbmNvZGVyID8gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2Rlci5jYWxsKHRoaXMsIHZhbHVlLCBlbmNvZGUpO1xuICB9IDogZW5jb2RlO1xuXG4gIHJldHVybiB0aGlzLl9wYWlycy5tYXAoZnVuY3Rpb24gZWFjaChwYWlyKSB7XG4gICAgcmV0dXJuIF9lbmNvZGUocGFpclswXSkgKyAnPScgKyBfZW5jb2RlKHBhaXJbMV0pO1xuICB9LCAnJykuam9pbignJicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCJjb25zdCBIdHRwU3RhdHVzQ29kZSA9IHtcbiAgQ29udGludWU6IDEwMCxcbiAgU3dpdGNoaW5nUHJvdG9jb2xzOiAxMDEsXG4gIFByb2Nlc3Npbmc6IDEwMixcbiAgRWFybHlIaW50czogMTAzLFxuICBPazogMjAwLFxuICBDcmVhdGVkOiAyMDEsXG4gIEFjY2VwdGVkOiAyMDIsXG4gIE5vbkF1dGhvcml0YXRpdmVJbmZvcm1hdGlvbjogMjAzLFxuICBOb0NvbnRlbnQ6IDIwNCxcbiAgUmVzZXRDb250ZW50OiAyMDUsXG4gIFBhcnRpYWxDb250ZW50OiAyMDYsXG4gIE11bHRpU3RhdHVzOiAyMDcsXG4gIEFscmVhZHlSZXBvcnRlZDogMjA4LFxuICBJbVVzZWQ6IDIyNixcbiAgTXVsdGlwbGVDaG9pY2VzOiAzMDAsXG4gIE1vdmVkUGVybWFuZW50bHk6IDMwMSxcbiAgRm91bmQ6IDMwMixcbiAgU2VlT3RoZXI6IDMwMyxcbiAgTm90TW9kaWZpZWQ6IDMwNCxcbiAgVXNlUHJveHk6IDMwNSxcbiAgVW51c2VkOiAzMDYsXG4gIFRlbXBvcmFyeVJlZGlyZWN0OiAzMDcsXG4gIFBlcm1hbmVudFJlZGlyZWN0OiAzMDgsXG4gIEJhZFJlcXVlc3Q6IDQwMCxcbiAgVW5hdXRob3JpemVkOiA0MDEsXG4gIFBheW1lbnRSZXF1aXJlZDogNDAyLFxuICBGb3JiaWRkZW46IDQwMyxcbiAgTm90Rm91bmQ6IDQwNCxcbiAgTWV0aG9kTm90QWxsb3dlZDogNDA1LFxuICBOb3RBY2NlcHRhYmxlOiA0MDYsXG4gIFByb3h5QXV0aGVudGljYXRpb25SZXF1aXJlZDogNDA3LFxuICBSZXF1ZXN0VGltZW91dDogNDA4LFxuICBDb25mbGljdDogNDA5LFxuICBHb25lOiA0MTAsXG4gIExlbmd0aFJlcXVpcmVkOiA0MTEsXG4gIFByZWNvbmRpdGlvbkZhaWxlZDogNDEyLFxuICBQYXlsb2FkVG9vTGFyZ2U6IDQxMyxcbiAgVXJpVG9vTG9uZzogNDE0LFxuICBVbnN1cHBvcnRlZE1lZGlhVHlwZTogNDE1LFxuICBSYW5nZU5vdFNhdGlzZmlhYmxlOiA0MTYsXG4gIEV4cGVjdGF0aW9uRmFpbGVkOiA0MTcsXG4gIEltQVRlYXBvdDogNDE4LFxuICBNaXNkaXJlY3RlZFJlcXVlc3Q6IDQyMSxcbiAgVW5wcm9jZXNzYWJsZUVudGl0eTogNDIyLFxuICBMb2NrZWQ6IDQyMyxcbiAgRmFpbGVkRGVwZW5kZW5jeTogNDI0LFxuICBUb29FYXJseTogNDI1LFxuICBVcGdyYWRlUmVxdWlyZWQ6IDQyNixcbiAgUHJlY29uZGl0aW9uUmVxdWlyZWQ6IDQyOCxcbiAgVG9vTWFueVJlcXVlc3RzOiA0MjksXG4gIFJlcXVlc3RIZWFkZXJGaWVsZHNUb29MYXJnZTogNDMxLFxuICBVbmF2YWlsYWJsZUZvckxlZ2FsUmVhc29uczogNDUxLFxuICBJbnRlcm5hbFNlcnZlckVycm9yOiA1MDAsXG4gIE5vdEltcGxlbWVudGVkOiA1MDEsXG4gIEJhZEdhdGV3YXk6IDUwMixcbiAgU2VydmljZVVuYXZhaWxhYmxlOiA1MDMsXG4gIEdhdGV3YXlUaW1lb3V0OiA1MDQsXG4gIEh0dHBWZXJzaW9uTm90U3VwcG9ydGVkOiA1MDUsXG4gIFZhcmlhbnRBbHNvTmVnb3RpYXRlczogNTA2LFxuICBJbnN1ZmZpY2llbnRTdG9yYWdlOiA1MDcsXG4gIExvb3BEZXRlY3RlZDogNTA4LFxuICBOb3RFeHRlbmRlZDogNTEwLFxuICBOZXR3b3JrQXV0aGVudGljYXRpb25SZXF1aXJlZDogNTExLFxufTtcblxuT2JqZWN0LmVudHJpZXMoSHR0cFN0YXR1c0NvZGUpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICBIdHRwU3RhdHVzQ29kZVt2YWx1ZV0gPSBrZXk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSHR0cFN0YXR1c0NvZGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NVUkxTZWFyY2hQYXJhbXMgZnJvbSAnLi4vaGVscGVycy9BeGlvc1VSTFNlYXJjaFBhcmFtcy5qcyc7XG5cbi8qKlxuICogSXQgcmVwbGFjZXMgYWxsIGluc3RhbmNlcyBvZiB0aGUgY2hhcmFjdGVycyBgOmAsIGAkYCwgYCxgLCBgK2AsIGBbYCwgYW5kIGBdYCB3aXRoIHRoZWlyXG4gKiBVUkkgZW5jb2RlZCBjb3VudGVycGFydHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsIFRoZSB2YWx1ZSB0byBiZSBlbmNvZGVkLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlbmNvZGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHBhcmFtIHs/b2JqZWN0fSBvcHRpb25zXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBcbiAgY29uc3QgX2VuY29kZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGUgfHwgZW5jb2RlO1xuXG4gIGNvbnN0IHNlcmlhbGl6ZUZuID0gb3B0aW9ucyAmJiBvcHRpb25zLnNlcmlhbGl6ZTtcblxuICBsZXQgc2VyaWFsaXplZFBhcmFtcztcblxuICBpZiAoc2VyaWFsaXplRm4pIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gc2VyaWFsaXplRm4ocGFyYW1zLCBvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gdXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSA/XG4gICAgICBwYXJhbXMudG9TdHJpbmcoKSA6XG4gICAgICBuZXcgQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKS50b1N0cmluZyhfZW5jb2RlKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgY29uc3QgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKFwiI1wiKTtcblxuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvP1xcLyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn1cbiIsImltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gXCIuLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qc1wiO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSBcIi4uL2NvcmUvQXhpb3NFcnJvci5qc1wiO1xuXG5jb25zdCBjb21wb3NlU2lnbmFscyA9IChzaWduYWxzLCB0aW1lb3V0KSA9PiB7XG4gIGxldCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXG4gIGxldCBhYm9ydGVkO1xuXG4gIGNvbnN0IG9uYWJvcnQgPSBmdW5jdGlvbiAoY2FuY2VsKSB7XG4gICAgaWYgKCFhYm9ydGVkKSB7XG4gICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICBjb25zdCBlcnIgPSBjYW5jZWwgaW5zdGFuY2VvZiBFcnJvciA/IGNhbmNlbCA6IHRoaXMucmVhc29uO1xuICAgICAgY29udHJvbGxlci5hYm9ydChlcnIgaW5zdGFuY2VvZiBBeGlvc0Vycm9yID8gZXJyIDogbmV3IENhbmNlbGVkRXJyb3IoZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IGVycikpO1xuICAgIH1cbiAgfVxuXG4gIGxldCB0aW1lciA9IHRpbWVvdXQgJiYgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgb25hYm9ydChuZXcgQXhpb3NFcnJvcihgdGltZW91dCAke3RpbWVvdXR9IG9mIG1zIGV4Y2VlZGVkYCwgQXhpb3NFcnJvci5FVElNRURPVVQpKVxuICB9LCB0aW1lb3V0KVxuXG4gIGNvbnN0IHVuc3Vic2NyaWJlID0gKCkgPT4ge1xuICAgIGlmIChzaWduYWxzKSB7XG4gICAgICB0aW1lciAmJiBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgc2lnbmFscy5mb3JFYWNoKHNpZ25hbCA9PiB7XG4gICAgICAgIHNpZ25hbCAmJlxuICAgICAgICAoc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIgPyBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbmFib3J0KSA6IHNpZ25hbC51bnN1YnNjcmliZShvbmFib3J0KSk7XG4gICAgICB9KTtcbiAgICAgIHNpZ25hbHMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNpZ25hbHMuZm9yRWFjaCgoc2lnbmFsKSA9PiBzaWduYWwgJiYgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCkpO1xuXG4gIGNvbnN0IHtzaWduYWx9ID0gY29udHJvbGxlcjtcblxuICBzaWduYWwudW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTtcblxuICByZXR1cm4gW3NpZ25hbCwgKCkgPT4ge1xuICAgIHRpbWVyICYmIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgdGltZXIgPSBudWxsO1xuICB9XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zZVNpZ25hbHM7XG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuXG5leHBvcnQgZGVmYXVsdCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICB7XG4gICAgd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICBjb25zdCBjb29raWUgPSBbbmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSldO1xuXG4gICAgICB1dGlscy5pc051bWJlcihleHBpcmVzKSAmJiBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG5cbiAgICAgIHV0aWxzLmlzU3RyaW5nKHBhdGgpICYmIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcblxuICAgICAgdXRpbHMuaXNTdHJpbmcoZG9tYWluKSAmJiBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuXG4gICAgICBzZWN1cmUgPT09IHRydWUgJiYgY29va2llLnB1c2goJ3NlY3VyZScpO1xuXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICB9LFxuXG4gICAgcmVhZChuYW1lKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgIH0sXG5cbiAgICByZW1vdmUobmFtZSkge1xuICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICB9XG4gIH1cblxuICA6XG5cbiAgLy8gTm9uLXN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICB7XG4gICAgd3JpdGUoKSB7fSxcbiAgICByZWFkKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByZW1vdmUoKSB7fVxuICB9O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogSXQgdGFrZXMgYSBzdHJpbmcgbGlrZSBgZm9vW3hdW3ldW3pdYCBhbmQgcmV0dXJucyBhbiBhcnJheSBsaWtlIGBbJ2ZvbycsICd4JywgJ3knLCAneiddXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICpcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlUHJvcFBhdGgobmFtZSkge1xuICAvLyBmb29beF1beV1bel1cbiAgLy8gZm9vLngueS56XG4gIC8vIGZvby14LXktelxuICAvLyBmb28geCB5IHpcbiAgcmV0dXJuIHV0aWxzLm1hdGNoQWxsKC9cXHcrfFxcWyhcXHcqKV0vZywgbmFtZSkubWFwKG1hdGNoID0+IHtcbiAgICByZXR1cm4gbWF0Y2hbMF0gPT09ICdbXScgPyAnJyA6IG1hdGNoWzFdIHx8IG1hdGNoWzBdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIGFycmF5IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGFyciAtIFRoZSBhcnJheSB0byBjb252ZXJ0IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFuZCB2YWx1ZXMgYXMgdGhlIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheVRvT2JqZWN0KGFycikge1xuICBjb25zdCBvYmogPSB7fTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gIGxldCBpO1xuICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgbGV0IGtleTtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICBvYmpba2V5XSA9IGFycltrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBGb3JtRGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBKYXZhU2NyaXB0IG9iamVjdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtRGF0YSBUaGUgRm9ybURhdGEgb2JqZWN0IHRvIGNvbnZlcnQgdG8gSlNPTi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0PHN0cmluZywgYW55PiB8IG51bGx9IFRoZSBjb252ZXJ0ZWQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBmb3JtRGF0YVRvSlNPTihmb3JtRGF0YSkge1xuICBmdW5jdGlvbiBidWlsZFBhdGgocGF0aCwgdmFsdWUsIHRhcmdldCwgaW5kZXgpIHtcbiAgICBsZXQgbmFtZSA9IHBhdGhbaW5kZXgrK107XG5cbiAgICBpZiAobmFtZSA9PT0gJ19fcHJvdG9fXycpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3QgaXNOdW1lcmljS2V5ID0gTnVtYmVyLmlzRmluaXRlKCtuYW1lKTtcbiAgICBjb25zdCBpc0xhc3QgPSBpbmRleCA+PSBwYXRoLmxlbmd0aDtcbiAgICBuYW1lID0gIW5hbWUgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXQpID8gdGFyZ2V0Lmxlbmd0aCA6IG5hbWU7XG5cbiAgICBpZiAoaXNMYXN0KSB7XG4gICAgICBpZiAodXRpbHMuaGFzT3duUHJvcCh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IFt0YXJnZXRbbmFtZV0sIHZhbHVlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gIWlzTnVtZXJpY0tleTtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldFtuYW1lXSB8fCAhdXRpbHMuaXNPYmplY3QodGFyZ2V0W25hbWVdKSkge1xuICAgICAgdGFyZ2V0W25hbWVdID0gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYnVpbGRQYXRoKHBhdGgsIHZhbHVlLCB0YXJnZXRbbmFtZV0sIGluZGV4KTtcblxuICAgIGlmIChyZXN1bHQgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXRbbmFtZV0pKSB7XG4gICAgICB0YXJnZXRbbmFtZV0gPSBhcnJheVRvT2JqZWN0KHRhcmdldFtuYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICFpc051bWVyaWNLZXk7XG4gIH1cblxuICBpZiAodXRpbHMuaXNGb3JtRGF0YShmb3JtRGF0YSkgJiYgdXRpbHMuaXNGdW5jdGlvbihmb3JtRGF0YS5lbnRyaWVzKSkge1xuICAgIGNvbnN0IG9iaiA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaEVudHJ5KGZvcm1EYXRhLCAobmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGJ1aWxkUGF0aChwYXJzZVByb3BQYXRoKG5hbWUpLCB2YWx1ZSwgb2JqLCAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9ybURhdGFUb0pTT047XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkK1xcLS5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gdXRpbHMuaXNPYmplY3QocGF5bG9hZCkgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgcGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyRW52ID9cblxuLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4vLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICBjb25zdCBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBjb25zdCB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsZXQgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdHMgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgbGV0IGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgIH07XG4gIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH0pKCk7XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc3RyaWN0XG5leHBvcnQgZGVmYXVsdCBudWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbi8vIFJhd0F4aW9zSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbmNvbnN0IGlnbm9yZUR1cGxpY2F0ZU9mID0gdXRpbHMudG9PYmplY3RTZXQoW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl0pO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmF3SGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKlxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgcmF3SGVhZGVycyA9PiB7XG4gIGNvbnN0IHBhcnNlZCA9IHt9O1xuICBsZXQga2V5O1xuICBsZXQgdmFsO1xuICBsZXQgaTtcblxuICByYXdIZWFkZXJzICYmIHJhd0hlYWRlcnMuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgaSkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gbGluZS5zdWJzdHJpbmcoaSArIDEpLnRyaW0oKTtcblxuICAgIGlmICgha2V5IHx8IChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZltrZXldKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgaWYgKHBhcnNlZFtrZXldKSB7XG4gICAgICAgIHBhcnNlZFtrZXldLnB1c2godmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gW3ZhbF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VQcm90b2NvbCh1cmwpIHtcbiAgY29uc3QgbWF0Y2ggPSAvXihbLStcXHddezEsMjV9KSg6P1xcL1xcL3w6KS8uZXhlYyh1cmwpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV0gfHwgJyc7XG59XG4iLCJpbXBvcnQgc3BlZWRvbWV0ZXIgZnJvbSBcIi4vc3BlZWRvbWV0ZXIuanNcIjtcbmltcG9ydCB0aHJvdHRsZSBmcm9tIFwiLi90aHJvdHRsZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAobGlzdGVuZXIsIGlzRG93bmxvYWRTdHJlYW0sIGZyZXEgPSAzKSA9PiB7XG4gIGxldCBieXRlc05vdGlmaWVkID0gMDtcbiAgY29uc3QgX3NwZWVkb21ldGVyID0gc3BlZWRvbWV0ZXIoNTAsIDI1MCk7XG5cbiAgcmV0dXJuIHRocm90dGxlKGUgPT4ge1xuICAgIGNvbnN0IGxvYWRlZCA9IGUubG9hZGVkO1xuICAgIGNvbnN0IHRvdGFsID0gZS5sZW5ndGhDb21wdXRhYmxlID8gZS50b3RhbCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwcm9ncmVzc0J5dGVzID0gbG9hZGVkIC0gYnl0ZXNOb3RpZmllZDtcbiAgICBjb25zdCByYXRlID0gX3NwZWVkb21ldGVyKHByb2dyZXNzQnl0ZXMpO1xuICAgIGNvbnN0IGluUmFuZ2UgPSBsb2FkZWQgPD0gdG90YWw7XG5cbiAgICBieXRlc05vdGlmaWVkID0gbG9hZGVkO1xuXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGxvYWRlZCxcbiAgICAgIHRvdGFsLFxuICAgICAgcHJvZ3Jlc3M6IHRvdGFsID8gKGxvYWRlZCAvIHRvdGFsKSA6IHVuZGVmaW5lZCxcbiAgICAgIGJ5dGVzOiBwcm9ncmVzc0J5dGVzLFxuICAgICAgcmF0ZTogcmF0ZSA/IHJhdGUgOiB1bmRlZmluZWQsXG4gICAgICBlc3RpbWF0ZWQ6IHJhdGUgJiYgdG90YWwgJiYgaW5SYW5nZSA/ICh0b3RhbCAtIGxvYWRlZCkgLyByYXRlIDogdW5kZWZpbmVkLFxuICAgICAgZXZlbnQ6IGUsXG4gICAgICBsZW5ndGhDb21wdXRhYmxlOiB0b3RhbCAhPSBudWxsXG4gICAgfTtcblxuICAgIGRhdGFbaXNEb3dubG9hZFN0cmVhbSA/ICdkb3dubG9hZCcgOiAndXBsb2FkJ10gPSB0cnVlO1xuXG4gICAgbGlzdGVuZXIoZGF0YSk7XG4gIH0sIGZyZXEpO1xufVxuIiwiaW1wb3J0IHBsYXRmb3JtIGZyb20gXCIuLi9wbGF0Zm9ybS9pbmRleC5qc1wiO1xuaW1wb3J0IHV0aWxzIGZyb20gXCIuLi91dGlscy5qc1wiO1xuaW1wb3J0IGlzVVJMU2FtZU9yaWdpbiBmcm9tIFwiLi9pc1VSTFNhbWVPcmlnaW4uanNcIjtcbmltcG9ydCBjb29raWVzIGZyb20gXCIuL2Nvb2tpZXMuanNcIjtcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gXCIuLi9jb3JlL2J1aWxkRnVsbFBhdGguanNcIjtcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tIFwiLi4vY29yZS9tZXJnZUNvbmZpZy5qc1wiO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCBidWlsZFVSTCBmcm9tIFwiLi9idWlsZFVSTC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAoY29uZmlnKSA9PiB7XG4gIGNvbnN0IG5ld0NvbmZpZyA9IG1lcmdlQ29uZmlnKHt9LCBjb25maWcpO1xuXG4gIGxldCB7ZGF0YSwgd2l0aFhTUkZUb2tlbiwgeHNyZkhlYWRlck5hbWUsIHhzcmZDb29raWVOYW1lLCBoZWFkZXJzLCBhdXRofSA9IG5ld0NvbmZpZztcblxuICBuZXdDb25maWcuaGVhZGVycyA9IGhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShoZWFkZXJzKTtcblxuICBuZXdDb25maWcudXJsID0gYnVpbGRVUkwoYnVpbGRGdWxsUGF0aChuZXdDb25maWcuYmFzZVVSTCwgbmV3Q29uZmlnLnVybCksIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKTtcblxuICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gIGlmIChhdXRoKSB7XG4gICAgaGVhZGVycy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArXG4gICAgICBidG9hKChhdXRoLnVzZXJuYW1lIHx8ICcnKSArICc6JyArIChhdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGF1dGgucGFzc3dvcmQpKSA6ICcnKSlcbiAgICApO1xuICB9XG5cbiAgbGV0IGNvbnRlbnRUeXBlO1xuXG4gIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpKSB7XG4gICAgaWYgKHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudiB8fCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJXZWJXb3JrZXJFbnYpIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUodW5kZWZpbmVkKTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH0gZWxzZSBpZiAoKGNvbnRlbnRUeXBlID0gaGVhZGVycy5nZXRDb250ZW50VHlwZSgpKSAhPT0gZmFsc2UpIHtcbiAgICAgIC8vIGZpeCBzZW1pY29sb24gZHVwbGljYXRpb24gaXNzdWUgZm9yIFJlYWN0TmF0aXZlIEZvcm1EYXRhIGltcGxlbWVudGF0aW9uXG4gICAgICBjb25zdCBbdHlwZSwgLi4udG9rZW5zXSA9IGNvbnRlbnRUeXBlID8gY29udGVudFR5cGUuc3BsaXQoJzsnKS5tYXAodG9rZW4gPT4gdG9rZW4udHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXTtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoW3R5cGUgfHwgJ211bHRpcGFydC9mb3JtLWRhdGEnLCAuLi50b2tlbnNdLmpvaW4oJzsgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCB4c3JmIGhlYWRlclxuICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cblxuICBpZiAocGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyRW52KSB7XG4gICAgd2l0aFhTUkZUb2tlbiAmJiB1dGlscy5pc0Z1bmN0aW9uKHdpdGhYU1JGVG9rZW4pICYmICh3aXRoWFNSRlRva2VuID0gd2l0aFhTUkZUb2tlbihuZXdDb25maWcpKTtcblxuICAgIGlmICh3aXRoWFNSRlRva2VuIHx8ICh3aXRoWFNSRlRva2VuICE9PSBmYWxzZSAmJiBpc1VSTFNhbWVPcmlnaW4obmV3Q29uZmlnLnVybCkpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIGNvbnN0IHhzcmZWYWx1ZSA9IHhzcmZIZWFkZXJOYW1lICYmIHhzcmZDb29raWVOYW1lICYmIGNvb2tpZXMucmVhZCh4c3JmQ29va2llTmFtZSk7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgaGVhZGVycy5zZXQoeHNyZkhlYWRlck5hbWUsIHhzcmZWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0NvbmZpZztcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENhbGN1bGF0ZSBkYXRhIG1heFJhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc2FtcGxlc0NvdW50PSAxMF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbbWluPSAxMDAwXVxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBzcGVlZG9tZXRlcihzYW1wbGVzQ291bnQsIG1pbikge1xuICBzYW1wbGVzQ291bnQgPSBzYW1wbGVzQ291bnQgfHwgMTA7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IEFycmF5KHNhbXBsZXNDb3VudCk7XG4gIGNvbnN0IHRpbWVzdGFtcHMgPSBuZXcgQXJyYXkoc2FtcGxlc0NvdW50KTtcbiAgbGV0IGhlYWQgPSAwO1xuICBsZXQgdGFpbCA9IDA7XG4gIGxldCBmaXJzdFNhbXBsZVRTO1xuXG4gIG1pbiA9IG1pbiAhPT0gdW5kZWZpbmVkID8gbWluIDogMTAwMDtcblxuICByZXR1cm4gZnVuY3Rpb24gcHVzaChjaHVua0xlbmd0aCkge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICBjb25zdCBzdGFydGVkQXQgPSB0aW1lc3RhbXBzW3RhaWxdO1xuXG4gICAgaWYgKCFmaXJzdFNhbXBsZVRTKSB7XG4gICAgICBmaXJzdFNhbXBsZVRTID0gbm93O1xuICAgIH1cblxuICAgIGJ5dGVzW2hlYWRdID0gY2h1bmtMZW5ndGg7XG4gICAgdGltZXN0YW1wc1toZWFkXSA9IG5vdztcblxuICAgIGxldCBpID0gdGFpbDtcbiAgICBsZXQgYnl0ZXNDb3VudCA9IDA7XG5cbiAgICB3aGlsZSAoaSAhPT0gaGVhZCkge1xuICAgICAgYnl0ZXNDb3VudCArPSBieXRlc1tpKytdO1xuICAgICAgaSA9IGkgJSBzYW1wbGVzQ291bnQ7XG4gICAgfVxuXG4gICAgaGVhZCA9IChoZWFkICsgMSkgJSBzYW1wbGVzQ291bnQ7XG5cbiAgICBpZiAoaGVhZCA9PT0gdGFpbCkge1xuICAgICAgdGFpbCA9ICh0YWlsICsgMSkgJSBzYW1wbGVzQ291bnQ7XG4gICAgfVxuXG4gICAgaWYgKG5vdyAtIGZpcnN0U2FtcGxlVFMgPCBtaW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXNzZWQgPSBzdGFydGVkQXQgJiYgbm93IC0gc3RhcnRlZEF0O1xuXG4gICAgcmV0dXJuIHBhc3NlZCA/IE1hdGgucm91bmQoYnl0ZXNDb3VudCAqIDEwMDAgLyBwYXNzZWQpIDogdW5kZWZpbmVkO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzcGVlZG9tZXRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVGhyb3R0bGUgZGVjb3JhdG9yXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOdW1iZXJ9IGZyZXFcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmbiwgZnJlcSkge1xuICBsZXQgdGltZXN0YW1wID0gMDtcbiAgY29uc3QgdGhyZXNob2xkID0gMTAwMCAvIGZyZXE7XG4gIGxldCB0aW1lciA9IG51bGw7XG4gIHJldHVybiBmdW5jdGlvbiB0aHJvdHRsZWQoKSB7XG4gICAgY29uc3QgZm9yY2UgPSB0aGlzID09PSB0cnVlO1xuXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAoZm9yY2UgfHwgbm93IC0gdGltZXN0YW1wID4gdGhyZXNob2xkKSB7XG4gICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgdGltZXN0YW1wID0gbm93O1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGlmICghdGltZXIpIHtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICB9LCB0aHJlc2hvbGQgLSAobm93IC0gdGltZXN0YW1wKSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB0aHJvdHRsZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG4vLyB0ZW1wb3JhcnkgaG90Zml4IHRvIGF2b2lkIGNpcmN1bGFyIHJlZmVyZW5jZXMgdW50aWwgQXhpb3NVUkxTZWFyY2hQYXJhbXMgaXMgcmVmYWN0b3JlZFxuaW1wb3J0IFBsYXRmb3JtRm9ybURhdGEgZnJvbSAnLi4vcGxhdGZvcm0vbm9kZS9jbGFzc2VzL0Zvcm1EYXRhLmpzJztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBnaXZlbiB0aGluZyBpcyBhIGFycmF5IG9yIGpzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhpbmcgLSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGJlIHZpc2l0ZWQuXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVmlzaXRhYmxlKHRoaW5nKSB7XG4gIHJldHVybiB1dGlscy5pc1BsYWluT2JqZWN0KHRoaW5nKSB8fCB1dGlscy5pc0FycmF5KHRoaW5nKTtcbn1cblxuLyoqXG4gKiBJdCByZW1vdmVzIHRoZSBicmFja2V0cyBmcm9tIHRoZSBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSBvZiB0aGUgcGFyYW1ldGVyLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBrZXkgd2l0aG91dCB0aGUgYnJhY2tldHMuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUJyYWNrZXRzKGtleSkge1xuICByZXR1cm4gdXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSA/IGtleS5zbGljZSgwLCAtMikgOiBrZXk7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBwYXRoLCBhIGtleSwgYW5kIGEgYm9vbGVhbiwgYW5kIHJldHVybnMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBjdXJyZW50IGtleS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBjdXJyZW50IG9iamVjdCBiZWluZyBpdGVyYXRlZCBvdmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGRvdHMgLSBJZiB0cnVlLCB0aGUga2V5IHdpbGwgYmUgcmVuZGVyZWQgd2l0aCBkb3RzIGluc3RlYWQgb2YgYnJhY2tldHMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHBhdGggdG8gdGhlIGN1cnJlbnQga2V5LlxuICovXG5mdW5jdGlvbiByZW5kZXJLZXkocGF0aCwga2V5LCBkb3RzKSB7XG4gIGlmICghcGF0aCkgcmV0dXJuIGtleTtcbiAgcmV0dXJuIHBhdGguY29uY2F0KGtleSkubWFwKGZ1bmN0aW9uIGVhY2godG9rZW4sIGkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICB0b2tlbiA9IHJlbW92ZUJyYWNrZXRzKHRva2VuKTtcbiAgICByZXR1cm4gIWRvdHMgJiYgaSA/ICdbJyArIHRva2VuICsgJ10nIDogdG9rZW47XG4gIH0pLmpvaW4oZG90cyA/ICcuJyA6ICcnKTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgYXJyYXkgaXMgYW4gYXJyYXkgYW5kIG5vbmUgb2YgaXRzIGVsZW1lbnRzIGFyZSB2aXNpdGFibGUsIHRoZW4gaXQncyBhIGZsYXQgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheTxhbnk+fSBhcnIgLSBUaGUgYXJyYXkgdG8gY2hlY2tcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGbGF0QXJyYXkoYXJyKSB7XG4gIHJldHVybiB1dGlscy5pc0FycmF5KGFycikgJiYgIWFyci5zb21lKGlzVmlzaXRhYmxlKTtcbn1cblxuY29uc3QgcHJlZGljYXRlcyA9IHV0aWxzLnRvRmxhdE9iamVjdCh1dGlscywge30sIG51bGwsIGZ1bmN0aW9uIGZpbHRlcihwcm9wKSB7XG4gIHJldHVybiAvXmlzW0EtWl0vLnRlc3QocHJvcCk7XG59KTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgZGF0YSBvYmplY3QgdG8gRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0gez9PYmplY3R9IFtmb3JtRGF0YV1cbiAqIEBwYXJhbSB7P09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy52aXNpdG9yXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5tZXRhVG9rZW5zID0gdHJ1ZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZG90cyA9IGZhbHNlXVxuICogQHBhcmFtIHs/Qm9vbGVhbn0gW29wdGlvbnMuaW5kZXhlcyA9IGZhbHNlXVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiovXG5cbi8qKlxuICogSXQgY29udmVydHMgYW4gb2JqZWN0IGludG8gYSBGb3JtRGF0YSBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdDxhbnksIGFueT59IG9iaiAtIFRoZSBvYmplY3QgdG8gY29udmVydCB0byBmb3JtIGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybURhdGEgLSBUaGUgRm9ybURhdGEgb2JqZWN0IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7T2JqZWN0PHN0cmluZywgYW55Pn0gb3B0aW9uc1xuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHRvRm9ybURhdGEob2JqLCBmb3JtRGF0YSwgb3B0aW9ucykge1xuICBpZiAoIXV0aWxzLmlzT2JqZWN0KG9iaikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBmb3JtRGF0YSA9IGZvcm1EYXRhIHx8IG5ldyAoUGxhdGZvcm1Gb3JtRGF0YSB8fCBGb3JtRGF0YSkoKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgb3B0aW9ucyA9IHV0aWxzLnRvRmxhdE9iamVjdChvcHRpb25zLCB7XG4gICAgbWV0YVRva2VuczogdHJ1ZSxcbiAgICBkb3RzOiBmYWxzZSxcbiAgICBpbmRleGVzOiBmYWxzZVxuICB9LCBmYWxzZSwgZnVuY3Rpb24gZGVmaW5lZChvcHRpb24sIHNvdXJjZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuICAgIHJldHVybiAhdXRpbHMuaXNVbmRlZmluZWQoc291cmNlW29wdGlvbl0pO1xuICB9KTtcblxuICBjb25zdCBtZXRhVG9rZW5zID0gb3B0aW9ucy5tZXRhVG9rZW5zO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgY29uc3QgdmlzaXRvciA9IG9wdGlvbnMudmlzaXRvciB8fCBkZWZhdWx0VmlzaXRvcjtcbiAgY29uc3QgZG90cyA9IG9wdGlvbnMuZG90cztcbiAgY29uc3QgaW5kZXhlcyA9IG9wdGlvbnMuaW5kZXhlcztcbiAgY29uc3QgX0Jsb2IgPSBvcHRpb25zLkJsb2IgfHwgdHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIEJsb2I7XG4gIGNvbnN0IHVzZUJsb2IgPSBfQmxvYiAmJiB1dGlscy5pc1NwZWNDb21wbGlhbnRGb3JtKGZvcm1EYXRhKTtcblxuICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24odmlzaXRvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2aXNpdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgZnVuY3Rpb24gY29udmVydFZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSByZXR1cm4gJyc7XG5cbiAgICBpZiAodXRpbHMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKCF1c2VCbG9iICYmIHV0aWxzLmlzQmxvYih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdCbG9iIGlzIG5vdCBzdXBwb3J0ZWQuIFVzZSBhIEJ1ZmZlciBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKHZhbHVlKSB8fCB1dGlscy5pc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdXNlQmxvYiAmJiB0eXBlb2YgQmxvYiA9PT0gJ2Z1bmN0aW9uJyA/IG5ldyBCbG9iKFt2YWx1ZV0pIDogQnVmZmVyLmZyb20odmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHZpc2l0b3IuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBrZXlcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmd8TnVtYmVyPn0gcGF0aFxuICAgKiBAdGhpcyB7Rm9ybURhdGF9XG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB0byB2aXNpdCB0aGUgZWFjaCBwcm9wIG9mIHRoZSB2YWx1ZSByZWN1cnNpdmVseVxuICAgKi9cbiAgZnVuY3Rpb24gZGVmYXVsdFZpc2l0b3IodmFsdWUsIGtleSwgcGF0aCkge1xuICAgIGxldCBhcnIgPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSAmJiAhcGF0aCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAodXRpbHMuZW5kc1dpdGgoa2V5LCAne30nKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAga2V5ID0gbWV0YVRva2VucyA/IGtleSA6IGtleS5zbGljZSgwLCAtMik7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICh1dGlscy5pc0FycmF5KHZhbHVlKSAmJiBpc0ZsYXRBcnJheSh2YWx1ZSkpIHx8XG4gICAgICAgICgodXRpbHMuaXNGaWxlTGlzdCh2YWx1ZSkgfHwgdXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSkgJiYgKGFyciA9IHV0aWxzLnRvQXJyYXkodmFsdWUpKVxuICAgICAgICApKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICBrZXkgPSByZW1vdmVCcmFja2V0cyhrZXkpO1xuXG4gICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIGVhY2goZWwsIGluZGV4KSB7XG4gICAgICAgICAgISh1dGlscy5pc1VuZGVmaW5lZChlbCkgfHwgZWwgPT09IG51bGwpICYmIGZvcm1EYXRhLmFwcGVuZChcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxuICAgICAgICAgICAgaW5kZXhlcyA9PT0gdHJ1ZSA/IHJlbmRlcktleShba2V5XSwgaW5kZXgsIGRvdHMpIDogKGluZGV4ZXMgPT09IG51bGwgPyBrZXkgOiBrZXkgKyAnW10nKSxcbiAgICAgICAgICAgIGNvbnZlcnRWYWx1ZShlbClcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1Zpc2l0YWJsZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvcm1EYXRhLmFwcGVuZChyZW5kZXJLZXkocGF0aCwga2V5LCBkb3RzKSwgY29udmVydFZhbHVlKHZhbHVlKSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFjayA9IFtdO1xuXG4gIGNvbnN0IGV4cG9zZWRIZWxwZXJzID0gT2JqZWN0LmFzc2lnbihwcmVkaWNhdGVzLCB7XG4gICAgZGVmYXVsdFZpc2l0b3IsXG4gICAgY29udmVydFZhbHVlLFxuICAgIGlzVmlzaXRhYmxlXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGJ1aWxkKHZhbHVlLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxzLmlzVW5kZWZpbmVkKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgaWYgKHN0YWNrLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCBpbiAnICsgcGF0aC5qb2luKCcuJykpO1xuICAgIH1cblxuICAgIHN0YWNrLnB1c2godmFsdWUpO1xuXG4gICAgdXRpbHMuZm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24gZWFjaChlbCwga2V5KSB7XG4gICAgICBjb25zdCByZXN1bHQgPSAhKHV0aWxzLmlzVW5kZWZpbmVkKGVsKSB8fCBlbCA9PT0gbnVsbCkgJiYgdmlzaXRvci5jYWxsKFxuICAgICAgICBmb3JtRGF0YSwgZWwsIHV0aWxzLmlzU3RyaW5nKGtleSkgPyBrZXkudHJpbSgpIDoga2V5LCBwYXRoLCBleHBvc2VkSGVscGVyc1xuICAgICAgKTtcblxuICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICBidWlsZChlbCwgcGF0aCA/IHBhdGguY29uY2F0KGtleSkgOiBba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2RhdGEgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIGJ1aWxkKG9iaik7XG5cbiAgcmV0dXJuIGZvcm1EYXRhO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b0Zvcm1EYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvVVJMRW5jb2RlZEZvcm0oZGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gdG9Gb3JtRGF0YShkYXRhLCBuZXcgcGxhdGZvcm0uY2xhc3Nlcy5VUkxTZWFyY2hQYXJhbXMoKSwgT2JqZWN0LmFzc2lnbih7XG4gICAgdmlzaXRvcjogZnVuY3Rpb24odmFsdWUsIGtleSwgcGF0aCwgaGVscGVycykge1xuICAgICAgaWYgKHBsYXRmb3JtLmlzTm9kZSAmJiB1dGlscy5pc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygnYmFzZTY0JykpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoZWxwZXJzLmRlZmF1bHRWaXNpdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LCBvcHRpb25zKSk7XG59XG4iLCJcblxuZXhwb3J0IGNvbnN0IHN0cmVhbUNodW5rID0gZnVuY3Rpb24qIChjaHVuaywgY2h1bmtTaXplKSB7XG4gIGxldCBsZW4gPSBjaHVuay5ieXRlTGVuZ3RoO1xuXG4gIGlmICghY2h1bmtTaXplIHx8IGxlbiA8IGNodW5rU2l6ZSkge1xuICAgIHlpZWxkIGNodW5rO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBwb3MgPSAwO1xuICBsZXQgZW5kO1xuXG4gIHdoaWxlIChwb3MgPCBsZW4pIHtcbiAgICBlbmQgPSBwb3MgKyBjaHVua1NpemU7XG4gICAgeWllbGQgY2h1bmsuc2xpY2UocG9zLCBlbmQpO1xuICAgIHBvcyA9IGVuZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmVhZEJ5dGVzID0gYXN5bmMgZnVuY3Rpb24qIChpdGVyYWJsZSwgY2h1bmtTaXplLCBlbmNvZGUpIHtcbiAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiBpdGVyYWJsZSkge1xuICAgIHlpZWxkKiBzdHJlYW1DaHVuayhBcnJheUJ1ZmZlci5pc1ZpZXcoY2h1bmspID8gY2h1bmsgOiAoYXdhaXQgZW5jb2RlKFN0cmluZyhjaHVuaykpKSwgY2h1bmtTaXplKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdHJhY2tTdHJlYW0gPSAoc3RyZWFtLCBjaHVua1NpemUsIG9uUHJvZ3Jlc3MsIG9uRmluaXNoLCBlbmNvZGUpID0+IHtcbiAgY29uc3QgaXRlcmF0b3IgPSByZWFkQnl0ZXMoc3RyZWFtLCBjaHVua1NpemUsIGVuY29kZSk7XG5cbiAgbGV0IGJ5dGVzID0gMDtcblxuICByZXR1cm4gbmV3IFJlYWRhYmxlU3RyZWFtKHtcbiAgICB0eXBlOiAnYnl0ZXMnLFxuXG4gICAgYXN5bmMgcHVsbChjb250cm9sbGVyKSB7XG4gICAgICBjb25zdCB7ZG9uZSwgdmFsdWV9ID0gYXdhaXQgaXRlcmF0b3IubmV4dCgpO1xuXG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgICAgIG9uRmluaXNoKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGxlbiA9IHZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICBvblByb2dyZXNzICYmIG9uUHJvZ3Jlc3MoYnl0ZXMgKz0gbGVuKTtcbiAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShuZXcgVWludDhBcnJheSh2YWx1ZSkpO1xuICAgIH0sXG4gICAgY2FuY2VsKHJlYXNvbikge1xuICAgICAgb25GaW5pc2gocmVhc29uKTtcbiAgICAgIHJldHVybiBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICB9XG4gIH0sIHtcbiAgICBoaWdoV2F0ZXJNYXJrOiAyXG4gIH0pXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7VkVSU0lPTn0gZnJvbSAnLi4vZW52L2RhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcblxuY29uc3QgdmFsaWRhdG9ycyA9IHt9O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuWydvYmplY3QnLCAnYm9vbGVhbicsICdudW1iZXInLCAnZnVuY3Rpb24nLCAnc3RyaW5nJywgJ3N5bWJvbCddLmZvckVhY2goKHR5cGUsIGkpID0+IHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbmNvbnN0IGRlcHJlY2F0ZWRXYXJuaW5ncyA9IHt9O1xuXG4vKipcbiAqIFRyYW5zaXRpb25hbCBvcHRpb24gdmFsaWRhdG9yXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yIC0gc2V0IHRvIGZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uYWwgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvbiAtIGRlcHJlY2F0ZWQgdmVyc2lvbiAvIHJlbW92ZWQgc2luY2UgdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIC0gc29tZSBtZXNzYWdlIHdpdGggYWRkaXRpb25hbCBpbmZvXG4gKlxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuICh2YWx1ZSwgb3B0LCBvcHRzKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKG9wdCwgJyBoYXMgYmVlbiByZW1vdmVkJyArICh2ZXJzaW9uID8gJyBpbiAnICsgdmVyc2lvbiA6ICcnKSksXG4gICAgICAgIEF4aW9zRXJyb3IuRVJSX0RFUFJFQ0FURURcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBhbGxvd1Vua25vd25cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0JywgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTl9WQUxVRSk7XG4gIH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGNvbnN0IG9wdCA9IGtleXNbaV07XG4gICAgY29uc3QgdmFsaWRhdG9yID0gc2NoZW1hW29wdF07XG4gICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhc3NlcnRPcHRpb25zLFxuICB2YWxpZGF0b3JzXG59O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyA/IEJsb2IgOiBudWxsXG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcgPyBGb3JtRGF0YSA6IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc1VSTFNlYXJjaFBhcmFtcyBmcm9tICcuLi8uLi8uLi9oZWxwZXJzL0F4aW9zVVJMU2VhcmNoUGFyYW1zLmpzJztcbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnID8gVVJMU2VhcmNoUGFyYW1zIDogQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCJpbXBvcnQgVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4vY2xhc3Nlcy9VUkxTZWFyY2hQYXJhbXMuanMnXG5pbXBvcnQgRm9ybURhdGEgZnJvbSAnLi9jbGFzc2VzL0Zvcm1EYXRhLmpzJ1xuaW1wb3J0IEJsb2IgZnJvbSAnLi9jbGFzc2VzL0Jsb2IuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNCcm93c2VyOiB0cnVlLFxuICBjbGFzc2VzOiB7XG4gICAgVVJMU2VhcmNoUGFyYW1zLFxuICAgIEZvcm1EYXRhLFxuICAgIEJsb2JcbiAgfSxcbiAgcHJvdG9jb2xzOiBbJ2h0dHAnLCAnaHR0cHMnLCAnZmlsZScsICdibG9iJywgJ3VybCcsICdkYXRhJ11cbn07XG4iLCJjb25zdCBoYXNCcm93c2VyRW52ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGhhc1N0YW5kYXJkQnJvd3NlckVudiA9IChcbiAgKHByb2R1Y3QpID0+IHtcbiAgICByZXR1cm4gaGFzQnJvd3NlckVudiAmJiBbJ1JlYWN0TmF0aXZlJywgJ05hdGl2ZVNjcmlwdCcsICdOUyddLmluZGV4T2YocHJvZHVjdCkgPCAwXG4gIH0pKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5wcm9kdWN0KTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgd2ViV29ya2VyIGVudmlyb25tZW50XG4gKlxuICogQWx0aG91Z2ggdGhlIGBpc1N0YW5kYXJkQnJvd3NlckVudmAgbWV0aG9kIGluZGljYXRlcyB0aGF0XG4gKiBgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXJgLCB0aGUgV2ViV29ya2VyIHdpbGwgc3RpbGwgYmVcbiAqIGZpbHRlcmVkIG91dCBkdWUgdG8gaXRzIGp1ZGdtZW50IHN0YW5kYXJkXG4gKiBgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ2AuXG4gKiBUaGlzIGxlYWRzIHRvIGEgcHJvYmxlbSB3aGVuIGF4aW9zIHBvc3QgYEZvcm1EYXRhYCBpbiB3ZWJXb3JrZXJcbiAqL1xuY29uc3QgaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52ID0gKCgpID0+IHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlICYmXG4gICAgdHlwZW9mIHNlbGYuaW1wb3J0U2NyaXB0cyA9PT0gJ2Z1bmN0aW9uJ1xuICApO1xufSkoKTtcblxuY29uc3Qgb3JpZ2luID0gaGFzQnJvd3NlckVudiAmJiB3aW5kb3cubG9jYXRpb24uaHJlZiB8fCAnaHR0cDovL2xvY2FsaG9zdCc7XG5cbmV4cG9ydCB7XG4gIGhhc0Jyb3dzZXJFbnYsXG4gIGhhc1N0YW5kYXJkQnJvd3NlcldlYldvcmtlckVudixcbiAgaGFzU3RhbmRhcmRCcm93c2VyRW52LFxuICBvcmlnaW5cbn1cbiIsImltcG9ydCBwbGF0Zm9ybSBmcm9tICcuL25vZGUvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC4uLnV0aWxzLFxuICAuLi5wbGF0Zm9ybVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgYmluZCBmcm9tICcuL2hlbHBlcnMvYmluZC5qcyc7XG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbmNvbnN0IHt0b1N0cmluZ30gPSBPYmplY3QucHJvdG90eXBlO1xuY29uc3Qge2dldFByb3RvdHlwZU9mfSA9IE9iamVjdDtcblxuY29uc3Qga2luZE9mID0gKGNhY2hlID0+IHRoaW5nID0+IHtcbiAgICBjb25zdCBzdHIgPSB0b1N0cmluZy5jYWxsKHRoaW5nKTtcbiAgICByZXR1cm4gY2FjaGVbc3RyXSB8fCAoY2FjaGVbc3RyXSA9IHN0ci5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSk7XG59KShPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuY29uc3Qga2luZE9mVGVzdCA9ICh0eXBlKSA9PiB7XG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAodGhpbmcpID0+IGtpbmRPZih0aGluZykgPT09IHR5cGVcbn1cblxuY29uc3QgdHlwZU9mVGVzdCA9IHR5cGUgPT4gdGhpbmcgPT4gdHlwZW9mIHRoaW5nID09PSB0eXBlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3Qge2lzQXJyYXl9ID0gQXJyYXk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNVbmRlZmluZWQgPSB0eXBlT2ZUZXN0KCd1bmRlZmluZWQnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiBpc0Z1bmN0aW9uKHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcikgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNBcnJheUJ1ZmZlciA9IGtpbmRPZlRlc3QoJ0FycmF5QnVmZmVyJyk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICBsZXQgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmIChpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzU3RyaW5nID0gdHlwZU9mVGVzdCgnc3RyaW5nJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNGdW5jdGlvbiA9IHR5cGVPZlRlc3QoJ2Z1bmN0aW9uJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNOdW1iZXIgPSB0eXBlT2ZUZXN0KCdudW1iZXInKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNPYmplY3QgPSAodGhpbmcpID0+IHRoaW5nICE9PSBudWxsICYmIHR5cGVvZiB0aGluZyA9PT0gJ29iamVjdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCb29sZWFuXG4gKlxuICogQHBhcmFtIHsqfSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCb29sZWFuLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNCb29sZWFuID0gdGhpbmcgPT4gdGhpbmcgPT09IHRydWUgfHwgdGhpbmcgPT09IGZhbHNlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB7XG4gIGlmIChraW5kT2YodmFsKSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gKHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSkgPT09IG51bGwpICYmICEoU3ltYm9sLnRvU3RyaW5nVGFnIGluIHZhbCkgJiYgIShTeW1ib2wuaXRlcmF0b3IgaW4gdmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRGF0ZSA9IGtpbmRPZlRlc3QoJ0RhdGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRmlsZSA9IGtpbmRPZlRlc3QoJ0ZpbGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQmxvYiA9IGtpbmRPZlRlc3QoJ0Jsb2InKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVMaXN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0ZpbGVMaXN0ID0ga2luZE9mVGVzdCgnRmlsZUxpc3QnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1N0cmVhbSA9ICh2YWwpID0+IGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7Kn0gdGhpbmcgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRm9ybURhdGEgPSAodGhpbmcpID0+IHtcbiAgbGV0IGtpbmQ7XG4gIHJldHVybiB0aGluZyAmJiAoXG4gICAgKHR5cGVvZiBGb3JtRGF0YSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGluZyBpbnN0YW5jZW9mIEZvcm1EYXRhKSB8fCAoXG4gICAgICBpc0Z1bmN0aW9uKHRoaW5nLmFwcGVuZCkgJiYgKFxuICAgICAgICAoa2luZCA9IGtpbmRPZih0aGluZykpID09PSAnZm9ybWRhdGEnIHx8XG4gICAgICAgIC8vIGRldGVjdCBmb3JtLWRhdGEgaW5zdGFuY2VcbiAgICAgICAgKGtpbmQgPT09ICdvYmplY3QnICYmIGlzRnVuY3Rpb24odGhpbmcudG9TdHJpbmcpICYmIHRoaW5nLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEZvcm1EYXRhXScpXG4gICAgICApXG4gICAgKVxuICApXG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1VSTFNlYXJjaFBhcmFtcyA9IGtpbmRPZlRlc3QoJ1VSTFNlYXJjaFBhcmFtcycpO1xuXG5jb25zdCBbaXNSZWFkYWJsZVN0cmVhbSwgaXNSZXF1ZXN0LCBpc1Jlc3BvbnNlLCBpc0hlYWRlcnNdID0gWydSZWFkYWJsZVN0cmVhbScsICdSZXF1ZXN0JywgJ1Jlc3BvbnNlJywgJ0hlYWRlcnMnXS5tYXAoa2luZE9mVGVzdCk7XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmNvbnN0IHRyaW0gPSAoc3RyKSA9PiBzdHIudHJpbSA/XG4gIHN0ci50cmltKCkgOiBzdHIucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FsbE93bktleXMgPSBmYWxzZV1cbiAqIEByZXR1cm5zIHthbnl9XG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbiwge2FsbE93bktleXMgPSBmYWxzZX0gPSB7fSkge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBpO1xuICBsZXQgbDtcblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAoaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgY29uc3Qga2V5cyA9IGFsbE93bktleXMgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopIDogT2JqZWN0LmtleXMob2JqKTtcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBsZXQga2V5O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kS2V5KG9iaiwga2V5KSB7XG4gIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgbGV0IF9rZXk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgX2tleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSA9PT0gX2tleS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gX2tleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IF9nbG9iYWwgPSAoKCkgPT4ge1xuICAvKmVzbGludCBuby11bmRlZjowKi9cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZ2xvYmFsVGhpcztcbiAgcmV0dXJuIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbClcbn0pKCk7XG5cbmNvbnN0IGlzQ29udGV4dERlZmluZWQgPSAoY29udGV4dCkgPT4gIWlzVW5kZWZpbmVkKGNvbnRleHQpICYmIGNvbnRleHQgIT09IF9nbG9iYWw7XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgY29uc3Qge2Nhc2VsZXNzfSA9IGlzQ29udGV4dERlZmluZWQodGhpcykgJiYgdGhpcyB8fCB7fTtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGFzc2lnblZhbHVlID0gKHZhbCwga2V5KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0S2V5ID0gY2FzZWxlc3MgJiYgZmluZEtleShyZXN1bHQsIGtleSkgfHwga2V5O1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFt0YXJnZXRLZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2UocmVzdWx0W3RhcmdldEtleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGFyZ3VtZW50c1tpXSAmJiBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFthbGxPd25LZXlzXVxuICogQHJldHVybnMge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5jb25zdCBleHRlbmQgPSAoYSwgYiwgdGhpc0FyZywge2FsbE93bktleXN9PSB7fSkgPT4ge1xuICBmb3JFYWNoKGIsICh2YWwsIGtleSkgPT4ge1xuICAgIGlmICh0aGlzQXJnICYmIGlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9LCB7YWxsT3duS2V5c30pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuY29uc3Qgc3RyaXBCT00gPSAoY29udGVudCkgPT4ge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gW3Byb3BzXVxuICogQHBhcmFtIHtvYmplY3R9IFtkZXNjcmlwdG9yc11cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuY29uc3QgaW5oZXJpdHMgPSAoY29uc3RydWN0b3IsIHN1cGVyQ29uc3RydWN0b3IsIHByb3BzLCBkZXNjcmlwdG9ycykgPT4ge1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlLCBkZXNjcmlwdG9ycyk7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IsICdzdXBlcicsIHtcbiAgICB2YWx1ZTogc3VwZXJDb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgfSk7XG4gIHByb3BzICYmIE9iamVjdC5hc3NpZ24oY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wcyk7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBvYmplY3Qgd2l0aCBkZWVwIHByb3RvdHlwZSBjaGFpbiB0byBhIGZsYXQgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlT2JqIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGVzdE9ial1cbiAqIEBwYXJhbSB7RnVuY3Rpb258Qm9vbGVhbn0gW2ZpbHRlcl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9wRmlsdGVyXVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IHRvRmxhdE9iamVjdCA9IChzb3VyY2VPYmosIGRlc3RPYmosIGZpbHRlciwgcHJvcEZpbHRlcikgPT4ge1xuICBsZXQgcHJvcHM7XG4gIGxldCBpO1xuICBsZXQgcHJvcDtcbiAgY29uc3QgbWVyZ2VkID0ge307XG5cbiAgZGVzdE9iaiA9IGRlc3RPYmogfHwge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuICBpZiAoc291cmNlT2JqID09IG51bGwpIHJldHVybiBkZXN0T2JqO1xuXG4gIGRvIHtcbiAgICBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZU9iaik7XG4gICAgaSA9IHByb3BzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgaWYgKCghcHJvcEZpbHRlciB8fCBwcm9wRmlsdGVyKHByb3AsIHNvdXJjZU9iaiwgZGVzdE9iaikpICYmICFtZXJnZWRbcHJvcF0pIHtcbiAgICAgICAgZGVzdE9ialtwcm9wXSA9IHNvdXJjZU9ialtwcm9wXTtcbiAgICAgICAgbWVyZ2VkW3Byb3BdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlT2JqID0gZmlsdGVyICE9PSBmYWxzZSAmJiBnZXRQcm90b3R5cGVPZihzb3VyY2VPYmopO1xuICB9IHdoaWxlIChzb3VyY2VPYmogJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKHNvdXJjZU9iaiwgZGVzdE9iaikpICYmIHNvdXJjZU9iaiAhPT0gT2JqZWN0LnByb3RvdHlwZSk7XG5cbiAgcmV0dXJuIGRlc3RPYmo7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc3RyaW5nIGVuZHMgd2l0aCB0aGUgY2hhcmFjdGVycyBvZiBhIHNwZWNpZmllZCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gW3Bvc2l0aW9uPSAwXVxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBlbmRzV2l0aCA9IChzdHIsIHNlYXJjaFN0cmluZywgcG9zaXRpb24pID0+IHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkIHx8IHBvc2l0aW9uID4gc3RyLmxlbmd0aCkge1xuICAgIHBvc2l0aW9uID0gc3RyLmxlbmd0aDtcbiAgfVxuICBwb3NpdGlvbiAtPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICBjb25zdCBsYXN0SW5kZXggPSBzdHIuaW5kZXhPZihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKTtcbiAgcmV0dXJuIGxhc3RJbmRleCAhPT0gLTEgJiYgbGFzdEluZGV4ID09PSBwb3NpdGlvbjtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgbmV3IGFycmF5IGZyb20gYXJyYXkgbGlrZSBvYmplY3Qgb3IgbnVsbCBpZiBmYWlsZWRcbiAqXG4gKiBAcGFyYW0geyp9IFt0aGluZ11cbiAqXG4gKiBAcmV0dXJucyB7P0FycmF5fVxuICovXG5jb25zdCB0b0FycmF5ID0gKHRoaW5nKSA9PiB7XG4gIGlmICghdGhpbmcpIHJldHVybiBudWxsO1xuICBpZiAoaXNBcnJheSh0aGluZykpIHJldHVybiB0aGluZztcbiAgbGV0IGkgPSB0aGluZy5sZW5ndGg7XG4gIGlmICghaXNOdW1iZXIoaSkpIHJldHVybiBudWxsO1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkoaSk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgYXJyW2ldID0gdGhpbmdbaV07XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuLyoqXG4gKiBDaGVja2luZyBpZiB0aGUgVWludDhBcnJheSBleGlzdHMgYW5kIGlmIGl0IGRvZXMsIGl0IHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGVcbiAqIHRoaW5nIHBhc3NlZCBpbiBpcyBhbiBpbnN0YW5jZSBvZiBVaW50OEFycmF5XG4gKlxuICogQHBhcmFtIHtUeXBlZEFycmF5fVxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbmNvbnN0IGlzVHlwZWRBcnJheSA9IChUeXBlZEFycmF5ID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIHRoaW5nID0+IHtcbiAgICByZXR1cm4gVHlwZWRBcnJheSAmJiB0aGluZyBpbnN0YW5jZW9mIFR5cGVkQXJyYXk7XG4gIH07XG59KSh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2V0UHJvdG90eXBlT2YoVWludDhBcnJheSkpO1xuXG4vKipcbiAqIEZvciBlYWNoIGVudHJ5IGluIHRoZSBvYmplY3QsIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGtleSBhbmQgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3Q8YW55LCBhbnk+fSBvYmogLSBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZW50cnkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmNvbnN0IGZvckVhY2hFbnRyeSA9IChvYmosIGZuKSA9PiB7XG4gIGNvbnN0IGdlbmVyYXRvciA9IG9iaiAmJiBvYmpbU3ltYm9sLml0ZXJhdG9yXTtcblxuICBjb25zdCBpdGVyYXRvciA9IGdlbmVyYXRvci5jYWxsKG9iaik7XG5cbiAgbGV0IHJlc3VsdDtcblxuICB3aGlsZSAoKHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKSkgJiYgIXJlc3VsdC5kb25lKSB7XG4gICAgY29uc3QgcGFpciA9IHJlc3VsdC52YWx1ZTtcbiAgICBmbi5jYWxsKG9iaiwgcGFpclswXSwgcGFpclsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhbmQgYSBzdHJpbmcsIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgbWF0Y2hlc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdFeHAgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGFnYWluc3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzZWFyY2guXG4gKlxuICogQHJldHVybnMge0FycmF5PGJvb2xlYW4+fVxuICovXG5jb25zdCBtYXRjaEFsbCA9IChyZWdFeHAsIHN0cikgPT4ge1xuICBsZXQgbWF0Y2hlcztcbiAgY29uc3QgYXJyID0gW107XG5cbiAgd2hpbGUgKChtYXRjaGVzID0gcmVnRXhwLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgICBhcnIucHVzaChtYXRjaGVzKTtcbiAgfVxuXG4gIHJldHVybiBhcnI7XG59XG5cbi8qIENoZWNraW5nIGlmIHRoZSBraW5kT2ZUZXN0IGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB3aGVuIHBhc3NlZCBhbiBIVE1MRm9ybUVsZW1lbnQuICovXG5jb25zdCBpc0hUTUxGb3JtID0ga2luZE9mVGVzdCgnSFRNTEZvcm1FbGVtZW50Jyk7XG5cbmNvbnN0IHRvQ2FtZWxDYXNlID0gc3RyID0+IHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX1xcc10oW2EtelxcZF0pKFxcdyopL2csXG4gICAgZnVuY3Rpb24gcmVwbGFjZXIobSwgcDEsIHAyKSB7XG4gICAgICByZXR1cm4gcDEudG9VcHBlckNhc2UoKSArIHAyO1xuICAgIH1cbiAgKTtcbn07XG5cbi8qIENyZWF0aW5nIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGNoZWNrIGlmIGFuIG9iamVjdCBoYXMgYSBwcm9wZXJ0eS4gKi9cbmNvbnN0IGhhc093blByb3BlcnR5ID0gKCh7aGFzT3duUHJvcGVydHl9KSA9PiAob2JqLCBwcm9wKSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpKE9iamVjdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNSZWdFeHAgPSBraW5kT2ZUZXN0KCdSZWdFeHAnKTtcblxuY29uc3QgcmVkdWNlRGVzY3JpcHRvcnMgPSAob2JqLCByZWR1Y2VyKSA9PiB7XG4gIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqKTtcbiAgY29uc3QgcmVkdWNlZERlc2NyaXB0b3JzID0ge307XG5cbiAgZm9yRWFjaChkZXNjcmlwdG9ycywgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICBsZXQgcmV0O1xuICAgIGlmICgocmV0ID0gcmVkdWNlcihkZXNjcmlwdG9yLCBuYW1lLCBvYmopKSAhPT0gZmFsc2UpIHtcbiAgICAgIHJlZHVjZWREZXNjcmlwdG9yc1tuYW1lXSA9IHJldCB8fCBkZXNjcmlwdG9yO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqLCByZWR1Y2VkRGVzY3JpcHRvcnMpO1xufVxuXG4vKipcbiAqIE1ha2VzIGFsbCBtZXRob2RzIHJlYWQtb25seVxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbmNvbnN0IGZyZWV6ZU1ldGhvZHMgPSAob2JqKSA9PiB7XG4gIHJlZHVjZURlc2NyaXB0b3JzKG9iaiwgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICAvLyBza2lwIHJlc3RyaWN0ZWQgcHJvcHMgaW4gc3RyaWN0IG1vZGVcbiAgICBpZiAoaXNGdW5jdGlvbihvYmopICYmIFsnYXJndW1lbnRzJywgJ2NhbGxlcicsICdjYWxsZWUnXS5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZmFsc2U7XG5cbiAgICBpZiAoJ3dyaXRhYmxlJyBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQgPSAoKSA9PiB7XG4gICAgICAgIHRocm93IEVycm9yKCdDYW4gbm90IHJld3JpdGUgcmVhZC1vbmx5IG1ldGhvZCBcXCcnICsgbmFtZSArICdcXCcnKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgdG9PYmplY3RTZXQgPSAoYXJyYXlPclN0cmluZywgZGVsaW1pdGVyKSA9PiB7XG4gIGNvbnN0IG9iaiA9IHt9O1xuXG4gIGNvbnN0IGRlZmluZSA9IChhcnIpID0+IHtcbiAgICBhcnIuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBvYmpbdmFsdWVdID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzQXJyYXkoYXJyYXlPclN0cmluZykgPyBkZWZpbmUoYXJyYXlPclN0cmluZykgOiBkZWZpbmUoU3RyaW5nKGFycmF5T3JTdHJpbmcpLnNwbGl0KGRlbGltaXRlcikpO1xuXG4gIHJldHVybiBvYmo7XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fVxuXG5jb25zdCB0b0Zpbml0ZU51bWJlciA9ICh2YWx1ZSwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSA9ICt2YWx1ZSkgPyB2YWx1ZSA6IGRlZmF1bHRWYWx1ZTtcbn1cblxuY29uc3QgQUxQSEEgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonXG5cbmNvbnN0IERJR0lUID0gJzAxMjM0NTY3ODknO1xuXG5jb25zdCBBTFBIQUJFVCA9IHtcbiAgRElHSVQsXG4gIEFMUEhBLFxuICBBTFBIQV9ESUdJVDogQUxQSEEgKyBBTFBIQS50b1VwcGVyQ2FzZSgpICsgRElHSVRcbn1cblxuY29uc3QgZ2VuZXJhdGVTdHJpbmcgPSAoc2l6ZSA9IDE2LCBhbHBoYWJldCA9IEFMUEhBQkVULkFMUEhBX0RJR0lUKSA9PiB7XG4gIGxldCBzdHIgPSAnJztcbiAgY29uc3Qge2xlbmd0aH0gPSBhbHBoYWJldDtcbiAgd2hpbGUgKHNpemUtLSkge1xuICAgIHN0ciArPSBhbHBoYWJldFtNYXRoLnJhbmRvbSgpICogbGVuZ3RofDBdXG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIElmIHRoZSB0aGluZyBpcyBhIEZvcm1EYXRhIG9iamVjdCwgcmV0dXJuIHRydWUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXG4gKlxuICogQHBhcmFtIHt1bmtub3dufSB0aGluZyAtIFRoZSB0aGluZyB0byBjaGVjay5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNTcGVjQ29tcGxpYW50Rm9ybSh0aGluZykge1xuICByZXR1cm4gISEodGhpbmcgJiYgaXNGdW5jdGlvbih0aGluZy5hcHBlbmQpICYmIHRoaW5nW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdGb3JtRGF0YScgJiYgdGhpbmdbU3ltYm9sLml0ZXJhdG9yXSk7XG59XG5cbmNvbnN0IHRvSlNPTk9iamVjdCA9IChvYmopID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgQXJyYXkoMTApO1xuXG4gIGNvbnN0IHZpc2l0ID0gKHNvdXJjZSwgaSkgPT4ge1xuXG4gICAgaWYgKGlzT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIGlmIChzdGFjay5pbmRleE9mKHNvdXJjZSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmKCEoJ3RvSlNPTicgaW4gc291cmNlKSkge1xuICAgICAgICBzdGFja1tpXSA9IHNvdXJjZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gaXNBcnJheShzb3VyY2UpID8gW10gOiB7fTtcblxuICAgICAgICBmb3JFYWNoKHNvdXJjZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCByZWR1Y2VkVmFsdWUgPSB2aXNpdCh2YWx1ZSwgaSArIDEpO1xuICAgICAgICAgICFpc1VuZGVmaW5lZChyZWR1Y2VkVmFsdWUpICYmICh0YXJnZXRba2V5XSA9IHJlZHVjZWRWYWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YWNrW2ldID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIHJldHVybiB2aXNpdChvYmosIDApO1xufVxuXG5jb25zdCBpc0FzeW5jRm4gPSBraW5kT2ZUZXN0KCdBc3luY0Z1bmN0aW9uJyk7XG5cbmNvbnN0IGlzVGhlbmFibGUgPSAodGhpbmcpID0+XG4gIHRoaW5nICYmIChpc09iamVjdCh0aGluZykgfHwgaXNGdW5jdGlvbih0aGluZykpICYmIGlzRnVuY3Rpb24odGhpbmcudGhlbikgJiYgaXNGdW5jdGlvbih0aGluZy5jYXRjaCk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXIsXG4gIGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzQm9vbGVhbixcbiAgaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3QsXG4gIGlzUmVhZGFibGVTdHJlYW0sXG4gIGlzUmVxdWVzdCxcbiAgaXNSZXNwb25zZSxcbiAgaXNIZWFkZXJzLFxuICBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlLFxuICBpc0ZpbGUsXG4gIGlzQmxvYixcbiAgaXNSZWdFeHAsXG4gIGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNUeXBlZEFycmF5LFxuICBpc0ZpbGVMaXN0LFxuICBmb3JFYWNoLFxuICBtZXJnZSxcbiAgZXh0ZW5kLFxuICB0cmltLFxuICBzdHJpcEJPTSxcbiAgaW5oZXJpdHMsXG4gIHRvRmxhdE9iamVjdCxcbiAga2luZE9mLFxuICBraW5kT2ZUZXN0LFxuICBlbmRzV2l0aCxcbiAgdG9BcnJheSxcbiAgZm9yRWFjaEVudHJ5LFxuICBtYXRjaEFsbCxcbiAgaXNIVE1MRm9ybSxcbiAgaGFzT3duUHJvcGVydHksXG4gIGhhc093blByb3A6IGhhc093blByb3BlcnR5LCAvLyBhbiBhbGlhcyB0byBhdm9pZCBFU0xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zIGRldGVjdGlvblxuICByZWR1Y2VEZXNjcmlwdG9ycyxcbiAgZnJlZXplTWV0aG9kcyxcbiAgdG9PYmplY3RTZXQsXG4gIHRvQ2FtZWxDYXNlLFxuICBub29wLFxuICB0b0Zpbml0ZU51bWJlcixcbiAgZmluZEtleSxcbiAgZ2xvYmFsOiBfZ2xvYmFsLFxuICBpc0NvbnRleHREZWZpbmVkLFxuICBBTFBIQUJFVCxcbiAgZ2VuZXJhdGVTdHJpbmcsXG4gIGlzU3BlY0NvbXBsaWFudEZvcm0sXG4gIHRvSlNPTk9iamVjdCxcbiAgaXNBc3luY0ZuLFxuICBpc1RoZW5hYmxlXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gQ29tcGlsZWQgdXNpbmcgbWFya29ANS4zMy4xNCAtIERPIE5PVCBFRElUXG5pbXBvcnQgeyB0IGFzIF90IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanNcIjtcbmNvbnN0IF9tYXJrb19jb21wb25lbnRUeXBlID0gXCJ1aVxcXFxpbmRleC5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgJy4vbWFpbl9tZW51L2luZGV4LmpzJztcbmltcG9ydCAnLi9pbml0LmpzJztcbmltcG9ydCAnLi9jb250ZW50LmpzJztcbmltcG9ydCBfbWFya29fcmVuZGVyZXIgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IHIgYXMgX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanNcIjtcbl9tYXJrb19yZWdpc3RlckNvbXBvbmVudChfbWFya29fY29tcG9uZW50VHlwZSwgKCkgPT4gX21hcmtvX3RlbXBsYXRlKTtcbmNvbnN0IF9tYXJrb19jb21wb25lbnQgPSB7fTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge30sIHtcbiAgdDogX21hcmtvX2NvbXBvbmVudFR5cGUsXG4gIGk6IHRydWUsXG4gIGQ6IHRydWVcbn0sIF9tYXJrb19jb21wb25lbnQpO1xuaW1wb3J0IF9tYXJrb19kZWZpbmVDb21wb25lbnQgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50LmpzXCI7XG5fbWFya29fdGVtcGxhdGUuQ29tcG9uZW50ID0gX21hcmtvX2RlZmluZUNvbXBvbmVudChfbWFya29fY29tcG9uZW50LCBfbWFya29fdGVtcGxhdGUuXyk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9