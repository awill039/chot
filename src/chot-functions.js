const Opening = require('./opening.js')
// Creates an array of Opening objects from an array generic objects
exports.createLibrary = (l) => {
    const library = []
    l.forEach((obj) => {
        library.push(new Opening(obj.type, obj.title, obj.position, obj.color, obj.acceptableNames))
    })
    return library
}

exports.getNewPosition = (game) => {
    // Pick a random position from the available positions
    const index = Math.floor(Math.random() * game.availableIndices.length)
    game.currentIndex = game.availableIndices[index]
    game.availableIndices.splice(index, 1)
}

exports.cleanGuess = (guess) => {
    let g = guess.trim().toLowerCase()
    if (g.indexOf('the') === 0) {
        g = g.slice(3).trim()
    }
    return g
}