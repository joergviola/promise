<template>
    <a class="process-arrow bg-secondary md:text-2xl ml-8 mt-3 px-2 shadow-lg hover:underline font-bold text-white" :href="to">{{title}}</a>
</template>

<script>
export default {
  props: ['title', 'to']
}
</script>

<style lang="stylus" scoped>

primary = #4599DF
secondary = #F0B544
height=19px

.process-arrow {
    display: inline-block;
    line-height: 2*height;
    position: relative;
}
.process-arrow:before, .process-arrow:after {
    content:"";
    border-style: solid;
    border-width: 0;
    height: 0;
    position: absolute;
    width: 0;
}
.process-arrow {
    background-color: secondary
}
.process-arrow:after, .process-arrow:before {
    border-width: height 0 height height;
}
.process-arrow:before {
    border-color: secondary transparent;
    left: - height;
}
.process-arrow:after {
    border-color: transparent secondary;
    right: - height;
}

</style>