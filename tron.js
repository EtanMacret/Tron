console.log("Tron.js inserer");

const scale = 10;

//#region Player
/**
 * 
 */

class Player{
    //#region Player.Property
    #x;
    #y;
    #direction;
    //#endregion Player.Property

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y){
        this.#x = x;
        this.#y = y;
        this.#direction = "Right"
    }

    //#region Player.Method
    change_direction(direction){
        this.#direction = direction
    }

    move(){
        switch(this.#direction){
            case 'Up':
                this.#y -= 1
                break
            case 'Down':
                this.#y += 1
                break
            case 'Right':
                this.#x += 1
                break
            case 'Left':
                this.#x -= 1
                break
            default: break
        }
    }

    //#endregion

    //#region Player.GetterSetter
    set x(x){ this.#x = x }
    set y(y){ this.#y = y }

    get x() { return this.#x }
    get y() { return this.#y }
    //#endregion

}
//#endregion






//#region Game
/**
 * 
 */
class Game{
    //#region Game.Property
    #map;
    #player1;
    #player2;
    #width;
    #height;
    //#endregion

    /**
     * 
     * @param {number} w 
     * @param {number} h 
     * @param {Player} p1 
     * @param {Player} p2 
     */
    constructor(w, h, p1, p2){
        this.#width = w;
        this.#height = h;
        this.#map = new Array();
        for(let i = 0; i<this.#height; i++){
            this.#map.push(new Array());
            for(let j=0; j<this.#width; j++) this.#map[i].push(0);
        }
        this.#player1 = p1
        this.#player2 = p2
        this.#map[this.#player1.y][this.#player1.x] = 1;
        this.#map[this.#player2.y][this.#player2.x] = 2;
    }

    //#region Game.Method
    //#endregion

    //#region Game.GetterSetter
    get width() { return this.#width;}
    get height() { return this.#height;}
    get player1() { return this.#player1;}
    get player2() { return this.#player2;}
    //#endregion

    toString(){
        let msg = "";
        let separator = "+";
        for(let j=0; j<this.#width;j++) separator += "-+";
        for(let i=0; i<this.#height; i++){
            msg += separator + "\n|";
            for(let j=0; j<this.#width;j++) msg += this.#map[i][j] + "|";
            msg += "\n";
        }
        msg += separator + "\n";
        return msg;
    }
}
//#endregion





//#region Initialisation Jeu
let game = new Game(80, 59, new Player(1, 28), new Player(1, 30));
//#endregion

//#region Initialisation Affichage
let divGame = document.getElementsByClassName("game")[0];
divGame.width = game.width * scale;
divGame.height = game.height * scale;
let canvas = divGame.getElementsByTagName("canvas")[0];
let menu = divGame.getElementsByClassName("menu")[0];
canvas.width = game.width * scale;
canvas.height = game.height * scale;
menu.width = game.width * scale;
menu.height = game.height * scale;
//#endregion

//#region Initialisation Contect Canves
console.log(menu.width, menu.height);
let ctx = canvas.getContext("2d");
ctx.moveTo(game.player1.x * scale, game.player1.y * scale);
ctx.strokeStyle = 'blue';
ctx.lineWidth = scale;
ctx.lineCap = 'round';
//#endregion


//#region TEST
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


//#endregion

//#region EventListener
document.addEventListener("keypress", event => console.log(event.code));
//#endregion