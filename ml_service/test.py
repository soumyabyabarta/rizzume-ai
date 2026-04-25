from ml_core import calculate_ats_score, analyze_skills

# Dummy Resume & JD
my_resume = """
I am a software engineer with 2 years of experience. 
I am highly skilled in Python, Java, and React. 
I have built multiple full-stack applications using Node.js and MongoDB.
"""

target_job = """
We are looking for a Software Developer.
Required skills: Python, React, Docker, Kubernetes, AWS, and Node.js.
Must have experience in building scalable APIs.
"""

# Run the Engine
print("⏳ Running ML Analysis...\n")

score = calculate_ats_score(my_resume, target_job)
print(f"✅ ATS Score: {score}%\n")

skills = analyze_skills(my_resume, target_job)
print(f"🟢 Matched Skills: {skills['matched']}")
print(f"🔴 Missing Skills: {skills['missing']}")