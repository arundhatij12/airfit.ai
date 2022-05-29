let hour = 0;
let minute = 0;
let second = 0;

//start timer function
function timer(hrRef, minRef, secRef) {
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

// adds the extra 0 in front of the numbers
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

//pause timer function
function pauseTimer(timerId) {
    clearTimeout(timerId)
}

function resetTimer(hrRef, minRef, secRef) {
    hour = 0
    minute = 0
    second = 0

    hrRef.innerText = pad(hour);
    minRef.innerText = pad(minute);
    secRef.innerText = pad(second);
}

export { timer, pauseTimer, pad, resetTimer }

