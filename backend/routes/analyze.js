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
            return res.status(400).json({ 
                success: false, 
                error: "Where's the file tho? 🧐" 
            });
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
        const pythonResponse = await axios.post('https://rizzume-ml-engine-v2.onrender.com/api/extract', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        const extractedText = pythonResponse.data?.data?.content;
        const mlAnalysis = pythonResponse.data?.data?.ml_analysis;
        
        console.log("[AI Engine] Extracted Data Received Successfully.");

        if (!extractedText) {
            return res.status(400).json({ 
                success: false, 
                error: "Could not read text from this resume. Is it a scanned image?" 
            });
        }

        // 3. Save the extracted text to MongoDB
        const newResumeEntry = new ResumeData({
            userId: 'anonymous', 
            parsedText: extractedText,
            atsScore: mlAnalysis ? mlAnalysis.ats_score : 0 
        });

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
        console.error("[Backend Error] ML Service Communication Failed:", error.message);
        
        // Detailed error logging for debugging
        if (error.response) {
            console.error("Python API Error Response:", error.response.data);
        }

        res.status(500).json({ 
            success: false, 
            error: "Our AI brain is currently taking a nap or overloaded. Try again in a minute! 💤" 
        });
    }
});

module.exports = router;