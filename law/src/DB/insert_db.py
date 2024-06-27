import chromadb

# 1.클라이언트 생성 : 클라이언트 객체를 생성하여 데이터베이스와 상호작용할 수 있게 해주는 함수.
chroma_client = chromadb.PersistentClient(path="./chroma.sqlite3")


# 2. 임베딩 데이터를 저장하기 위한 장소, 즉 테이블.
collection = chroma_client.create_collection(name="divorce_law")

collection.add(
    documents=[
        "대법원은 아내의 부정행위가 결혼 생활의 파탄에 주요 원인이 되었음을 인정했습니다. 또한, 아내의 부정행위가 반복적이고 지속적이었다는 점을 고려하여, 이혼을 허가하고 남편에게 위자료를 지급하도록 판결했습니다.",
        "대법원은 남편의 지속적인 폭력과 경제적 무책임이 결혼 생활의 파탄에 주요 원인이 되었음을 인정했습니다. 또한, 아내가 더 이상 남편과의 결혼 생활을 지속할 수 없다고 판단하여, 이혼을 허가하고 남편에게 위자료와 양육비를 지급하도록 판결했습니다."
    ],
    ids=["1", "2"]
)