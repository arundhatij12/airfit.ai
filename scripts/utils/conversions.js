function getDayOfYear() {
    const date = new Date()
    const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    return dayOfYear;
}

function convertTimeIntoSeconds(hr, min, sec) {
    return hr * 60 * 60 + min * 60 + sec;
}


function convertTimeFromSeconds(time) {
    var hrs = Math.floor(time / 3600);
    var mins = Math.floor((time % 3600) / 60);
    var secs = Math.floor(time % 60);

    // Output like "0:01"
    var ret = '';

    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
}

function calculateJointAngle(x, y, z) {
    const radians = Math.atan2(z[1] - y[1], z[0] - y[0]) - Math.atan2(x[1] - y[1], x[0] - y[0]);
    let angle = (radians * 180) / Math.PI;
    if (angle > 180) {
        angle = 360 - angle;
    }
    return angle;
}

export { getDayOfYear, convertTimeIntoSeconds, convertTimeFromSeconds, calculateJointAngle }