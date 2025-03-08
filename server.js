import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle API routes
app.post('/api/analyze-food', async (req, res) => {
    try {
        const { base64Image } = req.body;
        const { callOpenAIVisionAPI } = await import('./aaafoodanalysis.js');
        const analysis = await callOpenAIVisionAPI(base64Image, '請分析這張食物圖片的營養成分');
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing food:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
