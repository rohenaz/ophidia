import { shuffle } from "lodash";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FetchStatus } from "../../types/common";
import * as http from "../../utils/httpClient";

export type Card = {
  identifier: string;
  name: string;
  image: string;
};

type ContextValue = {
  pack: Card[];
  packStatus: FetchStatus;
  fetchPack: (set: string) => Promise<void>;
};

const FabDbContext = React.createContext<ContextValue | undefined>(undefined);

export const FabDbProvider: React.FC<{}> = (props) => {
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

      setPack(shuffle(pack).slice(0, 16));
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

  return <FabDbContext.Provider value={value} {...props} />;
};

export const useFabDb = (): ContextValue => {
  const context = useContext(FabDbContext);
  if (context === undefined) {
    throw new Error("useFabDb must be used within an FabDbProvider");
  }
  return context;
};

//
// Utils
//

const endpoint = "https://api.fabdb.net";
