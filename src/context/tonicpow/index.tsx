import { useLocation } from "@reach/router";
import { parse } from "querystring";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Script from "react-load-script";
import TonicPow from "../../types/tonicpow-js";
import { useLocalStorage } from "../../utils/storage";

type ContextValue = {
  sessionId: string | undefined;
  tonicPow: typeof TonicPow | undefined;
  ready: boolean;
  widgets: TonicPow.Widget[];
  getWidget: (widgetId: string) => TonicPow.Widget;
};

const TonicPowContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const TonicPowProvider: React.FC<{}> = (props) => {
  const [tonicPow, setTonicPow] = useState<typeof TonicPow | undefined>();
  const [ready, setReady] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<TonicPow.Widget[]>([]);

  const location = useLocation();

  const [sessionId, setSessionId] = useLocalStorage<string | undefined>(
    sessionStorageKey,
    undefined
  );

  const onWidgetLoaded = useCallback(
    (widget: TonicPow.Widget) => {
      let newWidgets = [...widgets];

      if (widget) {
        if (
          !widgets.some((w) => {
            return w.id === widget.id;
          })
        ) {
          newWidgets.push(widget);
          setWidgets(newWidgets);
        }
      }
    },
    [widgets]
  );

  const tncpwSessionQueryParam = useRef<string | undefined>(
    parse(location.search?.slice(1)).tncpw_session as string | undefined
  );

  const getWidget = useCallback(
    (widgetId: string) => {
      return widgets.filter((w) => w.id === widgetId)[0] || null;
    },
    [widgets]
  );

  const handleScriptLoad = useCallback(() => {
    let tPow = (window as any).TonicPow;
    if (tPow) {
      tPow.options = { onWidgetLoaded };
      setTonicPow(tPow);
      setReady(true);
    }
  }, [onWidgetLoaded]);

  useEffect(() => {
    if (tncpwSessionQueryParam?.current != null) {
      // TODO: Validate
      setSessionId(tncpwSessionQueryParam.current);
    }
  }, [location, sessionId, setSessionId, widgets]);

  const value = useMemo(
    () => ({
      sessionId,
      ready,
      tonicPow,
      widgets,
      getWidget,
    }),
    [sessionId, ready, tonicPow, widgets, getWidget]
  );

  return (
    <>
      <Script
        async
        defer
        url={`https://tonicpow.com/scripts/tonicpow.js`}
        onLoad={handleScriptLoad}
      />
      <TonicPowContext.Provider value={value} {...props} />
    </>
  );
};

export const useTonicPow = (): ContextValue => {
  const context = useContext(TonicPowContext);
  if (context === undefined) {
    throw new Error("useTonicPow must be used within an TonicPowProvider");
  }
  return context;
};

//
// Utils
//

const sessionStorageKey = "tp__TonicPowProvider_session";
