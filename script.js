const Hazard_Database = [
    {
        id: 'simon_says',
        name: 'Boss Says',
        desc: 'A task appears on your computer. '+
        'To finish it, lights of certain colors will flash in sequence on your monitor. '+
        'Once the sequence finish, buttons corresponding to each of the color appears and you must ' +
        'press on the buttons according to how it was flashed previously.',
        interval: (2000),
        action: (self) => {
            const screen = document.querySelector('.comp-screen');

            const ss_icon = document.createElement('div');
            ss_icon.classList.add('comp-icons');

            screen.appendChild(ss_icon);
        }
    }
]

const GameEngine = {
    curScreen: null,
    office: null,
    hazards: [Hazard_Database[0]],
    activeHazards: [],
    startGame(){
        if(this.curScreen === null){
            this.makeOffice();
            this.createScreen('computer');

            // console.log(this.hazards);
            this.startHazards();
        }
    },
    startHazards(){
        this.hazards.forEach(hazard => {
            console.log(hazard.interval)
            const runHazard = () => {
                if(this.activeHazards.length > 3)return;
                hazard.action(hazard);
                setTimeout(runHazard, hazard.interval);
                this.activeHazards.push(hazard);
            }
            setTimeout(runHazard, hazard.interval);
        });
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
        const officeEl = document.createElement('div');
        officeEl.classList.add('office');

        const officeImg = document.createElement('img');
        officeImg.src = 'image.png';
        officeImg.classList.add('office-img');
        officeEl.appendChild(officeImg);

        const computer = document.createElement('div');
        computer.classList.add('computer');

        const compScreen = document.createElement('div');
        compScreen.classList.add('comp-screen');
        computer.appendChild(compScreen);

        const compLight = document.createElement('div');
        compLight.classList.add('comp-light');
        computer.appendChild(compLight);

        officeEl.appendChild(computer);

        this.office = officeEl;
        document.body.appendChild(officeEl);
    }
}

GameEngine.startGame();