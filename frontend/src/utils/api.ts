import { generateSequence, evaluateGuess } from "./game"
import { GameSettings } from "../game/types"

type GameGuess = {
    guess: number[],
    evaluation: { goodGuess: number, goodColour: number, playerWon: boolean }
}

type GameState = {
    "local": {
        guesses: GameGuess[],
        secret: number[],
        isOver: boolean,
    }
}

const games: GameState = {
    "local": {
        secret: [-1, -1, -1, -1],
        guesses: [],
        isOver: false,
    }
}

const gameSettings: GameSettings = {
    colours: 6,
    pins: 4,
    lines: 10,
}

function start() {
    const id = "local"
    games[id] = {
        secret: generateSequence(gameSettings),
        guesses: [],
        isOver: false
    }
    // console.log(id, games[id].secret)
    return Promise.resolve({
        id,
        settings: gameSettings
    })
}



function guess(guess: number[]) {
    const id = "local"
    if (!guess.length || guess.some((gue) => !isFinite(gue) || isNaN(gue) || gue > gameSettings.colours || gue < 0)) {
        throw new Error("Invalid parameters")
    }

    const gameInstance = games[id]
    if (!gameInstance) {
        throw new Error("Game has not started")
    }

    const secret = gameInstance.secret
    if (gameInstance.isOver) {
        throw new Error("Game has already finished")
    }

    const { goodGuess, goodColour, playerWon } = evaluateGuess(gameSettings, secret, guess)

    gameInstance.guesses.push({ guess, evaluation: { goodGuess, goodColour, playerWon } })
    const noMoreLines = gameInstance.guesses.length >= gameSettings.lines
    gameInstance.isOver = playerWon || noMoreLines

    //console.log(id, games[id].secret, guess, goodGuess, goodColour, playerWon)

    const response = {
        goodGuess, goodColour, playerWon,
        solution: gameInstance.isOver ? secret : undefined
    }
    return Promise.resolve(response)
}

export {
    start, guess
}