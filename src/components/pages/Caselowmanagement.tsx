import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const TableContainer = styled.div`
  margin-bottom: 2rem;
`;

const UploadButtonContainer = styled.div`
  text-align: right;
  margin-bottom: 1rem;
`;

const UploadButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ width?: string }>`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  width: ${({ width }) => width || 'auto'};
`;

const Td = styled.td<{ width?: string }>`
  border: 1px solid #ddd;
  padding: 8px;
  width: ${({ width }) => width || 'auto'};
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const ModalBackground = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: white;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
`;

const FileModalContent = styled.div`
  background-color: white;
  margin: 8% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
  max-height: 70vh; /* 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤바 추가 */
`;

const ContentModalContent = styled.div`
  background-color: white;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
  max-height: 70vh; /* 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤바 추가 */
`;

const CloseButton = styled.button`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  border: none;
  background: none;
  cursor: pointer;

  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

const CustomButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
  border-radius: 0.25rem;
  text-align: center;
`;

const backUrl = process.env.REACT_APP_BACK_URL;

const Caselowmanagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  const [caseContent, setCaseContent] = useState<string>("");

  const handleClose = () => {
    setShowModal(false);
    setCsvFile(null);
    setFileName("");
  };

  const handleShow = () => setShowModal(true);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backUrl}/api/csv/files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCsvFile(event.target.files[0]);
    }
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleUpload = async () => {
    if (csvFile) {
      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("fileName", fileName);
  
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${backUrl}/api/csv/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        handleClose();
        setShowSuccessMessage(true);
        fetchFiles();
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error) {
        console.error("파일 업로드 실패", error);
        alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("파일을 선택하세요.");
    }
  };

  const handleView = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backUrl}/api/csv/files/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'text'
      });
      const fileContent = response.data;
      setFileContent(fileContent);
      setShowFileModal(true);
    } catch (error) {
      console.error("파일 읽기 실패", error);
      alert("파일을 읽는 데 실패했습니다.");
    }
  };

  const handleViewContent = (content: string) => {
    setCaseContent(content);
    setShowContentModal(true);
  };

  const handleCloseFileModal = () => {
    setShowFileModal(false);
    setFileContent("");
  };

  const handleCloseContentModal = () => {
    setShowContentModal(false);
    setCaseContent("");
  };

  const renderFileContent = () => {
    const rows = fileContent.split("\n").map(row => row.split(","));
    return (
      <Table>
        <thead>
          <tr>
            {rows[0].map((cell, index) => (
              <Th key={index}>{cell}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1, 7).map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Td key={cellIndex}>{cell}</Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Title>CSV 파일 관리</Title>
      <UploadButtonContainer>
        <UploadButton onClick={handleShow}>파일 업로드</UploadButton>
      </UploadButtonContainer>

      {showSuccessMessage && (
        <SuccessMessage>파일이 성공적으로 업로드되었습니다.</SuccessMessage>
      )}

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th width="10%">No.</Th>
              <Th width="30%">업로드 날짜</Th>
              <Th width="40%">데이터명</Th>
              <Th width="20%">상세보기</Th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <Tr key={file.id}>
                <Td width="10%">{index + 1}</Td>
                <Td width="30%">{file.uploadDate}</Td>
                <Td width="40%">{file.fileName}</Td>
                <Td width="20%"><CustomButton onClick={() => handleView(file.id)}>보기</CustomButton></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <ModalBackground $show={showModal}>
        <ModalContent>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
          <h2>CSV 파일 업로드</h2>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <input 
            type="text" 
            placeholder="데이터명 입력" 
            value={fileName}
            onChange={handleFileNameChange}
            style={{ marginTop: '1rem', width: '100%', padding: '0.5rem' }}
          />
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <CustomButton onClick={handleUpload}>업로드</CustomButton>
          </div>
        </ModalContent>
      </ModalBackground>

      <ModalBackground $show={showFileModal}>
        <FileModalContent>
          <CloseButton onClick={handleCloseFileModal}>&times;</CloseButton>
          <h2>CSV 파일 내용</h2>
          {renderFileContent()}
        </FileModalContent>
      </ModalBackground>

      <ModalBackground $show={showContentModal}>
        <ContentModalContent>
          <CloseButton onClick={handleCloseContentModal}>&times;</CloseButton>
          <h2>판례 내용</h2>
          <div style={{ whiteSpace: 'pre-wrap', maxHeight: 'calc(70vh - 50px)', overflowY: 'auto' }}>
            {caseContent}
          </div>
        </ContentModalContent>
      </ModalBackground>
    </Container>
  );
};

export default Caselowmanagement;
