/*  A. Start with question only
    B. Click on question then show buttons
    C. Click on buttons, hide questions and buttons, show ad and motivation 
  */
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

        console.log("clicked, yo. isOpen" + hasOpenQ +
            " isInit" + hasInitQ);

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

            updateGraph();
        }
    );

    /*   // If you click yes or no, then show the motivation
  $(".buttony button").click(
  function() {
      $(this).parents(".question").find(".qtext").slideUp();
    
    $(this).parents(".question").find(".qinfo").slideUp();
  
    
    $(this).parent().slideUp();
              $(this).parents(".question").find(".motivation").slideDown(); 
  Todo: do something different for yes and no
      $(this).hasC
    
  }
  );
  
  $(".buttony").click(
  function() {
              $(this).parents(".question").find(".motivation").slideDown();
  }
  ); */

    $(".ad").hide();

    // TEST for loading next questions
    // $(".far-rightpill").on("click", function
    var nextQuestions = $("#nextquestions");
    console.log("nextQuestions value is: " + nextQuestions);
    nextQuestions.click(function(){
        console.log("nextQuestions was clicked");
        // TODO: increment counter to get next round of questions. Delete previous questions, and notify user if no more questions are left.
        getMoreEcoBlocks(2);
    });

} // end initiate behavior

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
        "content": "q1.content",
        "info": "q2.info",
        "btns": ["yes", "no"],
        "motivation": "m1"
    }, {
        "type": "question",
        "content": "q2.content",
        "info": "q2.info",
        "btns": ["yes", "no"],

        "motivation": "m2"
    }, {
        "type": "twitter",
        "content": "ttr1.content",
        "info": "ttr2.info",
        "btns": ["yes", "no"],
        "motivation": "ttrm1"
    }, {
        "type": "question",
        "content": "q3.content",
        "info": "q3.info",
        "btns": ["yes", "no"],
        "motivation": "m3"
    }]
};

window.ecometrix.resources = {
    "btn": {
        "btnYes": "<button  type=\"button\" class=\"btn btn-success yesB the-icons clearfix\"><i class=\"icon-ok\"></i></button>",
        "btnNo": "<button  type=\"button\" class=\"noB btn btn-danger\"><i class=\"icon-remove\"></i></button>"
    }
};


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



            if (argFrame.btns[i] == 'yes') {
                btn = $(window.ecometrix.resources.btn.btnYes);
                bbox.addClass('buttons buttony');
            }

            if (argFrame.btns[i] == 'no') {
                btn = $(window.ecometrix.resources.btn.btnNo);
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

function getMoreEcoBlocks(index) {
    console.log("getting ecoblocks at index: " + index);
    $.ajax({
        // TODO: Enable Cross-Origin-Resource-Sharing (CORS)
        // url: "http://yourecometrix.co:3002/posts/" + index, // on server
        url: "http://localhost:3002/posts/" + index, // local
        cache: false
    })
        .done(function(json) {
            window.ecometrix.questions = json;
            ecoRender();
            initiateBehavior();
            updateGraph();
            splashScreen();
        });
    // do nothing if this fails
}

function updateScore(argID, newValue, label) {

    var scoreValue = Math.round(newValue);
    var domScore = jQuery('#' + argID);
    domScore.html(label + ' ' + scoreValue);
    domScore.css('width', limitPct(scoreValue) + '%');

}

function limitPct(argPct) {
    var limitThis = argPct;

    // lower limit %
    if (limitThis <= 10) {
        limitThis = 13;
    }

    // upper limit %
    if (limitThis >= 99) {
        limitThis = 93;
    }

    return limitThis;
}

function numQuestions() {

    return jQuery("#ecoblocks div.question").length;

}

function completedQuestions() {

    return jQuery("#ecoblocks div.motivation").filter(":visible").length;

}


function updateGraph() {

    var completedQ = (completedQuestions() / (numQuestions())) * 100;
    updateScore('qscore',
        completedQ,
        'Questions');
}

function splashScreen() {
    $("#score").hide();
    $("#questions").hide();
    $("#splash").show();
    $("#gift").hide();
    $(".ad").hide();

    $("#splash").fadeOut(2000, function() {
        $("#questions").fadeIn("slow");
    });
}

/*
 *  Render data, attach behavior
 */
updateScore('ecoscore', 30, 'ecoScore');
console.log("questions to be rendered: " + window.ecometrix.questions);

ecoRender();
initiateBehavior();
updateGraph();
getMoreEcoBlocks(1);
splashScreen();

// custom footer controller
$('#footernav a').click(function(e) {
    e.preventDefault();

    $("#tabcontrolled .tab-pane").hide();

    $("" + $(this).attr("href")).show();
});
