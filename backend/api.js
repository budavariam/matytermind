const uuidv1 = require('uuid/v1');

const game = require('./game')
const config = require('./config')

const games = {}

function ping(_, res) {
    res.send('PONG')
}
function debug(_, res) {
    res.send(games)
}

function start (_, res) {
    const id = uuidv1();
    games[id] = {
        secret: game.generateSequence(config),
        guesses: []
    }
    res.send({
        id, 
        settings: config.gameSettings
    })
}

function guess (req, res) {
    if (!req.body || !req.body.guess || !req.body.id) {
        res.status(400).send({message: "Parameters missing from request"})
        return
    }

    const guess = req.body.guess
    const id = req.body.id
    if (!guess.length || guess.some((gue) => !isFinite(gue) || isNaN(gue) || gue > config.gameSettings.colours || gue < 0 )) {
        res.status(400).send({message: "Invalid parameters"})
        return
    }

    const gameInstance = games[id]
    if (!gameInstance) {
        res.status(400).send({message: "Game has not started"})
        return
    }

    const secret = gameInstance.secret
    if (gameInstance.isOver || gameInstance.guesses.length >= config.gameSettings.lines) {
        res.status(400).send({message: "Game has already finished"})
        return
    }

    const {goodGuess, goodColour, isOver} = game.evaluateGuess(config, secret, guess)
    gameInstance.guesses.push({guess, evaluation: {goodGuess, goodColour, isOver}})
    gameInstance.isOver = isOver

    res.send({goodGuess, goodColour, isOver})
}

module.exports = {
    ping,
    start,
    guess,
    debug,
}