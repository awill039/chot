// Import the Opening class
const Opening = require('./opening.js')

// Import the array of general objects representing all the different positions
const l = require('./openings-library.js')

// Import the utility functions
const f = require('./chot-functions.js')
const { type } = require('jquery')

// Initialize the openings library
const library =  f.createLibrary(l)

function onDrop (source, target, piece, newPos, oldPos, orientation) {
    let feedback = ''
    console.log(newPos)
    const userCorrect = game.currentOpening.checkPosition(game.moveIndex, Chessboard.objToFen(newPos))
    const atEndOfChallenge = game.moveIndex >= game.currentOpening.positionSteps.length - 1
    const isBlack = game.currentOpening.color === 'black'
    const move = isBlack ? game.currentOpening.getMove(game.moveIndex+1) : game.currentOpening.getMove(game.moveIndex)

    if (userCorrect) {
        feedback += 'Correct. '
        if (move !== -1) {
            feedback += 'Here\'s the response. '
            game.board.move(move)
        }
        if (atEndOfChallenge) {
            feedback += 'Congrats! That\'s the last move in the opening. '
            game.gotCorrect = true
            if (game.availableIndices.length === 0) {
                feedback += 'You\'ve done ALL the openings. Select a game mode or new opening type to continue.'
                $('#console').text(feedback)
                game.board.clear()
                return 'snapback'
            } else {
                feedback += 'Hit next for another. '
            }
        } else {
            game.moveIndex++
        }
    } else { // The player move was incorrect or the move exceeded the position
        $('#console').text('That move was not part of the opening. The final position should look like this. Hit next for another challenge.')
        game.board.position(game.currentOpening.position)
        return 'snapback'
    }
    $('#console').text(feedback)
}

let config = {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start',
    onDrop: onDrop
}

const board = Chessboard('board', config)

const game = {
    currentOpening: library[0],
    libraryIndex: 0,
    moveIndex: 0,
    gotCorrect: false,
    availableIndices: [],
    trainingType: 'quiz',
    openingType: 'e4',
    board: board
}

// Handles the game flow for the quiz game type.
// The game.gotCorrect logic is not necessary since this handler takes care of that functionality.
$('#guess-form').on('submit', (e) => {
    const guess = f.cleanGuess($('input').first().val())
    let feedback = ''
    
    try {
        if (guess === 'begin') {
            feedback = 'Great! Let\'s begin then. Here\'s the first one.'
            f.initGame(game, library, $('#console'))
        } else if (guess === 'exit') {
            feedback = 'Goodbye!'
            game.board.clear()
        } else {
            if (game.currentOpening.acceptableNames.includes(guess)) {
                feedback = `Correct! The ${game.currentOpening.title} opening.`
            } else {
                feedback = `"${guess}" was incorrect. This was the ${game.currentOpening.title}. You'll get another crack at this one.`
                game.availableIndices.push(game.libraryIndex)
            }
            if (game.availableIndices.length > 0) {
                feedback += ' Here\'s another.'
                f.getNewQuiz(game, library)
            } else {
                feedback += ' Congratulations! You have correctly identified all the openings.'
                game.board.clear()
            }
        }
    } catch (e) {
        console.log(e)
        console.log(game)
    }

    $('#console').text(feedback)
    $('input').first().val('')
    e.preventDefault()
})

$('#training-type').on('change', () => {
    const type = $('#training-type').val()
    game.trainingType = type
    $('#console').text(`Opening ${type} selected with '${$('#opening-type').val()}' as the type.`)
    f.initGame(game, library, $('#console'))
})

$('#opening-type').on('change', () => {
    const type = $('#opening-type').val()
    game.openingType = type
    $('#console').text(`Opening ${$('#training-type').val()} selected with '${type}' as the type.`)
    f.initGame(game, library, $('#console'))
})

$('#next').on('click', (e) => {
    if (!game.gotCorrect) {
        game.availableIndices.push(game.libraryIndex)
    }
    if (game.trainingType === 'quiz') {
        f.getNewQuiz(game, library)
    } else if (game.trainingType === 'challenge') {
        f.getNewChallenge(game, library, $('#console'))
    }
    e.preventDefault()
})
