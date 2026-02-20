const familyMode = true;

const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");

let size;

function calculateBlockSize() {
    const rect = canvas.getBoundingClientRect();
    const base = Math.min(rect.width, rect.height);
    size = Math.floor(base / 30);
}

let xarea;
let yarea;

const scoreValue = document.getElementById("ScoreValue");
const orientationWarning = document.getElementById("orientation-warning");
const container = document.getElementById("container0");

const eatSound = new Audio(
    familyMode
        ? "statics/audio/audio-familia.mp3"
        : "statics/audio/audio.mp3"
);

const backgroundSound = new Audio("statics/audio/audio-background.mp3");
const countdownSound = new Audio("statics/audio/contagem-regressiva.mp3");

let snakeSpeed = 100;
let direction;
let loopId;

let snake = [];

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    calculateBlockSize();

    xarea = Math.floor(rect.width / size) * size;
    yarea = Math.floor(rect.height / size) * size;
}

function initGame() {
    backgroundSound.play();
    resizeCanvas();

    snake = [{
        x: Math.floor((xarea / 2) / size) * size,
        y: Math.floor((yarea / 2) / size) * size
    }];

    food.x = randomPositionX();
    food.y = randomPositionY();
}

function drawSnake() {
    snake.forEach((pos, index) => {
        ctx.fillStyle = index === snake.length - 1 ? "blue" : "#ddd";
        ctx.shadowColor = index === snake.length - 1 ? "blue" : "transparent";
        ctx.shadowBlur = index === snake.length - 1 ? 40 : 0;
        ctx.fillRect(pos.x, pos.y, size, size);
    });
}

function moveSnake() {
    if (!direction) return;

    const head = snake[snake.length - 1];
    let newHead = { x: head.x, y: head.y };

    if (direction === "right") newHead.x += size;
    if (direction === "left") newHead.x -= size;
    if (direction === "down") newHead.y += size;
    if (direction === "up") newHead.y -= size;

    snake.push(newHead);
    snake.shift();
}

function randomPositionX() {
    return Math.floor(Math.random() * (xarea / size)) * size;
}

function randomPositionY() {
    return Math.floor(Math.random() * (yarea / size)) * size;
}

function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

const food = {
    x: 0,
    y: 0,
    color: randomColor()
};

function drawFood() {
    ctx.shadowColor = food.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, size, size);
    ctx.shadowBlur = 0;
}

function checkEat() {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        snakeSpeed = snakeSpeed - 10;
        snake.push({ ...head });

        scoreValue.innerText = parseInt(scoreValue.innerText) + 1;

        let newX = randomPositionX();
        let newY = randomPositionY();

        while (snake.find(p => p.x === newX && p.y === newY)) {
            newX = randomPositionX();
            newY = randomPositionY();
        }

        food.x = newX;
        food.y = newY;
        food.color = randomColor();

        eatSound.play();
    }
}

function checkCollision() {
    const head = snake[snake.length - 1];

    if (
        head.x < 0 ||
        head.x + size > xarea ||
        head.y < 0 ||
        head.y + size > yarea
    ) {
        document.getElementById("GameOver").style.display = "block";
        document.getElementById("ContinueGame").style.display = "block";
        clearTimeout(loopId);
        return true;
    }

    return false;
}

let lastTime = 0;

function gameLoop(currentTime = 0) {
    const delta = currentTime - lastTime;

    if (delta > snakeSpeed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawFood();
        moveSnake();
        drawSnake();
        checkEat();

        if (checkCollision()) return;

        lastTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}

function startCountdown() {
    document.getElementById("StartButton").style.display = "none";
    const timer = document.getElementById("TimeRegressive");

    let count = 3;

    const interval = setInterval(() => {
        countdownSound.play();
        timer.textContent = count;
        count--;

        if (count < 0) {
            clearInterval(interval);
            timer.style.display = "none";
            initGame();
            gameLoop();
        }
    }, 1000);
}

function continueGame() {
    location.reload();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") direction = "right";
    if (e.key === "ArrowLeft") direction = "left";
    if (e.key === "ArrowUp") direction = "up";
    if (e.key === "ArrowDown") direction = "down";
});

if (isMobile()) {
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener("touchstart", e => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });
    
    canvas.addEventListener("touchend", e => {
        const touch = e.changedTouches[0];
    
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
    
        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? "right" : "left";
        } else {
            direction = dy > 0 ? "down" : "up";
        }
    });
}

window.addEventListener("resize", () => {
    resizeCanvas();
});
