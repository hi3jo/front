from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import sys
import os
from pydantic import BaseModel
import openai
import uvicorn

# 현재 파일의 경로를 기준으로 상위 디렉토리로 이동하여 모듈화한 함수 가져오기
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'modules'))
from imge import generate_and_display_comic  # 모듈화한 함수 가져오기

app = FastAPI()

# CORS 설정
app.add_middleware(
      CORSMiddleware
    , allow_origins=["*"]  # 필요한 도메인만 허용하도록 변경 가능
    , allow_credentials=True
    , allow_methods=["*"]
    , allow_headers=["*"]
)

# .env 파일의 환경 변수를 로드합니다.
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv('OPENAI_API_KEY')

class Question(BaseModel):
    question: str
    
class WebtoonPrompt(BaseModel):
    prompt: str    

def ask_chatgpt(question: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message['content'].strip()

# 사연을 토대로 4컷 웹툰 생성 요청
@app.post("/generate-webtoon")
async def generate_webtoon_endpoint(prompt: WebtoonPrompt):
    
    print("화면에서 받아온 내용 ", prompt.prompt)
    if not prompt.prompt:
        raise HTTPException(status_code=400, detail="No prompt provided")
    
    # 이미지 생성 및 base64 인코딩
    image_base64 = generate_and_display_comic(prompt.prompt)
    if not image_base64:
        raise HTTPException(status_code=500, detail="Failed to generate webtoon")
    
    return {"image": image_base64}

@app.post("/ask")
async def ask(question: Question):
    print("속상")
    if not question.question:
        raise HTTPException(status_code=400, detail="No question provided")
    answer = ask_chatgpt(question.question)
    return {"answer": answer}

if __name__ == '__main__':
    print("서버안녕")
    uvicorn.run(app, host='0.0.0.0', port=8000)