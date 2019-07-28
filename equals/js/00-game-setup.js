(function(global) {
  // 'use strict';
 
  global.game = {};
  
  game.Canvas = function() {
    var viewportWidth = $(global).width();
    var $canvasNode = $('.canvas-box')[0];
    var cnv = document.createElement('canvas');
    $canvasNode.prepend(cnv);
    cnv.setAttribute('id', 'canvas');
    
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
    var offsetX = $cnvOffset.left;
    var offsetY = $cnvOffset.top;
    
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
