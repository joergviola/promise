<template>
    <full-section :title="title" :type="type" >
        <div class="flex h-full flex-col ml-4 items-center md:content content-center">
            <div class="relative w-3/4" style="padding-bottom:35%">
                <div class="absolute w-full h-full slider shadow-lg mt-12 hover:scale-150 transform transition duration-500 ease-in-out">
                    <img 
                        v-for="(image, i) in images"
                        class="object-cover"
                        :id="`sc-${title}-${i}`" 
                        :src="$withBase(`/images/${image}`)"
                    >
                </div>
            </div>
            <div class="slider-nav z-20 mt-16">
                <a 
                    v-for="(image, i) in images"
                    class="bg-primary px-2 py-1 ml-4 rounded-full" 
                    :href="`#sc-${title}-${i}`"
                >{{i+1}}</a>
            </div>
            <ul class="mt-2 ml-16 md:ml-0">
                <slot></slot>
            </ul>
        </div>
    </full-section>
</template>

<script>
import FullSection from './FullSection'

export default {
    name: "FeatureSection",
    props: ['title', 'type', 'images'],
    components: { FullSection },
}

</script>
