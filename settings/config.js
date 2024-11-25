require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN_BOT",
    OWNER_ID: process.env.OWNER_ID || "YOUR_DISCORD_OWNER_ID",
    EMBED_COLOR: process.env.EMBED_COLOR || "#000001",
    SEARCH_DEFAULT: ["yoasobi", "zutomayo", "kotoha", "lisa"],
    SEARCH_ENGINE: process.env.SEARCH_ENGINE || "youtube", // default -- 'youtube' | 'soundcloud' | 'youtube_music'
    LEAVE_EMPTY: process.env.LEAVE_EMPTY || "120000",
    NODES: [
        {
            name: process.env.NODE_NAME || 'NanoSpace',
            url: process.env.NODE_URL || 'localhost:5555',
            auth: process.env.NODE_AUTH || 'nanospace',
            secure: false
        }
    ]
}
