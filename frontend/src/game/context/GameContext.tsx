import React from 'react';
import { GameContextType } from '../types';

export const defaultSettings = {
    pins: 4,
    colours: 6,
    lines: 10,
}

export const NEUTRALHUGEPIN = -1;
export const NEUTRALSMALLPIN = 0;
export const GOODGUESSPINID = 1;
export const GOODCOLOURPINID = 2;

export const emptyGuess = Array.from({length: defaultSettings.pins}, () => NEUTRALHUGEPIN)

export const defaultGameContext: GameContextType = {
    id: "",
    settings: defaultSettings,
    actualGuess: emptyGuess,
    actualLine: 0,
    changeGuess: (guess: number[]) => {
        defaultGameContext.actualGuess = guess
    },
    nextLine: () => {
        defaultGameContext.actualLine++
    },
    setId: (id: string) => {
        defaultGameContext.id = id;
    }
}

export const GameContext = React.createContext(defaultGameContext);