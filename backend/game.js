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
    const goodColourZip = guess
        .map((value, index) => {
            // remove good guesses
            if (secret[index] != value) {
                return { secretP: secret[index], guessP: value }
            }
            return null
        })
        .filter(p => p) // remove null values
    const goodColorSecretHistogram = goodColourZip.reduce((acc, curr) => {
            //create histogram from the rest
            acc[curr.secretP] = acc[curr.secretP] ? (acc[curr.secretP] + 1) : 1
            return acc
        }, {})
    const goodColour = goodColourZip.reduce((acc, curr) => {
        if (goodColorSecretHistogram[curr.guessP]) {
            acc++
            goodColorSecretHistogram[curr.guessP]--
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