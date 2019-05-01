const WHITE = 0;
const BLACK = 1;
const oppositeColour = colour => (colour + 1) % 2;
const KINGSIDE = 0;
const QUEENSIDE = 1;
const oppositeSide = side => (side + 1) % 2;
class Pawn {
    constructor(pos, colour, game) {
        this.pos = pos;
        this.colour = colour;
        this.game = game;
    }
    canMove(dest) {
        let board = this.game.board;
        let rowDifference, secondRank;
        if (this.colour === WHITE) {
            rowDifference = dest.row - this.pos.row;
            secondRank = 1;
        } else {
            rowDifference = this.pos.row - dest.row;
            secondRank = 6;
        }
        if (board[dest.row][dest.col] === null) {
            if (dest.col - this.pos.col === 0 &&
                (rowDifference === 1 ||
                 (rowDifference === 2 && this.pos.row === secondRank))) {
                return null;
            }
            if (rowDifference === 1 && Math.abs(dest.col - this.pos.col) === 1 &&
                dest === this.game.enpassantSquare) {
                return board[this.pos.row][dest.col];
            }
            return false;
        }
        if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
            rowDifference === 1 && Math.abs(dest.col - this.pos.col) === 1) {
            return board[dest.row][dest.col];
        }
        return false;
    }
    possibleMoves() {
        let moves = [];
        let board = this.game.board;
        let secondRank, forward;
        if (this.colour === WHITE) {
            if (this.pos.row >= 7) {
                return moves;
            }
            secondRank = 1;
            forward = 1;
        } else {
            if (this.pos.row <= 0) {
                return moves;
            }
            secondRank = 6;
            forward = -1;
        }
        let dest = {row: this.pos.row + forward, col: this.pos.col};
        if (board[dest.row][dest.col] === null) {
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
            if (this.pos.row === secondRank) {
                dest = {row: this.pos.row + 2 * forward, col: this.pos.col};
                if (board[dest.row][dest.col] === null) {
                    if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                        moves.push(dest);
                    }
                }
            }
        }
        if (this.pos.col > 0) {
            dest = {row: this.pos.row + forward, col: this.pos.col - 1};
            if (board[dest.row][dest.col] !== null &&
                board[dest.row][dest.col].colour === oppositeColour(this.colour)) {
                if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
            }
            if (dest === this.game.enpassantSquare) {
                if (!this.game.moveResultsInCheck(this.pos, dest, board[this.pos.row][dest.col])) {
                    moves.push(dest);
                }
            }
        }
        if (this.pos.col < 7) {
            dest = {row: this.pos.row + forward, col: this.pos.col + 1};
            if (board[dest.row][dest.col] !== null &&
                board[dest.row][dest.col].colour === oppositeColour(this.colour)) {
                if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
            }
            if (dest === this.game.enpassantSquare) {
                if (!this.game.moveResultsInCheck(this.pos, dest, board[this.pos.row][dest.col])) {
                    moves.push(dest);
                }
            }
        }
        return moves;
    }
    get canPromote() {
        return (this.colour === WHITE && this.pos.row === 7) ||
            (this.colour === BLACK && this.pos.row === 0);
    }
    get enpassantSquare() {
        let prevRank = this.pos.row + (this.colour === WHITE ? -1 : 1);
        return {row: prevRank, col: this.pos.col};
    }
}
class Knight {
    constructor(pos, colour, game) {
        this.pos = pos;
        this.colour = colour;
        this.game = game;
    }
    canMove(dest) {
        let board = this.game.board;
        if (!((Math.abs(dest.row - this.pos.row) === 1 &&
           Math.abs(dest.col - this.pos.col) === 2) ||
            (Math.abs(dest.row - this.pos.row) === 2 &&
           Math.abs(dest.col - this.pos.col) === 1))) {
            return false;
        }
        return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
    }
    possibleMoves() {
        let moves = [];
        let board = this.game.board;
        let dest;
        if (this.pos.row >= 2 && this.pos.col >= 1) {
            dest = {row: this.pos.row - 2, col: this.pos.col - 1};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        if (this.pos.row >= 1 && this.pos.col >= 2) {
            dest = {row: this.pos.row - 1, col: this.pos.col - 2};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        if (this.pos.row <= 5 && this.pos.col >= 1) {
            dest = {row: this.pos.row + 2, col: this.pos.col - 1};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        if (this.pos.row <= 6 && this.pos.col >= 2) {
            dest = {row: this.pos.row + 1, col: this.pos.col - 2};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        if (this.pos.row >= 2 && this.pos.col <= 6) {
            dest = {row: this.pos.row - 2, col: this.pos.col + 1};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        if (this.pos.row >= 1 && this.pos.col <= 5) {
            dest = {row: this.pos.row - 1, col: this.pos.col + 2};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        if (this.pos.row <= 5 && this.pos.col <= 6) {
            dest = {row: this.pos.row + 2, col: this.pos.col + 1};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        if (this.pos.row <= 6 && this.pos.col <= 5) {
            dest = {row: this.pos.row + 1, col: this.pos.col + 2};
            if ((board[dest.row][dest.col] === null ||
                 board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                 !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        return moves;
    }
}
class Bishop {
    constructor(pos, colour, game) {
        this.pos = pos;
        this.colour = colour;
        this.game = game;
    }
    canMove(dest) {
        let board = this.game.board;
        if (dest.row + dest.col === this.pos.row + this.pos.col) {
            if (dest.row - dest.col < this.pos.col - this.pos.col) {
                for (let i = 1; this.pos.row - i > dest.row; i++) {
                    if (board[this.pos.row - i][this.pos.col + i] !== null) {
                        return false;
                    }
                }
            } else {
                for (let i = 1; this.pos.row + i < dest.row; i++) {
                    if (board[this.pos.row + i][this.pos.col - i] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        } else if (dest.row - dest.col === this.pos.row - this.pos.col) {
            if (dest.row + dest.col < this.pos.col + this.pos.col) {
                for (let i = 1; this.pos.row - i > dest.row; i++) {
                    if (board[this.pos.row - i][this.pos.col - i] !== null) {
                        return false;
                    }
                }
            } else {
                for (let i = 1; this.pos.row + i < dest.row; i++) {
                    if (board[this.pos.row + i][this.pos.col + i] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        }
        return false;
    }
    possibleMoves() {
        let moves = [];
        let board = this.game.board;
        for (let i = 1; this.pos.row - i >= 0 && this.pos.col + i < 8; i++) {
            let dest = {row: this.pos.row - i, col: this.pos.col + i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let i = 1; this.pos.row + i < 8 && this.pos.col - i >= 0; i++) {
            let dest = {row: this.pos.row + i, col: this.pos.col - i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let i = 1; this.pos.row - i >= 0 && this.pos.col - i >= 0; i++) {
            let dest = {row: this.pos.row - i, col: this.pos.col - i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let i = 1; this.pos.row + i < 8 && this.pos.col + i < 8; i++) {
            let dest = {row: this.pos.row + i, col: this.pos.col + i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        return moves;
    }
}
class Rook {
    constructor(pos, colour, side, game) {
        this.pos = pos;
        this.colour = colour;
        this.side = side;
        this.game = game;
    }
    canMove(dest) {
        let board = this.game.board;
        if (dest.row === this.pos.row) {
            if (dest.col < this.pos.col) {
                for (let col = this.pos.col - 1; col > dest.col; col--) {
                    if (board[this.pos.row][col] !== null) {
                        return false;
                    }
                }
            } else {
                for (let col = this.pos.col + 1; col < dest.col; col++) {
                    if (board[this.pos.row][col] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        } else if (dest.col === this.pos.col) {
            if (dest.row < this.pos.row) {
                for (let row = this.pos.row - 1; row > dest.row; row--) {
                    if (board[row][this.pos.col] !== null) {
                        return false;
                    }
                }
            } else {
                for (let row = this.pos.row + 1; row < dest.row; row++) {
                    if (board[row][this.pos.col] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        }
        return false;
    }
    possibleMoves() {
        let moves = [];
        let board = this.game.board;
        for (let col = this.pos.col - 1; col >= 0; col--) {
            let dest = {row: this.pos.row, col: col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let col = this.pos.col + 1; col < 8; col++) {
            let dest = {row: this.pos.row, col: col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let row = this.pos.row - 1; row >= 0; row--) {
            let dest = {row: row, col: this.pos.col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let row = this.pos.row + 1; row < 8; row++) {
            let dest = {row: row, col: this.pos.col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        return moves;
    }
}
class Queen {
    constructor(pos, colour, game) {
        this.pos = pos;
        this.colour = colour;
        this.game = game;
    }
    canMove(dest) {
        let board = this.game.board;
        if (dest.row == this.pos.row) {
            if (dest.col < this.pos.col) {
                for (let col = this.pos.col - 1; col > dest.col; col--) {
                    if (board[this.pos.row][col] !== null) {
                        return false;
                    }
                }
            } else {
                for (let col = this.pos.col + 1; col < dest.col; col++) {
                    if (board[this.pos.row][col] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        } else if (dest.col === this.pos.col) {
            if (dest.row < this.pos.row) {
                for (let row = this.pos.row - 1; row > dest.row; row--) {
                    if (board[row][this.pos.col] !== null) {
                        return false;
                    }
                }
            } else {
                for (let row = this.pos.row + 1; row < dest.row; row++) {
                    if (board[row][this.pos.col] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        } if (dest.row + dest.col === this.pos.row + this.pos.col) {
            if (dest.row - dest.col < this.pos.col - this.pos.col) {
                for (let i = 1; this.pos.row - i > dest.row; i++) {
                    if (board[this.pos.row - i][this.pos.col + i] !== null) {
                        return false;
                    }
                }
            } else {
                for (let i = 1; this.pos.row + i < dest.row; i++) {
                    if (board[this.pos.row + i][this.pos.col - i] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        } else if (dest.row - dest.col === this.pos.row - this.pos.col) {
            if (dest.row + dest.col < this.pos.col + this.pos.col) {
                for (let i = 1; this.pos.row - i > dest.row; i++) {
                    if (board[this.pos.row - i][this.pos.col - i] !== null) {
                        return false;
                    }
                }
            } else {
                for (let i = 1; this.pos.row + i < dest.row; i++) {
                    if (board[this.pos.row + i][this.pos.col + i] !== null) {
                        return false;
                    }
                }
            }
            return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
        }
        return false;
    }
    possibleMoves() {
        let moves = [];
        let board = this.game.board;
        for (let col = this.pos.col - 1; col >= 0; col--) {
            let dest = {row: this.pos.row, col: col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let col = this.pos.col + 1; col < 8; col++) {
            let dest = {row: this.pos.row, col: col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let row = this.pos.row - 1; row >= 0; row--) {
            let dest = {row: row, col: this.pos.col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let row = this.pos.row + 1; row < 8; row++) {
            let dest = {row: row, col: this.pos.col};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let i = 1; this.pos.row - i >= 0 && this.pos.col + i < 8; i++) {
            let dest = {row: this.pos.row - i, col: this.pos.col + i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let i = 1; this.pos.row + i < 8 && this.pos.col - i >= 0; i++) {
            let dest = {row: this.pos.row + i, col: this.pos.col - i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let i = 1; this.pos.row - i >= 0 && this.pos.col - i >= 0; i++) {
            let dest = {row: this.pos.row - i, col: this.pos.col - i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        for (let i = 1; this.pos.row + i < 8 && this.pos.col + i < 8; i++) {
            let dest = {row: this.pos.row + i, col: this.pos.col + i};
            if (board[dest.row][dest.col] !== null) {
                if (board[dest.row][dest.col].colour === oppositeColour(this.colour) &&
                   !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                    moves.push(dest);
                }
                break;
            }
            if (!this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                moves.push(dest);
            }
        }
        return moves;
    }
}
class King {
    constructor(pos, colour, game) {
        this.pos = pos;
        this.colour = colour;
        this.game = game;
    }
    inCheck() {
        for (let piece of this.game.pieces[oppositeColour(this.colour)]) {
            if (piece.canMove(this.pos)) {
                return true;
            }
        }
        return false;
    }
    canMove(dest) {
        let board = this.game.board;
        if (Math.abs(dest.row - this.pos.row) > 1 ||
            Math.abs(dest.col - this.pos.col) > 1) {
            return false;
        }
        return this.game.pieceIfNotDiffColour(dest, oppositeColour(this.colour));
    }
    possibleMoves() {
        let moves = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let dest = {row: this.pos.row + i, col: this.pos.col + j};
                if (dest.row >= 0 && dest.row < 8 &&
                    dest.col >= 0 && dest.col < 8) {
                    let board = this.game.board;
                    if ((board[dest.row][dest.col] === null ||
                        board[dest.row][dest.col].colour === oppositeColour(this.colour)) &&
                        !this.game.moveResultsInCheck(this.pos, dest, board[dest.row][dest.col])) {
                        moves.push(dest);
                    }
                }
            }
        }

        if (this.game.canCastle(this.colour, KINGSIDE)) {
            moves.push(KINGSIDE);
        }
        if (this.game.canCastle(this.colour, QUEENSIDE)) {
            moves.push(QUEENSIDE);
        }

        return moves;
    }
}
class InvalidMoveError extends Error {}
class Game {
    constructor() {
        this.pieces = [[], []];
        this.pieces[WHITE].push(new Pawn({row: 1, col: 0}, WHITE, this));
        this.pieces[WHITE].push(new Pawn({row: 1, col: 1}, WHITE, this));
        this.pieces[WHITE].push(new Pawn({row: 1, col: 2}, WHITE, this));
        this.pieces[WHITE].push(new Pawn({row: 1, col: 3}, WHITE, this));
        this.pieces[WHITE].push(new Pawn({row: 1, col: 4}, WHITE, this));
        this.pieces[WHITE].push(new Pawn({row: 1, col: 5}, WHITE, this));
        this.pieces[WHITE].push(new Pawn({row: 1, col: 6}, WHITE, this));
        this.pieces[WHITE].push(new Pawn({row: 1, col: 7}, WHITE, this));
        this.pieces[WHITE].push(new Bishop({row: 0, col: 2}, WHITE, this));
        this.pieces[WHITE].push(new Bishop({row: 0, col: 5}, WHITE, this));
        this.pieces[WHITE].push(new Knight({row: 0, col: 1}, WHITE, this));
        this.pieces[WHITE].push(new Knight({row: 0, col: 6}, WHITE, this));
        this.pieces[WHITE].push(new Rook({row: 0, col: 0}, WHITE, QUEENSIDE, this));
        this.pieces[WHITE].push(new Rook({row: 0, col: 7}, WHITE, KINGSIDE, this));
        this.pieces[WHITE].push(new Queen({row: 0, col: 3}, WHITE, this));
        this.pieces[WHITE].push(new King({row: 0, col: 4}, WHITE, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 0}, BLACK, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 1}, BLACK, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 2}, BLACK, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 3}, BLACK, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 4}, BLACK, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 5}, BLACK, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 6}, BLACK, this));
        this.pieces[BLACK].push(new Pawn({row: 6, col: 7}, BLACK, this));
        this.pieces[BLACK].push(new Bishop({row: 7, col: 2}, BLACK, this));
        this.pieces[BLACK].push(new Bishop({row: 7, col: 5}, BLACK, this));
        this.pieces[BLACK].push(new Knight({row: 7, col: 1}, BLACK, this));
        this.pieces[BLACK].push(new Knight({row: 7, col: 6}, BLACK, this));
        this.pieces[BLACK].push(new Rook({row: 7, col: 0}, BLACK, QUEENSIDE, this));
        this.pieces[BLACK].push(new Rook({row: 7, col: 7}, BLACK, KINGSIDE, this));
        this.pieces[BLACK].push(new Queen({row: 7, col: 3}, BLACK, this));
        this.pieces[BLACK].push(new King({row: 7, col: 4}, BLACK, this));
        this.board = new Array();
        for (let i = 0; i < 8; i++) {
            this.board.push(new Array(8).fill(null));
        }
        for (let side of this.pieces) {
            for (let piece of side) {
                this.board[piece.pos.row][piece.pos.col] = piece;
            }
        }
        this.castlingRights = [[true, true], [true, true]];
        this.enpassantSquare = null;
        this.moves = new Array();
        this.movesSinceCapt = 0;
        this.sideToMove = WHITE;
        this.transpositionTable = [];
        this.transpositionTable[this.generateFEN()] = 1;
    }
    moveToString(move) {
        if (move === QUEENSIDE) {
            return "0-0-0";
        }
        if (move === KINGSIDE) {
            return "0-0";
        }
        return String.fromCharCode("a".charCodeAt() + move.from.col) + (move.from.row + 1) + "-" +
            String.fromCharCode("a".charCodeAt() + move.to.col) + (move.to.row + 1);
    }
    printMoves() {
        let halfMoves = 0;
        let moveString = "";
        for (let move of this.moves) {
            moveString += this.moveToString(move);
            halfMoves++;
            if (halfMoves % 2 === 0) {
                console.log(moveString);
                moveString = "";
            } else {
                moveString += " ";
            }
        }
        console.log(moveString);
    }
    pieceIfNotDiffColour(pos, colour) {
        let piece = this.board[pos.row][pos.col];
        if(piece === null || piece.colour === colour) {
            return piece;
        }
        return false;
    }
    move(from, to, piece, capturedPiece) {
        if (capturedPiece !== null) {
            let colour = capturedPiece.colour;
            this.pieces[colour] = this.pieces[colour].filter(p => p !== capturedPiece);
            this.board[capturedPiece.pos.row][capturedPiece.pos.col] = null;
        }
        this.board[to.row][to.col] = piece;
        piece.pos = to;
        this.board[from.row][from.col] = null;
    }
    revertMove(from, to, piece, capturedPiece) {
        this.board[to.row][to.col] = null;
        if (capturedPiece !== null) {
            this.board[capturedPiece.pos.row][capturedPiece.pos.col] = capturedPiece;
            this.pieces[capturedPiece.colour].push(capturedPiece);
        }
        this.board[from.row][from.col] = piece;
        piece.pos = from;
    }
    isCheck(colour) {
        let pieces = this.pieces[colour];
        let king = pieces.find(piece => piece instanceof King);
        return king.inCheck();
    }
    isMate(colour) {
        return !this.pieces[colour].some(p => p.possibleMoves().length > 0) &&
            this.isCheck(colour);
    }
    isStalemate(colour) {
        return !this.pieces[colour].some(p => p.possibleMoves().length > 0) &&
            !this.isCheck(colour);
    }
    isRepetition() {
        return this.transpositionTable[this.generateFEN()] >= 3;
    }
    canMate(colour) {
        let bishops = 0;
        let knights = 0;
        for (let piece of this.pieces[colour]) {
            if (piece instanceof Queen || piece instanceof Rook || piece instanceof Pawn) {
                return true;
            }
            if (piece instanceof Bishop) {
                if (bishops > 0 || knights > 0) {
                    return true;
                }
                bishops++;
            }
            if (piece instanceof Knight) {
                if (bishops > 0) {
                    return true;
                }
                knights++;
            }
        }
        return false;
    }
    isInsufficientMaterial() {
        return !this.canMate(WHITE) && !this.canMate(BLACK);
    }
    promote(pawn) {
        this.pieces[pawn.colour] = this.pieces[pawn.colour].filter(p => p !== pawn);
        let queen = new Queen(pawn.pos, pawn.colour, this);
        this.pieces[queen.colour].push(queen);
        this.board[queen.pos.row][queen.pos.col] = queen;
    }
    moveResultsInCheck(from, to, capturedPiece) {
        let piece = this.board[from.row][from.col];
        this.move(from, to, piece, capturedPiece);
        let isAttacked = this.isCheck(piece.colour);
        this.revertMove(from, to, piece, capturedPiece);
        return isAttacked;
    }
    canCastle(colour, side) {
        let king = this.pieces[colour].find(piece => piece instanceof King);
        let rook, rookDest, kingDest;
        if (side === QUEENSIDE) {
            rook = this.pieces[colour].find(piece => piece instanceof Rook &&
                                            piece.pos.row === king.pos.row &&
                                            piece.pos.col === king.pos.col - 4);
            rookDest = {row: king.pos.row, col: king.pos.col - 1};
            kingDest = {row: king.pos.row, col: king.pos.col - 2};
        } else {
            rook = this.pieces[colour].find(piece => piece instanceof Rook &&
                                            piece.pos.row === king.pos.row &&
                                            piece.pos.col === king.pos.col + 3);
            rookDest = {row: king.pos.row, col: king.pos.col + 1};
            kingDest = {row: king.pos.row, col: king.pos.col + 2};
        }
        if (this.castlingRights[colour][side] && !king.inCheck()) {
            let col = king.pos.col + Math.sign(rook.pos.col - king.pos.col);
            for ( ; col !== rook.pos.col; col += Math.sign(rook.pos.col - king.pos.col)) {
                if(this.board[king.pos.row][col] !== null) {
                    return false;
                }
            }
            if (!this.moveResultsInCheck(king.pos, rookDest, null) &&
                !this.moveResultsInCheck(king.pos, kingDest, null)) {
                return true;
            }
        }
        return false;
    }
    tryCastle(colour, side) {
        if (colour !== this.sideToMove) {
            throw new InvalidMoveError("Illegal move! Not your turn!");
        }
        let king = this.pieces[colour].find(piece => piece instanceof King);
        let rook, rookDest, kingDest;
        if (side === QUEENSIDE) {
            rook = this.pieces[colour].find(piece => piece instanceof Rook &&
                                            piece.pos.row === king.pos.row &&
                                            piece.pos.col === king.pos.col - 4);
            rookDest = {row: king.pos.row, col: king.pos.col - 1};
            kingDest = {row: king.pos.row, col: king.pos.col - 2};
        } else {
            rook = this.pieces[colour].find(piece => piece instanceof Rook &&
                                            piece.pos.row === king.pos.row &&
                                            piece.pos.col === king.pos.col + 3);
            rookDest = {row: king.pos.row, col: king.pos.col + 1};
            kingDest = {row: king.pos.row, col: king.pos.col + 2};
        }
        if (this.castlingRights[colour][side] && !king.inCheck()) {
            let col = king.pos.col + Math.sign(rook.pos.col - king.pos.col);
            for ( ; col !== rook.pos.col; col += Math.sign(rook.pos.col - king.pos.col)) {
                if(this.board[king.pos.row][col] !== null) {
                    console.log(this.board[king.pos.row][col]);
                    throw new InvalidMoveError("Illegal move! Cannot castle!");
                }
            }
            if (this.moveResultsInCheck(king.pos, rookDest, null) ||
                this.moveResultsInCheck(king.pos, kingDest, null)) {
                throw new InvalidMoveError("Illegal move! Cannot castle!");
            }
            this.move(king.pos, kingDest, king, null);
            this.move(rook.pos, rookDest, rook, null);
            this.enpassantSquare = null;
            this.movesSinceCapt++;
            this.moves.push(side);
            this.sideToMove = oppositeColour(this.sideToMove);
            this.castlingRights[colour][KINGSIDE] = false;
            this.castlingRights[colour][QUEENSIDE] = false;
            let FEN = this.generateFEN();
            if (this.transpositionTable.hasOwnProperty(FEN)) {
                this.transpositionTable[FEN]++;
            } else {
                this.transpositionTable[FEN] = 1;
            }
        } else {
            throw new InvalidMoveError("Illegal move! Cannot castle!");
        }
    }
    tryMove(from, to) {
        let piece = this.board[from.row][from.col];
        if (!piece) {
            throw new InvalidMoveError("Illegal move! No piece selected!");
        }
        if (piece.colour !== this.sideToMove) {
            throw new InvalidMoveError("Illegal move! Not your turn!");
        }
        let capturedPiece = piece.canMove(to);
        if (capturedPiece !== false) {
            this.move(from, to, piece, capturedPiece);
            if (this.isCheck(piece.colour)) {
                this.revertMove(from, to, piece, capturedPiece);
                throw new InvalidMoveError("Illegal move! Move results in check!");
            } else {
                this.enpassantSquare = null;
                if (piece instanceof Pawn && Math.abs(to.row - from.row) === 2) {
                    this.enpassantSquare = piece.enpassantSquare;
                }
                if (piece["canPromote"]) {
                    this.promote(piece);
                }
                if (piece instanceof Pawn || capturedPiece !== null) {
                    this.movesSinceCapt = 0;
                } else {
                    this.movesSinceCapt++;
                }
                if (piece instanceof King) {
                    this.castlingRights[piece.colour][KINGSIDE] = false;
                    this.castlingRights[piece.colour][QUEENSIDE] = false;
                } else if (piece instanceof Rook) {
                    this.castlingRights[piece.colour][piece.side] = false;
                }
                if (capturedPiece instanceof Rook) {
                    this.castlingRights[capturedPiece.colour][piece.side] = false;
                }
                this.moves.push({from: from, to: to});
                this.sideToMove = oppositeColour(this.sideToMove);
                let FEN = this.generateFEN();
                if (this.transpositionTable.hasOwnProperty(FEN)) {
                    this.transpositionTable[FEN]++;
                } else {
                    this.transpositionTable[FEN] = 1;
                }
            }
        } else {
            throw new InvalidMoveError("Illegal Move! Piece cannot move to specified destination!");
        }
    }
    generateFEN() {
        let FEN = "";
        for (let i = this.board.length - 1; i >= 0; i--) {
            let emptySquares = 0;
            for (let cell of this.board[i]) {
                if (cell === null) {
                    emptySquares++;
                } else {
                    if (emptySquares > 0) {
                        FEN += emptySquares;
                        emptySquares = 0;
                    }
                    if (cell.colour === WHITE) {
                        FEN += (cell instanceof Knight ? "N" : cell.constructor.name[0]);
                    } else {
                        FEN += (cell instanceof Knight ? "N" : cell.constructor.name[0]).toLowerCase();
                    }
                }
            }
            if (emptySquares > 0) {
                FEN += emptySquares;
            }
            FEN += "/";
        }
        FEN += (` ${(this.sideToMove === WHITE ? "w" : "b")} `);
        let canCastle = false;
        if (this.castlingRights[WHITE][KINGSIDE]) {
            FEN += "K";
            canCastle = true;
        }
        if (this.castlingRights[WHITE][QUEENSIDE]) {
            FEN += "Q";
            canCastle = true;
        }
        if (this.castlingRights[BLACK][KINGSIDE]) {
            FEN += "k";
            canCastle = true;
        }
        if (this.castlingRights[BLACK][QUEENSIDE]) {
            FEN += "q";
            canCastle = true;
        }
        if (!canCastle) {
            FEN += "-";
        }
        let enpassantSquare = (this.enpassantSquare === null ? "-" :
                               String.fromCharCode("a".charCodeAt() + this.enpassantSquare.col) +
                               (this.enpassantSquare.row + 1));
        FEN += (` ${enpassantSquare}`);
        return FEN;
    }
    get fiftyMoveDraw() {
        return this.movesSinceCapt === 50;
    }
}
