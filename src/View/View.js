import { empty, equal, typeOf } from "@nan0web/types"
import Frame, { FrameRenderMethod } from "../Frame/Frame.js"
import Locale from "../Locale.js"
import StdOut from "../StdOut.js"
import StdIn from "../StdIn.js"
import InputMessage from "../InputMessage.js"
import RenderOptions from "./RenderOptions.js"

class View {
	/** @type {typeof RenderOptions} */
	static RenderOptions = RenderOptions
	/** @type {typeof FrameRenderMethod} */
	static RenderMethod = Frame.RenderMethod
	/** @type {StdIn} */
	stdin
	/** @type {StdOut} */
	stdout
	/** @type {number} */
	startedAt
	/** @type {Frame} */
	frame
	/** @type {Locale} */
	locale
	/** @type {Map} */
	vocab
	/** @type {number[]} */
	windowSize
	/** @type {Map} */
	components
	/** @type {string} */
	renderMethod
	/**
	 * @param {object} [input]
	 * @param {StdIn} [input.stdin]
	 * @param {StdOut} [input.stdout]
	 * @param {number} [input.startedAt]
	 * @param {Frame} [input.frame]
	 * @param {Locale} [input.locale]
	 * @param {Map} [input.vocab]
	 * @param {number[]} [input.windowSize]
	 * @param {Map} [input.components]
	 * @param {string} [input.renderMethod]
	 */
	constructor(input = {}) {
		const {
			stdin = new StdIn(),
			stdout = new StdOut(),
			startedAt = Date.now(),
			frame = new Frame(),
			locale = new Locale("uk-UA"),
			vocab = new Map(),
			windowSize = [0, 0],
			components = new Map(),
			renderMethod = Frame.RenderMethod.VISIBLE,
		} = input
		this.stdin = stdin
		this.stdout = stdout
		this.startedAt = startedAt
		this.frame = frame
		this.locale = locale
		this.vocab = vocab
		this.windowSize = null === windowSize ? this.stdout.getWindowSize() : windowSize
		this.components = components
		this.renderMethod = renderMethod
		if (!empty(frame)) {
			this.render(1)(this.frame)
		}
	}
	get empty() {
		return empty(this.frame)
	}
	get RenderMethod() {
		return /** @type {typeof View} */ (this.constructor).RenderMethod
	}
	get RenderOptions() {
		return /** @type {typeof View} */ (this.constructor).RenderOptions
	}
	getWindowSize() {
		return equal(this.windowSize, [0, 0]) ? this.stdout.getWindowSize() : this.windowSize
	}
	setWindowSize(width, height) {
		this.windowSize = [width, height]
	}
	startTimer() {
		this.startedAt = Date.now()
	}
	spent(checkpoint = this.startedAt) {
		return Math.round((Date.now() - checkpoint) / 1000)
	}
	/**
	 * @param {boolean|number|function} [shouldRender=0]
	 * @param {RenderOptions} [options]
	 * @returns {(value: Frame|string|string[], ...args: any) => Frame}
	 */
	render(shouldRender = 0, options = new this.RenderOptions()) {
		const [width, height] = this.getWindowSize()
		options = this.RenderOptions.from({
			...options,
			renderMethod: this.renderMethod, width, height,
			// @ts-ignore
		})
		const renderFn = "function" === typeof shouldRender // no errors.
			// const renderFn = typeOf(Function)(shouldRender) // Property 'bind' does not exist on type 'number | boolean | Function'.
			? shouldRender.bind(this) : typeOf(String)(shouldRender)
				? this.components.get(shouldRender)?.bind(this)
				: null

		return (value, ...args) => {
			if (renderFn) {
				/** @type {Frame} */
				let rendered = renderFn.bind(this)(value, ...args)
				if (!(rendered instanceof Frame)) {
					rendered = new Frame({
						value: rendered,
						renderMethod: options.renderMethod,
						width: options.width,
						height: options.height,
					})
				}
				rendered = View.fixFrame(rendered, options)
				rendered = rendered.transform(this.t.bind(this))
				rendered.render()
				if (options.render) {
					this.stdout.write(String(rendered))
					this.frame = rendered
				}
				return rendered
			}

			let frame = Frame.from({ ...options, value })
			frame = View.fixFrame(frame, options)
			let clearFrame = false
			if (String(frame.value[0] ?? "") === Frame.BOF) {
				frame.value = frame.value.slice(1)
				clearFrame = true
			}
			let translated = options.translateFrame ? frame.transform(this.t.bind(this)) : frame
			translated = View.fixFrame(translated, options)

			let rendered = translated
			rendered.render()
			if (shouldRender) {
				if (clearFrame) {
					const distance = options.height - frame.value.length
					this.stdout.write(Frame.BOF)
					for (let i = 0; i < distance; i++) {
						this.stdout.write(Frame.EOL)
					}
				}
				this.stdout.write(Frame.RESET + String(rendered))
				this.frame = rendered
			}
			return rendered
		}
	}

	clear(shouldRender = 0) {
		const [width, height] = this.windowSize
		const frame = new Frame({ width, height, renderMethod: Frame.RenderMethod.REPLACE })
		frame.value = []
		for (let i = 0; i < height; i++) frame.value.push([])
		return this.render(shouldRender)(frame)
	}

	progress(shouldRender = false) {
		return (value) => {
			const frame = Frame.from(value)
			frame.renderMethod = Frame.RenderMethod.REPLACE
			return this.render(!!shouldRender)(frame)
		}
	}

	t(value) {
		if (typeOf(Array)(value)) {
			value = value.map(row => {
				if (typeOf(Array)(row)) {
					return row.map(col => {
						return this.vocab.has(col) ? this.vocab.get(col) : col
					})
				}
				return this.vocab.has(row) ? this.vocab.get(row) : row
			})
			return value
		}
		return this.vocab.has(value) ? this.vocab.get(value) : value
	}

	debug(...args) {
		return this.render(1)([
			[StdOut.STYLES.dim,
				"Debug: ", args.join(" "), Frame.EOL, StdOut.RESET],
		])
	}

	info(...args) {
		return this.render(1)([
			[StdOut.COLORS.green,
				"Info : ", args.join(" "), Frame.EOL, StdOut.RESET],
		])
	}

	warn(...args) {
		return this.render(1)([
			[StdOut.COLORS.yellow,
				"Warn : ", args.join(" "), Frame.EOL, StdOut.RESET],
		])
	}

	error(...args) {
		return this.render(1)([
			[StdOut.COLORS.red, StdOut.STYLES.bold,
				"Error: ", args.join(" "), Frame.EOL, StdOut.RESET],
		])
	}

	/**
	 * @param {string} name
	 * @param {Function} component
	 */
	register(name, component) {
		if (undefined === component && "function" === typeof name) {
			component = name
			name = component.name
		}
		this.components.set(name, component)
	}

	/**
	 * @param {string} name
	 */
	unregister(name) {
		this.components.delete(name)
	}

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return this.components.has(name)
	}

	/**
	 * @param {string} name
	 * @returns {Function}
	 */
	get(name) {
		return this.components.get(name)
	}

	/**
	 * @param {InputMessage} input
	 * @returns {Promise<InputMessage | null>}
	 */
	async ask(input) {
		const name = input.constructor.name.replace(/Input$/, "")
		const component = this.get(name)
		if (component) {
			return await component.ask.apply(this, [input])
		}
		let result = null
		do {
			const answer = await this.stdin.read()
			result = input.constructor.from(answer)
		} while (!result.isValid() && !result.escaped)
		return result.escaped ? null : result
	}

	/**
	 * @param {Frame} frame
	 * @param {RenderOptions} [options]
	 * @returns {Frame}
	 */
	static fixFrame(frame, options = new RenderOptions()) {
		if (options.resizeToView && !equal(options.width, frame.width, options.height, frame.height)) {
			frame.setWindowSize(options.width, options.height)
		}
		// @todo add multiline visibility, for instance extended frame row into rows if it's wider than width.
		return frame
	}

}

export default View
