let secuenciaMaquina = [];
let secuenciaUsuario = [];
let ronda = 0;
const cuadros = document.querySelectorAll('.cuadro');

document.querySelector("#boton-empezar").onclick = empezarJuego;

bloquearInputUsuario();

function empezarJuego() {

    reiniciarEstado();
    cambiarBotonInicio('Empezar');
    manejarRonda();

}

function manejarRonda(){

    actualizarEstado("Turno de la maquina");
    bloquearInputUsuario();

    const $nuevoCuadro = obtenerCuadroAleatorio();
    secuenciaMaquina.push($nuevoCuadro);

    const RETRASO_TURNO_JUGADOR = (secuenciaMaquina.length + 1) * 1000;

    secuenciaMaquina.forEach(function($cuadro, index){
        const RETRASO_MS = (index + 1) * 1000;
        setTimeout(function(){
            reproducirSonidoCuadro();
            resaltar($cuadro);
        }, RETRASO_MS);

    });
    
    setTimeout(function(){
        actualizarEstado("Tu turno");
        desbloquearInputUsuario();
    }, RETRASO_TURNO_JUGADOR);

    secuenciaUsuario = [];
    ronda++;
    actualizarNumeroRonda(ronda);

}


function actualizarEstado(estado, error = false) {
    const $estado = document.querySelector('#estado');
    $estado.textContent = estado;
    
    if (error) {
      $estado.classList.remove('alert-primary');
      $estado.classList.add('alert-danger');
    } else {
      $estado.classList.remove('alert-danger');
      $estado.classList.add('alert-primary');
    }

}

function bloquearInputUsuario() {  
    document.querySelectorAll('.cuadro').forEach($boton => {
      $boton.onclick = () => { };
    });
  }

function reiniciarEstado() {   
    secuenciaMaquina = [];
    secuenciaUsuario = [];
    ronda = 0;
  }

function obtenerCuadroAleatorio() {
    const $cuadros = document.querySelectorAll('.cuadro');
    const indice = Math.floor(Math.random() * $cuadros.length);
    return $cuadros[indice];
}
  
function actualizarNumeroRonda(ronda) {

    document.querySelector('#ronda').textContent = ronda;

}


function resaltar($cuadro) {
    $cuadro.style.transform = 'scale(1.1)'; // Escala al 120% de su tamaño
    $cuadro.style.opacity = 1; // Asegura que la opacidad sea visible
    $cuadro.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; // Suaviza la transición
    setTimeout(() => {
        $cuadro.style.transform = 'scale(1)'; // Regresa al tamaño original
        $cuadro.style.opacity = 0.6; // Retorna a la opacidad original
    }, 500);
  }



function manejarInputUsuario(e){
    const $cuadro = e.target;
    resaltar($cuadro);
    secuenciaUsuario.push($cuadro);

    const $cuadroMaquina = secuenciaMaquina[secuenciaUsuario.length - 1];

    if ($cuadro.id !== $cuadroMaquina.id) {
        perder();
        return;
    }

    if (secuenciaUsuario.length === secuenciaMaquina.length) {
        bloquearInputUsuario();
        setTimeout(manejarRonda, 1000);
    }
}

function desbloquearInputUsuario() {
    document.querySelectorAll('.cuadro').forEach(function($cuadro) {
      $cuadro.onclick = manejarInputUsuario;
    });
  }

function perder() {
    reproducirSonidoError();
    bloquearInputUsuario();
    actualizarEstado('Perdiste! haz click en el boton empezar para volver a intentarlo.', true);
    reiniciarEstado();
}

function cambiarBotonInicio(texto) {
    document.querySelector('#boton-empezar').textContent = texto;
}

function reproducirSonidoCuadro() {
    var audio = new Audio('sonidos/burbuja.mp3');
    audio.play();
  }

function reproducirSonidoError() { 
    var audio = new Audio('sonidos/fail.mp3');
    audio.play();
}

cuadros.forEach(cuadro => {
    cuadro.addEventListener('click', reproducirSonidoCuadro);
});
