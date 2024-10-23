const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let cellSize;
const columns = 20;
const rows = 20;

const pauseButton = document.getElementById('pause');

canvas.width = Math.min(window.innerWidth, window.innerHeight);
canvas.height = canvas.width;

cellSize = canvas.width / 20;

let snake, direction, food, score;

let isPaused = true;

const tg = window.Telegram.WebApp;
const tg_user_id = tg.initDataUnsafe.user.id;

function initGame() {
    snake = [
        {x: 10, y: 10}, 
        {x: 9, y: 10}, 
        {x: 8, y: 10}
    ];
    direction = {x: 1, y: 0};
    food = {x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows)};
    score = 0;
}

function saveProgress() {
    const progress = {
        snake: snake,
        direction: direction,
        food: food,
        score: score,
    };
    localStorage.setItem('snakeGameProgress', JSON.stringify(progress));
}

function saveProgress_to_DB() {
    const gameState = {
        user_id: tg_user_id,
        snake_position: snake,
        direction: direction,
        food_position: food,
        score: score,
    };
    fetch('https://127.0.0.1/save_progress',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameState)
    });
}


function loadProgress() {
    const savedProgress = localStorage.getItem('snakeGameProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        snake = progress.snake;
        direction = progress.direction;
        food = progress.food;
        score = progress.score;
        pauseButton.innerText = 'Возобновить';
    } else {
        initGame();
    }
}

async function loadProgress_from_DB() {
    const response = await fetch(`https://127.0.0.1/load_progress?user_id=${tg_user_id}`);
    if (response.status == 200) {
        const data = await response.json();
        if (data.snake_position) {
            snake = JSON.parse(data.snake_position);
            food = JSON.parse(data.food_position);
            direction = JSON.parse(data.direction);
            score = JSON.parse(data.score);
            pauseButton.innerText = 'Возобновить';
        }
        else {
            loadProgress();
    }
    }
    else {
        loadProgress();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);


    ctx.fillStyle = 'black';
    snake.forEach(part => {
        ctx.fillRect(part.x * cellSize, part.y * cellSize, cellSize, cellSize);
    });

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
        gameOver();
        return;
    }

    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows)};
        saveProgress();
        saveProgress_to_DB();
    } else {
        snake.pop();
    }
}

function gameLoop() {
    if (!isPaused) {
        moveSnake();
        draw();
        saveProgress();
    }
}

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pause');
    pauseButton.innerText = isPaused ? 'Продолжить' : 'Пауза';
}

document.getElementById('pause').addEventListener('click', function() {
    if (localStorage.getItem('snakeGameProgress') == null) {
        initGame();
        isPaused = false;
        this.innerText = 'Пауза';
    }
    else {
        togglePause();
    }
});



window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            if (direction.y === 0) direction = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = {x: 1, y: 0};
            break;
    }
});


function handleButtonClick(newDirection) {
    if (newDirection.x !== -direction.x && newDirection.y !== -direction.y) {
        direction = newDirection;
    }
}


document.getElementById("up").addEventListener("click", () => {
    if (direction.y === 0) direction = {x: 0, y: -1};
});

document.getElementById("down").addEventListener("click", () => {
    if (direction.y === 0) direction = {x: 0, y: 1};
});

document.getElementById("left").addEventListener("click", () => {
    if (direction.x === 0) direction = {x: -1, y: 0};
});

document.getElementById("right").addEventListener("click", () => {
    if (direction.x === 0) direction = {x: 1, y: 0};
});


function gameOver() {
    alert(`Game Over! Your score is ${score}`);
    localStorage.removeItem('snakeGameProgress');
    resetGame();
}

function resetGame() {
    snake = [
        {x: 10, y: 10}, 
        {x: 9, y: 10}, 
        {x: 8, y: 10}
    ];
    direction = {x: 1, y: 0};
    food = {x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows)};
    score = 0;
}

loadProgress_from_DB();


setInterval(gameLoop, 200);