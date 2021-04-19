import { setLightness } from 'polished';
import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
`;

const bounceKeyframes = keyframes`
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
`;

const bounceCircleCss = css`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${setLightness(0.85, '#974CD2')};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${bounceKeyframes} 2s infinite ease-in-out;
`;

export const BounceCircle1 = styled.div`
  ${bounceCircleCss}
`;

export const BounceCircle2 = styled(BounceCircle1)`
  animation-delay: -1s;
`;

export const CenteredLoadingContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
