/**
 * @method creEle from https://github.com/jzz2649/utils/blob/master/creEle.js
 * @method CSSTransition from https://github.com/jzz2649/power/blob/master/CSSTransition.js
 */

const MSG_STYLE_NAME = Symbol('stylesheet');

const MSG_STYLE_TEXT = `
.msg-box {
	position: fixed;
	left: 0px;
	top: 0px;
	width: 100%;
	pointer-events: none;
}
.msg-item {
	width: 100%;
	margin: 10px;
	text-align: center;
	pointer-events: none;
	transform: translateY(0px);
	will-change: transform;
}
.msg-content {
	display: inline-block;
	padding: 10px 16px;
	background: white;
	border-radius: 4px;
	box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 12px;
	pointer-events: all;
}
.msg-enter {
	transform: translateY(-20px);
}
.msg-enter-active {
	transform: translateY(0);
	transition: transform 0.2s ease-out;
}
.msg-exit {
	transform: translateY(0);
}
.msg-exit-active {
	transform: translateY(-20px);
	transition: transform 0.2s ease-out;
}
`

class Message {
	constructor(options){
		this.options = {
			root: document.body,
			delay: 3000
		};
		Object.assign(this.options, options);
		if(!window[MSG_STYLE_NAME]){
			window[MSG_STYLE_NAME] = true;
			document.head.appendChild(creEle('style', null, MSG_STYLE_TEXT));
		}
		this.count = 0;
		this.trunk = creEle('div',{className:'msg-box'});
	}
	add(msg, delay){
		delay = delay || this.options.delay;
		const content = creEle('div',{className:'msg-content'}, msg);
		const item = creEle('div',{className:'msg-item'}, content);
		const enter = () => {
			if(!this.count){
				this.options.root.appendChild(this.trunk);
			}
			this.trunk.appendChild(item);
			this.count++;
		}
		const exit = () => {
			this.trunk.removeChild(item);
			this.count--;
			if(!this.count){
				this.options.root.removeChild(this.trunk);
			}
		}
		const csstransition = new CSSTransition({
			el: item,
			className: 'msg',
			onEntering: enter,
			onExited: exit
		})
		csstransition.enter();
		setTimeout(()=>{
			csstransition.exit();
		}, delay);
	}
}