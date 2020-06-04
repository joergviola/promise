<template>
    <a :href="'#'+title" :class="classes">
        {{title}}
        <font-awesome-icon class="ml-3" :icon="icon"></font-awesome-icon>
    </a>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHome, faHandshake, faCalculator, faFile, faCalendarCheck, faTasks, faClock, faChartLine, faDollarSign, faHeartbeat } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faHome, faHandshake, faCalculator, faFile, faCalendarCheck, faTasks, faClock, faChartLine, faDollarSign, faHeartbeat)

export default {
    name: "ProcessStep",
    props: ['title', 'width', 'icon'],
    components: { FontAwesomeIcon },
    computed: {
        classes() {
            return [
                "step", "text-right", "shadow-lg", "transform", "pr-2", "py-2", "z-20",
                "hover:translate-x-8",
                "custom-tr-" + this.width,
                "transition", "duration-500", "ease-in-out",
                "rounded-r-full"
            ]
        }
    }
}

</script>
