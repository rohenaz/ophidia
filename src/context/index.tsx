import { LocationProvider } from "@reach/router";
import React from "react";
import { FabDbProvider } from "./fabdb";
import { GameProvider } from "./game";
import { SoundProvider } from "./sound";
import { TcgPlayerProvider } from "./tcgplayer";
import { TonicPowProvider } from "./tonicpow";

interface Props {}

const AppContext: React.FC<Props> = ({ children }) => (
  <FabDbProvider>
    <TcgPlayerProvider>
      <SoundProvider>
        <LocationProvider>
          <TonicPowProvider>
            <GameProvider>{children}</GameProvider>
          </TonicPowProvider>
        </LocationProvider>
      </SoundProvider>
    </TcgPlayerProvider>
  </FabDbProvider>
);

export default AppContext;
