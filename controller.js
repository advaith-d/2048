import Game from "./engine/game.js";

//initializing game
let game = new Game(4);

//handling click of new game button
$(`#newGameBtn`).on('click', function(){
    newGame();
});

function loadGame(){
    //updating score
    let score = `<h6 class="subtitle has-text-warning"> Score: ${game.gameState.score}</h6>`;
    $(".subtitle").replaceWith(score);
    
    let index = 0;
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(game.gameState.board[index] === 0){
                document.getElementById('myTable').rows[i].cells[j].innerHTML = `<div class="tile is-vertical is-parent">
                <article class="tile is-child box has-background-black">
                    <p><br></p>
                </article>
                </div>`;;
            }
            else{
                document.getElementById('myTable').rows[i].cells[j].innerHTML = `<div class="tile is-vertical is-parent">
                <article class="tile is-child box has-background-black">
                    <p class="title has-text-centered has-text-warning">${game.gameState.board[index]}</p>
                </article>
                </div>`;
            }
            index++;
        }
    }
};

loadGame();//load initial board

//refresh board and score after every move
game.onMove(function(){
    loadGame();
});

//display messages if won or lost
game.onLose(function(){
    $('#winLose').replaceWith(`<h3 id="winLose" class="title has-text-danger has-text-centered">You have lost</h3>`);
});
game.onWin(function(){
    $('#winLose').replaceWith(`<h3 id="winLose" class="title has-text-danger has-text-centered">You have won</h3>`);
});

$(document).on('keydown', function(event){
    let key = event.which;
    switch (key) {
        case 39:
            game.move('right');
            break;
        case 37:
            game.move('left');
    
            break;
        case 40:
            game.move('down');

            break;
        case 38:
            game.move('up');
            break;
    }
});

function newGame(){
    $('#winLose').replaceWith(`<h3 id="winLose"></h3>`)
    game.setupNewGame();
    loadGame();
};
