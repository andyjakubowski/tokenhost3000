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

const TokenHub = (function makeTokenHub() {
  const w = window;
  let SPACE_NAME;
  let API_HOST;
  let API_URL;

  const Model = (function makeModel() {
    const STORAGE_KEY = 'TokenHub';

    const getLocalStorage = (function makeGetLocalStorage() {
      const emptyDataObject = {
        lists: [],
        active_list_id: null,
        updated_at: null,
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

    let data;

    return {
      fetchData() {
        return this.getLists()
          .then(() => this.getTokensForAllLists())
          .then(() => {
            if (listWithId(data.active_list_id) === -1) {
              this.resetActiveListId();
            }
          });
      },

      getLists() {
        return fetch(`${API_URL}/${SPACE_NAME}.json`)
          .then((response) => response.json())
          .then((lists) => {
            data.lists = lists;
            data.updated_at = Date.now();
            saveToLocalStorage();
            return lists;
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
        list.tokens = [];
        data.lists.push(list);
        saveToLocalStorage();
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

      init() {
        data = getLocalStorage();
      },
    };
  }());

  const View = (function makeView() {
    const build = function buildView() {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = String.raw`
        .token-list-switcher {
          background-color: black;
          color: gray;
        }

        .token-list-switcher__lists {
          display: flex;
          height: 56px;
          justify-content: flex-start;
          align-items: center;
          overflow: auto;
          list-style: none;
        }

        .token-list-switcher__list-item {
          flex-shrink: 0;
          padding: 16px;
          cursor: pointer;
        }

        .token-list-switcher__list-item:hover {
          color: white;
        }

        .token-list-switcher__list-item_active {
          color: seashell;
        }
      `;
      document.head.append(styleTag);

      const divTag = document.createElement('div');
      divTag.setAttribute('aria-hidden', 'true');
      divTag.classList.add('token-list-switcher')
      divTag.innerHTML = String.raw`
        <ul class="token-list-switcher__lists">
        </ul>`;
      document.body.prepend(divTag);
    };

    let ul;

    return {
      render(data) {
        if (!data) {
          return;
        }

        const lists = data.lists;
        const active_list_id = data.active_list_id;

        ul.innerHTML = '';
        lists.forEach((list) => {
          const li = document.createElement('li');

          li.innerText = list.name;
          li.classList.add('token-list-switcher__list-item');
          li.setAttribute('data-id', list.id);

          if (list.id === active_list_id) {
            li.classList.add('token-list-switcher__list-item_active');
          }

          li.addEventListener('click', (e) => Controller.listItemClicked(e));
          ul.append(li);
        });
      },

      init() {
        build();
        ul = document.querySelector('.token-list-switcher__lists');
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

    const initAndRenderWithLocalData = function initAndRenderWithLocalData() {
      Model.init(); // gets data from localStorage
      View.init(); // builds container without any data
      View.render(Model.data()) // uses data to render list names
      updateStyles(Model.activeTokens()); // updates styles for active list
    };

    const subscribeToActionCable = function subscribeToActionCable() {
      const consumer = w.ActionCable.createConsumer(`${API_URL}/cable`);

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
        SPACE_NAME = document.getElementById('tokenhub-widget').dataset.space;
        // API_HOST = document.getElementById('tokenhub-widget').dataset.host;
        API_URL = document.getElementById('tokenhub-widget').dataset.api;
        root = document.documentElement;
        initAndRenderWithLocalData();
        w.setTimeout(addStyleTransform, 500);
        Model.fetchData()
          .then(() => {
            View.render(Model.data());
            updateStyles(Model.activeTokens());
            subscribeToActionCable();
          });
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

window.TokenHub = TokenHub;

if (document.readyState !== 'loading') {
  TokenHub.init();
} else {
  document.addEventListener('DOMContentLoaded', TokenHub.init)
}
