import { LitElement, html, css } from 'lit'

/**
 * ShadowInput — box-shadow editor with inline text input.
 * Single-row layout: label | text input
 *
 * @element ui-shadow-input
 * @attr {string} value - CSS box-shadow value
 * @attr {string} label - Label text
 * @fires input - Dispatched when value changes, detail = { value }
 */
class UIShadowInput extends LitElement {
	static properties = {
		value: { type: String, reflect: true },
		label: { type: String },
	}

	constructor() {
		super()
		this.value = 'none'
		this.label = ''
	}

	static styles = css`
		:host {
			display: block;
		}
		.row {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;
			gap: 8px;
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
		input {
			height: 26px;
			padding: 2px 6px;
			font-size: 0.65rem;
			font-family: 'SF Mono', 'Fira Code', monospace;
			background: var(--ba-surface, rgba(128, 128, 128, 0.15));
			border: 1px solid var(--border, rgba(128, 128, 128, 0.2));
			border-radius: 4px;
			color: var(--fg, inherit);
			outline: none;
			box-sizing: border-box;
			width: 100%;
		}
		input:focus {
			border-color: var(--co, #0099dc);
		}
		.preview {
			width: 100%;
			height: 8px;
			border-radius: 4px;
			background: var(--ba-surface, rgba(128, 128, 128, 0.15));
			margin-top: 4px;
		}
	`

	/** @param {Event} e */
	_onInput(e) {
		this.value = e.target.value
		this._emit()
	}

	_emit() {
		this.dispatchEvent(
			new CustomEvent('input', {
				detail: { value: this.value },
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		return html`
			<div class="row">
				${this.label ? html`<div class="label">${this.label}</div>` : ''}
				<div>
					<input type="text" .value=${this.value} @input=${this._onInput} />
					${this.value && this.value !== 'none'
						? html`<div class="preview" style="box-shadow: ${this.value};"></div>`
						: ''}
				</div>
			</div>
		`
	}
}

if (!customElements.get('ui-shadow-input')) {
	customElements.define('ui-shadow-input', UIShadowInput)
}

export default UIShadowInput
