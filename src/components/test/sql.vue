<template>
  <div class="ed-container init">
    <div class="ed-item">
      <el-input type="textarea" :rows="8" v-model="query"></el-input>
    </div>

    <div class="ed-item gr-center sep-5">
      <el-button type="info" size="mini" @click="get">GET</el-button>
      <el-button type="primary" size="mini" @click="post">POST</el-button>
      <el-button type="warning" size="mini" @click="put">PUT</el-button>
      <el-button type="danger" size="mini" @click="del">DELETE</el-button>
    </div>

    <vue-json-pretty
      :data="res">
    </vue-json-pretty>

    <!-- <el-tag>{{ status }}</el-tag>

    <pre>
      {{ result }}
    </pre> -->

  </div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'
import VueJsonPretty from 'vue-json-pretty'
export default {
  mixins: [
    MixinInit
  ],

  components: {
    VueJsonPretty
  },

  data () {
    return {
      query: '',
      status: null,
      result: null,
      keys: null,
      res: null
    }
  },

  methods: {
    async post () {
      try {
        const res = await this.axios.post(`${this.URL_}v2/query_helper/query`, {query: this.query})
        this.res = res.data
        let { status, data } = res

        this.status = status
        this.result = data.result
      } catch (err) {
        this.res = err.response.data
        console.dir(err)
      }
    },
    async put () {
      try {
        const res = await this.axios.put(`${this.URL_}v2/query_helper/query`, {query: this.query})
        this.res = res.data
        let { status, data } = res

        this.status = status
        this.result = data.result
      } catch (err) {
        this.res = err.response.data
        console.dir(err)
      }
    },
    async get () {
      try {
        const res = await this.axios.post(`${this.URL_}v2/query_helper/query_get`, {query: this.query})
        this.res = res.data
        let { status, data } = res

        this.status = status
        this.result = data.result
        this.getKeys(this.result)
      } catch (err) {
        this.res = err.response.data
        console.dir(err)
      }
    },
    async del () {
      try {
        const res = await this.axios.post(`${this.URL_}v2/query_helper/query_delete`, {query: this.query})
        this.res = res.data
        let { status, data } = res

        this.status = status
        this.result = data.result
      } catch (err) {
        this.res = err.response.data
        console.dir(err)
      }
    },

    getKeys (arr) {
      this.keys = Object.keys(arr[0])
    }
  }
}
</script>

