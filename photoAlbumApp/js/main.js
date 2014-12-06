(function() {
    $(function() {
        // upon loading the page check if the user is already logged in
        // and navigate him to his home page
        $('#user-dropdown-menu').hide();
        
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            $('#main-page').load('./partialHTML/user-page.html');
            $('#album-folders-holder').html('');
            $('#user-dropdown-menu').show();
            $('#login-page').hide();
            $('#user-name').text(currentUser.username);
        }

        // load login page on clicking thelogin - button
        $('#login-page').click(function() {
            $('#main-page').load('./partialHTML/login-register.html');
        });

        // load home  page on clicking the home button
        $('#home-page').click(function() {
            $('#main-page').load('./partialHTML/home-page.html');
        });

        // load login page on clicking the login button
        $('#aboutUs-page').click(function() {
            $('#main-page').load('./partialHTML/about-us.html');
        });

        // load userhomepage on clicking dropdown profile-button
        $('#user-profile').click(function() {
            $('#main-page').load('./partialHTML/user-page.html');
            $('#album-folders-holder').html('');
        });

        // logoutuser on clicking dropdown logout-button
        $('#user-logout').click(function() {
            sessionStorage.clear();
            $('#main-page').load('./partialHTML/home-page.html');
            $('#user-dropdown-menu').hide();
            $('#login-page').show();
        });
    });
}());