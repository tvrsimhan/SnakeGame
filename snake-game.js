document.cookie = "play=" + 0;
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var score = 0;
var grid = 16;
var count = 0;
var mode = 0;
var snake = {

  x: 160,
  y: 160,

  // snake speed
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake; grows when eating an apple
  maxCells: 4
};
var apple = {
  x: Math.floor(canvas.width / 2),
  y: Math.floor(canvas.height / 2)
};
// var obstacle = {
//   x: 240,
//   y: 240
// }
// get random whole numbers
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// game loop
function loop() {
  requestAnimationFrame(loop);

  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move snake by it's speed
  snake.x += snake.dx;
  snake.y += snake.dy;



  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  if (mode === 1) {
    //draw obstacle
    context.fillstyle = 'white';
    context.fillRect(obstacle.x, obstacle.y, grid, grid);
  }
  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // draw snake one cell at a time
  context.fillStyle = 'white';
  snake.cells.forEach(function (cell, index) {

    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      //print score
      document.getElementById("score").innerHTML = score;
      // canvas is 400x400 which is 25x25 grids 
      apple.x = getRandomInt(0, 40) * grid;
      apple.y = getRandomInt(0, 40) * grid;
      // if(mode === 1) {	
      // obstacle.x = getRandomInt(0, 40) * grid;
      // obstacle.y = getRandomInt(0, 40) * grid;
      // }
    }
    // collision on edge of screen
    if ((snake.x < 0) || (snake.x >= canvas.width) || (snake.y < 0) || (snake.y >= canvas.height)) {
      reset();
    }
    // //collision with obstacle
    // if (mode === 1 && cell.x === obstacle.x && cell.y === obstacle.y) {
    //   reset();
    // }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        reset();
      }
    }
    function reset() {

      snake.x = 160;
      snake.y = 160;
      snake.cells = [];
      snake.maxCells = 4;
      snake.dx = grid;
      snake.dy = 0;
      apple.x = getRandomInt(0, 40) * grid;
      apple.y = getRandomInt(0, 40) * grid;

      var answer = window.prompt("Game over! Your score is " + score + "!" + "\nEnter your name:", "Guest");

      var dict = { "player-name": answer, "score": score };
      //console.log(dict);

      // Creating a XHR object
      let xhr = new XMLHttpRequest();
      let url = "scoreboard.js";

      // open a connection
      xhr.open("POST", url, true);
      console.log(xhr.readyState)
      // Set the request header i.e. which type of content you are sending
      xhr.setRequestHeader("Content-Type", "application/json");

      // Create a state change callback
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

          // Print received data from server
          console.log(dict);
        }
      };

      // Converting JSON data to string
      var data = JSON.stringify({ "name": answer, "score": score });

      // Sending data with the request
      xhr.send(data);
      // document.cookie = "name=" + answer;
      // document.cookie = "score=" + score;
      document.cookie = "play=" + 2;

      // window.location.reload();
    }
  });

}


// listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.key === "ArrowLeft" && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.key === "ArrowUp" && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.key === "ArrowRight" && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.key === "ArrowDown" && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});


// start the game
function start(m) {
  mode = m;
  requestAnimationFrame(loop);
  // document.cookie = "mode=" + m;
  document.cookie = "play=" + 1;
}