require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

const Widget = (function makeWidget() {
  const w = window;

  const Model = (function makeModel() {
    const SPACE_NAME = document.querySelector('meta[name="space"]').content;
    const API_URL = document.querySelector('meta[name="api-url"]').content;
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
            firstListId = data.lists[0].id;
            data.active_list_id = data.active_list_id || firstListId;
            saveToLocalStorage();
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

      setActiveListId(id) {
        data.active_list_id = id;
        data.updated_at = Date.now();
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

  const Controller = (function makeView() {
    const root = document.documentElement;
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

    return {
      updateStyles(styles) {
        updateStyles(styles);
      },

      listItemClicked(e) {
        const li = e.target;
        const listId = Number(li.dataset.id);

        Model.setActiveListId(listId);
        View.render(Model.data());

        Model.getTokens(listId)
          .then((tokens) => {
            updateStyles(tokens);
          });
      },

      init() {
        initAndRenderWithLocalData();
        w.setTimeout(addStyleTransform, 500);
        Model.fetchData()
          .then(() => {
            View.render(Model.data());
            updateStyles(Model.activeTokens());
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

window.Widget = Widget;

if (document.readyState !== 'loading') {
  Widget.init();
} else {
  document.addEventListener('DOMContentLoaded', Widget.init)
}
