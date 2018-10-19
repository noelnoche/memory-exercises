/*global $ game Image*/

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
    var tileBox = [];
    var delay = false;
    
    var titleScreenOn = false;
    var endScreenOn = false;
    var startTime = null;
    var endTime = null;
    var score = null;
    
    var do_title_screen = function() {
      titleScreenOn = true;
      ctx.fillStyle = '#009966';
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font =  '28pt Squada One';
      ctx.fillText('Equals 24', cw/2, ch/2 - 100);
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
    
    var do_end_screen = function(timeArg, scoreArg) {
      endScreenOn = true;
      global.setTimeout(function() {
        endScreenOn = true;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 0, cw, ch);
        ctx.font =  '14pt Squada One';
        ctx.restore();
        ctx.fillText('YOUR TIME AND SCORE', cw/2, ch/2 - 80);
        ctx.restore();
        ctx.fillText(timeArg, cw/2, ch/2 - 30);
        ctx.fillText(scoreArg + ' points', cw/2, ch/2 + 20);
        ctx.restore();
        ctx.fillText('Click here to start again', cw/2, ch/2 + 70);
      }, 500);
    };
    
    // Modified from exercise 1 to set match cards that total 24
    var matched_tiles = function(tileA, tileB) {
      
      // Remember the arguments are still objects, so invoke their num property
      var numA = tileA.num;
      var numB = tileB.num;
      
      // Still strings so we convert them to integers
      var a = parseInt(numA, 10);
      var b = parseInt(numB, 10);
      
      if (a + b === 24) {
        tileA.matched = true;
        tileB.matched = true;
        score += 10;
      }
      else {
        score -= 1;
      }
      tileBox = [];
    };
    
    var check_grid = function(matchedCards) {
      if (matchedCards === 24) {
        var timeInt, timeStr, mins, secs;
        endTime = Date.now();
        timeInt = parseInt((endTime - startTime) / 1000, 10);
        
        if (timeInt < 60) {
          timeStr = timeInt + ' seconds';
          do_end_screen(timeStr, score);
        }
        else {
          mins = parseInt(timeInt/60, 10);

          if (mins > 15) {
            timeStr = 'Over 15 minutes';
            do_end_screen(timeStr, score);
          }
          else {
            secs = timeInt % 60;
            timeStr = mins + 'm ' + secs + 's';
            do_end_screen(timeStr, score);
          }
        }
      }      
    };
    
    var refresh_grid = function() {
      var index = 0;
      var currentTile;
      var matchCount = 0;
      
      for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < 4; ++j) {
          currentTile = tileSet[index];
          
          if (currentTile.matched === true) {
            matchCount++;
            index++;
          }
          
          if (currentTile.matched === false) {
            currentTile.flipped = false;
            ctx.fillStyle = '#73D6FA';
            ctx.fillRect(j * (currentTile.sw + 1), i * (currentTile.sh + 1), currentTile.sw, currentTile.sh);
            index++;
            delay = false;
          }
        }
      }
      check_grid(matchCount);
    };
    
    var get_mouse_coords = function(e) {
      return {
        x: e.pageX,
        y: e.pageY
      };
    };
    
    var parse_grid = function (e) {
      var coords = get_mouse_coords(e);
      var tile, tileA, tileB, i;
      var tileSetLen = tileSet.length;
      
      if (titleScreenOn === false) {
        for (i = 0; i < tileSetLen; ++i) {
          tile = tileSet[i];
          
          if (delay === false && tile.flipped === false &&
            (coords.x > offsetX + tile.dx) &&
            (coords.x < offsetX + tile.dx + tile.sw) &&
            (coords.y > offsetY + tile.dy) &&
            (coords.y < offsetY + tile.dy + tile.sh)) {
            
            tile.flipped = true;
            tileBox.push(tile);
            flipCount++;
            tile.draw_tile();
            
            if (flipCount === 2) {
              tileA = tileBox[0];
              tileB = tileBox[1];
              matched_tiles(tileA, tileB);
              flipCount = 0;
              delay = true;
              
              global.setTimeout(function() {
                refresh_grid();
              }, 1000);
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
      score = 0;

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
