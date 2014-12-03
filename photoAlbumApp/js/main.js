(function() {
    $(function() {
        // load home page on clicking the home(team-corn) button
        $('#login-page').click(function() {
            $('#main-page').load('./partialHTML/login-register.html');
        });
        // load login page on clicking the login button
        $('#home-page').click(function() {
            $('#main-page').load('./partialHTML/home-page.html');
        });
        // load login page on clicking the login button
        $('#aboutUs-page').click(function() {
            $('#main-page').load('./partialHTML/about-us.html');
        });
    });
}());