import sumillas from "../components/cargaLectiva/sumillas.vue";
import imprimirSumillas from "../components/cargaLectiva/imprimirSumillas.vue";
import planesEstudio from "../components/asignatura/planes_estudios.vue";
import silabusCargo from "../components/asignatura/cursos_cargo.vue";
import ListaSilabos from "../components/asignatura/ListaSilabos.vue";
import RegistroPlanes from "../components/asignatura/RegistroPlanes.vue";
import RegistroAsignaturas from "../components/asignatura/RegistroAsignaturas.vue";
import PorcentajeSilabos from "../components/asignatura/PorcentajeSilabos.vue";

import SilaboVirtual from "../components/asignatura/SilaboVirtual.vue";

const routesAsignatura = [
  {
    name: "Planes Estudio",
    path: "/planes-estudio",
    component: planesEstudio,
    meta: {
      title: "SIGEDO | Planes Estudio"
    }
  },

  {
    name: "Sumillas",
    path: "/sumillas",
    component: sumillas,
    meta: {
      title: "SIGEDO | Sumillas"
    }
  },

  {
    name: "Imprimir Sumillas",
    path: "/imprimir-sumillas",
    component: imprimirSumillas,
    meta: {
      title: "SIGEDO | Sumillas2"
    }
  },

  {
    name: "Cursos Cargo",
    path: "/silabos-cargo",
    component: silabusCargo,
    meta: {
      title: "SIGEDO | Silabos Cargo"
    }
  },

  {
    name: "Registro Silabos",
    path: "/silabos-registro",
    component: ListaSilabos,
    props: true,
    meta: {
      title: "SIGEDO | Silabos Registro"
    }
  },

  {
    name: "Registro Planes",
    path: "/registro-planes",
    component: RegistroPlanes,
    meta: {
      title: "SIGEDO | Registro Planes"
    }
  },

  {
    name: "Registro Asignaturas",
    path: "/registro-asignatura",
    component: RegistroAsignaturas,
    meta: {
      title: "SIGEDO | Registro Asignaturas"
    }
  },

  {
    name: "Porcentaje Silabos",
    path: "/porcentaje-silabos",
    component: PorcentajeSilabos,
    meta: {
      title: "SIGEDO | Porcentaje Silabos"
    }
  },

  {
    name: "Silabo Virtual",
    path: "/silabo-virtual",
    component: SilaboVirtual,
    meta: {
      title: "SIGEDO | Silabo Virtual"
    }
  }
];

export default routesAsignatura;
