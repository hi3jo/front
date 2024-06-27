import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../../styles/user/Home.css'; // CSS 파일 추가

const Home: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [webtoonImage, setWebtoonImage] = useState('');
  const [asideOpen, setAsideOpen] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (question.trim() === '') {
      alert('질문을 입력하세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/ask/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleGenerateWebtoon = async (prompt: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/ask/generate-webtoon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setWebtoonImage(`data:image/png;base64,${data.image}`);
      setAsideOpen(true);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleGenerateWebtoonClick = () => {
    handleGenerateWebtoon(question);
  };

  const toggleAside = () => {
    setAsideOpen(!asideOpen);
  };

  return (
    <div className="home-container">
      <header>
        <h1>Law&Bot</h1>
        <p>상상 그 이상의 검색, 로앤봇 어떤 법령 정보를 검색해드릴까요?</p>
      </header>
      <div className="content-wrapper">
        <main>
          {loading && <div className="loading"><div className="loader"></div></div>}
          {response && (
            <div className="response">
              <h2>답변:</h2>
              <p>{response}</p>
            </div>
          )}
          <button className="toggle-button" onClick={toggleAside}>
            {asideOpen ? '접기' : '펼치기'}
          </button>
        </main>
        <aside className={`right-aside ${asideOpen ? 'open' : ''}`}>
          {webtoonImage && (
            <div className="webtoon">
              <h2>웹툰:</h2>
              <div className="image">
                <img src={webtoonImage} alt="웹툰" />
              </div>
            </div>
          )}
        </aside>
      </div>
      <footer>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            placeholder="질문을 입력하세요"
          />
          <button type="submit">질문하기</button>
          <button type="button" onClick={handleGenerateWebtoonClick}>웹툰 생성</button>
        </form>
      </footer>
    </div>
  );
};

export default Home;