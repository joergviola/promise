<template>
    <div :class="classes">
        <a :name="name || title"></a>
        <div v-if="title" class="text-right container pt-12">
            <h2 class="text-5xl -mt-6">{{title}}</h2>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "FullSection",
    props: ['name', 'title', 'type'],
    computed: {
        classes() {
            const result = ['h-full']
            switch(this.type) {
                case "first":
                    result.push('bg-secondary', 'text-white'); break
                case "second":
                    result.push('bg-black', 'text-white'); break
                case "third":
                    result.push('bg-gray-500', 'text-white'); break
            }
            return result   
        }
    },
}

</script>
