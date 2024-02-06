import { Cookie } from "./helpers.js";

const fhirUrl = Cookie.get("fhir_url")
let token_data_cookie = Cookie.get('token_data')
const token_data = token_data_cookie != undefined ? JSON.parse(token_data_cookie) : null;
const mgw_eat_active = Cookie.get('mgw_eat_active')

if (mgw_eat_active){
    document.getElementById('mgw-data-token-type').textContent= 'EAT'
}

let toggle_token_type = function() {
    if(mgw_eat_active){
        Cookie.set('mgw_eat_active', 0, {secure: true, "max-age": 3600})
    }
    else {
    Cookie.set('mgw_eat_active', 1, {secure: true, "max-age": 3600})
    }
}

document.getElementById('mgw-data-token').textContent= JSON.stringify(token_data)
document.getElementById ("toggle_token_type").addEventListener ("click", toggle_token_type, false);

async function getPatient() {

    if (!token_data.access_token || !token_data.patient) {
        console.log('no access token or patient found in cookie')
        return
    }

    let response = await fetch(fhirUrl + '/Patient/' + token_data.patient, {
        headers: {
            'Accept': 'application/json',
            'mgw-custom-header-one': 'my-custom-header-value-when-reading-a-patient',
            'Authorization': `Bearer ${token_data.access_token}`
        }
    })
    return await response.json()
}

getPatient().then((data) => {
    console.log(data)
    document.getElementById('mgw-data-url').textContent = fhirUrl + '/Patient/' + token_data.patient
    document.getElementById('mgw-data-content').textContent= JSON.stringify(data)
}).catch((err) => {
    debugger
    console.log('error fetching patient data')
})
