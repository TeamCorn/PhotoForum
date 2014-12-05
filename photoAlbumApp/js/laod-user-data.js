(function() {
    $(function() {
        // get the curent user and display his data
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            var username = currentUser.username;
            //load the dropdown nav menu d
            $('#user-dropdown-menu').show();
            $('#login-page').hide();
            $('#user-name').text(username);
            $('#user-wellcome-message').text('Hello there ' + username);
        }
    });
}());