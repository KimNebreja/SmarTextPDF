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

        // Get the file name from localStorage or use default
        const fileName = proofData.file_name || 'For Proofread.pdf';
        
        // Update file name in both places
        const initialFile = document.querySelector('.uploaded-file');
        if (initialFile) {
            initialFile.querySelector('.file-name').textContent = fileName;
            initialFile.dataset.originalText = orgData.original_text;
            initialFile.dataset.proofreadText = proofData.proofread_text;
            initialFile.dataset.fileName = fileName;
            if (proofData.download_url) {
                initialFile.dataset.downloadUrl = proofData.download_url;
            }
            
            // Make initial file active
            initialFile.classList.add('active');
        }
        
        document.querySelector('#originalSection .section-header h2').textContent = fileName;

        // Highlight differences 
        const { originalHtml, proofreadHtml } = highlightDifferences(
            orgData.original_text,
            proofData.proofread_text
        );

        // Set up content
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

    // New File and Delete Functionality
    const newFileBtn = document.querySelector('.new-file-btn');
    const newFileInput = document.getElementById('newFileInput');
    const deleteFileBtn = document.querySelector('.delete-file-btn');

    // New File button click handler
    newFileBtn.addEventListener('click', () => {
        newFileInput.click();
    });

    // Add click handler to initial file
    const initialFile = document.querySelector('.uploaded-file');
    if (initialFile) {
        initialFile.addEventListener('click', (e) => {
            // Don't trigger if clicking the delete button
            if (e.target.closest('.delete-file-btn')) return;
            
            // Remove active class from all files
            document.querySelectorAll('.uploaded-file').forEach(f => f.classList.remove('active'));
            // Add active class to clicked file
            initialFile.classList.add('active');

            // Update content
            const { originalHtml, proofreadHtml } = highlightDifferences(
                initialFile.dataset.originalText,
                initialFile.dataset.proofreadText
            );

            originalContent.innerHTML = originalHtml;
            proofreadContent.innerHTML = proofreadHtml;
            document.querySelector('#originalSection .section-header h2').textContent = initialFile.dataset.fileName;

            // Update download button
            if (initialFile.dataset.downloadUrl) {
                downloadBtn.onclick = () => {
                    window.location.href = 'https://pdf-docs.onrender.com' + initialFile.dataset.downloadUrl;
                };
            }
        });
    }

    // Handle file selection
    newFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file");
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert("File size should be less than 10MB");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Create new uploaded file element with the actual file name
            const newUploadedFile = document.createElement('div');
            newUploadedFile.className = 'uploaded-file';
            newUploadedFile.innerHTML = `
                <i class='bx bx-file bx-flip-horizontal'></i>
                <span class="file-name">${file.name}</span>
                <button class="delete-file-btn">
                    <i class='bx bx-trash'></i>
                </button>
            `;

            // Add loading state
            newUploadedFile.querySelector('.file-name').textContent = 'Uploading...';
            newFileBtn.disabled = true;

            // Add the new file element to the container
            const uploadedFilesContainer = document.querySelector('.uploaded-files-container');
            uploadedFilesContainer.appendChild(newUploadedFile);

            const response = await fetch('https://pdf-docs.onrender.com/convert', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.original_text || !data.proofread_text) {
                throw new Error('Missing required text data from server');
            }

            // Store the file data in the element
            newUploadedFile.dataset.originalText = data.original_text;
            newUploadedFile.dataset.proofreadText = data.proofread_text;
            newUploadedFile.dataset.fileName = file.name;
            if (data.download_url) {
                newUploadedFile.dataset.downloadUrl = data.download_url;
            }

            // Update the displayed content
            const { originalHtml, proofreadHtml } = highlightDifferences(
                data.original_text,
                data.proofread_text
            );

            // Remove active class from all files
            document.querySelectorAll('.uploaded-file').forEach(f => f.classList.remove('active'));
            // Add active class to new file
            newUploadedFile.classList.add('active');

            originalContent.innerHTML = originalHtml;
            proofreadContent.innerHTML = proofreadHtml;

            // Update file name in section header with the actual file name
            document.querySelector('#originalSection .section-header h2').textContent = file.name;
            // Update the file name in the uploaded file element
            newUploadedFile.querySelector('.file-name').textContent = file.name;

            // Add click handler to the file element
            newUploadedFile.addEventListener('click', (e) => {
                // Don't trigger if clicking the delete button
                if (e.target.closest('.delete-file-btn')) return;
                
                // Remove active class from all files
                document.querySelectorAll('.uploaded-file').forEach(f => f.classList.remove('active'));
                // Add active class to clicked file
                newUploadedFile.classList.add('active');

                // Update content
                const { originalHtml, proofreadHtml } = highlightDifferences(
                    newUploadedFile.dataset.originalText,
                    newUploadedFile.dataset.proofreadText
                );

                originalContent.innerHTML = originalHtml;
                proofreadContent.innerHTML = proofreadHtml;
                document.querySelector('#originalSection .section-header h2').textContent = newUploadedFile.dataset.fileName;

                // Update download button
                if (newUploadedFile.dataset.downloadUrl) {
                    downloadBtn.onclick = () => {
                        window.location.href = 'https://pdf-docs.onrender.com' + newUploadedFile.dataset.downloadUrl;
                    };
                }
            });

            // Update download button if URL is available
            if (data.download_url) {
                downloadBtn.onclick = () => {
                    window.location.href = 'https://pdf-docs.onrender.com' + data.download_url;
                };
            }

            // Reset zoom
            currentZoom = 100;
            updateZoom();

            // Add delete functionality to the new file
            const newDeleteBtn = newUploadedFile.querySelector('.delete-file-btn');
            newDeleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this file?')) {
                    newUploadedFile.remove();
                    // If this was the last file, redirect to home page
                    if (uploadedFilesContainer.children.length === 0) {
                        window.location.href = 'index.html';
                    }
                }
            });

        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message || 'An error occurred during upload');
            // Remove the failed upload element
            const failedUpload = document.querySelector('.uploaded-file:last-child');
            if (failedUpload) {
                failedUpload.remove();
            }
        } finally {
            newFileBtn.disabled = false;
            newFileInput.value = ''; // Reset file input
        }
    });

    // Delete file button click handler for initial file
    deleteFileBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this file?')) {
            const uploadedFilesContainer = document.querySelector('.uploaded-files-container');
            const currentFile = document.querySelector('.uploaded-file');
            currentFile.remove();
            // If this was the last file, redirect to home page
            if (uploadedFilesContainer.children.length === 0) {
                window.location.href = 'index.html';
            }
        }
    });
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
        button.innerHTML = '<i id="speechIcon" class="bx bxs-volume-full"></i>';
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
            button.innerHTML = '<i id="speechIcon" class="bx bx-volume-full"></i>';
            pauseButton.style.display = "inline-block"; 

            speechInstance.onend = () => {
                isSpeaking = false;
                isPaused = false;
                button.innerHTML = '<i id="speechIcon" class="bx bxs-volume-full"></i>';
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
            button.innerHTML = '<i class="bx bx-pause" ></i>';
            console.log("Speech resumed.");
        } else {
            window.speechSynthesis.pause();
            isPaused = true;
            button.innerHTML = '<i class="bx bx-play" ></i>';
            console.log("Speech paused.");
        }
    }
}
