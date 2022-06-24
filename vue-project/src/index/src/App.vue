<template>
  <v-app>
    <v-main>

      <v-text-field
          v-model="message"
          label="メッセージ"
      ></v-text-field>

      <v-file-input
          @change="handleFileUpload"
          accept="image/*"
          label="画像の選択"
          multiple
      ></v-file-input>
      <v-btn color="primary" @click="clickHandler">
        送信
      </v-btn>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import axios from "axios";
import {defineComponent} from 'vue'


export default defineComponent({
  name: 'App',

  components: {},

  data() {
    return {
      //
      message: "" as string,
      files: [] as any[]
    }
  },
  mounted() {
    console.log("start")
  },
  methods: {
    clickHandler(e: any) {
      console.log("e " + e.target)
      console.log("click")
      let formData = new FormData();

      formData.append("file", this.files[0])
      formData.append("message",this.message)

      try{
        axios.post('image_post',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
        ).then(function () {
          console.log('SUCCESS!!');
        })
      }catch(e)
      {
        console.log('FAILURE!!');
      }






    },
    handleFileUpload(e: any) {
      //let file  = e.target.files[0];
      console.log("handleFileUpload " + e.target.files.length)
      console.log("handleFileUpload " + e.target.files)
      this.files = e.target.files;


    }

  }
})
</script>
