import {getGroundYAtX} from './index.js';

export default class Ground{
    constructor(ctx, width, height, speed, scaleRatio){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        
    
        this.x = 0;
        this.y = this.canvas.height - this.height;
        //this.xOffset = 0;

        this.groundImage = new Image();
        this.groundImage.src = "images/New Piskel(2).png";


    }

    update(gameSpeed, frameTimeDelta){
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
        //this.xOffset += gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
        this.xOffset = this.xOffset % this.groundWidth;
    }

    draw(){
        this.ctx.drawImage (this.groundImage, this.x, this.y, this.width, this.height);
    
        this.ctx.drawImage (this.groundImage, this.x + this.width, this.y, this.width, this.height);

        if (this.x < -this.width){
            this.x = 0;
        }

        //if (!this.pattern){
          //  this.ctx.fillStyle = "darkgrey";
        //} else {
        //  this.ctx.fillStyle = this.pattern;
        //this.ctx.save();
        //    this.ctx.translate(-this.xOffset % this.groundImage.width, 0);
        //}

        //this.ctx.beginPath();
        //const baseLine = this.canvas.height -1.5 * this.scaleRatio;
    } 

    reset(){
        this.x = 0;
    }
}
