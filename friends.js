(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) define([], factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.friends = factory()
}(this, function () {
    'use strict';

    var socket = io('http://work.gravytubs.com:3000');

    var username = localStorage.getItem('username');
    if (username === null) {
        username = prompt('Please enter your name', 'Gandalf');
        localStorage.setItem('username', username);
    }

    var statuses = {
        AVAILABLE: 'available',
        BUSY: 'busy',
        AWAY: 'away'
    };

    var currentStatus = statuses.AVAILABLE;

    var messageHandler = function () {};
    var statusHandler = function () {};

    function onMessage(handler) {
        messageHandler = handler;
    }

    function onStatus(handler) {
        statusHandler = handler;
    }

    function updateStatus(status, duration) {
        currentStatus = status;
        socket.emit('user status', { username: username, status: currentStatus, duration: duration });
    }

    function sendMessage(message) {
        socket.emit('user message', message);
    }

    socket.on('user message', function (message) {
        messageHandler(message);
    });

    socket.on('user status', function (statusPayload) {
        statusHandler(statusPayload);
    });

    socket.on('connect', function () {
        updateStatus(currentStatus);
    });

    socket.on('reconnect', function () {
        updateStatus(currentStatus);
    });

    return {
        onMessage: onMessage,
        onStatus: onStatus,
        updateStatus: updateStatus,
        sendMessage: sendMessage,
        statuses: statuses
    };
}));
