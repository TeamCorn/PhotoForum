/**
 * Dao class used to make database queries.
 */
var commentDao = (function () {
    var commentsUrl = 'https://api.parse.com/1/classes/Comment/';

    //'where={"photo":{"__type":"Pointer","className":"Photo","objectId":"5xM4PvoBB5"}}'
    var getAllCommentsForPhoto = function (photoId) {
        var url = '?where={"photo":{"__type":"Pointer","className":"Photo","objectId":"' + photoId + '"}}';

        ajaxRequester.get(commentsUrl + url,
            function commentLoadSuccess(data) {
                if (data) {
                    var commentDiv = $('<div />');
                    for (var currentComment in data.results) {
                        var comment = data.results[currentComment];
                        userDao.get(comment.user.objectId, comment, function successGetUser(data) {
                            var commentData = comment.data;
                            var userName = data.username;
                            var commentWrapper = commentUtil.generateCommentDom(comment.data, data.username);
                            commentDiv.append(commentWrapper);
                            $('.pop-up').append(commentDiv);
                        });
                    }
                }
            });
    };

    var getSingleCommentForPhoto = function (photoId) {

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

                userDao.get(commentData.user.objectId, commentData, function (data) {
                    var commentWrapper = commentUtil.generateCommentDom(commentData.data, data.username);
                    var commentDiv = $('<div />');
                    commentDiv.append(commentWrapper);
                    $('.pop-up').append(commentDiv);

                });


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
    var generateCommentDom = function (commentText, username) {
        var commentWrapper = $('<div />');
        var commentSpan = $('<span />');
        var usernameSpan = $('<span />');
        /*userDao.get(comment.user, function () {

         });*/
        usernameSpan.text(username);
        commentSpan.text(commentText);

        commentWrapper.append(usernameSpan);
        commentWrapper.append(commentSpan);
        return commentWrapper;
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