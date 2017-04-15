var sessionLength = 1500;
var breakLength = 300;
var state = "start";
var timeLeft;
var prevState;
var timeinterval;
var audio;
var alarm = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1018136/file-bb_sunny.mp3';

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

$('.start').click(function() {
  $('.controls').fadeOut('slow', function(){
    start();
    $('.ctoggle').show();
  });

});


$('.ctoggle').click(function() {
  $('.timeLeft').fadeToggle( "fast", "linear");
  $('.controls').fadeToggle( "fast", "linear");
});


  $('body').on("tap",function(){
  $('.timeLeft').fadeOut();
  $('.controls').fadeIn();
});



$('.pause').click(function() {
  pause();
});

$('.reset').click(function() {
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
  $('.anim-sess').removeClass('anim-sess');
  $('.anim-break').removeClass('anim-break');
  console.log('paused');
  console.log(timeLeft);
  clearInterval(timeinterval);
 // clearInterval(radialInt);
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
  state = 'start';
  timeLeft = 0;
  sessionLength = 30;
  breakLength = 30;
  degrees = 0;
  clearInterval(timeinterval);
  $('.anim-sess').removeClass('anim-sess');
  $('.anim-break').removeClass('anim-break');
  $( ".slice" ).remove();
  $( ".glow-container" ).remove();
  $("#s-time").html('0:30');
  $("#b-time").html('0:30');
  $('.state').html('Session');
  $('.timeleft').html('0:30');
}

$('#s-up').click(function() {
  if (state === "start" || (state === "paused" && prevState === "break")) {
    sessionLength = sessionLength + 60;
    $("#s-time").html(convertTime(sessionLength));
    $('.timeleft').html(convertTime(sessionLength));
  }
});
$('#s-dn').click(function() {
  if (state === "start" || (state === "paused" && prevState === "break")) {
    if (sessionLength >= 120) {
      sessionLength = sessionLength - 60;
      $("#s-time").html(convertTime(sessionLength));
      $('.timeleft').html(convertTime(sessionLength));
    }
  }
});
$('#b-up').click(function() {
  if (state === "start" || (state === "paused" && prevState === "session")) {
    breakLength = breakLength + 60;
    $("#b-time").html(convertTime(breakLength));
  }
});
$('#b-dn').click(function() {
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
  $('#timer').html("<div class='n timeleft'></div><div class='glow-container'><div class='glow'></div></div><div class='slice'><div id='r' class='pie r'></div><div id='l' class='pie l'></div></div>");
if (prevState !== 'paused') {degrees = 0;}
  if (state == 'session') {
    tL = sessionLength;
  } else if (state == 'break') {
    tL = breakLength;
  }
  $('.state').html(state);
    function updateDisplay() {
    $('.n').html(convertTime(timeLeft));
    $('.slice').removeClass('nc');
    timeLeft--;
    if (timeLeft === 0) {
      clearInterval(timeinterval);
      audio = new Audio(alarm);
      audio.play();
      $( ".slice" ).remove();
      start();
    }
    degrees += (360 / tL);
      $('.glow-container').css('webkitTransform', 'rotateZ('+ degrees+'deg)');
      $('.glow-container').css('transform', 'rotateZ('+ degrees +'deg)');
    if (timeLeft <= (tL / 2)) {
      $('.slice').addClass("nc");
        $('.pie.r').css({
          "transform": "rotate(180deg)"
        });
      $('.pie.l').css({
        "transform": "rotate(" + degrees + "deg)"
      });
    }
     else {
      $('.pie').css({
        "transform": "rotate(" + degrees + "deg)"
      });
    }
  }
   updateDisplay();
  timeinterval = setInterval(updateDisplay, 1000);

}
