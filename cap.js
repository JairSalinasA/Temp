/// Identificamos el dml y cuso base
let ejCuso = JSdbk.cuso;
let dml = ejCuso.substr(length - 1);
let sEjCuso = ejCuso.split('.');
let cusbas = sEjCuso[0] + "." + sEjCuso[1];

// console.log('cap generico');

let result;
if (JSdbk.jsResult)
    result = JSON.parse(JSdbk.jsResult);

ventana = true;

if (dml == 3)
    dvWrk.innerHTML =
        '<div class="dvCap" style="background-color:red">'
        //+ '<p style="color:wheat;font-weight:900"> &nbsp;¿¿ ' + JSdbk.lcuso + ' ??&nbsp;</p>'
        ;

dvCap = dvWrk.querySelector('.dvCap');
if (!dvCap) throw 'Falta Forma de captura';
sObj('cap',dvCap); //-- 

sp = document.createElement("div");
sp.setAttribute('id', 'shkMen');
sp.className = 'dvInBar';
sp.style.borderTopStyle = 'groove';



/* ------*/
// if (dml != 3) {
//     spTit = document.createElement("span");
//     spTit.className = "dvTitIn";
//     spTit.innerText = JSdbk.lcuso;
//     sp.appendChild(spTit);
// }

spMen = document.createElement("div");
spMen.className = 'dvMenIn';

if (dml == 3) {
    spMen.style.backgroundColor = 'red';
    spMen.style.width = '100%';
    spMen.style.justifyContent = 'center';
} else {
    spMen.style.justifyContent = 'flex-end';
}

spM = document.createElement("span");
spM.className = "aMenu";
btnMenTxt = document.createElement("span");
btnMenTxt.className = "dvTitIn";
btnMenTxt.innerText = JSdbk.lcuso;
spM.appendChild(btnMenTxt);
spMen.appendChild(spM);

sp.appendChild(spMen);
/*-----*/


dvCap.appendChild(sp);

//dvMen = sp;
dvMen = spMen;


///---> Titulo <----//
sp = document.createElement("div");
sp.setAttribute('id', 'shkTitCuso');
//sp.className = 'menCap';
sp.className = 'dvInBar';
sp.style.borderBottomStyle = 'groove';


hKey = "";
inpKF = "";

hKey = "";

// Etiqueta
if (JSdfr && JSdfr.hasOwnProperty("kLbl"))
    hKey = JSdfr.kLbl + ": ";

// Key
if (JSdfr && JSdfr.hasOwnProperty("kVal") && result) {
    valKey = gDatVal(0, JSdfr.kVal, result) ?? '';
    inpKey = document.createElement("input");
    inpKey.name = JSdfr.kVal;
    inpKey.value = valKey;
    inpKey.type = 'hidden';
    inpKey.setAttribute("shk", "");
    dvCap.appendChild(inpKey);

    hKey = hKey + " " + valKey;
}

if (JSdfr && JSdfr.hasOwnProperty("kEtq") && result)
    hKey = hKey + " - " + gDatVal(0, JSdfr.kEtq, result) ?? '';

ctit = document.createElement("span");
ctit.className = "dvTitIn";
ctit.innerText = hKey;
sp.appendChild(ctit);


cmenwin = document.createElement("span");
cmenwin.className = 'dvMenIn';
//cmenwin.className = "dvTitIn";


czoomax = document.createElement("span");
czoomax.className = 'amenu zoom-in';
czoomax.style.display = 'flow';
// fetchSV('/img/awesome/solid/window-maximize.svg', czoomax); //, 'miconZoom'
czoomax.addEventListener("click",new Function("evt", "zoomDiv(dvCap,1.7);"));

cmenwin.appendChild(czoomax);

czoomin = document.createElement("span");
czoomin.className = 'amenu zoom-out';
czoomin.style.display = 'flow';
// fetchSV('/img/awesome/solid/window-minimize.svg', czoomin); //, 'miconZoom'
czoomin.addEventListener("click",new Function("evt", "zoomDiv(dvCap,1);"));
 
cmenwin.appendChild(czoomin);
zoomDiv(dvCap,wzoom);


// if(wzoom==1) {
//     czoomax.style.display='flow';  
// } else {
//     czoomin.style.display='flow';  
// }


if (!JSdbk.hasOwnProperty("noclose")) {
    cclose = document.createElement("span");
    //cclose.style.paddingLeft = "20px";
    //cclose.style.paddingRight = "5px";
    cclose.className = 'amenu';
    fetchSV('/img/awesome/solid/xmark.svg', cclose); //'miconClose'
    cclose.addEventListener("click", new Function("e", "regre();"));
    //    sp.appendChild(cclose);
    cmenwin.appendChild(cclose);
}

sp.appendChild(cmenwin);

dvCap.insertBefore(sp, dvCap.children[0]);

const bldArchi = (inp) => {
    let fld = inp.getAttribute("fld");
    let itm = inp.getAttribute("item");
    if (!itm) itm = 0;

    cap = JSdbk.hasOwnProperty("cap");
    if (result) data = result.datos[0][result.cols.indexOf(fld)];

    ////// Dato         
    inpd = document.createElement("input");
    inpd.setAttribute("name", fld);
    inpd.setAttribute("id", fld);
    inpd.setAttribute("type", "hidden");
    inpd.setAttribute("fld", fld);
    inpd.setAttribute("shk", "");
    if (data) inpd.value = data;
    inp.appendChild(inpd);

    ////// Archi
    inpf = document.createElement("input");
    inpf.setAttribute("type", "file");
    inpf.setAttribute("fld", fld);
    inpf.style.width = "0";
    inpf.setAttribute("name", "file" + fld);
    inpf.setAttribute("id", "file" + fld);
    inpf.className = "inputfile";
    inpf.setAttribute("itm", itm);

    inpf.addEventListener("change", (evt) => {
        let selectedFile = evt.target.files[0];
        let formData = new FormData();
        //formData.append("id", JSdbk.sscuso);
        //formData.append("itm", itm);
        //formData.append("archivo", selectedFile);
        let mid = `${JSdbk.sscuso}-${itm}`;
        formData.append(mid, selectedFile);

        fetch(archURL + "/sube", {
            method: 'POST',
            body: formData,
        }).then(
            // response =>
            //     response.text().then(data => {
            //         console.log(data);
            //     })



            response => response.json()).then(data => {  // Original
                if (data.hasOwnProperty("excep")) throw new Error(data.excep);
                if (!data.hasOwnProperty("newName")) throw new Error('ArchSrv no regresa nombre');
                inpd = dvWrk.querySelector("input[fld='" + fld + "'][shk]");
                inpd.value = data.newName;

                /// bucket ///
                dvWrk.querySelector("#sube" + fld).style.visibility = "hidden";
                dvWrk.querySelector("#ver" + fld).style.visibility = "visible";
                dvWrk.querySelector("#bor" + fld).style.visibility = "visible";
                //dvWrk.querySelector("#bor" + fld).focus(true);
            }
            ).catch(exc => {
                console.error(exc);
                // alert(exc);
            }).finally(
            //console.log(document.activeElement)                        
            //dvWrk.getElementsByClassName('loading')[0].style.display = 'none'
        );
    });
    inp.appendChild(inpf);



    sp = document.createElement("span");
    sp.setAttribute("title", "Sube Archivo");
    sp.setAttribute("id", "sube" + fld);
    sp.addEventListener("click", new Function("e", "dvWrk.querySelector('#file" + fld + "').click();"));
    if (data) sp.style.visibility = "hidden";
    sp.className = "aMenu";
    fetchSV('/img/awesome/solid/file-upload.svg', sp, "micon0");
    inp.appendChild(sp);


    sp = document.createElement("span");
    sp.setAttribute("title", "Borra Archivo");
    sp.setAttribute("id", "bor" + fld);
    sp.addEventListener("click", new Function("e", ""
        + " dvWrk.querySelector(\"#" + fld + "\").value=null;"
        + " dvWrk.querySelector(\"#sube" + fld + "\").style.visibility=\"visible\"; "
        + " dvWrk.querySelector(\"#ver" + fld + "\").style.visibility=\"hidden\"; "
        + " dvWrk.querySelector(\"#bor" + fld + "\").style.visibility=\"hidden\"; "
        + ""
    ));
    sp.className = "aMenu";
    //if (!inpd.value) sp.style.visibility = "hidden";
    if (!data) sp.style.visibility = "hidden";
    fetchSV('/img/awesome/solid/file-minus.svg', sp, "micon0");
    inp.appendChild(sp);


    sp = document.createElement("span");
    sp.setAttribute("title", "Ver Archivo");
    sp.setAttribute("fld", fld);
    sp.setAttribute("id", "ver" + fld);
    sp.className = "aMenu";
    if (!data) sp.style.visibility = "hidden";
    fetchSV('/img/awesome/solid/file-image.svg', sp, "micon0");
    sp.addEventListener("click", new Function("e", ""
        + " miven=window.open('',width=400,height=400) ;"
        + " miven.document.title='Archivo' ;"
        + " dato= dvWrk.querySelector(\"#" + fld + "\").value ;"
        + " ruta=\"" + archURL + "/ver/\" + dvWrk.querySelector(\"#" + fld + "\").value; "
        + " console.log(ruta);"
        + " miven.document.write('"
        + " <html><body> "
        + "  <iframe id=\"miIF\" title=\"Inline\" style=\"border-width:1px;height:100vh;width:100vw\" "
        + "   src=\"'+ ruta +'\" "
        + "></iframe>"
        + "</body></html>');"
    ));
    inp.appendChild(sp);
}

const getDate = (fecha) => {
    let date = new Date(fecha);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (day < 10)
        day = '0' + day;
    if (month < 10)
        month = '0' + month;

    let formattedDate = year + '-' + month + '-' + day

    return formattedDate;
}

const bldXML = (inp, fld, url) => {
    cap = JSdbk.hasOwnProperty("cap");
    if (result) data = result.datos[0][result.cols.indexOf(fld)];

    ////// Dato         
    inpd = document.createElement("input");
    inpd.setAttribute("name", fld);
    inpd.setAttribute("id", fld);
    inpd.setAttribute("type", "hidden");
    inpd.setAttribute("fld", fld);
    inpd.setAttribute("shk", "");
    if (data) inpd.value = data;
    inp.appendChild(inpd);

    ////// Archi
    inpf = document.createElement("input");
    inpf.setAttribute("type", "file");
    inpf.setAttribute("fld", fld);
    inpf.style.width = "0";
    inpf.setAttribute("name", "file" + fld);
    inpf.setAttribute("id", "file" + fld);
    inpf.className = "inputfile";


    //// Crear Campos: UUID, RFC Emisor, RFC Receptor, Total ,Subtotal ,Concepto ,STATUS    


    inpf.addEventListener("change", (evt) => {
        let selectedFile = evt.target.files[0];
        let formData = new FormData();
        formData.append("archivo", selectedFile);
        formData.append("path", "archis");
        fetch(archURL + "/readXML", {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            console.log(data);

            if (data.comprobante) {

                let Comprobante = data.comprobante;

                let RfcEmisor = Comprobante['cfdi:Emisor'].Rfc;
                let RfcRecep = Comprobante['cfdi:Receptor'].Rfc;
                let fecha = Comprobante.Fecha;
                let subtotal = Comprobante.SubTotal;
                let total = Comprobante.Total;
                let UUID = Comprobante['cfdi:Complemento']['tfd:TimbreFiscalDigital'].UUID;
                let concepto = Comprobante['cfdi:Conceptos']['cfdi:Concepto'].Descripcion;

                if (dvWrk.querySelector("#_rfce_"))
                    dvWrk.querySelector("#_rfce_").value = RfcEmisor;
                if (dvWrk.querySelector("#_rfcr_"))
                    dvWrk.querySelector("#_rfcr_").value = RfcRecep;
                if (dvWrk.querySelector("#_fecha_"))
                    dvWrk.querySelector("#_fecha_").value = getDate(fecha);
                if (dvWrk.querySelector("#_subtotal_"))
                    dvWrk.querySelector("#_subtotal_").value = subtotal;
                if (dvWrk.querySelector("#_total_"))
                    dvWrk.querySelector("#_total_").value = total;
                if (dvWrk.querySelector("#_uuid_"))
                    dvWrk.querySelector("#_uuid_").value = UUID;
                if (dvWrk.querySelector("#_concepto_"))
                    dvWrk.querySelector("#_concepto_").value = concepto;
            }

            if (data.hasOwnProperty("excep")) throw new Error(data.excep);

            inpd = dvWrk.querySelector("input[fld='" + fld + "'][shk]");
            inpd.value = archURL + "/archis/" + data.newName;
            dvWrk.querySelector("#sube" + fld).style.visibility = "hidden";
            dvWrk.querySelector("#ver" + fld).style.visibility = "visible";
            dvWrk.querySelector("#bor" + fld).style.visibility = "visible";


        }).catch(exc => {
            console.error(exc);
            // alert(exc);
        }).finally(
            //dvWrk.getElementsByClassName('loading')[0].style.display = 'none'
        );
    });
    inp.appendChild(inpf);



    sp = document.createElement("span");
    sp.setAttribute("title", "Sube Archivo");
    sp.setAttribute("id", "sube" + fld);
    sp.addEventListener("click", new Function("e", "dvWrk.querySelector('#file" + fld + "').click();"));
    if (data) sp.style.visibility = "hidden";
    sp.className = "aMenu";
    fetchSV('/img/awesome/solid/file-upload.svg', sp, "micon0");
    inp.appendChild(sp);


    sp = document.createElement("span");
    sp.setAttribute("title", "Borra Archivo");
    sp.setAttribute("id", "bor" + fld);
    sp.addEventListener("click", new Function("e", ""
        + " dvWrk.querySelector(\"#" + fld + "\").value=null;"
        + " dvWrk.querySelector(\"#sube" + fld + "\").style.visibility=\"visible\"; "
        + " dvWrk.querySelector(\"#ver" + fld + "\").style.visibility=\"hidden\"; "
        + " dvWrk.querySelector(\"#bor" + fld + "\").style.visibility=\"hidden\"; "
        + ""
    ));
    sp.className = "aMenu";
    //if (!inpd.value) sp.style.visibility = "hidden";
    if (!data) sp.style.visibility = "hidden";
    fetchSV('/img/awesome/solid/file-minus.svg', sp, "micon0");
    inp.appendChild(sp);


    sp = document.createElement("span");
    sp.setAttribute("title", "Ver Archivo");
    sp.setAttribute("fld", fld);
    sp.setAttribute("id", "ver" + fld);
    sp.className = "aMenu";
    if (!data) sp.style.visibility = "hidden";
    fetchSV('/img/awesome/solid/file-image.svg', sp, "micon0");
    sp.addEventListener("click", new Function("e", ""
        + " miven=window.open('',width=400,height=400) ;"
        + " miven.document.title='Archivo' ;"
        + " dato= dvWrk.querySelector(\"#" + fld + "\").value ;"
        + " ruta=dvWrk.querySelector(\"#" + fld + "\").value; "
        + " console.log(ruta);"
        + " miven.document.write('"
        + " <html><body> "
        + "  <iframe id=\"miIF\" title=\"Inline\" style=\"border-width:1px;height:100vh;width:100vw\" "
        + "   src=\"'+ ruta +'\" "
        + "></iframe>"
        + "</body></html>');"
    ));
    inp.appendChild(sp);
}



dvWrk.querySelectorAll("input[shk],select[shk],textarea[shk],span[shk]").forEach(function (elem) {
    elem.value = "";
    data = "";

    valor = "";
    nombre = elem.getAttribute("name");

    ro = elem.getAttribute("ro" + dml);
    if (dml == 0 || ro) elem.setAttribute('readonly', '');


    if (result) {
        data = result.datos[0][result.cols.indexOf(nombre)];
        if (data)
            if (elem.classList.contains('fecha')) elem.value = data.substr(0, 10);
            else if (elem.nodeName == "SPAN") elem.innerText = data;
            else elem.value = data;
    }

    if (JSdbk.JSVals[nombre]) {
        data = JSdbk.JSVals[nombre];
        if (elem.classList.contains('fecha')) elem.value = data.substr(0, 10);
        else if (elem.nodeName == "SPAN") elem.innerText = data;
        else elem.value = data;
    }

    if (elem.nodeName == "SELECT" && JSdbk.JSValFlds && JSdbk.JSValFlds.hasOwnProperty(nombre + "List")) {
        Object.entries(JSdbk.JSValFlds[nombre + "List"]).forEach(([key, value]) => {
            opt = document.createElement("option");
            opt.setAttribute("value", key);
            lopt = document.createTextNode(value);
            opt.appendChild(lopt);
            elem.appendChild(opt);
        });
        elem.value = data;
        if (dml == 0) elem.setAttribute('disabled', '');
    }

    if (elem.classList.contains('varo')) {
        elem.style.textAlign = "end";
        if (data) elem.value = fmtVaro(data);
        if (elem.nodeName == "SPAN") elem.innerText = fmtVaro(elem.innerText)
        else
            elem.addEventListener("input", (evt) => {
                k = evt.data;
                v = evt.target.value.replace(/[^0-9.-]+/g, ""); //-- Todo lo que no sea numero o . a nada
                ix = v.split('.').length;
                d = "";
                if (ix > 1) d = '.' + v.substr(v.indexOf('.') + 1);
                if (evt.inputType == 'insertText') {
                    if (k == '.' && ix < 2) { }
                    else if (!isNaN(k) && ix == 2) { }
                    else if (!isNaN(k)) {
                        vv = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
                        evt.target.value = vv + d;
                    }
                } else if (evt.inputType == 'deleteContentBackward') {
                    vv = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
                    evt.target.value = vv + d; //+ d.substr(0,3);
                }
            });
    };

    if (elem.classList.contains('bule')) {
        let lelcheck = '#bul_' + elem.name;
        elcheck = dvWrk.querySelector(lelcheck);
        if (elcheck) {
            elcheck.checked = elem.value == 'true';
            if (dml == '0') elcheck.setAttribute('disabled', '')
            else {
                elcheck.addEventListener('click', function (evt) {
                    let fld = '#' + evt.target.id.substr(4);
                    let inpfld = dvWrk.querySelector(fld);
                    if (this.checked) {
                        console.log(evt.target);
                        inpfld.value = 'true';
                    } else {
                        console.log(fld + ' no checa');
                        inpfld.value = '';
                    }
                });
            }


        }
    }
});

//// archis
dvWrk.querySelectorAll("archi").forEach(inp => bldArchi(inp));
//    {
//    bldArchi(inp);
//});


//// xml
dvWrk.querySelectorAll("xml").forEach(inp => {
    fld = inp.getAttribute("fld");
    bldXML(inp, fld);
});



////// Ponemos los valValid
if (dml != 0)
    dvWrk.querySelectorAll("vv").forEach(inp => {
        vvqry = inp.getAttribute("qry");
        vvid = inp.getAttribute("id");
        img = document.createElement("img");
        img.setAttribute("src", "./img/awesome/duotone/search.svg");
        img.setAttribute("qry", vvqry);
        img.setAttribute("id", vvid);
        img.style.height = "10px";
        img.style.width = "10px";
        img.addEventListener("click", function vvClick(evt) {
            vvqry = evt.target.getAttribute("qry");
            vvid = evt.target.getAttribute("id");
            ldCuso('comun.ini.valValid', 1, '\"vv\":\"' + vvqry + '\",\"vvid\":\"' + vvid + '\"');
        });

        inp.appendChild(img);
    });

/// Ponemos los Menus
// let shkM = dvWrk.querySelector("#shkMen");
// sp = document.createElement("span");
// sp.setAttribute("title", "regresar");
// sp.addEventListener("click", new Function("e", "regre();"));
// fetchSV('/img/awesome/solid/undo-alt.svg', sp, "micon0");
// sp.className = "aMenu";
// shkM.appendChild(sp);

// let ejec = "ldCuso('" + cusbas + ".graba',-1,'\"dml\":\"" + dml + "\"');"

// if (JSdfr && JSdfr.hasOwnProperty("ejec"))
//     ejec = JSdfr.ejec;

// if (ejec == "")
//     ejec = null;


// if (ejec && dml !=0) {
//     sp = document.createElement("span");
//     sp.setAttribute("title", "Graba");
//     sp.setAttribute('id', 'shkMenGraba');
//     sp.addEventListener("click", new Function("e", " dvWrk.querySelector('#shkMenGraba').innerHTML='<img src='+ gifW + ' >' ; " + ejec));

//     fetchSV('/img/awesome/solid/check.svg', sp, "micon0");
//     sp.className = "aMenu";
//     shkM.appendChild(sp);
//}

// if (ejec && dml==0 ) {
// }



//arrLay[arrLay.length - 2][4].style.opacity = '0.25';
//let aran= gObj('wrk',-1);
gObj('wrk', -1).style.opacity = '0.25';


if (JSdbk.JSVals)
    Object.keys(JSdbk.JSVals).forEach(K => {
        inpp = agrVal(K, dvWrk);
        inpp.value = JSdbk.JSVals[K];
    });

if (JSdbk.jsResult && dml == 3) {
    let jsResult = JSON.parse(JSdbk.jsResult);
    let fcols = jsResult.cols;
    let datos = jsResult.datos;
    for (i = 0; i < fcols.length; i++) {
        inpp = agrVal(fcols[i], dvWrk);
        inpp.value = datos[0][i];
    }
}


// Para jerarquias si están
jrqRengs = 0;
if (JSdbk.hasOwnProperty("jerq")) {
    jrqRengs = JSdbk.jerq.length;
    JSdbk.jerq.forEach((regis, ix) => {
        ndvr = document.createElement("div");
        ndvr.style.paddingBottom = '0.1%';

        regis.forEach(letre => {
            nb = document.createElement("b");
            nb.className = "titLblE";
            //nb.innerText = letre;
            nb.innerHTML = letre;
            ndvr.appendChild(nb);
        });

        dvTit.appendChild(ndvr);
    });
}


///-- Ultimo js con el mismo cap
ejCuso = '/js/' + sEjCuso[0] + '/' + sEjCuso[1] + '.cap.js';
ldJS(ejCuso);
