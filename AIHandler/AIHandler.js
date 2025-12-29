// AIHandler/AIHandler.js
import { AILoader } from './AILoader.js';
import { AISyntax } from './AISyntax.js';

export class AIHandler {
    constructor() {
        this.loader = new AILoader();
        this.syntax = new AISyntax(this); 

        // Expose all syntax methods
        this.txt = this.syntax.txt;
        this.img = this.syntax.img; // New: Image generation entry point
        this.set = this.syntax.set;
        this.models = this.syntax.models; // Expose available models
    }

    async generate() {
        // AIHandler now passes the full config (including 'type') to the loader
        return await this.loader.load(this.syntax.config);
    }
}
