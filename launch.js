import {Cookie} from "./helpers.js";
import {clientId, redirectUri} from './config.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);

const fhirUrl = urlParams.get('iss')
Cookie.set('fhir_url', fhirUrl, {secure: true, "max-age": 3600})

Cookie.set('launch_url', window.location.toString(), {secure: true, "max-age": 3600})
Cookie.set('launch_timestamp_in', new Date().toJSON(), {secure: true, "max-age": 3600})

const token_endpoint_eat = "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/hosts/apigee.test/protocols/oauth2/profiles/smart-v1/token"
const mgw_eat_active = Cookie.get('mgw_eat_active')

const launchId = urlParams.get('launch')

async function getMetadata() {
    let response = await fetch(fhirUrl + '/metadata', {
        headers: {
            Accept: 'application/json'
        }
    })

    return await response.json()
}

function authorize(data) {
    //.replace
    let extension = data.rest[0].security.extension[0].extension;
    let authEndpoint = extension.find((item) => item.url == "authorize" ).valueUri
    let token_endpoint = mgw_eat_active == "1" ? token_endpoint_eat : extension.find((item) => item.url == "token" ).valueUri;
    // let token_endpoint = data.token_endpoint;
    // let token_endpoint = 
    Cookie.set('token_endpoint', token_endpoint, {secure: true, "max-age": 3600})

    debugger;
    Cookie.set('launch_timestamp_out', new Date().toJSON(), {secure: true, "max-age": 3600})
    let auth_location = `${authEndpoint}?` +
        "response_type=code&" +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURI(redirectUri)}&` +
        `launch=${launchId}&` +
        `scope=${encodeURIComponent("user/Patient.read launch fhirUser openid online_access user/Observation.read user/Immunization.read user/AllergyIntolerance.read")}&` +
        "state=98wrghuwuogerg97&" +
        `aud=${fhirUrl}`
    location.assign(auth_location)
}


getMetadata().then((data) => {
    authorize(data)
}).catch((err) => {
    debugger
    console.log('error fetching well-known')
})



