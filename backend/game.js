/**
 * @param {number[]} secret
 * @param {number[]} guess
 * @returns {{evaluation, isOver: boolean}}
 */
function evaluateGuess(config, secret, guess) {
    // get a map of the secret colours with the count of their elements
    // count by comparison how many good guesses are there by order, decrease their numbers in the map
    // then go through them one more time, and check if the number for that colour is greater than 0

    const secretMap = secret.reduce((acc, curr) => {
        acc[curr] = acc[curr] ? acc[curr] + 1 : 1
        return acc
    }, {})
    const goodGuess = secret.reduce(
        (acc, curr, index) => acc + ((curr == guess[index]) ? 1 : 0), 0
    )
    guess.forEach((value, index) => {
        if (secret[index] == value && secretMap[value]) {
            secretMap[value] = secretMap[value] - 1
        }
    })
    const goodColour = guess.reduce((acc, curr) => {
        if (secretMap[curr]) {
            acc++
            secretMap[curr]--
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
    return Array.from({length: config.gameSettings.pins}, () => Math.floor(Math.random() * config.gameSettings.colours));
}

module.exports = {
    evaluateGuess,
    generateSequence,
}

evaluateGuess(require("./config"), [1,2,3,4], [1,2,3,4])