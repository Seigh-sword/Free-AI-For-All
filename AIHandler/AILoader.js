export class AILoader {
    constructor() {
        this.endpoints = {
            // The new 2025 Unified Gateway
            unified: "https://gen.pollinations.ai/",
            text: "https://text.pollinations.ai/",
            image: "https://image.pollinations.ai/prompt/"
        };
    }

    async load(config) {
        try {
            // 1. VIDEO (Veo / Seedance Pro-Fast)
            if (config.video.prompt) {
                const params = new URLSearchParams({
                    model: config.video.model || 'veo',
                    seed: config.params.seed,
                    enhance: true // 2025 default for video
                });
                return `${this.endpoints.unified}${encodeURIComponent(config.video.prompt)}?${params.toString()}`;
            }

            // 2. AUDIO & SFX (OpenAI-Audio / Midijourney)
            if (config.audio.prompt || config.sfx.prompt) {
                const prompt = config.audio.prompt || config.sfx.prompt;
                const params = new URLSearchParams({
                    model: config.audio.prompt ? "openai-audio" : "midijourney",
                    voice: config.audio.voice || 'nova', // Choice: Coral, Verse, Sage, etc.
                    seed: config.params.seed
                });
                return `${this.endpoints.text}${encodeURIComponent(prompt)}?${params.toString()}`;
            }

            // 3. IMAGE (Seedream 4.5 / Nano Banana Pro)
            if (config.image.prompt) {
                const params = new URLSearchParams({
                    model: config.image.model || 'seedream',
                    width: config.params.width || 1024,
                    height: config.params.height || 1024,
                    seed: config.params.seed,
                    nologo: true
                });
                return `${this.endpoints.image}${encodeURIComponent(config.image.prompt)}?${params.toString()}`;
            }

            // 4. TEXT (DeepSeek V3.1 / Gemini 3 Flash / GPT-5 Nano)
            if (config.text.prompt) {
                const payload = {
                    messages: [
                        { role: 'system', content: config.params.system || "Assistant" },
                        { role: 'user', content: config.text.prompt }
                    ],
                    model: config.text.model || 'openai',
                    seed: config.params.seed,
                    // 2025 Reasoning Feature
                    reasoning_effort: config.text.model.includes('deepseek') ? 'high' : 'medium'
                };

                // Add 2025 Multimodal attachments
                if (config.params.attachments?.length > 0) {
                    payload.messages[1].attachments = config.params.attachments;
                }

                const response = await fetch(this.endpoints.text, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
                return await response.text();
            }

        } catch (error) {
            console.error("Pollinations 2025 Loader Error:", error);
            return { error: error.message };
        }
    }
}
