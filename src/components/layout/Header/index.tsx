import { navigate } from "@reach/router";
import React from "react";
import EyeIcon from "../icons/EyeIcon";
import * as S from "./styles";

const Header: React.FC<{}> = () => {
  return (
    <S.Header
      className="App-header shadow-lg "
      style={{ fontFamily: "capitolium-2" }}
    >
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <EyeIcon className="w-6 h-6 text-white mr-2" />
        Ophidia
      </div>
    </S.Header>
  );
};

export default Header;
