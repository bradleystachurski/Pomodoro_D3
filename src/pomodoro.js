/**
 * Created by Bradley on 3/21/16.
 */

$(document).ready(function() {

    drawProgress(1, 1);

    var $play  = $('.play'),
        $pause = $('.pause'),
        $stop  = $('.stop'),
        $time  = $('.time-input'),
        $timerSeconds = $('.timerSeconds');
    $timerMinutes = $('.timerMinutes');

    var initialTime,
        clockPercent;

    var timer = new Timer({
        onstart : function(milliseconds) {
            var seconds = Math.round(milliseconds / 1000) % 60;
            var minutes = Math.floor(Math.round(milliseconds / 1000) / 60);
            $timerSeconds.text(seconds);
            $timerMinutes.text(minutes);
            clockPercent = (Math.round(milliseconds / 1000)) / initialTime;
            playSoundBegin();
            drawProgress(clockPercent, seconds / 60);
        },
        ontick  : function(milliseconds) {
            var seconds = Math.round(milliseconds / 1000) % 60;
            var minutes = Math.floor(Math.round(milliseconds / 1000) / 60);
            $timerSeconds.text(seconds);
            $timerMinutes.text(minutes);
            clockPercent = (Math.round(milliseconds / 1000)) / initialTime;
            drawProgress(clockPercent, seconds / 60);
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