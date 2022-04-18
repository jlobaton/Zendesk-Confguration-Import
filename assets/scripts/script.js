let jsonText = ""
let json, cantidad

let reader = new FileReader()
let archivo = document.getElementById("archivo")

let msg = document.getElementById("msg");
let error = false;
let objeto = '';  //identifica el nombre de la selección



archivo.addEventListener("change", (e) => {
    let file = e.target.files[0]
    console.log("file", file);
    reader.readAsText(file)

    reader.onload = (e) => {
        //console.log("archivo json ", e.target.result);
        jsonText = e.target.result
        json = JSON.parse(jsonText)
        //cantidad = json.macros.length
        document.getElementById("btnCrear").disabled = false

    }

})

const crear = function() {
    objeto = document.getElementById("objeto").value;
    if (objeto == 'macros'){
        cantidad = json.macros.length
        console.log('Iniciando la importación de '+cantidad +' Macros');
        crearMacros();

    }else if (objeto == 'automations'){
        cantidad = json.automations.length
        console.log('Iniciando la importación de '+cantidad +' Automatizaciones');
        crearAutomatizacion();

    }
}

const crearMacros = async (i = 0) => {
    let url = document.getElementById("url_inst").value;
    try {
        if (i + 1 > cantidad) {
            msg.setAttribute("style", "color:green;")
            msg.innerText = "Se han creado satisfactoriamente"
            msg.hidden = false
        } else {
            if (error) {
                console.log("############# E R R O R ###############");
                console.log(error);

            } else {

                await client.request({
                    url: `https://${url}.zendesk.com/api/v2/macros.json`,
                    type: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: Generar_Json(i)

                }).then((res) => {
                    console.log(`Registro ${i + 1}/${cantidad} - ${res.macro.title}`);
                    //console.log("resultado: ", res.macro);                    
                    //console.log(res.macro.title);
                    //exit();
                    return crearMacros(i + 1)

                }).catch((err) => {
                    //console.log("Error: ", err.responseText);
                    
                    error = true
                    msg.setAttribute("style", "color:red;")
                    msg.innerText = "Error: " + err.responseText
                    msg.hidden = false

                })

            }

        }

    } catch (e) {
        console.log("error ", e);
        msg.setAttribute("style", "color:red;")
        msg.innerText = "No se ha podido crear las macros, por favor vea el error en consola"
        msg.hidden = false

    }


}


let Generar_Json = function(i){
    result = JSON.stringify({
        macro: {
            actions: json.macros[i].actions,
            title: json.macros[i].title.trim(),
            active: json.macros[i].active,
            description: json.macros[i].description,
            restriction: json.macros[i].restriction
        }
    });
    
    console.log('title: ' + json.macros[i].title.trim());
    return result;    
}

let Generar_Json_CRM = function(i){
    add_object = {
        "field": "brand_id",
        "operator": "is",
        "value": "360004089012"                    
    };
    json.automations[i].conditions.all.push(add_object);
    //console.log(json.automations[i].conditions.all);
    result = JSON.stringify({
        automation: {
            actions: json.automations[i].actions,
            title: json.automations[i].title.trim(),
            active: true,
            conditions: {
                all: json.automations[i].conditions.all
            }
        }
    })   

    //console.log(result);
    //console.log('title: ' + json.automations[i].title.trim());

    return result;
}

const crearAutomatizacion = async (i = 0) => {
    let url = document.getElementById("url_inst").value;
    try {
        if (i + 1 > cantidad) {
            msg.setAttribute("style", "color:green;")
            msg.innerText = "Se han creado satisfactoriamente"
            msg.hidden = false
        } else {
            if (error) {
                console.log("############# E R R O R ###############");
                console.log(error);

            } else {
                //console.log(Generar_Json_CRM(i))
                    
/***** FUNCIONAL
                console.log(JSON.stringify({
                    automation: {
                        actions: json.automations[i].actions,
                        title: trim(json.automations[i].title),
                        active: false, //json.automations[i].active,
                        //conditions: json.automations[i].conditions,
                        conditions: {
                            all: json.automations[i].conditions.all
                           // all: new_conditions_all,
                            any: json.automations[i].conditions.any
                        }
                    }
                }))

*/
                await client.request({
                    url: `https://${url}.zendesk.com/api/v2/automations.json`,
                    type: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: Generar_Json_CRM(i)
                }).then((res) => {
                    console.log(`Registro ${i + 1}/${cantidad} - ${res.automation.title}`);
                    //console.log("resultado: ", res.automations);                    
                    //console.log(res.macro.title);
                    //exit();
                    return crearAutomatizacion(i + 1)

                }).catch((err) => {
                    //console.log("Error: ", err.responseText);
                    
                    error = true
                    msg.setAttribute("style", "color:red;")
                    msg.innerText = "Error: " + err.responseText
                    msg.hidden = false

                })

            }

        }

    } catch (e) {
        console.log("error ", e);
        msg.setAttribute("style", "color:red;")
        msg.innerText = "No se ha podido crear las Automatizacion, por favor vea el error en consola"
        msg.hidden = false

    }


}





