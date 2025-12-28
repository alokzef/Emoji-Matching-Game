
# 🃏 Emoji Matching Game

A classic card-matching concentration game built with vanilla JavaScript, HTML, and CSS. The goal is to find all the matching pairs of emojis on the board.

## 🚀 Live Demo

You can play the game live here: **[Emoji Matching Game on GitHub Pages](https://alokzef.github.io/Emoji-Matching-Game/)**


## ✨ Features

*   💡 **Pure JavaScript**: No frameworks or libraries needed.
*   📊 **Multiple Game Modes**: Choose from various grid sizes for different levels of difficulty (3x4, 4x4, 4x5, 5x6, 6x6).
*   🔢 **Move Counter**: Tracks the number of pairs you've attempted to match.
*   ⏱️ **Timer**: See how long it takes you to complete the puzzle.
*   📱 **Responsive Design**: The game is playable on different screen sizes.
*   🏆 **Win Screen**: Displays your stats (time and moves) upon completion.
*   🔄 **Easy to Restart**: Play again with different modes right from the win screen.

## 🎮 How to Play

1.  When you first open the game, you'll see an instruction screen.
2.  Select one of the game modes (e.g., "4 x 4") to begin.
3.  The game board will appear, and the timer will start.
4.  Click on any card to flip it over and reveal an emoji.
5.  Click on a second card to find its match.
6.  - If the two cards match, they will stay face-up. ✅
    - If they do not match, they will flip back over after a short delay. ❌
7.  Continue flipping cards until you have matched all the pairs on the board.
8.  Once you've won, a summary screen will show your total moves and time.

## 🚀 Getting Started

No complex installation or build steps are required!

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/alokzef/Emoji-Matching-Game.git
    ```

2.  **Navigate to the directory:**
    ```bash
    cd Emoji-Matching-Game
    ```

3.  **Open the game:**
    Simply open the `index.html` file in your favorite web browser.

That's it! You're ready to play.

## 🔎 Code Overview

The main game logic is contained within `gameScript.js`.

*   **IIFE (Immediately Invoked Function Expression)**: The entire script is wrapped in an IIFE `(function() { ... })();` to avoid polluting the global namespace.
*   **Game State Management**: A central `state` object is used to track all important data like moves, time, selected cards, and game mode.
*   **DOM Manipulation**: The game board is dynamically generated with JavaScript based on the selected mode.
*   **Event Handling**: The game uses event listeners to handle card clicks and interactions with the overlay menus.

## 🛠️ Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES6+)
