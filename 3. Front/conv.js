var express = require('express')
var app = express()
var mysql = require('mysql')
var qs = require('querystring');
var fs = require('fs');
var connection = mysql.createConnection({
    host     : 'tour-db2.mysql.database.azure.com',    // 호스트 주소
    user     : 'HF266@tour-db2',           // mysql user
    password : 'qhghgkrrhk15!',       // mysql password
    database : 'tour',
    port: 3306, 
    ssl:{ca:fs.readFileSync('crt.pem')}         // mysql 데이터베이스
});
connection.connect();
app.use(express.static('data'));
const port = 3000;
//route , routing
app.get('/', function(request, response) { 
    return response.send('/');
}); 

app.get('/place/:cid', function(request, response) { 
    var cid = request.params.cid;
    connection.query('SELECT * FROM Content WHERE idx='+cid, 
    //sql 쿼리문
            function (error, results, fields) {
            if (error) {
                console.log(error)
            }
            _results = results;
            console.log(results);
            var x = results[0].mapy;
            var y = results[0].mapx;
            console.log(y);
            var template = `
                <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>유사 관광지 안내 서비스 웹 애플리케이션</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            
            <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,600,700&display=swap" rel="stylesheet">
        
            <link rel="stylesheet" href="/css/open-iconic-bootstrap.min.css">
            <link rel="stylesheet" href="/css/animate.css">
            
            <link rel="stylesheet" href="/css/owl.carousel.min.css">
            <link rel="stylesheet" href="/css/owl.theme.default.min.css">
            <link rel="stylesheet" href="/css/magnific-popup.css">
        
            <link rel="stylesheet" href="/css/aos.css">
        
            <link rel="stylesheet" href="/css/ionicons.min.css">
        
            <link rel="stylesheet" href="/css/bootstrap-datepicker.css">
            <link rel="stylesheet" href="/css/jquery.timepicker.css">
        
            
            <link rel="stylesheet" href="/css/flaticon.css">
            <link rel="stylesheet" href="/css/icomoon.css">
            <link rel="stylesheet" href="/css/styledetail.css">

            <link rel="stylesheet" href="/css/DocentService.css">

            <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
            <script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx7a37c0b7e6384cdf9df459d620f7f8c3"></script>
            <script type="text/javascript">

                var map, marker;
                var markerArr = [];
                function initTmap(){
                    // 1. 지도 띄우기
                    map = new Tmapv2.Map("map_div", {
                        center: new Tmapv2.LatLng(${x}, ${y}),
                        width : "100%",
                        height : "400px",
                        zoom : 15,
                        zoomControl : true,
                        scrollwheel : true
                        
                    });
                    
                    // 2. POI 통합 검색 API 요청
                    $("#btn_select").click(function(){
                        
                        var searchKeyword = $('#searchKeyword').val();
                        $.ajax({
                            method:"GET",
                            url:"https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
                            async:false,
                            data:{
                                "appKey" : "l7xx7a37c0b7e6384cdf9df459d620f7f8c3",
                                "searchKeyword" : searchKeyword,
                                "centerLat" : "${x}",
                                "centerLon" : "${y}",
                                "resCoordType" : "EPSG3857",
                                "reqCoordType" : "WGS84GEO",
                                "radius" : "3",
                                "count" : 10
                            },
                            success:function(response){
                                var resultpoisData = response.searchPoiInfo.pois.poi;
                                
                                // 기존 마커, 팝업 제거
                                if(markerArr.length > 0){
                                    for(var i in markerArr){
                                        markerArr[i].setMap(null);
                                    }
                                }
                                var innerHtml ="";	// Search Reulsts 결과값 노출 위한 변수
                                var positionBounds = new Tmapv2.LatLngBounds();		//맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
                                
                                for(var k in resultpoisData){
                                    
                                    var noorLat = Number(resultpoisData[k].noorLat);
                                    var noorLon = Number(resultpoisData[k].noorLon);
                                    var name = resultpoisData[k].name;
                                    
                                    var pointCng = new Tmapv2.Point(noorLon, noorLat);
                                    var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);
                                    
                                    var lat = projectionCng._lat;
                                    var lon = projectionCng._lng;
                                    
                                    var markerPosition = new Tmapv2.LatLng(lat, lon);
                                    
                                    marker = new Tmapv2.Marker({
                                        position : markerPosition,
                                        //icon : "http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
                                        icon : "http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png",
                                        iconSize : new Tmapv2.Size(24, 38),
                                        title : name,
                                        map:map
                                    });
                                    
                                    innerHtml += "<tr><td><img src='http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png' style='vertical-align:middle;'/></td><td>"+name+"</td></tr>";
                                    
                                    markerArr.push(marker);
                                    positionBounds.extend(markerPosition);	// LatLngBounds의 객체 확장
                                }
                                
                                $("#searchResult").html(innerHtml);	//searchResult 결과값 노출
                                map.panToBounds(positionBounds);	// 확장된 bounds의 중심으로 이동시키기
                                map.zoomOut();
                                
                            },
                            error:function(request,status,error){
                                console.log("code:"+request.status+"\\n"+"message:"+request.responseText+"\\n"+"error:"+error);
                            }
                        });
                    });
                }
                
                </script>
        </head>
        <body onload="initTmap();">

            <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light scrolled awake" id="ftco_navbar">
                <div class="container">
                    <a class="navbar-brand" href="index.html">BISU<span>KKURI</span></a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="oi oi-menu"></span> Menu
                    </button>
                    <div class="collapse navbar-collapse" id="ftco-nav">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
                            <li class="nav-item"><a href="rooms.html" class="nav-link">Notice</a></li>
                            <li class="nav-item"><a href="restaurant.html" class="nav-link">Contact</a></li>
                            <li class="nav-item"><a href="login.html" class="nav-link">User</a></li>
                            <!--<li class="nav-item"><a href="blog.html" class="nav-link">Blog</a></li>
                            <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>-->
                        </ul>
                    </div>
                </div>
            </nav>
            
            <section class="ftco-section">
                <div class="container">
                    <div class="row justify-content-center mb-5 pb-3">
                        <div class="col-md-7 heading-section text-center ftco-animate">
                            <span class="subheading">Welcome to BISUKKURI</span>
                            <h2 class="mb-4">Convenient Facilities</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section class="ftco-section docentpage">
                <div class="container">
                    <div class="row d-flex">
                        <div class="col-md-4 d-flex ftco-animate present_location">
                            <div id="map_div" class="map_wrap"></div>
                        </div>
                        <div class="input-group">
                            <select name = "job" class="custom-select text_custom" id="searchKeyword" name="searchKeyword">
                                <option value="">Choose Convenient Facilities</option>
                                <option value="식당">식당</option>
                                <option value="편의점">편의점</option>
                                <option value="지하철역">지하철역</option>
                            </select>
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" id="btn_select">Button</button>
                            </div>
                        </div>
                        <div class="col-md-4 d-flex ftco-animate present_location">
                            <table class="present_location highlight">
                                <thead>
                                    <tr>
                                        <th>Number</th>
                                        <th>Convenient Facilities</th>
                                    </tr>
                                </thead>
                            
                                <tbody id="searchResult" name="searchResult">
                                    
                                </tbody>
                            </table>
                        </div>
                </div>
            </section>

            <footer class="ftco-footer ftco-section" style="padding-top:0px; padding-bottom: 0px">
                <div class="row">
                    <div class="col-md-12 text-center">
                    <br>
                    <p>Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with Tour_project</a></p>
                    </div>
                </div>
            </footer>
        
            <!-- loader -->
            <div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px"><circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee"/><circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00"/></svg></div>


            <script src="/js/jquery.min.js"></script>
            <script src="/js/jquery-migrate-3.0.1.min.js"></script>
            <script src="/js/popper.min.js"></script>
            <script src="/js/bootstrap.min.js"></script>
            <script src="/js/jquery.easing.1.3.js"></script>
            <script src="/js/jquery.waypoints.min.js"></script>
            <script src="/js/jquery.stellar.min.js"></script>
            <script src="/js/owl.carousel.min.js"></script>
            <script src="/js/jquery.magnific-popup.min.js"></script>
            <script src="/js/aos.js"></script>
            <script src="/js/jquery.animateNumber.min.js"></script>
            <script src="/js/bootstrap-datepicker.js"></script>
            <script src="/js/scrollax.min.js"></script>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>
            <script src="/js/google-map.js"></script>
            <script src="/js/main.js"></script>
            <script src="/js/discountevent.js"></script>
            <script src="/js/d3.min.js"></script>
        </body>
    </html>
                `;
            response.send(template);
            });
}); 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})