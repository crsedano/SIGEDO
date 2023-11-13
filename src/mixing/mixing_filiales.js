export default {
    created: function () {
        this.getFiliales()
    },

    data: function () {
        return {
            filiales: null,
            id_filial: 'T',
        }
    },

    watch: {
        'id_filial': function (n) {
            if (n != 'T') {
                this.filial = this.filiales.filter(f => f.id_filial == n)[0].nombre_filial
            } else {
                this.filial = ''
            }
        },
    },

    methods: {
        getFiliales: function () {
            this.axios.get(`${this.URL}js-filial`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.filiales = res.data.data
                    } else {
                        this.filiales = null
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },
    }
}