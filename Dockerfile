# 1. 베이스 이미지 설정정정정
FROM node:14.19.0

# 2. 작업 디렉토리 생성 및 설정
RUN mkdir -p /app
WORKDIR /app

# 3. 프로젝트 파일 추가
ADD . /app/

# 4. 종속성 설치
RUN npm install

# 5. 포트 노출
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# 6. 애플리케이션 실행
CMD ["npm", "start"]
