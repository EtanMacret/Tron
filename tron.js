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
    #key_up;
    #key_down;
    #key_left;
    #key_right;
    #key_jump;
    #color
    #dead
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
        this.#key_up = 'KeyW';
        this.#key_down = 'KeyX';
        this.#key_left = 'KeyA';
        this.#key_right = 'KeyD';
        this.#key_jump = 'KeyS';
        this.#color = "blue"
        this.#dead = false;
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
    
    isDead() {return this.#dead}

    die() {
        console.log(`${this.#color} died`);
        
        this.#dead = true
    }

    next(){
        let next_x = this.#x;
        let next_y = this.#y;
        switch(this.#direction){
            case 'Up':
                next_y -= 1
                break
            case 'Down':
                next_y += 1
                break
            case 'Right':
                next_x += 1
                break
            case 'Left':
                next_x -= 1
                break
            default: break
        }
        return [next_x, next_y];
    }

    /**
     * 
     * @param {Game} game 
     */
    jump(game){
        let next_x;
        let next_y;
        [next_x, next_y] = this.next();
        console.log( this.#x -1 >= 0 ,
            this.#x +1 < game.width ,
            this.#y -1 >= 0 ,
            this.#y +1 < game.height,
            game.map[next_y][next_x]
        );
        if(
            this.#x -1 >= 0 &&
            this.#x +1 < game.width &&
            this.#y -1 >= 0 &&
            this.#y +1 < game.height &&
            game.map[next_y][next_x] == 0
        ){
            console.log(`${this.#color} jump`);
            this.move();
        }
    }

    /**
     * 
     * @param {Object} obj 
     */
    change_controle(obj){
        this.#key_up = obj.key_up;
        this.#key_down = obj.key_down;
        this.#key_left = obj.key_left;
        this.#key_right = obj.key_right;
        this.#key_jump = obj.key_jump;
    }

    //#endregion

    //#region Player.GetterSetter
    set x(x){ this.#x = x }
    set y(y){ this.#y = y }
    set key_up(code){}
    set key_down(code){}
    set key_left(code){}
    set key_right(code){}
    set key_jump(code){}
    set color(color){ this.#color = color }

    get x() { return this.#x }
    get y() { return this.#y }
    get key_up(){ return this.#key_up }
    get key_down(){ return this.#key_down }
    get key_left(){ return this.#key_left }
    get key_right(){ return this.#key_right }
    get key_jump(){ return this.#key_jump }
    get color() { return this.#color}
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
    #is_pause;
    #key_stop;
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
        this.#player1 = p1;
        this.#player2 = p2;
        this.#player1.color = 'blue';
        this.#player2.color = 'red';
        this.#is_pause = true;
        this.#key_stop = 'Space';
        this.#player2.change_controle({
            'key_up' : 'KeyO',
            'key_down' : 'Comma',
            'key_left' : 'KeyK',
            'key_right' : 'Semicolon',
            'key_jump' : 'KeyL'
        });
        this.#map[this.#player1.y][this.#player1.x] = 1;
        this.#map[this.#player2.y][this.#player2.x] = 2;
    }

    //#region Game.Method
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    play(context){;
        if(!this.#is_pause){
            this.draw_line(context, this.#player1);
            this.draw_line(context, this.#player2);
        }
    }

    stop(){ this.#is_pause = true }

    start(){ this.#is_pause = false }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Player} player 
     */
    draw_line(context, player){
        context.strokeStyle = player.color;
        context.beginPath();
        context.moveTo(player.x * scale, player.y * scale);
        player.move();
        if (
            player.x < 0 ||
            player.x >= game.width ||
            player.y < 0 ||
            player.y >= game.height ||
            this.#map[player.y][player.x] != 0
        ) {
            player.die();
            context.closePath();
            this.#is_pause = true;
        }
        else{
            this.#map[player.y][player.x] = (player == this.#player1)? 1: 2;
            context.lineTo(player.x * scale, player.y * scale);
            context.stroke();
            context.closePath();
        }
    }
    //#endregion

    //#region Game.GetterSetter
    get width() { return this.#width; }
    get height() { return this.#height; }
    get player1() { return this.#player1; }
    get player2() { return this.#player2; }
    get key_stop() { return this.#key_stop; }
    get map() { return this.#map; }
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
let game_over = divGame.getElementsByClassName("game_over")[0];
canvas.width = game.width * scale;
canvas.height = game.height * scale;
menu.width = game.width * scale;
menu.height = game.height * scale;
game_over.width = game.width * scale;
game_over.height = game.height * scale;
game_over.classList.add('hidden');
//#endregion

//#region Initialisation Contect Canves
let ctx = canvas.getContext("2d");
ctx.moveTo(game.player1.x * scale, game.player1.y * scale);
ctx.strokeStyle = 'blue';
ctx.lineWidth = scale;
ctx.lineCap = 'round';
//#endregion


//#region TEST
game.start();

setInterval(
    (context )=>{
        game.play(context);
        if(
            game.player1.isDead() ||
            game.player2.isDead()
        ){
            game.stop;
            game_over.textContent = `${game.player1.isDead()? game.player2.color: game.player1.color} a gagné!`;
            game_over.classList.remove('hidden')
        }
    },
    1_000,
    ctx
);

setTimeout( ()=>{console.log(game.toString())}, 2_000);
//#endregion

//#region EventListener
document.addEventListener("keypress", event => {
    console.log(event.code);
    
    //Mouvement
    switch(event.code){
        case game.key_stop:
            game.stop();
            console.log("game stoped");
            break;
        case game.player1.key_up:
            game.player1.change_direction('Up');
            break;
        case game.player1.key_down:
            game.player1.change_direction('Down');
            break;
        case game.player1.key_left:
            game.player1.change_direction('Left');
            break;
        case game.player1.key_right:    
            game.player1.change_direction('Right');
            break;
        case game.player1.key_jump:
            game.player1.jump(game);
            break;
        case game.player2.key_up:
            game.player2.change_direction('Up');
            break;
        case game.player2.key_down:
            game.player2.change_direction('Down');
            break;
        case game.player2.key_left:
            game.player2.change_direction('Left');
            break;
        case game.player2.key_right:
            game.player2.change_direction('Right');
            break;
        case game.player2.key_jump:
            game.player2.jump(game);
            break;
        default: break;
    }
});
//#endregion
