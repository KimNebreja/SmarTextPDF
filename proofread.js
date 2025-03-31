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

//Text-to-Speech Functionality
let speechInstance = null;
let isSpeaking = false;
let isPaused = false;

function toggleSpeech() {
    let button = document.getElementById("speechButton");
    let icon = document.getElementById("speechIcon");
    let pauseButton = document.getElementById("pauseButton");

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        isPaused = false;
        button.innerHTML = '<i id="speechIcon" class="fas fa-volume-up"></i> Read Aloud';
        pauseButton.style.display = "none"; 
        console.log("Speech stopped.");
    } else {
        let contentElement = document.getElementById("proofreadContent");

        if (!contentElement) {
            alert("Content section not found.");
            return;
        }

        let content = contentElement.innerText.trim();

        if (!content) {
            alert("No text available to read.");
            return;
        }

        speechInstance = new SpeechSynthesisUtterance(content);

        function setVoiceAndSpeak() {
            let voices = window.speechSynthesis.getVoices();

            let femaleVoice = voices.find(voice => 
                voice.name.includes("Google UK English Female") || 
                voice.name.includes("Google US English") || 
                voice.name.includes("Samantha") || 
                voice.name.includes("Microsoft Zira")
            );

            if (femaleVoice) {
                speechInstance.voice = femaleVoice;
                console.log("Using voice:", femaleVoice.name);
            } else {
                console.log("No specific female voice found, using default.");
            }

            speechInstance.rate = 1.0;
            speechInstance.pitch = 1.2;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(speechInstance);

            isSpeaking = true;
            isPaused = false;
            button.innerHTML = '<i id="speechIcon" class="fas fa-stop"></i>';
            pauseButton.style.display = "inline-block"; 

            speechInstance.onend = () => {
                isSpeaking = false;
                isPaused = false;
                button.innerHTML = '<i id="speechIcon" class="fas fa-volume-up"></i>';
                pauseButton.style.display = "none";
            };

            window.speechSynthesis.onvoiceschanged = null;
        }

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
        } else {
            setVoiceAndSpeak();
        }
    }
}

function pauseSpeech() {
    let button = document.getElementById("pauseButton");

    if (isSpeaking) {
        if (isPaused) {
            window.speechSynthesis.resume();
            isPaused = false;
            button.innerHTML = '<i class="fas fa-pause"></i>';
            console.log("Speech resumed.");
        } else {
            window.speechSynthesis.pause();
            isPaused = true;
            button.innerHTML = '<i class="fas fa-play"></i>';
            console.log("Speech paused.");
        }
    }
}
