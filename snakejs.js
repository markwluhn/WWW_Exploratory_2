$(document).ready(function(){
	//Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Cell Width
	var cw = 10;
	var d;
	var food;
	var score;
	
	//Creates snake - array of cells
	var snake_array;
	
	function init()
	{
		//starting direction
		d = "right";
		create_snake();
		//displays food
		create_food();
		//displays score
		score = 0;
		
		//moves snake every 60 ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();
	
	function create_snake()
	{
		//snake length
		var length = 5; 
		snake_array = []; 
		for(var i = length-1; i>=0; i--)
		{
			//creates horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	//function to create food
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//creates cell with x/y between 0-44
	}
	
	//paints snake onto canvas
	function paint()
	{
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//movement code for the snake to come here.
		//pop out tail cell and place it infront of head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//increment head cell to get new head position
		//add direction based movement
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		//restarts game if snake's head hits his body or the wall
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//restart game
			init();
			return;
		}

		//if head cell position is same as food, add new head position, and add new food (snake eats food)
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			create_food();
		}
		else
		{
			//pops out the last cell
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}
		//snake can now eat the food.
		
		//puts back the tail as the first cell
		snake_array.unshift(tail);
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//paints 10px wide cells
			paint_cell(c.x, c.y);
		}
		
		//paints the food
		paint_cell(food.x, food.y);
		//paints the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	//generic function to paint cells
	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//function that checks if x/y coordinates are in array of cells
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//keyboard controls
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})
