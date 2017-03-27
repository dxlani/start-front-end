<template>
  <div class="blank">
    <a class="new" href="#/newqn"><i class="iconfont icon-jia"></i>Get Start</a>
  </div>
</template>
<script>
  export default {
    name: 'blank',
    // 如果有数据跳列表页
    // beforeCreate() {
    //   if (this.$store.state.qnss.length !== 0) {
    //     this.$router.push({ path: '/list' });
    //   }
    // },
  };

</script>
<style lang="scss" scoped>
  .blank {
    width: 60%;
    height: 30%;
    margin: 10% auto;
    background: #fff;
    box-shadow: 0 5px 15px #999;
    border-radius: 5px;
    position: relative;
    .new {
      display: block;
      width: 120px;
      height: 40px;
      color: #fff;
      background: #f07600;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -20px;
      margin-left: -60px;
      text-align: center;
      line-height: 40px;
      border-radius: 3px;
      .icon-jia:before {
        content: "\e618";
        font-size: 24px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }

</style>
