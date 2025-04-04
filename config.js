// Variable para controlar la frecuencia de los mensajes de log
let lastLogTime = 0; // Declarada en el ámbito global
const LOG_INTERVAL = 5000; // Solo mostrar un mensaje cada 5 segundos

// Función para mover dvMen a dvBotonesTabla
const moverDvMen = () => {
    // Buscar el contenedor de dvMen
    let dvMen = document.querySelector(".dvMen");
    let dvBotonesTabla = document.querySelector("#dvBotonesTabla");

    // Si ambos elementos existen, mover dvMen al contenedor dvBotonesTabla
    if (dvMen && dvBotonesTabla) {
        // Verificar si dvMen ya está en la posición correcta
        if (dvMen.parentNode !== dvBotonesTabla) {
            dvBotonesTabla.appendChild(dvMen); // Mover dvMen a dvBotonesTabla
            console.log("Elemento dvMen movido a dvBotonesTabla");
        }
        return true; // Éxito - elementos encontrados
    } else {
        // Si no se encuentran los elementos, mostrar un mensaje de error ocasionalmente
        if (Date.now() - lastLogTime > LOG_INTERVAL) {
            console.log("No se encontró dvMen o el contenedor dvBotonesTabla, intentando de nuevo...");
            lastLogTime = Date.now(); // Actualizar el tiempo del último log
        }
        return false; // No encontró los elementos
    }
};

// Función para mover dvMenFilt a dvFiltros
const moverFiltros = () => {
    // Buscar el contenedor de filtros
    let filtro = document.querySelector(".dvMenFilt");
    let dvFiltros = document.querySelector("#dvFiltros");

    // Si ambos elementos existen, mover el filtro al contenedor dvFiltros
    if (filtro && dvFiltros) {
        // Verificar si el filtro ya está en la posición correcta
        if (filtro.parentNode !== dvFiltros) {
            dvFiltros.appendChild(filtro); // Mover el filtro a dvFiltros
            console.log("Filtro movido a dvFiltros");
        }
        return true; // Éxito - elementos encontrados
    } else {
        // Si no se encuentran los elementos, mostrar un mensaje de error ocasionalmente
        if (Date.now() - lastLogTime > LOG_INTERVAL) {
            console.log("No se encontró el filtro o el contenedor dvFiltros, intentando de nuevo...");
            lastLogTime = Date.now(); // Actualizar el tiempo del último log
        }
        return false; // No encontró los elementos
    }
};

const configurarObservador = () => {
    let checkCounter = 0;

    const observer = new MutationObserver((mutations) => {
        checkCounter++;
        if (checkCounter % 10 !== 0) return; // Solo procesar 1 de cada 10 cambios

        // Intentar mover dvMen y filtros silenciosamente (sin log a menos que tenga éxito)
        moverDvMen();
        moverFiltros();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Intentar mover dvMen y filtros inmediatamente por si ya están presentes
    moverDvMen();
    moverFiltros();

    return observer;
};

let filterObserver;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        filterObserver = configurarObservador();
    });
} else {
    filterObserver = configurarObservador();
}

// Como respaldo, también intentamos periódicamente pero sin generar tantos logs
setInterval(() => {
    moverDvMen(); // Modo silencioso
    moverFiltros(); // Modo silencioso
}, 2000); // Revisar cada 2 segundos

// window.fetchSV = function (icono, elemento) {
//     elemento.innerText = elemento.getAttribute("title") || "Botón";
// };

// Asegurarse de que el DOM esté cargado antes de inicializar
document.addEventListener("DOMContentLoaded", initExitModal);
function initExitModal() {
  const modal = document.getElementById("salesist-exitModal");
  const btnSalir = document.getElementById("saleSis");
  const btnConfirm = document.getElementById("confirmExit");
  const btnCancel = document.getElementById("cancelExit");

  if (!modal || !btnSalir || !btnConfirm || !btnCancel) {
    console.error("Uno o más elementos necesarios no se encontraron en el DOM");
    return;
  }

  btnSalir.onclick = function () {
    modal.style.display = "block";
  };

  btnConfirm.onclick = function () {
    location.reload(); // O la acción que desees realizar al salir
  };

  btnCancel.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Script para abrir y cerrar el menú lateral
document.addEventListener("DOMContentLoaded", function () {
    // Función para abrir el menú lateral
    function openSideNav() {
        document.getElementById("mySidenav").classList.add("open");
    }

    // Función para cerrar el menú lateral
    function closeSideNav() {
        document.getElementById("mySidenav").classList.remove("open");
    }

    // Asignar eventos a los botones
    var openNavBtn = document.getElementById("openNav");
    if (openNavBtn) {
        openNavBtn.addEventListener("click", openSideNav);
    }

    var closeNavBtn = document.getElementById("cierraNav");
    if (closeNavBtn) {
        closeNavBtn.addEventListener("click", closeSideNav);
    }

    // También puedes cerrar el menú cuando se hace clic fuera de él
    document.addEventListener("click", function (event) {
        var sidenav = document.getElementById("mySidenav");
        var openNavBtn = document.getElementById("openNav");

        if (sidenav.classList.contains("open") &&
            event.target !== sidenav &&
            !sidenav.contains(event.target) &&
            event.target !== openNavBtn &&
            !openNavBtn.contains(event.target)) {
            closeSideNav();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Crear solo una vez el overlay
    const overlayTemp = document.createElement('div');
    overlayTemp.id = 'overlayTemp';
    Object.assign(overlayTemp.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.4)', // Puedes cambiar color
        zIndex: '1000', // Debajo de dvCap
        pointerEvents: 'all',
        display: 'none'
    });
    document.body.appendChild(overlayTemp);

    // Funciones globales para mostrar/ocultar manualmente (opcional)
    window.mostrarOverlay = () => overlayTemp.style.display = 'block';
    window.ocultarOverlay = () => overlayTemp.style.display = 'none';

    // Observador para detectar cuando se muestre una dvCap
    const observer = new MutationObserver(() => {
        const dvCaps = document.querySelectorAll('.dvCap');

        dvCaps.forEach(dvCap => {
            const isVisible = window.getComputedStyle(dvCap).display !== 'none';

            if (isVisible) {
                // Insertar el overlay antes de esta dvCap si no está ya
                if (overlayTemp.nextSibling !== dvCap) {
                    dvCap.parentNode.insertBefore(overlayTemp, dvCap);
                }

                // Mostrar el overlay
                overlayTemp.style.display = 'block';
            }
        });

        // Si no hay ninguna dvCap visible, ocultamos el overlay
        const algunaVisible = Array.from(dvCaps).some(dvCap =>
            window.getComputedStyle(dvCap).display !== 'none'
        );
        if (!algunaVisible) {
            overlayTemp.style.display = 'none';
        }
    });

    // Iniciar el observador
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Overlay inicializado y observando dvCap.");
});
// Simulación de carga asíncrona con un tiempo de espera
setTimeout(function () {
    const loaderWrapper = document.getElementById("loader-wrapper");
    if (loaderWrapper) {
      loaderWrapper.style.display = "none";
    } else {
      // console.error('Elemento de carga no encontrado en el DOM');
    }
  }, 1000); // Simulated time: 3 seconds



  