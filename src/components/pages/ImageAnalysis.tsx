import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { format, isToday, parseISO } from 'date-fns';
import { MdWarningAmber } from "react-icons/md";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: #f8f9fa;
`;

const TopPanel = styled.div`
  display: flex;
  gap: 1rem;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  align-items: center;
  justify-content: center;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const BottomPanel = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
`;

const Warning = styled.div`
  position:absolute;
  margin-top: 50px;
  color:red;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileInputContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileInput = styled.input`
  margin-bottom: 1rem;
`;

const IconButton = styled.button`
  background: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #0056b3;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-width: 150px;
  margin: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ImageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  width: 100%;
`;

const ImageListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
`;

const ResultContent = styled.div`
  color: #555;
  margin: 0 1rem;
  flex: 2;
`;

const DateContent = styled.p`
  color: #555;
  margin: 0 1rem;
  flex: 1;
  text-align: right;
`;

const EvidenceStatus = styled.p<{ $isPossible: boolean }>`
  color: ${props => (props.$isPossible ? 'green' : 'red')};
  font-weight: bold;
  align-items: center;
`;

const PrintButton = styled.button`
  background: #28a745;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  align-self: flex-end;

  &:hover {
    background: #218838;
  }
`;

interface UploadedImage {
  src: string;
  result: string;
  date: string;
  isPossible: boolean;
}

const backUrl = process.env.REACT_APP_BACK_URL;

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return format(date, 'yyyy-MM-dd HH:mm');
  } else {
    return format(date, 'yyyy-MM-dd');
  }
};

const ImageAnalysis = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [files2, setFiles2] = useState<File[]>([]);
  const [analysisResult1, setAnalysisResult1] = useState<{ answer: string, isPossible: boolean } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ src: string, result: string, date: string, isPossible: boolean }[]>([]);
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);
  const imageListRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile1(e.target.files[0]);
    }
  };

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file1);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await axios.post(`${backUrl}/api/imageAnalysis/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response:', res.data);  // 응답 데이터 확인

      const date = new Date().toISOString();
      const responseText = res.data;
      const answerMatch = responseText.match(/분석결과: (.*?),/);
      const isPossibleMatch = responseText.match(/증거채택여부: (.*?),/);

      const answer = answerMatch ? answerMatch[1] : '';
      const isPossible = isPossibleMatch ? isPossibleMatch[1] === 'True' : false;

      setAnalysisResult1({ answer, isPossible });

      // 분석결과가 'normal'이 아닌 경우에만 업로드된 이미지 목록에 추가
      if (answer !== 'normal') {
        setUploadedImages((prevImages) => [...prevImages, { src: URL.createObjectURL(file1), result: answer, date, isPossible }]);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }

    setFile1(null);
    if (fileInputRef1.current) {
      fileInputRef1.current.value = '';
    }
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files2.length === 0) {
        console.error('No files selected');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const formData = new FormData();
        for (const file of files2) {
            formData.append('file', file);
        }

        const res = await axios.post(`${backUrl}/api/textImgAna/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Response:', res.data);

        // 백엔드에서 받은 응답을 직접 사용
          const newUploadedImages = res.data.map((item: any) => {
            const answer = item.answer;
            const formattedAnswer = `대화내용: ${answer.대화내용}\n성적표현: ${answer.성적표현}\n부적절관계: ${answer.부적절관계}`;
            
            return {
                src: URL.createObjectURL(files2.find(file => file.name === item.filename) || new Blob()),
                result: formattedAnswer,
                date: item.datetime,
                isPossible: item.isPossible
            };
        });

        setUploadedImages((prevImages) => [...prevImages, ...newUploadedImages]);

    } catch (error: any) {
        // 에러 처리 코드 (변경 없음)
    }

    setFiles2([]);
    if (fileInputRef2.current) {
        fileInputRef2.current.value = '';
    }
  };

  const handleFilesChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFiles2(Array.from(e.target.files));
      }
  };


  const handlePrint = () => {
    if (!imageListRef.current) return;

    html2canvas(imageListRef.current).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save('uploaded-images.pdf');
    });
  };

  return (
    <Container>
      <TopPanel>
        <LeftPanel>
          <Header>이미지 분석</Header>
          {file1 && <ImagePreview src={URL.createObjectURL(file1)} alt="Selected" />}
          <Form onSubmit={handleSubmit1}>
            <FileInputContainer>
              <FileInput type="file" onChange={handleFileChange1} ref={fileInputRef1} required />
              <IconButton type="submit">
                <FaPaperPlane />
              </IconButton>
            </FileInputContainer>
          </Form>
          {analysisResult1 && (
            <>
              <ResultContent>분석 결과: {analysisResult1.answer}</ResultContent>
              <EvidenceStatus $isPossible={analysisResult1.isPossible}>
                증거 채택 여부: {analysisResult1.isPossible ? 'True' : 'False'}
              </EvidenceStatus>
            </>
          )}
        </LeftPanel>
        <RightPanel>
          <Header>텍스트 이미지 분석</Header>
          {files2.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {files2.map((file, index) => (
                <ImagePreview key={index} src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
              ))}
            </div>
          )}
          <Form onSubmit={handleSubmit2}>
            <FileInputContainer>
              <FileInput type="file" onChange={handleFilesChange2} ref={fileInputRef2} required multiple />
              <IconButton type="submit">
                <FaPaperPlane />
              </IconButton>
            </FileInputContainer>
          </Form>
        </RightPanel>
      </TopPanel>
      <BottomPanel ref={imageListRef}>
        <Header>증거 목록</Header>
        <Warning><MdWarningAmber style={{ fontSize:'1.5rem' }} />주의: 모든 증거 수집은 반드시 합법적인 절차와 경로를 통해 이루어져야 합니다.</Warning>
        <PrintButton onClick={handlePrint}>PDF로 저장</PrintButton>

        <ImageList>
          <ImageListItem>
            <strong>이미지</strong>
            <strong>결과</strong>
            <strong>날짜</strong>
            <strong>증거 채택 여부</strong>
          </ImageListItem>
          {uploadedImages.map((img, index) => (
            <ImageListItem key={index}>
              <ImagePreview src={img.src} alt={`Uploaded ${index}`} />
              <ResultContent style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{img.result}</ResultContent>
              <DateContent>{formatDate(img.date)}</DateContent>
              <EvidenceStatus $isPossible={img.isPossible}>
                {img.isPossible ? 'True' : 'False'}
              </EvidenceStatus>
            </ImageListItem>
          ))}
        </ImageList>
      </BottomPanel>
    </Container>
  );
};

export default ImageAnalysis;
