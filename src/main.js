// Compiled JavaScript (ES5) from the Babel
$('document').ready(function () {

    // Initialize sounds
    var ClickIt = {
        count: 0, // 0-20
        inputs: [], // 1-4's representing player inputs
        playerErrors: 0, // 0-3
        readyForInput: false,
        strict: false,
        // 0 is error tones, 1-4 are buttons tones, 5 is winning tone
        tones: [new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'), new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'), new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'), new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'), new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')],
        sequence: [] // 1-4's representing correct sequence


        // Button handlers
    };$('.ci__btn').click(function () {
        buttonPress($(this).attr('id'));
    });
    $('.ci__start-btn').click(function () {
        $('.ci__start-btn').addClass('ci__btn--on');
        setTimeout(function () {
            $('.ci__start-btn').removeClass('ci__btn--on');
        }, 200);
        newGame();
    });
    $('.ci__strict-btn').click(function () {
        toggleStrict();
    });

    // Button logic
    var buttonPress = function buttonPress(buttonId) {
        if (ClickIt.readyForInput) {
            ClickIt.readyForInput = false;
            // Convert number word to number
            var buttonNum = translateNumber(buttonId);
            activate(buttonNum);
            addInput(buttonNum);
            checkInputs();
        }
    };

    var activate = function activate(button) {
        // Convert button number to ID (word)
        var buttonId = '#' + translateNumber(button);
        $(buttonId).addClass('ci__btn--on');
        setTimeout(function () {
            $(buttonId).removeClass('ci__btn--on');
        }, 200);
        ClickIt.tones[button].currentTime = 0;
        ClickIt.tones[button].play();
    };

    var toggleStrict = function toggleStrict() {
        if (ClickIt.strict) {
            ClickIt.strict = false;
            $('.ci__strict-btn').removeClass('ci__btn--on');
        } else {
            ClickIt.strict = true;
            $('.ci__strict-btn').addClass('ci__btn--on');
        }
    };

    var translateNumber = function translateNumber(given) {
        var result = 'error';
        switch (given) {
            case 'one':
                result = 1;
                break;
            case 'two':
                result = 2;
                break;
            case 'three':
                result = 3;
                break;
            case 'four':
                result = 4;
                break;
            case 1:
                result = 'one';
                break;
            case 2:
                result = 'two';
                break;
            case 3:
                result = 'three';
                break;
            case 4:
                result = 'four';
                break;
        }
        if (result === 'error') {
            throw new Error('Triend to translate an unexpected number.');
        }
        return result;
    };

    // Game logic
    var newGame = function newGame() {
        ClickIt.count = 0;
        ClickIt.inputs = [];
        ClickIt.playerErrors = 0;
        ClickIt.readyForInput = false;
        ClickIt.sequence = [];

        addColor();
        displayCount(ClickIt.count);
        playSequence(ClickIt.sequence);
        ClickIt.readyForInput = true;
    };

    var addColor = function addColor() {
        var newColorNum = random(4);
        ClickIt.sequence.push(newColorNum);
        ClickIt.count++;
        return ClickIt;
    };

    var addInput = function addInput(buttonNum) {
        ClickIt.inputs.push(buttonNum);
    };

    var checkInputs = function checkInputs() {
        // Boolean checks and helper variables
        var sequencesMatch = ClickIt.sequence.join('') === ClickIt.inputs.join('');
        var inputsLength = ClickIt.inputs.length;
        var sequenceSoFar = ClickIt.sequence.slice(0, inputsLength);
        var sequencesMatchSoFar = sequenceSoFar.join('') === ClickIt.inputs.join('');
        var hasAnotherChance = !ClickIt.strict && ClickIt.playerErrors < 2; // will be checked as player is making a mistake...2 previous = 3 total now...

        if (sequencesMatch && inputsLength === 20) {
            // winner!
            displayWin();
            setTimeout(newGame, 4000);
        } else if (sequencesMatch) {
            // correct and ready for additional color
            ClickIt.inputs = [];
            addColor();
            setTimeout(function () {
                displayCount(ClickIt.count);
                playSequence(ClickIt.sequence);
                ClickIt.readyForInput = true;
            }, 1000);
        } else if (sequencesMatchSoFar) {
            // correct so far, ready for next input
            ClickIt.readyForInput = true;
        } else if (!sequencesMatchSoFar && hasAnotherChance) {
            // wrong, but have more chances
            ClickIt.playerErrors++;
            ClickIt.inputs = [];
            displayError(ClickIt.playerErrors);
            setTimeout(function () {
                displayCount(ClickIt.count);
                playSequence(ClickIt.sequence);
                ClickIt.readyForInput = true;
            }, 1000);
        } else if (!sequencesMatchSoFar && !hasAnotherChance) {
            // wrong, no more chances
            displayGameOver();
            setTimeout(newGame, 3000);
        }
    };

    // Returns a random number 1-max
    var random = function random(max) {
        var randomDecimal = Math.random();
        var randomNumber = Math.floor(randomDecimal * max) + 1;
        return randomNumber;
    };

    // User feedback functions ( display & audio )
    var displayCount = function displayCount(count) {
        var twoDigitCount = count < 10 ? '0' + count : '' + count;
        $('.ci__count').html(twoDigitCount);
    };

    var displayError = function displayError(errors) {
        var display = '!';
        for (var e = 1; e < errors; e++) {
            display += '!';
        }
        $('.ci__count').html(display);
    };

    var displayGameOver = function displayGameOver() {
        $('.ci__count').html('--');
    };

    var displayWin = function displayWin() {
        $('.ci__count').html('++');
    };

    var playSequence = function playSequence(sequence) {
        activate(sequence[0]);
        var restOfSequence = sequence.slice();
        restOfSequence.shift();
        if (restOfSequence.length > 0) {
            setTimeout(function () {
                playSequence(restOfSequence);
            }, 500);
        } else {
            return;
        }
    };
});
