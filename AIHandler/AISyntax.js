export class AISyntax {
    constructor(handler) {
        this.handler = handler; // Store reference to the main AIHandler
        this.models = {
            text: { deepseek: "deepseek-r1", gemini: "gemini", p1: "p1" },
            image: { flux: "flux", turbo: "turbo" }
        };

        this.config = {
            text: { prompt: "", model: "gemini" },
            image: { prompt: "", model: "flux" },
            params: { seed: Math.floor(Math.random() * 99999) }
        };

        // Chaining helpers
        this.txt = { prompt: (p) => { this.config.text.prompt = p; return this; } };
        this.img = { prompt: (p) => { this.config.image.prompt = p; return this; } };
        
        this.set = {
            txt: { model: (m) => { this.config.text.model = m; return this; } },
            seed: (s) => { this.config.params.seed = s; return this; }
        };
    }

    // 🥥 The Missing Link: This allows .generate() to work at the end of a chain
    async generate() {
        return await this.handler.generate();
    }
}
