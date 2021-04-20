import { LocationProvider } from "@reach/router";
import React from "react";
import { ConfettiProvider } from "./confetti";
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
            <ConfettiProvider>
              <GameProvider>{children}</GameProvider>
            </ConfettiProvider>
          </TonicPowProvider>
        </LocationProvider>
      </SoundProvider>
    </TcgPlayerProvider>
  </FabDbProvider>
);

export default AppContext;
