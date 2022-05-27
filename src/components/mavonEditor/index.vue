<template>
    <div :id="editor">
        
    </div>
</template>
<script>
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'edittor',
  componnents:{
      'mavon-editor':mavonEditor
  },
  data() { 
    return { value: '' }
  },
  methods: {
    setValue(value) {
      this.editor.setValue(value)
    },
    getValue() {
      return this.editor.getValue()
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    },
  }
}
</script>
<style>
#editor {
        margin: auto;
        width: 80%;
        height: 580px;
}

</style>
