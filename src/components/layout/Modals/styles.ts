import styled from "styled-components";
import tw from "twin.macro";
import * as S from "../../pages/styles";

export const SectionTitle = styled(S.SectionTitle)`
  ${tw`text-gray-500 my-1 p-0 text-xl`}
`;

export const Section = styled(S.Section)`
  ${tw`m-0 p-1`}
`;

export const Strike = tw.div`
  line-through pb-2 mt-2
`;

export const Title = styled.h2`
  ${tw`text-gray-500
  text-sm
  font-medium
  tracking-wide
  flex
  w-full
  font-bold
  items-center`};
  font-family: "capitolium-2";
`;

export const Heading = styled.h2`
  ${tw`text-xl font-semibold w-full`};
  font-family: Nunito;
`;

export const Paragraph = tw(S.Paragraph)`
  text-gray-600
  text-base
`;
