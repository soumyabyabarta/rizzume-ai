import re
import spacy
import joblib
import os
from sklearn.metrics.pairwise import cosine_similarity

# 🧠 1. Load the Trained AI Brain
try:
    print("🧠 Loading Trained TF-IDF Brain...")
    # This loads the vocabulary of 5000 global enterprise keywords!
    vectorizer = joblib.load('models/tfidf_vectorizer.pkl')
except Exception as e:
    print(f"❌ Error loading model: {e}. Please run train_model.py first.")
    vectorizer = None

# Load NLP Model for processing
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading English model for spaCy...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# ==========================================
# 🧹 2. TEXT CLEANING FUNCTION (Warning Fixed)
# ==========================================
def clean_text(text):
    if not text or type(text) != str:
        return ""
    text = re.sub(r'http\S+\s*', ' ', text)
    # Fixed the SyntaxWarning by adding raw string 'r' properly
    text = re.sub(r'[%s]' % re.escape(r"""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', text)
    text = re.sub(r'[^\x00-\x7f]', r' ', text) 
    text = re.sub(r'\s+', ' ', text).strip()
    return text.lower()

# ==========================================
# 📊 3. THE REAL ML ATS SCORER
# ==========================================
def calculate_ats_score(resume_text, jd_text):
    if not vectorizer:
        return 0.0
        
    cleaned_resume = clean_text(resume_text)
    cleaned_jd = clean_text(jd_text)

    if not cleaned_resume or not cleaned_jd:
        return 0.0
    
    try:
        # 🔥 MAGIC HAPPENS HERE 🔥
        # Instead of fit_transform (learning new things), we use transform() 
        # to evaluate them based on the 5000 global skills it ALREADY learned!
        vectors = vectorizer.transform([cleaned_resume, cleaned_jd])
        
        # Calculate Cosine Similarity
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        
        # Convert to percentage
        ats_score = round(similarity * 100, 1)
        
        # Boost logic: Real ATS systems often scale scores. 
        # If the ML gives a mathematically low cosine score (like 30%), we scale it up realistically.
        final_score = min(100.0, ats_score * 2.5) # Scaling factor for better UI representation
        
        return round(final_score, 1)
    except Exception as e:
        print(f"Error calculating ATS: {e}")
        return 0.0

# ==========================================
# 🎯 4. SKILL MATCHING ENGINE
# ==========================================
def extract_skills_from_jd(jd_text):
    doc = nlp(clean_text(jd_text))
    potential_skills = set()
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2:
            potential_skills.add(token.text)
            
    common_tech_skills = {'react', 'node', 'java', 'python', 'javascript', 'html', 'css', 
                          'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git', 'api', 
                          'express', 'typescript', 'machine', 'learning', 'ai', 'data'}
    
    found_common_skills = {word for word in clean_text(jd_text).split() if word in common_tech_skills}
    return list(potential_skills.union(found_common_skills))

def analyze_skills(resume_text, jd_text):
    cleaned_resume = clean_text(resume_text)
    required_skills = extract_skills_from_jd(jd_text)
    
    matched_skills = []
    missing_skills = []
    
    resume_words = set(cleaned_resume.split())
    
    for skill in required_skills:
        if skill in resume_words:
            matched_skills.append(skill.capitalize())
        else:
            if len(skill) > 3: 
                missing_skills.append(skill.capitalize())
            
    return {
        "matched": sorted(list(set(matched_skills)))[:10],
        "missing": sorted(list(set(missing_skills)))[:10]
    }