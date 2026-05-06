// Vercel Serverless Function for Chatbot Backend
// Ascunde si proceseaza cheia de API Nvidia

export default async function handler(req, res) {
    // Permite CORS pentru testare
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages, model } = req.body;
        
        // Cheia adaugata manual (sigura in serverless function)
        const API_KEY = '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';
        const API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || 'meta/llama-3.1-8b-instruct',
                messages: messages,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Eroare Nvidia API:', errorText);
            return res.status(response.status).json({ error: `Nvidia API Error: ${response.status}`, details: errorText });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Vercel Function Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
