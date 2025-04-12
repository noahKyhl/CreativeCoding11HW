// Player position
var playerX = 50;
var playerY = 50;

// Movement keys
var keyW = 87;
var keyA = 65;
var keyS = 83;
var keyD = 68;

// Moving obstacles array
var obstacles = [];

// Mouse-placed obstacles array
var mouseObstacles = [];

// Exit area
var exitX = 450;
var exitY = 550;
var exitSize = 60;

// Shields
var maxShields = 5;

function setup() {
    createCanvas(500, 600);

    // Create 8 random moving obstacles
    for (var i = 0; i < 8; i++) {
        var randX = random(0, width - 60);
        var randY = random(0, height - 60);
        obstacles.push(createObstacle(randX, randY));
    }
}

function draw() {
    background(220);

    // Draw the exit zone
    fill(0, 255, 0);
    rect(exitX, exitY, exitSize, exitSize);
    textSize(16);
    fill(0);
    text("EXIT", exitX + 5, exitY + 25);

    // Draw player
    drawPlayer();
    handlePlayerMovement();

    // Draw Shield displays
    fill(0);
    textSize(16);
    text("Shields left: " + maxShields, 20, 20);

    // Warn player
    if (maxShields === 0) {
        fill(255, 0, 0);
        text("No shields left!", 20, 40);
    }

    if (isInSafeZone(playerX, playerY, 10)) {
        fill(0, 200, 255, 80); // light blue safe aura
        ellipse(playerX, playerY, 40); // glowing aura
    }

    // Move and draw each obstacle, and check collision
    for (var i = 0; i < obstacles.length; i++) {
        moveObstacle(obstacles[i]);
        drawObstacle(obstacles[i]);

        if (checkCollision(playerX, playerY, 10, obstacles[i]) && !isInSafeZone(playerX, playerY, 10)) {
            endGame("Game Over");
        }
    }

    // Draw mouse-created obstacles
    for (var j = 0; j < mouseObstacles.length; j++) {
        var m = mouseObstacles[j];
        fill(150, 100, 200);
        rect(m.x, m.y, m.w, m.h);
    }

    // Win condition check
    if (playerX > exitX && playerX < exitX + exitSize &&
        playerY > exitY && playerY < exitY + exitSize) {
        fill(0);
        textSize(32);
        text("You Win!", width / 2 - 80, height / 2);
        noLoop(); // stops draw loop
    }
}

function drawPlayer() {
    fill(0, 0, 255);
    ellipse(playerX, playerY, 20);
}

function handlePlayerMovement() {
    if (keyIsDown(keyW)) {
        playerY -= 3;
    }
    if (keyIsDown(keyS)) {
        playerY += 3;
    }
    if (keyIsDown(keyA)) {
        playerX -= 3;
    }
    if (keyIsDown(keyD)) {
        playerX += 3;
    }
}

function createObstacle(x, y) {
    return {
        x: x,
        y: y,
        w: Math.floor(random(20, 60)),
        h: Math.floor(random(20, 60)),
        speedX: random(-2, 2),
        speedY: random(-2, 2),
        color: color(random(255), random(255), random(255))
    };
}

function moveObstacle(obs) {
    obs.x += obs.speedX;
    obs.y += obs.speedY;

    // Wrap around the screen
    if (obs.x > width) {
        obs.x = 0;
    } else if (obs.x < 0) {
        obs.x = width;
    }

    if (obs.y > height) {
        obs.y = 0;
    } else if (obs.y < 0) {
        obs.y = height;
    }
}

function drawObstacle(obs) {
    fill(obs.color);
    rect(obs.x, obs.y, obs.w, obs.h);
}

function mouseClicked() {
    if (maxShields > 0) {
        mouseObstacles.push({
            x: mouseX,
            y: mouseY,
            w: 30,
            h: 30
        });
        maxShields--;
    }
}

// Check circular player against rectangular obstacle
function checkCollision(px, py, pr, obs) {
    return (px + pr > obs.x &&
            px - pr < obs.x + obs.w &&
            py + pr > obs.y &&
            py - pr < obs.y + obs.h);
}

// Same idea for mouse-placed blocks
function checkBoxCollision(px, py, pr, block) {
    return (px + pr > block.x &&
            px - pr < block.x + block.w &&
            py + pr > block.y &&
            py - pr < block.y + block.h);
}

// Show message and stop the game
function endGame(message) {
    fill(0);
    textSize(32);
    text(message, width / 2 - 80, height / 2);
    noLoop();
}

function isInSafeZone(px, py, pr) {
    for (var i = 0; i < mouseObstacles.length; i++) {
        var zone = mouseObstacles[i];
        if (px + pr > zone.x &&
            px - pr < zone.x + zone.w &&
            py + pr > zone.y &&
            py - pr < zone.y + zone.h) {
            return true; // Player is inside a safe zone
        }
    }
    return false;
}
