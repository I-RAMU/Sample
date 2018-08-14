const N = 8;
const EMPTY = -1;
const BLACK = 1;
const WHITE = 0;

let board;
let tmpBoard;

let fieldColor = BLACK;
let playerColor = BLACK;
let enemyColor = WHITE;

window.onload = function() {
	document.getElementById("canvas").onmousedown = MouseClickHandler;

	initBoard();
	printBoard();
}


const initBoard = function() {
	board = new Array(N);

	for (let i = 0; i < N; i++) {
		board[i] = new Array(N);
		board[i].fill(-1);
	}

	board[3][3] = WHITE;
	board[3][4] = BLACK;
	board[4][3] = BLACK;
	board[4][4] = WHITE;

	tmpBoard = board.slice();
}

const printBoard = function() {
	let ctx = document.getElementById("canvas").getContext("2d");

	let panel = "rgb(0, 255, 0)";
	let white = "rgb(255, 255, 255)";
	let black = "rgb(0, 0, 0)";

	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			switch (board[i][j]) {
			case BLACK:
				ctx.beginPath();
				ctx.fillStyle = panel;
				ctx.fillRect(50 * j, 50 * i, 50, 50);
				ctx.strokeStyle = black;
				ctx.strokeRect(50 * j, 50 * i, 50, 50);
				ctx.fillStyle = black;
				ctx.arc(50 * j + 25, 50 * i + 25, 25, 0, 360 * Math.PI / 180, true);
				ctx.fill();
				ctx.closePath();
				break;
			case WHITE:
				ctx.beginPath();
				ctx.fillStyle = panel;
				ctx.fillRect(50 * j, 50 * i, 50, 50);
				ctx.strokeStyle = black;
				ctx.strokeRect(50 * j, 50 * i, 50, 50);
				ctx.fillStyle = white;
				ctx.arc(50 * j + 25, 50 * i + 25, 25, 0, 360 * Math.PI / 180, true);
				ctx.fill();
				ctx.closePath();
				break;
			default:
				ctx.beginPath();
				ctx.fillStyle = panel;
				ctx.fillRect(50 * j, 50 * i, 50, 50);
				ctx.strokeStyle = black;
				ctx.strokeRect(50 * j, 50 * i, 50, 50);
				ctx.closePath();
			}
		}
	}
}

const MouseClickHandler = function(event) {
	//event = event | window.event // IE対応(らしい)

	let clickX = parseInt(event.layerX / 50);
	let clickY = parseInt(event.layerY / 50);
	
	if (fieldColor == playerColor) {
		if (CanPutStone(clickX, clickY, playerColor)) {
			PutStone(clickX, clickY, playerColor);
			ChangeFiledState();
		}
	}
}

const ChangeFiledState = function () {
	printBoard();

	ChangeFieldColor();

	tmpBoard = board.slice();

	if (!IsNotPass(playerColor) && !IsNotPass(enemyColor)) {
		alert("ゲーム終了");
	} else {
		if (!IsNotPass(fieldColor)) {
			if (fieldColor == playerColor) {
				alert("あなたのパス");
				ChangeFieldColor();
				EnemyTurn();
			} else {
				alert("敵のパス");
				ChangeFieldColor();
			}
		} else {
			if (fieldColor == enemyColor) {
				EnemyTurn();
			}
		}
	}
}

const ChangeFieldColor = function () {
	if (fieldColor == BLACK) {
		fieldColor = WHITE;
	} else {
		fieldColor = BLACK;
	}
}

const CanPutStone = function (x, y, color) {
	if (IsPanelNone(x, y)) {
		let up = CanReverseStone(x, y, 0, -1, color);
		let down = CanReverseStone(x, y, 0, 1, color);
		let left = CanReverseStone(x, y, -1, 0, color);
		let right = CanReverseStone(x, y, 1, 0, color);
		let upLeft = CanReverseStone(x, y, -1, -1, color);
		let upRight = CanReverseStone(x, y, 1, -1, color);
		let downLeft = CanReverseStone(x, y, -1, 1, color);
		let downRight = CanReverseStone(x, y, 1, 1, color);

		return up || down || left || right || upLeft || upRight || downLeft || downRight;
	} else {
		return false;
	}
}

const IsPanelNone = function (x, y) {
	if (tmpBoard[y][x] == EMPTY) {
		return true;
	} else {
		return false;
	}
}

const CanReverseStone = function (x, y, dx, dy, color) {
	let ref_X = x + dx;
	let ref_Y = y + dy;

	// 1つ隣
	if (ref_X < 0 || N <= ref_X || ref_Y < 0 || N <= ref_Y) {
		return false;
	} else if (tmpBoard[ref_Y][ref_X] == EMPTY || tmpBoard[ref_Y][ref_X] == color) {
		return false;
	} else {

		// さらに1つ隣以降
		ref_X += dx;
		ref_Y += dy;

		while (0 <= ref_X && ref_X < N && 0 <= ref_Y && ref_Y < N) {
			if (tmpBoard[ref_Y][ref_X] == color) {
				return true;
			} else if (tmpBoard[ref_Y][ref_X] == EMPTY) {
				return false;
			} else {
				ref_X += dx;
				ref_Y += dy;
			}
		}

		return false;
	}
}

const PutStone = function (x, y, color) {
	if (CanReverseStone(x, y, 0, -1, color)) {
		ReverseStone(x, y, 0, -1, color);
	}
	
	if (CanReverseStone(x, y, 0, 1, color)) {
		ReverseStone(x, y, 0, 1, color);
	}
	
	if (CanReverseStone(x, y, -1, 0, color)) {
		ReverseStone(x, y, -1, 0, color);
	}
	
	if (CanReverseStone(x, y, 1, 0, color)) {
		ReverseStone(x, y, 1, 0, color);
	}
	
	if (CanReverseStone(x, y, -1, -1, color)) {
		ReverseStone(x, y, -1, -1, color);
	}
	
	if (CanReverseStone(x, y, 1, -1, color)) {
		ReverseStone(x, y, 1, -1, color);
	}
	
	if (CanReverseStone(x, y, -1, 1, color)) {
		ReverseStone(x, y, -1, 1, color);
	}
	
	if (CanReverseStone(x, y, 1, 1, color)) {
		ReverseStone(x, y, 1, 1, color);
	}
}

const ReverseStone = function (x, y, dx, dy, color) {
	let ref_X = x;
	let ref_Y = y;

	do {
		board[ref_Y][ref_X] = color;
		ref_X += dx;
		ref_Y += dy;
	} while (board[ref_Y][ref_X] != color);
}

const IsNotPass = function (color) {
	let retVal = false;

	for (i = 0; i < N ; i++) {
		for (j = 0; j < N; j++) {
			retVal = retVal || CanPutStone(j, i, color);
		}
	}

	return retVal;
}

const EnemyTurn = function () {
	let point_X = -1;
	let point_Y = -1;

	do {
		point_X = Math.floor(Math.random() * N);
		point_Y = Math.floor(Math.random() * N);
	} while (!CanPutStone(point_X, point_Y, enemyColor));

	PutStone(point_X, point_Y, enemyColor);
	ChangeFiledState();
}
