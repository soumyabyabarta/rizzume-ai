require('dotenv').config();

async function checkModels() {
    console.log("Checking API Key...");
    if (!process.env.GEMINI_API_KEY) {
        console.log("❌ Error: GEMINI_API_KEY is not found in .env file!");
        return;
    }
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        console.log("\n🔥 YOUR API KEY SUPPORTS THESE MODELS:");
        if (data.models) {
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("❌ Error from Google:", data);
        }
    } catch (err) {
        console.log("Fetch error:", err);
    }
}

checkModels();