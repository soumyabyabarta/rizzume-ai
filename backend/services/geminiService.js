const { GoogleGenerativeAI } = require("@google/generative-ai");

const parseAIResponse = (text) => {
    try {
        return JSON.parse(text);
    } catch (e) {
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedText);
    }
};

// 1. GEMINI CALLER
const callGemini = async (prompt, apiKey) => {
    if (!apiKey) throw new Error("Gemini API Key missing");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { 
            responseMimeType: "application/json",
            temperature: 0.7
         } 
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
};

// 2. GROQ CALLER
const callGroq = async (prompt, apiKey) => {
    if (!apiKey) throw new Error("Groq API Key missing");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are an expert ATS optimizer and tech recruiter. Always return strict, valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) throw new Error(`Groq API response was not ok`);
    const data = await response.json();
    return data.choices[0].message.content;
};

// ============================================================================
//  MAIN ROUTING LOGIC
// ============================================================================

const throwUltimateError = () => {
    throw new Error("Rizzume AI servers are currently experiencing high traffic. Please try again later!");
};

const getResumeFeedback = async (resumeText, jobDescription, mode = 'professional') => {
    
    // ---------------------------------------------------------
    // ROAST MODE LOGIC
    // ---------------------------------------------------------
    if (mode === 'roast') {
        const roastPrompt = `
        You are a brutal, highly aggressive tech recruiter. Roast the following resume based on this job description: "${jobDescription}".
        
        Strict Instructions:
        - Pick EXACTLY the 5 worst things about the resume. Do NOT generate more than 5 items in the roast_points array.
        - Make the roasting detailed and brutally honest for those 5 points.
        - Use simple, easily understandable English (NO Hindi).
        - Use modern Gen-Z internet slang to make it funny. 
        - Return ONLY raw JSON.
        
        {
            "roast_title": "string",
            "overall_verdict": "string",
            "roast_points": [ { "section": "string", "roast": "string" } ]
        }
        Resume Text: ${resumeText}
        `;

        try {
            console.log("[AI Engine] Roast Mode: Requesting Groq (Llama 3.3) API 1...");
            const res = await callGroq(roastPrompt, process.env.GROQ_API_KEY_1);
            return parseAIResponse(res);
        } catch (e1) {
            console.log("[AI Warning] Groq API 1 Failed. Switching to Groq API 2...");
            try {
                const res2 = await callGroq(roastPrompt, process.env.GROQ_API_KEY_2);
                return parseAIResponse(res2);
            } catch (e2) {
                console.log("[AI Warning] Groq API 2 Failed. Switching to Ultimate Groq Key...");
                try {
                    const res3 = await callGroq(roastPrompt, process.env.ULTIMATE_GROQ_API_KEY);
                    return parseAIResponse(res3);
                } catch (e3) {
                    console.error("[AI Error] All Groq APIs exhausted for Roast Mode.");
                    throwUltimateError();
                }
            }
        }
    } 
    
    // ---------------------------------------------------------
    // PROFESSIONAL INSIGHTS LOGIC (UPDATED FLOW)
    // ---------------------------------------------------------
    else {
        const profPrompt = `
        You are an expert ATS optimizer. Analyze this resume against the job description: "${jobDescription}".
        
        Strict Instructions for the 'fix' field:
        - Keep the explanation EXTREMELY SHORT.
        - Must be exactly 1 or 2 complete sentences.
        - NEVER leave a sentence incomplete.
        - Return ONLY raw JSON.
        
        {
            "overall_feedback": "string",
            "improvement_suggestions": [ { "issue": "string", "fix": "string" } ]
        }
        Resume Text: ${resumeText}
        `;

        try {
            // 🔥 FIRST ATTEMPT: GROQ_API_KEY_2
            console.log("[AI Engine] Insights: Requesting Groq (Llama 3.3) API 2...");
            const res = await callGroq(profPrompt, process.env.GROQ_API_KEY_2);
            return parseAIResponse(res);
        } catch (e1) {
            console.error(`[AI Error] Groq API 2 Failed: ${e1.message}`); 
            // 🔥 SECOND ATTEMPT: GEMINI
            console.log("[AI System] Fallback triggered: Requesting Gemini (2.5 Flash) API...");
            try {
                const res2 = await callGemini(profPrompt, process.env.GEMINI_API_KEY_DASHBOARD);
                return parseAIResponse(res2);
            } catch (e2) {
                console.error(`[AI Error] Gemini API Failed: ${e2.message}`); 
                // 🔥 FINAL ATTEMPT: ULTIMATE GROQ
                console.log("[AI Warning] Fallback Gemini Failed. Switching to Ultimate Key...");
                try {
                    const res3 = await callGroq(profPrompt, process.env.ULTIMATE_GROQ_API_KEY);
                    return parseAIResponse(res3);
                } catch (e3) {
                    console.error("[AI Error] All APIs exhausted for Insights.");
                    throwUltimateError();
                }
            }
        }
    }
};

const generateCareerRoadmap = async (targetJob, missingSkills) => {
    const missingSkillsText = missingSkills && missingSkills.length > 0 ? missingSkills.join(", ") : "General core skills";
    const roadmapPrompt = `Create a 30-day sprint roadmap for ${targetJob}. Missing skills: ${missingSkillsText}. Return JSON: { "roadmap_title": "string", "phases": [ { "phase_title": "string", "days": [ { "day": "string", "title": "string", "skills_to_learn": ["string"] } ] } ] }`;

    try {
        console.log("[AI Engine] Roadmap: Requesting Gemini (2.5 Flash) API...");
        const res = await callGemini(roadmapPrompt, process.env.GEMINI_API_KEY_ROADMAP);
        return parseAIResponse(res);
    } catch (e1) {
        console.error(`[AI Error] Gemini API Failed: ${e1.message}`);
        console.log("[AI System] Fallback triggered: Requesting Groq (Llama 3.3) API 1...");
        try {
            const res2 = await callGroq(roadmapPrompt, process.env.GROQ_API_KEY_1);
            return parseAIResponse(res2);
        } catch (e2) {
            console.log("[AI Warning] Fallback Groq API 1 Failed. Switching to Ultimate Key...");
            try {
                const res3 = await callGroq(roadmapPrompt, process.env.ULTIMATE_GROQ_API_KEY);
                return parseAIResponse(res3);
            } catch (e3) {
                console.error("[AI Error] All APIs exhausted for Roadmap.");
                throwUltimateError();
            }
        }
    }
};

module.exports = { getResumeFeedback, generateCareerRoadmap };