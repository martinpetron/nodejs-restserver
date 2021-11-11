
const myForm = document.querySelector('form');


const url = ( window.location.hostname.includes('localhost') ) //estoy en desarrollo
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-node-mpetron.herokuapp.com/api/auth/';

myForm.addEventListener('submit', ev => {
    ev.preventDefault(); //evita hacer un refresh del navegador.
    
    const formData = {};

    //me fijo todos los elementos del formulario que tienen NAME (excluyo asi el boton)
    for (let el of myForm.elements ) {
        if ( el.name.length > 0 ) {
            formData[el.name] = el.value
        }        
    }
    // console.log (formData);

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if (msg) {
            return console.error(msg);
        }

        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err);
    })

});




function onSignIn(googleUser) {

    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    //Fetch API
    fetch( url + 'google' , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( data )
    })
    .then( resp => resp.json() ) //convertir a json la respuesta
    // .then( data => console.log (' Our server ', data) ) //mostrar la respuesta
    .then( ({ token }) => {
        localStorage.setItem( 'token', token );
        window.location = 'chat.html';
    })
    .catch( console.log );  //catchear errores
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}
