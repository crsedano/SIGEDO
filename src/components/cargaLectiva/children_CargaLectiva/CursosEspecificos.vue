<template>
<div class="ed-container init">
  <div class="ed-item sep-15 ed-container">
    <h5 class="ed-item m-50 gr-center">
      FILIAL: {{user.filial}}
    </h5>
    <h5 class="ed-item m-50 gr-center">
      FACULTAD: {{user.facultad}}
    </h5>
    <h5 class="ed-item m-50 gr-center">
      MODALIDAD: {{user.modalidad}}
    </h5>
    <h5 class="ed-item m-50 gr-center">
      ESCUELA: {{user.escuela}}
    </h5>
  </div>

  <div class="ed-item sep-5 s-90 m-60 l-30 to-center form-group ed-container">
    <select v-model="planSel" class="form-control">
      <option value="0">Todos los planes</option>
      <option v-for="(plan, index) in planes" :key="index">
        {{plan}}
      </option>
    </select>
    <select v-if="ciclos.length > 0" v-model="cicloSel" class="form-control">
      <option value="0">Todos los ciclos</option>
      <option v-for="(ciclo, index) in ciclos" :key="index">
        {{ciclo}}
      </option>
    </select>
    <input v-model="filterCurso" type="text" class="form-control" placeholder="Buscar Asignatura">
  </div>

  <div class="ed-item">
    <el-table @row-click="tableEvent" border stripe fit :data="cursosEspFilter" height="460" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="anio" label="Plan" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="ciclo" label="Ciclo" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="asignatura" label="Asignatura" min-width="300" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Asignar docentes carga lectiva" placement="right">
            <span>{{ reg.row.asignatura }} {{reg.row.idtipocurso == 2 ? '(ELECTIVO)' : ''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="aforo_ht" label="Aforo(HT)" min-width="90" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Editar aforo ht" placement="right">
            <span>{{ reg.row.aforo_ht }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="aforo_hp" label="Aforo(HP)" min-width="90" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Editar aforo hp" placement="right">
            <span>{{ reg.row.aforo_hp }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="numero_matriculadosf" label="Matriculados" min-width="110" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Editar número de matriculados" placement="left">
            <span>{{ reg.row.numero_matriculadosf }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Verificado" min-width="110" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip :content="reg.row.cverificado == 1 ? '¿Quitar Verificación?' : '¿Verificar?'" placement="left">
            <i @click="verificarAsig(reg.row, 0)" v-if="reg.row.cverificado == 1" class="fas fa-check-square action green"></i>
            <i @click="verificarAsig(reg.row, 1)" v-else class="fas fa-times action pointer red"></i>
          </el-tooltip>
          <el-tooltip content="Ver resumen de salones" placement="left">
            <i @click="verSalones(reg.row)" class="fas fa-graduation-cap action pointer"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-if="modalAsignar" class="modal">
    <asignar-docentes
      :curso="modalCurso" 
      :facultad="modalFacultad"
      :type="'E'"
      @close="closeModal" 
    />
  </div>

  <div v-if="modalSalones" class="modal">
    <ver-salones
      :curso="modalCurso" 
      :facultad="modalFacultad" 
      @close="modalSalones = false" 
    />
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import GxAsigDoc from '../../../models/gx_asigdoc.js'

import asignarDocentes from '../modals/AsignarDocentes.vue'
import verSalones from '../modals/VerSalones.vue'

export default {
  mixins: [
    MixinInit
  ],
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      // if(!vm.permisos) {
      //   next('/')
      //   return
      // } 
      // let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      // if(!s) {
      //   next('/')
      // }
    })
  },

  mounted() {
    this.init()
  },

  components: {
    asignarDocentes,
    verSalones
  },

  props: ['user'],

  data() {
    return {
      cursosEsp: null,
      filterCurso: '',
      cursosEspFilter: null,

      planes: [],
      planSel: '0',

      ciclos: [],
      cicloSel: '0',

      modalCurso: null,
      modalSalones: null,
      modalFacultad: null,
      modalAsignar: false,
    }
  },

  watch: {
    filterCurso: function (n) {
      this.filterCurso = n.toUpperCase()
      if (n == '') {
        if (this.planSel == '0') {
          this.cursosEspFilter = this.cursosEsp
        } else {
          if (this.cicloSel == 0) {
            this.cursosEspFilter = this.cursosEsp.filter(curso => curso.anio == this.planSel)
          } else {
            this.cursosEspFilter = this.cursosEsp.filter(curso => curso.anio == this.planSel && curso.ciclo == this.cicloSel)
          }
        }
      } else {
        if (this.planSel == '0') {
          this.cursosEspFilter = this.cursosEsp.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()))
        } else {
          if (this.cicloSel == 0) {
            this.cursosEspFilter = this.cursosEsp.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()) && curso.anio == this.planSel)
          } else {
            this.cursosEspFilter = this.cursosEsp.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()) && curso.anio == this.planSel && curso.ciclo == this.cicloSel)
          }
        }
        // this.cursosEspFilter = this.cursosEsp.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()))
      }
    },

    planSel: function (n) {
      if (n == 0) {
        this.ciclos = []
        this.cursosEspFilter = this.cursosEsp
      } else {
        this.cicloSel = '0'
        this.ciclos = []
        this.cursosEsp.map(cur => {
          if (cur.anio == n) {
            if (!this.ciclos.some(c => c == cur.ciclo)) {
              this.ciclos.push(cur.ciclo)
            }
          }
        })

        this.ciclos.sort((a, b) => {
          return a - b
        })

        this.cursosEspFilter = this.cursosEsp.filter(curso => curso.anio == n)
      }
    },

    cicloSel: function (n) {
      if (n == 0) {
        this.cursosEspFilter = this.cursosEsp.filter(curso => curso.anio == this.planSel)
      } else {
        this.cursosEspFilter = this.cursosEsp.filter(curso => curso.anio == this.planSel && curso.ciclo == n)
      }
    }
  },

  computed: {
    facAvtive: function () {
      return this.user.activo == 0
    }
  },

  methods: {
    init() {
      this.getCursosEspecificos(this.user)
    },

    async getCursosEspecificos (user) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL}cursos-esp/${user.id_escuela}/${user.id_filial}/${user.id_modalidad}/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)

        if (res.status === 200) {
          this.cursosEsp = res.data.data
          this.cursosEsp = this.cursosEsp.filter(curso => {
            if (curso.anio == 2007 && curso.ciclo < 6) {

            } else {
              return curso
            }
          })
          this.cursosEspFilter = this.cursosEsp

          this.planes = []
          this.cursosEsp.map(cur => {
            if (!this.planes.some(p => p == cur.anio)) {
              this.planes.push(cur.anio)
            }
          })
        }
      } catch (err) {
        this.cursosEsp = null
        this.$hlp.errors(err)
      }
      loading.close()
    },

    closeModal () {
      this.modalAsignar = false
    },

    async openModal (curso) {
      if(curso.cverificado == 1) {
        this.swAlert(`No se puede modificar un curso verificado`, 'warning')
        return
      }

      if(!this.facAvtive) return

      if(curso.numero_matriculadosf <= 0) {
        this.swAlert(`Asigne alumnos matriculados primero`, 'warning')
        return
      }

      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      curso.id_filial = this.user.id_filial
      curso.id_modalidad = this.user.id_modalidad

      let o = {
        curso: curso,
        facultad: this.user
      }

      this.modalCurso = o.curso

      this.modalFacultad = o.facultad

      this.modalAsignar = true

      loading.close()
    },

    async verSalones (curso) {
      if(!this.facAvtive) return

      if(curso.numero_matriculadosf <= 0) {
        this.swAlert(`Asigne alumnos matriculados primero`, 'warning')
        return
      }

      if(curso.cverificado != 1) {
        this.swAlert(`Verifique la asignatura para poder ver el resumen de salones`, 'warning')
        return
      }

      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      curso.id_filial = this.user.id_filial
      curso.id_modalidad = this.user.id_modalidad

      let o = {
        curso: curso,
        facultad: this.user
      }

      this.modalCurso = o.curso

      this.modalFacultad = o.facultad

      this.modalSalones = true

      loading.close()

    },

    // Elimina todos los salones registrados
    async deleteAllClass ({ id_asignatura }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      let { id_filial, id_modalidad } = this.user
      let { id_periodo, id_semestre } = this.periodo
      let { version_final } = this.entorno

      try {
        const res = await this.axios.post(`${this.URL}js-delete-salones/${id_asignatura}/${id_filial}/${id_modalidad}/${id_periodo}/${id_semestre}/${version_final}`, {}, this.autho)

        if(res.status !== 201) return

        await this.deleteFusiones(this.user, id_asignatura)
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async deleteFusiones (curso, id_asignatura) {
      try {
        let { id_periodo, id_semestre } = this.periodo
        let { id_filial, id_modalidad } = curso

        const res = await this.axios.delete(`${this.URL}delete-fusion/${id_periodo}/${id_semestre}/${id_asignatura}/${id_filial}/${id_modalidad}`)

        if(res.status !== 201) return
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    updateRegister (curso) {
      if (!this.facAvtive) return

      if (this.periodo.estado != 1) return

      if(curso.cverificado == 1) {
        this.swAlert(`No se puede modificar un curso verificado`, 'warning')
        return
      }

      this.$prompt(`Actualizar número de matriculados de ${curso.asignatura}`, 'SIGEDO', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(({
        value
      }) => {
        let viudas

        let {
          nviudas_p,
          nviudas_sp
        } = this.entorno

        let {
          id_modalidad
        } = this.user

        if (id_modalidad == 1) {
          viudas = parseInt(nviudas_p)
        }

        if (id_modalidad == 2) {
          viudas = parseInt(nviudas_sp)
        }

        if (value < parseInt(viudas)) {
          if (value > 0) {
            this.swAlert(`El número de alumnos no puede ser menos de ${viudas}`)
            return
          }
          curso.numero_matriculadosf = 0
          this.deleteAllClass(curso)
          return
        }

        if (curso.numero_matriculadosf != value) {
          this.updateRegisterBD(curso, value)
        }
      })
      .catch(err => {

      })
    },

    async updateRegisterBD (curso, value) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        curso.numero_matriculadosf = value

        let { version_final } = this.entorno
        let { id_periodo, id_semestre } = this.periodo
        let { id_asignatura } = curso
        let { id_filial, id_modalidad } = this.user
        let obj = { matriculados: value }

        const res = await this.axios.post(`${this.URL}js-upt-asigdoc-matr/${version_final}/${id_periodo}/${id_semestre}/${id_asignatura}/${id_filial}/${id_modalidad}`, obj, this.autho)
      
        if(res.status !== 201)  return

        if (id_modalidad == 1) {
          await this.getDetalleAsignatura(curso)
        }
        
        if (id_modalidad == 2) {
          await this.getDetalleAsignaturaSP(curso)
        }
      } catch (err) {
        await this.getCursosEspecificos(this.user)
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async getDetalleAsignaturaSP (curso) {
      try {
        const res = await this.axios.get(`${this.URL}js-det-asignatura/${this.entorno.version_final}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}`)

        if(res.status !== 200) return

        let { sp_phorasteoricas, aforo_ht, sp_phoraspracticas, aforo_hp, sp_vhorasteoricas, aforo_svht, sp_vhoraspracticas, aforo_svhp } = res.data.data

        if (sp_phorasteoricas > 0 && aforo_ht > 0) {
          await this.calcSalones(curso, aforo_ht, 'spht')
        }

        if (sp_phoraspracticas > 0 && aforo_hp > 0) {
          await this.calcSalones(curso, aforo_hp, 'sphp')
        }

        if (sp_vhorasteoricas > 0 && aforo_svht > 0) {
          await this.calcSalones(curso, aforo_svht, 'svht')
        }

        if (sp_vhoraspracticas > 0 && aforo_svhp > 0) {
          await this.calcSalones(curso, aforo_svhp, 'svhp')
        }
        
        if (sp_vhoraspracticas <= 0 && sp_vhorasteoricas <= 0 && sp_phoraspracticas <= 0 && sp_phorasteoricas <= 0) {
          this.swAlert('La asignatura no cuenta con horas lectivas registradas, ¡VERIFIQUE LOS DATOS DEL CURSO!', 'warning')
          curso.numero_matriculadosf = 0
        }
      } catch (err) {
        console.dir(err)
      }
    },

    async getDetalleAsignatura (curso) {
      try {
        const res = await this.axios.get(`${this.URL}js-det-asignatura/${this.entorno.version_final}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}`)

        if(res.status !== 200) return

        let { horas_teoricas, aforo_ht, horas_practicas, aforo_hp } = res.data.data

        if (horas_teoricas > 0 && aforo_ht > 0) {
          await this.calcSalones(curso, aforo_ht, 'ht')
        }

        if (horas_practicas > 0 && aforo_hp > 0) {
          await this.calcSalones(curso, aforo_hp, 'hp')
        }

        if (aforo_ht <= 0 && aforo_hp <= 0) {
          this.swAlert('La asignatura no cuenta con aforos suficientes, ¡VERIFIQUE LOS DATOS DEL CURSO!', 'warning')
          curso.numero_matriculadosf = 0
        }
      } catch (err) {
        console.dir(err)
      }
    },

    async calcSalones (curso, aforoT, hora) {
      let salones = Math.floor(curso.numero_matriculadosf / aforoT)
      let viudas = curso.numero_matriculadosf % aforoT
      if (viudas >= this.entorno.nviudas_sp) {
        salones += 1
      }
      let alumnosSalon = Math.floor(curso.numero_matriculadosf / salones)
      let alumnosSobrantes = curso.numero_matriculadosf - alumnosSalon * salones

      let arrSal = await this.getSalonesAsignados(curso, hora)

      let arrSalones = await this.asignarCantidadAlumnos(salones, alumnosSalon, alumnosSobrantes, curso, hora)

      if(!arrSal) {
        arrSalones = arrSalones.map(sal => {
          sal.reg_usuario = this.identity.id_usuario
          return sal
        })
        
        await this.axios.post(`${this.URL}js-ins-seccion-arr`, {arr: arrSalones})
          .then(res => {
          })
          .catch(err => {
            console.dir(err)
          })
        return
      }

      if(arrSal.length < arrSalones.length) {
        arrSal = await this.getSalonesAsignados(curso, hora)

        let diferencia = arrSalones.length - arrSal.length
        let indice = arrSalones.length - diferencia

        arrSal = arrSal.map((salon, index) => {
          salon.numero_alumnos_seccion = arrSalones[index].numero_alumnos_seccion
          return salon
        })

        await this.actualizarSalonRestante(arrSal)
        
        let arr = []

        for (let i = indice; i < arrSalones.length; i++) {
          arrSalones[i].reg_usuario = this.identity.id_usuario
          arr.push(arrSalones[i])
        }

        await this.axios.post(`${this.URL}js-ins-seccion-arr`, {arr})
          .then(res => {
          })
          .catch(err => {
            console.dir(err)
          })
        return
      }

      let diferencia = arrSal.length - arrSalones.length
      let indice = arrSal.length - diferencia
      let arr = []

      for (let i = indice; i < arrSal.length; i++) {
        arr.push(arrSal[i].id_asigdoc)
      }

      await this.eliminarSalonRestante(arr)

      arrSal = await this.getSalonesAsignados(curso, hora)

      arrSal = await this.asignarCantidadAlumnosE(salones, alumnosSalon, alumnosSobrantes, arrSal)

      await this.actualizarSalonRestante(arrSal)
    },

    // salon nuevo
    async asignarCantidadAlumnos (salones, alumnosSalon, alumnosSobrantes, curso, th) {

      let arrSalones = []

      for (let index = 0; index < salones; index++) {
        let gxasigdoc = new GxAsigDoc();
        gxasigdoc.numero_alumnos_seccion = alumnosSalon
        gxasigdoc.numero_matriculados = curso.numero_matriculadosf
        gxasigdoc.id_curso = curso.id_asignatura
        gxasigdoc.id_filial = this.user.id_filial
        gxasigdoc.id_modalidad = this.user.id_modalidad
        gxasigdoc.id_periodo = this.periodo.id_periodo
        gxasigdoc.id_semestre = this.periodo.id_semestre
        gxasigdoc.numero_seccion = index + 1
        gxasigdoc.tipo_hora = th
        gxasigdoc.version = this.entorno.version_final
        arrSalones.push(gxasigdoc)
      }

      for (let i = 0; i < alumnosSobrantes; i++) {
        arrSalones[i].numero_alumnos_seccion += 1
      }

      return arrSalones
    },

    // salon existente
    async asignarCantidadAlumnosE (salones, alumnosSalon, alumnosSobrantes, arr) {

      let arrN = []

      arrN = arr.map(a => {
        a.numero_alumnos_seccion = alumnosSalon
        return a
      })

      for (let i = 0; i < alumnosSobrantes; i++) {
        arr[i].numero_alumnos_seccion += 1
      }

      return arrN
    },

    async getSalonesAsignados (curso, tipo_hora) {
      try {
        let { version_final } = this.entorno
        let { id_periodo, id_semestre } = this.periodo
        let { id_asignatura } = curso
        let { id_filial, id_modalidad } = this.user

        const res = await this.axios.get(`${this.URL}js-salonesesp-asigdoc/${version_final}/${id_periodo}/${id_semestre}/${id_asignatura}/${id_filial}/${id_modalidad}/${tipo_hora}`)

        if (res.status !== 200) return

        return res.data.data
      } catch (err) {
        console.dir(err)
        return null
      }
    },

    async eliminarSalonRestante (arr) {
      try {
        const res = await this.axios.post(`${this.URL}js-del-seccion-arr`, {arr: arr}, this.autho)
        if (res.status === 201) {

        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async actualizarSalonRestante (arr) {
      try {
        const res = await this.axios.put(`${this.URL}js-upt-alum-seccion-arr`, {arr: arr})

        if (res.status !== 201) return

      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async verificarAsig (curso, veri) {
      if (!this.facAvtive) return

      curso.id_periodo = this.periodo.id_periodo
      curso.id_semestre = this.periodo.id_semestre
      curso.id_curso = curso.id_asignatura
      curso.id_filial = this.user.id_filial
      curso.id_modalidad = this.user.id_modalidad

      if(curso.numero_matriculadosf <= 0) {
        this.swAlert('Asigne alumnos a este curso primero', 'warning')
        return 
      }

      curso.cverificado = veri

      try {
        const res = await this.axios.post(`${this.URL}js-verificar-asigdoc`, curso)

        if(res.status !== 201) return

      } catch (err) {
        console.dir(err)
      }
    },

    async updateAforoHp(value, curso, id_filial) {
      try {
        const res = await this.axios.post(`${this.URL}js-aforohp-asig/${value}/${curso.id_asignatura}/${id_filial}`)
        
        if(res.status !== 201) return

        curso.aforo_hp = value
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async updateAforoHt(value, curso, id_filial) {
      try {
        const res = await this.axios.post(`${this.URL}js-aforoht-asig/${value}/${curso.id_asignatura}/${id_filial}`)
        
        if(res.status !== 201) return

        curso.aforo_ht = value
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async cambiarAforo (curso, aforo, hora) {
      if (!this.facAvtive) return

      if(curso.cverificado == 1) {
        this.swAlert(`No se puede modificar un curso verificado`, 'warning')
        return
      }

      if (this.periodo.estado != 1) return

      if(parseInt(curso.numero_matriculadosf) > 0) {
        this.swAlert(`La asignatura ya cuenta con alumnos matriculados, coloque la cantidad de matriculados en 0 para poder cambiar los aforos`, 'warning')
        return
      }
      
      this.$prompt(`Cambiar aforo (${hora}) en ${curso.asignatura}`, 'SIGEDO', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then( async ({
        value
      }) => {
        if (hora == 'hp') {
          // if(value <= 0) {
          //   this.swAlert(`El número de horas prácticas no puede ser 0`, 'warning')
          //   return
          // }
          await this.updateAforoHp(value, curso, this.user.id_filial)
        }
        if (hora == 'ht') {
          // if(value <= 0) {
          //   this.swAlert(`El número de horas prácticas no puede ser 0`, 'warning')
          //   return
          // }
          await this.updateAforoHt(value, curso, this.user.id_filial)
        }
      })
      .catch(err => {

      })
    },

    tableEvent (curso, column, event) {
      if(this.periodo.estado != 1) {
        this.swAlert(`Este perido no esta activo`, 'error')
        return
      }

      if(curso.nombre_padre != '') {
        this.swAlert(`El curso ha sido fusionado con el curso: ${curso.nombre_padre}`, 'warning')
        return
      }

      if (column.property === 'asignatura') {
        this.openModal(curso)
      }
      if (column.property === 'aforo_ht') {
        this.cambiarAforo(curso, curso.aforo_ht, 'ht')
      }
      if (column.property === 'aforo_hp') {
        this.cambiarAforo(curso, curso.aforo_hp, 'hp')
      }
      if (column.property === 'numero_matriculadosf') {
        this.updateRegister(curso)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  color: #000;
}

.loading {
  text-align: center;
}

.table-asig {
  max-height: 500px;
}

.td-matric {
  transition: 1s;
  & i {
    transition: 1s;
    display: none;
  }
  &:hover {
    & i {
      display: inline;
      font-size: 1.5em;
    }
  }
}

</style>

