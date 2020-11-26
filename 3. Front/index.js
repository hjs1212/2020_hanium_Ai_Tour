var express = require('express')
var app = express()
var mysql = require('mysql')
var qs = require('querystring');
var fs = require('fs');
var multer = require('multer');
const path = require('path');
const { PythonShell } = require("python-shell");

//var num = NULL;

var connection = mysql.createConnection({
    host     : 'tour-db2.mysql.database.azure.com',    // 호스트 주소
    user     : 'HF266@tour-db2',           // mysql user
    password : 'qhghgkrrhk15!',       // mysql password
    database : 'tour',
    port: 3306, 
    ssl:{ca:fs.readFileSync('crt.pem')}         // mysql 데이터베이스
});
connection.connect();
const port = 3001;

app.use(express.static('data'));

//이미지 파일명 적용
var storage = multer.diskStorage({
    destination: function(request,file, callback){
        callback(null, 'uploadFile/');
    },
    filename: function(request, file, callback){
        callback(null, "100"+path.extname(file.originalname));
    }
})

//이미지 파일명 변경
var upload = multer({
    storage: storage
});

//route , routing
app.get('/', function(request, response) { 
    var template=`
    <html>
    <head>
    <meta charset="utf-8">
        <link rel="stylesheet" href="css/login.css">
        <link rel="stylesheet" href="css/materialize.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    </head>
    <body>
        <form action="/langName">
            <p>
                <label>
                    <input type="checkbox" name="lang" value="1" onclo/>
                    <span>Korean</span>
                </label>
            </p>
            <p>
                <label>
                    <input type="checkbox" name="lang" value="2"/>
                    <span>English</span>
                </label>
            </p>
            <button class="btn waves-effect waves-light" type="submit" name="action">Go Bisukkuri</button>
        </form>
    
        <script src="js/materialize.js"></script>
    </body>
    </html>
    `
    response.end(template);
    //return response.send('/');
});

app.get('/langName', function(request, response){
    var name = request.query.lang;
    if(name == 1){
        response.writeHead(302, {Location: `/1`});
        response.end();
    }
    else if(name = 2){
        response.writeHead(302, {Location: `/2`});
        response.end();
    }
})

app.get('/:idx', function(request, response){
    var id = request.params.idx;
    connection.query('SELECT * FROM language WHERE idx='+id, //langName으로 바꿀지 고민
        function(error, result, fields){
            if (error){
                throw error;
            }
            if (id == 1){ //한글
                var template = `
                <!DOCTYPE html>
                <html lang="ko">
                    <head>
                        <title>유사 관광지 안내 서비스 웹 애플리케이션</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                
                        <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,600,700&display=swap" rel="stylesheet">
                
                        <link rel="stylesheet" href="css/open-iconic-bootstrap.min.css">
                        <link rel="stylesheet" href="css/animate.css">
                
                        <link rel="stylesheet" href="css/owl.carousel.min.css">
                        <link rel="stylesheet" href="css/owl.theme.default.min.css">
                        <link rel="stylesheet" href="css/magnific-popup.css">
                
                        <link rel="stylesheet" href="css/aos.css">
                
                        <link rel="stylesheet" href="css/ionicons.min.css">
                
                        <link rel="stylesheet" href="css/bootstrap-datepicker.css">
                        <link rel="stylesheet" href="css/jquery.timepicker.css">
                
                        <link rel="stylesheet" href="css/flaticon.css">
                        <link rel="stylesheet" href="css/icomoon.css">
                        <link rel="stylesheet" href="css/style.css">
                    
                        <link rel="stylesheet" href="css/input_file.css">
                    </head>
                    <body>
                
                    <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                        <div class="container">
                            <a class="navbar-brand" href="index.html">BISU<span>KKURI</span></a>
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="oi oi-menu"></span> Menu
                            </button>
                
                            <div class="collapse navbar-collapse" id="ftco-nav">
                                <ul class="navbar-nav ml-auto">
                                    <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
                                    <li class="nav-item"><a href="rooms.html" class="nav-link">Notice</a></li>
                                    <li class="nav-item"><a href="restaurant.html" class="nav-link">Contact</a></li>
                                    <li class="nav-item"><a href="login.html" class="nav-link">Login</a></li>
                                    <!--<li class="nav-item"><a href="blog.html" class="nav-link">Blog</a></li>
                                    <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>-->
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <!-- END nav -->
                    <div class="hero">
                        <section class="home-slider owl-carousel">
                            <div class="slider-item" style="background-image:url(images/bg_1.jpg);">
                                <div class="overlay"></div>
                                <div class="container">
                                    <div class="row no-gutters slider-text align-items-center justify-content-end">
                                        <div class="col-md-6 ftco-animate">
                                            <div class="text">
                                                <h2>What is BISUKKURI?</h2>
                                                <h1 class="mb-3">Similar Tourist Web Application!</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                
                            <div class="slider-item" style="background-image:url(images/bg_2.jpg);">
                                <div class="overlay"></div>
                                <div class="container">
                                    <div class="row no-gutters slider-text align-items-center justify-content-end">
                                        <div class="col-md-6 ftco-animate">
                                            <div class="text">
                                                <h2>Don't think about time and money!</h2>
                                                <h1 class="mb-3">Let's find similar tourist spots through one picture!</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                
                    <section class="ftco-booking ftco-section ftco-no-pt ftco-no-pb" style="margin-top: 50px">
                        <div class="file_container">
                            <div class="row no-gutters">
                                <div class="col-lg-12">
                                <form action="/upload" method="post" enctype="multipart/form-data">
                                <div class="file-field input-field">
                                  <div class="btn">
                                    <span>File</span>
                                    <input type="file" id="uploadFile" name="uploadFile">
                                  </div>
                                  <div class="file-path-wrapper">
                                    <input class="file-path validate" type="text"/>
                                  </div>
                                </div>
                                <button type="submit" class="btn btn-outline-success" style="float:right; margin-left:10px; height:48px">Submit</button>
                              </form>
                                </div>
                            </div>
                        </div>
                    </section>
                
                    <section class="ftco-section">
                        <div class="container">
                            <div class="row justify-content-center mb-5 pb-3">
                                <div class="col-md-7 heading-section text-center ftco-animate">
                                    <span class="subheading">Welcome to BISUKKURI</span>
                                    <h2 class="mb-4">We provide a variety of services.</h2>
                                </div>
                            </div>  
                            <div class="row d-flex">
                                <div class="col-md pr-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-like"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Similar Tourist Recommendations</h3>
                                        </div>
                                    </div>      
                                </div>
                                <div class="col-md px-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services active py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-phone"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Docent Service</h3>
                                        </div>
                                    </div>    
                                </div>
                                <div class="col-md px-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-journey"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Navigation</h3>
                                        </div>
                                    </div>      
                                </div>
                                <div class="col-md pl-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-bike"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Local Bike Link</h3>
                                        </div>
                                    </div>      
                                </div>
                                <div class="col-md pl-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-convenience-store"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Convenient Facilities</h3>
                                        </div>
                                    </div>      
                                </div>
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
                
                    <script src="js/jquery.min.js"></script>
                    <script src="js/jquery-migrate-3.0.1.min.js"></script>
                    <script src="js/popper.min.js"></script>
                    <script src="js/bootstrap.min.js"></script>
                    <script src="js/jquery.easing.1.3.js"></script>
                    <script src="js/jquery.waypoints.min.js"></script>
                    <script src="js/jquery.stellar.min.js"></script>
                    <script src="js/owl.carousel.min.js"></script>
                    <script src="js/jquery.magnific-popup.min.js"></script>
                    <script src="js/aos.js"></script>
                    <script src="js/jquery.animateNumber.min.js"></script>
                    <script src="js/bootstrap-datepicker.js"></script>
                    <script src="js/scrollax.min.js"></script>
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>
                    <script src="js/google-map.js"></script>
                    <script src="js/main.js"></script>
                    
                    </body>
                </html>
                `
            }
            else if (id == 2){ //영어
                var template = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>Similar Tourist Web Application</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                
                        <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,600,700&display=swap" rel="stylesheet">
                
                        <link rel="stylesheet" href="css/open-iconic-bootstrap.min.css">
                        <link rel="stylesheet" href="css/animate.css">
                
                        <link rel="stylesheet" href="css/owl.carousel.min.css">
                        <link rel="stylesheet" href="css/owl.theme.default.min.css">
                        <link rel="stylesheet" href="css/magnific-popup.css">
                
                        <link rel="stylesheet" href="css/aos.css">
                
                        <link rel="stylesheet" href="css/ionicons.min.css">
                
                        <link rel="stylesheet" href="css/bootstrap-datepicker.css">
                        <link rel="stylesheet" href="css/jquery.timepicker.css">
                
                        <link rel="stylesheet" href="css/flaticon.css">
                        <link rel="stylesheet" href="css/icomoon.css">
                        <link rel="stylesheet" href="css/style.css">
                    
                        <link rel="stylesheet" href="css/input_file.css">
                    </head>
                    <body>
                
                    <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                        <div class="container">
                            <a class="navbar-brand" href="index.html">BISU<span>KKURI</span></a>
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="oi oi-menu"></span> Menu
                            </button>
                
                            <div class="collapse navbar-collapse" id="ftco-nav">
                                <ul class="navbar-nav ml-auto">
                                    <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
                                    <li class="nav-item"><a href="rooms.html" class="nav-link">Notice</a></li>
                                    <li class="nav-item"><a href="restaurant.html" class="nav-link">Contact</a></li>
                                    <li class="nav-item"><a href="login.html" class="nav-link">Login</a></li>
                                    <!--<li class="nav-item"><a href="blog.html" class="nav-link">Blog</a></li>
                                    <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>-->
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <!-- END nav -->
                    <div class="hero">
                        <section class="home-slider owl-carousel">
                            <div class="slider-item" style="background-image:url(images/bg_1.jpg);">
                                <div class="overlay"></div>
                                <div class="container">
                                    <div class="row no-gutters slider-text align-items-center justify-content-end">
                                        <div class="col-md-6 ftco-animate">
                                            <div class="text">
                                                <h2>What is BISUKKURI?</h2>
                                                <h1 class="mb-3">Similar Tourist Web Application!</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                
                            <div class="slider-item" style="background-image:url(images/bg_2.jpg);">
                                <div class="overlay"></div>
                                <div class="container">
                                    <div class="row no-gutters slider-text align-items-center justify-content-end">
                                        <div class="col-md-6 ftco-animate">
                                            <div class="text">
                                                <h2>Don't think about time and money!</h2>
                                                <h1 class="mb-3">Let's find similar tourist spots through one picture!</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                
                    <section class="ftco-booking ftco-section ftco-no-pt ftco-no-pb" style="margin-top: 50px">
                        <div class="file_container">
                            <div class="row no-gutters">
                                <div class="col-lg-12">
                                    <form action="/upload" class="booking-form aside-stretch" method="post" enctype="multipart/form-data" id="dataform" name="dataform">
                                        <div class="file-field input-field">
                                            <div class="btn">
                                                <span>File</span>
                                                <input type="file" name="uploadFile" id = "uploadFile" accept="image/*">
                                            </div>
                                            <div class="file-path-wrapper">
                                                <input class="file-path validate" type="text">
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-outline-success" style="float:right; margin-left:10px; height:48px">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                
                    <section class="ftco-section">
                        <div class="container">
                            <div class="row justify-content-center mb-5 pb-3">
                                <div class="col-md-7 heading-section text-center ftco-animate">
                                    <span class="subheading">Welcome to BISUKKURI</span>
                                    <h2 class="mb-4">We provide a variety of services.</h2>
                                </div>
                            </div>  
                            <div class="row d-flex">
                                <div class="col-md pr-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-like"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Similar Tourist Recommendations</h3>
                                        </div>
                                    </div>      
                                </div>
                                <div class="col-md px-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services active py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-phone"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Docent Service</h3>
                                        </div>
                                    </div>    
                                </div>
                                <div class="col-md px-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-journey"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Navigation</h3>
                                        </div>
                                    </div>      
                                </div>
                                <div class="col-md pl-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-bike"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Local Bike Link</h3>
                                        </div>
                                    </div>      
                                </div>
                                <div class="col-md pl-md-1 d-flex align-self-stretch ftco-animate">
                                    <div class="media block-6 services py-4 d-block text-center">
                                        <div class="d-flex justify-content-center">
                                            <div class="icon d-flex align-items-center justify-content-center">
                                                <span class="flaticon-convenience-store"></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h3 class="heading mb-3">Convenient Facilities</h3>
                                        </div>
                                    </div>      
                                </div>
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
                
                    <script src="js/jquery.min.js"></script>
                    <script src="js/jquery-migrate-3.0.1.min.js"></script>
                    <script src="js/popper.min.js"></script>
                    <script src="js/bootstrap.min.js"></script>
                    <script src="js/jquery.easing.1.3.js"></script>
                    <script src="js/jquery.waypoints.min.js"></script>
                    <script src="js/jquery.stellar.min.js"></script>
                    <script src="js/owl.carousel.min.js"></script>
                    <script src="js/jquery.magnific-popup.min.js"></script>
                    <script src="js/aos.js"></script>
                    <script src="js/jquery.animateNumber.min.js"></script>
                    <script src="js/bootstrap-datepicker.js"></script>
                    <script src="js/scrollax.min.js"></script>
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>
                    <script src="js/google-map.js"></script>
                    <script src="js/main.js"></script>
                    
                    </body>
                </html>
                `;
            }
            response.send(template);
        }
    );
});

//INPUT 관광지
app.post('/upload', upload.single('uploadFile'), function(request, response){
    //response.send('업로드!');
    console.log(request.file);
    let options = {
        scriptPath: ""
    };
    PythonShell.run("client.py", options, function(err, data) {
        if (err) throw err;
        console.log(data);
    });
    cid = data[0];
    response.writeHead(302, {Location: `1/search/${cid}`});
    response.end();
})

//유사 관광지 (한국어)
app.get('/1/search/:cid', function(request, response){
    var cid = request.params.cid;
    connection.query('SELECT * FROM content_txt WHERE Content_idx='+cid,
        function(error, results, fields){
            if (error){
                console.log(error);
            }
            console.log(results);
            var des_name = results[0].text;
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

                    <link rel="stylesheet" href="/css/TourDetail.css">
                </head>
                <body>

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
                                <h2 class="mb-4">Similar Tourist Recommendation</h2>
                            </div>
                        </div>
                    </div>
                </section>
            
                <section class="ftco-section information">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h6 class="mb-4" style="text-align: center">검색한 관광지</h6>
                                </div>
                                <div class="single-slider-resto mb-4 mb-md-0 owl-carousel">
                                    <div class="item">
                                        <div class="resto-img" style="background-image: url(/uploadFile/100.png); background-repeat: no-repeat; background-size: contain;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6" style="overflow:auto;">
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h6 class="mb-4" style="text-align: center">유사 관광지 - <strong>${des_name}</strong></h6>
                                </div>
                                <div class="single-slider-resto mb-4 mb-md-0 owl-carousel">
                                    <div class="item">
                                        <a href="http://localhost:${port}/1/search/${cid}/detail"><div class="resto-img" style="background-image: url(/images/${cid}.jpg); background-repeat: no-repeat; background-size: contain;"></div></a>
                                    </div>
                                </div>
                            </div>
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

//유사 관광지 (영어)
app.get('/2/search/:cid', function(request, response){
    var cid = request.params.cid;
    connection.query('SELECT * FROM content_txt WHERE Content_idx='+cid,
        function(error, results, fields){
            if (error){
                console.log(error);
            }
            console.log(results);
            var des_name = results[0].text;
            var template = `
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>Similar Tourist Web Application</title>
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

                    <link rel="stylesheet" href="/css/TourDetail.css">
                </head>
                <body>

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
                                <li class="nav-item"><a href="login.html" class="nav-link">Login</a></li>
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
                                <h2 class="mb-4">Similar Tourist Recommendation</h2>
                            </div>
                        </div>
                    </div>
                </section>
            
                <section class="ftco-section information">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h6 class="mb-4" style="text-align: center">검색한 관광지</h6>
                                </div>
                                <div class="single-slider-resto mb-4 mb-md-0 owl-carousel">
                                    <div class="item">
                                        <div class="resto-img" style="background-image: url(/uploadFile/100.png); background-repeat: no-repeat; background-size: contain;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6" style="overflow:auto;">
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h6 class="mb-4" style="text-align: center">Similar Tour Destination - <strong>${des_name}</strong></h6>
                                </div>
                                <div class="single-slider-resto mb-4 mb-md-0 owl-carousel">
                                    <div class="item">
                                        <a href="http://localhost:${port}/2/search/${cid}/detail"><div class="resto-img" style="background-image: url(/images/${cid}.jpg); background-repeat: no-repeat; background-size: contain;"></div></a>
                                    </div>
                                </div>
                            </div>
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

//관광지 세부정보 (한글)
app.get('/1/search/:cid/detail', function(request, response){
    var cid = request.params.cid;
    connection.query('SELECT * FROM content_txt WHERE Content_idx='+cid,
        function(error, results, fields){
            if(error){
                console.log(error);
            }
            console.log(results[0].text);
            var des_name = results[0].text;

            connection.query('SELECT * FROM city_txt WHERE Content_idx='+cid,
                function(error, results, fields){
                    if(error){
                        console.log(error);
                    }

                    console.log(results[0].text);
                    var des_add = results[0].text;
                    connection.query('SELECT * FROM overview WHERE cid='+cid,
                        function(error, results, fields){
                            if(error){
                                console.log(error);
                            }
                            var des_exp = results[0].text;
                            var template = `
                            <html lang="ko">
                            <head>
                                <meta charset="utf-8">
                                <title>유사 관광지 안내 서비스 웹 애플리케이션</title>
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

                                <link rel="stylesheet" href="/css/TourDetail.css">
                            </head>
                            <body>

                                <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light scrolled awake" id="ftco_navbar">
                                    <div class="container">
                                        <a class="navbar-brand" href="/1">BISU<span>KKURI</span></a>
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
                                
                                <section class="ftco-section DetailTitle">
                                    <div class="container">
                                        <div class="row justify-content-center mb-5 pb-3">
                                            <div class="col-md-7 heading-section text-center ftco-animate">
                                                <span class="subheading">Welcome to BISUKKURI</span>
                                                <h2 class="mb-4">Tour Detail</h2>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section class="ftco-section information">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <!-- <div class="single-slider-resto mb-4 mb-md-0 owl-carousel"> -->
                                                    <div class="item">
                                                        <div class="resto-img rounded" style="background-image: url(/images/${cid}.jpg); background-repeat: no-repeat; background-size: contain; background-position: center;"></div>
                                                    </div>
                                                <!-- </div>-->
                                            </div>
                                            <div class="col-md-6 pl-md-5">
                                                <div class="heading-section mb-4 my-5 my-md-0">
                                                    <h4 class="mb-4">${des_name}
                                                        <span class="flaticon-heart detailheart"></span>
                                                        <span class="flaticon-speaker detailheart" onclick="docente()" style="cursor:hand">
                                                            <audio id= "audio" >
                                                                <source src="/krdocente/${cid}.mp3" type="audio/mp3"/>
                                                            </audio>
                                                        </span>
                                                    </h4>
                                                </div>
                                                <p>${des_add}</p>
                                                <h5 class="mb-4">관광지 상세 정보</h5>
                                                <p>${des_exp}</p>
                                                <p class="detailbtn"><a href="#" class="btn btn-secondary rounded">Facilities</a></p>
                                                <p class="detailbtn"><a href="#" class="btn btn-secondary rounded">Navigation</a></p>
                                                <p class="detailbtn"><a href="LocalBike.html" class="btn btn-secondary rounded">Local Bike</a></p>
                                            </div>
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

                                <script type="text/javascript">
                                    function docente(){
                                        var audio = document.getElementById("audio");
                                        audio.play();
                                    }
                                </script>

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
        });
});

//관광지 세부정보 (영어)
app.get('/2/search/:cid/detail', function(request, response){
    var cid = request.params.cid;
    connection.query('SELECT * FROM content_txt WHERE Content_idx='+cid,
        function(error, results, fields){
            if(error){
                console.log(error);
            }
            console.log(results[0].text);
            var des_name = results[0].text;

            connection.query('SELECT * FROM city_txt WHERE Content_idx='+cid,
                function(error, results, fields){
                    if(error){
                        console.log(error);
                    }

                    console.log(results[0].text);
                    var des_add = results[0].text;
                    connection.query('SELECT * FROM overview WHERE cid='+cid,
                        function(error, results, fields){
                            if(error){
                                console.log(error);
                            }
                            var des_exp = results[0].text;
                            var template = `
                            <html lang="en">
                            <head>
                                <meta charset="utf-8">
                                <title>Similar Tourist Web Application</title>
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

                                <link rel="stylesheet" href="/css/TourDetail.css">
                            </head>
                            <body>

                                <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light scrolled awake" id="ftco_navbar">
                                    <div class="container">
                                        <a class="navbar-brand" href="/1">BISU<span>KKURI</span></a>
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
                                
                                <section class="ftco-section DetailTitle">
                                    <div class="container">
                                        <div class="row justify-content-center mb-5 pb-3">
                                            <div class="col-md-7 heading-section text-center ftco-animate">
                                                <span class="subheading">Welcome to BISUKKURI</span>
                                                <h2 class="mb-4">Tour Detail</h2>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section class="ftco-section information">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <!-- <div class="single-slider-resto mb-4 mb-md-0 owl-carousel"> -->
                                                    <div class="item">
                                                        <div class="resto-img rounded" style="background-image: url(/images/264550.jpg); background-repeat: no-repeat; background-size: contain; background-position:center;"></div>
                                                    </div>
                                                <!-- </div> -->
                                            </div>
                                            <div class="col-md-6 pl-md-5">
                                                <div class="heading-section mb-4 my-5 my-md-0">
                                                    <h4 class="mb-4">${des_name}
                                                        <span class="flaticon-heart detailheart"></span>
                                                        <span class="flaticon-speaker detailheart" onclick="docente()" style="cursor:hand">
                                                            <audio id= "audio" >
                                                                <source src="/engdocoente/264550.mp3" type="audio/mp3"/>
                                                            </audio>
                                                        </span>
                                                    </h4>
                                                </div>
                                                <p>${des_add}</p>
                                                <!-- <p class="detailbtn"><a href="discountevent.html" class="btn btn-secondary rounded ">Discount Event</a></p> -->
                                                <!-- <p class="detailbtn"><a href="Package.html" class="btn btn-secondary rounded">Package Recommendation</a></p> -->
                                                <!-- <p class="detailbtn"><a href="LocalBike.html" class="btn btn-secondary rounded">Local Bike</a></p>-->
                                                <h5 class="mb-4">Tour destination Detail Information</h5>
                                                <p>${des_exp}</p>
                                                <p class="detailbtn"><a href="#" class="btn btn-secondary rounded">Facilities</a></p>
                                                <p class="detailbtn"><a href="#" class="btn btn-secondary rounded">Navigation</a></p>
                                                <p class="detailbtn"><a href="LocalBike.html" class="btn btn-secondary rounded">Local Bike</a></p>
                                            </div>
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

                                <script type="text/javascript">
                                    function docente(){
                                        var audio = document.getElementById("audio");
                                        audio.play();
                                    }
                                </script>

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
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})