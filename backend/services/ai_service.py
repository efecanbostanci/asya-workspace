import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

class AIService:
    @staticmethod
    def generate_response(prompt):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise Exception("API Anahtarı (.env içindeki GEMINI_API_KEY) bulunamadı!")
            
        try:
            client = genai.Client(api_key=api_key)
            
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt,
            )
            return response.text
            
        except Exception as e:
            raise Exception(f"Gemini API Bağlantı Hatası: {str(e)}")