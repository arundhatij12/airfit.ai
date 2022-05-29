import { pad } from '../utils/usePrimaryTimer.js'

let hour = 0;
let minute = 0;
let second = 0;

//use this timer when this is a second independent timer with one already running

//start timer function
function timer2(hrRef, minRef, secRef) {
    second += 1;

    if (second === 60) {
        second = 0;
        minute += 1;
    }
    if (minute === 60) {
        hour += 1;
        second = 0;
        minute = 0;
    }

    hrRef.innerText = pad(hour);
    minRef.innerText = pad(minute);
    secRef.innerText = pad(second);
    return [hour, minute, second] //returning these to be used with other functions
}

function resetTimer2(hrRef, minRef, secRef) {
    hour = 0
    minute = 0
    second = 0

    hrRef.innerText = pad(hour);
    minRef.innerText = pad(minute);
    secRef.innerText = pad(second);
}

export { timer2, resetTimer2 }