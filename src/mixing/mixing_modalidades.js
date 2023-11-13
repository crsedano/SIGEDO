export default {
    created: function () {
        this.getModalidades()
    },

    data: function () {
        return {
            modalidades: null,
            id_modalidad: 'T',
        }
    },

    watch: {
        'id_modalidad': function (n) {
            if (n != 'T') {
                this.modalidad = this.modalidades.filter(f => f.id_modalidad == n)[0].nombre
            } else {
                this.modalidad = ''
            }
        },
    },

    methods: {
        getModalidades: function () {
            this.axios.get(`${this.URL}js-modalidad`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.modalidades = res.data.data
                    } else {
                        this.modalidades = null
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },
    }
}