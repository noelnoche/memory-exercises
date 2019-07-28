(function(global) {
  // 'use strict';

  var assets = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  var viewportWidth = game.Canvas.viewportWidth;
  var ctx = game.Canvas.ctx;
  
  var Tile = function() {
    this.num = null;
    this.dx = null;
    this.dy = null;
    this.w = 100;
    this.h = 100;
    this.sw = null;
    this.sh = null;
    this.flipped = false;
    this.matched = false;
  };
  
  Tile.prototype = {
    drawTile: function() {
      ctx.fillStyle = '#000';
      ctx.fillRect(this.dx, this.dy, this.sw, this.sh);
      ctx.fillStyle = '#fff';
      
      var splitPos = this.num.split(',');
      var currentNum = splitPos[0];
      
      if (viewportWidth > 401) {
        ctx.font = '35pt Squada One';
      }
      else {
        ctx.font = '25pt Squada One';
      }
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentNum, this.dx + this.sw/2, this.dy + this.sh/2);
    }
  };
  
  game.Grid = function() {
    var shuffleAssets = function(tileArray) {
      var i, j, temp;
      for (i = tileArray.length - 1; i > 0; --i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = tileArray[i];
        tileArray[i] = tileArray[j];
        tileArray[j] = temp;
      }
      return tileArray;
    };
    
    var newGrid = function() {
      var tileSet = [];
      var index = 0;
      var i, j;
      var tileData = null;
      
      shuffleAssets(assets);
      
      if (viewportWidth > 401) {
        for (i = 0; i < 6; ++i) {
          for (j = 0; j < 4; ++j) {
            tileData = new Tile();
            tileData.num = assets[index];
            tileData.sh = tileData.h - 1;
            tileData.sw = tileData.w - 1;
            tileData.dy = tileData.h * i;
            tileData.dx = tileData.w * j;

            if (tileData !== undefined) {
              tileSet.push(tileData);
              index++;
            }
          }
        }
      }
      else {
        for (i = 0; i < 6; ++i) {
          for (j = 0; j < 4; ++j) {
            tileData = new Tile();
            tileData.num = assets[index];
            tileData.dy = tileData.w * 292/400 * i;
            tileData.dx = tileData.h * 292/400 * j;
            tileData.sh = tileData.h * 292/400 - 1;
            tileData.sw = tileData.w * 292/400 - 1;
            
            if (tileData !== undefined) {
              tileSet.push(tileData);
              index++;
            }
          }
        }
      }
      return tileSet;
    };
    
    return {
      newGrid: newGrid
    };
  }();
  
})(this);
