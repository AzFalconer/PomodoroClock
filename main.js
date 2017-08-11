$(document).ready(function() {
  //Variables
  var workTime = 25,
      breakTime = 5,
      time = 0,
      working = true,
      run = false,
      duration = 0,
      minutes = 0,
      seconds = 0,
      // Create an array to convert min & sec into binary display code. Probably a cleaner way to do this.
      // But like this better than using a lookupTable.
      lookup = [[0,0,0,0],[1,0,0,0],[0,2,0,0],[1,2,0,0],[0,0,4,0],[1,0,4,0],[0,2,4,0],[1,2,4,0],[0,0,0,8],[1,0,0,8]];
  var chime = new Audio('http://soundbible.com/mp3/Electronic_Chime-KevanGC-495939803.mp3');

  //Listen
  $("#workSub").click(function(){wrk(-1);});
  $("#workAdd").click(function(){wrk(1);});
  $("#breakSub").click(function(){brk(-1);});
  $("#breakAdd").click(function(){brk(1);});
  $("#digital").click(function(){if(run === false){run = true;startTimer();} else {run = false;startTimer();}});
  //Functions
  function wrk(t) {
    var cur = Number($("#workTime").text());
    cur += t;
    if (cur < 1) {cur = 1;}
    $("#workTime").text(cur);
    if (run === false) {$("#digital").text(cur + ":00");}
  }
  function brk(t) {
    var cur = Number($("#breakTime").text());
    cur += t;
    if (cur < 1) {cur = 1;}
    $("#breakTime").text(cur);
  }
  function startTimer() {
    if (working === true) {
      $("#work").css( "background-color", "green");
      $("#break").css( "background-color", "#515A5A");
    } else {
      $("#work").css( "background-color", "#515A5A");
      $("#break").css( "background-color", "green");
    }
    var temp = $("#digital").text(),
        duration = (Number(temp.substring(0,temp.indexOf(":")))*60); + Number(temp.substring(temp.indexOf(":")+1));
    var progress = 0,
        progIncrement = duration/100;
    var timer = setInterval(function () {
       if (run === true) {
         duration = duration - 1;
         minutes = parseInt(duration / 60, 10);
         seconds = parseInt(duration % 60, 10);
         seconds = seconds < 10 ? "0" + seconds : seconds;
         $("#digital").text(minutes + ":" + seconds);
         progress = 100-(duration/progIncrement);
         if (progress > 100) {progress = 100;}
         $("#progress").width(progress + "%");
         setBinary(minutes, seconds);
         if (duration <= 0) {
           chime.play();
           if (working === true) {
           clearInterval(timer);
           alert("Time to take a break!");
           working = false;
           $("#digital").text($("#breakTime").text() + ":00");
           } else {
             clearInterval(timer);
             alert("Back to work!");
             working = true;
             $("#digital").text($("#workTime").text() + ":00");
           }
           startTimer();
         }
       } else {clearInterval(timer);}
     }, 1000); // 1sec = 1000, for testing use 250
  }
  function setBinary(minutes, seconds) {
    $("#M4").attr('class', 'blank');
    $("#M2").attr('class', 'blank');
    $("#M1").attr('class', 'blank');
    $("#m8").attr('class', 'blank');
    $("#m4").attr('class', 'blank');
    $("#m2").attr('class', 'blank');
    $("#m1").attr('class', 'blank');
    $("#S4").attr('class', 'blank');
    $("#S2").attr('class', 'blank');
    $("#S1").attr('class', 'blank');
    $("#s8").attr('class', 'blank');
    $("#s4").attr('class', 'blank');
    $("#s2").attr('class', 'blank');
    $("#s1").attr('class', 'blank');
    // break up min & sec into 10s and 1s
    minutes = minutes.toString();
    if (minutes.length == 1) {minutes = "0" + minutes;}
    var sec10 = Number(seconds.toString().charAt(0)),
        sec1 = Number(seconds.toString().charAt(1)),
        min10 = Number(minutes.charAt(0)),
        min1 = Number(minutes.charAt(1)),
        disSec10 = lookup[sec10],
        disSec1 = lookup[sec1],
        disMin10 = lookup[min10],
        disMin1 = lookup[min1];
    for (n=0;n<4;n++) {
      var keyS10 = "#S" + disSec10[n];
      $(keyS10).attr('class', 'num');
      var keyS1 = "#s" + disSec1[n];
      $(keyS1).attr('class', 'num');
      var keyM10 = "#M" + disMin10[n];
      $(keyM10).attr('class', 'num');
      var keyM1 = "#m" + disMin1[n];
      $(keyM1).attr('class', 'num');
    }
  }
});
