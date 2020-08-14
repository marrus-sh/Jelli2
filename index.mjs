//  Jelli 2
//  👾🎐 A game engine for browsers
//  Developed ⌨⃝ 2020 kibigo!

/*  ⁂  *\

The author(s) of the following code have dedicated it, to the fullest extent, to the public domain via a ‘CC0 1.0 Universal Public Domain Dedication’.  No warrantees of any kind, express or implied, are provided regarding this software or its use.  You employ it at your own risk.

For more information, see: ‹ https://creativecommons.org/publicdomain/zero/1.0/ ›.

\*  ⁂  */

//  👾 · 🕹 · 🎐 · 🕹 · 👾  //

const
	ǀ = new Proxy ({ }, { set: ( O, P, V ) =>
		(customElements.define(`jelli2-${ V.name.toLowerCase() }`, V), true) })
	, AByNº = $s => new Proxy (Object.create(Array.prototype),
		{ defineProperty: ( O, P, Desc ) => false
		, deleteProperty: ( O, P ) => false
		, get: ( O, P, Receiver ) => P == `length`
			? Object.values($s).reduce(( r, { number } ) => number > r ? number : r, 0) + 1
			: Object.values($s).find($ => $.number == P)
				?? Reflect.get(Object.getPrototypeOf(O), P, O)
		, getOwnPropertyDescriptor: ( O, P ) => {
			if ( P == `length` ) return (
				{ configurable: true
				, enumerable: false
				, value: Object.values($s).reduce(( r, { number } ) =>
					number > r ? number : r, 0) + 1
				, writable: false })
			else {
				let $ = Object.values($s).find($ => $.number == P)
				return $ ?
					{ configurable: true
					, enumerable: true
					, value: $
					, writable: false } : undefined } }
		, has: ( O, P ) => P == `length` ? true
			: Object.values($s).some($ => $.number == P) ?? P in Object.getPrototypeOf(O)
		, ownKeys: O => Array.from(Object.values($s).reduce(( r, $ ) =>
			r.add(String($.number)), new Set ([`length`])))
		, preventExtensions: O => false
		, set: ( O, P, V, Receiver ) => false })
	, get = O => P => Function.prototype.call.bind(Object.getOwnPropertyDescriptor(O, P).get)
	, has = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

//  👾 · 🕹 · 🎐 · 🕹 · 👾  //

export const Key =ǀ.ǀ= class Key extends HTMLElement {
	constructor ( ) {
		super ()
		const
			button = this.ownerDocument.createElement `button`
			, style = this.ownerDocument.createElement `style`
		style.textContent = `
button{ Box-Sizing: Content-Box; Margin: 0; Border: Thin Solid; Border-Radius: .25EM; Padding: 0; Min-Block-Size: 1.5EM; Min-Inline-Size: 1.5EM; Color: ButtonText; Background: ButtonFace; Font: Inherit; Line-Height: 1.5EM; Text-Align: Center }
:host([active]) button{ Color: HighlightText; Background: Highlight }
`
		button.type = `button`
		button.setAttribute(`part`, `button`)
		button.appendChild(this.ownerDocument.createElement `slot`)
		;
			[ `pointerdown`
			, `pointerover` ].forEach(name => this.addEventListener(name, event => {
				if ( event.buttons & 1 ) this.active = true
				event.preventDefault() }))
		;
			[ `pointerup`
			, `pointerout` ].forEach(name => this.addEventListener(name, event => {
				this.active = false
				event.preventDefault() }))
		this.addEventListener(`keydown`, this)
		this.addEventListener(`keyup`, this)
		this.attachShadow({ mode: `open`})
		this.shadowRoot.append(style, button) }
	static get sigil ( ) { return `🔑` }
	get active ( ) { return this.hasAttribute `active` }
	set active ( $ ) { $ ? this.setAttribute(`active`, ``) : this.removeAttribute `active` }
	get codes ( ) { return this.getAttribute `codes`.trim().split(/\s+/u) }
	get label ( ) { return this.getAttribute `label` }
	adoptedCallback ( oldDocument, newDocument ) {
		;
			[ `keydown`
			, `keyup` ].forEach($ => {
				if ( oldDocument ) oldDocument.removeEventListener($, this)
				if ( newDocument ) newDocument.addEventListener($, this) }) }
	attributeChangedCallback ( attribute, oldValue, newValue ) {
		if ( attribute == `label` )
			if ( newValue == null )
				this.shadowRoot.querySelector `button`.removeAttribute `aria-label`
			else this.shadowRoot.querySelector `button`.setAttribute(`aria-label`, newValue) }
	connectedCallback ( ) {
		if ( !this.hasAttribute `tabindex` ) this.setAttribute(`tabindex`, 0)
		;
			[ `keydown`
			, `keyup` ].forEach($ => this.ownerDocument.addEventListener($, this)) }
	disconnectedCallback ( ) {
		;
			[ `keydown`
			, `keyup` ].forEach($ => this.ownerDocument.removeEventListener($, this)) }
	handleEvent ( event ) {
		switch ( event.type ) {
			case `keydown`:
				if ( !(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
					&& this.codes.includes(event.code)
					|| event.key == ` ` && event.target == this ) {
					this.active = true
					event.preventDefault()
					if ( event.target == this) event.stopPropagation() }
				break
			case `keyup`:
				if ( this.codes.includes(event.code)
					|| event.key == ` ` && event.target == this ) {
					this.active = false
					event.preventDefault()
					if ( event.target == this) event.stopPropagation() }
				break } } }

export const Surface =ǀ.ǀ= Object.defineProperties(
	class Surface extends HTMLElement {
		constructor ( ) {
			super ()
			const
				canvas = this.ownerDocument.createElement `canvas`
				, pokes = { }
				, style = this.ownerDocument.createElement `style`
				, _context = canvas.getContext `2d`
			style.textContent = `
canvas{ Display: Block; Margin: Auto; Border: None; Background: GrayText; Image-Rendering: OptimizeSpeed }
`
			canvas.setAttribute(`part`, `canvas`)
			canvas.appendChild(this.ownerDocument.createElement `slot`)
			this.attachShadow({ mode: `open`})
			this.shadowRoot.append(style, canvas)
			Object.defineProperties(this,
				{ canvas: { configurable: 0, enumerable: 1, value: canvas, writable: 0 }
				, context: { configurable: 0, enumerable: 1, value: _context, writable: 0 }
				, handleEvent: { configurable: 0, enumerable: 0, value: event => {
					switch ( event.type ) {
						case `mousedown`:
							if ( event.buttons & 1 ) {
								const
									x = this.transformX(event.pageX)
									, y = this.transformY(event.pageY)
								if ( x > 0 && x < this.width && y > 0 && y < this.height ) {
									event.preventDefault() }
								break }
						case `pointercancel`:
						case `pointerup`:
							if ( has(pokes, event.pointerId) ) {
								delete pokes[event.pointerId]
								event.preventDefault() }
							break
						case `pointerdown`:
							if ( event.buttons & 1 ) {
								const
									x = this.transformX(event.pageX)
									, y = this.transformY(event.pageY)
								if ( x > 0 && x < this.width && y > 0 && y < this.height ) {
									pokes[event.pointerId] =
										new Surface.Poke (this, event, event.button)
										console.log(this.pokes.slice())
									event.preventDefault() }
								break }
						case `pointermove`:
							if ( has(pokes, event.pointerId) )
								pokes[event.pointerId].update(event)
							break } }, writable: false }
				, pokes: { configurable: 0, enumerable: 1, value: AByNº(pokes), writable: 0 } }) }
		get height ( ) {
			const height = +(this.getAttribute `height` || 150)
			return isFinite(height) ? height : 150 }
		get pokes ( ) { return AByNº({ }) }
		get width ( ) {
			const width = +(this.getAttribute `width` || 300)
			return isFinite(width) ? width : 300 }
		get x ( ) {
			const x = +this.getAttribute `x`
			return isFinite(x) ? x : 0 }
		get y ( ) {
			const y = +this.getAttribute `y`
			return isFinite(y) ? y : 0 }
		adoptedCallback ( oldDocument, newDocument ) {
			[ `mousedown`
			, `pointerdown`
			, `pointermove`
			, `pointerup`
			, `pointercancel` ].forEach($ => {
				oldDocument.removeEventListener($, this)
				newDocument.addEventListener($, this) }) }
		attributeChangedCallback ( attribute, oldValue, newValue ) {
			if ( attribute == `width` ) this.canvas.width = this.width
			else if ( attribute == `height` ) this.canvas.height = this.height }
		clear ( ) { this.context.clearRect(0, 0, this.canvas.width, this.canvas.height) }
		connectedCallback ( ) {
			[ `mousedown`
			, `pointerdown`
			, `pointermove`
			, `pointerup`
			, `pointercancel` ].forEach($ => this.ownerDocument.addEventListener($, this))
			this.canvas.width = this.width
			this.canvas.height = this.height }
		disconnectedCallback ( ) {
			[ `mousedown`
			, `pointerdown`
			, `pointermove`
			, `pointerup`
			, `pointercancel` ].forEach($ => this.ownerDocument.removeEventListener($, this)) }
		handleEvent ( event ) { }
		transformX ( dimension ) {
			const
				{ width, x } = this.getBoundingClientRect()
				, $x = (+dimension - x - this.x) * this.width / width
			return isFinite($x) ? $x : 0 }
		transformY ( dimension ) {
			const
				{ height, y } = this.getBoundingClientRect()
				, $y = (+dimension - y - this.y) * this.height / height
			return isFinite($y) ? $y : 0 } },
	{ Poke:
		{ configurable: true
		, enumerable: false
		, value: class Poke {
			constructor ( target, { pageX, pageY }, number ) {
				Object.defineProperties(this,
					{ number:
						{ configurable: false, enumerable: true, value: number, writable: false }
					, startX:
						{ configurable: false, enumerable: true, get:
							Surface.prototype.transformX.bind(target, pageX) }
					, startY:
						{ configurable: false, enumerable: true, get:
							Surface.prototype.transformY.bind(target, pageY) }
					, target:
						{ configurable: false, enumerable: false, value: target, writable: false }
					, x:
						{ configurable: true, enumerable: true, get:
							Surface.prototype.transformX.bind(target, pageX) }
					, y:
						{ configurable: true, enumerable: true, get:
							Surface.prototype.transformY.bind(target, pageY) } }) }
			get height ( ) { return get(Surface.prototype) `height`(this.target) }
			get width ( ) { return get(Surface.prototype) `width`(this.target) }
			update ( { pageX, pageY } ) {
				Object.defineProperties(this,
					{ x:
						{ configurable: true, enumerable: true, get:
							Surface.prototype.transformX.bind(this.target, pageX) }
					, y:
						{ configurable: true, enumerable: true, get:
							Surface.prototype.transformY.bind(this.target, pageY) } }) } }
		, writable: false } })
