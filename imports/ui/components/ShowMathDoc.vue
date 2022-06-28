<template>
  <div :key="componentKey" :class="isCurrent" v-html="content"></div>
</template>

<script>
export default {
  props: ["content", "currentPage"],
  data() {
    return {
      componentKey: 0,
    };
  },

  mounted: function () {
    renderMathInElement(document.body, {
      // customised options
      // • auto-render specific keys, e.g.:
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      // • rendering keys, e.g.:
      throwOnError: false,
    });

    //MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  },
  computed: {
    isCurrent() {
      return this.currentPage ? "mathcontent currentPage" : "mathcontent";
    },
  },
};
</script>

<style scoped>
.currentPage {
  padding: 1em;
  border-style: none solid none solid;
  border-left-color: blue;
  border-right-color: blue;
}
</style>