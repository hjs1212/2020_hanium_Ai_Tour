/*가맹점 지도*/
$(".dg-map svg").mouseover(function(event) {
    var _path = event.target;
    var city_name = _path.id;
    var new_p = document.createElement('p');
    var province = $(_path).parent()[0].id;
    d3.select(_path).style("fill", "#cbc3ac");
    //console.log(city_name);
}).mouseout(function(event) {
    var _path = event.target;
    d3.select(_path).style("fill", "#fff");
});

function go_branch(city_do) {
    var Arr = Array("sejong","chungnam","jeju","gyeongnam","gyeongbuk","jeonbuk","chungbuk","gangwon","gyeonggi","jeonnam","ulsan","busan","daegu","daejeon","incheon","seoul","gwangju");
    var strArr = Array("세종특별자치시","충청남도","제주특별자치도","경상남도","경상북도","전라북도","충청북도","강원도","경기도","전라남도","울산광역시","부산광역시","대구광역시","대전광역시","인천광역시","서울특별시","광주광역시");
    //alert(city_do);
    var idx = Arr.indexOf(city_do);
    //alert(strArr[idx]);
    location.href="./branches.php?stx="+strArr[idx];
}

/*가맹점 지도 색칠*/
$(document).ready(function(){
    var mapCondition = '<?=$stx?>';
    if (mapCondition == '세종특별자치시') {
        $('#sejong').css("fill", "#cbc3ac");
    }else if (mapCondition == '충청남도') {
        $('#chungnam').css("fill", "#cbc3ac");
    }else if (mapCondition =='제주특별자치도') {
        $('#jeju').css("fill", "#cbc3ac");
    }else if (mapCondition =='경상남도') {
        $('#gyeongnam').css("fill", "#cbc3ac");
    }else if (mapCondition == '경상북도') {
        $('#gyeongbuk').css("fill", "#cbc3ac");
    }else if (mapCondition =='전라북도') {
        $('#jeonbuk').css("fill", "#cbc3ac");
    }else if (mapCondition =='충청북도') {
        $('#chungbuk').css("fill", "#cbc3ac");
    }else if (mapCondition =='경기도') {
        $('#gyeonggi').css("fill", "#cbc3ac");
    }else if (mapCondition == '전라남도') {
        $('#jeonnam').css("fill", "#cbc3ac");
    }else if (mapCondition =='울산광역시') {
        $('#ulsan').css("fill", "#cbc3ac");
    }else if (mapCondition =='부산광역시') {
        $('#busan').css("fill", "#cbc3ac");
    }else if (mapCondition == '대구광역시') {
        $('#daegu').css("fill", "#cbc3ac");
    }else if (mapCondition =='대전광역시') {
        $('#daejeon').css("fill", "#cbc3ac");
    }else if (mapCondition =='인천광역시') {
        $('#incheon').css("fill", "#cbc3ac");
    }else if (mapCondition =='서울특별시') {
        $('#seoul').css("fill", "#cbc3ac");
    }else if (mapCondition =='광주광역시') {
        $('#gwangju').css("fill", "#cbc3ac");
    }
})