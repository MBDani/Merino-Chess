board = null
game = new Chess()




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
//----------------------- Ponemos las reglas del juego ------------------------------------------------------------------


function onDragStartWhite(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) {
        alert("Jaque mate");
        return false
    }

    //Esta condición es solo para poder jugar con las blancas
    if (piece.search(/^b/) !== -1) {
        return false
    }
}

function onDragStartBlack(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) {
        alert("Jaque mate");
        return false
    }

    //Esta condicion es para poder jugar solo con las negras
    if (piece.search(/^w/) !== -1) {
        return false
    }
}


function onDrop(source, target) {


    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'


    updateStatus()
}


// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    board.position(game.fen())
    subirJugada();
}

function updateStatus() {
    var status = ''

    var moveColor = 'blancas'
    if (game.turn() === 'b') {
        moveColor = 'negras'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Fin del juego, ' + moveColor + ' en jaque mate.'

        if (moveColor == 'blancas') {
            document.getElementById('buttonGananNegras').click();
        } else {
            document.getElementById('buttonGananBlancas').click();
        }


    }

    // draw?
    else if (game.in_draw()) {
        status = 'Tablas (repetición o rey ahogado)'
        document.getElementById('buttonTablas').click();
    }

    // game still on
    else {
        status = "Turno: " + moveColor;

        // check?
        if (game.in_check()) {
            status += '. Están en jaque'
        }
    }


    let $status = $('#status')
    let $pgn = $('#pgn')
    $status.html(status) //estado del juego
    $pgn.html(game.pgn()) //movimientos de la partida
}



//----------------------- Conectando los movimientos con el ts ----------------------------------------------

/**
 * Actualizamos el juego con el id que recibimos del ts, firebase
 * @param {*} fen 
 */
function cargarJugada(fen) {
    game.load(fen);
    board.position(game.fen());
    updateStatus()
}

/**
 * Devolvemos la jugada, este método es invocado desde el onSnapEnd
 */
function subirJugada() {

    document.getElementById("cogerPosicionJS").value = game.fen()
    document.getElementById('button').click();
}


//------------------------- Creamos la partida -----------------------------------------------------------


//Creamos el juego del jugador 1
function createGameOnlineWhite(estilo) {
    var config = {
        draggable: true,
        position: 'start',
        pieceTheme: estilo,
        onDragStart: onDragStartWhite,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare, //método para que se borre el color
        onMouseoverSquare: onMouseoverSquareWhite, //método para que se añada el color
        onSnapEnd: onSnapEnd
    }

    board = Chessboard('myBoard', config)

}

//Creamos el juego del jugador 2
function createGameOnlineBlack(estilo) {
    var config = {
        draggable: true,
        position: 'start',
        orientation: 'black',
        pieceTheme: estilo,
        onDragStart: onDragStartBlack,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare, //método para que se borre el color
        onMouseoverSquare: onMouseoverSquareBlack, //método para que se añada el color
        onSnapEnd: onSnapEnd
    }

    board = Chessboard('myBoard', config)


}


  //pieceTheme: 'assets/img/chesspieces/wikipedia/{piece}.png',