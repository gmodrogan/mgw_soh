var Cookie = {
  get: function (e) {
    var matched = document.cookie.match(
      new RegExp(
        "(?:^|; )" + e.replace(/([.$?*|{}()[\]\\/+^])/g, "$1") + "=([^;]*)"
      )
    );
    return matched ? decodeURIComponent(matched[1]) : undefined;
  },

  set: function (e, n, o) {
    o = o || {};
    o = {
      path: "/",
      expires: o.expires,
      "max-age": o["max-age"],
      secure: o.secure
    };

    if (o.expires instanceof Date) {
      o.expires = o.expires.toUTCString();
    }

    var c = unescape(encodeURIComponent(e)) + "=" + unescape(encodeURIComponent(n));

    for (var t in o) {
      if (o.hasOwnProperty(t)) {
        c += "; " + t;
        var a = o[t];
        if (a !== true) {
          c += "=" + a;
        }
      }
    }

    document.cookie = c;
  },

  rem: function (e) {
    Cookie.set(e, "", { "max-age": -1 });
  }
};

function getWwwFormUrlEncodedData(data) {
  var formBody = [];
  for (var property in data) {
    if (data.hasOwnProperty(property)) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
  }
  return formBody.join("&");
}

function getQueryParam(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.Cookie = Cookie;
window.getWwwFormUrlEncodedData = getWwwFormUrlEncodedData;
window.getQueryParam = getQueryParam;