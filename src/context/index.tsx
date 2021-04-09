import React from "react";
import { FabDbProvider } from "./fabdb";
import { SoundProvider } from "./sound";

interface Props {}

const AppContext: React.FC<Props> = ({ children }) => (
  <FabDbProvider>
    <SoundProvider>{children}</SoundProvider>
  </FabDbProvider>
);

export default AppContext;
