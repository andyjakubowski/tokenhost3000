require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()

function makeActionCable() {
  var context = this;
  (function() {
    (function() {
      var slice = [].slice;
      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };
    }).call(this);
  }).call(context);
  var ActionCable = context.ActionCable;
  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;
        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };
        ConnectionMonitor.staleThreshold = 6;
        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }
        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };
        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };
        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };
        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };
        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };
        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };
        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };
        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };
        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };
        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };
        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };
        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };
        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };
        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };
        now = function() {
          return new Date().getTime();
        };
        secondsSince = function(time) {
          return (now() - time) / 1000;
        };
        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };
        return ConnectionMonitor;
      })();
    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;
      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];
      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;
        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }
        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };
        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };
        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };
        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };
        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };
        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };
        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };
        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };
        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };
        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };
        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };
        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };
        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };
        return Connection;
      })();
    }).call(this);
    (function() {
      var slice = [].slice;
      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }
        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };
        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };
        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };
        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };
        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };
        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };
        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };
        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };
        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };
        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };
        return Subscriptions;
      })();
    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;
        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };
        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };
        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };
        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };
        return Subscription;
      })();
    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }
        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };
        Consumer.prototype.connect = function() {
          return this.connection.open();
        };
        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };
        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };
        return Consumer;
      })();
    }).call(this);
  }).call(this);
  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}

makeActionCable.call(window);

const Tokenhost = (function makeTokenhost() {
  const w = window;
  let SPACE_NAME;
  let API_HOST;
  let API_URL;

  const Model = (function makeModel() {
    const STORAGE_KEY = 'Tokenhost';

    const getLocalStorage = (function makeGetLocalStorage() {
      const emptyDataObject = {
        lists: [],
        active_list_id: null,
        updated_at: null,
        status: 'offline',
      };

      return function() {
        let value = w.localStorage.getItem(STORAGE_KEY);
        if(!value) {
          value = JSON.stringify(emptyDataObject);
          w.localStorage.setItem(STORAGE_KEY, value);
        }

        return JSON.parse(value);
      };
    }());

    const saveToLocalStorage = function saveToLocalStorage() {
      w.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const clearLocalStorage = function clearLocalStorage() {
      w.localStorage.removeItem(STORAGE_KEY);
    };

    const listWithId = function listWithId(id) {
      for (let i = 0; i < data.lists.length; i += 1) {
        const list = data.lists[i];
        if (list.id === id) {
          return list;
        }
      }

      return -1;
    };

    const tokenWithId = function tokenWithId(list_id, id) {
      const list = listWithId(list_id);

      if (list === -1) {
        return -1;
      }

      for (let i = 0; i < list.tokens.length; i += 1) {
        const token = list.tokens[i];

        if (token.id === id) {
          return token;
        }
      }

      return -1;
    };

    const activeList = function activeList() {
      const list = listWithId(data.active_list_id);

      if (list === -1) {
        return null;
      }

      return list;
    };

    const setStatus = function setStatus(status) {
      data.status = status;
      data.updated_at = Date.now();
      saveToLocalStorage();
    };

    let data;

    return {
      fetchData() {
        return this.getLists()
          .then(() => this.getTokensForAllLists())
          .then(() => {
            if (listWithId(data.active_list_id) === -1) {
              this.resetActiveListId();
            }
          })
          .catch((error) => {
            if (error.message.includes('NetworkError')) {
              setStatus('offline');
            }
            
            return Promise.reject(error);
          });

      },

      getLists() {
        return fetch(`${API_URL}/${SPACE_NAME}.json`)
          .then((response) => response.json())
          .then((parsed) => {
            if (Array.isArray(parsed)) {
              data.lists = parsed;
              data.updated_at = Date.now();
              setStatus('online');
              saveToLocalStorage();
            } else if (
                parsed instanceof Object
                && Object.prototype.hasOwnProperty.call(parsed, 'message')
                && parsed.message === 'Space expired'
              ) {
              setStatus('expired');
              clearLocalStorage();
              throw new Error('Space expired');
            }
          });
      },

      getTokensForAllLists() {
        const listIds = data.lists.map((list) => list.id);
        const promises = listIds.map(this.getTokens);

        return Promise.all(promises);
      },

      getTokens(listId) {
        return fetch(`${API_URL}/lists/${listId}/tokens.json`)
          .then((response) => response.json())
          .then((tokens) => {
            const list = listWithId(listId);
            list.tokens = tokens;
            data.updated_at = Date.now();
            saveToLocalStorage();
            return tokens;
          });
      },

      activeTokens() {
        const list = activeList();

        if (!list || !list.tokens) {
          return [];
        }

        return list.tokens;
      },

      addList(list) {
        data.lists.push(list);
        this.getTokens(list.id);
      },

      updateList(list) {
        const localList = listWithId(list.id);

        Object.keys(list).forEach((key) => {
          localList[key] = list[key];
        });
        saveToLocalStorage();
      },

      removeList(id) {
        for (let i = 0; i < data.lists.length; i += 1) {
          if (data.lists[i].id === id) {
            data.lists.splice(i, 1);
            saveToLocalStorage();
          }
        }
      },

      addToken(token) {
        const list = listWithId(token.list_id);

        if (list !== -1) {
          list.tokens.push(token);
          saveToLocalStorage();
        }
      },

      updateToken(token) {
        const localToken = tokenWithId(token.list_id, token.id);

        if (localToken === -1) {
          return;
        }

        Object.keys(localToken).forEach((key) => {
          localToken[key] = token[key];
        });

        saveToLocalStorage();
      },

      removeToken(token) {
        const list = listWithId(token.list_id);

        if (list === -1) {
          return;
        }

        for (let i = 0; i < list.tokens.length; i += 1) {
          if (list.tokens[i].id === token.id) {
            list.tokens.splice(i, 1);
            saveToLocalStorage();
          }
        }
      },

      setActiveListId(id) {
        data.active_list_id = id;
        data.updated_at = Date.now();
        saveToLocalStorage();
      },

      resetActiveListId() {
        const firstList = data.lists[0];

        if (firstList) {
          data.active_list_id = firstList.id;
        } else {
          data.active_list_id = null;
        }

        saveToLocalStorage();
      },

      data() {
        return data;
      },

      init(list_id) {
        data = getLocalStorage();

        if (list_id) {
          this.setActiveListId(list_id);
        }
      },
    };
  }());

  const View = (function makeView() {
    const Button = (function makeButton() {
      let domElement;
      let status;

      const createDomElement = function createDomElement() {
        const element = document.createElement('div');
        element.classList.add('token__button');
        element.innerHTML = String.raw`
        <svg height="30" viewBox="0 0 29 30" width="29" xmlns="http://www.w3.org/2000/svg">
          <path d="m68.5000006 35-13.5056228 5.9525583 13.5056228 5.940099 13.5056236-5.940099zm-14.5000006 23.9600674 13.694445 6.0399326v-16.7096683l-13.694445-6.0274375zm15.3055562-10.6697357v16.7096683l13.6944444-6.0399326v-16.6971732z" fill="var(--token-button-icon-fill)" transform="translate(-54 -35)"/>
          </svg>
        `;
        return element;
      };

      const expand = function expand() {
        domElement.classList.add('token__button_expanded');
        status = 'expanded';
        List.expand();
      };

      const collapse = function collapse() {
        domElement.classList.remove('token__button_expanded');
        status = 'collapsed';
        List.collapse();
      };

      const clickHandler = function clickHandler(e) {
        switch (status) {
          case 'collapsed':
            expand();
            break;
          case 'expanded':
            collapse();
            break;
          default:
            console.log('Button has unknown status.');
        }
      };

      return {
        domElement() {
          return domElement;
        },

        init() {
          status = 'collapsed';
          domElement = createDomElement();
          domElement.addEventListener('click', clickHandler);
          return this;
        },
      };
    }());

    const List = (function makeList() {
      let domElement;
      let contentElement;
      let status;

      const createContentElement = function createContentElement() {
        const content = document.createElement('ul');
        content.classList.add('token__list-content');
        return content;
      };

      const createContainerElement = function createContainerElement() {
        const container = document.createElement('div');
        container.classList.add('token__list-container');
        return container;
      };

      const expand = function expand() {
        domElement.classList.add('token__list-container_expanded');
        status = 'expanded';
      };

      const collapse = function collapse() {
        domElement.classList.remove('token__list-container_expanded');
        status = 'collapsed';
      };

      return {
        expand() {
          expand();
        },

        collapse() {
          collapse();
        },

        domElement() {
          return domElement;
        },

        contentElement() {
          return contentElement;
        },

        init() {
          status = 'collapsed';
          domElement = createContainerElement();
          contentElement = createContentElement();

          domElement.append(contentElement);
          return this;
        },
      };
    }());

    const createStyleTag = function createStyleTag() {
      const styleTag = document.createElement('style');

      styleTag.innerHTML = String.raw`

        .token__container {
          --token-spacing-tiny: 4;
          --token-color-text-primary: #FFFFFF;
          --token-color-text-secondary: #CDC7C7;
          --token-color-text-tertiary: #5F5A64;
          --token-color-text-inverse-primary: #ADA6B5;
          --token-color-background-surface: #302C35;
          --token-color-background-inverse: #58535D;
          --token-color-interactive-primary: #FF820F;
          --token-color-interactive-inverse: white;
          --token-color-background-canvas: #0F0817;
          --token-color-background-canvas-translucent: #0F0817FA;
          --token-font-size-extra-large: 48;
          --token-font-size-large: 32;
          --token-font-size-medium: 24;
          --token-font-size-regular: 20;
          --token-font-size-small: 16;
          --token-spacing-extra-large: 72;
          --token-spacing-large: 48;
          --token-spacing-medium: 24;
          --token-spacing-regular: 16;
          --token-spacing-small: 8;
          --token-font-weight-bold: 700;
          --token-font-weight-medium: 500;
          --token-radius-large: 16;
          --token-radius-medium: 12;
          --token-radius-regular: 8;

          --token-size: 56px;
          --token-margin-bottom: 24px;
          --token-margin-side: 16px;
          --token-border-width: 1px;
          
          box-sizing: border-box;

          font-family: -apple-system, system-ui, sans-serif;
          font-size: var(--token-font-size-small)px;
          color: var(--token-color-text-tertiary);

        }

        .token__container * {
          box-sizing: inherit;
        }

        .token__list-container {
          background-color: var(--token-color-background-canvas-translucent);
          border: var(--token-border-width) solid rgba(255, 255, 255, 0.1);
          height: var(--token-size);
          width: var(--token-size);
          border-radius: calc(var(--token-size) / 2);
          padding: 0 calc(var(--token-size) - (var(--token-border-width) * 2)) 0 0;
          margin: 0;
          box-shadow: 0 2px 24px rgba(0, 0, 0, 0.16);

          position: fixed;
          right: var(--token-margin-side);
          bottom: var(--token-margin-bottom);

          transition: width 0.3s cubic-bezier(.82,.04,.33,1.12) 0s;
        }

        .token__list-container .token__list-content {
          opacity: 0;
          overflow: hidden;
        }

        .token__list-container_expanded {
          width: calc(100vw - calc(2 * var(--token-margin-side)));
        }

        .token__list-container_expanded .token__list-content {
          opacity: 1;
          overflow: auto;
        }

        .token__list-content {
          height: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0 0 0 16px;
        }

        .token__list-item {
          flex-shrink: 0;
          padding: 8px;
          cursor: pointer;
        }

        .token__list-item:not(:last-of-type) {
          margin-right: 8px;
        }

        .token__list-item:hover {
          color: var(--token-color-text-primary);
        }

        .token__list-item_active {
          color: seashell;
        }

        .token__button {
          --token-button-margin: 4px;
          --token-button-icon-fill: #EAE7EE;

          background-color: var(--token-color-background-surface);
          border-radius: calc(var(--token-size) / 2);
          height: calc(var(--token-size) - calc(var(--token-button-margin) * 2));
          width: calc(var(--token-size) - calc(var(--token-button-margin) * 2));
          margin: var(--token-button-margin);

          display: flex;
          justify-content: center;
          align-items: center;

          position: fixed;
          right: var(--token-margin-side);
          bottom: var(--token-margin-bottom);

          cursor: pointer;
        }

        .token__button:hover {
          opacity: 0.85;
        }

        .token__button_expanded {
          background-color: white;
          --token-button-icon-fill: var(--token-color-interactive-primary);
        }

        .token__button-icon {
          color: red;
        }

        .token__expired-label {
          flex-shrink: 0;
          padding: 16px;
        }

        @media screen and (min-width: 832px) {
          .token__list-container_expanded {
            width: 800px;
          }
        }
      `;
      return styleTag;
    };

    const createContainerTag = function createContainerTag() {
      const container = document.createElement('div');
      container.setAttribute('aria-hidden', 'true');
      container.classList.add('token__container')
      return container;
    };

    const build = function buildView() {
      const styleTag = createStyleTag();
      const containerTag = createContainerTag();
      const listTag = List.init().domElement();
      const buttonTag = Button.init().domElement();

      containerTag.append(listTag, buttonTag);
      document.head.append(styleTag);
      document.body.append(containerTag);
    };

    const buildListItem = function buildListItem(data) {
      const li = document.createElement('li');

      li.innerText = data.name;
      li.classList.add('token__list-item');
      li.setAttribute('data-id', data.id);
      li.addEventListener('click', (e) => Controller.listItemClicked(e));
      return li;
    };

    let ul;

    return {
      render(data) {
        if (!data) {
          return;
        }

        ul.innerHTML = '';

        if (data.status === 'expired') {
          const li = document.createElement('li');
          li.innerText = 'Space expired.';
          li.classList.add('token__expired-label');
          ul.append(li);
          return;
        }

        const lists = data.lists;
        const active_list_id = data.active_list_id;

        lists.forEach((list) => {
          const li = buildListItem(list);

          if (list.id === active_list_id) {
            li.classList.add('token__list-item_active');
          }

          ul.append(li);
        });

        if (data.status === 'offline') {
          const li = document.createElement('li');
          li.innerText = 'Offline';
          li.classList.add('token__list-item');
          ul.append(li);
        }
      },

      init() {
        build();
        ul = List.contentElement();
      },
    };
  }());

  const Controller = (function makeController() {
    let root;

    const listSpecificStyleSheet = function listSpecificStyleSheet() {
      const styleSheetsArray = Array.from(document.styleSheets);

      return styleSheetsArray.filter((sheet) => (
        sheet.ownerNode.classList.contains('list-specific-stylesheet')
      ))[0];
    };

    const resetStyles = function resetStyles() {
      const sheet = listSpecificStyleSheet();

      if (sheet) {
        sheet.disabled = true;
      }

      root.style = '';
    };

    const updateStyles = function updateStyles(styles) {
      resetStyles();
      styles.forEach(({ name, value }) => {
        root.style.setProperty(`--remote-${name}`, value);
      });
    };

    const addStyleTransform = function addStyleTransform() {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = String.raw`
        * {
            transition: all 0.3s ease 0s;
          }`
      document.head.append(styleTag);
    };

    const initAndRenderWithLocalData = function initAndRenderWithLocalData(list_id = null) {
      Model.init(list_id); // gets data from localStorage
      View.init(); // builds container without any data
      View.render(Model.data()) // uses data to render list names
      updateStyles(Model.activeTokens()); // updates styles for active list
    };

    const subscribeToActionCable = function subscribeToActionCable() {
      const consumer = w.ActionCable.createConsumer(CABLE_URL);

      consumer.subscriptions.create({ channel: "ListChannel", space_name: SPACE_NAME }, {
        connected() {
          // Called when the subscription is ready for use on the server
          // console.log(`Standalone widget connected to ListChannel#${SPACE_NAME}`);
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
        },

        received(data) {
          switch (data.message_type) {
            case 'list_create':
              Model.addList(data.list);
              View.render(Model.data());
              break;
            case 'list_update':
              Model.updateList(data.list);
              View.render(Model.data());
              break;
            case 'list_destroy':
              Model.removeList(data.list_id);
              if (data.list_id === Model.data().active_list_id) {
                Model.resetActiveListId();
              }
              View.render(Model.data());
              break;
            case 'token_create':
              Model.addToken(data.token);
              if (data.token.list_id === Model.data().active_list_id) {
                updateStyles(Model.activeTokens());
              }

              break;
            case 'token_update':
              Model.updateToken(data.token);
              View.render(Model.data());
              if (data.token.list_id === Model.data().active_list_id) {
                updateStyles(Model.activeTokens());
              }

              break;
            case 'token_destroy':
              Model.removeToken(data.token);
              if (data.token.list_id === Model.data().active_list_id) {
                updateStyles(Model.activeTokens());
              }

              break;
            default:
              console.log(`No handler for message type ${data.message_type}`);
          }
        }
      });
    };

    return {
      updateStyles(styles) {
        updateStyles(styles);
      },

      listItemClicked(e) {
        const li = e.target;
        const listId = Number(li.dataset.id);

        Model.setActiveListId(listId);
        View.render(Model.data());
        updateStyles(Model.activeTokens());
      },

      init() {
        let list_id = document.getElementById('tokenhost-widget').dataset.listId;
        list_id = list_id ? Number(list_id) : null;

        SPACE_NAME = document.getElementById('tokenhost-widget').dataset.space;
        // API_HOST = document.getElementById('tokenhost-widget').dataset.host;
        API_URL = document.getElementById('tokenhost-widget').dataset.api;
        CABLE_URL = document.getElementById('tokenhost-widget').dataset.cable;

        root = document.documentElement;
        initAndRenderWithLocalData(list_id);
        w.setTimeout(addStyleTransform, 500);
        Model.fetchData()
          .then(() => {
            View.render(Model.data());
            updateStyles(Model.activeTokens());
            subscribeToActionCable();
          })
          .catch((error) => {
            if (error.message.includes('expired')) {
              resetStyles();
            }
          })
          .then(() => View.render(Model.data()));
      },
    };
  }());

  return {
    init() {
      Controller.init();
    },

    updateStyles(styles) {
      Controller.updateStyles(styles);
    },

    data() {
      return Model.data();
    },
  }
}());

window.Tokenhost = Tokenhost;

if (document.readyState !== 'loading') {
  Tokenhost.init();
} else {
  document.addEventListener('DOMContentLoaded', Tokenhost.init)
}
