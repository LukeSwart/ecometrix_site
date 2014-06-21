function verifyLogin(userToken) {
    // console.log("getting ecoblocks at index: " + userToken);
    // $.ajax({
    //     // TODO: Enable Cross-Origin-Resource-Sharing (CORS)
    //     // url: "http://yourecometrix.co:3002/posts/" + index, // on server
    //     // url: "http://yourecometrix.co/posts/" + index, // on server, port forwarded
    //     url: "http://localhost:3002/login/" + userToken, // local
    //     cache: false
    // })
    //     .done(function(json) {
    //         // window.ecometrix.questions = json;
    //         var obj = JSON.parse(json);

    //         alert("Retrieved data: " + obj.token);
    //     });
    // // do nothing if this fails

    var obj = JSON.parse(userToken);
    console.log("obj: " + obj);
    console.log("obj username: " + obj.username);
    console.log("obj password: " + obj.password);
    var username = obj.username;
    var password = obj.password;
    var md5_password = $.md5(obj.password);
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("md5_password: " + md5_password);

    var userinfo = {username: 'lucas', password: '81dc9bdb52d04dc20036dbd8313ed055'};
    console.log("sending userinfo to server: " + userinfo);
    var URIEncodedInfo = encodeURIComponent(JSON.stringify(userinfo));
    console.log("sending userinfo to server: " + URIEncodedInfo);
    $.ajax({
        type: 'GET',
        data: jQuery.param(userinfo),
        contentType: 'application/json; charset=utf-8',
        url: '/login/verify'
    }).done(function(response) {
        alert(response.msg);
    });
    // var md5 = $.md5('value'); // from "https://github.com/placemarker/jQuery-MD5"
    // Use AJAX to post the object to our adduser service
    // route with parameters (http://localhost:3002/verify/:username)

    //     // url: 'http://localhost:3002/login/verify/' + JSON.stringify(userinfo), //'/login/verify/:username', //
    //     // url: 'http://localhost:3002/login/verify',
    //     // dataType: 'json',// response type from server
        // contentType: 'application/json',

    //     // Check for successful (blank) response
    //     // if (response.msg === '') {

    //         // Clear the form inputs
    //         // $('#addUser fieldset input').val('');

    //         // Update the table
    //         // populateTable();
    //         alert(response.msg);
    //     } else {

    //         // If something goes wrong, alert the error message that our service returned
    //         alert('Error: ' + response.msg);
    //     }
    // });
}

$(document).ready(function() {
    // 1234 = 81dc9bdb52d04dc20036dbd8313ed055
    $('#submit-login').click(function() {
        var user = "{ \"username\": \"luke\", \
        \"name\": \"luke\",\
        \"last\": \"swart\",\
        \"password\": \"1234\"\
        \ }";
        console.log("user json: " + user);

        // $('#login').toggle();
        verifyLogin(user);
    });
});
// $.getJSON('/users/userlist', function(data) {

//     // Stick our user data array into a userlist variable in the global object
//     userListData = data;

//     // For each item in our JSON, add a table row and cells to the content string
//     $.each(data, function() {
//         tableContent += '<tr>';
//         tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
//         tableContent += '<td>' + this.email + '</td>';
//         tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
//         tableContent += '</tr>';
//     });

//     // Inject the whole content string into our existing HTML table
//     $('#userList table tbody').html(tableContent);
// });
