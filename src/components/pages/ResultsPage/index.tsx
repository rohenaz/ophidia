import { navigate, RouteComponentProps } from "@reach/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GameStatus, useGame } from "../../../context/game";
import { FetchStatus } from "../../../types/common";
import NewRecordModal from "../../layout/Modals/NewRecord";
import Widget from "../../layout/Widget";
import * as S from "./styles";

const ResultsPage: React.FC<RouteComponentProps> = ({ children, location }) => {
  const {
    accuracy,
    pack,
    idx,
    score,
    leaderboardScoreThreshold,
    difficulty,
    gameStatus,
    setGameStatus,
    maxPossibleScore,
  } = useGame();

  const [zoomImgSrc, setZoomImgSrc] = useState<string | undefined>();
  const [zoomImgStatus, setZoomImgStatus] = useState<FetchStatus>(
    FetchStatus.Idle
  );
  const [
    saveLeaderboardStatus,
    setSaveLeaderboardStatus,
  ] = useState<FetchStatus>(FetchStatus.Idle);

  const [showNewRecord, setShowNewRecord] = useState<boolean | null>(null);

  // This needs to match hard-coded backend minimum score
  // This is seperate from score threshold which is based on actual records on the leaderboard
  const minLeaderboardThreshold = useMemo(() => {
    return difficulty === 0 ? 1200 : 1600;
  }, [difficulty]);

  useEffect(() => {
    if (
      ![GameStatus.Complete, GameStatus.Recorded].includes(gameStatus) &&
      location?.pathname === "/results"
    ) {
      setSaveLeaderboardStatus(FetchStatus.Idle);
      setGameStatus(GameStatus.Complete);
    }
  }, [setGameStatus, gameStatus, location]);

  useEffect(() => {
    if (
      showNewRecord === null &&
      score > leaderboardScoreThreshold &&
      saveLeaderboardStatus === FetchStatus.Idle &&
      score >= minLeaderboardThreshold &&
      pack &&
      pack.length > 0 &&
      gameStatus === GameStatus.Complete &&
      score < maxPossibleScore
    ) {
      setShowNewRecord(true);
    }
  }, [
    minLeaderboardThreshold,
    leaderboardScoreThreshold,
    showNewRecord,
    saveLeaderboardStatus,
    score,
    pack,
    gameStatus,
    maxPossibleScore,
  ]);

  const zoom = useCallback((imgSrc: string | undefined) => {
    if (!imgSrc) {
      return;
    }
    setZoomImgSrc(imgSrc);
    setZoomImgStatus(FetchStatus.Loading);
  }, []);

  const renderPackGrid = useMemo(() => {
    return (
      <div className="p-2 grid grid-flow-row grid-cols-2 md:grid-cols-4 grid-rows-8 md:grid-rows-4 gap-4 mx-auto max-w-6xl">
        {pack.map((c, i) => {
          return (
            c &&
            c.image && (
              <div
                key={c.identifier + "-" + i}
                className={idx === 7 ? `foil-image` : ""}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  onClick={() => zoom(c.image)}
                  className="shadow-lg cursor-pointer"
                />
              </div>
            )
          );
        })}
      </div>
    );
  }, [idx, pack, zoom]);

  const zoomImg = useMemo(() => {
    if (zoomImgSrc) {
      const searchParams = new URLSearchParams(zoomImgSrc);
      searchParams.set("w", "600");

      let newImgSrc = decodeURIComponent(searchParams.toString());
      const img = document.createElement("img");

      img.onload = () => {
        console.log("loaded", searchParams.get("w"));
        setZoomImgStatus(FetchStatus.Success);
      };
      img.style.display = "none";
      img.src = newImgSrc;
      return img;
    }
    return "";
  }, [zoomImgSrc]);

  const renderResultsPage = useMemo(() => {
    return (
      <div className="w-full h-full">
        <div className="py-12">
          {(gameStatus === GameStatus.Complete ||
            gameStatus === GameStatus.Idle) &&
            score !== maxPossibleScore && (
              <div
                className={`p-4 font-semibold text-3xl rounded-full p-4 w-64 mx-auto text-center ${
                  score < (difficulty === 0 ? 800 : 1600)
                    ? "bg-red-600"
                    : score < leaderboardScoreThreshold
                    ? "bg-yellow-600"
                    : "bg-green-400"
                } `}
              >
                Score: {score > 0 ? score : 0}
                <br />
                <span className="text-base">
                  Accuracy: {(accuracy / (difficulty === 0 ? 16 : 32)) * 100}%
                </span>
              </div>
            )}
        </div>

        <div className="flex items-center">
          <div
            style={{ fontFamily: "capitolium-2" }}
            className="hover:bg-indigo-600 bg-indigo-400 cursor-pointer text-white p-4 text-2xl rounded mx-auto mb-24"
            onClick={(e) => {
              navigate("/");
            }}
          >
            Leaderboard
          </div>
        </div>

        {renderPackGrid}

        <Widget
          className="mx-auto my-24"
          width={600}
          height={300}
          widgetId={`87bdbf266e7153c18f7299e6e12ebf36bcdd9d32147782829ff4f79a856f9099`}
        />
      </div>
    );
  }, [
    accuracy,
    leaderboardScoreThreshold,
    renderPackGrid,
    score,
    difficulty,
    gameStatus,
    maxPossibleScore,
  ]);

  const renderZoomImage = useMemo(() => {
    return (
      zoomImg && (
        <div
          className={`cursor-pointer w-full fixed left-0 bottom-0 h-full bg-opacity-75 bg-black flex items-center`}
          onClick={(e: React.MouseEvent<Element, MouseEvent>) =>
            setZoomImgSrc(undefined)
          }
        >
          <div
            className="m-auto transition ease-in-out"
            id="zoomImg"
            style={{
              width: 600,
              height: 837,
              backgroundImage: `url("${zoomImgSrc}")`,
              backgroundPosition: `center`,
              backgroundAttachment: `fixed`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `600px 837px`,
              transition: ".25s filter linear",
              filter: `${
                zoomImgStatus !== FetchStatus.Success ? "blur(8px)" : "unset"
              }`,
            }}
          >
            {zoomImg.src && zoomImgStatus === FetchStatus.Success && (
              <img src={zoomImg.src} width={600} height={837} alt="Card" />
            )}
          </div>
        </div>
      )
    );
  }, [zoomImg, zoomImgStatus, zoomImgSrc]);

  const saveLeaderboard = useCallback(
    async (score: number, name: string, difficulty: number) => {
      // TODO: Save leaderboard
      console.log("saving", score, name);
      setSaveLeaderboardStatus(FetchStatus.Loading);
      if (!name.length) {
        return;
      }
      try {
        await fetch(
          `https://ophidia.app/functions/saveScore?name=${name}&score=${score}&difficulty=${difficulty}`
        );
        setGameStatus(GameStatus.Recorded);
        setSaveLeaderboardStatus(FetchStatus.Success);
      } catch (e) {
        console.log("error", e);
        setSaveLeaderboardStatus(FetchStatus.Error);
      }
    },
    [setGameStatus]
  );

  return (
    <S.Page>
      {renderResultsPage}

      {zoomImg && renderZoomImage}
      {
        <NewRecordModal
          score={score}
          classNames={{
            modal: "max-w-md mx-auto rounded bg-white shadow p-4",
          }}
          open={showNewRecord || false}
          onSubmit={async (userName: string) => {
            console.log("save record!", userName, difficulty);
            try {
              await saveLeaderboard(score, userName, difficulty);
            } catch (e) {
              console.error("error", e);
            }
            setShowNewRecord(false);
          }}
          onClose={() => {
            setShowNewRecord(false);
          }}
        />
      }
    </S.Page>
  );
};

export default ResultsPage;
