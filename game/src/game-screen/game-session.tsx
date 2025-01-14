import React, { useEffect, useState } from 'react';
import { GameIndex, GameInstance } from './game-instance';
import { Language } from '../language';
import Game, { GameReport } from './game';
import './game-session.scss';
import { Difficulty } from '../difficulty';

const JSONHeader = { headers : {  'Content-Type': 'application/json', 'Accept': 'application/json' } };

export interface GameSessionProps {
  difficulty: Difficulty;
  language: Language;
}

const GameSession = ({ difficulty, language } : GameSessionProps) => {
  const [accScore, setAccScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [gameInstance, setGameInstance] = useState<GameInstance | undefined>(undefined);

  const getGame = () => {
    // Fetch from the index file for the desired language
    fetch(`dict/${language}/index.json`, JSONHeader)
    // Convert response as a GameIndex object
    .then((resp: Response)     => resp.json())
    // Randomly choose an index
    .then((data: GameIndex)    => Math.round(Math.random() * (data.instances-1)))
    // Fetch specific game based on language and index
    .then((gameIdx: number)    => fetch(`dict/${language}/${gameIdx}.json`, JSONHeader))
    // Convert response to GameInstance object
    .then((resp: Response)     => resp.json())
    // Set gameInstance
    .then((data: GameInstance) => setGameInstance(data));
  }

  useEffect(getGame, [language]);

  const getNextGame = (previousGame: GameReport) => {
    setGameInstance(undefined);
    setRound(previousGame.qualified ? round+1 : 1);
    setAccScore(previousGame.qualified ? accScore + previousGame.score : 0);
    getGame();
  }

  return (
      <>
      { gameInstance &&
        <div className="GameSession">
          <Game instance={gameInstance}
                difficulty={difficulty}
                language={language}
                accScore={accScore}
                round={round}
                onRequestNextGame={getNextGame} />
        </div>
      }
      </>
  );
}

export default GameSession;
