<template>
  <div class="popup" v-if="toggleFlag">
      <div class="alert  animated bounceIn">
        <div class="alert-title"><span>提示</span><i class="iconfont icon-x" @click="close"></i></div>
        <div class="message">
          <p>{{alertMessage}}</p>
        </div>
        <div class="alert-btns"><span @click="close" v-show="showCancel">取消</span><span @click="confirm">确定</span></div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'alert',
    data() {
      return {
        toggleFlag: false,
      };
    },
    props: ['alertMessage'],
    computed: {
      showCancel() {
        return this.alertMessage === '确认删除此问卷？';
      },
    },
    methods: {
      close() {
        this.toggleFlag = false;
      },
      confirm() {
        this.toggleFlag = false;
        if (this.alertMessage === '确认删除此问卷？') {
          this.$parent.$emit('confirm');
        }
      },
      show() {
        this.toggleFlag = true;
      },
    },
    mounted() {
      this.$on('showAlert', this.show);
    },
  };

</script>
<style lang="scss" scoped>
  .popup {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 110;
  }
  
  .alert {
    width: 600px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -300px;
    border: 1px solid #999;
    .alert-title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      padding: 0 30px;
      background: #3ccab2;
      color: #fff;
      font-size: 20px;
      >span {
        float: left;
      }
      .icon-x {
        float: right;
        cursor: pointer;
        transition: all .2s ease;
        &:hover {
          transform: rotate(90deg);
        }
      }
      .icon-x:before {
        content: "\e62a";
        font-size: inherit;
        font-size: 20px;
      }
    }
    .message {
      width: 100%;
      height: 200px;
      box-sizing: border-box;
      padding: 0 60px;
      text-align: center;
      font-size: 20px;
      word-wrap: break-word;
      >p {
        display: inline-block;
        vertical-align: middle;
      }
      &:before {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .alert-btns {
      float: right;
      >span {
        display: inline-block;
        margin: 0 50px 30px 0;
        padding: 10px 30px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 3px 6px #999;
        background: #ef5b8d;
        cursor: pointer;
      }
    }
  }

</style>
