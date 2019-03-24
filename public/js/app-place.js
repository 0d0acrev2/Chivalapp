import AppLoader from './app-loader.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        h1 {
            position: absolute;
            top: 0;
            left: 0;
            color: white;
            font-weight: bold;
            margin-left: 10px;
            text-transform: uppercase;
            padding: 3px;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.7);
        }
        nav img {
            height: inherit;
            margin: 0 auto;
            display: block;
            max-width: 100vw;
        }
        nav p {
            position: absolute;
            bottom: 0;
            left: 0;
            margin: 0 auto;
            width: 100%;
            margin-bottom: 20px;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
        }
        nav {
            position: relative;
            height: 200px;
            width: 100%;
            object-fit: cover;
        }
        section h2 {
            color: white;
            font-weight: bold;
            margin: 10px 10px 0 10px;
        }
    </style>
`;

export default class AppPlace extends HTMLElement {
  constructor(placeID) {
    super();

    this.attachShadow({ mode: 'open' });

    this.placeID = placeID;
    this.placeName = document.querySelector('header div');
    this.placeName.textContent = "EVENTI";
    this.main = document.body.querySelector('main');
  }

  async connectedCallback() {
    //const data = await (await fetch(`/getPlace?${this.placeID}`).json());
    const data = await (await fetch(`/getPlace?placeID=0`)).json();

    this.popolateContent(data);
  }

  popolateContent(data) {
    template.innerHTML += `
      <div>
        <nav>
          <img id='place-img' src='${data.img}'>
          <h1>${data.nome}</h1>
          <p id='place-desc'>${data.descrizione}</p>
        </nav>
        <section>
          <h2>Eventi Futuri</h2>
        </section>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('app-place', AppPlace);