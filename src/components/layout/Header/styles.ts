import styled from "styled-components";
import tw from "twin.macro";

export const Header = styled.header`
  ${tw`flex flex-col items-center justify-center bg-gray-800 text-white p-4`};
  font-size: calc(10px + 2vmin);
  height: 4rem;
`;
