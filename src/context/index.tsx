import React from "react";
import { FabDbProvider } from "./fabdb";

interface Props {}

const AppContext: React.FC<Props> = ({ children }) => (
  <FabDbProvider>{children}</FabDbProvider>
);

export default AppContext;
