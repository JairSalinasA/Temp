
// Capas
let dvWrk;
let dvMen;
let dvTit;
let hcuso = "";
let cusini;
let ipdom = "";
let redir;
let arrDvWrk = new Array(0);
let arrDvMen = new Array(0);
let arrDvTit = new Array(0);
let arrLay = new Array(0);
let procex = false;
let ventana = false;
let wzoom=1;

let stx = -1;
let band;

let icoR;
let gifW;
let icoNada;
let miWS;
let smc;

let JSdbk;
let JSdfr;

//// Para lista BASE
let selReg = null;

//-- Para Back
let ws;
let rutaBk;
let hostBk;
let archURL;
let wsErr;
let cuerda;

// // Service Worker//// ---> Comentado hasta poner PWA
// if ('serviceWorker' in navigator) {
//    navigator.serviceWorker.register('/sw.js')
//       .then(reg => console.log('sw registrado'))
//       .catch(err => console.log('sw no registrado', err));
// }

fetch("/getIP")
   .then(function (response) {
      response.text().then(function (xx) { ipdom = xx })
   });

//fetch("data/redir.json")
//   .then(function (response) {
//      response.text().then(function (xx) { redir = JSON.parse(xx) })
//   });



document.querySelector('#dvErr').addEventListener("click", evt => {
   evt.target.style.display = "none";
   document.querySelector('#mostrador').style.display = 'block';
});


document.addEventListener('DOMContentLoaded', function () {
   fetch("data/params.json")
      .then(function (response) {
         return response.json();
      })
      .then(function (items) {
         for (let [key, value] of Object.entries(items)) {
            if (key == "bd") bd = value;
            if (key == "ws") ws = value;
            if (key == "rutaBk") rutaBk = value;
            if (key == "hostBk") hostBk = value;
            if (key == "archURL") archURL = value;
            if (key == "icoR") icoR = value;
            if (key == "icoNada") icoNada = value;
            if (key == "gifW") gifW = value;
            if (key == "cusini") cusini = value;
            if (key == "Titulo") {
               let dvt = document.querySelector('#titulo');
               if (dvt) dvt.innerText = value;
            }
         }
         if (cusini)
            ldCuso(cusini, 0, "smc");
      });

});


////// Agrega Capa /////////
const agrLayer = (nom) => {
   let lienzo = document.querySelector('#mostrador');

   if (arrLay.length == 0) {
      lienzo.innerText = '';
      arrDvWrk = [];
      arrDvMen = [];
      arrLay = [];
   };

   //// Creamos nuevo Array ///
   arrLay.push([[]]);
   sObj('cuso', nom);
   sObj('lcuso', '');

   ///// Siguiente wrkDiv
   let nnDiv = document.createElement("div");
   nnDiv.setAttribute("id", "dvWrk" + nom);
   nnDiv.style.display = "none";
   nnDiv.className = "dvWrk";

   arrDvWrk.push(nnDiv);
   dvWrk = arrDvWrk[arrDvWrk.length - 1];
   lienzo.appendChild(dvWrk);
   sObj('wrk', nnDiv);

   ////// Para Menu
   nnDiv = document.createElement("div");
   nnDiv.setAttribute("id", "dvMen" + nom);
   nnDiv.className = "dvMen";
   arrDvMen.push(nnDiv);
   dvMen = arrDvMen[arrDvMen.length - 1];
   lienzo.appendChild(dvMen);
   sObj('men', nnDiv);

   ////// Para Titulo
   nnDiv = document.createElement("div");
   nnDiv.setAttribute("id", "dvTit" + nom);
   nnDiv.style.display = "none";
   nnDiv.className = "dvTit";
   arrDvTit.push(nnDiv);
   dvTit = arrDvTit[arrDvTit.length - 1];
   lienzo.appendChild(dvTit);
   sObj('tit', nnDiv);

}


const ldCuso = (cuso, lay, parms, ejcuso) => {
   //ejCuso = cuso;
   //if (ejcuso) cuso=ejcuso;
   if (!ejcuso) ejcuso = cuso;
   let loaderHTML = `<div id="loader-wrapper">
   <div id="loader"></div>
   <img src="./img/cropped.png"
       alt="Icono de Carga" class="loader-icon">
   </div>`;
  document.querySelector("#hCuso").innerHTML = loaderHTML;
   // document.querySelector("#hCuso").innerHTML = "<img src='" + gifW + "' />";  // Espera

   let arCuso = cuso.split(".");
   let arEjCuso = ejcuso.split(".");
   let vaCuso = true;
   let pgC;
   let jsC;
   let dtC;


   if (!lay) lay = 0;   //-1= No Actúa en Lay   0=Resetea el Contenido   1=Nuevo Layer  2=Ini

   let valParms = new Promise((resolve, reject) => {   /// Valida Parametros de Entrada
      if (arCuso.length != 3)
         reject("parámetro cuso malformado");
      resolve();
   });


   let wsX = new Promise((resolve, reject) => {   /// Extrae/Envia Datos a media capa
      // Checamos que el cuso esté bien formado   

      let cparms;
      if (!parms) cparms = ""
      else cparms = parms + ",";

      smc = parms == 'smc';
      if (smc || procex) {
         resolve();
      }

      let miWS;

      let strJ = "";
      if (dvWrk) {
         let cc = "input[shk],select[shk],textarea[shk],span[shk]";
         let lista = dvWrk.querySelectorAll(cc);
         lista.forEach(function (elem) {
            let dato, nombre;
            if (elem.nodeName == "SPAN") {
               dato = elem.innerText; nombre = elem.getAttribute("name");
            }
            else { dato = elem.value; nombre = elem.name }
            if (elem.classList.contains('varo'))
               dato = dato.replace("$", "").replaceAll(",", "");
            strJ += "\"" + nombre + "\":" + JSON.stringify(dato) + ",";
         });
      }

      if (dvTit) {
         let cc = "input[shk],select[shk],textarea[shk]";
         let lista = dvTit.querySelectorAll(cc);
         lista.forEach(function (elem) {
            strJ += "\"" + elem.name + "\":" + JSON.stringify(elem.value) + ",";
         });
      }



      strJ = "{" + strJ + cparms
         + "\"cuso\":\"" + cuso
         + "\",\"stx\":\"" + stx
         + "\",\"ipdom\":\"" + ipdom
         + "\",\"lay\":\"" + lay
         + "\"}"
         ;

      let JSObj = JSON.parse(strJ);
      strJ = JSON.stringify(JSObj);


      //////////
      sockAdd = "ws://" + hostBk + "/" + rutaBk + "/" + ws;


      if (!procex) {
         miWS = new WebSocket(sockAdd);
         procex = true;
      }

      miWS.onerror = function (event) {
         procex = false;
         reject("Media capa inaccesible");
      };

      miWS.onopen = function () {
         miWS.send(strJ);
      }

      miWS.onmessage = function (evento) {
         try {
            JSdbk = JSON.parse(evento.data);
            // error desde mc
            if (JSdbk.hasOwnProperty("excpMsg")) reject(JSdbk.excpMsg)
            else
               if (JSdbk.hasOwnProperty("excp")) reject(JSdbk.excp); // error desde mc

         } catch (e) {
            reject(e)
         } finally { procex = false; } // reabrimos para envio
         ; // error al parsear
         miWS.close();
      };

      miWS.onclose = function (evento) {
         procex = false;
         resolve("cierra mc");
      }

   })
      //  } //--> aqui
      ;


   let frPag = new Promise((resolve, reject) => {  /// Front Stat
      if (lay == '-1') resolve();
      else
         fetch("/getCuso", {
            method: 'POST',
            body: JSON.stringify({ cuso: { a: "html", b: arCuso[0], c: arCuso[1], d: arCuso[2] } })
         }).then(function (response) {
            return response.text().then(function (pag) {
               if (pag.startsWith("--")) pgC = null;
               else {
                  agrLayer(cuso);
                  dvWrk.innerHTML = pag;
                  pgC = true;
               }
               resolve();
            });
         }).catch(error => {
            reject(error);
         });
   });


   let frJS = new Promise((resolve, reject) => {  /// Front Dinam
      fetch("getCuso", {
         method: 'POST',
         body: JSON.stringify({ cuso: { a: "js", b: arCuso[0], c: arCuso[1], d: arCuso[2] } })
      }).then(function (response) {
         return response.text().then(function (archJS) {
            if (archJS != "--") {
               jsC = new Function(archJS);
            }
            resolve();
         });
      }).catch(error => {
         console.log(error);
         reject(error);
      });
   });

   let frParms = new Promise((resolve, reject) => {  /// Parametros
      fetch("frontData", {
         method: 'POST',
         //body: JSON.stringify({ cuso: { b: arCuso[0], c: arCuso[1], d: arCuso[2] } })
         body: JSON.stringify({ cuso: { b: arEjCuso[0], c: arEjCuso[1], d: arEjCuso[2] } })
      }
      ).then(function (response) {
         return response.text().then(function (jsP) {
            if (jsP.startsWith("**")) JSdfr = null;
            else {
               JSdfr = JSON.parse(jsP);
            }
            resolve();
         });
      }).catch(error => {
         console.log(error.message);
         reject(error);
      });
   });

   Promise.all([valParms, wsX, frPag, frJS, frParms])
      .then(values => {
         ventana = false;
         if (jsC) jsC();    // Si hay JS lo corre
         if (pgC) {         // Si hay pagina la muestra, inhibe la anterior
            dvWrk.style.display = "block";
            //dvMen.style.display = "block";
            dvMen.style.display = "flex";
            dvTit.style.display = "block";

            if (JSdfr) {
               sObj('dfr', JSdfr);
            }

            ///?
            if (JSdbk && JSdbk.lcuso) {
               sObj('lcuso', JSdbk.lcuso);
            }

            let antes = arrDvWrk.length - 2;

            if (antes > -1)
               if (lay == 0 || lay == 2) { // Sobreescribe el Actual
                  xdv = arrDvWrk[antes];
                  xdv.parentElement.removeChild(xdv);
                  arrDvWrk.splice(antes, 1);

                  xdv = arrDvMen[antes];
                  xdv.parentElement.removeChild(xdv);
                  arrDvMen.splice(antes, 1);

                  xdv = arrDvTit[antes];
                  xdv.parentElement.removeChild(xdv);
                  arrDvTit.splice(antes, 1);

                  arrLay.splice(antes, 1);
               }
               else if (lay == 1) {
                  xdv = arrDvWrk[antes];
                  if (xdv.style.opacity == '1' || xdv.style.opacity == '')  // not opac
                     xdv.style.display = "none";

                  xdv = arrDvMen[antes];
                  if (xdv.style.opacity == '1' || xdv.style.opacity == '')
                     xdv.style.display = "none";

                  xdv = arrDvTit[antes];
                  if (xdv.style.opacity == '1' || xdv.style.opacity == '')
                     xdv.style.display = "none";
               }

            if (antes > -1) {

               dvCap = dvWrk.querySelector('.dvCap');
               if (lay == 1 && !dvCap) { // Nueva capa defa regre (ver excep)
                  sp = document.createElement("span");
                  sp.setAttribute("title", "regresar");
                  sp.addEventListener("click", new Function("e", "regre();"));
                  fetchSV('/img/awesome/solid/undo-alt.svg', sp, "micon0");
                  sp.className = "aMenu";
                  dvMen.appendChild(sp);
               }

               let jsRel, jsGRel;
               if (parms != 'smc' && JSdbk) {
                  if (JSdbk.jsRel) jsRel = JSON.parse(JSdbk.jsRel);
                  if (JSdbk.jsGRel) jsGRel = JSON.parse(JSdbk.jsGRel);
               }

               /// Relacionados
               if (jsRel && jsRel.datos) { // Desde jsRel
                  let ccuso = "";

//++++++++++++++++++++                  
                  spMen = document.createElement("div");
                  spMen.className='dvMenIn';
//++++++++++++++++++++                  

                  for (i = 0; i < jsRel.datos.length; i++) {
                     ejx = '-' + jsRel.datos[i][0];
                     if (!JSdbk.hasOwnProperty(ejx)) {
                        sp = document.createElement("span");
                        sp.className = "aMenu";
                        ejx = "ldCuso('" + jsRel.datos[i][0] + "'," + jsRel.datos[i][3] + ",'" + jsRel.datos[i][5] + "','" + jsRel.datos[i][4] + "');";
                        sp.addEventListener("click", new Function("e", ejx));
                        sp.setAttribute("title", jsRel.datos[i][1]);
                        if (jsRel.datos[i][2])
                           fetchSV(jsRel.datos[i][2].substring(1), sp);
                        else {
                           btnMenTxt = document.createElement("span");
                           btnMenTxt.className = "btnMenTxt";
                           btnMenTxt.innerText = jsRel.datos[i][1];
                           sp.appendChild(btnMenTxt);
                        }
                        //+++++++++++
                        //dvMen.appendChild(sp);
                        spMen.appendChild(sp);                        //+++++++++++

                     }
                  }
                  dvMen.appendChild(spMen);
               }


               ///// Grupo
               if (jsGRel && jsGRel.datos && ! JSdbk.hasOwnProperty("noGRel")) {
                  msel = document.createElement("select");
                  msel.className = "sMenu";
                  msel.style.marginLeft="auto";

                  opt = document.createElement("option");
                  lopt = document.createTextNode(jsGRel.datos[0][0]);
                  opt.setAttribute("disabled", true);
                  opt.setAttribute("selected", true);
                  opt.setAttribute("value", 0);
                  opt.appendChild(lopt);
                  msel.appendChild(opt);

                  opt = document.createElement("option");
                  lopt = document.createTextNode("─".repeat(jsGRel.datos[0][0].length + 2));
                  opt.setAttribute("disabled", true);
                  opt.appendChild(lopt);
                  msel.appendChild(opt);

                  for (i = 1; i < jsGRel.datos.length; i++) {
                     opt = document.createElement("option");
                     opt.setAttribute("value", jsGRel.datos[i][3]);
                     lopt = document.createTextNode(jsGRel.datos[i][1]);
                     opt.appendChild(lopt);
                     msel.appendChild(opt);
                     //});
                     msel.addEventListener("change", (evt) => {
                        eje = evt.target.value; //.replace(")", ",-1)")
                        exe = new Function(eje);
                        exe();
                        evt.target.value = "0";
                     });
                     dvMen.appendChild(msel);
                  }

               }

               ////// Interno
               if (JSdfr && JSdfr.hasOwnProperty('imenu')) {
                  imenu = JSdfr.imenu;
                  imenu.forEach((opm, ix) => {
                     sp = document.createElement("span");
                     sp.setAttribute("title", opm[1]);
                     sp.addEventListener("click", new Function("e", opm[3]));
                     sp.className = "aMenu";
                     if (opm[2])
                        fetchSV(opm[2].substring(1), sp)
                     else
                        sp.innerText = opm[1];
                     dvMen.appendChild(sp);
                  });
               }
            }

            // Ponemos letreros si hay

         }
         if (JSdbk && JSdbk.stx)
            stx = JSdbk.stx;

         if (JSdfr && JSdfr.hasOwnProperty('eje')) {
            //eje= 'js/'+ arCuso[0]+'/'+JSdfr.eje;
            //console.log(eje);
            //console.log(arCuso);
            ldJS('js/' + arCuso[0] + '/' + JSdfr.eje);
         }

         vaCuso = true;
      })
      .catch(error => {

         vaCuso = false;
         if (pgC) regre();
         // dvErr = document.querySelector('#dvErr');
         // dvErr.innerText = error;
         // dvErr.style.display = 'block';
         // document.querySelector('#mostrador').style.display = 'none';

         let msj = error;
         let idmsj = 0;
         if (JSdbk && JSdbk.hasOwnProperty("idlog"))
            idmsj = JSdbk.idlog;
         createModal(msj, 'red', 'white', idmsj);
      })
      .finally(() => {
         if (!procex) {
            oCuso = document.querySelector("#hCuso");
            oCuso.innerText = gObj('lcuso');
            spGraba = dvWrk.querySelector('#shkMenGraba');
            if (spGraba) {
               fetchSV('/img/awesome/solid/check.svg', spGraba, "micon0");
            }


            if (vaCuso) {
               oCuso.setAttribute("title", cuso);
               //sObj('cuso', cuso);
               if (lay == 2 && arrLay.length > 1) //{  // Iniciando
                  while (arrLay.length > 1) {  // Objs out of dom
                     while (arrLay[0].length > 0) {
                        miElem = arrLay[0].pop();
                        if (typeof (miElem) == 'object' && !Array.isArray(miElem)) {
                           //console.log(typeof (miElem));
                           if (miElem.parentNode)
                              miElem.remove();
                        }
                     }
                     arrLay.splice(0, 1);
                  }
            }
            //sObj('rcuso', cuso);
            ejCuso = null;
         }
      });
};


const regre = () => {
   arrDvWrk.pop().remove();
   arrDvWrk[arrDvWrk.length - 1].style.display = "block";
   arrDvWrk[arrDvWrk.length - 1].style.opacity = "100%";

   arrDvMen.pop().remove();
   arrDvMen[arrDvMen.length - 1].style.display = "flex";
   arrDvMen[arrDvWrk.length - 1].style.opacity = "100%";

   arrDvTit.pop().remove();
   arrDvTit[arrDvTit.length - 1].style.display = "block";
   arrDvMen[arrDvWrk.length - 1].style.opacity = "100%";

   arrLay.pop();

   //// para parms
   JSdfr = gObj("dfr");
   dvWrk = gObj("wrk");   
   dvMen = gObj("men");
   dvTit = gObj("tit");
   dvCap = gObj("cap");
   selReg = gObj("selReg");
   document.querySelector("#hCuso").innerText = gObj('lcuso');

   if (JSdfr && JSdfr.hasOwnProperty('refresh')) {
      console.log('refresca dato');
   }
}


const casRel = () => {
   let jsRel = JSON.parse(JSdbk.jsRel);

   dvMen.innerHTML = "";
   dvMen.style.display = "block";

   for (i = 0; i < jsRel.datos.length; i++) {
      let ejcuso = jsRel.datos[i][3];
      if (ejcuso.equals(".")) {
         //// El Inicio ///
         msel = document.createElement("select");
         optg = document.createElement("optgroup");
         optg.setAttribute("label", jsRel.datos[i][1]);

         msel.appendChild(optg);
         dvMen.appendChild(msel);

      } else {

         am = document.createElement("a");
         am.className = "aMenu";
         am.setAttribute("title", jsRel.datos[i][1]);

         if (jsRel.datos[i][2])
            am.innerHTML = "<img src='" + jsRel.datos[i][2].substring(1) + "' style='height:16px; width:16px;'></img>";
         else
            am.innerText = jsRel.datos[i][1];

         //ccuso = jsRel.datos[i][3];
         am.setAttribute("cuso", ccuso);
         am.addEventListener("click", new Function("e", ejcuso));
         dvMen.appendChild(am);
      }
   }
}


const gObj = (nObj, cap) => {
   let capa = 0;
   if (cap) capa = cap;
   capa = capa - 1;

   let aObj;
   //let ix = arrLay[arrLay.length - 1][0].indexOf(nObj);
   let ix = arrLay[arrLay.length + capa][0].indexOf(nObj);
   if (ix != -1)
      aObj = arrLay[arrLay.length + capa][ix + 1];
   return aObj;
};

const sObj = (nObj, vObj) => {
   actArr = arrLay[arrLay.length - 1];
   ix = actArr[0].indexOf(nObj);
   if (ix == -1) {
      actArr[0].push(nObj);
      actArr.push(vObj);
   } else {   // Si no lo Sustituye
      actArr[ix + 1] = vObj;
   }
};

const rObj = (nObj) => { // Remove Obj
};

const gFld = (nFld) => {
   return dvWrk.querySelector('input[shk][name="' + nFld + '"],select[shk][name="' + nFld + '"],textarea[shk][name="' + nFld + '"]');
};