let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;
let stopwatchInterval = null;
let stopwatchIsRunning = false;
let stopwatchLaps = [];
let stopwatchLastLapTime = 0;

const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const stopwatchError = document.getElementById('stopwatchError');
const stopwatchStartBtn = document.getElementById('stopwatchStart');
const stopwatchPauseBtn = document.getElementById('stopwatchPause');
const stopwatchLapBtn = document.getElementById('stopwatchLap');
const stopwatchResetBtn = document.getElementById('stopwatchReset');
const stopwatchLapsList = document.getElementById('stopwatchLapsList');


function formatStopwatchTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((milliseconds % 1000) / 10);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedCentiseconds = String(centiseconds).padStart(2, '0');

    return formattedMinutes + ':' + formattedSeconds + ':' + formattedCentiseconds;
}

// dito  inaupdate yung stopwatchj para makita yung oras
function updateStopwatchDisplay() {
    if (stopwatchIsRunning) {
        const currentTime = Date.now();
        stopwatchElapsedTime = stopwatchStartTime ? (currentTime - stopwatchStartTime) : stopwatchElapsedTime;
    }

    stopwatchDisplay.textContent = formatStopwatchTime(stopwatchElapsedTime);
}

// dito yung function na para mag start si stopwatch
function startStopwatch() {
    if (stopwatchIsRunning) {
        return;
    }

    const button = stopwatchStartBtn;
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(function() {
        stopwatchIsRunning = true;
        stopwatchStartTime = Date.now() - stopwatchElapsedTime;

        if (stopwatchLaps.length === 0) {
            stopwatchLastLapTime = stopwatchElapsedTime;
        }

        stopwatchInterval = setInterval(function() {
            updateStopwatchDisplay();
        }, 10);

        stopwatchStartBtn.style.display = 'none';
        stopwatchPauseBtn.style.display = 'flex';
        stopwatchLapBtn.disabled = false;

        button.classList.remove('loading');
        button.disabled = false;
        clearStopwatchError();
    }, 200);
}

function pauseStopwatch() {
    if (!stopwatchIsRunning) {
        return;
    }

    const button = stopwatchPauseBtn;
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(function() {
        stopwatchIsRunning = false;
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;

        stopwatchPauseBtn.style.display = 'none';
        stopwatchStartBtn.style.display = 'flex';

        button.classList.remove('loading');
        button.disabled = false;
        clearStopwatchError();
    }, 200);
}

// dito namn is sinasave yung lap time pag pinindot yung lap button
function recordStopwatchLap() {
    if (!stopwatchIsRunning && stopwatchElapsedTime === 0) {
        return;
    }

    const button = stopwatchLapBtn;
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(function() {
        const currentTime = stopwatchIsRunning ? Date.now() - stopwatchStartTime : stopwatchElapsedTime;
        const lapTime = currentTime - stopwatchLastLapTime;
        const lapNumber = stopwatchLaps.length + 1;

        stopwatchLaps.push({
            number: lapNumber,
            totalTime: currentTime,
            lapTime: lapTime
        });

        stopwatchLastLapTime = currentTime;
        displayStopwatchLaps();

        button.classList.remove('loading');
        button.disabled = false;
        clearStopwatchError();
    }, 200);
}

function displayStopwatchLaps() {
    stopwatchLapsList.innerHTML = '';

    if (stopwatchLaps.length === 0) {
        return;
    }

    stopwatchLaps.forEach(function(lap) {
        const lapItem = document.createElement('div');
        lapItem.className = 'stopwatch-lap-item';
        
        const lapNumber = document.createElement('span');
        lapNumber.className = 'stopwatch-lap-number';
        lapNumber.textContent = 'Lap ' + lap.number;
        
        const lapTime = document.createElement('span');
        lapTime.className = 'stopwatch-lap-time';
        lapTime.textContent = formatStopwatchTime(lap.lapTime);
        
        lapItem.appendChild(lapNumber);
        lapItem.appendChild(lapTime);
        stopwatchLapsList.appendChild(lapItem);
    });
}

function resetStopwatch() {
    const button = stopwatchResetBtn;
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(function() {
        stopwatchIsRunning = false;
        stopwatchElapsedTime = 0;
        stopwatchStartTime = 0;
        stopwatchLaps = [];
        stopwatchLastLapTime = 0;

        if (stopwatchInterval) {
            clearInterval(stopwatchInterval);
            stopwatchInterval = null;
        }

        stopwatchPauseBtn.style.display = 'none';
        stopwatchStartBtn.style.display = 'flex';
        stopwatchLapBtn.disabled = true;

        updateStopwatchDisplay();
        displayStopwatchLaps();
        clearStopwatchError();

        button.classList.remove('loading');
        button.disabled = false;
    }, 200);
}

function clearStopwatchError() {
    stopwatchError.textContent = '';
    stopwatchError.classList.remove('show');
}

function showStopwatchError(message) {
    stopwatchError.textContent = message;
    stopwatchError.classList.add('show');
    setTimeout(clearStopwatchError, 3000);
}

function setupStopwatchEventListeners() {
    stopwatchStartBtn.addEventListener('click', function() {
        if (!stopwatchStartBtn.disabled) {
            startStopwatch();
        }
    });

    stopwatchPauseBtn.addEventListener('click', function() {
        if (!stopwatchPauseBtn.disabled) {
            pauseStopwatch();
        }
    });

    stopwatchLapBtn.addEventListener('click', function() {
        if (!stopwatchLapBtn.disabled) {
            recordStopwatchLap();
        }
    });

    stopwatchResetBtn.addEventListener('click', function() {
        if (!stopwatchResetBtn.disabled) {
            resetStopwatch();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupStopwatchEventListeners();
    updateStopwatchDisplay();
    stopwatchLapBtn.disabled = true;
});
