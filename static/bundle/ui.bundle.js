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
/***/ (() => {

let T = {};

T.Execute = function() {
  switch(Store.state.action) {
    case Action.CUSTOMACTION:
      console.log("Partita customaction");
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
/* harmony import */ var _testui_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_testui_js__WEBPACK_IMPORTED_MODULE_1__);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNB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QSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBYTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxJQUFhO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDamNBLGNBQWMsbUJBQU8sQ0FBQyxrRUFBcUI7QUFDM0MsWUFBWSxtQkFBTyxDQUFDLCtEQUFTOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7Ozs7OztBQ2hCQSxhQUFhLG1CQUFPLENBQUMsZ0VBQW9CO0FBQ3pDLGNBQWMsbUJBQU8sQ0FBQyxrRUFBcUI7QUFDM0MsWUFBWSxtQkFBTyxDQUFDLCtEQUFTOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQ0E7O0FBRUEsZUFBZSxLQUFhLElBQUksbUJBQU8sQ0FBQyxrREFBVTtBQUNsRCxjQUFjLG1CQUFPLENBQUMsa0VBQXFCO0FBQzNDLHFCQUFxQixtQkFBTyxDQUFDLG1IQUEyQjtBQUN4RCxjQUFjLG1CQUFPLENBQUMsdUZBQXdCO0FBQzlDO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLCtEQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxJQUFhO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEIsY0FBYyxVQUFVO0FBQ3hCLGNBQWMsVUFBVTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFD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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQjs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDakM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0M7O0FBRWhDO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDVkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQzBEO0FBQzFEO0FBQ0Esb0JBQW9CLGtFQUFFO0FBQ3RCLGlFQUFlLGVBQWUsRUFBQztBQUNWO0FBQ2tEO0FBQ2tCO0FBQ3pGLDJFQUF3QjtBQUN4QjtBQUNBLG9CQUFvQiwrRUFBZSxvRUFBb0U7QUFDdkc7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNvRjtBQUNyRiw0QkFBNEIsc0ZBQXNCLHNDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9jb21wbGFpbi9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL2Vycm9yLXN0YWNrLXBhcnNlci9lcnJvci1zdGFjay1wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9ldmVudHMtbGlnaHQvc3JjL2luZGV4LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbGlzdGVuZXItdHJhY2tlci9saWIvbGlzdGVuZXItdHJhY2tlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL2NvbXBvbmVudHMtYmVnaW5Db21wb25lbnQvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL2NvbXBvbmVudHMtZW5kQ29tcG9uZW50L2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLXJlZ2lzdHJ5L2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvbm9kZV9tb2R1bGVzL0BpbnRlcm5hbC9jb21wb25lbnRzLXV0aWwvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL3JlcXVpcmUvaW5kZXgtd2VicGFjay5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL3NldC1pbW1lZGlhdGUvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ub2RlX21vZHVsZXMvQGludGVybmFsL3NldC1pbW1lZGlhdGUvcXVldWVNaWNyb3Rhc2suanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9SZW5kZXJSZXN1bHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50RGVmLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnRzQ29udGV4dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvR2xvYmFsQ29tcG9uZW50c0NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL0tleVNlcXVlbmNlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9TdGF0ZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy9kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZXZlbnQtZGVsZWdhdGlvbi5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9jb21wb25lbnRzL3JlbmRlcmVyLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvY29tcG9uZW50cy91cGRhdGUtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2NyZWF0ZU91dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2RvbS1pbnNlcnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL19jaGFuZ2UtY2FzZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL2hlbHBlcnMvY2xhc3MtdmFsdWUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS9oZWxwZXJzL3N0eWxlLXZhbHVlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvcmVuZGVyYWJsZS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vQXN5bmNWRE9NQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVkNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vVkRvY3VtZW50RnJhZ21lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZFbGVtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WRnJhZ21lbnQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL1ZOb2RlLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9WVGV4dC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vaGVscGVycy9hdHRycy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9tYXJrby9zcmMvcnVudGltZS92ZG9tL21vcnBoZG9tL2ZyYWdtZW50LmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9oZWxwZXJzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvbWFya28vc3JjL3J1bnRpbWUvdmRvbS9tb3JwaGRvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vcGFyc2UtaHRtbC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL21hcmtvL3NyYy9ydW50aW1lL3Zkb20vdmRvbS5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3JhcHRvci11dGlsL2NvcHlQcm9wcy5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3JhcHRvci11dGlsL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly9wcmVub3QtcHJqLy4vbm9kZV9tb2R1bGVzL3JhcHRvci11dGlsL2luaGVyaXQuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy9zdGFja2ZyYW1lL3N0YWNrZnJhbWUuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy93YXJwMTAvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL2ZpbmFsaXplLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi9ub2RlX21vZHVsZXMvd2FycDEwL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai8uL25vZGVfbW9kdWxlcy93YXJwMTAvc3JjL2ZpbmFsaXplLmpzIiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS90ZXN0dWkuanMiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ByZW5vdC1wcmovd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9wcmVub3QtcHJqL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJlbm90LXByai93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ByZW5vdC1wcmovLi91aS9pbmRleC5tYXJrbyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBTdGFja1BhcnNlciA9IHJlcXVpcmUoJ2Vycm9yLXN0YWNrLXBhcnNlcicpO1xudmFyIGVudiA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOVjtcbnZhciBpc0RldmVsb3BtZW50ID0gIWVudiB8fCBlbnYgPT09ICdkZXYnIHx8IGVudiA9PT0gJ2RldmVsb3BtZW50JztcbnZhciBzaG93TW9kdWxlQ29tcGxhaW5zID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4ocHJvY2Vzcy5lbnYuU0hPV19NT0RVTEVfQ09NUExBSU5TKTtcbnZhciBzaG93TmVzdGVkQ29tcGxhaW5zID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4ocHJvY2Vzcy5lbnYuU0hPV19ORVNURURfQ09NUExBSU5TKTtcbnZhciBsb2dnZXIgPSB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuICYmIGNvbnNvbGU7XG52YXIgY3dkID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuY3dkKCkgKyAnLycgfHwgJyc7XG52YXIgbGluZWJyZWFrID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICd3aW4zMicgPT09IHByb2Nlc3MucGxhdGZvcm0gPyAnXFxyXFxuJyA6ICdcXG4nO1xudmFyIG5ld2xpbmUgPSAvKFxcclxcbnxcXHJ8XFxuKS9nO1xudmFyIHNsaWNlID0gW10uc2xpY2U7XG52YXIgaWdub3JlZExvY2F0aW9uID0gXCJbaWdub3JlXVwiO1xudmFyIGhpdHMgPSB7fTtcblxuY29tcGxhaW4gPSBpc0RldmVsb3BtZW50ID8gY29tcGxhaW4gOiBub29wO1xuY29tcGxhaW4ubWV0aG9kID0gaXNEZXZlbG9wbWVudCA/IG1ldGhvZCA6IG5vb3A7XG5jb21wbGFpbi5mbiA9IGlzRGV2ZWxvcG1lbnQgPyBmbiA6IG5vb3BSZXR1cm47XG5jb21wbGFpbi5sb2cgPSBsb2c7XG5jb21wbGFpbi5zdHJlYW0gPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5zdGRlcnI7XG5jb21wbGFpbi5zaWxlbmNlID0gZmFsc2U7XG5jb21wbGFpbi5jb2xvciA9IGNvbXBsYWluLnN0cmVhbSAmJiBjb21wbGFpbi5zdHJlYW0uaXNUVFk7XG5jb21wbGFpbi5jb2xvcnMgPSB7IHdhcm5pbmc6J1xceDFiWzMxOzFtJywgbm90aWNlOidcXHgxYlszMzsxbScsIG1lc3NhZ2U6ZmFsc2UsIGxvY2F0aW9uOidcXHUwMDFiWzkwbScgfTtcbmNvbXBsYWluLmdldE1vZHVsZU5hbWUgPSBnZXRNb2R1bGVOYW1lO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY29tcGxhaW47XG59IGVsc2UgaWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmNvbXBsYWluID0gY29tcGxhaW47XG59XG5cbmZ1bmN0aW9uIGNvbXBsYWluKCkge1xuICB2YXIgb3B0aW9ucztcbiAgdmFyIGxvY2F0aW9uO1xuICB2YXIgbG9jYXRpb25JbmRleDtcbiAgdmFyIGhlYWRpbmdDb2xvcjtcbiAgdmFyIGhlYWRpbmc7XG4gIHZhciBsZXZlbDtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgaWYoY29tcGxhaW4uc2lsZW5jZSkgcmV0dXJuO1xuXG4gIGlmKHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoLTFdID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSBhcmdzW2FyZ3MubGVuZ3RoLTFdO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3MsIDAsIC0xKTtcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBsZXZlbCA9IG9wdGlvbnMubGV2ZWwgfHwgMjtcbiAgaGVhZGluZyA9IG9wdGlvbnMuaGVhZGluZyB8fCAobGV2ZWwgPT0gMiA/IFwiV0FSTklORyEhXCIgOiBcIk5PVElDRVwiKTtcbiAgaGVhZGluZ0NvbG9yID0gb3B0aW9ucy5oZWFkaW5nQ29sb3IgfHwgKGxldmVsID09IDIgPyBjb21wbGFpbi5jb2xvcnMud2FybmluZyA6IGNvbXBsYWluLmNvbG9ycy5ub3RpY2UpO1xuXG4gIC8vIERlZmF1bHQgdG8gdGhlIGxvY2F0aW9uIG9mIHRoZSBjYWxsIHRvIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9uXG4gIGxvY2F0aW9uSW5kZXggPSBvcHRpb25zLmxvY2F0aW9uSW5kZXggPT0gbnVsbCA/IDEgOiBvcHRpb25zLmxvY2F0aW9uSW5kZXg7XG5cbiAgLy8gV2hlbiB0aGUgdXNlciBzZXRzIGxvY2F0aW9uIHRvIGZhbHNlLFxuICAvLyBXZSB3aWxsIHVzZSB0aGUgbG9jYXRpb24gb2YgdGhlIGNhbGwgdG8gY29tcGxhaW4oKVxuICAvLyBUbyBsaW1pdCB0aGUgbG9nIHRvIG9ubHkgb2NjdXJyaW5nIG9uY2VcbiAgaWYob3B0aW9ucy5sb2NhdGlvbiA9PT0gZmFsc2UpIHtcbiAgICBsb2NhdGlvbkluZGV4ID0gMDtcbiAgfVxuXG4gIGxvY2F0aW9uID0gb3B0aW9ucy5sb2NhdGlvbiB8fCBnZXRMb2NhdGlvbihsb2NhdGlvbkluZGV4KTtcbiAgXG4gIHZhciBtb2R1bGVOYW1lID0gY29tcGxhaW4uZ2V0TW9kdWxlTmFtZShsb2NhdGlvbik7XG5cbiAgaWYgKG1vZHVsZU5hbWUgJiYgIXNob3dNb2R1bGVDb21wbGFpbnMpIHtcbiAgICBpZiAoIWhpdHNbbW9kdWxlTmFtZV0pIHtcbiAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXQoXCJOT1RJQ0VcIiwgY29tcGxhaW4uY29sb3JzLm5vdGljZSk7XG4gICAgICBvdXRwdXQgKz0gbGluZWJyZWFrICsgZm9ybWF0KCdUaGUgbW9kdWxlIFsnK21vZHVsZU5hbWUrJ10gaXMgdXNpbmcgZGVwcmVjYXRlZCBmZWF0dXJlcy4nLCBjb21wbGFpbi5jb2xvcnMubWVzc2FnZSk7XG4gICAgICBvdXRwdXQgKz0gbGluZWJyZWFrICsgZm9ybWF0KCdSdW4gd2l0aCBwcm9jZXNzLmVudi5TSE9XX01PRFVMRV9DT01QTEFJTlM9MSB0byBzZWUgYWxsIHdhcm5pbmdzLicsIGNvbXBsYWluLmNvbG9ycy5tZXNzYWdlKTtcbiAgICAgIGNvbXBsYWluLmxvZyhsaW5lYnJlYWsgKyBvdXRwdXQgKyBsaW5lYnJlYWspO1xuICAgICAgaGl0c1ttb2R1bGVOYW1lXSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIC8vIExvY2F0aW9uIGlzIG9ubHkgbWlzc2luZyBpbiBvbGRlciBicm93c2Vycy5cbiAgaWYobG9jYXRpb24pIHtcbiAgICBpZihoaXRzW2xvY2F0aW9uXSB8fCBsb2NhdGlvbiA9PT0gaWdub3JlZExvY2F0aW9uKSByZXR1cm47XG4gICAgZWxzZSBoaXRzW2xvY2F0aW9uXSA9IHRydWU7XG4gIH1cblxuICB2YXIgb3V0cHV0ID0gZm9ybWF0KGhlYWRpbmcsIGhlYWRpbmdDb2xvcik7XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXQgKz0gbGluZWJyZWFrICsgZm9ybWF0KGFyZ3NbaV0sIGNvbXBsYWluLmNvbG9ycy5tZXNzYWdlKTtcbiAgfVxuXG4gIGlmKG9wdGlvbnMubG9jYXRpb24gIT09IGZhbHNlICYmIGxvY2F0aW9uKSB7XG4gICAgb3V0cHV0ICs9IGxpbmVicmVhayArIGZvcm1hdCgnICBhdCAnK2xvY2F0aW9uLnJlcGxhY2UoY3dkLCAnJyksIGNvbXBsYWluLmNvbG9ycy5sb2NhdGlvbik7XG4gIH1cblxuICBjb21wbGFpbi5sb2cobGluZWJyZWFrICsgb3V0cHV0ICsgbGluZWJyZWFrKTtcbn07XG5cbmZ1bmN0aW9uIG1ldGhvZChvYmplY3QsIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgb3JpZ2luYWxNZXRob2QgPSBvYmplY3RbbWV0aG9kTmFtZV07XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29tcGxhaW4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZuKG9yaWdpbmFsKSB7XG4gIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjb21wbGFpbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICByZXR1cm4gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2cobWVzc2FnZSwgY29sb3IpIHtcbiAgdmFyIGZvcm1hdHRlZCA9IGZvcm1hdChtZXNzYWdlLCBjb2xvcik7XG4gIGlmKGNvbXBsYWluLnN0cmVhbSkge1xuICAgIGNvbXBsYWluLnN0cmVhbS53cml0ZShmb3JtYXR0ZWQrbGluZWJyZWFrKTtcbiAgfSBlbHNlIGlmKGxvZ2dlcikge1xuICAgIGxvZ2dlci53YXJuKGZvcm1hdHRlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0KG1lc3NhZ2UsIGNvbG9yKSB7XG4gIHJldHVybiBjb2xvciAmJiBjb21wbGFpbi5jb2xvciA/IGNvbG9yICsgbWVzc2FnZSArICdcXHgxYlswbScgOiBtZXNzYWdlO1xufVxuXG5mdW5jdGlvbiBnZXRMb2NhdGlvbihsb2NhdGlvbkluZGV4KSB7XG4gIHZhciBsb2NhdGlvbiA9ICcnO1xuICB2YXIgdGFyZ2V0SW5kZXggPSBsb2NhdGlvbkluZGV4ICsgMjtcblxuICAvKipcbiAgICogU3RhY2sgaW5kZXggZGVzY3JpcHRpb25zLlxuICAgKiBcbiAgICogMDogSW4gZ2V0TG9jYXRpb24oKSwgdGhlIGNhbGwgdG8gbmV3IEVycm9yKClcbiAgICogMTogSW4gY29tcGxhaW4oKSwgdGhlIGNhbGwgdG8gZ2V0TG9jYXRpb24oKVxuICAgKiAyOiBJbiB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbiwgdGhlIGNhbGwgdG8gY29tcGxhaW4oKVxuICAgKiAzOiBUaGUgY2FsbCB0byB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbiAoVEhJUyBJUyBUSEUgREVGQVVMVClcbiAgICovXG5cbiAgdHJ5IHtcbiAgICB2YXIgbG9jYXRpb25zID0gU3RhY2tQYXJzZXIucGFyc2UobmV3IEVycm9yKCkpLm1hcChmdW5jdGlvbihmcmFtZSkge1xuICAgICAgcmV0dXJuIGZyYW1lLmZpbGVOYW1lKyc6JytmcmFtZS5saW5lTnVtYmVyKyc6JytmcmFtZS5jb2x1bW5OdW1iZXI7XG4gICAgfSk7XG4gICAgaWYgKCFzaG93TmVzdGVkQ29tcGxhaW5zKSB7XG4gICAgICBmb3IgKHZhciBpID0gbG9jYXRpb25zLmxlbmd0aC0xOyBpID4gdGFyZ2V0SW5kZXg7IGktLSkge1xuICAgICAgICBpZiAoaGl0c1tsb2NhdGlvbnNbaV1dKSB7XG4gICAgICAgICAgcmV0dXJuIGlnbm9yZWRMb2NhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsb2NhdGlvbiA9IGxvY2F0aW9uc1t0YXJnZXRJbmRleF07XG4gIH0gY2F0Y2goZSkge31cblxuICByZXR1cm4gbG9jYXRpb247XG59XG5cbmZ1bmN0aW9uIGdldE1vZHVsZU5hbWUobG9jYXRpb24pIHtcbiAgdmFyIGxvY2F0aW9uUGFydHMgPSBsb2NhdGlvbi5yZXBsYWNlKGN3ZCwgJycpLnNwbGl0KC9cXC98XFxcXC9nKTtcbiAgZm9yKHZhciBpID0gbG9jYXRpb25QYXJ0cy5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAobG9jYXRpb25QYXJ0c1tpXSA9PT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgIHZhciBtb2R1bGVOYW1lID0gbG9jYXRpb25QYXJ0c1tpKzFdO1xuICAgICAgcmV0dXJuIChtb2R1bGVOYW1lWzBdID09PSAnQCcpID8gbW9kdWxlTmFtZSsnLycrbG9jYXRpb25QYXJ0c1tpKzJdIDogbW9kdWxlTmFtZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCgpe307XG5mdW5jdGlvbiBub29wUmV0dXJuKHIpIHsgcmV0dXJuIHI7IH07XG4iLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24gKFVNRCkgdG8gc3VwcG9ydCBBTUQsIENvbW1vbkpTL05vZGUuanMsIFJoaW5vLCBhbmQgYnJvd3NlcnMuXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKCdlcnJvci1zdGFjay1wYXJzZXInLCBbJ3N0YWNrZnJhbWUnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ3N0YWNrZnJhbWUnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5FcnJvclN0YWNrUGFyc2VyID0gZmFjdG9yeShyb290LlN0YWNrRnJhbWUpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlcihTdGFja0ZyYW1lKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCA9IC8oXnxAKVxcUys6XFxkKy87XG4gICAgdmFyIENIUk9NRV9JRV9TVEFDS19SRUdFWFAgPSAvXlxccyphdCAuKihcXFMrOlxcZCt8XFwobmF0aXZlXFwpKS9tO1xuICAgIHZhciBTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQID0gL14oZXZhbEApPyhcXFtuYXRpdmUgY29kZV0pPyQvO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIGFuIEVycm9yIG9iamVjdCwgZXh0cmFjdCB0aGUgbW9zdCBpbmZvcm1hdGlvbiBmcm9tIGl0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBvYmplY3RcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IG9mIFN0YWNrRnJhbWVzXG4gICAgICAgICAqL1xuICAgICAgICBwYXJzZTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2UoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2t0cmFjZSAhPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGVycm9yWydvcGVyYSNzb3VyY2Vsb2MnXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhY2sgJiYgZXJyb3Iuc3RhY2subWF0Y2goQ0hST01FX0lFX1NUQUNLX1JFR0VYUCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVY4T3JJRShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGRk9yU2FmYXJpKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgZ2l2ZW4gRXJyb3Igb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gU2VwYXJhdGUgbGluZSBhbmQgY29sdW1uIG51bWJlcnMgZnJvbSBhIHN0cmluZyBvZiB0aGUgZm9ybTogKFVSSTpMaW5lOkNvbHVtbilcbiAgICAgICAgZXh0cmFjdExvY2F0aW9uOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRleHRyYWN0TG9jYXRpb24odXJsTGlrZSkge1xuICAgICAgICAgICAgLy8gRmFpbC1mYXN0IGJ1dCByZXR1cm4gbG9jYXRpb25zIGxpa2UgXCIobmF0aXZlKVwiXG4gICAgICAgICAgICBpZiAodXJsTGlrZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt1cmxMaWtlXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlZ0V4cCA9IC8oLis/KSg/OjooXFxkKykpPyg/OjooXFxkKykpPyQvO1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gcmVnRXhwLmV4ZWModXJsTGlrZS5yZXBsYWNlKC9bKCldL2csICcnKSk7XG4gICAgICAgICAgICByZXR1cm4gW3BhcnRzWzFdLCBwYXJ0c1syXSB8fCB1bmRlZmluZWQsIHBhcnRzWzNdIHx8IHVuZGVmaW5lZF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VWOE9ySUU6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlVjhPcklFKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZC5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyhldmFsICcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9ldmFsIGNvZGUvZywgJ2V2YWwnKS5yZXBsYWNlKC8oXFwoZXZhbCBhdCBbXigpXSopfCgsLiokKS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzYW5pdGl6ZWRMaW5lID0gbGluZS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXChldmFsIGNvZGUvZywgJygnKS5yZXBsYWNlKC9eLio/XFxzKy8sICcnKTtcblxuICAgICAgICAgICAgICAgIC8vIGNhcHR1cmUgYW5kIHByZXNldmUgdGhlIHBhcmVudGhlc2l6ZWQgbG9jYXRpb24gXCIoL2Zvby9teSBiYXIuanM6MTI6ODcpXCIgaW5cbiAgICAgICAgICAgICAgICAvLyBjYXNlIGl0IGhhcyBzcGFjZXMgaW4gaXQsIGFzIHRoZSBzdHJpbmcgaXMgc3BsaXQgb24gXFxzKyBsYXRlciBvblxuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHNhbml0aXplZExpbmUubWF0Y2goLyAoXFwoLitcXCkkKS8pO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBwYXJlbnRoZXNpemVkIGxvY2F0aW9uIGZyb20gdGhlIGxpbmUsIGlmIGl0IHdhcyBtYXRjaGVkXG4gICAgICAgICAgICAgICAgc2FuaXRpemVkTGluZSA9IGxvY2F0aW9uID8gc2FuaXRpemVkTGluZS5yZXBsYWNlKGxvY2F0aW9uWzBdLCAnJykgOiBzYW5pdGl6ZWRMaW5lO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgYSBsb2NhdGlvbiB3YXMgbWF0Y2hlZCwgcGFzcyBpdCB0byBleHRyYWN0TG9jYXRpb24oKSBvdGhlcndpc2UgcGFzcyBhbGwgc2FuaXRpemVkTGluZVxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhpcyBsaW5lIGRvZXNuJ3QgaGF2ZSBmdW5jdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbihsb2NhdGlvbiA/IGxvY2F0aW9uWzFdIDogc2FuaXRpemVkTGluZSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IGxvY2F0aW9uICYmIHNhbml0aXplZExpbmUgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IFsnZXZhbCcsICc8YW5vbnltb3VzPiddLmluZGV4T2YobG9jYXRpb25QYXJ0c1swXSkgPiAtMSA/IHVuZGVmaW5lZCA6IGxvY2F0aW9uUGFydHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VGRk9yU2FmYXJpOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZUZGT3JTYWZhcmkoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhbGluZS5tYXRjaChTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignID4gZXZhbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvIGxpbmUgKFxcZCspKD86ID4gZXZhbCBsaW5lIFxcZCspKiA+IGV2YWw6XFxkKzpcXGQrL2csICc6JDEnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCdAJykgPT09IC0xICYmIGxpbmUuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgZXZhbCBmcmFtZXMgb25seSBoYXZlIGZ1bmN0aW9uIG5hbWVzIGFuZCBub3RoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbGluZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lUmVnZXggPSAvKCguKlwiLitcIlteQF0qKT9bXkBdKikoPzpAKS87XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbGluZS5tYXRjaChmdW5jdGlvbk5hbWVSZWdleCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBtYXRjaGVzICYmIG1hdGNoZXNbMV0gPyBtYXRjaGVzWzFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKGxpbmUucmVwbGFjZShmdW5jdGlvbk5hbWVSZWdleCwgJycpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYShlKSB7XG4gICAgICAgICAgICBpZiAoIWUuc3RhY2t0cmFjZSB8fCAoZS5tZXNzYWdlLmluZGV4T2YoJ1xcbicpID4gLTEgJiZcbiAgICAgICAgICAgICAgICBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJykubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmE5KGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMChlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTExKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE5OiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhOShlKSB7XG4gICAgICAgICAgICB2YXIgbGluZVJFID0gL0xpbmUgKFxcZCspLipzY3JpcHQgKD86aW4gKT8oXFxTKykvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUubWVzc2FnZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTEwOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTAoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspKD86OiBJbiBmdW5jdGlvbiAoXFxTKykpPyQvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBtYXRjaFszXSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE9wZXJhIDEwLjY1KyBFcnJvci5zdGFjayB2ZXJ5IHNpbWlsYXIgdG8gRkYvU2FmYXJpXG4gICAgICAgIHBhcnNlT3BlcmExMTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTExKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCkgJiYgIWxpbmUubWF0Y2goL15FcnJvciBjcmVhdGVkIGF0Lyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IGxpbmUuc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uQ2FsbCA9ICh0b2tlbnMuc2hpZnQoKSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uQ2FsbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPGFub255bW91cyBmdW5jdGlvbig6IChcXHcrKSk/Pi8sICckMicpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXChbXildKlxcKS9nLCAnJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzUmF3O1xuICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkNhbGwubWF0Y2goL1xcKChbXildKilcXCkvKSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzUmF3ID0gZnVuY3Rpb25DYWxsLnJlcGxhY2UoL15bXihdK1xcKChbXildKilcXCkkLywgJyQxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gKGFyZ3NSYXcgPT09IHVuZGVmaW5lZCB8fCBhcmdzUmF3ID09PSAnW2FyZ3VtZW50cyBub3QgYXZhaWxhYmxlXScpID9cbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkIDogYXJnc1Jhdy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufSkpO1xuIiwiLyoganNoaW50IG5ld2NhcDpmYWxzZSAqL1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgbGlzdGVuZXInKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUxpc3RlbmVyKGVlLCBsaXN0ZW5lciwgYXJncykge1xuICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKGVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKGVlLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKGVlLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gc2xvd2VyXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseShlZSwgc2xpY2UuY2FsbChhcmdzLCAxKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcihldmVudEVtaXR0ZXIsIHR5cGUsIGxpc3RlbmVyLCBwcmVwZW5kKSB7XG4gICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICB2YXIgZXZlbnRzID0gZXZlbnRFbWl0dGVyLiRlIHx8IChldmVudEVtaXR0ZXIuJGUgPSB7fSk7XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgICAgICAgICAgZXZlbnRzW3R5cGVdID0gcHJlcGVuZCA/IFtsaXN0ZW5lciwgbGlzdGVuZXJzXSA6IFtsaXN0ZW5lcnMsIGxpc3RlbmVyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChwcmVwZW5kKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnVuc2hpZnQobGlzdGVuZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgIH1cbiAgICByZXR1cm4gZXZlbnRFbWl0dGVyO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gICAgdGhpcy4kZSA9IHRoaXMuJGUgfHwge307XG59XG5cbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUgPSB7XG4gICAgJGU6IG51bGwsXG5cbiAgICBlbWl0OiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLiRlO1xuICAgICAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IGV2ZW50cyAmJiBldmVudHNbdHlwZV07XG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IGFyZ3NbMV07XG4gICAgICAgICAgICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ0Vycm9yOiAnICsgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgICAgICAgICBpbnZva2VMaXN0ZW5lcih0aGlzLCBsaXN0ZW5lcnMsIGFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gc2xpY2UuY2FsbChsaXN0ZW5lcnMpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGxlbj1saXN0ZW5lcnMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIGludm9rZUxpc3RlbmVyKHRoaXMsIGxpc3RlbmVyLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBvbjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHByZXBlbmRMaXN0ZW5lcjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgb25jZTogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICAgICAgZnVuY3Rpb24gZygpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbih0eXBlLCBnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbiAgICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuJGU7XG4gICAgICAgIHZhciBsaXN0ZW5lcnM7XG5cbiAgICAgICAgaWYgKGV2ZW50cyAmJiAobGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdKSkge1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPWxpc3RlbmVycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0gPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZUFsbExpc3RlbmVyczogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy4kZTtcbiAgICAgICAgaWYgKGV2ZW50cykge1xuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsaXN0ZW5lckNvdW50OiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLiRlO1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gZXZlbnRzICYmIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVycyA/IChpc0Z1bmN0aW9uKGxpc3RlbmVycykgPyAxIDogbGlzdGVuZXJzLmxlbmd0aCkgOiAwO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsInZhciBJTkRFWF9FVkVOVCA9IDA7XG52YXIgSU5ERVhfVVNFUl9MSVNURU5FUiA9IDE7XG52YXIgSU5ERVhfV1JBUFBFRF9MSVNURU5FUiA9IDI7XG52YXIgREVTVFJPWSA9IFwiZGVzdHJveVwiO1xuXG5mdW5jdGlvbiBpc05vbkV2ZW50RW1pdHRlcih0YXJnZXQpIHtcbiAgcmV0dXJuICF0YXJnZXQub25jZTtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyV3JhcHBlcih0YXJnZXQpIHtcbiAgICB0aGlzLiRfX3RhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLiRfX2xpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuJF9fc3Vic2NyaWJlVG8gPSBudWxsO1xufVxuXG5FdmVudEVtaXR0ZXJXcmFwcGVyLnByb3RvdHlwZSA9IHtcbiAgICAkX19yZW1vdmU6IGZ1bmN0aW9uKHRlc3QsIHRlc3RXcmFwcGVkKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiRfX3RhcmdldDtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuJF9fbGlzdGVuZXJzO1xuXG4gICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcihmdW5jdGlvbihjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgdmFyIGN1ckV2ZW50ID0gY3VyTGlzdGVuZXJbSU5ERVhfRVZFTlRdO1xuICAgICAgICAgICAgdmFyIGN1ckxpc3RlbmVyRnVuYyA9IGN1ckxpc3RlbmVyW0lOREVYX1VTRVJfTElTVEVORVJdO1xuICAgICAgICAgICAgdmFyIGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMgPSBjdXJMaXN0ZW5lcltJTkRFWF9XUkFQUEVEX0xJU1RFTkVSXTtcblxuICAgICAgICAgICAgaWYgKHRlc3RXcmFwcGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgdXNlZCBgb25jZWAgdG8gYXR0YWNoIGFuIGV2ZW50IGxpc3RlbmVyIHRoZW4gd2UgaGFkIHRvXG4gICAgICAgICAgICAgICAgLy8gd3JhcCB0aGVpciBsaXN0ZW5lciBmdW5jdGlvbiB3aXRoIGEgbmV3IGZ1bmN0aW9uIHRoYXQgZG9lcyBzb21lIGV4dHJhXG4gICAgICAgICAgICAgICAgLy8gY2xlYW51cCB0byBhdm9pZCBhIG1lbW9yeSBsZWFrLiBJZiB0aGUgYHRlc3RXcmFwcGVkYCBmbGFnIGlzIHNldCB0byB0cnVlXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBhcmUgYXR0ZW1wdGluZyB0byByZW1vdmUgYmFzZWQgb24gYSBmdW5jdGlvbiB0aGF0IHdlIGhhZCB0b1xuICAgICAgICAgICAgICAgIC8vIHdyYXAgKG5vdCB0aGUgdXNlciBsaXN0ZW5lciBmdW5jdGlvbilcbiAgICAgICAgICAgICAgICBpZiAoY3VyV3JhcHBlZExpc3RlbmVyRnVuYyAmJiB0ZXN0KGN1ckV2ZW50LCBjdXJXcmFwcGVkTGlzdGVuZXJGdW5jKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIoY3VyRXZlbnQsIGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRlc3QoY3VyRXZlbnQsIGN1ckxpc3RlbmVyRnVuYykpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZnVuY3Rpb24gd2FzIHdyYXBwZWQgZHVlIHRvIGl0IGJlaW5nIGEgYG9uY2VgIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBzaG91bGQgcmVtb3ZlIGZyb20gdGhlIHRhcmdldCBFdmVudEVtaXR0ZXIgdXNpbmcgd3JhcHBlZFxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmVyIGZ1bmN0aW9uLiBPdGhlcndpc2UsIHdlIHJlbW92ZSB0aGUgbGlzdGVuZXIgdXNpbmcgdGhlIHVzZXItcHJvdmlkZWRcbiAgICAgICAgICAgICAgICAvLyBsaXN0ZW5lciBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIoY3VyRXZlbnQsIGN1cldyYXBwZWRMaXN0ZW5lckZ1bmMgfHwgY3VyTGlzdGVuZXJGdW5jKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXB0b3Jqcy9saXN0ZW5lci10cmFja2VyL2lzc3Vlcy8yXG4gICAgICAgIC8vIElmIGFsbCBvZiB0aGUgbGlzdGVuZXJzIHN0b3JlZCB3aXRoIGEgd3JhcHBlZCBFdmVudEVtaXR0ZXJcbiAgICAgICAgLy8gaGF2ZSBiZWVuIHJlbW92ZWQgdGhlbiB3ZSBzaG91bGQgdW5yZWdpc3RlciB0aGUgd3JhcHBlZFxuICAgICAgICAvLyBFdmVudEVtaXR0ZXIgaW4gdGhlIHBhcmVudCBTdWJzY3JpcHRpb25UcmFja2VyXG4gICAgICAgIHZhciBzdWJzY3JpYmVUbyA9IHRoaXMuJF9fc3Vic2NyaWJlVG87XG5cbiAgICAgICAgaWYgKCF0aGlzLiRfX2xpc3RlbmVycy5sZW5ndGggJiYgc3Vic2NyaWJlVG8pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBzdWJzY3JpYmVUb0xpc3QgPSBzdWJzY3JpYmVUby4kX19zdWJzY3JpYmVUb0xpc3Q7XG4gICAgICAgICAgICBzdWJzY3JpYmVUby4kX19zdWJzY3JpYmVUb0xpc3QgPSBzdWJzY3JpYmVUb0xpc3QuZmlsdGVyKGZ1bmN0aW9uKGN1cikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXIgIT09IHNlbGY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0Lm9uKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzLnB1c2goW2V2ZW50LCBsaXN0ZW5lcl0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgb25jZTogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBIYW5kbGluZyBhIGBvbmNlYCBldmVudCBsaXN0ZW5lciBpcyBhIGxpdHRsZSB0cmlja3kgc2luY2Ugd2UgbmVlZCB0byBhbHNvXG4gICAgICAgIC8vIGRvIG91ciBvd24gY2xlYW51cCBpZiB0aGUgYG9uY2VgIGV2ZW50IGlzIGVtaXR0ZWQuIFRoZXJlZm9yZSwgd2UgbmVlZFxuICAgICAgICAvLyB0byB3cmFwIHRoZSB1c2VyJ3MgbGlzdGVuZXIgZnVuY3Rpb24gd2l0aCBvdXIgb3duIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICAgICAgICB2YXIgd3JhcHBlZExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLiRfX3JlbW92ZShmdW5jdGlvbihldmVudCwgbGlzdGVuZXJGdW5jKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZWRMaXN0ZW5lciA9PT0gbGlzdGVuZXJGdW5jO1xuICAgICAgICAgICAgfSwgdHJ1ZSAvKiBXZSBhcmUgcmVtb3ZpbmcgdGhlIHdyYXBwZWQgbGlzdGVuZXIgKi8pO1xuXG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0Lm9uY2UoZXZlbnQsIHdyYXBwZWRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuJF9fbGlzdGVuZXJzLnB1c2goW2V2ZW50LCBsaXN0ZW5lciwgd3JhcHBlZExpc3RlbmVyXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyID0gZXZlbnQ7XG4gICAgICAgICAgICBldmVudCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdGVuZXIgJiYgZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJF9fcmVtb3ZlKGZ1bmN0aW9uKGN1ckV2ZW50LCBjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudCA9PT0gY3VyRXZlbnQgJiYgbGlzdGVuZXIgPT09IGN1ckxpc3RlbmVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuJF9fcmVtb3ZlKGZ1bmN0aW9uKGN1ckV2ZW50LCBjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lciA9PT0gY3VyTGlzdGVuZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZUFsbExpc3RlbmVyczogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy4kX19saXN0ZW5lcnM7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiRfX3RhcmdldDtcblxuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJF9fcmVtb3ZlKGZ1bmN0aW9uKGN1ckV2ZW50LCBjdXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudCA9PT0gY3VyRXZlbnQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcihjdXJbSU5ERVhfRVZFTlRdLCBjdXJbSU5ERVhfVVNFUl9MSVNURU5FUl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kX19saXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlckFkYXB0ZXIodGFyZ2V0KSB7XG4gICAgdGhpcy4kX190YXJnZXQgPSB0YXJnZXQ7XG59XG5cbkV2ZW50RW1pdHRlckFkYXB0ZXIucHJvdG90eXBlID0ge1xuICAgIG9uOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy4kX190YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgb25jZTogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBuZWVkIHRvIHNhdmUgdGhpcyBzbyB3ZSBjYW4gcmVtb3ZlIGl0IGJlbG93XG4gICAgICAgIHZhciBvbmNlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLiRfX3RhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBvbmNlTGlzdGVuZXIpO1xuICAgICAgICAgIGxpc3RlbmVyKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG9uY2VMaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuJF9fdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gU3Vic2NyaXB0aW9uVHJhY2tlcigpIHtcbiAgICB0aGlzLiRfX3N1YnNjcmliZVRvTGlzdCA9IFtdO1xufVxuXG5TdWJzY3JpcHRpb25UcmFja2VyLnByb3RvdHlwZSA9IHtcblxuICAgIHN1YnNjcmliZVRvOiBmdW5jdGlvbih0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGFkZERlc3Ryb3lMaXN0ZW5lciA9ICFvcHRpb25zIHx8IG9wdGlvbnMuYWRkRGVzdHJveUxpc3RlbmVyICE9PSBmYWxzZTtcbiAgICAgICAgdmFyIHdyYXBwZXI7XG4gICAgICAgIHZhciBub25FRTtcbiAgICAgICAgdmFyIHN1YnNjcmliZVRvTGlzdCA9IHRoaXMuJF9fc3Vic2NyaWJlVG9MaXN0O1xuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbGVuPXN1YnNjcmliZVRvTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjdXIgPSBzdWJzY3JpYmVUb0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoY3VyLiRfX3RhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgd3JhcHBlciA9IGN1cjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd3JhcHBlcikge1xuICAgICAgICAgICAgaWYgKGlzTm9uRXZlbnRFbWl0dGVyKHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgbm9uRUUgPSBuZXcgRXZlbnRFbWl0dGVyQWRhcHRlcih0YXJnZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cmFwcGVyID0gbmV3IEV2ZW50RW1pdHRlcldyYXBwZXIobm9uRUUgfHwgdGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChhZGREZXN0cm95TGlzdGVuZXIgJiYgIW5vbkVFKSB7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5vbmNlKERFU1RST1ksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVUb0xpc3RbaV0uJF9fdGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgU3Vic2NyaXB0aW9uVHJhY2tlciBzbyB0aGF0IHdlIGNhbiBkbyBjbGVhbnVwXG4gICAgICAgICAgICAvLyBpZiB0aGUgRXZlbnRFbWl0dGVyV3JhcHBlciBpbnN0YW5jZSBiZWNvbWVzIGVtcHR5IChpLmUuLCBubyBhY3RpdmUgbGlzdGVuZXJzKVxuICAgICAgICAgICAgd3JhcHBlci4kX19zdWJzY3JpYmVUbyA9IHRoaXM7XG4gICAgICAgICAgICBzdWJzY3JpYmVUb0xpc3QucHVzaCh3cmFwcGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIHN1YnNjcmliZVRvTGlzdCA9IHRoaXMuJF9fc3Vic2NyaWJlVG9MaXN0O1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJzY3JpYmVUb0xpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyID0gc3Vic2NyaWJlVG9MaXN0W2ldO1xuICAgICAgICAgICAgICAgIGlmIChjdXIuJF9fdGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyLnJlbW92ZUFsbExpc3RlbmVycyhldmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXIuJF9fbGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG8gc29tZSBjbGVhbnVwIGlmIHdlIHJlbW92ZWQgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsaXN0ZW5lcnMgZm9yIHRoZSB0YXJnZXQgZXZlbnQgZW1pdHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlVG9MaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YnNjcmliZVRvTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdFtpXS5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmliZVRvTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gU3Vic2NyaXB0aW9uVHJhY2tlcjtcblxuZXhwb3J0cy53cmFwID0gZnVuY3Rpb24odGFyZ2V0RXZlbnRFbWl0dGVyKSB7XG4gICAgdmFyIG5vbkVFO1xuICAgIHZhciB3cmFwcGVyO1xuXG4gICAgaWYgKGlzTm9uRXZlbnRFbWl0dGVyKHRhcmdldEV2ZW50RW1pdHRlcikpIHtcbiAgICAgIG5vbkVFID0gbmV3IEV2ZW50RW1pdHRlckFkYXB0ZXIodGFyZ2V0RXZlbnRFbWl0dGVyKTtcbiAgICB9XG5cbiAgICB3cmFwcGVyID0gbmV3IEV2ZW50RW1pdHRlcldyYXBwZXIobm9uRUUgfHwgdGFyZ2V0RXZlbnRFbWl0dGVyKTtcbiAgICBpZiAoIW5vbkVFKSB7XG4gICAgICAvLyB3ZSBkb24ndCBzZXQgdGhpcyBmb3Igbm9uIEVFIHR5cGVzXG4gICAgICB0YXJnZXRFdmVudEVtaXR0ZXIub25jZShERVNUUk9ZLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3cmFwcGVyLiRfX2xpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBwZXI7XG59O1xuXG5leHBvcnRzLmNyZWF0ZVRyYWNrZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvblRyYWNrZXIoKTtcbn07XG4iLCJ2YXIgQ29tcG9uZW50RGVmID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9Db21wb25lbnREZWZcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVnaW5Db21wb25lbnQoXG4gIGNvbXBvbmVudHNDb250ZXh0LFxuICBjb21wb25lbnQsXG4gIGtleSxcbiAgb3duZXJDb21wb25lbnREZWZcbikge1xuICB2YXIgY29tcG9uZW50SWQgPSBjb21wb25lbnQuaWQ7XG4gIHZhciBjb21wb25lbnREZWYgPSAoY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmID0gbmV3IENvbXBvbmVudERlZihcbiAgICBjb21wb25lbnQsXG4gICAgY29tcG9uZW50SWQsXG4gICAgY29tcG9uZW50c0NvbnRleHRcbiAgKSk7XG4gIGNvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtcbiAgICBjb21wb25lbnRJZFxuICBdID0gdHJ1ZTtcbiAgY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudERlZik7XG5cbiAgdmFyIG91dCA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX291dDtcbiAgb3V0LmJjKGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudERlZiAmJiBvd25lckNvbXBvbmVudERlZi5fX19jb21wb25lbnQpO1xuICByZXR1cm4gY29tcG9uZW50RGVmO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuZENvbXBvbmVudChvdXQpIHtcbiAgb3V0LmVlKCk7IC8vIGVuZEVsZW1lbnQoKSAoYWxzbyB3b3JrcyBmb3IgVkNvbXBvbmVudCBub2RlcyBwdXNoZWQgb24gdG8gdGhlIHN0YWNrKVxufTtcbiIsInZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG52YXIgc2V0SW1tZWRpYXRlID0gcmVxdWlyZShcIkBpbnRlcm5hbC9zZXQtaW1tZWRpYXRlXCIpLl9fX3NldEltbWVkaWF0ZTtcbnZhciB3YXJwMTBGaW5hbGl6ZSA9IHJlcXVpcmUoXCJ3YXJwMTAvZmluYWxpemVcIik7XG52YXIgZGVmaW5lQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9kZWZpbmVDb21wb25lbnRcIik7XG52YXIgZXZlbnREZWxlZ2F0aW9uID0gcmVxdWlyZShcIi4uLy4uLy4uL3J1bnRpbWUvY29tcG9uZW50cy9ldmVudC1kZWxlZ2F0aW9uXCIpO1xudmFyIGNyZWF0ZUZyYWdtZW50Tm9kZSA9XG4gIHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL3Zkb20vbW9ycGhkb20vZnJhZ21lbnRcIikuX19fY3JlYXRlRnJhZ21lbnROb2RlO1xudmFyIENvbXBvbmVudERlZiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50RGVmXCIpO1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgcmVxID0gcmVxdWlyZShcIkBpbnRlcm5hbC9yZXF1aXJlXCIpO1xudmFyIGNvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzID1cbiAgY29tcG9uZW50c1V0aWwuX19fYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cztcbnZhciBrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZCA9IGRvbURhdGEuX19fc3NyS2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWQ7XG52YXIgY29tcG9uZW50c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIHNlcnZlckNvbXBvbmVudFJvb3ROb2RlcyA9IHt9O1xudmFyIHNlcnZlclJlbmRlcmVkTWV0YSA9IHt9O1xudmFyIHdpbiA9IHdpbmRvdztcblxudmFyIERFRkFVTFRfUlVOVElNRV9JRCA9IFwiTVwiO1xudmFyIEZMQUdfV0lMTF9SRVJFTkRFUl9JTl9CUk9XU0VSID0gMTtcbi8vIHZhciBGTEFHX0hBU19SRU5ERVJfQk9EWSA9IDI7XG5cbnZhciByZWdpc3RlcmVkID0ge307XG52YXIgbG9hZGVkID0ge307XG52YXIgY29tcG9uZW50VHlwZXMgPSB7fTtcbnZhciBkZWZlcnJlZERlZnM7XG52YXIgcGVuZGluZ0RlZnM7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKHR5cGUsIGRlZikge1xuICB2YXIgcGVuZGluZ0ZvclR5cGU7XG4gIGlmIChwZW5kaW5nRGVmcykge1xuICAgIHBlbmRpbmdGb3JUeXBlID0gcGVuZGluZ0RlZnNbdHlwZV07XG4gIH1cbiAgcmVnaXN0ZXJlZFt0eXBlXSA9IGRlZjtcbiAgZGVsZXRlIGxvYWRlZFt0eXBlXTtcbiAgZGVsZXRlIGNvbXBvbmVudFR5cGVzW3R5cGVdO1xuXG4gIGlmIChwZW5kaW5nRm9yVHlwZSkge1xuICAgIGRlbGV0ZSBwZW5kaW5nRGVmc1t0eXBlXTtcbiAgICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgcGVuZGluZ0ZvclR5cGUuZm9yRWFjaChmdW5jdGlvbiAoYXJncykge1xuICAgICAgICB0cnlIeWRyYXRlQ29tcG9uZW50KGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB0eXBlO1xufVxuXG5mdW5jdGlvbiBhZGRQZW5kaW5nRGVmKGRlZiwgdHlwZSwgbWV0YSwgaG9zdCwgcnVudGltZUlkKSB7XG4gIGlmICghcGVuZGluZ0RlZnMpIHtcbiAgICBwZW5kaW5nRGVmcyA9IHt9O1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBlbmRpbmdDb21wb25lbnRJZHMgPSBPYmplY3Qua2V5cyhwZW5kaW5nRGVmcyk7XG4gICAgICAgIGlmIChwZW5kaW5nQ29tcG9uZW50SWRzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbXBsYWluKFxuICAgICAgICAgICAgXCJNYXJrbyB0ZW1wbGF0ZXMgd2VyZSBuZXZlciBsb2FkZWQgZm9yOiBcIiArIHBlbmRpbmdDb21wb25lbnRJZHNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgKHBlbmRpbmdEZWZzW3R5cGVdID0gcGVuZGluZ0RlZnNbdHlwZV0gfHwgW10pLnB1c2goW1xuICAgIGRlZixcbiAgICBtZXRhLFxuICAgIGhvc3QsXG4gICAgcnVudGltZUlkLFxuICBdKTtcbn1cblxuZnVuY3Rpb24gbG9hZCh0eXBlTmFtZSwgaXNMZWdhY3kpIHtcbiAgdmFyIHRhcmdldCA9IGxvYWRlZFt0eXBlTmFtZV07XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGFyZ2V0ID0gcmVnaXN0ZXJlZFt0eXBlTmFtZV07XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQoKTtcbiAgICB9IGVsc2UgaWYgKGlzTGVnYWN5KSB7XG4gICAgICB0YXJnZXQgPSBleHBvcnRzLl9fX2xlZ2FjeS5sb2FkKHR5cGVOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0ID0gcmVxKHR5cGVOYW1lKTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgY29tcGxhaW4oXG4gICAgICAgICAgXCJMb29rcyBsaWtlIHlvdSB1c2VkIGByZXF1aXJlOmAgaW4geW91ciBicm93c2VyLmpzb24gdG8gbG9hZCBhIGNvbXBvbmVudC4gIFRoaXMgcmVxdWlyZXMgdGhhdCBNYXJrbyBoYXMga25vd2xlZGdlIG9mIGhvdyBsYXNzbyBnZW5lcmF0ZXMgcGF0aHMgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSB2ZXJzaW9uLiAgYG1hcmtvLWRlcGVuZGVuY2llczovcGF0aC90by90ZW1wbGF0ZS5tYXJrb2Agc2hvdWxkIGJlIHVzZWQgaW5zdGVhZC5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcihcIkNvbXBvbmVudCBub3QgZm91bmQ6IFwiICsgdHlwZU5hbWUpO1xuICAgIH1cblxuICAgIGxvYWRlZFt0eXBlTmFtZV0gPSB0YXJnZXQ7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRDbGFzcyh0eXBlTmFtZSwgaXNMZWdhY3kpIHtcbiAgdmFyIENvbXBvbmVudENsYXNzID0gY29tcG9uZW50VHlwZXNbdHlwZU5hbWVdO1xuXG4gIGlmIChDb21wb25lbnRDbGFzcykge1xuICAgIHJldHVybiBDb21wb25lbnRDbGFzcztcbiAgfVxuXG4gIENvbXBvbmVudENsYXNzID0gbG9hZCh0eXBlTmFtZSwgaXNMZWdhY3kpO1xuXG4gIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQ29tcG9uZW50IHx8IENvbXBvbmVudENsYXNzO1xuXG4gIGlmICghQ29tcG9uZW50Q2xhc3MuX19faXNDb21wb25lbnQpIHtcbiAgICBDb21wb25lbnRDbGFzcyA9IGRlZmluZUNvbXBvbmVudChDb21wb25lbnRDbGFzcywgQ29tcG9uZW50Q2xhc3MucmVuZGVyZXIpO1xuICB9XG5cbiAgLy8gTWFrZSB0aGUgY29tcG9uZW50IFwidHlwZVwiIGFjY2Vzc2libGUgb24gZWFjaCBjb21wb25lbnQgaW5zdGFuY2VcbiAgQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlLl9fX3R5cGUgPSB0eXBlTmFtZTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICB2YXIgY2xhc3NOYW1lTWF0Y2ggPVxuICAgICAgL1xcLyhbXi9dKz8pKD86XFwvaW5kZXh8XFwvdGVtcGxhdGV8KSg/OlxcLm1hcmtvfFxcLmNvbXBvbmVudCg/Oi1icm93c2VyKT98KSQvLmV4ZWMoXG4gICAgICAgIHR5cGVOYW1lXG4gICAgICApO1xuICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVNYXRjaCA/IGNsYXNzTmFtZU1hdGNoWzFdIDogXCJBbm9ueW1vdXNDb21wb25lbnRcIjtcbiAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUucmVwbGFjZSgvLSguKS9nLCBmdW5jdGlvbiAoZykge1xuICAgICAgcmV0dXJuIGdbMV0udG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICBjbGFzc05hbWUgPSBjbGFzc05hbWVcbiAgICAgIC5yZXBsYWNlKC9cXCRcXGQrXFwuXFxkK1xcLlxcZCskLywgXCJcIilcbiAgICAgIC5yZXBsYWNlKC9eW15hLXokX10vaSwgXCJfJCZcIilcbiAgICAgIC5yZXBsYWNlKC9bXjAtOWEteiRfXSsvZ2ksIFwiX1wiKTtcbiAgICBjbGFzc05hbWUgPSBjbGFzc05hbWVbMF0udG9VcHBlckNhc2UoKSArIGNsYXNzTmFtZS5zbGljZSgxKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgT2xkQ29tcG9uZW50Q2xhc3MgPSBDb21wb25lbnRDbGFzcztcbiAgICBDb21wb25lbnRDbGFzcyA9IHtcbiAgICAgIFtjbGFzc05hbWVdOiBmdW5jdGlvbiAoaWQsIGRvYykge1xuICAgICAgICBPbGRDb21wb25lbnRDbGFzcy5jYWxsKHRoaXMsIGlkLCBkb2MpO1xuICAgICAgfSxcbiAgICB9W2NsYXNzTmFtZV07XG4gICAgQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlID0gT2xkQ29tcG9uZW50Q2xhc3MucHJvdG90eXBlO1xuICB9XG5cbiAgY29tcG9uZW50VHlwZXNbdHlwZU5hbWVdID0gQ29tcG9uZW50Q2xhc3M7XG5cbiAgcmV0dXJuIENvbXBvbmVudENsYXNzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQodHlwZU5hbWUsIGlkLCBpc0xlZ2FjeSkge1xuICB2YXIgQ29tcG9uZW50Q2xhc3MgPSBnZXRDb21wb25lbnRDbGFzcyh0eXBlTmFtZSwgaXNMZWdhY3kpO1xuICByZXR1cm4gbmV3IENvbXBvbmVudENsYXNzKGlkKTtcbn1cblxuZnVuY3Rpb24gaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKG5vZGUsIHJ1bnRpbWVJZCwgc3RhY2spIHtcbiAgdmFyIGNvbXBvbmVudElkO1xuICB2YXIgb3duZXJJZDtcbiAgdmFyIG93bmVyQ29tcG9uZW50O1xuICB2YXIga2V5ZWRFbGVtZW50cztcbiAgdmFyIG5leHRTaWJsaW5nO1xuICB2YXIgcnVudGltZUxlbmd0aCA9IHJ1bnRpbWVJZC5sZW5ndGg7XG4gIHN0YWNrID0gc3RhY2sgfHwgW107XG5cbiAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBuZXh0U2libGluZyA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgIC8vIENvbW1lbnQgbm9kZVxuICAgICAgdmFyIGNvbW1lbnRWYWx1ZSA9IG5vZGUubm9kZVZhbHVlO1xuICAgICAgaWYgKGNvbW1lbnRWYWx1ZS5zbGljZSgwLCBydW50aW1lTGVuZ3RoKSA9PT0gcnVudGltZUlkKSB7XG4gICAgICAgIHZhciBmaXJzdENoYXIgPSBjb21tZW50VmFsdWVbcnVudGltZUxlbmd0aF07XG5cbiAgICAgICAgaWYgKGZpcnN0Q2hhciA9PT0gXCJeXCIgfHwgZmlyc3RDaGFyID09PSBcIiNcIikge1xuICAgICAgICAgIHN0YWNrLnB1c2gobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmlyc3RDaGFyID09PSBcIi9cIikge1xuICAgICAgICAgIHZhciBlbmROb2RlID0gbm9kZTtcbiAgICAgICAgICB2YXIgc3RhcnROb2RlID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlO1xuXG4gICAgICAgICAgaWYgKHN0YXJ0Tm9kZS5wYXJlbnROb2RlID09PSBlbmROb2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHJvb3ROb2RlID0gY3JlYXRlRnJhZ21lbnROb2RlKHN0YXJ0Tm9kZS5uZXh0U2libGluZywgZW5kTm9kZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJvb3ROb2RlID0gY3JlYXRlRnJhZ21lbnROb2RlKFxuICAgICAgICAgICAgICBlbmROb2RlLnBhcmVudE5vZGUuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgZW5kTm9kZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb21wb25lbnRJZCA9IHN0YXJ0Tm9kZS5ub2RlVmFsdWUuc3Vic3RyaW5nKHJ1bnRpbWVMZW5ndGggKyAxKTtcbiAgICAgICAgICBmaXJzdENoYXIgPSBzdGFydE5vZGUubm9kZVZhbHVlW3J1bnRpbWVMZW5ndGhdO1xuXG4gICAgICAgICAgaWYgKGZpcnN0Q2hhciA9PT0gXCJeXCIpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGNvbXBvbmVudElkLnNwbGl0KC8gL2cpO1xuICAgICAgICAgICAgdmFyIGtleSA9IHBhcnRzWzJdO1xuICAgICAgICAgICAgb3duZXJJZCA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgY29tcG9uZW50SWQgPSBwYXJ0c1swXTtcbiAgICAgICAgICAgIGlmICgob3duZXJDb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbb3duZXJJZF0pKSB7XG4gICAgICAgICAgICAgIGtleWVkRWxlbWVudHMgPSBvd25lckNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAga2V5ZWRFbGVtZW50cyA9XG4gICAgICAgICAgICAgICAga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbb3duZXJJZF0gfHxcbiAgICAgICAgICAgICAgICAoa2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbb3duZXJJZF0gPSB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzKFxuICAgICAgICAgICAgICBrZXllZEVsZW1lbnRzLFxuICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgIHJvb3ROb2RlLFxuICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZXJ2ZXJDb21wb25lbnRSb290Tm9kZXNbY29tcG9uZW50SWRdID0gcm9vdE5vZGU7XG5cbiAgICAgICAgICBzdGFydE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdGFydE5vZGUpO1xuICAgICAgICAgIGVuZE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbmROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgLy8gSFRNTCBlbGVtZW50IG5vZGVcbiAgICAgIHZhciBtYXJrb0tleSA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1tYXJrby1rZXlcIik7XG4gICAgICB2YXIgbWFya29Qcm9wcyA9IGNvbXBvbmVudHNVdGlsLl9fX2dldE1hcmtvUHJvcHNGcm9tRWwobm9kZSk7XG4gICAgICBpZiAobWFya29LZXkpIHtcbiAgICAgICAgdmFyIHNlcGFyYXRvckluZGV4ID0gbWFya29LZXkuaW5kZXhPZihcIiBcIik7XG4gICAgICAgIG93bmVySWQgPSBtYXJrb0tleS5zdWJzdHJpbmcoc2VwYXJhdG9ySW5kZXggKyAxKTtcbiAgICAgICAgbWFya29LZXkgPSBtYXJrb0tleS5zdWJzdHJpbmcoMCwgc2VwYXJhdG9ySW5kZXgpO1xuICAgICAgICBpZiAoKG93bmVyQ29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW293bmVySWRdKSkge1xuICAgICAgICAgIGtleWVkRWxlbWVudHMgPSBvd25lckNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtleWVkRWxlbWVudHMgPVxuICAgICAgICAgICAga2V5ZWRFbGVtZW50c0J5Q29tcG9uZW50SWRbb3duZXJJZF0gfHxcbiAgICAgICAgICAgIChrZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZFtvd25lcklkXSA9IHt9KTtcbiAgICAgICAgfVxuICAgICAgICBrZXllZEVsZW1lbnRzW21hcmtvS2V5XSA9IG5vZGU7XG4gICAgICB9XG4gICAgICBpZiAobWFya29Qcm9wcykge1xuICAgICAgICBPYmplY3Qua2V5cyhtYXJrb1Byb3BzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5LnNsaWNlKDAsIDIpID09PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIGV2ZW50RGVsZWdhdGlvbi5fX19hZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXIoa2V5LnNsaWNlKDIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKG5vZGUsIHJ1bnRpbWVJZCwgc3RhY2spO1xuICAgIH1cblxuICAgIG5vZGUgPSBuZXh0U2libGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDb21wb25lbnRFdmVudEhhbmRsZXIoY29tcG9uZW50LCB0YXJnZXRNZXRob2ROYW1lLCBhcmdzKSB7XG4gIHZhciBtZXRob2QgPSBjb21wb25lbnRbdGFyZ2V0TWV0aG9kTmFtZV07XG4gIGlmICghbWV0aG9kKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJNZXRob2Qgbm90IGZvdW5kOiBcIiArIHRhcmdldE1ldGhvZE5hbWUpO1xuICB9XG5cbiAgbWV0aG9kLmFwcGx5KGNvbXBvbmVudCwgYXJncyk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJIZWxwZXIoZWwsIGV2ZW50VHlwZSwgaXNPbmNlLCBsaXN0ZW5lcikge1xuICB2YXIgZXZlbnRMaXN0ZW5lciA9IGxpc3RlbmVyO1xuICBpZiAoaXNPbmNlKSB7XG4gICAgZXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGlzdGVuZXIoZXZlbnQpO1xuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50TGlzdGVuZXIpO1xuICAgIH07XG4gIH1cblxuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRMaXN0ZW5lciwgZmFsc2UpO1xuXG4gIHJldHVybiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50TGlzdGVuZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRET01FdmVudExpc3RlbmVycyhcbiAgY29tcG9uZW50LFxuICBlbCxcbiAgZXZlbnRUeXBlLFxuICB0YXJnZXRNZXRob2ROYW1lLFxuICBpc09uY2UsXG4gIGV4dHJhQXJncyxcbiAgaGFuZGxlc1xuKSB7XG4gIHZhciByZW1vdmVMaXN0ZW5lciA9IGFkZEV2ZW50TGlzdGVuZXJIZWxwZXIoXG4gICAgZWwsXG4gICAgZXZlbnRUeXBlLFxuICAgIGlzT25jZSxcbiAgICBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBhcmdzID0gW2V2ZW50LCBlbF07XG4gICAgICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgICAgIGFyZ3MgPSBleHRyYUFyZ3MuY29uY2F0KGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICBpbnZva2VDb21wb25lbnRFdmVudEhhbmRsZXIoY29tcG9uZW50LCB0YXJnZXRNZXRob2ROYW1lLCBhcmdzKTtcbiAgICB9XG4gICk7XG4gIGhhbmRsZXMucHVzaChyZW1vdmVMaXN0ZW5lcik7XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wb25lbnQoY29tcG9uZW50RGVmLCBob3N0KSB7XG4gIHZhciBjb21wb25lbnQgPSBjb21wb25lbnREZWYuX19fY29tcG9uZW50O1xuXG4gIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuX19faXNDb21wb25lbnQpIHtcbiAgICByZXR1cm47IC8vIGxlZ2FjeVxuICB9XG5cbiAgY29tcG9uZW50Ll9fX3Jlc2V0KCk7XG4gIGNvbXBvbmVudC5fX19ob3N0ID0gaG9zdDtcblxuICB2YXIgaXNFeGlzdGluZyA9IGNvbXBvbmVudERlZi5fX19pc0V4aXN0aW5nO1xuXG4gIGlmIChpc0V4aXN0aW5nKSB7XG4gICAgY29tcG9uZW50Ll9fX3JlbW92ZURPTUV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICB2YXIgZG9tRXZlbnRzID0gY29tcG9uZW50RGVmLl9fX2RvbUV2ZW50cztcbiAgaWYgKGRvbUV2ZW50cykge1xuICAgIHZhciBldmVudExpc3RlbmVySGFuZGxlcyA9IFtdO1xuXG4gICAgZG9tRXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGRvbUV2ZW50QXJncykge1xuICAgICAgLy8gVGhlIGV2ZW50IG1hcHBpbmcgaXMgZm9yIGEgZGlyZWN0IERPTSBldmVudCAobm90IGEgY3VzdG9tIGV2ZW50IGFuZCBub3QgZm9yIGJ1YmJsaWduIGRvbSBldmVudHMpXG5cbiAgICAgIHZhciBldmVudFR5cGUgPSBkb21FdmVudEFyZ3NbMF07XG4gICAgICB2YXIgdGFyZ2V0TWV0aG9kTmFtZSA9IGRvbUV2ZW50QXJnc1sxXTtcbiAgICAgIHZhciBldmVudEVsID0gY29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNbZG9tRXZlbnRBcmdzWzJdXTtcbiAgICAgIHZhciBpc09uY2UgPSBkb21FdmVudEFyZ3NbM107XG4gICAgICB2YXIgZXh0cmFBcmdzID0gZG9tRXZlbnRBcmdzWzRdO1xuXG4gICAgICBhZGRET01FdmVudExpc3RlbmVycyhcbiAgICAgICAgY29tcG9uZW50LFxuICAgICAgICBldmVudEVsLFxuICAgICAgICBldmVudFR5cGUsXG4gICAgICAgIHRhcmdldE1ldGhvZE5hbWUsXG4gICAgICAgIGlzT25jZSxcbiAgICAgICAgZXh0cmFBcmdzLFxuICAgICAgICBldmVudExpc3RlbmVySGFuZGxlc1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGlmIChldmVudExpc3RlbmVySGFuZGxlcy5sZW5ndGgpIHtcbiAgICAgIGNvbXBvbmVudC5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcyA9IGV2ZW50TGlzdGVuZXJIYW5kbGVzO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjb21wb25lbnQuX19fbW91bnRlZCkge1xuICAgIGNvbXBvbmVudC5fX19lbWl0VXBkYXRlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29tcG9uZW50Ll9fX21vdW50ZWQgPSB0cnVlO1xuICAgIGNvbXBvbmVudC5fX19lbWl0TW91bnQoKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gaW5pdGlhbGl6ZWQgY29tcG9uZW50cyBhc3NvY2lhdGVkIHdpdGggVUkgY29tcG9uZW50c1xuICogcmVuZGVyZWQgaW4gdGhlIGJyb3dzZXIuIFdoaWxlIHJlbmRlcmluZyBVSSBjb21wb25lbnRzIGEgXCJjb21wb25lbnRzIGNvbnRleHRcIlxuICogaXMgYWRkZWQgdG8gdGhlIHJlbmRlcmluZyBjb250ZXh0IHRvIGtlZXAgdXAgd2l0aCB3aGljaCBjb21wb25lbnRzIGFyZSByZW5kZXJlZC5cbiAqIFdoZW4gcmVhZHksIHRoZSBjb21wb25lbnRzIGNhbiB0aGVuIGJlIGluaXRpYWxpemVkIGJ5IHdhbGtpbmcgdGhlIGNvbXBvbmVudCB0cmVlXG4gKiBpbiB0aGUgY29tcG9uZW50cyBjb250ZXh0IChuZXN0ZWQgY29tcG9uZW50cyBhcmUgaW5pdGlhbGl6ZWQgYmVmb3JlIGFuY2VzdG9yIGNvbXBvbmVudHMpLlxuICogQHBhcmFtICB7QXJyYXk8bWFya28tY29tcG9uZW50cy9saWIvQ29tcG9uZW50RGVmPn0gY29tcG9uZW50RGVmcyBBbiBhcnJheSBvZiBDb21wb25lbnREZWYgaW5zdGFuY2VzXG4gKi9cbmZ1bmN0aW9uIGluaXRDbGllbnRSZW5kZXJlZChjb21wb25lbnREZWZzLCBob3N0KSB7XG4gIGlmICghaG9zdCkgaG9zdCA9IGRvY3VtZW50O1xuICAvLyBFbnN1cmUgdGhhdCBldmVudCBoYW5kbGVycyB0byBoYW5kbGUgZGVsZWdhdGluZyBldmVudHMgYXJlXG4gIC8vIGFsd2F5cyBhdHRhY2hlZCBiZWZvcmUgaW5pdGlhbGl6aW5nIGFueSBjb21wb25lbnRzXG4gIGV2ZW50RGVsZWdhdGlvbi5fX19pbml0KGhvc3QpO1xuICB2YXIgbGVuID0gY29tcG9uZW50RGVmcy5sZW5ndGg7XG4gIHZhciBjb21wb25lbnREZWY7XG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IGxlbjsgaS0tOyApIHtcbiAgICBjb21wb25lbnREZWYgPSBjb21wb25lbnREZWZzW2ldO1xuICAgIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZik7XG4gIH1cblxuICBmb3IgKGkgPSBsZW47IGktLTsgKSB7XG4gICAgY29tcG9uZW50RGVmID0gY29tcG9uZW50RGVmc1tpXTtcbiAgICBpbml0Q29tcG9uZW50KGNvbXBvbmVudERlZiwgaG9zdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpbml0aWFsaXplcyBhbGwgY29tcG9uZW50cyB0aGF0IHdlcmUgcmVuZGVyZWQgb24gdGhlIHNlcnZlciBieSBpdGVyYXRpbmcgb3ZlciBhbGxcbiAqIG9mIHRoZSBjb21wb25lbnQgSURzLlxuICovXG5mdW5jdGlvbiBpbml0U2VydmVyUmVuZGVyZWQocmVuZGVyZWRDb21wb25lbnRzLCBob3N0KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHJlbmRlcmVkQ29tcG9uZW50cztcbiAgdmFyIGdsb2JhbEtleSA9IFwiJFwiO1xuICB2YXIgcnVudGltZUlkO1xuXG4gIGlmICh0eXBlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJ1bnRpbWVJZCA9IHJlbmRlcmVkQ29tcG9uZW50cztcbiAgICAgIGdsb2JhbEtleSArPSBydW50aW1lSWQgKyBcIl9DXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbEtleSArPSAocnVudGltZUlkID0gREVGQVVMVF9SVU5USU1FX0lEKSArIFwiQ1wiO1xuICAgIH1cblxuICAgIHJlbmRlcmVkQ29tcG9uZW50cyA9IHdpbltnbG9iYWxLZXldO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgIGlmIChcbiAgICAgICAgcmVuZGVyZWRDb21wb25lbnRzICYmXG4gICAgICAgIHJlbmRlcmVkQ29tcG9uZW50cy5pICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgcmVuZGVyZWRDb21wb25lbnRzLmkgIT09IGNvbXBvbmVudHNVdGlsLl9fX3J1bnRpbWVJZFxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBcIk11bHRpcGxlIGluc3RhbmNlcyBvZiBNYXJrbyBoYXZlIGF0dGFjaGVkIHRvIHRoZSBzYW1lIHJ1bnRpbWUgaWQuIFRoaXMgY291bGQgbWVhbiB0aGF0IG1vcmUgdGhhbiBvbmUgY29weSBvZiBNYXJrbyBpcyBsb2FkZWQgb24gdGhlIHBhZ2UsIG9yIHRoYXQgdGhlIHNjcmlwdCBjb250YWluaW5nIE1hcmtvIGhhcyBleGVjdXRlZCBtb3JlIHRoYW4gb25jZS5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBmYWtlQXJyYXkgPSAod2luW2dsb2JhbEtleV0gPSB7XG4gICAgICByOiBydW50aW1lSWQsXG4gICAgICBjb25jYXQ6IGluaXRTZXJ2ZXJSZW5kZXJlZCxcbiAgICB9KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBmYWtlQXJyYXkuaSA9IGNvbXBvbmVudHNVdGlsLl9fX3J1bnRpbWVJZDtcbiAgICB9XG5cbiAgICBpZiAocmVuZGVyZWRDb21wb25lbnRzICYmIHJlbmRlcmVkQ29tcG9uZW50cy5mb3JFYWNoKSB7XG4gICAgICByZW5kZXJlZENvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbiAocmVuZGVyZWRDb21wb25lbnQpIHtcbiAgICAgICAgZmFrZUFycmF5LmNvbmNhdChyZW5kZXJlZENvbXBvbmVudCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFrZUFycmF5O1xuICB9XG5cbiAgdmFyIGlzRnJvbVNlcmlhbGl6ZWRHbG9iYWxzID0gdGhpcy5jb25jYXQgPT09IGluaXRTZXJ2ZXJSZW5kZXJlZDtcbiAgcmVuZGVyZWRDb21wb25lbnRzID0gd2FycDEwRmluYWxpemUocmVuZGVyZWRDb21wb25lbnRzKTtcblxuICBpZiAoaXNGcm9tU2VyaWFsaXplZEdsb2JhbHMpIHtcbiAgICBydW50aW1lSWQgPSB0aGlzLnI7XG4gICAgaG9zdCA9IGRvY3VtZW50O1xuICB9IGVsc2Uge1xuICAgIHJ1bnRpbWVJZCA9IHJlbmRlcmVkQ29tcG9uZW50cy5yIHx8IERFRkFVTFRfUlVOVElNRV9JRDtcbiAgICBpZiAoIWhvc3QpIGhvc3QgPSBkb2N1bWVudDtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgXCJQYXNzaW5nIHNlcmlhbGl6ZWQgZGF0YSB0byBgcmVxdWlyZSgnbWFya28vY29tcG9uZW50cykuaW5pdGAgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCBzZXQgJyRnbG9iYWwucnVudGltZUlkJyBhbmQgcHJvdmlkZSB0aGUgJ3J1bnRpbWVJZCcgb3B0aW9uIHRvIHlvdXIgTWFya28gYnVuZGxlciBwbHVnaW4uXCJcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgaWYgKGhvc3QgIT09IGRvY3VtZW50KSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgXCJQYXNzaW5nIGEgZG9jdW1lbnQgb3RoZXIgdGhhbiB0aGUgY3VycmVudCBkb2N1bWVudCB0byBgcmVxdWlyZSgnbWFya28vY29tcG9uZW50cykuaW5pdGAgaXMgZGVwcmVjYXRlZC5cIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcHJlZml4ID0gcmVuZGVyZWRDb21wb25lbnRzLnAgfHwgXCJcIjtcbiAgdmFyIG1ldGEgPSBzZXJ2ZXJSZW5kZXJlZE1ldGFbcHJlZml4XTtcbiAgdmFyIGlzTGFzdCA9IHJlbmRlcmVkQ29tcG9uZW50cy5sO1xuXG4gIGlmIChtZXRhKSB7XG4gICAgaWYgKGlzTGFzdCkge1xuICAgICAgZGVsZXRlIHNlcnZlclJlbmRlcmVkTWV0YVtwcmVmaXhdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtZXRhID0ge307XG5cbiAgICBpZiAoIWlzTGFzdCkge1xuICAgICAgc2VydmVyUmVuZGVyZWRNZXRhW3ByZWZpeF0gPSBtZXRhO1xuICAgIH1cbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGF0IGV2ZW50IGhhbmRsZXJzIHRvIGhhbmRsZSBkZWxlZ2F0aW5nIGV2ZW50cyBhcmVcbiAgLy8gYWx3YXlzIGF0dGFjaGVkIGJlZm9yZSBpbml0aWFsaXppbmcgYW55IGNvbXBvbmVudHNcbiAgaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKGhvc3QsIHJ1bnRpbWVJZCk7XG4gIGV2ZW50RGVsZWdhdGlvbi5fX19pbml0KGhvc3QpO1xuXG4gIGlmIChyZW5kZXJlZENvbXBvbmVudHMuZykge1xuICAgIG1ldGEuX19fZ2xvYmFscyA9IHJlbmRlcmVkQ29tcG9uZW50cy5nO1xuICB9XG5cbiAgaWYgKHJlbmRlcmVkQ29tcG9uZW50cy50KSB7XG4gICAgbWV0YS5fX190eXBlcyA9IG1ldGEuX19fdHlwZXNcbiAgICAgID8gbWV0YS5fX190eXBlcy5jb25jYXQocmVuZGVyZWRDb21wb25lbnRzLnQpXG4gICAgICA6IHJlbmRlcmVkQ29tcG9uZW50cy50O1xuICB9XG5cbiAgLy8gaHlkcmF0ZSBjb21wb25lbnRzIHRvcCBkb3duIChsZWFmIG5vZGVzIGxhc3QpXG4gIC8vIGFuZCByZXR1cm4gYW4gYXJyYXkgb2YgZnVuY3Rpb25zIHRvIG1vdW50IHRoZXNlIGNvbXBvbmVudHNcbiAgKHJlbmRlcmVkQ29tcG9uZW50cy53IHx8IFtdKVxuICAgIC5tYXAoZnVuY3Rpb24gKGNvbXBvbmVudERlZikge1xuICAgICAgdmFyIHR5cGVOYW1lID0gbWV0YS5fX190eXBlc1tjb21wb25lbnREZWZbMV1dO1xuXG4gICAgICByZXR1cm4gcmVnaXN0ZXJlZFt0eXBlTmFtZV0gfHxcbiAgICAgICAgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8XG4gICAgICAgIHJlcS5lKHR5cGVOYW1lKVxuICAgICAgICA/IHRyeUh5ZHJhdGVDb21wb25lbnQoY29tcG9uZW50RGVmLCBtZXRhLCBob3N0LCBydW50aW1lSWQpXG4gICAgICAgIDogYWRkUGVuZGluZ0RlZihjb21wb25lbnREZWYsIHR5cGVOYW1lLCBtZXRhLCBob3N0LCBydW50aW1lSWQpO1xuICAgIH0pXG4gICAgLnJldmVyc2UoKVxuICAgIC5mb3JFYWNoKHRyeUludm9rZSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIHRyeUh5ZHJhdGVDb21wb25lbnQocmF3RGVmLCBtZXRhLCBob3N0LCBydW50aW1lSWQpIHtcbiAgdmFyIGNvbXBvbmVudERlZiA9IENvbXBvbmVudERlZi5fX19kZXNlcmlhbGl6ZShcbiAgICByYXdEZWYsXG4gICAgbWV0YS5fX190eXBlcyxcbiAgICBtZXRhLl9fX2dsb2JhbHMsXG4gICAgZXhwb3J0c1xuICApO1xuICB2YXIgbW91bnQgPSBoeWRyYXRlQ29tcG9uZW50QW5kR2V0TW91bnQoY29tcG9uZW50RGVmLCBob3N0KTtcblxuICBpZiAoIW1vdW50KSB7XG4gICAgLy8gaHlkcmF0ZUNvbXBvbmVudEFuZEdldE1vdW50IHdpbGwgcmV0dXJuIGZhbHNlIGlmIHRoZXJlIGlzIG5vdCByb290Tm9kZVxuICAgIC8vIGZvciB0aGUgY29tcG9uZW50LiAgSWYgdGhpcyBpcyB0aGUgY2FzZSwgd2UnbGwgd2FpdCB1bnRpbCB0aGVcbiAgICAvLyBET00gaGFzIGZ1bGx5IGxvYWRlZCB0byBhdHRlbXB0IHRvIGluaXQgdGhlIGNvbXBvbmVudCBhZ2Fpbi5cbiAgICBpZiAoZGVmZXJyZWREZWZzKSB7XG4gICAgICBkZWZlcnJlZERlZnMucHVzaChjb21wb25lbnREZWYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZERlZnMgPSBbY29tcG9uZW50RGVmXTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5kZXhTZXJ2ZXJDb21wb25lbnRCb3VuZGFyaWVzKGhvc3QsIHJ1bnRpbWVJZCk7XG4gICAgICAgIGRlZmVycmVkRGVmc1xuICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGNvbXBvbmVudERlZikge1xuICAgICAgICAgICAgcmV0dXJuIGh5ZHJhdGVDb21wb25lbnRBbmRHZXRNb3VudChjb21wb25lbnREZWYsIGhvc3QpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgIC5mb3JFYWNoKHRyeUludm9rZSk7XG4gICAgICAgIGRlZmVycmVkRGVmcy5sZW5ndGggPSAwO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1vdW50O1xufVxuXG5mdW5jdGlvbiBoeWRyYXRlQ29tcG9uZW50QW5kR2V0TW91bnQoY29tcG9uZW50RGVmLCBob3N0KSB7XG4gIHZhciBjb21wb25lbnRJZCA9IGNvbXBvbmVudERlZi5pZDtcbiAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudERlZi5fX19jb21wb25lbnQ7XG4gIHZhciByb290Tm9kZSA9IHNlcnZlckNvbXBvbmVudFJvb3ROb2Rlc1tjb21wb25lbnRJZF07XG4gIHZhciByZW5kZXJSZXN1bHQ7XG5cbiAgaWYgKHJvb3ROb2RlKSB7XG4gICAgZGVsZXRlIHNlcnZlckNvbXBvbmVudFJvb3ROb2Rlc1tjb21wb25lbnRJZF07XG5cbiAgICBjb21wb25lbnQuX19fcm9vdE5vZGUgPSByb290Tm9kZTtcbiAgICBjb21wb25lbnRzQnlET01Ob2RlLnNldChyb290Tm9kZSwgY29tcG9uZW50KTtcblxuICAgIGlmIChjb21wb25lbnREZWYuX19fZmxhZ3MgJiBGTEFHX1dJTExfUkVSRU5ERVJfSU5fQlJPV1NFUikge1xuICAgICAgY29tcG9uZW50Ll9fX2hvc3QgPSBob3N0O1xuICAgICAgcmVuZGVyUmVzdWx0ID0gY29tcG9uZW50Ll9fX3JlcmVuZGVyKGNvbXBvbmVudC5fX19pbnB1dCwgdHJ1ZSk7XG4gICAgICB0cmFja0NvbXBvbmVudChjb21wb25lbnREZWYpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgICAgICByZW5kZXJSZXN1bHQuYWZ0ZXJJbnNlcnQoaG9zdCk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFja0NvbXBvbmVudChjb21wb25lbnREZWYpO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICAgIGluaXRDb21wb25lbnQoY29tcG9uZW50RGVmLCBob3N0KTtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYWNrQ29tcG9uZW50KGNvbXBvbmVudERlZikge1xuICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudDtcbiAgaWYgKGNvbXBvbmVudCkge1xuICAgIGNvbXBvbmVudExvb2t1cFtjb21wb25lbnQuaWRdID0gY29tcG9uZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeUludm9rZShmbikge1xuICBpZiAoZm4pIGZuKCk7XG59XG5cbmV4cG9ydHMuciA9IHJlZ2lzdGVyO1xuZXhwb3J0cy5fX19jcmVhdGVDb21wb25lbnQgPSBjcmVhdGVDb21wb25lbnQ7XG5leHBvcnRzLl9fX2dldENvbXBvbmVudENsYXNzID0gZ2V0Q29tcG9uZW50Q2xhc3M7XG5leHBvcnRzLl9fX2luaXRTZXJ2ZXJSZW5kZXJlZCA9IHdpbi4kaW5pdENvbXBvbmVudHMgPSBpbml0U2VydmVyUmVuZGVyZWQ7XG5cbnJlcXVpcmUoXCIuLi8uLi8uLi9ydW50aW1lL2NvbXBvbmVudHMvQ29tcG9uZW50c0NvbnRleHRcIikuX19faW5pdENsaWVudFJlbmRlcmVkID1cbiAgaW5pdENsaWVudFJlbmRlcmVkO1xuIiwidmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcnVudGltZS9jb21wb25lbnRzL2RvbS1kYXRhXCIpO1xudmFyIGNvbXBvbmVudHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX2NvbXBvbmVudEJ5RE9NTm9kZTtcbnZhciBrZXlzQnlET01Ob2RlID0gZG9tRGF0YS5fX19rZXlCeURPTU5vZGU7XG52YXIgdkVsZW1lbnRzQnlET01Ob2RlID0gZG9tRGF0YS5fX192RWxlbWVudEJ5RE9NTm9kZTtcbnZhciB2UHJvcHNCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZQcm9wc0J5RE9NTm9kZTtcbnZhciBtYXJrb1VJRCA9IHdpbmRvdy4kTVVJRCB8fCAod2luZG93LiRNVUlEID0geyBpOiAwIH0pO1xudmFyIHJ1bnRpbWVJZCA9IG1hcmtvVUlELmkrKztcblxudmFyIGNvbXBvbmVudExvb2t1cCA9IHt9O1xuXG52YXIgRU1QVFlfT0JKRUNUID0ge307XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudEZvckVsKGVsLCBob3N0KSB7XG4gIHZhciBub2RlID1cbiAgICB0eXBlb2YgZWwgPT0gXCJzdHJpbmdcIlxuICAgICAgPyAoKGhvc3QgPyBob3N0Lm93bmVyRG9jdW1lbnQgOiBob3N0KSB8fCBkb2N1bWVudCkuZ2V0RWxlbWVudEJ5SWQoZWwpXG4gICAgICA6IGVsO1xuICB2YXIgY29tcG9uZW50O1xuICB2YXIgdkVsZW1lbnQ7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZS5mcmFnbWVudCkge1xuICAgICAgaWYgKG5vZGUuZnJhZ21lbnQuZW5kTm9kZSA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gbm9kZS5mcmFnbWVudC5zdGFydE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gbm9kZS5mcmFnbWVudDtcbiAgICAgICAgY29tcG9uZW50ID0gY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgodkVsZW1lbnQgPSB2RWxlbWVudHNCeURPTU5vZGUuZ2V0KG5vZGUpKSkge1xuICAgICAgY29tcG9uZW50ID0gdkVsZW1lbnQuX19fb3duZXJDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmcgfHwgbm9kZS5wYXJlbnROb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lDb21wb25lbnRGb3JOb2RlKG5vZGUpIHtcbiAgdmFyIGNvbXBvbmVudFRvRGVzdHJveSA9IGNvbXBvbmVudHNCeURPTU5vZGUuZ2V0KG5vZGUuZnJhZ21lbnQgfHwgbm9kZSk7XG4gIGlmIChjb21wb25lbnRUb0Rlc3Ryb3kpIHtcbiAgICBjb21wb25lbnRUb0Rlc3Ryb3kuX19fZGVzdHJveVNoYWxsb3coKTtcbiAgICBkZWxldGUgY29tcG9uZW50TG9va3VwW2NvbXBvbmVudFRvRGVzdHJveS5pZF07XG4gIH1cbn1cbmZ1bmN0aW9uIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKG5vZGUsIGNvbXBvbmVudCkge1xuICBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZShub2RlKTtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gMTIpIHtcbiAgICB2YXIga2V5O1xuXG4gICAgaWYgKGNvbXBvbmVudCAmJiAoa2V5ID0ga2V5c0J5RE9NTm9kZS5nZXQobm9kZSkpKSB7XG4gICAgICBpZiAobm9kZSA9PT0gY29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHNba2V5XSkge1xuICAgICAgICBpZiAoY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZSkgJiYgL1xcW1xcXSQvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgIGRlbGV0ZSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1trZXldW1xuICAgICAgICAgICAgY29tcG9uZW50c0J5RE9NTm9kZS5nZXQobm9kZSkuaWRcbiAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBjb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjdXJDaGlsZCAmJiBjdXJDaGlsZCAhPT0gbm9kZS5lbmROb2RlKSB7XG4gICAgICBkZXN0cm95Tm9kZVJlY3Vyc2l2ZShjdXJDaGlsZCwgY29tcG9uZW50KTtcbiAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5leHRDb21wb25lbnRJZCgpIHtcbiAgLy8gRWFjaCBjb21wb25lbnQgd2lsbCBnZXQgYW4gSUQgdGhhdCBpcyB1bmlxdWUgYWNyb3NzIGFsbCBsb2FkZWRcbiAgLy8gbWFya28gcnVudGltZXMuIFRoaXMgYWxsb3dzIG11bHRpcGxlIGluc3RhbmNlcyBvZiBtYXJrbyB0byBiZVxuICAvLyBsb2FkZWQgaW4gdGhlIHNhbWUgd2luZG93IGFuZCB0aGV5IHNob3VsZCBhbGwgcGxhY2UgbmljZVxuICAvLyB0b2dldGhlclxuICByZXR1cm4gXCJjXCIgKyBtYXJrb1VJRC5pKys7XG59XG5cbmZ1bmN0aW9uIG5leHRDb21wb25lbnRJZFByb3ZpZGVyKCkge1xuICByZXR1cm4gbmV4dENvbXBvbmVudElkO1xufVxuXG5mdW5jdGlvbiBhdHRhY2hCdWJibGluZ0V2ZW50KFxuICBjb21wb25lbnREZWYsXG4gIGhhbmRsZXJNZXRob2ROYW1lLFxuICBpc09uY2UsXG4gIGV4dHJhQXJnc1xuKSB7XG4gIGlmIChoYW5kbGVyTWV0aG9kTmFtZSkge1xuICAgIHZhciBjb21wb25lbnRJZCA9IGNvbXBvbmVudERlZi5pZDtcbiAgICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgICByZXR1cm4gW2hhbmRsZXJNZXRob2ROYW1lLCBjb21wb25lbnRJZCwgaXNPbmNlLCBleHRyYUFyZ3NdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW2hhbmRsZXJNZXRob2ROYW1lLCBjb21wb25lbnRJZCwgaXNPbmNlXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWFya29Qcm9wc0Zyb21FbChlbCkge1xuICB2YXIgdkVsZW1lbnQgPSB2RWxlbWVudHNCeURPTU5vZGUuZ2V0KGVsKTtcbiAgdmFyIHZpcnR1YWxQcm9wcztcblxuICBpZiAodkVsZW1lbnQpIHtcbiAgICB2aXJ0dWFsUHJvcHMgPSB2RWxlbWVudC5fX19wcm9wZXJ0aWVzO1xuICB9IGVsc2Uge1xuICAgIHZpcnR1YWxQcm9wcyA9IHZQcm9wc0J5RE9NTm9kZS5nZXQoZWwpO1xuICAgIGlmICghdmlydHVhbFByb3BzKSB7XG4gICAgICB2aXJ0dWFsUHJvcHMgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1hcmtvXCIpO1xuICAgICAgdlByb3BzQnlET01Ob2RlLnNldChcbiAgICAgICAgZWwsXG4gICAgICAgICh2aXJ0dWFsUHJvcHMgPSB2aXJ0dWFsUHJvcHMgPyBKU09OLnBhcnNlKHZpcnR1YWxQcm9wcykgOiBFTVBUWV9PQkpFQ1QpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2aXJ0dWFsUHJvcHM7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNvbXBvbmVudEtleShrZXksIHBhcmVudElkKSB7XG4gIGlmIChrZXlbMF0gPT09IFwiI1wiKSB7XG4gICAga2V5ID0ga2V5LnJlcGxhY2UoXCIjXCIgKyBwYXJlbnRJZCArIFwiLVwiLCBcIlwiKTtcbiAgfVxuICByZXR1cm4ga2V5O1xufVxuXG5mdW5jdGlvbiBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzKFxuICBrZXllZEVsZW1lbnRzLFxuICBrZXksXG4gIHJvb3ROb2RlLFxuICBjb21wb25lbnRJZFxuKSB7XG4gIGlmICgvXFxbXFxdJC8udGVzdChrZXkpKSB7XG4gICAgdmFyIHJlcGVhdGVkRWxlbWVudHNGb3JLZXkgPSAoa2V5ZWRFbGVtZW50c1trZXldID1cbiAgICAgIGtleWVkRWxlbWVudHNba2V5XSB8fCB7fSk7XG4gICAgcmVwZWF0ZWRFbGVtZW50c0ZvcktleVtjb21wb25lbnRJZF0gPSByb290Tm9kZTtcbiAgfSBlbHNlIHtcbiAgICBrZXllZEVsZW1lbnRzW2tleV0gPSByb290Tm9kZTtcbiAgfVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG5pZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gIHZhciB3YXJuTm9kZVJlbW92ZWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBldmVudC50YXJnZXQuZnJhZ21lbnQ7XG4gICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICB2YXIgYmFzZUVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICBcIkZyYWdtZW50IGJvdW5kYXJ5IG1hcmtlciByZW1vdmVkLiAgVGhpcyB3aWxsIGNhdXNlIGFuIGVycm9yIHdoZW4gdGhlIGZyYWdtZW50IGlzIHVwZGF0ZWQuXCJcbiAgICAgICk7XG4gICAgICBmcmFnbWVudC5fX19tYXJrZXJzUmVtb3ZlZEVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UgKyBcIiBCb3VuZGFyeSBtYXJrZXJzIG1pc3NpbmcuXCIpO1xuXG4gICAgICAgIGJhc2VFcnJvci5zdGFjayA9IGJhc2VFcnJvci5zdGFjay5yZXBsYWNlKC8uKndhcm5Ob2RlUmVtb3ZlZC4qXFxuLywgXCJcIik7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS53YXJuKGJhc2VFcnJvcik7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICBleHBvcnRzLl9fX3N0YXJ0RE9NTWFuaXB1bGF0aW9uV2FybmluZyA9IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgaG9zdC5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIiwgd2Fybk5vZGVSZW1vdmVkKTtcbiAgfTtcbiAgZXhwb3J0cy5fX19zdG9wRE9NTWFuaXB1bGF0aW9uV2FybmluZyA9IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgaG9zdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIiwgd2Fybk5vZGVSZW1vdmVkKTtcbiAgfTtcbn1cblxuZXhwb3J0cy5fX19ydW50aW1lSWQgPSBydW50aW1lSWQ7XG5leHBvcnRzLl9fX2NvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudExvb2t1cDtcbmV4cG9ydHMuX19fZ2V0Q29tcG9uZW50Rm9yRWwgPSBnZXRDb21wb25lbnRGb3JFbDtcbmV4cG9ydHMuX19fZGVzdHJveUNvbXBvbmVudEZvck5vZGUgPSBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZTtcbmV4cG9ydHMuX19fZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBkZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbmV4cG9ydHMuX19fbmV4dENvbXBvbmVudElkUHJvdmlkZXIgPSBuZXh0Q29tcG9uZW50SWRQcm92aWRlcjtcbmV4cG9ydHMuX19fYXR0YWNoQnViYmxpbmdFdmVudCA9IGF0dGFjaEJ1YmJsaW5nRXZlbnQ7XG5leHBvcnRzLl9fX2dldE1hcmtvUHJvcHNGcm9tRWwgPSBnZXRNYXJrb1Byb3BzRnJvbUVsO1xuZXhwb3J0cy5fX19hZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzID0gYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cztcbmV4cG9ydHMuX19fbm9ybWFsaXplQ29tcG9uZW50S2V5ID0gbm9ybWFsaXplQ29tcG9uZW50S2V5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5sb2FkLmUgPSBleGlzdHM7XG5tb2R1bGUuZXhwb3J0cyA9IGxvYWQ7XG5cbmZ1bmN0aW9uIGxvYWQoaWQpIHtcbiAgcmV0dXJuIGludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oaWQpKTtcbn1cblxuZnVuY3Rpb24gZXhpc3RzKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGludGVyb3BSZXF1aXJlKG1vZCkge1xuICByZXR1cm4gbW9kLmRlZmF1bHQgfHwgbW9kO1xufVxuIiwidmFyIHF1ZXVlID0gW107XG52YXIgbXNnID0gXCJcIiArIE1hdGgucmFuZG9tKCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2KSB7XG4gIGlmIChldi5kYXRhID09PSBtc2cpIHtcbiAgICB2YXIgY2FsbGJhY2tzID0gcXVldWU7XG4gICAgcXVldWUgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FsbGJhY2tzW2ldKCk7XG4gICAgfVxuICB9XG59KTtcblxuZXhwb3J0cy5fX19zZXRJbW1lZGlhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYgKHF1ZXVlLnB1c2goY2FsbGJhY2spID09PSAxKSB7XG4gICAgd2luZG93LnBvc3RNZXNzYWdlKG1zZywgXCIqXCIpO1xuICB9XG59O1xuXG5leHBvcnRzLl9fX3F1ZXVlTWljcm90YXNrID0gcmVxdWlyZShcIi4vcXVldWVNaWNyb3Rhc2tcIik7XG4iLCJ2YXIgcHJvbWlzZTtcbm1vZHVsZS5leHBvcnRzID1cbiAgdHlwZW9mIHF1ZXVlTWljcm90YXNrID09PSBcImZ1bmN0aW9uXCJcbiAgICA/IHF1ZXVlTWljcm90YXNrXG4gICAgOiAoKHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKSksXG4gICAgICBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKGNiKTtcbiAgICAgIH0pO1xuIiwidmFyIGRvbUluc2VydCA9IHJlcXVpcmUoXCIuL2RvbS1pbnNlcnRcIik7XG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xuXG5mdW5jdGlvbiBnZXRSb290Tm9kZShlbCkge1xuICB2YXIgY3VyID0gZWw7XG4gIHdoaWxlIChjdXIucGFyZW50Tm9kZSkgY3VyID0gY3VyLnBhcmVudE5vZGU7XG4gIHJldHVybiBjdXI7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudERlZnMocmVzdWx0KSB7XG4gIHZhciBjb21wb25lbnREZWZzID0gcmVzdWx0Ll9fX2NvbXBvbmVudHM7XG5cbiAgaWYgKCFjb21wb25lbnREZWZzKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJObyBjb21wb25lbnRcIik7XG4gIH1cbiAgcmV0dXJuIGNvbXBvbmVudERlZnM7XG59XG5cbmZ1bmN0aW9uIFJlbmRlclJlc3VsdChvdXQpIHtcbiAgdGhpcy5vdXQgPSB0aGlzLl9fX291dCA9IG91dDtcbiAgdGhpcy5fX19jb21wb25lbnRzID0gdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlclJlc3VsdDtcblxudmFyIHByb3RvID0gKFJlbmRlclJlc3VsdC5wcm90b3R5cGUgPSB7XG4gIGdldENvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldENvbXBvbmVudHMoKVswXTtcbiAgfSxcbiAgZ2V0Q29tcG9uZW50czogZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgaWYgKHRoaXMuX19fY29tcG9uZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIk5vdCBhZGRlZCB0byBET01cIik7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBvbmVudERlZnMgPSBnZXRDb21wb25lbnREZWZzKHRoaXMpO1xuXG4gICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcblxuICAgIGNvbXBvbmVudERlZnMuZm9yRWFjaChmdW5jdGlvbiAoY29tcG9uZW50RGVmKSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50RGVmLl9fX2NvbXBvbmVudDtcbiAgICAgIGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3IoY29tcG9uZW50KSkge1xuICAgICAgICBjb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBjb21wb25lbnRzO1xuICB9LFxuXG4gIGFmdGVySW5zZXJ0OiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHZhciBvdXQgPSB0aGlzLl9fX291dDtcbiAgICB2YXIgY29tcG9uZW50c0NvbnRleHQgPSBvdXQuX19fY29tcG9uZW50cztcbiAgICBpZiAoY29tcG9uZW50c0NvbnRleHQpIHtcbiAgICAgIHRoaXMuX19fY29tcG9uZW50cyA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2luaXRDb21wb25lbnRzKGhvc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fX2NvbXBvbmVudHMgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBnZXROb2RlOiBmdW5jdGlvbiAoaG9zdCkge1xuICAgIHJldHVybiB0aGlzLl9fX291dC5fX19nZXROb2RlKGhvc3QpO1xuICB9LFxuICBnZXRPdXRwdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19vdXQuX19fZ2V0T3V0cHV0KCk7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fb3V0LnRvU3RyaW5nKCk7XG4gIH0sXG4gIGRvY3VtZW50OiB0eXBlb2YgZG9jdW1lbnQgPT09IFwib2JqZWN0XCIgJiYgZG9jdW1lbnQsXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBcImh0bWxcIiwge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgY29tcGxhaW4oXG4gICAgICAgICdUaGUgXCJodG1sXCIgcHJvcGVydHkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBcInRvU3RyaW5nXCIgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgfSxcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIFwiY29udGV4dFwiLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgJ1RoZSBcImNvbnRleHRcIiBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIFwib3V0XCIgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX19fb3V0O1xuICB9LFxufSk7XG5cbi8vIEFkZCBhbGwgb2YgdGhlIGZvbGxvd2luZyBET00gbWV0aG9kcyB0byBDb21wb25lbnQucHJvdG90eXBlOlxuLy8gLSBhcHBlbmRUbyhyZWZlcmVuY2VFbClcbi8vIC0gcmVwbGFjZShyZWZlcmVuY2VFbClcbi8vIC0gcmVwbGFjZUNoaWxkcmVuT2YocmVmZXJlbmNlRWwpXG4vLyAtIGluc2VydEJlZm9yZShyZWZlcmVuY2VFbClcbi8vIC0gaW5zZXJ0QWZ0ZXIocmVmZXJlbmNlRWwpXG4vLyAtIHByZXBlbmRUbyhyZWZlcmVuY2VFbClcbmRvbUluc2VydChcbiAgcHJvdG8sXG4gIGZ1bmN0aW9uIGdldEVsKHJlbmRlclJlc3VsdCwgcmVmZXJlbmNlRWwpIHtcbiAgICByZXR1cm4gcmVuZGVyUmVzdWx0LmdldE5vZGUoZ2V0Um9vdE5vZGUocmVmZXJlbmNlRWwpKTtcbiAgfSxcbiAgZnVuY3Rpb24gYWZ0ZXJJbnNlcnQocmVuZGVyUmVzdWx0LCByZWZlcmVuY2VFbCkge1xuICAgIHJldHVybiByZW5kZXJSZXN1bHQuYWZ0ZXJJbnNlcnQoZ2V0Um9vdE5vZGUocmVmZXJlbmNlRWwpKTtcbiAgfSxcbik7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cblxudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzLWxpZ2h0XCIpO1xudmFyIFN1YnNjcmlwdGlvblRyYWNrZXIgPSByZXF1aXJlKFwibGlzdGVuZXItdHJhY2tlclwiKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBjb21wb25lbnRMb29rdXAgPSBjb21wb25lbnRzVXRpbC5fX19jb21wb25lbnRMb29rdXA7XG52YXIgZGVzdHJveU5vZGVSZWN1cnNpdmUgPSBjb21wb25lbnRzVXRpbC5fX19kZXN0cm95Tm9kZVJlY3Vyc2l2ZTtcbnZhciBkZWZhdWx0Q3JlYXRlT3V0ID0gcmVxdWlyZShcIi4uL2NyZWF0ZU91dFwiKTtcbnZhciBkb21JbnNlcnQgPSByZXF1aXJlKFwiLi4vZG9tLWluc2VydFwiKTtcbnZhciBSZW5kZXJSZXN1bHQgPSByZXF1aXJlKFwiLi4vUmVuZGVyUmVzdWx0XCIpO1xudmFyIG1vcnBoZG9tID0gcmVxdWlyZShcIi4uL3Zkb20vbW9ycGhkb21cIik7XG52YXIgZ2V0Q29tcG9uZW50c0NvbnRleHQgPVxuICByZXF1aXJlKFwiLi9Db21wb25lbnRzQ29udGV4dFwiKS5fX19nZXRDb21wb25lbnRzQ29udGV4dDtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4vZG9tLWRhdGFcIik7XG52YXIgZXZlbnREZWxlZ2F0aW9uID0gcmVxdWlyZShcIi4vZXZlbnQtZGVsZWdhdGlvblwiKTtcbnZhciB1cGRhdGVNYW5hZ2VyID0gcmVxdWlyZShcIi4vdXBkYXRlLW1hbmFnZXJcIik7XG52YXIgY29tcG9uZW50c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fY29tcG9uZW50QnlET01Ob2RlO1xudmFyIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkID0gZG9tRGF0YS5fX19zc3JLZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZDtcbnZhciBDT05URVhUX0tFWSA9IFwiX19zdWJ0cmVlX2NvbnRleHRfX1wiO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgQ09NUE9ORU5UX1NVQlNDUklCRV9UT19PUFRJT05TO1xudmFyIE5PTl9DT01QT05FTlRfU1VCU0NSSUJFX1RPX09QVElPTlMgPSB7XG4gIGFkZERlc3Ryb3lMaXN0ZW5lcjogZmFsc2UsXG59O1xuXG52YXIgZW1pdCA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdDtcbnZhciBFTEVNRU5UX05PREUgPSAxO1xuXG5mdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihyZW1vdmVFdmVudExpc3RlbmVySGFuZGxlKSB7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJIYW5kbGUoKTtcbn1cblxuZnVuY3Rpb24gd2Fsa0ZyYWdtZW50cyhmcmFnbWVudCkge1xuICB2YXIgbm9kZTtcblxuICB3aGlsZSAoZnJhZ21lbnQpIHtcbiAgICBub2RlID0gZnJhZ21lbnQuZmlyc3RDaGlsZDtcblxuICAgIGlmICghbm9kZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZnJhZ21lbnQgPSBub2RlLmZyYWdtZW50O1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUN1c3RvbUV2ZW50V2l0aE1ldGhvZExpc3RlbmVyKFxuICBjb21wb25lbnQsXG4gIHRhcmdldE1ldGhvZE5hbWUsXG4gIGFyZ3MsXG4gIGV4dHJhQXJncyxcbikge1xuICAvLyBSZW1vdmUgdGhlIFwiZXZlbnRUeXBlXCIgYXJndW1lbnRcbiAgYXJncy5wdXNoKGNvbXBvbmVudCk7XG5cbiAgaWYgKGV4dHJhQXJncykge1xuICAgIGFyZ3MgPSBleHRyYUFyZ3MuY29uY2F0KGFyZ3MpO1xuICB9XG5cbiAgdmFyIHRhcmdldENvbXBvbmVudCA9IGNvbXBvbmVudExvb2t1cFtjb21wb25lbnQuX19fc2NvcGVdO1xuICB2YXIgdGFyZ2V0TWV0aG9kID1cbiAgICB0eXBlb2YgdGFyZ2V0TWV0aG9kTmFtZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHRhcmdldE1ldGhvZE5hbWVcbiAgICAgIDogdGFyZ2V0Q29tcG9uZW50W3RhcmdldE1ldGhvZE5hbWVdO1xuICBpZiAoIXRhcmdldE1ldGhvZCkge1xuICAgIHRocm93IEVycm9yKFwiTWV0aG9kIG5vdCBmb3VuZDogXCIgKyB0YXJnZXRNZXRob2ROYW1lKTtcbiAgfVxuXG4gIHRhcmdldE1ldGhvZC5hcHBseSh0YXJnZXRDb21wb25lbnQsIGFyZ3MpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpIHtcbiAgcmV0dXJuIGluZGV4ID8ga2V5ICsgXCJfXCIgKyBpbmRleCA6IGtleTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUNvbXBvbmVudElkSGVscGVyKGNvbXBvbmVudCwga2V5LCBpbmRleCkge1xuICByZXR1cm4gY29tcG9uZW50LmlkICsgXCItXCIgKyByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gcHJvY2VzcyBcInVwZGF0ZV88c3RhdGVOYW1lPlwiIGhhbmRsZXIgZnVuY3Rpb25zLlxuICogSWYgYWxsIG9mIHRoZSBtb2RpZmllZCBzdGF0ZSBwcm9wZXJ0aWVzIGhhdmUgYSB1c2VyIHByb3ZpZGVkIHVwZGF0ZSBoYW5kbGVyXG4gKiB0aGVuIGEgcmVyZW5kZXIgd2lsbCBiZSBieXBhc3NlZCBhbmQsIGluc3RlYWQsIHRoZSBET00gd2lsbCBiZSB1cGRhdGVkXG4gKiBsb29waW5nIG92ZXIgYW5kIGludm9raW5nIHRoZSBjdXN0b20gdXBkYXRlIGhhbmRsZXJzLlxuICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGlmIHRoZSBET00gd2FzIHVwZGF0ZWQuIEZhbHNlLCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NVcGRhdGVIYW5kbGVycyhjb21wb25lbnQsIHN0YXRlQ2hhbmdlcywgb2xkU3RhdGUpIHtcbiAgdmFyIGhhbmRsZXJNZXRob2Q7XG4gIHZhciBoYW5kbGVycztcblxuICBmb3IgKHZhciBwcm9wTmFtZSBpbiBzdGF0ZUNoYW5nZXMpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzdGF0ZUNoYW5nZXMsIHByb3BOYW1lKSkge1xuICAgICAgdmFyIGhhbmRsZXJNZXRob2ROYW1lID0gXCJ1cGRhdGVfXCIgKyBwcm9wTmFtZTtcblxuICAgICAgaGFuZGxlck1ldGhvZCA9IGNvbXBvbmVudFtoYW5kbGVyTWV0aG9kTmFtZV07XG4gICAgICBpZiAoaGFuZGxlck1ldGhvZCkge1xuICAgICAgICAoaGFuZGxlcnMgfHwgKGhhbmRsZXJzID0gW10pKS5wdXNoKFtwcm9wTmFtZSwgaGFuZGxlck1ldGhvZF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyBzdGF0ZSBjaGFuZ2UgZG9lcyBub3QgaGF2ZSBhIHN0YXRlIGhhbmRsZXIgc28gcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vIHRvIGZvcmNlIGEgcmVyZW5kZXJcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHdlIGdvdCBoZXJlIHRoZW4gYWxsIG9mIHRoZSBjaGFuZ2VkIHN0YXRlIHByb3BlcnRpZXMgaGF2ZVxuICAvLyBhbiB1cGRhdGUgaGFuZGxlciBvciB0aGVyZSBhcmUgbm8gc3RhdGUgcHJvcGVydGllcyB0aGF0IGFjdHVhbGx5XG4gIC8vIGNoYW5nZWQuXG4gIGlmIChoYW5kbGVycykge1xuICAgIC8vIE90aGVyd2lzZSwgdGhlcmUgYXJlIGhhbmRsZXJzIGZvciBhbGwgb2YgdGhlIGNoYW5nZWQgcHJvcGVydGllc1xuICAgIC8vIHNvIGFwcGx5IHRoZSB1cGRhdGVzIHVzaW5nIHRob3NlIGhhbmRsZXJzXG5cbiAgICBoYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICB2YXIgcHJvcGVydHlOYW1lID0gaGFuZGxlclswXTtcbiAgICAgIGhhbmRsZXJNZXRob2QgPSBoYW5kbGVyWzFdO1xuXG4gICAgICB2YXIgbmV3VmFsdWUgPSBzdGF0ZUNoYW5nZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgIHZhciBvbGRWYWx1ZSA9IG9sZFN0YXRlW3Byb3BlcnR5TmFtZV07XG4gICAgICBoYW5kbGVyTWV0aG9kLmNhbGwoY29tcG9uZW50LCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgY29tcG9uZW50Ll9fX2VtaXRVcGRhdGUoKTtcbiAgICBjb21wb25lbnQuX19fcmVzZXQoKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjaGVja0lucHV0Q2hhbmdlZChleGlzdGluZ0NvbXBvbmVudCwgb2xkSW5wdXQsIG5ld0lucHV0KSB7XG4gIGlmIChvbGRJbnB1dCAhPSBuZXdJbnB1dCkge1xuICAgIGlmIChvbGRJbnB1dCA9PSBudWxsIHx8IG5ld0lucHV0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBvbGRLZXlzID0gT2JqZWN0LmtleXMob2xkSW5wdXQpO1xuICAgIHZhciBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3SW5wdXQpO1xuICAgIHZhciBsZW4gPSBvbGRLZXlzLmxlbmd0aDtcbiAgICBpZiAobGVuICE9PSBuZXdLZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IGxlbjsgaS0tOyApIHtcbiAgICAgIHZhciBrZXkgPSBvbGRLZXlzW2ldO1xuICAgICAgaWYgKCEoa2V5IGluIG5ld0lucHV0ICYmIG9sZElucHV0W2tleV0gPT09IG5ld0lucHV0W2tleV0pKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxudmFyIGNvbXBvbmVudFByb3RvO1xuXG4vKipcbiAqIEJhc2UgY29tcG9uZW50IHR5cGUuXG4gKlxuICogTk9URTogQW55IG1ldGhvZHMgdGhhdCBhcmUgcHJlZml4ZWQgd2l0aCBhbiB1bmRlcnNjb3JlIHNob3VsZCBiZSBjb25zaWRlcmVkIHByaXZhdGUhXG4gKi9cbmZ1bmN0aW9uIENvbXBvbmVudChpZCkge1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcbiAgdGhpcy5pZCA9IGlkO1xuICB0aGlzLl9fX3N0YXRlID0gbnVsbDtcbiAgdGhpcy5fX19yb290Tm9kZSA9IG51bGw7XG4gIHRoaXMuX19fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gIHRoaXMuX19fZG9tRXZlbnRMaXN0ZW5lckhhbmRsZXMgPSBudWxsO1xuICB0aGlzLl9fX2J1YmJsaW5nRG9tRXZlbnRzID0gbnVsbDsgLy8gVXNlZCB0byBrZWVwIHRyYWNrIG9mIGJ1YmJsaW5nIERPTSBldmVudHMgZm9yIGNvbXBvbmVudHMgcmVuZGVyZWQgb24gdGhlIHNlcnZlclxuICB0aGlzLl9fX2N1c3RvbUV2ZW50cyA9IG51bGw7XG4gIHRoaXMuX19fc2NvcGUgPSBudWxsO1xuICB0aGlzLl9fX3JlbmRlcklucHV0ID0gbnVsbDtcbiAgdGhpcy5fX19pbnB1dCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fX19tb3VudGVkID0gZmFsc2U7XG4gIHRoaXMuX19fZ2xvYmFsID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX2Rlc3Ryb3llZCA9IGZhbHNlO1xuICB0aGlzLl9fX3VwZGF0ZVF1ZXVlZCA9IGZhbHNlO1xuICB0aGlzLl9fX2RpcnR5ID0gZmFsc2U7XG4gIHRoaXMuX19fc2V0dGluZ0lucHV0ID0gZmFsc2U7XG4gIHRoaXMuX19faG9zdCA9IHVuZGVmaW5lZDtcblxuICB2YXIgc3NyS2V5ZWRFbGVtZW50cyA9IGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW2lkXTtcblxuICBpZiAoc3NyS2V5ZWRFbGVtZW50cykge1xuICAgIHRoaXMuX19fa2V5ZWRFbGVtZW50cyA9IHNzcktleWVkRWxlbWVudHM7XG4gICAgZGVsZXRlIGtleWVkRWxlbWVudHNCeUNvbXBvbmVudElkW2lkXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9fX2tleWVkRWxlbWVudHMgPSB7fTtcbiAgfVxufVxuXG5Db21wb25lbnQucHJvdG90eXBlID0gY29tcG9uZW50UHJvdG8gPSB7XG4gIF9fX2lzQ29tcG9uZW50OiB0cnVlLFxuXG4gIHN1YnNjcmliZVRvOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cblxuICAgIHZhciBzdWJzY3JpcHRpb25zID1cbiAgICAgIHRoaXMuX19fc3Vic2NyaXB0aW9ucyB8fFxuICAgICAgKHRoaXMuX19fc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb25UcmFja2VyKCkpO1xuXG4gICAgdmFyIHN1YnNjcmliZVRvT3B0aW9ucyA9IHRhcmdldC5fX19pc0NvbXBvbmVudFxuICAgICAgPyBDT01QT05FTlRfU1VCU0NSSUJFX1RPX09QVElPTlNcbiAgICAgIDogTk9OX0NPTVBPTkVOVF9TVUJTQ1JJQkVfVE9fT1BUSU9OUztcblxuICAgIHJldHVybiBzdWJzY3JpcHRpb25zLnN1YnNjcmliZVRvKHRhcmdldCwgc3Vic2NyaWJlVG9PcHRpb25zKTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAoZXZlbnRUeXBlKSB7XG4gICAgdmFyIGN1c3RvbUV2ZW50cyA9IHRoaXMuX19fY3VzdG9tRXZlbnRzO1xuICAgIHZhciB0YXJnZXQ7XG5cbiAgICBpZiAoY3VzdG9tRXZlbnRzICYmICh0YXJnZXQgPSBjdXN0b21FdmVudHNbZXZlbnRUeXBlXSkpIHtcbiAgICAgIHZhciB0YXJnZXRNZXRob2ROYW1lID0gdGFyZ2V0WzBdO1xuICAgICAgdmFyIGlzT25jZSA9IHRhcmdldFsxXTtcbiAgICAgIHZhciBleHRyYUFyZ3MgPSB0YXJnZXRbMl07XG4gICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgaGFuZGxlQ3VzdG9tRXZlbnRXaXRoTWV0aG9kTGlzdGVuZXIoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHRhcmdldE1ldGhvZE5hbWUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIGV4dHJhQXJncyxcbiAgICAgICk7XG5cbiAgICAgIGlmIChpc09uY2UpIHtcbiAgICAgICAgZGVsZXRlIGN1c3RvbUV2ZW50c1tldmVudFR5cGVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIGdldEVsSWQ6IGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb2x2ZUNvbXBvbmVudElkSGVscGVyKHRoaXMsIGtleSwgaW5kZXgpO1xuICB9LFxuICBnZXRFbDogZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgcmVzb2x2ZWRLZXkgPSByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpO1xuICAgICAgdmFyIGtleWVkRWxlbWVudCA9IHRoaXMuX19fa2V5ZWRFbGVtZW50c1tcIkBcIiArIHJlc29sdmVkS2V5XTtcbiAgICAgIGlmIChrZXllZEVsZW1lbnQgJiYga2V5ZWRFbGVtZW50Lm5vZGVUeXBlID09PSAxMiAvKiogRlJBR01FTlRfTk9ERSAqLykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgIGlmIChcIk1BUktPX0RFQlVHXCIpIHtcbiAgICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICAgIFwiQWNjZXNzaW5nIHRoZSBlbGVtZW50cyBvZiBhIGNoaWxkIGNvbXBvbmVudCB1c2luZyAnY29tcG9uZW50LmdldEVsJyBpcyBkZXByZWNhdGVkLlwiLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd2Fsa0ZyYWdtZW50cyhrZXllZEVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5ZWRFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9XG4gIH0sXG4gIGdldEVsczogZnVuY3Rpb24gKGtleSkge1xuICAgIGtleSA9IGtleSArIFwiW11cIjtcblxuICAgIHZhciBlbHMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGVsO1xuICAgIHdoaWxlICgoZWwgPSB0aGlzLmdldEVsKGtleSwgaSkpKSB7XG4gICAgICBlbHMucHVzaChlbCk7XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBlbHM7XG4gIH0sXG4gIGdldENvbXBvbmVudDogZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcbiAgICB2YXIgcm9vdE5vZGUgPSB0aGlzLl9fX2tleWVkRWxlbWVudHNbXCJAXCIgKyByZXNvbHZlS2V5SGVscGVyKGtleSwgaW5kZXgpXTtcbiAgICBpZiAoL1xcW1xcXSQvLnRlc3Qoa2V5KSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICBcIkEgcmVwZWF0ZWQga2V5W10gd2FzIHBhc3NlZCB0byBnZXRDb21wb25lbnQuIFVzZSBhIG5vbi1yZXBlYXRpbmcga2V5IGlmIHRoZXJlIGlzIG9ubHkgb25lIG9mIHRoZXNlIGNvbXBvbmVudHMuXCIsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByb290Tm9kZSA9IHJvb3ROb2RlICYmIHJvb3ROb2RlW09iamVjdC5rZXlzKHJvb3ROb2RlKVswXV07XG4gICAgfVxuICAgIHJldHVybiByb290Tm9kZSAmJiBjb21wb25lbnRzQnlET01Ob2RlLmdldChyb290Tm9kZSk7XG4gIH0sXG4gIGdldENvbXBvbmVudHM6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgbG9va3VwID0gdGhpcy5fX19rZXllZEVsZW1lbnRzW1wiQFwiICsga2V5ICsgXCJbXVwiXTtcbiAgICByZXR1cm4gbG9va3VwXG4gICAgICA/IE9iamVjdC5rZXlzKGxvb2t1cClcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzQnlET01Ob2RlLmdldChsb29rdXBba2V5XSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICA6IFtdO1xuICB9LFxuICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19fZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHJvb3QgPSB0aGlzLl9fX3Jvb3ROb2RlO1xuXG4gICAgdGhpcy5fX19kZXN0cm95U2hhbGxvdygpO1xuXG4gICAgdmFyIG5vZGVzID0gcm9vdC5ub2RlcztcblxuICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKG5vZGUpO1xuXG4gICAgICBpZiAoZXZlbnREZWxlZ2F0aW9uLl9fX2hhbmRsZU5vZGVEZXRhY2gobm9kZSkgIT09IGZhbHNlKSB7XG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJvb3QuZGV0YWNoZWQgPSB0cnVlO1xuXG4gICAgZGVsZXRlIGNvbXBvbmVudExvb2t1cFt0aGlzLmlkXTtcbiAgICB0aGlzLl9fX2tleWVkRWxlbWVudHMgPSB7fTtcbiAgfSxcblxuICBfX19kZXN0cm95U2hhbGxvdzogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9fX2Rlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX19fZW1pdERlc3Ryb3koKTtcbiAgICB0aGlzLl9fX2Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICBjb21wb25lbnRzQnlET01Ob2RlLnNldCh0aGlzLl9fX3Jvb3ROb2RlLCB1bmRlZmluZWQpO1xuXG4gICAgdGhpcy5fX19yb290Tm9kZSA9IG51bGw7XG5cbiAgICAvLyBVbnN1YnNjcmliZSBmcm9tIGFsbCBET00gZXZlbnRzXG4gICAgdGhpcy5fX19yZW1vdmVET01FdmVudExpc3RlbmVycygpO1xuXG4gICAgdmFyIHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9fX3N1YnNjcmlwdGlvbnM7XG4gICAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHN1YnNjcmlwdGlvbnMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLl9fX3N1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICBpc0Rlc3Ryb3llZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX2Rlc3Ryb3llZDtcbiAgfSxcbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3N0YXRlO1xuICB9LFxuICBzZXQgc3RhdGUobmV3U3RhdGUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuICAgIGlmICghc3RhdGUgJiYgIW5ld1N0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgc3RhdGUgPSB0aGlzLl9fX3N0YXRlID0gbmV3IHRoaXMuX19fU3RhdGUodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGUuX19fcmVwbGFjZShuZXdTdGF0ZSB8fCB7fSk7XG5cbiAgICBpZiAoc3RhdGUuX19fZGlydHkpIHtcbiAgICAgIHRoaXMuX19fcXVldWVVcGRhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAoIW5ld1N0YXRlKSB7XG4gICAgICB0aGlzLl9fX3N0YXRlID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIHNldFN0YXRlOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgc3RhdGUgPSB0aGlzLl9fX3N0YXRlID0gbmV3IHRoaXMuX19fU3RhdGUodGhpcyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAvLyBNZXJnZSBpbiB0aGUgbmV3IHN0YXRlIHdpdGggdGhlIG9sZCBzdGF0ZVxuICAgICAgdmFyIG5ld1N0YXRlID0gbmFtZTtcbiAgICAgIGZvciAodmFyIGsgaW4gbmV3U3RhdGUpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwobmV3U3RhdGUsIGspKSB7XG4gICAgICAgICAgc3RhdGUuX19fc2V0KGssIG5ld1N0YXRlW2tdLCB0cnVlIC8qIGVuc3VyZTp0cnVlICovKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5fX19zZXQobmFtZSwgdmFsdWUsIHRydWUgLyogZW5zdXJlOnRydWUgKi8pO1xuICAgIH1cbiAgfSxcblxuICBzZXRTdGF0ZURpcnR5OiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgdmFsdWUgPSBzdGF0ZVtuYW1lXTtcbiAgICB9XG5cbiAgICBzdGF0ZS5fX19zZXQoXG4gICAgICBuYW1lLFxuICAgICAgdmFsdWUsXG4gICAgICB0cnVlIC8qIGVuc3VyZTp0cnVlICovLFxuICAgICAgdHJ1ZSAvKiBmb3JjZURpcnR5OnRydWUgKi8sXG4gICAgKTtcbiAgfSxcblxuICByZXBsYWNlU3RhdGU6IGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgIHRoaXMuX19fc3RhdGUuX19fcmVwbGFjZShuZXdTdGF0ZSk7XG4gIH0sXG5cbiAgZ2V0IGlucHV0KCkge1xuICAgIHJldHVybiB0aGlzLl9fX2lucHV0O1xuICB9LFxuICBzZXQgaW5wdXQobmV3SW5wdXQpIHtcbiAgICBpZiAodGhpcy5fX19zZXR0aW5nSW5wdXQpIHtcbiAgICAgIHRoaXMuX19faW5wdXQgPSBuZXdJbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX19zZXRJbnB1dChuZXdJbnB1dCk7XG4gICAgfVxuICB9LFxuXG4gIF9fX3NldElucHV0OiBmdW5jdGlvbiAobmV3SW5wdXQsIG9uSW5wdXQsIG91dCkge1xuICAgIG9uSW5wdXQgPSBvbklucHV0IHx8IHRoaXMub25JbnB1dDtcbiAgICB2YXIgdXBkYXRlZElucHV0O1xuXG4gICAgdmFyIG9sZElucHV0ID0gdGhpcy5fX19pbnB1dDtcbiAgICB0aGlzLl9fX2lucHV0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX19fY29udGV4dCA9IChvdXQgJiYgb3V0W0NPTlRFWFRfS0VZXSkgfHwgdGhpcy5fX19jb250ZXh0O1xuXG4gICAgaWYgKG9uSW5wdXQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gc2V0IGEgZmxhZyB0byBwcmV2aWV3IGB0aGlzLmlucHV0ID0gZm9vYCBpbnNpZGVcbiAgICAgIC8vIG9uSW5wdXQgY2F1c2luZyBpbmZpbml0ZSByZWN1cnNpb25cbiAgICAgIHRoaXMuX19fc2V0dGluZ0lucHV0ID0gdHJ1ZTtcbiAgICAgIHVwZGF0ZWRJbnB1dCA9IG9uSW5wdXQuY2FsbCh0aGlzLCBuZXdJbnB1dCB8fCB7fSwgb3V0KTtcbiAgICAgIHRoaXMuX19fc2V0dGluZ0lucHV0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbmV3SW5wdXQgPSB0aGlzLl9fX3JlbmRlcklucHV0ID0gdXBkYXRlZElucHV0IHx8IG5ld0lucHV0O1xuXG4gICAgaWYgKCh0aGlzLl9fX2RpcnR5ID0gY2hlY2tJbnB1dENoYW5nZWQodGhpcywgb2xkSW5wdXQsIG5ld0lucHV0KSkpIHtcbiAgICAgIHRoaXMuX19fcXVldWVVcGRhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fX19pbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9fX2lucHV0ID0gbmV3SW5wdXQ7XG4gICAgICBpZiAobmV3SW5wdXQgJiYgbmV3SW5wdXQuJGdsb2JhbCkge1xuICAgICAgICB0aGlzLl9fX2dsb2JhbCA9IG5ld0lucHV0LiRnbG9iYWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0lucHV0O1xuICB9LFxuXG4gIGZvcmNlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX19kaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fX19xdWV1ZVVwZGF0ZSgpO1xuICB9LFxuXG4gIF9fX3F1ZXVlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9fX3VwZGF0ZVF1ZXVlZCkge1xuICAgICAgdGhpcy5fX191cGRhdGVRdWV1ZWQgPSB0cnVlO1xuICAgICAgdXBkYXRlTWFuYWdlci5fX19xdWV1ZUNvbXBvbmVudFVwZGF0ZSh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19fZGVzdHJveWVkID09PSB0cnVlIHx8IHRoaXMuX19faXNEaXJ0eSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaW5wdXQgPSB0aGlzLl9fX2lucHV0O1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAodGhpcy5fX19kaXJ0eSA9PT0gZmFsc2UgJiYgc3RhdGUgIT09IG51bGwgJiYgc3RhdGUuX19fZGlydHkgPT09IHRydWUpIHtcbiAgICAgIGlmIChwcm9jZXNzVXBkYXRlSGFuZGxlcnModGhpcywgc3RhdGUuX19fY2hhbmdlcywgc3RhdGUuX19fb2xkLCBzdGF0ZSkpIHtcbiAgICAgICAgc3RhdGUuX19fZGlydHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fX19pc0RpcnR5ID09PSB0cnVlKSB7XG4gICAgICAvLyBUaGUgVUkgY29tcG9uZW50IGlzIHN0aWxsIGRpcnR5IGFmdGVyIHByb2Nlc3Mgc3RhdGUgaGFuZGxlcnNcbiAgICAgIC8vIHRoZW4gd2Ugc2hvdWxkIHJlcmVuZGVyXG5cbiAgICAgIGlmICh0aGlzLnNob3VsZFVwZGF0ZShpbnB1dCwgc3RhdGUpICE9PSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9fX3NjaGVkdWxlUmVyZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9fX3Jlc2V0KCk7XG4gIH0sXG5cbiAgZ2V0IF9fX2lzRGlydHkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX19fZGlydHkgPT09IHRydWUgfHxcbiAgICAgICh0aGlzLl9fX3N0YXRlICE9PSBudWxsICYmIHRoaXMuX19fc3RhdGUuX19fZGlydHkgPT09IHRydWUpXG4gICAgKTtcbiAgfSxcblxuICBfX19yZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX19fZGlydHkgPSBmYWxzZTtcbiAgICB0aGlzLl9fX3VwZGF0ZVF1ZXVlZCA9IGZhbHNlO1xuICAgIHRoaXMuX19fcmVuZGVySW5wdXQgPSBudWxsO1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGF0ZS5fX19yZXNldCgpO1xuICAgIH1cbiAgfSxcblxuICBzaG91bGRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBfX19zY2hlZHVsZVJlcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZW5kZXJlciA9IHNlbGYuX19fcmVuZGVyZXI7XG5cbiAgICBpZiAoIXJlbmRlcmVyKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgaW5wdXQgPSB0aGlzLl9fX3JlbmRlcklucHV0IHx8IHRoaXMuX19faW5wdXQ7XG5cbiAgICB1cGRhdGVNYW5hZ2VyLl9fX2JhdGNoVXBkYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX19fcmVyZW5kZXIoaW5wdXQsIGZhbHNlKS5hZnRlckluc2VydChzZWxmLl9fX2hvc3QpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fX19yZXNldCgpO1xuICB9LFxuXG4gIF9fX3JlcmVuZGVyOiBmdW5jdGlvbiAoaW5wdXQsIGlzSHlkcmF0ZSkge1xuICAgIHZhciBob3N0ID0gdGhpcy5fX19ob3N0O1xuICAgIHZhciBnbG9iYWxEYXRhID0gdGhpcy5fX19nbG9iYWw7XG4gICAgdmFyIHJvb3ROb2RlID0gdGhpcy5fX19yb290Tm9kZTtcbiAgICB2YXIgcmVuZGVyZXIgPSB0aGlzLl9fX3JlbmRlcmVyO1xuICAgIHZhciBjcmVhdGVPdXQgPSByZW5kZXJlci5jcmVhdGVPdXQgfHwgZGVmYXVsdENyZWF0ZU91dDtcbiAgICB2YXIgb3V0ID0gY3JlYXRlT3V0KGdsb2JhbERhdGEpO1xuICAgIG91dC5zeW5jKCk7XG4gICAgb3V0Ll9fX2hvc3QgPSB0aGlzLl9fX2hvc3Q7XG4gICAgb3V0W0NPTlRFWFRfS0VZXSA9IHRoaXMuX19fY29udGV4dDtcblxuICAgIHZhciBjb21wb25lbnRzQ29udGV4dCA9IGdldENvbXBvbmVudHNDb250ZXh0KG91dCk7XG4gICAgdmFyIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gY29tcG9uZW50c0NvbnRleHQuX19fZ2xvYmFsQ29udGV4dDtcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZXJlbmRlckNvbXBvbmVudCA9IHRoaXM7XG4gICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19faXNIeWRyYXRlID0gaXNIeWRyYXRlO1xuXG4gICAgcmVuZGVyZXIoaW5wdXQsIG91dCk7XG5cbiAgICB2YXIgcmVzdWx0ID0gbmV3IFJlbmRlclJlc3VsdChvdXQpO1xuXG4gICAgdmFyIHRhcmdldE5vZGUgPSBvdXQuX19fZ2V0T3V0cHV0KCkuX19fZmlyc3RDaGlsZDtcblxuICAgIG1vcnBoZG9tKHJvb3ROb2RlLCB0YXJnZXROb2RlLCBob3N0LCBjb21wb25lbnRzQ29udGV4dCk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIF9fX2RldGFjaDogZnVuY3Rpb24gKCkge1xuICAgIHZhciByb290ID0gdGhpcy5fX19yb290Tm9kZTtcbiAgICByb290LnJlbW92ZSgpO1xuICAgIHJldHVybiByb290O1xuICB9LFxuXG4gIF9fX3JlbW92ZURPTUV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50TGlzdGVuZXJIYW5kbGVzID0gdGhpcy5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcztcbiAgICBpZiAoZXZlbnRMaXN0ZW5lckhhbmRsZXMpIHtcbiAgICAgIGV2ZW50TGlzdGVuZXJIYW5kbGVzLmZvckVhY2gocmVtb3ZlTGlzdGVuZXIpO1xuICAgICAgdGhpcy5fX19kb21FdmVudExpc3RlbmVySGFuZGxlcyA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIGdldCBfX19yYXdTdGF0ZSgpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuICAgIHJldHVybiBzdGF0ZSAmJiBzdGF0ZS5fX19yYXc7XG4gIH0sXG5cbiAgX19fc2V0Q3VzdG9tRXZlbnRzOiBmdW5jdGlvbiAoY3VzdG9tRXZlbnRzLCBzY29wZSkge1xuICAgIHZhciBmaW5hbEN1c3RvbUV2ZW50cyA9ICh0aGlzLl9fX2N1c3RvbUV2ZW50cyA9IHt9KTtcbiAgICB0aGlzLl9fX3Njb3BlID0gc2NvcGU7XG5cbiAgICBjdXN0b21FdmVudHMuZm9yRWFjaChmdW5jdGlvbiAoY3VzdG9tRXZlbnQpIHtcbiAgICAgIHZhciBldmVudFR5cGUgPSBjdXN0b21FdmVudFswXTtcbiAgICAgIHZhciB0YXJnZXRNZXRob2ROYW1lID0gY3VzdG9tRXZlbnRbMV07XG4gICAgICB2YXIgaXNPbmNlID0gY3VzdG9tRXZlbnRbMl07XG4gICAgICB2YXIgZXh0cmFBcmdzID0gY3VzdG9tRXZlbnRbM107XG5cbiAgICAgIGlmICh0YXJnZXRNZXRob2ROYW1lKSB7XG4gICAgICAgIGZpbmFsQ3VzdG9tRXZlbnRzW2V2ZW50VHlwZV0gPSBbdGFyZ2V0TWV0aG9kTmFtZSwgaXNPbmNlLCBleHRyYUFyZ3NdO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gd2Fsa0ZyYWdtZW50cyh0aGlzLl9fX3Jvb3ROb2RlKTtcbiAgfSxcblxuICBnZXQgZWxzKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBjb21wbGFpbihcbiAgICAgICAgJ1RoZSBcInRoaXMuZWxzXCIgYXR0cmlidXRlIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgXCJ0aGlzLmdldEVscyhrZXkpXCIgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLl9fX3Jvb3ROb2RlID8gdGhpcy5fX19yb290Tm9kZS5ub2RlcyA6IFtdKS5maWx0ZXIoXG4gICAgICBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREU7XG4gICAgICB9LFxuICAgICk7XG4gIH0sXG5cbiAgX19fZW1pdDogZW1pdCxcbiAgX19fZW1pdENyZWF0ZShpbnB1dCwgb3V0KSB7XG4gICAgdGhpcy5vbkNyZWF0ZSAmJiB0aGlzLm9uQ3JlYXRlKGlucHV0LCBvdXQpO1xuICAgIHRoaXMuX19fZW1pdChcImNyZWF0ZVwiLCBpbnB1dCwgb3V0KTtcbiAgfSxcblxuICBfX19lbWl0UmVuZGVyKG91dCkge1xuICAgIHRoaXMub25SZW5kZXIgJiYgdGhpcy5vblJlbmRlcihvdXQpO1xuICAgIHRoaXMuX19fZW1pdChcInJlbmRlclwiLCBvdXQpO1xuICB9LFxuXG4gIF9fX2VtaXRVcGRhdGUoKSB7XG4gICAgdGhpcy5vblVwZGF0ZSAmJiB0aGlzLm9uVXBkYXRlKCk7XG4gICAgdGhpcy5fX19lbWl0KFwidXBkYXRlXCIpO1xuICB9LFxuXG4gIF9fX2VtaXRNb3VudCgpIHtcbiAgICB0aGlzLm9uTW91bnQgJiYgdGhpcy5vbk1vdW50KCk7XG4gICAgdGhpcy5fX19lbWl0KFwibW91bnRcIik7XG4gIH0sXG5cbiAgX19fZW1pdERlc3Ryb3koKSB7XG4gICAgdGhpcy5vbkRlc3Ryb3kgJiYgdGhpcy5vbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9fX2VtaXQoXCJkZXN0cm95XCIpO1xuICB9LFxufTtcblxuY29tcG9uZW50UHJvdG8uZWxJZCA9IGNvbXBvbmVudFByb3RvLmdldEVsSWQ7XG5jb21wb25lbnRQcm90by5fX191cGRhdGUgPSBjb21wb25lbnRQcm90by51cGRhdGU7XG5jb21wb25lbnRQcm90by5fX19kZXN0cm95ID0gY29tcG9uZW50UHJvdG8uZGVzdHJveTtcblxuLy8gQWRkIGFsbCBvZiB0aGUgZm9sbG93aW5nIERPTSBtZXRob2RzIHRvIENvbXBvbmVudC5wcm90b3R5cGU6XG4vLyAtIGFwcGVuZFRvKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlKHJlZmVyZW5jZUVsKVxuLy8gLSByZXBsYWNlQ2hpbGRyZW5PZihyZWZlcmVuY2VFbClcbi8vIC0gaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUVsKVxuLy8gLSBpbnNlcnRBZnRlcihyZWZlcmVuY2VFbClcbi8vIC0gcHJlcGVuZFRvKHJlZmVyZW5jZUVsKVxuZG9tSW5zZXJ0KFxuICBjb21wb25lbnRQcm90byxcbiAgZnVuY3Rpb24gZ2V0RWwoY29tcG9uZW50KSB7XG4gICAgcmV0dXJuIGNvbXBvbmVudC5fX19kZXRhY2goKTtcbiAgfSxcbiAgZnVuY3Rpb24gYWZ0ZXJJbnNlcnQoY29tcG9uZW50KSB7XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgfSxcbik7XG5cbmluaGVyaXQoQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbXBsYWluID0gXCJNQVJLT19ERUJVR1wiICYmIHJlcXVpcmUoXCJjb21wbGFpblwiKTtcbnZhciBleHRlbmQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvZXh0ZW5kXCIpO1xudmFyIHcxME5vb3AgPSByZXF1aXJlKFwid2FycDEwL2NvbnN0YW50c1wiKS5OT09QO1xudmFyIGNvbXBvbmVudFV0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBhdHRhY2hCdWJibGluZ0V2ZW50ID0gY29tcG9uZW50VXRpbC5fX19hdHRhY2hCdWJibGluZ0V2ZW50O1xudmFyIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlciA9XG4gIHJlcXVpcmUoXCIuL2V2ZW50LWRlbGVnYXRpb25cIikuX19fYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyO1xudmFyIEtleVNlcXVlbmNlID0gcmVxdWlyZShcIi4vS2V5U2VxdWVuY2VcIik7XG52YXIgRU1QVFlfT0JKRUNUID0ge307XG5cbnZhciBGTEFHX1dJTExfUkVSRU5ERVJfSU5fQlJPV1NFUiA9IDE7XG52YXIgRkxBR19IQVNfUkVOREVSX0JPRFkgPSAyO1xudmFyIEZMQUdfSVNfTEVHQUNZID0gNDtcbnZhciBGTEFHX09MRF9IWURSQVRFX05PX0NSRUFURSA9IDg7XG5cbi8qKlxuICogQSBDb21wb25lbnREZWYgaXMgdXNlZCB0byBob2xkIHRoZSBtZXRhZGF0YSBjb2xsZWN0ZWQgYXQgcnVudGltZSBmb3JcbiAqIGEgc2luZ2xlIGNvbXBvbmVudCBhbmQgdGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIHRvIGluc3RhbnRpYXRlIHRoZSBjb21wb25lbnRcbiAqIGxhdGVyIChhZnRlciB0aGUgcmVuZGVyZWQgSFRNTCBoYXMgYmVlbiBhZGRlZCB0byB0aGUgRE9NKVxuICovXG5mdW5jdGlvbiBDb21wb25lbnREZWYoY29tcG9uZW50LCBjb21wb25lbnRJZCwgY29tcG9uZW50c0NvbnRleHQpIHtcbiAgdGhpcy5fX19jb21wb25lbnRzQ29udGV4dCA9IGNvbXBvbmVudHNDb250ZXh0OyAvLyBUaGUgQXN5bmNXcml0ZXIgdGhhdCB0aGlzIGNvbXBvbmVudCBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgdGhpcy5fX19jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gIHRoaXMuaWQgPSBjb21wb25lbnRJZDtcblxuICB0aGlzLl9fX2RvbUV2ZW50cyA9IHVuZGVmaW5lZDsgLy8gQW4gYXJyYXkgb2YgRE9NIGV2ZW50cyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgKGluIHNldHMgb2YgdGhyZWUpXG5cbiAgdGhpcy5fX19pc0V4aXN0aW5nID0gZmFsc2U7XG5cbiAgdGhpcy5fX19yZW5kZXJCb3VuZGFyeSA9IGZhbHNlO1xuICB0aGlzLl9fX2ZsYWdzID0gMDtcblxuICB0aGlzLl9fX25leHRJZEluZGV4ID0gMDsgLy8gVGhlIHVuaXF1ZSBpbnRlZ2VyIHRvIHVzZSBmb3IgdGhlIG5leHQgc2NvcGVkIElEXG4gIHRoaXMuX19fa2V5U2VxdWVuY2UgPSBudWxsO1xufVxuXG5Db21wb25lbnREZWYucHJvdG90eXBlID0ge1xuICBfX19uZXh0S2V5OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX19fa2V5U2VxdWVuY2UgfHwgKHRoaXMuX19fa2V5U2VxdWVuY2UgPSBuZXcgS2V5U2VxdWVuY2UoKSlcbiAgICApLl9fX25leHRLZXkoa2V5KTtcbiAgfSxcblxuICAvKipcbiAgICogVGhpcyBoZWxwZXIgbWV0aG9kIGdlbmVyYXRlcyBhIHVuaXF1ZSBhbmQgZnVsbHkgcXVhbGlmaWVkIERPTSBlbGVtZW50IElEXG4gICAqIHRoYXQgaXMgdW5pcXVlIHdpdGhpbiB0aGUgc2NvcGUgb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50LlxuICAgKi9cbiAgZWxJZDogZnVuY3Rpb24gKG5lc3RlZElkKSB7XG4gICAgdmFyIGlkID0gdGhpcy5pZDtcblxuICAgIGlmIChuZXN0ZWRJZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgbmVzdGVkSWQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICAgICAgY29tcGxhaW4oXCJVc2luZyBub24gc3RyaW5ncyBhcyBrZXlzIGlzIGRlcHJlY2F0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmVzdGVkSWQgPSBTdHJpbmcobmVzdGVkSWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVzdGVkSWQuaW5kZXhPZihcIiNcIikgPT09IDApIHtcbiAgICAgICAgaWQgPSBcIiNcIiArIGlkO1xuICAgICAgICBuZXN0ZWRJZCA9IG5lc3RlZElkLnN1YnN0cmluZygxKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlkICsgXCItXCIgKyBuZXN0ZWRJZDtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuZXh0IGF1dG8gZ2VuZXJhdGVkIHVuaXF1ZSBJRCBmb3IgYSBuZXN0ZWQgRE9NIGVsZW1lbnQgb3IgbmVzdGVkIERPTSBjb21wb25lbnRcbiAgICovXG4gIF9fX25leHRDb21wb25lbnRJZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlkICsgXCItY1wiICsgdGhpcy5fX19uZXh0SWRJbmRleCsrO1xuICB9LFxuXG4gIGQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGhhbmRsZXJNZXRob2ROYW1lLCBpc09uY2UsIGV4dHJhQXJncykge1xuICAgIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlcihldmVudE5hbWUpO1xuICAgIHJldHVybiBhdHRhY2hCdWJibGluZ0V2ZW50KHRoaXMsIGhhbmRsZXJNZXRob2ROYW1lLCBpc09uY2UsIGV4dHJhQXJncyk7XG4gIH0sXG5cbiAgZ2V0IF9fX3R5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19fY29tcG9uZW50Ll9fX3R5cGU7XG4gIH0sXG59O1xuXG5Db21wb25lbnREZWYucHJvdG90eXBlLm5rID0gQ29tcG9uZW50RGVmLnByb3RvdHlwZS5fX19uZXh0S2V5O1xuXG5Db21wb25lbnREZWYuX19fZGVzZXJpYWxpemUgPSBmdW5jdGlvbiAobywgdHlwZXMsIGdsb2JhbCwgcmVnaXN0cnkpIHtcbiAgdmFyIGlkID0gb1swXTtcbiAgdmFyIHR5cGVOYW1lID0gdHlwZXNbb1sxXV07XG4gIHZhciBpbnB1dCA9IG9bMl0gfHwgbnVsbDtcbiAgdmFyIGV4dHJhID0gb1szXSB8fCBFTVBUWV9PQkpFQ1Q7XG5cbiAgdmFyIHN0YXRlID0gZXh0cmEucztcbiAgdmFyIGNvbXBvbmVudFByb3BzID0gZXh0cmEudyB8fCBFTVBUWV9PQkpFQ1Q7XG4gIHZhciBmbGFncyA9IGV4dHJhLmY7XG4gIHZhciBpc0xlZ2FjeSA9IGZsYWdzICYgRkxBR19JU19MRUdBQ1k7XG4gIHZhciByZW5kZXJCb2R5ID0gZmxhZ3MgJiBGTEFHX0hBU19SRU5ERVJfQk9EWSA/IHcxME5vb3AgOiBleHRyYS5yO1xuXG4gIHZhciBjb21wb25lbnQgPVxuICAgIHR5cGVOYW1lIC8qIGxlZ2FjeSAqLyAmJlxuICAgIHJlZ2lzdHJ5Ll9fX2NyZWF0ZUNvbXBvbmVudCh0eXBlTmFtZSwgaWQsIGlzTGVnYWN5KTtcblxuICAvLyBQcmV2ZW50IG5ld2x5IGNyZWF0ZWQgY29tcG9uZW50IGZyb20gYmVpbmcgcXVldWVkIGZvciB1cGRhdGUgc2luY2Ugd2UgYXJlYVxuICAvLyBqdXN0IGJ1aWxkaW5nIGl0IGZyb20gdGhlIHNlcnZlciBpbmZvXG4gIGNvbXBvbmVudC5fX191cGRhdGVRdWV1ZWQgPSB0cnVlO1xuXG4gIGlmIChpc0xlZ2FjeSkge1xuICAgIGNvbXBvbmVudC53aWRnZXRDb25maWcgPSBjb21wb25lbnRQcm9wcztcbiAgICBjb21wb25lbnQuX19fd2lkZ2V0Qm9keSA9IHJlbmRlckJvZHk7XG4gIH0gZWxzZSBpZiAocmVuZGVyQm9keSkge1xuICAgIChpbnB1dCB8fCAoaW5wdXQgPSB7fSkpLnJlbmRlckJvZHkgPSByZW5kZXJCb2R5O1xuICB9XG5cbiAgaWYgKFxuICAgICFpc0xlZ2FjeSAmJlxuICAgIGZsYWdzICYgRkxBR19XSUxMX1JFUkVOREVSX0lOX0JST1dTRVIgJiZcbiAgICAhKGZsYWdzICYgRkxBR19PTERfSFlEUkFURV9OT19DUkVBVEUpXG4gICkge1xuICAgIGlmIChjb21wb25lbnQub25DcmVhdGUpIHtcbiAgICAgIGNvbXBvbmVudC5vbkNyZWF0ZShpbnB1dCwgeyBnbG9iYWw6IGdsb2JhbCB9KTtcbiAgICB9XG4gICAgaWYgKGNvbXBvbmVudC5vbklucHV0KSB7XG4gICAgICBpbnB1dCA9IGNvbXBvbmVudC5vbklucHV0KGlucHV0LCB7IGdsb2JhbDogZ2xvYmFsIH0pIHx8IGlucHV0O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHZhciB1bmRlZmluZWRQcm9wTmFtZXMgPSBleHRyYS51O1xuICAgICAgaWYgKHVuZGVmaW5lZFByb3BOYW1lcykge1xuICAgICAgICB1bmRlZmluZWRQcm9wTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAodW5kZWZpbmVkUHJvcE5hbWUpIHtcbiAgICAgICAgICBzdGF0ZVt1bmRlZmluZWRQcm9wTmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gV2UgZ28gdGhyb3VnaCB0aGUgc2V0dGVyIGhlcmUgc28gdGhhdCB3ZSBjb252ZXJ0IHRoZSBzdGF0ZSBvYmplY3RcbiAgICAgIC8vIHRvIGFuIGluc3RhbmNlIG9mIGBTdGF0ZWBcbiAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cblxuICAgIGlmICghaXNMZWdhY3kgJiYgY29tcG9uZW50UHJvcHMpIHtcbiAgICAgIGV4dGVuZChjb21wb25lbnQsIGNvbXBvbmVudFByb3BzKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnQuX19faW5wdXQgPSBpbnB1dDtcblxuICBpZiAoZXh0cmEuYikge1xuICAgIGNvbXBvbmVudC5fX19idWJibGluZ0RvbUV2ZW50cyA9IGV4dHJhLmI7XG4gIH1cblxuICB2YXIgc2NvcGUgPSBleHRyYS5wO1xuICB2YXIgY3VzdG9tRXZlbnRzID0gZXh0cmEuZTtcbiAgaWYgKGN1c3RvbUV2ZW50cykge1xuICAgIGNvbXBvbmVudC5fX19zZXRDdXN0b21FdmVudHMoY3VzdG9tRXZlbnRzLCBzY29wZSk7XG4gIH1cblxuICBjb21wb25lbnQuX19fZ2xvYmFsID0gZ2xvYmFsO1xuXG4gIHJldHVybiB7XG4gICAgaWQ6IGlkLFxuICAgIF9fX2NvbXBvbmVudDogY29tcG9uZW50LFxuICAgIF9fX2RvbUV2ZW50czogZXh0cmEuZCxcbiAgICBfX19mbGFnczogZXh0cmEuZiB8fCAwLFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnREZWY7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBHbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IHJlcXVpcmUoXCIuL0dsb2JhbENvbXBvbmVudHNDb250ZXh0XCIpO1xuXG5mdW5jdGlvbiBDb21wb25lbnRzQ29udGV4dChvdXQsIHBhcmVudENvbXBvbmVudHNDb250ZXh0KSB7XG4gIHZhciBnbG9iYWxDb21wb25lbnRzQ29udGV4dDtcbiAgdmFyIGNvbXBvbmVudERlZjtcblxuICBpZiAocGFyZW50Q29tcG9uZW50c0NvbnRleHQpIHtcbiAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IHBhcmVudENvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQ7XG4gICAgY29tcG9uZW50RGVmID0gcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmO1xuXG4gICAgdmFyIG5lc3RlZENvbnRleHRzRm9yUGFyZW50O1xuICAgIGlmIChcbiAgICAgICEobmVzdGVkQ29udGV4dHNGb3JQYXJlbnQgPSBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19uZXN0ZWRDb250ZXh0cylcbiAgICApIHtcbiAgICAgIG5lc3RlZENvbnRleHRzRm9yUGFyZW50ID0gcGFyZW50Q29tcG9uZW50c0NvbnRleHQuX19fbmVzdGVkQ29udGV4dHMgPSBbXTtcbiAgICB9XG5cbiAgICBuZXN0ZWRDb250ZXh0c0ZvclBhcmVudC5wdXNoKHRoaXMpO1xuICB9IGVsc2Uge1xuICAgIGdsb2JhbENvbXBvbmVudHNDb250ZXh0ID0gb3V0Lmdsb2JhbC5fX19jb21wb25lbnRzO1xuICAgIGlmIChnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXQuZ2xvYmFsLl9fX2NvbXBvbmVudHMgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9XG4gICAgICAgIG5ldyBHbG9iYWxDb21wb25lbnRzQ29udGV4dChvdXQpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX19fZ2xvYmFsQ29udGV4dCA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0O1xuICB0aGlzLl9fX2NvbXBvbmVudHMgPSBbXTtcbiAgdGhpcy5fX19vdXQgPSBvdXQ7XG4gIHRoaXMuX19fY29tcG9uZW50RGVmID0gY29tcG9uZW50RGVmO1xuICB0aGlzLl9fX25lc3RlZENvbnRleHRzID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX2lzUHJlc2VydmVkID1cbiAgICBwYXJlbnRDb21wb25lbnRzQ29udGV4dCAmJiBwYXJlbnRDb21wb25lbnRzQ29udGV4dC5fX19pc1ByZXNlcnZlZDtcbn1cblxuQ29tcG9uZW50c0NvbnRleHQucHJvdG90eXBlID0ge1xuICBfX19pbml0Q29tcG9uZW50czogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICB2YXIgY29tcG9uZW50RGVmcyA9IHRoaXMuX19fY29tcG9uZW50cztcblxuICAgIENvbXBvbmVudHNDb250ZXh0Ll9fX2luaXRDbGllbnRSZW5kZXJlZChjb21wb25lbnREZWZzLCBob3N0KTtcblxuICAgIHRoaXMuX19fb3V0LmVtaXQoXCJfX19jb21wb25lbnRzSW5pdGlhbGl6ZWRcIik7XG5cbiAgICAvLyBSZXNldCB0aGluZ3Mgc3RvcmVkIGluIGdsb2JhbCBzaW5jZSBnbG9iYWwgaXMgcmV0YWluZWQgZm9yXG4gICAgLy8gZnV0dXJlIHJlbmRlcnNcbiAgICB0aGlzLl9fX291dC5nbG9iYWwuX19fY29tcG9uZW50cyA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBjb21wb25lbnREZWZzO1xuICB9LFxufTtcblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50c0NvbnRleHQob3V0KSB7XG4gIHJldHVybiBvdXQuX19fY29tcG9uZW50cyB8fCAob3V0Ll9fX2NvbXBvbmVudHMgPSBuZXcgQ29tcG9uZW50c0NvbnRleHQob3V0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IENvbXBvbmVudHNDb250ZXh0O1xuXG5leHBvcnRzLl9fX2dldENvbXBvbmVudHNDb250ZXh0ID0gZ2V0Q29tcG9uZW50c0NvbnRleHQ7XG4iLCJ2YXIgbmV4dENvbXBvbmVudElkUHJvdmlkZXIgPVxuICByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKS5fX19uZXh0Q29tcG9uZW50SWRQcm92aWRlcjtcblxuZnVuY3Rpb24gR2xvYmFsQ29tcG9uZW50c0NvbnRleHQob3V0KSB7XG4gIHRoaXMuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZCA9IHt9O1xuICB0aGlzLl9fX3JlcmVuZGVyQ29tcG9uZW50ID0gdW5kZWZpbmVkO1xuICB0aGlzLl9fX25leHRDb21wb25lbnRJZCA9IG5leHRDb21wb25lbnRJZFByb3ZpZGVyKG91dCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsQ29tcG9uZW50c0NvbnRleHQ7XG4iLCJmdW5jdGlvbiBLZXlTZXF1ZW5jZSgpIHtcbiAgdGhpcy5fX19sb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuXG5LZXlTZXF1ZW5jZS5wcm90b3R5cGUuX19fbmV4dEtleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIGxvb2t1cCA9IHRoaXMuX19fbG9va3VwO1xuXG4gIGlmIChsb29rdXBba2V5XSkge1xuICAgIHJldHVybiBrZXkgKyBcIl9cIiArIGxvb2t1cFtrZXldKys7XG4gIH1cblxuICBsb29rdXBba2V5XSA9IDE7XG4gIHJldHVybiBrZXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleVNlcXVlbmNlO1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG5cbmZ1bmN0aW9uIGVuc3VyZShzdGF0ZSwgcHJvcGVydHlOYW1lKSB7XG4gIHZhciBwcm90byA9IHN0YXRlLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgaWYgKCEocHJvcGVydHlOYW1lIGluIHByb3RvKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgcHJvcGVydHlOYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19fcmF3W3Byb3BlcnR5TmFtZV07XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fX19zZXQocHJvcGVydHlOYW1lLCB2YWx1ZSwgZmFsc2UgLyogZW5zdXJlOmZhbHNlICovKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gU3RhdGUoY29tcG9uZW50KSB7XG4gIHRoaXMuX19fY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB0aGlzLl9fX3JhdyA9IHt9O1xuXG4gIHRoaXMuX19fZGlydHkgPSBmYWxzZTtcbiAgdGhpcy5fX19vbGQgPSBudWxsO1xuICB0aGlzLl9fX2NoYW5nZXMgPSBudWxsO1xuICB0aGlzLl9fX2ZvcmNlZCA9IG51bGw7IC8vIEFuIG9iamVjdCB0aGF0IHdlIHVzZSB0byBrZWVwIHRyYWNraW5nIG9mIHN0YXRlIHByb3BlcnRpZXMgdGhhdCB3ZXJlIGZvcmNlZCB0byBiZSBkaXJ0eVxuXG4gIE9iamVjdC5zZWFsKHRoaXMpO1xufVxuXG5TdGF0ZS5wcm90b3R5cGUgPSB7XG4gIF9fX3Jlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5fX19kaXJ0eSA9IGZhbHNlO1xuICAgIHNlbGYuX19fb2xkID0gbnVsbDtcbiAgICBzZWxmLl9fX2NoYW5nZXMgPSBudWxsO1xuICAgIHNlbGYuX19fZm9yY2VkID0gbnVsbDtcbiAgfSxcblxuICBfX19yZXBsYWNlOiBmdW5jdGlvbiAobmV3U3RhdGUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzO1xuICAgIHZhciBrZXk7XG5cbiAgICB2YXIgcmF3U3RhdGUgPSB0aGlzLl9fX3JhdztcblxuICAgIGZvciAoa2V5IGluIHJhd1N0YXRlKSB7XG4gICAgICBpZiAoIShrZXkgaW4gbmV3U3RhdGUpKSB7XG4gICAgICAgIHN0YXRlLl9fX3NldChcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgIGZhbHNlIC8qIGVuc3VyZTpmYWxzZSAqLyxcbiAgICAgICAgICBmYWxzZSAvKiBmb3JjZURpcnR5OmZhbHNlICovLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoa2V5IGluIG5ld1N0YXRlKSB7XG4gICAgICBzdGF0ZS5fX19zZXQoXG4gICAgICAgIGtleSxcbiAgICAgICAgbmV3U3RhdGVba2V5XSxcbiAgICAgICAgdHJ1ZSAvKiBlbnN1cmU6dHJ1ZSAqLyxcbiAgICAgICAgZmFsc2UgLyogZm9yY2VEaXJ0eTpmYWxzZSAqLyxcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICBfX19zZXQ6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgc2hvdWxkRW5zdXJlLCBmb3JjZURpcnR5KSB7XG4gICAgdmFyIHJhd1N0YXRlID0gdGhpcy5fX19yYXc7XG5cbiAgICBpZiAoc2hvdWxkRW5zdXJlKSB7XG4gICAgICBlbnN1cmUodGhpcywgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKGZvcmNlRGlydHkpIHtcbiAgICAgIHZhciBmb3JjZWREaXJ0eVN0YXRlID0gdGhpcy5fX19mb3JjZWQgfHwgKHRoaXMuX19fZm9yY2VkID0ge30pO1xuICAgICAgZm9yY2VkRGlydHlTdGF0ZVtuYW1lXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChyYXdTdGF0ZVtuYW1lXSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX19fZGlydHkpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgd2UgYXJlIG1vZGlmeWluZyB0aGUgY29tcG9uZW50IHN0YXRlXG4gICAgICAvLyBzbyBpbnRyb2R1Y2Ugc29tZSBwcm9wZXJ0aWVzIHRvIGRvIHNvbWUgdHJhY2tpbmcgb2ZcbiAgICAgIC8vIGNoYW5nZXMgdG8gdGhlIHN0YXRlXG4gICAgICB0aGlzLl9fX2RpcnR5ID0gdHJ1ZTsgLy8gTWFyayB0aGUgY29tcG9uZW50IHN0YXRlIGFzIGRpcnR5IChpLmUuIG1vZGlmaWVkKVxuICAgICAgdGhpcy5fX19vbGQgPSByYXdTdGF0ZTtcbiAgICAgIHRoaXMuX19fcmF3ID0gcmF3U3RhdGUgPSBleHRlbmQoe30sIHJhd1N0YXRlKTtcbiAgICAgIHRoaXMuX19fY2hhbmdlcyA9IHt9O1xuICAgICAgdGhpcy5fX19jb21wb25lbnQuX19fcXVldWVVcGRhdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fX2NoYW5nZXNbbmFtZV0gPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBEb24ndCBzdG9yZSBzdGF0ZSBwcm9wZXJ0aWVzIHdpdGggYW4gdW5kZWZpbmVkIG9yIG51bGwgdmFsdWVcbiAgICAgIGRlbGV0ZSByYXdTdGF0ZVtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBzdG9yZSB0aGUgbmV3IHZhbHVlIGluIHRoZSBjb21wb25lbnQgc3RhdGVcbiAgICAgIHJhd1N0YXRlW25hbWVdID0gdmFsdWU7XG4gICAgfVxuICB9LFxuICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19yYXc7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBqc2hpbnQgbmV3Y2FwOmZhbHNlICovXG5cbnZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL0NvbXBvbmVudFwiKTtcbnZhciBCYXNlU3RhdGUgPSByZXF1aXJlKFwiLi9TdGF0ZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVDb21wb25lbnQoZGVmLCByZW5kZXJlcikge1xuICBpZiAoZGVmLl9fX2lzQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIGRlZjtcbiAgfVxuXG4gIHZhciBDb21wb25lbnRDbGFzcyA9IGZ1bmN0aW9uICgpIHt9O1xuICB2YXIgcHJvdG87XG5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgZGVmO1xuXG4gIGlmICh0eXBlID09IFwiZnVuY3Rpb25cIikge1xuICAgIHByb3RvID0gZGVmLnByb3RvdHlwZTtcbiAgfSBlbHNlIGlmICh0eXBlID09IFwib2JqZWN0XCIpIHtcbiAgICBwcm90byA9IGRlZjtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgfVxuXG4gIENvbXBvbmVudENsYXNzLnByb3RvdHlwZSA9IHByb3RvO1xuXG4gIC8vIFdlIGRvbid0IHVzZSB0aGUgY29uc3RydWN0b3IgcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgLy8gc2luY2Ugd2UgZG9uJ3QgaW52b2tlIHRoZWlyIGNvbnN0cnVjdG9yIHVudGlsXG4gIC8vIHdlIGhhdmUgaGFkIGEgY2hhbmNlIHRvIGRvIG91ciBvd24gaW5pdGlhbGl6YXRpb24uXG4gIC8vIEluc3RlYWQsIHdlIHN0b3JlIHRoZWlyIGNvbnN0cnVjdG9yIGluIHRoZSBcImluaXRDb21wb25lbnRcIlxuICAvLyBwcm9wZXJ0eSBhbmQgdGhhdCBtZXRob2QgZ2V0cyBjYWxsZWQgbGF0ZXIgaW5zaWRlXG4gIC8vIGluaXQtY29tcG9uZW50cy1icm93c2VyLmpzXG4gIGZ1bmN0aW9uIENvbXBvbmVudChpZCkge1xuICAgIEJhc2VDb21wb25lbnQuY2FsbCh0aGlzLCBpZCk7XG4gIH1cblxuICBpZiAoIXByb3RvLl9fX2lzQ29tcG9uZW50KSB7XG4gICAgLy8gSW5oZXJpdCBmcm9tIENvbXBvbmVudCBpZiB0aGV5IGRpZG4ndCBhbHJlYWR5XG4gICAgaW5oZXJpdChDb21wb25lbnRDbGFzcywgQmFzZUNvbXBvbmVudCk7XG4gIH1cblxuICAvLyBUaGUgc2FtZSBwcm90b3R5cGUgd2lsbCBiZSB1c2VkIGJ5IG91ciBjb25zdHJ1Y3RvciBhZnRlclxuICAvLyB3ZSBoZSBoYXZlIHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluIHVzaW5nIHRoZSBpbmhlcml0IGZ1bmN0aW9uXG4gIHByb3RvID0gQ29tcG9uZW50LnByb3RvdHlwZSA9IENvbXBvbmVudENsYXNzLnByb3RvdHlwZTtcblxuICAvLyBwcm90by5jb25zdHJ1Y3RvciA9IGRlZi5jb25zdHJ1Y3RvciA9IENvbXBvbmVudDtcblxuICAvLyBTZXQgYSBmbGFnIG9uIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBtYWtlIGl0IGNsZWFyIHRoaXMgaXNcbiAgLy8gYSBjb21wb25lbnQgc28gdGhhdCB3ZSBjYW4gc2hvcnQtY2lyY3VpdCB0aGlzIHdvcmsgbGF0ZXJcbiAgQ29tcG9uZW50Ll9fX2lzQ29tcG9uZW50ID0gdHJ1ZTtcblxuICBmdW5jdGlvbiBTdGF0ZShjb21wb25lbnQpIHtcbiAgICBCYXNlU3RhdGUuY2FsbCh0aGlzLCBjb21wb25lbnQpO1xuICB9XG4gIGluaGVyaXQoU3RhdGUsIEJhc2VTdGF0ZSk7XG4gIHByb3RvLl9fX1N0YXRlID0gU3RhdGU7XG4gIHByb3RvLl9fX3JlbmRlcmVyID0gcmVuZGVyZXI7XG5cbiAgcmV0dXJuIENvbXBvbmVudDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgX19fdlByb3BzQnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX192RWxlbWVudEJ5RE9NTm9kZTogbmV3IFdlYWtNYXAoKSxcbiAgX19fY29tcG9uZW50QnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19kZXRhY2hlZEJ5RE9NTm9kZTogbmV3IFdlYWtNYXAoKSxcbiAgX19fa2V5QnlET01Ob2RlOiBuZXcgV2Vha01hcCgpLFxuICBfX19zc3JLZXllZEVsZW1lbnRzQnlDb21wb25lbnRJZDoge30sXG59O1xuIiwidmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgcnVudGltZUlkID0gY29tcG9uZW50c1V0aWwuX19fcnVudGltZUlkO1xudmFyIGNvbXBvbmVudExvb2t1cCA9IGNvbXBvbmVudHNVdGlsLl9fX2NvbXBvbmVudExvb2t1cDtcbnZhciBnZXRNYXJrb1Byb3BzRnJvbUVsID0gY29tcG9uZW50c1V0aWwuX19fZ2V0TWFya29Qcm9wc0Zyb21FbDtcblxudmFyIFRFWFRfTk9ERSA9IDM7XG5cbi8vIFdlIG1ha2Ugb3VyIGJlc3QgZWZmb3J0IHRvIGFsbG93IG11bHRpcGxlIG1hcmtvIHJ1bnRpbWVzIHRvIGJlIGxvYWRlZCBpbiB0aGVcbi8vIHNhbWUgd2luZG93LiBFYWNoIG1hcmtvIHJ1bnRpbWUgd2lsbCBnZXQgaXRzIG93biB1bmlxdWUgcnVudGltZSBJRC5cbnZhciBsaXN0ZW5lcnNBdHRhY2hlZEtleSA9IFwiJE1ERVwiICsgcnVudGltZUlkO1xudmFyIGRlbGVnYXRlZEV2ZW50cyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRFdmVudEZyb21FbChlbCwgZXZlbnROYW1lKSB7XG4gIHZhciB2aXJ0dWFsUHJvcHMgPSBnZXRNYXJrb1Byb3BzRnJvbUVsKGVsKTtcbiAgdmFyIGV2ZW50SW5mbyA9IHZpcnR1YWxQcm9wc1tldmVudE5hbWVdO1xuXG4gIGlmICh0eXBlb2YgZXZlbnRJbmZvID09PSBcInN0cmluZ1wiKSB7XG4gICAgZXZlbnRJbmZvID0gZXZlbnRJbmZvLnNwbGl0KFwiIFwiKTtcbiAgICBpZiAoZXZlbnRJbmZvWzJdKSB7XG4gICAgICBldmVudEluZm9bMl0gPSBldmVudEluZm9bMl0gPT09IFwidHJ1ZVwiO1xuICAgIH1cbiAgICBpZiAoZXZlbnRJbmZvLmxlbmd0aCA9PSA0KSB7XG4gICAgICBldmVudEluZm9bM10gPSBwYXJzZUludChldmVudEluZm9bM10sIDEwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXZlbnRJbmZvO1xufVxuXG5mdW5jdGlvbiBkZWxlZ2F0ZUV2ZW50KG5vZGUsIGV2ZW50TmFtZSwgdGFyZ2V0LCBldmVudCkge1xuICB2YXIgdGFyZ2V0TWV0aG9kID0gdGFyZ2V0WzBdO1xuICB2YXIgdGFyZ2V0Q29tcG9uZW50SWQgPSB0YXJnZXRbMV07XG4gIHZhciBpc09uY2UgPSB0YXJnZXRbMl07XG4gIHZhciBleHRyYUFyZ3MgPSB0YXJnZXRbM107XG5cbiAgaWYgKGlzT25jZSkge1xuICAgIHZhciB2aXJ0dWFsUHJvcHMgPSBnZXRNYXJrb1Byb3BzRnJvbUVsKG5vZGUpO1xuICAgIGRlbGV0ZSB2aXJ0dWFsUHJvcHNbZXZlbnROYW1lXTtcbiAgfVxuXG4gIHZhciB0YXJnZXRDb21wb25lbnQgPSBjb21wb25lbnRMb29rdXBbdGFyZ2V0Q29tcG9uZW50SWRdO1xuXG4gIGlmICghdGFyZ2V0Q29tcG9uZW50KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRhcmdldEZ1bmMgPVxuICAgIHR5cGVvZiB0YXJnZXRNZXRob2QgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyB0YXJnZXRNZXRob2RcbiAgICAgIDogdGFyZ2V0Q29tcG9uZW50W3RhcmdldE1ldGhvZF07XG4gIGlmICghdGFyZ2V0RnVuYykge1xuICAgIHRocm93IEVycm9yKFwiTWV0aG9kIG5vdCBmb3VuZDogXCIgKyB0YXJnZXRNZXRob2QpO1xuICB9XG5cbiAgaWYgKGV4dHJhQXJncyAhPSBudWxsKSB7XG4gICAgaWYgKHR5cGVvZiBleHRyYUFyZ3MgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGV4dHJhQXJncyA9IHRhcmdldENvbXBvbmVudC5fX19idWJibGluZ0RvbUV2ZW50c1tleHRyYUFyZ3NdO1xuICAgIH1cbiAgfVxuXG4gIC8vIEludm9rZSB0aGUgY29tcG9uZW50IG1ldGhvZFxuICBpZiAoZXh0cmFBcmdzKSB7XG4gICAgdGFyZ2V0RnVuYy5hcHBseSh0YXJnZXRDb21wb25lbnQsIGV4dHJhQXJncy5jb25jYXQoZXZlbnQsIG5vZGUpKTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXRGdW5jLmNhbGwodGFyZ2V0Q29tcG9uZW50LCBldmVudCwgbm9kZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyKGV2ZW50VHlwZSkge1xuICBpZiAoIWRlbGVnYXRlZEV2ZW50c1tldmVudFR5cGVdKSB7XG4gICAgZGVsZWdhdGVkRXZlbnRzW2V2ZW50VHlwZV0gPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZERlbGVnYXRlZEV2ZW50SGFuZGxlclRvSG9zdChldmVudFR5cGUsIGhvc3QpIHtcbiAgdmFyIGxpc3RlbmVycyA9IChob3N0W2xpc3RlbmVyc0F0dGFjaGVkS2V5XSA9XG4gICAgaG9zdFtsaXN0ZW5lcnNBdHRhY2hlZEtleV0gfHwge30pO1xuICBpZiAoIWxpc3RlbmVyc1tldmVudFR5cGVdKSB7XG4gICAgKGhvc3QuYm9keSB8fCBob3N0KS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgZXZlbnRUeXBlLFxuICAgICAgKGxpc3RlbmVyc1tldmVudFR5cGVdID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBjdXJOb2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoIWN1ck5vZGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJOb2RlID1cbiAgICAgICAgICAvLyBldmVudC50YXJnZXQgb2YgYW4gU1ZHRWxlbWVudEluc3RhbmNlIGRvZXMgbm90IGhhdmUgYVxuICAgICAgICAgIC8vIGBnZXRBdHRyaWJ1dGVgIGZ1bmN0aW9uIGluIElFIDExLlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFya28tanMvbWFya28vaXNzdWVzLzc5NlxuICAgICAgICAgIGN1ck5vZGUuY29ycmVzcG9uZGluZ1VzZUVsZW1lbnQgfHxcbiAgICAgICAgICAvLyBpbiBzb21lIGJyb3dzZXJzIHRoZSBldmVudCB0YXJnZXQgY2FuIGJlIGEgdGV4dCBub2RlXG4gICAgICAgICAgLy8gb25lIGV4YW1wbGUgYmVpbmcgZHJhZ2VudGVyIGluIGZpcmVmb3guXG4gICAgICAgICAgKGN1ck5vZGUubm9kZVR5cGUgPT09IFRFWFRfTk9ERSA/IGN1ck5vZGUucGFyZW50Tm9kZSA6IGN1ck5vZGUpO1xuXG4gICAgICAgIC8vIFNlYXJjaCB1cCB0aGUgdHJlZSBsb29raW5nIERPTSBldmVudHMgbWFwcGVkIHRvIHRhcmdldFxuICAgICAgICAvLyBjb21wb25lbnQgbWV0aG9kc1xuICAgICAgICB2YXIgcHJvcE5hbWUgPSBcIm9uXCIgKyBldmVudFR5cGU7XG4gICAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgICAgLy8gQXR0cmlidXRlcyB3aWxsIGhhdmUgdGhlIGZvbGxvd2luZyBmb3JtOlxuICAgICAgICAvLyBvbjxldmVudF90eXBlPihcIjx0YXJnZXRfbWV0aG9kPnw8Y29tcG9uZW50X2lkPlwiKVxuXG4gICAgICAgIGlmIChldmVudC5idWJibGVzKSB7XG4gICAgICAgICAgdmFyIHByb3BhZ2F0aW9uU3RvcHBlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgLy8gTW9ua2V5LXBhdGNoIHRvIGZpeCAjOTdcbiAgICAgICAgICB2YXIgb2xkU3RvcFByb3BhZ2F0aW9uID0gZXZlbnQuc3RvcFByb3BhZ2F0aW9uO1xuXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb2xkU3RvcFByb3BhZ2F0aW9uLmNhbGwoZXZlbnQpO1xuICAgICAgICAgICAgcHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKCh0YXJnZXQgPSBnZXRFdmVudEZyb21FbChjdXJOb2RlLCBwcm9wTmFtZSkpKSB7XG4gICAgICAgICAgICAgIGRlbGVnYXRlRXZlbnQoY3VyTm9kZSwgcHJvcE5hbWUsIHRhcmdldCwgZXZlbnQpO1xuXG4gICAgICAgICAgICAgIGlmIChwcm9wYWdhdGlvblN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gd2hpbGUgKChjdXJOb2RlID0gY3VyTm9kZS5wYXJlbnROb2RlKSAmJiBjdXJOb2RlLmdldEF0dHJpYnV0ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKHRhcmdldCA9IGdldEV2ZW50RnJvbUVsKGN1ck5vZGUsIHByb3BOYW1lKSkpIHtcbiAgICAgICAgICBkZWxlZ2F0ZUV2ZW50KGN1ck5vZGUsIHByb3BOYW1lLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0cnVlLFxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmV4cG9ydHMuX19faGFuZGxlTm9kZUF0dGFjaCA9IG5vb3A7XG5leHBvcnRzLl9fX2hhbmRsZU5vZGVEZXRhY2ggPSBub29wO1xuZXhwb3J0cy5fX19kZWxlZ2F0ZUV2ZW50ID0gZGVsZWdhdGVFdmVudDtcbmV4cG9ydHMuX19fZ2V0RXZlbnRGcm9tRWwgPSBnZXRFdmVudEZyb21FbDtcbmV4cG9ydHMuX19fYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyID0gYWRkRGVsZWdhdGVkRXZlbnRIYW5kbGVyO1xuZXhwb3J0cy5fX19pbml0ID0gZnVuY3Rpb24gKGhvc3QpIHtcbiAgT2JqZWN0LmtleXMoZGVsZWdhdGVkRXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudFR5cGUpIHtcbiAgICBhZGREZWxlZ2F0ZWRFdmVudEhhbmRsZXJUb0hvc3QoZXZlbnRUeXBlLCBob3N0KTtcbiAgfSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtcmVnaXN0cnlcIik7XG4iLCJ2YXIgY29weVByb3BzID0gcmVxdWlyZShcInJhcHRvci11dGlsL2NvcHlQcm9wc1wiKTtcbnZhciBiZWdpbkNvbXBvbmVudCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy1iZWdpbkNvbXBvbmVudFwiKTtcbnZhciBlbmRDb21wb25lbnQgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtZW5kQ29tcG9uZW50XCIpO1xudmFyIHJlZ2lzdHJ5ID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXJlZ2lzdHJ5XCIpO1xudmFyIGNvbXBvbmVudHNVdGlsID0gcmVxdWlyZShcIkBpbnRlcm5hbC9jb21wb25lbnRzLXV0aWxcIik7XG52YXIgY29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xuXG52YXIgQ29tcG9uZW50c0NvbnRleHQgPSByZXF1aXJlKFwiLi9Db21wb25lbnRzQ29udGV4dFwiKTtcbnZhciBnZXRDb21wb25lbnRzQ29udGV4dCA9IENvbXBvbmVudHNDb250ZXh0Ll9fX2dldENvbXBvbmVudHNDb250ZXh0O1xudmFyIGlzU2VydmVyID0gY29tcG9uZW50c1V0aWwuX19faXNTZXJ2ZXIgPT09IHRydWU7XG5cbnZhciBDT01QT05FTlRfQkVHSU5fQVNZTkNfQURERURfS0VZID0gXCIkd2FcIjtcblxuZnVuY3Rpb24gcmVzb2x2ZUNvbXBvbmVudEtleShrZXksIHBhcmVudENvbXBvbmVudERlZikge1xuICBpZiAoa2V5WzBdID09PSBcIiNcIikge1xuICAgIHJldHVybiBrZXkuc3Vic3RyaW5nKDEpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXJlbnRDb21wb25lbnREZWYuaWQgKyBcIi1cIiArIHBhcmVudENvbXBvbmVudERlZi5fX19uZXh0S2V5KGtleSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhY2tBc3luY0NvbXBvbmVudHMob3V0KSB7XG4gIGlmIChvdXQuaXNTeW5jKCkgfHwgb3V0Lmdsb2JhbFtDT01QT05FTlRfQkVHSU5fQVNZTkNfQURERURfS0VZXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG91dC5vbihcImJlZ2luQXN5bmNcIiwgaGFuZGxlQmVnaW5Bc3luYyk7XG4gIG91dC5vbihcImJlZ2luRGV0YWNoZWRBc3luY1wiLCBoYW5kbGVCZWdpbkRldGFjaGVkQXN5bmMpO1xuICBvdXQuZ2xvYmFsW0NPTVBPTkVOVF9CRUdJTl9BU1lOQ19BRERFRF9LRVldID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQmVnaW5Bc3luYyhldmVudCkge1xuICB2YXIgcGFyZW50T3V0ID0gZXZlbnQucGFyZW50T3V0O1xuICB2YXIgYXN5bmNPdXQgPSBldmVudC5vdXQ7XG4gIHZhciBjb21wb25lbnRzQ29udGV4dCA9IHBhcmVudE91dC5fX19jb21wb25lbnRzO1xuXG4gIGlmIChjb21wb25lbnRzQ29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gV2UgYXJlIGdvaW5nIHRvIHN0YXJ0IGEgbmVzdGVkIENvbXBvbmVudHNDb250ZXh0XG4gICAgYXN5bmNPdXQuX19fY29tcG9uZW50cyA9IG5ldyBDb21wb25lbnRzQ29udGV4dChhc3luY091dCwgY29tcG9uZW50c0NvbnRleHQpO1xuICB9XG4gIC8vIENhcnJ5IGFsb25nIHRoZSBjb21wb25lbnQgYXJndW1lbnRzXG4gIGFzeW5jT3V0LmMoXG4gICAgcGFyZW50T3V0Ll9fX2Fzc2lnbmVkQ29tcG9uZW50RGVmLFxuICAgIHBhcmVudE91dC5fX19hc3NpZ25lZEtleSxcbiAgICBwYXJlbnRPdXQuX19fYXNzaWduZWRDdXN0b21FdmVudHMsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJlZ2luRGV0YWNoZWRBc3luYyhldmVudCkge1xuICB2YXIgYXN5bmNPdXQgPSBldmVudC5vdXQ7XG4gIGhhbmRsZUJlZ2luQXN5bmMoZXZlbnQpO1xuICBhc3luY091dC5vbihcImJlZ2luQXN5bmNcIiwgaGFuZGxlQmVnaW5Bc3luYyk7XG4gIGFzeW5jT3V0Lm9uKFwiYmVnaW5EZXRhY2hlZEFzeW5jXCIsIGhhbmRsZUJlZ2luRGV0YWNoZWRBc3luYyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlbmRlcmVyRnVuYyhcbiAgdGVtcGxhdGVSZW5kZXJGdW5jLFxuICBjb21wb25lbnRQcm9wcyxcbiAgcmVuZGVyaW5nTG9naWMsXG4pIHtcbiAgdmFyIG9uSW5wdXQgPSByZW5kZXJpbmdMb2dpYyAmJiByZW5kZXJpbmdMb2dpYy5vbklucHV0O1xuICB2YXIgdHlwZU5hbWUgPSBjb21wb25lbnRQcm9wcy50O1xuICB2YXIgaXNTcGxpdCA9IGNvbXBvbmVudFByb3BzLnMgPT09IHRydWU7XG4gIHZhciBpc0ltcGxpY2l0Q29tcG9uZW50ID0gY29tcG9uZW50UHJvcHMuaSA9PT0gdHJ1ZTtcblxuICB2YXIgc2hvdWxkQXBwbHlTcGxpdE1peGlucyA9IHJlbmRlcmluZ0xvZ2ljICYmIGlzU3BsaXQ7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgaWYgKCFjb21wb25lbnRQcm9wcy5kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiQ29tcG9uZW50IHdhcyBjb21waWxlZCBpbiBhIGRpZmZlcmVudCBOT0RFX0VOViB0aGFuIHRoZSBNYXJrbyBydW50aW1lIGlzIHVzaW5nLlwiLFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY29tcG9uZW50UHJvcHMuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlJ1bnRpbWUvTk9ERV9FTlYgTWlzbWF0Y2hcIik7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gcmVuZGVyZXIoaW5wdXQsIG91dCkge1xuICAgIHRyYWNrQXN5bmNDb21wb25lbnRzKG91dCk7XG5cbiAgICB2YXIgY29tcG9uZW50c0NvbnRleHQgPSBnZXRDb21wb25lbnRzQ29udGV4dChvdXQpO1xuICAgIHZhciBnbG9iYWxDb21wb25lbnRzQ29udGV4dCA9IGNvbXBvbmVudHNDb250ZXh0Ll9fX2dsb2JhbENvbnRleHQ7XG5cbiAgICB2YXIgY29tcG9uZW50ID0gZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVyZW5kZXJDb21wb25lbnQ7XG4gICAgdmFyIGlzUmVyZW5kZXIgPSBjb21wb25lbnQgIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaWQ7XG4gICAgdmFyIGlzRXhpc3Rpbmc7XG4gICAgdmFyIGN1c3RvbUV2ZW50cztcbiAgICB2YXIgcGFyZW50Q29tcG9uZW50RGVmID0gY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmO1xuICAgIHZhciBvd25lckNvbXBvbmVudERlZiA9IG91dC5fX19hc3NpZ25lZENvbXBvbmVudERlZjtcbiAgICB2YXIgb3duZXJDb21wb25lbnRJZCA9IG93bmVyQ29tcG9uZW50RGVmICYmIG93bmVyQ29tcG9uZW50RGVmLmlkO1xuICAgIHZhciBrZXkgPSBvdXQuX19fYXNzaWduZWRLZXk7XG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAvLyBJZiBjb21wb25lbnQgaXMgcHJvdmlkZWQgdGhlbiB3ZSBhcmUgY3VycmVudGx5IHJlbmRlcmluZ1xuICAgICAgLy8gdGhlIHRvcC1sZXZlbCBVSSBjb21wb25lbnQgYXMgcGFydCBvZiBhIHJlLXJlbmRlclxuICAgICAgaWQgPSBjb21wb25lbnQuaWQ7IC8vIFdlIHdpbGwgdXNlIHRoZSBJRCBvZiB0aGUgY29tcG9uZW50IGJlaW5nIHJlLXJlbmRlcmVkXG4gICAgICBpc0V4aXN0aW5nID0gdHJ1ZTsgLy8gVGhpcyBpcyBhIHJlLXJlbmRlciBzbyB3ZSBrbm93IHRoZSBjb21wb25lbnQgaXMgYWxyZWFkeSBpbiB0aGUgRE9NXG4gICAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZXJlbmRlckNvbXBvbmVudCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgd2UgYXJlIHJlbmRlcmluZyBhIG5lc3RlZCBVSSBjb21wb25lbnQuIFdlIHdpbGwgbmVlZFxuICAgICAgLy8gdG8gbWF0Y2ggdXAgdGhlIFVJIGNvbXBvbmVudCB3aXRoIHRoZSBjb21wb25lbnQgYWxyZWFkeSBpbiB0aGVcbiAgICAgIC8vIERPTSAoaWYgYW55KSBzbyB3ZSB3aWxsIG5lZWQgdG8gcmVzb2x2ZSB0aGUgY29tcG9uZW50IElEIGZyb21cbiAgICAgIC8vIHRoZSBhc3NpZ25lZCBrZXkuIFdlIGFsc28gbmVlZCB0byBoYW5kbGUgYW55IGN1c3RvbSBldmVudCBiaW5kaW5nc1xuICAgICAgLy8gdGhhdCB3ZXJlIHByb3ZpZGVkLlxuICAgICAgaWYgKHBhcmVudENvbXBvbmVudERlZikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnY29tcG9uZW50QXJnczonLCBjb21wb25lbnRBcmdzKTtcbiAgICAgICAgY3VzdG9tRXZlbnRzID0gb3V0Ll9fX2Fzc2lnbmVkQ3VzdG9tRXZlbnRzO1xuXG4gICAgICAgIGlmIChrZXkgIT0gbnVsbCkge1xuICAgICAgICAgIGlkID0gcmVzb2x2ZUNvbXBvbmVudEtleShrZXkudG9TdHJpbmcoKSwgcGFyZW50Q29tcG9uZW50RGVmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZCA9IHBhcmVudENvbXBvbmVudERlZi5fX19uZXh0Q29tcG9uZW50SWQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWQgPSBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19uZXh0Q29tcG9uZW50SWQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNTZXJ2ZXIpIHtcbiAgICAgIC8vIElmIHdlIGFyZSByZW5kZXJpbmcgb24gdGhlIHNlcnZlciB0aGVuIHRoaW5ncyBhcmUgc2ltcGxpZXIgc2luY2VcbiAgICAgIC8vIHdlIGRvbid0IG5lZWQgdG8gbWF0Y2ggdXAgdGhlIFVJIGNvbXBvbmVudCB3aXRoIGEgcHJldmlvdXNseVxuICAgICAgLy8gcmVuZGVyZWQgY29tcG9uZW50IGFscmVhZHkgbW91bnRlZCB0byB0aGUgRE9NLiBXZSBhbHNvIGNyZWF0ZVxuICAgICAgLy8gYSBsaWdodHdlaWdodCBTZXJ2ZXJDb21wb25lbnRcbiAgICAgIGNvbXBvbmVudCA9IHJlZ2lzdHJ5Ll9fX2NyZWF0ZUNvbXBvbmVudChcbiAgICAgICAgcmVuZGVyaW5nTG9naWMsXG4gICAgICAgIGlkLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgb3V0LFxuICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgY3VzdG9tRXZlbnRzLFxuICAgICAgICBvd25lckNvbXBvbmVudElkLFxuICAgICAgKTtcblxuICAgICAgLy8gVGhpcyBpcyB0aGUgZmluYWwgaW5wdXQgYWZ0ZXIgcnVubmluZyB0aGUgbGlmZWN5Y2xlIG1ldGhvZHMuXG4gICAgICAvLyBXZSB3aWxsIGJlIHBhc3NpbmcgdGhlIGlucHV0IHRvIHRoZSB0ZW1wbGF0ZSBmb3IgdGhlIGBpbnB1dGAgcGFyYW1cbiAgICAgIGlucHV0ID0gY29tcG9uZW50Ll9fX3VwZGF0ZWRJbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzUmVyZW5kZXIgJiZcbiAgICAgICAgICAoY29tcG9uZW50ID0gY29tcG9uZW50TG9va3VwW2lkXSkgJiZcbiAgICAgICAgICBjb21wb25lbnQuX19fdHlwZSAhPT0gdHlwZU5hbWVcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gRGVzdHJveSB0aGUgZXhpc3RpbmcgY29tcG9uZW50IHNpbmNlXG4gICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICBjb21wb25lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgaXNFeGlzdGluZyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNFeGlzdGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vIFdlIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgICBjb21wb25lbnQgPSByZWdpc3RyeS5fX19jcmVhdGVDb21wb25lbnQodHlwZU5hbWUsIGlkKTtcblxuICAgICAgICAgIGlmIChzaG91bGRBcHBseVNwbGl0TWl4aW5zID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzaG91bGRBcHBseVNwbGl0TWl4aW5zID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciByZW5kZXJpbmdMb2dpY1Byb3BzID1cbiAgICAgICAgICAgICAgdHlwZW9mIHJlbmRlcmluZ0xvZ2ljID09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgID8gcmVuZGVyaW5nTG9naWMucHJvdG90eXBlXG4gICAgICAgICAgICAgICAgOiByZW5kZXJpbmdMb2dpYztcblxuICAgICAgICAgICAgY29weVByb3BzKHJlbmRlcmluZ0xvZ2ljUHJvcHMsIGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGlzIGZsYWcgdG8gcHJldmVudCB0aGUgY29tcG9uZW50IGZyb20gYmVpbmcgcXVldWVkIGZvciB1cGRhdGVcbiAgICAgICAgLy8gYmFzZWQgb24gdGhlIG5ldyBpbnB1dC4gVGhlIGNvbXBvbmVudCBpcyBhYm91dCB0byBiZSByZXJlbmRlcmVkXG4gICAgICAgIC8vIHNvIHdlIGRvbid0IHdhbnQgdG8gcXVldWUgaXQgdXAgYXMgYSByZXN1bHQgb2YgY2FsbGluZyBgc2V0SW5wdXQoKWBcbiAgICAgICAgY29tcG9uZW50Ll9fX3VwZGF0ZVF1ZXVlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGN1c3RvbUV2ZW50cykge1xuICAgICAgICAgIGNvbXBvbmVudC5fX19zZXRDdXN0b21FdmVudHMoY3VzdG9tRXZlbnRzLCBvd25lckNvbXBvbmVudElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0V4aXN0aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgIGNvbXBvbmVudC5fX19lbWl0Q3JlYXRlKGlucHV0LCBvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5wdXQgPSBjb21wb25lbnQuX19fc2V0SW5wdXQoaW5wdXQsIG9uSW5wdXQsIG91dCk7XG5cbiAgICAgICAgaWYgKGlzRXhpc3RpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjb21wb25lbnQuX19faXNEaXJ0eSA9PT0gZmFsc2UgfHxcbiAgICAgICAgICAgIGNvbXBvbmVudC5zaG91bGRVcGRhdGUoaW5wdXQsIGNvbXBvbmVudC5fX19zdGF0ZSkgPT09IGZhbHNlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBXZSBwdXQgYSBwbGFjZWhvbGRlciBlbGVtZW50IGluIHRoZSBvdXRwdXQgc3RyZWFtIHRvIGVuc3VyZSB0aGF0IHRoZSBleGlzdGluZ1xuICAgICAgICAgICAgLy8gRE9NIG5vZGUgaXMgbWF0Y2hlZCB1cCBjb3JyZWN0bHkgd2hlbiB1c2luZyBtb3JwaGRvbS4gV2UgZmxhZyB0aGUgVkVsZW1lbnRcbiAgICAgICAgICAgIC8vIG5vZGUgdG8gdHJhY2sgdGhhdCBpdCBpcyBhIHByZXNlcnZlIG1hcmtlclxuICAgICAgICAgICAgb3V0Ll9fX3ByZXNlcnZlQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW2lkXSA9IHRydWU7XG4gICAgICAgICAgICBjb21wb25lbnQuX19fcmVzZXQoKTsgLy8gVGhlIGNvbXBvbmVudCBpcyBubyBsb25nZXIgZGlydHkgc28gcmVzZXQgaW50ZXJuYWwgZmxhZ3NcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50Ll9fX2dsb2JhbCA9IG91dC5nbG9iYWw7XG4gICAgICBjb21wb25lbnQuX19fZW1pdFJlbmRlcihvdXQpO1xuICAgIH1cblxuICAgIHZhciBjb21wb25lbnREZWYgPSBiZWdpbkNvbXBvbmVudChcbiAgICAgIGNvbXBvbmVudHNDb250ZXh0LFxuICAgICAgY29tcG9uZW50LFxuICAgICAga2V5LFxuICAgICAgb3duZXJDb21wb25lbnREZWYsXG4gICAgICBpc1NwbGl0LFxuICAgICAgaXNJbXBsaWNpdENvbXBvbmVudCxcbiAgICApO1xuXG4gICAgY29tcG9uZW50RGVmLl9fX2lzRXhpc3RpbmcgPSBpc0V4aXN0aW5nO1xuXG4gICAgLy8gUmVuZGVyIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhlIGNvbXBvbmVudCB1c2luZyB0aGUgZmluYWwgdGVtcGxhdGVcbiAgICAvLyBkYXRhIHRoYXQgd2UgY29uc3RydWN0ZWRcbiAgICB0ZW1wbGF0ZVJlbmRlckZ1bmMoXG4gICAgICBpbnB1dCxcbiAgICAgIG91dCxcbiAgICAgIGNvbXBvbmVudERlZixcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIGNvbXBvbmVudC5fX19yYXdTdGF0ZSxcbiAgICAgIG91dC5nbG9iYWwsXG4gICAgKTtcblxuICAgIGVuZENvbXBvbmVudChvdXQsIGNvbXBvbmVudERlZik7XG4gICAgY29tcG9uZW50c0NvbnRleHQuX19fY29tcG9uZW50RGVmID0gcGFyZW50Q29tcG9uZW50RGVmO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVJlbmRlcmVyRnVuYztcblxuLy8gZXhwb3J0cyB1c2VkIGJ5IHRoZSBsZWdhY3kgcmVuZGVyZXJcbmNyZWF0ZVJlbmRlcmVyRnVuYy5fX19yZXNvbHZlQ29tcG9uZW50S2V5ID0gcmVzb2x2ZUNvbXBvbmVudEtleTtcbmNyZWF0ZVJlbmRlcmVyRnVuYy5fX190cmFja0FzeW5jQ29tcG9uZW50cyA9IHRyYWNrQXN5bmNDb21wb25lbnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB1cGRhdGVzU2NoZWR1bGVkID0gZmFsc2U7XG52YXIgYmF0Y2hTdGFjayA9IFtdOyAvLyBBIHN0YWNrIG9mIGJhdGNoZWQgdXBkYXRlc1xudmFyIHVuYmF0Y2hlZFF1ZXVlID0gW107IC8vIFVzZWQgZm9yIHNjaGVkdWxlZCBiYXRjaGVkIHVwZGF0ZXNcblxudmFyIHNldEltbWVkaWF0ZSA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvc2V0LWltbWVkaWF0ZVwiKS5fX19zZXRJbW1lZGlhdGU7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB3ZSBzY2hlZHVsZSB0aGUgdXBkYXRlIG9mIFwidW5iYXRjaGVkXCJcbiAqIHVwZGF0ZXMgdG8gY29tcG9uZW50cy5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlVW5iYXRjaGVkQ29tcG9uZW50cygpIHtcbiAgaWYgKHVuYmF0Y2hlZFF1ZXVlLmxlbmd0aCkge1xuICAgIHRyeSB7XG4gICAgICB1cGRhdGVDb21wb25lbnRzKHVuYmF0Y2hlZFF1ZXVlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gUmVzZXQgdGhlIGZsYWcgbm93IHRoYXQgdGhpcyBzY2hlZHVsZWQgYmF0Y2ggdXBkYXRlXG4gICAgICAvLyBpcyBjb21wbGV0ZSBzbyB0aGF0IHdlIGNhbiBsYXRlciBzY2hlZHVsZSBhbm90aGVyXG4gICAgICAvLyBiYXRjaGVkIHVwZGF0ZSBpZiBuZWVkZWRcbiAgICAgIHVwZGF0ZXNTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVVcGRhdGVzKCkge1xuICBpZiAodXBkYXRlc1NjaGVkdWxlZCkge1xuICAgIC8vIFdlIGhhdmUgYWxyZWFkeSBzY2hlZHVsZWQgYSBiYXRjaGVkIHVwZGF0ZSBmb3IgdGhlXG4gICAgLy8gbmV4dFRpY2sgc28gbm90aGluZyB0byBkb1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHVwZGF0ZXNTY2hlZHVsZWQgPSB0cnVlO1xuXG4gIHNldEltbWVkaWF0ZSh1cGRhdGVVbmJhdGNoZWRDb21wb25lbnRzKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50cyhxdWV1ZSkge1xuICAvLyBMb29wIG92ZXIgdGhlIGNvbXBvbmVudHMgaW4gdGhlIHF1ZXVlIGFuZCB1cGRhdGUgdGhlbS5cbiAgLy8gTk9URTogSXQgaXMgb2theSBpZiB0aGUgcXVldWUgZ3Jvd3MgZHVyaW5nIHRoZSBpdGVyYXRpb25cbiAgLy8gICAgICAgc2luY2Ugd2Ugd2lsbCBzdGlsbCBnZXQgdG8gdGhlbSBhdCB0aGUgZW5kXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY29tcG9uZW50ID0gcXVldWVbaV07XG4gICAgY29tcG9uZW50Ll9fX3VwZGF0ZSgpOyAvLyBEbyB0aGUgYWN0dWFsIGNvbXBvbmVudCB1cGRhdGVcbiAgfVxuXG4gIC8vIENsZWFyIG91dCB0aGUgcXVldWUgYnkgc2V0dGluZyB0aGUgbGVuZ3RoIHRvIHplcm9cbiAgcXVldWUubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gYmF0Y2hVcGRhdGUoZnVuYykge1xuICAvLyBJZiB0aGUgYmF0Y2hlZCB1cGRhdGUgc3RhY2sgaXMgZW1wdHkgdGhlbiB0aGlzXG4gIC8vIGlzIHRoZSBvdXRlciBiYXRjaGVkIHVwZGF0ZS4gQWZ0ZXIgdGhlIG91dGVyXG4gIC8vIGJhdGNoZWQgdXBkYXRlIGNvbXBsZXRlcyB3ZSBpbnZva2UgdGhlIFwiYWZ0ZXJVcGRhdGVcIlxuICAvLyBldmVudCBsaXN0ZW5lcnMuXG4gIHZhciBiYXRjaCA9IFtdO1xuXG4gIGJhdGNoU3RhY2sucHVzaChiYXRjaCk7XG5cbiAgdHJ5IHtcbiAgICBmdW5jKCk7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFVwZGF0ZSBhbGwgb2YgdGhlIGNvbXBvbmVudHMgdGhhdCB3aGVyZSBxdWV1ZWQgdXBcbiAgICAgIC8vIGluIHRoaXMgYmF0Y2ggKGlmIGFueSlcbiAgICAgIHVwZGF0ZUNvbXBvbmVudHMoYmF0Y2gpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIGNvbXBsZXRlZCB0aGUgdXBkYXRlIG9mIGFsbCB0aGUgY29tcG9uZW50c1xuICAgICAgLy8gaW4gdGhpcyBiYXRjaCB3ZSBuZWVkIHRvIHJlbW92ZSBpdCBvZmYgdGhlIHRvcCBvZiB0aGUgc3RhY2tcbiAgICAgIGJhdGNoU3RhY2subGVuZ3RoLS07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1ZXVlQ29tcG9uZW50VXBkYXRlKGNvbXBvbmVudCkge1xuICB2YXIgYmF0Y2hTdGFja0xlbiA9IGJhdGNoU3RhY2subGVuZ3RoO1xuXG4gIGlmIChiYXRjaFN0YWNrTGVuKSB7XG4gICAgLy8gV2hlbiBhIGJhdGNoIHVwZGF0ZSBpcyBzdGFydGVkIHdlIHB1c2ggYSBuZXcgYmF0Y2ggb24gdG8gYSBzdGFjay5cbiAgICAvLyBJZiB0aGUgc3RhY2sgaGFzIGEgbm9uLXplcm8gbGVuZ3RoIHRoZW4gd2Uga25vdyB0aGF0IGEgYmF0Y2ggaGFzXG4gICAgLy8gYmVlbiBzdGFydGVkIHNvIHdlIGNhbiBqdXN0IHF1ZXVlIHRoZSBjb21wb25lbnQgb24gdGhlIHRvcCBiYXRjaC4gV2hlblxuICAgIC8vIHRoZSBiYXRjaCBpcyBlbmRlZCB0aGlzIGNvbXBvbmVudCB3aWxsIGJlIHVwZGF0ZWQuXG4gICAgYmF0Y2hTdGFja1tiYXRjaFN0YWNrTGVuIC0gMV0ucHVzaChjb21wb25lbnQpO1xuICB9IGVsc2Uge1xuICAgIC8vIFdlIGFyZSBub3Qgd2l0aGluIGEgYmF0Y2hlZCB1cGRhdGUuIFdlIG5lZWQgdG8gc2NoZWR1bGUgYSBiYXRjaCB1cGRhdGVcbiAgICAvLyBmb3IgdGhlIG5leHRUaWNrIChpZiB0aGF0IGhhc24ndCBiZWVuIGRvbmUgYWxyZWFkeSkgYW5kIHdlIHdpbGxcbiAgICAvLyBhZGQgdGhlIGNvbXBvbmVudCB0byB0aGUgdW5iYXRjaGVkIHF1ZXVlXG4gICAgc2NoZWR1bGVVcGRhdGVzKCk7XG4gICAgdW5iYXRjaGVkUXVldWUucHVzaChjb21wb25lbnQpO1xuICB9XG59XG5cbmV4cG9ydHMuX19fcXVldWVDb21wb25lbnRVcGRhdGUgPSBxdWV1ZUNvbXBvbmVudFVwZGF0ZTtcbmV4cG9ydHMuX19fYmF0Y2hVcGRhdGUgPSBiYXRjaFVwZGF0ZTtcbiIsInZhciBhY3R1YWxDcmVhdGVPdXQ7XG5cbmZ1bmN0aW9uIHNldENyZWF0ZU91dChjcmVhdGVPdXRGdW5jKSB7XG4gIGFjdHVhbENyZWF0ZU91dCA9IGNyZWF0ZU91dEZ1bmM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU91dChnbG9iYWxEYXRhKSB7XG4gIHJldHVybiBhY3R1YWxDcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG59XG5cbmNyZWF0ZU91dC5fX19zZXRDcmVhdGVPdXQgPSBzZXRDcmVhdGVPdXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlT3V0O1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG52YXIgY29tcG9uZW50c1V0aWwgPSByZXF1aXJlKFwiQGludGVybmFsL2NvbXBvbmVudHMtdXRpbFwiKTtcbnZhciBkZXN0cm95Q29tcG9uZW50Rm9yTm9kZSA9IGNvbXBvbmVudHNVdGlsLl9fX2Rlc3Ryb3lDb21wb25lbnRGb3JOb2RlO1xudmFyIGRlc3Ryb3lOb2RlUmVjdXJzaXZlID0gY29tcG9uZW50c1V0aWwuX19fZGVzdHJveU5vZGVSZWN1cnNpdmU7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuL3Zkb20vbW9ycGhkb20vaGVscGVyc1wiKTtcblxudmFyIGluc2VydEJlZm9yZSA9IGhlbHBlcnMuX19faW5zZXJ0QmVmb3JlO1xudmFyIGluc2VydEFmdGVyID0gaGVscGVycy5fX19pbnNlcnRBZnRlcjtcbnZhciByZW1vdmVDaGlsZCA9IGhlbHBlcnMuX19fcmVtb3ZlQ2hpbGQ7XG5cbmZ1bmN0aW9uIHJlc29sdmVFbChlbCkge1xuICBpZiAodHlwZW9mIGVsID09IFwic3RyaW5nXCIpIHtcbiAgICB2YXIgZWxJZCA9IGVsO1xuICAgIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxJZCk7XG4gICAgaWYgKCFlbCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJOb3QgZm91bmQ6IFwiICsgZWxJZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gYmVmb3JlUmVtb3ZlKHJlZmVyZW5jZUVsKSB7XG4gIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKHJlZmVyZW5jZUVsKTtcbiAgZGVzdHJveUNvbXBvbmVudEZvck5vZGUocmVmZXJlbmNlRWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIGdldEVsLCBhZnRlckluc2VydCkge1xuICBleHRlbmQodGFyZ2V0LCB7XG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCBudWxsLCByZWZlcmVuY2VFbCk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgcHJlcGVuZFRvOiBmdW5jdGlvbiAocmVmZXJlbmNlRWwpIHtcbiAgICAgIHJlZmVyZW5jZUVsID0gcmVzb2x2ZUVsKHJlZmVyZW5jZUVsKTtcbiAgICAgIHZhciBlbCA9IGdldEVsKHRoaXMsIHJlZmVyZW5jZUVsKTtcbiAgICAgIGluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlRWwuZmlyc3RDaGlsZCB8fCBudWxsLCByZWZlcmVuY2VFbCk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgcmVwbGFjZTogZnVuY3Rpb24gKHJlZmVyZW5jZUVsKSB7XG4gICAgICByZWZlcmVuY2VFbCA9IHJlc29sdmVFbChyZWZlcmVuY2VFbCk7XG4gICAgICB2YXIgZWwgPSBnZXRFbCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgICBiZWZvcmVSZW1vdmUocmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VFbCwgcmVmZXJlbmNlRWwucGFyZW50Tm9kZSk7XG4gICAgICByZW1vdmVDaGlsZChyZWZlcmVuY2VFbCk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgcmVwbGFjZUNoaWxkcmVuT2Y6IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuXG4gICAgICB2YXIgY3VyQ2hpbGQgPSByZWZlcmVuY2VFbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nOyAvLyBKdXN0IGluIGNhc2UgdGhlIERPTSBjaGFuZ2VzIHdoaWxlIHJlbW92aW5nXG4gICAgICAgIGJlZm9yZVJlbW92ZShjdXJDaGlsZCk7XG4gICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIHJlZmVyZW5jZUVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICBpbnNlcnRCZWZvcmUoZWwsIG51bGwsIHJlZmVyZW5jZUVsKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VFbCwgcmVmZXJlbmNlRWwucGFyZW50Tm9kZSk7XG4gICAgICByZXR1cm4gYWZ0ZXJJbnNlcnQodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgIH0sXG4gICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uIChyZWZlcmVuY2VFbCkge1xuICAgICAgcmVmZXJlbmNlRWwgPSByZXNvbHZlRWwocmVmZXJlbmNlRWwpO1xuICAgICAgdmFyIGVsID0gZ2V0RWwodGhpcywgcmVmZXJlbmNlRWwpO1xuICAgICAgaW5zZXJ0QWZ0ZXIoZWwsIHJlZmVyZW5jZUVsLCByZWZlcmVuY2VFbC5wYXJlbnROb2RlKTtcbiAgICAgIHJldHVybiBhZnRlckluc2VydCh0aGlzLCByZWZlcmVuY2VFbCk7XG4gICAgfSxcbiAgfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjYW1lbFRvRGFzaExvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG52YXIgZGFzaFRvQ2FtZWxMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAqIEhlbHBlciBmb3IgY29udmVydGluZyBjYW1lbENhc2UgdG8gZGFzaC1jYXNlLlxuICovXG5leHBvcnRzLl9fX2NhbWVsVG9EYXNoQ2FzZSA9IGZ1bmN0aW9uIGNhbWVsVG9EYXNoQ2FzZShuYW1lKSB7XG4gIHZhciBuYW1lRGFzaGVkID0gY2FtZWxUb0Rhc2hMb29rdXBbbmFtZV07XG4gIGlmICghbmFtZURhc2hlZCkge1xuICAgIG5hbWVEYXNoZWQgPSBjYW1lbFRvRGFzaExvb2t1cFtuYW1lXSA9IG5hbWVcbiAgICAgIC5yZXBsYWNlKC8oW0EtWl0pL2csIFwiLSQxXCIpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChuYW1lRGFzaGVkICE9PSBuYW1lKSB7XG4gICAgICBkYXNoVG9DYW1lbExvb2t1cFtuYW1lRGFzaGVkXSA9IG5hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWVEYXNoZWQ7XG59O1xuXG4vKipcbiAqIEhlbHBlciBmb3IgY29udmVydGluZyBkYXNoLWNhc2UgdG8gY2FtZWxDYXNlLlxuICovXG5leHBvcnRzLl9fX2Rhc2hUb0NhbWVsQ2FzZSA9IGZ1bmN0aW9uIGRhc2hUb0NhbWVsQ2FzZShuYW1lKSB7XG4gIHZhciBuYW1lQ2FtZWwgPSBkYXNoVG9DYW1lbExvb2t1cFtuYW1lXTtcbiAgaWYgKCFuYW1lQ2FtZWwpIHtcbiAgICBuYW1lQ2FtZWwgPSBkYXNoVG9DYW1lbExvb2t1cFtuYW1lXSA9IG5hbWUucmVwbGFjZShcbiAgICAgIC8tKFthLXpdKS9nLFxuICAgICAgbWF0Y2hUb1VwcGVyQ2FzZSxcbiAgICApO1xuXG4gICAgaWYgKG5hbWVDYW1lbCAhPT0gbmFtZSkge1xuICAgICAgY2FtZWxUb0Rhc2hMb29rdXBbbmFtZUNhbWVsXSA9IG5hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWVDYW1lbDtcbn07XG5cbmZ1bmN0aW9uIG1hdGNoVG9VcHBlckNhc2UoXywgY2hhcikge1xuICByZXR1cm4gY2hhci50b1VwcGVyQ2FzZSgpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xhc3NIZWxwZXIoYXJnKSB7XG4gIHN3aXRjaCAodHlwZW9mIGFyZykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBhcmcgfHwgdW5kZWZpbmVkO1xuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgICAgdmFyIHNlcCA9IFwiXCI7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNsYXNzSGVscGVyKGFyZ1tpXSk7XG4gICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc2VwICsgdmFsdWU7XG4gICAgICAgICAgICBzZXAgPSBcIiBcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhcmcpIHtcbiAgICAgICAgICBpZiAoYXJnW2tleV0pIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzZXAgKyBrZXk7XG4gICAgICAgICAgICBzZXAgPSBcIiBcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdCB8fCB1bmRlZmluZWQ7XG4gIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNoYW5nZUNhc2UgPSByZXF1aXJlKFwiLi9fY2hhbmdlLWNhc2VcIik7XG5cbi8qKlxuICogSGVscGVyIGZvciBnZW5lcmF0aW5nIHRoZSBzdHJpbmcgZm9yIGEgc3R5bGUgYXR0cmlidXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGVIZWxwZXIoc3R5bGUpIHtcbiAgaWYgKCFzdHlsZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN0eWxlO1xuXG4gIGlmICh0eXBlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdmFyIHN0eWxlcyA9IFwiXCI7XG4gICAgdmFyIHNlcCA9IFwiXCI7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdHlsZSkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHlsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YXIgbmV4dCA9IHN0eWxlSGVscGVyKHN0eWxlW2ldKTtcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICBzdHlsZXMgKz0gc2VwICsgbmV4dDtcbiAgICAgICAgICBzZXAgPSBcIjtcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBzdHlsZSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBzdHlsZVtuYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiB2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgKz0gXCJweFwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0eWxlcyArPSBzZXAgKyBjaGFuZ2VDYXNlLl9fX2NhbWVsVG9EYXNoQ2FzZShuYW1lKSArIFwiOlwiICsgdmFsdWU7XG4gICAgICAgICAgc2VwID0gXCI7XCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVzIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBzdHlsZTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG52YXIgc2V0SW1tZWRpYXRlID0gcmVxdWlyZShcIkBpbnRlcm5hbC9zZXQtaW1tZWRpYXRlXCIpLl9fX3NldEltbWVkaWF0ZTtcbnZhciBkZWZhdWx0Q3JlYXRlT3V0ID0gcmVxdWlyZShcIi4vY3JlYXRlT3V0XCIpO1xuXG5mdW5jdGlvbiBzYWZlUmVuZGVyKHJlbmRlckZ1bmMsIGZpbmFsRGF0YSwgZmluYWxPdXQsIHNob3VsZEVuZCkge1xuICB0cnkge1xuICAgIHJlbmRlckZ1bmMoZmluYWxEYXRhLCBmaW5hbE91dCk7XG5cbiAgICBpZiAoc2hvdWxkRW5kKSB7XG4gICAgICBmaW5hbE91dC5lbmQoKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHZhciBhY3R1YWxFbmQgPSBmaW5hbE91dC5lbmQ7XG4gICAgZmluYWxPdXQuZW5kID0gZnVuY3Rpb24gKCkge307XG5cbiAgICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgZmluYWxPdXQuZW5kID0gYWN0dWFsRW5kO1xuICAgICAgZmluYWxPdXQuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZmluYWxPdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgcmVuZGVyZXIpIHtcbiAgdmFyIHJlbmRlckZ1bmMgPVxuICAgIHJlbmRlcmVyICYmIChyZW5kZXJlci5yZW5kZXJlciB8fCByZW5kZXJlci5yZW5kZXIgfHwgcmVuZGVyZXIpO1xuICB2YXIgY3JlYXRlT3V0ID0gdGFyZ2V0LmNyZWF0ZU91dCB8fCByZW5kZXJlci5jcmVhdGVPdXQgfHwgZGVmYXVsdENyZWF0ZU91dDtcblxuICByZXR1cm4gZXh0ZW5kKHRhcmdldCwge1xuICAgIF86IHJlbmRlckZ1bmMsXG4gICAgY3JlYXRlT3V0OiBjcmVhdGVPdXQsXG5cbiAgICByZW5kZXJUb1N0cmluZzogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgbG9jYWxEYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgIHZhciByZW5kZXIgPSByZW5kZXJGdW5jIHx8IHRoaXMuXztcbiAgICAgIHZhciBnbG9iYWxEYXRhID0gbG9jYWxEYXRhLiRnbG9iYWw7XG4gICAgICB2YXIgb3V0ID0gY3JlYXRlT3V0KGdsb2JhbERhdGEpO1xuXG4gICAgICBvdXQuZ2xvYmFsLnRlbXBsYXRlID0gdGhpcztcblxuICAgICAgaWYgKGdsb2JhbERhdGEpIHtcbiAgICAgICAgbG9jYWxEYXRhLiRnbG9iYWwgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBvdXRcbiAgICAgICAgICAub24oXCJmaW5pc2hcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgb3V0LnRvU3RyaW5nKCksIG91dCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub25jZShcImVycm9yXCIsIGNhbGxiYWNrKTtcblxuICAgICAgICByZXR1cm4gc2FmZVJlbmRlcihyZW5kZXIsIGxvY2FsRGF0YSwgb3V0LCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dC5zeW5jKCk7XG4gICAgICAgIHJlbmRlcihsb2NhbERhdGEsIG91dCk7XG4gICAgICAgIHJldHVybiBvdXQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyU3luYzogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBsb2NhbERhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgdmFyIHJlbmRlciA9IHJlbmRlckZ1bmMgfHwgdGhpcy5fO1xuICAgICAgdmFyIGdsb2JhbERhdGEgPSBsb2NhbERhdGEuJGdsb2JhbDtcbiAgICAgIHZhciBvdXQgPSBjcmVhdGVPdXQoZ2xvYmFsRGF0YSk7XG4gICAgICBvdXQuc3luYygpO1xuXG4gICAgICBvdXQuZ2xvYmFsLnRlbXBsYXRlID0gdGhpcztcblxuICAgICAgaWYgKGdsb2JhbERhdGEpIHtcbiAgICAgICAgbG9jYWxEYXRhLiRnbG9iYWwgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcihsb2NhbERhdGEsIG91dCk7XG4gICAgICByZXR1cm4gb3V0Ll9fX2dldFJlc3VsdCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIGEgdGVtcGxhdGUgdG8gbm9kZXMgYW5kIGluc2VydHMgdGhlbSBpbnRvIHRoZSBET00gcmVsYXRpdmVcbiAgICAgKiB0byB0aGUgcHJvdmlkZWQgcmVmZXJlbmNlIGJhc2VkIG9uIHRoZSBvcHRpb25hbCBwb3NpdGlvbiBwYXJhbWV0ZXIuXG4gICAgICpcbiAgICAgKiBTdXBwb3J0ZWQgc2lnbmF0dXJlczpcbiAgICAgKlxuICAgICAqIG1vdW50KGRhdGEsIHJlZmVyZW5jZSlcbiAgICAgKiBtb3VudChkYXRhLCByZWZlcmVuY2UsIHBvc2l0aW9uKVxuICAgICAqXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBkYXRhIFRoZSB2aWV3IG1vZGVsIGRhdGEgZm9yIHRoZSB0ZW1wbGF0ZVxuICAgICAqIEBwYXJhbSAge05vZGV9IHJlZmVyZW5jZSBET00gbm9kZSB0byBpbnNlcnQgdGhlIHJlbmRlcmVkIG5vZGUocykgcmVsYXRpdmUgdG9cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IFtwb3NpdGlvbl0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgYHJlZmVyZW5jZWA7IG11c3QgbWF0Y2ggKGNhc2UtaW5zZW5zaXRpdmVseSkgb25lIG9mIHRoZSBmb2xsb3dpbmcgc3RyaW5nczpcbiAgICAgKiAgJ2JlZm9yZWJlZ2luJzogQmVmb3JlIHRoZSB0YXJnZXRFbGVtZW50IGl0c2VsZi5cbiAgICAgKiAgJ2FmdGVyYmVnaW4nOiBKdXN0IGluc2lkZSB0aGUgdGFyZ2V0RWxlbWVudCwgYmVmb3JlIGl0cyBmaXJzdCBjaGlsZC5cbiAgICAgKiAgJ2JlZm9yZWVuZCc6IEp1c3QgaW5zaWRlIHRoZSB0YXJnZXRFbGVtZW50LCBhZnRlciBpdHMgbGFzdCBjaGlsZC5cbiAgICAgKiAgJ2FmdGVyZW5kJzogQWZ0ZXIgdGhlIHRhcmdldEVsZW1lbnQgaXRzZWxmLlxuICAgICAqIEByZXR1cm4ge1RlbXBsYXRlSW5zdGFuY2V9IE9iamVjdCB3aXRoIGB1cGRhdGVgIGFuZCBgZGlzcG9zZWAgbWV0aG9kc1xuICAgICAqL1xuICAgIG1vdW50OiBmdW5jdGlvbiAoZGF0YSwgcmVmZXJlbmNlLCBwb3NpdGlvbikge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5yZW5kZXJTeW5jKGRhdGEpO1xuXG4gICAgICBzd2l0Y2ggKHBvc2l0aW9uKSB7XG4gICAgICAgIGNhc2UgXCJhZnRlcmJlZ2luXCI6XG4gICAgICAgICAgcmVzdWx0LnByZXBlbmRUbyhyZWZlcmVuY2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYWZ0ZXJlbmRcIjpcbiAgICAgICAgICByZXN1bHQuaW5zZXJ0QWZ0ZXIocmVmZXJlbmNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJlZm9yZWJlZ2luXCI6XG4gICAgICAgICAgcmVzdWx0Lmluc2VydEJlZm9yZShyZWZlcmVuY2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJlc3VsdC5hcHBlbmRUbyhyZWZlcmVuY2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSByZXN1bHQuZ2V0Q29tcG9uZW50KCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVwZGF0ZShpbnB1dCkge1xuICAgICAgICAgIGNvbXBvbmVudC5pbnB1dCA9IGlucHV0O1xuICAgICAgICAgIGNvbXBvbmVudC51cGRhdGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICBjb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyBhIHRlbXBsYXRlIHRvIGVpdGhlciBhIHN0cmVhbSAoaWYgdGhlIGxhc3RcbiAgICAgKiBhcmd1bWVudCBpcyBhIFN0cmVhbSBpbnN0YW5jZSkgb3JcbiAgICAgKiBwcm92aWRlcyB0aGUgb3V0cHV0IHRvIGEgY2FsbGJhY2sgZnVuY3Rpb24gKGlmIHRoZSBsYXN0XG4gICAgICogYXJndW1lbnQgaXMgYSBGdW5jdGlvbikuXG4gICAgICpcbiAgICAgKiBTdXBwb3J0ZWQgc2lnbmF0dXJlczpcbiAgICAgKlxuICAgICAqIHJlbmRlcihkYXRhKVxuICAgICAqIHJlbmRlcihkYXRhLCBvdXQpXG4gICAgICogcmVuZGVyKGRhdGEsIHN0cmVhbSlcbiAgICAgKiByZW5kZXIoZGF0YSwgY2FsbGJhY2spXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgVGhlIHZpZXcgbW9kZWwgZGF0YSBmb3IgdGhlIHRlbXBsYXRlXG4gICAgICogQHBhcmFtICB7QXN5bmNTdHJlYW0vQXN5bmNWRE9NQnVpbGRlcn0gb3V0IEEgU3RyZWFtLCBhbiBBc3luY1N0cmVhbS9Bc3luY1ZET01CdWlsZGVyIGluc3RhbmNlLCBvciBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybiB7QXN5bmNTdHJlYW0vQXN5bmNWRE9NQnVpbGRlcn0gUmV0dXJucyB0aGUgQXN5bmNTdHJlYW0vQXN5bmNWRE9NQnVpbGRlciBpbnN0YW5jZSB0aGF0IHRoZSB0ZW1wbGF0ZSBpcyByZW5kZXJlZCB0b1xuICAgICAqL1xuICAgIHJlbmRlcjogZnVuY3Rpb24gKGRhdGEsIG91dCkge1xuICAgICAgdmFyIGNhbGxiYWNrO1xuICAgICAgdmFyIGZpbmFsT3V0O1xuICAgICAgdmFyIGZpbmFsRGF0YTtcbiAgICAgIHZhciBnbG9iYWxEYXRhO1xuICAgICAgdmFyIHJlbmRlciA9IHJlbmRlckZ1bmMgfHwgdGhpcy5fO1xuICAgICAgdmFyIHNob3VsZEJ1ZmZlciA9IHRoaXMuX19fc2hvdWxkQnVmZmVyO1xuICAgICAgdmFyIHNob3VsZEVuZCA9IHRydWU7XG5cbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgIGZpbmFsRGF0YSA9IGRhdGE7XG4gICAgICAgIGlmICgoZ2xvYmFsRGF0YSA9IGRhdGEuJGdsb2JhbCkpIHtcbiAgICAgICAgICBmaW5hbERhdGEuJGdsb2JhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluYWxEYXRhID0ge307XG4gICAgICB9XG5cbiAgICAgIGlmIChvdXQgJiYgb3V0Ll9fX2lzT3V0KSB7XG4gICAgICAgIGZpbmFsT3V0ID0gb3V0O1xuICAgICAgICBzaG91bGRFbmQgPSBmYWxzZTtcbiAgICAgICAgZXh0ZW5kKG91dC5nbG9iYWwsIGdsb2JhbERhdGEpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3V0ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBmaW5hbE91dCA9IGNyZWF0ZU91dChnbG9iYWxEYXRhKTtcbiAgICAgICAgY2FsbGJhY2sgPSBvdXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaW5hbE91dCA9IGNyZWF0ZU91dChcbiAgICAgICAgICBnbG9iYWxEYXRhLCAvLyBnbG9iYWxcbiAgICAgICAgICBvdXQsIC8vIHdyaXRlcihBc3luY1N0cmVhbSkgb3IgcGFyZW50Tm9kZShBc3luY1ZET01CdWlsZGVyKVxuICAgICAgICAgIHVuZGVmaW5lZCwgLy8gcGFyZW50T3V0XG4gICAgICAgICAgc2hvdWxkQnVmZmVyLCAvLyBpZ25vcmVkIGJ5IEFzeW5jVkRPTUJ1aWxkZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGZpbmFsT3V0XG4gICAgICAgICAgLm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGZpbmFsT3V0Ll9fX2dldFJlc3VsdCgpLCBmaW5hbE91dCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub25jZShcImVycm9yXCIsIGNhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgZ2xvYmFsRGF0YSA9IGZpbmFsT3V0Lmdsb2JhbDtcblxuICAgICAgZ2xvYmFsRGF0YS50ZW1wbGF0ZSA9IGdsb2JhbERhdGEudGVtcGxhdGUgfHwgdGhpcztcblxuICAgICAgcmV0dXJuIHNhZmVSZW5kZXIocmVuZGVyLCBmaW5hbERhdGEsIGZpbmFsT3V0LCBzaG91bGRFbmQpO1xuICAgIH0sXG4gIH0pO1xufTtcbiIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzLWxpZ2h0XCIpO1xudmFyIFJlbmRlclJlc3VsdCA9IHJlcXVpcmUoXCIuLi9SZW5kZXJSZXN1bHRcIik7XG52YXIgYXR0cnNIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL2F0dHJzXCIpO1xudmFyIG1vcnBoZG9tID0gcmVxdWlyZShcIi4vbW9ycGhkb21cIik7XG52YXIgdmRvbSA9IHJlcXVpcmUoXCIuL3Zkb21cIik7XG52YXIgVkVsZW1lbnQgPSB2ZG9tLl9fX1ZFbGVtZW50O1xudmFyIFZEb2N1bWVudEZyYWdtZW50ID0gdmRvbS5fX19WRG9jdW1lbnRGcmFnbWVudDtcbnZhciBWVGV4dCA9IHZkb20uX19fVlRleHQ7XG52YXIgVkNvbXBvbmVudCA9IHZkb20uX19fVkNvbXBvbmVudDtcbnZhciBWRnJhZ21lbnQgPSB2ZG9tLl9fX1ZGcmFnbWVudDtcbnZhciB2aXJ0dWFsaXplSFRNTCA9IHZkb20uX19fdmlydHVhbGl6ZUhUTUw7XG5cbnZhciBFVkVOVF9VUERBVEUgPSBcInVwZGF0ZVwiO1xudmFyIEVWRU5UX0ZJTklTSCA9IFwiZmluaXNoXCI7XG5cbmZ1bmN0aW9uIFN0YXRlKHRyZWUpIHtcbiAgdGhpcy5fX19ldmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHRoaXMuX19fdHJlZSA9IHRyZWU7XG4gIHRoaXMuX19fZmluaXNoZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gQXN5bmNWRE9NQnVpbGRlcihnbG9iYWxEYXRhLCBwYXJlbnROb2RlLCBwYXJlbnRPdXQpIHtcbiAgaWYgKCFwYXJlbnROb2RlKSB7XG4gICAgcGFyZW50Tm9kZSA9IG5ldyBWRG9jdW1lbnRGcmFnbWVudCgpO1xuICB9XG5cbiAgdmFyIHN0YXRlO1xuXG4gIGlmIChwYXJlbnRPdXQpIHtcbiAgICBzdGF0ZSA9IHBhcmVudE91dC5fX19zdGF0ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZSA9IG5ldyBTdGF0ZShwYXJlbnROb2RlKTtcbiAgfVxuXG4gIHRoaXMuX19fcmVtYWluaW5nID0gMTtcbiAgdGhpcy5fX19sYXN0Q291bnQgPSAwO1xuICB0aGlzLl9fX2xhc3QgPSBudWxsO1xuICB0aGlzLl9fX3BhcmVudE91dCA9IHBhcmVudE91dDtcblxuICB0aGlzLmRhdGEgPSB7fTtcbiAgdGhpcy5fX19zdGF0ZSA9IHN0YXRlO1xuICB0aGlzLl9fX3BhcmVudCA9IHBhcmVudE5vZGU7XG4gIHRoaXMuZ2xvYmFsID0gZ2xvYmFsRGF0YSB8fCB7fTtcbiAgdGhpcy5fX19zdGFjayA9IFtwYXJlbnROb2RlXTtcbiAgdGhpcy5fX19zeW5jID0gZmFsc2U7XG4gIHRoaXMuX19fdm5vZGUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX19fY29tcG9uZW50cyA9IG51bGw7XG5cbiAgdGhpcy5fX19hc3NpZ25lZENvbXBvbmVudERlZiA9IG51bGw7XG4gIHRoaXMuX19fYXNzaWduZWRLZXkgPSBudWxsO1xuICB0aGlzLl9fX2Fzc2lnbmVkQ3VzdG9tRXZlbnRzID0gbnVsbDtcbn1cblxudmFyIHByb3RvID0gKEFzeW5jVkRPTUJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBfX19pc091dDogdHJ1ZSxcbiAgX19faG9zdDogdHlwZW9mIGRvY3VtZW50ID09PSBcIm9iamVjdFwiICYmIGRvY3VtZW50LFxuXG4gIGJjOiBmdW5jdGlvbiAoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50KSB7XG4gICAgdmFyIHZDb21wb25lbnQgPSBuZXcgVkNvbXBvbmVudChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQpO1xuICAgIHJldHVybiB0aGlzLl9fX2JlZ2luTm9kZSh2Q29tcG9uZW50LCAwLCB0cnVlKTtcbiAgfSxcblxuICBfX19wcmVzZXJ2ZUNvbXBvbmVudDogZnVuY3Rpb24gKGNvbXBvbmVudCwga2V5LCBvd25lckNvbXBvbmVudCkge1xuICAgIHZhciB2Q29tcG9uZW50ID0gbmV3IFZDb21wb25lbnQoY29tcG9uZW50LCBrZXksIG93bmVyQ29tcG9uZW50LCB0cnVlKTtcbiAgICB0aGlzLl9fX2JlZ2luTm9kZSh2Q29tcG9uZW50LCAwKTtcbiAgfSxcblxuICBfX19iZWdpbk5vZGU6IGZ1bmN0aW9uIChjaGlsZCwgY2hpbGRDb3VudCwgcHVzaFRvU3RhY2spIHtcbiAgICB0aGlzLl9fX3BhcmVudC5fX19hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgaWYgKHB1c2hUb1N0YWNrID09PSB0cnVlKSB7XG4gICAgICB0aGlzLl9fX3N0YWNrLnB1c2goY2hpbGQpO1xuICAgICAgdGhpcy5fX19wYXJlbnQgPSBjaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkQ291bnQgPT09IDAgPyB0aGlzIDogY2hpbGQ7XG4gIH0sXG5cbiAgZWxlbWVudDogZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBrZXksIGNvbXBvbmVudCwgY2hpbGRDb3VudCwgZmxhZ3MsIHByb3BzKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBuZXcgVkVsZW1lbnQoXG4gICAgICB0YWdOYW1lLFxuICAgICAgYXR0cnMsXG4gICAgICBrZXksXG4gICAgICBjb21wb25lbnQsXG4gICAgICBjaGlsZENvdW50LFxuICAgICAgZmxhZ3MsXG4gICAgICBwcm9wcyxcbiAgICApO1xuICAgIHJldHVybiB0aGlzLl9fX2JlZ2luTm9kZShlbGVtZW50LCBjaGlsZENvdW50KTtcbiAgfSxcblxuICBfX19lbGVtZW50RHluYW1pYzogZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBrZXksIGNvbXBvbmVudERlZiwgcHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50KFxuICAgICAgdGFnTmFtZSxcbiAgICAgIGF0dHJzSGVscGVyKGF0dHJzKSxcbiAgICAgIGtleSxcbiAgICAgIGNvbXBvbmVudERlZi5fX19jb21wb25lbnQsXG4gICAgICAwLFxuICAgICAgMCxcbiAgICAgIHByb3BzLFxuICAgICk7XG4gIH0sXG5cbiAgbjogZnVuY3Rpb24gKG5vZGUsIGNvbXBvbmVudCkge1xuICAgIC8vIE5PVEU6IFdlIGRvIGEgc2hhbGxvdyBjbG9uZSBzaW5jZSB3ZSBhc3N1bWUgdGhlIG5vZGUgaXMgYmVpbmcgcmV1c2VkXG4gICAgLy8gICAgICAgYW5kIGEgbm9kZSBjYW4gb25seSBoYXZlIG9uZSBwYXJlbnQgbm9kZS5cbiAgICB2YXIgY2xvbmUgPSBub2RlLl9fX2Nsb25lTm9kZSgpO1xuICAgIHRoaXMubm9kZShjbG9uZSk7XG4gICAgY2xvbmUuX19fb3duZXJDb21wb25lbnQgPSBjb21wb25lbnQ7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBub2RlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgIHRoaXMuX19fcGFyZW50Ll9fX2FwcGVuZENoaWxkKG5vZGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHRleHQ6IGZ1bmN0aW9uICh0ZXh0LCBvd25lckNvbXBvbmVudCkge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIHRleHQ7XG5cbiAgICBpZiAodHlwZSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAodGV4dCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAodGV4dC50b0hUTUwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5oKHRleHQudG9IVE1MKCksIG93bmVyQ29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0ZXh0ID0gdGV4dC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHRoaXMuX19fcGFyZW50Ll9fX2FwcGVuZENoaWxkKG5ldyBWVGV4dCh0ZXh0LCBvd25lckNvbXBvbmVudCkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGh0bWw6IGZ1bmN0aW9uIChodG1sLCBvd25lckNvbXBvbmVudCkge1xuICAgIGlmIChodG1sICE9IG51bGwpIHtcbiAgICAgIHZhciB2ZG9tTm9kZSA9IHZpcnR1YWxpemVIVE1MKGh0bWwsIG93bmVyQ29tcG9uZW50KTtcbiAgICAgIHRoaXMubm9kZSh2ZG9tTm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgYmVnaW5FbGVtZW50OiBmdW5jdGlvbiAoXG4gICAgdGFnTmFtZSxcbiAgICBhdHRycyxcbiAgICBrZXksXG4gICAgY29tcG9uZW50LFxuICAgIGNoaWxkQ291bnQsXG4gICAgZmxhZ3MsXG4gICAgcHJvcHMsXG4gICkge1xuICAgIHZhciBlbGVtZW50ID0gbmV3IFZFbGVtZW50KFxuICAgICAgdGFnTmFtZSxcbiAgICAgIGF0dHJzLFxuICAgICAga2V5LFxuICAgICAgY29tcG9uZW50LFxuICAgICAgY2hpbGRDb3VudCxcbiAgICAgIGZsYWdzLFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgICB0aGlzLl9fX2JlZ2luTm9kZShlbGVtZW50LCBjaGlsZENvdW50LCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfX19iZWdpbkVsZW1lbnREeW5hbWljOiBmdW5jdGlvbiAodGFnTmFtZSwgYXR0cnMsIGtleSwgY29tcG9uZW50RGVmLCBwcm9wcykge1xuICAgIHJldHVybiB0aGlzLmJlZ2luRWxlbWVudChcbiAgICAgIHRhZ05hbWUsXG4gICAgICBhdHRyc0hlbHBlcihhdHRycyksXG4gICAgICBrZXksXG4gICAgICBjb21wb25lbnREZWYuX19fY29tcG9uZW50LFxuICAgICAgMCxcbiAgICAgIDAsXG4gICAgICBwcm9wcyxcbiAgICApO1xuICB9LFxuXG4gIGJmOiBmdW5jdGlvbiAoa2V5LCBjb21wb25lbnQsIHByZXNlcnZlKSB7XG4gICAgdmFyIGZyYWdtZW50ID0gbmV3IFZGcmFnbWVudChrZXksIGNvbXBvbmVudCwgcHJlc2VydmUpO1xuICAgIHRoaXMuX19fYmVnaW5Ob2RlKGZyYWdtZW50LCBudWxsLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBlZjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5kRWxlbWVudCgpO1xuICB9LFxuXG4gIGVuZEVsZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhY2sgPSB0aGlzLl9fX3N0YWNrO1xuICAgIHN0YWNrLnBvcCgpO1xuICAgIHRoaXMuX19fcGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gIH0sXG5cbiAgZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX19wYXJlbnQgPSB1bmRlZmluZWQ7XG5cbiAgICB2YXIgcmVtYWluaW5nID0gLS10aGlzLl9fX3JlbWFpbmluZztcbiAgICB2YXIgcGFyZW50T3V0ID0gdGhpcy5fX19wYXJlbnRPdXQ7XG5cbiAgICBpZiAocmVtYWluaW5nID09PSAwKSB7XG4gICAgICBpZiAocGFyZW50T3V0KSB7XG4gICAgICAgIHBhcmVudE91dC5fX19oYW5kbGVDaGlsZERvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX19fZG9GaW5pc2goKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlbWFpbmluZyAtIHRoaXMuX19fbGFzdENvdW50ID09PSAwKSB7XG4gICAgICB0aGlzLl9fX2VtaXRMYXN0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgX19faGFuZGxlQ2hpbGREb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlbWFpbmluZyA9IC0tdGhpcy5fX19yZW1haW5pbmc7XG5cbiAgICBpZiAocmVtYWluaW5nID09PSAwKSB7XG4gICAgICB2YXIgcGFyZW50T3V0ID0gdGhpcy5fX19wYXJlbnRPdXQ7XG4gICAgICBpZiAocGFyZW50T3V0KSB7XG4gICAgICAgIHBhcmVudE91dC5fX19oYW5kbGVDaGlsZERvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX19fZG9GaW5pc2goKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlbWFpbmluZyAtIHRoaXMuX19fbGFzdENvdW50ID09PSAwKSB7XG4gICAgICB0aGlzLl9fX2VtaXRMYXN0KCk7XG4gICAgfVxuICB9LFxuXG4gIF9fX2RvRmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX19zdGF0ZTtcbiAgICBzdGF0ZS5fX19maW5pc2hlZCA9IHRydWU7XG4gICAgc3RhdGUuX19fZXZlbnRzLmVtaXQoRVZFTlRfRklOSVNILCB0aGlzLl9fX2dldFJlc3VsdCgpKTtcbiAgfSxcblxuICBfX19lbWl0TGFzdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBsYXN0QXJyYXkgPSB0aGlzLl9sYXN0O1xuXG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIGlmIChpID09PSBsYXN0QXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBsYXN0Q2FsbGJhY2sgPSBsYXN0QXJyYXlbaSsrXTtcbiAgICAgIGxhc3RDYWxsYmFjayhuZXh0KTtcblxuICAgICAgaWYgKCFsYXN0Q2FsbGJhY2subGVuZ3RoKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0KCk7XG4gIH0sXG5cbiAgZXJyb3I6IGZ1bmN0aW9uIChlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBsaXN0ZW5lciBmb3IgdGhlIGVycm9yIGV2ZW50IHRoZW4gaXQgd2lsbFxuICAgICAgLy8gdGhyb3cgYSBuZXcgRXJyb3IgaGVyZS4gSW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIGFzeW5jIGZyYWdtZW50XG4gICAgICAvLyBpcyBzdGlsbCBwcm9wZXJseSBlbmRlZCB3ZSBuZWVkIHRvIHB1dCB0aGUgZW5kKCkgaW4gYSBgZmluYWxseWBcbiAgICAgIC8vIGJsb2NrXG4gICAgICB0aGlzLmVuZCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGJlZ2luQXN5bmM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuX19fc3luYykge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIFwiVHJpZWQgdG8gcmVuZGVyIGFzeW5jIHdoaWxlIGluIHN5bmMgbW9kZS4gTm90ZTogQ2xpZW50IHNpZGUgYXdhaXQgaXMgbm90IGN1cnJlbnRseSBzdXBwb3J0ZWQgaW4gcmUtcmVuZGVycyAoSXNzdWU6ICM5NDIpLlwiLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fX3N0YXRlO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLmxhc3QpIHtcbiAgICAgICAgdGhpcy5fX19sYXN0Q291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9fX3JlbWFpbmluZysrO1xuXG4gICAgdmFyIGRvY3VtZW50RnJhZ21lbnQgPSB0aGlzLl9fX3BhcmVudC5fX19hcHBlbmREb2N1bWVudEZyYWdtZW50KCk7XG4gICAgdmFyIGFzeW5jT3V0ID0gbmV3IEFzeW5jVkRPTUJ1aWxkZXIodGhpcy5nbG9iYWwsIGRvY3VtZW50RnJhZ21lbnQsIHRoaXMpO1xuXG4gICAgc3RhdGUuX19fZXZlbnRzLmVtaXQoXCJiZWdpbkFzeW5jXCIsIHtcbiAgICAgIG91dDogYXN5bmNPdXQsXG4gICAgICBwYXJlbnRPdXQ6IHRoaXMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXN5bmNPdXQ7XG4gIH0sXG5cbiAgY3JlYXRlT3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBBc3luY1ZET01CdWlsZGVyKHRoaXMuZ2xvYmFsKTtcbiAgfSxcblxuICBmbHVzaDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudHMgPSB0aGlzLl9fX3N0YXRlLl9fX2V2ZW50cztcblxuICAgIGlmIChldmVudHMubGlzdGVuZXJDb3VudChFVkVOVF9VUERBVEUpKSB7XG4gICAgICBldmVudHMuZW1pdChFVkVOVF9VUERBVEUsIG5ldyBSZW5kZXJSZXN1bHQodGhpcykpO1xuICAgIH1cbiAgfSxcblxuICBfX19nZXRPdXRwdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19zdGF0ZS5fX190cmVlO1xuICB9LFxuXG4gIF9fX2dldFJlc3VsdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fX3Jlc3VsdCB8fCAodGhpcy5fX19yZXN1bHQgPSBuZXcgUmVuZGVyUmVzdWx0KHRoaXMpKTtcbiAgfSxcblxuICBvbjogZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAoZXZlbnQgPT09IEVWRU5UX0ZJTklTSCAmJiBzdGF0ZS5fX19maW5pc2hlZCkge1xuICAgICAgY2FsbGJhY2sodGhpcy5fX19nZXRSZXN1bHQoKSk7XG4gICAgfSBlbHNlIGlmIChldmVudCA9PT0gXCJsYXN0XCIpIHtcbiAgICAgIHRoaXMub25MYXN0KGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuX19fZXZlbnRzLm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19fc3RhdGU7XG5cbiAgICBpZiAoZXZlbnQgPT09IEVWRU5UX0ZJTklTSCAmJiBzdGF0ZS5fX19maW5pc2hlZCkge1xuICAgICAgY2FsbGJhY2sodGhpcy5fX19nZXRSZXN1bHQoKSk7XG4gICAgfSBlbHNlIGlmIChldmVudCA9PT0gXCJsYXN0XCIpIHtcbiAgICAgIHRoaXMub25MYXN0KGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuX19fZXZlbnRzLm9uY2UoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAodHlwZSwgYXJnKSB7XG4gICAgdmFyIGV2ZW50cyA9IHRoaXMuX19fc3RhdGUuX19fZXZlbnRzO1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBldmVudHMuZW1pdCh0eXBlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGV2ZW50cy5lbWl0KHR5cGUsIGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZXZlbnRzLmVtaXQuYXBwbHkoZXZlbnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5fX19zdGF0ZS5fX19ldmVudHM7XG4gICAgZXZlbnRzLnJlbW92ZUxpc3RlbmVyLmFwcGx5KGV2ZW50cywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBzeW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX19zeW5jID0gdHJ1ZTtcbiAgfSxcblxuICBpc1N5bmM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX19zeW5jO1xuICB9LFxuXG4gIG9uTGFzdDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIGxhc3RBcnJheSA9IHRoaXMuX2xhc3Q7XG5cbiAgICBpZiAobGFzdEFycmF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2xhc3QgPSBbY2FsbGJhY2tdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0QXJyYXkucHVzaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgX19fZ2V0Tm9kZTogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMuX19fdm5vZGU7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICB2YXIgdmRvbVRyZWUgPSB0aGlzLl9fX2dldE91dHB1dCgpO1xuXG4gICAgICBpZiAoIWhvc3QpIGhvc3QgPSB0aGlzLl9fX2hvc3Q7XG4gICAgICB0aGlzLl9fX3Zub2RlID0gbm9kZSA9IHZkb21UcmVlLl9fX2FjdHVhbGl6ZShob3N0LCBudWxsKTtcbiAgICAgIG1vcnBoZG9tKG5vZGUsIHZkb21UcmVlLCBob3N0LCB0aGlzLl9fX2NvbXBvbmVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfSxcblxuICB0b1N0cmluZzogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICB2YXIgZG9jRnJhZ21lbnQgPSB0aGlzLl9fX2dldE5vZGUoaG9zdCk7XG4gICAgdmFyIGh0bWwgPSBcIlwiO1xuXG4gICAgdmFyIGNoaWxkID0gZG9jRnJhZ21lbnQuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgIHZhciBuZXh0U2libGluZyA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9IDEpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY0ZyYWdtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkLmNsb25lTm9kZSgpKTtcbiAgICAgICAgaHRtbCArPSBjb250YWluZXIuaW5uZXJIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaHRtbCArPSBjaGlsZC5vdXRlckhUTUw7XG4gICAgICB9XG5cbiAgICAgIGNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH0sXG5cbiAgdGhlbjogZnVuY3Rpb24gKGZuLCBmbkVycikge1xuICAgIHZhciBvdXQgPSB0aGlzO1xuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgb3V0Lm9uKFwiZXJyb3JcIiwgcmVqZWN0KS5vbihFVkVOVF9GSU5JU0gsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHByb21pc2UpLnRoZW4oZm4sIGZuRXJyKTtcbiAgfSxcblxuICBjYXRjaDogZnVuY3Rpb24gKGZuRXJyKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIGZuRXJyKTtcbiAgfSxcblxuICBpc1ZET006IHRydWUsXG5cbiAgYzogZnVuY3Rpb24gKGNvbXBvbmVudERlZiwga2V5LCBjdXN0b21FdmVudHMpIHtcbiAgICB0aGlzLl9fX2Fzc2lnbmVkQ29tcG9uZW50RGVmID0gY29tcG9uZW50RGVmO1xuICAgIHRoaXMuX19fYXNzaWduZWRLZXkgPSBrZXk7XG4gICAgdGhpcy5fX19hc3NpZ25lZEN1c3RvbUV2ZW50cyA9IGN1c3RvbUV2ZW50cztcbiAgfSxcbn0pO1xuXG5wcm90by5lID0gcHJvdG8uZWxlbWVudDtcbnByb3RvLmJlID0gcHJvdG8uYmVnaW5FbGVtZW50O1xucHJvdG8uZWUgPSBwcm90by5fX19lbmRFbGVtZW50ID0gcHJvdG8uZW5kRWxlbWVudDtcbnByb3RvLnQgPSBwcm90by50ZXh0O1xucHJvdG8uaCA9IHByb3RvLncgPSBwcm90by53cml0ZSA9IHByb3RvLmh0bWw7XG5cbm1vZHVsZS5leHBvcnRzID0gQXN5bmNWRE9NQnVpbGRlcjtcbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcInJhcHRvci11dGlsL2luaGVyaXRcIik7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcblxuZnVuY3Rpb24gVkNvbXBvbmVudChjb21wb25lbnQsIGtleSwgb3duZXJDb21wb25lbnQsIHByZXNlcnZlKSB7XG4gIHRoaXMuX19fVk5vZGUobnVsbCAvKiBjaGlsZENvdW50ICovLCBvd25lckNvbXBvbmVudCk7XG4gIHRoaXMuX19fa2V5ID0ga2V5O1xuICB0aGlzLl9fX2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgdGhpcy5fX19wcmVzZXJ2ZSA9IHByZXNlcnZlO1xufVxuXG5WQ29tcG9uZW50LnByb3RvdHlwZSA9IHtcbiAgX19fbm9kZVR5cGU6IDIsXG59O1xuXG5pbmhlcml0KFZDb21wb25lbnQsIFZOb2RlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWQ29tcG9uZW50O1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9leHRlbmRcIik7XG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG5cbmZ1bmN0aW9uIFZEb2N1bWVudEZyYWdtZW50Q2xvbmUob3RoZXIpIHtcbiAgZXh0ZW5kKHRoaXMsIG90aGVyKTtcbiAgdGhpcy5fX19wYXJlbnROb2RlID0gbnVsbDtcbiAgdGhpcy5fX19uZXh0U2libGluZ0ludGVybmFsID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gVkRvY3VtZW50RnJhZ21lbnQob3V0KSB7XG4gIHRoaXMuX19fVk5vZGUobnVsbCAvKiBjaGlsZENvdW50ICovKTtcbiAgdGhpcy5fX19vdXQgPSBvdXQ7XG59XG5cblZEb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZSA9IHtcbiAgX19fbm9kZVR5cGU6IDExLFxuXG4gIF9fX0RvY3VtZW50RnJhZ21lbnQ6IHRydWUsXG5cbiAgX19fY2xvbmVOb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWRG9jdW1lbnRGcmFnbWVudENsb25lKHRoaXMpO1xuICB9LFxuXG4gIF9fX2FjdHVhbGl6ZTogZnVuY3Rpb24gKGhvc3QpIHtcbiAgICByZXR1cm4gKGhvc3Qub3duZXJEb2N1bWVudCB8fCBob3N0KS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIH0sXG59O1xuXG5pbmhlcml0KFZEb2N1bWVudEZyYWdtZW50LCBWTm9kZSk7XG5cblZEb2N1bWVudEZyYWdtZW50Q2xvbmUucHJvdG90eXBlID0gVkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZEb2N1bWVudEZyYWdtZW50O1xuIiwiLyoganNoaW50IG5ld2NhcDpmYWxzZSAqL1xuXG52YXIgY29tcGxhaW4gPSBcIk1BUktPX0RFQlVHXCIgJiYgcmVxdWlyZShcImNvbXBsYWluXCIpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9kb20tZGF0YVwiKTtcbnZhciB2RWxlbWVudEJ5RE9NTm9kZSA9IGRvbURhdGEuX19fdkVsZW1lbnRCeURPTU5vZGU7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcbnZhciBBVFRSX1hMSU5LX0hSRUYgPSBcInhsaW5rOmhyZWZcIjtcbnZhciB4bWxuc1JlZ0V4cCA9IC9eeG1sbnMoOnwkKS87XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIE5TX1hMSU5LID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI7XG52YXIgTlNfSFRNTCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xudmFyIE5TX01BVEggPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjtcbnZhciBOU19TVkcgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG52YXIgREVGQVVMVF9OUyA9IHtcbiAgc3ZnOiBOU19TVkcsXG4gIG1hdGg6IE5TX01BVEgsXG59O1xuXG52YXIgRkxBR19TSU1QTEVfQVRUUlMgPSAxO1xudmFyIEZMQUdfQ1VTVE9NX0VMRU1FTlQgPSAyO1xudmFyIEZMQUdfU1BSRUFEX0FUVFJTID0gNDtcblxudmFyIEFUVFJfSFJFRiA9IFwiaHJlZlwiO1xudmFyIEVNUFRZX09CSkVDVCA9IE9iamVjdC5mcmVlemUoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG52YXIgc3BlY2lhbEVsSGFuZGxlcnMgPSB7XG4gIG9wdGlvbjoge1xuICAgIHNlbGVjdGVkOiBmdW5jdGlvbiAoZnJvbUVsLCB2YWx1ZSkge1xuICAgICAgZnJvbUVsLnNlbGVjdGVkID0gdmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICB9LFxuICBpbnB1dDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoZnJvbUVsLCB2YWx1ZSkge1xuICAgICAgZnJvbUVsLnZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB2YWx1ZTtcbiAgICB9LFxuICAgIGNoZWNrZWQ6IGZ1bmN0aW9uIChmcm9tRWwsIHZhbHVlKSB7XG4gICAgICBmcm9tRWwuY2hlY2tlZCA9IHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgc3dpdGNoICh2YWx1ZS50b1N0cmluZykge1xuICAgICAgICBjYXNlIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc6XG4gICAgICAgIGNhc2UgQXJyYXkucHJvdG90eXBlLnRvU3RyaW5nOlxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICAgICAgICBjb21wbGFpbihcbiAgICAgICAgICAgICAgXCJSZWx5aW5nIG9uIEpTT04uc3RyaW5naWZ5IGZvciBhdHRyaWJ1dGUgdmFsdWVzIGlzIGRlcHJlY2F0ZWQsIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBNYXJrbyB0aGVzZSB3aWxsIGJlIGNhc3QgdG8gc3RyaW5ncyBpbnN0ZWFkLlwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgY2FzZSBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nOlxuICAgICAgICAgIHJldHVybiB2YWx1ZS5zb3VyY2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSArIFwiXCI7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbihhLCBiKSB7XG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYiwga2V5KSkge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBWRWxlbWVudENsb25lKG90aGVyKSB7XG4gIHRoaXMuX19fZmlyc3RDaGlsZEludGVybmFsID0gb3RoZXIuX19fZmlyc3RDaGlsZEludGVybmFsO1xuICB0aGlzLl9fX3BhcmVudE5vZGUgPSBudWxsO1xuICB0aGlzLl9fX25leHRTaWJsaW5nSW50ZXJuYWwgPSBudWxsO1xuXG4gIHRoaXMuX19fa2V5ID0gb3RoZXIuX19fa2V5O1xuICB0aGlzLl9fX2F0dHJpYnV0ZXMgPSBvdGhlci5fX19hdHRyaWJ1dGVzO1xuICB0aGlzLl9fX3Byb3BlcnRpZXMgPSBvdGhlci5fX19wcm9wZXJ0aWVzO1xuICB0aGlzLl9fX25vZGVOYW1lID0gb3RoZXIuX19fbm9kZU5hbWU7XG4gIHRoaXMuX19fZmxhZ3MgPSBvdGhlci5fX19mbGFncztcbiAgdGhpcy5fX192YWx1ZUludGVybmFsID0gb3RoZXIuX19fdmFsdWVJbnRlcm5hbDtcbiAgdGhpcy5fX19jb25zdElkID0gb3RoZXIuX19fY29uc3RJZDtcbn1cblxuZnVuY3Rpb24gVkVsZW1lbnQoXG4gIHRhZ05hbWUsXG4gIGF0dHJzLFxuICBrZXksXG4gIG93bmVyQ29tcG9uZW50LFxuICBjaGlsZENvdW50LFxuICBmbGFncyxcbiAgcHJvcHMsXG4pIHtcbiAgdGhpcy5fX19WTm9kZShjaGlsZENvdW50LCBvd25lckNvbXBvbmVudCk7XG5cbiAgdmFyIGNvbnN0SWQ7XG5cbiAgaWYgKHByb3BzKSB7XG4gICAgY29uc3RJZCA9IHByb3BzLmk7XG4gIH1cblxuICB0aGlzLl9fX2tleSA9IGtleTtcbiAgdGhpcy5fX19mbGFncyA9IGZsYWdzIHx8IDA7XG4gIHRoaXMuX19fYXR0cmlidXRlcyA9IGF0dHJzIHx8IEVNUFRZX09CSkVDVDtcbiAgdGhpcy5fX19wcm9wZXJ0aWVzID0gcHJvcHMgfHwgRU1QVFlfT0JKRUNUO1xuICB0aGlzLl9fX25vZGVOYW1lID0gdGFnTmFtZTtcbiAgdGhpcy5fX192YWx1ZUludGVybmFsID0gXCJcIjtcbiAgdGhpcy5fX19jb25zdElkID0gY29uc3RJZDtcbiAgdGhpcy5fX19wcmVzZXJ2ZSA9IGZhbHNlO1xuICB0aGlzLl9fX3ByZXNlcnZlQm9keSA9IGZhbHNlO1xufVxuXG5WRWxlbWVudC5wcm90b3R5cGUgPSB7XG4gIF9fX25vZGVUeXBlOiAxLFxuXG4gIF9fX2Nsb25lTm9kZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVkVsZW1lbnRDbG9uZSh0aGlzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2hvcnRoYW5kIG1ldGhvZCBmb3IgY3JlYXRpbmcgYW5kIGFwcGVuZGluZyBhbiBIVE1MIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0YWdOYW1lICAgIFRoZSB0YWcgbmFtZSAoZS5nLiBcImRpdlwiKVxuICAgKiBAcGFyYW0gIHtpbnR8bnVsbH0gYXR0ckNvdW50ICBUaGUgbnVtYmVyIG9mIGF0dHJpYnV0ZXMgKG9yIGBudWxsYCBpZiBub3Qga25vd24pXG4gICAqIEBwYXJhbSAge2ludHxudWxsfSBjaGlsZENvdW50IFRoZSBudW1iZXIgb2YgY2hpbGQgbm9kZXMgKG9yIGBudWxsYCBpZiBub3Qga25vd24pXG4gICAqL1xuICBlOiBmdW5jdGlvbiAodGFnTmFtZSwgYXR0cnMsIGtleSwgb3duZXJDb21wb25lbnQsIGNoaWxkQ291bnQsIGZsYWdzLCBwcm9wcykge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuX19fYXBwZW5kQ2hpbGQoXG4gICAgICBuZXcgVkVsZW1lbnQoXG4gICAgICAgIHRhZ05hbWUsXG4gICAgICAgIGF0dHJzLFxuICAgICAgICBrZXksXG4gICAgICAgIG93bmVyQ29tcG9uZW50LFxuICAgICAgICBjaGlsZENvdW50LFxuICAgICAgICBmbGFncyxcbiAgICAgICAgcHJvcHMsXG4gICAgICApLFxuICAgICk7XG5cbiAgICBpZiAoY2hpbGRDb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19fZmluaXNoQ2hpbGQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU2hvcnRoYW5kIG1ldGhvZCBmb3IgY3JlYXRpbmcgYW5kIGFwcGVuZGluZyBhIHN0YXRpYyBub2RlLiBUaGUgcHJvdmlkZWQgbm9kZSBpcyBhdXRvbWF0aWNhbGx5IGNsb25lZFxuICAgKiB1c2luZyBhIHNoYWxsb3cgY2xvbmUgc2luY2UgaXQgd2lsbCBiZSBtdXRhdGVkIGFzIGEgcmVzdWx0IG9mIHNldHRpbmcgYG5leHRTaWJsaW5nYCBhbmQgYHBhcmVudE5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhlIG5ldyBDb21tZW50IG5vZGVcbiAgICovXG4gIG46IGZ1bmN0aW9uIChub2RlLCBvd25lckNvbXBvbmVudCkge1xuICAgIG5vZGUgPSBub2RlLl9fX2Nsb25lTm9kZSgpO1xuICAgIG5vZGUuX19fb3duZXJDb21wb25lbnQgPSBvd25lckNvbXBvbmVudDtcbiAgICB0aGlzLl9fX2FwcGVuZENoaWxkKG5vZGUpO1xuICAgIHJldHVybiB0aGlzLl9fX2ZpbmlzaENoaWxkKCk7XG4gIH0sXG5cbiAgX19fYWN0dWFsaXplOiBmdW5jdGlvbiAoaG9zdCwgcGFyZW50TmFtZXNwYWNlVVJJKSB7XG4gICAgdmFyIHRhZ05hbWUgPSB0aGlzLl9fX25vZGVOYW1lO1xuICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5fX19hdHRyaWJ1dGVzO1xuICAgIHZhciBuYW1lc3BhY2VVUkkgPSBERUZBVUxUX05TW3RhZ05hbWVdIHx8IHBhcmVudE5hbWVzcGFjZVVSSSB8fCBOU19IVE1MO1xuXG4gICAgdmFyIGZsYWdzID0gdGhpcy5fX19mbGFncztcbiAgICB2YXIgZWwgPSAoaG9zdC5vd25lckRvY3VtZW50IHx8IGhvc3QpLmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgIG5hbWVzcGFjZVVSSSxcbiAgICAgIHRhZ05hbWUsXG4gICAgKTtcblxuICAgIGlmIChmbGFncyAmIEZMQUdfQ1VTVE9NX0VMRU1FTlQpIHtcbiAgICAgIGFzc2lnbihlbCwgYXR0cmlidXRlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGF0dHJWYWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKGF0dHJpYnV0ZXNbYXR0ck5hbWVdKTtcblxuICAgICAgICBpZiAoYXR0clZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoYXR0ck5hbWUgPT0gQVRUUl9YTElOS19IUkVGKSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGVOUyhOU19YTElOSywgQVRUUl9IUkVGLCBhdHRyVmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0YWdOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgICAgZWwuZGVmYXVsdFZhbHVlID0gdGhpcy5fX192YWx1ZUludGVybmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChlbCwgdGhpcyk7XG5cbiAgICByZXR1cm4gZWw7XG4gIH0sXG59O1xuXG5pbmhlcml0KFZFbGVtZW50LCBWTm9kZSk7XG5cblZFbGVtZW50Q2xvbmUucHJvdG90eXBlID0gVkVsZW1lbnQucHJvdG90eXBlO1xuXG5mdW5jdGlvbiB2aXJ0dWFsaXplRWxlbWVudChub2RlLCB2aXJ0dWFsaXplQ2hpbGROb2Rlcywgb3duZXJDb21wb25lbnQpIHtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG4gIHZhciBhdHRyQ291bnQgPSBhdHRyaWJ1dGVzLmxlbmd0aDtcblxuICB2YXIgYXR0cnMgPSBudWxsO1xuICB2YXIgcHJvcHMgPSBudWxsO1xuXG4gIGlmIChhdHRyQ291bnQpIHtcbiAgICBhdHRycyA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0ckNvdW50OyBpKyspIHtcbiAgICAgIHZhciBhdHRyID0gYXR0cmlidXRlc1tpXTtcbiAgICAgIHZhciBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgIGlmICgheG1sbnNSZWdFeHAudGVzdChhdHRyTmFtZSkpIHtcbiAgICAgICAgaWYgKGF0dHJOYW1lID09PSBcImRhdGEtbWFya29cIikge1xuICAgICAgICAgIHByb3BzID0gY29tcG9uZW50c1V0aWwuX19fZ2V0TWFya29Qcm9wc0Zyb21FbChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyLm5hbWVzcGFjZVVSSSA9PT0gTlNfWExJTkspIHtcbiAgICAgICAgICBhdHRyc1tBVFRSX1hMSU5LX0hSRUZdID0gYXR0ci52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhdHRyc1thdHRyTmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIHRhZ05hbWUgPSBub2RlLm5vZGVOYW1lO1xuXG4gIGlmIChub2RlLm5hbWVzcGFjZVVSSSA9PT0gTlNfSFRNTCkge1xuICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICB2YXIgdmRvbUVsID0gbmV3IFZFbGVtZW50KFxuICAgIHRhZ05hbWUsXG4gICAgYXR0cnMsXG4gICAgbnVsbCAvKmtleSovLFxuICAgIG93bmVyQ29tcG9uZW50LFxuICAgIDAgLypjaGlsZCBjb3VudCovLFxuICAgIDAgLypmbGFncyovLFxuICAgIHByb3BzLFxuICApO1xuXG4gIGlmICh2ZG9tRWwuX19fbm9kZU5hbWUgPT09IFwidGV4dGFyZWFcIikge1xuICAgIHZkb21FbC5fX192YWx1ZUludGVybmFsID0gbm9kZS52YWx1ZTtcbiAgfSBlbHNlIGlmICh2aXJ0dWFsaXplQ2hpbGROb2Rlcykge1xuICAgIHZpcnR1YWxpemVDaGlsZE5vZGVzKG5vZGUsIHZkb21FbCwgb3duZXJDb21wb25lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHZkb21FbDtcbn1cblxuVkVsZW1lbnQuX19fdmlydHVhbGl6ZSA9IHZpcnR1YWxpemVFbGVtZW50O1xuXG5WRWxlbWVudC5fX19tb3JwaEF0dHJzID0gZnVuY3Rpb24gKGZyb21FbCwgdkZyb21FbCwgdG9FbCkge1xuICB2YXIgZnJvbUZsYWdzID0gdkZyb21FbC5fX19mbGFncztcbiAgdmFyIHRvRmxhZ3MgPSB0b0VsLl9fX2ZsYWdzO1xuICB2YXIgYXR0cnMgPSB0b0VsLl9fX2F0dHJpYnV0ZXM7XG5cbiAgaWYgKHRvRmxhZ3MgJiBGTEFHX0NVU1RPTV9FTEVNRU5UKSB7XG4gICAgcmV0dXJuIGFzc2lnbihmcm9tRWwsIGF0dHJzKTtcbiAgfVxuXG4gIHZhciBwcm9wcyA9IHRvRWwuX19fcHJvcGVydGllcztcbiAgdmFyIGF0dHJOYW1lO1xuXG4gIC8vIFdlIHVzZSBleHBhbmRvIHByb3BlcnRpZXMgdG8gYXNzb2NpYXRlIHRoZSBwcmV2aW91cyBIVE1MXG4gIC8vIGF0dHJpYnV0ZXMgcHJvdmlkZWQgYXMgcGFydCBvZiB0aGUgVkRPTSBub2RlIHdpdGggdGhlXG4gIC8vIHJlYWwgVkVsZW1lbnQgRE9NIG5vZGUuIFdoZW4gZGlmZmluZyBhdHRyaWJ1dGVzLFxuICAvLyB3ZSBvbmx5IHVzZSBvdXIgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGF0dHJpYnV0ZXMuXG4gIC8vIFdoZW4gZGlmZmluZyBmb3IgdGhlIGZpcnN0IHRpbWUgaXQncyBwb3NzaWJsZSB0aGF0IHRoZVxuICAvLyByZWFsIFZFbGVtZW50IG5vZGUgd2lsbCBub3QgaGF2ZSB0aGUgZXhwYW5kbyBwcm9wZXJ0eVxuICAvLyBzbyB3ZSBidWlsZCB0aGUgYXR0cmlidXRlIG1hcCBmcm9tIHRoZSBleHBhbmRvIHByb3BlcnR5XG5cbiAgdmFyIG9sZEF0dHJzID0gdkZyb21FbC5fX19hdHRyaWJ1dGVzO1xuXG4gIGlmIChvbGRBdHRycyA9PT0gYXR0cnMpIHtcbiAgICAvLyBGb3IgY29uc3RhbnQgYXR0cmlidXRlcyB0aGUgc2FtZSBvYmplY3Qgd2lsbCBiZSBwcm92aWRlZFxuICAgIC8vIGV2ZXJ5IHJlbmRlciBhbmQgd2UgY2FuIHVzZSB0aGF0IHRvIG91ciBhZHZhbnRhZ2UgdG9cbiAgICAvLyBub3Qgd2FzdGUgdGltZSBkaWZmaW5nIGEgY29uc3RhbnQsIGltbXV0YWJsZSBhdHRyaWJ1dGVcbiAgICAvLyBtYXAuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGF0dHJWYWx1ZTtcblxuICBpZiAodG9GbGFncyAmIEZMQUdfU0lNUExFX0FUVFJTICYmIGZyb21GbGFncyAmIEZMQUdfU0lNUExFX0FUVFJTKSB7XG4gICAgaWYgKG9sZEF0dHJzW1wiY2xhc3NcIl0gIT09IChhdHRyVmFsdWUgPSBhdHRyc1tcImNsYXNzXCJdKSkge1xuICAgICAgaWYgKGF0dHJWYWx1ZSkge1xuICAgICAgICBmcm9tRWwuY2xhc3NOYW1lID0gYXR0clZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2xkQXR0cnMuaWQgIT09IChhdHRyVmFsdWUgPSBhdHRycy5pZCkpIHtcbiAgICAgIGlmIChhdHRyVmFsdWUpIHtcbiAgICAgICAgZnJvbUVsLmlkID0gYXR0clZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2xkQXR0cnMuc3R5bGUgIT09IChhdHRyVmFsdWUgPSBhdHRycy5zdHlsZSkpIHtcbiAgICAgIGlmIChhdHRyVmFsdWUpIHtcbiAgICAgICAgZnJvbUVsLnN0eWxlLmNzc1RleHQgPSBhdHRyVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwcmVzZXJ2ZSA9IChwcm9wcyAmJiBwcm9wcy5wYSkgfHwgRU1QVFlfT0JKRUNUO1xuICB2YXIgc3BlY2lhbEF0dHJzID0gc3BlY2lhbEVsSGFuZGxlcnNbdG9FbC5fX19ub2RlTmFtZV0gfHwgRU1QVFlfT0JKRUNUO1xuICB2YXIgc3BlY2lhbEF0dHI7XG5cbiAgLy8gTG9vcCBvdmVyIGFsbCBvZiB0aGUgYXR0cmlidXRlcyBpbiB0aGUgYXR0cmlidXRlIG1hcCBhbmQgY29tcGFyZVxuICAvLyB0aGVtIHRvIHRoZSB2YWx1ZSBpbiB0aGUgb2xkIG1hcC4gSG93ZXZlciwgaWYgdGhlIHZhbHVlIGlzXG4gIC8vIG51bGwvdW5kZWZpbmVkL2ZhbHNlIHRoZW4gd2Ugd2FudCB0byByZW1vdmUgdGhlIGF0dHJpYnV0ZVxuICBmb3IgKGF0dHJOYW1lIGluIGF0dHJzKSB7XG4gICAgaWYgKFxuICAgICAgIXByZXNlcnZlW2F0dHJOYW1lXSAmJlxuICAgICAgbm9ybWFsaXplVmFsdWUob2xkQXR0cnNbYXR0ck5hbWVdKSAhPT1cbiAgICAgICAgKGF0dHJWYWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKGF0dHJzW2F0dHJOYW1lXSkpXG4gICAgKSB7XG4gICAgICBpZiAoKHNwZWNpYWxBdHRyID0gc3BlY2lhbEF0dHJzW2F0dHJOYW1lXSkpIHtcbiAgICAgICAgc3BlY2lhbEF0dHIoZnJvbUVsLCBhdHRyVmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gQVRUUl9YTElOS19IUkVGKSB7XG4gICAgICAgIGlmIChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGVOUyhOU19YTElOSywgQVRUUl9IUkVGKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlTlMoTlNfWExJTkssIEFUVFJfSFJFRiwgYXR0clZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgdGhlcmUgYXJlIGFueSBvbGQgYXR0cmlidXRlcyB0aGF0IGFyZSBub3QgaW4gdGhlIG5ldyBzZXQgb2YgYXR0cmlidXRlc1xuICAvLyB0aGVuIHdlIG5lZWQgdG8gcmVtb3ZlIHRob3NlIGF0dHJpYnV0ZXMgZnJvbSB0aGUgdGFyZ2V0IG5vZGVcbiAgLy9cbiAgLy8gTk9URTogV2UgY2FuIHNraXAgdGhpcyBpZiB0aGUgdGhlIGVsZW1lbnQgaXMga2V5ZWQgYW5kIGRpZG4ndCBoYXZlIHNwcmVhZCBhdHRyaWJ1dGVzXG4gIC8vICAgICAgIGJlY2F1c2Ugd2Uga25vdyB3ZSBhbHJlYWR5IHByb2Nlc3NlZCBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgZm9yXG4gIC8vICAgICAgIGJvdGggdGhlIHRhcmdldCBhbmQgb3JpZ2luYWwgZWxlbWVudCBzaW5jZSB0YXJnZXQgVkVsZW1lbnQgbm9kZXMgd2lsbFxuICAvLyAgICAgICBoYXZlIGFsbCBhdHRyaWJ1dGVzIGRlY2xhcmVkLiBIb3dldmVyLCB3ZSBjYW4gb25seSBza2lwIGlmIHRoZSBub2RlXG4gIC8vICAgICAgIHdhcyBub3QgYSB2aXJ0dWFsaXplZCBub2RlIChpLmUuLCBhIG5vZGUgdGhhdCB3YXMgbm90IHJlbmRlcmVkIGJ5IGFcbiAgLy8gICAgICAgTWFya28gdGVtcGxhdGUsIGJ1dCByYXRoZXIgYSBub2RlIHRoYXQgd2FzIGNyZWF0ZWQgZnJvbSBhbiBIVE1MXG4gIC8vICAgICAgIHN0cmluZyBvciBhIHJlYWwgRE9NIG5vZGUpLlxuICBpZiAodG9FbC5fX19rZXkgPT09IG51bGwgfHwgZnJvbUZsYWdzICYgRkxBR19TUFJFQURfQVRUUlMpIHtcbiAgICBmb3IgKGF0dHJOYW1lIGluIG9sZEF0dHJzKSB7XG4gICAgICBpZiAoIShhdHRyTmFtZSBpbiBhdHRycykpIHtcbiAgICAgICAgaWYgKChzcGVjaWFsQXR0ciA9IHNwZWNpYWxBdHRyc1thdHRyTmFtZV0pKSB7XG4gICAgICAgICAgc3BlY2lhbEF0dHIoZnJvbUVsLCB1bmRlZmluZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09PSBBVFRSX1hMSU5LX0hSRUYpIHtcbiAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlTlMoQVRUUl9YTElOS19IUkVGLCBBVFRSX0hSRUYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZFbGVtZW50O1xuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwicmFwdG9yLXV0aWwvaW5oZXJpdFwiKTtcbnZhciBkb21EYXRhID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZG9tLWRhdGFcIik7XG52YXIga2V5c0J5RE9NTm9kZSA9IGRvbURhdGEuX19fa2V5QnlET01Ob2RlO1xudmFyIHZFbGVtZW50QnlET01Ob2RlID0gZG9tRGF0YS5fX192RWxlbWVudEJ5RE9NTm9kZTtcbnZhciBjcmVhdGVGcmFnbWVudE5vZGUgPSByZXF1aXJlKFwiLi9tb3JwaGRvbS9mcmFnbWVudFwiKS5fX19jcmVhdGVGcmFnbWVudE5vZGU7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcblxuZnVuY3Rpb24gVkZyYWdtZW50KGtleSwgb3duZXJDb21wb25lbnQsIHByZXNlcnZlKSB7XG4gIHRoaXMuX19fVk5vZGUobnVsbCAvKiBjaGlsZENvdW50ICovLCBvd25lckNvbXBvbmVudCk7XG4gIHRoaXMuX19fa2V5ID0ga2V5O1xuICB0aGlzLl9fX3ByZXNlcnZlID0gcHJlc2VydmU7XG59XG5cblZGcmFnbWVudC5wcm90b3R5cGUgPSB7XG4gIF9fX25vZGVUeXBlOiAxMixcbiAgX19fYWN0dWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZyYWdtZW50ID0gY3JlYXRlRnJhZ21lbnROb2RlKCk7XG4gICAga2V5c0J5RE9NTm9kZS5zZXQoZnJhZ21lbnQsIHRoaXMuX19fa2V5KTtcbiAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoZnJhZ21lbnQsIHRoaXMpO1xuICAgIHJldHVybiBmcmFnbWVudDtcbiAgfSxcbn07XG5cbmluaGVyaXQoVkZyYWdtZW50LCBWTm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVkZyYWdtZW50O1xuIiwiLyoganNoaW50IG5ld2NhcDpmYWxzZSAqL1xuZnVuY3Rpb24gVk5vZGUoKSB7fVxuXG5WTm9kZS5wcm90b3R5cGUgPSB7XG4gIF9fX1ZOb2RlOiBmdW5jdGlvbiAoZmluYWxDaGlsZENvdW50LCBvd25lckNvbXBvbmVudCkge1xuICAgIHRoaXMuX19fZmluYWxDaGlsZENvdW50ID0gZmluYWxDaGlsZENvdW50O1xuICAgIHRoaXMuX19fY2hpbGRDb3VudCA9IDA7XG4gICAgdGhpcy5fX19maXJzdENoaWxkSW50ZXJuYWwgPSBudWxsO1xuICAgIHRoaXMuX19fbGFzdENoaWxkID0gbnVsbDtcbiAgICB0aGlzLl9fX3BhcmVudE5vZGUgPSBudWxsO1xuICAgIHRoaXMuX19fbmV4dFNpYmxpbmdJbnRlcm5hbCA9IG51bGw7XG4gICAgdGhpcy5fX19vd25lckNvbXBvbmVudCA9IG93bmVyQ29tcG9uZW50O1xuICB9LFxuXG4gIGdldCBfX19maXJzdENoaWxkKCkge1xuICAgIHZhciBmaXJzdENoaWxkID0gdGhpcy5fX19maXJzdENoaWxkSW50ZXJuYWw7XG5cbiAgICBpZiAoZmlyc3RDaGlsZCAmJiBmaXJzdENoaWxkLl9fX0RvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgIHZhciBuZXN0ZWRGaXJzdENoaWxkID0gZmlyc3RDaGlsZC5fX19maXJzdENoaWxkO1xuICAgICAgLy8gVGhlIGZpcnN0IGNoaWxkIGlzIGEgRG9jdW1lbnRGcmFnbWVudCBub2RlLlxuICAgICAgLy8gSWYgdGhlIERvY3VtZW50RnJhZ21lbnQgbm9kZSBoYXMgYSBmaXJzdCBjaGlsZCB0aGVuIHdlIHdpbGwgcmV0dXJuIHRoYXQuXG4gICAgICAvLyBPdGhlcndpc2UsIHRoZSBEb2N1bWVudEZyYWdtZW50IG5vZGUgaXMgbm90ICpyZWFsbHkqIHRoZSBmaXJzdCBjaGlsZCBhbmRcbiAgICAgIC8vIHdlIG5lZWQgdG8gc2tpcCB0byBpdHMgbmV4dCBzaWJsaW5nXG4gICAgICByZXR1cm4gbmVzdGVkRmlyc3RDaGlsZCB8fCBmaXJzdENoaWxkLl9fX25leHRTaWJsaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBmaXJzdENoaWxkO1xuICB9LFxuXG4gIGdldCBfX19uZXh0U2libGluZygpIHtcbiAgICB2YXIgbmV4dFNpYmxpbmcgPSB0aGlzLl9fX25leHRTaWJsaW5nSW50ZXJuYWw7XG5cbiAgICBpZiAobmV4dFNpYmxpbmcpIHtcbiAgICAgIGlmIChuZXh0U2libGluZy5fX19Eb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIHZhciBmaXJzdENoaWxkID0gbmV4dFNpYmxpbmcuX19fZmlyc3RDaGlsZDtcbiAgICAgICAgcmV0dXJuIGZpcnN0Q2hpbGQgfHwgbmV4dFNpYmxpbmcuX19fbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwYXJlbnROb2RlID0gdGhpcy5fX19wYXJlbnROb2RlO1xuICAgICAgaWYgKHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5fX19Eb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIHJldHVybiBwYXJlbnROb2RlLl9fX25leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXh0U2libGluZztcbiAgfSxcblxuICBfX19hcHBlbmRDaGlsZDogZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgdGhpcy5fX19jaGlsZENvdW50Kys7XG5cbiAgICBpZiAodGhpcy5fX19ub2RlTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICBpZiAoY2hpbGQuX19fVGV4dCkge1xuICAgICAgICB0aGlzLl9fX3ZhbHVlSW50ZXJuYWwgKz0gY2hpbGQuX19fbm9kZVZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsYXN0Q2hpbGQgPSB0aGlzLl9fX2xhc3RDaGlsZDtcblxuICAgICAgY2hpbGQuX19fcGFyZW50Tm9kZSA9IHRoaXM7XG5cbiAgICAgIGlmIChsYXN0Q2hpbGQpIHtcbiAgICAgICAgbGFzdENoaWxkLl9fX25leHRTaWJsaW5nSW50ZXJuYWwgPSBjaGlsZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX19fZmlyc3RDaGlsZEludGVybmFsID0gY2hpbGQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX19fbGFzdENoaWxkID0gY2hpbGQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9LFxuXG4gIF9fX2ZpbmlzaENoaWxkOiBmdW5jdGlvbiBmaW5pc2hDaGlsZCgpIHtcbiAgICBpZiAodGhpcy5fX19jaGlsZENvdW50ID09PSB0aGlzLl9fX2ZpbmFsQ2hpbGRDb3VudCAmJiB0aGlzLl9fX3BhcmVudE5vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fX3BhcmVudE5vZGUuX19fZmluaXNoQ2hpbGQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LFxuXG4gIC8vICx0b0pTT046IGZ1bmN0aW9uKCkge1xuICAvLyAgICAgdmFyIGNsb25lID0gT2JqZWN0LmFzc2lnbih7XG4gIC8vICAgICAgICAgbm9kZVR5cGU6IHRoaXMubm9kZVR5cGVcbiAgLy8gICAgIH0sIHRoaXMpO1xuICAvL1xuICAvLyAgICAgZm9yICh2YXIgayBpbiBjbG9uZSkge1xuICAvLyAgICAgICAgIGlmIChrLnN0YXJ0c1dpdGgoJ18nKSkge1xuICAvLyAgICAgICAgICAgICBkZWxldGUgY2xvbmVba107XG4gIC8vICAgICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgICAgZGVsZXRlIGNsb25lLl9uZXh0U2libGluZztcbiAgLy8gICAgIGRlbGV0ZSBjbG9uZS5fbGFzdENoaWxkO1xuICAvLyAgICAgZGVsZXRlIGNsb25lLnBhcmVudE5vZGU7XG4gIC8vICAgICByZXR1cm4gY2xvbmU7XG4gIC8vIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVk5vZGU7XG4iLCJ2YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCJyYXB0b3ItdXRpbC9pbmhlcml0XCIpO1xudmFyIFZOb2RlID0gcmVxdWlyZShcIi4vVk5vZGVcIik7XG5cbmZ1bmN0aW9uIFZUZXh0KHZhbHVlLCBvd25lckNvbXBvbmVudCkge1xuICB0aGlzLl9fX1ZOb2RlKC0xIC8qIG5vIGNoaWxkcmVuICovLCBvd25lckNvbXBvbmVudCk7XG4gIHRoaXMuX19fbm9kZVZhbHVlID0gdmFsdWU7XG59XG5cblZUZXh0LnByb3RvdHlwZSA9IHtcbiAgX19fVGV4dDogdHJ1ZSxcblxuICBfX19ub2RlVHlwZTogMyxcblxuICBfX19hY3R1YWxpemU6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgcmV0dXJuIChob3N0Lm93bmVyRG9jdW1lbnQgfHwgaG9zdCkuY3JlYXRlVGV4dE5vZGUodGhpcy5fX19ub2RlVmFsdWUpO1xuICB9LFxuXG4gIF9fX2Nsb25lTm9kZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVlRleHQodGhpcy5fX19ub2RlVmFsdWUpO1xuICB9LFxufTtcblxuaW5oZXJpdChWVGV4dCwgVk5vZGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZUZXh0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb21wbGFpbiA9IFwiTUFSS09fREVCVUdcIiAmJiByZXF1aXJlKFwiY29tcGxhaW5cIik7XG52YXIgY2xhc3NIZWxwZXIgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9jbGFzcy12YWx1ZVwiKTtcbnZhciBzdHlsZUhlbHBlciA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL3N0eWxlLXZhbHVlXCIpO1xudmFyIHBhcnNlSFRNTCA9IHJlcXVpcmUoXCIuLi9wYXJzZS1odG1sXCIpO1xuXG4vKipcbiAqIEhlbHBlciBmb3IgcHJvY2Vzc2luZyBkeW5hbWljIGF0dHJpYnV0ZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgaWYgKFwiTUFSS09fREVCVUdcIikge1xuICAgICAgY29tcGxhaW4oXG4gICAgICAgIFwiUGFzc2luZyBhIHN0cmluZyBhcyBhIGR5bmFtaWMgYXR0cmlidXRlIHZhbHVlIGlzIGRlcHJlY2F0ZWQgLSBNb3JlIGRldGFpbHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrby1qcy9tYXJrby93aWtpL0RlcHJlY2F0aW9uOi1TdHJpbmctYXMtZHluYW1pYy1hdHRyaWJ1dGUtdmFsdWVcIixcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUF0dHJzKGF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICB2YXIgbmV3QXR0cmlidXRlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgdmFyIHZhbCA9IGF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xuICAgICAgaWYgKGF0dHJOYW1lID09PSBcInJlbmRlckJvZHlcIikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJOYW1lID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgdmFsID0gY2xhc3NIZWxwZXIodmFsKTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwic3R5bGVcIikge1xuICAgICAgICB2YWwgPSBzdHlsZUhlbHBlcih2YWwpO1xuICAgICAgfVxuXG4gICAgICBuZXdBdHRyaWJ1dGVzW2F0dHJOYW1lXSA9IHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3QXR0cmlidXRlcztcbiAgfVxuXG4gIHJldHVybiBhdHRyaWJ1dGVzO1xufTtcblxuZnVuY3Rpb24gcGFyc2VBdHRycyhzdHIpIHtcbiAgaWYgKHN0ciA9PT0gXCJcIikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHZhciBhdHRycyA9IHBhcnNlSFRNTChcIjxhIFwiICsgc3RyICsgXCI+XCIpLmF0dHJpYnV0ZXM7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgdmFyIGF0dHI7XG5cbiAgZm9yICh2YXIgbGVuID0gYXR0cnMubGVuZ3RoLCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXR0ciA9IGF0dHJzW2ldO1xuICAgIHJlc3VsdFthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxud2luZG93Lk1hcmtvID0ge1xuICBDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHt9LFxufTtcblxuLyoqXG4gKiBNZXRob2QgaXMgZm9yIGludGVybmFsIHVzYWdlIG9ubHkuIFRoaXMgbWV0aG9kXG4gKiBpcyBpbnZva2VkIGJ5IGNvZGUgaW4gYSBjb21waWxlZCBNYXJrbyB0ZW1wbGF0ZSBhbmRcbiAqIGl0IGlzIHVzZWQgdG8gY3JlYXRlIGEgbmV3IFRlbXBsYXRlIGluc3RhbmNlLlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy50ID0gZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUodHlwZU5hbWUpIHtcbiAgcmV0dXJuIG5ldyBUZW1wbGF0ZSh0eXBlTmFtZSk7XG59O1xuXG5mdW5jdGlvbiBUZW1wbGF0ZSh0eXBlTmFtZSkge1xuICB0aGlzLnBhdGggPSB0aGlzLl9fX3R5cGVOYW1lID0gdHlwZU5hbWU7XG59XG5cbnZhciBBc3luY1ZET01CdWlsZGVyID0gcmVxdWlyZShcIi4vQXN5bmNWRE9NQnVpbGRlclwiKTtcbnJlcXVpcmUoXCIuLi9jcmVhdGVPdXRcIikuX19fc2V0Q3JlYXRlT3V0KFxuICAoVGVtcGxhdGUucHJvdG90eXBlLmNyZWF0ZU91dCA9IGZ1bmN0aW9uIGNyZWF0ZU91dChcbiAgICBnbG9iYWxEYXRhLFxuICAgIHBhcmVudCxcbiAgICBwYXJlbnRPdXQsXG4gICkge1xuICAgIHJldHVybiBuZXcgQXN5bmNWRE9NQnVpbGRlcihnbG9iYWxEYXRhLCBwYXJlbnQsIHBhcmVudE91dCk7XG4gIH0pLFxuKTtcblxucmVxdWlyZShcIi4uL3JlbmRlcmFibGVcIikoVGVtcGxhdGUucHJvdG90eXBlKTtcbiIsInZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcbnZhciBpbnNlcnRCZWZvcmUgPSBoZWxwZXJzLl9fX2luc2VydEJlZm9yZTtcblxudmFyIGZyYWdtZW50UHJvdG90eXBlID0ge1xuICBub2RlVHlwZTogMTIsXG4gIGdldCBmaXJzdENoaWxkKCkge1xuICAgIHZhciBmaXJzdENoaWxkID0gdGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmc7XG4gICAgcmV0dXJuIGZpcnN0Q2hpbGQgPT09IHRoaXMuZW5kTm9kZSA/IHVuZGVmaW5lZCA6IGZpcnN0Q2hpbGQ7XG4gIH0sXG4gIGdldCBsYXN0Q2hpbGQoKSB7XG4gICAgdmFyIGxhc3RDaGlsZCA9IHRoaXMuZW5kTm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgcmV0dXJuIGxhc3RDaGlsZCA9PT0gdGhpcy5zdGFydE5vZGUgPyB1bmRlZmluZWQgOiBsYXN0Q2hpbGQ7XG4gIH0sXG4gIGdldCBwYXJlbnROb2RlKCkge1xuICAgIHZhciBwYXJlbnROb2RlID0gdGhpcy5zdGFydE5vZGUucGFyZW50Tm9kZTtcbiAgICByZXR1cm4gcGFyZW50Tm9kZSA9PT0gdGhpcy5kZXRhY2hlZENvbnRhaW5lciA/IHVuZGVmaW5lZCA6IHBhcmVudE5vZGU7XG4gIH0sXG4gIGdldCBuYW1lc3BhY2VVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnROb2RlLnBhcmVudE5vZGUubmFtZXNwYWNlVVJJO1xuICB9LFxuICBnZXQgbmV4dFNpYmxpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kTm9kZS5uZXh0U2libGluZztcbiAgfSxcbiAgZ2V0IG5vZGVzKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgICBpZiAodGhpcy5fX19tYXJrZXJzUmVtb3ZlZEVycm9yKSB7XG4gICAgICAgIHRocm93IHRoaXMuX19fbWFya2Vyc1JlbW92ZWRFcnJvcihcIkNhbm5vdCBnZXQgZnJhZ21lbnQgbm9kZXMuXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuc3RhcnROb2RlO1xuICAgIHdoaWxlIChjdXJyZW50ICE9PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgIG5vZGVzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgbm9kZXMucHVzaChjdXJyZW50KTtcbiAgICByZXR1cm4gbm9kZXM7XG4gIH0sXG4gIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKG5ld0NoaWxkTm9kZSwgcmVmZXJlbmNlTm9kZSkge1xuICAgIHZhciBhY3R1YWxSZWZlcmVuY2UgPSByZWZlcmVuY2VOb2RlID09IG51bGwgPyB0aGlzLmVuZE5vZGUgOiByZWZlcmVuY2VOb2RlO1xuICAgIHJldHVybiBpbnNlcnRCZWZvcmUoXG4gICAgICBuZXdDaGlsZE5vZGUsXG4gICAgICBhY3R1YWxSZWZlcmVuY2UsXG4gICAgICB0aGlzLnN0YXJ0Tm9kZS5wYXJlbnROb2RlLFxuICAgICk7XG4gIH0sXG4gIGluc2VydEludG86IGZ1bmN0aW9uIChuZXdQYXJlbnROb2RlLCByZWZlcmVuY2VOb2RlKSB7XG4gICAgdGhpcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBpbnNlcnRCZWZvcmUobm9kZSwgcmVmZXJlbmNlTm9kZSwgbmV3UGFyZW50Tm9kZSk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgdGhpcy5kZXRhY2hlZENvbnRhaW5lci5hcHBlbmRDaGlsZChub2RlKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50Tm9kZShzdGFydE5vZGUsIG5leHROb2RlLCBwYXJlbnROb2RlKSB7XG4gIHZhciBmcmFnbWVudCA9IE9iamVjdC5jcmVhdGUoZnJhZ21lbnRQcm90b3R5cGUpO1xuICB2YXIgaXNSb290ID0gc3RhcnROb2RlICYmIHN0YXJ0Tm9kZS5vd25lckRvY3VtZW50ID09PSBzdGFydE5vZGUucGFyZW50Tm9kZTtcbiAgZnJhZ21lbnQuc3RhcnROb2RlID0gaXNSb290XG4gICAgPyBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiXCIpXG4gICAgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgZnJhZ21lbnQuZW5kTm9kZSA9IGlzUm9vdFxuICAgID8gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIlwiKVxuICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gIGZyYWdtZW50LnN0YXJ0Tm9kZS5mcmFnbWVudCA9IGZyYWdtZW50O1xuICBmcmFnbWVudC5lbmROb2RlLmZyYWdtZW50ID0gZnJhZ21lbnQ7XG4gIHZhciBkZXRhY2hlZENvbnRhaW5lciA9IChmcmFnbWVudC5kZXRhY2hlZENvbnRhaW5lciA9XG4gICAgZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKTtcbiAgcGFyZW50Tm9kZSA9XG4gICAgcGFyZW50Tm9kZSB8fCAoc3RhcnROb2RlICYmIHN0YXJ0Tm9kZS5wYXJlbnROb2RlKSB8fCBkZXRhY2hlZENvbnRhaW5lcjtcbiAgaW5zZXJ0QmVmb3JlKGZyYWdtZW50LnN0YXJ0Tm9kZSwgc3RhcnROb2RlLCBwYXJlbnROb2RlKTtcbiAgaW5zZXJ0QmVmb3JlKGZyYWdtZW50LmVuZE5vZGUsIG5leHROb2RlLCBwYXJlbnROb2RlKTtcbiAgcmV0dXJuIGZyYWdtZW50O1xufVxuXG5mdW5jdGlvbiBiZWdpbkZyYWdtZW50Tm9kZShzdGFydE5vZGUsIHBhcmVudE5vZGUpIHtcbiAgdmFyIGZyYWdtZW50ID0gY3JlYXRlRnJhZ21lbnROb2RlKHN0YXJ0Tm9kZSwgbnVsbCwgcGFyZW50Tm9kZSk7XG4gIGZyYWdtZW50Ll9fX2ZpbmlzaEZyYWdtZW50ID0gZnVuY3Rpb24gKG5leHROb2RlKSB7XG4gICAgZnJhZ21lbnQuX19fZmluaXNoRnJhZ21lbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZShcbiAgICAgIGZyYWdtZW50LmVuZE5vZGUsXG4gICAgICBuZXh0Tm9kZSxcbiAgICAgIHBhcmVudE5vZGUgfHwgc3RhcnROb2RlLnBhcmVudE5vZGUsXG4gICAgKTtcbiAgfTtcbiAgcmV0dXJuIGZyYWdtZW50O1xufVxuXG5leHBvcnRzLl9fX2NyZWF0ZUZyYWdtZW50Tm9kZSA9IGNyZWF0ZUZyYWdtZW50Tm9kZTtcbmV4cG9ydHMuX19fYmVnaW5GcmFnbWVudE5vZGUgPSBiZWdpbkZyYWdtZW50Tm9kZTtcbiIsImZ1bmN0aW9uIGluc2VydEJlZm9yZShub2RlLCByZWZlcmVuY2VOb2RlLCBwYXJlbnROb2RlKSB7XG4gIGlmIChub2RlLmluc2VydEludG8pIHtcbiAgICByZXR1cm4gbm9kZS5pbnNlcnRJbnRvKHBhcmVudE5vZGUsIHJlZmVyZW5jZU5vZGUpO1xuICB9XG4gIHJldHVybiBwYXJlbnROb2RlLmluc2VydEJlZm9yZShcbiAgICBub2RlLFxuICAgIChyZWZlcmVuY2VOb2RlICYmIHJlZmVyZW5jZU5vZGUuc3RhcnROb2RlKSB8fCByZWZlcmVuY2VOb2RlLFxuICApO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRBZnRlcihub2RlLCByZWZlcmVuY2VOb2RlLCBwYXJlbnROb2RlKSB7XG4gIHJldHVybiBpbnNlcnRCZWZvcmUoXG4gICAgbm9kZSxcbiAgICByZWZlcmVuY2VOb2RlICYmIHJlZmVyZW5jZU5vZGUubmV4dFNpYmxpbmcsXG4gICAgcGFyZW50Tm9kZSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gbmV4dFNpYmxpbmcobm9kZSkge1xuICB2YXIgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmc7XG4gIHZhciBmcmFnbWVudCA9IG5leHQgJiYgbmV4dC5mcmFnbWVudDtcbiAgaWYgKGZyYWdtZW50KSB7XG4gICAgcmV0dXJuIG5leHQgPT09IGZyYWdtZW50LnN0YXJ0Tm9kZSA/IGZyYWdtZW50IDogbnVsbDtcbiAgfVxuICByZXR1cm4gbmV4dDtcbn1cblxuZnVuY3Rpb24gZmlyc3RDaGlsZChub2RlKSB7XG4gIHZhciBuZXh0ID0gbm9kZS5maXJzdENoaWxkO1xuICByZXR1cm4gKG5leHQgJiYgbmV4dC5mcmFnbWVudCkgfHwgbmV4dDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGQobm9kZSkge1xuICBpZiAobm9kZS5yZW1vdmUpIG5vZGUucmVtb3ZlKCk7XG4gIGVsc2Ugbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuXG5leHBvcnRzLl9fX2luc2VydEJlZm9yZSA9IGluc2VydEJlZm9yZTtcbmV4cG9ydHMuX19faW5zZXJ0QWZ0ZXIgPSBpbnNlcnRBZnRlcjtcbmV4cG9ydHMuX19fbmV4dFNpYmxpbmcgPSBuZXh0U2libGluZztcbmV4cG9ydHMuX19fZmlyc3RDaGlsZCA9IGZpcnN0Q2hpbGQ7XG5leHBvcnRzLl9fX3JlbW92ZUNoaWxkID0gcmVtb3ZlQ2hpbGQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb21wb25lbnRzVXRpbCA9IHJlcXVpcmUoXCJAaW50ZXJuYWwvY29tcG9uZW50cy11dGlsXCIpO1xudmFyIGV4aXN0aW5nQ29tcG9uZW50TG9va3VwID0gY29tcG9uZW50c1V0aWwuX19fY29tcG9uZW50TG9va3VwO1xudmFyIGRlc3Ryb3lOb2RlUmVjdXJzaXZlID0gY29tcG9uZW50c1V0aWwuX19fZGVzdHJveU5vZGVSZWN1cnNpdmU7XG52YXIgYWRkQ29tcG9uZW50Um9vdFRvS2V5ZWRFbGVtZW50cyA9XG4gIGNvbXBvbmVudHNVdGlsLl9fX2FkZENvbXBvbmVudFJvb3RUb0tleWVkRWxlbWVudHM7XG52YXIgbm9ybWFsaXplQ29tcG9uZW50S2V5ID0gY29tcG9uZW50c1V0aWwuX19fbm9ybWFsaXplQ29tcG9uZW50S2V5O1xudmFyIGRvbURhdGEgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9kb20tZGF0YVwiKTtcbnZhciBldmVudERlbGVnYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9ldmVudC1kZWxlZ2F0aW9uXCIpO1xudmFyIEtleVNlcXVlbmNlID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvS2V5U2VxdWVuY2VcIik7XG52YXIgVkVsZW1lbnQgPSByZXF1aXJlKFwiLi4vdmRvbVwiKS5fX19WRWxlbWVudDtcbnZhciBmcmFnbWVudCA9IHJlcXVpcmUoXCIuL2ZyYWdtZW50XCIpO1xudmFyIGhlbHBlcnMgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xudmFyIHZpcnR1YWxpemVFbGVtZW50ID0gVkVsZW1lbnQuX19fdmlydHVhbGl6ZTtcbnZhciBtb3JwaEF0dHJzID0gVkVsZW1lbnQuX19fbW9ycGhBdHRycztcbnZhciBrZXlzQnlET01Ob2RlID0gZG9tRGF0YS5fX19rZXlCeURPTU5vZGU7XG52YXIgY29tcG9uZW50QnlET01Ob2RlID0gZG9tRGF0YS5fX19jb21wb25lbnRCeURPTU5vZGU7XG52YXIgdkVsZW1lbnRCeURPTU5vZGUgPSBkb21EYXRhLl9fX3ZFbGVtZW50QnlET01Ob2RlO1xudmFyIGRldGFjaGVkQnlET01Ob2RlID0gZG9tRGF0YS5fX19kZXRhY2hlZEJ5RE9NTm9kZTtcblxudmFyIGluc2VydEJlZm9yZSA9IGhlbHBlcnMuX19faW5zZXJ0QmVmb3JlO1xudmFyIGluc2VydEFmdGVyID0gaGVscGVycy5fX19pbnNlcnRBZnRlcjtcbnZhciBuZXh0U2libGluZyA9IGhlbHBlcnMuX19fbmV4dFNpYmxpbmc7XG52YXIgZmlyc3RDaGlsZCA9IGhlbHBlcnMuX19fZmlyc3RDaGlsZDtcbnZhciByZW1vdmVDaGlsZCA9IGhlbHBlcnMuX19fcmVtb3ZlQ2hpbGQ7XG52YXIgY3JlYXRlRnJhZ21lbnROb2RlID0gZnJhZ21lbnQuX19fY3JlYXRlRnJhZ21lbnROb2RlO1xudmFyIGJlZ2luRnJhZ21lbnROb2RlID0gZnJhZ21lbnQuX19fYmVnaW5GcmFnbWVudE5vZGU7XG5cbnZhciBFTEVNRU5UX05PREUgPSAxO1xudmFyIFRFWFRfTk9ERSA9IDM7XG52YXIgQ09NTUVOVF9OT0RFID0gODtcbnZhciBDT01QT05FTlRfTk9ERSA9IDI7XG52YXIgRlJBR01FTlRfTk9ERSA9IDEyO1xudmFyIERPQ1RZUEVfTk9ERSA9IDEwO1xuXG4vLyB2YXIgRkxBR19TSU1QTEVfQVRUUlMgPSAxO1xuLy8gdmFyIEZMQUdfQ1VTVE9NX0VMRU1FTlQgPSAyO1xuLy8gdmFyIEZMQUdfU1BSRUFEX0FUVFJTID0gNDtcblxuZnVuY3Rpb24gaXNBdXRvS2V5KGtleSkge1xuICByZXR1cm4ga2V5WzBdICE9PSBcIkBcIjtcbn1cblxuZnVuY3Rpb24gY29tcGFyZU5vZGVOYW1lcyhmcm9tRWwsIHRvRWwpIHtcbiAgcmV0dXJuIGZyb21FbC5fX19ub2RlTmFtZSA9PT0gdG9FbC5fX19ub2RlTmFtZTtcbn1cblxuZnVuY3Rpb24gY2FzZUluc2Vuc2l0aXZlQ29tcGFyZShhLCBiKSB7XG4gIHJldHVybiBhLnRvTG93ZXJDYXNlKCkgPT09IGIudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gb25Ob2RlQWRkZWQobm9kZSwgY29tcG9uZW50c0NvbnRleHQpIHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgIGV2ZW50RGVsZWdhdGlvbi5fX19oYW5kbGVOb2RlQXR0YWNoKG5vZGUsIGNvbXBvbmVudHNDb250ZXh0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBob3N0LCBjb21wb25lbnRzQ29udGV4dCkge1xuICB2YXIgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQ7XG4gIHZhciBpc0h5ZHJhdGUgPSBmYWxzZTtcbiAgdmFyIGtleVNlcXVlbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgaWYgKGNvbXBvbmVudHNDb250ZXh0KSB7XG4gICAgZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQgPSBjb21wb25lbnRzQ29udGV4dC5fX19nbG9iYWxDb250ZXh0O1xuICAgIGlzSHlkcmF0ZSA9IGdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX2lzSHlkcmF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgIHZOb2RlLFxuICAgIGtleSxcbiAgICByZWZlcmVuY2VFbCxcbiAgICBwYXJlbnRFbCxcbiAgICBvd25lckNvbXBvbmVudCxcbiAgICBwYXJlbnRDb21wb25lbnQsXG4gICkge1xuICAgIHZhciByZWFsTm9kZSA9IHZOb2RlLl9fX2FjdHVhbGl6ZShob3N0LCBwYXJlbnRFbC5uYW1lc3BhY2VVUkkpO1xuICAgIGluc2VydEJlZm9yZShyZWFsTm9kZSwgcmVmZXJlbmNlRWwsIHBhcmVudEVsKTtcblxuICAgIGlmIChcbiAgICAgIHZOb2RlLl9fX25vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHxcbiAgICAgIHZOb2RlLl9fX25vZGVUeXBlID09PSBGUkFHTUVOVF9OT0RFXG4gICAgKSB7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGtleXNCeURPTU5vZGUuc2V0KHJlYWxOb2RlLCBrZXkpO1xuICAgICAgICAoaXNBdXRvS2V5KGtleSkgPyBwYXJlbnRDb21wb25lbnQgOiBvd25lckNvbXBvbmVudCkuX19fa2V5ZWRFbGVtZW50c1tcbiAgICAgICAgICBrZXlcbiAgICAgICAgXSA9IHJlYWxOb2RlO1xuICAgICAgfVxuXG4gICAgICBpZiAodk5vZGUuX19fbm9kZU5hbWUgIT09IFwidGV4dGFyZWFcIikge1xuICAgICAgICBtb3JwaENoaWxkcmVuKHJlYWxOb2RlLCB2Tm9kZSwgcGFyZW50Q29tcG9uZW50KTtcbiAgICAgIH1cblxuICAgICAgb25Ob2RlQWRkZWQocmVhbE5vZGUsIGNvbXBvbmVudHNDb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnRWaXJ0dWFsQ29tcG9uZW50QmVmb3JlKFxuICAgIHZDb21wb25lbnQsXG4gICAgcmVmZXJlbmNlTm9kZSxcbiAgICByZWZlcmVuY2VOb2RlUGFyZW50RWwsXG4gICAgY29tcG9uZW50LFxuICAgIGtleSxcbiAgICBvd25lckNvbXBvbmVudCxcbiAgICBwYXJlbnRDb21wb25lbnQsXG4gICkge1xuICAgIHZhciByb290Tm9kZSA9IChjb21wb25lbnQuX19fcm9vdE5vZGUgPSBpbnNlcnRCZWZvcmUoXG4gICAgICBjcmVhdGVGcmFnbWVudE5vZGUoKSxcbiAgICAgIHJlZmVyZW5jZU5vZGUsXG4gICAgICByZWZlcmVuY2VOb2RlUGFyZW50RWwsXG4gICAgKSk7XG4gICAgY29tcG9uZW50QnlET01Ob2RlLnNldChyb290Tm9kZSwgY29tcG9uZW50KTtcblxuICAgIGlmIChrZXkgJiYgb3duZXJDb21wb25lbnQpIHtcbiAgICAgIGtleSA9IG5vcm1hbGl6ZUNvbXBvbmVudEtleShrZXksIHBhcmVudENvbXBvbmVudC5pZCk7XG4gICAgICBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzKFxuICAgICAgICBvd25lckNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzLFxuICAgICAgICBrZXksXG4gICAgICAgIHJvb3ROb2RlLFxuICAgICAgICBjb21wb25lbnQuaWQsXG4gICAgICApO1xuICAgICAga2V5c0J5RE9NTm9kZS5zZXQocm9vdE5vZGUsIGtleSk7XG4gICAgfVxuXG4gICAgbW9ycGhDb21wb25lbnQoY29tcG9uZW50LCB2Q29tcG9uZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vcnBoQ29tcG9uZW50KGNvbXBvbmVudCwgdkNvbXBvbmVudCkge1xuICAgIG1vcnBoQ2hpbGRyZW4oY29tcG9uZW50Ll9fX3Jvb3ROb2RlLCB2Q29tcG9uZW50LCBjb21wb25lbnQpO1xuICB9XG5cbiAgdmFyIGRldGFjaGVkTm9kZXMgPSBbXTtcblxuICBmdW5jdGlvbiBkZXRhY2hOb2RlKG5vZGUsIHBhcmVudE5vZGUsIG93bmVyQ29tcG9uZW50KSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBGUkFHTUVOVF9OT0RFKSB7XG4gICAgICBkZXRhY2hlZE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICBkZXRhY2hlZEJ5RE9NTm9kZS5zZXQobm9kZSwgb3duZXJDb21wb25lbnQgfHwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKG5vZGUpO1xuICAgICAgcmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveUNvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICBjb21wb25lbnQuZGVzdHJveSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tTm9kZSwgdG9Ob2RlLCBwYXJlbnRDb21wb25lbnQpIHtcbiAgICB2YXIgY3VyRnJvbU5vZGVDaGlsZCA9IGZpcnN0Q2hpbGQoZnJvbU5vZGUpO1xuICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvTm9kZS5fX19maXJzdENoaWxkO1xuXG4gICAgdmFyIGN1clRvTm9kZUtleTtcbiAgICB2YXIgY3VyRnJvbU5vZGVLZXk7XG4gICAgdmFyIGN1clRvTm9kZVR5cGU7XG5cbiAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgIHZhciB0b05leHRTaWJsaW5nO1xuICAgIHZhciBtYXRjaGluZ0Zyb21FbDtcbiAgICB2YXIgbWF0Y2hpbmdGcm9tQ29tcG9uZW50O1xuICAgIHZhciBjdXJWRnJvbU5vZGVDaGlsZDtcbiAgICB2YXIgZnJvbUNvbXBvbmVudDtcblxuICAgIG91dGVyOiB3aGlsZSAoY3VyVG9Ob2RlQ2hpbGQpIHtcbiAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5fX19uZXh0U2libGluZztcbiAgICAgIGN1clRvTm9kZVR5cGUgPSBjdXJUb05vZGVDaGlsZC5fX19ub2RlVHlwZTtcbiAgICAgIGN1clRvTm9kZUtleSA9IGN1clRvTm9kZUNoaWxkLl9fX2tleTtcblxuICAgICAgLy8gU2tpcCA8IWRvY3R5cGU+XG4gICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZCAmJiBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlID09PSBET0NUWVBFX05PREUpIHtcbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3duZXJDb21wb25lbnQgPSBjdXJUb05vZGVDaGlsZC5fX19vd25lckNvbXBvbmVudCB8fCBwYXJlbnRDb21wb25lbnQ7XG4gICAgICB2YXIgcmVmZXJlbmNlQ29tcG9uZW50O1xuXG4gICAgICBpZiAoY3VyVG9Ob2RlVHlwZSA9PT0gQ09NUE9ORU5UX05PREUpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IGN1clRvTm9kZUNoaWxkLl9fX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChtYXRjaGluZ0Zyb21Db21wb25lbnQgPSBleGlzdGluZ0NvbXBvbmVudExvb2t1cFtjb21wb25lbnQuaWRdKSA9PT1cbiAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKGlzSHlkcmF0ZSkge1xuICAgICAgICAgICAgdmFyIHJvb3ROb2RlID0gYmVnaW5GcmFnbWVudE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUpO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fX3Jvb3ROb2RlID0gcm9vdE5vZGU7XG4gICAgICAgICAgICBjb21wb25lbnRCeURPTU5vZGUuc2V0KHJvb3ROb2RlLCBjb21wb25lbnQpO1xuXG4gICAgICAgICAgICBpZiAob3duZXJDb21wb25lbnQgJiYgY3VyVG9Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgIGN1clRvTm9kZUtleSA9IG5vcm1hbGl6ZUNvbXBvbmVudEtleShcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LmlkLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBhZGRDb21wb25lbnRSb290VG9LZXllZEVsZW1lbnRzKFxuICAgICAgICAgICAgICAgIG93bmVyQ29tcG9uZW50Ll9fX2tleWVkRWxlbWVudHMsXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICAgIHJvb3ROb2RlLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pZCxcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBrZXlzQnlET01Ob2RlLnNldChyb290Tm9kZSwgY3VyVG9Ob2RlS2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW9ycGhDb21wb25lbnQoY29tcG9uZW50LCBjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBuZXh0U2libGluZyhyb290Tm9kZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc2VydFZpcnR1YWxDb21wb25lbnRCZWZvcmUoXG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LFxuICAgICAgICAgICAgICBjdXJUb05vZGVLZXksXG4gICAgICAgICAgICAgIG93bmVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobWF0Y2hpbmdGcm9tQ29tcG9uZW50Ll9fX3Jvb3ROb2RlICE9PSBjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgJiZcbiAgICAgICAgICAgICAgKGZyb21Db21wb25lbnQgPSBjb21wb25lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpKSAmJlxuICAgICAgICAgICAgICBnbG9iYWxDb21wb25lbnRzQ29udGV4dC5fX19yZW5kZXJlZENvbXBvbmVudHNCeUlkW1xuICAgICAgICAgICAgICAgIGZyb21Db21wb25lbnQuaWRcbiAgICAgICAgICAgICAgXSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgLy8gVGhlIGNvbXBvbmVudCBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgcmVhbCBET00gbm9kZSB3YXMgbm90IHJlbmRlcmVkXG4gICAgICAgICAgICAgIC8vIHNvIHdlIHNob3VsZCBqdXN0IHJlbW92ZSBpdCBvdXQgb2YgdGhlIHJlYWwgRE9NIGJ5IGRlc3Ryb3lpbmcgaXRcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG5leHRTaWJsaW5nKGZyb21Db21wb25lbnQuX19fcm9vdE5vZGUpO1xuICAgICAgICAgICAgICBkZXN0cm95Q29tcG9uZW50KGZyb21Db21wb25lbnQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBtb3ZlIHRoZSBleGlzdGluZyBjb21wb25lbnQgaW50b1xuICAgICAgICAgICAgLy8gdGhlIGNvcnJlY3QgbG9jYXRpb25cbiAgICAgICAgICAgIGluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgbWF0Y2hpbmdGcm9tQ29tcG9uZW50Ll9fX3Jvb3ROb2RlLFxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICBmcm9tTm9kZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPVxuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkICYmIG5leHRTaWJsaW5nKGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUpIHtcbiAgICAgICAgICAgIG1vcnBoQ29tcG9uZW50KGNvbXBvbmVudCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2UgaWYgKGN1clRvTm9kZUtleSkge1xuICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBjdXJUb05vZGVLZXlPcmlnaW5hbCA9IGN1clRvTm9kZUtleTtcblxuICAgICAgICBpZiAoaXNBdXRvS2V5KGN1clRvTm9kZUtleSkpIHtcbiAgICAgICAgICBpZiAob3duZXJDb21wb25lbnQgIT09IHBhcmVudENvbXBvbmVudCkge1xuICAgICAgICAgICAgY3VyVG9Ob2RlS2V5ICs9IFwiOlwiICsgb3duZXJDb21wb25lbnQuaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudCA9IHBhcmVudENvbXBvbmVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQgPSBvd25lckNvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGhhdmUgYSBrZXllZCBlbGVtZW50LiBUaGlzIGlzIHRoZSBmYXN0IHBhdGggZm9yIG1hdGNoaW5nXG4gICAgICAgIC8vIHVwIGVsZW1lbnRzXG4gICAgICAgIGN1clRvTm9kZUtleSA9IChcbiAgICAgICAgICBrZXlTZXF1ZW5jZXNbcmVmZXJlbmNlQ29tcG9uZW50LmlkXSB8fFxuICAgICAgICAgIChrZXlTZXF1ZW5jZXNbcmVmZXJlbmNlQ29tcG9uZW50LmlkXSA9IG5ldyBLZXlTZXF1ZW5jZSgpKVxuICAgICAgICApLl9fX25leHRLZXkoY3VyVG9Ob2RlS2V5KTtcblxuICAgICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0ga2V5c0J5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2RWxlbWVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkgPT09IGN1clRvTm9kZUtleSkge1xuICAgICAgICAgIC8vIEVsZW1lbnRzIGxpbmUgdXAuIE5vdyB3ZSBqdXN0IGhhdmUgdG8gbWFrZSBzdXJlIHRoZXkgYXJlIGNvbXBhdGlibGVcbiAgICAgICAgICBpZiAoIWN1clRvTm9kZUNoaWxkLl9fX3ByZXNlcnZlKSB7XG4gICAgICAgICAgICAvLyBXZSBqdXN0IHNraXAgb3ZlciB0aGUgZnJvbU5vZGUgaWYgaXQgaXMgcHJlc2VydmVkXG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgJiZcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlVHlwZSA9PT0gY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZVR5cGUgJiZcbiAgICAgICAgICAgICAgKGN1clRvTm9kZVR5cGUgIT09IEVMRU1FTlRfTk9ERSB8fFxuICAgICAgICAgICAgICAgIGNvbXBhcmVOb2RlTmFtZXMoY3VyVG9Ob2RlQ2hpbGQsIGN1clZGcm9tTm9kZUNoaWxkKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgbW9ycGhFbChcbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9ycGhDaGlsZHJlbihcbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIG9sZCBub2RlXG4gICAgICAgICAgICAgIGRldGFjaE5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUsIG93bmVyQ29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAvLyBJbmNvbXBhdGlibGUgbm9kZXMuIEp1c3QgbW92ZSB0aGUgdGFyZ2V0IFZOb2RlIGludG8gdGhlIERPTSBhdCB0aGlzIHBvc2l0aW9uXG4gICAgICAgICAgICAgIGluc2VydFZpcnR1YWxOb2RlQmVmb3JlKFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICAgIG93bmVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF0Y2hpbmdGcm9tRWwgPSByZWZlcmVuY2VDb21wb25lbnQuX19fa2V5ZWRFbGVtZW50c1tjdXJUb05vZGVLZXldO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG1hdGNoaW5nRnJvbUVsID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIG1hdGNoaW5nRnJvbUVsID09PSBjdXJGcm9tTm9kZUNoaWxkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoaXNIeWRyYXRlICYmIGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIChjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSB8fFxuICAgICAgICAgICAgICAgICAgY2FzZUluc2Vuc2l0aXZlQ29tcGFyZShcbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZU5hbWUgfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdmlydHVhbGl6ZUVsZW1lbnQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQuX19fbm9kZU5hbWUgPSBjdXJUb05vZGVDaGlsZC5fX19ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBrZXlzQnlET01Ob2RlLnNldChjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVLZXkpO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2N1clRvTm9kZUtleV0gPVxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZDtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5fX19wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgICAgICAgdkVsZW1lbnRCeURPTU5vZGUuc2V0KGN1ckZyb21Ob2RlQ2hpbGQsIGN1clZGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbW9ycGhFbChcbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLl9fX25vZGVUeXBlID09PSBGUkFHTUVOVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT0gXCJGI1wiICsgY3VyVG9Ob2RlS2V5T3JpZ2luYWwpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbmROb2RlID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgIHZhciBkZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgICB2YXIgbm9kZVZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kTm9kZS5ub2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbm9kZVZhbHVlID0gZW5kTm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVWYWx1ZSA9PT0gXCJGL1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVwdGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZVZhbHVlLmluZGV4T2YoXCJGI1wiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGgrKztcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZSA9IGVuZE5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIHZhciBmcmFnbWVudCA9IGNyZWF0ZUZyYWdtZW50Tm9kZShcbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZS5uZXh0U2libGluZyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAga2V5c0J5RE9NTm9kZS5zZXQoZnJhZ21lbnQsIGN1clRvTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICB2RWxlbWVudEJ5RE9NTm9kZS5zZXQoZnJhZ21lbnQsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZUNvbXBvbmVudC5fX19rZXllZEVsZW1lbnRzW2N1clRvTm9kZUtleV0gPSBmcmFnbWVudDtcbiAgICAgICAgICAgICAgICAgIHJlbW92ZUNoaWxkKGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGQoZW5kTm9kZSk7XG5cbiAgICAgICAgICAgICAgICAgIGlmICghY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhDaGlsZHJlbihmcmFnbWVudCwgY3VyVG9Ob2RlQ2hpbGQsIHBhcmVudENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcmFnbWVudC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnNlcnRWaXJ0dWFsTm9kZUJlZm9yZShcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgICAgICAgIG93bmVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRldGFjaGVkQnlET01Ob2RlLmdldChtYXRjaGluZ0Zyb21FbCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBkZXRhY2hlZEJ5RE9NTm9kZS5zZXQobWF0Y2hpbmdGcm9tRWwsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY3VyVG9Ob2RlQ2hpbGQuX19fcHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2RWxlbWVudEJ5RE9NTm9kZS5nZXQobWF0Y2hpbmdGcm9tRWwpO1xuXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZCAmJlxuICAgICAgICAgICAgICAgIGN1clRvTm9kZVR5cGUgPT09IGN1clZGcm9tTm9kZUNoaWxkLl9fX25vZGVUeXBlICYmXG4gICAgICAgICAgICAgICAgKGN1clRvTm9kZVR5cGUgIT09IEVMRU1FTlRfTk9ERSB8fFxuICAgICAgICAgICAgICAgICAgY29tcGFyZU5vZGVOYW1lcyhjdXJWRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbU5leHRTaWJsaW5nID09PSBtYXRjaGluZ0Zyb21FbCkge1xuICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlIGVsZW1lbnQgcmVtb3ZhbDpcbiAgICAgICAgICAgICAgICAgIC8vIEEgPC0+IEFcbiAgICAgICAgICAgICAgICAgIC8vIEIgPC0+IEMgPC0tIFdlIGFyZSBoZXJlXG4gICAgICAgICAgICAgICAgICAvLyBDICAgICBEXG4gICAgICAgICAgICAgICAgICAvLyBEXG4gICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlIGVsZW1lbnQgc3dhcDpcbiAgICAgICAgICAgICAgICAgIC8vIEEgPC0+IEFcbiAgICAgICAgICAgICAgICAgIC8vIEIgPC0+IEMgPC0tIFdlIGFyZSBoZXJlXG4gICAgICAgICAgICAgICAgICAvLyBDICAgICBCXG5cbiAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdG9OZXh0U2libGluZyAmJlxuICAgICAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nLl9fX2tleSA9PT0gY3VyRnJvbU5vZGVLZXlcbiAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgZWxlbWVudCBzd2FwXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2FudCB0byBzdGF5IG9uIHRoZSBjdXJyZW50IHJlYWwgRE9NIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBCdXQgbW92ZSB0aGUgbWF0Y2hpbmcgZWxlbWVudCBpbnRvIHBsYWNlXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShtYXRjaGluZ0Zyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlIGVsZW1lbnQgcmVtb3ZhbFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gcmVtb3ZlIHRoZSBjdXJyZW50IHJlYWwgRE9NIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZSBtYXRjaGluZyByZWFsIERPTSBub2RlIHdpbGwgZmFsbCBpbnRvXG4gICAgICAgICAgICAgICAgICAgIC8vIHBsYWNlLiBXZSB3aWxsIGNvbnRpbnVlIGRpZmZpbmcgd2l0aCBuZXh0IHNpYmxpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIHJlYWwgRE9NIG5vZGUgdGhhdCBqdXN0IGZlbGwgaW50byBwbGFjZVxuICAgICAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBuZXh0U2libGluZyhmcm9tTmV4dFNpYmxpbmcpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZGV0YWNoTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSwgb3duZXJDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIEEgPC0+IEFcbiAgICAgICAgICAgICAgICAgIC8vIEIgPC0+IEQgPC0tIFdlIGFyZSBoZXJlXG4gICAgICAgICAgICAgICAgICAvLyBDXG4gICAgICAgICAgICAgICAgICAvLyBEXG5cbiAgICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gbW92ZSB0aGUgbWF0Y2hpbmcgbm9kZSBpbnRvIHBsYWNlXG4gICAgICAgICAgICAgICAgICBpbnNlcnRBZnRlcihtYXRjaGluZ0Zyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgZnJvbU5vZGUpO1xuXG4gICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICBkZXRhY2hOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlLCBvd25lckNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgbW9ycGhFbChcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmdGcm9tRWwsXG4gICAgICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbW9ycGhDaGlsZHJlbihcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmdGcm9tRWwsXG4gICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnNlcnRWaXJ0dWFsTm9kZUJlZm9yZShcbiAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlS2V5LFxuICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgICAgICAgICAgIGZyb21Ob2RlLFxuICAgICAgICAgICAgICAgICAgb3duZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBkZXRhY2hOb2RlKG1hdGNoaW5nRnJvbUVsLCBmcm9tTm9kZSwgb3duZXJDb21wb25lbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBwcmVzZXJ2ZSB0aGUgbm9kZVxuICAgICAgICAgICAgICAvLyBidXQgc3RpbGwgd2UgbmVlZCB0byBkaWZmIHRoZSBjdXJyZW50IGZyb20gbm9kZVxuICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21Ob2RlKTtcbiAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUga25vdyB0aGUgdGFyZ2V0IG5vZGUgaXMgbm90IGEgVkNvbXBvbmVudCBub2RlIGFuZCB3ZSBrbm93XG4gICAgICAvLyBpdCBpcyBhbHNvIG5vdCBhIHByZXNlcnZlIG5vZGUuIExldCdzIG5vdyBtYXRjaCB1cCB0aGUgSFRNTFxuICAgICAgLy8gZWxlbWVudCwgdGV4dCBub2RlLCBjb21tZW50LCBldGMuXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICBpZiAoKGZyb21Db21wb25lbnQgPSBjb21wb25lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpKSkge1xuICAgICAgICAgIC8vIFRoZSBjdXJyZW50IFwidG9cIiBlbGVtZW50IGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYSBjb21wb25lbnQsXG4gICAgICAgICAgLy8gYnV0IHRoZSBjdXJyZW50IFwiZnJvbVwiIGVsZW1lbnQgaXMgYXNzb2NpYXRlZCB3aXRoIGEgY29tcG9uZW50XG5cbiAgICAgICAgICAvLyBFdmVuIGlmIHdlIGRlc3Ryb3kgdGhlIGN1cnJlbnQgY29tcG9uZW50IGluIHRoZSBvcmlnaW5hbFxuICAgICAgICAgIC8vIERPTSBvciBub3QsIHdlIHN0aWxsIG5lZWQgdG8gc2tpcCBvdmVyIGl0IHNpbmNlIGl0IGlzXG4gICAgICAgICAgLy8gbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgY3VycmVudCBcInRvXCIgbm9kZVxuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhZ2xvYmFsQ29tcG9uZW50c0NvbnRleHQuX19fcmVuZGVyZWRDb21wb25lbnRzQnlJZFtmcm9tQ29tcG9uZW50LmlkXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgZGVzdHJveUNvbXBvbmVudChmcm9tQ29tcG9uZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZTsgLy8gTW92ZSB0byB0aGUgbmV4dCBcImZyb21cIiBub2RlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3VyRnJvbU5vZGVUeXBlID0gY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZTtcblxuICAgICAgICB2YXIgaXNDb21wYXRpYmxlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZVR5cGUpIHtcbiAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIEVsZW1lbnQgbm9kZXNcbiAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdkVsZW1lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgaWYgKGN1clZGcm9tTm9kZUNoaWxkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgaWYgKGlzSHlkcmF0ZSkge1xuICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkID0gdmlydHVhbGl6ZUVsZW1lbnQoY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBjYXNlSW5zZW5zaXRpdmVDb21wYXJlKFxuICAgICAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQuX19fbm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjdXJWRnJvbU5vZGVDaGlsZC5fX19ub2RlTmFtZSA9IGN1clRvTm9kZUNoaWxkLl9fX25vZGVOYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTa2lwIG92ZXIgbm9kZXMgdGhhdCBkb24ndCBsb29rIGxpa2Ugb3Vycy4uLlxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGN1ckZyb21Ob2RlS2V5ID0gY3VyVkZyb21Ob2RlQ2hpbGQuX19fa2V5KSkge1xuICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEga2V5ZWQgZWxlbWVudCBoZXJlIGJ1dCBvdXIgdGFyZ2V0IFZET00gbm9kZVxuICAgICAgICAgICAgICAvLyBpcyBub3Qga2V5ZWQgc28gdGhpcyBub3QgZG9lc24ndCBiZWxvbmdcbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9XG4gICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSAhPT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgY29tcGFyZU5vZGVOYW1lcyhjdXJWRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpID09PSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGNvbXBhdGlibGUgRE9NIGVsZW1lbnRzIHNvIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAvLyB0aGUgY3VycmVudCBcImZyb21cIiBub2RlIHRvIG1hdGNoIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgbW9ycGhFbChcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkLFxuICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHxcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgY3VyVG9Ob2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5fX19ub2RlVmFsdWU7XG4gICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVWYWx1ZSA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVmFsdWUgIT09IGN1clRvTm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBpc0h5ZHJhdGUgJiZcbiAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nICYmXG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgJiZcbiAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nLl9fX25vZGVUeXBlID09PSBURVhUX05PREUgJiZcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZVZhbHVlLnN0YXJ0c1dpdGgoY3VyVG9Ob2RlVmFsdWUpICYmXG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZy5fX19ub2RlVmFsdWUuc3RhcnRzV2l0aChcbiAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlVmFsdWUuc2xpY2UoY3VyVG9Ob2RlVmFsdWUubGVuZ3RoKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIEluIGh5ZHJhdGUgbW9kZSB3ZSBjYW4gdXNlIHNwbGl0VGV4dCB0byBtb3JlIGVmZmljaWVudGx5IGhhbmRsZVxuICAgICAgICAgICAgICAgIC8vIGFkamFjZW50IHRleHQgdmRvbSBub2RlcyB0aGF0IHdlcmUgbWVyZ2VkLlxuICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQuc3BsaXRUZXh0KFxuICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlVmFsdWUubGVuZ3RoLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgdGhlIHRleHQgdmFsdWVcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSA9IGN1clRvTm9kZVZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZGV0YWNoTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSwgb3duZXJDb21wb25lbnQpO1xuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgfSAvLyBFTkQ6IHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKVxuXG4gICAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIgdGhlbiB3ZSBkaWQgbm90IGZpbmQgYSBjYW5kaWRhdGUgbWF0Y2ggZm9yXG4gICAgICAvLyBvdXIgXCJ0byBub2RlXCIgYW5kIHdlIGV4aGF1c3RlZCBhbGwgb2YgdGhlIGNoaWxkcmVuIFwiZnJvbVwiXG4gICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAvLyB0byB0aGUgZW5kXG4gICAgICBpbnNlcnRWaXJ0dWFsTm9kZUJlZm9yZShcbiAgICAgICAgY3VyVG9Ob2RlQ2hpbGQsXG4gICAgICAgIGN1clRvTm9kZUtleSxcbiAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCxcbiAgICAgICAgZnJvbU5vZGUsXG4gICAgICAgIG93bmVyQ29tcG9uZW50LFxuICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICApO1xuXG4gICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgIH1cblxuICAgIC8vIFdlIGhhdmUgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgXCJ0byBub2Rlc1wiLlxuICAgIGlmIChmcm9tTm9kZS5fX19maW5pc2hGcmFnbWVudCkge1xuICAgICAgLy8gSWYgd2UgYXJlIGluIGFuIHVuZmluaXNoZWQgZnJhZ21lbnQsIHdlIGhhdmUgcmVhY2hlZCB0aGUgZW5kIG9mIHRoZSBub2Rlc1xuICAgICAgLy8gd2Ugd2VyZSBtYXRjaGluZyB1cCBhbmQgbmVlZCB0byBlbmQgdGhlIGZyYWdtZW50XG4gICAgICBmcm9tTm9kZS5fX19maW5pc2hGcmFnbWVudChjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgY3VyRnJvbU5vZGVDaGlsZCBpcyBub24tbnVsbCB0aGVuIHdlIHN0aWxsIGhhdmUgc29tZSBmcm9tIG5vZGVzXG4gICAgICAvLyBsZWZ0IG92ZXIgdGhhdCBuZWVkIHRvIGJlIHJlbW92ZWRcbiAgICAgIHZhciBmcmFnbWVudEJvdW5kYXJ5ID1cbiAgICAgICAgZnJvbU5vZGUubm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREUgPyBmcm9tTm9kZS5lbmROb2RlIDogbnVsbDtcblxuICAgICAgd2hpbGUgKGN1ckZyb21Ob2RlQ2hpbGQgJiYgY3VyRnJvbU5vZGVDaGlsZCAhPT0gZnJhZ21lbnRCb3VuZGFyeSkge1xuICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBuZXh0U2libGluZyhjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICBpZiAoKGZyb21Db21wb25lbnQgPSBjb21wb25lbnRCeURPTU5vZGUuZ2V0KGN1ckZyb21Ob2RlQ2hpbGQpKSkge1xuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWdsb2JhbENvbXBvbmVudHNDb250ZXh0Ll9fX3JlbmRlcmVkQ29tcG9uZW50c0J5SWRbZnJvbUNvbXBvbmVudC5pZF1cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGRlc3Ryb3lDb21wb25lbnQoZnJvbUNvbXBvbmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VyVkZyb21Ob2RlQ2hpbGQgPSB2RWxlbWVudEJ5RE9NTm9kZS5nZXQoY3VyRnJvbU5vZGVDaGlsZCk7XG4gICAgICAgIGN1ckZyb21Ob2RlS2V5ID0ga2V5c0J5RE9NTm9kZS5nZXQoZnJvbU5vZGUpO1xuXG4gICAgICAgIC8vIEZvciB0cmFuc2NsdWRlZCBjb250ZW50LCB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSBlbGVtZW50IGJlbG9uZ3MgdG8gYSBkaWZmZXJlbnQgY29tcG9uZW50XG4gICAgICAgIC8vIGNvbnRleHQgdGhhbiB0aGUgY3VycmVudCBjb21wb25lbnQgYW5kIGVuc3VyZSBpdCBnZXRzIHJlbW92ZWQgZnJvbSBpdHMga2V5IGluZGV4LlxuICAgICAgICBpZiAoIWN1ckZyb21Ob2RlS2V5IHx8IGlzQXV0b0tleShjdXJGcm9tTm9kZUtleSkpIHtcbiAgICAgICAgICByZWZlcmVuY2VDb21wb25lbnQgPSBwYXJlbnRDb21wb25lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVmZXJlbmNlQ29tcG9uZW50ID1cbiAgICAgICAgICAgIGN1clZGcm9tTm9kZUNoaWxkICYmIGN1clZGcm9tTm9kZUNoaWxkLl9fX293bmVyQ29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZGV0YWNoTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tTm9kZSwgcmVmZXJlbmNlQ29tcG9uZW50KTtcblxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB2RnJvbUVsLCB0b0VsLCBwYXJlbnRDb21wb25lbnQpIHtcbiAgICB2YXIgbm9kZU5hbWUgPSB0b0VsLl9fX25vZGVOYW1lO1xuICAgIHZhciBjb25zdElkID0gdG9FbC5fX19jb25zdElkO1xuICAgIHZFbGVtZW50QnlET01Ob2RlLnNldChmcm9tRWwsIHRvRWwpO1xuXG4gICAgaWYgKGNvbnN0SWQgIT09IHVuZGVmaW5lZCAmJiB2RnJvbUVsLl9fX2NvbnN0SWQgPT09IGNvbnN0SWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtb3JwaEF0dHJzKGZyb21FbCwgdkZyb21FbCwgdG9FbCk7XG5cbiAgICBpZiAodG9FbC5fX19wcmVzZXJ2ZUJvZHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobm9kZU5hbWUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgaWYgKHRvRWwuX19fdmFsdWVJbnRlcm5hbCAhPT0gdkZyb21FbC5fX192YWx1ZUludGVybmFsKSB7XG4gICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwuX19fdmFsdWVJbnRlcm5hbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwsIHBhcmVudENvbXBvbmVudCk7XG4gICAgfVxuICB9IC8vIEVORDogbW9ycGhFbCguLi4pXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgY29tcG9uZW50c1V0aWwuX19fc3RvcERPTU1hbmlwdWxhdGlvbldhcm5pbmcoaG9zdCk7XG4gIH1cblxuICBtb3JwaENoaWxkcmVuKGZyb21Ob2RlLCB0b05vZGUsIHRvTm9kZS5fX19jb21wb25lbnQpO1xuXG4gIGRldGFjaGVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBkZXRhY2hlZEZyb21Db21wb25lbnQgPSBkZXRhY2hlZEJ5RE9NTm9kZS5nZXQobm9kZSk7XG5cbiAgICBpZiAoZGV0YWNoZWRGcm9tQ29tcG9uZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRldGFjaGVkQnlET01Ob2RlLnNldChub2RlLCB1bmRlZmluZWQpO1xuXG4gICAgICB2YXIgY29tcG9uZW50VG9EZXN0cm95ID0gY29tcG9uZW50QnlET01Ob2RlLmdldChub2RlKTtcbiAgICAgIGlmIChjb21wb25lbnRUb0Rlc3Ryb3kpIHtcbiAgICAgICAgY29tcG9uZW50VG9EZXN0cm95LmRlc3Ryb3koKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgIGRlc3Ryb3lOb2RlUmVjdXJzaXZlKFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgZGV0YWNoZWRGcm9tQ29tcG9uZW50ICE9PSB0cnVlICYmIGRldGFjaGVkRnJvbUNvbXBvbmVudCxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZXZlbnREZWxlZ2F0aW9uLl9fX2hhbmRsZU5vZGVEZXRhY2gobm9kZSkgIT0gZmFsc2UpIHtcbiAgICAgICAgICByZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICBpZiAoXCJNQVJLT19ERUJVR1wiKSB7XG4gICAgY29tcG9uZW50c1V0aWwuX19fc3RhcnRET01NYW5pcHVsYXRpb25XYXJuaW5nKGhvc3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW9ycGhkb207XG4iLCJ2YXIgcGFyc2VIVE1MID0gZnVuY3Rpb24gKGh0bWwpIHtcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcbiAgcGFyc2VIVE1MID0gY29udGFpbmVyLmNvbnRlbnRcbiAgICA/IGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyLmNvbnRlbnQ7XG4gICAgICB9XG4gICAgOiBmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICAgIH07XG5cbiAgcmV0dXJuIHBhcnNlSFRNTChodG1sKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGh0bWwpIHtcbiAgcmV0dXJuIHBhcnNlSFRNTChodG1sKS5maXJzdENoaWxkO1xufTtcbiIsInZhciBwYXJzZUhUTUwgPSByZXF1aXJlKFwiLi9wYXJzZS1odG1sXCIpO1xudmFyIFZDb21wb25lbnQgPSByZXF1aXJlKFwiLi9WQ29tcG9uZW50XCIpO1xudmFyIFZEb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZShcIi4vVkRvY3VtZW50RnJhZ21lbnRcIik7XG52YXIgVkVsZW1lbnQgPSByZXF1aXJlKFwiLi9WRWxlbWVudFwiKTtcbnZhciBWRnJhZ21lbnQgPSByZXF1aXJlKFwiLi9WRnJhZ21lbnRcIik7XG52YXIgVk5vZGUgPSByZXF1aXJlKFwiLi9WTm9kZVwiKTtcbnZhciBWVGV4dCA9IHJlcXVpcmUoXCIuL1ZUZXh0XCIpO1xuXG52YXIgc3BlY2lhbEh0bWxSZWdleHAgPSAvWyY8XS87XG5cbmZ1bmN0aW9uIHZpcnR1YWxpemVDaGlsZE5vZGVzKG5vZGUsIHZkb21QYXJlbnQsIG93bmVyQ29tcG9uZW50KSB7XG4gIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgdmRvbVBhcmVudC5fX19hcHBlbmRDaGlsZCh2aXJ0dWFsaXplKGN1ckNoaWxkLCBvd25lckNvbXBvbmVudCkpO1xuICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmlydHVhbGl6ZShub2RlLCBvd25lckNvbXBvbmVudCkge1xuICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gVkVsZW1lbnQuX19fdmlydHVhbGl6ZShub2RlLCB2aXJ0dWFsaXplQ2hpbGROb2Rlcywgb3duZXJDb21wb25lbnQpO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBuZXcgVlRleHQobm9kZS5ub2RlVmFsdWUsIG93bmVyQ29tcG9uZW50KTtcbiAgICBjYXNlIDExOlxuICAgICAgdmFyIHZkb21Eb2NGcmFnbWVudCA9IG5ldyBWRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgdmlydHVhbGl6ZUNoaWxkTm9kZXMobm9kZSwgdmRvbURvY0ZyYWdtZW50LCBvd25lckNvbXBvbmVudCk7XG4gICAgICByZXR1cm4gdmRvbURvY0ZyYWdtZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHZpcnR1YWxpemVIVE1MKGh0bWwsIG93bmVyQ29tcG9uZW50KSB7XG4gIGlmICghc3BlY2lhbEh0bWxSZWdleHAudGVzdChodG1sKSkge1xuICAgIHJldHVybiBuZXcgVlRleHQoaHRtbCwgb3duZXJDb21wb25lbnQpO1xuICB9XG5cbiAgdmFyIHZkb21GcmFnbWVudCA9IG5ldyBWRG9jdW1lbnRGcmFnbWVudCgpO1xuICB2YXIgY3VyQ2hpbGQgPSBwYXJzZUhUTUwoaHRtbCk7XG5cbiAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgdmRvbUZyYWdtZW50Ll9fX2FwcGVuZENoaWxkKHZpcnR1YWxpemUoY3VyQ2hpbGQsIG93bmVyQ29tcG9uZW50KSk7XG4gICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgfVxuXG4gIHJldHVybiB2ZG9tRnJhZ21lbnQ7XG59XG5cbnZhciBOb2RlX3Byb3RvdHlwZSA9IFZOb2RlLnByb3RvdHlwZTtcblxuLyoqXG4gKiBTaG9ydGhhbmQgbWV0aG9kIGZvciBjcmVhdGluZyBhbmQgYXBwZW5kaW5nIGEgVGV4dCBub2RlIHdpdGggYSBnaXZlbiB2YWx1ZVxuICogQHBhcmFtICB7U3RyaW5nfSB2YWx1ZSBUaGUgdGV4dCB2YWx1ZSBmb3IgdGhlIG5ldyBUZXh0IG5vZGVcbiAqL1xuTm9kZV9wcm90b3R5cGUudCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgdmFyIHZkb21Ob2RlO1xuXG4gIGlmICh0eXBlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHZhbHVlID0gXCJcIjtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGlmICh2YWx1ZS50b0hUTUwpIHtcbiAgICAgICAgdmRvbU5vZGUgPSB2aXJ0dWFsaXplSFRNTCh2YWx1ZS50b0hUTUwoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fX19hcHBlbmRDaGlsZCh2ZG9tTm9kZSB8fCBuZXcgVlRleHQodmFsdWUudG9TdHJpbmcoKSkpO1xuICByZXR1cm4gdGhpcy5fX19maW5pc2hDaGlsZCgpO1xufTtcblxuTm9kZV9wcm90b3R5cGUuX19fYXBwZW5kRG9jdW1lbnRGcmFnbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX19fYXBwZW5kQ2hpbGQobmV3IFZEb2N1bWVudEZyYWdtZW50KCkpO1xufTtcblxuZXhwb3J0cy5fX19WRG9jdW1lbnRGcmFnbWVudCA9IFZEb2N1bWVudEZyYWdtZW50O1xuZXhwb3J0cy5fX19WRWxlbWVudCA9IFZFbGVtZW50O1xuZXhwb3J0cy5fX19WVGV4dCA9IFZUZXh0O1xuZXhwb3J0cy5fX19WQ29tcG9uZW50ID0gVkNvbXBvbmVudDtcbmV4cG9ydHMuX19fVkZyYWdtZW50ID0gVkZyYWdtZW50O1xuZXhwb3J0cy5fX192aXJ0dWFsaXplID0gdmlydHVhbGl6ZTtcbmV4cG9ydHMuX19fdmlydHVhbGl6ZUhUTUwgPSB2aXJ0dWFsaXplSFRNTDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29weVByb3BzKGZyb20sIHRvKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZnJvbSkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmcm9tLCBuYW1lKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzb3VyY2UpIHsgLy9BIHNpbXBsZSBmdW5jdGlvbiB0byBjb3B5IHByb3BlcnRpZXMgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXJcbiAgICBpZiAoIXRhcmdldCkgeyAvL0NoZWNrIGlmIGEgdGFyZ2V0IHdhcyBwcm92aWRlZCwgb3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eSBvYmplY3QgdG8gcmV0dXJuXG4gICAgICAgIHRhcmdldCA9IHt9O1xuICAgIH1cblxuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkgeyAvL09ubHkgbG9vayBhdCBzb3VyY2UgcHJvcGVydGllcyB0aGF0IGFyZSBub3QgaW5oZXJpdGVkXG4gICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BOYW1lXSA9IHNvdXJjZVtwcm9wTmFtZV07IC8vQ29weSB0aGUgcHJvcGVydHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG59OyIsInZhciBjb3B5UHJvcHMgPSByZXF1aXJlKCcuL2NvcHlQcm9wcycpO1xuXG5mdW5jdGlvbiBpbmhlcml0KGN0b3IsIHN1cGVyQ3Rvciwgc2hvdWxkQ29weVByb3BzKSB7XG4gICAgdmFyIG9sZFByb3RvID0gY3Rvci5wcm90b3R5cGU7XG4gICAgdmFyIG5ld1Byb3RvID0gY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChvbGRQcm90byAmJiBzaG91bGRDb3B5UHJvcHMgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvcHlQcm9wcyhvbGRQcm90bywgbmV3UHJvdG8pO1xuICAgIH1cbiAgICBjdG9yLiRzdXBlciA9IHN1cGVyQ3RvcjtcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ld1Byb3RvO1xuICAgIHJldHVybiBjdG9yO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaW5oZXJpdDtcbmluaGVyaXQuX2luaGVyaXQgPSBpbmhlcml0O1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnc3RhY2tmcmFtZScsIFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlN0YWNrRnJhbWUgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gX2lzTnVtYmVyKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2FwaXRhbGl6ZShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldHRlcihwKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3BdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBib29sZWFuUHJvcHMgPSBbJ2lzQ29uc3RydWN0b3InLCAnaXNFdmFsJywgJ2lzTmF0aXZlJywgJ2lzVG9wbGV2ZWwnXTtcbiAgICB2YXIgbnVtZXJpY1Byb3BzID0gWydjb2x1bW5OdW1iZXInLCAnbGluZU51bWJlciddO1xuICAgIHZhciBzdHJpbmdQcm9wcyA9IFsnZmlsZU5hbWUnLCAnZnVuY3Rpb25OYW1lJywgJ3NvdXJjZSddO1xuICAgIHZhciBhcnJheVByb3BzID0gWydhcmdzJ107XG4gICAgdmFyIG9iamVjdFByb3BzID0gWydldmFsT3JpZ2luJ107XG5cbiAgICB2YXIgcHJvcHMgPSBib29sZWFuUHJvcHMuY29uY2F0KG51bWVyaWNQcm9wcywgc3RyaW5nUHJvcHMsIGFycmF5UHJvcHMsIG9iamVjdFByb3BzKTtcblxuICAgIGZ1bmN0aW9uIFN0YWNrRnJhbWUob2JqKSB7XG4gICAgICAgIGlmICghb2JqKSByZXR1cm47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvYmpbcHJvcHNbaV1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzWydzZXQnICsgX2NhcGl0YWxpemUocHJvcHNbaV0pXShvYmpbcHJvcHNbaV1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFN0YWNrRnJhbWUucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRBcmdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEFyZ3M6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodikgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmdzIG11c3QgYmUgYW4gQXJyYXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXJncyA9IHY7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RXZhbE9yaWdpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsT3JpZ2luO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFdmFsT3JpZ2luOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFN0YWNrRnJhbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2YWxPcmlnaW4gPSB2O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsT3JpZ2luID0gbmV3IFN0YWNrRnJhbWUodik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V2YWwgT3JpZ2luIG11c3QgYmUgYW4gT2JqZWN0IG9yIFN0YWNrRnJhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSB0aGlzLmdldEZpbGVOYW1lKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgbGluZU51bWJlciA9IHRoaXMuZ2V0TGluZU51bWJlcigpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGNvbHVtbk51bWJlciA9IHRoaXMuZ2V0Q29sdW1uTnVtYmVyKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gdGhpcy5nZXRGdW5jdGlvbk5hbWUoKSB8fCAnJztcbiAgICAgICAgICAgIGlmICh0aGlzLmdldElzRXZhbCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnW2V2YWxdICgnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyICsgJyknO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gJ1tldmFsXTonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25OYW1lICsgJyAoJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlciArICcpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXI7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU3RhY2tGcmFtZS5mcm9tU3RyaW5nID0gZnVuY3Rpb24gU3RhY2tGcmFtZSQkZnJvbVN0cmluZyhzdHIpIHtcbiAgICAgICAgdmFyIGFyZ3NTdGFydEluZGV4ID0gc3RyLmluZGV4T2YoJygnKTtcbiAgICAgICAgdmFyIGFyZ3NFbmRJbmRleCA9IHN0ci5sYXN0SW5kZXhPZignKScpO1xuXG4gICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBzdHIuc3Vic3RyaW5nKDAsIGFyZ3NTdGFydEluZGV4KTtcbiAgICAgICAgdmFyIGFyZ3MgPSBzdHIuc3Vic3RyaW5nKGFyZ3NTdGFydEluZGV4ICsgMSwgYXJnc0VuZEluZGV4KS5zcGxpdCgnLCcpO1xuICAgICAgICB2YXIgbG9jYXRpb25TdHJpbmcgPSBzdHIuc3Vic3RyaW5nKGFyZ3NFbmRJbmRleCArIDEpO1xuXG4gICAgICAgIGlmIChsb2NhdGlvblN0cmluZy5pbmRleE9mKCdAJykgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IC9AKC4rPykoPzo6KFxcZCspKT8oPzo6KFxcZCspKT8kLy5leGVjKGxvY2F0aW9uU3RyaW5nLCAnJyk7XG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgIHZhciBsaW5lTnVtYmVyID0gcGFydHNbMl07XG4gICAgICAgICAgICB2YXIgY29sdW1uTnVtYmVyID0gcGFydHNbM107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICBhcmdzOiBhcmdzIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBjb2x1bW5OdW1iZXIgfHwgdW5kZWZpbmVkXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2xlYW5Qcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKGJvb2xlYW5Qcm9wc1tpXSldID0gX2dldHRlcihib29sZWFuUHJvcHNbaV0pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKGJvb2xlYW5Qcm9wc1tpXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IEJvb2xlYW4odik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShib29sZWFuUHJvcHNbaV0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtZXJpY1Byb3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydnZXQnICsgX2NhcGl0YWxpemUobnVtZXJpY1Byb3BzW2pdKV0gPSBfZ2V0dGVyKG51bWVyaWNQcm9wc1tqXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUobnVtZXJpY1Byb3BzW2pdKV0gPSAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9pc051bWJlcih2KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHAgKyAnIG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IE51bWJlcih2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKG51bWVyaWNQcm9wc1tqXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBzdHJpbmdQcm9wcy5sZW5ndGg7IGsrKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKHN0cmluZ1Byb3BzW2tdKV0gPSBfZ2V0dGVyKHN0cmluZ1Byb3BzW2tdKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShzdHJpbmdQcm9wc1trXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IFN0cmluZyh2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHN0cmluZ1Byb3BzW2tdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RhY2tGcmFtZTtcbn0pKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vc3JjL2NvbnN0YW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2ZpbmFsaXplJyk7IiwidmFyIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBnbG9iYWw7XG5leHBvcnRzLk5PT1AgPSB3aW4uJFcxME5PT1AgPSB3aW4uJFcxME5PT1AgfHwgZnVuY3Rpb24gKCkge307IiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50c1wiKTtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QsIHBhdGgsIGxlbikge1xuICAgIHZhciBjdXJyZW50ID0gb2JqZWN0O1xuICAgIGZvciAodmFyIGk9MDsgaTxsZW47IGkrKykge1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudFtwYXRoW2ldXTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVR5cGUoaW5mbykge1xuICAgIGlmIChpbmZvLnR5cGUgPT09ICdEYXRlJykge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoaW5mby52YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLnR5cGUgPT09ICdVUkwnKSB7XG4gICAgICAgIHJldHVybiBuZXcgVVJMKGluZm8udmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoaW5mby50eXBlID09PSAnVVJMU2VhcmNoUGFyYW1zJykge1xuICAgICAgICByZXR1cm4gbmV3IFVSTFNlYXJjaFBhcmFtcyhpbmZvLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGluZm8udHlwZSA9PT0gJ05PT1AnKSB7XG4gICAgICAgIHJldHVybiBjb25zdGFudHMuTk9PUDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCB0eXBlJyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmFsaXplKG91dGVyKSB7XG4gICAgaWYgKCFvdXRlcikge1xuICAgICAgICByZXR1cm4gb3V0ZXI7XG4gICAgfVxuXG4gICAgdmFyIGFzc2lnbm1lbnRzID0gb3V0ZXIuJCQ7XG4gICAgaWYgKGFzc2lnbm1lbnRzKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBvdXRlci5vO1xuICAgICAgICB2YXIgbGVuO1xuXG4gICAgICAgIGlmIChhc3NpZ25tZW50cyAmJiAobGVuPWFzc2lnbm1lbnRzLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBhc3NpZ25tZW50ID0gYXNzaWdubWVudHNbaV07XG5cbiAgICAgICAgICAgICAgICB2YXIgcmhzID0gYXNzaWdubWVudC5yO1xuICAgICAgICAgICAgICAgIHZhciByaHNWYWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHJocykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmhzVmFsdWUgPSByZXNvbHZlKG9iamVjdCwgcmhzLCByaHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByaHNWYWx1ZSA9IHJlc29sdmVUeXBlKHJocyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGxocyA9IGFzc2lnbm1lbnQubDtcbiAgICAgICAgICAgICAgICB2YXIgbGhzTGFzdCA9IGxocy5sZW5ndGgtMTtcblxuICAgICAgICAgICAgICAgIGlmIChsaHNMYXN0ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBvdXRlci5vID0gcmhzVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaHNQYXJlbnQgPSByZXNvbHZlKG9iamVjdCwgbGhzLCBsaHNMYXN0KTtcbiAgICAgICAgICAgICAgICAgICAgbGhzUGFyZW50W2xoc1tsaHNMYXN0XV0gPSByaHNWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhc3NpZ25tZW50cy5sZW5ndGggPSAwOyAvLyBBc3NpZ25tZW50cyBoYXZlIGJlZW4gYXBwbGllZCwgZG8gbm90IHJlYXBwbHlcblxuICAgICAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyBudWxsIDogb2JqZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvdXRlcjtcbiAgICB9XG5cbn07IiwibGV0IFQgPSB7fTtcclxuXHJcblQuRXhlY3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHN3aXRjaChTdG9yZS5zdGF0ZS5hY3Rpb24pIHtcclxuICAgIGNhc2UgQWN0aW9uLkNVU1RPTUFDVElPTjpcclxuICAgICAgY29uc29sZS5sb2coXCJQYXJ0aXRhIGN1c3RvbWFjdGlvblwiKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5TdG9yZS5CaW5kKFQuRXhlY3V0ZSk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gQ29tcGlsZWQgdXNpbmcgbWFya29ANS4zMy4xNCAtIERPIE5PVCBFRElUXG5pbXBvcnQgeyB0IGFzIF90IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL3Zkb20vaW5kZXguanNcIjtcbmNvbnN0IF9tYXJrb19jb21wb25lbnRUeXBlID0gXCJ1aVxcXFxpbmRleC5tYXJrb1wiLFxuICBfbWFya29fdGVtcGxhdGUgPSBfdChfbWFya29fY29tcG9uZW50VHlwZSk7XG5leHBvcnQgZGVmYXVsdCBfbWFya29fdGVtcGxhdGU7XG5pbXBvcnQgJy4vdGVzdHVpLmpzJztcbmltcG9ydCBfbWFya29fcmVuZGVyZXIgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IHIgYXMgX21hcmtvX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvcmVnaXN0cnkuanNcIjtcbl9tYXJrb19yZWdpc3RlckNvbXBvbmVudChfbWFya29fY29tcG9uZW50VHlwZSwgKCkgPT4gX21hcmtvX3RlbXBsYXRlKTtcbmNvbnN0IF9tYXJrb19jb21wb25lbnQgPSB7fTtcbl9tYXJrb190ZW1wbGF0ZS5fID0gX21hcmtvX3JlbmRlcmVyKGZ1bmN0aW9uIChpbnB1dCwgb3V0LCBfY29tcG9uZW50RGVmLCBfY29tcG9uZW50LCBzdGF0ZSwgJGdsb2JhbCkge30sIHtcbiAgdDogX21hcmtvX2NvbXBvbmVudFR5cGUsXG4gIGk6IHRydWUsXG4gIGQ6IHRydWVcbn0sIF9tYXJrb19jb21wb25lbnQpO1xuaW1wb3J0IF9tYXJrb19kZWZpbmVDb21wb25lbnQgZnJvbSBcIm1hcmtvL3NyYy9ydW50aW1lL2NvbXBvbmVudHMvZGVmaW5lQ29tcG9uZW50LmpzXCI7XG5fbWFya29fdGVtcGxhdGUuQ29tcG9uZW50ID0gX21hcmtvX2RlZmluZUNvbXBvbmVudChfbWFya29fY29tcG9uZW50LCBfbWFya29fdGVtcGxhdGUuXyk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9