function getUserLoginInfo() {
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
        username: $('#username').val().trim(),
        password: $('#password').val()
    });

    console.log("verifying input: ");
    console.log(userTokens);
    console.log(JSON.stringify(userTokens));

    var username = userTokens.data[0].username;
    var password = userTokens.data[0].password;
    var md5_password = $.md5(password);
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("md5_password: " + md5_password);

    var userinfo = {
        username: username,
        password: md5_password
    };
    return userinfo;
}

// get user info from the new user added page
function getNewUserInfo() {
    var errorCount = 0;
    console.log("validating for empty fields: ");
    $('#addUser input').each(function(index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    console.log("errorCount: " + errorCount);

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

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
        // alert("errors detected. Please fill in all fields.");
        // console.log("errors detected. Please fill in all fields.");
        return false;
    }
    return newUserInfo;
}

function requestUserInfoViaAJAX(event) {
    /* stop form from submitting normally */
    event.preventDefault();

    var userinfo = getUserLoginInfo();
    console.log("sending userinfo to server: ");
    console.log(userinfo);

    // // jQuery AJAX call for JSON
    // $.getJSON( '/login/verify', function( data ) {

    // // Stick our user data array into a userlist variable in the global object
    // // userListData = data;

    //     // For each item in our JSON, add a table row and cells to the content string
    //     $.each(data, function(){
    //         if (response.msg == '') {
    //             var message = "Welcome to Ecometrix, " + userinfo.username + "!";
    //             alert(message);
    //             window.location.href='/app.html';
    //         } else {
    //             alert("error: " + response.msg);
    //         }
            
    //         // tableContent += '<tr>';
    //         // tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
    //         // tableContent += '<td>' + this.email + '</td>';
    //         // tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
    //         // tableContent += '</tr>';
    //     });
    // 
    //     // Inject the whole content string into our existing HTML table
    //     $('#userList table tbody').html(tableContent);
    // });


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
            window.location.href='/app.html';
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
    console.log("sending userinfo to server: ");
    console.log(userinfo);

        // // Use AJAX to post the object to our adduser service
        // $.ajax({
        //     type: 'POST',
        //     data: newUser,
        //     url: '/users/adduser',//
        //     dataType: 'JSON'
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
            window.location.href='/app.html';
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
