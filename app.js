// Defines the initial content and interaction for the app's 
// main question page.
function initiateBehavior() {
    // initially hide all motivation
    $(".motivation").hide();
    $(".buttons").hide();
    $(".qinfo").hide();

    // Allow questions to be opened or closed
    $(".qtext").unbind('click');
    $(".qtext").click(function(e) {

        /* debug info */
        var hasOpenQ = $(this).hasClass("openQ");
        var hasInitQ = $(this).hasClass(".initQ");

        console.log("clicked, isOpen: " + hasOpenQ +
            ", isInit: " + hasInitQ);

        /*
    Toggle line height
    Note:
    could have just set the base class then toggleClass
    */
        if (hasOpenQ) {

            //reduce
            $(this).addClass("modified initQ").removeClass("openQ");
            $(this).parent(".question").find(".buttons").slideUp();
            $(this).parents(".question").find(".qinfo").slideUp();

        } else {

            // embiggen
            $(this).removeClass("initQ").addClass("openQ");
            $(this).parents(".question").find(".qinfo").slideDown();
            $(this).parent(".question").find(".buttons").slideDown();
        }
    });

    // If you click yes or no, then show the motivation
    $(".buttony button").unbind('click');
    $(".buttony button").click(
        function() {
            $(this).parents(".question").find(".qtext").slideUp();

            $(this).parents(".question").find(".qinfo").slideUp();

            $(this).parent().slideUp();
            $(this).parents(".question").find(".motivation").slideDown();

//            updateQuestionGraph();
            scoreFromButton($(this).attr("value"));
        }
    );

    // If you click yes or no, then update the eco points
//    $(".yesB").click(
//        function() {
    function scoreFromButton(newPoints) {
            console.log("Clicked score button - update the eco points!");
//            var newPoints = 1;
//            var newPoints = $(this).attr("value");
            console.log('new points is: ' + newPoints);

//            newPoints = parseInt(newPoints);
//            console.log('new points, parsed, is: ' + newPoints);
//            console.log(newPoints);

            // TODO: do something different for yes and no


            var setCumulativePoints = function(newCumulativePoints) {
                cumulativePoints = newCumulativePoints;
                updateEcoscoreGraph(cumulativePoints);
            };
            // Retrieve more questions from the server.
            // Increment our index of questions.
            var cumulativePoints = 0;
            $.ajax({
                type: 'PUT',
                data: {'newPoints': newPoints},
                url: "/score",
                dataType: 'JSON',
                success: function(data) {
//                    cumulativePoints = data.msg;
                    console.log("incremented cumulativePoints to: " + data.msg);
                    setCumulativePoints(data.msg);
                }
            });
//        });
    };


    $(".ad").hide();
} // end initiate behavior

/*
 * Renderer
 */
function ecoRender() {
    for (var i = 0; i < window.ecometrix.questions.data.length; i++) {
        //console.log ("what is the ith:"+i+ window.ecometrix.questions.data[i] );
        //console.log ("data: "+i+ window.ecometrix.questions.data[i] );
        //console.log ("buttons: "+i+ window.ecometrix.questions.data[i] );
        ecoBlock(window.ecometrix.questions.data[i]);
    }
}

function ecoBlock(argFrame) {
    /* 
     *  Questions have the following layout:
     *
     *  div class=question qEssence
     *      div class= qtext initQ
     *      div class= qinfo initQ
     *      div class= buttons buttony
     *           button class=btn yesB
     *           button class=btn noB
     *      div class= motivation
     *
     * div class=ttrContent ttrEssence
     *      div class= ttext
     */

    // var construct ecoblock
    var newBlock = jQuery('<div class="parent row">');

    /* decide which class it is and set question or twitter or whatever */

    if (argFrame.type == "question") {
        newBlock.addClass('question qEssence');
    }

    if (argFrame.type == "twitter") {
        newBlock.addClass('ttrEssence ttrContent');
    }

    console.log("argFrame: " + argFrame.type);

    // frame content: qtext and ttext
    if (typeof argFrame.content != "undefined") {

        var content =
            $('<div>').text(argFrame.content);

        if (argFrame.type == "question") {
            content.addClass('qtext initQ');
        }

        if (argFrame.type == "twitter") {
            content.addClass('ttext');
        }
        content.appendTo(newBlock);
    }

    // frame info
    if (typeof argFrame.info != "undefined") {
        var info =
            $('<div>').text(argFrame.info);
        info.addClass('qinfo initQ');
        info.appendTo(newBlock);
    }

    // frame buttonBox
    if (argFrame.btns != "undefined") {
        var bbox = $('<div>');
        for (var i = 0; i < argFrame.btns.length; i++) {
            var btn = $('<button>');

            // TODO: Do something based on user responses.
            if (argFrame.btns[i] == 'yes') {
                btn = $(window.ecometrix.resources.btn.btnYes);
                btn.val('1');
                bbox.addClass('buttons buttony');
            }

            if (argFrame.btns[i] == 'no') {
                btn = $(window.ecometrix.resources.btn.btnNo);
                btn.val('0');
                bbox.addClass('buttons buttonn');
            }
            bbox.append(btn);
        }
        bbox.appendTo(newBlock);
    }

    // frame info

    // motivation list...
    /*     if (typeof argFrame.motivations != "undefined") {
           var motivation =
           $('<div>').text(argFrame.motivation);
           for (var i = 0; i < argFrame.motivations.length; i++) {
           motivation.addClass('motivation');
           motivation.appendTo(newBlock);
           }
    */

    if (typeof argFrame.motivation != "undefined") {
        var motivation =
            $('<div>').text(argFrame.motivation);
        motivation.addClass('motivation');
        motivation.appendTo(newBlock);
    }

    // add to ecoblocks
    $("#ecoblocks").append(newBlock);
}

function updateScore(argID, newValue, label) {
// 'ecoscore', 'ecoScore'
// 'qscore', 'Questions'
    var scoreValue = Math.round(newValue);
    var domScore = jQuery('#' + argID);
    domScore.html(label + ' ' + scoreValue);
    domScore.css('width', limitPct(scoreValue) + '%');

}

function limitPct(argPct) {
    var limitThis = argPct;

    // lower limit %
    if (limitThis <= 8) {
        limitThis = 10;
    }

    // upper limit %
    if (limitThis >= 99) {
        limitThis = 93;
    }

    return limitThis;
}

function numQuestions() {

//    return jQuery("#ecoblocks div.question").length;
    return 15;

}

function completedQuestions() {

    return jQuery("#ecoblocks div.motivation").filter(":visible").length;

}

function updateQuestionGraph() {

    var completedQ = (completedQuestions() / (numQuestions())) * 100;
    console.log('updating questions with completedQ:' + completedQ);
    updateScore('qscore',
        completedQ,
        'Questions');
}

function updateEcoscoreGraph(positiveAnswers) {

    var ecoscore = (positiveAnswers / (numQuestions())) * 100;
    updateScore('ecoscore', ecoscore, 'ecoScore');
}

function splashScreen(duration) {
    duration = duration || 2000;
    $("#score").hide();
    $("#questions").hide();
    $("#splash").show();
    $("#gift").hide();
    $(".ad").hide();
    $("#splash").fadeOut(duration, function() {
        $("#questions").fadeIn("slow");
    });
}

function getMoreEcoBlocks(event) {
    console.log("getting ecoblocks at event,data,index: ");
    console.log(event);
    console.log(event.data);
    console.log(event.data.index);

    // Retrieve more questions from the server. 
    // Increment our index of questions.
    $.ajax({
        url: "/posts/" + event.data.index,
        cache: false
    })
        .done(function(json) {
            window.ecometrix.questions = json;
            ecoRender();
            initiateBehavior();
//            updateQuestionGraph();
            splashScreen(400);
            event.data.index++;
        });
    // TODO: Do something if this fails...
}

function checkForValidSession() {
    $.ajax({
        type: 'GET',
        data: {}, // The AJAX request will not work without a "data" value.
        url: '/login/resumeSession',
        dataType: 'JSON'
    }).done(function(response) {
        if (response.msg == '') {
            console.log("Session is active, redirecting to main app.");
            alert("Welcome to Ecometrix " + response.username + "!\nClick around to get started, or resume your old session.");
            // Continue to the main app page.
        } else {
            alert("Please create an account to get started!");
            // alert(response.msg);
            window.location.href = '/app_login.html';
        }
    });
}


$(document).ready(function() {

    checkForValidSession();
    /*
     * Static content
     */
    if (!window.ecometrix) {
        console.log("empty window.ecometrix");
        window.ecometrix = {};
    }

    /*
     * fill in the data on the page
     */
    window.ecometrix.questions = {
        "data": [{
            "type": "question",
            "content": "Lifestyle habits",
            "info": "Are your showers longer than 10 minutes?",
            "btns": ["yes", "no"],
            "motivation": "Recommended shower times are less than 8 mins. Shortening your shower by just a minute or two can save up to 150 gallons per month. Use a timer to set a limit to your shower, and stick to it!"
        }, {
            "type": "question",
            "content": "Housing",
            "info": "Do you live in a house or apartment?",
            "btns": ["yes", "no"],
            "motivation": "Apartments conserve much more energy through shared utilities and closer living quarters. Houses can often compensate by living with roommates and family. "
        }, {
            "type": "twitter",
            "content": "ttr1.content",
            "info": "ttr2.info",
            "btns": ["yes", "no"],
            "motivation": "ttrm1"
        }, {
            "type": "question",
            "content": "Social Living",
            "info": "Do you live with another person?",
            "btns": ["yes", "no"],
            "motivation": "Communal living bolsters sustainability and reduces our carbon footprint through sharing resources. Whether you are sharing food, heating, or trips to the grocery store, having roommates encourages a sustainable lifestyle. [roommate sharing adds]"
        }]
    };

    window.ecometrix.resources = {
        "btn": {
            "btnYes": "<button  type=\"button\" class=\"btn btn-success yesB the-icons clearfix\"><i class=\"icon-ok\"></i></button>",
            "btnNo": "<button  type=\"button\" class=\"noB btn btn-danger\"><i class=\"icon-remove\"></i></button>"
        }
    };

    /*
     *  Render data, attach behavior
     */
    var cumulativePoints = 0;
    // Retrieve more questions from the server.
    // Increment our index of questions.
    $.ajax({
        type: 'GET',
        data: {},
        url: "/score",
        dataType: 'JSON'
    }).done(function(response) {
        cumulativePoints = response.msg;
        console.log("updated cumulativePoints to: " + cumulativePoints);
    });

    console.log("Cumulative points: " + cumulativePoints);
    if (!cumulativePoints)
        cumulativePoints = 0;

    ecoRender();
    initiateBehavior();
//    updateQuestionGraph();
    updateEcoscoreGraph(cumulativePoints);
    // getMoreEcoBlocks(1);
    splashScreen();
    var index = 1;

    $("#nextquestions").click({
        index: index
    }, getMoreEcoBlocks);

    // custom footer controller
    $('#footernav a').click(function(e) {
        e.preventDefault();

        $("#tabcontrolled .tab-pane").hide();

        $("" + $(this).attr("href")).show();
    });
});
