# 1. Build 단계 - Node.js를 사용하여 리액트 앱을 빌드합니다.
FROM node:14.19.0 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 파일 추가
ADD . /app/

# 종속성 설치
RUN npm install

# 빌드 실행
RUN npm run build

# 2. Serve 단계 - 경량 웹 서버로 정적 파일 제공
FROM node:14.19.0

# serve 패키지 글로벌 설치
RUN npm install -g serve

# 빌드된 파일들을 복사
COPY --from=build /app/build /app/build

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["serve", "-s", "build", "-l", "3000"]
