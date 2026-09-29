const Hazard_Database = [
    {
        id: 'simon_says',
        name: 'Boss Says',
        desc: 'A task appears on your computer. '+
        'To finish it, lights of certain colors will flash in sequence on your monitor. '+
        'Once the sequence finish, buttons corresponding to each of the color appears and you must ' +
        'press on the buttons according to how it was flashed previously.',
        interval: () => {return 10000},
        action: (self) => {
            const screen = document.querySelector('.comp-screen');

            const overlay = document.createElement('div');
            overlay.classList.add('comp-tab');
            overlay.style.backgroundColor = 'black';

            screen.appendChild(overlay);

            const color = [];
            for(let i=0;i<3;i++){
                color.push(Math.floor(Math.random()*4));
            }

            let idx=0;
            const setColor = () => {
                const curCol = idx>=color.length?null:color[idx];
                idx++;
                // const curCol = color.length>0?color.shift():null;
                const tab = document.createElement('div');
                tab.classList.add('comp-tab');
                if(curCol===0){
                    tab.style.backgroundColor = 'red';
                }
                if(curCol===1){
                    tab.style.backgroundColor = 'blue';
                }
                if(curCol===2){
                    tab.style.backgroundColor = 'green';
                }
                if(curCol===3){
                    tab.style.backgroundColor = 'yellow';
                }
                if(curCol===null){
                    const cenDiv = document.createElement('div');
                    cenDiv.classList.add('simon-buttons');

                    let ansIdx = 0;

                    for(let i=0;i<4;i++){
                        const cols = document.createElement('div');
                        cols.classList.add('simon-color');

                        switch(i){
                            case 0:
                                cols.style.backgroundColor = 'red';
                                break;
                            case 1:
                                cols.style.backgroundColor = 'blue';
                                break;
                            case 2:
                                cols.style.backgroundColor = 'green';
                                break;
                            case 3:
                                cols.style.backgroundColor = 'yellow';
                                break;
                        }

                        cols.onclick = () => {
                            if(i !== color[ansIdx]){
                                // const errTab = document.createElement('div');
                                // errTab.classList.add('comp-tab');
                                // errTab.style.backgroundColor = 'blue';
                                // errTab.style.fontSize = '100px';
                                // screen.appendChild(errTab);

                                // let errTimer = 15;
                                // const timerCount = () => {
                                //     errTab.innerText = errTimer;
                                //     setTimeout(()=>{
                                //         errTimer--;
                                //         if(errTimer <= 0)errTab.remove();
                                //         timerCount();
                                //     },1000);
                                // }
                                // timerCount();
                                self.complete(self, {state: false})
                                overlay.remove();
                            }
                            ansIdx++;
                            if(ansIdx >= color.length){
                                self.complete(self, {state: true});
                                overlay.remove();
                            }
                        }

                        cenDiv.appendChild(cols);
                    }
                    
                    overlay.appendChild(cenDiv);

                    return;
                }
                screen.appendChild(tab);

                setTimeout(() => {
                    tab.remove();
                    setTimeout(() => {
                        setColor();
                    }, 300);
                    // setColor();
                }, 700);
            }

            setColor();
        },
        summon: (self) => {
            const light = document.querySelector('.comp-light');
            if(GameEngine.computer.notifs.length <= 0){
                light.style.backgroundColor = 'green';
            }else if(GameEngine.computer.notifs.length <= 2){
                light.style.backgroundColor = 'yellow';
            }else {
                light.style.backgroundColor = 'red';
            }

            if(GameEngine.computer.notifs.length < 4){
                GameEngine.computer.notifs.push(self);
                
                const screen = document.querySelector('.comp-screen');

                const ss_icon = document.createElement('div');
                ss_icon.classList.add('comp-icons');

                ss_icon.onclick = () => {
                    self.action(self);
                }
                self.el = ss_icon

                screen.appendChild(ss_icon);
            }
        },
        complete: (self, evt) => {

            if(evt.state === false){
                self.action(self);
            }else {
                GameEngine.computer.notifs = GameEngine.computer.notifs.filter(item => item !== self);
                const light = document.querySelector('.comp-light');
                if(GameEngine.computer.notifs.length <= 1){
                    light.style.backgroundColor = 'green';
                }else if(GameEngine.computer.notifs.length <= 3){
                    light.style.backgroundColor = 'yellow';
                }else {
                    light.style.backgroundColor = 'red';
                }
            }
            const hEl = self.el;
            if(hEl !== null)hEl.remove();
        }
    }
]

const Hazard_System = {
    getHazard(id) {
        const hazard = Hazard_Database.find(el => el.id === id);

        if (!hazard) {
            return null;
        }

        return {
            id: hazard.id,
            name: hazard.name,
            desc: hazard.desc,
            interval: hazard.interval,
            action: hazard.action,
            summon: hazard.summon,
            complete: hazard.complete,
            el: null
        };
    },

    getHazardList() {
        return [
            this.getHazard('simon_says')
        ];
    }
};

const GameEngine = {
    curScreen: null,
    office: null,
    hazards: Hazard_System.getHazardList(),
    computer: {
        notifs: [],
        timers: 20000,
        isBusy: false,
        isOff: true,
    },
    gameEnd: false,
    startGame(){
        if(this.curScreen === null){
            this.makeOffice();
            this.createScreen('computer');

            this.startHazards();
            this.computerTimer();
        }
    },
    computerTimer(){
        const updateTick = 100;
        this.timeInterval = setInterval(() => {
            const light = document.querySelector('.comp-light');
            if(!light)return;

            const bg = light.style.backgroundColor;

            switch(bg){
                case 'red':
                    this.computer.timers -= updateTick;
                    break;
                case 'yellow':
                    this.computer.timers += updateTick;
                    break;
                case 'green':
                    this.computer.timers += updateTick*2;
            }
            
            if(this.computer.timers > 20000)this.computer.timers = 20000;
            // console.log(this.computer.timers);

            if(this.computer.timers <= 0){
                this.computer.timers = 0;

                if(!this.gameEnd)this.fired();
                // this.gameEnd = true;
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
        }, updateTick);
    },
    fired(){
        const fired = document.createElement('div');
        fired.classList.add('game-over');
        fired.innerText = 'Game Over!';

        this.gameEnd = true;

        document.body.appendChild(fired);
    },
    finished(){
        console.log('finished');
        const victory = document.createElement('div');
        victory.classList.add('victory');
        victory.innerText = 'Day Ended';

        this.gameEnd = true;

        document.body.appendChild(victory);
    },
    startHazards(){
        this.hazards.forEach(hazard => {
            const runHazard = () => {
                if(this.gameEnd)return;
                hazard.summon(Hazard_System.getHazard(hazard.id));
                setTimeout(runHazard, hazard.interval());
            }
            setTimeout(runHazard, hazard.interval());
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

        const clockEl = document.createElement('div');
        clockEl.classList.add('clock');

        const hourEl = document.createElement('div');
        hourEl.classList.add('hour-hand');
        clockEl.appendChild(hourEl);

        const tickSpeed = 100;
        let i=0;
        const clockTick = setInterval(() => {
            hourEl.style.transform = "translateX(-50%) rotate(" + i + "deg)";
            i++;

            if(i>=360){
                clearInterval(clockTick);
                this.finished();
            }
        }, tickSpeed);

        officeEl.appendChild(clockEl);

        this.office = officeEl;
        document.body.appendChild(officeEl);

    },
}

GameEngine.startGame();