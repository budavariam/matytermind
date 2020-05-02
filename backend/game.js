/**
 * @param {number[]} secret
 * @param {number[]} guess
 * @returns {{goodGuess, goodColour, playerWon: boolean}}
 */
function evaluateGuess(config, secret, guess) {
    const goodGuess = secret.reduce(
        (acc, curr, index) => acc + ((curr === guess[index]) ? 1 : 0), 0
    )
    const { guesslist: gcRemainingGuesses, secretHistogram: gcSecretHistogram } = guess
        .map((value, index) => ({ secretP: secret[index], guessP: value }))
        .filter(p => p.guessP != p.secretP)
        .reduce((acc, curr) => {
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
    const playerWon = (goodGuess == config.gameSettings.pins)
    return {
        goodGuess,
        goodColour,
        playerWon,
    }
}

function generateSequence(config) {
    return Array.from({ length: config.gameSettings.pins }, () => Math.floor(Math.random() * config.gameSettings.colours));
}

module.exports = {
    evaluateGuess,
    generateSequence,
}

// evaluateGuess(require("./config"), [2, 2, 2, 1], [1, 2, 1, 1])