/**
 * @param {number[]} secret
 * @param {number[]} guess
 * @returns {{evaluation, isOver: boolean}}
 */
function evaluateGuess(config, secret, guess) {
    // get a map of the secret colours with the count of their elements
    // count by comparison how many good guesses are there by order, decrease their numbers in the map
    // then go through them one more time, and check if the number for that colour is greater than 0
    const goodGuess = secret.reduce(
        (acc, curr, index) => acc + ((curr === guess[index]) ? 1 : 0), 0
    )
    const {guesslist: gcRemainingGuesses, secretHistogram: gcSecretHistogram} = guess
        .map((value, index) => {
            // remove good guesses
            if (secret[index] != value) {
                return { secretP: secret[index], guessP: value }
            }
            return null
        })
        .filter(p => p) // remove null values
        .reduce((acc, curr) => {
            //create histogram from the rest
            acc.secretHistogram[curr.secretP] = acc.secretHistogram[curr.secretP] ? (acc.secretHistogram[curr.secretP] + 1) : 1
            acc.guesslist.push(curr.guessP)
            return acc
        }, {secretHistogram: {}, guesslist: []})
    const goodColour = gcRemainingGuesses.reduce((acc, curr) => {
        if (gcSecretHistogram[curr]) {
            acc++
            gcSecretHistogram[curr]--
        }
        return acc
    }, 0)
    const isOver = (goodGuess == config.gameSettings.pins)
    return {
        goodGuess,
        goodColour,
        isOver,
    }
}

function generateSequence(config) {
    return Array.from({ length: config.gameSettings.pins }, () => Math.floor(Math.random() * config.gameSettings.colours));
}

module.exports = {
    evaluateGuess,
    generateSequence,
}

evaluateGuess(require("./config"), [2, 2, 2, 1], [1, 2, 1, 1])