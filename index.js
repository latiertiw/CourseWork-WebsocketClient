
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
                $("main .menuBlock").slideToggle(300);
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
              if(packet.key=="successful_add_goal"){
                alert("Цель успешно добавлена");
                exitToMenu();
              }
              if(packet.key=="goals_data"){
                document.querySelector(".goalsTable .tableTable").innerHTML = " ";
                let data = JSON.parse(packet.data);
              
                for(let i = 0; i < data.length; i += 1){
                  let info = [];
                  info[0]=data[i].number; info[1]=data[i].name;
                  info[2]=data[i].legend; info[3]=data[i].cost_opt;
                  info[4]=data[i].cost_per_kg; info[5]=data[i].count;
                  let tr = document.createElement("tr");
                  tr.className = 'tableTr';
                  for(let j = 0; j < 6; j += 1 ){
                    let td = document.createElement("td");
                    td.className = "tableTd";
                    td.innerHTML = info[j];
                    tr.append(td);
                  }
                  $('.goalsTable .tableTable').append(tr);
                }
                toggleGoalsMenu();
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
              if(packet.key=="successful_delete_goal"){
                alert("Цель успешно удалена");
                
              }
              if(packet.key=="wrong_delete_goal"){
                alert("Цели с таким номером нет");
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
      $("main .addGoalMenu").toggle(0);
      $("main .adminMenu").toggle(0);
      $("main .userMenu").toggle(0);
      $("main .getGoalsMenu").toggle(0);
      $("main .deleteGoalMenu").toggle(0);
      
      //$(" .wrapper").fadeToggle(0);
      //$(" .wrapper").fadeToggle(000);
    }
    

  function backToLogin(){  // Выход из блока регистрации
    $("#loginInput").attr('value',"");
    $("#passwordInput").attr('value',"");

    $("main .registrationBlock").toggle(200);
    $("main .loginBlock").toggle(200);
    $(":password").css("border","2px solid rgba(0, 0, 0, 0.424)");
  }

  function exitFromMenu(){ // Выход из рабочего меню в меню авторизации

      $("#loginInput").attr('value',"");
      $("#passwordInput").attr('value',"")

      $(".loginBlock").slideToggle(400);
      $("main .menuBlock").slideToggle(150);
      setTimeout(()=>{
        if(state.loginStatus=="admin"){$("main .adminMenu").toggle(0);}
        else if(state.loginStatus=="user") $("main .userMenu").toggle(0);
        $(" .menuAutorisationStatus").text(()=>{return "Не авторизирован"})
        $(" .menuName").text(()=>{return "Не авторизирован"})
        state.loginStatus = null;
        state.loginedName = null;
      },450)
     
      state.openedMenu = "main";
  }

  function exitToMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else $("main .userMenu").toggle(200);

    if(state.openedMenu=="add_goal_menu"){
      $("main .addGoalMenu").toggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="get_goals_menu"){
      $("main .getGoalsMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="delete_goal_menu"){
      $("main .deleteGoalMenu").slideToggle(200);
      state.openedMenu="main";
    }
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

  function sendNewGoal() {
      let obj = {}
      let data ={}
      obj.key = 'add_goal';

      data.number = $(".addGoalMenu .inputContainer .inputs").children().eq(0).attr('value');
      data.name = $(".addGoalMenu .inputContainer .inputs").children().eq(1).attr('value');
      data.legend = $(".addGoalMenu .inputContainer .inputs").children().eq(2).attr('value');
      data.cost_opt = $(".addGoalMenu .inputContainer .inputs").children().eq(3).attr('value');
      data.cost_per_kg = $(".addGoalMenu .inputContainer .inputs").children().eq(4).attr('value');
      data.count = $(".addGoalMenu .inputContainer .inputs").children().eq(5).attr('value');
     
      data = JSON.stringify(data);
      obj.data=data;
      obj = JSON.stringify(obj);
      socket.send(obj);
  }

  function deleteGoal(){
    let obj = {}
    let data = {}
    obj.key = 'delete_goal';

    data = $(".deleteGoalMenu .inputContainer .inputs").children().eq(0).attr('value');

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }

  function sendGoalsRequest() {
    let obj = {}
    let data = {}
    obj.key = 'goal_request';
   

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }
     



  // ADMINMENUMETHODS

  function toggleAddGoalMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
        else $("main .userMenu").toggle(200);
    $("main .addGoalMenu").toggle(200);
    state.openedMenu="add_goal_menu";
  }

  function toggleGoalsMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
        else $("main .userMenu").toggle(200);
    $("main .getGoalsMenu").slideToggle(200);
    state.openedMenu="get_goals_menu";
  }

  function toggleDeleteGoalMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
        else $("main .userMenu").toggle(200);
    $("main .deleteGoalMenu").slideToggle(200);
    state.openedMenu="delete_goal_menu";
  }

     


   
    


    


    
    


    



    


    