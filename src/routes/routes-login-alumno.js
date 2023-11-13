import LoginAlumno from '@/components/login_alumno/LoginAlumno.vue'
import AlumnoAsignaturas from '@/components/encuesta/AlumnoAsignaturas.vue'
import Preguntas from '@/components/encuesta/Preguntas.vue'

const routesLoginAlumno = [
  {
    name     : 'Login Alumno',
    path     : '/login-alumno',
    component: LoginAlumno,
    meta     : {
      title: 'SIGEDO | Login Alumnossss'
    }
  },
  {
    name     : 'Alumnos Asignaturas',
    path     : '/mis-asignaturas',
    component: AlumnoAsignaturas,
    meta     : {
      title: 'SIGEDO | Mis Asignaturas'
    }
  },
  {
    name     : 'Preguntas Encuesta',
    path     : '/encuestas',
    component: Preguntas,
    meta     : {
      title: 'SIGEDO | Preguntas Encuesta'
    }
  },
]

export default routesLoginAlumno