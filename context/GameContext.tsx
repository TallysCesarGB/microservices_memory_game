// context/GameContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CardItem {
  id: string;
  imageId: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameContextType {
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  score: number;
  setScore: (score: number) => void;
  totalMoves: number;
  setTotalMoves: (moves: number) => void;
  usedImageIds: number[];
  addUsedImageIds: (ids: number[]) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType>({
  currentLevel: 1,
  setCurrentLevel: () => {},
  score: 0,
  setScore: () => {},
  totalMoves: 0,
  setTotalMoves: () => {},
  usedImageIds: [],
  addUsedImageIds: () => {},
  resetGame: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [usedImageIds, setUsedImageIds] = useState<number[]>([]);

  const addUsedImageIds = (ids: number[]) => {
    setUsedImageIds(prev => [...prev, ...ids]);
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setTotalMoves(0);
    setUsedImageIds([]);
  };

  return (
    <GameContext.Provider value={{
      currentLevel, setCurrentLevel,
      score, setScore,
      totalMoves, setTotalMoves,
      usedImageIds, addUsedImageIds,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
