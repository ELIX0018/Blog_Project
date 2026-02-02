<template>
<!--  评论留言组件
推荐您直接访问作者官网查看如何使用：https://undraw.gitee.io/undraw-ui/
-->
  <div >
    <u-comment
        style="padding: 0px"
      :config="config"
      @submit="submit"
      @like="like"
      @reply-page="replyPage"
      @get-user="getUser"
      @remove="remove"
      @report="report"
    >

      <template #info="scope" >

          <div class="user-content">

                <span class="name" >{{ scope.user.username }}  </span>

                <span blank="true" class="rank">&nbsp;
                 <n-tag  size="small"  type="error" :bordered="false">
                    站长
                  </n-tag>


                </span>
            &nbsp;
            <n-text depth="3" style="font-size: 8px">
              <n-tag size="small"  :bordered="false">
                <template #icon>
                  <n-icon :component="GolfOutline" />
                </template>
                {{ scope.address }}

              </n-tag>

            </n-text>
            &nbsp;
            <n-text depth="3" :style="{float: clientWidth>660?'right':''}">
                {{scope.createTime}}
            </n-text>


        </div>
      </template>
    </u-comment>

  </div>
</template>

<script setup lang="js">
import {reactive, ref, watch} from 'vue'
import { UToast } from 'undraw-ui'
import {PawOutline} from '@vicons/ionicons5'
import emoji from '../../assets/emoji'
import { reply, comment } from '../../assets/comment.js'
//获取用户浏览器信息方法
//import {userAgentObj} from '../../utils/win'
import { v4 as uuidv4 } from "uuid";
import {GolfOutline} from '@vicons/ionicons5'
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
import {useMessage} from "naive-ui";
const pageData=reactive({page:1,limit:8,apple:'1'});
const loadingCard=ref(true);
const loadingEnd=ref(false);
const noData=ref(false);
const message = useMessage()
const store = VaeStore();
let {clientWidth,distanceToTop,isdarkTheme,distanceToBottom,userInfo,address} = storeToRefs(store);


defineOptions({
  name: 'comment'
})
let {userName, userPassword,qqId,userId,userPowerId} = userInfo.value;

const config = reactive({
  user: {
    id: userInfo.value.userId,
    username:userInfo.value.userName,
    avatar: userInfo.value.userHead,
    userPowerId: userInfo.value.userPowerId,
    // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
    likeIds: [userInfo.value.userId, '', 3]
  },
  emoji: emoji,
  comments: [],
  total: 10
})




// 请求获取用户详细信息
const getUser = (uid, show) => {

}
//获取所有留言
const get_LeaveAll=()=>{
  config.comments=comment;
}

get_LeaveAll();
//监听滚动条
watch(() => distanceToBottom.value, (newValue, oldValue) => {
  //如果滚动到了底部
  if(newValue<60 &&  !loadingCard.value && !loadingEnd.value){
    pageData.page++;
    get_LeaveAll();
  }
});


// 提交留言事件
const submit = ({ content, parentId, files, finish, reply, mentionList}) => {
  let contentImg = files.map(e => createObjectURL(e)).join(', ')
  let comment = {
    id:uuidv4(),
    parentId: parentId,
    uid: config.user.id,
    address: '地址',
    content: content,
    likes: 0,
    createTime: '刚刚',
    contentImg: contentImg,
    user: {
      username: config.user.username,
      avatar: config.user.avatar,
      level: 6,
      homeLink: `1`
    },
    reply: null
  }
  finish(comment)
  UToast({ message: '评论成功!', type: 'success' })

}

// 删除评论事件
const remove = (id, finish) => {
  console.log('删除评论: ' + id)
  setTimeout(() => {
    finish()
    alert(`删除成功: ${id}`)
  }, 200)
}

//举报用户事件
const report = (id, finish) => {
  console.log('举报用户: ' + id)
  setTimeout(() => {
    finish()
    alert(`举报成功: ${id}`)
  }, 200)
}

// 点赞按钮事件
const like = (id, finish) => {
  console.log('点赞: ' + id)
  console.log(id)
  setTimeout(() => {
    finish()
  }, 200)
}

// 分页插件
const page = (pageNum, pageSize, arr) => {
  var skipNum = (pageNum - 1) * pageSize
  var newArr =
    skipNum + pageSize >= arr.length ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize)
  return newArr
}

//回复分页
const replyPage = (parentId, pageNum, pageSize, finish) => {
  let tmp = {
    total: reply.total,
    list: page(pageNum, pageSize, reply.list)
  }
  setTimeout(() => {
    finish(tmp)
  }, 200)
}

</script>

<style lang="scss" scoped>
.user-card {
  display: flex;
  .user-content {
    position: relative;
    flex: 1;
    margin-left: 16px;

    .user-info {
      .username {
        display: flex;
        align-items: center;
        text-decoration: none;
        .name {
          max-width: 10rem;
          font-weight: 500;
          font-size: 15px;
          color: #252933;
          line-height: 32px;
          margin-right: 4px;
        }
      }
    }
    .social-info {
      margin-bottom: 10px;
      a {
        text-decoration: none;
      }
      a:not(:first-child) {
        margin-left: 18px;
      }
      a span:last-child {
        margin-left: 3px;
        color: #9499a0;
      }
    }
  }
}
</style>
