<template>
  <BackgroundPlate title="随笔一记" description="听说休息不规律,对身体危害很大;吓得我天天熬夜,熬得很有规律。" color="#f4511e"></BackgroundPlate>
   <n-grid :cols="6" >
    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?4:6">
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <n-timeline size="large">
          <template v-if="loadingCard">
            <n-skeleton v-for="n in 3" :key="n" height="100px" style="margin-bottom: 20px" />
          </template>
          <template v-else>
            <DiaryModule 
              v-for="(diary,index) in diaryList" 
              :key="diary.id" 
              v-motion-pop   
              v-motion-slide-visible-once-bottom   
              :diary="diary"
              :index="index"
            ></DiaryModule>
          </template>
        </n-timeline>
        <n-divider/>
        <n-space justify="center">
          <n-spin v-if="loadingCard" size="medium" />
          <n-text v-else-if="loadingEnd" depth="3">
            <n-icon :size="15">
              <PawOutline></PawOutline>
            </n-icon> 没有更多了
          </n-text>
          <n-text v-else-if="diaryList.length === 0" depth="3">
            <n-icon :size="15">
              <PawOutline></PawOutline>
            </n-icon> 暂无随笔内容
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
import { getDiariesApi } from '../utils/api'
import {storeToRefs} from "pinia";
import {inject, onActivated, reactive, ref, watch, onMounted} from "vue";
import {useMessage} from "naive-ui";
import {onBeforeRouteLeave} from "vue-router";
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,isdarkTheme} = storeToRefs(store);
const pageData=reactive({page:1,limit:8,apple:'1'});
const message = useMessage()

const diaryList = ref<any[]>([]);
const loadingCard = ref(true);
const loadingEnd = ref(false);

//获取所有日记
const get_DiarysAll = async () => {
  try {
    loadingCard.value = true;
    const response = await getDiariesApi({
      page: pageData.page,
      limit: pageData.limit
    });
    
    if (response && response.ec === '0') {
      if (pageData.page === 1) {
        diaryList.value = response.data.diaries;
      } else {
        diaryList.value = [...diaryList.value, ...response.data.diaries];
      }
      
      // 检查是否还有更多数据
      if (response.data.diaries.length < pageData.limit) {
        loadingEnd.value = true;
      }
    } else {
      const errorMsg = response ? response.em : '未知错误';
      message.error('获取随笔失败: ' + errorMsg);
    }
  } catch (error: any) {
    console.error('获取随笔失败:', error);
    const errorMsg = error?.response?.data?.em || error?.message || '网络错误，无法获取随笔';
    message.error(errorMsg);
  } finally {
    loadingCard.value = false;
  }
}

// 组件挂载时获取日记
onMounted(() => {
  get_DiarysAll();
});



//监听滚动条
watch(() => distanceToBottom.value, (newValue, oldValue) => {
  //如果滚动到了底部
  if(newValue<60 && !loadingCard.value && !loadingEnd.value){
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
