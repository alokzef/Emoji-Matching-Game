// Self-invoking function to prevent global scope pollution and use modern JS features.
(function() {
    // Wait for the DOM to be fully loaded before running the script
    document.addEventListener('DOMContentLoaded', () => {

        // --- DOM Element References ---
        const overlay = document.getElementById('ol');
        const gameBoard = document.querySelector('table');
        const movesSpan = document.getElementById('moves');
        const timeSpan = document.getElementById('time');

        // --- Constants ---
        // Set of emojis for the game
        const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗'];
        const FLIP_ANIMATION_DURATION = 1000; // ms

        // --- Game State ---
        let state = {
            cardsRemaining: 0,
            firstCard: null,
            gameLocked: false,
            moves: 0,
            timerInterval: null,
            startTime: 0,
            mode: ''
        };

        /**
         * Shuffles an array in place using the Fisher-Yates algorithm.
         * @param {Array} array The array to shuffle.
         * @returns {Array} The shuffled array.
         */
        function shuffle(array) {
            let p = array.length;
            if (!p) return array;
            while (--p) {
                const c = Math.floor(Math.random() * (p + 1));
                [array[c], array[p]] = [array[p], array[c]]; // ES6 destructuring swap
            }
            return array;
        }

        /**
         * Starts or restarts the game with a given grid size.
         * @param {number} rows The number of rows in the grid.
         * @param {number} cols The number of columns in the grid.
         */
        function startGame(rows, cols) {
            // Reset game state
            state.moves = 0;
            state.gameLocked = false;
            state.firstCard = null;
            clearInterval(state.timerInterval);

            movesSpan.textContent = "Moves: 0";
            timeSpan.textContent = "Time: 00:00";

            // Set up timer
            state.startTime = Date.now();
            state.timerInterval = setInterval(updateTimer, 1000);

            // Prepare card set
            const cardCount = rows * cols;
            state.cardsRemaining = cardCount / 2;
            state.mode = `${rows}x${cols}`;
            
            const gameEmojis = shuffle(EMOJIS).slice(0, state.cardsRemaining);
            const cards = shuffle([...gameEmojis, ...gameEmojis]);

            // Generate HTML for the game board
            let tableHTML = '';
            let cardIndex = 0;
            for (let i = 0; i < rows; i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < cols; j++) {
                    tableHTML += `
                        <td>
                            <div class="inner" data-emoji="${cards[cardIndex]}">
                                <div class="front"></div>
                                <div class="back"><p>${cards[cardIndex]}</p></div>
                            </div>
                        </td>`;
                    cardIndex++;
                }
                tableHTML += '</tr>';
            }
            gameBoard.innerHTML = tableHTML;

            // Hide the overlay screen
            overlay.classList.add('hidden');
        }

        /**
         * Updates the game timer every second.
         */
        function updateTimer() {
            const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
            const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
            timeSpan.textContent = `Time: ${minutes}:${seconds}`;
        }

        /**
         * Handles the logic when a card is clicked.
         * @param {Event} event The click event.
         */
        function handleCardClick(event) {
            const cardInner = event.target.closest('.inner');

            // Ignore clicks if the game is locked, the card is already matched, or it's the same card
            if (state.gameLocked || !cardInner || cardInner.classList.contains('matched') || cardInner === state.firstCard) {
                return;
            }

            cardInner.style.transform = 'rotateY(180deg)';

            if (!state.firstCard) {
                // This is the first card flipped in a turn
                state.firstCard = cardInner;
            } else {
                // This is the second card, check for a match
                state.moves++;
                movesSpan.textContent = `Moves: ${state.moves}`;
                state.gameLocked = true; // Lock the board to prevent more clicks

                if (state.firstCard.dataset.emoji === cardInner.dataset.emoji) {
                    handleMatch(cardInner);
                } else {
                    handleMismatch(cardInner);
                }
            }
        }

        /**
         * Handles a successful card match.
         * @param {HTMLElement} secondCardInner The .inner element of the second card.
         */
        function handleMatch(secondCardInner) {
            state.firstCard.classList.add('matched');
            secondCardInner.classList.add('matched');
            state.cardsRemaining--;
            state.gameLocked = false;
            state.firstCard = null;

            if (state.cardsRemaining === 0) {
                showWinScreen();
            }
        }

        /**
         * Handles a failed card match.
         * @param {HTMLElement} secondCardInner The .inner element of the second card.
         */
        function handleMismatch(secondCardInner) {
            setTimeout(() => {
                if (state.firstCard) {
                    state.firstCard.style.transform = 'rotateY(0deg)';
                }
                secondCardInner.style.transform = 'rotateY(0deg)';
                state.gameLocked = false;
                state.firstCard = null;
            }, FLIP_ANIMATION_DURATION);
        }

        /**
         * Displays the final win screen with stats and options to play again.
         */
        function showWinScreen() {
            clearInterval(state.timerInterval);
            const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            let timeString = '';
            if (minutes > 0) {
                timeString += `${minutes} minute(s) and `;
            }
            timeString += `${seconds} second(s)`;

            const content = `
                <div id="iol">
                    <h2>Congrats!</h2>
                    <p style="font-size:23px;padding:10px;">You completed the ${state.mode} mode in ${state.moves} moves. It took you ${timeString}.</p>
                    <p style="font-size:18px">Play Again?</p>
                    <div id="game-modes">
                        <button data-mode="3,4">3 x 4</button>
                        <button data-mode="4,4">4 x 4</button>
                        <button data-mode="4,5">4 x 5</button>
                        <button data-mode="5,6">5 x 6</button>
                        <button data-mode="6,6">6 x 6</button>
                    </div>
                </div>`;
            
            overlay.innerHTML = `<center>${content}</center>`;
            overlay.classList.remove('hidden');
        }

        /**
         * Displays the initial instruction screen.
         */
        function showInstructions() {
            const content = `
                <div id="inst">
                    <h3>Welcome!</h3>
                    How to Play<br/><br/>
                    <ul>
                        <li>The goal is to find all matching pairs of emojis.</li>
                        <li>Click on a card to flip it over and reveal the emoji.</li>
                        <li>If the next card you flip has the same emoji, the pair will stay face-up.</li>
                        <li>If they don't match, they will be flipped back over.</li>
                    </ul>
                    <p style="font-size:18px;">Click one of the following modes to start the game.</p>
                </div>
                <div id="game-modes">
                    <button data-mode="3,4">3 x 4</button>
                    <button data-mode="4,4">4 x 4</button>
                    <button data-mode="4,5">4 x 5</button>
                    <button data-mode="5,6">5 x 6</button>
                    <button data-mode="6,6">6 x 6</button>
                </div>`;
            overlay.innerHTML = `<center>${content}</center>`;
            overlay.classList.remove('hidden');
        }

        /**
         * Handles clicks on the overlay for starting the game.
         * @param {Event} event The click event.
         */
        function handleOverlayClick(event) {
            const button = event.target.closest('button[data-mode]');
            if (button) {
                const [rows, cols] = button.dataset.mode.split(',').map(Number);
                startGame(rows, cols);
            }
        }

        // --- Event Listeners ---
        gameBoard.addEventListener('click', handleCardClick);
        overlay.addEventListener('click', handleOverlayClick);

        // --- Initial Load ---
        showInstructions();
    });
})();