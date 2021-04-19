import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FetchStatus } from "../../types/common";
import * as http from "../../utils/httpClient";

type Product = {
  productId: number;
  lowPrice: number;
  midPrice: number;
  highPrice: number;
  marketPrice: number;
  directLowPrice: number;
  subTypeName: string;
};

type AuthData = {
  access_token: string;
  ".expires": string;
  ".issued": string;
  expires_in: number;
  token_type: string;
  userName: string;
};

type ProductResults = {
  success: boolean;
  errors: string[];
  results: Product[];
};

type ContextValue = {
  authStatus: FetchStatus;
  authenticated: boolean;
  getProduct: (identifier: string) => Promise<Product[] | null>;
};

const TcgPlayerContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const TcgPlayerProvider: React.FC<{}> = (props) => {
  const [authStatus, setAuthStatus] = useState<FetchStatus>(FetchStatus.Idle);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);

  const authenticate = useCallback(async (): Promise<void> => {
    console.log("Authenticating!");

    setAuthStatus(FetchStatus.Loading);

    try {
      const { promise } = http.customFetch<AuthData>(`/functions/auth`);

      let data = await promise;
      setAuthData(data);
      setAuthStatus(FetchStatus.Success);
      setAuthenticated(true);
    } catch (e) {
      console.error(e);
      setAuthenticated(false);
      setAuthStatus(FetchStatus.Error);
    }
  }, []);

  const getProduct = useCallback(
    async (identifier: string): Promise<Product[] | null> => {
      console.log("Getting product!", identifier);

      if (!authData || !authData.access_token) {
        return null;
      }

      setAuthStatus(FetchStatus.Loading);
      try {
        const { promise } = http.customFetch<ProductResults>(
          `/functions/product?identifier=${identifier}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authData.access_token}`,
            },
          }
        );

        const products = await promise;

        if (products.success) {
          setAuthStatus(FetchStatus.Success);
          return products.results;
        } else {
          return null;
        }
      } catch (e) {
        console.error(e);
        setAuthStatus(FetchStatus.Error);
        return null;
      }
    },
    [authData]
  );

  // This effect will request the users when the site first loads
  useEffect(() => {
    if (!authenticated && authStatus === FetchStatus.Idle) {
      authenticate();
    }
  }, [authStatus, authenticate, authenticated]);

  const value = useMemo(
    () => ({
      authStatus,
      authenticated,
      getProduct,
    }),
    [authStatus, authenticated, getProduct]
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
