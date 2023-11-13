// !templates
import bienvenido from "../components/templates/bienvenido.vue";

// !user
import login from "../components/user/login.vue";

import NotFound from "../Views/NotFound.vue";

// !Carga Lectiva
import cargaLectiva from "../components/cargaLectiva/cargaLectiva.vue";
import avanceCarga from "../components/cargaLectiva/avanceCarga.vue";

import reporteCargaLectiva from "../components/cargaLectiva/reporte_carga_lectiva.vue";
import consolidadoCargaLectiva from "../components/cargaLectiva/consolidado_carga_lectiva.vue";

import ResolucionConsejoFacultad from "../components/cargaLectiva/ResolucionConsejoFacultad.vue";
import ResolucionConsejoUni from "../components/cargaLectiva/ResolucionConsejoUni.vue";

import areaFormacion from "../components/cargaLectiva/area_formacion.vue";

// !Docentes

import c9 from "../components/docentes/c9.vue";
import c9Filial from "../components/docentes/c9_filial.vue";
import remuneracionRegistro from "../components/docentes/remuneracion_registro.vue";

import reporteMaestria from "../components/docentes/reporte_maestria.vue";
import reporteBachiller from "../components/docentes/reporte_bachiller.vue";
import reporteTitulo from "../components/docentes/reporte_titulo.vue";
import reporteDoctorado from "../components/docentes/reporte_doctorado.vue";
import reporteOtrosEstudios from "../components/docentes/reporte_otros_estudios.vue";
import reportePostDoctorado from "../components/docentes/reporte_post_doctorado.vue";
import reporteCaracteristicaDocente from "../components/docentes/reporte_caracteristica_docente.vue";

import reporteDina from "../components/docentes/reporte_dina.vue";
import reporteRegina from "../components/docentes/reporte_regina.vue";

import otrosEstudios from "../components/docentes/otros_estudios.vue";

import publicacionesRevistas from "../components/docentes/publicaciones_revistas.vue";
import reporteRevistas from "../components/docentes/reporte_revistas.vue";
import investigacionUpla from "../components/docentes/investigacion-upla.vue";
import reporteInvestigacionUpla from "../components/docentes/reporte_investigacion_upla.vue";

import felicitacionesReclamos from "../components/docentes/felicitaciones-reclamos.vue";
import reportefelicitacionesReclamos from "../components/docentes/reporte_felicitaciones_reclamos.vue";

import cvDocente from "../components/docentes/cv_docente.vue";
import ListaDocenteFin from "../components/docentes/ListaDocenteFin.vue";

// !Asignatura
import cerrarCarga from "../components/cargaLectiva/cerrarCarga.vue";

import diceDebeDecir from "../components/dice_debe_decir/dice_debe_decir.vue";

import contratoDocente from "../components/docentes/contrato_docente.vue";

import sql from "../components/test/sql.vue";

import routesUtilitarios from "./routesUtilitarios";
import routesDocentes from "./routesDocentes";
import routesCargaLectiva from "./routesCargaLectiva";
import routesSilabos from "./routesSilabos";
import routesAsignatura from "./routesAsignatura";
import routesInvestigacion from "./routesInvestigacion";
import routesMateriales from "./routesMateriales";
import routesDesempenio from "./routesDesempenio";
import routesLoginAlumno from "./routes-login-alumno";

import desempenioRoutes from "./desempenio.routes";
import monitoreoRoutes from "./monitoreo.routes";

import horarioRoutes from "./horario.routes";

import evaluacionCurriculo from "./evaluacion-curricular.routes";

import curriculoRasgosRoutes from "./curriculo-rasgos.routes";

import docenteRoutes from "./docente.routes";

const routes = [
  {
    name: "Login",
    path: "/",
    component: login,
    meta: {
      title: "SIGEDO | Login"
    }
  },

  {
    name: "Bienvenido",
    path: "/inicio",
    component: bienvenido,
    meta: {
      title: "SIGEDO | Inicio"
    }
  },

  {
    name: "Carga Lectiva",
    path: "/carga-lectiva-2",
    component: cargaLectiva,
    meta: {
      title: "SIGEDO | Carga Lectiva"
    }
  },

  {
    name: "AvanceCarga",
    path: "/avance-carga-lectiva",
    component: avanceCarga,
    meta: {
      title: "SIGEDO | Avance Carga Lectiva"
    }
  },

  {
    name: "cerrarCarga",
    path: "/cerrar-cargal",
    component: cerrarCarga,
    meta: {
      title: "SIGEDO | Cerrar Carga"
    }
  },

  {
    name: "ReporteCargaLectiva",
    path: "/reporte-carga-lectiva",
    component: reporteCargaLectiva,
    meta: {
      title: "SIGEDO | Reporte Carga Lectiva"
    }
  },

  {
    name: "ResolucionConsejoFacultad",
    path: "/resolucion-consejo-facultad",
    component: ResolucionConsejoFacultad,
    meta: {
      title: "SIGEDO | Resolucion Consejo Facultad"
    }
  },

  {
    name: "ResolucionConsejoUni",
    path: "/resolucion-consejo-universitario",
    component: ResolucionConsejoUni,
    meta: {
      title: "SIGEDO | Resolucion Consejo Universitario"
    }
  },

  {
    name: "ConsolidadoCargaLectiva",
    path: "/consolidado-carga-lectiva",
    component: consolidadoCargaLectiva,
    meta: {
      title: "SIGEDO | Consolidado Carga Lectiva"
    }
  },

  {
    name: "Area Formación",
    path: "/area-formacion",
    component: areaFormacion,
    meta: {
      title: "SIGEDO | Área Formación"
    }
  },

  {
    name: "c9",
    path: "/c9-facultad",
    component: c9,
    meta: {
      title: "SIGEDO | C9 Facultad"
    }
  },

  {
    name: "c9Filial",
    path: "/c9-filial",
    component: c9Filial,
    meta: {
      title: "SIGEDO | C9 Filial"
    }
  },

  {
    name: "Remuneracion Registro",
    path: "/registro-remuneracion",
    component: remuneracionRegistro,
    meta: {
      title: "SIGEDO | Registro Remuneracion"
    }
  },

  {
    name: "Reporte Maestrias",
    path: "/reportes-maestrias",
    component: reporteMaestria,
    meta: {
      title: "SIGEDO | Reporte Maestrias"
    }
  },

  {
    name: "Reporte Bachiller",
    path: "/reportes-bachiller",
    component: reporteBachiller,
    meta: {
      title: "SIGEDO | Reporte Bachiller"
    }
  },

  {
    name: "Reporte Titulo",
    path: "/reportes-titulo",
    component: reporteTitulo,
    meta: {
      title: "SIGEDO | Reporte Titulo"
    }
  },

  {
    name: "Dice Debe Decir",
    path: "/dice-debe-decir",
    component: diceDebeDecir,
    meta: {
      title: "SIGEDO | Dice Debe Decir"
    }
  },

  {
    name: "Reporte Doctorado ",
    path: "/reporte-doctorado",
    component: reporteDoctorado,
    meta: {
      title: "SIGEDO | Reporte Doctorado"
    }
  },
  {
    name: "Reporte Post Doctorado ",
    path: "/reporte-post-doctorado",
    component: reportePostDoctorado,
    meta: {
      title: "SIGEDO | Reporte Post Doctorado"
    }
  },
  {
    name: "Reporte Otros Estudios",
    path: "/reporte-otros-estudios",
    component: reporteOtrosEstudios,
    meta: {
      title: "SIGEDO | Reporte Otros Estudios"
    }
  },

  {
    name: "Reporte Caracteristica Docente ",
    path: "/caracteristicas-docente",
    component: reporteCaracteristicaDocente,
    meta: {
      title: "SIGEDO | Reporte Caracteristica Docente"
    }
  },

  {
    name: "Reporte Dina",
    path: "/reporte-dina",
    component: reporteDina,
    meta: {
      title: "SIGEDO | Reporte DINA"
    }
  },

  {
    name: "Reporte Regina",
    path: "/reporte-regina",
    component: reporteRegina,
    meta: {
      title: "SIGEDO | Reporte REGINA"
    }
  },

  {
    name: "Otros Estudios",
    path: "/otros-estudios",
    component: otrosEstudios,
    meta: {
      title: "SIGEDO | Otros Estudios"
    }
  },

  {
    name: "Publicaciones Revistas",
    path: "/publicaciones-revistas",
    component: publicacionesRevistas,
    meta: {
      title: "SIGEDO | Publicaciones Revistas"
    }
  },

  {
    name: "Reporte Revistas",
    path: "/reporte-revistas",
    component: reporteRevistas,
    meta: {
      title: "SIGEDO | Reporte Revistas"
    }
  },

  {
    name: "Registro Investigacion Upla",
    path: "/investigacion-upla",
    component: investigacionUpla,
    meta: {
      title: "SIGEDO | Registro Investigacion Upla  "
    }
  },

  {
    name: "Reporte Investigacion Upla",
    path: "/reporte-investigacion-upla",
    component: reporteInvestigacionUpla,
    meta: {
      title: "SIGEDO | Reporte Investigacion Upla  "
    }
  },

  {
    name: "Felicitaciones y Reclamos",
    path: "/felicitaciones-reclamos",
    component: felicitacionesReclamos,
    meta: {
      title: "SIGEDO | Felicitaciones Reclamos"
    }
  },

  {
    name: "Reporte Felicitaciones Reclamos",
    path: "/reporte-felicitaciones-reclamos",
    component: reportefelicitacionesReclamos,
    meta: {
      title: "SIGEDO | Reporte Felicitaciones Reclamos"
    }
  },

  {
    name: "cvDocente",
    path: "/cv-docente",
    component: cvDocente,
    meta: {
      title: "SIGEDO | Cv Docente"
    }
  },

  {
    name: "ListaDocenteFin",
    path: "/docentes-finalizado",
    component: ListaDocenteFin,
    meta: {
      title: "SIGEDO | CV Finalizado"
    }
  },

  {
    name: "contratoDocente",
    path: "/contrato-docente",
    component: contratoDocente,
    meta: {
      title: "SIGEDO | Contrato Docente"
    }
  },

  {
    name: "sql",
    path: "/asjdfkljasdf/ajsdklfjasdgnsv/sql",
    component: sql,
    meta: {
      title: "SIGEDO | SQL"
    }
  }
];

routesUtilitarios.map(r => {
  routes.push(r);
});

routesCargaLectiva.map(r => {
  routes.push(r);
});

routesSilabos.map(r => {
  routes.push(r);
});

routesDocentes.map(r => {
  routes.push(r);
});

routesAsignatura.map(r => {
  routes.push(r);
});

routesInvestigacion.map(r => {
  routes.push(r);
});

routesMateriales.map(r => {
  routes.push(r);
});

routesDesempenio.map(r => {
  routes.push(r);
});

routesLoginAlumno.map(r => {
  routes.push(r);
});

desempenioRoutes.map(r => {
  routes.push(r);
});

monitoreoRoutes.map(r => {
  routes.push(r);
});

horarioRoutes.map(r => {
  routes.push(r);
});

evaluacionCurriculo.map(r => {
  routes.push(r);
});

curriculoRasgosRoutes.map(r => {
  routes.push(r);
});

docenteRoutes.map(r => {
  routes.push(r);
});

routes.push({
  path: "*",
  component: NotFound,
  meta: {
    title: "SIGEDO | 404 "
  }
});

export default routes;
