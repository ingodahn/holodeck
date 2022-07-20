<template>
  <div>
    <VueShowdown :markdown="content" flavor="github"
  />
  </div>
</template>

<script>
import { VueShowdown } from 'vue-showdown';

export default {
  components: {
    VueShowdown
  },
  props: {
    content: {
      type: String,
      default: "No markdown content given"
    }
  },
  data() {
    return {
    }
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
}
</script>