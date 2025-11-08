class EmojiParser {
    constructor() {
        this.client = null;
    }

    setClient(client) {
        this.client = client;
    }

    // Parse emoji từ nhiều format khác nhau
    parseEmoji(input) {
        if (!input) return null;

        // Format: <:name:id> hoặc <a:name:id>
        const customMatch = input.match(/<(a)?:(\w+):(\d+)>/);
        if (customMatch) {
            return {
                type: 'custom',
                animated: !!customMatch[1],
                name: customMatch[2],
                id: customMatch[3],
                raw: input
            };
        }

        // Chỉ là ID
        if (/^\d+$/.test(input)) {
            const emoji = this.client?.emojis.cache.get(input);
            if (emoji) {
                return {
                    type: 'custom',
                    animated: emoji.animated,
                    name: emoji.name,
                    id: emoji.id,
                    raw: emoji.toString()
                };
            }
        }

        // Unicode emoji
        return {
            type: 'unicode',
            name: input,
            raw: input
        };
    }

    // Convert về Discord API format
    toDiscordFormat(emojiData) {
        if (!emojiData) return null;

        if (emojiData.type === 'custom') {
            return {
                name: emojiData.name,
                id: emojiData.id,
                animated: emojiData.animated
            };
        }

        return {
            name: emojiData.name
        };
    }

    // Get emoji URL
    getEmojiURL(emojiData) {
        if (emojiData.type === 'custom') {
            const ext = emojiData.animated ? 'gif' : 'png';
            return `https://cdn.discordapp.com/emojis/${emojiData.id}.${ext}`;
        }
        return null;
    }
}

module.exports = new EmojiParser();
