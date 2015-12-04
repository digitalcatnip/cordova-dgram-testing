// App.js - Main file for testing the Cordova Dgram Plugin
// Copyright (2015) James McCarthy
//
//     This program is free software; you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation; either version 2 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License along
//     with this program; if not, write to the Free Software Foundation, Inc.,
//     51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

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
      //TODO - Toggle this to broacast or not
      useBroadcast = false;
      SocketFactory.initialize(useBroadcast);
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
    //TODO - You should probably change this
    ipAddress = '10.150.0.255';
    port = 5555;
    SocketFactory.sendText(ipAddress, port, 'Yo does this work?', $scope.sendCallback);
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
