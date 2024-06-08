const app = Vue.createApp({
    data() {
        return {
            playerMotion: true,
            emptyImage: '/img/empty.png',
            cross: '/img/nil.png',
            nil: '/img/cross.png',
            allImage: [],
            backField: [],
            movements: [],
            animationTextureSwitch: true,
            animationСounter: 5,
            winAnimationInterval: null,
            speedAnimation: 200
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
                clearInterval(this.winAnimationInterval);
                this.clearField();
            }

        },
        mouseHover(index) {
            console.log("lox");
            if (this.backField[index] == '') {
                if (this.playerMotion) {
                    this.allImage[index] = '/img/crossDark.png'
                }
                else {
                    this.allImage[index] = '/img/nilDark.png'
                }
            }
        },
        mouseLeave(index) {
            if (this.backField[index] == '') {
                this.allImage[index] = this.emptyImage;
            }
        },
        clearField() {
            this.playerMotion = true;
            this.allImage = [];
            for (let index = 0; index < 9; index++) {
                this.allImage.push(this.emptyImage);
            }
            this.backField =
                [
                    '', '', '',
                    '', '', '',
                    '', '', ''
                ]
            this.movements = [];
            this.animationСounter = 5;
            this.winAnimationInterval = null;
        },
        win() {
            this.winAnimationInterval = setInterval(() => {
                this.winAnimated();
            }, this.speedAnimation);
        },
        checkFieldStatus(index) {

            this.movements.push(index);

            if (this.movements.length == 7) {
                this.allImage[this.movements[0]] = this.emptyImage;
                this.backField[this.movements[0]] = '';
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
            if ((this.backField[0] !== '' && this.backField[0] === this.backField[1] && this.backField[1] === this.backField[2]) ||
                (this.backField[0] !== '' && this.backField[0] === this.backField[3] && this.backField[3] === this.backField[6]) ||
                (this.backField[0] !== '' && this.backField[0] === this.backField[4] && this.backField[4] === this.backField[8]) ||
                (this.backField[3] !== '' && this.backField[3] === this.backField[4] && this.backField[4] === this.backField[5]) ||
                (this.backField[1] !== '' && this.backField[1] === this.backField[4] && this.backField[4] === this.backField[7]) ||
                (this.backField[2] !== '' && this.backField[2] === this.backField[5] && this.backField[5] === this.backField[8]) ||
                (this.backField[6] !== '' && this.backField[6] === this.backField[7] && this.backField[7] === this.backField[8]) ||
                (this.backField[2] !== '' && this.backField[2] === this.backField[4] && this.backField[4] === this.backField[6])) {
                this.win();
            }
        },
        changeButtonImage(index) {
            if (this.backField[index] == '') {
                if (this.playerMotion) {
                    this.allImage[index] = this.nil;
                    this.backField[index] = 'o'
                }
                else {
                    this.allImage[index] = this.cross;
                    this.backField[index] = 'x'
                }
                this.playerMotion = !this.playerMotion;
                this.checkFieldStatus(index);
            }
        }
    },
    created() {
        this.clearField();
    }
});

app.mount("#app");
