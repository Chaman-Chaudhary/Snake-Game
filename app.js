const board = document.querySelector("#game-board");
const instructionText = document.querySelector("#instruction-text");
const logo = document.querySelector("#logo");
const score = document.querySelector("#score");
const highScoreText = document.querySelector("#highScore");

const generateFood = () => {
    const x = Math.floor((Math.random() * gridSize) + 1) ;
    const y = Math.floor((Math.random() * gridSize) + 1) ;
    return { x, y};
}

const gridSize = 20;
let snake = [{x: 10, y: 10}, {x: 10, y: 9}];
let food = generateFood();
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;


const draw = () => {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

const drawSnake = () => {
    if(gameStarted) {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
    }
}

const createGameElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

const setPosition = (element, position) => {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

const drawFood = () => {
    if(gameStarted) {
        const foodElement = createGameElement("div", "food");
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

const move = () => {
    const head = { ...snake[0]};
    switch(direction) {
        case "right": 
            head.x++;
            break;
        case "left": 
            head.x--;
            break;
        case "up": 
            head.y--;
            break;
        case "down": 
            head.y++;
            break;
    }
    snake.unshift(head);

    if(head.x == food.x && head.y == food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay)
    } else {
        snake.pop();
    }
}

const startGame = () => {
    gameStarted = true;
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

const handleKeyPress = (event) => {
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === 'Space')) {
        startGame();
    } else {
        switch(event.key) {
            case 'ArrowUp': 
                direction = 'up';
                break;
            case 'ArrowDown': 
                direction = 'down';
                break;
            case 'ArrowRight': 
                direction = 'right';
                break;
            case 'ArrowLeft': 
                direction = 'left';
                break;
        }
    }
}

document.addEventListener("keydown", handleKeyPress);

const increaseSpeed = () => {
    if(gameSpeedDelay > 150)
        gameSpeedDelay -= 5;
    else if(gameSpeedDelay > 100)
        gameSpeedDelay -= 3;
    else if(gameSpeedDelay > 50)
        gameSpeedDelay -= 2;
    else if(gameSpeedDelay > 25)
        gameSpeedDelay -= 1;
}

const resetGame = () => {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}, {x: 10, y: 9}];
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 200;
    updateScore();

}

const checkCollision = () => {
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize)
        resetGame();

    for(let i=1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame(); 
        }
    }
}

const updateScore = () => {
    const currentScore = snake.length-2;
    score.textContent = currentScore.toString().padStart(3, '0');
}

const stopGame = () => {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
}

const updateHighScore = () => {
    const currentScore = snake.length-2;
    if(currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}