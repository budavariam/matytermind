import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Game } from './game/Game';
import { GameContext, defaultGameContext } from './game/context/GameContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <GameContext.Provider value={defaultGameContext}>
        <Game></Game>
      </GameContext.Provider>
    </div>
  );
}

export default App;
