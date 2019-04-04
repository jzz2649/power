class CSSTransition {
    static nextRAF(callback){
        requestAnimationFrame(()=>{
            requestAnimationFrame(callback);
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
    }
    addClassName(status){
        const className = this.options.className + '-' + status;
        this.options.el.classList.add(className);
    }
    removeAllclass(){
        const classNames = ['enter', 'enter-active', 'exit', 'exit-active'].map(status=>
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
        setTimeout(callback, duration);
    }
    enter(){
        this.addClassName('enter');
        this.options.onEntering();
        CSSTransition.nextRAF(()=>{
            this.addClassName('enter-active');
            this.onCallback(()=>{
                this.options.onEntered();
            })
        })
    }
    exit(){
        this.addClassName('exit');
        this.options.onExiting();
        CSSTransition.nextRAF(()=>{
            this.addClassName('exit-active');
            this.onCallback(()=>{
                this.removeAllclass();
                this.options.onExited();
            });
        })
    }
}