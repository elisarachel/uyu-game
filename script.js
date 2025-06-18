const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let loopAtivo = false;
let jogoIniciado = false;
let pausado = false;
let gameOver = false;

const TOTAL_IMAGENS = 15;

// Imagens
const ceu = new Image();
ceu.src = "imagens/sky.png";

const grama = new Image();
grama.src = "imagens/grass.png";

const vaca = new Image();
vaca.src = "imagens/cow_sprite.png";

const cerca = new Image();
cerca.src = "imagens/fence.png";

const scoreLabel = new Image();
scoreLabel.src = "imagens/score.png";

const startButton = new Image();
startButton.src = "imagens/start.png";

const pauseButton = new Image();
pauseButton.src = "imagens/pause.png";

const playButton = new Image();
playButton.src = "imagens/play.png";

const gameOverImg = new Image();
gameOverImg.src = "imagens/gameover.png";

// Pontuação
let score = 0;
const numeros = [];
for (let i = 0; i <= 9; i++) {
	const img = new Image();
	img.src = `imagens/score${i}.png`;
	numeros.push(img);
}

// Cerca
let fenceX = 640;
const fenceY = 152;
const fenceWidth = 30;
const fenceHeight = 24;
const fenceSpeed = 2;

// Scroll da grama
let gramaX = 0;
const gramaSpeed = 2;

// Animação da vaquinha
const frameLargura = 32;
const frameAltura = 32;
let frameAtual = 0;
let contagem = 0;
const frameMax = 8;
const frameDelay = 5;

// Jogo
let y = 152;
let vy = 0;
let gravidade = 0.8;
let noChao = true;

document.addEventListener("keydown", (e) => {
	if (pausado) return;
	if (e.code === "Space" && noChao) {
		vy = -15;
		noChao = false;
	}
	if (e.code === "Space" && gameOver) {
		gameOver = false;
		jogoIniciado = false;
		score = 0;
		fenceX = 640;
		y = 152;
		vy = 0;
		return;
	}
	if (!jogoIniciado) {
		gameOver = false;
		jogoIniciado = true;
		score = 0;
		fenceX = 640;
		y = 152;
		vy = 0;
		return;
	}
});

canvas.addEventListener("click", (e) => {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	const mouseX = (e.clientX - rect.left) * scaleX;
	const mouseY = (e.clientY - rect.top) * scaleY;

	// Clicou após Game Over → volta pra tela inicial
	if (gameOver) {
		gameOver = false;
		jogoIniciado = false;
		score = 0;
		fenceX = 640;
		y = 152;
		vy = 0;
		return;
	}

	// Tela inicial: clicou no botão Start
	if (!jogoIniciado && !gameOver) {
		if (mouseX >= 270 && mouseX <= 342 && mouseY >= 120 && mouseY <= 152) {
			jogoIniciado = true;
			pausado = false;
			gameOver = false;
			score = 0;
			fenceX = 640;
			y = 152;
			vy = 0;
			frameAtual = 0;
			contagem = 0;
			noChao = true;
		}
	}
	console.log(mouseX, mouseY);


	// Pause/Play
	if (jogoIniciado && !gameOver) {
		if (mouseX >= 610 && mouseX <= 626 && mouseY >= 10 && mouseY <= 26) {
			pausado = !pausado;
		}
	}
});


function desenharFundo() {
	// Céu (estático)
	ctx.drawImage(ceu, 0, 0);
	ctx.drawImage(ceu, 320, 0);

	// Grama (scroll infinito)
	if (jogoIniciado && !pausado && !gameOver) {
		gramaX -= gramaSpeed;
	}

	if (gramaX <= -320) gramaX = 0;

	ctx.drawImage(grama, 0, 160, 320, 40, gramaX, 160, 320, 40);
	ctx.drawImage(grama, 0, 160, 320, 40, gramaX + 320, 160, 320, 40);
	ctx.drawImage(grama, 0, 160, 320, 40, gramaX + 640, 160, 320, 40);
}

function desenharVaquinha() {
	// Animação por frame
	if (jogoIniciado && !pausado && !gameOver) {
		contagem++;
		if (contagem % frameDelay === 0) {
			frameAtual = (frameAtual + 1) % frameMax;
		}
	}

	const sx = frameAtual * frameLargura;
	ctx.drawImage(
		vaca,
		sx, 0, frameLargura, frameAltura,
		50, y, frameLargura, frameAltura
	);
}

function desenharCerca() {
    ctx.drawImage(cerca, fenceX, fenceY, fenceWidth, fenceHeight);
}

function desenharScore(x = 10, y = 10) {
	ctx.drawImage(scoreLabel, x, y);

	// Desenha os números
	const scoreStr = Math.floor(score).toString();
	const numeroLargura = 16;
	const numeroAltura = 16;
	const espacamento = 1;

	let offsetX = x + scoreLabel.width;

	for (let i = 0; i < scoreStr.length; i++) {
		const num = parseInt(scoreStr[i]);
		ctx.drawImage(numeros[num], offsetX, y, numeroLargura, numeroAltura);
		offsetX += numeroLargura + espacamento;
	}
}

function desenharBotoes() {
	if (!jogoIniciado && !gameOver) {
		// Tela inicial
		ctx.drawImage(startButton, 270, 120, 72, 32);
	} else if (jogoIniciado && !gameOver) {
		// Pause ou Play no topo
		const btnImg = pausado ? playButton : pauseButton;
		ctx.drawImage(btnImg, 610, 10, 16, 16);
	}
}

function iniciarJogo() {
	jogoIniciado = true;
	pausado = false;
	gameOver = false;
	score = 0;
	fenceX = 640;
	y = 152;
	vy = 0;
	noChao = true;
	frameAtual = 0;
	contagem = 0;
	loopAtivo = true;
	loop();
}

function reiniciarJogo() {
    fenceX = 640;
    y = 152;
    vy = 0;
    noChao = true;
    contagem = 0;
    frameAtual = 0;
	score = 0;
}

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	desenharFundo();
	desenharVaquinha();
	desenharCerca();
	desenharScore();
	desenharBotoes();

	if (!jogoIniciado && !gameOver) {
		// Tela inicial
		ctx.drawImage(startButton, 270, 120, 72, 32);
		requestAnimationFrame(loop);
		return;
	}

	if (gameOver) {
		// Tela de Game Over com score
		ctx.drawImage(gameOverImg, 270, 60, 72, 72);
		const scoreStr = Math.floor(score).toString();
		const numeroLargura = 16;
		const numeroAltura = 16;
		const espacamento = 1;
		let offsetX = 295;
		for (let i = 0; i < scoreStr.length; i++) {
			const num = parseInt(scoreStr[i]);
			ctx.drawImage(numeros[num], offsetX, 110, numeroLargura, numeroAltura);
			offsetX += numeroLargura + espacamento;
		}
		requestAnimationFrame(loop);
		return;
	}

	if (pausado) {
		// Pausado: desenha tudo mas não atualiza
		requestAnimationFrame(loop);
		return;
	}

	if (jogoIniciado && !pausado && !gameOver) {
		vy += gravidade;
		y += vy;
		if (y >= 152) {
			y = 152;
			vy = 0;
			noChao = true;
		}

		fenceX -= fenceSpeed;
		if (fenceX < -fenceWidth) {
			fenceX = canvas.width + Math.random() * 200 + 100;
			score++;
		}
	}

	// Colisão
	const vacaW = frameLargura;
	const vacaH = frameAltura;
	const vacaX = 50;
	const hitboxWidth = fenceWidth - 4;
	const hitboxHeight = fenceHeight - 4;

	if (
		fenceX + 2 < vacaX + vacaW &&
		fenceX + hitboxWidth > vacaX &&
		fenceY + 2 < y + vacaH &&
		fenceY + hitboxHeight > y
	) {
		jogoIniciado = false;
		gameOver = true;
	}

	requestAnimationFrame(loop);
}

// Espera carregar todas imagens antes de iniciar o loop
let imagensCarregadas = 0;

function verificarCarregamento() {
	imagensCarregadas++;
	if (imagensCarregadas >= TOTAL_IMAGENS) {
		loop(); // Inicia o loop em estado parado
	}
}


ceu.onload = verificarCarregamento;
grama.onload = verificarCarregamento;
vaca.onload = verificarCarregamento;
cerca.onload = verificarCarregamento;
scoreLabel.onload = verificarCarregamento;

for (let i = 0; i <= 9; i++) {
	numeros[i].onload = verificarCarregamento;
}
