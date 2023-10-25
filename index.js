// Assuming Cookie was made global in the previous step

var Cookie = window.Cookie;

var fhirUrl = Cookie.get("fhir_url");
var token_data_cookie = Cookie.get('token_data');
var token_data = token_data_cookie !== undefined ? JSON.parse(token_data_cookie) : null;

function getPatient(callback, errorCallback) {

    if (!token_data || !token_data.access_token || !token_data.patient) {
        console.log('no access token or patient found in cookie');
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', fhirUrl + '/Patient/' + token_data.patient, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('mgw-custom-header-one', 'my-custom-header-value-when-reading-a-patient');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token_data.access_token);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(JSON.parse(xhr.responseText));
            } else {
                errorCallback(new Error('Error fetching patient data'));
            }
        }
    };

    xhr.send();
}

getPatient(function (data) {
    console.log(data);
    document.getElementById('mgw-data-url').textContent = fhirUrl + '/Patient/' + token_data.patient;
    document.getElementById('mgw-data-content').textContent = JSON.stringify(data);
}, function (err) {
    // Uncomment if you want to pause execution for debugging
    // debugger;
    console.log(err.message);
});