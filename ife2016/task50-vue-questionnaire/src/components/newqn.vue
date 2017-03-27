<template>
  <div class="new-qn">
    <input class="title" type="text" autocomplete="off" placeholder="请填写问卷标题" v-model="aQns.title">
    <hr>
    <div class="qnlist" v-for="(qn, index1) in aQns.qns">
      <div><span>{{'Q' + (index1 + 1) + '：'}}</span><input class="qn-title" type="text" v-model="qn.question" @focus="select"></div>
      <ul v-if="qn.type != 'textarea'">
        <li class="item" v-for="(item, index2) in qn.options">
          <input class="type" :type="qn.type" :name="'item' + index1">
          <input class="options" type="text" v-model="qn.options[index2]" @focus="select">
          <i class="iconfont icon-x" @click="removeOp(item, qn)" v-if="limitLength(qn)"></i>
        </li>
        <li class="addOp" @click="addOp(qn)"><i class="iconfont icon-jia"></i></li>
      </ul>
      <textarea class="textarea" v-model="qn.options" v-if="qn.type == 'textarea'" @focus.once="select"></textarea>
      <div>
        <button @click="removeQn(qn)">删除</button>
        <button @click="copyQn(qn)">复用</button>
        <button @click="moveUp(qn)" :disabled="index1 == 0">上移</button>
        <button @click="moveDown(qn)" :disabled="index1 == aQns.qns.length - 1">下移</button>
      </div>
    </div>
    <section class="qn-tag" :class="{show: tag}">
      <div class="radio" @click="addRadio"><i class="iconfont icon-1"></i>单选</div>
      <div class="checkbox" @click="addCheckBox"><i class="iconfont icon-duoxuan"></i>多选</div>
      <div class="text" @click="addText"><i class="iconfont icon-c_icon2"></i>简答</div>
    </section>
    <section class="add-qn" @click="tag = !tag"><i class="iconfont icon-jia"></i>添加问题</section>
    <hr>
    <footer>
      <div class="deadline">
        <span>截止日期：</span>
        <date-picker :date="date" :option="option" :limit="limit"></date-picker>
      </div>
      <a class="btns" @click="saveQns"><span>保存问卷</span></a>
    </footer>
    <my-alert :alert-message="alertMessage" ref="myAlert">
      <my-alert>
  </div>
</template>
<script>
  /* eslint-disable */
  import DatePicker from 'vue-datepicker';

  export default {
    name: 'newQn',
    data() {
      return {
        tag: false,
        alertMessage: '',
        aQns: {
          title: '',
          deadline: '',
          status: 0,
          qns: [],
        },
        beforeEdit: null,
        // DatePicker options
        date: {
          time: '',
        },
        option: {
          type: 'day',
          week: ['一', '二', '三', '四', '五', '六', '日'],
          month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月',
            '十一月', '十二月'
          ],
          format: 'YYYY-MM-DD',
          placeholder: '请选择截止日期',
          inputStyle: {
            'display': 'inline-block',
            'padding': '6px',
            'line-height': '22px',
            'font-size': '16px',
            'width': '150px',
            'border': '2px solid #ccc',
            'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
            'border-radius': '2px',
            'color': '#5F5F5F',
          },
          color: {
            header: '#3399ff',
            headerText: '#fff',
          },
          buttons: {
            ok: '确定',
            cancel: '取消',
          },
          overlayOpacity: 0.5,
          dismissible: true,
        },
        limit: [{
          type: 'fromto',
          from: Date(),
          to: '',
        }],
      };
    },
    methods: {
      // 限制单选最少两个选项，多选最少三个选项，因为多选用的雷达图
      limitLength(qn) {
        let bool;
        if (qn.type === 'radio') {
          bool = qn.options.length > 2;
        } else {
          bool = qn.options.length > 3;
        }
        return bool;
      },
      addRadio() {
        this.aQns.qns.push({
          question: '单选题',
          type: 'radio',
          options: ['选项1', '选项2', '选项3'],
          value: [],
        });
      },
      addCheckBox() {
        this.aQns.qns.push({
          question: '多选题',
          type: 'checkbox',
          options: ['选项1', '选项2', '选项3', '选项4'],
          value: [],
        });
      },
      addText() {
        this.aQns.qns.push({
          question: '简答题',
          type: 'textarea',
          options: '问题描述',
          value: [0],
        });
      },
      removeQn(qn) {
        const tQns = this.aQns.qns;
        tQns.splice(tQns.indexOf(qn), 1);
      },
      moveDown(qn) {
        const tQns = this.aQns.qns;
        const qnIndex = tQns.indexOf(qn);
        tQns.splice(qnIndex, 1);
        tQns.splice(qnIndex + 1, 0, qn);
      },
      moveUp(qn) {
        const tQns = this.aQns.qns;
        const qnIndex = tQns.indexOf(qn);
        tQns.splice(qnIndex, 1);
        tQns.splice(qnIndex - 1, 0, qn);
      },
      copyQn(qn) {
        const tQns = this.aQns.qns;
        tQns.splice(tQns.indexOf(qn) + 1, 0, qn);
      },
      select(e) {
        e.target.select();
      },
      removeOp(item, qn) {
        if (qn.options.length > 2) {
          qn.options.splice(qn.options.indexOf(item), 1);
        }
      },
      addOp(qn) {
        qn.options.push(`选项${qn.options.length + 1}`);
      },
      saveQns() {
        this.aQns.deadline = this.date.time;

        // 显示弹窗 根据情况改变提示信息
        this.$refs.myAlert.$emit('showAlert');
        if (!this.aQns.title) {
          this.alertMessage = '请输入问卷标题';
          return;
        }
        if (!this.aQns.qns.length) {
          this.alertMessage = '请添加问题';
          return;
        }
        if (!this.aQns.deadline) {
          this.alertMessage = '请选择截止日期';
          return;
        }

        // 保存至store
        this.$store.commit('saveQns', this.aQns);

        // 保存成功提示 稍等x秒跳列表页
        this.alertMessage = '问卷保存成功';
        setTimeout(() => {
          this.$router.push('/list')
        }, 1200);
      },
    },
    components: {
      'date-picker': DatePicker,
    },
    mounted() {
      if (this.$store.state.editing != null) {
        // 深度克隆对象防止双向绑定直接修改state中的qns对象
        this.aQns = deepClone(this.$store.state.editing);
        this.date.time = this.aQns.deadline;
      }

      function deepClone(obj) {
        let newObj = obj instanceof Array ? [] : {};
        if (typeof obj !== 'object') {
          return obj;
        } else if (window.JSON) {
          let str = JSON.stringify(obj);
          newObj = JSON.parse(str);
        } else {
          for (let i in obj) {
            newObj[i] = (typeof obj == 'object') ? deepClone(obj[i]) : obj[i];
          }
        }
        return newObj;
      }
    },
    // router钩子 跳出编辑页使editing = null
    beforeRouteLeave(to, from, next) {
      this.$store.state.editing = null;
      next();
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
    // 添加问卷的大框
    .add-qn {
      height: 100px;
      margin: 20px;
      text-align: center;
      background: #eee;
      border: 1px solid #ccc;
      cursor: pointer;
      background: rgba(250, 255, 158, 0.59);
      &:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
      .icon-jia:before {
        content: "\e618";
        font-size: 24px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
    // 日期选择
    .deadline {
      float: left;
      margin-left: 40px;
    }
    // 保存发布按钮
    .btns {
      float: right;
      margin-right: 40px;
      >span {
        display: block;
        margin: 0 10px;
        padding: 5px 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 3px 6px #666;
        cursor: pointer;
        background: #fff;
        &:hover {
          color: #fff;
          background: #42B983;
        }
      }
    }
    // 需要添加问卷的类型
    .qn-tag {
      height: 0;
      margin-top: 20px;
      overflow: hidden;
      text-align: center;
      transition: height .3s ease;
      &.show {
        height: 55px;
      }
      >div {
        display: inline-block;
        margin: 0 10px;
        padding: 10px 20px;
        background: #eee;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 3px 6px #999;
        cursor: pointer;
        >i {
          margin-right: 5px;
          font-size: 18px;
          vertical-align: middle;
        }
        .icon-1:before {
          content: "\e624";
        }
        .icon-duoxuan:before {
          content: "\e608";
        }
        .icon-c_icon2:before {
          content: "\e602";
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
        &:hover {
          .icon-x:before {
            content: "\e62a";
            color: #f00;
          }
        }
        .type {
          width: 20px;
          height: 20px;
        }
      }
      // 添加选项
      .addOp {
        height: 25px;
        text-align: center;
        cursor: pointer;
        &:hover {
          border: 1px dashed #000;
          .icon-jia:before {
            content: "\e618";
            vertical-align: middle;
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
