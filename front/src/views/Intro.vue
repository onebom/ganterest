<template>
  <section class="wrap" @click="toMoviesPage">

    
    <div class="box">
      <h2 >이 영화 모야?</h2>
    </div>
    <div class="box" >
      <h2 >이 영화 모야?</h2>
    </div>
    
    <div class="circle"></div>
    
  </section>
</template>

<script>

export default {
  name : 'Intro',
  methods : {
    toMoviesPage : function(){
      this.$router.push({name : 'Movies' })
    }
  },
  mounted : function(){
    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if(mobileCheck){
      alert("모바일에서는 정상적으로 작동하지 않을 수 있습니다.\n이 페이지는 손가락을 대고 사진을 문질러보세요\n사진을 클릭하면 메인페이지로 넘어갑니다")
    }
  }
}

const html = document.documentElement

html.addEventListener("mousemove", function(e) {    
  html.style.setProperty('--x', e.clientX + 'px')
  html.style.setProperty('--y', e.clientY + 'px')
})

html.addEventListener("touchmove", function(e) {    
  //e.preventDefault();  
  html.style.setProperty('--x', e.touches[0].clientX + 'px')
  html.style.setProperty('--y', e.touches[0].clientY + 'px')
})

window.addEventListener("load", function(){
  html.style.setProperty('--x', 0)
  html.style.setProperty('--y', 0)
})

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap');

.wrap,
.box {
  position: absolute;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  display: flex;          /*this*/
  justify-content: center;/*this*/
  align-items: center;    /*this*/
  overflow: hidden;  
  cursor: pointer;
}

.box {
  background: url('../assets/Intro/nature-min.jpg');       /*this*/
  background-size: cover;       
  background-position: center;  
  background-attachment: fixed; 
  overflow: hidden;  
}

.box:nth-child(1) {
  filter: blur(8px);     
}

.box:nth-child(2) {   /*원 범위 움직이기*/
  clip-path: circle(150px at var(--x) var(--y)); /*보여줄 크기 at 원 중앙 지점*/
}
.box h2{  /*글자 움직이기*/
  font-family: 'Nanum Brush Script', cursive;
  color: #FFF;

  position: absolute; 
  transform: translate(calc(var(--x)/25), calc(var(--y)/25));
   /*calc()를 사용해 계산된 값을 사용할 수 있음*/
}

.circle {   /*[5]*/
  position: absolute;
  width: 300px;
  height: 300px;
  border: 2px solid #fff;
  border-radius: 50%;   /*50%로 설정하면 원모양이 됨!*/
  box-shadow: 0 5px 23px rgba(0,0,0,0.5);  /*그림자 주기*/
  top: -150px;
  left: -150px;
  transform: translate(var(--x),var(--y));  /*js에서 조작될 예정*/
}
</style>