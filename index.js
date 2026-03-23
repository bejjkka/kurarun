import Player from './player.js';
import Ground from './ground.js';
import ObstacleController from './obstaclesController.js';

// game state
let isGameStarted = false;
let gameLoopId = null;

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1.125;
const GAME_SPEED_INCREMENT = 0.00004;

const GAME_WIDTH = 1100 ;
const GAME_HEIGHT = 435;
const PLAYER_WIDTH = 768/4; //192S
const PLAYER_HEIGHT = 768/4
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 380;
const GROUND_WIDTH = 1100;
const GROUND_HEIGHT = 100;
const GROUND_AND_OBSTACLE_SPEED = 0.25;


const OBSTACLES_CONFIG = [
    {width: 200/3, height:250/3, image:"images/tara.png"},
    {width: 512/5, height:512/6, image:"images/drevo.png"},
    {width: 512/5, height:512/6, image:"images/drevo2.png"},
    {width: 512/5, height:512/5, image:"images/kacka.png"},
    {width: 512/5, height:512/5, image:"images/kacka2.png"},
    {width: 512/5, height:512/5, image:"images/kacka3.png"},
    //{width: 512/4.2, height:512/4, image:"images/maringotka2.png"},
    //{width: 512/4, height:512/4, image:"images/tekvica.png"},
    //{width:512/3.87, height:512/3, image:"images/strom.png"},
    {width: 512/5, height:512/5, image:"images/kosticka (2).png"},
];



//game object
let player = null;
let ground = null;
let obstaclesController = null;


let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart  = false;

function createSprites(){
    const playerWidthInGame =  PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;




    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player (ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);

    ground = new Ground (ctx, groundWidthInGame, groundHeightInGame,GROUND_AND_OBSTACLE_SPEED, scaleRatio);

    const obstaclesImages = OBSTACLES_CONFIG.map(obstacle=>{
        const image = new Image();
        image.src = obstacle.image;
        return{
            image:image,
            width: obstacle.width* scaleRatio,
            height: obstacle.height * scaleRatio,

        };
    });
    obstaclesController = new ObstacleController(ctx, obstaclesImages, scaleRatio, GROUND_AND_OBSTACLE_SPEED);
}

function setScreen(){
    scaleRatio=getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();

}

setScreen();

window.addEventListener("resize", () => setTimeout (setScreen, 500));

if (screen.orientation){
    screen.orientation.addEventListener('change', setScreen);
}



function getScaleRatio(){
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);

    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    
    if (screenWidth/screenHeight < GAME_WIDTH/GAME_HEIGHT){
        return screenWidth/GAME_WIDTH;
    }
    else{
        return screenHeight/GAME_HEIGHT;
    }
}

export function getGroundYAtX(x, baseLine, maxCurveDepth, gameWidth, xOffset){
    const curveWidth = gameWidth;
    const adjustedX = (x + xOffset * 2) % curveWidth;
    const normalizedX = (adjustedX / curveWidth) * 2-1;
    const curvatureFactor = Math.pow(normalizedX, 2);
    return baseLine - (maxCurveDepth * curvatureFactor);

}

function showGameOver(){
    const fontSize = 40* scaleRatio;
    ctx.font= `${fontSize}px 'Press Start 2P'`;
    ctx.fillStyle = "red";
    const x = canvas.width/2;
    const y = canvas.height/ 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", x,y);
    }

function setupReset(){
    if (!hasAddedEventListenersForRestart){
        hasAddedEventListenersForRestart = true;
        
        setTimeout(()=> {
            window.addEventListener("keyup", reset,{once:true});
            window.addEventListener("touchstart", reset,{once:true}); 
            }, 1000);
        //window.addEventListener("keyup", reset,{once:true})
        //window.addEventListener("touchstart", reset,{once:true})    
    }
}

function reset(){
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    ground.reset();
    obstaclesController.reset();
    gameSpeed = GAME_SPEED_START;

    
    previousTime = null;
    requestAnimationFrame(gameLoop);
}

function clearScreen(){
    ctx.fillStyle ="#E7A1B0";
    ctx.fillRect(0,0,canvas.width, canvas.height);
}

function startGame() {
    if (isGameStarted && !gameOver) return;

    previousTime = null;
    isGameStarted = true;
    gameOver = false;
    gameSpeed = GAME_SPEED_START;

    setScreen();
    
    startScreen.style.display = 'none';
    
    
    // Start the main loop
    gameLoopId = requestAnimationFrame(gameLoop);
}
startButton.addEventListener('click', startGame);


        

function gameLoop(currentTime){
    if (!isGameStarted) return;

    if (previousTime === null){
        previousTime = currentTime;
        gameLoopId = requestAnimationFrame(gameLoop);
        return;
    }

    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;
    clearScreen();

    if (!gameOver){
        //update game objects
    ground.update(gameSpeed, frameTimeDelta);
    obstaclesController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
        
        if (!gameOver && obstaclesController.collideWith(player)){
            gameOver = true;
            setupReset();
        }
    }            

        //draw game objects
    ground.draw();
    obstaclesController.draw();
    player.draw();

    if (gameOver) {
        showGameOver();
        return;
     }

    requestAnimationFrame(gameLoop);
    //if (isGameStarted && !gameOver) {
    //gameLoopId = requestAnimationFrame(gameLoop);
    
}    
    //requestAnimationFrame(gameLoop);

//requestAnimationFrame(gameLoop);
