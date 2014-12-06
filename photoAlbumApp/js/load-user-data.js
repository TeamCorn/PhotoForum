(function() {
    $(function() {
        // get the curent user and display his data
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            var username = currentUser.username;
            //load the dropdown nav menu 
            $('#user-dropdown-menu').show();
            $('#login-page').hide();
            $('#user-name').text(username);
            $('#user-wellcome-message').text('Hello there, ' + username);
        }

        // load  all albums from database
        ajaxRequester.get('https://api.parse.com/1/classes/Album',
            albumLoadSuccess, ajaxError);

        // display albums title on user page
        function albumLoadSuccess(data) {
            // clear div if the page is already populated and user is reloading
            $('#album-folders-holder').empty();
            for (var a in data.results) {
                //get each album's data
                var album = data.results[a];
                //console.log(album);
                var albumName = album.name;
                var albumCategoryID = album.category['objectId'];
                var albumAthorID = album.author['objectId'];
                var albumRating = album.rating;
                
                var $albumDiv = $('<div class="panel panel-primary col-md-3 album-folder">' +
                    '<div class="panel-heading"><h3 class="panel-title">Album: <a href="#"> ' +
                    albumName + '<a/></h3></div>');

                //add  data atrributes to albumDiv
                $('div').attr('data-info', '222');
                $albumDiv.attr('category-id', albumCategoryID);
                $albumDiv.attr('author-id', albumAthorID);
                
                // get category with current id
                ajaxRequester.get('https://api.parse.com/1/classes/Category/' + albumCategoryID,
                    categoryLoadSuccess, ajaxError);

                // get user(authors) with current id
                ajaxRequester.get('https://api.parse.com/1/users/' + albumAthorID,
                    usersLoadSuccess, ajaxError);

                $albumDiv.append('<div class="panel-body albumRating-holder">Rating: ' + albumRating + '</div>');

                // add created album to album-div-holder
                $('#album-folders-holder').append($albumDiv);
            }
        }

        // display albums category on user page
        function categoryLoadSuccess(data) {
            var categoryName = data.name;
            var categoryID = data.objectId;
            var $albumCategory = $('<div class="panel-body albumCategory-holder">Category: <a href="#"> ' +
                categoryName + '<a/></div>');
            $("div").find("[category-id='" + categoryID + "']").append($albumCategory);
        }

        // display album's author(user) on user page
        function usersLoadSuccess(data) {
            var authorName = data.username;
            var authorID = data.objectId;
            var $albumAuthor = $('<div class="panel-body albumAuthor-holder">Author: <a href="#"> ' +
                authorName + '<a/></div>');
            $("div").find("[author-id='" + authorID + "']").append($albumAuthor);
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