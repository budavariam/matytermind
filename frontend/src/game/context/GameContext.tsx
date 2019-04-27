import React from 'react';

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

export const GameContext = React.createContext(
    {
        id: "",
        settings: defaultSettings,
    }
);