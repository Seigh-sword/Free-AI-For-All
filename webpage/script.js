// webpage/script.js
import { AIHandler } from '../AIHandler/AIHandler.js'; 

const coco = new AIHandler();
const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const btn = document.getElementById('sendBtn');
const loader = document.getElementById('loader');

async function handleAction() {
    const prompt = input.value.trim();
    if (!prompt) return;

    // 1. Clear input and show loading
    appendMessage('user', prompt);
    input.value = "";
    loader.classList.remove('hidden');

    try {
        let result;
        if (prompt.startsWith('/image')) {
            const cleanPrompt = prompt.replace('/image', '').trim();
            // Using Flux for best 2025 image quality
            result = await coco.img.prompt(cleanPrompt).set.model('flux').generate();
            appendMessage('ai', result, 'image');
        } else {
            result = await coco.txt.prompt(prompt).set.model('openai').generate();
            appendMessage('ai', result, 'text');
        }
    } catch (err) {
        appendMessage('ai', "🥥 Error: CoCo lost its connection to the tree!");
    } finally {
        loader.classList.add('hidden');
        input.focus(); // Keep the cursor in the box for the next message
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
    chat.scrollTop = chat.scrollHeight;
}

btn.onclick = handleAction;
input.onkeydown = (e) => e.key === 'Enter' && handleAction();

// Final check: make sure the box is ready when page loads
window.onload = () => input.focus();
