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

/***/ "./ui/marko/test_file.marko":
/*!**********************************!*\
  !*** ./ui/marko/test_file.marko ***!
  \**********************************/
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

const _marko_componentType = "ui\\marko\\test_file.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);


(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_2__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {
  onCreate() {
    this.state = {
      arr: ["uno", "due", "tre"]
    };
  }
};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_1___default()(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", null, "0", _component, null, 0);
  {
    let _keyValue = 0;
    for (const numero of state.arr || []) {
      const _keyScope = `[${_keyValue++}]`;
      out.be("p", null, "1" + _keyScope, _component, null, 0);
      out.t(numero, _component);
      out.ee();
    }
  }
  out.ee();
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_3___default()(_marko_component, _marko_template._);

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

/***/ "./ui/testui.js":
/*!**********************!*\
  !*** ./ui/testui.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _marko_test_file_marko__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./marko/test_file.marko */ "./ui/marko/test_file.marko");

const output = document.getElementById("output");

let T = {};

T.Execute = function() {
  switch(Store.state.action) {
    case Action.CUSTOMACTION:
      T.render = _marko_test_file_marko__WEBPACK_IMPORTED_MODULE_0__["default"].renderSync().replaceChildrenOf(output);
      break;
  }
}

Store.Bind(T.Execute);

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
/* harmony import */ var _testui_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./testui.js */ "./ui/testui.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! marko/src/runtime/components/renderer.js */ "./node_modules/marko/src/runtime/components/renderer.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! marko/src/runtime/components/registry.js */ "./node_modules/marko/src/runtime/components/registry.js");
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! marko/src/runtime/components/defineComponent.js */ "./node_modules/marko/src/runtime/components/defineComponent.js");
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4__);
// Compiled using marko@5.33.14 - DO NOT EDIT

const _marko_componentType = "ui\\index.marko",
  _marko_template = (0,marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__.t)(_marko_componentType);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_marko_template);



(0,marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__.r)(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2___default()(function (input, out, _componentDef, _component, state, $global) {}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);

_marko_template.Component = marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4___default()(_marko_component, _marko_template._);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTs7QUFFYixrQkFBa0IsbUJBQU8sQ0FBQyxtRkFBb0I7QUFDOUMsNENBQTRDLGFBQW9CO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGlCQUFpQixxQkFBcUI7QUFDMUQ7O0FBRUE7QUFDQSxJQUFJLEtBQTZCO0FBQ2pDO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsdUNBQXVDLGlCQUFpQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5Qjs7Ozs7Ozs7Ozs7QUM1S3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsSUFBMEM7QUFDbEQsUUFBUSxpQ0FBNkIsQ0FBQyxnRkFBWSxDQUFDLG9DQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsa0dBQUM7QUFDN0QsTUFBTSxLQUFLLEVBSU47QUFDTCxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUIsb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnREFBZ0QsU0FBUztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0RBQWdELFNBQVM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDek1EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHlEQUF5RDs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUEsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQSxnREFBZ0QsT0FBTztBQUN2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsS0FBSztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFhO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLElBQWE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0E7QUFDQSxjQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixlQUFlO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7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LENBQUMsNEVBQVc7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDMEQ7QUFDMUQ7QUFDQSxvQkFBb0Isa0VBQUU7QUFDdEIsaUVBQWUsZUFBZSxFQUFDO0FBQ1Y7QUFDa0Q7QUFDa0I7QUFDekYsMkVBQXdCO0FBQ3hCO0FBQ0Esb0JBQW9CLCtFQUFlLG9FQUFvRTtBQUN2RztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ29GO0FBQ3JGLDRCQUE0QixzRkFBc0Isc0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2NvbXBsYWluL2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvZXJyb3Itc3RhY2stcGFyc2VyL2Vycm9yLXN0YWNrLXBhcnNlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy1saWdodC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9saXN0ZW5lci10cmFja2VyL2xpYi9saXN0ZW5lci10cmFja2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9tYXJrby90ZXN0X2ZpbGUubWFya28iLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLWJlZ2luQ29tcG9uZW50L2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLWVuZENvbXBvbmVudC9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvY29tcG9uZW50cy1yZWdpc3RyeS9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvY29tcG9uZW50cy11dGlsL2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9yZXF1aXJlL2luZGV4LXdlYnBhY2suanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9zZXQtaW1tZWRpYXRlL2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9zZXQtaW1tZWRpYXRlL3F1ZXVlTWljcm90YXNrLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvUmVuZGVyUmVzdWx0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudERlZi5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50c0NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0dsb2JhbENvbXBvbmVudHNDb250ZXh0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9LZXlTZXF1ZW5jZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvU3RhdGUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2RlZmluZUNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZG9tLWRhdGEuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2V2ZW50LWRlbGVnYXRpb24uanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL3JlZ2lzdHJ5LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvdXBkYXRlLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jcmVhdGVPdXQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9kb20taW5zZXJ0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvaGVscGVycy9fY2hhbmdlLWNhc2UuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL2NsYXNzLXZhbHVlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvaGVscGVycy9zdHlsZS12YWx1ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3JlbmRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL0FzeW5jVkRPTUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZEb2N1bWVudEZyYWdtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVkZyYWdtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WTm9kZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVlRleHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL2hlbHBlcnMvYXR0cnMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9mcmFnbWVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vbW9ycGhkb20vaGVscGVycy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vbW9ycGhkb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL3BhcnNlLWh0bWwuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL3Zkb20uanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9yYXB0b3ItdXRpbC9jb3B5UHJvcHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9yYXB0b3ItdXRpbC9leHRlbmQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9yYXB0b3ItdXRpbC9pbmhlcml0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvc3RhY2tmcmFtZS9zdGFja2ZyYW1lLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3dhcnAxMC9maW5hbGl6ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3dhcnAxMC9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL3NyYy9maW5hbGl6ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vdWkvdGVzdHVpLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vdWkvaW5kZXgubWFya28iXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU3RhY2tQYXJzZXIgPSByZXF1aXJlKCdlcnJvci1zdGFjay1wYXJzZXInKTtcbnZhciBlbnYgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlY7XG52YXIgaXNEZXZlbG9wbWVudCA9ICFlbnYgfHwgZW52ID09PSAnZGV2JyB8fCBlbnYgPT09ICdkZXZlbG9wbWVudCc7XG52YXIgc2hvd01vZHVsZUNvbXBsYWlucyA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKHByb2Nlc3MuZW52LlNIT1dfTU9EVUxFX0NPTVBMQUlOUyk7XG52YXIgc2hvd05lc3RlZENvbXBsYWlucyA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKHByb2Nlc3MuZW52LlNIT1dfTkVTVEVEX0NPTVBMQUlOUyk7XG52YXIgbG9nZ2VyID0gdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2FybiAmJiBjb25zb2xlO1xudmFyIGN3ZCA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmN3ZCgpICsgJy8nIHx8ICcnO1xudmFyIGxpbmVicmVhayA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAnd2luMzInID09PSBwcm9jZXNzLnBsYXRmb3JtID8gJ1xcclxcbicgOiAnXFxuJztcbnZhciBuZXdsaW5lID0gLyhcXHJcXG58XFxyfFxcbikvZztcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xudmFyIGlnbm9yZWRMb2NhdGlvbiA9IFwiW2lnbm9yZV1cIjtcbnZhciBoaXRzID0ge307XG5cbmNvbXBsYWluID0gaXNEZXZlbG9wbWVudCA/IGNvbXBsYWluIDogbm9vcDtcbmNvbXBsYWluLm1ldGhvZCA9IGlzRGV2ZWxvcG1lbnQgPyBtZXRob2QgOiBub29wO1xuY29tcGxhaW4uZm4gPSBpc0RldmVsb3BtZW50ID8gZm4gOiBub29wUmV0dXJuO1xuY29tcGxhaW4ubG9nID0gbG9nO1xuY29tcGxhaW4uc3RyZWFtID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3Muc3RkZXJyO1xuY29tcGxhaW4uc2lsZW5jZSA9IGZhbHNlO1xuY29tcGxhaW4uY29sb3IgPSBjb21wbGFpbi5zdHJlYW0gJiYgY29tcGxhaW4uc3RyZWFtLmlzVFRZO1xuY29tcGxhaW4uY29sb3JzID0geyB3YXJuaW5nOidcXHgxYlszMTsxbScsIG5vdGljZTonXFx4MWJbMzM7MW0nLCBtZXNzYWdlOmZhbHNlLCBsb2NhdGlvbjonXFx1MDAxYls5MG0nIH07XG5jb21wbGFpbi5nZXRNb2R1bGVOYW1lID0gZ2V0TW9kdWxlTmFtZTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbXBsYWluO1xufSBlbHNlIGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5jb21wbGFpbiA9IGNvbXBsYWluO1xufVxuXG5mdW5jdGlvbiBjb21wbGFpbigpIHtcbiAgdmFyIG9wdGlvbnM7XG4gIHZhciBsb2NhdGlvbjtcbiAgdmFyIGxvY2F0aW9uSW5kZXg7XG4gIHZhciBoZWFkaW5nQ29sb3I7XG4gIHZhciBoZWFkaW5nO1xuICB2YXIgbGV2ZWw7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gIGlmKGNvbXBsYWluLnNpbGVuY2UpIHJldHVybjtcblxuICBpZih0eXBlb2YgYXJnc1thcmdzLmxlbmd0aC0xXSA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0gYXJnc1thcmdzLmxlbmd0aC0xXTtcbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmdzLCAwLCAtMSk7XG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgbGV2ZWwgPSBvcHRpb25zLmxldmVsIHx8IDI7XG4gIGhlYWRpbmcgPSBvcHRpb25zLmhlYWRpbmcgfHwgKGxldmVsID09IDIgPyBcIldBUk5JTkchIVwiIDogXCJOT1RJQ0VcIik7XG4gIGhlYWRpbmdDb2xvciA9IG9wdGlvbnMuaGVhZGluZ0NvbG9yIHx8IChsZXZlbCA9PSAyID8gY29tcGxhaW4uY29sb3JzLndhcm5pbmcgOiBjb21wbGFpbi5jb2xvcnMubm90aWNlKTtcblxuICAvLyBEZWZhdWx0IHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgY2FsbCB0byB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvblxuICBsb2NhdGlvbkluZGV4ID0gb3B0aW9ucy5sb2NhdGlvbkluZGV4ID09IG51bGwgPyAxIDogb3B0aW9ucy5sb2NhdGlvbkluZGV4O1xuXG4gIC8vIFdoZW4gdGhlIHVzZXIgc2V0cyBsb2NhdGlvbiB0byBmYWxzZSxcbiAgLy8gV2Ugd2lsbCB1c2UgdGhlIGxvY2F0aW9uIG9mIHRoZSBjYWxsIHRvIGNvbXBsYWluKClcbiAgLy8gVG8gbGltaXQgdGhlIGxvZyB0byBvbmx5IG9jY3VycmluZyBvbmNlXG4gIGlmKG9wdGlvbnMubG9jYXRpb24gPT09IGZhbHNlKSB7XG4gICAgbG9jYXRpb25JbmRleCA9IDA7XG4gIH1cblxuICBsb2NhdGlvbiA9IG9wdGlvbnMubG9jYXRpb24gfHwgZ2V0TG9jYXRpb24obG9jYXRpb25JbmRleCk7XG4gIFxuICB2YXIgbW9kdWxlTmFtZSA9IGNvbXBsYWluLmdldE1vZHVsZU5hbWUobG9jYXRpb24pO1xuXG4gIGlmIChtb2R1bGVOYW1lICYmICFzaG93TW9kdWxlQ29tcGxhaW5zKSB7XG4gICAgaWYgKCFoaXRzW21vZHVsZU5hbWVdKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0KFwiTk9USUNFXCIsIGNvbXBsYWluLmNvbG9ycy5ub3RpY2UpO1xuICAgICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdCgnVGhlIG1vZHVsZSBbJyttb2R1bGVOYW1lKyddIGlzIHVzaW5nIGRlcHJlY2F0ZWQgZmVhdHVyZXMuJywgY29tcGxhaW4uY29sb3JzLm1lc3NhZ2UpO1xuICAgICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdCgnUnVuIHdpdGggcHJvY2Vzcy5lbnYuU0hPV19NT0RVTEVfQ09NUExBSU5TPTEgdG8gc2VlIGFsbCB3YXJuaW5ncy4nLCBjb21wbGFpbi5jb2xvcnMubWVzc2FnZSk7XG4gICAgICBjb21wbGFpbi5sb2cobGluZWJyZWFrICsgb3V0cHV0ICsgbGluZWJyZWFrKTtcbiAgICAgIGhpdHNbbW9kdWxlTmFtZV0gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAvLyBMb2NhdGlvbiBpcyBvbmx5IG1pc3NpbmcgaW4gb2xkZXIgYnJvd3NlcnMuXG4gIGlmKGxvY2F0aW9uKSB7XG4gICAgaWYoaGl0c1tsb2NhdGlvbl0gfHwgbG9jYXRpb24gPT09IGlnbm9yZWRMb2NhdGlvbikgcmV0dXJuO1xuICAgIGVsc2UgaGl0c1tsb2NhdGlvbl0gPSB0cnVlO1xuICB9XG5cbiAgdmFyIG91dHB1dCA9IGZvcm1hdChoZWFkaW5nLCBoZWFkaW5nQ29sb3IpO1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdChhcmdzW2ldLCBjb21wbGFpbi5jb2xvcnMubWVzc2FnZSk7XG4gIH1cblxuICBpZihvcHRpb25zLmxvY2F0aW9uICE9PSBmYWxzZSAmJiBsb2NhdGlvbikge1xuICAgIG91dHB1dCArPSBsaW5lYnJlYWsgKyBmb3JtYXQoJyAgYXQgJytsb2NhdGlvbi5yZXBsYWNlKGN3ZCwgJycpLCBjb21wbGFpbi5jb2xvcnMubG9jYXRpb24pO1xuICB9XG5cbiAgY29tcGxhaW4ubG9nKGxpbmVicmVhayArIG91dHB1dCArIGxpbmVicmVhayk7XG59O1xuXG5mdW5jdGlvbiBtZXRob2Qob2JqZWN0LCBtZXRob2ROYW1lKSB7XG4gICAgdmFyIG9yaWdpbmFsTWV0aG9kID0gb2JqZWN0W21ldGhvZE5hbWVdO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuXG4gICAgb2JqZWN0W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbXBsYWluLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gb3JpZ2luYWxNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBmbihvcmlnaW5hbCkge1xuICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29tcGxhaW4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgcmV0dXJuIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9nKG1lc3NhZ2UsIGNvbG9yKSB7XG4gIHZhciBmb3JtYXR0ZWQgPSBmb3JtYXQobWVzc2FnZSwgY29sb3IpO1xuICBpZihjb21wbGFpbi5zdHJlYW0pIHtcbiAgICBjb21wbGFpbi5zdHJlYW0ud3JpdGUoZm9ybWF0dGVkK2xpbmVicmVhayk7XG4gIH0gZWxzZSBpZihsb2dnZXIpIHtcbiAgICBsb2dnZXIud2Fybihmb3JtYXR0ZWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdChtZXNzYWdlLCBjb2xvcikge1xuICByZXR1cm4gY29sb3IgJiYgY29tcGxhaW4uY29sb3IgPyBjb2xvciArIG1lc3NhZ2UgKyAnXFx4MWJbMG0nIDogbWVzc2FnZTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9jYXRpb24obG9jYXRpb25JbmRleCkge1xuICB2YXIgbG9jYXRpb24gPSAnJztcbiAgdmFyIHRhcmdldEluZGV4ID0gbG9jYXRpb25JbmRleCArIDI7XG5cbiAgLyoqXG4gICAqIFN0YWNrIGluZGV4IGRlc2NyaXB0aW9ucy5cbiAgICogXG4gICAqIDA6IEluIGdldExvY2F0aW9uKCksIHRoZSBjYWxsIHRvIG5ldyBFcnJvcigpXG4gICAqIDE6IEluIGNvbXBsYWluKCksIHRoZSBjYWxsIHRvIGdldExvY2F0aW9uKClcbiAgICogMjogSW4gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb24sIHRoZSBjYWxsIHRvIGNvbXBsYWluKClcbiAgICogMzogVGhlIGNhbGwgdG8gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb24gKFRISVMgSVMgVEhFIERFRkFVTFQpXG4gICAqL1xuXG4gIHRyeSB7XG4gICAgdmFyIGxvY2F0aW9ucyA9IFN0YWNrUGFyc2VyLnBhcnNlKG5ldyBFcnJvcigpKS5tYXAoZnVuY3Rpb24oZnJhbWUpIHtcbiAgICAgIHJldHVybiBmcmFtZS5maWxlTmFtZSsnOicrZnJhbWUubGluZU51bWJlcisnOicrZnJhbWUuY29sdW1uTnVtYmVyO1xuICAgIH0pO1xuICAgIGlmICghc2hvd05lc3RlZENvbXBsYWlucykge1xuICAgICAgZm9yICh2YXIgaSA9IGxvY2F0aW9ucy5sZW5ndGgtMTsgaSA+IHRhcmdldEluZGV4OyBpLS0pIHtcbiAgICAgICAgaWYgKGhpdHNbbG9jYXRpb25zW2ldXSkge1xuICAgICAgICAgIHJldHVybiBpZ25vcmVkTG9jYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9jYXRpb24gPSBsb2NhdGlvbnNbdGFyZ2V0SW5kZXhdO1xuICB9IGNhdGNoKGUpIHt9XG5cbiAgcmV0dXJuIGxvY2F0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRNb2R1bGVOYW1lKGxvY2F0aW9uKSB7XG4gIHZhciBsb2NhdGlvblBhcnRzID0gbG9jYXRpb24ucmVwbGFjZShjd2QsICcnKS5zcGxpdCgvXFwvfFxcXFwvZyk7XG4gIGZvcih2YXIgaSA9IGxvY2F0aW9uUGFydHMubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGxvY2F0aW9uUGFydHNbaV0gPT09ICdub2RlX21vZHVsZXMnKSB7XG4gICAgICB2YXIgbW9kdWxlTmFtZSA9IGxvY2F0aW9uUGFydHNbaSsxXTtcbiAgICAgIHJldHVybiAobW9kdWxlTmFtZVswXSA9PT0gJ0AnKSA/IG1vZHVsZU5hbWUrJy8nK2xvY2F0aW9uUGFydHNbaSsyXSA6IG1vZHVsZU5hbWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuZnVuY3Rpb24gbm9vcFJldHVybihyKSB7IHJldHVybiByOyB9O1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnZXJyb3Itc3RhY2stcGFyc2VyJywgWydzdGFja2ZyYW1lJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdzdGFja2ZyYW1lJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuRXJyb3JTdGFja1BhcnNlciA9IGZhY3Rvcnkocm9vdC5TdGFja0ZyYW1lKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIoU3RhY2tGcmFtZSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFAgPSAvKF58QClcXFMrOlxcZCsvO1xuICAgIHZhciBDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQID0gL15cXHMqYXQgLiooXFxTKzpcXGQrfFxcKG5hdGl2ZVxcKSkvbTtcbiAgICB2YXIgU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCA9IC9eKGV2YWxAKT8oXFxbbmF0aXZlIGNvZGVdKT8kLztcblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiBhbiBFcnJvciBvYmplY3QsIGV4dHJhY3QgdGhlIG1vc3QgaW5mb3JtYXRpb24gZnJvbSBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3Igb2JqZWN0XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBvZiBTdGFja0ZyYW1lc1xuICAgICAgICAgKi9cbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrdHJhY2UgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBlcnJvclsnb3BlcmEjc291cmNlbG9jJ10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrICYmIGVycm9yLnN0YWNrLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VWOE9ySUUoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRkZPclNhZmFyaShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIGdpdmVuIEVycm9yIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFNlcGFyYXRlIGxpbmUgYW5kIGNvbHVtbiBudW1iZXJzIGZyb20gYSBzdHJpbmcgb2YgdGhlIGZvcm06IChVUkk6TGluZTpDb2x1bW4pXG4gICAgICAgIGV4dHJhY3RMb2NhdGlvbjogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkZXh0cmFjdExvY2F0aW9uKHVybExpa2UpIHtcbiAgICAgICAgICAgIC8vIEZhaWwtZmFzdCBidXQgcmV0dXJuIGxvY2F0aW9ucyBsaWtlIFwiKG5hdGl2ZSlcIlxuICAgICAgICAgICAgaWYgKHVybExpa2UuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdXJsTGlrZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZWdFeHAgPSAvKC4rPykoPzo6KFxcZCspKT8oPzo6KFxcZCspKT8kLztcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlZ0V4cC5leGVjKHVybExpa2UucmVwbGFjZSgvWygpXS9nLCAnJykpO1xuICAgICAgICAgICAgcmV0dXJuIFtwYXJ0c1sxXSwgcGFydHNbMl0gfHwgdW5kZWZpbmVkLCBwYXJ0c1szXSB8fCB1bmRlZmluZWRdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlVjhPcklFOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZVY4T3JJRShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCcoZXZhbCAnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZXZhbCBpbmZvcm1hdGlvbiB1bnRpbCB3ZSBpbXBsZW1lbnQgc3RhY2t0cmFjZS5qcy9zdGFja2ZyYW1lIzhcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvZXZhbCBjb2RlL2csICdldmFsJykucmVwbGFjZSgvKFxcKGV2YWwgYXQgW14oKV0qKXwoLC4qJCkvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2FuaXRpemVkTGluZSA9IGxpbmUucmVwbGFjZSgvXlxccysvLCAnJykucmVwbGFjZSgvXFwoZXZhbCBjb2RlL2csICcoJykucmVwbGFjZSgvXi4qP1xccysvLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYXB0dXJlIGFuZCBwcmVzZXZlIHRoZSBwYXJlbnRoZXNpemVkIGxvY2F0aW9uIFwiKC9mb28vbXkgYmFyLmpzOjEyOjg3KVwiIGluXG4gICAgICAgICAgICAgICAgLy8gY2FzZSBpdCBoYXMgc3BhY2VzIGluIGl0LCBhcyB0aGUgc3RyaW5nIGlzIHNwbGl0IG9uIFxccysgbGF0ZXIgb25cbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBzYW5pdGl6ZWRMaW5lLm1hdGNoKC8gKFxcKC4rXFwpJCkvKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgcGFyZW50aGVzaXplZCBsb2NhdGlvbiBmcm9tIHRoZSBsaW5lLCBpZiBpdCB3YXMgbWF0Y2hlZFxuICAgICAgICAgICAgICAgIHNhbml0aXplZExpbmUgPSBsb2NhdGlvbiA/IHNhbml0aXplZExpbmUucmVwbGFjZShsb2NhdGlvblswXSwgJycpIDogc2FuaXRpemVkTGluZTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGEgbG9jYXRpb24gd2FzIG1hdGNoZWQsIHBhc3MgaXQgdG8gZXh0cmFjdExvY2F0aW9uKCkgb3RoZXJ3aXNlIHBhc3MgYWxsIHNhbml0aXplZExpbmVcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHRoaXMgbGluZSBkb2Vzbid0IGhhdmUgZnVuY3Rpb24gbmFtZVxuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24obG9jYXRpb24gPyBsb2NhdGlvblsxXSA6IHNhbml0aXplZExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBsb2NhdGlvbiAmJiBzYW5pdGl6ZWRMaW5lIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBbJ2V2YWwnLCAnPGFub255bW91cz4nXS5pbmRleE9mKGxvY2F0aW9uUGFydHNbMF0pID4gLTEgPyB1bmRlZmluZWQgOiBsb2NhdGlvblBhcnRzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlRkZPclNhZmFyaTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VGRk9yU2FmYXJpKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWxpbmUubWF0Y2goU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyA+IGV2YWwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoLyBsaW5lIChcXGQrKSg/OiA+IGV2YWwgbGluZSBcXGQrKSogPiBldmFsOlxcZCs6XFxkKy9nLCAnOiQxJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignQCcpID09PSAtMSAmJiBsaW5lLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIGV2YWwgZnJhbWVzIG9ubHkgaGF2ZSBmdW5jdGlvbiBuYW1lcyBhbmQgbm90aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZVJlZ2V4ID0gLygoLipcIi4rXCJbXkBdKik/W15AXSopKD86QCkvO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGxpbmUubWF0Y2goZnVuY3Rpb25OYW1lUmVnZXgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gbWF0Y2hlcyAmJiBtYXRjaGVzWzFdID8gbWF0Y2hlc1sxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbihsaW5lLnJlcGxhY2UoZnVuY3Rpb25OYW1lUmVnZXgsICcnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGxvY2F0aW9uUGFydHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmEoZSkge1xuICAgICAgICAgICAgaWYgKCFlLnN0YWNrdHJhY2UgfHwgKGUubWVzc2FnZS5pbmRleE9mKCdcXG4nKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgZS5tZXNzYWdlLnNwbGl0KCdcXG4nKS5sZW5ndGggPiBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhOShlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWUuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhMTAoZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhOTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTkoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMiwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lc1tpXVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmExMDogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTEwKGUpIHtcbiAgICAgICAgICAgIHZhciBsaW5lUkUgPSAvTGluZSAoXFxkKykuKnNjcmlwdCAoPzppbiApPyhcXFMrKSg/OjogSW4gZnVuY3Rpb24gKFxcUyspKT8kL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbWF0Y2hbM10gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBPcGVyYSAxMC42NSsgRXJyb3Iuc3RhY2sgdmVyeSBzaW1pbGFyIHRvIEZGL1NhZmFyaVxuICAgICAgICBwYXJzZU9wZXJhMTE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmExMShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFApICYmICFsaW5lLm1hdGNoKC9eRXJyb3IgY3JlYXRlZCBhdC8pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZC5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbnMgPSBsaW5lLnNwbGl0KCdAJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbih0b2tlbnMucG9wKCkpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkNhbGwgPSAodG9rZW5zLnNoaWZ0KCkgfHwgJycpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbkNhbGxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzxhbm9ueW1vdXMgZnVuY3Rpb24oOiAoXFx3KykpPz4vLCAnJDInKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgJycpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgYXJnc1JhdztcbiAgICAgICAgICAgICAgICBpZiAoZnVuY3Rpb25DYWxsLm1hdGNoKC9cXCgoW14pXSopXFwpLykpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1JhdyA9IGZ1bmN0aW9uQ2FsbC5yZXBsYWNlKC9eW14oXStcXCgoW14pXSopXFwpJC8sICckMScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IChhcmdzUmF3ID09PSB1bmRlZmluZWQgfHwgYXJnc1JhdyA9PT0gJ1thcmd1bWVudHMgbm90IGF2YWlsYWJsZV0nKSA/XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCA6IGFyZ3NSYXcuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbn0pKTtcbiIsIi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIGxpc3RlbmVyJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VMaXN0ZW5lcihlZSwgbGlzdGVuZXIsIGFyZ3MpIHtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChlZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChlZSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChlZSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIHNsb3dlclxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkoZWUsIHNsaWNlLmNhbGwoYXJncywgMSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXIoZXZlbnRFbWl0dGVyLCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgdmFyIGV2ZW50cyA9IGV2ZW50RW1pdHRlci4kZSB8fCAoZXZlbnRFbWl0dGVyLiRlID0ge30pO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcbiAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICAgICAgICAgIGV2ZW50c1t0eXBlXSA9IHByZXBlbmQgPyBbbGlzdGVuZXIsIGxpc3RlbmVyc10gOiBbbGlzdGVuZXJzLCBsaXN0ZW5lcl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocHJlcGVuZCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICB9XG4gICAgcmV0dXJuIGV2ZW50RW1pdHRlcjtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIHRoaXMuJGUgPSB0aGlzLiRlIHx8IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlID0ge1xuICAgICRlOiBudWxsLFxuXG4gICAgZW1pdDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy4kZTtcbiAgICAgICAgaWYgKCFldmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBldmVudHMgJiYgZXZlbnRzW3R5cGVdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBhcmdzWzFdO1xuICAgICAgICAgICAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0gZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdFcnJvcjogJyArIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgICAgICAgICAgaW52b2tlTGlzdGVuZXIodGhpcywgbGlzdGVuZXJzLCBhcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IHNsaWNlLmNhbGwobGlzdGVuZXJzKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49bGlzdGVuZXJzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpbnZva2VMaXN0ZW5lcih0aGlzLCBsaXN0ZW5lciwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBhZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBwcmVwZW5kTGlzdGVuZXI6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBhZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIG9uY2U6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGcoKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub24odHlwZSwgZyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG4gICAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLiRlO1xuICAgICAgICB2YXIgbGlzdGVuZXJzO1xuXG4gICAgICAgIGlmIChldmVudHMgJiYgKGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXSkpIHtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT1saXN0ZW5lcnMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuJGU7XG4gICAgICAgIGlmIChldmVudHMpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbGlzdGVuZXJDb3VudDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy4kZTtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IGV2ZW50cyAmJiBldmVudHNbdHlwZV07XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcnMgPyAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpID8gMSA6IGxpc3RlbmVycy5sZW5ndGgpIDogMDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjsiLCJ2YXIgSU5ERVhfRVZFTlQgPSAwO1xudmFyIElOREVYX1VTRVJfTElTVEVORVIgPSAxO1xudmFyIElOREVYX1dSQVBQRURfTElTVEVORVIgPSAyO1xudmFyIERFU1RST1kgPSBcImRlc3Ryb3lcIjtcblxuZnVuY3Rpb24gaXNOb25FdmVudEVtaXR0ZXIodGFyZ2V0KSB7XG4gIHJldHVybiAhdGFyZ2V0Lm9uY2U7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcldyYXBwZXIodGFyZ2V0KSB7XG4gICAgdGhpcy4kX190YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy4kX19saXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLiRfX3N1YnNjcmliZVRvID0gbnVsbDtcbn1cblxuRXZlbnRFbWl0dGVyV3JhcHBlci5wcm90b3R5cGUgPSB7XG4gICAgJF9fcmVtb3ZlOiBmdW5jdGlvbih0ZXN0LCB0ZXN0V3JhcHBlZCkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kX190YXJnZXQ7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLiRfX2xpc3RlbmVycztcblxuICAgICAgICB0aGlzLiRfX2xpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIoZnVuY3Rpb24oY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBjdXJFdmVudCA9IGN1ckxpc3RlbmVyW0lOREVYX0VWRU5UXTtcbiAgICAgICAgICAgIHZhciBjdXJMaXN0ZW5lckZ1bmMgPSBjdXJMaXN0ZW5lcltJTkRFWF9VU0VSX0xJU1RFTkVSXTtcbiAgICAgICAgICAgIHZhciBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jID0gY3VyTGlzdGVuZXJbSU5ERVhfV1JBUFBFRF9MSVNURU5FUl07XG5cbiAgICAgICAgICAgIGlmICh0ZXN0V3JhcHBlZCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyIHVzZWQgYG9uY2VgIHRvIGF0dGFjaCBhbiBldmVudCBsaXN0ZW5lciB0aGVuIHdlIGhhZCB0b1xuICAgICAgICAgICAgICAgIC8vIHdyYXAgdGhlaXIgbGlzdGVuZXIgZnVuY3Rpb24gd2l0aCBhIG5ldyBmdW5jdGlvbiB0aGF0IGRvZXMgc29tZSBleHRyYVxuICAgICAgICAgICAgICAgIC8vIGNsZWFudXAgdG8gYXZvaWQgYSBtZW1vcnkgbGVhay4gSWYgdGhlIGB0ZXN0V3JhcHBlZGAgZmxhZyBpcyBzZXQgdG8gdHJ1ZVxuICAgICAgICAgICAgICAgIC8vIHRoZW4gd2UgYXJlIGF0dGVtcHRpbmcgdG8gcmVtb3ZlIGJhc2VkIG9uIGEgZnVuY3Rpb24gdGhhdCB3ZSBoYWQgdG9cbiAgICAgICAgICAgICAgICAvLyB3cmFwIChub3QgdGhlIHVzZXIgbGlzdGVuZXIgZnVuY3Rpb24pXG4gICAgICAgICAgICAgICAgaWYgKGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMgJiYgdGVzdChjdXJFdmVudCwgY3VyV3JhcHBlZExpc3RlbmVyRnVuYykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKGN1ckV2ZW50LCBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXN0KGN1ckV2ZW50LCBjdXJMaXN0ZW5lckZ1bmMpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHdhcyB3cmFwcGVkIGR1ZSB0byBpdCBiZWluZyBhIGBvbmNlYCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIC8vIHRoZW4gd2Ugc2hvdWxkIHJlbW92ZSBmcm9tIHRoZSB0YXJnZXQgRXZlbnRFbWl0dGVyIHVzaW5nIHdyYXBwZWRcbiAgICAgICAgICAgICAgICAvLyBsaXN0ZW5lciBmdW5jdGlvbi4gT3RoZXJ3aXNlLCB3ZSByZW1vdmUgdGhlIGxpc3RlbmVyIHVzaW5nIHRoZSB1c2VyLXByb3ZpZGVkXG4gICAgICAgICAgICAgICAgLy8gbGlzdGVuZXIgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKGN1ckV2ZW50LCBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jIHx8IGN1ckxpc3RlbmVyRnVuYyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBGaXhlcyBodHRwczovL2dpdGh1Yi5jb20vcmFwdG9yanMvbGlzdGVuZXItdHJhY2tlci9pc3N1ZXMvMlxuICAgICAgICAvLyBJZiBhbGwgb2YgdGhlIGxpc3RlbmVycyBzdG9yZWQgd2l0aCBhIHdyYXBwZWQgRXZlbnRFbWl0dGVyXG4gICAgICAgIC8vIGhhdmUgYmVlbiByZW1vdmVkIHRoZW4gd2Ugc2hvdWxkIHVucmVnaXN0ZXIgdGhlIHdyYXBwZWRcbiAgICAgICAgLy8gRXZlbnRFbWl0dGVyIGluIHRoZSBwYXJlbnQgU3Vic2NyaXB0aW9uVHJhY2tlclxuICAgICAgICB2YXIgc3Vic2NyaWJlVG8gPSB0aGlzLiRfX3N1YnNjcmliZVRvO1xuXG4gICAgICAgIGlmICghdGhpcy4kX19saXN0ZW5lcnMubGVuZ3RoICYmIHN1YnNjcmliZVRvKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaWJlVG9MaXN0ID0gc3Vic2NyaWJlVG8uJF9fc3Vic2NyaWJlVG9MaXN0O1xuICAgICAgICAgICAgc3Vic2NyaWJlVG8uJF9fc3Vic2NyaWJlVG9MaXN0ID0gc3Vic2NyaWJlVG9MaXN0LmZpbHRlcihmdW5jdGlvbihjdXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VyICE9PSBzZWxmO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLiRfX3RhcmdldC5vbihldmVudCwgbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLiRfX2xpc3RlbmVycy5wdXNoKFtldmVudCwgbGlzdGVuZXJdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG9uY2U6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gSGFuZGxpbmcgYSBgb25jZWAgZXZlbnQgbGlzdGVuZXIgaXMgYSBsaXR0bGUgdHJpY2t5IHNpbmNlIHdlIG5lZWQgdG8gYWxzb1xuICAgICAgICAvLyBkbyBvdXIgb3duIGNsZWFudXAgaWYgdGhlIGBvbmNlYCBldmVudCBpcyBlbWl0dGVkLiBUaGVyZWZvcmUsIHdlIG5lZWRcbiAgICAgICAgLy8gdG8gd3JhcCB0aGUgdXNlcidzIGxpc3RlbmVyIGZ1bmN0aW9uIHdpdGggb3VyIG93biBsaXN0ZW5lciBmdW5jdGlvbi5cbiAgICAgICAgdmFyIHdyYXBwZWRMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi4kX19yZW1vdmUoZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyRnVuYykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVkTGlzdGVuZXIgPT09IGxpc3RlbmVyRnVuYztcbiAgICAgICAgICAgIH0sIHRydWUgLyogV2UgYXJlIHJlbW92aW5nIHRoZSB3cmFwcGVkIGxpc3RlbmVyICovKTtcblxuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiRfX3RhcmdldC5vbmNlKGV2ZW50LCB3cmFwcGVkTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLiRfX2xpc3RlbmVycy5wdXNoKFtldmVudCwgbGlzdGVuZXIsIHdyYXBwZWRMaXN0ZW5lcl0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGV2ZW50O1xuICAgICAgICAgICAgZXZlbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3RlbmVyICYmIGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRfX3JlbW92ZShmdW5jdGlvbihjdXJFdmVudCwgY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQgPT09IGN1ckV2ZW50ICYmIGxpc3RlbmVyID09PSBjdXJMaXN0ZW5lcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLiRfX3JlbW92ZShmdW5jdGlvbihjdXJFdmVudCwgY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdGVuZXIgPT09IGN1ckxpc3RlbmVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuJF9fbGlzdGVuZXJzO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kX190YXJnZXQ7XG5cbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRfX3JlbW92ZShmdW5jdGlvbihjdXJFdmVudCwgY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQgPT09IGN1ckV2ZW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIoY3VyW0lOREVYX0VWRU5UXSwgY3VyW0lOREVYX1VTRVJfTElTVEVORVJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXJBZGFwdGVyKHRhcmdldCkge1xuICAgIHRoaXMuJF9fdGFyZ2V0ID0gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXJBZGFwdGVyLnByb3RvdHlwZSA9IHtcbiAgICBvbjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG9uY2U6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gbmVlZCB0byBzYXZlIHRoaXMgc28gd2UgY2FuIHJlbW92ZSBpdCBiZWxvd1xuICAgICAgICB2YXIgb25jZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi4kX190YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgb25jZUxpc3RlbmVyKTtcbiAgICAgICAgICBsaXN0ZW5lcigpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRfX3RhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBvbmNlTGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLiRfX3RhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIFN1YnNjcmlwdGlvblRyYWNrZXIoKSB7XG4gICAgdGhpcy4kX19zdWJzY3JpYmVUb0xpc3QgPSBbXTtcbn1cblxuU3Vic2NyaXB0aW9uVHJhY2tlci5wcm90b3R5cGUgPSB7XG5cbiAgICBzdWJzY3JpYmVUbzogZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBhZGREZXN0cm95TGlzdGVuZXIgPSAhb3B0aW9ucyB8fCBvcHRpb25zLmFkZERlc3Ryb3lMaXN0ZW5lciAhPT0gZmFsc2U7XG4gICAgICAgIHZhciB3cmFwcGVyO1xuICAgICAgICB2YXIgbm9uRUU7XG4gICAgICAgIHZhciBzdWJzY3JpYmVUb0xpc3QgPSB0aGlzLiRfX3N1YnNjcmliZVRvTGlzdDtcblxuICAgICAgICBmb3IgKHZhciBpPTAsIGxlbj1zdWJzY3JpYmVUb0xpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VyID0gc3Vic2NyaWJlVG9MaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGN1ci4kX190YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHdyYXBwZXIgPSBjdXI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXdyYXBwZXIpIHtcbiAgICAgICAgICAgIGlmIChpc05vbkV2ZW50RW1pdHRlcih0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIG5vbkVFID0gbmV3IEV2ZW50RW1pdHRlckFkYXB0ZXIodGFyZ2V0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlciA9IG5ldyBFdmVudEVtaXR0ZXJXcmFwcGVyKG5vbkVFIHx8IHRhcmdldCk7XG4gICAgICAgICAgICBpZiAoYWRkRGVzdHJveUxpc3RlbmVyICYmICFub25FRSkge1xuICAgICAgICAgICAgICAgIHdyYXBwZXIub25jZShERVNUUk9ZLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3Vic2NyaWJlVG9MaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlVG9MaXN0W2ldLiRfX3RhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgcGFyZW50IFN1YnNjcmlwdGlvblRyYWNrZXIgc28gdGhhdCB3ZSBjYW4gZG8gY2xlYW51cFxuICAgICAgICAgICAgLy8gaWYgdGhlIEV2ZW50RW1pdHRlcldyYXBwZXIgaW5zdGFuY2UgYmVjb21lcyBlbXB0eSAoaS5lLiwgbm8gYWN0aXZlIGxpc3RlbmVycylcbiAgICAgICAgICAgIHdyYXBwZXIuJF9fc3Vic2NyaWJlVG8gPSB0aGlzO1xuICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0LnB1c2god3JhcHBlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50KSB7XG4gICAgICAgIHZhciBzdWJzY3JpYmVUb0xpc3QgPSB0aGlzLiRfX3N1YnNjcmliZVRvTGlzdDtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgZm9yIChpID0gc3Vic2NyaWJlVG9MaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ciA9IHN1YnNjcmliZVRvTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyLiRfX3RhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ci5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY3VyLiRfX2xpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvIHNvbWUgY2xlYW51cCBpZiB3ZSByZW1vdmVkIGFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGlzdGVuZXJzIGZvciB0aGUgdGFyZ2V0IGV2ZW50IGVtaXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3RbaV0ucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmlwdGlvblRyYWNrZXI7XG5cbmV4cG9ydHMud3JhcCA9IGZ1bmN0aW9uKHRhcmdldEV2ZW50RW1pdHRlcikge1xuICAgIHZhciBub25FRTtcbiAgICB2YXIgd3JhcHBlcjtcblxuICAgIGlmIChpc05vbkV2ZW50RW1pdHRlcih0YXJnZXRFdmVudEVtaXR0ZXIpKSB7XG4gICAgICBub25FRSA9IG5ldyBFdmVudEVtaXR0ZXJBZGFwdGVyKHRhcmdldEV2ZW50RW1pdHRlcik7XG4gICAgfVxuXG4gICAgd3JhcHBlciA9IG5ldyBFdmVudEVtaXR0ZXJXcmFwcGVyKG5vbkVFIHx8IHRhcmdldEV2ZW50RW1pdHRlcik7XG4gICAgaWYgKCFub25FRSkge1xuICAgICAgLy8gd2UgZG9uJ3Qgc2V0IHRoaXMgZm9yIG5vbiBFRSB0eXBlc1xuICAgICAgdGFyZ2V0RXZlbnRFbWl0dGVyLm9uY2UoREVTVFJPWSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd3JhcHBlci4kX19saXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwcGVyO1xufTtcblxuZXhwb3J0cy5jcmVhdGVUcmFja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25UcmFja2VyKCk7XG59O1xuIiwiLy8gQ29tcGlsZWQgdXNpbmcgbWFya29ANS4zMy4xNCAtIERPIE5PVCBFRElUXG5pbXBvcnQgeyB0IGFzIF90IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanNcIjtcbmNvbnN0IF9tYXJrb19jb21wb25lbnRUeXBlID0gXCJ1aVxcXFxtYXJrb1xcXFx0ZXN0X2ZpbGUubWFya29cIixcbiAgX21hcmtvX3RlbXBsYXRlID0gX3QoX21hcmtvX2NvbXBvbmVudFR5cGUpO1xuZXhwb3J0IGRlZmF1bHQgX21hcmtvX3RlbXBsYXRlO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHtcbiAgb25DcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGFycjogW1widW5vXCIsIFwiZHVlXCIsIFwidHJlXCJdXG4gICAgfTtcbiAgfVxufTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge1xuICBvdXQuYmUoXCJkaXZcIiwgbnVsbCwgXCIwXCIsIF9jb21wb25lbnQsIG51bGwsIDApO1xuICB7XG4gICAgbGV0IF9rZXlWYWx1ZSA9IDA7XG4gICAgZm9yIChjb25zdCBudW1lcm8gb2Ygc3RhdGUuYXJyIHx8IFtdKSB7XG4gICAgICBjb25zdCBfa2V5U2NvcGUgPSBgWyR7X2tleVZhbHVlKyt9XWA7XG4gICAgICBvdXQuYmUoXCJwXCIsIG51bGwsIFwiMVwiICsgX2tleVNjb3BlLCBfY29tcG9uZW50LCBudWxsLCAwKTtcbiAgICAgIG91dC50KG51bWVybywgX2NvbXBvbmVudCk7XG4gICAgICBvdXQuZWUoKTtcbiAgICB9XG4gIH1cbiAgb3V0LmVlKCk7XG59LCB7XG4gIHQ6IF9tYXJrb19jb21wb25lbnRUeXBlLFxuICBkOiB0cnVlXG59LCBfbWFya29fY29tcG9uZW50KTtcbmltcG9ydCBfbWFya29fZGVmaW5lQ29tcG9uZW50IGZyb20gXCJtYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2RlZmluZUNvbXBvbmVudC5qc1wiO1xuX21hcmtvX3RlbXBsYXRlLkNvbXBvbmVudCA9IF9tYXJrb19kZWZpbmVDb21wb25lbnQoX21hcmtvX2NvbXBvbmVudCwgX21hcmtvX3RlbXBsYXRlLl8pOyIsInZhciBDb21wb25lbnREZWYgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudERlZlwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWdpbkNvbXBvbmVudChcbiAgY29tcG9uZW50c0NvbnRleHQsXG4gIGNvbXBvbmVudCxcbiAga2V5LFxuICBvd25lckNvbXBvbmVudERlZlxuKSB7XG4gIHZhciBjb21wb25lbnRJZCA9IGNvbXBvbmVudC5pZDtcbiAgdmFyIGNvbXBvbmVudERlZiA9IChjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWYgPSBuZXcgQ29tcG9uZW50RGVmKFxuICAgIGNvbXBvbmVudCxcbiAgICBjb21wb25lbnRJZCxcbiAgICBjb21wb25lbnRzQ29udGV4dFxuICApKTtcbiAgY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW1xuICAgIGNvbXBvbmVudElkXG4gIF0gPSB0cnVlO1xuICBjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnRzLnB1c2goY29tcG9uZW50RGVmKTtcblxuICB2YXIgb3V0ID0gY29tcG9uZW50c0NvbnRleHQuX19fb3V0O1xuICBvdXQuYmMoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50RGVmICYmIG93bmVyQ29tcG9uZW50RGVmLl9fX2NvbXBvbmVudCk7XG4gIHJldHVybiBjb21wb25lbnREZWY7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5kQ29tcG9uZW50KG91dCkge1xuICBvdXQuZWUoKTsgLy8gZW5kRWxlbWVudCgpIChhbHNvIHdvcmtzIGZvciBWQ29tcG9uZW50IG5vZGVzIHB1c2hlZCBvbiB0byB0aGUgc3RhY2spXG59O1xuIiwidmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBzZXRJbW1lZGlhdGUgPSByZXF1aXJlKFwiQGludGVybmFsL3NldC1pbW1lZGlhdGVcIikuX19fc2V0SW1tZWRpYXRlO1xudmFyIHdhcnAxMEZpbmFsaXplID0gcmVxdWlyZShcIndhcnAxMC9maW5hbGl6ZVwiKTtcbnZhciBkZWZpbmVDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2RlZmluZUNvbXBvbmVudFwiKTtcbnZhciBldmVudERlbGVnYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2V2ZW50LWRlbGVnYXRpb25cIik7XG52YXIgY3JlYXRlRnJhZ21lbnROb2RlID1cbiAgcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9mcmFnbWVudFwiKS5fX19jcmVhdGVGcmFnbWVudE5vZGU7XG52YXIgQ29tcG9uZW50RGVmID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnREZWZcIik7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciByZXEgPSByZXF1aXJlKFwiQGludGVybmFsL3JlcXVpcmVcIik7XG52YXIgY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xudmFyIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMgPVxuICBjb21wb25lbnRzVXRpbC5fX19hZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzO1xudmFyIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkID0gZG9tRGF0YS5fX19zc3JLZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZDtcbnZhciBjb21wb25lbnRzQnlET01Ob2RlID0gZG9tRGF0YS5fX19jb21wb25lbnRCeURPTU5vZGU7XG52YXIgc2VydmVyQ29tcG9uZW50Um9vdE5vZGVzID0ge307XG52YXIgc2VydmVyUmVuZGVyZWRNZXRhID0ge307XG52YXIgd2luID0gd2luZG93O1xuXG52YXIgREVGQVVMVF9SVU5USU1FX0lEID0gXCJNXCI7XG52YXIgRkxBR19XSUxMX1JFUkVOREVSX0lOX0JST1dTRVIgPSAxO1xuLy8gdmFyIEZMQUdfSEFTX1JFTkRFUl9CT0RZID0gMjtcblxudmFyIHJlZ2lzdGVyZWQgPSB7fTtcbnZhciBsb2FkZWQgPSB7fTtcbnZhciBjb21wb25lbnRUeXBlcyA9IHt9O1xudmFyIGRlZmVycmVkRGVmcztcbnZhciBwZW5kaW5nRGVmcztcblxuZnVuY3Rpb24gcmVnaXN0ZXIodHlwZSwgZGVmKSB7XG4gIHZhciBwZW5kaW5nRm9yVHlwZTtcbiAgaWYgKHBlbmRpbmdEZWZzKSB7XG4gICAgcGVuZGluZ0ZvclR5cGUgPSBwZW5kaW5nRGVmc1t0eXBlXTtcbiAgfVxuICByZWdpc3RlcmVkW3R5cGVdID0gZGVmO1xuICBkZWxldGUgbG9hZGVkW3R5cGVdO1xuICBkZWxldGUgY29tcG9uZW50VHlwZXNbdHlwZV07XG5cbiAgaWYgKHBlbmRpbmdGb3JUeXBlKSB7XG4gICAgZGVsZXRlIHBlbmRpbmdEZWZzW3R5cGVdO1xuICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICBwZW5kaW5nRm9yVHlwZS5mb3JFYWNoKGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIHRyeUh5ZHJhdGVDb21wb25lbnQoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHR5cGU7XG59XG5cbmZ1bmN0aW9uIGFkZFBlbmRpbmdEZWYoZGVmLCB0eXBlLCBtZXRhLCBob3N0LCBydW50aW1lSWQpIHtcbiAgaWYgKCFwZW5kaW5nRGVmcykge1xuICAgIHBlbmRpbmdEZWZzID0ge307XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGVuZGluZ0NvbXBvbmVudElkcyA9IE9iamVjdC5rZXlzKHBlbmRpbmdEZWZzKTtcbiAgICAgICAgaWYgKHBlbmRpbmdDb21wb25lbnRJZHMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgICBcIk1hcmtvIHRlbXBsYXRlcyB3ZXJlIG5ldmVyIGxvYWRlZCBmb3I6IFwiICsgcGVuZGluZ0NvbXBvbmVudElkc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAocGVuZGluZ0RlZnNbdHlwZV0gPSBwZW5kaW5nRGVmc1t0eXBlXSB8fCBbXSkucHVzaChbXG4gICAgZGVmLFxuICAgIG1ldGEsXG4gICAgaG9zdCxcbiAgICBydW50aW1lSWQsXG4gIF0pO1xufVxuXG5mdW5jdGlvbiBsb2FkKHR5cGVOYW1lLCBpc0xlZ2FjeSkge1xuICB2YXIgdGFyZ2V0ID0gbG9hZGVkW3R5cGVOYW1lXTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0YXJnZXQgPSByZWdpc3RlcmVkW3R5cGVOYW1lXTtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHRhcmdldCgpO1xuICAgIH0gZWxzZSBpZiAoaXNMZWdhY3kpIHtcbiAgICAgIHRhcmdldCA9IGV4cG9ydHMuX19fbGVnYWN5LmxvYWQodHlwZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQgPSByZXEodHlwZU5hbWUpO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICBcIkxvb2tzIGxpa2UgeW91IHVzZWQgYHJlcXVpcmU6YCBpbiB5b3VyIGJyb3dzZXIuanNvbiB0byBsb2FkIGEgY29tcG9uZW50LiAgVGhpcyByZXF1aXJlcyB0aGF0IE1hcmtvIGhhcyBrbm93bGVkZ2Ugb2YgaG93IGxhc3NvIGdlbmVyYXRlcyBwYXRocyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHZlcnNpb24uICBgbWFya28tZGVwZW5kZW5jaWVzOi9wYXRoL3RvL3RlbXBsYXRlLm1hcmtvYCBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiQ29tcG9uZW50IG5vdCBmb3VuZDogXCIgKyB0eXBlTmFtZSk7XG4gICAgfVxuXG4gICAgbG9hZGVkW3R5cGVOYW1lXSA9IHRhcmdldDtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudENsYXNzKHR5cGVOYW1lLCBpc0xlZ2FjeSkge1xuICB2YXIgQ29tcG9uZW50Q2xhc3MgPSBjb21wb25lbnRUeXBlc1t0eXBlTmFtZV07XG5cbiAgaWYgKENvbXBvbmVudENsYXNzKSB7XG4gICAgcmV0dXJuIENvbXBvbmVudENsYXNzO1xuICB9XG5cbiAgQ29tcG9uZW50Q2xhc3MgPSBsb2FkKHR5cGVOYW1lLCBpc0xlZ2FjeSk7XG5cbiAgQ29tcG9uZW50Q2xhc3MgPSBDb21wb25lbnRDbGFzcy5Db21wb25lbnQgfHwgQ29tcG9uZW50Q2xhc3M7XG5cbiAgaWYgKCFDb21wb25lbnRDbGFzcy5fX19pc0NvbXBvbmVudCkge1xuICAgIENvbXBvbmVudENsYXNzID0gZGVmaW5lQ29tcG9uZW50KENvbXBvbmVudENsYXNzLCBDb21wb25lbnRDbGFzcy5yZW5kZXJlcik7XG4gIH1cblxuICAvLyBNYWtlIHRoZSBjb21wb25lbnQgXCJ0eXBlXCIgYWNjZXNzaWJsZSBvbiBlYWNoIGNvbXBvbmVudCBpbnN0YW5jZVxuICBDb21wb25lbnRDbGFzcy5wcm90b3R5cGUuX19fdHlwZSA9IHR5cGVOYW1lO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIHZhciBjbGFzc05hbWVNYXRjaCA9XG4gICAgICAvXFwvKFteL10rPykoPzpcXC9pbmRleHxcXC90ZW1wbGF0ZXwpKD86XFwubWFya298XFwuY29tcG9uZW50KD86LWJyb3dzZXIpP3wpJC8uZXhlYyhcbiAgICAgICAgdHlwZU5hbWVcbiAgICAgICk7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZU1hdGNoID8gY2xhc3NOYW1lTWF0Y2hbMV0gOiBcIkFub255bW91c0NvbXBvbmVudFwiO1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uIChnKSB7XG4gICAgICByZXR1cm4gZ1sxXS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZVxuICAgICAgLnJlcGxhY2UoL1xcJFxcZCtcXC5cXGQrXFwuXFxkKyQvLCBcIlwiKVxuICAgICAgLnJlcGxhY2UoL15bXmEteiRfXS9pLCBcIl8kJlwiKVxuICAgICAgLnJlcGxhY2UoL1teMC05YS16JF9dKy9naSwgXCJfXCIpO1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZVswXS50b1VwcGVyQ2FzZSgpICsgY2xhc3NOYW1lLnNsaWNlKDEpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciBPbGRDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzO1xuICAgIENvbXBvbmVudENsYXNzID0ge1xuICAgICAgW2NsYXNzTmFtZV06IGZ1bmN0aW9uIChpZCwgZG9jKSB7XG4gICAgICAgIE9sZENvbXBvbmVudENsYXNzLmNhbGwodGhpcywgaWQsIGRvYyk7XG4gICAgICB9LFxuICAgIH1bY2xhc3NOYW1lXTtcbiAgICBDb21wb25lbnRDbGFzcy5wcm90b3R5cGUgPSBPbGRDb21wb25lbnRDbGFzcy5wcm90b3R5cGU7XG4gIH1cblxuICBjb21wb25lbnRUeXBlc1t0eXBlTmFtZV0gPSBDb21wb25lbnRDbGFzcztcblxuICByZXR1cm4gQ29tcG9uZW50Q2xhc3M7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudCh0eXBlTmFtZSwgaWQsIGlzTGVnYWN5KSB7XG4gIHZhciBDb21wb25lbnRDbGFzcyA9IGdldENvbXBvbmVudENsYXNzKHR5cGVOYW1lLCBpc0xlZ2FjeSk7XG4gIHJldHVybiBuZXcgQ29tcG9uZW50Q2xhc3MoaWQpO1xufVxuXG5mdW5jdGlvbiBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMobm9kZSwgcnVudGltZUlkLCBzdGFjaykge1xuICB2YXIgY29tcG9uZW50SWQ7XG4gIHZhciBvd25lcklkO1xuICB2YXIgb3duZXJDb21wb25lbnQ7XG4gIHZhciBrZXllZEVsZW1lbnRzO1xuICB2YXIgbmV4dFNpYmxpbmc7XG4gIHZhciBydW50aW1lTGVuZ3RoID0gcnVudGltZUlkLmxlbmd0aDtcbiAgc3RhY2sgPSBzdGFjayB8fCBbXTtcblxuICBub2RlID0gbm9kZS5maXJzdENoaWxkO1xuICB3aGlsZSAobm9kZSkge1xuICAgIG5leHRTaWJsaW5nID0gbm9kZS5uZXh0U2libGluZztcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgLy8gQ29tbWVudCBub2RlXG4gICAgICB2YXIgY29tbWVudFZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICBpZiAoY29tbWVudFZhbHVlLnNsaWNlKDAsIHJ1bnRpbWVMZW5ndGgpID09PSBydW50aW1lSWQpIHtcbiAgICAgICAgdmFyIGZpcnN0Q2hhciA9IGNvbW1lbnRWYWx1ZVtydW50aW1lTGVuZ3RoXTtcblxuICAgICAgICBpZiAoZmlyc3RDaGFyID09PSBcIl5cIiB8fCBmaXJzdENoYXIgPT09IFwiI1wiKSB7XG4gICAgICAgICAgc3RhY2sucHVzaChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChmaXJzdENoYXIgPT09IFwiL1wiKSB7XG4gICAgICAgICAgdmFyIGVuZE5vZGUgPSBub2RlO1xuICAgICAgICAgIHZhciBzdGFydE5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICB2YXIgcm9vdE5vZGU7XG5cbiAgICAgICAgICBpZiAoc3RhcnROb2RlLnBhcmVudE5vZGUgPT09IGVuZE5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgcm9vdE5vZGUgPSBjcmVhdGVGcmFnbWVudE5vZGUoc3RhcnROb2RlLm5leHRTaWJsaW5nLCBlbmROb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm9vdE5vZGUgPSBjcmVhdGVGcmFnbWVudE5vZGUoXG4gICAgICAgICAgICAgIGVuZE5vZGUucGFyZW50Tm9kZS5maXJzdENoaWxkLFxuICAgICAgICAgICAgICBlbmROb2RlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbXBvbmVudElkID0gc3RhcnROb2RlLm5vZGVWYWx1ZS5zdWJzdHJpbmcocnVudGltZUxlbmd0aCArIDEpO1xuICAgICAgICAgIGZpcnN0Q2hhciA9IHN0YXJ0Tm9kZS5ub2RlVmFsdWVbcnVudGltZUxlbmd0aF07XG5cbiAgICAgICAgICBpZiAoZmlyc3RDaGFyID09PSBcIl5cIikge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gY29tcG9uZW50SWQuc3BsaXQoLyAvZyk7XG4gICAgICAgICAgICB2YXIga2V5ID0gcGFydHNbMl07XG4gICAgICAgICAgICBvd25lcklkID0gcGFydHNbMV07XG4gICAgICAgICAgICBjb21wb25lbnRJZCA9IHBhcnRzWzBdO1xuICAgICAgICAgICAgaWYgKChvd25lckNvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFtvd25lcklkXSkpIHtcbiAgICAgICAgICAgICAga2V5ZWRFbGVtZW50cyA9IG93bmVyQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBrZXllZEVsZW1lbnRzID1cbiAgICAgICAgICAgICAgICBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSB8fFxuICAgICAgICAgICAgICAgIChrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSA9IHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gICAgICAgICAgICAgIGtleWVkRWxlbWVudHMsXG4gICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlcnZlckNvbXBvbmVudFJvb3ROb2Rlc1tjb21wb25lbnRJZF0gPSByb290Tm9kZTtcblxuICAgICAgICAgIHN0YXJ0Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0YXJ0Tm9kZSk7XG4gICAgICAgICAgZW5kTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVuZE5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAvLyBIVE1MIGVsZW1lbnQgbm9kZVxuICAgICAgdmFyIG1hcmtvS2V5ID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1hcmtvLWtleVwiKTtcbiAgICAgIHZhciBtYXJrb1Byb3BzID0gY29tcG9uZW50c1V0aWwuX19fZ2V0TWFya29Qcm9wc0Zyb21FbChub2RlKTtcbiAgICAgIGlmIChtYXJrb0tleSkge1xuICAgICAgICB2YXIgc2VwYXJhdG9ySW5kZXggPSBtYXJrb0tleS5pbmRleE9mKFwiIFwiKTtcbiAgICAgICAgb3duZXJJZCA9IG1hcmtvS2V5LnN1YnN0cmluZyhzZXBhcmF0b3JJbmRleCArIDEpO1xuICAgICAgICBtYXJrb0tleSA9IG1hcmtvS2V5LnN1YnN0cmluZygwLCBzZXBhcmF0b3JJbmRleCk7XG4gICAgICAgIGlmICgob3duZXJDb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbb3duZXJJZF0pKSB7XG4gICAgICAgICAga2V5ZWRFbGVtZW50cyA9IG93bmVyQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAga2V5ZWRFbGVtZW50cyA9XG4gICAgICAgICAgICBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSB8fFxuICAgICAgICAgICAgKGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW293bmVySWRdID0ge30pO1xuICAgICAgICB9XG4gICAgICAgIGtleWVkRWxlbWVudHNbbWFya29LZXldID0gbm9kZTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXJrb1Byb3BzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1hcmtvUHJvcHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIGlmIChrZXkuc2xpY2UoMCwgMikgPT09IFwib25cIikge1xuICAgICAgICAgICAgZXZlbnREZWxlZ2F0aW9uLl9fX2FkZERlbGVnYXRlZEV2ZW50SGFuZGxlcihrZXkuc2xpY2UoMikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMobm9kZSwgcnVudGltZUlkLCBzdGFjayk7XG4gICAgfVxuXG4gICAgbm9kZSA9IG5leHRTaWJsaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNvbXBvbmVudEV2ZW50SGFuZGxlcihjb21wb25lbnQsIHRhcmdldE1ldGhvZE5hbWUsIGFyZ3MpIHtcbiAgdmFyIG1ldGhvZCA9IGNvbXBvbmVudFt0YXJnZXRNZXRob2ROYW1lXTtcbiAgaWYgKCFtZXRob2QpIHtcbiAgICB0aHJvdyBFcnJvcihcIk1ldGhvZCBub3QgZm91bmQ6IFwiICsgdGFyZ2V0TWV0aG9kTmFtZSk7XG4gIH1cblxuICBtZXRob2QuYXBwbHkoY29tcG9uZW50LCBhcmdzKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lckhlbHBlcihlbCwgZXZlbnRUeXBlLCBpc09uY2UsIGxpc3RlbmVyKSB7XG4gIHZhciBldmVudExpc3RlbmVyID0gbGlzdGVuZXI7XG4gIGlmIChpc09uY2UpIHtcbiAgICBldmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsaXN0ZW5lcihldmVudCk7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRMaXN0ZW5lcik7XG4gICAgfTtcbiAgfVxuXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudExpc3RlbmVyLCBmYWxzZSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRMaXN0ZW5lcik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkZERPTUV2ZW50TGlzdGVuZXJzKFxuICBjb21wb25lbnQsXG4gIGVsLFxuICBldmVudFR5cGUsXG4gIHRhcmdldE1ldGhvZE5hbWUsXG4gIGlzT25jZSxcbiAgZXh0cmFBcmdzLFxuICBoYW5kbGVzXG4pIHtcbiAgdmFyIHJlbW92ZUxpc3RlbmVyID0gYWRkRXZlbnRMaXN0ZW5lckhlbHBlcihcbiAgICBlbCxcbiAgICBldmVudFR5cGUsXG4gICAgaXNPbmNlLFxuICAgIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZXZlbnQsIGVsXTtcbiAgICAgIGlmIChleHRyYUFyZ3MpIHtcbiAgICAgICAgYXJncyA9IGV4dHJhQXJncy5jb25jYXQoYXJncyk7XG4gICAgICB9XG5cbiAgICAgIGludm9rZUNvbXBvbmVudEV2ZW50SGFuZGxlcihjb21wb25lbnQsIHRhcmdldE1ldGhvZE5hbWUsIGFyZ3MpO1xuICAgIH1cbiAgKTtcbiAgaGFuZGxlcy5wdXNoKHJlbW92ZUxpc3RlbmVyKTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBvbmVudChjb21wb25lbnREZWYsIGhvc3QpIHtcbiAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudERlZi5fX19jb21wb25lbnQ7XG5cbiAgaWYgKCFjb21wb25lbnQgfHwgIWNvbXBvbmVudC5fX19pc0NvbXBvbmVudCkge1xuICAgIHJldHVybjsgLy8gbGVnYWN5XG4gIH1cblxuICBjb21wb25lbnQuX19fcmVzZXQoKTtcbiAgY29tcG9uZW50Ll9fX2hvc3QgPSBob3N0O1xuXG4gIHZhciBpc0V4aXN0aW5nID0gY29tcG9uZW50RGVmLl9fX2lzRXhpc3Rpbmc7XG5cbiAgaWYgKGlzRXhpc3RpbmcpIHtcbiAgICBjb21wb25lbnQuX19fcmVtb3ZlRE9NRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHZhciBkb21FdmVudHMgPSBjb21wb25lbnREZWYuX19fZG9tRXZlbnRzO1xuICBpZiAoZG9tRXZlbnRzKSB7XG4gICAgdmFyIGV2ZW50TGlzdGVuZXJIYW5kbGVzID0gW107XG5cbiAgICBkb21FdmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZG9tRXZlbnRBcmdzKSB7XG4gICAgICAvLyBUaGUgZXZlbnQgbWFwcGluZyBpcyBmb3IgYSBkaXJlY3QgRE9NIGV2ZW50IChub3QgYSBjdXN0b20gZXZlbnQgYW5kIG5vdCBmb3IgYnViYmxpZ24gZG9tIGV2ZW50cylcblxuICAgICAgdmFyIGV2ZW50VHlwZSA9IGRvbUV2ZW50QXJnc1swXTtcbiAgICAgIHZhciB0YXJnZXRNZXRob2ROYW1lID0gZG9tRXZlbnRBcmdzWzFdO1xuICAgICAgdmFyIGV2ZW50RWwgPSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1tkb21FdmVudEFyZ3NbMl1dO1xuICAgICAgdmFyIGlzT25jZSA9IGRvbUV2ZW50QXJnc1szXTtcbiAgICAgIHZhciBleHRyYUFyZ3MgPSBkb21FdmVudEFyZ3NbNF07XG5cbiAgICAgIGFkZERPTUV2ZW50TGlzdGVuZXJzKFxuICAgICAgICBjb21wb25lbnQsXG4gICAgICAgIGV2ZW50RWwsXG4gICAgICAgIGV2ZW50VHlwZSxcbiAgICAgICAgdGFyZ2V0TWV0aG9kTmFtZSxcbiAgICAgICAgaXNPbmNlLFxuICAgICAgICBleHRyYUFyZ3MsXG4gICAgICAgIGV2ZW50TGlzdGVuZXJIYW5kbGVzXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaWYgKGV2ZW50TGlzdGVuZXJIYW5kbGVzLmxlbmd0aCkge1xuICAgICAgY29tcG9uZW50Ll9fX2RvbUV2ZW50TGlzdGVuZXJIYW5kbGVzID0gZXZlbnRMaXN0ZW5lckhhbmRsZXM7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbXBvbmVudC5fX19tb3VudGVkKSB7XG4gICAgY29tcG9uZW50Ll9fX2VtaXRVcGRhdGUoKTtcbiAgfSBlbHNlIHtcbiAgICBjb21wb25lbnQuX19fbW91bnRlZCA9IHRydWU7XG4gICAgY29tcG9uZW50Ll9fX2VtaXRNb3VudCgpO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgdXNlZCB0byBpbml0aWFsaXplZCBjb21wb25lbnRzIGFzc29jaWF0ZWQgd2l0aCBVSSBjb21wb25lbnRzXG4gKiByZW5kZXJlZCBpbiB0aGUgYnJvd3Nlci4gV2hpbGUgcmVuZGVyaW5nIFVJIGNvbXBvbmVudHMgYSBcImNvbXBvbmVudHMgY29udGV4dFwiXG4gKiBpcyBhZGRlZCB0byB0aGUgcmVuZGVyaW5nIGNvbnRleHQgdG8ga2VlcCB1cCB3aXRoIHdoaWNoIGNvbXBvbmVudHMgYXJlIHJlbmRlcmVkLlxuICogV2hlbiByZWFkeSwgdGhlIGNvbXBvbmVudHMgY2FuIHRoZW4gYmUgaW5pdGlhbGl6ZWQgYnkgd2Fsa2luZyB0aGUgY29tcG9uZW50IHRyZWVcbiAqIGluIHRoZSBjb21wb25lbnRzIGNvbnRleHQgKG5lc3RlZCBjb21wb25lbnRzIGFyZSBpbml0aWFsaXplZCBiZWZvcmUgYW5jZXN0b3IgY29tcG9uZW50cykuXG4gKiBAcGFyYW0gIHtBcnJheTxtYXJrby1jb21wb25lbnRzL2xpYi9Db21wb25lbnREZWY+fSBjb21wb25lbnREZWZzIEFuIGFycmF5IG9mIENvbXBvbmVudERlZiBpbnN0YW5jZXNcbiAqL1xuZnVuY3Rpb24gaW5pdENsaWVudFJlbmRlcmVkKGNvbXBvbmVudERlZnMsIGhvc3QpIHtcbiAgaWYgKCFob3N0KSBob3N0ID0gZG9jdW1lbnQ7XG4gIC8vIEVuc3VyZSB0aGF0IGV2ZW50IGhhbmRsZXJzIHRvIGhhbmRsZSBkZWxlZ2F0aW5nIGV2ZW50cyBhcmVcbiAgLy8gYWx3YXlzIGF0dGFjaGVkIGJlZm9yZSBpbml0aWFsaXppbmcgYW55IGNvbXBvbmVudHNcbiAgZXZlbnREZWxlZ2F0aW9uLl9fX2luaXQoaG9zdCk7XG4gIHZhciBsZW4gPSBjb21wb25lbnREZWZzLmxlbmd0aDtcbiAgdmFyIGNvbXBvbmVudERlZjtcbiAgdmFyIGk7XG5cbiAgZm9yIChpID0gbGVuOyBpLS07ICkge1xuICAgIGNvbXBvbmVudERlZiA9IGNvbXBvbmVudERlZnNbaV07XG4gICAgdHJhY2tDb21wb25lbnQoY29tcG9uZW50RGVmKTtcbiAgfVxuXG4gIGZvciAoaSA9IGxlbjsgaS0tOyApIHtcbiAgICBjb21wb25lbnREZWYgPSBjb21wb25lbnREZWZzW2ldO1xuICAgIGluaXRDb21wb25lbnQoY29tcG9uZW50RGVmLCBob3N0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGluaXRpYWxpemVzIGFsbCBjb21wb25lbnRzIHRoYXQgd2VyZSByZW5kZXJlZCBvbiB0aGUgc2VydmVyIGJ5IGl0ZXJhdGluZyBvdmVyIGFsbFxuICogb2YgdGhlIGNvbXBvbmVudCBJRHMuXG4gKi9cbmZ1bmN0aW9uIGluaXRTZXJ2ZXJSZW5kZXJlZChyZW5kZXJlZENvbXBvbmVudHMsIGhvc3QpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgcmVuZGVyZWRDb21wb25lbnRzO1xuICB2YXIgZ2xvYmFsS2V5ID0gXCIkXCI7XG4gIHZhciBydW50aW1lSWQ7XG5cbiAgaWYgKHR5cGUgIT09IFwib2JqZWN0XCIpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcnVudGltZUlkID0gcmVuZGVyZWRDb21wb25lbnRzO1xuICAgICAgZ2xvYmFsS2V5ICs9IHJ1bnRpbWVJZCArIFwiX0NcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2xvYmFsS2V5ICs9IChydW50aW1lSWQgPSBERUZBVUxUX1JVTlRJTUVfSUQpICsgXCJDXCI7XG4gICAgfVxuXG4gICAgcmVuZGVyZWRDb21wb25lbnRzID0gd2luW2dsb2JhbEtleV07XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgaWYgKFxuICAgICAgICByZW5kZXJlZENvbXBvbmVudHMgJiZcbiAgICAgICAgcmVuZGVyZWRDb21wb25lbnRzLmkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICByZW5kZXJlZENvbXBvbmVudHMuaSAhPT0gY29tcG9uZW50c1V0aWwuX19fcnVudGltZUlkXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiTXVsdGlwbGUgaW5zdGFuY2VzIG9mIE1hcmtvIGhhdmUgYXR0YWNoZWQgdG8gdGhlIHNhbWUgcnVudGltZSBpZC4gVGhpcyBjb3VsZCBtZWFuIHRoYXQgbW9yZSB0aGFuIG9uZSBjb3B5IG9mIE1hcmtvIGlzIGxvYWRlZCBvbiB0aGUgcGFnZSwgb3IgdGhhdCB0aGUgc2NyaXB0IGNvbnRhaW5pbmcgTWFya28gaGFzIGV4ZWN1dGVkIG1vcmUgdGhhbiBvbmNlLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGZha2VBcnJheSA9ICh3aW5bZ2xvYmFsS2V5XSA9IHtcbiAgICAgIHI6IHJ1bnRpbWVJZCxcbiAgICAgIGNvbmNhdDogaW5pdFNlcnZlclJlbmRlcmVkLFxuICAgIH0pO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGZha2VBcnJheS5pID0gY29tcG9uZW50c1V0aWwuX19fcnVudGltZUlkO1xuICAgIH1cblxuICAgIGlmIChyZW5kZXJlZENvbXBvbmVudHMgJiYgcmVuZGVyZWRDb21wb25lbnRzLmZvckVhY2gpIHtcbiAgICAgIHJlbmRlcmVkQ29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChyZW5kZXJlZENvbXBvbmVudCkge1xuICAgICAgICBmYWtlQXJyYXkuY29uY2F0KHJlbmRlcmVkQ29tcG9uZW50KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWtlQXJyYXk7XG4gIH1cblxuICB2YXIgaXNGcm9tU2VyaWFsaXplZEdsb2JhbHMgPSB0aGlzLmNvbmNhdCA9PT0gaW5pdFNlcnZlclJlbmRlcmVkO1xuICByZW5kZXJlZENvbXBvbmVudHMgPSB3YXJwMTBGaW5hbGl6ZShyZW5kZXJlZENvbXBvbmVudHMpO1xuXG4gIGlmIChpc0Zyb21TZXJpYWxpemVkR2xvYmFscykge1xuICAgIHJ1bnRpbWVJZCA9IHRoaXMucjtcbiAgICBob3N0ID0gZG9jdW1lbnQ7XG4gIH0gZWxzZSB7XG4gICAgcnVudGltZUlkID0gcmVuZGVyZWRDb21wb25lbnRzLnIgfHwgREVGQVVMVF9SVU5USU1FX0lEO1xuICAgIGlmICghaG9zdCkgaG9zdCA9IGRvY3VtZW50O1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICBcIlBhc3Npbmcgc2VyaWFsaXplZCBkYXRhIHRvIGByZXF1aXJlKCdtYXJrby9jb21wb25lbnRzKS5pbml0YCBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkIHNldCAnJGdsb2JhbC5ydW50aW1lSWQnIGFuZCBwcm92aWRlIHRoZSAncnVudGltZUlkJyBvcHRpb24gdG8geW91ciBNYXJrbyBidW5kbGVyIHBsdWdpbi5cIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBpZiAoaG9zdCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICBcIlBhc3NpbmcgYSBkb2N1bWVudCBvdGhlciB0aGFuIHRoZSBjdXJyZW50IGRvY3VtZW50IHRvIGByZXF1aXJlKCdtYXJrby9jb21wb25lbnRzKS5pbml0YCBpcyBkZXByZWNhdGVkLlwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcmVmaXggPSByZW5kZXJlZENvbXBvbmVudHMucCB8fCBcIlwiO1xuICB2YXIgbWV0YSA9IHNlcnZlclJlbmRlcmVkTWV0YVtwcmVmaXhdO1xuICB2YXIgaXNMYXN0ID0gcmVuZGVyZWRDb21wb25lbnRzLmw7XG5cbiAgaWYgKG1ldGEpIHtcbiAgICBpZiAoaXNMYXN0KSB7XG4gICAgICBkZWxldGUgc2VydmVyUmVuZGVyZWRNZXRhW3ByZWZpeF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1ldGEgPSB7fTtcblxuICAgIGlmICghaXNMYXN0KSB7XG4gICAgICBzZXJ2ZXJSZW5kZXJlZE1ldGFbcHJlZml4XSA9IG1ldGE7XG4gICAgfVxuICB9XG5cbiAgLy8gRW5zdXJlIHRoYXQgZXZlbnQgaGFuZGxlcnMgdG8gaGFuZGxlIGRlbGVnYXRpbmcgZXZlbnRzIGFyZVxuICAvLyBhbHdheXMgYXR0YWNoZWQgYmVmb3JlIGluaXRpYWxpemluZyBhbnkgY29tcG9uZW50c1xuICBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMoaG9zdCwgcnVudGltZUlkKTtcbiAgZXZlbnREZWxlZ2F0aW9uLl9fX2luaXQoaG9zdCk7XG5cbiAgaWYgKHJlbmRlcmVkQ29tcG9uZW50cy5nKSB7XG4gICAgbWV0YS5fX19nbG9iYWxzID0gcmVuZGVyZWRDb21wb25lbnRzLmc7XG4gIH1cblxuICBpZiAocmVuZGVyZWRDb21wb25lbnRzLnQpIHtcbiAgICBtZXRhLl9fX3R5cGVzID0gbWV0YS5fX190eXBlc1xuICAgICAgPyBtZXRhLl9fX3R5cGVzLmNvbmNhdChyZW5kZXJlZENvbXBvbmVudHMudClcbiAgICAgIDogcmVuZGVyZWRDb21wb25lbnRzLnQ7XG4gIH1cblxuICAvLyBoeWRyYXRlIGNvbXBvbmVudHMgdG9wIGRvd24gKGxlYWYgbm9kZXMgbGFzdClcbiAgLy8gYW5kIHJldHVybiBhbiBhcnJheSBvZiBmdW5jdGlvbnMgdG8gbW91bnQgdGhlc2UgY29tcG9uZW50c1xuICAocmVuZGVyZWRDb21wb25lbnRzLncgfHwgW10pXG4gICAgLm1hcChmdW5jdGlvbiAoY29tcG9uZW50RGVmKSB7XG4gICAgICB2YXIgdHlwZU5hbWUgPSBtZXRhLl9fX3R5cGVzW2NvbXBvbmVudERlZlsxXV07XG5cbiAgICAgIHJldHVybiByZWdpc3RlcmVkW3R5cGVOYW1lXSB8fFxuICAgICAgICBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHxcbiAgICAgICAgcmVxLmUodHlwZU5hbWUpXG4gICAgICAgID8gdHJ5SHlkcmF0ZUNvbXBvbmVudChjb21wb25lbnREZWYsIG1ldGEsIGhvc3QsIHJ1bnRpbWVJZClcbiAgICAgICAgOiBhZGRQZW5kaW5nRGVmKGNvbXBvbmVudERlZiwgdHlwZU5hbWUsIG1ldGEsIGhvc3QsIHJ1bnRpbWVJZCk7XG4gICAgfSlcbiAgICAucmV2ZXJzZSgpXG4gICAgLmZvckVhY2godHJ5SW52b2tlKTtcblxuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gdHJ5SHlkcmF0ZUNvbXBvbmVudChyYXdEZWYsIG1ldGEsIGhvc3QsIHJ1bnRpbWVJZCkge1xuICB2YXIgY29tcG9uZW50RGVmID0gQ29tcG9uZW50RGVmLl9fX2Rlc2VyaWFsaXplKFxuICAgIHJhd0RlZixcbiAgICBtZXRhLl9fX3R5cGVzLFxuICAgIG1ldGEuX19fZ2xvYmFscyxcbiAgICBleHBvcnRzXG4gICk7XG4gIHZhciBtb3VudCA9IGh5ZHJhdGVDb21wb25lbnRBbmRHZXRNb3VudChjb21wb25lbnREZWYsIGhvc3QpO1xuXG4gIGlmICghbW91bnQpIHtcbiAgICAvLyBoeWRyYXRlQ29tcG9uZW50QW5kR2V0TW91bnQgd2lsbCByZXR1cm4gZmFsc2UgaWYgdGhlcmUgaXMgbm90IHJvb3ROb2RlXG4gICAgLy8gZm9yIHRoZSBjb21wb25lbnQuICBJZiB0aGlzIGlzIHRoZSBjYXNlLCB3ZSdsbCB3YWl0IHVudGlsIHRoZVxuICAgIC8vIERPTSBoYXMgZnVsbHkgbG9hZGVkIHRvIGF0dGVtcHQgdG8gaW5pdCB0aGUgY29tcG9uZW50IGFnYWluLlxuICAgIGlmIChkZWZlcnJlZERlZnMpIHtcbiAgICAgIGRlZmVycmVkRGVmcy5wdXNoKGNvbXBvbmVudERlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVycmVkRGVmcyA9IFtjb21wb25lbnREZWZdO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpbmRleFNlcnZlckNvbXBvbmVudEJvdW5kYXJpZXMoaG9zdCwgcnVudGltZUlkKTtcbiAgICAgICAgZGVmZXJyZWREZWZzXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoY29tcG9uZW50RGVmKSB7XG4gICAgICAgICAgICByZXR1cm4gaHlkcmF0ZUNvbXBvbmVudEFuZEdldE1vdW50KGNvbXBvbmVudERlZiwgaG9zdCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgLmZvckVhY2godHJ5SW52b2tlKTtcbiAgICAgICAgZGVmZXJyZWREZWZzLmxlbmd0aCA9IDA7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbW91bnQ7XG59XG5cbmZ1bmN0aW9uIGh5ZHJhdGVDb21wb25lbnRBbmRHZXRNb3VudChjb21wb25lbnREZWYsIGhvc3QpIHtcbiAgdmFyIGNvbXBvbmVudElkID0gY29tcG9uZW50RGVmLmlkO1xuICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudDtcbiAgdmFyIHJvb3ROb2RlID0gc2VydmVyQ29tcG9uZW50Um9vdE5vZGVzW2NvbXBvbmVudElkXTtcbiAgdmFyIHJlbmRlclJlc3VsdDtcblxuICBpZiAocm9vdE5vZGUpIHtcbiAgICBkZWxldGUgc2VydmVyQ29tcG9uZW50Um9vdE5vZGVzW2NvbXBvbmVudElkXTtcblxuICAgIGNvbXBvbmVudC5fX19yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgIGNvbXBvbmVudHNCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBjb21wb25lbnQpO1xuXG4gICAgaWYgKGNvbXBvbmVudERlZi5fX19mbGFncyAmIEZMQUdfV0lMTF9SRVJFTkRFUl9JTl9CUk9XU0VSKSB7XG4gICAgICBjb21wb25lbnQuX19faG9zdCA9IGhvc3Q7XG4gICAgICByZW5kZXJSZXN1bHQgPSBjb21wb25lbnQuX19fcmVyZW5kZXIoY29tcG9uZW50Ll9fX2lucHV0LCB0cnVlKTtcbiAgICAgIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZik7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgICAgIHJlbmRlclJlc3VsdC5hZnRlckluc2VydChob3N0KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgICAgaW5pdENvbXBvbmVudChjb21wb25lbnREZWYsIGhvc3QpO1xuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhY2tDb21wb25lbnQoY29tcG9uZW50RGVmKSB7XG4gIHZhciBjb21wb25lbnQgPSBjb21wb25lbnREZWYuX19fY29tcG9uZW50O1xuICBpZiAoY29tcG9uZW50KSB7XG4gICAgY29tcG9uZW50TG9va3VwW2NvbXBvbmVudC5pZF0gPSBjb21wb25lbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5SW52b2tlKGZuKSB7XG4gIGlmIChmbikgZm4oKTtcbn1cblxuZXhwb3J0cy5yID0gcmVnaXN0ZXI7XG5leHBvcnRzLl9fX2NyZWF0ZUNvbXBvbmVudCA9IGNyZWF0ZUNvbXBvbmVudDtcbmV4cG9ydHMuX19fZ2V0Q29tcG9uZW50Q2xhc3MgPSBnZXRDb21wb25lbnRDbGFzcztcbmV4cG9ydHMuX19faW5pdFNlcnZlclJlbmRlcmVkID0gd2luLiRpbml0Q29tcG9uZW50cyA9IGluaXRTZXJ2ZXJSZW5kZXJlZDtcblxucmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnRzQ29udGV4dFwiKS5fX19pbml0Q2xpZW50UmVuZGVyZWQgPVxuICBpbml0Q2xpZW50UmVuZGVyZWQ7XG4iLCJ2YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgY29tcG9uZW50c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIGtleXNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2tleUJ5RE9NTm9kZTtcbnZhciB2RWxlbWVudHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZFbGVtZW50QnlET01Ob2RlO1xudmFyIHZQcm9wc0J5RE9NTm9kZSA9IGRvbURhdGEuX19fdlByb3BzQnlET01Ob2RlO1xudmFyIG1hcmtvVUlEID0gd2luZG93LiRNVUlEIHx8ICh3aW5kb3cuJE1VSUQgPSB7IGk6IDAgfSk7XG52YXIgcnVudGltZUlkID0gbWFya29VSUQuaSsrO1xuXG52YXIgY29tcG9uZW50TG9va3VwID0ge307XG5cbnZhciBFTVBUWV9PQkpFQ1QgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50Rm9yRWwoZWwsIGhvc3QpIHtcbiAgdmFyIG5vZGUgPVxuICAgIHR5cGVvZiBlbCA9PSBcInN0cmluZ1wiXG4gICAgICA/ICgoaG9zdCA/IGhvc3Qub3duZXJEb2N1bWVudCA6IGhvc3QpIHx8IGRvY3VtZW50KS5nZXRFbGVtZW50QnlJZChlbClcbiAgICAgIDogZWw7XG4gIHZhciBjb21wb25lbnQ7XG4gIHZhciB2RWxlbWVudDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGlmIChub2RlLmZyYWdtZW50KSB7XG4gICAgICBpZiAobm9kZS5mcmFnbWVudC5lbmROb2RlID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmZyYWdtZW50LnN0YXJ0Tm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmZyYWdtZW50O1xuICAgICAgICBjb21wb25lbnQgPSBjb21wb25lbnRzQnlET01Ob2RlLmdldChub2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCh2RWxlbWVudCA9IHZFbGVtZW50c0J5RE9NTm9kZS5nZXQobm9kZSkpKSB7XG4gICAgICBjb21wb25lbnQgPSB2RWxlbWVudC5fX19vd25lckNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cblxuICAgIG5vZGUgPSBub2RlLnByZXZpb3VzU2libGluZyB8fCBub2RlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVzdHJveUNvbXBvbmVudEZvck5vZGUobm9kZSkge1xuICB2YXIgY29tcG9uZW50VG9EZXN0cm95ID0gY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZS5mcmFnbWVudCB8fCBub2RlKTtcbiAgaWYgKGNvbXBvbmVudFRvRGVzdHJveSkge1xuICAgIGNvbXBvbmVudFRvRGVzdHJveS5fX19kZXN0cm95U2hhbGxvdygpO1xuICAgIGRlbGV0ZSBjb21wb25lbnRMb29rdXBbY29tcG9uZW50VG9EZXN0cm95LmlkXTtcbiAgfVxufVxuZnVuY3Rpb24gZGVzdHJveU5vZGVSZWN1cnNpdmUobm9kZSwgY29tcG9uZW50KSB7XG4gIGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlKG5vZGUpO1xuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSAxMikge1xuICAgIHZhciBrZXk7XG5cbiAgICBpZiAoY29tcG9uZW50ICYmIChrZXkgPSBrZXlzQnlET01Ob2RlLmdldChub2RlKSkpIHtcbiAgICAgIGlmIChub2RlID09PSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1trZXldKSB7XG4gICAgICAgIGlmIChjb21wb25lbnRzQnlET01Ob2RlLmdldChub2RlKSAmJiAvXFxbXFxdJC8udGVzdChrZXkpKSB7XG4gICAgICAgICAgZGVsZXRlIGNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2tleV1bXG4gICAgICAgICAgICBjb21wb25lbnRzQnlET01Ob2RlLmdldChub2RlKS5pZFxuICAgICAgICAgIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgd2hpbGUgKGN1ckNoaWxkICYmIGN1ckNoaWxkICE9PSBub2RlLmVuZE5vZGUpIHtcbiAgICAgIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKGN1ckNoaWxkLCBjb21wb25lbnQpO1xuICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbmV4dENvbXBvbmVudElkKCkge1xuICAvLyBFYWNoIGNvbXBvbmVudCB3aWxsIGdldCBhbiBJRCB0aGF0IGlzIHVuaXF1ZSBhY3Jvc3MgYWxsIGxvYWRlZFxuICAvLyBtYXJrbyBydW50aW1lcy4gVGhpcyBhbGxvd3MgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIG1hcmtvIHRvIGJlXG4gIC8vIGxvYWRlZCBpbiB0aGUgc2FtZSB3aW5kb3cgYW5kIHRoZXkgc2hvdWxkIGFsbCBwbGFjZSBuaWNlXG4gIC8vIHRvZ2V0aGVyXG4gIHJldHVybiBcImNcIiArIG1hcmtvVUlELmkrKztcbn1cblxuZnVuY3Rpb24gbmV4dENvbXBvbmVudElkUHJvdmlkZXIoKSB7XG4gIHJldHVybiBuZXh0Q29tcG9uZW50SWQ7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaEJ1YmJsaW5nRXZlbnQoXG4gIGNvbXBvbmVudERlZixcbiAgaGFuZGxlck1ldGhvZE5hbWUsXG4gIGlzT25jZSxcbiAgZXh0cmFBcmdzXG4pIHtcbiAgaWYgKGhhbmRsZXJNZXRob2ROYW1lKSB7XG4gICAgdmFyIGNvbXBvbmVudElkID0gY29tcG9uZW50RGVmLmlkO1xuICAgIGlmIChleHRyYUFyZ3MpIHtcbiAgICAgIHJldHVybiBbaGFuZGxlck1ldGhvZE5hbWUsIGNvbXBvbmVudElkLCBpc09uY2UsIGV4dHJhQXJnc107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbaGFuZGxlck1ldGhvZE5hbWUsIGNvbXBvbmVudElkLCBpc09uY2VdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRNYXJrb1Byb3BzRnJvbUVsKGVsKSB7XG4gIHZhciB2RWxlbWVudCA9IHZFbGVtZW50c0J5RE9NTm9kZS5nZXQoZWwpO1xuICB2YXIgdmlydHVhbFByb3BzO1xuXG4gIGlmICh2RWxlbWVudCkge1xuICAgIHZpcnR1YWxQcm9wcyA9IHZFbGVtZW50Ll9fX3Byb3BlcnRpZXM7XG4gIH0gZWxzZSB7XG4gICAgdmlydHVhbFByb3BzID0gdlByb3BzQnlET01Ob2RlLmdldChlbCk7XG4gICAgaWYgKCF2aXJ0dWFsUHJvcHMpIHtcbiAgICAgIHZpcnR1YWxQcm9wcyA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtbWFya29cIik7XG4gICAgICB2UHJvcHNCeURPTU5vZGUuc2V0KFxuICAgICAgICBlbCxcbiAgICAgICAgKHZpcnR1YWxQcm9wcyA9IHZpcnR1YWxQcm9wcyA/IEpTT04ucGFyc2UodmlydHVhbFByb3BzKSA6IEVNUFRZX09CSkVDVClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZpcnR1YWxQcm9wcztcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29tcG9uZW50S2V5KGtleSwgcGFyZW50SWQpIHtcbiAgaWYgKGtleVswXSA9PT0gXCIjXCIpIHtcbiAgICBrZXkgPSBrZXkucmVwbGFjZShcIiNcIiArIHBhcmVudElkICsgXCItXCIsIFwiXCIpO1xuICB9XG4gIHJldHVybiBrZXk7XG59XG5cbmZ1bmN0aW9uIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gIGtleWVkRWxlbWVudHMsXG4gIGtleSxcbiAgcm9vdE5vZGUsXG4gIGNvbXBvbmVudElkXG4pIHtcbiAgaWYgKC9cXFtcXF0kLy50ZXN0KGtleSkpIHtcbiAgICB2YXIgcmVwZWF0ZWRFbGVtZW50c0ZvcktleSA9IChrZXllZEVsZW1lbnRzW2tleV0gPVxuICAgICAga2V5ZWRFbGVtZW50c1trZXldIHx8IHt9KTtcbiAgICByZXBlYXRlZEVsZW1lbnRzRm9yS2V5W2NvbXBvbmVudElkXSA9IHJvb3ROb2RlO1xuICB9IGVsc2Uge1xuICAgIGtleWVkRWxlbWVudHNba2V5XSA9IHJvb3ROb2RlO1xuICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbmlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgdmFyIHdhcm5Ob2RlUmVtb3ZlZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBmcmFnbWVudCA9IGV2ZW50LnRhcmdldC5mcmFnbWVudDtcbiAgICBpZiAoZnJhZ21lbnQpIHtcbiAgICAgIHZhciBiYXNlRXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgIFwiRnJhZ21lbnQgYm91bmRhcnkgbWFya2VyIHJlbW92ZWQuICBUaGlzIHdpbGwgY2F1c2UgYW4gZXJyb3Igd2hlbiB0aGUgZnJhZ21lbnQgaXMgdXBkYXRlZC5cIlxuICAgICAgKTtcbiAgICAgIGZyYWdtZW50Ll9fX21hcmtlcnNSZW1vdmVkRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSArIFwiIEJvdW5kYXJ5IG1hcmtlcnMgbWlzc2luZy5cIik7XG5cbiAgICAgICAgYmFzZUVycm9yLnN0YWNrID0gYmFzZUVycm9yLnN0YWNrLnJlcGxhY2UoLy4qd2Fybk5vZGVSZW1vdmVkLipcXG4vLCBcIlwiKTtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLndhcm4oYmFzZUVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG4gIGV4cG9ydHMuX19fc3RhcnRET01NYW5pcHVsYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKGhvc3QpIHtcbiAgICBob3N0LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLCB3YXJuTm9kZVJlbW92ZWQpO1xuICB9O1xuICBleHBvcnRzLl9fX3N0b3BET01NYW5pcHVsYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKGhvc3QpIHtcbiAgICBob3N0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLCB3YXJuTm9kZVJlbW92ZWQpO1xuICB9O1xufVxuXG5leHBvcnRzLl9fX3J1bnRpbWVJZCA9IHJ1bnRpbWVJZDtcbmV4cG9ydHMuX19fY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50TG9va3VwO1xuZXhwb3J0cy5fX19nZXRDb21wb25lbnRGb3JFbCA9IGdldENvbXBvbmVudEZvckVsO1xuZXhwb3J0cy5fX19kZXN0cm95Q29tcG9uZW50Rm9yTm9kZSA9IGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlO1xuZXhwb3J0cy5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZSA9IGRlc3Ryb3lOb2RlUmVjdXJzaXZlO1xuZXhwb3J0cy5fX19uZXh0Q29tcG9uZW50SWRQcm92aWRlciA9IG5leHRDb21wb25lbnRJZFByb3ZpZGVyO1xuZXhwb3J0cy5fX19hdHRhY2hCdWJibGluZ0V2ZW50ID0gYXR0YWNoQnViYmxpbmdFdmVudDtcbmV4cG9ydHMuX19fZ2V0TWFya29Qcm9wc0Zyb21FbCA9IGdldE1hcmtvUHJvcHNGcm9tRWw7XG5leHBvcnRzLl9fX2FkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMgPSBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzO1xuZXhwb3J0cy5fX19ub3JtYWxpemVDb21wb25lbnRLZXkgPSBub3JtYWxpemVDb21wb25lbnRLZXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmxvYWQuZSA9IGV4aXN0cztcbm1vZHVsZS5leHBvcnRzID0gbG9hZDtcblxuZnVuY3Rpb24gbG9hZChpZCkge1xuICByZXR1cm4gaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyhpZCkpO1xufVxuXG5mdW5jdGlvbiBleGlzdHMoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJvcFJlcXVpcmUobW9kKSB7XG4gIHJldHVybiBtb2QuZGVmYXVsdCB8fCBtb2Q7XG59XG4iLCJ2YXIgcXVldWUgPSBbXTtcbnZhciBtc2cgPSBcIlwiICsgTWF0aC5yYW5kb20oKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXYpIHtcbiAgaWYgKGV2LmRhdGEgPT09IG1zZykge1xuICAgIHZhciBjYWxsYmFja3MgPSBxdWV1ZTtcbiAgICBxdWV1ZSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYWxsYmFja3NbaV0oKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5leHBvcnRzLl9fX3NldEltbWVkaWF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAocXVldWUucHVzaChjYWxsYmFjaykgPT09IDEpIHtcbiAgICB3aW5kb3cucG9zdE1lc3NhZ2UobXNnLCBcIipcIik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19fcXVldWVNaWNyb3Rhc2sgPSByZXF1aXJlKFwiLi9xdWV1ZU1pY3JvdGFza1wiKTtcbiIsInZhciBwcm9taXNlO1xubW9kdWxlLmV4cG9ydHMgPVxuICB0eXBlb2YgcXVldWVNaWNyb3Rhc2sgPT09IFwiZnVuY3Rpb25cIlxuICAgID8gcXVldWVNaWNyb3Rhc2tcbiAgICA6ICgocHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpKSxcbiAgICAgIGZ1bmN0aW9uIChjYikge1xuICAgICAgICBwcm9taXNlLnRoZW4oY2IpO1xuICAgICAgfSk7XG4iLCJ2YXIgZG9tSW5zZXJ0ID0gcmVxdWlyZShcIi4vZG9tLWluc2VydFwiKTtcbnZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG5cbmZ1bmN0aW9uIGdldFJvb3ROb2RlKGVsKSB7XG4gIHZhciBjdXIgPSBlbDtcbiAgd2hpbGUgKGN1ci5wYXJlbnROb2RlKSBjdXIgPSBjdXIucGFyZW50Tm9kZTtcbiAgcmV0dXJuIGN1cjtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50RGVmcyhyZXN1bHQpIHtcbiAgdmFyIGNvbXBvbmVudERlZnMgPSByZXN1bHQuX19fY29tcG9uZW50cztcblxuICBpZiAoIWNvbXBvbmVudERlZnMpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vIGNvbXBvbmVudFwiKTtcbiAgfVxuICByZXR1cm4gY29tcG9uZW50RGVmcztcbn1cblxuZnVuY3Rpb24gUmVuZGVyUmVzdWx0KG91dCkge1xuICB0aGlzLm91dCA9IHRoaXMuX19fb3V0ID0gb3V0O1xuICB0aGlzLl9fX2NvbXBvbmVudHMgPSB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyUmVzdWx0O1xuXG52YXIgcHJvdG8gPSAoUmVuZGVyUmVzdWx0LnByb3RvdHlwZSA9IHtcbiAgZ2V0Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29tcG9uZW50cygpWzBdO1xuICB9LFxuICBnZXRDb21wb25lbnRzOiBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICBpZiAodGhpcy5fX19jb21wb25lbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiTm90IGFkZGVkIHRvIERPTVwiKTtcbiAgICB9XG5cbiAgICB2YXIgY29tcG9uZW50RGVmcyA9IGdldENvbXBvbmVudERlZnModGhpcyk7XG5cbiAgICB2YXIgY29tcG9uZW50cyA9IFtdO1xuXG4gICAgY29tcG9uZW50RGVmcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21wb25lbnREZWYpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnREZWYuX19fY29tcG9uZW50O1xuICAgICAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3Rvcihjb21wb25lbnQpKSB7XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gIH0sXG5cbiAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIG91dCA9IHRoaXMuX19fb3V0O1xuICAgIHZhciBjb21wb25lbnRzQ29udGV4dCA9IG91dC5fX19jb21wb25lbnRzO1xuICAgIGlmIChjb21wb25lbnRzQ29udGV4dCkge1xuICAgICAgdGhpcy5fX19jb21wb25lbnRzID0gY29tcG9uZW50c0NvbnRleHQuX19faW5pdENvbXBvbmVudHMoaG9zdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19fY29tcG9uZW50cyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGdldE5vZGU6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgcmV0dXJuIHRoaXMuX19fb3V0Ll9fX2dldE5vZGUoaG9zdCk7XG4gIH0sXG4gIGdldE91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX291dC5fX19nZXRPdXRwdXQoKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19vdXQudG9TdHJpbmcoKTtcbiAgfSxcbiAgZG9jdW1lbnQ6IHR5cGVvZiBkb2N1bWVudCA9PT0gXCJvYmplY3RcIiAmJiBkb2N1bWVudCxcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIFwiaHRtbFwiLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgJ1RoZSBcImh0bWxcIiBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIFwidG9TdHJpbmdcIiBpbnN0ZWFkLicsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICB9LFxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgXCJjb250ZXh0XCIsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICAnVGhlIFwiY29udGV4dFwiIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgXCJvdXRcIiBpbnN0ZWFkLicsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX19vdXQ7XG4gIH0sXG59KTtcblxuLy8gQWRkIGFsbCBvZiB0aGUgZm9sbG93aW5nIERPTSBtZXRob2RzIHRvIENvbXBvbmVudC5wcm90b3R5cGU6XG4vLyAtIGFwcGVuZFRvKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlQ2hpbGRyZW5PZihyZWZlcmVuY2VFbClcbi8vIC0gaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUVsKVxuLy8gLSBpbnNlcnRBZnRlcihyZWZlcmVuY2VFbClcbi8vIC0gcHJlcGVuZFRvKHJlZmVyZW5jZUVsKVxuZG9tSW5zZXJ0KFxuICBwcm90byxcbiAgZnVuY3Rpb24gZ2V0RWwocmVuZGVyUmVzdWx0LCByZWZlcmVuY2VFbCkge1xuICAgIHJldHVybiByZW5kZXJSZXN1bHQuZ2V0Tm9kZShnZXRSb290Tm9kZShyZWZlcmVuY2VFbCkpO1xuICB9LFxuICBmdW5jdGlvbiBhZnRlckluc2VydChyZW5kZXJSZXN1bHQsIHJlZmVyZW5jZUVsKSB7XG4gICAgcmV0dXJuIHJlbmRlclJlc3VsdC5hZnRlckluc2VydChnZXRSb290Tm9kZShyZWZlcmVuY2VFbCkpO1xuICB9LFxuKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoganNoaW50IG5ld2NhcDpmYWxzZSAqL1xuXG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHMtbGlnaHRcIik7XG52YXIgU3Vic2NyaXB0aW9uVHJhY2tlciA9IHJlcXVpcmUoXCJsaXN0ZW5lci10cmFja2VyXCIpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGNvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBkZXN0cm95Tm9kZVJlY3Vyc2l2ZSA9IGNvbXBvbmVudHNVdGlsLl9fX2Rlc3Ryb3lOb2RlUmVjdXJzaXZlO1xudmFyIGRlZmF1bHRDcmVhdGVPdXQgPSByZXF1aXJlKFwiLi4vY3JlYXRlT3V0XCIpO1xudmFyIGRvbUluc2VydCA9IHJlcXVpcmUoXCIuLi9kb20taW5zZXJ0XCIpO1xudmFyIFJlbmRlclJlc3VsdCA9IHJlcXVpcmUoXCIuLi9SZW5kZXJSZXN1bHRcIik7XG52YXIgbW9ycGhkb20gPSByZXF1aXJlKFwiLi4vdmRvbS9tb3JwaGRvbVwiKTtcbnZhciBnZXRDb21wb25lbnRzQ29udGV4dCA9XG4gIHJlcXVpcmUoXCIuL0NvbXBvbmVudHNDb250ZXh0XCIpLl9fX2dldENvbXBvbmVudHNDb250ZXh0O1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi9kb20tZGF0YVwiKTtcbnZhciBldmVudERlbGVnYXRpb24gPSByZXF1aXJlKFwiLi9ldmVudC1kZWxlZ2F0aW9uXCIpO1xudmFyIHVwZGF0ZU1hbmFnZXIgPSByZXF1aXJlKFwiLi91cGRhdGUtbWFuYWdlclwiKTtcbnZhciBjb21wb25lbnRzQnlET01Ob2RlID0gZG9tRGF0YS5fX19jb21wb25lbnRCeURPTU5vZGU7XG52YXIga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWQgPSBkb21EYXRhLl9fX3NzcktleWVkRWxlbWVudHNCeUNvbXBvbmVudElkO1xudmFyIENPTlRFWFRfS0VZID0gXCJfX3N1YnRyZWVfY29udGV4dF9fXCI7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnZhciBDT01QT05FTlRfU1VCU0NSSUJFX1RPX09QVElPTlM7XG52YXIgTk9OX0NPTVBPTkVOVF9TVUJTQ1JJQkVfVE9fT1BUSU9OUyA9IHtcbiAgYWRkRGVzdHJveUxpc3RlbmVyOiBmYWxzZSxcbn07XG5cbnZhciBlbWl0ID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0O1xudmFyIEVMRU1FTlRfTk9ERSA9IDE7XG5cbmZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHJlbW92ZUV2ZW50TGlzdGVuZXJIYW5kbGUpIHtcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lckhhbmRsZSgpO1xufVxuXG5mdW5jdGlvbiB3YWxrRnJhZ21lbnRzKGZyYWdtZW50KSB7XG4gIHZhciBub2RlO1xuXG4gIHdoaWxlIChmcmFnbWVudCkge1xuICAgIG5vZGUgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG4gICAgaWYgKCFub2RlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBmcmFnbWVudCA9IG5vZGUuZnJhZ21lbnQ7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ3VzdG9tRXZlbnRXaXRoTWV0aG9kTGlzdGVuZXIoXG4gIGNvbXBvbmVudCxcbiAgdGFyZ2V0TWV0aG9kTmFtZSxcbiAgYXJncyxcbiAgZXh0cmFBcmdzLFxuKSB7XG4gIC8vIFJlbW92ZSB0aGUgXCJldmVudFR5cGVcIiBhcmd1bWVudFxuICBhcmdzLnB1c2goY29tcG9uZW50KTtcblxuICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgYXJncyA9IGV4dHJhQXJncy5jb25jYXQoYXJncyk7XG4gIH1cblxuICB2YXIgdGFyZ2V0Q29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW2NvbXBvbmVudC5fX19zY29wZV07XG4gIHZhciB0YXJnZXRNZXRob2QgPVxuICAgIHR5cGVvZiB0YXJnZXRNZXRob2ROYW1lID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gdGFyZ2V0TWV0aG9kTmFtZVxuICAgICAgOiB0YXJnZXRDb21wb25lbnRbdGFyZ2V0TWV0aG9kTmFtZV07XG4gIGlmICghdGFyZ2V0TWV0aG9kKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJNZXRob2Qgbm90IGZvdW5kOiBcIiArIHRhcmdldE1ldGhvZE5hbWUpO1xuICB9XG5cbiAgdGFyZ2V0TWV0aG9kLmFwcGx5KHRhcmdldENvbXBvbmVudCwgYXJncyk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCkge1xuICByZXR1cm4gaW5kZXggPyBrZXkgKyBcIl9cIiArIGluZGV4IDoga2V5O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29tcG9uZW50SWRIZWxwZXIoY29tcG9uZW50LCBrZXksIGluZGV4KSB7XG4gIHJldHVybiBjb21wb25lbnQuaWQgKyBcIi1cIiArIHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgdXNlZCB0byBwcm9jZXNzIFwidXBkYXRlXzxzdGF0ZU5hbWU+XCIgaGFuZGxlciBmdW5jdGlvbnMuXG4gKiBJZiBhbGwgb2YgdGhlIG1vZGlmaWVkIHN0YXRlIHByb3BlcnRpZXMgaGF2ZSBhIHVzZXIgcHJvdmlkZWQgdXBkYXRlIGhhbmRsZXJcbiAqIHRoZW4gYSByZXJlbmRlciB3aWxsIGJlIGJ5cGFzc2VkIGFuZCwgaW5zdGVhZCwgdGhlIERPTSB3aWxsIGJlIHVwZGF0ZWRcbiAqIGxvb3Bpbmcgb3ZlciBhbmQgaW52b2tpbmcgdGhlIGN1c3RvbSB1cGRhdGUgaGFuZGxlcnMuXG4gKiBAcmV0dXJuIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgaWYgdGhlIERPTSB3YXMgdXBkYXRlZC4gRmFsc2UsIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc1VwZGF0ZUhhbmRsZXJzKGNvbXBvbmVudCwgc3RhdGVDaGFuZ2VzLCBvbGRTdGF0ZSkge1xuICB2YXIgaGFuZGxlck1ldGhvZDtcbiAgdmFyIGhhbmRsZXJzO1xuXG4gIGZvciAodmFyIHByb3BOYW1lIGluIHN0YXRlQ2hhbmdlcykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHN0YXRlQ2hhbmdlcywgcHJvcE5hbWUpKSB7XG4gICAgICB2YXIgaGFuZGxlck1ldGhvZE5hbWUgPSBcInVwZGF0ZV9cIiArIHByb3BOYW1lO1xuXG4gICAgICBoYW5kbGVyTWV0aG9kID0gY29tcG9uZW50W2hhbmRsZXJNZXRob2ROYW1lXTtcbiAgICAgIGlmIChoYW5kbGVyTWV0aG9kKSB7XG4gICAgICAgIChoYW5kbGVycyB8fCAoaGFuZGxlcnMgPSBbXSkpLnB1c2goW3Byb3BOYW1lLCBoYW5kbGVyTWV0aG9kXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIHN0YXRlIGNoYW5nZSBkb2VzIG5vdCBoYXZlIGEgc3RhdGUgaGFuZGxlciBzbyByZXR1cm4gZmFsc2VcbiAgICAgICAgLy8gdG8gZm9yY2UgYSByZXJlbmRlclxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgd2UgZ290IGhlcmUgdGhlbiBhbGwgb2YgdGhlIGNoYW5nZWQgc3RhdGUgcHJvcGVydGllcyBoYXZlXG4gIC8vIGFuIHVwZGF0ZSBoYW5kbGVyIG9yIHRoZXJlIGFyZSBubyBzdGF0ZSBwcm9wZXJ0aWVzIHRoYXQgYWN0dWFsbHlcbiAgLy8gY2hhbmdlZC5cbiAgaWYgKGhhbmRsZXJzKSB7XG4gICAgLy8gT3RoZXJ3aXNlLCB0aGVyZSBhcmUgaGFuZGxlcnMgZm9yIGFsbCBvZiB0aGUgY2hhbmdlZCBwcm9wZXJ0aWVzXG4gICAgLy8gc28gYXBwbHkgdGhlIHVwZGF0ZXMgdXNpbmcgdGhvc2UgaGFuZGxlcnNcblxuICAgIGhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBoYW5kbGVyWzBdO1xuICAgICAgaGFuZGxlck1ldGhvZCA9IGhhbmRsZXJbMV07XG5cbiAgICAgIHZhciBuZXdWYWx1ZSA9IHN0YXRlQ2hhbmdlc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgdmFyIG9sZFZhbHVlID0gb2xkU3RhdGVbcHJvcGVydHlOYW1lXTtcbiAgICAgIGhhbmRsZXJNZXRob2QuY2FsbChjb21wb25lbnQsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICBjb21wb25lbnQuX19fZW1pdFVwZGF0ZSgpO1xuICAgIGNvbXBvbmVudC5fX19yZXNldCgpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSW5wdXRDaGFuZ2VkKGV4aXN0aW5nQ29tcG9uZW50LCBvbGRJbnB1dCwgbmV3SW5wdXQpIHtcbiAgaWYgKG9sZElucHV0ICE9IG5ld0lucHV0KSB7XG4gICAgaWYgKG9sZElucHV0ID09IG51bGwgfHwgbmV3SW5wdXQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIG9sZEtleXMgPSBPYmplY3Qua2V5cyhvbGRJbnB1dCk7XG4gICAgdmFyIG5ld0tleXMgPSBPYmplY3Qua2V5cyhuZXdJbnB1dCk7XG4gICAgdmFyIGxlbiA9IG9sZEtleXMubGVuZ3RoO1xuICAgIGlmIChsZW4gIT09IG5ld0tleXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gbGVuOyBpLS07ICkge1xuICAgICAgdmFyIGtleSA9IG9sZEtleXNbaV07XG4gICAgICBpZiAoIShrZXkgaW4gbmV3SW5wdXQgJiYgb2xkSW5wdXRba2V5XSA9PT0gbmV3SW5wdXRba2V5XSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgY29tcG9uZW50UHJvdG87XG5cbi8qKlxuICogQmFzZSBjb21wb25lbnQgdHlwZS5cbiAqXG4gKiBOT1RFOiBBbnkgbWV0aG9kcyB0aGF0IGFyZSBwcmVmaXhlZCB3aXRoIGFuIHVuZGVyc2NvcmUgc2hvdWxkIGJlIGNvbnNpZGVyZWQgcHJpdmF0ZSFcbiAqL1xuZnVuY3Rpb24gQ29tcG9uZW50KGlkKSB7XG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuICB0aGlzLmlkID0gaWQ7XG4gIHRoaXMuX19fc3RhdGUgPSBudWxsO1xuICB0aGlzLl9fX3Jvb3ROb2RlID0gbnVsbDtcbiAgdGhpcy5fX19zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgdGhpcy5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcyA9IG51bGw7XG4gIHRoaXMuX19fYnViYmxpbmdEb21FdmVudHMgPSBudWxsOyAvLyBVc2VkIHRvIGtlZXAgdHJhY2sgb2YgYnViYmxpbmcgRE9NIGV2ZW50cyBmb3IgY29tcG9uZW50cyByZW5kZXJlZCBvbiB0aGUgc2VydmVyXG4gIHRoaXMuX19fY3VzdG9tRXZlbnRzID0gbnVsbDtcbiAgdGhpcy5fX19zY29wZSA9IG51bGw7XG4gIHRoaXMuX19fcmVuZGVySW5wdXQgPSBudWxsO1xuICB0aGlzLl9fX2lucHV0ID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX21vdW50ZWQgPSBmYWxzZTtcbiAgdGhpcy5fX19nbG9iYWwgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19fZGVzdHJveWVkID0gZmFsc2U7XG4gIHRoaXMuX19fdXBkYXRlUXVldWVkID0gZmFsc2U7XG4gIHRoaXMuX19fZGlydHkgPSBmYWxzZTtcbiAgdGhpcy5fX19zZXR0aW5nSW5wdXQgPSBmYWxzZTtcbiAgdGhpcy5fX19ob3N0ID0gdW5kZWZpbmVkO1xuXG4gIHZhciBzc3JLZXllZEVsZW1lbnRzID0ga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbaWRdO1xuXG4gIGlmIChzc3JLZXllZEVsZW1lbnRzKSB7XG4gICAgdGhpcy5fX19rZXllZEVsZW1lbnRzID0gc3NyS2V5ZWRFbGVtZW50cztcbiAgICBkZWxldGUga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbaWRdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX19fa2V5ZWRFbGVtZW50cyA9IHt9O1xuICB9XG59XG5cbkNvbXBvbmVudC5wcm90b3R5cGUgPSBjb21wb25lbnRQcm90byA9IHtcbiAgX19faXNDb21wb25lbnQ6IHRydWUsXG5cbiAgc3Vic2NyaWJlVG86IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuXG4gICAgdmFyIHN1YnNjcmlwdGlvbnMgPVxuICAgICAgdGhpcy5fX19zdWJzY3JpcHRpb25zIHx8XG4gICAgICAodGhpcy5fX19zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvblRyYWNrZXIoKSk7XG5cbiAgICB2YXIgc3Vic2NyaWJlVG9PcHRpb25zID0gdGFyZ2V0Ll9fX2lzQ29tcG9uZW50XG4gICAgICA/IENPTVBPTkVOVF9TVUJTQ1JJQkVfVE9fT1BUSU9OU1xuICAgICAgOiBOT05fQ09NUE9ORU5UX1NVQlNDUklCRV9UT19PUFRJT05TO1xuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbnMuc3Vic2NyaWJlVG8odGFyZ2V0LCBzdWJzY3JpYmVUb09wdGlvbnMpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChldmVudFR5cGUpIHtcbiAgICB2YXIgY3VzdG9tRXZlbnRzID0gdGhpcy5fX19jdXN0b21FdmVudHM7XG4gICAgdmFyIHRhcmdldDtcblxuICAgIGlmIChjdXN0b21FdmVudHMgJiYgKHRhcmdldCA9IGN1c3RvbUV2ZW50c1tldmVudFR5cGVdKSkge1xuICAgICAgdmFyIHRhcmdldE1ldGhvZE5hbWUgPSB0YXJnZXRbMF07XG4gICAgICB2YXIgaXNPbmNlID0gdGFyZ2V0WzFdO1xuICAgICAgdmFyIGV4dHJhQXJncyA9IHRhcmdldFsyXTtcbiAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICBoYW5kbGVDdXN0b21FdmVudFdpdGhNZXRob2RMaXN0ZW5lcihcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGFyZ2V0TWV0aG9kTmFtZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgZXh0cmFBcmdzLFxuICAgICAgKTtcblxuICAgICAgaWYgKGlzT25jZSkge1xuICAgICAgICBkZWxldGUgY3VzdG9tRXZlbnRzW2V2ZW50VHlwZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVtaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgZ2V0RWxJZDogZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcbiAgICBpZiAoIWtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuaWQ7XG4gICAgfVxuICAgIHJldHVybiByZXNvbHZlQ29tcG9uZW50SWRIZWxwZXIodGhpcywga2V5LCBpbmRleCk7XG4gIH0sXG4gIGdldEVsOiBmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciByZXNvbHZlZEtleSA9IHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCk7XG4gICAgICB2YXIga2V5ZWRFbGVtZW50ID0gdGhpcy5fX19rZXllZEVsZW1lbnRzW1wiQFwiICsgcmVzb2x2ZWRLZXldO1xuICAgICAgaWYgKGtleWVkRWxlbWVudCAmJiBrZXllZEVsZW1lbnQubm9kZVR5cGUgPT09IDEyIC8qKiBGUkFHTUVOVF9OT0RFICovKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgICAgXCJBY2Nlc3NpbmcgdGhlIGVsZW1lbnRzIG9mIGEgY2hpbGQgY29tcG9uZW50IHVzaW5nICdjb21wb25lbnQuZ2V0RWwnIGlzIGRlcHJlY2F0ZWQuXCIsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3YWxrRnJhZ21lbnRzKGtleWVkRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXllZEVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgIH1cbiAgfSxcbiAgZ2V0RWxzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAga2V5ID0ga2V5ICsgXCJbXVwiO1xuXG4gICAgdmFyIGVscyA9IFtdO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgZWw7XG4gICAgd2hpbGUgKChlbCA9IHRoaXMuZ2V0RWwoa2V5LCBpKSkpIHtcbiAgICAgIGVscy5wdXNoKGVsKTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGVscztcbiAgfSxcbiAgZ2V0Q29tcG9uZW50OiBmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgIHZhciByb290Tm9kZSA9IHRoaXMuX19fa2V5ZWRFbGVtZW50c1tcIkBcIiArIHJlc29sdmVLZXlIZWxwZXIoa2V5LCBpbmRleCldO1xuICAgIGlmICgvXFxbXFxdJC8udGVzdChrZXkpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgIFwiQSByZXBlYXRlZCBrZXlbXSB3YXMgcGFzc2VkIHRvIGdldENvbXBvbmVudC4gVXNlIGEgbm9uLXJlcGVhdGluZyBrZXkgaWYgdGhlcmUgaXMgb25seSBvbmUgb2YgdGhlc2UgY29tcG9uZW50cy5cIixcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJvb3ROb2RlID0gcm9vdE5vZGUgJiYgcm9vdE5vZGVbT2JqZWN0LmtleXMocm9vdE5vZGUpWzBdXTtcbiAgICB9XG4gICAgcmV0dXJuIHJvb3ROb2RlICYmIGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KHJvb3ROb2RlKTtcbiAgfSxcbiAgZ2V0Q29tcG9uZW50czogZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBsb29rdXAgPSB0aGlzLl9fX2tleWVkRWxlbWVudHNbXCJAXCIgKyBrZXkgKyBcIltdXCJdO1xuICAgIHJldHVybiBsb29rdXBcbiAgICAgID8gT2JqZWN0LmtleXMobG9va3VwKVxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KGxvb2t1cFtrZXldKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIDogW107XG4gIH0sXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX19kZXN0cm95ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcm9vdCA9IHRoaXMuX19fcm9vdE5vZGU7XG5cbiAgICB0aGlzLl9fX2Rlc3Ryb3lTaGFsbG93KCk7XG5cbiAgICB2YXIgbm9kZXMgPSByb290Lm5vZGVzO1xuXG4gICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgZGVzdHJveU5vZGVSZWN1cnNpdmUobm9kZSk7XG5cbiAgICAgIGlmIChldmVudERlbGVnYXRpb24uX19faGFuZGxlTm9kZURldGFjaChub2RlKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcm9vdC5kZXRhY2hlZCA9IHRydWU7XG5cbiAgICBkZWxldGUgY29tcG9uZW50TG9va3VwW3RoaXMuaWRdO1xuICAgIHRoaXMuX19fa2V5ZWRFbGVtZW50cyA9IHt9O1xuICB9LFxuXG4gIF9fX2Rlc3Ryb3lTaGFsbG93OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19fZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fX19lbWl0RGVzdHJveSgpO1xuICAgIHRoaXMuX19fZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgIGNvbXBvbmVudHNCeURPTU5vZGUuc2V0KHRoaXMuX19fcm9vdE5vZGUsIHVuZGVmaW5lZCk7XG5cbiAgICB0aGlzLl9fX3Jvb3ROb2RlID0gbnVsbDtcblxuICAgIC8vIFVuc3Vic2NyaWJlIGZyb20gYWxsIERPTSBldmVudHNcbiAgICB0aGlzLl9fX3JlbW92ZURPTUV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICB2YXIgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX19fc3Vic2NyaXB0aW9ucztcbiAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgICAgc3Vic2NyaXB0aW9ucy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuX19fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIGlzRGVzdHJveWVkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fZGVzdHJveWVkO1xuICB9LFxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fc3RhdGU7XG4gIH0sXG4gIHNldCBzdGF0ZShuZXdTdGF0ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgaWYgKCFzdGF0ZSAmJiAhbmV3U3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuX19fc3RhdGUgPSBuZXcgdGhpcy5fX19TdGF0ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBzdGF0ZS5fX19yZXBsYWNlKG5ld1N0YXRlIHx8IHt9KTtcblxuICAgIGlmIChzdGF0ZS5fX19kaXJ0eSkge1xuICAgICAgdGhpcy5fX19xdWV1ZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGlmICghbmV3U3RhdGUpIHtcbiAgICAgIHRoaXMuX19fc3RhdGUgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgc2V0U3RhdGU6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuX19fc3RhdGUgPSBuZXcgdGhpcy5fX19TdGF0ZSh0aGlzKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lID09IFwib2JqZWN0XCIpIHtcbiAgICAgIC8vIE1lcmdlIGluIHRoZSBuZXcgc3RhdGUgd2l0aCB0aGUgb2xkIHN0YXRlXG4gICAgICB2YXIgbmV3U3RhdGUgPSBuYW1lO1xuICAgICAgZm9yICh2YXIgayBpbiBuZXdTdGF0ZSkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChuZXdTdGF0ZSwgaykpIHtcbiAgICAgICAgICBzdGF0ZS5fX19zZXQoaywgbmV3U3RhdGVba10sIHRydWUgLyogZW5zdXJlOnRydWUgKi8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLl9fX3NldChuYW1lLCB2YWx1ZSwgdHJ1ZSAvKiBlbnN1cmU6dHJ1ZSAqLyk7XG4gICAgfVxuICB9LFxuXG4gIHNldFN0YXRlRGlydHk6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICB2YWx1ZSA9IHN0YXRlW25hbWVdO1xuICAgIH1cblxuICAgIHN0YXRlLl9fX3NldChcbiAgICAgIG5hbWUsXG4gICAgICB2YWx1ZSxcbiAgICAgIHRydWUgLyogZW5zdXJlOnRydWUgKi8sXG4gICAgICB0cnVlIC8qIGZvcmNlRGlydHk6dHJ1ZSAqLyxcbiAgICApO1xuICB9LFxuXG4gIHJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKG5ld1N0YXRlKSB7XG4gICAgdGhpcy5fX19zdGF0ZS5fX19yZXBsYWNlKG5ld1N0YXRlKTtcbiAgfSxcblxuICBnZXQgaW5wdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19faW5wdXQ7XG4gIH0sXG4gIHNldCBpbnB1dChuZXdJbnB1dCkge1xuICAgIGlmICh0aGlzLl9fX3NldHRpbmdJbnB1dCkge1xuICAgICAgdGhpcy5fX19pbnB1dCA9IG5ld0lucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fX3NldElucHV0KG5ld0lucHV0KTtcbiAgICB9XG4gIH0sXG5cbiAgX19fc2V0SW5wdXQ6IGZ1bmN0aW9uIChuZXdJbnB1dCwgb25JbnB1dCwgb3V0KSB7XG4gICAgb25JbnB1dCA9IG9uSW5wdXQgfHwgdGhpcy5vbklucHV0O1xuICAgIHZhciB1cGRhdGVkSW5wdXQ7XG5cbiAgICB2YXIgb2xkSW5wdXQgPSB0aGlzLl9fX2lucHV0O1xuICAgIHRoaXMuX19faW5wdXQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fX19jb250ZXh0ID0gKG91dCAmJiBvdXRbQ09OVEVYVF9LRVldKSB8fCB0aGlzLl9fX2NvbnRleHQ7XG5cbiAgICBpZiAob25JbnB1dCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBzZXQgYSBmbGFnIHRvIHByZXZpZXcgYHRoaXMuaW5wdXQgPSBmb29gIGluc2lkZVxuICAgICAgLy8gb25JbnB1dCBjYXVzaW5nIGluZmluaXRlIHJlY3Vyc2lvblxuICAgICAgdGhpcy5fX19zZXR0aW5nSW5wdXQgPSB0cnVlO1xuICAgICAgdXBkYXRlZElucHV0ID0gb25JbnB1dC5jYWxsKHRoaXMsIG5ld0lucHV0IHx8IHt9LCBvdXQpO1xuICAgICAgdGhpcy5fX19zZXR0aW5nSW5wdXQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZXdJbnB1dCA9IHRoaXMuX19fcmVuZGVySW5wdXQgPSB1cGRhdGVkSW5wdXQgfHwgbmV3SW5wdXQ7XG5cbiAgICBpZiAoKHRoaXMuX19fZGlydHkgPSBjaGVja0lucHV0Q2hhbmdlZCh0aGlzLCBvbGRJbnB1dCwgbmV3SW5wdXQpKSkge1xuICAgICAgdGhpcy5fX19xdWV1ZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9fX2lucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX19faW5wdXQgPSBuZXdJbnB1dDtcbiAgICAgIGlmIChuZXdJbnB1dCAmJiBuZXdJbnB1dC4kZ2xvYmFsKSB7XG4gICAgICAgIHRoaXMuX19fZ2xvYmFsID0gbmV3SW5wdXQuJGdsb2JhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3SW5wdXQ7XG4gIH0sXG5cbiAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9fX2RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9fX3F1ZXVlVXBkYXRlKCk7XG4gIH0sXG5cbiAgX19fcXVldWVVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX19fdXBkYXRlUXVldWVkKSB7XG4gICAgICB0aGlzLl9fX3VwZGF0ZVF1ZXVlZCA9IHRydWU7XG4gICAgICB1cGRhdGVNYW5hZ2VyLl9fX3F1ZXVlQ29tcG9uZW50VXBkYXRlKHRoaXMpO1xuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX19kZXN0cm95ZWQgPT09IHRydWUgfHwgdGhpcy5fX19pc0RpcnR5ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpbnB1dCA9IHRoaXMuX19faW5wdXQ7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmICh0aGlzLl9fX2RpcnR5ID09PSBmYWxzZSAmJiBzdGF0ZSAhPT0gbnVsbCAmJiBzdGF0ZS5fX19kaXJ0eSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKHByb2Nlc3NVcGRhdGVIYW5kbGVycyh0aGlzLCBzdGF0ZS5fX19jaGFuZ2VzLCBzdGF0ZS5fX19vbGQsIHN0YXRlKSkge1xuICAgICAgICBzdGF0ZS5fX19kaXJ0eSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9fX2lzRGlydHkgPT09IHRydWUpIHtcbiAgICAgIC8vIFRoZSBVSSBjb21wb25lbnQgaXMgc3RpbGwgZGlydHkgYWZ0ZXIgcHJvY2VzcyBzdGF0ZSBoYW5kbGVyc1xuICAgICAgLy8gdGhlbiB3ZSBzaG91bGQgcmVyZW5kZXJcblxuICAgICAgaWYgKHRoaXMuc2hvdWxkVXBkYXRlKGlucHV0LCBzdGF0ZSkgIT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX19fc2NoZWR1bGVSZXJlbmRlcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX19fcmVzZXQoKTtcbiAgfSxcblxuICBnZXQgX19faXNEaXJ0eSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fX19kaXJ0eSA9PT0gdHJ1ZSB8fFxuICAgICAgKHRoaXMuX19fc3RhdGUgIT09IG51bGwgJiYgdGhpcy5fX19zdGF0ZS5fX19kaXJ0eSA9PT0gdHJ1ZSlcbiAgICApO1xuICB9LFxuXG4gIF9fX3Jlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX19kaXJ0eSA9IGZhbHNlO1xuICAgIHRoaXMuX19fdXBkYXRlUXVldWVkID0gZmFsc2U7XG4gICAgdGhpcy5fX19yZW5kZXJJbnB1dCA9IG51bGw7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHN0YXRlLl9fX3Jlc2V0KCk7XG4gICAgfVxuICB9LFxuXG4gIHNob3VsZFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIF9fX3NjaGVkdWxlUmVyZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlbmRlcmVyID0gc2VsZi5fX19yZW5kZXJlcjtcblxuICAgIGlmICghcmVuZGVyZXIpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cblxuICAgIHZhciBpbnB1dCA9IHRoaXMuX19fcmVuZGVySW5wdXQgfHwgdGhpcy5fX19pbnB1dDtcblxuICAgIHVwZGF0ZU1hbmFnZXIuX19fYmF0Y2hVcGRhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fX19yZXJlbmRlcihpbnB1dCwgZmFsc2UpLmFmdGVySW5zZXJ0KHNlbGYuX19faG9zdCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9fX3Jlc2V0KCk7XG4gIH0sXG5cbiAgX19fcmVyZW5kZXI6IGZ1bmN0aW9uIChpbnB1dCwgaXNIeWRyYXRlKSB7XG4gICAgdmFyIGhvc3QgPSB0aGlzLl9fX2hvc3Q7XG4gICAgdmFyIGdsb2JhbERhdGEgPSB0aGlzLl9fX2dsb2JhbDtcbiAgICB2YXIgcm9vdE5vZGUgPSB0aGlzLl9fX3Jvb3ROb2RlO1xuICAgIHZhciByZW5kZXJlciA9IHRoaXMuX19fcmVuZGVyZXI7XG4gICAgdmFyIGNyZWF0ZU91dCA9IHJlbmRlcmVyLmNyZWF0ZU91dCB8fCBkZWZhdWx0Q3JlYXRlT3V0O1xuICAgIHZhciBvdXQgPSBjcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG4gICAgb3V0LnN5bmMoKTtcbiAgICBvdXQuX19faG9zdCA9IHRoaXMuX19faG9zdDtcbiAgICBvdXRbQ09OVEVYVF9LRVldID0gdGhpcy5fX19jb250ZXh0O1xuXG4gICAgdmFyIGNvbXBvbmVudHNDb250ZXh0ID0gZ2V0Q29tcG9uZW50c0NvbnRleHQob3V0KTtcbiAgICB2YXIgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSBjb21wb25lbnRzQ29udGV4dC5fX19nbG9iYWxDb250ZXh0O1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlcmVuZGVyQ29tcG9uZW50ID0gdGhpcztcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19pc0h5ZHJhdGUgPSBpc0h5ZHJhdGU7XG5cbiAgICByZW5kZXJlcihpbnB1dCwgb3V0KTtcblxuICAgIHZhciByZXN1bHQgPSBuZXcgUmVuZGVyUmVzdWx0KG91dCk7XG5cbiAgICB2YXIgdGFyZ2V0Tm9kZSA9IG91dC5fX19nZXRPdXRwdXQoKS5fX19maXJzdENoaWxkO1xuXG4gICAgbW9ycGhkb20ocm9vdE5vZGUsIHRhcmdldE5vZGUsIGhvc3QsIGNvbXBvbmVudHNDb250ZXh0KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgX19fZGV0YWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJvb3QgPSB0aGlzLl9fX3Jvb3ROb2RlO1xuICAgIHJvb3QucmVtb3ZlKCk7XG4gICAgcmV0dXJuIHJvb3Q7XG4gIH0sXG5cbiAgX19fcmVtb3ZlRE9NRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnRMaXN0ZW5lckhhbmRsZXMgPSB0aGlzLl9fX2RvbUV2ZW50TGlzdGVuZXJIYW5kbGVzO1xuICAgIGlmIChldmVudExpc3RlbmVySGFuZGxlcykge1xuICAgICAgZXZlbnRMaXN0ZW5lckhhbmRsZXMuZm9yRWFjaChyZW1vdmVMaXN0ZW5lcik7XG4gICAgICB0aGlzLl9fX2RvbUV2ZW50TGlzdGVuZXJIYW5kbGVzID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgZ2V0IF9fX3Jhd1N0YXRlKCkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgcmV0dXJuIHN0YXRlICYmIHN0YXRlLl9fX3JhdztcbiAgfSxcblxuICBfX19zZXRDdXN0b21FdmVudHM6IGZ1bmN0aW9uIChjdXN0b21FdmVudHMsIHNjb3BlKSB7XG4gICAgdmFyIGZpbmFsQ3VzdG9tRXZlbnRzID0gKHRoaXMuX19fY3VzdG9tRXZlbnRzID0ge30pO1xuICAgIHRoaXMuX19fc2NvcGUgPSBzY29wZTtcblxuICAgIGN1c3RvbUV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjdXN0b21FdmVudCkge1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IGN1c3RvbUV2ZW50WzBdO1xuICAgICAgdmFyIHRhcmdldE1ldGhvZE5hbWUgPSBjdXN0b21FdmVudFsxXTtcbiAgICAgIHZhciBpc09uY2UgPSBjdXN0b21FdmVudFsyXTtcbiAgICAgIHZhciBleHRyYUFyZ3MgPSBjdXN0b21FdmVudFszXTtcblxuICAgICAgaWYgKHRhcmdldE1ldGhvZE5hbWUpIHtcbiAgICAgICAgZmluYWxDdXN0b21FdmVudHNbZXZlbnRUeXBlXSA9IFt0YXJnZXRNZXRob2ROYW1lLCBpc09uY2UsIGV4dHJhQXJnc107XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB3YWxrRnJhZ21lbnRzKHRoaXMuX19fcm9vdE5vZGUpO1xuICB9LFxuXG4gIGdldCBlbHMoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICAnVGhlIFwidGhpcy5lbHNcIiBhdHRyaWJ1dGUgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBcInRoaXMuZ2V0RWxzKGtleSlcIiBpbnN0ZWFkLicsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMuX19fcm9vdE5vZGUgPyB0aGlzLl9fX3Jvb3ROb2RlLm5vZGVzIDogW10pLmZpbHRlcihcbiAgICAgIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSxcblxuICBfX19lbWl0OiBlbWl0LFxuICBfX19lbWl0Q3JlYXRlKGlucHV0LCBvdXQpIHtcbiAgICB0aGlzLm9uQ3JlYXRlICYmIHRoaXMub25DcmVhdGUoaW5wdXQsIG91dCk7XG4gICAgdGhpcy5fX19lbWl0KFwiY3JlYXRlXCIsIGlucHV0LCBvdXQpO1xuICB9LFxuXG4gIF9fX2VtaXRSZW5kZXIob3V0KSB7XG4gICAgdGhpcy5vblJlbmRlciAmJiB0aGlzLm9uUmVuZGVyKG91dCk7XG4gICAgdGhpcy5fX19lbWl0KFwicmVuZGVyXCIsIG91dCk7XG4gIH0sXG5cbiAgX19fZW1pdFVwZGF0ZSgpIHtcbiAgICB0aGlzLm9uVXBkYXRlICYmIHRoaXMub25VcGRhdGUoKTtcbiAgICB0aGlzLl9fX2VtaXQoXCJ1cGRhdGVcIik7XG4gIH0sXG5cbiAgX19fZW1pdE1vdW50KCkge1xuICAgIHRoaXMub25Nb3VudCAmJiB0aGlzLm9uTW91bnQoKTtcbiAgICB0aGlzLl9fX2VtaXQoXCJtb3VudFwiKTtcbiAgfSxcblxuICBfX19lbWl0RGVzdHJveSgpIHtcbiAgICB0aGlzLm9uRGVzdHJveSAmJiB0aGlzLm9uRGVzdHJveSgpO1xuICAgIHRoaXMuX19fZW1pdChcImRlc3Ryb3lcIik7XG4gIH0sXG59O1xuXG5jb21wb25lbnRQcm90by5lbElkID0gY29tcG9uZW50UHJvdG8uZ2V0RWxJZDtcbmNvbXBvbmVudFByb3RvLl9fX3VwZGF0ZSA9IGNvbXBvbmVudFByb3RvLnVwZGF0ZTtcbmNvbXBvbmVudFByb3RvLl9fX2Rlc3Ryb3kgPSBjb21wb25lbnRQcm90by5kZXN0cm95O1xuXG4vLyBBZGQgYWxsIG9mIHRoZSBmb2xsb3dpbmcgRE9NIG1ldGhvZHMgdG8gQ29tcG9uZW50LnByb3RvdHlwZTpcbi8vIC0gYXBwZW5kVG8ocmVmZXJlbmNlRWwpXG4vLyAtIHJlcGxhY2UocmVmZXJlbmNlRWwpXG4vLyAtIHJlcGxhY2VDaGlsZHJlbk9mKHJlZmVyZW5jZUVsKVxuLy8gLSBpbnNlcnRCZWZvcmUocmVmZXJlbmNlRWwpXG4vLyAtIGluc2VydEFmdGVyKHJlZmVyZW5jZUVsKVxuLy8gLSBwcmVwZW5kVG8ocmVmZXJlbmNlRWwpXG5kb21JbnNlcnQoXG4gIGNvbXBvbmVudFByb3RvLFxuICBmdW5jdGlvbiBnZXRFbChjb21wb25lbnQpIHtcbiAgICByZXR1cm4gY29tcG9uZW50Ll9fX2RldGFjaCgpO1xuICB9LFxuICBmdW5jdGlvbiBhZnRlckluc2VydChjb21wb25lbnQpIHtcbiAgICByZXR1cm4gY29tcG9uZW50O1xuICB9LFxuKTtcblxuaW5oZXJpdChDb21wb25lbnQsIEV2ZW50RW1pdHRlcik7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG52YXIgdzEwTm9vcCA9IHJlcXVpcmUoXCJ3YXJwMTAvY29uc3RhbnRzXCIpLk5PT1A7XG52YXIgY29tcG9uZW50VXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGF0dGFjaEJ1YmJsaW5nRXZlbnQgPSBjb21wb25lbnRVdGlsLl9fX2F0dGFjaEJ1YmJsaW5nRXZlbnQ7XG52YXIgYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyID1cbiAgcmVxdWlyZShcIi4vZXZlbnQtZGVsZWdhdGlvblwiKS5fX19hZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXI7XG52YXIgS2V5U2VxdWVuY2UgPSByZXF1aXJlKFwiLi9LZXlTZXF1ZW5jZVwiKTtcbnZhciBFTVBUWV9PQkpFQ1QgPSB7fTtcblxudmFyIEZMQUdfV0lMTF9SRVJFTkRFUl9JTl9CUk9XU0VSID0gMTtcbnZhciBGTEFHX0hBU19SRU5ERVJfQk9EWSA9IDI7XG52YXIgRkxBR19JU19MRUdBQ1kgPSA0O1xudmFyIEZMQUdfT0xEX0hZRFJBVEVfTk9fQ1JFQVRFID0gODtcblxuLyoqXG4gKiBBIENvbXBvbmVudERlZiBpcyB1c2VkIHRvIGhvbGQgdGhlIG1ldGFkYXRhIGNvbGxlY3RlZCBhdCBydW50aW1lIGZvclxuICogYSBzaW5nbGUgY29tcG9uZW50IGFuZCB0aGlzIGluZm9ybWF0aW9uIGlzIHVzZWQgdG8gaW5zdGFudGlhdGUgdGhlIGNvbXBvbmVudFxuICogbGF0ZXIgKGFmdGVyIHRoZSByZW5kZXJlZCBIVE1MIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBET00pXG4gKi9cbmZ1bmN0aW9uIENvbXBvbmVudERlZihjb21wb25lbnQsIGNvbXBvbmVudElkLCBjb21wb25lbnRzQ29udGV4dCkge1xuICB0aGlzLl9fX2NvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQ7IC8vIFRoZSBBc3luY1dyaXRlciB0aGF0IHRoaXMgY29tcG9uZW50IGlzIGFzc29jaWF0ZWQgd2l0aFxuICB0aGlzLl9fX2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgdGhpcy5pZCA9IGNvbXBvbmVudElkO1xuXG4gIHRoaXMuX19fZG9tRXZlbnRzID0gdW5kZWZpbmVkOyAvLyBBbiBhcnJheSBvZiBET00gZXZlbnRzIHRoYXQgbmVlZCB0byBiZSBhZGRlZCAoaW4gc2V0cyBvZiB0aHJlZSlcblxuICB0aGlzLl9fX2lzRXhpc3RpbmcgPSBmYWxzZTtcblxuICB0aGlzLl9fX3JlbmRlckJvdW5kYXJ5ID0gZmFsc2U7XG4gIHRoaXMuX19fZmxhZ3MgPSAwO1xuXG4gIHRoaXMuX19fbmV4dElkSW5kZXggPSAwOyAvLyBUaGUgdW5pcXVlIGludGVnZXIgdG8gdXNlIGZvciB0aGUgbmV4dCBzY29wZWQgSURcbiAgdGhpcy5fX19rZXlTZXF1ZW5jZSA9IG51bGw7XG59XG5cbkNvbXBvbmVudERlZi5wcm90b3R5cGUgPSB7XG4gIF9fX25leHRLZXk6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fX19rZXlTZXF1ZW5jZSB8fCAodGhpcy5fX19rZXlTZXF1ZW5jZSA9IG5ldyBLZXlTZXF1ZW5jZSgpKVxuICAgICkuX19fbmV4dEtleShrZXkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGlzIGhlbHBlciBtZXRob2QgZ2VuZXJhdGVzIGEgdW5pcXVlIGFuZCBmdWxseSBxdWFsaWZpZWQgRE9NIGVsZW1lbnQgSURcbiAgICogdGhhdCBpcyB1bmlxdWUgd2l0aGluIHRoZSBzY29wZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnQuXG4gICAqL1xuICBlbElkOiBmdW5jdGlvbiAobmVzdGVkSWQpIHtcbiAgICB2YXIgaWQgPSB0aGlzLmlkO1xuXG4gICAgaWYgKG5lc3RlZElkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBuZXN0ZWRJZCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgICBjb21wbGFpbihcIlVzaW5nIG5vbiBzdHJpbmdzIGFzIGtleXMgaXMgZGVwcmVjYXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBuZXN0ZWRJZCA9IFN0cmluZyhuZXN0ZWRJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXN0ZWRJZC5pbmRleE9mKFwiI1wiKSA9PT0gMCkge1xuICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgIG5lc3RlZElkID0gbmVzdGVkSWQuc3Vic3RyaW5nKDEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaWQgKyBcIi1cIiArIG5lc3RlZElkO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG5leHQgYXV0byBnZW5lcmF0ZWQgdW5pcXVlIElEIGZvciBhIG5lc3RlZCBET00gZWxlbWVudCBvciBuZXN0ZWQgRE9NIGNvbXBvbmVudFxuICAgKi9cbiAgX19fbmV4dENvbXBvbmVudElkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQgKyBcIi1jXCIgKyB0aGlzLl9fX25leHRJZEluZGV4Kys7XG4gIH0sXG5cbiAgZDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgaGFuZGxlck1ldGhvZE5hbWUsIGlzT25jZSwgZXh0cmFBcmdzKSB7XG4gICAgYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyKGV2ZW50TmFtZSk7XG4gICAgcmV0dXJuIGF0dGFjaEJ1YmJsaW5nRXZlbnQodGhpcywgaGFuZGxlck1ldGhvZE5hbWUsIGlzT25jZSwgZXh0cmFBcmdzKTtcbiAgfSxcblxuICBnZXQgX19fdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19jb21wb25lbnQuX19fdHlwZTtcbiAgfSxcbn07XG5cbkNvbXBvbmVudERlZi5wcm90b3R5cGUubmsgPSBDb21wb25lbnREZWYucHJvdG90eXBlLl9fX25leHRLZXk7XG5cbkNvbXBvbmVudERlZi5fX19kZXNlcmlhbGl6ZSA9IGZ1bmN0aW9uIChvLCB0eXBlcywgZ2xvYmFsLCByZWdpc3RyeSkge1xuICB2YXIgaWQgPSBvWzBdO1xuICB2YXIgdHlwZU5hbWUgPSB0eXBlc1tvWzFdXTtcbiAgdmFyIGlucHV0ID0gb1syXSB8fCBudWxsO1xuICB2YXIgZXh0cmEgPSBvWzNdIHx8IEVNUFRZX09CSkVDVDtcblxuICB2YXIgc3RhdGUgPSBleHRyYS5zO1xuICB2YXIgY29tcG9uZW50UHJvcHMgPSBleHRyYS53IHx8IEVNUFRZX09CSkVDVDtcbiAgdmFyIGZsYWdzID0gZXh0cmEuZjtcbiAgdmFyIGlzTGVnYWN5ID0gZmxhZ3MgJiBGTEFHX0lTX0xFR0FDWTtcbiAgdmFyIHJlbmRlckJvZHkgPSBmbGFncyAmIEZMQUdfSEFTX1JFTkRFUl9CT0RZID8gdzEwTm9vcCA6IGV4dHJhLnI7XG5cbiAgdmFyIGNvbXBvbmVudCA9XG4gICAgdHlwZU5hbWUgLyogbGVnYWN5ICovICYmXG4gICAgcmVnaXN0cnkuX19fY3JlYXRlQ29tcG9uZW50KHR5cGVOYW1lLCBpZCwgaXNMZWdhY3kpO1xuXG4gIC8vIFByZXZlbnQgbmV3bHkgY3JlYXRlZCBjb21wb25lbnQgZnJvbSBiZWluZyBxdWV1ZWQgZm9yIHVwZGF0ZSBzaW5jZSB3ZSBhcmVhXG4gIC8vIGp1c3QgYnVpbGRpbmcgaXQgZnJvbSB0aGUgc2VydmVyIGluZm9cbiAgY29tcG9uZW50Ll9fX3VwZGF0ZVF1ZXVlZCA9IHRydWU7XG5cbiAgaWYgKGlzTGVnYWN5KSB7XG4gICAgY29tcG9uZW50LndpZGdldENvbmZpZyA9IGNvbXBvbmVudFByb3BzO1xuICAgIGNvbXBvbmVudC5fX193aWRnZXRCb2R5ID0gcmVuZGVyQm9keTtcbiAgfSBlbHNlIGlmIChyZW5kZXJCb2R5KSB7XG4gICAgKGlucHV0IHx8IChpbnB1dCA9IHt9KSkucmVuZGVyQm9keSA9IHJlbmRlckJvZHk7XG4gIH1cblxuICBpZiAoXG4gICAgIWlzTGVnYWN5ICYmXG4gICAgZmxhZ3MgJiBGTEFHX1dJTExfUkVSRU5ERVJfSU5fQlJPV1NFUiAmJlxuICAgICEoZmxhZ3MgJiBGTEFHX09MRF9IWURSQVRFX05PX0NSRUFURSlcbiAgKSB7XG4gICAgaWYgKGNvbXBvbmVudC5vbkNyZWF0ZSkge1xuICAgICAgY29tcG9uZW50Lm9uQ3JlYXRlKGlucHV0LCB7IGdsb2JhbDogZ2xvYmFsIH0pO1xuICAgIH1cbiAgICBpZiAoY29tcG9uZW50Lm9uSW5wdXQpIHtcbiAgICAgIGlucHV0ID0gY29tcG9uZW50Lm9uSW5wdXQoaW5wdXQsIHsgZ2xvYmFsOiBnbG9iYWwgfSkgfHwgaW5wdXQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChzdGF0ZSkge1xuICAgICAgdmFyIHVuZGVmaW5lZFByb3BOYW1lcyA9IGV4dHJhLnU7XG4gICAgICBpZiAodW5kZWZpbmVkUHJvcE5hbWVzKSB7XG4gICAgICAgIHVuZGVmaW5lZFByb3BOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uICh1bmRlZmluZWRQcm9wTmFtZSkge1xuICAgICAgICAgIHN0YXRlW3VuZGVmaW5lZFByb3BOYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBXZSBnbyB0aHJvdWdoIHRoZSBzZXR0ZXIgaGVyZSBzbyB0aGF0IHdlIGNvbnZlcnQgdGhlIHN0YXRlIG9iamVjdFxuICAgICAgLy8gdG8gYW4gaW5zdGFuY2Ugb2YgYFN0YXRlYFxuICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKCFpc0xlZ2FjeSAmJiBjb21wb25lbnRQcm9wcykge1xuICAgICAgZXh0ZW5kKGNvbXBvbmVudCwgY29tcG9uZW50UHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudC5fX19pbnB1dCA9IGlucHV0O1xuXG4gIGlmIChleHRyYS5iKSB7XG4gICAgY29tcG9uZW50Ll9fX2J1YmJsaW5nRG9tRXZlbnRzID0gZXh0cmEuYjtcbiAgfVxuXG4gIHZhciBzY29wZSA9IGV4dHJhLnA7XG4gIHZhciBjdXN0b21FdmVudHMgPSBleHRyYS5lO1xuICBpZiAoY3VzdG9tRXZlbnRzKSB7XG4gICAgY29tcG9uZW50Ll9fX3NldEN1c3RvbUV2ZW50cyhjdXN0b21FdmVudHMsIHNjb3BlKTtcbiAgfVxuXG4gIGNvbXBvbmVudC5fX19nbG9iYWwgPSBnbG9iYWw7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogaWQsXG4gICAgX19fY29tcG9uZW50OiBjb21wb25lbnQsXG4gICAgX19fZG9tRXZlbnRzOiBleHRyYS5kLFxuICAgIF9fX2ZsYWdzOiBleHRyYS5mIHx8IDAsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudERlZjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gcmVxdWlyZShcIi4vR2xvYmFsQ29tcG9uZW50c0NvbnRleHRcIik7XG5cbmZ1bmN0aW9uIENvbXBvbmVudHNDb250ZXh0KG91dCwgcGFyZW50Q29tcG9uZW50c0NvbnRleHQpIHtcbiAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0O1xuICB2YXIgY29tcG9uZW50RGVmO1xuXG4gIGlmIChwYXJlbnRDb21wb25lbnRzQ29udGV4dCkge1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcbiAgICBjb21wb25lbnREZWYgPSBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWY7XG5cbiAgICB2YXIgbmVzdGVkQ29udGV4dHNGb3JQYXJlbnQ7XG4gICAgaWYgKFxuICAgICAgIShuZXN0ZWRDb250ZXh0c0ZvclBhcmVudCA9IHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX25lc3RlZENvbnRleHRzKVxuICAgICkge1xuICAgICAgbmVzdGVkQ29udGV4dHNGb3JQYXJlbnQgPSBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19uZXN0ZWRDb250ZXh0cyA9IFtdO1xuICAgIH1cblxuICAgIG5lc3RlZENvbnRleHRzRm9yUGFyZW50LnB1c2godGhpcyk7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSBvdXQuZ2xvYmFsLl9fX2NvbXBvbmVudHM7XG4gICAgaWYgKGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG91dC5nbG9iYWwuX19fY29tcG9uZW50cyA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID1cbiAgICAgICAgbmV3IEdsb2JhbENvbXBvbmVudHNDb250ZXh0KG91dCk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fX19nbG9iYWxDb250ZXh0ID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQ7XG4gIHRoaXMuX19fY29tcG9uZW50cyA9IFtdO1xuICB0aGlzLl9fX291dCA9IG91dDtcbiAgdGhpcy5fX19jb21wb25lbnREZWYgPSBjb21wb25lbnREZWY7XG4gIHRoaXMuX19fbmVzdGVkQ29udGV4dHMgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19faXNQcmVzZXJ2ZWQgPVxuICAgIHBhcmVudENvbXBvbmVudHNDb250ZXh0ICYmIHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX2lzUHJlc2VydmVkO1xufVxuXG5Db21wb25lbnRzQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gIF9fX2luaXRDb21wb25lbnRzOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBjb21wb25lbnREZWZzID0gdGhpcy5fX19jb21wb25lbnRzO1xuXG4gICAgQ29tcG9uZW50c0NvbnRleHQuX19faW5pdENsaWVudFJlbmRlcmVkKGNvbXBvbmVudERlZnMsIGhvc3QpO1xuXG4gICAgdGhpcy5fX19vdXQuZW1pdChcIl9fX2NvbXBvbmVudHNJbml0aWFsaXplZFwiKTtcblxuICAgIC8vIFJlc2V0IHRoaW5ncyBzdG9yZWQgaW4gZ2xvYmFsIHNpbmNlIGdsb2JhbCBpcyByZXRhaW5lZCBmb3JcbiAgICAvLyBmdXR1cmUgcmVuZGVyc1xuICAgIHRoaXMuX19fb3V0Lmdsb2JhbC5fX19jb21wb25lbnRzID0gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGNvbXBvbmVudERlZnM7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRzQ29udGV4dChvdXQpIHtcbiAgcmV0dXJuIG91dC5fX19jb21wb25lbnRzIHx8IChvdXQuX19fY29tcG9uZW50cyA9IG5ldyBDb21wb25lbnRzQ29udGV4dChvdXQpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gQ29tcG9uZW50c0NvbnRleHQ7XG5cbmV4cG9ydHMuX19fZ2V0Q29tcG9uZW50c0NvbnRleHQgPSBnZXRDb21wb25lbnRzQ29udGV4dDtcbiIsInZhciBuZXh0Q29tcG9uZW50SWRQcm92aWRlciA9XG4gIHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpLl9fX25leHRDb21wb25lbnRJZFByb3ZpZGVyO1xuXG5mdW5jdGlvbiBHbG9iYWxDb21wb25lbnRzQ29udGV4dChvdXQpIHtcbiAgdGhpcy5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkID0ge307XG4gIHRoaXMuX19fcmVyZW5kZXJDb21wb25lbnQgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19fbmV4dENvbXBvbmVudElkID0gbmV4dENvbXBvbmVudElkUHJvdmlkZXIob3V0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHbG9iYWxDb21wb25lbnRzQ29udGV4dDtcbiIsImZ1bmN0aW9uIEtleVNlcXVlbmNlKCkge1xuICB0aGlzLl9fX2xvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbktleVNlcXVlbmNlLnByb3RvdHlwZS5fX19uZXh0S2V5ID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgbG9va3VwID0gdGhpcy5fX19sb29rdXA7XG5cbiAgaWYgKGxvb2t1cFtrZXldKSB7XG4gICAgcmV0dXJuIGtleSArIFwiX1wiICsgbG9va3VwW2tleV0rKztcbiAgfVxuXG4gIGxvb2t1cFtrZXldID0gMTtcbiAgcmV0dXJuIGtleTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5U2VxdWVuY2U7XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcblxuZnVuY3Rpb24gZW5zdXJlKHN0YXRlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgdmFyIHByb3RvID0gc3RhdGUuY29uc3RydWN0b3IucHJvdG90eXBlO1xuICBpZiAoIShwcm9wZXJ0eU5hbWUgaW4gcHJvdG8pKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX19yYXdbcHJvcGVydHlOYW1lXTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fX3NldChwcm9wZXJ0eU5hbWUsIHZhbHVlLCBmYWxzZSAvKiBlbnN1cmU6ZmFsc2UgKi8pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBTdGF0ZShjb21wb25lbnQpIHtcbiAgdGhpcy5fX19jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gIHRoaXMuX19fcmF3ID0ge307XG5cbiAgdGhpcy5fX19kaXJ0eSA9IGZhbHNlO1xuICB0aGlzLl9fX29sZCA9IG51bGw7XG4gIHRoaXMuX19fY2hhbmdlcyA9IG51bGw7XG4gIHRoaXMuX19fZm9yY2VkID0gbnVsbDsgLy8gQW4gb2JqZWN0IHRoYXQgd2UgdXNlIHRvIGtlZXAgdHJhY2tpbmcgb2Ygc3RhdGUgcHJvcGVydGllcyB0aGF0IHdlcmUgZm9yY2VkIHRvIGJlIGRpcnR5XG5cbiAgT2JqZWN0LnNlYWwodGhpcyk7XG59XG5cblN0YXRlLnByb3RvdHlwZSA9IHtcbiAgX19fcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLl9fX2RpcnR5ID0gZmFsc2U7XG4gICAgc2VsZi5fX19vbGQgPSBudWxsO1xuICAgIHNlbGYuX19fY2hhbmdlcyA9IG51bGw7XG4gICAgc2VsZi5fX19mb3JjZWQgPSBudWxsO1xuICB9LFxuXG4gIF9fX3JlcGxhY2U6IGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXM7XG4gICAgdmFyIGtleTtcblxuICAgIHZhciByYXdTdGF0ZSA9IHRoaXMuX19fcmF3O1xuXG4gICAgZm9yIChrZXkgaW4gcmF3U3RhdGUpIHtcbiAgICAgIGlmICghKGtleSBpbiBuZXdTdGF0ZSkpIHtcbiAgICAgICAgc3RhdGUuX19fc2V0KFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgZmFsc2UgLyogZW5zdXJlOmZhbHNlICovLFxuICAgICAgICAgIGZhbHNlIC8qIGZvcmNlRGlydHk6ZmFsc2UgKi8sXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gbmV3U3RhdGUpIHtcbiAgICAgIHN0YXRlLl9fX3NldChcbiAgICAgICAga2V5LFxuICAgICAgICBuZXdTdGF0ZVtrZXldLFxuICAgICAgICB0cnVlIC8qIGVuc3VyZTp0cnVlICovLFxuICAgICAgICBmYWxzZSAvKiBmb3JjZURpcnR5OmZhbHNlICovLFxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIF9fX3NldDogZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCBzaG91bGRFbnN1cmUsIGZvcmNlRGlydHkpIHtcbiAgICB2YXIgcmF3U3RhdGUgPSB0aGlzLl9fX3JhdztcblxuICAgIGlmIChzaG91bGRFbnN1cmUpIHtcbiAgICAgIGVuc3VyZSh0aGlzLCBuYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoZm9yY2VEaXJ0eSkge1xuICAgICAgdmFyIGZvcmNlZERpcnR5U3RhdGUgPSB0aGlzLl9fX2ZvcmNlZCB8fCAodGhpcy5fX19mb3JjZWQgPSB7fSk7XG4gICAgICBmb3JjZWREaXJ0eVN0YXRlW25hbWVdID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHJhd1N0YXRlW25hbWVdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fX19kaXJ0eSkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgdGltZSB3ZSBhcmUgbW9kaWZ5aW5nIHRoZSBjb21wb25lbnQgc3RhdGVcbiAgICAgIC8vIHNvIGludHJvZHVjZSBzb21lIHByb3BlcnRpZXMgdG8gZG8gc29tZSB0cmFja2luZyBvZlxuICAgICAgLy8gY2hhbmdlcyB0byB0aGUgc3RhdGVcbiAgICAgIHRoaXMuX19fZGlydHkgPSB0cnVlOyAvLyBNYXJrIHRoZSBjb21wb25lbnQgc3RhdGUgYXMgZGlydHkgKGkuZS4gbW9kaWZpZWQpXG4gICAgICB0aGlzLl9fX29sZCA9IHJhd1N0YXRlO1xuICAgICAgdGhpcy5fX19yYXcgPSByYXdTdGF0ZSA9IGV4dGVuZCh7fSwgcmF3U3RhdGUpO1xuICAgICAgdGhpcy5fX19jaGFuZ2VzID0ge307XG4gICAgICB0aGlzLl9fX2NvbXBvbmVudC5fX19xdWV1ZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX19fY2hhbmdlc1tuYW1lXSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIERvbid0IHN0b3JlIHN0YXRlIHByb3BlcnRpZXMgd2l0aCBhbiB1bmRlZmluZWQgb3IgbnVsbCB2YWx1ZVxuICAgICAgZGVsZXRlIHJhd1N0YXRlW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIHN0b3JlIHRoZSBuZXcgdmFsdWUgaW4gdGhlIGNvbXBvbmVudCBzdGF0ZVxuICAgICAgcmF3U3RhdGVbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3JhdztcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cblxudmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vQ29tcG9uZW50XCIpO1xudmFyIEJhc2VTdGF0ZSA9IHJlcXVpcmUoXCIuL1N0YXRlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZUNvbXBvbmVudChkZWYsIHJlbmRlcmVyKSB7XG4gIGlmIChkZWYuX19faXNDb21wb25lbnQpIHtcbiAgICByZXR1cm4gZGVmO1xuICB9XG5cbiAgdmFyIENvbXBvbmVudENsYXNzID0gZnVuY3Rpb24gKCkge307XG4gIHZhciBwcm90bztcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBkZWY7XG5cbiAgaWYgKHR5cGUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcHJvdG8gPSBkZWYucHJvdG90eXBlO1xuICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJvYmplY3RcIikge1xuICAgIHByb3RvID0gZGVmO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvcigpO1xuICB9XG5cbiAgQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlID0gcHJvdG87XG5cbiAgLy8gV2UgZG9uJ3QgdXNlIHRoZSBjb25zdHJ1Y3RvciBwcm92aWRlZCBieSB0aGUgdXNlclxuICAvLyBzaW5jZSB3ZSBkb24ndCBpbnZva2UgdGhlaXIgY29uc3RydWN0b3IgdW50aWxcbiAgLy8gd2UgaGF2ZSBoYWQgYSBjaGFuY2UgdG8gZG8gb3VyIG93biBpbml0aWFsaXphdGlvbi5cbiAgLy8gSW5zdGVhZCwgd2Ugc3RvcmUgdGhlaXIgY29uc3RydWN0b3IgaW4gdGhlIFwiaW5pdENvbXBvbmVudFwiXG4gIC8vIHByb3BlcnR5IGFuZCB0aGF0IG1ldGhvZCBnZXRzIGNhbGxlZCBsYXRlciBpbnNpZGVcbiAgLy8gaW5pdC1jb21wb25lbnRzLWJyb3dzZXIuanNcbiAgZnVuY3Rpb24gQ29tcG9uZW50KGlkKSB7XG4gICAgQmFzZUNvbXBvbmVudC5jYWxsKHRoaXMsIGlkKTtcbiAgfVxuXG4gIGlmICghcHJvdG8uX19faXNDb21wb25lbnQpIHtcbiAgICAvLyBJbmhlcml0IGZyb20gQ29tcG9uZW50IGlmIHRoZXkgZGlkbid0IGFscmVhZHlcbiAgICBpbmhlcml0KENvbXBvbmVudENsYXNzLCBCYXNlQ29tcG9uZW50KTtcbiAgfVxuXG4gIC8vIFRoZSBzYW1lIHByb3RvdHlwZSB3aWxsIGJlIHVzZWQgYnkgb3VyIGNvbnN0cnVjdG9yIGFmdGVyXG4gIC8vIHdlIGhlIGhhdmUgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4gdXNpbmcgdGhlIGluaGVyaXQgZnVuY3Rpb25cbiAgcHJvdG8gPSBDb21wb25lbnQucHJvdG90eXBlID0gQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlO1xuXG4gIC8vIHByb3RvLmNvbnN0cnVjdG9yID0gZGVmLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50O1xuXG4gIC8vIFNldCBhIGZsYWcgb24gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIG1ha2UgaXQgY2xlYXIgdGhpcyBpc1xuICAvLyBhIGNvbXBvbmVudCBzbyB0aGF0IHdlIGNhbiBzaG9ydC1jaXJjdWl0IHRoaXMgd29yayBsYXRlclxuICBDb21wb25lbnQuX19faXNDb21wb25lbnQgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIFN0YXRlKGNvbXBvbmVudCkge1xuICAgIEJhc2VTdGF0ZS5jYWxsKHRoaXMsIGNvbXBvbmVudCk7XG4gIH1cbiAgaW5oZXJpdChTdGF0ZSwgQmFzZVN0YXRlKTtcbiAgcHJvdG8uX19fU3RhdGUgPSBTdGF0ZTtcbiAgcHJvdG8uX19fcmVuZGVyZXIgPSByZW5kZXJlcjtcblxuICByZXR1cm4gQ29tcG9uZW50O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBfX192UHJvcHNCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX3ZFbGVtZW50QnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19jb21wb25lbnRCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX2RldGFjaGVkQnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19rZXlCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX3NzcktleWVkRWxlbWVudHNCeUNvbXBvbmVudElkOiB7fSxcbn07XG4iLCJ2YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBydW50aW1lSWQgPSBjb21wb25lbnRzVXRpbC5fX19ydW50aW1lSWQ7XG52YXIgY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xudmFyIGdldE1hcmtvUHJvcHNGcm9tRWwgPSBjb21wb25lbnRzVXRpbC5fX19nZXRNYXJrb1Byb3BzRnJvbUVsO1xuXG52YXIgVEVYVF9OT0RFID0gMztcblxuLy8gV2UgbWFrZSBvdXIgYmVzdCBlZmZvcnQgdG8gYWxsb3cgbXVsdGlwbGUgbWFya28gcnVudGltZXMgdG8gYmUgbG9hZGVkIGluIHRoZVxuLy8gc2FtZSB3aW5kb3cuIEVhY2ggbWFya28gcnVudGltZSB3aWxsIGdldCBpdHMgb3duIHVuaXF1ZSBydW50aW1lIElELlxudmFyIGxpc3RlbmVyc0F0dGFjaGVkS2V5ID0gXCIkTURFXCIgKyBydW50aW1lSWQ7XG52YXIgZGVsZWdhdGVkRXZlbnRzID0ge307XG5cbmZ1bmN0aW9uIGdldEV2ZW50RnJvbUVsKGVsLCBldmVudE5hbWUpIHtcbiAgdmFyIHZpcnR1YWxQcm9wcyA9IGdldE1hcmtvUHJvcHNGcm9tRWwoZWwpO1xuICB2YXIgZXZlbnRJbmZvID0gdmlydHVhbFByb3BzW2V2ZW50TmFtZV07XG5cbiAgaWYgKHR5cGVvZiBldmVudEluZm8gPT09IFwic3RyaW5nXCIpIHtcbiAgICBldmVudEluZm8gPSBldmVudEluZm8uc3BsaXQoXCIgXCIpO1xuICAgIGlmIChldmVudEluZm9bMl0pIHtcbiAgICAgIGV2ZW50SW5mb1syXSA9IGV2ZW50SW5mb1syXSA9PT0gXCJ0cnVlXCI7XG4gICAgfVxuICAgIGlmIChldmVudEluZm8ubGVuZ3RoID09IDQpIHtcbiAgICAgIGV2ZW50SW5mb1szXSA9IHBhcnNlSW50KGV2ZW50SW5mb1szXSwgMTApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBldmVudEluZm87XG59XG5cbmZ1bmN0aW9uIGRlbGVnYXRlRXZlbnQobm9kZSwgZXZlbnROYW1lLCB0YXJnZXQsIGV2ZW50KSB7XG4gIHZhciB0YXJnZXRNZXRob2QgPSB0YXJnZXRbMF07XG4gIHZhciB0YXJnZXRDb21wb25lbnRJZCA9IHRhcmdldFsxXTtcbiAgdmFyIGlzT25jZSA9IHRhcmdldFsyXTtcbiAgdmFyIGV4dHJhQXJncyA9IHRhcmdldFszXTtcblxuICBpZiAoaXNPbmNlKSB7XG4gICAgdmFyIHZpcnR1YWxQcm9wcyA9IGdldE1hcmtvUHJvcHNGcm9tRWwobm9kZSk7XG4gICAgZGVsZXRlIHZpcnR1YWxQcm9wc1tldmVudE5hbWVdO1xuICB9XG5cbiAgdmFyIHRhcmdldENvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFt0YXJnZXRDb21wb25lbnRJZF07XG5cbiAgaWYgKCF0YXJnZXRDb21wb25lbnQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdGFyZ2V0RnVuYyA9XG4gICAgdHlwZW9mIHRhcmdldE1ldGhvZCA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHRhcmdldE1ldGhvZFxuICAgICAgOiB0YXJnZXRDb21wb25lbnRbdGFyZ2V0TWV0aG9kXTtcbiAgaWYgKCF0YXJnZXRGdW5jKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJNZXRob2Qgbm90IGZvdW5kOiBcIiArIHRhcmdldE1ldGhvZCk7XG4gIH1cblxuICBpZiAoZXh0cmFBcmdzICE9IG51bGwpIHtcbiAgICBpZiAodHlwZW9mIGV4dHJhQXJncyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZXh0cmFBcmdzID0gdGFyZ2V0Q29tcG9uZW50Ll9fX2J1YmJsaW5nRG9tRXZlbnRzW2V4dHJhQXJnc107XG4gICAgfVxuICB9XG5cbiAgLy8gSW52b2tlIHRoZSBjb21wb25lbnQgbWV0aG9kXG4gIGlmIChleHRyYUFyZ3MpIHtcbiAgICB0YXJnZXRGdW5jLmFwcGx5KHRhcmdldENvbXBvbmVudCwgZXh0cmFBcmdzLmNvbmNhdChldmVudCwgbm9kZSkpO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldEZ1bmMuY2FsbCh0YXJnZXRDb21wb25lbnQsIGV2ZW50LCBub2RlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIoZXZlbnRUeXBlKSB7XG4gIGlmICghZGVsZWdhdGVkRXZlbnRzW2V2ZW50VHlwZV0pIHtcbiAgICBkZWxlZ2F0ZWRFdmVudHNbZXZlbnRUeXBlXSA9IHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyVG9Ib3N0KGV2ZW50VHlwZSwgaG9zdCkge1xuICB2YXIgbGlzdGVuZXJzID0gKGhvc3RbbGlzdGVuZXJzQXR0YWNoZWRLZXldID1cbiAgICBob3N0W2xpc3RlbmVyc0F0dGFjaGVkS2V5XSB8fCB7fSk7XG4gIGlmICghbGlzdGVuZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAoaG9zdC5ib2R5IHx8IGhvc3QpLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBldmVudFR5cGUsXG4gICAgICAobGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGN1ck5vZGUgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmICghY3VyTm9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ck5vZGUgPVxuICAgICAgICAgIC8vIGV2ZW50LnRhcmdldCBvZiBhbiBTVkdFbGVtZW50SW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBhXG4gICAgICAgICAgLy8gYGdldEF0dHJpYnV0ZWAgZnVuY3Rpb24gaW4gSUUgMTEuXG4gICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrby1qcy9tYXJrby9pc3N1ZXMvNzk2XG4gICAgICAgICAgY3VyTm9kZS5jb3JyZXNwb25kaW5nVXNlRWxlbWVudCB8fFxuICAgICAgICAgIC8vIGluIHNvbWUgYnJvd3NlcnMgdGhlIGV2ZW50IHRhcmdldCBjYW4gYmUgYSB0ZXh0IG5vZGVcbiAgICAgICAgICAvLyBvbmUgZXhhbXBsZSBiZWluZyBkcmFnZW50ZXIgaW4gZmlyZWZveC5cbiAgICAgICAgICAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gVEVYVF9OT0RFID8gY3VyTm9kZS5wYXJlbnROb2RlIDogY3VyTm9kZSk7XG5cbiAgICAgICAgLy8gU2VhcmNoIHVwIHRoZSB0cmVlIGxvb2tpbmcgRE9NIGV2ZW50cyBtYXBwZWQgdG8gdGFyZ2V0XG4gICAgICAgIC8vIGNvbXBvbmVudCBtZXRob2RzXG4gICAgICAgIHZhciBwcm9wTmFtZSA9IFwib25cIiArIGV2ZW50VHlwZTtcbiAgICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgICAvLyBBdHRyaWJ1dGVzIHdpbGwgaGF2ZSB0aGUgZm9sbG93aW5nIGZvcm06XG4gICAgICAgIC8vIG9uPGV2ZW50X3R5cGU+KFwiPHRhcmdldF9tZXRob2Q+fDxjb21wb25lbnRfaWQ+XCIpXG5cbiAgICAgICAgaWYgKGV2ZW50LmJ1YmJsZXMpIHtcbiAgICAgICAgICB2YXIgcHJvcGFnYXRpb25TdG9wcGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAvLyBNb25rZXktcGF0Y2ggdG8gZml4ICM5N1xuICAgICAgICAgIHZhciBvbGRTdG9wUHJvcGFnYXRpb24gPSBldmVudC5zdG9wUHJvcGFnYXRpb247XG5cbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvbGRTdG9wUHJvcGFnYXRpb24uY2FsbChldmVudCk7XG4gICAgICAgICAgICBwcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoKHRhcmdldCA9IGdldEV2ZW50RnJvbUVsKGN1ck5vZGUsIHByb3BOYW1lKSkpIHtcbiAgICAgICAgICAgICAgZGVsZWdhdGVFdmVudChjdXJOb2RlLCBwcm9wTmFtZSwgdGFyZ2V0LCBldmVudCk7XG5cbiAgICAgICAgICAgICAgaWYgKHByb3BhZ2F0aW9uU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSB3aGlsZSAoKGN1ck5vZGUgPSBjdXJOb2RlLnBhcmVudE5vZGUpICYmIGN1ck5vZGUuZ2V0QXR0cmlidXRlKTtcbiAgICAgICAgfSBlbHNlIGlmICgodGFyZ2V0ID0gZ2V0RXZlbnRGcm9tRWwoY3VyTm9kZSwgcHJvcE5hbWUpKSkge1xuICAgICAgICAgIGRlbGVnYXRlRXZlbnQoY3VyTm9kZSwgcHJvcE5hbWUsIHRhcmdldCwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRydWUsXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuZXhwb3J0cy5fX19oYW5kbGVOb2RlQXR0YWNoID0gbm9vcDtcbmV4cG9ydHMuX19faGFuZGxlTm9kZURldGFjaCA9IG5vb3A7XG5leHBvcnRzLl9fX2RlbGVnYXRlRXZlbnQgPSBkZWxlZ2F0ZUV2ZW50O1xuZXhwb3J0cy5fX19nZXRFdmVudEZyb21FbCA9IGdldEV2ZW50RnJvbUVsO1xuZXhwb3J0cy5fX19hZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIgPSBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXI7XG5leHBvcnRzLl9fX2luaXQgPSBmdW5jdGlvbiAoaG9zdCkge1xuICBPYmplY3Qua2V5cyhkZWxlZ2F0ZWRFdmVudHMpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50VHlwZSkge1xuICAgIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlclRvSG9zdChldmVudFR5cGUsIGhvc3QpO1xuICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy1yZWdpc3RyeVwiKTtcbiIsInZhciBjb3B5UHJvcHMgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvY29weVByb3BzXCIpO1xudmFyIGJlZ2luQ29tcG9uZW50ID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLWJlZ2luQ29tcG9uZW50XCIpO1xudmFyIGVuZENvbXBvbmVudCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy1lbmRDb21wb25lbnRcIik7XG52YXIgcmVnaXN0cnkgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtcmVnaXN0cnlcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBjb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG5cbnZhciBDb21wb25lbnRzQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbXBvbmVudHNDb250ZXh0XCIpO1xudmFyIGdldENvbXBvbmVudHNDb250ZXh0ID0gQ29tcG9uZW50c0NvbnRleHQuX19fZ2V0Q29tcG9uZW50c0NvbnRleHQ7XG52YXIgaXNTZXJ2ZXIgPSBjb21wb25lbnRzVXRpbC5fX19pc1NlcnZlciA9PT0gdHJ1ZTtcblxudmFyIENPTVBPTkVOVF9CRUdJTl9BU1lOQ19BRERFRF9LRVkgPSBcIiR3YVwiO1xuXG5mdW5jdGlvbiByZXNvbHZlQ29tcG9uZW50S2V5KGtleSwgcGFyZW50Q29tcG9uZW50RGVmKSB7XG4gIGlmIChrZXlbMF0gPT09IFwiI1wiKSB7XG4gICAgcmV0dXJuIGtleS5zdWJzdHJpbmcoMSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhcmVudENvbXBvbmVudERlZi5pZCArIFwiLVwiICsgcGFyZW50Q29tcG9uZW50RGVmLl9fX25leHRLZXkoa2V5KTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFja0FzeW5jQ29tcG9uZW50cyhvdXQpIHtcbiAgaWYgKG91dC5pc1N5bmMoKSB8fCBvdXQuZ2xvYmFsW0NPTVBPTkVOVF9CRUdJTl9BU1lOQ19BRERFRF9LRVldKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb3V0Lm9uKFwiYmVnaW5Bc3luY1wiLCBoYW5kbGVCZWdpbkFzeW5jKTtcbiAgb3V0Lm9uKFwiYmVnaW5EZXRhY2hlZEFzeW5jXCIsIGhhbmRsZUJlZ2luRGV0YWNoZWRBc3luYyk7XG4gIG91dC5nbG9iYWxbQ09NUE9ORU5UX0JFR0lOX0FTWU5DX0FEREVEX0tFWV0gPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVCZWdpbkFzeW5jKGV2ZW50KSB7XG4gIHZhciBwYXJlbnRPdXQgPSBldmVudC5wYXJlbnRPdXQ7XG4gIHZhciBhc3luY091dCA9IGV2ZW50Lm91dDtcbiAgdmFyIGNvbXBvbmVudHNDb250ZXh0ID0gcGFyZW50T3V0Ll9fX2NvbXBvbmVudHM7XG5cbiAgaWYgKGNvbXBvbmVudHNDb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBXZSBhcmUgZ29pbmcgdG8gc3RhcnQgYSBuZXN0ZWQgQ29tcG9uZW50c0NvbnRleHRcbiAgICBhc3luY091dC5fX19jb21wb25lbnRzID0gbmV3IENvbXBvbmVudHNDb250ZXh0KGFzeW5jT3V0LCBjb21wb25lbnRzQ29udGV4dCk7XG4gIH1cbiAgLy8gQ2FycnkgYWxvbmcgdGhlIGNvbXBvbmVudCBhcmd1bWVudHNcbiAgYXN5bmNPdXQuYyhcbiAgICBwYXJlbnRPdXQuX19fYXNzaWduZWRDb21wb25lbnREZWYsXG4gICAgcGFyZW50T3V0Ll9fX2Fzc2lnbmVkS2V5LFxuICAgIHBhcmVudE91dC5fX19hc3NpZ25lZEN1c3RvbUV2ZW50cyxcbiAgKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQmVnaW5EZXRhY2hlZEFzeW5jKGV2ZW50KSB7XG4gIHZhciBhc3luY091dCA9IGV2ZW50Lm91dDtcbiAgaGFuZGxlQmVnaW5Bc3luYyhldmVudCk7XG4gIGFzeW5jT3V0Lm9uKFwiYmVnaW5Bc3luY1wiLCBoYW5kbGVCZWdpbkFzeW5jKTtcbiAgYXN5bmNPdXQub24oXCJiZWdpbkRldGFjaGVkQXN5bmNcIiwgaGFuZGxlQmVnaW5EZXRhY2hlZEFzeW5jKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUmVuZGVyZXJGdW5jKFxuICB0ZW1wbGF0ZVJlbmRlckZ1bmMsXG4gIGNvbXBvbmVudFByb3BzLFxuICByZW5kZXJpbmdMb2dpYyxcbikge1xuICB2YXIgb25JbnB1dCA9IHJlbmRlcmluZ0xvZ2ljICYmIHJlbmRlcmluZ0xvZ2ljLm9uSW5wdXQ7XG4gIHZhciB0eXBlTmFtZSA9IGNvbXBvbmVudFByb3BzLnQ7XG4gIHZhciBpc1NwbGl0ID0gY29tcG9uZW50UHJvcHMucyA9PT0gdHJ1ZTtcbiAgdmFyIGlzSW1wbGljaXRDb21wb25lbnQgPSBjb21wb25lbnRQcm9wcy5pID09PSB0cnVlO1xuXG4gIHZhciBzaG91bGRBcHBseVNwbGl0TWl4aW5zID0gcmVuZGVyaW5nTG9naWMgJiYgaXNTcGxpdDtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBpZiAoIWNvbXBvbmVudFByb3BzLmQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJDb21wb25lbnQgd2FzIGNvbXBpbGVkIGluIGEgZGlmZmVyZW50IE5PREVfRU5WIHRoYW4gdGhlIE1hcmtvIHJ1bnRpbWUgaXMgdXNpbmcuXCIsXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIGlmIChjb21wb25lbnRQcm9wcy5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUnVudGltZS9OT0RFX0VOViBNaXNtYXRjaFwiKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiByZW5kZXJlcihpbnB1dCwgb3V0KSB7XG4gICAgdHJhY2tBc3luY0NvbXBvbmVudHMob3V0KTtcblxuICAgIHZhciBjb21wb25lbnRzQ29udGV4dCA9IGdldENvbXBvbmVudHNDb250ZXh0KG91dCk7XG4gICAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcblxuICAgIHZhciBjb21wb25lbnQgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZXJlbmRlckNvbXBvbmVudDtcbiAgICB2YXIgaXNSZXJlbmRlciA9IGNvbXBvbmVudCAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpZDtcbiAgICB2YXIgaXNFeGlzdGluZztcbiAgICB2YXIgY3VzdG9tRXZlbnRzO1xuICAgIHZhciBwYXJlbnRDb21wb25lbnREZWYgPSBjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWY7XG4gICAgdmFyIG93bmVyQ29tcG9uZW50RGVmID0gb3V0Ll9fX2Fzc2lnbmVkQ29tcG9uZW50RGVmO1xuICAgIHZhciBvd25lckNvbXBvbmVudElkID0gb3duZXJDb21wb25lbnREZWYgJiYgb3duZXJDb21wb25lbnREZWYuaWQ7XG4gICAgdmFyIGtleSA9IG91dC5fX19hc3NpZ25lZEtleTtcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIC8vIElmIGNvbXBvbmVudCBpcyBwcm92aWRlZCB0aGVuIHdlIGFyZSBjdXJyZW50bHkgcmVuZGVyaW5nXG4gICAgICAvLyB0aGUgdG9wLWxldmVsIFVJIGNvbXBvbmVudCBhcyBwYXJ0IG9mIGEgcmUtcmVuZGVyXG4gICAgICBpZCA9IGNvbXBvbmVudC5pZDsgLy8gV2Ugd2lsbCB1c2UgdGhlIElEIG9mIHRoZSBjb21wb25lbnQgYmVpbmcgcmUtcmVuZGVyZWRcbiAgICAgIGlzRXhpc3RpbmcgPSB0cnVlOyAvLyBUaGlzIGlzIGEgcmUtcmVuZGVyIHNvIHdlIGtub3cgdGhlIGNvbXBvbmVudCBpcyBhbHJlYWR5IGluIHRoZSBET01cbiAgICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlcmVuZGVyQ29tcG9uZW50ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBhcmUgcmVuZGVyaW5nIGEgbmVzdGVkIFVJIGNvbXBvbmVudC4gV2Ugd2lsbCBuZWVkXG4gICAgICAvLyB0byBtYXRjaCB1cCB0aGUgVUkgY29tcG9uZW50IHdpdGggdGhlIGNvbXBvbmVudCBhbHJlYWR5IGluIHRoZVxuICAgICAgLy8gRE9NIChpZiBhbnkpIHNvIHdlIHdpbGwgbmVlZCB0byByZXNvbHZlIHRoZSBjb21wb25lbnQgSUQgZnJvbVxuICAgICAgLy8gdGhlIGFzc2lnbmVkIGtleS4gV2UgYWxzbyBuZWVkIHRvIGhhbmRsZSBhbnkgY3VzdG9tIGV2ZW50IGJpbmRpbmdzXG4gICAgICAvLyB0aGF0IHdlcmUgcHJvdmlkZWQuXG4gICAgICBpZiAocGFyZW50Q29tcG9uZW50RGVmKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb21wb25lbnRBcmdzOicsIGNvbXBvbmVudEFyZ3MpO1xuICAgICAgICBjdXN0b21FdmVudHMgPSBvdXQuX19fYXNzaWduZWRDdXN0b21FdmVudHM7XG5cbiAgICAgICAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgICAgICAgaWQgPSByZXNvbHZlQ29tcG9uZW50S2V5KGtleS50b1N0cmluZygpLCBwYXJlbnRDb21wb25lbnREZWYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlkID0gcGFyZW50Q29tcG9uZW50RGVmLl9fX25leHRDb21wb25lbnRJZCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZCA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX25leHRDb21wb25lbnRJZCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1NlcnZlcikge1xuICAgICAgLy8gSWYgd2UgYXJlIHJlbmRlcmluZyBvbiB0aGUgc2VydmVyIHRoZW4gdGhpbmdzIGFyZSBzaW1wbGllciBzaW5jZVxuICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBtYXRjaCB1cCB0aGUgVUkgY29tcG9uZW50IHdpdGggYSBwcmV2aW91c2x5XG4gICAgICAvLyByZW5kZXJlZCBjb21wb25lbnQgYWxyZWFkeSBtb3VudGVkIHRvIHRoZSBET00uIFdlIGFsc28gY3JlYXRlXG4gICAgICAvLyBhIGxpZ2h0d2VpZ2h0IFNlcnZlckNvbXBvbmVudFxuICAgICAgY29tcG9uZW50ID0gcmVnaXN0cnkuX19fY3JlYXRlQ29tcG9uZW50KFxuICAgICAgICByZW5kZXJpbmdMb2dpYyxcbiAgICAgICAgaWQsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBvdXQsXG4gICAgICAgIHR5cGVOYW1lLFxuICAgICAgICBjdXN0b21FdmVudHMsXG4gICAgICAgIG93bmVyQ29tcG9uZW50SWQsXG4gICAgICApO1xuXG4gICAgICAvLyBUaGlzIGlzIHRoZSBmaW5hbCBpbnB1dCBhZnRlciBydW5uaW5nIHRoZSBsaWZlY3ljbGUgbWV0aG9kcy5cbiAgICAgIC8vIFdlIHdpbGwgYmUgcGFzc2luZyB0aGUgaW5wdXQgdG8gdGhlIHRlbXBsYXRlIGZvciB0aGUgYGlucHV0YCBwYXJhbVxuICAgICAgaW5wdXQgPSBjb21wb25lbnQuX19fdXBkYXRlZElucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNSZXJlbmRlciAmJlxuICAgICAgICAgIChjb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbaWRdKSAmJlxuICAgICAgICAgIGNvbXBvbmVudC5fX190eXBlICE9PSB0eXBlTmFtZVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBEZXN0cm95IHRoZSBleGlzdGluZyBjb21wb25lbnQgc2luY2VcbiAgICAgICAgICBjb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICAgIGNvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICBpc0V4aXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc0V4aXN0aW5nID0gZmFsc2U7XG4gICAgICAgICAgLy8gV2UgbmVlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudFxuICAgICAgICAgIGNvbXBvbmVudCA9IHJlZ2lzdHJ5Ll9fX2NyZWF0ZUNvbXBvbmVudCh0eXBlTmFtZSwgaWQpO1xuXG4gICAgICAgICAgaWYgKHNob3VsZEFwcGx5U3BsaXRNaXhpbnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNob3VsZEFwcGx5U3BsaXRNaXhpbnMgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIHJlbmRlcmluZ0xvZ2ljUHJvcHMgPVxuICAgICAgICAgICAgICB0eXBlb2YgcmVuZGVyaW5nTG9naWMgPT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICAgPyByZW5kZXJpbmdMb2dpYy5wcm90b3R5cGVcbiAgICAgICAgICAgICAgICA6IHJlbmRlcmluZ0xvZ2ljO1xuXG4gICAgICAgICAgICBjb3B5UHJvcHMocmVuZGVyaW5nTG9naWNQcm9wcywgY29tcG9uZW50LmNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoaXMgZmxhZyB0byBwcmV2ZW50IHRoZSBjb21wb25lbnQgZnJvbSBiZWluZyBxdWV1ZWQgZm9yIHVwZGF0ZVxuICAgICAgICAvLyBiYXNlZCBvbiB0aGUgbmV3IGlucHV0LiBUaGUgY29tcG9uZW50IGlzIGFib3V0IHRvIGJlIHJlcmVuZGVyZWRcbiAgICAgICAgLy8gc28gd2UgZG9uJ3Qgd2FudCB0byBxdWV1ZSBpdCB1cCBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBzZXRJbnB1dCgpYFxuICAgICAgICBjb21wb25lbnQuX19fdXBkYXRlUXVldWVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoY3VzdG9tRXZlbnRzKSB7XG4gICAgICAgICAgY29tcG9uZW50Ll9fX3NldEN1c3RvbUV2ZW50cyhjdXN0b21FdmVudHMsIG93bmVyQ29tcG9uZW50SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRXhpc3RpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgY29tcG9uZW50Ll9fX2VtaXRDcmVhdGUoaW5wdXQsIG91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGNvbXBvbmVudC5fX19zZXRJbnB1dChpbnB1dCwgb25JbnB1dCwgb3V0KTtcblxuICAgICAgICBpZiAoaXNFeGlzdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX19pc0RpcnR5ID09PSBmYWxzZSB8fFxuICAgICAgICAgICAgY29tcG9uZW50LnNob3VsZFVwZGF0ZShpbnB1dCwgY29tcG9uZW50Ll9fX3N0YXRlKSA9PT0gZmFsc2VcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIFdlIHB1dCBhIHBsYWNlaG9sZGVyIGVsZW1lbnQgaW4gdGhlIG91dHB1dCBzdHJlYW0gdG8gZW5zdXJlIHRoYXQgdGhlIGV4aXN0aW5nXG4gICAgICAgICAgICAvLyBET00gbm9kZSBpcyBtYXRjaGVkIHVwIGNvcnJlY3RseSB3aGVuIHVzaW5nIG1vcnBoZG9tLiBXZSBmbGFnIHRoZSBWRWxlbWVudFxuICAgICAgICAgICAgLy8gbm9kZSB0byB0cmFjayB0aGF0IGl0IGlzIGEgcHJlc2VydmUgbWFya2VyXG4gICAgICAgICAgICBvdXQuX19fcHJlc2VydmVDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX19yZXNldCgpOyAvLyBUaGUgY29tcG9uZW50IGlzIG5vIGxvbmdlciBkaXJ0eSBzbyByZXNldCBpbnRlcm5hbCBmbGFnc1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb21wb25lbnQuX19fZ2xvYmFsID0gb3V0Lmdsb2JhbDtcbiAgICAgIGNvbXBvbmVudC5fX19lbWl0UmVuZGVyKG91dCk7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBvbmVudERlZiA9IGJlZ2luQ29tcG9uZW50KFxuICAgICAgY29tcG9uZW50c0NvbnRleHQsXG4gICAgICBjb21wb25lbnQsXG4gICAgICBrZXksXG4gICAgICBvd25lckNvbXBvbmVudERlZixcbiAgICAgIGlzU3BsaXQsXG4gICAgICBpc0ltcGxpY2l0Q29tcG9uZW50LFxuICAgICk7XG5cbiAgICBjb21wb25lbnREZWYuX19faXNFeGlzdGluZyA9IGlzRXhpc3Rpbmc7XG5cbiAgICAvLyBSZW5kZXIgdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29tcG9uZW50IHVzaW5nIHRoZSBmaW5hbCB0ZW1wbGF0ZVxuICAgIC8vIGRhdGEgdGhhdCB3ZSBjb25zdHJ1Y3RlZFxuICAgIHRlbXBsYXRlUmVuZGVyRnVuYyhcbiAgICAgIGlucHV0LFxuICAgICAgb3V0LFxuICAgICAgY29tcG9uZW50RGVmLFxuICAgICAgY29tcG9uZW50LFxuICAgICAgY29tcG9uZW50Ll9fX3Jhd1N0YXRlLFxuICAgICAgb3V0Lmdsb2JhbCxcbiAgICApO1xuXG4gICAgZW5kQ29tcG9uZW50KG91dCwgY29tcG9uZW50RGVmKTtcbiAgICBjb21wb25lbnRzQ29udGV4dC5fX19jb21wb25lbnREZWYgPSBwYXJlbnRDb21wb25lbnREZWY7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmVuZGVyZXJGdW5jO1xuXG4vLyBleHBvcnRzIHVzZWQgYnkgdGhlIGxlZ2FjeSByZW5kZXJlclxuY3JlYXRlUmVuZGVyZXJGdW5jLl9fX3Jlc29sdmVDb21wb25lbnRLZXkgPSByZXNvbHZlQ29tcG9uZW50S2V5O1xuY3JlYXRlUmVuZGVyZXJGdW5jLl9fX3RyYWNrQXN5bmNDb21wb25lbnRzID0gdHJhY2tBc3luY0NvbXBvbmVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHVwZGF0ZXNTY2hlZHVsZWQgPSBmYWxzZTtcbnZhciBiYXRjaFN0YWNrID0gW107IC8vIEEgc3RhY2sgb2YgYmF0Y2hlZCB1cGRhdGVzXG52YXIgdW5iYXRjaGVkUXVldWUgPSBbXTsgLy8gVXNlZCBmb3Igc2NoZWR1bGVkIGJhdGNoZWQgdXBkYXRlc1xuXG52YXIgc2V0SW1tZWRpYXRlID0gcmVxdWlyZShcIkBpbnRlcm5hbC9zZXQtaW1tZWRpYXRlXCIpLl9fX3NldEltbWVkaWF0ZTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHdlIHNjaGVkdWxlIHRoZSB1cGRhdGUgb2YgXCJ1bmJhdGNoZWRcIlxuICogdXBkYXRlcyB0byBjb21wb25lbnRzLlxuICovXG5mdW5jdGlvbiB1cGRhdGVVbmJhdGNoZWRDb21wb25lbnRzKCkge1xuICBpZiAodW5iYXRjaGVkUXVldWUubGVuZ3RoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHVwZGF0ZUNvbXBvbmVudHModW5iYXRjaGVkUXVldWUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBSZXNldCB0aGUgZmxhZyBub3cgdGhhdCB0aGlzIHNjaGVkdWxlZCBiYXRjaCB1cGRhdGVcbiAgICAgIC8vIGlzIGNvbXBsZXRlIHNvIHRoYXQgd2UgY2FuIGxhdGVyIHNjaGVkdWxlIGFub3RoZXJcbiAgICAgIC8vIGJhdGNoZWQgdXBkYXRlIGlmIG5lZWRlZFxuICAgICAgdXBkYXRlc1NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzY2hlZHVsZVVwZGF0ZXMoKSB7XG4gIGlmICh1cGRhdGVzU2NoZWR1bGVkKSB7XG4gICAgLy8gV2UgaGF2ZSBhbHJlYWR5IHNjaGVkdWxlZCBhIGJhdGNoZWQgdXBkYXRlIGZvciB0aGVcbiAgICAvLyBuZXh0VGljayBzbyBub3RoaW5nIHRvIGRvXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdXBkYXRlc1NjaGVkdWxlZCA9IHRydWU7XG5cbiAgc2V0SW1tZWRpYXRlKHVwZGF0ZVVuYmF0Y2hlZENvbXBvbmVudHMpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDb21wb25lbnRzKHF1ZXVlKSB7XG4gIC8vIExvb3Agb3ZlciB0aGUgY29tcG9uZW50cyBpbiB0aGUgcXVldWUgYW5kIHVwZGF0ZSB0aGVtLlxuICAvLyBOT1RFOiBJdCBpcyBva2F5IGlmIHRoZSBxdWV1ZSBncm93cyBkdXJpbmcgdGhlIGl0ZXJhdGlvblxuICAvLyAgICAgICBzaW5jZSB3ZSB3aWxsIHN0aWxsIGdldCB0byB0aGVtIGF0IHRoZSBlbmRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjb21wb25lbnQgPSBxdWV1ZVtpXTtcbiAgICBjb21wb25lbnQuX19fdXBkYXRlKCk7IC8vIERvIHRoZSBhY3R1YWwgY29tcG9uZW50IHVwZGF0ZVxuICB9XG5cbiAgLy8gQ2xlYXIgb3V0IHRoZSBxdWV1ZSBieSBzZXR0aW5nIHRoZSBsZW5ndGggdG8gemVyb1xuICBxdWV1ZS5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBiYXRjaFVwZGF0ZShmdW5jKSB7XG4gIC8vIElmIHRoZSBiYXRjaGVkIHVwZGF0ZSBzdGFjayBpcyBlbXB0eSB0aGVuIHRoaXNcbiAgLy8gaXMgdGhlIG91dGVyIGJhdGNoZWQgdXBkYXRlLiBBZnRlciB0aGUgb3V0ZXJcbiAgLy8gYmF0Y2hlZCB1cGRhdGUgY29tcGxldGVzIHdlIGludm9rZSB0aGUgXCJhZnRlclVwZGF0ZVwiXG4gIC8vIGV2ZW50IGxpc3RlbmVycy5cbiAgdmFyIGJhdGNoID0gW107XG5cbiAgYmF0Y2hTdGFjay5wdXNoKGJhdGNoKTtcblxuICB0cnkge1xuICAgIGZ1bmMoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgLy8gVXBkYXRlIGFsbCBvZiB0aGUgY29tcG9uZW50cyB0aGF0IHdoZXJlIHF1ZXVlZCB1cFxuICAgICAgLy8gaW4gdGhpcyBiYXRjaCAoaWYgYW55KVxuICAgICAgdXBkYXRlQ29tcG9uZW50cyhiYXRjaCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgY29tcGxldGVkIHRoZSB1cGRhdGUgb2YgYWxsIHRoZSBjb21wb25lbnRzXG4gICAgICAvLyBpbiB0aGlzIGJhdGNoIHdlIG5lZWQgdG8gcmVtb3ZlIGl0IG9mZiB0aGUgdG9wIG9mIHRoZSBzdGFja1xuICAgICAgYmF0Y2hTdGFjay5sZW5ndGgtLTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcXVldWVDb21wb25lbnRVcGRhdGUoY29tcG9uZW50KSB7XG4gIHZhciBiYXRjaFN0YWNrTGVuID0gYmF0Y2hTdGFjay5sZW5ndGg7XG5cbiAgaWYgKGJhdGNoU3RhY2tMZW4pIHtcbiAgICAvLyBXaGVuIGEgYmF0Y2ggdXBkYXRlIGlzIHN0YXJ0ZWQgd2UgcHVzaCBhIG5ldyBiYXRjaCBvbiB0byBhIHN0YWNrLlxuICAgIC8vIElmIHRoZSBzdGFjayBoYXMgYSBub24temVybyBsZW5ndGggdGhlbiB3ZSBrbm93IHRoYXQgYSBiYXRjaCBoYXNcbiAgICAvLyBiZWVuIHN0YXJ0ZWQgc28gd2UgY2FuIGp1c3QgcXVldWUgdGhlIGNvbXBvbmVudCBvbiB0aGUgdG9wIGJhdGNoLiBXaGVuXG4gICAgLy8gdGhlIGJhdGNoIGlzIGVuZGVkIHRoaXMgY29tcG9uZW50IHdpbGwgYmUgdXBkYXRlZC5cbiAgICBiYXRjaFN0YWNrW2JhdGNoU3RhY2tMZW4gLSAxXS5wdXNoKGNvbXBvbmVudCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gV2UgYXJlIG5vdCB3aXRoaW4gYSBiYXRjaGVkIHVwZGF0ZS4gV2UgbmVlZCB0byBzY2hlZHVsZSBhIGJhdGNoIHVwZGF0ZVxuICAgIC8vIGZvciB0aGUgbmV4dFRpY2sgKGlmIHRoYXQgaGFzbid0IGJlZW4gZG9uZSBhbHJlYWR5KSBhbmQgd2Ugd2lsbFxuICAgIC8vIGFkZCB0aGUgY29tcG9uZW50IHRvIHRoZSB1bmJhdGNoZWQgcXVldWVcbiAgICBzY2hlZHVsZVVwZGF0ZXMoKTtcbiAgICB1bmJhdGNoZWRRdWV1ZS5wdXNoKGNvbXBvbmVudCk7XG4gIH1cbn1cblxuZXhwb3J0cy5fX19xdWV1ZUNvbXBvbmVudFVwZGF0ZSA9IHF1ZXVlQ29tcG9uZW50VXBkYXRlO1xuZXhwb3J0cy5fX19iYXRjaFVwZGF0ZSA9IGJhdGNoVXBkYXRlO1xuIiwidmFyIGFjdHVhbENyZWF0ZU91dDtcblxuZnVuY3Rpb24gc2V0Q3JlYXRlT3V0KGNyZWF0ZU91dEZ1bmMpIHtcbiAgYWN0dWFsQ3JlYXRlT3V0ID0gY3JlYXRlT3V0RnVuYztcbn1cblxuZnVuY3Rpb24gY3JlYXRlT3V0KGdsb2JhbERhdGEpIHtcbiAgcmV0dXJuIGFjdHVhbENyZWF0ZU91dChnbG9iYWxEYXRhKTtcbn1cblxuY3JlYXRlT3V0Ll9fX3NldENyZWF0ZU91dCA9IHNldENyZWF0ZU91dDtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVPdXQ7XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlID0gY29tcG9uZW50c1V0aWwuX19fZGVzdHJveUNvbXBvbmVudEZvck5vZGU7XG52YXIgZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBjb21wb25lbnRzVXRpbC5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4vdmRvbS9tb3JwaGRvbS9oZWxwZXJzXCIpO1xuXG52YXIgaW5zZXJ0QmVmb3JlID0gaGVscGVycy5fX19pbnNlcnRCZWZvcmU7XG52YXIgaW5zZXJ0QWZ0ZXIgPSBoZWxwZXJzLl9fX2luc2VydEFmdGVyO1xudmFyIHJlbW92ZUNoaWxkID0gaGVscGVycy5fX19yZW1vdmVDaGlsZDtcblxuZnVuY3Rpb24gcmVzb2x2ZUVsKGVsKSB7XG4gIGlmICh0eXBlb2YgZWwgPT0gXCJzdHJpbmdcIikge1xuICAgIHZhciBlbElkID0gZWw7XG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbElkKTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIk5vdCBmb3VuZDogXCIgKyBlbElkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBiZWZvcmVSZW1vdmUocmVmZXJlbmNlRWwpIHtcbiAgZGVzdHJveU5vZGVSZWN1cnNpdmUocmVmZXJlbmNlRWwpO1xuICBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZShyZWZlcmVuY2VFbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgZ2V0RWwsIGFmdGVySW5zZXJ0KSB7XG4gIGV4dGVuZCh0YXJnZXQsIHtcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIG51bGwsIHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICBwcmVwZW5kVG86IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VFbC5maXJzdENoaWxkIHx8IG51bGwsIHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICByZXBsYWNlOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICAgIGJlZm9yZVJlbW92ZShyZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZUVsLCByZWZlcmVuY2VFbC5wYXJlbnROb2RlKTtcbiAgICAgIHJlbW92ZUNoaWxkKHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICByZXBsYWNlQ2hpbGRyZW5PZjogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG5cbiAgICAgIHZhciBjdXJDaGlsZCA9IHJlZmVyZW5jZUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7IC8vIEp1c3QgaW4gY2FzZSB0aGUgRE9NIGNoYW5nZXMgd2hpbGUgcmVtb3ZpbmdcbiAgICAgICAgYmVmb3JlUmVtb3ZlKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0U2libGluZztcbiAgICAgIH1cblxuICAgICAgcmVmZXJlbmNlRWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIGluc2VydEJlZm9yZShlbCwgbnVsbCwgcmVmZXJlbmNlRWwpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZUVsLCByZWZlcmVuY2VFbC5wYXJlbnROb2RlKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRBZnRlcihlbCwgcmVmZXJlbmNlRWwsIHJlZmVyZW5jZUVsLnBhcmVudE5vZGUpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICB9KTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNhbWVsVG9EYXNoTG9va3VwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbnZhciBkYXNoVG9DYW1lbExvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICogSGVscGVyIGZvciBjb252ZXJ0aW5nIGNhbWVsQ2FzZSB0byBkYXNoLWNhc2UuXG4gKi9cbmV4cG9ydHMuX19fY2FtZWxUb0Rhc2hDYXNlID0gZnVuY3Rpb24gY2FtZWxUb0Rhc2hDYXNlKG5hbWUpIHtcbiAgdmFyIG5hbWVEYXNoZWQgPSBjYW1lbFRvRGFzaExvb2t1cFtuYW1lXTtcbiAgaWYgKCFuYW1lRGFzaGVkKSB7XG4gICAgbmFtZURhc2hlZCA9IGNhbWVsVG9EYXNoTG9va3VwW25hbWVdID0gbmFtZVxuICAgICAgLnJlcGxhY2UoLyhbQS1aXSkvZywgXCItJDFcIilcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKG5hbWVEYXNoZWQgIT09IG5hbWUpIHtcbiAgICAgIGRhc2hUb0NhbWVsTG9va3VwW25hbWVEYXNoZWRdID0gbmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZURhc2hlZDtcbn07XG5cbi8qKlxuICogSGVscGVyIGZvciBjb252ZXJ0aW5nIGRhc2gtY2FzZSB0byBjYW1lbENhc2UuXG4gKi9cbmV4cG9ydHMuX19fZGFzaFRvQ2FtZWxDYXNlID0gZnVuY3Rpb24gZGFzaFRvQ2FtZWxDYXNlKG5hbWUpIHtcbiAgdmFyIG5hbWVDYW1lbCA9IGRhc2hUb0NhbWVsTG9va3VwW25hbWVdO1xuICBpZiAoIW5hbWVDYW1lbCkge1xuICAgIG5hbWVDYW1lbCA9IGRhc2hUb0NhbWVsTG9va3VwW25hbWVdID0gbmFtZS5yZXBsYWNlKFxuICAgICAgLy0oW2Etel0pL2csXG4gICAgICBtYXRjaFRvVXBwZXJDYXNlLFxuICAgICk7XG5cbiAgICBpZiAobmFtZUNhbWVsICE9PSBuYW1lKSB7XG4gICAgICBjYW1lbFRvRGFzaExvb2t1cFtuYW1lQ2FtZWxdID0gbmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZUNhbWVsO1xufTtcblxuZnVuY3Rpb24gbWF0Y2hUb1VwcGVyQ2FzZShfLCBjaGFyKSB7XG4gIHJldHVybiBjaGFyLnRvVXBwZXJDYXNlKCk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbGFzc0hlbHBlcihhcmcpIHtcbiAgc3dpdGNoICh0eXBlb2YgYXJnKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGFyZyB8fCB1bmRlZmluZWQ7XG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgICB2YXIgc2VwID0gXCJcIjtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJnLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gY2xhc3NIZWxwZXIoYXJnW2ldKTtcbiAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzZXAgKyB2YWx1ZTtcbiAgICAgICAgICAgIHNlcCA9IFwiIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZykge1xuICAgICAgICAgIGlmIChhcmdba2V5XSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHNlcCArIGtleTtcbiAgICAgICAgICAgIHNlcCA9IFwiIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0IHx8IHVuZGVmaW5lZDtcbiAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY2hhbmdlQ2FzZSA9IHJlcXVpcmUoXCIuL19jaGFuZ2UtY2FzZVwiKTtcblxuLyoqXG4gKiBIZWxwZXIgZm9yIGdlbmVyYXRpbmcgdGhlIHN0cmluZyBmb3IgYSBzdHlsZSBhdHRyaWJ1dGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHlsZUhlbHBlcihzdHlsZSkge1xuICBpZiAoIXN0eWxlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3R5bGU7XG5cbiAgaWYgKHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICB2YXIgc3R5bGVzID0gXCJcIjtcbiAgICB2YXIgc2VwID0gXCJcIjtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHN0eWxlKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0eWxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBuZXh0ID0gc3R5bGVIZWxwZXIoc3R5bGVbaV0pO1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHN0eWxlcyArPSBzZXAgKyBuZXh0O1xuICAgICAgICAgIHNlcCA9IFwiO1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHN0eWxlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHN0eWxlW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICYmIHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSArPSBcInB4XCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3R5bGVzICs9IHNlcCArIGNoYW5nZUNhc2UuX19fY2FtZWxUb0Rhc2hDYXNlKG5hbWUpICsgXCI6XCIgKyB2YWx1ZTtcbiAgICAgICAgICBzZXAgPSBcIjtcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXMgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHN0eWxlO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcbnZhciBzZXRJbW1lZGlhdGUgPSByZXF1aXJlKFwiQGludGVybmFsL3NldC1pbW1lZGlhdGVcIikuX19fc2V0SW1tZWRpYXRlO1xudmFyIGRlZmF1bHRDcmVhdGVPdXQgPSByZXF1aXJlKFwiLi9jcmVhdGVPdXRcIik7XG5cbmZ1bmN0aW9uIHNhZmVSZW5kZXIocmVuZGVyRnVuYywgZmluYWxEYXRhLCBmaW5hbE91dCwgc2hvdWxkRW5kKSB7XG4gIHRyeSB7XG4gICAgcmVuZGVyRnVuYyhmaW5hbERhdGEsIGZpbmFsT3V0KTtcblxuICAgIGlmIChzaG91bGRFbmQpIHtcbiAgICAgIGZpbmFsT3V0LmVuZCgpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdmFyIGFjdHVhbEVuZCA9IGZpbmFsT3V0LmVuZDtcbiAgICBmaW5hbE91dC5lbmQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICBmaW5hbE91dC5lbmQgPSBhY3R1YWxFbmQ7XG4gICAgICBmaW5hbE91dC5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBmaW5hbE91dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCByZW5kZXJlcikge1xuICB2YXIgcmVuZGVyRnVuYyA9XG4gICAgcmVuZGVyZXIgJiYgKHJlbmRlcmVyLnJlbmRlcmVyIHx8IHJlbmRlcmVyLnJlbmRlciB8fCByZW5kZXJlcik7XG4gIHZhciBjcmVhdGVPdXQgPSB0YXJnZXQuY3JlYXRlT3V0IHx8IHJlbmRlcmVyLmNyZWF0ZU91dCB8fCBkZWZhdWx0Q3JlYXRlT3V0O1xuXG4gIHJldHVybiBleHRlbmQodGFyZ2V0LCB7XG4gICAgXzogcmVuZGVyRnVuYyxcbiAgICBjcmVhdGVPdXQ6IGNyZWF0ZU91dCxcblxuICAgIHJlbmRlclRvU3RyaW5nOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBsb2NhbERhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgdmFyIHJlbmRlciA9IHJlbmRlckZ1bmMgfHwgdGhpcy5fO1xuICAgICAgdmFyIGdsb2JhbERhdGEgPSBsb2NhbERhdGEuJGdsb2JhbDtcbiAgICAgIHZhciBvdXQgPSBjcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG5cbiAgICAgIG91dC5nbG9iYWwudGVtcGxhdGUgPSB0aGlzO1xuXG4gICAgICBpZiAoZ2xvYmFsRGF0YSkge1xuICAgICAgICBsb2NhbERhdGEuJGdsb2JhbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIG91dFxuICAgICAgICAgIC5vbihcImZpbmlzaFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBvdXQudG9TdHJpbmcoKSwgb3V0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbmNlKFwiZXJyb3JcIiwgY2FsbGJhY2spO1xuXG4gICAgICAgIHJldHVybiBzYWZlUmVuZGVyKHJlbmRlciwgbG9jYWxEYXRhLCBvdXQsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnN5bmMoKTtcbiAgICAgICAgcmVuZGVyKGxvY2FsRGF0YSwgb3V0KTtcbiAgICAgICAgcmV0dXJuIG91dC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXJTeW5jOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGxvY2FsRGF0YSA9IGRhdGEgfHwge307XG4gICAgICB2YXIgcmVuZGVyID0gcmVuZGVyRnVuYyB8fCB0aGlzLl87XG4gICAgICB2YXIgZ2xvYmFsRGF0YSA9IGxvY2FsRGF0YS4kZ2xvYmFsO1xuICAgICAgdmFyIG91dCA9IGNyZWF0ZU91dChnbG9iYWxEYXRhKTtcbiAgICAgIG91dC5zeW5jKCk7XG5cbiAgICAgIG91dC5nbG9iYWwudGVtcGxhdGUgPSB0aGlzO1xuXG4gICAgICBpZiAoZ2xvYmFsRGF0YSkge1xuICAgICAgICBsb2NhbERhdGEuJGdsb2JhbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKGxvY2FsRGF0YSwgb3V0KTtcbiAgICAgIHJldHVybiBvdXQuX19fZ2V0UmVzdWx0KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgYSB0ZW1wbGF0ZSB0byBub2RlcyBhbmQgaW5zZXJ0cyB0aGVtIGludG8gdGhlIERPTSByZWxhdGl2ZVxuICAgICAqIHRvIHRoZSBwcm92aWRlZCByZWZlcmVuY2UgYmFzZWQgb24gdGhlIG9wdGlvbmFsIHBvc2l0aW9uIHBhcmFtZXRlci5cbiAgICAgKlxuICAgICAqIFN1cHBvcnRlZCBzaWduYXR1cmVzOlxuICAgICAqXG4gICAgICogbW91bnQoZGF0YSwgcmVmZXJlbmNlKVxuICAgICAqIG1vdW50KGRhdGEsIHJlZmVyZW5jZSwgcG9zaXRpb24pXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgVGhlIHZpZXcgbW9kZWwgZGF0YSBmb3IgdGhlIHRlbXBsYXRlXG4gICAgICogQHBhcmFtICB7Tm9kZX0gcmVmZXJlbmNlIERPTSBub2RlIHRvIGluc2VydCB0aGUgcmVuZGVyZWQgbm9kZShzKSByZWxhdGl2ZSB0b1xuICAgICAqIEBwYXJhbSAge3N0cmluZ30gW3Bvc2l0aW9uXSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBgcmVmZXJlbmNlYDsgbXVzdCBtYXRjaCAoY2FzZS1pbnNlbnNpdGl2ZWx5KSBvbmUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdzOlxuICAgICAqICAnYmVmb3JlYmVnaW4nOiBCZWZvcmUgdGhlIHRhcmdldEVsZW1lbnQgaXRzZWxmLlxuICAgICAqICAnYWZ0ZXJiZWdpbic6IEp1c3QgaW5zaWRlIHRoZSB0YXJnZXRFbGVtZW50LCBiZWZvcmUgaXRzIGZpcnN0IGNoaWxkLlxuICAgICAqICAnYmVmb3JlZW5kJzogSnVzdCBpbnNpZGUgdGhlIHRhcmdldEVsZW1lbnQsIGFmdGVyIGl0cyBsYXN0IGNoaWxkLlxuICAgICAqICAnYWZ0ZXJlbmQnOiBBZnRlciB0aGUgdGFyZ2V0RWxlbWVudCBpdHNlbGYuXG4gICAgICogQHJldHVybiB7VGVtcGxhdGVJbnN0YW5jZX0gT2JqZWN0IHdpdGggYHVwZGF0ZWAgYW5kIGBkaXNwb3NlYCBtZXRob2RzXG4gICAgICovXG4gICAgbW91bnQ6IGZ1bmN0aW9uIChkYXRhLCByZWZlcmVuY2UsIHBvc2l0aW9uKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJlbmRlclN5bmMoZGF0YSk7XG5cbiAgICAgIHN3aXRjaCAocG9zaXRpb24pIHtcbiAgICAgICAgY2FzZSBcImFmdGVyYmVnaW5cIjpcbiAgICAgICAgICByZXN1bHQucHJlcGVuZFRvKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJhZnRlcmVuZFwiOlxuICAgICAgICAgIHJlc3VsdC5pbnNlcnRBZnRlcihyZWZlcmVuY2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYmVmb3JlYmVnaW5cIjpcbiAgICAgICAgICByZXN1bHQuaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmVzdWx0LmFwcGVuZFRvKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHJlc3VsdC5nZXRDb21wb25lbnQoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXBkYXRlKGlucHV0KSB7XG4gICAgICAgICAgY29tcG9uZW50LmlucHV0ID0gaW5wdXQ7XG4gICAgICAgICAgY29tcG9uZW50LnVwZGF0ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgIGNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIGEgdGVtcGxhdGUgdG8gZWl0aGVyIGEgc3RyZWFtIChpZiB0aGUgbGFzdFxuICAgICAqIGFyZ3VtZW50IGlzIGEgU3RyZWFtIGluc3RhbmNlKSBvclxuICAgICAqIHByb3ZpZGVzIHRoZSBvdXRwdXQgdG8gYSBjYWxsYmFjayBmdW5jdGlvbiAoaWYgdGhlIGxhc3RcbiAgICAgKiBhcmd1bWVudCBpcyBhIEZ1bmN0aW9uKS5cbiAgICAgKlxuICAgICAqIFN1cHBvcnRlZCBzaWduYXR1cmVzOlxuICAgICAqXG4gICAgICogcmVuZGVyKGRhdGEpXG4gICAgICogcmVuZGVyKGRhdGEsIG91dClcbiAgICAgKiByZW5kZXIoZGF0YSwgc3RyZWFtKVxuICAgICAqIHJlbmRlcihkYXRhLCBjYWxsYmFjaylcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBUaGUgdmlldyBtb2RlbCBkYXRhIGZvciB0aGUgdGVtcGxhdGVcbiAgICAgKiBAcGFyYW0gIHtBc3luY1N0cmVhbS9Bc3luY1ZET01CdWlsZGVyfSBvdXQgQSBTdHJlYW0sIGFuIEFzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXIgaW5zdGFuY2UsIG9yIGEgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJuIHtBc3luY1N0cmVhbS9Bc3luY1ZET01CdWlsZGVyfSBSZXR1cm5zIHRoZSBBc3luY1N0cmVhbS9Bc3luY1ZET01CdWlsZGVyIGluc3RhbmNlIHRoYXQgdGhlIHRlbXBsYXRlIGlzIHJlbmRlcmVkIHRvXG4gICAgICovXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoZGF0YSwgb3V0KSB7XG4gICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICB2YXIgZmluYWxPdXQ7XG4gICAgICB2YXIgZmluYWxEYXRhO1xuICAgICAgdmFyIGdsb2JhbERhdGE7XG4gICAgICB2YXIgcmVuZGVyID0gcmVuZGVyRnVuYyB8fCB0aGlzLl87XG4gICAgICB2YXIgc2hvdWxkQnVmZmVyID0gdGhpcy5fX19zaG91bGRCdWZmZXI7XG4gICAgICB2YXIgc2hvdWxkRW5kID0gdHJ1ZTtcblxuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZmluYWxEYXRhID0gZGF0YTtcbiAgICAgICAgaWYgKChnbG9iYWxEYXRhID0gZGF0YS4kZ2xvYmFsKSkge1xuICAgICAgICAgIGZpbmFsRGF0YS4kZ2xvYmFsID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaW5hbERhdGEgPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYgKG91dCAmJiBvdXQuX19faXNPdXQpIHtcbiAgICAgICAgZmluYWxPdXQgPSBvdXQ7XG4gICAgICAgIHNob3VsZEVuZCA9IGZhbHNlO1xuICAgICAgICBleHRlbmQob3V0Lmdsb2JhbCwgZ2xvYmFsRGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvdXQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGZpbmFsT3V0ID0gY3JlYXRlT3V0KGdsb2JhbERhdGEpO1xuICAgICAgICBjYWxsYmFjayA9IG91dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbmFsT3V0ID0gY3JlYXRlT3V0KFxuICAgICAgICAgIGdsb2JhbERhdGEsIC8vIGdsb2JhbFxuICAgICAgICAgIG91dCwgLy8gd3JpdGVyKEFzeW5jU3RyZWFtKSBvciBwYXJlbnROb2RlKEFzeW5jVkRPTUJ1aWxkZXIpXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBwYXJlbnRPdXRcbiAgICAgICAgICBzaG91bGRCdWZmZXIsIC8vIGlnbm9yZWQgYnkgQXN5bmNWRE9NQnVpbGRlclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgZmluYWxPdXRcbiAgICAgICAgICAub24oXCJmaW5pc2hcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZmluYWxPdXQuX19fZ2V0UmVzdWx0KCksIGZpbmFsT3V0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbmNlKFwiZXJyb3JcIiwgY2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICBnbG9iYWxEYXRhID0gZmluYWxPdXQuZ2xvYmFsO1xuXG4gICAgICBnbG9iYWxEYXRhLnRlbXBsYXRlID0gZ2xvYmFsRGF0YS50ZW1wbGF0ZSB8fCB0aGlzO1xuXG4gICAgICByZXR1cm4gc2FmZVJlbmRlcihyZW5kZXIsIGZpbmFsRGF0YSwgZmluYWxPdXQsIHNob3VsZEVuZCk7XG4gICAgfSxcbiAgfSk7XG59O1xuIiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHMtbGlnaHRcIik7XG52YXIgUmVuZGVyUmVzdWx0ID0gcmVxdWlyZShcIi4uL1JlbmRlclJlc3VsdFwiKTtcbnZhciBhdHRyc0hlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvYXR0cnNcIik7XG52YXIgbW9ycGhkb20gPSByZXF1aXJlKFwiLi9tb3JwaGRvbVwiKTtcbnZhciB2ZG9tID0gcmVxdWlyZShcIi4vdmRvbVwiKTtcbnZhciBWRWxlbWVudCA9IHZkb20uX19fVkVsZW1lbnQ7XG52YXIgVkRvY3VtZW50RnJhZ21lbnQgPSB2ZG9tLl9fX1ZEb2N1bWVudEZyYWdtZW50O1xudmFyIFZUZXh0ID0gdmRvbS5fX19WVGV4dDtcbnZhciBWQ29tcG9uZW50ID0gdmRvbS5fX19WQ29tcG9uZW50O1xudmFyIFZGcmFnbWVudCA9IHZkb20uX19fVkZyYWdtZW50O1xudmFyIHZpcnR1YWxpemVIVE1MID0gdmRvbS5fX192aXJ0dWFsaXplSFRNTDtcblxudmFyIEVWRU5UX1VQREFURSA9IFwidXBkYXRlXCI7XG52YXIgRVZFTlRfRklOSVNIID0gXCJmaW5pc2hcIjtcblxuZnVuY3Rpb24gU3RhdGUodHJlZSkge1xuICB0aGlzLl9fX2V2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgdGhpcy5fX190cmVlID0gdHJlZTtcbiAgdGhpcy5fX19maW5pc2hlZCA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBBc3luY1ZET01CdWlsZGVyKGdsb2JhbERhdGEsIHBhcmVudE5vZGUsIHBhcmVudE91dCkge1xuICBpZiAoIXBhcmVudE5vZGUpIHtcbiAgICBwYXJlbnROb2RlID0gbmV3IFZEb2N1bWVudEZyYWdtZW50KCk7XG4gIH1cblxuICB2YXIgc3RhdGU7XG5cbiAgaWYgKHBhcmVudE91dCkge1xuICAgIHN0YXRlID0gcGFyZW50T3V0Ll9fX3N0YXRlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlID0gbmV3IFN0YXRlKHBhcmVudE5vZGUpO1xuICB9XG5cbiAgdGhpcy5fX19yZW1haW5pbmcgPSAxO1xuICB0aGlzLl9fX2xhc3RDb3VudCA9IDA7XG4gIHRoaXMuX19fbGFzdCA9IG51bGw7XG4gIHRoaXMuX19fcGFyZW50T3V0ID0gcGFyZW50T3V0O1xuXG4gIHRoaXMuZGF0YSA9IHt9O1xuICB0aGlzLl9fX3N0YXRlID0gc3RhdGU7XG4gIHRoaXMuX19fcGFyZW50ID0gcGFyZW50Tm9kZTtcbiAgdGhpcy5nbG9iYWwgPSBnbG9iYWxEYXRhIHx8IHt9O1xuICB0aGlzLl9fX3N0YWNrID0gW3BhcmVudE5vZGVdO1xuICB0aGlzLl9fX3N5bmMgPSBmYWxzZTtcbiAgdGhpcy5fX192bm9kZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fX19jb21wb25lbnRzID0gbnVsbDtcblxuICB0aGlzLl9fX2Fzc2lnbmVkQ29tcG9uZW50RGVmID0gbnVsbDtcbiAgdGhpcy5fX19hc3NpZ25lZEtleSA9IG51bGw7XG4gIHRoaXMuX19fYXNzaWduZWRDdXN0b21FdmVudHMgPSBudWxsO1xufVxuXG52YXIgcHJvdG8gPSAoQXN5bmNWRE9NQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gIF9fX2lzT3V0OiB0cnVlLFxuICBfX19ob3N0OiB0eXBlb2YgZG9jdW1lbnQgPT09IFwib2JqZWN0XCIgJiYgZG9jdW1lbnQsXG5cbiAgYmM6IGZ1bmN0aW9uIChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQpIHtcbiAgICB2YXIgdkNvbXBvbmVudCA9IG5ldyBWQ29tcG9uZW50KGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCk7XG4gICAgcmV0dXJuIHRoaXMuX19fYmVnaW5Ob2RlKHZDb21wb25lbnQsIDAsIHRydWUpO1xuICB9LFxuXG4gIF9fX3ByZXNlcnZlQ29tcG9uZW50OiBmdW5jdGlvbiAoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50KSB7XG4gICAgdmFyIHZDb21wb25lbnQgPSBuZXcgVkNvbXBvbmVudChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQsIHRydWUpO1xuICAgIHRoaXMuX19fYmVnaW5Ob2RlKHZDb21wb25lbnQsIDApO1xuICB9LFxuXG4gIF9fX2JlZ2luTm9kZTogZnVuY3Rpb24gKGNoaWxkLCBjaGlsZENvdW50LCBwdXNoVG9TdGFjaykge1xuICAgIHRoaXMuX19fcGFyZW50Ll9fX2FwcGVuZENoaWxkKGNoaWxkKTtcbiAgICBpZiAocHVzaFRvU3RhY2sgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuX19fc3RhY2sucHVzaChjaGlsZCk7XG4gICAgICB0aGlzLl9fX3BhcmVudCA9IGNoaWxkO1xuICAgIH1cbiAgICByZXR1cm4gY2hpbGRDb3VudCA9PT0gMCA/IHRoaXMgOiBjaGlsZDtcbiAgfSxcblxuICBlbGVtZW50OiBmdW5jdGlvbiAodGFnTmFtZSwgYXR0cnMsIGtleSwgY29tcG9uZW50LCBjaGlsZENvdW50LCBmbGFncywgcHJvcHMpIHtcbiAgICB2YXIgZWxlbWVudCA9IG5ldyBWRWxlbWVudChcbiAgICAgIHRhZ05hbWUsXG4gICAgICBhdHRycyxcbiAgICAgIGtleSxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIGNoaWxkQ291bnQsXG4gICAgICBmbGFncyxcbiAgICAgIHByb3BzLFxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuX19fYmVnaW5Ob2RlKGVsZW1lbnQsIGNoaWxkQ291bnQpO1xuICB9LFxuXG4gIF9fX2VsZW1lbnREeW5hbWljOiBmdW5jdGlvbiAodGFnTmFtZSwgYXR0cnMsIGtleSwgY29tcG9uZW50RGVmLCBwcm9wcykge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQoXG4gICAgICB0YWdOYW1lLFxuICAgICAgYXR0cnNIZWxwZXIoYXR0cnMpLFxuICAgICAga2V5LFxuICAgICAgY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudCxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgfSxcblxuICBuOiBmdW5jdGlvbiAobm9kZSwgY29tcG9uZW50KSB7XG4gICAgLy8gTk9URTogV2UgZG8gYSBzaGFsbG93IGNsb25lIHNpbmNlIHdlIGFzc3VtZSB0aGUgbm9kZSBpcyBiZWluZyByZXVzZWRcbiAgICAvLyAgICAgICBhbmQgYSBub2RlIGNhbiBvbmx5IGhhdmUgb25lIHBhcmVudCBub2RlLlxuICAgIHZhciBjbG9uZSA9IG5vZGUuX19fY2xvbmVOb2RlKCk7XG4gICAgdGhpcy5ub2RlKGNsb25lKTtcbiAgICBjbG9uZS5fX19vd25lckNvbXBvbmVudCA9IGNvbXBvbmVudDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdGV4dDogZnVuY3Rpb24gKHRleHQsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgdGV4dDtcblxuICAgIGlmICh0eXBlICE9IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmICh0ZXh0LnRvSFRNTCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmgodGV4dC50b0hUTUwoKSwgb3duZXJDb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRleHQgPSB0ZXh0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kQ2hpbGQobmV3IFZUZXh0KHRleHQsIG93bmVyQ29tcG9uZW50KSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgaHRtbDogZnVuY3Rpb24gKGh0bWwsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgaWYgKGh0bWwgIT0gbnVsbCkge1xuICAgICAgdmFyIHZkb21Ob2RlID0gdmlydHVhbGl6ZUhUTUwoaHRtbCwgb3duZXJDb21wb25lbnQpO1xuICAgICAgdGhpcy5ub2RlKHZkb21Ob2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBiZWdpbkVsZW1lbnQ6IGZ1bmN0aW9uIChcbiAgICB0YWdOYW1lLFxuICAgIGF0dHJzLFxuICAgIGtleSxcbiAgICBjb21wb25lbnQsXG4gICAgY2hpbGRDb3VudCxcbiAgICBmbGFncyxcbiAgICBwcm9wcyxcbiAgKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBuZXcgVkVsZW1lbnQoXG4gICAgICB0YWdOYW1lLFxuICAgICAgYXR0cnMsXG4gICAgICBrZXksXG4gICAgICBjb21wb25lbnQsXG4gICAgICBjaGlsZENvdW50LFxuICAgICAgZmxhZ3MsXG4gICAgICBwcm9wcyxcbiAgICApO1xuICAgIHRoaXMuX19fYmVnaW5Ob2RlKGVsZW1lbnQsIGNoaWxkQ291bnQsIHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9fX2JlZ2luRWxlbWVudER5bmFtaWM6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBjb21wb25lbnREZWYsIHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuYmVnaW5FbGVtZW50KFxuICAgICAgdGFnTmFtZSxcbiAgICAgIGF0dHJzSGVscGVyKGF0dHJzKSxcbiAgICAgIGtleSxcbiAgICAgIGNvbXBvbmVudERlZi5fX19jb21wb25lbnQsXG4gICAgICAwLFxuICAgICAgMCxcbiAgICAgIHByb3BzLFxuICAgICk7XG4gIH0sXG5cbiAgYmY6IGZ1bmN0aW9uIChrZXksIGNvbXBvbmVudCwgcHJlc2VydmUpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBuZXcgVkZyYWdtZW50KGtleSwgY29tcG9uZW50LCBwcmVzZXJ2ZSk7XG4gICAgdGhpcy5fX19iZWdpbk5vZGUoZnJhZ21lbnQsIG51bGwsIHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGVmOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmRFbGVtZW50KCk7XG4gIH0sXG5cbiAgZW5kRWxlbWVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGFjayA9IHRoaXMuX19fc3RhY2s7XG4gICAgc3RhY2sucG9wKCk7XG4gICAgdGhpcy5fX19wYXJlbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgfSxcblxuICBlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9fX3BhcmVudCA9IHVuZGVmaW5lZDtcblxuICAgIHZhciByZW1haW5pbmcgPSAtLXRoaXMuX19fcmVtYWluaW5nO1xuICAgIHZhciBwYXJlbnRPdXQgPSB0aGlzLl9fX3BhcmVudE91dDtcblxuICAgIGlmIChyZW1haW5pbmcgPT09IDApIHtcbiAgICAgIGlmIChwYXJlbnRPdXQpIHtcbiAgICAgICAgcGFyZW50T3V0Ll9fX2hhbmRsZUNoaWxkRG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX19kb0ZpbmlzaCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVtYWluaW5nIC0gdGhpcy5fX19sYXN0Q291bnQgPT09IDApIHtcbiAgICAgIHRoaXMuX19fZW1pdExhc3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfX19oYW5kbGVDaGlsZERvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVtYWluaW5nID0gLS10aGlzLl9fX3JlbWFpbmluZztcblxuICAgIGlmIChyZW1haW5pbmcgPT09IDApIHtcbiAgICAgIHZhciBwYXJlbnRPdXQgPSB0aGlzLl9fX3BhcmVudE91dDtcbiAgICAgIGlmIChwYXJlbnRPdXQpIHtcbiAgICAgICAgcGFyZW50T3V0Ll9fX2hhbmRsZUNoaWxkRG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX19kb0ZpbmlzaCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVtYWluaW5nIC0gdGhpcy5fX19sYXN0Q291bnQgPT09IDApIHtcbiAgICAgIHRoaXMuX19fZW1pdExhc3QoKTtcbiAgICB9XG4gIH0sXG5cbiAgX19fZG9GaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuICAgIHN0YXRlLl9fX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICBzdGF0ZS5fX19ldmVudHMuZW1pdChFVkVOVF9GSU5JU0gsIHRoaXMuX19fZ2V0UmVzdWx0KCkpO1xuICB9LFxuXG4gIF9fX2VtaXRMYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RBcnJheSA9IHRoaXMuX2xhc3Q7XG5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgaWYgKGkgPT09IGxhc3RBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGxhc3RDYWxsYmFjayA9IGxhc3RBcnJheVtpKytdO1xuICAgICAgbGFzdENhbGxiYWNrKG5leHQpO1xuXG4gICAgICBpZiAoIWxhc3RDYWxsYmFjay5sZW5ndGgpIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5leHQoKTtcbiAgfSxcblxuICBlcnJvcjogZnVuY3Rpb24gKGUpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGxpc3RlbmVyIGZvciB0aGUgZXJyb3IgZXZlbnQgdGhlbiBpdCB3aWxsXG4gICAgICAvLyB0aHJvdyBhIG5ldyBFcnJvciBoZXJlLiBJbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgYXN5bmMgZnJhZ21lbnRcbiAgICAgIC8vIGlzIHN0aWxsIHByb3Blcmx5IGVuZGVkIHdlIG5lZWQgdG8gcHV0IHRoZSBlbmQoKSBpbiBhIGBmaW5hbGx5YFxuICAgICAgLy8gYmxvY2tcbiAgICAgIHRoaXMuZW5kKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgYmVnaW5Bc3luYzogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fX19zeW5jKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgXCJUcmllZCB0byByZW5kZXIgYXN5bmMgd2hpbGUgaW4gc3luYyBtb2RlLiBOb3RlOiBDbGllbnQgc2lkZSBhd2FpdCBpcyBub3QgY3VycmVudGx5IHN1cHBvcnRlZCBpbiByZS1yZW5kZXJzIChJc3N1ZTogIzk0MikuXCIsXG4gICAgICApO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMubGFzdCkge1xuICAgICAgICB0aGlzLl9fX2xhc3RDb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX19fcmVtYWluaW5nKys7XG5cbiAgICB2YXIgZG9jdW1lbnRGcmFnbWVudCA9IHRoaXMuX19fcGFyZW50Ll9fX2FwcGVuZERvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB2YXIgYXN5bmNPdXQgPSBuZXcgQXN5bmNWRE9NQnVpbGRlcih0aGlzLmdsb2JhbCwgZG9jdW1lbnRGcmFnbWVudCwgdGhpcyk7XG5cbiAgICBzdGF0ZS5fX19ldmVudHMuZW1pdChcImJlZ2luQXN5bmNcIiwge1xuICAgICAgb3V0OiBhc3luY091dCxcbiAgICAgIHBhcmVudE91dDogdGhpcyxcbiAgICB9KTtcblxuICAgIHJldHVybiBhc3luY091dDtcbiAgfSxcblxuICBjcmVhdGVPdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IEFzeW5jVkRPTUJ1aWxkZXIodGhpcy5nbG9iYWwpO1xuICB9LFxuXG4gIGZsdXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50cyA9IHRoaXMuX19fc3RhdGUuX19fZXZlbnRzO1xuXG4gICAgaWYgKGV2ZW50cy5saXN0ZW5lckNvdW50KEVWRU5UX1VQREFURSkpIHtcbiAgICAgIGV2ZW50cy5lbWl0KEVWRU5UX1VQREFURSwgbmV3IFJlbmRlclJlc3VsdCh0aGlzKSk7XG4gICAgfVxuICB9LFxuXG4gIF9fX2dldE91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3N0YXRlLl9fX3RyZWU7XG4gIH0sXG5cbiAgX19fZ2V0UmVzdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fcmVzdWx0IHx8ICh0aGlzLl9fX3Jlc3VsdCA9IG5ldyBSZW5kZXJSZXN1bHQodGhpcykpO1xuICB9LFxuXG4gIG9uOiBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmIChldmVudCA9PT0gRVZFTlRfRklOSVNIICYmIHN0YXRlLl9fX2ZpbmlzaGVkKSB7XG4gICAgICBjYWxsYmFjayh0aGlzLl9fX2dldFJlc3VsdCgpKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcImxhc3RcIikge1xuICAgICAgdGhpcy5vbkxhc3QoY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5fX19ldmVudHMub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmIChldmVudCA9PT0gRVZFTlRfRklOSVNIICYmIHN0YXRlLl9fX2ZpbmlzaGVkKSB7XG4gICAgICBjYWxsYmFjayh0aGlzLl9fX2dldFJlc3VsdCgpKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcImxhc3RcIikge1xuICAgICAgdGhpcy5vbkxhc3QoY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5fX19ldmVudHMub25jZShldmVudCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uICh0eXBlLCBhcmcpIHtcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5fX19zdGF0ZS5fX19ldmVudHM7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGV2ZW50cy5lbWl0KHR5cGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgZXZlbnRzLmVtaXQodHlwZSwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBldmVudHMuZW1pdC5hcHBseShldmVudHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudHMgPSB0aGlzLl9fX3N0YXRlLl9fX2V2ZW50cztcbiAgICBldmVudHMucmVtb3ZlTGlzdGVuZXIuYXBwbHkoZXZlbnRzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHN5bmM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9fX3N5bmMgPSB0cnVlO1xuICB9LFxuXG4gIGlzU3luYzogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3N5bmM7XG4gIH0sXG5cbiAgb25MYXN0OiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgbGFzdEFycmF5ID0gdGhpcy5fbGFzdDtcblxuICAgIGlmIChsYXN0QXJyYXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fbGFzdCA9IFtjYWxsYmFja107XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3RBcnJheS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfX19nZXROb2RlOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBub2RlID0gdGhpcy5fX192bm9kZTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHZhciB2ZG9tVHJlZSA9IHRoaXMuX19fZ2V0T3V0cHV0KCk7XG5cbiAgICAgIGlmICghaG9zdCkgaG9zdCA9IHRoaXMuX19faG9zdDtcbiAgICAgIHRoaXMuX19fdm5vZGUgPSBub2RlID0gdmRvbVRyZWUuX19fYWN0dWFsaXplKGhvc3QsIG51bGwpO1xuICAgICAgbW9ycGhkb20obm9kZSwgdmRvbVRyZWUsIGhvc3QsIHRoaXMuX19fY29tcG9uZW50cyk7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9LFxuXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBkb2NGcmFnbWVudCA9IHRoaXMuX19fZ2V0Tm9kZShob3N0KTtcbiAgICB2YXIgaHRtbCA9IFwiXCI7XG5cbiAgICB2YXIgY2hpbGQgPSBkb2NGcmFnbWVudC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgdmFyIG5leHRTaWJsaW5nID0gY2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICBpZiAoY2hpbGQubm9kZVR5cGUgIT0gMSkge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jRnJhZ21lbnQub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGQuY2xvbmVOb2RlKCkpO1xuICAgICAgICBodG1sICs9IGNvbnRhaW5lci5pbm5lckhUTUw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBodG1sICs9IGNoaWxkLm91dGVySFRNTDtcbiAgICAgIH1cblxuICAgICAgY2hpbGQgPSBuZXh0U2libGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfSxcblxuICB0aGVuOiBmdW5jdGlvbiAoZm4sIGZuRXJyKSB7XG4gICAgdmFyIG91dCA9IHRoaXM7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBvdXQub24oXCJlcnJvclwiLCByZWplY3QpLm9uKEVWRU5UX0ZJTklTSCwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihmbiwgZm5FcnIpO1xuICB9LFxuXG4gIGNhdGNoOiBmdW5jdGlvbiAoZm5FcnIpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgZm5FcnIpO1xuICB9LFxuXG4gIGlzVkRPTTogdHJ1ZSxcblxuICBjOiBmdW5jdGlvbiAoY29tcG9uZW50RGVmLCBrZXksIGN1c3RvbUV2ZW50cykge1xuICAgIHRoaXMuX19fYXNzaWduZWRDb21wb25lbnREZWYgPSBjb21wb25lbnREZWY7XG4gICAgdGhpcy5fX19hc3NpZ25lZEtleSA9IGtleTtcbiAgICB0aGlzLl9fX2Fzc2lnbmVkQ3VzdG9tRXZlbnRzID0gY3VzdG9tRXZlbnRzO1xuICB9LFxufSk7XG5cbnByb3RvLmUgPSBwcm90by5lbGVtZW50O1xucHJvdG8uYmUgPSBwcm90by5iZWdpbkVsZW1lbnQ7XG5wcm90by5lZSA9IHByb3RvLl9fX2VuZEVsZW1lbnQgPSBwcm90by5lbmRFbGVtZW50O1xucHJvdG8udCA9IHByb3RvLnRleHQ7XG5wcm90by5oID0gcHJvdG8udyA9IHByb3RvLndyaXRlID0gcHJvdG8uaHRtbDtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3luY1ZET01CdWlsZGVyO1xuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWQ29tcG9uZW50KGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCwgcHJlc2VydmUpIHtcbiAgdGhpcy5fX19WTm9kZShudWxsIC8qIGNoaWxkQ291bnQgKi8sIG93bmVyQ29tcG9uZW50KTtcbiAgdGhpcy5fX19rZXkgPSBrZXk7XG4gIHRoaXMuX19fY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB0aGlzLl9fX3ByZXNlcnZlID0gcHJlc2VydmU7XG59XG5cblZDb21wb25lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMixcbn07XG5cbmluaGVyaXQoVkNvbXBvbmVudCwgVk5vZGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZDb21wb25lbnQ7XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcblxuZnVuY3Rpb24gVkRvY3VtZW50RnJhZ21lbnRDbG9uZShvdGhlcikge1xuICBleHRlbmQodGhpcywgb3RoZXIpO1xuICB0aGlzLl9fX3BhcmVudE5vZGUgPSBudWxsO1xuICB0aGlzLl9fX25leHRTaWJsaW5nSW50ZXJuYWwgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBWRG9jdW1lbnRGcmFnbWVudChvdXQpIHtcbiAgdGhpcy5fX19WTm9kZShudWxsIC8qIGNoaWxkQ291bnQgKi8pO1xuICB0aGlzLl9fX291dCA9IG91dDtcbn1cblxuVkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMTEsXG5cbiAgX19fRG9jdW1lbnRGcmFnbWVudDogdHJ1ZSxcblxuICBfX19jbG9uZU5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZEb2N1bWVudEZyYWdtZW50Q2xvbmUodGhpcyk7XG4gIH0sXG5cbiAgX19fYWN0dWFsaXplOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHJldHVybiAoaG9zdC5vd25lckRvY3VtZW50IHx8IGhvc3QpLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgfSxcbn07XG5cbmluaGVyaXQoVkRvY3VtZW50RnJhZ21lbnQsIFZOb2RlKTtcblxuVkRvY3VtZW50RnJhZ21lbnRDbG9uZS5wcm90b3R5cGUgPSBWRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gVkRvY3VtZW50RnJhZ21lbnQ7XG4iLCIvKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG5cbnZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIHZFbGVtZW50QnlET01Ob2RlID0gZG9tRGF0YS5fX192RWxlbWVudEJ5RE9NTm9kZTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xudmFyIEFUVFJfWExJTktfSFJFRiA9IFwieGxpbms6aHJlZlwiO1xudmFyIHhtbG5zUmVnRXhwID0gL154bWxucyg6fCQpLztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgTlNfWExJTksgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIjtcbnZhciBOU19IVE1MID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG52YXIgTlNfTUFUSCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO1xudmFyIE5TX1NWRyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbnZhciBERUZBVUxUX05TID0ge1xuICBzdmc6IE5TX1NWRyxcbiAgbWF0aDogTlNfTUFUSCxcbn07XG5cbnZhciBGTEFHX1NJTVBMRV9BVFRSUyA9IDE7XG52YXIgRkxBR19DVVNUT01fRUxFTUVOVCA9IDI7XG52YXIgRkxBR19TUFJFQURfQVRUUlMgPSA0O1xuXG52YXIgQVRUUl9IUkVGID0gXCJocmVmXCI7XG52YXIgRU1QVFlfT0JKRUNUID0gT2JqZWN0LmZyZWV6ZShPYmplY3QuY3JlYXRlKG51bGwpKTtcbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgb3B0aW9uOiB7XG4gICAgc2VsZWN0ZWQ6IGZ1bmN0aW9uIChmcm9tRWwsIHZhbHVlKSB7XG4gICAgICBmcm9tRWwuc2VsZWN0ZWQgPSB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIChmcm9tRWwsIHZhbHVlKSB7XG4gICAgICBmcm9tRWwudmFsdWUgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHZhbHVlO1xuICAgIH0sXG4gICAgY2hlY2tlZDogZnVuY3Rpb24gKGZyb21FbCwgdmFsdWUpIHtcbiAgICAgIGZyb21FbC5jaGVja2VkID0gdmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICB9LFxufTtcblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBzd2l0Y2ggKHZhbHVlLnRvU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZzpcbiAgICAgICAgY2FzZSBBcnJheS5wcm90b3R5cGUudG9TdHJpbmc6XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgICAgICBcIlJlbHlpbmcgb24gSlNPTi5zdHJpbmdpZnkgZm9yIGF0dHJpYnV0ZSB2YWx1ZXMgaXMgZGVwcmVjYXRlZCwgaW4gZnV0dXJlIHZlcnNpb25zIG9mIE1hcmtvIHRoZXNlIHdpbGwgYmUgY2FzdCB0byBzdHJpbmdzIGluc3RlYWQuXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBjYXNlIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmc6XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLnNvdXJjZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlICsgXCJcIjtcbn1cblxuZnVuY3Rpb24gYXNzaWduKGEsIGIpIHtcbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChiLCBrZXkpKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIFZFbGVtZW50Q2xvbmUob3RoZXIpIHtcbiAgdGhpcy5fX19maXJzdENoaWxkSW50ZXJuYWwgPSBvdGhlci5fX19maXJzdENoaWxkSW50ZXJuYWw7XG4gIHRoaXMuX19fcGFyZW50Tm9kZSA9IG51bGw7XG4gIHRoaXMuX19fbmV4dFNpYmxpbmdJbnRlcm5hbCA9IG51bGw7XG5cbiAgdGhpcy5fX19rZXkgPSBvdGhlci5fX19rZXk7XG4gIHRoaXMuX19fYXR0cmlidXRlcyA9IG90aGVyLl9fX2F0dHJpYnV0ZXM7XG4gIHRoaXMuX19fcHJvcGVydGllcyA9IG90aGVyLl9fX3Byb3BlcnRpZXM7XG4gIHRoaXMuX19fbm9kZU5hbWUgPSBvdGhlci5fX19ub2RlTmFtZTtcbiAgdGhpcy5fX19mbGFncyA9IG90aGVyLl9fX2ZsYWdzO1xuICB0aGlzLl9fX3ZhbHVlSW50ZXJuYWwgPSBvdGhlci5fX192YWx1ZUludGVybmFsO1xuICB0aGlzLl9fX2NvbnN0SWQgPSBvdGhlci5fX19jb25zdElkO1xufVxuXG5mdW5jdGlvbiBWRWxlbWVudChcbiAgdGFnTmFtZSxcbiAgYXR0cnMsXG4gIGtleSxcbiAgb3duZXJDb21wb25lbnQsXG4gIGNoaWxkQ291bnQsXG4gIGZsYWdzLFxuICBwcm9wcyxcbikge1xuICB0aGlzLl9fX1ZOb2RlKGNoaWxkQ291bnQsIG93bmVyQ29tcG9uZW50KTtcblxuICB2YXIgY29uc3RJZDtcblxuICBpZiAocHJvcHMpIHtcbiAgICBjb25zdElkID0gcHJvcHMuaTtcbiAgfVxuXG4gIHRoaXMuX19fa2V5ID0ga2V5O1xuICB0aGlzLl9fX2ZsYWdzID0gZmxhZ3MgfHwgMDtcbiAgdGhpcy5fX19hdHRyaWJ1dGVzID0gYXR0cnMgfHwgRU1QVFlfT0JKRUNUO1xuICB0aGlzLl9fX3Byb3BlcnRpZXMgPSBwcm9wcyB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHRoaXMuX19fbm9kZU5hbWUgPSB0YWdOYW1lO1xuICB0aGlzLl9fX3ZhbHVlSW50ZXJuYWwgPSBcIlwiO1xuICB0aGlzLl9fX2NvbnN0SWQgPSBjb25zdElkO1xuICB0aGlzLl9fX3ByZXNlcnZlID0gZmFsc2U7XG4gIHRoaXMuX19fcHJlc2VydmVCb2R5ID0gZmFsc2U7XG59XG5cblZFbGVtZW50LnByb3RvdHlwZSA9IHtcbiAgX19fbm9kZVR5cGU6IDEsXG5cbiAgX19fY2xvbmVOb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWRWxlbWVudENsb25lKHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgbWV0aG9kIGZvciBjcmVhdGluZyBhbmQgYXBwZW5kaW5nIGFuIEhUTUwgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRhZ05hbWUgICAgVGhlIHRhZyBuYW1lIChlLmcuIFwiZGl2XCIpXG4gICAqIEBwYXJhbSAge2ludHxudWxsfSBhdHRyQ291bnQgIFRoZSBudW1iZXIgb2YgYXR0cmlidXRlcyAob3IgYG51bGxgIGlmIG5vdCBrbm93bilcbiAgICogQHBhcmFtICB7aW50fG51bGx9IGNoaWxkQ291bnQgVGhlIG51bWJlciBvZiBjaGlsZCBub2RlcyAob3IgYG51bGxgIGlmIG5vdCBrbm93bilcbiAgICovXG4gIGU6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBvd25lckNvbXBvbmVudCwgY2hpbGRDb3VudCwgZmxhZ3MsIHByb3BzKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5fX19hcHBlbmRDaGlsZChcbiAgICAgIG5ldyBWRWxlbWVudChcbiAgICAgICAgdGFnTmFtZSxcbiAgICAgICAgYXR0cnMsXG4gICAgICAgIGtleSxcbiAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgIGNoaWxkQ291bnQsXG4gICAgICAgIGZsYWdzLFxuICAgICAgICBwcm9wcyxcbiAgICAgICksXG4gICAgKTtcblxuICAgIGlmIChjaGlsZENvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX19maW5pc2hDaGlsZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgbWV0aG9kIGZvciBjcmVhdGluZyBhbmQgYXBwZW5kaW5nIGEgc3RhdGljIG5vZGUuIFRoZSBwcm92aWRlZCBub2RlIGlzIGF1dG9tYXRpY2FsbHkgY2xvbmVkXG4gICAqIHVzaW5nIGEgc2hhbGxvdyBjbG9uZSBzaW5jZSBpdCB3aWxsIGJlIG11dGF0ZWQgYXMgYSByZXN1bHQgb2Ygc2V0dGluZyBgbmV4dFNpYmxpbmdgIGFuZCBgcGFyZW50Tm9kZWAuXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIHZhbHVlIGZvciB0aGUgbmV3IENvbW1lbnQgbm9kZVxuICAgKi9cbiAgbjogZnVuY3Rpb24gKG5vZGUsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgbm9kZSA9IG5vZGUuX19fY2xvbmVOb2RlKCk7XG4gICAgbm9kZS5fX19vd25lckNvbXBvbmVudCA9IG93bmVyQ29tcG9uZW50O1xuICAgIHRoaXMuX19fYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgcmV0dXJuIHRoaXMuX19fZmluaXNoQ2hpbGQoKTtcbiAgfSxcblxuICBfX19hY3R1YWxpemU6IGZ1bmN0aW9uIChob3N0LCBwYXJlbnROYW1lc3BhY2VVUkkpIHtcbiAgICB2YXIgdGFnTmFtZSA9IHRoaXMuX19fbm9kZU5hbWU7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLl9fX2F0dHJpYnV0ZXM7XG4gICAgdmFyIG5hbWVzcGFjZVVSSSA9IERFRkFVTFRfTlNbdGFnTmFtZV0gfHwgcGFyZW50TmFtZXNwYWNlVVJJIHx8IE5TX0hUTUw7XG5cbiAgICB2YXIgZmxhZ3MgPSB0aGlzLl9fX2ZsYWdzO1xuICAgIHZhciBlbCA9IChob3N0Lm93bmVyRG9jdW1lbnQgfHwgaG9zdCkuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgbmFtZXNwYWNlVVJJLFxuICAgICAgdGFnTmFtZSxcbiAgICApO1xuXG4gICAgaWYgKGZsYWdzICYgRkxBR19DVVNUT01fRUxFTUVOVCkge1xuICAgICAgYXNzaWduKGVsLCBhdHRyaWJ1dGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgYXR0clZhbHVlID0gbm9ybWFsaXplVmFsdWUoYXR0cmlidXRlc1thdHRyTmFtZV0pO1xuXG4gICAgICAgIGlmIChhdHRyVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChhdHRyTmFtZSA9PSBBVFRSX1hMSU5LX0hSRUYpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKE5TX1hMSU5LLCBBVFRSX0hSRUYsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRhZ05hbWUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgICBlbC5kZWZhdWx0VmFsdWUgPSB0aGlzLl9fX3ZhbHVlSW50ZXJuYWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGVsLCB0aGlzKTtcblxuICAgIHJldHVybiBlbDtcbiAgfSxcbn07XG5cbmluaGVyaXQoVkVsZW1lbnQsIFZOb2RlKTtcblxuVkVsZW1lbnRDbG9uZS5wcm90b3R5cGUgPSBWRWxlbWVudC5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIHZpcnR1YWxpemVFbGVtZW50KG5vZGUsIHZpcnR1YWxpemVDaGlsZE5vZGVzLCBvd25lckNvbXBvbmVudCkge1xuICB2YXIgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcbiAgdmFyIGF0dHJDb3VudCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xuXG4gIHZhciBhdHRycyA9IG51bGw7XG4gIHZhciBwcm9wcyA9IG51bGw7XG5cbiAgaWYgKGF0dHJDb3VudCkge1xuICAgIGF0dHJzID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyQ291bnQ7IGkrKykge1xuICAgICAgdmFyIGF0dHIgPSBhdHRyaWJ1dGVzW2ldO1xuICAgICAgdmFyIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgaWYgKCF4bWxuc1JlZ0V4cC50ZXN0KGF0dHJOYW1lKSkge1xuICAgICAgICBpZiAoYXR0ck5hbWUgPT09IFwiZGF0YS1tYXJrb1wiKSB7XG4gICAgICAgICAgcHJvcHMgPSBjb21wb25lbnRzVXRpbC5fX19nZXRNYXJrb1Byb3BzRnJvbUVsKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHIubmFtZXNwYWNlVVJJID09PSBOU19YTElOSykge1xuICAgICAgICAgIGF0dHJzW0FUVFJfWExJTktfSFJFRl0gPSBhdHRyLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0dHJzW2F0dHJOYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgdGFnTmFtZSA9IG5vZGUubm9kZU5hbWU7XG5cbiAgaWYgKG5vZGUubmFtZXNwYWNlVVJJID09PSBOU19IVE1MKSB7XG4gICAgdGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHZhciB2ZG9tRWwgPSBuZXcgVkVsZW1lbnQoXG4gICAgdGFnTmFtZSxcbiAgICBhdHRycyxcbiAgICBudWxsIC8qa2V5Ki8sXG4gICAgb3duZXJDb21wb25lbnQsXG4gICAgMCAvKmNoaWxkIGNvdW50Ki8sXG4gICAgMCAvKmZsYWdzKi8sXG4gICAgcHJvcHMsXG4gICk7XG5cbiAgaWYgKHZkb21FbC5fX19ub2RlTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgdmRvbUVsLl9fX3ZhbHVlSW50ZXJuYWwgPSBub2RlLnZhbHVlO1xuICB9IGVsc2UgaWYgKHZpcnR1YWxpemVDaGlsZE5vZGVzKSB7XG4gICAgdmlydHVhbGl6ZUNoaWxkTm9kZXMobm9kZSwgdmRvbUVsLCBvd25lckNvbXBvbmVudCk7XG4gIH1cblxuICByZXR1cm4gdmRvbUVsO1xufVxuXG5WRWxlbWVudC5fX192aXJ0dWFsaXplID0gdmlydHVhbGl6ZUVsZW1lbnQ7XG5cblZFbGVtZW50Ll9fX21vcnBoQXR0cnMgPSBmdW5jdGlvbiAoZnJvbUVsLCB2RnJvbUVsLCB0b0VsKSB7XG4gIHZhciBmcm9tRmxhZ3MgPSB2RnJvbUVsLl9fX2ZsYWdzO1xuICB2YXIgdG9GbGFncyA9IHRvRWwuX19fZmxhZ3M7XG4gIHZhciBhdHRycyA9IHRvRWwuX19fYXR0cmlidXRlcztcblxuICBpZiAodG9GbGFncyAmIEZMQUdfQ1VTVE9NX0VMRU1FTlQpIHtcbiAgICByZXR1cm4gYXNzaWduKGZyb21FbCwgYXR0cnMpO1xuICB9XG5cbiAgdmFyIHByb3BzID0gdG9FbC5fX19wcm9wZXJ0aWVzO1xuICB2YXIgYXR0ck5hbWU7XG5cbiAgLy8gV2UgdXNlIGV4cGFuZG8gcHJvcGVydGllcyB0byBhc3NvY2lhdGUgdGhlIHByZXZpb3VzIEhUTUxcbiAgLy8gYXR0cmlidXRlcyBwcm92aWRlZCBhcyBwYXJ0IG9mIHRoZSBWRE9NIG5vZGUgd2l0aCB0aGVcbiAgLy8gcmVhbCBWRWxlbWVudCBET00gbm9kZS4gV2hlbiBkaWZmaW5nIGF0dHJpYnV0ZXMsXG4gIC8vIHdlIG9ubHkgdXNlIG91ciBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYXR0cmlidXRlcy5cbiAgLy8gV2hlbiBkaWZmaW5nIGZvciB0aGUgZmlyc3QgdGltZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlXG4gIC8vIHJlYWwgVkVsZW1lbnQgbm9kZSB3aWxsIG5vdCBoYXZlIHRoZSBleHBhbmRvIHByb3BlcnR5XG4gIC8vIHNvIHdlIGJ1aWxkIHRoZSBhdHRyaWJ1dGUgbWFwIGZyb20gdGhlIGV4cGFuZG8gcHJvcGVydHlcblxuICB2YXIgb2xkQXR0cnMgPSB2RnJvbUVsLl9fX2F0dHJpYnV0ZXM7XG5cbiAgaWYgKG9sZEF0dHJzID09PSBhdHRycykge1xuICAgIC8vIEZvciBjb25zdGFudCBhdHRyaWJ1dGVzIHRoZSBzYW1lIG9iamVjdCB3aWxsIGJlIHByb3ZpZGVkXG4gICAgLy8gZXZlcnkgcmVuZGVyIGFuZCB3ZSBjYW4gdXNlIHRoYXQgdG8gb3VyIGFkdmFudGFnZSB0b1xuICAgIC8vIG5vdCB3YXN0ZSB0aW1lIGRpZmZpbmcgYSBjb25zdGFudCwgaW1tdXRhYmxlIGF0dHJpYnV0ZVxuICAgIC8vIG1hcC5cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgYXR0clZhbHVlO1xuXG4gIGlmICh0b0ZsYWdzICYgRkxBR19TSU1QTEVfQVRUUlMgJiYgZnJvbUZsYWdzICYgRkxBR19TSU1QTEVfQVRUUlMpIHtcbiAgICBpZiAob2xkQXR0cnNbXCJjbGFzc1wiXSAhPT0gKGF0dHJWYWx1ZSA9IGF0dHJzW1wiY2xhc3NcIl0pKSB7XG4gICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgIGZyb21FbC5jbGFzc05hbWUgPSBhdHRyVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvbGRBdHRycy5pZCAhPT0gKGF0dHJWYWx1ZSA9IGF0dHJzLmlkKSkge1xuICAgICAgaWYgKGF0dHJWYWx1ZSkge1xuICAgICAgICBmcm9tRWwuaWQgPSBhdHRyVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKFwiaWRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvbGRBdHRycy5zdHlsZSAhPT0gKGF0dHJWYWx1ZSA9IGF0dHJzLnN0eWxlKSkge1xuICAgICAgaWYgKGF0dHJWYWx1ZSkge1xuICAgICAgICBmcm9tRWwuc3R5bGUuY3NzVGV4dCA9IGF0dHJWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHByZXNlcnZlID0gKHByb3BzICYmIHByb3BzLnBhKSB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHZhciBzcGVjaWFsQXR0cnMgPSBzcGVjaWFsRWxIYW5kbGVyc1t0b0VsLl9fX25vZGVOYW1lXSB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHZhciBzcGVjaWFsQXR0cjtcblxuICAvLyBMb29wIG92ZXIgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIGluIHRoZSBhdHRyaWJ1dGUgbWFwIGFuZCBjb21wYXJlXG4gIC8vIHRoZW0gdG8gdGhlIHZhbHVlIGluIHRoZSBvbGQgbWFwLiBIb3dldmVyLCBpZiB0aGUgdmFsdWUgaXNcbiAgLy8gbnVsbC91bmRlZmluZWQvZmFsc2UgdGhlbiB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlXG4gIGZvciAoYXR0ck5hbWUgaW4gYXR0cnMpIHtcbiAgICBpZiAoXG4gICAgICAhcHJlc2VydmVbYXR0ck5hbWVdICYmXG4gICAgICBub3JtYWxpemVWYWx1ZShvbGRBdHRyc1thdHRyTmFtZV0pICE9PVxuICAgICAgICAoYXR0clZhbHVlID0gbm9ybWFsaXplVmFsdWUoYXR0cnNbYXR0ck5hbWVdKSlcbiAgICApIHtcbiAgICAgIGlmICgoc3BlY2lhbEF0dHIgPSBzcGVjaWFsQXR0cnNbYXR0ck5hbWVdKSkge1xuICAgICAgICBzcGVjaWFsQXR0cihmcm9tRWwsIGF0dHJWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09PSBBVFRSX1hMSU5LX0hSRUYpIHtcbiAgICAgICAgaWYgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZU5TKE5TX1hMSU5LLCBBVFRSX0hSRUYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGVOUyhOU19YTElOSywgQVRUUl9IUkVGLCBhdHRyVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGVyZSBhcmUgYW55IG9sZCBhdHRyaWJ1dGVzIHRoYXQgYXJlIG5vdCBpbiB0aGUgbmV3IHNldCBvZiBhdHRyaWJ1dGVzXG4gIC8vIHRoZW4gd2UgbmVlZCB0byByZW1vdmUgdGhvc2UgYXR0cmlidXRlcyBmcm9tIHRoZSB0YXJnZXQgbm9kZVxuICAvL1xuICAvLyBOT1RFOiBXZSBjYW4gc2tpcCB0aGlzIGlmIHRoZSB0aGUgZWxlbWVudCBpcyBrZXllZCBhbmQgZGlkbid0IGhhdmUgc3ByZWFkIGF0dHJpYnV0ZXNcbiAgLy8gICAgICAgYmVjYXVzZSB3ZSBrbm93IHdlIGFscmVhZHkgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgYXR0cmlidXRlcyBmb3JcbiAgLy8gICAgICAgYm90aCB0aGUgdGFyZ2V0IGFuZCBvcmlnaW5hbCBlbGVtZW50IHNpbmNlIHRhcmdldCBWRWxlbWVudCBub2RlcyB3aWxsXG4gIC8vICAgICAgIGhhdmUgYWxsIGF0dHJpYnV0ZXMgZGVjbGFyZWQuIEhvd2V2ZXIsIHdlIGNhbiBvbmx5IHNraXAgaWYgdGhlIG5vZGVcbiAgLy8gICAgICAgd2FzIG5vdCBhIHZpcnR1YWxpemVkIG5vZGUgKGkuZS4sIGEgbm9kZSB0aGF0IHdhcyBub3QgcmVuZGVyZWQgYnkgYVxuICAvLyAgICAgICBNYXJrbyB0ZW1wbGF0ZSwgYnV0IHJhdGhlciBhIG5vZGUgdGhhdCB3YXMgY3JlYXRlZCBmcm9tIGFuIEhUTUxcbiAgLy8gICAgICAgc3RyaW5nIG9yIGEgcmVhbCBET00gbm9kZSkuXG4gIGlmICh0b0VsLl9fX2tleSA9PT0gbnVsbCB8fCBmcm9tRmxhZ3MgJiBGTEFHX1NQUkVBRF9BVFRSUykge1xuICAgIGZvciAoYXR0ck5hbWUgaW4gb2xkQXR0cnMpIHtcbiAgICAgIGlmICghKGF0dHJOYW1lIGluIGF0dHJzKSkge1xuICAgICAgICBpZiAoKHNwZWNpYWxBdHRyID0gc3BlY2lhbEF0dHJzW2F0dHJOYW1lXSkpIHtcbiAgICAgICAgICBzcGVjaWFsQXR0cihmcm9tRWwsIHVuZGVmaW5lZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IEFUVFJfWExJTktfSFJFRikge1xuICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGVOUyhBVFRSX1hMSU5LX0hSRUYsIEFUVFJfSFJFRik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVkVsZW1lbnQ7XG4iLCJ2YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9kb20tZGF0YVwiKTtcbnZhciBrZXlzQnlET01Ob2RlID0gZG9tRGF0YS5fX19rZXlCeURPTU5vZGU7XG52YXIgdkVsZW1lbnRCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZFbGVtZW50QnlET01Ob2RlO1xudmFyIGNyZWF0ZUZyYWdtZW50Tm9kZSA9IHJlcXVpcmUoXCIuL21vcnBoZG9tL2ZyYWdtZW50XCIpLl9fX2NyZWF0ZUZyYWdtZW50Tm9kZTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWRnJhZ21lbnQoa2V5LCBvd25lckNvbXBvbmVudCwgcHJlc2VydmUpIHtcbiAgdGhpcy5fX19WTm9kZShudWxsIC8qIGNoaWxkQ291bnQgKi8sIG93bmVyQ29tcG9uZW50KTtcbiAgdGhpcy5fX19rZXkgPSBrZXk7XG4gIHRoaXMuX19fcHJlc2VydmUgPSBwcmVzZXJ2ZTtcbn1cblxuVkZyYWdtZW50LnByb3RvdHlwZSA9IHtcbiAgX19fbm9kZVR5cGU6IDEyLFxuICBfX19hY3R1YWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBjcmVhdGVGcmFnbWVudE5vZGUoKTtcbiAgICBrZXlzQnlET01Ob2RlLnNldChmcmFnbWVudCwgdGhpcy5fX19rZXkpO1xuICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChmcmFnbWVudCwgdGhpcyk7XG4gICAgcmV0dXJuIGZyYWdtZW50O1xuICB9LFxufTtcblxuaW5oZXJpdChWRnJhZ21lbnQsIFZOb2RlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWRnJhZ21lbnQ7XG4iLCIvKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG5mdW5jdGlvbiBWTm9kZSgpIHt9XG5cblZOb2RlLnByb3RvdHlwZSA9IHtcbiAgX19fVk5vZGU6IGZ1bmN0aW9uIChmaW5hbENoaWxkQ291bnQsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgdGhpcy5fX19maW5hbENoaWxkQ291bnQgPSBmaW5hbENoaWxkQ291bnQ7XG4gICAgdGhpcy5fX19jaGlsZENvdW50ID0gMDtcbiAgICB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbCA9IG51bGw7XG4gICAgdGhpcy5fX19sYXN0Q2hpbGQgPSBudWxsO1xuICAgIHRoaXMuX19fcGFyZW50Tm9kZSA9IG51bGw7XG4gICAgdGhpcy5fX19uZXh0U2libGluZ0ludGVybmFsID0gbnVsbDtcbiAgICB0aGlzLl9fX293bmVyQ29tcG9uZW50ID0gb3duZXJDb21wb25lbnQ7XG4gIH0sXG5cbiAgZ2V0IF9fX2ZpcnN0Q2hpbGQoKSB7XG4gICAgdmFyIGZpcnN0Q2hpbGQgPSB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbDtcblxuICAgIGlmIChmaXJzdENoaWxkICYmIGZpcnN0Q2hpbGQuX19fRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgdmFyIG5lc3RlZEZpcnN0Q2hpbGQgPSBmaXJzdENoaWxkLl9fX2ZpcnN0Q2hpbGQ7XG4gICAgICAvLyBUaGUgZmlyc3QgY2hpbGQgaXMgYSBEb2N1bWVudEZyYWdtZW50IG5vZGUuXG4gICAgICAvLyBJZiB0aGUgRG9jdW1lbnRGcmFnbWVudCBub2RlIGhhcyBhIGZpcnN0IGNoaWxkIHRoZW4gd2Ugd2lsbCByZXR1cm4gdGhhdC5cbiAgICAgIC8vIE90aGVyd2lzZSwgdGhlIERvY3VtZW50RnJhZ21lbnQgbm9kZSBpcyBub3QgKnJlYWxseSogdGhlIGZpcnN0IGNoaWxkIGFuZFxuICAgICAgLy8gd2UgbmVlZCB0byBza2lwIHRvIGl0cyBuZXh0IHNpYmxpbmdcbiAgICAgIHJldHVybiBuZXN0ZWRGaXJzdENoaWxkIHx8IGZpcnN0Q2hpbGQuX19fbmV4dFNpYmxpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpcnN0Q2hpbGQ7XG4gIH0sXG5cbiAgZ2V0IF9fX25leHRTaWJsaW5nKCkge1xuICAgIHZhciBuZXh0U2libGluZyA9IHRoaXMuX19fbmV4dFNpYmxpbmdJbnRlcm5hbDtcblxuICAgIGlmIChuZXh0U2libGluZykge1xuICAgICAgaWYgKG5leHRTaWJsaW5nLl9fX0RvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBuZXh0U2libGluZy5fX19maXJzdENoaWxkO1xuICAgICAgICByZXR1cm4gZmlyc3RDaGlsZCB8fCBuZXh0U2libGluZy5fX19uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHBhcmVudE5vZGUgPSB0aGlzLl9fX3BhcmVudE5vZGU7XG4gICAgICBpZiAocGFyZW50Tm9kZSAmJiBwYXJlbnROb2RlLl9fX0RvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudE5vZGUuX19fbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRTaWJsaW5nO1xuICB9LFxuXG4gIF9fX2FwcGVuZENoaWxkOiBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICB0aGlzLl9fX2NoaWxkQ291bnQrKztcblxuICAgIGlmICh0aGlzLl9fX25vZGVOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGlmIChjaGlsZC5fX19UZXh0KSB7XG4gICAgICAgIHRoaXMuX19fdmFsdWVJbnRlcm5hbCArPSBjaGlsZC5fX19ub2RlVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxhc3RDaGlsZCA9IHRoaXMuX19fbGFzdENoaWxkO1xuXG4gICAgICBjaGlsZC5fX19wYXJlbnROb2RlID0gdGhpcztcblxuICAgICAgaWYgKGxhc3RDaGlsZCkge1xuICAgICAgICBsYXN0Q2hpbGQuX19fbmV4dFNpYmxpbmdJbnRlcm5hbCA9IGNoaWxkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX19maXJzdENoaWxkSW50ZXJuYWwgPSBjaGlsZDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fX19sYXN0Q2hpbGQgPSBjaGlsZDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0sXG5cbiAgX19fZmluaXNoQ2hpbGQ6IGZ1bmN0aW9uIGZpbmlzaENoaWxkKCkge1xuICAgIGlmICh0aGlzLl9fX2NoaWxkQ291bnQgPT09IHRoaXMuX19fZmluYWxDaGlsZENvdW50ICYmIHRoaXMuX19fcGFyZW50Tm9kZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX19fcGFyZW50Tm9kZS5fX19maW5pc2hDaGlsZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sXG5cbiAgLy8gLHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gIC8vICAgICB2YXIgY2xvbmUgPSBPYmplY3QuYXNzaWduKHtcbiAgLy8gICAgICAgICBub2RlVHlwZTogdGhpcy5ub2RlVHlwZVxuICAvLyAgICAgfSwgdGhpcyk7XG4gIC8vXG4gIC8vICAgICBmb3IgKHZhciBrIGluIGNsb25lKSB7XG4gIC8vICAgICAgICAgaWYgKGsuc3RhcnRzV2l0aCgnXycpKSB7XG4gIC8vICAgICAgICAgICAgIGRlbGV0ZSBjbG9uZVtrXTtcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgICBkZWxldGUgY2xvbmUuX25leHRTaWJsaW5nO1xuICAvLyAgICAgZGVsZXRlIGNsb25lLl9sYXN0Q2hpbGQ7XG4gIC8vICAgICBkZWxldGUgY2xvbmUucGFyZW50Tm9kZTtcbiAgLy8gICAgIHJldHVybiBjbG9uZTtcbiAgLy8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWTm9kZTtcbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcblxuZnVuY3Rpb24gVlRleHQodmFsdWUsIG93bmVyQ29tcG9uZW50KSB7XG4gIHRoaXMuX19fVk5vZGUoLTEgLyogbm8gY2hpbGRyZW4gKi8sIG93bmVyQ29tcG9uZW50KTtcbiAgdGhpcy5fX19ub2RlVmFsdWUgPSB2YWx1ZTtcbn1cblxuVlRleHQucHJvdG90eXBlID0ge1xuICBfX19UZXh0OiB0cnVlLFxuXG4gIF9fX25vZGVUeXBlOiAzLFxuXG4gIF9fX2FjdHVhbGl6ZTogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICByZXR1cm4gKGhvc3Qub3duZXJEb2N1bWVudCB8fCBob3N0KS5jcmVhdGVUZXh0Tm9kZSh0aGlzLl9fX25vZGVWYWx1ZSk7XG4gIH0sXG5cbiAgX19fY2xvbmVOb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWVGV4dCh0aGlzLl9fX25vZGVWYWx1ZSk7XG4gIH0sXG59O1xuXG5pbmhlcml0KFZUZXh0LCBWTm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVlRleHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBjbGFzc0hlbHBlciA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2NsYXNzLXZhbHVlXCIpO1xudmFyIHN0eWxlSGVscGVyID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvc3R5bGUtdmFsdWVcIik7XG52YXIgcGFyc2VIVE1MID0gcmVxdWlyZShcIi4uL3BhcnNlLWh0bWxcIik7XG5cbi8qKlxuICogSGVscGVyIGZvciBwcm9jZXNzaW5nIGR5bmFtaWMgYXR0cmlidXRlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gIGlmICh0eXBlb2YgYXR0cmlidXRlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgXCJQYXNzaW5nIGEgc3RyaW5nIGFzIGEgZHluYW1pYyBhdHRyaWJ1dGUgdmFsdWUgaXMgZGVwcmVjYXRlZCAtIE1vcmUgZGV0YWlsczogaHR0cHM6Ly9naXRodWIuY29tL21hcmtvLWpzL21hcmtvL3dpa2kvRGVwcmVjYXRpb246LVN0cmluZy1hcy1keW5hbWljLWF0dHJpYnV0ZS12YWx1ZVwiLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlQXR0cnMoYXR0cmlidXRlcyk7XG4gIH1cblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIHZhciBuZXdBdHRyaWJ1dGVzID0ge307XG5cbiAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICB2YXIgdmFsID0gYXR0cmlidXRlc1thdHRyTmFtZV07XG4gICAgICBpZiAoYXR0ck5hbWUgPT09IFwicmVuZGVyQm9keVwiKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ck5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICB2YWwgPSBjbGFzc0hlbHBlcih2YWwpO1xuICAgICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgIHZhbCA9IHN0eWxlSGVscGVyKHZhbCk7XG4gICAgICB9XG5cbiAgICAgIG5ld0F0dHJpYnV0ZXNbYXR0ck5hbWVdID0gdmFsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdBdHRyaWJ1dGVzO1xuICB9XG5cbiAgcmV0dXJuIGF0dHJpYnV0ZXM7XG59O1xuXG5mdW5jdGlvbiBwYXJzZUF0dHJzKHN0cikge1xuICBpZiAoc3RyID09PSBcIlwiKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgdmFyIGF0dHJzID0gcGFyc2VIVE1MKFwiPGEgXCIgKyBzdHIgKyBcIj5cIikuYXR0cmlidXRlcztcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICB2YXIgYXR0cjtcblxuICBmb3IgKHZhciBsZW4gPSBhdHRycy5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhdHRyID0gYXR0cnNbaV07XG4gICAgcmVzdWx0W2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG53aW5kb3cuTWFya28gPSB7XG4gIENvbXBvbmVudDogZnVuY3Rpb24gKCkge30sXG59O1xuXG4vKipcbiAqIE1ldGhvZCBpcyBmb3IgaW50ZXJuYWwgdXNhZ2Ugb25seS4gVGhpcyBtZXRob2RcbiAqIGlzIGludm9rZWQgYnkgY29kZSBpbiBhIGNvbXBpbGVkIE1hcmtvIHRlbXBsYXRlIGFuZFxuICogaXQgaXMgdXNlZCB0byBjcmVhdGUgYSBuZXcgVGVtcGxhdGUgaW5zdGFuY2UuXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLnQgPSBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZSh0eXBlTmFtZSkge1xuICByZXR1cm4gbmV3IFRlbXBsYXRlKHR5cGVOYW1lKTtcbn07XG5cbmZ1bmN0aW9uIFRlbXBsYXRlKHR5cGVOYW1lKSB7XG4gIHRoaXMucGF0aCA9IHRoaXMuX19fdHlwZU5hbWUgPSB0eXBlTmFtZTtcbn1cblxudmFyIEFzeW5jVkRPTUJ1aWxkZXIgPSByZXF1aXJlKFwiLi9Bc3luY1ZET01CdWlsZGVyXCIpO1xucmVxdWlyZShcIi4uL2NyZWF0ZU91dFwiKS5fX19zZXRDcmVhdGVPdXQoXG4gIChUZW1wbGF0ZS5wcm90b3R5cGUuY3JlYXRlT3V0ID0gZnVuY3Rpb24gY3JlYXRlT3V0KFxuICAgIGdsb2JhbERhdGEsXG4gICAgcGFyZW50LFxuICAgIHBhcmVudE91dCxcbiAgKSB7XG4gICAgcmV0dXJuIG5ldyBBc3luY1ZET01CdWlsZGVyKGdsb2JhbERhdGEsIHBhcmVudCwgcGFyZW50T3V0KTtcbiAgfSksXG4pO1xuXG5yZXF1aXJlKFwiLi4vcmVuZGVyYWJsZVwiKShUZW1wbGF0ZS5wcm90b3R5cGUpO1xuIiwidmFyIGhlbHBlcnMgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xudmFyIGluc2VydEJlZm9yZSA9IGhlbHBlcnMuX19faW5zZXJ0QmVmb3JlO1xuXG52YXIgZnJhZ21lbnRQcm90b3R5cGUgPSB7XG4gIG5vZGVUeXBlOiAxMixcbiAgZ2V0IGZpcnN0Q2hpbGQoKSB7XG4gICAgdmFyIGZpcnN0Q2hpbGQgPSB0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZztcbiAgICByZXR1cm4gZmlyc3RDaGlsZCA9PT0gdGhpcy5lbmROb2RlID8gdW5kZWZpbmVkIDogZmlyc3RDaGlsZDtcbiAgfSxcbiAgZ2V0IGxhc3RDaGlsZCgpIHtcbiAgICB2YXIgbGFzdENoaWxkID0gdGhpcy5lbmROb2RlLnByZXZpb3VzU2libGluZztcbiAgICByZXR1cm4gbGFzdENoaWxkID09PSB0aGlzLnN0YXJ0Tm9kZSA/IHVuZGVmaW5lZCA6IGxhc3RDaGlsZDtcbiAgfSxcbiAgZ2V0IHBhcmVudE5vZGUoKSB7XG4gICAgdmFyIHBhcmVudE5vZGUgPSB0aGlzLnN0YXJ0Tm9kZS5wYXJlbnROb2RlO1xuICAgIHJldHVybiBwYXJlbnROb2RlID09PSB0aGlzLmRldGFjaGVkQ29udGFpbmVyID8gdW5kZWZpbmVkIDogcGFyZW50Tm9kZTtcbiAgfSxcbiAgZ2V0IG5hbWVzcGFjZVVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydE5vZGUucGFyZW50Tm9kZS5uYW1lc3BhY2VVUkk7XG4gIH0sXG4gIGdldCBuZXh0U2libGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbmROb2RlLm5leHRTaWJsaW5nO1xuICB9LFxuICBnZXQgbm9kZXMoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGlmICh0aGlzLl9fX21hcmtlcnNSZW1vdmVkRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5fX19tYXJrZXJzUmVtb3ZlZEVycm9yKFwiQ2Fubm90IGdldCBmcmFnbWVudCBub2Rlcy5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5zdGFydE5vZGU7XG4gICAgd2hpbGUgKGN1cnJlbnQgIT09IHRoaXMuZW5kTm9kZSkge1xuICAgICAgbm9kZXMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICBub2Rlcy5wdXNoKGN1cnJlbnQpO1xuICAgIHJldHVybiBub2RlcztcbiAgfSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAobmV3Q2hpbGROb2RlLCByZWZlcmVuY2VOb2RlKSB7XG4gICAgdmFyIGFjdHVhbFJlZmVyZW5jZSA9IHJlZmVyZW5jZU5vZGUgPT0gbnVsbCA/IHRoaXMuZW5kTm9kZSA6IHJlZmVyZW5jZU5vZGU7XG4gICAgcmV0dXJuIGluc2VydEJlZm9yZShcbiAgICAgIG5ld0NoaWxkTm9kZSxcbiAgICAgIGFjdHVhbFJlZmVyZW5jZSxcbiAgICAgIHRoaXMuc3RhcnROb2RlLnBhcmVudE5vZGUsXG4gICAgKTtcbiAgfSxcbiAgaW5zZXJ0SW50bzogZnVuY3Rpb24gKG5ld1BhcmVudE5vZGUsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICB0aGlzLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGluc2VydEJlZm9yZShub2RlLCByZWZlcmVuY2VOb2RlLCBuZXdQYXJlbnROb2RlKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICB0aGlzLmRldGFjaGVkQ29udGFpbmVyLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnROb2RlKHN0YXJ0Tm9kZSwgbmV4dE5vZGUsIHBhcmVudE5vZGUpIHtcbiAgdmFyIGZyYWdtZW50ID0gT2JqZWN0LmNyZWF0ZShmcmFnbWVudFByb3RvdHlwZSk7XG4gIHZhciBpc1Jvb3QgPSBzdGFydE5vZGUgJiYgc3RhcnROb2RlLm93bmVyRG9jdW1lbnQgPT09IHN0YXJ0Tm9kZS5wYXJlbnROb2RlO1xuICBmcmFnbWVudC5zdGFydE5vZGUgPSBpc1Jvb3RcbiAgICA/IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJcIilcbiAgICA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICBmcmFnbWVudC5lbmROb2RlID0gaXNSb290XG4gICAgPyBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiXCIpXG4gICAgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgZnJhZ21lbnQuc3RhcnROb2RlLmZyYWdtZW50ID0gZnJhZ21lbnQ7XG4gIGZyYWdtZW50LmVuZE5vZGUuZnJhZ21lbnQgPSBmcmFnbWVudDtcbiAgdmFyIGRldGFjaGVkQ29udGFpbmVyID0gKGZyYWdtZW50LmRldGFjaGVkQ29udGFpbmVyID1cbiAgICBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpO1xuICBwYXJlbnROb2RlID1cbiAgICBwYXJlbnROb2RlIHx8IChzdGFydE5vZGUgJiYgc3RhcnROb2RlLnBhcmVudE5vZGUpIHx8IGRldGFjaGVkQ29udGFpbmVyO1xuICBpbnNlcnRCZWZvcmUoZnJhZ21lbnQuc3RhcnROb2RlLCBzdGFydE5vZGUsIHBhcmVudE5vZGUpO1xuICBpbnNlcnRCZWZvcmUoZnJhZ21lbnQuZW5kTm9kZSwgbmV4dE5vZGUsIHBhcmVudE5vZGUpO1xuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbmZ1bmN0aW9uIGJlZ2luRnJhZ21lbnROb2RlKHN0YXJ0Tm9kZSwgcGFyZW50Tm9kZSkge1xuICB2YXIgZnJhZ21lbnQgPSBjcmVhdGVGcmFnbWVudE5vZGUoc3RhcnROb2RlLCBudWxsLCBwYXJlbnROb2RlKTtcbiAgZnJhZ21lbnQuX19fZmluaXNoRnJhZ21lbnQgPSBmdW5jdGlvbiAobmV4dE5vZGUpIHtcbiAgICBmcmFnbWVudC5fX19maW5pc2hGcmFnbWVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlKFxuICAgICAgZnJhZ21lbnQuZW5kTm9kZSxcbiAgICAgIG5leHROb2RlLFxuICAgICAgcGFyZW50Tm9kZSB8fCBzdGFydE5vZGUucGFyZW50Tm9kZSxcbiAgICApO1xuICB9O1xuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbmV4cG9ydHMuX19fY3JlYXRlRnJhZ21lbnROb2RlID0gY3JlYXRlRnJhZ21lbnROb2RlO1xuZXhwb3J0cy5fX19iZWdpbkZyYWdtZW50Tm9kZSA9IGJlZ2luRnJhZ21lbnROb2RlO1xuIiwiZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKG5vZGUsIHJlZmVyZW5jZU5vZGUsIHBhcmVudE5vZGUpIHtcbiAgaWYgKG5vZGUuaW5zZXJ0SW50bykge1xuICAgIHJldHVybiBub2RlLmluc2VydEludG8ocGFyZW50Tm9kZSwgcmVmZXJlbmNlTm9kZSk7XG4gIH1cbiAgcmV0dXJuIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKFxuICAgIG5vZGUsXG4gICAgKHJlZmVyZW5jZU5vZGUgJiYgcmVmZXJlbmNlTm9kZS5zdGFydE5vZGUpIHx8IHJlZmVyZW5jZU5vZGUsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGluc2VydEFmdGVyKG5vZGUsIHJlZmVyZW5jZU5vZGUsIHBhcmVudE5vZGUpIHtcbiAgcmV0dXJuIGluc2VydEJlZm9yZShcbiAgICBub2RlLFxuICAgIHJlZmVyZW5jZU5vZGUgJiYgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZyxcbiAgICBwYXJlbnROb2RlLFxuICApO1xufVxuXG5mdW5jdGlvbiBuZXh0U2libGluZyhub2RlKSB7XG4gIHZhciBuZXh0ID0gbm9kZS5uZXh0U2libGluZztcbiAgdmFyIGZyYWdtZW50ID0gbmV4dCAmJiBuZXh0LmZyYWdtZW50O1xuICBpZiAoZnJhZ21lbnQpIHtcbiAgICByZXR1cm4gbmV4dCA9PT0gZnJhZ21lbnQuc3RhcnROb2RlID8gZnJhZ21lbnQgOiBudWxsO1xuICB9XG4gIHJldHVybiBuZXh0O1xufVxuXG5mdW5jdGlvbiBmaXJzdENoaWxkKG5vZGUpIHtcbiAgdmFyIG5leHQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gIHJldHVybiAobmV4dCAmJiBuZXh0LmZyYWdtZW50KSB8fCBuZXh0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVDaGlsZChub2RlKSB7XG4gIGlmIChub2RlLnJlbW92ZSkgbm9kZS5yZW1vdmUoKTtcbiAgZWxzZSBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG59XG5cbmV4cG9ydHMuX19faW5zZXJ0QmVmb3JlID0gaW5zZXJ0QmVmb3JlO1xuZXhwb3J0cy5fX19pbnNlcnRBZnRlciA9IGluc2VydEFmdGVyO1xuZXhwb3J0cy5fX19uZXh0U2libGluZyA9IG5leHRTaWJsaW5nO1xuZXhwb3J0cy5fX19maXJzdENoaWxkID0gZmlyc3RDaGlsZDtcbmV4cG9ydHMuX19fcmVtb3ZlQ2hpbGQgPSByZW1vdmVDaGlsZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgZXhpc3RpbmdDb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG52YXIgZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBjb21wb25lbnRzVXRpbC5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbnZhciBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzID1cbiAgY29tcG9uZW50c1V0aWwuX19fYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cztcbnZhciBub3JtYWxpemVDb21wb25lbnRLZXkgPSBjb21wb25lbnRzVXRpbC5fX19ub3JtYWxpemVDb21wb25lbnRLZXk7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi8uLi9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGV2ZW50RGVsZWdhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9jb21wb25lbnRzL2V2ZW50LWRlbGVnYXRpb25cIik7XG52YXIgS2V5U2VxdWVuY2UgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9LZXlTZXF1ZW5jZVwiKTtcbnZhciBWRWxlbWVudCA9IHJlcXVpcmUoXCIuLi92ZG9tXCIpLl9fX1ZFbGVtZW50O1xudmFyIGZyYWdtZW50ID0gcmVxdWlyZShcIi4vZnJhZ21lbnRcIik7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XG52YXIgdmlydHVhbGl6ZUVsZW1lbnQgPSBWRWxlbWVudC5fX192aXJ0dWFsaXplO1xudmFyIG1vcnBoQXR0cnMgPSBWRWxlbWVudC5fX19tb3JwaEF0dHJzO1xudmFyIGtleXNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2tleUJ5RE9NTm9kZTtcbnZhciBjb21wb25lbnRCeURPTU5vZGUgPSBkb21EYXRhLl9fX2NvbXBvbmVudEJ5RE9NTm9kZTtcbnZhciB2RWxlbWVudEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fdkVsZW1lbnRCeURPTU5vZGU7XG52YXIgZGV0YWNoZWRCeURPTU5vZGUgPSBkb21EYXRhLl9fX2RldGFjaGVkQnlET01Ob2RlO1xuXG52YXIgaW5zZXJ0QmVmb3JlID0gaGVscGVycy5fX19pbnNlcnRCZWZvcmU7XG52YXIgaW5zZXJ0QWZ0ZXIgPSBoZWxwZXJzLl9fX2luc2VydEFmdGVyO1xudmFyIG5leHRTaWJsaW5nID0gaGVscGVycy5fX19uZXh0U2libGluZztcbnZhciBmaXJzdENoaWxkID0gaGVscGVycy5fX19maXJzdENoaWxkO1xudmFyIHJlbW92ZUNoaWxkID0gaGVscGVycy5fX19yZW1vdmVDaGlsZDtcbnZhciBjcmVhdGVGcmFnbWVudE5vZGUgPSBmcmFnbWVudC5fX19jcmVhdGVGcmFnbWVudE5vZGU7XG52YXIgYmVnaW5GcmFnbWVudE5vZGUgPSBmcmFnbWVudC5fX19iZWdpbkZyYWdtZW50Tm9kZTtcblxudmFyIEVMRU1FTlRfTk9ERSA9IDE7XG52YXIgVEVYVF9OT0RFID0gMztcbnZhciBDT01NRU5UX05PREUgPSA4O1xudmFyIENPTVBPTkVOVF9OT0RFID0gMjtcbnZhciBGUkFHTUVOVF9OT0RFID0gMTI7XG52YXIgRE9DVFlQRV9OT0RFID0gMTA7XG5cbi8vIHZhciBGTEFHX1NJTVBMRV9BVFRSUyA9IDE7XG4vLyB2YXIgRkxBR19DVVNUT01fRUxFTUVOVCA9IDI7XG4vLyB2YXIgRkxBR19TUFJFQURfQVRUUlMgPSA0O1xuXG5mdW5jdGlvbiBpc0F1dG9LZXkoa2V5KSB7XG4gIHJldHVybiBrZXlbMF0gIT09IFwiQFwiO1xufVxuXG5mdW5jdGlvbiBjb21wYXJlTm9kZU5hbWVzKGZyb21FbCwgdG9FbCkge1xuICByZXR1cm4gZnJvbUVsLl9fX25vZGVOYW1lID09PSB0b0VsLl9fX25vZGVOYW1lO1xufVxuXG5mdW5jdGlvbiBjYXNlSW5zZW5zaXRpdmVDb21wYXJlKGEsIGIpIHtcbiAgcmV0dXJuIGEudG9Mb3dlckNhc2UoKSA9PT0gYi50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBvbk5vZGVBZGRlZChub2RlLCBjb21wb25lbnRzQ29udGV4dCkge1xuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgZXZlbnREZWxlZ2F0aW9uLl9fX2hhbmRsZU5vZGVBdHRhY2gobm9kZSwgY29tcG9uZW50c0NvbnRleHQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1vcnBoZG9tKGZyb21Ob2RlLCB0b05vZGUsIGhvc3QsIGNvbXBvbmVudHNDb250ZXh0KSB7XG4gIHZhciBnbG9iYWxDb21wb25lbnRzQ29udGV4dDtcbiAgdmFyIGlzSHlkcmF0ZSA9IGZhbHNlO1xuICB2YXIga2V5U2VxdWVuY2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICBpZiAoY29tcG9uZW50c0NvbnRleHQpIHtcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQ7XG4gICAgaXNIeWRyYXRlID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19faXNIeWRyYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgdk5vZGUsXG4gICAga2V5LFxuICAgIHJlZmVyZW5jZUVsLFxuICAgIHBhcmVudEVsLFxuICAgIG93bmVyQ29tcG9uZW50LFxuICAgIHBhcmVudENvbXBvbmVudCxcbiAgKSB7XG4gICAgdmFyIHJlYWxOb2RlID0gdk5vZGUuX19fYWN0dWFsaXplKGhvc3QsIHBhcmVudEVsLm5hbWVzcGFjZVVSSSk7XG4gICAgaW5zZXJ0QmVmb3JlKHJlYWxOb2RlLCByZWZlcmVuY2VFbCwgcGFyZW50RWwpO1xuXG4gICAgaWYgKFxuICAgICAgdk5vZGUuX19fbm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSB8fFxuICAgICAgdk5vZGUuX19fbm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREVcbiAgICApIHtcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAga2V5c0J5RE9NTm9kZS5zZXQocmVhbE5vZGUsIGtleSk7XG4gICAgICAgIChpc0F1dG9LZXkoa2V5KSA/IHBhcmVudENvbXBvbmVudCA6IG93bmVyQ29tcG9uZW50KS5fX19rZXllZEVsZW1lbnRzW1xuICAgICAgICAgIGtleVxuICAgICAgICBdID0gcmVhbE5vZGU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2Tm9kZS5fX19ub2RlTmFtZSAhPT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4ocmVhbE5vZGUsIHZOb2RlLCBwYXJlbnRDb21wb25lbnQpO1xuICAgICAgfVxuXG4gICAgICBvbk5vZGVBZGRlZChyZWFsTm9kZSwgY29tcG9uZW50c0NvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydFZpcnR1YWxDb21wb25lbnRCZWZvcmUoXG4gICAgdkNvbXBvbmVudCxcbiAgICByZWZlcmVuY2VOb2RlLFxuICAgIHJlZmVyZW5jZU5vZGVQYXJlbnRFbCxcbiAgICBjb21wb25lbnQsXG4gICAga2V5LFxuICAgIG93bmVyQ29tcG9uZW50LFxuICAgIHBhcmVudENvbXBvbmVudCxcbiAgKSB7XG4gICAgdmFyIHJvb3ROb2RlID0gKGNvbXBvbmVudC5fX19yb290Tm9kZSA9IGluc2VydEJlZm9yZShcbiAgICAgIGNyZWF0ZUZyYWdtZW50Tm9kZSgpLFxuICAgICAgcmVmZXJlbmNlTm9kZSxcbiAgICAgIHJlZmVyZW5jZU5vZGVQYXJlbnRFbCxcbiAgICApKTtcbiAgICBjb21wb25lbnRCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBjb21wb25lbnQpO1xuXG4gICAgaWYgKGtleSAmJiBvd25lckNvbXBvbmVudCkge1xuICAgICAga2V5ID0gbm9ybWFsaXplQ29tcG9uZW50S2V5KGtleSwgcGFyZW50Q29tcG9uZW50LmlkKTtcbiAgICAgIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gICAgICAgIG93bmVyQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHMsXG4gICAgICAgIGtleSxcbiAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgIGNvbXBvbmVudC5pZCxcbiAgICAgICk7XG4gICAgICBrZXlzQnlET01Ob2RlLnNldChyb290Tm9kZSwga2V5KTtcbiAgICB9XG5cbiAgICBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIHZDb21wb25lbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9ycGhDb21wb25lbnQoY29tcG9uZW50LCB2Q29tcG9uZW50KSB7XG4gICAgbW9ycGhDaGlsZHJlbihjb21wb25lbnQuX19fcm9vdE5vZGUsIHZDb21wb25lbnQsIGNvbXBvbmVudCk7XG4gIH1cblxuICB2YXIgZGV0YWNoZWROb2RlcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGRldGFjaE5vZGUobm9kZSwgcGFyZW50Tm9kZSwgb3duZXJDb21wb25lbnQpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREUpIHtcbiAgICAgIGRldGFjaGVkTm9kZXMucHVzaChub2RlKTtcbiAgICAgIGRldGFjaGVkQnlET01Ob2RlLnNldChub2RlLCBvd25lckNvbXBvbmVudCB8fCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdHJveU5vZGVSZWN1cnNpdmUobm9kZSk7XG4gICAgICByZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGNvbXBvbmVudC5kZXN0cm95KCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3JwaENoaWxkcmVuKGZyb21Ob2RlLCB0b05vZGUsIHBhcmVudENvbXBvbmVudCkge1xuICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZmlyc3RDaGlsZChmcm9tTm9kZSk7XG4gICAgdmFyIGN1clRvTm9kZUNoaWxkID0gdG9Ob2RlLl9fX2ZpcnN0Q2hpbGQ7XG5cbiAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgIHZhciBjdXJGcm9tTm9kZUtleTtcbiAgICB2YXIgY3VyVG9Ob2RlVHlwZTtcblxuICAgIHZhciBmcm9tTmV4dFNpYmxpbmc7XG4gICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgdmFyIG1hdGNoaW5nRnJvbUVsO1xuICAgIHZhciBtYXRjaGluZ0Zyb21Db21wb25lbnQ7XG4gICAgdmFyIGN1clZGcm9tTm9kZUNoaWxkO1xuICAgIHZhciBmcm9tQ29tcG9uZW50O1xuXG4gICAgb3V0ZXI6IHdoaWxlIChjdXJUb05vZGVDaGlsZCkge1xuICAgICAgdG9OZXh0U2libGluZyA9IGN1clRvTm9kZUNoaWxkLl9fX25leHRTaWJsaW5nO1xuICAgICAgY3VyVG9Ob2RlVHlwZSA9IGN1clRvTm9kZUNoaWxkLl9fX25vZGVUeXBlO1xuICAgICAgY3VyVG9Ob2RlS2V5ID0gY3VyVG9Ob2RlQ2hpbGQuX19fa2V5O1xuXG4gICAgICAvLyBTa2lwIDwhZG9jdHlwZT5cbiAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkICYmIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGUgPT09IERPQ1RZUEVfTk9ERSkge1xuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvd25lckNvbXBvbmVudCA9IGN1clRvTm9kZUNoaWxkLl9fX293bmVyQ29tcG9uZW50IHx8IHBhcmVudENvbXBvbmVudDtcbiAgICAgIHZhciByZWZlcmVuY2VDb21wb25lbnQ7XG5cbiAgICAgIGlmIChjdXJUb05vZGVUeXBlID09PSBDT01QT05FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gY3VyVG9Ob2RlQ2hpbGQuX19fY29tcG9uZW50O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKG1hdGNoaW5nRnJvbUNvbXBvbmVudCA9IGV4aXN0aW5nQ29tcG9uZW50TG9va3VwW2NvbXBvbmVudC5pZF0pID09PVxuICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaXNIeWRyYXRlKSB7XG4gICAgICAgICAgICB2YXIgcm9vdE5vZGUgPSBiZWdpbkZyYWdtZW50Tm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG4gICAgICAgICAgICBjb21wb25lbnQuX19fcm9vdE5vZGUgPSByb290Tm9kZTtcbiAgICAgICAgICAgIGNvbXBvbmVudEJ5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGlmIChvd25lckNvbXBvbmVudCAmJiBjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5ID0gbm9ybWFsaXplQ29tcG9uZW50S2V5KFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQuaWQsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMoXG4gICAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50cyxcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmlkLFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGtleXNCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBjdXJUb05vZGVLZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIGN1clRvTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG5leHRTaWJsaW5nKHJvb3ROb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5zZXJ0VmlydHVhbENvbXBvbmVudEJlZm9yZShcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICBjb21wb25lbnQsXG4gICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtYXRjaGluZ0Zyb21Db21wb25lbnQuX19fcm9vdE5vZGUgIT09IGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCAmJlxuICAgICAgICAgICAgICAoZnJvbUNvbXBvbmVudCA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCkpICYmXG4gICAgICAgICAgICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbXG4gICAgICAgICAgICAgICAgZnJvbUNvbXBvbmVudC5pZFxuICAgICAgICAgICAgICBdID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAvLyBUaGUgY29tcG9uZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCByZWFsIERPTSBub2RlIHdhcyBub3QgcmVuZGVyZWRcbiAgICAgICAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGp1c3QgcmVtb3ZlIGl0IG91dCBvZiB0aGUgcmVhbCBET00gYnkgZGVzdHJveWluZyBpdFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbmV4dFNpYmxpbmcoZnJvbUNvbXBvbmVudC5fX19yb290Tm9kZSk7XG4gICAgICAgICAgICAgIGRlc3Ryb3lDb21wb25lbnQoZnJvbUNvbXBvbmVudCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIG1vdmUgdGhlIGV4aXN0aW5nIGNvbXBvbmVudCBpbnRvXG4gICAgICAgICAgICAvLyB0aGUgY29ycmVjdCBsb2NhdGlvblxuICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICBtYXRjaGluZ0Zyb21Db21wb25lbnQuX19fcm9vdE5vZGUsXG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9XG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgJiYgbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgbW9ycGhDb21wb25lbnQoY29tcG9uZW50LCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAoY3VyVG9Ob2RlS2V5KSB7XG4gICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdW5kZWZpbmVkO1xuICAgICAgICBjdXJGcm9tTm9kZUtleSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGN1clRvTm9kZUtleU9yaWdpbmFsID0gY3VyVG9Ob2RlS2V5O1xuXG4gICAgICAgIGlmIChpc0F1dG9LZXkoY3VyVG9Ob2RlS2V5KSkge1xuICAgICAgICAgIGlmIChvd25lckNvbXBvbmVudCAhPT0gcGFyZW50Q29tcG9uZW50KSB7XG4gICAgICAgICAgICBjdXJUb05vZGVLZXkgKz0gXCI6XCIgKyBvd25lckNvbXBvbmVudC5pZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50ID0gcGFyZW50Q29tcG9uZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudCA9IG93bmVyQ29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgaGF2ZSBhIGtleWVkIGVsZW1lbnQuIFRoaXMgaXMgdGhlIGZhc3QgcGF0aCBmb3IgbWF0Y2hpbmdcbiAgICAgICAgLy8gdXAgZWxlbWVudHNcbiAgICAgICAgY3VyVG9Ob2RlS2V5ID0gKFxuICAgICAgICAgIGtleVNlcXVlbmNlc1tyZWZlcmVuY2VDb21wb25lbnQuaWRdIHx8XG4gICAgICAgICAgKGtleVNlcXVlbmNlc1tyZWZlcmVuY2VDb21wb25lbnQuaWRdID0gbmV3IEtleVNlcXVlbmNlKCkpXG4gICAgICAgICkuX19fbmV4dEtleShjdXJUb05vZGVLZXkpO1xuXG4gICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBrZXlzQnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJGcm9tTm9kZUtleSA9PT0gY3VyVG9Ob2RlS2V5KSB7XG4gICAgICAgICAgLy8gRWxlbWVudHMgbGluZSB1cC4gTm93IHdlIGp1c3QgaGF2ZSB0byBtYWtlIHN1cmUgdGhleSBhcmUgY29tcGF0aWJsZVxuICAgICAgICAgIGlmICghY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUpIHtcbiAgICAgICAgICAgIC8vIFdlIGp1c3Qgc2tpcCBvdmVyIHRoZSBmcm9tTm9kZSBpZiBpdCBpcyBwcmVzZXJ2ZWRcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCAmJlxuICAgICAgICAgICAgICBjdXJUb05vZGVUeXBlID09PSBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlVHlwZSAmJlxuICAgICAgICAgICAgICAoY3VyVG9Ob2RlVHlwZSAhPT0gRUxFTUVOVF9OT0RFIHx8XG4gICAgICAgICAgICAgICAgY29tcGFyZU5vZGVOYW1lcyhjdXJUb05vZGVDaGlsZCwgY3VyVkZyb21Ob2RlQ2hpbGQpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmIChjdXJUb05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKFxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb2xkIG5vZGVcbiAgICAgICAgICAgICAgZGV0YWNoTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSwgb3duZXJDb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgIC8vIEluY29tcGF0aWJsZSBub2Rlcy4gSnVzdCBtb3ZlIHRoZSB0YXJnZXQgVk5vZGUgaW50byB0aGUgRE9NIGF0IHRoaXMgcG9zaXRpb25cbiAgICAgICAgICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGluZ0Zyb21FbCA9IHJlZmVyZW5jZUNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2N1clRvTm9kZUtleV07XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbWF0Y2hpbmdGcm9tRWwgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgbWF0Y2hpbmdGcm9tRWwgPT09IGN1ckZyb21Ob2RlQ2hpbGRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChpc0h5ZHJhdGUgJiYgY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgKGN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlIHx8XG4gICAgICAgICAgICAgICAgICBjYXNlSW5zZW5zaXRpdmVDb21wYXJlKFxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZC5fX19ub2RlTmFtZSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2aXJ0dWFsaXplRWxlbWVudChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlTmFtZSA9IGN1clRvTm9kZUNoaWxkLl9fX25vZGVOYW1lO1xuICAgICAgICAgICAgICAgIGtleXNCeURPTU5vZGUuc2V0KGN1ckZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbY3VyVG9Ob2RlS2V5XSA9XG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICAgICAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVkZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlID09PSBDT01NRU5UX05PREVcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGVudCA9PSBcIkYjXCIgKyBjdXJUb05vZGVLZXlPcmlnaW5hbCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGVuZE5vZGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgdmFyIGRlcHRoID0gMDtcbiAgICAgICAgICAgICAgICAgIHZhciBub2RlVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmROb2RlLm5vZGVUeXBlID09PSBDT01NRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBub2RlVmFsdWUgPSBlbmROb2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZVZhbHVlID09PSBcIkYvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlVmFsdWUuaW5kZXhPZihcIkYjXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXB0aCsrO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbmROb2RlID0gZW5kTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgdmFyIGZyYWdtZW50ID0gY3JlYXRlRnJhZ21lbnROb2RlKFxuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBlbmROb2RlLm5leHRTaWJsaW5nLFxuICAgICAgICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBrZXlzQnlET01Ob2RlLnNldChmcmFnbWVudCwgY3VyVG9Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChmcmFnbWVudCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbY3VyVG9Ob2RlS2V5XSA9IGZyYWdtZW50O1xuICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICByZW1vdmVDaGlsZChlbmROb2RlKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKGZyYWdtZW50LCBjdXJUb05vZGVDaGlsZCwgcGFyZW50Q29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyYWdtZW50Lm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGV0YWNoZWRCeURPTU5vZGUuZ2V0KG1hdGNoaW5nRnJvbUVsKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGRldGFjaGVkQnlET01Ob2RlLnNldChtYXRjaGluZ0Zyb21FbCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChtYXRjaGluZ0Zyb21FbCk7XG5cbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkICYmXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlVHlwZSA9PT0gY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZVR5cGUgJiZcbiAgICAgICAgICAgICAgICAoY3VyVG9Ob2RlVHlwZSAhPT0gRUxFTUVOVF9OT0RFIHx8XG4gICAgICAgICAgICAgICAgICBjb21wYXJlTm9kZU5hbWVzKGN1clZGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCkpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgZWxlbWVudCByZW1vdmFsOlxuICAgICAgICAgICAgICAgICAgLy8gQSA8LT4gQVxuICAgICAgICAgICAgICAgICAgLy8gQiA8LT4gQyA8LS0gV2UgYXJlIGhlcmVcbiAgICAgICAgICAgICAgICAgIC8vIEMgICAgIERcbiAgICAgICAgICAgICAgICAgIC8vIERcbiAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgZWxlbWVudCBzd2FwOlxuICAgICAgICAgICAgICAgICAgLy8gQSA8LT4gQVxuICAgICAgICAgICAgICAgICAgLy8gQiA8LT4gQyA8LS0gV2UgYXJlIGhlcmVcbiAgICAgICAgICAgICAgICAgIC8vIEMgICAgIEJcblxuICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nICYmXG4gICAgICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcuX19fa2V5ID09PSBjdXJGcm9tTm9kZUtleVxuICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHN3YXBcblxuICAgICAgICAgICAgICAgICAgICAvLyBXZSB3YW50IHRvIHN0YXkgb24gdGhlIGN1cnJlbnQgcmVhbCBET00gbm9kZVxuICAgICAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEJ1dCBtb3ZlIHRoZSBtYXRjaGluZyBlbGVtZW50IGludG8gcGxhY2VcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgZWxlbWVudCByZW1vdmFsXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byByZW1vdmUgdGhlIGN1cnJlbnQgcmVhbCBET00gbm9kZVxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlIG1hdGNoaW5nIHJlYWwgRE9NIG5vZGUgd2lsbCBmYWxsIGludG9cbiAgICAgICAgICAgICAgICAgICAgLy8gcGxhY2UuIFdlIHdpbGwgY29udGludWUgZGlmZmluZyB3aXRoIG5leHQgc2libGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgcmVhbCBET00gbm9kZSB0aGF0IGp1c3QgZmVsbCBpbnRvIHBsYWNlXG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGZyb21OZXh0U2libGluZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gQSA8LT4gQVxuICAgICAgICAgICAgICAgICAgLy8gQiA8LT4gRCA8LS0gV2UgYXJlIGhlcmVcbiAgICAgICAgICAgICAgICAgIC8vIENcbiAgICAgICAgICAgICAgICAgIC8vIERcblxuICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBtb3ZlIHRoZSBtYXRjaGluZyBub2RlIGludG8gcGxhY2VcbiAgICAgICAgICAgICAgICAgIGluc2VydEFmdGVyKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGRldGFjaE5vZGUobWF0Y2hpbmdGcm9tRWwsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIHByZXNlcnZlIHRoZSBub2RlXG4gICAgICAgICAgICAgIC8vIGJ1dCBzdGlsbCB3ZSBuZWVkIHRvIGRpZmYgdGhlIGN1cnJlbnQgZnJvbSBub2RlXG4gICAgICAgICAgICAgIGluc2VydEJlZm9yZShtYXRjaGluZ0Zyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUpO1xuICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBrbm93IHRoZSB0YXJnZXQgbm9kZSBpcyBub3QgYSBWQ29tcG9uZW50IG5vZGUgYW5kIHdlIGtub3dcbiAgICAgIC8vIGl0IGlzIGFsc28gbm90IGEgcHJlc2VydmUgbm9kZS4gTGV0J3Mgbm93IG1hdGNoIHVwIHRoZSBIVE1MXG4gICAgICAvLyBlbGVtZW50LCB0ZXh0IG5vZGUsIGNvbW1lbnQsIGV0Yy5cbiAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgIGlmICgoZnJvbUNvbXBvbmVudCA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgLy8gVGhlIGN1cnJlbnQgXCJ0b1wiIGVsZW1lbnQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIGNvbXBvbmVudCxcbiAgICAgICAgICAvLyBidXQgdGhlIGN1cnJlbnQgXCJmcm9tXCIgZWxlbWVudCBpcyBhc3NvY2lhdGVkIHdpdGggYSBjb21wb25lbnRcblxuICAgICAgICAgIC8vIEV2ZW4gaWYgd2UgZGVzdHJveSB0aGUgY3VycmVudCBjb21wb25lbnQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgLy8gRE9NIG9yIG5vdCwgd2Ugc3RpbGwgbmVlZCB0byBza2lwIG92ZXIgaXQgc2luY2UgaXQgaXNcbiAgICAgICAgICAvLyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW2Zyb21Db21wb25lbnQuaWRdXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBkZXN0cm95Q29tcG9uZW50KGZyb21Db21wb25lbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRpbnVlOyAvLyBNb3ZlIHRvIHRoZSBuZXh0IFwiZnJvbVwiIG5vZGVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgIHZhciBpc0NvbXBhdGlibGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gY3VyVG9Ob2RlVHlwZSkge1xuICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2RWxlbWVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgICBpZiAoY3VyVkZyb21Ob2RlQ2hpbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBpZiAoaXNIeWRyYXRlKSB7XG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2aXJ0dWFsaXplRWxlbWVudChjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGNhc2VJbnNlbnNpdGl2ZUNvbXBhcmUoXG4gICAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZC5fX19ub2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVOYW1lID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNraXAgb3ZlciBub2RlcyB0aGF0IGRvbid0IGxvb2sgbGlrZSBvdXJzLi4uXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgoY3VyRnJvbU5vZGVLZXkgPSBjdXJWRnJvbU5vZGVDaGlsZC5fX19rZXkpKSB7XG4gICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBrZXllZCBlbGVtZW50IGhlcmUgYnV0IG91ciB0YXJnZXQgVkRPTSBub2RlXG4gICAgICAgICAgICAgIC8vIGlzIG5vdCBrZXllZCBzbyB0aGlzIG5vdCBkb2Vzbid0IGJlbG9uZ1xuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXNDb21wYXRpYmxlID1cbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlICE9PSBmYWxzZSAmJlxuICAgICAgICAgICAgICBjb21wYXJlTm9kZU5hbWVzKGN1clZGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCkgPT09IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgIC8vIHRoZSBjdXJyZW50IFwiZnJvbVwiIG5vZGUgdG8gbWF0Y2ggdGhlIGN1cnJlbnRcbiAgICAgICAgICAgICAgLy8gdGFyZ2V0IERPTSBub2RlLlxuICAgICAgICAgICAgICBtb3JwaEVsKFxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBjdXJGcm9tTm9kZVR5cGUgPT09IFRFWFRfTk9ERSB8fFxuICAgICAgICAgICAgY3VyRnJvbU5vZGVUeXBlID09PSBDT01NRU5UX05PREVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIFRleHQgb3IgQ29tbWVudCBub2Rlc1xuICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVWYWx1ZSA9IGN1clRvTm9kZUNoaWxkLl9fX25vZGVWYWx1ZTtcbiAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVZhbHVlID0gY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlVmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGlzSHlkcmF0ZSAmJlxuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZVR5cGUgPT09IFRFWFRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcuX19fbm9kZVR5cGUgPT09IFRFWFRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlVmFsdWUuc3RhcnRzV2l0aChjdXJUb05vZGVWYWx1ZSkgJiZcbiAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nLl9fX25vZGVWYWx1ZS5zdGFydHNXaXRoKFxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVWYWx1ZS5zbGljZShjdXJUb05vZGVWYWx1ZS5sZW5ndGgpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gaHlkcmF0ZSBtb2RlIHdlIGNhbiB1c2Ugc3BsaXRUZXh0IHRvIG1vcmUgZWZmaWNpZW50bHkgaGFuZGxlXG4gICAgICAgICAgICAgICAgLy8gYWRqYWNlbnQgdGV4dCB2ZG9tIG5vZGVzIHRoYXQgd2VyZSBtZXJnZWQuXG4gICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5zcGxpdFRleHQoXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTaW1wbHkgdXBkYXRlIG5vZGVWYWx1ZSBvbiB0aGUgb3JpZ2luYWwgbm9kZSB0b1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0aGUgdGV4dCB2YWx1ZVxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlID0gY3VyVG9Ob2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNDb21wYXRpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgLy8gQWR2YW5jZSBib3RoIHRoZSBcInRvXCIgY2hpbGQgYW5kIHRoZSBcImZyb21cIiBjaGlsZCBzaW5jZSB3ZSBmb3VuZCBhIG1hdGNoXG4gICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9IC8vIEVORDogd2hpbGUgKGN1ckZyb21Ob2RlQ2hpbGQpXG5cbiAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgIC8vIG91ciBcInRvIG5vZGVcIiBhbmQgd2UgZXhoYXVzdGVkIGFsbCBvZiB0aGUgY2hpbGRyZW4gXCJmcm9tXCJcbiAgICAgIC8vIG5vZGVzLiBUaGVyZWZvcmUsIHdlIHdpbGwganVzdCBhcHBlbmQgdGhlIGN1cnJlbnQgXCJ0b1wiIG5vZGVcbiAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICk7XG5cbiAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgfVxuXG4gICAgLy8gV2UgaGF2ZSBwcm9jZXNzZWQgYWxsIG9mIHRoZSBcInRvIG5vZGVzXCIuXG4gICAgaWYgKGZyb21Ob2RlLl9fX2ZpbmlzaEZyYWdtZW50KSB7XG4gICAgICAvLyBJZiB3ZSBhcmUgaW4gYW4gdW5maW5pc2hlZCBmcmFnbWVudCwgd2UgaGF2ZSByZWFjaGVkIHRoZSBlbmQgb2YgdGhlIG5vZGVzXG4gICAgICAvLyB3ZSB3ZXJlIG1hdGNoaW5nIHVwIGFuZCBuZWVkIHRvIGVuZCB0aGUgZnJhZ21lbnRcbiAgICAgIGZyb21Ob2RlLl9fX2ZpbmlzaEZyYWdtZW50KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBjdXJGcm9tTm9kZUNoaWxkIGlzIG5vbi1udWxsIHRoZW4gd2Ugc3RpbGwgaGF2ZSBzb21lIGZyb20gbm9kZXNcbiAgICAgIC8vIGxlZnQgb3ZlciB0aGF0IG5lZWQgdG8gYmUgcmVtb3ZlZFxuICAgICAgdmFyIGZyYWdtZW50Qm91bmRhcnkgPVxuICAgICAgICBmcm9tTm9kZS5ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERSA/IGZyb21Ob2RlLmVuZE5vZGUgOiBudWxsO1xuXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCAmJiBjdXJGcm9tTm9kZUNoaWxkICE9PSBmcmFnbWVudEJvdW5kYXJ5KSB7XG4gICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgIGlmICgoZnJvbUNvbXBvbmVudCA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtmcm9tQ29tcG9uZW50LmlkXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgZGVzdHJveUNvbXBvbmVudChmcm9tQ29tcG9uZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBrZXlzQnlET01Ob2RlLmdldChmcm9tTm9kZSk7XG5cbiAgICAgICAgLy8gRm9yIHRyYW5zY2x1ZGVkIGNvbnRlbnQsIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIGVsZW1lbnQgYmVsb25ncyB0byBhIGRpZmZlcmVudCBjb21wb25lbnRcbiAgICAgICAgLy8gY29udGV4dCB0aGFuIHRoZSBjdXJyZW50IGNvbXBvbmVudCBhbmQgZW5zdXJlIGl0IGdldHMgcmVtb3ZlZCBmcm9tIGl0cyBrZXkgaW5kZXguXG4gICAgICAgIGlmICghY3VyRnJvbU5vZGVLZXkgfHwgaXNBdXRvS2V5KGN1ckZyb21Ob2RlS2V5KSkge1xuICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudCA9IHBhcmVudENvbXBvbmVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQgPVxuICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgJiYgY3VyVkZyb21Ob2RlQ2hpbGQuX19fb3duZXJDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCByZWZlcmVuY2VDb21wb25lbnQpO1xuXG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW9ycGhFbChmcm9tRWwsIHZGcm9tRWwsIHRvRWwsIHBhcmVudENvbXBvbmVudCkge1xuICAgIHZhciBub2RlTmFtZSA9IHRvRWwuX19fbm9kZU5hbWU7XG4gICAgdmFyIGNvbnN0SWQgPSB0b0VsLl9fX2NvbnN0SWQ7XG4gICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGZyb21FbCwgdG9FbCk7XG5cbiAgICBpZiAoY29uc3RJZCAhPT0gdW5kZWZpbmVkICYmIHZGcm9tRWwuX19fY29uc3RJZCA9PT0gY29uc3RJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB2RnJvbUVsLCB0b0VsKTtcblxuICAgIGlmICh0b0VsLl9fX3ByZXNlcnZlQm9keSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICBpZiAodG9FbC5fX192YWx1ZUludGVybmFsICE9PSB2RnJvbUVsLl9fX3ZhbHVlSW50ZXJuYWwpIHtcbiAgICAgICAgZnJvbUVsLnZhbHVlID0gdG9FbC5fX192YWx1ZUludGVybmFsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtb3JwaENoaWxkcmVuKGZyb21FbCwgdG9FbCwgcGFyZW50Q29tcG9uZW50KTtcbiAgICB9XG4gIH0gLy8gRU5EOiBtb3JwaEVsKC4uLilcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBjb21wb25lbnRzVXRpbC5fX19zdG9wRE9NTWFuaXB1bGF0aW9uV2FybmluZyhob3N0KTtcbiAgfVxuXG4gIG1vcnBoQ2hpbGRyZW4oZnJvbU5vZGUsIHRvTm9kZSwgdG9Ob2RlLl9fX2NvbXBvbmVudCk7XG5cbiAgZGV0YWNoZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIGRldGFjaGVkRnJvbUNvbXBvbmVudCA9IGRldGFjaGVkQnlET01Ob2RlLmdldChub2RlKTtcblxuICAgIGlmIChkZXRhY2hlZEZyb21Db21wb25lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGV0YWNoZWRCeURPTU5vZGUuc2V0KG5vZGUsIHVuZGVmaW5lZCk7XG5cbiAgICAgIHZhciBjb21wb25lbnRUb0Rlc3Ryb3kgPSBjb21wb25lbnRCeURPTU5vZGUuZ2V0KG5vZGUpO1xuICAgICAgaWYgKGNvbXBvbmVudFRvRGVzdHJveSkge1xuICAgICAgICBjb21wb25lbnRUb0Rlc3Ryb3kuZGVzdHJveSgpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgZGVzdHJveU5vZGVSZWN1cnNpdmUoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBkZXRhY2hlZEZyb21Db21wb25lbnQgIT09IHRydWUgJiYgZGV0YWNoZWRGcm9tQ29tcG9uZW50LFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChldmVudERlbGVnYXRpb24uX19faGFuZGxlTm9kZURldGFjaChub2RlKSAhPSBmYWxzZSkge1xuICAgICAgICAgIHJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICBjb21wb25lbnRzVXRpbC5fX19zdGFydERPTU1hbmlwdWxhdGlvbldhcm5pbmcoaG9zdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtb3JwaGRvbTtcbiIsInZhciBwYXJzZUhUTUwgPSBmdW5jdGlvbiAoaHRtbCkge1xuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICBwYXJzZUhUTUwgPSBjb250YWluZXIuY29udGVudFxuICAgID8gZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHJldHVybiBjb250YWluZXIuY29udGVudDtcbiAgICAgIH1cbiAgICA6IGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgICAgfTtcblxuICByZXR1cm4gcGFyc2VIVE1MKGh0bWwpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaHRtbCkge1xuICByZXR1cm4gcGFyc2VIVE1MKGh0bWwpLmZpcnN0Q2hpbGQ7XG59O1xuIiwidmFyIHBhcnNlSFRNTCA9IHJlcXVpcmUoXCIuL3BhcnNlLWh0bWxcIik7XG52YXIgVkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL1ZDb21wb25lbnRcIik7XG52YXIgVkRvY3VtZW50RnJhZ21lbnQgPSByZXF1aXJlKFwiLi9WRG9jdW1lbnRGcmFnbWVudFwiKTtcbnZhciBWRWxlbWVudCA9IHJlcXVpcmUoXCIuL1ZFbGVtZW50XCIpO1xudmFyIFZGcmFnbWVudCA9IHJlcXVpcmUoXCIuL1ZGcmFnbWVudFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xudmFyIFZUZXh0ID0gcmVxdWlyZShcIi4vVlRleHRcIik7XG5cbnZhciBzcGVjaWFsSHRtbFJlZ2V4cCA9IC9bJjxdLztcblxuZnVuY3Rpb24gdmlydHVhbGl6ZUNoaWxkTm9kZXMobm9kZSwgdmRvbVBhcmVudCwgb3duZXJDb21wb25lbnQpIHtcbiAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICB2ZG9tUGFyZW50Ll9fX2FwcGVuZENoaWxkKHZpcnR1YWxpemUoY3VyQ2hpbGQsIG93bmVyQ29tcG9uZW50KSk7XG4gICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiB2aXJ0dWFsaXplKG5vZGUsIG93bmVyQ29tcG9uZW50KSB7XG4gIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBWRWxlbWVudC5fX192aXJ0dWFsaXplKG5vZGUsIHZpcnR1YWxpemVDaGlsZE5vZGVzLCBvd25lckNvbXBvbmVudCk7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIG5ldyBWVGV4dChub2RlLm5vZGVWYWx1ZSwgb3duZXJDb21wb25lbnQpO1xuICAgIGNhc2UgMTE6XG4gICAgICB2YXIgdmRvbURvY0ZyYWdtZW50ID0gbmV3IFZEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICB2aXJ0dWFsaXplQ2hpbGROb2Rlcyhub2RlLCB2ZG9tRG9jRnJhZ21lbnQsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgIHJldHVybiB2ZG9tRG9jRnJhZ21lbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmlydHVhbGl6ZUhUTUwoaHRtbCwgb3duZXJDb21wb25lbnQpIHtcbiAgaWYgKCFzcGVjaWFsSHRtbFJlZ2V4cC50ZXN0KGh0bWwpKSB7XG4gICAgcmV0dXJuIG5ldyBWVGV4dChodG1sLCBvd25lckNvbXBvbmVudCk7XG4gIH1cblxuICB2YXIgdmRvbUZyYWdtZW50ID0gbmV3IFZEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBjdXJDaGlsZCA9IHBhcnNlSFRNTChodG1sKTtcblxuICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICB2ZG9tRnJhZ21lbnQuX19fYXBwZW5kQ2hpbGQodmlydHVhbGl6ZShjdXJDaGlsZCwgb3duZXJDb21wb25lbnQpKTtcbiAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIHZkb21GcmFnbWVudDtcbn1cblxudmFyIE5vZGVfcHJvdG90eXBlID0gVk5vZGUucHJvdG90eXBlO1xuXG4vKipcbiAqIFNob3J0aGFuZCBtZXRob2QgZm9yIGNyZWF0aW5nIGFuZCBhcHBlbmRpbmcgYSBUZXh0IG5vZGUgd2l0aCBhIGdpdmVuIHZhbHVlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHZhbHVlIFRoZSB0ZXh0IHZhbHVlIGZvciB0aGUgbmV3IFRleHQgbm9kZVxuICovXG5Ob2RlX3Byb3RvdHlwZS50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICB2YXIgdmRvbU5vZGU7XG5cbiAgaWYgKHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgdmFsdWUgPSBcIlwiO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgaWYgKHZhbHVlLnRvSFRNTCkge1xuICAgICAgICB2ZG9tTm9kZSA9IHZpcnR1YWxpemVIVE1MKHZhbHVlLnRvSFRNTCgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLl9fX2FwcGVuZENoaWxkKHZkb21Ob2RlIHx8IG5ldyBWVGV4dCh2YWx1ZS50b1N0cmluZygpKSk7XG4gIHJldHVybiB0aGlzLl9fX2ZpbmlzaENoaWxkKCk7XG59O1xuXG5Ob2RlX3Byb3RvdHlwZS5fX19hcHBlbmREb2N1bWVudEZyYWdtZW50ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fX19hcHBlbmRDaGlsZChuZXcgVkRvY3VtZW50RnJhZ21lbnQoKSk7XG59O1xuXG5leHBvcnRzLl9fX1ZEb2N1bWVudEZyYWdtZW50ID0gVkRvY3VtZW50RnJhZ21lbnQ7XG5leHBvcnRzLl9fX1ZFbGVtZW50ID0gVkVsZW1lbnQ7XG5leHBvcnRzLl9fX1ZUZXh0ID0gVlRleHQ7XG5leHBvcnRzLl9fX1ZDb21wb25lbnQgPSBWQ29tcG9uZW50O1xuZXhwb3J0cy5fX19WRnJhZ21lbnQgPSBWRnJhZ21lbnQ7XG5leHBvcnRzLl9fX3ZpcnR1YWxpemUgPSB2aXJ0dWFsaXplO1xuZXhwb3J0cy5fX192aXJ0dWFsaXplSFRNTCA9IHZpcnR1YWxpemVIVE1MO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb3B5UHJvcHMoZnJvbSwgdG8pIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhmcm9tKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZyb20sIG5hbWUpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodG8sIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH0pO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQsIHNvdXJjZSkgeyAvL0Egc2ltcGxlIGZ1bmN0aW9uIHRvIGNvcHkgcHJvcGVydGllcyBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlclxuICAgIGlmICghdGFyZ2V0KSB7IC8vQ2hlY2sgaWYgYSB0YXJnZXQgd2FzIHByb3ZpZGVkLCBvdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5IG9iamVjdCB0byByZXR1cm5cbiAgICAgICAgdGFyZ2V0ID0ge307XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7IC8vT25seSBsb29rIGF0IHNvdXJjZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBpbmhlcml0ZWRcbiAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcE5hbWVdID0gc291cmNlW3Byb3BOYW1lXTsgLy9Db3B5IHRoZSBwcm9wZXJ0eVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07IiwidmFyIGNvcHlQcm9wcyA9IHJlcXVpcmUoJy4vY29weVByb3BzJyk7XG5cbmZ1bmN0aW9uIGluaGVyaXQoY3Rvciwgc3VwZXJDdG9yLCBzaG91bGRDb3B5UHJvcHMpIHtcbiAgICB2YXIgb2xkUHJvdG8gPSBjdG9yLnByb3RvdHlwZTtcbiAgICB2YXIgbmV3UHJvdG8gPSBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG9sZFByb3RvICYmIHNob3VsZENvcHlQcm9wcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgY29weVByb3BzKG9sZFByb3RvLCBuZXdQcm90byk7XG4gICAgfVxuICAgIGN0b3IuJHN1cGVyID0gc3VwZXJDdG9yO1xuICAgIGN0b3IucHJvdG90eXBlID0gbmV3UHJvdG87XG4gICAgcmV0dXJuIGN0b3I7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBpbmhlcml0O1xuaW5oZXJpdC5faW5oZXJpdCA9IGluaGVyaXQ7XG4iLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24gKFVNRCkgdG8gc3VwcG9ydCBBTUQsIENvbW1vbkpTL05vZGUuanMsIFJoaW5vLCBhbmQgYnJvd3NlcnMuXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKCdzdGFja2ZyYW1lJywgW10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuU3RhY2tGcmFtZSA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBfaXNOdW1iZXIobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jYXBpdGFsaXplKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0dGVyKHApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbcF07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGJvb2xlYW5Qcm9wcyA9IFsnaXNDb25zdHJ1Y3RvcicsICdpc0V2YWwnLCAnaXNOYXRpdmUnLCAnaXNUb3BsZXZlbCddO1xuICAgIHZhciBudW1lcmljUHJvcHMgPSBbJ2NvbHVtbk51bWJlcicsICdsaW5lTnVtYmVyJ107XG4gICAgdmFyIHN0cmluZ1Byb3BzID0gWydmaWxlTmFtZScsICdmdW5jdGlvbk5hbWUnLCAnc291cmNlJ107XG4gICAgdmFyIGFycmF5UHJvcHMgPSBbJ2FyZ3MnXTtcbiAgICB2YXIgb2JqZWN0UHJvcHMgPSBbJ2V2YWxPcmlnaW4nXTtcblxuICAgIHZhciBwcm9wcyA9IGJvb2xlYW5Qcm9wcy5jb25jYXQobnVtZXJpY1Byb3BzLCBzdHJpbmdQcm9wcywgYXJyYXlQcm9wcywgb2JqZWN0UHJvcHMpO1xuXG4gICAgZnVuY3Rpb24gU3RhY2tGcmFtZShvYmopIHtcbiAgICAgICAgaWYgKCFvYmopIHJldHVybjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9ialtwcm9wc1tpXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXNbJ3NldCcgKyBfY2FwaXRhbGl6ZShwcm9wc1tpXSldKG9ialtwcm9wc1tpXV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgU3RhY2tGcmFtZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldEFyZ3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJncztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0QXJnczogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3MgbXVzdCBiZSBhbiBBcnJheScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcmdzID0gdjtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRFdmFsT3JpZ2luOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWxPcmlnaW47XG4gICAgICAgIH0sXG4gICAgICAgIHNldEV2YWxPcmlnaW46IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIGlmICh2IGluc3RhbmNlb2YgU3RhY2tGcmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZhbE9yaWdpbiA9IHY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2YWxPcmlnaW4gPSBuZXcgU3RhY2tGcmFtZSh2KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXZhbCBPcmlnaW4gbXVzdCBiZSBhbiBPYmplY3Qgb3IgU3RhY2tGcmFtZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHRoaXMuZ2V0RmlsZU5hbWUoKSB8fCAnJztcbiAgICAgICAgICAgIHZhciBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5OdW1iZXIoKSB8fCAnJztcbiAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0aGlzLmdldEZ1bmN0aW9uTmFtZSgpIHx8ICcnO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0SXNFdmFsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdbZXZhbF0gKCcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXIgKyAnKSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAnW2V2YWxdOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZ1bmN0aW9uTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbk5hbWUgKyAnICgnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyICsgJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlcjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTdGFja0ZyYW1lLmZyb21TdHJpbmcgPSBmdW5jdGlvbiBTdGFja0ZyYW1lJCRmcm9tU3RyaW5nKHN0cikge1xuICAgICAgICB2YXIgYXJnc1N0YXJ0SW5kZXggPSBzdHIuaW5kZXhPZignKCcpO1xuICAgICAgICB2YXIgYXJnc0VuZEluZGV4ID0gc3RyLmxhc3RJbmRleE9mKCcpJyk7XG5cbiAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHN0ci5zdWJzdHJpbmcoMCwgYXJnc1N0YXJ0SW5kZXgpO1xuICAgICAgICB2YXIgYXJncyA9IHN0ci5zdWJzdHJpbmcoYXJnc1N0YXJ0SW5kZXggKyAxLCBhcmdzRW5kSW5kZXgpLnNwbGl0KCcsJyk7XG4gICAgICAgIHZhciBsb2NhdGlvblN0cmluZyA9IHN0ci5zdWJzdHJpbmcoYXJnc0VuZEluZGV4ICsgMSk7XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uU3RyaW5nLmluZGV4T2YoJ0AnKSA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gL0AoLis/KSg/OjooXFxkKykpPyg/OjooXFxkKykpPyQvLmV4ZWMobG9jYXRpb25TdHJpbmcsICcnKTtcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgdmFyIGxpbmVOdW1iZXIgPSBwYXJ0c1syXTtcbiAgICAgICAgICAgIHZhciBjb2x1bW5OdW1iZXIgPSBwYXJ0c1szXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3MgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlciB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGNvbHVtbk51bWJlciB8fCB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9vbGVhblByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydnZXQnICsgX2NhcGl0YWxpemUoYm9vbGVhblByb3BzW2ldKV0gPSBfZ2V0dGVyKGJvb2xlYW5Qcm9wc1tpXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUoYm9vbGVhblByb3BzW2ldKV0gPSAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3BdID0gQm9vbGVhbih2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKGJvb2xlYW5Qcm9wc1tpXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW1lcmljUHJvcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShudW1lcmljUHJvcHNbal0pXSA9IF9nZXR0ZXIobnVtZXJpY1Byb3BzW2pdKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShudW1lcmljUHJvcHNbal0pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIGlmICghX2lzTnVtYmVyKHYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IocCArICcgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzW3BdID0gTnVtYmVyKHYpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkobnVtZXJpY1Byb3BzW2pdKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrID0gMDsgayA8IHN0cmluZ1Byb3BzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydnZXQnICsgX2NhcGl0YWxpemUoc3RyaW5nUHJvcHNba10pXSA9IF9nZXR0ZXIoc3RyaW5nUHJvcHNba10pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKHN0cmluZ1Byb3BzW2tdKV0gPSAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3BdID0gU3RyaW5nKHYpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoc3RyaW5nUHJvcHNba10pO1xuICAgIH1cblxuICAgIHJldHVybiBTdGFja0ZyYW1lO1xufSkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9zcmMvY29uc3RhbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvZmluYWxpemUnKTsiLCJ2YXIgd2luID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IGdsb2JhbDtcbmV4cG9ydHMuTk9PUCA9IHdpbi4kVzEwTk9PUCA9IHdpbi4kVzEwTk9PUCB8fCBmdW5jdGlvbiAoKSB7fTsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzXCIpO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5mdW5jdGlvbiByZXNvbHZlKG9iamVjdCwgcGF0aCwgbGVuKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBvYmplY3Q7XG4gICAgZm9yICh2YXIgaT0wOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50W3BhdGhbaV1dO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlVHlwZShpbmZvKSB7XG4gICAgaWYgKGluZm8udHlwZSA9PT0gJ0RhdGUnKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShpbmZvLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGluZm8udHlwZSA9PT0gJ1VSTCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVUkwoaW5mby52YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLnR5cGUgPT09ICdVUkxTZWFyY2hQYXJhbXMnKSB7XG4gICAgICAgIHJldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKGluZm8udmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoaW5mby50eXBlID09PSAnTk9PUCcpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0YW50cy5OT09QO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHR5cGUnKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluYWxpemUob3V0ZXIpIHtcbiAgICBpZiAoIW91dGVyKSB7XG4gICAgICAgIHJldHVybiBvdXRlcjtcbiAgICB9XG5cbiAgICB2YXIgYXNzaWdubWVudHMgPSBvdXRlci4kJDtcbiAgICBpZiAoYXNzaWdubWVudHMpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IG91dGVyLm87XG4gICAgICAgIHZhciBsZW47XG5cbiAgICAgICAgaWYgKGFzc2lnbm1lbnRzICYmIChsZW49YXNzaWdubWVudHMubGVuZ3RoKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFzc2lnbm1lbnQgPSBhc3NpZ25tZW50c1tpXTtcblxuICAgICAgICAgICAgICAgIHZhciByaHMgPSBhc3NpZ25tZW50LnI7XG4gICAgICAgICAgICAgICAgdmFyIHJoc1ZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkocmhzKSkge1xuICAgICAgICAgICAgICAgICAgICByaHNWYWx1ZSA9IHJlc29sdmUob2JqZWN0LCByaHMsIHJocy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJoc1ZhbHVlID0gcmVzb2x2ZVR5cGUocmhzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbGhzID0gYXNzaWdubWVudC5sO1xuICAgICAgICAgICAgICAgIHZhciBsaHNMYXN0ID0gbGhzLmxlbmd0aC0xO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxoc0xhc3QgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IG91dGVyLm8gPSByaHNWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxoc1BhcmVudCA9IHJlc29sdmUob2JqZWN0LCBsaHMsIGxoc0xhc3QpO1xuICAgICAgICAgICAgICAgICAgICBsaHNQYXJlbnRbbGhzW2xoc0xhc3RdXSA9IHJoc1ZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFzc2lnbm1lbnRzLmxlbmd0aCA9IDA7IC8vIEFzc2lnbm1lbnRzIGhhdmUgYmVlbiBhcHBsaWVkLCBkbyBub3QgcmVhcHBseVxuXG4gICAgICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IG51bGwgOiBvYmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG91dGVyO1xuICAgIH1cblxufTsiLCJpbXBvcnQgdGVzdCBmcm9tIFwiLi9tYXJrby90ZXN0X2ZpbGUubWFya29cIlxyXG5jb25zdCBvdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm91dHB1dFwiKTtcclxuXHJcbmxldCBUID0ge307XHJcblxyXG5ULkV4ZWN1dGUgPSBmdW5jdGlvbigpIHtcclxuICBzd2l0Y2goU3RvcmUuc3RhdGUuYWN0aW9uKSB7XHJcbiAgICBjYXNlIEFjdGlvbi5DVVNUT01BQ1RJT046XHJcbiAgICAgIFQucmVuZGVyID0gdGVzdC5yZW5kZXJTeW5jKCkucmVwbGFjZUNoaWxkcmVuT2Yob3V0cHV0KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5TdG9yZS5CaW5kKFQuRXhlY3V0ZSk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gQ29tcGlsZWQgdXNpbmcgbWFya29ANS4zMy4xNCAtIERPIE5PVCBFRElUXG5pbXBvcnQgeyB0IGFzIF90IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanNcIjtcbmNvbnN0IF9tYXJrb19jb21wb25lbnRUeXBlID0gXCJ1aVxcXFxpbmRleC5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgJy4vdGVzdHVpLmpzJztcbmltcG9ydCBfbWFya29fcmVuZGVyZXIgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IHIgYXMgX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanNcIjtcbl9tYXJrb19yZWdpc3RlckNvbXBvbmVudChfbWFya29fY29tcG9uZW50VHlwZSwgKCkgPT4gX21hcmtvX3RlbXBsYXRlKTtcbmNvbnN0IF9tYXJrb19jb21wb25lbnQgPSB7fTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge30sIHtcbiAgdDogX21hcmtvX2NvbXBvbmVudFR5cGUsXG4gIGk6IHRydWUsXG4gIGQ6IHRydWVcbn0sIF9tYXJrb19jb21wb25lbnQpO1xuaW1wb3J0IF9tYXJrb19kZWZpbmVDb21wb25lbnQgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50LmpzXCI7XG5fbWFya29fdGVtcGxhdGUuQ29tcG9uZW50ID0gX21hcmtvX2RlZmluZUNvbXBvbmVudChfbWFya29fY29tcG9uZW50LCBfbWFya29fdGVtcGxhdGUuXyk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9