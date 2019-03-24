import AppLoader from './app-loader.js';
import Parallax from './parallax.js';

const template = document.createElement('template');
template.innerHTML = `
    
`;

class EventPage extends HTMLElement {
  constructor(eventID) {
    super();
    this.eventID = eventID;
    this.placeName = document.querySelector('header div');
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.data = await (await fetch(`${app.apiUrl}/getEvent?eventID=${this.eventID}&userID=${firebase.auth().currentUser.uid}`)).json();
    this.popolateContent(this.data);
    this.btnPartecipa = this.shadowRoot.querySelector('#btn-partecipa');

    if (this.data.partecipo) {
      this.btnPartecipa.innerHTML = `<i class="material-icons">check_circle</i>`;
    }

    this.initializeListeners();
  }

  popolateActivities() {
    const sectionActivities = this.shadowRoot.querySelector('#activities');

    for (const activity of this.data.activities) {
      const string = `<div class='activity'>
        <div id='quale'>${activity.genre}</div>
        <div id='nome-chi'>${new Date(activity.start_time).toLocaleTimeString()}</div>
        <div id='chi'><div class="inline-fab" style="background-image: url('${activity.photo}');"></div></div>
        <!--<div id='chi'><i class="material-icons">account_circle</i></div>-->
      </div>`;
      sectionActivities.innerHTML += string;
    }
  }

  popolateMaterials() {
    const sectionMaterials = this.shadowRoot.querySelector('#needed-materials');
    let string = `<ul id='materiali-necessari'>`;

    for (const current of this.data.materials) {
      string += `
        <li>
          <label class="pure-material-checkbox">
            <input quantity=${current.quantity} type="checkbox">
            <span>${current.material}</span>
          </label>
          <!--<div class="inline-fab" style="background-image: url('https://www.gravatar.com/avatar/0100300101230001005c0400e1000000?d=robohash');"></div>-->
        </li>
      `;
    }
    string += ` </ul> `;

    if (this.data.partecipo) {
      string += `
        <form id="form-new-materials">
          <div class="input-box">
            <div class="box-materiale">
              <input class="field materiale" type="text" placeholder="Risorsa" autocomplete="off" autocorrect="off" autocapitalize="off">
              </div>
            <div class="fab-add"><i class="material-icons">add</i></div>
          </div>
          <input id="Aggiungi" class="btn" type="submit" value="Aggiungi">
        </form>
      `
    }

    sectionMaterials.innerHTML += string;


    sectionMaterials.querySelectorAll('ul li label input').forEach(checkbox => {
      const quantity = Number(checkbox.getAttribute('quantity'))

      if (quantity === 0) {
        console.log(checkbox);
        checkbox.setAttribute('checked', true);
        checkbox.setAttribute('disabled', true);
      }
    });

    this.fabAdds = this.shadowRoot.querySelectorAll('.fab-add');

    const btn = this.shadowRoot.querySelector('#form-new-materials');
    if(btn){
      btn.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const materiali = Array.from(this.shadowRoot.querySelectorAll('input.field.materiale')).map(m => {
          
          return {
            nome: m.value,
            quantity: 0,
          }
        });
        await fetch(`${app.apiUrl}/propongoPortoIo?eventID=${this.eventID}&materiale=${materiali[0].nome}`);

      });
    }

    this.fabAdds.forEach(fab => fab.addEventListener('click', onFabAddClick.bind(this)));

    function onFabAddClick(evt) {
      const fab = evt.target.closest('.fab-add');
      const lastInputField = fab.previousElementSibling;
      const newInputField = lastInputField.cloneNode(true);
      fab.parentElement.insertBefore(newInputField, fab);
    }

  }

  popolateContent(data) {
    this.placeName.textContent = data.title;

    template.innerHTML = `
      <div>
        <nav>
          <div id='place-img' style="background-image: url('${data.photo}');"></div>
          <!--<section class="section-parallax">
            <div class="parallax-container">
              <div class="parallax">
                <img src="${data.photo}">
              </div>
            </div>
          </section>-->
          <div id='maps-link'><i class="material-icons">near_me</i></div>
        </nav>
        <div class='wrapper'>
          <section id='activities'>
            <h2>Attività</h2>
          </section>
        </div>
        <div class='wrapper'>
          <section>
            <h2>Descrizione</h2>
            <div id='desc'>${data.description}
            <br>  <br>  
              Partecipanti: ${data.count}/${data.capacity} <br>
              Data Evento: ${new Date(data.start_time).toLocaleDateString()} <br>
              Orario di Inizio: ${new Date(data.start_time).toLocaleTimeString()}
            </div>
          </section>
        </div>
        <div class='wrapper'>
          <section id='needed-materials'>
            <h2>Necessità</h2>
          </section>
        </div>

        <div>
          <div id='btn-partecipa'>Partecipa</div>
        </div>
      </div>

      <link type="text/css" rel="stylesheet" href="css/parallax.css">
      <link type="text/css" rel="stylesheet" href="fonts/material-icons/icon.css">
      <style>

        .fab-add {
          position: absolute;
          border-radius: 90px;
          background-color: #7e57c2;
          color: #eee;
          width: 36px;
          height: 36px;
          right: 14%;
          bottom: calc(57px / 2 - 18px);
          text-align: center;
        }
    
        .fab-add > i {
          line-height: 36px !important;
        }

        h5 {
          width: 250px;
          margin: auto;
          margin-top: 15px;
        }
    
        .field {
          border: 0;
          border-bottom: solid 1px #7e57c2;
          outline: 0;
          cursor: pointer;
          width: 250px;
          height: 57px;
          padding-left: 5px;
          color: #eee;
          font-size: 14px;
          font-family: Roboto-Regular;
          display: block;
          margin: auto;
          background-color: #121212;
        }

        .input-box {
          position: relative;
        }

        .btn {
          background-color: #7e57c2;
          padding: 10px;
          color: #eee;
          text-transform: uppercase;
          cursor: pointer;
          margin: 24px auto;
          border: 0px;
          outline: none;
          display: block;
        }
    
        .btn i {
          margin-left: 12px;
          transform: translateY(6px);
        }

        .box-materiale {
          width: 250px;
          margin: auto;
        }
    
        .box-materiale > .field {
          margin: 0;
          margin-right: 5px;
          display: inline;
          background-color: #424242;
        }

        #place-img {
          height: 200px;
          margin: 0 auto;
          display: block;
          max-width: 100vw;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          background-size: cover;
        }
        nav {
          position: relative;
          height: auto;
          width: 100%;
          object-fit: cover;
          margin-bottom: 14px;
        }
        nav #maps-link {
          position: absolute;
          right: 10px;
          bottom: -32.5px;
          margin: 5px;
          background: black;
          color: #eee;
          text-transform: uppercase;
          background-color: #7e57c2;
          border-radius: 90px;
          width: 65px;
          height: 65px;
          box-shadow: 0px 2px 3px rgba(0,0,0,0.5);
          text-align: center;

        }
        nav #maps-link i {
          line-height: 65px;
          font-size: 34px;
        }
        section {
          display: block;
          background: white;
          width: inherit;

          margin: 0 auto;
          padding: 18px 10px;
          border-radius: 13px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
          background-color: #424242;
        }
        section h2 {
          font-weight: bold;
          margin: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 4px;
        }
        .activity {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 8px 0px;
        }
        .activity div {
          align-self: center;
          width: 33%;
          text-align: center;
        }
        .wrapper {
          padding: 10px;
          color: #eee !important;
        }

        #chi i {
          color: #eee;
          font-size: 48px;
        }

        #materiali-necessari .inline-fab,
        #chi .inline-fab {
          width: 48px;
          height: 48px;
          border-radius: 90px;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          background-size: cover;
          margin: auto;
          background-color: #eee;
        }

        /* CheckBox */
        .pure-material-checkbox {
          z-index: 0;
          position: relative;
          display: inline-block;
          color: rgba(var(--pure-material-onsurface-rgb, 238, 238, 238), 0.87);
          font-family: var(--pure-material-font, "Roboto", "Segoe UI", BlinkMacSystemFont, system-ui, -apple-system);
          font-size: 16px;
          line-height: 1.5;
        }
      
        /* Input */
        .pure-material-checkbox > input {
          appearance: none;
          -moz-appearance: none;
          -webkit-appearance: none;
          z-index: -1;
          position: absolute;
          left: -10px;
          top: -8px;
          display: block;
          margin: 0;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          background-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.6);
          box-shadow: none;
          outline: none;
          opacity: 0;
          transform: scale(1);
          pointer-events: none;
          transition: opacity 0.3s, transform 0.2s;
        }
      
        #materiali-necessari {
          list-style-type: none;
        }

        /* Span */
        .pure-material-checkbox > span {
          display: inline-block;
          width: 100%;
          cursor: pointer;
        }
      
        /* Box */
        .pure-material-checkbox > span::before {
          content: "";
          display: inline-block;
          box-sizing: border-box;
          margin: 3px 11px 3px 1px;
          border: solid 2px; /* Safari */
          border-color: rgba(var(--pure-material-onsurface-rgb, 238, 238, 238), 0.6);
          border-radius: 2px;
          width: 18px;
          height: 18px;
          vertical-align: top;
          transition: border-color 0.2s, background-color 0.2s;
        }
      
        /* Checkmark */
        .pure-material-checkbox > span::after {
          content: "";
          display: block;
          position: absolute;
          top: 3px;
          left: 1px;
          width: 10px;
          height: 5px;
          border: solid 2px transparent;
          border-right: none;
          border-top: none;
          transform: translate(3px, 4px) rotate(-45deg);
        }
      
      /* Checked, Indeterminate */
      .pure-material-checkbox > input:checked,
      .pure-material-checkbox > input:indeterminate {
          background-color: #7e57c2;
      }
      
      .pure-material-checkbox > input:checked + span::before,
      .pure-material-checkbox > input:indeterminate + span::before {
          border-color: #7e57c2;
          background-color: #7e57c2;
      }
      
      .pure-material-checkbox > input:checked + span::after,
      .pure-material-checkbox > input:indeterminate + span::after {
          border-color: rgb(var(--pure-material-onprimary-rgb, 255, 255, 255));
      }
      
      .pure-material-checkbox > input:indeterminate + span::after {
          border-left: none;
          transform: translate(4px, 3px);
      }
      
      /* Hover, Focus */
      .pure-material-checkbox:hover > input {
          opacity: 0.04;
      }
      
      .pure-material-checkbox > input:focus {
          opacity: 0.12;
      }
      
      .pure-material-checkbox:hover > input:focus {
          opacity: 0.16;
      }
      
      /* Active */
      .pure-material-checkbox > input:active {
          opacity: 1;
          transform: scale(0);
          transition: transform 0s, opacity 0s;
      }
      
      .pure-material-checkbox > input:active + span::before {
          border-color: #7e57c2;
      }
      
      .pure-material-checkbox > input:checked:active + span::before {
          border-color: transparent;
          background-color: rgba(var(--pure-material-onsurface-rgb, 238, 238, 238), 0.6);
      }
      
      /* Disabled */
      .pure-material-checkbox > input:disabled {
          opacity: 0;
      }
      
      .pure-material-checkbox > input:disabled + span {
          color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
          cursor: initial;
      }
      
      .pure-material-checkbox > input:disabled + span::before {
          border-color: currentColor;
      }
      
      .pure-material-checkbox > input:checked:disabled + span::before,
      .pure-material-checkbox > input:indeterminate:disabled + span::before {
          border-color: transparent;
          background-color: currentColor;
      }
      #desc {
        padding: 10px;
      }
      #btn-partecipa {
        transition: height .3s ease;
        background-color: #424242;
        padding: 10px;
        color: black;
        text-transform: uppercase;
        cursor: pointer;
        right: 0;
        bottom: 0;
        margin-right: 10px;
        border: 2px solid black;
        border-radius: 13px;
        margin-bottom: 80px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        width: 80%;
        display: block;
        margin: auto;
        margin-top: 15px;
        text-align: center;
        color: #eee;
      }
      #btn-partecipa:hover {
        box-shadow: 0 6px 9px rgba(0,0,0,0.16), 0 6px 9px rgba(0,0,0,0.23);
      }
      #btn-partecipa i {
        color: #7e57c2 !important;
      }
    </style>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    //Parallax.checkParallax.call(this);

    this.popolateActivities();
    this.popolateMaterials();

  }

  async onBtnPartecipaClick(evt) {
    await fetch(`${app.apiUrl}/subscribeToEvent?eventID=${this.eventID}&userID=${firebase.auth().currentUser.uid}`);
    this.btnPartecipa.innerHTML = `<i class="material-icons">check_circle</i>`
  }

  async onCheckboxClick(evt) {
    const checkbox = evt.target.closest('input[type="checkbox"]');

    const value = checkbox.nextElementSibling.textContent;
    /// Implementarlo
    await fetch(`${app.apiUrl}/loPortoIo?eventID=${this.eventID}&userID=${firebase.auth().currentUser.uid}&materiale=${value}`)
  }

  initializeListeners() {
    if (!this.data.partecipo)
      this.btnPartecipa.addEventListener('click', this.onBtnPartecipaClick.bind(this), { once: true });

    this.shadowRoot.querySelectorAll('input[type="checkbox"]:not([checked])').forEach((checkbox) => {
      checkbox.addEventListener('click', this.onCheckboxClick.bind(this));
    })
  }
}

customElements.define('event-page', EventPage);

export default EventPage;
