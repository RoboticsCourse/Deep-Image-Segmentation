function getRecent() {
        $.ajax({
                method: "GET",
                url: "/getInfo/"
        }).done(function (data) {
                $("#sensors").html(data.data);
        });
}

function getFSInfo(x, y) {
        if (x = 0 || y == 0) {
                return "Stopped";
        }
        else if (x < 0 && x >= -255) {
                if (y > 0 && y <= 105) {
                        return "Top Right";
                }
                else {
                        return "Bottom Right"
                }
        }
        else {
                if (y > 0 && y <= 105) {
                        return "Top Left";
                }
                else {
                        return "Bottom Left";
                }
        }
}

function getPairInfo() {
        //<div class="card"><h2>Card</h2></div>
        $.ajax({
                method: "GET",
                url: "/getPairs/"
        }).done(function (data) {
                var cards = "";
                var pairs = data.success;
                for (var i = 0; i < pairs.length; i++) {
                        cards += "</br></br><div class='card'><img id='img' " + "src='images/" + pairs[i]["Image Time"] + ".jpg' " + "height='500' width='350'></br><p>Image Time:" + pairs[i]["Image Time"] + " </br> Data Time: " + pairs[i]["Data Time"] + " </br>  Direction/Location: " + getFSInfo(pairs[i]["Forward"], pairs[i]["Speed"]) + " </br>  Forward: " + pairs[i]["Forward"] + " </br> Speed: " + pairs[i]["Speed"] + " </br> Sensor 1: " + pairs[i]["Sensor1"] + " </br> Sensor 2: " + pairs[i]["Sensor2"] + " </br> State: " + pairs[i]["State"] + " </br></p></div>"
                }
                console.log(data)
                $("#gallery").html(cards);
        });
}

$(function () {
        getRecent();
        //var galleryInterval;
        var testingInterval;
        $("#pics").on('click', function () {
                clearInterval(testingInterval);
                /*galleryInterval = setInterval(function(){
                        getPairInfo();
                },10000);*/
                $("#test").hide();
                $("#gallery").show();
                getPairInfo();
        });
        $("#testing").on('click', function () {
                //clearInterval(galleryInterval);
                testingInterval = setInterval(function () {
                        getRecent();
                }, 1000);
                $("#test").show();
                $("#gallery").hide();
        });
        $('#testing').click()
});
