import React, { useCallback, useContext, useMemo, useState } from "react";
import Confetti from "react-dom-confetti";

type ContextValue = {
  confettiActive: boolean;
  setConfettiActive: (active: boolean) => void;
  config: Object;
  Confetti: typeof Confetti; // React.Component<ConfettiProps, any>;
};

const ConfettiContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const ConfettiProvider: React.FC<{}> = (props) => {
  const [confettiActive, setConfettiActiveInternal] = useState<boolean>(false);

  const setConfettiActive = useCallback((active: boolean) => {
    setConfettiActiveInternal(active);
    if (active) {
      setTimeout(() => setConfettiActiveInternal(false), 3000);
    }
  }, []);

  const value = useMemo(
    () => ({
      confettiActive,
      setConfettiActive,
      config,
      Confetti,
    }),
    [confettiActive, setConfettiActive]
  );

  return <ConfettiContext.Provider value={value} {...props} />;
};

export const useConfetti = (): ContextValue => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error("useConfetti must be used within an ConfettiProvider");
  }
  return context;
};

//
// Utils
//

const config = {
  angle: 0,
  spread: 560,
  startVelocity: 60,
  elementCount: 170,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#49ACC1", "#974CD2", "#D75555", "#EE9189"],
};
