<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="sass" scoped>
  @import './stylesheets/style.sass'
  #app
    width: 100%
    height: 100%

</style>

<style lang="scss">
.container-box {
  // container-form
  background-image: url('assets/modal/red.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 70%;
}
</style>