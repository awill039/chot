// The Opening class contains the following data:
// ----- title: a string representing the name of the position
// ----- position: a FEN string representing the position itself
// ----- color: a string either 'white' or 'black' representing the last side to move
//        (color may be redundent since the FEN string already contains whose turn is next)
class Opening {
    constructor (type, title, moves, positionSteps, position, color, acceptableNames) {
        this.type = type
        this.title = title
        this.moves = moves
        this.positionSteps = positionSteps
        this.position = position
        this.color = color
        this.acceptableNames = acceptableNames
        this.acceptableNames.push(this.title.toLowerCase())
    }
    checkPosition(index, position) {
        if (index >= this.positionSteps.length) {
            return false
        } else {
            const p = this.positionSteps[index].split(' ')[0]
            return p === position
        }
    }
    getMove(index) {
        const move = this.moves[index]
        if (move) {
            return move
        } else {
            return -1
        }
    }
}

module.exports = Opening