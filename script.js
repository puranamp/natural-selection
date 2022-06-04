//Constants
const GOAL_POSITION = [350, 650]; // Width and Height = 25
const MAX_GENES = 25;
const NUM_BALLS = 100;
const MULTIPLIER = 30;
const MUTATION_RATE = 0.02;

//Global
let balls = [];
let avgFit = 0.0;
let generation = 0;


class Ball {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.radius = 5;
        this.fitness = 0.0;
        this.pos = 0;
        this.genes = [];
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }

    update() {
        if (this.pos < MAX_GENES) {
            this.x += MULTIPLIER * this.genes[this.pos][0];
            this.y += MULTIPLIER * this.genes[this.pos][1];
            this.pos += 1;
        }
    }

    createGenes() {
        let sequence = [];

        for (let i = 0; i < MAX_GENES; i++) {
            sequence.push([Math.random() * 2 - 1, Math.random() * 2 - 1])
        }

        return sequence;
    }

    setGenes(genes) {
        this.genes = genes;
    }

    calcFitness() {
        let dist = Math.sqrt(Math.pow(350 - this.x, 2) + Math.pow(650 - this.y, 2));

        //Normalize
        let normalized = dist / 650;
        this.fitness = 1 - normalized; //Higher fitness is better
    }

    mutate() {
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < MUTATION_RATE) {
                this.genes[i] = [Math.random() * 2 - 1, Math.random() * 2 - 1];
            }
        }
    }


}

function init() {
    let canvas = document.getElementById('panel');
    let context = canvas.getContext('2d');

    for (let i = 0; i < NUM_BALLS; i++) {
        let b = new Ball(350, 20, context);
        b.setGenes(b.createGenes());
        balls.push(b);
    }

    animation();
}

function calculateAvgFitness() {
    let sum = 0;
    for (let i = 0; i < NUM_BALLS; i++) {
        sum += balls[i].fitness;
    }

    return sum / NUM_BALLS;
}

function rep() {
    if (generation == 1000) {
        return;
    }
    for (let i = 0; i < NUM_BALLS; i++) {
        balls[i].update();
    }
    newGen();

    rep();
}

function animation() {
    let canvas = document.getElementById('panel');
    let context = canvas.getContext('2d');

    requestAnimationFrame(animation);
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < NUM_BALLS; i++) {
        balls[i].update();
        balls[i].draw();
    }

    context.fillStyle = "#ffffff";
    context.fillRect(350, 650, 25, 25);
    context.fillText("Generation: " + generation.toString(), 15, 45);
    context.fillText("Avg fitness: " + avgFit.toFixed(2).toString(), 15, 90);


    if (balls[0].pos == (MAX_GENES - 1)) {
        newGen();
    }

}

function newGen() {
    // Take care of mutations.
    generation += 1;
    let canvas = document.getElementById('panel');
    let context = canvas.getContext('2d');

    let matingPool = [];
    let sum = 0.0;
    for (let i = 0; i < NUM_BALLS; i++) {
        balls[i].calcFitness();
        sum += balls[i].fitness;
        let n = Math.floor(balls[i].fitness * 100);
        for (let j = 0; j < n; j++) {
            matingPool.push(balls[i]);
        }
    }

    avgFit = sum / NUM_BALLS;
    let newBalls = [];
    for (let i = 0; i < NUM_BALLS; i++) {
        let momIdx = Math.floor(Math.random() * (matingPool.length));
        let dadIdx = Math.floor(Math.random() * (matingPool.length));

        let mom = matingPool[momIdx];
        let dad = matingPool[dadIdx];
        let c = new Ball(350, 20, context);

        for (let j = 0; j < MAX_GENES; j++) {
            if (j % 2 == 0) {
                c.genes.push(dad.genes[j]);
            } else {
                c.genes.push(mom.genes[j]);
            }
        }
        c.mutate();
        newBalls.push(c);
    }

    balls = newBalls;
}

init();
