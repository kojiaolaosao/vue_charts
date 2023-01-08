import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShowScoreView from '../views/ShowScoreView.vue'

const routes = [
    {
        path: '/',
        redirect: '/about'
    },
    {
        path: '/home',
        name: 'home',
        component: HomeView,
        children: [
            {
                path: '/showScoreView',
                name: 'showScoreView',
                component: ShowScoreView,
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('../views/AboutView.vue')
            },
            {
                path: '/upload',
                name: 'upload',
                component: () => import('../views/UploadView.vue')
            },
            {
                path: '/manage',
                name: 'manage',
                component: () => import('../views/manageView.vue')
            },
            {
                path: '/scoreTable',
                name: 'scoreTable',
                component: () => import('../views/ScoreTableView.vue')
            },
            {
                path: '/studentSearch',
                name: 'studentSearch',
                component: () => import('../views/StudentSearchView.vue')
            }
        ]
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
