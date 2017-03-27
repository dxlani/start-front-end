import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 从localStorage获取数据
const STORAGE_KEY = 'questionaire-by-vuejs';

function fetchLocal() {
  let state = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!state || !state.qnss) {
    state = {
      qnss: [],
      editing: null,
      fillQns: null,
      viewData: null,
    };
  }
  return state;
}

const store = new Vuex.Store({
  // * data structure *
  // status:{number} /[123]/ 分别代表已保存、已发布、已截止
  // qns.type:{string} [radio,checkbox,textarea]
  // qns.options:{array or string} 在单选和复选里为数组，预设3个选项，不少于2个；在textarea里为string描述
  // qns.value:{array or number} 在单选和复选里为数组用于保存数据；在textarea里为number
  // ***
  // state: {
  //   qnss: [{
  //     title: 'first问卷',
  //     deadline: 2017,
  //     status: 0,
  //     qns: [{
  //       question: '单选题',
  //       type: 'radio',
  //       options: ['选项1', '选项2', '选项3'],
  //       value: [],
  //     }, {
  //       question: '多选题',
  //       type: 'checkbox',
  //       options: ['选项1', '选项2', '选项3'],
  //       value: [],
  //     }, {
  //       question: '简答题',
  //       type: 'textarea',
  //       options: '问题描述',
  //       value: [],
  //     }, ]
  //   }, ],
  //   editing: null,
  //   fillQns: null,
  //   viewData: null,
  // }
  state: fetchLocal(),
  mutations: {
    saveQns(state, payload) {
      const obj = state;
      // 判断如果是新建保存插入qnss末尾
      // 如果是编辑则只清楚editin的引用
      if (obj.editing === null) {
        obj.qnss.push(payload);
      } else {
        const editIndex = obj.qnss.indexOf(obj.editing);
        obj.qnss.splice(editIndex, 1, payload);
      }
      obj.editing = null;
    },
    delQns(state, payload) {
      const index = state.qnss.indexOf(payload);
      if (index > -1) {
        state.qnss.splice(index, 1);
      }
    },
    updateQns(state, payload) {
      // status这个参数是必需的，不然改变数据不会引发view更新，即使这里没有用到
      const obj = payload;
      obj.status = 1;
    },
    // 编辑问卷，将数据对象指向editing
    editQns(state, payload) {
      const obj = state;
      obj.editing = payload;
    },
    fillQns(state, payload) {
      const obj = state;
      obj.fillQns = payload;
    },
    saveFill(state) {
      const obj = state;
      obj.fillQns = null;
    },
    viewData(state, payload) {
      const obj = state;
      obj.viewData = payload;
    },
    // 超过deadline更新status=2
    deadLine(state) {
      state.qnss.forEach((el) => {
        const obj = el;
        if (new Date(obj.deadline) < new Date()) {
          obj.status = 2;
        }
      });
    },
  },
});

export default store;
