import { AIHandler } from '../AIHandler/AIHandler.js';

const coco = new AIHandler();
const libraryGrid = document.getElementById('library-grid');

// --- 1. LOCAL STORAGE LIBRARY ---
function saveToLibrary(url) {
    let images = JSON.parse(localStorage.getItem('coco_library') || '[]');
    images.push({ url, date: new Date().toLocaleDateString() });
    localStorage.setItem('coco_library', JSON.stringify(images));
    updateLibraryUI();
}

function updateLibraryUI() {
    const images = JSON.parse(localStorage.getItem('coco_library') || '[]');
    libraryGrid.innerHTML = images.map(img => `
        <div class="lib-card">
            <img src="${img.url}" onclick="downloadImage('${img.url}', 'jpg')">
        </div>
    `).join('');
}

// --- 2. DOWNLOAD ENGINE ---
window.downloadImage = async (url, format) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `CoCo_Art_${Date.now()}.${format}`;
    link.click();
};

// --- 3. CHAT LOGIC WITH REVEAL ---
async function handleAction() {
    const prompt = document.getElementById('userInput').value.trim();
    if (!prompt) return;

    appendMessage('user', prompt);
    document.getElementById('userInput').value = "";
    document.getElementById('loader').classList.remove('hidden');

    try {
        if (prompt.startsWith('/image')) {
            const resultUrl = await coco.img.prompt(prompt.replace('/image', '')).generate();
            
            // Append Image with Reveal
            const imgId = 'img-' + Date.now();
            appendMessage('ai', `<div class="img-container">
                <img id="${imgId}" src="${resultUrl}" class="gen-img">
                <div class="dl-btns">
                    <button onclick="downloadImage('${resultUrl}', 'jpg')">JPG</button>
                    <button onclick="downloadImage('${resultUrl}', 'png')">PNG</button>
                </div>
            </div>`, 'html');

            // Trigger Slow Reveal
            setTimeout(() => document.getElementById(imgId).classList.add('revealed'), 100);
            saveToLibrary(resultUrl);
        } else {
            const res = await coco.txt.prompt(prompt).generate();
            appendMessage('ai', res);
        }
    } catch (e) { console.error(e); }
    finally { document.getElementById('loader').classList.add('hidden'); }
}

// --- 4. PANEL NAVIGATION ---
window.showPanel = (type) => {
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    if(type !== 'chat') document.getElementById(`${type}-panel`).classList.remove('hidden');
};
window.hidePanels = () => document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));

document.getElementById('sendBtn').onclick = handleAction;
updateLibraryUI(); // Initialize library on load
