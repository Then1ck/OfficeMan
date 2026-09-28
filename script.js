const GameEngine = {
    curScreen: null,
    office: null,
    startGame(){
        if(this.curScreen === null){
            this.makeOffice();
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

            const aboveEl = document.createElement('div');
            aboveEl.classList.add('above-move');

            const aButtonEl = document.createElement('div');
            aButtonEl.classList.add('above-button');
            aboveEl.appendChild(aButtonEl);

            aboveEl.addEventListener('mouseenter', () => {
                this.createScreen('above');
            });

            document.body.appendChild(aboveEl);

            this.office.classList.remove('comp', 'print', 'abv');
            this.office.classList.add('comp');

            this.curScreen = [printEl, aboveEl];
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

            this.office.classList.remove('comp', 'print', 'abv');
            this.office.classList.add('print');

            this.curScreen = [comEl];
        }
        if(screen === 'above'){
            const bottomEl = document.createElement('div');
            bottomEl.classList.add('bottom-move');
            
            const bButtonEl = document.createElement('div');
            bButtonEl.classList.add('bottom-button');
            bottomEl.appendChild(bButtonEl);

            bottomEl.addEventListener('mouseenter', () => {
                this.createScreen('computer');
            });
            document.body.appendChild(bottomEl);
            
            this.office.classList.remove('comp', 'print', 'abv');
            this.office.classList.add('abv');

            this.curScreen = [bottomEl];
        }
    },
    removeCurScreen(){
        if(this.curScreen){
            this.curScreen.forEach(el => {
                el.remove();
            });
            this.curScreen = null;
        }
    },
    makeOffice(){
        const officeEl = document.createElement('img');
        officeEl.classList.add('office');
        officeEl.src = 'image.png';
        this.office = officeEl;
        document.body.appendChild(officeEl);
    }
}

GameEngine.startGame();