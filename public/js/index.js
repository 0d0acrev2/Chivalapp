import EventList from './event-list.js';
import AppPlace from './app-place.js';
import CreateEventPage from './create-event-page.js';

import {checkUserStatus, showLoginPage, addLoginPageListeners} from './login.js';

const vett = [];
function showProfilePage() {
  const main = document.querySelector('main');
  main.innerHTML = '<button class="btn btn-logout">Logout</button>';
  
  const btnLogout = document.querySelector('.btn-logout');

  btnLogout.addEventListener('click', onBtnLogoutClick);

  function onBtnLogoutClick(evt) {
    firebase.auth().signOut().then(() => {
      showLoginPage();
    }, error => {
      console.log(error);
    });
  }
}

function showCreateEventPage() {
  //history.pushState({ createEvent: true }, "create", "createEvent");
  const main = document.querySelector('main');

  main.innerHTML = '';
  main.appendChild(new CreateEventPage())
}

window.showHomePage = () => {
  const main = document.querySelector('main');

  main.innerHTML = '';
  main.appendChild(new EventList("Prossimamente"));
  main.appendChild(new EventList("Nel tuo quartiere"));
  main.appendChild(new EventList("Nelle vicinanze"));
}
function initListeners() {
  const bottomMenu = document.querySelector('#bottom-menu');

  bottomMenu.addEventListener('click', onBottomMenuClick);

  function onBottomMenuClick(evt) {
    const menuItem = evt.target.closest('.menu-item');

    if (menuItem) {
      const {page: pageName} = menuItem.dataset
      
      switch (pageName) {
        case 'Profilo':
          showProfilePage();
          break;
        case 'Aggiungi':
          showCreateEventPage();
          break;
        case 'Home':
          showHomePage();
          break;
        default:
      }
    }
  }
}

function regSw() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/subaru-sw.js');
  }
}

window.addEventListener('load', () => {
  regSw();
  initListeners();
});

