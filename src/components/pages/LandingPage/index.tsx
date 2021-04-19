import { navigate, RouteComponentProps } from "@reach/router";
import React, { useEffect, useMemo, useState } from "react";
import { useGame } from "../../../context/game";
import fabDbLogo from "../../../images/fabdb-logo.png";
import background from "../../../images/so-white.png";
import { FetchStatus } from "../../../types/common";
import Divider from "../../layout/icons/Divider";
import { CenteredLoading } from "../../layout/Loading";
import DifficultyModal from "../../layout/Modals/Difficulty";
import * as S from "./styles";
const LandingPage: React.FC<RouteComponentProps> = ({ children, location }) => {
  const {
    easyLeaderboard,
    easyLeaderboardStatus,
    hardLeaderboard,
    hardLeaderboardStatus,
    resetGame,
    difficulty,
    setDifficulty,
  } = useGame();

  // Clear game when you navigate away from the results page
  useEffect(() => {
    if (location?.pathname === "/") {
      console.log("path changed!");
      resetGame();
    }
  }, [location, resetGame]);

  const [showDifficultyModal, setShowDifficultyModal] = useState<boolean>(
    false
  );

  const leaderboard = useMemo(() => {
    return difficulty === 0 ? easyLeaderboard : hardLeaderboard;
  }, [difficulty, easyLeaderboard, hardLeaderboard]);

  const leaderboardStatus = useMemo(() => {
    return difficulty === 0 ? easyLeaderboardStatus : hardLeaderboardStatus;
  }, [difficulty, easyLeaderboardStatus, hardLeaderboardStatus]);

  const renderLeaderboard = useMemo(() => {
    return (
      <div className="bg-white bg-opacity-76 rounded-lg p-8 max-w-sm mx-auto shadow-lg">
        <h2
          className="font-semibold text-lg"
          style={{ fontFamily: "capitolium-2" }}
        >
          Leaderboard
        </h2>
        <div
          className="cursor-pointer pb-4 text-sm"
          onClick={() => setDifficulty(difficulty === 0 ? 1 : 0)}
        >
          Difficulty: {difficulty === 0 ? "Apprentice" : "Hero"}
        </div>
        {leaderboardStatus === FetchStatus.Loading && <CenteredLoading />}
        {leaderboardStatus === FetchStatus.Success &&
          leaderboard.length > 0 &&
          leaderboard?.map((r, idx) => {
            return (
              <div
                key={idx}
                style={{ fontFamily: "capitolium-2" }}
                className={`w-full justify-between flex items-center max-w-xs mx-auto border-t p-2`}
              >
                <div className="pl-4">{r.name}</div>
                <div className="pr-4">{r.score}</div>
              </div>
            );
          })}
      </div>
    );
  }, [leaderboard, leaderboardStatus, difficulty, setDifficulty]);

  return (
    <S.Page
      style={{
        background: `url(${background})`,
      }}
    >
      <div className="flex-cols items-center p-4 relative text-center">
        <img
          src="https://ophidia.app/images/eye.png"
          alt="Eye of Ophidia"
          className="w-full max-w-lg mx-auto my-12 rounded-lg"
        />
        <div
          className="mb-8 absoilute top-0"
          style={{ fontFamily: "capitolium-2" }}
        >
          <div className="mx-auto bg-opacity-75 text-3xl flex flex-col justify-center items-center">
            <span className="text-base">Test your Sight</span>
            <span>Open a Pack</span>
            <span className="text-lg">Name the Cards</span>
            <div className="flex items-center h-16">
              <div
                onClick={() => setShowDifficultyModal(true)}
                className="transition ease-in-out cursor-pointer w-24 shadow hover:bg-indigo-600 rounded bg-indigo-400 text-white mx-auto mt-12 p-2 px-4 text-lg"
              >
                Play
              </div>
            </div>
          </div>
        </div>

        <Divider className="max-w-sm mx-auto text-gray-300" />

        <div>{renderLeaderboard}</div>

        <Divider className="max-w-sm mx-auto text-gray-300 transform rotate-180" />

        <div className="flex flex-col items-center w-full p-4 justify-center">
          <a href="https://fabdb.net/" target="_blank" rel="noreferrer">
            <img src={fabDbLogo} alt="Fab DB" className="w-36" />
          </a>{" "}
          <p className="text-sm text-gray-500 p-4">
            Thanks to FabDB.net for the API
          </p>
        </div>

        <div className="hidden text-xs text-center p-4 w-full mx-auto max-w-3xl mt-8">
          This product uses TCGplayer data but is not endorsed or certified by
          TCGplayer.
        </div>
      </div>
      <DifficultyModal
        open={showDifficultyModal}
        onSubmit={() => {
          navigate("/game");
        }}
        onClose={() => setShowDifficultyModal(false)}
      />
    </S.Page>
  );
};

export default LandingPage;
