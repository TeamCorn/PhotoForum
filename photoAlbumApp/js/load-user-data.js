(function() {
    $(function() {
        // hide new album button
        $('#new-album-dialog').hide();

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

        // display new album button on click 
        $('#create-album').click(function() {
            // show new album dialog and process data
            $('#new-album-dialog').css({
                position: 'fixed',
                top: '20%',
                left: '30%'
            }).show();
        });

        // load  all albums from database
        ajaxRequester.get('https://api.parse.com/1/classes/Album',
            albumLoadSuccess, ajaxError);

        // display albums title on user page
        function albumLoadSuccess(data) {
            // clear div if the page is already populated and user is reloading
            $('#album-folders-holder').html('');
            for (var a in data.results) {
                //get each album's data
                var album = data.results[a];
                var albumName = album.name;
                var albumRating = album.rating;
                var albumViews = album.shows;
                var albumCategory = album.category;
                var albumID = album.objectId;

                var albumAthor = album.author;
                var albumAthorID = albumAthor.objectId;

                var $albumDiv = $('<div class="panel panel-primary col-md-3 album-folder">' +
                    '<div class="panel-heading"><h3 class="panel-title">Album: <a href="#" class="album-link">' +
                    albumName + '<a/></h3></div>');

                //add  data atrributes to albumDiv
                $albumDiv.attr('album-id', albumID);
                $albumDiv.attr('album-views', albumViews);
                $albumDiv.attr('author-id', albumAthorID);

                // get user(authors) with current id
                ajaxRequester.get('https://api.parse.com/1/users/' + albumAthorID,
                    usersLoadSuccess, ajaxError);

                // get album's rating and post it
                var ratingDiv =
                    '<div class="panel-body-div albumViews-holder">Rating:</div>' +
                    '<div class="progress albumViews-holder">' +
                    '<div class="progress-bar progress-bar-success" role="progressbar" ' +
                    'aria-valuenow="' + albumRating + '"' +
                    'aria-valuemin="0" aria-valuemax="100" style="width:' +
                    albumRating + '%">' + albumRating +
                    '</div>' +
                    '</div>';

                $albumDiv.append(ratingDiv);

                $albumDiv.append('<div class="panel-body-div albumViews-holder">Views: ' +
                    albumViews + '</div>');
                 $albumDiv.append('<div class="panel-body-div albumCategory-holder">Category: ' +
                    albumCategory + '</div>');

                // add created album to album-div-holder
                $('#album-folders-holder').append($albumDiv);

                // add eventhandler on album's title link for displaying photos
                $('.album-link').click(function() {
                    var album = $(this).parents('.album-folder');
                    var albumId = album.attr('album-id');
                    var albumViews = Number(album.attr('album-views'));
                    var albumAuthor = album.attr('author-name');

                    // increase album view on click with ajax request
                    var data = {
                        "shows": albumViews + 1
                    };

                    ajaxRequester.put('https://api.parse.com/1/classes/Album/' + albumId,
                        data, votingSucces, ajaxError);

                    $('#main-page').attr('album-author', albumAuthor);
                    $('#main-page').attr('album-id', albumId);
                    $('#main-page').load('./partialHTML/photos-in-album.html');
                });
            }
        }

        // display album's author(user) on user page
        function usersLoadSuccess(data) {
            // checked that this function is caller correct number of times
            var authorName = data.username;
            var authorID = data.objectId;
            var $albumAuthor = $('<div id="authorID" class="panel-body-div">Author: <a href="#"> ' +
                authorName + '<a/></div>');
            var $currentDiv = $("div").find("[author-id='" + authorID + "']");

            if ($currentDiv.length > 1) { // more than one album with same author
                $currentDiv.children('div[id="authorID"]').remove();
            }
            
            $currentDiv.append($albumAuthor);
            $currentDiv.attr('author-name', authorName);
        }

        function votingSucces() {

        }

        // process data on submiting new album request
        $('#submit-new-album').click(function() {
            var $newAlbumTitle = $('#inputTitle').val();
            var $newAlbumCategory = $('#inputCategory').val();

            // check if input is not empty or whitespacess string
            if (/^\s*$/.test($newAlbumTitle) || /^\s*$/.test($newAlbumCategory)) {
                fillAllDataError();
                return;
            }

            // create data object for the request
            var data = {
                'name': $newAlbumTitle,
                'category': $newAlbumCategory,
                "author": {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": currentUser.objectId
                },
                'shows': 1,
                'rating': 1,
            };

            ajaxRequester.post("https://api.parse.com/1/classes/Album", data,
                albumAddedSuccess, ajaxError);

            $('#inputTitle').val('');
            $('#inputCategory').val('');
        });

        // hide dialog for new album on cancel button click
        $('#close-dialog').click(function() {
            $('#new-album-dialog').hide();
        });

        function albumAddedSuccess(data) {
            noty({
                text: 'Album created successfully',
                type: 'success',
                layout: 'center',
                timeout: 2000
            });
            $('#new-album-dialog').hide();
        }

        // noty function for an AJAX request error
        function ajaxError(error) {
            var errorMessage = error.responseJSON;
            noty({
                text: 'Error: ' + errorMessage.error,
                type: 'error',
                layout: 'center',
                timeout: 6000
            });
        }

        // noty function for unfilled user data
        function fillAllDataError() {
            noty({
                text: 'Please fill out all input fields.',
                type: 'warning',
                layout: 'center',
                timeout: 2000
            });
        }
    });
}());