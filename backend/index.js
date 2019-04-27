const express = require('express')
const uuidv1 = require('uuid/v1');

const game = require('./game')
const config = require('./config')
const app = express()

const games = {}

app.get('/ping', (_, res) => res.send('PONG'))

app.get('/start', (_, res) => {
    const id = uuidv1();
    games[id] = {
        secret: game.generateSequence(config),
        guesses: []
    }
    res.send({id})
})

app.post('/guess', (req, res) => {
    if (!req.body.guess || !req.body.id) {
        res.status(400).send({message: "Parameters missing from request"})
        return
    }

    const guess = req.body.guess
    const id = req.body.id
    if (!guess.length || guess.some((gue) => !isFinite(gue) || isNaN(gue) || gue > colours || gue < 0 )) {
        res.status(400).send({message: "Invalid parameters"})
        return
    }

    const gameInstance = games[id]
    if (!gameInstance) {
        res.status(400).send({message: "Game has not started"})
        return
    }

    const secret = gameInstance.secret
    if (gameInstance.isOver || gameInstance.guesses.length >= config.lines) {
        res.status(400).send({message: "Game has already finished"})
        return
    }

    const {evaluation, isOver} = game.evaluateGuess(config, secret, guess)
    gameInstance.guesses.push({guess, evaluation})
    gameInstance.isOver = isOver

    res.send({evaluation, isOver})
})

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))