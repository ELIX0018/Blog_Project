<template>
    <n-timeline-item
        :icon-size="60"
        type="success"
    >
      <template #default>
        <n-thing >
          <template  #avatar>
            <n-avatar src="https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg">
            </n-avatar>
          </template>
          <template #header >
           <div style="padding-top: 5px">
             Apple
             <n-tag  size="small"  type="error" :bordered="false">
               站长
             </n-tag>
           </div>
          </template>

          <template #header-extra>
            <n-text depth="3">
              20240108
            </n-text>

          </template>
          <n-card
              style="padding-top: 0px"
              embedded
              :bordered="false"
          >
          <MdPreview style="background: none" :editorId="'editor'+1"
                          :theme="isdarkTheme ? 'dark' : 'light'"
                          v-model="diaryContent" />
          </n-card>
        </n-thing>
      </template>
    </n-timeline-item>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const store = VaeStore();
let {clientWidth,isdarkTheme} = storeToRefs(store);
const diaryContent=ref('欢迎访问：https://www.zhangpingguo.com/')
</script>

<style scoped>

</style>
