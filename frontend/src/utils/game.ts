import { GameSettings } from "../game/types"

interface Accumulator {
    secretHistogram: { [key: string]: number };
    guesslist: number[];
}

export function evaluateGuess(gameSettings: GameSettings, secret: number[], guess: number[]): { goodGuess: number, goodColour: number, playerWon: boolean } {
    const goodGuess = secret.reduce(
        (acc, curr, index) => acc + ((curr === guess[index]) ? 1 : 0), 0
    )
    const { guesslist: gcRemainingGuesses, secretHistogram: gcSecretHistogram } = guess
        .map((value, index) => ({ secretP: secret[index], guessP: value }))
        .filter(p => p.guessP !== p.secretP)
        .reduce<Accumulator>((acc, curr) => {
            acc.secretHistogram[curr.secretP] = acc.secretHistogram[curr.secretP] ? (acc.secretHistogram[curr.secretP] + 1) : 1
            acc.guesslist.push(curr.guessP)
            return acc
        }, { secretHistogram: {}, guesslist: [] })
    const goodColour = gcRemainingGuesses.reduce((acc, curr) => {
        if (gcSecretHistogram[curr]) {
            acc++
            gcSecretHistogram[curr]--
        }
        return acc
    }, 0)
    const playerWon = (goodGuess === gameSettings.pins)
    return {
        goodGuess,
        goodColour,
        playerWon,
    }
}

export function generateSequence(gameSettings: GameSettings) {
    return Array.from({ length: gameSettings.pins }, () => Math.floor(Math.random() * gameSettings.colours));
}