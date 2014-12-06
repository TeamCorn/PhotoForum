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
            $('#album-folders-holder').html('');
        }

        // load  all albums from database
        ajaxRequester.get('https://api.parse.com/1/classes/Album',
            albumLoadSuccess, ajaxError);

        // display albums title on user page
        function albumLoadSuccess(data) {
            for (var a in data.results) {
                //get each album's data
                var album = data.results[a];
                var albumName = album.name;
                var albumCategoryID = album.category['objectId'];
                var albumAthorID = album.author['objectId'];

                var $albumDiv = $('<div class="panel panel-primary col-md-3 album-folder">' +
                    '<div class="panel-heading"><h3 class="panel-title">Album: <a href="#"> ' +
                    albumName + '<a/></h3></div>');
                //add  data atrributes to albumDiv
                $('div').attr('data-info', '222');
                $albumDiv.attr('category-id', albumCategoryID);
                $albumDiv.attr('author-id', albumAthorID);

                // add created album to album-div-holder
                $('#album-folders-holder').append($albumDiv);
            }
        }

        // load  all categories from database
        ajaxRequester.get('https://api.parse.com/1/classes/Category',
            categoryLoadSuccess, ajaxError);

        // display albums category on user page
        function categoryLoadSuccess(data) {
            for (var c in data.results) {
                var category = data.results[c];
                var categoryName = category.name;
                var categoryID = category.objectId;

                var $albumCategory = $('<div class="panel-body">Category: <a href="#"> ' +
                    categoryName + '<a/></div>');
                // $('#' + categoryID).append($albumCategory);
                $("div").find("[category-id='" + categoryID + "']").append($albumCategory);
            }
        }

        // load  all users(authors) from database
        ajaxRequester.get('https://api.parse.com/1/users',
            usersLoadSuccess, ajaxError);

        // display album's author(user) on user page
        function usersLoadSuccess(data) {
            for (var a in data.results) {
                var author = data.results[a];
                var authorName = author.username;
                var authorID = author.objectId;

                var $albumAuthor = $('<div class="panel-body">Author: <a href="#"> ' +
                    authorName + '<a/></div>');
                $('.' + authorID).append($albumAuthor);
                $("div").find("[author-id='" + authorID + "']").append($albumAuthor);
            }
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