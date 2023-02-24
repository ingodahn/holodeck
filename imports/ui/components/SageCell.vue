<template>
  <div class="container" :name="cellName">
    <div v-html="makeCell"></div>
  </div>
</template>

<script src="https://sagecell.sagemath.org/embedded_sagecell.js"></script>

<script>
export default {
  props: {
    script: {
      type: String,
      default: "1+1",
    },
    cellName: {
      type: String,
      default: 'sagecell'
    },
    kernelKey: {
      type: String,
      default: 'sageServer'
    },
    options: {
      type: Object,
      default() {
        return {
          // Make *any* div with class 'compute' a Sage cell
          inputLocation: "div.compute",
          //languages: sagecell.allLanguages,
          //languages: ["maxima","sage","singular","r"],
          languages: ["sage"],
          evalButtonText: "Evaluate",
          linked: true,
          linkKey: this.kernelKey,
          callback: () => {
            let node = document.getElementsByName(this.cellName)[0];
            let bt = node.getElementsByClassName("sagecell_evalButton");
            bt[0].addEventListener("click", this.isEvaluated);
            let cm = node.getElementsByClassName("CodeMirror");
            cm[0].addEventListener("change", this.isEdited);
          },
        };
      },
    },
  },
  data() {
    return {
    };
  },
  
  mounted() {
    sagecell.makeSagecell(this.options);
  },
  methods: {
    isEvaluated() {
      let script = this.getCurrentScript();
      this.$emit('evaluated',script);
    },
    isEdited() {
      this.$emit('edited')
    },
    getCurrentScript () {
      let node = document.getElementsByName(this.cellName)[0];
      let cm = node.getElementsByClassName("CodeMirror");
      let script=cm[0].CodeMirror.getValue();
      return script;
    },
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
