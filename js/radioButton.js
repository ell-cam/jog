/**
 * Summary: Defines Radio Button custom HTML element
 *
 * Authors:
 *  Rishi Bidani
 */

class RadioButton extends HTMLElement {
    constructor() {
        super();
        this.text = this.getAttribute('data-text');
        this.name = this.getAttribute('data-name');
        this.checked = this.getAttribute('data-checked') === "true" || false;
    }
    connectedCallback() {
        const html = /*html*/`
            <style>
            .radio-button input[type="radio"] {
                display: none;
            }
            .radio-button {
                --selected-clr: #2ecc71;
                width: fit-content;
                padding: 0.5rem 1rem;
                border: 1px solid gray;
                background-color: var(--input-unselected-clr);
                text-transform: capitalize;
            }
            .radio-button:has(input:checked) {
                background-color: var(--input-selected-clr);
                background-color: var(--selected-clr);
            }
            </style>
            <label class="radio-button">
                <input type="radio" 
                    value="${this.text}"
                    name="${this.name}" 
                    id="${this.name}" 
                    ${this.checked ? 'checked' : ''}
                >
                <span>${this.text}</span>
            </label>
        `
        this.outerHTML = html;
    }
}

window.customElements.define("radio-button", RadioButton);