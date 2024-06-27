import chromadb
chroma_client = chromadb.PersistentClient(path="./chroma.sqlite3")

collection = chroma_client.get_or_create_collection(name="divorce_law")

results = collection.query(
    query_texts=["남편의 부정행위"], # Chroma will embed this for you
    n_results=1 # how many results to return
)
print(results)