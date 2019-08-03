 

//si hago un cambio en este archivo, NO lo toma automaticamente
//tiene q ser un nuevo SW...por ende se suben las versiones o del static (para post, get, etc) o lo q corresponda


// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {


    if ( res.ok ) {

        return caches.open( dynamicCache ).then( cache => {

            cache.put( req, res.clone() );
            
            return res.clone();

        });

    } else {
        return res;
    }

}

// Cache with network update
function actualizaCacheStatico( staticCache, req, APP_SHELL_INMUTABLE ) {


    if ( APP_SHELL_INMUTABLE.includes(req.url) ) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );

    } else {
        // console.log('actualizando', req.url );
        return fetch( req )
                .then( res => {
                    return actualizaCacheDinamico( staticCache, req, res );
                });
    }



}

//network with cache fallback / update
// entra aca cdo diga algo con /api en este caso
function manejoApiMensajes( cacheName, req, )
{
    
    //estrategia para el POST
    if ( req.clone().method === 'POST')
    {
        //si el navegador soporta Sync (nackground sync)
        //chequeo de navegadores q soportan: 
        //https://www.caniuse.com/#search=syncmanager
        if (self.registration.sync)
        {
            //hay q guardar en el indexDB
            return req.clone().text().then( body => {

                //recupero el json
                const bodyObj = JSON.parse( body );
                //esta funcion está en sw-db
                return guardarMensaje(bodyObj);//esto lo va a retornar al sw...al manejo del fetch
            });
        }
        else
        {
            //navegadores q no lo soportan van a pasar x aca.
            return fetch( req );
        }

         

    }
    else
    {
        //esto maneja los GET
        return fetch( req ).then( res =>{

            if (res.ok)
            {
                actualizaCacheDinamico(cacheName, req, res.clone());
                return res.clone();
            }    
            else
            {
                return caches.match(req);
            }

        }).catch( err => {

            return caches.match(req);
        })
    }
    
    
    
    
}