require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

const App = (function App() {
  const SPACE_NAME = document.querySelector('meta[name="space-slug"]').content;
  const API_URL = document.querySelector('meta[name="api-url"]').content;
  const root = document.documentElement;
  const storage = window.localStorage;
  let ul;

  const activeListId = function activeListId() {
    return Number(document.querySelector('meta[name="list-id"]').content) || null;
  };

  const getLists = function getLists() {
    return fetch(`${API_URL}/${SPACE_NAME}.json`)
      .then((response) => response.json());
  };

  const getTokens = function getTokens(listId) {
    return fetch(`${API_URL}/lists/${listId}/tokens.json`)
      .then((response) => response.json());
  };

  const selectList = function selectList(li) {
    const activeLi = document.querySelector('li[data-active]');
    activeLi.classList.remove('token-list-switcher__list-item_active');
    activeLi.removeAttribute('data-active');

    li.classList.add('token-list-switcher__list-item_active');
    li.setAttribute('data-active', '');
    storage.setItem(`activeListId#${SPACE_NAME}`, li.dataset.id);
  };

  const listItemClicked = function listItemClicked(e) {
    const li = e.target;
    selectList(li);

    getTokens(li.dataset.id)
      .then((tokens) => updateStyles(tokens));
  };

  const updateStyles = function updateStyles(tokens) {

    root.style = '';

    tokens.forEach(({ name, value }, index) => {
      root.style.setProperty(`--remote-${name}`, value);
    });
  };

  const updateListSwitcher = function updateListSwitcher(lists) {
    ul.innerHTML = '';

    lists.forEach((list) => {
      const li = document.createElement('li');

      li.innerText = list.name;
      li.classList.add('token-list-switcher__list-item');
      li.setAttribute('data-id', list.id);
      if (list.id === activeListId()) {
        li.setAttribute('data-active', '');
        li.classList.add('token-list-switcher__list-item_active');
        getTokens(list.id)
          .then((tokens) => updateStyles(tokens));
      }

      li.addEventListener('click', (e) => listItemClicked(e));
      ul.append(li);
    });
  };

  return {
    init () {
      ul = document.querySelector('.token-list-switcher__lists');
      storage.setItem(`activeListId#${SPACE_NAME}`, activeListId());

      // console.log(`App.init: activeListId: ${activeListId()}`);

      getLists()
        .then((lists) => updateListSwitcher(lists));
    },
  };
}());

if (document.readyState !== 'loading') {
  App.init();
} else {
  document.addEventListener('DOMContentLoaded', App.init)
}
