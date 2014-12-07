(function() {
    $(function() {
        var albumID = $('#main-page').attr('album-id');

        // get the album with the currentID
        ajaxRequester.get('https://api.parse.com/1/classes/Album/' + albumID,
            albumLoadSuccess, ajaxError);

        // display album name on page
        function albumLoadSuccess(data) {
            var albumName = data.name;
            $('#album-photos').text(albumName);
        }

        // load photos from current album
        ajaxRequester.get('https://api.parse.com/1/classes/Photo?' +
            'where={"album":{"__type":"Pointer","className":"Album","objectId":"' +
            albumID + '"}}', photosLoadSuccess, ajaxError);

         // display photos on  page
        function photosLoadSuccess(data) {
            for (var p in data.results) {
            	var photo = data.results[p];
            	var photoURL = photo.file['url'];

            	var $photoDiv = $('<div class="well col-md-2 photo-div"></div>');
            	var $photoImage = $('<img src="' + photoURL + '" class="photo-image">');

            	$photoDiv.append($photoImage);
            	$('#album-photos-container').append($photoDiv);
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