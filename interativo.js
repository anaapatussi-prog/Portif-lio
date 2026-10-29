(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 let audioContext, soundEnabled=false, beepTimer;
 function stopSound(){clearTimeout(beepTimer);}
 function beep(){
  stopSound();
  if(!soundEnabled || document.hidden) return;
  const distance=Number($('distance').value);
  if(distance>70) return;
  if(audioContext?.state==='running'){
   const oscillator=audioContext.createOscillator(), gain=audioContext.createGain();
   oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.frequency.value=distance<25?880:660;
   const now=audioContext.currentTime;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.06,now+.01);gain.gain.linearRampToValueAtTime(0,now+.09);
   oscillator.start(now);oscillator.stop(now+.1);
  }
  beepTimer=setTimeout(beep,Math.max(150,distance*12));
 }
 function updateDistance(){
  const distance=Number($('distance').value);
  $('distance-value').textContent=distance+' cm';
  $('demo-car').style.left=(8+(150-distance)/145*62)+'%';
  const level=distance<25?'danger':distance<70?'warning':'safe';
  document.querySelector('.parking-scene').dataset.level=level;
  $('parking-status').textContent=level==='danger'?'Pare! Obstáculo muito próximo.':level==='warning'?'Atenção: aproximando do obstáculo.':'Distância confortável';
  beep();
 }
 $('distance').addEventListener('input',updateDistance);
 $('sound-toggle').addEventListener('click',async()=>{
  if(soundEnabled){soundEnabled=false;stopSound();}
  else {
   try {const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('unsupported');audioContext??=new Audio();await audioContext.resume();soundEnabled=true;}
   catch { $('sound-toggle').textContent='Som indisponível neste navegador';return; }
  }
  $('sound-toggle').setAttribute('aria-pressed',String(soundEnabled));$('sound-toggle').textContent=soundEnabled?'Desativar som':'Ativar som';beep();
 });
 document.addEventListener('visibilitychange',()=>document.hidden?stopSound():beep());
 window.addEventListener('pagehide',stopSound);
 let feeding=false;
 function updateFood(){
  const food=Number($('food').value);$('food-value').textContent=food+' g';$('food-fill').style.height=food+'%';
  $('food-status').textContent=feeding?'Liberando ração…':food<30?'Pouca ração! Confirme para abastecer.':'O pote está abastecido.';
  $('feed-button').disabled=feeding||food>=30;
 }
 $('food').addEventListener('input',updateFood);
 $('feed-button').addEventListener('click',()=>{
  if(feeding||Number($('food').value)>=30)return;
  feeding=true;$('food').disabled=true;$('gate').classList.add('open');$('food-stream').classList.add('flowing');updateFood();
  const timer=setInterval(()=>{
   $('food').value=Math.min(100,Number($('food').value)+5);updateFood();
   if(Number($('food').value)>=100){clearInterval(timer);feeding=false;$('food').disabled=false;$('gate').classList.remove('open');$('food-stream').classList.remove('flowing');updateFood();}
  },80);
 });
 const fingers=[...document.querySelectorAll('.finger')], leds=[...document.querySelectorAll('.demo-leds span')];
 function updateHand(){let count=0;fingers.forEach((button,index)=>{const on=button.getAttribute('aria-pressed')==='true';leds[index].classList.toggle('on',on);if(on)count++;});$('hand-status').textContent=count+' de 5 LEDs acesos';}
 fingers.forEach(button=>button.addEventListener('click',()=>{button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));updateHand();}));
 $('reset-hand').addEventListener('click',()=>{fingers.forEach(button=>button.setAttribute('aria-pressed','false'));updateHand();});
 updateDistance();updateFood();updateHand();
})();
