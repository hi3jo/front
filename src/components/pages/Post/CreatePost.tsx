import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(e.target.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        let imageUrls: string[] = [];
        if (imageFiles) {
            for (let i = 0; i < imageFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', imageFiles[i]);
                try {
                    const response = await axios.post('http://localhost:8080/api/uploads', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    imageUrls.push(response.data);
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }
        }

        const post = { title, content, imageUrls };

        try {
            await axios.post('http://localhost:8080/api/posts', post, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>
                <div>
                    <label>내용</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label>이미지 업로드</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreatePost;
