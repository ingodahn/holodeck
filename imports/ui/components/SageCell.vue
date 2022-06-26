<template>
  <div class="container">
    <v-row>
      <v-col>
        <div v-html="makeCell"></div>
      </v-col>
    </v-row>
  </div>
</template>

<script src="https://sagecell.sagemath.org/embedded_sagecell.js"></script>

<script>
export default {
  props: ["script"],
  data() {
    return {};
  },
  mounted() {
    // Make *any* div with class 'compute' a Sage cell
    sagecell.makeSagecell({
      inputLocation: "div.compute",
      //languages: sagecell.allLanguages,
      //languages: ["maxima","sage","singular","r"],
      languages: ["sage"],
      evalButtonText: "Evaluate",
      linked: true,
    });
  },
  computed: {
    makeCell() {
      return (
        '<div class="compute"><script type="text/x-sage">' +
        this.script +
        "<\/script></div>"
      );
    },
  },
};
</script>