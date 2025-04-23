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
    document.querySelector('.zoom-percentage').textContent = `${currentZoom}%`;
}

// Word suggestions for common words and phrases
const wordSuggestions = {
    'advancement': ['progress', 'development', 'improvement', 'evolution', 'enhancement', 'growth', 'advancement', 'progression', 'breakthrough', 'forward movement'],
    'technology': ['innovation', 'technical advancement', 'digital solutions', 'technological tools', 'digital technology', 'tech innovations', 'technological systems', 'technical infrastructure', 'digital framework', 'technological capabilities'],
    'brought': ['introduced', 'delivered', 'yielded', 'led to', 'resulted in', 'generated', 'created', 'produced', 'initiated', 'established'],
    'transformed': ['revolutionized', 'reshaped', 'changed', 'modernized', 'remodeled', 'renovated', 'overhauled', 'reinvented', 'reconstructed', 'reconfigured'],
    'in addition': ['furthermore', 'moreover', 'additionally', 'besides this', 'what is more', 'as well as', 'along with this', 'also'],
    'for example': ['for instance', 'as an illustration', 'to demonstrate', 'specifically', 'namely', 'such as', 'particularly'],
    'in order to': ['to', 'so as to', 'with the aim of', 'for the purpose of', 'with the intention of', 'with a view to'],
    'as a result': ['consequently', 'therefore', 'thus', 'hence', 'as a consequence', 'accordingly', 'for this reason'],
    'however': ['nevertheless', 'nonetheless', 'yet', 'still', 'on the other hand', 'conversely', 'despite this'],
    'due to': ['because of', 'as a result of', 'owing to', 'on account of', 'thanks to', 'attributed to'],
    'significantly': ['considerably', 'substantially', 'markedly', 'notably', 'remarkably', 'meaningfully', 'dramatically'],
    'primarily': ['mainly', 'chiefly', 'predominantly', 'principally', 'largely', 'mostly', 'essentially'],
    'furthermore': ['moreover', 'additionally', 'besides', 'in addition', 'what is more', 'also', 'further'],
    'subsequently': ['afterwards', 'later', 'following this', 'thereafter', 'then', 'next', 'consequently'],
    'particularly': ['especially', 'specifically', 'notably', 'in particular', 'chiefly', 'mainly', 'predominantly'],
    'demonstrates': ['shows', 'indicates', 'proves', 'illustrates', 'reveals', 'establishes', 'confirms'],
    'implemented': ['executed', 'carried out', 'put into effect', 'put into practice', 'realized', 'accomplished', 'achieved'],
    'essential': ['crucial', 'vital', 'necessary', 'indispensable', 'fundamental', 'key', 'critical'],
    'various': ['different', 'diverse', 'multiple', 'numerous', 'several', 'many', 'assorted'],
    'effectively': ['efficiently', 'successfully', 'productively', 'competently', 'adequately', 'properly', 'appropriately'],
    'consequently': ['therefore', 'as a result', 'thus', 'hence', 'accordingly', 'so', 'subsequently'],
    'frequently': ['often', 'regularly', 'commonly', 'repeatedly', 'habitually', 'routinely', 'consistently'],
    'in contrast': ['on the other hand', 'conversely', 'by comparison', 'on the contrary', 'however', 'alternatively'],
    'in terms of': ['regarding', 'concerning', 'with respect to', 'with reference to', 'as regards', 'relating to'],
    'in the context of': ['within the framework of', 'in relation to', 'with regard to', 'in connection with', 'as part of'],
    'it is important to note': ['notably', 'significantly', 'it should be noted that', 'it is worth noting that', 'importantly'],
    'on the basis of': ['based on', 'founded on', 'grounded in', 'according to', 'depending on', 'relying on'],
    'with respect to': ['regarding', 'concerning', 'in relation to', 'pertaining to', 'as regards', 'in reference to'],
    'in general': ['generally', 'broadly speaking', 'on the whole', 'overall', 'by and large', 'for the most part'],
    'in particular': ['specifically', 'especially', 'particularly', 'notably', 'markedly', 'distinctly'],
    'in conclusion': ['to conclude', 'finally', 'to sum up', 'in summary', 'to summarize', 'ultimately'],
    'in other words': ['that is to say', 'to put it differently', 'namely', 'specifically', 'to clarify'],
    'for instance': ['for example', 'as an illustration', 'to illustrate', 'such as', 'namely', 'specifically'],
    'in fact': ['actually', 'indeed', 'as a matter of fact', 'in reality', 'truthfully', 'in truth'],
    'according to': ['based on', 'as stated by', 'as reported by', 'as indicated by', 'in accordance with'],
    'in addition to': ['besides', 'along with', 'as well as', 'together with', 'coupled with', 'furthermore'],
    'as well as': ['in addition to', 'along with', 'besides', 'plus', 'together with', 'not to mention'],
    'in spite of': ['despite', 'notwithstanding', 'regardless of', 'even though', 'although', 'nevertheless'],
    'rather than': ['instead of', 'as opposed to', 'in preference to', 'in place of', 'versus'],
    'such as': ['for example', 'for instance', 'like', 'including', 'specifically', 'particularly'],
    'due to the fact that': ['because', 'since', 'as', 'given that', 'owing to the fact that'],
    'in the event that': ['if', 'should', 'whenever', 'in case', 'provided that', 'assuming that'],
    'on the whole': ['generally', 'overall', 'all things considered', 'by and large', 'in general'],
    'as a matter of fact': ['actually', 'in fact', 'indeed', 'in reality', 'to tell the truth'],
    'at the same time': ['simultaneously', 'concurrently', 'meanwhile', 'in parallel', 'together'],
    'in this regard': ['concerning this', 'in this respect', 'on this point', 'regarding this', 'as for this'],
    'to this end': ['for this purpose', 'with this goal', 'to achieve this', 'toward this goal'],
    'in light of': ['considering', 'given', 'taking into account', 'in view of', 'because of'],
    'in essence': ['basically', 'fundamentally', 'at its core', 'in basic terms', 'essentially'],
    'in practice': ['practically', 'in reality', 'in actual fact', 'in real terms', 'realistically'],
    'interact': ['engage', 'communicate', 'connect', 'interface', 'collaborate', 'work', 'participate', 'associate', 'network', 'cooperate'],
    'society': ['community', 'population', 'civilization', 'social structure', 'public', 'humankind', 'social order', 'collective', 'social fabric', 'populace'],
    'evident': ['clear', 'apparent', 'obvious', 'noticeable', 'visible', 'unmistakable', 'manifest', 'plain', 'distinct', 'conspicuous'],
    'innovations': ['advancements', 'developments', 'breakthroughs', 'improvements', 'modernizations', 'upgrades', 'inventions', 'novelties', 'transformations', 'pioneering solutions'],
    'enhanced': ['improved', 'upgraded', 'augmented', 'strengthened', 'boosted', 'elevated', 'amplified', 'refined', 'optimized', 'enriched'],
    'significant': ['important', 'notable', 'substantial', 'considerable', 'major', 'crucial', 'essential', 'critical', 'fundamental', 'pivotal'],
    'ensuring': ['guaranteeing', 'securing', 'confirming', 'safeguarding', 'maintaining', 'assuring', 'verifying', 'establishing', 'preserving', 'sustaining'],
    'platforms': ['systems', 'applications', 'frameworks', 'environments', 'tools', 'solutions', 'interfaces', 'infrastructures', 'networks', 'ecosystems'],
    'digital': ['electronic', 'computerized', 'online', 'virtual', 'cyber', 'tech-based', 'technological', 'automated', 'web-based', 'connected'],
    'daily': ['everyday', 'regular', 'day-to-day', 'routine', 'frequent', 'constant', 'habitual', 'recurring', 'continual', 'ongoing'],
    'basis': ['foundation', 'ground', 'framework', 'structure', 'system', 'arrangement', 'principle', 'core', 'groundwork', 'underpinning'],
    'industries': ['sectors', 'businesses', 'enterprises', 'corporations', 'companies', 'fields', 'organizations', 'commercial entities', 'trade sectors', 'market segments'],
    'reshaped': ['reformed', 'restructured', 'reorganized', 'redefined', 'transformed', 'remodeled', 'reconfigured', 'revamped', 'modified', 'redesigned'],
    'communication': ['interaction', 'exchange', 'dialogue', 'correspondence', 'connection', 'discourse', 'discussion', 'conversation', 'transmission', 'interchange'],
    'access': ['entry', 'availability', 'reach', 'admission', 'connectivity', 'accessibility', 'approach', 'gateway', 'entrance', 'means of entry'],
    'education': ['learning', 'instruction', 'teaching', 'training', 'schooling', 'pedagogy', 'academic development', 'educational process', 'knowledge acquisition', 'skill development'],
    'facilitating': ['enabling', 'supporting', 'assisting', 'aiding', 'helping', 'promoting', 'expediting', 'simplifying', 'streamlining', 'fostering'],
    'learning': ['education', 'study', 'knowledge acquisition', 'skill development', 'comprehension', 'understanding', 'mastery', 'training', 'development', 'growth'],
    'personalized': ['customized', 'tailored', 'individualized', 'adapted', 'modified', 'specialized', 'bespoke', 'custom-made', 'unique', 'specific'],
    'improvement': ['enhancement', 'advancement', 'upgrade', 'development', 'refinement', 'progress', 'betterment', 'optimization', 'growth', 'evolution'],
    'abstract': ['theoretical', 'conceptual', 'intangible', 'complex', 'non-concrete', 'philosophical', 'notional', 'intellectual', 'academic', 'ideological'],
    'environments': ['settings', 'surroundings', 'contexts', 'conditions', 'atmospheres', 'spaces', 'situations', 'frameworks', 'ecosystems', 'domains'],
    'geographical': ['spatial', 'regional', 'territorial', 'locational', 'physical', 'topographical', 'geographic', 'environmental', 'spatial', 'area-based'],
    'barriers': ['obstacles', 'limitations', 'restrictions', 'constraints', 'impediments', 'hindrances', 'roadblocks', 'challenges', 'difficulties', 'obstructions'],
    'enabling': ['allowing', 'facilitating', 'permitting', 'empowering', 'supporting', 'assisting', 'helping', 'promoting', 'encouraging', 'fostering'],
    'remote': ['distant', 'far', 'virtual', 'online', 'digital', 'web-based', 'off-site', 'decentralized', 'distributed', 'telecommuting'],
    'quality': ['standard', 'excellence', 'caliber', 'grade', 'value', 'merit', 'worth', 'superiority', 'distinction', 'fineness'],
    'trend': ['pattern', 'tendency', 'direction', 'movement', 'drift', 'inclination', 'development', 'progression', 'course', 'shift'],
    'integrating': ['incorporating', 'combining', 'merging', 'unifying', 'consolidating', 'blending', 'synthesizing', 'amalgamating', 'fusing', 'coordinating'],
    'efficiency': ['effectiveness', 'productivity', 'performance', 'competence', 'capability', 'proficiency', 'optimization', 'streamlining', 'functionality', 'operation'],
    'inclusivity': ['inclusion', 'accessibility', 'openness', 'acceptance', 'diversity', 'equality', 'integration', 'participation', 'involvement', 'engagement'],
    'challenges': ['difficulties', 'obstacles', 'problems', 'hurdles', 'issues', 'complications', 'impediments', 'barriers', 'constraints', 'limitations'],
    'crucial': ['critical', 'essential', 'vital', 'important', 'key', 'fundamental', 'necessary', 'significant', 'decisive', 'imperative'],
    'navigate': ['guide', 'maneuver', 'direct', 'steer', 'traverse', 'handle', 'manage', 'address', 'deal with', 'work through'],
    'carefully': ['cautiously', 'meticulously', 'thoroughly', 'diligently', 'attentively', 'prudently', 'mindfully', 'precisely', 'thoughtfully', 'conscientiously']
};

// Create popup element
const suggestionPopup = document.createElement('div');
suggestionPopup.className = 'suggestion-popup';
document.body.appendChild(suggestionPopup);

let activeHighlight = null;

// Function to show suggestions popup
function showSuggestions(word, element) {
    const suggestions = wordSuggestions[word.toLowerCase()] || [];
    if (suggestions.length === 0) return;

    const rect = element.getBoundingClientRect();
    suggestionPopup.style.left = `${rect.left}px`;
    suggestionPopup.style.top = `${rect.bottom + window.scrollY + 5}px`;

    // Generate suggestion items
    suggestionPopup.innerHTML = suggestions.map(suggestion => 
        `<div class="suggestion-item">${suggestion}</div>`
    ).join('<div class="suggestion-divider"></div>');

    // Add click handlers to suggestions
    suggestionPopup.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            element.textContent = item.textContent;
            hideSuggestions();
        });
    });

    suggestionPopup.classList.add('show');
    activeHighlight = element;
}

// Function to hide suggestions popup
function hideSuggestions() {
    suggestionPopup.classList.remove('show');
    activeHighlight = null;
}

// Function to highlight differences
function highlightDifferences(original, proofread) {
    const words1 = original.split(/\s+/);
    const words2 = proofread.split(/\s+/);
    let originalHtml = '';
    let proofreadHtml = '';

    for (let i = 0; i < Math.max(words1.length, words2.length); i++) {
        if (i < words1.length && i < words2.length && words1[i] !== words2[i]) {
            // This is a correction
            originalHtml += `<span class="error-highlight">${words1[i]}</span> `;
            const hasSuggestions = wordSuggestions[words2[i].toLowerCase()] ? 'has-suggestions' : '';
            proofreadHtml += `<span class="correction-highlight ${hasSuggestions}" data-word="${words2[i]}">${words2[i]}</span> `;
        } else {
            // Check for suggestions in unchanged words
            if (i < words1.length) {
                const word = words1[i];
                if (wordSuggestions[word.toLowerCase()]) {
                    originalHtml += `<span class="correction-highlight has-suggestions" data-word="${word}">${word}</span> `;
                } else {
                    originalHtml += word + ' ';
                }
            }
            if (i < words2.length) {
                const word = words2[i];
                if (wordSuggestions[word.toLowerCase()]) {
                    proofreadHtml += `<span class="correction-highlight has-suggestions" data-word="${word}">${word}</span> `;
                } else {
                    proofreadHtml += word + ' ';
                }
            }
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

        // Get the file name from the original file data
        const fileName = orgData.file_name || proofData.file_name ;
        
        // Update file name in both places
        const initialFile = document.querySelector('.uploaded-file');
        if (initialFile) {
            // Update the file name in the uploaded file element
            initialFile.querySelector('.file-name').textContent = fileName;
            // Store the file data
            initialFile.dataset.originalText = orgData.original_text;
            initialFile.dataset.proofreadText = proofData.proofread_text;
            initialFile.dataset.fileName = fileName;
            if (proofData.download_url) {
                initialFile.dataset.downloadUrl = proofData.download_url;
            }
            
            // Make initial file active
            initialFile.classList.add('active');
        }
        
        // Update the section header with the actual file name
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
            newUploadedFile.querySelector('.file-name').innerHTML = 
            `Uploading  <i class='bx bx-loader-circle bx-spin' ></i>`;
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

// Add click handlers for suggestions
document.addEventListener('click', (e) => {
    const highlight = e.target.closest('.correction-highlight');
    if (highlight && highlight.classList.contains('has-suggestions')) {
        const word = highlight.dataset.word;
        showSuggestions(word, highlight);
    } else if (!e.target.closest('.suggestion-popup')) {
        hideSuggestions();
    }
});
