/*
** The Gameboard represents the state of the board
** It exposes getBoard addToken displayValues functions
** to have access to the board outside of the function
*/
function Gameboard(){
    const rows = 3;
    const columns = 3;
    let board = [];

    // this is our board display container
    const container = document.querySelector(".container");
    const cells = container.children;
    
    // Create a 2d array of 9 cells (3rows 3 columns)
    // Assign a cell to each unit of the board
    // This nested-loop technique is a simple and common way to create a 2d array.
    for (let i=0; i<rows; i++){
        board[i] = []
        for (let j=0; j<columns; j++){
            board[i][j] = Cell();
            // add gric cells to our display container
            const cell = document.createElement("div");
            cell.className = "cell"
            cell.setAttribute("id", `cell-${i*3+j}`)
            container.appendChild(cell)
        }
    }
    
    // This getBoard function will be used outside of
    // Gameboard function to access our board
    const getBoard = () => board;

    const resetBoard = () => {
        board = board.map((row)=>row.map((cell)=>cell.resetValue()))
        for (let i = 0; i<cells.length; i++){
            cells[i].innerText = ""
        }
    }

    // This is our cell generator function
    // It has addToken and getValue functions 
    // that will help us display and change cell data
    function Cell(){
        let value = 0;
        
        const addToken = (player) => {
            value = player;
        }

        const getValue = () => value;

        const resetValue = () => {
            value = 0;
            return Cell()
        }

        return {addToken, getValue, resetValue}
    }

    // This is a seperate function from the addToken 
    // function inside Cell the difference is that the user
    // will have access to this function in order to change cell data
    const addToken = (row, column,token) => {
        const tokenEqu = token==1 ? "X" : "O"
        board[row][column].addToken(tokenEqu);
        const index = (Number(row) * 3) + Number(column);
        cells[index].innerText = tokenEqu;
    }

    // This function is to display the table with the cell values
    // written in each cell
    const displayBoard = () => {
        let board = getBoard()
        let displayBoard = [];
        for (r in board){
            const row = board[r];
            let newRow = row.map((cell)=>cell.getValue())
            displayBoard.push(newRow);
        }
        return displayBoard;
    }

    return {getBoard, addToken, displayBoard, resetBoard, cells}
};



/*
** GameController function is the main function that will control
** the flow of the game with switchPlayerTurn playRound and checkGameOver functions
*/
function GameController(
    playerOneName = "player one",
    playerTwoName = "player two"){

    const board = Gameboard();
    
    const players = [
        {
            name: playerOneName,
            token: 1,
        },
        {
            name: playerTwoName,
            token: 2,
        }
    ]

    // activePlayer is the player that will choose a cell to add token into
    // at the end of each round, the active player will switch
    let activePlayer = players[0]
    const switchPlayerTurn = () => {
        if(activePlayer === players[0]){
            activePlayer = players[1]
        }else{
            activePlayer = players[0]
        }
    }

    const checkGameOver = () => {
        const topRow = board.getBoard()[0].map((cell)=>cell.getValue());
        const midRow = board.getBoard()[1].map((cell)=>cell.getValue());
        const botRow = board.getBoard()[2].map((cell)=>cell.getValue());
        const leftCol = [board.getBoard()[0][0].getValue(), board.getBoard()[1][0].getValue(), board.getBoard()[2][0].getValue()];
        const midCol = [board.getBoard()[0][1].getValue(), board.getBoard()[1][1].getValue(), board.getBoard()[2][1].getValue()];
        const rightCol = [board.getBoard()[0][2].getValue(), board.getBoard()[1][2].getValue(), board.getBoard()[2][2].getValue()];;
        const topLBotR = [board.getBoard()[0][0].getValue(), board.getBoard()[1][1].getValue(), board.getBoard()[2][2].getValue()];
        const topRBotL = [board.getBoard()[0][2].getValue(), board.getBoard()[1][1].getValue(), board.getBoard()[2][0].getValue()];

        const consecutives = [topRow, midRow, botRow ,leftCol, midCol, rightCol, topLBotR, topRBotL];
        let gameover = false;
        for(i in consecutives){
            if(consecutives[i][0]===consecutives[i][1]&&consecutives[i][1]===consecutives[i][2]&&consecutives[i][0]!==0){
                gameover = true;
                break;
            }else if(board.displayBoard()===board.displayBoard().map((row)=>row.filter((cell)=>cell!==0))){
                gameover = true;
                break;
            }else{
            gameover =  false;
            }
        }
        return gameover;
    }

    const reset = document.querySelector(".reset")
    reset.addEventListener("click", board.resetBoard);
    // playRound function is responsible of playing a single round
    // depending on active player and user input
    const listener = (e) => {
        const cellNumber = e.target.id[e.target.id.length -1];
        const row = Math.floor(cellNumber/3);
        const column = cellNumber % 3;
        if(e.target.innerText===""){
            board.addToken(row, Number(column), activePlayer.token)
            if(!checkGameOver()){
                switchPlayerTurn()
            }
            else{
                console.log("gameover")
                for(let j=0; j<board.cells.length; j++){
                    board.cells[j].removeEventListener("click", listener)
                }
            }
        }
    }

    const playGame = () => {
        for (let i=0; i<board.cells.length; i++){
            board.cells[i].addEventListener("click", listener)
        }
    }
    
    
    return {playGame, board, checkGameOver}
}

const game = GameController();
game.playGame()

