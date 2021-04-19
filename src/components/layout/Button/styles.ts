import { setLightness, setSaturation } from "polished";
import styled from "styled-components";
import tw from "twin.macro";

export const Button = styled.button`
  ${tw`
    active:bg-indigo-700 
    border
    border-transparent
    cursor-pointer
    duration-300
    ease-in-out
    focus:border-purple-700
    focus:outline-none
    font-medium
    hover:bg-purple-500 
    inline-flex
    items-center 
    leading-5
    px-4
    py-2 
    rounded-md
    shadow-sm 
    text-sm
    text-white 
    transition
  `};
  -webkit-appearance: unset; // This is a fix for safari. can probably be removes when we upgrade tailwind?
  background: ${(props) => (props.color ? props.color : `#974CD2`)};
  &:hover {
    background: ${(props) =>
      props.color
        ? setLightness(0.5, props.color)
        : setLightness(1.25, "#974CD2")};
  }
  &:disabled {
    cursor: default;
    background: ${(props) =>
      props.color
        ? setLightness(0.4, setSaturation(0.25, props.color))
        : setLightness(0.4, setSaturation(0.25, "#974CD2"))};
  }
`;
