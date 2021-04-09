import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FetchStatus } from "../../types/common";
import * as http from "../../utils/httpClient";

type Card = {
  identifier: string;
  name: string;
  image: string;
};

type ContextValue = {
  pack: Card[];
  packStatus: FetchStatus;
  fetchPack: (set: string) => Promise<void>;
};

const TcgPlayerContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const TcgPlayerProvider: React.FC<{}> = (props) => {
  const [packStatus, setPackStatus] = useState<FetchStatus>(FetchStatus.Idle);
  const [pack, setPack] = useState<Card[]>([]);

  const fetchPack = useCallback(async (set: string): Promise<void> => {
    console.log("Fetching pack!", set);

    setPackStatus(FetchStatus.Loading);

    try {
      const { promise } = http.customFetch<Card[]>(
        `${endpoint}/cards/pack?set=${set}`
      );

      const pack = await promise;

      setPack(pack);
      setPackStatus(FetchStatus.Success);
      console.log("set pack to ", pack);
    } catch (e) {
      console.error(e);
      setPackStatus(FetchStatus.Error);
    }
  }, []);

  // This effect will request the users when the site first loads
  useEffect(() => {
    if (!pack?.length && packStatus === FetchStatus.Idle) {
      fetchPack("arc");
    }
  }, [pack, packStatus, fetchPack]);

  const value = useMemo(
    () => ({
      packStatus,
      pack: pack || [],
      fetchPack,
    }),
    [packStatus, fetchPack, pack]
  );

  return <TcgPlayerContext.Provider value={value} {...props} />;
};

export const useTcgPlayer = (): ContextValue => {
  const context = useContext(TcgPlayerContext);
  if (context === undefined) {
    throw new Error("useTcgPlayer must be used within an TcgPlayerProvider");
  }
  return context;
};

//
// Utils
//

const endpoint = "https://api.tcgplayer.com";
