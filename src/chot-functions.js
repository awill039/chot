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
    game.currentIndex = game.availableIndices[index]
    game.availableIndices.splice(index, 1)
    game.currentOpening = library[game.currentIndex]
}

exports.cleanGuess = (guess) => {
    let g = guess.trim().toLowerCase()
    if (g.indexOf('the') === 0) {
        g = g.slice(3).trim()
    }
    return g
}

exports.initGame = (game, library) => {
    // Perhaps I should be building an array of indices that point to the correct type
    game.availableIndices = []
    library.forEach((opening, index) => {
        if (opening.type === game.openingType) {
            game.availableIndices.push(index)
        }
    })
    exports.getNewPosition(game, library)
}
