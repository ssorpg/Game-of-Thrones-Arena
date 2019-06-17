// Not going to use objects this time, per recommendation

// GLOBALS

// Never reset
var wins = 0; // Incrementable
var losses = 0;

const possibleCharacters = [
    ['Bronn', 'Jon Snow', 'Arya Stark', 'Gregor Clegane'],
    ['bronn.jpg', 'jonsnow.jpg', 'aryastark.jpg', 'gregorclegane.jpg'],
    [100, 120, 80, 140],
    [6, 5, 9, 4],
    [14, 13, 16, 9]
];

// Reset every game
var playerName;
var playerHealth;
var playerAttack;
var attackIncrease;

var opponentName;
var opponentHealth;
var opponentAttack;
var opponentsLeft = 0;

var currentStage = 1; // What stage are we in? (1 - character selection, 2 - opponent selection, 3 - fight stage, 4 - end stage)



// FUNCTIONS
function opponentCount() {
    $('.character').each(function () {
        opponentsLeft++;
    });
}

function characterSelect(player) {
    $('#fightArea').prepend(player); // Move character to fight area
    $(player).attr('class', 'playerCharacter col-2'); // So we can select it easily later

    opponentCount(); // How many other characters do we have to defeat?
    $('.character').css('background-color', '#f44336'); // Red background for the other character

    playerHealth = parseInt($(player).attr('health')); // Get our attributes
    playerAttack = parseInt($(player).attr('attack'));
    attackIncrease = playerAttack;

    currentStage++; // Next stage

    $('.character').find('.counter').css('display', 'block'); // Turn on the counter attack display
    $('.character').find('.attack').css('display', 'none'); // Turn off the attack display

    $('#instructions').text('Select an opponent to fight');
    $('#versus').text('VERSUS');
}

function clearCombatText() {
    $('#damageDealt').text('');
    $('#damageTaken').text('');
    $('#matchResult').text('');
}

function selectFight(opponent) {
    clearCombatText(); // Reset the combat text when we select an opponent

    $('#fightArea').append(opponent);
    $(opponent).attr('class', 'opponentCharacter col-2'); // So we can select it easily later

    opponentName = $('.opponentCharacter').find('.name').text(); // Get our opponent's attributes
    opponentHealth = parseInt($(opponent).attr('health'));
    opponentAttack = parseInt($(opponent).attr('counter'));

    currentStage++;

    $('#instructions').text('Click on your opponent to attack them');
}

function restartGame() {
    playerName = ''; // Not sure if we need to reset our variables but do it anyway
    playerHealth = 0;
    playerAttack = 0;
    attackIncrease = 0;

    opponentName = '';
    opponentHealth = 0;
    opponentAttack = 0;
    opponentsLeft = 0;

    currentStage = 1;

    $('#characterList').empty();
    $('.playerCharacter').remove();
    $('#versus').text('');
    $('#matchResult').text('');
    $('.opponentCharacter').remove();
    $('#restartDiv').empty();
    $('#gameResult').text('');
    clearCombatText();

    setupPage();
}

function gameOver() {
    currentStage = 4;

    let restartButton = $('<button>');
    restartButton.text('Restart!');

    $(restartButton).on('click', function () {
        restartGame();
    });

    $('#restartDiv').append(restartButton);

    $('#instructions').text('Click the restart button to play again');
}

function checkStatus() {
    if (opponentHealth < 1) { // You defeated your opponent
        $('#matchResult').text('You defeated ' + opponentName + '!');
        $('#matchResult').css('color', '#4CAF50');

        $('.opponentCharacter').remove();

        opponentsLeft--;
        currentStage--; // Return to opponent selection stage

        $('#instructions').text('Select a new opponent to fight');
    }

    if (playerHealth < 1) { // You perished
        $('#matchResult').text('You were defeated by ' + opponentName + '!');
        $('#matchResult').css('color', '#f44336');

        $('#gameResult').text('You lost!');
        $('#gameResult').css('color', '#f44336');

        losses++;
        $('#losses').text('Losses: ' + losses);

        gameOver();
    }
    else if (opponentsLeft < 1) { // You defeated everyone
        $('#gameResult').text('You won!');
        $('#gameResult').css('color', '#4CAF50');

        wins++;
        $('#wins').text('Wins: ' + wins);

        gameOver();
    }
}

function attack() {
    clearCombatText();

    opponentHealth = opponentHealth - playerAttack; // Take away our opponents health
    $('#damageDealt').text('You dealt ' + playerAttack + ' damage!'); // Tell the player how much damage they dealt
    playerAttack = playerAttack + attackIncrease; // Our damage increases by the base attack every turn

    checkStatus(); // Check if our attack affected anything

    if (opponentHealth < 1) { // No need to continue if we defeated our opponent
        return;
    }

    playerHealth = playerHealth - opponentAttack;
    $('#damageTaken').text('You took ' + opponentAttack + ' damage!');

    checkStatus(); // Check if their attack affected anything
}

function updatePage() {
    $('.playerCharacter').find('.health').text('Health: ' + playerHealth);
    $('.playerCharacter').find('.attack').text('Attack: ' + playerAttack);

    $('.opponentCharacter').find('.health').text('Health: ' + opponentHealth);
    $('.opponentCharacter').find('.attack').text('Attack: ' + opponentAttack);
}

function handleClick(elementClicked) {
    if (currentStage === 1) { // Character selection stage
        characterSelect(elementClicked);
    }
    else if (currentStage === 2) { // Opponent selection stage
        selectFight(elementClicked);
    }
    else if (currentStage === 3 && $(elementClicked).hasClass('opponentCharacter')) { // Fight stage
        attack();
    }

    updatePage(); // Update character stats on the page
}

function setupPage() {
    $('#instructions').text('Select a character to play'); // Initial setup

    for (let x = 0; x < possibleCharacters[0].length; x++) { // Create the character buttons
        let name = possibleCharacters[0][x];
        let image = possibleCharacters[1][x];
        let health = possibleCharacters[2][x];
        let attack = possibleCharacters[3][x];
        let counter = possibleCharacters[4][x];

        let newCharacter = $('<button>');
        newCharacter.attr('class', 'character col-2');
        newCharacter.attr('health', health);
        newCharacter.attr('attack', attack);
        newCharacter.attr('counter', counter);

        let newName = $('<span>');
        newName.attr('class', 'name');
        newName.text(name);

        let newImage = $('<img>');
        newImage.attr('src', './Assets/Images/' + image);

        let newHealth = $('<span>');
        newHealth.attr('class', 'health');
        newHealth.text('Health: ' + health);

        let newAttack = $('<span>');
        newAttack.attr('class', 'attack');
        newAttack.text('Attack: ' + attack);

        let newCounter = $('<span>');
        newCounter.attr('class', 'counter');
        newCounter.text('Counter: ' + counter);
        newCounter.css('display', 'none'); // Hide the counter values until we select a character

        newCharacter.append(newName);
        newCharacter.append(newImage);
        newCharacter.append(newHealth);
        newCharacter.append(newAttack);
        newCharacter.append(newCounter);

        $(newCharacter).on('click', function () {
            handleClick(this);
        });

        $('#characterList').append(newCharacter);
    }
}



// DIRECT CALLS
setupPage(); // Just once on page load