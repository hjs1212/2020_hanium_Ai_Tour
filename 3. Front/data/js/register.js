/**$(".login-form").validate({
    rules: {
      username: {
        required: true,
        minlength: 4
      },     
      email: {
        required: true,
        email:true
      },
      password: {
        required: true,
        minlength: 5
      },
      cpassword: {
        required: true,
        minlength: 5,
        equalTo: "#password"
      }
    },
    //For custom messages
    messages: {
      username:{
        required: "Enter a username",
        minlength: "Enter at least 4 characters"
      }
    },
    errorElement : 'div',
    errorPlacement: function(error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
  });**/

  $(document).ready(function(){
    $("#SignUP").click(function(){
        var json = {
            m_id : $("#username").val(),
            m_pw : $("password").val()
        };
        
        for(var str in json){
            if(json[str].length == 0){
                alert($("#" + str).attr("placeholder") + "를 입력해주세요.");
                $("#" + str).focus();
                return;
            }
        }
        
         $.ajax({
            type : "post",
            url : "${pageContext.request.contextPath}/idCheck.do",
            data : json,
            success : function(data) {
                switch (Number(data)) {
                case 0:
                    alert("정상적으로 회원가입 되었습니다.");
                    window.location.href = "/demo";
                    break;
                case 1:
                    alert("아이디가 중복 되었습니다.");
                    break;
                default:
                    alert("알수없는 오류가 발생 했습니다. [Error Code :" + Number(data) + "]");
                    break;
                }
            },
            error : function(error) {
                alert("오류 발생"+ error);
            }
        });
    });
});