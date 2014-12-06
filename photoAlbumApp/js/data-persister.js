var app = app || {};

app.dataPersister = (function () {
    function DataPersister(rootUrl) {
        this.rootUrl = rootUrl;
        this.albums = new Base(rootUrl + 'classes/albums/');
        this.photos = new Base(rootUrl + 'classes/photos/');
        this.comments = new Base(rootUrl + 'classes/comments/');
    }
    
    var Base = (function () {
        function Base(serviceUrl) {
            this.serviceUrl = serviceUrl;
        }
        
        Base.prototype.all = function (success, error) {
            return ajaxRequester.get(this.serviceUrl, success, error);
        }
        
        Base.prototype.add = function (data, success, error) {
            return ajaxRequester.post(this.serviceUrl, data, success, error);
        }
        
        Base.prototype.edit = function (id, success, error) {
            return ajaxRequester.put(this.serviceUrl + id, success, error);
        }
        
        Base.prototype.remove = function (id, success, error) {
            return ajaxRequester.delete(this.serviceUrl + id, success, error);
        }
        
        return Base;
    }());
    
    return {
        get: function (rootUrl) {
            return new DataPersister(rootUrl);
        }
    }
}());