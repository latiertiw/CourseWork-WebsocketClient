
var state = {
  loginStatus: null,
  loginedName:null,
  openedMenu:"main",
}

var socket = new WebSocket("ws://localhost:8080/project_war_exploded/my");

 
          socket.onopen = function() {
              document.querySelector('.wrapper .statusBlock').innerHTML='CONNECTED'
          };
 

          socket.onclose = function(event) {
              if (event.wasClean) {
                document.querySelector('.wrapper .statusBlock').innerHTML='CONNECTION CLOSED'
              } else {
                document.querySelector('.wrapper .statusBlock').innerHTML='CONNECTION BROKEN'
              }
          };


          socket.onmessage = function(event) {
              var logarea = document.getElementById("consoleOutput");
              logarea.value = event.data+" "+logarea.value;
              let packet = JSON.parse(event.data);

              if(packet.key=="login_admin"){
                alert("Logined as admin");
                $(".loginBlock").toggle(300);
                $("main .menuBlock").toggle(300);
                $("main .adminMenu").toggle(300);
                $(" .menuAutorisationStatus").text(()=>{return packet.data})
                $(" .menuName").text(()=>{return "МЕНЮ АДМИНИСТРАТОРА"})
                state.loginStatus = "admin";
                state.loginedName = `${packet.data}`;
                state.openedMenu = "admin_menu"

              }
              if(packet.key=="login_user"){
                alert("Logined as user");
                
                $(".loginBlock").toggle(300);
                $("main .menuBlock").slideToggle(300);
                $("main .userMenu").toggle(300);
                $(" .menuAutorisationStatus").text(()=>{return packet.data})
                $(" .menuName").text(()=>{return "МЕНЮ ПОЛЬЗОВАТЕЛЯ"})
                state.loginStatus = "user";
                state.loginedName = `${packet.data}`;
                state.openedMenu = "user_menu"
              }
              if(packet.key=="wrong_login_data"){
                alert("Неправильное имя пользователя или пароль");
              }
              if(packet.key=="wrong_registration_data"){
                alert("Пользователь с таким логином уже существует");
              }
              if(packet.key=="successful_registration"){
                alert("Пользователь успешно зарегистрирован");
                backToLogin();
              }
          };


          socket.onerror = function(error) {
            document.querySelector('.wrapper .statusBlock').innerHTML='ERROR'
          };
 


  document.addEventListener("DOMContentLoaded", ready);
  function ready(){
      $("main .consoleBlock").toggle(0);
      $("main .registrationBlock").toggle(0);
      $("main .menuBlock").toggle(0);
      $("main .adminMenu").toggle(0);
      $("main .userMenu").toggle(0);
      $(" .wrapper").toggle(0);
      $(" .wrapper").toggle(600);
    }
    

  function backToLogin(){  // Выход из блока регистрации
      $("main .registrationBlock").toggle(200);
      $("main .loginBlock").toggle(200);
      $(":password").css("border","2px solid rgba(0, 0, 0, 0.424)");
  }

  function exitFromMenu(){ // Выход из рабочего меню в меню авторизации
      $(".loginBlock").slideToggle(400);
      $("main .menuBlock").slideToggle(150);
      setTimeout(()=>{
        if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
        else $("main .userMenu").toggle(200);
        $(" .menuAutorisationStatus").text(()=>{return "Не авторизирован"})
        $(" .menuName").text(()=>{return "Не авторизирован"})
      },450)
      state.loginStatus = null;
      state.loginedName = null;
      state.openedMenu = "main"
  }





  function registration() { // Переключение между блоком регистрации и логина
    $("main .registrationBlock").toggle(200);
    $("main .loginBlock").toggle(200);
  }





  function toogleConsole(){
    $("main .consoleBlock").slideToggle(300);
  }

  function cleanConsole(){
    var logarea = document.getElementById("consoleOutput");
    logarea.value =  " ";
  }

  function cleanConsole(){
    var logarea = document.getElementById("consoleOutput");
    logarea.value =  " ";
  }

  function sendConsoleMessage() {
    var data = document.getElementById("consoleInput").value;
    socket.send(data);
  }





   

  function sendAutorisation() { // Отправить запрос авторизации
       let obj = {}
       let data ={}
       obj.key = 'login';

       data.login = $("#loginInput").attr('value');
       data.password = $("#passwordInput").attr('value');
       data = JSON.stringify(data);
       obj.data=data;
       obj = JSON.stringify(obj);
       socket.send(obj);
  }

  function sendRegistration() { // Отправить запрос регистрации
      let obj = {}
      let data ={}
      obj.key = 'registration';

      data.login = $("#loginInputR").attr('value');
      data.password = $("#passwordInputR1").attr('value');
      data.passwordRepeat = $("#passwordInputR2").attr('value');

      if(data.password==data.passwordRepeat){
        $(":password").css("border","2px solid rgba(0, 0, 0, 0.425)");
       data = JSON.stringify(data);
       obj.data=data;
       obj = JSON.stringify(obj);
       socket.send(obj);
      }
      else{
        $(":password").css("border","2px solid rgb(197, 112, 112)");
        setTimeout(()=>{
          alert("Несовпадение паролей")
        },10);
       
      }
  }
     

     


   
    


    


    
    


    



    


    