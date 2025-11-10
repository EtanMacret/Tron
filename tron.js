console.log("Tron.js inserer");

let canvas = document.getElementsByTagName("canvas")[0];
const scale = 10;

class Player{

    #x;
    #y;
    #direction;


    constructor(x, y){
        this.#x = x;
        this.#y = y;
        this.#direction = "Rigth"
    }

    set x(x){ this.#x = x }
    set y(y){ this.#y = y }

    get x() { return this.#x }
    get y() { return this.#y }

    change_direction(direction){
        this.#direction = direction
    }

    move(){
        switch(this.#direction){
            case 'Up':
                this.#y += 1
                break
            case 'Down':
                this.#y -= 1
                break
            case 'Rigth':
                this.#x += 1
                break
            case 'Left':
                this.#x -= 1
                break
            default: break
        }
    }

}

class Game{
    #map;
    #player1;
    #player2;
    #width;
    #heigth;

    constructor(){
        this.#width = 80;
        this.#heigth = 59
        this.#map = new Array();
        for(let i = 0; i<this.#heigth; i++){
            this.#map.push(new Array());
            for(let j=0; j<this.#width; j++) this.#map[i].push(0);
        }
        this.#player1 = new Player(1, 28);
        this.#player2 = new Player(1, 30);
        this.#map[this.#player1.y][this.#player1.x] = 1;
        this.#map[this.#player2.y][this.#player2.x] = 2;
    }

    toString(){
        let msg = "";
        let separator = "+";
        for(let j=0; j<this.#width;j++) separator += "-+";
        for(let i=0; i<this.#heigth; i++){
            msg += separator + "\n|";
            for(let j=0; j<this.#width;j++) msg += this.#map[i][j] + "|";
            msg += "\n";
        }
        msg += separator + "\n";
        return msg;
    }
}

let ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
let p1 = new Player(1, 28);
let p2 = new Player(1, 30);
ctx.moveTo(p1.x * scale, p1.y * scale);
ctx.strokeStyle = 'blue';
ctx.lineWidth = scale;
ctx.lineCap = 'round';

let game = new Game()

console.log(game.toString());

/*
setInterval(
    function draw_line(player){
        ctx.moveTo(player.x * scale, player.y * scale);
        player.move();
            ctx.lineTo(player.x * scale, player.y * scale);
            ctx.stroke();
    },
    1_000,
    p1
);
*/


document.addEventListener("keypress", event => console.log(event.code));

