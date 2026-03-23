export default class Score{

  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  
  constructor(ctx, scaleRatio){
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update (frameTimeDelta){
    this.score += frameTimeDelta * 0.01;
  }

  reset(){
    this.score = 0;
  }

  setHighScore(){
  const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
  if(this.score > highScore{
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  draw(){
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 10 * this.scaleRatio;
    this.ctx.font = 
  }
}
