from app.services.skill_extractor import extract_skills

def analyze_resume(resume_text, job_description):
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    matched = []

    for skill in jd_skills:
        if skill in resume_skills:
            matched.append(skill)

    if len(jd_skills) == 0:
        score = 0
    else:
        score = int(len(matched) / len(jd_skills) * 100)

    missing = [
        skill
        for skill in jd_skills
        if skill not in matched
    ]

    suggestions = []

    for skill in missing:
        suggestions.append(f"Add {skill} experience or a project related to {skill}.")

    if "Git" in missing:
        suggestions.append("Mention GitHub repositories and version control usage.")
    if "Docker" in missing:
        suggestions.append("Add containerization or deployment experience with Docker.")
    if "AWS" in missing:
        suggestions.append("Add any cloud deployment or AWS project if you have one.")
    if "React" in missing:
        suggestions.append("Build a frontend project using React or Next.js.")
    if "Machine Learning" in missing:
        suggestions.append("Add one ML project with dataset, model, and evaluation.")

    return {
        "score": score,
        "resume_skills": resume_skills,
        "required_skills": jd_skills,
        "matched": matched,
        "missing": missing,
        "suggestions": suggestions
    }