/**
 * Dao class used to make database queries.
 */
var commentDao = (function () {
    var commentsUrl = 'https://api.parse.com/1/classes/Comment/';

    //'where={"question":{"__type":"Pointer","className":"Photo","objectId":"5xM4PvoBB5"}}'
    var getAllCommentsForPhoto = function (photoId) {
        ajaxRequester.get(commentsUrl, function successGetAllComments() {

            },
            function errorGetAllComments() {

            });
    };

    var getSingleCommentForPhoto = function (photoId) {
        //TODO: Not implemented
    };

    var getTopRatedCommentForPhoto = function (photoId) {
        //TODO: Not implemented
    };

    var addComment = function (commentText, photoId, userId) {
        var commentData = {
            "data": commentText,
            "photo": {
                "__type": "Pointer",
                "className": "Photo",
                "objectId": photoId
            },
            "user": {
                "__type": "Pointer",
                "className": "_User",
                "objectId": userId
            }
        };

        ajaxRequester.post(commentsUrl, commentData,
            function addedCommentSuccessfully() {
                // alert('Comment added successfully.');
                noty({
                    text: 'Comment added successfully.',
                    type: 'success',
                    layout: 'center',
                    timeout: 2000
                });
            },
            function errorAddingComment() {
                // alert('Error while adding comment.');
                noty({
                    text: 'Error while adding comment.',
                    type: 'error',
                    layout: 'center',
                    timeout: 2000
                });
            });
    };

    return {
        getAllCommentsForPhoto: getAllCommentsForPhoto,
        getSingleCommentForPhoto: getSingleCommentForPhoto,
        getTopRatedCommentForPhoto: getTopRatedCommentForPhoto,
        addComment: addComment
    };

}());

/**
 * Utility class to help build UI related stuff.
 */
var commentUtil = (function () {
    var generateCommentDom = function (parent) {
        /*
         //Create text area for comment text.
         var commentTextArea = $('<textarea />');
         $(commentTextArea).addClass('form-control');
         commentTextArea.attr('plceholder', "Enter comment here...");
         commentTextArea.attr('rows', "2");
         commentTextArea.attr('cols', "50");

         // Crate add button to add the comment.
         var addCommentButton = $('<button />');
         addCommentButton.text('Add comment');
         $(addCommentButton).addClass('btn btn-default btn-sm');
         addCommentButton.click(function () {
         var commentText = commentAction.getCommentFromTextArea(commentTextArea);
         if (commentText) {
         $(commentTextArea).val('');
         commentAction.addComment(commentText);
         }
         });

         // Append text area and button to a wrapper.
         var commentWrapper = $('<div />');
         commentTextArea.appendTo(commentWrapper);
         addCommentButton.appendTo(commentWrapper);

         commentWrapper.appendTo(parent);
         */
    };

    return {
        generateCommentDom: generateCommentDom
    }
}());

/**
 * Action class that will contain the logic for creating comments and will use commentUtil and commentDao.
 */
var commentAction = (function () {
    var addComment = function (commentText, photoId) {
        var currentUser = userSession.getCurrentUser();

        //console.log(photoId);
        //Id of currently logged user - the user that writes the comment.
        var userId = currentUser['objectId'];
        commentDao.addComment(commentText, photoId, userId);
    };

    var getCommentFromTextArea = function (commentTextArea) {
        var commentText = $(commentTextArea).val();
        if (commentText) {
            return encodeURI(commentText);
        }
    };

    return {
        addComment: addComment,
        getCommentFromTextArea: getCommentFromTextArea
    }
}());