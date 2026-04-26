const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const ResumeData = require('../models/ResumeData');

// POST /api/analyze/upload
router.post('/upload', uploadMiddleware, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Where's the file tho? 🧐" });
        }

        // 1. Create form data to send to Python ML Service
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        
        // Add the Job Description from the frontend request body
        const targetJob = req.body.jobDescription || "Software Engineer"; 
        formData.append('job_description', targetJob);

        // 2. Call the Python FastAPI Service
        const pythonResponse = await axios.post('https://rizzume-ml-service.onrender.com/api/extract', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        const extractedText = pythonResponse.data.data.content;
        const mlAnalysis = pythonResponse.data.data.ml_analysis;
        
        console.log("🔥 PYTHON SAYS:", JSON.stringify(mlAnalysis, null, 2));

        
        if (!extractedText) {
            return res.status(400).json({ success: false, error: "Could not read text from this resume. Is it an image?" });
        }

        // 3. Save the extracted text to MongoDB (Auto-deletes in 24h)
        const newResumeEntry = new ResumeData({
            userId: 'anonymous', 
            parsedText: extractedText,
            atsScore: mlAnalysis ? mlAnalysis.ats_score : 0 
        });

        // 👇 THIS WAS THE MISSING LINE! 👇
        const savedResume = await newResumeEntry.save();

        // 4. Send success response back to frontend
        res.status(200).json({
            success: true,
            message: "Resume extracted and secured! 🚀",
            data: {
                documentId: savedResume._id,
                filename: req.file.originalname,
                ml_analysis: mlAnalysis,
                mlAnalysis: mlAnalysis,
                textPreview: extractedText.substring(0, 100) + "..."
            }
        });

    } catch (error) {
        console.error("Error communicating with ML Service:", error.message);
        res.status(500).json({ 
            success: false, 
            error: "Our AI brain is currently taking a nap. Try again later! 💤" 
        });
    }
});

module.exports = router;