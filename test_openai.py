import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

print("GROQ API KEY FOUND:", bool(api_key))

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

print("Testing Groq connection...")

response = client.responses.create(
    model="openai/gpt-oss-20b",
    input="Explain what a Python function is in one sentence."
)

print("SUCCESS!")
print(response.output_text)