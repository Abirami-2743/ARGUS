import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(
    project="project-abafa377-177e-414e-b87",
    location="us-central1"
)

model = GenerativeModel("gemini-2.5-flash-lite")

response = model.generate_content("Hello from Argus")

print(response.text)