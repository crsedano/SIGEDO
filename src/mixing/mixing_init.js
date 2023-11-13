import { mapState, mapActions } from 'vuex'

export default {
  created: function() {
    this.getIdentity()
  },

  computed: {
    ...mapState({
      identity: 'identity',
      token: 'token',
      periodo: 'periodo',
      entorno: 'entorno',
      permisos: 'permisos',
      isAlumno__: 'isAlumno'
    }),

    idPeriodo__() {
      if (!this.periodo) return null

      let { id_periodo } = this.periodo

      return id_periodo
    },

    idSemestre__() {
      if (!this.periodo) return null

      let { id_semestre } = this.periodo

      return id_semestre
    },

    URL_() {
      return process.env.VUE_APP_SERVER
    },

    URL() {
      return process.env.VUE_APP_URL
    },

    URLPDF() {
      return process.env.VUE_APP_PDF
    },

    URLIMAGE() {
      return process.env.VUE_APP_IMAGE
    },

    URLPDFLARAVEL() {
      return process.env.VUE_APP_PDFLARAVEL
    }
  },

  data: function() {
    return {
      ajaxLoad: false
    }
  },

  methods: {
    getIdentity: function() {
      this.getIdentityVuex()
      this.getTokenVuex()
      this.getPeriodo()
      this.getEntorno()
      this.getIsAlumno()

      this.axios.defaults.headers.common = {
        Authorization: this.token
      }
    },

    ...mapActions({
      getIdentityVuex: 'getIdentity',
      getTokenVuex: 'getToken',
      getPeriodo: 'getPeriodo',
      getEntorno: 'getEntorno',
      getIsAlumno: 'getIsAlumno'
    }),

    openModal: function(modal) {
      this.modals[modal] = true
    },

    closeModal: function(modal) {
      this.modals[modal] = false
    },

    swAlert(msg, type = 'error') {
      this.$alert('SIGEDO', msg, {
        confirmButtonText: 'OK',
        type
      })
    },

    tableRowClassName() {
      return 'creado'
    },

    toNomProp(str) {
      let u = str.toLowerCase().split(' ')

      u = u.map(e => {
        if (
          e.toLowerCase() != 'y' &&
          e.toLowerCase() != '0' &&
          e.toLowerCase() != 'de' &&
          e.toLowerCase() != 'la' &&
          e.toLowerCase() != 'los' &&
          e.toLowerCase() != 'en' &&
          e.toLowerCase() != 'e' &&
          e.toLowerCase() != 'del' &&
          e.toLowerCase() != 'u'
        ) {
          e = e.charAt(0).toUpperCase() + e.slice(1)
        }
        return e
      })

      return u.join(' ')
    },

    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },

    async calificarDocente(idDocente) {
      try {
        const res = await this.axios.post(
          `${this.URL_}v2/evaluacion_docente/calificar_docente/${idDocente}`
        )

        if (res.status === 200) {
          return true
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      return false
    },

    async recalificarDocente() {
      try {
        const res = await this.axios.post(
          `${this.URL_}v2/evaluacion_docente/recalificar_docente`
        )

        if (res.status === 200) {
          return true
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      return false
    }
  }
}
