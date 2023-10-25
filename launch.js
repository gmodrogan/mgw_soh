var Cookie = window.Cookie;
var clientId = window.myConfig.clientId;
var redirectUri = window.myConfig.redirectUri;

var queryString = window.location.search;

var fhirUrl = window.getQueryParam('iss', queryString);
var launchId = window.getQueryParam('launch', queryString);

Cookie.set('fhir_url', fhirUrl, { secure: true, "max-age": 3600 });

function getWellKnown(callback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fhirUrl + '/.well-known/smart-configuration', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(JSON.parse(xhr.responseText));
            } else {
                errorCallback(new Error('Error fetching well-known'));
            }
        }
    };
    xhr.send();
}

function authorize(data) {
    var authEndpoint = data.authorization_endpoint;
    var token_endpoint = data.token_endpoint;
    Cookie.set('token_endpoint', token_endpoint, { secure: true });

    debugger;
    var auth_location = authEndpoint + '?' +
        "response_type=code&" +
        "client_id=" + clientId + "&" +
        "redirect_uri=" + encodeURIComponent(redirectUri) + "&" +
        "launch=" + launchId + "&" +
        "scope=" + encodeURIComponent("user/Patient.read launch fhirUser openid online_access user/Observation.read user/Immunization.read") + "&" +
        "state=98wrghuwuogerg97&" +
        "aud=" + fhirUrl;
    window.location.assign(auth_location);
}


getWellKnown(function (data) {
    authorize(data);
}, function (err) {
    debugger;
    console.log(err.message);
});