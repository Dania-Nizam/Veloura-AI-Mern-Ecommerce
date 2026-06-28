const axios = require('axios');

const getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        // Python FastAPI server ko call karein
        const pythonResponse = await axios.post('http://localhost:8000/chat', {
            message: message,
            user_id: req.user._id,
            user_name: req.user.name
        });

        res.json({ response: pythonResponse.data.response });
    } catch (error) {
        console.error("Python Bridge Error:", error.message);
        res.status(500).json({ response: "AI Agent is currently sleeping." });
    }
}

module.exports = { getChatResponse };