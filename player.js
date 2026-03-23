export default class Player{
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    kuraRunImages = [];

    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.2;
    GRAVITY = 0.1;


    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio){
        this.ctx= ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio= scaleRatio;
        

        this.x = 10 * this.scaleRatio;
        this.y = this.canvas.height - this.height - 1.5 * this.scaleRatio;
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "images/kura.png";
        this.image = this.standingStillImage;
        

        const kuraRunImage1= new Image();
        kuraRunImage1.src = "images/runningkura1.png";

        const kuraRunImage2= new Image();
        kuraRunImage2.src = "images/runningkura2.png";

        this.kuraRunImages.push (kuraRunImage1);
        this.kuraRunImages.push (kuraRunImage2);

        //keyboard
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        //touchscreen
        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);

        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
        
    }

    //keyboard
    keydown = (event)=>{
        if (event.code === "Space"){
            this.jumpPressed = true;
        }
    }

    keyup = (event)=>{
        if (event.code === "Space"){
            this.jumpPressed = false;
        }
    }

    //touchscreen
    touchstart = ()=>{
            this.jumpPressed = true;
    }

    touchend = ()=>{
            this.jumpPressed = false;
    }



    update(gameSpeed, frameTimeDelta){
        this.run(gameSpeed, frameTimeDelta);
        this.jump(frameTimeDelta);
    }

    jump(frameTimeDelta){
        if (this.jumpPressed){
            this.jumpInProgress = true;
        }
        if (this.jumpInProgress && !this.falling){
            if (this.y > this.canvas.height - this.minJumpHeight ||
            (this.y >this.canvas.height - this.maxJumpHeight && this.jumpPressed)) {
                this.y -=this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            }
            else{
                this.falling = true;
            }
        }
        else {
            if (this.y < this.yStandingPosition){
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height >this.canvas.height){
                    this.y = this.yStandingPosition;
                }
            } else{
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }    

    run(gameSpeed, frameTimeDelta){
        if (this.walkAnimationTimer <= 0){
            if (this.image === this.kuraRunImages[0]){
                this.image = this.kuraRunImages[1];
            }
            else{
                this.image = this.kuraRunImages[0];
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }

    draw(){
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
