/**
 * Created by marto on 8.12.2014 г..
 */

var albumDao = (function () {
    var albumUrl = 'https://api.parse.com/1/classes/Album';

    var getAllAlbums = function (successGetAllAlbums, errorGetAllAlbums) {
        ajaxRequester.get(albumUrl, successGetAllAlbums, errorGetAllAlbums);
    };

    return {
        getAll: getAllAlbums
    }
}());

var albumUtil = (function () {
    function createAlbumDivWrapper(album) {
        //get each album's data
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

        createRatingDiv($albumDiv, albumRating);

        $albumDiv.append('<div class="panel-body-div albumViews-holder">Views: ' +
        albumViews + '</div>');
        $albumDiv.append('<div class="panel-body-div albumCategory-holder">Category: ' +
        albumCategory + '</div>');

        return $albumDiv;
    };

    function createRatingDiv(albumDiv, albumRating) {
        var ratingDiv =
            '<div class="panel-body-div albumViews-holder">Rating:</div>' +
            '<div class="progress albumViews-holder">' +
            '<div class="progress-bar progress-bar-success" role="progressbar" ' +
            'aria-valuenow="' + albumRating + '"' +
            'aria-valuemin="0" aria-valuemax="100" style="width:' +
            albumRating + '%">' + albumRating +
            '</div>' +
            '</div>';

        albumDiv.append(ratingDiv);
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


    var generateAlbumDivsForData = function (data) {
        var albumWrapper = $('<div>');
        if (data) {
            for (var a in data.results) {
                var album = data.results[a];
                var albumDiv = generateAlbumDiv(album);
                albumWrapper.append(albumDiv);
            }
        }
        return albumWrapper;
    };

    var generateAlbumDiv = function (album) {
        var albumDiv = createAlbumDivWrapper(album);

        var userUrl = albumDiv.attr('author-id');
        userDao.get(userUrl, null, usersLoadSuccess, function usersLoadError() {
            // TODO: Handle error.
        });

        return albumDiv;
    };

    return {
        crateSingleAlbumDom: generateAlbumDiv,
        createMultipleAlbumsDom: generateAlbumDivsForData
    }
}());