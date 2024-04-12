/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./model/test.js":
/*!***********************!*\
  !*** ./model/test.js ***!
  \***********************/
/***/ (() => {

console.log("Hello there");

/***/ }),

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
/*!***************************!*\
  !*** ./model/index.marko ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var marko_src_runtime_vdom_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marko/src/runtime/vdom/index.js */ "./node_modules/marko/src/runtime/vdom/index.js");
/* harmony import */ var _test_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./test.js */ "./model/test.js");
/* harmony import */ var _test_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_test_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! marko/src/runtime/components/renderer.js */ "./node_modules/marko/src/runtime/components/renderer.js");
/* harmony import */ var marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_renderer_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! marko/src/runtime/components/registry.js */ "./node_modules/marko/src/runtime/components/registry.js");
/* harmony import */ var marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_registry_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! marko/src/runtime/components/defineComponent.js */ "./node_modules/marko/src/runtime/components/defineComponent.js");
/* harmony import */ var marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(marko_src_runtime_components_defineComponent_js__WEBPACK_IMPORTED_MODULE_4__);
// Compiled using marko@5.33.14 - DO NOT EDIT

const _marko_componentType = "model\\index.marko",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCwrQ0FBK0MsTUFBTTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1YsK0NBQStDLFFBQVE7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFhO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLElBQWE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0Esc0RBQXNEO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLFFBQVEsSUFBYTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNycEJhO0FBQ2IsZUFBZSxLQUFhLElBQUksbUJBQU8sQ0FBQyxrREFBVTtBQUNsRCxhQUFhLG1CQUFPLENBQUMsZ0VBQW9CO0FBQ3pDLGNBQWMsd0ZBQWdDO0FBQzlDLG9CQUFvQixtQkFBTyxDQUFDLG1IQUEyQjtBQUN2RDtBQUNBO0FBQ0EsRUFBRSw4SUFBeUQ7QUFDM0Qsa0JBQWtCLG1CQUFPLENBQUMsaUZBQWU7QUFDekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7O0FBRUEsaUNBQWlDOztBQUVqQzs7QUFFQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxZQUFZLElBQWE7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSix5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGdCQUFnQjtBQUNsRDtBQUNBO0FBQ0EseUNBQXlDLGdCQUFnQjtBQUN6RDtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3hLYTtBQUNiLDhCQUE4QixtQkFBTyxDQUFDLHlHQUEyQjs7QUFFakU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsK0JBQStCOzs7Ozs7Ozs7OztBQzFEL0I7QUFDQSxFQUFFLHFLQUErRDs7QUFFakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZBLGFBQWEsbUJBQU8sQ0FBQyxnRUFBb0I7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7O0FBRXpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1FQUFtRTtBQUNuRTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3hHYTtBQUNiOztBQUVBLGNBQWMsbUJBQU8sQ0FBQyxrRUFBcUI7QUFDM0Msb0JBQW9CLG1CQUFPLENBQUMsNkVBQWE7QUFDekMsZ0JBQWdCLG1CQUFPLENBQUMscUVBQVM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7Ozs7Ozs7Ozs7O0FDUEEscUJBQXFCLG1CQUFPLENBQUMsbUhBQTJCO0FBQ3hEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaLFVBQVU7QUFDVjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0Isd0JBQXdCO0FBQ3hCLHlCQUF5QjtBQUN6QixtQ0FBbUM7QUFDbkMsZUFBZTtBQUNmO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7O0FDL0lBLGlLQUF5RDs7Ozs7Ozs7Ozs7QUNBekQsZ0JBQWdCLG1CQUFPLENBQUMsc0VBQXVCO0FBQy9DLHFCQUFxQixtQkFBTyxDQUFDLHVJQUFxQztBQUNsRSxtQkFBbUIsbUJBQU8sQ0FBQyxtSUFBbUM7QUFDOUQsZUFBZSxtQkFBTyxDQUFDLDJIQUErQjtBQUN0RCxxQkFBcUIsbUJBQU8sQ0FBQyxtSEFBMkI7QUFDeEQ7O0FBRUEsd0JBQXdCLG1CQUFPLENBQUMsNkZBQXFCO0FBQ3JEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxNQUFNLElBQWE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSyxFQUVOOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNPYTs7QUFFYjtBQUNBLHFCQUFxQjtBQUNyQix5QkFBeUI7O0FBRXpCLG1CQUFtQixzSkFBa0Q7O0FBRXJFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0EsMkJBQTJCO0FBQzNCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCO0FBQy9CLHNCQUFzQjs7Ozs7Ozs7Ozs7QUM3RnRCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7O0FDWkEsYUFBYSxtQkFBTyxDQUFDLGdFQUFvQjtBQUN6QyxxQkFBcUIsbUJBQU8sQ0FBQyxtSEFBMkI7QUFDeEQ7QUFDQTtBQUNBLGNBQWMsbUJBQU8sQ0FBQywwRkFBeUI7O0FBRS9DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7O0FDNUVhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM1Q2E7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMsU0FBUztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM3QmE7O0FBRWIsaUJBQWlCLG1CQUFPLENBQUMsZ0ZBQWdCOztBQUV6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMsU0FBUztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDNUNhOztBQUViLGFBQWEsbUJBQU8sQ0FBQyxnRUFBb0I7QUFDekMsbUJBQW1CLHNKQUFrRDtBQUNyRSx1QkFBdUIsbUJBQU8sQ0FBQyxrRUFBYTs7QUFFNUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCLGdCQUFnQixNQUFNO0FBQ3RCLGdCQUFnQixRQUFRLDJFQUEyRTtBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixrQkFBa0I7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4QixnQkFBZ0IsOEJBQThCO0FBQzlDLGdCQUFnQiw4QkFBOEI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7Ozs7OztBQ2pNQSxtQkFBbUIsbUJBQU8sQ0FBQyw4REFBYztBQUN6QyxtQkFBbUIsbUJBQU8sQ0FBQyx5RUFBaUI7QUFDNUMsa0JBQWtCLG1CQUFPLENBQUMsK0VBQWlCO0FBQzNDLGVBQWUsbUJBQU8sQ0FBQywyRUFBWTtBQUNuQyxXQUFXLG1CQUFPLENBQUMsNkRBQVE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFD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QUFDQSwwQkFBMEIsT0FBTztBQUNqQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDQUFnQzs7QUFFaEM7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTs7Ozs7O1VDckVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUMwRDtBQUMxRDtBQUNBLG9CQUFvQixrRUFBRTtBQUN0QixpRUFBZSxlQUFlLEVBQUM7QUFDWjtBQUNvRDtBQUNrQjtBQUN6RiwyRUFBd0I7QUFDeEI7QUFDQSxvQkFBb0IsK0VBQWUsb0VBQW9FO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDb0Y7QUFDckYsNEJBQTRCLHNGQUFzQixzQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ByZW5vdC1wcmovLi9tb2RlbC90ZXN0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvY29tcGxhaW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvZXJyb3Itc3RhY2stcGFyc2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvZXZlbnRzLWxpZ2h0L3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2xpc3RlbmVyLXRyYWNrZXIvbGliL2xpc3RlbmVyLXRyYWNrZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLWJlZ2luQ29tcG9uZW50L2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLWVuZENvbXBvbmVudC9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvY29tcG9uZW50cy1yZWdpc3RyeS9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL25vZGVfbW9kdWxlcy9AaW50ZXJuYWwvY29tcG9uZW50cy11dGlsL2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9yZXF1aXJlL2luZGV4LXdlYnBhY2suanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9zZXQtaW1tZWRpYXRlL2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9zZXQtaW1tZWRpYXRlL3F1ZXVlTWljcm90YXNrLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvUmVuZGVyUmVzdWx0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudERlZi5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50c0NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0dsb2JhbENvbXBvbmVudHNDb250ZXh0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9LZXlTZXF1ZW5jZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvU3RhdGUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2RlZmluZUNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZG9tLWRhdGEuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL2V2ZW50LWRlbGVnYXRpb24uanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL3JlZ2lzdHJ5LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvdXBkYXRlLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jcmVhdGVPdXQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9kb20taW5zZXJ0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvaGVscGVycy9fY2hhbmdlLWNhc2UuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL2NsYXNzLXZhbHVlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvaGVscGVycy9zdHlsZS12YWx1ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3JlbmRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL0FzeW5jVkRPTUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZEb2N1bWVudEZyYWdtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVkZyYWdtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WTm9kZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVlRleHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL2hlbHBlcnMvYXR0cnMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9mcmFnbWVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vbW9ycGhkb20vaGVscGVycy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vbW9ycGhkb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL3BhcnNlLWh0bWwuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL3Zkb20uanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9yYXB0b3ItdXRpbC9jb3B5UHJvcHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9yYXB0b3ItdXRpbC9leHRlbmQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9yYXB0b3ItdXRpbC9pbmhlcml0LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvc3RhY2tmcmFtZS9zdGFja2ZyYW1lLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3dhcnAxMC9maW5hbGl6ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3dhcnAxMC9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL3NyYy9maW5hbGl6ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL21vZGVsL2luZGV4Lm1hcmtvIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKFwiSGVsbG8gdGhlcmVcIik7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU3RhY2tQYXJzZXIgPSByZXF1aXJlKCdlcnJvci1zdGFjay1wYXJzZXInKTtcbnZhciBlbnYgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlY7XG52YXIgaXNEZXZlbG9wbWVudCA9ICFlbnYgfHwgZW52ID09PSAnZGV2JyB8fCBlbnYgPT09ICdkZXZlbG9wbWVudCc7XG52YXIgc2hvd01vZHVsZUNvbXBsYWlucyA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKHByb2Nlc3MuZW52LlNIT1dfTU9EVUxFX0NPTVBMQUlOUyk7XG52YXIgc2hvd05lc3RlZENvbXBsYWlucyA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKHByb2Nlc3MuZW52LlNIT1dfTkVTVEVEX0NPTVBMQUlOUyk7XG52YXIgbG9nZ2VyID0gdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2FybiAmJiBjb25zb2xlO1xudmFyIGN3ZCA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmN3ZCgpICsgJy8nIHx8ICcnO1xudmFyIGxpbmVicmVhayA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAnd2luMzInID09PSBwcm9jZXNzLnBsYXRmb3JtID8gJ1xcclxcbicgOiAnXFxuJztcbnZhciBuZXdsaW5lID0gLyhcXHJcXG58XFxyfFxcbikvZztcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xudmFyIGlnbm9yZWRMb2NhdGlvbiA9IFwiW2lnbm9yZV1cIjtcbnZhciBoaXRzID0ge307XG5cbmNvbXBsYWluID0gaXNEZXZlbG9wbWVudCA/IGNvbXBsYWluIDogbm9vcDtcbmNvbXBsYWluLm1ldGhvZCA9IGlzRGV2ZWxvcG1lbnQgPyBtZXRob2QgOiBub29wO1xuY29tcGxhaW4uZm4gPSBpc0RldmVsb3BtZW50ID8gZm4gOiBub29wUmV0dXJuO1xuY29tcGxhaW4ubG9nID0gbG9nO1xuY29tcGxhaW4uc3RyZWFtID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3Muc3RkZXJyO1xuY29tcGxhaW4uc2lsZW5jZSA9IGZhbHNlO1xuY29tcGxhaW4uY29sb3IgPSBjb21wbGFpbi5zdHJlYW0gJiYgY29tcGxhaW4uc3RyZWFtLmlzVFRZO1xuY29tcGxhaW4uY29sb3JzID0geyB3YXJuaW5nOidcXHgxYlszMTsxbScsIG5vdGljZTonXFx4MWJbMzM7MW0nLCBtZXNzYWdlOmZhbHNlLCBsb2NhdGlvbjonXFx1MDAxYls5MG0nIH07XG5jb21wbGFpbi5nZXRNb2R1bGVOYW1lID0gZ2V0TW9kdWxlTmFtZTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbXBsYWluO1xufSBlbHNlIGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5jb21wbGFpbiA9IGNvbXBsYWluO1xufVxuXG5mdW5jdGlvbiBjb21wbGFpbigpIHtcbiAgdmFyIG9wdGlvbnM7XG4gIHZhciBsb2NhdGlvbjtcbiAgdmFyIGxvY2F0aW9uSW5kZXg7XG4gIHZhciBoZWFkaW5nQ29sb3I7XG4gIHZhciBoZWFkaW5nO1xuICB2YXIgbGV2ZWw7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gIGlmKGNvbXBsYWluLnNpbGVuY2UpIHJldHVybjtcblxuICBpZih0eXBlb2YgYXJnc1thcmdzLmxlbmd0aC0xXSA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0gYXJnc1thcmdzLmxlbmd0aC0xXTtcbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmdzLCAwLCAtMSk7XG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgbGV2ZWwgPSBvcHRpb25zLmxldmVsIHx8IDI7XG4gIGhlYWRpbmcgPSBvcHRpb25zLmhlYWRpbmcgfHwgKGxldmVsID09IDIgPyBcIldBUk5JTkchIVwiIDogXCJOT1RJQ0VcIik7XG4gIGhlYWRpbmdDb2xvciA9IG9wdGlvbnMuaGVhZGluZ0NvbG9yIHx8IChsZXZlbCA9PSAyID8gY29tcGxhaW4uY29sb3JzLndhcm5pbmcgOiBjb21wbGFpbi5jb2xvcnMubm90aWNlKTtcblxuICAvLyBEZWZhdWx0IHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgY2FsbCB0byB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvblxuICBsb2NhdGlvbkluZGV4ID0gb3B0aW9ucy5sb2NhdGlvbkluZGV4ID09IG51bGwgPyAxIDogb3B0aW9ucy5sb2NhdGlvbkluZGV4O1xuXG4gIC8vIFdoZW4gdGhlIHVzZXIgc2V0cyBsb2NhdGlvbiB0byBmYWxzZSxcbiAgLy8gV2Ugd2lsbCB1c2UgdGhlIGxvY2F0aW9uIG9mIHRoZSBjYWxsIHRvIGNvbXBsYWluKClcbiAgLy8gVG8gbGltaXQgdGhlIGxvZyB0byBvbmx5IG9jY3VycmluZyBvbmNlXG4gIGlmKG9wdGlvbnMubG9jYXRpb24gPT09IGZhbHNlKSB7XG4gICAgbG9jYXRpb25JbmRleCA9IDA7XG4gIH1cblxuICBsb2NhdGlvbiA9IG9wdGlvbnMubG9jYXRpb24gfHwgZ2V0TG9jYXRpb24obG9jYXRpb25JbmRleCk7XG4gIFxuICB2YXIgbW9kdWxlTmFtZSA9IGNvbXBsYWluLmdldE1vZHVsZU5hbWUobG9jYXRpb24pO1xuXG4gIGlmIChtb2R1bGVOYW1lICYmICFzaG93TW9kdWxlQ29tcGxhaW5zKSB7XG4gICAgaWYgKCFoaXRzW21vZHVsZU5hbWVdKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0KFwiTk9USUNFXCIsIGNvbXBsYWluLmNvbG9ycy5ub3RpY2UpO1xuICAgICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdCgnVGhlIG1vZHVsZSBbJyttb2R1bGVOYW1lKyddIGlzIHVzaW5nIGRlcHJlY2F0ZWQgZmVhdHVyZXMuJywgY29tcGxhaW4uY29sb3JzLm1lc3NhZ2UpO1xuICAgICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdCgnUnVuIHdpdGggcHJvY2Vzcy5lbnYuU0hPV19NT0RVTEVfQ09NUExBSU5TPTEgdG8gc2VlIGFsbCB3YXJuaW5ncy4nLCBjb21wbGFpbi5jb2xvcnMubWVzc2FnZSk7XG4gICAgICBjb21wbGFpbi5sb2cobGluZWJyZWFrICsgb3V0cHV0ICsgbGluZWJyZWFrKTtcbiAgICAgIGhpdHNbbW9kdWxlTmFtZV0gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAvLyBMb2NhdGlvbiBpcyBvbmx5IG1pc3NpbmcgaW4gb2xkZXIgYnJvd3NlcnMuXG4gIGlmKGxvY2F0aW9uKSB7XG4gICAgaWYoaGl0c1tsb2NhdGlvbl0gfHwgbG9jYXRpb24gPT09IGlnbm9yZWRMb2NhdGlvbikgcmV0dXJuO1xuICAgIGVsc2UgaGl0c1tsb2NhdGlvbl0gPSB0cnVlO1xuICB9XG5cbiAgdmFyIG91dHB1dCA9IGZvcm1hdChoZWFkaW5nLCBoZWFkaW5nQ29sb3IpO1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdChhcmdzW2ldLCBjb21wbGFpbi5jb2xvcnMubWVzc2FnZSk7XG4gIH1cblxuICBpZihvcHRpb25zLmxvY2F0aW9uICE9PSBmYWxzZSAmJiBsb2NhdGlvbikge1xuICAgIG91dHB1dCArPSBsaW5lYnJlYWsgKyBmb3JtYXQoJyAgYXQgJytsb2NhdGlvbi5yZXBsYWNlKGN3ZCwgJycpLCBjb21wbGFpbi5jb2xvcnMubG9jYXRpb24pO1xuICB9XG5cbiAgY29tcGxhaW4ubG9nKGxpbmVicmVhayArIG91dHB1dCArIGxpbmVicmVhayk7XG59O1xuXG5mdW5jdGlvbiBtZXRob2Qob2JqZWN0LCBtZXRob2ROYW1lKSB7XG4gICAgdmFyIG9yaWdpbmFsTWV0aG9kID0gb2JqZWN0W21ldGhvZE5hbWVdO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuXG4gICAgb2JqZWN0W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbXBsYWluLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gb3JpZ2luYWxNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBmbihvcmlnaW5hbCkge1xuICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29tcGxhaW4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgcmV0dXJuIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9nKG1lc3NhZ2UsIGNvbG9yKSB7XG4gIHZhciBmb3JtYXR0ZWQgPSBmb3JtYXQobWVzc2FnZSwgY29sb3IpO1xuICBpZihjb21wbGFpbi5zdHJlYW0pIHtcbiAgICBjb21wbGFpbi5zdHJlYW0ud3JpdGUoZm9ybWF0dGVkK2xpbmVicmVhayk7XG4gIH0gZWxzZSBpZihsb2dnZXIpIHtcbiAgICBsb2dnZXIud2Fybihmb3JtYXR0ZWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdChtZXNzYWdlLCBjb2xvcikge1xuICByZXR1cm4gY29sb3IgJiYgY29tcGxhaW4uY29sb3IgPyBjb2xvciArIG1lc3NhZ2UgKyAnXFx4MWJbMG0nIDogbWVzc2FnZTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9jYXRpb24obG9jYXRpb25JbmRleCkge1xuICB2YXIgbG9jYXRpb24gPSAnJztcbiAgdmFyIHRhcmdldEluZGV4ID0gbG9jYXRpb25JbmRleCArIDI7XG5cbiAgLyoqXG4gICAqIFN0YWNrIGluZGV4IGRlc2NyaXB0aW9ucy5cbiAgICogXG4gICAqIDA6IEluIGdldExvY2F0aW9uKCksIHRoZSBjYWxsIHRvIG5ldyBFcnJvcigpXG4gICAqIDE6IEluIGNvbXBsYWluKCksIHRoZSBjYWxsIHRvIGdldExvY2F0aW9uKClcbiAgICogMjogSW4gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb24sIHRoZSBjYWxsIHRvIGNvbXBsYWluKClcbiAgICogMzogVGhlIGNhbGwgdG8gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb24gKFRISVMgSVMgVEhFIERFRkFVTFQpXG4gICAqL1xuXG4gIHRyeSB7XG4gICAgdmFyIGxvY2F0aW9ucyA9IFN0YWNrUGFyc2VyLnBhcnNlKG5ldyBFcnJvcigpKS5tYXAoZnVuY3Rpb24oZnJhbWUpIHtcbiAgICAgIHJldHVybiBmcmFtZS5maWxlTmFtZSsnOicrZnJhbWUubGluZU51bWJlcisnOicrZnJhbWUuY29sdW1uTnVtYmVyO1xuICAgIH0pO1xuICAgIGlmICghc2hvd05lc3RlZENvbXBsYWlucykge1xuICAgICAgZm9yICh2YXIgaSA9IGxvY2F0aW9ucy5sZW5ndGgtMTsgaSA+IHRhcmdldEluZGV4OyBpLS0pIHtcbiAgICAgICAgaWYgKGhpdHNbbG9jYXRpb25zW2ldXSkge1xuICAgICAgICAgIHJldHVybiBpZ25vcmVkTG9jYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9jYXRpb24gPSBsb2NhdGlvbnNbdGFyZ2V0SW5kZXhdO1xuICB9IGNhdGNoKGUpIHt9XG5cbiAgcmV0dXJuIGxvY2F0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRNb2R1bGVOYW1lKGxvY2F0aW9uKSB7XG4gIHZhciBsb2NhdGlvblBhcnRzID0gbG9jYXRpb24ucmVwbGFjZShjd2QsICcnKS5zcGxpdCgvXFwvfFxcXFwvZyk7XG4gIGZvcih2YXIgaSA9IGxvY2F0aW9uUGFydHMubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGxvY2F0aW9uUGFydHNbaV0gPT09ICdub2RlX21vZHVsZXMnKSB7XG4gICAgICB2YXIgbW9kdWxlTmFtZSA9IGxvY2F0aW9uUGFydHNbaSsxXTtcbiAgICAgIHJldHVybiAobW9kdWxlTmFtZVswXSA9PT0gJ0AnKSA/IG1vZHVsZU5hbWUrJy8nK2xvY2F0aW9uUGFydHNbaSsyXSA6IG1vZHVsZU5hbWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuZnVuY3Rpb24gbm9vcFJldHVybihyKSB7IHJldHVybiByOyB9O1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnZXJyb3Itc3RhY2stcGFyc2VyJywgWydzdGFja2ZyYW1lJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdzdGFja2ZyYW1lJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuRXJyb3JTdGFja1BhcnNlciA9IGZhY3Rvcnkocm9vdC5TdGFja0ZyYW1lKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIoU3RhY2tGcmFtZSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFAgPSAvKF58QClcXFMrOlxcZCsvO1xuICAgIHZhciBDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQID0gL15cXHMqYXQgLiooXFxTKzpcXGQrfFxcKG5hdGl2ZVxcKSkvbTtcbiAgICB2YXIgU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCA9IC9eKGV2YWxAKT8oXFxbbmF0aXZlIGNvZGVdKT8kLztcblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiBhbiBFcnJvciBvYmplY3QsIGV4dHJhY3QgdGhlIG1vc3QgaW5mb3JtYXRpb24gZnJvbSBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3Igb2JqZWN0XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBvZiBTdGFja0ZyYW1lc1xuICAgICAgICAgKi9cbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrdHJhY2UgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBlcnJvclsnb3BlcmEjc291cmNlbG9jJ10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrICYmIGVycm9yLnN0YWNrLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VWOE9ySUUoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRkZPclNhZmFyaShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIGdpdmVuIEVycm9yIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFNlcGFyYXRlIGxpbmUgYW5kIGNvbHVtbiBudW1iZXJzIGZyb20gYSBzdHJpbmcgb2YgdGhlIGZvcm06IChVUkk6TGluZTpDb2x1bW4pXG4gICAgICAgIGV4dHJhY3RMb2NhdGlvbjogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkZXh0cmFjdExvY2F0aW9uKHVybExpa2UpIHtcbiAgICAgICAgICAgIC8vIEZhaWwtZmFzdCBidXQgcmV0dXJuIGxvY2F0aW9ucyBsaWtlIFwiKG5hdGl2ZSlcIlxuICAgICAgICAgICAgaWYgKHVybExpa2UuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdXJsTGlrZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZWdFeHAgPSAvKC4rPykoPzo6KFxcZCspKT8oPzo6KFxcZCspKT8kLztcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlZ0V4cC5leGVjKHVybExpa2UucmVwbGFjZSgvWygpXS9nLCAnJykpO1xuICAgICAgICAgICAgcmV0dXJuIFtwYXJ0c1sxXSwgcGFydHNbMl0gfHwgdW5kZWZpbmVkLCBwYXJ0c1szXSB8fCB1bmRlZmluZWRdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlVjhPcklFOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZVY4T3JJRShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCcoZXZhbCAnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZXZhbCBpbmZvcm1hdGlvbiB1bnRpbCB3ZSBpbXBsZW1lbnQgc3RhY2t0cmFjZS5qcy9zdGFja2ZyYW1lIzhcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvZXZhbCBjb2RlL2csICdldmFsJykucmVwbGFjZSgvKFxcKGV2YWwgYXQgW14oKV0qKXwoLC4qJCkvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2FuaXRpemVkTGluZSA9IGxpbmUucmVwbGFjZSgvXlxccysvLCAnJykucmVwbGFjZSgvXFwoZXZhbCBjb2RlL2csICcoJykucmVwbGFjZSgvXi4qP1xccysvLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYXB0dXJlIGFuZCBwcmVzZXZlIHRoZSBwYXJlbnRoZXNpemVkIGxvY2F0aW9uIFwiKC9mb28vbXkgYmFyLmpzOjEyOjg3KVwiIGluXG4gICAgICAgICAgICAgICAgLy8gY2FzZSBpdCBoYXMgc3BhY2VzIGluIGl0LCBhcyB0aGUgc3RyaW5nIGlzIHNwbGl0IG9uIFxccysgbGF0ZXIgb25cbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBzYW5pdGl6ZWRMaW5lLm1hdGNoKC8gKFxcKC4rXFwpJCkvKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgcGFyZW50aGVzaXplZCBsb2NhdGlvbiBmcm9tIHRoZSBsaW5lLCBpZiBpdCB3YXMgbWF0Y2hlZFxuICAgICAgICAgICAgICAgIHNhbml0aXplZExpbmUgPSBsb2NhdGlvbiA/IHNhbml0aXplZExpbmUucmVwbGFjZShsb2NhdGlvblswXSwgJycpIDogc2FuaXRpemVkTGluZTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGEgbG9jYXRpb24gd2FzIG1hdGNoZWQsIHBhc3MgaXQgdG8gZXh0cmFjdExvY2F0aW9uKCkgb3RoZXJ3aXNlIHBhc3MgYWxsIHNhbml0aXplZExpbmVcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHRoaXMgbGluZSBkb2Vzbid0IGhhdmUgZnVuY3Rpb24gbmFtZVxuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24obG9jYXRpb24gPyBsb2NhdGlvblsxXSA6IHNhbml0aXplZExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBsb2NhdGlvbiAmJiBzYW5pdGl6ZWRMaW5lIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBbJ2V2YWwnLCAnPGFub255bW91cz4nXS5pbmRleE9mKGxvY2F0aW9uUGFydHNbMF0pID4gLTEgPyB1bmRlZmluZWQgOiBsb2NhdGlvblBhcnRzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlRkZPclNhZmFyaTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VGRk9yU2FmYXJpKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWxpbmUubWF0Y2goU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyA+IGV2YWwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoLyBsaW5lIChcXGQrKSg/OiA+IGV2YWwgbGluZSBcXGQrKSogPiBldmFsOlxcZCs6XFxkKy9nLCAnOiQxJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignQCcpID09PSAtMSAmJiBsaW5lLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIGV2YWwgZnJhbWVzIG9ubHkgaGF2ZSBmdW5jdGlvbiBuYW1lcyBhbmQgbm90aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZVJlZ2V4ID0gLygoLipcIi4rXCJbXkBdKik/W15AXSopKD86QCkvO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGxpbmUubWF0Y2goZnVuY3Rpb25OYW1lUmVnZXgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gbWF0Y2hlcyAmJiBtYXRjaGVzWzFdID8gbWF0Y2hlc1sxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbihsaW5lLnJlcGxhY2UoZnVuY3Rpb25OYW1lUmVnZXgsICcnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGxvY2F0aW9uUGFydHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmEoZSkge1xuICAgICAgICAgICAgaWYgKCFlLnN0YWNrdHJhY2UgfHwgKGUubWVzc2FnZS5pbmRleE9mKCdcXG4nKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgZS5tZXNzYWdlLnNwbGl0KCdcXG4nKS5sZW5ndGggPiBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhOShlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWUuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhMTAoZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhOTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTkoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMiwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lc1tpXVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmExMDogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTEwKGUpIHtcbiAgICAgICAgICAgIHZhciBsaW5lUkUgPSAvTGluZSAoXFxkKykuKnNjcmlwdCAoPzppbiApPyhcXFMrKSg/OjogSW4gZnVuY3Rpb24gKFxcUyspKT8kL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbWF0Y2hbM10gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBPcGVyYSAxMC42NSsgRXJyb3Iuc3RhY2sgdmVyeSBzaW1pbGFyIHRvIEZGL1NhZmFyaVxuICAgICAgICBwYXJzZU9wZXJhMTE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmExMShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFApICYmICFsaW5lLm1hdGNoKC9eRXJyb3IgY3JlYXRlZCBhdC8pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZC5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbnMgPSBsaW5lLnNwbGl0KCdAJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbih0b2tlbnMucG9wKCkpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkNhbGwgPSAodG9rZW5zLnNoaWZ0KCkgfHwgJycpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbkNhbGxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzxhbm9ueW1vdXMgZnVuY3Rpb24oOiAoXFx3KykpPz4vLCAnJDInKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgJycpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgYXJnc1JhdztcbiAgICAgICAgICAgICAgICBpZiAoZnVuY3Rpb25DYWxsLm1hdGNoKC9cXCgoW14pXSopXFwpLykpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1JhdyA9IGZ1bmN0aW9uQ2FsbC5yZXBsYWNlKC9eW14oXStcXCgoW14pXSopXFwpJC8sICckMScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IChhcmdzUmF3ID09PSB1bmRlZmluZWQgfHwgYXJnc1JhdyA9PT0gJ1thcmd1bWVudHMgbm90IGF2YWlsYWJsZV0nKSA/XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCA6IGFyZ3NSYXcuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbn0pKTtcbiIsIi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIGxpc3RlbmVyJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VMaXN0ZW5lcihlZSwgbGlzdGVuZXIsIGFyZ3MpIHtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChlZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChlZSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChlZSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIHNsb3dlclxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkoZWUsIHNsaWNlLmNhbGwoYXJncywgMSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXIoZXZlbnRFbWl0dGVyLCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgdmFyIGV2ZW50cyA9IGV2ZW50RW1pdHRlci4kZSB8fCAoZXZlbnRFbWl0dGVyLiRlID0ge30pO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcbiAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICAgICAgICAgIGV2ZW50c1t0eXBlXSA9IHByZXBlbmQgPyBbbGlzdGVuZXIsIGxpc3RlbmVyc10gOiBbbGlzdGVuZXJzLCBsaXN0ZW5lcl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocHJlcGVuZCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICB9XG4gICAgcmV0dXJuIGV2ZW50RW1pdHRlcjtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIHRoaXMuJGUgPSB0aGlzLiRlIHx8IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlID0ge1xuICAgICRlOiBudWxsLFxuXG4gICAgZW1pdDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy4kZTtcbiAgICAgICAgaWYgKCFldmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBldmVudHMgJiYgZXZlbnRzW3R5cGVdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBhcmdzWzFdO1xuICAgICAgICAgICAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0gZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdFcnJvcjogJyArIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgICAgICAgICAgaW52b2tlTGlzdGVuZXIodGhpcywgbGlzdGVuZXJzLCBhcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IHNsaWNlLmNhbGwobGlzdGVuZXJzKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49bGlzdGVuZXJzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpbnZva2VMaXN0ZW5lcih0aGlzLCBsaXN0ZW5lciwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBhZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBwcmVwZW5kTGlzdGVuZXI6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBhZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIG9uY2U6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGcoKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub24odHlwZSwgZyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG4gICAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLiRlO1xuICAgICAgICB2YXIgbGlzdGVuZXJzO1xuXG4gICAgICAgIGlmIChldmVudHMgJiYgKGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXSkpIHtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT1saXN0ZW5lcnMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuJGU7XG4gICAgICAgIGlmIChldmVudHMpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbGlzdGVuZXJDb3VudDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy4kZTtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IGV2ZW50cyAmJiBldmVudHNbdHlwZV07XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcnMgPyAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpID8gMSA6IGxpc3RlbmVycy5sZW5ndGgpIDogMDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjsiLCJ2YXIgSU5ERVhfRVZFTlQgPSAwO1xudmFyIElOREVYX1VTRVJfTElTVEVORVIgPSAxO1xudmFyIElOREVYX1dSQVBQRURfTElTVEVORVIgPSAyO1xudmFyIERFU1RST1kgPSBcImRlc3Ryb3lcIjtcblxuZnVuY3Rpb24gaXNOb25FdmVudEVtaXR0ZXIodGFyZ2V0KSB7XG4gIHJldHVybiAhdGFyZ2V0Lm9uY2U7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcldyYXBwZXIodGFyZ2V0KSB7XG4gICAgdGhpcy4kX190YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy4kX19saXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLiRfX3N1YnNjcmliZVRvID0gbnVsbDtcbn1cblxuRXZlbnRFbWl0dGVyV3JhcHBlci5wcm90b3R5cGUgPSB7XG4gICAgJF9fcmVtb3ZlOiBmdW5jdGlvbih0ZXN0LCB0ZXN0V3JhcHBlZCkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kX190YXJnZXQ7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLiRfX2xpc3RlbmVycztcblxuICAgICAgICB0aGlzLiRfX2xpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIoZnVuY3Rpb24oY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBjdXJFdmVudCA9IGN1ckxpc3RlbmVyW0lOREVYX0VWRU5UXTtcbiAgICAgICAgICAgIHZhciBjdXJMaXN0ZW5lckZ1bmMgPSBjdXJMaXN0ZW5lcltJTkRFWF9VU0VSX0xJU1RFTkVSXTtcbiAgICAgICAgICAgIHZhciBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jID0gY3VyTGlzdGVuZXJbSU5ERVhfV1JBUFBFRF9MSVNURU5FUl07XG5cbiAgICAgICAgICAgIGlmICh0ZXN0V3JhcHBlZCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyIHVzZWQgYG9uY2VgIHRvIGF0dGFjaCBhbiBldmVudCBsaXN0ZW5lciB0aGVuIHdlIGhhZCB0b1xuICAgICAgICAgICAgICAgIC8vIHdyYXAgdGhlaXIgbGlzdGVuZXIgZnVuY3Rpb24gd2l0aCBhIG5ldyBmdW5jdGlvbiB0aGF0IGRvZXMgc29tZSBleHRyYVxuICAgICAgICAgICAgICAgIC8vIGNsZWFudXAgdG8gYXZvaWQgYSBtZW1vcnkgbGVhay4gSWYgdGhlIGB0ZXN0V3JhcHBlZGAgZmxhZyBpcyBzZXQgdG8gdHJ1ZVxuICAgICAgICAgICAgICAgIC8vIHRoZW4gd2UgYXJlIGF0dGVtcHRpbmcgdG8gcmVtb3ZlIGJhc2VkIG9uIGEgZnVuY3Rpb24gdGhhdCB3ZSBoYWQgdG9cbiAgICAgICAgICAgICAgICAvLyB3cmFwIChub3QgdGhlIHVzZXIgbGlzdGVuZXIgZnVuY3Rpb24pXG4gICAgICAgICAgICAgICAgaWYgKGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMgJiYgdGVzdChjdXJFdmVudCwgY3VyV3JhcHBlZExpc3RlbmVyRnVuYykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKGN1ckV2ZW50LCBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXN0KGN1ckV2ZW50LCBjdXJMaXN0ZW5lckZ1bmMpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHdhcyB3cmFwcGVkIGR1ZSB0byBpdCBiZWluZyBhIGBvbmNlYCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIC8vIHRoZW4gd2Ugc2hvdWxkIHJlbW92ZSBmcm9tIHRoZSB0YXJnZXQgRXZlbnRFbWl0dGVyIHVzaW5nIHdyYXBwZWRcbiAgICAgICAgICAgICAgICAvLyBsaXN0ZW5lciBmdW5jdGlvbi4gT3RoZXJ3aXNlLCB3ZSByZW1vdmUgdGhlIGxpc3RlbmVyIHVzaW5nIHRoZSB1c2VyLXByb3ZpZGVkXG4gICAgICAgICAgICAgICAgLy8gbGlzdGVuZXIgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKGN1ckV2ZW50LCBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jIHx8IGN1ckxpc3RlbmVyRnVuYyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBGaXhlcyBodHRwczovL2dpdGh1Yi5jb20vcmFwdG9yanMvbGlzdGVuZXItdHJhY2tlci9pc3N1ZXMvMlxuICAgICAgICAvLyBJZiBhbGwgb2YgdGhlIGxpc3RlbmVycyBzdG9yZWQgd2l0aCBhIHdyYXBwZWQgRXZlbnRFbWl0dGVyXG4gICAgICAgIC8vIGhhdmUgYmVlbiByZW1vdmVkIHRoZW4gd2Ugc2hvdWxkIHVucmVnaXN0ZXIgdGhlIHdyYXBwZWRcbiAgICAgICAgLy8gRXZlbnRFbWl0dGVyIGluIHRoZSBwYXJlbnQgU3Vic2NyaXB0aW9uVHJhY2tlclxuICAgICAgICB2YXIgc3Vic2NyaWJlVG8gPSB0aGlzLiRfX3N1YnNjcmliZVRvO1xuXG4gICAgICAgIGlmICghdGhpcy4kX19saXN0ZW5lcnMubGVuZ3RoICYmIHN1YnNjcmliZVRvKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaWJlVG9MaXN0ID0gc3Vic2NyaWJlVG8uJF9fc3Vic2NyaWJlVG9MaXN0O1xuICAgICAgICAgICAgc3Vic2NyaWJlVG8uJF9fc3Vic2NyaWJlVG9MaXN0ID0gc3Vic2NyaWJlVG9MaXN0LmZpbHRlcihmdW5jdGlvbihjdXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VyICE9PSBzZWxmO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLiRfX3RhcmdldC5vbihldmVudCwgbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLiRfX2xpc3RlbmVycy5wdXNoKFtldmVudCwgbGlzdGVuZXJdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG9uY2U6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gSGFuZGxpbmcgYSBgb25jZWAgZXZlbnQgbGlzdGVuZXIgaXMgYSBsaXR0bGUgdHJpY2t5IHNpbmNlIHdlIG5lZWQgdG8gYWxzb1xuICAgICAgICAvLyBkbyBvdXIgb3duIGNsZWFudXAgaWYgdGhlIGBvbmNlYCBldmVudCBpcyBlbWl0dGVkLiBUaGVyZWZvcmUsIHdlIG5lZWRcbiAgICAgICAgLy8gdG8gd3JhcCB0aGUgdXNlcidzIGxpc3RlbmVyIGZ1bmN0aW9uIHdpdGggb3VyIG93biBsaXN0ZW5lciBmdW5jdGlvbi5cbiAgICAgICAgdmFyIHdyYXBwZWRMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi4kX19yZW1vdmUoZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyRnVuYykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVkTGlzdGVuZXIgPT09IGxpc3RlbmVyRnVuYztcbiAgICAgICAgICAgIH0sIHRydWUgLyogV2UgYXJlIHJlbW92aW5nIHRoZSB3cmFwcGVkIGxpc3RlbmVyICovKTtcblxuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiRfX3RhcmdldC5vbmNlKGV2ZW50LCB3cmFwcGVkTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLiRfX2xpc3RlbmVycy5wdXNoKFtldmVudCwgbGlzdGVuZXIsIHdyYXBwZWRMaXN0ZW5lcl0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGV2ZW50O1xuICAgICAgICAgICAgZXZlbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3RlbmVyICYmIGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRfX3JlbW92ZShmdW5jdGlvbihjdXJFdmVudCwgY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQgPT09IGN1ckV2ZW50ICYmIGxpc3RlbmVyID09PSBjdXJMaXN0ZW5lcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLiRfX3JlbW92ZShmdW5jdGlvbihjdXJFdmVudCwgY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdGVuZXIgPT09IGN1ckxpc3RlbmVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuJF9fbGlzdGVuZXJzO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kX190YXJnZXQ7XG5cbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRfX3JlbW92ZShmdW5jdGlvbihjdXJFdmVudCwgY3VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQgPT09IGN1ckV2ZW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIoY3VyW0lOREVYX0VWRU5UXSwgY3VyW0lOREVYX1VTRVJfTElTVEVORVJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXJBZGFwdGVyKHRhcmdldCkge1xuICAgIHRoaXMuJF9fdGFyZ2V0ID0gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXJBZGFwdGVyLnByb3RvdHlwZSA9IHtcbiAgICBvbjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG9uY2U6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gbmVlZCB0byBzYXZlIHRoaXMgc28gd2UgY2FuIHJlbW92ZSBpdCBiZWxvd1xuICAgICAgICB2YXIgb25jZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi4kX190YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgb25jZUxpc3RlbmVyKTtcbiAgICAgICAgICBsaXN0ZW5lcigpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRfX3RhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBvbmNlTGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLiRfX3RhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIFN1YnNjcmlwdGlvblRyYWNrZXIoKSB7XG4gICAgdGhpcy4kX19zdWJzY3JpYmVUb0xpc3QgPSBbXTtcbn1cblxuU3Vic2NyaXB0aW9uVHJhY2tlci5wcm90b3R5cGUgPSB7XG5cbiAgICBzdWJzY3JpYmVUbzogZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBhZGREZXN0cm95TGlzdGVuZXIgPSAhb3B0aW9ucyB8fCBvcHRpb25zLmFkZERlc3Ryb3lMaXN0ZW5lciAhPT0gZmFsc2U7XG4gICAgICAgIHZhciB3cmFwcGVyO1xuICAgICAgICB2YXIgbm9uRUU7XG4gICAgICAgIHZhciBzdWJzY3JpYmVUb0xpc3QgPSB0aGlzLiRfX3N1YnNjcmliZVRvTGlzdDtcblxuICAgICAgICBmb3IgKHZhciBpPTAsIGxlbj1zdWJzY3JpYmVUb0xpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VyID0gc3Vic2NyaWJlVG9MaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGN1ci4kX190YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHdyYXBwZXIgPSBjdXI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXdyYXBwZXIpIHtcbiAgICAgICAgICAgIGlmIChpc05vbkV2ZW50RW1pdHRlcih0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIG5vbkVFID0gbmV3IEV2ZW50RW1pdHRlckFkYXB0ZXIodGFyZ2V0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlciA9IG5ldyBFdmVudEVtaXR0ZXJXcmFwcGVyKG5vbkVFIHx8IHRhcmdldCk7XG4gICAgICAgICAgICBpZiAoYWRkRGVzdHJveUxpc3RlbmVyICYmICFub25FRSkge1xuICAgICAgICAgICAgICAgIHdyYXBwZXIub25jZShERVNUUk9ZLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3Vic2NyaWJlVG9MaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlVG9MaXN0W2ldLiRfX3RhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgcGFyZW50IFN1YnNjcmlwdGlvblRyYWNrZXIgc28gdGhhdCB3ZSBjYW4gZG8gY2xlYW51cFxuICAgICAgICAgICAgLy8gaWYgdGhlIEV2ZW50RW1pdHRlcldyYXBwZXIgaW5zdGFuY2UgYmVjb21lcyBlbXB0eSAoaS5lLiwgbm8gYWN0aXZlIGxpc3RlbmVycylcbiAgICAgICAgICAgIHdyYXBwZXIuJF9fc3Vic2NyaWJlVG8gPSB0aGlzO1xuICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0LnB1c2god3JhcHBlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50KSB7XG4gICAgICAgIHZhciBzdWJzY3JpYmVUb0xpc3QgPSB0aGlzLiRfX3N1YnNjcmliZVRvTGlzdDtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgZm9yIChpID0gc3Vic2NyaWJlVG9MaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ciA9IHN1YnNjcmliZVRvTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyLiRfX3RhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ci5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY3VyLiRfX2xpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvIHNvbWUgY2xlYW51cCBpZiB3ZSByZW1vdmVkIGFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGlzdGVuZXJzIGZvciB0aGUgdGFyZ2V0IGV2ZW50IGVtaXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3RbaV0ucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmlwdGlvblRyYWNrZXI7XG5cbmV4cG9ydHMud3JhcCA9IGZ1bmN0aW9uKHRhcmdldEV2ZW50RW1pdHRlcikge1xuICAgIHZhciBub25FRTtcbiAgICB2YXIgd3JhcHBlcjtcblxuICAgIGlmIChpc05vbkV2ZW50RW1pdHRlcih0YXJnZXRFdmVudEVtaXR0ZXIpKSB7XG4gICAgICBub25FRSA9IG5ldyBFdmVudEVtaXR0ZXJBZGFwdGVyKHRhcmdldEV2ZW50RW1pdHRlcik7XG4gICAgfVxuXG4gICAgd3JhcHBlciA9IG5ldyBFdmVudEVtaXR0ZXJXcmFwcGVyKG5vbkVFIHx8IHRhcmdldEV2ZW50RW1pdHRlcik7XG4gICAgaWYgKCFub25FRSkge1xuICAgICAgLy8gd2UgZG9uJ3Qgc2V0IHRoaXMgZm9yIG5vbiBFRSB0eXBlc1xuICAgICAgdGFyZ2V0RXZlbnRFbWl0dGVyLm9uY2UoREVTVFJPWSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd3JhcHBlci4kX19saXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwcGVyO1xufTtcblxuZXhwb3J0cy5jcmVhdGVUcmFja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25UcmFja2VyKCk7XG59O1xuIiwidmFyIENvbXBvbmVudERlZiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50RGVmXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlZ2luQ29tcG9uZW50KFxuICBjb21wb25lbnRzQ29udGV4dCxcbiAgY29tcG9uZW50LFxuICBrZXksXG4gIG93bmVyQ29tcG9uZW50RGVmXG4pIHtcbiAgdmFyIGNvbXBvbmVudElkID0gY29tcG9uZW50LmlkO1xuICB2YXIgY29tcG9uZW50RGVmID0gKGNvbXBvbmVudHNDb250ZXh0Ll9fX2NvbXBvbmVudERlZiA9IG5ldyBDb21wb25lbnREZWYoXG4gICAgY29tcG9uZW50LFxuICAgIGNvbXBvbmVudElkLFxuICAgIGNvbXBvbmVudHNDb250ZXh0XG4gICkpO1xuICBjb21wb25lbnRzQ29udGV4dC5fX19nbG9iYWxDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbXG4gICAgY29tcG9uZW50SWRcbiAgXSA9IHRydWU7XG4gIGNvbXBvbmVudHNDb250ZXh0Ll9fX2NvbXBvbmVudHMucHVzaChjb21wb25lbnREZWYpO1xuXG4gIHZhciBvdXQgPSBjb21wb25lbnRzQ29udGV4dC5fX19vdXQ7XG4gIG91dC5iYyhjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnREZWYgJiYgb3duZXJDb21wb25lbnREZWYuX19fY29tcG9uZW50KTtcbiAgcmV0dXJuIGNvbXBvbmVudERlZjtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmRDb21wb25lbnQob3V0KSB7XG4gIG91dC5lZSgpOyAvLyBlbmRFbGVtZW50KCkgKGFsc28gd29ya3MgZm9yIFZDb21wb25lbnQgbm9kZXMgcHVzaGVkIG9uIHRvIHRoZSBzdGFjaylcbn07XG4iLCJ2YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIHNldEltbWVkaWF0ZSA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvc2V0LWltbWVkaWF0ZVwiKS5fX19zZXRJbW1lZGlhdGU7XG52YXIgd2FycDEwRmluYWxpemUgPSByZXF1aXJlKFwid2FycDEwL2ZpbmFsaXplXCIpO1xudmFyIGRlZmluZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50XCIpO1xudmFyIGV2ZW50RGVsZWdhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvZXZlbnQtZGVsZWdhdGlvblwiKTtcbnZhciBjcmVhdGVGcmFnbWVudE5vZGUgPVxuICByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS92ZG9tL21vcnBoZG9tL2ZyYWdtZW50XCIpLl9fX2NyZWF0ZUZyYWdtZW50Tm9kZTtcbnZhciBDb21wb25lbnREZWYgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudERlZlwiKTtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9kb20tZGF0YVwiKTtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIHJlcSA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvcmVxdWlyZVwiKTtcbnZhciBjb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG52YXIgYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyA9XG4gIGNvbXBvbmVudHNVdGlsLl9fX2FkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHM7XG52YXIga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWQgPSBkb21EYXRhLl9fX3NzcktleWVkRWxlbWVudHNCeUNvbXBvbmVudElkO1xudmFyIGNvbXBvbmVudHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2NvbXBvbmVudEJ5RE9NTm9kZTtcbnZhciBzZXJ2ZXJDb21wb25lbnRSb290Tm9kZXMgPSB7fTtcbnZhciBzZXJ2ZXJSZW5kZXJlZE1ldGEgPSB7fTtcbnZhciB3aW4gPSB3aW5kb3c7XG5cbnZhciBERUZBVUxUX1JVTlRJTUVfSUQgPSBcIk1cIjtcbnZhciBGTEFHX1dJTExfUkVSRU5ERVJfSU5fQlJPV1NFUiA9IDE7XG4vLyB2YXIgRkxBR19IQVNfUkVOREVSX0JPRFkgPSAyO1xuXG52YXIgcmVnaXN0ZXJlZCA9IHt9O1xudmFyIGxvYWRlZCA9IHt9O1xudmFyIGNvbXBvbmVudFR5cGVzID0ge307XG52YXIgZGVmZXJyZWREZWZzO1xudmFyIHBlbmRpbmdEZWZzO1xuXG5mdW5jdGlvbiByZWdpc3Rlcih0eXBlLCBkZWYpIHtcbiAgdmFyIHBlbmRpbmdGb3JUeXBlO1xuICBpZiAocGVuZGluZ0RlZnMpIHtcbiAgICBwZW5kaW5nRm9yVHlwZSA9IHBlbmRpbmdEZWZzW3R5cGVdO1xuICB9XG4gIHJlZ2lzdGVyZWRbdHlwZV0gPSBkZWY7XG4gIGRlbGV0ZSBsb2FkZWRbdHlwZV07XG4gIGRlbGV0ZSBjb21wb25lbnRUeXBlc1t0eXBlXTtcblxuICBpZiAocGVuZGluZ0ZvclR5cGUpIHtcbiAgICBkZWxldGUgcGVuZGluZ0RlZnNbdHlwZV07XG4gICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHBlbmRpbmdGb3JUeXBlLmZvckVhY2goZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgdHJ5SHlkcmF0ZUNvbXBvbmVudChhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdHlwZTtcbn1cblxuZnVuY3Rpb24gYWRkUGVuZGluZ0RlZihkZWYsIHR5cGUsIG1ldGEsIGhvc3QsIHJ1bnRpbWVJZCkge1xuICBpZiAoIXBlbmRpbmdEZWZzKSB7XG4gICAgcGVuZGluZ0RlZnMgPSB7fTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwZW5kaW5nQ29tcG9uZW50SWRzID0gT2JqZWN0LmtleXMocGVuZGluZ0RlZnMpO1xuICAgICAgICBpZiAocGVuZGluZ0NvbXBvbmVudElkcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICAgIFwiTWFya28gdGVtcGxhdGVzIHdlcmUgbmV2ZXIgbG9hZGVkIGZvcjogXCIgKyBwZW5kaW5nQ29tcG9uZW50SWRzXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIChwZW5kaW5nRGVmc1t0eXBlXSA9IHBlbmRpbmdEZWZzW3R5cGVdIHx8IFtdKS5wdXNoKFtcbiAgICBkZWYsXG4gICAgbWV0YSxcbiAgICBob3N0LFxuICAgIHJ1bnRpbWVJZCxcbiAgXSk7XG59XG5cbmZ1bmN0aW9uIGxvYWQodHlwZU5hbWUsIGlzTGVnYWN5KSB7XG4gIHZhciB0YXJnZXQgPSBsb2FkZWRbdHlwZU5hbWVdO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRhcmdldCA9IHJlZ2lzdGVyZWRbdHlwZU5hbWVdO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0KCk7XG4gICAgfSBlbHNlIGlmIChpc0xlZ2FjeSkge1xuICAgICAgdGFyZ2V0ID0gZXhwb3J0cy5fX19sZWdhY3kubG9hZCh0eXBlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldCA9IHJlcSh0eXBlTmFtZSk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgIFwiTG9va3MgbGlrZSB5b3UgdXNlZCBgcmVxdWlyZTpgIGluIHlvdXIgYnJvd3Nlci5qc29uIHRvIGxvYWQgYSBjb21wb25lbnQuICBUaGlzIHJlcXVpcmVzIHRoYXQgTWFya28gaGFzIGtub3dsZWRnZSBvZiBob3cgbGFzc28gZ2VuZXJhdGVzIHBhdGhzIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYSBmdXR1cmUgdmVyc2lvbi4gIGBtYXJrby1kZXBlbmRlbmNpZXM6L3BhdGgvdG8vdGVtcGxhdGUubWFya29gIHNob3VsZCBiZSB1c2VkIGluc3RlYWQuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJDb21wb25lbnQgbm90IGZvdW5kOiBcIiArIHR5cGVOYW1lKTtcbiAgICB9XG5cbiAgICBsb2FkZWRbdHlwZU5hbWVdID0gdGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50Q2xhc3ModHlwZU5hbWUsIGlzTGVnYWN5KSB7XG4gIHZhciBDb21wb25lbnRDbGFzcyA9IGNvbXBvbmVudFR5cGVzW3R5cGVOYW1lXTtcblxuICBpZiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICByZXR1cm4gQ29tcG9uZW50Q2xhc3M7XG4gIH1cblxuICBDb21wb25lbnRDbGFzcyA9IGxvYWQodHlwZU5hbWUsIGlzTGVnYWN5KTtcblxuICBDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzLkNvbXBvbmVudCB8fCBDb21wb25lbnRDbGFzcztcblxuICBpZiAoIUNvbXBvbmVudENsYXNzLl9fX2lzQ29tcG9uZW50KSB7XG4gICAgQ29tcG9uZW50Q2xhc3MgPSBkZWZpbmVDb21wb25lbnQoQ29tcG9uZW50Q2xhc3MsIENvbXBvbmVudENsYXNzLnJlbmRlcmVyKTtcbiAgfVxuXG4gIC8vIE1ha2UgdGhlIGNvbXBvbmVudCBcInR5cGVcIiBhY2Nlc3NpYmxlIG9uIGVhY2ggY29tcG9uZW50IGluc3RhbmNlXG4gIENvbXBvbmVudENsYXNzLnByb3RvdHlwZS5fX190eXBlID0gdHlwZU5hbWU7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgdmFyIGNsYXNzTmFtZU1hdGNoID1cbiAgICAgIC9cXC8oW14vXSs/KSg/OlxcL2luZGV4fFxcL3RlbXBsYXRlfCkoPzpcXC5tYXJrb3xcXC5jb21wb25lbnQoPzotYnJvd3Nlcik/fCkkLy5leGVjKFxuICAgICAgICB0eXBlTmFtZVxuICAgICAgKTtcbiAgICB2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lTWF0Y2ggPyBjbGFzc05hbWVNYXRjaFsxXSA6IFwiQW5vbnltb3VzQ29tcG9uZW50XCI7XG4gICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UoLy0oLikvZywgZnVuY3Rpb24gKGcpIHtcbiAgICAgIHJldHVybiBnWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lXG4gICAgICAucmVwbGFjZSgvXFwkXFxkK1xcLlxcZCtcXC5cXGQrJC8sIFwiXCIpXG4gICAgICAucmVwbGFjZSgvXlteYS16JF9dL2ksIFwiXyQmXCIpXG4gICAgICAucmVwbGFjZSgvW14wLTlhLXokX10rL2dpLCBcIl9cIik7XG4gICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBjbGFzc05hbWUuc2xpY2UoMSk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIE9sZENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3M7XG4gICAgQ29tcG9uZW50Q2xhc3MgPSB7XG4gICAgICBbY2xhc3NOYW1lXTogZnVuY3Rpb24gKGlkLCBkb2MpIHtcbiAgICAgICAgT2xkQ29tcG9uZW50Q2xhc3MuY2FsbCh0aGlzLCBpZCwgZG9jKTtcbiAgICAgIH0sXG4gICAgfVtjbGFzc05hbWVdO1xuICAgIENvbXBvbmVudENsYXNzLnByb3RvdHlwZSA9IE9sZENvbXBvbmVudENsYXNzLnByb3RvdHlwZTtcbiAgfVxuXG4gIGNvbXBvbmVudFR5cGVzW3R5cGVOYW1lXSA9IENvbXBvbmVudENsYXNzO1xuXG4gIHJldHVybiBDb21wb25lbnRDbGFzcztcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KHR5cGVOYW1lLCBpZCwgaXNMZWdhY3kpIHtcbiAgdmFyIENvbXBvbmVudENsYXNzID0gZ2V0Q29tcG9uZW50Q2xhc3ModHlwZU5hbWUsIGlzTGVnYWN5KTtcbiAgcmV0dXJuIG5ldyBDb21wb25lbnRDbGFzcyhpZCk7XG59XG5cbmZ1bmN0aW9uIGluZGV4U2VydmVyQ29tcG9uZW50Qm91bmRhcmllcyhub2RlLCBydW50aW1lSWQsIHN0YWNrKSB7XG4gIHZhciBjb21wb25lbnRJZDtcbiAgdmFyIG93bmVySWQ7XG4gIHZhciBvd25lckNvbXBvbmVudDtcbiAgdmFyIGtleWVkRWxlbWVudHM7XG4gIHZhciBuZXh0U2libGluZztcbiAgdmFyIHJ1bnRpbWVMZW5ndGggPSBydW50aW1lSWQubGVuZ3RoO1xuICBzdGFjayA9IHN0YWNrIHx8IFtdO1xuXG4gIG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gIHdoaWxlIChub2RlKSB7XG4gICAgbmV4dFNpYmxpbmcgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAvLyBDb21tZW50IG5vZGVcbiAgICAgIHZhciBjb21tZW50VmFsdWUgPSBub2RlLm5vZGVWYWx1ZTtcbiAgICAgIGlmIChjb21tZW50VmFsdWUuc2xpY2UoMCwgcnVudGltZUxlbmd0aCkgPT09IHJ1bnRpbWVJZCkge1xuICAgICAgICB2YXIgZmlyc3RDaGFyID0gY29tbWVudFZhbHVlW3J1bnRpbWVMZW5ndGhdO1xuXG4gICAgICAgIGlmIChmaXJzdENoYXIgPT09IFwiXlwiIHx8IGZpcnN0Q2hhciA9PT0gXCIjXCIpIHtcbiAgICAgICAgICBzdGFjay5wdXNoKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGZpcnN0Q2hhciA9PT0gXCIvXCIpIHtcbiAgICAgICAgICB2YXIgZW5kTm9kZSA9IG5vZGU7XG4gICAgICAgICAgdmFyIHN0YXJ0Tm9kZSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgIHZhciByb290Tm9kZTtcblxuICAgICAgICAgIGlmIChzdGFydE5vZGUucGFyZW50Tm9kZSA9PT0gZW5kTm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICByb290Tm9kZSA9IGNyZWF0ZUZyYWdtZW50Tm9kZShzdGFydE5vZGUubmV4dFNpYmxpbmcsIGVuZE5vZGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByb290Tm9kZSA9IGNyZWF0ZUZyYWdtZW50Tm9kZShcbiAgICAgICAgICAgICAgZW5kTm9kZS5wYXJlbnROb2RlLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgIGVuZE5vZGVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tcG9uZW50SWQgPSBzdGFydE5vZGUubm9kZVZhbHVlLnN1YnN0cmluZyhydW50aW1lTGVuZ3RoICsgMSk7XG4gICAgICAgICAgZmlyc3RDaGFyID0gc3RhcnROb2RlLm5vZGVWYWx1ZVtydW50aW1lTGVuZ3RoXTtcblxuICAgICAgICAgIGlmIChmaXJzdENoYXIgPT09IFwiXlwiKSB7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSBjb21wb25lbnRJZC5zcGxpdCgvIC9nKTtcbiAgICAgICAgICAgIHZhciBrZXkgPSBwYXJ0c1syXTtcbiAgICAgICAgICAgIG93bmVySWQgPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgIGNvbXBvbmVudElkID0gcGFydHNbMF07XG4gICAgICAgICAgICBpZiAoKG93bmVyQ29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW293bmVySWRdKSkge1xuICAgICAgICAgICAgICBrZXllZEVsZW1lbnRzID0gb3duZXJDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50cztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGtleWVkRWxlbWVudHMgPVxuICAgICAgICAgICAgICAgIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW293bmVySWRdIHx8XG4gICAgICAgICAgICAgICAgKGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW293bmVySWRdID0ge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyhcbiAgICAgICAgICAgICAga2V5ZWRFbGVtZW50cyxcbiAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICByb290Tm9kZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VydmVyQ29tcG9uZW50Um9vdE5vZGVzW2NvbXBvbmVudElkXSA9IHJvb3ROb2RlO1xuXG4gICAgICAgICAgc3RhcnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3RhcnROb2RlKTtcbiAgICAgICAgICBlbmROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZW5kTm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgIC8vIEhUTUwgZWxlbWVudCBub2RlXG4gICAgICB2YXIgbWFya29LZXkgPSBub2RlLmdldEF0dHJpYnV0ZShcImRhdGEtbWFya28ta2V5XCIpO1xuICAgICAgdmFyIG1hcmtvUHJvcHMgPSBjb21wb25lbnRzVXRpbC5fX19nZXRNYXJrb1Byb3BzRnJvbUVsKG5vZGUpO1xuICAgICAgaWYgKG1hcmtvS2V5KSB7XG4gICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IG1hcmtvS2V5LmluZGV4T2YoXCIgXCIpO1xuICAgICAgICBvd25lcklkID0gbWFya29LZXkuc3Vic3RyaW5nKHNlcGFyYXRvckluZGV4ICsgMSk7XG4gICAgICAgIG1hcmtvS2V5ID0gbWFya29LZXkuc3Vic3RyaW5nKDAsIHNlcGFyYXRvckluZGV4KTtcbiAgICAgICAgaWYgKChvd25lckNvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFtvd25lcklkXSkpIHtcbiAgICAgICAgICBrZXllZEVsZW1lbnRzID0gb3duZXJDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBrZXllZEVsZW1lbnRzID1cbiAgICAgICAgICAgIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW293bmVySWRdIHx8XG4gICAgICAgICAgICAoa2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbb3duZXJJZF0gPSB7fSk7XG4gICAgICAgIH1cbiAgICAgICAga2V5ZWRFbGVtZW50c1ttYXJrb0tleV0gPSBub2RlO1xuICAgICAgfVxuICAgICAgaWYgKG1hcmtvUHJvcHMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMobWFya29Qcm9wcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgaWYgKGtleS5zbGljZSgwLCAyKSA9PT0gXCJvblwiKSB7XG4gICAgICAgICAgICBldmVudERlbGVnYXRpb24uX19fYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyKGtleS5zbGljZSgyKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGluZGV4U2VydmVyQ29tcG9uZW50Qm91bmRhcmllcyhub2RlLCBydW50aW1lSWQsIHN0YWNrKTtcbiAgICB9XG5cbiAgICBub2RlID0gbmV4dFNpYmxpbmc7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ29tcG9uZW50RXZlbnRIYW5kbGVyKGNvbXBvbmVudCwgdGFyZ2V0TWV0aG9kTmFtZSwgYXJncykge1xuICB2YXIgbWV0aG9kID0gY29tcG9uZW50W3RhcmdldE1ldGhvZE5hbWVdO1xuICBpZiAoIW1ldGhvZCkge1xuICAgIHRocm93IEVycm9yKFwiTWV0aG9kIG5vdCBmb3VuZDogXCIgKyB0YXJnZXRNZXRob2ROYW1lKTtcbiAgfVxuXG4gIG1ldGhvZC5hcHBseShjb21wb25lbnQsIGFyZ3MpO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVySGVscGVyKGVsLCBldmVudFR5cGUsIGlzT25jZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGV2ZW50TGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgaWYgKGlzT25jZSkge1xuICAgIGV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxpc3RlbmVyKGV2ZW50KTtcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudExpc3RlbmVyKTtcbiAgICB9O1xuICB9XG5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50TGlzdGVuZXIsIGZhbHNlKTtcblxuICByZXR1cm4gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudExpc3RlbmVyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkRE9NRXZlbnRMaXN0ZW5lcnMoXG4gIGNvbXBvbmVudCxcbiAgZWwsXG4gIGV2ZW50VHlwZSxcbiAgdGFyZ2V0TWV0aG9kTmFtZSxcbiAgaXNPbmNlLFxuICBleHRyYUFyZ3MsXG4gIGhhbmRsZXNcbikge1xuICB2YXIgcmVtb3ZlTGlzdGVuZXIgPSBhZGRFdmVudExpc3RlbmVySGVscGVyKFxuICAgIGVsLFxuICAgIGV2ZW50VHlwZSxcbiAgICBpc09uY2UsXG4gICAgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgYXJncyA9IFtldmVudCwgZWxdO1xuICAgICAgaWYgKGV4dHJhQXJncykge1xuICAgICAgICBhcmdzID0gZXh0cmFBcmdzLmNvbmNhdChhcmdzKTtcbiAgICAgIH1cblxuICAgICAgaW52b2tlQ29tcG9uZW50RXZlbnRIYW5kbGVyKGNvbXBvbmVudCwgdGFyZ2V0TWV0aG9kTmFtZSwgYXJncyk7XG4gICAgfVxuICApO1xuICBoYW5kbGVzLnB1c2gocmVtb3ZlTGlzdGVuZXIpO1xufVxuXG5mdW5jdGlvbiBpbml0Q29tcG9uZW50KGNvbXBvbmVudERlZiwgaG9zdCkge1xuICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudDtcblxuICBpZiAoIWNvbXBvbmVudCB8fCAhY29tcG9uZW50Ll9fX2lzQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuOyAvLyBsZWdhY3lcbiAgfVxuXG4gIGNvbXBvbmVudC5fX19yZXNldCgpO1xuICBjb21wb25lbnQuX19faG9zdCA9IGhvc3Q7XG5cbiAgdmFyIGlzRXhpc3RpbmcgPSBjb21wb25lbnREZWYuX19faXNFeGlzdGluZztcblxuICBpZiAoaXNFeGlzdGluZykge1xuICAgIGNvbXBvbmVudC5fX19yZW1vdmVET01FdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgdmFyIGRvbUV2ZW50cyA9IGNvbXBvbmVudERlZi5fX19kb21FdmVudHM7XG4gIGlmIChkb21FdmVudHMpIHtcbiAgICB2YXIgZXZlbnRMaXN0ZW5lckhhbmRsZXMgPSBbXTtcblxuICAgIGRvbUV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkb21FdmVudEFyZ3MpIHtcbiAgICAgIC8vIFRoZSBldmVudCBtYXBwaW5nIGlzIGZvciBhIGRpcmVjdCBET00gZXZlbnQgKG5vdCBhIGN1c3RvbSBldmVudCBhbmQgbm90IGZvciBidWJibGlnbiBkb20gZXZlbnRzKVxuXG4gICAgICB2YXIgZXZlbnRUeXBlID0gZG9tRXZlbnRBcmdzWzBdO1xuICAgICAgdmFyIHRhcmdldE1ldGhvZE5hbWUgPSBkb21FdmVudEFyZ3NbMV07XG4gICAgICB2YXIgZXZlbnRFbCA9IGNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2RvbUV2ZW50QXJnc1syXV07XG4gICAgICB2YXIgaXNPbmNlID0gZG9tRXZlbnRBcmdzWzNdO1xuICAgICAgdmFyIGV4dHJhQXJncyA9IGRvbUV2ZW50QXJnc1s0XTtcblxuICAgICAgYWRkRE9NRXZlbnRMaXN0ZW5lcnMoXG4gICAgICAgIGNvbXBvbmVudCxcbiAgICAgICAgZXZlbnRFbCxcbiAgICAgICAgZXZlbnRUeXBlLFxuICAgICAgICB0YXJnZXRNZXRob2ROYW1lLFxuICAgICAgICBpc09uY2UsXG4gICAgICAgIGV4dHJhQXJncyxcbiAgICAgICAgZXZlbnRMaXN0ZW5lckhhbmRsZXNcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpZiAoZXZlbnRMaXN0ZW5lckhhbmRsZXMubGVuZ3RoKSB7XG4gICAgICBjb21wb25lbnQuX19fZG9tRXZlbnRMaXN0ZW5lckhhbmRsZXMgPSBldmVudExpc3RlbmVySGFuZGxlcztcbiAgICB9XG4gIH1cblxuICBpZiAoY29tcG9uZW50Ll9fX21vdW50ZWQpIHtcbiAgICBjb21wb25lbnQuX19fZW1pdFVwZGF0ZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbXBvbmVudC5fX19tb3VudGVkID0gdHJ1ZTtcbiAgICBjb21wb25lbnQuX19fZW1pdE1vdW50KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIGluaXRpYWxpemVkIGNvbXBvbmVudHMgYXNzb2NpYXRlZCB3aXRoIFVJIGNvbXBvbmVudHNcbiAqIHJlbmRlcmVkIGluIHRoZSBicm93c2VyLiBXaGlsZSByZW5kZXJpbmcgVUkgY29tcG9uZW50cyBhIFwiY29tcG9uZW50cyBjb250ZXh0XCJcbiAqIGlzIGFkZGVkIHRvIHRoZSByZW5kZXJpbmcgY29udGV4dCB0byBrZWVwIHVwIHdpdGggd2hpY2ggY29tcG9uZW50cyBhcmUgcmVuZGVyZWQuXG4gKiBXaGVuIHJlYWR5LCB0aGUgY29tcG9uZW50cyBjYW4gdGhlbiBiZSBpbml0aWFsaXplZCBieSB3YWxraW5nIHRoZSBjb21wb25lbnQgdHJlZVxuICogaW4gdGhlIGNvbXBvbmVudHMgY29udGV4dCAobmVzdGVkIGNvbXBvbmVudHMgYXJlIGluaXRpYWxpemVkIGJlZm9yZSBhbmNlc3RvciBjb21wb25lbnRzKS5cbiAqIEBwYXJhbSAge0FycmF5PG1hcmtvLWNvbXBvbmVudHMvbGliL0NvbXBvbmVudERlZj59IGNvbXBvbmVudERlZnMgQW4gYXJyYXkgb2YgQ29tcG9uZW50RGVmIGluc3RhbmNlc1xuICovXG5mdW5jdGlvbiBpbml0Q2xpZW50UmVuZGVyZWQoY29tcG9uZW50RGVmcywgaG9zdCkge1xuICBpZiAoIWhvc3QpIGhvc3QgPSBkb2N1bWVudDtcbiAgLy8gRW5zdXJlIHRoYXQgZXZlbnQgaGFuZGxlcnMgdG8gaGFuZGxlIGRlbGVnYXRpbmcgZXZlbnRzIGFyZVxuICAvLyBhbHdheXMgYXR0YWNoZWQgYmVmb3JlIGluaXRpYWxpemluZyBhbnkgY29tcG9uZW50c1xuICBldmVudERlbGVnYXRpb24uX19faW5pdChob3N0KTtcbiAgdmFyIGxlbiA9IGNvbXBvbmVudERlZnMubGVuZ3RoO1xuICB2YXIgY29tcG9uZW50RGVmO1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSBsZW47IGktLTsgKSB7XG4gICAgY29tcG9uZW50RGVmID0gY29tcG9uZW50RGVmc1tpXTtcbiAgICB0cmFja0NvbXBvbmVudChjb21wb25lbnREZWYpO1xuICB9XG5cbiAgZm9yIChpID0gbGVuOyBpLS07ICkge1xuICAgIGNvbXBvbmVudERlZiA9IGNvbXBvbmVudERlZnNbaV07XG4gICAgaW5pdENvbXBvbmVudChjb21wb25lbnREZWYsIGhvc3QpO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaW5pdGlhbGl6ZXMgYWxsIGNvbXBvbmVudHMgdGhhdCB3ZXJlIHJlbmRlcmVkIG9uIHRoZSBzZXJ2ZXIgYnkgaXRlcmF0aW5nIG92ZXIgYWxsXG4gKiBvZiB0aGUgY29tcG9uZW50IElEcy5cbiAqL1xuZnVuY3Rpb24gaW5pdFNlcnZlclJlbmRlcmVkKHJlbmRlcmVkQ29tcG9uZW50cywgaG9zdCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiByZW5kZXJlZENvbXBvbmVudHM7XG4gIHZhciBnbG9iYWxLZXkgPSBcIiRcIjtcbiAgdmFyIHJ1bnRpbWVJZDtcblxuICBpZiAodHlwZSAhPT0gXCJvYmplY3RcIikge1xuICAgIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBydW50aW1lSWQgPSByZW5kZXJlZENvbXBvbmVudHM7XG4gICAgICBnbG9iYWxLZXkgKz0gcnVudGltZUlkICsgXCJfQ1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbG9iYWxLZXkgKz0gKHJ1bnRpbWVJZCA9IERFRkFVTFRfUlVOVElNRV9JRCkgKyBcIkNcIjtcbiAgICB9XG5cbiAgICByZW5kZXJlZENvbXBvbmVudHMgPSB3aW5bZ2xvYmFsS2V5XTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHJlbmRlcmVkQ29tcG9uZW50cyAmJlxuICAgICAgICByZW5kZXJlZENvbXBvbmVudHMuaSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHJlbmRlcmVkQ29tcG9uZW50cy5pICE9PSBjb21wb25lbnRzVXRpbC5fX19ydW50aW1lSWRcbiAgICAgICkge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgXCJNdWx0aXBsZSBpbnN0YW5jZXMgb2YgTWFya28gaGF2ZSBhdHRhY2hlZCB0byB0aGUgc2FtZSBydW50aW1lIGlkLiBUaGlzIGNvdWxkIG1lYW4gdGhhdCBtb3JlIHRoYW4gb25lIGNvcHkgb2YgTWFya28gaXMgbG9hZGVkIG9uIHRoZSBwYWdlLCBvciB0aGF0IHRoZSBzY3JpcHQgY29udGFpbmluZyBNYXJrbyBoYXMgZXhlY3V0ZWQgbW9yZSB0aGFuIG9uY2UuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZmFrZUFycmF5ID0gKHdpbltnbG9iYWxLZXldID0ge1xuICAgICAgcjogcnVudGltZUlkLFxuICAgICAgY29uY2F0OiBpbml0U2VydmVyUmVuZGVyZWQsXG4gICAgfSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgZmFrZUFycmF5LmkgPSBjb21wb25lbnRzVXRpbC5fX19ydW50aW1lSWQ7XG4gICAgfVxuXG4gICAgaWYgKHJlbmRlcmVkQ29tcG9uZW50cyAmJiByZW5kZXJlZENvbXBvbmVudHMuZm9yRWFjaCkge1xuICAgICAgcmVuZGVyZWRDb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKHJlbmRlcmVkQ29tcG9uZW50KSB7XG4gICAgICAgIGZha2VBcnJheS5jb25jYXQocmVuZGVyZWRDb21wb25lbnQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZha2VBcnJheTtcbiAgfVxuXG4gIHZhciBpc0Zyb21TZXJpYWxpemVkR2xvYmFscyA9IHRoaXMuY29uY2F0ID09PSBpbml0U2VydmVyUmVuZGVyZWQ7XG4gIHJlbmRlcmVkQ29tcG9uZW50cyA9IHdhcnAxMEZpbmFsaXplKHJlbmRlcmVkQ29tcG9uZW50cyk7XG5cbiAgaWYgKGlzRnJvbVNlcmlhbGl6ZWRHbG9iYWxzKSB7XG4gICAgcnVudGltZUlkID0gdGhpcy5yO1xuICAgIGhvc3QgPSBkb2N1bWVudDtcbiAgfSBlbHNlIHtcbiAgICBydW50aW1lSWQgPSByZW5kZXJlZENvbXBvbmVudHMuciB8fCBERUZBVUxUX1JVTlRJTUVfSUQ7XG4gICAgaWYgKCFob3N0KSBob3N0ID0gZG9jdW1lbnQ7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgY29tcGxhaW4oXG4gICAgICAgIFwiUGFzc2luZyBzZXJpYWxpemVkIGRhdGEgdG8gYHJlcXVpcmUoJ21hcmtvL2NvbXBvbmVudHMpLmluaXRgIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQgc2V0ICckZ2xvYmFsLnJ1bnRpbWVJZCcgYW5kIHByb3ZpZGUgdGhlICdydW50aW1lSWQnIG9wdGlvbiB0byB5b3VyIE1hcmtvIGJ1bmRsZXIgcGx1Z2luLlwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIGlmIChob3N0ICE9PSBkb2N1bWVudCkge1xuICAgICAgY29tcGxhaW4oXG4gICAgICAgIFwiUGFzc2luZyBhIGRvY3VtZW50IG90aGVyIHRoYW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQgdG8gYHJlcXVpcmUoJ21hcmtvL2NvbXBvbmVudHMpLmluaXRgIGlzIGRlcHJlY2F0ZWQuXCJcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHByZWZpeCA9IHJlbmRlcmVkQ29tcG9uZW50cy5wIHx8IFwiXCI7XG4gIHZhciBtZXRhID0gc2VydmVyUmVuZGVyZWRNZXRhW3ByZWZpeF07XG4gIHZhciBpc0xhc3QgPSByZW5kZXJlZENvbXBvbmVudHMubDtcblxuICBpZiAobWV0YSkge1xuICAgIGlmIChpc0xhc3QpIHtcbiAgICAgIGRlbGV0ZSBzZXJ2ZXJSZW5kZXJlZE1ldGFbcHJlZml4XTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbWV0YSA9IHt9O1xuXG4gICAgaWYgKCFpc0xhc3QpIHtcbiAgICAgIHNlcnZlclJlbmRlcmVkTWV0YVtwcmVmaXhdID0gbWV0YTtcbiAgICB9XG4gIH1cblxuICAvLyBFbnN1cmUgdGhhdCBldmVudCBoYW5kbGVycyB0byBoYW5kbGUgZGVsZWdhdGluZyBldmVudHMgYXJlXG4gIC8vIGFsd2F5cyBhdHRhY2hlZCBiZWZvcmUgaW5pdGlhbGl6aW5nIGFueSBjb21wb25lbnRzXG4gIGluZGV4U2VydmVyQ29tcG9uZW50Qm91bmRhcmllcyhob3N0LCBydW50aW1lSWQpO1xuICBldmVudERlbGVnYXRpb24uX19faW5pdChob3N0KTtcblxuICBpZiAocmVuZGVyZWRDb21wb25lbnRzLmcpIHtcbiAgICBtZXRhLl9fX2dsb2JhbHMgPSByZW5kZXJlZENvbXBvbmVudHMuZztcbiAgfVxuXG4gIGlmIChyZW5kZXJlZENvbXBvbmVudHMudCkge1xuICAgIG1ldGEuX19fdHlwZXMgPSBtZXRhLl9fX3R5cGVzXG4gICAgICA/IG1ldGEuX19fdHlwZXMuY29uY2F0KHJlbmRlcmVkQ29tcG9uZW50cy50KVxuICAgICAgOiByZW5kZXJlZENvbXBvbmVudHMudDtcbiAgfVxuXG4gIC8vIGh5ZHJhdGUgY29tcG9uZW50cyB0b3AgZG93biAobGVhZiBub2RlcyBsYXN0KVxuICAvLyBhbmQgcmV0dXJuIGFuIGFycmF5IG9mIGZ1bmN0aW9ucyB0byBtb3VudCB0aGVzZSBjb21wb25lbnRzXG4gIChyZW5kZXJlZENvbXBvbmVudHMudyB8fCBbXSlcbiAgICAubWFwKGZ1bmN0aW9uIChjb21wb25lbnREZWYpIHtcbiAgICAgIHZhciB0eXBlTmFtZSA9IG1ldGEuX19fdHlwZXNbY29tcG9uZW50RGVmWzFdXTtcblxuICAgICAgcmV0dXJuIHJlZ2lzdGVyZWRbdHlwZU5hbWVdIHx8XG4gICAgICAgIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fFxuICAgICAgICByZXEuZSh0eXBlTmFtZSlcbiAgICAgICAgPyB0cnlIeWRyYXRlQ29tcG9uZW50KGNvbXBvbmVudERlZiwgbWV0YSwgaG9zdCwgcnVudGltZUlkKVxuICAgICAgICA6IGFkZFBlbmRpbmdEZWYoY29tcG9uZW50RGVmLCB0eXBlTmFtZSwgbWV0YSwgaG9zdCwgcnVudGltZUlkKTtcbiAgICB9KVxuICAgIC5yZXZlcnNlKClcbiAgICAuZm9yRWFjaCh0cnlJbnZva2UpO1xuXG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiB0cnlIeWRyYXRlQ29tcG9uZW50KHJhd0RlZiwgbWV0YSwgaG9zdCwgcnVudGltZUlkKSB7XG4gIHZhciBjb21wb25lbnREZWYgPSBDb21wb25lbnREZWYuX19fZGVzZXJpYWxpemUoXG4gICAgcmF3RGVmLFxuICAgIG1ldGEuX19fdHlwZXMsXG4gICAgbWV0YS5fX19nbG9iYWxzLFxuICAgIGV4cG9ydHNcbiAgKTtcbiAgdmFyIG1vdW50ID0gaHlkcmF0ZUNvbXBvbmVudEFuZEdldE1vdW50KGNvbXBvbmVudERlZiwgaG9zdCk7XG5cbiAgaWYgKCFtb3VudCkge1xuICAgIC8vIGh5ZHJhdGVDb21wb25lbnRBbmRHZXRNb3VudCB3aWxsIHJldHVybiBmYWxzZSBpZiB0aGVyZSBpcyBub3Qgcm9vdE5vZGVcbiAgICAvLyBmb3IgdGhlIGNvbXBvbmVudC4gIElmIHRoaXMgaXMgdGhlIGNhc2UsIHdlJ2xsIHdhaXQgdW50aWwgdGhlXG4gICAgLy8gRE9NIGhhcyBmdWxseSBsb2FkZWQgdG8gYXR0ZW1wdCB0byBpbml0IHRoZSBjb21wb25lbnQgYWdhaW4uXG4gICAgaWYgKGRlZmVycmVkRGVmcykge1xuICAgICAgZGVmZXJyZWREZWZzLnB1c2goY29tcG9uZW50RGVmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJyZWREZWZzID0gW2NvbXBvbmVudERlZl07XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluZGV4U2VydmVyQ29tcG9uZW50Qm91bmRhcmllcyhob3N0LCBydW50aW1lSWQpO1xuICAgICAgICBkZWZlcnJlZERlZnNcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjb21wb25lbnREZWYpIHtcbiAgICAgICAgICAgIHJldHVybiBoeWRyYXRlQ29tcG9uZW50QW5kR2V0TW91bnQoY29tcG9uZW50RGVmLCBob3N0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAuZm9yRWFjaCh0cnlJbnZva2UpO1xuICAgICAgICBkZWZlcnJlZERlZnMubGVuZ3RoID0gMDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtb3VudDtcbn1cblxuZnVuY3Rpb24gaHlkcmF0ZUNvbXBvbmVudEFuZEdldE1vdW50KGNvbXBvbmVudERlZiwgaG9zdCkge1xuICB2YXIgY29tcG9uZW50SWQgPSBjb21wb25lbnREZWYuaWQ7XG4gIHZhciBjb21wb25lbnQgPSBjb21wb25lbnREZWYuX19fY29tcG9uZW50O1xuICB2YXIgcm9vdE5vZGUgPSBzZXJ2ZXJDb21wb25lbnRSb290Tm9kZXNbY29tcG9uZW50SWRdO1xuICB2YXIgcmVuZGVyUmVzdWx0O1xuXG4gIGlmIChyb290Tm9kZSkge1xuICAgIGRlbGV0ZSBzZXJ2ZXJDb21wb25lbnRSb290Tm9kZXNbY29tcG9uZW50SWRdO1xuXG4gICAgY29tcG9uZW50Ll9fX3Jvb3ROb2RlID0gcm9vdE5vZGU7XG4gICAgY29tcG9uZW50c0J5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGNvbXBvbmVudCk7XG5cbiAgICBpZiAoY29tcG9uZW50RGVmLl9fX2ZsYWdzICYgRkxBR19XSUxMX1JFUkVOREVSX0lOX0JST1dTRVIpIHtcbiAgICAgIGNvbXBvbmVudC5fX19ob3N0ID0gaG9zdDtcbiAgICAgIHJlbmRlclJlc3VsdCA9IGNvbXBvbmVudC5fX19yZXJlbmRlcihjb21wb25lbnQuX19faW5wdXQsIHRydWUpO1xuICAgICAgdHJhY2tDb21wb25lbnQoY29tcG9uZW50RGVmKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICAgICAgcmVuZGVyUmVzdWx0LmFmdGVySW5zZXJ0KGhvc3QpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhY2tDb21wb25lbnQoY29tcG9uZW50RGVmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgICBpbml0Q29tcG9uZW50KGNvbXBvbmVudERlZiwgaG9zdCk7XG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFja0NvbXBvbmVudChjb21wb25lbnREZWYpIHtcbiAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudERlZi5fX19jb21wb25lbnQ7XG4gIGlmIChjb21wb25lbnQpIHtcbiAgICBjb21wb25lbnRMb29rdXBbY29tcG9uZW50LmlkXSA9IGNvbXBvbmVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlJbnZva2UoZm4pIHtcbiAgaWYgKGZuKSBmbigpO1xufVxuXG5leHBvcnRzLnIgPSByZWdpc3RlcjtcbmV4cG9ydHMuX19fY3JlYXRlQ29tcG9uZW50ID0gY3JlYXRlQ29tcG9uZW50O1xuZXhwb3J0cy5fX19nZXRDb21wb25lbnRDbGFzcyA9IGdldENvbXBvbmVudENsYXNzO1xuZXhwb3J0cy5fX19pbml0U2VydmVyUmVuZGVyZWQgPSB3aW4uJGluaXRDb21wb25lbnRzID0gaW5pdFNlcnZlclJlbmRlcmVkO1xuXG5yZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudHNDb250ZXh0XCIpLl9fX2luaXRDbGllbnRSZW5kZXJlZCA9XG4gIGluaXRDbGllbnRSZW5kZXJlZDtcbiIsInZhciBkb21EYXRhID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9kb20tZGF0YVwiKTtcbnZhciBjb21wb25lbnRzQnlET01Ob2RlID0gZG9tRGF0YS5fX19jb21wb25lbnRCeURPTU5vZGU7XG52YXIga2V5c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fa2V5QnlET01Ob2RlO1xudmFyIHZFbGVtZW50c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fdkVsZW1lbnRCeURPTU5vZGU7XG52YXIgdlByb3BzQnlET01Ob2RlID0gZG9tRGF0YS5fX192UHJvcHNCeURPTU5vZGU7XG52YXIgbWFya29VSUQgPSB3aW5kb3cuJE1VSUQgfHwgKHdpbmRvdy4kTVVJRCA9IHsgaTogMCB9KTtcbnZhciBydW50aW1lSWQgPSBtYXJrb1VJRC5pKys7XG5cbnZhciBjb21wb25lbnRMb29rdXAgPSB7fTtcblxudmFyIEVNUFRZX09CSkVDVCA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRGb3JFbChlbCwgaG9zdCkge1xuICB2YXIgbm9kZSA9XG4gICAgdHlwZW9mIGVsID09IFwic3RyaW5nXCJcbiAgICAgID8gKChob3N0ID8gaG9zdC5vd25lckRvY3VtZW50IDogaG9zdCkgfHwgZG9jdW1lbnQpLmdldEVsZW1lbnRCeUlkKGVsKVxuICAgICAgOiBlbDtcbiAgdmFyIGNvbXBvbmVudDtcbiAgdmFyIHZFbGVtZW50O1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgaWYgKG5vZGUuZnJhZ21lbnQpIHtcbiAgICAgIGlmIChub2RlLmZyYWdtZW50LmVuZE5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZnJhZ21lbnQuc3RhcnROb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZnJhZ21lbnQ7XG4gICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KG5vZGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKHZFbGVtZW50ID0gdkVsZW1lbnRzQnlET01Ob2RlLmdldChub2RlKSkpIHtcbiAgICAgIGNvbXBvbmVudCA9IHZFbGVtZW50Ll9fX293bmVyQ29tcG9uZW50O1xuICAgIH1cblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxuXG4gICAgbm9kZSA9IG5vZGUucHJldmlvdXNTaWJsaW5nIHx8IG5vZGUucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZShub2RlKSB7XG4gIHZhciBjb21wb25lbnRUb0Rlc3Ryb3kgPSBjb21wb25lbnRzQnlET01Ob2RlLmdldChub2RlLmZyYWdtZW50IHx8IG5vZGUpO1xuICBpZiAoY29tcG9uZW50VG9EZXN0cm95KSB7XG4gICAgY29tcG9uZW50VG9EZXN0cm95Ll9fX2Rlc3Ryb3lTaGFsbG93KCk7XG4gICAgZGVsZXRlIGNvbXBvbmVudExvb2t1cFtjb21wb25lbnRUb0Rlc3Ryb3kuaWRdO1xuICB9XG59XG5mdW5jdGlvbiBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShub2RlLCBjb21wb25lbnQpIHtcbiAgZGVzdHJveUNvbXBvbmVudEZvck5vZGUobm9kZSk7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUubm9kZVR5cGUgPT09IDEyKSB7XG4gICAgdmFyIGtleTtcblxuICAgIGlmIChjb21wb25lbnQgJiYgKGtleSA9IGtleXNCeURPTU5vZGUuZ2V0KG5vZGUpKSkge1xuICAgICAgaWYgKG5vZGUgPT09IGNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2tleV0pIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KG5vZGUpICYmIC9cXFtcXF0kLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICBkZWxldGUgY29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNba2V5XVtcbiAgICAgICAgICAgIGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KG5vZGUpLmlkXG4gICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY3VyQ2hpbGQgJiYgY3VyQ2hpbGQgIT09IG5vZGUuZW5kTm9kZSkge1xuICAgICAgZGVzdHJveU5vZGVSZWN1cnNpdmUoY3VyQ2hpbGQsIGNvbXBvbmVudCk7XG4gICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBuZXh0Q29tcG9uZW50SWQoKSB7XG4gIC8vIEVhY2ggY29tcG9uZW50IHdpbGwgZ2V0IGFuIElEIHRoYXQgaXMgdW5pcXVlIGFjcm9zcyBhbGwgbG9hZGVkXG4gIC8vIG1hcmtvIHJ1bnRpbWVzLiBUaGlzIGFsbG93cyBtdWx0aXBsZSBpbnN0YW5jZXMgb2YgbWFya28gdG8gYmVcbiAgLy8gbG9hZGVkIGluIHRoZSBzYW1lIHdpbmRvdyBhbmQgdGhleSBzaG91bGQgYWxsIHBsYWNlIG5pY2VcbiAgLy8gdG9nZXRoZXJcbiAgcmV0dXJuIFwiY1wiICsgbWFya29VSUQuaSsrO1xufVxuXG5mdW5jdGlvbiBuZXh0Q29tcG9uZW50SWRQcm92aWRlcigpIHtcbiAgcmV0dXJuIG5leHRDb21wb25lbnRJZDtcbn1cblxuZnVuY3Rpb24gYXR0YWNoQnViYmxpbmdFdmVudChcbiAgY29tcG9uZW50RGVmLFxuICBoYW5kbGVyTWV0aG9kTmFtZSxcbiAgaXNPbmNlLFxuICBleHRyYUFyZ3Ncbikge1xuICBpZiAoaGFuZGxlck1ldGhvZE5hbWUpIHtcbiAgICB2YXIgY29tcG9uZW50SWQgPSBjb21wb25lbnREZWYuaWQ7XG4gICAgaWYgKGV4dHJhQXJncykge1xuICAgICAgcmV0dXJuIFtoYW5kbGVyTWV0aG9kTmFtZSwgY29tcG9uZW50SWQsIGlzT25jZSwgZXh0cmFBcmdzXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtoYW5kbGVyTWV0aG9kTmFtZSwgY29tcG9uZW50SWQsIGlzT25jZV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1hcmtvUHJvcHNGcm9tRWwoZWwpIHtcbiAgdmFyIHZFbGVtZW50ID0gdkVsZW1lbnRzQnlET01Ob2RlLmdldChlbCk7XG4gIHZhciB2aXJ0dWFsUHJvcHM7XG5cbiAgaWYgKHZFbGVtZW50KSB7XG4gICAgdmlydHVhbFByb3BzID0gdkVsZW1lbnQuX19fcHJvcGVydGllcztcbiAgfSBlbHNlIHtcbiAgICB2aXJ0dWFsUHJvcHMgPSB2UHJvcHNCeURPTU5vZGUuZ2V0KGVsKTtcbiAgICBpZiAoIXZpcnR1YWxQcm9wcykge1xuICAgICAgdmlydHVhbFByb3BzID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1tYXJrb1wiKTtcbiAgICAgIHZQcm9wc0J5RE9NTm9kZS5zZXQoXG4gICAgICAgIGVsLFxuICAgICAgICAodmlydHVhbFByb3BzID0gdmlydHVhbFByb3BzID8gSlNPTi5wYXJzZSh2aXJ0dWFsUHJvcHMpIDogRU1QVFlfT0JKRUNUKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmlydHVhbFByb3BzO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVDb21wb25lbnRLZXkoa2V5LCBwYXJlbnRJZCkge1xuICBpZiAoa2V5WzBdID09PSBcIiNcIikge1xuICAgIGtleSA9IGtleS5yZXBsYWNlKFwiI1wiICsgcGFyZW50SWQgKyBcIi1cIiwgXCJcIik7XG4gIH1cbiAgcmV0dXJuIGtleTtcbn1cblxuZnVuY3Rpb24gYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyhcbiAga2V5ZWRFbGVtZW50cyxcbiAga2V5LFxuICByb290Tm9kZSxcbiAgY29tcG9uZW50SWRcbikge1xuICBpZiAoL1xcW1xcXSQvLnRlc3Qoa2V5KSkge1xuICAgIHZhciByZXBlYXRlZEVsZW1lbnRzRm9yS2V5ID0gKGtleWVkRWxlbWVudHNba2V5XSA9XG4gICAgICBrZXllZEVsZW1lbnRzW2tleV0gfHwge30pO1xuICAgIHJlcGVhdGVkRWxlbWVudHNGb3JLZXlbY29tcG9uZW50SWRdID0gcm9vdE5vZGU7XG4gIH0gZWxzZSB7XG4gICAga2V5ZWRFbGVtZW50c1trZXldID0gcm9vdE5vZGU7XG4gIH1cbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuaWYgKFwiTUFSS09fREVCVUdcIikge1xuICB2YXIgd2Fybk5vZGVSZW1vdmVkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGZyYWdtZW50ID0gZXZlbnQudGFyZ2V0LmZyYWdtZW50O1xuICAgIGlmIChmcmFnbWVudCkge1xuICAgICAgdmFyIGJhc2VFcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgXCJGcmFnbWVudCBib3VuZGFyeSBtYXJrZXIgcmVtb3ZlZC4gIFRoaXMgd2lsbCBjYXVzZSBhbiBlcnJvciB3aGVuIHRoZSBmcmFnbWVudCBpcyB1cGRhdGVkLlwiXG4gICAgICApO1xuICAgICAgZnJhZ21lbnQuX19fbWFya2Vyc1JlbW92ZWRFcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlICsgXCIgQm91bmRhcnkgbWFya2VycyBtaXNzaW5nLlwiKTtcblxuICAgICAgICBiYXNlRXJyb3Iuc3RhY2sgPSBiYXNlRXJyb3Iuc3RhY2sucmVwbGFjZSgvLip3YXJuTm9kZVJlbW92ZWQuKlxcbi8sIFwiXCIpO1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUud2FybihiYXNlRXJyb3IpO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbiAgZXhwb3J0cy5fX19zdGFydERPTU1hbmlwdWxhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAoaG9zdCkge1xuICAgIGhvc3QuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVSZW1vdmVkXCIsIHdhcm5Ob2RlUmVtb3ZlZCk7XG4gIH07XG4gIGV4cG9ydHMuX19fc3RvcERPTU1hbmlwdWxhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAoaG9zdCkge1xuICAgIGhvc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVSZW1vdmVkXCIsIHdhcm5Ob2RlUmVtb3ZlZCk7XG4gIH07XG59XG5cbmV4cG9ydHMuX19fcnVudGltZUlkID0gcnVudGltZUlkO1xuZXhwb3J0cy5fX19jb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRMb29rdXA7XG5leHBvcnRzLl9fX2dldENvbXBvbmVudEZvckVsID0gZ2V0Q29tcG9uZW50Rm9yRWw7XG5leHBvcnRzLl9fX2Rlc3Ryb3lDb21wb25lbnRGb3JOb2RlID0gZGVzdHJveUNvbXBvbmVudEZvck5vZGU7XG5leHBvcnRzLl9fX2Rlc3Ryb3lOb2RlUmVjdXJzaXZlID0gZGVzdHJveU5vZGVSZWN1cnNpdmU7XG5leHBvcnRzLl9fX25leHRDb21wb25lbnRJZFByb3ZpZGVyID0gbmV4dENvbXBvbmVudElkUHJvdmlkZXI7XG5leHBvcnRzLl9fX2F0dGFjaEJ1YmJsaW5nRXZlbnQgPSBhdHRhY2hCdWJibGluZ0V2ZW50O1xuZXhwb3J0cy5fX19nZXRNYXJrb1Byb3BzRnJvbUVsID0gZ2V0TWFya29Qcm9wc0Zyb21FbDtcbmV4cG9ydHMuX19fYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyA9IGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHM7XG5leHBvcnRzLl9fX25vcm1hbGl6ZUNvbXBvbmVudEtleSA9IG5vcm1hbGl6ZUNvbXBvbmVudEtleTtcbiIsIlwidXNlIHN0cmljdFwiO1xubG9hZC5lID0gZXhpc3RzO1xubW9kdWxlLmV4cG9ydHMgPSBsb2FkO1xuXG5mdW5jdGlvbiBsb2FkKGlkKSB7XG4gIHJldHVybiBpbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKSk7XG59XG5cbmZ1bmN0aW9uIGV4aXN0cygpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpbnRlcm9wUmVxdWlyZShtb2QpIHtcbiAgcmV0dXJuIG1vZC5kZWZhdWx0IHx8IG1vZDtcbn1cbiIsInZhciBxdWV1ZSA9IFtdO1xudmFyIG1zZyA9IFwiXCIgKyBNYXRoLnJhbmRvbSgpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldikge1xuICBpZiAoZXYuZGF0YSA9PT0gbXNnKSB7XG4gICAgdmFyIGNhbGxiYWNrcyA9IHF1ZXVlO1xuICAgIHF1ZXVlID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbGxiYWNrc1tpXSgpO1xuICAgIH1cbiAgfVxufSk7XG5cbmV4cG9ydHMuX19fc2V0SW1tZWRpYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmIChxdWV1ZS5wdXNoKGNhbGxiYWNrKSA9PT0gMSkge1xuICAgIHdpbmRvdy5wb3N0TWVzc2FnZShtc2csIFwiKlwiKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX19xdWV1ZU1pY3JvdGFzayA9IHJlcXVpcmUoXCIuL3F1ZXVlTWljcm90YXNrXCIpO1xuIiwidmFyIHByb21pc2U7XG5tb2R1bGUuZXhwb3J0cyA9XG4gIHR5cGVvZiBxdWV1ZU1pY3JvdGFzayA9PT0gXCJmdW5jdGlvblwiXG4gICAgPyBxdWV1ZU1pY3JvdGFza1xuICAgIDogKChwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkpLFxuICAgICAgZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIHByb21pc2UudGhlbihjYik7XG4gICAgICB9KTtcbiIsInZhciBkb21JbnNlcnQgPSByZXF1aXJlKFwiLi9kb20taW5zZXJ0XCIpO1xudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcblxuZnVuY3Rpb24gZ2V0Um9vdE5vZGUoZWwpIHtcbiAgdmFyIGN1ciA9IGVsO1xuICB3aGlsZSAoY3VyLnBhcmVudE5vZGUpIGN1ciA9IGN1ci5wYXJlbnROb2RlO1xuICByZXR1cm4gY3VyO1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnREZWZzKHJlc3VsdCkge1xuICB2YXIgY29tcG9uZW50RGVmcyA9IHJlc3VsdC5fX19jb21wb25lbnRzO1xuXG4gIGlmICghY29tcG9uZW50RGVmcykge1xuICAgIHRocm93IEVycm9yKFwiTm8gY29tcG9uZW50XCIpO1xuICB9XG4gIHJldHVybiBjb21wb25lbnREZWZzO1xufVxuXG5mdW5jdGlvbiBSZW5kZXJSZXN1bHQob3V0KSB7XG4gIHRoaXMub3V0ID0gdGhpcy5fX19vdXQgPSBvdXQ7XG4gIHRoaXMuX19fY29tcG9uZW50cyA9IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJSZXN1bHQ7XG5cbnZhciBwcm90byA9IChSZW5kZXJSZXN1bHQucHJvdG90eXBlID0ge1xuICBnZXRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnRzKClbMF07XG4gIH0sXG4gIGdldENvbXBvbmVudHM6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgIGlmICh0aGlzLl9fX2NvbXBvbmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJOb3QgYWRkZWQgdG8gRE9NXCIpO1xuICAgIH1cblxuICAgIHZhciBjb21wb25lbnREZWZzID0gZ2V0Q29tcG9uZW50RGVmcyh0aGlzKTtcblxuICAgIHZhciBjb21wb25lbnRzID0gW107XG5cbiAgICBjb21wb25lbnREZWZzLmZvckVhY2goZnVuY3Rpb24gKGNvbXBvbmVudERlZikge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudERlZi5fX19jb21wb25lbnQ7XG4gICAgICBpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yKGNvbXBvbmVudCkpIHtcbiAgICAgICAgY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29tcG9uZW50cztcbiAgfSxcblxuICBhZnRlckluc2VydDogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICB2YXIgb3V0ID0gdGhpcy5fX19vdXQ7XG4gICAgdmFyIGNvbXBvbmVudHNDb250ZXh0ID0gb3V0Ll9fX2NvbXBvbmVudHM7XG4gICAgaWYgKGNvbXBvbmVudHNDb250ZXh0KSB7XG4gICAgICB0aGlzLl9fX2NvbXBvbmVudHMgPSBjb21wb25lbnRzQ29udGV4dC5fX19pbml0Q29tcG9uZW50cyhob3N0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX19jb21wb25lbnRzID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgZ2V0Tm9kZTogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICByZXR1cm4gdGhpcy5fX19vdXQuX19fZ2V0Tm9kZShob3N0KTtcbiAgfSxcbiAgZ2V0T3V0cHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fb3V0Ll9fX2dldE91dHB1dCgpO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX291dC50b1N0cmluZygpO1xuICB9LFxuICBkb2N1bWVudDogdHlwZW9mIGRvY3VtZW50ID09PSBcIm9iamVjdFwiICYmIGRvY3VtZW50LFxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgXCJodG1sXCIsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICAnVGhlIFwiaHRtbFwiIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgXCJ0b1N0cmluZ1wiIGluc3RlYWQuJyxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH0sXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBcImNvbnRleHRcIiwge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgY29tcGxhaW4oXG4gICAgICAgICdUaGUgXCJjb250ZXh0XCIgcHJvcGVydHkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBcIm91dFwiIGluc3RlYWQuJyxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fX291dDtcbiAgfSxcbn0pO1xuXG4vLyBBZGQgYWxsIG9mIHRoZSBmb2xsb3dpbmcgRE9NIG1ldGhvZHMgdG8gQ29tcG9uZW50LnByb3RvdHlwZTpcbi8vIC0gYXBwZW5kVG8ocmVmZXJlbmNlRWwpXG4vLyAtIHJlcGxhY2UocmVmZXJlbmNlRWwpXG4vLyAtIHJlcGxhY2VDaGlsZHJlbk9mKHJlZmVyZW5jZUVsKVxuLy8gLSBpbnNlcnRCZWZvcmUocmVmZXJlbmNlRWwpXG4vLyAtIGluc2VydEFmdGVyKHJlZmVyZW5jZUVsKVxuLy8gLSBwcmVwZW5kVG8ocmVmZXJlbmNlRWwpXG5kb21JbnNlcnQoXG4gIHByb3RvLFxuICBmdW5jdGlvbiBnZXRFbChyZW5kZXJSZXN1bHQsIHJlZmVyZW5jZUVsKSB7XG4gICAgcmV0dXJuIHJlbmRlclJlc3VsdC5nZXROb2RlKGdldFJvb3ROb2RlKHJlZmVyZW5jZUVsKSk7XG4gIH0sXG4gIGZ1bmN0aW9uIGFmdGVySW5zZXJ0KHJlbmRlclJlc3VsdCwgcmVmZXJlbmNlRWwpIHtcbiAgICByZXR1cm4gcmVuZGVyUmVzdWx0LmFmdGVySW5zZXJ0KGdldFJvb3ROb2RlKHJlZmVyZW5jZUVsKSk7XG4gIH0sXG4pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG5cbnZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50cy1saWdodFwiKTtcbnZhciBTdWJzY3JpcHRpb25UcmFja2VyID0gcmVxdWlyZShcImxpc3RlbmVyLXRyYWNrZXJcIik7XG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xudmFyIGRlc3Ryb3lOb2RlUmVjdXJzaXZlID0gY29tcG9uZW50c1V0aWwuX19fZGVzdHJveU5vZGVSZWN1cnNpdmU7XG52YXIgZGVmYXVsdENyZWF0ZU91dCA9IHJlcXVpcmUoXCIuLi9jcmVhdGVPdXRcIik7XG52YXIgZG9tSW5zZXJ0ID0gcmVxdWlyZShcIi4uL2RvbS1pbnNlcnRcIik7XG52YXIgUmVuZGVyUmVzdWx0ID0gcmVxdWlyZShcIi4uL1JlbmRlclJlc3VsdFwiKTtcbnZhciBtb3JwaGRvbSA9IHJlcXVpcmUoXCIuLi92ZG9tL21vcnBoZG9tXCIpO1xudmFyIGdldENvbXBvbmVudHNDb250ZXh0ID1cbiAgcmVxdWlyZShcIi4vQ29tcG9uZW50c0NvbnRleHRcIikuX19fZ2V0Q29tcG9uZW50c0NvbnRleHQ7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuL2RvbS1kYXRhXCIpO1xudmFyIGV2ZW50RGVsZWdhdGlvbiA9IHJlcXVpcmUoXCIuL2V2ZW50LWRlbGVnYXRpb25cIik7XG52YXIgdXBkYXRlTWFuYWdlciA9IHJlcXVpcmUoXCIuL3VwZGF0ZS1tYW5hZ2VyXCIpO1xudmFyIGNvbXBvbmVudHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2NvbXBvbmVudEJ5RE9NTm9kZTtcbnZhciBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZCA9IGRvbURhdGEuX19fc3NyS2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWQ7XG52YXIgQ09OVEVYVF9LRVkgPSBcIl9fc3VidHJlZV9jb250ZXh0X19cIjtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxudmFyIENPTVBPTkVOVF9TVUJTQ1JJQkVfVE9fT1BUSU9OUztcbnZhciBOT05fQ09NUE9ORU5UX1NVQlNDUklCRV9UT19PUFRJT05TID0ge1xuICBhZGREZXN0cm95TGlzdGVuZXI6IGZhbHNlLFxufTtcblxudmFyIGVtaXQgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQ7XG52YXIgRUxFTUVOVF9OT0RFID0gMTtcblxuZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIocmVtb3ZlRXZlbnRMaXN0ZW5lckhhbmRsZSkge1xuICByZW1vdmVFdmVudExpc3RlbmVySGFuZGxlKCk7XG59XG5cbmZ1bmN0aW9uIHdhbGtGcmFnbWVudHMoZnJhZ21lbnQpIHtcbiAgdmFyIG5vZGU7XG5cbiAgd2hpbGUgKGZyYWdtZW50KSB7XG4gICAgbm9kZSA9IGZyYWdtZW50LmZpcnN0Q2hpbGQ7XG5cbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGZyYWdtZW50ID0gbm9kZS5mcmFnbWVudDtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDdXN0b21FdmVudFdpdGhNZXRob2RMaXN0ZW5lcihcbiAgY29tcG9uZW50LFxuICB0YXJnZXRNZXRob2ROYW1lLFxuICBhcmdzLFxuICBleHRyYUFyZ3MsXG4pIHtcbiAgLy8gUmVtb3ZlIHRoZSBcImV2ZW50VHlwZVwiIGFyZ3VtZW50XG4gIGFyZ3MucHVzaChjb21wb25lbnQpO1xuXG4gIGlmIChleHRyYUFyZ3MpIHtcbiAgICBhcmdzID0gZXh0cmFBcmdzLmNvbmNhdChhcmdzKTtcbiAgfVxuXG4gIHZhciB0YXJnZXRDb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbY29tcG9uZW50Ll9fX3Njb3BlXTtcbiAgdmFyIHRhcmdldE1ldGhvZCA9XG4gICAgdHlwZW9mIHRhcmdldE1ldGhvZE5hbWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyB0YXJnZXRNZXRob2ROYW1lXG4gICAgICA6IHRhcmdldENvbXBvbmVudFt0YXJnZXRNZXRob2ROYW1lXTtcbiAgaWYgKCF0YXJnZXRNZXRob2QpIHtcbiAgICB0aHJvdyBFcnJvcihcIk1ldGhvZCBub3QgZm91bmQ6IFwiICsgdGFyZ2V0TWV0aG9kTmFtZSk7XG4gIH1cblxuICB0YXJnZXRNZXRob2QuYXBwbHkodGFyZ2V0Q29tcG9uZW50LCBhcmdzKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUtleUhlbHBlcihrZXksIGluZGV4KSB7XG4gIHJldHVybiBpbmRleCA/IGtleSArIFwiX1wiICsgaW5kZXggOiBrZXk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVDb21wb25lbnRJZEhlbHBlcihjb21wb25lbnQsIGtleSwgaW5kZXgpIHtcbiAgcmV0dXJuIGNvbXBvbmVudC5pZCArIFwiLVwiICsgcmVzb2x2ZUtleUhlbHBlcihrZXksIGluZGV4KTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIHByb2Nlc3MgXCJ1cGRhdGVfPHN0YXRlTmFtZT5cIiBoYW5kbGVyIGZ1bmN0aW9ucy5cbiAqIElmIGFsbCBvZiB0aGUgbW9kaWZpZWQgc3RhdGUgcHJvcGVydGllcyBoYXZlIGEgdXNlciBwcm92aWRlZCB1cGRhdGUgaGFuZGxlclxuICogdGhlbiBhIHJlcmVuZGVyIHdpbGwgYmUgYnlwYXNzZWQgYW5kLCBpbnN0ZWFkLCB0aGUgRE9NIHdpbGwgYmUgdXBkYXRlZFxuICogbG9vcGluZyBvdmVyIGFuZCBpbnZva2luZyB0aGUgY3VzdG9tIHVwZGF0ZSBoYW5kbGVycy5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpZiB0aGUgRE9NIHdhcyB1cGRhdGVkLiBGYWxzZSwgb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBwcm9jZXNzVXBkYXRlSGFuZGxlcnMoY29tcG9uZW50LCBzdGF0ZUNoYW5nZXMsIG9sZFN0YXRlKSB7XG4gIHZhciBoYW5kbGVyTWV0aG9kO1xuICB2YXIgaGFuZGxlcnM7XG5cbiAgZm9yICh2YXIgcHJvcE5hbWUgaW4gc3RhdGVDaGFuZ2VzKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc3RhdGVDaGFuZ2VzLCBwcm9wTmFtZSkpIHtcbiAgICAgIHZhciBoYW5kbGVyTWV0aG9kTmFtZSA9IFwidXBkYXRlX1wiICsgcHJvcE5hbWU7XG5cbiAgICAgIGhhbmRsZXJNZXRob2QgPSBjb21wb25lbnRbaGFuZGxlck1ldGhvZE5hbWVdO1xuICAgICAgaWYgKGhhbmRsZXJNZXRob2QpIHtcbiAgICAgICAgKGhhbmRsZXJzIHx8IChoYW5kbGVycyA9IFtdKSkucHVzaChbcHJvcE5hbWUsIGhhbmRsZXJNZXRob2RdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgc3RhdGUgY2hhbmdlIGRvZXMgbm90IGhhdmUgYSBzdGF0ZSBoYW5kbGVyIHNvIHJldHVybiBmYWxzZVxuICAgICAgICAvLyB0byBmb3JjZSBhIHJlcmVuZGVyXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiB3ZSBnb3QgaGVyZSB0aGVuIGFsbCBvZiB0aGUgY2hhbmdlZCBzdGF0ZSBwcm9wZXJ0aWVzIGhhdmVcbiAgLy8gYW4gdXBkYXRlIGhhbmRsZXIgb3IgdGhlcmUgYXJlIG5vIHN0YXRlIHByb3BlcnRpZXMgdGhhdCBhY3R1YWxseVxuICAvLyBjaGFuZ2VkLlxuICBpZiAoaGFuZGxlcnMpIHtcbiAgICAvLyBPdGhlcndpc2UsIHRoZXJlIGFyZSBoYW5kbGVycyBmb3IgYWxsIG9mIHRoZSBjaGFuZ2VkIHByb3BlcnRpZXNcbiAgICAvLyBzbyBhcHBseSB0aGUgdXBkYXRlcyB1c2luZyB0aG9zZSBoYW5kbGVyc1xuXG4gICAgaGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IGhhbmRsZXJbMF07XG4gICAgICBoYW5kbGVyTWV0aG9kID0gaGFuZGxlclsxXTtcblxuICAgICAgdmFyIG5ld1ZhbHVlID0gc3RhdGVDaGFuZ2VzW3Byb3BlcnR5TmFtZV07XG4gICAgICB2YXIgb2xkVmFsdWUgPSBvbGRTdGF0ZVtwcm9wZXJ0eU5hbWVdO1xuICAgICAgaGFuZGxlck1ldGhvZC5jYWxsKGNvbXBvbmVudCwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICB9KTtcblxuICAgIGNvbXBvbmVudC5fX19lbWl0VXBkYXRlKCk7XG4gICAgY29tcG9uZW50Ll9fX3Jlc2V0KCk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnB1dENoYW5nZWQoZXhpc3RpbmdDb21wb25lbnQsIG9sZElucHV0LCBuZXdJbnB1dCkge1xuICBpZiAob2xkSW5wdXQgIT0gbmV3SW5wdXQpIHtcbiAgICBpZiAob2xkSW5wdXQgPT0gbnVsbCB8fCBuZXdJbnB1dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgb2xkS2V5cyA9IE9iamVjdC5rZXlzKG9sZElucHV0KTtcbiAgICB2YXIgbmV3S2V5cyA9IE9iamVjdC5rZXlzKG5ld0lucHV0KTtcbiAgICB2YXIgbGVuID0gb2xkS2V5cy5sZW5ndGg7XG4gICAgaWYgKGxlbiAhPT0gbmV3S2V5cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSBsZW47IGktLTsgKSB7XG4gICAgICB2YXIga2V5ID0gb2xkS2V5c1tpXTtcbiAgICAgIGlmICghKGtleSBpbiBuZXdJbnB1dCAmJiBvbGRJbnB1dFtrZXldID09PSBuZXdJbnB1dFtrZXldKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbnZhciBjb21wb25lbnRQcm90bztcblxuLyoqXG4gKiBCYXNlIGNvbXBvbmVudCB0eXBlLlxuICpcbiAqIE5PVEU6IEFueSBtZXRob2RzIHRoYXQgYXJlIHByZWZpeGVkIHdpdGggYW4gdW5kZXJzY29yZSBzaG91bGQgYmUgY29uc2lkZXJlZCBwcml2YXRlIVxuICovXG5mdW5jdGlvbiBDb21wb25lbnQoaWQpIHtcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuaWQgPSBpZDtcbiAgdGhpcy5fX19zdGF0ZSA9IG51bGw7XG4gIHRoaXMuX19fcm9vdE5vZGUgPSBudWxsO1xuICB0aGlzLl9fX3N1YnNjcmlwdGlvbnMgPSBudWxsO1xuICB0aGlzLl9fX2RvbUV2ZW50TGlzdGVuZXJIYW5kbGVzID0gbnVsbDtcbiAgdGhpcy5fX19idWJibGluZ0RvbUV2ZW50cyA9IG51bGw7IC8vIFVzZWQgdG8ga2VlcCB0cmFjayBvZiBidWJibGluZyBET00gZXZlbnRzIGZvciBjb21wb25lbnRzIHJlbmRlcmVkIG9uIHRoZSBzZXJ2ZXJcbiAgdGhpcy5fX19jdXN0b21FdmVudHMgPSBudWxsO1xuICB0aGlzLl9fX3Njb3BlID0gbnVsbDtcbiAgdGhpcy5fX19yZW5kZXJJbnB1dCA9IG51bGw7XG4gIHRoaXMuX19faW5wdXQgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19fbW91bnRlZCA9IGZhbHNlO1xuICB0aGlzLl9fX2dsb2JhbCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fX19kZXN0cm95ZWQgPSBmYWxzZTtcbiAgdGhpcy5fX191cGRhdGVRdWV1ZWQgPSBmYWxzZTtcbiAgdGhpcy5fX19kaXJ0eSA9IGZhbHNlO1xuICB0aGlzLl9fX3NldHRpbmdJbnB1dCA9IGZhbHNlO1xuICB0aGlzLl9fX2hvc3QgPSB1bmRlZmluZWQ7XG5cbiAgdmFyIHNzcktleWVkRWxlbWVudHMgPSBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtpZF07XG5cbiAgaWYgKHNzcktleWVkRWxlbWVudHMpIHtcbiAgICB0aGlzLl9fX2tleWVkRWxlbWVudHMgPSBzc3JLZXllZEVsZW1lbnRzO1xuICAgIGRlbGV0ZSBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtpZF07XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fX19rZXllZEVsZW1lbnRzID0ge307XG4gIH1cbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZSA9IGNvbXBvbmVudFByb3RvID0ge1xuICBfX19pc0NvbXBvbmVudDogdHJ1ZSxcblxuICBzdWJzY3JpYmVUbzogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgc3Vic2NyaXB0aW9ucyA9XG4gICAgICB0aGlzLl9fX3N1YnNjcmlwdGlvbnMgfHxcbiAgICAgICh0aGlzLl9fX3N1YnNjcmlwdGlvbnMgPSBuZXcgU3Vic2NyaXB0aW9uVHJhY2tlcigpKTtcblxuICAgIHZhciBzdWJzY3JpYmVUb09wdGlvbnMgPSB0YXJnZXQuX19faXNDb21wb25lbnRcbiAgICAgID8gQ09NUE9ORU5UX1NVQlNDUklCRV9UT19PUFRJT05TXG4gICAgICA6IE5PTl9DT01QT05FTlRfU1VCU0NSSUJFX1RPX09QVElPTlM7XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9ucy5zdWJzY3JpYmVUbyh0YXJnZXQsIHN1YnNjcmliZVRvT3B0aW9ucyk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKGV2ZW50VHlwZSkge1xuICAgIHZhciBjdXN0b21FdmVudHMgPSB0aGlzLl9fX2N1c3RvbUV2ZW50cztcbiAgICB2YXIgdGFyZ2V0O1xuXG4gICAgaWYgKGN1c3RvbUV2ZW50cyAmJiAodGFyZ2V0ID0gY3VzdG9tRXZlbnRzW2V2ZW50VHlwZV0pKSB7XG4gICAgICB2YXIgdGFyZ2V0TWV0aG9kTmFtZSA9IHRhcmdldFswXTtcbiAgICAgIHZhciBpc09uY2UgPSB0YXJnZXRbMV07XG4gICAgICB2YXIgZXh0cmFBcmdzID0gdGFyZ2V0WzJdO1xuICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgIGhhbmRsZUN1c3RvbUV2ZW50V2l0aE1ldGhvZExpc3RlbmVyKFxuICAgICAgICB0aGlzLFxuICAgICAgICB0YXJnZXRNZXRob2ROYW1lLFxuICAgICAgICBhcmdzLFxuICAgICAgICBleHRyYUFyZ3MsXG4gICAgICApO1xuXG4gICAgICBpZiAoaXNPbmNlKSB7XG4gICAgICAgIGRlbGV0ZSBjdXN0b21FdmVudHNbZXZlbnRUeXBlXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICBnZXRFbElkOiBmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgIGlmICgha2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5pZDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc29sdmVDb21wb25lbnRJZEhlbHBlcih0aGlzLCBrZXksIGluZGV4KTtcbiAgfSxcbiAgZ2V0RWw6IGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIHJlc29sdmVkS2V5ID0gcmVzb2x2ZUtleUhlbHBlcihrZXksIGluZGV4KTtcbiAgICAgIHZhciBrZXllZEVsZW1lbnQgPSB0aGlzLl9fX2tleWVkRWxlbWVudHNbXCJAXCIgKyByZXNvbHZlZEtleV07XG4gICAgICBpZiAoa2V5ZWRFbGVtZW50ICYmIGtleWVkRWxlbWVudC5ub2RlVHlwZSA9PT0gMTIgLyoqIEZSQUdNRU5UX05PREUgKi8pIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgICBcIkFjY2Vzc2luZyB0aGUgZWxlbWVudHMgb2YgYSBjaGlsZCBjb21wb25lbnQgdXNpbmcgJ2NvbXBvbmVudC5nZXRFbCcgaXMgZGVwcmVjYXRlZC5cIixcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdhbGtGcmFnbWVudHMoa2V5ZWRFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleWVkRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgfVxuICB9LFxuICBnZXRFbHM6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBrZXkgPSBrZXkgKyBcIltdXCI7XG5cbiAgICB2YXIgZWxzID0gW107XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBlbDtcbiAgICB3aGlsZSAoKGVsID0gdGhpcy5nZXRFbChrZXksIGkpKSkge1xuICAgICAgZWxzLnB1c2goZWwpO1xuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gZWxzO1xuICB9LFxuICBnZXRDb21wb25lbnQ6IGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XG4gICAgdmFyIHJvb3ROb2RlID0gdGhpcy5fX19rZXllZEVsZW1lbnRzW1wiQFwiICsgcmVzb2x2ZUtleUhlbHBlcihrZXksIGluZGV4KV07XG4gICAgaWYgKC9cXFtcXF0kLy50ZXN0KGtleSkpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgXCJBIHJlcGVhdGVkIGtleVtdIHdhcyBwYXNzZWQgdG8gZ2V0Q29tcG9uZW50LiBVc2UgYSBub24tcmVwZWF0aW5nIGtleSBpZiB0aGVyZSBpcyBvbmx5IG9uZSBvZiB0aGVzZSBjb21wb25lbnRzLlwiLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcm9vdE5vZGUgPSByb290Tm9kZSAmJiByb290Tm9kZVtPYmplY3Qua2V5cyhyb290Tm9kZSlbMF1dO1xuICAgIH1cbiAgICByZXR1cm4gcm9vdE5vZGUgJiYgY29tcG9uZW50c0J5RE9NTm9kZS5nZXQocm9vdE5vZGUpO1xuICB9LFxuICBnZXRDb21wb25lbnRzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGxvb2t1cCA9IHRoaXMuX19fa2V5ZWRFbGVtZW50c1tcIkBcIiArIGtleSArIFwiW11cIl07XG4gICAgcmV0dXJuIGxvb2t1cFxuICAgICAgPyBPYmplY3Qua2V5cyhsb29rdXApXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobG9va3VwW2tleV0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgOiBbXTtcbiAgfSxcbiAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9fX2Rlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciByb290ID0gdGhpcy5fX19yb290Tm9kZTtcblxuICAgIHRoaXMuX19fZGVzdHJveVNoYWxsb3coKTtcblxuICAgIHZhciBub2RlcyA9IHJvb3Qubm9kZXM7XG5cbiAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShub2RlKTtcblxuICAgICAgaWYgKGV2ZW50RGVsZWdhdGlvbi5fX19oYW5kbGVOb2RlRGV0YWNoKG5vZGUpICE9PSBmYWxzZSkge1xuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByb290LmRldGFjaGVkID0gdHJ1ZTtcblxuICAgIGRlbGV0ZSBjb21wb25lbnRMb29rdXBbdGhpcy5pZF07XG4gICAgdGhpcy5fX19rZXllZEVsZW1lbnRzID0ge307XG4gIH0sXG5cbiAgX19fZGVzdHJveVNoYWxsb3c6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX19kZXN0cm95ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9fX2VtaXREZXN0cm95KCk7XG4gICAgdGhpcy5fX19kZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgY29tcG9uZW50c0J5RE9NTm9kZS5zZXQodGhpcy5fX19yb290Tm9kZSwgdW5kZWZpbmVkKTtcblxuICAgIHRoaXMuX19fcm9vdE5vZGUgPSBudWxsO1xuXG4gICAgLy8gVW5zdWJzY3JpYmUgZnJvbSBhbGwgRE9NIGV2ZW50c1xuICAgIHRoaXMuX19fcmVtb3ZlRE9NRXZlbnRMaXN0ZW5lcnMoKTtcblxuICAgIHZhciBzdWJzY3JpcHRpb25zID0gdGhpcy5fX19zdWJzY3JpcHRpb25zO1xuICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICBzdWJzY3JpcHRpb25zLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgdGhpcy5fX19zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgaXNEZXN0cm95ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19kZXN0cm95ZWQ7XG4gIH0sXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19zdGF0ZTtcbiAgfSxcbiAgc2V0IHN0YXRlKG5ld1N0YXRlKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcbiAgICBpZiAoIXN0YXRlICYmICFuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghc3RhdGUpIHtcbiAgICAgIHN0YXRlID0gdGhpcy5fX19zdGF0ZSA9IG5ldyB0aGlzLl9fX1N0YXRlKHRoaXMpO1xuICAgIH1cblxuICAgIHN0YXRlLl9fX3JlcGxhY2UobmV3U3RhdGUgfHwge30pO1xuXG4gICAgaWYgKHN0YXRlLl9fX2RpcnR5KSB7XG4gICAgICB0aGlzLl9fX3F1ZXVlVXBkYXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKCFuZXdTdGF0ZSkge1xuICAgICAgdGhpcy5fX19zdGF0ZSA9IG51bGw7XG4gICAgfVxuICB9LFxuICBzZXRTdGF0ZTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmICghc3RhdGUpIHtcbiAgICAgIHN0YXRlID0gdGhpcy5fX19zdGF0ZSA9IG5ldyB0aGlzLl9fX1N0YXRlKHRoaXMpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG5hbWUgPT0gXCJvYmplY3RcIikge1xuICAgICAgLy8gTWVyZ2UgaW4gdGhlIG5ldyBzdGF0ZSB3aXRoIHRoZSBvbGQgc3RhdGVcbiAgICAgIHZhciBuZXdTdGF0ZSA9IG5hbWU7XG4gICAgICBmb3IgKHZhciBrIGluIG5ld1N0YXRlKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG5ld1N0YXRlLCBrKSkge1xuICAgICAgICAgIHN0YXRlLl9fX3NldChrLCBuZXdTdGF0ZVtrXSwgdHJ1ZSAvKiBlbnN1cmU6dHJ1ZSAqLyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuX19fc2V0KG5hbWUsIHZhbHVlLCB0cnVlIC8qIGVuc3VyZTp0cnVlICovKTtcbiAgICB9XG4gIH0sXG5cbiAgc2V0U3RhdGVEaXJ0eTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgIHZhbHVlID0gc3RhdGVbbmFtZV07XG4gICAgfVxuXG4gICAgc3RhdGUuX19fc2V0KFxuICAgICAgbmFtZSxcbiAgICAgIHZhbHVlLFxuICAgICAgdHJ1ZSAvKiBlbnN1cmU6dHJ1ZSAqLyxcbiAgICAgIHRydWUgLyogZm9yY2VEaXJ0eTp0cnVlICovLFxuICAgICk7XG4gIH0sXG5cbiAgcmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAobmV3U3RhdGUpIHtcbiAgICB0aGlzLl9fX3N0YXRlLl9fX3JlcGxhY2UobmV3U3RhdGUpO1xuICB9LFxuXG4gIGdldCBpbnB1dCgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19pbnB1dDtcbiAgfSxcbiAgc2V0IGlucHV0KG5ld0lucHV0KSB7XG4gICAgaWYgKHRoaXMuX19fc2V0dGluZ0lucHV0KSB7XG4gICAgICB0aGlzLl9fX2lucHV0ID0gbmV3SW5wdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19fc2V0SW5wdXQobmV3SW5wdXQpO1xuICAgIH1cbiAgfSxcblxuICBfX19zZXRJbnB1dDogZnVuY3Rpb24gKG5ld0lucHV0LCBvbklucHV0LCBvdXQpIHtcbiAgICBvbklucHV0ID0gb25JbnB1dCB8fCB0aGlzLm9uSW5wdXQ7XG4gICAgdmFyIHVwZGF0ZWRJbnB1dDtcblxuICAgIHZhciBvbGRJbnB1dCA9IHRoaXMuX19faW5wdXQ7XG4gICAgdGhpcy5fX19pbnB1dCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9fX2NvbnRleHQgPSAob3V0ICYmIG91dFtDT05URVhUX0tFWV0pIHx8IHRoaXMuX19fY29udGV4dDtcblxuICAgIGlmIChvbklucHV0KSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHNldCBhIGZsYWcgdG8gcHJldmlldyBgdGhpcy5pbnB1dCA9IGZvb2AgaW5zaWRlXG4gICAgICAvLyBvbklucHV0IGNhdXNpbmcgaW5maW5pdGUgcmVjdXJzaW9uXG4gICAgICB0aGlzLl9fX3NldHRpbmdJbnB1dCA9IHRydWU7XG4gICAgICB1cGRhdGVkSW5wdXQgPSBvbklucHV0LmNhbGwodGhpcywgbmV3SW5wdXQgfHwge30sIG91dCk7XG4gICAgICB0aGlzLl9fX3NldHRpbmdJbnB1dCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG5ld0lucHV0ID0gdGhpcy5fX19yZW5kZXJJbnB1dCA9IHVwZGF0ZWRJbnB1dCB8fCBuZXdJbnB1dDtcblxuICAgIGlmICgodGhpcy5fX19kaXJ0eSA9IGNoZWNrSW5wdXRDaGFuZ2VkKHRoaXMsIG9sZElucHV0LCBuZXdJbnB1dCkpKSB7XG4gICAgICB0aGlzLl9fX3F1ZXVlVXBkYXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX19faW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fX19pbnB1dCA9IG5ld0lucHV0O1xuICAgICAgaWYgKG5ld0lucHV0ICYmIG5ld0lucHV0LiRnbG9iYWwpIHtcbiAgICAgICAgdGhpcy5fX19nbG9iYWwgPSBuZXdJbnB1dC4kZ2xvYmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdJbnB1dDtcbiAgfSxcblxuICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX19fZGlydHkgPSB0cnVlO1xuICAgIHRoaXMuX19fcXVldWVVcGRhdGUoKTtcbiAgfSxcblxuICBfX19xdWV1ZVVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fX191cGRhdGVRdWV1ZWQpIHtcbiAgICAgIHRoaXMuX19fdXBkYXRlUXVldWVkID0gdHJ1ZTtcbiAgICAgIHVwZGF0ZU1hbmFnZXIuX19fcXVldWVDb21wb25lbnRVcGRhdGUodGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9fX2Rlc3Ryb3llZCA9PT0gdHJ1ZSB8fCB0aGlzLl9fX2lzRGlydHkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGlucHV0ID0gdGhpcy5fX19pbnB1dDtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKHRoaXMuX19fZGlydHkgPT09IGZhbHNlICYmIHN0YXRlICE9PSBudWxsICYmIHN0YXRlLl9fX2RpcnR5ID09PSB0cnVlKSB7XG4gICAgICBpZiAocHJvY2Vzc1VwZGF0ZUhhbmRsZXJzKHRoaXMsIHN0YXRlLl9fX2NoYW5nZXMsIHN0YXRlLl9fX29sZCwgc3RhdGUpKSB7XG4gICAgICAgIHN0YXRlLl9fX2RpcnR5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX19faXNEaXJ0eSA9PT0gdHJ1ZSkge1xuICAgICAgLy8gVGhlIFVJIGNvbXBvbmVudCBpcyBzdGlsbCBkaXJ0eSBhZnRlciBwcm9jZXNzIHN0YXRlIGhhbmRsZXJzXG4gICAgICAvLyB0aGVuIHdlIHNob3VsZCByZXJlbmRlclxuXG4gICAgICBpZiAodGhpcy5zaG91bGRVcGRhdGUoaW5wdXQsIHN0YXRlKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fX19zY2hlZHVsZVJlcmVuZGVyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fX19yZXNldCgpO1xuICB9LFxuXG4gIGdldCBfX19pc0RpcnR5KCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9fX2RpcnR5ID09PSB0cnVlIHx8XG4gICAgICAodGhpcy5fX19zdGF0ZSAhPT0gbnVsbCAmJiB0aGlzLl9fX3N0YXRlLl9fX2RpcnR5ID09PSB0cnVlKVxuICAgICk7XG4gIH0sXG5cbiAgX19fcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9fX2RpcnR5ID0gZmFsc2U7XG4gICAgdGhpcy5fX191cGRhdGVRdWV1ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9fX3JlbmRlcklucHV0ID0gbnVsbDtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuICAgIGlmIChzdGF0ZSkge1xuICAgICAgc3RhdGUuX19fcmVzZXQoKTtcbiAgICB9XG4gIH0sXG5cbiAgc2hvdWxkVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgX19fc2NoZWR1bGVSZXJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVuZGVyZXIgPSBzZWxmLl9fX3JlbmRlcmVyO1xuXG4gICAgaWYgKCFyZW5kZXJlcikge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuXG4gICAgdmFyIGlucHV0ID0gdGhpcy5fX19yZW5kZXJJbnB1dCB8fCB0aGlzLl9fX2lucHV0O1xuXG4gICAgdXBkYXRlTWFuYWdlci5fX19iYXRjaFVwZGF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9fX3JlcmVuZGVyKGlucHV0LCBmYWxzZSkuYWZ0ZXJJbnNlcnQoc2VsZi5fX19ob3N0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX19fcmVzZXQoKTtcbiAgfSxcblxuICBfX19yZXJlbmRlcjogZnVuY3Rpb24gKGlucHV0LCBpc0h5ZHJhdGUpIHtcbiAgICB2YXIgaG9zdCA9IHRoaXMuX19faG9zdDtcbiAgICB2YXIgZ2xvYmFsRGF0YSA9IHRoaXMuX19fZ2xvYmFsO1xuICAgIHZhciByb290Tm9kZSA9IHRoaXMuX19fcm9vdE5vZGU7XG4gICAgdmFyIHJlbmRlcmVyID0gdGhpcy5fX19yZW5kZXJlcjtcbiAgICB2YXIgY3JlYXRlT3V0ID0gcmVuZGVyZXIuY3JlYXRlT3V0IHx8IGRlZmF1bHRDcmVhdGVPdXQ7XG4gICAgdmFyIG91dCA9IGNyZWF0ZU91dChnbG9iYWxEYXRhKTtcbiAgICBvdXQuc3luYygpO1xuICAgIG91dC5fX19ob3N0ID0gdGhpcy5fX19ob3N0O1xuICAgIG91dFtDT05URVhUX0tFWV0gPSB0aGlzLl9fX2NvbnRleHQ7XG5cbiAgICB2YXIgY29tcG9uZW50c0NvbnRleHQgPSBnZXRDb21wb25lbnRzQ29udGV4dChvdXQpO1xuICAgIHZhciBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQ7XG4gICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVyZW5kZXJDb21wb25lbnQgPSB0aGlzO1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX2lzSHlkcmF0ZSA9IGlzSHlkcmF0ZTtcblxuICAgIHJlbmRlcmVyKGlucHV0LCBvdXQpO1xuXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBSZW5kZXJSZXN1bHQob3V0KTtcblxuICAgIHZhciB0YXJnZXROb2RlID0gb3V0Ll9fX2dldE91dHB1dCgpLl9fX2ZpcnN0Q2hpbGQ7XG5cbiAgICBtb3JwaGRvbShyb290Tm9kZSwgdGFyZ2V0Tm9kZSwgaG9zdCwgY29tcG9uZW50c0NvbnRleHQpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBfX19kZXRhY2g6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcm9vdCA9IHRoaXMuX19fcm9vdE5vZGU7XG4gICAgcm9vdC5yZW1vdmUoKTtcbiAgICByZXR1cm4gcm9vdDtcbiAgfSxcblxuICBfX19yZW1vdmVET01FdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudExpc3RlbmVySGFuZGxlcyA9IHRoaXMuX19fZG9tRXZlbnRMaXN0ZW5lckhhbmRsZXM7XG4gICAgaWYgKGV2ZW50TGlzdGVuZXJIYW5kbGVzKSB7XG4gICAgICBldmVudExpc3RlbmVySGFuZGxlcy5mb3JFYWNoKHJlbW92ZUxpc3RlbmVyKTtcbiAgICAgIHRoaXMuX19fZG9tRXZlbnRMaXN0ZW5lckhhbmRsZXMgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICBnZXQgX19fcmF3U3RhdGUoKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcbiAgICByZXR1cm4gc3RhdGUgJiYgc3RhdGUuX19fcmF3O1xuICB9LFxuXG4gIF9fX3NldEN1c3RvbUV2ZW50czogZnVuY3Rpb24gKGN1c3RvbUV2ZW50cywgc2NvcGUpIHtcbiAgICB2YXIgZmluYWxDdXN0b21FdmVudHMgPSAodGhpcy5fX19jdXN0b21FdmVudHMgPSB7fSk7XG4gICAgdGhpcy5fX19zY29wZSA9IHNjb3BlO1xuXG4gICAgY3VzdG9tRXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGN1c3RvbUV2ZW50KSB7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gY3VzdG9tRXZlbnRbMF07XG4gICAgICB2YXIgdGFyZ2V0TWV0aG9kTmFtZSA9IGN1c3RvbUV2ZW50WzFdO1xuICAgICAgdmFyIGlzT25jZSA9IGN1c3RvbUV2ZW50WzJdO1xuICAgICAgdmFyIGV4dHJhQXJncyA9IGN1c3RvbUV2ZW50WzNdO1xuXG4gICAgICBpZiAodGFyZ2V0TWV0aG9kTmFtZSkge1xuICAgICAgICBmaW5hbEN1c3RvbUV2ZW50c1tldmVudFR5cGVdID0gW3RhcmdldE1ldGhvZE5hbWUsIGlzT25jZSwgZXh0cmFBcmdzXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBnZXQgZWwoKSB7XG4gICAgcmV0dXJuIHdhbGtGcmFnbWVudHModGhpcy5fX19yb290Tm9kZSk7XG4gIH0sXG5cbiAgZ2V0IGVscygpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgY29tcGxhaW4oXG4gICAgICAgICdUaGUgXCJ0aGlzLmVsc1wiIGF0dHJpYnV0ZSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIFwidGhpcy5nZXRFbHMoa2V5KVwiIGluc3RlYWQuJyxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAodGhpcy5fX19yb290Tm9kZSA/IHRoaXMuX19fcm9vdE5vZGUubm9kZXMgOiBbXSkuZmlsdGVyKFxuICAgICAgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBlbC5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFO1xuICAgICAgfSxcbiAgICApO1xuICB9LFxuXG4gIF9fX2VtaXQ6IGVtaXQsXG4gIF9fX2VtaXRDcmVhdGUoaW5wdXQsIG91dCkge1xuICAgIHRoaXMub25DcmVhdGUgJiYgdGhpcy5vbkNyZWF0ZShpbnB1dCwgb3V0KTtcbiAgICB0aGlzLl9fX2VtaXQoXCJjcmVhdGVcIiwgaW5wdXQsIG91dCk7XG4gIH0sXG5cbiAgX19fZW1pdFJlbmRlcihvdXQpIHtcbiAgICB0aGlzLm9uUmVuZGVyICYmIHRoaXMub25SZW5kZXIob3V0KTtcbiAgICB0aGlzLl9fX2VtaXQoXCJyZW5kZXJcIiwgb3V0KTtcbiAgfSxcblxuICBfX19lbWl0VXBkYXRlKCkge1xuICAgIHRoaXMub25VcGRhdGUgJiYgdGhpcy5vblVwZGF0ZSgpO1xuICAgIHRoaXMuX19fZW1pdChcInVwZGF0ZVwiKTtcbiAgfSxcblxuICBfX19lbWl0TW91bnQoKSB7XG4gICAgdGhpcy5vbk1vdW50ICYmIHRoaXMub25Nb3VudCgpO1xuICAgIHRoaXMuX19fZW1pdChcIm1vdW50XCIpO1xuICB9LFxuXG4gIF9fX2VtaXREZXN0cm95KCkge1xuICAgIHRoaXMub25EZXN0cm95ICYmIHRoaXMub25EZXN0cm95KCk7XG4gICAgdGhpcy5fX19lbWl0KFwiZGVzdHJveVwiKTtcbiAgfSxcbn07XG5cbmNvbXBvbmVudFByb3RvLmVsSWQgPSBjb21wb25lbnRQcm90by5nZXRFbElkO1xuY29tcG9uZW50UHJvdG8uX19fdXBkYXRlID0gY29tcG9uZW50UHJvdG8udXBkYXRlO1xuY29tcG9uZW50UHJvdG8uX19fZGVzdHJveSA9IGNvbXBvbmVudFByb3RvLmRlc3Ryb3k7XG5cbi8vIEFkZCBhbGwgb2YgdGhlIGZvbGxvd2luZyBET00gbWV0aG9kcyB0byBDb21wb25lbnQucHJvdG90eXBlOlxuLy8gLSBhcHBlbmRUbyhyZWZlcmVuY2VFbClcbi8vIC0gcmVwbGFjZShyZWZlcmVuY2VFbClcbi8vIC0gcmVwbGFjZUNoaWxkcmVuT2YocmVmZXJlbmNlRWwpXG4vLyAtIGluc2VydEJlZm9yZShyZWZlcmVuY2VFbClcbi8vIC0gaW5zZXJ0QWZ0ZXIocmVmZXJlbmNlRWwpXG4vLyAtIHByZXBlbmRUbyhyZWZlcmVuY2VFbClcbmRvbUluc2VydChcbiAgY29tcG9uZW50UHJvdG8sXG4gIGZ1bmN0aW9uIGdldEVsKGNvbXBvbmVudCkge1xuICAgIHJldHVybiBjb21wb25lbnQuX19fZGV0YWNoKCk7XG4gIH0sXG4gIGZ1bmN0aW9uIGFmdGVySW5zZXJ0KGNvbXBvbmVudCkge1xuICAgIHJldHVybiBjb21wb25lbnQ7XG4gIH0sXG4pO1xuXG5pbmhlcml0KENvbXBvbmVudCwgRXZlbnRFbWl0dGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG52YXIgZXh0ZW5kID0gcmVxdWlyZShcInJhcHRvci11dGlsL2V4dGVuZFwiKTtcbnZhciB3MTBOb29wID0gcmVxdWlyZShcIndhcnAxMC9jb25zdGFudHNcIikuTk9PUDtcbnZhciBjb21wb25lbnRVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgYXR0YWNoQnViYmxpbmdFdmVudCA9IGNvbXBvbmVudFV0aWwuX19fYXR0YWNoQnViYmxpbmdFdmVudDtcbnZhciBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIgPVxuICByZXF1aXJlKFwiLi9ldmVudC1kZWxlZ2F0aW9uXCIpLl9fX2FkZERlbGVnYXRlZEV2ZW50SGFuZGxlcjtcbnZhciBLZXlTZXF1ZW5jZSA9IHJlcXVpcmUoXCIuL0tleVNlcXVlbmNlXCIpO1xudmFyIEVNUFRZX09CSkVDVCA9IHt9O1xuXG52YXIgRkxBR19XSUxMX1JFUkVOREVSX0lOX0JST1dTRVIgPSAxO1xudmFyIEZMQUdfSEFTX1JFTkRFUl9CT0RZID0gMjtcbnZhciBGTEFHX0lTX0xFR0FDWSA9IDQ7XG52YXIgRkxBR19PTERfSFlEUkFURV9OT19DUkVBVEUgPSA4O1xuXG4vKipcbiAqIEEgQ29tcG9uZW50RGVmIGlzIHVzZWQgdG8gaG9sZCB0aGUgbWV0YWRhdGEgY29sbGVjdGVkIGF0IHJ1bnRpbWUgZm9yXG4gKiBhIHNpbmdsZSBjb21wb25lbnQgYW5kIHRoaXMgaW5mb3JtYXRpb24gaXMgdXNlZCB0byBpbnN0YW50aWF0ZSB0aGUgY29tcG9uZW50XG4gKiBsYXRlciAoYWZ0ZXIgdGhlIHJlbmRlcmVkIEhUTUwgaGFzIGJlZW4gYWRkZWQgdG8gdGhlIERPTSlcbiAqL1xuZnVuY3Rpb24gQ29tcG9uZW50RGVmKGNvbXBvbmVudCwgY29tcG9uZW50SWQsIGNvbXBvbmVudHNDb250ZXh0KSB7XG4gIHRoaXMuX19fY29tcG9uZW50c0NvbnRleHQgPSBjb21wb25lbnRzQ29udGV4dDsgLy8gVGhlIEFzeW5jV3JpdGVyIHRoYXQgdGhpcyBjb21wb25lbnQgaXMgYXNzb2NpYXRlZCB3aXRoXG4gIHRoaXMuX19fY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB0aGlzLmlkID0gY29tcG9uZW50SWQ7XG5cbiAgdGhpcy5fX19kb21FdmVudHMgPSB1bmRlZmluZWQ7IC8vIEFuIGFycmF5IG9mIERPTSBldmVudHMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIChpbiBzZXRzIG9mIHRocmVlKVxuXG4gIHRoaXMuX19faXNFeGlzdGluZyA9IGZhbHNlO1xuXG4gIHRoaXMuX19fcmVuZGVyQm91bmRhcnkgPSBmYWxzZTtcbiAgdGhpcy5fX19mbGFncyA9IDA7XG5cbiAgdGhpcy5fX19uZXh0SWRJbmRleCA9IDA7IC8vIFRoZSB1bmlxdWUgaW50ZWdlciB0byB1c2UgZm9yIHRoZSBuZXh0IHNjb3BlZCBJRFxuICB0aGlzLl9fX2tleVNlcXVlbmNlID0gbnVsbDtcbn1cblxuQ29tcG9uZW50RGVmLnByb3RvdHlwZSA9IHtcbiAgX19fbmV4dEtleTogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9fX2tleVNlcXVlbmNlIHx8ICh0aGlzLl9fX2tleVNlcXVlbmNlID0gbmV3IEtleVNlcXVlbmNlKCkpXG4gICAgKS5fX19uZXh0S2V5KGtleSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgaGVscGVyIG1ldGhvZCBnZW5lcmF0ZXMgYSB1bmlxdWUgYW5kIGZ1bGx5IHF1YWxpZmllZCBET00gZWxlbWVudCBJRFxuICAgKiB0aGF0IGlzIHVuaXF1ZSB3aXRoaW4gdGhlIHNjb3BlIG9mIHRoZSBjdXJyZW50IGNvbXBvbmVudC5cbiAgICovXG4gIGVsSWQ6IGZ1bmN0aW9uIChuZXN0ZWRJZCkge1xuICAgIHZhciBpZCA9IHRoaXMuaWQ7XG5cbiAgICBpZiAobmVzdGVkSWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIG5lc3RlZElkICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICAgIGNvbXBsYWluKFwiVXNpbmcgbm9uIHN0cmluZ3MgYXMga2V5cyBpcyBkZXByZWNhdGVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5lc3RlZElkID0gU3RyaW5nKG5lc3RlZElkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5lc3RlZElkLmluZGV4T2YoXCIjXCIpID09PSAwKSB7XG4gICAgICAgIGlkID0gXCIjXCIgKyBpZDtcbiAgICAgICAgbmVzdGVkSWQgPSBuZXN0ZWRJZC5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpZCArIFwiLVwiICsgbmVzdGVkSWQ7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbmV4dCBhdXRvIGdlbmVyYXRlZCB1bmlxdWUgSUQgZm9yIGEgbmVzdGVkIERPTSBlbGVtZW50IG9yIG5lc3RlZCBET00gY29tcG9uZW50XG4gICAqL1xuICBfX19uZXh0Q29tcG9uZW50SWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pZCArIFwiLWNcIiArIHRoaXMuX19fbmV4dElkSW5kZXgrKztcbiAgfSxcblxuICBkOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBoYW5kbGVyTWV0aG9kTmFtZSwgaXNPbmNlLCBleHRyYUFyZ3MpIHtcbiAgICBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIoZXZlbnROYW1lKTtcbiAgICByZXR1cm4gYXR0YWNoQnViYmxpbmdFdmVudCh0aGlzLCBoYW5kbGVyTWV0aG9kTmFtZSwgaXNPbmNlLCBleHRyYUFyZ3MpO1xuICB9LFxuXG4gIGdldCBfX190eXBlKCkge1xuICAgIHJldHVybiB0aGlzLl9fX2NvbXBvbmVudC5fX190eXBlO1xuICB9LFxufTtcblxuQ29tcG9uZW50RGVmLnByb3RvdHlwZS5uayA9IENvbXBvbmVudERlZi5wcm90b3R5cGUuX19fbmV4dEtleTtcblxuQ29tcG9uZW50RGVmLl9fX2Rlc2VyaWFsaXplID0gZnVuY3Rpb24gKG8sIHR5cGVzLCBnbG9iYWwsIHJlZ2lzdHJ5KSB7XG4gIHZhciBpZCA9IG9bMF07XG4gIHZhciB0eXBlTmFtZSA9IHR5cGVzW29bMV1dO1xuICB2YXIgaW5wdXQgPSBvWzJdIHx8IG51bGw7XG4gIHZhciBleHRyYSA9IG9bM10gfHwgRU1QVFlfT0JKRUNUO1xuXG4gIHZhciBzdGF0ZSA9IGV4dHJhLnM7XG4gIHZhciBjb21wb25lbnRQcm9wcyA9IGV4dHJhLncgfHwgRU1QVFlfT0JKRUNUO1xuICB2YXIgZmxhZ3MgPSBleHRyYS5mO1xuICB2YXIgaXNMZWdhY3kgPSBmbGFncyAmIEZMQUdfSVNfTEVHQUNZO1xuICB2YXIgcmVuZGVyQm9keSA9IGZsYWdzICYgRkxBR19IQVNfUkVOREVSX0JPRFkgPyB3MTBOb29wIDogZXh0cmEucjtcblxuICB2YXIgY29tcG9uZW50ID1cbiAgICB0eXBlTmFtZSAvKiBsZWdhY3kgKi8gJiZcbiAgICByZWdpc3RyeS5fX19jcmVhdGVDb21wb25lbnQodHlwZU5hbWUsIGlkLCBpc0xlZ2FjeSk7XG5cbiAgLy8gUHJldmVudCBuZXdseSBjcmVhdGVkIGNvbXBvbmVudCBmcm9tIGJlaW5nIHF1ZXVlZCBmb3IgdXBkYXRlIHNpbmNlIHdlIGFyZWFcbiAgLy8ganVzdCBidWlsZGluZyBpdCBmcm9tIHRoZSBzZXJ2ZXIgaW5mb1xuICBjb21wb25lbnQuX19fdXBkYXRlUXVldWVkID0gdHJ1ZTtcblxuICBpZiAoaXNMZWdhY3kpIHtcbiAgICBjb21wb25lbnQud2lkZ2V0Q29uZmlnID0gY29tcG9uZW50UHJvcHM7XG4gICAgY29tcG9uZW50Ll9fX3dpZGdldEJvZHkgPSByZW5kZXJCb2R5O1xuICB9IGVsc2UgaWYgKHJlbmRlckJvZHkpIHtcbiAgICAoaW5wdXQgfHwgKGlucHV0ID0ge30pKS5yZW5kZXJCb2R5ID0gcmVuZGVyQm9keTtcbiAgfVxuXG4gIGlmIChcbiAgICAhaXNMZWdhY3kgJiZcbiAgICBmbGFncyAmIEZMQUdfV0lMTF9SRVJFTkRFUl9JTl9CUk9XU0VSICYmXG4gICAgIShmbGFncyAmIEZMQUdfT0xEX0hZRFJBVEVfTk9fQ1JFQVRFKVxuICApIHtcbiAgICBpZiAoY29tcG9uZW50Lm9uQ3JlYXRlKSB7XG4gICAgICBjb21wb25lbnQub25DcmVhdGUoaW5wdXQsIHsgZ2xvYmFsOiBnbG9iYWwgfSk7XG4gICAgfVxuICAgIGlmIChjb21wb25lbnQub25JbnB1dCkge1xuICAgICAgaW5wdXQgPSBjb21wb25lbnQub25JbnB1dChpbnB1dCwgeyBnbG9iYWw6IGdsb2JhbCB9KSB8fCBpbnB1dDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICB2YXIgdW5kZWZpbmVkUHJvcE5hbWVzID0gZXh0cmEudTtcbiAgICAgIGlmICh1bmRlZmluZWRQcm9wTmFtZXMpIHtcbiAgICAgICAgdW5kZWZpbmVkUHJvcE5hbWVzLmZvckVhY2goZnVuY3Rpb24gKHVuZGVmaW5lZFByb3BOYW1lKSB7XG4gICAgICAgICAgc3RhdGVbdW5kZWZpbmVkUHJvcE5hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIGdvIHRocm91Z2ggdGhlIHNldHRlciBoZXJlIHNvIHRoYXQgd2UgY29udmVydCB0aGUgc3RhdGUgb2JqZWN0XG4gICAgICAvLyB0byBhbiBpbnN0YW5jZSBvZiBgU3RhdGVgXG4gICAgICBjb21wb25lbnQuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzTGVnYWN5ICYmIGNvbXBvbmVudFByb3BzKSB7XG4gICAgICBleHRlbmQoY29tcG9uZW50LCBjb21wb25lbnRQcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50Ll9fX2lucHV0ID0gaW5wdXQ7XG5cbiAgaWYgKGV4dHJhLmIpIHtcbiAgICBjb21wb25lbnQuX19fYnViYmxpbmdEb21FdmVudHMgPSBleHRyYS5iO1xuICB9XG5cbiAgdmFyIHNjb3BlID0gZXh0cmEucDtcbiAgdmFyIGN1c3RvbUV2ZW50cyA9IGV4dHJhLmU7XG4gIGlmIChjdXN0b21FdmVudHMpIHtcbiAgICBjb21wb25lbnQuX19fc2V0Q3VzdG9tRXZlbnRzKGN1c3RvbUV2ZW50cywgc2NvcGUpO1xuICB9XG5cbiAgY29tcG9uZW50Ll9fX2dsb2JhbCA9IGdsb2JhbDtcblxuICByZXR1cm4ge1xuICAgIGlkOiBpZCxcbiAgICBfX19jb21wb25lbnQ6IGNvbXBvbmVudCxcbiAgICBfX19kb21FdmVudHM6IGV4dHJhLmQsXG4gICAgX19fZmxhZ3M6IGV4dHJhLmYgfHwgMCxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50RGVmO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgR2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSByZXF1aXJlKFwiLi9HbG9iYWxDb21wb25lbnRzQ29udGV4dFwiKTtcblxuZnVuY3Rpb24gQ29tcG9uZW50c0NvbnRleHQob3V0LCBwYXJlbnRDb21wb25lbnRzQ29udGV4dCkge1xuICB2YXIgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQ7XG4gIHZhciBjb21wb25lbnREZWY7XG5cbiAgaWYgKHBhcmVudENvbXBvbmVudHNDb250ZXh0KSB7XG4gICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19nbG9iYWxDb250ZXh0O1xuICAgIGNvbXBvbmVudERlZiA9IHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX2NvbXBvbmVudERlZjtcblxuICAgIHZhciBuZXN0ZWRDb250ZXh0c0ZvclBhcmVudDtcbiAgICBpZiAoXG4gICAgICAhKG5lc3RlZENvbnRleHRzRm9yUGFyZW50ID0gcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19fbmVzdGVkQ29udGV4dHMpXG4gICAgKSB7XG4gICAgICBuZXN0ZWRDb250ZXh0c0ZvclBhcmVudCA9IHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX25lc3RlZENvbnRleHRzID0gW107XG4gICAgfVxuXG4gICAgbmVzdGVkQ29udGV4dHNGb3JQYXJlbnQucHVzaCh0aGlzKTtcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IG91dC5nbG9iYWwuX19fY29tcG9uZW50cztcbiAgICBpZiAoZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3V0Lmdsb2JhbC5fX19jb21wb25lbnRzID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPVxuICAgICAgICBuZXcgR2xvYmFsQ29tcG9uZW50c0NvbnRleHQob3V0KTtcbiAgICB9XG4gIH1cblxuICB0aGlzLl9fX2dsb2JhbENvbnRleHQgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dDtcbiAgdGhpcy5fX19jb21wb25lbnRzID0gW107XG4gIHRoaXMuX19fb3V0ID0gb3V0O1xuICB0aGlzLl9fX2NvbXBvbmVudERlZiA9IGNvbXBvbmVudERlZjtcbiAgdGhpcy5fX19uZXN0ZWRDb250ZXh0cyA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fX19pc1ByZXNlcnZlZCA9XG4gICAgcGFyZW50Q29tcG9uZW50c0NvbnRleHQgJiYgcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19faXNQcmVzZXJ2ZWQ7XG59XG5cbkNvbXBvbmVudHNDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgX19faW5pdENvbXBvbmVudHM6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIGNvbXBvbmVudERlZnMgPSB0aGlzLl9fX2NvbXBvbmVudHM7XG5cbiAgICBDb21wb25lbnRzQ29udGV4dC5fX19pbml0Q2xpZW50UmVuZGVyZWQoY29tcG9uZW50RGVmcywgaG9zdCk7XG5cbiAgICB0aGlzLl9fX291dC5lbWl0KFwiX19fY29tcG9uZW50c0luaXRpYWxpemVkXCIpO1xuXG4gICAgLy8gUmVzZXQgdGhpbmdzIHN0b3JlZCBpbiBnbG9iYWwgc2luY2UgZ2xvYmFsIGlzIHJldGFpbmVkIGZvclxuICAgIC8vIGZ1dHVyZSByZW5kZXJzXG4gICAgdGhpcy5fX19vdXQuZ2xvYmFsLl9fX2NvbXBvbmVudHMgPSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gY29tcG9uZW50RGVmcztcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudHNDb250ZXh0KG91dCkge1xuICByZXR1cm4gb3V0Ll9fX2NvbXBvbmVudHMgfHwgKG91dC5fX19jb21wb25lbnRzID0gbmV3IENvbXBvbmVudHNDb250ZXh0KG91dCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBDb21wb25lbnRzQ29udGV4dDtcblxuZXhwb3J0cy5fX19nZXRDb21wb25lbnRzQ29udGV4dCA9IGdldENvbXBvbmVudHNDb250ZXh0O1xuIiwidmFyIG5leHRDb21wb25lbnRJZFByb3ZpZGVyID1cbiAgcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIikuX19fbmV4dENvbXBvbmVudElkUHJvdmlkZXI7XG5cbmZ1bmN0aW9uIEdsb2JhbENvbXBvbmVudHNDb250ZXh0KG91dCkge1xuICB0aGlzLl9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWQgPSB7fTtcbiAgdGhpcy5fX19yZXJlbmRlckNvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fX19uZXh0Q29tcG9uZW50SWQgPSBuZXh0Q29tcG9uZW50SWRQcm92aWRlcihvdXQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbENvbXBvbmVudHNDb250ZXh0O1xuIiwiZnVuY3Rpb24gS2V5U2VxdWVuY2UoKSB7XG4gIHRoaXMuX19fbG9va3VwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxuS2V5U2VxdWVuY2UucHJvdG90eXBlLl9fX25leHRLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHZhciBsb29rdXAgPSB0aGlzLl9fX2xvb2t1cDtcblxuICBpZiAobG9va3VwW2tleV0pIHtcbiAgICByZXR1cm4ga2V5ICsgXCJfXCIgKyBsb29rdXBba2V5XSsrO1xuICB9XG5cbiAgbG9va3VwW2tleV0gPSAxO1xuICByZXR1cm4ga2V5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlTZXF1ZW5jZTtcbiIsInZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xuXG5mdW5jdGlvbiBlbnN1cmUoc3RhdGUsIHByb3BlcnR5TmFtZSkge1xuICB2YXIgcHJvdG8gPSBzdGF0ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIGlmICghKHByb3BlcnR5TmFtZSBpbiBwcm90bykpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIHByb3BlcnR5TmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fX3Jhd1twcm9wZXJ0eU5hbWVdO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX19fc2V0KHByb3BlcnR5TmFtZSwgdmFsdWUsIGZhbHNlIC8qIGVuc3VyZTpmYWxzZSAqLyk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIFN0YXRlKGNvbXBvbmVudCkge1xuICB0aGlzLl9fX2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgdGhpcy5fX19yYXcgPSB7fTtcblxuICB0aGlzLl9fX2RpcnR5ID0gZmFsc2U7XG4gIHRoaXMuX19fb2xkID0gbnVsbDtcbiAgdGhpcy5fX19jaGFuZ2VzID0gbnVsbDtcbiAgdGhpcy5fX19mb3JjZWQgPSBudWxsOyAvLyBBbiBvYmplY3QgdGhhdCB3ZSB1c2UgdG8ga2VlcCB0cmFja2luZyBvZiBzdGF0ZSBwcm9wZXJ0aWVzIHRoYXQgd2VyZSBmb3JjZWQgdG8gYmUgZGlydHlcblxuICBPYmplY3Quc2VhbCh0aGlzKTtcbn1cblxuU3RhdGUucHJvdG90eXBlID0ge1xuICBfX19yZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuX19fZGlydHkgPSBmYWxzZTtcbiAgICBzZWxmLl9fX29sZCA9IG51bGw7XG4gICAgc2VsZi5fX19jaGFuZ2VzID0gbnVsbDtcbiAgICBzZWxmLl9fX2ZvcmNlZCA9IG51bGw7XG4gIH0sXG5cbiAgX19fcmVwbGFjZTogZnVuY3Rpb24gKG5ld1N0YXRlKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcztcbiAgICB2YXIga2V5O1xuXG4gICAgdmFyIHJhd1N0YXRlID0gdGhpcy5fX19yYXc7XG5cbiAgICBmb3IgKGtleSBpbiByYXdTdGF0ZSkge1xuICAgICAgaWYgKCEoa2V5IGluIG5ld1N0YXRlKSkge1xuICAgICAgICBzdGF0ZS5fX19zZXQoXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICBmYWxzZSAvKiBlbnN1cmU6ZmFsc2UgKi8sXG4gICAgICAgICAgZmFsc2UgLyogZm9yY2VEaXJ0eTpmYWxzZSAqLyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBuZXdTdGF0ZSkge1xuICAgICAgc3RhdGUuX19fc2V0KFxuICAgICAgICBrZXksXG4gICAgICAgIG5ld1N0YXRlW2tleV0sXG4gICAgICAgIHRydWUgLyogZW5zdXJlOnRydWUgKi8sXG4gICAgICAgIGZhbHNlIC8qIGZvcmNlRGlydHk6ZmFsc2UgKi8sXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgX19fc2V0OiBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIHNob3VsZEVuc3VyZSwgZm9yY2VEaXJ0eSkge1xuICAgIHZhciByYXdTdGF0ZSA9IHRoaXMuX19fcmF3O1xuXG4gICAgaWYgKHNob3VsZEVuc3VyZSkge1xuICAgICAgZW5zdXJlKHRoaXMsIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChmb3JjZURpcnR5KSB7XG4gICAgICB2YXIgZm9yY2VkRGlydHlTdGF0ZSA9IHRoaXMuX19fZm9yY2VkIHx8ICh0aGlzLl9fX2ZvcmNlZCA9IHt9KTtcbiAgICAgIGZvcmNlZERpcnR5U3RhdGVbbmFtZV0gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAocmF3U3RhdGVbbmFtZV0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9fX2RpcnR5KSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCB0aW1lIHdlIGFyZSBtb2RpZnlpbmcgdGhlIGNvbXBvbmVudCBzdGF0ZVxuICAgICAgLy8gc28gaW50cm9kdWNlIHNvbWUgcHJvcGVydGllcyB0byBkbyBzb21lIHRyYWNraW5nIG9mXG4gICAgICAvLyBjaGFuZ2VzIHRvIHRoZSBzdGF0ZVxuICAgICAgdGhpcy5fX19kaXJ0eSA9IHRydWU7IC8vIE1hcmsgdGhlIGNvbXBvbmVudCBzdGF0ZSBhcyBkaXJ0eSAoaS5lLiBtb2RpZmllZClcbiAgICAgIHRoaXMuX19fb2xkID0gcmF3U3RhdGU7XG4gICAgICB0aGlzLl9fX3JhdyA9IHJhd1N0YXRlID0gZXh0ZW5kKHt9LCByYXdTdGF0ZSk7XG4gICAgICB0aGlzLl9fX2NoYW5nZXMgPSB7fTtcbiAgICAgIHRoaXMuX19fY29tcG9uZW50Ll9fX3F1ZXVlVXBkYXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fX19jaGFuZ2VzW25hbWVdID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gRG9uJ3Qgc3RvcmUgc3RhdGUgcHJvcGVydGllcyB3aXRoIGFuIHVuZGVmaW5lZCBvciBudWxsIHZhbHVlXG4gICAgICBkZWxldGUgcmF3U3RhdGVbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgc3RvcmUgdGhlIG5ldyB2YWx1ZSBpbiB0aGUgY29tcG9uZW50IHN0YXRlXG4gICAgICByYXdTdGF0ZVtuYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgfSxcbiAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fcmF3O1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoganNoaW50IG5ld2NhcDpmYWxzZSAqL1xuXG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIEJhc2VDb21wb25lbnQgPSByZXF1aXJlKFwiLi9Db21wb25lbnRcIik7XG52YXIgQmFzZVN0YXRlID0gcmVxdWlyZShcIi4vU3RhdGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lQ29tcG9uZW50KGRlZiwgcmVuZGVyZXIpIHtcbiAgaWYgKGRlZi5fX19pc0NvbXBvbmVudCkge1xuICAgIHJldHVybiBkZWY7XG4gIH1cblxuICB2YXIgQ29tcG9uZW50Q2xhc3MgPSBmdW5jdGlvbiAoKSB7fTtcbiAgdmFyIHByb3RvO1xuXG4gIHZhciB0eXBlID0gdHlwZW9mIGRlZjtcblxuICBpZiAodHlwZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBwcm90byA9IGRlZi5wcm90b3R5cGU7XG4gIH0gZWxzZSBpZiAodHlwZSA9PSBcIm9iamVjdFwiKSB7XG4gICAgcHJvdG8gPSBkZWY7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gIH1cblxuICBDb21wb25lbnRDbGFzcy5wcm90b3R5cGUgPSBwcm90bztcblxuICAvLyBXZSBkb24ndCB1c2UgdGhlIGNvbnN0cnVjdG9yIHByb3ZpZGVkIGJ5IHRoZSB1c2VyXG4gIC8vIHNpbmNlIHdlIGRvbid0IGludm9rZSB0aGVpciBjb25zdHJ1Y3RvciB1bnRpbFxuICAvLyB3ZSBoYXZlIGhhZCBhIGNoYW5jZSB0byBkbyBvdXIgb3duIGluaXRpYWxpemF0aW9uLlxuICAvLyBJbnN0ZWFkLCB3ZSBzdG9yZSB0aGVpciBjb25zdHJ1Y3RvciBpbiB0aGUgXCJpbml0Q29tcG9uZW50XCJcbiAgLy8gcHJvcGVydHkgYW5kIHRoYXQgbWV0aG9kIGdldHMgY2FsbGVkIGxhdGVyIGluc2lkZVxuICAvLyBpbml0LWNvbXBvbmVudHMtYnJvd3Nlci5qc1xuICBmdW5jdGlvbiBDb21wb25lbnQoaWQpIHtcbiAgICBCYXNlQ29tcG9uZW50LmNhbGwodGhpcywgaWQpO1xuICB9XG5cbiAgaWYgKCFwcm90by5fX19pc0NvbXBvbmVudCkge1xuICAgIC8vIEluaGVyaXQgZnJvbSBDb21wb25lbnQgaWYgdGhleSBkaWRuJ3QgYWxyZWFkeVxuICAgIGluaGVyaXQoQ29tcG9uZW50Q2xhc3MsIEJhc2VDb21wb25lbnQpO1xuICB9XG5cbiAgLy8gVGhlIHNhbWUgcHJvdG90eXBlIHdpbGwgYmUgdXNlZCBieSBvdXIgY29uc3RydWN0b3IgYWZ0ZXJcbiAgLy8gd2UgaGUgaGF2ZSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiB1c2luZyB0aGUgaW5oZXJpdCBmdW5jdGlvblxuICBwcm90byA9IENvbXBvbmVudC5wcm90b3R5cGUgPSBDb21wb25lbnRDbGFzcy5wcm90b3R5cGU7XG5cbiAgLy8gcHJvdG8uY29uc3RydWN0b3IgPSBkZWYuY29uc3RydWN0b3IgPSBDb21wb25lbnQ7XG5cbiAgLy8gU2V0IGEgZmxhZyBvbiB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gbWFrZSBpdCBjbGVhciB0aGlzIGlzXG4gIC8vIGEgY29tcG9uZW50IHNvIHRoYXQgd2UgY2FuIHNob3J0LWNpcmN1aXQgdGhpcyB3b3JrIGxhdGVyXG4gIENvbXBvbmVudC5fX19pc0NvbXBvbmVudCA9IHRydWU7XG5cbiAgZnVuY3Rpb24gU3RhdGUoY29tcG9uZW50KSB7XG4gICAgQmFzZVN0YXRlLmNhbGwodGhpcywgY29tcG9uZW50KTtcbiAgfVxuICBpbmhlcml0KFN0YXRlLCBCYXNlU3RhdGUpO1xuICBwcm90by5fX19TdGF0ZSA9IFN0YXRlO1xuICBwcm90by5fX19yZW5kZXJlciA9IHJlbmRlcmVyO1xuXG4gIHJldHVybiBDb21wb25lbnQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIF9fX3ZQcm9wc0J5RE9NTm9kZTogbmV3IFdlYWtNYXAoKSxcbiAgX19fdkVsZW1lbnRCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX2NvbXBvbmVudEJ5RE9NTm9kZTogbmV3IFdlYWtNYXAoKSxcbiAgX19fZGV0YWNoZWRCeURPTU5vZGU6IG5ldyBXZWFrTWFwKCksXG4gIF9fX2tleUJ5RE9NTm9kZTogbmV3IFdlYWtNYXAoKSxcbiAgX19fc3NyS2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWQ6IHt9LFxufTtcbiIsInZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIHJ1bnRpbWVJZCA9IGNvbXBvbmVudHNVdGlsLl9fX3J1bnRpbWVJZDtcbnZhciBjb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG52YXIgZ2V0TWFya29Qcm9wc0Zyb21FbCA9IGNvbXBvbmVudHNVdGlsLl9fX2dldE1hcmtvUHJvcHNGcm9tRWw7XG5cbnZhciBURVhUX05PREUgPSAzO1xuXG4vLyBXZSBtYWtlIG91ciBiZXN0IGVmZm9ydCB0byBhbGxvdyBtdWx0aXBsZSBtYXJrbyBydW50aW1lcyB0byBiZSBsb2FkZWQgaW4gdGhlXG4vLyBzYW1lIHdpbmRvdy4gRWFjaCBtYXJrbyBydW50aW1lIHdpbGwgZ2V0IGl0cyBvd24gdW5pcXVlIHJ1bnRpbWUgSUQuXG52YXIgbGlzdGVuZXJzQXR0YWNoZWRLZXkgPSBcIiRNREVcIiArIHJ1bnRpbWVJZDtcbnZhciBkZWxlZ2F0ZWRFdmVudHMgPSB7fTtcblxuZnVuY3Rpb24gZ2V0RXZlbnRGcm9tRWwoZWwsIGV2ZW50TmFtZSkge1xuICB2YXIgdmlydHVhbFByb3BzID0gZ2V0TWFya29Qcm9wc0Zyb21FbChlbCk7XG4gIHZhciBldmVudEluZm8gPSB2aXJ0dWFsUHJvcHNbZXZlbnROYW1lXTtcblxuICBpZiAodHlwZW9mIGV2ZW50SW5mbyA9PT0gXCJzdHJpbmdcIikge1xuICAgIGV2ZW50SW5mbyA9IGV2ZW50SW5mby5zcGxpdChcIiBcIik7XG4gICAgaWYgKGV2ZW50SW5mb1syXSkge1xuICAgICAgZXZlbnRJbmZvWzJdID0gZXZlbnRJbmZvWzJdID09PSBcInRydWVcIjtcbiAgICB9XG4gICAgaWYgKGV2ZW50SW5mby5sZW5ndGggPT0gNCkge1xuICAgICAgZXZlbnRJbmZvWzNdID0gcGFyc2VJbnQoZXZlbnRJbmZvWzNdLCAxMCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGV2ZW50SW5mbztcbn1cblxuZnVuY3Rpb24gZGVsZWdhdGVFdmVudChub2RlLCBldmVudE5hbWUsIHRhcmdldCwgZXZlbnQpIHtcbiAgdmFyIHRhcmdldE1ldGhvZCA9IHRhcmdldFswXTtcbiAgdmFyIHRhcmdldENvbXBvbmVudElkID0gdGFyZ2V0WzFdO1xuICB2YXIgaXNPbmNlID0gdGFyZ2V0WzJdO1xuICB2YXIgZXh0cmFBcmdzID0gdGFyZ2V0WzNdO1xuXG4gIGlmIChpc09uY2UpIHtcbiAgICB2YXIgdmlydHVhbFByb3BzID0gZ2V0TWFya29Qcm9wc0Zyb21FbChub2RlKTtcbiAgICBkZWxldGUgdmlydHVhbFByb3BzW2V2ZW50TmFtZV07XG4gIH1cblxuICB2YXIgdGFyZ2V0Q29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW3RhcmdldENvbXBvbmVudElkXTtcblxuICBpZiAoIXRhcmdldENvbXBvbmVudCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0YXJnZXRGdW5jID1cbiAgICB0eXBlb2YgdGFyZ2V0TWV0aG9kID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gdGFyZ2V0TWV0aG9kXG4gICAgICA6IHRhcmdldENvbXBvbmVudFt0YXJnZXRNZXRob2RdO1xuICBpZiAoIXRhcmdldEZ1bmMpIHtcbiAgICB0aHJvdyBFcnJvcihcIk1ldGhvZCBub3QgZm91bmQ6IFwiICsgdGFyZ2V0TWV0aG9kKTtcbiAgfVxuXG4gIGlmIChleHRyYUFyZ3MgIT0gbnVsbCkge1xuICAgIGlmICh0eXBlb2YgZXh0cmFBcmdzID09PSBcIm51bWJlclwiKSB7XG4gICAgICBleHRyYUFyZ3MgPSB0YXJnZXRDb21wb25lbnQuX19fYnViYmxpbmdEb21FdmVudHNbZXh0cmFBcmdzXTtcbiAgICB9XG4gIH1cblxuICAvLyBJbnZva2UgdGhlIGNvbXBvbmVudCBtZXRob2RcbiAgaWYgKGV4dHJhQXJncykge1xuICAgIHRhcmdldEZ1bmMuYXBwbHkodGFyZ2V0Q29tcG9uZW50LCBleHRyYUFyZ3MuY29uY2F0KGV2ZW50LCBub2RlKSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0RnVuYy5jYWxsKHRhcmdldENvbXBvbmVudCwgZXZlbnQsIG5vZGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlcihldmVudFR5cGUpIHtcbiAgaWYgKCFkZWxlZ2F0ZWRFdmVudHNbZXZlbnRUeXBlXSkge1xuICAgIGRlbGVnYXRlZEV2ZW50c1tldmVudFR5cGVdID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXJUb0hvc3QoZXZlbnRUeXBlLCBob3N0KSB7XG4gIHZhciBsaXN0ZW5lcnMgPSAoaG9zdFtsaXN0ZW5lcnNBdHRhY2hlZEtleV0gPVxuICAgIGhvc3RbbGlzdGVuZXJzQXR0YWNoZWRLZXldIHx8IHt9KTtcbiAgaWYgKCFsaXN0ZW5lcnNbZXZlbnRUeXBlXSkge1xuICAgIChob3N0LmJvZHkgfHwgaG9zdCkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIGV2ZW50VHlwZSxcbiAgICAgIChsaXN0ZW5lcnNbZXZlbnRUeXBlXSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgY3VyTm9kZSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKCFjdXJOb2RlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VyTm9kZSA9XG4gICAgICAgICAgLy8gZXZlbnQudGFyZ2V0IG9mIGFuIFNWR0VsZW1lbnRJbnN0YW5jZSBkb2VzIG5vdCBoYXZlIGFcbiAgICAgICAgICAvLyBgZ2V0QXR0cmlidXRlYCBmdW5jdGlvbiBpbiBJRSAxMS5cbiAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcmtvLWpzL21hcmtvL2lzc3Vlcy83OTZcbiAgICAgICAgICBjdXJOb2RlLmNvcnJlc3BvbmRpbmdVc2VFbGVtZW50IHx8XG4gICAgICAgICAgLy8gaW4gc29tZSBicm93c2VycyB0aGUgZXZlbnQgdGFyZ2V0IGNhbiBiZSBhIHRleHQgbm9kZVxuICAgICAgICAgIC8vIG9uZSBleGFtcGxlIGJlaW5nIGRyYWdlbnRlciBpbiBmaXJlZm94LlxuICAgICAgICAgIChjdXJOb2RlLm5vZGVUeXBlID09PSBURVhUX05PREUgPyBjdXJOb2RlLnBhcmVudE5vZGUgOiBjdXJOb2RlKTtcblxuICAgICAgICAvLyBTZWFyY2ggdXAgdGhlIHRyZWUgbG9va2luZyBET00gZXZlbnRzIG1hcHBlZCB0byB0YXJnZXRcbiAgICAgICAgLy8gY29tcG9uZW50IG1ldGhvZHNcbiAgICAgICAgdmFyIHByb3BOYW1lID0gXCJvblwiICsgZXZlbnRUeXBlO1xuICAgICAgICB2YXIgdGFyZ2V0O1xuXG4gICAgICAgIC8vIEF0dHJpYnV0ZXMgd2lsbCBoYXZlIHRoZSBmb2xsb3dpbmcgZm9ybTpcbiAgICAgICAgLy8gb248ZXZlbnRfdHlwZT4oXCI8dGFyZ2V0X21ldGhvZD58PGNvbXBvbmVudF9pZD5cIilcblxuICAgICAgICBpZiAoZXZlbnQuYnViYmxlcykge1xuICAgICAgICAgIHZhciBwcm9wYWdhdGlvblN0b3BwZWQgPSBmYWxzZTtcblxuICAgICAgICAgIC8vIE1vbmtleS1wYXRjaCB0byBmaXggIzk3XG4gICAgICAgICAgdmFyIG9sZFN0b3BQcm9wYWdhdGlvbiA9IGV2ZW50LnN0b3BQcm9wYWdhdGlvbjtcblxuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG9sZFN0b3BQcm9wYWdhdGlvbi5jYWxsKGV2ZW50KTtcbiAgICAgICAgICAgIHByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmICgodGFyZ2V0ID0gZ2V0RXZlbnRGcm9tRWwoY3VyTm9kZSwgcHJvcE5hbWUpKSkge1xuICAgICAgICAgICAgICBkZWxlZ2F0ZUV2ZW50KGN1ck5vZGUsIHByb3BOYW1lLCB0YXJnZXQsIGV2ZW50KTtcblxuICAgICAgICAgICAgICBpZiAocHJvcGFnYXRpb25TdG9wcGVkKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUucGFyZW50Tm9kZSkgJiYgY3VyTm9kZS5nZXRBdHRyaWJ1dGUpO1xuICAgICAgICB9IGVsc2UgaWYgKCh0YXJnZXQgPSBnZXRFdmVudEZyb21FbChjdXJOb2RlLCBwcm9wTmFtZSkpKSB7XG4gICAgICAgICAgZGVsZWdhdGVFdmVudChjdXJOb2RlLCBwcm9wTmFtZSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdHJ1ZSxcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5leHBvcnRzLl9fX2hhbmRsZU5vZGVBdHRhY2ggPSBub29wO1xuZXhwb3J0cy5fX19oYW5kbGVOb2RlRGV0YWNoID0gbm9vcDtcbmV4cG9ydHMuX19fZGVsZWdhdGVFdmVudCA9IGRlbGVnYXRlRXZlbnQ7XG5leHBvcnRzLl9fX2dldEV2ZW50RnJvbUVsID0gZ2V0RXZlbnRGcm9tRWw7XG5leHBvcnRzLl9fX2FkZERlbGVnYXRlZEV2ZW50SGFuZGxlciA9IGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlcjtcbmV4cG9ydHMuX19faW5pdCA9IGZ1bmN0aW9uIChob3N0KSB7XG4gIE9iamVjdC5rZXlzKGRlbGVnYXRlZEV2ZW50cykuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRUeXBlKSB7XG4gICAgYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyVG9Ib3N0KGV2ZW50VHlwZSwgaG9zdCk7XG4gIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXJlZ2lzdHJ5XCIpO1xuIiwidmFyIGNvcHlQcm9wcyA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9jb3B5UHJvcHNcIik7XG52YXIgYmVnaW5Db21wb25lbnQgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtYmVnaW5Db21wb25lbnRcIik7XG52YXIgZW5kQ29tcG9uZW50ID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLWVuZENvbXBvbmVudFwiKTtcbnZhciByZWdpc3RyeSA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy1yZWdpc3RyeVwiKTtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGNvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcblxudmFyIENvbXBvbmVudHNDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29tcG9uZW50c0NvbnRleHRcIik7XG52YXIgZ2V0Q29tcG9uZW50c0NvbnRleHQgPSBDb21wb25lbnRzQ29udGV4dC5fX19nZXRDb21wb25lbnRzQ29udGV4dDtcbnZhciBpc1NlcnZlciA9IGNvbXBvbmVudHNVdGlsLl9fX2lzU2VydmVyID09PSB0cnVlO1xuXG52YXIgQ09NUE9ORU5UX0JFR0lOX0FTWU5DX0FEREVEX0tFWSA9IFwiJHdhXCI7XG5cbmZ1bmN0aW9uIHJlc29sdmVDb21wb25lbnRLZXkoa2V5LCBwYXJlbnRDb21wb25lbnREZWYpIHtcbiAgaWYgKGtleVswXSA9PT0gXCIjXCIpIHtcbiAgICByZXR1cm4ga2V5LnN1YnN0cmluZygxKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGFyZW50Q29tcG9uZW50RGVmLmlkICsgXCItXCIgKyBwYXJlbnRDb21wb25lbnREZWYuX19fbmV4dEtleShrZXkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYWNrQXN5bmNDb21wb25lbnRzKG91dCkge1xuICBpZiAob3V0LmlzU3luYygpIHx8IG91dC5nbG9iYWxbQ09NUE9ORU5UX0JFR0lOX0FTWU5DX0FEREVEX0tFWV0pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBvdXQub24oXCJiZWdpbkFzeW5jXCIsIGhhbmRsZUJlZ2luQXN5bmMpO1xuICBvdXQub24oXCJiZWdpbkRldGFjaGVkQXN5bmNcIiwgaGFuZGxlQmVnaW5EZXRhY2hlZEFzeW5jKTtcbiAgb3V0Lmdsb2JhbFtDT01QT05FTlRfQkVHSU5fQVNZTkNfQURERURfS0VZXSA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJlZ2luQXN5bmMoZXZlbnQpIHtcbiAgdmFyIHBhcmVudE91dCA9IGV2ZW50LnBhcmVudE91dDtcbiAgdmFyIGFzeW5jT3V0ID0gZXZlbnQub3V0O1xuICB2YXIgY29tcG9uZW50c0NvbnRleHQgPSBwYXJlbnRPdXQuX19fY29tcG9uZW50cztcblxuICBpZiAoY29tcG9uZW50c0NvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIFdlIGFyZSBnb2luZyB0byBzdGFydCBhIG5lc3RlZCBDb21wb25lbnRzQ29udGV4dFxuICAgIGFzeW5jT3V0Ll9fX2NvbXBvbmVudHMgPSBuZXcgQ29tcG9uZW50c0NvbnRleHQoYXN5bmNPdXQsIGNvbXBvbmVudHNDb250ZXh0KTtcbiAgfVxuICAvLyBDYXJyeSBhbG9uZyB0aGUgY29tcG9uZW50IGFyZ3VtZW50c1xuICBhc3luY091dC5jKFxuICAgIHBhcmVudE91dC5fX19hc3NpZ25lZENvbXBvbmVudERlZixcbiAgICBwYXJlbnRPdXQuX19fYXNzaWduZWRLZXksXG4gICAgcGFyZW50T3V0Ll9fX2Fzc2lnbmVkQ3VzdG9tRXZlbnRzLFxuICApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVCZWdpbkRldGFjaGVkQXN5bmMoZXZlbnQpIHtcbiAgdmFyIGFzeW5jT3V0ID0gZXZlbnQub3V0O1xuICBoYW5kbGVCZWdpbkFzeW5jKGV2ZW50KTtcbiAgYXN5bmNPdXQub24oXCJiZWdpbkFzeW5jXCIsIGhhbmRsZUJlZ2luQXN5bmMpO1xuICBhc3luY091dC5vbihcImJlZ2luRGV0YWNoZWRBc3luY1wiLCBoYW5kbGVCZWdpbkRldGFjaGVkQXN5bmMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZW5kZXJlckZ1bmMoXG4gIHRlbXBsYXRlUmVuZGVyRnVuYyxcbiAgY29tcG9uZW50UHJvcHMsXG4gIHJlbmRlcmluZ0xvZ2ljLFxuKSB7XG4gIHZhciBvbklucHV0ID0gcmVuZGVyaW5nTG9naWMgJiYgcmVuZGVyaW5nTG9naWMub25JbnB1dDtcbiAgdmFyIHR5cGVOYW1lID0gY29tcG9uZW50UHJvcHMudDtcbiAgdmFyIGlzU3BsaXQgPSBjb21wb25lbnRQcm9wcy5zID09PSB0cnVlO1xuICB2YXIgaXNJbXBsaWNpdENvbXBvbmVudCA9IGNvbXBvbmVudFByb3BzLmkgPT09IHRydWU7XG5cbiAgdmFyIHNob3VsZEFwcGx5U3BsaXRNaXhpbnMgPSByZW5kZXJpbmdMb2dpYyAmJiBpc1NwbGl0O1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIGlmICghY29tcG9uZW50UHJvcHMuZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIkNvbXBvbmVudCB3YXMgY29tcGlsZWQgaW4gYSBkaWZmZXJlbnQgTk9ERV9FTlYgdGhhbiB0aGUgTWFya28gcnVudGltZSBpcyB1c2luZy5cIixcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNvbXBvbmVudFByb3BzLmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJSdW50aW1lL05PREVfRU5WIE1pc21hdGNoXCIpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbmRlcmVyKGlucHV0LCBvdXQpIHtcbiAgICB0cmFja0FzeW5jQ29tcG9uZW50cyhvdXQpO1xuXG4gICAgdmFyIGNvbXBvbmVudHNDb250ZXh0ID0gZ2V0Q29tcG9uZW50c0NvbnRleHQob3V0KTtcbiAgICB2YXIgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSBjb21wb25lbnRzQ29udGV4dC5fX19nbG9iYWxDb250ZXh0O1xuXG4gICAgdmFyIGNvbXBvbmVudCA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlcmVuZGVyQ29tcG9uZW50O1xuICAgIHZhciBpc1JlcmVuZGVyID0gY29tcG9uZW50ICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGlkO1xuICAgIHZhciBpc0V4aXN0aW5nO1xuICAgIHZhciBjdXN0b21FdmVudHM7XG4gICAgdmFyIHBhcmVudENvbXBvbmVudERlZiA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2NvbXBvbmVudERlZjtcbiAgICB2YXIgb3duZXJDb21wb25lbnREZWYgPSBvdXQuX19fYXNzaWduZWRDb21wb25lbnREZWY7XG4gICAgdmFyIG93bmVyQ29tcG9uZW50SWQgPSBvd25lckNvbXBvbmVudERlZiAmJiBvd25lckNvbXBvbmVudERlZi5pZDtcbiAgICB2YXIga2V5ID0gb3V0Ll9fX2Fzc2lnbmVkS2V5O1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgLy8gSWYgY29tcG9uZW50IGlzIHByb3ZpZGVkIHRoZW4gd2UgYXJlIGN1cnJlbnRseSByZW5kZXJpbmdcbiAgICAgIC8vIHRoZSB0b3AtbGV2ZWwgVUkgY29tcG9uZW50IGFzIHBhcnQgb2YgYSByZS1yZW5kZXJcbiAgICAgIGlkID0gY29tcG9uZW50LmlkOyAvLyBXZSB3aWxsIHVzZSB0aGUgSUQgb2YgdGhlIGNvbXBvbmVudCBiZWluZyByZS1yZW5kZXJlZFxuICAgICAgaXNFeGlzdGluZyA9IHRydWU7IC8vIFRoaXMgaXMgYSByZS1yZW5kZXIgc28gd2Uga25vdyB0aGUgY29tcG9uZW50IGlzIGFscmVhZHkgaW4gdGhlIERPTVxuICAgICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVyZW5kZXJDb21wb25lbnQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIHdlIGFyZSByZW5kZXJpbmcgYSBuZXN0ZWQgVUkgY29tcG9uZW50LiBXZSB3aWxsIG5lZWRcbiAgICAgIC8vIHRvIG1hdGNoIHVwIHRoZSBVSSBjb21wb25lbnQgd2l0aCB0aGUgY29tcG9uZW50IGFscmVhZHkgaW4gdGhlXG4gICAgICAvLyBET00gKGlmIGFueSkgc28gd2Ugd2lsbCBuZWVkIHRvIHJlc29sdmUgdGhlIGNvbXBvbmVudCBJRCBmcm9tXG4gICAgICAvLyB0aGUgYXNzaWduZWQga2V5LiBXZSBhbHNvIG5lZWQgdG8gaGFuZGxlIGFueSBjdXN0b20gZXZlbnQgYmluZGluZ3NcbiAgICAgIC8vIHRoYXQgd2VyZSBwcm92aWRlZC5cbiAgICAgIGlmIChwYXJlbnRDb21wb25lbnREZWYpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvbXBvbmVudEFyZ3M6JywgY29tcG9uZW50QXJncyk7XG4gICAgICAgIGN1c3RvbUV2ZW50cyA9IG91dC5fX19hc3NpZ25lZEN1c3RvbUV2ZW50cztcblxuICAgICAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgICAgICBpZCA9IHJlc29sdmVDb21wb25lbnRLZXkoa2V5LnRvU3RyaW5nKCksIHBhcmVudENvbXBvbmVudERlZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWQgPSBwYXJlbnRDb21wb25lbnREZWYuX19fbmV4dENvbXBvbmVudElkKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlkID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fbmV4dENvbXBvbmVudElkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzU2VydmVyKSB7XG4gICAgICAvLyBJZiB3ZSBhcmUgcmVuZGVyaW5nIG9uIHRoZSBzZXJ2ZXIgdGhlbiB0aGluZ3MgYXJlIHNpbXBsaWVyIHNpbmNlXG4gICAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIG1hdGNoIHVwIHRoZSBVSSBjb21wb25lbnQgd2l0aCBhIHByZXZpb3VzbHlcbiAgICAgIC8vIHJlbmRlcmVkIGNvbXBvbmVudCBhbHJlYWR5IG1vdW50ZWQgdG8gdGhlIERPTS4gV2UgYWxzbyBjcmVhdGVcbiAgICAgIC8vIGEgbGlnaHR3ZWlnaHQgU2VydmVyQ29tcG9uZW50XG4gICAgICBjb21wb25lbnQgPSByZWdpc3RyeS5fX19jcmVhdGVDb21wb25lbnQoXG4gICAgICAgIHJlbmRlcmluZ0xvZ2ljLFxuICAgICAgICBpZCxcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIG91dCxcbiAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgIGN1c3RvbUV2ZW50cyxcbiAgICAgICAgb3duZXJDb21wb25lbnRJZCxcbiAgICAgICk7XG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZpbmFsIGlucHV0IGFmdGVyIHJ1bm5pbmcgdGhlIGxpZmVjeWNsZSBtZXRob2RzLlxuICAgICAgLy8gV2Ugd2lsbCBiZSBwYXNzaW5nIHRoZSBpbnB1dCB0byB0aGUgdGVtcGxhdGUgZm9yIHRoZSBgaW5wdXRgIHBhcmFtXG4gICAgICBpbnB1dCA9IGNvbXBvbmVudC5fX191cGRhdGVkSW5wdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc1JlcmVuZGVyICYmXG4gICAgICAgICAgKGNvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFtpZF0pICYmXG4gICAgICAgICAgY29tcG9uZW50Ll9fX3R5cGUgIT09IHR5cGVOYW1lXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIERlc3Ryb3kgdGhlIGV4aXN0aW5nIGNvbXBvbmVudCBzaW5jZVxuICAgICAgICAgIGNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgY29tcG9uZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgIGlzRXhpc3RpbmcgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzRXhpc3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50XG4gICAgICAgICAgY29tcG9uZW50ID0gcmVnaXN0cnkuX19fY3JlYXRlQ29tcG9uZW50KHR5cGVOYW1lLCBpZCk7XG5cbiAgICAgICAgICBpZiAoc2hvdWxkQXBwbHlTcGxpdE1peGlucyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc2hvdWxkQXBwbHlTcGxpdE1peGlucyA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIgcmVuZGVyaW5nTG9naWNQcm9wcyA9XG4gICAgICAgICAgICAgIHR5cGVvZiByZW5kZXJpbmdMb2dpYyA9PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICA/IHJlbmRlcmluZ0xvZ2ljLnByb3RvdHlwZVxuICAgICAgICAgICAgICAgIDogcmVuZGVyaW5nTG9naWM7XG5cbiAgICAgICAgICAgIGNvcHlQcm9wcyhyZW5kZXJpbmdMb2dpY1Byb3BzLCBjb21wb25lbnQuY29uc3RydWN0b3IucHJvdG90eXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhpcyBmbGFnIHRvIHByZXZlbnQgdGhlIGNvbXBvbmVudCBmcm9tIGJlaW5nIHF1ZXVlZCBmb3IgdXBkYXRlXG4gICAgICAgIC8vIGJhc2VkIG9uIHRoZSBuZXcgaW5wdXQuIFRoZSBjb21wb25lbnQgaXMgYWJvdXQgdG8gYmUgcmVyZW5kZXJlZFxuICAgICAgICAvLyBzbyB3ZSBkb24ndCB3YW50IHRvIHF1ZXVlIGl0IHVwIGFzIGEgcmVzdWx0IG9mIGNhbGxpbmcgYHNldElucHV0KClgXG4gICAgICAgIGNvbXBvbmVudC5fX191cGRhdGVRdWV1ZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjdXN0b21FdmVudHMpIHtcbiAgICAgICAgICBjb21wb25lbnQuX19fc2V0Q3VzdG9tRXZlbnRzKGN1c3RvbUV2ZW50cywgb3duZXJDb21wb25lbnRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNFeGlzdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBjb21wb25lbnQuX19fZW1pdENyZWF0ZShpbnB1dCwgb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlucHV0ID0gY29tcG9uZW50Ll9fX3NldElucHV0KGlucHV0LCBvbklucHV0LCBvdXQpO1xuXG4gICAgICAgIGlmIChpc0V4aXN0aW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29tcG9uZW50Ll9fX2lzRGlydHkgPT09IGZhbHNlIHx8XG4gICAgICAgICAgICBjb21wb25lbnQuc2hvdWxkVXBkYXRlKGlucHV0LCBjb21wb25lbnQuX19fc3RhdGUpID09PSBmYWxzZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gV2UgcHV0IGEgcGxhY2Vob2xkZXIgZWxlbWVudCBpbiB0aGUgb3V0cHV0IHN0cmVhbSB0byBlbnN1cmUgdGhhdCB0aGUgZXhpc3RpbmdcbiAgICAgICAgICAgIC8vIERPTSBub2RlIGlzIG1hdGNoZWQgdXAgY29ycmVjdGx5IHdoZW4gdXNpbmcgbW9ycGhkb20uIFdlIGZsYWcgdGhlIFZFbGVtZW50XG4gICAgICAgICAgICAvLyBub2RlIHRvIHRyYWNrIHRoYXQgaXQgaXMgYSBwcmVzZXJ2ZSBtYXJrZXJcbiAgICAgICAgICAgIG91dC5fX19wcmVzZXJ2ZUNvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtpZF0gPSB0cnVlO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fX3Jlc2V0KCk7IC8vIFRoZSBjb21wb25lbnQgaXMgbm8gbG9uZ2VyIGRpcnR5IHNvIHJlc2V0IGludGVybmFsIGZsYWdzXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbXBvbmVudC5fX19nbG9iYWwgPSBvdXQuZ2xvYmFsO1xuICAgICAgY29tcG9uZW50Ll9fX2VtaXRSZW5kZXIob3V0KTtcbiAgICB9XG5cbiAgICB2YXIgY29tcG9uZW50RGVmID0gYmVnaW5Db21wb25lbnQoXG4gICAgICBjb21wb25lbnRzQ29udGV4dCxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIGtleSxcbiAgICAgIG93bmVyQ29tcG9uZW50RGVmLFxuICAgICAgaXNTcGxpdCxcbiAgICAgIGlzSW1wbGljaXRDb21wb25lbnQsXG4gICAgKTtcblxuICAgIGNvbXBvbmVudERlZi5fX19pc0V4aXN0aW5nID0gaXNFeGlzdGluZztcblxuICAgIC8vIFJlbmRlciB0aGUgdGVtcGxhdGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjb21wb25lbnQgdXNpbmcgdGhlIGZpbmFsIHRlbXBsYXRlXG4gICAgLy8gZGF0YSB0aGF0IHdlIGNvbnN0cnVjdGVkXG4gICAgdGVtcGxhdGVSZW5kZXJGdW5jKFxuICAgICAgaW5wdXQsXG4gICAgICBvdXQsXG4gICAgICBjb21wb25lbnREZWYsXG4gICAgICBjb21wb25lbnQsXG4gICAgICBjb21wb25lbnQuX19fcmF3U3RhdGUsXG4gICAgICBvdXQuZ2xvYmFsLFxuICAgICk7XG5cbiAgICBlbmRDb21wb25lbnQob3V0LCBjb21wb25lbnREZWYpO1xuICAgIGNvbXBvbmVudHNDb250ZXh0Ll9fX2NvbXBvbmVudERlZiA9IHBhcmVudENvbXBvbmVudERlZjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSZW5kZXJlckZ1bmM7XG5cbi8vIGV4cG9ydHMgdXNlZCBieSB0aGUgbGVnYWN5IHJlbmRlcmVyXG5jcmVhdGVSZW5kZXJlckZ1bmMuX19fcmVzb2x2ZUNvbXBvbmVudEtleSA9IHJlc29sdmVDb21wb25lbnRLZXk7XG5jcmVhdGVSZW5kZXJlckZ1bmMuX19fdHJhY2tBc3luY0NvbXBvbmVudHMgPSB0cmFja0FzeW5jQ29tcG9uZW50cztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdXBkYXRlc1NjaGVkdWxlZCA9IGZhbHNlO1xudmFyIGJhdGNoU3RhY2sgPSBbXTsgLy8gQSBzdGFjayBvZiBiYXRjaGVkIHVwZGF0ZXNcbnZhciB1bmJhdGNoZWRRdWV1ZSA9IFtdOyAvLyBVc2VkIGZvciBzY2hlZHVsZWQgYmF0Y2hlZCB1cGRhdGVzXG5cbnZhciBzZXRJbW1lZGlhdGUgPSByZXF1aXJlKFwiQGludGVybmFsL3NldC1pbW1lZGlhdGVcIikuX19fc2V0SW1tZWRpYXRlO1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gd2Ugc2NoZWR1bGUgdGhlIHVwZGF0ZSBvZiBcInVuYmF0Y2hlZFwiXG4gKiB1cGRhdGVzIHRvIGNvbXBvbmVudHMuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVVuYmF0Y2hlZENvbXBvbmVudHMoKSB7XG4gIGlmICh1bmJhdGNoZWRRdWV1ZS5sZW5ndGgpIHtcbiAgICB0cnkge1xuICAgICAgdXBkYXRlQ29tcG9uZW50cyh1bmJhdGNoZWRRdWV1ZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIFJlc2V0IHRoZSBmbGFnIG5vdyB0aGF0IHRoaXMgc2NoZWR1bGVkIGJhdGNoIHVwZGF0ZVxuICAgICAgLy8gaXMgY29tcGxldGUgc28gdGhhdCB3ZSBjYW4gbGF0ZXIgc2NoZWR1bGUgYW5vdGhlclxuICAgICAgLy8gYmF0Y2hlZCB1cGRhdGUgaWYgbmVlZGVkXG4gICAgICB1cGRhdGVzU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNjaGVkdWxlVXBkYXRlcygpIHtcbiAgaWYgKHVwZGF0ZXNTY2hlZHVsZWQpIHtcbiAgICAvLyBXZSBoYXZlIGFscmVhZHkgc2NoZWR1bGVkIGEgYmF0Y2hlZCB1cGRhdGUgZm9yIHRoZVxuICAgIC8vIG5leHRUaWNrIHNvIG5vdGhpbmcgdG8gZG9cbiAgICByZXR1cm47XG4gIH1cblxuICB1cGRhdGVzU2NoZWR1bGVkID0gdHJ1ZTtcblxuICBzZXRJbW1lZGlhdGUodXBkYXRlVW5iYXRjaGVkQ29tcG9uZW50cyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudHMocXVldWUpIHtcbiAgLy8gTG9vcCBvdmVyIHRoZSBjb21wb25lbnRzIGluIHRoZSBxdWV1ZSBhbmQgdXBkYXRlIHRoZW0uXG4gIC8vIE5PVEU6IEl0IGlzIG9rYXkgaWYgdGhlIHF1ZXVlIGdyb3dzIGR1cmluZyB0aGUgaXRlcmF0aW9uXG4gIC8vICAgICAgIHNpbmNlIHdlIHdpbGwgc3RpbGwgZ2V0IHRvIHRoZW0gYXQgdGhlIGVuZFxuICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHF1ZXVlW2ldO1xuICAgIGNvbXBvbmVudC5fX191cGRhdGUoKTsgLy8gRG8gdGhlIGFjdHVhbCBjb21wb25lbnQgdXBkYXRlXG4gIH1cblxuICAvLyBDbGVhciBvdXQgdGhlIHF1ZXVlIGJ5IHNldHRpbmcgdGhlIGxlbmd0aCB0byB6ZXJvXG4gIHF1ZXVlLmxlbmd0aCA9IDA7XG59XG5cbmZ1bmN0aW9uIGJhdGNoVXBkYXRlKGZ1bmMpIHtcbiAgLy8gSWYgdGhlIGJhdGNoZWQgdXBkYXRlIHN0YWNrIGlzIGVtcHR5IHRoZW4gdGhpc1xuICAvLyBpcyB0aGUgb3V0ZXIgYmF0Y2hlZCB1cGRhdGUuIEFmdGVyIHRoZSBvdXRlclxuICAvLyBiYXRjaGVkIHVwZGF0ZSBjb21wbGV0ZXMgd2UgaW52b2tlIHRoZSBcImFmdGVyVXBkYXRlXCJcbiAgLy8gZXZlbnQgbGlzdGVuZXJzLlxuICB2YXIgYmF0Y2ggPSBbXTtcblxuICBiYXRjaFN0YWNrLnB1c2goYmF0Y2gpO1xuXG4gIHRyeSB7XG4gICAgZnVuYygpO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICAvLyBVcGRhdGUgYWxsIG9mIHRoZSBjb21wb25lbnRzIHRoYXQgd2hlcmUgcXVldWVkIHVwXG4gICAgICAvLyBpbiB0aGlzIGJhdGNoIChpZiBhbnkpXG4gICAgICB1cGRhdGVDb21wb25lbnRzKGJhdGNoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBjb21wbGV0ZWQgdGhlIHVwZGF0ZSBvZiBhbGwgdGhlIGNvbXBvbmVudHNcbiAgICAgIC8vIGluIHRoaXMgYmF0Y2ggd2UgbmVlZCB0byByZW1vdmUgaXQgb2ZmIHRoZSB0b3Agb2YgdGhlIHN0YWNrXG4gICAgICBiYXRjaFN0YWNrLmxlbmd0aC0tO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBxdWV1ZUNvbXBvbmVudFVwZGF0ZShjb21wb25lbnQpIHtcbiAgdmFyIGJhdGNoU3RhY2tMZW4gPSBiYXRjaFN0YWNrLmxlbmd0aDtcblxuICBpZiAoYmF0Y2hTdGFja0xlbikge1xuICAgIC8vIFdoZW4gYSBiYXRjaCB1cGRhdGUgaXMgc3RhcnRlZCB3ZSBwdXNoIGEgbmV3IGJhdGNoIG9uIHRvIGEgc3RhY2suXG4gICAgLy8gSWYgdGhlIHN0YWNrIGhhcyBhIG5vbi16ZXJvIGxlbmd0aCB0aGVuIHdlIGtub3cgdGhhdCBhIGJhdGNoIGhhc1xuICAgIC8vIGJlZW4gc3RhcnRlZCBzbyB3ZSBjYW4ganVzdCBxdWV1ZSB0aGUgY29tcG9uZW50IG9uIHRoZSB0b3AgYmF0Y2guIFdoZW5cbiAgICAvLyB0aGUgYmF0Y2ggaXMgZW5kZWQgdGhpcyBjb21wb25lbnQgd2lsbCBiZSB1cGRhdGVkLlxuICAgIGJhdGNoU3RhY2tbYmF0Y2hTdGFja0xlbiAtIDFdLnB1c2goY29tcG9uZW50KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBXZSBhcmUgbm90IHdpdGhpbiBhIGJhdGNoZWQgdXBkYXRlLiBXZSBuZWVkIHRvIHNjaGVkdWxlIGEgYmF0Y2ggdXBkYXRlXG4gICAgLy8gZm9yIHRoZSBuZXh0VGljayAoaWYgdGhhdCBoYXNuJ3QgYmVlbiBkb25lIGFscmVhZHkpIGFuZCB3ZSB3aWxsXG4gICAgLy8gYWRkIHRoZSBjb21wb25lbnQgdG8gdGhlIHVuYmF0Y2hlZCBxdWV1ZVxuICAgIHNjaGVkdWxlVXBkYXRlcygpO1xuICAgIHVuYmF0Y2hlZFF1ZXVlLnB1c2goY29tcG9uZW50KTtcbiAgfVxufVxuXG5leHBvcnRzLl9fX3F1ZXVlQ29tcG9uZW50VXBkYXRlID0gcXVldWVDb21wb25lbnRVcGRhdGU7XG5leHBvcnRzLl9fX2JhdGNoVXBkYXRlID0gYmF0Y2hVcGRhdGU7XG4iLCJ2YXIgYWN0dWFsQ3JlYXRlT3V0O1xuXG5mdW5jdGlvbiBzZXRDcmVhdGVPdXQoY3JlYXRlT3V0RnVuYykge1xuICBhY3R1YWxDcmVhdGVPdXQgPSBjcmVhdGVPdXRGdW5jO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPdXQoZ2xvYmFsRGF0YSkge1xuICByZXR1cm4gYWN0dWFsQ3JlYXRlT3V0KGdsb2JhbERhdGEpO1xufVxuXG5jcmVhdGVPdXQuX19fc2V0Q3JlYXRlT3V0ID0gc2V0Q3JlYXRlT3V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU91dDtcbiIsInZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgZGVzdHJveUNvbXBvbmVudEZvck5vZGUgPSBjb21wb25lbnRzVXRpbC5fX19kZXN0cm95Q29tcG9uZW50Rm9yTm9kZTtcbnZhciBkZXN0cm95Tm9kZVJlY3Vyc2l2ZSA9IGNvbXBvbmVudHNVdGlsLl9fX2Rlc3Ryb3lOb2RlUmVjdXJzaXZlO1xudmFyIGhlbHBlcnMgPSByZXF1aXJlKFwiLi92ZG9tL21vcnBoZG9tL2hlbHBlcnNcIik7XG5cbnZhciBpbnNlcnRCZWZvcmUgPSBoZWxwZXJzLl9fX2luc2VydEJlZm9yZTtcbnZhciBpbnNlcnRBZnRlciA9IGhlbHBlcnMuX19faW5zZXJ0QWZ0ZXI7XG52YXIgcmVtb3ZlQ2hpbGQgPSBoZWxwZXJzLl9fX3JlbW92ZUNoaWxkO1xuXG5mdW5jdGlvbiByZXNvbHZlRWwoZWwpIHtcbiAgaWYgKHR5cGVvZiBlbCA9PSBcInN0cmluZ1wiKSB7XG4gICAgdmFyIGVsSWQgPSBlbDtcbiAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsSWQpO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHRocm93IEVycm9yKFwiTm90IGZvdW5kOiBcIiArIGVsSWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZWw7XG59XG5cbmZ1bmN0aW9uIGJlZm9yZVJlbW92ZShyZWZlcmVuY2VFbCkge1xuICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShyZWZlcmVuY2VFbCk7XG4gIGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlKHJlZmVyZW5jZUVsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBnZXRFbCwgYWZ0ZXJJbnNlcnQpIHtcbiAgZXh0ZW5kKHRhcmdldCwge1xuICAgIGFwcGVuZFRvOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICAgIGluc2VydEJlZm9yZShlbCwgbnVsbCwgcmVmZXJlbmNlRWwpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICAgIHByZXBlbmRUbzogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZUVsLmZpcnN0Q2hpbGQgfHwgbnVsbCwgcmVmZXJlbmNlRWwpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICAgIHJlcGxhY2U6IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgYmVmb3JlUmVtb3ZlKHJlZmVyZW5jZUVsKTtcbiAgICAgIGluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlRWwsIHJlZmVyZW5jZUVsLnBhcmVudE5vZGUpO1xuICAgICAgcmVtb3ZlQ2hpbGQocmVmZXJlbmNlRWwpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICAgIHJlcGxhY2VDaGlsZHJlbk9mOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcblxuICAgICAgdmFyIGN1ckNoaWxkID0gcmVmZXJlbmNlRWwuZmlyc3RDaGlsZDtcbiAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjdXJDaGlsZC5uZXh0U2libGluZzsgLy8gSnVzdCBpbiBjYXNlIHRoZSBET00gY2hhbmdlcyB3aGlsZSByZW1vdmluZ1xuICAgICAgICBiZWZvcmVSZW1vdmUoY3VyQ2hpbGQpO1xuICAgICAgICBjdXJDaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgICAgfVxuXG4gICAgICByZWZlcmVuY2VFbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCBudWxsLCByZWZlcmVuY2VFbCk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICAgIGluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlRWwsIHJlZmVyZW5jZUVsLnBhcmVudE5vZGUpO1xuICAgICAgcmV0dXJuIGFmdGVySW5zZXJ0KHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICB9LFxuICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICAgIGluc2VydEFmdGVyKGVsLCByZWZlcmVuY2VFbCwgcmVmZXJlbmNlRWwucGFyZW50Tm9kZSk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gIH0pO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY2FtZWxUb0Rhc2hMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xudmFyIGRhc2hUb0NhbWVsTG9va3VwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiBIZWxwZXIgZm9yIGNvbnZlcnRpbmcgY2FtZWxDYXNlIHRvIGRhc2gtY2FzZS5cbiAqL1xuZXhwb3J0cy5fX19jYW1lbFRvRGFzaENhc2UgPSBmdW5jdGlvbiBjYW1lbFRvRGFzaENhc2UobmFtZSkge1xuICB2YXIgbmFtZURhc2hlZCA9IGNhbWVsVG9EYXNoTG9va3VwW25hbWVdO1xuICBpZiAoIW5hbWVEYXNoZWQpIHtcbiAgICBuYW1lRGFzaGVkID0gY2FtZWxUb0Rhc2hMb29rdXBbbmFtZV0gPSBuYW1lXG4gICAgICAucmVwbGFjZSgvKFtBLVpdKS9nLCBcIi0kMVwiKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAobmFtZURhc2hlZCAhPT0gbmFtZSkge1xuICAgICAgZGFzaFRvQ2FtZWxMb29rdXBbbmFtZURhc2hlZF0gPSBuYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lRGFzaGVkO1xufTtcblxuLyoqXG4gKiBIZWxwZXIgZm9yIGNvbnZlcnRpbmcgZGFzaC1jYXNlIHRvIGNhbWVsQ2FzZS5cbiAqL1xuZXhwb3J0cy5fX19kYXNoVG9DYW1lbENhc2UgPSBmdW5jdGlvbiBkYXNoVG9DYW1lbENhc2UobmFtZSkge1xuICB2YXIgbmFtZUNhbWVsID0gZGFzaFRvQ2FtZWxMb29rdXBbbmFtZV07XG4gIGlmICghbmFtZUNhbWVsKSB7XG4gICAgbmFtZUNhbWVsID0gZGFzaFRvQ2FtZWxMb29rdXBbbmFtZV0gPSBuYW1lLnJlcGxhY2UoXG4gICAgICAvLShbYS16XSkvZyxcbiAgICAgIG1hdGNoVG9VcHBlckNhc2UsXG4gICAgKTtcblxuICAgIGlmIChuYW1lQ2FtZWwgIT09IG5hbWUpIHtcbiAgICAgIGNhbWVsVG9EYXNoTG9va3VwW25hbWVDYW1lbF0gPSBuYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lQ2FtZWw7XG59O1xuXG5mdW5jdGlvbiBtYXRjaFRvVXBwZXJDYXNlKF8sIGNoYXIpIHtcbiAgcmV0dXJuIGNoYXIudG9VcHBlckNhc2UoKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsYXNzSGVscGVyKGFyZykge1xuICBzd2l0Y2ggKHR5cGVvZiBhcmcpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gYXJnIHx8IHVuZGVmaW5lZDtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICAgIHZhciBzZXAgPSBcIlwiO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBjbGFzc0hlbHBlcihhcmdbaV0pO1xuICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHNlcCArIHZhbHVlO1xuICAgICAgICAgICAgc2VwID0gXCIgXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG4gICAgICAgICAgaWYgKGFyZ1trZXldKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc2VwICsga2V5O1xuICAgICAgICAgICAgc2VwID0gXCIgXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQgfHwgdW5kZWZpbmVkO1xuICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjaGFuZ2VDYXNlID0gcmVxdWlyZShcIi4vX2NoYW5nZS1jYXNlXCIpO1xuXG4vKipcbiAqIEhlbHBlciBmb3IgZ2VuZXJhdGluZyB0aGUgc3RyaW5nIGZvciBhIHN0eWxlIGF0dHJpYnV0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlSGVscGVyKHN0eWxlKSB7XG4gIGlmICghc3R5bGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdHlsZTtcblxuICBpZiAodHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHZhciBzdHlsZXMgPSBcIlwiO1xuICAgIHZhciBzZXAgPSBcIlwiO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3R5bGUpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3R5bGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHQgPSBzdHlsZUhlbHBlcihzdHlsZVtpXSk7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc3R5bGVzICs9IHNlcCArIG5leHQ7XG4gICAgICAgICAgc2VwID0gXCI7XCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc3R5bGVbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlICs9IFwicHhcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHlsZXMgKz0gc2VwICsgY2hhbmdlQ2FzZS5fX19jYW1lbFRvRGFzaENhc2UobmFtZSkgKyBcIjpcIiArIHZhbHVlO1xuICAgICAgICAgIHNlcCA9IFwiO1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcyB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gc3R5bGU7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xudmFyIHNldEltbWVkaWF0ZSA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvc2V0LWltbWVkaWF0ZVwiKS5fX19zZXRJbW1lZGlhdGU7XG52YXIgZGVmYXVsdENyZWF0ZU91dCA9IHJlcXVpcmUoXCIuL2NyZWF0ZU91dFwiKTtcblxuZnVuY3Rpb24gc2FmZVJlbmRlcihyZW5kZXJGdW5jLCBmaW5hbERhdGEsIGZpbmFsT3V0LCBzaG91bGRFbmQpIHtcbiAgdHJ5IHtcbiAgICByZW5kZXJGdW5jKGZpbmFsRGF0YSwgZmluYWxPdXQpO1xuXG4gICAgaWYgKHNob3VsZEVuZCkge1xuICAgICAgZmluYWxPdXQuZW5kKCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB2YXIgYWN0dWFsRW5kID0gZmluYWxPdXQuZW5kO1xuICAgIGZpbmFsT3V0LmVuZCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZpbmFsT3V0LmVuZCA9IGFjdHVhbEVuZDtcbiAgICAgIGZpbmFsT3V0LmVycm9yKGVycik7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGZpbmFsT3V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHJlbmRlcmVyKSB7XG4gIHZhciByZW5kZXJGdW5jID1cbiAgICByZW5kZXJlciAmJiAocmVuZGVyZXIucmVuZGVyZXIgfHwgcmVuZGVyZXIucmVuZGVyIHx8IHJlbmRlcmVyKTtcbiAgdmFyIGNyZWF0ZU91dCA9IHRhcmdldC5jcmVhdGVPdXQgfHwgcmVuZGVyZXIuY3JlYXRlT3V0IHx8IGRlZmF1bHRDcmVhdGVPdXQ7XG5cbiAgcmV0dXJuIGV4dGVuZCh0YXJnZXQsIHtcbiAgICBfOiByZW5kZXJGdW5jLFxuICAgIGNyZWF0ZU91dDogY3JlYXRlT3V0LFxuXG4gICAgcmVuZGVyVG9TdHJpbmc6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGxvY2FsRGF0YSA9IGRhdGEgfHwge307XG4gICAgICB2YXIgcmVuZGVyID0gcmVuZGVyRnVuYyB8fCB0aGlzLl87XG4gICAgICB2YXIgZ2xvYmFsRGF0YSA9IGxvY2FsRGF0YS4kZ2xvYmFsO1xuICAgICAgdmFyIG91dCA9IGNyZWF0ZU91dChnbG9iYWxEYXRhKTtcblxuICAgICAgb3V0Lmdsb2JhbC50ZW1wbGF0ZSA9IHRoaXM7XG5cbiAgICAgIGlmIChnbG9iYWxEYXRhKSB7XG4gICAgICAgIGxvY2FsRGF0YS4kZ2xvYmFsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgb3V0XG4gICAgICAgICAgLm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG91dC50b1N0cmluZygpLCBvdXQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uY2UoXCJlcnJvclwiLCBjYWxsYmFjayk7XG5cbiAgICAgICAgcmV0dXJuIHNhZmVSZW5kZXIocmVuZGVyLCBsb2NhbERhdGEsIG91dCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQuc3luYygpO1xuICAgICAgICByZW5kZXIobG9jYWxEYXRhLCBvdXQpO1xuICAgICAgICByZXR1cm4gb3V0LnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlclN5bmM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgbG9jYWxEYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgIHZhciByZW5kZXIgPSByZW5kZXJGdW5jIHx8IHRoaXMuXztcbiAgICAgIHZhciBnbG9iYWxEYXRhID0gbG9jYWxEYXRhLiRnbG9iYWw7XG4gICAgICB2YXIgb3V0ID0gY3JlYXRlT3V0KGdsb2JhbERhdGEpO1xuICAgICAgb3V0LnN5bmMoKTtcblxuICAgICAgb3V0Lmdsb2JhbC50ZW1wbGF0ZSA9IHRoaXM7XG5cbiAgICAgIGlmIChnbG9iYWxEYXRhKSB7XG4gICAgICAgIGxvY2FsRGF0YS4kZ2xvYmFsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIobG9jYWxEYXRhLCBvdXQpO1xuICAgICAgcmV0dXJuIG91dC5fX19nZXRSZXN1bHQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyBhIHRlbXBsYXRlIHRvIG5vZGVzIGFuZCBpbnNlcnRzIHRoZW0gaW50byB0aGUgRE9NIHJlbGF0aXZlXG4gICAgICogdG8gdGhlIHByb3ZpZGVkIHJlZmVyZW5jZSBiYXNlZCBvbiB0aGUgb3B0aW9uYWwgcG9zaXRpb24gcGFyYW1ldGVyLlxuICAgICAqXG4gICAgICogU3VwcG9ydGVkIHNpZ25hdHVyZXM6XG4gICAgICpcbiAgICAgKiBtb3VudChkYXRhLCByZWZlcmVuY2UpXG4gICAgICogbW91bnQoZGF0YSwgcmVmZXJlbmNlLCBwb3NpdGlvbilcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBUaGUgdmlldyBtb2RlbCBkYXRhIGZvciB0aGUgdGVtcGxhdGVcbiAgICAgKiBAcGFyYW0gIHtOb2RlfSByZWZlcmVuY2UgRE9NIG5vZGUgdG8gaW5zZXJ0IHRoZSByZW5kZXJlZCBub2RlKHMpIHJlbGF0aXZlIHRvXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBbcG9zaXRpb25dIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGByZWZlcmVuY2VgOyBtdXN0IG1hdGNoIChjYXNlLWluc2Vuc2l0aXZlbHkpIG9uZSBvZiB0aGUgZm9sbG93aW5nIHN0cmluZ3M6XG4gICAgICogICdiZWZvcmViZWdpbic6IEJlZm9yZSB0aGUgdGFyZ2V0RWxlbWVudCBpdHNlbGYuXG4gICAgICogICdhZnRlcmJlZ2luJzogSnVzdCBpbnNpZGUgdGhlIHRhcmdldEVsZW1lbnQsIGJlZm9yZSBpdHMgZmlyc3QgY2hpbGQuXG4gICAgICogICdiZWZvcmVlbmQnOiBKdXN0IGluc2lkZSB0aGUgdGFyZ2V0RWxlbWVudCwgYWZ0ZXIgaXRzIGxhc3QgY2hpbGQuXG4gICAgICogICdhZnRlcmVuZCc6IEFmdGVyIHRoZSB0YXJnZXRFbGVtZW50IGl0c2VsZi5cbiAgICAgKiBAcmV0dXJuIHtUZW1wbGF0ZUluc3RhbmNlfSBPYmplY3Qgd2l0aCBgdXBkYXRlYCBhbmQgYGRpc3Bvc2VgIG1ldGhvZHNcbiAgICAgKi9cbiAgICBtb3VudDogZnVuY3Rpb24gKGRhdGEsIHJlZmVyZW5jZSwgcG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucmVuZGVyU3luYyhkYXRhKTtcblxuICAgICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgICBjYXNlIFwiYWZ0ZXJiZWdpblwiOlxuICAgICAgICAgIHJlc3VsdC5wcmVwZW5kVG8ocmVmZXJlbmNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImFmdGVyZW5kXCI6XG4gICAgICAgICAgcmVzdWx0Lmluc2VydEFmdGVyKHJlZmVyZW5jZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJiZWZvcmViZWdpblwiOlxuICAgICAgICAgIHJlc3VsdC5pbnNlcnRCZWZvcmUocmVmZXJlbmNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXN1bHQuYXBwZW5kVG8ocmVmZXJlbmNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gcmVzdWx0LmdldENvbXBvbmVudCgpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cGRhdGUoaW5wdXQpIHtcbiAgICAgICAgICBjb21wb25lbnQuaW5wdXQgPSBpbnB1dDtcbiAgICAgICAgICBjb21wb25lbnQudXBkYXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgYSB0ZW1wbGF0ZSB0byBlaXRoZXIgYSBzdHJlYW0gKGlmIHRoZSBsYXN0XG4gICAgICogYXJndW1lbnQgaXMgYSBTdHJlYW0gaW5zdGFuY2UpIG9yXG4gICAgICogcHJvdmlkZXMgdGhlIG91dHB1dCB0byBhIGNhbGxiYWNrIGZ1bmN0aW9uIChpZiB0aGUgbGFzdFxuICAgICAqIGFyZ3VtZW50IGlzIGEgRnVuY3Rpb24pLlxuICAgICAqXG4gICAgICogU3VwcG9ydGVkIHNpZ25hdHVyZXM6XG4gICAgICpcbiAgICAgKiByZW5kZXIoZGF0YSlcbiAgICAgKiByZW5kZXIoZGF0YSwgb3V0KVxuICAgICAqIHJlbmRlcihkYXRhLCBzdHJlYW0pXG4gICAgICogcmVuZGVyKGRhdGEsIGNhbGxiYWNrKVxuICAgICAqXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBkYXRhIFRoZSB2aWV3IG1vZGVsIGRhdGEgZm9yIHRoZSB0ZW1wbGF0ZVxuICAgICAqIEBwYXJhbSAge0FzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXJ9IG91dCBBIFN0cmVhbSwgYW4gQXN5bmNTdHJlYW0vQXN5bmNWRE9NQnVpbGRlciBpbnN0YW5jZSwgb3IgYSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm4ge0FzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXJ9IFJldHVybnMgdGhlIEFzeW5jU3RyZWFtL0FzeW5jVkRPTUJ1aWxkZXIgaW5zdGFuY2UgdGhhdCB0aGUgdGVtcGxhdGUgaXMgcmVuZGVyZWQgdG9cbiAgICAgKi9cbiAgICByZW5kZXI6IGZ1bmN0aW9uIChkYXRhLCBvdXQpIHtcbiAgICAgIHZhciBjYWxsYmFjaztcbiAgICAgIHZhciBmaW5hbE91dDtcbiAgICAgIHZhciBmaW5hbERhdGE7XG4gICAgICB2YXIgZ2xvYmFsRGF0YTtcbiAgICAgIHZhciByZW5kZXIgPSByZW5kZXJGdW5jIHx8IHRoaXMuXztcbiAgICAgIHZhciBzaG91bGRCdWZmZXIgPSB0aGlzLl9fX3Nob3VsZEJ1ZmZlcjtcbiAgICAgIHZhciBzaG91bGRFbmQgPSB0cnVlO1xuXG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBmaW5hbERhdGEgPSBkYXRhO1xuICAgICAgICBpZiAoKGdsb2JhbERhdGEgPSBkYXRhLiRnbG9iYWwpKSB7XG4gICAgICAgICAgZmluYWxEYXRhLiRnbG9iYWwgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbmFsRGF0YSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiAob3V0ICYmIG91dC5fX19pc091dCkge1xuICAgICAgICBmaW5hbE91dCA9IG91dDtcbiAgICAgICAgc2hvdWxkRW5kID0gZmFsc2U7XG4gICAgICAgIGV4dGVuZChvdXQuZ2xvYmFsLCBnbG9iYWxEYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG91dCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZmluYWxPdXQgPSBjcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG4gICAgICAgIGNhbGxiYWNrID0gb3V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluYWxPdXQgPSBjcmVhdGVPdXQoXG4gICAgICAgICAgZ2xvYmFsRGF0YSwgLy8gZ2xvYmFsXG4gICAgICAgICAgb3V0LCAvLyB3cml0ZXIoQXN5bmNTdHJlYW0pIG9yIHBhcmVudE5vZGUoQXN5bmNWRE9NQnVpbGRlcilcbiAgICAgICAgICB1bmRlZmluZWQsIC8vIHBhcmVudE91dFxuICAgICAgICAgIHNob3VsZEJ1ZmZlciwgLy8gaWdub3JlZCBieSBBc3luY1ZET01CdWlsZGVyXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBmaW5hbE91dFxuICAgICAgICAgIC5vbihcImZpbmlzaFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBmaW5hbE91dC5fX19nZXRSZXN1bHQoKSwgZmluYWxPdXQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uY2UoXCJlcnJvclwiLCBjYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIGdsb2JhbERhdGEgPSBmaW5hbE91dC5nbG9iYWw7XG5cbiAgICAgIGdsb2JhbERhdGEudGVtcGxhdGUgPSBnbG9iYWxEYXRhLnRlbXBsYXRlIHx8IHRoaXM7XG5cbiAgICAgIHJldHVybiBzYWZlUmVuZGVyKHJlbmRlciwgZmluYWxEYXRhLCBmaW5hbE91dCwgc2hvdWxkRW5kKTtcbiAgICB9LFxuICB9KTtcbn07XG4iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50cy1saWdodFwiKTtcbnZhciBSZW5kZXJSZXN1bHQgPSByZXF1aXJlKFwiLi4vUmVuZGVyUmVzdWx0XCIpO1xudmFyIGF0dHJzSGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9hdHRyc1wiKTtcbnZhciBtb3JwaGRvbSA9IHJlcXVpcmUoXCIuL21vcnBoZG9tXCIpO1xudmFyIHZkb20gPSByZXF1aXJlKFwiLi92ZG9tXCIpO1xudmFyIFZFbGVtZW50ID0gdmRvbS5fX19WRWxlbWVudDtcbnZhciBWRG9jdW1lbnRGcmFnbWVudCA9IHZkb20uX19fVkRvY3VtZW50RnJhZ21lbnQ7XG52YXIgVlRleHQgPSB2ZG9tLl9fX1ZUZXh0O1xudmFyIFZDb21wb25lbnQgPSB2ZG9tLl9fX1ZDb21wb25lbnQ7XG52YXIgVkZyYWdtZW50ID0gdmRvbS5fX19WRnJhZ21lbnQ7XG52YXIgdmlydHVhbGl6ZUhUTUwgPSB2ZG9tLl9fX3ZpcnR1YWxpemVIVE1MO1xuXG52YXIgRVZFTlRfVVBEQVRFID0gXCJ1cGRhdGVcIjtcbnZhciBFVkVOVF9GSU5JU0ggPSBcImZpbmlzaFwiO1xuXG5mdW5jdGlvbiBTdGF0ZSh0cmVlKSB7XG4gIHRoaXMuX19fZXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB0aGlzLl9fX3RyZWUgPSB0cmVlO1xuICB0aGlzLl9fX2ZpbmlzaGVkID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIEFzeW5jVkRPTUJ1aWxkZXIoZ2xvYmFsRGF0YSwgcGFyZW50Tm9kZSwgcGFyZW50T3V0KSB7XG4gIGlmICghcGFyZW50Tm9kZSkge1xuICAgIHBhcmVudE5vZGUgPSBuZXcgVkRvY3VtZW50RnJhZ21lbnQoKTtcbiAgfVxuXG4gIHZhciBzdGF0ZTtcblxuICBpZiAocGFyZW50T3V0KSB7XG4gICAgc3RhdGUgPSBwYXJlbnRPdXQuX19fc3RhdGU7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUgPSBuZXcgU3RhdGUocGFyZW50Tm9kZSk7XG4gIH1cblxuICB0aGlzLl9fX3JlbWFpbmluZyA9IDE7XG4gIHRoaXMuX19fbGFzdENvdW50ID0gMDtcbiAgdGhpcy5fX19sYXN0ID0gbnVsbDtcbiAgdGhpcy5fX19wYXJlbnRPdXQgPSBwYXJlbnRPdXQ7XG5cbiAgdGhpcy5kYXRhID0ge307XG4gIHRoaXMuX19fc3RhdGUgPSBzdGF0ZTtcbiAgdGhpcy5fX19wYXJlbnQgPSBwYXJlbnROb2RlO1xuICB0aGlzLmdsb2JhbCA9IGdsb2JhbERhdGEgfHwge307XG4gIHRoaXMuX19fc3RhY2sgPSBbcGFyZW50Tm9kZV07XG4gIHRoaXMuX19fc3luYyA9IGZhbHNlO1xuICB0aGlzLl9fX3Zub2RlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX2NvbXBvbmVudHMgPSBudWxsO1xuXG4gIHRoaXMuX19fYXNzaWduZWRDb21wb25lbnREZWYgPSBudWxsO1xuICB0aGlzLl9fX2Fzc2lnbmVkS2V5ID0gbnVsbDtcbiAgdGhpcy5fX19hc3NpZ25lZEN1c3RvbUV2ZW50cyA9IG51bGw7XG59XG5cbnZhciBwcm90byA9IChBc3luY1ZET01CdWlsZGVyLnByb3RvdHlwZSA9IHtcbiAgX19faXNPdXQ6IHRydWUsXG4gIF9fX2hvc3Q6IHR5cGVvZiBkb2N1bWVudCA9PT0gXCJvYmplY3RcIiAmJiBkb2N1bWVudCxcblxuICBiYzogZnVuY3Rpb24gKGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCkge1xuICAgIHZhciB2Q29tcG9uZW50ID0gbmV3IFZDb21wb25lbnQoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50KTtcbiAgICByZXR1cm4gdGhpcy5fX19iZWdpbk5vZGUodkNvbXBvbmVudCwgMCwgdHJ1ZSk7XG4gIH0sXG5cbiAgX19fcHJlc2VydmVDb21wb25lbnQ6IGZ1bmN0aW9uIChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQpIHtcbiAgICB2YXIgdkNvbXBvbmVudCA9IG5ldyBWQ29tcG9uZW50KGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCwgdHJ1ZSk7XG4gICAgdGhpcy5fX19iZWdpbk5vZGUodkNvbXBvbmVudCwgMCk7XG4gIH0sXG5cbiAgX19fYmVnaW5Ob2RlOiBmdW5jdGlvbiAoY2hpbGQsIGNoaWxkQ291bnQsIHB1c2hUb1N0YWNrKSB7XG4gICAgdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIGlmIChwdXNoVG9TdGFjayA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5fX19zdGFjay5wdXNoKGNoaWxkKTtcbiAgICAgIHRoaXMuX19fcGFyZW50ID0gY2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZENvdW50ID09PSAwID8gdGhpcyA6IGNoaWxkO1xuICB9LFxuXG4gIGVsZW1lbnQ6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBjb21wb25lbnQsIGNoaWxkQ291bnQsIGZsYWdzLCBwcm9wcykge1xuICAgIHZhciBlbGVtZW50ID0gbmV3IFZFbGVtZW50KFxuICAgICAgdGFnTmFtZSxcbiAgICAgIGF0dHJzLFxuICAgICAga2V5LFxuICAgICAgY29tcG9uZW50LFxuICAgICAgY2hpbGRDb3VudCxcbiAgICAgIGZsYWdzLFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5fX19iZWdpbk5vZGUoZWxlbWVudCwgY2hpbGRDb3VudCk7XG4gIH0sXG5cbiAgX19fZWxlbWVudER5bmFtaWM6IGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywga2V5LCBjb21wb25lbnREZWYsIHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudChcbiAgICAgIHRhZ05hbWUsXG4gICAgICBhdHRyc0hlbHBlcihhdHRycyksXG4gICAgICBrZXksXG4gICAgICBjb21wb25lbnREZWYuX19fY29tcG9uZW50LFxuICAgICAgMCxcbiAgICAgIDAsXG4gICAgICBwcm9wcyxcbiAgICApO1xuICB9LFxuXG4gIG46IGZ1bmN0aW9uIChub2RlLCBjb21wb25lbnQpIHtcbiAgICAvLyBOT1RFOiBXZSBkbyBhIHNoYWxsb3cgY2xvbmUgc2luY2Ugd2UgYXNzdW1lIHRoZSBub2RlIGlzIGJlaW5nIHJldXNlZFxuICAgIC8vICAgICAgIGFuZCBhIG5vZGUgY2FuIG9ubHkgaGF2ZSBvbmUgcGFyZW50IG5vZGUuXG4gICAgdmFyIGNsb25lID0gbm9kZS5fX19jbG9uZU5vZGUoKTtcbiAgICB0aGlzLm5vZGUoY2xvbmUpO1xuICAgIGNsb25lLl9fX293bmVyQ29tcG9uZW50ID0gY29tcG9uZW50O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgbm9kZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB0aGlzLl9fX3BhcmVudC5fX19hcHBlbmRDaGlsZChub2RlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0ZXh0OiBmdW5jdGlvbiAodGV4dCwgb3duZXJDb21wb25lbnQpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiB0ZXh0O1xuXG4gICAgaWYgKHR5cGUgIT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKHRleHQudG9IVE1MKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaCh0ZXh0LnRvSFRNTCgpLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGV4dCA9IHRleHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fX3BhcmVudC5fX19hcHBlbmRDaGlsZChuZXcgVlRleHQodGV4dCwgb3duZXJDb21wb25lbnQpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBodG1sOiBmdW5jdGlvbiAoaHRtbCwgb3duZXJDb21wb25lbnQpIHtcbiAgICBpZiAoaHRtbCAhPSBudWxsKSB7XG4gICAgICB2YXIgdmRvbU5vZGUgPSB2aXJ0dWFsaXplSFRNTChodG1sLCBvd25lckNvbXBvbmVudCk7XG4gICAgICB0aGlzLm5vZGUodmRvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGJlZ2luRWxlbWVudDogZnVuY3Rpb24gKFxuICAgIHRhZ05hbWUsXG4gICAgYXR0cnMsXG4gICAga2V5LFxuICAgIGNvbXBvbmVudCxcbiAgICBjaGlsZENvdW50LFxuICAgIGZsYWdzLFxuICAgIHByb3BzLFxuICApIHtcbiAgICB2YXIgZWxlbWVudCA9IG5ldyBWRWxlbWVudChcbiAgICAgIHRhZ05hbWUsXG4gICAgICBhdHRycyxcbiAgICAgIGtleSxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIGNoaWxkQ291bnQsXG4gICAgICBmbGFncyxcbiAgICAgIHByb3BzLFxuICAgICk7XG4gICAgdGhpcy5fX19iZWdpbk5vZGUoZWxlbWVudCwgY2hpbGRDb3VudCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgX19fYmVnaW5FbGVtZW50RHluYW1pYzogZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBrZXksIGNvbXBvbmVudERlZiwgcHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5iZWdpbkVsZW1lbnQoXG4gICAgICB0YWdOYW1lLFxuICAgICAgYXR0cnNIZWxwZXIoYXR0cnMpLFxuICAgICAga2V5LFxuICAgICAgY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudCxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgfSxcblxuICBiZjogZnVuY3Rpb24gKGtleSwgY29tcG9uZW50LCBwcmVzZXJ2ZSkge1xuICAgIHZhciBmcmFnbWVudCA9IG5ldyBWRnJhZ21lbnQoa2V5LCBjb21wb25lbnQsIHByZXNlcnZlKTtcbiAgICB0aGlzLl9fX2JlZ2luTm9kZShmcmFnbWVudCwgbnVsbCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgZWY6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuZEVsZW1lbnQoKTtcbiAgfSxcblxuICBlbmRFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YWNrID0gdGhpcy5fX19zdGFjaztcbiAgICBzdGFjay5wb3AoKTtcbiAgICB0aGlzLl9fX3BhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICB9LFxuXG4gIGVuZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX19fcGFyZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyIHJlbWFpbmluZyA9IC0tdGhpcy5fX19yZW1haW5pbmc7XG4gICAgdmFyIHBhcmVudE91dCA9IHRoaXMuX19fcGFyZW50T3V0O1xuXG4gICAgaWYgKHJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgaWYgKHBhcmVudE91dCkge1xuICAgICAgICBwYXJlbnRPdXQuX19faGFuZGxlQ2hpbGREb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fX2RvRmluaXNoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZW1haW5pbmcgLSB0aGlzLl9fX2xhc3RDb3VudCA9PT0gMCkge1xuICAgICAgdGhpcy5fX19lbWl0TGFzdCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9fX2hhbmRsZUNoaWxkRG9uZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZW1haW5pbmcgPSAtLXRoaXMuX19fcmVtYWluaW5nO1xuXG4gICAgaWYgKHJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgdmFyIHBhcmVudE91dCA9IHRoaXMuX19fcGFyZW50T3V0O1xuICAgICAgaWYgKHBhcmVudE91dCkge1xuICAgICAgICBwYXJlbnRPdXQuX19faGFuZGxlQ2hpbGREb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fX2RvRmluaXNoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZW1haW5pbmcgLSB0aGlzLl9fX2xhc3RDb3VudCA9PT0gMCkge1xuICAgICAgdGhpcy5fX19lbWl0TGFzdCgpO1xuICAgIH1cbiAgfSxcblxuICBfX19kb0ZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgc3RhdGUuX19fZmluaXNoZWQgPSB0cnVlO1xuICAgIHN0YXRlLl9fX2V2ZW50cy5lbWl0KEVWRU5UX0ZJTklTSCwgdGhpcy5fX19nZXRSZXN1bHQoKSk7XG4gIH0sXG5cbiAgX19fZW1pdExhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGFzdEFycmF5ID0gdGhpcy5fbGFzdDtcblxuICAgIHZhciBpID0gMDtcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBpZiAoaSA9PT0gbGFzdEFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbGFzdENhbGxiYWNrID0gbGFzdEFycmF5W2krK107XG4gICAgICBsYXN0Q2FsbGJhY2sobmV4dCk7XG5cbiAgICAgIGlmICghbGFzdENhbGxiYWNrLmxlbmd0aCkge1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV4dCgpO1xuICB9LFxuXG4gIGVycm9yOiBmdW5jdGlvbiAoZSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gbGlzdGVuZXIgZm9yIHRoZSBlcnJvciBldmVudCB0aGVuIGl0IHdpbGxcbiAgICAgIC8vIHRocm93IGEgbmV3IEVycm9yIGhlcmUuIEluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSBhc3luYyBmcmFnbWVudFxuICAgICAgLy8gaXMgc3RpbGwgcHJvcGVybHkgZW5kZWQgd2UgbmVlZCB0byBwdXQgdGhlIGVuZCgpIGluIGEgYGZpbmFsbHlgXG4gICAgICAvLyBibG9ja1xuICAgICAgdGhpcy5lbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBiZWdpbkFzeW5jOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGlmICh0aGlzLl9fX3N5bmMpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIlRyaWVkIHRvIHJlbmRlciBhc3luYyB3aGlsZSBpbiBzeW5jIG1vZGUuIE5vdGU6IENsaWVudCBzaWRlIGF3YWl0IGlzIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkIGluIHJlLXJlbmRlcnMgKElzc3VlOiAjOTQyKS5cIixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy5sYXN0KSB7XG4gICAgICAgIHRoaXMuX19fbGFzdENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fX19yZW1haW5pbmcrKztcblxuICAgIHZhciBkb2N1bWVudEZyYWdtZW50ID0gdGhpcy5fX19wYXJlbnQuX19fYXBwZW5kRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciBhc3luY091dCA9IG5ldyBBc3luY1ZET01CdWlsZGVyKHRoaXMuZ2xvYmFsLCBkb2N1bWVudEZyYWdtZW50LCB0aGlzKTtcblxuICAgIHN0YXRlLl9fX2V2ZW50cy5lbWl0KFwiYmVnaW5Bc3luY1wiLCB7XG4gICAgICBvdXQ6IGFzeW5jT3V0LFxuICAgICAgcGFyZW50T3V0OiB0aGlzLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFzeW5jT3V0O1xuICB9LFxuXG4gIGNyZWF0ZU91dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgQXN5bmNWRE9NQnVpbGRlcih0aGlzLmdsb2JhbCk7XG4gIH0sXG5cbiAgZmx1c2g6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5fX19zdGF0ZS5fX19ldmVudHM7XG5cbiAgICBpZiAoZXZlbnRzLmxpc3RlbmVyQ291bnQoRVZFTlRfVVBEQVRFKSkge1xuICAgICAgZXZlbnRzLmVtaXQoRVZFTlRfVVBEQVRFLCBuZXcgUmVuZGVyUmVzdWx0KHRoaXMpKTtcbiAgICB9XG4gIH0sXG5cbiAgX19fZ2V0T3V0cHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fc3RhdGUuX19fdHJlZTtcbiAgfSxcblxuICBfX19nZXRSZXN1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19yZXN1bHQgfHwgKHRoaXMuX19fcmVzdWx0ID0gbmV3IFJlbmRlclJlc3VsdCh0aGlzKSk7XG4gIH0sXG5cbiAgb246IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKGV2ZW50ID09PSBFVkVOVF9GSU5JU0ggJiYgc3RhdGUuX19fZmluaXNoZWQpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMuX19fZ2V0UmVzdWx0KCkpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IFwibGFzdFwiKSB7XG4gICAgICB0aGlzLm9uTGFzdChjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLl9fX2V2ZW50cy5vbihldmVudCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKGV2ZW50ID09PSBFVkVOVF9GSU5JU0ggJiYgc3RhdGUuX19fZmluaXNoZWQpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMuX19fZ2V0UmVzdWx0KCkpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IFwibGFzdFwiKSB7XG4gICAgICB0aGlzLm9uTGFzdChjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLl9fX2V2ZW50cy5vbmNlKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKHR5cGUsIGFyZykge1xuICAgIHZhciBldmVudHMgPSB0aGlzLl9fX3N0YXRlLl9fX2V2ZW50cztcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgZXZlbnRzLmVtaXQodHlwZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBldmVudHMuZW1pdCh0eXBlLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGV2ZW50cy5lbWl0LmFwcGx5KGV2ZW50cywgYXJndW1lbnRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50cyA9IHRoaXMuX19fc3RhdGUuX19fZXZlbnRzO1xuICAgIGV2ZW50cy5yZW1vdmVMaXN0ZW5lci5hcHBseShldmVudHMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgc3luYzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX19fc3luYyA9IHRydWU7XG4gIH0sXG5cbiAgaXNTeW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fc3luYztcbiAgfSxcblxuICBvbkxhc3Q6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciBsYXN0QXJyYXkgPSB0aGlzLl9sYXN0O1xuXG4gICAgaWYgKGxhc3RBcnJheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9sYXN0ID0gW2NhbGxiYWNrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdEFycmF5LnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9fX2dldE5vZGU6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9fX3Zub2RlO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgdmFyIHZkb21UcmVlID0gdGhpcy5fX19nZXRPdXRwdXQoKTtcblxuICAgICAgaWYgKCFob3N0KSBob3N0ID0gdGhpcy5fX19ob3N0O1xuICAgICAgdGhpcy5fX192bm9kZSA9IG5vZGUgPSB2ZG9tVHJlZS5fX19hY3R1YWxpemUoaG9zdCwgbnVsbCk7XG4gICAgICBtb3JwaGRvbShub2RlLCB2ZG9tVHJlZSwgaG9zdCwgdGhpcy5fX19jb21wb25lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG5cbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIGRvY0ZyYWdtZW50ID0gdGhpcy5fX19nZXROb2RlKGhvc3QpO1xuICAgIHZhciBodG1sID0gXCJcIjtcblxuICAgIHZhciBjaGlsZCA9IGRvY0ZyYWdtZW50LmZpcnN0Q2hpbGQ7XG4gICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjaGlsZC5uZXh0U2libGluZztcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPSAxKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2NGcmFnbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZC5jbG9uZU5vZGUoKSk7XG4gICAgICAgIGh0bWwgKz0gY29udGFpbmVyLmlubmVySFRNTDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGh0bWwgKz0gY2hpbGQub3V0ZXJIVE1MO1xuICAgICAgfVxuXG4gICAgICBjaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBodG1sO1xuICB9LFxuXG4gIHRoZW46IGZ1bmN0aW9uIChmbiwgZm5FcnIpIHtcbiAgICB2YXIgb3V0ID0gdGhpcztcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIG91dC5vbihcImVycm9yXCIsIHJlamVjdCkub24oRVZFTlRfRklOSVNILCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwcm9taXNlKS50aGVuKGZuLCBmbkVycik7XG4gIH0sXG5cbiAgY2F0Y2g6IGZ1bmN0aW9uIChmbkVycikge1xuICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBmbkVycik7XG4gIH0sXG5cbiAgaXNWRE9NOiB0cnVlLFxuXG4gIGM6IGZ1bmN0aW9uIChjb21wb25lbnREZWYsIGtleSwgY3VzdG9tRXZlbnRzKSB7XG4gICAgdGhpcy5fX19hc3NpZ25lZENvbXBvbmVudERlZiA9IGNvbXBvbmVudERlZjtcbiAgICB0aGlzLl9fX2Fzc2lnbmVkS2V5ID0ga2V5O1xuICAgIHRoaXMuX19fYXNzaWduZWRDdXN0b21FdmVudHMgPSBjdXN0b21FdmVudHM7XG4gIH0sXG59KTtcblxucHJvdG8uZSA9IHByb3RvLmVsZW1lbnQ7XG5wcm90by5iZSA9IHByb3RvLmJlZ2luRWxlbWVudDtcbnByb3RvLmVlID0gcHJvdG8uX19fZW5kRWxlbWVudCA9IHByb3RvLmVuZEVsZW1lbnQ7XG5wcm90by50ID0gcHJvdG8udGV4dDtcbnByb3RvLmggPSBwcm90by53ID0gcHJvdG8ud3JpdGUgPSBwcm90by5odG1sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFzeW5jVkRPTUJ1aWxkZXI7XG4iLCJ2YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG5cbmZ1bmN0aW9uIFZDb21wb25lbnQoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50LCBwcmVzZXJ2ZSkge1xuICB0aGlzLl9fX1ZOb2RlKG51bGwgLyogY2hpbGRDb3VudCAqLywgb3duZXJDb21wb25lbnQpO1xuICB0aGlzLl9fX2tleSA9IGtleTtcbiAgdGhpcy5fX19jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gIHRoaXMuX19fcHJlc2VydmUgPSBwcmVzZXJ2ZTtcbn1cblxuVkNvbXBvbmVudC5wcm90b3R5cGUgPSB7XG4gIF9fX25vZGVUeXBlOiAyLFxufTtcblxuaW5oZXJpdChWQ29tcG9uZW50LCBWTm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVkNvbXBvbmVudDtcbiIsInZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWRG9jdW1lbnRGcmFnbWVudENsb25lKG90aGVyKSB7XG4gIGV4dGVuZCh0aGlzLCBvdGhlcik7XG4gIHRoaXMuX19fcGFyZW50Tm9kZSA9IG51bGw7XG4gIHRoaXMuX19fbmV4dFNpYmxpbmdJbnRlcm5hbCA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIFZEb2N1bWVudEZyYWdtZW50KG91dCkge1xuICB0aGlzLl9fX1ZOb2RlKG51bGwgLyogY2hpbGRDb3VudCAqLyk7XG4gIHRoaXMuX19fb3V0ID0gb3V0O1xufVxuXG5WRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUgPSB7XG4gIF9fX25vZGVUeXBlOiAxMSxcblxuICBfX19Eb2N1bWVudEZyYWdtZW50OiB0cnVlLFxuXG4gIF9fX2Nsb25lTm9kZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVkRvY3VtZW50RnJhZ21lbnRDbG9uZSh0aGlzKTtcbiAgfSxcblxuICBfX19hY3R1YWxpemU6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgcmV0dXJuIChob3N0Lm93bmVyRG9jdW1lbnQgfHwgaG9zdCkuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB9LFxufTtcblxuaW5oZXJpdChWRG9jdW1lbnRGcmFnbWVudCwgVk5vZGUpO1xuXG5WRG9jdW1lbnRGcmFnbWVudENsb25lLnByb3RvdHlwZSA9IFZEb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBWRG9jdW1lbnRGcmFnbWVudDtcbiIsIi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cblxudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgdkVsZW1lbnRCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZFbGVtZW50QnlET01Ob2RlO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG52YXIgQVRUUl9YTElOS19IUkVGID0gXCJ4bGluazpocmVmXCI7XG52YXIgeG1sbnNSZWdFeHAgPSAvXnhtbG5zKDp8JCkvO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBOU19YTElOSyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xudmFyIE5TX0hUTUwgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcbnZhciBOU19NQVRIID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCI7XG52YXIgTlNfU1ZHID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xudmFyIERFRkFVTFRfTlMgPSB7XG4gIHN2ZzogTlNfU1ZHLFxuICBtYXRoOiBOU19NQVRILFxufTtcblxudmFyIEZMQUdfU0lNUExFX0FUVFJTID0gMTtcbnZhciBGTEFHX0NVU1RPTV9FTEVNRU5UID0gMjtcbnZhciBGTEFHX1NQUkVBRF9BVFRSUyA9IDQ7XG5cbnZhciBBVFRSX0hSRUYgPSBcImhyZWZcIjtcbnZhciBFTVBUWV9PQkpFQ1QgPSBPYmplY3QuZnJlZXplKE9iamVjdC5jcmVhdGUobnVsbCkpO1xudmFyIHNwZWNpYWxFbEhhbmRsZXJzID0ge1xuICBvcHRpb246IHtcbiAgICBzZWxlY3RlZDogZnVuY3Rpb24gKGZyb21FbCwgdmFsdWUpIHtcbiAgICAgIGZyb21FbC5zZWxlY3RlZCA9IHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKGZyb21FbCwgdmFsdWUpIHtcbiAgICAgIGZyb21FbC52YWx1ZSA9IHZhbHVlID09PSB1bmRlZmluZWQgPyBcIlwiIDogdmFsdWU7XG4gICAgfSxcbiAgICBjaGVja2VkOiBmdW5jdGlvbiAoZnJvbUVsLCB2YWx1ZSkge1xuICAgICAgZnJvbUVsLmNoZWNrZWQgPSB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHN3aXRjaCAodmFsdWUudG9TdHJpbmcpIHtcbiAgICAgICAgY2FzZSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nOlxuICAgICAgICBjYXNlIEFycmF5LnByb3RvdHlwZS50b1N0cmluZzpcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgICAgIFwiUmVseWluZyBvbiBKU09OLnN0cmluZ2lmeSBmb3IgYXR0cmlidXRlIHZhbHVlcyBpcyBkZXByZWNhdGVkLCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgTWFya28gdGhlc2Ugd2lsbCBiZSBjYXN0IHRvIHN0cmluZ3MgaW5zdGVhZC5cIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgIGNhc2UgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZzpcbiAgICAgICAgICByZXR1cm4gdmFsdWUuc291cmNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgKyBcIlwiO1xufVxuXG5mdW5jdGlvbiBhc3NpZ24oYSwgYikge1xuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleSkpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gVkVsZW1lbnRDbG9uZShvdGhlcikge1xuICB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbCA9IG90aGVyLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbDtcbiAgdGhpcy5fX19wYXJlbnROb2RlID0gbnVsbDtcbiAgdGhpcy5fX19uZXh0U2libGluZ0ludGVybmFsID0gbnVsbDtcblxuICB0aGlzLl9fX2tleSA9IG90aGVyLl9fX2tleTtcbiAgdGhpcy5fX19hdHRyaWJ1dGVzID0gb3RoZXIuX19fYXR0cmlidXRlcztcbiAgdGhpcy5fX19wcm9wZXJ0aWVzID0gb3RoZXIuX19fcHJvcGVydGllcztcbiAgdGhpcy5fX19ub2RlTmFtZSA9IG90aGVyLl9fX25vZGVOYW1lO1xuICB0aGlzLl9fX2ZsYWdzID0gb3RoZXIuX19fZmxhZ3M7XG4gIHRoaXMuX19fdmFsdWVJbnRlcm5hbCA9IG90aGVyLl9fX3ZhbHVlSW50ZXJuYWw7XG4gIHRoaXMuX19fY29uc3RJZCA9IG90aGVyLl9fX2NvbnN0SWQ7XG59XG5cbmZ1bmN0aW9uIFZFbGVtZW50KFxuICB0YWdOYW1lLFxuICBhdHRycyxcbiAga2V5LFxuICBvd25lckNvbXBvbmVudCxcbiAgY2hpbGRDb3VudCxcbiAgZmxhZ3MsXG4gIHByb3BzLFxuKSB7XG4gIHRoaXMuX19fVk5vZGUoY2hpbGRDb3VudCwgb3duZXJDb21wb25lbnQpO1xuXG4gIHZhciBjb25zdElkO1xuXG4gIGlmIChwcm9wcykge1xuICAgIGNvbnN0SWQgPSBwcm9wcy5pO1xuICB9XG5cbiAgdGhpcy5fX19rZXkgPSBrZXk7XG4gIHRoaXMuX19fZmxhZ3MgPSBmbGFncyB8fCAwO1xuICB0aGlzLl9fX2F0dHJpYnV0ZXMgPSBhdHRycyB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHRoaXMuX19fcHJvcGVydGllcyA9IHByb3BzIHx8IEVNUFRZX09CSkVDVDtcbiAgdGhpcy5fX19ub2RlTmFtZSA9IHRhZ05hbWU7XG4gIHRoaXMuX19fdmFsdWVJbnRlcm5hbCA9IFwiXCI7XG4gIHRoaXMuX19fY29uc3RJZCA9IGNvbnN0SWQ7XG4gIHRoaXMuX19fcHJlc2VydmUgPSBmYWxzZTtcbiAgdGhpcy5fX19wcmVzZXJ2ZUJvZHkgPSBmYWxzZTtcbn1cblxuVkVsZW1lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMSxcblxuICBfX19jbG9uZU5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZFbGVtZW50Q2xvbmUodGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCBtZXRob2QgZm9yIGNyZWF0aW5nIGFuZCBhcHBlbmRpbmcgYW4gSFRNTCBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGFnTmFtZSAgICBUaGUgdGFnIG5hbWUgKGUuZy4gXCJkaXZcIilcbiAgICogQHBhcmFtICB7aW50fG51bGx9IGF0dHJDb3VudCAgVGhlIG51bWJlciBvZiBhdHRyaWJ1dGVzIChvciBgbnVsbGAgaWYgbm90IGtub3duKVxuICAgKiBAcGFyYW0gIHtpbnR8bnVsbH0gY2hpbGRDb3VudCBUaGUgbnVtYmVyIG9mIGNoaWxkIG5vZGVzIChvciBgbnVsbGAgaWYgbm90IGtub3duKVxuICAgKi9cbiAgZTogZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBrZXksIG93bmVyQ29tcG9uZW50LCBjaGlsZENvdW50LCBmbGFncywgcHJvcHMpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLl9fX2FwcGVuZENoaWxkKFxuICAgICAgbmV3IFZFbGVtZW50KFxuICAgICAgICB0YWdOYW1lLFxuICAgICAgICBhdHRycyxcbiAgICAgICAga2V5LFxuICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgY2hpbGRDb3VudCxcbiAgICAgICAgZmxhZ3MsXG4gICAgICAgIHByb3BzLFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgaWYgKGNoaWxkQ291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl9fX2ZpbmlzaENoaWxkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCBtZXRob2QgZm9yIGNyZWF0aW5nIGFuZCBhcHBlbmRpbmcgYSBzdGF0aWMgbm9kZS4gVGhlIHByb3ZpZGVkIG5vZGUgaXMgYXV0b21hdGljYWxseSBjbG9uZWRcbiAgICogdXNpbmcgYSBzaGFsbG93IGNsb25lIHNpbmNlIGl0IHdpbGwgYmUgbXV0YXRlZCBhcyBhIHJlc3VsdCBvZiBzZXR0aW5nIGBuZXh0U2libGluZ2AgYW5kIGBwYXJlbnROb2RlYC5cbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgZm9yIHRoZSBuZXcgQ29tbWVudCBub2RlXG4gICAqL1xuICBuOiBmdW5jdGlvbiAobm9kZSwgb3duZXJDb21wb25lbnQpIHtcbiAgICBub2RlID0gbm9kZS5fX19jbG9uZU5vZGUoKTtcbiAgICBub2RlLl9fX293bmVyQ29tcG9uZW50ID0gb3duZXJDb21wb25lbnQ7XG4gICAgdGhpcy5fX19hcHBlbmRDaGlsZChub2RlKTtcbiAgICByZXR1cm4gdGhpcy5fX19maW5pc2hDaGlsZCgpO1xuICB9LFxuXG4gIF9fX2FjdHVhbGl6ZTogZnVuY3Rpb24gKGhvc3QsIHBhcmVudE5hbWVzcGFjZVVSSSkge1xuICAgIHZhciB0YWdOYW1lID0gdGhpcy5fX19ub2RlTmFtZTtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuX19fYXR0cmlidXRlcztcbiAgICB2YXIgbmFtZXNwYWNlVVJJID0gREVGQVVMVF9OU1t0YWdOYW1lXSB8fCBwYXJlbnROYW1lc3BhY2VVUkkgfHwgTlNfSFRNTDtcblxuICAgIHZhciBmbGFncyA9IHRoaXMuX19fZmxhZ3M7XG4gICAgdmFyIGVsID0gKGhvc3Qub3duZXJEb2N1bWVudCB8fCBob3N0KS5jcmVhdGVFbGVtZW50TlMoXG4gICAgICBuYW1lc3BhY2VVUkksXG4gICAgICB0YWdOYW1lLFxuICAgICk7XG5cbiAgICBpZiAoZmxhZ3MgJiBGTEFHX0NVU1RPTV9FTEVNRU5UKSB7XG4gICAgICBhc3NpZ24oZWwsIGF0dHJpYnV0ZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBhdHRyVmFsdWUgPSBub3JtYWxpemVWYWx1ZShhdHRyaWJ1dGVzW2F0dHJOYW1lXSk7XG5cbiAgICAgICAgaWYgKGF0dHJWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKGF0dHJOYW1lID09IEFUVFJfWExJTktfSFJFRikge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlTlMoTlNfWExJTkssIEFUVFJfSFJFRiwgYXR0clZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGFnTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICAgIGVsLmRlZmF1bHRWYWx1ZSA9IHRoaXMuX19fdmFsdWVJbnRlcm5hbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoZWwsIHRoaXMpO1xuXG4gICAgcmV0dXJuIGVsO1xuICB9LFxufTtcblxuaW5oZXJpdChWRWxlbWVudCwgVk5vZGUpO1xuXG5WRWxlbWVudENsb25lLnByb3RvdHlwZSA9IFZFbGVtZW50LnByb3RvdHlwZTtcblxuZnVuY3Rpb24gdmlydHVhbGl6ZUVsZW1lbnQobm9kZSwgdmlydHVhbGl6ZUNoaWxkTm9kZXMsIG93bmVyQ29tcG9uZW50KSB7XG4gIHZhciBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuICB2YXIgYXR0ckNvdW50ID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgdmFyIGF0dHJzID0gbnVsbDtcbiAgdmFyIHByb3BzID0gbnVsbDtcblxuICBpZiAoYXR0ckNvdW50KSB7XG4gICAgYXR0cnMgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJDb3VudDsgaSsrKSB7XG4gICAgICB2YXIgYXR0ciA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICBpZiAoIXhtbG5zUmVnRXhwLnRlc3QoYXR0ck5hbWUpKSB7XG4gICAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJkYXRhLW1hcmtvXCIpIHtcbiAgICAgICAgICBwcm9wcyA9IGNvbXBvbmVudHNVdGlsLl9fX2dldE1hcmtvUHJvcHNGcm9tRWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0ci5uYW1lc3BhY2VVUkkgPT09IE5TX1hMSU5LKSB7XG4gICAgICAgICAgYXR0cnNbQVRUUl9YTElOS19IUkVGXSA9IGF0dHIudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXR0cnNbYXR0ck5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciB0YWdOYW1lID0gbm9kZS5ub2RlTmFtZTtcblxuICBpZiAobm9kZS5uYW1lc3BhY2VVUkkgPT09IE5TX0hUTUwpIHtcbiAgICB0YWdOYW1lID0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdmFyIHZkb21FbCA9IG5ldyBWRWxlbWVudChcbiAgICB0YWdOYW1lLFxuICAgIGF0dHJzLFxuICAgIG51bGwgLyprZXkqLyxcbiAgICBvd25lckNvbXBvbmVudCxcbiAgICAwIC8qY2hpbGQgY291bnQqLyxcbiAgICAwIC8qZmxhZ3MqLyxcbiAgICBwcm9wcyxcbiAgKTtcblxuICBpZiAodmRvbUVsLl9fX25vZGVOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICB2ZG9tRWwuX19fdmFsdWVJbnRlcm5hbCA9IG5vZGUudmFsdWU7XG4gIH0gZWxzZSBpZiAodmlydHVhbGl6ZUNoaWxkTm9kZXMpIHtcbiAgICB2aXJ0dWFsaXplQ2hpbGROb2Rlcyhub2RlLCB2ZG9tRWwsIG93bmVyQ29tcG9uZW50KTtcbiAgfVxuXG4gIHJldHVybiB2ZG9tRWw7XG59XG5cblZFbGVtZW50Ll9fX3ZpcnR1YWxpemUgPSB2aXJ0dWFsaXplRWxlbWVudDtcblxuVkVsZW1lbnQuX19fbW9ycGhBdHRycyA9IGZ1bmN0aW9uIChmcm9tRWwsIHZGcm9tRWwsIHRvRWwpIHtcbiAgdmFyIGZyb21GbGFncyA9IHZGcm9tRWwuX19fZmxhZ3M7XG4gIHZhciB0b0ZsYWdzID0gdG9FbC5fX19mbGFncztcbiAgdmFyIGF0dHJzID0gdG9FbC5fX19hdHRyaWJ1dGVzO1xuXG4gIGlmICh0b0ZsYWdzICYgRkxBR19DVVNUT01fRUxFTUVOVCkge1xuICAgIHJldHVybiBhc3NpZ24oZnJvbUVsLCBhdHRycyk7XG4gIH1cblxuICB2YXIgcHJvcHMgPSB0b0VsLl9fX3Byb3BlcnRpZXM7XG4gIHZhciBhdHRyTmFtZTtcblxuICAvLyBXZSB1c2UgZXhwYW5kbyBwcm9wZXJ0aWVzIHRvIGFzc29jaWF0ZSB0aGUgcHJldmlvdXMgSFRNTFxuICAvLyBhdHRyaWJ1dGVzIHByb3ZpZGVkIGFzIHBhcnQgb2YgdGhlIFZET00gbm9kZSB3aXRoIHRoZVxuICAvLyByZWFsIFZFbGVtZW50IERPTSBub2RlLiBXaGVuIGRpZmZpbmcgYXR0cmlidXRlcyxcbiAgLy8gd2Ugb25seSB1c2Ugb3VyIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhdHRyaWJ1dGVzLlxuICAvLyBXaGVuIGRpZmZpbmcgZm9yIHRoZSBmaXJzdCB0aW1lIGl0J3MgcG9zc2libGUgdGhhdCB0aGVcbiAgLy8gcmVhbCBWRWxlbWVudCBub2RlIHdpbGwgbm90IGhhdmUgdGhlIGV4cGFuZG8gcHJvcGVydHlcbiAgLy8gc28gd2UgYnVpbGQgdGhlIGF0dHJpYnV0ZSBtYXAgZnJvbSB0aGUgZXhwYW5kbyBwcm9wZXJ0eVxuXG4gIHZhciBvbGRBdHRycyA9IHZGcm9tRWwuX19fYXR0cmlidXRlcztcblxuICBpZiAob2xkQXR0cnMgPT09IGF0dHJzKSB7XG4gICAgLy8gRm9yIGNvbnN0YW50IGF0dHJpYnV0ZXMgdGhlIHNhbWUgb2JqZWN0IHdpbGwgYmUgcHJvdmlkZWRcbiAgICAvLyBldmVyeSByZW5kZXIgYW5kIHdlIGNhbiB1c2UgdGhhdCB0byBvdXIgYWR2YW50YWdlIHRvXG4gICAgLy8gbm90IHdhc3RlIHRpbWUgZGlmZmluZyBhIGNvbnN0YW50LCBpbW11dGFibGUgYXR0cmlidXRlXG4gICAgLy8gbWFwLlxuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBhdHRyVmFsdWU7XG5cbiAgaWYgKHRvRmxhZ3MgJiBGTEFHX1NJTVBMRV9BVFRSUyAmJiBmcm9tRmxhZ3MgJiBGTEFHX1NJTVBMRV9BVFRSUykge1xuICAgIGlmIChvbGRBdHRyc1tcImNsYXNzXCJdICE9PSAoYXR0clZhbHVlID0gYXR0cnNbXCJjbGFzc1wiXSkpIHtcbiAgICAgIGlmIChhdHRyVmFsdWUpIHtcbiAgICAgICAgZnJvbUVsLmNsYXNzTmFtZSA9IGF0dHJWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9sZEF0dHJzLmlkICE9PSAoYXR0clZhbHVlID0gYXR0cnMuaWQpKSB7XG4gICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgIGZyb21FbC5pZCA9IGF0dHJWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9sZEF0dHJzLnN0eWxlICE9PSAoYXR0clZhbHVlID0gYXR0cnMuc3R5bGUpKSB7XG4gICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgIGZyb21FbC5zdHlsZS5jc3NUZXh0ID0gYXR0clZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcHJlc2VydmUgPSAocHJvcHMgJiYgcHJvcHMucGEpIHx8IEVNUFRZX09CSkVDVDtcbiAgdmFyIHNwZWNpYWxBdHRycyA9IHNwZWNpYWxFbEhhbmRsZXJzW3RvRWwuX19fbm9kZU5hbWVdIHx8IEVNUFRZX09CSkVDVDtcbiAgdmFyIHNwZWNpYWxBdHRyO1xuXG4gIC8vIExvb3Agb3ZlciBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgaW4gdGhlIGF0dHJpYnV0ZSBtYXAgYW5kIGNvbXBhcmVcbiAgLy8gdGhlbSB0byB0aGUgdmFsdWUgaW4gdGhlIG9sZCBtYXAuIEhvd2V2ZXIsIGlmIHRoZSB2YWx1ZSBpc1xuICAvLyBudWxsL3VuZGVmaW5lZC9mYWxzZSB0aGVuIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBhdHRyaWJ1dGVcbiAgZm9yIChhdHRyTmFtZSBpbiBhdHRycykge1xuICAgIGlmIChcbiAgICAgICFwcmVzZXJ2ZVthdHRyTmFtZV0gJiZcbiAgICAgIG5vcm1hbGl6ZVZhbHVlKG9sZEF0dHJzW2F0dHJOYW1lXSkgIT09XG4gICAgICAgIChhdHRyVmFsdWUgPSBub3JtYWxpemVWYWx1ZShhdHRyc1thdHRyTmFtZV0pKVxuICAgICkge1xuICAgICAgaWYgKChzcGVjaWFsQXR0ciA9IHNwZWNpYWxBdHRyc1thdHRyTmFtZV0pKSB7XG4gICAgICAgIHNwZWNpYWxBdHRyKGZyb21FbCwgYXR0clZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IEFUVFJfWExJTktfSFJFRikge1xuICAgICAgICBpZiAoYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlTlMoTlNfWExJTkssIEFUVFJfSFJFRik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZU5TKE5TX1hMSU5LLCBBVFRSX0hSRUYsIGF0dHJWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHRoZXJlIGFyZSBhbnkgb2xkIGF0dHJpYnV0ZXMgdGhhdCBhcmUgbm90IGluIHRoZSBuZXcgc2V0IG9mIGF0dHJpYnV0ZXNcbiAgLy8gdGhlbiB3ZSBuZWVkIHRvIHJlbW92ZSB0aG9zZSBhdHRyaWJ1dGVzIGZyb20gdGhlIHRhcmdldCBub2RlXG4gIC8vXG4gIC8vIE5PVEU6IFdlIGNhbiBza2lwIHRoaXMgaWYgdGhlIHRoZSBlbGVtZW50IGlzIGtleWVkIGFuZCBkaWRuJ3QgaGF2ZSBzcHJlYWQgYXR0cmlidXRlc1xuICAvLyAgICAgICBiZWNhdXNlIHdlIGtub3cgd2UgYWxyZWFkeSBwcm9jZXNzZWQgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIGZvclxuICAvLyAgICAgICBib3RoIHRoZSB0YXJnZXQgYW5kIG9yaWdpbmFsIGVsZW1lbnQgc2luY2UgdGFyZ2V0IFZFbGVtZW50IG5vZGVzIHdpbGxcbiAgLy8gICAgICAgaGF2ZSBhbGwgYXR0cmlidXRlcyBkZWNsYXJlZC4gSG93ZXZlciwgd2UgY2FuIG9ubHkgc2tpcCBpZiB0aGUgbm9kZVxuICAvLyAgICAgICB3YXMgbm90IGEgdmlydHVhbGl6ZWQgbm9kZSAoaS5lLiwgYSBub2RlIHRoYXQgd2FzIG5vdCByZW5kZXJlZCBieSBhXG4gIC8vICAgICAgIE1hcmtvIHRlbXBsYXRlLCBidXQgcmF0aGVyIGEgbm9kZSB0aGF0IHdhcyBjcmVhdGVkIGZyb20gYW4gSFRNTFxuICAvLyAgICAgICBzdHJpbmcgb3IgYSByZWFsIERPTSBub2RlKS5cbiAgaWYgKHRvRWwuX19fa2V5ID09PSBudWxsIHx8IGZyb21GbGFncyAmIEZMQUdfU1BSRUFEX0FUVFJTKSB7XG4gICAgZm9yIChhdHRyTmFtZSBpbiBvbGRBdHRycykge1xuICAgICAgaWYgKCEoYXR0ck5hbWUgaW4gYXR0cnMpKSB7XG4gICAgICAgIGlmICgoc3BlY2lhbEF0dHIgPSBzcGVjaWFsQXR0cnNbYXR0ck5hbWVdKSkge1xuICAgICAgICAgIHNwZWNpYWxBdHRyKGZyb21FbCwgdW5kZWZpbmVkKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gQVRUUl9YTElOS19IUkVGKSB7XG4gICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZU5TKEFUVFJfWExJTktfSFJFRiwgQVRUUl9IUkVGKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWRWxlbWVudDtcbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgZG9tRGF0YSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGtleXNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2tleUJ5RE9NTm9kZTtcbnZhciB2RWxlbWVudEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fdkVsZW1lbnRCeURPTU5vZGU7XG52YXIgY3JlYXRlRnJhZ21lbnROb2RlID0gcmVxdWlyZShcIi4vbW9ycGhkb20vZnJhZ21lbnRcIikuX19fY3JlYXRlRnJhZ21lbnROb2RlO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG5cbmZ1bmN0aW9uIFZGcmFnbWVudChrZXksIG93bmVyQ29tcG9uZW50LCBwcmVzZXJ2ZSkge1xuICB0aGlzLl9fX1ZOb2RlKG51bGwgLyogY2hpbGRDb3VudCAqLywgb3duZXJDb21wb25lbnQpO1xuICB0aGlzLl9fX2tleSA9IGtleTtcbiAgdGhpcy5fX19wcmVzZXJ2ZSA9IHByZXNlcnZlO1xufVxuXG5WRnJhZ21lbnQucHJvdG90eXBlID0ge1xuICBfX19ub2RlVHlwZTogMTIsXG4gIF9fX2FjdHVhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmcmFnbWVudCA9IGNyZWF0ZUZyYWdtZW50Tm9kZSgpO1xuICAgIGtleXNCeURPTU5vZGUuc2V0KGZyYWdtZW50LCB0aGlzLl9fX2tleSk7XG4gICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGZyYWdtZW50LCB0aGlzKTtcbiAgICByZXR1cm4gZnJhZ21lbnQ7XG4gIH0sXG59O1xuXG5pbmhlcml0KFZGcmFnbWVudCwgVk5vZGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZGcmFnbWVudDtcbiIsIi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cbmZ1bmN0aW9uIFZOb2RlKCkge31cblxuVk5vZGUucHJvdG90eXBlID0ge1xuICBfX19WTm9kZTogZnVuY3Rpb24gKGZpbmFsQ2hpbGRDb3VudCwgb3duZXJDb21wb25lbnQpIHtcbiAgICB0aGlzLl9fX2ZpbmFsQ2hpbGRDb3VudCA9IGZpbmFsQ2hpbGRDb3VudDtcbiAgICB0aGlzLl9fX2NoaWxkQ291bnQgPSAwO1xuICAgIHRoaXMuX19fZmlyc3RDaGlsZEludGVybmFsID0gbnVsbDtcbiAgICB0aGlzLl9fX2xhc3RDaGlsZCA9IG51bGw7XG4gICAgdGhpcy5fX19wYXJlbnROb2RlID0gbnVsbDtcbiAgICB0aGlzLl9fX25leHRTaWJsaW5nSW50ZXJuYWwgPSBudWxsO1xuICAgIHRoaXMuX19fb3duZXJDb21wb25lbnQgPSBvd25lckNvbXBvbmVudDtcbiAgfSxcblxuICBnZXQgX19fZmlyc3RDaGlsZCgpIHtcbiAgICB2YXIgZmlyc3RDaGlsZCA9IHRoaXMuX19fZmlyc3RDaGlsZEludGVybmFsO1xuXG4gICAgaWYgKGZpcnN0Q2hpbGQgJiYgZmlyc3RDaGlsZC5fX19Eb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICB2YXIgbmVzdGVkRmlyc3RDaGlsZCA9IGZpcnN0Q2hpbGQuX19fZmlyc3RDaGlsZDtcbiAgICAgIC8vIFRoZSBmaXJzdCBjaGlsZCBpcyBhIERvY3VtZW50RnJhZ21lbnQgbm9kZS5cbiAgICAgIC8vIElmIHRoZSBEb2N1bWVudEZyYWdtZW50IG5vZGUgaGFzIGEgZmlyc3QgY2hpbGQgdGhlbiB3ZSB3aWxsIHJldHVybiB0aGF0LlxuICAgICAgLy8gT3RoZXJ3aXNlLCB0aGUgRG9jdW1lbnRGcmFnbWVudCBub2RlIGlzIG5vdCAqcmVhbGx5KiB0aGUgZmlyc3QgY2hpbGQgYW5kXG4gICAgICAvLyB3ZSBuZWVkIHRvIHNraXAgdG8gaXRzIG5leHQgc2libGluZ1xuICAgICAgcmV0dXJuIG5lc3RlZEZpcnN0Q2hpbGQgfHwgZmlyc3RDaGlsZC5fX19uZXh0U2libGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gZmlyc3RDaGlsZDtcbiAgfSxcblxuICBnZXQgX19fbmV4dFNpYmxpbmcoKSB7XG4gICAgdmFyIG5leHRTaWJsaW5nID0gdGhpcy5fX19uZXh0U2libGluZ0ludGVybmFsO1xuXG4gICAgaWYgKG5leHRTaWJsaW5nKSB7XG4gICAgICBpZiAobmV4dFNpYmxpbmcuX19fRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICB2YXIgZmlyc3RDaGlsZCA9IG5leHRTaWJsaW5nLl9fX2ZpcnN0Q2hpbGQ7XG4gICAgICAgIHJldHVybiBmaXJzdENoaWxkIHx8IG5leHRTaWJsaW5nLl9fX25leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGFyZW50Tm9kZSA9IHRoaXMuX19fcGFyZW50Tm9kZTtcbiAgICAgIGlmIChwYXJlbnROb2RlICYmIHBhcmVudE5vZGUuX19fRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICByZXR1cm4gcGFyZW50Tm9kZS5fX19uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFNpYmxpbmc7XG4gIH0sXG5cbiAgX19fYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHRoaXMuX19fY2hpbGRDb3VudCsrO1xuXG4gICAgaWYgKHRoaXMuX19fbm9kZU5hbWUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgaWYgKGNoaWxkLl9fX1RleHQpIHtcbiAgICAgICAgdGhpcy5fX192YWx1ZUludGVybmFsICs9IGNoaWxkLl9fX25vZGVWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGFzdENoaWxkID0gdGhpcy5fX19sYXN0Q2hpbGQ7XG5cbiAgICAgIGNoaWxkLl9fX3BhcmVudE5vZGUgPSB0aGlzO1xuXG4gICAgICBpZiAobGFzdENoaWxkKSB7XG4gICAgICAgIGxhc3RDaGlsZC5fX19uZXh0U2libGluZ0ludGVybmFsID0gY2hpbGQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fX2ZpcnN0Q2hpbGRJbnRlcm5hbCA9IGNoaWxkO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9fX2xhc3RDaGlsZCA9IGNoaWxkO1xuICAgIH1cblxuICAgIHJldHVybiBjaGlsZDtcbiAgfSxcblxuICBfX19maW5pc2hDaGlsZDogZnVuY3Rpb24gZmluaXNoQ2hpbGQoKSB7XG4gICAgaWYgKHRoaXMuX19fY2hpbGRDb3VudCA9PT0gdGhpcy5fX19maW5hbENoaWxkQ291bnQgJiYgdGhpcy5fX19wYXJlbnROb2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX19wYXJlbnROb2RlLl9fX2ZpbmlzaENoaWxkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSxcblxuICAvLyAsdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgLy8gICAgIHZhciBjbG9uZSA9IE9iamVjdC5hc3NpZ24oe1xuICAvLyAgICAgICAgIG5vZGVUeXBlOiB0aGlzLm5vZGVUeXBlXG4gIC8vICAgICB9LCB0aGlzKTtcbiAgLy9cbiAgLy8gICAgIGZvciAodmFyIGsgaW4gY2xvbmUpIHtcbiAgLy8gICAgICAgICBpZiAoay5zdGFydHNXaXRoKCdfJykpIHtcbiAgLy8gICAgICAgICAgICAgZGVsZXRlIGNsb25lW2tdO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICAgIGRlbGV0ZSBjbG9uZS5fbmV4dFNpYmxpbmc7XG4gIC8vICAgICBkZWxldGUgY2xvbmUuX2xhc3RDaGlsZDtcbiAgLy8gICAgIGRlbGV0ZSBjbG9uZS5wYXJlbnROb2RlO1xuICAvLyAgICAgcmV0dXJuIGNsb25lO1xuICAvLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZOb2RlO1xuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBWTm9kZSA9IHJlcXVpcmUoXCIuL1ZOb2RlXCIpO1xuXG5mdW5jdGlvbiBWVGV4dCh2YWx1ZSwgb3duZXJDb21wb25lbnQpIHtcbiAgdGhpcy5fX19WTm9kZSgtMSAvKiBubyBjaGlsZHJlbiAqLywgb3duZXJDb21wb25lbnQpO1xuICB0aGlzLl9fX25vZGVWYWx1ZSA9IHZhbHVlO1xufVxuXG5WVGV4dC5wcm90b3R5cGUgPSB7XG4gIF9fX1RleHQ6IHRydWUsXG5cbiAgX19fbm9kZVR5cGU6IDMsXG5cbiAgX19fYWN0dWFsaXplOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHJldHVybiAoaG9zdC5vd25lckRvY3VtZW50IHx8IGhvc3QpLmNyZWF0ZVRleHROb2RlKHRoaXMuX19fbm9kZVZhbHVlKTtcbiAgfSxcblxuICBfX19jbG9uZU5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZUZXh0KHRoaXMuX19fbm9kZVZhbHVlKTtcbiAgfSxcbn07XG5cbmluaGVyaXQoVlRleHQsIFZOb2RlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWVGV4dDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIGNsYXNzSGVscGVyID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvY2xhc3MtdmFsdWVcIik7XG52YXIgc3R5bGVIZWxwZXIgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9zdHlsZS12YWx1ZVwiKTtcbnZhciBwYXJzZUhUTUwgPSByZXF1aXJlKFwiLi4vcGFyc2UtaHRtbFwiKTtcblxuLyoqXG4gKiBIZWxwZXIgZm9yIHByb2Nlc3NpbmcgZHluYW1pYyBhdHRyaWJ1dGVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGNvbXBsYWluKFxuICAgICAgICBcIlBhc3NpbmcgYSBzdHJpbmcgYXMgYSBkeW5hbWljIGF0dHJpYnV0ZSB2YWx1ZSBpcyBkZXByZWNhdGVkIC0gTW9yZSBkZXRhaWxzOiBodHRwczovL2dpdGh1Yi5jb20vbWFya28tanMvbWFya28vd2lraS9EZXByZWNhdGlvbjotU3RyaW5nLWFzLWR5bmFtaWMtYXR0cmlidXRlLXZhbHVlXCIsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VBdHRycyhhdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgdmFyIG5ld0F0dHJpYnV0ZXMgPSB7fTtcblxuICAgIGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgIHZhciB2YWwgPSBhdHRyaWJ1dGVzW2F0dHJOYW1lXTtcbiAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJyZW5kZXJCb2R5XCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgIHZhbCA9IGNsYXNzSGVscGVyKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgdmFsID0gc3R5bGVIZWxwZXIodmFsKTtcbiAgICAgIH1cblxuICAgICAgbmV3QXR0cmlidXRlc1thdHRyTmFtZV0gPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0F0dHJpYnV0ZXM7XG4gIH1cblxuICByZXR1cm4gYXR0cmlidXRlcztcbn07XG5cbmZ1bmN0aW9uIHBhcnNlQXR0cnMoc3RyKSB7XG4gIGlmIChzdHIgPT09IFwiXCIpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICB2YXIgYXR0cnMgPSBwYXJzZUhUTUwoXCI8YSBcIiArIHN0ciArIFwiPlwiKS5hdHRyaWJ1dGVzO1xuICB2YXIgcmVzdWx0ID0ge307XG4gIHZhciBhdHRyO1xuXG4gIGZvciAodmFyIGxlbiA9IGF0dHJzLmxlbmd0aCwgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGF0dHIgPSBhdHRyc1tpXTtcbiAgICByZXN1bHRbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbndpbmRvdy5NYXJrbyA9IHtcbiAgQ29tcG9uZW50OiBmdW5jdGlvbiAoKSB7fSxcbn07XG5cbi8qKlxuICogTWV0aG9kIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5LiBUaGlzIG1ldGhvZFxuICogaXMgaW52b2tlZCBieSBjb2RlIGluIGEgY29tcGlsZWQgTWFya28gdGVtcGxhdGUgYW5kXG4gKiBpdCBpcyB1c2VkIHRvIGNyZWF0ZSBhIG5ldyBUZW1wbGF0ZSBpbnN0YW5jZS5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMudCA9IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlKHR5cGVOYW1lKSB7XG4gIHJldHVybiBuZXcgVGVtcGxhdGUodHlwZU5hbWUpO1xufTtcblxuZnVuY3Rpb24gVGVtcGxhdGUodHlwZU5hbWUpIHtcbiAgdGhpcy5wYXRoID0gdGhpcy5fX190eXBlTmFtZSA9IHR5cGVOYW1lO1xufVxuXG52YXIgQXN5bmNWRE9NQnVpbGRlciA9IHJlcXVpcmUoXCIuL0FzeW5jVkRPTUJ1aWxkZXJcIik7XG5yZXF1aXJlKFwiLi4vY3JlYXRlT3V0XCIpLl9fX3NldENyZWF0ZU91dChcbiAgKFRlbXBsYXRlLnByb3RvdHlwZS5jcmVhdGVPdXQgPSBmdW5jdGlvbiBjcmVhdGVPdXQoXG4gICAgZ2xvYmFsRGF0YSxcbiAgICBwYXJlbnQsXG4gICAgcGFyZW50T3V0LFxuICApIHtcbiAgICByZXR1cm4gbmV3IEFzeW5jVkRPTUJ1aWxkZXIoZ2xvYmFsRGF0YSwgcGFyZW50LCBwYXJlbnRPdXQpO1xuICB9KSxcbik7XG5cbnJlcXVpcmUoXCIuLi9yZW5kZXJhYmxlXCIpKFRlbXBsYXRlLnByb3RvdHlwZSk7XG4iLCJ2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XG52YXIgaW5zZXJ0QmVmb3JlID0gaGVscGVycy5fX19pbnNlcnRCZWZvcmU7XG5cbnZhciBmcmFnbWVudFByb3RvdHlwZSA9IHtcbiAgbm9kZVR5cGU6IDEyLFxuICBnZXQgZmlyc3RDaGlsZCgpIHtcbiAgICB2YXIgZmlyc3RDaGlsZCA9IHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nO1xuICAgIHJldHVybiBmaXJzdENoaWxkID09PSB0aGlzLmVuZE5vZGUgPyB1bmRlZmluZWQgOiBmaXJzdENoaWxkO1xuICB9LFxuICBnZXQgbGFzdENoaWxkKCkge1xuICAgIHZhciBsYXN0Q2hpbGQgPSB0aGlzLmVuZE5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgIHJldHVybiBsYXN0Q2hpbGQgPT09IHRoaXMuc3RhcnROb2RlID8gdW5kZWZpbmVkIDogbGFzdENoaWxkO1xuICB9LFxuICBnZXQgcGFyZW50Tm9kZSgpIHtcbiAgICB2YXIgcGFyZW50Tm9kZSA9IHRoaXMuc3RhcnROb2RlLnBhcmVudE5vZGU7XG4gICAgcmV0dXJuIHBhcmVudE5vZGUgPT09IHRoaXMuZGV0YWNoZWRDb250YWluZXIgPyB1bmRlZmluZWQgOiBwYXJlbnROb2RlO1xuICB9LFxuICBnZXQgbmFtZXNwYWNlVVJJKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0Tm9kZS5wYXJlbnROb2RlLm5hbWVzcGFjZVVSSTtcbiAgfSxcbiAgZ2V0IG5leHRTaWJsaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmVuZE5vZGUubmV4dFNpYmxpbmc7XG4gIH0sXG4gIGdldCBub2RlcygpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgaWYgKHRoaXMuX19fbWFya2Vyc1JlbW92ZWRFcnJvcikge1xuICAgICAgICB0aHJvdyB0aGlzLl9fX21hcmtlcnNSZW1vdmVkRXJyb3IoXCJDYW5ub3QgZ2V0IGZyYWdtZW50IG5vZGVzLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLnN0YXJ0Tm9kZTtcbiAgICB3aGlsZSAoY3VycmVudCAhPT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICBub2Rlcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIG5vZGVzLnB1c2goY3VycmVudCk7XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9LFxuICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChuZXdDaGlsZE5vZGUsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICB2YXIgYWN0dWFsUmVmZXJlbmNlID0gcmVmZXJlbmNlTm9kZSA9PSBudWxsID8gdGhpcy5lbmROb2RlIDogcmVmZXJlbmNlTm9kZTtcbiAgICByZXR1cm4gaW5zZXJ0QmVmb3JlKFxuICAgICAgbmV3Q2hpbGROb2RlLFxuICAgICAgYWN0dWFsUmVmZXJlbmNlLFxuICAgICAgdGhpcy5zdGFydE5vZGUucGFyZW50Tm9kZSxcbiAgICApO1xuICB9LFxuICBpbnNlcnRJbnRvOiBmdW5jdGlvbiAobmV3UGFyZW50Tm9kZSwgcmVmZXJlbmNlTm9kZSkge1xuICAgIHRoaXMubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgaW5zZXJ0QmVmb3JlKG5vZGUsIHJlZmVyZW5jZU5vZGUsIG5ld1BhcmVudE5vZGUpO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIHRoaXMuZGV0YWNoZWRDb250YWluZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudE5vZGUoc3RhcnROb2RlLCBuZXh0Tm9kZSwgcGFyZW50Tm9kZSkge1xuICB2YXIgZnJhZ21lbnQgPSBPYmplY3QuY3JlYXRlKGZyYWdtZW50UHJvdG90eXBlKTtcbiAgdmFyIGlzUm9vdCA9IHN0YXJ0Tm9kZSAmJiBzdGFydE5vZGUub3duZXJEb2N1bWVudCA9PT0gc3RhcnROb2RlLnBhcmVudE5vZGU7XG4gIGZyYWdtZW50LnN0YXJ0Tm9kZSA9IGlzUm9vdFxuICAgID8gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIlwiKVxuICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gIGZyYWdtZW50LmVuZE5vZGUgPSBpc1Jvb3RcbiAgICA/IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJcIilcbiAgICA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICBmcmFnbWVudC5zdGFydE5vZGUuZnJhZ21lbnQgPSBmcmFnbWVudDtcbiAgZnJhZ21lbnQuZW5kTm9kZS5mcmFnbWVudCA9IGZyYWdtZW50O1xuICB2YXIgZGV0YWNoZWRDb250YWluZXIgPSAoZnJhZ21lbnQuZGV0YWNoZWRDb250YWluZXIgPVxuICAgIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gIHBhcmVudE5vZGUgPVxuICAgIHBhcmVudE5vZGUgfHwgKHN0YXJ0Tm9kZSAmJiBzdGFydE5vZGUucGFyZW50Tm9kZSkgfHwgZGV0YWNoZWRDb250YWluZXI7XG4gIGluc2VydEJlZm9yZShmcmFnbWVudC5zdGFydE5vZGUsIHN0YXJ0Tm9kZSwgcGFyZW50Tm9kZSk7XG4gIGluc2VydEJlZm9yZShmcmFnbWVudC5lbmROb2RlLCBuZXh0Tm9kZSwgcGFyZW50Tm9kZSk7XG4gIHJldHVybiBmcmFnbWVudDtcbn1cblxuZnVuY3Rpb24gYmVnaW5GcmFnbWVudE5vZGUoc3RhcnROb2RlLCBwYXJlbnROb2RlKSB7XG4gIHZhciBmcmFnbWVudCA9IGNyZWF0ZUZyYWdtZW50Tm9kZShzdGFydE5vZGUsIG51bGwsIHBhcmVudE5vZGUpO1xuICBmcmFnbWVudC5fX19maW5pc2hGcmFnbWVudCA9IGZ1bmN0aW9uIChuZXh0Tm9kZSkge1xuICAgIGZyYWdtZW50Ll9fX2ZpbmlzaEZyYWdtZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUoXG4gICAgICBmcmFnbWVudC5lbmROb2RlLFxuICAgICAgbmV4dE5vZGUsXG4gICAgICBwYXJlbnROb2RlIHx8IHN0YXJ0Tm9kZS5wYXJlbnROb2RlLFxuICAgICk7XG4gIH07XG4gIHJldHVybiBmcmFnbWVudDtcbn1cblxuZXhwb3J0cy5fX19jcmVhdGVGcmFnbWVudE5vZGUgPSBjcmVhdGVGcmFnbWVudE5vZGU7XG5leHBvcnRzLl9fX2JlZ2luRnJhZ21lbnROb2RlID0gYmVnaW5GcmFnbWVudE5vZGU7XG4iLCJmdW5jdGlvbiBpbnNlcnRCZWZvcmUobm9kZSwgcmVmZXJlbmNlTm9kZSwgcGFyZW50Tm9kZSkge1xuICBpZiAobm9kZS5pbnNlcnRJbnRvKSB7XG4gICAgcmV0dXJuIG5vZGUuaW5zZXJ0SW50byhwYXJlbnROb2RlLCByZWZlcmVuY2VOb2RlKTtcbiAgfVxuICByZXR1cm4gcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgbm9kZSxcbiAgICAocmVmZXJlbmNlTm9kZSAmJiByZWZlcmVuY2VOb2RlLnN0YXJ0Tm9kZSkgfHwgcmVmZXJlbmNlTm9kZSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIobm9kZSwgcmVmZXJlbmNlTm9kZSwgcGFyZW50Tm9kZSkge1xuICByZXR1cm4gaW5zZXJ0QmVmb3JlKFxuICAgIG5vZGUsXG4gICAgcmVmZXJlbmNlTm9kZSAmJiByZWZlcmVuY2VOb2RlLm5leHRTaWJsaW5nLFxuICAgIHBhcmVudE5vZGUsXG4gICk7XG59XG5cbmZ1bmN0aW9uIG5leHRTaWJsaW5nKG5vZGUpIHtcbiAgdmFyIG5leHQgPSBub2RlLm5leHRTaWJsaW5nO1xuICB2YXIgZnJhZ21lbnQgPSBuZXh0ICYmIG5leHQuZnJhZ21lbnQ7XG4gIGlmIChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXh0ID09PSBmcmFnbWVudC5zdGFydE5vZGUgPyBmcmFnbWVudCA6IG51bGw7XG4gIH1cbiAgcmV0dXJuIG5leHQ7XG59XG5cbmZ1bmN0aW9uIGZpcnN0Q2hpbGQobm9kZSkge1xuICB2YXIgbmV4dCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgcmV0dXJuIChuZXh0ICYmIG5leHQuZnJhZ21lbnQpIHx8IG5leHQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkKG5vZGUpIHtcbiAgaWYgKG5vZGUucmVtb3ZlKSBub2RlLnJlbW92ZSgpO1xuICBlbHNlIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZXhwb3J0cy5fX19pbnNlcnRCZWZvcmUgPSBpbnNlcnRCZWZvcmU7XG5leHBvcnRzLl9fX2luc2VydEFmdGVyID0gaW5zZXJ0QWZ0ZXI7XG5leHBvcnRzLl9fX25leHRTaWJsaW5nID0gbmV4dFNpYmxpbmc7XG5leHBvcnRzLl9fX2ZpcnN0Q2hpbGQgPSBmaXJzdENoaWxkO1xuZXhwb3J0cy5fX19yZW1vdmVDaGlsZCA9IHJlbW92ZUNoaWxkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBleGlzdGluZ0NvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBkZXN0cm95Tm9kZVJlY3Vyc2l2ZSA9IGNvbXBvbmVudHNVdGlsLl9fX2Rlc3Ryb3lOb2RlUmVjdXJzaXZlO1xudmFyIGFkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHMgPVxuICBjb21wb25lbnRzVXRpbC5fX19hZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzO1xudmFyIG5vcm1hbGl6ZUNvbXBvbmVudEtleSA9IGNvbXBvbmVudHNVdGlsLl9fX25vcm1hbGl6ZUNvbXBvbmVudEtleTtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIgZXZlbnREZWxlZ2F0aW9uID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvZXZlbnQtZGVsZWdhdGlvblwiKTtcbnZhciBLZXlTZXF1ZW5jZSA9IHJlcXVpcmUoXCIuLi8uLi9jb21wb25lbnRzL0tleVNlcXVlbmNlXCIpO1xudmFyIFZFbGVtZW50ID0gcmVxdWlyZShcIi4uL3Zkb21cIikuX19fVkVsZW1lbnQ7XG52YXIgZnJhZ21lbnQgPSByZXF1aXJlKFwiLi9mcmFnbWVudFwiKTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcbnZhciB2aXJ0dWFsaXplRWxlbWVudCA9IFZFbGVtZW50Ll9fX3ZpcnR1YWxpemU7XG52YXIgbW9ycGhBdHRycyA9IFZFbGVtZW50Ll9fX21vcnBoQXR0cnM7XG52YXIga2V5c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fa2V5QnlET01Ob2RlO1xudmFyIGNvbXBvbmVudEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIHZFbGVtZW50QnlET01Ob2RlID0gZG9tRGF0YS5fX192RWxlbWVudEJ5RE9NTm9kZTtcbnZhciBkZXRhY2hlZEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fZGV0YWNoZWRCeURPTU5vZGU7XG5cbnZhciBpbnNlcnRCZWZvcmUgPSBoZWxwZXJzLl9fX2luc2VydEJlZm9yZTtcbnZhciBpbnNlcnRBZnRlciA9IGhlbHBlcnMuX19faW5zZXJ0QWZ0ZXI7XG52YXIgbmV4dFNpYmxpbmcgPSBoZWxwZXJzLl9fX25leHRTaWJsaW5nO1xudmFyIGZpcnN0Q2hpbGQgPSBoZWxwZXJzLl9fX2ZpcnN0Q2hpbGQ7XG52YXIgcmVtb3ZlQ2hpbGQgPSBoZWxwZXJzLl9fX3JlbW92ZUNoaWxkO1xudmFyIGNyZWF0ZUZyYWdtZW50Tm9kZSA9IGZyYWdtZW50Ll9fX2NyZWF0ZUZyYWdtZW50Tm9kZTtcbnZhciBiZWdpbkZyYWdtZW50Tm9kZSA9IGZyYWdtZW50Ll9fX2JlZ2luRnJhZ21lbnROb2RlO1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG52YXIgQ09NUE9ORU5UX05PREUgPSAyO1xudmFyIEZSQUdNRU5UX05PREUgPSAxMjtcbnZhciBET0NUWVBFX05PREUgPSAxMDtcblxuLy8gdmFyIEZMQUdfU0lNUExFX0FUVFJTID0gMTtcbi8vIHZhciBGTEFHX0NVU1RPTV9FTEVNRU5UID0gMjtcbi8vIHZhciBGTEFHX1NQUkVBRF9BVFRSUyA9IDQ7XG5cbmZ1bmN0aW9uIGlzQXV0b0tleShrZXkpIHtcbiAgcmV0dXJuIGtleVswXSAhPT0gXCJAXCI7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVOb2RlTmFtZXMoZnJvbUVsLCB0b0VsKSB7XG4gIHJldHVybiBmcm9tRWwuX19fbm9kZU5hbWUgPT09IHRvRWwuX19fbm9kZU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNhc2VJbnNlbnNpdGl2ZUNvbXBhcmUoYSwgYikge1xuICByZXR1cm4gYS50b0xvd2VyQ2FzZSgpID09PSBiLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIG9uTm9kZUFkZGVkKG5vZGUsIGNvbXBvbmVudHNDb250ZXh0KSB7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICBldmVudERlbGVnYXRpb24uX19faGFuZGxlTm9kZUF0dGFjaChub2RlLCBjb21wb25lbnRzQ29udGV4dCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW9ycGhkb20oZnJvbU5vZGUsIHRvTm9kZSwgaG9zdCwgY29tcG9uZW50c0NvbnRleHQpIHtcbiAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0O1xuICB2YXIgaXNIeWRyYXRlID0gZmFsc2U7XG4gIHZhciBrZXlTZXF1ZW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGlmIChjb21wb25lbnRzQ29udGV4dCkge1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcbiAgICBpc0h5ZHJhdGUgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19pc0h5ZHJhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnRWaXJ0dWFsTm9kZUJlZm9yZShcbiAgICB2Tm9kZSxcbiAgICBrZXksXG4gICAgcmVmZXJlbmNlRWwsXG4gICAgcGFyZW50RWwsXG4gICAgb3duZXJDb21wb25lbnQsXG4gICAgcGFyZW50Q29tcG9uZW50LFxuICApIHtcbiAgICB2YXIgcmVhbE5vZGUgPSB2Tm9kZS5fX19hY3R1YWxpemUoaG9zdCwgcGFyZW50RWwubmFtZXNwYWNlVVJJKTtcbiAgICBpbnNlcnRCZWZvcmUocmVhbE5vZGUsIHJlZmVyZW5jZUVsLCBwYXJlbnRFbCk7XG5cbiAgICBpZiAoXG4gICAgICB2Tm9kZS5fX19ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFIHx8XG4gICAgICB2Tm9kZS5fX19ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERVxuICAgICkge1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBrZXlzQnlET01Ob2RlLnNldChyZWFsTm9kZSwga2V5KTtcbiAgICAgICAgKGlzQXV0b0tleShrZXkpID8gcGFyZW50Q29tcG9uZW50IDogb3duZXJDb21wb25lbnQpLl9fX2tleWVkRWxlbWVudHNbXG4gICAgICAgICAga2V5XG4gICAgICAgIF0gPSByZWFsTm9kZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZOb2RlLl9fX25vZGVOYW1lICE9PSBcInRleHRhcmVhXCIpIHtcbiAgICAgICAgbW9ycGhDaGlsZHJlbihyZWFsTm9kZSwgdk5vZGUsIHBhcmVudENvbXBvbmVudCk7XG4gICAgICB9XG5cbiAgICAgIG9uTm9kZUFkZGVkKHJlYWxOb2RlLCBjb21wb25lbnRzQ29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0VmlydHVhbENvbXBvbmVudEJlZm9yZShcbiAgICB2Q29tcG9uZW50LFxuICAgIHJlZmVyZW5jZU5vZGUsXG4gICAgcmVmZXJlbmNlTm9kZVBhcmVudEVsLFxuICAgIGNvbXBvbmVudCxcbiAgICBrZXksXG4gICAgb3duZXJDb21wb25lbnQsXG4gICAgcGFyZW50Q29tcG9uZW50LFxuICApIHtcbiAgICB2YXIgcm9vdE5vZGUgPSAoY29tcG9uZW50Ll9fX3Jvb3ROb2RlID0gaW5zZXJ0QmVmb3JlKFxuICAgICAgY3JlYXRlRnJhZ21lbnROb2RlKCksXG4gICAgICByZWZlcmVuY2VOb2RlLFxuICAgICAgcmVmZXJlbmNlTm9kZVBhcmVudEVsLFxuICAgICkpO1xuICAgIGNvbXBvbmVudEJ5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGNvbXBvbmVudCk7XG5cbiAgICBpZiAoa2V5ICYmIG93bmVyQ29tcG9uZW50KSB7XG4gICAgICBrZXkgPSBub3JtYWxpemVDb21wb25lbnRLZXkoa2V5LCBwYXJlbnRDb21wb25lbnQuaWQpO1xuICAgICAgYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyhcbiAgICAgICAgb3duZXJDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50cyxcbiAgICAgICAga2V5LFxuICAgICAgICByb290Tm9kZSxcbiAgICAgICAgY29tcG9uZW50LmlkLFxuICAgICAgKTtcbiAgICAgIGtleXNCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBrZXkpO1xuICAgIH1cblxuICAgIG1vcnBoQ29tcG9uZW50KGNvbXBvbmVudCwgdkNvbXBvbmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIHZDb21wb25lbnQpIHtcbiAgICBtb3JwaENoaWxkcmVuKGNvbXBvbmVudC5fX19yb290Tm9kZSwgdkNvbXBvbmVudCwgY29tcG9uZW50KTtcbiAgfVxuXG4gIHZhciBkZXRhY2hlZE5vZGVzID0gW107XG5cbiAgZnVuY3Rpb24gZGV0YWNoTm9kZShub2RlLCBwYXJlbnROb2RlLCBvd25lckNvbXBvbmVudCkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERSkge1xuICAgICAgZGV0YWNoZWROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgZGV0YWNoZWRCeURPTU5vZGUuc2V0KG5vZGUsIG93bmVyQ29tcG9uZW50IHx8IHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShub2RlKTtcbiAgICAgIHJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3lDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vcnBoQ2hpbGRyZW4oZnJvbU5vZGUsIHRvTm9kZSwgcGFyZW50Q29tcG9uZW50KSB7XG4gICAgdmFyIGN1ckZyb21Ob2RlQ2hpbGQgPSBmaXJzdENoaWxkKGZyb21Ob2RlKTtcbiAgICB2YXIgY3VyVG9Ob2RlQ2hpbGQgPSB0b05vZGUuX19fZmlyc3RDaGlsZDtcblxuICAgIHZhciBjdXJUb05vZGVLZXk7XG4gICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuICAgIHZhciBjdXJUb05vZGVUeXBlO1xuXG4gICAgdmFyIGZyb21OZXh0U2libGluZztcbiAgICB2YXIgdG9OZXh0U2libGluZztcbiAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG4gICAgdmFyIG1hdGNoaW5nRnJvbUNvbXBvbmVudDtcbiAgICB2YXIgY3VyVkZyb21Ob2RlQ2hpbGQ7XG4gICAgdmFyIGZyb21Db21wb25lbnQ7XG5cbiAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICB0b05leHRTaWJsaW5nID0gY3VyVG9Ob2RlQ2hpbGQuX19fbmV4dFNpYmxpbmc7XG4gICAgICBjdXJUb05vZGVUeXBlID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZVR5cGU7XG4gICAgICBjdXJUb05vZGVLZXkgPSBjdXJUb05vZGVDaGlsZC5fX19rZXk7XG5cbiAgICAgIC8vIFNraXAgPCFkb2N0eXBlPlxuICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQgJiYgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZSA9PT0gRE9DVFlQRV9OT0RFKSB7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG93bmVyQ29tcG9uZW50ID0gY3VyVG9Ob2RlQ2hpbGQuX19fb3duZXJDb21wb25lbnQgfHwgcGFyZW50Q29tcG9uZW50O1xuICAgICAgdmFyIHJlZmVyZW5jZUNvbXBvbmVudDtcblxuICAgICAgaWYgKGN1clRvTm9kZVR5cGUgPT09IENPTVBPTkVOVF9OT0RFKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBjdXJUb05vZGVDaGlsZC5fX19jb21wb25lbnQ7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAobWF0Y2hpbmdGcm9tQ29tcG9uZW50ID0gZXhpc3RpbmdDb21wb25lbnRMb29rdXBbY29tcG9uZW50LmlkXSkgPT09XG4gICAgICAgICAgdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgIGlmIChpc0h5ZHJhdGUpIHtcbiAgICAgICAgICAgIHZhciByb290Tm9kZSA9IGJlZ2luRnJhZ21lbnROb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX19yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgICAgICAgICAgY29tcG9uZW50QnlET01Ob2RlLnNldChyb290Tm9kZSwgY29tcG9uZW50KTtcblxuICAgICAgICAgICAgaWYgKG93bmVyQ29tcG9uZW50ICYmIGN1clRvTm9kZUtleSkge1xuICAgICAgICAgICAgICBjdXJUb05vZGVLZXkgPSBub3JtYWxpemVDb21wb25lbnRLZXkoXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudC5pZCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyhcbiAgICAgICAgICAgICAgICBvd25lckNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzLFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgICByb290Tm9kZSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaWQsXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAga2V5c0J5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGN1clRvTm9kZUtleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vcnBoQ29tcG9uZW50KGNvbXBvbmVudCwgY3VyVG9Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbmV4dFNpYmxpbmcocm9vdE5vZGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnNlcnRWaXJ0dWFsQ29tcG9uZW50QmVmb3JlKFxuICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudCxcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG1hdGNoaW5nRnJvbUNvbXBvbmVudC5fX19yb290Tm9kZSAhPT0gY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkICYmXG4gICAgICAgICAgICAgIChmcm9tQ29tcG9uZW50ID0gY29tcG9uZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKSkgJiZcbiAgICAgICAgICAgICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtcbiAgICAgICAgICAgICAgICBmcm9tQ29tcG9uZW50LmlkXG4gICAgICAgICAgICAgIF0gPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIC8vIFRoZSBjb21wb25lbnQgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IHJlYWwgRE9NIG5vZGUgd2FzIG5vdCByZW5kZXJlZFxuICAgICAgICAgICAgICAvLyBzbyB3ZSBzaG91bGQganVzdCByZW1vdmUgaXQgb3V0IG9mIHRoZSByZWFsIERPTSBieSBkZXN0cm95aW5nIGl0XG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBuZXh0U2libGluZyhmcm9tQ29tcG9uZW50Ll9fX3Jvb3ROb2RlKTtcbiAgICAgICAgICAgICAgZGVzdHJveUNvbXBvbmVudChmcm9tQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gbW92ZSB0aGUgZXhpc3RpbmcgY29tcG9uZW50IGludG9cbiAgICAgICAgICAgIC8vIHRoZSBjb3JyZWN0IGxvY2F0aW9uXG4gICAgICAgICAgICBpbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgIG1hdGNoaW5nRnJvbUNvbXBvbmVudC5fX19yb290Tm9kZSxcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID1cbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCAmJiBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICBtb3JwaENvbXBvbmVudChjb21wb25lbnQsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgY3VyVG9Ob2RlS2V5T3JpZ2luYWwgPSBjdXJUb05vZGVLZXk7XG5cbiAgICAgICAgaWYgKGlzQXV0b0tleShjdXJUb05vZGVLZXkpKSB7XG4gICAgICAgICAgaWYgKG93bmVyQ29tcG9uZW50ICE9PSBwYXJlbnRDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGN1clRvTm9kZUtleSArPSBcIjpcIiArIG93bmVyQ29tcG9uZW50LmlkO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQgPSBwYXJlbnRDb21wb25lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50ID0gb3duZXJDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBoYXZlIGEga2V5ZWQgZWxlbWVudC4gVGhpcyBpcyB0aGUgZmFzdCBwYXRoIGZvciBtYXRjaGluZ1xuICAgICAgICAvLyB1cCBlbGVtZW50c1xuICAgICAgICBjdXJUb05vZGVLZXkgPSAoXG4gICAgICAgICAga2V5U2VxdWVuY2VzW3JlZmVyZW5jZUNvbXBvbmVudC5pZF0gfHxcbiAgICAgICAgICAoa2V5U2VxdWVuY2VzW3JlZmVyZW5jZUNvbXBvbmVudC5pZF0gPSBuZXcgS2V5U2VxdWVuY2UoKSlcbiAgICAgICAgKS5fX19uZXh0S2V5KGN1clRvTm9kZUtleSk7XG5cbiAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICBjdXJGcm9tTm9kZUtleSA9IGtleXNCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdkVsZW1lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5ID09PSBjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAvLyBFbGVtZW50cyBsaW5lIHVwLiBOb3cgd2UganVzdCBoYXZlIHRvIG1ha2Ugc3VyZSB0aGV5IGFyZSBjb21wYXRpYmxlXG4gICAgICAgICAgaWYgKCFjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgLy8gV2UganVzdCBza2lwIG92ZXIgdGhlIGZyb21Ob2RlIGlmIGl0IGlzIHByZXNlcnZlZFxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkICYmXG4gICAgICAgICAgICAgIGN1clRvTm9kZVR5cGUgPT09IGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVUeXBlICYmXG4gICAgICAgICAgICAgIChjdXJUb05vZGVUeXBlICE9PSBFTEVNRU5UX05PREUgfHxcbiAgICAgICAgICAgICAgICBjb21wYXJlTm9kZU5hbWVzKGN1clRvTm9kZUNoaWxkLCBjdXJWRnJvbU5vZGVDaGlsZCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vcnBoQ2hpbGRyZW4oXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvbGQgbm9kZVxuICAgICAgICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgLy8gSW5jb21wYXRpYmxlIG5vZGVzLiBKdXN0IG1vdmUgdGhlIHRhcmdldCBWTm9kZSBpbnRvIHRoZSBET00gYXQgdGhpcyBwb3NpdGlvblxuICAgICAgICAgICAgICBpbnNlcnRWaXJ0dWFsTm9kZUJlZm9yZShcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoaW5nRnJvbUVsID0gcmVmZXJlbmNlQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbY3VyVG9Ob2RlS2V5XTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBtYXRjaGluZ0Zyb21FbCA9PT0gY3VyRnJvbU5vZGVDaGlsZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaWYgKGlzSHlkcmF0ZSAmJiBjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICAoY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUgfHxcbiAgICAgICAgICAgICAgICAgIGNhc2VJbnNlbnNpdGl2ZUNvbXBhcmUoXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLl9fX25vZGVOYW1lIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZpcnR1YWxpemVFbGVtZW50KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVOYW1lID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZU5hbWU7XG4gICAgICAgICAgICAgICAga2V5c0J5RE9NTm9kZS5zZXQoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1tjdXJUb05vZGVLZXldID1cbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChjdXJGcm9tTm9kZUNoaWxkLCBjdXJWRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZC5fX19ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZW50ID09IFwiRiNcIiArIGN1clRvTm9kZUtleU9yaWdpbmFsKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZW5kTm9kZSA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICB2YXIgZGVwdGggPSAwO1xuICAgICAgICAgICAgICAgICAgdmFyIG5vZGVWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZE5vZGUubm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgIG5vZGVWYWx1ZSA9IGVuZE5vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlVmFsdWUgPT09IFwiRi9cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlcHRoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVWYWx1ZS5pbmRleE9mKFwiRiNcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGUgPSBlbmROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICB2YXIgZnJhZ21lbnQgPSBjcmVhdGVGcmFnbWVudE5vZGUoXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGtleXNCeURPTU5vZGUuc2V0KGZyYWdtZW50LCBjdXJUb05vZGVLZXkpO1xuICAgICAgICAgICAgICAgICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGZyYWdtZW50LCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1tjdXJUb05vZGVLZXldID0gZnJhZ21lbnQ7XG4gICAgICAgICAgICAgICAgICByZW1vdmVDaGlsZChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgIHJlbW92ZUNoaWxkKGVuZE5vZGUpO1xuXG4gICAgICAgICAgICAgICAgICBpZiAoIWN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJhZ21lbnQsIGN1clRvTm9kZUNoaWxkLCBwYXJlbnRDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJhZ21lbnQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZXRhY2hlZEJ5RE9NTm9kZS5nZXQobWF0Y2hpbmdGcm9tRWwpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgZGV0YWNoZWRCeURPTU5vZGUuc2V0KG1hdGNoaW5nRnJvbUVsLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdkVsZW1lbnRCeURPTU5vZGUuZ2V0KG1hdGNoaW5nRnJvbUVsKTtcblxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgJiZcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVUeXBlID09PSBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlVHlwZSAmJlxuICAgICAgICAgICAgICAgIChjdXJUb05vZGVUeXBlICE9PSBFTEVNRU5UX05PREUgfHxcbiAgICAgICAgICAgICAgICAgIGNvbXBhcmVOb2RlTmFtZXMoY3VyVkZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKSlcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZyb21OZXh0U2libGluZyA9PT0gbWF0Y2hpbmdGcm9tRWwpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHJlbW92YWw6XG4gICAgICAgICAgICAgICAgICAvLyBBIDwtPiBBXG4gICAgICAgICAgICAgICAgICAvLyBCIDwtPiBDIDwtLSBXZSBhcmUgaGVyZVxuICAgICAgICAgICAgICAgICAgLy8gQyAgICAgRFxuICAgICAgICAgICAgICAgICAgLy8gRFxuICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHN3YXA6XG4gICAgICAgICAgICAgICAgICAvLyBBIDwtPiBBXG4gICAgICAgICAgICAgICAgICAvLyBCIDwtPiBDIDwtLSBXZSBhcmUgaGVyZVxuICAgICAgICAgICAgICAgICAgLy8gQyAgICAgQlxuXG4gICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgdG9OZXh0U2libGluZy5fX19rZXkgPT09IGN1ckZyb21Ob2RlS2V5XG4gICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlIGVsZW1lbnQgc3dhcFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gc3RheSBvbiB0aGUgY3VycmVudCByZWFsIERPTSBub2RlXG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQnV0IG1vdmUgdGhlIG1hdGNoaW5nIGVsZW1lbnQgaW50byBwbGFjZVxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSBlbGVtZW50IHJlbW92YWxcblxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHJlbW92ZSB0aGUgY3VycmVudCByZWFsIERPTSBub2RlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCB0aGUgbWF0Y2hpbmcgcmVhbCBET00gbm9kZSB3aWxsIGZhbGwgaW50b1xuICAgICAgICAgICAgICAgICAgICAvLyBwbGFjZS4gV2Ugd2lsbCBjb250aW51ZSBkaWZmaW5nIHdpdGggbmV4dCBzaWJsaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRoZSByZWFsIERPTSBub2RlIHRoYXQganVzdCBmZWxsIGludG8gcGxhY2VcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcoZnJvbU5leHRTaWJsaW5nKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyBBIDwtPiBBXG4gICAgICAgICAgICAgICAgICAvLyBCIDwtPiBEIDwtLSBXZSBhcmUgaGVyZVxuICAgICAgICAgICAgICAgICAgLy8gQ1xuICAgICAgICAgICAgICAgICAgLy8gRFxuXG4gICAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIG1vdmUgdGhlIG1hdGNoaW5nIG5vZGUgaW50byBwbGFjZVxuICAgICAgICAgICAgICAgICAgaW5zZXJ0QWZ0ZXIobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWNoTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSwgb3duZXJDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nRnJvbUVsLFxuICAgICAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG1vcnBoQ2hpbGRyZW4oXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nRnJvbUVsLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgICAgIG93bmVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZGV0YWNoTm9kZShtYXRjaGluZ0Zyb21FbCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gcHJlc2VydmUgdGhlIG5vZGVcbiAgICAgICAgICAgICAgLy8gYnV0IHN0aWxsIHdlIG5lZWQgdG8gZGlmZiB0aGUgY3VycmVudCBmcm9tIG5vZGVcbiAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSk7XG4gICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGtub3cgdGhlIHRhcmdldCBub2RlIGlzIG5vdCBhIFZDb21wb25lbnQgbm9kZSBhbmQgd2Uga25vd1xuICAgICAgLy8gaXQgaXMgYWxzbyBub3QgYSBwcmVzZXJ2ZSBub2RlLiBMZXQncyBub3cgbWF0Y2ggdXAgdGhlIEhUTUxcbiAgICAgIC8vIGVsZW1lbnQsIHRleHQgbm9kZSwgY29tbWVudCwgZXRjLlxuICAgICAgd2hpbGUgKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgaWYgKChmcm9tQ29tcG9uZW50ID0gY29tcG9uZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKSkpIHtcbiAgICAgICAgICAvLyBUaGUgY3VycmVudCBcInRvXCIgZWxlbWVudCBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGEgY29tcG9uZW50LFxuICAgICAgICAgIC8vIGJ1dCB0aGUgY3VycmVudCBcImZyb21cIiBlbGVtZW50IGlzIGFzc29jaWF0ZWQgd2l0aCBhIGNvbXBvbmVudFxuXG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBkZXN0cm95IHRoZSBjdXJyZW50IGNvbXBvbmVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAvLyBET00gb3Igbm90LCB3ZSBzdGlsbCBuZWVkIHRvIHNraXAgb3ZlciBpdCBzaW5jZSBpdCBpc1xuICAgICAgICAgIC8vIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIGN1cnJlbnQgXCJ0b1wiIG5vZGVcbiAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbZnJvbUNvbXBvbmVudC5pZF1cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGRlc3Ryb3lDb21wb25lbnQoZnJvbUNvbXBvbmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7IC8vIE1vdmUgdG8gdGhlIG5leHQgXCJmcm9tXCIgbm9kZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1ckZyb21Ob2RlVHlwZSA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGU7XG5cbiAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBjdXJUb05vZGVUeXBlKSB7XG4gICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBFbGVtZW50IG5vZGVzXG4gICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZFbGVtZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgIGlmIChjdXJWRnJvbU5vZGVDaGlsZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGlmIChpc0h5ZHJhdGUpIHtcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHZpcnR1YWxpemVFbGVtZW50KGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgY2FzZUluc2Vuc2l0aXZlQ29tcGFyZShcbiAgICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLl9fX25vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZU5hbWUgPSBjdXJUb05vZGVDaGlsZC5fX19ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2tpcCBvdmVyIG5vZGVzIHRoYXQgZG9uJ3QgbG9vayBsaWtlIG91cnMuLi5cbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChjdXJGcm9tTm9kZUtleSA9IGN1clZGcm9tTm9kZUNoaWxkLl9fX2tleSkpIHtcbiAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIGtleWVkIGVsZW1lbnQgaGVyZSBidXQgb3VyIHRhcmdldCBWRE9NIG5vZGVcbiAgICAgICAgICAgICAgLy8gaXMgbm90IGtleWVkIHNvIHRoaXMgbm90IGRvZXNuJ3QgYmVsb25nXG4gICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc0NvbXBhdGlibGUgPVxuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmXG4gICAgICAgICAgICAgIGNvbXBhcmVOb2RlTmFtZXMoY3VyVkZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKSA9PT0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBjb21wYXRpYmxlIERPTSBlbGVtZW50cyBzbyB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAvLyB0YXJnZXQgRE9NIG5vZGUuXG4gICAgICAgICAgICAgIG1vcnBoRWwoXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8XG4gICAgICAgICAgICBjdXJGcm9tTm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgVGV4dCBvciBDb21tZW50IG5vZGVzXG4gICAgICAgICAgICBpc0NvbXBhdGlibGUgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZVZhbHVlID0gY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZVZhbHVlO1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlVmFsdWUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVZhbHVlICE9PSBjdXJUb05vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgaXNIeWRyYXRlICYmXG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZyAmJlxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlVHlwZSA9PT0gVEVYVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZy5fX19ub2RlVHlwZSA9PT0gVEVYVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVWYWx1ZS5zdGFydHNXaXRoKGN1clRvTm9kZVZhbHVlKSAmJlxuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcuX19fbm9kZVZhbHVlLnN0YXJ0c1dpdGgoXG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZVZhbHVlLnNsaWNlKGN1clRvTm9kZVZhbHVlLmxlbmd0aCksXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBJbiBoeWRyYXRlIG1vZGUgd2UgY2FuIHVzZSBzcGxpdFRleHQgdG8gbW9yZSBlZmZpY2llbnRseSBoYW5kbGVcbiAgICAgICAgICAgICAgICAvLyBhZGphY2VudCB0ZXh0IHZkb20gbm9kZXMgdGhhdCB3ZXJlIG1lcmdlZC5cbiAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLnNwbGl0VGV4dChcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZVZhbHVlLmxlbmd0aCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNpbXBseSB1cGRhdGUgbm9kZVZhbHVlIG9uIHRoZSBvcmlnaW5hbCBub2RlIHRvXG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0NvbXBhdGlibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAvLyBBZHZhbmNlIGJvdGggdGhlIFwidG9cIiBjaGlsZCBhbmQgdGhlIFwiZnJvbVwiIGNoaWxkIHNpbmNlIHdlIGZvdW5kIGEgbWF0Y2hcbiAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgIH0gLy8gRU5EOiB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZClcblxuICAgICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyIHRoZW4gd2UgZGlkIG5vdCBmaW5kIGEgY2FuZGlkYXRlIG1hdGNoIGZvclxuICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgLy8gbm9kZXMuIFRoZXJlZm9yZSwgd2Ugd2lsbCBqdXN0IGFwcGVuZCB0aGUgY3VycmVudCBcInRvXCIgbm9kZVxuICAgICAgLy8gdG8gdGhlIGVuZFxuICAgICAgaW5zZXJ0VmlydHVhbE5vZGVCZWZvcmUoXG4gICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgIGZyb21Ob2RlLFxuICAgICAgICBvd25lckNvbXBvbmVudCxcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgKTtcblxuICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICB9XG5cbiAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi5cbiAgICBpZiAoZnJvbU5vZGUuX19fZmluaXNoRnJhZ21lbnQpIHtcbiAgICAgIC8vIElmIHdlIGFyZSBpbiBhbiB1bmZpbmlzaGVkIGZyYWdtZW50LCB3ZSBoYXZlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgbm9kZXNcbiAgICAgIC8vIHdlIHdlcmUgbWF0Y2hpbmcgdXAgYW5kIG5lZWQgdG8gZW5kIHRoZSBmcmFnbWVudFxuICAgICAgZnJvbU5vZGUuX19fZmluaXNoRnJhZ21lbnQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIGN1ckZyb21Ob2RlQ2hpbGQgaXMgbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2Rlc1xuICAgICAgLy8gbGVmdCBvdmVyIHRoYXQgbmVlZCB0byBiZSByZW1vdmVkXG4gICAgICB2YXIgZnJhZ21lbnRCb3VuZGFyeSA9XG4gICAgICAgIGZyb21Ob2RlLm5vZGVUeXBlID09PSBGUkFHTUVOVF9OT0RFID8gZnJvbU5vZGUuZW5kTm9kZSA6IG51bGw7XG5cbiAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkICYmIGN1ckZyb21Ob2RlQ2hpbGQgIT09IGZyYWdtZW50Qm91bmRhcnkpIHtcbiAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgaWYgKChmcm9tQ29tcG9uZW50ID0gY29tcG9uZW50QnlET01Ob2RlLmdldChjdXJGcm9tTm9kZUNoaWxkKSkpIHtcbiAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW2Zyb21Db21wb25lbnQuaWRdXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBkZXN0cm95Q29tcG9uZW50KGZyb21Db21wb25lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdkVsZW1lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICBjdXJGcm9tTm9kZUtleSA9IGtleXNCeURPTU5vZGUuZ2V0KGZyb21Ob2RlKTtcblxuICAgICAgICAvLyBGb3IgdHJhbnNjbHVkZWQgY29udGVudCwgd2UgbmVlZCB0byBjaGVjayBpZiB0aGUgZWxlbWVudCBiZWxvbmdzIHRvIGEgZGlmZmVyZW50IGNvbXBvbmVudFxuICAgICAgICAvLyBjb250ZXh0IHRoYW4gdGhlIGN1cnJlbnQgY29tcG9uZW50IGFuZCBlbnN1cmUgaXQgZ2V0cyByZW1vdmVkIGZyb20gaXRzIGtleSBpbmRleC5cbiAgICAgICAgaWYgKCFjdXJGcm9tTm9kZUtleSB8fCBpc0F1dG9LZXkoY3VyRnJvbU5vZGVLZXkpKSB7XG4gICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50ID0gcGFyZW50Q29tcG9uZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudCA9XG4gICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCAmJiBjdXJWRnJvbU5vZGVDaGlsZC5fX19vd25lckNvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIHJlZmVyZW5jZUNvbXBvbmVudCk7XG5cbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3JwaEVsKGZyb21FbCwgdkZyb21FbCwgdG9FbCwgcGFyZW50Q29tcG9uZW50KSB7XG4gICAgdmFyIG5vZGVOYW1lID0gdG9FbC5fX19ub2RlTmFtZTtcbiAgICB2YXIgY29uc3RJZCA9IHRvRWwuX19fY29uc3RJZDtcbiAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoZnJvbUVsLCB0b0VsKTtcblxuICAgIGlmIChjb25zdElkICE9PSB1bmRlZmluZWQgJiYgdkZyb21FbC5fX19jb25zdElkID09PSBjb25zdElkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbW9ycGhBdHRycyhmcm9tRWwsIHZGcm9tRWwsIHRvRWwpO1xuXG4gICAgaWYgKHRvRWwuX19fcHJlc2VydmVCb2R5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5vZGVOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGlmICh0b0VsLl9fX3ZhbHVlSW50ZXJuYWwgIT09IHZGcm9tRWwuX19fdmFsdWVJbnRlcm5hbCkge1xuICAgICAgICBmcm9tRWwudmFsdWUgPSB0b0VsLl9fX3ZhbHVlSW50ZXJuYWw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsLCBwYXJlbnRDb21wb25lbnQpO1xuICAgIH1cbiAgfSAvLyBFTkQ6IG1vcnBoRWwoLi4uKVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIGNvbXBvbmVudHNVdGlsLl9fX3N0b3BET01NYW5pcHVsYXRpb25XYXJuaW5nKGhvc3QpO1xuICB9XG5cbiAgbW9ycGhDaGlsZHJlbihmcm9tTm9kZSwgdG9Ob2RlLCB0b05vZGUuX19fY29tcG9uZW50KTtcblxuICBkZXRhY2hlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgZGV0YWNoZWRGcm9tQ29tcG9uZW50ID0gZGV0YWNoZWRCeURPTU5vZGUuZ2V0KG5vZGUpO1xuXG4gICAgaWYgKGRldGFjaGVkRnJvbUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXRhY2hlZEJ5RE9NTm9kZS5zZXQobm9kZSwgdW5kZWZpbmVkKTtcblxuICAgICAgdmFyIGNvbXBvbmVudFRvRGVzdHJveSA9IGNvbXBvbmVudEJ5RE9NTm9kZS5nZXQobm9kZSk7XG4gICAgICBpZiAoY29tcG9uZW50VG9EZXN0cm95KSB7XG4gICAgICAgIGNvbXBvbmVudFRvRGVzdHJveS5kZXN0cm95KCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGRldGFjaGVkRnJvbUNvbXBvbmVudCAhPT0gdHJ1ZSAmJiBkZXRhY2hlZEZyb21Db21wb25lbnQsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGV2ZW50RGVsZWdhdGlvbi5fX19oYW5kbGVOb2RlRGV0YWNoKG5vZGUpICE9IGZhbHNlKSB7XG4gICAgICAgICAgcmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgIGNvbXBvbmVudHNVdGlsLl9fX3N0YXJ0RE9NTWFuaXB1bGF0aW9uV2FybmluZyhob3N0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vcnBoZG9tO1xuIiwidmFyIHBhcnNlSFRNTCA9IGZ1bmN0aW9uIChodG1sKSB7XG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7XG4gIHBhcnNlSFRNTCA9IGNvbnRhaW5lci5jb250ZW50XG4gICAgPyBmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5jb250ZW50O1xuICAgICAgfVxuICAgIDogZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICB9O1xuXG4gIHJldHVybiBwYXJzZUhUTUwoaHRtbCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChodG1sKSB7XG4gIHJldHVybiBwYXJzZUhUTUwoaHRtbCkuZmlyc3RDaGlsZDtcbn07XG4iLCJ2YXIgcGFyc2VIVE1MID0gcmVxdWlyZShcIi4vcGFyc2UtaHRtbFwiKTtcbnZhciBWQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vVkNvbXBvbmVudFwiKTtcbnZhciBWRG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoXCIuL1ZEb2N1bWVudEZyYWdtZW50XCIpO1xudmFyIFZFbGVtZW50ID0gcmVxdWlyZShcIi4vVkVsZW1lbnRcIik7XG52YXIgVkZyYWdtZW50ID0gcmVxdWlyZShcIi4vVkZyYWdtZW50XCIpO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG52YXIgVlRleHQgPSByZXF1aXJlKFwiLi9WVGV4dFwiKTtcblxudmFyIHNwZWNpYWxIdG1sUmVnZXhwID0gL1smPF0vO1xuXG5mdW5jdGlvbiB2aXJ0dWFsaXplQ2hpbGROb2Rlcyhub2RlLCB2ZG9tUGFyZW50LCBvd25lckNvbXBvbmVudCkge1xuICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gIHdoaWxlIChjdXJDaGlsZCkge1xuICAgIHZkb21QYXJlbnQuX19fYXBwZW5kQ2hpbGQodmlydHVhbGl6ZShjdXJDaGlsZCwgb3duZXJDb21wb25lbnQpKTtcbiAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZpcnR1YWxpemUobm9kZSwgb3duZXJDb21wb25lbnQpIHtcbiAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIFZFbGVtZW50Ll9fX3ZpcnR1YWxpemUobm9kZSwgdmlydHVhbGl6ZUNoaWxkTm9kZXMsIG93bmVyQ29tcG9uZW50KTtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gbmV3IFZUZXh0KG5vZGUubm9kZVZhbHVlLCBvd25lckNvbXBvbmVudCk7XG4gICAgY2FzZSAxMTpcbiAgICAgIHZhciB2ZG9tRG9jRnJhZ21lbnQgPSBuZXcgVkRvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHZpcnR1YWxpemVDaGlsZE5vZGVzKG5vZGUsIHZkb21Eb2NGcmFnbWVudCwgb3duZXJDb21wb25lbnQpO1xuICAgICAgcmV0dXJuIHZkb21Eb2NGcmFnbWVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiB2aXJ0dWFsaXplSFRNTChodG1sLCBvd25lckNvbXBvbmVudCkge1xuICBpZiAoIXNwZWNpYWxIdG1sUmVnZXhwLnRlc3QoaHRtbCkpIHtcbiAgICByZXR1cm4gbmV3IFZUZXh0KGh0bWwsIG93bmVyQ29tcG9uZW50KTtcbiAgfVxuXG4gIHZhciB2ZG9tRnJhZ21lbnQgPSBuZXcgVkRvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGN1ckNoaWxkID0gcGFyc2VIVE1MKGh0bWwpO1xuXG4gIHdoaWxlIChjdXJDaGlsZCkge1xuICAgIHZkb21GcmFnbWVudC5fX19hcHBlbmRDaGlsZCh2aXJ0dWFsaXplKGN1ckNoaWxkLCBvd25lckNvbXBvbmVudCkpO1xuICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gIH1cblxuICByZXR1cm4gdmRvbUZyYWdtZW50O1xufVxuXG52YXIgTm9kZV9wcm90b3R5cGUgPSBWTm9kZS5wcm90b3R5cGU7XG5cbi8qKlxuICogU2hvcnRoYW5kIG1ldGhvZCBmb3IgY3JlYXRpbmcgYW5kIGFwcGVuZGluZyBhIFRleHQgbm9kZSB3aXRoIGEgZ2l2ZW4gdmFsdWVcbiAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIHRleHQgdmFsdWUgZm9yIHRoZSBuZXcgVGV4dCBub2RlXG4gKi9cbk5vZGVfcHJvdG90eXBlLnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHZhciB2ZG9tTm9kZTtcblxuICBpZiAodHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBpZiAodmFsdWUudG9IVE1MKSB7XG4gICAgICAgIHZkb21Ob2RlID0gdmlydHVhbGl6ZUhUTUwodmFsdWUudG9IVE1MKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuX19fYXBwZW5kQ2hpbGQodmRvbU5vZGUgfHwgbmV3IFZUZXh0KHZhbHVlLnRvU3RyaW5nKCkpKTtcbiAgcmV0dXJuIHRoaXMuX19fZmluaXNoQ2hpbGQoKTtcbn07XG5cbk5vZGVfcHJvdG90eXBlLl9fX2FwcGVuZERvY3VtZW50RnJhZ21lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9fX2FwcGVuZENoaWxkKG5ldyBWRG9jdW1lbnRGcmFnbWVudCgpKTtcbn07XG5cbmV4cG9ydHMuX19fVkRvY3VtZW50RnJhZ21lbnQgPSBWRG9jdW1lbnRGcmFnbWVudDtcbmV4cG9ydHMuX19fVkVsZW1lbnQgPSBWRWxlbWVudDtcbmV4cG9ydHMuX19fVlRleHQgPSBWVGV4dDtcbmV4cG9ydHMuX19fVkNvbXBvbmVudCA9IFZDb21wb25lbnQ7XG5leHBvcnRzLl9fX1ZGcmFnbWVudCA9IFZGcmFnbWVudDtcbmV4cG9ydHMuX19fdmlydHVhbGl6ZSA9IHZpcnR1YWxpemU7XG5leHBvcnRzLl9fX3ZpcnR1YWxpemVIVE1MID0gdmlydHVhbGl6ZUhUTUw7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvcHlQcm9wcyhmcm9tLCB0bykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGZyb20pLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSwgbmFtZSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7IC8vQSBzaW1wbGUgZnVuY3Rpb24gdG8gY29weSBwcm9wZXJ0aWVzIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyXG4gICAgaWYgKCF0YXJnZXQpIHsgLy9DaGVjayBpZiBhIHRhcmdldCB3YXMgcHJvdmlkZWQsIG90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHkgb2JqZWN0IHRvIHJldHVyblxuICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3BOYW1lIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHsgLy9Pbmx5IGxvb2sgYXQgc291cmNlIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IGluaGVyaXRlZFxuICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wTmFtZV0gPSBzb3VyY2VbcHJvcE5hbWVdOyAvL0NvcHkgdGhlIHByb3BlcnR5XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTsiLCJ2YXIgY29weVByb3BzID0gcmVxdWlyZSgnLi9jb3B5UHJvcHMnKTtcblxuZnVuY3Rpb24gaW5oZXJpdChjdG9yLCBzdXBlckN0b3IsIHNob3VsZENvcHlQcm9wcykge1xuICAgIHZhciBvbGRQcm90byA9IGN0b3IucHJvdG90eXBlO1xuICAgIHZhciBuZXdQcm90byA9IGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob2xkUHJvdG8gJiYgc2hvdWxkQ29weVByb3BzICE9PSBmYWxzZSkge1xuICAgICAgICBjb3B5UHJvcHMob2xkUHJvdG8sIG5ld1Byb3RvKTtcbiAgICB9XG4gICAgY3Rvci4kc3VwZXIgPSBzdXBlckN0b3I7XG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXdQcm90bztcbiAgICByZXR1cm4gY3Rvcjtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaGVyaXQ7XG5pbmhlcml0Ll9pbmhlcml0ID0gaW5oZXJpdDtcbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ3N0YWNrZnJhbWUnLCBbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5TdGFja0ZyYW1lID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIF9pc051bWJlcihuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NhcGl0YWxpemUoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXR0ZXIocCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1twXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYm9vbGVhblByb3BzID0gWydpc0NvbnN0cnVjdG9yJywgJ2lzRXZhbCcsICdpc05hdGl2ZScsICdpc1RvcGxldmVsJ107XG4gICAgdmFyIG51bWVyaWNQcm9wcyA9IFsnY29sdW1uTnVtYmVyJywgJ2xpbmVOdW1iZXInXTtcbiAgICB2YXIgc3RyaW5nUHJvcHMgPSBbJ2ZpbGVOYW1lJywgJ2Z1bmN0aW9uTmFtZScsICdzb3VyY2UnXTtcbiAgICB2YXIgYXJyYXlQcm9wcyA9IFsnYXJncyddO1xuICAgIHZhciBvYmplY3RQcm9wcyA9IFsnZXZhbE9yaWdpbiddO1xuXG4gICAgdmFyIHByb3BzID0gYm9vbGVhblByb3BzLmNvbmNhdChudW1lcmljUHJvcHMsIHN0cmluZ1Byb3BzLCBhcnJheVByb3BzLCBvYmplY3RQcm9wcyk7XG5cbiAgICBmdW5jdGlvbiBTdGFja0ZyYW1lKG9iaikge1xuICAgICAgICBpZiAoIW9iaikgcmV0dXJuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAob2JqW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpc1snc2V0JyArIF9jYXBpdGFsaXplKHByb3BzW2ldKV0ob2JqW3Byb3BzW2ldXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdGFja0ZyYW1lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZ2V0QXJnczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcmdzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBcmdzOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJncyBtdXN0IGJlIGFuIEFycmF5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFyZ3MgPSB2O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEV2YWxPcmlnaW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbE9yaWdpbjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RXZhbE9yaWdpbjogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBTdGFja0ZyYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsT3JpZ2luID0gdjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZhbE9yaWdpbiA9IG5ldyBTdGFja0ZyYW1lKHYpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFdmFsIE9yaWdpbiBtdXN0IGJlIGFuIE9iamVjdCBvciBTdGFja0ZyYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gdGhpcy5nZXRGaWxlTmFtZSgpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGxpbmVOdW1iZXIgPSB0aGlzLmdldExpbmVOdW1iZXIoKSB8fCAnJztcbiAgICAgICAgICAgIHZhciBjb2x1bW5OdW1iZXIgPSB0aGlzLmdldENvbHVtbk51bWJlcigpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRoaXMuZ2V0RnVuY3Rpb25OYW1lKCkgfHwgJyc7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRJc0V2YWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1tldmFsXSAoJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlciArICcpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICdbZXZhbF06JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uTmFtZSArICcgKCcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXIgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFN0YWNrRnJhbWUuZnJvbVN0cmluZyA9IGZ1bmN0aW9uIFN0YWNrRnJhbWUkJGZyb21TdHJpbmcoc3RyKSB7XG4gICAgICAgIHZhciBhcmdzU3RhcnRJbmRleCA9IHN0ci5pbmRleE9mKCcoJyk7XG4gICAgICAgIHZhciBhcmdzRW5kSW5kZXggPSBzdHIubGFzdEluZGV4T2YoJyknKTtcblxuICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gc3RyLnN1YnN0cmluZygwLCBhcmdzU3RhcnRJbmRleCk7XG4gICAgICAgIHZhciBhcmdzID0gc3RyLnN1YnN0cmluZyhhcmdzU3RhcnRJbmRleCArIDEsIGFyZ3NFbmRJbmRleCkuc3BsaXQoJywnKTtcbiAgICAgICAgdmFyIGxvY2F0aW9uU3RyaW5nID0gc3RyLnN1YnN0cmluZyhhcmdzRW5kSW5kZXggKyAxKTtcblxuICAgICAgICBpZiAobG9jYXRpb25TdHJpbmcuaW5kZXhPZignQCcpID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSAvQCguKz8pKD86OihcXGQrKSk/KD86OihcXGQrKSk/JC8uZXhlYyhsb2NhdGlvblN0cmluZywgJycpO1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gcGFydHNbMV07XG4gICAgICAgICAgICB2YXIgbGluZU51bWJlciA9IHBhcnRzWzJdO1xuICAgICAgICAgICAgdmFyIGNvbHVtbk51bWJlciA9IHBhcnRzWzNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgYXJnczogYXJncyB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNvbHVtbk51bWJlcjogY29sdW1uTnVtYmVyIHx8IHVuZGVmaW5lZFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29sZWFuUHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShib29sZWFuUHJvcHNbaV0pXSA9IF9nZXR0ZXIoYm9vbGVhblByb3BzW2ldKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShib29sZWFuUHJvcHNbaV0pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBCb29sZWFuKHYpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoYm9vbGVhblByb3BzW2ldKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bWVyaWNQcm9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKG51bWVyaWNQcm9wc1tqXSldID0gX2dldHRlcihudW1lcmljUHJvcHNbal0pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKG51bWVyaWNQcm9wc1tqXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXNOdW1iZXIodikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihwICsgJyBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBOdW1iZXIodik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShudW1lcmljUHJvcHNbal0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc3RyaW5nUHJvcHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShzdHJpbmdQcm9wc1trXSldID0gX2dldHRlcihzdHJpbmdQcm9wc1trXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUoc3RyaW5nUHJvcHNba10pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBTdHJpbmcodik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShzdHJpbmdQcm9wc1trXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0YWNrRnJhbWU7XG59KSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3NyYy9jb25zdGFudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9maW5hbGl6ZScpOyIsInZhciB3aW4gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogZ2xvYmFsO1xuZXhwb3J0cy5OT09QID0gd2luLiRXMTBOT09QID0gd2luLiRXMTBOT09QIHx8IGZ1bmN0aW9uICgpIHt9OyIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHNcIik7XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbmZ1bmN0aW9uIHJlc29sdmUob2JqZWN0LCBwYXRoLCBsZW4pIHtcbiAgICB2YXIgY3VycmVudCA9IG9iamVjdDtcbiAgICBmb3IgKHZhciBpPTA7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnRbcGF0aFtpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVUeXBlKGluZm8pIHtcbiAgICBpZiAoaW5mby50eXBlID09PSAnRGF0ZScpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGluZm8udmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoaW5mby50eXBlID09PSAnVVJMJykge1xuICAgICAgICByZXR1cm4gbmV3IFVSTChpbmZvLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGluZm8udHlwZSA9PT0gJ1VSTFNlYXJjaFBhcmFtcycpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoaW5mby52YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLnR5cGUgPT09ICdOT09QJykge1xuICAgICAgICByZXR1cm4gY29uc3RhbnRzLk5PT1A7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgdHlwZScpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5hbGl6ZShvdXRlcikge1xuICAgIGlmICghb3V0ZXIpIHtcbiAgICAgICAgcmV0dXJuIG91dGVyO1xuICAgIH1cblxuICAgIHZhciBhc3NpZ25tZW50cyA9IG91dGVyLiQkO1xuICAgIGlmIChhc3NpZ25tZW50cykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gb3V0ZXIubztcbiAgICAgICAgdmFyIGxlbjtcblxuICAgICAgICBpZiAoYXNzaWdubWVudHMgJiYgKGxlbj1hc3NpZ25tZW50cy5sZW5ndGgpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXNzaWdubWVudCA9IGFzc2lnbm1lbnRzW2ldO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJocyA9IGFzc2lnbm1lbnQucjtcbiAgICAgICAgICAgICAgICB2YXIgcmhzVmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShyaHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJoc1ZhbHVlID0gcmVzb2x2ZShvYmplY3QsIHJocywgcmhzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmhzVmFsdWUgPSByZXNvbHZlVHlwZShyaHMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBsaHMgPSBhc3NpZ25tZW50Lmw7XG4gICAgICAgICAgICAgICAgdmFyIGxoc0xhc3QgPSBsaHMubGVuZ3RoLTE7XG5cbiAgICAgICAgICAgICAgICBpZiAobGhzTGFzdCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gb3V0ZXIubyA9IHJoc1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGhzUGFyZW50ID0gcmVzb2x2ZShvYmplY3QsIGxocywgbGhzTGFzdCk7XG4gICAgICAgICAgICAgICAgICAgIGxoc1BhcmVudFtsaHNbbGhzTGFzdF1dID0gcmhzVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXNzaWdubWVudHMubGVuZ3RoID0gMDsgLy8gQXNzaWdubWVudHMgaGF2ZSBiZWVuIGFwcGxpZWQsIGRvIG5vdCByZWFwcGx5XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gbnVsbCA6IG9iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb3V0ZXI7XG4gICAgfVxuXG59OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIENvbXBpbGVkIHVzaW5nIG1hcmtvQDUuMzMuMTQgLSBETyBOT1QgRURJVFxuaW1wb3J0IHsgdCBhcyBfdCB9IGZyb20gXCJtYXJrby9zcmMvcnVudGltZS92ZG9tL2luZGV4LmpzXCI7XG5jb25zdCBfbWFya29fY29tcG9uZW50VHlwZSA9IFwibW9kZWxcXFxcaW5kZXgubWFya29cIixcbiAgX21hcmtvX3RlbXBsYXRlID0gX3QoX21hcmtvX2NvbXBvbmVudFR5cGUpO1xuZXhwb3J0IGRlZmF1bHQgX21hcmtvX3RlbXBsYXRlO1xuaW1wb3J0ICcuL3Rlc3QuanMnO1xuaW1wb3J0IF9tYXJrb19yZW5kZXJlciBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZW5kZXJlci5qc1wiO1xuaW1wb3J0IHsgciBhcyBfbWFya29fcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9yZWdpc3RyeS5qc1wiO1xuX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnRUeXBlLCAoKSA9PiBfbWFya29fdGVtcGxhdGUpO1xuY29uc3QgX21hcmtvX2NvbXBvbmVudCA9IHt9O1xuX21hcmtvX3RlbXBsYXRlLl8gPSBfbWFya29fcmVuZGVyZXIoZnVuY3Rpb24gKGlucHV0LCBvdXQsIF9jb21wb25lbnREZWYsIF9jb21wb25lbnQsIHN0YXRlLCAkZ2xvYmFsKSB7fSwge1xuICB0OiBfbWFya29fY29tcG9uZW50VHlwZSxcbiAgaTogdHJ1ZSxcbiAgZDogdHJ1ZVxufSwgX21hcmtvX2NvbXBvbmVudCk7XG5pbXBvcnQgX21hcmtvX2RlZmluZUNvbXBvbmVudCBmcm9tIFwibWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnQuanNcIjtcbl9tYXJrb190ZW1wbGF0ZS5Db21wb25lbnQgPSBfbWFya29fZGVmaW5lQ29tcG9uZW50KF9tYXJrb19jb21wb25lbnQsIF9tYXJrb190ZW1wbGF0ZS5fKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=