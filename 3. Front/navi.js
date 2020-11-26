

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

app.get('/route/:cid', function(request, response) { 
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
                <script
                src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx7a37c0b7e6384cdf9df459d620f7f8c3"></script>
                <script type="text/javascript">
                var map;
                                // 페이지가 로딩이 된 후 호출하는 함수입니다.
                function initTmap(){
                    // map 생성
                    // Tmap.map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
                    map = new Tmapv2.Map("map_div", {
                        center : new Tmapv2.LatLng(${x}, ${y}), // 지도 초기 좌표
                        width : "100%", // map의 width 설정
                        height : "400px" // map의 height 설정	
                    });
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function(position) {
                                lat = position.coords.latitude;
                                lon = position.coords.longitude;
                                    
                                //팝업 생성
                                var content = "<div style=' position: relative; border-bottom: 1px solid #dcdcdc; line-height: 18px; padding: 0 35px 2px 0;'>"
                                        + "<div style='font-size: 12px; line-height: 15px;'>"
                                        + "<span style='display: inline-block; width: 14px; height: 14px; background-image: url(/resources/images/common/icon_blet.png); vertical-align: middle; margin-right: 5px;'></span>현재위치"
                                        + "</div>" + "</div>";
        
                                marker = new Tmapv2.Marker({
                                    position : new Tmapv2.LatLng(lat,lon),
                                    map : map
                                });
        
                                InfoWindow = new Tmapv2.InfoWindow({
                                    position : new Tmapv2.LatLng(lat,lon),
                                    content : content,
                                    type : 2,
                                    map : map
                                });
                                map.setCenter(new Tmapv2.LatLng(lat,lon));
                                map.setZoom(15);
                            });
                    }
            };
            function getRP() {
                var s_latlng = new Tmapv2.LatLng (lat, lon);
                var e_latlng = new Tmapv2.LatLng (${x}, ${y});
                
                var optionObj = {
                    reqCoordType:"WGS84GEO", //요청 좌표계 옵셥 설정입니다.
                    resCoordType:"WGS84GEO",  //응답 좌표계 옵셥 설정입니다.
                    trafficInfo:"Y"
                };
                
                var params = {
                    onComplete:onComplete,
                    onProgress:onProgress,
                    onError:onError
                };
                
                // TData 객체 생성
                var tData = new Tmapv2.extension.TData();
            
                // TData 객체의 경로요청 함수
                tData.getRoutePlanJson(s_latlng, e_latlng, optionObj, params);
            }
        
            //경로안내
            function onComplete() {
                console.log(this._responseData); //json으로 데이터를 받은 정보들을 콘솔창에서 확인할 수 있습니다.
                var jsonObject = new Tmapv2.extension.GeoJSON();
                var jsonForm = jsonObject.rpTrafficRead(this._responseData);
            
                //교통정보 표출시 생성되는 LineColor 입니다.
                var trafficColors = {
            
                    // 사용자가 임의로 색상을 설정할 수 있습니다.
                    // 교통정보 옵션 - 라인색상
                    trafficDefaultColor:"#000000", //교통 정보가 없을 때
                    trafficType1Color:"#009900", //원할
                    trafficType2Color:"#7A8E0A", //서행
                    trafficType3Color:"#8E8111",  //정체
                    trafficType4Color:"#FF0000"  //정체
                };
                jsonObject.drawRouteByTraffic(map, jsonForm, trafficColors);
                map.setCenter(new Tmapv2.LatLng(${x},${y}));
                map.setZoom(14);
            }
            
            //데이터 로드중 실행하는 함수입니다.
            function onProgress(){
                  
            }
            
            //데이터 로드 중 에러가 발생시 실행하는 함수입니다.
            function onError(){
                alert("onError");
            }
            
                </script>
            </head>
            <body onload="initTmap()">
        
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
                                <h2 class="mb-4">Navigation</h2>
                            </div>
                        </div>
                    </div>
                </section>
        
                <section class="ftco-section docentpage">
                    <div class="container">
                        <div class="row d-flex">
                            <div id="map_div" class="col-md-4 d-flex ftco-animate present_location" style="background-color: #fff;">
                                <div class="blog-entry align-self-stretch">
                                    <a href="blog-single.html" class="block-20 rounded"></a>
                                </div>
                            </div>
                            자세한 정보는 <a href="https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xx7a37c0b7e6384cdf9df459d620f7f8c3&name=SKT타워&lon=126.984098&lat=37.566385">여기</a>를 참조해주세요(모바일만 가능)
                                <button onClick="getRP()" class="btn btn-outline-success">경로 요청</button>
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