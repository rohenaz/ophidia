import styled from "styled-components";
import tw from "twin.macro";
import * as S from "../styles";

export const Container = tw.div``;

export const Answer = tw.div`
  p-2 cursor-pointer rounded hover:bg-gray-100 flex items-center justify-center
`;

export const Icon = tw.img`
  w-4 h-4 mr-2
`;

export const Page = styled(S.Page)``;
