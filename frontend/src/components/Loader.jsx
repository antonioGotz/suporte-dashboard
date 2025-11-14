
import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px 0;
`;

const Spinner = styled.div`
  border: 4px solid rgba(59,130,246,0.15);
  border-top: 4px solid var(--color-primary, #06b6d4);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  animation: ${spin} 0.8s linear infinite;
`;

const Loader = () => (
  <LoaderContainer>
    <Spinner />
  </LoaderContainer>
);

export default Loader;
