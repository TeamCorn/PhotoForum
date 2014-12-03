(function() {
    $(function() {
       // register new user with an ajax post request
        $('#register-user-button').click(function(){
            // get registration data from input fields
            var $username = $('#register-username').val();
            var $password = $('#register-password').val();
            var $aboutme = $('#register-aboutme').val();
            // check if input is not empty or whitespacess string
            if (/^\s*$/.test($username) || /^\s*$/.test($password)) { 
                alert('please fill all data');
                return;
            }
            // create json object with ne user data
             var data = {
                'username': $username,
                'password': $password,
                'aboutme': $aboutme,
            };
            // make the ajax request to pars.com 
            ajaxRequester.post("https://api.parse.com/1/users", data,
                userAddedSuccess, ajaxError);
        });


        function userAddedSuccess(data){
             alert('successfully registered');
        }

        // login for registered users
        $('#login-button').click(function(){
            // get registration data from input fields
            var $username = $('#login-username').val();
            var $password = $('#login-password').val();
            // check if input is not empty or whitespacess string
            if (/^\s*$/.test($username) || /^\s*$/.test($password)) {         
                alert('please fill all data');
                return;
            }
            // make the ajax request to pars.com 
            ajaxRequester.get('https://api.parse.com/1/login?username=' + $username + '&password=' + $password,
                loginSuccess, ajaxError);
        });

        function loginSuccess(data){
             alert('login successfull');
        }

        // noty function for succssfuly added item
        function addedSuccessfully() {
            noty({
                text: 'Item added successfully',
                type: 'success',
                layout: 'topCenter',
                timeout: 2000
            });
        }

        // noty function for and AJAX request error
        function ajaxError() {
            noty({
                text: 'An error occured.',
                type: 'error',
                layout: 'topCenter',
                timeout: 2000
            });
        }
    });
}());