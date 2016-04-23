/**
 * Created by Bradley on 3/21/16.
 */

$(document).ready(function() {
    drawProgress(1, 1);

    var $play  = $('.play'),
        $pause = $('.pause'),
        $stop  = $('.stop'),
        $time  = $('.time-input'),
        $minus = $('.minus'),
        $plus = $('.plus'),
        $refresh = $('.refresh'),
        $timerSeconds = $('.timerSeconds'),
        $timerMinutes = $('.timerMinutes'),
        $timeRemaining = $('.time-remaining');
        $sendMessage = $('.friend-chat-button');

    var friendsList,
        queuedMessages = [];

    var initialTime,
        clockPercent;

    var timerStarted = false;

    var minutes = 25;

    $timeRemaining.text(minutes + ':00');

    $timerMinutes.text(25);
    $timerSeconds.text('00');

    var timer = new Timer({
        onstart : function(milliseconds) {
            timerStarted = true;
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
            document.title = '(' + minutes + ':' + seconds + ') ' + 'Coloradoro';
            $timeRemaining.text(minutes + ':' + seconds)
            friends.updateStatus(friends.statuses.BUSY, milliseconds / 1000);
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
            document.title = '(' + minutes + ':' + seconds + ') ' + 'Coloradoro';
            $timeRemaining.text(minutes + ':' + seconds)
        },
        onpause : function() {
            $timerMinutes.text('');
            $timerSeconds.text('pause');
        },
        onstop  : function() {
            timerStarted = false;
            $timerMinutes.text('&nbsp');
            $timerSeconds.text('stop');
            friends.updateStatus(friends.statuses.AVAILABLE);
            displayMessages();
        },
        onend   : function() {
            timerStarted = false;
            $timerSeconds.text('end');
            $timerMinutes.text('');
            playSoundEnd();
            drawProgress(0, 0);
            $timeRemaining.text('end');
            document.title = 'Coloradoro (end)'
            friends.updateStatus(friends.statuses.AVAILABLE);
            displayMessages();
        }
    });

    $play.on('click', function() {
        var time = minutes * 60;
        initialTime = time;
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

    $minus.on('click', function() {
        if (!timerStarted && minutes > 0) {
            minutes -= 1;
            $timeRemaining.text(minutes + ':00');
        }
    });

    $plus.on('click', function() {
        if(!timerStarted) {
            minutes += 1;
            $timeRemaining.text(minutes + ':00');
        }
    });

    $refresh.on('click', function() {
        if(!timerStarted) {
            minutes = 25;
            $timeRemaining.text(minutes + ':00');
        }
    });

    $sendMessage.on('click', function() {
        var message = prompt('Your friends will receive your message as soon as they are available.');
        if (message) {
            friends.sendMessage(message);
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

    function displayMessages() {
        setTimeout(function () {
            while (queuedMessages.length > 0) {
                alert(queuedMessages.pop());
            }
        }, 500);
    }

    /**
     * Display incoming chat messages only when available
     */
    friends.onMessage(function (message) {
        if (timer.getStatus() === 'started') {
            queuedMessages.push(message);
        } else {
            alert(message);
        }
    });

    /**
     * Refresh the friends list whenever someone's status changes
     */
    friends.onStatus(function (statusPayload) {
        friendsList = statusPayload;
        for (username in statusPayload) {
            var status = statusPayload[username].status;
            var duration = statusPayload[username].duration;
            var updatedAt = moment(statusPayload[username].updatedAt);
            var statusMessage = status;
            var lastSeen = updatedAt.calendar();

            if (status === friends.statuses.BUSY && duration) {
                var availableAt = moment(updatedAt).add(duration, 'seconds');
                statusMessage = 'available ' + availableAt.fromNow();
            }

            var $friend = $('#' + username);
            if ($friend.length === 0) {
                var friendTemplate = '<tr id="' + username + '" class="friend">'
                + '<td>' + username + '</td>'
                + '<td class="friend-status ' + status + '">' + statusMessage + '</td>'
                + '<td class="friend-timestamp">' + lastSeen + '<td>'
                + '</tr>'
                $('.friends-list').append(friendTemplate);
            } else {
                $friend.find('.friend-status')
                       .removeClass()
                       .addClass('friend-status ' + status)
                       .html(statusMessage);
                $friend.find('.friend-timestamp')
                       .html(lastSeen);
            }
        }
    });

    /**
     * Update the duration of any friends who are currently busy
     */
    setInterval(function () {
        for (username in friendsList) {
            var status = friendsList[username].status;
            var duration = friendsList[username].duration;

            if (status === friends.statuses.BUSY && duration) {
                var updatedAt = moment(friendsList[username].updatedAt);
                var availableAt = updatedAt.add(duration, 'seconds');
                statusMessage = 'available ' + availableAt.fromNow();

                $('#' + username).find('.friend-status')
                                 .html(statusMessage);
            }
        }
    }, 1000);

    friends.updateStatus(friends.statuses.AVAILABLE);
});
