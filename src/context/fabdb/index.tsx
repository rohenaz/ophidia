import { shuffle } from "lodash";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { FetchStatus } from "../../types/common";
import * as http from "../../utils/httpClient";
import { useLocalStorage } from "../../utils/storage";

export type CardSet = {
  browseable: boolean;
  id: string;
  name: string;
  released: string;
};

export type Sku = {
  finish: string;
  number: string;
  set: CardSet;
};

export type Store = {
  currency: string;
  domain: string;
  name: string;
};

export type Listing = {
  id: number;
  store: Store;
};

export type Pivot = {
  card_id: number;
  ruling_id: number;
};

export type Ruling = {
  createdAt: string;
  description: string;
  pivot: Pivot;
  source: string;
  updatedAt: string;
};

export type Printing = {
  id: number;
  sku: Sku;
  edition: Object;
  set: string;
};

export interface CardStats {
  [key: string]: string;
  // [intellect: string]: string;
  // [life: string]: string;
  // [defense: string]: string;
  // [attack: string]: string;
  // [resource: string]: string;
  // [cost: string]: string;
  // [intellect: string]: string;
}

export type Card = {
  identifier: string;
  name: string;
  image: string;
  banned: boolean;
  comments: string;
  flavour: string;
  keywords: string[];
  listings: Listing[];
  printings: Printing[];
  rarity: string;
  rulings: Ruling[];
  stats: CardStats;
  text: string;
};

type ContextValue = {
  cardStatus: FetchStatus;
  pack: Partial<Card>[];
  cardDetails: Card | null;
  packStatus: FetchStatus;
  fetchCard: (identifier: string) => Promise<Card | null>;
  fetchPack: (set: string) => Promise<void>;
};

const FabDbContext = React.createContext<ContextValue | undefined>(undefined);

export const FabDbProvider: React.FC<{}> = (props) => {
  const [packStatus, setPackStatus] = useState<FetchStatus>(FetchStatus.Idle);
  const [cardStatus, setCardStatus] = useState<FetchStatus>(FetchStatus.Idle);
  const [pack, setPack] = useLocalStorage<Partial<Card>[]>(
    opFabDBPackStorageKey,
    []
  );
  const [card, setCard] = useState<Card | null>(null);

  const fetchCard = useCallback(
    async (identifier: string): Promise<Card | null> => {
      console.log("Fetching card!", identifier);

      setCardStatus(FetchStatus.Loading);

      try {
        const { promise } = http.customFetch<Card>(
          `${endpoint}/cards/${identifier}`
        );

        const cardDetails = await promise;

        setCard(cardDetails);

        setCardStatus(FetchStatus.Success);
        return cardDetails;
      } catch (e) {
        console.error(e);
        setCardStatus(FetchStatus.Error);
        return null;
      }
    },
    []
  );

  const fetchPack = useCallback(
    async (set: string): Promise<void> => {
      console.log("Fetching pack!", set);

      setPackStatus(FetchStatus.Loading);

      try {
        const { promise } = http.customFetch<Partial<Card>[]>(
          `${endpoint}/cards/pack?set=${set}`
        );

        const pack = await promise;

        setPack(shuffle(pack).slice(0, 16));
        setPackStatus(FetchStatus.Success);
      } catch (e) {
        console.error(e);
        setPackStatus(FetchStatus.Error);
      }
    },
    [setPack]
  );

  // This effect will request the users when the site first loads
  // useEffect(() => {
  //   if (!pack?.length && packStatus === FetchStatus.Idle) {
  //     fetchPack("arc");
  //   }
  // }, [pack, packStatus, fetchPack]);

  const value = useMemo(
    () => ({
      packStatus,
      pack: pack || [],
      fetchPack,
      fetchCard,
      cardStatus,
      cardDetails: card,
    }),
    [packStatus, fetchPack, pack, fetchCard, cardStatus, card]
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
const opFabDBPackStorageKey = `op__fabdb_pack`;
