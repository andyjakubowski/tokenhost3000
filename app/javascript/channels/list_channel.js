import consumer from "./consumer"

const root = document.documentElement;
const w = window;

const spaceSlugTag = document.querySelector('meta[name="space"]');
const spaceName = spaceSlugTag ? spaceSlugTag.content : null;

if (spaceName) {
  consumer.subscriptions.create({ channel: "ListChannel", space_name: spaceName }, {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log(`Client app connected to ListChannel#${spaceName}`);
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      console.log(`Received broadcast for list_id: ${data.list_id}`);
      if (data.list_id === w.Widget.data().active_list_id) {
        w.Widget.updateStyles(data.tokens);
      }
    }
  });
}
