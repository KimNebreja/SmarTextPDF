// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('pdfFile');
const uploadButton = document.querySelector('.upload-button');
const uploadContainer = document.querySelector('.upload-container');

// Create and append upload status element
const uploadStatus = document.createElement('div');
uploadStatus.className = 'upload-status';
uploadStatus.innerHTML = 
`<p>Uploading...<p>
<div class="loader-container">
<i class='bx bx-loader-circle bx-spin' ></i>
</div>`;
uploadContainer.appendChild(uploadStatus);

// State Management
let isUploading = false;

// File Upload Functionality
function validateFile(file) {
    if (!file) {
        alert("Please select a file");
        return false;
    }
    if (file.type !== 'application/pdf') {
        alert("Please upload a PDF file");
        return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File size should be less than 10MB");
        return false;
    }
    return true;
}

function showUploadStatus(show) {
    uploadForm.classList.toggle('hide', show);
    uploadStatus.classList.toggle('show', show);
}

// Handle file upload to server
async function handleFileUpload(file) {
    if (!validateFile(file)) return;
    if (isUploading) return;

    try {
        isUploading = true;
        showUploadStatus(true);
        uploadButton.disabled = true;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://pdf-docs.onrender.com/convert', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.original_text || !data.proofread_text) {
            throw new Error('Missing required text data from server');
        }

        // Store the data in localStorage with the file name
        localStorage.setItem('originalData', JSON.stringify({
            original_text: data.original_text,
            file_name: file.name // Add the file name to the original data
        }));
        localStorage.setItem('proofreadData', JSON.stringify(data));

        // Redirect to proofread page
        window.location.href = 'proofread.html';

    } catch (error) {
        console.error('Upload error:', error);
        alert(error.message || 'An error occurred during upload');
    } finally {
        isUploading = false;
        uploadButton.disabled = false;
        showUploadStatus(false);
    }
}

// Drag and Drop Functionality
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    uploadForm.classList.add('highlight');
}

function unhighlight(e) {
    uploadForm.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // File input change
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Upload button click
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadForm.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadForm.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadForm.addEventListener(eventName, unhighlight, false);
    });

    uploadForm.addEventListener('drop', handleDrop, false);
});
