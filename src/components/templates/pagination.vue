<template>
<nav>
  <ul class="pagination gx_pagination">
    <li :class="this.page == 1 ? 'disabled' : ''">
      <a @click.prevent="anteriorPagina" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li :class="this.page == this.totalPag ? 'disabled' : ''">
      <a @click.prevent="siguientePagina" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
</template>

<script>
export default {
  props: ['page', 'totalPag'],

  methods: {
    anteriorPagina() {
      this.$emit('anterior:pagina')
    },

    siguientePagina() {
      this.$emit('siguiente:pagina')
    }
  }
}
</script>
