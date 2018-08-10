/*global $ game*/

(function(global) {
  // 'use strict';
  
  game.GameCore = function() {
    var ctx = game.Canvas.ctx;
    var viewportWidth = game.Canvas.viewportWidth;
    var cw = game.Canvas.cw;
    var ch = game.Canvas.ch;
    var offsetX = game.Canvas.offsetX;
    var offsetY = game.Canvas.offsetY;
    
    var Grid = game.Grid;
    var tileSet = null;
    var flipCount = 0;
    var lastTileInt = null;
    var delay = false;
    
    var titleScreenOn = false;
    var endScreenOn = false;
    var startTime = null;
    var endTime = null;
    
    var do_title_screen = function() {
      titleScreenOn = true;
      ctx.fillStyle = '#993366';
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font =  '28pt Squada One';
      ctx.fillText('Order 24', cw/2, ch/2 - 100);
      ctx.font =  '18pt Squada One';
      ctx.fillText('Click here to begin', cw/2, ch/2 - 30);
    };
    
    var bye_title_screen = function() {
      titleScreenOn = false;
      ctx.clearRect(0, 0, cw, ch);
    };
    
    var clear_old_grid = function() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
    };
    
    var do_end_screen = function(timeArg) {
      endScreenOn = true;
      global.setTimeout(function() {
        endScreenOn = true;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 0, cw, ch);
        ctx.font =  '14pt Squada One';
        ctx.restore();
        ctx.fillText('YOUR TIME', cw/2, ch/2 - 80);
        ctx.restore();
        ctx.fillText(timeArg, cw/2, ch/2 - 30);
        ctx.restore();
        ctx.fillText('Click here to start again', cw/2, ch/2 + 70);
      }, 500);
    };
    
    // Checks if all cards are turned over.
    var check_grid = function() {
      if (flipCount === 24) {
        var timeInt, timeStr, mins, secs;
        endTime = Date.now();
        timeInt = parseInt((endTime - startTime) / 1000, 10);
       
        if (timeInt < 60) {
          timeStr = timeInt + ' seconds';
          do_end_screen(timeStr);
        }
        else {
          mins = parseInt(timeInt/60, 10);
          
          if (mins > 15) {
            timeStr = 'Over 15 minutes';
            do_end_screen(timeStr);
          }
          else {
            secs = timeInt % 60;
            timeStr = mins + 'm ' + secs + 's';
            do_end_screen(timeStr);
          }
        }
      }
    };
    
    // Shows all numbers.
    var render_grid = function() {
      var currentTile = null;
      var index = 0;
      var i, j;
      
      for (i = 0; i < 6; ++i) {
        for (j = 0; j < 4; ++j) {
          currentTile = tileSet[index];
          currentTile.draw_tile();
          index++;
        }
      }
    };
    
    var get_mouse_coords = function(e) {
      return {
        x: e.pageX,
        y: e.pageY
      };
    };
    
    // Resets the grid if numbers not in sequence.
    var refresh_grid = function() {
      var currentTile = null;
      var index = 0;
      var i, j;
      flipCount = 1;
      lastTileInt = 1;
      delay = false;
      
      // Blink all the numbers.
      render_grid();
      
      global.setTimeout(function() {
        for (i = 0; i < 6; ++i) {
          for (j = 0; j < 4; ++j) {
            currentTile = tileSet[index];
            currentTile.flipped = false;
            
            if (currentTile.num === '1') {
              currentTile.flipped = true;
              currentTile.draw_tile();
              index++;
              continue;
            }
            
            ctx.fillStyle = '#73D6FA';
            ctx.fillRect(j * (currentTile.sw + 1), i * (currentTile.sh + 1), currentTile.sw, currentTile.sh);
            index++;
          }
        }
      }, 3000);
    };
    
    var parse_grid = function (e) {
      var coords = get_mouse_coords(e);
      var tile;
      var tileSetLen = tileSet.length;
      var currentTile = null;
      
      if (titleScreenOn === false) {
        for (var i = 0; i < tileSetLen; ++i) {
          tile = tileSet[i];
          
          if (delay === false && tile.flipped === false &&
            (coords.x > offsetX + tile.dx) &&
            (coords.x < offsetX + tile.dx + tile.sw) &&
            (coords.y > offsetY + tile.dy) &&
            (coords.y < offsetY + tile.dy + tile.sh)) {
               
            currentTile = tile;
            currentTile.draw_tile();
            delay = true;
            
            if (flipCount === 1) {
              if (currentTile.num === '2') {
                currentTile.flipped = true;
                flipCount++;
                delay = false;
                lastTileInt = 2;
                check_grid();
              }
              else {
                refresh_grid();
              }
            }
            
            // Adjusted for checking if numbers are sequential
            else {
              if (lastTileInt + 1 === parseInt(currentTile.num, 10)) {
                currentTile.flipped = true;
                flipCount++;
                delay = false;
                lastTileInt = parseInt(currentTile.num, 10);
                check_grid();
              }
              else {
                refresh_grid();
              }
            }
          }
        }
      }
    };
    
    var initialize = function() {
      tileSet = Grid.new_grid();
      titleScreenOn = false;
      endScreenOn = false;
      clear_old_grid();
      refresh_grid();

      if (viewportWidth > 401) {
        ctx.font =  '18pt Squada One';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.font =  '28pt Squada One';
        ctx.save();
        ctx.font =  '18pt Squada One';
        ctx.save();
      }
      else {
        ctx.font =  '16pt Squada One';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.font =  '24pt Squada One';
        ctx.save();
        ctx.font =  '16pt Squada One';
        ctx.save();
      }
      startTime = Date.now();
    };
    
    var ui_handler = function(e) {
      if (titleScreenOn === false && endScreenOn === false) {
        parse_grid(e);
      }
      else {
        global.setTimeout(function(){
          bye_title_screen();
          initialize();
        }, 480);
      }
    };
    
    return {
      do_title_screen: do_title_screen,
      ui_handler: ui_handler
    };
  }();


  $('#canvas').click(function(e) {
    game.GameCore.ui_handler(e);
  });
  
  global.onload = function() {
    WebFontConfig = {
      google: { families: ['Squada One']},
      active: function() {
        game.GameCore.do_title_screen();
      }
    };
    
    (function(d) {
      var wf = d.createElement('script'), s = d.scripts[0];
      wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
      wf.async = true;
      s.parentNode.insertBefore(wf, s);
    })(document);
  };
  
})(this);
