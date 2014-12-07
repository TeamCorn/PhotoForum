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
                var photoName = photo.name;
                var photoVotes = photo.votes;

                // create a photoDiv
                var $photoDiv = $('<div class="well col-md-2 photo-div"></div>');
                var $photoImage = $('<a href="#"><img src="' + photoURL + '" class="photo-image"></a>');
                var $photoTitle = $('<div><h4>' + photoName + '</h4></div>');
                var $photoVotes = $('<div>Votes:' + photoVotes + '</div>');
                var $voteButton = $('<div><a href="#" class="btn btn-primary btn-xs">Vote+</a></div>');

                // append photDiv to current page
                $photoDiv.append($photoImage);
                $photoDiv.append($photoTitle);
                $photoDiv.append($photoVotes);
                $photoDiv.append($voteButton);
                $('#album-photos-container').append($photoDiv);

                // add eventhandler on photo image for pop-up in full-size
                $('.photo-image').click(function() {
                    var src = $(this).attr('src');
                    var $photoPopUpDiv = $('<div class="col-md-6 photo-popup-div" style="position: absolute">' +
                        '<div class="well"><button type="button" class="btn btn-default close-photo">Close</button>' +
                        '<img src="' + src + '" class="image-in-popupDiv"></div>' + '</div>');
                  
                      $('#page-container').append($photoPopUpDiv);
                    //add eventhandler on photo-close-button
                    $('.close-photo').click(function() {
                        $('.photo-popup-div').remove();
                        $('.photo-popup-div').css('display','none');
                    });
                });
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