import styled from "styled-components";
import tw from "twin.macro";
import background from "../../images/prism.png";

export const Page = styled.div`
  min-height: calc(100vh - 4rem);
  background-image: url("${background}");
  background-attachment: fixed;
`;

export const List = tw.ul`
list-disc leading-7 list-inside
`;

export const ListItem = tw.li`
  leading-7
`;

// These styles should be shared with the promoter listings page, and about page and many others
export const Title = styled.div`
  ${tw`text-2xl sm:text-3xl md:text-4xl leading-9 tracking-tight text-white sm:text-5xl sm:leading-10 mb-4 font-extrabold`}
  font-family: Nunito;
`;

export const SectionSubtitle = styled.div`
  ${tw`opacity-75 mt-3 max-w-2xl mx-auto text-xl sm:text-2xl leading-6 sm:leading-7 sm:mt-4 font-semibold`}
  font-family: Nunito;
  color: #fff;
`;

export const SectionTitle = styled.div`
  ${tw`text-xl sm:text-2xl md:text-3xl leading-9 tracking-tight text-white sm:text-4xl sm:leading-10 my-4 font-bold`}
  font-family: Nunito;
`;

// Alias
export const Subtitle = SectionTitle;

export const DescriptionListTitle = styled.dt`
  ${tw`order-2 mt-2 text-lg leading-6 font-bold text-white opacity-75`}
  font-family: Nunito;
`;

export const DescriptionListDescription = styled.dt`
  ${tw`order-1 leading-none text-white justify-center`}
  font-family: Nunito;
`;

export const Paragraph = tw.p`
  text-white text-lg leading-7 text-gray-100 mb-5
`;

export const Section = tw.div`
  py-12
`;

export function Link(Link: any) {
  throw new Error("Function not implemented.");
}
