import React from 'react';
import './App.scss';
import { Game } from './game/Game';
import { GameContext, defaultGameContext } from './game/context/GameContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <GameContext.Provider value={defaultGameContext}>
        <Game />
      </GameContext.Provider>
    </div>
  );
}

export default App;
