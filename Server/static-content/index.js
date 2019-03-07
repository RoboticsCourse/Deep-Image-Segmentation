function getRecent(){
        $.ajax({
                method: "GET",
                url: "/getInfo/"
        }).done(function(data){
                var filename = data.filename;
                $("#date").html(filename);
		$("#sensors").html(data.data);
        	$("#img").attr("src","images/" + filename + ".jpg");
	});
}

$(function(){
	getRecent();
	setInterval(function(){
                getRecent();
        },1000);
});
