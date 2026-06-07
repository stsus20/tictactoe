import { useState, useCallback, useEffect, useRef } from 'react';
import { BoardState, Player } from '../types/game';
import { checkWinner } from '../utils/checkWinner';
import { getInitialBoard } from '../utils/resetGame';

const TURN_TIME_SECONDS = 15;
const WINNING_SCORE = 3;

interface UseGameReturn {
  board: BoardState;
  currentPlayer: Player;
  round: number;
  scores: { X: number; O: number };
  ties: number;
  timer: number;
  roundWinner: Player | 'draw' | null;
  gameWinner: Player | null;
  winningLine: number[] | null;
  isGameActive: boolean;
  isMatchOver: boolean;
  makeMove: (index: number) => void;
  nextRound: () => void;
  resetGame: () => void;
}

export const useGame = (): UseGameReturn => {
  const [board, setBoard] = useState<BoardState>(getInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [round, setRound] = useState<number>(1);
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [ties, setTies] = useState<number>(0);
  const [timer, setTimer] = useState<number>(TURN_TIME_SECONDS);
  const [roundWinner, setRoundWinner] = useState<Player | 'draw' | null>(null);
  const [gameWinner, setGameWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isGameActive = roundWinner === null;
  const isMatchOver = gameWinner !== null;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isGameActive && !isMatchOver) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            changeTurn();
            return TURN_TIME_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPlayer, isGameActive, isMatchOver, round]);

  const changeTurn = useCallback(() => {
    setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
    setTimer(TURN_TIME_SECONDS);
  }, []);

  const makeMove = useCallback(
    (index: number) => {
      if (!isGameActive || isMatchOver || board[index] !== null) {
        return;
      }

      try {
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const { winner, winningLine: line } = checkWinner(newBoard);
        if (winner) {
          setRoundWinner(winner);
          setWinningLine(line);
          if (winner !== 'draw') {
            setScores((prev) => {
              const updatedScores = { ...prev };
              if (winner === 'X' || winner === 'O') {
                updatedScores[winner] = prev[winner] + 1;
                if (updatedScores[winner] >= WINNING_SCORE) {
                  setGameWinner(winner);
                }
              }
              return updatedScores;
            });
          } else {
            setTies((prev) => prev + 1);
          }
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }

        changeTurn();
      } catch (error) {
        console.error('Error in makeMove:', error);
      }
    },
    [board, currentPlayer, isGameActive, isMatchOver, changeTurn]
  );

  const nextRound = useCallback(() => {
    if (isMatchOver) return;

    setBoard(getInitialBoard());
    setCurrentPlayer('X');
    setRoundWinner(null);
    setWinningLine(null);
    setRound((prev) => prev + 1);
    setTimer(TURN_TIME_SECONDS);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [isMatchOver]);

  const resetGame = useCallback(() => {
    setBoard(getInitialBoard());
    setCurrentPlayer('X');
    setRound(1);
    setScores({ X: 0, O: 0 });
    setTies(0);
    setRoundWinner(null);
    setGameWinner(null);
    setWinningLine(null);
    setTimer(TURN_TIME_SECONDS);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return {
    board,
    currentPlayer,
    round,
    scores,
    ties,
    timer,
    roundWinner,
    gameWinner,
    winningLine,
    isGameActive,
    isMatchOver,
    makeMove,
    nextRound,
    resetGame,
  };
};