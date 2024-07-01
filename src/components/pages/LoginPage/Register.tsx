import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        userid: '',
        password: '',
        nickname: '',
        role: 'ROLE_USER'  // 기본값은 일반 사용자
    });

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/register', formData)
            .then(response => {
                alert('회원가입 성공!');
            })
            .catch(error => {
                alert('회원가입 실패..');
            });
    };

    const handleLawyerSubmit = (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        const lawyerFormData = { ...formData, role: 'ROLE_LAWYER' };
        axios.post('http://localhost:8080/api/auth/register-lawyer', lawyerFormData)
            .then(response => {
                alert('변호사 회원가입 성공!');
            })
            .catch(error => {
                alert('변호사 회원가입 실패..');
            });
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="userid" placeholder="User ID" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <input type="text" name="nickname" placeholder="Nickname" onChange={handleChange} />
                <button type="submit">Register</button>
            </form>
            
            <h2>변호사 전용 회원가입</h2>
            <form onSubmit={handleLawyerSubmit}>
                <input type="text" name="userid" placeholder="User ID" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <input type="text" name="nickname" placeholder="Nickname" onChange={handleChange} />
                <button type="submit">Register as Lawyer</button>
            </form>
        </div>
    );
};

export default Register;
