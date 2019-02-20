class Message {
	static getEl(tagName){
		return document.createElement(tagName);
	}
	static nextRAF(callback){
		requestAnimationFrame(()=>{
			requestAnimationFrame(()=>{
				callback();
			})
		})
	}
	constructor(options){
		this.options = {
			root: document.body,
			delay: 3000
		};
		Object.assign(this.options, options);
		this.count = 0;
		this.trunk = Message.getEl('div');
		Object.assign(this.trunk.style,{
			position: 'fixed',
			left: 0,
			top: 0,
			width: '100%',
			pointerEvents: 'none'
		})
	}
	entry(item){
		Message.nextRAF(()=>{
			Object.assign(item.style,{
				transitionDuration: '0.2s',
				transitionProperty: 'transform',
				transitionTimingFunction: 'ease-out',
				transform: 'translateY(0)'	
			})		
		})
	}
	leave(item){
		item.style.transform = 'translateY(-20px)';
		setTimeout(()=>{
			this.trunk.removeChild(item);
			this.count--;
			if(this.count === 0){
				this.options.root.removeChild(this.trunk);
			}
		}, 100)
	}
	add(msg, delay){
		this.count++;
		delay = delay || this.options.delay;
		const item = Message.getEl('div');
		const content = Message.getEl('div');
		Object.assign(item.style, {
			width: '100%',
			margin: '10px',
			textAlign: 'center',
			pointerEvents: 'none',
			transform:'translateY(-20px)',
			willChange: 'transform'
		})
		Object.assign(content.style, {
			display: 'inline-block',
			padding: '10px 16px',
			background: 'white',
			borderRadius: '4px',
			boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
			pointerEvents: 'all'
		})
		content.textContent = msg;
		item.appendChild(content);
		this.trunk.appendChild(item);
		if(this.count===1){
			this.options.root.appendChild(this.trunk);
		}
		this.entry(item);
		setTimeout(()=>{
			this.leave(item);
		}, delay);
	}
}