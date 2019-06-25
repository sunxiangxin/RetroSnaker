class Display{
    constructor(id,xCount=30,yCount=xCount,rectWidth=10,rectHeight=rectWidth){
        this.xCount = xCount;
        this.yCount =yCount;
        this.id = id;
        this.rectWidth = rectWidth;
        this.rectHeight = rectHeight;
        this.ctx = null;
        this.canvas = null;
        this._init();
    }
    _init(){
        this.canvas = document.getElementById(this.id);
        this.canvas.width = this.xCount*this.rectWidth;
        this.canvas.height = this.yCount*this.rectHeight;
        this.canvas.style.background = "gray";
        this.ctx = canvas.getContext("2d");
    }
    draw(arr=[]){
        this._clear();
        arr[arr.length - 1].color = 'yellow'
        arr[arr.length - 2].color = 'orange'
        arr.forEach(ele => {
            this._drawRect(ele);
        });
    }
    _clear(){
        this.canvas.height = this.canvas.height;
    }
    _drawRect(point){
        let {x,y} = point;
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        if(point.color){
            this.ctx.fillStyle = point.color;
        }
        this.ctx.moveTo(x*this.rectWidth,y*this.rectHeight);
        this.ctx.lineTo((x+1)*this.rectWidth,y*this.rectHeight);
        this.ctx.lineTo((x+1)*this.rectWidth,(y+1)*this.rectHeight);
        this.ctx.lineTo(x*this.rectWidth,(y+1)*this.rectHeight);
        this.ctx.closePath();
        this.ctx.fill();
    }
}
 
class Util{
    static includes(arr,point){
        for(let ele of arr){
            if(Point.prototype.equarls.call(ele,point)) return true;
        }
        return false;
    }
    static copy(obj){
        return JSON.parse(JSON.stringify(obj));
    }
}
class Point{
    equarls(other){
       return this.x===other.x && this.y === other.y;
    }
}

class Snake{
    constructor(points,xCount=30,yCount=xCount){
        this.points = points;
        this.way = 'right';
        this.xCount = xCount;
        this.yCount = yCount;
    }
    //arr尾部 对应 蛇头
    get snakeHead(){
        return Util.copy(this.points).pop();
    }

    get snakeBody(){
        let copySnake = Util.copy(this.points);
        copySnake.pop();
        return copySnake;
    }

    setFood(food){
        this.food = food;
    }

    eat(){
       return Point.prototype.equarls.call(this.snakeHead,this.food.food);
    }
    move(){ 
        let temp = this.snakeHead
        switch(this.way){
            case 'left':
                    temp.x -= 1;
                break;
            case 'right':
                    temp.x += 1;
                break;
            case 'top':
                    temp.y -= 1;
                break;
            case 'bottom':
                    temp.y += 1;
                break;
        }   

        temp.x = (temp.x + this.xCount) % this.xCount
        temp.y = (temp.y + this.yCount) % this.yCount;
        this.points.push(temp);
        if(!this.eat()){
            this.points.shift();
        }else{
            this.food.createFood();
        }

        if(this.dead()){
            alert("game over!");
            location.reload();
        }
    }
    dead(){
        return Util.includes(this.snakeBody,this.snakeHead);
    }
}

class Food{
    constructor(snake){
        this.food = {};
        this.snake = snake;
    }
    createFood(){
        let {points,xCount,yCount} = this.snake;
        this.food.x = Math.floor(Math.random()*(xCount-1));
        this.food.y = Math.floor(Math.random()*(yCount-1));
        if(Util.includes(points,this.food)){
            this.createFood();
        }
    }
}

class Main{
    constructor(snake,food,display){
        this.snake = snake;
        this.food = food;
        this.display = display;    
        this.timer = null;
        this.isStop = false;
        document.addEventListener("keydown",(e)=>{
            this.keyControler(e.keyCode);
        });
        this.food.createFood();
    }
    get way(){
        return this.snake.way;
    }
    set way(val){
        this.snake.way = val;
    }
    init(){
        this.timer = setInterval(()=>{
            this.snake.move();
            this.drawAll();
        },500)
    }
    drawAll(){
        let copySnakePoints = Util.copy(this.snake.points);
        let arr = copySnakePoints.concat(this.food.food);
        this.display.draw(arr);
    }
    keyControler(code){
        if(this.isStop){
            return;
        }
  
        switch(code+''){
            case '37':
                if(this.way !== 'right'){
                    this.way = 'left';
                    this.snake.move();
                }
                break;
            case '38':
                if(this.way !== 'bottom'){
                    this.way = 'top';
                    this.snake.move();
                }
                break; 
            case '39':
                if(this.way !== 'left'){
                    this.way = 'right';
                    this.snake.move();
                }
                break; 
            case '40':
                if(this.way !== 'top'){
                    this.way = 'bottom';
                    this.snake.move();
                }
                break;
        }
        this.drawAll();
    }
    gameStart(){
        this.init();
    }
    gameStop(){
        this.isStop = true;
        clearInterval(this.timer);
    }
    gameContinue(){
        this.isStop = false;
        this.init();
    }

}