<template>
    <el-container>
        <el-header class="nav" :class="{'fix-nav': navBarFixed}" style="border: 1px solid black;padding-inline: 5%;" >
            <el-menu default-active="about" mode="horizontal" :ellipsis="false" :collapse-transition="false"
                     popper-effect="dark" router>
                <el-menu-item  index="about">首页</el-menu-item>
                <el-menu-item  index="studentSearch">学生</el-menu-item>
                <el-menu-item  index="upload">上传</el-menu-item>
                <div class="flex-grow" />
                <el-sub-menu  index="UserBack">
                    <template #title >
                        <el-avatar size="default" src=""></el-avatar>
                    </template>
                    <el-menu-item index="manage">个人中心</el-menu-item>
                    <el-menu-item index="studentManage">学生管理</el-menu-item>
                </el-sub-menu>
                <el-menu-item >
                    <span @click.stop="toggleDark()">暗黑模式</span>
                    <el-switch size="small" v-model="isDark"/>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main style="border: 1px solid black;padding-inline: 5%">
            <router-view></router-view>
        </el-main>
        <el-backtop :right="50" :bottom="50" />
    </el-container>

</template>
<script>
import axios from "axios";
import {useToggle} from "@vueuse/shared";
import {useDark} from "@vueuse/core";

export default {
    name: 'show_carve',
    setup() {
        const isDark = useDark()
        const toggleDark = useToggle(isDark)
        return{
            isDark,
            toggleDark
        }
    },
    data() {
        return {
            navBarFixed: false,
        }
    },
    mounted() {
        // 事件监听滚动条
        window.addEventListener("scroll", this.watchScroll);
    },
    destroyed() {
        // 移除事件监听
        window.removeEventListener("scroll", this.watchScroll);
    },
    methods: {
        watchScroll() {
            // 滚动的距离
            const scrollTop =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
            // 容器的高度
            const offsetTop = document.querySelector(".nav").offsetHeight;
            // console.log("scrollTop=>", scrollTop, "  offsetTop=>", offsetTop);
            //  滚动的距离如果大于了元素到顶部的距离时，实现吸顶效果
            this.navBarFixed = scrollTop > offsetTop + 50;
        },
    }
}
</script>
<style>
.flex-grow {
    flex-grow: 1;
}

/* 固定导航 */
.fix-nav {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 999;
    -webkit-animation-name: fadeInOut;
    -webkit-animation-timing-function: inherit;
    -webkit-animation-duration: 1s;
    opacity: 80%;
}

/*导航吸顶的渐显*/
@-webkit-keyframes fadeInOut {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 80%;
    }
}
</style>