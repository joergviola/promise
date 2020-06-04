<template>
    <div :class="classes">
        <a :name="name || title"></a>
        <div class="p-6">
            <div v-if="title" class="text-right container pt-12">
                <h2 class="text-5xl -mt-6">{{title}}</h2>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "FullSection",
    props: ['name', 'title', 'type'],
    computed: {
        classes() {
            const result = ['min-h-full']
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
