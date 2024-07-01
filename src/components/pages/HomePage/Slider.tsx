import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: auto;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  height:400px;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const SlidesWrapper = styled.div<{ $translateX: number; $transition: string}>`
  display: flex;
  height: 100%;
  transform: translateX(${props => props.$translateX}%);
  transition: ${props => props.$transition};
`;

const Slide = styled.div<{ $backgroundColor: string; $textColor: string }>`
  position: relative;
  min-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${props => props.$backgroundColor};
  color: ${props => props.$textColor};
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 0;
  }
`;

const SlideContent = styled.div<{ $customStyles: any }>`
  ${props => props.$customStyles}
`;

const SlideButton = styled.button<{ $customStyles: any }>`
  ${props => props.$customStyles}
`;

const SlideLinkButton = styled(Link)<{ $customStyles: any }>`
  ${props => props.$customStyles}
  text-decoration: none;
`;

const SlideImage = styled.img<{ $customStyles: any }>`
  ${props => props.$customStyles}
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size:1.7rem;
  color:grey;
  transition: color 0.3s;

  &:hover {
    color: black;
  }
`;

const PrevButton = styled(Button)`
  left: -40px;
`;

const NextButton = styled(Button)`
  right: -40px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Spacer = styled.div`
  height: 1rem;
`;

interface SlideType {
  content: string | JSX.Element;
  content2?: string | JSX.Element;
  contentStyles2?: any;
  contentStyles: any;
  buttonText?: string;
  buttonText2?: string;
  buttonStyles?: any;
  buttonStyles2?: any;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageStyles?: any;
  imageStyles2?: any;
  imageStyles3?: any;
  textColor: string;
  backgroundColor: string;
}

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides: SlideType[] = [
    {
      content: (
        <StyledContent>
          AI 이혼 법률 비서 갈림길봇에게
          <Spacer />
          가입 후 빠르게 질문해보세요.
        </StyledContent>
      ),
      contentStyles: css`
        margin-top:10px;
        margin-left: 30px;
        color: white;
        font-size: 2rem;
        font-weight:900;
        text-align: left;

        @media (max-width: 768px) {
          margin: 0;
          text-align: center;
          font-size: 1.2rem;
        }
      `,
      content2: (
        <StyledContent>
          어렵고 복잡한 법률 정보,
          <Spacer />
          대화하듯 질문하고 신속하게 답변 받아보세요.
        </StyledContent>
      ),
      contentStyles2: css`
        margin-top: 30px;
        margin-left: 30px;
        color: #C0C0C0;
        font-size: 1rem;
        font-weight:700;
        text-align: left;

        @media (max-width: 768px) {
          display: none;
          text-align: center;
          font-size: 0.8rem;
        }
      `,
      buttonText: 'AI 이혼법률비서 갈림길',
      buttonStyles: css`
        background-color: #474747;
        margin-left: 30px;
        color: #C0C0C0;
        font-size:0.73rem;
        font-weight:bold;
        border: none;
        border-radius:5px;
        width: 130px;
        height: 30px;

        @media (max-width: 768px) {
          margin: 10px auto;
          font-size: 0.9rem;
        }
      `,
      buttonText2: '챗봇 체험 바로가기',
      buttonStyles2: css`
        margin-top:20px;
        margin-left: 30px;
        background-color: #9A9A9A;
        color: white;
        font-size:1.2rem;
        font-weight:bold;
        border: none;
        border-radius:5px;
        padding: 12px 15px;
        cursor: pointer;
        width: 180px;
        height: 40px;

        @media (max-width: 768px) {
          margin: 10px auto;
          font-size: 1rem;
        }
      `,
      imageUrl: '/images/slide1-1.PNG',
      imageUrl2: '/images/slide1-2.PNG',
      imageUrl3: '/images/slide1-3.PNG',
      imageStyles: css`
        position: absolute;
        right: 10px;  /* 오른쪽 여백을 조정하여 이미지 위치 조정 */
        top: 80px;
        z-index:900;

        @media (max-width: 1100px) {
          top: 150px;
          right: 200px;
          width: 350px;
        }

        @media (max-width: 1000px) {
          display: none;
        }
      `,
      imageStyles2: css`
        position: absolute;
        right: 10px;  /* 오른쪽 여백을 조정하여 이미지 위치 조정 */
        top: 160px;
        z-index:890;

        @media (max-width: 1100px) {
          top: 250px;
          right: 200px;
          width: 350px;
        }

        @media (max-width: 1000px) {
          display: none;
        }
      `,
      imageStyles3: css`
        position: absolute;
        right: 10px;
        top: 20px;
        z-index:910;

        @media (max-width: 768px) {
          display: none;
        }
      `,
      textColor: 'white',
      backgroundColor: '#2A2A2A',
    },
    {
      content: (
        <StyledContent>
          2
          <Spacer />
          2
        </StyledContent>
      ),
      contentStyles: css`
        margin-top:10px;
        margin-left: 30px;
        color: white;
        font-size: 2rem;
        font-weight:900;
        text-align: left;

        @media (max-width: 768px) {
          margin: 0;
          text-align: center;
          font-size: 1.2rem;
        }
      `,
      content2: (
        <StyledContent>
          2
          <Spacer />
          2
        </StyledContent>
      ),
      contentStyles2: css`
        margin-top: 30px;
        margin-left: 30px;
        color: #C0C0C0;
        font-size: 1rem;
        font-weight:700;
        text-align: left;

        @media (max-width: 768px) {
          display: none;
          text-align: center;
          font-size: 0.8rem;
        }
      `,
      buttonText: 'AI 이혼법률비서 갈림길',
      buttonStyles: css`
        background-color: #474747;
        margin-left: 30px;
        color: #C0C0C0;
        font-size:0.73rem;
        font-weight:bold;
        border: none;
        border-radius:5px;
        width: 130px;
        height: 30px;

        @media (max-width: 768px) {
          margin: 10px auto;
          font-size: 0.9rem;
        }
      `,
      buttonText2: '챗봇 체험 바로가기',
      buttonStyles2: css`
        margin-top:20px;
        margin-left: 30px;
        background-color: #9A9A9A;
        color: white;
        font-size:1.2rem;
        font-weight:bold;
        border: none;
        border-radius:5px;
        padding: 12px 15px;
        cursor: pointer;
        width: 180px;
        height: 40px;

        @media (max-width: 768px) {
          margin: 10px auto;
          font-size: 1rem;
        }
      `,
      imageUrl: '/images/slide1-1.PNG',
      imageUrl2: '/images/slide1-2.PNG',
      imageUrl3: '/images/slide1-3.PNG',
      imageStyles: css`
        position: absolute;
        right: 10px;  /* 오른쪽 여백을 조정하여 이미지 위치 조정 */
        top: 80px;
        z-index:900;

        @media (max-width: 1100px) {
          top: 150px;
          right: 200px;
          width: 350px;
        }

        @media (max-width: 1000px) {
          display: none;
        }
      `,
      imageStyles2: css`
        position: absolute;
        right: 10px;  /* 오른쪽 여백을 조정하여 이미지 위치 조정 */
        top: 160px;
        z-index:890;

        @media (max-width: 1100px) {
          top: 250px;
          right: 200px;
          width: 350px;
        }

        @media (max-width: 1000px) {
          display: none;
        }
      `,
      imageStyles3: css`
        position: absolute;
        right: 10px;
        top: 20px;
        z-index:910;

        @media (max-width: 768px) {
          display: none;
        }
      `,
      textColor: 'white',
      backgroundColor: '#2A2A2A',
    },
    {
      content: (
        <StyledContent>
          2
          <Spacer />
          2
        </StyledContent>
      ),
      contentStyles: css`
        margin-top:10px;
        margin-left: 30px;
        color: white;
        font-size: 2rem;
        font-weight:900;
        text-align: left;

        @media (max-width: 768px) {
          margin: 0;
          text-align: center;
          font-size: 1.2rem;
        }
      `,
      content2: (
        <StyledContent>
          3
          <Spacer />
          3
        </StyledContent>
      ),
      contentStyles2: css`
        margin-top: 30px;
        margin-left: 30px;
        color: #C0C0C0;
        font-size: 1rem;
        font-weight:700;
        text-align: left;

        @media (max-width: 768px) {
          display: none;
          text-align: center;
          font-size: 0.8rem;
        }
      `,
      buttonText: 'AI 이혼법률비서 갈림길',
      buttonStyles: css`
        background-color: #474747;
        margin-left: 30px;
        color: #C0C0C0;
        font-size:0.73rem;
        font-weight:bold;
        border: none;
        border-radius:5px;
        width: 130px;
        height: 30px;

        @media (max-width: 768px) {
          margin: 10px auto;
          font-size: 0.9rem;
        }
      `,
      buttonText2: '챗봇 체험 바로가기',
      buttonStyles2: css`
        margin-top:20px;
        margin-left: 30px;
        background-color: #9A9A9A;
        color: white;
        font-size:1.2rem;
        font-weight:bold;
        border: none;
        border-radius:5px;
        padding: 12px 15px;
        cursor: pointer;
        width: 180px;
        height: 40px;

        @media (max-width: 768px) {
          margin: 10px auto;
          font-size: 1rem;
        }
      `,
      imageUrl: '/images/slide1-1.PNG',
      imageUrl2: '/images/slide1-2.PNG',
      imageUrl3: '/images/slide1-3.PNG',
      imageStyles: css`
        position: absolute;
        right: 10px;
        top: 80px;
        z-index:900;

        @media (max-width: 1100px) {
          top: 150px;
          right: 200px;
          width: 350px;
        }

        @media (max-width: 1000px) {
          display: none;
        }
      `,
      imageStyles2: css`
        position: absolute;
        right: 10px;
        top: 160px;
        z-index:890;

        @media (max-width: 1100px) {
          top: 250px;
          right: 200px;
          width: 350px;
        }

        @media (max-width: 1000px) {
          display: none;
        }
      `,
      imageStyles3: css`
        position: absolute;
        right: 10px;
        top: 20px;
        z-index:910;

        @media (max-width: 768px) {
          display: none;
        }
      `,
      textColor: 'white',
      backgroundColor: '#2A2A2A',
    },
  ];

  const extendedSlides  = [
    slides[slides.length -1],
    ...slides,
    slides[0],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  });

  const goToPrevSlide = () => {
    if( !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToNextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      setTimeout(() => {
        if(currentSlide === 0) {
          setCurrentSlide(slides.length);
        } else if (currentSlide === slides.length + 1) {
          setCurrentSlide(1);
        }
        setIsAnimating(false);
      }, 500);
    }
  }, [currentSlide, isAnimating, slides.length]);

  return (
    <SliderWrapper>
      <PrevButton onClick={goToPrevSlide}>❮</PrevButton>
      <SliderContainer>
        <SlidesWrapper
          $translateX={-currentSlide * 100}
          $transition={isAnimating ? 'transform 0.5s ease-in-out' : 'none'}
        >
        {extendedSlides.map((slide, index) => (
            <Slide key={index} $backgroundColor={slide.backgroundColor} $textColor={slide.textColor}>
              {slide.buttonText && slide.buttonStyles && (
                <SlideButton $customStyles={slide.buttonStyles}>{slide.buttonText}</SlideButton>
              )}
              <SlideContent $customStyles={slide.contentStyles}>{slide.content}</SlideContent>
              {slide.content2 && slide.contentStyles2 && (
                <SlideContent $customStyles={slide.contentStyles2}>{slide.content2}</SlideContent>
              )}
              {slide.buttonText2 && slide.buttonStyles2 && (
                <SlideLinkButton to="/chatbot" $customStyles={slide.buttonStyles2}>{slide.buttonText2}</SlideLinkButton>
              )}
              {slide.imageUrl && slide.imageStyles && (
                <SlideImage $customStyles={slide.imageStyles} src={slide.imageUrl} alt={`Slide ${index}`} />
              )}
              {slide.imageUrl2 && slide.imageStyles2 && (
                <SlideImage $customStyles={slide.imageStyles2} src={slide.imageUrl2} alt={`Slide ${index}`} />
              )}
              {slide.imageUrl3 && slide.imageStyles3 && (
                <SlideImage $customStyles={slide.imageStyles3} src={slide.imageUrl3} alt={`Slide ${index}`} />
              )}
            </Slide>
          ))}
        </SlidesWrapper>
      </SliderContainer>
      <NextButton onClick={goToNextSlide}>❯</NextButton>
    </SliderWrapper>
  );
};

export default Slider;
