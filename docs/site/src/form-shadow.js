import { LitElement, html, css } from 'lit'
import './form-color.js'

/**
 * UIShadow — professional shadow editor.
 * X, Y, Blur, Color with unit selection.
 * Ultra-compact layout.
 */
class UIShadow extends LitElement {
	static properties = {
		value: { type: String, reflect: true },
		label: { type: String },
	}

	constructor() {
		super()
		this.value = '0px 4px 6px rgba(0,0,0,0.1)'
		this.label = ''
	}

	static styles = css`
		:host {
			display: block;
			margin-bottom: 8px;
			padding: 4px 8px;
			background: var(--ba-surface-2, rgba(128, 128, 128, 0.08));
			border-radius: 4px;
			border: 1px solid var(--border, rgba(128, 128, 128, 0.15));
		}
		.label {
			font-family: 'SF Mono', 'Fira Code', monospace;
			font-size: 0.6rem;
			font-weight: 700;
			color: var(--fg, #eee);
			margin-bottom: 4px;
			text-transform: uppercase;
			letter-spacing: 0.03em;
		}
		.grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr) auto;
			gap: 4px;
			align-items: center;
		}
		.input-group {
			display: flex;
			align-items: center;
			background: var(--ba-surface, rgba(0, 0, 0, 0.2));
			border: 1px solid var(--border, rgba(128, 128, 128, 0.2));
			border-radius: 3px;
			padding: 0 2px;
			gap: 1px;
		}
		.input-group:focus-within {
			border-color: var(--co, #818cf8);
		}
		input[type='number'] {
			all: unset;
			width: 100%;
			height: 20px;
			font-size: 0.65rem;
			font-family: monospace;
			color: var(--fg, #eee);
			text-align: center;
		}
		select {
			all: unset;
			font-size: 0.55rem;
			color: var(--fg-dim, rgba(255, 255, 255, 0.4));
			cursor: pointer;
		}
		option {
			background: #1a1a26;
			color: #eee;
		}
		.tag {
			font-size: 0.5rem;
			color: var(--fg-muted, rgba(255, 255, 255, 0.3));
			min-width: 8px;
			text-align: center;
		}
		ui-color {
			margin-bottom: 0;
		}
	`

	_parse() {
		const v = String(this.value || '').trim()
		if (v === 'none' || v === '')
			return { x: 0, xu: 'px', y: 0, yu: 'px', b: 0, bu: 'px', c: 'rgba(0,0,0,0)' }

		const parts = v.split(/\s(?![^(]*\))/)
		const parsePart = (str) => {
			if (!str) return { v: 0, u: 'px' }
			const m = String(str).match(/^([-.\d]+)(px|rem|em|%)?$/)
			if (m) return { v: m[1], u: m[2] || 'px' }
			return { v: parseInt(str) || 0, u: 'px' }
		}

		const x = parsePart(parts[0])
		const y = parsePart(parts[1])
		const b = parsePart(parts[2])
		const c = parts.slice(3).join(' ') || 'rgba(0,0,0,0.1)'

		return { x: x.v, xu: x.u, y: y.v, yu: y.u, b: b.v, bu: b.u, c }
	}

	_update(part, val, unitPart, unitVal) {
		const d = this._parse()
		if (part !== null) d[part] = val
		if (unitPart !== null) d[unitPart] = unitVal
		const newVal = `${d.x}${d.xu} ${d.y}${d.yu} ${d.b}${d.bu} ${d.c}`
		this.value = newVal
		this.dispatchEvent(
			new CustomEvent('input', {
				detail: { value: newVal },
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		const { x, xu, y, yu, b, bu, c } = this._parse()
		const units = ['px', 'rem', 'em', '%']

		const renderInput = (tag, val, unit, key, unitKey) => html`
			<div class="input-group">
				<span class="tag">${tag}</span>
				<input
					type="number"
					.value=${val}
					@input=${(e) => this._update(key, e.target.value, null, null)}
				/>
				<select @change=${(e) => this._update(null, null, unitKey, e.target.value)}>
					${units.map((u) => html`<option value=${u} ?selected=${u === unit}>${u}</option>`)}
				</select>
			</div>
		`

		return html`
			<div class="label" title=${this.label}>${this.label || 'Shadow'}</div>
			<div class="grid">
				${renderInput('X', x, xu, 'x', 'xu')} ${renderInput('Y', y, yu, 'y', 'yu')}
				${renderInput('B', b, bu, 'b', 'bu')}
				<ui-color
					.value=${c}
					alpha
					@input=${(e) => this._update('c', e.detail.value, null, null)}
				></ui-color>
			</div>
		`
	}
}

customElements.define('ui-shadow', UIShadow)
export default UIShadow
