function gameMenu(estilo){
var config = {
    draggable: true,
    position: 'start',
    pieceTheme: estilo,
  }

  board = Chessboard('myBoard', config)

  $('#startBtn').on('click', function(){
    board.start()
    game.reset()
  })

 
}