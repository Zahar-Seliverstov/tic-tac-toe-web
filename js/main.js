const app = Vue.createApp({
    data() {
        return {
            gameModeText: "P",
            playerMotion: true,
            emptyImage: '/img/empty.png',
            cross: '/img/cross.png',
            nil: '/img/nil.png',
            allImage: [],
            backField: [],
            movements: [],
            animationTextureSwitch: true,
            animationСounter: 5,
            winAnimationInterval: null,
            speedAnimation: 200,
            animationIsPlaying: false,
            clickSound: new Audio('/sounds/choice.wav'),
            winSound: new Audio('sounds/win.wav'),
            clearSound: new Audio('sounds/clear.wav'),
            botEnabel: false,
            possibleMoves: []
        };
    },
    methods: {
        winAnimated() {
            img = ''
            if (this.playerMotion) {
                img = this.animationTextureSwitch ? '/img/nilVeryDark.png' : '/img/nil.png';
            }
            else {
                img = this.animationTextureSwitch ? '/img/crossVeryDark.png' : '/img/cross.png';
            }
            this.animationTextureSwitch = !this.animationTextureSwitch;

            this.allImage[this.movements[this.movements.length - 1]] = img;
            this.allImage[this.movements[this.movements.length - 3]] = img;
            this.allImage[this.movements[this.movements.length - 5]] = img;
            this.animationСounter -= 1;

            if (this.animationСounter <= 0) {
                this.animationIsPlaying = false;
                clearInterval(this.winAnimationInterval);
                this.clearField();
            }

        },
        mouseHover(index) {
            if (this.backField[index] == ' ' && !this.animationIsPlaying) {
                this.allImage[index] = this.playerMotion ? '/img/crossDark.png' : '/img/nilDark.png';
            }
        },
        mouseLeave(index) {
            if (this.backField[index] == ' ' && !this.animationIsPlaying) {
                this.allImage[index] = this.emptyImage;
            }
        },
        clearField(treker = false) {
            if (!this.animationIsPlaying) {
                if (treker) {
                    this.clearSound.play()
                }
                this.playerMotion = true;
                this.allImage = [];
                for (let index = 0; index < 9; index++) {
                    this.allImage.push(this.emptyImage);
                }
                this.backField =
                    [
                        ' ', ' ', ' ',
                        ' ', ' ', ' ',
                        ' ', ' ', ' '
                    ]
                this.movements = [];
                this.animationСounter = 5;
                this.winAnimationInterval = null;
            }
        },
        win() {
            this.winSound.play();
            this.winAnimationInterval = setInterval(() => {
                this.winAnimated();
            }, this.speedAnimation);
        },
        checkFieldStatus(index) {

            this.movements.push(index);

            if (this.movements.length == 7) {
                this.allImage[this.movements[0]] = this.emptyImage;
                this.backField[this.movements[0]] = ' ';
                this.movements.shift();
            }
            if (this.movements.length >= 6) {
                if (this.playerMotion) {
                    this.allImage[this.movements[0]] = '/img/crossDark.png';
                }
                else {
                    this.allImage[this.movements[0]] = '/img/nilDark.png';
                }
            }
            if ((this.backField[0] !== ' ' && this.backField[0] === this.backField[1] && this.backField[1] === this.backField[2]) ||
                (this.backField[0] !== ' ' && this.backField[0] === this.backField[3] && this.backField[3] === this.backField[6]) ||
                (this.backField[0] !== ' ' && this.backField[0] === this.backField[4] && this.backField[4] === this.backField[8]) ||
                (this.backField[3] !== ' ' && this.backField[3] === this.backField[4] && this.backField[4] === this.backField[5]) ||
                (this.backField[1] !== ' ' && this.backField[1] === this.backField[4] && this.backField[4] === this.backField[7]) ||
                (this.backField[2] !== ' ' && this.backField[2] === this.backField[5] && this.backField[5] === this.backField[8]) ||
                (this.backField[6] !== ' ' && this.backField[6] === this.backField[7] && this.backField[7] === this.backField[8]) ||
                (this.backField[2] !== ' ' && this.backField[2] === this.backField[4] && this.backField[4] === this.backField[6])) {
                this.animationIsPlaying = true;
                this.win();
            }
        },
        changeButtonImage(index) {
            if (!this.animationIsPlaying) {
                if (this.backField[index] == ' ') {
                    this.clickSound.play();
                    if (this.playerMotion) {
                        this.allImage[index] = this.cross;
                        this.backField[index] = 'x'
                    }
                    else {
                        this.allImage[index] = this.nil;
                        this.backField[index] = 'o'
                    }
                    this.playerMotion = !this.playerMotion;
                    this.checkFieldStatus(index);
                    if (this.botEnabel) {
                        this.botMove();
                    }
                }
            }
        },
        botMove() {

            if (!this.animationIsPlaying) {
                max = 9;
                min = 0;
                randomMove = Math.floor(Math.random() * (max - min + 1)) + min;

                while (this.backField[randomMove] != ' ') {
                    randomMove = Math.floor(Math.random() * (max - min + 1)) + min;
                }


                for (let index = 0; index < this.possibleMoves.length; index++) {
                    possibleField = "";
                    currentField = ""

                    for (let i = 0; i < 9; i++) {
                        currentField += this.backField[i];
                        possibleField += this.possibleMoves[index][i];
                    }
                    console.log("1 - " + currentField);
                    console.log("2 - " + possibleField);

                    if (possibleField == currentField) {
                        randomMove = parseInt(this.possibleMoves[index][9], 10);
                        console.log(randomMove);
                        break;
                    }
                }
                if (this.backField[randomMove] == ' ') {
                    if (this.playerMotion) {
                        this.allImage[randomMove] = this.cross;
                        this.backField[randomMove] = 'x'
                    }
                    else {
                        this.allImage[randomMove] = this.nil;
                        this.backField[randomMove] = 'o'
                    }
                    this.playerMotion = !this.playerMotion;
                    this.clickSound.play();
                    this.checkFieldStatus(randomMove);
                }

            }
        },
        setGameMode() {
            this.botEnabel = !this.botEnabel;
            this.gameModeText = this.botEnabel ? "B" : "P"
        },
        async loadFile() {
            try {
                const response = await fetch('data.txt');
                if (response.ok) {
                    const fileContent = await response.text();
                    //console.log(fileContent + ")))))");
                    this.possibleMoves = fileContent.split('\n');
                    for (let index = 0; index < this.possibleMoves.length; index++) {
                        console.log(this.possibleMoves[index]);
                    }
                } else {
                    console.error('Error loading file:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        }
    },
    created() {
        this.loadFile();
        //console.log(this.possibleMoves[0])
        //for (let index = 0; index < this.possibleMoves.length; index++) {
        //    console.log(this.possibleMoves[index])
        //}
        this.clearField();
    }
});

app.mount("#app");
