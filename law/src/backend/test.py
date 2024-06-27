import chromadb
from sentence_transformers import SentenceTransformer
import pandas as pd
from tqdm import tqdm

# Chroma DB 클라이언트 초기화
chroma_client = chromadb.Client()
table = chroma_client.create_collection(name="table")

# 임의의 데이터 생성 (딕셔너리 -> 데이터프레임)
df_data = {
    'user': ["1", "2", "3"],
    'answer': ["혼자좋아하는 것 같아", "혼자 좋아하는게 이렇게 힘든게 처음이야", "혼자라는거 그런대로 괜찮아"]
}
df = pd.DataFrame(df_data)

# Sentence Transformer 모델 초기화
model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')

ids = []
metadatas = []
embeddings = []

for row in tqdm(df.iterrows(), desc="Generating embeddings"):
    index = row[0]
    query = row[1].user
    answer = row[1].answer
    
    metadata = {
        "query": query,
        "answer": answer
    }
    
    embedding = model.encode(query, normalize_embeddings=True)
    
    ids.append(str(index))
    metadatas.append(metadata)
    embeddings.append(embedding)
    
# 데이터를 Chunk로 나누어 Chroma DB에 추가
chunk_size = 1024
total_chunks = len(embeddings) // chunk_size + 1
embeddings = [e.tolist() for e in embeddings]

for chunk_idx in tqdm(range(total_chunks), desc="Adding to Chroma DB"):
    start_idx = chunk_idx * chunk_size
    end_idx = (chunk_idx + 1) * chunk_size
    
    chunk_embeddings = embeddings[start_idx:end_idx]
    chunk_ids = ids[start_idx:end_idx]
    chunk_metadatas = metadatas[start_idx:end_idx]
    
    table.add(embeddings=chunk_embeddings, ids=chunk_ids, metadatas=chunk_metadatas)

# 쿼리 예제
query_text = "어제 여자친구랑 헤어졌다"
query_embedding = model.encode(query_text, normalize_embeddings=True).tolist()

try:
    results = table.query(query_embeddings=[query_embedding], n_results=3)
    
    print("Query results:")
    for idx, item in enumerate(results):
        if isinstance(item, dict):
            metadata = item.get('metadata', {})
            print(f"Rank {idx + 1}: {metadata.get('query')} - {metadata.get('answer')}")
        else:
            print(f"Rank {idx + 1}: Unexpected result format")
except Exception as e:
    print(f"Error during query: {str(e)}")