<template>
  <div>
    <a :name="anchor"></a>
    <div class="flex flex-wrap my-12">
      <div v-if="align=='left'" class="w-full sm:w-1/2">
        <div class="flex flex-1 m-6 h-48 md:h-auto md:px-0 bg-white rounded shadow-xl hover:scale-200 sm:transform origin-left transition duration-500 ease-in-out" >
          <img class="object-cover" :src="$withBase(`/images/${image}`)">
        </div> 
      </div>
      <div class="w-5/6 sm:w-1/2 p-6">
        <h3 class="text-3xl text-gray-800 font-bold leading-none mb-3">
          {{title}}
        </h3>
        <p class="text-gray-600 mb-8">
          <slot></slot>
        </p>
      </div>
      <div v-if="align=='right'" class="w-full sm:w-1/2">
        <div class="flex flex-1 m-6 h-48 md:h-auto md:px-0 bg-white rounded shadow-xl hover:scale-200 sm:transform origin-right transition duration-500 ease-in-out" >
          <img class="object-cover" :src="$withBase(`/images/${image}`)">
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Feature",
  props: ['anchor', 'title', 'image', 'align']
}
</script>