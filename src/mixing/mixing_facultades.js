export default {
    created: function () {
        this.getFacultades()
    },

    data: function () {
        return {
            facultades: null,
            id_facultad: 'T',
        }
    },

    watch: {
        'id_facultad': function (n) {
            this.id_escuela = 'T'
            if (n != 'T') {
                this.getEscuelas()
                this.facultad = this.facultades.filter(f => f.id_facultad == n)[0].nombre
            } else {
                this.escuelas = null
                this.facultad = ''
            }
        },
    },

    methods: {
        getFacultades: function () {
            this.axios.get(`${this.URL}js-facultad`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.facultades = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },
    }
}