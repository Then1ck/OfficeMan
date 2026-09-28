const GameEngine = {
    curScreen: null,
    startGame(){
        if(this.curScreen === null){
            this.createScreen('computer');
        }
    },
    createScreen(screen){
        this.removeCurScreen();
        if(screen === 'computer'){
            const printEl = document.createElement('div');
            printEl.classList.add('print-move');

            const pButtonEl = document.createElement('div');
            pButtonEl.classList.add('print-button');
            printEl.appendChild(pButtonEl);

            printEl.addEventListener('mouseenter', () => {
                this.createScreen('printer');
            });

            document.body.appendChild(printEl);

            this.curScreen = [printEl];
        }
        if(screen === 'printer'){
            const comEl = document.createElement('div');
            comEl.classList.add('comp-move');

            const cButtonEl = document.createElement('div');
            cButtonEl.classList.add('comp-button');
            comEl.appendChild(cButtonEl);

            comEl.addEventListener('mouseenter', () => {
                this.createScreen('computer');
            });

            document.body.appendChild(comEl);

            this.curScreen = [comEl];
        }
    },
    removeCurScreen(){
        if(this.curScreen){
            this.curScreen.forEach(el => {
                el.remove();
            });
            this.curScreen = null;
        }
    }
}

GameEngine.startGame();