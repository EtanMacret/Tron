console.log("Tron.js inserer");

const scale = 10;


//#region LIst_key
/**
 * 
 */
class List_Key{
    key_up;
    key_down;
    key_left;
    key_right;
    key_jump;

    /**
     * 
     * @param {string} up 
     * @param {string} down 
     * @param {string} left 
     * @param {string} right 
     * @param {string} jump 
     */
    constructor(up, down, left, right, jump){
        this.key_up = up;
        this.key_down = down;
        this.key_left = left;
        this.key_right = right;
        this.key_jump = jump;
    }
}


//#endregion LIst_key

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
    #key_list;
    #color;
    #dead
    //#endregion Player.Property

    //#region Player.constructor
    /**
     * 
     * @param {string} name 
     * @param {number} x 
     * @param {number} y 
     * @param {List_Key} lst_key
     */
    constructor(x, y, name = 'Player', lst_key = new List_Key('KeyW', 'KeyX','KeyA','KeyD','KeyS')){
        this.#name = name
        this.#x = x;
        this.#y = y;
        this.#direction = "Right"
        this.#color = "blue"
        this.#key_list = lst_key;
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
     * @param {List_Key} obj 
     */
    change_controle(obj){
        this.#key_list = obj
    }

    //#endregion

    //#region Player.GetterSetter
    set x(x){ this.#x = x }
    set y(y){ this.#y = y }
    set color(color){ this.#color = color }

    get x() { return this.#x }
    get y() { return this.#y }
    get name() { return this.#name }
    get key_list() { return this.#key_list }
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
        this.#player2.change_controle(new List_Key(
            'KeyO',
            'Comma',
            'KeyK',
            'Semicolon',
            'KeyL')
        );
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
    get is_pause(){ return this.#is_pause; }
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
//#region canvas
let divGame = document.getElementsByClassName("game")[0];
divGame.width = game.width * scale;
divGame.height = game.height * scale;
let canvas = divGame.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
//#endregion canvas

//#region display
let menu = divGame.getElementsByClassName("menu")[0];
let controls = divGame.getElementsByClassName("controls")[0];
let game_over = divGame.getElementsByClassName("game_over")[0];
canvas.width = game.width * scale;
canvas.height = game.height * scale;
menu.width = game.width * scale;
menu.height = game.height * scale;
game_over.width = game.width * scale;
game_over.height = game.height * scale;
let winner = document.getElementById("winner"); //winner dispaly
//#endregion display

//#region button
let btnVersus = document.getElementById("Versus");
let btnContinue = document.getElementById("Continu");
let btnOption = document.getElementById("Option");
let btnHome = document.getElementById("home");
//#endregion button

//#region controle
let player1_Up = document.getElementById("p1Up");
let player1_Down = document.getElementById("p1Down");
let player1_Left = document.getElementById("p1Left");
let player1_Right = document.getElementById("p1Right");
let player1_Jump = document.getElementById("p1Jump");
player1_Up.value = "Z";
player1_Up.setAttribute("code", game.player1.key_list.key_up);
player1_Down.value = "X";
player1_Down.setAttribute("code", game.player1.key_list.key_down);
player1_Left.value = "Q";
player1_Left.setAttribute("code", game.player1.key_list.key_left);
player1_Right.value = "D";
player1_Right.setAttribute("code", game.player1.key_list.key_right);
player1_Jump.value = "S";
player1_Jump.setAttribute("code", game.player1.key_list.key_jump);

let player2_Up = document.getElementById("p2Up");
let player2_Down = document.getElementById("p2Down");
let player2_Left = document.getElementById("p2Left");
let player2_Right = document.getElementById("p2Right");
let player2_Jump = document.getElementById("p2Jump");

player2_Up.value = "O";
player2_Up.setAttribute("code", game.player2.key_list.key_up);
player2_Down.value = ";";
player2_Down.setAttribute("code", game.player2.key_list.key_down);
player2_Left.value = "K";
player2_Left.setAttribute("code", game.player2.key_list.key_left);
player2_Right.value = "M";
player2_Right.setAttribute("code", game.player2.key_list.key_right);
player2_Jump.value = "L";
player2_Jump.setAttribute("code", game.player2.key_list.key_jump);

let list_controle = {};
Array.from(controls.getElementsByTagName("input")).forEach( (input) => { list_controle[input.id] = input.getAttribute("code") });



//#endregion controle
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

//#region function display
// Fonction pour masquer le menu
function hideMenu() {
if ( !("hidden" in menu.classList) )menu.classList.add("hidden");
    canvas.style.filter = "none";
}

function showOption(){
    if ( !("hidden" in menu.classList )) menu.classList.add('hidden');
    controls.classList.remove("hidden");
}

function hideOption(){
    if ( !("hidden" in controls.classList )) controls.classList.add("hidden");
    menu.classList.remove('hidden');
}

function showGameOver(){
    clearInterval(game_loop);
    winner.textContent = `${game.player1.isDead()? game.player2.name: game.player1.name} a gagné!`;
    game_over.classList.remove('hidden');
}

function hideGameOver(){
    if ( !("hidden" in game_over.classList) )game_over.classList.add('hidden');
    showMenu();
}
//#endregion function display

//#region function resetGame
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
//#endregion function resetGame

/* Useless
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
//#region function game_loop_start
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
                game.stop();
                showGameOver();
            }
        },
        450,
        ctx
    );
}
//#endregion function game_loop_start

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

btnHome.addEventListener("click", ()=> {
    showMenu();
    hideGameOver();
});

//#region event listener control
player1_Up.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Up.setAttribute("code", e.code);
        player1_Up.value = "";
        list_controle[e.target.id] = e.code
    }
});
player1_Up.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Up.value = e.key;
    }
});
player1_Down.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Down.setAttribute("code", e.code);
        player1_Down.value = "";
        list_controle[e.target.id] = e.code
    }
});
player1_Down.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Down.value = e.key;
    }
});
player1_Left.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Left.setAttribute("code", e.code);
        player1_Left.value = "";
        list_controle[e.target.id] = e.code
    }
});
player1_Left.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Left.value = e.key;
    }
});
player1_Right.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Right.setAttribute("code", e.code);
        player1_Right.value = "";
        list_controle[e.target.id] = e.code
    }
});
player1_Right.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Right.value = e.key;
    }
});
player1_Jump.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Jump.setAttribute("code", e.code);
        player1_Jump.value = "";
        list_controle[e.target.id] = e.code
    }
});
player1_Jump.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player1_Jump.value = e.key;
    }
});

player2_Up.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Up.setAttribute("code", e.code);
        player2_Up.value = "";
        list_controle[e.target.id] = e.code
    }
});
player2_Up.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Up.value = e.key;
    }
});
player2_Down.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Down.setAttribute("code", e.code);
        player2_Down.value = "";
        list_controle[e.target.id] = e.code
    }
});
player2_Down.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Down.value = e.key;
    }
});
player2_Left.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Left.setAttribute("code", e.code);
        player2_Left.value = "";
        list_controle[e.target.id] = e.code
    }
});
player2_Left.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Left.value = e.key;
    }
});
player2_Right.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Right.setAttribute("code", e.code);
        player2_Right.value = "";
        list_controle[e.target.id] = e.code
    }
});
player2_Right.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Right.value = e.key;
    }
});
player2_Jump.addEventListener("keydown", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Jump.setAttribute("code", e.code);
        player2_Jump.value = "";
        list_controle[e.target.id] = e.code
    }
});
player2_Jump.addEventListener("keyup", (e) => {
    if(Object.values(list_controle).indexOf(e.code) == -1){
        player2_Jump.value = e.key;
    }
});

Array.from(controls.getElementsByTagName("input")).forEach(input => {
    input.addEventListener('keyup', event => {
        event.target.style.color = 'red'
    });
})
//#endregion event listener control

//#region event listener submit controle
controls.getElementsByTagName("form")[0].addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    let key_p1 = new List_Key(
        player1_Up.getAttribute("code"),
        player1_Down.getAttribute("code"),
        player1_Left.getAttribute("code"),
        player1_Right.getAttribute("code"),
        player1_Jump.getAttribute("code")
    );
    let key_p2 = new List_Key(
        player2_Up.getAttribute("code"),
        player2_Down.getAttribute("code"),
        player2_Left.getAttribute("code"),
        player2_Right.getAttribute("code"),
        player2_Jump.getAttribute("code")
    );
    console.log(key_p1);
    
    
    game.player1.change_controle(key_p1);
    game.player2.change_controle(key_p2);

    hideOption();

   return false;    
});
//#endregion event listener submit controle

// Bouton Option : Afficher les options (à développer)
btnOption.addEventListener("click", () => {
    console.log("Option clicked");
    showOption();
});

//#region event listener key press gestion
document.addEventListener("keypress", event => {
    //Mouvement
    if (!game.is_pause){
        switch(event.code){
            case game.key_stop:
                game.stop();
                clearInterval(game_loop);
                showMenu(SESSION_STATE.CONTINU);
                console.log("game stoped");
                break;
            case game.player1.key_list.key_up:
                if (game.player1.direction != "Down") game.player1.change_direction('Up');
                break;
            case game.player1.key_list.key_down:
                if (game.player1.direction != "Up") game.player1.change_direction('Down');
                break;
            case game.player1.key_list.key_left:
                if (game.player1.direction != "Right") game.player1.change_direction('Left');
                break;
            case game.player1.key_list.key_right:    
                if (game.player1.direction != "Left") game.player1.change_direction('Right');
                break;
            case game.player1.key_list.key_jump:
                game.player1.jump(game);
                break;
            case game.player2.key_list.key_up:
                if (game.player2.direction != "Down") game.player2.change_direction('Up');
                break;
            case game.player2.key_list.key_down:
                if (game.player2.direction != "Up") game.player2.change_direction('Down');
                break;
            case game.player2.key_list.key_left:
                if (game.player2.direction != "Right") game.player2.change_direction('Left');
                break;
            case game.player2.key_list.key_right:
                if (game.player2.direction != "Left") game.player2.change_direction('Right');
                break;
            case game.player2.key_list.key_jump:
                game.player2.jump(game);
                break;
            default: break;
        }
    }    
});
//#endregion event listener key press gestion
//#endregion
