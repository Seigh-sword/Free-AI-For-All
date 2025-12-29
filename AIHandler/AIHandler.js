import { AISyntax } from './AISyntax.js';
import { AILoader } from './AILoader.js';

export class AIHandler {
    constructor() {
        this.syntax = new AISyntax();
        this.loader = new AILoader();
        
        // Expose syntax methods for easy access
        this.txt = this.syntax.txt;
        this.img = this.syntax.img;
        this.vid = this.syntax.vid;
        this.snd = this.syntax.snd;
        this.sfx = this.syntax.sfx;
        this.set = this.syntax.set;
        this.attach = this.syntax.attach;
        this.models = this.syntax.models;
    }

    async generate() {
        return await this.loader.load(this.syntax.config);
    }
}import { AISyntax } from './AISyntax.js';
import { AILoader } from './AILoader.js';

export class AIHandler {
    constructor() {
        this.syntax = new AISyntax();
        this.loader = new AILoader();
        
        // Expose syntax methods for easy access
        this.txt = this.syntax.txt;
        this.img = this.syntax.img;
        this.vid = this.syntax.vid;
        this.snd = this.syntax.snd;
        this.sfx = this.syntax.sfx;
        this.set = this.syntax.set;
        this.attach = this.syntax.attach;
        this.models = this.syntax.models;
    }

    async generate() {
        return await this.loader.load(this.syntax.config);
    }
}
