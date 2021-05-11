// Import the Opening class
const Opening = require('./opening.js')

// Import the array of general objects representing all the different positions
const l = require('./openings-library.js')

// Import the utility functions
const f = require('./chot-functions.js')

// Initialize the openings library
const library =  f.createLibrary(l)

// A way to get a range in array form. Adapted from 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
const initialIndices = Array.from({length: library.length}, (_, i) => i)

const game = {
    currentOpening: library[0],
    currentIndex: null,
    availableIndices: initialIndices
}

let config = {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start'
}

const board = Chessboard('board', config)

// I like this with forms better since you can hit return key
$('#guess-form').on('submit', (e) => {
    const guess = f.cleanGuess($('input').first().val())
    let feedback = ''
    
    if (guess === 'begin') {
        feedback = 'Great! Let\'s begin then. Here\'s the first one.'
        f.getNewPosition(game)
        game.currentOpening = library[game.currentIndex]
        board.position(game.currentOpening.position)
    } else if (guess === 'exit') {
        feedback = 'Goodbye!'
        board.clear()
    } else {
        if (game.currentOpening.acceptableNames.includes(guess)) {
            feedback = `Correct! The ${game.currentOpening.title} opening.`
            //$('#console').text('Correct! Opening removed from the quiz. Here\'s another.')
        } else {
            feedback = `"${guess}" was incorrect. This was the ${game.currentOpening.title}. You'll get another crack at this one.`
            //$('#console').text('Incorrect. Opening will in the quiz. Here\'s another.')
            game.availableIndices.push(game.currentIndex)
        }
        if (game.availableIndices.length > 0) {
            feedback += ' Here\'s another.'
            f.getNewPosition(game)
            game.currentOpening = library[game.currentIndex]
            board.position(game.currentOpening.position)
        } else {
            feedback += ' Congratulations! You have correctly identified all the openings.'
            board.clear()
        }
    }

    //console.log(game)
    $('#console').text(feedback)
    $('input').first().val('')
    e.preventDefault()
})