// Proofreading Section Functionality
const proofreadSection = document.getElementById('proofreadSection');
const proofreadText = document.getElementById('proofreadText');
const downloadLink = document.getElementById('downloadLink');
const originalSection = document.getElementById('originalSection');
const originalText = document.getElementById('originalText');

// DOM Elements
const originalContent = document.getElementById('originalContent');
const proofreadContent = document.getElementById('proofreadContent');
const downloadBtn = document.getElementById('downloadBtn');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const audioControl = document.querySelector('.audio-control');

// Zoom state
let currentZoom = 100;
const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

// Initialize zoom controls
function initializeZoomControls() {
    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < MAX_ZOOM) {
            currentZoom += ZOOM_STEP;
            updateZoom();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > MIN_ZOOM) {
            currentZoom -= ZOOM_STEP;
            updateZoom();
        }
    });
}

function updateZoom() {
    originalContent.style.fontSize = `${currentZoom}%`;
    proofreadContent.style.fontSize = `${currentZoom}%`;
}



// Function to highlight differences
function highlightDifferences(original, proofread) {
    const words1 = original.split(/\s+/);
    const words2 = proofread.split(/\s+/);
    let originalHtml = '';
    let proofreadHtml = '';

    for (let i = 0; i < Math.max(words1.length, words2.length); i++) {
        if (i < words1.length && i < words2.length && words1[i] !== words2[i]) {
            originalHtml += `<span class="error-highlight">${words1[i]}</span> `;
            proofreadHtml += `<span class="correction-highlight">${words2[i]}</span> `;
        } else {
            if (i < words1.length) originalHtml += words1[i] + ' ';
            if (i < words2.length) proofreadHtml += words2[i] + ' ';
        }
    }

    return { originalHtml, proofreadHtml };
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Get data from localStorage
        const originalData = localStorage.getItem('originalData');
        const proofreadData = localStorage.getItem('proofreadData');

        if (!originalData || !proofreadData) {
            console.warn('Missing required data in localStorage');
            window.location.href = 'index.html';
            return;
        }

        // Parse and validate data
        const orgData = JSON.parse(originalData);
        const proofData = JSON.parse(proofreadData);

        if (!orgData.original_text || !proofData.proofread_text) {
            console.error('Missing required text data');
            window.location.href = 'index.html';
            return;
        }

        // Highlight differences and display text
        const { originalHtml, proofreadHtml } = highlightDifferences(
            orgData.original_text,
            proofData.proofread_text
        );

        originalContent.innerHTML = originalHtml;
        proofreadContent.innerHTML = proofreadHtml;

        // Set up download button
        if (proofData.download_url) {
            downloadBtn.addEventListener('click', () => {
                window.location.href = 'https://pdf-docs.onrender.com' + proofData.download_url;
            });
        }

        // Initialize zoom controls
        initializeZoomControls();

        // Clear localStorage after successful display
        localStorage.removeItem('originalData');
        localStorage.removeItem('proofreadData');

    } catch (error) {
        console.error('Error displaying content:', error);
        window.location.href = 'index.html';
    }
}); 

 function speakProofreadContent() {
    let contentElement = document.getElementById("proofreadContent");

    if (!contentElement) {
        alert("Content section not found.");
        return;
    }

    let content = contentElement.innerText.trim(); // Get actual text

    if (!content) {
        alert("No text available to read.");
        return;
    }

    let speech = new SpeechSynthesisUtterance(content);

    // Get available voices
    let voices = window.speechSynthesis.getVoices();

    // Choose a female voice
    let femaleVoice = voices.find(voice => 
        voice.name.includes("Google UK English Female") || 
        voice.name.includes("Google US English") || 
        voice.name.includes("Samantha") || 
        voice.name.includes("Microsoft Zira")
    );

    if (femaleVoice) {
        speech.voice = femaleVoice;
        console.log("Using voice:", femaleVoice.name);
    } else {
        console.log("No specific female voice found, using default.");
    }

    speech.rate = 1.0;  // Adjust speed (1.0 = normal)
    speech.pitch = 1.2; // Slightly higher pitch for a more feminine tone

     // Stop any previous speech before starting a new one
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);

        // Remove event listener to prevent looping
        window.speechSynthesis.onvoiceschanged = null;
}

if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
        setVoice();
    }
