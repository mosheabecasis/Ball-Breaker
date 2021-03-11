const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const $score = document.getElementById('score');
const $timer = document.getElementById('timer');

const ballRadius = 10;
const boardHeight = 15;
const boardWidth = 90;
const brickRow = 4;
const brickColumn = 5;
const brickHeight = 20;
const brickWidth = 100;
const brickPdding = 10;
const brickMarginTop = 20;
const brickMarginleft = 20;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let boardX = (canvas.width-boardWidth)/2;
let rightPressed = false;
let leftPressed = false;
let points = 0;
let timer = 120;

 

let bricks =[];
for(let i=0; i < brickColumn; i++){
    bricks[i] = [];
    for(let k =0; k < brickRow; k++){
        bricks[i][k] = {x:0, y:0 ,status:1};
    }
}

const down = ($event)=>{
   if($event.key == 'Right' || $event.key == 'ArrowRight'){
       rightPressed = true;
   }
   else if($event.key == 'Left' || $event.key == 'ArrowLeft'){
       leftPressed = true;
   }
}
const up = ($event) => {
    if ($event.key == 'Right' || $event.key == 'ArrowRight') {
        rightPressed = false;
    }
    else if ($event.key == 'Left' || $event.key == 'ArrowLeft') {
        leftPressed = false;
    }
}
const mouseMove = ($event)=> {
    let relativeX = $event.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        boardX = relativeX - boardWidth/2;
    }
}

const impact = ()=>{
    for(let i = 0; i < brickColumn; i++){
        for (let k=0; k < brickRow; k++){
            let b = bricks[i][k];
            if(b.status == 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                    points++;
                    $score.innerHTML = points;
                    if(points == brickRow * brickColumn){
                        clearInterval(gameInterval);
                        clearInterval(timerInterval);
                        Swal.fire({
                            title: 'You Win!',
                            icon: "success",
                            showConfirmButton: true,
                            confirmButtonText: 'Play Again'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                document.location.reload();
                               
                            }
                        })
                    }
                }
            }
        }
    }
}

const drawBall = ()=>{
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = "#0466c8";
    ctx.fill();
    ctx.closePath();
}

const drawBoard = () => {
    ctx.beginPath();
    ctx.rect(boardX, canvas.height-boardHeight, boardWidth, boardHeight);
    ctx.fillStyle = "#495057";
    ctx.fill();
    ctx.closePath();
}

const drawBricks = () => {
    for (let i = 0; i < brickColumn; i++){
        for (let k = 0; k < brickRow; k++){
            if(bricks[i][k].status == 1){
                let brickX = (i * (brickWidth + brickPdding)) + brickMarginleft;
                let brickY = (k * (brickHeight + brickPdding)) + brickMarginTop;
                bricks[i][k].x = brickX;
                bricks[i][k].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // ctx.shadowColor = 'rgba(100, 100, 255, 1)';
                ctx.fillStyle = "#fb8500";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

const draw = ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     drawBricks();
    drawBall();
    drawBoard();
    impact();
  
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
        dx = -dx;
    }
    if (y + dy < ballRadius){
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius){
        if(x > boardX && x < boardX + boardWidth){
            if(y = y - boardHeight){
                dy = -dy;
            }  
        }
        else {
            // alert('game over');
            clearInterval(gameInterval);
            clearInterval(timerInterval);
           
            Swal.fire({
                title: 'Game Over',
                icon: 'Alert',
                showConfirmButton: true,
                confirmButtonText: 'Play Again'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.location.reload(); 
                }
               
            })
        }
    }
    if(rightPressed && boardX < canvas.width - boardWidth){
        boardX += 7;
        // if(boardX + boardWidth > canvas.width){
        //     boardX = canvas.width - boardWidth;
        // }
    }
    else if(leftPressed && boardX > 0){
        boardX -= 7;
        // if(boardX < 0){
        //     boardX = 0;
        // }
    }
    x += dx;
    y += dy;
}

const countTime = () => {
    timerInterval = setInterval(() => {
        --timer;
        $timer.innerText = timer;

        if (timer === 0  ) {
            clearInterval(timerInterval);
            clearInterval(gameInterval);
            Swal.fire({
                title: 'End Of Time',
                icon: 'Alert',
                showConfirmButton: true,
                confirmButtonText: 'Play Again'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.location.reload();

                }
            })
        }
    }, 1000);
}

const gameInterval = setInterval(draw,10);
countTime();
document.addEventListener('keydown', down, false);
document.addEventListener('keyup', up, false);
document.addEventListener('mousemove', mouseMove, false);



