import consumer from "./consumer"

const root = document.documentElement;
const storage = window.localStorage;

const activeListId = function activeListId() {
  return Number(storage[`activeListId#${spaceName}`]) || null;
};

const updateStyles = function updateStyles(tokens) {
    root.style = '';

    tokens.forEach(({ name, value }, index) => {
      root.style.setProperty(`--remote-${name}`, value);
    });
  };

const spaceSlugTag = document.querySelector('meta[name="space-slug"]');
const spaceName = spaceSlugTag ? spaceSlugTag.content : null;

if (spaceName) {

  consumer.subscriptions.create({ channel: "ListChannel", space_name: spaceName }, {
    connected() {
      // Called when the subscription is ready for use on the server
      // console.log(`Client app connected to ListChannel#${spaceName}`);
      // console.log(`Active list_id: ${activeListId()}`);
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      // console.log(`Received broadcast for list_id: ${data.list_id}`);
      // console.log(`Active list_id: ${activeListId()}`);
      if (data.list_id === activeListId()) {
        updateStyles(data.tokens);
      }
    }
  });
}


