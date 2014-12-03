var ajaxRequester = (function() {
    var PARSE_APP_ID = "rsxzvSeovqQxl6weoimkwl1E8JnvBEzYEQh7oKTl";
    var PARSE_REST_API_KEY = "adMvMtZgee0wzmVfDFtDt64Rw4qCAehZjiGVfdov";

    var makeRequest = function(method, url, data, success, error) {
        $.ajax({
            type: method,
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data) || undefined,
            success: success,
            error: error
        });
    };

    var makeGetRequest = function(url, success, error) {
        return makeRequest('GET', url, null, success, error);
    };

    var makePostRequest = function(url, data, success, error) {
        return makeRequest('POST', url, data, success, error);
    };

    var makePutRequest = function(url, data, success, error) {
        return makeRequest('PUT', url, data, success, error);
    };

    var makeDeleteRequest = function(url, success, error) {
        return makeRequest('DELETE', url, null, success, error);
    };

    return {
        get: makeGetRequest,
        post: makePostRequest,
        put: makePutRequest,
        delete: makeDeleteRequest
    };
}());