function getRecent() {
        $.ajax({
                method: "GET",
                url: "/getInfo/"
        }).done(function (data) {
                $("#sensors").html(data.data);
        });
}

function getFSInfo(fw, sp) {
        radius = 15
        if (Math.pow(fw, 2) + Math.pow(sp, 2) <= Math.pow(radius, 2)) {
                return "Bucket 4: Stopped";
        }

        bin1Size = parseInt((255 * 2 + 1) / 3);
        bin1Num = parseInt((fw + 254) / bin1Size);

        bin2Size = parseInt((150 * 2 + 1) / 3);
        bin2Num = parseInt((sp + 149) / bin2Size);

        binNum = bin1Num + 3 * bin2Num;
        if (binNum == 3) {
                if (sp > 0) {
                        return "Bucket 6: Forward Left";
                }
                return "Bucket 0: Backward Left";
        }
        else if (binNum == 4) {
                if (sp > 0) {
                        return "Bucket 3: Slightly Forward";
                }
                return "Bucket 5: Slightly Backward";
        }
        else if (binNum == 5) {
                if (sp > 0) {
                        return "Bucket 8: Forward Right";
                }
                return "Bucket 2: Backward Right";
        }
        else {
                return "Bucket 7: Forward";
        }
}

function getPairInfo() {
        $.ajax({
                method: "GET",
                url: "/getPairs/"
        }).done(function (data) {
                var cards = "";
                var pairs = data.success;
                for (var i = 0; i < pairs.length; i++) {
                        cards += "</br></br><div class='card'><img id='img' " + "src='images/" + pairs[i]["Image Time"] + ".jpg' " + "height='500' width='350'></br><p>Image Time:" + pairs[i]["Image Time"] + " </br> Data Time: " + pairs[i]["Data Time"] + " </br>  Direction/Location: " + getFSInfo(pairs[i]["Forward"], pairs[i]["Speed"]) + " </br>  Forward: " + pairs[i]["Forward"] + " </br> Speed: " + pairs[i]["Speed"] + " </br> Sensor 1: " + pairs[i]["Sensor1"] + " </br> Sensor 2: " + pairs[i]["Sensor2"] + " </br> State: " + pairs[i]["State"] + " </br></p></div>"
                }
                //$("#gallery").html(cards);
        });
}

function getJSON() {
        $.ajax({
                method: "GET",
                url: "/getJSON/"
        }).done(function (data) {
                var link = document.createElement("a");
                link.download = data.filename;
                link.href = data.path;
                link.click();
        });
}

function getDB() {
        $.ajax({
                method: "GET",
                url: "/getDB/"
        }).done(function (data) {
                var link = document.createElement("a");
                link.download = data.filename;
                link.href = data.path;
                link.click();
        });
}

function getModel() {
        $.ajax({
                method: "GET",
                url: "/getModel/"
        }).done(function (data) {
                var link = document.createElement("a");
                link.download = data.filename;
                link.href = data.path;
                link.click();
        });
}

function getFiles() {
        $.ajax({
                method: "GET",
                url: "/getFiles/"
        }).done(function (data) {
                var link = document.createElement("a");
                link.download = data.filename;
                link.href = data.path;
                link.click();
        });
}

function clearDB() {
        clearData()
        clearImages()
        clearPairs()
}

function clearData() {
        $.ajax({
                method: "GET",
                url: "/clearDBData/"
        }).done(function (data) {
                console.log(data.success);
        });
}

function clearImages() {
        $.ajax({
                method: "GET",
                url: "/clearDBImgs/"
        }).done(function (data) {
                console.log(data.success);
        });
}

function clearPairs() {
        $.ajax({
                method: "GET",
                url: "/clearDBPair/"
        }).done(function (data) {
                console.log(data.success);
        });
}

function confirmation(){
        let val = document.getElementById("confirm").value;
        document.getElementById("confirm").value = "";
        if (val == "Confirmed"){
                return true;
        }
        console.log("Enter 'Confirmed' to press button");
        return false;
}

$(function () {
        getRecent();
        var testingInterval;
        $("#pics").on('click', function () {
                clearInterval(testingInterval);
                $("#img").show();
                $("#test").hide();
                getPairInfo();
        });
        $("#testing").on('click', function () {
                testingInterval = setInterval(function () {
                        getRecent();
                }, 1000);
                $("#test").show();
                $("#img").hide();
        });
        $('#testing').click()

        $("#JSON").on('click', () => getJSON());
        $("#db").on('click', () => getDB());
        $("#files").on('click', () => getFiles());
        $("#model").on('click', () => getModel());

        $("#clear-db").on('click', function () {
                if (confirmation()){
                        clearDB()
                }
        });
        $("#clear-data").on('click', function () {
                if (confirmation()){
                        clearData()
                }
        });
        $("#clear-img").on('click', function () {
                if (confirmation()){
                        clearImages()
                }
        });
        $("#clear-pairs").on('click', function () {
                if (confirmation()){
                        clearPairs()
                }
        });
});
