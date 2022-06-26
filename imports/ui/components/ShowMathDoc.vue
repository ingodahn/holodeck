<template>
    <div :key="componentKey" class="mathcontent" v-html="content"></div>
</template>

<script>
export default {
    props: ["content"],
    data() {
        return {
             componentKey: 0
        }
    },

    mounted: function() {        
        renderMathInElement(document.body,{
          // customised options
          // • auto-render specific keys, e.g.:
          delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\\(', right: '\\)', display: false},
              {left: '\\[', right: '\\]', display: true}
          ],
          // • rendering keys, e.g.:
          throwOnError : false
        });
        
        //MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    },
}
</script>