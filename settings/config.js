require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN_BOT",
    PREFIX: process.env.PREFIX || "#",
    OWNER_ID: process.env.OWNER_ID || "YOUR_DISCORD_OWNER_ID",
    EMBED_COLOR: process.env.EMBED_COLOR || "#000001",
    SEARCH_ENGINE: process.env.SEARCH_ENGINE || "youtube", // default -- 'youtube' | 'soundcloud' | 'youtube_music'
    NODES: [
        {
            name: process.env.NODES_NAME || 'NanoSpace',
            url: process.env.NODES_URL || 'localhost:5555',
            auth: process.env.EMBED_AUTH || 'nanospace',
            secure: false
        }
    ]
}