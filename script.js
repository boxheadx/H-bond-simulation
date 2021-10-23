const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const PROTON_SIZE = 20;
const ELECTRON_SIZE = 5;
const ORBITAL_VELOCITY = 30;

E_FORCE = 2;
ATOMIC_RADIUS = PROTON_SIZE + 30;
isBonded=false;

init_pos_x_1 = 0
init_pos_y_1 = 0
init_pos_x_2 = 0
init_pos_y_2 = 0

all_protons = [];

class Proton{
    constructor(x, y){
        this.x = x;
        this.y = y;
        all_protons.push(this)
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, PROTON_SIZE, 0, 2*Math.PI)
        ctx.fillStyle = 'blue'
        ctx.fill()
    }
}

class Electron{
    constructor(x, y, proton){
        this.x = x;
        this.y = y;
        this.proton = proton;
        this.sign = 1;
        this.direction = 1;
    }

    draw(){        
        ctx.beginPath();
        ctx.arc(this.x, this.y, ELECTRON_SIZE, 0, 2*Math.PI)
        ctx.fillStyle = 'yellow'
        ctx.fill()
    }
}

class Line{
    constructor(proton){
        this.proton = proton;
        this.x1 = this.proton.x;
        this.y1 = this.proton.y;
        this.x2 = this.proton.x + ATOMIC_RADIUS;
        this.y2 = this.proton.y;
    }

    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.strokeStyle = 'red'
        ctx.stroke();

    }
}

function getRandomInitPosition(){
    init_pos_x_1 = Math.floor(Math.random()*400) + 80;
    init_pos_y_1 = Math.floor(Math.random()*400) + 80;
    init_pos_x_2 = Math.floor(Math.random()*400) + 80;
    init_pos_y_2 = Math.floor(Math.random()*400) + 80;

    if(Math.abs(init_pos_x_1-init_pos_x_2) < 300){
        if(Math.abs(canvas.width - init_pos_x_2) >= 300){
            if(canvas.width > init_pos_x_2){
                init_pos_x_2 -= 300;
            }
            if(canvas.width < init_pos_x_2){
                init_pos_x_2 += 300;
            }
        }
        if(Math.abs(canvas.width - init_pos_x_1) >= 300){
            if(canvas.width > init_pos_x_1){
                init_pos_x_1 -= 300;
            }
            if(canvas.width < init_pos_x_1){
                init_pos_x_1 += 300;
            }
        }
    }

}
getRandomInitPosition();


proton1 = new Proton(100, 100)
electron1 = new Electron(proton1.x + ATOMIC_RADIUS, proton1.y)

proton2 = new Proton(500, 500)
electron2 = new Electron(proton2.x + ATOMIC_RADIUS, proton2.y)



function drawAll(){
    proton1.draw();
    electron1.draw();

    proton2.draw();
    electron2.draw();
}

function attraction(){
    if(Math.abs(proton1.x - proton2.x) >= 2*PROTON_SIZE + 10){
        if(proton1.x - proton2.x < 0){
            proton1.x += E_FORCE;
            proton2.x -= E_FORCE;
            E_FORCE += 100/Math.abs(proton1.x - proton2.x)
        }
        if(proton1.x - proton2.x > 0){
            proton1.x -= E_FORCE;
            proton2.x += E_FORCE;
            E_FORCE = 100/Math.abs(proton1.x - proton2.x)
        }
    }

    if(Math.abs(proton1.y - proton2.y) >= 2*PROTON_SIZE + 10){
        if(proton1.y - proton2.y < 0){
            proton1.y += E_FORCE;
            proton2.y -= E_FORCE;
            E_FORCE = 100/Math.abs(proton1.y - proton2.y)
        }
        if(proton1.y - proton2.y > 0){
            proton1.y -= E_FORCE;
            proton2.y += E_FORCE;
            E_FORCE = 100/Math.abs(proton1.y - proton2.y)
        }
    }    


}

function brownian_motion(){
    dx = Math.random();
    proton1.x += dx;
    dy = Math.random();
    proton1.y += dy;

    dx = Math.random();
    proton2.x += dx;
    dy = Math.random();
    proton2.y += dy;
}

function superposition_electron(proton, electron){

    if(Math.abs(electron.x - proton.x) >= ATOMIC_RADIUS ){
        if(electron.x > proton.x){
            electron.direction = 1;
        }
        if(electron.x < proton.x){
            electron.direction = -1;
        }
    }

    if(electron.direction == 1){
        electron.x -= ORBITAL_VELOCITY;
    }

    if(electron.direction == -1){
        electron.x += ORBITAL_VELOCITY;
    }

    if(electron.x - proton.x > -ATOMIC_RADIUS +10 || electron.x - proton.x < -ATOMIC_RADIUS -10){
        electron.sign = -electron.sign
    }
    if(electron.x - proton.x > ATOMIC_RADIUS +10 ||electron.x - proton.x < ATOMIC_RADIUS -10){
        electron.sign = -electron.sign
    }
    electron.y = proton.y + electron.sign*Math.sqrt(ATOMIC_RADIUS ** 2 - (electron.x - proton.x) ** 2)
}

function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    drawAll();

    attraction();

    superposition_electron(proton1, electron1)
    superposition_electron(proton2, electron2)

    

    if(Math.abs(proton1.x - proton2.x) < (2*PROTON_SIZE + 10 )&& Math.abs(proton1.y - proton2.y) < (2*PROTON_SIZE + 10)){
        isBonded=true;
    }

    if(isBonded){
        ATOMIC_RADIUS =  2*(PROTON_SIZE + 30)
    }

    brownian_motion()

    requestAnimationFrame(update)

}

update();