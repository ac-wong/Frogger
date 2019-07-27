// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of the Enemy instances

    // The image/sprite for our enemies, this uses
    // a helper to easily load images
    this.sprite = 'images/enemy-bug.png';

    // set initial position
    this.x = x;
    this.y = y;

    // set speed
    this.speed = speed;

    // variable used to pause movement
    this.paused = false;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.paused) {
        this.x = this.x;
    }
    else if (this.x >= 505) {
        this.x = -5;
        // after an enemy goes off canvas it reappears at a different random speed
        this.speed = 100 + Math.floor(Math.random() * 322);
    }
    else {
        this.x += (this.speed * dt);
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check for collision with the enemy
Enemy.prototype.collision = function(playerX, playerY) {
    // there is approx 19px left of player and player is about 65px (therefore 94px)
    // there is around 2px right of enemy and enemy is about 96px (therefore 84px)
    if (playerX + 19 < this.x + 94 && playerX + 84 > this.x && playerY < this.y + 50 && playerY + 50 > this.y) {
        return 1; // return 1 if there is a collision
    }
    else {
        return 0; // return 0 if no collision
    }
}


// Player class
let Player = function() {
    // Variables applied to the Player instance

    // The image/sprite for our player, this uses
    // a helper to easily load images. In next iteration we can allow users to
    // select different characters for the player
    this.sprite = 'images/char-boy.png';

    // set initial position
    this.x = 202;
    this.y = 405;

    // variable used to pause movement
    this.paused = false;
    };


// Updates for the player (in addition to handleInput)
Player.prototype.update = function() {
    // check collision of the player with enemies
    for (let i = 0; i < allEnemies.length; i++) {
        let result = allEnemies[i].collision(this.x, this.y);

        // if there is a collision
        if (result > 0) {

            // pause positions
            this.paused = true;

            allEnemies.forEach(function(enemy) {
                enemy.paused = true;
            });

            // reset positions
            let enemiesY = [60, 145, 228];
            for (let i = 0; i < allEnemies.length; i++) {
                allEnemies[i].x = 0;
                allEnemies[i].y = enemiesY[i];
            }

            this.y = 405
            this.x = 202;

            // then reset flags to allow enemies and player to start moving again
            allEnemies.forEach(function(enemyRestart) {
                enemyRestart.paused = false;
            });
            this.paused = false;

        }
    }

    // display win if player reaches water
    if (this.y <= 55 && this.paused === false) {
      // pause objects
      this.paused = true;
      allEnemies.forEach(function(enemyEnd) {
          enemyEnd.paused = true;
      });
      //display modal
      displayModal();
    }
}

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Return valid key press to the Player nextMove property
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.paused === false) {
        if (this.x > 0) {
            this.x -= 101;
        }
    }
    else if (key === 'up' && this.paused === false) {
        if (this.y > 50) {
            this.y -= 83;
        }
    }
    else if (key === 'right' && this.paused === false) {
        if (this.x < 404) {
            this.x += 101;
        }
    }
    else if (key === 'down' && this.paused === false) {
        if (this.y < 405) {
            this.y += 83;
        }
    }
}


// Instantiate the enemy and player objects
let allEnemies = [new Enemy(0, 60, 220), new Enemy(0, 145, 150), new Enemy(0, 228, 300)];
let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});


// when click Replay link on modal, close the modal and reset the game
function clickReplay() {
    hideModal();

    let enemiesY = [60, 145, 228];
    for (let i = 0; i < allEnemies.length; i++) {
        allEnemies[i].x = 0;
        allEnemies[i].y = enemiesY[i];
    }
    player.y = 405
    player.x = 202;

    allEnemies.forEach(function(enemyRestart) {
        enemyRestart.paused = false;
    });
    player.paused = false;
}

// when click Exit link on the modal, close the browser window
function clickExit() {
    window.close();
}

// this displays the modal
function displayModal() {
    let el = document.getElementsByClassName("modal")[0];
    el.style.display = "flex";

    let bg = document.getElementsByClassName("modal-bg")[0];
    bg.style.display = "block";

}

// this hides the modal
function hideModal() {
    let el = document.getElementsByClassName("modal")[0];
    el.style.display = "none";

    let bg = document.getElementsByClassName("modal-bg")[0];
    bg.style.display = "none";
}
