COMMON_SKILLS = [
    "Python",
    "SQL",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Docker",
    "Git",
    "React",
    "Node.js",
    "Java",
    "C++",
    "AWS",
    "Kubernetes"
]

def extract_skills(text):
    found = []

    for skill in COMMON_SKILLS:
        if skill.lower() in text.lower():
            found.append(skill)

    return found