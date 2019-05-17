function fillWidth(targetElement, targetWidth, speedMultiplicator){
    let currentWidth = 0;
    
    let timer = setInterval(()=>{
      targetElement.style.width=currentWidth+"px";
      currentWidth += 3 * speedMultiplicator / 100;
      if (currentWidth >= targetWidth) clearInterval(timer);
    },20)
  }




  
  function backgroundAnimation(){
    let obj = document.querySelector("body");
    let step = 1/20;
    let value = 100

    let timer = setInterval(()=>{
       obj.style.backgroundSize = value+"%";
       value += step;
       if(value>=130) step = -1/20;
       if(value<=101) step = 1/20;   
      },50)
  }

  function backgroundPosition(){
    let bg = document.querySelector("body");
    let front = document.querySelector("body .bg_front");
    let back = document.querySelector("body .bg_back");
    let x,y;
    let a = Math.floor(window.scrollY + window.innerHeight/2);
    let b = Math.floor(window.scrollX + window.innerWidth/2);
    bg.onmousemove=(event)=>{
        
        x = event.pageX;
        y = event.pageY;
      
        /* front.style.backgroundPositionX = (a-y/40)+'px';
        front.style.backgroundPositionY = (b+140-x/40)+'px';
        back.style.backgroundPositionX = (-x/20)+'px';
        back.style.backgroundPositionY = (y/20)+'px'; */
    };
    setInterval(()=>{ 
    front.style.backgroundPositionX = (350-a-y/40)+'px'; 
    front.style.backgroundPositionY = (-x/40)+'px';
    back.style.backgroundPositionX = (-x/20)+'px';
    back.style.backgroundPositionY = (-100-y/20)+'px';},50)

  }

  function menuli(){
  $('.menuli').css('background-color','');
}