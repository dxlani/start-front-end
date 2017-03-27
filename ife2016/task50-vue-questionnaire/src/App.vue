<template>
  <div class="app" v-cloak>
    <header>
      <router-link to="/">
        <i class="iconfont icon-wen"></i>
        <h1>简问卷</h1>
      </router-link>
      <router-link to="/list">
        <h2>我的问卷</h2>
      </router-link>
      <router-link to="/newqn">
        <h2>新建问卷</h2>
      </router-link>
    </header>
    <transition enter-active-class="animated zoomIn">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  // watch[qnss]存入localStorage
  const STORAGE_KEY = 'questionaire-by-vuejs';

  function saveLocal(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  export default {
    name: 'app',
    computed: {
      state() {
        return this.$store.state;
      },
    },
    watch: {
      state: {
        handler(state) {
          saveLocal(state);
        },
        deep: true,
      },
    },
  };

</script>
<style lang="scss">
  body,
  div,
  h1,
  h2,
  h3,
  h4,
  form,
  input,
  img,
  ul,
  ol,
  li,
  dl,
  dt,
  dd,
  p {
    margin: 0;
    padding: 0;
  }
  
  li {
    list-style: none;
  }
  
  a {
    text-decoration: none;
  }
  
  html,
  body {
    width: 100%;
    height: 100%;
    background: #efefef;
  }
  
  @font-face {
    font-family: "iconfont";
    src: url('./fonts/icons/iconfont.eot?t=1484105018974');
    /* IE9*/
    src: url('./fonts/icons/iconfont.eot?t=1484105018974#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('./fonts/icons/iconfont.woff?t=1484105018974') format('woff'), /* chrome, firefox */
    url('./fonts/icons/iconfont.ttf?t=1484105018974') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    url('./fonts/icons/iconfont.svg?t=1484105018974#iconfont') format('svg');
    /* iOS 4.1- */
  }
  
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  [v-cloak] {
    display: none;
  }
  
  .app {
    font-family: "Microsoft Yahei", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    color: #000;
    overflow: auto;
    position: relative;
    >header {
      position: fixed;
      z-index: 100;
      left: 0;
      top: 0;
      background: #42b983;
      width: 100%;
      height: 50px;
      line-height: 50px;
      a {
        height: 100%;
        display: inline-block;
        color: #fff;
        h1,
        h2 {
          font-weight: 400;
          margin-left: 20px;
        }
        .icon-wen:before {
          content: "\e80b";
          font-size: 40px;
          color: #fff;
          vertical-align: middle;
          margin-left: 20px;
        }
        h1 {
          font-size: 25px;
          display: inline;
          vertical-align: sub;
        }
        h2 {
          font-size: 16px;
        }
      }
    }
  }

</style>
