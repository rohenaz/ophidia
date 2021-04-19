import styled from "styled-components";
import tw from "twin.macro";
import CloseIconComponent from "../../icons/CloseIcon";
import * as S from "../styles";

export const Heading = S.Heading;
export const Strike = S.Strike;
export const Title = S.Title;

export const Backdrop = styled.div`
  background: linear-gradient(
    24.3deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(100, 100, 100, 0.9) 100%
  );
  backdrop-filter: blur(2px);
  background-blend-mode: darken;
  ${tw`
    w-full 
    h-full 
    fixed 
    top-0 
    left-0 
    items-center 
    flex 
    z-10
  `}
`;

export const CloseIcon = styled(
  CloseIconComponent
)(({ classProvided }: { classProvided: boolean }) => [
  !classProvided && tw`text-gray-600 hover:text-red-400 w-6 h-6`,
]);

export const Modal = styled.div(
  ({ classProvided }: { classProvided: boolean }) => [
    !classProvided &&
      tw`bg-white
    overflow-auto
    mx-auto
    mt-0
    h-full
    w-full
    sm:w-auto
    sm:h-auto
    sm:shadow-sm
    md:shadow
    sm:rounded
    md:rounded-lg
    sm:max-w-screen-sm
    md:max-w-screen-md
    px-4 py-5 sm:p-6
  `,
    { minWidth: "40vw" },
  ]
);
