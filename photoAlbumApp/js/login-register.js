$(function () {
    // register new user 
    $('#register-user-button').click(function () {
        // get registration data from input fields
        var $username = $('#register-username').val();
        var $password = $('#register-password').val();
        var $aboutme = $('#register-aboutme').val();
        // check if input is not empty or whitespacess string
        if (/^\s*$/.test($username) || /^\s*$/.test($password)) {
            fillAllDataError();
            return;
        }
        // create json object with ne user data
        var data = {
            'username': $username,
            'password': $password,
            'aboutme': $aboutme,
        };
        // make the ajax request to parse.com 
        ajaxRequester.post("https://api.parse.com/1/users", data,
            userRegisterSuccess, ajaxError);
    });

    function userRegisterSuccess(data) {
        // load the user-registerd-success.html page and infrom the user about the photo album options
        $('#main-page').load('./partialHTML/user-registered-success.html');     
    }

    // login for registered users
    $('#login-button').click(function () {      
        // get registration data from input fields
        var $username = $('#login-username').val();
        var $password = $('#login-password').val();
        // check if input is not empty or whitespacess string
        if (/^\s*$/.test($username) || /^\s*$/.test($password)) {
            fillAllDataError();
            return;
        }

        ajaxRequester.get('https://api.parse.com/1/login?username=' + $username + '&password=' + $password,
            loginSuccess, ajaxError);       
    });

    function loginSuccess(data) {
        // store user data(name, id, session token) send from the response in the sessionStorage
        userSession.login(data);
        // load the home page and greet the logged user
        $('#main-page').load('./partialHTML/user-page.html');
        $('#login-page').text('Logout');
    }

    // noty function for unfilled user data
    function fillAllDataError() {
        noty({
            text: 'Please fill out all input fields.',
            type: 'warning',
            layout: 'topCenter',
            timeout: 2000
        });
    }

    // noty function for an AJAX request error
    function ajaxError() {
        noty({
            text: 'An error occured.',
            type: 'error',
            layout: 'topCenter',
            timeout: 2000
        });
    }

}());

