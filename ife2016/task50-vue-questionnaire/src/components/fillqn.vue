<template>
  <div class="new-qn" v-if="fillQns">
    <h2 class="title">{{fillQns.title}}</h2>
    <hr>
    <div class="qnlist" v-for="(qn, index1) in fillQns.qns">
      <div><span>{{'Q' + (index1 + 1) + '：'}}</span><span class="qn-title">{{qn.question}}</span></div>
      <ul v-if="qn.type != 'textarea'">
        <li class="item" v-for="(item, index2) in qn.options" @click="clickInput($event)">
          <input class="type" type="radio" :name="'item' + index1" v-if="qn.type === 'radio'" :value="index2" :ref="'radio' + index1">
          <input class="type" type="checkbox" v-if="qn.type === 'checkbox'" :value="index2" :ref="'checkbox' + index1">
          <span class="options">{{qn.options[index2]}}</span>
        </li>
      </ul>
      <div v-if="qn.type === 'textarea'">
        <p>{{qn.options}}</p>
        <textarea class="textarea" :ref="'text' + index1"></textarea>
      </div>
    </div>
    <hr>
    <footer>
      <a class="btns" @click="saveFill"><span>提交问卷</span></a>
    </footer>
    <my-alert :alert-message="alertMessage" ref="myAlert">
      <my-alert>
  </div>
</template>
<script>
  export default {
    name: 'fillqn',
    data() {
      return {
        alertMessage: '',
      };
    },
    computed: {
      fillQns() {
        return this.$store.state.fillQns;
      },
    },
    methods: {
      saveFill() {
        // 提交问卷时获取value 这里没有通过commit改变了store里的数据
        const qns = this.fillQns.qns;
        for (let i = 0; i < qns.length; i += 1) {
          const rRef = `radio${i}`;
          const cRef = `checkbox${i}`;
          const tRef = `text${i}`;
          const item = this.$refs[rRef] || this.$refs[cRef] || this.$refs[tRef];
          if (item.length && item.length > 1) {
            // 如果有选择题未作答弹框提示 简答题就不强制了毕竟大家都这么懒
            const empty = item.filter(el => el.checked).length;
            if (empty === 0) {
              this.alertMessage = '还有问题未作答';
              this.$refs.myAlert.$emit('showAlert');
              return;
            }

            item.forEach((el, index) => {
              if (el.checked) {
                qns[i].value.push(index);
              }
            });
          } else {
            // 判断简答题是否为空
            const content = item[0].value && item[0].value.trim();
            if (content) {
              qns[i].value[0] += 1;
            }
          }
        }
        this.$store.commit('saveFill');
        this.$router.push('/list');
      },
      clickInput(event) {
        // event.target可能是li的子元素
        const check = event.target.querySelector('.type') || event.target.parentNode.querySelector('.type');
        check.checked = !check.checked;
      },
    },
  };

</script>
<style lang="scss" scoped>
  .new-qn {
    width: 60%;
    margin: 10% auto;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 5px 15px #999;
    border-radius: 5px;
    padding: 25px;
    position: relative;
    .title {
      width: 100%;
      height: 40px;
      border: none;
      text-align: center;
      font-size: 30px;
    }
    // 分割线
    >hr {
      margin: 20px 0;
    }
    // 底部按钮
    .btns {
      float: right;
      margin-right: 40px;
      >span {
        margin: 0 10px;
        padding: 5px 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 3px 6px #999;
        &:hover {
          color: #fff;
          background: #42B983;
        }
      }
    }
    // 问卷列表
    .qnlist {
      padding: 20px 40px;
      font-size: 18px;
      &:hover {
        background: #fef1e8;
        input,
        textarea {
          background: #fef1e8;
        }
      }
      input {
        border: none;
      }
      .item {
        height: 25px;
        margin: 10px 0 10px 30px;
        padding: 5px 10px;
        .type {
          width: 20px;
          height: 20px;
        }
        &:hover {
          position: relative;
          background: #eee;
          border-radius: 5px;
          box-shadow: 0px 1px 1px #000, inset 0px 4px 4px rgba(0, 0, 0, .3), inset 0px -4px 4px rgba(255, 255, 255, .5);
          &:after {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            width: calc(100% - 8px);
            height: 12px;
            background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.2) 90%, rgba(255, 255, 255, 0) 90%);
            border-radius: 10px;
          }
        }
      }
      .qn-title {
        height: 25px;
        font-size: 20px;
      }
      .type {
        margin-right: 5px;
        vertical-align: middle;
      }
      .options {
        height: 20px;
        font-size: 16px;
      }
      .textarea {
        width: 100%;
        height: 60px;
        margin: 10px 0;
        font-size: 16px;
      }
    }
  }

</style>
