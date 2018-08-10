/*global $ game*/

(function(global) {
  // 'use strict';

  // Handles all game infrastructure, conditions, etc.
  game.GameCore = function() {
    
    // Dependencies from Canvas module.
    var ctx = game.Canvas.ctx;
    var viewportWidth = game.Canvas.viewportWidth;
    var cw = game.Canvas.cw;
    var ch = game.Canvas.ch;
    var offsetX = game.Canvas.offsetX;
    var offsetY = game.Canvas.offsetY;
    
    // Dependencies from Tile-Grid module.
    var Grid = game.Grid;
    var tileSet = null;
    
    // For card comparison handler.
    var tileBox = [];
    var flipCount = 0;
    var delay = false;
    
    // For intro and end screen states and final time and score.
    var titleScreenOn = false;
    var endScreenOn = false;
    var startTime = null;
    var endTime = null;
    var score = null;
    
    // Displays title screen.
    var do_title_screen = function() {
      titleScreenOn = true;
      ctx.fillStyle = '#003366';
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font =  '28pt Squada One';
      ctx.fillText('Classic Matching', cw/2, ch/2 - 100);
      ctx.font =  '18pt Squada One';
      ctx.fillText('Click here to begin', cw/2, ch/2 - 30);
    };

    // Removes info screen on click.
    var bye_title_screen = function() {
      titleScreenOn = false;
      ctx.clearRect(0, 0, cw, ch);
    };

    // Clears old grid data.
    var clear_old_grid = function() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
    };
    
    // Handler for game end screen.
    var do_end_screen = function(timeArg, scoreArg) {
      endScreenOn = true;
      global.setTimeout(function() {
        endScreenOn = true;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 0, cw, ch);
        ctx.restore();
        ctx.fillText('YOUR TIME AND SCORE', cw/2, ch/2 - 80);
        ctx.restore();
        ctx.fillText(timeArg, cw/2, ch/2 - 30);
        ctx.fillText(scoreArg + ' points', cw/2, ch/2 + 20);
        ctx.restore();
        ctx.fillText('Click here to start again', cw/2, ch/2 + 70);
      }, 500);
    };

    // Tiles match? Set their `matched` property value to `true` and clear `tileBox`.
    // Adjust score.
    var matched_tiles = function(tileA, tileB) {
      
      // Since tile pairs share the same metadata..
      if (tileA.x === tileB.x && tileA.y === tileB.y) {
        tileA.matched = true;
        tileB.matched = true;
        score += 5;
      }
      else {
        score -= 1;
      }
      tileBox = [];
    };
    
    // Checks if endgame reached or if player is over time limit.
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
    
    // Updates grid data using the just parsed data.
    var refresh_grid = function() {
      var index = 0;
      var currentTile;
      var matchCount = 0;
      
      for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < 4; ++j) {
          currentTile = tileSet[index];
          
          // If current tile is already matched, add to match counter.
          if (currentTile.matched === true) {
            matchCount++;
            index++;
          }
          
          // If the current tile is flipped, but not match other tile, flip back over.
          if (currentTile.matched === false) {
            currentTile.flipped = false;
            
            // Flips tile in UI.
            ctx.fillStyle = '#73D6FA';
            ctx.fillRect(j * (currentTile.sw + 1), i * (currentTile.sh + 1), currentTile.sw, currentTile.sh);
            
            index++;
            
            // Clears the delay when unmatched tiles so that user can select a new set of tiles.
            delay = false;
          }
        }
      }
      check_grid(matchCount);
    };
    
    // Grabs mouse coordinates when player clicks/taps the grid.
    var get_mouse_coords = function(e) {
      return {
        x: e.pageX,
        y: e.pageY
      };
    };
    
    // Takes click/tap coordinates and parses the grid, checking for matched tiles.
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
              
              // Delays card flip after unmatched pairing.
              delay = true;
              
              global.setTimeout(function() {
                refresh_grid();
              }, 1000);
            }
          }
        }
      }
    };

    // Resets the game grid.
    var initialize = function() {
      tileSet = Grid.new_grid();
      titleScreenOn = false;
      endScreenOn = false;
      clear_old_grid();
      refresh_grid();
      score = 0;
      
      // Need to set these again for successive playthroughs.
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
      
      // Starts the timer.
      startTime = Date.now();
    };

    // Triggers touch input events.
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
    
    // 	Resolves font syncing issue when page first loads.
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
