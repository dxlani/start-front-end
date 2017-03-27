<template>
  <div class="new-qn" v-if="viewData">
    <h2 class="title">{{viewData.title}}</h2>
    <hr>
    <div class="qnlist" v-for="(qn, index1) in viewData.qns">
      <div><span>{{'Q' + (index1 + 1) + '：'}}</span><span class="qn-title">{{qn.question}}</span></div>
      <div class="charts" :class="'chart' + index1"></div>
    </div>
    <hr>
    <footer>
      <router-link to="/list" class="btns"><span>确定</span></router-link>
    </footer>
  </div>
</template>
<script>
  import Echarts from 'echarts';

  function getRadioValue(qn) {
    let result = [];
    // 求每个选项选了多少次
    qn.options.forEach((el, i) => {
      const val = qn.value.filter(ele => ele === i).length;
      const obj = {
        value: val,
        name: el,
      };
      if (val) {
        result.push(obj);
      }
    });
    result = result.length ? result : [{
      name: '暂无数据',
      value: 0,
    }];
    return result;
  }

  function getCheckValue(qn) {
    const result = {
      textArr: [],
      valArr: [],
    };

    // 求被选的最大次数,并给出data数组
    let maxVal = 0;
    for (let i = 0; i < qn.options.length; i += 1) {
      const val = qn.value.filter(ele => ele === i).length;
      result.valArr.push(val);
      if (val > maxVal) {
        maxVal = val;
      }
    }
    // 给出选项名和最大值数组
    qn.options.forEach((el) => {
      const obj = {
        text: el,
        max: maxVal,
      };
      result.textArr.push(obj);
    });
    return result;
  }

  export default {
    name: 'viewdata',
    computed: {
      viewData() {
        return this.$store.state.viewData;
      },
    },
    mounted() {
      let chartOption = {};
      this.viewData.qns.forEach((el, index) => {
        if (el.type === 'radio') {
          // 单选用饼图
          chartOption = {
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c} ({d}%)',
            },
            color: ['#f35833', '#00ccff', '#ffcc00', '#8fc31f', '#FF00FF', '#3366FF', '#3399FF',
              '#FF9900'],
            series: [{
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: getRadioValue(el),
              label: {
                normal: {
                  textStyle: {
                    fontSize: 16,
                  },
                },
              },
            }],
          };
        } else if (el.type === 'checkbox') {
          const result = getCheckValue(el);
          // 多选用雷达图
          chartOption = {
            tooltip: {
              trigger: 'axis',
            },
            color: ['#FF3399'],
            radar: [{
              indicator: result.textArr,
              center: ['50%', '50%'],
              radius: 80,
              name: {
                textStyle: {
                  color: '#000',
                  fontSize: 16,
                },
              },
            },
            ],
            series: [{
              type: 'radar',
              tooltip: {
                trigger: 'item',
              },
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default',
                  },
                },
              },
              data: [{
                value: result.valArr,
                name: '详细数据',
              }],
            },
            ],
          };
        } else {
          // 简答柱形图
          chartOption = {
            color: ['#49f4c3'],
            tooltip: {
              trigger: 'axis',
              formatter: '{b} : {c}',
              axisPointer: {
                type: 'shadow',
                shadowStyle: {
                  color: 'transparent',
                },
              },
            },
            grid: {
              left: '5%',
              right: '5%',
              top: '10%',
              containLabel: true,
            },
            xAxis: {
              type: 'value',
              splitLine: {
                show: false,
              },
            },
            yAxis: {
              type: 'category',
              data: ['有效回答'],
              axisLabel: {
                textStyle: {
                  fontSize: 16,
                },
              },
            },
            series: [{
              type: 'bar',
              barWidth: '30%',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: '#000',
                    fontSize: 20,
                  },
                },
              },
              data: el.value,
            },
            ],
          };
        }
        const chart = Echarts.init(document.querySelector(`.chart${index}`));
        chart.setOption(chartOption);
      });
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
      display: block;
      text-align: center;
      color: #000;
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
      .qn-title {
        height: 25px;
        font-size: 20px;
      }
      .charts {
        width: 100%;
        height: 300px;
      }
    }
  }

</style>
