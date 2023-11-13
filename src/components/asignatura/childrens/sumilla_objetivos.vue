<template>
<div class="ed-container init">
  <div class="ed-item s-95 to-center">
    <h2 style="text-align: center">
      <strong>II. SUMILLA</strong>
    </h2>
  </div>
  <div class="ed-item ed-container form-group s-95 to-center">
    <p>{{ sumilla.sumilla_obj }}</p>
  </div>

  <div class="ed-item ed-container s-95 to-center" style="margin-top: 15px;">
    <div class="ed-item sep-5 gr-center">
      <el-button type="info" @click="modalVerbos = true" size="mini">Administrar Verbos</el-button>
      <el-button type="danger" @click="modalSumilla = true" size="mini">Editar Sumilla</el-button>
      <el-button type="primary" @click="modalObjetivos = true" size="mini">Ver Objetivos</el-button>
    </div>
    <h2 v-if="curso_.tipo_asignatura == 'G'" class="ed-item" style="text-align: center; margin-bottom: 10px">
      <strong>III. Objetivo General</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'" class="ed-item" style="text-align: center; margin-bottom: 10px">
      <strong>IV. Objetivo General</strong>
    </h2>
    <div v-if="arrGeneral" class="ed-item ed-container sep-5">
      <p>{{ arrGeneral.objetivo }}</p>
      <div class="ed-item" style="text-align: right">
        <el-button @click="deleteObjetivo(arrGeneral)" type="danger" size="mini">Eliminar</el-button>
      </div>
    </div>
    <div v-else class="ed-item ed-container sep-5">
      <div v-if="objGeneral" class="form-group ed-item m-50 l-30">
        <el-select filterable v-model="objGeneral.verbo" placeholder="Seleccionar Verbo">
          <el-option-group v-for="(grupo, i) in arrGrupos" :key="i" :label="grupo.grupo">
            <el-option v-for="(verbo, ind) in grupo.verbos" :key="ind" :label="verbo.cverbo" :value="verbo.cverbo">
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div v-if="objGeneral" class="ed-item m-50 l-30">
          <el-input v-model="objGeneral.conector" placeholder="palabras de enlace"></el-input>
        </div>
      <p v-if="objGeneral" class="ed-item m-50 l-30">{{ objGeneral.que }}</p>
      <!-- <el-input class="ed-item m-50 l-40" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="Como Hacer"
        v-model="objetivoGeneral.como">
      </el-input>
      <el-input class="ed-item m-50 l-40" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="Para que Hacer"
        v-model="objetivoGeneral.para">
      </el-input> -->
      <div v-if="objGeneral" class="ed-item" style="text-align: right">
        <el-button :disabled="objGeneral.verbo == '' || objGeneral.conector == '' || objGeneral.que == ''" @click="saveObjetivoGeneral(objGeneral)" type="danger"
          size="mini">Registrar</el-button>
      </div>
    </div>
  </div>

  <div class="ed-item ed-container s-95 to-center" style="margin-top: 15px">
    <h2 v-if="curso_.tipo_asignatura == 'G'" class="ed-item" style="text-align: center; margin-bottom: 10px">
      <strong>IV. Objetivos Específicos</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'" class="ed-item" style="text-align: center; margin-bottom: 10px">
      <strong>V. Objetivos Específicos</strong>
    </h2>
    <div class="ed-item ed-container sep-5 obj-esp" v-for="(esp, index) in objEspecifico" :key="index">
      <div v-if="arrEspe && arrEspe.some(e => e.objetivo.toLowerCase().indexOf(esp.que.toLowerCase()) >= 1) " class="ed-item ed-container">
        <!-- <el-input-number v-model="e.objetivo.toLowerCase().indexOf(esp.que.toLowerCase()) >= 1).orden" :min="1" :max="10"></el-input-number> -->
        <p class="ed-item">
          ORDEN: {{ arrEspe.find(e => e.objetivo.toLowerCase().indexOf(esp.que.toLowerCase()) >= 1).orden }} ({{ arrEspe.find(e => e.objetivo.toLowerCase().indexOf(esp.que.toLowerCase()) >= 1).id_silabus_obj }})
        </p>
        <p>{{ arrEspe.find(e => e.objetivo.toLowerCase().indexOf(esp.que.toLowerCase()) >= 1).objetivo }}</p>
        <div class="ed-item" style="text-align: right">
          <el-button @click="deleteObjetivo(arrEspe.find(e => e.objetivo.toLowerCase().indexOf(esp.que.toLowerCase()) >= 1))" type="danger" size="mini">Eliminar</el-button>
          <el-button @click="changeOrder(arrEspe.find(e => e.objetivo.toLowerCase().indexOf(esp.que.toLowerCase()) >= 1))" type="info" size="mini">Cambiar Orden</el-button>
        </div>
      </div>
      <template v-else>
        <div class="ed-item m-50 l-30">
          <el-select filterable v-model="esp.verbo" placeholder="Seleccionar Verbo">
            <el-option-group v-for="(grupo, i) in arrGrupos" :key="i" :label="grupo.grupo">
              <el-option v-for="(verbo, ind) in grupo.verbos" :key="ind" :label="verbo.cverbo" :value="verbo.cverbo">
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div class="ed-item m-50 l-30">
          <el-input v-model="esp.conector" placeholder="palabras de enlace"></el-input>
        </div>
        <p class="ed-item m-50 l-30">{{ esp.que }}</p>
        <el-input class="ed-item m-50 l-40" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="Como Hacer"
          v-model="esp.como">
        </el-input>
        <el-input class="ed-item m-50 l-40" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="Para que Hacer"
          v-model="esp.para">
        </el-input>
        <div class="ed-item" style="text-align: right">
          <el-button :disabled="disabledButton(esp)" @click="saveObjetivo(esp)" type="danger" size="mini">Registrar</el-button>
        </div>
      </template>
    </div>
  </div>

  <div v-if="modalVerbos" class="modal">
    <verbos @close="closeModalVerbos"></verbos>
  </div>

  <div v-if="modalSumilla" class="modal">
    <admin-sumilla :idSumilla="sumilla.id_sumilla" @close="closeModalSumilla"/>
  </div>

  <div v-if="modalObjetivos" class="modal">
    <all-objetivos :id_asignatura="curso_.id_curso" @close="closeAllObj"></all-objetivos>
  </div>

</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

// component
import verbos from '../modal/Verbos.vue'

/**
 * MODELS
 */
import GxSilabusObjetivo from '../../../models/gx_silabus_objetivo'

/**
 * Componentes
 */
import loader from '../../templates/loader.vue'
import adminSumilla from '../../../Modal/Sumillas/AdminSumilla.vue'
import allObjetivos from '../modal/AllObjetivos.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  mounted() {
    this.init()
  },

  components: {
    loader,
    verbos,
    adminSumilla,
    allObjetivos
  },

  data() {
    return {
      sumilla: '',
      objetivoGeneral: '',
      objEspecifico: null,

      arrVerbos: null,
      arrGrupos: null,

      gxSilabusObjetivo: new GxSilabusObjetivo(),

      arrGeneral: null,
      arrEspe: null,

      modalVerbos: false,
      modalSumilla: false,

      objGeneral: null,
      modalObjetivos: false
    }
  },

  methods: {
    async init() {
      await this.getSumillaCurso(this.curso_)
      await this.getVerbos()
      await this.getObjetivos(this.curso_, this.periodo)
    },

    /**
     * Obtiene la sumilla del curso cargado
     */
    async getSumillaCurso({
      id_curso
    }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando sumilla...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL}js-sumilla/${id_curso}`, this.autho)

        if (res.status === 200) {
          this.sumilla = res.data.data
          this.sumilla.sumilla_obj = this.sumilla.sumilla_obj

          this.getObjetivoGeneral(this.sumilla)
        }
      } catch (err) {
        console.dir(err)
        this.sumilla = ''
      }
      loading.close()
    },

    /**
     * Obtiene los objetivos registrados del curso
     */
    async getObjetivos({
      id_curso,
      id_filial,
      id_modalidad
    }, {
      id_periodo,
      id_semestre
    }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando objetivos...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}js-silabus-objetivo/${id_curso}/2/${id_modalidad}/${id_periodo}/${id_semestre}`, this.autho)

        if (res.status === 200) {
          const data = res.data.data
          let hasGen = data.some(ob => ob.tipo_obj == 'G')

          if (hasGen) {
            this.arrGeneral = data.find(ob => ob.tipo_obj == 'G')
          } else {
            this.arrGeneral = null
          }

          let hasEsp = data.some(ob => ob.tipo_obj == 'E')

          if (hasEsp) {
            this.arrEspe = data.filter(ob => {
              if (ob.tipo_obj == 'E') {
                return ob
              }
            })
          } else {
            this.arrEspe = null
          }
        }
      } catch (err) {
        console.dir(err)
        this.arrGeneral = null
        this.arrEspe = null
      }
      loading.close()
    },

    /**
     * Crea el objetivo general a partir de la sumilla
     */
    getObjetivoGeneral({
      sumilla_obj
    }) {
      const st = 'comprende:'

      let i = sumilla_obj.toLowerCase().indexOf(st) + st.length
      let f = sumilla_obj.length

      let sbtr = sumilla_obj.substr(i, f).trim()

      const silaboGeneral = new GxSilabusObjetivo(this.URL)

      silaboGeneral.id_asignatura = this.curso_.id_curso
      silaboGeneral.tipo_obj = 'G'
      silaboGeneral.id_docente = this.identity.dni
      silaboGeneral.id_periodo = this.periodo.id_periodo
      silaboGeneral.id_semestre = this.periodo.id_semestre
      silaboGeneral.id_modalidad = this.curso_.id_modalidad
      silaboGeneral.id_filial = 2

      this.$set(silaboGeneral, 'verbo', '')
      this.$set(silaboGeneral, 'que', sbtr)
      this.$set(silaboGeneral, 'como', '')
      this.$set(silaboGeneral, 'para', '')
      this.$set(silaboGeneral, 'conector', '')

      this.objetivoGeneral = silaboGeneral

      let ogg = sumilla_obj.split('*')[1]

      const og = new GxSilabusObjetivo(this.URL)
      og.id_asignatura = this.curso_.id_curso
      og.tipo_obj = 'G'
      og.id_docente = this.identity.dni
      og.id_periodo = this.periodo.id_periodo
      og.id_semestre = this.periodo.id_semestre
      og.id_modalidad = this.curso_.id_modalidad
      og.id_filial = 2

      this.$set(og, 'verbo', '')
      this.$set(og, 'que', ogg)
      this.$set(og, 'conector', '')

      this.objGeneral = og

      this.getObjetivosEspecificos(sbtr)
    },

    /**
     * Crea los objetivos especificos a
     * partir de la sumilla
     */
    getObjetivosEspecificos(objGeneral) {
      let objEspec = objGeneral.split(';')

      objEspec = objEspec.map(obj => {
        const objetivo = new GxSilabusObjetivo(this.URL)

        objetivo.id_asignatura = this.curso_.id_curso
        // objetivo.objetivo = obj.toUpperCase()
        objetivo.tipo_obj = 'E'
        objetivo.id_docente = this.identity.dni
        objetivo.id_periodo = this.periodo.id_periodo
        objetivo.id_semestre = this.periodo.id_semestre
        objetivo.id_modalidad = this.curso_.id_modalidad
        objetivo.id_filial = 2

        this.$set(objetivo, 'verbo', '')
        this.$set(objetivo, 'que', obj)
        this.$set(objetivo, 'como', '')
        this.$set(objetivo, 'para', '')
        this.$set(objetivo, 'conector', '')

        return objetivo
      })

      this.objEspecifico = objEspec
    },

    /**
     * Obtiene todos los verbos registrados
     */
    async getVerbos() {
      try {
        const res = await this.axios.get(`${this.URL}js-get-verbos`, this.autho)

        if (res.status === 200) {
          this.arrVerbos = res.data.data
          this.orgVerbos(this.arrVerbos)
        }
      } catch (err) {
        console.dir(err)
        this.arrVerbos = ''
      }
    },

    /**
     * Organizar los verbos para mostrar en el combo
     */
    orgVerbos(arrVerbos) {
      let arr = []

      let ver = ''
      arrVerbos.map(verbo => {
        if (verbo.cgrupo != ver) {
          let obj = {
            grupo: verbo.cgrupo,
            verbos: []
          }
          arr.push(obj)
        }

        ver = verbo.cgrupo
      })

      arr.map(el => {
        arrVerbos.map(e => {
          if (e.cgrupo == el.grupo) {
            el.verbos.push(e)
          }
        })
      })

      this.arrGrupos = arr
    },

    /**
     * Almacenar objetivo
     */
    async saveObjetivo(objetivo) {
      this.ajaxLoad = true
      objetivo.objetivo = `${objetivo.verbo[0].toUpperCase()}${objetivo.verbo.substr(1, objetivo.length).toLowerCase()} ${objetivo.conector.toLowerCase()} ${objetivo.que}, ${objetivo.como}, ${objetivo.para}.`
      objetivo.id_usuario_insert = this.identity.id_usuario

      try {
        const res = await this.axios.post(`${this.URL}js-ins-silabus-objetivo`, objetivo, this.autho)
        if (res.status === 201) {
          this.getObjetivos(this.curso_, this.periodo)
        }
      } catch (err) {
        console.dir(err)
      }
      this.ajaxLoad = false
    },

    async saveObjetivoGeneral(objetivo) {
      this.ajaxLoad = true
      objetivo.objetivo = `${objetivo.verbo[0].toUpperCase()}${objetivo.verbo.substr(1, objetivo.length).toLowerCase()} ${objetivo.conector.toLowerCase()} ${String(objetivo.que).toLowerCase()}.`
      objetivo.id_usuario_insert = this.identity.id_usuario

      try {
        const res = await this.axios.post(`${this.URL}js-ins-silabus-objetivo`, objetivo, this.autho)
        if (res.status === 201) {
          this.getObjetivos(this.curso_, this.periodo)
        }
      } catch (err) {
        console.dir(err)
      }
      this.ajaxLoad = false
    },

    /**
     * Eliminar objetivo
     */
    async deleteObjetivo({
      id_silabus_obj
    }) {
      this.ajaxLoad = true
      try {
        const res = await this.axios.delete(`${this.URL}js-del-silabus-objetivo/${id_silabus_obj}`, this.autho)

        if (res.status === 201) {
          this.getObjetivos(this.curso_, this.periodo)
        }
      } catch (err) {
        console.dir(err)
      }
      this.ajaxLoad = false
    },

    disabledButton({
      verbo,
      como,
      para
    }) {
      return (
        verbo == '' ||
        como == '' ||
        para == ''
      )
    },

    closeModalVerbos() {
      this.getVerbos()
      this.modalVerbos = false
    },

    async closeModalSumilla () {
      await this.init()
      this.modalSumilla = false
    },

    async changeOrder (obj) {
      const loading = this.$loading({
        lock: true,
        text: 'Ordenando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$prompt(`Ingrese el orden del objetivo`, 'SIGEDO', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(async ({
        value
      }) => {
        obj.orden = value
        try {
          const res = await this.axios.put(`${this.URL_}v2/sumillaObjetivos/changeOrder/${obj.id_silabus_obj}`, obj)
          if(res.status !== 201) {
            loading.close()
            return
          }
          this.init()
        } catch (err) {
          this.$hlp.errors(err)
        }
      })
      .catch(err => {

      })

      loading.close()
    },

    closeAllObj () {
      this.init()
      this.modalObjetivos = false
    }


  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.obj-esp {
  border-bottom: 1px dotted rgb(158, 134, 134);
  padding-bottom: 1em;
}
</style>


