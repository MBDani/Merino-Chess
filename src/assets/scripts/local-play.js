function createGameLocalPlay(estilo){
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

var whiteSquareGrey = '#265094' //color para las casillas blancas
var blackSquareGrey = '#1c3a6b' //color para las casillas negras

/**
 * Borrar colores
 */
function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

/**
 * 
 * @param {*} square 
 */
function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

/**
 * Comprobamos si es game over o no es el turno de alguna de las piezas para devolver false
 * @param {*} source 
 * @param {*} piece 
 * @param {*} position 
 * @param {*} orientation 
 * @returns 
 */
function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

/**
 * 
 * @param {*} source 
 * @param {*} target 
 * @returns 
 */
function onDrop (source, target) {
  removeGreySquares() //quitamos los cuadrados grises

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback' //que vuelva para atrás si el movimiento es ilegal

  updateStatus() //llamamos al método que actualiza los labels
}

/**
 * Método para colorear los posibles movimientos de la pieza sobre la que pases el ratón
 * @param {*} square 
 * @param {*} piece 
 * @returns 
 */  
function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
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

/**
 * Cuando saquemos el ratón de la pieza, llamaremos al método para borrar los cuadrados grises.
 * @param {} square 
 * @param {*} piece 
 */
function onMouseoutSquare (square, piece) {
  removeGreySquares()
}



/**
 * update the board position after the piece snap
 * for castling, en passant, pawn promotion
 */
function onSnapEnd () {
  board.position(game.fen())
}

/**
 * Este método solo sirve para poder escribir en los labels, no es necesario
 */
function updateStatus () {
  var status = ''

  var moveColor = 'blancas'
  if (game.turn() === 'b') {
    moveColor = 'negras'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Fin del juego, ' + moveColor + ' en jaque mate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Tablas (repetición o rey ahogado)'
  }

  // game still on
  else {
    status = "Turno: " + moveColor;

    // check?
    if (game.in_check()) {
      status += ', las ' + moveColor + ' están en jaque'
    }
  }

  $status.html(status) //estado del juego
  $fen.html(game.fen()) //id de la posición de la partida
  $pgn.html(game.pgn()) //movimientos de la partida
}

var config = {
  draggable: true,
  position: 'start',
  pieceTheme: estilo,
  onDragStart: onDragStart,
  onDrop: onDrop, //realizamos el movimiento
  onMouseoutSquare: onMouseoutSquare, //método para que se borre el color
  onMouseoverSquare: onMouseoverSquare, //método para que se añada el color
  onSnapEnd: onSnapEnd //reflejamos el movimiento
}
board = Chessboard('myBoard', config)

updateStatus()
  
}




//pieceTheme: 'assets/img/chesspieces/wikipedia/{piece}.png',