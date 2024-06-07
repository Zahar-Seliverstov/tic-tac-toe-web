app = Vue.createApp({
    data() {
        return {
            playerMotion: true,
            field:
                [
                    false, false, false,
                    false, false, false,
                    false, false, false
                ],
            imageButton: ""

        }
    },
    methods: {
        RecordMove(index) {
            field[index] = this.playerMotion;
            this.playerMotion = !this.playerMotion;
            
            if (this.playerMotion) {
                this.imageButton = "img/X.png"
            }
            else {
                this.imageButton = "img/O.png"
            }

        }
    },
    create() {
        this.playerMotion = true
        
    }
});
app.mount("#field")