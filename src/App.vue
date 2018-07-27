<template>
  <div id="app">
    <navigation></navigation>
    <div class='container'>
      <div class='container'>
      <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import Navigation from "./components/Navigation.vue";
  export default {
    components: {
      Navigation
    }
  };

</script>
<style>
  body {
    position: relative;
    display: table;
    width: 100%;
    height: 100%;
    background: url("./assets/bg_chess.jpg") no-repeat center center scroll;
    webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  #app {
    background: rgb(233, 236, 239);
    /* This is for ie8 and below */
    background: rgba(233, 236, 239, 0.6);
  }

</style>
