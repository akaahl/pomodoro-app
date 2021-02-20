const body = document.getElementsByTagName('body')[0];
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const settingsContainer = document.getElementById('settings-container');
const settingsBox = document.getElementById('settings-box');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const appContainer = document.getElementById('app-container');
const timerNumber = document.getElementById('timer-number');
const circularRing = document.getElementById('circular-ring');
const navLinkBtns = document.querySelectorAll('.nav-link');
const animationStarts = document.querySelector('.animation-start');
const fontButtons = document.querySelectorAll('.radio-btn');
const colorButtons = document.querySelectorAll('.color-radio-btn');
const numberInputSettings = document.querySelectorAll('.number-input');
let startingMinutes = timerNumber.innerText.split(':')[0];
let time = startingMinutes * 60;
let defaultRingColor = '#fb743e';
let defaultConicGradient = `conic-gradient(#fb743e 0deg, #fb743e 360deg)`;
let convertToDeg, timerInterval, pomodoroValue, shortBreakValue, longBreakValue;

// IIFE for timerSettings; workaround on initial document load for animationStarts.style.left position
(function() {
    animationStarts.style.left = `5px`;
    numberInputSettings[1].disabled = true;
    numberInputSettings[1].style.background = `lightgray`;
    numberInputSettings[2].disabled = true;
    numberInputSettings[2].style.background = `lightgray`;
})();

// To be used in clickHandler function 
function defaultStyling() {
    circularRing.style.background = defaultConicGradient;
    clearInterval(timerInterval);
    startBtn.innerHTML = `start`;
    startBtn.style.display = `block`;
    pauseBtn.style.display = `none`;
}

// Click handler for pomodoro, short and long break
function clickHandler(e) {
    if (e.target.classList.contains('pomodoro')) {
        if (pomodoroValue) {
            startingMinutes = +(pomodoroValue.split(':')[0]);
            time = startingMinutes * 60;
            timerNumber.innerHTML = pomodoroValue;
        } else  {
            startingMinutes = 25;
            time = startingMinutes * 60;
            timerNumber.innerHTML = `25:00`
        }
        animationStarts.style.left = `5px`;
        defaultStyling();
        numberInputSettings[0].disabled = false;
        numberInputSettings[0].style.background = `#dbf6e9`;
        numberInputSettings[1].disabled = true;
        numberInputSettings[1].style.background = `lightgray`;
        numberInputSettings[2].disabled = true;
        numberInputSettings[2].style.background = `lightgray`;

    } else if (e.target.classList.contains('short-break')) {
        if (shortBreakValue) {
            startingMinutes = +shortBreakValue.split(':')[0];
            time = startingMinutes * 60;
            timerNumber.innerHTML = shortBreakValue;
        } else  {
            timerNumber.innerHTML = `5:00`;
            startingMinutes = 5;
            time = startingMinutes * 60;
        }
        animationStarts.style.left = `128px`;
        defaultStyling();
        numberInputSettings[0].disabled = true;
        numberInputSettings[0].style.background = `lightgray`;
        numberInputSettings[1].disabled = false;
        numberInputSettings[1].style.background = `#dbf6e9`;
        numberInputSettings[2].disabled = true;
        numberInputSettings[2].style.background = `lightgray`;

    } else if (e.target.classList.contains('long-break')) {
        if (longBreakValue) {
            startingMinutes = +longBreakValue.split(':')[0];
            time = startingMinutes * 60;
            timerNumber.innerHTML = longBreakValue;
        } else {
            timerNumber.innerHTML = `15:00`;
            startingMinutes = 15;
            time = startingMinutes * 60;
        }
        animationStarts.style.left = `250px`;
        defaultStyling();
        numberInputSettings[0].disabled = true;
        numberInputSettings[0].style.background = `lightgray`;
        numberInputSettings[1].disabled = true;
        numberInputSettings[1].style.background = `lightgray`;
        numberInputSettings[2].disabled = false;
        numberInputSettings[2].style.background = `#dbf6e9`;
    }
}

navLinkBtns.forEach(nav => {
    nav.addEventListener('click', clickHandler);
});

// Function for circular ring color; to be used in updateCircularRing function
let circularRingColor = () => {
    circularRing.style.background = `conic-gradient(
        ${defaultRingColor} 0deg,
        ${defaultRingColor} ${convertToDeg - 1}deg,
        #0a043c ${convertToDeg}deg,
        #0a043c 360deg
    )`;
}

// Function for timerCountdown
function timerCountdown() {
    const minutes = Math.floor(time/60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerNumber.innerHTML = `${minutes}:${seconds}`;
    time--;
    
    if (time <= -1) {
        timerNumber.innerHTML = `0:00`;
        clearInterval(timerInterval);
        pauseBtn.innerHTML = `completed!`;
    }
    
    // Update circular ring
    const updateCircularRing = () => {
        convertToDeg = (time/(startingMinutes*60)) * 360;
            circularRingColor();
    }
    updateCircularRing();
}

// Scale in-out function
function scaleTimer() {
    appContainer.style.transform = `scale(0.98)`;
    setTimeout(() => {
        appContainer.style.transform = `scale(1)`;
    }, 70);
}

// Timer init
function timerInit() {
    scaleTimer();
    timerCountdown();
    timerInterval = setInterval(timerCountdown, 1000);
    startBtn.style.display = `none`;
    pauseBtn.style.display = `block`;
}

function timerPause() {
    scaleTimer();
    clearInterval(timerInterval);
    startBtn.innerHTML = `resume`;
    startBtn.style.display = `block`;
    pauseBtn.style.display = `none`;
}

// Start/Pause the timer countdown
startBtn.addEventListener('click', timerInit);
pauseBtn.addEventListener('click', timerPause)

// Add/remove visibility on settings
settingsBtn.addEventListener('click', () => {
    setTimeout(() => {
        settingsContainer.classList.add('show');
    }, 300);
});

closeSettingsBtn.addEventListener('click', () => {
    settingsContainer.classList.remove('show');
})

// Function to change timer settings value
function timerSettings(e) {
    if (e.target.classList.contains('pomodoro-settings') && animationStarts.style.left === `5px`) {
        timerNumber.innerText = `${e.target.value}:00`;
        pomodoroValue = timerNumber.innerText;
        startingMinutes = +pomodoroValue.split(':')[0];
        time = startingMinutes * 60;

    } else if (e.target.classList.contains('short-break-settings') && animationStarts.style.left === `128px`) {
        timerNumber.innerText = `${e.target.value}:00`;
        shortBreakValue = timerNumber.innerText;
        startingMinutes = +shortBreakValue.split(':')[0];
        time = startingMinutes * 60;
        
    } else if (e.target.classList.contains('long-break-settings') && animationStarts.style.left === `250px`) {
        timerNumber.innerText = `${e.target.value}:00`;
        longBreakValue = timerNumber.innerText;
        startingMinutes = +longBreakValue.split(':')[0];
        time = startingMinutes * 60;
    }
};

// Change number settings value
numberInputSettings.forEach(setting => {
    setting.addEventListener('click', timerSettings)
});

// Selecting font type
fontButtons.forEach(font => {
    font.addEventListener('click', e => {
        if (e.target.classList.contains('roboto-btn')) {
            body.style.fontFamily = `"Roboto", sans-serif`;
            settingsBox.style.height = `400px`
            body.style.fontSize = `16px`;
        } else if (e.target.classList.contains('lato-btn')) {
            body.style.fontFamily = `"Lato", sans-serif`;
            body.style.fontSize = `16px`;
            settingsBox.style.height = `400px`
        } else if (e.target.classList.contains('oswald-btn')) {
            body.style.fontFamily = `"Oswald", sans-serif`;
            body.style.fontSize = `18px`;
            settingsBox.style.height = `420px`
        }
    });
});

// Selecting color type 
colorButtons.forEach(color => {
    color.addEventListener('click', e => {
        if (e.target.classList.contains('orange-radio-btn')) {
            defaultConicGradient = `conic-gradient(#fb743e 0deg, #fb743e 360deg)`;
            circularRing.style.background = `conic-gradient(#fb743e 0deg, #fb743e 360deg)`;
            defaultRingColor = '#fb743e';
        } else if (e.target.classList.contains('cyan-radio-btn')) {
            defaultConicGradient = `conic-gradient(cyan 0deg, cyan 360deg)`;
            circularRing.style.background = `conic-gradient(cyan 0deg, cyan 360deg)`;
            defaultRingColor = 'cyan';
        } else if (e.target.classList.contains('purple-radio-btn')) {
            defaultConicGradient = `conic-gradient(#9088d4 0deg, #9088d4 360deg)`;
            circularRing.style.background = `conic-gradient(#9088d4 0deg, #9088d4 360deg)`;
            defaultRingColor = '#9088d4';
        }
    })
})

