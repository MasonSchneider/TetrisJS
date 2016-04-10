
var c=document.getElementById("gameBox");
var pix = document.getElementById("gameBox").width / 10;
var ctx=c.getContext("2d");
var currGame = new game();
var slots;


function loadGame() {
    document.onkeydown = checkKey;
    currGame.startGame();
    currGame.draw();
    setInterval(tetris,400);
}


function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        // right
        currGame.rotateRight();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,400,880);
        currGame.draw();
    } else if (e.keyCode == '40') {
        // down arrow
        // right
        currGame.rotateLeft();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,400,880);
        currGame.draw();
    } else if(e.keyCode == '37') {
        // left
        currGame.moveLeft();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,400,880);
        currGame.draw();
    } else if(e.keyCode == '39') {
        // right
        currGame.moveRight();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,400,880);
        currGame.draw();
    } else if (e.keyCode == '32') {
        // space bar
        tetris();
    }
}

function tetris() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,pix*10,pix*22);
    currGame.tick();
    currGame.draw();
}

function block(row,col,color) {
    this.col = col;
    this.row = row;
    this.color = color;
    this.draw = draw;
    this.tick = tick;

    function draw() {
        ctx.fillStyle = color;
        ctx.fillRect(pix*this.col,pix*this.row,pix,pix);
        ctx.strokeStyle="black";
        ctx.lineWidth="2";
        ctx.strokeRect(pix*this.col, pix*this.row,pix,pix);
    }

    function tick() {
        this.row = this.row + 1;
    }
}

function square(col) {
    (col < 8) ? this.col = col : this.col = 8;
    this.row = -1;
    this.blocks = new Array();
    this.blocks[0] = new block(this.row-1, this.col, "#FFFF00");
    this.blocks[1] = new block(this.row-1, this.col+1, "#FFFF00");
    this.blocks[2] = new block(this.row, this.col, "#FFFF00");
    this.blocks[3] = new block(this.row, this.col+1, "#FFFF00");

    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        return;
    }
    function rotateLeft() {
        return;
    }
    function moveRight() {
        if(this.col < 8 && slots[this.row][this.col+2] === 0 && slots[this.row-1][this.col+2] === 0) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col+1;
            }
            this.col++;
        }
    }
    function moveLeft() {
        if(this.col > 0 && slots[this.row][this.col-1] === 0 && slots[this.row-1][this.col-1] === 0) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col-1;
            }
            this.col--;
        }
        
    }
    function draw() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
    }
    function tick() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].tick();
        }
        this.row++;
    }
}

function shape(shape, col) {
    this.shape = shape;
    if(this.shape == "square") {
        this.shape = new square(col);
    } else if(this.shape == "iShape") {
        this.shape = new iShape(col);
    } else if(this.shape == "lShape") {
        this.shape = new lShape(col);
    } else if(this.shape == "jShape") {
        this.shape = new jShape(col);
    } else if(this.shape == "zShape") {
        this.shape = new zShape(col);
    } else if(this.shape == "tShape") {
        this.shape = new tShape(col);
    } else if(this.shape == "sShape") {
        this.shape = new sShape(col);
    }
    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        this.shape.rotateRight();
    }
    function rotateLeft() {
        this.shape.rotateLeft();
    }
    function moveRight() {
        this.shape.moveRight();
    }
    function moveLeft() {
        this.shape.moveLeft();
    }
    function draw() {
        this.shape.draw();
    }
    function tick() {
        this.shape.tick();
    }
}

function game() {
    slots = new Array();
    for(var i = 0; i < 22; i++) {
        slots[i] = new Array();
        for(var c = 0; c < 10; c++) {
            slots[i][c] = 0;
        }
    }

    this.startGame = startGame;
    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;
    this.checkLines = checkLines;
    this.checkLose = checkLose;

    function rotateRight() {
        this.shape.rotateRight();
    }
    function rotateLeft() {
        this.shape.rotateLeft();
    }
    function moveRight() {
        this.shape.moveRight();
    }
    function moveLeft() {
        this.shape.moveLeft();
    }

    function tick() {
        if(this.gameState == "lost") {
            return;
        }
        this.shape.tick();
        this.blocks = this.shape.shape.blocks;
        var stopped = false;
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].row+1 == 22 || slots[this.blocks[i].row+1][this.blocks[i].col] != 0) {
                stopped = true;
            }
        }
        if(stopped) {
            for(var i = 0; i < this.blocks.length; i++) {
                slots[this.blocks[i].row][this.blocks[i].col] = this.blocks[i];
            }
            this.checkLines();
            this.checkLose();
            var rand = Math.floor((Math.random()*10));
            var randP = Math.floor((Math.random()*7));
            if(randP == 0) {
                this.shape = new shape("square",rand);
            } else if(randP == 1) {
                this.shape = new shape("iShape",rand);
            } else if(randP == 2) {
                this.shape = new shape("lShape",rand);
            } else if(randP == 3) {
                this.shape = new shape("jShape",rand);
            } else if(randP == 4) {
                this.shape = new shape("zShape",rand);
            } else if(randP == 5) {
                this.shape = new shape("tShape",rand);
            } else if(randP == 6) {
                this.shape = new shape("sShape",rand);
            } 
        }
    }

    function checkLines() {
        for(var r = 0; r < 22; r++) {
            var full = true;
            for(var c = 0; c < 10; c++) {
                if(slots[r][c] == 0) {
                    full = false;
                }
            }
            if(full) {
                document.getElementById("score").innerHTML = "Score: " + (parseInt(document.getElementById("score").innerHTML.substring(7)) + 100);
                for(var p = r; p > 0; p--) {                                        
                    for(var c = 0; c < 10; c++) {                        
                        slots[p][c] = slots[p-1][c];
                        slots[p][c].row = slots[p][c].row+1;
                    }
                }
                for(var col = 0; col < 10; col++) {
                    slots[0][col] = 0;
                }
                r--;
            }
        }
    }

    function checkLose() {
        for(var c = 0; c < 10; c++) {
            if(slots[0][c] != 0) {
                this.gameState = "lost";
                document.getElementById("score").innerHTML = "You lose with a score of: " + (document.getElementById("score").innerHTML.substring(7));
                return;
            }
        }
    }

    function draw() {            
        for(var r = 0; r < 22; r++) {
            for(var c = 0; c < 10; c++) {
                if(slots[r][c] != 0) {
                    slots[r][c].draw();
                }
            }
        }
        this.shape.draw();
    }

    function startGame() {
        var rand = Math.floor((Math.random()*10));
        var randP = Math.floor((Math.random()*7));
        if(randP == 0) {
            this.shape = new shape("square",rand);
        } else if(randP == 1) {
            this.shape = new shape("iShape",rand);
        } else if(randP == 2) {
            this.shape = new shape("lShape",rand);
        } else if(randP == 3) {
            this.shape = new shape("jShape",rand);
        } else if(randP == 4) {
            this.shape = new shape("zShape",rand);
        } else if(randP == 5) {
            this.shape = new shape("tShape",rand);
        } else if(randP == 6) {
            this.shape = new shape("sShape",rand);
        } 
    }
}

function zShape(col) {
    /*
    Up:
          x
         xx
         x
    Side:
        xx
         xx
    */
    this.col = col;
    if(this.col > 8) this.col = 8;
    if(this.col < 1) this.col = 1;
    this.row = -1;
    this.blocks = new Array();
    var color = "#FF1E00";
    this.blocks[0] = new block(this.row, this.col, "#FF1E00");
    this.blocks[1] = new block(this.row-1, this.col, "#FF1E00");
    this.blocks[2] = new block(this.row-1, this.col-1, "#FF1E00");
    this.blocks[3] = new block(this.row, this.col+1, "#FF1E00");

    this.pos = "side";

    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        if(this.pos == "side" && this.row+1 <= 21 && this.col+1 < 10 && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row, this.col, "#FF1E00");
            this.blocks[1] = new block(this.row-1, this.col+1, "#FF1E00");
            this.blocks[2] = new block(this.row+1, this.col, "#FF1E00");
            this.blocks[3] = new block(this.row, this.col+1, "#FF1E00");
        } else if(this.pos == "up" && this.row+1 <= 21 && this.col-1 >= 0 && this.col+1 < 10 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "side";
            this.blocks[0] = new block(this.row, this.col, "#FF1E00");
            this.blocks[1] = new block(this.row, this.col-1, "#FF1E00");
            this.blocks[2] = new block(this.row+1, this.col+1, "#FF1E00");
            this.blocks[3] = new block(this.row+1, this.col, "#FF1E00");
        }
    }
    function rotateLeft() {
        if(this.pos == "side" && this.row+1 <= 21 && this.col-1 >= 0 && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row, this.col, "#FF1E00");
            this.blocks[1] = new block(this.row-1, this.col+1, "#FF1E00");
            this.blocks[2] = new block(this.row+1, this.col, "#FF1E00");
            this.blocks[3] = new block(this.row, this.col+1, "#FF1E00");
        } else if(this.pos == "up" && this.row+1 <= 21 && this.col-1 >= 0 && this.col+1 < 10 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "side";
            this.blocks[0] = new block(this.row, this.col, "#FF1E00");
            this.blocks[1] = new block(this.row, this.col-1, "#FF1E00");
            this.blocks[2] = new block(this.row+1, this.col+1, "#FF1E00");
            this.blocks[3] = new block(this.row+1, this.col, "#FF1E00");
        }
    }
    function moveRight() {
        if((this.col+1 < 9 && this.pos == "up" && slots[this.row][this.col+2] === 0 && slots[this.row-1][this.col+2] === 0 && slots[this.row+1][this.col+1] === 0) || 
            (this.col+1 < 9 && this.pos == "side" && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+2] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col+1;
            }
            this.col++;
        }
    }
    function moveLeft() {
        if((this.col > 0 && this.pos == "up" && slots[this.row][this.col-1] === 0 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col-1] === 0) || 
            (this.col-1 > 0 && this.pos == "side" && slots[this.row][this.col-2] === 0 && slots[this.row+1][this.col-1] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col-1;
            }
            this.col--;
        }
        
    }
    function draw() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
    }
    function tick() {
        var stopped = false;
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].row+1 == 22 || this.row > -1 && slots[this.blocks[i].row+1][this.blocks[i].col] !== 0) {
                stopped = true;
            }
        }
        if (stopped) {
            return;
        }
        for(i = 0; i < this.blocks.length; i++) {
            this.blocks[i].tick();
        }
        this.row++;
    }
}

function tShape(col) {
    this.col = col;
    if(this.col > 8) this.col = 8;
    if(this.col < 1) this.col = 1;
    this.row = -1;
    this.blocks = new Array();
    this.blocks[0] = new block(this.row, this.col, "#F600FF");
    this.blocks[1] = new block(this.row-1, this.col, "#F600FF");
    this.blocks[2] = new block(this.row, this.col+1, "#F600FF");
    this.blocks[3] = new block(this.row, this.col-1, "#F600FF");

    this.pos = "up";

    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        if(this.pos == "up" && this.row+1 <= 21 && slots[this.row+1][this.col] === 0) {
            this.pos = "right";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row-1, this.col, "#F600FF");
            this.blocks[2] = new block(this.row+1, this.col, "#F600FF");
            this.blocks[3] = new block(this.row, this.col+1, "#F600FF");
        } else if(this.pos == "right" && this.row+1 <= 21 && this.col > 0 && slots[this.row][this.col-1] === 0) {
            this.pos = "down";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row, this.col+1, "#F600FF");
            this.blocks[2] = new block(this.row, this.col-1, "#F600FF");
            this.blocks[3] = new block(this.row+1, this.col, "#F600FF");
        } else if(this.pos == "down" && this.row+1 <= 21 && slots[this.row-1][this.col] === 0) {
            this.pos = "left";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row-1, this.col, "#F600FF");
            this.blocks[2] = new block(this.row+1, this.col, "#F600FF");
            this.blocks[3] = new block(this.row, this.col-1, "#F600FF");
        } else if(this.pos == "left" && this.col < 9 && slots[this.row][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row-1, this.col, "#F600FF");
            this.blocks[2] = new block(this.row, this.col+1, "#F600FF");
            this.blocks[3] = new block(this.row, this.col-1, "#F600FF");
        }
    }
    function rotateLeft() {
        if(this.pos == "up" && this.row+1 <= 21 && slots[this.row][this.col+1] === 0) {
            this.pos = "left";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row-1, this.col, "#F600FF");
            this.blocks[2] = new block(this.row+1, this.col, "#F600FF");
            this.blocks[3] = new block(this.row, this.col-1, "#F600FF");
        } else if(this.pos == "right" && this.col > 0 && slots[this.row][this.col-1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row-1, this.col, "#F600FF");
            this.blocks[2] = new block(this.row, this.col+1, "#F600FF");
            this.blocks[3] = new block(this.row, this.col-1, "#F600FF");
        } else if(this.pos == "down" && this.row+1 <= 21 && slots[this.row+1][this.col] === 0) {
            this.pos = "right";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row-1, this.col, "#F600FF");
            this.blocks[2] = new block(this.row+1, this.col, "#F600FF");
            this.blocks[3] = new block(this.row, this.col+1, "#F600FF");
        } else if(this.pos == "left" && this.row+1 <= 21 && this.col < 9 && slots[this.row][this.col+1] === 0) {
            this.pos = "down";
            this.blocks[0] = new block(this.row, this.col, "#F600FF");
            this.blocks[1] = new block(this.row, this.col+1, "#F600FF");
            this.blocks[2] = new block(this.row, this.col-1, "#F600FF");
            this.blocks[3] = new block(this.row+1, this.col, "#F600FF");
        }
    }
    function moveRight() {
        if((this.col+1 < 9 && this.pos == "up" && slots[this.row][this.col+2] === 0 && slots[this.row-1][this.col+1] === 0) || 
        	(this.col+1 < 9 && this.pos == "right" && slots[this.row][this.col+2] === 0 && slots[this.row-1][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) || 
        	(this.col < 9 && this.pos == "left" && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) || 
        	(this.col+1 < 9 && this.pos == "down" && slots[this.row][this.col+2] === 0 && slots[this.row+1][this.col+1] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col+1;
            }
            this.col++;
        }
    }
    function moveLeft() {
        if((this.col-1 > 0 && this.pos == "up" && slots[this.row][this.col-2] === 0 && slots[this.row-1][this.col-1] === 0) || 
        	(this.col > 0 && this.pos == "right" && slots[this.row][this.col-1] === 0 && slots[this.row-1][this.col-1] === 0 && slots[this.row+1][this.col-1] === 0) || 
        	(this.col-1 > 0 && this.pos == "left" && slots[this.row][this.col-2] === 0 && slots[this.row-1][this.col-1] === 0 && slots[this.row+1][this.col-1] === 0) || 
        	(this.col-1 > 0 && this.pos == "down" && slots[this.row][this.col-2] === 0 && slots[this.row+1][this.col-1] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col-1;
            }
            this.col--;
        }
        
    }
    function draw() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
    }
    function tick() {
        var stopped = false;
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].row+1 == 22 || this.row > -1 && slots[this.blocks[i].row+1][this.blocks[i].col] !== 0) {
                stopped = true;
            }
        }
        if (stopped) {
            return;
        }
        for(i = 0; i < this.blocks.length; i++) {
            this.blocks[i].tick();
        }
        this.row++;
    }
}

function sShape(col) {
    /*
    Up:
         x
         xx
          x
    Side:
         xx
        xx
    */
    this.col = col;
    if(this.col > 8) this.col = 8;
    if(this.col < 1) this.col = 1;
    this.row = -1;
    this.blocks = new Array();
    this.blocks[0] = new block(this.row, this.col, "#09FF00");
    this.blocks[1] = new block(this.row-1, this.col, "#09FF00");
    this.blocks[2] = new block(this.row-1, this.col+1, "#09FF00");
    this.blocks[3] = new block(this.row, this.col-1, "#09FF00");

    this.pos = "side";

    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        if(this.pos == "side" && this.row+1 <= 21 && this.col < 9 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row, this.col, "#09FF00");
            this.blocks[2] = new block(this.row, this.col+1, "#09FF00");
            this.blocks[1] = new block(this.row-1, this.col, "#09FF00");
            this.blocks[3] = new block(this.row+1, this.col+1, "#09FF00");
        } else if(this.pos == "up" && this.row+1 <= 21 && this.col > 0 && slots[this.row+1][this.col] === 0 && slots[this.row+1][this.col-1] === 0) {
            this.pos = "side";
            this.blocks[0] = new block(this.row, this.col, "#09FF00");
            this.blocks[1] = new block(this.row, this.col+1, "#09FF00");
            this.blocks[2] = new block(this.row+1, this.col-1, "#09FF00");
            this.blocks[3] = new block(this.row+1, this.col, "#09FF00");
        }
    }
    function rotateLeft() {
        if(this.pos == "side" && this.row+1 <= 21 && this.col < 9 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row, this.col, "#09FF00");
            this.blocks[2] = new block(this.row, this.col+1, "#09FF00");
            this.blocks[1] = new block(this.row-1, this.col, "#09FF00");
            this.blocks[3] = new block(this.row+1, this.col+1, "#09FF00");
        } else if(this.pos == "up" && this.row+1 <= 21 && this.col > 0 && slots[this.row+1][this.col] === 0 && slots[this.row+1][this.col-1] === 0) {
            this.pos = "side";
            this.blocks[0] = new block(this.row, this.col, "#09FF00");
            this.blocks[1] = new block(this.row, this.col+1, "#09FF00");
            this.blocks[2] = new block(this.row+1, this.col-1, "#09FF00");
            this.blocks[3] = new block(this.row+1, this.col, "#09FF00");
        }
    }
    function moveRight() {
        if((this.col+1 < 9 && this.pos == "up" && slots[this.row][this.col+2] === 0 && slots[this.row+1][this.col+2] === 0 && slots[this.row-1][this.col+1] === 0) || 
            (this.col+1 < 9 && this.pos == "side" && slots[this.row+1][this.col+1] === 0 && slots[this.row][this.col+2] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col+1;
            }
            this.col++;
        }
    }
    function moveLeft() {
        if((this.col > 0 && this.pos == "up" && slots[this.row][this.col-1] === 0 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col-1] === 0) || 
            (this.col-1 > 0 && this.pos == "side" && slots[this.row][this.col-2] === 0 && slots[this.row+1][this.col-1] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col-1;
            }
            this.col--;
        }
        
    }
    function draw() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
    }
    function tick() {
        var stopped = false;
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].row+1 == 22 || this.row > -1 && slots[this.blocks[i].row+1][this.blocks[i].col] !== 0) {
                stopped = true;
            }
        }
        if (stopped) {
            return;
        }
        for(i = 0; i < this.blocks.length; i++) {
            this.blocks[i].tick();
        }
        this.row++;
    }
}

function jShape(col) {
    this.col = col;
    if(this.col > 8) this.col = 8;
    if(this.col < 1) this.col = 1;
    this.row = -1;
    this.blocks = new Array();
    this.blocks[0] = new block(this.row, this.col-1, "#006EFF");
    this.blocks[1] = new block(this.row, this.col, "#006EFF");
    this.blocks[2] = new block(this.row, this.col+1, "#006EFF");
    this.blocks[3] = new block(this.row-1, this.col-1, "#006EFF");

    this.pos = "left";

    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        if(this.pos == "left" && this.row+1 <= 21 && this.col+1 <= 9 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0 && slots[this.row-1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row-1, this.col, "#006EFF");
            this.blocks[1] = new block(this.row, this.col, "#006EFF");
            this.blocks[2] = new block(this.row+1, this.col, "#006EFF");
            this.blocks[3] = new block(this.row-1, this.col+1, "#006EFF");
        } else if(this.pos == "up" && this.row+1 <= 21 && this.col-1 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "right";
            this.blocks[0] = new block(this.row, this.col-1, "#006EFF");
            this.blocks[1] = new block(this.row, this.col+1, "#006EFF");
            this.blocks[2] = new block(this.row, this.col, "#006EFF");
            this.blocks[3] = new block(this.row+1, this.col+1, "#006EFF");
        } else if(this.pos == "right" && this.row+1 <= 21 && this.col-1 >= 0 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col-1] === 0 && slots[this.row+1][this.col] === 0) {
            this.pos = "down";
            this.blocks[0] = new block(this.row, this.col, "#006EFF");
            this.blocks[1] = new block(this.row-1, this.col, "#006EFF");
            this.blocks[2] = new block(this.row+1, this.col-1, "#006EFF");
            this.blocks[3] = new block(this.row+1, this.col, "#006EFF");
        } else if(this.pos == "down" && this.col+1<=9 && this.col-1>=1 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col-1] === 0) {
            this.pos = "left";
            this.blocks[0] = new block(this.row, this.col-1, "#006EFF");
            this.blocks[1] = new block(this.row, this.col, "#006EFF");
            this.blocks[2] = new block(this.row, this.col+1, "#006EFF");
            this.blocks[3] = new block(this.row-1, this.col-1, "#006EFF");
        }
    }
    function rotateLeft() {
        if(this.pos == "left" && this.row+1 <= 21 && this.col <= 9 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col-1] === 0 && slots[this.row+1][this.col] === 0) {
            this.pos = "down";
            this.blocks[0] = new block(this.row, this.col, "#006EFF");
            this.blocks[1] = new block(this.row-1, this.col, "#006EFF");
            this.blocks[2] = new block(this.row+1, this.col-1, "#006EFF");
            this.blocks[3] = new block(this.row+1, this.col, "#006EFF");
        } else if(this.pos == "up" && this.col-1 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col-1] === 0) {
            this.pos = "left";
            this.blocks[0] = new block(this.row, this.col-1, "#006EFF");
            this.blocks[1] = new block(this.row, this.col, "#006EFF");
            this.blocks[2] = new block(this.row, this.col+1, "#006EFF");
            this.blocks[3] = new block(this.row-1, this.col-1, "#006EFF");
        } else if(this.pos == "right" && this.row+1 <= 21 && this.col+1 <= 9 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0 && slots[this.row-1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row-1, this.col, "#006EFF");
            this.blocks[1] = new block(this.row, this.col, "#006EFF");
            this.blocks[2] = new block(this.row+1, this.col, "#006EFF");
            this.blocks[3] = new block(this.row-1, this.col+1, "#006EFF");
        } else if(this.pos == "down" && this.row+1 <= 21 && this.col-1 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "right";
            this.blocks[0] = new block(this.row, this.col-1, "#006EFF");
            this.blocks[1] = new block(this.row, this.col+1, "#006EFF");
            this.blocks[2] = new block(this.row, this.col, "#006EFF");
            this.blocks[3] = new block(this.row+1, this.col+1, "#006EFF");
        }
    }
    function moveRight() {
        if((this.col+1 < 9 && this.pos == "left" && slots[this.row][this.col+2] === 0 && slots[this.row-1][this.col] === 0) || 
        	(this.col+1 < 9 && this.pos == "up" && slots[this.row-1][this.col+2] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) || 
        	(this.col < 9 && this.pos == "down" && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) || 
        	(this.col+1 < 9 && this.pos == "right" && slots[this.row][this.col+2] === 0 && slots[this.row+1][this.col+2] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col+1;
            }
            this.col++;
        }
    }
    function moveLeft() {
        if((this.col-1 > 0 && this.pos == "left" && slots[this.row-1][this.col-2] === 0 && slots[this.row][this.col-2] === 0) || 
        	(this.col > 0 && this.pos == "up" && slots[this.row-1][this.col-1] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col-1] === 0) || 
        	(this.col-1 > 0 && this.pos == "down" && slots[this.row-1][this.col-1] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col-2] === 0) || 
        	(this.col-1 > 0 && this.pos == "right" && slots[this.row][this.col-2] === 0 && slots[this.row+1][this.col] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col-1;
            }
            this.col--;
        }
        
    }
    function draw() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
    }
    function tick() {
        var stopped = false;
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].row+1 == 22 || this.row > -1 && slots[this.blocks[i].row+1][this.blocks[i].col] !== 0) {
                stopped = true;
            }
        }
        if (stopped) {
            return;
        }
        for(i = 0; i < this.blocks.length; i++) {
            this.blocks[i].tick();
        }
        this.row++;
    }
}

function lShape(col) {
    this.col = col;
    if(this.col > 8) this.col = 8;
    if(this.col < 1) this.col = 1;
    this.row = -1;
    this.blocks = new Array();
    this.blocks[0] = new block(this.row, this.col-1, "#FF9100");
    this.blocks[1] = new block(this.row, this.col, "#FF9100");
    this.blocks[2] = new block(this.row, this.col+1, "#FF9100");
    this.blocks[3] = new block(this.row-1, this.col+1, "#FF9100");

    this.pos = "left";

    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        if(this.pos == "left" && this.row+1 <= 21 && this.col+1 <= 9 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row-1, this.col, "#FF9100");
            this.blocks[1] = new block(this.row, this.col, "#FF9100");
            this.blocks[2] = new block(this.row+1, this.col, "#FF9100");
            this.blocks[3] = new block(this.row+1, this.col+1, "#FF9100");
        } else if(this.pos == "up" && this.row+1 <= 21 && this.col-1 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col-1] === 0) {
            this.pos = "right";
            this.blocks[0] = new block(this.row, this.col-1, "#FF9100");
            this.blocks[1] = new block(this.row, this.col+1, "#FF9100");
            this.blocks[2] = new block(this.row, this.col, "#FF9100");
            this.blocks[3] = new block(this.row+1, this.col-1, "#FF9100");
        } else if(this.pos == "right" && this.row+1 <= 21 && this.col-1 >= 0 && slots[this.row-1][this.col] === 0 && slots[this.row-1][this.col-1] === 0 && slots[this.row+1][this.col] === 0) {
            this.pos = "down";
            this.blocks[0] = new block(this.row, this.col, "#FF9100");
            this.blocks[1] = new block(this.row-1, this.col, "#FF9100");
            this.blocks[2] = new block(this.row-1, this.col-1, "#FF9100");
            this.blocks[3] = new block(this.row+1, this.col, "#FF9100");
        } else if(this.pos == "down" && this.col-1 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col+1] === 0) {
            this.pos = "left";
            this.blocks[0] = new block(this.row, this.col-1, "#FF9100");
            this.blocks[1] = new block(this.row, this.col, "#FF9100");
            this.blocks[2] = new block(this.row, this.col+1, "#FF9100");
            this.blocks[3] = new block(this.row-1, this.col+1, "#FF9100");
        }
    }
    function rotateLeft() {
        if(this.pos == "left" && this.row+1 <= 21 && this.col-1 >= 0 && slots[this.row-1][this.col] === 0 && slots[this.row-1][this.col-1] === 0 && slots[this.row+1][this.col] === 0) {
            this.pos = "down";
            this.blocks[0] = new block(this.row, this.col, "#FF9100");
            this.blocks[1] = new block(this.row-1, this.col, "#FF9100");
            this.blocks[2] = new block(this.row-1, this.col-1, "#FF9100");
            this.blocks[3] = new block(this.row+1, this.col, "#FF9100");
        } else if(this.pos == "up" && this.col-1 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row-1][this.col+1] === 0) {
            this.pos = "left";
            this.blocks[0] = new block(this.row, this.col-1, "#FF9100");
            this.blocks[1] = new block(this.row, this.col, "#FF9100");
            this.blocks[2] = new block(this.row, this.col+1, "#FF9100");
            this.blocks[3] = new block(this.row-1, this.col+1, "#FF9100");
        } else if(this.pos == "right" && this.row+1 <= 21 && this.col+1 <= 9 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0 && slots[this.row+1][this.col+1] === 0) {
            this.pos = "up";
            this.blocks[0] = new block(this.row-1, this.col, "#FF9100");
            this.blocks[1] = new block(this.row, this.col, "#FF9100");
            this.blocks[2] = new block(this.row+1, this.col, "#FF9100");
            this.blocks[3] = new block(this.row+1, this.col+1, "#FF9100");
        } else if(this.pos == "down" && this.row+1 <= 21 && this.col-1 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col-1] === 0) {
            this.pos = "right";
            this.blocks[0] = new block(this.row, this.col-1, "#FF9100");
            this.blocks[1] = new block(this.row, this.col+1, "#FF9100");
            this.blocks[2] = new block(this.row, this.col, "#FF9100");
            this.blocks[3] = new block(this.row+1, this.col-1, "#FF9100");
        }
    }
    function moveRight() {
        if((this.col+1 < 9 && this.pos == "left" && slots[this.row][this.col+2] === 0 && slots[this.row-1][this.col+2] === 0) || 
        	(this.col+1 < 9 && this.pos == "up" && slots[this.row-1][this.col+1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+2] === 0) || 
        	(this.col < 9 && this.pos == "down" && slots[this.row-1][this.col+1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) || 
        	(this.col+1 < 9 && this.pos == "right" && slots[this.row][this.col+2] === 0 && slots[this.row+1][this.col] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col+1;
            }
            this.col++;
        }
    }
    function moveLeft() {
        if((this.col-1 > 0 && this.pos == "left" && slots[this.row][this.col-2] === 0 && slots[this.row-1][this.col] === 0) || 
        	(this.col > 0 && this.pos == "up" && slots[this.row-1][this.col-1] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col-1] === 0) || 
        	(this.col-1 > 0 && this.pos == "down" && slots[this.row-1][this.col-2] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col-1] === 0) || 
        	(this.col-1 > 0 && this.pos == "right" && slots[this.row][this.col-2] === 0 && slots[this.row+1][this.col-2] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col-1;
            }
            this.col--;
        }
        
    }
    function draw() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
    }
    function tick() {
        var stopped = false;
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].row+1 == 22 || this.row > -1 && slots[this.blocks[i].row+1][this.blocks[i].col] !== 0) {
                stopped = true;
            }
        }
        if (stopped) {
            return;
        }
        for(i = 0; i < this.blocks.length; i++) {
            this.blocks[i].tick();
        }
        this.row++;
    }
}

function iShape(col) {
    this.col = col;
    if(this.col > 7) this.col = 7;
    if(this.col < 2) this.col = 2;
    this.row = -1;
    this.blocks = new Array();
    this.blocks[0] = new block(this.row, this.col-2, "#9AF0FD");
    this.blocks[1] = new block(this.row, this.col-1, "#9AF0FD");
    this.blocks[2] = new block(this.row, this.col, "#9AF0FD");
    this.blocks[3] = new block(this.row, this.col+1, "#9AF0FD");

    this.pos = "leftLong";

    this.rotateRight = rotateRight;
    this.rotateLeft = rotateLeft;
    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.draw = draw;
    this.tick = tick;

    function rotateRight() {
        if(this.pos == "leftLong" && this.row+1 <= 21 && slots[this.row-2][this.col] === 0 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0) {
            this.pos = "topLong";
            this.blocks[0] = new block(this.row-2, this.col, "#9AF0FD");
            this.blocks[1] = new block(this.row-1, this.col, "#9AF0FD");
            this.blocks[2] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row+1, this.col, "#9AF0FD");
        } else if(this.pos == "topLong" && this.col-1 >= 0 && this.col+2 <= 9 && slots[this.row][this.col+2] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row][this.col-1] === 0) {
            this.pos = "rightLong";
            this.blocks[0] = new block(this.row, this.col+2, "#9AF0FD");
            this.blocks[1] = new block(this.row, this.col+1, "#9AF0FD");
            this.blocks[2] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row, this.col-1, "#9AF0FD");
        } else if(this.pos == "rightLong" && this.row+2 <= 21 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0 && slots[this.row+2][this.col] === 0) {
            this.pos = "bottomLong";
            this.blocks[0] = new block(this.row-1, this.col, "#9AF0FD");
            this.blocks[1] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[2] = new block(this.row+1, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row+2, this.col, "#9AF0FD");
        } else if(this.pos == "bottomLong" && this.col-2 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-2] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0) {
            this.pos = "leftLong";
            this.blocks[0] = new block(this.row, this.col-2, "#9AF0FD");
            this.blocks[1] = new block(this.row, this.col-1, "#9AF0FD");
            this.blocks[2] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row, this.col+1, "#9AF0FD");
        }
    }
    function rotateLeft() {
        if(this.pos == "leftLong" && this.row+2 <= 21 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0 && slots[this.row+2][this.col] === 0) {
            this.pos = "bottomLong";
            this.blocks[0] = new block(this.row-1, this.col, "#9AF0FD");
            this.blocks[1] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[2] = new block(this.row+1, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row+2, this.col, "#9AF0FD");
        } else if(this.pos == "topLong" && this.col-2 >= 0 && this.col+1 <= 9 && slots[this.row][this.col-2] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row][this.col+1] === 0) {
            this.pos = "leftLong";
            this.blocks[0] = new block(this.row, this.col-2, "#9AF0FD");
            this.blocks[1] = new block(this.row, this.col-1, "#9AF0FD");
            this.blocks[2] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row, this.col+1, "#9AF0FD");
        } else if(this.pos == "rightLong" && this.row+1 < 21 && slots[this.row-2][this.col] === 0 && slots[this.row-1][this.col] === 0 && slots[this.row+1][this.col] === 0) {
            this.pos = "topLong";
            this.blocks[0] = new block(this.row-2, this.col, "#9AF0FD");
            this.blocks[1] = new block(this.row-1, this.col, "#9AF0FD");
            this.blocks[2] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row+1, this.col, "#9AF0FD");            
        } else if(this.pos == "bottomLong" && this.col-1 >= 0 && this.col+2 <= 9 && slots[this.row][this.col+2] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row][this.col-1] === 0) {
            this.pos = "rightLong";
            this.blocks[0] = new block(this.row, this.col+2, "#9AF0FD");
            this.blocks[1] = new block(this.row, this.col+1, "#9AF0FD");
            this.blocks[2] = new block(this.row, this.col, "#9AF0FD");
            this.blocks[3] = new block(this.row, this.col-1, "#9AF0FD");
        }
    }
    function moveRight() {
        if((this.col+1 < 9 && this.pos == "leftLong" && slots[this.row][this.col+2] === 0) || 
        	(this.col < 9 && this.pos == "topLong" && slots[this.row-2][this.col+1] === 0 && slots[this.row-1][this.col+1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0) || 
        	(this.col < 9 && this.pos == "bottomLong" && slots[this.row-1][this.col+1] === 0 && slots[this.row][this.col+1] === 0 && slots[this.row+1][this.col+1] === 0 && slots[this.row+2][this.col+1] === 0) || 
        	(this.col+2 < 9 && this.pos == "rightLong" && slots[this.row][this.col+3] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col+1;
            }
            this.col++;
        }
    }
    function moveLeft() {
        if((this.col-2 > 0 && this.pos == "leftLong" && slots[this.row][this.col-3] === 0) ||
        	(this.col > 0 && this.pos == "topLong" && slots[this.row-2][this.col-1] === 0 && slots[this.row-1][this.col-1] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col-1] === 0) ||
          	(this.col > 0 && this.pos == "bottomLong" && slots[this.row-1][this.col-1] === 0 && slots[this.row][this.col-1] === 0 && slots[this.row+1][this.col-1] === 0 && slots[this.row+2][this.col-1] === 0) ||
           	(this.col-1 > 0 && this.pos == "rightLong" && slots[this.row][this.col-2] === 0)) {
            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].col = this.blocks[i].col-1;
            }
            this.col--;
        }
        
    }
    function draw() {
        for(var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
    }
    function tick() {
        var stopped = false;
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].row+1 == 22 || this.row > -1 && slots[this.blocks[i].row+1][this.blocks[i].col] !== 0) {
                stopped = true;
            }
        }
        if (stopped) {
            return;
        }
        for(i = 0; i < this.blocks.length; i++) {
            this.blocks[i].tick();
        }
        this.row++;
    }
}