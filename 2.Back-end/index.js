var express = require('express')
var app = express()
var mysql = require('mysql')
var qs = require('querystring');
var fs = require('fs');
var multer = require('multer');
const path = require('path');
var session = require('express-session')
var FileStore = require('session-file-store')(session)

app.use(session({
    secret: '-',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  }));

const { PythonShell } = require("python-shell");
const { connect } = require('http2');
var connection = mysql.createConnection({
    host     : 'tour-db2.mysql.database.azure.com',    // 호스트 주소
    user     : 'HF266@tour-db2',           // mysql user
    password : '-',       // mysql password
    database : '-',
    port: 3306, 
    ssl:{ca:fs.readFileSync('crt.pem')}         // mysql 데이터베이스
});
connection.connect();

app.use(express.static('data'));
const port = 3001;
var storage = multer.diskStorage({
    destination: function(request,file, callback){
        callback(null, 'data/uploadFile/');
    },
    filename: function(request, file, callback){
        callback(null, "100"+path.extname(file.originalname));
    }
})

//이미지 파일명 변경
var upload = multer({
     storage:storage
});

function authISOwner(request,response){
    if(request.session.is_logined){
        var menubar =
        `
        <div class="collapse navbar-collapse" id="ftco-nav">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
					<li class="nav-item"><a href="rooms.html" class="nav-link">Notice</a></li>
					<li class="nav-item"><a href="restaurant.html" class="nav-link">Contact</a></li>
                    <li class="nav-item dropdown"><a href="javascript:void(0)" class="nav-link dropbtn">${request.session.idx}</a>
                    <div class="dropdown-content">
                        <a href="/moneybook/${request.session.idx}">Tour Account</a>
                        <a href="wishlist.html">WishList</a>
                        <a href="setting.html">Setting</a>
                    </div>
                    </li>
					<!--<li class="nav-item"><a href="blog.html" class="nav-link">Blog</a></li>
					<li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>-->
				</ul>
			</div>
        `
        return menubar;
    }else{
        var menubar =
        `
        <div class="collapse navbar-collapse" id="ftco-nav">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
					<li class="nav-item"><a href="rooms.html" class="nav-link">Notice</a></li>
					<li class="nav-item"><a href="restaurant.html" class="nav-link">Contact</a></li>
					<li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
					<!--<li class="nav-item"><a href="blog.html" class="nav-link">Blog</a></li>
					<li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>-->
				</ul>
			</div>
        `
        return menubar;
    }
}
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
        <form action="/langName" method="get">
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
    response.send(template);
    //return response.send('/');
});
app.get('/login', function(request, response) { 
    var template=`
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/login.css">
        <link rel="stylesheet" href="css/materialize.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    </head>
    <body>
        <div id="login-page" class="row">
            <div class="col s12 z-depth-4 card-panel">
              <form class="login-form" method="post" action="/login_process">
                <div class="row">
                  <div class="input-field col s12 center">
                    <p class="center login-form-text">LOGIN</p>
                  </div>
                </div>
                <div class="row margin">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">account_circle</i>
                    <input id="username" name="id" type="text" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=&quot;); cursor: auto;"/>
                    <label for="username" data-error="wrong" class="center-align" data-success="right">ID</label>            
                  </div>
                </div>
                <div class="row margin">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">vpn_key</i>
                    <input id="password" name="password" type="password" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=&quot;);"/>
                    <label for="password">Password</label>
                  </div>
                </div>
                
                <div class="row">          
                  <div class="input-field col s12 login-text">
                      <label for="check">
                        <input type="checkbox" id="check" checked="checked" />
                        <span class="pointer-events">Remember me</span>
                      </label>
                  </div>
                </div>
                
                <div class="row">
                  <div class="input-field col s12">
                    <button type="submit" class="btn waves-effect waves-light col s12">Login</button>
                  </div>
                  <div class="input-field col s12">
                    <a href="/" class="btn waves-effect waves-light col s12 light-blue darken-4">FACEBOOK Login</a>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s6 m6 l6">
                    <p class="margin medium-small"><a href="/register">Register Now!</a></p>
                  </div>
                  <div class="input-field col s6 m6 l6">
                      <p class="margin right-align medium-small"><a href="forgot_password.html">Forgot password ?</a></p>
                  </div>          
                </div>
              </form>
            </div>
          </div>

          <script src="js/login.js"></script>
          <script src="js/materialize.js"></script>
    </body>
</html>
    `
    response.send(template);
    //return response.send('/');
});
app.post('/login_process', function(request, response) { 
    var body='';
    request.on('data', function(data){
        body = body + data;
    });
    
    request.on('end', function(){
        var post = qs.parse(body);
        connection.query(`SELECT * FROM user where id = '${post.id}' and passwd = ${post.password}`, function(err,topics){
            if(err){
                console.log(err);
            }
            request.session.is_logined = true;
            request.session.idx = post.id;
            response.redirect('/');
          });
    });
}); 
app.get('/register', function(request, response) { 
    var template=`
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/register.css">
        <link rel="stylesheet" href="css/materialize.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    </head>
    <body>
        <div id="login-page" class="row">
            <div class="col s12 z-depth-4 card-panel">
              <form class="login-form" method="post" action="/register_process">
                <div class="row">
                  <div class="input-field col s12 center">
                    <h5>Register</h5>
                    <p class="center">Join to BISUKKURI now !</p>
                  </div>
                </div>
          
                <div class="row margin">
                  <div class="input-field col s12">
                    <i class="mdi-social-person-outline prefix"></i>
                    <i class="material-icons prefix">account_circle</i>
                    <input id="username" name="id" type="text"/>
                    <label for="username">ID</label>
                  </div>
                </div>
          
                <div class="row margin">
                  <div class="input-field col s12">
                    <!-- <i class="mdi-action-lock-outline prefix"></i> -->
                    <i class="material-icons prefix">vpn_key</i>
                    <input id="password" name="password" type="password" />
                    <label for="password">Password</label>
                  </div>
                </div>
          
          
                <div class="row">
                  <div class="input-field col s12">
                    <button type="submit" class="btn waves-effect waves-light col s12" id="SignUP">REGISTER NOW</button>
                    
                  </div>
                  <div class="input-field col s12">
                    <p class="margin center medium-small sign-up">Already have an account? <a href="/login">Login</a></p>
                  </div>
                </div>
          
          
              </form>
            </div>
          </div>
          
          <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js"></script>
          <script src="js/register.js"></script>
          <script src="js/materialize.js"></script>
    </body>
</html>
    `
    response.send(template);
    //return response.send('/');
});

app.post('/register_process', function(request, response) { 
    var body='';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id =post.id;
        connection.query(`
          INSERT INTO user (id, passwd) 
            VALUES(?, ?)`,
          [post.id, post.password ], 
          function(error, result){
            if(error){
              response.end('error! Go back!')
            }
            response.writeHead(302, {Location: `/login`});
            response.end();
          }
        )
    });
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
});

app.get('/:idx', function(request, response){
    var id = request.params.idx;
    var menubar = authISOwner(request,response);
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
                
                            ${menubar}
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
                                <form action="/upload1" method="post" enctype="multipart/form-data">
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
                              <form action="/upload11" method="post">
                                <button type="submit" class="btn btn-outline-success" style="float:right; margin-left:10px; height:48px">Go</button>
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
                                    <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
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
                                    <form action="/upload2" class="booking-form aside-stretch" method="post" enctype="multipart/form-data" id="dataform" name="dataform">
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
                                    <form action="/upload22" method="post">
                                        <button type="submit" class="btn btn-outline-success" style="float:right; margin-left:10px; height:48px">Go</button>
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
            connection.end();
            response.send(template);
    
});

//INPUT 관광지

app.post('/upload1',upload.single('uploadFile'), function(request, response){
    //response.send('업로드!');
    console.log(request.file);
    console.log('start');
    
    let options = {
        scriptPath: ""
    };
    
    var cid;
    console.log('>>');
    PythonShell.run("client1.py", options, function(err, data) {
        if (err) {
            console.log('error');
        };
        console.log(data);
        cid = data[1];
        response.writeHead(302, {Location: `1/search/${cid}`})
        response.end();
    });
    response.writeHead(302, {Location: `1`})
    response.end();

});
app.post('/upload11', function(request, response){
    //response.send('업로드!');
    //console.log(request.file);
    console.log('start')
    
    let options = {
        scriptPath: ""
    };
    
    var cid;
    PythonShell.run("client1.py", options, function(err, data) {
        if (err) {
            console.log(err);
        };
        console.log(data);
        cid = data[1];
        response.writeHead(302, {Location: `1/search/${cid}`})
        response.end();
    });
});

app.post('/upload2',upload.single('uploadFile'), function(request, response){
    //response.send('업로드!');
    //console.log(request.file);
    console.log('start')
    
    let options = {
        scriptPath: ""
    };
    
    var cid;
    PythonShell.run("client2.py", options, function(err, data) {
        if (err) {
            console.log('error');
        };
        console.log(data);
        cid = data[1];
        response.writeHead(302, {Location: `2/search/${cid}`})
        response.end();
    });
    response.writeHead(302, {Location: `2`})
    response.end();
});
app.post('/upload22', function(request, response){
    //response.send('업로드!');
    //console.log(request.file);
    console.log('start')
    
    let options = {
        scriptPath: ""
    };
    
    var cid;
    PythonShell.run("client2.py", options, function(err, data) {
        if (err) {
            console.log('error');
        };
        console.log(data);
        cid = data[1];
        response.writeHead(302, {Location: `2/search/${cid}`})
        response.end();
    });
});

/*
app.post('/upload', function(request, response) { 
    cid = 264550;
    //cid = 126508;
    response.writeHead(302, {Location: `2/search/${cid}`})
    response.end();
})
*/
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
            console.log(des_name);
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
                        <a class="navbar-brand" href="/">BISU<span>KKURI</span></a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="oi oi-menu"></span> Menu
                        </button>
                        <div class="collapse navbar-collapse" id="ftco-nav">
                            <ul class="navbar-nav ml-auto">
                                <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
                                <li class="nav-item"><a href="rooms.html" class="nav-link">Notice</a></li>
                                <li class="nav-item"><a href="restaurant.html" class="nav-link">Contact</a></li>
                                <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
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
                                        <a href="http://localhost:${port}/1/search/${cid}/detail"><div class="resto-img" style="background-image: url(/krimage/${cid}.jpg); background-repeat: no-repeat; background-size: contain;"></div></a>
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
                                <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
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
                                    <h6 class="mb-4" style="text-align: center">Search image</h6>
                                </div>
                                <div class="single-slider-resto mb-4 mb-md-0 owl-carousel">
                                    <div class="item">
                                        <div class="resto-img" style="background-image: url(/uploadFile/12.jpg); background-repeat: no-repeat; background-size: contain;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6" style="overflow:auto;">
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h6 class="mb-4" style="text-align: center">Similar Tour Destination - <strong>${des_name}</strong></h6>
                                </div>
                                <div class="single-slider-resto mb-4 mb-md-0 owl-carousel">
                                    <div class="item">
                                        <a href="http://localhost:${port}/2/search/${cid}/detail"><div class="resto-img" style="background-image: url(/engimage/${cid}.jpg); background-repeat: no-repeat; background-size: contain;"></div></a>
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
                                                <li class="nav-item"><a href="/login" class="nav-link">User</a></li>
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
                                                        <div class="resto-img rounded" style="background-image: url(/krimage/${cid}.jpg); background-repeat: no-repeat; background-size: contain; background-position: center;"></div>
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
                                                <p class="detailbtn"><a href="/place/${cid}" class="btn btn-secondary rounded">Facilities</a></p>
                                                <p class="detailbtn"><a href="/route/${cid}" class="btn btn-secondary rounded">Navigation</a></p>
                                                <p class="detailbtn"><a href="/cycle/${cid}" class="btn btn-secondary rounded">Local Bike</a></p>
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
                                                <li class="nav-item"><a href="/login" class="nav-link">User</a></li>
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
                                                        <div class="resto-img rounded" style="background-image: url(/engimage/264550.jpg); background-repeat: no-repeat; background-size: contain; background-position:center;"></div>
                                                    </div>
                                                <!-- </div> -->
                                            </div>
                                            <div class="col-md-6 pl-md-5">
                                                <div class="heading-section mb-4 my-5 my-md-0">
                                                    <h4 class="mb-4">${des_name}
                                                        <span class="flaticon-heart detailheart"></span>
                                                        <span class="flaticon-speaker detailheart" onclick="docente()" style="cursor:hand">
                                                            <audio id= "audio" >
                                                                <source src="/engdocente/${cid}.mp3" type="audio/mp3"/>
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
                                                <p class="detailbtn"><a href="/place/${cid}" class="btn btn-secondary rounded">Facilities</a></p>
                                                <p class="detailbtn"><a href="/route/${cid}" class="btn btn-secondary rounded">Navigation</a></p>
                                                <p class="detailbtn"><a href="/cycle/${cid}" class="btn btn-secondary rounded">Local Bike</a></p>
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


app.get('/moneybook/:id', function(request, response) { 
    var id = request.params.id;
    var tempid=`'${id}'`
    var usecost = 0;
    connection.query('SELECT * FROM cost1 WHERE id='+tempid, 
    //sql 쿼리문
    //costresult 지출장소,지출금액
        function (error, costresults, fields) {
        if (error) {
            console.log(error)
        }
        connection.query('SELECT * FROM allmoney1 WHERE id='+tempid, 
        //moneyresult 총 예산액
            function (error, moneyresults, fields) {
                if (error) throw error;
                //console.log(typeof(moneyresults[0]));
                var allmoney;
                if(moneyresults[0] != undefined){
                    allmoney =moneyresults[0].allmoney;
                } 
                var costlist ='';
                //지출내역 출력
                if (costresults[0]== undefined){
                    costlist=`
                    <table class="present_location highlight">
                        <thead>
                                    <tr>
                                        <th>지출 장소</th>
                                        <th>지출 금액</th>
                                    </tr>
                        </thead>
                    </table>`;
                }else{
                    costarry='<tbody>';
                    var j;
                    for(j=0;j<costresults.length;j++){
                        costarry=costarry+`<tr>`;
                        costarry=costarry+`<th>`+costresults[j].location+`</th>`;
                        costarry=costarry+`<th>`+costresults[j].costmoney+`</th>`;
                        costarry=costarry+`</tr>`;
                    }
                    var k;
                    for(k=0;k<costresults.length;k++){
                        usecost=usecost+costresults[k].costmoney;
                    }
                    costarry=costarry+`</tbody>`;
                    costlist=`
                        <table class="present_location highlight">
                                <thead>
                                    <tr>
                                        <th>지출 장소</th>
                                        <th>지출 금액</th>
                                    </tr>
                                </thead>
                                ${costarry}
                        </table>
                    `
                }
                //가계부 출력 4가지의 경우의 수
                var moneylist='';
                if (moneyresults[0] == undefined){
                    if(costresults[0]== undefined){
                        //처음 사용자(지출내역도 없고 총예산액도없고)
                        console.log(1);
                        moneylist=`
                        <div class="col-md-6">
                        <form action="/create_process_allmoney" method="post">
                            
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h5 class="mb-4" style="display:inline-block">가계부</h5>
                                </div>
                                <div class="form-group">
                                    <label for="parentInput">총 예산액</label>
                                    <input type="number" name="money" class="form-control" id="parentInput" aria-describedby="emailHelp" placeholder="현재 보유 금액을 입력해주세요.">
                                    <input type="hidden" name="id" value="${id}">
                                </div>
                                <div class="form-group">
                                    <label for="useMoney">현재 사용 금액</label>
                                </div>
                                <div class="form-group">
                                    <label for="changeMoney">남은 금액</label>
                                </div>
                                <div>
                                    <button type="submit" class="btn btn-block btn-outline-success">Submit</button>
                                </div>
                        </form>
                        </div>
                        `
                    }else{
                        console.log(2);
                        //지출내역은 있고 가계부는 없고
                        moneylist=`
                        <div class="col-md-6">
                            <form action="/create_process_allmoney" method="post">
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h5 class="mb-4" style="display:inline-block">가계부</h5>
                                </div>
                                <div class="form-group">
                                    <label for="parentInput">총 예산액</label>
                                    <input type="number" name="money" class="form-control" id="parentInput" aria-describedby="emailHelp" placeholder="현재 보유 금액을 입력해주세요.">
                                    <input type="hidden" name="id" value="${id}">
                                </div>
                                <div class="form-group">
                                    <label for="useMoney">현재 사용 금액</label>
                                    ${usecost}
                                </div>
                                <div class="form-group">
                                    <label for="changeMoney">남은 금액</label>
                                </div>
                                <div>
                                <button type="submit" class="btn btn-block btn-outline-success">Submit</button>
                                </div>
                            </form>
                        </div>
                    `
                    }
                }else{
                    //지출내역은 없고 가계부는 있고
                    if(costresults[0]== undefined){
                        console.log(3);
                        moneylist=`
                        <div class="col-md-6">
                            <form action="/create_process_allmoney" method="post">
                            
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h5 class="mb-4" style="display:inline-block">가계부</h5>
                                </div>
                                <div class="form-group">
                                    <label for="parentInput">총 예산액</label>
                                    <input type="number" name="money" class="form-control" id="parentInput" aria-describedby="emailHelp" placeholder="${allmoney}.">
                                    <input type="hidden" name="id" value="${id}">
                                </div>
                                <div class="form-group">
                                    <label for="useMoney">현재 사용 금액</label>
                                </div>
                                <div class="form-group">
                                    <label for="changeMoney">남은 금액</label>
                                </div>
                                <div>
                                <button type="submit" class="btn btn-block btn-outline-success">Submit</button>
                                </div>
                            </form>
                        </div>
                    `
                    //지출내역도 있고 가계부도 있고
                    }else{
                        console.log(4)
                        moneylist=`
                        <div class="col-md-6">
                            <form action="/create_process_allmoney" method="post">
                            
                                <div class="heading-section mb-4 my-5 my-md-0">
                                    <h5 class="mb-4" style="display:inline-block">가계부</h5>
                                </div>
                                <div class="form-group">
                                    <label for="parentInput">총 예산액</label>
                                    <input type="number" name="money" class="form-control" id="parentInput" aria-describedby="emailHelp" placeholder="${allmoney}.">
                                    <input type="hidden" name="id" value="${id}">
                                </div>
                                <div class="form-group">
                                    <label for="useMoney">사용 금액 </label>
                                    ${usecost}
                                </div>
                                <div class="form-group">
                                    <label for="changeMoney">남은 금액</label>
                                    ${allmoney-usecost}
                                </div>
                                <div>
                                    <button type="submit" class="btn btn-block btn-outline-success">Submit</button>
                                </div>
                            
                        </form>
                    </div>
                    `
                    }
                }
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
                                        <li class="nav-item"><a href="/login" class="nav-link">User</a></li>
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
                                        <h2 class="mb-4">Account Service</h2>
                                    </div>
                                </div>
                            </div>
                        </section>
                
                        <section class="ftco-section" style="padding-top:25px">
                            <div class="container">
                                <div class="row">
                                    ${moneylist}
                                    <div class="col-md-6">
                                        <div class="heading-section mb-4 my-5 my-md-0">
                                            <h5 class="mb-4" style="display:inline-block">지출내역</h5>
                                        </div>
                                        <form action="/create_process_allcost" method="post">
                                            <div class="form-group">
                                                <label for="payPlace">지출 장소</label>
                                                <input type="text" class="form-control" id="payPlace" name="place"  aria-describedby="emailHelp" " placeholder="지출 장소를 입력해주세요.">
                                            </div>
                                            <div class="form-group">
                                                <label for="payMoney">지출 금액</label>
                                                <input type="text" class="form-control" id="payMoney" 
                                                name="pay" aria-describedby="emailHelp" placeholder="지출 금액을 입력해주세요.">
                                            </div>
                                            <input type="hidden" name="id" value="${id}">
                                            <button type="submit" class="btn btn-block btn-outline-success">Submit</button>
                                        </form>
                                        ${costlist}
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
    
});

app.post('/create_process_allcost', function(request, response) { 
    var body='';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id =post.id;
        connection.query(`
          INSERT INTO cost1 (id, location, costmoney, created ) 
            VALUES(?, ?, ?, NOW())`,
          [post.id, post.place, post.pay ], 
          function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/moneybook/${id}`});
            response.end();
          }
        )
    });
}); 

app.post('/create_process_allmoney', function(request, response) { 
    var body='';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id =post.id;
        connection.query(`
          INSERT INTO allmoney1 (id, allmoney) 
            VALUES(?, ?)`,
          [post.id, post.money], 
          function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/moneybook/${id}`});
            response.end();
          }
        )
    });
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
                            <li class="nav-item"><a href="/login" class="nav-link">User</a></li>
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

app.get('/cycle/:cid', function(request, response) { 
    var cid = request.params.cid;
    connection.query('SELECT * FROM Content WHERE idx='+cid, 
//sql 쿼리문
        function (error, results, fields) {
        if (error) {
            console.log(error)
        }
        console.log(results);
        
        var x = results[0].mapx;
        var y = results[0].mapy;

        x=parseFloat(x);
        y=parseFloat(y);
        var x_1 = x-0.009;
        var x_2;
        parseFloat(x_2);
        x_2 = x+0.009;
        var y_1 = y-0.009;
        var x_2;
        parseFloat(y_2);
        var y_2 = y+0.009;

        // 9999 is test numer 경복궁
        connection.query('SELECT * FROM cycle WHERE x >='+x_1+' AND x <='+x_2+' AND y>='+y_1+' AND y<='+y_2, 
            function (error, results, fields) {
                if (error) throw error;
                _results = results;
                var list = `  `;
                var i = 0;
                while( i < _results.length){
                    list = list + `var marker = new Tmapv2.Marker({
                        position: new Tmapv2.LatLng(`;
                    list = list + `${_results[i].y}`;
                    list = list + `, ${_results[i].x}` 
                    list = list +` ), 
                        //Marker의 중심좌표 설정.
                        icon: "/css/bikemap.png",
                        map: map //Marker가 표시될 Map 설정.
                    });`
                    list = list + `
                    `;
                    i = i + 1;
                };
                //마커 찍기 위한 tmap 스크립트 코드 생성
                console.log(list);
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
                                        // Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
                                        map = new Tmapv2.Map("map_div",  // "map_div" : 지도가 표시될 div의 id
                                        {
                                            center: new Tmapv2.LatLng(${y},${x}), // 지도 초기 좌표
                                            width: "100%", // map의 width 설정
                                            height: "400px" // map의 height 설정
                                        });
                                        ${list};
                                        map.setZoom(15);
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
                                    <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
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
                                    <h2 class="mb-4">Local Bike</h2>
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
                                <li class="nav-item"><a href="/login" class="nav-link">User</a></li>
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