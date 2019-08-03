//utilidades para transaccionar con puchdb

//instancio la base y le pongo nombre
const db = new PouchDB('mensajes');

function guardarMensaje( mensaje ){

    //le agregamos un id xq lo requiere puch
    mensaje._id = new Date().toISOString;

    //grabo en pouch
    return db.put(mensaje).then( () => {
        //si se guardo correctamente
        
        //hay un nuevo registro...cdo recupera internet se lanza
        self.registration.sync.register('nuevo-post');//no podemos mandar el json!
        //el nuevo post se lee en sw en //tareas asincronas

        //esto se manda al frontend
        //le digo q se grabo offline y ok (xq se hizo correctamente)
        const newResp = { ok: true, offline: true};

        return new Response(JSON.stringify(newResp));

    });
};


//posteo de mjes a la API
function postearMensajes()
{
    const posteos = [];


    //recorremos la bd local (pouch) y posteamos todo lo q este pendiente
    //si cierran el navegador, cdo recupere internet lo mismo se guarda!!
    return db.allDocs({include_docs: true})
        .then( docs => {

            //recorro las filas
            docs.rows.forEach( row => {

                const doc = row.doc;

                const fetchProm = fetch('api', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json';
                                    },
                                    body: JSON.stringify( doc )
                                }).then( resp => {
                                    //si realizo el posteo, borramos el registro de la db local 
                                    return db.remove( doc );
                                });

                posteos.push( fetchProm ); 
                
            }); //fin foreach

            return Promise.all( posteos );

        });
        
} 