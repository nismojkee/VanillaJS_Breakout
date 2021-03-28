const gridBoard = document.querySelector('.grid');
const scoreBoard = document.querySelector('.score');
const recordBoard = document.querySelector('.record');

let score = 0;

const blockWidth = 100;
const blockHeight = 20;

const boardHeight = 300;
const boardWidth = 560;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let timerId;

let xDirection = 0.5;
let yDirection = 0.5;

class Block {
	constructor(xAxis, yAxis) {
		this.bottomLeft = [xAxis, yAxis];
		this.bottomRight = [xAxis + blockWidth, yAxis];
		this.topLeft = [xAxis, yAxis + blockHeight];
		this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
	}
};

const blocks = [
	new Block(10,270),
	new Block(120,270),
	new Block(230,270),
	new Block(340,270),
	new Block(450,270),
	new Block(10,240),
	new Block(120,240),
	new Block(230,240),
	new Block(340,240),
	new Block(450,240),
	new Block(10,210),
	new Block(120,210),
	new Block(230,210),
	new Block(340,210),
	new Block(450,210)
];

function addBlocks() {
	for (let i = 0; i < blocks.length; i++) {
		const block = document.createElement('div');
		block.classList.add('block');
		block.style.left = blocks[i].bottomLeft[0] + 'px';
		block.style.bottom = blocks[i].bottomLeft[1] + 'px';
		gridBoard.append(block);
	}
};

addBlocks();


const user = document.createElement('div');
user.classList.add('user');
drawUser();
gridBoard.append(user);

function drawUser() {
	user.style.left = currentPosition[0] + 'px';
	user.style.bottom = currentPosition[1] + 'px';
};

function moveUser(e) {
	switch(e.key) {
		case 'ArrowLeft':
			if (currentPosition[0] > 0) {
				currentPosition[0] -= 10
				drawUser();
			};
			break;
		case 'ArrowRight':
			if (currentPosition[0] < 460) {
				currentPosition[0] += 10
				drawUser();
			};
			break;
		default:
			return;
	}
};

document.addEventListener('keydown', moveUser);


const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
gridBoard.append(ball);

function drawBall() {
	ball.style.left = ballCurrentPosition[0] + 'px';
	ball.style.bottom = ballCurrentPosition[1] + 'px';
	checkForCollisions();
};

function moveBall() {
	ballCurrentPosition[0] += xDirection;
	ballCurrentPosition[1] += yDirection;
	drawBall();
};

scoreBoard.innerHTML = "Current score: " + score;

timerId = setInterval(moveBall, 1);

function checkForCollisions() {
	// check for collision on blocks
	for (let i = 0; i < blocks.length; i++) {
		if ( (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
			 (ballCurrentPosition[1] + 20 > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) ){

			const allBlocks = Array.from(document.querySelectorAll('.block'));
			allBlocks[i].classList.remove('block');
			blocks.splice(i, 1);
			changeDirection('down');
			score++;
			scoreBoard.innerHTML = "Current score: " + score;
			if (blocks.length === 0) {
				scoreBoard.innerHTML = "You WIN! Your score: " + score;
				clearInterval(timerId);
				document.removeEventListener('keydown', moveUser);
			};
		};
	};

	// check for collision on user
	if ( (ballCurrentPosition[1] === currentPosition[1] + 10) && (ballCurrentPosition[0] > currentPosition[0]) && (ballCurrentPosition[0] < currentPosition[0] + 100) ) {
		changeDirection('up');
	};

	// check for collision on wall
	if (ballCurrentPosition[0] >= 540) {
		changeDirection('left');
	}
	else if (ballCurrentPosition[1] >= 280) {
		changeDirection('down');
	}
	else if (ballCurrentPosition[0] <= 0) {
		changeDirection('right');
	}
	else if (ballCurrentPosition[1] < 5) {
		clearInterval(timerId);
		scoreBoard.innerHTML = "You lose! Your score: " + score;
		document.removeEventListener('keydown', moveUser);
		localStorage.setItem('Hi-Score', score);
		return;
	};
};

function changeDirection(sideDireciton) {
	switch(sideDireciton){
		case 'left':
			xDirection = -xDirection;
			break;
		case 'down':
			yDirection = -yDirection;
			break;
		case 'right':
			xDirection = -xDirection;
			break;
		case 'up':
			yDirection = -yDirection;
			break;
		default:
			return;
	}
};