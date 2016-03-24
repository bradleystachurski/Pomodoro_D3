/**
 * Created by Bradley on 3/21/16.
 */

$(document).ready(function() {

    drawProgress(1, 1);

    var $play  = $('.play'),
        $pause = $('.pause'),
        $stop  = $('.stop'),
        $time  = $('.time-input'),
        $timerSeconds = $('.timerSeconds'),
        $timerMinutes = $('.timerMinutes'),
        $timeRemaining = $('.time-remaining');

    var initialTime,
        clockPercent;

    var secondFormat = d3.time.format('%S');

    $timeRemaining.text('25:00');

    $timerMinutes.text(25);
    $timerSeconds.text('00');

    var timer = new Timer({
        onstart : function(milliseconds) {
            var seconds = Math.round(milliseconds / 1000) % 60;
            var minutes = Math.floor(Math.round(milliseconds / 1000) / 60);
            $timerSeconds.text(seconds);
            $timerMinutes.text(minutes);
            clockPercent = (Math.round(milliseconds / 1000)) / initialTime;
            playSoundBegin();
            drawProgress(clockPercent, seconds / 60);
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            document.title = 'Coloradoro ' + '(' + minutes + ':' + seconds + ')';
            $timeRemaining.text(minutes + ':' + seconds)
        },
        ontick  : function(milliseconds) {
            var seconds = Math.round(milliseconds / 1000) % 60;
            var minutes = Math.floor(Math.round(milliseconds / 1000) / 60);
            $timerSeconds.text(seconds);
            $timerMinutes.text(minutes);
            clockPercent = (Math.round(milliseconds / 1000)) / initialTime;
            drawProgress(clockPercent, seconds / 60);
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            document.title = 'Coloradoro ' + '(' + minutes + ':' + seconds + ')';
            $timeRemaining.text(minutes + ':' + seconds)
        },
        onpause : function() {
            $timerMinutes.text('');
            $timerSeconds.text('pause');
        },
        onstop  : function() {
            $timerMinutes.text('&nbsp');
            $timerSeconds.text('stop');
        },
        onend   : function() {
            $timerSeconds.text('end');
            $timerMinutes.text('');
            playSoundEnd();
            drawProgress(0, 0);
            document.title = 'Coloradoro (end)'
        }
    });

    $play.on('click', function() {
        var time = $time.val();
        initialTime = $time.val();
        if (!time) return;
        if (isNaN(time)) {
            alert('Please input valid number');
            return;
        }

        timer.start(time);
    });

    $pause.on('click', function() {
        if (timer.getStatus() === 'started') {
            timer.pause();
        }
    });

    $stop.on('click', function() {
        if (/started|paused/.test(timer.getStatus())) {
            timer.stop();
        }
    });

    function playSoundEnd() {
        //var mySound = 'http://www.presentationmagazine.com/sound/bell_ting_ting.mp3';
        //http://onlineclock.net/audio/options/harp-strumming.mp3
        //http://onlineclock.net/audio/options/foghorn.mp3
        var mySound = 'http://www.presentationmagazine.com/sound/bell_ting_ting.mp3';
        var audio = new Audio(mySound);
        audio.play();
    }

    function playSoundBegin() {
        var mySound = 'http://www.soundjay.com/clock/clock-winding-1.mp3';
        var audio = new Audio(mySound);
        audio.play();
    }

});