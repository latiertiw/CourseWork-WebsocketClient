
var state = {
  loginStatus: null,
  loginedName:null,
  openedMenu:"main",
  responseTime:0,
  responseStatus :false
}

var socket = new WebSocket("ws://localhost:8085/app");

          setInterval(()=>{
            let obj = {}
            let data = {}
            obj.key = 'test'
            obj.data = 'test';
            obj=JSON.stringify(obj);
            socket.send(obj);
          },1000);

          let timer = setInterval(()=>{
            state.responseTime += 1;
            if(state.responseTime>=3){
              state.responseStatus = false; 
            }
            if(state.responseStatus==false){
              $(".banner").show();
              clearInterval(timer);
            }
          },1000)

          socket.onopen = function() {
            
              document.querySelector('.wrapper .statusBlock').innerHTML='CONNECTED'
          };
 
          socket.onclose = function(event) {
              if (event.wasClean) {
                document.querySelector('.wrapper .statusBlock').innerHTML='CONNECTION CLOSED'
              } else {
                document.querySelector('.wrapper .statusBlock').innerHTML='CONNECTION BROKEN'
              }
              state.responseStatus = false;
          };

          socket.onmessage = function(event) {
              var logarea = document.getElementById("consoleOutput");
              logarea.value = event.data+" "+logarea.value;
              let packet = JSON.parse(event.data);

              if(packet.key=="test"){
                if($(".banner").is(":visible")){
                  $(".banner").fadeToggle(550);
                  setTimeout(()=>{
                    $(".banner").hide();
                  },350)
                }
                state.responseTime=0;
                state.responseStatus = true;
              }
              if(packet.key=="login_admin"){
                alert("Logined as admin");
                $(".loginBlock").toggle(300);
                $("main .menuBlock").slideToggle(300);
                $("main .adminMenu").slideToggle(100);
                $(" .menuAutorisationStatus").text(()=>{return packet.data})
                $(" .menuName").text(()=>{return "МЕНЮ АДМИНИСТРАТОРА"})
                state.loginStatus = "admin";
                state.loginedName = `${packet.data}`;
                state.openedMenu = "admin_menu"

              }
              if(packet.key=="login_expert"){
                alert("Logined as expert");
                $(".loginBlock").toggle(300);
                $("main .menuBlock").slideToggle(300);
                $("main .expertMenu").toggle(300);
                $(" .menuAutorisationStatus").text(()=>{return packet.data})
                $(" .menuName").text(()=>{return "МЕНЮ ЭКСПЕРТА"})
                state.loginStatus = "expert";
                state.loginedName = `${packet.data}`;
                state.openedMenu = "expert_menu"

              }
              if(packet.key=="login_client"){
                alert("Logined as client");
                
                $(".loginBlock").toggle(300);
                $("main .menuBlock").slideToggle(300);
                $("main .clientMenu").toggle(300);
                $(" .menuAutorisationStatus").text(()=>{return packet.data})
                $(" .menuName").text(()=>{return "МЕНЮ КЛИЕНТА"})
                state.loginStatus = "client";
                state.loginedName = `${packet.data}`;
                state.openedMenu = "client_menu"
              }
              if(packet.key=="successful_add_goal"){
                alert("Заказ успешно добавлен");
                exitToMenu();
              }
              if(packet.key=="wrong_add_goal"){
                alert("Заказ с таким номером уже существует");
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
                  for(let j = 0; j < 7; j += 1 ){
                    if(j<6){
                    let td = document.createElement("td");
                    td.className = "tableTd";
                    td.innerHTML = info[j];
                    tr.append(td);
                    }
                    else{
                    if(state.loginStatus=="admin"){
                    let td = document.createElement("td");
                    td.className = "buttonTd";
                    
                    td.onclick = (event)=>{
                      let a = event.target;
                      a.parentNode.style.display = "none";
                      deleteGoal(info[0]);
                      //alert("del");
                    }
                    tr.append(td);
                      }
                    }
                  }
                  $('.goalsTable .tableTable').append(tr);
                }
                toggleGoalsMenu();
              }
              if(packet.key=="real_goals_data"){
                document.querySelector(".realGoalsTable .tableTable").innerHTML = " ";
                let data = JSON.parse(packet.data);
                for(let i = 0; i < data.length; i += 1){
                  let info = [];
                  info[0]=data[i].number; info[1]=data[i].legend;
                  let tr = document.createElement("tr");
                  tr.className = 'tableTr';
                  for(let j = 0; j < 2; j += 1 ){
                    if(j<2){
                    let td = document.createElement("td");
                    td.className = "tableTdReal ";
                    td.innerHTML = info[j];
                    tr.append(td);
                    }
                    else{
                    if(state.loginStatus=="admin"){
                    let td = document.createElement("td");
                    td.className = "buttonTd";
                    
                    td.onclick = (event)=>{
                      let a = event.target;
                      a.parentNode.style.display = "none";
                      alert("del");
                    }
                    tr.append(td);
                      }
                    }
                  }
                  $('.realGoalsTable .tableTable').append(tr);
                }
                toggleRealGoalsMenu();
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
                alert("Заказ успешн удалена");
                $(".deleteGoalMenu .inputContainer .inputs .defaultInput").attr('value',"");
              }
              if(packet.key=="wrong_delete_goal"){
                alert("Заказа с таким номером нет");
              }
              if(packet.key=="wrong_delete_order"){
                alert("Заказа на такой товар нет");
              }
              if(packet.key=="successful_delete_order"){
                alert("Заказ успешно удален");
                //$(".deleteGoalMenu .inputContainer .inputs .defaultInput").attr('value',"");
              }
              if(packet.key=="wrong_toggle_redact"){
                alert("Товара с таким номером нет");
              }
              if(packet.key=="successful_toggle_redact"){
                $("main .redactGoalMenu").children().first().slideToggle(200);
                $("main .redactGoalMenu").children().last().slideToggle(200);
                state.openedMenu="redact_goal";

                data = JSON.parse(packet.data);
                $("main .redactGoalMenu").children().last().children().eq(1).children().eq(0).attr('value',data.number);
                $("main .redactGoalMenu").children().last().children().eq(1).children().eq(1).attr('value',data.name);
                $("main .redactGoalMenu").children().last().children().eq(1).children().eq(2).attr('value',data.legend);
                $("main .redactGoalMenu").children().last().children().eq(1).children().eq(3).attr('value',data.cost_opt);
                $("main .redactGoalMenu").children().last().children().eq(1).children().eq(4).attr('value',data.cost_per_kg);
                $("main .redactGoalMenu").children().last().children().eq(1).children().eq(5).attr('value',data.count);
              }
              if(packet.key=="wrong_redact"){
                alert("Товар с таким номером уже есть");
              }
              if(packet.key=="successful_redact"){
                alert("Успешное редактирование");
              }
              if(packet.key=="wrong_add_order"){
                alert("Товара с таким номером не существует");
              }
              if(packet.key=="wrong_add_order_alt"){
                alert("Заказ с таким номером уже есть");
              }
              if(packet.key=="successful_add_order"){
                alert("Заказ добавлен");
              }
              if(packet.key=="orders_data"){
                let data = JSON.parse(packet.data);

                document.querySelector(".getOrdersMenu .ordersTable .tableTable").innerHTML = " ";

                for(let i = 0; i < data.length; i += 1){
                  let info = [];
                  info[0]=data[i].number; info[1]=data[i].name;
                  info[2]=data[i].count;
                  let tr = document.createElement("tr");
                  tr.className = 'tableTr';
                  for(let j = 0; j < 3; j += 1 ){
                    let td = document.createElement("td");
                    td.className = "tableTd";
                    td.innerHTML = info[j];
                    tr.append(td);
                  }
                    
                  $('.getOrdersAdminMenu .ordersTable .tableTable').append(tr);
                  let trc = document.createElement("tr");
                  trc = tr.cloneNode('deep');
                  $('.getOrdersMenu .ordersTable .tableTable').append(trc);
                  
                }
                if(state.loginStatus=="client"){toggleOrdersMenu();}
                else{}
              }
              if(packet.key=="orders_admin_data"){
                let data = JSON.parse(packet.data);
                document.querySelector(".getOrdersAdminMenu .ordersTable .tableTable").innerHTML = " ";
                
                for(let i = 0;i<data.length;i+=1 ){
                  setTimeout(()=>{
                    let tr = document.createElement("tr");
                    tr.className = 'tableTr';
                    let td = document.createElement("td");
                    td.className = "tableTd";
                    td.style.border="4px solid  rgba(53, 90, 252, 0.726) ";
                    td.innerHTML = "Клиент: "+data[i].login;
                    tr.append(td);
                    $('.getOrdersAdminMenu .ordersTable .tableTable').append(tr);
                    sendOrdersRequestAlt(data[i].login);
                  },i*30
                  )
                }
                toggleOrdersAdminMenu();
              }
              if(packet.key=="orders_expert_data"){
                let data = JSON.parse(packet.data);
                //console.log(data);

                document.querySelector(".getOrdersAdminMenu .ordersTable .tableTable").innerHTML = " ";
                
                let resmas = [];

                
                for(let i = 0; i < data.length; i += 1){
                  for(let j = 0; j < data[i].orders.length; j += 1){
                    resmas.push(Object.assign({},data[i].orders[j]))
                  }
                }


                let rmas = [];

                let  t = 0;
                for(let i = 0; i < resmas.length; i += 1){
                  t = 0;
                  for(let j = 0; j < rmas.length; j += 1){
                    if(rmas[j].number == resmas[i].number) t = 1;
                  }
                  if(t == 0) {
                    rmas.push(Object.assign({},resmas[i]))
                    rmas[i].count = 0;
                  }
                }

                for (let i = 0; i< rmas.length;i+=1){
                  for (let j = 0; j< resmas.length;j+=1){
                    if(rmas[i].number == resmas[j].number) {
                      rmas[i].count += resmas[j].count;
                    }
                  }
                } 
                

                for(let i = 0; i < rmas.length; i += 1){
                  let info = [];
                  info[0]=rmas[i].number; info[1]=rmas[i].name;
                  info[2]=rmas[i].count;
                  let tr = document.createElement("tr");
                  tr.className = 'tableTr';
                  for(let j = 0; j < 3; j += 1 ){
                    let td = document.createElement("td");
                    td.className = "tableTd";
                    td.innerHTML = info[j];
                    tr.append(td);
                  }
                  $('.getOrdersAdminMenu .ordersTable .tableTable').append(tr);
                }
                 
                
                toggleOrdersAdminMenu();
              }
              if(packet.key=="successful_add_mark"){
                alert("Оценка успешно добавлена");
              }
              if(packet.key=="wrong_add_mark"){
                alert("Цели с таким номером не существует");
              }
              if(packet.key=="opt_taskk"){
                data = JSON.parse(packet.data);
                document.querySelector(".optTask .ordersTable .tableTable").innerHTML = " ";


                for(let i = 0; i < data.length; i += 1){
                  let info = [];
                  info[0]=data[i].number; info[1]=data[i].name;
                  info[2]=data[i].value;
                  let tr = document.createElement("tr");
                  tr.className = 'tableTr';
                  for(let j = 0; j < 3; j += 1 ){
                    let td = document.createElement("td");
                    if(j==0){
                      td.className = "tableTd";
                    td.innerHTML = info[j];
                    }
                    if(j==1){
                      td.className = "tableTdReal";
                      td.innerHTML = info[j];
                    }
                    if(j==2){
                      td.className = "tableTd";
                      let border = document.createElement("div");
                      if(info[2]==0) border.style="border:1px solid red;"
                      let score = document.createElement("div");
                      score.style ="width:"+(info[2]*4)+"px;height:100%; background-color: rgb("+(255 -(info[2]*3)) +", "+(info[2]*info[2]) +", 0);"
                      fillWidth(score,info[2]*6,50)
                      border.className="tdOptBorder"
                      border.append(score);
                      td.append(border);
                    }
                    
                    tr.append(td);
                  }
                    
                  $('.optTask .ordersTable .tableTable').append(tr);
                 
                 
                  
                }




                toggleOptTaskMenu();
              }
              if(packet.key=="opt_task"){
                data = JSON.parse(packet.data);

                console.log(data);

                document.querySelectorAll(".optTask .threecontainer").innerHTML = " ";
                
                
                let scene = new THREE.Scene();
                let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

                let renderer = new THREE.WebGLRenderer();
                renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.7 );
                $('.optTask .threecontainer').append(renderer.domElement);



                let controls = new THREE.OrbitControls( camera, renderer.domElement );
				        controls.enableDamping = false;
                controls.dampingFactor = 0.25;
                controls.rotateSpeed = 0.35;
                controls.autoRotate = true;
                controls.autoRotateSpeed = 2;
               


                



                let geometry = new THREE.BoxGeometry( 1000, 0.1, 1000 );
                let material = new THREE.MeshBasicMaterial( { color: '#343D3D' } );
                let flat = new THREE.Mesh( geometry, material );
                scene.add( flat );
                

               

                camera.position.y = 4;
                camera.position.z = 10;
                //camera.lookAt(0,0,0);

                var o = 0;

                function animate() {

                  requestAnimationFrame( animate );
                  renderer.render( scene, camera );
                  controls.update();
                  camera.lookAt(o,3,0);
                 
                }
                animate();


                let value
                let name 
                let number

                let pos = 0;
                let colors = [
                  '#F8F159',
                  "#59F8CC",
                  "#597DF8",
                  "#56B87B",
                  "#BB1620",
                  "#40B2BF"
                ]

                for(let i = 0; i < data.length; i += 1){
                  let leg = document.createElement("div");
                  let color = document.createElement("div");
                  color.className='color';
                  color.style=`background:${colors[i]}`;
                  leg.className = 'leg';
                  let str = data[i].name.slice(0,50)  + " ...";
                  leg.innerHTML = " Цель:"+"<br/>"+str
                  leg.append(color);
                  $('.optTask .legcontainer').append(leg);

                }
               

                for(let i = 0; i < data.length; i += 1){
                   value = 1/(data[i].value);
                   value=value*1000;
                   console.log(value)
                   name = data[i].name;
                   number = data[i].number;
                   let color = colors[i];
                   let scale = 0;

                  
                   //value = Math.ceil(value/10);
                   value = value/10;
                   if(value>=0){
                   let geometry = new THREE.BoxGeometry( 1, value,1 );
                   let material = new THREE.MeshBasicMaterial( { color: color } );
                   let cube = new THREE.Mesh( geometry, material );
                   cube.position.x = pos;
                   cube.position.y = value/2;
                   scene.add(cube);
                   /* setTimeout(()=>{
                     cube
                     scale+=0.01;
                   },10) */
                   color += 0xF8F159;
                   pos += 2;
                   }

                   camera.position.x=data.length/2;
                   var o = data.length/2;
                }
                 
                  






                toggleOptTaskMenu();
              }
              if(packet.key=="successful_add_real_goal"){
                alert("Цель успешно добавлена");
                //exitToMenu();
              }
              if(packet.key=="wrong_add_real_goal"){
                alert("Цель с таким номером уже существует");
                //exitToMenu();
              }
              if(packet.key=="successful_delete_real_goal"){
                alert("Цель успешно удалена");
                //exitToMenu();
              }
              if(packet.key=="wrong_delete_real_goal"){
                alert("Цели с таким номером не существует");
                //exitToMenu();
              }
          };

          socket.onerror = function(error) {
            state.responseStatus = false;
            document.querySelector('.wrapper .statusBlock').innerHTML='ERROR'
          };
 



  document.addEventListener("DOMContentLoaded", ready);
  function ready(){
      $("main .consoleBlock").toggle(0);
      $("main .registrationBlock").toggle(0);
      $("main .menuBlock").toggle(0);
      $("main .addGoalMenu").toggle(0);
      $("main .adminMenu").toggle(0);
      $("main .clientMenu").toggle(0);
      $("main .expertMenu").toggle(0);
      $("main .getGoalsMenu").toggle(0);
      $("main .getRealGoalsMenu").toggle(0);
      $("main .deleteGoalMenu").toggle(0);
      $("main .redactGoalMenu").toggle(0);
      $("main .addOrderMenu").toggle(0);
      $("main .deleteOrderMenu").toggle(0);
      $("main .getOrdersMenu").toggle(0);
      $("main .getOrdersAdminMenu").toggle(0);
      $("main .addMarkMenu").toggle(0);
      $("main .optTask").toggle(0);
      $("main .addRealGoalMenu").toggle(0);
      $("main .deleteRealGoalMenu").toggle(0);
      $("main .redactGoalMenu").children().last().toggle(0);

      //
      /* $('.menuInfo').toggle(0); */
       
       setTimeout(()=>{
        let obj = {}
        let data ='test';
        obj.key = 'test';
        data = JSON.stringify(data);
        obj.data=data;
        obj = JSON.stringify(obj);
        socket.send(obj)
      },30)

      //backgroundAnimation();
      //backgroundPosition();  
        
    }
    

  function backToLogin(){  // Выход из блока регистрации
    $("#loginInput").attr('value',"");
    $("#passwordInput").attr('value',"");

    $("main .registrationBlock").toggle(200);
    $("main .loginBlock").toggle(200);
    $(".registrationBlock :password").css("border","2px solid rgb(218, 218, 218)");
  }

  function exitFromMenu(){ // Выход из рабочего меню в меню авторизации

      $("#loginInput").attr('value',"");
      $("#passwordInput").attr('value',"")

      $(".loginBlock").slideToggle(400);
      $("main .menuBlock").slideToggle(150);
      setTimeout(()=>{
        if(state.loginStatus=="admin"){$("main .adminMenu").toggle(0);}
        else if(state.loginStatus=="client") $("main .clientMenu").toggle(0);
        else if(state.loginStatus=="expert") $("main .expertMenu").toggle(0);
        $(" .menuAutorisationStatus").text(()=>{return "Не авторизирован"})
        $(" .menuName").text(()=>{return "Не авторизирован"})
        state.loginStatus = null;
        state.loginedName = null;
      },450)
     
      state.openedMenu = "main";
  }

  function exitToMenu(){
   

    if(state.openedMenu=="add_goal_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);} 
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .addGoalMenu").toggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="add_real_goal_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);} 
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .addRealGoalMenu").toggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="delete_real_goal_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);} 
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .deleteRealGoalMenu").toggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="get_goals_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .getGoalsMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="get_real_goals_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
      else if (state.loginStatus=="expert"){
        $("main .expertMenu").toggle(200);
        $("main .addMarkMenu").slideToggle(200);
      } 
      else $("main .clientMenu").toggle(200);
      $("main .getRealGoalsMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="delete_goal_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);} 
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .deleteGoalMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="redact_goal_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .redactGoalMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="redact_goal"){
      $("main .redactGoalMenu").children().first().slideToggle(200);
      $("main .redactGoalMenu").children().last().slideToggle(200);
      state.openedMenu="redact_goal_menu";
    }

    if(state.openedMenu=="add_order_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .addOrderMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="delete_order_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .deleteOrderMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="get_orders_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .getOrdersMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="get_orders_admin_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
      else if (state.loginStatus=="expert"){
        $("main .expertMenu").toggle(200);
      } 
      else {
        
        $("main .clientMenu").toggle(200);}
      $("main .getOrdersAdminMenu").slideToggle(200);
     
      state.openedMenu="main";
    }

    if(state.openedMenu=="add_mark_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);} 
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .addMarkMenu").slideToggle(200);
      state.openedMenu="main";
    }

    if(state.openedMenu=="opt_task_menu"){
      if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);} 
      else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
      else $("main .clientMenu").toggle(200);
      $("main .optTask").slideToggle(200);
      state.openedMenu="main";
      document.querySelector(".optTask .threecontainer").innerHTML = " ";
      document.querySelector(".optTask .legcontainer").innerHTML = " ";
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

       data.login = data.login.replace(/^\s+|\s+$/g, '')
       data.password = data.password.replace(/^\s+|\s+$/g, '')

       if (data.login && data.password) {

       data = JSON.stringify(data);
       obj.data=data;
       obj = JSON.stringify(obj);
       socket.send(obj);

       }
       else {
        alert("Заполните все поля ")
      }
  }

  function sendRegistration() { // Отправить запрос регистрации
      let obj = {}
      let data ={}
      obj.key = 'registration_client';
      if($('#checkreg').prop("checked")==true){
       obj.key="registration_expert"
      }

      data.login = $("#loginInputR").attr('value');
      data.password = $("#passwordInputR1").attr('value');
      data.passwordRepeat = $("#passwordInputR2").attr('value');

      data.passwordRepeat = data.passwordRepeat.replace(/^\s+|\s+$/g, '')
      data.login = data.login.replace(/^\s+|\s+$/g, '')
      data.password = data.password.replace(/^\s+|\s+$/g, '')

     if(data.login && data.password && data.passwordRepeat){
      if(data.password==data.passwordRepeat){
        $(".registrationBlock :password").css("border","2px solid rgb(218, 218, 218)");
        data = JSON.stringify(data);
        obj.data=data;
        obj = JSON.stringify(obj);
        
        socket.send(obj);
       
      }
      else{
        $(".registrationBlock :password").css("border","2px solid rgb(197, 112, 112)");
        setTimeout(()=>{
          alert("Несовпадение паролей")
        },10);
       
      }
    }
    else {
      alert("Заполните все поля ")
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

      data.number = data.number.replace(/^\s+|\s+$/g, '')
      data.cost_opt = data.cost_opt.replace(/^\s+|\s+$/g, '')
      data.count = data.count.replace(/^\s+|\s+$/g, '')
      data.cost_per_kg = data.cost_per_kg.replace(/^\s+|\s+$/g, '')
      
      if(data.number && data.name && data.legend && data.cost_opt && data.cost_per_kg && data.count){
     
      data = JSON.stringify(data);
      obj.data=data;
      obj = JSON.stringify(obj);
      socket.send(obj);
      }
      else{ alert("Заполните все поля")}
  }

  function addRealGoal() {
    let obj = {}
    let data ={}
    obj.key = 'add_real_goal';

    data.number = $(".addRealGoalMenu .inputContainer .inputs").children().eq(0).attr('value');
    data.legend = $(".addRealGoalMenu .inputContainer .inputs").children().eq(1).attr('value');
   
    data.number = data.number.replace(/^\s+|\s+$/g, '')
   
    if(data.number && data.legend){
    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    console.log(obj);
    socket.send(obj);
    }
    else{
      alert("Заполните все поля");
    }
  }

  function sendNewOrder() {
    let obj = {}
    let data ={}
    obj.key = 'add_order';

    data.number = $(".addOrderMenu .inputContainer .inputs").children().eq(0).attr('value');
    data.count = $(".addOrderMenu .inputContainer .inputs").children().eq(1).attr('value');
    data.name = state.loginedName;

    if(data.number && data.count) {

    
    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);

    }
    else {
      alert('Заполните все поля');
    }
  }

  function deleteOrder() {
    let obj = {}
    let data ={}
    obj.key = 'delete_order';

    data.number = $(".deleteOrderMenu .inputContainer .inputs").children().eq(0).attr('value');
    data.count = 0;
    data.name = state.loginedName;

    if(data.number){

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
    }
    else{
      alert('Заполните все поля')
    }
  }

  function deleteGoal(value){
    
    let obj = {}
    let data = {}
    obj.key = 'delete_goal';

    if(value == undefined) {
    data = $(".deleteGoalMenu .inputContainer .inputs").children().eq(0).attr('value');
    }
    else data = value;
    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
    
  }

  function deleteRealGoal(value){
    
    let obj = {}
    let data = {}
    obj.key = 'delete_real_goal';

    if(value == undefined) {
    data = $(".deleteRealGoalMenu .inputContainer .inputs").children().eq(0).attr('value');
    }
    else data = value;
    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    console.log(obj);
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

  function sendRealGoalsRequest() {
    let obj = {}
    let data = {}
    obj.key = 'real_goals_request';
   

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }

  function sendOrdersRequest() {
    let obj = {}
    let data = {}
    obj.key = 'orders_request';
    data=state.loginedName;

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }

  function sendOrdersRequestAlt(str) {
    let obj = {}
    let data = {}
    obj.key = 'orders_request';
    data=str;

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }

  function sendOrdersAdminRequest() {
    let obj = {}
    let data = {}
    obj.key = 'orders_admin_request';
   

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }

  function sendOrdersExpertRequest() {
    let obj = {}
    let data = {}
    obj.key = 'orders_expert_request';
   

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }

  function sendRedactGoal() {
    let obj = {}
    let data = {}
    obj.key = 'redact_goal';
   
    $("main .redactGoalMenu").children().first().slideToggle(200);
    $("main .redactGoalMenu").children().last().slideToggle(200);
    state.openedMenu="redact_goal_menu";
    
    data.number = $("main .redactGoalMenu").children().last().children().eq(1).children().eq(0).attr('value');
    data.name = $("main .redactGoalMenu").children().last().children().eq(1).children().eq(1).attr('value');
    data.legend = $("main .redactGoalMenu").children().last().children().eq(1).children().eq(2).attr('value');
    data.cost_opt =  $("main .redactGoalMenu").children().last().children().eq(1).children().eq(3).attr('value');
    data.cost_per_kg =  $("main .redactGoalMenu").children().last().children().eq(1).children().eq(4).attr('value');
    data.count = $("main .redactGoalMenu").children().last().children().eq(1).children().eq(5).attr('value'); 


    data.number = data.number.replace(/^\s+|\s+$/g, '')
    data.cost_opt = data.cost_opt.replace(/^\s+|\s+$/g, '')
    data.count = data.count.replace(/^\s+|\s+$/g, '')
    data.cost_per_kg = data.cost_per_kg.replace(/^\s+|\s+$/g, '')
    
    $("main .redactGoalMenu").children().last().children().eq(1).children().eq(0).attr('value','');
    $("main .redactGoalMenu").children().last().children().eq(1).children().eq(1).attr('value','');
    $("main .redactGoalMenu").children().last().children().eq(1).children().eq(2).attr('value','');
    $("main .redactGoalMenu").children().last().children().eq(1).children().eq(3).attr('value','');
    $("main .redactGoalMenu").children().last().children().eq(1).children().eq(4).attr('value','');
    $("main .redactGoalMenu").children().last().children().eq(1).children().eq(5).attr('value','');    
     

    if(data.number && data.name && data.legend && data.cost_opt && data.cost_per_kg && data.count){

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }
  else{ alert("Заполните все поля")}
  }

  function sendNewMark() {
    let obj = {}
    let data ={}
    obj.key = 'add_mark';

    data.number = $(".addMarkMenu .inputContainer .inputs").children().eq(0).attr('value');
    data.score = $(".addMarkMenu .inputContainer .inputs").children().eq(1).attr('value');
    data.name = state.loginedName;

    if(data.number && data.score){
    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
    }
    else{
      alert("Заполните все поля");
    }
  }
     
  function sendOptTaskRequest(){
    let obj = {}
    let data = {}
    obj.key = 'opt_task_request';
    data=state.loginedName;

    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
  }



  // ADMINMENUMETHODS
  {
  function toggleAddGoalMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .addGoalMenu").toggle(200);
    state.openedMenu="add_goal_menu";
  }

  function toggleAddRealGoalMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .addRealGoalMenu").toggle(200);
    state.openedMenu="add_real_goal_menu";
  }

  function toggleDeleteRealGoalMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .deleteRealGoalMenu").toggle(200);
    state.openedMenu="delete_real_goal_menu";
  }

  function toggleGoalsMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .getGoalsMenu").slideToggle(200);
    state.openedMenu="get_goals_menu";
  }

  function toggleRealGoalsMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .getRealGoalsMenu").slideToggle(200);
    state.openedMenu="get_real_goals_menu";
  }

  function toggleOrdersMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .getOrdersMenu").slideToggle(200);
    state.openedMenu="get_orders_menu";
  }

  function toggleOrdersAdminMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .getOrdersAdminMenu").slideToggle(200);
    state.openedMenu="get_orders_admin_menu";
  }

  function toggleDeleteGoalMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .deleteGoalMenu").slideToggle(200);
    state.openedMenu="delete_goal_menu";
  }

  function toggleRedactGoalMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
        else $("main .clientMenu").toggle(200);
    $("main .redactGoalMenu").slideToggle(200);
    state.openedMenu="redact_goal_menu";
  }

  function toggleAddOrderMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
    else $("main .clientMenu").toggle(200);
    $("main .addOrderMenu").slideToggle(200);
    state.openedMenu="add_order_menu";
  }

  function toggleDeleteOrderMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
    else $("main .clientMenu").toggle(200);
    $("main .deleteOrderMenu").slideToggle(200);
    state.openedMenu="delete_order_menu";
  }

  function toggleAddMarkMenu(){
    sendRealGoalsRequest();
    //if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    //else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
    //else $("main .clientMenu").toggle(200);
    $("main .addMarkMenu").slideToggle(200);
    //state.openedMenu="add_mark_menu";
  }

  function toggleRedact(){
    let obj = {}
    let data ={}
    obj.key = 'toggle_redact';

    data = $(".redactGoalMenu .inputContainer .inputs .defaultInput").attr('value');
    if(data){
    data = JSON.stringify(data);
    obj.data=data;
    obj = JSON.stringify(obj);
    socket.send(obj);
    }
    else(alert("Введите номер цели"))

  }

  function toggleOptTaskMenu(){
    if(state.loginStatus=="admin"){$("main .adminMenu").toggle(200);}
    else if (state.loginStatus=="expert"){$("main .expertMenu").toggle(200);} 
    else $("main .clientMenu").toggle(200);
    $("main .optTask").slideToggle(200);
    state.openedMenu="opt_task_menu";
  }
  }


   
    


    


    
    


    



    


    