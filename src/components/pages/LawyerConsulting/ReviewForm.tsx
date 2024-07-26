import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../services/auth';
import StarRating from './StarRating';

interface ReviewFormProps {
  lawyerId: string;
}

interface ReviewDTO {
  id: number;
  comment: string;
  rating: number;
  userNickname: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ lawyerId }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const { isAuthenticated, user } = useAuth();
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/lawyer/${lawyerId}`, { headers });
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰 목록 가져오기 실패', error);
    }
  };

  useEffect(() => {
    if (lawyerId) {
      fetchReviews();
    }
  }, [lawyerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('사용자가 인증되지 않았습니다.');
      return;
    }

    try {
      const reviewData = {
        lawyerId,
        userId: user.id,
        comment,
        rating,
      };

      await axios.post(
        'http://localhost:8080/api/reviews',
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment('');
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error('리뷰 작성 실패', error);
    }
  };

  const maskNickname = (nickname: string) => {
    if (nickname.length <= 1) return '의뢰인 *';
    return `의뢰인 ${nickname[0]}${'*'.repeat(nickname.length - 1)}`;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="리뷰를 입력하세요"
          required
        />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
          <option value={0}>평점을 선택하세요</option>
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star}점
            </option>
          ))}
        </select>
        <button type="submit">제출</button>
      </form>
      <div>
        <h2>리뷰 목록</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id}>
              <h3>{maskNickname(review.userNickname)}</h3>
              <p>{review.comment}</p>
              <StarRating rating={review.rating} />
              <p>작성자: {maskNickname(review.userNickname)}</p>
            </div>
          ))
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
