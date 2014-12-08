/**
 * Created by marto on 8.12.2014 г..
 */

var userDao = (function () {
    var userUrl = 'https://api.parse.com/1/classes/_User';

    // Gets all users from parse.com.
    var getAllUsers = function (success, error) {
        ajaxRequester.get(userUrl, success, error);
    };

    // Get a single user from parse.com by given user id.
    var getUserById = function (userId, success, error) {
        var url = 'https://api.parse.com/1/users/' + userId;

        ajaxRequester.get(url, success, error);
    };

    return {
        getAll: getAllUsers,
        get: getUserById
    }
}());

var userUtil = (function () {

    /**
     * Apply the currently logged user name to some labels.
     *
     * @param username - the user name that will be displayed in the welcome message and logout button.
     */
    var personalizeWithUserData = function (username) {
        //load the dropdown nav menu which is hidden by default.
        //TODO: This should be completely removed if the user is not yet logged in.
        $('#user-dropdown-menu').show();
        $('#login-page').hide();
        $('#user-name').text(username);
        $('#user-wellcome-message').text('Hello there, ' + username);
    };

    return {
        personalize: personalizeWithUserData
    }
}());