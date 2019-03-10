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
          };
          socket.onerror = function(error) {
            document.querySelector('.wrapper .statusBlock').innerHTML='ERROR'
          };
 





          
   function send() {
      var data = document.getElementById("consoleInput").value;
      socket.send(data);
     }

   function cleanConsole(){
     var logarea = document.getElementById("consoleOutput");
     logarea.value =  " ";
     }


    function toogleConsole(){
      $("main .consoleBlock").toggle(300);
    }

    document.addEventListener("DOMContentLoaded", ready);

    function ready(){
      $("main .consoleBlock").toggle(0);
      $(" .wrapper").toggle(0);
      $(" .wrapper .menuBlock").toggle(0);
      $(" .wrapper").toggle(600);
    }