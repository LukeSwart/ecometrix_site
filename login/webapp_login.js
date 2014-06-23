function getUserLoginInfo() {
    var errorCount = 0;
    var formIsBlank = true;
    console.log("validating for empty fields: ");
    $('#login input').each(function(index, val) {
        formIsBlank = false;
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log("errorCount: " + errorCount);

    // Check and make sure errorCount's still at zero
    if (errorCount === 0 && !formIsBlank) {

        // If it is, compile all user info into one object
        var newUserInfo = {
            'username': $('#username').val().trim(),
            'password': $.md5($('#password').val())
        };
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
    return newUserInfo;
}

// get user info from the new user added page
function getNewUserInfo() {
    var errorCount = 0;
    var formIsBlank = true;
    console.log("validating for empty fields: ");
    $('#addUser input').each(function(index, val) {
        formIsBlank = false;
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log("errorCount: " + errorCount);

    // Check and make sure errorCount's still at zero
    if (errorCount === 0 && !formIsBlank) {

        // If it is, compile all user info into one object
        var newUserInfo = {
            'username': $('#username').val().trim(),
            'password': $.md5($('#password').val()),
            'email': $('#email').val().trim(),
            'fullName': $('#fullName').val().trim(),
            'age': $('#age').val().trim(),
            'location': $('#location').val().trim()
        };
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
    return newUserInfo;
}

function requestUserInfoViaAJAX(event) {
    /* stop form from submitting normally */
    event.preventDefault();

    var userinfo = getUserLoginInfo();
    console.log("retrieved userinfo: ");
    console.log(userinfo);
    if (!userinfo)
        return false;

    $.ajax({
        type: 'GET',
        data: jQuery.param(userinfo),
        // contentType: 'application/json; charset=utf-8',
        url: '/login/verify',
        dataType: 'JSON'
    }).done(function(response) {
        if (response.msg == '') {
            var message = "Welcome to Ecometrix, " + userinfo.username + "!";
            alert(message);
            window.location.href = '/app.html';
        } else {
            alert("error: " + response.msg);
        }
        $('.field').val('');
    });

    return true;
}

// Closure for submit on click
function insertUserInfoViaAJAX(event) {
    /* stop form from submitting normally */
    event.preventDefault();

    var userinfo = getNewUserInfo();
    console.log("retrieved userinfo: ");
    console.log(userinfo);
    if (!userinfo)
        return false;

    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: userinfo,
        url: '/login/adduser',
        dataType: 'JSON'
    }).done(function(response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            var message = "Welcome to Ecometrix, " + userinfo.username + "!";
            message += "\nWe love having new users! Just be patient while we are beta mode :)";
            alert(message);
            window.location.href = '/app.html';
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
        // Clear the form inputs
        $('.field').val('');
    });
    return true;
}

$(document).ready(function() {

    /* attach a submit handler to the form */
    $('#userinfo').submit(requestUserInfoViaAJAX);
    $('#adduserinfo').submit(insertUserInfoViaAJAX);
});
