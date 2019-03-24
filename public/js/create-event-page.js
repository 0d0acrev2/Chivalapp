const template = document.createElement('template');
template.innerHTML = `
  <style>
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

    .box-materiale {
      width: 250px;
      margin: auto;
    }

    .box-materiale > .field {
      width: 100px;
      margin: 0;
      margin-right: 5px;
      display: inline;
    }

    .box-materiale .field:nth-child(1) {
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

    /*cards*/
    .card-container {
      flex-wrap: nowrap;
      overflow-x: scroll;
      display: flex;
      -webkit-overflow-scrolling: touch;
      margin-bottom: 20px;
    }

    .card-container:last-child {
      margin-bottom: 70px;
    }

    .card-container::-webkit-scrollbar {
      display: none;
    }

    .card {
      margin-left: 10px;
      height: 150px;
      border-radius: 3px;
      flex: 0 0 65%;
      max-width: 330px;
      color: #fff;
      background-color: #7e57c2;
      transition: opacity 0.555s cubic-bezier(0, 0, 0.21, 1);
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
      opacity: 0.8;
    }

    .template {
      position: absolute;
      width: 100%;
      height: auto;
      background-color: rgba(0, 0, 0, 0.95);
      bottom: 0;
      padding: 6px 8px 10px;
      box-shadow: 0px -13px 25px 8px rgba(0, 0, 0, 0.95);
    }

    .template-name {
      font-size: 16px;
      width: 100%;
    }

    h2 {
      color: #eee;
      margin-left: 10px;
    }

    .input-box {
      position: relative;
    }

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

  </style>
  <link rel="stylesheet" href="fonts/material-icons/icon.css">

  <form id="form-new-event">
    <input id="nome-evento" class="field" type="text" placeholder="Nome evento" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input id="luogo" class="field" type="text" placeholder="Luogo" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input id="orario-inizio" class="field" type="text" placeholder="Orario inizio" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input id="capacita" class="field" type="number" placeholder="Capacità" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input id="description" class="field" type="texts" placeholder="Descrizione" autocomplete="off" autocorrect="off" autocapitalize="off">
    <h5>Attività</h5>
    <div class="input-box">
      <input class="field attivita" type="text" placeholder="" autocomplete="off" autocorrect="off" autocapitalize="off">
      <div class="fab-add"><i class="material-icons">add</i></div>
    </div>
    <h5>Materiali</h5>
    <div class="input-box">
      <div class="box-materiale">
        <input class="field materiale" type="text" placeholder="Risorsa" autocomplete="off" autocorrect="off" autocapitalize="off">
        <input class="field quantita" type="number" placeholder="Quantità" autocomplete="off" autocorrect="off" autocapitalize="off">
      </div>
      <div class="fab-add"><i class="material-icons">add</i></div>
    </div>
    <input id="crea" class="btn" type="submit" value="Crea">
  </form>

  <h2>Template</h2>
  <div class="card-container">
    <div class="card use-template">
      <div class="template">
        <div class="template-name">Cena privata</div>
      </div>
    </div>
    <div class="card use-template">
      <div class="template">
        <div class="template-name">Concerto in piazza</div>
      </div>
    </div>
    <div class="card use-template">
      <div class="template">
        <div class="template-name">Cena di quartiere</div>
      </div>
    </div>
  </div>
`;

export default class CreateEventPage extends HTMLElement {

  constructor() {
    super();

    this.placeName = document.querySelector('header div');
    this.placeName.innerHTML = 'CREAZIONE EVENTO';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.inputNomeEvento = this.shadowRoot.querySelector('#nome-evento');
    this.orarioDiInizio = this.shadowRoot.querySelector('#orario-inizio');
    this.listaAttivita = this.shadowRoot.querySelectorAll('.attivita');
    this.listaMateriali = this.shadowRoot.querySelectorAll('.materiale');
    this.luogo = this.shadowRoot.querySelector('#luogo');
    this.capacita = this.shadowRoot.querySelector('#capacita');
    this.fabAdds = this.shadowRoot.querySelectorAll('.fab-add');
    this.descrizione = this.shadowRoot.querySelector('#description');

    this.btnUtilizzaTemplate = this.shadowRoot.querySelectorAll('.use-template');
    this.btnCreaEvento = this.shadowRoot.querySelector('#crea');

    this.btnUtilizzaTemplate.forEach(btn => btn.addEventListener('click', this.onBtnUtilizzaTemplateClick.bind(this)));
    this.btnCreaEvento.addEventListener('click', this.onBtnCreaEventoClick.bind(this));

    this.fabAdds.forEach(fab => fab.addEventListener('click', onFabAddClick.bind(this)));

    function onFabAddClick(evt) {
      const fab = evt.target.closest('.fab-add');
      const lastInputField = fab.previousElementSibling;
      const newInputField = lastInputField.cloneNode(true);
      fab.parentElement.insertBefore(newInputField, fab);
    }
  }

  async onBtnCreaEventoClick(evt) {
    evt.preventDefault();
    const activities = [];
    const materiali = [];

    for(const activity of Array.from(this.shadowRoot.querySelectorAll('.input-box input'))){
      activities.push({
        genre: activity.value,
        start_time: Date.now()
      });
    }
    
    console.log(this.shadowRoot.querySelectorAll('.box-materiale input.materiale'))
    for(const div of this.shadowRoot.querySelectorAll('.box-materiale input.materiale')){
      materiali.push({ nome: div.value, quantity: div.nextElementSibling.value})
    }

    await fetch(`${app.apiUrl}/createEvent`, {
      method: "post",
      headers : {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: this.inputNomeEvento.value,
        fake_place: this.luogo.value,
        materials: materiali,
        description: this.descrizione.value,
        activities,
        capacity: this.capacita.value,
      }),
    });
  }

  onBtnUtilizzaTemplateClick() {
    this.inputNomeEvento.value = "Dibattiti";
    this.orarioDiInizio = Date.now();

    this.descrizione.value = "Questo evento è STRETTAMENTE RISERVATO a chi è interessato a parteciparvi.";

    this.listaAttivita[0].value = "Spadate";

    this.listaMateriali[0].value = "Tavolino";
    this.listaMateriali[0].nextElementSibling.value = 30;
    this.luogo.value = "Cortile di casa mia";

    this.capacita.value = 50;
  }

  async connectedCallback() {
    //
  }
}

customElements.define('createevent-page', CreateEventPage);