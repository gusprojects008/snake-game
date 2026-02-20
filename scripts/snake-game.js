const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");

const size = 30;
const xarea = 1500;
const yarea = 750;

const scoreValue = document.getElementById("ScoreValue");
const orientationWarning = document.getElementById("orientation-warning");
const container = document.getElementById("container0");

const eatSound = new Audio("statics/audio/audio.mp3");
const backgroundSound = new Audio("statics/audio/audiobackground.mp3");
const countdownSound = new Audio("statics/audio/SnapInsta.io - Contagem Regressiva 3 Segundos (128 kbps).mp3");

let snakeSpeed = 100;
let direction;
let loopId;

const snake = [{ x: 270, y: 240 }];

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function checkOrientation() {
    if (isMobile() && window.innerHeight > window.innerWidth) {
        container.style.display = "none";
        orientationWarning.style.display = "flex";
    } else {
        container.style.display = "flex";
        orientationWarning.style.display = "none";
    }
}

window.addEventListener("resize", () => {
    if (isMobile() && window.innerWidth > window.innerHeight) {
        location.reload();
    }
});

checkOrientation();

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

function randomPosition() {
    return Math.floor(Math.random() * (xarea / size)) * size;
}

function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
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
        snakeSpeed -= 8;
        snake.push(head);
        scoreValue.innerText = parseInt(scoreValue.innerText) + 1;

        food.x = randomPosition();
        food.y = randomPosition();
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

function gameLoop() {
    ctx.clearRect(0, 0, xarea, yarea);

    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    if (checkCollision()) return;

    loopId = setTimeout(gameLoop, snakeSpeed);
    backgroundSound.play();
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
    document.getElementById("mobile-controls").style.display = "flex";

    document.querySelectorAll("#mobile-controls button").forEach(btn => {
        btn.addEventListener("click", () => {
            direction = btn.getAttribute("data-dir");
        });
    });
}
