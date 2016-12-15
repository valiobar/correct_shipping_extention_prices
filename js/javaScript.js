/**
 * Created by Lozenec on 13.12.2016 г..
 */

var  prevZone;

function openCity(evt, cityName) {
   $('.'+prevZone).removeClass("active");
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
    }
    document.getElementById(cityName).style.display = "block";
     $('.'+cityName ).addClass("active");
    prevZone=cityName;
    evt.currentTarget.className += " w3-red";

}

$('document').ready(function() {
$("#button-wrapper input").click(function(){

    var shipping = this.getAttribute("title");
$.ajax({
    url:"shipping_prices.php",
    type:"GET",
    data:{shipping : shipping},
    success:function(data){

      appendToTable(data);

    },
    dataType:"json"
});

});





});

function save() {
    var geoZone= $('.active').attr('class').split(" ")[0];
   var method = geoZone.split("-")[1];
    var geoZoneNum = geoZone.split("-")[2];
    var result="";
    var isFirst= true;
    $('.active tr.weight-price ').each(function () {
     if(!isFirst){
         result+=",";
     }
     isFirst=false;
       var weight= $(this).children('.weightCell').text();
        var price =  $(this).children('.priceCell').text();
        result+=weight+":"+price;
    })
    $.ajax({
        url:"shipping_prices.php",
        type:"GET",
        data:{method : method,geoZone:geoZoneNum,updated:result},
        success:function(data){
  console.log(data);
        }

    });


}

function tab(zone) {
var tab='<a href="javascript:void(0)" class="tablink" onclick="openCity(event, \''+zone+'\')">'+zone+'</a>'
return tab;
}
function tableDiv(zone) {
var div='<div id="'+zone+'" class="w3-container city">'+
        '<h2>Zone-'+zone.substr(zone.length - 1)+'</h2>'+
       '<div class="tableContainer">'+
        '<table class="'+zone+'">'+
            '<tr>'+
            '<th >Weight</th>'+
            '<th >Price</th>'+
            '</tr>'+
       '</table>'+
        '</div>'+
        '</div>';

return div;
}

function showControlButtons() {
    var buttonDiv =
        '<div id="control">'+
        '<button class="btn-danger btn-lg decrease" onclick="decreasPrices()">-</button>'+
        '<label for="porsents"><h4>Enter %</h4></label>'+'<input id="procentValue" style="margin-right: 20px" type="text" name="porsents" >'+
        '<button class="btn-success btn-lg increase" style="margin-right: 20px" onclick="increasPrices()">+</button>'+
        '<button class="btn-primary btn-lg increase" onclick="save()">Save</button>'+
        '</div>';
    $('#container').append(buttonDiv);
}
function decreasPrices() {
   if(!($('#procentValue').val())){
       alert("Enter procents");
return;
    }
    var procent = $('#procentValue').val();
    $('#procentValue').val(null);
    if(procent<0||procent>100){
        alert("ERROR:Enter correct percents");
        return;
    }
    $('.active th.priceCell').each(function () {
        var priceValue =$( this ).text();
            var newPrice = priceValue - (priceValue * (procent / 100));
        if(newPrice>=0) {
            newPrice=newPrice.toString();
            if(newPrice.length>=newPrice.indexOf('.')+3){
            var end= newPrice.indexOf('.')+3;
            newPrice = newPrice.slice(0,end);}
            $(this).text(newPrice);
        }else{
            alert("Error:The Price can not be lass than 0")
        }
        console.log(priceValue+"-"+procent);
    });


}

function increasPrices() {
    if(!($('#procentValue').val())){
        alert("Enter procents");
        return;
    }
    var porcent = parseFloat($('#procentValue').val());
    $('#procentValue').val(null);
    if(porcent<0){
        alert("ERROR:Enter correct percents");
        return;
    }

    $('.active th.priceCell').each(function () {
        console.log(porcent);
        var priceValue =parseFloat($( this ).text());
        var newPrice = priceValue + (priceValue * (porcent / 100));
        newPrice=newPrice.toString();
        if(newPrice.length>=newPrice.indexOf('.')+3) {
            var end = newPrice.indexOf('.') + 3;
            newPrice = newPrice.slice(0, end);
        }
            $(this).text(newPrice);
        console.log(priceValue+"-"+porcent+"-"+newPrice);
    });
}




function appendToTable(data) {
    $('.w3-card-2').empty();
    $("#container").empty();
    jQuery.each(data, function(i, val) {
$('.w3-card-2').append(tab(i));
        $("#container").append(tableDiv(i));
        jQuery.each(val,function (j,l) {
    var weight = l.split(':')[0];
      var price = l.split(':')[1] ;
      var tableRow = '<tr class="weight-price">'+
          '<th class="weightCell">'+weight+'</th>'+
          '<th class="priceCell">'+price+'</th>'+
          '</tr>';
        $('.'+i).append(tableRow);


     });

    });
    showControlButtons();

}

