export default {
    created: function () {
        this.getEscuelas()
    },

    data: function () {
        return {
            facultades: null,
            id_facultad: 'T',
            id_escuela: 'T',
            escuelas: null,
        }
    },

    watch: {
        'id_escuela': function (n) {
            if (n != 'T') {
                this.escuela = this.escuelas.filter(f => f.id_escuela == n)[0].nombre
            } else {
                this.escuela = ''
            }
        },
    },

    methods: {
        getEscuelas: function () {
            this.axios.get(`${this.URL}js-escuela/${this.id_facultad}`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.escuelas = res.data.data
                    } else {
                        this.escuelas = null
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },
    }
}