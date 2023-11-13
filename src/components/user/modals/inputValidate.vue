<template>
<float-label v-if="float" :class="['hint--right hint--error hint--bounce ed-item', hintLen]" :aria-label="errorLen">
  <input v-model="model" :class="['form-control', errorClass]" :placeholder="placeholder" :type="type" @keyup.enter="keyUpEnter"
    @blur="blur">
</float-label>

<div v-else class="ed-item form-group">
  <label :class="['hint--right hint--error hint--bounce', hintLen]" :aria-label="errorLen">
    {{placeholder}}
  </label>

  <input v-model="model" :class="['form-control', errorClass]" :placeholder="placeholder" :type="type" @keyup.enter="keyUpEnter"
    @blur="blur">
</div>
</template>

<script>
export default {
  // props: ['value'],
  props: {
    float: {
      type: Boolean,
      default: function () {
        return false
      }
    },

    value: {
      required: true
    },

    required: {
      type: Boolean,
      default: function () {
        return false
      }
    },

    min: {
      type: Number
    },

    max: {
      type: Number
    },

    len: {
      type: Array,
      default: function () {
        return []
      }
    },

    placeholder: {
      type: String
    },

    type: {
      validator: function (value) {
        return ['text', 'number', 'email', 'web', 'password', 'date'].indexOf(value) !== -1
      }
    },

    keyUpEnter: {
      type: Function,
      default: function () {
        return
      }
    },

    blur: {
      type: Function,
      default: function () {
        return
      }
    },

    upperCase: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },

  computed: {
    model: {
      get: function () {
        return this.value
      },

      set: function (newValue) {
        this.$emit('input', newValue);
      }
    }
  },

  watch: {
    model: function (n) {
      if (this.upperCase) {
        this.model = n.toUpperCase()
      }

      if (this.required) {
        if (n.length <= 0) {
          this.errorClass = 'required_'
        } else {
          this.errorClass = ''
        }
      } else {
        this.errorClass = ''
      }

      let condLen = false
      let cond

      if (this.len.length > 0) {
        this.len.forEach(l => {
          cond = n.length == l

          condLen = condLen || cond

        })

        if (condLen) {
          this.errorClass = ''
          this.hintLen = 'hint--always'
          this.errorLen = ''
        } else {
          if (n.length > 0) {
            this.errorClass = 'required_'
            this.hintLen = 'hint--always'
            this.errorLen = `${this.placeholder} debe ser de ${this.len.join(' o ')} caracteres`
          } else {
            this.hintLen = 'hint--always'
            this.errorLen = ''
          }
        }
      }
    }
  },

  data: function () {
    return {
      errorClass: '',
      hintLen: '',
      errorLen: '',
    }
  },

  mounted: function () {
    if (this.required) {
      this.errorClass = 'required_'
    } else {
      this.errorClass = ''
    }
  }

}
</script>

