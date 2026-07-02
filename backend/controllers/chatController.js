const axios = require('axios');

const getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        // Python FastAPI server ko call karein (Correct URL ke sath)
        const pythonResponse = await axios.post('https://dania-nizam-veloura-ai-agent.hf.space/chat', {
            message: message,
            user_id: req.user && req.user._id ? req.user._id.toString() : "65c3a2b1e4b0a1b2c3d4e5f6",
            user_name: req.user && req.user.name ? req.user.name : "Guest"
        });

        // Safe response extraction
        const replyText = typeof pythonResponse.data === 'string'
            ? pythonResponse.data
            : (pythonResponse.data.response || pythonResponse.data.reply || JSON.stringify(pythonResponse.data));

        res.json({ response: replyText });
    } catch (error) {
        let exactError = "AI Agent is currently sleeping.";
        
        if (error.response) {
            console.error("Python Bridge Error Status:", error.response.status);
            console.error("Python Bridge Error Body:", error.response.data);
            
            // Agar Python koi specific detail bhej raha hai toh usay extract karein
            exactError = error.response.data && error.response.data.detail 
                ? JSON.stringify(error.response.data.detail) 
                : `Python Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
        } else {
            console.error("Python Bridge Error:", error.message);
            exactError = `Network/Bridge Error: ${error.message}`;
        }
        
        // Frontend par generic error ke bajaye asli wajah bhejien taake debug ho sake
        res.status(500).json({ response: exactError });
    }
}

module.exports = { getChatResponse };