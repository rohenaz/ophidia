import React, { useContext, useMemo } from "react";
import useSoundPlugin from "use-sound";
import { PlayFunction } from "use-sound/dist/types";
import noticeSound from "../../../assets/audio/notice.mp3";
import successSound from "../../../assets/audio/success.mp3";

type ContextValue = {
  playNotice: PlayFunction;
  playSuccess: PlayFunction;
};

const SoundContext = React.createContext<ContextValue | undefined>(undefined);

export const SoundProvider: React.FC<{}> = (props) => {
  const [playSuccess] = useSoundPlugin(successSound, { volume: 0.5 });
  const [playNotice] = useSoundPlugin(noticeSound, { volume: 0.25 });

  const value = useMemo(
    () => ({
      playSuccess,
      playNotice,
    }),
    [playSuccess, playNotice]
  );

  return <SoundContext.Provider value={value} {...props} />;
};

export const useSound = (): ContextValue => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within an SoundProvider");
  }
  return context;
};
