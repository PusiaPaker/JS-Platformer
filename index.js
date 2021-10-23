var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

const SCREEN_HEIGHT = 600;
const SCREEN_WIDTH = 600;

var resize = function(){
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
}

resize();
 
var inverse = false;
var keyPressed;
var keyUp;
var keyDown;
var keyLeft;
var keyRight;
var keySpace;
var keyW;
var keyA;
var keyD;

var progress;
var JumpI;
var FallI = 0;
var JumpBool = false;

var TitleText = 0;
var TitleGo = true;
var TempText = 0;


setInterval(function() {
    TitleText += 0.01
    TitleText = Math.round(TitleText*100)/100
}, 10);

var GroundY;
var CeilingY;
var LeftX;
var RightX;

document.addEventListener('keydown', (e) => {
    if(e.code == 'Space') keySpace = e.code;
    if(e.code == 'ArrowUp') keyUp = e.code;
    if(e.code == 'KeyW') keyW = e.code;
});

document.addEventListener('keydown', (e) => {
    if(e.code == 'ArrowLeft') keyLeft = e.code;
    if(e.code == 'KeyA') keyA = e.code;
});
document.addEventListener('keydown', (e) => {
    if(e.code == 'ArrowRight') keyRight = e.code;
    if(e.code == 'KeyD') keyD = e.code;
  
});
document.addEventListener('keyup', (e) => {
    if(e.code == 'ArrowLeft') keyLeft = '';
    if(e.code == 'KeyD') keyD = '';
    
});
document.addEventListener('keyup', (e) => {
    if(e.code == 'ArrowRight') keyRight = '';
    if(e.code == 'KeyA') keyA = '';
    
});
document.addEventListener('keyup', (e) => {
    if(e.code == 'Space') keySpace = '';
    if(e.code == 'ArrowUp') keyUp = '';
    if(e.code == 'KeyW') keyW = '';
    
});

class Player{
    constructor(xPos,yPos, color){
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.playerSize = 10;
        this.playerSpeed = 0.4;
        this.gravity = 0.8;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos-(this.playerSize), this.yPos-(this.playerSize), this.playerSize*2, this.playerSize*2);
    
        //ctx.beginPath();
        //ctx.ellipse(this.xPos, this.yPos, this.playerSize, this.playerSize, Math.PI / 4, 0, 2 * Math.PI);
        //ctx.fill();
    }


    onGround(){
        if(this.yPos >= GroundY) return true
        else return false
    }

    jump(run){
        if(run){
            JumpI -= 0.125;
            if(JumpI > 0){
                this.yPos = this.yPos + ((-1*Math.pow(JumpI, 2))*progress*(1/3));
            } else {
                JumpI = 2;
                JumpBool = false;
            }
            
        }
    }

    fall(run){
        if(run){
            FallI -= 0.125;
            if(FallI > -2){
                this.yPos = this.yPos - ((-1*Math.pow(FallI, 2))*progress*(1/3));
            } else {
                this.yPos = this.yPos - ((-1*Math.pow(-2.175, 2))*progress*(1/3));
            }
        }
    }

    update(progress){
        if(keyLeft == "ArrowLeft" || keyA == "KeyA") this.xPos =  this.xPos - (this.playerSpeed*progress);
        if(keyRight == "ArrowRight" || keyD == "KeyD") this.xPos = this.xPos + (this.playerSpeed*progress);
        
        //GroundY = SCREEN_HEIGHT - 10;
        
        if(this.yPos == GroundY) if(keySpace == "Space" || keyUp == "ArrowUp" || keyW == "KeyW") JumpBool = true;
        this.jump(JumpBool);
        
        //this.yPos = this.yPos + (this.gravity*progress);
    

        if(!this.onGround() && !JumpBool) this.fall(true);
        if(this.onGround()) FallI = 0;

        // BOUNDS
        if(this.xPos > RightX) this.xPos = RightX
        if(this.xPos < LeftX) this.xPos = LeftX
        if(this.yPos > GroundY) this.yPos = GroundY;
        if(this.yPos < CeilingY){
            this.yPos = CeilingY;
            JumpBool = false;
            JumpI = 2;
        }
    }
}

class Box{
    constructor(xPos, yPos, sizeX, sizeY, Color){
        this.xPos = xPos;
        this.yPos = yPos;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.Color = Color;
    }

    draw(){
        ctx.fillStyle = this.Color;
        ctx.fillRect(this.xPos, this.yPos, this.sizeX, this.sizeY)
    }
}

var BoxWin = new Box(470, 520, 80, 80, 'rgb(255, 0, 255)')
var BoxPlatform12 = new Box(400, 100, 50 , 20, 'rgb(255, 255, 255)')
var BoxPlatform11 = new Box(300, 80, 50, 20, 'rgb(255, 255, 255)')
var BoxPlatform10 = new Box(200, 80, 50, 20, 'rgb(255, 255, 255)')
var BoxPlatform9 = new Box(50, 150, 100, 20, 'rgb(255, 255, 255)')
var BoxPlatform8 = new Box(300, 230, 150, 20, 'rgb(255, 255, 255)')
var BoxPlatform7 = new Box(450, 500, 120, 20, 'rgb(255, 255, 255)')
var BoxPlatform6 = new Box(550, 100, 20, 400, 'rgb(255, 255, 255)'); 
var BoxPlatform5 = new Box(100, 300, 100, 20, 'rgb(255, 255, 255)');
var BoxPlatform4 = new Box(275, 350, 50, 70, 'rgb(255, 255, 255)');
var BoxPlatform3 = new Box(250, 450, 100, 20, 'rgb(255,255,255)');
var BoxPlatform2 = new Box(200, 550, 100, 20, 'rgb(255, 255, 255)');
var BoxPlatform = new Box(450, 500, 20, 200, 'rgb(255, 255, 255)');
var PlayerObject = new Player(0, 500, 'rgb(235, 64, 52)');

function CollisionDetection(ObjectOne, ObjectTwo){
    //Detect Collision and dont let them interact;
    ObjectTwo.Color = ('rgb(0,255,0)');
    if(ObjectOne.xPos+(ObjectOne.playerSize) > ObjectTwo.xPos && ObjectOne.xPos-ObjectOne.playerSize < ObjectTwo.xPos + ObjectTwo.sizeX){
        ObjectTwo.Color = 'rgb(0,255,0)';
        if(ObjectOne.yPos - ObjectOne.playerSize < ObjectTwo.yPos + ObjectTwo.sizeY && ObjectOne.yPos + ObjectOne.playerSize > ObjectTwo.yPos){
            ObjectTwo.Color = 'rgb(0,0,255)';
            TitleGo = false;
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        }   
    }
}

function CheckBelow(ObjectPlayer, ObjectBox){
    if(GroundY == SCREEN_HEIGHT - PlayerObject.playerSize){
        if(ObjectPlayer.xPos+(ObjectPlayer.playerSize) > ObjectBox.xPos && ObjectPlayer.xPos-ObjectPlayer.playerSize < ObjectBox.xPos + ObjectBox.sizeX){
            if(ObjectPlayer.yPos + ObjectPlayer.playerSize <= ObjectBox.yPos && ObjectPlayer.yPos + ObjectPlayer.playerSize >= ObjectBox.yPos - 50){            
                GroundY = ObjectBox.yPos - PlayerObject.playerSize;
            }
        }
    }   
}

function CheckAbove(ObjectPlayer, ObjectBox){
    if(CeilingY == PlayerObject.playerSize){
        if(ObjectPlayer.xPos+(ObjectPlayer.playerSize) > ObjectBox.xPos && ObjectPlayer.xPos-ObjectPlayer.playerSize < ObjectBox.xPos + ObjectBox.sizeX){
            if(ObjectPlayer.yPos - ObjectPlayer.playerSize >= ObjectBox.yPos + ObjectBox.sizeY && ObjectPlayer.yPos - ObjectPlayer.playerSize <= ObjectBox.yPos + ObjectBox.sizeY + 50){            
                CeilingY = ObjectBox.yPos + ObjectBox.sizeY + PlayerObject.playerSize;
            }
        }
    }
}

function CheckRight(ObjectPlayer, ObjectBox){
    if(RightX == SCREEN_WIDTH - PlayerObject.playerSize){
        if(ObjectPlayer.yPos - ObjectPlayer.playerSize < ObjectBox.yPos + ObjectBox.sizeY && ObjectPlayer.yPos + ObjectPlayer.playerSize > ObjectBox.yPos){
            if(ObjectPlayer.xPos + ObjectPlayer.playerSize <= ObjectBox.xPos+20 && ObjectPlayer.xPos + ObjectPlayer.playerSize >= ObjectBox.xPos - 50){
                RightX = ObjectBox.xPos - PlayerObject.playerSize;
            }
        }
    }
}

function CheckLeft(ObjectPlayer, ObjectBox){
    if(LeftX == PlayerObject.playerSize){
        if(ObjectPlayer.yPos - ObjectPlayer.playerSize < ObjectBox.yPos + ObjectBox.sizeY && ObjectPlayer.yPos + ObjectPlayer.playerSize > ObjectBox.yPos){
            if(ObjectPlayer.xPos - ObjectPlayer.playerSize >= ObjectBox.xPos + ObjectBox.sizeX-20 && ObjectPlayer.xPos - ObjectPlayer.playerSize <= ObjectBox.xPos + ObjectBox.sizeX + 50){
                LeftX = ObjectBox.xPos + ObjectBox.sizeX + ObjectPlayer.playerSize;
            }
        }
    }
}

function runObjectUpdate(ObjectPlayer, ObjectBox){
    CheckBelow(ObjectPlayer, ObjectBox);
    CheckAbove(ObjectPlayer, ObjectBox);
    CheckRight(ObjectPlayer, ObjectBox);
    CheckLeft(ObjectPlayer, ObjectBox);
}



function update(progress){
    CeilingY = PlayerObject.playerSize;
    GroundY = SCREEN_HEIGHT - PlayerObject.playerSize;
    RightX = SCREEN_WIDTH - PlayerObject.playerSize;
    LeftX = PlayerObject.playerSize;



    runObjectUpdate(PlayerObject, BoxPlatform);
    runObjectUpdate(PlayerObject, BoxPlatform2);
    runObjectUpdate(PlayerObject, BoxPlatform3);
    runObjectUpdate(PlayerObject, BoxPlatform4);
    runObjectUpdate(PlayerObject, BoxPlatform5);
    runObjectUpdate(PlayerObject, BoxPlatform6);
    runObjectUpdate(PlayerObject, BoxPlatform7);
    runObjectUpdate(PlayerObject, BoxPlatform8);
    runObjectUpdate(PlayerObject, BoxPlatform9);
    runObjectUpdate(PlayerObject, BoxPlatform10);
    runObjectUpdate(PlayerObject, BoxPlatform11);
    
    runObjectUpdate(PlayerObject, BoxPlatform12);

    PlayerObject.update(progress);
    //CollisionDetection(PlayerObject, BoxPlatform);
    //CollisionDetection(PlayerObject, BoxPlatform2);
    CollisionDetection(PlayerObject, BoxWin);
    
}

function draw(){
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    //  Background
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);


    if(TitleGo){
        TempText = TitleText;
    }
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.font = "30px Arial";
    ctx.fillText(TempText, 10, 50);


    
    BoxPlatform12.draw();
    BoxPlatform11.draw();
    BoxPlatform10.draw();
    BoxPlatform9.draw();
    BoxPlatform8.draw();
    BoxPlatform7.draw();
    BoxPlatform6.draw();
    BoxPlatform5.draw();
    BoxPlatform4.draw();
    BoxPlatform3.draw();    
    BoxPlatform2.draw();
    BoxPlatform.draw();
    PlayerObject.draw();
    BoxWin.draw();
}

function gameLoop(timeStamp){
    progress = (timeStamp - lastRender);

    update(progress)
    draw()

    lastRender = timeStamp;
    window.requestAnimationFrame(gameLoop);
}

var lastRender = 0;
window.requestAnimationFrame(gameLoop)