import Horario from '../components/horario/Horario'
import ImprimirHorario from '../components/horario/ImprimirHorario'
import VerHorario from '../components/horario/HorarioVer'
import Dia from '../components/dia/Dia'
import Hora from '../components/hora/Hora'
import Aula from '../components/aula/Aula'

const horarioRoutes = [
  {
    name     : 'Horario',
    path     : '/horario',
    component: Horario,
    meta     : {
      title: 'SIGEDO | Horario'
    }
  },
  {
    name     : 'Imprimir Horario',
    path     : '/imprimir-horario',
    component: ImprimirHorario,
    meta     : {
      title: 'SIGEDO | Imprimir Horario'
    }
  },
  {
    name     : 'Ver Horario',
    path     : '/ver-horario',
    component: VerHorario,
    meta     : {
      title: 'SIGEDO | Ver Horario'
    }
  },
  {
    name     : 'Dia',
    path     : '/dia',
    component: Dia,
    meta     : {
      title: 'SIGEDO | Dias'
    }
  },
  {
    name     : 'Hora',
    path     : '/hora',
    component: Hora,
    meta     : {
      title: 'SIGEDO | Hora'
    }
  },
  {
    name     : 'Aula',
    path     : '/aula',
    component: Aula,
    meta     : {
      title: 'SIGEDO | Aula'
    }
  },
]

export default horarioRoutes