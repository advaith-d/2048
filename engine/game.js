/*
Add your code for Game here
 */
export default class Game{
    constructor(size){
        this.winArr = [];
        this.loseArr = [];
        this.moveArr = [];
        this.size = size;
        this.fullSize = size * size;
        this.gameState = {
            board: new Array(this.fullSize).fill(0),
            score: 0, 
            won: false, 
            over: false
        }
        this.addTile();
        this.addTile();
        this.rows = [];
        this.cols = [];
    }
    
    /**
     * Resets the game back to a random starting position
     */
    setupNewGame(){
        this.gameState.won = false;
        this.gameState.over = false;
        this.gameState.score = 0;
        this.gameState.board = new Array(this.fullSize).fill(0);
        this.addTile();
        this.addTile();
    }

    /**
     * Given a gameState object, it loads that board, score, etc.
     */
    loadGame(inputGameState){
        this.gameState.board = inputGameState.board;
        this.gameState.score = inputGameState.score;
        this.gameState.won = inputGameState.won;
        this.gameState.over = inputGameState.over;
    }

    /**
     * moves all non-zero tiles left in each row
     */
    slideLeft(array){
        for(let i = 0; i < this.size; i++){
            let filledTiles = array[i].filter(val => val);
            let empty = Array(this.size - filledTiles.length).fill(0);
            array[i] = filledTiles.concat(empty);
        }
        return array;
    }
    
    /**
     * combines all tiles leftward
     */
    combineLeft(array){
        for(let i = 0; i < this.size; i++){
            for(let j = 1; j < this.size; j++){
                if(array[i][j] === array[i][j - 1]){
                    let x = array[i][j];
                    let y = array[i][j - 1];
                    array[i][j - 1] = x + y;
                    this.gameState.score += x + y;
                    array[i][j] = 0;
                }
            }
        }
        return array;
    }
    
    /**
     * moves all non-zero tiles right in each row
     */
    slideRight(array){
        for(let i = 0; i < this.size; i++){
            let filledTiles = array[i].filter(val => val);
            let empty = Array(this.size - filledTiles.length).fill(0);
            array[i] = empty.concat(filledTiles);
        }
        return array;
    }
    
    /**
     * combines all tiles rightward
     */
    combineRight(array){
        for(let i = 0; i < this.size; i++){
            for(let j = this.size - 1; j >= 0; j--){
                if(array[i][j] === array[i][j + 1]){
                    let x = array[i][j];
                    let y = array[i][j + 1];
                    array[i][j + 1] = x + y;
                    this.gameState.score += x + y;
                    array[i][j] = 0;
                }
            }
        }
        return array;
    }
    
    /**
     * Given "up," "down," "left," or "right" as string input, it makes the 
     * appopriate shifts and adds a random tile
     */
    move(direction){
        let pre = [...this.gameState.board];
        if(direction === 'left'){
            this.rows = new Array(this.size);
            let index = 0;
            for(let i = 0; i < this.size; i++){
                this.rows[i] = [];
                for(let j = 0; j < this.size; j++){
                    this.rows[i][j] = this.gameState.board[index];
                    index++;
                    
                }
            }
            
            this.rows = this.slideLeft(this.rows);
            this.rows = this.combineLeft(this.rows);
            this.rows = this.slideLeft(this.rows);

            this.gameState.board = this.rows.flat();

            let changed;
            for(let i = 0; i < this.gameState.board.length; i++){
                if(pre[i] !== this.gameState.board[i]){
                    changed = true;
                }
            }
            if(changed){
                this.addTile();
            }

            if(this.gameWon() === true){
                this.gameState.gameWon = true;
                this.winArr.forEach(element =>{
                    element(this.getGameState());
                });
            }
            
            if(this.moveArr.length > 0){
                for(let i = 0; i < this.moveArr.length; i++){
                    this.moveArr[i](this.getGameState());
                }
            }
            
            if(this.availableMove() === false){
                this.gameState.over = true;
                this.loseArr.forEach(element => {
                    element(this.getGameState());
                });
            }
        }
        else if(direction === 'right'){
            let pre = [...this.gameState.board];
            this.rows = new Array(this.size);
            let index = 0;
            for(let i = 0; i < this.size; i++){
                this.rows[i] = [];
                for(let j = 0; j < this.size; j++){
                    this.rows[i][j] = this.gameState.board[index];
                    index++;
                    
                }
            }
            
            this.rows = this.slideRight(this.rows);
            this.rows = this.combineRight(this.rows);
            this.rows = this.slideRight(this.rows);

            this.gameState.board = this.rows.flat();
            
            let changed;
            for(let i = 0; i < this.gameState.board.length; i++){
                if(pre[i] !== this.gameState.board[i]){
                    changed = true;
                }
            }
            
            if(changed){
                this.addTile();
            }

            if(this.gameWon() === true){
                this.winArr.forEach(element =>{
                    element(this.getGameState());
                });
            }
            
            if(this.moveArr.length > 0){
                for(let i = 0; i < this.moveArr.length; i++){
                    this.moveArr[i](this.getGameState());
                }
            }
            
            if(this.availableMove() === false){
                this.gameState.over = true;
                this.loseArr.forEach(element => {
                    element(this.getGameState());
                });
            }
        }
        else if(direction === 'up'){
            let pre = [...this.gameState.board];
            this.cols = new Array(this.size);
            for(let i = 0; i < this.size; i++){
                let index = i;
                this.cols[i] = [];
                for(let j = 0; j < this.size; j++){
                    this.cols[i][j] = this.gameState.board[index];
                    index += this.size;
                }
            }
            
            this.cols = this.slideLeft(this.cols);
            this.cols =  this.combineLeft(this.cols);
            this.cols = this.slideLeft(this.cols);

            let index = 0;
            for(let i = 0; i < this.size; i++){
                for(let j = 0; j < this.size; j++){
                    this.gameState.board[index] = this.cols[j][i];
                    index++;
                }
            }
            
            let changed;
            for(let i = 0; i < this.gameState.board.length; i++){
                if(pre[i] !== this.gameState.board[i]){
                    changed = true;
                }
            }
            if(changed){
                this.addTile();
            }
            
            if(this.gameWon() === true){
                this.winArr.forEach(element =>{
                    element(this.getGameState());
                });
            }

            if(this.moveArr.length > 0){
                for(let i = 0; i < this.moveArr.length; i++){
                    this.moveArr[i](this.getGameState());
                }
            }

            if(this.availableMove() === false){
                this.gameState.over = true;
                this.loseArr.forEach(element => {
                    element(this.getGameState());
                });
            }
        }
        else if(direction === 'down'){
            let pre = [...this.gameState.board];
            this.cols = new Array(this.size);
            for(let i = 0; i < this.size; i++){
                let index = i;
                this.cols[i] = [];
                for(let j = 0; j < this.size; j++){
                    this.cols[i][j] = this.gameState.board[index];
                    index += this.size;
                }
            }
            
            this.cols = this.slideRight(this.cols);
            this.cols = this.combineRight(this.cols);
            this.cols = this.slideRight(this.cols);

            let index = 0;
            for(let i = 0; i < this.size; i++){
                for(let j = 0; j < this.size; j++){
                    this.gameState.board[index] = this.cols[j][i];
                    index++;
                }
            }

            let changed;
            for(let i = 0; i < this.gameState.board.length; i++){
                if(pre[i] !== this.gameState.board[i]){
                    changed = true;
                }
            }
            if(changed){
                this.addTile();
            }
 
            if(this.gameWon() === true){
                this.winArr.forEach(element =>{
                    element(this.getGameState());
                });
            }

            if(this.moveArr.length > 0){
                for(let i = 0; i < this.moveArr.length; i++){
                    this.moveArr[i](this.getGameState());
                }
            }
            if(this.availableMove() === false){
                this.gameState.over = true;
                this.loseArr.forEach(element => {
                    element(this.getGameState());
                });
            }
        }
    }

    /**
     * Returns a string representation of the game state as text
     */
    toString(){
        let length = this.size
        let row = [];
        this.gameState.board.forEach(function(element) {
            let tile;
            if(element === 0){
                tile = ' ';
            }
            else{
                tile = element;
            }
            row.push('[' + tile + ']');
            if(row.length === length){
                let print = '';
                row.forEach(element =>{
                    print = print + ' ' + element;
                })
                console.log(print);
                row = [];
            }
        });
        console.log('Score ' + this.gameState.score);
    }
    
    /**
     * Takes a callback function as input and registers that function as a 
     * listener on the move event 
     */
    onMove(callback){
        this.moveArr[this.moveArr.length] = callback;
    }
    
    /**
     * Takes a callback unction as input and registers that function as a
     * listener to the win event.
     */
    onWin(callback){
        this.winArr[this.winArr.length] = callback;
    }
    
    /**
     * Registers input callback function to the move event
     */
    onLose(callback){
        this.loseArr[this.winArr.length] = callback;
    }
    
    /**
     * Returns an accurate gameState object representing the current game state
     */
    getGameState(){
       return this.gameState; 
    }

    /**
     * Adds new tile to the game board
     */
    addTile(){
        let newTile = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
        let empty = [];
        for(let i = 0; i < this.fullSize; i++){
            if(this.gameState.board[i] === 0){
                empty.push(i);
            }
        }

        let indexOfNewTile = empty[Math.floor(Math.random() * empty.length)];
        let contentsOfNewTile = newTile[Math.floor(Math.random() * newTile.length)];
        this.gameState.board[indexOfNewTile] = contentsOfNewTile;
    }

    /**
     * 
     * @returns true if any tile is 2048
     */
    gameWon(){
        let gameWon = false;
        if(this.gameState.won === true){
            gameWon = false;
        }
        else{
            for(let i = 0; i < this.fullSize; i++){
                if(this.gameState.board[i] === 2048){
                    gameWon = true;
                    this.gameState.won = true;
                    break;
                }
            }
        }
        return gameWon;
    }

    /**
     * 
     * @returns true if a left move can be performed
     */
    availableLeftMove(){
        this.rows = new Array(this.size);
        let index = 0;
        for(let i = 0; i < this.size; i++){
            this.rows[i] = [];
            for(let j = 0; j < this.size; j++){
                this.rows[i][j] = this.gameState.board[index];
                index++;
                
            }
        }
        let available = false;
        for(let i = 0; i < this.rows.length; i++){
            for(let j = 1; j < this.rows[i].length; j++){
                if(this.rows[i][j] > 0){
                    if(this.rows[i][j - 1] === 0){
                        available = true;
                    }
                    else if(this.rows[i][j- 1] === this.rows[i][j]){
                        available = true;
                    }
                }
            }
        }
        return available;
    }

    /**
     * 
     * @returns true if a right move can be performed
     */
     availableRightMove(){
         let available = false;
        for(let i = 0; i < this.fullSize; i++){
            if(this.gameState.board[i] > 0 && (i + 1) % this.size !== 0){
                if(this.gameState.board[i + 1] === this.gameState.board[i] || this.gameState.board[i + 1] == 0){
                    available = true;
                    break;
                }
            }
        }
        return available;
    }

    /**
     * 
     * @returns true if a down move can be performed
     */
     availableDownMove(){
        let available = false;
        for(let i = 0; i < this.fullSize; i++){
            if(this.gameState.board[i] > 0 && i < (this.fullSize - this.size)){
                if(this.gameState.board[i + this.size] === this.gameState.board[i] || this.gameState.board[i + this.size] == 0){
                    available =  true;
                    break;
                }
            }
        }
        return available;
    }

    /**
     * 
     * @returns true if an up move can be performed
     */
     availableUpMove(){
        let available = false;
        for(let i = 0; i < this.fullSize; i++){
            if(this.gameState.board[i] > 0 && i >= this.size){
                if(this.gameState.board[i - this.size] === this.gameState.board[i] || this.gameState.board[i - this.size] == 0){
                    available = true;
                    break;
                }
            }
        }
        return available;
    }

    /**
     * 
     * @returns true is there are any available moves
     */
    availableMove(){
        let available = false;
        if(this.availableLeftMove() || this.availableDownMove() || this.availableRightMove() || this.availableUpMove()){
            available = true;
        }
        return available;
    }
}