
/**
 * Variables and DOM Queries
 */
const DOMQuery = {
    gamePanelContainer: document.body.querySelector('.game-panel'),
    completedGamesDisplay: document.body.querySelector('#completed-games'),
    pendingGamesDisplay: document.body.querySelector('#pending-games'),
    winRateDisplay: document.body.querySelector('#win-rate'),
    totalWinsDisplay: document.body.querySelector('#total-wins')
};

/**
 * Global Function Calls
 */
displayMidSection();
showGameRecord('completed');
showGameRecord('pending');
showWinRate();

/**
 * Functions
 */

/**
 * @param {string} gameStatus 
 * @returns {Array} - Local storage or set default []
 */
function getGameHistory(gameStatus) {
    try {
        const localStorageKey = gameStatus === 'pending' ? 'pendingGameHistory' : 'completedGameHistory';

        const rawGameHistory = localStorage.getItem(localStorageKey);

        return rawGameHistory ? JSON.parse(rawGameHistory) : [];

    } catch (error) {
        console.log('Check localStorage data you are accessing. Something is wrong with it!', error);
        return [];
    }
}

function showWinRate() {
    const gameHistory = getGameHistory('completed');
    const totalHumanWins = gameHistory.filter((gameRecord) => {
        return typeof gameRecord === 'object' && gameRecord?.gameWinner === 'human';
    });

    const totalWins = totalHumanWins.length;
    const totalGames = gameHistory.length;

    const winRate = totalGames !== 0 ? totalWins / totalGames * 100 : 0; 

    DOMQuery.totalWinsDisplay.textContent = totalWins; 
    DOMQuery.winRateDisplay.textContent = winRate.toFixed(2) + '%';
}

/**
* Updates the UI to show the total games based on the game status
* @param {string} gameStatus - Either completed or pending
* @returns {undefined}
*/
function showGameRecord(gameStatus) {
    const gameHistory = getGameHistory(gameStatus);
    const totalRecord = gameHistory.length;

    // Map game status with respective display element
    const gameRecordDisplay = {
        completed: DOMQuery.completedGamesDisplay,
        pending: DOMQuery.pendingGamesDisplay
    };

    const displayElement = gameRecordDisplay[gameStatus];

    if (displayElement) {
        displayElement.textContent = totalRecord;
    } else {
        console.warn('Invalid gameStatus data', gameStatus);
    }

}

function getComputerPick() {
    const options = ['rock', 'paper', 'scissors'];
    const randomPick = Math.floor(Math.random() * options.length);
    const result = options[randomPick];

    return result.charAt(0).toUpperCase() + result.slice(1);
}

function createLoadingDots() {
    const div = document.createElement('div');
    div.classList.add('loading');
    div.textContent = 'Starting Game';

    const span = document.createElement('span');
    span.classList.add('dots');

    div.appendChild(span);

    return div;
}

function createSpinnerEffect() {
    const span = document.createElement('span');
    span.classList.add('spinner');

    return span;
}

function displayMidSection() {
    const midSection = DOMQuery.gamePanelContainer.querySelector('.mid');

    midSection.innerHTML = '';

    const h3 = document.createElement('h3');
    h3.textContent = 'Enter total number of rounds to play.';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.max = 10;
    input.placeholder = '1-10';
    input.id = 'total-rounds';

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'start-game';
    button.classList = 'btn-green';
    button.textContent = 'Start Game';

    midSection.append(h3, input, button);

    input.focus();

    return midSection;
}

function displaySelectionComponent() {
    const midContainer = DOMQuery.gamePanelContainer.querySelector('.mid');

    const selectionContainer = document.createElement('div');
    selectionContainer.classList.add('selection');

    // Header (Round info)
    const h4 = document.createElement('h4');
    h4.classList.add('round-winner');
    h4.innerHTML = `Round <span id="current-round">0</span> / <span id='total-round'>6</span>: <span id="round-winner"></span>`;
    selectionContainer.appendChild(h4);

    // Pick display
    const yourPickDisplay = document.createElement('p');
    yourPickDisplay.innerHTML = `You picked: <span id="you-picked"></span>`;
    const computerPickDisplay = document.createElement('p');
    computerPickDisplay.innerHTML = `Computer picked: <span id="computer-picked"></span>`;
    selectionContainer.appendChild(yourPickDisplay);
    selectionContainer.appendChild(computerPickDisplay);

    // Your score
    const yourScoreParag = document.createElement('p');
    yourScoreParag.innerHTML = `Your Score: <span id="your-score">0</span>`;
    selectionContainer.appendChild(yourScoreParag);

    // Computer score
    const computerScoreParag = document.createElement('p');
    computerScoreParag.innerHTML = `Computer Score: <span id="computer-score">0</span>`;
    selectionContainer.appendChild(computerScoreParag);

    // Picks container
    const picksContainer = document.createElement('div');
    picksContainer.classList.add('picks');

    // Rock button
    const rockBtn = document.createElement('button');
    rockBtn.type = 'button';
    rockBtn.id = 'rock';
    rockBtn.classList.add('btn-blue');
    rockBtn.textContent = 'Rock';

    // Paper button
    const paperBtn = document.createElement('button');
    paperBtn.type = 'button';
    paperBtn.id = 'paper';
    paperBtn.classList.add('btn-blue');
    paperBtn.textContent = 'Paper';

    // Scissors button
    const scissorsBtn = document.createElement('button');
    scissorsBtn.type = 'button';
    scissorsBtn.id = 'scissors';
    scissorsBtn.classList.add('btn-blue');
    scissorsBtn.textContent = 'Scissors';

    // Append buttons to picks container
    picksContainer.appendChild(rockBtn);
    picksContainer.appendChild(paperBtn);
    picksContainer.appendChild(scissorsBtn);

    // Append picks container to main selection
    selectionContainer.appendChild(picksContainer);

    // Finally, add the component to the page (append to a known container)
    midContainer.appendChild(selectionContainer);
}

// Display the bottom section
function displayBottomSection() {
    const div = document.createElement('div');
    div.classList.add('bot');

    const h4 = document.createElement('h4');
    h4.innerHTML = `Game Winner: <span id="game-winner"></span>`;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'quit-game';
    button.classList.add('btn-red');
    button.textContent = 'Quit Game';

    div.append(h4, button);

    return div;
}

// Not yet final, just for the sake of the counts to work
let yourScoreCount = 0;
let computerScoreCount = 0;
let roundCount = 0;
let totalRoundEntered = 0;
let gameStarted = false;
let gameWinner = '';
let gameId = 0;

// Check the clicks and call respective functions
function getClickedElement(e) {

    e.stopPropagation();

    const clickedNode = e.target;

    // If start game btn is clicked
    if (clickedNode.closest('button') && clickedNode.id === 'start-game') {

        // Filter input and return input value
        const isValid = checkTotalRoundInput();
        
        // Stop if error is returned
        if (isValid.error) {

            return alert(isValid.error);

        }
        
        // Call startGame function if valid === truthy
        if (isValid.valid) {

            const gameHasStarted = startGame(isValid.value);

            if (gameHasStarted) {
                
                gameStarted = true;
                totalRoundEntered = isValid.value;
                gameId = Math.floor(Math.random() * 100); // To be continued, fix for better random id

            }

        }

    }

    // Rock, Paper, Scissors click handler
    if (clickedNode.closest('button') && ['rock', 'paper', 'scissors'].includes(clickedNode.id)) {

        // If any of the 3 btns is clicked, listens for unload
        enableUnloadWarning();
        
        // Triggers showing the picks and return selections as obj
        const roundPickings = showPicks(clickedNode);
        // My first descturturing ahahaha
        const {humanPicking, computerPicking} = roundPickings;

        const yourScoreDisplay = DOMQuery.gamePanelContainer.querySelector('#your-score');
        const computerScoreDisplay = DOMQuery.gamePanelContainer.querySelector('#computer-score');
        const currentRoundDisplay = DOMQuery.gamePanelContainer.querySelector('#current-round');
        const roundWinnerDisplay = DOMQuery.gamePanelContainer.querySelector('#round-winner');
        
        const resultCombo = {
            RP: 'computer',
            RS: 'human',
            RR: 'tie',
            PR: 'human',
            PS: 'computer',
            PP: 'tie',
            SR: 'computer',
            SP: 'human',
            SS: 'tie'
        };

        const picking = humanPicking.charAt(0) + computerPicking.charAt(0);
        
        if (!picking in resultCombo) {

            return alert('You picked or computer picked something out of bounds!');

        }
        // This feels nonesense here but I will just go with this ahaha
        if (gameStarted === false || totalRoundEntered === 0) {
            return alert('Game has not started yet or no rounds entered.');
        }

        switch (resultCombo[picking]) {
            case 'human':
                
                yourScoreCount++;
                roundCount++;
                yourScoreDisplay.textContent = yourScoreCount;
                currentRoundDisplay.textContent = roundCount;
                roundWinnerDisplay.textContent = 'You Win!';

                break;
        
            case 'computer':
                
                computerScoreCount++;
                roundCount++;
                computerScoreDisplay.textContent = computerScoreCount;
                currentRoundDisplay.textContent = roundCount;
                roundWinnerDisplay.textContent = 'You Lost!';

                break;
            
            case 'tie':
                
                roundCount++;
                currentRoundDisplay.textContent = roundCount;
                roundWinnerDisplay.textContent = 'TIE!';

                break;
        }

        const midSection = DOMQuery.gamePanelContainer.querySelector('.mid');
        const botSection = DOMQuery.gamePanelContainer.querySelector('.bot');
        const picksSection = midSection.querySelector('.picks');

        // Disable selection buttons to avoid clicks
        const selectionBtns = midSection.querySelectorAll('BUTTON');
        selectionBtns.forEach(btn => {
            btn.disabled = true;
            btn.classList.toggle('btn-disabled');
        });

        // Creates matchResult record
        const matchResult = {
            humanScore: yourScoreCount, 
            computerScore: computerScoreCount,
            numberOfRounds: totalRoundEntered,
            currentRound: roundCount,
            datePlayed: new Date().toLocaleDateString(),
            gameId: gameId
        };
        
        if (roundCount < totalRoundEntered) {
            // Set pending as default
            matchResult.matchStatus = 'pending';

            // Save as pending
            savePendingGame(matchResult, gameId); // To be continued. Not true random
        }
    
        // Check if round is done
        if (roundCount === totalRoundEntered) {

            setTimeout(() => {

                // To be continued....
                if (yourScoreCount > computerScoreCount) {
                    picksSection.innerHTML = `
                        <div>
                            <h3>You WON this game!</h3>
                            <button type="button" id="start-new-game" class="btn-darkblue">Start New Game</button>
                            <p>Game record saved!</p>
                        </div>
                    `;
                    picksSection.classList.toggle('win');
                    gameWinner = 'human';

                } else if (yourScoreCount === computerScoreCount) {
                    picksSection.innerHTML = `
                        <div>
                            <h3>It was a TIE!</h3>
                            <button type="button" id="start-new-game" class="btn-darkblue">Start New Game</button>
                            <p>Game record saved!</p>
                        </div>
                    `;
                    picksSection.classList.toggle('tie');
                    gameWinner = 'tie';

                } else {
                    picksSection.innerHTML = `
                        <div>
                            <h3>You LOST this game!</h3>
                            <button type="button" id="start-new-game" class="btn-darkblue">Start New Game</button>
                            <p>Game record saved!</p>
                        </div>
                    `;
                    picksSection.classList.toggle('loss');
                    gameWinner = 'computer';

                }

                DOMQuery.gamePanelContainer.removeChild(botSection);

                // Reset to avoid persisting in-memory value
                gameStarted = false;
                totalRoundEntered = 0;
                yourScoreCount = 0;
                computerScoreCount = 0;
                roundCount = 0;

                // Saves to localStorage
                matchResult.matchStatus = 'completed';
                matchResult.gameWinner = gameWinner;
                saveCompletedGame(matchResult);

                removeUnloadWarning();

            }, 800);
            
        }

        // Allows click again
        setTimeout(() => {
            selectionBtns.forEach(btn => {
                btn.disabled = false;
                btn.classList.toggle('btn-disabled');
            });
        }, 700);

    }

    // Handle click for Quit Game btn
    if (clickedNode.closest('button') && clickedNode.id === 'quit-game') {

        console.log(clickedNode); // To be continued / almost doneeee

    }

    // Handle click for Start New Game btn 
    if (clickedNode.closest('button') && clickedNode.id === 'start-new-game') {
        
        displayMidSection();

    }

    // Handle click for clearing entire game record
    // To be continued, has bug. When game is in progress and you click clear game
    // In-memory still retains some variable
    if (clickedNode.closest('button') && clickedNode.id === 'clear-game') {

        const completedGameHistory = getGameHistory('completed');
        const pendingGameHistory = getGameHistory('pending');

        if (completedGameHistory.length || pendingGameHistory.length) {

            const confirmDelete = confirm('Are you sure you want to delete all game records?');

            if (confirmDelete) {
                localStorage.removeItem('pendingGameHistory');
                localStorage.removeItem('completedGameHistory');

                showGameRecord('pending');
                showGameRecord('completed');
                showWinRate();
                // Also resets gameID
                gameId = 0;
                displayMidSection();

            }
        } else {

            clickedNode.textContent = 'No history to delete!';
            setTimeout(() => {
                clickedNode.textContent = 'Clear Game History';
            }, 1000);

        }

    }

}

/*
* For now, I will stick with this. If I like it next time
* I'll try to make a singleton-like object that have methods
* That save, clear and retrieve gameResult
*/
function saveCompletedGame(matchResult) {
    // Retrieves fresh record
    const completedGameHistory = getGameHistory('completed');

    const findPending = getGameHistory('pending');

    completedGameHistory.push(matchResult);
    localStorage.setItem('completedGameHistory', JSON.stringify(completedGameHistory));

    const currentSavedPending = findPending.findIndex(item => item.gameId === matchResult.gameId);

    findPending.splice(currentSavedPending, 1);

    localStorage.setItem('pendingGameHistory', JSON.stringify(findPending));

    gameId = 0;

    showGameRecord('completed');
    showGameRecord('pending');
    showWinRate();

}

function savePendingGame(pendingMatch, currentGameId) {

    // Retrieves fresh record
    const pendingGameHistory = getGameHistory('pending');

    pendingGameHistory.push(pendingMatch);

    localStorage.setItem('pendingGameHistory', JSON.stringify(pendingGameHistory));

    if (pendingGameHistory.length >= 1) {

        const currentGamePendings = pendingGameHistory
        .filter(games => games.gameId && games.gameId === currentGameId)
        .sort((a, b) => a.gameId - b.gameId);

        const currentGameLastPending = currentGamePendings[currentGamePendings.length - 1];

        currentGamePendings.forEach(item => {

            const index = pendingGameHistory.findIndex(idx => idx.gameId === item.gameId);
            
            pendingGameHistory.splice(index, 1);

        });

        pendingGameHistory.push(currentGameLastPending);

        localStorage.setItem('pendingGameHistory', JSON.stringify(pendingGameHistory));

    }

    showGameRecord('completed');
    showGameRecord('pending');
    showWinRate();

}

// Triggers showing the picks and return selections as obj
function showPicks(clickedElem) {

    const youPickedDisplay = DOMQuery.gamePanelContainer.querySelector('#you-picked');
    const computerPickedDisplay = DOMQuery.gamePanelContainer.querySelector('#computer-picked');
    const computerPick = getComputerPick();
    const showSpinner = createSpinnerEffect();
    const parentOfSpinner = computerPickedDisplay.parentNode;
    parentOfSpinner.style.display = 'flex';

    switch (clickedElem.id) {
        case 'rock':

            youPickedDisplay.textContent = clickedElem.textContent;
            parentOfSpinner.removeChild(computerPickedDisplay);
            parentOfSpinner.appendChild(showSpinner);

            setTimeout(() => {

            // parentOfSpinner.style.removeProperty('display'); Only removes the display
            parentOfSpinner.removeAttribute('style'); // Using for now since there is no other styles in the node
            parentOfSpinner.removeChild(showSpinner);
            computerPickedDisplay.textContent = computerPick;
            parentOfSpinner.appendChild(computerPickedDisplay);

            }, 400);

        break;

        case 'paper':

            youPickedDisplay.textContent = clickedElem.textContent;
            parentOfSpinner.removeChild(computerPickedDisplay);
            parentOfSpinner.appendChild(showSpinner);

            setTimeout(() => {

            parentOfSpinner.removeAttribute('style');
            parentOfSpinner.removeChild(showSpinner);
            parentOfSpinner.appendChild(computerPickedDisplay);
            computerPickedDisplay.textContent = computerPick;

            }, 400);

        break;

        case 'scissors':

            youPickedDisplay.textContent = clickedElem.textContent;
            parentOfSpinner.removeChild(computerPickedDisplay);
            parentOfSpinner.appendChild(showSpinner);

            setTimeout(() => {

            parentOfSpinner.removeAttribute('style');
            parentOfSpinner.removeChild(showSpinner);
            parentOfSpinner.appendChild(computerPickedDisplay);
            computerPickedDisplay.textContent = computerPick;

            }, 400);

        break;
    }

    // Returning the selction for round winner decision
    return {
        humanPicking: youPickedDisplay.textContent,
        computerPicking: computerPick
    };

}

// Check if total round input has value
function checkTotalRoundInput() {

    // DOM query
    const totalRoundInput = document.querySelector('#total-rounds');

    // Parse to int since these are strings
    const min = parseInt(totalRoundInput.min, 10) || 1; // 1
    const max = parseInt(totalRoundInput.max, 10) || 10; // 10
    const totalRoundEntered = totalRoundInput.value.trim();

    // Check for space
    if (totalRoundEntered === '') {

        return {
            valid: false,
            error: 'Input is empty.',
            value: null
        };

    }

    // Parse to int
    const parsedTotalRoundEntered = parseInt(totalRoundEntered, 10);

    if (isNaN(parsedTotalRoundEntered)) {

        return {
            valid: false,
            error: 'Input value must be a number.',
            value: parsedTotalRoundEntered
        };

    }

    if (parsedTotalRoundEntered < min || parsedTotalRoundEntered > max) {
        
        return {
            valid: false,
            error: 'Input is out of bounds.',
            value: parsedTotalRoundEntered
        };

    }

    // If valid
    return {
        valid: true,
        value: parsedTotalRoundEntered
    };

}

/* === Game Logic Functions === */

function startGame(totalRounds) {

    // Guard, in case function is used differently
    if (!totalRounds) {

        return alert('Please enter number of rounds!');

    }

    // Render the selection component
    renderSelection();

    return true;

}

function renderBottomSection() {
    
    // Create the component
    const botSection = displayBottomSection();
    
    // Append to the game-panel
    DOMQuery.gamePanelContainer.appendChild(botSection);

}

function renderSelection() {

    let countDown = 3;
    
    const midSection = DOMQuery.gamePanelContainer.querySelector('.mid');

    // Clear the section to remove new entry while game is starting
    midSection.innerHTML = '';

    // Attach the spinner
    const showSpinner = createSpinnerEffect();
    midSection.appendChild(showSpinner);

    // Create the loading display
    const loadingDots = createLoadingDots();

    // Show the game starting loader
    const showLoading = setInterval(() => {

        if (countDown > 0) {

            // Apply the loading
            midSection.appendChild(loadingDots);

            countDown--;

        } else {

            // Remove the loading
            midSection.removeChild(showSpinner);
            midSection.removeChild(loadingDots);

            // Display the selection for [Rock, Paper, Scissors]
            displaySelectionComponent();

            // Render bot section with quit game btn
            renderBottomSection();
            
            // Stops the interval
            clearInterval(showLoading);

            // Display the total round entered
            const totalRoundDisplay = midSection.querySelector('#total-round');
            totalRoundDisplay.textContent = totalRoundEntered;

        }

    }, 800);

}

// Prevents browser reload/close
function handleBeforeUnload(e) {

    e.preventDefault();

    e.returnValue = '';

}

// Call this when there is game progress
function enableUnloadWarning() {
    
    window.addEventListener('beforeunload', handleBeforeUnload);

}

// Call to remove the listener if unused
function removeUnloadWarning() {

    window.removeEventListener('beforeunload', handleBeforeUnload);

}

/* === Event Listeners === */

// Bind click event listener to the game-panel container
DOMQuery.gamePanelContainer.addEventListener('click', getClickedElement);