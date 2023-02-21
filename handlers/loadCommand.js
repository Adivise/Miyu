const chillout = require("chillout");
const readdirRecursive = require("recursive-readdir");
const { resolve, relative } = require("path");

module.exports = async (client) => {
    let interactionsPath = resolve("./commands");
    let interactionFiles = await readdirRecursive(interactionsPath);

    await chillout.forEach(interactionFiles, (interactionFile) => {
      const rltPath = relative(__dirname, interactionFile);
      const command = require(interactionFile);

    if (command.name.length > 3) {
        console.log(`[WARN] "${rltPath}" The name list of the interaction file is too long. (>3) Skipping..`);
        return;
    }

    if (!command.name?.length) {
        console.log(`[WARN] "${rltPath}" The interaction file does not have a name. Skipping..`);
        return;
    }

    if (client.commands.has(command.name)) {
        console.log(`[WARN] "${command.name[1]}" interaction has already been installed. It's skipping.`)
        return;
    }

    client.commands.set(command.name, command);
    });

    if (client.commands.size) {
        console.log(`[INFO] ${client.commands.size} Interactions Loaded!`);
    } else {
        console.log(`[WARN] No interactions loaded, is everything ok?`);
    }
}