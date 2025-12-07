console.log("Tron.js inserer");

const scale = 10;

//#region Player
/**
 * 
 */

class Player{
    //#region Player.Property
    #name;
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

    //#region Player.constructor
    /**
     * 
     * @param {string} name 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y, name = 'Player'){
        this.#name = name
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
    //#endregion Player.constructor

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
        if(
            this.#x -2 >= 0 &&
            this.#x +2 < game.width &&
            this.#y -2 >= 0 &&
            this.#y +2 < game.height &&
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
    get name() { return this.#name }
    get key_up(){ return this.#key_up }
    get key_down(){ return this.#key_down }
    get key_left(){ return this.#key_left }
    get key_right(){ return this.#key_right }
    get key_jump(){ return this.#key_jump }
    get color() { return this.#color }
    get direction() { return this.#direction }
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
    #player1_x_origine;
    #player1_y_origine;
    #player2_x_origine;
    #player2_y_origine;
    //#endregion

    //#region Game.constructor
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
        this.#player1 = p1;
        this.#player2 = p2;
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
        //save of the origine point of the player
        this.#player1_x_origine = this.#player1.x;
        this.#player1_y_origine = this.#player1.y;
        this.#player2_x_origine = this.#player2.x;
        this.#player2_y_origine = this.#player2.y;
        //initialize the map
        this.#initialize_map()
    }
    //#endregion Game.constructor

    //#region Game.Method

    #initialize_map(){
        //inititialise map
        this.#map = new Array();
        for(let i = 0; i<this.#height; i++){
            this.#map.push(new Array());
            for(let j=0; j<this.#width; j++) this.#map[i].push(0);
        }
        this.#map[this.#player1.y][this.#player1.x] = 1;
        this.#map[this.#player2.y][this.#player2.x] = 2;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    play(context){
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

    reset(){
        this.#player1.x = this.#player1_x_origine;
        this.#player1.y = this.#player1_y_origine;
        this.#player2.x = this.#player2_x_origine;
        this.#player2.y = this.#player2_y_origine;
        this.#initialize_map()
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
let game = new Game(80, 59, new Player(1, 28, 'Player 1'), new Player(1, 30, 'Player 2'));
let game_loop;
const SESSION_STATE = {
    CONTINU: true,
    START: false
}
//#endregion

//#region Initialisation Affichage
let divGame = document.getElementsByClassName("game")[0];
divGame.width = game.width * scale;
divGame.height = game.height * scale;
let canvas = divGame.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
let menu = divGame.getElementsByClassName("menu")[0];
let controls = divGame.getElementsByClassName("controls")[0];
let game_over = divGame.getElementsByClassName("game_over")[0];
let btnVersus = document.getElementById("Versus");
let btnContinue = document.getElementById("Continu");
let btnOption = document.getElementById("Option");
canvas.width = game.width * scale;
canvas.height = game.height * scale;
menu.width = game.width * scale;
menu.height = game.height * scale;
game_over.width = game.width * scale;
game_over.height = game.height * scale;

let player1_Up = document.getElementById("p1Up");
let player1_Down = document.getElementById("p1Down");
let player1_Left = document.getElementById("p1Left");
let player1_Right = document.getElementById("p1Rigth");
let player1_Jump = document.getElementById("p1Jump");
player1_Up.value = "Z";
player1_Up.code = game.player1.key_up;
player1_Down.value = "X";
player1_Down.code = game.player1.key_down;
player1_Left.value = "Q";
player1_Left.code = game.player1.key_left;
player1_Right.value = "D";
player1_Right.code = game.player1.key_right;
player1_Jump.value = "S";
player1_Jump.code = game.player1.key_jump;

let player2_Up = document.getElementById("p2Up");
let player2_Down = document.getElementById("p2Down");
let player2_Left = document.getElementById("p2Left");
let player2_Right = document.getElementById("p2Rigth");
let player2_Jump = document.getElementById("p2Jump");

player2_Up.value = "O";
player2_Up.textContent = game.player2.key_up;
player2_Down.value = ";";
player2_Down.textContent = game.player2.key_down;
player2_Left.value = "K";
player2_Left.textContent = game.player2.key_left;
player2_Right.value = "M";
player2_Right.textContent = game.player2.key_right;
player2_Jump.value = "L";
player2_Jump.textContent = game.player2.key_jump;

//#endregion

//#region Global function
function showMenu(state = SESSION_STATE.START) {
    if (state){
        btnContinue.classList.remove("hidden");
        if ( !("hidden" in btnVersus.classList )) btnVersus.classList.add('hidden');
    }else {
        btnVersus.classList.remove("hidden");
        if ( !("hidden" in btnContinue.classList )) btnContinue.classList.add('hidden');
    }
    menu.classList.remove("hidden");
    canvas.style.filter = "blur(5px)";
}

// Fonction pour masquer le menu
function hideMenu() {

    menu.classList.add("hidden");
    canvas.style.filter = "none";
}

// Fonction pour réinitialiser le jeu
/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 */
function resetGame(ctx) {
    // Efface le canvas
    ctx.reset();
    initialize_context_canvas(ctx);
    // Réinitialise le jeu
    game.reset();
}

// Fonction pour afficher le gagnant et revenir au menu
function gameOver(winner) {
    game.stop();

    
    setTimeout(() => {
        if (winner === 1) {
            alert("🏆 Joueur 1 (Bleu) a gagné !");
        } else if (winner === 2) {
            alert("🏆 Joueur 2 (Rouge) a gagné !");
        } else {
            alert("⚔️ Égalité !");
        }
        showMenu();
    }, 500);
}
//*/
/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @returns 
 */
function game_loop_start(ctx){
    return setInterval(
        (context )=>{
            game.play(context);
            if(
                game.player1.isDead() ||
                game.player2.isDead()
            ){
                game.stop;
                game_over.textContent = `${game.player1.isDead()? game.player2.name: game.player1.name} a gagné!`;
                game_over.classList.remove('hidden');
            }
        },
        450,
        ctx
    );
}
//#endregion

//#region Initialisation Context Canves
function initialize_context_canvas(ctx){
    ctx.moveTo(game.player1.x * scale, game.player1.y * scale);
    ctx.lineWidth = scale;
    ctx.lineCap = 'round';
}
//#endregion


//#region TEST
/*
game.start();
let gameInterval = null;
setInterval(
    (context )=>{
        game.play(context);
        if(
            game.player1.isDead() ||
            game.player2.isDead()
        ){
            game.stop;
            game_over.textContent = `${game.player1.isDead()? game.player2.color: game.player1.color} a gagné!`;
            game_over.classList.remove('hidden');
        }
    },
    500,
    ctx
);

setTimeout( ()=>{console.log(game.toString())}, 1_000);
*/
//#endregion

//#region EventListener


// Bouton Versus : Lance la partie
btnVersus.addEventListener("click", () => {
    console.log("Versus clicked");
    hideMenu();
    resetGame(ctx);
    game.start();
    game_loop = game_loop_start(ctx);
});

// Bouton Continue : Continue la partie
btnContinue.addEventListener("click", () => {
    console.log("Continue clicked");
    hideMenu();
    game.start();
    game_loop = game_loop_start(ctx);
});

controls.getElementsByTagName("form")[0].submit = (event) => {
    let key_p1 = {};
    let key_p2 = {};
    controls.getElementsByTagName("input").forEach((key, i) => {
        if (i < 5) a;
    });
    event.preventDefault    ();
    return false;
}

// Bouton Option : Afficher les options (à développer)
btnOption.addEventListener("click", () => {
    console.log("Option clicked");
    // À compléter selon vos besoins
    if ( !("hidden" in menu.classList )) menu.classList.add('hidden');
    controls.classList.remove("hidden");
});

document.addEventListener("keypress", event => {
    console.log(event);
    console.log(event.code);
    //Mouvement
    switch(event.code){
        case game.key_stop:
            game.stop();
            clearInterval(game_loop);
            showMenu(SESSION_STATE.CONTINU);
            console.log("game stoped");
            break;
        case game.player1.key_up:
            if (game.player1.direction != "Down") game.player1.change_direction('Up');
            break;
        case game.player1.key_down:
            if (game.player1.direction != "Up") game.player1.change_direction('Down');
            break;
        case game.player1.key_left:
            if (game.player1.direction != "Right") game.player1.change_direction('Left');
            break;
        case game.player1.key_right:    
            if (game.player1.direction != "Left") game.player1.change_direction('Right');
            break;
        case game.player1.key_jump:
            game.player1.jump(game);
            break;
        case game.player2.key_up:
            if (game.player2.direction != "Down") game.player2.change_direction('Up');
            break;
        case game.player2.key_down:
            if (game.player2.direction != "Up") game.player2.change_direction('Down');
            break;
        case game.player2.key_left:
            if (game.player2.direction != "Right") game.player2.change_direction('Left');
            break;
        case game.player2.key_right:
            if (game.player2.direction != "Left") game.player2.change_direction('Right');
            break;
        case game.player2.key_jump:
            game.player2.jump(game);
            break;
        default: break;
    }
});
//#endregion
