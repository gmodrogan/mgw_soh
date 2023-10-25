"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWwwFormUrlEncodedData = exports.Cookie = void 0;
exports.Cookie = {
    get: function (e) {
        e = document.cookie.match(new RegExp("(?:^|; )" + e.replace(/([.$?*|{}()[\]\\/+^])/g, "$1") + "=([^;]*)"));
        return e ? decodeURIComponent(e[1]) : void 0;
    },
    set: function (e, n, o) {
        if (o === void 0) { o = {}; }
        (o = __assign({ path: "/" }, o)),
            o.expires instanceof Date &&
                (o.expires = o.expires.toUTCString());
        var c = unescape(encodeURIComponent(e)) + "=" + unescape(encodeURIComponent(n));
        for (var t in o) {
            c += "; " + t;
            var a = o[t];
            !0 !== a && (c += "=" + a);
        }
        document.cookie = c;
    },
    rem: function (e) {
        exports.Cookie.set(e, "", { "max-age": -1 });
    },
};
function getWwwFormUrlEncodedData(data) {
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}
exports.getWwwFormUrlEncodedData = getWwwFormUrlEncodedData;
