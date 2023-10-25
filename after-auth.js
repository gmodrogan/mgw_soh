var queryString = window.location.search;

var code = window.getQueryParam('code', queryString);
var state = window.getQueryParam('state', queryString);

var tokenEndpoint = Cookie.get("token_endpoint");
var fhirUrl = Cookie.get("fhir_url");

var clientId = window.myConfig.clientId;
var redirectUri = window.myConfig.redirectUri;
var indexUri = window.myConfig.indexUri;

var accessTokenPostBody = {
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': clientId,
    'redirect_uri': redirectUri
};

function getAccessToken(callback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', tokenEndpoint, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(JSON.parse(xhr.responseText));
            } else {
                errorCallback(new Error('Error fetching access token'));
            }
        }
    };

    xhr.send(getWwwFormUrlEncodedData(accessTokenPostBody));
}

Cookie.rem('token_data');
getAccessToken(function (data) {
    debugger;

    if (data.error) {
        console.log('error fetching token: ' + (data.error_uri || ''));
        return;
    }

    Cookie.set('token_data', JSON.stringify(data), { secure: true, "max-age": 900 });
    location.assign(indexUri);

}, function (err) {
    debugger;

    console.log(err.message);
});