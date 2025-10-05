document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status-message');
    const resetButton = document.getElementById('reset-button');
    
    // --- Game State Variables ---
    let board = ['', '', '', '', '', '', '', '', '']; // Represents the 9 cells (0-8)
    let currentPlayer = 'X';
    let gameActive = true; // True while the game is ongoing (no winner or draw yet)

    // --- Winning Conditions ---
    // All possible winning combinations (indexes of the board array)
    const winningConditions = [
        [0, 1, 2], // Horizontal
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // Vertical
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // Diagonal
        [2, 4, 6]
    ];

    // --- Core Functions ---

    /**
     * Handles a player's move by updating the board, checking for a win, and switching turns.
     * @param {Element} cellClicked - The DOM element of the cell that was clicked.
     * @param {number} cellIndex - The index (0-8) of the cell in the board array.
     */
    function handleMove(cellClicked, cellIndex) {
        // 1. Check if the cell is already filled OR if the game is inactive (over)
        if (board[cellIndex] !== '' || !gameActive) {
            return;
        }

        // 2. Update the game state (board array and DOM)
        board[cellIndex] = currentPlayer;
        cellClicked.innerHTML = currentPlayer;
        cellClicked.classList.add(currentPlayer.toLowerCase()); // For CSS styling

        // 3. Check for a win or draw
        if (checkWin()) {
            gameActive = false;
            statusMessage.innerHTML = `Player <span class="${currentPlayer.toLowerCase()}">${currentPlayer}</span> Wins! 🎉`;
            return;
        }

        // 4. Check for a draw (if the board is full)
        if (!board.includes('')) {
            gameActive = false;
            statusMessage.innerHTML = 'It\'s a Draw! 🤝';
            return;
        }

        // 5. Switch to the next player
        switchPlayer();
    }

    /**
     * Switches the current player from 'X' to 'O' or vice-versa.
     */
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.innerHTML = `Player <span class="${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s Turn`;
    }

    /**
     * Iterates through winning conditions to check if the current player has won.
     * @returns {boolean} True if a win is detected, false otherwise.
     */
    function checkWin() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const condition = winningConditions[i];
            const a = board[condition[0]];
            const b = board[condition[1]];
            const c = board[condition[2]];

            // Check if all three cells are filled AND they are the same mark (X or O)
            if (a === '' || b === '' || c === '') {
                continue; // Skip if any cell is empty
            }
            if (a === b && b === c) {
                roundWon = true;
                // Add winner highlight to the DOM cells
                condition.forEach(index => {
                    cells[index].classList.add('winner');
                });
                break;
            }
        }
        return roundWon;
    }

    /**
     * Resets the game to its initial state.
     */
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        statusMessage.innerHTML = `Player <span class="${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s Turn`;

        // Clear all marks and winner highlights from the DOM
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o', 'winner');
        });
    }

    // --- Event Listeners ---

    // 1. Add click listeners to all 9 cells
    cells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            const cellIndex = parseInt(event.target.getAttribute('data-index'));
            handleMove(event.target, cellIndex);
        });
    });

    // 2. Add click listener to the Reset button
    resetButton.addEventListener('click', resetGame);
    
    // Initial status setup (for when the page first loads)
    statusMessage.innerHTML = `Player <span class="${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s Turn`;
});