import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTonicPow } from "../../../context/tonicpow";
import { FetchStatus } from "../../../types/common";

interface Props {
  className?: string;
  widgetId: string;
  width: number;
  height: number;
  rotateInterval?: number;
}

const Widget: React.FC<Props> = ({
  className,
  height,
  widgetId,
  width,
  rotateInterval = 0,
}) => {
  const { tonicPow, widgets, getWidget } = useTonicPow();

  const [imgWidth, setImgWidth] = useState<number>(width);
  const [imgHeight, setImgHeight] = useState<number>(height);

  const [wasUnmounted, setWasUnmounted] = useState<boolean>();
  const [widgetStatus, setWidgetStatus] = useState<FetchStatus>(
    FetchStatus.Idle
  );

  const unmounted = useRef(false);

  // use the useEffect cleanup function to know if the component (page) was unmounted
  // so we don't update the state afterwards and thereby introduce a memory leak
  useEffect(
    () => () => {
      unmounted.current = true;
      setWidgetStatus(FetchStatus.Idle);
      setWasUnmounted(true);
    },
    []
  );

  const loadedWidget = useMemo(() => {
    return getWidget(widgetId);
  }, [getWidget, widgetId]);

  useEffect(() => {
    const load = async () => {
      setWidgetStatus(FetchStatus.Loading);
      try {
        await tonicPow?.load();
        if (rotateInterval) {
          setTimeout(() => {
            setWidgetStatus(FetchStatus.Idle);
          }, rotateInterval * 1000);
        }
        //}
      } catch (e) {
        console.log("Failed to load widget", e);
        setWidgetStatus(FetchStatus.Error);
      }
    };

    if (widgetStatus === FetchStatus.Idle) {
      load();
    }
  }, [
    height,
    rotateInterval,
    tonicPow,
    wasUnmounted,
    widgetId,
    widgetStatus,
    widgets,
    width,
  ]);

  useEffect(() => {
    if (loadedWidget) {
      const { height, width, link_url } = loadedWidget;
      setImgHeight(height);
      setImgWidth(width);
      setWidgetStatus(FetchStatus.Success);
    }
  }, [getWidget, loadedWidget, widgetId, widgetStatus, widgets]);

  return (
    <>
      <div className="flex w-full p-4">
        {FetchStatus.Error !== widgetStatus && (
          <div
            className={`transition duration-700 ease-in-out ${
              widgetStatus === FetchStatus.Idle ||
              widgetStatus === FetchStatus.Loading
                ? "opacity-0"
                : "opacity-100"
            } tonicpow-widget ${className ? className : ""}`}
            data-widget-id={`${widgetId}`}
            style={{ width: imgWidth, height: imgHeight }}
          ></div>
        )}
      </div>
    </>
  );
};

export default Widget;
