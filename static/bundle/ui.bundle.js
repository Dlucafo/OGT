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
    this.emit('changedPage', target);
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
      url: '/v1.0/users/' + Store.state.user + '/isPasswordCorrect',
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
      url: '/v1.0/users/' + Store.state.user + '/editPassword',
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
      }],
      menu_link: []
    };
    if (Store.state.idruolo == 2) {
      this.state.menu_item.push({
        id: 'anagrafica',
        name: 'Dati Anagrafici'
      });
    }
  },
  onMount() {
    let listGroup = document.querySelector(".list-group");
    let aList = listGroup.querySelectorAll('a');
    this.state.menu_link = aList;
  },
  changedPage(target) {
    let output = document.getElementById('home-content');
    Store.NewState(updateContent(target, output));
  }
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_3___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", {
    "class": "home-container"
  }, "0", _component, null, 1);
  marko_src_runtime_helpers_render_tag_js__WEBPACK_IMPORTED_MODULE_2___default()(_components_left_menu_index_marko__WEBPACK_IMPORTED_MODULE_1__["default"], {
    "params": state.menu_item
  }, out, _componentDef, "1", [["changedPage", 'changedPage', false]]);
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

/***/ "./ui/marko/prenotazioni/components/l_prenotazioni.marko":
/*!***************************************************************!*\
  !*** ./ui/marko/prenotazioni/components/l_prenotazioni.marko ***!
  \***************************************************************/
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

const _marko_componentType = "ui\\marko\\prenotazioni\\components\\l_prenotazioni.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);



(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {
  onCreate() {
    this.state = {};
  },
  onMount() {},
  async onSave(event) {}
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", null, "0", _component, null, 0);
  out.be("h5", null, "1", _component, null, 0);
  out.t("Lista prenotazioni", _component);
  out.ee();
  out.be("p", null, "2", _component, null, 0);
  out.t("In questa sezione \xE8 possibile vedere i dettagli di tutte le prenotazioni future.", _component);
  out.ee();
  out.ee();
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4___default()(_marko_component, _marko_template._);

/***/ }),

/***/ "./ui/marko/prenotazioni/components/s_prenotazioni.marko":
/*!***************************************************************!*\
  !*** ./ui/marko/prenotazioni/components/s_prenotazioni.marko ***!
  \***************************************************************/
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

const _marko_componentType = "ui\\marko\\prenotazioni\\components\\s_prenotazioni.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);



(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {
  onCreate() {
    this.state = {};
  },
  onMount() {},
  async onSave(event) {}
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", null, "0", _component, null, 0);
  out.be("h5", null, "1", _component, null, 0);
  out.t("Storico prenotazioni", _component);
  out.ee();
  out.be("p", null, "2", _component, null, 0);
  out.t("In questa sezione \xE8 possibile vedere i dettagli di tutte le prenotazioni passate.", _component);
  out.ee();
  out.ee();
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4___default()(_marko_component, _marko_template._);

/***/ }),

/***/ "./ui/marko/prenotazioni/prenotazioni.marko":
/*!**************************************************!*\
  !*** ./ui/marko/prenotazioni/prenotazioni.marko ***!
  \**************************************************/
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

const _marko_componentType = "ui\\marko\\prenotazioni\\prenotazioni.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);




(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_4__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {
  onCreate() {
    this.state = {
      menu_item: [{
        id: 'l_prenotazioni',
        name: 'Lista prenotazioni'
      }, {
        id: 's_prenotazioni',
        name: 'Storico prenotazioni'
      }],
      menu_link: []
    };
  },
  onMount() {
    let listGroup = document.querySelector(".list-group");
    let aList = listGroup.querySelectorAll('a');
    this.state.menu_link = aList;
  },
  changedPage(target) {
    let output = document.getElementById('prenotazioni-content');
    Store.NewState(updateContent(target, output));
  }
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_3___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", {
    "class": "home-container"
  }, "0", _component, null, 1);
  marko_src_runtime_helpers_render_tag_js__WEBPACK_IMPORTED_MODULE_2___default()(_components_left_menu_index_marko__WEBPACK_IMPORTED_MODULE_1__["default"], {
    "params": state.menu_item
  }, out, _componentDef, "1", [["changedPage", 'changedPage', false]]);
  out.t(" ", _component);
  out.be("div", {
    "id": "prenotazioni-content"
  }, "2", _component, null, 1);
  out.be("p", null, "3", _component, null, 0);
  out.t("In questa sezione potete gestire le vostre prenotazioni.", _component);
  out.ee();
  out.be("p", null, "4", _component, null, 0);
  out.t(" La lista prenotazioni mostra le prenotazioni future, lo storico delle prenotazioni mostra quelle passate.", _component);
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
/* harmony import */ var _marko_prenotazioni_components_l_prenotazioni_marko__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./marko/prenotazioni/components/l_prenotazioni.marko */ "./ui/marko/prenotazioni/components/l_prenotazioni.marko");
/* harmony import */ var _marko_prenotazioni_components_s_prenotazioni_marko__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./marko/prenotazioni/components/s_prenotazioni.marko */ "./ui/marko/prenotazioni/components/s_prenotazioni.marko");




let CONTENT = {};

CONTENT.Execute = function() {
  switch(Store.state.action) {
    case Action.UPDATE_CONTENT:
      let output = Store.state.output;
      switch(Store.state.target) {
        case 'password-button':
          CONTENT.render = _marko_home_components_password_marko__WEBPACK_IMPORTED_MODULE_0__["default"].renderSync().replaceChildrenOf(output);
          break;
        case 'l_prenotazioni-button':
          CONTENT.render = _marko_prenotazioni_components_l_prenotazioni_marko__WEBPACK_IMPORTED_MODULE_1__["default"].renderSync().replaceChildrenOf(output);
          break;
        case 's_prenotazioni-button':
          CONTENT.render = _marko_prenotazioni_components_s_prenotazioni_marko__WEBPACK_IMPORTED_MODULE_2__["default"].renderSync().replaceChildrenOf(output);
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
/* harmony import */ var _marko_prenotazioni_prenotazioni_marko__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./marko/prenotazioni/prenotazioni.marko */ "./ui/marko/prenotazioni/prenotazioni.marko");
/* harmony import */ var _utility_utility_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utility/utility.js */ "./utility/utility.js");


let output = document.getElementById("main-container");


let INIT = {};

INIT.Execute = async function() {
  switch(Store.state.action) {
    case Action.START:
      INIT.render = _marko_home_home_marko__WEBPACK_IMPORTED_MODULE_0__["default"].renderSync().replaceChildrenOf(output);
      break;
    case Action.SHOW_HOME:
      INIT.render = _marko_home_home_marko__WEBPACK_IMPORTED_MODULE_0__["default"].renderSync().replaceChildrenOf(output);
      break;
    case Action.SHOW_PRENOTAZIONI:
      INIT.render = _marko_prenotazioni_prenotazioni_marko__WEBPACK_IMPORTED_MODULE_1__["default"].renderSync().replaceChildrenOf(output);
      break;
    default:
      break;
  }
}

Store.Bind(INIT.Execute);

/***/ }),

/***/ "./ui/logout.js":
/*!**********************!*\
  !*** ./ui/logout.js ***!
  \**********************/
/***/ (() => {

let Logout = {}

Logout.Execute = function() {
  switch(Store.state.action) {
    case Action.LOG_OUT:
      location.replace('/logout');
      break;
  }
}

Store.Bind(Logout.Execute);

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
          { type: 'radio',  id: 'home', group: '1', text: 'Home', img: 'icon-add', checked: true },
          { type: 'break' },
          { type: 'radio',   id: 'prenotazioni', group: '1', text: 'Prenotazioni', img: 'icon-folder'},
          { type: 'break' },
          { type: 'radio',  id: 'strutture',  group: '1', text: 'Strutture', img: 'icon-page' },
          { type: 'break' },
          { type: 'radio',  id: 'pazienti',  group: '1', text: 'Pazienti', img: 'icon-page', hidden: true },
          { type: 'spacer' },
          { type: 'button',  id: 'logOut',  text: 'Log Out', class: 'log-out-icon', img: 'icon-logout' }
      ],

      onClick: function(event) {
        switch(event.target) {
          case 'home':
            Store.NewState(showHome());
            break;
          case 'logOut':
            if (confirm('Sei sicuro di voler uscire?')) {
              Store.NewState(logout());
            }
            break;
          case 'prenotazioni':
            Store.NewState(showPrenotazioni())
            break;
          default:
            console.log('no main menu action find');
            break;
        }
      }
  });

  switch(Store.state.action) {
    case Action.START:
      if(Store.state.idruolo==1) {
        w2ui.myToolbar.show('pazienti');
      }
      break;
  }
  //console.log(w2ui.myToolbar.get('pazienti'))
  
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
  options.headers = {authorization: user}

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
/* harmony import */ var _logout_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./logout.js */ "./ui/logout.js");
/* harmony import */ var _logout_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_logout_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! marko/src/runtime/components/renderer.js */ "./node_modules/marko/src/runtime/components/renderer.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! marko/src/runtime/components/registry.js */ "./node_modules/marko/src/runtime/components/registry.js");
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! marko/src/runtime/components/defineComponent.js */ "./node_modules/marko/src/runtime/components/defineComponent.js");
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_7__);
// Compiled using marko@5.33.14 - DO NOT EDIT

const _marko_componentType = "ui\\index.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);






(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_6__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_5___default()(function (input, out, _componentDef, _component, state, $global) {}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_7___default()(_marko_component, _marko_template._);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNB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QUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxJQUFhO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLElBQWE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsSUFBYTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtB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QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pjQSxjQUFjLG1CQUFPLENBQUMsa0VBQXFCO0FBQzNDLFlBQVksbUJBQU8sQ0FBQywrREFBUzs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoQkEsYUFBYSxtQkFBTyxDQUFDLGdFQUFvQjtBQUN6QyxjQUFjLG1CQUFPLENBQUMsa0VBQXFCO0FBQzNDLFlBQVksbUJBQU8sQ0FBQywrREFBUzs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7O0FDakNBOztBQUVBLGVBQWUsS0FBYSxJQUFJLG1CQUFPLENBQUMsa0RBQVU7QUFDbEQsY0FBYyxtQkFBTyxDQUFDLGtFQUFxQjtBQUMzQyxxQkFBcUIsbUJBQU8sQ0FBQyxtSEFBMkI7QUFDeEQsY0FBYyxtQkFBTyxDQUFDLHVGQUF3QjtBQUM5QztBQUNBLFlBQVksbUJBQU8sQ0FBQywrREFBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsSUFBYTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsVUFBVTtBQUN4QixjQUFjLFVBQVU7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLGVBQWU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7QUFDUjtB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Q25DLGNBQWMsbUJBQU8sQ0FBQyw0RUFBVztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEI7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTs7QUFFUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBLE1BQU0sSUFBYTtBQUNuQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxNQUFNLElBQWE7QUFDbkI7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QSwwQkFBMEIsZUFBZTs7QUFFekM7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2Q7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsUUFBUTtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQzs7Ozs7OztVQ3Z0QkY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUMwRDtBQUMxRDtBQUNBLG9CQUFvQixrRUFBRTtBQUN0QixpRUFBZSxlQUFlLEVBQUM7QUFDRDtBQUNYO0FBQ0c7QUFDRDtBQUNrRDtBQUNrQjtBQUN6RiwyRUFBd0I7QUFDeEI7QUFDQSxvQkFBb0IsK0VBQWUsb0VBQW9FO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDb0Y7QUFDckYsNEJBQTRCLHNGQUFzQixzQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvY29tcGxhaW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvZXJyb3Itc3RhY2stcGFyc2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvZXZlbnRzLWxpZ2h0L3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2xpc3RlbmVyLXRyYWNrZXIvbGliL2xpc3RlbmVyLXRyYWNrZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL21hcmtvL2NvbXBvbmVudHMvbGVmdC1tZW51L2luZGV4Lm1hcmtvIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9tYXJrby9ob21lL2NvbXBvbmVudHMvcGFzc3dvcmQubWFya28iLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL21hcmtvL2hvbWUvaG9tZS5tYXJrbyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vdWkvbWFya28vcHJlbm90YXppb25pL2NvbXBvbmVudHMvbF9wcmVub3RhemlvbmkubWFya28iLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL21hcmtvL3ByZW5vdGF6aW9uaS9jb21wb25lbnRzL3NfcHJlbm90YXppb25pLm1hcmtvIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9tYXJrby9wcmVub3RhemlvbmkvcHJlbm90YXppb25pLm1hcmtvIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvY29tcG9uZW50cy1iZWdpbkNvbXBvbmVudC9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvY29tcG9uZW50cy1lbmRDb21wb25lbnQvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL2NvbXBvbmVudHMtcmVnaXN0cnkvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL2NvbXBvbmVudHMtdXRpbC9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvcmVxdWlyZS9pbmRleC13ZWJwYWNrLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvc2V0LWltbWVkaWF0ZS9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvc2V0LWltbWVkaWF0ZS9xdWV1ZU1pY3JvdGFzay5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL1JlbmRlclJlc3VsdC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnREZWYuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudHNDb250ZXh0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9HbG9iYWxDb21wb25lbnRzQ29udGV4dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvS2V5U2VxdWVuY2UuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL1N0YXRlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2RvbS1kYXRhLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9ldmVudC1kZWxlZ2F0aW9uLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL3VwZGF0ZS1tYW5hZ2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY3JlYXRlT3V0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvZG9tLWluc2VydC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2hlbHBlcnMvX2NoYW5nZS1jYXNlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvaGVscGVycy9jbGFzcy12YWx1ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2hlbHBlcnMvcmVuZGVyLXRhZy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2hlbHBlcnMvc3R5bGUtdmFsdWUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9yZW5kZXJhYmxlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9Bc3luY1ZET01CdWlsZGVyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WQ29tcG9uZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WRG9jdW1lbnRGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVkVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVk5vZGUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZUZXh0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9oZWxwZXJzL2F0dHJzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vbW9ycGhkb20vZnJhZ21lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL21vcnBoZG9tL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL21vcnBoZG9tL2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9wYXJzZS1odG1sLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS92ZG9tLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvcmFwdG9yLXV0aWwvY29weVByb3BzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvcmFwdG9yLXV0aWwvZXh0ZW5kLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvcmFwdG9yLXV0aWwvaW5oZXJpdC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3N0YWNrZnJhbWUvc3RhY2tmcmFtZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3dhcnAxMC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy93YXJwMTAvZmluYWxpemUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy93YXJwMTAvc3JjL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3dhcnAxMC9zcmMvZmluYWxpemUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL2NvbnRlbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL2luaXQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL3VpL2xvZ291dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vdWkvbWFpbl9tZW51L2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91dGlsaXR5L3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMvYWRhcHRlcnMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMvZmV0Y2guanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvc0hlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9idWlsZEZ1bGxQYXRoLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9lbnYvZGF0YS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL0F4aW9zVVJMU2VhcmNoUGFyYW1zLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvSHR0cFN0YXR1c0NvZGUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbXBvc2VTaWduYWxzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL251bGwuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZVByb3RvY29sLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9yZXNvbHZlQ29uZmlnLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3BlZWRvbWV0ZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3RvRm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90b1VSTEVuY29kZWRGb3JtLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdHJhY2tTdHJlYW0uanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy92YWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL0Jsb2IuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL0Zvcm1EYXRhLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2Jyb3dzZXIvY2xhc3Nlcy9VUkxTZWFyY2hQYXJhbXMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9jb21tb24vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9pbmRleC5tYXJrbyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBTdGFja1BhcnNlciA9IHJlcXVpcmUoJ2Vycm9yLXN0YWNrLXBhcnNlcicpO1xudmFyIGVudiA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOVjtcbnZhciBpc0RldmVsb3BtZW50ID0gIWVudiB8fCBlbnYgPT09ICdkZXYnIHx8IGVudiA9PT0gJ2RldmVsb3BtZW50JztcbnZhciBzaG93TW9kdWxlQ29tcGxhaW5zID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4ocHJvY2Vzcy5lbnYuU0hPV19NT0RVTEVfQ09NUExBSU5TKTtcbnZhciBzaG93TmVzdGVkQ29tcGxhaW5zID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4ocHJvY2Vzcy5lbnYuU0hPV19ORVNURURfQ09NUExBSU5TKTtcbnZhciBsb2dnZXIgPSB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuICYmIGNvbnNvbGU7XG52YXIgY3dkID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuY3dkKCkgKyAnLycgfHwgJyc7XG52YXIgbGluZWJyZWFrID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICd3aW4zMicgPT09IHByb2Nlc3MucGxhdGZvcm0gPyAnXFxyXFxuJyA6ICdcXG4nO1xudmFyIG5ld2xpbmUgPSAvKFxcclxcbnxcXHJ8XFxuKS9nO1xudmFyIHNsaWNlID0gW10uc2xpY2U7XG52YXIgaWdub3JlZExvY2F0aW9uID0gXCJbaWdub3JlXVwiO1xudmFyIGhpdHMgPSB7fTtcblxuY29tcGxhaW4gPSBpc0RldmVsb3BtZW50ID8gY29tcGxhaW4gOiBub29wO1xuY29tcGxhaW4ubWV0aG9kID0gaXNEZXZlbG9wbWVudCA/IG1ldGhvZCA6IG5vb3A7XG5jb21wbGFpbi5mbiA9IGlzRGV2ZWxvcG1lbnQgPyBmbiA6IG5vb3BSZXR1cm47XG5jb21wbGFpbi5sb2cgPSBsb2c7XG5jb21wbGFpbi5zdHJlYW0gPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5zdGRlcnI7XG5jb21wbGFpbi5zaWxlbmNlID0gZmFsc2U7XG5jb21wbGFpbi5jb2xvciA9IGNvbXBsYWluLnN0cmVhbSAmJiBjb21wbGFpbi5zdHJlYW0uaXNUVFk7XG5jb21wbGFpbi5jb2xvcnMgPSB7IHdhcm5pbmc6J1xceDFiWzMxOzFtJywgbm90aWNlOidcXHgxYlszMzsxbScsIG1lc3NhZ2U6ZmFsc2UsIGxvY2F0aW9uOidcXHUwMDFiWzkwbScgfTtcbmNvbXBsYWluLmdldE1vZHVsZU5hbWUgPSBnZXRNb2R1bGVOYW1lO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY29tcGxhaW47XG59IGVsc2UgaWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmNvbXBsYWluID0gY29tcGxhaW47XG59XG5cbmZ1bmN0aW9uIGNvbXBsYWluKCkge1xuICB2YXIgb3B0aW9ucztcbiAgdmFyIGxvY2F0aW9uO1xuICB2YXIgbG9jYXRpb25JbmRleDtcbiAgdmFyIGhlYWRpbmdDb2xvcjtcbiAgdmFyIGhlYWRpbmc7XG4gIHZhciBsZXZlbDtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgaWYoY29tcGxhaW4uc2lsZW5jZSkgcmV0dXJuO1xuXG4gIGlmKHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoLTFdID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSBhcmdzW2FyZ3MubGVuZ3RoLTFdO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3MsIDAsIC0xKTtcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBsZXZlbCA9IG9wdGlvbnMubGV2ZWwgfHwgMjtcbiAgaGVhZGluZyA9IG9wdGlvbnMuaGVhZGluZyB8fCAobGV2ZWwgPT0gMiA/IFwiV0FSTklORyEhXCIgOiBcIk5PVElDRVwiKTtcbiAgaGVhZGluZ0NvbG9yID0gb3B0aW9ucy5oZWFkaW5nQ29sb3IgfHwgKGxldmVsID09IDIgPyBjb21wbGFpbi5jb2xvcnMud2FybmluZyA6IGNvbXBsYWluLmNvbG9ycy5ub3RpY2UpO1xuXG4gIC8vIERlZmF1bHQgdG8gdGhlIGxvY2F0aW9uIG9mIHRoZSBjYWxsIHRvIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9uXG4gIGxvY2F0aW9uSW5kZXggPSBvcHRpb25zLmxvY2F0aW9uSW5kZXggPT0gbnVsbCA/IDEgOiBvcHRpb25zLmxvY2F0aW9uSW5kZXg7XG5cbiAgLy8gV2hlbiB0aGUgdXNlciBzZXRzIGxvY2F0aW9uIHRvIGZhbHNlLFxuICAvLyBXZSB3aWxsIHVzZSB0aGUgbG9jYXRpb24gb2YgdGhlIGNhbGwgdG8gY29tcGxhaW4oKVxuICAvLyBUbyBsaW1pdCB0aGUgbG9nIHRvIG9ubHkgb2NjdXJyaW5nIG9uY2VcbiAgaWYob3B0aW9ucy5sb2NhdGlvbiA9PT0gZmFsc2UpIHtcbiAgICBsb2NhdGlvbkluZGV4ID0gMDtcbiAgfVxuXG4gIGxvY2F0aW9uID0gb3B0aW9ucy5sb2NhdGlvbiB8fCBnZXRMb2NhdGlvbihsb2NhdGlvbkluZGV4KTtcbiAgXG4gIHZhciBtb2R1bGVOYW1lID0gY29tcGxhaW4uZ2V0TW9kdWxlTmFtZShsb2NhdGlvbik7XG5cbiAgaWYgKG1vZHVsZU5hbWUgJiYgIXNob3dNb2R1bGVDb21wbGFpbnMpIHtcbiAgICBpZiAoIWhpdHNbbW9kdWxlTmFtZV0pIHtcbiAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXQoXCJOT1RJQ0VcIiwgY29tcGxhaW4uY29sb3JzLm5vdGljZSk7XG4gICAgICBvdXRwdXQgKz0gbGluZWJyZWFrICsgZm9ybWF0KCdUaGUgbW9kdWxlIFsnK21vZHVsZU5hbWUrJ10gaXMgdXNpbmcgZGVwcmVjYXRlZCBmZWF0dXJlcy4nLCBjb21wbGFpbi5jb2xvcnMubWVzc2FnZSk7XG4gICAgICBvdXRwdXQgKz0gbGluZWJyZWFrICsgZm9ybWF0KCdSdW4gd2l0aCBwcm9jZXNzLmVudi5TSE9XX01PRFVMRV9DT01QTEFJTlM9MSB0byBzZWUgYWxsIHdhcm5pbmdzLicsIGNvbXBsYWluLmNvbG9ycy5tZXNzYWdlKTtcbiAgICAgIGNvbXBsYWluLmxvZyhsaW5lYnJlYWsgKyBvdXRwdXQgKyBsaW5lYnJlYWspO1xuICAgICAgaGl0c1ttb2R1bGVOYW1lXSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIC8vIExvY2F0aW9uIGlzIG9ubHkgbWlzc2luZyBpbiBvbGRlciBicm93c2Vycy5cbiAgaWYobG9jYXRpb24pIHtcbiAgICBpZihoaXRzW2xvY2F0aW9uXSB8fCBsb2NhdGlvbiA9PT0gaWdub3JlZExvY2F0aW9uKSByZXR1cm47XG4gICAgZWxzZSBoaXRzW2xvY2F0aW9uXSA9IHRydWU7XG4gIH1cblxuICB2YXIgb3V0cHV0ID0gZm9ybWF0KGhlYWRpbmcsIGhlYWRpbmdDb2xvcik7XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXQgKz0gbGluZWJyZWFrICsgZm9ybWF0KGFyZ3NbaV0sIGNvbXBsYWluLmNvbG9ycy5tZXNzYWdlKTtcbiAgfVxuXG4gIGlmKG9wdGlvbnMubG9jYXRpb24gIT09IGZhbHNlICYmIGxvY2F0aW9uKSB7XG4gICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdCgnICBhdCAnK2xvY2F0aW9uLnJlcGxhY2UoY3dkLCAnJyksIGNvbXBsYWluLmNvbG9ycy5sb2NhdGlvbik7XG4gIH1cblxuICBjb21wbGFpbi5sb2cobGluZWJyZWFrICsgb3V0cHV0ICsgbGluZWJyZWFrKTtcbn07XG5cbmZ1bmN0aW9uIG1ldGhvZChvYmplY3QsIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgb3JpZ2luYWxNZXRob2QgPSBvYmplY3RbbWV0aG9kTmFtZV07XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29tcGxhaW4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZuKG9yaWdpbmFsKSB7XG4gIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjb21wbGFpbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICByZXR1cm4gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2cobWVzc2FnZSwgY29sb3IpIHtcbiAgdmFyIGZvcm1hdHRlZCA9IGZvcm1hdChtZXNzYWdlLCBjb2xvcik7XG4gIGlmKGNvbXBsYWluLnN0cmVhbSkge1xuICAgIGNvbXBsYWluLnN0cmVhbS53cml0ZShmb3JtYXR0ZWQrbGluZWJyZWFrKTtcbiAgfSBlbHNlIGlmKGxvZ2dlcikge1xuICAgIGxvZ2dlci53YXJuKGZvcm1hdHRlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0KG1lc3NhZ2UsIGNvbG9yKSB7XG4gIHJldHVybiBjb2xvciAmJiBjb21wbGFpbi5jb2xvciA/IGNvbG9yICsgbWVzc2FnZSArICdcXHgxYlswbScgOiBtZXNzYWdlO1xufVxuXG5mdW5jdGlvbiBnZXRMb2NhdGlvbihsb2NhdGlvbkluZGV4KSB7XG4gIHZhciBsb2NhdGlvbiA9ICcnO1xuICB2YXIgdGFyZ2V0SW5kZXggPSBsb2NhdGlvbkluZGV4ICsgMjtcblxuICAvKipcbiAgICogU3RhY2sgaW5kZXggZGVzY3JpcHRpb25zLlxuICAgKiBcbiAgICogMDogSW4gZ2V0TG9jYXRpb24oKSwgdGhlIGNhbGwgdG8gbmV3IEVycm9yKClcbiAgICogMTogSW4gY29tcGxhaW4oKSwgdGhlIGNhbGwgdG8gZ2V0TG9jYXRpb24oKVxuICAgKiAyOiBJbiB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbiwgdGhlIGNhbGwgdG8gY29tcGxhaW4oKVxuICAgKiAzOiBUaGUgY2FsbCB0byB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbiAoVEhJUyBJUyBUSEUgREVGQVVMVClcbiAgICovXG5cbiAgdHJ5IHtcbiAgICB2YXIgbG9jYXRpb25zID0gU3RhY2tQYXJzZXIucGFyc2UobmV3IEVycm9yKCkpLm1hcChmdW5jdGlvbihmcmFtZSkge1xuICAgICAgcmV0dXJuIGZyYW1lLmZpbGVOYW1lKyc6JytmcmFtZS5saW5lTnVtYmVyKyc6JytmcmFtZS5jb2x1bW5OdW1iZXI7XG4gICAgfSk7XG4gICAgaWYgKCFzaG93TmVzdGVkQ29tcGxhaW5zKSB7XG4gICAgICBmb3IgKHZhciBpID0gbG9jYXRpb25zLmxlbmd0aC0xOyBpID4gdGFyZ2V0SW5kZXg7IGktLSkge1xuICAgICAgICBpZiAoaGl0c1tsb2NhdGlvbnNbaV1dKSB7XG4gICAgICAgICAgcmV0dXJuIGlnbm9yZWRMb2NhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsb2NhdGlvbiA9IGxvY2F0aW9uc1t0YXJnZXRJbmRleF07XG4gIH0gY2F0Y2goZSkge31cblxuICByZXR1cm4gbG9jYXRpb247XG59XG5cbmZ1bmN0aW9uIGdldE1vZHVsZU5hbWUobG9jYXRpb24pIHtcbiAgdmFyIGxvY2F0aW9uUGFydHMgPSBsb2NhdGlvbi5yZXBsYWNlKGN3ZCwgJycpLnNwbGl0KC9cXC98XFxcXC9nKTtcbiAgZm9yKHZhciBpID0gbG9jYXRpb25QYXJ0cy5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAobG9jYXRpb25QYXJ0c1tpXSA9PT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgIHZhciBtb2R1bGVOYW1lID0gbG9jYXRpb25QYXJ0c1tpKzFdO1xuICAgICAgcmV0dXJuIChtb2R1bGVOYW1lWzBdID09PSAnQCcpID8gbW9kdWxlTmFtZSsnLycrbG9jYXRpb25QYXJ0c1tpKzJdIDogbW9kdWxlTmFtZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCgpe307XG5mdW5jdGlvbiBub29wUmV0dXJuKHIpIHsgcmV0dXJuIHI7IH07XG4iLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24gKFVNRCkgdG8gc3VwcG9ydCBBTUQsIENvbW1vbkpTL05vZGUuanMsIFJoaW5vLCBhbmQgYnJvd3NlcnMuXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKCdlcnJvci1zdGFjay1wYXJzZXInLCBbJ3N0YWNrZnJhbWUnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ3N0YWNrZnJhbWUnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5FcnJvclN0YWNrUGFyc2VyID0gZmFjdG9yeShyb290LlN0YWNrRnJhbWUpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlcihTdGFja0ZyYW1lKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCA9IC8oXnxAKVxcUys6XFxkKy87XG4gICAgdmFyIENIUk9NRV9JRV9TVEFDS19SRUdFWFAgPSAvXlxccyphdCAuKihcXFMrOlxcZCt8XFwobmF0aXZlXFwpKS9tO1xuICAgIHZhciBTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQID0gL14oZXZhbEApPyhcXFtuYXRpdmUgY29kZV0pPyQvO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIGFuIEVycm9yIG9iamVjdCwgZXh0cmFjdCB0aGUgbW9zdCBpbmZvcm1hdGlvbiBmcm9tIGl0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBvYmplY3RcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IG9mIFN0YWNrRnJhbWVzXG4gICAgICAgICAqL1xuICAgICAgICBwYXJzZTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2UoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2t0cmFjZSAhPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGVycm9yWydvcGVyYSNzb3VyY2Vsb2MnXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhY2sgJiYgZXJyb3Iuc3RhY2subWF0Y2goQ0hST01FX0lFX1NUQUNLX1JFR0VYUCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVY4T3JJRShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGRk9yU2FmYXJpKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgZ2l2ZW4gRXJyb3Igb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gU2VwYXJhdGUgbGluZSBhbmQgY29sdW1uIG51bWJlcnMgZnJvbSBhIHN0cmluZyBvZiB0aGUgZm9ybTogKFVSSTpMaW5lOkNvbHVtbilcbiAgICAgICAgZXh0cmFjdExvY2F0aW9uOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRleHRyYWN0TG9jYXRpb24odXJsTGlrZSkge1xuICAgICAgICAgICAgLy8gRmFpbC1mYXN0IGJ1dCByZXR1cm4gbG9jYXRpb25zIGxpa2UgXCIobmF0aXZlKVwiXG4gICAgICAgICAgICBpZiAodXJsTGlrZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt1cmxMaWtlXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlZ0V4cCA9IC8oLis/KSg/OjooXFxkKykpPyg/OjooXFxkKykpPyQvO1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gcmVnRXhwLmV4ZWModXJsTGlrZS5yZXBsYWNlKC9bKCldL2csICcnKSk7XG4gICAgICAgICAgICByZXR1cm4gW3BhcnRzWzFdLCBwYXJ0c1syXSB8fCB1bmRlZmluZWQsIHBhcnRzWzNdIHx8IHVuZGVmaW5lZF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VWOE9ySUU6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlVjhPcklFKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZC5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyhldmFsICcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9ldmFsIGNvZGUvZywgJ2V2YWwnKS5yZXBsYWNlKC8oXFwoZXZhbCBhdCBbXigpXSopfCgsLiokKS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzYW5pdGl6ZWRMaW5lID0gbGluZS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXChldmFsIGNvZGUvZywgJygnKS5yZXBsYWNlKC9eLio/XFxzKy8sICcnKTtcblxuICAgICAgICAgICAgICAgIC8vIGNhcHR1cmUgYW5kIHByZXNldmUgdGhlIHBhcmVudGhlc2l6ZWQgbG9jYXRpb24gXCIoL2Zvby9teSBiYXIuanM6MTI6ODcpXCIgaW5cbiAgICAgICAgICAgICAgICAvLyBjYXNlIGl0IGhhcyBzcGFjZXMgaW4gaXQsIGFzIHRoZSBzdHJpbmcgaXMgc3BsaXQgb24gXFxzKyBsYXRlciBvblxuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHNhbml0aXplZExpbmUubWF0Y2goLyAoXFwoLitcXCkkKS8pO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBwYXJlbnRoZXNpemVkIGxvY2F0aW9uIGZyb20gdGhlIGxpbmUsIGlmIGl0IHdhcyBtYXRjaGVkXG4gICAgICAgICAgICAgICAgc2FuaXRpemVkTGluZSA9IGxvY2F0aW9uID8gc2FuaXRpemVkTGluZS5yZXBsYWNlKGxvY2F0aW9uWzBdLCAnJykgOiBzYW5pdGl6ZWRMaW5lO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgYSBsb2NhdGlvbiB3YXMgbWF0Y2hlZCwgcGFzcyBpdCB0byBleHRyYWN0TG9jYXRpb24oKSBvdGhlcndpc2UgcGFzcyBhbGwgc2FuaXRpemVkTGluZVxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhpcyBsaW5lIGRvZXNuJ3QgaGF2ZSBmdW5jdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbihsb2NhdGlvbiA/IGxvY2F0aW9uWzFdIDogc2FuaXRpemVkTGluZSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IGxvY2F0aW9uICYmIHNhbml0aXplZExpbmUgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IFsnZXZhbCcsICc8YW5vbnltb3VzPiddLmluZGV4T2YobG9jYXRpb25QYXJ0c1swXSkgPiAtMSA/IHVuZGVmaW5lZCA6IGxvY2F0aW9uUGFydHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VGRk9yU2FmYXJpOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZUZGT3JTYWZhcmkoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhbGluZS5tYXRjaChTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignID4gZXZhbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvIGxpbmUgKFxcZCspKD86ID4gZXZhbCBsaW5lIFxcZCspKiA+IGV2YWw6XFxkKzpcXGQrL2csICc6JDEnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCdAJykgPT09IC0xICYmIGxpbmUuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgZXZhbCBmcmFtZXMgb25seSBoYXZlIGZ1bmN0aW9uIG5hbWVzIGFuZCBub3RoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbGluZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lUmVnZXggPSAvKCguKlwiLitcIlteQF0qKT9bXkBdKikoPzpAKS87XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbGluZS5tYXRjaChmdW5jdGlvbk5hbWVSZWdleCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBtYXRjaGVzICYmIG1hdGNoZXNbMV0gPyBtYXRjaGVzWzFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKGxpbmUucmVwbGFjZShmdW5jdGlvbk5hbWVSZWdleCwgJycpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYShlKSB7XG4gICAgICAgICAgICBpZiAoIWUuc3RhY2t0cmFjZSB8fCAoZS5tZXNzYWdlLmluZGV4T2YoJ1xcbicpID4gLTEgJiZcbiAgICAgICAgICAgICAgICBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJykubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmE5KGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMChlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTExKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE5OiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhOShlKSB7XG4gICAgICAgICAgICB2YXIgbGluZVJFID0gL0xpbmUgKFxcZCspLipzY3JpcHQgKD86aW4gKT8oXFxTKykvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUubWVzc2FnZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTEwOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTAoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspKD86OiBJbiBmdW5jdGlvbiAoXFxTKykpPyQvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBtYXRjaFszXSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE9wZXJhIDEwLjY1KyBFcnJvci5zdGFjayB2ZXJ5IHNpbWlsYXIgdG8gRkYvU2FmYXJpXG4gICAgICAgIHBhcnNlT3BlcmExMTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTExKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCkgJiYgIWxpbmUubWF0Y2goL15FcnJvciBjcmVhdGVkIGF0Lyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IGxpbmUuc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uQ2FsbCA9ICh0b2tlbnMuc2hpZnQoKSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uQ2FsbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPGFub255bW91cyBmdW5jdGlvbig6IChcXHcrKSk/Pi8sICckMicpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXChbXildKlxcKS9nLCAnJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzUmF3O1xuICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkNhbGwubWF0Y2goL1xcKChbXildKilcXCkvKSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzUmF3ID0gZnVuY3Rpb25DYWxsLnJlcGxhY2UoL15bXihdK1xcKChbXildKilcXCkkLywgJyQxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gKGFyZ3NSYXcgPT09IHVuZGVmaW5lZCB8fCBhcmdzUmF3ID09PSAnW2FyZ3VtZW50cyBub3QgYXZhaWxhYmxlXScpID9cbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkIDogYXJnc1Jhdy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufSkpO1xuIiwiLyoganNoaW50IG5ld2NhcDpmYWxzZSAqL1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgbGlzdGVuZXInKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUxpc3RlbmVyKGVlLCBsaXN0ZW5lciwgYXJncykge1xuICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKGVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKGVlLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKGVlLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gc2xvd2VyXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseShlZSwgc2xpY2UuY2FsbChhcmdzLCAxKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcihldmVudEVtaXR0ZXIsIHR5cGUsIGxpc3RlbmVyLCBwcmVwZW5kKSB7XG4gICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICB2YXIgZXZlbnRzID0gZXZlbnRFbWl0dGVyLiRlIHx8IChldmVudEVtaXR0ZXIuJGUgPSB7fSk7XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgICAgICAgICAgZXZlbnRzW3R5cGVdID0gcHJlcGVuZCA/IFtsaXN0ZW5lciwgbGlzdGVuZXJzXSA6IFtsaXN0ZW5lcnMsIGxpc3RlbmVyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChwcmVwZW5kKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnVuc2hpZnQobGlzdGVuZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgIH1cbiAgICByZXR1cm4gZXZlbnRFbWl0dGVyO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gICAgdGhpcy4kZSA9IHRoaXMuJGUgfHwge307XG59XG5cbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUgPSB7XG4gICAgJGU6IG51bGwsXG5cbiAgICBlbWl0OiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLiRlO1xuICAgICAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IGV2ZW50cyAmJiBldmVudHNbdHlwZV07XG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IGFyZ3NbMV07XG4gICAgICAgICAgICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ0Vycm9yOiAnICsgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgICAgICAgICBpbnZva2VMaXN0ZW5lcih0aGlzLCBsaXN0ZW5lcnMsIGFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gc2xpY2UuY2FsbChsaXN0ZW5lcnMpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGxlbj1saXN0ZW5lcnMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIGludm9rZUxpc3RlbmVyKHRoaXMsIGxpc3RlbmVyLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBvbjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHByZXBlbmRMaXN0ZW5lcjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgb25jZTogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICAgICAgZnVuY3Rpb24gZygpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbih0eXBlLCBnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbiAgICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuJGU7XG4gICAgICAgIHZhciBsaXN0ZW5lcnM7XG5cbiAgICAgICAgaWYgKGV2ZW50cyAmJiAobGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdKSkge1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPWxpc3RlbmVycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0gPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZUFsbExpc3RlbmVyczogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy4kZTtcbiAgICAgICAgaWYgKGV2ZW50cykge1xuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsaXN0ZW5lckNvdW50OiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLiRlO1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gZXZlbnRzICYmIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVycyA/IChpc0Z1bmN0aW9uKGxpc3RlbmVycykgPyAxIDogbGlzdGVuZXJzLmxlbmd0aCkgOiAwO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsInZhciBJTkRFWF9FVkVOVCA9IDA7XG52YXIgSU5ERVhfVVNFUl9MSVNURU5FUiA9IDE7XG52YXIgSU5ERVhfV1JBUFBFRF9MSVNURU5FUiA9IDI7XG52YXIgREVTVFJPWSA9IFwiZGVzdHJveVwiO1xuXG5mdW5jdGlvbiBpc05vbkV2ZW50RW1pdHRlcih0YXJnZXQpIHtcbiAgcmV0dXJuICF0YXJnZXQub25jZTtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyV3JhcHBlcih0YXJnZXQpIHtcbiAgICB0aGlzLiRfX3RhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLiRfX2xpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuJF9fc3Vic2NyaWJlVG8gPSBudWxsO1xufVxuXG5FdmVudEVtaXR0ZXJXcmFwcGVyLnByb3RvdHlwZSA9IHtcbiAgICAkX19yZW1vdmU6IGZ1bmN0aW9uKHRlc3QsIHRlc3RXcmFwcGVkKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiRfX3RhcmdldDtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuJF9fbGlzdGVuZXJzO1xuXG4gICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcihmdW5jdGlvbihjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgdmFyIGN1ckV2ZW50ID0gY3VyTGlzdGVuZXJbSU5ERVhfRVZFTlRdO1xuICAgICAgICAgICAgdmFyIGN1ckxpc3RlbmVyRnVuYyA9IGN1ckxpc3RlbmVyW0lOREVYX1VTRVJfTElTVEVORVJdO1xuICAgICAgICAgICAgdmFyIGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMgPSBjdXJMaXN0ZW5lcltJTkRFWF9XUkFQUEVEX0xJU1RFTkVSXTtcblxuICAgICAgICAgICAgaWYgKHRlc3RXcmFwcGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgdXNlZCBgb25jZWAgdG8gYXR0YWNoIGFuIGV2ZW50IGxpc3RlbmVyIHRoZW4gd2UgaGFkIHRvXG4gICAgICAgICAgICAgICAgLy8gd3JhcCB0aGVpciBsaXN0ZW5lciBmdW5jdGlvbiB3aXRoIGEgbmV3IGZ1bmN0aW9uIHRoYXQgZG9lcyBzb21lIGV4dHJhXG4gICAgICAgICAgICAgICAgLy8gY2xlYW51cCB0byBhdm9pZCBhIG1lbW9yeSBsZWFrLiBJZiB0aGUgYHRlc3RXcmFwcGVkYCBmbGFnIGlzIHNldCB0byB0cnVlXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBhcmUgYXR0ZW1wdGluZyB0byByZW1vdmUgYmFzZWQgb24gYSBmdW5jdGlvbiB0aGF0IHdlIGhhZCB0b1xuICAgICAgICAgICAgICAgIC8vIHdyYXAgKG5vdCB0aGUgdXNlciBsaXN0ZW5lciBmdW5jdGlvbilcbiAgICAgICAgICAgICAgICBpZiAoY3VyV3JhcHBlZExpc3RlbmVyRnVuYyAmJiB0ZXN0KGN1ckV2ZW50LCBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIoY3VyRXZlbnQsIGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRlc3QoY3VyRXZlbnQsIGN1ckxpc3RlbmVyRnVuYykpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZnVuY3Rpb24gd2FzIHdyYXBwZWQgZHVlIHRvIGl0IGJlaW5nIGEgYG9uY2VgIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBzaG91bGQgcmVtb3ZlIGZyb20gdGhlIHRhcmdldCBFdmVudEVtaXR0ZXIgdXNpbmcgd3JhcHBlZFxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmVyIGZ1bmN0aW9uLiBPdGhlcndpc2UsIHdlIHJlbW92ZSB0aGUgbGlzdGVuZXIgdXNpbmcgdGhlIHVzZXItcHJvdmlkZWRcbiAgICAgICAgICAgICAgICAvLyBsaXN0ZW5lciBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIoY3VyRXZlbnQsIGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMgfHwgY3VyTGlzdGVuZXJGdW5jKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXB0b3Jqcy9saXN0ZW5lci10cmFja2VyL2lzc3Vlcy8yXG4gICAgICAgIC8vIElmIGFsbCBvZiB0aGUgbGlzdGVuZXJzIHN0b3JlZCB3aXRoIGEgd3JhcHBlZCBFdmVudEVtaXR0ZXJcbiAgICAgICAgLy8gaGF2ZSBiZWVuIHJlbW92ZWQgdGhlbiB3ZSBzaG91bGQgdW5yZWdpc3RlciB0aGUgd3JhcHBlZFxuICAgICAgICAvLyBFdmVudEVtaXR0ZXIgaW4gdGhlIHBhcmVudCBTdWJzY3JpcHRpb25UcmFja2VyXG4gICAgICAgIHZhciBzdWJzY3JpYmVUbyA9IHRoaXMuJF9fc3Vic2NyaWJlVG87XG5cbiAgICAgICAgaWYgKCF0aGlzLiRfX2xpc3RlbmVycy5sZW5ndGggJiYgc3Vic2NyaWJlVG8pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBzdWJzY3JpYmVUb0xpc3QgPSBzdWJzY3JpYmVUby4kX19zdWJzY3JpYmVUb0xpc3Q7XG4gICAgICAgICAgICBzdWJzY3JpYmVUby4kX19zdWJzY3JpYmVUb0xpc3QgPSBzdWJzY3JpYmVUb0xpc3QuZmlsdGVyKGZ1bmN0aW9uKGN1cikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXIgIT09IHNlbGY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0Lm9uKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzLnB1c2goW2V2ZW50LCBsaXN0ZW5lcl0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgb25jZTogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBIYW5kbGluZyBhIGBvbmNlYCBldmVudCBsaXN0ZW5lciBpcyBhIGxpdHRsZSB0cmlja3kgc2luY2Ugd2UgbmVlZCB0byBhbHNvXG4gICAgICAgIC8vIGRvIG91ciBvd24gY2xlYW51cCBpZiB0aGUgYG9uY2VgIGV2ZW50IGlzIGVtaXR0ZWQuIFRoZXJlZm9yZSwgd2UgbmVlZFxuICAgICAgICAvLyB0byB3cmFwIHRoZSB1c2VyJ3MgbGlzdGVuZXIgZnVuY3Rpb24gd2l0aCBvdXIgb3duIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICAgICAgICB2YXIgd3JhcHBlZExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLiRfX3JlbW92ZShmdW5jdGlvbihldmVudCwgbGlzdGVuZXJGdW5jKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZWRMaXN0ZW5lciA9PT0gbGlzdGVuZXJGdW5jO1xuICAgICAgICAgICAgfSwgdHJ1ZSAvKiBXZSBhcmUgcmVtb3ZpbmcgdGhlIHdyYXBwZWQgbGlzdGVuZXIgKi8pO1xuXG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0Lm9uY2UoZXZlbnQsIHdyYXBwZWRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzLnB1c2goW2V2ZW50LCBsaXN0ZW5lciwgd3JhcHBlZExpc3RlbmVyXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyID0gZXZlbnQ7XG4gICAgICAgICAgICBldmVudCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdGVuZXIgJiYgZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJF9fcmVtb3ZlKGZ1bmN0aW9uKGN1ckV2ZW50LCBjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudCA9PT0gY3VyRXZlbnQgJiYgbGlzdGVuZXIgPT09IGN1ckxpc3RlbmVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuJF9fcmVtb3ZlKGZ1bmN0aW9uKGN1ckV2ZW50LCBjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lciA9PT0gY3VyTGlzdGVuZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZUFsbExpc3RlbmVyczogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy4kX19saXN0ZW5lcnM7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiRfX3RhcmdldDtcblxuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJF9fcmVtb3ZlKGZ1bmN0aW9uKGN1ckV2ZW50LCBjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudCA9PT0gY3VyRXZlbnQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcihjdXJbSU5ERVhfRVZFTlRdLCBjdXJbSU5ERVhfVVNFUl9MSVNURU5FUl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kX19saXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlckFkYXB0ZXIodGFyZ2V0KSB7XG4gICAgdGhpcy4kX190YXJnZXQgPSB0YXJnZXQ7XG59XG5cbkV2ZW50RW1pdHRlckFkYXB0ZXIucHJvdG90eXBlID0ge1xuICAgIG9uOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy4kX190YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgb25jZTogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBuZWVkIHRvIHNhdmUgdGhpcyBzbyB3ZSBjYW4gcmVtb3ZlIGl0IGJlbG93XG4gICAgICAgIHZhciBvbmNlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLiRfX3RhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBvbmNlTGlzdGVuZXIpO1xuICAgICAgICAgIGxpc3RlbmVyKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG9uY2VMaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gU3Vic2NyaXB0aW9uVHJhY2tlcigpIHtcbiAgICB0aGlzLiRfX3N1YnNjcmliZVRvTGlzdCA9IFtdO1xufVxuXG5TdWJzY3JpcHRpb25UcmFja2VyLnByb3RvdHlwZSA9IHtcblxuICAgIHN1YnNjcmliZVRvOiBmdW5jdGlvbih0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGFkZERlc3Ryb3lMaXN0ZW5lciA9ICFvcHRpb25zIHx8IG9wdGlvbnMuYWRkRGVzdHJveUxpc3RlbmVyICE9PSBmYWxzZTtcbiAgICAgICAgdmFyIHdyYXBwZXI7XG4gICAgICAgIHZhciBub25FRTtcbiAgICAgICAgdmFyIHN1YnNjcmliZVRvTGlzdCA9IHRoaXMuJF9fc3Vic2NyaWJlVG9MaXN0O1xuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbGVuPXN1YnNjcmliZVRvTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjdXIgPSBzdWJzY3JpYmVUb0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoY3VyLiRfX3RhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgd3JhcHBlciA9IGN1cjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd3JhcHBlcikge1xuICAgICAgICAgICAgaWYgKGlzTm9uRXZlbnRFbWl0dGVyKHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgbm9uRUUgPSBuZXcgRXZlbnRFbWl0dGVyQWRhcHRlcih0YXJnZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cmFwcGVyID0gbmV3IEV2ZW50RW1pdHRlcldyYXBwZXIobm9uRUUgfHwgdGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChhZGREZXN0cm95TGlzdGVuZXIgJiYgIW5vbkVFKSB7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5vbmNlKERFU1RST1ksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVUb0xpc3RbaV0uJF9fdGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgU3Vic2NyaXB0aW9uVHJhY2tlciBzbyB0aGF0IHdlIGNhbiBkbyBjbGVhbnVwXG4gICAgICAgICAgICAvLyBpZiB0aGUgRXZlbnRFbWl0dGVyV3JhcHBlciBpbnN0YW5jZSBiZWNvbWVzIGVtcHR5IChpLmUuLCBubyBhY3RpdmUgbGlzdGVuZXJzKVxuICAgICAgICAgICAgd3JhcHBlci4kX19zdWJzY3JpYmVUbyA9IHRoaXM7XG4gICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3QucHVzaCh3cmFwcGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIHN1YnNjcmliZVRvTGlzdCA9IHRoaXMuJF9fc3Vic2NyaWJlVG9MaXN0O1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyID0gc3Vic2NyaWJlVG9MaXN0W2ldO1xuICAgICAgICAgICAgICAgIGlmIChjdXIuJF9fdGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyLnJlbW92ZUFsbExpc3RlbmVycyhldmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXIuJF9fbGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG8gc29tZSBjbGVhbnVwIGlmIHdlIHJlbW92ZWQgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsaXN0ZW5lcnMgZm9yIHRoZSB0YXJnZXQgZXZlbnQgZW1pdHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YnNjcmliZVRvTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdFtpXS5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gU3Vic2NyaXB0aW9uVHJhY2tlcjtcblxuZXhwb3J0cy53cmFwID0gZnVuY3Rpb24odGFyZ2V0RXZlbnRFbWl0dGVyKSB7XG4gICAgdmFyIG5vbkVFO1xuICAgIHZhciB3cmFwcGVyO1xuXG4gICAgaWYgKGlzTm9uRXZlbnRFbWl0dGVyKHRhcmdldEV2ZW50RW1pdHRlcikpIHtcbiAgICAgIG5vbkVFID0gbmV3IEV2ZW50RW1pdHRlckFkYXB0ZXIodGFyZ2V0RXZlbnRFbWl0dGVyKTtcbiAgICB9XG5cbiAgICB3cmFwcGVyID0gbmV3IEV2ZW50RW1pdHRlcldyYXBwZXIobm9uRUUgfHwgdGFyZ2V0RXZlbnRFbWl0dGVyKTtcbiAgICBpZiAoIW5vbkVFKSB7XG4gICAgICAvLyB3ZSBkb24ndCBzZXQgdGhpcyBmb3Igbm9uIEVFIHR5cGVzXG4gICAgICB0YXJnZXRFdmVudEVtaXR0ZXIub25jZShERVNUUk9ZLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3cmFwcGVyLiRfX2xpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBwZXI7XG59O1xuXG5leHBvcnRzLmNyZWF0ZVRyYWNrZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvblRyYWNrZXIoKTtcbn07XG4iLCIvLyBDb21waWxlZCB1c2luZyBtYXJrb0A1LjMzLjE0IC0gRE8gTk9UIEVESVRcbmltcG9ydCB7IHQgYXMgX3QgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvdmRvbS9pbmRleC5qc1wiO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudFR5cGUgPSBcInVpXFxcXG1hcmtvXFxcXGNvbXBvbmVudHNcXFxcbGVmdC1tZW51XFxcXGluZGV4Lm1hcmtvXCIsXG4gIF9tYXJrb190ZW1wbGF0ZSA9IF90KF9tYXJrb19jb21wb25lbnRUeXBlKTtcbmV4cG9ydCBkZWZhdWx0IF9tYXJrb190ZW1wbGF0ZTtcbmltcG9ydCBfbWFya29fcmVuZGVyZXIgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IHIgYXMgX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanNcIjtcbl9tYXJrb19yZWdpc3RlckNvbXBvbmVudChfbWFya29fY29tcG9uZW50VHlwZSwgKCkgPT4gX21hcmtvX3RlbXBsYXRlKTtcbmNvbnN0IF9tYXJrb19jb21wb25lbnQgPSB7XG4gIG9uQ3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZW51X2l0ZW06IFtdLFxuICAgICAgbWVudV9saW5rOiBbXVxuICAgIH07XG4gIH0sXG4gIG9uSW5wdXQoaW5wdXQpIHtcbiAgICB0aGlzLnN0YXRlLm1lbnVfaXRlbSA9IGlucHV0LnBhcmFtcztcbiAgfSxcbiAgb25Nb3VudCgpIHtcbiAgICBsZXQgbGlzdEdyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0LWdyb3VwXCIpO1xuICAgIGxldCBhTGlzdCA9IGxpc3RHcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdhJyk7XG4gICAgdGhpcy5zdGF0ZS5tZW51X2xpbmsgPSBhTGlzdDtcbiAgfSxcbiAgbWVudUJ1dHRvbkNsaWNrKGVsZW1lbnQpIHtcbiAgICBsZXQgdGFyZ2V0ID0gZWxlbWVudC50YXJnZXQuaWQ7XG4gICAgdGhpcy5zdGF0ZS5tZW51X2xpbmsuZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZiAoZWwuaWQgPT09IHRhcmdldCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICBlbC5hcmlhQ3VycmVudCA9IFwidHJ1ZVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlZFBhZ2UnLCB0YXJnZXQpO1xuICB9XG59O1xuX21hcmtvX3RlbXBsYXRlLl8gPSBfbWFya29fcmVuZGVyZXIoZnVuY3Rpb24gKGlucHV0LCBvdXQsIF9jb21wb25lbnREZWYsIF9jb21wb25lbnQsIHN0YXRlLCAkZ2xvYmFsKSB7XG4gIG91dC5iZShcImRpdlwiLCB7XG4gICAgXCJpZFwiOiBcImxlZnQtbWVudVwiXG4gIH0sIFwiMFwiLCBfY29tcG9uZW50LCBudWxsLCAxKTtcbiAgb3V0LmJlKFwiZGl2XCIsIHtcbiAgICBcImNsYXNzXCI6IFwibGlzdC1ncm91cFwiXG4gIH0sIFwiMVwiLCBfY29tcG9uZW50LCBudWxsLCAxKTtcbiAge1xuICAgIGxldCBfaW5kZXggPSAwO1xuICAgIGNvbnN0IGFycmF5ID0gc3RhdGUubWVudV9pdGVtO1xuICAgIGZvciAoY29uc3QgZWwgb2YgYXJyYXkpIHtcbiAgICAgIGxldCBpbmRleCA9IF9pbmRleCsrO1xuICAgICAgY29uc3QgX2tleVNjb3BlID0gYFske2luZGV4fV1gO1xuICAgICAgb3V0LmJlKFwiYVwiLCB7XG4gICAgICAgIFwiaHJlZlwiOiBcIiNcIixcbiAgICAgICAgXCJpZFwiOiBlbC5pZCArIFwiLWJ1dHRvblwiLFxuICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1hY3Rpb25cIlxuICAgICAgfSwgXCIyXCIgKyBfa2V5U2NvcGUsIF9jb21wb25lbnQsIG51bGwsIDAsIHtcbiAgICAgICAgXCJvbmNsaWNrXCI6IF9jb21wb25lbnREZWYuZChcImNsaWNrXCIsICdtZW51QnV0dG9uQ2xpY2snLCBmYWxzZSlcbiAgICAgIH0pO1xuICAgICAgb3V0LnQoZWwubmFtZSwgX2NvbXBvbmVudCk7XG4gICAgICBvdXQuZWUoKTtcbiAgICB9XG4gIH1cbiAgb3V0LmVlKCk7XG4gIG91dC5lZSgpO1xufSwge1xuICB0OiBfbWFya29fY29tcG9uZW50VHlwZSxcbiAgZDogdHJ1ZVxufSwgX21hcmtvX2NvbXBvbmVudCk7XG5pbXBvcnQgX21hcmtvX2RlZmluZUNvbXBvbmVudCBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanNcIjtcbl9tYXJrb190ZW1wbGF0ZS5Db21wb25lbnQgPSBfbWFya29fZGVmaW5lQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnQsIF9tYXJrb190ZW1wbGF0ZS5fKTsiLCIvLyBDb21waWxlZCB1c2luZyBtYXJrb0A1LjMzLjE0IC0gRE8gTk9UIEVESVRcbmltcG9ydCB7IHQgYXMgX3QgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvdmRvbS9pbmRleC5qc1wiO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudFR5cGUgPSBcInVpXFxcXG1hcmtvXFxcXGhvbWVcXFxcY29tcG9uZW50c1xcXFxwYXNzd29yZC5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXR5L3V0aWxpdHkuanMnO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHtcbiAgb25DcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9LFxuICBvbk1vdW50KCkge30sXG4gIGFzeW5jIG9uU2F2ZShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IG9sZF9wYXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvbGQtcGFzc1wiKS52YWx1ZTtcbiAgICBsZXQgbmV3X3Bhc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1wYXNzXCIpLnZhbHVlO1xuICAgIGxldCBjb25maXJtX3Bhc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbmZpcm0tcGFzc1wiKS52YWx1ZTtcbiAgICBpZiAob2xkX3Bhc3MgPT09IG5ld19wYXNzKSB7XG4gICAgICBhbGVydCgnQXR0ZW56aW9uZSEgTGEgdmVjY2hpYSBlIGxhIG51b3ZhIHBhc3N3b3JkIG5vbiBwb3Nzb25vIGVzc2VyZSB1Z3VhbGkuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChuZXdfcGFzcyAhPSBjb25maXJtX3Bhc3MpIHtcbiAgICAgIGFsZXJ0KCdBdHRlbnppb25lISBMYSBudW92YSBwYXNzd29yZCBub24gY29ycmlzcG9uZGUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgdXJsOiAnL3YxLjAvdXNlcnMvJyArIFN0b3JlLnN0YXRlLnVzZXIgKyAnL2lzUGFzc3dvcmRDb3JyZWN0JyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgb2xkX3Bhc3M6IG9sZF9wYXNzXG4gICAgICB9XG4gICAgfTtcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB1dGlsaXR5Lm1ha2VSZXF1ZXN0KG9wdGlvbnMpO1xuICAgIGlmICghcmVzcG9uc2UuZGF0YS5jaGVjaykge1xuICAgICAgYWxlcnQoJ0F0dGVuemlvbmUhIExhIHZlY2NoaWEgcGFzc3dvcmQgbm9uIGNvcnJpc3BvbmRlLiBDb250cm9sbGFybGEgZSByaXByb3ZhcmUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHVybDogJy92MS4wL3VzZXJzLycgKyBTdG9yZS5zdGF0ZS51c2VyICsgJy9lZGl0UGFzc3dvcmQnLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbmV3X3Bhc3M6IG5ld19wYXNzXG4gICAgICB9XG4gICAgfTtcbiAgICByZXNwb25zZSA9IGF3YWl0IHV0aWxpdHkubWFrZVJlcXVlc3Qob3B0aW9ucyk7XG4gICAgaWYgKDUwMCA9PT0gcmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICBhbGVydCgnRXJyb3JlIGR1cmFudGUgaWwgY2FtYmlvIGRlbGxhIHBhc3N3b3JkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhbGVydCgnT0snKTtcbiAgICBTdG9yZS5OZXdTdGF0ZShzaG93SG9tZSgpKTtcbiAgfVxufTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge1xuICBvdXQuYmUoXCJkaXZcIiwgbnVsbCwgXCIwXCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQuYmUoXCJmb3JtXCIsIHtcbiAgICBcImFjdGlvblwiOiBcIi92MS4wL2FwcC9wYXNzd29yZENoYW5nZVwiLFxuICAgIFwibWV0aG9kXCI6IFwicG9zdFwiXG4gIH0sIFwiMVwiLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgb3V0LmJlKFwiZGl2XCIsIHtcbiAgICBcImNsYXNzXCI6IFwicGFzc3dvcmQtY2hhbmdlLWZvcm1cIlxuICB9LCBcIjJcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5iZShcImRpdlwiLCB7XG4gICAgXCJjbGFzc1wiOiBcIm5ldy1wYXNzd29yZFwiXG4gIH0sIFwiM1wiLCBfY29tcG9uZW50LCBudWxsLCAxKTtcbiAgb3V0LmJlKFwibGFiZWxcIiwge1xuICAgIFwiZm9yXCI6IFwib2xkLXBhc3NcIlxuICB9LCBcIjRcIiwgX2NvbXBvbmVudCwgbnVsbCwgMCk7XG4gIG91dC50KFwiVmVjY2hpYSBQYXNzd29yZDpcIiwgX2NvbXBvbmVudCk7XG4gIG91dC5lZSgpO1xuICBvdXQuZShcImlucHV0XCIsIHtcbiAgICBcImlkXCI6IFwib2xkLXBhc3NcIixcbiAgICBcInR5cGVcIjogXCJwYXNzd29yZFwiLFxuICAgIFwibmFtZVwiOiBcIm9sZC1wYXNzXCIsXG4gICAgXCJhdXRvY29tcGxldGVcIjogXCJjdXJyZW50LXBhc3N3b3JkXCIsXG4gICAgXCJjbGFzc1wiOiBcImZvcm0tY29udHJvbCBpbnB1dC1zbSBjaGF0LWlucHV0XCIsXG4gICAgXCJwbGFjZWhvbGRlclwiOiBcIlZlY2NoaWEgcGFzc3dvcmRcIixcbiAgICBcInJlcXVpcmVkXCI6IFwiXCIsXG4gICAgXCJhdXRvZm9jdXNcIjogXCJcIlxuICB9LCBcIjVcIiwgX2NvbXBvbmVudCwgMCwgMCk7XG4gIG91dC5lZSgpO1xuICBvdXQuYmUoXCJkaXZcIiwge1xuICAgIFwiY2xhc3NcIjogXCJuZXctcGFzc3dvcmRcIlxuICB9LCBcIjZcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5iZShcImxhYmVsXCIsIHtcbiAgICBcImZvclwiOiBcIm5ldy1wYXNzXCJcbiAgfSwgXCI3XCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQudChcIk51b3ZhIFBhc3N3b3JkOlwiLCBfY29tcG9uZW50KTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lKFwiaW5wdXRcIiwge1xuICAgIFwiaWRcIjogXCJuZXctcGFzc1wiLFxuICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXG4gICAgXCJuYW1lXCI6IFwibmV3LXBhc3NcIixcbiAgICBcImNsYXNzXCI6IFwiZm9ybS1jb250cm9sIGlucHV0LXNtIGNoYXQtaW5wdXRcIixcbiAgICBcInBsYWNlaG9sZGVyXCI6IFwiTnVvdmEgcGFzc3dvcmRcIixcbiAgICBcInJlcXVpcmVkXCI6IFwiXCJcbiAgfSwgXCI4XCIsIF9jb21wb25lbnQsIDAsIDApO1xuICBvdXQuZWUoKTtcbiAgb3V0LmJlKFwiZGl2XCIsIHtcbiAgICBcImNsYXNzXCI6IFwibmV3LXBhc3N3b3JkXCJcbiAgfSwgXCI5XCIsIF9jb21wb25lbnQsIG51bGwsIDEpO1xuICBvdXQuYmUoXCJsYWJlbFwiLCB7XG4gICAgXCJmb3JcIjogXCJjb25maXJtLXBhc3NcIlxuICB9LCBcIjEwXCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQudChcIkNvbmZlcm1hIE51b3ZhIFBhc3N3b3JkOlwiLCBfY29tcG9uZW50KTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lKFwiaW5wdXRcIiwge1xuICAgIFwiaWRcIjogXCJjb25maXJtLXBhc3NcIixcbiAgICBcInR5cGVcIjogXCJwYXNzd29yZFwiLFxuICAgIFwibmFtZVwiOiBcImNvbmZpcm0tcGFzc1wiLFxuICAgIFwiY2xhc3NcIjogXCJmb3JtLWNvbnRyb2wgaW5wdXQtc20gY2hhdC1pbnB1dFwiLFxuICAgIFwicGxhY2Vob2xkZXJcIjogXCJDb25mZXJtYSBOdW92YSBQYXNzd29yZFwiLFxuICAgIFwicmVxdWlyZWRcIjogXCJcIlxuICB9LCBcIjExXCIsIF9jb21wb25lbnQsIDAsIDApO1xuICBvdXQuZWUoKTtcbiAgb3V0LmJlKFwiZGl2XCIsIHtcbiAgICBcImNsYXNzXCI6IFwiYnV0dG9uLXdyYXBwZXItcGFzc1wiXG4gIH0sIFwiMTJcIiwgX2NvbXBvbmVudCwgbnVsbCwgMSk7XG4gIG91dC5lKFwiaW5wdXRcIiwge1xuICAgIFwidHlwZVwiOiBcInN1Ym1pdFwiLFxuICAgIFwibmFtZVwiOiBcIlNhbHZhXCIsXG4gICAgXCJjbGFzc1wiOiBcImJ0biBidG4tc3VjY2Vzc1wiLFxuICAgIFwidmFsdWVcIjogXCJTYWx2YVwiXG4gIH0sIFwiMTNcIiwgX2NvbXBvbmVudCwgMCwgMCwge1xuICAgIFwib25jbGlja1wiOiBfY29tcG9uZW50RGVmLmQoXCJjbGlja1wiLCBcIm9uU2F2ZVwiLCBmYWxzZSlcbiAgfSk7XG4gIG91dC5lZSgpO1xuICBvdXQuZWUoKTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lZSgpO1xufSwge1xuICB0OiBfbWFya29fY29tcG9uZW50VHlwZSxcbiAgZDogdHJ1ZVxufSwgX21hcmtvX2NvbXBvbmVudCk7XG5pbXBvcnQgX21hcmtvX2RlZmluZUNvbXBvbmVudCBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanNcIjtcbl9tYXJrb190ZW1wbGF0ZS5Db21wb25lbnQgPSBfbWFya29fZGVmaW5lQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnQsIF9tYXJrb190ZW1wbGF0ZS5fKTsiLCIvLyBDb21waWxlZCB1c2luZyBtYXJrb0A1LjMzLjE0IC0gRE8gTk9UIEVESVRcbmltcG9ydCB7IHQgYXMgX3QgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvdmRvbS9pbmRleC5qc1wiO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudFR5cGUgPSBcInVpXFxcXG1hcmtvXFxcXGhvbWVcXFxcaG9tZS5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgX2xlZnRNZW51IGZyb20gXCIuLi9jb21wb25lbnRzL2xlZnQtbWVudS9pbmRleC5tYXJrb1wiO1xuaW1wb3J0IF9tYXJrb190YWcgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2hlbHBlcnMvcmVuZGVyLXRhZy5qc1wiO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHtcbiAgb25DcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lbnVfaXRlbTogW3tcbiAgICAgICAgaWQ6ICdwYXNzd29yZCcsXG4gICAgICAgIG5hbWU6ICdDYW1iaW8gUGFzc3dvcmQnXG4gICAgICB9XSxcbiAgICAgIG1lbnVfbGluazogW11cbiAgICB9O1xuICAgIGlmIChTdG9yZS5zdGF0ZS5pZHJ1b2xvID09IDIpIHtcbiAgICAgIHRoaXMuc3RhdGUubWVudV9pdGVtLnB1c2goe1xuICAgICAgICBpZDogJ2FuYWdyYWZpY2EnLFxuICAgICAgICBuYW1lOiAnRGF0aSBBbmFncmFmaWNpJ1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBvbk1vdW50KCkge1xuICAgIGxldCBsaXN0R3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3QtZ3JvdXBcIik7XG4gICAgbGV0IGFMaXN0ID0gbGlzdEdyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcbiAgICB0aGlzLnN0YXRlLm1lbnVfbGluayA9IGFMaXN0O1xuICB9LFxuICBjaGFuZ2VkUGFnZSh0YXJnZXQpIHtcbiAgICBsZXQgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvbWUtY29udGVudCcpO1xuICAgIFN0b3JlLk5ld1N0YXRlKHVwZGF0ZUNvbnRlbnQodGFyZ2V0LCBvdXRwdXQpKTtcbiAgfVxufTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge1xuICBvdXQuYmUoXCJkaXZcIiwge1xuICAgIFwiY2xhc3NcIjogXCJob21lLWNvbnRhaW5lclwiXG4gIH0sIFwiMFwiLCBfY29tcG9uZW50LCBudWxsLCAxKTtcbiAgX21hcmtvX3RhZyhfbGVmdE1lbnUsIHtcbiAgICBcInBhcmFtc1wiOiBzdGF0ZS5tZW51X2l0ZW1cbiAgfSwgb3V0LCBfY29tcG9uZW50RGVmLCBcIjFcIiwgW1tcImNoYW5nZWRQYWdlXCIsICdjaGFuZ2VkUGFnZScsIGZhbHNlXV0pO1xuICBvdXQudChcIiBcIiwgX2NvbXBvbmVudCk7XG4gIG91dC5iZShcImRpdlwiLCB7XG4gICAgXCJpZFwiOiBcImhvbWUtY29udGVudFwiXG4gIH0sIFwiMlwiLCBfY29tcG9uZW50LCBudWxsLCAxKTtcbiAgb3V0LmJlKFwicFwiLCBudWxsLCBcIjNcIiwgX2NvbXBvbmVudCwgbnVsbCwgMCk7XG4gIG91dC50KFwiQmVudmVudXRpIHN1bCBzaXRvIGRpIGdlc3Rpb25lIHByZW5vdGF6aW9uaSBkZWwgc2Vydml6aW8gc2FuaXRhcmlvIG5hemlvbmFsZS5cIiwgX2NvbXBvbmVudCk7XG4gIG91dC5lZSgpO1xuICBvdXQuYmUoXCJwXCIsIG51bGwsIFwiNFwiLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgb3V0LnQoXCJEYSBxdWVzdGEgcGFnaW5hIHBvdGV0ZSByYWdnaXVuZ2VyZSBsZSBwYWdpbmUgcGVyIGxhIGdlc3Rpb25lIGRlbCB2b3N0cm8gYWNjb3VudC5cIiwgX2NvbXBvbmVudCk7XG4gIG91dC5lZSgpO1xuICBvdXQuZWUoKTtcbiAgb3V0LmVlKCk7XG59LCB7XG4gIHQ6IF9tYXJrb19jb21wb25lbnRUeXBlLFxuICBkOiB0cnVlXG59LCBfbWFya29fY29tcG9uZW50KTtcbmltcG9ydCBfbWFya29fZGVmaW5lQ29tcG9uZW50IGZyb20gXCJtYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2RlZmluZUNvbXBvbmVudC5qc1wiO1xuX21hcmtvX3RlbXBsYXRlLkNvbXBvbmVudCA9IF9tYXJrb19kZWZpbmVDb21wb25lbnQoX21hcmtvX2NvbXBvbmVudCwgX21hcmtvX3RlbXBsYXRlLl8pOyIsIi8vIENvbXBpbGVkIHVzaW5nIG1hcmtvQDUuMzMuMTQgLSBETyBOT1QgRURJVFxuaW1wb3J0IHsgdCBhcyBfdCB9IGZyb20gXCJtYXJrby9zcmMvcnVudGltZS92ZG9tL2luZGV4LmpzXCI7XG5jb25zdCBfbWFya29fY29tcG9uZW50VHlwZSA9IFwidWlcXFxcbWFya29cXFxccHJlbm90YXppb25pXFxcXGNvbXBvbmVudHNcXFxcbF9wcmVub3RhemlvbmkubWFya29cIixcbiAgX21hcmtvX3RlbXBsYXRlID0gX3QoX21hcmtvX2NvbXBvbmVudFR5cGUpO1xuZXhwb3J0IGRlZmF1bHQgX21hcmtvX3RlbXBsYXRlO1xuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0eS91dGlsaXR5LmpzJztcbmltcG9ydCBfbWFya29fcmVuZGVyZXIgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IHIgYXMgX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanNcIjtcbl9tYXJrb19yZWdpc3RlckNvbXBvbmVudChfbWFya29fY29tcG9uZW50VHlwZSwgKCkgPT4gX21hcmtvX3RlbXBsYXRlKTtcbmNvbnN0IF9tYXJrb19jb21wb25lbnQgPSB7XG4gIG9uQ3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfSxcbiAgb25Nb3VudCgpIHt9LFxuICBhc3luYyBvblNhdmUoZXZlbnQpIHt9XG59O1xuX21hcmtvX3RlbXBsYXRlLl8gPSBfbWFya29fcmVuZGVyZXIoZnVuY3Rpb24gKGlucHV0LCBvdXQsIF9jb21wb25lbnREZWYsIF9jb21wb25lbnQsIHN0YXRlLCAkZ2xvYmFsKSB7XG4gIG91dC5iZShcImRpdlwiLCBudWxsLCBcIjBcIiwgX2NvbXBvbmVudCwgbnVsbCwgMCk7XG4gIG91dC5iZShcImg1XCIsIG51bGwsIFwiMVwiLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgb3V0LnQoXCJMaXN0YSBwcmVub3RhemlvbmlcIiwgX2NvbXBvbmVudCk7XG4gIG91dC5lZSgpO1xuICBvdXQuYmUoXCJwXCIsIG51bGwsIFwiMlwiLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgb3V0LnQoXCJJbiBxdWVzdGEgc2V6aW9uZSBcXHhFOCBwb3NzaWJpbGUgdmVkZXJlIGkgZGV0dGFnbGkgZGkgdHV0dGUgbGUgcHJlbm90YXppb25pIGZ1dHVyZS5cIiwgX2NvbXBvbmVudCk7XG4gIG91dC5lZSgpO1xuICBvdXQuZWUoKTtcbn0sIHtcbiAgdDogX21hcmtvX2NvbXBvbmVudFR5cGUsXG4gIGQ6IHRydWVcbn0sIF9tYXJrb19jb21wb25lbnQpO1xuaW1wb3J0IF9tYXJrb19kZWZpbmVDb21wb25lbnQgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50LmpzXCI7XG5fbWFya29fdGVtcGxhdGUuQ29tcG9uZW50ID0gX21hcmtvX2RlZmluZUNvbXBvbmVudChfbWFya29fY29tcG9uZW50LCBfbWFya29fdGVtcGxhdGUuXyk7IiwiLy8gQ29tcGlsZWQgdXNpbmcgbWFya29ANS4zMy4xNCAtIERPIE5PVCBFRElUXG5pbXBvcnQgeyB0IGFzIF90IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanNcIjtcbmNvbnN0IF9tYXJrb19jb21wb25lbnRUeXBlID0gXCJ1aVxcXFxtYXJrb1xcXFxwcmVub3RhemlvbmlcXFxcY29tcG9uZW50c1xcXFxzX3ByZW5vdGF6aW9uaS5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXR5L3V0aWxpdHkuanMnO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHtcbiAgb25DcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9LFxuICBvbk1vdW50KCkge30sXG4gIGFzeW5jIG9uU2F2ZShldmVudCkge31cbn07XG5fbWFya29fdGVtcGxhdGUuXyA9IF9tYXJrb19yZW5kZXJlcihmdW5jdGlvbiAoaW5wdXQsIG91dCwgX2NvbXBvbmVudERlZiwgX2NvbXBvbmVudCwgc3RhdGUsICRnbG9iYWwpIHtcbiAgb3V0LmJlKFwiZGl2XCIsIG51bGwsIFwiMFwiLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgb3V0LmJlKFwiaDVcIiwgbnVsbCwgXCIxXCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQudChcIlN0b3JpY28gcHJlbm90YXppb25pXCIsIF9jb21wb25lbnQpO1xuICBvdXQuZWUoKTtcbiAgb3V0LmJlKFwicFwiLCBudWxsLCBcIjJcIiwgX2NvbXBvbmVudCwgbnVsbCwgMCk7XG4gIG91dC50KFwiSW4gcXVlc3RhIHNlemlvbmUgXFx4RTggcG9zc2liaWxlIHZlZGVyZSBpIGRldHRhZ2xpIGRpIHR1dHRlIGxlIHByZW5vdGF6aW9uaSBwYXNzYXRlLlwiLCBfY29tcG9uZW50KTtcbiAgb3V0LmVlKCk7XG4gIG91dC5lZSgpO1xufSwge1xuICB0OiBfbWFya29fY29tcG9uZW50VHlwZSxcbiAgZDogdHJ1ZVxufSwgX21hcmtvX2NvbXBvbmVudCk7XG5pbXBvcnQgX21hcmtvX2RlZmluZUNvbXBvbmVudCBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanNcIjtcbl9tYXJrb190ZW1wbGF0ZS5Db21wb25lbnQgPSBfbWFya29fZGVmaW5lQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnQsIF9tYXJrb190ZW1wbGF0ZS5fKTsiLCIvLyBDb21waWxlZCB1c2luZyBtYXJrb0A1LjMzLjE0IC0gRE8gTk9UIEVESVRcbmltcG9ydCB7IHQgYXMgX3QgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvdmRvbS9pbmRleC5qc1wiO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudFR5cGUgPSBcInVpXFxcXG1hcmtvXFxcXHByZW5vdGF6aW9uaVxcXFxwcmVub3RhemlvbmkubWFya29cIixcbiAgX21hcmtvX3RlbXBsYXRlID0gX3QoX21hcmtvX2NvbXBvbmVudFR5cGUpO1xuZXhwb3J0IGRlZmF1bHQgX21hcmtvX3RlbXBsYXRlO1xuaW1wb3J0IF9sZWZ0TWVudSBmcm9tIFwiLi4vY29tcG9uZW50cy9sZWZ0LW1lbnUvaW5kZXgubWFya29cIjtcbmltcG9ydCBfbWFya29fdGFnIGZyb20gXCJtYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL3JlbmRlci10YWcuanNcIjtcbmltcG9ydCBfbWFya29fcmVuZGVyZXIgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IHIgYXMgX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanNcIjtcbl9tYXJrb19yZWdpc3RlckNvbXBvbmVudChfbWFya29fY29tcG9uZW50VHlwZSwgKCkgPT4gX21hcmtvX3RlbXBsYXRlKTtcbmNvbnN0IF9tYXJrb19jb21wb25lbnQgPSB7XG4gIG9uQ3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZW51X2l0ZW06IFt7XG4gICAgICAgIGlkOiAnbF9wcmVub3RhemlvbmknLFxuICAgICAgICBuYW1lOiAnTGlzdGEgcHJlbm90YXppb25pJ1xuICAgICAgfSwge1xuICAgICAgICBpZDogJ3NfcHJlbm90YXppb25pJyxcbiAgICAgICAgbmFtZTogJ1N0b3JpY28gcHJlbm90YXppb25pJ1xuICAgICAgfV0sXG4gICAgICBtZW51X2xpbms6IFtdXG4gICAgfTtcbiAgfSxcbiAgb25Nb3VudCgpIHtcbiAgICBsZXQgbGlzdEdyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0LWdyb3VwXCIpO1xuICAgIGxldCBhTGlzdCA9IGxpc3RHcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdhJyk7XG4gICAgdGhpcy5zdGF0ZS5tZW51X2xpbmsgPSBhTGlzdDtcbiAgfSxcbiAgY2hhbmdlZFBhZ2UodGFyZ2V0KSB7XG4gICAgbGV0IG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVub3RhemlvbmktY29udGVudCcpO1xuICAgIFN0b3JlLk5ld1N0YXRlKHVwZGF0ZUNvbnRlbnQodGFyZ2V0LCBvdXRwdXQpKTtcbiAgfVxufTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge1xuICBvdXQuYmUoXCJkaXZcIiwge1xuICAgIFwiY2xhc3NcIjogXCJob21lLWNvbnRhaW5lclwiXG4gIH0sIFwiMFwiLCBfY29tcG9uZW50LCBudWxsLCAxKTtcbiAgX21hcmtvX3RhZyhfbGVmdE1lbnUsIHtcbiAgICBcInBhcmFtc1wiOiBzdGF0ZS5tZW51X2l0ZW1cbiAgfSwgb3V0LCBfY29tcG9uZW50RGVmLCBcIjFcIiwgW1tcImNoYW5nZWRQYWdlXCIsICdjaGFuZ2VkUGFnZScsIGZhbHNlXV0pO1xuICBvdXQudChcIiBcIiwgX2NvbXBvbmVudCk7XG4gIG91dC5iZShcImRpdlwiLCB7XG4gICAgXCJpZFwiOiBcInByZW5vdGF6aW9uaS1jb250ZW50XCJcbiAgfSwgXCIyXCIsIF9jb21wb25lbnQsIG51bGwsIDEpO1xuICBvdXQuYmUoXCJwXCIsIG51bGwsIFwiM1wiLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgb3V0LnQoXCJJbiBxdWVzdGEgc2V6aW9uZSBwb3RldGUgZ2VzdGlyZSBsZSB2b3N0cmUgcHJlbm90YXppb25pLlwiLCBfY29tcG9uZW50KTtcbiAgb3V0LmVlKCk7XG4gIG91dC5iZShcInBcIiwgbnVsbCwgXCI0XCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICBvdXQudChcIiBMYSBsaXN0YSBwcmVub3RhemlvbmkgbW9zdHJhIGxlIHByZW5vdGF6aW9uaSBmdXR1cmUsIGxvIHN0b3JpY28gZGVsbGUgcHJlbm90YXppb25pIG1vc3RyYSBxdWVsbGUgcGFzc2F0ZS5cIiwgX2NvbXBvbmVudCk7XG4gIG91dC5lZSgpO1xuICBvdXQuZWUoKTtcbiAgb3V0LmVlKCk7XG59LCB7XG4gIHQ6IF9tYXJrb19jb21wb25lbnRUeXBlLFxuICBkOiB0cnVlXG59LCBfbWFya29fY29tcG9uZW50KTtcbmltcG9ydCBfbWFya29fZGVmaW5lQ29tcG9uZW50IGZyb20gXCJtYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2RlZmluZUNvbXBvbmVudC5qc1wiO1xuX21hcmtvX3RlbXBsYXRlLkNvbXBvbmVudCA9IF9tYXJrb19kZWZpbmVDb21wb25lbnQoX21hcmtvX2NvbXBvbmVudCwgX21hcmtvX3RlbXBsYXRlLl8pOyIsInZhciBDb21wb25lbnREZWYgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudERlZlwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWdpbkNvbXBvbmVudChcbiAgY29tcG9uZW50c0NvbnRleHQsXG4gIGNvbXBvbmVudCxcbiAga2V5LFxuICBvd25lckNvbXBvbmVudERlZlxuKSB7XG4gIHZhciBjb21wb25lbnRJZCA9IGNvbXBvbmVudC5pZDtcbiAgdmFyIGNvbXBvbmVudERlZiA9IChjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWYgPSBuZXcgQ29tcG9uZW50RGVmKFxuICAgIGNvbXBvbmVudCxcbiAgICBjb21wb25lbnRJZCxcbiAgICBjb21wb25lbnRzQ29udGV4dFxuICApKTtcbiAgY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW1xuICAgIGNvbXBvbmVudElkXG4gIF0gPSB0cnVlO1xuICBjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnRzLnB1c2goY29tcG9uZW50RGVmKTtcblxuICB2YXIgb3V0ID0gY29tcG9uZW50c0NvbnRleHQuX19fb3V0O1xuICBvdXQuYmMoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50RGVmICYmIG93bmVyQ29tcG9uZW50RGVmLl9fX2NvbXBvbmVudCk7XG4gIHJldHVybiBjb21wb25lbnREZWY7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5kQ29tcG9uZW50KG91dCkge1xuICBvdXQuZWUoKTsgLy8gZW5kRWxlbWVudCgpIChhbHNvIHdvcmtzIGZvciBWQ29tcG9uZW50IG5vZGVzIHB1c2hlZCBvbiB0byB0aGUgc3RhY2spXG59O1xuIiwidmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBzZXRJbW1lZGlhdGUgPSByZXF1aXJlKFwiQGludGVybmFsL3NldC1pbW1lZGlhdGVcIikuX19fc2V0SW1tZWRpYXRlO1xudmFyIHdhcnAxMEZpbmFsaXplID0gcmVxdWlyZShcIndhcnAxMC9maW5hbGl6ZVwiKTtcbnZhciBkZWZpbmVDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2RlZmluZUNvbXBvbmVudFwiKTtcbnZhciBldmVudERlbGVnYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2V2ZW50LWRlbGVnYXRpb25cIik7XG52YXIgY3JlYXRlRnJhZ21lbnROb2RlID1cbiAgcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9mcmFnbWVudFwiKS5fX19jcmVhdGVGcmFnbWVudE5vZGU7XG52YXIgQ29tcG9uZW50RGVmID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnREZWZcIik7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciByZXEgPSByZXF1aXJlKFwiQGludGVybmFsL3JlcXVpcmVcIik7XG52YXIgY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xudmFyIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMgPVxuICBjb21wb25lbnRzVXRpbC5fX19hZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzO1xudmFyIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkID0gZG9tRGF0YS5fX19zc3JLZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZDtcbnZhciBjb21wb25lbnRzQnlET01Ob2RlID0gZG9tRGF0YS5fX19jb21wb25lbnRCeURPTU5vZGU7XG52YXIgc2VydmVyQ29tcG9uZW50Um9vdE5vZGVzID0ge307XG52YXIgc2VydmVyUmVuZGVyZWRNZXRhID0ge307XG52YXIgd2luID0gd2luZG93O1xuXG52YXIgREVGQVVMVF9SVU5USU1FX0lEID0gXCJNXCI7XG52YXIgRkxBR19XSUxMX1JFUkVOREVSX0lOX0JST1dTRVIgPSAxO1xuLy8gdmFyIEZMQUdfSEFTX1JFTkRFUl9CT0RZID0gMjtcblxudmFyIHJlZ2lzdGVyZWQgPSB7fTtcbnZhciBsb2FkZWQgPSB7fTtcbnZhciBjb21wb25lbnRUeXBlcyA9IHt9O1xudmFyIGRlZmVycmVkRGVmcztcbnZhciBwZW5kaW5nRGVmcztcblxuZnVuY3Rpb24gcmVnaXN0ZXIodHlwZSwgZGVmKSB7XG4gIHZhciBwZW5kaW5nRm9yVHlwZTtcbiAgaWYgKHBlbmRpbmdEZWZzKSB7XG4gICAgcGVuZGluZ0ZvclR5cGUgPSBwZW5kaW5nRGVmc1t0eXBlXTtcbiAgfVxuICByZWdpc3RlcmVkW3R5cGVdID0gZGVmO1xuICBkZWxldGUgbG9hZGVkW3R5cGVdO1xuICBkZWxldGUgY29tcG9uZW50VHlwZXNbdHlwZV07XG5cbiAgaWYgKHBlbmRpbmdGb3JUeXBlKSB7XG4gICAgZGVsZXRlIHBlbmRpbmdEZWZzW3R5cGVdO1xuICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICBwZW5kaW5nRm9yVHlwZS5mb3JFYWNoKGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIHRyeUh5ZHJhdGVDb21wb25lbnQoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHR5cGU7XG59XG5cbmZ1bmN0aW9uIGFkZFBlbmRpbmdEZWYoZGVmLCB0eXBlLCBtZXRhLCBob3N0LCBydW50aW1lSWQpIHtcbiAgaWYgKCFwZW5kaW5nRGVmcykge1xuICAgIHBlbmRpbmdEZWZzID0ge307XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGVuZGluZ0NvbXBvbmVudElkcyA9IE9iamVjdC5rZXlzKHBlbmRpbmdEZWZzKTtcbiAgICAgICAgaWYgKHBlbmRpbmdDb21wb25lbnRJZHMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgICBcIk1hcmtvIHRlbXBsYXRlcyB3ZXJlIG5ldmVyIGxvYWRlZCBmb3I6IFwiICsgcGVuZGluZ0NvbXBvbmVudElkc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAocGVuZGluZ0RlZnNbdHlwZV0gPSBwZW5kaW5nRGVmc1t0eXBlXSB8fCBbXSkucHVzaChbXG4gICAgZGVmLFxuICAgIG1ldGEsXG4gICAgaG9zdCxcbiAgICBydW50aW1lSWQsXG4gIF0pO1xufVxuXG5mdW5jdGlvbiBsb2FkKHR5cGVOYW1lLCBpc0xlZ2FjeSkge1xuICB2YXIgdGFyZ2V0ID0gbG9hZGVkW3R5cGVOYW1lXTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0YXJnZXQgPSByZWdpc3RlcmVkW3R5cGVOYW1lXTtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHRhcmdldCgpO1xuICAgIH0gZWxzZSBpZiAoaXNMZWdhY3kpIHtcbiAgICAgIHRhcmdldCA9IGV4cG9ydHMuX19fbGVnYWN5LmxvYWQodHlwZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQgPSByZXEodHlwZU5hbWUpO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICBcIkxvb2tzIGxpa2UgeW91IHVzZWQgYHJlcXVpcmU6YCBpbiB5b3VyIGJyb3dzZXIuanNvbiB0byBsb2FkIGEgY29tcG9uZW50LiAgVGhpcyByZXF1aXJlcyB0aGF0IE1hcmtvIGhhcyBrbm93bGVkZ2Ugb2YgaG93IGxhc3NvIGdlbmVyYXRlcyBwYXRocyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHZlcnNpb24uICBgbWFya28tZGVwZW5kZW5jaWVzOi9wYXRoL3RvL3RlbXBsYXRlLm1hcmtvYCBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiQ29tcG9uZW50IG5vdCBmb3VuZDogXCIgKyB0eXBlTmFtZSk7XG4gICAgfVxuXG4gICAgbG9hZGVkW3R5cGVOYW1lXSA9IHRhcmdldDtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudENsYXNzKHR5cGVOYW1lLCBpc0xlZ2FjeSkge1xuICB2YXIgQ29tcG9uZW50Q2xhc3MgPSBjb21wb25lbnRUeXBlc1t0eXBlTmFtZV07XG5cbiAgaWYgKENvbXBvbmVudENsYXNzKSB7XG4gICAgcmV0dXJuIENvbXBvbmVudENsYXNzO1xuICB9XG5cbiAgQ29tcG9uZW50Q2xhc3MgPSBsb2FkKHR5cGVOYW1lLCBpc0xlZ2FjeSk7XG5cbiAgQ29tcG9uZW50Q2xhc3MgPSBDb21wb25lbnRDbGFzcy5Db21wb25lbnQgfHwgQ29tcG9uZW50Q2xhc3M7XG5cbiAgaWYgKCFDb21wb25lbnRDbGFzcy5fX19pc0NvbXBvbmVudCkge1xuICAgIENvbXBvbmVudENsYXNzID0gZGVmaW5lQ29tcG9uZW50KENvbXBvbmVudENsYXNzLCBDb21wb25lbnRDbGFzcy5yZW5kZXJlcik7XG4gIH1cblxuICAvLyBNYWtlIHRoZSBjb21wb25lbnQgXCJ0eXBlXCIgYWNjZXNzaWJsZSBvbiBlYWNoIGNvbXBvbmVudCBpbnN0YW5jZVxuICBDb21wb25lbnRDbGFzcy5wcm90b3R5cGUuX19fdHlwZSA9IHR5cGVOYW1lO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIHZhciBjbGFzc05hbWVNYXRjaCA9XG4gICAgICAvXFwvKFteL10rPykoPzpcXC9pbmRleHxcXC90ZW1wbGF0ZXwpKD86XFwubWFya298XFwuY29tcG9uZW50KD86LWJyb3dzZXIpP3wpJC8uZXhlYyhcbiAgICAgICAgdHlwZU5hbWVcbiAgICAgICk7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZU1hdGNoID8gY2xhc3NOYW1lTWF0Y2hbMV0gOiBcIkFub255bW91c0NvbXBvbmVudFwiO1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uIChnKSB7XG4gICAgICByZXR1cm4gZ1sxXS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZVxuICAgICAgLnJlcGxhY2UoL1xcJFxcZCtcXC5cXGQrXFwuXFxkKyQvLCBcIlwiKVxuICAgICAgLnJlcGxhY2UoL15bXmEteiRfXS9pLCBcIl8kJlwiKVxuICAgICAgLnJlcGxhY2UoL1teMC05YS16JF9dKy9naSwgXCJfXCIpO1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZVswXS50b1VwcGVyQ2FzZSgpICsgY2xhc3NOYW1lLnNsaWNlKDEpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciBPbGRDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzO1xuICAgIENvbXBvbmVudENsYXNzID0ge1xuICAgICAgW2NsYXNzTmFtZV06IGZ1bmN0aW9uIChpZCwgZG9jKSB7XG4gICAgICAgIE9sZENvbXBvbmVudENsYXNzLmNhbGwodGhpcywgaWQsIGRvYyk7XG4gICAgICB9LFxuICAgIH1bY2xhc3NOYW1lXTtcbiAgICBDb21wb25lbnRDbGFzcy5wcm90b3R5cGUgPSBPbGRDb21wb25lbnRDbGFzcy5wcm90b3R5cGU7XG4gIH1cblxuICBjb21wb25lbnRUeXBlc1t0eXBlTmFtZV0gPSBDb21wb25lbnRDbGFzcztcblxuICByZXR1cm4gQ29tcG9uZW50Q2xhc3M7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudCh0eXBlTmFtZSwgaWQsIGlzTGVnYWN5KSB7XG4gIHZhciBDb21wb25lbnRDbGFzcyA9IGdldENvbXBvbmVudENsYXNzKHR5cGVOYW1lLCBpc0xlZ2FjeSk7XG4gIHJldHVybiBuZXcgQ29tcG9uZW50Q2xhc3MoaWQpO1xufVxuXG5mdW5jdGlvbiBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMobm9kZSwgcnVudGltZUlkLCBzdGFjaykge1xuICB2YXIgY29tcG9uZW50SWQ7XG4gIHZhciBvd25lcklkO1xuICB2YXIgb3duZXJDb21wb25lbnQ7XG4gIHZhciBrZXllZEVsZW1lbnRzO1xuICB2YXIgbmV4dFNpYmxpbmc7XG4gIHZhciBydW50aW1lTGVuZ3RoID0gcnVudGltZUlkLmxlbmd0aDtcbiAgc3RhY2sgPSBzdGFjayB8fCBbXTtcblxuICBub2RlID0gbm9kZS5maXJzdENoaWxkO1xuICB3aGlsZSAobm9kZSkge1xuICAgIG5leHRTaWJsaW5nID0gbm9kZS5uZXh0U2libGluZztcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgLy8gQ29tbWVudCBub2RlXG4gICAgICB2YXIgY29tbWVudFZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICBpZiAoY29tbWVudFZhbHVlLnNsaWNlKDAsIHJ1bnRpbWVMZW5ndGgpID09PSBydW50aW1lSWQpIHtcbiAgICAgICAgdmFyIGZpcnN0Q2hhciA9IGNvbW1lbnRWYWx1ZVtydW50aW1lTGVuZ3RoXTtcblxuICAgICAgICBpZiAoZmlyc3RDaGFyID09PSBcIl5cIiB8fCBmaXJzdENoYXIgPT09IFwiI1wiKSB7XG4gICAgICAgICAgc3RhY2sucHVzaChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChmaXJzdENoYXIgPT09IFwiL1wiKSB7XG4gICAgICAgICAgdmFyIGVuZE5vZGUgPSBub2RlO1xuICAgICAgICAgIHZhciBzdGFydE5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICB2YXIgcm9vdE5vZGU7XG5cbiAgICAgICAgICBpZiAoc3RhcnROb2RlLnBhcmVudE5vZGUgPT09IGVuZE5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgcm9vdE5vZGUgPSBjcmVhdGVGcmFnbWVudE5vZGUoc3RhcnROb2RlLm5leHRTaWJsaW5nLCBlbmROb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm9vdE5vZGUgPSBjcmVhdGVGcmFnbWVudE5vZGUoXG4gICAgICAgICAgICAgIGVuZE5vZGUucGFyZW50Tm9kZS5maXJzdENoaWxkLFxuICAgICAgICAgICAgICBlbmROb2RlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbXBvbmVudElkID0gc3RhcnROb2RlLm5vZGVWYWx1ZS5zdWJzdHJpbmcocnVudGltZUxlbmd0aCArIDEpO1xuICAgICAgICAgIGZpcnN0Q2hhciA9IHN0YXJ0Tm9kZS5ub2RlVmFsdWVbcnVudGltZUxlbmd0aF07XG5cbiAgICAgICAgICBpZiAoZmlyc3RDaGFyID09PSBcIl5cIikge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gY29tcG9uZW50SWQuc3BsaXQoLyAvZyk7XG4gICAgICAgICAgICB2YXIga2V5ID0gcGFydHNbMl07XG4gICAgICAgICAgICBvd25lcklkID0gcGFydHNbMV07XG4gICAgICAgICAgICBjb21wb25lbnRJZCA9IHBhcnRzWzBdO1xuICAgICAgICAgICAgaWYgKChvd25lckNvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFtvd25lcklkXSkpIHtcbiAgICAgICAgICAgICAga2V5ZWRFbGVtZW50cyA9IG93bmVyQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBrZXllZEVsZW1lbnRzID1cbiAgICAgICAgICAgICAgICBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSB8fFxuICAgICAgICAgICAgICAgIChrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSA9IHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gICAgICAgICAgICAgIGtleWVkRWxlbWVudHMsXG4gICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlcnZlckNvbXBvbmVudFJvb3ROb2Rlc1tjb21wb25lbnRJZF0gPSByb290Tm9kZTtcblxuICAgICAgICAgIHN0YXJ0Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0YXJ0Tm9kZSk7XG4gICAgICAgICAgZW5kTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVuZE5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAvLyBIVE1MIGVsZW1lbnQgbm9kZVxuICAgICAgdmFyIG1hcmtvS2V5ID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1hcmtvLWtleVwiKTtcbiAgICAgIHZhciBtYXJrb1Byb3BzID0gY29tcG9uZW50c1V0aWwuX19fZ2V0TWFya29Qcm9wc0Zyb21FbChub2RlKTtcbiAgICAgIGlmIChtYXJrb0tleSkge1xuICAgICAgICB2YXIgc2VwYXJhdG9ySW5kZXggPSBtYXJrb0tleS5pbmRleE9mKFwiIFwiKTtcbiAgICAgICAgb3duZXJJZCA9IG1hcmtvS2V5LnN1YnN0cmluZyhzZXBhcmF0b3JJbmRleCArIDEpO1xuICAgICAgICBtYXJrb0tleSA9IG1hcmtvS2V5LnN1YnN0cmluZygwLCBzZXBhcmF0b3JJbmRleCk7XG4gICAgICAgIGlmICgob3duZXJDb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbb3duZXJJZF0pKSB7XG4gICAgICAgICAga2V5ZWRFbGVtZW50cyA9IG93bmVyQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAga2V5ZWRFbGVtZW50cyA9XG4gICAgICAgICAgICBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSB8fFxuICAgICAgICAgICAgKGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW293bmVySWRdID0ge30pO1xuICAgICAgICB9XG4gICAgICAgIGtleWVkRWxlbWVudHNbbWFya29LZXldID0gbm9kZTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXJrb1Byb3BzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1hcmtvUHJvcHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIGlmIChrZXkuc2xpY2UoMCwgMikgPT09IFwib25cIikge1xuICAgICAgICAgICAgZXZlbnREZWxlZ2F0aW9uLl9fX2FkZERlbGVnYXRlZEV2ZW50SGFuZGxlcihrZXkuc2xpY2UoMikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMobm9kZSwgcnVudGltZUlkLCBzdGFjayk7XG4gICAgfVxuXG4gICAgbm9kZSA9IG5leHRTaWJsaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNvbXBvbmVudEV2ZW50SGFuZGxlcihjb21wb25lbnQsIHRhcmdldE1ldGhvZE5hbWUsIGFyZ3MpIHtcbiAgdmFyIG1ldGhvZCA9IGNvbXBvbmVudFt0YXJnZXRNZXRob2ROYW1lXTtcbiAgaWYgKCFtZXRob2QpIHtcbiAgICB0aHJvdyBFcnJvcihcIk1ldGhvZCBub3QgZm91bmQ6IFwiICsgdGFyZ2V0TWV0aG9kTmFtZSk7XG4gIH1cblxuICBtZXRob2QuYXBwbHkoY29tcG9uZW50LCBhcmdzKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lckhlbHBlcihlbCwgZXZlbnRUeXBlLCBpc09uY2UsIGxpc3RlbmVyKSB7XG4gIHZhciBldmVudExpc3RlbmVyID0gbGlzdGVuZXI7XG4gIGlmIChpc09uY2UpIHtcbiAgICBldmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsaXN0ZW5lcihldmVudCk7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRMaXN0ZW5lcik7XG4gICAgfTtcbiAgfVxuXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudExpc3RlbmVyLCBmYWxzZSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRMaXN0ZW5lcik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkZERPTUV2ZW50TGlzdGVuZXJzKFxuICBjb21wb25lbnQsXG4gIGVsLFxuICBldmVudFR5cGUsXG4gIHRhcmdldE1ldGhvZE5hbWUsXG4gIGlzT25jZSxcbiAgZXh0cmFBcmdzLFxuICBoYW5kbGVzXG4pIHtcbiAgdmFyIHJlbW92ZUxpc3RlbmVyID0gYWRkRXZlbnRMaXN0ZW5lckhlbHBlcihcbiAgICBlbCxcbiAgICBldmVudFR5cGUsXG4gICAgaXNPbmNlLFxuICAgIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZXZlbnQsIGVsXTtcbiAgICAgIGlmIChleHRyYUFyZ3MpIHtcbiAgICAgICAgYXJncyA9IGV4dHJhQXJncy5jb25jYXQoYXJncyk7XG4gICAgICB9XG5cbiAgICAgIGludm9rZUNvbXBvbmVudEV2ZW50SGFuZGxlcihjb21wb25lbnQsIHRhcmdldE1ldGhvZE5hbWUsIGFyZ3MpO1xuICAgIH1cbiAgKTtcbiAgaGFuZGxlcy5wdXNoKHJlbW92ZUxpc3RlbmVyKTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBvbmVudChjb21wb25lbnREZWYsIGhvc3QpIHtcbiAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudERlZi5fX19jb21wb25lbnQ7XG5cbiAgaWYgKCFjb21wb25lbnQgfHwgIWNvbXBvbmVudC5fX19pc0NvbXBvbmVudCkge1xuICAgIHJldHVybjsgLy8gbGVnYWN5XG4gIH1cblxuICBjb21wb25lbnQuX19fcmVzZXQoKTtcbiAgY29tcG9uZW50Ll9fX2hvc3QgPSBob3N0O1xuXG4gIHZhciBpc0V4aXN0aW5nID0gY29tcG9uZW50RGVmLl9fX2lzRXhpc3Rpbmc7XG5cbiAgaWYgKGlzRXhpc3RpbmcpIHtcbiAgICBjb21wb25lbnQuX19fcmVtb3ZlRE9NRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHZhciBkb21FdmVudHMgPSBjb21wb25lbnREZWYuX19fZG9tRXZlbnRzO1xuICBpZiAoZG9tRXZlbnRzKSB7XG4gICAgdmFyIGV2ZW50TGlzdGVuZXJIYW5kbGVzID0gW107XG5cbiAgICBkb21FdmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZG9tRXZlbnRBcmdzKSB7XG4gICAgICAvLyBUaGUgZXZlbnQgbWFwcGluZyBpcyBmb3IgYSBkaXJlY3QgRE9NIGV2ZW50IChub3QgYSBjdXN0b20gZXZlbnQgYW5kIG5vdCBmb3IgYnViYmxpZ24gZG9tIGV2ZW50cylcblxuICAgICAgdmFyIGV2ZW50VHlwZSA9IGRvbUV2ZW50QXJnc1swXTtcbiAgICAgIHZhciB0YXJnZXRNZXRob2ROYW1lID0gZG9tRXZlbnRBcmdzWzFdO1xuICAgICAgdmFyIGV2ZW50RWwgPSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1tkb21FdmVudEFyZ3NbMl1dO1xuICAgICAgdmFyIGlzT25jZSA9IGRvbUV2ZW50QXJnc1szXTtcbiAgICAgIHZhciBleHRyYUFyZ3MgPSBkb21FdmVudEFyZ3NbNF07XG5cbiAgICAgIGFkZERPTUV2ZW50TGlzdGVuZXJzKFxuICAgICAgICBjb21wb25lbnQsXG4gICAgICAgIGV2ZW50RWwsXG4gICAgICAgIGV2ZW50VHlwZSxcbiAgICAgICAgdGFyZ2V0TWV0aG9kTmFtZSxcbiAgICAgICAgaXNPbmNlLFxuICAgICAgICBleHRyYUFyZ3MsXG4gICAgICAgIGV2ZW50TGlzdGVuZXJIYW5kbGVzXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaWYgKGV2ZW50TGlzdGVuZXJIYW5kbGVzLmxlbmd0aCkge1xuICAgICAgY29tcG9uZW50Ll9fX2RvbUV2ZW50TGlzdGVuZXJIYW5kbGVzID0gZXZlbnRMaXN0ZW5lckhhbmRsZXM7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbXBvbmVudC5fX19tb3VudGVkKSB7XG4gICAgY29tcG9uZW50Ll9fX2VtaXRVcGRhdGUoKTtcbiAgfSBlbHNlIHtcbiAgICBjb21wb25lbnQuX19fbW91bnRlZCA9IHRydWU7XG4gICAgY29tcG9uZW50Ll9fX2VtaXRNb3VudCgpO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgdXNlZCB0byBpbml0aWFsaXplZCBjb21wb25lbnRzIGFzc29jaWF0ZWQgd2l0aCBVSSBjb21wb25lbnRzXG4gKiByZW5kZXJlZCBpbiB0aGUgYnJvd3Nlci4gV2hpbGUgcmVuZGVyaW5nIFVJIGNvbXBvbmVudHMgYSBcImNvbXBvbmVudHMgY29udGV4dFwiXG4gKiBpcyBhZGRlZCB0byB0aGUgcmVuZGVyaW5nIGNvbnRleHQgdG8ga2VlcCB1cCB3aXRoIHdoaWNoIGNvbXBvbmVudHMgYXJlIHJlbmRlcmVkLlxuICogV2hlbiByZWFkeSwgdGhlIGNvbXBvbmVudHMgY2FuIHRoZW4gYmUgaW5pdGlhbGl6ZWQgYnkgd2Fsa2luZyB0aGUgY29tcG9uZW50IHRyZWVcbiAqIGluIHRoZSBjb21wb25lbnRzIGNvbnRleHQgKG5lc3RlZCBjb21wb25lbnRzIGFyZSBpbml0aWFsaXplZCBiZWZvcmUgYW5jZXN0b3IgY29tcG9uZW50cykuXG4gKiBAcGFyYW0gIHtBcnJheTxtYXJrby1jb21wb25lbnRzL2xpYi9Db21wb25lbnREZWY+fSBjb21wb25lbnREZWZzIEFuIGFycmF5IG9mIENvbXBvbmVudERlZiBpbnN0YW5jZXNcbiAqL1xuZnVuY3Rpb24gaW5pdENsaWVudFJlbmRlcmVkKGNvbXBvbmVudERlZnMsIGhvc3QpIHtcbiAgaWYgKCFob3N0KSBob3N0ID0gZG9jdW1lbnQ7XG4gIC8vIEVuc3VyZSB0aGF0IGV2ZW50IGhhbmRsZXJzIHRvIGhhbmRsZSBkZWxlZ2F0aW5nIGV2ZW50cyBhcmVcbiAgLy8gYWx3YXlzIGF0dGFjaGVkIGJlZm9yZSBpbml0aWFsaXppbmcgYW55IGNvbXBvbmVudHNcbiAgZXZlbnREZWxlZ2F0aW9uLl9fX2luaXQoaG9zdCk7XG4gIHZhciBsZW4gPSBjb21wb25lbnREZWZzLmxlbmd0aDtcbiAgdmFyIGNvbXBvbmVudERlZjtcbiAgdmFyIGk7XG5cbiAgZm9yIChpID0gbGVuOyBpLS07ICkge1xuICAgIGNvbXBvbmVudERlZiA9IGNvbXBvbmVudERlZnNbaV07XG4gICAgdHJhY2tDb21wb25lbnQoY29tcG9uZW50RGVmKTtcbiAgfVxuXG4gIGZvciAoaSA9IGxlbjsgaS0tOyApIHtcbiAgICBjb21wb25lbnREZWYgPSBjb21wb25lbnREZWZzW2ldO1xuICAgIGluaXRDb21wb25lbnQoY29tcG9uZW50RGVmLCBob3N0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGluaXRpYWxpemVzIGFsbCBjb21wb25lbnRzIHRoYXQgd2VyZSByZW5kZXJlZCBvbiB0aGUgc2VydmVyIGJ5IGl0ZXJhdGluZyBvdmVyIGFsbFxuICogb2YgdGhlIGNvbXBvbmVudCBJRHMuXG4gKi9cbmZ1bmN0aW9uIGluaXRTZXJ2ZXJSZW5kZXJlZChyZW5kZXJlZENvbXBvbmVudHMsIGhvc3QpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgcmVuZGVyZWRDb21wb25lbnRzO1xuICB2YXIgZ2xvYmFsS2V5ID0gXCIkXCI7XG4gIHZhciBydW50aW1lSWQ7XG5cbiAgaWYgKHR5cGUgIT09IFwib2JqZWN0XCIpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcnVudGltZUlkID0gcmVuZGVyZWRDb21wb25lbnRzO1xuICAgICAgZ2xvYmFsS2V5ICs9IHJ1bnRpbWVJZCArIFwiX0NcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2xvYmFsS2V5ICs9IChydW50aW1lSWQgPSBERUZBVUxUX1JVTlRJTUVfSUQpICsgXCJDXCI7XG4gICAgfVxuXG4gICAgcmVuZGVyZWRDb21wb25lbnRzID0gd2luW2dsb2JhbEtleV07XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgaWYgKFxuICAgICAgICByZW5kZXJlZENvbXBvbmVudHMgJiZcbiAgICAgICAgcmVuZGVyZWRDb21wb25lbnRzLmkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICByZW5kZXJlZENvbXBvbmVudHMuaSAhPT0gY29tcG9uZW50c1V0aWwuX19fcnVudGltZUlkXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiTXVsdGlwbGUgaW5zdGFuY2VzIG9mIE1hcmtvIGhhdmUgYXR0YWNoZWQgdG8gdGhlIHNhbWUgcnVudGltZSBpZC4gVGhpcyBjb3VsZCBtZWFuIHRoYXQgbW9yZSB0aGFuIG9uZSBjb3B5IG9mIE1hcmtvIGlzIGxvYWRlZCBvbiB0aGUgcGFnZSwgb3IgdGhhdCB0aGUgc2NyaXB0IGNvbnRhaW5pbmcgTWFya28gaGFzIGV4ZWN1dGVkIG1vcmUgdGhhbiBvbmNlLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGZha2VBcnJheSA9ICh3aW5bZ2xvYmFsS2V5XSA9IHtcbiAgICAgIHI6IHJ1bnRpbWVJZCxcbiAgICAgIGNvbmNhdDogaW5pdFNlcnZlclJlbmRlcmVkLFxuICAgIH0pO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGZha2VBcnJheS5pID0gY29tcG9uZW50c1V0aWwuX19fcnVudGltZUlkO1xuICAgIH1cblxuICAgIGlmIChyZW5kZXJlZENvbXBvbmVudHMgJiYgcmVuZGVyZWRDb21wb25lbnRzLmZvckVhY2gpIHtcbiAgICAgIHJlbmRlcmVkQ29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChyZW5kZXJlZENvbXBvbmVudCkge1xuICAgICAgICBmYWtlQXJyYXkuY29uY2F0KHJlbmRlcmVkQ29tcG9uZW50KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWtlQXJyYXk7XG4gIH1cblxuICB2YXIgaXNGcm9tU2VyaWFsaXplZEdsb2JhbHMgPSB0aGlzLmNvbmNhdCA9PT0gaW5pdFNlcnZlclJlbmRlcmVkO1xuICByZW5kZXJlZENvbXBvbmVudHMgPSB3YXJwMTBGaW5hbGl6ZShyZW5kZXJlZENvbXBvbmVudHMpO1xuXG4gIGlmIChpc0Zyb21TZXJpYWxpemVkR2xvYmFscykge1xuICAgIHJ1bnRpbWVJZCA9IHRoaXMucjtcbiAgICBob3N0ID0gZG9jdW1lbnQ7XG4gIH0gZWxzZSB7XG4gICAgcnVudGltZUlkID0gcmVuZGVyZWRDb21wb25lbnRzLnIgfHwgREVGQVVMVF9SVU5USU1FX0lEO1xuICAgIGlmICghaG9zdCkgaG9zdCA9IGRvY3VtZW50O1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICBcIlBhc3Npbmcgc2VyaWFsaXplZCBkYXRhIHRvIGByZXF1aXJlKCdtYXJrby9jb21wb25lbnRzKS5pbml0YCBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkIHNldCAnJGdsb2JhbC5ydW50aW1lSWQnIGFuZCBwcm92aWRlIHRoZSAncnVudGltZUlkJyBvcHRpb24gdG8geW91ciBNYXJrbyBidW5kbGVyIHBsdWdpbi5cIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBpZiAoaG9zdCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICBcIlBhc3NpbmcgYSBkb2N1bWVudCBvdGhlciB0aGFuIHRoZSBjdXJyZW50IGRvY3VtZW50IHRvIGByZXF1aXJlKCdtYXJrby9jb21wb25lbnRzKS5pbml0YCBpcyBkZXByZWNhdGVkLlwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcmVmaXggPSByZW5kZXJlZENvbXBvbmVudHMucCB8fCBcIlwiO1xuICB2YXIgbWV0YSA9IHNlcnZlclJlbmRlcmVkTWV0YVtwcmVmaXhdO1xuICB2YXIgaXNMYXN0ID0gcmVuZGVyZWRDb21wb25lbnRzLmw7XG5cbiAgaWYgKG1ldGEpIHtcbiAgICBpZiAoaXNMYXN0KSB7XG4gICAgICBkZWxldGUgc2VydmVyUmVuZGVyZWRNZXRhW3ByZWZpeF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1ldGEgPSB7fTtcblxuICAgIGlmICghaXNMYXN0KSB7XG4gICAgICBzZXJ2ZXJSZW5kZXJlZE1ldGFbcHJlZml4XSA9IG1ldGE7XG4gICAgfVxuICB9XG5cbiAgLy8gRW5zdXJlIHRoYXQgZXZlbnQgaGFuZGxlcnMgdG8gaGFuZGxlIGRlbGVnYXRpbmcgZXZlbnRzIGFyZVxuICAvLyBhbHdheXMgYXR0YWNoZWQgYmVmb3JlIGluaXRpYWxpemluZyBhbnkgY29tcG9uZW50c1xuICBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMoaG9zdCwgcnVudGltZUlkKTtcbiAgZXZlbnREZWxlZ2F0aW9uLl9fX2luaXQoaG9zdCk7XG5cbiAgaWYgKHJlbmRlcmVkQ29tcG9uZW50cy5nKSB7XG4gICAgbWV0YS5fX19nbG9iYWxzID0gcmVuZGVyZWRDb21wb25lbnRzLmc7XG4gIH1cblxuICBpZiAocmVuZGVyZWRDb21wb25lbnRzLnQpIHtcbiAgICBtZXRhLl9fX3R5cGVzID0gbWV0YS5fX190eXBlc1xuICAgICAgPyBtZXRhLl9fX3R5cGVzLmNvbmNhdChyZW5kZXJlZENvbXBvbmVudHMudClcbiAgICAgIDogcmVuZGVyZWRDb21wb25lbnRzLnQ7XG4gIH1cblxuICAvLyBoeWRyYXRlIGNvbXBvbmVudHMgdG9wIGRvd24gKGxlYWYgbm9kZXMgbGFzdClcbiAgLy8gYW5kIHJldHVybiBhbiBhcnJheSBvZiBmdW5jdGlvbnMgdG8gbW91bnQgdGhlc2UgY29tcG9uZW50c1xuICAocmVuZGVyZWRDb21wb25lbnRzLncgfHwgW10pXG4gICAgLm1hcChmdW5jdGlvbiAoY29tcG9uZW50RGVmKSB7XG4gICAgICB2YXIgdHlwZU5hbWUgPSBtZXRhLl9fX3R5cGVzW2NvbXBvbmVudERlZlsxXV07XG5cbiAgICAgIHJldHVybiByZWdpc3RlcmVkW3R5cGVOYW1lXSB8fFxuICAgICAgICBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHxcbiAgICAgICAgcmVxLmUodHlwZU5hbWUpXG4gICAgICAgID8gdHJ5SHlkcmF0ZUNvbXBvbmVudChjb21wb25lbnREZWYsIG1ldGEsIGhvc3QsIHJ1bnRpbWVJZClcbiAgICAgICAgOiBhZGRQZW5kaW5nRGVmKGNvbXBvbmVudERlZiwgdHlwZU5hbWUsIG1ldGEsIGhvc3QsIHJ1bnRpbWVJZCk7XG4gICAgfSlcbiAgICAucmV2ZXJzZSgpXG4gICAgLmZvckVhY2godHJ5SW52b2tlKTtcblxuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gdHJ5SHlkcmF0ZUNvbXBvbmVudChyYXdEZWYsIG1ldGEsIGhvc3QsIHJ1bnRpbWVJZCkge1xuICB2YXIgY29tcG9uZW50RGVmID0gQ29tcG9uZW50RGVmLl9fX2Rlc2VyaWFsaXplKFxuICAgIHJhd0RlZixcbiAgICBtZXRhLl9fX3R5cGVzLFxuICAgIG1ldGEuX19fZ2xvYmFscyxcbiAgICBleHBvcnRzXG4gICk7XG4gIHZhciBtb3VudCA9IGh5ZHJhdGVDb21wb25lbnRBbmRHZXRNb3VudChjb21wb25lbnREZWYsIGhvc3QpO1xuXG4gIGlmICghbW91bnQpIHtcbiAgICAvLyBoeWRyYXRlQ29tcG9uZW50QW5kR2V0TW91bnQgd2lsbCByZXR1cm4gZmFsc2UgaWYgdGhlcmUgaXMgbm90IHJvb3ROb2RlXG4gICAgLy8gZm9yIHRoZSBjb21wb25lbnQuICBJZiB0aGlzIGlzIHRoZSBjYXNlLCB3ZSdsbCB3YWl0IHVudGlsIHRoZVxuICAgIC8vIERPTSBoYXMgZnVsbHkgbG9hZGVkIHRvIGF0dGVtcHQgdG8gaW5pdCB0aGUgY29tcG9uZW50IGFnYWluLlxuICAgIGlmIChkZWZlcnJlZERlZnMpIHtcbiAgICAgIGRlZmVycmVkRGVmcy5wdXNoKGNvbXBvbmVudERlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVycmVkRGVmcyA9IFtjb21wb25lbnREZWZdO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMoaG9zdCwgcnVudGltZUlkKTtcbiAgICAgICAgZGVmZXJyZWREZWZzXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoY29tcG9uZW50RGVmKSB7XG4gICAgICAgICAgICByZXR1cm4gaHlkcmF0ZUNvbXBvbmVudEFuZEdldE1vdW50KGNvbXBvbmVudERlZiwgaG9zdCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgLmZvckVhY2godHJ5SW52b2tlKTtcbiAgICAgICAgZGVmZXJyZWREZWZzLmxlbmd0aCA9IDA7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbW91bnQ7XG59XG5cbmZ1bmN0aW9uIGh5ZHJhdGVDb21wb25lbnRBbmRHZXRNb3VudChjb21wb25lbnREZWYsIGhvc3QpIHtcbiAgdmFyIGNvbXBvbmVudElkID0gY29tcG9uZW50RGVmLmlkO1xuICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudDtcbiAgdmFyIHJvb3ROb2RlID0gc2VydmVyQ29tcG9uZW50Um9vdE5vZGVzW2NvbXBvbmVudElkXTtcbiAgdmFyIHJlbmRlclJlc3VsdDtcblxuICBpZiAocm9vdE5vZGUpIHtcbiAgICBkZWxldGUgc2VydmVyQ29tcG9uZW50Um9vdE5vZGVzW2NvbXBvbmVudElkXTtcblxuICAgIGNvbXBvbmVudC5fX19yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgIGNvbXBvbmVudHNCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBjb21wb25lbnQpO1xuXG4gICAgaWYgKGNvbXBvbmVudERlZi5fX19mbGFncyAmIEZMQUdfV0lMTF9SRVJFTkRFUl9JTl9CUk9XU0VSKSB7XG4gICAgICBjb21wb25lbnQuX19faG9zdCA9IGhvc3Q7XG4gICAgICByZW5kZXJSZXN1bHQgPSBjb21wb25lbnQuX19fcmVyZW5kZXIoY29tcG9uZW50Ll9fX2lucHV0LCB0cnVlKTtcbiAgICAgIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZik7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgICAgIHJlbmRlclJlc3VsdC5hZnRlckluc2VydChob3N0KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgICAgaW5pdENvbXBvbmVudChjb21wb25lbnREZWYsIGhvc3QpO1xuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhY2tDb21wb25lbnQoY29tcG9uZW50RGVmKSB7XG4gIHZhciBjb21wb25lbnQgPSBjb21wb25lbnREZWYuX19fY29tcG9uZW50O1xuICBpZiAoY29tcG9uZW50KSB7XG4gICAgY29tcG9uZW50TG9va3VwW2NvbXBvbmVudC5pZF0gPSBjb21wb25lbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5SW52b2tlKGZuKSB7XG4gIGlmIChmbikgZm4oKTtcbn1cblxuZXhwb3J0cy5yID0gcmVnaXN0ZXI7XG5leHBvcnRzLl9fX2NyZWF0ZUNvbXBvbmVudCA9IGNyZWF0ZUNvbXBvbmVudDtcbmV4cG9ydHMuX19fZ2V0Q29tcG9uZW50Q2xhc3MgPSBnZXRDb21wb25lbnRDbGFzcztcbmV4cG9ydHMuX19faW5pdFNlcnZlclJlbmRlcmVkID0gd2luLiRpbml0Q29tcG9uZW50cyA9IGluaXRTZXJ2ZXJSZW5kZXJlZDtcblxucmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnRzQ29udGV4dFwiKS5fX19pbml0Q2xpZW50UmVuZGVyZWQgPVxuICBpbml0Q2xpZW50UmVuZGVyZWQ7XG4iLCJ2YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgY29tcG9uZW50c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIGtleXNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2tleUJ5RE9NTm9kZTtcbnZhciB2RWxlbWVudHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZFbGVtZW50QnlET01Ob2RlO1xudmFyIHZQcm9wc0J5RE9NTm9kZSA9IGRvbURhdGEuX19fdlByb3BzQnlET01Ob2RlO1xudmFyIG1hcmtvVUlEID0gd2luZG93LiRNVUlEIHx8ICh3aW5kb3cuJE1VSUQgPSB7IGk6IDAgfSk7XG52YXIgcnVudGltZUlkID0gbWFya29VSUQuaSsrO1xuXG52YXIgY29tcG9uZW50TG9va3VwID0ge307XG5cbnZhciBFTVBUWV9PQkpFQ1QgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50Rm9yRWwoZWwsIGhvc3QpIHtcbiAgdmFyIG5vZGUgPVxuICAgIHR5cGVvZiBlbCA9PSBcInN0cmluZ1wiXG4gICAgICA/ICgoaG9zdCA/IGhvc3Qub3duZXJEb2N1bWVudCA6IGhvc3QpIHx8IGRvY3VtZW50KS5nZXRFbGVtZW50QnlJZChlbClcbiAgICAgIDogZWw7XG4gIHZhciBjb21wb25lbnQ7XG4gIHZhciB2RWxlbWVudDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGlmIChub2RlLmZyYWdtZW50KSB7XG4gICAgICBpZiAobm9kZS5mcmFnbWVudC5lbmROb2RlID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmZyYWdtZW50LnN0YXJ0Tm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmZyYWdtZW50O1xuICAgICAgICBjb21wb25lbnQgPSBjb21wb25lbnRzQnlET01Ob2RlLmdldChub2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCh2RWxlbWVudCA9IHZFbGVtZW50c0J5RE9NTm9kZS5nZXQobm9kZSkpKSB7XG4gICAgICBjb21wb25lbnQgPSB2RWxlbWVudC5fX19vd25lckNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cblxuICAgIG5vZGUgPSBub2RlLnByZXZpb3VzU2libGluZyB8fCBub2RlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVzdHJveUNvbXBvbmVudEZvck5vZGUobm9kZSkge1xuICB2YXIgY29tcG9uZW50VG9EZXN0cm95ID0gY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZS5mcmFnbWVudCB8fCBub2RlKTtcbiAgaWYgKGNvbXBvbmVudFRvRGVzdHJveSkge1xuICAgIGNvbXBvbmVudFRvRGVzdHJveS5fX19kZXN0cm95U2hhbGxvdygpO1xuICAgIGRlbGV0ZSBjb21wb25lbnRMb29rdXBbY29tcG9uZW50VG9EZXN0cm95LmlkXTtcbiAgfVxufVxuZnVuY3Rpb24gZGVzdHJveU5vZGVSZWN1cnNpdmUobm9kZSwgY29tcG9uZW50KSB7XG4gIGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlKG5vZGUpO1xuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSAxMikge1xuICAgIHZhciBrZXk7XG5cbiAgICBpZiAoY29tcG9uZW50ICYmIChrZXkgPSBrZXlzQnlET01Ob2RlLmdldChub2RlKSkpIHtcbiAgICAgIGlmIChub2RlID09PSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1trZXldKSB7XG4gICAgICAgIGlmIChjb21wb25lbnRzQnlET01Ob2RlLmdldChub2RlKSAmJiAvXFxbXFxdJC8udGVzdChrZXkpKSB7XG4gICAgICAgICAgZGVsZXRlIGNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2tleV1bXG4gICAgICAgICAgICBjb21wb25lbnRzQnlET01Ob2RlLmdldChub2RlKS5pZFxuICAgICAgICAgIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgd2hpbGUgKGN1ckNoaWxkICYmIGN1ckNoaWxkICE9PSBub2RlLmVuZE5vZGUpIHtcbiAgICAgIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKGN1ckNoaWxkLCBjb21wb25lbnQpO1xuICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbmV4dENvbXBvbmVudElkKCkge1xuICAvLyBFYWNoIGNvbXBvbmVudCB3aWxsIGdldCBhbiBJRCB0aGF0IGlzIHVuaXF1ZSBhY3Jvc3MgYWxsIGxvYWRlZFxuICAvLyBtYXJrbyBydW50aW1lcy4gVGhpcyBhbGxvd3MgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIG1hcmtvIHRvIGJlXG4gIC8vIGxvYWRlZCBpbiB0aGUgc2FtZSB3aW5kb3cgYW5kIHRoZXkgc2hvdWxkIGFsbCBwbGFjZSBuaWNlXG4gIC8vIHRvZ2V0aGVyXG4gIHJldHVybiBcImNcIiArIG1hcmtvVUlELmkrKztcbn1cblxuZnVuY3Rpb24gbmV4dENvbXBvbmVudElkUHJvdmlkZXIoKSB7XG4gIHJldHVybiBuZXh0Q29tcG9uZW50SWQ7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaEJ1YmJsaW5nRXZlbnQoXG4gIGNvbXBvbmVudERlZixcbiAgaGFuZGxlck1ldGhvZE5hbWUsXG4gIGlzT25jZSxcbiAgZXh0cmFBcmdzXG4pIHtcbiAgaWYgKGhhbmRsZXJNZXRob2ROYW1lKSB7XG4gICAgdmFyIGNvbXBvbmVudElkID0gY29tcG9uZW50RGVmLmlkO1xuICAgIGlmIChleHRyYUFyZ3MpIHtcbiAgICAgIHJldHVybiBbaGFuZGxlck1ldGhvZE5hbWUsIGNvbXBvbmVudElkLCBpc09uY2UsIGV4dHJhQXJnc107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbaGFuZGxlck1ldGhvZE5hbWUsIGNvbXBvbmVudElkLCBpc09uY2VdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRNYXJrb1Byb3BzRnJvbUVsKGVsKSB7XG4gIHZhciB2RWxlbWVudCA9IHZFbGVtZW50c0J5RE9NTm9kZS5nZXQoZWwpO1xuICB2YXIgdmlydHVhbFByb3BzO1xuXG4gIGlmICh2RWxlbWVudCkge1xuICAgIHZpcnR1YWxQcm9wcyA9IHZFbGVtZW50Ll9fX3Byb3BlcnRpZXM7XG4gIH0gZWxzZSB7XG4gICAgdmlydHVhbFByb3BzID0gdlByb3BzQnlET01Ob2RlLmdldChlbCk7XG4gICAgaWYgKCF2aXJ0dWFsUHJvcHMpIHtcbiAgICAgIHZpcnR1YWxQcm9wcyA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtbWFya29cIik7XG4gICAgICB2UHJvcHNCeURPTU5vZGUuc2V0KFxuICAgICAgICBlbCxcbiAgICAgICAgKHZpcnR1YWxQcm9wcyA9IHZpcnR1YWxQcm9wcyA/IEpTT04ucGFyc2UodmlydHVhbFByb3BzKSA6IEVNUFRZX09CSkVDVClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZpcnR1YWxQcm9wcztcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29tcG9uZW50S2V5KGtleSwgcGFyZW50SWQpIHtcbiAgaWYgKGtleVswXSA9PT0gXCIjXCIpIHtcbiAgICBrZXkgPSBrZXkucmVwbGFjZShcIiNcIiArIHBhcmVudElkICsgXCItXCIsIFwiXCIpO1xuICB9XG4gIHJldHVybiBrZXk7XG59XG5cbmZ1bmN0aW9uIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gIGtleWVkRWxlbWVudHMsXG4gIGtleSxcbiAgcm9vdE5vZGUsXG4gIGNvbXBvbmVudElkXG4pIHtcbiAgaWYgKC9cXFtcXF0kLy50ZXN0KGtleSkpIHtcbiAgICB2YXIgcmVwZWF0ZWRFbGVtZW50c0ZvcktleSA9IChrZXllZEVsZW1lbnRzW2tleV0gPVxuICAgICAga2V5ZWRFbGVtZW50c1trZXldIHx8IHt9KTtcbiAgICByZXBlYXRlZEVsZW1lbnRzRm9yS2V5W2NvbXBvbmVudElkXSA9IHJvb3ROb2RlO1xuICB9IGVsc2Uge1xuICAgIGtleWVkRWxlbWVudHNba2V5XSA9IHJvb3ROb2RlO1xuICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbmlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgdmFyIHdhcm5Ob2RlUmVtb3ZlZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBmcmFnbWVudCA9IGV2ZW50LnRhcmdldC5mcmFnbWVudDtcbiAgICBpZiAoZnJhZ21lbnQpIHtcbiAgICAgIHZhciBiYXNlRXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgIFwiRnJhZ21lbnQgYm91bmRhcnkgbWFya2VyIHJlbW92ZWQuICBUaGlzIHdpbGwgY2F1c2UgYW4gZXJyb3Igd2hlbiB0aGUgZnJhZ21lbnQgaXMgdXBkYXRlZC5cIlxuICAgICAgKTtcbiAgICAgIGZyYWdtZW50Ll9fX21hcmtlcnNSZW1vdmVkRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSArIFwiIEJvdW5kYXJ5IG1hcmtlcnMgbWlzc2luZy5cIik7XG5cbiAgICAgICAgYmFzZUVycm9yLnN0YWNrID0gYmFzZUVycm9yLnN0YWNrLnJlcGxhY2UoLy4qd2Fybk5vZGVSZW1vdmVkLipcXG4vLCBcIlwiKTtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLndhcm4oYmFzZUVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG4gIGV4cG9ydHMuX19fc3RhcnRET01NYW5pcHVsYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKGhvc3QpIHtcbiAgICBob3N0LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLCB3YXJuTm9kZVJlbW92ZWQpO1xuICB9O1xuICBleHBvcnRzLl9fX3N0b3BET01NYW5pcHVsYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKGhvc3QpIHtcbiAgICBob3N0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLCB3YXJuTm9kZVJlbW92ZWQpO1xuICB9O1xufVxuXG5leHBvcnRzLl9fX3J1bnRpbWVJZCA9IHJ1bnRpbWVJZDtcbmV4cG9ydHMuX19fY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50TG9va3VwO1xuZXhwb3J0cy5fX19nZXRDb21wb25lbnRGb3JFbCA9IGdldENvbXBvbmVudEZvckVsO1xuZXhwb3J0cy5fX19kZXN0cm95Q29tcG9uZW50Rm9yTm9kZSA9IGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlO1xuZXhwb3J0cy5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZSA9IGRlc3Ryb3lOb2RlUmVjdXJzaXZlO1xuZXhwb3J0cy5fX19uZXh0Q29tcG9uZW50SWRQcm92aWRlciA9IG5leHRDb21wb25lbnRJZFByb3ZpZGVyO1xuZXhwb3J0cy5fX19hdHRhY2hCdWJibGluZ0V2ZW50ID0gYXR0YWNoQnViYmxpbmdFdmVudDtcbmV4cG9ydHMuX19fZ2V0TWFya29Qcm9wc0Zyb21FbCA9IGdldE1hcmtvUHJvcHNGcm9tRWw7XG5leHBvcnRzLl9fX2FkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMgPSBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzO1xuZXhwb3J0cy5fX19ub3JtYWxpemVDb21wb25lbnRLZXkgPSBub3JtYWxpemVDb21wb25lbnRLZXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmxvYWQuZSA9IGV4aXN0cztcbm1vZHVsZS5leHBvcnRzID0gbG9hZDtcblxuZnVuY3Rpb24gbG9hZChpZCkge1xuICByZXR1cm4gaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyhpZCkpO1xufVxuXG5mdW5jdGlvbiBleGlzdHMoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJvcFJlcXVpcmUobW9kKSB7XG4gIHJldHVybiBtb2QuZGVmYXVsdCB8fCBtb2Q7XG59XG4iLCJ2YXIgcXVldWUgPSBbXTtcbnZhciBtc2cgPSBcIlwiICsgTWF0aC5yYW5kb20oKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXYpIHtcbiAgaWYgKGV2LmRhdGEgPT09IG1zZykge1xuICAgIHZhciBjYWxsYmFja3MgPSBxdWV1ZTtcbiAgICBxdWV1ZSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYWxsYmFja3NbaV0oKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5leHBvcnRzLl9fX3NldEltbWVkaWF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAocXVldWUucHVzaChjYWxsYmFjaykgPT09IDEpIHtcbiAgICB3aW5kb3cucG9zdE1lc3NhZ2UobXNnLCBcIipcIik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19fcXVldWVNaWNyb3Rhc2sgPSByZXF1aXJlKFwiLi9xdWV1ZU1pY3JvdGFza1wiKTtcbiIsInZhciBwcm9taXNlO1xubW9kdWxlLmV4cG9ydHMgPVxuICB0eXBlb2YgcXVldWVNaWNyb3Rhc2sgPT09IFwiZnVuY3Rpb25cIlxuICAgID8gcXVldWVNaWNyb3Rhc2tcbiAgICA6ICgocHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpKSxcbiAgICAgIGZ1bmN0aW9uIChjYikge1xuICAgICAgICBwcm9taXNlLnRoZW4oY2IpO1xuICAgICAgfSk7XG4iLCJ2YXIgZG9tSW5zZXJ0ID0gcmVxdWlyZShcIi4vZG9tLWluc2VydFwiKTtcbnZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG5cbmZ1bmN0aW9uIGdldFJvb3ROb2RlKGVsKSB7XG4gIHZhciBjdXIgPSBlbDtcbiAgd2hpbGUgKGN1ci5wYXJlbnROb2RlKSBjdXIgPSBjdXIucGFyZW50Tm9kZTtcbiAgcmV0dXJuIGN1cjtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50RGVmcyhyZXN1bHQpIHtcbiAgdmFyIGNvbXBvbmVudERlZnMgPSByZXN1bHQuX19fY29tcG9uZW50cztcblxuICBpZiAoIWNvbXBvbmVudERlZnMpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vIGNvbXBvbmVudFwiKTtcbiAgfVxuICByZXR1cm4gY29tcG9uZW50RGVmcztcbn1cblxuZnVuY3Rpb24gUmVuZGVyUmVzdWx0KG91dCkge1xuICB0aGlzLm91dCA9IHRoaXMuX19fb3V0ID0gb3V0O1xuICB0aGlzLl9fX2NvbXBvbmVudHMgPSB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyUmVzdWx0O1xuXG52YXIgcHJvdG8gPSAoUmVuZGVyUmVzdWx0LnByb3RvdHlwZSA9IHtcbiAgZ2V0Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29tcG9uZW50cygpWzBdO1xuICB9LFxuICBnZXRDb21wb25lbnRzOiBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICBpZiAodGhpcy5fX19jb21wb25lbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiTm90IGFkZGVkIHRvIERPTVwiKTtcbiAgICB9XG5cbiAgICB2YXIgY29tcG9uZW50RGVmcyA9IGdldENvbXBvbmVudERlZnModGhpcyk7XG5cbiAgICB2YXIgY29tcG9uZW50cyA9IFtdO1xuXG4gICAgY29tcG9uZW50RGVmcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21wb25lbnREZWYpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnREZWYuX19fY29tcG9uZW50O1xuICAgICAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3Rvcihjb21wb25lbnQpKSB7XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gIH0sXG5cbiAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIG91dCA9IHRoaXMuX19fb3V0O1xuICAgIHZhciBjb21wb25lbnRzQ29udGV4dCA9IG91dC5fX19jb21wb25lbnRzO1xuICAgIGlmIChjb21wb25lbnRzQ29udGV4dCkge1xuICAgICAgdGhpcy5fX19jb21wb25lbnRzID0gY29tcG9uZW50c0NvbnRleHQuX19faW5pdENvbXBvbmVudHMoaG9zdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19fY29tcG9uZW50cyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGdldE5vZGU6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgcmV0dXJuIHRoaXMuX19fb3V0Ll9fX2dldE5vZGUoaG9zdCk7XG4gIH0sXG4gIGdldE91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX291dC5fX19nZXRPdXRwdXQoKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19vdXQudG9TdHJpbmcoKTtcbiAgfSxcbiAgZG9jdW1lbnQ6IHR5cGVvZiBkb2N1bWVudCA9PT0gXCJvYmplY3RcIiAmJiBkb2N1bWVudCxcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIFwiaHRtbFwiLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgJ1RoZSBcImh0bWxcIiBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIFwidG9TdHJpbmdcIiBpbnN0ZWFkLicsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICB9LFxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgXCJjb250ZXh0XCIsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICAnVGhlIFwiY29udGV4dFwiIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgXCJvdXRcIiBpbnN0ZWFkLicsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX19vdXQ7XG4gIH0sXG59KTtcblxuLy8gQWRkIGFsbCBvZiB0aGUgZm9sbG93aW5nIERPTSBtZXRob2RzIHRvIENvbXBvbmVudC5wcm90b3R5cGU6XG4vLyAtIGFwcGVuZFRvKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlQ2hpbGRyZW5PZihyZWZlcmVuY2VFbClcbi8vIC0gaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUVsKVxuLy8gLSBpbnNlcnRBZnRlcihyZWZlcmVuY2VFbClcbi8vIC0gcHJlcGVuZFRvKHJlZmVyZW5jZUVsKVxuZG9tSW5zZXJ0KFxuICBwcm90byxcbiAgZnVuY3Rpb24gZ2V0RWwocmVuZGVyUmVzdWx0LCByZWZlcmVuY2VFbCkge1xuICAgIHJldHVybiByZW5kZXJSZXN1bHQuZ2V0Tm9kZShnZXRSb290Tm9kZShyZWZlcmVuY2VFbCkpO1xuICB9LFxuICBmdW5jdGlvbiBhZnRlckluc2VydChyZW5kZXJSZXN1bHQsIHJlZmVyZW5jZUVsKSB7XG4gICAgcmV0dXJuIHJlbmRlclJlc3VsdC5hZnRlckluc2VydChnZXRSb290Tm9kZShyZWZlcmVuY2VFbCkpO1xuICB9LFxuKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoganNoaW50IG5ld2NhcDpmYWxzZSAqL1xuXG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHMtbGlnaHRcIik7XG52YXIgU3Vic2NyaXB0aW9uVHJhY2tlciA9IHJlcXVpcmUoXCJsaXN0ZW5lci10cmFja2VyXCIpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGNvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBkZXN0cm95Tm9kZVJlY3Vyc2l2ZSA9IGNvbXBvbmVudHNVdGlsLl9fX2Rlc3Ryb3lOb2RlUmVjdXJzaXZlO1xudmFyIGRlZmF1bHRDcmVhdGVPdXQgPSByZXF1aXJlKFwiLi4vY3JlYXRlT3V0XCIpO1xudmFyIGRvbUluc2VydCA9IHJlcXVpcmUoXCIuLi9kb20taW5zZXJ0XCIpO1xudmFyIFJlbmRlclJlc3VsdCA9IHJlcXVpcmUoXCIuLi9SZW5kZXJSZXN1bHRcIik7XG52YXIgbW9ycGhkb20gPSByZXF1aXJlKFwiLi4vdmRvbS9tb3JwaGRvbVwiKTtcbnZhciBnZXRDb21wb25lbnRzQ29udGV4dCA9XG4gIHJlcXVpcmUoXCIuL0NvbXBvbmVudHNDb250ZXh0XCIpLl9fX2dldENvbXBvbmVudHNDb250ZXh0O1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi9kb20tZGF0YVwiKTtcbnZhciBldmVudERlbGVnYXRpb24gPSByZXF1aXJlKFwiLi9ldmVudC1kZWxlZ2F0aW9uXCIpO1xudmFyIHVwZGF0ZU1hbmFnZXIgPSByZXF1aXJlKFwiLi91cGRhdGUtbWFuYWdlclwiKTtcbnZhciBjb21wb25lbnRzQnlET01Ob2RlID0gZG9tRGF0YS5fX19jb21wb25lbnRCeURPTU5vZGU7XG52YXIga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWQgPSBkb21EYXRhLl9fX3NzcktleWVkRWxlbWVudHNCeUNvbXBvbmVudElkO1xudmFyIENPTlRFWFRfS0VZID0gXCJfX3N1YnRyZWVfY29udGV4dF9fXCI7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnZhciBDT01QT05FTlRfU1VCU0NSSUJFX1RPX09QVElPTlM7XG52YXIgTk9OX0NPTVBPTkVOVF9TVUJTQ1JJQkVfVE9fT1BUSU9OUyA9IHtcbiAgYWRkRGVzdHJveUxpc3RlbmVyOiBmYWxzZSxcbn07XG5cbnZhciBlbWl0ID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0O1xudmFyIEVMRU1FTlRfTk9ERSA9IDE7XG5cbmZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHJlbW92ZUV2ZW50TGlzdGVuZXJIYW5kbGUpIHtcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lckhhbmRsZSgpO1xufVxuXG5mdW5jdGlvbiB3YWxrRnJhZ21lbnRzKGZyYWdtZW50KSB7XG4gIHZhciBub2RlO1xuXG4gIHdoaWxlIChmcmFnbWVudCkge1xuICAgIG5vZGUgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG4gICAgaWYgKCFub2RlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBmcmFnbWVudCA9IG5vZGUuZnJhZ21lbnQ7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ3VzdG9tRXZlbnRXaXRoTWV0aG9kTGlzdGVuZXIoXG4gIGNvbXBvbmVudCxcbiAgdGFyZ2V0TWV0aG9kTmFtZSxcbiAgYXJncyxcbiAgZXh0cmFBcmdzLFxuKSB7XG4gIC8vIFJlbW92ZSB0aGUgXCJldmVudFR5cGVcIiBhcmd1bWVudFxuICBhcmdzLnB1c2goY29tcG9uZW50KTtcblxuICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgYXJncyA9IGV4dHJhQXJncy5jb25jYXQoYXJncyk7XG4gIH1cblxuICB2YXIgdGFyZ2V0Q29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW2NvbXBvbmVudC5fX19zY29wZV07XG4gIHZhciB0YXJnZXRNZXRob2QgPVxuICAgIHR5cGVvZiB0YXJnZXRNZXRob2ROYW1lID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gdGFyZ2V0TWV0aG9kTmFtZVxuICAgICAgOiB0YXJnZXRDb21wb25lbnRbdGFyZ2V0TWV0aG9kTmFtZV07XG4gIGlmICghdGFyZ2V0TWV0aG9kKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJNZXRob2Qgbm90IGZvdW5kOiBcIiArIHRhcmdldE1ldGhvZE5hbWUpO1xuICB9XG5cbiAgdGFyZ2V0TWV0aG9kLmFwcGx5KHRhcmdldENvbXBvbmVudCwgYXJncyk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCkge1xuICByZXR1cm4gaW5kZXggPyBrZXkgKyBcIl9cIiArIGluZGV4IDoga2V5O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29tcG9uZW50SWRIZWxwZXIoY29tcG9uZW50LCBrZXksIGluZGV4KSB7XG4gIHJldHVybiBjb21wb25lbnQuaWQgKyBcIi1cIiArIHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgdXNlZCB0byBwcm9jZXNzIFwidXBkYXRlXzxzdGF0ZU5hbWU+XCIgaGFuZGxlciBmdW5jdGlvbnMuXG4gKiBJZiBhbGwgb2YgdGhlIG1vZGlmaWVkIHN0YXRlIHByb3BlcnRpZXMgaGF2ZSBhIHVzZXIgcHJvdmlkZWQgdXBkYXRlIGhhbmRsZXJcbiAqIHRoZW4gYSByZXJlbmRlciB3aWxsIGJlIGJ5cGFzc2VkIGFuZCwgaW5zdGVhZCwgdGhlIERPTSB3aWxsIGJlIHVwZGF0ZWRcbiAqIGxvb3Bpbmcgb3ZlciBhbmQgaW52b2tpbmcgdGhlIGN1c3RvbSB1cGRhdGUgaGFuZGxlcnMuXG4gKiBAcmV0dXJuIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgaWYgdGhlIERPTSB3YXMgdXBkYXRlZC4gRmFsc2UsIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc1VwZGF0ZUhhbmRsZXJzKGNvbXBvbmVudCwgc3RhdGVDaGFuZ2VzLCBvbGRTdGF0ZSkge1xuICB2YXIgaGFuZGxlck1ldGhvZDtcbiAgdmFyIGhhbmRsZXJzO1xuXG4gIGZvciAodmFyIHByb3BOYW1lIGluIHN0YXRlQ2hhbmdlcykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHN0YXRlQ2hhbmdlcywgcHJvcE5hbWUpKSB7XG4gICAgICB2YXIgaGFuZGxlck1ldGhvZE5hbWUgPSBcInVwZGF0ZV9cIiArIHByb3BOYW1lO1xuXG4gICAgICBoYW5kbGVyTWV0aG9kID0gY29tcG9uZW50W2hhbmRsZXJNZXRob2ROYW1lXTtcbiAgICAgIGlmIChoYW5kbGVyTWV0aG9kKSB7XG4gICAgICAgIChoYW5kbGVycyB8fCAoaGFuZGxlcnMgPSBbXSkpLnB1c2goW3Byb3BOYW1lLCBoYW5kbGVyTWV0aG9kXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIHN0YXRlIGNoYW5nZSBkb2VzIG5vdCBoYXZlIGEgc3RhdGUgaGFuZGxlciBzbyByZXR1cm4gZmFsc2VcbiAgICAgICAgLy8gdG8gZm9yY2UgYSByZXJlbmRlclxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgd2UgZ290IGhlcmUgdGhlbiBhbGwgb2YgdGhlIGNoYW5nZWQgc3RhdGUgcHJvcGVydGllcyBoYXZlXG4gIC8vIGFuIHVwZGF0ZSBoYW5kbGVyIG9yIHRoZXJlIGFyZSBubyBzdGF0ZSBwcm9wZXJ0aWVzIHRoYXQgYWN0dWFsbHlcbiAgLy8gY2hhbmdlZC5cbiAgaWYgKGhhbmRsZXJzKSB7XG4gICAgLy8gT3RoZXJ3aXNlLCB0aGVyZSBhcmUgaGFuZGxlcnMgZm9yIGFsbCBvZiB0aGUgY2hhbmdlZCBwcm9wZXJ0aWVzXG4gICAgLy8gc28gYXBwbHkgdGhlIHVwZGF0ZXMgdXNpbmcgdGhvc2UgaGFuZGxlcnNcblxuICAgIGhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBoYW5kbGVyWzBdO1xuICAgICAgaGFuZGxlck1ldGhvZCA9IGhhbmRsZXJbMV07XG5cbiAgICAgIHZhciBuZXdWYWx1ZSA9IHN0YXRlQ2hhbmdlc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgdmFyIG9sZFZhbHVlID0gb2xkU3RhdGVbcHJvcGVydHlOYW1lXTtcbiAgICAgIGhhbmRsZXJNZXRob2QuY2FsbChjb21wb25lbnQsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICBjb21wb25lbnQuX19fZW1pdFVwZGF0ZSgpO1xuICAgIGNvbXBvbmVudC5fX19yZXNldCgpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSW5wdXRDaGFuZ2VkKGV4aXN0aW5nQ29tcG9uZW50LCBvbGRJbnB1dCwgbmV3SW5wdXQpIHtcbiAgaWYgKG9sZElucHV0ICE9IG5ld0lucHV0KSB7XG4gICAgaWYgKG9sZElucHV0ID09IG51bGwgfHwgbmV3SW5wdXQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIG9sZEtleXMgPSBPYmplY3Qua2V5cyhvbGRJbnB1dCk7XG4gICAgdmFyIG5ld0tleXMgPSBPYmplY3Qua2V5cyhuZXdJbnB1dCk7XG4gICAgdmFyIGxlbiA9IG9sZEtleXMubGVuZ3RoO1xuICAgIGlmIChsZW4gIT09IG5ld0tleXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gbGVuOyBpLS07ICkge1xuICAgICAgdmFyIGtleSA9IG9sZEtleXNbaV07XG4gICAgICBpZiAoIShrZXkgaW4gbmV3SW5wdXQgJiYgb2xkSW5wdXRba2V5XSA9PT0gbmV3SW5wdXRba2V5XSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgY29tcG9uZW50UHJvdG87XG5cbi8qKlxuICogQmFzZSBjb21wb25lbnQgdHlwZS5cbiAqXG4gKiBOT1RFOiBBbnkgbWV0aG9kcyB0aGF0IGFyZSBwcmVmaXhlZCB3aXRoIGFuIHVuZGVyc2NvcmUgc2hvdWxkIGJlIGNvbnNpZGVyZWQgcHJpdmF0ZSFcbiAqL1xuZnVuY3Rpb24gQ29tcG9uZW50KGlkKSB7XG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuICB0aGlzLmlkID0gaWQ7XG4gIHRoaXMuX19fc3RhdGUgPSBudWxsO1xuICB0aGlzLl9fX3Jvb3ROb2RlID0gbnVsbDtcbiAgdGhpcy5fX19zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgdGhpcy5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcyA9IG51bGw7XG4gIHRoaXMuX19fYnViYmxpbmdEb21FdmVudHMgPSBudWxsOyAvLyBVc2VkIHRvIGtlZXAgdHJhY2sgb2YgYnViYmxpbmcgRE9NIGV2ZW50cyBmb3IgY29tcG9uZW50cyByZW5kZXJlZCBvbiB0aGUgc2VydmVyXG4gIHRoaXMuX19fY3VzdG9tRXZlbnRzID0gbnVsbDtcbiAgdGhpcy5fX19zY29wZSA9IG51bGw7XG4gIHRoaXMuX19fcmVuZGVySW5wdXQgPSBudWxsO1xuICB0aGlzLl9fX2lucHV0ID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX21vdW50ZWQgPSBmYWxzZTtcbiAgdGhpcy5fX19nbG9iYWwgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19fZGVzdHJveWVkID0gZmFsc2U7XG4gIHRoaXMuX19fdXBkYXRlUXVldWVkID0gZmFsc2U7XG4gIHRoaXMuX19fZGlydHkgPSBmYWxzZTtcbiAgdGhpcy5fX19zZXR0aW5nSW5wdXQgPSBmYWxzZTtcbiAgdGhpcy5fX19ob3N0ID0gdW5kZWZpbmVkO1xuXG4gIHZhciBzc3JLZXllZEVsZW1lbnRzID0ga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbaWRdO1xuXG4gIGlmIChzc3JLZXllZEVsZW1lbnRzKSB7XG4gICAgdGhpcy5fX19rZXllZEVsZW1lbnRzID0gc3NyS2V5ZWRFbGVtZW50cztcbiAgICBkZWxldGUga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbaWRdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX19fa2V5ZWRFbGVtZW50cyA9IHt9O1xuICB9XG59XG5cbkNvbXBvbmVudC5wcm90b3R5cGUgPSBjb21wb25lbnRQcm90byA9IHtcbiAgX19faXNDb21wb25lbnQ6IHRydWUsXG5cbiAgc3Vic2NyaWJlVG86IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuXG4gICAgdmFyIHN1YnNjcmlwdGlvbnMgPVxuICAgICAgdGhpcy5fX19zdWJzY3JpcHRpb25zIHx8XG4gICAgICAodGhpcy5fX19zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvblRyYWNrZXIoKSk7XG5cbiAgICB2YXIgc3Vic2NyaWJlVG9PcHRpb25zID0gdGFyZ2V0Ll9fX2lzQ29tcG9uZW50XG4gICAgICA/IENPTVBPTkVOVF9TVUJTQ1JJQkVfVE9fT1BUSU9OU1xuICAgICAgOiBOT05fQ09NUE9ORU5UX1NVQlNDUklCRV9UT19PUFRJT05TO1xuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbnMuc3Vic2NyaWJlVG8odGFyZ2V0LCBzdWJzY3JpYmVUb09wdGlvbnMpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChldmVudFR5cGUpIHtcbiAgICB2YXIgY3VzdG9tRXZlbnRzID0gdGhpcy5fX19jdXN0b21FdmVudHM7XG4gICAgdmFyIHRhcmdldDtcblxuICAgIGlmIChjdXN0b21FdmVudHMgJiYgKHRhcmdldCA9IGN1c3RvbUV2ZW50c1tldmVudFR5cGVdKSkge1xuICAgICAgdmFyIHRhcmdldE1ldGhvZE5hbWUgPSB0YXJnZXRbMF07XG4gICAgICB2YXIgaXNPbmNlID0gdGFyZ2V0WzFdO1xuICAgICAgdmFyIGV4dHJhQXJncyA9IHRhcmdldFsyXTtcbiAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICBoYW5kbGVDdXN0b21FdmVudFdpdGhNZXRob2RMaXN0ZW5lcihcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGFyZ2V0TWV0aG9kTmFtZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgZXh0cmFBcmdzLFxuICAgICAgKTtcblxuICAgICAgaWYgKGlzT25jZSkge1xuICAgICAgICBkZWxldGUgY3VzdG9tRXZlbnRzW2V2ZW50VHlwZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVtaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgZ2V0RWxJZDogZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcbiAgICBpZiAoIWtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuaWQ7XG4gICAgfVxuICAgIHJldHVybiByZXNvbHZlQ29tcG9uZW50SWRIZWxwZXIodGhpcywga2V5LCBpbmRleCk7XG4gIH0sXG4gIGdldEVsOiBmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciByZXNvbHZlZEtleSA9IHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCk7XG4gICAgICB2YXIga2V5ZWRFbGVtZW50ID0gdGhpcy5fX19rZXllZEVsZW1lbnRzW1wiQFwiICsgcmVzb2x2ZWRLZXldO1xuICAgICAgaWYgKGtleWVkRWxlbWVudCAmJiBrZXllZEVsZW1lbnQubm9kZVR5cGUgPT09IDEyIC8qKiBGUkFHTUVOVF9OT0RFICovKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgICAgXCJBY2Nlc3NpbmcgdGhlIGVsZW1lbnRzIG9mIGEgY2hpbGQgY29tcG9uZW50IHVzaW5nICdjb21wb25lbnQuZ2V0RWwnIGlzIGRlcHJlY2F0ZWQuXCIsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3YWxrRnJhZ21lbnRzKGtleWVkRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXllZEVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgIH1cbiAgfSxcbiAgZ2V0RWxzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAga2V5ID0ga2V5ICsgXCJbXVwiO1xuXG4gICAgdmFyIGVscyA9IFtdO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgZWw7XG4gICAgd2hpbGUgKChlbCA9IHRoaXMuZ2V0RWwoa2V5LCBpKSkpIHtcbiAgICAgIGVscy5wdXNoKGVsKTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGVscztcbiAgfSxcbiAgZ2V0Q29tcG9uZW50OiBmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgIHZhciByb290Tm9kZSA9IHRoaXMuX19fa2V5ZWRFbGVtZW50c1tcIkBcIiArIHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCldO1xuICAgIGlmICgvXFxbXFxdJC8udGVzdChrZXkpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgIFwiQSByZXBlYXRlZCBrZXlbXSB3YXMgcGFzc2VkIHRvIGdldENvbXBvbmVudC4gVXNlIGEgbm9uLXJlcGVhdGluZyBrZXkgaWYgdGhlcmUgaXMgb25seSBvbmUgb2YgdGhlc2UgY29tcG9uZW50cy5cIixcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJvb3ROb2RlID0gcm9vdE5vZGUgJiYgcm9vdE5vZGVbT2JqZWN0LmtleXMocm9vdE5vZGUpWzBdXTtcbiAgICB9XG4gICAgcmV0dXJuIHJvb3ROb2RlICYmIGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KHJvb3ROb2RlKTtcbiAgfSxcbiAgZ2V0Q29tcG9uZW50czogZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBsb29rdXAgPSB0aGlzLl9fX2tleWVkRWxlbWVudHNbXCJAXCIgKyBrZXkgKyBcIltdXCJdO1xuICAgIHJldHVybiBsb29rdXBcbiAgICAgID8gT2JqZWN0LmtleXMobG9va3VwKVxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KGxvb2t1cFtrZXldKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIDogW107XG4gIH0sXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX19kZXN0cm95ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcm9vdCA9IHRoaXMuX19fcm9vdE5vZGU7XG5cbiAgICB0aGlzLl9fX2Rlc3Ryb3lTaGFsbG93KCk7XG5cbiAgICB2YXIgbm9kZXMgPSByb290Lm5vZGVzO1xuXG4gICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgZGVzdHJveU5vZGVSZWN1cnNpdmUobm9kZSk7XG5cbiAgICAgIGlmIChldmVudERlbGVnYXRpb24uX19faGFuZGxlTm9kZURldGFjaChub2RlKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcm9vdC5kZXRhY2hlZCA9IHRydWU7XG5cbiAgICBkZWxldGUgY29tcG9uZW50TG9va3VwW3RoaXMuaWRdO1xuICAgIHRoaXMuX19fa2V5ZWRFbGVtZW50cyA9IHt9O1xuICB9LFxuXG4gIF9fX2Rlc3Ryb3lTaGFsbG93OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19fZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fX19lbWl0RGVzdHJveSgpO1xuICAgIHRoaXMuX19fZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgIGNvbXBvbmVudHNCeURPTU5vZGUuc2V0KHRoaXMuX19fcm9vdE5vZGUsIHVuZGVmaW5lZCk7XG5cbiAgICB0aGlzLl9fX3Jvb3ROb2RlID0gbnVsbDtcblxuICAgIC8vIFVuc3Vic2NyaWJlIGZyb20gYWxsIERPTSBldmVudHNcbiAgICB0aGlzLl9fX3JlbW92ZURPTUV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICB2YXIgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX19fc3Vic2NyaXB0aW9ucztcbiAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgICAgc3Vic2NyaXB0aW9ucy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuX19fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIGlzRGVzdHJveWVkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fZGVzdHJveWVkO1xuICB9LFxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fc3RhdGU7XG4gIH0sXG4gIHNldCBzdGF0ZShuZXdTdGF0ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgaWYgKCFzdGF0ZSAmJiAhbmV3U3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuX19fc3RhdGUgPSBuZXcgdGhpcy5fX19TdGF0ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBzdGF0ZS5fX19yZXBsYWNlKG5ld1N0YXRlIHx8IHt9KTtcblxuICAgIGlmIChzdGF0ZS5fX19kaXJ0eSkge1xuICAgICAgdGhpcy5fX19xdWV1ZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGlmICghbmV3U3RhdGUpIHtcbiAgICAgIHRoaXMuX19fc3RhdGUgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgc2V0U3RhdGU6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuX19fc3RhdGUgPSBuZXcgdGhpcy5fX19TdGF0ZSh0aGlzKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lID09IFwib2JqZWN0XCIpIHtcbiAgICAgIC8vIE1lcmdlIGluIHRoZSBuZXcgc3RhdGUgd2l0aCB0aGUgb2xkIHN0YXRlXG4gICAgICB2YXIgbmV3U3RhdGUgPSBuYW1lO1xuICAgICAgZm9yICh2YXIgayBpbiBuZXdTdGF0ZSkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChuZXdTdGF0ZSwgaykpIHtcbiAgICAgICAgICBzdGF0ZS5fX19zZXQoaywgbmV3U3RhdGVba10sIHRydWUgLyogZW5zdXJlOnRydWUgKi8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLl9fX3NldChuYW1lLCB2YWx1ZSwgdHJ1ZSAvKiBlbnN1cmU6dHJ1ZSAqLyk7XG4gICAgfVxuICB9LFxuXG4gIHNldFN0YXRlRGlydHk6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICB2YWx1ZSA9IHN0YXRlW25hbWVdO1xuICAgIH1cblxuICAgIHN0YXRlLl9fX3NldChcbiAgICAgIG5hbWUsXG4gICAgICB2YWx1ZSxcbiAgICAgIHRydWUgLyogZW5zdXJlOnRydWUgKi8sXG4gICAgICB0cnVlIC8qIGZvcmNlRGlydHk6dHJ1ZSAqLyxcbiAgICApO1xuICB9LFxuXG4gIHJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKG5ld1N0YXRlKSB7XG4gICAgdGhpcy5fX19zdGF0ZS5fX19yZXBsYWNlKG5ld1N0YXRlKTtcbiAgfSxcblxuICBnZXQgaW5wdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19faW5wdXQ7XG4gIH0sXG4gIHNldCBpbnB1dChuZXdJbnB1dCkge1xuICAgIGlmICh0aGlzLl9fX3NldHRpbmdJbnB1dCkge1xuICAgICAgdGhpcy5fX19pbnB1dCA9IG5ld0lucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fX3NldElucHV0KG5ld0lucHV0KTtcbiAgICB9XG4gIH0sXG5cbiAgX19fc2V0SW5wdXQ6IGZ1bmN0aW9uIChuZXdJbnB1dCwgb25JbnB1dCwgb3V0KSB7XG4gICAgb25JbnB1dCA9IG9uSW5wdXQgfHwgdGhpcy5vbklucHV0O1xuICAgIHZhciB1cGRhdGVkSW5wdXQ7XG5cbiAgICB2YXIgb2xkSW5wdXQgPSB0aGlzLl9fX2lucHV0O1xuICAgIHRoaXMuX19faW5wdXQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fX19jb250ZXh0ID0gKG91dCAmJiBvdXRbQ09OVEVYVF9LRVldKSB8fCB0aGlzLl9fX2NvbnRleHQ7XG5cbiAgICBpZiAob25JbnB1dCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBzZXQgYSBmbGFnIHRvIHByZXZpZXcgYHRoaXMuaW5wdXQgPSBmb29gIGluc2lkZVxuICAgICAgLy8gb25JbnB1dCBjYXVzaW5nIGluZmluaXRlIHJlY3Vyc2lvblxuICAgICAgdGhpcy5fX19zZXR0aW5nSW5wdXQgPSB0cnVlO1xuICAgICAgdXBkYXRlZElucHV0ID0gb25JbnB1dC5jYWxsKHRoaXMsIG5ld0lucHV0IHx8IHt9LCBvdXQpO1xuICAgICAgdGhpcy5fX19zZXR0aW5nSW5wdXQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZXdJbnB1dCA9IHRoaXMuX19fcmVuZGVySW5wdXQgPSB1cGRhdGVkSW5wdXQgfHwgbmV3SW5wdXQ7XG5cbiAgICBpZiAoKHRoaXMuX19fZGlydHkgPSBjaGVja0lucHV0Q2hhbmdlZCh0aGlzLCBvbGRJbnB1dCwgbmV3SW5wdXQpKSkge1xuICAgICAgdGhpcy5fX19xdWV1ZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9fX2lucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX19faW5wdXQgPSBuZXdJbnB1dDtcbiAgICAgIGlmIChuZXdJbnB1dCAmJiBuZXdJbnB1dC4kZ2xvYmFsKSB7XG4gICAgICAgIHRoaXMuX19fZ2xvYmFsID0gbmV3SW5wdXQuJGdsb2JhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3SW5wdXQ7XG4gIH0sXG5cbiAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9fX2RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9fX3F1ZXVlVXBkYXRlKCk7XG4gIH0sXG5cbiAgX19fcXVldWVVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX19fdXBkYXRlUXVldWVkKSB7XG4gICAgICB0aGlzLl9fX3VwZGF0ZVF1ZXVlZCA9IHRydWU7XG4gICAgICB1cGRhdGVNYW5hZ2VyLl9fX3F1ZXVlQ29tcG9uZW50VXBkYXRlKHRoaXMpO1xuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX19kZXN0cm95ZWQgPT09IHRydWUgfHwgdGhpcy5fX19pc0RpcnR5ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpbnB1dCA9IHRoaXMuX19faW5wdXQ7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmICh0aGlzLl9fX2RpcnR5ID09PSBmYWxzZSAmJiBzdGF0ZSAhPT0gbnVsbCAmJiBzdGF0ZS5fX19kaXJ0eSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKHByb2Nlc3NVcGRhdGVIYW5kbGVycyh0aGlzLCBzdGF0ZS5fX19jaGFuZ2VzLCBzdGF0ZS5fX19vbGQsIHN0YXRlKSkge1xuICAgICAgICBzdGF0ZS5fX19kaXJ0eSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9fX2lzRGlydHkgPT09IHRydWUpIHtcbiAgICAgIC8vIFRoZSBVSSBjb21wb25lbnQgaXMgc3RpbGwgZGlydHkgYWZ0ZXIgcHJvY2VzcyBzdGF0ZSBoYW5kbGVyc1xuICAgICAgLy8gdGhlbiB3ZSBzaG91bGQgcmVyZW5kZXJcblxuICAgICAgaWYgKHRoaXMuc2hvdWxkVXBkYXRlKGlucHV0LCBzdGF0ZSkgIT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX19fc2NoZWR1bGVSZXJlbmRlcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX19fcmVzZXQoKTtcbiAgfSxcblxuICBnZXQgX19faXNEaXJ0eSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fX19kaXJ0eSA9PT0gdHJ1ZSB8fFxuICAgICAgKHRoaXMuX19fc3RhdGUgIT09IG51bGwgJiYgdGhpcy5fX19zdGF0ZS5fX19kaXJ0eSA9PT0gdHJ1ZSlcbiAgICApO1xuICB9LFxuXG4gIF9fX3Jlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX19kaXJ0eSA9IGZhbHNlO1xuICAgIHRoaXMuX19fdXBkYXRlUXVldWVkID0gZmFsc2U7XG4gICAgdGhpcy5fX19yZW5kZXJJbnB1dCA9IG51bGw7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHN0YXRlLl9fX3Jlc2V0KCk7XG4gICAgfVxuICB9LFxuXG4gIHNob3VsZFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIF9fX3NjaGVkdWxlUmVyZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlbmRlcmVyID0gc2VsZi5fX19yZW5kZXJlcjtcblxuICAgIGlmICghcmVuZGVyZXIpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cblxuICAgIHZhciBpbnB1dCA9IHRoaXMuX19fcmVuZGVySW5wdXQgfHwgdGhpcy5fX19pbnB1dDtcblxuICAgIHVwZGF0ZU1hbmFnZXIuX19fYmF0Y2hVcGRhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fX19yZXJlbmRlcihpbnB1dCwgZmFsc2UpLmFmdGVySW5zZXJ0KHNlbGYuX19faG9zdCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9fX3Jlc2V0KCk7XG4gIH0sXG5cbiAgX19fcmVyZW5kZXI6IGZ1bmN0aW9uIChpbnB1dCwgaXNIeWRyYXRlKSB7XG4gICAgdmFyIGhvc3QgPSB0aGlzLl9fX2hvc3Q7XG4gICAgdmFyIGdsb2JhbERhdGEgPSB0aGlzLl9fX2dsb2JhbDtcbiAgICB2YXIgcm9vdE5vZGUgPSB0aGlzLl9fX3Jvb3ROb2RlO1xuICAgIHZhciByZW5kZXJlciA9IHRoaXMuX19fcmVuZGVyZXI7XG4gICAgdmFyIGNyZWF0ZU91dCA9IHJlbmRlcmVyLmNyZWF0ZU91dCB8fCBkZWZhdWx0Q3JlYXRlT3V0O1xuICAgIHZhciBvdXQgPSBjcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG4gICAgb3V0LnN5bmMoKTtcbiAgICBvdXQuX19faG9zdCA9IHRoaXMuX19faG9zdDtcbiAgICBvdXRbQ09OVEVYVF9LRVldID0gdGhpcy5fX19jb250ZXh0O1xuXG4gICAgdmFyIGNvbXBvbmVudHNDb250ZXh0ID0gZ2V0Q29tcG9uZW50c0NvbnRleHQob3V0KTtcbiAgICB2YXIgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSBjb21wb25lbnRzQ29udGV4dC5fX19nbG9iYWxDb250ZXh0O1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlcmVuZGVyQ29tcG9uZW50ID0gdGhpcztcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19pc0h5ZHJhdGUgPSBpc0h5ZHJhdGU7XG5cbiAgICByZW5kZXJlcihpbnB1dCwgb3V0KTtcblxuICAgIHZhciByZXN1bHQgPSBuZXcgUmVuZGVyUmVzdWx0KG91dCk7XG5cbiAgICB2YXIgdGFyZ2V0Tm9kZSA9IG91dC5fX19nZXRPdXRwdXQoKS5fX19maXJzdENoaWxkO1xuXG4gICAgbW9ycGhkb20ocm9vdE5vZGUsIHRhcmdldE5vZGUsIGhvc3QsIGNvbXBvbmVudHNDb250ZXh0KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgX19fZGV0YWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJvb3QgPSB0aGlzLl9fX3Jvb3ROb2RlO1xuICAgIHJvb3QucmVtb3ZlKCk7XG4gICAgcmV0dXJuIHJvb3Q7XG4gIH0sXG5cbiAgX19fcmVtb3ZlRE9NRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnRMaXN0ZW5lckhhbmRsZXMgPSB0aGlzLl9fX2RvbUV2ZW50TGlzdGVuZXJIYW5kbGVzO1xuICAgIGlmIChldmVudExpc3RlbmVySGFuZGxlcykge1xuICAgICAgZXZlbnRMaXN0ZW5lckhhbmRsZXMuZm9yRWFjaChyZW1vdmVMaXN0ZW5lcik7XG4gICAgICB0aGlzLl9fX2RvbUV2ZW50TGlzdGVuZXJIYW5kbGVzID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgZ2V0IF9fX3Jhd1N0YXRlKCkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgcmV0dXJuIHN0YXRlICYmIHN0YXRlLl9fX3JhdztcbiAgfSxcblxuICBfX19zZXRDdXN0b21FdmVudHM6IGZ1bmN0aW9uIChjdXN0b21FdmVudHMsIHNjb3BlKSB7XG4gICAgdmFyIGZpbmFsQ3VzdG9tRXZlbnRzID0gKHRoaXMuX19fY3VzdG9tRXZlbnRzID0ge30pO1xuICAgIHRoaXMuX19fc2NvcGUgPSBzY29wZTtcblxuICAgIGN1c3RvbUV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjdXN0b21FdmVudCkge1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IGN1c3RvbUV2ZW50WzBdO1xuICAgICAgdmFyIHRhcmdldE1ldGhvZE5hbWUgPSBjdXN0b21FdmVudFsxXTtcbiAgICAgIHZhciBpc09uY2UgPSBjdXN0b21FdmVudFsyXTtcbiAgICAgIHZhciBleHRyYUFyZ3MgPSBjdXN0b21FdmVudFszXTtcblxuICAgICAgaWYgKHRhcmdldE1ldGhvZE5hbWUpIHtcbiAgICAgICAgZmluYWxDdXN0b21FdmVudHNbZXZlbnRUeXBlXSA9IFt0YXJnZXRNZXRob2ROYW1lLCBpc09uY2UsIGV4dHJhQXJnc107XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB3YWxrRnJhZ21lbnRzKHRoaXMuX19fcm9vdE5vZGUpO1xuICB9LFxuXG4gIGdldCBlbHMoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICAnVGhlIFwidGhpcy5lbHNcIiBhdHRyaWJ1dGUgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBcInRoaXMuZ2V0RWxzKGtleSlcIiBpbnN0ZWFkLicsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMuX19fcm9vdE5vZGUgPyB0aGlzLl9fX3Jvb3ROb2RlLm5vZGVzIDogW10pLmZpbHRlcihcbiAgICAgIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSxcblxuICBfX19lbWl0OiBlbWl0LFxuICBfX19lbWl0Q3JlYXRlKGlucHV0LCBvdXQpIHtcbiAgICB0aGlzLm9uQ3JlYXRlICYmIHRoaXMub25DcmVhdGUoaW5wdXQsIG91dCk7XG4gICAgdGhpcy5fX19lbWl0KFwiY3JlYXRlXCIsIGlucHV0LCBvdXQpO1xuICB9LFxuXG4gIF9fX2VtaXRSZW5kZXIob3V0KSB7XG4gICAgdGhpcy5vblJlbmRlciAmJiB0aGlzLm9uUmVuZGVyKG91dCk7XG4gICAgdGhpcy5fX19lbWl0KFwicmVuZGVyXCIsIG91dCk7XG4gIH0sXG5cbiAgX19fZW1pdFVwZGF0ZSgpIHtcbiAgICB0aGlzLm9uVXBkYXRlICYmIHRoaXMub25VcGRhdGUoKTtcbiAgICB0aGlzLl9fX2VtaXQoXCJ1cGRhdGVcIik7XG4gIH0sXG5cbiAgX19fZW1pdE1vdW50KCkge1xuICAgIHRoaXMub25Nb3VudCAmJiB0aGlzLm9uTW91bnQoKTtcbiAgICB0aGlzLl9fX2VtaXQoXCJtb3VudFwiKTtcbiAgfSxcblxuICBfX19lbWl0RGVzdHJveSgpIHtcbiAgICB0aGlzLm9uRGVzdHJveSAmJiB0aGlzLm9uRGVzdHJveSgpO1xuICAgIHRoaXMuX19fZW1pdChcImRlc3Ryb3lcIik7XG4gIH0sXG59O1xuXG5jb21wb25lbnRQcm90by5lbElkID0gY29tcG9uZW50UHJvdG8uZ2V0RWxJZDtcbmNvbXBvbmVudFByb3RvLl9fX3VwZGF0ZSA9IGNvbXBvbmVudFByb3RvLnVwZGF0ZTtcbmNvbXBvbmVudFByb3RvLl9fX2Rlc3Ryb3kgPSBjb21wb25lbnRQcm90by5kZXN0cm95O1xuXG4vLyBBZGQgYWxsIG9mIHRoZSBmb2xsb3dpbmcgRE9NIG1ldGhvZHMgdG8gQ29tcG9uZW50LnByb3RvdHlwZTpcbi8vIC0gYXBwZW5kVG8ocmVmZXJlbmNlRWwpXG4vLyAtIHJlcGxhY2UocmVmZXJlbmNlRWwpXG4vLyAtIHJlcGxhY2VDaGlsZHJlbk9mKHJlZmVyZW5jZUVsKVxuLy8gLSBpbnNlcnRCZWZvcmUocmVmZXJlbmNlRWwpXG4vLyAtIGluc2VydEFmdGVyKHJlZmVyZW5jZUVsKVxuLy8gLSBwcmVwZW5kVG8ocmVmZXJlbmNlRWwpXG5kb21JbnNlcnQoXG4gIGNvbXBvbmVudFByb3RvLFxuICBmdW5jdGlvbiBnZXRFbChjb21wb25lbnQpIHtcbiAgICByZXR1cm4gY29tcG9uZW50Ll9fX2RldGFjaCgpO1xuICB9LFxuICBmdW5jdGlvbiBhZnRlckluc2VydChjb21wb25lbnQpIHtcbiAgICByZXR1cm4gY29tcG9uZW50O1xuICB9LFxuKTtcblxuaW5oZXJpdChDb21wb25lbnQsIEV2ZW50RW1pdHRlcik7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG52YXIgdzEwTm9vcCA9IHJlcXVpcmUoXCJ3YXJwMTAvY29uc3RhbnRzXCIpLk5PT1A7XG52YXIgY29tcG9uZW50VXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGF0dGFjaEJ1YmJsaW5nRXZlbnQgPSBjb21wb25lbnRVdGlsLl9fX2F0dGFjaEJ1YmJsaW5nRXZlbnQ7XG52YXIgYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyID1cbiAgcmVxdWlyZShcIi4vZXZlbnQtZGVsZWdhdGlvblwiKS5fX19hZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXI7XG52YXIgS2V5U2VxdWVuY2UgPSByZXF1aXJlKFwiLi9LZXlTZXF1ZW5jZVwiKTtcbnZhciBFTVBUWV9PQkpFQ1QgPSB7fTtcblxudmFyIEZMQUdfV0lMTF9SRVJFTkRFUl9JTl9CUk9XU0VSID0gMTtcbnZhciBGTEFHX0hBU19SRU5ERVJfQk9EWSA9IDI7XG52YXIgRkxBR19JU19MRUdBQ1kgPSA0O1xudmFyIEZMQUdfT0xEX0hZRFJBVEVfTk9fQ1JFQVRFID0gODtcblxuLyoqXG4gKiBBIENvbXBvbmVudERlZiBpcyB1c2VkIHRvIGhvbGQgdGhlIG1ldGFkYXRhIGNvbGxlY3RlZCBhdCBydW50aW1lIGZvclxuICogYSBzaW5nbGUgY29tcG9uZW50IGFuZCB0aGlzIGluZm9ybWF0aW9uIGlzIHVzZWQgdG8gaW5zdGFudGlhdGUgdGhlIGNvbXBvbmVudFxuICogbGF0ZXIgKGFmdGVyIHRoZSByZW5kZXJlZCBIVE1MIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBET00pXG4gKi9cbmZ1bmN0aW9uIENvbXBvbmVudERlZihjb21wb25lbnQsIGNvbXBvbmVudElkLCBjb21wb25lbnRzQ29udGV4dCkge1xuICB0aGlzLl9fX2NvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQ7IC8vIFRoZSBBc3luY1dyaXRlciB0aGF0IHRoaXMgY29tcG9uZW50IGlzIGFzc29jaWF0ZWQgd2l0aFxuICB0aGlzLl9fX2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgdGhpcy5pZCA9IGNvbXBvbmVudElkO1xuXG4gIHRoaXMuX19fZG9tRXZlbnRzID0gdW5kZWZpbmVkOyAvLyBBbiBhcnJheSBvZiBET00gZXZlbnRzIHRoYXQgbmVlZCB0byBiZSBhZGRlZCAoaW4gc2V0cyBvZiB0aHJlZSlcblxuICB0aGlzLl9fX2lzRXhpc3RpbmcgPSBmYWxzZTtcblxuICB0aGlzLl9fX3JlbmRlckJvdW5kYXJ5ID0gZmFsc2U7XG4gIHRoaXMuX19fZmxhZ3MgPSAwO1xuXG4gIHRoaXMuX19fbmV4dElkSW5kZXggPSAwOyAvLyBUaGUgdW5pcXVlIGludGVnZXIgdG8gdXNlIGZvciB0aGUgbmV4dCBzY29wZWQgSURcbiAgdGhpcy5fX19rZXlTZXF1ZW5jZSA9IG51bGw7XG59XG5cbkNvbXBvbmVudERlZi5wcm90b3R5cGUgPSB7XG4gIF9fX25leHRLZXk6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fX19rZXlTZXF1ZW5jZSB8fCAodGhpcy5fX19rZXlTZXF1ZW5jZSA9IG5ldyBLZXlTZXF1ZW5jZSgpKVxuICAgICkuX19fbmV4dEtleShrZXkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGlzIGhlbHBlciBtZXRob2QgZ2VuZXJhdGVzIGEgdW5pcXVlIGFuZCBmdWxseSBxdWFsaWZpZWQgRE9NIGVsZW1lbnQgSURcbiAgICogdGhhdCBpcyB1bmlxdWUgd2l0aGluIHRoZSBzY29wZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnQuXG4gICAqL1xuICBlbElkOiBmdW5jdGlvbiAobmVzdGVkSWQpIHtcbiAgICB2YXIgaWQgPSB0aGlzLmlkO1xuXG4gICAgaWYgKG5lc3RlZElkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBuZXN0ZWRJZCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgICBjb21wbGFpbihcIlVzaW5nIG5vbiBzdHJpbmdzIGFzIGtleXMgaXMgZGVwcmVjYXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBuZXN0ZWRJZCA9IFN0cmluZyhuZXN0ZWRJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXN0ZWRJZC5pbmRleE9mKFwiI1wiKSA9PT0gMCkge1xuICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgIG5lc3RlZElkID0gbmVzdGVkSWQuc3Vic3RyaW5nKDEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaWQgKyBcIi1cIiArIG5lc3RlZElkO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG5leHQgYXV0byBnZW5lcmF0ZWQgdW5pcXVlIElEIGZvciBhIG5lc3RlZCBET00gZWxlbWVudCBvciBuZXN0ZWQgRE9NIGNvbXBvbmVudFxuICAgKi9cbiAgX19fbmV4dENvbXBvbmVudElkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQgKyBcIi1jXCIgKyB0aGlzLl9fX25leHRJZEluZGV4Kys7XG4gIH0sXG5cbiAgZDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgaGFuZGxlck1ldGhvZE5hbWUsIGlzT25jZSwgZXh0cmFBcmdzKSB7XG4gICAgYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyKGV2ZW50TmFtZSk7XG4gICAgcmV0dXJuIGF0dGFjaEJ1YmJsaW5nRXZlbnQodGhpcywgaGFuZGxlck1ldGhvZE5hbWUsIGlzT25jZSwgZXh0cmFBcmdzKTtcbiAgfSxcblxuICBnZXQgX19fdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19jb21wb25lbnQuX19fdHlwZTtcbiAgfSxcbn07XG5cbkNvbXBvbmVudERlZi5wcm90b3R5cGUubmsgPSBDb21wb25lbnREZWYucHJvdG90eXBlLl9fX25leHRLZXk7XG5cbkNvbXBvbmVudERlZi5fX19kZXNlcmlhbGl6ZSA9IGZ1bmN0aW9uIChvLCB0eXBlcywgZ2xvYmFsLCByZWdpc3RyeSkge1xuICB2YXIgaWQgPSBvWzBdO1xuICB2YXIgdHlwZU5hbWUgPSB0eXBlc1tvWzFdXTtcbiAgdmFyIGlucHV0ID0gb1syXSB8fCBudWxsO1xuICB2YXIgZXh0cmEgPSBvWzNdIHx8IEVNUFRZX09CSkVDVDtcblxuICB2YXIgc3RhdGUgPSBleHRyYS5zO1xuICB2YXIgY29tcG9uZW50UHJvcHMgPSBleHRyYS53IHx8IEVNUFRZX09CSkVDVDtcbiAgdmFyIGZsYWdzID0gZXh0cmEuZjtcbiAgdmFyIGlzTGVnYWN5ID0gZmxhZ3MgJiBGTEFHX0lTX0xFR0FDWTtcbiAgdmFyIHJlbmRlckJvZHkgPSBmbGFncyAmIEZMQUdfSEFTX1JFTkRFUl9CT0RZID8gdzEwTm9vcCA6IGV4dHJhLnI7XG5cbiAgdmFyIGNvbXBvbmVudCA9XG4gICAgdHlwZU5hbWUgLyogbGVnYWN5ICovICYmXG4gICAgcmVnaXN0cnkuX19fY3JlYXRlQ29tcG9uZW50KHR5cGVOYW1lLCBpZCwgaXNMZWdhY3kpO1xuXG4gIC8vIFByZXZlbnQgbmV3bHkgY3JlYXRlZCBjb21wb25lbnQgZnJvbSBiZWluZyBxdWV1ZWQgZm9yIHVwZGF0ZSBzaW5jZSB3ZSBhcmVhXG4gIC8vIGp1c3QgYnVpbGRpbmcgaXQgZnJvbSB0aGUgc2VydmVyIGluZm9cbiAgY29tcG9uZW50Ll9fX3VwZGF0ZVF1ZXVlZCA9IHRydWU7XG5cbiAgaWYgKGlzTGVnYWN5KSB7XG4gICAgY29tcG9uZW50LndpZGdldENvbmZpZyA9IGNvbXBvbmVudFByb3BzO1xuICAgIGNvbXBvbmVudC5fX193aWRnZXRCb2R5ID0gcmVuZGVyQm9keTtcbiAgfSBlbHNlIGlmIChyZW5kZXJCb2R5KSB7XG4gICAgKGlucHV0IHx8IChpbnB1dCA9IHt9KSkucmVuZGVyQm9keSA9IHJlbmRlckJvZHk7XG4gIH1cblxuICBpZiAoXG4gICAgIWlzTGVnYWN5ICYmXG4gICAgZmxhZ3MgJiBGTEFHX1dJTExfUkVSRU5ERVJfSU5fQlJPV1NFUiAmJlxuICAgICEoZmxhZ3MgJiBGTEFHX09MRF9IWURSQVRFX05PX0NSRUFURSlcbiAgKSB7XG4gICAgaWYgKGNvbXBvbmVudC5vbkNyZWF0ZSkge1xuICAgICAgY29tcG9uZW50Lm9uQ3JlYXRlKGlucHV0LCB7IGdsb2JhbDogZ2xvYmFsIH0pO1xuICAgIH1cbiAgICBpZiAoY29tcG9uZW50Lm9uSW5wdXQpIHtcbiAgICAgIGlucHV0ID0gY29tcG9uZW50Lm9uSW5wdXQoaW5wdXQsIHsgZ2xvYmFsOiBnbG9iYWwgfSkgfHwgaW5wdXQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChzdGF0ZSkge1xuICAgICAgdmFyIHVuZGVmaW5lZFByb3BOYW1lcyA9IGV4dHJhLnU7XG4gICAgICBpZiAodW5kZWZpbmVkUHJvcE5hbWVzKSB7XG4gICAgICAgIHVuZGVmaW5lZFByb3BOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uICh1bmRlZmluZWRQcm9wTmFtZSkge1xuICAgICAgICAgIHN0YXRlW3VuZGVmaW5lZFByb3BOYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBXZSBnbyB0aHJvdWdoIHRoZSBzZXR0ZXIgaGVyZSBzbyB0aGF0IHdlIGNvbnZlcnQgdGhlIHN0YXRlIG9iamVjdFxuICAgICAgLy8gdG8gYW4gaW5zdGFuY2Ugb2YgYFN0YXRlYFxuICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKCFpc0xlZ2FjeSAmJiBjb21wb25lbnRQcm9wcykge1xuICAgICAgZXh0ZW5kKGNvbXBvbmVudCwgY29tcG9uZW50UHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudC5fX19pbnB1dCA9IGlucHV0O1xuXG4gIGlmIChleHRyYS5iKSB7XG4gICAgY29tcG9uZW50Ll9fX2J1YmJsaW5nRG9tRXZlbnRzID0gZXh0cmEuYjtcbiAgfVxuXG4gIHZhciBzY29wZSA9IGV4dHJhLnA7XG4gIHZhciBjdXN0b21FdmVudHMgPSBleHRyYS5lO1xuICBpZiAoY3VzdG9tRXZlbnRzKSB7XG4gICAgY29tcG9uZW50Ll9fX3NldEN1c3RvbUV2ZW50cyhjdXN0b21FdmVudHMsIHNjb3BlKTtcbiAgfVxuXG4gIGNvbXBvbmVudC5fX19nbG9iYWwgPSBnbG9iYWw7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogaWQsXG4gICAgX19fY29tcG9uZW50OiBjb21wb25lbnQsXG4gICAgX19fZG9tRXZlbnRzOiBleHRyYS5kLFxuICAgIF9fX2ZsYWdzOiBleHRyYS5mIHx8IDAsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudERlZjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gcmVxdWlyZShcIi4vR2xvYmFsQ29tcG9uZW50c0NvbnRleHRcIik7XG5cbmZ1bmN0aW9uIENvbXBvbmVudHNDb250ZXh0KG91dCwgcGFyZW50Q29tcG9uZW50c0NvbnRleHQpIHtcbiAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0O1xuICB2YXIgY29tcG9uZW50RGVmO1xuXG4gIGlmIChwYXJlbnRDb21wb25lbnRzQ29udGV4dCkge1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcbiAgICBjb21wb25lbnREZWYgPSBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWY7XG5cbiAgICB2YXIgbmVzdGVkQ29udGV4dHNGb3JQYXJlbnQ7XG4gICAgaWYgKFxuICAgICAgIShuZXN0ZWRDb250ZXh0c0ZvclBhcmVudCA9IHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX25lc3RlZENvbnRleHRzKVxuICAgICkge1xuICAgICAgbmVzdGVkQ29udGV4dHNGb3JQYXJlbnQgPSBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19uZXN0ZWRDb250ZXh0cyA9IFtdO1xuICAgIH1cblxuICAgIG5lc3RlZENvbnRleHRzRm9yUGFyZW50LnB1c2godGhpcyk7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSBvdXQuZ2xvYmFsLl9fX2NvbXBvbmVudHM7XG4gICAgaWYgKGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG91dC5nbG9iYWwuX19fY29tcG9uZW50cyA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID1cbiAgICAgICAgbmV3IEdsb2JhbENvbXBvbmVudHNDb250ZXh0KG91dCk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fX19nbG9iYWxDb250ZXh0ID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQ7XG4gIHRoaXMuX19fY29tcG9uZW50cyA9IFtdO1xuICB0aGlzLl9fX291dCA9IG91dDtcbiAgdGhpcy5fX19jb21wb25lbnREZWYgPSBjb21wb25lbnREZWY7XG4gIHRoaXMuX19fbmVzdGVkQ29udGV4dHMgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19faXNQcmVzZXJ2ZWQgPVxuICAgIHBhcmVudENvbXBvbmVudHNDb250ZXh0ICYmIHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX2lzUHJlc2VydmVkO1xufVxuXG5Db21wb25lbnRzQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gIF9fX2luaXRDb21wb25lbnRzOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBjb21wb25lbnREZWZzID0gdGhpcy5fX19jb21wb25lbnRzO1xuXG4gICAgQ29tcG9uZW50c0NvbnRleHQuX19faW5pdENsaWVudFJlbmRlcmVkKGNvbXBvbmVudERlZnMsIGhvc3QpO1xuXG4gICAgdGhpcy5fX19vdXQuZW1pdChcIl9fX2NvbXBvbmVudHNJbml0aWFsaXplZFwiKTtcblxuICAgIC8vIFJlc2V0IHRoaW5ncyBzdG9yZWQgaW4gZ2xvYmFsIHNpbmNlIGdsb2JhbCBpcyByZXRhaW5lZCBmb3JcbiAgICAvLyBmdXR1cmUgcmVuZGVyc1xuICAgIHRoaXMuX19fb3V0Lmdsb2JhbC5fX19jb21wb25lbnRzID0gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGNvbXBvbmVudERlZnM7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRzQ29udGV4dChvdXQpIHtcbiAgcmV0dXJuIG91dC5fX19jb21wb25lbnRzIHx8IChvdXQuX19fY29tcG9uZW50cyA9IG5ldyBDb21wb25lbnRzQ29udGV4dChvdXQpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gQ29tcG9uZW50c0NvbnRleHQ7XG5cbmV4cG9ydHMuX19fZ2V0Q29tcG9uZW50c0NvbnRleHQgPSBnZXRDb21wb25lbnRzQ29udGV4dDtcbiIsInZhciBuZXh0Q29tcG9uZW50SWRQcm92aWRlciA9XG4gIHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpLl9fX25leHRDb21wb25lbnRJZFByb3ZpZGVyO1xuXG5mdW5jdGlvbiBHbG9iYWxDb21wb25lbnRzQ29udGV4dChvdXQpIHtcbiAgdGhpcy5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkID0ge307XG4gIHRoaXMuX19fcmVyZW5kZXJDb21wb25lbnQgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19fbmV4dENvbXBvbmVudElkID0gbmV4dENvbXBvbmVudElkUHJvdmlkZXIob3V0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHbG9iYWxDb21wb25lbnRzQ29udGV4dDtcbiIsImZ1bmN0aW9uIEtleVNlcXVlbmNlKCkge1xuICB0aGlzLl9fX2xvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbktleVNlcXVlbmNlLnByb3RvdHlwZS5fX19uZXh0S2V5ID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgbG9va3VwID0gdGhpcy5fX19sb29rdXA7XG5cbiAgaWYgKGxvb2t1cFtrZXldKSB7XG4gICAgcmV0dXJuIGtleSArIFwiX1wiICsgbG9va3VwW2tleV0rKztcbiAgfVxuXG4gIGxvb2t1cFtrZXldID0gMTtcbiAgcmV0dXJuIGtleTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5U2VxdWVuY2U7XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcblxuZnVuY3Rpb24gZW5zdXJlKHN0YXRlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgdmFyIHByb3RvID0gc3RhdGUuY29uc3RydWN0b3IucHJvdG90eXBlO1xuICBpZiAoIShwcm9wZXJ0eU5hbWUgaW4gcHJvdG8pKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX19yYXdbcHJvcGVydHlOYW1lXTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fX3NldChwcm9wZXJ0eU5hbWUsIHZhbHVlLCBmYWxzZSAvKiBlbnN1cmU6ZmFsc2UgKi8pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBTdGF0ZShjb21wb25lbnQpIHtcbiAgdGhpcy5fX19jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gIHRoaXMuX19fcmF3ID0ge307XG5cbiAgdGhpcy5fX19kaXJ0eSA9IGZhbHNlO1xuICB0aGlzLl9fX29sZCA9IG51bGw7XG4gIHRoaXMuX19fY2hhbmdlcyA9IG51bGw7XG4gIHRoaXMuX19fZm9yY2VkID0gbnVsbDsgLy8gQW4gb2JqZWN0IHRoYXQgd2UgdXNlIHRvIGtlZXAgdHJhY2tpbmcgb2Ygc3RhdGUgcHJvcGVydGllcyB0aGF0IHdlcmUgZm9yY2VkIHRvIGJlIGRpcnR5XG5cbiAgT2JqZWN0LnNlYWwodGhpcyk7XG59XG5cblN0YXRlLnByb3RvdHlwZSA9IHtcbiAgX19fcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLl9fX2RpcnR5ID0gZmFsc2U7XG4gICAgc2VsZi5fX19vbGQgPSBudWxsO1xuICAgIHNlbGYuX19fY2hhbmdlcyA9IG51bGw7XG4gICAgc2VsZi5fX19mb3JjZWQgPSBudWxsO1xuICB9LFxuXG4gIF9fX3JlcGxhY2U6IGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXM7XG4gICAgdmFyIGtleTtcblxuICAgIHZhciByYXdTdGF0ZSA9IHRoaXMuX19fcmF3O1xuXG4gICAgZm9yIChrZXkgaW4gcmF3U3RhdGUpIHtcbiAgICAgIGlmICghKGtleSBpbiBuZXdTdGF0ZSkpIHtcbiAgICAgICAgc3RhdGUuX19fc2V0KFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgZmFsc2UgLyogZW5zdXJlOmZhbHNlICovLFxuICAgICAgICAgIGZhbHNlIC8qIGZvcmNlRGlydHk6ZmFsc2UgKi8sXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gbmV3U3RhdGUpIHtcbiAgICAgIHN0YXRlLl9fX3NldChcbiAgICAgICAga2V5LFxuICAgICAgICBuZXdTdGF0ZVtrZXldLFxuICAgICAgICB0cnVlIC8qIGVuc3VyZTp0cnVlICovLFxuICAgICAgICBmYWxzZSAvKiBmb3JjZURpcnR5OmZhbHNlICovLFxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIF9fX3NldDogZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCBzaG91bGRFbnN1cmUsIGZvcmNlRGlydHkpIHtcbiAgICB2YXIgcmF3U3RhdGUgPSB0aGlzLl9fX3JhdztcblxuICAgIGlmIChzaG91bGRFbnN1cmUpIHtcbiAgICAgIGVuc3VyZSh0aGlzLCBuYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoZm9yY2VEaXJ0eSkge1xuICAgICAgdmFyIGZvcmNlZERpcnR5U3RhdGUgPSB0aGlzLl9fX2ZvcmNlZCB8fCAodGhpcy5fX19mb3JjZWQgPSB7fSk7XG4gICAgICBmb3JjZWREaXJ0eVN0YXRlW25hbWVdID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHJhd1N0YXRlW25hbWVdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fX19kaXJ0eSkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgdGltZSB3ZSBhcmUgbW9kaWZ5aW5nIHRoZSBjb21wb25lbnQgc3RhdGVcbiAgICAgIC8vIHNvIGludHJvZHVjZSBzb21lIHByb3BlcnRpZXMgdG8gZG8gc29tZSB0cmFja2luZyBvZlxuICAgICAgLy8gY2hhbmdlcyB0byB0aGUgc3RhdGVcbiAgICAgIHRoaXMuX19fZGlydHkgPSB0cnVlOyAvLyBNYXJrIHRoZSBjb21wb25lbnQgc3RhdGUgYXMgZGlydHkgKGkuZS4gbW9kaWZpZWQpXG4gICAgICB0aGlzLl9fX29sZCA9IHJhd1N0YXRlO1xuICAgICAgdGhpcy5fX19yYXcgPSByYXdTdGF0ZSA9IGV4dGVuZCh7fSwgcmF3U3RhdGUpO1xuICAgICAgdGhpcy5fX19jaGFuZ2VzID0ge307XG4gICAgICB0aGlzLl9fX2NvbXBvbmVudC5fX19xdWV1ZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX19fY2hhbmdlc1tuYW1lXSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIERvbid0IHN0b3JlIHN0YXRlIHByb3BlcnRpZXMgd2l0aCBhbiB1bmRlZmluZWQgb3IgbnVsbCB2YWx1ZVxuICAgICAgZGVsZXRlIHJhd1N0YXRlW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIHN0b3JlIHRoZSBuZXcgdmFsdWUgaW4gdGhlIGNvbXBvbmVudCBzdGF0ZVxuICAgICAgcmF3U3RhdGVbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3JhdztcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cblxudmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vQ29tcG9uZW50XCIpO1xudmFyIEJhc2VTdGF0ZSA9IHJlcXVpcmUoXCIuL1N0YXRlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZUNvbXBvbmVudChkZWYsIHJlbmRlcmVyKSB7XG4gIGlmIChkZWYuX19faXNDb21wb25lbnQpIHtcbiAgICByZXR1cm4gZGVmO1xuICB9XG5cbiAgdmFyIENvbXBvbmVudENsYXNzID0gZnVuY3Rpb24gKCkge307XG4gIHZhciBwcm90bztcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBkZWY7XG5cbiAgaWYgKHR5cGUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcHJvdG8gPSBkZWYucHJvdG90eXBlO1xuICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJvYmplY3RcIikge1xuICAgIHByb3RvID0gZGVmO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvcigpO1xuICB9XG5cbiAgQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlID0gcHJvdG87XG5cbiAgLy8gV2UgZG9uJ3QgdXNlIHRoZSBjb25zdHJ1Y3RvciBwcm92aWRlZCBieSB0aGUgdXNlclxuICAvLyBzaW5jZSB3ZSBkb24ndCBpbnZva2UgdGhlaXIgY29uc3RydWN0b3IgdW50aWxcbiAgLy8gd2UgaGF2ZSBoYWQgYSBjaGFuY2UgdG8gZG8gb3VyIG93biBpbml0aWFsaXphdGlvbi5cbiAgLy8gSW5zdGVhZCwgd2Ugc3RvcmUgdGhlaXIgY29uc3RydWN0b3IgaW4gdGhlIFwiaW5pdENvbXBvbmVudFwiXG4gIC8vIHByb3BlcnR5IGFuZCB0aGF0IG1ldGhvZCBnZXRzIGNhbGxlZCBsYXRlciBpbnNpZGVcbiAgLy8gaW5pdC1jb21wb25lbnRzLWJyb3dzZXIuanNcbiAgZnVuY3Rpb24gQ29tcG9uZW50KGlkKSB7XG4gICAgQmFzZUNvbXBvbmVudC5jYWxsKHRoaXMsIGlkKTtcbiAgfVxuXG4gIGlmICghcHJvdG8uX19faXNDb21wb25lbnQpIHtcbiAgICAvLyBJbmhlcml0IGZyb20gQ29tcG9uZW50IGlmIHRoZXkgZGlkbid0IGFscmVhZHlcbiAgICBpbmhlcml0KENvbXBvbmVudENsYXNzLCBCYXNlQ29tcG9uZW50KTtcbiAgfVxuXG4gIC8vIFRoZSBzYW1lIHByb3RvdHlwZSB3aWxsIGJlIHVzZWQgYnkgb3VyIGNvbnN0cnVjdG9yIGFmdGVyXG4gIC8vIHdlIGhlIGhhdmUgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4gdXNpbmcgdGhlIGluaGVyaXQgZnVuY3Rpb25cbiAgcHJvdG8gPSBDb21wb25lbnQucHJvdG90eXBlID0gQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlO1xuXG4gIC8vIHByb3RvLmNvbnN0cnVjdG9yID0gZGVmLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50O1xuXG4gIC8vIFNldCBhIGZsYWcgb24gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIG1ha2UgaXQgY2xlYXIgdGhpcyBpc1xuICAvLyBhIGNvbXBvbmVudCBzbyB0aGF0IHdlIGNhbiBzaG9ydC1jaXJjdWl0IHRoaXMgd29yayBsYXRlclxuICBDb21wb25lbnQuX19faXNDb21wb25lbnQgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIFN0YXRlKGNvbXBvbmVudCkge1xuICAgIEJhc2VTdGF0ZS5jYWxsKHRoaXMsIGNvbXBvbmVudCk7XG4gIH1cbiAgaW5oZXJpdChTdGF0ZSwgQmFzZVN0YXRlKTtcbiAgcHJvdG8uX19fU3RhdGUgPSBTdGF0ZTtcbiAgcHJvdG8uX19fcmVuZGVyZXIgPSByZW5kZXJlcjtcblxuICByZXR1cm4gQ29tcG9uZW50O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBfX192UHJvcHNCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX3ZFbGVtZW50QnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19jb21wb25lbnRCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX2RldGFjaGVkQnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19rZXlCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX3NzcktleWVkRWxlbWVudHNCeUNvbXBvbmVudElkOiB7fSxcbn07XG4iLCJ2YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBydW50aW1lSWQgPSBjb21wb25lbnRzVXRpbC5fX19ydW50aW1lSWQ7XG52YXIgY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xudmFyIGdldE1hcmtvUHJvcHNGcm9tRWwgPSBjb21wb25lbnRzVXRpbC5fX19nZXRNYXJrb1Byb3BzRnJvbUVsO1xuXG52YXIgVEVYVF9OT0RFID0gMztcblxuLy8gV2UgbWFrZSBvdXIgYmVzdCBlZmZvcnQgdG8gYWxsb3cgbXVsdGlwbGUgbWFya28gcnVudGltZXMgdG8gYmUgbG9hZGVkIGluIHRoZVxuLy8gc2FtZSB3aW5kb3cuIEVhY2ggbWFya28gcnVudGltZSB3aWxsIGdldCBpdHMgb3duIHVuaXF1ZSBydW50aW1lIElELlxudmFyIGxpc3RlbmVyc0F0dGFjaGVkS2V5ID0gXCIkTURFXCIgKyBydW50aW1lSWQ7XG52YXIgZGVsZWdhdGVkRXZlbnRzID0ge307XG5cbmZ1bmN0aW9uIGdldEV2ZW50RnJvbUVsKGVsLCBldmVudE5hbWUpIHtcbiAgdmFyIHZpcnR1YWxQcm9wcyA9IGdldE1hcmtvUHJvcHNGcm9tRWwoZWwpO1xuICB2YXIgZXZlbnRJbmZvID0gdmlydHVhbFByb3BzW2V2ZW50TmFtZV07XG5cbiAgaWYgKHR5cGVvZiBldmVudEluZm8gPT09IFwic3RyaW5nXCIpIHtcbiAgICBldmVudEluZm8gPSBldmVudEluZm8uc3BsaXQoXCIgXCIpO1xuICAgIGlmIChldmVudEluZm9bMl0pIHtcbiAgICAgIGV2ZW50SW5mb1syXSA9IGV2ZW50SW5mb1syXSA9PT0gXCJ0cnVlXCI7XG4gICAgfVxuICAgIGlmIChldmVudEluZm8ubGVuZ3RoID09IDQpIHtcbiAgICAgIGV2ZW50SW5mb1szXSA9IHBhcnNlSW50KGV2ZW50SW5mb1szXSwgMTApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBldmVudEluZm87XG59XG5cbmZ1bmN0aW9uIGRlbGVnYXRlRXZlbnQobm9kZSwgZXZlbnROYW1lLCB0YXJnZXQsIGV2ZW50KSB7XG4gIHZhciB0YXJnZXRNZXRob2QgPSB0YXJnZXRbMF07XG4gIHZhciB0YXJnZXRDb21wb25lbnRJZCA9IHRhcmdldFsxXTtcbiAgdmFyIGlzT25jZSA9IHRhcmdldFsyXTtcbiAgdmFyIGV4dHJhQXJncyA9IHRhcmdldFszXTtcblxuICBpZiAoaXNPbmNlKSB7XG4gICAgdmFyIHZpcnR1YWxQcm9wcyA9IGdldE1hcmtvUHJvcHNGcm9tRWwobm9kZSk7XG4gICAgZGVsZXRlIHZpcnR1YWxQcm9wc1tldmVudE5hbWVdO1xuICB9XG5cbiAgdmFyIHRhcmdldENvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFt0YXJnZXRDb21wb25lbnRJZF07XG5cbiAgaWYgKCF0YXJnZXRDb21wb25lbnQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdGFyZ2V0RnVuYyA9XG4gICAgdHlwZW9mIHRhcmdldE1ldGhvZCA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHRhcmdldE1ldGhvZFxuICAgICAgOiB0YXJnZXRDb21wb25lbnRbdGFyZ2V0TWV0aG9kXTtcbiAgaWYgKCF0YXJnZXRGdW5jKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJNZXRob2Qgbm90IGZvdW5kOiBcIiArIHRhcmdldE1ldGhvZCk7XG4gIH1cblxuICBpZiAoZXh0cmFBcmdzICE9IG51bGwpIHtcbiAgICBpZiAodHlwZW9mIGV4dHJhQXJncyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZXh0cmFBcmdzID0gdGFyZ2V0Q29tcG9uZW50Ll9fX2J1YmJsaW5nRG9tRXZlbnRzW2V4dHJhQXJnc107XG4gICAgfVxuICB9XG5cbiAgLy8gSW52b2tlIHRoZSBjb21wb25lbnQgbWV0aG9kXG4gIGlmIChleHRyYUFyZ3MpIHtcbiAgICB0YXJnZXRGdW5jLmFwcGx5KHRhcmdldENvbXBvbmVudCwgZXh0cmFBcmdzLmNvbmNhdChldmVudCwgbm9kZSkpO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldEZ1bmMuY2FsbCh0YXJnZXRDb21wb25lbnQsIGV2ZW50LCBub2RlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIoZXZlbnRUeXBlKSB7XG4gIGlmICghZGVsZWdhdGVkRXZlbnRzW2V2ZW50VHlwZV0pIHtcbiAgICBkZWxlZ2F0ZWRFdmVudHNbZXZlbnRUeXBlXSA9IHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyVG9Ib3N0KGV2ZW50VHlwZSwgaG9zdCkge1xuICB2YXIgbGlzdGVuZXJzID0gKGhvc3RbbGlzdGVuZXJzQXR0YWNoZWRLZXldID1cbiAgICBob3N0W2xpc3RlbmVyc0F0dGFjaGVkS2V5XSB8fCB7fSk7XG4gIGlmICghbGlzdGVuZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAoaG9zdC5ib2R5IHx8IGhvc3QpLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBldmVudFR5cGUsXG4gICAgICAobGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGN1ck5vZGUgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmICghY3VyTm9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ck5vZGUgPVxuICAgICAgICAgIC8vIGV2ZW50LnRhcmdldCBvZiBhbiBTVkdFbGVtZW50SW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBhXG4gICAgICAgICAgLy8gYGdldEF0dHJpYnV0ZWAgZnVuY3Rpb24gaW4gSUUgMTEuXG4gICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrby1qcy9tYXJrby9pc3N1ZXMvNzk2XG4gICAgICAgICAgY3VyTm9kZS5jb3JyZXNwb25kaW5nVXNlRWxlbWVudCB8fFxuICAgICAgICAgIC8vIGluIHNvbWUgYnJvd3NlcnMgdGhlIGV2ZW50IHRhcmdldCBjYW4gYmUgYSB0ZXh0IG5vZGVcbiAgICAgICAgICAvLyBvbmUgZXhhbXBsZSBiZWluZyBkcmFnZW50ZXIgaW4gZmlyZWZveC5cbiAgICAgICAgICAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gVEVYVF9OT0RFID8gY3VyTm9kZS5wYXJlbnROb2RlIDogY3VyTm9kZSk7XG5cbiAgICAgICAgLy8gU2VhcmNoIHVwIHRoZSB0cmVlIGxvb2tpbmcgRE9NIGV2ZW50cyBtYXBwZWQgdG8gdGFyZ2V0XG4gICAgICAgIC8vIGNvbXBvbmVudCBtZXRob2RzXG4gICAgICAgIHZhciBwcm9wTmFtZSA9IFwib25cIiArIGV2ZW50VHlwZTtcbiAgICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgICAvLyBBdHRyaWJ1dGVzIHdpbGwgaGF2ZSB0aGUgZm9sbG93aW5nIGZvcm06XG4gICAgICAgIC8vIG9uPGV2ZW50X3R5cGU+KFwiPHRhcmdldF9tZXRob2Q+fDxjb21wb25lbnRfaWQ+XCIpXG5cbiAgICAgICAgaWYgKGV2ZW50LmJ1YmJsZXMpIHtcbiAgICAgICAgICB2YXIgcHJvcGFnYXRpb25TdG9wcGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAvLyBNb25rZXktcGF0Y2ggdG8gZml4ICM5N1xuICAgICAgICAgIHZhciBvbGRTdG9wUHJvcGFnYXRpb24gPSBldmVudC5zdG9wUHJvcGFnYXRpb247XG5cbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvbGRTdG9wUHJvcGFnYXRpb24uY2FsbChldmVudCk7XG4gICAgICAgICAgICBwcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoKHRhcmdldCA9IGdldEV2ZW50RnJvbUVsKGN1ck5vZGUsIHByb3BOYW1lKSkpIHtcbiAgICAgICAgICAgICAgZGVsZWdhdGVFdmVudChjdXJOb2RlLCBwcm9wTmFtZSwgdGFyZ2V0LCBldmVudCk7XG5cbiAgICAgICAgICAgICAgaWYgKHByb3BhZ2F0aW9uU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSB3aGlsZSAoKGN1ck5vZGUgPSBjdXJOb2RlLnBhcmVudE5vZGUpICYmIGN1ck5vZGUuZ2V0QXR0cmlidXRlKTtcbiAgICAgICAgfSBlbHNlIGlmICgodGFyZ2V0ID0gZ2V0RXZlbnRGcm9tRWwoY3VyTm9kZSwgcHJvcE5hbWUpKSkge1xuICAgICAgICAgIGRlbGVnYXRlRXZlbnQoY3VyTm9kZSwgcHJvcE5hbWUsIHRhcmdldCwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRydWUsXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuZXhwb3J0cy5fX19oYW5kbGVOb2RlQXR0YWNoID0gbm9vcDtcbmV4cG9ydHMuX19faGFuZGxlTm9kZURldGFjaCA9IG5vb3A7XG5leHBvcnRzLl9fX2RlbGVnYXRlRXZlbnQgPSBkZWxlZ2F0ZUV2ZW50O1xuZXhwb3J0cy5fX19nZXRFdmVudEZyb21FbCA9IGdldEV2ZW50RnJvbUVsO1xuZXhwb3J0cy5fX19hZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIgPSBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXI7XG5leHBvcnRzLl9fX2luaXQgPSBmdW5jdGlvbiAoaG9zdCkge1xuICBPYmplY3Qua2V5cyhkZWxlZ2F0ZWRFdmVudHMpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50VHlwZSkge1xuICAgIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlclRvSG9zdChldmVudFR5cGUsIGhvc3QpO1xuICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy1yZWdpc3RyeVwiKTtcbiIsInZhciBjb3B5UHJvcHMgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvY29weVByb3BzXCIpO1xudmFyIGJlZ2luQ29tcG9uZW50ID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLWJlZ2luQ29tcG9uZW50XCIpO1xudmFyIGVuZENvbXBvbmVudCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy1lbmRDb21wb25lbnRcIik7XG52YXIgcmVnaXN0cnkgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtcmVnaXN0cnlcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBjb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG5cbnZhciBDb21wb25lbnRzQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbXBvbmVudHNDb250ZXh0XCIpO1xudmFyIGdldENvbXBvbmVudHNDb250ZXh0ID0gQ29tcG9uZW50c0NvbnRleHQuX19fZ2V0Q29tcG9uZW50c0NvbnRleHQ7XG52YXIgaXNTZXJ2ZXIgPSBjb21wb25lbnRzVXRpbC5fX19pc1NlcnZlciA9PT0gdHJ1ZTtcblxudmFyIENPTVBPTkVOVF9CRUdJTl9BU1lOQ19BRERFRF9LRVkgPSBcIiR3YVwiO1xuXG5mdW5jdGlvbiByZXNvbHZlQ29tcG9uZW50S2V5KGtleSwgcGFyZW50Q29tcG9uZW50RGVmKSB7XG4gIGlmIChrZXlbMF0gPT09IFwiI1wiKSB7XG4gICAgcmV0dXJuIGtleS5zdWJzdHJpbmcoMSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhcmVudENvbXBvbmVudERlZi5pZCArIFwiLVwiICsgcGFyZW50Q29tcG9uZW50RGVmLl9fX25leHRLZXkoa2V5KTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFja0FzeW5jQ29tcG9uZW50cyhvdXQpIHtcbiAgaWYgKG91dC5pc1N5bmMoKSB8fCBvdXQuZ2xvYmFsW0NPTVBPTkVOVF9CRUdJTl9BU1lOQ19BRERFRF9LRVldKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb3V0Lm9uKFwiYmVnaW5Bc3luY1wiLCBoYW5kbGVCZWdpbkFzeW5jKTtcbiAgb3V0Lm9uKFwiYmVnaW5EZXRhY2hlZEFzeW5jXCIsIGhhbmRsZUJlZ2luRGV0YWNoZWRBc3luYyk7XG4gIG91dC5nbG9iYWxbQ09NUE9ORU5UX0JFR0lOX0FTWU5DX0FEREVEX0tFWV0gPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVCZWdpbkFzeW5jKGV2ZW50KSB7XG4gIHZhciBwYXJlbnRPdXQgPSBldmVudC5wYXJlbnRPdXQ7XG4gIHZhciBhc3luY091dCA9IGV2ZW50Lm91dDtcbiAgdmFyIGNvbXBvbmVudHNDb250ZXh0ID0gcGFyZW50T3V0Ll9fX2NvbXBvbmVudHM7XG5cbiAgaWYgKGNvbXBvbmVudHNDb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBXZSBhcmUgZ29pbmcgdG8gc3RhcnQgYSBuZXN0ZWQgQ29tcG9uZW50c0NvbnRleHRcbiAgICBhc3luY091dC5fX19jb21wb25lbnRzID0gbmV3IENvbXBvbmVudHNDb250ZXh0KGFzeW5jT3V0LCBjb21wb25lbnRzQ29udGV4dCk7XG4gIH1cbiAgLy8gQ2FycnkgYWxvbmcgdGhlIGNvbXBvbmVudCBhcmd1bWVudHNcbiAgYXN5bmNPdXQuYyhcbiAgICBwYXJlbnRPdXQuX19fYXNzaWduZWRDb21wb25lbnREZWYsXG4gICAgcGFyZW50T3V0Ll9fX2Fzc2lnbmVkS2V5LFxuICAgIHBhcmVudE91dC5fX19hc3NpZ25lZEN1c3RvbUV2ZW50cyxcbiAgKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQmVnaW5EZXRhY2hlZEFzeW5jKGV2ZW50KSB7XG4gIHZhciBhc3luY091dCA9IGV2ZW50Lm91dDtcbiAgaGFuZGxlQmVnaW5Bc3luYyhldmVudCk7XG4gIGFzeW5jT3V0Lm9uKFwiYmVnaW5Bc3luY1wiLCBoYW5kbGVCZWdpbkFzeW5jKTtcbiAgYXN5bmNPdXQub24oXCJiZWdpbkRldGFjaGVkQXN5bmNcIiwgaGFuZGxlQmVnaW5EZXRhY2hlZEFzeW5jKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUmVuZGVyZXJGdW5jKFxuICB0ZW1wbGF0ZVJlbmRlckZ1bmMsXG4gIGNvbXBvbmVudFByb3BzLFxuICByZW5kZXJpbmdMb2dpYyxcbikge1xuICB2YXIgb25JbnB1dCA9IHJlbmRlcmluZ0xvZ2ljICYmIHJlbmRlcmluZ0xvZ2ljLm9uSW5wdXQ7XG4gIHZhciB0eXBlTmFtZSA9IGNvbXBvbmVudFByb3BzLnQ7XG4gIHZhciBpc1NwbGl0ID0gY29tcG9uZW50UHJvcHMucyA9PT0gdHJ1ZTtcbiAgdmFyIGlzSW1wbGljaXRDb21wb25lbnQgPSBjb21wb25lbnRQcm9wcy5pID09PSB0cnVlO1xuXG4gIHZhciBzaG91bGRBcHBseVNwbGl0TWl4aW5zID0gcmVuZGVyaW5nTG9naWMgJiYgaXNTcGxpdDtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBpZiAoIWNvbXBvbmVudFByb3BzLmQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJDb21wb25lbnQgd2FzIGNvbXBpbGVkIGluIGEgZGlmZmVyZW50IE5PREVfRU5WIHRoYW4gdGhlIE1hcmtvIHJ1bnRpbWUgaXMgdXNpbmcuXCIsXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIGlmIChjb21wb25lbnRQcm9wcy5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUnVudGltZS9OT0RFX0VOViBNaXNtYXRjaFwiKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiByZW5kZXJlcihpbnB1dCwgb3V0KSB7XG4gICAgdHJhY2tBc3luY0NvbXBvbmVudHMob3V0KTtcblxuICAgIHZhciBjb21wb25lbnRzQ29udGV4dCA9IGdldENvbXBvbmVudHNDb250ZXh0KG91dCk7XG4gICAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcblxuICAgIHZhciBjb21wb25lbnQgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZXJlbmRlckNvbXBvbmVudDtcbiAgICB2YXIgaXNSZXJlbmRlciA9IGNvbXBvbmVudCAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpZDtcbiAgICB2YXIgaXNFeGlzdGluZztcbiAgICB2YXIgY3VzdG9tRXZlbnRzO1xuICAgIHZhciBwYXJlbnRDb21wb25lbnREZWYgPSBjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWY7XG4gICAgdmFyIG93bmVyQ29tcG9uZW50RGVmID0gb3V0Ll9fX2Fzc2lnbmVkQ29tcG9uZW50RGVmO1xuICAgIHZhciBvd25lckNvbXBvbmVudElkID0gb3duZXJDb21wb25lbnREZWYgJiYgb3duZXJDb21wb25lbnREZWYuaWQ7XG4gICAgdmFyIGtleSA9IG91dC5fX19hc3NpZ25lZEtleTtcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIC8vIElmIGNvbXBvbmVudCBpcyBwcm92aWRlZCB0aGVuIHdlIGFyZSBjdXJyZW50bHkgcmVuZGVyaW5nXG4gICAgICAvLyB0aGUgdG9wLWxldmVsIFVJIGNvbXBvbmVudCBhcyBwYXJ0IG9mIGEgcmUtcmVuZGVyXG4gICAgICBpZCA9IGNvbXBvbmVudC5pZDsgLy8gV2Ugd2lsbCB1c2UgdGhlIElEIG9mIHRoZSBjb21wb25lbnQgYmVpbmcgcmUtcmVuZGVyZWRcbiAgICAgIGlzRXhpc3RpbmcgPSB0cnVlOyAvLyBUaGlzIGlzIGEgcmUtcmVuZGVyIHNvIHdlIGtub3cgdGhlIGNvbXBvbmVudCBpcyBhbHJlYWR5IGluIHRoZSBET01cbiAgICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlcmVuZGVyQ29tcG9uZW50ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBhcmUgcmVuZGVyaW5nIGEgbmVzdGVkIFVJIGNvbXBvbmVudC4gV2Ugd2lsbCBuZWVkXG4gICAgICAvLyB0byBtYXRjaCB1cCB0aGUgVUkgY29tcG9uZW50IHdpdGggdGhlIGNvbXBvbmVudCBhbHJlYWR5IGluIHRoZVxuICAgICAgLy8gRE9NIChpZiBhbnkpIHNvIHdlIHdpbGwgbmVlZCB0byByZXNvbHZlIHRoZSBjb21wb25lbnQgSUQgZnJvbVxuICAgICAgLy8gdGhlIGFzc2lnbmVkIGtleS4gV2UgYWxzbyBuZWVkIHRvIGhhbmRsZSBhbnkgY3VzdG9tIGV2ZW50IGJpbmRpbmdzXG4gICAgICAvLyB0aGF0IHdlcmUgcHJvdmlkZWQuXG4gICAgICBpZiAocGFyZW50Q29tcG9uZW50RGVmKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb21wb25lbnRBcmdzOicsIGNvbXBvbmVudEFyZ3MpO1xuICAgICAgICBjdXN0b21FdmVudHMgPSBvdXQuX19fYXNzaWduZWRDdXN0b21FdmVudHM7XG5cbiAgICAgICAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgICAgICAgaWQgPSByZXNvbHZlQ29tcG9uZW50S2V5KGtleS50b1N0cmluZygpLCBwYXJlbnRDb21wb25lbnREZWYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlkID0gcGFyZW50Q29tcG9uZW50RGVmLl9fX25leHRDb21wb25lbnRJZCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZCA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX25leHRDb21wb25lbnRJZCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1NlcnZlcikge1xuICAgICAgLy8gSWYgd2UgYXJlIHJlbmRlcmluZyBvbiB0aGUgc2VydmVyIHRoZW4gdGhpbmdzIGFyZSBzaW1wbGllciBzaW5jZVxuICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBtYXRjaCB1cCB0aGUgVUkgY29tcG9uZW50IHdpdGggYSBwcmV2aW91c2x5XG4gICAgICAvLyByZW5kZXJlZCBjb21wb25lbnQgYWxyZWFkeSBtb3VudGVkIHRvIHRoZSBET00uIFdlIGFsc28gY3JlYXRlXG4gICAgICAvLyBhIGxpZ2h0d2VpZ2h0IFNlcnZlckNvbXBvbmVudFxuICAgICAgY29tcG9uZW50ID0gcmVnaXN0cnkuX19fY3JlYXRlQ29tcG9uZW50KFxuICAgICAgICByZW5kZXJpbmdMb2dpYyxcbiAgICAgICAgaWQsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBvdXQsXG4gICAgICAgIHR5cGVOYW1lLFxuICAgICAgICBjdXN0b21FdmVudHMsXG4gICAgICAgIG93bmVyQ29tcG9uZW50SWQsXG4gICAgICApO1xuXG4gICAgICAvLyBUaGlzIGlzIHRoZSBmaW5hbCBpbnB1dCBhZnRlciBydW5uaW5nIHRoZSBsaWZlY3ljbGUgbWV0aG9kcy5cbiAgICAgIC8vIFdlIHdpbGwgYmUgcGFzc2luZyB0aGUgaW5wdXQgdG8gdGhlIHRlbXBsYXRlIGZvciB0aGUgYGlucHV0YCBwYXJhbVxuICAgICAgaW5wdXQgPSBjb21wb25lbnQuX19fdXBkYXRlZElucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNSZXJlbmRlciAmJlxuICAgICAgICAgIChjb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbaWRdKSAmJlxuICAgICAgICAgIGNvbXBvbmVudC5fX190eXBlICE9PSB0eXBlTmFtZVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBEZXN0cm95IHRoZSBleGlzdGluZyBjb21wb25lbnQgc2luY2VcbiAgICAgICAgICBjb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICAgIGNvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICBpc0V4aXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc0V4aXN0aW5nID0gZmFsc2U7XG4gICAgICAgICAgLy8gV2UgbmVlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudFxuICAgICAgICAgIGNvbXBvbmVudCA9IHJlZ2lzdHJ5Ll9fX2NyZWF0ZUNvbXBvbmVudCh0eXBlTmFtZSwgaWQpO1xuXG4gICAgICAgICAgaWYgKHNob3VsZEFwcGx5U3BsaXRNaXhpbnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNob3VsZEFwcGx5U3BsaXRNaXhpbnMgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIHJlbmRlcmluZ0xvZ2ljUHJvcHMgPVxuICAgICAgICAgICAgICB0eXBlb2YgcmVuZGVyaW5nTG9naWMgPT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICAgPyByZW5kZXJpbmdMb2dpYy5wcm90b3R5cGVcbiAgICAgICAgICAgICAgICA6IHJlbmRlcmluZ0xvZ2ljO1xuXG4gICAgICAgICAgICBjb3B5UHJvcHMocmVuZGVyaW5nTG9naWNQcm9wcywgY29tcG9uZW50LmNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoaXMgZmxhZyB0byBwcmV2ZW50IHRoZSBjb21wb25lbnQgZnJvbSBiZWluZyBxdWV1ZWQgZm9yIHVwZGF0ZVxuICAgICAgICAvLyBiYXNlZCBvbiB0aGUgbmV3IGlucHV0LiBUaGUgY29tcG9uZW50IGlzIGFib3V0IHRvIGJlIHJlcmVuZGVyZWRcbiAgICAgICAgLy8gc28gd2UgZG9uJ3Qgd2FudCB0byBxdWV1ZSBpdCB1cCBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBzZXRJbnB1dCgpYFxuICAgICAgICBjb21wb25lbnQuX19fdXBkYXRlUXVldWVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoY3VzdG9tRXZlbnRzKSB7XG4gICAgICAgICAgY29tcG9uZW50Ll9fX3NldEN1c3RvbUV2ZW50cyhjdXN0b21FdmVudHMsIG93bmVyQ29tcG9uZW50SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRXhpc3RpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgY29tcG9uZW50Ll9fX2VtaXRDcmVhdGUoaW5wdXQsIG91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGNvbXBvbmVudC5fX19zZXRJbnB1dChpbnB1dCwgb25JbnB1dCwgb3V0KTtcblxuICAgICAgICBpZiAoaXNFeGlzdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX19pc0RpcnR5ID09PSBmYWxzZSB8fFxuICAgICAgICAgICAgY29tcG9uZW50LnNob3VsZFVwZGF0ZShpbnB1dCwgY29tcG9uZW50Ll9fX3N0YXRlKSA9PT0gZmFsc2VcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIFdlIHB1dCBhIHBsYWNlaG9sZGVyIGVsZW1lbnQgaW4gdGhlIG91dHB1dCBzdHJlYW0gdG8gZW5zdXJlIHRoYXQgdGhlIGV4aXN0aW5nXG4gICAgICAgICAgICAvLyBET00gbm9kZSBpcyBtYXRjaGVkIHVwIGNvcnJlY3RseSB3aGVuIHVzaW5nIG1vcnBoZG9tLiBXZSBmbGFnIHRoZSBWRWxlbWVudFxuICAgICAgICAgICAgLy8gbm9kZSB0byB0cmFjayB0aGF0IGl0IGlzIGEgcHJlc2VydmUgbWFya2VyXG4gICAgICAgICAgICBvdXQuX19fcHJlc2VydmVDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX19yZXNldCgpOyAvLyBUaGUgY29tcG9uZW50IGlzIG5vIGxvbmdlciBkaXJ0eSBzbyByZXNldCBpbnRlcm5hbCBmbGFnc1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb21wb25lbnQuX19fZ2xvYmFsID0gb3V0Lmdsb2JhbDtcbiAgICAgIGNvbXBvbmVudC5fX19lbWl0UmVuZGVyKG91dCk7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBvbmVudERlZiA9IGJlZ2luQ29tcG9uZW50KFxuICAgICAgY29tcG9uZW50c0NvbnRleHQsXG4gICAgICBjb21wb25lbnQsXG4gICAgICBrZXksXG4gICAgICBvd25lckNvbXBvbmVudERlZixcbiAgICAgIGlzU3BsaXQsXG4gICAgICBpc0ltcGxpY2l0Q29tcG9uZW50LFxuICAgICk7XG5cbiAgICBjb21wb25lbnREZWYuX19faXNFeGlzdGluZyA9IGlzRXhpc3Rpbmc7XG5cbiAgICAvLyBSZW5kZXIgdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29tcG9uZW50IHVzaW5nIHRoZSBmaW5hbCB0ZW1wbGF0ZVxuICAgIC8vIGRhdGEgdGhhdCB3ZSBjb25zdHJ1Y3RlZFxuICAgIHRlbXBsYXRlUmVuZGVyRnVuYyhcbiAgICAgIGlucHV0LFxuICAgICAgb3V0LFxuICAgICAgY29tcG9uZW50RGVmLFxuICAgICAgY29tcG9uZW50LFxuICAgICAgY29tcG9uZW50Ll9fX3Jhd1N0YXRlLFxuICAgICAgb3V0Lmdsb2JhbCxcbiAgICApO1xuXG4gICAgZW5kQ29tcG9uZW50KG91dCwgY29tcG9uZW50RGVmKTtcbiAgICBjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWYgPSBwYXJlbnRDb21wb25lbnREZWY7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmVuZGVyZXJGdW5jO1xuXG4vLyBleHBvcnRzIHVzZWQgYnkgdGhlIGxlZ2FjeSByZW5kZXJlclxuY3JlYXRlUmVuZGVyZXJGdW5jLl9fX3Jlc29sdmVDb21wb25lbnRLZXkgPSByZXNvbHZlQ29tcG9uZW50S2V5O1xuY3JlYXRlUmVuZGVyZXJGdW5jLl9fX3RyYWNrQXN5bmNDb21wb25lbnRzID0gdHJhY2tBc3luY0NvbXBvbmVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHVwZGF0ZXNTY2hlZHVsZWQgPSBmYWxzZTtcbnZhciBiYXRjaFN0YWNrID0gW107IC8vIEEgc3RhY2sgb2YgYmF0Y2hlZCB1cGRhdGVzXG52YXIgdW5iYXRjaGVkUXVldWUgPSBbXTsgLy8gVXNlZCBmb3Igc2NoZWR1bGVkIGJhdGNoZWQgdXBkYXRlc1xuXG52YXIgc2V0SW1tZWRpYXRlID0gcmVxdWlyZShcIkBpbnRlcm5hbC9zZXQtaW1tZWRpYXRlXCIpLl9fX3NldEltbWVkaWF0ZTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHdlIHNjaGVkdWxlIHRoZSB1cGRhdGUgb2YgXCJ1bmJhdGNoZWRcIlxuICogdXBkYXRlcyB0byBjb21wb25lbnRzLlxuICovXG5mdW5jdGlvbiB1cGRhdGVVbmJhdGNoZWRDb21wb25lbnRzKCkge1xuICBpZiAodW5iYXRjaGVkUXVldWUubGVuZ3RoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHVwZGF0ZUNvbXBvbmVudHModW5iYXRjaGVkUXVldWUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBSZXNldCB0aGUgZmxhZyBub3cgdGhhdCB0aGlzIHNjaGVkdWxlZCBiYXRjaCB1cGRhdGVcbiAgICAgIC8vIGlzIGNvbXBsZXRlIHNvIHRoYXQgd2UgY2FuIGxhdGVyIHNjaGVkdWxlIGFub3RoZXJcbiAgICAgIC8vIGJhdGNoZWQgdXBkYXRlIGlmIG5lZWRlZFxuICAgICAgdXBkYXRlc1NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzY2hlZHVsZVVwZGF0ZXMoKSB7XG4gIGlmICh1cGRhdGVzU2NoZWR1bGVkKSB7XG4gICAgLy8gV2UgaGF2ZSBhbHJlYWR5IHNjaGVkdWxlZCBhIGJhdGNoZWQgdXBkYXRlIGZvciB0aGVcbiAgICAvLyBuZXh0VGljayBzbyBub3RoaW5nIHRvIGRvXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdXBkYXRlc1NjaGVkdWxlZCA9IHRydWU7XG5cbiAgc2V0SW1tZWRpYXRlKHVwZGF0ZVVuYmF0Y2hlZENvbXBvbmVudHMpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDb21wb25lbnRzKHF1ZXVlKSB7XG4gIC8vIExvb3Agb3ZlciB0aGUgY29tcG9uZW50cyBpbiB0aGUgcXVldWUgYW5kIHVwZGF0ZSB0aGVtLlxuICAvLyBOT1RFOiBJdCBpcyBva2F5IGlmIHRoZSBxdWV1ZSBncm93cyBkdXJpbmcgdGhlIGl0ZXJhdGlvblxuICAvLyAgICAgICBzaW5jZSB3ZSB3aWxsIHN0aWxsIGdldCB0byB0aGVtIGF0IHRoZSBlbmRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjb21wb25lbnQgPSBxdWV1ZVtpXTtcbiAgICBjb21wb25lbnQuX19fdXBkYXRlKCk7IC8vIERvIHRoZSBhY3R1YWwgY29tcG9uZW50IHVwZGF0ZVxuICB9XG5cbiAgLy8gQ2xlYXIgb3V0IHRoZSBxdWV1ZSBieSBzZXR0aW5nIHRoZSBsZW5ndGggdG8gemVyb1xuICBxdWV1ZS5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBiYXRjaFVwZGF0ZShmdW5jKSB7XG4gIC8vIElmIHRoZSBiYXRjaGVkIHVwZGF0ZSBzdGFjayBpcyBlbXB0eSB0aGVuIHRoaXNcbiAgLy8gaXMgdGhlIG91dGVyIGJhdGNoZWQgdXBkYXRlLiBBZnRlciB0aGUgb3V0ZXJcbiAgLy8gYmF0Y2hlZCB1cGRhdGUgY29tcGxldGVzIHdlIGludm9rZSB0aGUgXCJhZnRlclVwZGF0ZVwiXG4gIC8vIGV2ZW50IGxpc3RlbmVycy5cbiAgdmFyIGJhdGNoID0gW107XG5cbiAgYmF0Y2hTdGFjay5wdXNoKGJhdGNoKTtcblxuICB0cnkge1xuICAgIGZ1bmMoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgLy8gVXBkYXRlIGFsbCBvZiB0aGUgY29tcG9uZW50cyB0aGF0IHdoZXJlIHF1ZXVlZCB1cFxuICAgICAgLy8gaW4gdGhpcyBiYXRjaCAoaWYgYW55KVxuICAgICAgdXBkYXRlQ29tcG9uZW50cyhiYXRjaCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgY29tcGxldGVkIHRoZSB1cGRhdGUgb2YgYWxsIHRoZSBjb21wb25lbnRzXG4gICAgICAvLyBpbiB0aGlzIGJhdGNoIHdlIG5lZWQgdG8gcmVtb3ZlIGl0IG9mZiB0aGUgdG9wIG9mIHRoZSBzdGFja1xuICAgICAgYmF0Y2hTdGFjay5sZW5ndGgtLTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcXVldWVDb21wb25lbnRVcGRhdGUoY29tcG9uZW50KSB7XG4gIHZhciBiYXRjaFN0YWNrTGVuID0gYmF0Y2hTdGFjay5sZW5ndGg7XG5cbiAgaWYgKGJhdGNoU3RhY2tMZW4pIHtcbiAgICAvLyBXaGVuIGEgYmF0Y2ggdXBkYXRlIGlzIHN0YXJ0ZWQgd2UgcHVzaCBhIG5ldyBiYXRjaCBvbiB0byBhIHN0YWNrLlxuICAgIC8vIElmIHRoZSBzdGFjayBoYXMgYSBub24temVybyBsZW5ndGggdGhlbiB3ZSBrbm93IHRoYXQgYSBiYXRjaCBoYXNcbiAgICAvLyBiZWVuIHN0YXJ0ZWQgc28gd2UgY2FuIGp1c3QgcXVldWUgdGhlIGNvbXBvbmVudCBvbiB0aGUgdG9wIGJhdGNoLiBXaGVuXG4gICAgLy8gdGhlIGJhdGNoIGlzIGVuZGVkIHRoaXMgY29tcG9uZW50IHdpbGwgYmUgdXBkYXRlZC5cbiAgICBiYXRjaFN0YWNrW2JhdGNoU3RhY2tMZW4gLSAxXS5wdXNoKGNvbXBvbmVudCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gV2UgYXJlIG5vdCB3aXRoaW4gYSBiYXRjaGVkIHVwZGF0ZS4gV2UgbmVlZCB0byBzY2hlZHVsZSBhIGJhdGNoIHVwZGF0ZVxuICAgIC8vIGZvciB0aGUgbmV4dFRpY2sgKGlmIHRoYXQgaGFzbid0IGJlZW4gZG9uZSBhbHJlYWR5KSBhbmQgd2Ugd2lsbFxuICAgIC8vIGFkZCB0aGUgY29tcG9uZW50IHRvIHRoZSB1bmJhdGNoZWQgcXVldWVcbiAgICBzY2hlZHVsZVVwZGF0ZXMoKTtcbiAgICB1bmJhdGNoZWRRdWV1ZS5wdXNoKGNvbXBvbmVudCk7XG4gIH1cbn1cblxuZXhwb3J0cy5fX19xdWV1ZUNvbXBvbmVudFVwZGF0ZSA9IHF1ZXVlQ29tcG9uZW50VXBkYXRlO1xuZXhwb3J0cy5fX19iYXRjaFVwZGF0ZSA9IGJhdGNoVXBkYXRlO1xuIiwidmFyIGFjdHVhbENyZWF0ZU91dDtcblxuZnVuY3Rpb24gc2V0Q3JlYXRlT3V0KGNyZWF0ZU91dEZ1bmMpIHtcbiAgYWN0dWFsQ3JlYXRlT3V0ID0gY3JlYXRlT3V0RnVuYztcbn1cblxuZnVuY3Rpb24gY3JlYXRlT3V0KGdsb2JhbERhdGEpIHtcbiAgcmV0dXJuIGFjdHVhbENyZWF0ZU91dChnbG9iYWxEYXRhKTtcbn1cblxuY3JlYXRlT3V0Ll9fX3NldENyZWF0ZU91dCA9IHNldENyZWF0ZU91dDtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVPdXQ7XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlID0gY29tcG9uZW50c1V0aWwuX19fZGVzdHJveUNvbXBvbmVudEZvck5vZGU7XG52YXIgZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBjb21wb25lbnRzVXRpbC5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4vdmRvbS9tb3JwaGRvbS9oZWxwZXJzXCIpO1xuXG52YXIgaW5zZXJ0QmVmb3JlID0gaGVscGVycy5fX19pbnNlcnRCZWZvcmU7XG52YXIgaW5zZXJ0QWZ0ZXIgPSBoZWxwZXJzLl9fX2luc2VydEFmdGVyO1xudmFyIHJlbW92ZUNoaWxkID0gaGVscGVycy5fX19yZW1vdmVDaGlsZDtcblxuZnVuY3Rpb24gcmVzb2x2ZUVsKGVsKSB7XG4gIGlmICh0eXBlb2YgZWwgPT0gXCJzdHJpbmdcIikge1xuICAgIHZhciBlbElkID0gZWw7XG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbElkKTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIk5vdCBmb3VuZDogXCIgKyBlbElkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBiZWZvcmVSZW1vdmUocmVmZXJlbmNlRWwpIHtcbiAgZGVzdHJveU5vZGVSZWN1cnNpdmUocmVmZXJlbmNlRWwpO1xuICBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZShyZWZlcmVuY2VFbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgZ2V0RWwsIGFmdGVySW5zZXJ0KSB7XG4gIGV4dGVuZCh0YXJnZXQsIHtcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIG51bGwsIHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICBwcmVwZW5kVG86IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VFbC5maXJzdENoaWxkIHx8IG51bGwsIHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICByZXBsYWNlOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICAgIGJlZm9yZVJlbW92ZShyZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZUVsLCByZWZlcmVuY2VFbC5wYXJlbnROb2RlKTtcbiAgICAgIHJlbW92ZUNoaWxkKHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICByZXBsYWNlQ2hpbGRyZW5PZjogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG5cbiAgICAgIHZhciBjdXJDaGlsZCA9IHJlZmVyZW5jZUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7IC8vIEp1c3QgaW4gY2FzZSB0aGUgRE9NIGNoYW5nZXMgd2hpbGUgcmVtb3ZpbmdcbiAgICAgICAgYmVmb3JlUmVtb3ZlKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0U2libGluZztcbiAgICAgIH1cblxuICAgICAgcmVmZXJlbmNlRWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIGluc2VydEJlZm9yZShlbCwgbnVsbCwgcmVmZXJlbmNlRWwpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZUVsLCByZWZlcmVuY2VFbC5wYXJlbnROb2RlKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRBZnRlcihlbCwgcmVmZXJlbmNlRWwsIHJlZmVyZW5jZUVsLnBhcmVudE5vZGUpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICB9KTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNhbWVsVG9EYXNoTG9va3VwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbnZhciBkYXNoVG9DYW1lbExvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICogSGVscGVyIGZvciBjb252ZXJ0aW5nIGNhbWVsQ2FzZSB0byBkYXNoLWNhc2UuXG4gKi9cbmV4cG9ydHMuX19fY2FtZWxUb0Rhc2hDYXNlID0gZnVuY3Rpb24gY2FtZWxUb0Rhc2hDYXNlKG5hbWUpIHtcbiAgdmFyIG5hbWVEYXNoZWQgPSBjYW1lbFRvRGFzaExvb2t1cFtuYW1lXTtcbiAgaWYgKCFuYW1lRGFzaGVkKSB7XG4gICAgbmFtZURhc2hlZCA9IGNhbWVsVG9EYXNoTG9va3VwW25hbWVdID0gbmFtZVxuICAgICAgLnJlcGxhY2UoLyhbQS1aXSkvZywgXCItJDFcIilcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKG5hbWVEYXNoZWQgIT09IG5hbWUpIHtcbiAgICAgIGRhc2hUb0NhbWVsTG9va3VwW25hbWVEYXNoZWRdID0gbmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZURhc2hlZDtcbn07XG5cbi8qKlxuICogSGVscGVyIGZvciBjb252ZXJ0aW5nIGRhc2gtY2FzZSB0byBjYW1lbENhc2UuXG4gKi9cbmV4cG9ydHMuX19fZGFzaFRvQ2FtZWxDYXNlID0gZnVuY3Rpb24gZGFzaFRvQ2FtZWxDYXNlKG5hbWUpIHtcbiAgdmFyIG5hbWVDYW1lbCA9IGRhc2hUb0NhbWVsTG9va3VwW25hbWVdO1xuICBpZiAoIW5hbWVDYW1lbCkge1xuICAgIG5hbWVDYW1lbCA9IGRhc2hUb0NhbWVsTG9va3VwW25hbWVdID0gbmFtZS5yZXBsYWNlKFxuICAgICAgLy0oW2Etel0pL2csXG4gICAgICBtYXRjaFRvVXBwZXJDYXNlLFxuICAgICk7XG5cbiAgICBpZiAobmFtZUNhbWVsICE9PSBuYW1lKSB7XG4gICAgICBjYW1lbFRvRGFzaExvb2t1cFtuYW1lQ2FtZWxdID0gbmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZUNhbWVsO1xufTtcblxuZnVuY3Rpb24gbWF0Y2hUb1VwcGVyQ2FzZShfLCBjaGFyKSB7XG4gIHJldHVybiBjaGFyLnRvVXBwZXJDYXNlKCk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbGFzc0hlbHBlcihhcmcpIHtcbiAgc3dpdGNoICh0eXBlb2YgYXJnKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGFyZyB8fCB1bmRlZmluZWQ7XG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgICB2YXIgc2VwID0gXCJcIjtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJnLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gY2xhc3NIZWxwZXIoYXJnW2ldKTtcbiAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzZXAgKyB2YWx1ZTtcbiAgICAgICAgICAgIHNlcCA9IFwiIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZykge1xuICAgICAgICAgIGlmIChhcmdba2V5XSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHNlcCArIGtleTtcbiAgICAgICAgICAgIHNlcCA9IFwiIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0IHx8IHVuZGVmaW5lZDtcbiAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEhlbHBlciB0byByZW5kZXIgYSBjdXN0b20gdGFnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVuZGVyVGFnSGVscGVyKFxuICBoYW5kbGVyLFxuICBpbnB1dCxcbiAgb3V0LFxuICBjb21wb25lbnREZWYsXG4gIGtleSxcbiAgY3VzdG9tRXZlbnRzLFxuKSB7XG4gIG91dC5jKGNvbXBvbmVudERlZiwga2V5LCBjdXN0b21FdmVudHMpO1xuICAoaGFuZGxlci5fIHx8IChoYW5kbGVyLl8gPSBoYW5kbGVyLnJlbmRlciB8fCBoYW5kbGVyLnJlbmRlcmVyIHx8IGhhbmRsZXIpKShcbiAgICBpbnB1dCxcbiAgICBvdXQsXG4gICk7XG4gIG91dC5fX19hc3NpZ25lZENvbXBvbmVudERlZiA9IG51bGw7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjaGFuZ2VDYXNlID0gcmVxdWlyZShcIi4vX2NoYW5nZS1jYXNlXCIpO1xuXG4vKipcbiAqIEhlbHBlciBmb3IgZ2VuZXJhdGluZyB0aGUgc3RyaW5nIGZvciBhIHN0eWxlIGF0dHJpYnV0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlSGVscGVyKHN0eWxlKSB7XG4gIGlmICghc3R5bGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdHlsZTtcblxuICBpZiAodHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHZhciBzdHlsZXMgPSBcIlwiO1xuICAgIHZhciBzZXAgPSBcIlwiO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3R5bGUpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3R5bGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHQgPSBzdHlsZUhlbHBlcihzdHlsZVtpXSk7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc3R5bGVzICs9IHNlcCArIG5leHQ7XG4gICAgICAgICAgc2VwID0gXCI7XCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc3R5bGVbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlICs9IFwicHhcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHlsZXMgKz0gc2VwICsgY2hhbmdlQ2FzZS5fX19jYW1lbFRvRGFzaENhc2UobmFtZSkgKyBcIjpcIiArIHZhbHVlO1xuICAgICAgICAgIHNlcCA9IFwiO1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcyB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gc3R5bGU7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xudmFyIHNldEltbWVkaWF0ZSA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvc2V0LWltbWVkaWF0ZVwiKS5fX19zZXRJbW1lZGlhdGU7XG52YXIgZGVmYXVsdENyZWF0ZU91dCA9IHJlcXVpcmUoXCIuL2NyZWF0ZU91dFwiKTtcblxuZnVuY3Rpb24gc2FmZVJlbmRlcihyZW5kZXJGdW5jLCBmaW5hbERhdGEsIGZpbmFsT3V0LCBzaG91bGRFbmQpIHtcbiAgdHJ5IHtcbiAgICByZW5kZXJGdW5jKGZpbmFsRGF0YSwgZmluYWxPdXQpO1xuXG4gICAgaWYgKHNob3VsZEVuZCkge1xuICAgICAgZmluYWxPdXQuZW5kKCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB2YXIgYWN0dWFsRW5kID0gZmluYWxPdXQuZW5kO1xuICAgIGZpbmFsT3V0LmVuZCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZpbmFsT3V0LmVuZCA9IGFjdHVhbEVuZDtcbiAgICAgIGZpbmFsT3V0LmVycm9yKGVycik7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGZpbmFsT3V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHJlbmRlcmVyKSB7XG4gIHZhciByZW5kZXJGdW5jID1cbiAgICByZW5kZXJlciAmJiAocmVuZGVyZXIucmVuZGVyZXIgfHwgcmVuZGVyZXIucmVuZGVyIHx8IHJlbmRlcmVyKTtcbiAgdmFyIGNyZWF0ZU91dCA9IHRhcmdldC5jcmVhdGVPdXQgfHwgcmVuZGVyZXIuY3JlYXRlT3V0IHx8IGRlZmF1bHRDcmVhdGVPdXQ7XG5cbiAgcmV0dXJuIGV4dGVuZCh0YXJnZXQsIHtcbiAgICBfOiByZW5kZXJGdW5jLFxuICAgIGNyZWF0ZU91dDogY3JlYXRlT3V0LFxuXG4gICAgcmVuZGVyVG9TdHJpbmc6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGxvY2FsRGF0YSA9IGRhdGEgfHwge307XG4gICAgICB2YXIgcmVuZGVyID0gcmVuZGVyRnVuYyB8fCB0aGlzLl87XG4gICAgICB2YXIgZ2xvYmFsRGF0YSA9IGxvY2FsRGF0YS4kZ2xvYmFsO1xuICAgICAgdmFyIG91dCA9IGNyZWF0ZU91dChnbG9iYWxEYXRhKTtcblxuICAgICAgb3V0Lmdsb2JhbC50ZW1wbGF0ZSA9IHRoaXM7XG5cbiAgICAgIGlmIChnbG9iYWxEYXRhKSB7XG4gICAgICAgIGxvY2FsRGF0YS4kZ2xvYmFsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgb3V0XG4gICAgICAgICAgLm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG91dC50b1N0cmluZygpLCBvdXQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uY2UoXCJlcnJvclwiLCBjYWxsYmFjayk7XG5cbiAgICAgICAgcmV0dXJuIHNhZmVSZW5kZXIocmVuZGVyLCBsb2NhbERhdGEsIG91dCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQuc3luYygpO1xuICAgICAgICByZW5kZXIobG9jYWxEYXRhLCBvdXQpO1xuICAgICAgICByZXR1cm4gb3V0LnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlclN5bmM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgbG9jYWxEYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgIHZhciByZW5kZXIgPSByZW5kZXJGdW5jIHx8IHRoaXMuXztcbiAgICAgIHZhciBnbG9iYWxEYXRhID0gbG9jYWxEYXRhLiRnbG9iYWw7XG4gICAgICB2YXIgb3V0ID0gY3JlYXRlT3V0KGdsb2JhbERhdGEpO1xuICAgICAgb3V0LnN5bmMoKTtcblxuICAgICAgb3V0Lmdsb2JhbC50ZW1wbGF0ZSA9IHRoaXM7XG5cbiAgICAgIGlmIChnbG9iYWxEYXRhKSB7XG4gICAgICAgIGxvY2FsRGF0YS4kZ2xvYmFsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIobG9jYWxEYXRhLCBvdXQpO1xuICAgICAgcmV0dXJuIG91dC5fX19nZXRSZXN1bHQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyBhIHRlbXBsYXRlIHRvIG5vZGVzIGFuZCBpbnNlcnRzIHRoZW0gaW50byB0aGUgRE9NIHJlbGF0aXZlXG4gICAgICogdG8gdGhlIHByb3ZpZGVkIHJlZmVyZW5jZSBiYXNlZCBvbiB0aGUgb3B0aW9uYWwgcG9zaXRpb24gcGFyYW1ldGVyLlxuICAgICAqXG4gICAgICogU3VwcG9ydGVkIHNpZ25hdHVyZXM6XG4gICAgICpcbiAgICAgKiBtb3VudChkYXRhLCByZWZlcmVuY2UpXG4gICAgICogbW91bnQoZGF0YSwgcmVmZXJlbmNlLCBwb3NpdGlvbilcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBUaGUgdmlldyBtb2RlbCBkYXRhIGZvciB0aGUgdGVtcGxhdGVcbiAgICAgKiBAcGFyYW0gIHtOb2RlfSByZWZlcmVuY2UgRE9NIG5vZGUgdG8gaW5zZXJ0IHRoZSByZW5kZXJlZCBub2RlKHMpIHJlbGF0aXZlIHRvXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBbcG9zaXRpb25dIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGByZWZlcmVuY2VgOyBtdXN0IG1hdGNoIChjYXNlLWluc2Vuc2l0aXZlbHkpIG9uZSBvZiB0aGUgZm9sbG93aW5nIHN0cmluZ3M6XG4gICAgICogICdiZWZvcmViZWdpbic6IEJlZm9yZSB0aGUgdGFyZ2V0RWxlbWVudCBpdHNlbGYuXG4gICAgICogICdhZnRlcmJlZ2luJzogSnVzdCBpbnNpZGUgdGhlIHRhcmdldEVsZW1lbnQsIGJlZm9yZSBpdHMgZmlyc3QgY2hpbGQuXG4gICAgICogICdiZWZvcmVlbmQnOiBKdXN0IGluc2lkZSB0aGUgdGFyZ2V0RWxlbWVudCwgYWZ0ZXIgaXRzIGxhc3QgY2hpbGQuXG4gICAgICogICdhZnRlcmVuZCc6IEFmdGVyIHRoZSB0YXJnZXRFbGVtZW50IGl0c2VsZi5cbiAgICAgKiBAcmV0dXJuIHtUZW1wbGF0ZUluc3RhbmNlfSBPYmplY3Qgd2l0aCBgdXBkYXRlYCBhbmQgYGRpc3Bvc2VgIG1ldGhvZHNcbiAgICAgKi9cbiAgICBtb3VudDogZnVuY3Rpb24gKGRhdGEsIHJlZmVyZW5jZSwgcG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucmVuZGVyU3luYyhkYXRhKTtcblxuICAgICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgICBjYXNlIFwiYWZ0ZXJiZWdpblwiOlxuICAgICAgICAgIHJlc3VsdC5wcmVwZW5kVG8ocmVmZXJlbmNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImFmdGVyZW5kXCI6XG4gICAgICAgICAgcmVzdWx0Lmluc2VydEFmdGVyKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJiZWZvcmViZWdpblwiOlxuICAgICAgICAgIHJlc3VsdC5pbnNlcnRCZWZvcmUocmVmZXJlbmNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXN1bHQuYXBwZW5kVG8ocmVmZXJlbmNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gcmVzdWx0LmdldENvbXBvbmVudCgpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cGRhdGUoaW5wdXQpIHtcbiAgICAgICAgICBjb21wb25lbnQuaW5wdXQgPSBpbnB1dDtcbiAgICAgICAgICBjb21wb25lbnQudXBkYXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgYSB0ZW1wbGF0ZSB0byBlaXRoZXIgYSBzdHJlYW0gKGlmIHRoZSBsYXN0XG4gICAgICogYXJndW1lbnQgaXMgYSBTdHJlYW0gaW5zdGFuY2UpIG9yXG4gICAgICogcHJvdmlkZXMgdGhlIG91dHB1dCB0byBhIGNhbGxiYWNrIGZ1bmN0aW9uIChpZiB0aGUgbGFzdFxuICAgICAqIGFyZ3VtZW50IGlzIGEgRnVuY3Rpb24pLlxuICAgICAqXG4gICAgICogU3VwcG9ydGVkIHNpZ25hdHVyZXM6XG4gICAgICpcbiAgICAgKiByZW5kZXIoZGF0YSlcbiAgICAgKiByZW5kZXIoZGF0YSwgb3V0KVxuICAgICAqIHJlbmRlcihkYXRhLCBzdHJlYW0pXG4gICAgICogcmVuZGVyKGRhdGEsIGNhbGxiYWNrKVxuICAgICAqXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBkYXRhIFRoZSB2aWV3IG1vZGVsIGRhdGEgZm9yIHRoZSB0ZW1wbGF0ZVxuICAgICAqIEBwYXJhbSAge0FzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXJ9IG91dCBBIFN0cmVhbSwgYW4gQXN5bmNTdHJlYW0vQXN5bmNWRE9NQnVpbGRlciBpbnN0YW5jZSwgb3IgYSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm4ge0FzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXJ9IFJldHVybnMgdGhlIEFzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXIgaW5zdGFuY2UgdGhhdCB0aGUgdGVtcGxhdGUgaXMgcmVuZGVyZWQgdG9cbiAgICAgKi9cbiAgICByZW5kZXI6IGZ1bmN0aW9uIChkYXRhLCBvdXQpIHtcbiAgICAgIHZhciBjYWxsYmFjaztcbiAgICAgIHZhciBmaW5hbE91dDtcbiAgICAgIHZhciBmaW5hbERhdGE7XG4gICAgICB2YXIgZ2xvYmFsRGF0YTtcbiAgICAgIHZhciByZW5kZXIgPSByZW5kZXJGdW5jIHx8IHRoaXMuXztcbiAgICAgIHZhciBzaG91bGRCdWZmZXIgPSB0aGlzLl9fX3Nob3VsZEJ1ZmZlcjtcbiAgICAgIHZhciBzaG91bGRFbmQgPSB0cnVlO1xuXG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBmaW5hbERhdGEgPSBkYXRhO1xuICAgICAgICBpZiAoKGdsb2JhbERhdGEgPSBkYXRhLiRnbG9iYWwpKSB7XG4gICAgICAgICAgZmluYWxEYXRhLiRnbG9iYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbmFsRGF0YSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiAob3V0ICYmIG91dC5fX19pc091dCkge1xuICAgICAgICBmaW5hbE91dCA9IG91dDtcbiAgICAgICAgc2hvdWxkRW5kID0gZmFsc2U7XG4gICAgICAgIGV4dGVuZChvdXQuZ2xvYmFsLCBnbG9iYWxEYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG91dCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZmluYWxPdXQgPSBjcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG4gICAgICAgIGNhbGxiYWNrID0gb3V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluYWxPdXQgPSBjcmVhdGVPdXQoXG4gICAgICAgICAgZ2xvYmFsRGF0YSwgLy8gZ2xvYmFsXG4gICAgICAgICAgb3V0LCAvLyB3cml0ZXIoQXN5bmNTdHJlYW0pIG9yIHBhcmVudE5vZGUoQXN5bmNWRE9NQnVpbGRlcilcbiAgICAgICAgICB1bmRlZmluZWQsIC8vIHBhcmVudE91dFxuICAgICAgICAgIHNob3VsZEJ1ZmZlciwgLy8gaWdub3JlZCBieSBBc3luY1ZET01CdWlsZGVyXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBmaW5hbE91dFxuICAgICAgICAgIC5vbihcImZpbmlzaFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBmaW5hbE91dC5fX19nZXRSZXN1bHQoKSwgZmluYWxPdXQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uY2UoXCJlcnJvclwiLCBjYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIGdsb2JhbERhdGEgPSBmaW5hbE91dC5nbG9iYWw7XG5cbiAgICAgIGdsb2JhbERhdGEudGVtcGxhdGUgPSBnbG9iYWxEYXRhLnRlbXBsYXRlIHx8IHRoaXM7XG5cbiAgICAgIHJldHVybiBzYWZlUmVuZGVyKHJlbmRlciwgZmluYWxEYXRhLCBmaW5hbE91dCwgc2hvdWxkRW5kKTtcbiAgICB9LFxuICB9KTtcbn07XG4iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50cy1saWdodFwiKTtcbnZhciBSZW5kZXJSZXN1bHQgPSByZXF1aXJlKFwiLi4vUmVuZGVyUmVzdWx0XCIpO1xudmFyIGF0dHJzSGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9hdHRyc1wiKTtcbnZhciBtb3JwaGRvbSA9IHJlcXVpcmUoXCIuL21vcnBoZG9tXCIpO1xudmFyIHZkb20gPSByZXF1aXJlKFwiLi92ZG9tXCIpO1xudmFyIFZFbGVtZW50ID0gdmRvbS5fX19WRWxlbWVudDtcbnZhciBWRG9jdW1lbnRGcmFnbWVudCA9IHZkb20uX19fVkRvY3VtZW50RnJhZ21lbnQ7XG52YXIgVlRleHQgPSB2ZG9tLl9fX1ZUZXh0O1xudmFyIFZDb21wb25lbnQgPSB2ZG9tLl9fX1ZDb21wb25lbnQ7XG52YXIgVkZyYWdtZW50ID0gdmRvbS5fX19WRnJhZ21lbnQ7XG52YXIgdmlydHVhbGl6ZUhUTUwgPSB2ZG9tLl9fX3ZpcnR1YWxpemVIVE1MO1xuXG52YXIgRVZFTlRfVVBEQVRFID0gXCJ1cGRhdGVcIjtcbnZhciBFVkVOVF9GSU5JU0ggPSBcImZpbmlzaFwiO1xuXG5mdW5jdGlvbiBTdGF0ZSh0cmVlKSB7XG4gIHRoaXMuX19fZXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB0aGlzLl9fX3RyZWUgPSB0cmVlO1xuICB0aGlzLl9fX2ZpbmlzaGVkID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIEFzeW5jVkRPTUJ1aWxkZXIoZ2xvYmFsRGF0YSwgcGFyZW50Tm9kZSwgcGFyZW50T3V0KSB7XG4gIGlmICghcGFyZW50Tm9kZSkge1xuICAgIHBhcmVudE5vZGUgPSBuZXcgVkRvY3VtZW50RnJhZ21lbnQoKTtcbiAgfVxuXG4gIHZhciBzdGF0ZTtcblxuICBpZiAocGFyZW50T3V0KSB7XG4gICAgc3RhdGUgPSBwYXJlbnRPdXQuX19fc3RhdGU7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUgPSBuZXcgU3RhdGUocGFyZW50Tm9kZSk7XG4gIH1cblxuICB0aGlzLl9fX3JlbWFpbmluZyA9IDE7XG4gIHRoaXMuX19fbGFzdENvdW50ID0gMDtcbiAgdGhpcy5fX19sYXN0ID0gbnVsbDtcbiAgdGhpcy5fX19wYXJlbnRPdXQgPSBwYXJlbnRPdXQ7XG5cbiAgdGhpcy5kYXRhID0ge307XG4gIHRoaXMuX19fc3RhdGUgPSBzdGF0ZTtcbiAgdGhpcy5fX19wYXJlbnQgPSBwYXJlbnROb2RlO1xuICB0aGlzLmdsb2JhbCA9IGdsb2JhbERhdGEgfHwge307XG4gIHRoaXMuX19fc3RhY2sgPSBbcGFyZW50Tm9kZV07XG4gIHRoaXMuX19fc3luYyA9IGZhbHNlO1xuICB0aGlzLl9fX3Zub2RlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX2NvbXBvbmVudHMgPSBudWxsO1xuXG4gIHRoaXMuX19fYXNzaWduZWRDb21wb25lbnREZWYgPSBudWxsO1xuICB0aGlzLl9fX2Fzc2lnbmVkS2V5ID0gbnVsbDtcbiAgdGhpcy5fX19hc3NpZ25lZEN1c3RvbUV2ZW50cyA9IG51bGw7XG59XG5cbnZhciBwcm90byA9IChBc3luY1ZET01CdWlsZGVyLnByb3RvdHlwZSA9IHtcbiAgX19faXNPdXQ6IHRydWUsXG4gIF9fX2hvc3Q6IHR5cGVvZiBkb2N1bWVudCA9PT0gXCJvYmplY3RcIiAmJiBkb2N1bWVudCxcblxuICBiYzogZnVuY3Rpb24gKGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCkge1xuICAgIHZhciB2Q29tcG9uZW50ID0gbmV3IFZDb21wb25lbnQoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50KTtcbiAgICByZXR1cm4gdGhpcy5fX19iZWdpbk5vZGUodkNvbXBvbmVudCwgMCwgdHJ1ZSk7XG4gIH0sXG5cbiAgX19fcHJlc2VydmVDb21wb25lbnQ6IGZ1bmN0aW9uIChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQpIHtcbiAgICB2YXIgdkNvbXBvbmVudCA9IG5ldyBWQ29tcG9uZW50KGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCwgdHJ1ZSk7XG4gICAgdGhpcy5fX19iZWdpbk5vZGUodkNvbXBvbmVudCwgMCk7XG4gIH0sXG5cbiAgX19fYmVnaW5Ob2RlOiBmdW5jdGlvbiAoY2hpbGQsIGNoaWxkQ291bnQsIHB1c2hUb1N0YWNrKSB7XG4gICAgdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIGlmIChwdXNoVG9TdGFjayA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5fX19zdGFjay5wdXNoKGNoaWxkKTtcbiAgICAgIHRoaXMuX19fcGFyZW50ID0gY2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZENvdW50ID09PSAwID8gdGhpcyA6IGNoaWxkO1xuICB9LFxuXG4gIGVsZW1lbnQ6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBjb21wb25lbnQsIGNoaWxkQ291bnQsIGZsYWdzLCBwcm9wcykge1xuICAgIHZhciBlbGVtZW50ID0gbmV3IFZFbGVtZW50KFxuICAgICAgdGFnTmFtZSxcbiAgICAgIGF0dHJzLFxuICAgICAga2V5LFxuICAgICAgY29tcG9uZW50LFxuICAgICAgY2hpbGRDb3VudCxcbiAgICAgIGZsYWdzLFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5fX19iZWdpbk5vZGUoZWxlbWVudCwgY2hpbGRDb3VudCk7XG4gIH0sXG5cbiAgX19fZWxlbWVudER5bmFtaWM6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBjb21wb25lbnREZWYsIHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudChcbiAgICAgIHRhZ05hbWUsXG4gICAgICBhdHRyc0hlbHBlcihhdHRycyksXG4gICAgICBrZXksXG4gICAgICBjb21wb25lbnREZWYuX19fY29tcG9uZW50LFxuICAgICAgMCxcbiAgICAgIDAsXG4gICAgICBwcm9wcyxcbiAgICApO1xuICB9LFxuXG4gIG46IGZ1bmN0aW9uIChub2RlLCBjb21wb25lbnQpIHtcbiAgICAvLyBOT1RFOiBXZSBkbyBhIHNoYWxsb3cgY2xvbmUgc2luY2Ugd2UgYXNzdW1lIHRoZSBub2RlIGlzIGJlaW5nIHJldXNlZFxuICAgIC8vICAgICAgIGFuZCBhIG5vZGUgY2FuIG9ubHkgaGF2ZSBvbmUgcGFyZW50IG5vZGUuXG4gICAgdmFyIGNsb25lID0gbm9kZS5fX19jbG9uZU5vZGUoKTtcbiAgICB0aGlzLm5vZGUoY2xvbmUpO1xuICAgIGNsb25lLl9fX293bmVyQ29tcG9uZW50ID0gY29tcG9uZW50O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgbm9kZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB0aGlzLl9fX3BhcmVudC5fX19hcHBlbmRDaGlsZChub2RlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0ZXh0OiBmdW5jdGlvbiAodGV4dCwgb3duZXJDb21wb25lbnQpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiB0ZXh0O1xuXG4gICAgaWYgKHR5cGUgIT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKHRleHQudG9IVE1MKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaCh0ZXh0LnRvSFRNTCgpLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGV4dCA9IHRleHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fX3BhcmVudC5fX19hcHBlbmRDaGlsZChuZXcgVlRleHQodGV4dCwgb3duZXJDb21wb25lbnQpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBodG1sOiBmdW5jdGlvbiAoaHRtbCwgb3duZXJDb21wb25lbnQpIHtcbiAgICBpZiAoaHRtbCAhPSBudWxsKSB7XG4gICAgICB2YXIgdmRvbU5vZGUgPSB2aXJ0dWFsaXplSFRNTChodG1sLCBvd25lckNvbXBvbmVudCk7XG4gICAgICB0aGlzLm5vZGUodmRvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGJlZ2luRWxlbWVudDogZnVuY3Rpb24gKFxuICAgIHRhZ05hbWUsXG4gICAgYXR0cnMsXG4gICAga2V5LFxuICAgIGNvbXBvbmVudCxcbiAgICBjaGlsZENvdW50LFxuICAgIGZsYWdzLFxuICAgIHByb3BzLFxuICApIHtcbiAgICB2YXIgZWxlbWVudCA9IG5ldyBWRWxlbWVudChcbiAgICAgIHRhZ05hbWUsXG4gICAgICBhdHRycyxcbiAgICAgIGtleSxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIGNoaWxkQ291bnQsXG4gICAgICBmbGFncyxcbiAgICAgIHByb3BzLFxuICAgICk7XG4gICAgdGhpcy5fX19iZWdpbk5vZGUoZWxlbWVudCwgY2hpbGRDb3VudCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgX19fYmVnaW5FbGVtZW50RHluYW1pYzogZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBrZXksIGNvbXBvbmVudERlZiwgcHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5iZWdpbkVsZW1lbnQoXG4gICAgICB0YWdOYW1lLFxuICAgICAgYXR0cnNIZWxwZXIoYXR0cnMpLFxuICAgICAga2V5LFxuICAgICAgY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudCxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgfSxcblxuICBiZjogZnVuY3Rpb24gKGtleSwgY29tcG9uZW50LCBwcmVzZXJ2ZSkge1xuICAgIHZhciBmcmFnbWVudCA9IG5ldyBWRnJhZ21lbnQoa2V5LCBjb21wb25lbnQsIHByZXNlcnZlKTtcbiAgICB0aGlzLl9fX2JlZ2luTm9kZShmcmFnbWVudCwgbnVsbCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgZWY6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuZEVsZW1lbnQoKTtcbiAgfSxcblxuICBlbmRFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YWNrID0gdGhpcy5fX19zdGFjaztcbiAgICBzdGFjay5wb3AoKTtcbiAgICB0aGlzLl9fX3BhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICB9LFxuXG4gIGVuZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX19fcGFyZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyIHJlbWFpbmluZyA9IC0tdGhpcy5fX19yZW1haW5pbmc7XG4gICAgdmFyIHBhcmVudE91dCA9IHRoaXMuX19fcGFyZW50T3V0O1xuXG4gICAgaWYgKHJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgaWYgKHBhcmVudE91dCkge1xuICAgICAgICBwYXJlbnRPdXQuX19faGFuZGxlQ2hpbGREb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fX2RvRmluaXNoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZW1haW5pbmcgLSB0aGlzLl9fX2xhc3RDb3VudCA9PT0gMCkge1xuICAgICAgdGhpcy5fX19lbWl0TGFzdCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9fX2hhbmRsZUNoaWxkRG9uZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZW1haW5pbmcgPSAtLXRoaXMuX19fcmVtYWluaW5nO1xuXG4gICAgaWYgKHJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgdmFyIHBhcmVudE91dCA9IHRoaXMuX19fcGFyZW50T3V0O1xuICAgICAgaWYgKHBhcmVudE91dCkge1xuICAgICAgICBwYXJlbnRPdXQuX19faGFuZGxlQ2hpbGREb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fX2RvRmluaXNoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZW1haW5pbmcgLSB0aGlzLl9fX2xhc3RDb3VudCA9PT0gMCkge1xuICAgICAgdGhpcy5fX19lbWl0TGFzdCgpO1xuICAgIH1cbiAgfSxcblxuICBfX19kb0ZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgc3RhdGUuX19fZmluaXNoZWQgPSB0cnVlO1xuICAgIHN0YXRlLl9fX2V2ZW50cy5lbWl0KEVWRU5UX0ZJTklTSCwgdGhpcy5fX19nZXRSZXN1bHQoKSk7XG4gIH0sXG5cbiAgX19fZW1pdExhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGFzdEFycmF5ID0gdGhpcy5fbGFzdDtcblxuICAgIHZhciBpID0gMDtcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBpZiAoaSA9PT0gbGFzdEFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbGFzdENhbGxiYWNrID0gbGFzdEFycmF5W2krK107XG4gICAgICBsYXN0Q2FsbGJhY2sobmV4dCk7XG5cbiAgICAgIGlmICghbGFzdENhbGxiYWNrLmxlbmd0aCkge1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV4dCgpO1xuICB9LFxuXG4gIGVycm9yOiBmdW5jdGlvbiAoZSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gbGlzdGVuZXIgZm9yIHRoZSBlcnJvciBldmVudCB0aGVuIGl0IHdpbGxcbiAgICAgIC8vIHRocm93IGEgbmV3IEVycm9yIGhlcmUuIEluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSBhc3luYyBmcmFnbWVudFxuICAgICAgLy8gaXMgc3RpbGwgcHJvcGVybHkgZW5kZWQgd2UgbmVlZCB0byBwdXQgdGhlIGVuZCgpIGluIGEgYGZpbmFsbHlgXG4gICAgICAvLyBibG9ja1xuICAgICAgdGhpcy5lbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBiZWdpbkFzeW5jOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGlmICh0aGlzLl9fX3N5bmMpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIlRyaWVkIHRvIHJlbmRlciBhc3luYyB3aGlsZSBpbiBzeW5jIG1vZGUuIE5vdGU6IENsaWVudCBzaWRlIGF3YWl0IGlzIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkIGluIHJlLXJlbmRlcnMgKElzc3VlOiAjOTQyKS5cIixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy5sYXN0KSB7XG4gICAgICAgIHRoaXMuX19fbGFzdENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fX19yZW1haW5pbmcrKztcblxuICAgIHZhciBkb2N1bWVudEZyYWdtZW50ID0gdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciBhc3luY091dCA9IG5ldyBBc3luY1ZET01CdWlsZGVyKHRoaXMuZ2xvYmFsLCBkb2N1bWVudEZyYWdtZW50LCB0aGlzKTtcblxuICAgIHN0YXRlLl9fX2V2ZW50cy5lbWl0KFwiYmVnaW5Bc3luY1wiLCB7XG4gICAgICBvdXQ6IGFzeW5jT3V0LFxuICAgICAgcGFyZW50T3V0OiB0aGlzLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFzeW5jT3V0O1xuICB9LFxuXG4gIGNyZWF0ZU91dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgQXN5bmNWRE9NQnVpbGRlcih0aGlzLmdsb2JhbCk7XG4gIH0sXG5cbiAgZmx1c2g6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5fX19zdGF0ZS5fX19ldmVudHM7XG5cbiAgICBpZiAoZXZlbnRzLmxpc3RlbmVyQ291bnQoRVZFTlRfVVBEQVRFKSkge1xuICAgICAgZXZlbnRzLmVtaXQoRVZFTlRfVVBEQVRFLCBuZXcgUmVuZGVyUmVzdWx0KHRoaXMpKTtcbiAgICB9XG4gIH0sXG5cbiAgX19fZ2V0T3V0cHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fc3RhdGUuX19fdHJlZTtcbiAgfSxcblxuICBfX19nZXRSZXN1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19yZXN1bHQgfHwgKHRoaXMuX19fcmVzdWx0ID0gbmV3IFJlbmRlclJlc3VsdCh0aGlzKSk7XG4gIH0sXG5cbiAgb246IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKGV2ZW50ID09PSBFVkVOVF9GSU5JU0ggJiYgc3RhdGUuX19fZmluaXNoZWQpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMuX19fZ2V0UmVzdWx0KCkpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IFwibGFzdFwiKSB7XG4gICAgICB0aGlzLm9uTGFzdChjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLl9fX2V2ZW50cy5vbihldmVudCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKGV2ZW50ID09PSBFVkVOVF9GSU5JU0ggJiYgc3RhdGUuX19fZmluaXNoZWQpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMuX19fZ2V0UmVzdWx0KCkpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IFwibGFzdFwiKSB7XG4gICAgICB0aGlzLm9uTGFzdChjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLl9fX2V2ZW50cy5vbmNlKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKHR5cGUsIGFyZykge1xuICAgIHZhciBldmVudHMgPSB0aGlzLl9fX3N0YXRlLl9fX2V2ZW50cztcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgZXZlbnRzLmVtaXQodHlwZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBldmVudHMuZW1pdCh0eXBlLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGV2ZW50cy5lbWl0LmFwcGx5KGV2ZW50cywgYXJndW1lbnRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50cyA9IHRoaXMuX19fc3RhdGUuX19fZXZlbnRzO1xuICAgIGV2ZW50cy5yZW1vdmVMaXN0ZW5lci5hcHBseShldmVudHMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgc3luYzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX19fc3luYyA9IHRydWU7XG4gIH0sXG5cbiAgaXNTeW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fc3luYztcbiAgfSxcblxuICBvbkxhc3Q6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciBsYXN0QXJyYXkgPSB0aGlzLl9sYXN0O1xuXG4gICAgaWYgKGxhc3RBcnJheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9sYXN0ID0gW2NhbGxiYWNrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdEFycmF5LnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9fX2dldE5vZGU6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9fX3Zub2RlO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgdmFyIHZkb21UcmVlID0gdGhpcy5fX19nZXRPdXRwdXQoKTtcblxuICAgICAgaWYgKCFob3N0KSBob3N0ID0gdGhpcy5fX19ob3N0O1xuICAgICAgdGhpcy5fX192bm9kZSA9IG5vZGUgPSB2ZG9tVHJlZS5fX19hY3R1YWxpemUoaG9zdCwgbnVsbCk7XG4gICAgICBtb3JwaGRvbShub2RlLCB2ZG9tVHJlZSwgaG9zdCwgdGhpcy5fX19jb21wb25lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG5cbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIGRvY0ZyYWdtZW50ID0gdGhpcy5fX19nZXROb2RlKGhvc3QpO1xuICAgIHZhciBodG1sID0gXCJcIjtcblxuICAgIHZhciBjaGlsZCA9IGRvY0ZyYWdtZW50LmZpcnN0Q2hpbGQ7XG4gICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjaGlsZC5uZXh0U2libGluZztcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPSAxKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2NGcmFnbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZC5jbG9uZU5vZGUoKSk7XG4gICAgICAgIGh0bWwgKz0gY29udGFpbmVyLmlubmVySFRNTDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGh0bWwgKz0gY2hpbGQub3V0ZXJIVE1MO1xuICAgICAgfVxuXG4gICAgICBjaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBodG1sO1xuICB9LFxuXG4gIHRoZW46IGZ1bmN0aW9uIChmbiwgZm5FcnIpIHtcbiAgICB2YXIgb3V0ID0gdGhpcztcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIG91dC5vbihcImVycm9yXCIsIHJlamVjdCkub24oRVZFTlRfRklOSVNILCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwcm9taXNlKS50aGVuKGZuLCBmbkVycik7XG4gIH0sXG5cbiAgY2F0Y2g6IGZ1bmN0aW9uIChmbkVycikge1xuICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBmbkVycik7XG4gIH0sXG5cbiAgaXNWRE9NOiB0cnVlLFxuXG4gIGM6IGZ1bmN0aW9uIChjb21wb25lbnREZWYsIGtleSwgY3VzdG9tRXZlbnRzKSB7XG4gICAgdGhpcy5fX19hc3NpZ25lZENvbXBvbmVudERlZiA9IGNvbXBvbmVudERlZjtcbiAgICB0aGlzLl9fX2Fzc2lnbmVkS2V5ID0ga2V5O1xuICAgIHRoaXMuX19fYXNzaWduZWRDdXN0b21FdmVudHMgPSBjdXN0b21FdmVudHM7XG4gIH0sXG59KTtcblxucHJvdG8uZSA9IHByb3RvLmVsZW1lbnQ7XG5wcm90by5iZSA9IHByb3RvLmJlZ2luRWxlbWVudDtcbnByb3RvLmVlID0gcHJvdG8uX19fZW5kRWxlbWVudCA9IHByb3RvLmVuZEVsZW1lbnQ7XG5wcm90by50ID0gcHJvdG8udGV4dDtcbnByb3RvLmggPSBwcm90by53ID0gcHJvdG8ud3JpdGUgPSBwcm90by5odG1sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFzeW5jVkRPTUJ1aWxkZXI7XG4iLCJ2YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG5cbmZ1bmN0aW9uIFZDb21wb25lbnQoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50LCBwcmVzZXJ2ZSkge1xuICB0aGlzLl9fX1ZOb2RlKG51bGwgLyogY2hpbGRDb3VudCAqLywgb3duZXJDb21wb25lbnQpO1xuICB0aGlzLl9fX2tleSA9IGtleTtcbiAgdGhpcy5fX19jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gIHRoaXMuX19fcHJlc2VydmUgPSBwcmVzZXJ2ZTtcbn1cblxuVkNvbXBvbmVudC5wcm90b3R5cGUgPSB7XG4gIF9fX25vZGVUeXBlOiAyLFxufTtcblxuaW5oZXJpdChWQ29tcG9uZW50LCBWTm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVkNvbXBvbmVudDtcbiIsInZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWRG9jdW1lbnRGcmFnbWVudENsb25lKG90aGVyKSB7XG4gIGV4dGVuZCh0aGlzLCBvdGhlcik7XG4gIHRoaXMuX19fcGFyZW50Tm9kZSA9IG51bGw7XG4gIHRoaXMuX19fbmV4dFNpYmxpbmdJbnRlcm5hbCA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIFZEb2N1bWVudEZyYWdtZW50KG91dCkge1xuICB0aGlzLl9fX1ZOb2RlKG51bGwgLyogY2hpbGRDb3VudCAqLyk7XG4gIHRoaXMuX19fb3V0ID0gb3V0O1xufVxuXG5WRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUgPSB7XG4gIF9fX25vZGVUeXBlOiAxMSxcblxuICBfX19Eb2N1bWVudEZyYWdtZW50OiB0cnVlLFxuXG4gIF9fX2Nsb25lTm9kZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVkRvY3VtZW50RnJhZ21lbnRDbG9uZSh0aGlzKTtcbiAgfSxcblxuICBfX19hY3R1YWxpemU6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgcmV0dXJuIChob3N0Lm93bmVyRG9jdW1lbnQgfHwgaG9zdCkuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB9LFxufTtcblxuaW5oZXJpdChWRG9jdW1lbnRGcmFnbWVudCwgVk5vZGUpO1xuXG5WRG9jdW1lbnRGcmFnbWVudENsb25lLnByb3RvdHlwZSA9IFZEb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBWRG9jdW1lbnRGcmFnbWVudDtcbiIsIi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cblxudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgdkVsZW1lbnRCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZFbGVtZW50QnlET01Ob2RlO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG52YXIgQVRUUl9YTElOS19IUkVGID0gXCJ4bGluazpocmVmXCI7XG52YXIgeG1sbnNSZWdFeHAgPSAvXnhtbG5zKDp8JCkvO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBOU19YTElOSyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xudmFyIE5TX0hUTUwgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcbnZhciBOU19NQVRIID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCI7XG52YXIgTlNfU1ZHID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xudmFyIERFRkFVTFRfTlMgPSB7XG4gIHN2ZzogTlNfU1ZHLFxuICBtYXRoOiBOU19NQVRILFxufTtcblxudmFyIEZMQUdfU0lNUExFX0FUVFJTID0gMTtcbnZhciBGTEFHX0NVU1RPTV9FTEVNRU5UID0gMjtcbnZhciBGTEFHX1NQUkVBRF9BVFRSUyA9IDQ7XG5cbnZhciBBVFRSX0hSRUYgPSBcImhyZWZcIjtcbnZhciBFTVBUWV9PQkpFQ1QgPSBPYmplY3QuZnJlZXplKE9iamVjdC5jcmVhdGUobnVsbCkpO1xudmFyIHNwZWNpYWxFbEhhbmRsZXJzID0ge1xuICBvcHRpb246IHtcbiAgICBzZWxlY3RlZDogZnVuY3Rpb24gKGZyb21FbCwgdmFsdWUpIHtcbiAgICAgIGZyb21FbC5zZWxlY3RlZCA9IHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKGZyb21FbCwgdmFsdWUpIHtcbiAgICAgIGZyb21FbC52YWx1ZSA9IHZhbHVlID09PSB1bmRlZmluZWQgPyBcIlwiIDogdmFsdWU7XG4gICAgfSxcbiAgICBjaGVja2VkOiBmdW5jdGlvbiAoZnJvbUVsLCB2YWx1ZSkge1xuICAgICAgZnJvbUVsLmNoZWNrZWQgPSB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHN3aXRjaCAodmFsdWUudG9TdHJpbmcpIHtcbiAgICAgICAgY2FzZSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nOlxuICAgICAgICBjYXNlIEFycmF5LnByb3RvdHlwZS50b1N0cmluZzpcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgICAgIFwiUmVseWluZyBvbiBKU09OLnN0cmluZ2lmeSBmb3IgYXR0cmlidXRlIHZhbHVlcyBpcyBkZXByZWNhdGVkLCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgTWFya28gdGhlc2Ugd2lsbCBiZSBjYXN0IHRvIHN0cmluZ3MgaW5zdGVhZC5cIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgIGNhc2UgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZzpcbiAgICAgICAgICByZXR1cm4gdmFsdWUuc291cmNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgKyBcIlwiO1xufVxuXG5mdW5jdGlvbiBhc3NpZ24oYSwgYikge1xuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleSkpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gVkVsZW1lbnRDbG9uZShvdGhlcikge1xuICB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbCA9IG90aGVyLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbDtcbiAgdGhpcy5fX19wYXJlbnROb2RlID0gbnVsbDtcbiAgdGhpcy5fX19uZXh0U2libGluZ0ludGVybmFsID0gbnVsbDtcblxuICB0aGlzLl9fX2tleSA9IG90aGVyLl9fX2tleTtcbiAgdGhpcy5fX19hdHRyaWJ1dGVzID0gb3RoZXIuX19fYXR0cmlidXRlcztcbiAgdGhpcy5fX19wcm9wZXJ0aWVzID0gb3RoZXIuX19fcHJvcGVydGllcztcbiAgdGhpcy5fX19ub2RlTmFtZSA9IG90aGVyLl9fX25vZGVOYW1lO1xuICB0aGlzLl9fX2ZsYWdzID0gb3RoZXIuX19fZmxhZ3M7XG4gIHRoaXMuX19fdmFsdWVJbnRlcm5hbCA9IG90aGVyLl9fX3ZhbHVlSW50ZXJuYWw7XG4gIHRoaXMuX19fY29uc3RJZCA9IG90aGVyLl9fX2NvbnN0SWQ7XG59XG5cbmZ1bmN0aW9uIFZFbGVtZW50KFxuICB0YWdOYW1lLFxuICBhdHRycyxcbiAga2V5LFxuICBvd25lckNvbXBvbmVudCxcbiAgY2hpbGRDb3VudCxcbiAgZmxhZ3MsXG4gIHByb3BzLFxuKSB7XG4gIHRoaXMuX19fVk5vZGUoY2hpbGRDb3VudCwgb3duZXJDb21wb25lbnQpO1xuXG4gIHZhciBjb25zdElkO1xuXG4gIGlmIChwcm9wcykge1xuICAgIGNvbnN0SWQgPSBwcm9wcy5pO1xuICB9XG5cbiAgdGhpcy5fX19rZXkgPSBrZXk7XG4gIHRoaXMuX19fZmxhZ3MgPSBmbGFncyB8fCAwO1xuICB0aGlzLl9fX2F0dHJpYnV0ZXMgPSBhdHRycyB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHRoaXMuX19fcHJvcGVydGllcyA9IHByb3BzIHx8IEVNUFRZX09CSkVDVDtcbiAgdGhpcy5fX19ub2RlTmFtZSA9IHRhZ05hbWU7XG4gIHRoaXMuX19fdmFsdWVJbnRlcm5hbCA9IFwiXCI7XG4gIHRoaXMuX19fY29uc3RJZCA9IGNvbnN0SWQ7XG4gIHRoaXMuX19fcHJlc2VydmUgPSBmYWxzZTtcbiAgdGhpcy5fX19wcmVzZXJ2ZUJvZHkgPSBmYWxzZTtcbn1cblxuVkVsZW1lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMSxcblxuICBfX19jbG9uZU5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZFbGVtZW50Q2xvbmUodGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCBtZXRob2QgZm9yIGNyZWF0aW5nIGFuZCBhcHBlbmRpbmcgYW4gSFRNTCBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGFnTmFtZSAgICBUaGUgdGFnIG5hbWUgKGUuZy4gXCJkaXZcIilcbiAgICogQHBhcmFtICB7aW50fG51bGx9IGF0dHJDb3VudCAgVGhlIG51bWJlciBvZiBhdHRyaWJ1dGVzIChvciBgbnVsbGAgaWYgbm90IGtub3duKVxuICAgKiBAcGFyYW0gIHtpbnR8bnVsbH0gY2hpbGRDb3VudCBUaGUgbnVtYmVyIG9mIGNoaWxkIG5vZGVzIChvciBgbnVsbGAgaWYgbm90IGtub3duKVxuICAgKi9cbiAgZTogZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBrZXksIG93bmVyQ29tcG9uZW50LCBjaGlsZENvdW50LCBmbGFncywgcHJvcHMpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLl9fX2FwcGVuZENoaWxkKFxuICAgICAgbmV3IFZFbGVtZW50KFxuICAgICAgICB0YWdOYW1lLFxuICAgICAgICBhdHRycyxcbiAgICAgICAga2V5LFxuICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgY2hpbGRDb3VudCxcbiAgICAgICAgZmxhZ3MsXG4gICAgICAgIHByb3BzLFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgaWYgKGNoaWxkQ291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl9fX2ZpbmlzaENoaWxkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCBtZXRob2QgZm9yIGNyZWF0aW5nIGFuZCBhcHBlbmRpbmcgYSBzdGF0aWMgbm9kZS4gVGhlIHByb3ZpZGVkIG5vZGUgaXMgYXV0b21hdGljYWxseSBjbG9uZWRcbiAgICogdXNpbmcgYSBzaGFsbG93IGNsb25lIHNpbmNlIGl0IHdpbGwgYmUgbXV0YXRlZCBhcyBhIHJlc3VsdCBvZiBzZXR0aW5nIGBuZXh0U2libGluZ2AgYW5kIGBwYXJlbnROb2RlYC5cbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgZm9yIHRoZSBuZXcgQ29tbWVudCBub2RlXG4gICAqL1xuICBuOiBmdW5jdGlvbiAobm9kZSwgb3duZXJDb21wb25lbnQpIHtcbiAgICBub2RlID0gbm9kZS5fX19jbG9uZU5vZGUoKTtcbiAgICBub2RlLl9fX293bmVyQ29tcG9uZW50ID0gb3duZXJDb21wb25lbnQ7XG4gICAgdGhpcy5fX19hcHBlbmRDaGlsZChub2RlKTtcbiAgICByZXR1cm4gdGhpcy5fX19maW5pc2hDaGlsZCgpO1xuICB9LFxuXG4gIF9fX2FjdHVhbGl6ZTogZnVuY3Rpb24gKGhvc3QsIHBhcmVudE5hbWVzcGFjZVVSSSkge1xuICAgIHZhciB0YWdOYW1lID0gdGhpcy5fX19ub2RlTmFtZTtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuX19fYXR0cmlidXRlcztcbiAgICB2YXIgbmFtZXNwYWNlVVJJID0gREVGQVVMVF9OU1t0YWdOYW1lXSB8fCBwYXJlbnROYW1lc3BhY2VVUkkgfHwgTlNfSFRNTDtcblxuICAgIHZhciBmbGFncyA9IHRoaXMuX19fZmxhZ3M7XG4gICAgdmFyIGVsID0gKGhvc3Qub3duZXJEb2N1bWVudCB8fCBob3N0KS5jcmVhdGVFbGVtZW50TlMoXG4gICAgICBuYW1lc3BhY2VVUkksXG4gICAgICB0YWdOYW1lLFxuICAgICk7XG5cbiAgICBpZiAoZmxhZ3MgJiBGTEFHX0NVU1RPTV9FTEVNRU5UKSB7XG4gICAgICBhc3NpZ24oZWwsIGF0dHJpYnV0ZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBhdHRyVmFsdWUgPSBub3JtYWxpemVWYWx1ZShhdHRyaWJ1dGVzW2F0dHJOYW1lXSk7XG5cbiAgICAgICAgaWYgKGF0dHJWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKGF0dHJOYW1lID09IEFUVFJfWExJTktfSFJFRikge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlTlMoTlNfWExJTkssIEFUVFJfSFJFRiwgYXR0clZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGFnTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICAgIGVsLmRlZmF1bHRWYWx1ZSA9IHRoaXMuX19fdmFsdWVJbnRlcm5hbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoZWwsIHRoaXMpO1xuXG4gICAgcmV0dXJuIGVsO1xuICB9LFxufTtcblxuaW5oZXJpdChWRWxlbWVudCwgVk5vZGUpO1xuXG5WRWxlbWVudENsb25lLnByb3RvdHlwZSA9IFZFbGVtZW50LnByb3RvdHlwZTtcblxuZnVuY3Rpb24gdmlydHVhbGl6ZUVsZW1lbnQobm9kZSwgdmlydHVhbGl6ZUNoaWxkTm9kZXMsIG93bmVyQ29tcG9uZW50KSB7XG4gIHZhciBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuICB2YXIgYXR0ckNvdW50ID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgdmFyIGF0dHJzID0gbnVsbDtcbiAgdmFyIHByb3BzID0gbnVsbDtcblxuICBpZiAoYXR0ckNvdW50KSB7XG4gICAgYXR0cnMgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJDb3VudDsgaSsrKSB7XG4gICAgICB2YXIgYXR0ciA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICBpZiAoIXhtbG5zUmVnRXhwLnRlc3QoYXR0ck5hbWUpKSB7XG4gICAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJkYXRhLW1hcmtvXCIpIHtcbiAgICAgICAgICBwcm9wcyA9IGNvbXBvbmVudHNVdGlsLl9fX2dldE1hcmtvUHJvcHNGcm9tRWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0ci5uYW1lc3BhY2VVUkkgPT09IE5TX1hMSU5LKSB7XG4gICAgICAgICAgYXR0cnNbQVRUUl9YTElOS19IUkVGXSA9IGF0dHIudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXR0cnNbYXR0ck5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciB0YWdOYW1lID0gbm9kZS5ub2RlTmFtZTtcblxuICBpZiAobm9kZS5uYW1lc3BhY2VVUkkgPT09IE5TX0hUTUwpIHtcbiAgICB0YWdOYW1lID0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdmFyIHZkb21FbCA9IG5ldyBWRWxlbWVudChcbiAgICB0YWdOYW1lLFxuICAgIGF0dHJzLFxuICAgIG51bGwgLyprZXkqLyxcbiAgICBvd25lckNvbXBvbmVudCxcbiAgICAwIC8qY2hpbGQgY291bnQqLyxcbiAgICAwIC8qZmxhZ3MqLyxcbiAgICBwcm9wcyxcbiAgKTtcblxuICBpZiAodmRvbUVsLl9fX25vZGVOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICB2ZG9tRWwuX19fdmFsdWVJbnRlcm5hbCA9IG5vZGUudmFsdWU7XG4gIH0gZWxzZSBpZiAodmlydHVhbGl6ZUNoaWxkTm9kZXMpIHtcbiAgICB2aXJ0dWFsaXplQ2hpbGROb2Rlcyhub2RlLCB2ZG9tRWwsIG93bmVyQ29tcG9uZW50KTtcbiAgfVxuXG4gIHJldHVybiB2ZG9tRWw7XG59XG5cblZFbGVtZW50Ll9fX3ZpcnR1YWxpemUgPSB2aXJ0dWFsaXplRWxlbWVudDtcblxuVkVsZW1lbnQuX19fbW9ycGhBdHRycyA9IGZ1bmN0aW9uIChmcm9tRWwsIHZGcm9tRWwsIHRvRWwpIHtcbiAgdmFyIGZyb21GbGFncyA9IHZGcm9tRWwuX19fZmxhZ3M7XG4gIHZhciB0b0ZsYWdzID0gdG9FbC5fX19mbGFncztcbiAgdmFyIGF0dHJzID0gdG9FbC5fX19hdHRyaWJ1dGVzO1xuXG4gIGlmICh0b0ZsYWdzICYgRkxBR19DVVNUT01fRUxFTUVOVCkge1xuICAgIHJldHVybiBhc3NpZ24oZnJvbUVsLCBhdHRycyk7XG4gIH1cblxuICB2YXIgcHJvcHMgPSB0b0VsLl9fX3Byb3BlcnRpZXM7XG4gIHZhciBhdHRyTmFtZTtcblxuICAvLyBXZSB1c2UgZXhwYW5kbyBwcm9wZXJ0aWVzIHRvIGFzc29jaWF0ZSB0aGUgcHJldmlvdXMgSFRNTFxuICAvLyBhdHRyaWJ1dGVzIHByb3ZpZGVkIGFzIHBhcnQgb2YgdGhlIFZET00gbm9kZSB3aXRoIHRoZVxuICAvLyByZWFsIFZFbGVtZW50IERPTSBub2RlLiBXaGVuIGRpZmZpbmcgYXR0cmlidXRlcyxcbiAgLy8gd2Ugb25seSB1c2Ugb3VyIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdHRyaWJ1dGVzLlxuICAvLyBXaGVuIGRpZmZpbmcgZm9yIHRoZSBmaXJzdCB0aW1lIGl0J3MgcG9zc2libGUgdGhhdCB0aGVcbiAgLy8gcmVhbCBWRWxlbWVudCBub2RlIHdpbGwgbm90IGhhdmUgdGhlIGV4cGFuZG8gcHJvcGVydHlcbiAgLy8gc28gd2UgYnVpbGQgdGhlIGF0dHJpYnV0ZSBtYXAgZnJvbSB0aGUgZXhwYW5kbyBwcm9wZXJ0eVxuXG4gIHZhciBvbGRBdHRycyA9IHZGcm9tRWwuX19fYXR0cmlidXRlcztcblxuICBpZiAob2xkQXR0cnMgPT09IGF0dHJzKSB7XG4gICAgLy8gRm9yIGNvbnN0YW50IGF0dHJpYnV0ZXMgdGhlIHNhbWUgb2JqZWN0IHdpbGwgYmUgcHJvdmlkZWRcbiAgICAvLyBldmVyeSByZW5kZXIgYW5kIHdlIGNhbiB1c2UgdGhhdCB0byBvdXIgYWR2YW50YWdlIHRvXG4gICAgLy8gbm90IHdhc3RlIHRpbWUgZGlmZmluZyBhIGNvbnN0YW50LCBpbW11dGFibGUgYXR0cmlidXRlXG4gICAgLy8gbWFwLlxuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBhdHRyVmFsdWU7XG5cbiAgaWYgKHRvRmxhZ3MgJiBGTEFHX1NJTVBMRV9BVFRSUyAmJiBmcm9tRmxhZ3MgJiBGTEFHX1NJTVBMRV9BVFRSUykge1xuICAgIGlmIChvbGRBdHRyc1tcImNsYXNzXCJdICE9PSAoYXR0clZhbHVlID0gYXR0cnNbXCJjbGFzc1wiXSkpIHtcbiAgICAgIGlmIChhdHRyVmFsdWUpIHtcbiAgICAgICAgZnJvbUVsLmNsYXNzTmFtZSA9IGF0dHJWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9sZEF0dHJzLmlkICE9PSAoYXR0clZhbHVlID0gYXR0cnMuaWQpKSB7XG4gICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgIGZyb21FbC5pZCA9IGF0dHJWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9sZEF0dHJzLnN0eWxlICE9PSAoYXR0clZhbHVlID0gYXR0cnMuc3R5bGUpKSB7XG4gICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgIGZyb21FbC5zdHlsZS5jc3NUZXh0ID0gYXR0clZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcHJlc2VydmUgPSAocHJvcHMgJiYgcHJvcHMucGEpIHx8IEVNUFRZX09CSkVDVDtcbiAgdmFyIHNwZWNpYWxBdHRycyA9IHNwZWNpYWxFbEhhbmRsZXJzW3RvRWwuX19fbm9kZU5hbWVdIHx8IEVNUFRZX09CSkVDVDtcbiAgdmFyIHNwZWNpYWxBdHRyO1xuXG4gIC8vIExvb3Agb3ZlciBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgaW4gdGhlIGF0dHJpYnV0ZSBtYXAgYW5kIGNvbXBhcmVcbiAgLy8gdGhlbSB0byB0aGUgdmFsdWUgaW4gdGhlIG9sZCBtYXAuIEhvd2V2ZXIsIGlmIHRoZSB2YWx1ZSBpc1xuICAvLyBudWxsL3VuZGVmaW5lZC9mYWxzZSB0aGVuIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBhdHRyaWJ1dGVcbiAgZm9yIChhdHRyTmFtZSBpbiBhdHRycykge1xuICAgIGlmIChcbiAgICAgICFwcmVzZXJ2ZVthdHRyTmFtZV0gJiZcbiAgICAgIG5vcm1hbGl6ZVZhbHVlKG9sZEF0dHJzW2F0dHJOYW1lXSkgIT09XG4gICAgICAgIChhdHRyVmFsdWUgPSBub3JtYWxpemVWYWx1ZShhdHRyc1thdHRyTmFtZV0pKVxuICAgICkge1xuICAgICAgaWYgKChzcGVjaWFsQXR0ciA9IHNwZWNpYWxBdHRyc1thdHRyTmFtZV0pKSB7XG4gICAgICAgIHNwZWNpYWxBdHRyKGZyb21FbCwgYXR0clZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IEFUVFJfWExJTktfSFJFRikge1xuICAgICAgICBpZiAoYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlTlMoTlNfWExJTkssIEFUVFJfSFJFRik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZU5TKE5TX1hMSU5LLCBBVFRSX0hSRUYsIGF0dHJWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHRoZXJlIGFyZSBhbnkgb2xkIGF0dHJpYnV0ZXMgdGhhdCBhcmUgbm90IGluIHRoZSBuZXcgc2V0IG9mIGF0dHJpYnV0ZXNcbiAgLy8gdGhlbiB3ZSBuZWVkIHRvIHJlbW92ZSB0aG9zZSBhdHRyaWJ1dGVzIGZyb20gdGhlIHRhcmdldCBub2RlXG4gIC8vXG4gIC8vIE5PVEU6IFdlIGNhbiBza2lwIHRoaXMgaWYgdGhlIHRoZSBlbGVtZW50IGlzIGtleWVkIGFuZCBkaWRuJ3QgaGF2ZSBzcHJlYWQgYXR0cmlidXRlc1xuICAvLyAgICAgICBiZWNhdXNlIHdlIGtub3cgd2UgYWxyZWFkeSBwcm9jZXNzZWQgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIGZvclxuICAvLyAgICAgICBib3RoIHRoZSB0YXJnZXQgYW5kIG9yaWdpbmFsIGVsZW1lbnQgc2luY2UgdGFyZ2V0IFZFbGVtZW50IG5vZGVzIHdpbGxcbiAgLy8gICAgICAgaGF2ZSBhbGwgYXR0cmlidXRlcyBkZWNsYXJlZC4gSG93ZXZlciwgd2UgY2FuIG9ubHkgc2tpcCBpZiB0aGUgbm9kZVxuICAvLyAgICAgICB3YXMgbm90IGEgdmlydHVhbGl6ZWQgbm9kZSAoaS5lLiwgYSBub2RlIHRoYXQgd2FzIG5vdCByZW5kZXJlZCBieSBhXG4gIC8vICAgICAgIE1hcmtvIHRlbXBsYXRlLCBidXQgcmF0aGVyIGEgbm9kZSB0aGF0IHdhcyBjcmVhdGVkIGZyb20gYW4gSFRNTFxuICAvLyAgICAgICBzdHJpbmcgb3IgYSByZWFsIERPTSBub2RlKS5cbiAgaWYgKHRvRWwuX19fa2V5ID09PSBudWxsIHx8IGZyb21GbGFncyAmIEZMQUdfU1BSRUFEX0FUVFJTKSB7XG4gICAgZm9yIChhdHRyTmFtZSBpbiBvbGRBdHRycykge1xuICAgICAgaWYgKCEoYXR0ck5hbWUgaW4gYXR0cnMpKSB7XG4gICAgICAgIGlmICgoc3BlY2lhbEF0dHIgPSBzcGVjaWFsQXR0cnNbYXR0ck5hbWVdKSkge1xuICAgICAgICAgIHNwZWNpYWxBdHRyKGZyb21FbCwgdW5kZWZpbmVkKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gQVRUUl9YTElOS19IUkVGKSB7XG4gICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZU5TKEFUVFJfWExJTktfSFJFRiwgQVRUUl9IUkVGKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWRWxlbWVudDtcbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGtleXNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2tleUJ5RE9NTm9kZTtcbnZhciB2RWxlbWVudEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fdkVsZW1lbnRCeURPTU5vZGU7XG52YXIgY3JlYXRlRnJhZ21lbnROb2RlID0gcmVxdWlyZShcIi4vbW9ycGhkb20vZnJhZ21lbnRcIikuX19fY3JlYXRlRnJhZ21lbnROb2RlO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG5cbmZ1bmN0aW9uIFZGcmFnbWVudChrZXksIG93bmVyQ29tcG9uZW50LCBwcmVzZXJ2ZSkge1xuICB0aGlzLl9fX1ZOb2RlKG51bGwgLyogY2hpbGRDb3VudCAqLywgb3duZXJDb21wb25lbnQpO1xuICB0aGlzLl9fX2tleSA9IGtleTtcbiAgdGhpcy5fX19wcmVzZXJ2ZSA9IHByZXNlcnZlO1xufVxuXG5WRnJhZ21lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMTIsXG4gIF9fX2FjdHVhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmcmFnbWVudCA9IGNyZWF0ZUZyYWdtZW50Tm9kZSgpO1xuICAgIGtleXNCeURPTU5vZGUuc2V0KGZyYWdtZW50LCB0aGlzLl9fX2tleSk7XG4gICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGZyYWdtZW50LCB0aGlzKTtcbiAgICByZXR1cm4gZnJhZ21lbnQ7XG4gIH0sXG59O1xuXG5pbmhlcml0KFZGcmFnbWVudCwgVk5vZGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZGcmFnbWVudDtcbiIsIi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cbmZ1bmN0aW9uIFZOb2RlKCkge31cblxuVk5vZGUucHJvdG90eXBlID0ge1xuICBfX19WTm9kZTogZnVuY3Rpb24gKGZpbmFsQ2hpbGRDb3VudCwgb3duZXJDb21wb25lbnQpIHtcbiAgICB0aGlzLl9fX2ZpbmFsQ2hpbGRDb3VudCA9IGZpbmFsQ2hpbGRDb3VudDtcbiAgICB0aGlzLl9fX2NoaWxkQ291bnQgPSAwO1xuICAgIHRoaXMuX19fZmlyc3RDaGlsZEludGVybmFsID0gbnVsbDtcbiAgICB0aGlzLl9fX2xhc3RDaGlsZCA9IG51bGw7XG4gICAgdGhpcy5fX19wYXJlbnROb2RlID0gbnVsbDtcbiAgICB0aGlzLl9fX25leHRTaWJsaW5nSW50ZXJuYWwgPSBudWxsO1xuICAgIHRoaXMuX19fb3duZXJDb21wb25lbnQgPSBvd25lckNvbXBvbmVudDtcbiAgfSxcblxuICBnZXQgX19fZmlyc3RDaGlsZCgpIHtcbiAgICB2YXIgZmlyc3RDaGlsZCA9IHRoaXMuX19fZmlyc3RDaGlsZEludGVybmFsO1xuXG4gICAgaWYgKGZpcnN0Q2hpbGQgJiYgZmlyc3RDaGlsZC5fX19Eb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICB2YXIgbmVzdGVkRmlyc3RDaGlsZCA9IGZpcnN0Q2hpbGQuX19fZmlyc3RDaGlsZDtcbiAgICAgIC8vIFRoZSBmaXJzdCBjaGlsZCBpcyBhIERvY3VtZW50RnJhZ21lbnQgbm9kZS5cbiAgICAgIC8vIElmIHRoZSBEb2N1bWVudEZyYWdtZW50IG5vZGUgaGFzIGEgZmlyc3QgY2hpbGQgdGhlbiB3ZSB3aWxsIHJldHVybiB0aGF0LlxuICAgICAgLy8gT3RoZXJ3aXNlLCB0aGUgRG9jdW1lbnRGcmFnbWVudCBub2RlIGlzIG5vdCAqcmVhbGx5KiB0aGUgZmlyc3QgY2hpbGQgYW5kXG4gICAgICAvLyB3ZSBuZWVkIHRvIHNraXAgdG8gaXRzIG5leHQgc2libGluZ1xuICAgICAgcmV0dXJuIG5lc3RlZEZpcnN0Q2hpbGQgfHwgZmlyc3RDaGlsZC5fX19uZXh0U2libGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gZmlyc3RDaGlsZDtcbiAgfSxcblxuICBnZXQgX19fbmV4dFNpYmxpbmcoKSB7XG4gICAgdmFyIG5leHRTaWJsaW5nID0gdGhpcy5fX19uZXh0U2libGluZ0ludGVybmFsO1xuXG4gICAgaWYgKG5leHRTaWJsaW5nKSB7XG4gICAgICBpZiAobmV4dFNpYmxpbmcuX19fRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICB2YXIgZmlyc3RDaGlsZCA9IG5leHRTaWJsaW5nLl9fX2ZpcnN0Q2hpbGQ7XG4gICAgICAgIHJldHVybiBmaXJzdENoaWxkIHx8IG5leHRTaWJsaW5nLl9fX25leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGFyZW50Tm9kZSA9IHRoaXMuX19fcGFyZW50Tm9kZTtcbiAgICAgIGlmIChwYXJlbnROb2RlICYmIHBhcmVudE5vZGUuX19fRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICByZXR1cm4gcGFyZW50Tm9kZS5fX19uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFNpYmxpbmc7XG4gIH0sXG5cbiAgX19fYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHRoaXMuX19fY2hpbGRDb3VudCsrO1xuXG4gICAgaWYgKHRoaXMuX19fbm9kZU5hbWUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgaWYgKGNoaWxkLl9fX1RleHQpIHtcbiAgICAgICAgdGhpcy5fX192YWx1ZUludGVybmFsICs9IGNoaWxkLl9fX25vZGVWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGFzdENoaWxkID0gdGhpcy5fX19sYXN0Q2hpbGQ7XG5cbiAgICAgIGNoaWxkLl9fX3BhcmVudE5vZGUgPSB0aGlzO1xuXG4gICAgICBpZiAobGFzdENoaWxkKSB7XG4gICAgICAgIGxhc3RDaGlsZC5fX19uZXh0U2libGluZ0ludGVybmFsID0gY2hpbGQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbCA9IGNoaWxkO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9fX2xhc3RDaGlsZCA9IGNoaWxkO1xuICAgIH1cblxuICAgIHJldHVybiBjaGlsZDtcbiAgfSxcblxuICBfX19maW5pc2hDaGlsZDogZnVuY3Rpb24gZmluaXNoQ2hpbGQoKSB7XG4gICAgaWYgKHRoaXMuX19fY2hpbGRDb3VudCA9PT0gdGhpcy5fX19maW5hbENoaWxkQ291bnQgJiYgdGhpcy5fX19wYXJlbnROb2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX19wYXJlbnROb2RlLl9fX2ZpbmlzaENoaWxkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSxcblxuICAvLyAsdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgLy8gICAgIHZhciBjbG9uZSA9IE9iamVjdC5hc3NpZ24oe1xuICAvLyAgICAgICAgIG5vZGVUeXBlOiB0aGlzLm5vZGVUeXBlXG4gIC8vICAgICB9LCB0aGlzKTtcbiAgLy9cbiAgLy8gICAgIGZvciAodmFyIGsgaW4gY2xvbmUpIHtcbiAgLy8gICAgICAgICBpZiAoay5zdGFydHNXaXRoKCdfJykpIHtcbiAgLy8gICAgICAgICAgICAgZGVsZXRlIGNsb25lW2tdO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICAgIGRlbGV0ZSBjbG9uZS5fbmV4dFNpYmxpbmc7XG4gIC8vICAgICBkZWxldGUgY2xvbmUuX2xhc3RDaGlsZDtcbiAgLy8gICAgIGRlbGV0ZSBjbG9uZS5wYXJlbnROb2RlO1xuICAvLyAgICAgcmV0dXJuIGNsb25lO1xuICAvLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZOb2RlO1xuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWVGV4dCh2YWx1ZSwgb3duZXJDb21wb25lbnQpIHtcbiAgdGhpcy5fX19WTm9kZSgtMSAvKiBubyBjaGlsZHJlbiAqLywgb3duZXJDb21wb25lbnQpO1xuICB0aGlzLl9fX25vZGVWYWx1ZSA9IHZhbHVlO1xufVxuXG5WVGV4dC5wcm90b3R5cGUgPSB7XG4gIF9fX1RleHQ6IHRydWUsXG5cbiAgX19fbm9kZVR5cGU6IDMsXG5cbiAgX19fYWN0dWFsaXplOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHJldHVybiAoaG9zdC5vd25lckRvY3VtZW50IHx8IGhvc3QpLmNyZWF0ZVRleHROb2RlKHRoaXMuX19fbm9kZVZhbHVlKTtcbiAgfSxcblxuICBfX19jbG9uZU5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZUZXh0KHRoaXMuX19fbm9kZVZhbHVlKTtcbiAgfSxcbn07XG5cbmluaGVyaXQoVlRleHQsIFZOb2RlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWVGV4dDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIGNsYXNzSGVscGVyID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvY2xhc3MtdmFsdWVcIik7XG52YXIgc3R5bGVIZWxwZXIgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9zdHlsZS12YWx1ZVwiKTtcbnZhciBwYXJzZUhUTUwgPSByZXF1aXJlKFwiLi4vcGFyc2UtaHRtbFwiKTtcblxuLyoqXG4gKiBIZWxwZXIgZm9yIHByb2Nlc3NpbmcgZHluYW1pYyBhdHRyaWJ1dGVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICBcIlBhc3NpbmcgYSBzdHJpbmcgYXMgYSBkeW5hbWljIGF0dHJpYnV0ZSB2YWx1ZSBpcyBkZXByZWNhdGVkIC0gTW9yZSBkZXRhaWxzOiBodHRwczovL2dpdGh1Yi5jb20vbWFya28tanMvbWFya28vd2lraS9EZXByZWNhdGlvbjotU3RyaW5nLWFzLWR5bmFtaWMtYXR0cmlidXRlLXZhbHVlXCIsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VBdHRycyhhdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgdmFyIG5ld0F0dHJpYnV0ZXMgPSB7fTtcblxuICAgIGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgIHZhciB2YWwgPSBhdHRyaWJ1dGVzW2F0dHJOYW1lXTtcbiAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJyZW5kZXJCb2R5XCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgIHZhbCA9IGNsYXNzSGVscGVyKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgdmFsID0gc3R5bGVIZWxwZXIodmFsKTtcbiAgICAgIH1cblxuICAgICAgbmV3QXR0cmlidXRlc1thdHRyTmFtZV0gPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0F0dHJpYnV0ZXM7XG4gIH1cblxuICByZXR1cm4gYXR0cmlidXRlcztcbn07XG5cbmZ1bmN0aW9uIHBhcnNlQXR0cnMoc3RyKSB7XG4gIGlmIChzdHIgPT09IFwiXCIpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICB2YXIgYXR0cnMgPSBwYXJzZUhUTUwoXCI8YSBcIiArIHN0ciArIFwiPlwiKS5hdHRyaWJ1dGVzO1xuICB2YXIgcmVzdWx0ID0ge307XG4gIHZhciBhdHRyO1xuXG4gIGZvciAodmFyIGxlbiA9IGF0dHJzLmxlbmd0aCwgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGF0dHIgPSBhdHRyc1tpXTtcbiAgICByZXN1bHRbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbndpbmRvdy5NYXJrbyA9IHtcbiAgQ29tcG9uZW50OiBmdW5jdGlvbiAoKSB7fSxcbn07XG5cbi8qKlxuICogTWV0aG9kIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5LiBUaGlzIG1ldGhvZFxuICogaXMgaW52b2tlZCBieSBjb2RlIGluIGEgY29tcGlsZWQgTWFya28gdGVtcGxhdGUgYW5kXG4gKiBpdCBpcyB1c2VkIHRvIGNyZWF0ZSBhIG5ldyBUZW1wbGF0ZSBpbnN0YW5jZS5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMudCA9IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlKHR5cGVOYW1lKSB7XG4gIHJldHVybiBuZXcgVGVtcGxhdGUodHlwZU5hbWUpO1xufTtcblxuZnVuY3Rpb24gVGVtcGxhdGUodHlwZU5hbWUpIHtcbiAgdGhpcy5wYXRoID0gdGhpcy5fX190eXBlTmFtZSA9IHR5cGVOYW1lO1xufVxuXG52YXIgQXN5bmNWRE9NQnVpbGRlciA9IHJlcXVpcmUoXCIuL0FzeW5jVkRPTUJ1aWxkZXJcIik7XG5yZXF1aXJlKFwiLi4vY3JlYXRlT3V0XCIpLl9fX3NldENyZWF0ZU91dChcbiAgKFRlbXBsYXRlLnByb3RvdHlwZS5jcmVhdGVPdXQgPSBmdW5jdGlvbiBjcmVhdGVPdXQoXG4gICAgZ2xvYmFsRGF0YSxcbiAgICBwYXJlbnQsXG4gICAgcGFyZW50T3V0LFxuICApIHtcbiAgICByZXR1cm4gbmV3IEFzeW5jVkRPTUJ1aWxkZXIoZ2xvYmFsRGF0YSwgcGFyZW50LCBwYXJlbnRPdXQpO1xuICB9KSxcbik7XG5cbnJlcXVpcmUoXCIuLi9yZW5kZXJhYmxlXCIpKFRlbXBsYXRlLnByb3RvdHlwZSk7XG4iLCJ2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XG52YXIgaW5zZXJ0QmVmb3JlID0gaGVscGVycy5fX19pbnNlcnRCZWZvcmU7XG5cbnZhciBmcmFnbWVudFByb3RvdHlwZSA9IHtcbiAgbm9kZVR5cGU6IDEyLFxuICBnZXQgZmlyc3RDaGlsZCgpIHtcbiAgICB2YXIgZmlyc3RDaGlsZCA9IHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nO1xuICAgIHJldHVybiBmaXJzdENoaWxkID09PSB0aGlzLmVuZE5vZGUgPyB1bmRlZmluZWQgOiBmaXJzdENoaWxkO1xuICB9LFxuICBnZXQgbGFzdENoaWxkKCkge1xuICAgIHZhciBsYXN0Q2hpbGQgPSB0aGlzLmVuZE5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgIHJldHVybiBsYXN0Q2hpbGQgPT09IHRoaXMuc3RhcnROb2RlID8gdW5kZWZpbmVkIDogbGFzdENoaWxkO1xuICB9LFxuICBnZXQgcGFyZW50Tm9kZSgpIHtcbiAgICB2YXIgcGFyZW50Tm9kZSA9IHRoaXMuc3RhcnROb2RlLnBhcmVudE5vZGU7XG4gICAgcmV0dXJuIHBhcmVudE5vZGUgPT09IHRoaXMuZGV0YWNoZWRDb250YWluZXIgPyB1bmRlZmluZWQgOiBwYXJlbnROb2RlO1xuICB9LFxuICBnZXQgbmFtZXNwYWNlVVJJKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0Tm9kZS5wYXJlbnROb2RlLm5hbWVzcGFjZVVSSTtcbiAgfSxcbiAgZ2V0IG5leHRTaWJsaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmVuZE5vZGUubmV4dFNpYmxpbmc7XG4gIH0sXG4gIGdldCBub2RlcygpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgaWYgKHRoaXMuX19fbWFya2Vyc1JlbW92ZWRFcnJvcikge1xuICAgICAgICB0aHJvdyB0aGlzLl9fX21hcmtlcnNSZW1vdmVkRXJyb3IoXCJDYW5ub3QgZ2V0IGZyYWdtZW50IG5vZGVzLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLnN0YXJ0Tm9kZTtcbiAgICB3aGlsZSAoY3VycmVudCAhPT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICBub2Rlcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIG5vZGVzLnB1c2goY3VycmVudCk7XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9LFxuICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChuZXdDaGlsZE5vZGUsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICB2YXIgYWN0dWFsUmVmZXJlbmNlID0gcmVmZXJlbmNlTm9kZSA9PSBudWxsID8gdGhpcy5lbmROb2RlIDogcmVmZXJlbmNlTm9kZTtcbiAgICByZXR1cm4gaW5zZXJ0QmVmb3JlKFxuICAgICAgbmV3Q2hpbGROb2RlLFxuICAgICAgYWN0dWFsUmVmZXJlbmNlLFxuICAgICAgdGhpcy5zdGFydE5vZGUucGFyZW50Tm9kZSxcbiAgICApO1xuICB9LFxuICBpbnNlcnRJbnRvOiBmdW5jdGlvbiAobmV3UGFyZW50Tm9kZSwgcmVmZXJlbmNlTm9kZSkge1xuICAgIHRoaXMubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgaW5zZXJ0QmVmb3JlKG5vZGUsIHJlZmVyZW5jZU5vZGUsIG5ld1BhcmVudE5vZGUpO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIHRoaXMuZGV0YWNoZWRDb250YWluZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudE5vZGUoc3RhcnROb2RlLCBuZXh0Tm9kZSwgcGFyZW50Tm9kZSkge1xuICB2YXIgZnJhZ21lbnQgPSBPYmplY3QuY3JlYXRlKGZyYWdtZW50UHJvdG90eXBlKTtcbiAgdmFyIGlzUm9vdCA9IHN0YXJ0Tm9kZSAmJiBzdGFydE5vZGUub3duZXJEb2N1bWVudCA9PT0gc3RhcnROb2RlLnBhcmVudE5vZGU7XG4gIGZyYWdtZW50LnN0YXJ0Tm9kZSA9IGlzUm9vdFxuICAgID8gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIlwiKVxuICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gIGZyYWdtZW50LmVuZE5vZGUgPSBpc1Jvb3RcbiAgICA/IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJcIilcbiAgICA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICBmcmFnbWVudC5zdGFydE5vZGUuZnJhZ21lbnQgPSBmcmFnbWVudDtcbiAgZnJhZ21lbnQuZW5kTm9kZS5mcmFnbWVudCA9IGZyYWdtZW50O1xuICB2YXIgZGV0YWNoZWRDb250YWluZXIgPSAoZnJhZ21lbnQuZGV0YWNoZWRDb250YWluZXIgPVxuICAgIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gIHBhcmVudE5vZGUgPVxuICAgIHBhcmVudE5vZGUgfHwgKHN0YXJ0Tm9kZSAmJiBzdGFydE5vZGUucGFyZW50Tm9kZSkgfHwgZGV0YWNoZWRDb250YWluZXI7XG4gIGluc2VydEJlZm9yZShmcmFnbWVudC5zdGFydE5vZGUsIHN0YXJ0Tm9kZSwgcGFyZW50Tm9kZSk7XG4gIGluc2VydEJlZm9yZShmcmFnbWVudC5lbmROb2RlLCBuZXh0Tm9kZSwgcGFyZW50Tm9kZSk7XG4gIHJldHVybiBmcmFnbWVudDtcbn1cblxuZnVuY3Rpb24gYmVnaW5GcmFnbWVudE5vZGUoc3RhcnROb2RlLCBwYXJlbnROb2RlKSB7XG4gIHZhciBmcmFnbWVudCA9IGNyZWF0ZUZyYWdtZW50Tm9kZShzdGFydE5vZGUsIG51bGwsIHBhcmVudE5vZGUpO1xuICBmcmFnbWVudC5fX19maW5pc2hGcmFnbWVudCA9IGZ1bmN0aW9uIChuZXh0Tm9kZSkge1xuICAgIGZyYWdtZW50Ll9fX2ZpbmlzaEZyYWdtZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUoXG4gICAgICBmcmFnbWVudC5lbmROb2RlLFxuICAgICAgbmV4dE5vZGUsXG4gICAgICBwYXJlbnROb2RlIHx8IHN0YXJ0Tm9kZS5wYXJlbnROb2RlLFxuICAgICk7XG4gIH07XG4gIHJldHVybiBmcmFnbWVudDtcbn1cblxuZXhwb3J0cy5fX19jcmVhdGVGcmFnbWVudE5vZGUgPSBjcmVhdGVGcmFnbWVudE5vZGU7XG5leHBvcnRzLl9fX2JlZ2luRnJhZ21lbnROb2RlID0gYmVnaW5GcmFnbWVudE5vZGU7XG4iLCJmdW5jdGlvbiBpbnNlcnRCZWZvcmUobm9kZSwgcmVmZXJlbmNlTm9kZSwgcGFyZW50Tm9kZSkge1xuICBpZiAobm9kZS5pbnNlcnRJbnRvKSB7XG4gICAgcmV0dXJuIG5vZGUuaW5zZXJ0SW50byhwYXJlbnROb2RlLCByZWZlcmVuY2VOb2RlKTtcbiAgfVxuICByZXR1cm4gcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgbm9kZSxcbiAgICAocmVmZXJlbmNlTm9kZSAmJiByZWZlcmVuY2VOb2RlLnN0YXJ0Tm9kZSkgfHwgcmVmZXJlbmNlTm9kZSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIobm9kZSwgcmVmZXJlbmNlTm9kZSwgcGFyZW50Tm9kZSkge1xuICByZXR1cm4gaW5zZXJ0QmVmb3JlKFxuICAgIG5vZGUsXG4gICAgcmVmZXJlbmNlTm9kZSAmJiByZWZlcmVuY2VOb2RlLm5leHRTaWJsaW5nLFxuICAgIHBhcmVudE5vZGUsXG4gICk7XG59XG5cbmZ1bmN0aW9uIG5leHRTaWJsaW5nKG5vZGUpIHtcbiAgdmFyIG5leHQgPSBub2RlLm5leHRTaWJsaW5nO1xuICB2YXIgZnJhZ21lbnQgPSBuZXh0ICYmIG5leHQuZnJhZ21lbnQ7XG4gIGlmIChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXh0ID09PSBmcmFnbWVudC5zdGFydE5vZGUgPyBmcmFnbWVudCA6IG51bGw7XG4gIH1cbiAgcmV0dXJuIG5leHQ7XG59XG5cbmZ1bmN0aW9uIGZpcnN0Q2hpbGQobm9kZSkge1xuICB2YXIgbmV4dCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgcmV0dXJuIChuZXh0ICYmIG5leHQuZnJhZ21lbnQpIHx8IG5leHQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkKG5vZGUpIHtcbiAgaWYgKG5vZGUucmVtb3ZlKSBub2RlLnJlbW92ZSgpO1xuICBlbHNlIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZXhwb3J0cy5fX19pbnNlcnRCZWZvcmUgPSBpbnNlcnRCZWZvcmU7XG5leHBvcnRzLl9fX2luc2VydEFmdGVyID0gaW5zZXJ0QWZ0ZXI7XG5leHBvcnRzLl9fX25leHRTaWJsaW5nID0gbmV4dFNpYmxpbmc7XG5leHBvcnRzLl9fX2ZpcnN0Q2hpbGQgPSBmaXJzdENoaWxkO1xuZXhwb3J0cy5fX19yZW1vdmVDaGlsZCA9IHJlbW92ZUNoaWxkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBleGlzdGluZ0NvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBkZXN0cm95Tm9kZVJlY3Vyc2l2ZSA9IGNvbXBvbmVudHNVdGlsLl9fX2Rlc3Ryb3lOb2RlUmVjdXJzaXZlO1xudmFyIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMgPVxuICBjb21wb25lbnRzVXRpbC5fX19hZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzO1xudmFyIG5vcm1hbGl6ZUNvbXBvbmVudEtleSA9IGNvbXBvbmVudHNVdGlsLl9fX25vcm1hbGl6ZUNvbXBvbmVudEtleTtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgZXZlbnREZWxlZ2F0aW9uID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvZXZlbnQtZGVsZWdhdGlvblwiKTtcbnZhciBLZXlTZXF1ZW5jZSA9IHJlcXVpcmUoXCIuLi8uLi9jb21wb25lbnRzL0tleVNlcXVlbmNlXCIpO1xudmFyIFZFbGVtZW50ID0gcmVxdWlyZShcIi4uL3Zkb21cIikuX19fVkVsZW1lbnQ7XG52YXIgZnJhZ21lbnQgPSByZXF1aXJlKFwiLi9mcmFnbWVudFwiKTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcbnZhciB2aXJ0dWFsaXplRWxlbWVudCA9IFZFbGVtZW50Ll9fX3ZpcnR1YWxpemU7XG52YXIgbW9ycGhBdHRycyA9IFZFbGVtZW50Ll9fX21vcnBoQXR0cnM7XG52YXIga2V5c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fa2V5QnlET01Ob2RlO1xudmFyIGNvbXBvbmVudEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIHZFbGVtZW50QnlET01Ob2RlID0gZG9tRGF0YS5fX192RWxlbWVudEJ5RE9NTm9kZTtcbnZhciBkZXRhY2hlZEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fZGV0YWNoZWRCeURPTU5vZGU7XG5cbnZhciBpbnNlcnRCZWZvcmUgPSBoZWxwZXJzLl9fX2luc2VydEJlZm9yZTtcbnZhciBpbnNlcnRBZnRlciA9IGhlbHBlcnMuX19faW5zZXJ0QWZ0ZXI7XG52YXIgbmV4dFNpYmxpbmcgPSBoZWxwZXJzLl9fX25leHRTaWJsaW5nO1xudmFyIGZpcnN0Q2hpbGQgPSBoZWxwZXJzLl9fX2ZpcnN0Q2hpbGQ7XG52YXIgcmVtb3ZlQ2hpbGQgPSBoZWxwZXJzLl9fX3JlbW92ZUNoaWxkO1xudmFyIGNyZWF0ZUZyYWdtZW50Tm9kZSA9IGZyYWdtZW50Ll9fX2NyZWF0ZUZyYWdtZW50Tm9kZTtcbnZhciBiZWdpbkZyYWdtZW50Tm9kZSA9IGZyYWdtZW50Ll9fX2JlZ2luRnJhZ21lbnROb2RlO1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG52YXIgQ09NUE9ORU5UX05PREUgPSAyO1xudmFyIEZSQUdNRU5UX05PREUgPSAxMjtcbnZhciBET0NUWVBFX05PREUgPSAxMDtcblxuLy8gdmFyIEZMQUdfU0lNUExFX0FUVFJTID0gMTtcbi8vIHZhciBGTEFHX0NVU1RPTV9FTEVNRU5UID0gMjtcbi8vIHZhciBGTEFHX1NQUkVBRF9BVFRSUyA9IDQ7XG5cbmZ1bmN0aW9uIGlzQXV0b0tleShrZXkpIHtcbiAgcmV0dXJuIGtleVswXSAhPT0gXCJAXCI7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVOb2RlTmFtZXMoZnJvbUVsLCB0b0VsKSB7XG4gIHJldHVybiBmcm9tRWwuX19fbm9kZU5hbWUgPT09IHRvRWwuX19fbm9kZU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNhc2VJbnNlbnNpdGl2ZUNvbXBhcmUoYSwgYikge1xuICByZXR1cm4gYS50b0xvd2VyQ2FzZSgpID09PSBiLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIG9uTm9kZUFkZGVkKG5vZGUsIGNvbXBvbmVudHNDb250ZXh0KSB7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICBldmVudERlbGVnYXRpb24uX19faGFuZGxlTm9kZUF0dGFjaChub2RlLCBjb21wb25lbnRzQ29udGV4dCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW9ycGhkb20oZnJvbU5vZGUsIHRvTm9kZSwgaG9zdCwgY29tcG9uZW50c0NvbnRleHQpIHtcbiAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0O1xuICB2YXIgaXNIeWRyYXRlID0gZmFsc2U7XG4gIHZhciBrZXlTZXF1ZW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGlmIChjb21wb25lbnRzQ29udGV4dCkge1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcbiAgICBpc0h5ZHJhdGUgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19pc0h5ZHJhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnRWaXJ0dWFsTm9kZUJlZm9yZShcbiAgICB2Tm9kZSxcbiAgICBrZXksXG4gICAgcmVmZXJlbmNlRWwsXG4gICAgcGFyZW50RWwsXG4gICAgb3duZXJDb21wb25lbnQsXG4gICAgcGFyZW50Q29tcG9uZW50LFxuICApIHtcbiAgICB2YXIgcmVhbE5vZGUgPSB2Tm9kZS5fX19hY3R1YWxpemUoaG9zdCwgcGFyZW50RWwubmFtZXNwYWNlVVJJKTtcbiAgICBpbnNlcnRCZWZvcmUocmVhbE5vZGUsIHJlZmVyZW5jZUVsLCBwYXJlbnRFbCk7XG5cbiAgICBpZiAoXG4gICAgICB2Tm9kZS5fX19ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFIHx8XG4gICAgICB2Tm9kZS5fX19ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERVxuICAgICkge1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBrZXlzQnlET01Ob2RlLnNldChyZWFsTm9kZSwga2V5KTtcbiAgICAgICAgKGlzQXV0b0tleShrZXkpID8gcGFyZW50Q29tcG9uZW50IDogb3duZXJDb21wb25lbnQpLl9fX2tleWVkRWxlbWVudHNbXG4gICAgICAgICAga2V5XG4gICAgICAgIF0gPSByZWFsTm9kZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZOb2RlLl9fX25vZGVOYW1lICE9PSBcInRleHRhcmVhXCIpIHtcbiAgICAgICAgbW9ycGhDaGlsZHJlbihyZWFsTm9kZSwgdk5vZGUsIHBhcmVudENvbXBvbmVudCk7XG4gICAgICB9XG5cbiAgICAgIG9uTm9kZUFkZGVkKHJlYWxOb2RlLCBjb21wb25lbnRzQ29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0VmlydHVhbENvbXBvbmVudEJlZm9yZShcbiAgICB2Q29tcG9uZW50LFxuICAgIHJlZmVyZW5jZU5vZGUsXG4gICAgcmVmZXJlbmNlTm9kZVBhcmVudEVsLFxuICAgIGNvbXBvbmVudCxcbiAgICBrZXksXG4gICAgb3duZXJDb21wb25lbnQsXG4gICAgcGFyZW50Q29tcG9uZW50LFxuICApIHtcbiAgICB2YXIgcm9vdE5vZGUgPSAoY29tcG9uZW50Ll9fX3Jvb3ROb2RlID0gaW5zZXJ0QmVmb3JlKFxuICAgICAgY3JlYXRlRnJhZ21lbnROb2RlKCksXG4gICAgICByZWZlcmVuY2VOb2RlLFxuICAgICAgcmVmZXJlbmNlTm9kZVBhcmVudEVsLFxuICAgICkpO1xuICAgIGNvbXBvbmVudEJ5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGNvbXBvbmVudCk7XG5cbiAgICBpZiAoa2V5ICYmIG93bmVyQ29tcG9uZW50KSB7XG4gICAgICBrZXkgPSBub3JtYWxpemVDb21wb25lbnRLZXkoa2V5LCBwYXJlbnRDb21wb25lbnQuaWQpO1xuICAgICAgYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyhcbiAgICAgICAgb3duZXJDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50cyxcbiAgICAgICAga2V5LFxuICAgICAgICByb290Tm9kZSxcbiAgICAgICAgY29tcG9uZW50LmlkLFxuICAgICAgKTtcbiAgICAgIGtleXNCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBrZXkpO1xuICAgIH1cblxuICAgIG1vcnBoQ29tcG9uZW50KGNvbXBvbmVudCwgdkNvbXBvbmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIHZDb21wb25lbnQpIHtcbiAgICBtb3JwaENoaWxkcmVuKGNvbXBvbmVudC5fX19yb290Tm9kZSwgdkNvbXBvbmVudCwgY29tcG9uZW50KTtcbiAgfVxuXG4gIHZhciBkZXRhY2hlZE5vZGVzID0gW107XG5cbiAgZnVuY3Rpb24gZGV0YWNoTm9kZShub2RlLCBwYXJlbnROb2RlLCBvd25lckNvbXBvbmVudCkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERSkge1xuICAgICAgZGV0YWNoZWROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgZGV0YWNoZWRCeURPTU5vZGUuc2V0KG5vZGUsIG93bmVyQ29tcG9uZW50IHx8IHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShub2RlKTtcbiAgICAgIHJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3lDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vcnBoQ2hpbGRyZW4oZnJvbU5vZGUsIHRvTm9kZSwgcGFyZW50Q29tcG9uZW50KSB7XG4gICAgdmFyIGN1ckZyb21Ob2RlQ2hpbGQgPSBmaXJzdENoaWxkKGZyb21Ob2RlKTtcbiAgICB2YXIgY3VyVG9Ob2RlQ2hpbGQgPSB0b05vZGUuX19fZmlyc3RDaGlsZDtcblxuICAgIHZhciBjdXJUb05vZGVLZXk7XG4gICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuICAgIHZhciBjdXJUb05vZGVUeXBlO1xuXG4gICAgdmFyIGZyb21OZXh0U2libGluZztcbiAgICB2YXIgdG9OZXh0U2libGluZztcbiAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG4gICAgdmFyIG1hdGNoaW5nRnJvbUNvbXBvbmVudDtcbiAgICB2YXIgY3VyVkZyb21Ob2RlQ2hpbGQ7XG4gICAgdmFyIGZyb21Db21wb25lbnQ7XG5cbiAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICB0b05leHRTaWJsaW5nID0gY3VyVG9Ob2RlQ2hpbGQuX19fbmV4dFNpYmxpbmc7XG4gICAgICBjdXJUb05vZGVUeXBlID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZVR5cGU7XG4gICAgICBjdXJUb05vZGVLZXkgPSBjdXJUb05vZGVDaGlsZC5fX19rZXk7XG5cbiAgICAgIC8vIFNraXAgPCFkb2N0eXBlPlxuICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQgJiYgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZSA9PT0gRE9DVFlQRV9OT0RFKSB7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG93bmVyQ29tcG9uZW50ID0gY3VyVG9Ob2RlQ2hpbGQuX19fb3duZXJDb21wb25lbnQgfHwgcGFyZW50Q29tcG9uZW50O1xuICAgICAgdmFyIHJlZmVyZW5jZUNvbXBvbmVudDtcblxuICAgICAgaWYgKGN1clRvTm9kZVR5cGUgPT09IENPTVBPTkVOVF9OT0RFKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBjdXJUb05vZGVDaGlsZC5fX19jb21wb25lbnQ7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAobWF0Y2hpbmdGcm9tQ29tcG9uZW50ID0gZXhpc3RpbmdDb21wb25lbnRMb29rdXBbY29tcG9uZW50LmlkXSkgPT09XG4gICAgICAgICAgdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgIGlmIChpc0h5ZHJhdGUpIHtcbiAgICAgICAgICAgIHZhciByb290Tm9kZSA9IGJlZ2luRnJhZ21lbnROb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX19yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgICAgICAgICAgY29tcG9uZW50QnlET01Ob2RlLnNldChyb290Tm9kZSwgY29tcG9uZW50KTtcblxuICAgICAgICAgICAgaWYgKG93bmVyQ29tcG9uZW50ICYmIGN1clRvTm9kZUtleSkge1xuICAgICAgICAgICAgICBjdXJUb05vZGVLZXkgPSBub3JtYWxpemVDb21wb25lbnRLZXkoXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudC5pZCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyhcbiAgICAgICAgICAgICAgICBvd25lckNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzLFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgICByb290Tm9kZSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaWQsXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAga2V5c0J5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGN1clRvTm9kZUtleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vcnBoQ29tcG9uZW50KGNvbXBvbmVudCwgY3VyVG9Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbmV4dFNpYmxpbmcocm9vdE5vZGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnNlcnRWaXJ0dWFsQ29tcG9uZW50QmVmb3JlKFxuICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudCxcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG1hdGNoaW5nRnJvbUNvbXBvbmVudC5fX19yb290Tm9kZSAhPT0gY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkICYmXG4gICAgICAgICAgICAgIChmcm9tQ29tcG9uZW50ID0gY29tcG9uZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKSkgJiZcbiAgICAgICAgICAgICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtcbiAgICAgICAgICAgICAgICBmcm9tQ29tcG9uZW50LmlkXG4gICAgICAgICAgICAgIF0gPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIC8vIFRoZSBjb21wb25lbnQgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IHJlYWwgRE9NIG5vZGUgd2FzIG5vdCByZW5kZXJlZFxuICAgICAgICAgICAgICAvLyBzbyB3ZSBzaG91bGQganVzdCByZW1vdmUgaXQgb3V0IG9mIHRoZSByZWFsIERPTSBieSBkZXN0cm95aW5nIGl0XG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBuZXh0U2libGluZyhmcm9tQ29tcG9uZW50Ll9fX3Jvb3ROb2RlKTtcbiAgICAgICAgICAgICAgZGVzdHJveUNvbXBvbmVudChmcm9tQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gbW92ZSB0aGUgZXhpc3RpbmcgY29tcG9uZW50IGludG9cbiAgICAgICAgICAgIC8vIHRoZSBjb3JyZWN0IGxvY2F0aW9uXG4gICAgICAgICAgICBpbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgIG1hdGNoaW5nRnJvbUNvbXBvbmVudC5fX19yb290Tm9kZSxcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID1cbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCAmJiBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgY3VyVG9Ob2RlS2V5T3JpZ2luYWwgPSBjdXJUb05vZGVLZXk7XG5cbiAgICAgICAgaWYgKGlzQXV0b0tleShjdXJUb05vZGVLZXkpKSB7XG4gICAgICAgICAgaWYgKG93bmVyQ29tcG9uZW50ICE9PSBwYXJlbnRDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGN1clRvTm9kZUtleSArPSBcIjpcIiArIG93bmVyQ29tcG9uZW50LmlkO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQgPSBwYXJlbnRDb21wb25lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50ID0gb3duZXJDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBoYXZlIGEga2V5ZWQgZWxlbWVudC4gVGhpcyBpcyB0aGUgZmFzdCBwYXRoIGZvciBtYXRjaGluZ1xuICAgICAgICAvLyB1cCBlbGVtZW50c1xuICAgICAgICBjdXJUb05vZGVLZXkgPSAoXG4gICAgICAgICAga2V5U2VxdWVuY2VzW3JlZmVyZW5jZUNvbXBvbmVudC5pZF0gfHxcbiAgICAgICAgICAoa2V5U2VxdWVuY2VzW3JlZmVyZW5jZUNvbXBvbmVudC5pZF0gPSBuZXcgS2V5U2VxdWVuY2UoKSlcbiAgICAgICAgKS5fX19uZXh0S2V5KGN1clRvTm9kZUtleSk7XG5cbiAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICBjdXJGcm9tTm9kZUtleSA9IGtleXNCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdkVsZW1lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5ID09PSBjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAvLyBFbGVtZW50cyBsaW5lIHVwLiBOb3cgd2UganVzdCBoYXZlIHRvIG1ha2Ugc3VyZSB0aGV5IGFyZSBjb21wYXRpYmxlXG4gICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgLy8gV2UganVzdCBza2lwIG92ZXIgdGhlIGZyb21Ob2RlIGlmIGl0IGlzIHByZXNlcnZlZFxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkICYmXG4gICAgICAgICAgICAgIGN1clRvTm9kZVR5cGUgPT09IGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVUeXBlICYmXG4gICAgICAgICAgICAgIChjdXJUb05vZGVUeXBlICE9PSBFTEVNRU5UX05PREUgfHxcbiAgICAgICAgICAgICAgICBjb21wYXJlTm9kZU5hbWVzKGN1clRvTm9kZUNoaWxkLCBjdXJWRnJvbU5vZGVDaGlsZCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vcnBoQ2hpbGRyZW4oXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvbGQgbm9kZVxuICAgICAgICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgLy8gSW5jb21wYXRpYmxlIG5vZGVzLiBKdXN0IG1vdmUgdGhlIHRhcmdldCBWTm9kZSBpbnRvIHRoZSBET00gYXQgdGhpcyBwb3NpdGlvblxuICAgICAgICAgICAgICBpbnNlcnRWaXJ0dWFsTm9kZUJlZm9yZShcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoaW5nRnJvbUVsID0gcmVmZXJlbmNlQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbY3VyVG9Ob2RlS2V5XTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCA9PT0gY3VyRnJvbU5vZGVDaGlsZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaWYgKGlzSHlkcmF0ZSAmJiBjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICAoY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUgfHxcbiAgICAgICAgICAgICAgICAgIGNhc2VJbnNlbnNpdGl2ZUNvbXBhcmUoXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLl9fX25vZGVOYW1lIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZpcnR1YWxpemVFbGVtZW50KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVOYW1lID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZU5hbWU7XG4gICAgICAgICAgICAgICAga2V5c0J5RE9NTm9kZS5zZXQoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1tjdXJUb05vZGVLZXldID1cbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChjdXJGcm9tTm9kZUNoaWxkLCBjdXJWRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZC5fX19ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZW50ID09IFwiRiNcIiArIGN1clRvTm9kZUtleU9yaWdpbmFsKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZW5kTm9kZSA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICB2YXIgZGVwdGggPSAwO1xuICAgICAgICAgICAgICAgICAgdmFyIG5vZGVWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZE5vZGUubm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgIG5vZGVWYWx1ZSA9IGVuZE5vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlVmFsdWUgPT09IFwiRi9cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlcHRoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVWYWx1ZS5pbmRleE9mKFwiRiNcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGUgPSBlbmROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICB2YXIgZnJhZ21lbnQgPSBjcmVhdGVGcmFnbWVudE5vZGUoXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGtleXNCeURPTU5vZGUuc2V0KGZyYWdtZW50LCBjdXJUb05vZGVLZXkpO1xuICAgICAgICAgICAgICAgICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGZyYWdtZW50LCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1tjdXJUb05vZGVLZXldID0gZnJhZ21lbnQ7XG4gICAgICAgICAgICAgICAgICByZW1vdmVDaGlsZChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgIHJlbW92ZUNoaWxkKGVuZE5vZGUpO1xuXG4gICAgICAgICAgICAgICAgICBpZiAoIWN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJhZ21lbnQsIGN1clRvTm9kZUNoaWxkLCBwYXJlbnRDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJhZ21lbnQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZXRhY2hlZEJ5RE9NTm9kZS5nZXQobWF0Y2hpbmdGcm9tRWwpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgZGV0YWNoZWRCeURPTU5vZGUuc2V0KG1hdGNoaW5nRnJvbUVsLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdkVsZW1lbnRCeURPTU5vZGUuZ2V0KG1hdGNoaW5nRnJvbUVsKTtcblxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgJiZcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVUeXBlID09PSBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlVHlwZSAmJlxuICAgICAgICAgICAgICAgIChjdXJUb05vZGVUeXBlICE9PSBFTEVNRU5UX05PREUgfHxcbiAgICAgICAgICAgICAgICAgIGNvbXBhcmVOb2RlTmFtZXMoY3VyVkZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKSlcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZyb21OZXh0U2libGluZyA9PT0gbWF0Y2hpbmdGcm9tRWwpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHJlbW92YWw6XG4gICAgICAgICAgICAgICAgICAvLyBBIDwtPiBBXG4gICAgICAgICAgICAgICAgICAvLyBCIDwtPiBDIDwtLSBXZSBhcmUgaGVyZVxuICAgICAgICAgICAgICAgICAgLy8gQyAgICAgRFxuICAgICAgICAgICAgICAgICAgLy8gRFxuICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHN3YXA6XG4gICAgICAgICAgICAgICAgICAvLyBBIDwtPiBBXG4gICAgICAgICAgICAgICAgICAvLyBCIDwtPiBDIDwtLSBXZSBhcmUgaGVyZVxuICAgICAgICAgICAgICAgICAgLy8gQyAgICAgQlxuXG4gICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgdG9OZXh0U2libGluZy5fX19rZXkgPT09IGN1ckZyb21Ob2RlS2V5XG4gICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlIGVsZW1lbnQgc3dhcFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gc3RheSBvbiB0aGUgY3VycmVudCByZWFsIERPTSBub2RlXG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQnV0IG1vdmUgdGhlIG1hdGNoaW5nIGVsZW1lbnQgaW50byBwbGFjZVxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHJlbW92YWxcblxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHJlbW92ZSB0aGUgY3VycmVudCByZWFsIERPTSBub2RlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCB0aGUgbWF0Y2hpbmcgcmVhbCBET00gbm9kZSB3aWxsIGZhbGwgaW50b1xuICAgICAgICAgICAgICAgICAgICAvLyBwbGFjZS4gV2Ugd2lsbCBjb250aW51ZSBkaWZmaW5nIHdpdGggbmV4dCBzaWJsaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRoZSByZWFsIERPTSBub2RlIHRoYXQganVzdCBmZWxsIGludG8gcGxhY2VcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcoZnJvbU5leHRTaWJsaW5nKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyBBIDwtPiBBXG4gICAgICAgICAgICAgICAgICAvLyBCIDwtPiBEIDwtLSBXZSBhcmUgaGVyZVxuICAgICAgICAgICAgICAgICAgLy8gQ1xuICAgICAgICAgICAgICAgICAgLy8gRFxuXG4gICAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIG1vdmUgdGhlIG1hdGNoaW5nIG5vZGUgaW50byBwbGFjZVxuICAgICAgICAgICAgICAgICAgaW5zZXJ0QWZ0ZXIobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWNoTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSwgb3duZXJDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nRnJvbUVsLFxuICAgICAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG1vcnBoQ2hpbGRyZW4oXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nRnJvbUVsLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgICAgIG93bmVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZGV0YWNoTm9kZShtYXRjaGluZ0Zyb21FbCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gcHJlc2VydmUgdGhlIG5vZGVcbiAgICAgICAgICAgICAgLy8gYnV0IHN0aWxsIHdlIG5lZWQgdG8gZGlmZiB0aGUgY3VycmVudCBmcm9tIG5vZGVcbiAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG4gICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGtub3cgdGhlIHRhcmdldCBub2RlIGlzIG5vdCBhIFZDb21wb25lbnQgbm9kZSBhbmQgd2Uga25vd1xuICAgICAgLy8gaXQgaXMgYWxzbyBub3QgYSBwcmVzZXJ2ZSBub2RlLiBMZXQncyBub3cgbWF0Y2ggdXAgdGhlIEhUTUxcbiAgICAgIC8vIGVsZW1lbnQsIHRleHQgbm9kZSwgY29tbWVudCwgZXRjLlxuICAgICAgd2hpbGUgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgaWYgKChmcm9tQ29tcG9uZW50ID0gY29tcG9uZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKSkpIHtcbiAgICAgICAgICAvLyBUaGUgY3VycmVudCBcInRvXCIgZWxlbWVudCBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGEgY29tcG9uZW50LFxuICAgICAgICAgIC8vIGJ1dCB0aGUgY3VycmVudCBcImZyb21cIiBlbGVtZW50IGlzIGFzc29jaWF0ZWQgd2l0aCBhIGNvbXBvbmVudFxuXG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBkZXN0cm95IHRoZSBjdXJyZW50IGNvbXBvbmVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAvLyBET00gb3Igbm90LCB3ZSBzdGlsbCBuZWVkIHRvIHNraXAgb3ZlciBpdCBzaW5jZSBpdCBpc1xuICAgICAgICAgIC8vIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIGN1cnJlbnQgXCJ0b1wiIG5vZGVcbiAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbZnJvbUNvbXBvbmVudC5pZF1cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGRlc3Ryb3lDb21wb25lbnQoZnJvbUNvbXBvbmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7IC8vIE1vdmUgdG8gdGhlIG5leHQgXCJmcm9tXCIgbm9kZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1ckZyb21Ob2RlVHlwZSA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGU7XG5cbiAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBjdXJUb05vZGVUeXBlKSB7XG4gICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBFbGVtZW50IG5vZGVzXG4gICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgIGlmIChjdXJWRnJvbU5vZGVDaGlsZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGlmIChpc0h5ZHJhdGUpIHtcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZpcnR1YWxpemVFbGVtZW50KGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgY2FzZUluc2Vuc2l0aXZlQ29tcGFyZShcbiAgICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLl9fX25vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZU5hbWUgPSBjdXJUb05vZGVDaGlsZC5fX19ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2tpcCBvdmVyIG5vZGVzIHRoYXQgZG9uJ3QgbG9vayBsaWtlIG91cnMuLi5cbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChjdXJGcm9tTm9kZUtleSA9IGN1clZGcm9tTm9kZUNoaWxkLl9fX2tleSkpIHtcbiAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIGtleWVkIGVsZW1lbnQgaGVyZSBidXQgb3VyIHRhcmdldCBWRE9NIG5vZGVcbiAgICAgICAgICAgICAgLy8gaXMgbm90IGtleWVkIHNvIHRoaXMgbm90IGRvZXNuJ3QgYmVsb25nXG4gICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc0NvbXBhdGlibGUgPVxuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmXG4gICAgICAgICAgICAgIGNvbXBhcmVOb2RlTmFtZXMoY3VyVkZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKSA9PT0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBjb21wYXRpYmxlIERPTSBlbGVtZW50cyBzbyB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAvLyB0YXJnZXQgRE9NIG5vZGUuXG4gICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8XG4gICAgICAgICAgICBjdXJGcm9tTm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgVGV4dCBvciBDb21tZW50IG5vZGVzXG4gICAgICAgICAgICBpc0NvbXBhdGlibGUgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZVZhbHVlID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZVZhbHVlO1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlVmFsdWUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVZhbHVlICE9PSBjdXJUb05vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgaXNIeWRyYXRlICYmXG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZyAmJlxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlVHlwZSA9PT0gVEVYVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZy5fX19ub2RlVHlwZSA9PT0gVEVYVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVWYWx1ZS5zdGFydHNXaXRoKGN1clRvTm9kZVZhbHVlKSAmJlxuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcuX19fbm9kZVZhbHVlLnN0YXJ0c1dpdGgoXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZVZhbHVlLnNsaWNlKGN1clRvTm9kZVZhbHVlLmxlbmd0aCksXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBJbiBoeWRyYXRlIG1vZGUgd2UgY2FuIHVzZSBzcGxpdFRleHQgdG8gbW9yZSBlZmZpY2llbnRseSBoYW5kbGVcbiAgICAgICAgICAgICAgICAvLyBhZGphY2VudCB0ZXh0IHZkb20gbm9kZXMgdGhhdCB3ZXJlIG1lcmdlZC5cbiAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLnNwbGl0VGV4dChcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZVZhbHVlLmxlbmd0aCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNpbXBseSB1cGRhdGUgbm9kZVZhbHVlIG9uIHRoZSBvcmlnaW5hbCBub2RlIHRvXG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0NvbXBhdGlibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAvLyBBZHZhbmNlIGJvdGggdGhlIFwidG9cIiBjaGlsZCBhbmQgdGhlIFwiZnJvbVwiIGNoaWxkIHNpbmNlIHdlIGZvdW5kIGEgbWF0Y2hcbiAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgIH0gLy8gRU5EOiB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZClcblxuICAgICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyIHRoZW4gd2UgZGlkIG5vdCBmaW5kIGEgY2FuZGlkYXRlIG1hdGNoIGZvclxuICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgLy8gbm9kZXMuIFRoZXJlZm9yZSwgd2Ugd2lsbCBqdXN0IGFwcGVuZCB0aGUgY3VycmVudCBcInRvXCIgbm9kZVxuICAgICAgLy8gdG8gdGhlIGVuZFxuICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgIGZyb21Ob2RlLFxuICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgKTtcblxuICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICB9XG5cbiAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi5cbiAgICBpZiAoZnJvbU5vZGUuX19fZmluaXNoRnJhZ21lbnQpIHtcbiAgICAgIC8vIElmIHdlIGFyZSBpbiBhbiB1bmZpbmlzaGVkIGZyYWdtZW50LCB3ZSBoYXZlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgbm9kZXNcbiAgICAgIC8vIHdlIHdlcmUgbWF0Y2hpbmcgdXAgYW5kIG5lZWQgdG8gZW5kIHRoZSBmcmFnbWVudFxuICAgICAgZnJvbU5vZGUuX19fZmluaXNoRnJhZ21lbnQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIGN1ckZyb21Ob2RlQ2hpbGQgaXMgbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2Rlc1xuICAgICAgLy8gbGVmdCBvdmVyIHRoYXQgbmVlZCB0byBiZSByZW1vdmVkXG4gICAgICB2YXIgZnJhZ21lbnRCb3VuZGFyeSA9XG4gICAgICAgIGZyb21Ob2RlLm5vZGVUeXBlID09PSBGUkFHTUVOVF9OT0RFID8gZnJvbU5vZGUuZW5kTm9kZSA6IG51bGw7XG5cbiAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkICYmIGN1ckZyb21Ob2RlQ2hpbGQgIT09IGZyYWdtZW50Qm91bmRhcnkpIHtcbiAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgaWYgKChmcm9tQ29tcG9uZW50ID0gY29tcG9uZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKSkpIHtcbiAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW2Zyb21Db21wb25lbnQuaWRdXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBkZXN0cm95Q29tcG9uZW50KGZyb21Db21wb25lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdkVsZW1lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICBjdXJGcm9tTm9kZUtleSA9IGtleXNCeURPTU5vZGUuZ2V0KGZyb21Ob2RlKTtcblxuICAgICAgICAvLyBGb3IgdHJhbnNjbHVkZWQgY29udGVudCwgd2UgbmVlZCB0byBjaGVjayBpZiB0aGUgZWxlbWVudCBiZWxvbmdzIHRvIGEgZGlmZmVyZW50IGNvbXBvbmVudFxuICAgICAgICAvLyBjb250ZXh0IHRoYW4gdGhlIGN1cnJlbnQgY29tcG9uZW50IGFuZCBlbnN1cmUgaXQgZ2V0cyByZW1vdmVkIGZyb20gaXRzIGtleSBpbmRleC5cbiAgICAgICAgaWYgKCFjdXJGcm9tTm9kZUtleSB8fCBpc0F1dG9LZXkoY3VyRnJvbU5vZGVLZXkpKSB7XG4gICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50ID0gcGFyZW50Q29tcG9uZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudCA9XG4gICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCAmJiBjdXJWRnJvbU5vZGVDaGlsZC5fX19vd25lckNvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIHJlZmVyZW5jZUNvbXBvbmVudCk7XG5cbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3JwaEVsKGZyb21FbCwgdkZyb21FbCwgdG9FbCwgcGFyZW50Q29tcG9uZW50KSB7XG4gICAgdmFyIG5vZGVOYW1lID0gdG9FbC5fX19ub2RlTmFtZTtcbiAgICB2YXIgY29uc3RJZCA9IHRvRWwuX19fY29uc3RJZDtcbiAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoZnJvbUVsLCB0b0VsKTtcblxuICAgIGlmIChjb25zdElkICE9PSB1bmRlZmluZWQgJiYgdkZyb21FbC5fX19jb25zdElkID09PSBjb25zdElkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbW9ycGhBdHRycyhmcm9tRWwsIHZGcm9tRWwsIHRvRWwpO1xuXG4gICAgaWYgKHRvRWwuX19fcHJlc2VydmVCb2R5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5vZGVOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGlmICh0b0VsLl9fX3ZhbHVlSW50ZXJuYWwgIT09IHZGcm9tRWwuX19fdmFsdWVJbnRlcm5hbCkge1xuICAgICAgICBmcm9tRWwudmFsdWUgPSB0b0VsLl9fX3ZhbHVlSW50ZXJuYWw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsLCBwYXJlbnRDb21wb25lbnQpO1xuICAgIH1cbiAgfSAvLyBFTkQ6IG1vcnBoRWwoLi4uKVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIGNvbXBvbmVudHNVdGlsLl9fX3N0b3BET01NYW5pcHVsYXRpb25XYXJuaW5nKGhvc3QpO1xuICB9XG5cbiAgbW9ycGhDaGlsZHJlbihmcm9tTm9kZSwgdG9Ob2RlLCB0b05vZGUuX19fY29tcG9uZW50KTtcblxuICBkZXRhY2hlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgZGV0YWNoZWRGcm9tQ29tcG9uZW50ID0gZGV0YWNoZWRCeURPTU5vZGUuZ2V0KG5vZGUpO1xuXG4gICAgaWYgKGRldGFjaGVkRnJvbUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXRhY2hlZEJ5RE9NTm9kZS5zZXQobm9kZSwgdW5kZWZpbmVkKTtcblxuICAgICAgdmFyIGNvbXBvbmVudFRvRGVzdHJveSA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQobm9kZSk7XG4gICAgICBpZiAoY29tcG9uZW50VG9EZXN0cm95KSB7XG4gICAgICAgIGNvbXBvbmVudFRvRGVzdHJveS5kZXN0cm95KCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGRldGFjaGVkRnJvbUNvbXBvbmVudCAhPT0gdHJ1ZSAmJiBkZXRhY2hlZEZyb21Db21wb25lbnQsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGV2ZW50RGVsZWdhdGlvbi5fX19oYW5kbGVOb2RlRGV0YWNoKG5vZGUpICE9IGZhbHNlKSB7XG4gICAgICAgICAgcmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIGNvbXBvbmVudHNVdGlsLl9fX3N0YXJ0RE9NTWFuaXB1bGF0aW9uV2FybmluZyhob3N0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vcnBoZG9tO1xuIiwidmFyIHBhcnNlSFRNTCA9IGZ1bmN0aW9uIChodG1sKSB7XG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7XG4gIHBhcnNlSFRNTCA9IGNvbnRhaW5lci5jb250ZW50XG4gICAgPyBmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5jb250ZW50O1xuICAgICAgfVxuICAgIDogZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICB9O1xuXG4gIHJldHVybiBwYXJzZUhUTUwoaHRtbCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChodG1sKSB7XG4gIHJldHVybiBwYXJzZUhUTUwoaHRtbCkuZmlyc3RDaGlsZDtcbn07XG4iLCJ2YXIgcGFyc2VIVE1MID0gcmVxdWlyZShcIi4vcGFyc2UtaHRtbFwiKTtcbnZhciBWQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vVkNvbXBvbmVudFwiKTtcbnZhciBWRG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoXCIuL1ZEb2N1bWVudEZyYWdtZW50XCIpO1xudmFyIFZFbGVtZW50ID0gcmVxdWlyZShcIi4vVkVsZW1lbnRcIik7XG52YXIgVkZyYWdtZW50ID0gcmVxdWlyZShcIi4vVkZyYWdtZW50XCIpO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG52YXIgVlRleHQgPSByZXF1aXJlKFwiLi9WVGV4dFwiKTtcblxudmFyIHNwZWNpYWxIdG1sUmVnZXhwID0gL1smPF0vO1xuXG5mdW5jdGlvbiB2aXJ0dWFsaXplQ2hpbGROb2Rlcyhub2RlLCB2ZG9tUGFyZW50LCBvd25lckNvbXBvbmVudCkge1xuICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gIHdoaWxlIChjdXJDaGlsZCkge1xuICAgIHZkb21QYXJlbnQuX19fYXBwZW5kQ2hpbGQodmlydHVhbGl6ZShjdXJDaGlsZCwgb3duZXJDb21wb25lbnQpKTtcbiAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZpcnR1YWxpemUobm9kZSwgb3duZXJDb21wb25lbnQpIHtcbiAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIFZFbGVtZW50Ll9fX3ZpcnR1YWxpemUobm9kZSwgdmlydHVhbGl6ZUNoaWxkTm9kZXMsIG93bmVyQ29tcG9uZW50KTtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gbmV3IFZUZXh0KG5vZGUubm9kZVZhbHVlLCBvd25lckNvbXBvbmVudCk7XG4gICAgY2FzZSAxMTpcbiAgICAgIHZhciB2ZG9tRG9jRnJhZ21lbnQgPSBuZXcgVkRvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHZpcnR1YWxpemVDaGlsZE5vZGVzKG5vZGUsIHZkb21Eb2NGcmFnbWVudCwgb3duZXJDb21wb25lbnQpO1xuICAgICAgcmV0dXJuIHZkb21Eb2NGcmFnbWVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiB2aXJ0dWFsaXplSFRNTChodG1sLCBvd25lckNvbXBvbmVudCkge1xuICBpZiAoIXNwZWNpYWxIdG1sUmVnZXhwLnRlc3QoaHRtbCkpIHtcbiAgICByZXR1cm4gbmV3IFZUZXh0KGh0bWwsIG93bmVyQ29tcG9uZW50KTtcbiAgfVxuXG4gIHZhciB2ZG9tRnJhZ21lbnQgPSBuZXcgVkRvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGN1ckNoaWxkID0gcGFyc2VIVE1MKGh0bWwpO1xuXG4gIHdoaWxlIChjdXJDaGlsZCkge1xuICAgIHZkb21GcmFnbWVudC5fX19hcHBlbmRDaGlsZCh2aXJ0dWFsaXplKGN1ckNoaWxkLCBvd25lckNvbXBvbmVudCkpO1xuICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gIH1cblxuICByZXR1cm4gdmRvbUZyYWdtZW50O1xufVxuXG52YXIgTm9kZV9wcm90b3R5cGUgPSBWTm9kZS5wcm90b3R5cGU7XG5cbi8qKlxuICogU2hvcnRoYW5kIG1ldGhvZCBmb3IgY3JlYXRpbmcgYW5kIGFwcGVuZGluZyBhIFRleHQgbm9kZSB3aXRoIGEgZ2l2ZW4gdmFsdWVcbiAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIHRleHQgdmFsdWUgZm9yIHRoZSBuZXcgVGV4dCBub2RlXG4gKi9cbk5vZGVfcHJvdG90eXBlLnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHZhciB2ZG9tTm9kZTtcblxuICBpZiAodHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBpZiAodmFsdWUudG9IVE1MKSB7XG4gICAgICAgIHZkb21Ob2RlID0gdmlydHVhbGl6ZUhUTUwodmFsdWUudG9IVE1MKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuX19fYXBwZW5kQ2hpbGQodmRvbU5vZGUgfHwgbmV3IFZUZXh0KHZhbHVlLnRvU3RyaW5nKCkpKTtcbiAgcmV0dXJuIHRoaXMuX19fZmluaXNoQ2hpbGQoKTtcbn07XG5cbk5vZGVfcHJvdG90eXBlLl9fX2FwcGVuZERvY3VtZW50RnJhZ21lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9fX2FwcGVuZENoaWxkKG5ldyBWRG9jdW1lbnRGcmFnbWVudCgpKTtcbn07XG5cbmV4cG9ydHMuX19fVkRvY3VtZW50RnJhZ21lbnQgPSBWRG9jdW1lbnRGcmFnbWVudDtcbmV4cG9ydHMuX19fVkVsZW1lbnQgPSBWRWxlbWVudDtcbmV4cG9ydHMuX19fVlRleHQgPSBWVGV4dDtcbmV4cG9ydHMuX19fVkNvbXBvbmVudCA9IFZDb21wb25lbnQ7XG5leHBvcnRzLl9fX1ZGcmFnbWVudCA9IFZGcmFnbWVudDtcbmV4cG9ydHMuX19fdmlydHVhbGl6ZSA9IHZpcnR1YWxpemU7XG5leHBvcnRzLl9fX3ZpcnR1YWxpemVIVE1MID0gdmlydHVhbGl6ZUhUTUw7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvcHlQcm9wcyhmcm9tLCB0bykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGZyb20pLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSwgbmFtZSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7IC8vQSBzaW1wbGUgZnVuY3Rpb24gdG8gY29weSBwcm9wZXJ0aWVzIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyXG4gICAgaWYgKCF0YXJnZXQpIHsgLy9DaGVjayBpZiBhIHRhcmdldCB3YXMgcHJvdmlkZWQsIG90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHkgb2JqZWN0IHRvIHJldHVyblxuICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3BOYW1lIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHsgLy9Pbmx5IGxvb2sgYXQgc291cmNlIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IGluaGVyaXRlZFxuICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wTmFtZV0gPSBzb3VyY2VbcHJvcE5hbWVdOyAvL0NvcHkgdGhlIHByb3BlcnR5XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTsiLCJ2YXIgY29weVByb3BzID0gcmVxdWlyZSgnLi9jb3B5UHJvcHMnKTtcblxuZnVuY3Rpb24gaW5oZXJpdChjdG9yLCBzdXBlckN0b3IsIHNob3VsZENvcHlQcm9wcykge1xuICAgIHZhciBvbGRQcm90byA9IGN0b3IucHJvdG90eXBlO1xuICAgIHZhciBuZXdQcm90byA9IGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob2xkUHJvdG8gJiYgc2hvdWxkQ29weVByb3BzICE9PSBmYWxzZSkge1xuICAgICAgICBjb3B5UHJvcHMob2xkUHJvdG8sIG5ld1Byb3RvKTtcbiAgICB9XG4gICAgY3Rvci4kc3VwZXIgPSBzdXBlckN0b3I7XG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXdQcm90bztcbiAgICByZXR1cm4gY3Rvcjtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaGVyaXQ7XG5pbmhlcml0Ll9pbmhlcml0ID0gaW5oZXJpdDtcbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ3N0YWNrZnJhbWUnLCBbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5TdGFja0ZyYW1lID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIF9pc051bWJlcihuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NhcGl0YWxpemUoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXR0ZXIocCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1twXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYm9vbGVhblByb3BzID0gWydpc0NvbnN0cnVjdG9yJywgJ2lzRXZhbCcsICdpc05hdGl2ZScsICdpc1RvcGxldmVsJ107XG4gICAgdmFyIG51bWVyaWNQcm9wcyA9IFsnY29sdW1uTnVtYmVyJywgJ2xpbmVOdW1iZXInXTtcbiAgICB2YXIgc3RyaW5nUHJvcHMgPSBbJ2ZpbGVOYW1lJywgJ2Z1bmN0aW9uTmFtZScsICdzb3VyY2UnXTtcbiAgICB2YXIgYXJyYXlQcm9wcyA9IFsnYXJncyddO1xuICAgIHZhciBvYmplY3RQcm9wcyA9IFsnZXZhbE9yaWdpbiddO1xuXG4gICAgdmFyIHByb3BzID0gYm9vbGVhblByb3BzLmNvbmNhdChudW1lcmljUHJvcHMsIHN0cmluZ1Byb3BzLCBhcnJheVByb3BzLCBvYmplY3RQcm9wcyk7XG5cbiAgICBmdW5jdGlvbiBTdGFja0ZyYW1lKG9iaikge1xuICAgICAgICBpZiAoIW9iaikgcmV0dXJuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAob2JqW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpc1snc2V0JyArIF9jYXBpdGFsaXplKHByb3BzW2ldKV0ob2JqW3Byb3BzW2ldXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdGFja0ZyYW1lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZ2V0QXJnczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcmdzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBcmdzOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJncyBtdXN0IGJlIGFuIEFycmF5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFyZ3MgPSB2O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEV2YWxPcmlnaW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbE9yaWdpbjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RXZhbE9yaWdpbjogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBTdGFja0ZyYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsT3JpZ2luID0gdjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZhbE9yaWdpbiA9IG5ldyBTdGFja0ZyYW1lKHYpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFdmFsIE9yaWdpbiBtdXN0IGJlIGFuIE9iamVjdCBvciBTdGFja0ZyYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gdGhpcy5nZXRGaWxlTmFtZSgpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGxpbmVOdW1iZXIgPSB0aGlzLmdldExpbmVOdW1iZXIoKSB8fCAnJztcbiAgICAgICAgICAgIHZhciBjb2x1bW5OdW1iZXIgPSB0aGlzLmdldENvbHVtbk51bWJlcigpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRoaXMuZ2V0RnVuY3Rpb25OYW1lKCkgfHwgJyc7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRJc0V2YWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1tldmFsXSAoJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlciArICcpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICdbZXZhbF06JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uTmFtZSArICcgKCcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXIgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFN0YWNrRnJhbWUuZnJvbVN0cmluZyA9IGZ1bmN0aW9uIFN0YWNrRnJhbWUkJGZyb21TdHJpbmcoc3RyKSB7XG4gICAgICAgIHZhciBhcmdzU3RhcnRJbmRleCA9IHN0ci5pbmRleE9mKCcoJyk7XG4gICAgICAgIHZhciBhcmdzRW5kSW5kZXggPSBzdHIubGFzdEluZGV4T2YoJyknKTtcblxuICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gc3RyLnN1YnN0cmluZygwLCBhcmdzU3RhcnRJbmRleCk7XG4gICAgICAgIHZhciBhcmdzID0gc3RyLnN1YnN0cmluZyhhcmdzU3RhcnRJbmRleCArIDEsIGFyZ3NFbmRJbmRleCkuc3BsaXQoJywnKTtcbiAgICAgICAgdmFyIGxvY2F0aW9uU3RyaW5nID0gc3RyLnN1YnN0cmluZyhhcmdzRW5kSW5kZXggKyAxKTtcblxuICAgICAgICBpZiAobG9jYXRpb25TdHJpbmcuaW5kZXhPZignQCcpID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSAvQCguKz8pKD86OihcXGQrKSk/KD86OihcXGQrKSk/JC8uZXhlYyhsb2NhdGlvblN0cmluZywgJycpO1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gcGFydHNbMV07XG4gICAgICAgICAgICB2YXIgbGluZU51bWJlciA9IHBhcnRzWzJdO1xuICAgICAgICAgICAgdmFyIGNvbHVtbk51bWJlciA9IHBhcnRzWzNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgYXJnczogYXJncyB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNvbHVtbk51bWJlcjogY29sdW1uTnVtYmVyIHx8IHVuZGVmaW5lZFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29sZWFuUHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShib29sZWFuUHJvcHNbaV0pXSA9IF9nZXR0ZXIoYm9vbGVhblByb3BzW2ldKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShib29sZWFuUHJvcHNbaV0pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBCb29sZWFuKHYpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoYm9vbGVhblByb3BzW2ldKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bWVyaWNQcm9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKG51bWVyaWNQcm9wc1tqXSldID0gX2dldHRlcihudW1lcmljUHJvcHNbal0pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKG51bWVyaWNQcm9wc1tqXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXNOdW1iZXIodikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihwICsgJyBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBOdW1iZXIodik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShudW1lcmljUHJvcHNbal0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc3RyaW5nUHJvcHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShzdHJpbmdQcm9wc1trXSldID0gX2dldHRlcihzdHJpbmdQcm9wc1trXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUoc3RyaW5nUHJvcHNba10pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBTdHJpbmcodik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShzdHJpbmdQcm9wc1trXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0YWNrRnJhbWU7XG59KSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3NyYy9jb25zdGFudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9maW5hbGl6ZScpOyIsInZhciB3aW4gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogZ2xvYmFsO1xuZXhwb3J0cy5OT09QID0gd2luLiRXMTBOT09QID0gd2luLiRXMTBOT09QIHx8IGZ1bmN0aW9uICgpIHt9OyIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHNcIik7XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbmZ1bmN0aW9uIHJlc29sdmUob2JqZWN0LCBwYXRoLCBsZW4pIHtcbiAgICB2YXIgY3VycmVudCA9IG9iamVjdDtcbiAgICBmb3IgKHZhciBpPTA7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnRbcGF0aFtpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVUeXBlKGluZm8pIHtcbiAgICBpZiAoaW5mby50eXBlID09PSAnRGF0ZScpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGluZm8udmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoaW5mby50eXBlID09PSAnVVJMJykge1xuICAgICAgICByZXR1cm4gbmV3IFVSTChpbmZvLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGluZm8udHlwZSA9PT0gJ1VSTFNlYXJjaFBhcmFtcycpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoaW5mby52YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLnR5cGUgPT09ICdOT09QJykge1xuICAgICAgICByZXR1cm4gY29uc3RhbnRzLk5PT1A7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgdHlwZScpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5hbGl6ZShvdXRlcikge1xuICAgIGlmICghb3V0ZXIpIHtcbiAgICAgICAgcmV0dXJuIG91dGVyO1xuICAgIH1cblxuICAgIHZhciBhc3NpZ25tZW50cyA9IG91dGVyLiQkO1xuICAgIGlmIChhc3NpZ25tZW50cykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gb3V0ZXIubztcbiAgICAgICAgdmFyIGxlbjtcblxuICAgICAgICBpZiAoYXNzaWdubWVudHMgJiYgKGxlbj1hc3NpZ25tZW50cy5sZW5ndGgpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXNzaWdubWVudCA9IGFzc2lnbm1lbnRzW2ldO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJocyA9IGFzc2lnbm1lbnQucjtcbiAgICAgICAgICAgICAgICB2YXIgcmhzVmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShyaHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJoc1ZhbHVlID0gcmVzb2x2ZShvYmplY3QsIHJocywgcmhzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmhzVmFsdWUgPSByZXNvbHZlVHlwZShyaHMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBsaHMgPSBhc3NpZ25tZW50Lmw7XG4gICAgICAgICAgICAgICAgdmFyIGxoc0xhc3QgPSBsaHMubGVuZ3RoLTE7XG5cbiAgICAgICAgICAgICAgICBpZiAobGhzTGFzdCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gb3V0ZXIubyA9IHJoc1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGhzUGFyZW50ID0gcmVzb2x2ZShvYmplY3QsIGxocywgbGhzTGFzdCk7XG4gICAgICAgICAgICAgICAgICAgIGxoc1BhcmVudFtsaHNbbGhzTGFzdF1dID0gcmhzVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXNzaWdubWVudHMubGVuZ3RoID0gMDsgLy8gQXNzaWdubWVudHMgaGF2ZSBiZWVuIGFwcGxpZWQsIGRvIG5vdCByZWFwcGx5XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gbnVsbCA6IG9iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb3V0ZXI7XG4gICAgfVxuXG59OyIsImltcG9ydCBwYXNzd29yZF9wYWdlIGZyb20gJy4vbWFya28vaG9tZS9jb21wb25lbnRzL3Bhc3N3b3JkLm1hcmtvJztcclxuaW1wb3J0IGxfcHJlbm90YXppb25pX3BhZ2UgZnJvbSAnLi9tYXJrby9wcmVub3RhemlvbmkvY29tcG9uZW50cy9sX3ByZW5vdGF6aW9uaS5tYXJrbyc7XHJcbmltcG9ydCBzX3ByZW5vdGF6aW9uaV9wYWdlIGZyb20gJy4vbWFya28vcHJlbm90YXppb25pL2NvbXBvbmVudHMvc19wcmVub3RhemlvbmkubWFya28nO1xyXG5cclxubGV0IENPTlRFTlQgPSB7fTtcclxuXHJcbkNPTlRFTlQuRXhlY3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHN3aXRjaChTdG9yZS5zdGF0ZS5hY3Rpb24pIHtcclxuICAgIGNhc2UgQWN0aW9uLlVQREFURV9DT05URU5UOlxyXG4gICAgICBsZXQgb3V0cHV0ID0gU3RvcmUuc3RhdGUub3V0cHV0O1xyXG4gICAgICBzd2l0Y2goU3RvcmUuc3RhdGUudGFyZ2V0KSB7XHJcbiAgICAgICAgY2FzZSAncGFzc3dvcmQtYnV0dG9uJzpcclxuICAgICAgICAgIENPTlRFTlQucmVuZGVyID0gcGFzc3dvcmRfcGFnZS5yZW5kZXJTeW5jKCkucmVwbGFjZUNoaWxkcmVuT2Yob3V0cHV0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2xfcHJlbm90YXppb25pLWJ1dHRvbic6XHJcbiAgICAgICAgICBDT05URU5ULnJlbmRlciA9IGxfcHJlbm90YXppb25pX3BhZ2UucmVuZGVyU3luYygpLnJlcGxhY2VDaGlsZHJlbk9mKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdzX3ByZW5vdGF6aW9uaS1idXR0b24nOlxyXG4gICAgICAgICAgQ09OVEVOVC5yZW5kZXIgPSBzX3ByZW5vdGF6aW9uaV9wYWdlLnJlbmRlclN5bmMoKS5yZXBsYWNlQ2hpbGRyZW5PZihvdXRwdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5TdG9yZS5CaW5kKENPTlRFTlQuRXhlY3V0ZSk7IiwiaW1wb3J0IGhvbWUgZnJvbSBcIi4vbWFya28vaG9tZS9ob21lLm1hcmtvXCI7XHJcbmltcG9ydCBwcmVub3RhemlvbmkgZnJvbSBcIi4vbWFya28vcHJlbm90YXppb25pL3ByZW5vdGF6aW9uaS5tYXJrb1wiO1xyXG5sZXQgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNvbnRhaW5lclwiKTtcclxuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi4vdXRpbGl0eS91dGlsaXR5LmpzJztcclxuXHJcbmxldCBJTklUID0ge307XHJcblxyXG5JTklULkV4ZWN1dGUgPSBhc3luYyBmdW5jdGlvbigpIHtcclxuICBzd2l0Y2goU3RvcmUuc3RhdGUuYWN0aW9uKSB7XHJcbiAgICBjYXNlIEFjdGlvbi5TVEFSVDpcclxuICAgICAgSU5JVC5yZW5kZXIgPSBob21lLnJlbmRlclN5bmMoKS5yZXBsYWNlQ2hpbGRyZW5PZihvdXRwdXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgQWN0aW9uLlNIT1dfSE9NRTpcclxuICAgICAgSU5JVC5yZW5kZXIgPSBob21lLnJlbmRlclN5bmMoKS5yZXBsYWNlQ2hpbGRyZW5PZihvdXRwdXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgQWN0aW9uLlNIT1dfUFJFTk9UQVpJT05JOlxyXG4gICAgICBJTklULnJlbmRlciA9IHByZW5vdGF6aW9uaS5yZW5kZXJTeW5jKCkucmVwbGFjZUNoaWxkcmVuT2Yob3V0cHV0KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcblN0b3JlLkJpbmQoSU5JVC5FeGVjdXRlKTsiLCJsZXQgTG9nb3V0ID0ge31cclxuXHJcbkxvZ291dC5FeGVjdXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgc3dpdGNoKFN0b3JlLnN0YXRlLmFjdGlvbikge1xyXG4gICAgY2FzZSBBY3Rpb24uTE9HX09VVDpcclxuICAgICAgbG9jYXRpb24ucmVwbGFjZSgnL2xvZ291dCcpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcblN0b3JlLkJpbmQoTG9nb3V0LkV4ZWN1dGUpOyIsIiQoZnVuY3Rpb24gKCkge1xyXG4gICQoJyN0b29sYmFyJykudzJ0b29sYmFyKHtcclxuICAgICAgbmFtZSA6ICdteVRvb2xiYXInLFxyXG4gICAgICBpdGVtczogW1xyXG4gICAgICAgICAgeyB0eXBlOiAncmFkaW8nLCAgaWQ6ICdob21lJywgZ3JvdXA6ICcxJywgdGV4dDogJ0hvbWUnLCBpbWc6ICdpY29uLWFkZCcsIGNoZWNrZWQ6IHRydWUgfSxcclxuICAgICAgICAgIHsgdHlwZTogJ2JyZWFrJyB9LFxyXG4gICAgICAgICAgeyB0eXBlOiAncmFkaW8nLCAgIGlkOiAncHJlbm90YXppb25pJywgZ3JvdXA6ICcxJywgdGV4dDogJ1ByZW5vdGF6aW9uaScsIGltZzogJ2ljb24tZm9sZGVyJ30sXHJcbiAgICAgICAgICB7IHR5cGU6ICdicmVhaycgfSxcclxuICAgICAgICAgIHsgdHlwZTogJ3JhZGlvJywgIGlkOiAnc3RydXR0dXJlJywgIGdyb3VwOiAnMScsIHRleHQ6ICdTdHJ1dHR1cmUnLCBpbWc6ICdpY29uLXBhZ2UnIH0sXHJcbiAgICAgICAgICB7IHR5cGU6ICdicmVhaycgfSxcclxuICAgICAgICAgIHsgdHlwZTogJ3JhZGlvJywgIGlkOiAncGF6aWVudGknLCAgZ3JvdXA6ICcxJywgdGV4dDogJ1BhemllbnRpJywgaW1nOiAnaWNvbi1wYWdlJywgaGlkZGVuOiB0cnVlIH0sXHJcbiAgICAgICAgICB7IHR5cGU6ICdzcGFjZXInIH0sXHJcbiAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCAgaWQ6ICdsb2dPdXQnLCAgdGV4dDogJ0xvZyBPdXQnLCBjbGFzczogJ2xvZy1vdXQtaWNvbicsIGltZzogJ2ljb24tbG9nb3V0JyB9XHJcbiAgICAgIF0sXHJcblxyXG4gICAgICBvbkNsaWNrOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHN3aXRjaChldmVudC50YXJnZXQpIHtcclxuICAgICAgICAgIGNhc2UgJ2hvbWUnOlxyXG4gICAgICAgICAgICBTdG9yZS5OZXdTdGF0ZShzaG93SG9tZSgpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdsb2dPdXQnOlxyXG4gICAgICAgICAgICBpZiAoY29uZmlybSgnU2VpIHNpY3VybyBkaSB2b2xlciB1c2NpcmU/JykpIHtcclxuICAgICAgICAgICAgICBTdG9yZS5OZXdTdGF0ZShsb2dvdXQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdwcmVub3RhemlvbmknOlxyXG4gICAgICAgICAgICBTdG9yZS5OZXdTdGF0ZShzaG93UHJlbm90YXppb25pKCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG1haW4gbWVudSBhY3Rpb24gZmluZCcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICB9KTtcclxuXHJcbiAgc3dpdGNoKFN0b3JlLnN0YXRlLmFjdGlvbikge1xyXG4gICAgY2FzZSBBY3Rpb24uU1RBUlQ6XHJcbiAgICAgIGlmKFN0b3JlLnN0YXRlLmlkcnVvbG89PTEpIHtcclxuICAgICAgICB3MnVpLm15VG9vbGJhci5zaG93KCdwYXppZW50aScpO1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICAvL2NvbnNvbGUubG9nKHcydWkubXlUb29sYmFyLmdldCgncGF6aWVudGknKSlcclxuICBcclxufSk7IiwiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuXHJcbmxldCB1ID0ge307XHJcblxyXG51Lm1ha2VSZXF1ZXN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gIG9wdGlvbnMuaGVhZGVycyA9IHthdXRob3JpemF0aW9uOiB1c2VyfVxyXG5cclxuICByZXR1cm4gYXhpb3MucmVxdWVzdChvcHRpb25zKVxyXG4gIC50aGVuKHJlcyA9PiB7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHU7XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgaHR0cEFkYXB0ZXIgZnJvbSAnLi9odHRwLmpzJztcbmltcG9ydCB4aHJBZGFwdGVyIGZyb20gJy4veGhyLmpzJztcbmltcG9ydCBmZXRjaEFkYXB0ZXIgZnJvbSAnLi9mZXRjaC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5cbmNvbnN0IGtub3duQWRhcHRlcnMgPSB7XG4gIGh0dHA6IGh0dHBBZGFwdGVyLFxuICB4aHI6IHhockFkYXB0ZXIsXG4gIGZldGNoOiBmZXRjaEFkYXB0ZXJcbn1cblxudXRpbHMuZm9yRWFjaChrbm93bkFkYXB0ZXJzLCAoZm4sIHZhbHVlKSA9PiB7XG4gIGlmIChmbikge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sICduYW1lJywge3ZhbHVlfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgJ2FkYXB0ZXJOYW1lJywge3ZhbHVlfSk7XG4gIH1cbn0pO1xuXG5jb25zdCByZW5kZXJSZWFzb24gPSAocmVhc29uKSA9PiBgLSAke3JlYXNvbn1gO1xuXG5jb25zdCBpc1Jlc29sdmVkSGFuZGxlID0gKGFkYXB0ZXIpID0+IHV0aWxzLmlzRnVuY3Rpb24oYWRhcHRlcikgfHwgYWRhcHRlciA9PT0gbnVsbCB8fCBhZGFwdGVyID09PSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRBZGFwdGVyOiAoYWRhcHRlcnMpID0+IHtcbiAgICBhZGFwdGVycyA9IHV0aWxzLmlzQXJyYXkoYWRhcHRlcnMpID8gYWRhcHRlcnMgOiBbYWRhcHRlcnNdO1xuXG4gICAgY29uc3Qge2xlbmd0aH0gPSBhZGFwdGVycztcbiAgICBsZXQgbmFtZU9yQWRhcHRlcjtcbiAgICBsZXQgYWRhcHRlcjtcblxuICAgIGNvbnN0IHJlamVjdGVkUmVhc29ucyA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbmFtZU9yQWRhcHRlciA9IGFkYXB0ZXJzW2ldO1xuICAgICAgbGV0IGlkO1xuXG4gICAgICBhZGFwdGVyID0gbmFtZU9yQWRhcHRlcjtcblxuICAgICAgaWYgKCFpc1Jlc29sdmVkSGFuZGxlKG5hbWVPckFkYXB0ZXIpKSB7XG4gICAgICAgIGFkYXB0ZXIgPSBrbm93bkFkYXB0ZXJzWyhpZCA9IFN0cmluZyhuYW1lT3JBZGFwdGVyKSkudG9Mb3dlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKGFkYXB0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKGBVbmtub3duIGFkYXB0ZXIgJyR7aWR9J2ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGFwdGVyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZWplY3RlZFJlYXNvbnNbaWQgfHwgJyMnICsgaV0gPSBhZGFwdGVyO1xuICAgIH1cblxuICAgIGlmICghYWRhcHRlcikge1xuXG4gICAgICBjb25zdCByZWFzb25zID0gT2JqZWN0LmVudHJpZXMocmVqZWN0ZWRSZWFzb25zKVxuICAgICAgICAubWFwKChbaWQsIHN0YXRlXSkgPT4gYGFkYXB0ZXIgJHtpZH0gYCArXG4gICAgICAgICAgKHN0YXRlID09PSBmYWxzZSA/ICdpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBlbnZpcm9ubWVudCcgOiAnaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgYnVpbGQnKVxuICAgICAgICApO1xuXG4gICAgICBsZXQgcyA9IGxlbmd0aCA/XG4gICAgICAgIChyZWFzb25zLmxlbmd0aCA+IDEgPyAnc2luY2UgOlxcbicgKyByZWFzb25zLm1hcChyZW5kZXJSZWFzb24pLmpvaW4oJ1xcbicpIDogJyAnICsgcmVuZGVyUmVhc29uKHJlYXNvbnNbMF0pKSA6XG4gICAgICAgICdhcyBubyBhZGFwdGVyIHNwZWNpZmllZCc7XG5cbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBgVGhlcmUgaXMgbm8gc3VpdGFibGUgYWRhcHRlciB0byBkaXNwYXRjaCB0aGUgcmVxdWVzdCBgICsgcyxcbiAgICAgICAgJ0VSUl9OT1RfU1VQUE9SVCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkYXB0ZXI7XG4gIH0sXG4gIGFkYXB0ZXJzOiBrbm93bkFkYXB0ZXJzXG59XG4iLCJpbXBvcnQgcGxhdGZvcm0gZnJvbSBcIi4uL3BsYXRmb3JtL2luZGV4LmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5pbXBvcnQgY29tcG9zZVNpZ25hbHMgZnJvbSBcIi4uL2hlbHBlcnMvY29tcG9zZVNpZ25hbHMuanNcIjtcbmltcG9ydCB7dHJhY2tTdHJlYW19IGZyb20gXCIuLi9oZWxwZXJzL3RyYWNrU3RyZWFtLmpzXCI7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuLi9jb3JlL0F4aW9zSGVhZGVycy5qc1wiO1xuaW1wb3J0IHByb2dyZXNzRXZlbnRSZWR1Y2VyIGZyb20gXCIuLi9oZWxwZXJzL3Byb2dyZXNzRXZlbnRSZWR1Y2VyLmpzXCI7XG5pbXBvcnQgcmVzb2x2ZUNvbmZpZyBmcm9tIFwiLi4vaGVscGVycy9yZXNvbHZlQ29uZmlnLmpzXCI7XG5pbXBvcnQgc2V0dGxlIGZyb20gXCIuLi9jb3JlL3NldHRsZS5qc1wiO1xuXG5jb25zdCBmZXRjaFByb2dyZXNzRGVjb3JhdG9yID0gKHRvdGFsLCBmbikgPT4ge1xuICBjb25zdCBsZW5ndGhDb21wdXRhYmxlID0gdG90YWwgIT0gbnVsbDtcbiAgcmV0dXJuIChsb2FkZWQpID0+IHNldFRpbWVvdXQoKCkgPT4gZm4oe1xuICAgIGxlbmd0aENvbXB1dGFibGUsXG4gICAgdG90YWwsXG4gICAgbG9hZGVkXG4gIH0pKTtcbn1cblxuY29uc3QgaXNGZXRjaFN1cHBvcnRlZCA9IHR5cGVvZiBmZXRjaCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgUmVzcG9uc2UgPT09ICdmdW5jdGlvbic7XG5jb25zdCBpc1JlYWRhYmxlU3RyZWFtU3VwcG9ydGVkID0gaXNGZXRjaFN1cHBvcnRlZCAmJiB0eXBlb2YgUmVhZGFibGVTdHJlYW0gPT09ICdmdW5jdGlvbic7XG5cbi8vIHVzZWQgb25seSBpbnNpZGUgdGhlIGZldGNoIGFkYXB0ZXJcbmNvbnN0IGVuY29kZVRleHQgPSBpc0ZldGNoU3VwcG9ydGVkICYmICh0eXBlb2YgVGV4dEVuY29kZXIgPT09ICdmdW5jdGlvbicgP1xuICAgICgoZW5jb2RlcikgPT4gKHN0cikgPT4gZW5jb2Rlci5lbmNvZGUoc3RyKSkobmV3IFRleHRFbmNvZGVyKCkpIDpcbiAgICBhc3luYyAoc3RyKSA9PiBuZXcgVWludDhBcnJheShhd2FpdCBuZXcgUmVzcG9uc2Uoc3RyKS5hcnJheUJ1ZmZlcigpKVxuKTtcblxuY29uc3Qgc3VwcG9ydHNSZXF1ZXN0U3RyZWFtID0gaXNSZWFkYWJsZVN0cmVhbVN1cHBvcnRlZCAmJiAoKCkgPT4ge1xuICBsZXQgZHVwbGV4QWNjZXNzZWQgPSBmYWxzZTtcblxuICBjb25zdCBoYXNDb250ZW50VHlwZSA9IG5ldyBSZXF1ZXN0KHBsYXRmb3JtLm9yaWdpbiwge1xuICAgIGJvZHk6IG5ldyBSZWFkYWJsZVN0cmVhbSgpLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGdldCBkdXBsZXgoKSB7XG4gICAgICBkdXBsZXhBY2Nlc3NlZCA9IHRydWU7XG4gICAgICByZXR1cm4gJ2hhbGYnO1xuICAgIH0sXG4gIH0pLmhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKTtcblxuICByZXR1cm4gZHVwbGV4QWNjZXNzZWQgJiYgIWhhc0NvbnRlbnRUeXBlO1xufSkoKTtcblxuY29uc3QgREVGQVVMVF9DSFVOS19TSVpFID0gNjQgKiAxMDI0O1xuXG5jb25zdCBzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtID0gaXNSZWFkYWJsZVN0cmVhbVN1cHBvcnRlZCAmJiAhISgoKT0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShuZXcgUmVzcG9uc2UoJycpLmJvZHkpO1xuICB9IGNhdGNoKGVycikge1xuICAgIC8vIHJldHVybiB1bmRlZmluZWRcbiAgfVxufSkoKTtcblxuY29uc3QgcmVzb2x2ZXJzID0ge1xuICBzdHJlYW06IHN1cHBvcnRzUmVzcG9uc2VTdHJlYW0gJiYgKChyZXMpID0+IHJlcy5ib2R5KVxufTtcblxuaXNGZXRjaFN1cHBvcnRlZCAmJiAoKChyZXMpID0+IHtcbiAgWyd0ZXh0JywgJ2FycmF5QnVmZmVyJywgJ2Jsb2InLCAnZm9ybURhdGEnLCAnc3RyZWFtJ10uZm9yRWFjaCh0eXBlID0+IHtcbiAgICAhcmVzb2x2ZXJzW3R5cGVdICYmIChyZXNvbHZlcnNbdHlwZV0gPSB1dGlscy5pc0Z1bmN0aW9uKHJlc1t0eXBlXSkgPyAocmVzKSA9PiByZXNbdHlwZV0oKSA6XG4gICAgICAoXywgY29uZmlnKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKGBSZXNwb25zZSB0eXBlICcke3R5cGV9JyBpcyBub3Qgc3VwcG9ydGVkYCwgQXhpb3NFcnJvci5FUlJfTk9UX1NVUFBPUlQsIGNvbmZpZyk7XG4gICAgICB9KVxuICB9KTtcbn0pKG5ldyBSZXNwb25zZSkpO1xuXG5jb25zdCBnZXRCb2R5TGVuZ3RoID0gYXN5bmMgKGJvZHkpID0+IHtcbiAgaWYgKGJvZHkgPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYodXRpbHMuaXNCbG9iKGJvZHkpKSB7XG4gICAgcmV0dXJuIGJvZHkuc2l6ZTtcbiAgfVxuXG4gIGlmKHV0aWxzLmlzU3BlY0NvbXBsaWFudEZvcm0oYm9keSkpIHtcbiAgICByZXR1cm4gKGF3YWl0IG5ldyBSZXF1ZXN0KGJvZHkpLmFycmF5QnVmZmVyKCkpLmJ5dGVMZW5ndGg7XG4gIH1cblxuICBpZih1dGlscy5pc0FycmF5QnVmZmVyVmlldyhib2R5KSkge1xuICAgIHJldHVybiBib2R5LmJ5dGVMZW5ndGg7XG4gIH1cblxuICBpZih1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhib2R5KSkge1xuICAgIGJvZHkgPSBib2R5ICsgJyc7XG4gIH1cblxuICBpZih1dGlscy5pc1N0cmluZyhib2R5KSkge1xuICAgIHJldHVybiAoYXdhaXQgZW5jb2RlVGV4dChib2R5KSkuYnl0ZUxlbmd0aDtcbiAgfVxufVxuXG5jb25zdCByZXNvbHZlQm9keUxlbmd0aCA9IGFzeW5jIChoZWFkZXJzLCBib2R5KSA9PiB7XG4gIGNvbnN0IGxlbmd0aCA9IHV0aWxzLnRvRmluaXRlTnVtYmVyKGhlYWRlcnMuZ2V0Q29udGVudExlbmd0aCgpKTtcblxuICByZXR1cm4gbGVuZ3RoID09IG51bGwgPyBnZXRCb2R5TGVuZ3RoKGJvZHkpIDogbGVuZ3RoO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0ZldGNoU3VwcG9ydGVkICYmIChhc3luYyAoY29uZmlnKSA9PiB7XG4gIGxldCB7XG4gICAgdXJsLFxuICAgIG1ldGhvZCxcbiAgICBkYXRhLFxuICAgIHNpZ25hbCxcbiAgICBjYW5jZWxUb2tlbixcbiAgICB0aW1lb3V0LFxuICAgIG9uRG93bmxvYWRQcm9ncmVzcyxcbiAgICBvblVwbG9hZFByb2dyZXNzLFxuICAgIHJlc3BvbnNlVHlwZSxcbiAgICBoZWFkZXJzLFxuICAgIHdpdGhDcmVkZW50aWFscyA9ICdzYW1lLW9yaWdpbicsXG4gICAgZmV0Y2hPcHRpb25zXG4gIH0gPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG5cbiAgcmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlID8gKHJlc3BvbnNlVHlwZSArICcnKS50b0xvd2VyQ2FzZSgpIDogJ3RleHQnO1xuXG4gIGxldCBbY29tcG9zZWRTaWduYWwsIHN0b3BUaW1lb3V0XSA9IChzaWduYWwgfHwgY2FuY2VsVG9rZW4gfHwgdGltZW91dCkgP1xuICAgIGNvbXBvc2VTaWduYWxzKFtzaWduYWwsIGNhbmNlbFRva2VuXSwgdGltZW91dCkgOiBbXTtcblxuICBsZXQgZmluaXNoZWQsIHJlcXVlc3Q7XG5cbiAgY29uc3Qgb25GaW5pc2ggPSAoKSA9PiB7XG4gICAgIWZpbmlzaGVkICYmIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29tcG9zZWRTaWduYWwgJiYgY29tcG9zZWRTaWduYWwudW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcblxuICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGxldCByZXF1ZXN0Q29udGVudExlbmd0aDtcblxuICB0cnkge1xuICAgIGlmIChcbiAgICAgIG9uVXBsb2FkUHJvZ3Jlc3MgJiYgc3VwcG9ydHNSZXF1ZXN0U3RyZWFtICYmIG1ldGhvZCAhPT0gJ2dldCcgJiYgbWV0aG9kICE9PSAnaGVhZCcgJiZcbiAgICAgIChyZXF1ZXN0Q29udGVudExlbmd0aCA9IGF3YWl0IHJlc29sdmVCb2R5TGVuZ3RoKGhlYWRlcnMsIGRhdGEpKSAhPT0gMFxuICAgICkge1xuICAgICAgbGV0IF9yZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBkdXBsZXg6IFwiaGFsZlwiXG4gICAgICB9KTtcblxuICAgICAgbGV0IGNvbnRlbnRUeXBlSGVhZGVyO1xuXG4gICAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSAmJiAoY29udGVudFR5cGVIZWFkZXIgPSBfcmVxdWVzdC5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpKSB7XG4gICAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoY29udGVudFR5cGVIZWFkZXIpXG4gICAgICB9XG5cbiAgICAgIGlmIChfcmVxdWVzdC5ib2R5KSB7XG4gICAgICAgIGRhdGEgPSB0cmFja1N0cmVhbShfcmVxdWVzdC5ib2R5LCBERUZBVUxUX0NIVU5LX1NJWkUsIGZldGNoUHJvZ3Jlc3NEZWNvcmF0b3IoXG4gICAgICAgICAgcmVxdWVzdENvbnRlbnRMZW5ndGgsXG4gICAgICAgICAgcHJvZ3Jlc3NFdmVudFJlZHVjZXIob25VcGxvYWRQcm9ncmVzcylcbiAgICAgICAgKSwgbnVsbCwgZW5jb2RlVGV4dCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF1dGlscy5pc1N0cmluZyh3aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICB3aXRoQ3JlZGVudGlhbHMgPSB3aXRoQ3JlZGVudGlhbHMgPyAnY29ycycgOiAnb21pdCc7XG4gICAgfVxuXG4gICAgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybCwge1xuICAgICAgLi4uZmV0Y2hPcHRpb25zLFxuICAgICAgc2lnbmFsOiBjb21wb3NlZFNpZ25hbCxcbiAgICAgIG1ldGhvZDogbWV0aG9kLnRvVXBwZXJDYXNlKCksXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLm5vcm1hbGl6ZSgpLnRvSlNPTigpLFxuICAgICAgYm9keTogZGF0YSxcbiAgICAgIGR1cGxleDogXCJoYWxmXCIsXG4gICAgICB3aXRoQ3JlZGVudGlhbHNcbiAgICB9KTtcblxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gICAgY29uc3QgaXNTdHJlYW1SZXNwb25zZSA9IHN1cHBvcnRzUmVzcG9uc2VTdHJlYW0gJiYgKHJlc3BvbnNlVHlwZSA9PT0gJ3N0cmVhbScgfHwgcmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKTtcblxuICAgIGlmIChzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmIChvbkRvd25sb2FkUHJvZ3Jlc3MgfHwgaXNTdHJlYW1SZXNwb25zZSkpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuICAgICAgWydzdGF0dXMnLCAnc3RhdHVzVGV4dCcsICdoZWFkZXJzJ10uZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgb3B0aW9uc1twcm9wXSA9IHJlc3BvbnNlW3Byb3BdO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlQ29udGVudExlbmd0aCA9IHV0aWxzLnRvRmluaXRlTnVtYmVyKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LWxlbmd0aCcpKTtcblxuICAgICAgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoXG4gICAgICAgIHRyYWNrU3RyZWFtKHJlc3BvbnNlLmJvZHksIERFRkFVTFRfQ0hVTktfU0laRSwgb25Eb3dubG9hZFByb2dyZXNzICYmIGZldGNoUHJvZ3Jlc3NEZWNvcmF0b3IoXG4gICAgICAgICAgcmVzcG9uc2VDb250ZW50TGVuZ3RoLFxuICAgICAgICAgIHByb2dyZXNzRXZlbnRSZWR1Y2VyKG9uRG93bmxvYWRQcm9ncmVzcywgdHJ1ZSlcbiAgICAgICAgKSwgaXNTdHJlYW1SZXNwb25zZSAmJiBvbkZpbmlzaCwgZW5jb2RlVGV4dCksXG4gICAgICAgIG9wdGlvbnNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlIHx8ICd0ZXh0JztcblxuICAgIGxldCByZXNwb25zZURhdGEgPSBhd2FpdCByZXNvbHZlcnNbdXRpbHMuZmluZEtleShyZXNvbHZlcnMsIHJlc3BvbnNlVHlwZSkgfHwgJ3RleHQnXShyZXNwb25zZSwgY29uZmlnKTtcblxuICAgICFpc1N0cmVhbVJlc3BvbnNlICYmIG9uRmluaXNoKCk7XG5cbiAgICBzdG9wVGltZW91dCAmJiBzdG9wVGltZW91dCgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBoZWFkZXJzOiBBeGlvc0hlYWRlcnMuZnJvbShyZXNwb25zZS5oZWFkZXJzKSxcbiAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdFxuICAgICAgfSlcbiAgICB9KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBvbkZpbmlzaCgpO1xuXG4gICAgaWYgKGVyciAmJiBlcnIubmFtZSA9PT0gJ1R5cGVFcnJvcicgJiYgL2ZldGNoL2kudGVzdChlcnIubWVzc2FnZSkpIHtcbiAgICAgIHRocm93IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIG5ldyBBeGlvc0Vycm9yKCdOZXR3b3JrIEVycm9yJywgQXhpb3NFcnJvci5FUlJfTkVUV09SSywgY29uZmlnLCByZXF1ZXN0KSxcbiAgICAgICAge1xuICAgICAgICAgIGNhdXNlOiBlcnIuY2F1c2UgfHwgZXJyXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICB0aHJvdyBBeGlvc0Vycm9yLmZyb20oZXJyLCBlcnIgJiYgZXJyLmNvZGUsIGNvbmZpZywgcmVxdWVzdCk7XG4gIH1cbn0pO1xuXG5cbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBzZXR0bGUgZnJvbSAnLi8uLi9jb3JlL3NldHRsZS5qcyc7XG5pbXBvcnQgdHJhbnNpdGlvbmFsRGVmYXVsdHMgZnJvbSAnLi4vZGVmYXVsdHMvdHJhbnNpdGlvbmFsLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyc7XG5pbXBvcnQgcGFyc2VQcm90b2NvbCBmcm9tICcuLi9oZWxwZXJzL3BhcnNlUHJvdG9jb2wuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi4vY29yZS9BeGlvc0hlYWRlcnMuanMnO1xuaW1wb3J0IHByb2dyZXNzRXZlbnRSZWR1Y2VyIGZyb20gJy4uL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMnO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuXG5jb25zdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgPSB0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgJiYgZnVuY3Rpb24gKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IF9jb25maWcgPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG4gICAgbGV0IHJlcXVlc3REYXRhID0gX2NvbmZpZy5kYXRhO1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oX2NvbmZpZy5oZWFkZXJzKS5ub3JtYWxpemUoKTtcbiAgICBsZXQge3Jlc3BvbnNlVHlwZX0gPSBfY29uZmlnO1xuICAgIGxldCBvbkNhbmNlbGVkO1xuICAgIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICBpZiAoX2NvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgICBfY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgX2NvbmZpZy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgcmVxdWVzdC5vcGVuKF9jb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIF9jb25maWcudXJsLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gX2NvbmZpZy50aW1lb3V0O1xuXG4gICAgZnVuY3Rpb24gb25sb2FkZW5kKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICBjb25zdCByZXNwb25zZUhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShcbiAgICAgICAgJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCAmJiByZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gICAgICApO1xuICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gIXJlc3BvbnNlVHlwZSB8fCByZXNwb25zZVR5cGUgPT09ICd0ZXh0JyB8fCByZXNwb25zZVR5cGUgPT09ICdqc29uJyA/XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShmdW5jdGlvbiBfcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gX3JlamVjdChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCdvbmxvYWRlbmQnIGluIHJlcXVlc3QpIHtcbiAgICAgIC8vIFVzZSBvbmxvYWRlbmQgaWYgYXZhaWxhYmxlXG4gICAgICByZXF1ZXN0Lm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZSB0byBlbXVsYXRlIG9ubG9hZGVuZFxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlYWR5c3RhdGUgaGFuZGxlciBpcyBjYWxsaW5nIGJlZm9yZSBvbmVycm9yIG9yIG9udGltZW91dCBoYW5kbGVycyxcbiAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGNhbGwgb25sb2FkZW5kIG9uIHRoZSBuZXh0ICd0aWNrJ1xuICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsIF9jb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBfY29uZmlnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIGxldCB0aW1lb3V0RXJyb3JNZXNzYWdlID0gX2NvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIF9jb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcgOiAndGltZW91dCBleGNlZWRlZCc7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uYWwgPSBfY29uZmlnLnRyYW5zaXRpb25hbCB8fCB0cmFuc2l0aW9uYWxEZWZhdWx0cztcbiAgICAgIGlmIChfY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IF9jb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyBBeGlvc0Vycm9yLkVUSU1FRE9VVCA6IEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELFxuICAgICAgICBfY29uZmlnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgcmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCAmJiByZXF1ZXN0SGVhZGVycy5zZXRDb250ZW50VHlwZShudWxsKTtcblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLnRvSlNPTigpLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChfY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFfY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBfY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBfY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnRSZWR1Y2VyKF9jb25maWcub25Eb3dubG9hZFByb2dyZXNzLCB0cnVlKSk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIF9jb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50UmVkdWNlcihfY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpKTtcbiAgICB9XG5cbiAgICBpZiAoX2NvbmZpZy5jYW5jZWxUb2tlbiB8fCBfY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBjYW5jZWwgPT4ge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgY2FuY2VsLnR5cGUgPyBuZXcgQ2FuY2VsZWRFcnJvcihudWxsLCBjb25maWcsIHJlcXVlc3QpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIF9jb25maWcuY2FuY2VsVG9rZW4gJiYgX2NvbmZpZy5jYW5jZWxUb2tlbi5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICBpZiAoX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgX2NvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IF9jb25maWcuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwYXJzZVByb3RvY29sKF9jb25maWcudXJsKTtcblxuICAgIGlmIChwcm90b2NvbCAmJiBwbGF0Zm9ybS5wcm90b2NvbHMuaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1Vuc3VwcG9ydGVkIHByb3RvY29sICcgKyBwcm90b2NvbCArICc6JywgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCBiaW5kIGZyb20gJy4vaGVscGVycy9iaW5kLmpzJztcbmltcG9ydCBBeGlvcyBmcm9tICcuL2NvcmUvQXhpb3MuanMnO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gJy4vY29yZS9tZXJnZUNvbmZpZy5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgZm9ybURhdGFUb0pTT04gZnJvbSAnLi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzJztcbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbFRva2VuIGZyb20gJy4vY2FuY2VsL0NhbmNlbFRva2VuLmpzJztcbmltcG9ydCBpc0NhbmNlbCBmcm9tICcuL2NhbmNlbC9pc0NhbmNlbC5qcyc7XG5pbXBvcnQge1ZFUlNJT059IGZyb20gJy4vZW52L2RhdGEuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi9oZWxwZXJzL3RvRm9ybURhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IHNwcmVhZCBmcm9tICcuL2hlbHBlcnMvc3ByZWFkLmpzJztcbmltcG9ydCBpc0F4aW9zRXJyb3IgZnJvbSAnLi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL2NvcmUvQXhpb3NIZWFkZXJzLmpzXCI7XG5pbXBvcnQgYWRhcHRlcnMgZnJvbSAnLi9hZGFwdGVycy9hZGFwdGVycy5qcyc7XG5pbXBvcnQgSHR0cFN0YXR1c0NvZGUgZnJvbSAnLi9oZWxwZXJzL0h0dHBTdGF0dXNDb2RlLmpzJztcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm5zIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICBjb25zdCBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICBjb25zdCBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0LCB7YWxsT3duS2V5czogdHJ1ZX0pO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQsIG51bGwsIHthbGxPd25LZXlzOiB0cnVlfSk7XG5cbiAgLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuICBpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgaW5zdGFuY2VDb25maWcpKTtcbiAgfTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxuY29uc3QgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWxlZEVycm9yID0gQ2FuY2VsZWRFcnJvcjtcbmF4aW9zLkNhbmNlbFRva2VuID0gQ2FuY2VsVG9rZW47XG5heGlvcy5pc0NhbmNlbCA9IGlzQ2FuY2VsO1xuYXhpb3MuVkVSU0lPTiA9IFZFUlNJT047XG5heGlvcy50b0Zvcm1EYXRhID0gdG9Gb3JtRGF0YTtcblxuLy8gRXhwb3NlIEF4aW9zRXJyb3IgY2xhc3NcbmF4aW9zLkF4aW9zRXJyb3IgPSBBeGlvc0Vycm9yO1xuXG4vLyBhbGlhcyBmb3IgQ2FuY2VsZWRFcnJvciBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuYXhpb3MuQ2FuY2VsID0gYXhpb3MuQ2FuY2VsZWRFcnJvcjtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcblxuYXhpb3Muc3ByZWFkID0gc3ByZWFkO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSBpc0F4aW9zRXJyb3I7XG5cbi8vIEV4cG9zZSBtZXJnZUNvbmZpZ1xuYXhpb3MubWVyZ2VDb25maWcgPSBtZXJnZUNvbmZpZztcblxuYXhpb3MuQXhpb3NIZWFkZXJzID0gQXhpb3NIZWFkZXJzO1xuXG5heGlvcy5mb3JtVG9KU09OID0gdGhpbmcgPT4gZm9ybURhdGFUb0pTT04odXRpbHMuaXNIVE1MRm9ybSh0aGluZykgPyBuZXcgRm9ybURhdGEodGhpbmcpIDogdGhpbmcpO1xuXG5heGlvcy5nZXRBZGFwdGVyID0gYWRhcHRlcnMuZ2V0QWRhcHRlcjtcblxuYXhpb3MuSHR0cFN0YXR1c0NvZGUgPSBIdHRwU3RhdHVzQ29kZTtcblxuYXhpb3MuZGVmYXVsdCA9IGF4aW9zO1xuXG4vLyB0aGlzIG1vZHVsZSBzaG91bGQgb25seSBoYXZlIGEgZGVmYXVsdCBleHBvcnRcbmV4cG9ydCBkZWZhdWx0IGF4aW9zXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4vQ2FuY2VsZWRFcnJvci5qcyc7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKlxuICogQHJldHVybnMge0NhbmNlbFRva2VufVxuICovXG5jbGFzcyBDYW5jZWxUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKGV4ZWN1dG9yKSB7XG4gICAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIGxldCByZXNvbHZlUHJvbWlzZTtcblxuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXM7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHRoaXMucHJvbWlzZS50aGVuKGNhbmNlbCA9PiB7XG4gICAgICBpZiAoIXRva2VuLl9saXN0ZW5lcnMpIHJldHVybjtcblxuICAgICAgbGV0IGkgPSB0b2tlbi5fbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgICAgdG9rZW4uX2xpc3RlbmVyc1tpXShjYW5jZWwpO1xuICAgICAgfVxuICAgICAgdG9rZW4uX2xpc3RlbmVycyA9IG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHRoaXMucHJvbWlzZS50aGVuID0gb25mdWxmaWxsZWQgPT4ge1xuICAgICAgbGV0IF9yZXNvbHZlO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgICBfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB9KS50aGVuKG9uZnVsZmlsbGVkKTtcblxuICAgICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICAgIHRva2VuLnVuc3Vic2NyaWJlKF9yZXNvbHZlKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSwgY29uZmlnLCByZXF1ZXN0KSB7XG4gICAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWxlZEVycm9yKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCk7XG4gICAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIGBDYW5jZWxlZEVycm9yYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICAgKi9cbiAgdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICAgIHRocm93IHRoaXMucmVhc29uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgdG8gdGhlIGNhbmNlbCBzaWduYWxcbiAgICovXG5cbiAgc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLnJlYXNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZSBmcm9tIHRoZSBjYW5jZWwgc2lnbmFsXG4gICAqL1xuXG4gIHVuc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAgICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAgICovXG4gIHN0YXRpYyBzb3VyY2UoKSB7XG4gICAgbGV0IGNhbmNlbDtcbiAgICBjb25zdCB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgICBjYW5jZWwgPSBjO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbixcbiAgICAgIGNhbmNlbFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIEEgYENhbmNlbGVkRXJyb3JgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdD19IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3Q9fSByZXF1ZXN0IFRoZSByZXF1ZXN0LlxuICpcbiAqIEByZXR1cm5zIHtDYW5jZWxlZEVycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsZWRFcnJvcihtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gIEF4aW9zRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlID09IG51bGwgPyAnY2FuY2VsZWQnIDogbWVzc2FnZSwgQXhpb3NFcnJvci5FUlJfQ0FOQ0VMRUQsIGNvbmZpZywgcmVxdWVzdCk7XG4gIHRoaXMubmFtZSA9ICdDYW5jZWxlZEVycm9yJztcbn1cblxudXRpbHMuaW5oZXJpdHMoQ2FuY2VsZWRFcnJvciwgQXhpb3NFcnJvciwge1xuICBfX0NBTkNFTF9fOiB0cnVlXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsZWRFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgYnVpbGRVUkwgZnJvbSAnLi4vaGVscGVycy9idWlsZFVSTC5qcyc7XG5pbXBvcnQgSW50ZXJjZXB0b3JNYW5hZ2VyIGZyb20gJy4vSW50ZXJjZXB0b3JNYW5hZ2VyLmpzJztcbmltcG9ydCBkaXNwYXRjaFJlcXVlc3QgZnJvbSAnLi9kaXNwYXRjaFJlcXVlc3QuanMnO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gJy4vbWVyZ2VDb25maWcuanMnO1xuaW1wb3J0IGJ1aWxkRnVsbFBhdGggZnJvbSAnLi9idWlsZEZ1bGxQYXRoLmpzJztcbmltcG9ydCB2YWxpZGF0b3IgZnJvbSAnLi4vaGVscGVycy92YWxpZGF0b3IuanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuL0F4aW9zSGVhZGVycy5qcyc7XG5cbmNvbnN0IHZhbGlkYXRvcnMgPSB2YWxpZGF0b3IudmFsaWRhdG9ycztcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuY2xhc3MgQXhpb3Mge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZUNvbmZpZykge1xuICAgIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGNvbmZpZ09yVXJsIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAgICogQHBhcmFtIHs/T2JqZWN0fSBjb25maWdcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICAgKi9cbiAgYXN5bmMgcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9yZXF1ZXN0KGNvbmZpZ09yVXJsLCBjb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIGxldCBkdW1teTtcblxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA/IEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15ID0ge30pIDogKGR1bW15ID0gbmV3IEVycm9yKCkpO1xuXG4gICAgICAgIC8vIHNsaWNlIG9mZiB0aGUgRXJyb3I6IC4uLiBsaW5lXG4gICAgICAgIGNvbnN0IHN0YWNrID0gZHVtbXkuc3RhY2sgPyBkdW1teS5zdGFjay5yZXBsYWNlKC9eLitcXG4vLCAnJykgOiAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoIWVyci5zdGFjaykge1xuICAgICAgICAgICAgZXJyLnN0YWNrID0gc3RhY2s7XG4gICAgICAgICAgICAvLyBtYXRjaCB3aXRob3V0IHRoZSAyIHRvcCBzdGFjayBsaW5lc1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhY2sgJiYgIVN0cmluZyhlcnIuc3RhY2spLmVuZHNXaXRoKHN0YWNrLnJlcGxhY2UoL14uK1xcbi4rXFxuLywgJycpKSkge1xuICAgICAgICAgICAgZXJyLnN0YWNrICs9ICdcXG4nICsgc3RhY2tcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpZ25vcmUgdGhlIGNhc2Ugd2hlcmUgXCJzdGFja1wiIGlzIGFuIHVuLXdyaXRhYmxlIHByb3BlcnR5XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIF9yZXF1ZXN0KGNvbmZpZ09yVXJsLCBjb25maWcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gICAgaWYgKHR5cGVvZiBjb25maWdPclVybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICAgIGNvbmZpZy51cmwgPSBjb25maWdPclVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0gY29uZmlnT3JVcmwgfHwge307XG4gICAgfVxuXG4gICAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAgIGNvbnN0IHt0cmFuc2l0aW9uYWwsIHBhcmFtc1NlcmlhbGl6ZXIsIGhlYWRlcnN9ID0gY29uZmlnO1xuXG4gICAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyh0cmFuc2l0aW9uYWwsIHtcbiAgICAgICAgc2lsZW50SlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICBjbGFyaWZ5VGltZW91dEVycm9yOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pXG4gICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24ocGFyYW1zU2VyaWFsaXplcikpIHtcbiAgICAgICAgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIgPSB7XG4gICAgICAgICAgc2VyaWFsaXplOiBwYXJhbXNTZXJpYWxpemVyXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKHBhcmFtc1NlcmlhbGl6ZXIsIHtcbiAgICAgICAgICBlbmNvZGU6IHZhbGlkYXRvcnMuZnVuY3Rpb24sXG4gICAgICAgICAgc2VyaWFsaXplOiB2YWxpZGF0b3JzLmZ1bmN0aW9uXG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCBjb25maWcubWV0aG9kXG4gICAgY29uZmlnLm1ldGhvZCA9IChjb25maWcubWV0aG9kIHx8IHRoaXMuZGVmYXVsdHMubWV0aG9kIHx8ICdnZXQnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gICAgbGV0IGNvbnRleHRIZWFkZXJzID0gaGVhZGVycyAmJiB1dGlscy5tZXJnZShcbiAgICAgIGhlYWRlcnMuY29tbW9uLFxuICAgICAgaGVhZGVyc1tjb25maWcubWV0aG9kXVxuICAgICk7XG5cbiAgICBoZWFkZXJzICYmIHV0aWxzLmZvckVhY2goXG4gICAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICAgIChtZXRob2QpID0+IHtcbiAgICAgICAgZGVsZXRlIGhlYWRlcnNbbWV0aG9kXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uZmlnLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuY29uY2F0KGNvbnRleHRIZWFkZXJzLCBoZWFkZXJzKTtcblxuICAgIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgICBjb25zdCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICAgIGxldCBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICAgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgaWYgKHR5cGVvZiBpbnRlcmNlcHRvci5ydW5XaGVuID09PSAnZnVuY3Rpb24nICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgJiYgaW50ZXJjZXB0b3Iuc3luY2hyb25vdXM7XG5cbiAgICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcHJvbWlzZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbjtcblxuICAgIGlmICghc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzKSB7XG4gICAgICBjb25zdCBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QuYmluZCh0aGlzKSwgdW5kZWZpbmVkXTtcbiAgICAgIGNoYWluLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICAgIGNoYWluLnB1c2guYXBwbHkoY2hhaW4sIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbik7XG4gICAgICBsZW4gPSBjaGFpbi5sZW5ndGg7XG5cbiAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICAgICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbltpKytdLCBjaGFpbltpKytdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgbGVuID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoO1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IGNvbmZpZztcblxuICAgIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIGNvbnN0IG9uRnVsZmlsbGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW5baSsrXTtcbiAgICAgIGNvbnN0IG9uUmVqZWN0ZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbltpKytdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG9uUmVqZWN0ZWQuY2FsbCh0aGlzLCBlcnJvcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBwcm9taXNlID0gZGlzcGF0Y2hSZXF1ZXN0LmNhbGwodGhpcywgbmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9XG5cbiAgICBpID0gMDtcbiAgICBsZW4gPSByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4ocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluW2krK10sIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbltpKytdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGdldFVyaShjb25maWcpIHtcbiAgICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmV0dXJuIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG4gIH1cbn1cblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2QsXG4gICAgICB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVIVFRQTWV0aG9kKGlzRm9ybSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBodHRwTWV0aG9kKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgICBtZXRob2QsXG4gICAgICAgIGhlYWRlcnM6IGlzRm9ybSA/IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ211bHRpcGFydC9mb3JtLWRhdGEnXG4gICAgICAgIH0gOiB7fSxcbiAgICAgICAgdXJsLFxuICAgICAgICBkYXRhXG4gICAgICB9KSk7XG4gICAgfTtcbiAgfVxuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZ2VuZXJhdGVIVFRQTWV0aG9kKCk7XG5cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZCArICdGb3JtJ10gPSBnZW5lcmF0ZUhUVFBNZXRob2QodHJ1ZSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXSBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5mdW5jdGlvbiBBeGlvc0Vycm9yKG1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgRXJyb3IuY2FsbCh0aGlzKTtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgfVxuXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMubmFtZSA9ICdBeGlvc0Vycm9yJztcbiAgY29kZSAmJiAodGhpcy5jb2RlID0gY29kZSk7XG4gIGNvbmZpZyAmJiAodGhpcy5jb25maWcgPSBjb25maWcpO1xuICByZXF1ZXN0ICYmICh0aGlzLnJlcXVlc3QgPSByZXF1ZXN0KTtcbiAgcmVzcG9uc2UgJiYgKHRoaXMucmVzcG9uc2UgPSByZXNwb25zZSk7XG59XG5cbnV0aWxzLmluaGVyaXRzKEF4aW9zRXJyb3IsIEVycm9yLCB7XG4gIHRvSlNPTjogZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHV0aWxzLnRvSlNPTk9iamVjdCh0aGlzLmNvbmZpZyksXG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBzdGF0dXM6IHRoaXMucmVzcG9uc2UgJiYgdGhpcy5yZXNwb25zZS5zdGF0dXMgPyB0aGlzLnJlc3BvbnNlLnN0YXR1cyA6IG51bGxcbiAgICB9O1xuICB9XG59KTtcblxuY29uc3QgcHJvdG90eXBlID0gQXhpb3NFcnJvci5wcm90b3R5cGU7XG5jb25zdCBkZXNjcmlwdG9ycyA9IHt9O1xuXG5bXG4gICdFUlJfQkFEX09QVElPTl9WQUxVRScsXG4gICdFUlJfQkFEX09QVElPTicsXG4gICdFQ09OTkFCT1JURUQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ0VSUl9ORVRXT1JLJyxcbiAgJ0VSUl9GUl9UT09fTUFOWV9SRURJUkVDVFMnLFxuICAnRVJSX0RFUFJFQ0FURUQnLFxuICAnRVJSX0JBRF9SRVNQT05TRScsXG4gICdFUlJfQkFEX1JFUVVFU1QnLFxuICAnRVJSX0NBTkNFTEVEJyxcbiAgJ0VSUl9OT1RfU1VQUE9SVCcsXG4gICdFUlJfSU5WQUxJRF9VUkwnXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuXS5mb3JFYWNoKGNvZGUgPT4ge1xuICBkZXNjcmlwdG9yc1tjb2RlXSA9IHt2YWx1ZTogY29kZX07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQXhpb3NFcnJvciwgZGVzY3JpcHRvcnMpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgJ2lzQXhpb3NFcnJvcicsIHt2YWx1ZTogdHJ1ZX0pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuQXhpb3NFcnJvci5mcm9tID0gKGVycm9yLCBjb2RlLCBjb25maWcsIHJlcXVlc3QsIHJlc3BvbnNlLCBjdXN0b21Qcm9wcykgPT4ge1xuICBjb25zdCBheGlvc0Vycm9yID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuXG4gIHV0aWxzLnRvRmxhdE9iamVjdChlcnJvciwgYXhpb3NFcnJvciwgZnVuY3Rpb24gZmlsdGVyKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IEVycm9yLnByb3RvdHlwZTtcbiAgfSwgcHJvcCA9PiB7XG4gICAgcmV0dXJuIHByb3AgIT09ICdpc0F4aW9zRXJyb3InO1xuICB9KTtcblxuICBBeGlvc0Vycm9yLmNhbGwoYXhpb3NFcnJvciwgZXJyb3IubWVzc2FnZSwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSk7XG5cbiAgYXhpb3NFcnJvci5jYXVzZSA9IGVycm9yO1xuXG4gIGF4aW9zRXJyb3IubmFtZSA9IGVycm9yLm5hbWU7XG5cbiAgY3VzdG9tUHJvcHMgJiYgT2JqZWN0LmFzc2lnbihheGlvc0Vycm9yLCBjdXN0b21Qcm9wcyk7XG5cbiAgcmV0dXJuIGF4aW9zRXJyb3I7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBeGlvc0Vycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHBhcnNlSGVhZGVycyBmcm9tICcuLi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyc7XG5cbmNvbnN0ICRpbnRlcm5hbHMgPSBTeW1ib2woJ2ludGVybmFscycpO1xuXG5mdW5jdGlvbiBub3JtYWxpemVIZWFkZXIoaGVhZGVyKSB7XG4gIHJldHVybiBoZWFkZXIgJiYgU3RyaW5nKGhlYWRlcikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiB1dGlscy5pc0FycmF5KHZhbHVlKSA/IHZhbHVlLm1hcChub3JtYWxpemVWYWx1ZSkgOiBTdHJpbmcodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRva2VucyhzdHIpIHtcbiAgY29uc3QgdG9rZW5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgY29uc3QgdG9rZW5zUkUgPSAvKFteXFxzLDs9XSspXFxzKig/Oj1cXHMqKFteLDtdKykpPy9nO1xuICBsZXQgbWF0Y2g7XG5cbiAgd2hpbGUgKChtYXRjaCA9IHRva2Vuc1JFLmV4ZWMoc3RyKSkpIHtcbiAgICB0b2tlbnNbbWF0Y2hbMV1dID0gbWF0Y2hbMl07XG4gIH1cblxuICByZXR1cm4gdG9rZW5zO1xufVxuXG5jb25zdCBpc1ZhbGlkSGVhZGVyTmFtZSA9IChzdHIpID0+IC9eWy1fYS16QS1aMC05XmB8fiwhIyQlJicqKy5dKyQvLnRlc3Qoc3RyLnRyaW0oKSk7XG5cbmZ1bmN0aW9uIG1hdGNoSGVhZGVyVmFsdWUoY29udGV4dCwgdmFsdWUsIGhlYWRlciwgZmlsdGVyLCBpc0hlYWRlck5hbWVGaWx0ZXIpIHtcbiAgaWYgKHV0aWxzLmlzRnVuY3Rpb24oZmlsdGVyKSkge1xuICAgIHJldHVybiBmaWx0ZXIuY2FsbCh0aGlzLCB2YWx1ZSwgaGVhZGVyKTtcbiAgfVxuXG4gIGlmIChpc0hlYWRlck5hbWVGaWx0ZXIpIHtcbiAgICB2YWx1ZSA9IGhlYWRlcjtcbiAgfVxuXG4gIGlmICghdXRpbHMuaXNTdHJpbmcodmFsdWUpKSByZXR1cm47XG5cbiAgaWYgKHV0aWxzLmlzU3RyaW5nKGZpbHRlcikpIHtcbiAgICByZXR1cm4gdmFsdWUuaW5kZXhPZihmaWx0ZXIpICE9PSAtMTtcbiAgfVxuXG4gIGlmICh1dGlscy5pc1JlZ0V4cChmaWx0ZXIpKSB7XG4gICAgcmV0dXJuIGZpbHRlci50ZXN0KHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRIZWFkZXIoaGVhZGVyKSB7XG4gIHJldHVybiBoZWFkZXIudHJpbSgpXG4gICAgLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKFthLXpcXGRdKShcXHcqKS9nLCAodywgY2hhciwgc3RyKSA9PiB7XG4gICAgICByZXR1cm4gY2hhci50b1VwcGVyQ2FzZSgpICsgc3RyO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBidWlsZEFjY2Vzc29ycyhvYmosIGhlYWRlcikge1xuICBjb25zdCBhY2Nlc3Nvck5hbWUgPSB1dGlscy50b0NhbWVsQ2FzZSgnICcgKyBoZWFkZXIpO1xuXG4gIFsnZ2V0JywgJ3NldCcsICdoYXMnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG1ldGhvZE5hbWUgKyBhY2Nlc3Nvck5hbWUsIHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIHJldHVybiB0aGlzW21ldGhvZE5hbWVdLmNhbGwodGhpcywgaGVhZGVyLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgICAgIH0sXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgfSk7XG59XG5cbmNsYXNzIEF4aW9zSGVhZGVycyB7XG4gIGNvbnN0cnVjdG9yKGhlYWRlcnMpIHtcbiAgICBoZWFkZXJzICYmIHRoaXMuc2V0KGhlYWRlcnMpO1xuICB9XG5cbiAgc2V0KGhlYWRlciwgdmFsdWVPclJld3JpdGUsIHJld3JpdGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIHNldEhlYWRlcihfdmFsdWUsIF9oZWFkZXIsIF9yZXdyaXRlKSB7XG4gICAgICBjb25zdCBsSGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoIWxIZWFkZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdoZWFkZXIgbmFtZSBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHNlbGYsIGxIZWFkZXIpO1xuXG4gICAgICBpZigha2V5IHx8IHNlbGZba2V5XSA9PT0gdW5kZWZpbmVkIHx8IF9yZXdyaXRlID09PSB0cnVlIHx8IChfcmV3cml0ZSA9PT0gdW5kZWZpbmVkICYmIHNlbGZba2V5XSAhPT0gZmFsc2UpKSB7XG4gICAgICAgIHNlbGZba2V5IHx8IF9oZWFkZXJdID0gbm9ybWFsaXplVmFsdWUoX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzZXRIZWFkZXJzID0gKGhlYWRlcnMsIF9yZXdyaXRlKSA9PlxuICAgICAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCAoX3ZhbHVlLCBfaGVhZGVyKSA9PiBzZXRIZWFkZXIoX3ZhbHVlLCBfaGVhZGVyLCBfcmV3cml0ZSkpO1xuXG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QoaGVhZGVyKSB8fCBoZWFkZXIgaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yKSB7XG4gICAgICBzZXRIZWFkZXJzKGhlYWRlciwgdmFsdWVPclJld3JpdGUpXG4gICAgfSBlbHNlIGlmKHV0aWxzLmlzU3RyaW5nKGhlYWRlcikgJiYgKGhlYWRlciA9IGhlYWRlci50cmltKCkpICYmICFpc1ZhbGlkSGVhZGVyTmFtZShoZWFkZXIpKSB7XG4gICAgICBzZXRIZWFkZXJzKHBhcnNlSGVhZGVycyhoZWFkZXIpLCB2YWx1ZU9yUmV3cml0ZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0hlYWRlcnMoaGVhZGVyKSkge1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaGVhZGVyLmVudHJpZXMoKSkge1xuICAgICAgICBzZXRIZWFkZXIodmFsdWUsIGtleSwgcmV3cml0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWRlciAhPSBudWxsICYmIHNldEhlYWRlcih2YWx1ZU9yUmV3cml0ZSwgaGVhZGVyLCByZXdyaXRlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldChoZWFkZXIsIHBhcnNlcikge1xuICAgIGhlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpO1xuXG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleSh0aGlzLCBoZWFkZXIpO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1trZXldO1xuXG4gICAgICAgIGlmICghcGFyc2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnNlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZVRva2Vucyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihwYXJzZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlci5jYWxsKHRoaXMsIHZhbHVlLCBrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzUmVnRXhwKHBhcnNlcikpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VyLmV4ZWModmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncGFyc2VyIG11c3QgYmUgYm9vbGVhbnxyZWdleHB8ZnVuY3Rpb24nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYXMoaGVhZGVyLCBtYXRjaGVyKSB7XG4gICAgaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKGhlYWRlcik7XG5cbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHRoaXMsIGhlYWRlcik7XG5cbiAgICAgIHJldHVybiAhIShrZXkgJiYgdGhpc1trZXldICE9PSB1bmRlZmluZWQgJiYgKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUodGhpcywgdGhpc1trZXldLCBrZXksIG1hdGNoZXIpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZGVsZXRlKGhlYWRlciwgbWF0Y2hlcikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGxldCBkZWxldGVkID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBkZWxldGVIZWFkZXIoX2hlYWRlcikge1xuICAgICAgX2hlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihfaGVhZGVyKTtcblxuICAgICAgaWYgKF9oZWFkZXIpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleShzZWxmLCBfaGVhZGVyKTtcblxuICAgICAgICBpZiAoa2V5ICYmICghbWF0Y2hlciB8fCBtYXRjaEhlYWRlclZhbHVlKHNlbGYsIHNlbGZba2V5XSwga2V5LCBtYXRjaGVyKSkpIHtcbiAgICAgICAgICBkZWxldGUgc2VsZltrZXldO1xuXG4gICAgICAgICAgZGVsZXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheShoZWFkZXIpKSB7XG4gICAgICBoZWFkZXIuZm9yRWFjaChkZWxldGVIZWFkZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGVIZWFkZXIoaGVhZGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVsZXRlZDtcbiAgfVxuXG4gIGNsZWFyKG1hdGNoZXIpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcyk7XG4gICAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgICBsZXQgZGVsZXRlZCA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUodGhpcywgdGhpc1trZXldLCBrZXksIG1hdGNoZXIsIHRydWUpKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzW2tleV07XG4gICAgICAgIGRlbGV0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWxldGVkO1xuICB9XG5cbiAgbm9ybWFsaXplKGZvcm1hdCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGhlYWRlcnMgPSB7fTtcblxuICAgIHV0aWxzLmZvckVhY2godGhpcywgKHZhbHVlLCBoZWFkZXIpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkoaGVhZGVycywgaGVhZGVyKTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBzZWxmW2tleV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIGRlbGV0ZSBzZWxmW2hlYWRlcl07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGZvcm1hdCA/IGZvcm1hdEhlYWRlcihoZWFkZXIpIDogU3RyaW5nKGhlYWRlcikudHJpbSgpO1xuXG4gICAgICBpZiAobm9ybWFsaXplZCAhPT0gaGVhZGVyKSB7XG4gICAgICAgIGRlbGV0ZSBzZWxmW2hlYWRlcl07XG4gICAgICB9XG5cbiAgICAgIHNlbGZbbm9ybWFsaXplZF0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZF0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjb25jYXQoLi4udGFyZ2V0cykge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmNvbmNhdCh0aGlzLCAuLi50YXJnZXRzKTtcbiAgfVxuXG4gIHRvSlNPTihhc1N0cmluZ3MpIHtcbiAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLCAodmFsdWUsIGhlYWRlcikgPT4ge1xuICAgICAgdmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgKG9ialtoZWFkZXJdID0gYXNTdHJpbmdzICYmIHV0aWxzLmlzQXJyYXkodmFsdWUpID8gdmFsdWUuam9pbignLCAnKSA6IHZhbHVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy50b0pTT04oKSlbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMudG9KU09OKCkpLm1hcCgoW2hlYWRlciwgdmFsdWVdKSA9PiBoZWFkZXIgKyAnOiAnICsgdmFsdWUpLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgIHJldHVybiAnQXhpb3NIZWFkZXJzJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHRoaW5nKSB7XG4gICAgcmV0dXJuIHRoaW5nIGluc3RhbmNlb2YgdGhpcyA/IHRoaW5nIDogbmV3IHRoaXModGhpbmcpO1xuICB9XG5cbiAgc3RhdGljIGNvbmNhdChmaXJzdCwgLi4udGFyZ2V0cykge1xuICAgIGNvbnN0IGNvbXB1dGVkID0gbmV3IHRoaXMoZmlyc3QpO1xuXG4gICAgdGFyZ2V0cy5mb3JFYWNoKCh0YXJnZXQpID0+IGNvbXB1dGVkLnNldCh0YXJnZXQpKTtcblxuICAgIHJldHVybiBjb21wdXRlZDtcbiAgfVxuXG4gIHN0YXRpYyBhY2Nlc3NvcihoZWFkZXIpIHtcbiAgICBjb25zdCBpbnRlcm5hbHMgPSB0aGlzWyRpbnRlcm5hbHNdID0gKHRoaXNbJGludGVybmFsc10gPSB7XG4gICAgICBhY2Nlc3NvcnM6IHt9XG4gICAgfSk7XG5cbiAgICBjb25zdCBhY2Nlc3NvcnMgPSBpbnRlcm5hbHMuYWNjZXNzb3JzO1xuICAgIGNvbnN0IHByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xuXG4gICAgZnVuY3Rpb24gZGVmaW5lQWNjZXNzb3IoX2hlYWRlcikge1xuICAgICAgY29uc3QgbEhlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihfaGVhZGVyKTtcblxuICAgICAgaWYgKCFhY2Nlc3NvcnNbbEhlYWRlcl0pIHtcbiAgICAgICAgYnVpbGRBY2Nlc3NvcnMocHJvdG90eXBlLCBfaGVhZGVyKTtcbiAgICAgICAgYWNjZXNzb3JzW2xIZWFkZXJdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlscy5pc0FycmF5KGhlYWRlcikgPyBoZWFkZXIuZm9yRWFjaChkZWZpbmVBY2Nlc3NvcikgOiBkZWZpbmVBY2Nlc3NvcihoZWFkZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuQXhpb3NIZWFkZXJzLmFjY2Vzc29yKFsnQ29udGVudC1UeXBlJywgJ0NvbnRlbnQtTGVuZ3RoJywgJ0FjY2VwdCcsICdBY2NlcHQtRW5jb2RpbmcnLCAnVXNlci1BZ2VudCcsICdBdXRob3JpemF0aW9uJ10pO1xuXG4vLyByZXNlcnZlZCBuYW1lcyBob3RmaXhcbnV0aWxzLnJlZHVjZURlc2NyaXB0b3JzKEF4aW9zSGVhZGVycy5wcm90b3R5cGUsICh7dmFsdWV9LCBrZXkpID0+IHtcbiAgbGV0IG1hcHBlZCA9IGtleVswXS50b1VwcGVyQ2FzZSgpICsga2V5LnNsaWNlKDEpOyAvLyBtYXAgYHNldGAgPT4gYFNldGBcbiAgcmV0dXJuIHtcbiAgICBnZXQ6ICgpID0+IHZhbHVlLFxuICAgIHNldChoZWFkZXJWYWx1ZSkge1xuICAgICAgdGhpc1ttYXBwZWRdID0gaGVhZGVyVmFsdWU7XG4gICAgfVxuICB9XG59KTtcblxudXRpbHMuZnJlZXplTWV0aG9kcyhBeGlvc0hlYWRlcnMpO1xuXG5leHBvcnQgZGVmYXVsdCBBeGlvc0hlYWRlcnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcblxuY2xhc3MgSW50ZXJjZXB0b3JNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gICAqL1xuICB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICAgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgICBmdWxmaWxsZWQsXG4gICAgICByZWplY3RlZCxcbiAgICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgICAgcnVuV2hlbjogb3B0aW9ucyA/IG9wdGlvbnMucnVuV2hlbiA6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGludGVyY2VwdG9yIHdhcyByZW1vdmVkLCBgZmFsc2VgIG90aGVyd2lzZVxuICAgKi9cbiAgZWplY3QoaWQpIHtcbiAgICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIGludGVyY2VwdG9ycyBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLmhhbmRsZXJzKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gICAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZvckVhY2goZm4pIHtcbiAgICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICAgIGZuKGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGlzQWJzb2x1dGVVUkwgZnJvbSAnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMLmpzJztcbmltcG9ydCBjb21iaW5lVVJMcyBmcm9tICcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdHJhbnNmb3JtRGF0YSBmcm9tICcuL3RyYW5zZm9ybURhdGEuanMnO1xuaW1wb3J0IGlzQ2FuY2VsIGZyb20gJy4uL2NhbmNlbC9pc0NhbmNlbC5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vZGVmYXVsdHMvaW5kZXguanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuLi9jb3JlL0F4aW9zSGVhZGVycy5qcyc7XG5pbXBvcnQgYWRhcHRlcnMgZnJvbSBcIi4uL2FkYXB0ZXJzL2FkYXB0ZXJzLmpzXCI7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGVkRXJyb3JgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cblxuICBpZiAoY29uZmlnLnNpZ25hbCAmJiBjb25maWcuc2lnbmFsLmFib3J0ZWQpIHtcbiAgICB0aHJvdyBuZXcgQ2FuY2VsZWRFcnJvcihudWxsLCBjb25maWcpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICpcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgY29uZmlnLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShjb25maWcuaGVhZGVycyk7XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICBjb25maWcsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICBpZiAoWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLmluZGV4T2YoY29uZmlnLm1ldGhvZCkgIT09IC0xKSB7XG4gICAgY29uZmlnLmhlYWRlcnMuc2V0Q29udGVudFR5cGUoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsIGZhbHNlKTtcbiAgfVxuXG4gIGNvbnN0IGFkYXB0ZXIgPSBhZGFwdGVycy5nZXRBZGFwdGVyKGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXIpO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgY29uZmlnLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlLFxuICAgICAgcmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmVzcG9uc2UuaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKHJlc3BvbnNlLmhlYWRlcnMpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZVxuICAgICAgICApO1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL0F4aW9zSGVhZGVycy5qc1wiO1xuXG5jb25zdCBoZWFkZXJzVG9PYmplY3QgPSAodGhpbmcpID0+IHRoaW5nIGluc3RhbmNlb2YgQXhpb3NIZWFkZXJzID8geyAuLi50aGluZyB9IDogdGhpbmc7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIGNvbnN0IGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlLCBjYXNlbGVzcykge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UuY2FsbCh7Y2FzZWxlc3N9LCB0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMoYSwgYiwgY2FzZWxlc3MpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoYSwgYiwgY2FzZWxlc3MpO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGEpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhLCBjYXNlbGVzcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIoYSwgYikge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYikpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKGEsIGIpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBiKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChhKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhhLCBiLCBwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGEsIGIpO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtZXJnZU1hcCA9IHtcbiAgICB1cmw6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgbWV0aG9kOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIGRhdGE6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgYmFzZVVSTDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHBhcmFtc1NlcmlhbGl6ZXI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdGltZW91dDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0aW1lb3V0TWVzc2FnZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB3aXRoQ3JlZGVudGlhbHM6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgd2l0aFhTUkZUb2tlbjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBhZGFwdGVyOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHJlc3BvbnNlVHlwZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmQ29va2llTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmSGVhZGVyTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBvblVwbG9hZFByb2dyZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG9uRG93bmxvYWRQcm9ncmVzczogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBkZWNvbXByZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG1heENvbnRlbnRMZW5ndGg6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgbWF4Qm9keUxlbmd0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBiZWZvcmVSZWRpcmVjdDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc3BvcnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgaHR0cEFnZW50OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGh0dHBzQWdlbnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgY2FuY2VsVG9rZW46IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgc29ja2V0UGF0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICByZXNwb25zZUVuY29kaW5nOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHZhbGlkYXRlU3RhdHVzOiBtZXJnZURpcmVjdEtleXMsXG4gICAgaGVhZGVyczogKGEsIGIpID0+IG1lcmdlRGVlcFByb3BlcnRpZXMoaGVhZGVyc1RvT2JqZWN0KGEpLCBoZWFkZXJzVG9PYmplY3QoYiksIHRydWUpXG4gIH07XG5cbiAgdXRpbHMuZm9yRWFjaChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCBjb25maWcxLCBjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgY29uc3QgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gbWVyZ2UoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSwgcHJvcCk7XG4gICAgKHV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZ1ZhbHVlKSAmJiBtZXJnZSAhPT0gbWVyZ2VEaXJlY3RLZXlzKSB8fCAoY29uZmlnW3Byb3BdID0gY29uZmlnVmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuL0F4aW9zRXJyb3IuanMnO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSByZXNwb25zZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgY29uc3QgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIFtBeGlvc0Vycm9yLkVSUl9CQURfUkVRVUVTVCwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFXVtNYXRoLmZsb29yKHJlc3BvbnNlLnN0YXR1cyAvIDEwMCkgLSA0XSxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHBhcmFtIHs/T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGZucywgcmVzcG9uc2UpIHtcbiAgY29uc3QgY29uZmlnID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgY29uc3QgY29udGV4dCA9IHJlc3BvbnNlIHx8IGNvbmZpZztcbiAgY29uc3QgaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGNvbnRleHQuaGVhZGVycyk7XG4gIGxldCBkYXRhID0gY29udGV4dC5kYXRhO1xuXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4uY2FsbChjb25maWcsIGRhdGEsIGhlYWRlcnMubm9ybWFsaXplKCksIHJlc3BvbnNlID8gcmVzcG9uc2Uuc3RhdHVzIDogdW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgaGVhZGVycy5ub3JtYWxpemUoKTtcblxuICByZXR1cm4gZGF0YTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgdHJhbnNpdGlvbmFsRGVmYXVsdHMgZnJvbSAnLi90cmFuc2l0aW9uYWwuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi4vaGVscGVycy90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCB0b1VSTEVuY29kZWRGb3JtIGZyb20gJy4uL2hlbHBlcnMvdG9VUkxFbmNvZGVkRm9ybS5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuaW1wb3J0IGZvcm1EYXRhVG9KU09OIGZyb20gJy4uL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMnO1xuXG4vKipcbiAqIEl0IHRha2VzIGEgc3RyaW5nLCB0cmllcyB0byBwYXJzZSBpdCwgYW5kIGlmIGl0IGZhaWxzLCBpdCByZXR1cm5zIHRoZSBzdHJpbmdpZmllZCB2ZXJzaW9uXG4gKiBvZiB0aGUgaW5wdXRcbiAqXG4gKiBAcGFyYW0ge2FueX0gcmF3VmFsdWUgLSBUaGUgdmFsdWUgdG8gYmUgc3RyaW5naWZpZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJzZXIgLSBBIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIGEgc3RyaW5nIGludG8gYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVuY29kZXIgLSBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSB2YWx1ZSBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZ2lmaWVkIHZlcnNpb24gb2YgdGhlIHJhd1ZhbHVlLlxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cbiAgdHJhbnNpdGlvbmFsOiB0cmFuc2l0aW9uYWxEZWZhdWx0cyxcblxuICBhZGFwdGVyOiBbJ3hocicsICdodHRwJywgJ2ZldGNoJ10sXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gaGVhZGVycy5nZXRDb250ZW50VHlwZSgpIHx8ICcnO1xuICAgIGNvbnN0IGhhc0pTT05Db250ZW50VHlwZSA9IGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSA+IC0xO1xuICAgIGNvbnN0IGlzT2JqZWN0UGF5bG9hZCA9IHV0aWxzLmlzT2JqZWN0KGRhdGEpO1xuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCAmJiB1dGlscy5pc0hUTUxGb3JtKGRhdGEpKSB7XG4gICAgICBkYXRhID0gbmV3IEZvcm1EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRm9ybURhdGEgPSB1dGlscy5pc0Zvcm1EYXRhKGRhdGEpO1xuXG4gICAgaWYgKGlzRm9ybURhdGEpIHtcbiAgICAgIHJldHVybiBoYXNKU09OQ29udGVudFR5cGUgPyBKU09OLnN0cmluZ2lmeShmb3JtRGF0YVRvSlNPTihkYXRhKSkgOiBkYXRhO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1JlYWRhYmxlU3RyZWFtKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnLCBmYWxzZSk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBpc0ZpbGVMaXN0O1xuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCkge1xuICAgICAgaWYgKGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRvVVJMRW5jb2RlZEZvcm0oZGF0YSwgdGhpcy5mb3JtU2VyaWFsaXplcikudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChpc0ZpbGVMaXN0ID0gdXRpbHMuaXNGaWxlTGlzdChkYXRhKSkgfHwgY29udGVudFR5cGUuaW5kZXhPZignbXVsdGlwYXJ0L2Zvcm0tZGF0YScpID4gLTEpIHtcbiAgICAgICAgY29uc3QgX0Zvcm1EYXRhID0gdGhpcy5lbnYgJiYgdGhpcy5lbnYuRm9ybURhdGE7XG5cbiAgICAgICAgcmV0dXJuIHRvRm9ybURhdGEoXG4gICAgICAgICAgaXNGaWxlTGlzdCA/IHsnZmlsZXNbXSc6IGRhdGF9IDogZGF0YSxcbiAgICAgICAgICBfRm9ybURhdGEgJiYgbmV3IF9Gb3JtRGF0YSgpLFxuICAgICAgICAgIHRoaXMuZm9ybVNlcmlhbGl6ZXJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNPYmplY3RQYXlsb2FkIHx8IGhhc0pTT05Db250ZW50VHlwZSApIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nLCBmYWxzZSk7XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2FmZWx5KGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICBjb25zdCB0cmFuc2l0aW9uYWwgPSB0aGlzLnRyYW5zaXRpb25hbCB8fCBkZWZhdWx0cy50cmFuc2l0aW9uYWw7XG4gICAgY29uc3QgZm9yY2VkSlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLmZvcmNlZEpTT05QYXJzaW5nO1xuICAgIGNvbnN0IEpTT05SZXF1ZXN0ZWQgPSB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nO1xuXG4gICAgaWYgKHV0aWxzLmlzUmVzcG9uc2UoZGF0YSkgfHwgdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgJiYgdXRpbHMuaXNTdHJpbmcoZGF0YSkgJiYgKChmb3JjZWRKU09OUGFyc2luZyAmJiAhdGhpcy5yZXNwb25zZVR5cGUpIHx8IEpTT05SZXF1ZXN0ZWQpKSB7XG4gICAgICBjb25zdCBzaWxlbnRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuc2lsZW50SlNPTlBhcnNpbmc7XG4gICAgICBjb25zdCBzdHJpY3RKU09OUGFyc2luZyA9ICFzaWxlbnRKU09OUGFyc2luZyAmJiBKU09OUmVxdWVzdGVkO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHN0cmljdEpTT05QYXJzaW5nKSB7XG4gICAgICAgICAgaWYgKGUubmFtZSA9PT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICAgICAgdGhyb3cgQXhpb3NFcnJvci5mcm9tKGUsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVNQT05TRSwgdGhpcywgbnVsbCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIGVudjoge1xuICAgIEZvcm1EYXRhOiBwbGF0Zm9ybS5jbGFzc2VzLkZvcm1EYXRhLFxuICAgIEJsb2I6IHBsYXRmb3JtLmNsYXNzZXMuQmxvYlxuICB9LFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH0sXG5cbiAgaGVhZGVyczoge1xuICAgIGNvbW1vbjoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCddLCAobWV0aG9kKSA9PiB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNpbGVudEpTT05QYXJzaW5nOiB0cnVlLFxuICBmb3JjZWRKU09OUGFyc2luZzogdHJ1ZSxcbiAgY2xhcmlmeVRpbWVvdXRFcnJvcjogZmFsc2Vcbn07XG4iLCJleHBvcnQgY29uc3QgVkVSU0lPTiA9IFwiMS43LjJcIjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4vdG9Gb3JtRGF0YS5qcyc7XG5cbi8qKlxuICogSXQgZW5jb2RlcyBhIHN0cmluZyBieSByZXBsYWNpbmcgYWxsIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IGluIHRoZSB1bnJlc2VydmVkIHNldCB3aXRoXG4gKiB0aGVpciBwZXJjZW50LWVuY29kZWQgZXF1aXZhbGVudHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBlbmNvZGUuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGVuY29kZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBlbmNvZGUoc3RyKSB7XG4gIGNvbnN0IGNoYXJNYXAgPSB7XG4gICAgJyEnOiAnJTIxJyxcbiAgICBcIidcIjogJyUyNycsXG4gICAgJygnOiAnJTI4JyxcbiAgICAnKSc6ICclMjknLFxuICAgICd+JzogJyU3RScsXG4gICAgJyUyMCc6ICcrJyxcbiAgICAnJTAwJzogJ1xceDAwJ1xuICB9O1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCl+XXwlMjB8JTAwL2csIGZ1bmN0aW9uIHJlcGxhY2VyKG1hdGNoKSB7XG4gICAgcmV0dXJuIGNoYXJNYXBbbWF0Y2hdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHBhcmFtcyBvYmplY3QgYW5kIGNvbnZlcnRzIGl0IHRvIGEgRm9ybURhdGEgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBGb3JtRGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBvYmplY3QgcGFzc2VkIHRvIHRoZSBBeGlvcyBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKSB7XG4gIHRoaXMuX3BhaXJzID0gW107XG5cbiAgcGFyYW1zICYmIHRvRm9ybURhdGEocGFyYW1zLCB0aGlzLCBvcHRpb25zKTtcbn1cblxuY29uc3QgcHJvdG90eXBlID0gQXhpb3NVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlO1xuXG5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gYXBwZW5kKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX3BhaXJzLnB1c2goW25hbWUsIHZhbHVlXSk7XG59O1xuXG5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhlbmNvZGVyKSB7XG4gIGNvbnN0IF9lbmNvZGUgPSBlbmNvZGVyID8gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2Rlci5jYWxsKHRoaXMsIHZhbHVlLCBlbmNvZGUpO1xuICB9IDogZW5jb2RlO1xuXG4gIHJldHVybiB0aGlzLl9wYWlycy5tYXAoZnVuY3Rpb24gZWFjaChwYWlyKSB7XG4gICAgcmV0dXJuIF9lbmNvZGUocGFpclswXSkgKyAnPScgKyBfZW5jb2RlKHBhaXJbMV0pO1xuICB9LCAnJykuam9pbignJicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCJjb25zdCBIdHRwU3RhdHVzQ29kZSA9IHtcbiAgQ29udGludWU6IDEwMCxcbiAgU3dpdGNoaW5nUHJvdG9jb2xzOiAxMDEsXG4gIFByb2Nlc3Npbmc6IDEwMixcbiAgRWFybHlIaW50czogMTAzLFxuICBPazogMjAwLFxuICBDcmVhdGVkOiAyMDEsXG4gIEFjY2VwdGVkOiAyMDIsXG4gIE5vbkF1dGhvcml0YXRpdmVJbmZvcm1hdGlvbjogMjAzLFxuICBOb0NvbnRlbnQ6IDIwNCxcbiAgUmVzZXRDb250ZW50OiAyMDUsXG4gIFBhcnRpYWxDb250ZW50OiAyMDYsXG4gIE11bHRpU3RhdHVzOiAyMDcsXG4gIEFscmVhZHlSZXBvcnRlZDogMjA4LFxuICBJbVVzZWQ6IDIyNixcbiAgTXVsdGlwbGVDaG9pY2VzOiAzMDAsXG4gIE1vdmVkUGVybWFuZW50bHk6IDMwMSxcbiAgRm91bmQ6IDMwMixcbiAgU2VlT3RoZXI6IDMwMyxcbiAgTm90TW9kaWZpZWQ6IDMwNCxcbiAgVXNlUHJveHk6IDMwNSxcbiAgVW51c2VkOiAzMDYsXG4gIFRlbXBvcmFyeVJlZGlyZWN0OiAzMDcsXG4gIFBlcm1hbmVudFJlZGlyZWN0OiAzMDgsXG4gIEJhZFJlcXVlc3Q6IDQwMCxcbiAgVW5hdXRob3JpemVkOiA0MDEsXG4gIFBheW1lbnRSZXF1aXJlZDogNDAyLFxuICBGb3JiaWRkZW46IDQwMyxcbiAgTm90Rm91bmQ6IDQwNCxcbiAgTWV0aG9kTm90QWxsb3dlZDogNDA1LFxuICBOb3RBY2NlcHRhYmxlOiA0MDYsXG4gIFByb3h5QXV0aGVudGljYXRpb25SZXF1aXJlZDogNDA3LFxuICBSZXF1ZXN0VGltZW91dDogNDA4LFxuICBDb25mbGljdDogNDA5LFxuICBHb25lOiA0MTAsXG4gIExlbmd0aFJlcXVpcmVkOiA0MTEsXG4gIFByZWNvbmRpdGlvbkZhaWxlZDogNDEyLFxuICBQYXlsb2FkVG9vTGFyZ2U6IDQxMyxcbiAgVXJpVG9vTG9uZzogNDE0LFxuICBVbnN1cHBvcnRlZE1lZGlhVHlwZTogNDE1LFxuICBSYW5nZU5vdFNhdGlzZmlhYmxlOiA0MTYsXG4gIEV4cGVjdGF0aW9uRmFpbGVkOiA0MTcsXG4gIEltQVRlYXBvdDogNDE4LFxuICBNaXNkaXJlY3RlZFJlcXVlc3Q6IDQyMSxcbiAgVW5wcm9jZXNzYWJsZUVudGl0eTogNDIyLFxuICBMb2NrZWQ6IDQyMyxcbiAgRmFpbGVkRGVwZW5kZW5jeTogNDI0LFxuICBUb29FYXJseTogNDI1LFxuICBVcGdyYWRlUmVxdWlyZWQ6IDQyNixcbiAgUHJlY29uZGl0aW9uUmVxdWlyZWQ6IDQyOCxcbiAgVG9vTWFueVJlcXVlc3RzOiA0MjksXG4gIFJlcXVlc3RIZWFkZXJGaWVsZHNUb29MYXJnZTogNDMxLFxuICBVbmF2YWlsYWJsZUZvckxlZ2FsUmVhc29uczogNDUxLFxuICBJbnRlcm5hbFNlcnZlckVycm9yOiA1MDAsXG4gIE5vdEltcGxlbWVudGVkOiA1MDEsXG4gIEJhZEdhdGV3YXk6IDUwMixcbiAgU2VydmljZVVuYXZhaWxhYmxlOiA1MDMsXG4gIEdhdGV3YXlUaW1lb3V0OiA1MDQsXG4gIEh0dHBWZXJzaW9uTm90U3VwcG9ydGVkOiA1MDUsXG4gIFZhcmlhbnRBbHNvTmVnb3RpYXRlczogNTA2LFxuICBJbnN1ZmZpY2llbnRTdG9yYWdlOiA1MDcsXG4gIExvb3BEZXRlY3RlZDogNTA4LFxuICBOb3RFeHRlbmRlZDogNTEwLFxuICBOZXR3b3JrQXV0aGVudGljYXRpb25SZXF1aXJlZDogNTExLFxufTtcblxuT2JqZWN0LmVudHJpZXMoSHR0cFN0YXR1c0NvZGUpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICBIdHRwU3RhdHVzQ29kZVt2YWx1ZV0gPSBrZXk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSHR0cFN0YXR1c0NvZGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NVUkxTZWFyY2hQYXJhbXMgZnJvbSAnLi4vaGVscGVycy9BeGlvc1VSTFNlYXJjaFBhcmFtcy5qcyc7XG5cbi8qKlxuICogSXQgcmVwbGFjZXMgYWxsIGluc3RhbmNlcyBvZiB0aGUgY2hhcmFjdGVycyBgOmAsIGAkYCwgYCxgLCBgK2AsIGBbYCwgYW5kIGBdYCB3aXRoIHRoZWlyXG4gKiBVUkkgZW5jb2RlZCBjb3VudGVycGFydHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsIFRoZSB2YWx1ZSB0byBiZSBlbmNvZGVkLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlbmNvZGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHBhcmFtIHs/b2JqZWN0fSBvcHRpb25zXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBcbiAgY29uc3QgX2VuY29kZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGUgfHwgZW5jb2RlO1xuXG4gIGNvbnN0IHNlcmlhbGl6ZUZuID0gb3B0aW9ucyAmJiBvcHRpb25zLnNlcmlhbGl6ZTtcblxuICBsZXQgc2VyaWFsaXplZFBhcmFtcztcblxuICBpZiAoc2VyaWFsaXplRm4pIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gc2VyaWFsaXplRm4ocGFyYW1zLCBvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gdXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSA/XG4gICAgICBwYXJhbXMudG9TdHJpbmcoKSA6XG4gICAgICBuZXcgQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKS50b1N0cmluZyhfZW5jb2RlKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgY29uc3QgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKFwiI1wiKTtcblxuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvP1xcLyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn1cbiIsImltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gXCIuLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qc1wiO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSBcIi4uL2NvcmUvQXhpb3NFcnJvci5qc1wiO1xuXG5jb25zdCBjb21wb3NlU2lnbmFscyA9IChzaWduYWxzLCB0aW1lb3V0KSA9PiB7XG4gIGxldCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXG4gIGxldCBhYm9ydGVkO1xuXG4gIGNvbnN0IG9uYWJvcnQgPSBmdW5jdGlvbiAoY2FuY2VsKSB7XG4gICAgaWYgKCFhYm9ydGVkKSB7XG4gICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICBjb25zdCBlcnIgPSBjYW5jZWwgaW5zdGFuY2VvZiBFcnJvciA/IGNhbmNlbCA6IHRoaXMucmVhc29uO1xuICAgICAgY29udHJvbGxlci5hYm9ydChlcnIgaW5zdGFuY2VvZiBBeGlvc0Vycm9yID8gZXJyIDogbmV3IENhbmNlbGVkRXJyb3IoZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IGVycikpO1xuICAgIH1cbiAgfVxuXG4gIGxldCB0aW1lciA9IHRpbWVvdXQgJiYgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgb25hYm9ydChuZXcgQXhpb3NFcnJvcihgdGltZW91dCAke3RpbWVvdXR9IG9mIG1zIGV4Y2VlZGVkYCwgQXhpb3NFcnJvci5FVElNRURPVVQpKVxuICB9LCB0aW1lb3V0KVxuXG4gIGNvbnN0IHVuc3Vic2NyaWJlID0gKCkgPT4ge1xuICAgIGlmIChzaWduYWxzKSB7XG4gICAgICB0aW1lciAmJiBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgc2lnbmFscy5mb3JFYWNoKHNpZ25hbCA9PiB7XG4gICAgICAgIHNpZ25hbCAmJlxuICAgICAgICAoc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIgPyBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbmFib3J0KSA6IHNpZ25hbC51bnN1YnNjcmliZShvbmFib3J0KSk7XG4gICAgICB9KTtcbiAgICAgIHNpZ25hbHMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNpZ25hbHMuZm9yRWFjaCgoc2lnbmFsKSA9PiBzaWduYWwgJiYgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCkpO1xuXG4gIGNvbnN0IHtzaWduYWx9ID0gY29udHJvbGxlcjtcblxuICBzaWduYWwudW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTtcblxuICByZXR1cm4gW3NpZ25hbCwgKCkgPT4ge1xuICAgIHRpbWVyICYmIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgdGltZXIgPSBudWxsO1xuICB9XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zZVNpZ25hbHM7XG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuXG5leHBvcnQgZGVmYXVsdCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICB7XG4gICAgd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICBjb25zdCBjb29raWUgPSBbbmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSldO1xuXG4gICAgICB1dGlscy5pc051bWJlcihleHBpcmVzKSAmJiBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG5cbiAgICAgIHV0aWxzLmlzU3RyaW5nKHBhdGgpICYmIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcblxuICAgICAgdXRpbHMuaXNTdHJpbmcoZG9tYWluKSAmJiBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuXG4gICAgICBzZWN1cmUgPT09IHRydWUgJiYgY29va2llLnB1c2goJ3NlY3VyZScpO1xuXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICB9LFxuXG4gICAgcmVhZChuYW1lKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgIH0sXG5cbiAgICByZW1vdmUobmFtZSkge1xuICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICB9XG4gIH1cblxuICA6XG5cbiAgLy8gTm9uLXN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICB7XG4gICAgd3JpdGUoKSB7fSxcbiAgICByZWFkKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByZW1vdmUoKSB7fVxuICB9O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogSXQgdGFrZXMgYSBzdHJpbmcgbGlrZSBgZm9vW3hdW3ldW3pdYCBhbmQgcmV0dXJucyBhbiBhcnJheSBsaWtlIGBbJ2ZvbycsICd4JywgJ3knLCAneiddXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICpcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlUHJvcFBhdGgobmFtZSkge1xuICAvLyBmb29beF1beV1bel1cbiAgLy8gZm9vLngueS56XG4gIC8vIGZvby14LXktelxuICAvLyBmb28geCB5IHpcbiAgcmV0dXJuIHV0aWxzLm1hdGNoQWxsKC9cXHcrfFxcWyhcXHcqKV0vZywgbmFtZSkubWFwKG1hdGNoID0+IHtcbiAgICByZXR1cm4gbWF0Y2hbMF0gPT09ICdbXScgPyAnJyA6IG1hdGNoWzFdIHx8IG1hdGNoWzBdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIGFycmF5IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGFyciAtIFRoZSBhcnJheSB0byBjb252ZXJ0IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFuZCB2YWx1ZXMgYXMgdGhlIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheVRvT2JqZWN0KGFycikge1xuICBjb25zdCBvYmogPSB7fTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gIGxldCBpO1xuICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgbGV0IGtleTtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICBvYmpba2V5XSA9IGFycltrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBGb3JtRGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBKYXZhU2NyaXB0IG9iamVjdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtRGF0YSBUaGUgRm9ybURhdGEgb2JqZWN0IHRvIGNvbnZlcnQgdG8gSlNPTi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0PHN0cmluZywgYW55PiB8IG51bGx9IFRoZSBjb252ZXJ0ZWQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBmb3JtRGF0YVRvSlNPTihmb3JtRGF0YSkge1xuICBmdW5jdGlvbiBidWlsZFBhdGgocGF0aCwgdmFsdWUsIHRhcmdldCwgaW5kZXgpIHtcbiAgICBsZXQgbmFtZSA9IHBhdGhbaW5kZXgrK107XG5cbiAgICBpZiAobmFtZSA9PT0gJ19fcHJvdG9fXycpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3QgaXNOdW1lcmljS2V5ID0gTnVtYmVyLmlzRmluaXRlKCtuYW1lKTtcbiAgICBjb25zdCBpc0xhc3QgPSBpbmRleCA+PSBwYXRoLmxlbmd0aDtcbiAgICBuYW1lID0gIW5hbWUgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXQpID8gdGFyZ2V0Lmxlbmd0aCA6IG5hbWU7XG5cbiAgICBpZiAoaXNMYXN0KSB7XG4gICAgICBpZiAodXRpbHMuaGFzT3duUHJvcCh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IFt0YXJnZXRbbmFtZV0sIHZhbHVlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gIWlzTnVtZXJpY0tleTtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldFtuYW1lXSB8fCAhdXRpbHMuaXNPYmplY3QodGFyZ2V0W25hbWVdKSkge1xuICAgICAgdGFyZ2V0W25hbWVdID0gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYnVpbGRQYXRoKHBhdGgsIHZhbHVlLCB0YXJnZXRbbmFtZV0sIGluZGV4KTtcblxuICAgIGlmIChyZXN1bHQgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXRbbmFtZV0pKSB7XG4gICAgICB0YXJnZXRbbmFtZV0gPSBhcnJheVRvT2JqZWN0KHRhcmdldFtuYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICFpc051bWVyaWNLZXk7XG4gIH1cblxuICBpZiAodXRpbHMuaXNGb3JtRGF0YShmb3JtRGF0YSkgJiYgdXRpbHMuaXNGdW5jdGlvbihmb3JtRGF0YS5lbnRyaWVzKSkge1xuICAgIGNvbnN0IG9iaiA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaEVudHJ5KGZvcm1EYXRhLCAobmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGJ1aWxkUGF0aChwYXJzZVByb3BQYXRoKG5hbWUpLCB2YWx1ZSwgb2JqLCAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9ybURhdGFUb0pTT047XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkK1xcLS5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gdXRpbHMuaXNPYmplY3QocGF5bG9hZCkgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgcGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyRW52ID9cblxuLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4vLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICBjb25zdCBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBjb25zdCB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsZXQgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdHMgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgbGV0IGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgIH07XG4gIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH0pKCk7XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc3RyaWN0XG5leHBvcnQgZGVmYXVsdCBudWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbi8vIFJhd0F4aW9zSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbmNvbnN0IGlnbm9yZUR1cGxpY2F0ZU9mID0gdXRpbHMudG9PYmplY3RTZXQoW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl0pO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmF3SGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKlxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgcmF3SGVhZGVycyA9PiB7XG4gIGNvbnN0IHBhcnNlZCA9IHt9O1xuICBsZXQga2V5O1xuICBsZXQgdmFsO1xuICBsZXQgaTtcblxuICByYXdIZWFkZXJzICYmIHJhd0hlYWRlcnMuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgaSkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gbGluZS5zdWJzdHJpbmcoaSArIDEpLnRyaW0oKTtcblxuICAgIGlmICgha2V5IHx8IChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZltrZXldKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgaWYgKHBhcnNlZFtrZXldKSB7XG4gICAgICAgIHBhcnNlZFtrZXldLnB1c2godmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gW3ZhbF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VQcm90b2NvbCh1cmwpIHtcbiAgY29uc3QgbWF0Y2ggPSAvXihbLStcXHddezEsMjV9KSg6P1xcL1xcL3w6KS8uZXhlYyh1cmwpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV0gfHwgJyc7XG59XG4iLCJpbXBvcnQgc3BlZWRvbWV0ZXIgZnJvbSBcIi4vc3BlZWRvbWV0ZXIuanNcIjtcbmltcG9ydCB0aHJvdHRsZSBmcm9tIFwiLi90aHJvdHRsZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAobGlzdGVuZXIsIGlzRG93bmxvYWRTdHJlYW0sIGZyZXEgPSAzKSA9PiB7XG4gIGxldCBieXRlc05vdGlmaWVkID0gMDtcbiAgY29uc3QgX3NwZWVkb21ldGVyID0gc3BlZWRvbWV0ZXIoNTAsIDI1MCk7XG5cbiAgcmV0dXJuIHRocm90dGxlKGUgPT4ge1xuICAgIGNvbnN0IGxvYWRlZCA9IGUubG9hZGVkO1xuICAgIGNvbnN0IHRvdGFsID0gZS5sZW5ndGhDb21wdXRhYmxlID8gZS50b3RhbCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwcm9ncmVzc0J5dGVzID0gbG9hZGVkIC0gYnl0ZXNOb3RpZmllZDtcbiAgICBjb25zdCByYXRlID0gX3NwZWVkb21ldGVyKHByb2dyZXNzQnl0ZXMpO1xuICAgIGNvbnN0IGluUmFuZ2UgPSBsb2FkZWQgPD0gdG90YWw7XG5cbiAgICBieXRlc05vdGlmaWVkID0gbG9hZGVkO1xuXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGxvYWRlZCxcbiAgICAgIHRvdGFsLFxuICAgICAgcHJvZ3Jlc3M6IHRvdGFsID8gKGxvYWRlZCAvIHRvdGFsKSA6IHVuZGVmaW5lZCxcbiAgICAgIGJ5dGVzOiBwcm9ncmVzc0J5dGVzLFxuICAgICAgcmF0ZTogcmF0ZSA/IHJhdGUgOiB1bmRlZmluZWQsXG4gICAgICBlc3RpbWF0ZWQ6IHJhdGUgJiYgdG90YWwgJiYgaW5SYW5nZSA/ICh0b3RhbCAtIGxvYWRlZCkgLyByYXRlIDogdW5kZWZpbmVkLFxuICAgICAgZXZlbnQ6IGUsXG4gICAgICBsZW5ndGhDb21wdXRhYmxlOiB0b3RhbCAhPSBudWxsXG4gICAgfTtcblxuICAgIGRhdGFbaXNEb3dubG9hZFN0cmVhbSA/ICdkb3dubG9hZCcgOiAndXBsb2FkJ10gPSB0cnVlO1xuXG4gICAgbGlzdGVuZXIoZGF0YSk7XG4gIH0sIGZyZXEpO1xufVxuIiwiaW1wb3J0IHBsYXRmb3JtIGZyb20gXCIuLi9wbGF0Zm9ybS9pbmRleC5qc1wiO1xuaW1wb3J0IHV0aWxzIGZyb20gXCIuLi91dGlscy5qc1wiO1xuaW1wb3J0IGlzVVJMU2FtZU9yaWdpbiBmcm9tIFwiLi9pc1VSTFNhbWVPcmlnaW4uanNcIjtcbmltcG9ydCBjb29raWVzIGZyb20gXCIuL2Nvb2tpZXMuanNcIjtcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gXCIuLi9jb3JlL2J1aWxkRnVsbFBhdGguanNcIjtcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tIFwiLi4vY29yZS9tZXJnZUNvbmZpZy5qc1wiO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCBidWlsZFVSTCBmcm9tIFwiLi9idWlsZFVSTC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAoY29uZmlnKSA9PiB7XG4gIGNvbnN0IG5ld0NvbmZpZyA9IG1lcmdlQ29uZmlnKHt9LCBjb25maWcpO1xuXG4gIGxldCB7ZGF0YSwgd2l0aFhTUkZUb2tlbiwgeHNyZkhlYWRlck5hbWUsIHhzcmZDb29raWVOYW1lLCBoZWFkZXJzLCBhdXRofSA9IG5ld0NvbmZpZztcblxuICBuZXdDb25maWcuaGVhZGVycyA9IGhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShoZWFkZXJzKTtcblxuICBuZXdDb25maWcudXJsID0gYnVpbGRVUkwoYnVpbGRGdWxsUGF0aChuZXdDb25maWcuYmFzZVVSTCwgbmV3Q29uZmlnLnVybCksIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKTtcblxuICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gIGlmIChhdXRoKSB7XG4gICAgaGVhZGVycy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArXG4gICAgICBidG9hKChhdXRoLnVzZXJuYW1lIHx8ICcnKSArICc6JyArIChhdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGF1dGgucGFzc3dvcmQpKSA6ICcnKSlcbiAgICApO1xuICB9XG5cbiAgbGV0IGNvbnRlbnRUeXBlO1xuXG4gIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpKSB7XG4gICAgaWYgKHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudiB8fCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJXZWJXb3JrZXJFbnYpIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUodW5kZWZpbmVkKTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH0gZWxzZSBpZiAoKGNvbnRlbnRUeXBlID0gaGVhZGVycy5nZXRDb250ZW50VHlwZSgpKSAhPT0gZmFsc2UpIHtcbiAgICAgIC8vIGZpeCBzZW1pY29sb24gZHVwbGljYXRpb24gaXNzdWUgZm9yIFJlYWN0TmF0aXZlIEZvcm1EYXRhIGltcGxlbWVudGF0aW9uXG4gICAgICBjb25zdCBbdHlwZSwgLi4udG9rZW5zXSA9IGNvbnRlbnRUeXBlID8gY29udGVudFR5cGUuc3BsaXQoJzsnKS5tYXAodG9rZW4gPT4gdG9rZW4udHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXTtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoW3R5cGUgfHwgJ211bHRpcGFydC9mb3JtLWRhdGEnLCAuLi50b2tlbnNdLmpvaW4oJzsgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCB4c3JmIGhlYWRlclxuICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cblxuICBpZiAocGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyRW52KSB7XG4gICAgd2l0aFhTUkZUb2tlbiAmJiB1dGlscy5pc0Z1bmN0aW9uKHdpdGhYU1JGVG9rZW4pICYmICh3aXRoWFNSRlRva2VuID0gd2l0aFhTUkZUb2tlbihuZXdDb25maWcpKTtcblxuICAgIGlmICh3aXRoWFNSRlRva2VuIHx8ICh3aXRoWFNSRlRva2VuICE9PSBmYWxzZSAmJiBpc1VSTFNhbWVPcmlnaW4obmV3Q29uZmlnLnVybCkpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIGNvbnN0IHhzcmZWYWx1ZSA9IHhzcmZIZWFkZXJOYW1lICYmIHhzcmZDb29raWVOYW1lICYmIGNvb2tpZXMucmVhZCh4c3JmQ29va2llTmFtZSk7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgaGVhZGVycy5zZXQoeHNyZkhlYWRlck5hbWUsIHhzcmZWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0NvbmZpZztcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENhbGN1bGF0ZSBkYXRhIG1heFJhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc2FtcGxlc0NvdW50PSAxMF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbbWluPSAxMDAwXVxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBzcGVlZG9tZXRlcihzYW1wbGVzQ291bnQsIG1pbikge1xuICBzYW1wbGVzQ291bnQgPSBzYW1wbGVzQ291bnQgfHwgMTA7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IEFycmF5KHNhbXBsZXNDb3VudCk7XG4gIGNvbnN0IHRpbWVzdGFtcHMgPSBuZXcgQXJyYXkoc2FtcGxlc0NvdW50KTtcbiAgbGV0IGhlYWQgPSAwO1xuICBsZXQgdGFpbCA9IDA7XG4gIGxldCBmaXJzdFNhbXBsZVRTO1xuXG4gIG1pbiA9IG1pbiAhPT0gdW5kZWZpbmVkID8gbWluIDogMTAwMDtcblxuICByZXR1cm4gZnVuY3Rpb24gcHVzaChjaHVua0xlbmd0aCkge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICBjb25zdCBzdGFydGVkQXQgPSB0aW1lc3RhbXBzW3RhaWxdO1xuXG4gICAgaWYgKCFmaXJzdFNhbXBsZVRTKSB7XG4gICAgICBmaXJzdFNhbXBsZVRTID0gbm93O1xuICAgIH1cblxuICAgIGJ5dGVzW2hlYWRdID0gY2h1bmtMZW5ndGg7XG4gICAgdGltZXN0YW1wc1toZWFkXSA9IG5vdztcblxuICAgIGxldCBpID0gdGFpbDtcbiAgICBsZXQgYnl0ZXNDb3VudCA9IDA7XG5cbiAgICB3aGlsZSAoaSAhPT0gaGVhZCkge1xuICAgICAgYnl0ZXNDb3VudCArPSBieXRlc1tpKytdO1xuICAgICAgaSA9IGkgJSBzYW1wbGVzQ291bnQ7XG4gICAgfVxuXG4gICAgaGVhZCA9IChoZWFkICsgMSkgJSBzYW1wbGVzQ291bnQ7XG5cbiAgICBpZiAoaGVhZCA9PT0gdGFpbCkge1xuICAgICAgdGFpbCA9ICh0YWlsICsgMSkgJSBzYW1wbGVzQ291bnQ7XG4gICAgfVxuXG4gICAgaWYgKG5vdyAtIGZpcnN0U2FtcGxlVFMgPCBtaW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXNzZWQgPSBzdGFydGVkQXQgJiYgbm93IC0gc3RhcnRlZEF0O1xuXG4gICAgcmV0dXJuIHBhc3NlZCA/IE1hdGgucm91bmQoYnl0ZXNDb3VudCAqIDEwMDAgLyBwYXNzZWQpIDogdW5kZWZpbmVkO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzcGVlZG9tZXRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVGhyb3R0bGUgZGVjb3JhdG9yXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOdW1iZXJ9IGZyZXFcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmbiwgZnJlcSkge1xuICBsZXQgdGltZXN0YW1wID0gMDtcbiAgY29uc3QgdGhyZXNob2xkID0gMTAwMCAvIGZyZXE7XG4gIGxldCB0aW1lciA9IG51bGw7XG4gIHJldHVybiBmdW5jdGlvbiB0aHJvdHRsZWQoKSB7XG4gICAgY29uc3QgZm9yY2UgPSB0aGlzID09PSB0cnVlO1xuXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAoZm9yY2UgfHwgbm93IC0gdGltZXN0YW1wID4gdGhyZXNob2xkKSB7XG4gICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgdGltZXN0YW1wID0gbm93O1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGlmICghdGltZXIpIHtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICB9LCB0aHJlc2hvbGQgLSAobm93IC0gdGltZXN0YW1wKSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB0aHJvdHRsZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG4vLyB0ZW1wb3JhcnkgaG90Zml4IHRvIGF2b2lkIGNpcmN1bGFyIHJlZmVyZW5jZXMgdW50aWwgQXhpb3NVUkxTZWFyY2hQYXJhbXMgaXMgcmVmYWN0b3JlZFxuaW1wb3J0IFBsYXRmb3JtRm9ybURhdGEgZnJvbSAnLi4vcGxhdGZvcm0vbm9kZS9jbGFzc2VzL0Zvcm1EYXRhLmpzJztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBnaXZlbiB0aGluZyBpcyBhIGFycmF5IG9yIGpzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhpbmcgLSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGJlIHZpc2l0ZWQuXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVmlzaXRhYmxlKHRoaW5nKSB7XG4gIHJldHVybiB1dGlscy5pc1BsYWluT2JqZWN0KHRoaW5nKSB8fCB1dGlscy5pc0FycmF5KHRoaW5nKTtcbn1cblxuLyoqXG4gKiBJdCByZW1vdmVzIHRoZSBicmFja2V0cyBmcm9tIHRoZSBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSBvZiB0aGUgcGFyYW1ldGVyLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBrZXkgd2l0aG91dCB0aGUgYnJhY2tldHMuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUJyYWNrZXRzKGtleSkge1xuICByZXR1cm4gdXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSA/IGtleS5zbGljZSgwLCAtMikgOiBrZXk7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBwYXRoLCBhIGtleSwgYW5kIGEgYm9vbGVhbiwgYW5kIHJldHVybnMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBjdXJyZW50IGtleS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBjdXJyZW50IG9iamVjdCBiZWluZyBpdGVyYXRlZCBvdmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGRvdHMgLSBJZiB0cnVlLCB0aGUga2V5IHdpbGwgYmUgcmVuZGVyZWQgd2l0aCBkb3RzIGluc3RlYWQgb2YgYnJhY2tldHMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHBhdGggdG8gdGhlIGN1cnJlbnQga2V5LlxuICovXG5mdW5jdGlvbiByZW5kZXJLZXkocGF0aCwga2V5LCBkb3RzKSB7XG4gIGlmICghcGF0aCkgcmV0dXJuIGtleTtcbiAgcmV0dXJuIHBhdGguY29uY2F0KGtleSkubWFwKGZ1bmN0aW9uIGVhY2godG9rZW4sIGkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICB0b2tlbiA9IHJlbW92ZUJyYWNrZXRzKHRva2VuKTtcbiAgICByZXR1cm4gIWRvdHMgJiYgaSA/ICdbJyArIHRva2VuICsgJ10nIDogdG9rZW47XG4gIH0pLmpvaW4oZG90cyA/ICcuJyA6ICcnKTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgYXJyYXkgaXMgYW4gYXJyYXkgYW5kIG5vbmUgb2YgaXRzIGVsZW1lbnRzIGFyZSB2aXNpdGFibGUsIHRoZW4gaXQncyBhIGZsYXQgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheTxhbnk+fSBhcnIgLSBUaGUgYXJyYXkgdG8gY2hlY2tcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGbGF0QXJyYXkoYXJyKSB7XG4gIHJldHVybiB1dGlscy5pc0FycmF5KGFycikgJiYgIWFyci5zb21lKGlzVmlzaXRhYmxlKTtcbn1cblxuY29uc3QgcHJlZGljYXRlcyA9IHV0aWxzLnRvRmxhdE9iamVjdCh1dGlscywge30sIG51bGwsIGZ1bmN0aW9uIGZpbHRlcihwcm9wKSB7XG4gIHJldHVybiAvXmlzW0EtWl0vLnRlc3QocHJvcCk7XG59KTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgZGF0YSBvYmplY3QgdG8gRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0gez9PYmplY3R9IFtmb3JtRGF0YV1cbiAqIEBwYXJhbSB7P09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy52aXNpdG9yXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5tZXRhVG9rZW5zID0gdHJ1ZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZG90cyA9IGZhbHNlXVxuICogQHBhcmFtIHs/Qm9vbGVhbn0gW29wdGlvbnMuaW5kZXhlcyA9IGZhbHNlXVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiovXG5cbi8qKlxuICogSXQgY29udmVydHMgYW4gb2JqZWN0IGludG8gYSBGb3JtRGF0YSBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdDxhbnksIGFueT59IG9iaiAtIFRoZSBvYmplY3QgdG8gY29udmVydCB0byBmb3JtIGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybURhdGEgLSBUaGUgRm9ybURhdGEgb2JqZWN0IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7T2JqZWN0PHN0cmluZywgYW55Pn0gb3B0aW9uc1xuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHRvRm9ybURhdGEob2JqLCBmb3JtRGF0YSwgb3B0aW9ucykge1xuICBpZiAoIXV0aWxzLmlzT2JqZWN0KG9iaikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBmb3JtRGF0YSA9IGZvcm1EYXRhIHx8IG5ldyAoUGxhdGZvcm1Gb3JtRGF0YSB8fCBGb3JtRGF0YSkoKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgb3B0aW9ucyA9IHV0aWxzLnRvRmxhdE9iamVjdChvcHRpb25zLCB7XG4gICAgbWV0YVRva2VuczogdHJ1ZSxcbiAgICBkb3RzOiBmYWxzZSxcbiAgICBpbmRleGVzOiBmYWxzZVxuICB9LCBmYWxzZSwgZnVuY3Rpb24gZGVmaW5lZChvcHRpb24sIHNvdXJjZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuICAgIHJldHVybiAhdXRpbHMuaXNVbmRlZmluZWQoc291cmNlW29wdGlvbl0pO1xuICB9KTtcblxuICBjb25zdCBtZXRhVG9rZW5zID0gb3B0aW9ucy5tZXRhVG9rZW5zO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgY29uc3QgdmlzaXRvciA9IG9wdGlvbnMudmlzaXRvciB8fCBkZWZhdWx0VmlzaXRvcjtcbiAgY29uc3QgZG90cyA9IG9wdGlvbnMuZG90cztcbiAgY29uc3QgaW5kZXhlcyA9IG9wdGlvbnMuaW5kZXhlcztcbiAgY29uc3QgX0Jsb2IgPSBvcHRpb25zLkJsb2IgfHwgdHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIEJsb2I7XG4gIGNvbnN0IHVzZUJsb2IgPSBfQmxvYiAmJiB1dGlscy5pc1NwZWNDb21wbGlhbnRGb3JtKGZvcm1EYXRhKTtcblxuICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24odmlzaXRvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2aXNpdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgZnVuY3Rpb24gY29udmVydFZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSByZXR1cm4gJyc7XG5cbiAgICBpZiAodXRpbHMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKCF1c2VCbG9iICYmIHV0aWxzLmlzQmxvYih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdCbG9iIGlzIG5vdCBzdXBwb3J0ZWQuIFVzZSBhIEJ1ZmZlciBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKHZhbHVlKSB8fCB1dGlscy5pc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdXNlQmxvYiAmJiB0eXBlb2YgQmxvYiA9PT0gJ2Z1bmN0aW9uJyA/IG5ldyBCbG9iKFt2YWx1ZV0pIDogQnVmZmVyLmZyb20odmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHZpc2l0b3IuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBrZXlcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmd8TnVtYmVyPn0gcGF0aFxuICAgKiBAdGhpcyB7Rm9ybURhdGF9XG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB0byB2aXNpdCB0aGUgZWFjaCBwcm9wIG9mIHRoZSB2YWx1ZSByZWN1cnNpdmVseVxuICAgKi9cbiAgZnVuY3Rpb24gZGVmYXVsdFZpc2l0b3IodmFsdWUsIGtleSwgcGF0aCkge1xuICAgIGxldCBhcnIgPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSAmJiAhcGF0aCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAodXRpbHMuZW5kc1dpdGgoa2V5LCAne30nKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAga2V5ID0gbWV0YVRva2VucyA/IGtleSA6IGtleS5zbGljZSgwLCAtMik7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICh1dGlscy5pc0FycmF5KHZhbHVlKSAmJiBpc0ZsYXRBcnJheSh2YWx1ZSkpIHx8XG4gICAgICAgICgodXRpbHMuaXNGaWxlTGlzdCh2YWx1ZSkgfHwgdXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSkgJiYgKGFyciA9IHV0aWxzLnRvQXJyYXkodmFsdWUpKVxuICAgICAgICApKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICBrZXkgPSByZW1vdmVCcmFja2V0cyhrZXkpO1xuXG4gICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIGVhY2goZWwsIGluZGV4KSB7XG4gICAgICAgICAgISh1dGlscy5pc1VuZGVmaW5lZChlbCkgfHwgZWwgPT09IG51bGwpICYmIGZvcm1EYXRhLmFwcGVuZChcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxuICAgICAgICAgICAgaW5kZXhlcyA9PT0gdHJ1ZSA/IHJlbmRlcktleShba2V5XSwgaW5kZXgsIGRvdHMpIDogKGluZGV4ZXMgPT09IG51bGwgPyBrZXkgOiBrZXkgKyAnW10nKSxcbiAgICAgICAgICAgIGNvbnZlcnRWYWx1ZShlbClcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1Zpc2l0YWJsZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvcm1EYXRhLmFwcGVuZChyZW5kZXJLZXkocGF0aCwga2V5LCBkb3RzKSwgY29udmVydFZhbHVlKHZhbHVlKSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFjayA9IFtdO1xuXG4gIGNvbnN0IGV4cG9zZWRIZWxwZXJzID0gT2JqZWN0LmFzc2lnbihwcmVkaWNhdGVzLCB7XG4gICAgZGVmYXVsdFZpc2l0b3IsXG4gICAgY29udmVydFZhbHVlLFxuICAgIGlzVmlzaXRhYmxlXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGJ1aWxkKHZhbHVlLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxzLmlzVW5kZWZpbmVkKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgaWYgKHN0YWNrLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCBpbiAnICsgcGF0aC5qb2luKCcuJykpO1xuICAgIH1cblxuICAgIHN0YWNrLnB1c2godmFsdWUpO1xuXG4gICAgdXRpbHMuZm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24gZWFjaChlbCwga2V5KSB7XG4gICAgICBjb25zdCByZXN1bHQgPSAhKHV0aWxzLmlzVW5kZWZpbmVkKGVsKSB8fCBlbCA9PT0gbnVsbCkgJiYgdmlzaXRvci5jYWxsKFxuICAgICAgICBmb3JtRGF0YSwgZWwsIHV0aWxzLmlzU3RyaW5nKGtleSkgPyBrZXkudHJpbSgpIDoga2V5LCBwYXRoLCBleHBvc2VkSGVscGVyc1xuICAgICAgKTtcblxuICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICBidWlsZChlbCwgcGF0aCA/IHBhdGguY29uY2F0KGtleSkgOiBba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2RhdGEgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIGJ1aWxkKG9iaik7XG5cbiAgcmV0dXJuIGZvcm1EYXRhO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b0Zvcm1EYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvVVJMRW5jb2RlZEZvcm0oZGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gdG9Gb3JtRGF0YShkYXRhLCBuZXcgcGxhdGZvcm0uY2xhc3Nlcy5VUkxTZWFyY2hQYXJhbXMoKSwgT2JqZWN0LmFzc2lnbih7XG4gICAgdmlzaXRvcjogZnVuY3Rpb24odmFsdWUsIGtleSwgcGF0aCwgaGVscGVycykge1xuICAgICAgaWYgKHBsYXRmb3JtLmlzTm9kZSAmJiB1dGlscy5pc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygnYmFzZTY0JykpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoZWxwZXJzLmRlZmF1bHRWaXNpdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LCBvcHRpb25zKSk7XG59XG4iLCJcblxuZXhwb3J0IGNvbnN0IHN0cmVhbUNodW5rID0gZnVuY3Rpb24qIChjaHVuaywgY2h1bmtTaXplKSB7XG4gIGxldCBsZW4gPSBjaHVuay5ieXRlTGVuZ3RoO1xuXG4gIGlmICghY2h1bmtTaXplIHx8IGxlbiA8IGNodW5rU2l6ZSkge1xuICAgIHlpZWxkIGNodW5rO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBwb3MgPSAwO1xuICBsZXQgZW5kO1xuXG4gIHdoaWxlIChwb3MgPCBsZW4pIHtcbiAgICBlbmQgPSBwb3MgKyBjaHVua1NpemU7XG4gICAgeWllbGQgY2h1bmsuc2xpY2UocG9zLCBlbmQpO1xuICAgIHBvcyA9IGVuZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmVhZEJ5dGVzID0gYXN5bmMgZnVuY3Rpb24qIChpdGVyYWJsZSwgY2h1bmtTaXplLCBlbmNvZGUpIHtcbiAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiBpdGVyYWJsZSkge1xuICAgIHlpZWxkKiBzdHJlYW1DaHVuayhBcnJheUJ1ZmZlci5pc1ZpZXcoY2h1bmspID8gY2h1bmsgOiAoYXdhaXQgZW5jb2RlKFN0cmluZyhjaHVuaykpKSwgY2h1bmtTaXplKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdHJhY2tTdHJlYW0gPSAoc3RyZWFtLCBjaHVua1NpemUsIG9uUHJvZ3Jlc3MsIG9uRmluaXNoLCBlbmNvZGUpID0+IHtcbiAgY29uc3QgaXRlcmF0b3IgPSByZWFkQnl0ZXMoc3RyZWFtLCBjaHVua1NpemUsIGVuY29kZSk7XG5cbiAgbGV0IGJ5dGVzID0gMDtcblxuICByZXR1cm4gbmV3IFJlYWRhYmxlU3RyZWFtKHtcbiAgICB0eXBlOiAnYnl0ZXMnLFxuXG4gICAgYXN5bmMgcHVsbChjb250cm9sbGVyKSB7XG4gICAgICBjb25zdCB7ZG9uZSwgdmFsdWV9ID0gYXdhaXQgaXRlcmF0b3IubmV4dCgpO1xuXG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgICAgIG9uRmluaXNoKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGxlbiA9IHZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICBvblByb2dyZXNzICYmIG9uUHJvZ3Jlc3MoYnl0ZXMgKz0gbGVuKTtcbiAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShuZXcgVWludDhBcnJheSh2YWx1ZSkpO1xuICAgIH0sXG4gICAgY2FuY2VsKHJlYXNvbikge1xuICAgICAgb25GaW5pc2gocmVhc29uKTtcbiAgICAgIHJldHVybiBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICB9XG4gIH0sIHtcbiAgICBoaWdoV2F0ZXJNYXJrOiAyXG4gIH0pXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7VkVSU0lPTn0gZnJvbSAnLi4vZW52L2RhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcblxuY29uc3QgdmFsaWRhdG9ycyA9IHt9O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuWydvYmplY3QnLCAnYm9vbGVhbicsICdudW1iZXInLCAnZnVuY3Rpb24nLCAnc3RyaW5nJywgJ3N5bWJvbCddLmZvckVhY2goKHR5cGUsIGkpID0+IHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbmNvbnN0IGRlcHJlY2F0ZWRXYXJuaW5ncyA9IHt9O1xuXG4vKipcbiAqIFRyYW5zaXRpb25hbCBvcHRpb24gdmFsaWRhdG9yXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yIC0gc2V0IHRvIGZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uYWwgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvbiAtIGRlcHJlY2F0ZWQgdmVyc2lvbiAvIHJlbW92ZWQgc2luY2UgdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIC0gc29tZSBtZXNzYWdlIHdpdGggYWRkaXRpb25hbCBpbmZvXG4gKlxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuICh2YWx1ZSwgb3B0LCBvcHRzKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKG9wdCwgJyBoYXMgYmVlbiByZW1vdmVkJyArICh2ZXJzaW9uID8gJyBpbiAnICsgdmVyc2lvbiA6ICcnKSksXG4gICAgICAgIEF4aW9zRXJyb3IuRVJSX0RFUFJFQ0FURURcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBhbGxvd1Vua25vd25cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0JywgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTl9WQUxVRSk7XG4gIH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGNvbnN0IG9wdCA9IGtleXNbaV07XG4gICAgY29uc3QgdmFsaWRhdG9yID0gc2NoZW1hW29wdF07XG4gICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhc3NlcnRPcHRpb25zLFxuICB2YWxpZGF0b3JzXG59O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyA/IEJsb2IgOiBudWxsXG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcgPyBGb3JtRGF0YSA6IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc1VSTFNlYXJjaFBhcmFtcyBmcm9tICcuLi8uLi8uLi9oZWxwZXJzL0F4aW9zVVJMU2VhcmNoUGFyYW1zLmpzJztcbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnID8gVVJMU2VhcmNoUGFyYW1zIDogQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCJpbXBvcnQgVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4vY2xhc3Nlcy9VUkxTZWFyY2hQYXJhbXMuanMnXG5pbXBvcnQgRm9ybURhdGEgZnJvbSAnLi9jbGFzc2VzL0Zvcm1EYXRhLmpzJ1xuaW1wb3J0IEJsb2IgZnJvbSAnLi9jbGFzc2VzL0Jsb2IuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNCcm93c2VyOiB0cnVlLFxuICBjbGFzc2VzOiB7XG4gICAgVVJMU2VhcmNoUGFyYW1zLFxuICAgIEZvcm1EYXRhLFxuICAgIEJsb2JcbiAgfSxcbiAgcHJvdG9jb2xzOiBbJ2h0dHAnLCAnaHR0cHMnLCAnZmlsZScsICdibG9iJywgJ3VybCcsICdkYXRhJ11cbn07XG4iLCJjb25zdCBoYXNCcm93c2VyRW52ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGhhc1N0YW5kYXJkQnJvd3NlckVudiA9IChcbiAgKHByb2R1Y3QpID0+IHtcbiAgICByZXR1cm4gaGFzQnJvd3NlckVudiAmJiBbJ1JlYWN0TmF0aXZlJywgJ05hdGl2ZVNjcmlwdCcsICdOUyddLmluZGV4T2YocHJvZHVjdCkgPCAwXG4gIH0pKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5wcm9kdWN0KTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgd2ViV29ya2VyIGVudmlyb25tZW50XG4gKlxuICogQWx0aG91Z2ggdGhlIGBpc1N0YW5kYXJkQnJvd3NlckVudmAgbWV0aG9kIGluZGljYXRlcyB0aGF0XG4gKiBgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXJgLCB0aGUgV2ViV29ya2VyIHdpbGwgc3RpbGwgYmVcbiAqIGZpbHRlcmVkIG91dCBkdWUgdG8gaXRzIGp1ZGdtZW50IHN0YW5kYXJkXG4gKiBgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ2AuXG4gKiBUaGlzIGxlYWRzIHRvIGEgcHJvYmxlbSB3aGVuIGF4aW9zIHBvc3QgYEZvcm1EYXRhYCBpbiB3ZWJXb3JrZXJcbiAqL1xuY29uc3QgaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52ID0gKCgpID0+IHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlICYmXG4gICAgdHlwZW9mIHNlbGYuaW1wb3J0U2NyaXB0cyA9PT0gJ2Z1bmN0aW9uJ1xuICApO1xufSkoKTtcblxuY29uc3Qgb3JpZ2luID0gaGFzQnJvd3NlckVudiAmJiB3aW5kb3cubG9jYXRpb24uaHJlZiB8fCAnaHR0cDovL2xvY2FsaG9zdCc7XG5cbmV4cG9ydCB7XG4gIGhhc0Jyb3dzZXJFbnYsXG4gIGhhc1N0YW5kYXJkQnJvd3NlcldlYldvcmtlckVudixcbiAgaGFzU3RhbmRhcmRCcm93c2VyRW52LFxuICBvcmlnaW5cbn1cbiIsImltcG9ydCBwbGF0Zm9ybSBmcm9tICcuL25vZGUvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC4uLnV0aWxzLFxuICAuLi5wbGF0Zm9ybVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgYmluZCBmcm9tICcuL2hlbHBlcnMvYmluZC5qcyc7XG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbmNvbnN0IHt0b1N0cmluZ30gPSBPYmplY3QucHJvdG90eXBlO1xuY29uc3Qge2dldFByb3RvdHlwZU9mfSA9IE9iamVjdDtcblxuY29uc3Qga2luZE9mID0gKGNhY2hlID0+IHRoaW5nID0+IHtcbiAgICBjb25zdCBzdHIgPSB0b1N0cmluZy5jYWxsKHRoaW5nKTtcbiAgICByZXR1cm4gY2FjaGVbc3RyXSB8fCAoY2FjaGVbc3RyXSA9IHN0ci5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSk7XG59KShPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuY29uc3Qga2luZE9mVGVzdCA9ICh0eXBlKSA9PiB7XG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAodGhpbmcpID0+IGtpbmRPZih0aGluZykgPT09IHR5cGVcbn1cblxuY29uc3QgdHlwZU9mVGVzdCA9IHR5cGUgPT4gdGhpbmcgPT4gdHlwZW9mIHRoaW5nID09PSB0eXBlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3Qge2lzQXJyYXl9ID0gQXJyYXk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNVbmRlZmluZWQgPSB0eXBlT2ZUZXN0KCd1bmRlZmluZWQnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiBpc0Z1bmN0aW9uKHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcikgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNBcnJheUJ1ZmZlciA9IGtpbmRPZlRlc3QoJ0FycmF5QnVmZmVyJyk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICBsZXQgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmIChpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzU3RyaW5nID0gdHlwZU9mVGVzdCgnc3RyaW5nJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNGdW5jdGlvbiA9IHR5cGVPZlRlc3QoJ2Z1bmN0aW9uJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNOdW1iZXIgPSB0eXBlT2ZUZXN0KCdudW1iZXInKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNPYmplY3QgPSAodGhpbmcpID0+IHRoaW5nICE9PSBudWxsICYmIHR5cGVvZiB0aGluZyA9PT0gJ29iamVjdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCb29sZWFuXG4gKlxuICogQHBhcmFtIHsqfSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCb29sZWFuLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNCb29sZWFuID0gdGhpbmcgPT4gdGhpbmcgPT09IHRydWUgfHwgdGhpbmcgPT09IGZhbHNlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB7XG4gIGlmIChraW5kT2YodmFsKSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gKHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSkgPT09IG51bGwpICYmICEoU3ltYm9sLnRvU3RyaW5nVGFnIGluIHZhbCkgJiYgIShTeW1ib2wuaXRlcmF0b3IgaW4gdmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRGF0ZSA9IGtpbmRPZlRlc3QoJ0RhdGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRmlsZSA9IGtpbmRPZlRlc3QoJ0ZpbGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQmxvYiA9IGtpbmRPZlRlc3QoJ0Jsb2InKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVMaXN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0ZpbGVMaXN0ID0ga2luZE9mVGVzdCgnRmlsZUxpc3QnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1N0cmVhbSA9ICh2YWwpID0+IGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7Kn0gdGhpbmcgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRm9ybURhdGEgPSAodGhpbmcpID0+IHtcbiAgbGV0IGtpbmQ7XG4gIHJldHVybiB0aGluZyAmJiAoXG4gICAgKHR5cGVvZiBGb3JtRGF0YSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGluZyBpbnN0YW5jZW9mIEZvcm1EYXRhKSB8fCAoXG4gICAgICBpc0Z1bmN0aW9uKHRoaW5nLmFwcGVuZCkgJiYgKFxuICAgICAgICAoa2luZCA9IGtpbmRPZih0aGluZykpID09PSAnZm9ybWRhdGEnIHx8XG4gICAgICAgIC8vIGRldGVjdCBmb3JtLWRhdGEgaW5zdGFuY2VcbiAgICAgICAgKGtpbmQgPT09ICdvYmplY3QnICYmIGlzRnVuY3Rpb24odGhpbmcudG9TdHJpbmcpICYmIHRoaW5nLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEZvcm1EYXRhXScpXG4gICAgICApXG4gICAgKVxuICApXG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1VSTFNlYXJjaFBhcmFtcyA9IGtpbmRPZlRlc3QoJ1VSTFNlYXJjaFBhcmFtcycpO1xuXG5jb25zdCBbaXNSZWFkYWJsZVN0cmVhbSwgaXNSZXF1ZXN0LCBpc1Jlc3BvbnNlLCBpc0hlYWRlcnNdID0gWydSZWFkYWJsZVN0cmVhbScsICdSZXF1ZXN0JywgJ1Jlc3BvbnNlJywgJ0hlYWRlcnMnXS5tYXAoa2luZE9mVGVzdCk7XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmNvbnN0IHRyaW0gPSAoc3RyKSA9PiBzdHIudHJpbSA/XG4gIHN0ci50cmltKCkgOiBzdHIucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FsbE93bktleXMgPSBmYWxzZV1cbiAqIEByZXR1cm5zIHthbnl9XG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbiwge2FsbE93bktleXMgPSBmYWxzZX0gPSB7fSkge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBpO1xuICBsZXQgbDtcblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAoaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgY29uc3Qga2V5cyA9IGFsbE93bktleXMgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopIDogT2JqZWN0LmtleXMob2JqKTtcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBsZXQga2V5O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kS2V5KG9iaiwga2V5KSB7XG4gIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgbGV0IF9rZXk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgX2tleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSA9PT0gX2tleS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gX2tleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IF9nbG9iYWwgPSAoKCkgPT4ge1xuICAvKmVzbGludCBuby11bmRlZjowKi9cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZ2xvYmFsVGhpcztcbiAgcmV0dXJuIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbClcbn0pKCk7XG5cbmNvbnN0IGlzQ29udGV4dERlZmluZWQgPSAoY29udGV4dCkgPT4gIWlzVW5kZWZpbmVkKGNvbnRleHQpICYmIGNvbnRleHQgIT09IF9nbG9iYWw7XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgY29uc3Qge2Nhc2VsZXNzfSA9IGlzQ29udGV4dERlZmluZWQodGhpcykgJiYgdGhpcyB8fCB7fTtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGFzc2lnblZhbHVlID0gKHZhbCwga2V5KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0S2V5ID0gY2FzZWxlc3MgJiYgZmluZEtleShyZXN1bHQsIGtleSkgfHwga2V5O1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFt0YXJnZXRLZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2UocmVzdWx0W3RhcmdldEtleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGFyZ3VtZW50c1tpXSAmJiBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFthbGxPd25LZXlzXVxuICogQHJldHVybnMge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5jb25zdCBleHRlbmQgPSAoYSwgYiwgdGhpc0FyZywge2FsbE93bktleXN9PSB7fSkgPT4ge1xuICBmb3JFYWNoKGIsICh2YWwsIGtleSkgPT4ge1xuICAgIGlmICh0aGlzQXJnICYmIGlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9LCB7YWxsT3duS2V5c30pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuY29uc3Qgc3RyaXBCT00gPSAoY29udGVudCkgPT4ge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gW3Byb3BzXVxuICogQHBhcmFtIHtvYmplY3R9IFtkZXNjcmlwdG9yc11cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuY29uc3QgaW5oZXJpdHMgPSAoY29uc3RydWN0b3IsIHN1cGVyQ29uc3RydWN0b3IsIHByb3BzLCBkZXNjcmlwdG9ycykgPT4ge1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlLCBkZXNjcmlwdG9ycyk7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IsICdzdXBlcicsIHtcbiAgICB2YWx1ZTogc3VwZXJDb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgfSk7XG4gIHByb3BzICYmIE9iamVjdC5hc3NpZ24oY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wcyk7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBvYmplY3Qgd2l0aCBkZWVwIHByb3RvdHlwZSBjaGFpbiB0byBhIGZsYXQgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlT2JqIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGVzdE9ial1cbiAqIEBwYXJhbSB7RnVuY3Rpb258Qm9vbGVhbn0gW2ZpbHRlcl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9wRmlsdGVyXVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IHRvRmxhdE9iamVjdCA9IChzb3VyY2VPYmosIGRlc3RPYmosIGZpbHRlciwgcHJvcEZpbHRlcikgPT4ge1xuICBsZXQgcHJvcHM7XG4gIGxldCBpO1xuICBsZXQgcHJvcDtcbiAgY29uc3QgbWVyZ2VkID0ge307XG5cbiAgZGVzdE9iaiA9IGRlc3RPYmogfHwge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuICBpZiAoc291cmNlT2JqID09IG51bGwpIHJldHVybiBkZXN0T2JqO1xuXG4gIGRvIHtcbiAgICBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZU9iaik7XG4gICAgaSA9IHByb3BzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgaWYgKCghcHJvcEZpbHRlciB8fCBwcm9wRmlsdGVyKHByb3AsIHNvdXJjZU9iaiwgZGVzdE9iaikpICYmICFtZXJnZWRbcHJvcF0pIHtcbiAgICAgICAgZGVzdE9ialtwcm9wXSA9IHNvdXJjZU9ialtwcm9wXTtcbiAgICAgICAgbWVyZ2VkW3Byb3BdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlT2JqID0gZmlsdGVyICE9PSBmYWxzZSAmJiBnZXRQcm90b3R5cGVPZihzb3VyY2VPYmopO1xuICB9IHdoaWxlIChzb3VyY2VPYmogJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKHNvdXJjZU9iaiwgZGVzdE9iaikpICYmIHNvdXJjZU9iaiAhPT0gT2JqZWN0LnByb3RvdHlwZSk7XG5cbiAgcmV0dXJuIGRlc3RPYmo7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc3RyaW5nIGVuZHMgd2l0aCB0aGUgY2hhcmFjdGVycyBvZiBhIHNwZWNpZmllZCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gW3Bvc2l0aW9uPSAwXVxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBlbmRzV2l0aCA9IChzdHIsIHNlYXJjaFN0cmluZywgcG9zaXRpb24pID0+IHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkIHx8IHBvc2l0aW9uID4gc3RyLmxlbmd0aCkge1xuICAgIHBvc2l0aW9uID0gc3RyLmxlbmd0aDtcbiAgfVxuICBwb3NpdGlvbiAtPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICBjb25zdCBsYXN0SW5kZXggPSBzdHIuaW5kZXhPZihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKTtcbiAgcmV0dXJuIGxhc3RJbmRleCAhPT0gLTEgJiYgbGFzdEluZGV4ID09PSBwb3NpdGlvbjtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgbmV3IGFycmF5IGZyb20gYXJyYXkgbGlrZSBvYmplY3Qgb3IgbnVsbCBpZiBmYWlsZWRcbiAqXG4gKiBAcGFyYW0geyp9IFt0aGluZ11cbiAqXG4gKiBAcmV0dXJucyB7P0FycmF5fVxuICovXG5jb25zdCB0b0FycmF5ID0gKHRoaW5nKSA9PiB7XG4gIGlmICghdGhpbmcpIHJldHVybiBudWxsO1xuICBpZiAoaXNBcnJheSh0aGluZykpIHJldHVybiB0aGluZztcbiAgbGV0IGkgPSB0aGluZy5sZW5ndGg7XG4gIGlmICghaXNOdW1iZXIoaSkpIHJldHVybiBudWxsO1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkoaSk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgYXJyW2ldID0gdGhpbmdbaV07XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuLyoqXG4gKiBDaGVja2luZyBpZiB0aGUgVWludDhBcnJheSBleGlzdHMgYW5kIGlmIGl0IGRvZXMsIGl0IHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGVcbiAqIHRoaW5nIHBhc3NlZCBpbiBpcyBhbiBpbnN0YW5jZSBvZiBVaW50OEFycmF5XG4gKlxuICogQHBhcmFtIHtUeXBlZEFycmF5fVxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbmNvbnN0IGlzVHlwZWRBcnJheSA9IChUeXBlZEFycmF5ID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIHRoaW5nID0+IHtcbiAgICByZXR1cm4gVHlwZWRBcnJheSAmJiB0aGluZyBpbnN0YW5jZW9mIFR5cGVkQXJyYXk7XG4gIH07XG59KSh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2V0UHJvdG90eXBlT2YoVWludDhBcnJheSkpO1xuXG4vKipcbiAqIEZvciBlYWNoIGVudHJ5IGluIHRoZSBvYmplY3QsIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGtleSBhbmQgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3Q8YW55LCBhbnk+fSBvYmogLSBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZW50cnkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmNvbnN0IGZvckVhY2hFbnRyeSA9IChvYmosIGZuKSA9PiB7XG4gIGNvbnN0IGdlbmVyYXRvciA9IG9iaiAmJiBvYmpbU3ltYm9sLml0ZXJhdG9yXTtcblxuICBjb25zdCBpdGVyYXRvciA9IGdlbmVyYXRvci5jYWxsKG9iaik7XG5cbiAgbGV0IHJlc3VsdDtcblxuICB3aGlsZSAoKHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKSkgJiYgIXJlc3VsdC5kb25lKSB7XG4gICAgY29uc3QgcGFpciA9IHJlc3VsdC52YWx1ZTtcbiAgICBmbi5jYWxsKG9iaiwgcGFpclswXSwgcGFpclsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhbmQgYSBzdHJpbmcsIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgbWF0Y2hlc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdFeHAgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGFnYWluc3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzZWFyY2guXG4gKlxuICogQHJldHVybnMge0FycmF5PGJvb2xlYW4+fVxuICovXG5jb25zdCBtYXRjaEFsbCA9IChyZWdFeHAsIHN0cikgPT4ge1xuICBsZXQgbWF0Y2hlcztcbiAgY29uc3QgYXJyID0gW107XG5cbiAgd2hpbGUgKChtYXRjaGVzID0gcmVnRXhwLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgICBhcnIucHVzaChtYXRjaGVzKTtcbiAgfVxuXG4gIHJldHVybiBhcnI7XG59XG5cbi8qIENoZWNraW5nIGlmIHRoZSBraW5kT2ZUZXN0IGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB3aGVuIHBhc3NlZCBhbiBIVE1MRm9ybUVsZW1lbnQuICovXG5jb25zdCBpc0hUTUxGb3JtID0ga2luZE9mVGVzdCgnSFRNTEZvcm1FbGVtZW50Jyk7XG5cbmNvbnN0IHRvQ2FtZWxDYXNlID0gc3RyID0+IHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX1xcc10oW2EtelxcZF0pKFxcdyopL2csXG4gICAgZnVuY3Rpb24gcmVwbGFjZXIobSwgcDEsIHAyKSB7XG4gICAgICByZXR1cm4gcDEudG9VcHBlckNhc2UoKSArIHAyO1xuICAgIH1cbiAgKTtcbn07XG5cbi8qIENyZWF0aW5nIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGNoZWNrIGlmIGFuIG9iamVjdCBoYXMgYSBwcm9wZXJ0eS4gKi9cbmNvbnN0IGhhc093blByb3BlcnR5ID0gKCh7aGFzT3duUHJvcGVydHl9KSA9PiAob2JqLCBwcm9wKSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpKE9iamVjdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNSZWdFeHAgPSBraW5kT2ZUZXN0KCdSZWdFeHAnKTtcblxuY29uc3QgcmVkdWNlRGVzY3JpcHRvcnMgPSAob2JqLCByZWR1Y2VyKSA9PiB7XG4gIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqKTtcbiAgY29uc3QgcmVkdWNlZERlc2NyaXB0b3JzID0ge307XG5cbiAgZm9yRWFjaChkZXNjcmlwdG9ycywgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICBsZXQgcmV0O1xuICAgIGlmICgocmV0ID0gcmVkdWNlcihkZXNjcmlwdG9yLCBuYW1lLCBvYmopKSAhPT0gZmFsc2UpIHtcbiAgICAgIHJlZHVjZWREZXNjcmlwdG9yc1tuYW1lXSA9IHJldCB8fCBkZXNjcmlwdG9yO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqLCByZWR1Y2VkRGVzY3JpcHRvcnMpO1xufVxuXG4vKipcbiAqIE1ha2VzIGFsbCBtZXRob2RzIHJlYWQtb25seVxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbmNvbnN0IGZyZWV6ZU1ldGhvZHMgPSAob2JqKSA9PiB7XG4gIHJlZHVjZURlc2NyaXB0b3JzKG9iaiwgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICAvLyBza2lwIHJlc3RyaWN0ZWQgcHJvcHMgaW4gc3RyaWN0IG1vZGVcbiAgICBpZiAoaXNGdW5jdGlvbihvYmopICYmIFsnYXJndW1lbnRzJywgJ2NhbGxlcicsICdjYWxsZWUnXS5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZmFsc2U7XG5cbiAgICBpZiAoJ3dyaXRhYmxlJyBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQgPSAoKSA9PiB7XG4gICAgICAgIHRocm93IEVycm9yKCdDYW4gbm90IHJld3JpdGUgcmVhZC1vbmx5IG1ldGhvZCBcXCcnICsgbmFtZSArICdcXCcnKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgdG9PYmplY3RTZXQgPSAoYXJyYXlPclN0cmluZywgZGVsaW1pdGVyKSA9PiB7XG4gIGNvbnN0IG9iaiA9IHt9O1xuXG4gIGNvbnN0IGRlZmluZSA9IChhcnIpID0+IHtcbiAgICBhcnIuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBvYmpbdmFsdWVdID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzQXJyYXkoYXJyYXlPclN0cmluZykgPyBkZWZpbmUoYXJyYXlPclN0cmluZykgOiBkZWZpbmUoU3RyaW5nKGFycmF5T3JTdHJpbmcpLnNwbGl0KGRlbGltaXRlcikpO1xuXG4gIHJldHVybiBvYmo7XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fVxuXG5jb25zdCB0b0Zpbml0ZU51bWJlciA9ICh2YWx1ZSwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSA9ICt2YWx1ZSkgPyB2YWx1ZSA6IGRlZmF1bHRWYWx1ZTtcbn1cblxuY29uc3QgQUxQSEEgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonXG5cbmNvbnN0IERJR0lUID0gJzAxMjM0NTY3ODknO1xuXG5jb25zdCBBTFBIQUJFVCA9IHtcbiAgRElHSVQsXG4gIEFMUEhBLFxuICBBTFBIQV9ESUdJVDogQUxQSEEgKyBBTFBIQS50b1VwcGVyQ2FzZSgpICsgRElHSVRcbn1cblxuY29uc3QgZ2VuZXJhdGVTdHJpbmcgPSAoc2l6ZSA9IDE2LCBhbHBoYWJldCA9IEFMUEhBQkVULkFMUEhBX0RJR0lUKSA9PiB7XG4gIGxldCBzdHIgPSAnJztcbiAgY29uc3Qge2xlbmd0aH0gPSBhbHBoYWJldDtcbiAgd2hpbGUgKHNpemUtLSkge1xuICAgIHN0ciArPSBhbHBoYWJldFtNYXRoLnJhbmRvbSgpICogbGVuZ3RofDBdXG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIElmIHRoZSB0aGluZyBpcyBhIEZvcm1EYXRhIG9iamVjdCwgcmV0dXJuIHRydWUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXG4gKlxuICogQHBhcmFtIHt1bmtub3dufSB0aGluZyAtIFRoZSB0aGluZyB0byBjaGVjay5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNTcGVjQ29tcGxpYW50Rm9ybSh0aGluZykge1xuICByZXR1cm4gISEodGhpbmcgJiYgaXNGdW5jdGlvbih0aGluZy5hcHBlbmQpICYmIHRoaW5nW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdGb3JtRGF0YScgJiYgdGhpbmdbU3ltYm9sLml0ZXJhdG9yXSk7XG59XG5cbmNvbnN0IHRvSlNPTk9iamVjdCA9IChvYmopID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgQXJyYXkoMTApO1xuXG4gIGNvbnN0IHZpc2l0ID0gKHNvdXJjZSwgaSkgPT4ge1xuXG4gICAgaWYgKGlzT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIGlmIChzdGFjay5pbmRleE9mKHNvdXJjZSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmKCEoJ3RvSlNPTicgaW4gc291cmNlKSkge1xuICAgICAgICBzdGFja1tpXSA9IHNvdXJjZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gaXNBcnJheShzb3VyY2UpID8gW10gOiB7fTtcblxuICAgICAgICBmb3JFYWNoKHNvdXJjZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCByZWR1Y2VkVmFsdWUgPSB2aXNpdCh2YWx1ZSwgaSArIDEpO1xuICAgICAgICAgICFpc1VuZGVmaW5lZChyZWR1Y2VkVmFsdWUpICYmICh0YXJnZXRba2V5XSA9IHJlZHVjZWRWYWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YWNrW2ldID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIHJldHVybiB2aXNpdChvYmosIDApO1xufVxuXG5jb25zdCBpc0FzeW5jRm4gPSBraW5kT2ZUZXN0KCdBc3luY0Z1bmN0aW9uJyk7XG5cbmNvbnN0IGlzVGhlbmFibGUgPSAodGhpbmcpID0+XG4gIHRoaW5nICYmIChpc09iamVjdCh0aGluZykgfHwgaXNGdW5jdGlvbih0aGluZykpICYmIGlzRnVuY3Rpb24odGhpbmcudGhlbikgJiYgaXNGdW5jdGlvbih0aGluZy5jYXRjaCk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXIsXG4gIGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzQm9vbGVhbixcbiAgaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3QsXG4gIGlzUmVhZGFibGVTdHJlYW0sXG4gIGlzUmVxdWVzdCxcbiAgaXNSZXNwb25zZSxcbiAgaXNIZWFkZXJzLFxuICBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlLFxuICBpc0ZpbGUsXG4gIGlzQmxvYixcbiAgaXNSZWdFeHAsXG4gIGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNUeXBlZEFycmF5LFxuICBpc0ZpbGVMaXN0LFxuICBmb3JFYWNoLFxuICBtZXJnZSxcbiAgZXh0ZW5kLFxuICB0cmltLFxuICBzdHJpcEJPTSxcbiAgaW5oZXJpdHMsXG4gIHRvRmxhdE9iamVjdCxcbiAga2luZE9mLFxuICBraW5kT2ZUZXN0LFxuICBlbmRzV2l0aCxcbiAgdG9BcnJheSxcbiAgZm9yRWFjaEVudHJ5LFxuICBtYXRjaEFsbCxcbiAgaXNIVE1MRm9ybSxcbiAgaGFzT3duUHJvcGVydHksXG4gIGhhc093blByb3A6IGhhc093blByb3BlcnR5LCAvLyBhbiBhbGlhcyB0byBhdm9pZCBFU0xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zIGRldGVjdGlvblxuICByZWR1Y2VEZXNjcmlwdG9ycyxcbiAgZnJlZXplTWV0aG9kcyxcbiAgdG9PYmplY3RTZXQsXG4gIHRvQ2FtZWxDYXNlLFxuICBub29wLFxuICB0b0Zpbml0ZU51bWJlcixcbiAgZmluZEtleSxcbiAgZ2xvYmFsOiBfZ2xvYmFsLFxuICBpc0NvbnRleHREZWZpbmVkLFxuICBBTFBIQUJFVCxcbiAgZ2VuZXJhdGVTdHJpbmcsXG4gIGlzU3BlY0NvbXBsaWFudEZvcm0sXG4gIHRvSlNPTk9iamVjdCxcbiAgaXNBc3luY0ZuLFxuICBpc1RoZW5hYmxlXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gQ29tcGlsZWQgdXNpbmcgbWFya29ANS4zMy4xNCAtIERPIE5PVCBFRElUXG5pbXBvcnQgeyB0IGFzIF90IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanNcIjtcbmNvbnN0IF9tYXJrb19jb21wb25lbnRUeXBlID0gXCJ1aVxcXFxpbmRleC5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgJy4vbWFpbl9tZW51L2luZGV4LmpzJztcbmltcG9ydCAnLi9pbml0LmpzJztcbmltcG9ydCAnLi9jb250ZW50LmpzJztcbmltcG9ydCAnLi9sb2dvdXQuanMnO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHt9O1xuX21hcmtvX3RlbXBsYXRlLl8gPSBfbWFya29fcmVuZGVyZXIoZnVuY3Rpb24gKGlucHV0LCBvdXQsIF9jb21wb25lbnREZWYsIF9jb21wb25lbnQsIHN0YXRlLCAkZ2xvYmFsKSB7fSwge1xuICB0OiBfbWFya29fY29tcG9uZW50VHlwZSxcbiAgaTogdHJ1ZSxcbiAgZDogdHJ1ZVxufSwgX21hcmtvX2NvbXBvbmVudCk7XG5pbXBvcnQgX21hcmtvX2RlZmluZUNvbXBvbmVudCBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanNcIjtcbl9tYXJrb190ZW1wbGF0ZS5Db21wb25lbnQgPSBfbWFya29fZGVmaW5lQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnQsIF9tYXJrb190ZW1wbGF0ZS5fKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=