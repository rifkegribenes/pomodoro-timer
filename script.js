var sessionLength = 60;
var breakLength = 60;
var state = "start";
var timeLeft, prevState, timeinterval, audio;
var alarm = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1018136/file-bb_sunny.mp3';

$('#timer').hide();
$('.pickwrap').show();

function convertTime(num) {
    var hours = Math.floor(num / 3600);
    var minutes = Math.floor((num - (hours * 3600)) / 60);
    var seconds = num - (hours * 3600) - (minutes * 60);
    if (hours !== 0 && minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (hours === 0) {
        return minutes + ':' + seconds;
    } else {
        return hours + ':' + minutes + ':' + seconds;
    }
}

$('.start').click(function () {
    $('.controls').fadeOut();
    $('.pickwrap').hide();
    start();
    $('.ctoggle').show();
    $('#timer').show();
});

$('.ctoggle').click(function () {
    $('.timeLeft').fadeToggle("fast", "linear");
    $('.controls').fadeToggle("fast", "linear");
    $('.pickwrap').hide();
});

$('body').on("tap", function () {
    $('.timeLeft').fadeOut();
    $('.controls').fadeIn();
});


$('.pause').click(function () {
    pause();
});

$('.reset').click(function () {
    reset();
});

function start() {
    switch (state) {
        case "start":
            state = "session";
            prevState = "start";
            timeLeft = sessionLength;
            $('.clock').addClass('anim-sess');
            break;
        case "paused":
            if (prevState === "session") {
                state = "session";
                $('.clock').addClass('anim-sess');
                prevState = "paused";
            } else if (prevState === "break") {
                state = "break";
                $('.clock').addClass('anim-break');
                prevState = "paused";
            }
            break;
        case "break":
            state = "session";
            $('.state').html(state);
            timeLeft = sessionLength;
            $('.anim-break').removeClass('anim-break');
            $('.clock').addClass('anim-sess');
            break;
        case "session":
            state = "break";
            $('.state').html(state);
            timeLeft = breakLength;
            $('.anim-sess').removeClass('anim-sess');
            $('.clock').addClass('anim-break');
            break;
    }
    startTimer(timeLeft);
}

function pause() {
    clearInterval(timeinterval);
    switch (state) {
        case "session":
            state = "paused";
            $('.state').html(state);
            prevState = "session";
            break;
        case "break":
            state = "paused";
            $('.state').html(state);
            prevState = "break";
            break;
        default:
    }
}

function reset() {
    console.log('reset');
    $('#timer').hide();
    state = 'start';
    timeLeft = 0;
    sessionLength = 60;
    breakLength = 60;
    degrees = 0;
    clearInterval(timeinterval);
    $('.anim-sess').removeClass('anim-sess');
    $('.anim-break').removeClass('anim-break');
    $('.pickwrap').show();
    $("#s-time").html('1:00');
    $("#b-time").html('1:00');
    $('.state').html('Session');
    $('.timeleft').html('1:00');

}

$('#s-up').click(function () {
    if (state === "start" || (state === "paused" && prevState === "break")) {
        sessionLength = sessionLength + 60;
        $("#s-time").html(convertTime(sessionLength));
        $('.timeleft').html(convertTime(sessionLength));
    }
});
$('#s-dn').click(function () {
    if (state === "start" || (state === "paused" && prevState === "break")) {
        if (sessionLength >= 120) {
            sessionLength = sessionLength - 60;
            $("#s-time").html(convertTime(sessionLength));
            $('.timeleft').html(convertTime(sessionLength));
        }
    }
});
$('#b-up').click(function () {
    if (state === "start" || (state === "paused" && prevState === "session")) {
        breakLength = breakLength + 60;
        $("#b-time").html(convertTime(breakLength));
    }
});
$('#b-dn').click(function () {
    if (state === "start" || (state === "paused" && prevState === "session")) {
        if (breakLength >= 120) {
            breakLength = breakLength - 60;
            $("#b-time").html(convertTime(breakLength));
        }
    }
});

// ====================
//timer code based on an example by juan cabrera: https://codepen.io/cabrera/pen/DqJnI
// ====================

var count = 0;
var degrees = 0;
var tL = 0;

function startTimer(s) {
    console.log('starting at ' + degrees + 'degrees');
    if (prevState !== 'paused') {
        degrees = 0;
    }
    if (state == 'session') {
        tL = sessionLength;
    } else if (state == 'break') {
        tL = breakLength;
    }
    $('.state').html(state);

    function updateDisplay() {
        console.log('updating at ' + degrees + 'degrees');
        $('.n').html(convertTime(timeLeft));
        timeLeft--;
        if (timeLeft === 0) {
            clearInterval(timeinterval);
            audio = new Audio(alarm);
            audio.play();
            start();
        }
        $('.glow-container').css('webkitTransform', 'rotateZ(' + degrees + 'deg)');
        $('.glow-container').css('transform', 'rotateZ(' + degrees + 'deg)');
        $('.pie.l').css('transform', 'rotate(' + degrees + 'deg)');
        $('.pie.r').css('transform', 'rotate(' + degrees + 'deg)');
        degrees += (360 / tL);
    }
    updateDisplay();
    timeinterval = setInterval(updateDisplay, 1000);

}
