const Opening = require('./opening.js')

// Creates an array of Opening objects from an array generic objects
exports.createLibrary = (l) => {
    const library = []
    l.forEach((obj) => {
        library.push(new Opening(obj.type, 
                                 obj.title, 
                                 obj.moves, 
                                 obj.positionSteps, 
                                 obj.position, 
                                 obj.color, 
                                 obj.acceptableNames))
    })
    return library
}

exports.getNewPosition = (game, library) => {
    // Pick a random position from the available positions
    const index = Math.floor(Math.random() * game.availableIndices.length)
    game.libraryIndex = game.availableIndices[index]
    game.availableIndices.splice(index, 1)
    game.currentOpening = library[game.libraryIndex]
}

exports.getNewQuiz = (game, library) => {
    exports.getNewPosition(game, library)
    game.board.orientation(game.currentOpening.color)
    game.board.position(game.currentOpening.position)
}

exports.getNewChallenge = (game, library, console={}) => {
    game.gotCorrect = false
    game.moveIndex = 0
    exports.getNewPosition(game, library)
    game.board.position('start')
    game.board.orientation(game.currentOpening.color)
    if (game.currentOpening.color === 'black') {
        game.board.move(game.currentOpening.getMove(game.moveIndex))
    }
    if (console) {
        console.text(`Produce the ${game.currentOpening.title} opening.`)
    }
}

exports.cleanGuess = (guess) => {
    let g = guess.trim().toLowerCase()
    if (g.indexOf('the') === 0) {
        g = g.slice(3).trim()
    }
    return g
}

exports.initGame = (game, library, console={}) => {
    game.availableIndices = []
    library.forEach((opening, index) => {
        if (game.openingType === 'all' || opening.type === game.openingType) {
            game.availableIndices.push(index)
        }
    })
    if (game.trainingType === 'quiz') {
        exports.getNewQuiz(game, library)
    } else if (game.trainingType === 'challenge') {
        exports.getNewChallenge(game, library, console)
    }
}
