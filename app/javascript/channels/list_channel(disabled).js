import consumer from "./consumer"

consumer.subscriptions.create("ListChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log('TokenHub connected to ListChannel');
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log(`Received data: ${data}`);
  }
});
