import React, { useState, useEffect } from 'react';
import styled, { keyframes } from "styled-components";
import { useAuth } from '../../services/auth';
import axios from 'axios';
import moment from 'moment';
import { FaPhoneAlt } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { FaTimes, FaChevronDown } from 'react-icons/fa';

const slideUp = keyframes`
  from {
    margin-top: 0;
  }
  to {
    margin-top: -26rem;
  }
`;

const Container = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 35px 20px 0 20px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: ${({ $isOpen }) => ($isOpen ? '-26rem' : '0')};
  height: 32rem;
  transition: margin-top 0.3s ease-in-out;
  animation: ${({ $isOpen }) => ($isOpen ? slideUp : 'none')} 0.3s ease-in-out;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  cursor: pointer;
`;

const Icon = styled.span`
  font-size: 1.5rem;
  color: #666;
  margin-right: 1rem;
`;

const rotateUp = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

const rotateDown = keyframes`
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

const ChevronIcon = styled(FaChevronDown)<{ open: boolean }>`
  font-size: 1rem;
  margin-left: auto;
  color: #aaa;
  animation: ${({ open }) => (open ? rotateUp : rotateDown)} 0.25s linear forwards;
`;

const Row = styled.div`
  margin-top: 0.9rem;
  margin-bottom: 0.9rem;
  border: 1px solid #ccc;
  transform: scaleY(0.5);
  transform-origin: center;
`;

const ConsultingButton = styled.button`
  background-color: white;
  padding: 0.7rem 1.3rem;
  border: 0.5px solid #ccc;
  border-color: #ccc;
  border-radius: 10px;
  cursor: pointer;
  margin: 1rem 0.7rem 0 0;
  font-size: 1rem;
  color: #666;

  &.selected {
    color: #ff69b4;
    border-color: #ff69b4;
  }
`;

const CalendarButton = styled.button`
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  background-color: white;

  &.selected {
    background-color: #ff69b4;
    color: white;
    border-radius: 10px;
  }
`;

const CalendarButton2 = styled.button`
  border: none;
  font-size: 1rem;
  cursor: pointer;
  background-color: white;

  &.selected {
    color: #ff69b4;
  }
`;

const TimeButton = styled.button<{ $isExisting: boolean; $isSelected: boolean }>`
  background-color: ${({ $isExisting, $isSelected }) => ($isExisting ? ($isSelected ? 'white' : '#ccc') : ($isSelected ? '#ff69b4' : 'white'))};
  color: ${({ $isExisting, $isSelected }) => ($isExisting ? ($isSelected ? 'black' : 'white') : ($isSelected ? 'white' : 'black'))};
  width: 4.7rem;
  height: 2.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  transform: scaleY(1);
  transform-origin: center;

  &:hover {
    background-color: #ff69b4;
    color: white;
  }
`;

const TimeSelectionWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CloseButton = styled(FaTimes)`
  position: absolute;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  top: -28rem;
  right: 1rem;

  &:hover {
    color: #333;
  }
`;

const PaymentCon = styled.div`
  padding: 0 0 0 1.7rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 5rem;
  border-radius: 0 0 10px 10px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NextButton = styled.button`
  background-color: white;
  color: #aaa;
  border: none;
  padding: 1rem 5rem;
  font-size: 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 2.2rem;
`;

const NextButton2 = styled(NextButton)`
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  color: white;
  background-color: #ff69b4;
`;

interface AvailableTimeContainerProps {
  phoneConsultationPrice: number;
  inPersonConsultationPrice: number;
  onClose: () => void;
}

const AvailableTimeContainer: React.FC<AvailableTimeContainerProps> = ({ phoneConsultationPrice, inPersonConsultationPrice, onClose }) => {
  const { user } = useAuth();
  const [consultationType, setConsultationType] = useState<'phone' | 'inPerson' | null>(null);
  const [consultationTypeText, setConsultationTypeText] = useState<string>('상담 종류 선택');
  const [paymentText, setPaymentText] = useState<string>('0원');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [existingTimes, setExistingTimes] = useState<{ dateTime: string; type: 'phone' | 'inPerson' }[]>([]);
  const [sections, setSections] = useState<{ [key: string]: boolean }>({
    showConsultationType: true,
    showDateSelection: false,
    showTimeSelection: false,
  });
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchExistingTimes = async () => {
      if (user) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:8080/api/lawyer/available-times`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const times = response.data.map((time: any) => {
            const formattedDate = moment(time.date).format('YYYY-MM-DD');
            const formattedStartTime = moment(time.startTime, 'HH:mm:ss').format('HH:mm');
            return { dateTime: `${formattedDate} ${formattedStartTime}`, type: time.phoneConsultation ? 'phone' : 'inPerson' };
          });
          setExistingTimes(times);
        } catch (error) {
          console.error('Error fetching existing times:', error);
        }
      }
    };

    fetchExistingTimes();
  }, [user]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = moment().add(i, 'days');
    const dayOfWeek = i === 0 ? '오늘' : date.format('dd').replace(/Mo|Tu|We|Th|Fr|Sa|Su/, (match) => {
      switch (match) {
        case 'Mo': return '월';
        case 'Tu': return '화';
        case 'We': return '수';
        case 'Th': return '목';
        case 'Fr': return '금';
        case 'Sa': return '토';
        case 'Su': return '일';
        default: return match;
      }
    });
    return { date: date.format('D'), dayOfWeek, fullDate: date.format('YYYY-MM-DD') };
  });

  const times = Array.from({ length: 48 }, (_, i) => moment().startOf('day').add(i * 30, 'minutes').format('HH:mm'));

  const handleSave = async () => {
    if (consultationType && selectedDate && selectedTimes.length > 0 && user) {
      const token = localStorage.getItem('token');
      try {
        const savePromises = selectedTimes.map(async (startTime) => {
          const endTime = moment(startTime, 'HH:mm').add(30, 'minutes').format('HH:mm');
          const data = {
            date: selectedDate,
            startTime,
            endTime,
            phoneConsultation: consultationType === 'phone',
            inPersonConsultation: consultationType === 'inPerson',
            phoneConsultationPrice: consultationType === 'phone' ? phoneConsultationPrice : null,
            inPersonConsultationPrice: consultationType === 'inPerson' ? inPersonConsultationPrice : null,
            lawyerId: user.id
          };
  
          if (existingTimes.some(time => time.dateTime === `${selectedDate} ${startTime}` && time.type === consultationType)) {
            await axios.delete('http://localhost:8080/api/lawyer/available-time', {
              data: data,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          } else {
            await axios.post('http://localhost:8080/api/lawyer/available-time', data, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          }
        });
  
        await Promise.all(savePromises);
  
        const updatedTimes = selectedTimes.map((startTime) => {
          const dateTime = `${selectedDate} ${startTime}`;
          return { dateTime, type: consultationType };
        });
  
        setExistingTimes(prevTimes => [
          ...prevTimes.filter(time => !selectedTimes.includes(time.dateTime.split(' ')[1])),
          ...updatedTimes
        ]);
  
        resetContainer();
        onClose();
      } catch (error) {
        console.error('Error saving available times:', error);
      }
    }
  };

  const toggleTimeSelection = (time: string) => {
    const dateTime = `${selectedDate} ${time}`;
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
    if (existingTimes.some(existing => existing.dateTime === dateTime && existing.type === consultationType)) {
      if (selectedTimes.includes(time)) {
        setSelectedTimes(selectedTimes.filter((t) => t !== time));
      } else {
        setSelectedTimes([...selectedTimes, time]);
      }
    }
  };

  const resetContainer = () => {
    setConsultationType(null);
    setConsultationTypeText('상담 종류 선택');
    setSelectedDate(null);
    setSelectedTimes([]);
    setSections({
      showConsultationType: true,
      showDateSelection: false,
      showTimeSelection: false
    });
  };

  const handleSectionToggle = (section: string) => {
    setSections(prevSections => ({
      ...prevSections,
      [section]: !prevSections[section]
    }));
  };

  const handleConsultationTypeSelect = (type: 'phone' | 'inPerson', text: string) => {
    setConsultationType(type);
    setConsultationTypeText(text);
    setSelectedDate(null);
    setSelectedTimes([]);
    setSections({
      showConsultationType: false,
      showDateSelection: true,
      showTimeSelection: false
    });

    if (type === 'phone') {
      setPaymentText(`${phoneConsultationPrice}원`);
    } else {
      setPaymentText(`${inPersonConsultationPrice}원`);
    }
  };

  const handleDateSelect = (fullDate: string) => {
    setSelectedDate(fullDate);
    setSelectedTimes([]);
    setSections({
      showConsultationType: false,
      showDateSelection: false,
      showTimeSelection: true
    });
  };

  const getFilteredTimes = () => {
    if (!selectedDate) return times;
  
    const today = moment().format('YYYY-MM-DD');
    if (selectedDate === today) {
      const currentTime = moment().format('HH:mm');
      return times.filter(time => time > currentTime);
    }
  
    return times;
  }

  return (
    <div>
      <Container $isOpen={isOpen}>
        <CloseButton onClick={onClose} />
        <Section onClick={() => handleSectionToggle('showConsultationType')}>
          <Icon style={{ fontSize:'1.2rem', marginLeft:'0.2rem' }}><FaPhoneAlt /></Icon> {consultationTypeText}
          <ChevronIcon open={sections.showConsultationType} />
        </Section>
        {sections.showConsultationType && (
          <div>
            <ConsultingButton
              className={consultationType === 'phone' ? 'selected' : ''}
              onClick={() => handleConsultationTypeSelect('phone', '15분 전화 상담')}
            >
              15분 전화 상담
            </ConsultingButton>
            <ConsultingButton
              className={consultationType === 'inPerson' ? 'selected' : ''}
              onClick={() => handleConsultationTypeSelect('inPerson', '30분 방문 상담')}
            >
              30분 방문 상담
            </ConsultingButton>
          </div>
        )}
        <Row />
        <Section onClick={() => consultationType && handleSectionToggle('showDateSelection')}>
          <Icon><MdOutlineCalendarMonth /></Icon> 날짜 선택
          <ChevronIcon open={sections.showDateSelection} />
        </Section>
        {sections.showDateSelection && (
          <div style={{ flexDirection:'row', display:'flex', justifyContent:'center' }}>
            {dates.map(({ date, dayOfWeek, fullDate }) => (
              <div key={fullDate} style={{ flexDirection:'column', display:'flex', padding:'0.7rem 0.7rem 0 0.7rem' }}>
                <CalendarButton
                  className={selectedDate === fullDate ? 'selected' : ''}
                  onClick={() => handleDateSelect(fullDate)}
                >
                  {date}
                </CalendarButton>
                <CalendarButton2
                  className={selectedDate === fullDate ? 'selected' : ''}
                  onClick={() => handleDateSelect(fullDate)}
                >
                  {dayOfWeek}
                </CalendarButton2>
              </div>
            ))}
          </div>
        )}
        <Row />
        <Section onClick={() => selectedDate && handleSectionToggle('showTimeSelection')}>
          <Icon><FiClock /></Icon> 시간 선택
          <ChevronIcon open={sections.showTimeSelection} />
        </Section>
        {sections.showTimeSelection && (
          <TimeSelectionWrapper>
            {getFilteredTimes().map((time) => {
              const dateTime = `${selectedDate} ${time}`;
              const isExisting = existingTimes.some(existing => existing.dateTime === dateTime && existing.type === consultationType);
              const isSelected = selectedTimes.includes(time);
              return (
                <TimeButton
                  key={time}
                  $isExisting={isExisting}
                  $isSelected={isSelected}
                  onClick={() => toggleTimeSelection(time)}
                >
                  {time}
                </TimeButton>
              );
            })}
          </TimeSelectionWrapper>
        )}
      </Container>
      <PaymentCon>
        <div>
          <div style={{ color:'#888', marginBottom:'0.5rem' }}>총 결제금액</div>
          {paymentText && <span style={{ fontSize:'1.5rem' }}>{paymentText}</span>}
        </div>
        <NextButton2 
          disabled={
            selectedTimes.length === 0 
            && !existingTimes.some(existing => selectedTimes.includes(existing.dateTime.split(' ')[1]))
          } 
          onClick={handleSave}>
          예약 시간 저장
        </NextButton2>
      </PaymentCon>
    </div>
  );
};

export default AvailableTimeContainer;
