module.exports = async (client, name, code, reason) => {
    console.warn(`[LAVALINK] | ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`);
}