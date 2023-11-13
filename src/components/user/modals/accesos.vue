<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item ed-container gr-center">
    <h2 class="ed-item gr-center sep-10">
      ACCESOS
    </h2>
  </div>

  <div v-if="load" class="ed-item gr-center">
    <loading />
  </div>

  <template v-else>
    <div class="ed-item ed-container m-80 l-70 sep-20 to-center">
      <el-collapse style="width:100%;">
        <el-collapse-item v-for="(main, index) in main_menu" :key="index" >
          <template slot="title">
            <el-checkbox v-model="main.checkAll" @change="handleCheckAllChange(main)"><h4>{{main.nombre}}</h4></el-checkbox>
          </template>
          <div class="ed-item ed-container" v-for="(mod, index) in modulos" :key="index">
            <p class="ed-item">
              <el-checkbox-group v-model="main.elementos">
                <el-checkbox border v-if="mod.main_menu == main.nombre" :label="mod.id_modulo" @change="comprobarCheckAll(main)">{{mod.main_menu == main.nombre ? mod.sub_menu : ''}}</el-checkbox>
              </el-checkbox-group>
              <!-- {{ mod.main_menu == main ? mod.sub_menu : '' }}
              <input v-if="mod.main_menu == main" v-model="modulosSel" type="checkbox" :value="mod.id_modulo" class="ed-item s-20"> -->
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>

    </div>
    <div class="ed-item gr-center">
      <button @click="eliminarAcceso" class="btn btn-info btn-hov">
        <i class="fas fa-unlock"></i>
        Registrar Accesos
      </button>
    </div>
  </template>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

import GXUser from '../../../models/gx_user';

export default {
  mixins: [
    MixinInit
  ],

  props: ['user'],

  components: {
    loading
  },

  mounted() {
    this.init()
  },

  data: () => ({
    modulos: [],
    modulosSel: [],
    menutemp:[],
    main_menu: [],
    load: false
  }),

  watch: {
    
  },

  methods: {
    async init() {
      this.teclasRapidas()
      await this.getModulos()
      await this.getAccesosPorUsuario()
      this.main_menu.forEach(mm=>{
        this.comprobarCheckAll(mm)
      })
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    handleCheckAllChange(val){
      var temp=[]
      if(val.checkAll){
        this.modulos.forEach(m => {
          if(m.main_menu == val.nombre){
            temp.push(m.id_modulo)
          }
        })
      }
      val.elementos=temp
    },
    comprobarCheckAll(main){
      var temp=[]
        this.modulos.forEach(m => {
          if(m.main_menu == main.nombre){
            temp.push(m.id_modulo)
          }
        })
      if(main.elementos.length!=temp.length){
        main.checkAll=false
      }else{
        main.checkAll=true
      }
    },
    async getModulos() {
      this.load = true
      this.main_menu = []
      try {
        const res = await this.axios.get(`${this.URL}js-modulos`, this.autho)
        if (res.status === 200) {
          this.modulos = res.data.data
          await this.modulos.forEach(m => {
            if (!this.menutemp.includes(m.main_menu)) {
              this.menutemp.push(m.main_menu)
            }
          })
          await this.menutemp.forEach(m=>{
            this.main_menu.push({"nombre":m,"checkAll":false,"elementos":[]})
          })
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    registrarAcceso: async function () {

      await this.main_menu.forEach(m => {
        this.modulosSel=this.modulosSel.concat(m.elementos)
      })

      let accesosSel = []
      accesosSel = await this.modulosSel.map(mod => {
        let acc = {}
        acc.id_usuario = this.user.id_usuario
        acc.id_modulo = mod
        return acc
      })

      accesosSel.forEach(acceso => {
        this.insertAcceso(acceso)
      })
    },

    async insertAcceso (acceso) {
      try {
        const res = await this.axios.post(`${this.URL}js-ins-accesos`, acceso, this.autho)

        if(res.status === 201) {

        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async eliminarAcceso () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL}js-del-accesos/${this.user.id_usuario}`, {}, this.autho)

        if(res.status === 201) {
          await this.registrarAcceso()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.close()
      loading.close()
    },

    async getAccesosPorUsuario() {
      try {
        this.modulosSel = []
        const res = await this.axios.get(`${this.URL}js-accesos/${this.user.id_usuario}`, this.autho)

        if (res.status === 200) {
          res.data.data.forEach(el => {
            this.modulos.forEach(m => {
              if(m.id_modulo==el.id_modulo){
                this.main_menu.forEach(mm => {
                  if(m.main_menu==mm.nombre){
                    mm.elementos.push(el.id_modulo)
                  }
                })
              }
            })
            // this.modulosSel.push(el.id_modulo)
          })
          
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    close: function () {
      this.$emit('close')
    },
  }

}
</script>

<style lang="scss" scoped>
    
</style>


