function verifyLogin() {
        // If using an ID other than #email or #error then replace it here
        // email = $("#email");       
        var errornotice = $("#error");
        // The text to show up within a field when it is incorrect
        var emptyerror = "Please fill out this field.";
        // var emailerror = "Please enter a valid e-mail.";

        // Add the fields
        var userTokens = {
            data: []
        };
        userTokens.data.push({
            username: $('#username').val(),
            password: $('#password').val()
        });

        console.log("verifying input: ");
        console.log(userTokens);
        console.log(JSON.stringify(userTokens));

        var username = userTokens.data[0].username;
        var password = userTokens.data[0].password;
        var md5_password = $.md5(userTokens.data.password);
        console.log("username: " + username);
        console.log("password: " + password);
        console.log("md5_password: " + md5_password);

        var userinfo = {
            username: username,
            password: md5_password
        };
        console.log("sending userinfo to server: ");
        console.log(userinfo);
        $.ajax({
            type: 'GET',
            data: jQuery.param(userinfo),
            contentType: 'application/json; charset=utf-8',
            url: '/login/verify'
        }).done(function(response) {
            alert(response.msg);
        });

        // Clears any fields in the form when the user clicks on them
        $(":input").focus(function() {
            // $('#username').val('');
            // $('#password').val('');
            $(this).closest('form').find("input[type=text], textarea").val("");
        }); 

} // End verify login

$(document).ready(function() {

    /* attach a submit handler to the form */
    $('#userinfo').submit(function(event) {
        /* stop form from submitting normally */
        event.preventDefault();
        verifyLogin();
        return true;
    });
});
