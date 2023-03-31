<script setup lang="ts">
import { ref } from 'vue';
import SimpleMap from '../components/SimpleMap.vue';

defineProps<{ msg: string }>();

const count = ref(0);

function increase() {
    count.value++;
}

function increase10() {
    count.value += 10;
}

function decrease() {
    count.value--;
}

function decrease10() {
    count.value -= 10;
}

function reset() {
    count.value = 0
}
</script>

<template>
    <div class="h-full w-full p-10 scrollbar overflow-y-scroll flex flex-col space-y-10">

        <h1 class="text-5xl text-green-700 dark:text-green-400 font-bold mx-auto">
            {{ msg }}
        </h1>

        <div class="w-5/6 mx-auto flex flex-col bg-slate-300 dark:bg-slate-700 p-10 rounded-xl text-center space-y-10">

            <p class="mx-auto text-2xl">
                Explore Vue.js with a simple example. A webpage developed with Vue.js, testing several functionalities such as counters.
            </p>

            <div class="p-3 bg-yellow-500 dark:bg-yellow-700 mx-auto rounded">
                Count {{ count }}
            </div>

            <div class="flex space-x-20 mx-auto">
                <button
                    @click="increase"
                    class="bg-green-400 dark:bg-green-700 p-2 rounded-lg "
                >
                    Increase
                </button>
                <button
                    @click="increase10"
                    class="bg-blue-400 dark:bg-blue-700 p-2 rounded-lg "
                >
                    Increase +10
                </button>
                <button
                @click="reset"
                    class="bg-red-400 dark:bg-red-700 p-2 rounded-lg "
                >
                    Reset
                </button>
                <button
                @click="decrease10"
                    class="bg-amber-400 dark:bg-amber-700 p-2 rounded-lg "
                >
                    Decrease -10
                </button>
                <button
                @click="decrease"
                    class="bg-orange-400 dark:bg-orange-700 p-2 rounded-lg "
                >
                    Decrease
                </button>
            </div>

        </div>

        <SimpleMap />

    </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
