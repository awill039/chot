// Import the Opening class
const Opening = require('./opening.js')

// Import the array of general objects representing all the different positions
const l = require('./openings-library.js')

// Import the utility functions
const f = require('./chot-functions.js')
const { type } = require('jquery')

// Initialize the openings library
const library =  f.createLibrary(l)

const game = {
    currentOpening: library[0],
    currentIndex: 0,
    availableIndices: [],
    trainingType: 'quiz',
    openingType: 'e4'
}

// TODO: Needs an onChange function defined and added
let config = {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start'
}

const board = Chessboard('board', config)

$('#guess-form').on('submit', (e) => {
    const guess = f.cleanGuess($('input').first().val())
    let feedback = ''
    
    if (guess === 'begin') {
        feedback = 'Great! Let\'s begin then. Here\'s the first one.'
        f.getNewPosition(game, library)
        board.orientation(game.currentOpening.color)
        board.position(game.currentOpening.position)
    } else if (guess === 'exit') {
        feedback = 'Goodbye!'
        board.clear()
    } else {
        if (game.currentOpening.acceptableNames.includes(guess)) {
            feedback = `Correct! The ${game.currentOpening.title} opening.`
        } else {
            feedback = `"${guess}" was incorrect. This was the ${game.currentOpening.title}. You'll get another crack at this one.`
            game.availableIndices.push(game.currentIndex)
        }
        if (game.availableIndices.length > 0) {
            feedback += ' Here\'s another.'
            f.getNewPosition(game, library)
            board.orientation(game.currentOpening.color)
            board.position(game.currentOpening.position)
        } else {
            feedback += ' Congratulations! You have correctly identified all the openings.'
            board.clear()
        }
    }

    $('#console').text(feedback)
    $('input').first().val('')
    e.preventDefault()
})

$('#training-type').on('change', () => {
    game.trainingType = $('#training-type').val()
    f.initGame(game, library)
    //console.log($('#training-type').val())
})

$('#opening-type').on('change', () => {
    game.openingType = $('#opening-type').val()
    f.initGame(game, library)
})