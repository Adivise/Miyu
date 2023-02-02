const { readdirSync } = require("fs");

module.exports = async (client) => {
    try {
        readdirSync("./events/track/").forEach(file => {
            const event = require(`../events/track/${file}`);
            let eventName = file.split(".")[0];
            client.manager.on(eventName, event.bind(null, client));
        });
    } catch (e) {
      //  console.log(e);
    }
};
