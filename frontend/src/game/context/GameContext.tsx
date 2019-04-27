import React from 'react';

export const defaultSettings = {
    pins: 4,
    colours: 6,
    lines: 10,
}

export const GameContext = React.createContext(
    {
        id: "",
        settings: defaultSettings,
    }
);