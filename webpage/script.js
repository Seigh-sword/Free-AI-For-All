import { AIHandler } from '../AIHandler/AIHandler.js'; 

const coco = new AIHandler();
const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const btn = document.getElementById('sendBtn');
const loader = document.getElementById('loader');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

async function handleAction() {
    const prompt = input.value.trim();
    if (!prompt) return;

    // UI Feedback
    appendMessage('user', prompt);
    input.value = "";
    loader.classList.remove('hidden');
    statusDot.classList.add('active');
    statusText.innerText = "Processing...";

    try {
        let result;
        // Multimodal Logic
        if (prompt.toLowerCase().startsWith('/image')) {
            const cleanPrompt = prompt.replace(/\/image/i, '').trim();
            result = await coco.img.prompt(cleanPrompt).set.model('flux').generate();
            appendMessage('ai', result, 'image');
        } else {
            // Text Logic using OpenAI
            result = await coco.txt.prompt(prompt).set.model('openai').generate();
            appendMessage('ai', result, 'text');
        }
    } catch (err) {
        appendMessage('ai', "🥥 CoCo hit a snag! Please try that again.");
        console.error(err);
    } finally {
        loader.classList.add('hidden');
        statusDot.classList.remove('active');
        statusText.innerText = "Ready";
        input.focus(); // Returns cursor to the box automatically
    }
}

function appendMessage(sender, content, type = 'text') {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    
    if (sender === 'ai') {
        const icon = `<img src="https://raw.githubusercontent.com/Seigh-sword/Free-AI-For-All/refs/heads/main/assets/CoCoAiIcon.png" class="ai-icon">`;
        if (type === 'image') {
            msg.innerHTML = `${icon}<div><img src="${content}" class="gen-img"></div>`;
        } else {
            msg.innerHTML = `${icon}<span>${content}</span>`;
        }
    } else {
        msg.innerText = content;
    }
    
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight; // Auto-scroll to bottom
}

// Click and Enter listeners
btn.onclick = handleAction;
input.onkeydown = (e) => {
    if (e.key === 'Enter') handleAction();
};

// Initial focus so you can type immediately
window.onload = () => input.focus();
