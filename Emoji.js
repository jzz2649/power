class Emoji {
	constructor(options){
		this.options = {
			maxNumber: 20,
			distance: 2,
			maxRadius: 60,
			fontSize: 16,
			dom: document.body
		};
		Object.assign(this.options, options);
		this.list = [];
		this._isRun = false;
		this._createRoot();
	}
	static get XMLNS(){
		return 'http://www.w3.org/2000/svg';
	}
	static range(min, max){
		if (min > max) [min, max] = [max, min];
		return Math.floor(Math.random()*(max-min+1))+min;
	}
	static getAB(x1,y1,x2,y2){
		return Math.sqrt((Math.pow((x1-x2),2) + Math.pow((y1-y2),2)));
	}
	static getSVGEL(child, emoji){
		const el = document.createElementNS(Emoji.XMLNS, 'text');
		const emojiEl = document.createTextNode(emoji);
		const fix = child.fontSize/2;
		el.style.fontSize = child.fontSize;
		el.setAttributeNS(null,'x', child.x-fix);
		el.setAttributeNS(null,'y', child.y+fix);
		el.appendChild(emojiEl);
		return el;
	}
	_createRoot(){
		this._root = document.createElement('div');
		this._root.style.position = 'fixed';
		this._root.style.left = '0';
		this._root.style.top = '0';
		this._root.style.zIndex = 9999;
	}
	add(x, y, emoji){
		const radius = this.options.maxRadius;
		const svg = document.createElementNS(Emoji.XMLNS, 'svg');
		emoji = emoji || this.options.emoji;
		svg.setAttributeNS(null, 'width', radius*2);
		svg.setAttributeNS(null, 'height', radius*2);
		svg.setAttributeNS(null, 'viewbox', `0 0 ${radius*2} ${radius*2}`);
		svg.style.position='absolute';
		svg.style.left = `${x-radius}px`;
		svg.style.top = `${y-radius}px`;
		svg.style.userSelect = 'none';
		svg.style.pointerEvents = 'none';
		const item = { svg, emoji, i:0, c:[], map: [] };
		this.list.push(item);
		this._root.appendChild(svg);
		if(!this._isRun){
			this._isRun = true;
			this.options.dom.appendChild(this._root);
			this.run();
		}
	}
	draw(el,x,y,fix){
		el.setAttributeNS(null,'x',x-fix);
		el.setAttributeNS(null,'y',y+fix);
	}
	run(){
		const list = this.list;
		const maxNumber = this.options.maxNumber;
		const distance = this.options.distance;
		const maxRadius = this.options.maxRadius;
		const fontSize = this.options.fontSize;
		const fix = fontSize/2;
		const max = maxRadius - fix;
		for(let i=list.length-1; i>=0; i--){
			const item = list[i];
			for( let j=item.c.length-1; j>=0; j--){
				const child = item.c[j];
				child.x += (Math.cos(child.angle)*distance);
				child.y += (Math.sin(child.angle)*distance);
				const nextAB = Emoji.getAB(child.x,child.y,maxRadius,maxRadius);
				if(nextAB>max){
					item.c.splice(j, 1);
					const el = item.map.splice(j, 1);
					item.svg.removeChild(el[0]);
				}else{
					this.draw(item.map[j], child.x, child.y, fix);
				}
			}
			if(item.i<maxNumber){
				item.i++;
				const child = {
					fontSize,
					x: maxRadius,
					y: maxRadius,
					angle: Emoji.range(0, 360)
				}
				const el = Emoji.getSVGEL(child, item.emoji);
				item.c.push(child);
				item.map.push(el);
				item.svg.appendChild(el);
			}
			if(item.c.length===0){
				this._root.removeChild(item.svg);
				list.splice(i, 1);
			}
		}
		if(list.length === 0){
			this._isRun = false;
			this.options.dom.removeChild(this._root);
			return;
		}
		requestAnimationFrame(()=>{
			this.run();
		})
	}
}