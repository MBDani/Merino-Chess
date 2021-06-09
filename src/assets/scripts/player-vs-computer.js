
function createGamePlayerComputer(estilo){

  var board = null
  var $board = $('#myBoard')
  var game = new Chess()
  var squareToHighlight = null
  var squareClass = 'square-55d63'


  
//---------------------- Marcar posiciones disponibles al seleccionar una pieza
var whiteSquareGrey = '#265094' // a9a9a9 color para las casillas blancas
var blackSquareGrey = '#1c3a6b' // 696969 color para las casillas negras

/**
 * Borrar colores
 */
function removeGreySquares() {
    $('#myBoard .square-55d63').css('background', '')
}

/**
 * Colorea los cuadrados
 * @param {*} square 
 */
function greySquare(square) {
    var $square = $('#myBoard .square-' + square)

    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
}


/**
 * Solo para las blancas
 * Comprueba los posibles movimientos y llama al método que los colorea (greySquare)
 * @param {*} square 
 * @param {*} piece 
 * @returns 
 */
function onMouseoverSquareWhite(square, piece) {
    // get list of possible moves for this square

    if (game.turn() === 'w') { //con esta condición conseguimos que cada jugador solo pueda ver en su turno los movimientos que tiene
        var moves = game.moves({
            square: square,
            verbose: true
        })

        // exit if there are no moves available for this square
        if (moves.length === 0) return

        // highlight the square they moused over
        greySquare(square)

        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to)
        }
    }
}


/**
* Solo para las blancas
* Comprueba los posibles movimientos y llama al método que los colorea (greySquare)
* @param {*} square 
* @param {*} piece 
* @returns 
*/
function onMouseoverSquareBlack(square, piece) {
    // get list of possible moves for this square

    if (game.turn() === 'b') { //con esta condición conseguimos que cada jugador solo pueda ver en su turno los movimientos que tiene
        var moves = game.moves({
            square: square,
            verbose: true
        })

        // exit if there are no moves available for this square
        if (moves.length === 0) return

        // highlight the square they moused over
        greySquare(square)

        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to)
        }
    }
}

/**
 * Cuando saquemos el ratón de la pieza, llamaremos al método para borrar los cuadrados grises.
 * @param {} square 
 * @param {*} piece 
 */
function onMouseoutSquare(square, piece) {
    removeGreySquares()
}
  
  function removeHighlights (color) {
    $board.find('.' + squareClass)
      .removeClass('highlight-' + color)
  }
  
  function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false
  
    // only pick up pieces for White
    if (piece.search(/^b/) !== -1) return false
  }
  
  function makeRandomMove () {
    var possibleMoves = game.moves({
      verbose: true
    })
  
    // game over
    if (possibleMoves.length === 0) return
  
    var randomIdx = Math.floor(Math.random() * possibleMoves.length)
    var move = possibleMoves[randomIdx]
    game.move(move.san)
  
    // highlight black's move
    removeHighlights('black')
    $board.find('.square-' + move.from).addClass('highlight-black')
    squareToHighlight = move.to
  
    // update the board to the new position
    board.position(game.fen())
  }
  
  function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })
  
    // illegal move
    if (move === null) return 'snapback'
  
    // highlight white's move
    removeHighlights('white')
    $board.find('.square-' + source).addClass('highlight-white')
    $board.find('.square-' + target).addClass('highlight-white')
  
    // make random move for black
    window.setTimeout(makeRandomMove, 250) //llama al método de realizar el movimiento
  }
  
  /**
   * Añade color a la casilla de la que proviene
   */
  function onMoveEnd () {
    $board.find('.square-' + squareToHighlight)
      .addClass('highlight-black')
  }
  
  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  function onSnapEnd () {
    board.position(game.fen())
  }
  
  var config = {
    draggable: true,
    position: 'start',
    pieceTheme: estilo,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMoveEnd: onMoveEnd,
    onMouseoutSquare: onMouseoutSquare, //método para que se borre el color
    onMouseoverSquare: onMouseoverSquareWhite, //método para que se añada el color
    onSnapEnd: onSnapEnd
  }
  board = Chessboard('myBoard', config)

  $('#startBtn').on('click', function(){
    board.start()
    game.reset()
  })
  
}




//pieceTheme: 'assets/img/chesspieces/wikipedia/{piece}.png',