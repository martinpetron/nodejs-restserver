
const url = ( window.location.hostname.includes('localhost') ) //estoy en desarrollo
? 'http://localhost:8080/api/auth/'
: 'https://restserver-node-mpetron.herokuapp.com/api/auth/';

let localUser    = null;
let socket  = null;

//Referencias HTML
const txtUid        = document.querySelector('#txtUid');
const txtMensaje    = document.querySelector('#txtMensaje');
const ulUsuarios    = document.querySelector('#ulUsuarios');
const ulMensajes    = document.querySelector('#ulMensajes');
const btnSalir      = document.querySelector('#btnSalir');


//validar el token del localstorage
const validateJWT = async() => {
    try {
        
        const token = localStorage.getItem('token') || '';

        if (token.length <= 10 ) {
            window.location = 'index.html';
            throw new Error ('No hay token en el servidor')
        }

        const resp = await fetch( url, {
            headers: { 'x-token': token }
        });

        const { user: userDB, token: tokenDB } = await resp.json();
        localStorage.setItem('token', tokenDB);
        localUser = userDB;

        document.title = localUser.name;

        await connectSocket();
        
    } catch (error) {
        window.location = 'index.html';
    }

    
}

const connectSocket  = async() => {

    socket = io({
        'extraHeaders': { 
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    });

    socket.on('receive-messages', drawMessages);

    socket.on('active-users', drawUsers);

    socket.on('private-message', (payload) => {
        console.log('Privado: ', payload)
    });

};



const drawUsers = ( users = [] ) => {

    let usersHtml = '';
    users.forEach( ({ name, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML= usersHtml;

}

const drawMessages = ( messages = [] ) => {

    let messagesHtml = '';
    messages.forEach( ({ name, message }) => {
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${ name }: </span>
                    <span>${ message }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML= messagesHtml;

}

//LEO TODO LAS TECLAS QUE SE PRESIONAN EN ESTE LUGAR DEL HTML
// txtMensaje.addEventListener('keyup',(ev)=>{
//     console.log(ev)
// })

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const message = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }
    if (message.length === 0) { return; } //TODO: agregar trim

    socket.emit('send-message', { message, uid } );
    txtMensaje.value='';
    
})


const main = async() => {

    //Validar JWT
    await validateJWT();

};

main();

// const socket = io();