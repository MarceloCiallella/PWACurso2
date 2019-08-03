

class Camara{

    constructor( videoNode ) {
        //hace referencia al <video id="player"
        this.videoNode = videoNode;
        console.log('camara init');

    }

    encender(){
        
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 300,
                height: 300
            }
        }).then( streamDatos => {
            this.videoNode.srcObject = streamDatos;
            this.stream = streamDatos;
        });


    }

    apagar(){

        //congela la imagen pero no detiene el stream
        this.videoNode.pause();
        //stram hace referencia a la linea 22 de este archivo (donde guarda streamDatos)
        if ( this.stream )
            this.stream.getTracks()[0].stop;//detiene el video
    }

    tomarFoto(){
        //creamos elemento canvas para renderizar/dibujar ahí la foto
        let canvas = document.createElement('canvas');

        canvas.setAttribute('width', 300);
        canvas.setAttribute('height', 300);

        //obtener el contexto del canvas
        let context = canvas.getContext('2d');//imagen simple

        //dibujamos/renderizamos la img
        context.drawImage(this.videoNode,0,0, canvas.width, canvas.height);

        //extraemos la img - string en base 64
        this.foto = context.canvas.toDataURL();

        //limpieza
        canvas = null;
        context = null;

        return this.foto;

    }

}