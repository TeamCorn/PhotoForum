(function() {
    $(function() {
    	// get the curent user and display his data
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            var username = currentUser.username;
            $('#user-wellcome-message').text('Hello there ' + username);
        }
    });
}());