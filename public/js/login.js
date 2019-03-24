import EventList from './event-list.js';

const loginTemplate = document.createElement('template');
loginTemplate.innerHTML = `
  <form id="form-login">
    <input class="login-field" type="email" name="email" placeholder="E-mail" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input class="login-field" type="password" name="password" placeholder="Password" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input class="btn" type="submit" value="Login">
  </form>
  <a id="sign-up-page">Registrati</a>
  <div class="social-btns">
    <img class="social-btn-login" src="/img/google_btn.png">
    <img class="social-btn-login" src="/img/fb_btn.png">
  </div>
`;

const signUpTemplate = document.createElement('template');
signUpTemplate.innerHTML = `
  <form id="form-signup">
    <input class="signup-field" type="email" name="email" placeholder="E-mail" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input class="signup-field" type="password" name="password" placeholder="Password" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input class="signup-field" type="text" name="nome" placeholder="Nome" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input class="signup-field" type="text" name="cognome" placeholder="Cognome" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input class="signup-field" type="text" name="location" placeholder="Location" autocomplete="off" autocorrect="off" autocapitalize="off">
    <input class="btn" type="submit" value="Registrati">
  </form>
`;

function checkUserStatus(user = firebase.auth().currentUser) {
  if (user) {
    const {displayName, email} = user;
    console.log({displayName, email});
    showHomePage();
  } else {
    showLoginPage();
    console.log('User not logged in');
  }
}

function showLoginPage() {
  const main = document.querySelector('main');
  const dom = loginTemplate.content.cloneNode(true);

  main.innerHTML = '';
  main.appendChild(dom);

  addLoginPageListeners();
}

function addLoginPageListeners() {
  const form = document.querySelector('#form-login');
  const btnSignUpPage = document.querySelector('#sign-up-page');

  form.addEventListener('submit', onFormSubmit);
  btnSignUpPage.addEventListener('click', onSignUpPageClick);

  function onSignUpPageClick(evt) {
    evt.preventDefault();
    showSignUpPage();
  }

  function onFormSubmit(evt) {
    evt.preventDefault();

    const email = this.querySelector('input[name=email]').value;
    const password = this.querySelector('input[name=password]').value;

    authenticateUser(email, password);
  }
}


async function showSignUpPage() {
  const main = document.querySelector('main');
  const dom = signUpTemplate.content.cloneNode(true);

  main.innerHTML = '';
  main.appendChild(dom);

  document.querySelector('[name=location]').value = await getCurrentPosition();

  addSignUpPageListeners();
}

function addSignUpPageListeners() {
  const form = document.querySelector('#form-signup');

  form.addEventListener('submit', onFormSubmit);

  function onFormSubmit(evt) {
    evt.preventDefault();

    const email = this.querySelector('input[name=email]').value;
    const password = this.querySelector('input[name=password]').value;
    const nome = this.querySelector('input[name=nome]').value;
    const cognome = this.querySelector('input[name=cognome]').value;
    const location = this.querySelector('input[name=location]').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async () => {
        console.log('Registrazione effettuata con successo');
        const {uid} = firebase.auth().currentUser;

        const response = await fetch(`${app.apiUrl}/syncNewUser`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            nome,
            cognome,
            location,
          }),
        });
      })
      .catch(error => {
        console.log(`${error.code}: ${error.message}`);
      });
  }
}

function authenticateUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Login avvenuto con successo');
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        console.log('Wrong password.');
      } else {
        console.log(errorMessage);
      }

      console.log(error);
    });
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(`${position.coords.latitude},${position.coords.longitude}`);
    });
  });
}

export {checkUserStatus, showLoginPage, addLoginPageListeners};
