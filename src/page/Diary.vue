<template>
  <BackgroundPlate title="随笔一记" description="听说休息不规律,对身体危害很大;吓得我天天熬夜,熬得很有规律。" color="#f4511e"></BackgroundPlate>
   <n-grid :cols="6" >
    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?4:6">
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <n-timeline size="large">
              <DiaryModule v-for="(diary,index) in 10" :key="index" v-motion-pop   v-motion-slide-visible-once-bottom   :diaryList="diary"></DiaryModule>
        </n-timeline>
        <n-divider/>
        <n-space justify="center">
        <n-spin size="medium"   />
        <n-text depth="3" >
          <n-icon :size="15">
            <PawOutline></PawOutline>
          </n-icon> 没有更多了
        </n-text>
        </n-space>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import BackgroundPlate from '../components/background/BackgroundPlate.vue'
import DiaryModule from '../components/Diary/DiaryModule.vue';
import {PawOutline} from '@vicons/ionicons5'
import {VaeStore} from "../store";
//获取后端方法
// import {getDiarysAll} from '../utils/api'
import {storeToRefs} from "pinia";
import {inject, onActivated, reactive, ref, watch} from "vue";
import {useMessage} from "naive-ui";
import {onBeforeRouteLeave} from "vue-router";
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,isdarkTheme} = storeToRefs(store);
const pageData=reactive({page:1,limit:8,apple:'1'});
const message = useMessage()

//获取所有日记
const  get_DiarysAll=()=>{
      //调用后端接口
}
get_DiarysAll();



//监听滚动条
watch(() => distanceToBottom.value, (newValue, oldValue) => {
  //如果滚动到了底部
  if(newValue<60 ){
    pageData.page++;
    get_DiarysAll();
  }
});

//滚动条回到原位
const scrollBy = inject<Function>('scrollBy');
const remeberScroll=ref(0);
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个状态保存
  remeberScroll.value = distanceToTop.value;
  next()
})
//   组件激活
onActivated(() => {
  scrollBy? scrollBy(remeberScroll.value):''
})

</script>

<style scoped>

</style>
