import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Data from "../views/Data.vue";

const routes = [
    {
        path: "/",
        component: Home,
        props: {
            msg: "Exploring Vue.js"
        }
    },
    {
        path: "/data",
        component: Data
    },
];

const history = createWebHistory();

const router = createRouter({
    history,
    routes,
});

export default router;
