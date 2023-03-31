<script setup lang="ts">
import $ from 'jquery';
import { ref } from 'vue';

const dark = ref(
    localStorage.theme === 'dark' ||
    (
        !('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )
);

function setDarkMode() {

    dark.value = !dark.value;

    if (dark.value) {
        localStorage.setItem("theme", "dark");
        $("html").addClass('dark');
    } else {
        localStorage.setItem("theme", "light");
        $("html").removeClass('dark');
    }

}

</script>

<template>

    <div class="w-screen bg-slate-300 dark:bg-slate-900 px-3 flex h-14">
        <h3 class="text-xl font-bold my-auto">
            Testing Vue
        </h3>

        <div class="ml-auto"></div>
        <div class="space-x-5 mx-5 my-auto">
            <RouterLink class="p-2 rounded bg-slate-200 dark:bg-slate-800" to="/">Home</RouterLink>
            <RouterLink class="p-2 rounded bg-slate-200 dark:bg-slate-800" to="/data">Data</RouterLink>
        </div>
        <div class="my-auto">

            <button class="text-xl rounded-full bg-slate-200 dark:bg-slate-800 p-2 " @click="setDarkMode">
                <font-awesome-icon
                    class="dark:hidden inline"
                    icon="moon"
                />
                <font-awesome-icon
                    class="hidden dark:inline"
                    icon="sun"
                />
            </button>

        </div>

    </div>

</template>
