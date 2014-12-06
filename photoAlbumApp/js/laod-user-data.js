(function() {
    $(function() {
        // get the curent user and display his data
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            var username = currentUser.username;
            //load the dropdown nav menu d
            $('#user-dropdown-menu').show();
            $('#login-page').hide();
            $('#user-name').text(username);
            $('#user-wellcome-message').text('Hello there ' + username);
        }

        // load  all albums from database
        ajaxRequester.get('https://api.parse.com/1/classes/Album', albumLoadSuccess, ajaxError);

        // display albums on user page
        function albumLoadSuccess(data) {
            for (var a in data.results) {
                //get each album's data
                var album = data.results[a];
                var albumName = album.name;
                var albumCategoryID = album.category['objectId'];
                //get album gategory name by its ID
                ajaxRequester.get('https://api.parse.com/1/classes/Category/' + albumCategoryID, categoryLoadSuccess, ajaxError);

                var $albumDiv = $('<div class="panel panel-primary col-md-3 album-folder">' +
                    '<div class="panel-heading"><h3 class="panel-title">Album: <a href="#"> ' +
                    albumName + '<a/></h3></div><div class="panel-body">Category: <a href="#">' +
                    albumCategoryID + '<a/></div></div>');

                // add created album to album-div-holder
                $('#album-folders-holder').append($albumDiv);
            }
        }
        // TODO-add name to the albumDiv
        function categoryLoadSuccess(data) {
            var category = data.name;
        }

        // noty function for an AJAX request error
        function ajaxError(error) {
            var errorMessage = error.responseJSON;
            noty({
                text: 'Error: ' + errorMessage.error,
                type: 'error',
                layout: 'center',
                timeout: 2000
            });
        }
    });
}());