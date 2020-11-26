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

app.get('/moneybook/:id', function(request, response) { 
    var id = request.params.id;
    var usecost = 0;
    connection.query('SELECT * FROM cost WHERE id='+id, 
    //sql 쿼리문
    //costresult 지출장소,지출금액
        function (error, costresults, fields) {
        if (error) {
            console.log(error)
        }
        connection.query('SELECT * FROM allmoney WHERE id='+id, 
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
          INSERT INTO cost (id, location, costmoney, created ) 
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
          INSERT INTO allmoney (id, allmoney) 
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
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})