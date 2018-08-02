(function() {
    const timer = document.getElementById("timer");
    const clock = {
        "second": "00",
        "minute": "25",
        "hour": "00"
    };
    const timeRing = document.getElementById("time-ring");
    timer.innerHTML += "<p>" + clock.hour + ":" + clock.minute + ":" + clock.second + "</p>";
    timeRing.style["background-image"] = `linear-gradient( 90deg, rgb(0, 249, 255)50%, transparent 50%), linear-gradient(90deg, transparent 50%, rgb(0, 249, 255) 50%)`;
}());

const topSetting = document.getElementById("top-setting");
const timeRing = document.getElementById("time-ring");
const timer = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const stopButton = document.getElementById("stop");
const restartButton = document.getElementById("restart");
const decMinuteBreak = document.getElementById("dec-minute-break");
const incMinuteBreak = document.getElementById("inc-minute-break");
const breakNumber = document.getElementById("break-number");
const sessionNumber = document.getElementById("session-number")
const decMinuteWork = document.getElementById("dec-minute-session");
const incMinuteWork = document.getElementById("inc-minute-session");
const breakAudio = new Audio('zapsplat_cartoon_ascend_x4_short_002_12650.mp3');
const alarmAudio = new Audio('zapsplat_household_clock_alarm_digital_beep_long.mp3')

let globalTime = 25 * 60;
let originalTime = globalTime;

let breakTime = 15 * 60;
let setBreakTime = breakTime;

let interval;
let breakInterval;
let ringFlash;
let ringLit = 360 / setBreakTime;
let deg = 90;
let timerSet = false;

const transcribeToSecond = (clock) => { //clock object -> second(s); changes user input to globalTime
    time = clock.second + clock.minute * 60 + clock.hour * 3600;
    return time;
}
const transcribeToClock = (time) => { //second(s) -> clock object; 
    const clock = {
        "second": 0,
        "minute": 0,
        "hour": 0
    };
    while (time !== 0) {
        if (time >= 3600) {
            time -= 3600;
            clock.hour++;
        } else if (time >= 60 && time <= 3599) {
            time -= 60;
            clock.minute++;
        } else {
            time--;
            clock.second++
        }
    }
    if (clock.second < 10) {
        clock.second = "0" + clock.second;
    }
    if (clock.minute < 10) {
        clock.minute = "0" + clock.minute;
    }
    if (clock.hour < 10) {
        clock.hour = "0" + clock.hour;
    }
    return { "second": clock.second, "minute": clock.minute, "hour": clock.hour }
}



//--------------------------------Finished Functions---------------------------//
const ringFlashAlarm = (color) => {
    switch (color) {
        case "blue":
            timeRing.style["background-image"] === "" ? timeRing.style["background-image"] = "linear-gradient( 90deg, rgb(0, 249, 255)50%, transparent 50%), linear-gradient(90deg, transparent 50%, rgb(0, 249, 255) 50%)" :
                timeRing.style["background-image"] = "";
            break;
        case "green":
            timeRing.style["background-image"] === "" ? timeRing.style["background-image"] = "linear-gradient( 90deg, rgb(57, 255, 20)50%, transparent 50%), linear-gradient(90deg, transparent 50%, rgb(57, 255, 20) 50%)" :
                timeRing.style["background-image"] = "";
            break;
    }
}
const ringClock = (color) => {
    switch (color) {
        case "blue":
            if (deg < 270) {
                timeRing.style["background-image"] = `linear-gradient( 90deg, rgb(0, 249, 255)50%, transparent 50%), linear-gradient(${deg}deg, transparent 50%, rgb(0, 249, 255) 50%)`;
            } else if (deg === 450) {
                timeRing.style["background-image"] = "";
                return clearInterval(interval);
            } else {
                timeRing.style["background-image"] = `linear-gradient( 90deg, transparent 50%, black 50%), linear-gradient(${deg}deg, black 50%, rgb(0, 249, 255) 50%)`;
            }
            break;
        case "green":
            if (deg < 270) {
                timeRing.style["background-image"] = `linear-gradient( 90deg, rgb(57, 255, 20)50%, transparent 50%), linear-gradient(${deg}deg, transparent 50%, rgb(57, 255, 20) 50%)`;
            } else if (deg === 450) {
                timeRing.style["background-image"] = "";
                ringFlash = setInterval(() => { ringFlashAlarm(color) }, 500);
                return clearInterval(interval);
            } else {
                timeRing.style["background-image"] = `linear-gradient( 90deg, transparent 50%, black 50%), linear-gradient(${deg}deg, black 50%, rgb(57, 255, 20) 50%)`;
            }

    }
}

const time = (timeType) => {
    switch (timeType) {
        case "session":
            clock = transcribeToClock(globalTime);
            timer.innerHTML = "<p>" + clock.hour + ":" + clock.minute + ":" + clock.second + "</p>";
            ringClock("blue");
            if (globalTime === 0 && timerSet === true) {
                toggle = "breakTime";
                stopButton.style.visibility = "visible";
                startButton.style.visibility = "hidden";
                pauseButton.style.visibility = "hidden";
                restartButton.style.visibility = "hidden";
                breakAudio.play();
                deg = 90;
                breakInterval = setInterval(() => { time("break") }, 1000);
                return clearInterval(interval);
            }
            if (startButton.style.visibility !== "visible") {
                globalTime--;
                deg += ringLit;
            }
            break;
        case "break":
            breakClock = transcribeToClock(breakTime);
            timer.innerHTML = "<p>" + breakClock.hour + ":" + breakClock.minute + ":" + breakClock.second + "</p>";
            ringClock("green");
            if (breakTime === 0 && timerSet === true) {
                stopButton.style.visibility = "visible";
                startButton.style.visibility = "hidden";
                pauseButton.style.visibility = "hidden";
                restartButton.style.visibility = "hidden";
                alarmAudio.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
                alarmAudio.play();
                return clearInterval(breakInterval);
            }
            if (startButton.style.visibility !== "visible") {
                breakTime--;
                deg += ringLit;
            }
            break;
    }
}

const decrementTimer = (node) => {
    switch (node.id) {
        case "session-number":
            value = parseInt(node.innerHTML);
            originalTime = originalTime === 600 ? originalTime = 600 : originalTime -= 60;
            globalTime = originalTime;
            ringLit = 360 / originalTime;
            time("session");
            return value == 10 ? undefined : node.innerHTML = --value;
        case "break-number":
            value = parseInt(node.innerHTML);
            setBreakTime = setBreakTime === 0 ? setBreakTime = 0 : setBreakTime -= 60;
            breakTime = setBreakTime;
            ringLit = 360 / setBreakTime;
            time("break")
            return value == 0 ? undefined : node.innerHTML = --value;
    }
}
const incrementTimer = (node) => {
    switch (node.id) {
        case "session-number":
            value = parseInt(node.innerHTML);
            originalTime = originalTime === 3000 ? originalTime = 3000 : originalTime += 60;
            globalTime = originalTime;
            ringLit = 360 / originalTime;
            time("session");
            return value == 50 ? undefined : node.innerHTML = ++value;
        case "break-number":
            value = parseInt(node.innerHTML);
            setBreakTime = setBreakTime === 1800 ? setBreakTime = 1800 : setBreakTime += 60;
            breakTime = setBreakTime;
            ringLit = 360 / setBreakTime;
            time("break")
            return value == 30 ? undefined : node.innerHTML = ++value;
    }
}

const startTimer = () => {
    timerSet = true;
    startButton.style.visibility = "hidden";
    pauseButton.style.visibility = "visible";
    restartButton.style.visibility = "visible";
    topSetting.style.animation = "fadeout 1s"
    setTimeout(() => { topSetting.style.visibility = "hidden"; }, 1000);
    interval = setInterval(() => { time("session") }, 1000);
}
const pauseTimer = () => {
    startButton.style.visibility = "visible";
    pauseButton.style.visibility = "hidden";
    restartButton.style.visibility = "hidden";
    topSetting.style.visibility = "hidden";
    return clearInterval(interval);
}
const stopTimer = () => {
    timerSet = false;
    restartButton.style.visibility = "hidden";
    stopButton.style.visibility = "hidden";
    startButton.style.visibility = "visible";
    breakTime = setBreakTime;
    globalTime = originalTime;
    time("session");
    topSetting.style.animation = "fadein 1s"
    topSetting.style.visibility = "visible";
    timeRing.style["background-image"] = "linear-gradient( 90deg, rgb(0, 249, 255) 50%, transparent 50%), linear-gradient(90deg, transparent 50%, rgb(0, 249, 255) 50%)"
    deg = 90;
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    return clearInterval(ringFlash);
}
const restartTimer = () => {
    timerSet = false;
    topSetting.style.animation = "fadein 1s"
    topSetting.style.visibility = "visible";
    breakTime = setBreakTime;
    globalTime = originalTime;
    restartButton.style.visibility = "hidden";
    pauseButton.style.visibility = "hidden";
    startButton.style.visibility = "visible";
    deg = 90;
    time("session");
    return clearInterval(interval);
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
stopButton.addEventListener("click", stopTimer);
restartButton.addEventListener("click", restartTimer);
decMinuteBreak.addEventListener("click", () => { decrementTimer(breakNumber) });
decMinuteWork.addEventListener("click", () => { decrementTimer(sessionNumber) });
incMinuteBreak.addEventListener("click", () => { incrementTimer(breakNumber) });
incMinuteWork.addEventListener("click", () => { incrementTimer(sessionNumber) });