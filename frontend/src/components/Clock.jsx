import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
`;

const slideIn = keyframes`
  0% { transform: translateY(6px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const ClockWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  color: #e2e8f0;
  gap: 0.9rem;
  font-family: 'Inter', sans-serif;
`;

const TimeGroup = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
`;

const TimeDigits = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const HourDigit = styled.span`
  display: inline-block;
  width: 1.2ch;
  text-align: center;
`;

const Separator = styled.span`
  display: inline-block;
  margin: 0 0.35rem;
  animation: ${blink} 1.5s steps(2, start) infinite;
`;

const AnimatedMinuteDigit = styled.span`
  display: inline-block;
  width: 1.2ch;
  text-align: center;
  animation: ${slideIn} 0.28s ease;
`;

const DateLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(226, 232, 240, 0.78);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  letter-spacing: normal;
`;

const Clock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { hourDigits, minuteDigits, dateLabel } = useMemo(() => {
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const formattedDate = dateFormatter.format(now);

    return {
      hourDigits: hours.split(''),
      minuteDigits: minutes.split(''),
      dateLabel: formattedDate,
    };
  }, [now]);

  return (
    <ClockWrapper>
      <TimeGroup>
        <TimeDigits>
          <HourDigit>{hourDigits[0]}</HourDigit>
          <HourDigit>{hourDigits[1]}</HourDigit>
          <Separator>:</Separator>
          <AnimatedMinuteDigit key={`m0-${minuteDigits[0]}`}>{minuteDigits[0]}</AnimatedMinuteDigit>
          <AnimatedMinuteDigit key={`m1-${minuteDigits[1]}`}>{minuteDigits[1]}</AnimatedMinuteDigit>
        </TimeDigits>
      </TimeGroup>
      <DateLabel>
        <span>&bull;</span>
        <span>{dateLabel}</span>
      </DateLabel>
    </ClockWrapper>
  );
};

export default Clock;
