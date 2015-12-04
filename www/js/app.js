// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, SocketFactory) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    if(dgram) {
      console.log('UDP available');
      SocketFactory.initialize(false);
    }
    window.onerror = function(err) {
      log('window.onerror: ' + err)
    }

  });

  var uniqueId = 1
  function log (message, data) {
        var log = document.getElementById('log')
        var el = document.createElement('div')
        el.className = 'logLine'
        el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
        if (log.children.length) { log.insertBefore(el, log.children[0]) }
        else { log.appendChild(el) }};
});

angular.module( 'starter.controllers', [ 'starter.services'] )

.controller( 'MainController', function( $scope, SocketFactory )
{
  $scope.sendMessage = function() {
    console.log('calling send');
    SocketFactory.sendText('10.150.0.255', 5555, 'Yo does this work?', $scope.sendCallback);
    console.log('text sent');
  }

  $scope.receiveMessage = function() {
    SocketFactory.bind($scope.sendCallback);
    SocketFactory.addListenerCallback($scope.receiveCallback);
  }

  $scope.closeSocket = function() {
    SocketFactory.close();
  }

  $scope.receiveCallback = function(message,server) {
    console.log('Received message from ' + server.address + ' on port ' + server.port);
    console.log('Message: ' + message);
  }

  $scope.sendCallback = function(one, two) {
    console.log('Callback called!');
    if (one !== undefined) {
      console.log('One is ' + one);
    }
    if (two !== undefined) {
      console.log('Two is ' + two);
    }
  }
});

angular.module( 'starter.services', [] )
.factory( 'SocketFactory', function() {
  var socket = 0;

  return {
    initialize: function(broadcast) {
      if (dgram && socket === 0) {
        console.log('UDP available - Initializing socket');
        if (broadcast)
          socket = dgram.createSocket('broadcast-udp4', 5555);
        else
          socket = dgram.createSocket('udp4', 5555);
      }
    },
    sendText: function(ipAddress, port, text, callback) {
      if (socket !== 0) {
        console.log('sending text');
        socket.send(text, ipAddress, port, callback);
      }
      else {
        console.log('Socket not initialized');
      }
    },
    close: function() {
      if (socket !== 0) {
        console.log('Closing socket');
        socket.close();
      }
    },
    bind: function(callback) {
      if (socket !== 0) {
        console.log('Binding socket');
        socket.bind(callback);
        console.log('Bound socket');
      }
    },
    addListenerCallback: function(callback) {
      if (socket !== 0) {
        socket.on('message', callback);
        console.log('Socket callback set');
      }
    }
  };
});
