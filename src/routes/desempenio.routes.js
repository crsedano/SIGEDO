import HistorialDesempenio from '../components/historial-desempenio/HistorialDesempenio'
import HistorialContrato from '../components/historial-contratos/HistorialContrato'
import EstadisticaEncuesta from '../components/desempenio-docente/EstadisticaEncuesta'

const desempenioRoutes = [
  {
    name     : 'Historial Desempenio',
    path     : '/historial-desempenio',
    component: HistorialDesempenio,
    meta     : {
      title: 'SIGEDO | Historial Desempenio'
    }
  },
  {
    name     : 'Historial Contrato',
    path     : '/historial-contrato',
    component: HistorialContrato,
    meta     : {
      title: 'SIGEDO | Historial Contrato'
    }
  },
  {
    name     : 'Estadistica Encuesta',
    path     : '/estadistica-encuesta',
    component: EstadisticaEncuesta,
    meta     : {
      title: 'SIGEDO | Estadistica Encuesta'
    }
  },
]

export default desempenioRoutes