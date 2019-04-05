class CSSTransition {
    static nextRAF(callback, status){
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>callback(status));
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
            onEntering(){},
            onEntered(){},
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
        let duration = parseFloat(allStyle['transitionDuration']);
        if(Number.isNaN(duration)){
            duration = 0;
        }
        duration *= 1000;
        return setTimeout(callback, duration);
    }
    enter(){
        if(this._exitStatus){
            clearTimeout(this._exitTimer);
            this.removeClassName('exit', 'exit-active');
            this.options.onExited();
            this._exitStatus = false;
        }
        this._enterStatus = true;
        this.addClassName('enter');
        this.options.onEntering();
        CSSTransition.nextRAF((status)=>{
            if(status){
                this.addClassName('enter-active');
                this._enterTimer = this.onCallback(()=>{
                    this.removeClassName('enter', 'enter-active');
                    this.options.onEntered();
                    this._enterStatus = false;
                })
            }
        }, this._enterStatus)
    }
    exit(){
        if(this._enterStatus){
            clearTimeout(this._enterTimer);
            this.removeClassName('enter', 'enter-active');
            this.options.onEntered();
            this._enterStatus = false;
        }
        this._exitStatus = true;
        this.addClassName('exit');
        this.options.onExiting();
        CSSTransition.nextRAF((status)=>{
            if(status){
                this.addClassName('exit-active');
                this._exitTimer = this.onCallback(()=>{
                    this.removeClassName('exit', 'exit-active');
                    this.options.onExited();
                    this._exitStatus = false;
                });
            }
        }, this._exitStatus)
    }
}