<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <!-- Required meta tags always come first -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="Styles/styles.css">
    <title></title>
  </head>
  <body>
    <div class="container-fluid">
      <div class="row">
        <table class="table table-bordered col-12 col-md-8 col-lg-4" id="board"></table>
      </div>
      <span id="result"></span>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
    integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
    integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="ChessLogic.js"></script>
    <script>
    function setupBoardGUI() {
      let board = '';
      for (let i = 7; i >= 0; i--) {
        board += '<tr class="d-flex">';
        for (let j = 0; j < 8; j++) {
          board += `<td class="square" data-row="${i}" data-col="${j}" onclick="squareClicked(this)"></td>`;
        }
        board += "</tr>";
      }
      $('#board').html(board);
      $('.square').each(function(){
        $(this).css("height", $(this).css("width"));
      });
    }
    function updateBoardGUI(game) {
      game.print();
      for (let i = game.board.length - 1; i >= 0; i--) {
        for (let j = 0; j < game.board.length; j++) {
          let cell = game.board[i][j];
          let square = $(`[data-row='${i}'][data-col='${j}']`);
          square.empty();
          if (cell !== null) {
            let piece = `<div class="piece ${(cell.colour === WHITE ? "white" : "black")} ${cell.constructor.name}"></div>`
            square.append(piece);
          }
        }
      }
    }
    let origin = null;
    function squareClicked(identifier) {
      let row = $(identifier).data('row');
      let col = $(identifier).data('col');
      if (origin !== null) {
        executeMove({from: origin, to: {row: row, col: col}});
        origin = null;
      } else {
        origin = {row: row, col: col};
      }
    }
    class HumanPlayer {
      constructor(colour) {
        this.colour = colour;
      }
      async selectMove() {
        let move;
        $('#submit').click(function(event) {
          event.preventDefault();
          let from = $('#from').val();
          let to = $('#to').val();
          if (from.val === "0-0") {
            return KINGSIDE;
          } else if (from.val === "0-0-0"){
            return QUEENSIDE;
          } else {
            move = {from: {row: from[1] - 1, col: from[0].charCodeAt() - "a".charCodeAt()},
                    to: {row: to[1] - 1, col: to[0].charCodeAt() - "a".charCodeAt()}};
          }
          executeMove(move);
        });
      }
    }
    class ComputerPlayer {
      constructor(colour) {
        this.colour = colour;
      }
      async selectMove(game) {
        let playerPieces = game.pieces[this.colour];
        let piece, moves, move, from, to;

        while (true) {
          let king = playerPieces.find(piece => piece instanceof King);
          moves = king.possibleMoves();
          let castle = moves.find(moves => move === QUEENSIDE || moves === KINGSIDE);
          if (castle !== undefined) {
              move = castle;
              break;
          }
          piece = playerPieces[Math.floor(Math.random() * playerPieces.length)];
          moves = piece.possibleMoves();

          if (moves.length > 0) {
              move = moves[Math.floor(Math.random() * moves.length)];
              break;
          }
        }

        if (move !== KINGSIDE && move !== QUEENSIDE) {
          move = {from: {row: piece.pos.row, col:piece.pos.col}, to: move};
        }
        executeMove(move);
      }
    }
    </script>
    <script>
    function wait(ms) {
      return new Promise(r => setTimeout(r, ms));
    }
    let game = new Game();
    let colour = WHITE;
    setupBoardGUI();
    updateBoardGUI(game);
    let players = [new HumanPlayer(WHITE), new ComputerPlayer(BLACK)];
    let index = 0;
    players[index].selectMove(game);

    async function executeMove (move) {
      try {
        if (move === KINGSIDE || move === QUEENSIDE) {
            game.tryCastle(player.colour, move);
        } else {
            game.tryMove(move.from, move.to);
        }
      } catch (error) {
        if (error instanceof InvalidMoveError) {
          players[index].selectMove(game);
          return;
        } else {
          throw error;
        }
      }
      await updateBoardGUI(game);
      await wait(1000);
      if (game.isMate(oppositeColour(colour))) {
        $('#result').html((colour === WHITE ? "white" : "black") + " wins!");
        //game.printMoves();
        return;
      }
      if (game.isStalemate(oppositeColour(colour))) {
        $('#result').html("Stalemate");
        //game.printMoves();
        return;
      }
      if (game.fiftyMoveDraw) {
        $('#result').html("50 move draw");
        //game.printMoves();
        return;
      }
      if (game.isRepetition()) {
        $('#result').html("repetition");
        //game.printMoves();
        return;
      }
      if (game.isInsufficientMaterial()) {
        $('#result').html("insufficient material");
        //game.printMoves();
        return;
      }

      index = (index + 1) % 2;
      players[index].selectMove(game);
    }
    </script>
  </body>
</html>
