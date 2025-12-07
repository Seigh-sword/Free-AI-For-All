// Free-AI-For-All.js
// Official Browser SDK for Seigh_sword — uses storm-engine host by default.

class FreeAIForAll {
  constructor(config = {}) {
    // default configuration
    this.config = {
      temperature: 0.7,
      maxTokens: 3000,
      model: "openai", // 'openai' | 'mistral' | 'llama'
      seed: null,
      textTimeout: 6000,   // ms
      imageTimeout: 65000, // ms
      ...config
    };

    // DEFAULT endpoint switched to your provided host (overrideable)
    this.api = config.api || "https://storm-engine-073.app.ohara.ai/Free-AI-For-All.js";

    // expose version
    this._version = "1.0.0";
  }

  // update runtime config (and optionally endpoint)
  configure(newConfig = {}) {
    if (newConfig.api) {
      this.api = newConfig.api;
      delete newConfig.api;
    }
    this.config = { ...this.config, ...newConfig };
  }

  // CHAT - text responses
  async chat(message, options = {}) {
    const body = {
      type: "text",
      prompt: message,
      model: options.model ?? this.config.model,
      temperature: options.temperature ?? this.config.temperature,
      max_tokens: options.maxTokens ?? this.config.maxTokens,
      seed: this.config.seed ?? undefined
    };

    return await this._post(body, this.config.textTimeout);
  }

  // CODE generation
  async code(message, language = "javascript", options = {}) {
    const body = {
      type: "code",
      prompt: message,
      language,
      model: options.model ?? this.config.model,
      temperature: options.temperature ?? this.config.temperature,
      max_tokens: options.maxTokens ?? this.config.maxTokens
    };

    return await this._post(body, this.config.textTimeout);
  }

  // IMAGE generation
  async generateImage(prompt, options = {}) {
    const body = {
      type: "image",
      prompt,
      width: options.width ?? 1024,
      height: options.height ?? 1024,
      nologo: options.nologo ?? true,
      enhance: options.enhance ?? false
    };

    return await this._post(body, this.config.imageTimeout);
  }

  // Internal POST helper with Abort handling and robust response parsing
  async _post(payload, timeoutMs = 6000) {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch(this.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal
      });

      clearTimeout(timeoutId);

      if (!resp.ok) {
        // try to parse error body if any
        let text;
        try { text = await resp.text(); } catch(e) { text = ""; }
        throw new Error(`API Error ${resp.status}${text ? ": " + text : ""}`);
      }

      // parse JSON (safe)
      let data;
      try {
        data = await resp.json();
      } catch (e) {
        throw new Error("Invalid JSON response from API");
      }

      // flexible return fields (fallbacks)
      const out = data?.output ?? data?.response ?? data?.text ?? data?.result ?? null;

      // If image type, many endpoints return a url/string inside a field
      if (payload.type === "image" && out && typeof out === "object") {
        // try common shapes
        return out.url ?? out.image ?? out.data ?? out;
      }

      return out;
    } catch (err) {
      // Normalize abort errors
      if (err.name === "AbortError") {
        throw new Error(`AI request aborted after ${timeoutMs}ms`);
      }
      throw new Error("AI request failed: " + (err.message || String(err)));
    }
  }

  // returns status info (does not call network by default)
  getStatus() {
    return {
      version: this._version,
      model: this.config.model,
      endpoint: this.api,
      config: { ...this.config }
    };
  }

  // lightweight availability check (optional network ping)
  async isAvailable(ping = false) {
    if (!ping) return true;
    try {
      const resp = await fetch(this.api, { method: "OPTIONS" });
      return resp.ok;
    } catch {
      return false;
    }
  }
}

// Export to global (so <script> tag gives window.FreeAIForAll)
if (typeof window !== "undefined") {
  window.FreeAIForAll = FreeAIForAll;
}
