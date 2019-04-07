class CSSTransition {
    static nextRAF(callback, rAFID, that){
        that[rAFID] = requestAnimationFrame(()=>{
            that[rAFID] = requestAnimationFrame(callback);
        })
    }
    constructor(options={}){
        const must = ['el', 'className'];
        for(const key of must){
            if(!options.hasOwnProperty(key)){
                throw new Error(`${key} can not be empty.`);
            }
        }
        this.options = {
            onEnter(){},
            onEntering(){},
            onEntered(){},
            onExit(){},
            onExiting(){},
            onExited(){}
        };
        Object.assign(this.options, options);
        this._enterStatus = false;
        this._exitStatus = false;
    }
    addClassName(status){
        const className = this.options.className + '-' + status;
        this.options.el.classList.add(className);
    }
    removeClassName(...statuss){
        const classNames = statuss.map(status=>
                this.options.className + '-' + status
            );
        this.options.el.classList.remove(...classNames);
    }
    onCallback(callback){
        const allStyle = window.getComputedStyle(this.options.el);
        const delays = allStyle['transitionDelay'].split(',').map(d=>{
            const n = parseFloat(d);
            if(Number.isNaN(n)){
                return 0;
            }
            return n;
        })
        const durations = allStyle['transitionDuration'].split(',').map((d, i)=>{
            const n = parseFloat(d);
            const delay = delays[i];
            if(Number.isNaN(n)){
                return 0;
            }
            return n+delay;
        });
        let duration = Math.max(...durations);
        duration *= 1000;
        return setTimeout(callback, duration);
    }
    enter(){
        if(this._exitStatus){
            cancelAnimationFrame(this._exitRAFID);
            clearTimeout(this._exitTimer);
            this.removeClassName('exit', 'exit-active');
            this.options.onExited();
            this._exitStatus = false;
        }
        this._enterStatus = true;
        this.addClassName('enter');
        this.options.onEnter();
        CSSTransition.nextRAF(()=>{
            this.addClassName('enter-active');
            this.options.onEntering();
            this._enterTimer = this.onCallback(()=>{
                this.removeClassName('enter', 'enter-active');
                this.options.onEntered();
                this._enterStatus = false;
            })
        }, '_enterRAFID', this)
    }
    exit(){
        if(this._enterStatus){
            cancelAnimationFrame(this._enterRAFID);
            clearTimeout(this._enterTimer);
            this.removeClassName('enter', 'enter-active');
            this.options.onEntered();
            this._enterStatus = false;
        }
        this._exitStatus = true;
        this.addClassName('exit');
        this.options.onExit();
        CSSTransition.nextRAF(()=>{
            this.addClassName('exit-active');
            this.options.onExiting();
            this._exitTimer = this.onCallback(()=>{
                this.removeClassName('exit', 'exit-active');
                this.options.onExited();
                this._exitStatus = false;
            });
        }, '_exitRAFID', this)
    }
}