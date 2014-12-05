(function() {
    $(function() {
        // upon loading the page check if the user is already logged in 
        //  and navigate him to his page
        $('#login-page').text('Login');
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            $('#main-page').load('./partialHTML/user-page.html');
            $('#login-page').text('Logout');
        }

        // load login page on clicking thelogin - button
        $('#login-page').click(function() {
            //check if the user is loggd in and if he is we log him out an return 
            // him to the main page
            var currentUser = userSession.getCurrentUser();
            if (currentUser !== undefined) {
                $('#main-page').load('./partialHTML/home-page.html');
                sessionStorage.clear();
                $('#login-page').text('Login');
                return;
            }

            $('#main-page').load('./partialHTML/login-register.html');
        });

        // load hom  page on clicking the home button
        $('#home-page').click(function() {
            $('#main-page').load('./partialHTML/home-page.html');
        });
        
        // load login page on clicking the login button
        $('#aboutUs-page').click(function() {
            $('#main-page').load('./partialHTML/about-us.html');
        });
    });
}());