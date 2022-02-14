'use strict';
// V A R I A B L E S
const inputContainer = document.querySelector('.input-container'),
      countdownForm = document.querySelector('.form'),
      dateEl = document.querySelector('#date-picker'),
      countdownEl = document.querySelector('.countdown'),
      countdownElTitle = document.querySelector('#countdown__title'),
      countdownBtn = document.querySelector('#countdown__button'),
      timeElements = document.querySelectorAll('span'),
      second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24,
      completeEL = document.querySelector('.complete'),
      completeElInfo = document.querySelector('#complete__info'),
      completeBtn = document.querySelector('#complete__button');

let countdownTitle = '',
    countdownDate = '',
    countdownValue = new Date(),
    countdownActive,
    savedCountdown;

// Set date input minimum with today's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);


// F U N C T I O N S
//Populate countdown
function updateDOM () {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        const arrData = [days, hours, minutes, seconds];

        // Hide input-container
        inputContainer.hidden = true;

        // If the countdown has ended - show complete
        if (distance < 0) {
            countDownEnded();
        }

        // If the countdown is in progress
        if (distance > 0) {
            countDownInProgress(arrData);
        }
    }, second);
}

// Countdown has ended
function countDownEnded () {
    countdownEl.hidden = true;
    clearInterval(countdownActive);
    completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
    completeEL.hidden = false;
}

// Countdown is in progress
function countDownInProgress (arr) {
    // Populate countdown
    countdownElTitle.textContent = countdownTitle;
    timeElements.forEach((el, i) => {
        el.textContent = String(arr[i]).padStart(2, '0');
    });
    // Show countdown
    countdownEl.hidden = false;
}

//Get values from the input
function updateCountdown (e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    //Get number version of Date, update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

// Reset time
function reset () {
    countdownEl.hidden = true;
    completeEL.hidden = true;
    inputContainer.hidden = false;
    clearInterval(countdownActive);
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown () {
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}


// E V E N T  L I S T E N E R S
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// O N  L O A D, C H E C K  L S
restorePreviousCountdown();
