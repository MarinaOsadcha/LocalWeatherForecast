$(document).ready(function() {    //JQuery start
     
	var weekDayArr = [];            //arr for week days
	var weekDateArr = [];           //arr for week date
	var weekHumidityArr = [];       //arr for week humidity
	var weekCloudCoverArr = [];     //arr for week cloudCover
	var weekWindSpeedArr = [];      //arr for week windSpeed
	var weekTemperatureMaxArr = []; //arr for week temp max
	var weekTemperatureMinArr = []; //arr for week temp min
	var weekSummaryArr = [];        //arr for week summary
	
	var currentTemperatureMain;
	var currentCloudCover;
	var currentSummary;
	var currentIcon;
	var icons;
	var weekIconArr = [];

   
   //calendar
   var date = new Date();
   var dayNumber = date.getDay();    //getting current day number 0-6
   var day = date.toLocaleDateString();    // getting current day, month, year
   day = day.replace('г.', '');    //replace г.
   
   var weekDays = {   
	   0: 'воскресенье',
	   1: 'понедельник',
	   2: 'вторник',
	   3: 'среда',
	   4: 'четверг',
	   5: 'пятница',
	   6: 'суббота'
   };
   
  $(".currentDay").append(weekDays[dayNumber]);   //current day
  $(".currentDate").html(day);    //current date
     
  for (var i = 0; i <= 7; i++) {    //insert week days
	  date = new Date();
	  date.setDate(date.getDate() + i);
	  date = date.toLocaleDateString().replace('г.', '');
	  
	  $(".currentDay" + i).html(weekDays[dayNumber]);    //week day
	  weekDayArr.push(weekDays[dayNumber]);    //adding current day to arr;
	  	  
	  if (dayNumber !== 6) {
		  dayNumber += 1;
	  } else {
		  dayNumber = 0;
	  }
	  
	  $(".currentDate" + i).html(date);  //week date
	  weekDateArr.push(date);    //adding current date to arr
	}

	//-------------------------------------------------------	   
   //ajax reguest
  
  if (navigator.geolocation) {    //geolocation checking if working
		navigator.geolocation.getCurrentPosition(weather);
	} else {
		alert("Sorry, geolocation isn't supported!");
	}
   
   function weather(position) {    //geolocation
     var lat = position.coords.latitude;  //getting coorginates
	 var lon = position.coords.longitude;
	 
	 var url = "https://api.darksky.net/forecast/cf8fe2973a4fcd29c941731459acef8d/";
     var api_call = url + lat + "," + lon;
   
	$.ajax({
           type: 'GET',
           url: api_call,
           processData: true,
           data: {},
           dataType: 'jsonp',
		   contentType: 'application/x-www-form-urlencoded',
		   		   
           success: function (data) {  //getting needed data
			
			var currentTemperature = (data.currently.temperature - 32)/1.8;
			if (currentTemperature > 0) {
				currentTemperatureMain = "&plus;" + Math.round(currentTemperature) + " &deg;" + "C";
				$(".currentTemperature").html(currentTemperatureMain);
			}
			else {
				currentTemperatureMain = Math.round(currentTemperature) + " &deg;" + "C";
				$(".currentTemperature").html(currentTemperatureMain);
			}
			
			currentCloudCover = (data.currently.cloudCover*100);
			$(".cloudCover").html(Math.round(currentCloudCover) + " %");
			
			for (var i = 0; i <=7; i++) {
			  var temperatureMin = (data.daily.data[i].temperatureMin - 32)/1.8;
			  if (temperatureMin > 0) {
				$(".temperatureMin" + i).html("мин. " + "&plus;" + Math.round(temperatureMin) + " &deg;");
				weekTemperatureMinArr.push("мин. " + "&plus;" + Math.round(temperatureMin) + " &deg;");
			  } else {
				$(".temperatureMin" + i).html("мин. " + Math.round(temperatureMin) + " &deg;");
				weekTemperatureMinArr.push("мин. " + Math.round(temperatureMin) + " &deg;");
			  }
			  
			  var temperatureMax = (data.daily.data[i].temperatureMax - 32)/1.8;
			  if (temperatureMax > 0) {
				$(".temperatureMax" + i).html("мax. " + "&plus;" + Math.round(temperatureMax) + " &deg;");
			    weekTemperatureMaxArr.push("&plus;" + Math.round(temperatureMax) + " &deg;");
			  } else {
				$(".temperatureMax" + i).html("мax. " + Math.round(temperatureMax) + " &deg;");
			    weekTemperatureMaxArr.push(Math.round(temperatureMax) + " &deg;");  
			  }
			  
			  var humidity = (data.daily.data[i].humidity*100);
			  $(".humidity" + i).html(Math.round(humidity) + " %");
			  weekHumidityArr.push(Math.round(humidity) + " %");
			  
			  var cloudCover = (data.daily.data[i].cloudCover*100);
			  $(".cloudCover" + i).html(Math.round(cloudCover) + " %");
			  weekCloudCoverArr.push(Math.round(cloudCover) + " %");
			  
			  var windSpeed = (data.daily.data[i].windSpeed*1.609);
			  $(".windSpeed" + i).html(Math.round(windSpeed) + " км/ч");
			  weekWindSpeedArr.push(Math.round(windSpeed) + " км/ч");
			  
			}
			
			//---------------------------------------------------------
			//summary
			var summaryList = {
			  'clear-day': 'ясный день', 
              'clear-night': 'ясная ночь', 
              'partly-cloudy-day': 'переменная облачность',
              'partly-cloudy-night': 'переменная облачность', 
              'cloudy': 'облачно', 
              'rain': 'дождь', 
              'sleet': 'дождь со снегом',                        
              'snow': 'снег', 
              'wind': 'ветер', 
              'fog': 'туман'				
			};
			
			var summary = (data.currently.icon);
			currentlyIcon = summary;
			
			currentSummary = summaryList[summary];
			$(".summary").html(summaryList[summary]);  //current summary
						
			for (i = 0; i <=7; i++) {
				var summary = (data.daily.data[i].icon);
				weekSummaryArr.push(summaryList[summary]);
				weekIconArr.push(summary);
			}
			
			//---------------------------------------------------------
			//icons
			 
			icons = new Skycons({"color":"#fa5b3c"});
			list  = [
			  "clear-day", 
              "clear-night", 
              "partly-cloudy-day",
              "partly-cloudy-night", 
              "cloudy", 
              "rain", 
              "sleet",                        
              "snow", 
              "wind", 
              "fog"];
    
			for (i = 0; i <= list.length; i++) {    //current icon
			  if (data.currently.icon == list[i]) {
				icons.set('icon', list[i]);
				icons.play();
			  }}
			  
			for (i = 0; i <= list.length; i++) {    //week icons
				for (var j = 0; j <= 7; j++) {
					if (data.daily.data[j].icon == list[i]) {
						icons.set(('icon' + j), list[i]);
						icons.play();
					}
				}
			 }
			 //alert(data.daily.data[0].icon);
			
	  }
	});    //ajax closed
	
	//----------------------------------------------	
	GoogleMaps(lat, lon);  //getting city, country
		
		function GoogleMaps(latitude, longitude) {    
		  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
			latitude +
			"," +
			longitude +
			"&key=AIzaSyDoPTELoMsu1SNUMK_evwhrPfi7mmKyFyU&result_type=locality|country", function(json) {
			  var address_comp = json.results[0].address_components;
			  var city = "";
              var state = "";
			
			  address_comp.forEach(function(loc) {
				var type = loc.types;
				if (type.indexOf("locality") != -1) {
				  city = loc.long_name;
				} else if (type.indexOf("country") != -1) {
				  state = loc.long_name;
				}
			  });
			  var address = city + ", " + state;
              $("#city").html(address);
		  });
       }
	}
	
	//-----------------------------------------------------
	//click function
	  var x;
	  for (var i = 0; i <= 7; i++) {
		  
		  $('.current'+ i).click(function(){
			for (var j = 0; j <= 7; j++) {
				$('.current' + j).css('background-color','rgb(250,250,250)');    //return prior background after second click
			}
			
			$(this).css('background-color', '#fff');

			x = $(this).attr("class"); //getting current-x div  
			var y = x[7];    //getting current number of clicked current div
			//alert(x);
			
			$('.currentDay').html(weekDayArr[y]);
			$('.currentDate').html(weekDateArr[y]);
			$('.humidity0').html(weekHumidityArr[y]);
			$('.windSpeed0').html(weekWindSpeedArr[y]);
			$('.temperatureMax0').html('мах. ' + weekTemperatureMaxArr[y]);
			$('.temperatureMin0').html(weekTemperatureMinArr[y]);
						
			if (y != 0) {
				$('.currentTemperature').html(weekTemperatureMaxArr[y] + 'C');
				$('.summary').html(weekSummaryArr[y]);
				$('.cloudCover').html(weekCloudCoverArr[y]);
				icons.set('icon', weekIconArr[y]);
			} else { 
				$('.currentTemperature').html(currentTemperatureMain);
				$('.summary').html(currentSummary);
				$('.cloudCover').html(Math.round(currentCloudCover) + ' %');
				icons.set('icon', currentlyIcon);
			}
			
			
		});
	}

});