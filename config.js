// Función que intentará mover el filtro
const intentarMoverFiltro = () => {
    let filtro = document.querySelector(".dvMenFilt");
    let tabla = document.querySelector("#tblDat");

    if (filtro && tabla) {
        tabla.parentNode.insertBefore(filtro, tabla);
        console.log("Filtro movido arriba de la tabla");
        return true; // Éxito
    } else {
        console.log("No se encontró la tabla o el filtro, intentando de nuevo...");
        return false; // No encontró los elementos
    }
};

// Función que usará un observador para detectar cambios en el DOM
const configurarObservador = () => {
    // Crear un observador que detecte cambios en el DOM
    const observer = new MutationObserver((mutations) => {
        // Intentar mover el filtro
        if (intentarMoverFiltro()) {
            // Si tuvo éxito, desconectar el observador
            observer.disconnect();
        }
    });

    // Configurar el observador para que observe todo el documento
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // También intentamos inmediatamente por si los elementos ya están presentes
    if (intentarMoverFiltro()) {
        observer.disconnect();
    }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configurarObservador);
} else {
    configurarObservador();
}

// Como respaldo, también intentamos después de un tiempo
setTimeout(() => {
    intentarMoverFiltro();
}, 2000);

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
