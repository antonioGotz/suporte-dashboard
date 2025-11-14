import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Outer = styled.div`
  min-height: 100vh;
  padding: 18px;
  background:
    radial-gradient(1100px 600px at 10% -20%, rgba(56,178,172,0.06), transparent 50%),
    radial-gradient(900px 500px at 110% 120%, rgba(56,178,172,0.05), transparent 50%),
    var(--color-bg-dark);
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Canvas = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  animation: ${fadeIn} 0.4s ease-out;
`;

const Content = styled.div`
  background: #1d2c2f;
  border: 1px solid rgba(0,0,0,.28);
  border-radius: 20px;
  padding: 18px;
`;

const PublicLayout = ({ children }) => {
  return (
    <Outer>
      <Canvas>
        <Content>{children}</Content>
      </Canvas>
    </Outer>
  );
};

export default PublicLayout;
