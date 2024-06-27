import pandas as pd
import chromadb

# 1. 클라이언트 생성
chroma_client = chromadb.PersistentClient(path="./chroma.sqlite3")

# 2. 임베딩 데이터를 저장하기 위한 장소
# 기존 컬렉션 가져오기
collection = chroma_client.get_collection(name="divorce_law")

# 3. CSV 파일 읽기
df = pd.read_csv('crawling2024.csv')

# 4. 데이터 추가
for index, row in df.iterrows():
    id = str(row['판례일련번호'])
    document = row['판례내용']
    collection.add(
        documents=[document],
        ids=[id]
    )