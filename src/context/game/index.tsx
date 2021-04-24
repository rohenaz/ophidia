import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Stopwatch from "../../components/layout/Stopwatch";
import { FetchStatus } from "../../types/common";
import { useLocalStorage } from "../../utils/storage";
import { useConfetti } from "../confetti";
import { Card, useFabDb } from "../fabdb";
import { useSound } from "../sound";

interface LeaderboardRecord {
  name: string;
  score: number;
}

export enum GameStatus {
  Idle,
  Started,
  Complete,
  Recorded,
}

type ContextValue = {
  score: number;
  idx: number;
  cardPhase: number;
  card: Partial<Card> | null;
  startGame: () => Promise<void>;
  pack: Partial<Card>[];
  easyLeaderboard: LeaderboardRecord[];
  hardLeaderboard: LeaderboardRecord[];
  accuracy: number;
  tryAnswer: (value?: string, key?: string) => void;
  easyLeaderboardStatus: FetchStatus;
  hardLeaderboardStatus: FetchStatus;
  packStatus: FetchStatus;
  cardStatus: FetchStatus;
  renderStopwatch: JSX.Element | null;
  leaderboardScoreThreshold: number;
  currentKey: string;
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
  resetGame: () => void;
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
  maxPossibleScore: number;
};

const GameContext = React.createContext<ContextValue | undefined>(undefined);

export const GameProvider: React.FC<{}> = (props) => {
  const {
    pack,
    fetchPack,
    fetchCard,
    cardStatus,
    packStatus,
    cardDetails,
  } = useFabDb();
  const { setConfettiActive } = useConfetti();

  const { playSuccess, playNotice } = useSound();

  const [idx, setIdx] = useState<number>(0);

  const [lastIdx, setLastIdx] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useLocalStorage<GameStatus>(
    opGameStatusStorageKey,
    GameStatus.Idle
  );
  const [difficulty, setDifficulty] = useLocalStorage<number>(
    opGameDifficultyStorageKey,
    0
  ); // 0 = easy, 1 = hard todo: make an enum

  const [accuracy, setAccuracy] = useLocalStorage<number | undefined>(
    opGameAccuracyStorageKey,
    0
  );
  const [cardPhase, setCardPhase] = useState<number>(0);

  const [startTimer, setStartTimer] = useState<boolean>(false);

  const [resetTimer, setResetTimer] = useState<boolean>(false);
  const [pauseTimer, setPauseTimer] = useState<boolean>(false);
  const [bonusCardId, setBonusCardId] = useState<string | undefined>(undefined);
  const [easyLeaderboard, setEasyLeaderboard] = useState<LeaderboardRecord[]>(
    []
  );
  const [hardLeaderboard, setHardLeaderboard] = useState<LeaderboardRecord[]>(
    []
  );

  const [
    easyLeaderboardStatus,
    setEasyLeaderboardStatus,
  ] = useState<FetchStatus>(FetchStatus.Idle);
  const [
    hardLeaderboardStatus,
    setHardLeaderboardStatus,
  ] = useState<FetchStatus>(FetchStatus.Idle);

  const [autoStart, setAutostart] = useState<boolean>(false);

  // Score
  const initialScore = useMemo(() => {
    return difficulty === 0 ? maxPossibleScoreEasy : maxPossibleScoreHard;
  }, [difficulty]);

  const [score, setScore] = useLocalStorage<number>(
    opGameScoreStorageKey,
    initialScore
  );

  const getEasyLeaderboard = useCallback(async () => {
    setEasyLeaderboardStatus(FetchStatus.Loading);
    try {
      const resp = await fetch(
        `https://ophidia.app/functions/getLeaderboard/?difficulty=0`
      );
      let json = await resp.json();
      console.log("got", json);
      setEasyLeaderboardStatus(FetchStatus.Success);
      setEasyLeaderboard(json as LeaderboardRecord[]);
    } catch (e) {
      console.log("error", e);
      setEasyLeaderboardStatus(FetchStatus.Error);
    }
  }, []);

  const getHardLeaderboard = useCallback(async () => {
    setHardLeaderboardStatus(FetchStatus.Loading);
    try {
      const resp = await fetch(
        `https://ophidia.app/functions/getLeaderboard/?difficulty=1`
      );
      let json = await resp.json();
      setHardLeaderboardStatus(FetchStatus.Success);
      setHardLeaderboard(json as LeaderboardRecord[]);
    } catch (e) {
      console.log("error", e);
      setHardLeaderboardStatus(FetchStatus.Error);
    }
  }, []);

  useEffect(() => {
    if (easyLeaderboardStatus === FetchStatus.Idle && difficulty === 0) {
      getEasyLeaderboard();
    }
  }, [getEasyLeaderboard, easyLeaderboardStatus, difficulty]);

  useEffect(() => {
    if (hardLeaderboardStatus === FetchStatus.Idle && difficulty === 1) {
      getHardLeaderboard();
    }
  }, [getHardLeaderboard, hardLeaderboardStatus, difficulty]);

  // Accuracy
  // Min 0
  // Max 16

  // Scale is up 16 * 100 = 1600
  // Every second deduct 1 pt

  // Deduct points per 10 seconds
  const next = useCallback(() => {
    if (idx + 1 === pack.length) {
      setAutostart(false);
      // if (score > leaderboardScoreThreshold) {
      //   setShowNewRecord(true);
      // }
    }
    console.log("next!", idx);
    setIdx(idx + 1);
  }, [idx, pack.length]);

  const togglePhase = useCallback(() => {
    if (difficulty === 0) {
      next();
      return;
    }
    if (cardPhase === 0) {
      setCardPhase(1);
    } else {
      setCardPhase(0);
    }
  }, [cardPhase, next, difficulty]);

  // TODO: Hard mode leaderboard
  const leaderboardScoreThreshold = useMemo(() => {
    let leaderboard = difficulty === 0 ? easyLeaderboard : hardLeaderboard;
    return leaderboard.length >= maxLeaderboardRecords
      ? leaderboard[maxLeaderboardRecords - 1]?.score || 0
      : 0;
  }, [easyLeaderboard, difficulty, hardLeaderboard]);

  useEffect(() => {
    console.log({ leaderboardScoreThreshold });
  }, [leaderboardScoreThreshold]);

  // const card = useMemo(() => {
  //   return cardStatus === FetchStatus.Success && pack.length > idx
  //     ? (pack[idx] as Card) || null
  //     : null;
  // }, [cardStatus, idx, pack]);

  const card = useMemo(() => {
    return cardDetails || (pack && idx !== null ? pack[idx] : null); // currentCard;
  }, [cardDetails, pack, idx]);

  useEffect(() => {
    if (
      cardDetails?.identifier !== bonusCardId &&
      cardStatus === FetchStatus.Success &&
      ["S", "L", "M", "F"].includes(card?.rarity || "")
    ) {
      setBonusCardId(cardDetails?.identifier);
      if (card?.rarity === "S") {
        setScore((score || 0) + 5);
      }
      if (card?.rarity === "M") {
        setScore((score || 0) + 10);
      }
      if (card?.rarity === "L") {
        setScore((score || 0) + 50);
      }
      if (card?.rarity === "F") {
        setScore((score || 0) + 100);
      }
      setTimeout(() => {
        setConfettiActive(true);
      }, 300);
    }
  }, [card, setConfettiActive, score, setScore]);

  const tryAnswer = useCallback(
    (name?: string, key?: string) => {
      if (cardStatus === FetchStatus.Loading) {
        console.log("can't go yet still loading");
        return;
      }
      if (!score) {
        console.log("Something is wrong. No score.");
        return;
      }
      console.log("current card", cardDetails);
      if (cardPhase === 0) {
        if (cardDetails?.name === name) {
          console.log("correct!", score + 1);
          setScore(score + 1);
          setAccuracy((accuracy || 0) + 1);
          playSuccess();
        } else {
          playNotice();
          console.warn("wrong answer", score, cardPhase);
          setScore(score - 100);
        }
      } else {
        console.log("set card phase 0");

        if (key === "class") {
          let actualClass =
            (cardDetails?.keywords && cardDetails.keywords[0]) || "Generic";
          console.log("actual class", actualClass);
          if (name === actualClass) {
            setScore(score + 1);
            setAccuracy((accuracy || 0) + 1);
            playSuccess();
          } else {
            playNotice();
            console.warn(
              "wrong token answer!!!",
              actualClass,
              key,
              cardDetails
            );
            setScore(score - 100);
          }
        } else {
          if (
            cardDetails &&
            key &&
            cardDetails?.stats &&
            (cardDetails?.stats[key] === name ||
              (!cardDetails?.stats.hasOwnProperty(key) && name === "0"))
          ) {
            console.log("matches", key, name);
            setScore(score + 1);
            setAccuracy((accuracy || 0) + 1);
            playSuccess();
          } else {
            playNotice();
            console.warn("wrong answer!!!", name, key, cardDetails);
            setScore(score - 100);
          }
        }

        next();
      }
      togglePhase();
    },
    [
      setAccuracy,
      setScore,
      cardStatus,
      cardPhase,
      accuracy,
      cardDetails,
      next,
      playNotice,
      playSuccess,
      score,
      togglePhase,
    ]
  );

  const tick = useCallback(
    (seconds: number) => {
      console.log({ cardPhase, seconds, score });
      setScore((score || 0) - 10);
    },
    [score, cardPhase, setScore]
  );

  useEffect(() => {
    console.log({ card });
    if (
      packStatus === FetchStatus.Success &&
      pack &&
      pack.length > idx &&
      (!card?.keywords || card?.identifier !== pack[idx]?.identifier) &&
      cardStatus !== FetchStatus.Loading
    ) {
      console.log({ cardStatus, pack });
      let cardId = pack[idx || 0]?.identifier;
      console.log("card id", card?.identifier, pack[idx]?.identifier);
      if (cardId) {
        fetchCard(cardId);
      }
    }
  }, [card, idx, packStatus, cardStatus, fetchCard, pack]);

  const resetGame = useCallback(() => {
    setIdx(0);
    setAccuracy(0);
    setScore(initialScore);
    setPauseTimer(true);
    setResetTimer(true);
    setCardPhase(0);
    setGameStatus(undefined);
  }, [initialScore, setScore, setGameStatus, setAccuracy]);

  const startGame = useCallback(async () => {
    let whichSet = ["wtr", "arc"][Math.round(Math.random())];
    console.log("which set?", whichSet);
    await fetchPack(whichSet);
    setAutostart(true);
    setStartTimer(true);
  }, [fetchPack]);

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
  }, [idx, pack, pauseTimer, resetTimer, score, startTimer, resetGame]);

  const currentKey = useMemo(() => {
    const hasAttack = card?.stats?.hasOwnProperty("attack");
    const hasDefense = card?.stats?.hasOwnProperty("defense");
    const isEquipment = card?.keywords?.includes("equipment");
    const isHero = card?.keywords?.includes("hero");
    const isToken = card?.keywords?.includes("token");
    const isWeapon = card?.keywords?.includes("weapon");
    const isReaction = card?.keywords?.includes("reaction");

    return isHero
      ? "life"
      : isToken
      ? "class"
      : hasAttack || isWeapon
      ? "attack"
      : hasDefense || isEquipment
      ? "defense"
      : "cost";
  }, [card]);

  const renderStopwatch = useMemo(() => {
    return (
      card && (
        <div className="p-2 fixed  z-20 md:absolute left-2 bottom-2 md:bottom-4 md:right-4 rounded-full md:w-36 md:h-36 bg-white shadow flex items-center">
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
      )
    );
  }, [autoStart, pauseTimer, resetTimer, startTimer, tick, card]);

  const maxPossibleScore = useMemo(() => {
    return difficulty === 0 ? maxPossibleScoreEasy : maxPossibleScoreHard;
  }, [difficulty]);

  const value = useMemo(
    () => ({
      accuracy: accuracy || 0,
      cardPhase,
      score: score || 0,
      startGame,
      idx,
      card,
      next,
      easyLeaderboard,
      hardLeaderboard,
      renderStopwatch,
      pack,
      packStatus,
      tryAnswer,
      cardStatus,
      currentKey,
      easyLeaderboardStatus,
      hardLeaderboardStatus,
      leaderboardScoreThreshold,
      difficulty: difficulty || 0,
      setDifficulty,
      resetGame,
      gameStatus: gameStatus || GameStatus.Idle,
      setGameStatus,
      maxPossibleScore,
    }),
    [
      cardPhase,
      score,
      startGame,
      idx,
      accuracy,
      cardStatus,
      card,
      next,
      packStatus,
      easyLeaderboard,
      hardLeaderboard,
      pack,
      tryAnswer,
      easyLeaderboardStatus,
      hardLeaderboardStatus,
      renderStopwatch,
      currentKey,
      leaderboardScoreThreshold,
      difficulty,
      setDifficulty,
      resetGame,
      gameStatus,
      setGameStatus,
      maxPossibleScore,
    ]
  );

  return <GameContext.Provider value={value} {...props} />;
};

export const useGame = (): ContextValue => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within an GameProvider");
  }
  return context;
};

const maxLeaderboardRecords = 20;
export const maxPossibleScoreHard = 3200;
export const maxPossibleScoreEasy = 1600;

const opGameDifficultyStorageKey = `op__game_difficulty`;
const opGameScoreStorageKey = `op__game_score`;
const opGameStatusStorageKey = `op__game_status`;
const opGameAccuracyStorageKey = `op__game_accuracy`;
