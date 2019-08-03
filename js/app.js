
var url = window.location.href;
var swLocation = '/twittor/sw.js';


if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = 'sw.js';
    }else{
        swLocation = 'sw.js';
    }


    navigator.serviceWorker.register( swLocation );
}


// Referencias de jQuery

var googleMapKey = 'AIzaSyDyJPPlnIMOLp20Ef1LlTong8rYdTnaTXM';


// Referencias de jQuery

var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

var btnActivadas = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

var btnLocation      = $('#location-btn');

var modalMapa        = $('.modal-mapa');

var btnTomarFoto     = $('#tomar-foto-btn');
var btnPhoto         = $('#photo-btn');
var contenedorCamara = $('.camara-contenedor');

var lat  = null;
var lng  = null; 
var foto = null; 


// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;


//init de la camara

const camara = new Camara( $('#player')[0] ); 


// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje, lat, lng, foto) {

    // console.log(mensaje, personaje, lat, lng);

    var content =`
    <li class="animated fadeIn fast"
        data-tipo="mensaje">


        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
                `;
    
    if ( foto ) {
        content += `
                <br>
                <img class="foto-mensaje" src="${ foto }">
        `;
    }
        
    content += `</div>        
                <div class="arrow"></div>
            </div>
        </li>
    `;

    
    // si existe la latitud y longitud, 
    // llamamos la funcion para crear el mapa
    if ( lat ) {
        crearMensajeMapa( lat, lng, personaje );
    }
    
    // Borramos la latitud y longitud por si las usó
    lat = null;
    lng = null;

    $('.modal-mapa').remove();

    timeline.prepend(content);
    cancelarBtn.click();

}

function crearMensajeMapa(lat, lng, personaje) {


    let content = `
    <li class="animated fadeIn fast"
        data-tipo="mapa"
        data-user="${ personaje }"
        data-lat="${ lat }"
        data-lng="${ lng }">
                <div class="avatar">
                    <img src="img/avatars/${ personaje }.jpg">
                </div>
                <div class="bubble-container">
                    <div class="bubble">
                        <iframe
                            width="100%"
                            height="250"
                            frameborder="0" style="border:0"
                            src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                            </iframe>
                    </div>
                    
                    <div class="arrow"></div>
                </div>
            </li> 
    `;

    timeline.prepend(content);
}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             txtMensaje.val('');
         });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    

    //envío el POST!!!!!!!!!!!!!!!!
    //no tengo la api, lo comento
    // var data = {
    //     mensaje: mensaje,
    //     user: usuario,
    //     lat: lat,
    //     lng: lng,
    //     foto: foto
    // };

    // fetch('api', {
    //     method: 'POST',
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify( data )
    // })
    // .then( res => res.json())
    // .catch ( err => {
    //     console.log(err);
    // })



    //el usuario sale del data-user de cada imagen (spiderman, etc)
    crearMensajeHTML( mensaje, usuario, lat, lng, foto);

    foto = null;
    contenedorCamara.addClass('oculto');

});






function getMensajes()
{
    
    //aqui ejecutaría un REST q obtenga los mensajes
    //todo lo de la api se va a almacenar SOLO en la cache dinamica y la vamos actualizando
    /*
    ejemplo con lo mismo q hicimos abajo pero viene de un GET
            fetch('api')
            .then( res => res.json())
            .then( posts => {
                
                console.log(posts);

                posts.forEach( post => {
                    crearMensajeHTML(post.mensaje, post.user, post.lat, post.lng, post.foto);
                })
                

            })
    */
   


    //simulo el get
    let myObj = {
        "0":{
            _id: "XXX", 
            mensaje: "Hola mundo", 
            user: "spiderman",
            lat: "-31.2394818",
            lng: "-64.3074809",
            foto: ""
         },
         "1":{
            _id: "XXX", 
            mensaje: "Hola mundo2", 
            user: "ironman"
         },
         "2":{
            _id: "XXX", 
            mensaje: "Hola mundo3", 
            user: "hulk"
         }
      };
    
        
        console.log(myObj);

        for (let i in myObj) 
        {
            
           crearMensajeHTML(myObj[i].mensaje, myObj[i].user,  myObj[i].lat,  myObj[i].lng,  myObj[i].foto);
        }
    
}

getMensajes();








//detectar on line offline
//https://dmuy.github.io/Material-Toast/
function isOnLine()
{
    if ( navigator.onLine)
    {
        //console.log('online');
        $.mdtoast('Tienes internet', {
           
            interaction: true,
            interactionTimeout: 2000,
            actionText: 'Ok :)',
            type: 'info'
        });
    }
    else
    {
        //console.log('offline');
        $.mdtoast('Revisa tu conexion a internet', {
            interaction: true,
            actionText: 'Ok :(',
            type: 'error'
        });

    }
}


//escucho los eventos
window.addEventListener('online', isOnLine);
window.addEventListener('offline', isOnLine);

//vuelvo a disparar el isonline para q cdo cargue ya lo sepamos
isOnLine();
//https://dmuy.github.io/Material-Toast/






// NOTIFICATIONS
//Activa o desativa las suscrip a notif.
function verificaSuscripcion( activadas )
{
    if ( activadas )
    {
        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');
    }
    else
    {
        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }
}
verificaSuscripcion();



function enviarNotificacion()
{

    const notificationOptions = {
        body: 'Este es el cuerpo de la notificacion',
        icon: '../10-twittor-offline-posting/img/icons/icon-72x72.png'
    }     

    const n = new Notification( 'Hola mundo', notificationOptions );

    n.onclick = () => {
        console.log('Click');
    }
}


function notificarme()
{
    if ( !window.Notification )
    {
        return $.mdtoast('El navegador no acepta notificaciones', {
            interaction: true,
            actionText: 'Ok :(',
            type: 'error'
        });
        
    }


    //si ya aceptó las notificaciones...
    if( Notification.permission === 'granted')
    {
        enviarNotificacion();
    }
    else if ( Notification.permission !=='denied' || Notification.permission !== 'default' )
    {
        //pedimos permiso al usuario
        Notification.requestPermission( function (permission) {

            console.log(permission);

            if (permission === 'granted')
            {
                enviarNotificacion();
            }
            else
            {
                
            }

        });
    }
}

//notificarme();




// CAMARA Y GEOLOCALIZACION

// Crear mapa en el modal
function mostrarMapaModal(lat, lng) {

    $('.modal-mapa').remove();
    
    var content = `
            <div class="modal-mapa">
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0"
                    src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                    </iframe>
            </div>
    `;

    modal.append( content );
}


// Obtener la geolocalización
btnLocation.on('click', () => {

        $.mdtoast('Cargando Mapa...Aguarde', {
            
            interaction: true,
            interactionTimeout: 2000,
            actionText: 'Ok :)',
            type: 'Modal'
        });


        navigator.geolocation.getCurrentPosition( pos => {

            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            mostrarMapaModal(lat, lng);
        });
        

});



// Boton de la camara
// usamos la funcion de fleca para prevenir
// que jQuery me cambie el valor del this
btnPhoto.on('click', () => {

    contenedorCamara.removeClass('oculto');
    camara.encender();

});


// Boton para tomar la foto
btnTomarFoto.on('click', () => {

    foto = camara.tomarFoto();
    camara.apagar();
    
    
    //console.log(foto);
});


// Share API
