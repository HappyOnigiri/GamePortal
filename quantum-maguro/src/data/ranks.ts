import type { RankDef } from "../types";

export const RANKS: RankDef[] = [
	// ===== 神域 (25000+) =====
	{
		minScore: 30000,
		name: {
			ja: "森羅万象を握る者",
			en: "The Weaver of All Things",
		},
		emoji: "🌌",
		taisho: {
			ja: [
				"あんた…本当に人間かい？",
				"俺の人生で、こんな光景は初めてだ",
				"店ごとあんたに預けるよ",
				"握り寿司の歴史が、今変わったよ",
				"全国の大将に号外を出したい気分だ",
				"あんたの前では、俺も客だよ",
				"言葉が出ないよ…ただただ、圧巻だ",
			],
			en: [
				"Are you... really human?",
				"I've never seen anything like this in my life.",
				"I'll leave the whole shop to you.",
				"The history of sushi just changed.",
				"I feel like announcing this to every sushi chef in the country.",
				"In front of you, I'm just a customer.",
				"Words fail me... It's just spectacular.",
			],
		},
	},
	{
		minScore: 28000,
		name: {
			ja: "時空を超えし寿司神",
			en: "Sushi God Surpassing Spacetime",
		},
		emoji: "🪐",
		taisho: {
			ja: [
				"宇宙の真理が寿司の形をしていたよ",
				"次元が違うってのは、こういうことか",
				"ネタが自ら正座して待ってるぜ",
				"もはや寿司があんたに握られたがっている",
				"40年の修行が霞んで見えるよ",
				"今すぐ弟子入りさせてくれ…本気だよ",
			],
			en: [
				"The truth of the universe took the form of sushi.",
				"So this is what it means to be on another level.",
				"The ingredients are sitting respectfully waiting for you.",
				"Sushi itself is begging you to make it now.",
				"My 40 years of training seem like nothing.",
				"Let me be your apprentice... I mean it.",
			],
		},
	},
	{
		minScore: 26000,
		name: {
			ja: "寿司の概念そのもの",
			en: "The Concept of Sushi Itself",
		},
		emoji: "🔮",
		taisho: {
			ja: [
				"カウンターからシャリの香りがしたよ",
				"お前さんが立つだけで、店の格が上がるな",
				"もう引退するよ…後は頼んだ",
				"神様が嫉妬してるだろうな",
				"全身の鳥肌が止まらないよ",
				"あんたの存在そのものが寿司だ",
			],
			en: [
				"I smelled sushi rice from across the counter.",
				"Just you standing there elevates the status of this shop.",
				"I'm retiring... I leave the rest to you.",
				"The gods must be jealous.",
				"My goosebumps won't stop.",
				"Your very existence is sushi.",
			],
		},
	},
	{
		minScore: 25000,
		name: {
			ja: "全知全能の寿司王",
			en: "Omnipotent Sushi King",
		},
		emoji: "👑",
		taisho: {
			ja: [
				"歴代の大将が全員立ち上がって拍手してるよ",
				"伝説ってのはこうやって生まれるんだな",
				"無形文化遺産に登録すべきだ",
				"暖簾をお前さんに譲るよ、受け取ってくれ",
				"教えることは何もない…いや、最初からなかったか",
				"光の握りを見た…もう思い残すことはないよ",
			],
			en: [
				"All past sushi chefs are standing and applauding.",
				"This is how legends are born.",
				"This should be an intangible cultural heritage.",
				"I'll give you my shop curtain, take it.",
				"I have nothing to teach you... Actually, I never did.",
				"I saw hands of light... I have no regrets left.",
			],
		},
	},
	// ===== 超越領域 (20000-25000) =====
	{
		minScore: 23000,
		name: {
			ja: "超越寿司マエストロ",
			en: "Transcendent Sushi Maestro",
		},
		emoji: "✨",
		taisho: {
			ja: [
				"マグロもエビも、あんたの前じゃ緊張するだろうな",
				"天才って言葉じゃ足りない…怪物だよ",
				"寿司の歴史にあんたの名を刻んだよ",
				"うちの看板、書き換えなきゃな",
				"怖いくらいだよ…いい意味でな",
				"生きてるうちにこんな握りを見られるとはね",
			],
			en: [
				"Even tuna and shrimp must be nervous in front of you.",
				"Genius isn't enough to describe you... You're a monster.",
				"You've carved your name into the history of sushi.",
				"I might have to change the shop's sign.",
				"It's almost scary... in a good way.",
				"To think I'd get to see such sushi-making in my lifetime.",
			],
		},
	},
	{
		minScore: 21000,
		name: {
			ja: "永遠の寿司大帝",
			en: "Eternal Sushi Emperor",
		},
		emoji: "🏛️",
		taisho: {
			ja: [
				"百年に一人の逸材とは、あんたのことだ",
				"寿司の神殿があったら、あんたが主だ",
				"もう一度見せてくれ…夢じゃないよな？",
				"拍手が止まらないよ",
				"あんたがいれば、この店は永遠だ",
				"涙が出そうだよ…美しかった",
			],
			en: [
				"A prodigy born once in a century... that's you.",
				"If there were a sushi temple, you'd be its master.",
				"Show me one more time... It wasn't a dream, right?",
				"I can't stop clapping.",
				"With you here, this shop is eternal.",
				"I almost cried... It was beautiful.",
			],
		},
	},
	{
		minScore: 20000,
		name: {
			ja: "万象の寿司帝王",
			en: "Imperial Sushi Ruler",
		},
		emoji: "🎌",
		taisho: {
			ja: [
				"帝王の風格が漂ってるよ",
				"見ていて震えたよ、凄すぎる",
				"あんたの握りは、もう別の次元だ",
				"俺がカウンターの向こうに行くべきだな",
				"胸を張りな、あんたは本物だ",
				"今夜は最高の酒を開けよう",
			],
			en: [
				"You exude the aura of an emperor.",
				"I was shaking watching you. Incredible.",
				"Your sushi-making is in another dimension.",
				"I should be the one sitting on the other side of the counter.",
				"Be proud, you are the real deal.",
				"Let's open our best sake tonight.",
			],
		},
	},
	// ===== 達人領域 (15000-20000) =====
	{
		minScore: 18000,
		name: {
			ja: "銀河級寿司職人",
			en: "Galactic Sushi Chef",
		},
		emoji: "🌠",
		taisho: {
			ja: [
				"星の数ほど客を見てきたが、あんたが一番だ",
				"指に羽が生えてるんじゃないか？",
				"開店以来の衝撃だよ",
				"銀河を握れるとしたら、あんただけだ",
				"言葉を失ったよ…素晴らしい",
				"あんたのためなら、特注のネタを仕入れるよ",
			],
			en: [
				"I've met countless customers, but you're the best.",
				"Do your fingers have wings?",
				"The greatest shock since we opened.",
				"If anyone could shape a galaxy, it'd be you.",
				"I've lost my words... Fantastic.",
				"For you, I'll order special ingredients.",
			],
		},
	},
	{
		minScore: 16500,
		name: {
			ja: "不動の寿司皇帝",
			en: "Unmoved Sushi Overlord",
		},
		emoji: "🐉",
		taisho: {
			ja: [
				"龍が目を覚ましたな",
				"その指さばき、もはや武術だよ",
				"一番弟子より上だよ、参ったね",
				"カウンター越しに風を感じたよ",
				"文句なしの一流だ",
				"皇帝の名に恥じない見事さだ",
			],
			en: [
				"The dragon has awakened.",
				"Your finger movements are basically martial arts.",
				"You're better than my top apprentice, I surrender.",
				"I felt a breeze from across the counter.",
				"Undoubtedly first class.",
				"A magnificence worthy of the overlord title.",
			],
		},
	},
	{
		minScore: 15000,
		name: {
			ja: "疾風の寿司将軍",
			en: "Gale Sushi Shogun",
		},
		emoji: "🌪️",
		taisho: {
			ja: [
				"疾風怒濤だったな…圧巻だよ",
				"将軍の名にふさわしい堂々たる構えだ",
				"嵐のような迫力だった",
				"まだ伸びる…末恐ろしいよ",
				"あんたが来ると店が活気づくねえ",
				"鳥肌が立ったよ、本当にすごい",
			],
			en: [
				"That was a storm of speed... a masterpiece.",
				"A majestic stance worthy of a Shogun.",
				"A storm-like intensity.",
				"You still have room to grow... terrifying.",
				"The shop comes alive when you're here.",
				"I got goosebumps, truly amazing.",
			],
		},
	},
	// ===== 上級領域 (10000-15000) =====
	{
		minScore: 13000,
		name: {
			ja: "覚醒せし寿司仙人",
			en: "Awakened Sushi Hermit",
		},
		emoji: "🧙",
		taisho: {
			ja: [
				"仙人の域に達したな…見事だ",
				"集中力が修行僧も顔負けだよ",
				"指先に宿る魂を感じたよ",
				"前世は寿司職人だったんじゃないか？",
				"悟りの境地ってやつだな",
				"あんたの握り、惚れ惚れするよ",
			],
			en: [
				"You've reached the realm of hermits... well done.",
				"Concentration that puts ascetics to shame.",
				"I felt the soul dwelling in your fingertips.",
				"Were you a sushi chef in a past life?",
				"This must be enlightenment.",
				"I'm captivated by your technique.",
			],
		},
	},
	{
		minScore: 11500,
		name: {
			ja: "紅蓮の寿司剣豪",
			en: "Crimson Sushi Swordsman",
		},
		emoji: "⚔️",
		taisho: {
			ja: [
				"一刀両断の如き鮮やかさだった",
				"切れ味がうちの柳刃より鋭いよ",
				"剣豪の名にふさわしい指さばきだ",
				"燃えるような闘志を感じたよ",
				"気迫が違うね、さすがだよ",
				"お前さん、真剣勝負してたな",
			],
			en: [
				"As split-second precise as a single sword strike.",
				"Sharper than my chef's knife.",
				"Fingerwork befitting a master swordsman.",
				"I felt your burning fighting spirit.",
				"Your intensity is on another level.",
				"You were really fighting a serious bout out there.",
			],
		},
	},
	{
		minScore: 10000,
		name: {
			ja: "蒼天の寿司武将",
			en: "Azure Sushi Warlord",
		},
		emoji: "🏯",
		taisho: {
			ja: [
				"天下統一も夢じゃないな",
				"武将の風格が出てきたよ",
				"堂々とした構えだった",
				"この調子なら、まだまだ上を目指せるぞ",
				"あんたの旗を掲げたくなったよ",
				"戦場に立つ侍のような迫力だったね",
			],
			en: [
				"Unifying the country isn't just a dream for you.",
				"You're showing the aura of a warlord.",
				"A very imposing stance.",
				"Keep this up and you can go even higher.",
				"Makes me want to raise your flag.",
				"You have the intensity of a samurai on the battlefield.",
			],
		},
	},
	// ===== 中上級領域 (6000-10000) =====
	{
		minScore: 8500,
		name: {
			ja: "炎の寿司マスター",
			en: "Flame Sushi Master",
		},
		emoji: "🔥",
		taisho: {
			ja: [
				"熱い！指先、燃えてるんじゃないか？",
				"情熱が握りに乗り移ってるよ",
				"炎のように止まらなかったな",
				"うちの若い衆に見せてやりたいよ",
				"その熱量、大事にしてくれよ",
				"カウンターの温度が上がったよ",
			],
			en: [
				"Hot! Are your fingertips on fire?",
				"Your passion transferred into those keystrokes.",
				"You were burning up out there.",
				"I'd love to show our young guys your technique.",
				"Keep that heat alive.",
				"The temperature at the counter just went up.",
			],
		},
	},
	{
		minScore: 7000,
		name: {
			ja: "閃光の寿司名人",
			en: "Flash Sushi Pro",
		},
		emoji: "⚡",
		taisho: {
			ja: [
				"閃光のごとき鮮やかさだった！",
				"名人の称号がよく似合うよ",
				"反射神経、素晴らしいね",
				"目が追いつかなかったよ",
				"ピカッと光る才能を見たね",
				"あんたは選ばれし側の人間だよ",
			],
			en: [
				"Brilliant like a flash of lightning!",
				"The 'Pro' title suits you perfectly.",
				"Excellent reflexes.",
				"My eyes couldn't keep up.",
				"I saw your talent spark just now.",
				"You belong to the chosen ones.",
			],
		},
	},
	{
		minScore: 6000,
		name: {
			ja: "黄金の寿司アーティスト",
			en: "Golden Sushi Artist",
		},
		emoji: "🎨",
		taisho: {
			ja: [
				"芸術的だったよ",
				"指先で寿司を描いているようだった",
				"黄金に輝く腕前だね",
				"創造力と実力を兼ね備えているな",
				"その才能、大切に磨いてくれよ",
				"美しかったよ、お前さんの握りは",
			],
			en: [
				"It was artistic.",
				"Like you were painting sushi with your fingers.",
				"Golden shiny skills.",
				"You possess both creativity and true ability.",
				"Polish that talent well.",
				"It was a beautiful performance.",
			],
		},
	},
	// ===== 中級領域 (3000-6000) =====
	{
		minScore: 5000,
		name: {
			ja: "熟練寿司クリエイター",
			en: "Veteran Sushi Creator",
		},
		emoji: "🎭",
		taisho: {
			ja: [
				"いい感じに仕上がってきたな",
				"もう熟練の域だよ",
				"安定感が出てきたね、頼もしいよ",
				"指が覚えてきてるな",
				"個性が光ってるよ",
				"あんたの握り、好きだよ",
			],
			en: [
				"You're shaping up nicely.",
				"You've already reached veteran status.",
				"You're getting more stable, it's reassuring.",
				"Your fingers are remembering the keys.",
				"Your unique style shines.",
				"I really like your work.",
			],
		},
	},
	{
		minScore: 4000,
		name: {
			ja: "一流寿司パフォーマー",
			en: "First-Class Sushi Performer",
		},
		emoji: "🎪",
		taisho: {
			ja: [
				"一流の仲間入りだ、胸を張りな",
				"見ていて気持ちのいい仕事だった",
				"リズム感が素晴らしいね",
				"成長っぷり、楽しみにしてるよ",
				"華やかさが出てきたね",
				"お客さんが喜ぶ握りだよ",
			],
			en: [
				"You are now first-class. Be proud.",
				"Your work was satisfying to watch.",
				"Incredible sense of rhythm.",
				"Looking forward to seeing your growth.",
				"You've developed some real flair.",
				"Work that makes the customers happy.",
			],
		},
	},
	{
		minScore: 3000,
		name: {
			ja: "凄腕寿司テクニシャン",
			en: "Skilled Sushi Technician",
		},
		emoji: "🔧",
		taisho: {
			ja: [
				"テクニックが光ってたよ",
				"着実に腕を上げてるな",
				"丁寧かつ力強い仕事だったね",
				"職人気質を感じるよ",
				"正確さが際立ってたよ",
				"あんたなら、もっと上にいけるよ",
			],
			en: [
				"Your technique was shining brightly.",
				"You're steadily improving.",
				"A very careful yet powerful job.",
				"I sense an artisan spirit in you.",
				"Your accuracy was remarkable.",
				"You can definitely aim higher.",
			],
		},
	},
	// ===== 初中級領域 (1500-3000) =====
	{
		minScore: 2500,
		name: {
			ja: "寿司道三段",
			en: "Sushi-Do 3rd Dan",
		},
		emoji: "🥋",
		taisho: {
			ja: [
				"堂々とした構えだったよ",
				"確実に上達しているのが分かるね",
				"基礎が固まってきたな",
				"ここから一気に伸びるぞ、楽しみだ",
				"修行の成果が出てるよ",
				"いい顔してるよ、お前さん",
			],
			en: [
				"A dignified stance.",
				"I can tell you're improving for sure.",
				"Your fundamentals are getting solidified.",
				"You'll grow rapidly from here, looking forward to it.",
				"The fruits of your training are showing.",
				"You have a good look on your face.",
			],
		},
	},
	{
		minScore: 2000,
		name: {
			ja: "寿司道二段",
			en: "Sushi-Do 2nd Dan",
		},
		emoji: "🎋",
		taisho: {
			ja: [
				"よく頑張ったな",
				"指が少しずつ覚えてきてるね",
				"いいリズムだった、この感覚を忘れるなよ",
				"着実に成長しているよ",
				"なかなかの根性だ、見直したよ",
				"この調子で精進してくれ",
			],
			en: [
				"You did really well.",
				"Your fingers are learning bit by bit.",
				"Nice rhythm, don't forget this feeling.",
				"Steady growth.",
				"You've got some guts, I am impressed.",
				"Keep devoting yourself.",
			],
		},
	},
	{
		minScore: 1500,
		name: {
			ja: "寿司道初段",
			en: "Sushi-Do 1st Dan",
		},
		emoji: "🎍",
		taisho: {
			ja: [
				"ここからが本番だ、楽しんでいこう",
				"立派なもんだよ",
				"寿司の道に足を踏み入れたな",
				"まだまだ伸びしろがあるぞ",
				"悪くない、悪くないよ",
				"一人前の入り口に立ったな",
			],
			en: [
				"This is where the real fun starts.",
				"Very respectable.",
				"You've finally stepped onto the path of Sushi.",
				"Plenty of room for improvement.",
				"Not bad, not bad at all.",
				"You're at the entrance to becoming a pro.",
			],
		},
	},
	// ===== 初級領域 (700-1500) =====
	{
		minScore: 1200,
		name: {
			ja: "寿司チャレンジャー",
			en: "Sushi Challenger",
		},
		emoji: "💪",
		taisho: {
			ja: [
				"挑戦する姿勢がいいね！",
				"いい感じに波に乗ってきたよ",
				"もう少しで何かが掴めるぞ",
				"粘り強さを感じたよ",
				"ここが踏ん張りどころだ、頑張れ",
				"次がもっと楽しくなるぞ",
			],
			en: [
				"Love your challenging attitude!",
				"You're riding the wave pretty nicely.",
				"You're just about to grasp something.",
				"I felt your tenacity.",
				"This is the crucial moment, do your best.",
				"Next round will be even more fun.",
			],
		},
	},
	{
		minScore: 1000,
		name: {
			ja: "寿司アドベンチャラー",
			en: "Sushi Adventurer",
		},
		emoji: "🗺️",
		taisho: {
			ja: [
				"冒険はまだ始まったばかりだ",
				"いい旅をしてるね、先は長いぞ",
				"一歩一歩、着実に進んでるよ",
				"好奇心旺盛でいいね",
				"この経験は無駄にならないよ",
				"まだ見ぬ寿司の世界が待ってるぞ",
			],
			en: [
				"The adventure has just begun.",
				"A good journey, but it's a long road ahead.",
				"Step by step, you're making steady progress.",
				"Nice curiosity.",
				"This experience won't be in vain.",
				"Unseen worlds of sushi await you.",
			],
		},
	},
	{
		minScore: 800,
		name: {
			ja: "寿司ルーキー★★",
			en: "Sushi Rookie ★★",
		},
		emoji: "⭐⭐",
		taisho: {
			ja: [
				"星二つ！確実に成長してるよ",
				"ルーキーとしては上出来だ",
				"コツを掴み始めてるね",
				"もう少し練習すれば化けるぞ",
				"いい目をしてるよ、お前さん",
				"センスの芽が見えるよ",
			],
			en: [
				"Two stars! You're definitely growing.",
				"Very well done for a rookie.",
				"You're starting to get the hang of it.",
				"Practice a bit more and you'll transform.",
				"You have a good look in your eyes.",
				"I can see the sprouts of talent.",
			],
		},
	},
	{
		minScore: 700,
		name: {
			ja: "寿司ルーキー★",
			en: "Sushi Rookie ★",
		},
		emoji: "⭐",
		taisho: {
			ja: [
				"スタートラインに立ったな",
				"焦らなくていい、自分のペースで行こう",
				"基本を大事にしている姿勢がいいね",
				"次はもっと楽しくなるぞ",
				"諦めない心が一番大事だよ",
				"見習いだって立派な第一歩だ",
			],
			en: [
				"At the starting line.",
				"Don't rush, go at your own pace.",
				"I like how you value the basics.",
				"Next time you'll have more fun.",
				"A heart that never gives up is most important.",
				"Being a rookie is a respectable first step.",
			],
		},
	},
	// ===== 入門領域 (300-700) =====
	{
		minScore: 550,
		name: {
			ja: "おぼつかない寿司入門生",
			en: "Unsteady Sushi Novice",
		},
		emoji: "🐣",
		taisho: {
			ja: [
				"ヒヨコだって最初は歩けないもんさ",
				"入門おめでとう！ここからが楽しいんだよ",
				"力を抜いて、リラックスだ",
				"最初はみんなそんなもんさ",
				"明日の自分は今日より上だぞ",
				"一つずつ覚えていけばいい",
			],
			en: [
				"Wait, even chicks can't walk at the beginning.",
				"Congrats on starting! The fun starts from here.",
				"Loosen up, relax.",
				"Everyone starts like this.",
				"Tomorrow's you will be better than today's.",
				"Just learn things one at a time.",
			],
		},
	},
	{
		minScore: 400,
		name: {
			ja: "寿司に憧れる旅人",
			en: "Traveler Dreaming of Sushi",
		},
		emoji: "🚶",
		taisho: {
			ja: [
				"憧れがあるなら、それで十分だ",
				"旅の途中だね、ゆっくり行こう",
				"まだ道は長いが、一歩は踏み出したよ",
				"寿司の香りに導かれてきたんだな",
				"気持ちがあれば、きっと上手くなるよ",
				"まずは楽しむことだ、寿司もな",
			],
			en: [
				"Having a dream is enough to start.",
				"In the middle of your journey. Take it easy.",
				"The road is long, but you took the first step.",
				"Lured in by the smell of sushi, huh?",
				"With the right attitude, you'll definitely improve.",
				"The most important thing is to enjoy it.",
			],
		},
	},
	{
		minScore: 300,
		name: {
			ja: "回転寿司で迷子",
			en: "Lost at the Conveyor Belt",
		},
		emoji: "🔄",
		taisho: {
			ja: [
				"レーンの前で固まっちゃったかな？",
				"大丈夫、回転寿司は何周でもするからね",
				"迷子でも寿司は食べられるよ",
				"流れてくる皿、一枚取れただけでも上出来だ",
				"まずはお茶を淹れよう、落ち着くぞ",
				"ガリでも食べて一休みしな",
			],
			en: [
				"Froze up in front of the belt?",
				"It's okay, conveyor belt sushi goes around forever.",
				"You can still eat sushi even if you're lost.",
				"Even getting one plate is good enough.",
				"First, pour yourself some tea. It will calm you down.",
				"Eat some ginger and take a breather.",
			],
		},
	},
	// ===== 最下層領域 (0-300) =====
	{
		minScore: 200,
		name: {
			ja: "迷える寿司客",
			en: "Hesitant Sushi Customer",
		},
		emoji: "😵‍💫",
		taisho: {
			ja: [
				"お茶でも飲む？",
				"まずは落ち着いて、一貫ずついこう",
				"寿司の道は一日にして成らず、だね",
				"メニューを見るだけでも勉強になるよ",
				"迷うのも楽しみのうちさ",
				"深呼吸して、もう一回やってみな",
			],
			en: [
				"Wanna grab some tea?",
				"Calm down first, let's go one piece at a time.",
				"Rome wasn't built in a day, nor is sushi.",
				"Even looking at the menu is good study.",
				"Being lost is part of the fun.",
				"Take a deep breath and give it another try.",
			],
		},
	},
	{
		minScore: 100,
		name: {
			ja: "寿司を遠くから眺める人",
			en: "Distant Sushi Observer",
		},
		emoji: "🔭",
		taisho: {
			ja: [
				"遠くから見てるだけじゃ味は分からないよ",
				"もうちょっと近くにおいで",
				"望遠鏡はしまって、カウンターに座りな",
				"見てるだけでもお腹は空くだろう？",
				"次は思い切って手を動かしてみな",
				"大丈夫、寿司は逃げないよ",
			],
			en: [
				"You won't taste it just by looking from afar.",
				"Come a little closer.",
				"Put away the telescope and take a seat at the counter.",
				"Doesn't watching make you hungry?",
				"Next time, try using your hands.",
				"It's alright, sushi won't run away.",
			],
		},
	},
	{
		minScore: 50,
		name: {
			ja: "寿司という概念を知った人",
			en: "Awakened to the Concept of Sushi",
		},
		emoji: "💭",
		taisho: {
			ja: [
				"概念は掴んだな、あとは実践だ",
				"考えるより手を動かそう",
				"頭の中に寿司が浮かんでるな？よし、いい兆候だ",
				"知識ゼロからのスタート、むしろ羨ましいよ",
				"何事も最初の一歩が一番大変なんだよ",
				"寿司の世界へようこそ",
			],
			en: [
				"You've grasped the concept, now for practice.",
				"Stop thinking and start acting.",
				"Sushi is on your mind? Good sign.",
				"Starting from zero... in a way, I envy you.",
				"The first step is always the hardest.",
				"Welcome to the world of sushi.",
			],
		},
	},
	{
		minScore: 0,
		name: {
			ja: "概念未満",
			en: "Below Comprehension",
		},
		emoji: "👻",
		taisho: {
			ja: [
				"…お会計だけでいい？",
				"まずは箸の持ち方からかなぁ",
				"次はもっとお腹を空かせておいで",
				"生きてるかい？…おーい",
				"心配するな、ゼロから始めた伝説の職人もいるよ",
				"まあ、座ってるだけでも雰囲気は楽しめるさ",
				"今日は下見ってことにしておこう",
			],
			en: [
				"...Should I just bring the check?",
				"Maybe we should start with holding chopsticks?",
				"Next time, come back when you're hungrier.",
				"Are you alive? ...Hello?",
				"Don't worry, there's legendary chefs who started from zero.",
				"Well, you can enjoy the atmosphere just sitting there.",
				"Let's just call today a scouting trip.",
			],
		},
	},
];
