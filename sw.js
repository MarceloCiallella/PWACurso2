importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v6';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmut-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];


const APP_SHELL_INMUT = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
    'js/sw-utils.js'
];

self.addEventListener('install', e => {


    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {

        cache.addAll(APP_SHELL);
    })

    const cacheInmut = caches.open(INMUTABLE_CACHE).then(cache => {

        cache.addAll(APP_SHELL_INMUT);
    })
    
    e.waitUntil( Promise.all([cacheStatic, cacheInmut]) );


});



self.addEventListener('activate', e => {

    //para que no crezca indefinidamente la cache cada vez q cambio de versiones
    //es decir, cada vez q cambie version, el navegador va a guardar un archivo nuevo!
    //EJ. staticv2 y staticv3....dejaría los dos creados, pero quiero q mantenga el ultimo
    //lo que hago aqui es dejar el ultimo...q esta en cache_static_name!
    const respuesta = 
    caches.keys().then(keys => {

        keys.forEach( key => {

            if ( key !== STATIC_CACHE && key.includes('static'))
            {
                return caches.delete(key);
            }

            if ( key !== DYNAMIC_CACHE && key.includes('dynamic'))
            {
                return caches.delete(key);
            }

        })
    })
    
    e.waitUntil( respuesta );

});




self.addEventListener('fetch', e =>{

   

   const respuesta = caches.match( e.request ).then (resp => {

    if (resp)
    {
        return resp;
    }
    else
    {
        return fetch( e.request).then ( newResp => {

            //esta funcion esta en js/sw-utils (hace el importscrip en la linea 1 )
            return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp);

        });
    }

   }); 


    e.respondWith( respuesta );



});
