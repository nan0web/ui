import { LitElement, html, css } from 'lit'

/**
 * UIColor — stable universal color picker.
 */
class UIColor extends LitElement {
	static properties = {
		value: { type: String, reflect: true },
		label: { type: String },
		alpha: { type: Boolean },
	}

	constructor() {
		super()
		this.value = '#0099dc'
		this.label = ''
		this.alpha = false
	}

	static styles = css`
		:host {
			display: block;
			margin-bottom: 6px;
		}
		.row {
			display: grid;
			grid-template-columns: 1fr auto;
			align-items: center;
			gap: 8px;
			min-height: 28px;
		}
		.label {
			font-family: 'SF Mono', 'Fira Code', monospace;
			font-size: 0.65rem;
			font-weight: 600;
			color: var(--fg-dim, rgba(255, 255, 255, 0.6));
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.controls {
			display: flex;
			gap: 4px;
			align-items: center;
			justify-content: flex-end;
		}
		.swatch-btn {
			width: 20px;
			height: 20px;
			border-radius: 4px;
			border: 1.5px solid var(--border, rgba(128, 128, 128, 0.3));
			cursor: pointer;
			position: relative;
			overflow: hidden;
			flex-shrink: 0;
		}
		input[type='color'] {
			position: absolute;
			top: -10px;
			left: -10px;
			width: 40px;
			height: 40px;
			opacity: 0;
			cursor: pointer;
		}
		input[type='range'] {
			width: 50px;
			height: 16px;
			accent-color: var(--co, #0099dc);
			cursor: ew-resize;
		}
		input[type='number'] {
			width: 32px;
			height: 20px;
			background: var(--ba-surface, rgba(128, 128, 128, 0.15));
			border: 1px solid var(--border, rgba(128, 128, 128, 0.2));
			border-radius: 3px;
			color: var(--fg, inherit);
			font-size: 0.65rem;
			text-align: center;
			padding: 0;
			-moz-appearance: textfield;
		}
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		.hex-text {
			font-family: 'SF Mono', 'Fira Code', monospace;
			font-size: 0.6rem;
			color: var(--fg-muted, rgba(255, 255, 255, 0.5));
			min-width: 50px;
			text-align: right;
		}
	`

	_parse() {
		const v = String(this.value || '#000000')
		if (v.startsWith('rgba')) {
			const m = v.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
			if (m) {
				const [r, g, b, a] = [m[1], m[2], m[3], m[4]]
				return { r, g, b, a: parseFloat(a), hex: this._toHex(r, g, b) }
			}
		}
		const hex = v.startsWith('#') ? v : '#000000'
		const r = parseInt(hex.slice(1, 3), 16) || 0
		const g = parseInt(hex.slice(3, 5), 16) || 0
		const b = parseInt(hex.slice(5, 7), 16) || 0
		return { r, g, b, a: 1, hex }
	}

	_toHex(r, g, b) {
		return '#' + [r, g, b].map((c) => Number(c).toString(16).padStart(2, '0')).join('')
	}

	_emit(val) {
		this.value = val
		this.dispatchEvent(
			new CustomEvent('input', {
				detail: { value: val },
				bubbles: true,
				composed: true,
			}),
		)
	}

	_onColor(e) {
		const hex = e.target.value
		const { a } = this._parse()
		if (this.alpha || a < 1) {
			const r = parseInt(hex.slice(1, 3), 16)
			const g = parseInt(hex.slice(3, 5), 16)
			const b = parseInt(hex.slice(5, 7), 16)
			this._emit(`rgba(${r},${g},${b},${a})`)
		} else {
			this._emit(hex)
		}
	}

	_onAlpha(e) {
		e.stopPropagation() // Prevent double event if nested
		const { r, g, b } = this._parse()
		let a = parseFloat(e.target.value)
		if (e.target.type === 'range') a = a / 100
		else a = Math.min(100, Math.max(0, a)) / 100

		this._emit(`rgba(${r},${g},${b},${a.toFixed(2)})`)
	}

	render() {
		const { hex, a } = this._parse()
		const opacity = Math.round(a * 100)

		return html`
			<div class="row">
				<div class="label" title=${this.label}>${this.label || 'Color'}</div>
				<div class="controls">
					<div class="swatch-btn" style="background: ${this.value}">
						<input type="color" .value=${hex} @input=${this._onColor} />
					</div>
					${this.alpha
						? html`
								<input type="range" min="0" max="100" .value=${opacity} @input=${this._onAlpha} />
								<input type="number" min="0" max="100" .value=${opacity} @input=${this._onAlpha} />
								<span style="font-size: 0.55rem; opacity: 0.5;">%</span>
							`
						: html` <span class="hex-text">${hex.toUpperCase()}</span> `}
				</div>
			</div>
		`
	}
}

customElements.define('ui-color', UIColor)
export default UIColor
