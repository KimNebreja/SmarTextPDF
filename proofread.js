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

// Text-to-speech functionality
let isSpeaking = false;
let voices = [];
let currentUtterance = null;

// Load voices when they become available
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    // Find Google voices
    const googleVoices = voices.filter(voice => voice.name.includes('Google'));
    if (googleVoices.length > 0) {
        // Prefer a female Google voice if available
        const femaleGoogleVoice = googleVoices.find(voice => voice.name.includes('Female'));
        if (femaleGoogleVoice) {
            return femaleGoogleVoice;
        }
        // Fall back to first Google voice
        return googleVoices[0];
    }
    return null;
}

// Initialize voices
window.speechSynthesis.onvoiceschanged = loadVoices;

// Handle speech synthesis events
function setupSpeechEvents(utterance) {
    utterance.onend = () => {
        isSpeaking = false;
        audioControl.querySelector('i').classList.replace('bx-volume-full', 'bxs-volume-full');
    };

    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        isSpeaking = false;
        audioControl.querySelector('i').classList.replace('bx-volume-full', 'bxs-volume-full');
    };

    utterance.onpause = () => {
        isSpeaking = false;
        audioControl.querySelector('i').classList.replace('bx-volume-full', 'bxs-volume-full');
    };
}

audioControl.addEventListener('click', () => {
    if (!isSpeaking) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const text = proofreadContent.textContent;
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Get Google voice
        const googleVoice = loadVoices();
        if (googleVoice) {
            currentUtterance.voice = googleVoice;
        }
        
        // Set speech rate and pitch for better clarity
        currentUtterance.rate = 0.9;  // Slightly slower rate
        currentUtterance.pitch = 1.0; // Normal pitch
        
        // Setup event handlers
        setupSpeechEvents(currentUtterance);
        
        // Start speaking
        window.speechSynthesis.speak(currentUtterance);
        audioControl.querySelector('i').classList.replace('bxs-volume-full', 'bx-volume-full');
        isSpeaking = true;
    } else {
        window.speechSynthesis.cancel();
        audioControl.querySelector('i').classList.replace('bx-volume-full', 'bxs-volume-full');
        isSpeaking = false;
    }
});

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
