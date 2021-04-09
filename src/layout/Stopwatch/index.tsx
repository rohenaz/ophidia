import React, { useEffect, useState } from "react";
import { StopwatchSettings, useStopwatch } from "react-timer-hook";
import "./odometer.css";

interface Settings extends StopwatchSettings {
  tick: (seconds: number) => void;
  pause: boolean;
  start: boolean;
  reset: boolean;
}

const Stopwatch: React.FC<Settings> = ({
  offsetTimestamp,
  autoStart,
  tick,
  reset: resetTimer,
  pause: pauseTimer,
  start: startTimer,
}) => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({
    autoStart,
    offsetTimestamp,
  });

  const [lastTick, setLastTick] = useState<number>(seconds);

  useEffect(() => {
    if (resetTimer) {
      console.log("resettings timer");
      reset();
    }
  }, [reset, resetTimer]);

  useEffect(() => {
    if (pauseTimer) {
      console.log("pausing timer");
      pause();
    }
  }, [pauseTimer, pause]);

  useEffect(() => {
    if (startTimer) {
      console.log("starting timer");
      start();
    }
  }, [startTimer, start]);

  useEffect(() => {
    if (tick && seconds !== lastTick) {
      console.log("last tick", lastTick, "seconds", seconds);
      tick(seconds);
      setLastTick(seconds);
    }
  }, [lastTick, seconds, tick]);

  return isRunning ? (
    <>
      <div style={{ textAlign: "center" }} className="flex-cols items-center">
        <div className="text-6xl font-semibold">{seconds}</div>
        <span className="text-sm">Seconds</span>
      </div>
    </>
  ) : null;
};

export default Stopwatch;
