import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print("GEMINI API KEY FOUND:", bool(api_key))

client = genai.Client(api_key=api_key)

MODEL = "gemini-3.6-flash"


def generate_response(prompt: str):
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "", 1)
        text = text.replace("```", "", 1)
        text = text.strip()

    return json.loads(text)


def analyze_code_with_llm(
    code: str,
    language: str,
    project_context: str | None = None
):

    prompt = f"""
You are SkillGuard AI, an AI-powered code review and skill verification assistant.

Analyze the user's code and identify their programming skills and skill gaps.

Programming language:
{language}

Project context:
{project_context or "Not provided"}

Code:
{code}

Return ONLY valid JSON.
Do NOT use Markdown.
Do NOT use ```json.
Do NOT add any explanation outside the JSON.

Use exactly this structure:

{{
  "language": "{language}",
  "overall_score": 0,
  "summary": "short summary",
  "skills_demonstrated": [
    "skill 1",
    "skill 2"
  ],
  "skills_to_improve": [
    "skill 1",
    "skill 2"
  ],
  "issues": [
    {{
      "title": "issue title",
      "severity": "low",
      "explanation": "explain the issue",
      "why_it_matters": "explain why it matters",
      "skill_to_learn": "skill or concept",
      "recommended_improvement": "how the user can improve",
      "reference": {{
        "title": "official documentation or trusted learning resource",
        "url": "https://example.com"
      }},
      "verification_question": "question to test the user's understanding"
    }}
  ]
}}

Rules:
- overall_score must be an integer from 0 to 100.
- severity must be one of: low, medium, high, critical.
- Detect real issues instead of inventing problems.
- Identify skills actually demonstrated by the code.
- Recommend useful skills to improve.
- Prefer official documentation as references.
"""

    return generate_response(prompt)


def verify_answer(question: str, answer: str):

    prompt = f"""
You are SkillGuard AI.

Evaluate the user's answer to a programming verification question.

Question:
{question}

User's answer:
{answer}

Return ONLY valid JSON.
Do not use Markdown.
Do not use ```json.

Use exactly this structure:

{{
  "correct": true,
  "score": 0,
  "feedback": "short and useful feedback"
}}

Rules:
- correct must be true or false.
- score must be an integer from 0 to 100.
- Give partial credit when the answer demonstrates partial understanding.
- Feedback should explain briefly why the answer is correct, partially correct, or incorrect.
"""

    return generate_response(prompt)