(function() {
    $(function() {
        //hide add photo album
        $('#add-photo').hide();

        // get current user 
        var currentUser = userSession.getCurrentUser();
        var userName = currentUser.username;

        // show button if current user is album's author
        if (userName === $('#main-page').attr('album-author')) {
            $('#add-photo').show();
        }

        // navigate user to home-user-page on clicking back to albums
        $('#back-to-albums').click(function() {
            $('#album-folders-holder').html('');
            $('#main-page').load('./partialHTML/user-page.html');
        });

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

        // display photos on page
        function photosLoadSuccess(data) {
            $('#album-photos-container').html('');
            for (var p in data.results) {
                var photo = data.results[p];
                var photoURL = photo.file['url'];
                var photoName = photo.name;
                var photoVotes = photo.votes;

                // create a photoDiv
                var $photoDiv = $('<div class="well col-md-2 photo-div"></div>');
                var $photoLink = $('<a href="#">');
                var $photoImage = $('<img src="' + photoURL + '" class="photo-image" />');
                $photoImage.attr('data-id', photo.objectId);
                $photoDiv.attr('data-id', photo.objectId);

                $photoLink.append($photoImage);
                var $photoTitle = $('<div><h4>' + photoName + '</h4></div>');
                var $photoVotes = $('<div>Votes:<span class="votes">' + photoVotes + '</span></div>');
                var $voteButton = $('<a href="#" class="btn btn-primary btn-xs vote-button">Vote+</a>');

                // append photDiv to current page
                $photoDiv.append($photoLink);
                $photoDiv.append($photoTitle);
                $photoDiv.append($photoVotes);
                $photoDiv.append($voteButton);

                // append delete button if author and current user are the same
                if (userName === $('#main-page').attr('album-author')) {
                    var $deleteButton = $('<a href="#" class="btn btn-primary btn-xs delete-button">Delete</a>');
                    $photoDiv.append($deleteButton);
                }

                $('#album-photos-container').append($photoDiv);

                $('a.delete-button').click(function() {
                    var photoId = $(this).parent().find('img.photo-image').attr('data-id');
                    ajaxRequester.delete('https://api.parse.com/1/classes/Photo/' + photoId,
                        null,
                        photoDeletingSuccess(photoId),
                        ajaxError);
                });


                // add eventhandler on photo image for pop-up in full-size
                $('.photo-image').click(function() {
                    var src = $(this).attr('src');
                    var photoId = $(this).attr('data-id');

                    var $photoPopUpDiv = $('<div class="col-md-6 photo-popup-div" style="position: absolute">' +
                        '<div class="well"><button type="button" class="btn btn-default download-photo">Download</button>'+
                        '<button type="button" class="btn btn-default close-photo">Close</button>' +
                        // uncoment the following comment in order to name the files, but only if you upload only JPEGs
                        '<a href="' + src + '" download' /* + '="' + photoId + '.jpg"' */ + '>' +
                        '<img src="' + src + '" class="image-in-popupDiv" /></a>' +
                        '<h4>Leave a comment</h4>' +
                        '<div><textarea class="form-control" rows="3" id="comment"></textarea>' +
                        '<button type="button" class="btn btn-default comment-photo">Post</button></div>' +
                        '</div></div>');

                    $('#page-container').append($photoPopUpDiv);
                    //add eventhandler on photo-close-button
                    $('.close-photo').click(function() {
                        $('.photo-popup-div').remove();
                        $('.photo-popup-div').css('display', 'none');
                    });

                    //add eventhandler on photo-comment-button
                    $('.comment-photo').click(function() {
                        var comment = $('#comment').val();
                        //check if comment is emty string or whitespaces
                        if (/^\s*$/.test(comment)) {
                            fillAllDataError();
                            return;
                        }

                        commentAction.addComment(comment, photoId);
                        $('#comment').val('');
                    });

                    //add eventhandler on photo-download-button
                    $('.download-photo').click(function() {
                        noty({
                            text: 'Click the picture to download it :)',
                            type: 'information',
                            layout: 'center',
                            timeout: 1000
                        });
                    });
                });
            }
            // This should be outside the for loop.
            $('a.vote-button').click(function() {
                var $parent = $(this).parent();
                var votesSpan = $parent.find('span.votes');
                var votes = Number(votesSpan.text()) + 1;
                var photoId = $parent.find('img.photo-image').attr('data-id');
                var data = {
                    'votes': votes
                };
                ajaxRequester.put('https://api.parse.com/1/classes/Photo/' + photoId,
                    data,
                    photoVotingSuccess(votesSpan, votes),
                    ajaxError);
                // $parent.find('span.votes').text(votes + 1);
            });

            function photoVotingSuccess(votesSpan, numVotes) {
                votesSpan.text(numVotes);
                noty({
                    text: 'Your vote was successfully accepted!',
                    type: 'success',
                    layout: 'center',
                    timeout: 2000
                });
            }

            function photoDeletingSuccess(photoId) {
                noty({
                    text: 'The picture was successfully deleted!',
                    type: 'success',
                    layout: 'center',
                    timeout: 2000
                });

                $("div").find("[data-id='" + photoId + "']").remove();
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

        // noty function for empty comment
        function fillAllDataError() {
            noty({
                text: 'Comment can not be empty',
                type: 'warning',
                layout: 'center',
                timeout: 2000
            });
        }


    });
}());