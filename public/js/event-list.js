import EventPage from './event-page.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .list-header {
      width: 100%;
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #fff;
      padding: 0 10px;
    }

    .list-header .filter-name {
      float: left;
    }

    .list-header .action {
      float: right;
      font-size: 12px;
    }

    .card-container {
      flex-wrap: nowrap;
      overflow-x: scroll;
      display: flex;
      -webkit-overflow-scrolling: touch;
      margin-bottom: 20px;
    }

    .card-container:last-child {
      margin-bottom: 30px;
    }

    .card-container::-webkit-scrollbar {
      display: none;
    }

    .card {
      margin-left: 10px;
      height: 190px;
      border-radius: 3px;
      flex: 0 0 80%;
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
    
    .event {
      position: absolute;
      width: 100%;
      height: auto;
      background-color: rgba(0, 0, 0, 0.95);
      bottom: 0;
      padding: 6px 8px 10px;
      box-shadow: 0px -13px 25px 8px rgba(0, 0, 0, 0.95);
    }

    .event-name {
      font-size: 16px;
      width: 100%;
    }

    .event-date {
      font-size: 12px;
      width: 100%;
    }
  </style>

  <div class="list-header">
    <span class="filter-name"></span>
    <!--<span class="action">ESPANDI</span>-->
  </div>
`;

const eventCardTemplate = document.createElement('template');
eventCardTemplate.innerHTML = `
  <div class="card">
    <div class="event">
      <div class="event-name"></div>
      <div class="event-date"></div>
    </div>
  </div>
`;

class EventList extends HTMLElement {
  constructor(tag) {
    super();
    this.getHomePageEventList(tag);
    this.placeName = document.querySelector('header div');
    this.placeName.innerHTML = 'Home';
  }

  async getHomePageEventList(tag) {
    const response = await fetch(`${app.apiUrl}/getHomePageEventList?tag=${tag}`);
    const eventList = await response.json();
    const {filterName, events} = eventList;

    this.createShadowDOM(events);
    this.filterName = filterName;
  }

  get filterName() {
    return this.getAttribute('filter-name');
  }

  set filterName(value) {
    this.setAttribute('filter-name', value);
    this.shadowRoot.querySelector('.filter-name').textContent = value;
  }

  createShadowDOM(events) {
    this.attachShadow({mode: 'open'});
    const dom = template.content.cloneNode(true);
    const cardContainer = this.createCardsDOM(events);

    this.shadowRoot.appendChild(dom);
    this.shadowRoot.appendChild(cardContainer).addEventListener('click', (evt) => {
      const card = evt.target.closest('.card');

      const eventID = Number(card.getAttribute('event-id'));
      
      document.body.querySelector('main').innerHTML = '';
      document.body.querySelector('main').appendChild(new EventPage(eventID));
      
      /* window.history.pushState({
        eventID
      }, "Titolo", eventID);
      */
    });
  }

  createCardsDOM(events) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    for (const event of events) {
      const {title, start, photo, event_id} = event;
      const card = eventCardTemplate.content.cloneNode(true);
      
      card.querySelector('.event-name').textContent = title;
      card.querySelector('.event-date').textContent = new Date(start).toLocaleDateString();
      cardContainer.appendChild(card);

      const appendedCard = Array.from(cardContainer.querySelectorAll('.card')).reverse()[0];
      appendedCard.style.backgroundImage = `url(${photo})`;
      appendedCard.setAttribute('event-id', event_id);
    }

    return cardContainer;
  }
}

customElements.define('event-list', EventList);

export default EventList;
