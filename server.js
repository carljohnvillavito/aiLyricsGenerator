const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// CSS Styles (inline from style.css)
const styleCSS = `
body {
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    color: #212529;
    margin: 0;
    padding: 0;
}

.welcome-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #007bff;
    transition: all 0.3s ease-in-out;
}

.welcome-title:hover {
    color: #0056b3;
    transform: scale(1.05);
}

.subtitle {
    font-size: 1.2rem;
    color: #6c757d;
}

textarea {
    resize: none;
    transition: box-shadow 0.3s ease-in-out;
}

textarea:focus {
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

.bubble-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    z-index: 999;
}

.bubble-message button {
    margin-top: 10px;
}

.output-container {
    background-color: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    transition: opacity 0.3s ease-in-out;
}

.loading-text {
    font-weight: bold;
}

.lyrics-text {
    font-size: 1.2rem;
    line-height: 1.6;
}
`;

// JavaScript Script (inline from script.js)
const appJS = `
document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loadingAnimation = document.getElementById('loadingAnimation');
    const resultContainer = document.getElementById('result');
    const lyricsOutput = document.getElementById('lyricsOutput');
    const alertBubble = document.getElementById('alertBubble');
    const closeBubble = document.getElementById('closeBubble');

    const showAlertBubble = (message) => {
        document.getElementById('alertText').textContent = message;
        alertBubble.classList.remove('d-none');
    };

    closeBubble.addEventListener('click', () => {
        alertBubble.classList.add('d-none');
    });

    const formatLyrics = (lyrics) => {
        return lyrics
            .split('\\n')
            .map(line => {
                if (line.match(/^\.*\$/)) {
                    return \`<strong>\${line}</strong>\`;
                }
                return line;
            })
            .join('<br>');
    };

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            showAlertBubble('Input is empty!');
            return;
        }

        generateBtn.classList.add('d-none');
        loadingAnimation.classList.remove('d-none');

        try {
            const response = await axios.get(\`https://api.joshweb.click/api/ailyrics?prompt=\${encodeURIComponent(prompt)}\`);

            if (response.data.status && response.data.lyrics) {
                const formattedLyrics = formatLyrics(response.data.lyrics);
                lyricsOutput.innerHTML = formattedLyrics;
                resultContainer.classList.remove('d-none');
            } else {
                showAlertBubble('Failed to generate lyrics. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlertBubble('An error occurred while generating lyrics.');
        } finally {
            generateBtn.classList.remove('d-none');
            loadingAnimation.classList.add('d-none');
        }
    });
});
`;

// Route for serving CSS
app.get('/style.css', (req, res) => {
    res.type('text/css');
    res.send(styleCSS);
});

// Route for serving JavaScript
app.get('/script.js', (req, res) => {
    res.type('application/javascript');
    res.send(appJS);
});

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self';"
    );
    next();
});

document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'c' || e.key === 's')) {
        e.preventDefault();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
