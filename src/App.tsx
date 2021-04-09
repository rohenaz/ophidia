import { shuffle } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { useFabDb } from "./context/fabdb";
import "./fonts.css";
import background from "./images/monarch_bg_large.jpg";
import EyeIcon from "./layout/icons/EyeIcon";
import { CenteredLoading } from "./layout/Loading";
import Stopwatch from "./layout/Stopwatch";
import { FetchStatus } from "./types/common";
interface PageProps {}

const App: React.FC<PageProps> = () => {
  const { fetchPack, packStatus, pack } = useFabDb();
  const [idx, setIdx] = useState<number>(0);
  const [zoomImg, setZoomImage] = useState<string | undefined>();
  const [accuracy, setAccuracy] = useState<number>(0);
  const [score, setScore] = useState<number>(initialScore);
  const [autoStart, setAutostart] = useState<boolean>(false);
  const [resetTimer, setResetTimer] = useState<boolean>(false);
  const [pauseTimer, setPauseTimer] = useState<boolean>(false);
  const [startTimer, setStartTimer] = useState<boolean>(false);

  useEffect(() => {
    if (pauseTimer) {
      setPauseTimer(false);
    }
    if (startTimer) {
      setStartTimer(false);
    }
    if (resetTimer) {
      setResetTimer(false);
    }
    if (pack.length === idx) {
      console.log("pausing");
      setPauseTimer(true);
      setResetTimer(true);
    }
  }, [idx, pack, pauseTimer, resetTimer, startTimer]);
  // Accuracy
  // Min 0
  // Max 16

  // Scale is up 16 * 100 = 1600
  // Every second deduct 1 pt

  // Deduct points per 10 seconds
  const next = useCallback(() => {
    setIdx(idx + 1);
    if (idx === pack.length) {
      setAutostart(false);
    }
  }, [idx, pack]);

  const card = useMemo(() => {
    return pack.length > idx ? pack[idx] || null : null;
  }, [idx, pack]);

  const zoom = useCallback((imgSrc: string) => {
    setZoomImage(imgSrc);
  }, []);

  const tick = useCallback(
    (seconds: number) => {
      console.log("seconds", seconds);
      setScore(score - 10);
    },
    [score]
  );

  const shuffledPack = useMemo(() => {
    let shuff = shuffle(pack);
    // Get unique names
    let uniqueNames = [...new Set(shuff.map((c) => c.name))];

    let uniqueCards = [];
    let currentCard = pack.length > idx ? pack[idx] : null;
    let x = uniqueNames.length;
    while (x--) {
      let uniqueName = uniqueNames[x];
      uniqueCards.push(shuff.filter((c) => c.name === uniqueName)[0]);
    }
    let preppedCards = [];
    let first4 = uniqueCards.slice(0, 4);
    if (
      !currentCard ||
      first4.some((c) => {
        return c.identifier === currentCard?.identifier;
      })
    ) {
      preppedCards = first4;
    } else {
      preppedCards = uniqueCards.slice(0, 3).concat(currentCard);
    }
    return shuffle(preppedCards);
  }, [idx, pack]);

  const tryAnswer = useCallback(
    (name) => {
      if (card?.name === name) {
        console.log("correct!", score + 1);
        setScore(score + 1);
        setAccuracy(accuracy + 1);
      } else {
        console.warn("wrong answer", score);
        setScore(score - 100);
      }
      next();
    },
    [accuracy, card, next, score]
  );

  const openPack = useCallback(async () => {
    setIdx(0);
    setScore(initialScore);
    setAccuracy(0);
    setStartTimer(true);

    let whichSet = ["wtr", "arc"][Math.round(Math.random())];
    console.log("which set?", whichSet);
    await fetchPack(whichSet);
  }, [fetchPack]);

  return (
    <div className="App">
      <header
        className="App-header shadow-lg "
        style={{ fontFamily: "capitolium-2" }}
      >
        <div className="flex items-center">
          <EyeIcon className="w-6 h-6 text-white mr-2" />
          ophidia
        </div>
      </header>
      {packStatus !== FetchStatus.Loading && card && autoStart && (
        <div className="App-body select-none flex items-center relative">
          <div
            style={{
              backgroundImage: `url(${background})`,
              backgroundAttachment: "fixed",
            }}
            className="w-full h-full absolute top-0 left-0"
          ></div>
          <div className="relative rounded-lg bg-white p-4 shadow-lg w-full max-w-lg text-center">
            <div className="text-xs font-semibold flex items-center absolute top-4 w-12 h-12 right-4 rounded-full bg-gray-400 text-white text-center">
              <div className="mx-auto">{idx + 1}/16</div>
            </div>
            <div
              style={{ fontFamily: "capitolium-2" }}
              className="font-semibold text-2xl text-gray-800 p-4 border-b"
            >
              Name the card
            </div>

            <div
              style={{ width: "300px" }}
              className={`relative mx-auto py-4  ${
                idx === 7 ? "foil-image" : ""
              }`}
            >
              <img
                src={card.image}
                className={`App-card mx-auto shadow-md rounded-2xl `}
                alt={card.name}
              />
              <div
                className="mx-auto absolute rounded-full"
                style={{
                  backgroundColor: "#f1e5d4",
                  width: "188px",
                  top: "2.65rem",
                  height: "1.35rem",
                  left: "3.5rem",
                }}
              />
            </div>

            <div className="p-4 m-4 text-base font-semibold bg-gray-200 rounded-lg">
              <div
                className="p-2 cursor-pointer rounded hover:bg-gray-100"
                onClick={() => tryAnswer(shuffledPack[0].name)}
              >
                {shuffledPack[0].name}
              </div>
              <div
                className="p-2 cursor-pointer rounded hover:bg-gray-100"
                onClick={() => tryAnswer(shuffledPack[1].name)}
              >
                {shuffledPack[1].name}
              </div>
              <div
                className="p-2 cursor-pointer rounded hover:bg-gray-100"
                onClick={() => tryAnswer(shuffledPack[2].name)}
              >
                {shuffledPack[2].name}
              </div>
              <div
                className="p-2 cursor-pointer rounded hover:bg-gray-100"
                onClick={() => tryAnswer(shuffledPack[3].name)}
              >
                {shuffledPack[3].name}
              </div>
            </div>
          </div>
        </div>
      )}
      {packStatus !== FetchStatus.Loading && card && !autoStart && (
        <div className="flex-cols items-center">
          <div className="text-3xl my-12">Open a pack. Name the cards.</div>
          <div className="flex items-center">
            <div
              onClick={() => setAutostart(true)}
              className="cursor-pointer hover:bg-indigo-600 rounded bg-indigo-400 text-white mx-auto my-12 p-2 px-4 text-lg"
            >
              My body is ready
            </div>
          </div>
        </div>
      )}
      {packStatus === FetchStatus.Loading && <CenteredLoading />}
      {packStatus !== FetchStatus.Loading && pack.length <= idx && (
        <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundAttachment: "fixed",
          }}
          className="w-full h-full fixed top-0 left-0 overflow-auto"
        >
          <div
            className={`p-4 font-semibold text-3xl rounded-full p-4 w-64 mx-auto my-12 ${
              score < 500
                ? "bg-red-600"
                : score < 1000
                ? "bg-yellow-600"
                : "bg-green-400"
            } `}
          >
            Score: {score > 0 ? score : 0}
            <br />
            <span className="text-base">
              Accuracy: {(accuracy / 16) * 100}%
            </span>
          </div>

          <div className="flex items-center">
            <div
              style={{ fontFamily: "capitolium-2" }}
              className="hover:bg-indigo-600 bg-indigo-400 cursor-pointer text-white p-4 text-2xl rounded mx-auto mb-24"
              onClick={openPack}
            >
              Open Another Pack
            </div>
          </div>

          <div className="p-2 grid grid-flow-row grid-cols-4 grid-rows-5 gap-4 mx-auto max-w-6xl">
            {pack.map((c) => {
              return (
                <div className={idx === 7 ? `foil-image` : ""}>
                  <img
                    src={c.image}
                    alt={c.name}
                    onClick={() => zoom(c.image)}
                    className="shadow-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {pack.length > idx && (
        <div className="p-2 absolute bottom-4 right-4 rounded-full w-36 h-36 bg-white shadow flex items-center">
          <div className="mx-auto">
            {autoStart && (
              <Stopwatch
                tick={tick}
                autoStart={autoStart}
                reset={resetTimer}
                start={startTimer}
                pause={pauseTimer}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

const initialScore = 1600;
