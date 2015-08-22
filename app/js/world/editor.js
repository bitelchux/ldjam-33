'use strict';

var Level = require('./level.js');

function Editor(group, level) {
  this.group = group;
  this.level = level;
  this.game = group.game;
  this.currentTile = 0;

  this.hud = this.game.add.group();
  this.hud.visible = false;
  this.group.add(this.hud);

  // create cursor
  this.cursor = this.group.create(0, 0, 'cursor');

  // create palette
  this.palette = this.hud.create(0, 0, 'tiles:physics');
  this.paletteFrame = this.hud.create(0, 0, 'cursor');
  this.palette.addChild(this.paletteFrame);
  this.palette.inputEnabled = true;
  this.palette.events.onInputUp.add(function (sprite, pointer) {
    var i = this.game.math.snapToFloor(pointer.x, Level.TSIZE) / Level.TSIZE;
    this.selectTile(i);
    this.toggleHud();
  }, this);

  // create download button
  var downloadButton = this.game.make.button(0, this.game.world.height,
    'btn:download', this.download, this);
  downloadButton.anchor.setTo(0, 1);
  this.hud.add(downloadButton);

  // register for keyboard events
  this.keys = {};
  // spacebar
  this.keys.spacebar =
    this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
  this.keys.spacebar.onDown.add(this.toggleHud, this);
  // shift
  this.keys.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SHIFT);

  this.selectTile(0);
}

Editor.prototype.isHudActive = function () {
  return this.hud.visible;
};

Editor.prototype.toggleHud = function () {
  this.hud.visible = !this.hud.visible;
  this.cursor.visible = !this.isHudActive();
};

Editor.prototype.selectTile = function (index) {
  this.currentTile = index;
  this.paletteFrame.position.setTo(index * Level.TSIZE, 0);
};

Editor.prototype.update = function () {
  var tileX = this.level.layer().getTileX(
    this.game.input.activePointer.worldX);
  var tileY = this.level.layer().getTileY(
    this.game.input.activePointer.worldY);

  this.cursor.position.setTo(tileX * Level.TSIZE, tileY * Level.TSIZE);

  if (!this.isHudActive() && this.game.input.activePointer.isDown) {
    if (this.keys.shift.isDown) {
      this.level.map.removeTile(tileX, tileY, this.level.layer());
    }
    else {
      this.level.map.putTile(this.currentTile, tileX, tileY,
        this.level.layer());
    }
  }
};

Editor.prototype.download = function () {
  var data = JSON.stringify(this.level.export(), null, 2);

  // create a temp <a> tag to download the file
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
    encodeURIComponent(data));
  element.setAttribute('download', 'level.json');
  // simulate a click on the link and remove the <a>
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

module.exports = Editor;