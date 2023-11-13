<script>
  import {Bar} from 'vue-chartjs'
  
  export default {
    name: 'Bar',
    extends: Bar,

    props: {
      chartdata: {
        type: Object,
        required: true,
      },
      title: {
        type: String,
        required: true
      }
    },

    data: () => ({
      options: {
        responsive: true,
        maintainAspectRatio: false,
        hover: {
          animationDuration: 0
        },
        animation: {
          duration: 1,
          onComplete: function () {
            let chartInstance = this.chart,
              ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset, i) {
              let meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                let data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
            });
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            beginAtZero: true,
            ticks: {
              autoSkip: false,
            }
          }],
          yAxes: [{
            stacked: true,
            beginAtZero: true,
            ticks: {
              min: 0,
              max: 100
            }
          }]
        }
      },
    }),

    mounted() {
      this.renderChart(this.chartdata, this.options)
    },
  }
</script>

<style scoped>

</style>