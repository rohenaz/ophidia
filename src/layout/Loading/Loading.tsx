import React from 'react';
import * as S from './styles';

interface Props {
  className?: string;
}

const Loading: React.FC<Props> = (props) => (
  <S.Container {...props}>
    <S.BounceCircle1 />
    <S.BounceCircle2 />
  </S.Container>
);

export default Loading;
