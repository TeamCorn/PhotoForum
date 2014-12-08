$(function () {
    // hide new album button and clear album div holder
    $('#new-album-dialog').hide();
    $('#album-folders-holder').html('');

    // get the current user and display his data
    var currentUser = userSession.getCurrentUser();
    if (currentUser) {
        var username = currentUser.username;
        userUtil.personalize(username);
    }

    // display new album button on click
    $('#create-album').click(function () {
        // show new album dialog and process data
        $('#new-album-dialog').css({
            position: 'fixed',
            top: '20%',
            left: '30%'
        }).show();
    });

    // load  all albums from database
    /*ajaxRequester.get('https://api.parse.com/1/classes/Album',
     albumLoadSuccess, ajaxError);*/

    albumDao.getAll(albumLoadSuccess, ajaxError);

    // display albums title on user page
    function albumLoadSuccess(data) {
        // clear div if the page is already populated and user is reloading
        $('#album-folders-holder').html('');

        var albumWrapper = albumUtil.createMultipleAlbumsDom(data);

        $('#album-folders-holder').append(albumWrapper);

        $('.album-link').click(function () {
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

    // display album's author(user) on user page
    function usersLoadSuccess(data) {
        // TODO: checked that this function is called correct number of times
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
    $('#submit-new-album').click(function () {
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
            'rating': 1
        };

        ajaxRequester.post("https://api.parse.com/1/classes/Album", data,
            albumAddedSuccess, ajaxError);

        $('#inputTitle').val('');
        $('#inputCategory').val('');
    });

    // hide dialog for new album on cancel button click
    $('#close-dialog').click(function () {
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
}());
