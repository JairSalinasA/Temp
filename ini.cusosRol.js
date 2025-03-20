
document.querySelector("#openNav").addEventListener('click', e => {
   document.querySelector("#mySidenav").style.width = "250px";
});

rol = JSdbk.rol;
let sideMenu = document.querySelector("#itemsMenu");
let nli;
let jsICusos = JSON.parse(JSdbk.icusos);

// Verificar si JSdbk.nomRol tiene un valor
if (JSdbk.nomRol) {
    // Mostrar el botón del menú
    document.querySelector("#openNav").style.display = "block";
} else {
    // Ocultar el botón del menú
    document.querySelector("#openNav").style.display = "none";
}
for (i = 0; i < jsICusos.datos.length; i++) {
   nli = document.createElement("div");

   nAn = document.createElement("a");
   nAn.innerText = jsICusos.datos[i][1];
   nAn.setAttribute("cuso", jsICusos.datos[i][0]);
   //nAn.setAttribute("cuso", jsICusos.datos[i][0]);
   if (jsICusos.datos[i][2]) nAn.setAttribute("ejcuso", jsICusos.datos[i][2]);
   nAn.addEventListener("click", evt => {
      document.querySelector("#mySidenav").style.width = "0";      
      ldCuso(evt.target.getAttribute("cuso"), 2, "\"deIni\":\"1\"", evt.target.getAttribute("ejcuso"));
   });

   nli.appendChild(nAn);   
   sideMenu.appendChild(nli);
}

document.querySelector("#aNomRol").innerHTML =
   "<img src='./img/awesome/duotone/users-class.svg' style='height:16px; width:16px;'></img>&nbsp;&nbsp;" + JSdbk.nomRol;


// document.querySelector("#saleSis").addEventListener("click", (evt) => {
//    if (!confirm('¿Salir de la aplicación?')) throw 'Nada';
//    location.reload();
// });

document.querySelector("#dvPie").style.display = "flex";
document.querySelector("#dvPie").style.justifyContent = "center";
document.querySelector("#dvPie").style.alignItems = "center";

document.querySelector('#cierraNav').addEventListener("click", evt => {
   document.querySelector("#mySidenav").style.width = "0";
});


let datUsu = document.querySelector("#hUsu");
if (datUsu) {
   datUsu.style.display = 'inline'
   datUsu.addEventListener('click', e => {
      ldCuso("usuarios.alter.cap_pwx", 1);
   });
}

if (JSdbk.msjIni) {
   createModal(JSdbk.msjIni);
}

document.addEventListener("DOMContentLoaded", function() {
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
   document.addEventListener("click", function(event) {
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




 