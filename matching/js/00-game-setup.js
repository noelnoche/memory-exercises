/*global $ game*/

// Encapsulates modules in IIFE to give each file their own scope.
(function(global) {
  'use strict';

  // Using the namespacing technique to avoid collisions with other variables or
  // objects in the global namespace. JavaScript does not have built-in support
  // for namespacing, but it does have closures and objects that can mimic it.
  global.game = {};
  
  // Using object interface module pattern which allows private and public properties.
  game.Canvas = function() {
    var viewportWidth = $(global).width();
    var $canvasNode = $('#canvas-box');
    var cnv = document.createElement('canvas');
    $canvasNode.prepend(cnv);
    cnv.setAttribute('id', 'canvas');
    
    // Adjusts canvas dimensions to fit dimensions of many mobile devices 
    // and center canvas (and `Tile` objects) relative to the window size.
    if (viewportWidth > 401) {
      cnv.height = 600;
      cnv.width = 400;
    }
    else {
      cnv.height = 438;
      cnv.width = 292;
    }
    
    var ch = cnv.height;
    var cw = cnv.width;
    var ctx = cnv.getContext('2d');
    var $cnvOffset = $('canvas').offset();
    var offsetX = viewportWidth/2 - cw/2;
    var offsetY = $cnvOffset.top;
    cnv.style.marginLeft = offsetX + 'px';
    
    // Makes these values available to other modules (game.Canvas.ctx).
    return {
      ctx: ctx,
      viewportWidth: viewportWidth,
      ch: ch,
      cw: cw,
      offsetX: offsetX,
      offsetY: offsetY
    };
  }();
  
})(this);
