'use strict';

var PlayScene = require('./scenes/play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // load images
    this.load.image('background', 'images/background.png');
    this.load.spritesheet('hero', 'images/hero.png', 48, 48);
    this.load.spritesheet('ghost', 'images/ghost.png', 32, 44);
    this.load.spritesheet('lava', 'images/lava.png', 48, 48);
    this.load.image('goal', 'images/pomegranate.png');
    this.load.spritesheet('coin', 'images/coin.png', 36, 36);
    this.load.image('tiles', 'images/tiles.png');
    this.load.image('cursor', 'images/cursor.png');
    this.load.image('btn:download', 'images/btn_download.png');
    this.load.image('prefabs', 'images/prefabs.png');

    // load audio
    var sfx = {
      'jump': 'jump.wav',
      'die': 'lose.wav',
      'win': 'win.wav',
      'coin': 'coin.wav',
      'background': 'background.ogg'
    };
    Object.keys(sfx).forEach(function (key) {
      this.game.load.audio(key, 'audio/' + sfx[key]);
    }.bind(this));

    // load level data
    this.load.text('level:1', 'data/level1.json');
    this.load.text('level:2', 'data/level2.json');
    this.load.text('level:3', 'data/level3.json');
    this.load.text('level:4', 'data/level4.json');
    this.load.text('level:5', 'data/level5.json');
  },

  create: function () {
    this.game.state.start('play', true, false, 1);
  }
};

function startGame() {
  var game = new Phaser.Game(900, 576, Phaser.AUTO, 'game');
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
}


window.onload = function () {
  // for dev mode
  // document.querySelector('.overlay').style.display = 'none';
  // startGame();

  // for production
  document.getElementById('play').addEventListener('click', function (evt) {
    evt.preventDefault();
    // hide overlay
    document.querySelector('.overlay').style.display = 'none';
    startGame();
  });
};
