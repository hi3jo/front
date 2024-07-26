import React from 'react';
import styled from 'styled-components';

const StarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StarWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`;

const StarSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const StarFill = styled(StarSVG)`
  clip-path: polygon(
    50% 0%,
    61% 35%,
    95% 35%,
    68% 57%,
    79% 88%,
    50% 70%,
    21% 88%,
    32% 57%,
    5% 35%,
    39% 35%
  );
`;

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const partialStarPercentage = (rating - fullStars) * 100;

  return (
    <StarContainer>
      {[...Array(5)].map((_, index) => (
        <StarWrapper key={index}>
          <StarSVG viewBox="0 0 24 24" fill="lightgray">
            <polygon points="12 17.27 18.18 21 15.3 14.3 21 9.63 14.09 9.27 12 3 9.91 9.27 3 9.63 8.7 14.3 5.82 21 12 17.27" />
          </StarSVG>
          {index < fullStars && (
            <StarFill viewBox="0 0 24 24" fill="gold">
              <polygon points="12 17.27 18.18 21 15.3 14.3 21 9.63 14.09 9.27 12 3 9.91 9.27 3 9.63 8.7 14.3 5.82 21 12 17.27" />
            </StarFill>
          )}
          {index === fullStars && (
            <StarFill viewBox="0 0 24 24" fill="gold" style={{ clipPath: `inset(0 ${100 - partialStarPercentage}% 0 0)` }}>
              <polygon points="12 17.27 18.18 21 15.3 14.3 21 9.63 14.09 9.27 12 3 9.91 9.27 3 9.63 8.7 14.3 5.82 21 12 17.27" />
            </StarFill>
          )}
        </StarWrapper>
      ))}
    </StarContainer>
  );
};

export default StarRating;
