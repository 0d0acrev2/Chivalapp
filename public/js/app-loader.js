const template = document.createElement('template');

template.innerHTML = `
<div class="loader">
    <svg viewBox="0 0 32 32" width="32" height="32">
        <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
    </svg>
</div>
<style>
@keyframes line {
    0% {
        stroke-dasharray: 2, 85.964;
        -webkit-transform: rotate(0);
            transform: rotate(0);
    }
    50% {
        stroke-dasharray: 65.973, 21.9911;
        stroke-dashoffset: 0;
    }
    100% {
        stroke-dasharray: 2, 85.964;
        stroke-dashoffset: -65.973;
        -webkit-transform: rotate(90deg);
                transform: rotate(90deg);
    }
}
.loader {
    left: 50%;
    top: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
}

.loader #spinner {
    box-sizing: border-box;
    stroke: #673AB7;
    stroke-width: 3px;
    transform-origin: 50%;
    animation: line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite, rotate 1.6s linear infinite;
}
</style>
`;

export default class AppLoader extends HTMLElement {
    constructor(){
        super();
        
        this.attachShadow({ mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('app-loader', AppLoader);