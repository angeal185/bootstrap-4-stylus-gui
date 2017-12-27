
var version = "1.0.0";
var appUrl = "https://github.com/angeal185/bootstrap-stylus-gui";

var importTpl = '<form action="/updateImports" method="post"><div class="form-group"><textarea class="form-control" name="imports" id="imports"></textarea></div><button type="submit" class="btn btn-primary right">Update</button></form>';


document.getElementById('scroll-to-top').onclick = function () {
    scrollTo(document.body, 0, 100);
}

function scrollTo(element, to, duration) {
	if (duration < 0) return;
	var difference = to - element.scrollTop;
	var perTick = difference / duration * 2;

	setTimeout(function() {
		element.scrollTop = element.scrollTop + perTick;
		scrollTo(element, to, duration - 2);
	}, 10);
}


function heading(i,e){
	$(i).prepend('<h3 class="mt-20 w-100">'+e+'</h3>')
}
function taskInit(){ 
	$("#main").empty();
	heading("#main","Tasks");
	$("#main").append("<div id='tasks' class='row'></div>");
  $.getJSON("data/tasks.json", function(data){
		$.each(data, function(index, value){
			//console.log(value);
			$("#tasks").append('<div class="col-sm-6"><div class="card"><div class="card-body"><form action="/'+value.id+'" method="post"><h4 class="card-title">'+value.name+'</h4><p class="card-text">'+value.description+'</p><button type="submit" class="btn btn-primary">Start Task</button></form></div></div></div>');
		});
	});
  }

taskInit();


function formatBytes(a,b){
	if(0==a)return"0 Bytes";
	var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],
	f=Math.floor(Math.log(a)/Math.log(c));
	return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]
}

function addcard(i,e){
	$("#status").append('<div class="card col-sm-6 col-md-3"><div class="card-body"><h4 class="card-title">'+i+'</h4><h6 class="card-text mb-2 text-muted">'+e+'</h6></div></div>');
}

$( "#lnk-Tasks" ).click(function() {
  taskInit()  
});

$( "#lnk-Imports" ).click(function() {
  $("#main").empty().append(importTpl);
  heading("#main","Includes");
  $.getJSON("data/includes.json", function(result){
		//console.log(JSON.stringify(result));
		
		$.each(result, function(index, value){
			//console.log(value);
			$("#imports").append("@import " + JSON.stringify(value) + "\n");
		});
	});
});

$( "#lnk-Options" ).click(function() {
	
  $.getJSON("data/options.json", function(result){
	  var optionsTpl='<form action="/updateOps" id="updateOpsLnk" method="post"><textarea id="outData2" name="outData2" type="text" class="form-control" readonly hidden></textarea></form><form action="/updateDefaultOps" id="updateDefaultOpsLnk" method="post"><textarea id="outData3" name="outData3" type="text" class="form-control" readonly hidden></textarea></form><div class="container"><div id="optionsData" class="row"></div><textarea id="outData" type="text" class="form-control" readonly></textarea><button type="submit" id="outUpdate" class="btn btn-outline-primary btn-block right">Update</button><div class="row"><div class="col-sm-6"><button type="button" id="ud1" onclick="document.getElementById(\'updateOpsLnk\').submit()" class="btn btn-outline-secondary btn-block" disabled>Commit</button></div><div class="col-sm-6"><button type="button" id="ud2" onclick="document.getElementById(\'updateDefaultOpsLnk\').submit()" class="btn btn-outline-secondary btn-block" disabled>Commit to default</button></div></div></div>';
	  
	  $("#main").empty().append(optionsTpl);
		heading("#main","Options");
		$.each(result, function(index, value){
			
			$('#optionsData').append('<div class="form-group col-sm-6"><label>'+index+'</label><div><input type="text" name="'+index+'" class="form-control" value="'+value+'" ></div></div>');
		});
		
		$('#outUpdate').click(function() {
			$('#outData,#outData2,#outData3').empty();
			$('#ud1,#ud2').removeAttr('disabled');
			$.each($("input"), function(){
				let i = this.name;
				let e = $( this ).val();
				let out = '"'+i+'":"'+e+'",';
				$( "#outData,#outData2,#outData3" ).append(out);
			});
			var out02 = $( "#outData,#outData2,#outData3" ).html();
		$('#outData,#outData2,#outData3').html(out02.slice(0,-1)).prepend('{').append('}');
		
		});
	});
	
});


$( "#lnk-Version" ).click(function() {

	$("#main").empty().append('<div class="alert alert-info" role="alert">Requires active internet connection</div>');
	
	$.getJSON("//raw.githubusercontent.com/angeal185/js-scripts/master/json/bootstrap-stylus-gui.json", function(result){
		
		var versionTpl = '<div class="row mt-20 mb-20"><div class="card col-md-6"><div id="version" class="card-body"><h3>Latest release:<span class="green">'+result.latest+'</span></h3></div></div><div class="card col-md-6"><div class="card-body"><h3>Your release: <span id="versionCol" class="green">'+version+'</span></h3></div></div></div>'
		
		$("#main").empty().append(versionTpl);
		heading("#main","Version");
		console.log("Latest release:" + result.latest);
		console.log("Your release:" + version);
		if (result.latest === version) {
			console.log("up-to-date");
			$('#main').append('<div class="alert alert-success" role="alert">up-to-date</div>');
		} else {
			console.log("new-update-available at: "+appUrl);
			$('#versionCol').css('color','red');
			$('#version').append('<div class="alert alert-danger" role="alert">new-update-available at: <a href ="'+appUrl+'" target="_blank">'+appUrl+'</a></div>');
		}
		
		
		
	});

	
});

$( "#lnk-Config" ).click(function() {

	$("#main").empty().append('<div class="row" id="config"></div><div class="row" id="status"></div>');
	heading("#main","Config");
	heading("#status","System Status");
	
	$.getJSON("/config", function(data){
		console.log(JSON.stringify(data));
		
		var confDataTpl = '<div class="col-sm-12"><form action="/updateConfig" method="post"><textarea id="confData" name="confData" type="text" class="form-control h-200" readonly></textarea><div class="row"><div class="col-sm-12 col-md-6"><button type="button" id="confUpdate" class="btn btn-outline-primary btn-block">Update</button></div><div class="col-sm-12 col-md-6"><button type="submit" id="confCommit" class="btn btn-outline-primary btn-block" disabled>Commit</button></div></div></div>'
		
		
		$.each(data, function(index, value){
			$("#config").append('<div class="form-group col-md-6" col-sm-12"><label for="'+index+'">'+index+'</label><input class="form-control" name="'+index+'" value="'+value+'"></div>')
		});
		
		
		$("#config").append(confDataTpl);
		
		$( "#confUpdate" ).click(function() {
			$("#confData").empty();
			$.each($("input"), function(){
				let i = this.name;
				let e = $( this ).val();
				let out = '"'+i+'":"'+e+'",';
				$( "#confData" ).append(out);
			});
			var out02 = $( "#confData" ).html();
		$('#confData').html(out02.slice(0,-1)).prepend('{').append('}');
		$('#confCommit').removeAttr('disabled');
		});
	  
	});
	$.getJSON("/status", function(data){
		
		
			//console.log(data.platform);
		
		addcard("Platform",data.platform);
		addcard("Architecture",data.arch);
		addcard("Nodejs","v"+data.nodev.node);
		addcard("Uptime",data.uptime+"s");
		addcard("CWD",data.cwd);
		addcard("totalmem",formatBytes(data.totalmem,3));
		addcard("freemem",formatBytes(data.freemem,3));
		addcard("nodemem",formatBytes(data.nodemem,3));
		addcard("hostname",data.hostname);
		addcard("cpuUsage:user",formatBytes(data.cpuUsage.user,3));
		addcard("cpuUsage:system",formatBytes(data.cpuUsage.system,3));
	 
	});

	
});