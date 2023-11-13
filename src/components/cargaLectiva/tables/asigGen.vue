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

  <div v-if="load" class="ed-item gr-center">
    <loading />
  </div>

  <div v-else class="ed-item sep-10 m-95 l-90 to-center ed-container table-content">
    <table class="table table-responsive table-striped table-bordered hover table-own table-asig">
      <thead class="table-head">
        <tr>
          <th class="w-35">#</th>
          <th>PLAN</th>
          <th>CICLO</th>
          <th>ASIGNATURA</th>
          <th>AFORO HT</th>
          <th>AFORO HP</th>
          <th>MATRICULADOS</th>
          <th>SALONES</th>
          <th>VERFICADO</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(curso, index) in cursosGenFilter" :key="index">
          <td class="w-35">{{index+1}}</td>
          <td class="w-50">{{curso.anio}}</td>
          <td class="w-50">{{curso.ciclo}}</td>
          <td class="f-row f-space-bt">
            {{curso.asignatura}}
            <span v-if="facAvtive" class="hint--left hint--bounce hint--error" :aria-label="`Asignar docentes en ${curso.asignatura}`">
              <i v-if="periodo.estado == 1" @click="abrirAsigDocentesEsp(curso)" class="fas fa-edit action pointer"></i>
            </span>
          </td>
          <!-- @click="cambiarAforo(curso, curso.aforo_ht, 'ht')" -->
          <td @click="cambiarAforo(curso, curso.aforo_ht, 'ht')" class="w-30 pointer">
            <!-- class="hint--right" aria-label="Insertar Aforo" -->
            <span class="hint--right" :aria-label="facAvtive ? 'Insertar Aforo' : ''">
              {{curso.aforo_ht}}
            </span>
          </td>
          <!-- @click="cambiarAforo(curso, curso.aforo_hp, 'hp')" -->
          <td @click="cambiarAforo(curso, curso.aforo_hp, 'hp')" class="w-30 pointer">
            <!-- class="hint--right" aria-label="Insertar Aforo" -->
            <span class="hint--right" :aria-label="facAvtive ? 'Insertar Aforo' : ''">
              {{curso.aforo_hp}}
            </span>
          </td>
          <td @click="actualizarMatriculados(curso)" class="td-matric">
            <span v-if="facAvtive" class="hint--left hint--bounce hint--warning" :aria-label="`Actualizar matriculados en ${curso.asignatura}`">
              <i v-if="periodo.estado == 1" class="fas fa-chalkboard-teacher action pointer"></i>
            </span>
            {{curso.numero_matriculadosf}}
          </td>
          <td class="w-20" @click="verSalones(curso)">
            <span class="hint--left hint--bounce hint--info" :aria-label="`Ver salones para ${curso.asignatura}`">
              <i class="fas fa-graduation-cap action pointer"></i>
            </span>
          </td>
          <td class="w-10">
            <span :class="facAvtive ? 'hint--left' : ''" :aria-label="curso.cverificado == 1 ? 'Verificado, ¿Quitar Verificación?' : '¿Verificar?'">
              <i @click="verificarAsigDoc(curso, 0)" v-if="curso.cverificado == 1" class="fas fa-check-square action green"></i>
              <i @click="verificarAsigDoc(curso, 1)" v-else class="fas fa-times action pointer red"></i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="loadAjax" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import Animate from '../../../helpers/animate'

import pagination from '../../templates/pagination.vue'
import loading from '../../templates/loading.vue'
import loader from '../../templates/loader.vue'

import GxAsigDoc from '../../../models/gx_asigdoc.js'

export default {
  mixins: [
    MixinInit
  ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) {
        next('/')
        return
      } 
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if(!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {
    pagination,
    loading,
    loader
  },

  props: ['user'],

  data() {
    return {
      cursosGen: null,
      filterCurso: '',
      cursosGenFilter: null,

      salonesTeoricos: [],
      salonesPracticos: [],

      salonesTeoricosSP: [],
      salonesPracticosSP: [],

      salonesTeoricosSV: [],
      salonesPracticosSV: [],

      load: false,

      loadAjax: false,
      planes: [],
      planSel: '0',

      ciclos: [],
      cicloSel: '0'
    }
  },

  watch: {
    filterCurso: function (n) {
      this.filterCurso = n.toUpperCase()
      if (n == '') {
        if (this.planSel == '0') {
          this.cursosGenFilter = this.cursosGen
        } else {
          if (this.cicloSel == 0) {
            this.cursosGenFilter = this.cursosGen.filter(curso => curso.anio == this.planSel)
          } else {
            this.cursosGenFilter = this.cursosGen.filter(curso => curso.anio == this.planSel && curso.ciclo == this.cicloSel)
          }
        }
      } else {
        if (this.planSel == '0') {
          this.cursosGenFilter = this.cursosGen.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()))
        } else {
          if (this.cicloSel == 0) {
            this.cursosGenFilter = this.cursosGen.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()) && curso.anio == this.planSel)
          } else {
            this.cursosGenFilter = this.cursosGen.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()) && curso.anio == this.planSel && curso.ciclo == this.cicloSel)
          }
        }
        // this.cursosGenFilter = this.cursosGen.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()))
      }
    },

    planSel: function (n) {
      if (n == 0) {
        this.ciclos = []
        this.cursosGenFilter = this.cursosGen
      } else {
        this.cicloSel = '0'
        this.ciclos = []
        this.cursosGen.map(cur => {
          if (cur.anio == n) {
            if (!this.ciclos.some(c => c == cur.ciclo)) {
              this.ciclos.push(cur.ciclo)
            }
          }
        })

        this.ciclos.sort((a, b) => {
          return a - b
        })

        this.cursosGenFilter = this.cursosGen.filter(curso => curso.anio == n)
      }
    },

    cicloSel: function (n) {
      if (n == 0) {
        this.cursosGenFilter = this.cursosGen.filter(curso => curso.anio == this.planSel)
      } else {
        this.cursosGenFilter = this.cursosGen.filter(curso => curso.anio == this.planSel && curso.ciclo == n)
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

    getCursosEspecificos: async function (user) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}cursos-gen/${user.id_facultad}/${user.id_filial}/${user.id_modalidad}/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)

        if (res.status === 200) {
          this.cursosGen = res.data.data
          this.cursosGen = this.cursosGen.filter(curso => {
            if (curso.anio == 2007 && curso.ciclo < 6) {

            } else {
              return curso
            }
          })
          this.cursosGenFilter = this.cursosGen

          this.planes = []
          this.cursosGen.map(cur => {
            if (!this.planes.some(p => p == cur.anio)) {
              this.planes.push(cur.anio)
            }
          })
        }
      } catch (err) {
        this.cursosGen = null
        this.$hlp.errors(err)
      }
      loading.close()
    },

    abrirAsigDocentesEsp: async function (curso) {
      this.$emit('loader')
      await this.getSalonesAsignados(curso, 'ht')
      await this.getSalonesAsignados(curso, 'hp')

      await this.getSalonesAsignadosSP(curso, 'spht')
      await this.getSalonesAsignadosSP(curso, 'sphp')

      await this.getSalonesAsignadosSV(curso, 'svht')
      await this.getSalonesAsignadosSV(curso, 'svhp')

      curso.id_filial = this.user.id_filial
      curso.id_modalidad = this.user.id_modalidad

      this.$emit('asig', {
        curso: curso,
        teorico: this.salonesTeoricos,
        practico: this.salonesPracticos,
        spteorico: this.salonesTeoricosSP,
        sppractico: this.salonesPracticosSP,
        svteorico: this.salonesTeoricosSV,
        svpractico: this.salonesPracticosSV,
        facultad: this.user
      })
    },

    eliminarTodosSalones: async function (curso) {
      this.loadAjax = true
      await this.axios.post(`${this.URL}js-delete-salones/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.entorno.version_final}`, {}, this.autho)
        .then(res => {
          // 
          // vm.getCursosEspecificos()
        })
        .catch(err => {
          console.dir(err)
        })
      this.loadAjax = false
    },

    actualizarMatriculados: function (curso) {
      if (!this.facAvtive) {
        return
      }

      if (this.periodo.estado == 1) {
        const vm = this

        alertify.prompt('Input (number):').set('type', 'number')
        alertify.prompt('SIGEDO', `Actualizar número de matriculados en ${curso.asignatura}`, curso.numero_matriculadosf, (evt, value) => {
          // 
          let viudas
          // 
          if (vm.user.id_modalidad == 1) {
            viudas = parseInt(vm.entorno.nviudas_p)
          } else if (vm.user.id_modalidad == 2) {
            viudas = parseInt(vm.entorno.nviudas_sp)
          }
          // 
          // 
          // 

          if (value >= parseInt(viudas)) {
            if (curso.numero_matriculadosf != value) {
              vm.actualizarMatriculadosBD(curso, value)
            }
          } else {
            if (value > 0) {
              alertify.alert('SIGEDO', `El número de alumnos no puede ser menor de ${viudas}`)
            }
            // if(curso.numero_matriculadosf)
            curso.numero_matriculadosf = 0
            vm.eliminarTodosSalones(curso)
          }
        }, function () {

        })
      }
    },

    actualizarMatriculadosBD: async function (curso, value) {
      this.loadAjax = true
      try {
        curso.numero_matriculadosf = value
        const res = await this.axios.post(`${this.URL}js-upt-asigdoc-matr/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}`, {
          matriculados: value
        }, this.autho)

        if (res.status === 201) {
          if (this.user.id_modalidad == 1) {
            this.getDetalleAsignatura(curso)
            this.verificarAsigDoc(curso, 0)
          } else if (this.user.id_modalidad == 2) {
            this.getDetalleAsignaturaSP(curso)
          }
        }
      } catch (err) {
        this.getCursosEspecificos(this.user)
        this.$hlp.errors(err)
      }
      this.loadAjax = false
    },

    getDetalleAsignaturaSP: async function (curso) {
      await this.axios.get(`${this.URL}js-det-asignatura/${this.entorno.version_final}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}`)
        .then(res => {
          if (res.data.success) {
            // 
            if (res.data.data.sp_phorasteoricas > 0 && res.data.data.aforo_ht > 0) {
              this.calcularSalonesTeoricosSP(curso, res.data.data.aforo_ht)
            }

            if (res.data.data.sp_phoraspracticas > 0 && res.data.data.aforo_hp > 0) {
              // 
              this.calcularSalonesPracticasSP(curso, res.data.data.aforo_hp)
            }

            if (res.data.data.sp_vhorasteoricas > 0 && res.data.data.aforo_svht > 0) {
              this.calcularSalonesTeoricosSV(curso, res.data.data.aforo_svht)
            }

            if (res.data.data.sp_vhoraspracticas > 0 && res.data.data.aforo_svhp > 0) {
              this.calcularSalonesPracticasSV(curso, res.data.data.aforo_svhp)
            }

            if (res.data.data.sp_vhoraspracticas <= 0 && res.data.data.sp_vhorasteoricas <= 0 && res.data.data.sp_phoraspracticas <= 0 && res.data.data.sp_phorasteoricas <= 0) {
              alertify.alert('SIGEDO', 'La asignatura no cuenta con horas académicas registradas, ¡VERIFIQUE LOS DATOS DEL CURSO!')
              curso.numero_matriculadosf = 0
            }
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getDetalleAsignatura: async function (curso) {
      await this.axios.get(`${this.URL}js-det-asignatura/${this.entorno.version_final}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}`)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.horas_teoricas > 0 && res.data.data.aforo_ht > 0) {
              this.calcularSalonesTeoricos(curso, res.data.data.aforo_ht)
            }

            if (res.data.data.horas_practicas > 0 && res.data.data.aforo_hp > 0) {
              this.calcularSalonesPracticas(curso, res.data.data.aforo_hp)
            }

            if (res.data.data.aforo_ht <= 0 && res.data.data.aforo_hp <= 0) {
              alertify.alert('SIGEDO', 'La asignatura no cuenta con aforo en horas teóricas ni prácticas, ¡VERIFIQUE LOS DATOS DEL CURSO!')
              curso.numero_matriculadosf = 0
            }
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    calcularSalonesTeoricosSV: async function (curso, aforoT) {
      let salones = Math.floor(curso.numero_matriculadosf / aforoT)
      let viudas = curso.numero_matriculadosf % aforoT
      if (viudas >= this.entorno.nviudas_sp) {
        salones += 1
      }
      let alumnosSalon = Math.floor(curso.numero_matriculadosf / salones)
      let alumnosSobrantes = curso.numero_matriculadosf - alumnosSalon * salones

      await this.getSalonesAsignadosSV(curso, 'svht')

      let arrSalones = this.asignarCantidadAlumnos(salones, alumnosSalon, alumnosSobrantes, curso, 'svht')

      if (this.salonesTeoricosSV != null) {
        if (this.salonesTeoricosSV.length >= arrSalones.length) {
          let diferencia = this.salonesTeoricosSV.length - arrSalones.length
          let indice = this.salonesTeoricosSV.length - diferencia

          for (let i = indice; i < this.salonesTeoricosSV.length; i++) {
            await this.eliminarSalonRestante(this.salonesTeoricosSV[i].id_asigdoc)
          }

          await this.getSalonesAsignadosSV(curso, 'svht')

          this.salonesTeoricosSV = this.asignarCantidadAlumnosE(salones, alumnosSalon, alumnosSobrantes, this.salonesTeoricosSV)
          this.salonesTeoricosSV.forEach(sal => {
            this.actualizarSalonRestante(sal.id_asigdoc, sal.numero_alumnos_seccion)
          })
        } else {
          await this.getSalonesAsignadosSV(curso, 'svht')

          let diferencia = arrSalones.length - this.salonesTeoricosSV.length
          let indice = arrSalones.length - diferencia

          this.salonesTeoricosSV = this.salonesTeoricosSV.map((salon, index) => {
            salon.numero_alumnos_seccion = arrSalones[index].numero_alumnos_seccion
            this.actualizarSalonRestante(salon.id_asigdoc, salon.numero_alumnos_seccion)
            return salon
          })


          // for (let i = indice - 1; i==0; i--) {
          //     this.salonesTeoricosSV[i].numero_alumnos_seccion = arrSalones[i].numero_alumnos_seccion
          //     await this.actualizarSalonRestante(this.salonesTeoricosSV[i].id_asigdoc, this.salonesTeoricosSV[i].numero_alumnos_seccion)
          // }

          for (let i = indice; i < arrSalones.length; i++) {
            arrSalones[i].reg_usuario = this.identity.id_usuario
            await this.axios.post(`${this.URL}js-ins-seccion`, arrSalones[i])
              .then(res => {})
              .catch(err => {
                console.dir(err)
              })
          }

        }

      } else {
        arrSalones.forEach(sal => {
          sal.reg_usuario = this.identity.id_usuario
          this.axios.post(`${this.URL}js-ins-seccion`, sal)
            .then(res => {})
            .catch(err => {
              console.dir(err)
            })
        })
      }
    },

    calcularSalonesTeoricosSP: async function (curso, aforoT) {
      let salones = Math.floor(curso.numero_matriculadosf / aforoT)
      let viudas = curso.numero_matriculadosf % aforoT
      if (viudas >= this.entorno.nviudas_sp) {
        salones += 1
      }
      let alumnosSalon = Math.floor(curso.numero_matriculadosf / salones)
      let alumnosSobrantes = curso.numero_matriculadosf - alumnosSalon * salones

      await this.getSalonesAsignadosSP(curso, 'spht')

      let arrSalones = this.asignarCantidadAlumnos(salones, alumnosSalon, alumnosSobrantes, curso, 'spht')

      if (this.salonesTeoricosSP != null) {
        if (this.salonesTeoricosSP.length >= arrSalones.length) {
          let diferencia = this.salonesTeoricosSP.length - arrSalones.length
          let indice = this.salonesTeoricosSP.length - diferencia

          for (let i = indice; i < this.salonesTeoricosSP.length; i++) {
            await this.eliminarSalonRestante(this.salonesTeoricosSP[i].id_asigdoc)
          }

          await this.getSalonesAsignadosSP(curso, 'spht')

          this.salonesTeoricosSP = this.asignarCantidadAlumnosE(salones, alumnosSalon, alumnosSobrantes, this.salonesTeoricosSP)
          this.salonesTeoricosSP.forEach(sal => {
            this.actualizarSalonRestante(sal.id_asigdoc, sal.numero_alumnos_seccion)
          })
        } else {
          await this.getSalonesAsignadosSP(curso, 'spht')

          let diferencia = arrSalones.length - this.salonesTeoricosSP.length
          let indice = arrSalones.length - diferencia

          this.salonesTeoricosSP = this.salonesTeoricosSP.map((salon, index) => {
            salon.numero_alumnos_seccion = arrSalones[index].numero_alumnos_seccion
            this.actualizarSalonRestante(salon.id_asigdoc, salon.numero_alumnos_seccion)
            return salon
          })

          // for (let i = indice - 1; i==0; i--) {
          //     this.salonesTeoricosSP[i].numero_alumnos_seccion = arrSalones[i].numero_alumnos_seccion
          //     await this.actualizarSalonRestante(this.salonesTeoricosSP[i].id_asigdoc, this.salonesTeoricosSP[i].numero_alumnos_seccion)
          // }

          for (let i = indice; i < arrSalones.length; i++) {
            arrSalones[i].reg_usuario = this.identity.id_usuario
            await this.axios.post(`${this.URL}js-ins-seccion`, arrSalones[i])
              .then(res => {})
              .catch(err => {
                console.dir(err)
              })
          }

        }

      } else {
        arrSalones.forEach(sal => {
          sal.reg_usuario = this.identity.id_usuario
          this.axios.post(`${this.URL}js-ins-seccion`, sal)
            .then(res => {})
            .catch(err => {
              console.dir(err)
            })
        })
      }
    },

    calcularSalonesTeoricos: async function (curso, aforoT) {
      let salones = Math.floor(curso.numero_matriculadosf / aforoT)
      let viudas = curso.numero_matriculadosf % aforoT
      if (viudas >= this.entorno.nviudas_p) {
        salones += 1
      }
      let alumnosSalon = Math.floor(curso.numero_matriculadosf / salones)
      let alumnosSobrantes = curso.numero_matriculadosf - alumnosSalon * salones

      await this.getSalonesAsignados(curso, 'ht')

      let arrSalones = this.asignarCantidadAlumnos(salones, alumnosSalon, alumnosSobrantes, curso, 'ht')

      if (this.salonesTeoricos != null) {
        if (this.salonesTeoricos.length >= arrSalones.length) {
          let diferencia = this.salonesTeoricos.length - arrSalones.length
          let indice = this.salonesTeoricos.length - diferencia

          for (let i = indice; i < this.salonesTeoricos.length; i++) {
            await this.eliminarSalonRestante(this.salonesTeoricos[i].id_asigdoc)
          }

          await this.getSalonesAsignados(curso, 'ht')

          this.salonesTeoricos = this.asignarCantidadAlumnosE(salones, alumnosSalon, alumnosSobrantes, this.salonesTeoricos)
          this.salonesTeoricos.forEach(sal => {
            this.actualizarSalonRestante(sal.id_asigdoc, sal.numero_alumnos_seccion)
          })
        } else {
          await this.getSalonesAsignados(curso, 'ht')

          let diferencia = arrSalones.length - this.salonesTeoricos.length
          let indice = arrSalones.length - diferencia

          this.salonesTeoricos = this.salonesTeoricos.map((salon, index) => {
            salon.numero_alumnos_seccion = arrSalones[index].numero_alumnos_seccion
            this.actualizarSalonRestante(salon.id_asigdoc, salon.numero_alumnos_seccion)
            return salon
          })


          // for (let i = indice - 1; i==0; i--) {
          //     this.salonesTeoricos[i].numero_alumnos_seccion = arrSalones[i].numero_alumnos_seccion
          //     await this.actualizarSalonRestante(this.salonesTeoricos[i].id_asigdoc, this.salonesTeoricos[i].numero_alumnos_seccion)
          // }

          for (let i = indice; i < arrSalones.length; i++) {
            arrSalones[i].reg_usuario = this.identity.id_usuario
            await this.axios.post(`${this.URL}js-ins-seccion`, arrSalones[i])
              .then(res => {})
              .catch(err => {
                console.dir(err)
              })
          }

        }

      } else {
        arrSalones.forEach(sal => {
          sal.reg_usuario = this.identity.id_usuario
          this.axios.post(`${this.URL}js-ins-seccion`, sal)
            .then(res => {})
            .catch(err => {
              console.dir(err)
            })
        })
      }
    },

    calcularSalonesPracticasSV: async function (curso, aforoP) {
      let salones = Math.floor(curso.numero_matriculadosf / aforoP)
      let viudas = curso.numero_matriculadosf % aforoP
      if (viudas >= this.entorno.nviudas_sp) {
        salones += 1
      }
      let alumnosSalon = Math.floor(curso.numero_matriculadosf / salones)
      let alumnosSobrantes = curso.numero_matriculadosf - alumnosSalon * salones

      await this.getSalonesAsignadosSV(curso, 'svhp')

      let arrSalones = this.asignarCantidadAlumnos(salones, alumnosSalon, alumnosSobrantes, curso, 'svhp')

      if (this.salonesPracticosSV != null) {
        if (this.salonesPracticosSV.length >= arrSalones.length) {
          let diferencia = this.salonesPracticosSV.length - arrSalones.length
          let indice = this.salonesPracticosSV.length - diferencia

          for (let i = indice; i < this.salonesPracticosSV.length; i++) {
            await this.eliminarSalonRestante(this.salonesPracticosSV[i].id_asigdoc)
          }

          await this.getSalonesAsignadosSV(curso, 'svhp')

          this.salonesPracticosSV = this.asignarCantidadAlumnosE(salones, alumnosSalon, alumnosSobrantes, this.salonesPracticosSV)
          this.salonesPracticosSV.forEach(sal => {
            this.actualizarSalonRestante(sal.id_asigdoc, sal.numero_alumnos_seccion)
          })
        } else {
          await this.getSalonesAsignadosSV(curso, 'svhp')

          let diferencia = arrSalones.length - this.salonesPracticosSV.length
          let indice = arrSalones.length - diferencia

          this.salonesPracticosSV = this.salonesPracticosSV.map((salon, index) => {
            salon.numero_alumnos_seccion = arrSalones[index].numero_alumnos_seccion
            this.actualizarSalonRestante(salon.id_asigdoc, salon.numero_alumnos_seccion)
            return salon
          })

          // for (let i = indice - 1; i==0; i--) {
          //     this.salonesPracticosSV[i].numero_alumnos_seccion = arrSalones[i].numero_alumnos_seccion
          //     await this.actualizarSalonRestante(this.salonesPracticosSV[i].id_asigdoc, this.salonesPracticosSV[i].numero_alumnos_seccion)
          // }

          for (let i = indice; i < arrSalones.length; i++) {
            arrSalones[i].reg_usuario = this.identity.id_usuario
            await this.axios.post(`${this.URL}js-ins-seccion`, arrSalones[i])
              .then(res => {})
              .catch(err => {
                console.dir(err)
              })
          }

        }

      } else {
        arrSalones.forEach(sal => {
          sal.reg_usuario = this.identity.id_usuario
          this.axios.post(`${this.URL}js-ins-seccion`, sal)
            .then(res => {})
            .catch(err => {
              console.dir(err)
            })
        })
      }
    },

    calcularSalonesPracticasSP: async function (curso, aforoP) {
      // 
      let salones = Math.floor(curso.numero_matriculadosf / aforoP)
      let viudas = curso.numero_matriculadosf % aforoP
      if (viudas >= this.entorno.nviudas_sp) {
        salones += 1
      }
      let alumnosSalon = Math.floor(curso.numero_matriculadosf / salones)
      let alumnosSobrantes = curso.numero_matriculadosf - alumnosSalon * salones

      await this.getSalonesAsignadosSP(curso, 'sphp')

      let arrSalones = this.asignarCantidadAlumnos(salones, alumnosSalon, alumnosSobrantes, curso, 'sphp')

      // 

      if (this.salonesPracticosSP != null) {
        if (this.salonesPracticosSP.length >= arrSalones.length) {
          let diferencia = this.salonesPracticosSP.length - arrSalones.length
          let indice = this.salonesPracticosSP.length - diferencia

          for (let i = indice; i < this.salonesPracticosSP.length; i++) {
            await this.eliminarSalonRestante(this.salonesPracticosSP[i].id_asigdoc)
          }

          await this.getSalonesAsignadosSP(curso, 'sphp')

          this.salonesPracticosSP = this.asignarCantidadAlumnosE(salones, alumnosSalon, alumnosSobrantes, this.salonesPracticosSP)
          this.salonesPracticosSP.forEach(sal => {
            this.actualizarSalonRestante(sal.id_asigdoc, sal.numero_alumnos_seccion)
          })
        } else {
          await this.getSalonesAsignadosSP(curso, 'sphp')

          let diferencia = arrSalones.length - this.salonesPracticosSP.length
          let indice = arrSalones.length - diferencia

          this.salonesPracticosSP = this.salonesPracticosSP.map((salon, index) => {
            salon.numero_alumnos_seccion = arrSalones[index].numero_alumnos_seccion
            this.actualizarSalonRestante(salon.id_asigdoc, salon.numero_alumnos_seccion)
            return salon
          })


          // for (let i = indice - 1; i==0; i--) {
          //     this.salonesPracticosSP[i].numero_alumnos_seccion = arrSalones[i].numero_alumnos_seccion
          //     await this.actualizarSalonRestante(this.salonesPracticosSP[i].id_asigdoc, this.salonesPracticosSP[i].numero_alumnos_seccion)
          // }

          for (let i = indice; i < arrSalones.length; i++) {
            arrSalones[i].reg_usuario = this.identity.id_usuario
            await this.axios.post(`${this.URL}js-ins-seccion`, arrSalones[i])
              .then(res => {
              })
              .catch(err => {
                console.dir(err)
              })
          }

        }

      } else {
        arrSalones.forEach(sal => {
          sal.reg_usuario = this.identity.id_usuario
          this.axios.post(`${this.URL}js-ins-seccion`, sal)
            .then(res => {})
            .catch(err => {
              console.dir(err)
            })
        })
      }
    },


    calcularSalonesPracticas: async function (curso, aforoP) {
      let salones = Math.floor(curso.numero_matriculadosf / aforoP)
      let viudas = curso.numero_matriculadosf % aforoP
      if (viudas >= this.entorno.nviudas_p) {
        salones += 1
      }
      let alumnosSalon = Math.floor(curso.numero_matriculadosf / salones)
      let alumnosSobrantes = curso.numero_matriculadosf - alumnosSalon * salones

      await this.getSalonesAsignados(curso, 'hp')

      let arrSalones = this.asignarCantidadAlumnos(salones, alumnosSalon, alumnosSobrantes, curso, 'hp')

      if (this.salonesPracticos != null) {
        // 
        // 
        if (this.salonesPracticos.length >= arrSalones.length) {
          let diferencia = this.salonesPracticos.length - arrSalones.length
          let indice = this.salonesPracticos.length - diferencia

          for (let i = indice; i < this.salonesPracticos.length; i++) {
            await this.eliminarSalonRestante(this.salonesPracticos[i].id_asigdoc)
          }

          await this.getSalonesAsignados(curso, 'hp')

          this.salonesPracticos = this.asignarCantidadAlumnosE(salones, alumnosSalon, alumnosSobrantes, this.salonesPracticos)
          this.salonesPracticos.forEach(sal => {
            this.actualizarSalonRestante(sal.id_asigdoc, sal.numero_alumnos_seccion)
          })
        } else {
          await this.getSalonesAsignados(curso, 'hp')
          let diferencia = arrSalones.length - this.salonesPracticos.length
          let indice = arrSalones.length - diferencia

          this.salonesPracticos = this.salonesPracticos.map((salon, index) => {
            salon.numero_alumnos_seccion = arrSalones[index].numero_alumnos_seccion
            this.actualizarSalonRestante(salon.id_asigdoc, salon.numero_alumnos_seccion)
            return salon
          })

          // for (let i = indice - 1; i==0; i = i - 1) {
          //     this.salonesPracticos[i].numero_alumnos_seccion = arrSalones[i].numero_alumnos_seccion
          //     
          //     await this.actualizarSalonRestante(this.salonesPracticos[i].id_asigdoc, this.salonesPracticos[i].numero_alumnos_seccion)
          // }

          for (let i = indice; i < arrSalones.length; i++) {
            arrSalones[i].reg_usuario = this.identity.id_usuario
            await this.axios.post(`${this.URL}js-ins-seccion`, arrSalones[i])
              .then(res => {})
              .catch(err => {
                console.dir(err)
              })
          }

        }

      } else {
        arrSalones.forEach(sal => {
          sal.reg_usuario = this.identity.id_usuario
          this.axios.post(`${this.URL}js-ins-seccion`, sal)
            .then(res => {})
            .catch(err => {
              console.dir(err)
            })
        })
      }
    },

    // salon nuevo
    asignarCantidadAlumnos: function (salones, alumnosSalon, alumnosSobrantes, curso, th) {

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
    asignarCantidadAlumnosE: function (salones, alumnosSalon, alumnosSobrantes, arr) {

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

    getSalonesAsignadosSV: async function (curso, tipo_hora) {
      try {
        const res = await this.axios.get(`${this.URL}js-salonesesp-asigdoc/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}/${tipo_hora}`, this.autho)

        if (res.status === 200) {
          if (tipo_hora == 'svht') {
            this.salonesTeoricosSV = res.data.data
          } else if (tipo_hora == 'svhp') {
            this.salonesPracticosSV = res.data.data
          }
        }
      } catch (err) {
        if (tipo_hora == 'svht') {
          this.salonesTeoricosSV = null
        } else if (tipo_hora == 'svhp') {
          this.salonesPracticosSV = null
        }
        this.$hlp.errors(err)
      }
    },

    getSalonesAsignadosSP: async function (curso, tipo_hora) {
      try {
        const res = await this.axios.get(`${this.URL}js-salonesesp-asigdoc/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}/${tipo_hora}`, this.autho)

        if (res.status === 200) {
          if (tipo_hora == 'spht') {
            this.salonesTeoricosSP = res.data.data
          } else if (tipo_hora == 'sphp') {
            this.salonesPracticosSP = res.data.data
          }
        }
      } catch (err) {
        if (tipo_hora == 'spht') {
          this.salonesTeoricosSP = null
        } else if (tipo_hora == 'sphp') {
          this.salonesPracticosSP = null
        }
        this.$hlp.errors(err)
      }
    },


    getSalonesAsignados: async function (curso, tipo_hora) {
      try {
        const res = await this.axios.get(`${this.URL}js-salonesesp-asigdoc/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${curso.id_asignatura}/${this.user.id_filial}/${this.user.id_modalidad}/${tipo_hora}`, this.autho)

        if (res.status === 200) {
          if (tipo_hora == 'ht') {
            this.salonesTeoricos = res.data.data
          } else if (tipo_hora == 'hp') {
            this.salonesPracticos = res.data.data
          }
        }
      } catch (err) {
        if (tipo_hora == 'ht') {
          this.salonesTeoricos = null
        } else if (tipo_hora == 'hp') {
          this.salonesPracticos = null
        }
        this.$hlp.errors(err)
      }
    },

    eliminarSalonRestante: async function (id_asigdoc) {
      this.loadAjax = true
      try {
        const res = await this.axios.delete(`${this.URL}js-del-seccion/${id_asigdoc}`, this.autho)

        if (res.status === 201) {

        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.loadAjax = false
    },

    actualizarSalonRestante: async function (id_asigdoc, alumnos) {
      this.loadAjax = true
      try {
        const res = await this.axios.put(`${this.URL}js-upt-alum-seccion/${id_asigdoc}/${alumnos}`, {}, this.autho)
        if (res.status === 201) {

        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.loadAjax = false
    },

    verSalones: async function (curso) {
      this.$emit('loader')
      await this.getSalonesAsignados(curso, 'ht')
      await this.getSalonesAsignados(curso, 'hp')

      await this.getSalonesAsignadosSP(curso, 'spht')
      await this.getSalonesAsignadosSP(curso, 'sphp')

      await this.getSalonesAsignadosSV(curso, 'svht')
      await this.getSalonesAsignadosSV(curso, 'svhp')


      this.$emit('salones', {
        curso: curso,
        teorico: this.salonesTeoricos,
        practico: this.salonesPracticos,
        spteorico: this.salonesTeoricosSP,
        sppractico: this.salonesPracticosSP,
        svteorico: this.salonesTeoricosSV,
        svpractico: this.salonesPracticosSV,
        facultad: this.user,
        isFacu: true
      })

    },

    verificarAsigDoc: async function (curso, veri) {
      if (!this.facAvtive) {
        return
      }
      curso.id_periodo = this.periodo.id_periodo
      curso.id_semestre = this.periodo.id_semestre
      curso.id_curso = curso.id_asignatura
      curso.id_filial = this.user.id_filial
      curso.id_modalidad = this.user.id_modalidad

      if (curso.numero_matriculadosf > 0) {
        curso.cverificado = veri
        await this.axios.post(`${this.URL}js-verificar-asigdoc`, curso, this.autho)
          .then(res => {

          })
          .catch(err => {
            console.dir(err)
          })
      } else {
        alertify.alert('SIGEDO', 'Asigne alumnos a este curso primero')
      }
    },

    cambiarAforo: function (curso, aforo, hora) {
      if (!this.facAvtive) {
        return
      }
      // if (aforo <= 0) {
      // 
      const vm = this

      alertify.prompt('Input (number):').set('type', 'number')
      alertify.prompt('SIGEDO', `Cambiar aforo (${hora}) en ${curso.asignatura}`, 0, (evt, value) => {

        if (hora == 'hp') {
          if (curso.horas_practicas > 0) {
            vm.axios.post(`${vm.URL}js-aforohp-asig/${value}/${curso.id_asignatura}/${this.user.id_filial}`)
              .then(res => {
                if (res.data.success) {
                  curso.aforo_hp = value
                } else {
                  alertify.alert('SYSTEM 32', 'Error 20129x2131: error al actualizar aforo ')
                }
                // 
              })
              .catch(err => console.dir(err))
          } else {
            alertify.alert('SIGEDO', 'El numero de horas prácticas para el curso es 0')
          }
        } else if (hora == 'ht') {
          if (curso.horas_teoricas > 0) {
            vm.axios.post(`${vm.URL}js-aforoht-asig/${value}/${curso.id_asignatura}/${this.user.id_filial}`)
              .then(res => {
                if (res.data.success) {
                  curso.aforo_ht = value
                } else {
                  alertify.alert('SYSTEM 32', 'Error 20129x2131:  error al actualizar aforo ')
                }
                // 
              })
              .catch(err => console.dir(err))
          } else {
            alertify.alert('SIGEDO', 'El numero de horas teóricas para el curso es 0')
          }
        }

      }, function () {

      })
      // }
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

