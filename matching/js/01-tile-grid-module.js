/*global game Image*/

(function(global) {
  'use strict';

	// Tile metadata. Since this is not shared 
	// with other modules we can make it 'private'.
	var assets = [
		{
			"filename": "cir_bg_a.png",
			"frame": {"x":2,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_bg_b.png",
			"frame": {"x":2,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_bg_a.png",
			"frame": {"x":104,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_bg_b.png",
			"frame": {"x":104,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_gb_a.png",
			"frame": {"x":206,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_gb_b.png",
			"frame": {"x":206,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_gb_a.png",
			"frame": {"x":308,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_gb_b.png",
			"frame": {"x":308,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_op_a.png",
			"frame": {"x":410,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_op_b.png",
			"frame": {"x":410,"y":2,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_op_a.png",
			"frame": {"x":2,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_op_b.png",
			"frame": {"x":2,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_po_a.png",
			"frame": {"x":104,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_po_b.png",
			"frame": {"x":104,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_po_a.png",
			"frame": {"x":206,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_po_b.png",
			"frame": {"x":206,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_ry_a.png",
			"frame": {"x":308,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_ry_b.png",
			"frame": {"x":308,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_ry_a.png",
			"frame": {"x":410,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_ry_b.png",
			"frame": {"x":410,"y":104,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_yr_a.png",
			"frame": {"x":2,"y":206,"w":100,"h":100},
			"spriteSourceSize": {"x":0,"y":0,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "cir_yr_b.png",
			"frame": {"x":2,"y":206,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_yr_a.png",
			"frame": {"x":104,"y":206,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		},
		{
			"filename": "tri_yr_b.png",
			"frame": {"x":104,"y":206,"w":100,"h":100},
			"sourceSize": {"w":100,"h":100}
		}];

	// Source file for tile images.
	var imgUrl = "assets/sprite_atlas.png";
	
	// Dependencies from the Canvas module.  Assigned to
  // local variables to make code easier to read.
	var viewportWidth = game.Canvas.viewportWidth;
	var ctx = game.Canvas.ctx;
	
	// Since there are multiple tiles, it's more efficient 
	// to use the constructor-prototype model.
	var Tile = function() {
		this.id = null;
		this.url = imgUrl;
		this.img = null;
		this.x = null;
		this.y = null;
		this.dx = null;
		this.dy = null;
		this.w = null;
		this.h = null;
		this.sw = null;
		this.sh = null;
		this.flipped = false;
		this.matched = false;
	};

	Tile.prototype = {
		make_tile_ob: function() {
			this.img = new Image();
			this.img.src = this.url;
		},

		draw_tile: function() {
			ctx.drawImage(this.img, this.x, this.y, this.w, this.h, this.dx, this.dy, this.sw, this.sh);
		}
	};

	// Combines tile metadata with thier Image object to make the grid.
	// Since there is only one grid, we just make it an object literal.
	// This also uses object interface module pattern.
	game.Grid = function(){
		
		// Fisher-Yeats algorithm.
		var shuffle_assets = function(tileArray) {
			var i, j, temp;
			for (i = tileArray.length - 1; i > 0; --i){
				j = Math.floor(Math.random() * (i + 1));
				temp = tileArray[i];
				tileArray[i] = tileArray[j];
				tileArray[j] = temp;
			}
			return tileArray;
		};
		
		// Using loops to create tile data for the the grid. Each tile is assigned
		// their specific metadata and stored in an array called `tileArray`.
		var new_grid = function() {
			var tileSet = [];
			var index = 0;
			var i, j;
			var tileData = null;
			
			shuffle_assets(assets);

			if (viewportWidth > 401) {
				for (i = 0; i < 6; ++i) {
					for (j = 0; j < 4; ++j) {
						tileData = new Tile();
						tileData.id = assets[index].filename;
						tileData.x = assets[index].frame.x;
						tileData.y = assets[index].frame.y;
						tileData.h = assets[index].sourceSize.h - 1;
						tileData.w = assets[index].sourceSize.w - 1;
						tileData.dy = assets[index].sourceSize.h * i;
						tileData.dx = assets[index].sourceSize.w * j;
						tileData.sh = assets[index].sourceSize.h - 1;
						tileData.sw = assets[index].sourceSize.w - 1;
						
						tileData.make_tile_ob();

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
						tileData.id = assets[index].filename;
						tileData.x = assets[index].frame.x;
						tileData.y = assets[index].frame.y;
						tileData.h = assets[index].sourceSize.h - 1;
						tileData.w = assets[index].sourceSize.w - 1;
						tileData.dy = assets[index].sourceSize.w * 292/400 * i;
						tileData.dx = assets[index].sourceSize.h * 292/400 * j;
						tileData.sh = assets[index].sourceSize.h * 292/400 - 1;
						tileData.sw = assets[index].sourceSize.w * 292/400 - 1;
						
						tileData.make_tile_ob();
						
						if (tileData !== undefined) {
							tileSet.push(tileData);
							index++;
						}
					}
				}
			}
			return tileSet;
		};
		
		// Makes new_grid accessable to other modules (game.Grid.new_grid).
		return {
		  new_grid: new_grid
		};
	}();
	
})(this);
