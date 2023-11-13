<template>
  <div class="ed-container">
    <div class="ed-item text-center">
      <el-tag type="info">Día: {{ dia.name }}</el-tag>
      <el-tag type="info">Inicio: {{ hora.inicio }}</el-tag>
      <el-tag type="info">Fin: {{ hora.fin }}</el-tag>
    </div>

    <div class="ed-item m-80 l-50 to-center sep-10">
      <el-select :disabled="!asigdocId" size="mini" v-model="aulaId" placeholder="Seleccionar Aula" filterable>
        <el-option v-for="(a, i) in aulas"
          :key="i"
          :label="a.codigo"
          :value="a.id">
        </el-option>
      </el-select>
    </div>

    <div class="ed-item m-20 l-50 to-center sep-10 text-center">
      <el-button :disabled="!asigdocId || !aulaId" @click="regiterHorario" size="mini" type="primary">OK!</el-button>
    </div>

    <div class="ed-item ed-container text-center">
      <el-card style="" @click.native="selectCurso(curso)" v-for="(curso, i) in cursos" :key="i" :class="['box-card CardCursos ed-item m-50 l-30 to-center', curso.id_asigdoc == asigdocId ? 'selected' : '']">
          <div class="text item">
            Curso: {{ curso.curso.nombre }}
          </div>
          <div class="text item">
            Horas ({{ curso.tipo_hora }}): {{ curso.curso[curso.tipo_hora] }}
          </div>
          <div class="text item">
            Sección: {{ curso.seccion }}
          </div>
          <div class="text item">
            Alumnos: {{ curso.numero_matriculados }}
          </div>
      </el-card>
    </div>
  </div>
</template>

<script>

class Horario {
  constructor (periodo, semestre, asigdoc_id, dia_id, hora_id, aula_id) {
    this.periodo    = periodo
    this.semestre   = semestre
    this.asigdoc_id = asigdoc_id
    this.dia_id     = dia_id
    this.hora_id    = hora_id
    this.aula_id    = aula_id
  }
}

import MixingInit from '@/mixing/mixing_init'

export default {
  name: 'horario-register',

  mixins: [ MixingInit ],

  props: {
    aulas: {
      required: true
    },
    dia: {
      required: true
    },
    hora: {
      required: true
    },
    cursos: {
      required: true
    },
  },

  data () {
    return {
      aulaId         : null,
      asigdocId: null
    }
  },

  methods: {
    selectCurso ({ id_asigdoc }) {
      this.asigdocId = id_asigdoc
    },

    async regiterHorario () {
      let horario = new Horario(this.idPeriodo__, this.idSemestre__, this.asigdocId, this.dia.id, this.hora.id, this.aulaId)
      console.log(horario)
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}2/horario`, horario)

        let { status, data } = res

        if (status === 201) {
          console.log(data)
          this.close()
          this.update(data.horario)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    update (horario) {
      this.$emit('update', horario)
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.CardCursos {
  font-size : .8em;
  transition: .3s;
  .el-card__body {
    padding: 5px !important;
  }

  &:hover{
    cursor    : pointer;
    background: rgb(235, 235, 235);
  }

  &.selected {
    cursor    : pointer;
    background: rgb(238, 238, 238);
  }
}
</style>