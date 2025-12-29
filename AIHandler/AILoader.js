// AIHandler/AILoader.js
export class AILoader {
    constructor() {
        this.endpoint = "https://text.pollinations.ai/";
    }

    async load(config) {
        // If it's a text request
        if (config.text.prompt) {
            const response = await fetch(`${this.endpoint}${encodeURIComponent(config.text.prompt)}?model=${config.text.model}&seed=${config.params.seed}`);
            return await response.text();
        }
        // If it's an image request, return the URL
        if (config.image.prompt) {
            return `https://image.pollinations.ai/prompt/${encodeURIComponent(config.image.prompt)}?model=${config.image.model}&seed=${config.params.seed}&nologo=true`;
        }
    }
}
