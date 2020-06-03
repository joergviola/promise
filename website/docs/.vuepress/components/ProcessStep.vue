<template>
    <a :href="'#'+title" :class="classes">{{title}}</a>
</template>

<script>
export default {
    name: "ProcessStep",
    props: ['title', 'width'],
    computed: {
        classes() {
            return [
                "step", "text-right", "shadow-lg", "transform", 
                "hover:translate-x-8",
                "custom-tr-" + this.width,
                "transition", "duration-500", "ease-in-out",
                "rounded-r-full"
            ]
        }
    }
}

</script>
