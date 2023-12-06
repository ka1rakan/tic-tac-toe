function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i=0; i<rows; i++){
        board[i] = []
        for (let j=0; j<columns; j++){
            board[i][j] = Cell();
        }
    }
    const getBoard = () => board;

    function Cell(){
        let value = 0;

        const addToken = (player) => {
            value = player;
        }

        const getValue = () => value;

        return {addToken, getValue}
    }

    const addToken = (cell) => {
        cell.addToken(1);
    }

    const displayValues = () => {
        let board = getBoard()
        let displayBoard = [];
        for (r in board){
            const row = board[r];
            let newRow = row.map((cell)=>cell.getValue())
            displayBoard.push(newRow);
        }
        return displayBoard;
    }

};

