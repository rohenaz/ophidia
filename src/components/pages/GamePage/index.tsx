import { navigate, RouteComponentProps } from "@reach/router";
import { shuffle } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { GameStatus, useGame } from "../../../context/game";
import atkIcon from "../../../images/attack.png";
import defIcon from "../../../images/def.png";
import lifeIcon from "../../../images/life.png";
import resIcon from "../../../images/res.png";
import hardModeIcon from "../../../images/rout.png";
import { FetchStatus } from "../../../types/common";
import { CenteredLoading } from "../../layout/Loading";
import * as S from "./styles";

const GamePage: React.FC<RouteComponentProps> = ({ children, location }) => {
  const {
    idx,
    pack,
    packStatus,
    startGame,
    card,
    cardPhase,
    renderStopwatch,
    tryAnswer,
    currentKey,
    cardStatus,
    difficulty,
    gameStatus,
    setGameStatus,
  } = useGame();

  useEffect(() => {
    if (gameStatus !== GameStatus.Started && location?.pathname === "/game") {
      startGame();
      setGameStatus(GameStatus.Started);
    }
    if (packStatus === FetchStatus.Success && pack.length === idx) {
      navigate("/results");
    }
  }, [gameStatus, setGameStatus, startGame, pack, idx, location, packStatus]);

  const shuffledPack = useMemo(() => {
    let shuff = shuffle(pack);
    // Get unique names
    let uniqueNames = [...new Set(shuff.map((c) => c.name))];

    let uniqueCards = [];
    let current = pack.length > idx ? pack[idx] : null;
    let x = uniqueNames.length;
    while (x--) {
      let uniqueName = uniqueNames[x];
      uniqueCards.push(shuff.filter((c) => c.name === uniqueName)[0]);
    }
    let preppedCards = [];
    let first4 = uniqueCards.slice(0, 4);
    if (
      !current ||
      first4.some((c) => {
        return c.identifier === current?.identifier;
      })
    ) {
      preppedCards = first4;
    } else {
      preppedCards = uniqueCards.slice(0, 3).concat(current);
    }
    return shuffle(preppedCards);
  }, [idx, pack]);

  const shuffledClasses = useMemo(() => {
    return shuffle(allClasses).slice(0, 4);
  }, []);

  const shuffledStats = useMemo(() => {
    const attk = card?.stats?.attack;
    const def = card?.stats?.defense;
    const cost = card?.stats?.cost;
    // TODO: Switch on card type

    let results: string[] = [];
    switch (currentKey) {
      case "life":
        results = ["15", "20", "30", "40"];
        break;
      case "class":
        results = shuffledClasses;
        break;
      case "attack":
        results = shuffle(["0", "1", "2", "3", "4", "5", "6"]).slice(0, 4);
        if (attk && !results?.includes(attk)) {
          results[0] = attk;
          results = shuffle(results);
        }
        break;
      case "defense":
        results = shuffle(["0", "1", "2", "3", "4", "5", "6", "7"]).slice(0, 4);
        if (def && !results?.includes(def)) {
          results[0] = def;
          results = shuffle(results);
        }
        break;
      case "cost":
        results = shuffle(["0", "1", "2", "3", "4"]).slice(0, 4);
        if (cost && !results?.includes(cost)) {
          results[0] = cost;
          results = shuffle(results);
        }
        break;
    }
    // If it's "class" it's a special case
    if (currentKey === "class") {
      const classKeyword = card?.keywords && card?.keywords[0];
      if (classKeyword && !results?.includes(classKeyword)) {
        results[0] = classKeyword;
        results = shuffle(results);
      }
    }
    // Make sure the correct value is included
    // TODO: currentKey state basen on currentCard
    return shuffle(results);
  }, [card, currentKey, shuffledClasses]);

  const resourceDisplay = useCallback((cost: number) => {
    if (cost === 0) {
      return <div>{`${cost}`}</div>;
    }
    let x = cost;
    let output: JSX.Element[] = [];
    while (x--) {
      output.push(<S.Icon src={resIcon} />);
    }
    return output;
  }, []);

  const renderPhase2 = useMemo(() => {
    return card?.keywords && currentKey === "life"
      ? shuffledStats.map((s, i) => {
          return (
            <S.Answer
              key={"stats-" + i}
              onClick={() => tryAnswer(`${s}`, "life")}
            >
              <S.Icon src={lifeIcon} /> {s}
            </S.Answer>
          );
        })
      : currentKey === "class"
      ? shuffledStats.map((s, i) => {
          return (
            <S.Answer
              key={"stats-" + i}
              onClick={() => tryAnswer(`${s}`, "class")}
            >
              {s}
            </S.Answer>
          );
        })
      : currentKey === "defense"
      ? shuffledStats.map((s, i) => {
          return (
            <S.Answer
              key={"stats-" + i}
              onClick={() => tryAnswer(`${s}`, "defense")}
            >
              <S.Icon src={defIcon} />
              {s}
            </S.Answer>
          );
        })
      : currentKey === "attack"
      ? shuffledStats.map((s, i) => {
          return (
            <S.Answer
              key={"stats-" + i}
              onClick={() => tryAnswer(`${s}`, "attack")}
            >
              <S.Icon src={atkIcon} />
              {s}
            </S.Answer>
          );
        })
      : shuffledStats.map((s, i) => {
          return (
            <S.Answer
              key={"stats-" + i}
              onClick={() => tryAnswer(`${s}`, "cost")}
            >
              {resourceDisplay(parseInt(s))}
            </S.Answer>
          );
        });
    // (
    //   <>
    //     <div onClick={() => tryAnswer(0)}>
    //       Cost: {currentCard?.stats?.cost}
    //     </div>
    //   </>
    // )
  }, [shuffledStats, card, tryAnswer, resourceDisplay, currentKey]);

  const title = useMemo(() => {
    if (cardPhase === 0) return "Name the card";

    switch (currentKey) {
      case "life":
        return "How much Life?";
      case "defense":
        return "How much Defense?";
      case "attack":
        return "How much Attack?";
      case "cost":
        return "Resource Cost";
      case "class":
        return "Name the class";
    }

    return "Resource Cost";
  }, [cardPhase, currentKey]);

  return (
    <S.Page className="flex items-center justify-center">
      <div className="w-full max-w-lg select-none flex items-center relative">
        {packStatus === FetchStatus.Loading && (
          <CenteredLoading className="mx-auto" />
        )}
        {packStatus === FetchStatus.Success && (
          <div className="z-10 rounded-lg bg-white p-4 shadow-lg w-full max-w-lg text-center mx-auto">
            <div className="flex w-full items-center">
              <div
                className="text-xs font-semibold flex items-center  
              w-10 md:w-12 h-10 md:h-12"
              >
                &nbsp;{" "}
                {difficulty === 1 ? (
                  <S.Icon
                    src={hardModeIcon}
                    alt="Hero Mode"
                    title="Hero Mode"
                    style={{ width: "2rem", height: "2rem" }}
                  />
                ) : null}
              </div>
              <div
                style={{ fontFamily: "capitolium-2" }}
                className="flex items-center font-semibold w-full h-12 
                text-2xl text-gray-800 border-b"
              >
                <span className="mx-auto">{title}</span>
              </div>
              <div>
                <div
                  className="text-xs font-semibold flex items-center  
              w-10 md:w-12 h-10 md:h-12 
              rounded-full bg-gray-400 text-white text-center"
                >
                  <div className="mx-auto">{idx + 1}/16</div>
                </div>
              </div>
            </div>

            <div
              style={{ width: "300px" }}
              className={`relative mx-auto py-4 overflow-hidden max-h-72 ${
                idx === 7 ? "foil-image" : ""
              }`}
            >
              <img
                src={card?.image}
                className={`App-card mx-auto shadow-md rounded-2xl h-full transition ease-in-out ${
                  cardStatus !== FetchStatus.Success
                    ? "opacity-0"
                    : "opacity-100"
                }`}
                alt={card?.name}
              />

              <div
                className={`mx-auto absolute rounded-lg transition ease-in-out`}
                style={{
                  backgroundColor:
                    cardStatus !== FetchStatus.Success ? "#fff" : "#f1e5d4",
                  width: "188px",
                  top: "2.65rem",
                  height: "1.35rem",
                  left: "3.5rem",
                }}
              />
            </div>

            <div
              className="p-4 m-4 text-base 
          font-semibold bg-gray-200 rounded-lg"
            >
              {cardPhase === 0 && (
                <>
                  <S.Answer onClick={() => tryAnswer(shuffledPack[0]?.name)}>
                    {shuffledPack[0]?.name}
                  </S.Answer>
                  <S.Answer onClick={() => tryAnswer(shuffledPack[1]?.name)}>
                    {shuffledPack[1]?.name}
                  </S.Answer>
                  <S.Answer onClick={() => tryAnswer(shuffledPack[2]?.name)}>
                    {shuffledPack[2]?.name}
                  </S.Answer>
                  <S.Answer onClick={() => tryAnswer(shuffledPack[3]?.name)}>
                    {shuffledPack[3]?.name}
                  </S.Answer>
                </>
              )}
              {cardPhase === 1 && renderPhase2}
            </div>
          </div>
        )}
      </div>
      {renderStopwatch}
    </S.Page>
  );
};

export default GamePage;

const allClasses = [
  "wizard",
  "brute",
  "shadow brute",
  "ranger",
  "guardian",
  "generic",
  "warrior",
  "mechanologist",
];
