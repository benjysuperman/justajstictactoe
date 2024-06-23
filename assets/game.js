document.addEventListener("DOMContentLoaded", () => {

    const ruxSymbol = document.querySelector(".symbols .rux");
    const playerSymbol = document.querySelector(".symbols .player");
    const rSymbol = ruxSymbol.innerHTML.trim();
    const pSymbol = playerSymbol.innerHTML.trim();
    const DRAW_WINNER = 'd';
    const NOT_FINISHED = 'n';
    const startBtn = document.getElementById("start");
    const board = document.getElementById("board");
    const messageContainer = document.querySelector(".message");
    const gridSize = 3;
    const random = false;
    const gameState = {
        playing: pSymbol,
        grid: null,
        winner: NOT_FINISHED,
        emptySpots: null,
        played: 0
    };

    startBtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        start();
    });
    start();

    function start() {
        gameState.playing = pSymbol;
        gameState.grid = [];
        gameState.winner = NOT_FINISHED;
        gameState.emptySpots = null;
        gameState.played = 0;
        makeBoard();
        makeActive();
        if (gameState.playing === rSymbol) {
            rux();
        }
    }

    function makeBoard() {
        board.innerHTML = "";
        for (let i = 0; i < gridSize; i++) {
            let row = [];
            let tr = document.createElement("tr");
            board.append(tr);
            for (let j = 0; j < gridSize; j++) {
                let cell = {
                    inner: '',
                    elem: document.createElement("td")
                }
                cell.elem.addEventListener("click", () => player(cell));
                row.push(cell);
                tr.append(cell.elem);
            }
            gameState.grid.push(row);
        }
    }

    function player(cell) {
        if (gameState.playing === pSymbol) {
            gameState.played++;
            putSymbolInCell(cell);
            checkWinner();
            if (gameState.winner !== NOT_FINISHED) {
                end();
            } else {
                rux();
            }
        }
    }

    function rux() {
        gameState.playing = rSymbol;
        makeActive();
        // here the logic
        /*
        - v Check if can win
        - v Check if opp to win next turn : block
        - v or random
        - v Place anywhere
         */
        let cell = null;
        if (random) {
            cell = getRandomSlot();
        } else {
            setEmptySlots(gameState.grid);
            let es = gameState.emptySpots;
            cell = checkCanWin(es);
            if (!cell) {
                cell = checkBlockOpponent(es);
            }
            if (!cell) {
                cell = getRandomSlot();
            }
        }
        gameState.played++;
        putSymbolInCell(cell);
        checkWinner();
        if (gameState.winner !== NOT_FINISHED) {
            end();
        }
        gameState.playing = pSymbol;
    }


    function checkCanWin(emptySlots){
        for (let e = 0; e < emptySlots.length; e++) {
            emptySlots[e].inner = rSymbol;
            let futurWinner = getWinner(gameState.grid);
            if (futurWinner === rSymbol) {
                cell = emptySlots[e];
                emptySlots[e].inner = '';
                return cell;
            }
            emptySlots[e].inner = '';
        }
        return null;
    }

    function checkBlockOpponent(emptySlots){
        for (let e = 0; e < emptySlots.length; e++) {
            emptySlots[e].inner = pSymbol;
            let futurWinner = getWinner(gameState.grid);
            if (futurWinner === pSymbol) {
                cell = emptySlots[e];
                emptySlots[e].inner = '';
                return cell;
            }
            emptySlots[e].inner = '';
        }
        return null;
    }

    function getRandomSlot() {
        return gameState.emptySpots[Math.floor(gameState.emptySpots.length * Math.random())];
    }

    function setEmptySlots(grid){
        gameState.emptySpots = [];
        grid.forEach(r => r.forEach(c => c.inner === '' ? gameState.emptySpots.push(c) : null));
    }

    function checkWinner() {

        let grid = gameState.grid;
        setEmptySlots(gameState.grid);

        // NO NEED TO CHECK BEFORE
        if (gameState.played < 5) {
            return;
        }
        gameState.winner = getWinner(grid);
        //console.log(gameState.winner);
    }

    function getWinner(grid) {

        let winner = NOT_FINISHED;
        // ROWS
        for (let r = 0; r < gridSize; r++) {
            for (let c = 1; c < gridSize - 1; c++) {
                let row = [grid[r][c - 1].inner, grid[r][c].inner, grid[r][c + 1].inner];
                let win = !row.includes('') && grid[r][c - 1].inner === grid[r][c].inner && grid[r][c].inner === grid[r][c + 1].inner;
                //console.log("Row " + r + " : ", row);
                if (win) {
                    winner = grid[r][c].inner === rSymbol ? rSymbol : pSymbol;
                    break;
                }
            }
        }

        // COLUMNS
        for (let c = 0; c < gridSize; c++) {
            for (let r = 1; r < gridSize - 1; r++) {
                let column = [grid[r - 1][c].inner, grid[r][c].inner, grid[r + 1][c].inner]
                let win = !column.includes('') && grid[r - 1][c].inner === grid[r][c].inner && grid[r][c].inner === grid[r + 1][c].inner;
                //console.log("Column " + r + " : ", column);
                if (win) {
                    winner = grid[r][c].inner === rSymbol ? rSymbol : pSymbol;
                    break;
                }
            }
        }
        // Diagonal
        for (let r = 1; r < gridSize - 1; r++) {
            for (let c = 1; c < gridSize - 1; c++) {
                let diagonal = [grid[r - 1][c - 1].inner, grid[r][c].inner, grid[r + 1][c + 1].inner];
                let win = !diagonal.includes('') && grid[r - 1][c - 1].inner === grid[r][c].inner && grid[r][c].inner === grid[r + 1][c + 1].inner;
                //console.log("Diagonal : ", diagonal);
                if (win) {
                    winner = grid[r][c].inner === rSymbol ? rSymbol : pSymbol;
                    break;
                }
            }
        }

        // Diagonal Inserse
        for (let r = 1; r < gridSize - 1; r++) {
            for (let c = 1; c < gridSize - 1; c++) {
                let diagonal = [grid[r - 1][c + 1].inner, grid[r][c].inner, grid[r + 1][c - 1].inner];
                let win = !diagonal.includes('') && grid[r - 1][c + 1].inner === grid[r][c].inner && grid[r][c].inner === grid[r + 1][c - 1].inner;
                //console.log("Diagonal inv : ", diagonal);
                if (win) {
                    winner = grid[r][c].inner === rSymbol ? rSymbol : pSymbol;
                    break;
                }
            }
        }

        // checkFull
        if (winner === NOT_FINISHED && gameState.emptySpots.length === 0) {
            winner = DRAW_WINNER;
        }
        return winner;
    }

    function makeActive() {
        ruxSymbol.classList.remove("active");
        playerSymbol.classList.remove("active");
        if (gameState.playing === rSymbol) {
            ruxSymbol.classList.add("active");
        } else {
            playerSymbol.classList.add("active");
        }
    }

    function end() {
        let message = gameState.winner === rSymbol ? "Rux Win" : (gameState.winner === pSymbol ? "Player Win" : "It's a draw");
        messageContainer.innerHTML = message;
        messageContainer.classList.remove("hidden");
        setTimeout(() => {
            messageContainer.classList.add("hidden");
            startBtn.click();
        }, 5000);
    }

    function putSymbolInCell(cell) {
        let currentSymbol = gameState.playing === rSymbol ? rSymbol : pSymbol;
        cell.inner = currentSymbol;
        cell.elem.innerHTML = currentSymbol;
    }

});