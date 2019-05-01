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
          board += `<td class="square row${i} col${j}"></td>`;
        }
        board += "</tr>";
      }
      $('#board').html(board);
      $('.square').each(function(){
        $(this).css("height", $(this).css("width"));
      });
    }
    function updateBoardGUI(game) {
      for (let i = game.board.length - 1; i >= 0; i--) {
        for (let j = 0; j < game.board.length; j++) {
          let cell = game.board[i][j];
          if (cell === null) {
            $(`.row${i}.col${j}`).empty();
          } else {
            let piece = `<div class="piece ${(cell.colour === WHITE ? "white" : "black")} ${cell.constructor.name}"></div>`
            $(`.row${i}.col${j}`).append(piece);
          }
        }
      }
    }
    class HumanPlayer {
      constructor() {}
      playMove() {

      }
    }
    class ComputerPlayer {
      constructor() {}
      playMoves(game) {
        let playerPieces = game.pieces[colour];
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
      }
      return move;
    }
    </script>
    <script>
    let game = new Game();
    let colour = WHITE;
    setupBoardGUI();

    while (true) {
      let playerPieces = game.pieces[colour];
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

      try {
        if (move === KINGSIDE || move === QUEENSIDE) {
            game.tryCastle(colour, move);
        } else {
            game.tryMove(piece.pos, move);
        }
      } catch (error) {
        if (error instanceof InvalidMoveError) {
          console.log(error.message);
        } else {
          throw error;
        }
      }
      if (game.isMate(oppositeColour(colour))) {
        updateBoardGUI(game);
        $('#result').html((colour === WHITE ? "white" : "black") + " wins!");
        //game.printMoves();
        break;
      }
      if (game.isStalemate(oppositeColour(colour))) {
        updateBoardGUI(game);
        $('#result').html("Stalemate");
        //game.printMoves();
        break;
      }
      if (game.fiftyMoveDraw) {
        updateBoardGUI(game);
        $('#result').html("50 move draw");
        //game.printMoves();
        break;
      }
      if (game.isRepetition()) {
        updateBoardGUI(game);
        $('#result').html("repetition");
        //game.printMoves();
        break;
      }
      if (game.isInsufficientMaterial()) {
        updateBoardGUI(game);
        $('#result').html("insufficient material");
        //game.printMoves();
        break;
      }
      colour = oppositeColour(colour);
    }
    </script>
  </body>
</html>
