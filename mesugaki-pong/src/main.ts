import { inject } from "@vercel/analytics";

import "./style.css";

inject({ mode: import.meta.env.PROD ? "production" : "development" });

import releaseManifest from "../../.release-please-manifest.json";

const appVersionString = (releaseManifest as Record<string, string>)[
	"mesugaki-pong"
];
if (!appVersionString) {
	const errorMsg =
		"Missing configuration for 'mesugaki-pong' in .release-please-manifest.json";
	console.error(errorMsg);
	throw new Error(errorMsg);
}
import characterImg from "./assets/character.png";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
// biome-ignore lint/style/noNonNullAssertion: canvas.getContext("2d") は常に存在する前提
const ctx = canvas.getContext("2d")!;
const gameContainer = document.getElementById(
	"game-container",
) as HTMLDivElement;
const annoyingMessage = document.getElementById(
	"annoying-message",
) as HTMLDivElement;
const uiLayer = document.getElementById("ui-layer") as HTMLDivElement;
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const appFooter = document.querySelector(".app-footer") as HTMLElement;

let score = 0;
let isGameOver = false;
let isGameStarted = false;
let lastPhrase = "";
let messageTimeoutId: number | null = null;

// スコアしきい値の定数化
const SCORE_THRESHOLD_ENCOURAGING = 3;
const SCORE_THRESHOLD_CHALLENGING = 7;

// メッセージ・表示関連の定数
const MESSAGE_BASE_SCALE = 0.7;
const MESSAGE_RANDOM_SCALE_RANGE = 0.5;
const MESSAGE_DISPLAY_DURATION = 1200;
const GAME_OVER_FONT_SIZE = 60;
const BALL_INITIAL_SPEED = 7.071; // 5 * sqrt(2) に近い値
const BALL_SPEED_INCREMENT = 0.2;

const paddle = {
	width: 100,
	height: 15,
	x: canvas.width / 2 - 50,
	y: canvas.height - 30,
};

const initialSpeed = BALL_INITIAL_SPEED + score * BALL_SPEED_INCREMENT;
const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 10,
	speed: initialSpeed,
	dx: initialSpeed / Math.sqrt(2),
	dy: -initialSpeed / Math.sqrt(2),
};

let currentRotation = 0;
let currentScale = 1;
let currentMessageScale = 1; // メッセージのスケールを保持（水平維持の計算で使用）
let isSpinning = false;
let hasRotated30 = false;
let spinTimeoutId: number | null = null;

function applyTransform() {
	gameContainer.style.transform = `scale(${currentScale}) rotate(${currentRotation}deg)`;
	// コンテナが回転・スピンする際にメッセージも逆回転させて水平を保つ
	updateMessageTransform();
}

function updateMessageTransform() {
	if (annoyingMessage.style.opacity === "1") {
		// コンテナが持っている回転(currentRotation)を逆回転(-currentRotation)させて打ち消す
		annoyingMessage.style.transform = `translate(-50%, -50%) scale(${currentMessageScale}) rotate(${-currentRotation}deg)`;
	}
}

function updateScale() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	// 800x600の対角線は1000なので、回転しても見切れないように1000を基準にする
	const targetWidth = 1000;
	const targetHeight = 1000;

	// 画面に収まるようにスケールを計算（マージンを考慮）
	const scaleW = (width - 40) / targetWidth;
	const scaleH = (height - 140) / targetHeight; // フッターやヘッダーの分を考慮
	currentScale = Math.max(0.15, Math.min(1, scaleW, scaleH));

	applyTransform();
}

window.addEventListener("resize", updateScale);
updateScale();

const phrasesByStage = {
	encouraging: [
		"がんばれっがんばれっ！あたしが見ててあげるから♡",
		"ほらほら、もうちょっとじゃん！やれるやれる～！",
		"おにーさんならできるって信じてあげてるんだからねっ！",
		"すっご～い！あたしが応援してあげたおかげだね♡",
		"ないちゃダメだよ？あたしがついてるでしょ～！",
		"えらいえらい♡よしよししてあげよっか？",
		"へぇ～ちゃんとやれるんじゃん！その調子その調子っ♡",
		"あたしの応援パワー受け取ってよねっ！ぜったい負けんな！",
		"ほらっ、下向いてないで？あたしの顔見て？大丈夫だから♡",
		"最後まであきらめないの！あたしが見届けてあげるっ♡",
	],
	challenging: [
		"ふ～ん？ほんとにできるのかな～？見せてみてよ♡",
		"へぇ～？口だけじゃないとこ、証明してみせてよ？",
		"おにーさんってさぁ、あたしに勝てると思ってる？ねぇ？",
		"ふぅん、やるじゃん？……まぁあたしの方がすごいけど♡",
		"それで本気のつもり？もっと本気出してよ、つまんないな～",
		"あっそ～？じゃあ実力見せてみなよ。待っててあげる♡",
		"え、もう限界なの？あたしまだ全然余裕なんだけど～？",
		"かかってきなよ♡ ……怖いの？しょうがないな～",
		"あたしに追いつけると思ってんの？面白いこと言うね♡",
		"ねぇねぇ、もしかして手加減してる？してないの？……え、マジ？",
	],
	mocking: [
		"だっさ～ｗｗ あたしの方がうまくできちゃうけど？",
		"え～っｗ それで全力なのぉ？うっそだぁ～ｗｗｗ",
		"よわっ♡ よわっ♡ おにーさんよわすぎ～♡♡♡",
		"ぷっくくく……ごめんね？笑うつもりなかったんだけどｗｗ",
		"み～じめ♡ み～じめ♡ 泣いちゃう？泣いていいよ？ｗ",
		"あたしに敵うと思った？その自信どっから来るのｗｗ",
		"は？もう終わり？はっや～ｗｗ ざぁ～こ♡",
		"なんかかわいそうになってきちゃった♡ なぐさめてほしい？ん～？ｗ",
		"おにーさんって何やってもダメダメじゃ～ん♡ わからせてあげよっか？ｗ",
		"えっ、まだやるの？負けるの見るのもう飽きちゃったんだけど～ｗ",
		"おにーさんってほんっとにセンスないよね♡ 生まれつき？ｗ",
		"ねぇ今どんな気持ち？ねぇねぇどんな気持ち～？♡ｗｗ",
		"ぎゃはっｗｗ 想像以上にひどくて逆にすごいんだけど～♡",
		"あたしに勝とうなんて１００万年はやいんだよ♡ ざぁ～こ♡",
		"もしかしてそれ……本気でやってるの？えっ……うそでしょｗｗｗ",
		"よわよわパンチｗ そよ風の方がまだ強いかも～♡",
		"顔真っ赤じゃ～ん♡ 悔しい？くやしいの？ねぇ～♡♡",
		"おにーさんの努力ってさぁ、なんか報われないタイプだよね♡ ぷぷっ",
		"降参しなよ～♡ あたしの靴ぺろぺろしたら許してあげてもいいよ？ｗ",
		"あ～あ、つまんな♡ もうちょっと楽しませてくれると思ったのにな～",
		"ねぇ聞いていい？生きてて恥ずかしくないの？ｗｗ ……うそうそ♡",
		"雑魚すぎて逆にかわい～♡ ぺットにしてあげよっか？ｗ",
		"ぴえん♡ ……ってあたしが泣くわけないじゃ～ん♡ 泣くのはそっちでしょｗ",
		"記録更新だね♡ 最速で負けた記録♡♡ おめでと～ｗｗ",
		"はいはい、がんばったがんばった♡ ……で、それが精一杯？ｗ",
		"もぉ～見てらんないっ♡ 恥ずかしいのこっちなんだけど～ｗ",
		"おにーさんさぁ、あたしの前でイキるのやめた方がいいよ？傷つくのそっちだから♡",
		"ゴミみたいなスコアで草ｗｗ あっ、ゴミに失礼だったかも～♡",
		"土下座したら再戦のチャンスくらいあげてもいいけど？……嘘♡ 何回やっても同じだよ♡ｗ",
	],
};

function drawPaddle() {
	ctx.fillStyle = "#fff";
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = "#ff4444";
	ctx.fill();
	ctx.closePath();
}

function drawScore() {
	ctx.textAlign = "left";
	ctx.font = "24px Orbitron, sans-serif";
	ctx.fillStyle = "#fff";
	ctx.fillText(`Score: ${score}`, 20, 40);
}

function showAnnoyingMessage() {
	let phrases: string[];
	if (score <= SCORE_THRESHOLD_ENCOURAGING) {
		phrases = phrasesByStage.encouraging;
	} else if (score <= SCORE_THRESHOLD_CHALLENGING) {
		phrases = phrasesByStage.challenging;
	} else {
		phrases = phrasesByStage.mocking;
	}

	let availablePhrases = phrases.filter((p) => p !== lastPhrase);
	if (availablePhrases.length === 0) availablePhrases = phrases;
	const phrase =
		availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
	lastPhrase = phrase;
	annoyingMessage.replaceChildren();
	const group = document.createElement("div");
	group.className = "message-group";
	const img = document.createElement("img");
	img.src = characterImg;
	img.className = "character-img";
	img.alt = "character";
	const span = document.createElement("span");
	span.className = "message-text";
	span.textContent = phrase;
	group.appendChild(img);
	group.appendChild(span);
	annoyingMessage.appendChild(group);
	annoyingMessage.style.opacity = "1";

	// まずランダムなスケールを仮設定
	currentMessageScale =
		MESSAGE_BASE_SCALE + Math.random() * MESSAGE_RANDOM_SCALE_RANGE;

	// DOM要素の実際の幅を取得し、ウィンドウ幅(40pxの余裕)を超えれば縮小する
	const actualWidth =
		annoyingMessage.offsetWidth * currentMessageScale * currentScale;
	const maxWidth = window.innerWidth - 40;
	if (actualWidth > maxWidth && actualWidth > 0) {
		currentMessageScale = currentMessageScale * (maxWidth / actualWidth);
	}

	updateMessageTransform();

	if (messageTimeoutId) {
		clearTimeout(messageTimeoutId);
	}

	messageTimeoutId = setTimeout(() => {
		annoyingMessage.style.opacity = "0";
		messageTimeoutId = null;
	}, MESSAGE_DISPLAY_DURATION);
}

function applyCrazyGimmick() {
	// ボールのサイズ変化
	if (score >= 20) {
		ball.radius = 5;
	} else {
		ball.radius = 10;
	}

	if (isSpinning) return;

	if (score === 30 && !hasRotated30) {
		hasRotated30 = true;
		isSpinning = true;
		gameContainer.style.transition = "transform 0.9s ease-in-out";
		currentRotation += 720;
		applyTransform();

		spinTimeoutId = window.setTimeout(() => {
			gameContainer.style.transition = "";
			isSpinning = false;
			spinTimeoutId = null;
		}, 900);
		return;
	}

	let targetRotation = 0;
	if (score <= SCORE_THRESHOLD_ENCOURAGING) {
		// スコア初期段階（応援モード）
		targetRotation = 0;
	} else if (score <= SCORE_THRESHOLD_CHALLENGING) {
		// スコア中間段階（挑発モード）
		targetRotation = (Math.random() - 0.5) * 20;
	} else if (score < 30) {
		// スコア後半段階（煽りモード前半）
		targetRotation = (Math.random() - 0.5) * 90;
	} else {
		// スコア30〜: 左右75度（±75度） + 二回転分の720度
		targetRotation = 720 + (Math.random() - 0.5) * 150;
	}

	currentRotation = targetRotation;
	applyTransform();
}

function resetGame() {
	isGameOver = false;
	score = 0;
	const currentSpeed = BALL_INITIAL_SPEED + score * BALL_SPEED_INCREMENT;
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.speed = currentSpeed;
	ball.dx = currentSpeed / Math.sqrt(2);
	ball.dy = -currentSpeed / Math.sqrt(2);
	ball.radius = 10;
	currentRotation = 0;
	isSpinning = false;
	hasRotated30 = false;
	if (spinTimeoutId) {
		window.clearTimeout(spinTimeoutId);
		spinTimeoutId = null;
	}
	gameContainer.style.transition = "";
	applyTransform();
	canvas.style.cursor = "none";
	annoyingMessage.style.opacity = "0"; // メッセージを隠す
	currentMessageScale = 1; // リセット
	appFooter?.classList.add("hidden");
	lastPhrase = "";

	// 再開時にPointer Lockを要求
	if (document.pointerLockElement !== canvas) {
		canvas.requestPointerLock();
	}
}

function update() {
	if (!isGameStarted || isGameOver) return;

	// Move paddle based on mouse
	// Mouse tracking is handled in an event listener, so paddle.x is updated there.

	// Move ball
	ball.x += ball.dx;
	ball.y += ball.dy;

	// Wall collision (left/right)
	if (ball.x + ball.radius > canvas.width && ball.dx > 0) {
		ball.dx *= -1;
		ball.x = canvas.width - ball.radius;
	} else if (ball.x - ball.radius < 0 && ball.dx < 0) {
		ball.dx *= -1;
		ball.x = ball.radius;
	}

	// Wall collision (top)
	if (ball.y - ball.radius < 0 && ball.dy < 0) {
		ball.dy *= -1;
		ball.y = ball.radius;
	}

	// Paddle collision
	if (
		ball.y + ball.radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y + paddle.height &&
		ball.x >= paddle.x &&
		ball.x <= paddle.x + paddle.width
	) {
		// Avoid double collision
		if (ball.dy > 0) {
			ball.dy *= -1;

			// 角度を維持したまま、新しいスコアに基づくスピードで速度を更新
			score++;
			const currentSpeed = BALL_INITIAL_SPEED + score * BALL_SPEED_INCREMENT;
			ball.speed = currentSpeed;

			// 打ち返し位置によるDXの変化（既存ロジック）
			const hitPoint = ball.x - (paddle.x + paddle.width / 2);
			const newDx = hitPoint * 0.15;

			// 新しい速度ベクトルを計算
			const angle = Math.atan2(ball.dy, newDx);
			ball.dx = Math.cos(angle) * ball.speed;
			ball.dy = Math.sin(angle) * ball.speed;

			applyCrazyGimmick();
			showAnnoyingMessage(); // パドルで打ち返した時に100%表示
		}
	}

	// Bottom collision (Game Over)
	if (ball.y + ball.radius > canvas.height) {
		isGameOver = true;
		canvas.style.cursor = "default";
		if (document.pointerLockElement === canvas) {
			document.exitPointerLock();
		}

		// ゲームオーバー処理の冒頭でメッセージ消去タイマーをクリア
		if (messageTimeoutId) {
			clearTimeout(messageTimeoutId);
			messageTimeoutId = null;
		}

		// ゲームオーバー時にも動的メッセージを表示
		const phrase = "ざぁ～こざぁ～こ♡ よわよわのよわ～♡♡";
		annoyingMessage.replaceChildren();
		const group = document.createElement("div");
		group.className = "message-group";
		const img = document.createElement("img");
		img.src = characterImg;
		img.className = "character-img";
		img.alt = "character";
		const span = document.createElement("span");
		span.className = "message-text";
		span.style.fontSize = `${GAME_OVER_FONT_SIZE}px`;
		span.textContent = phrase;
		group.appendChild(img);
		group.appendChild(span);

		const restartGroup = document.createElement("div");
		restartGroup.className = "restart-group";
		const restartBtn = document.createElement("button");
		restartBtn.className = "restart-hint";
		restartBtn.textContent = "RESTART";
		restartBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			resetGame();
		});
		restartGroup.appendChild(restartBtn);

		annoyingMessage.appendChild(group);
		annoyingMessage.appendChild(restartGroup);
		annoyingMessage.style.opacity = "1";

		// 描画後にはみ出し判定を行う
		currentMessageScale = 1.0;
		const actualWidth =
			annoyingMessage.offsetWidth * currentMessageScale * currentScale;
		const maxWidth = window.innerWidth - 40;
		if (actualWidth > maxWidth && actualWidth > 0) {
			currentMessageScale = maxWidth / actualWidth;
		}

		updateMessageTransform();
		appFooter?.classList.remove("hidden");
		// ゲームオーバー時は自動で消さない
	}
}

function draw() {
	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawPaddle();
	drawBall();
	drawScore();

	// Canvas上での描画は廃止（HTMLレイヤーに統一）
}

let lastTime = 0;
const TIMESTEP = 1000 / 60;
let accumulator = 0;

function loop(timestamp: number) {
	if (lastTime === 0) {
		lastTime = timestamp;
	}
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;

	if (deltaTime > 250) {
		deltaTime = 250;
	}

	accumulator += deltaTime;

	while (accumulator >= TIMESTEP) {
		update();
		accumulator -= TIMESTEP;
	}

	draw();
	requestAnimationFrame(loop);
}

// Event Listeners
startBtn.addEventListener("click", () => {
	isGameStarted = true;
	uiLayer.classList.add("hidden");
	appFooter?.classList.add("hidden");
	canvas.style.cursor = "none";
	if (document.pointerLockElement !== canvas) {
		canvas.requestPointerLock();
	}
});

canvas.addEventListener("mousemove", (e) => {
	if (!isGameStarted) return;

	if (document.pointerLockElement === canvas) {
		// プレイ中はPointer Lockの移動量(movementX)を使う
		paddle.x += e.movementX / currentScale;
	} else {
		const rect = canvas.getBoundingClientRect();
		const rootX = e.clientX - rect.left;
		paddle.x = rootX / currentScale - paddle.width / 2;
	}

	// Boundary check
	if (paddle.x < 0) paddle.x = 0;
	if (paddle.x + paddle.width > canvas.width)
		paddle.x = canvas.width - paddle.width;
});

// リスタートボタン以外のクリックでリスタートしないように window へのイベントリスナーを削除

// Start game
requestAnimationFrame(loop);

// Version display
const appVersion = document.getElementById("app-version");
if (appVersion) {
	appVersion.textContent = `v${appVersionString}`;
}
