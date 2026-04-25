import pandas as pd
import re
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer

print("⏳ Loading Kaggle Dataset...")

# loading the dataset
try:
    df = pd.read_csv('dataset/Resume.csv')
    print(f"✅ Dataset loaded successfully! Total Resumes found: {len(df)}")
except FileNotFoundError:
    print("❌ Error: Resume.csv not found! dataset ফোল্ডারে ফাইলটা ঠিকমতো রেখেছো তো?")
    exit()

# text cleaning function
def clean_text(text):
    if type(text) != str:
        return ""
    text = re.sub(r'http\S+\s*', ' ', text)
    text = re.sub(r'[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', text)
    text = re.sub(r'[^\x00-\x7f]', r' ', text) 
    text = re.sub(r'\s+', ' ', text).strip()
    return text.lower()

print("🧹 Cleaning 2400+ Resumes (This might take a few seconds)...")
# Apply cleaning to the 'Resume_str' column
df['Cleaned_Resume'] = df['Resume_str'].apply(clean_text)

# Training the TF-IDF Model 
print("🧠 Training the TF-IDF Vectorizer on global vocabulary...")
# max_features=5000 মানে আমরা সবচেয়ে ইম্পরট্যান্ট ৫০০০টা কিওয়ার্ড শিখবো
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
vectorizer.fit(df['Cleaned_Resume'])

#  Saving the Trained Model 
os.makedirs('models', exist_ok=True)
joblib.dump(vectorizer, 'models/tfidf_vectorizer.pkl')

print("🎉 BOOM! Model Trained and Saved successfully as 'models/tfidf_vectorizer.pkl'")
print("💡 Interview Flex: Now your ATS scorer knows the global weight of 5000 enterprise keywords!")