<template>
<div class="ed-container init">
  <h3 class="ed-item  gr-center">
    <strong>LISTA DE CURSOS A CARGO</strong>
  </h3>

  <div v-if="loadAjax" class="modal" style="display: flex;justify-content: center;align-items: center;">
    <div class="loader">Loading...</div>
  </div>

  <transition enter-active-class="animated fadeIn" leave-active-class="animated bounceOut">
    <div v-if="cursoSelect" class="ed-item ed-container">
      <h3 class="ed-item sep-5">
        <span class="hint--right" aria-label="Ver Lista de Cursos">
          <i @click="cursoSelect = false" class="fas fa-long-arrow-alt-left action pointer"></i>
        </span>
      </h3>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>I. DATOS GENERALES</strong>
        </h3>
        <div class="ed-item m-50 l-30 to-center form-group">
          <label>Caracter: </label>
          <label>{{caracterCurso}}</label>
        </div>
        <div class="ed-item m-50 l-30 to-center form-group">
          <label>Semestre Académico: </label>
          <label>2018-I *</label>
        </div>
        <div v-if="periodo != null" class="ed-item m-50 l-30 to-center form-group">
          <label>Duración: </label>
          <label>{{entorno.duracion}} Semanas</label>
        </div>
        <div class="ed-item m-50 l-30 to-center form-group">
          <label>Inicio de Clases: </label>
          <label v-if="cronograma != null">{{moment(cronograma[0].finicio).locale('es').format('D [de] MMMM YYYY')}}</label>
        </div>
        <div class="ed-item m-50 l-30 to-center form-group">
          <label>Finalización de Clases: </label>
          <label v-if="cronograma != null">{{moment(cronograma[1].finicio).locale('es').format('D [de] MMMM YYYY')}}</label>
        </div>
        <div class="ed-item m-50 l-30 to-center form-group">
          <label>Lugar de Clases: </label>
          <label>**</label>
        </div>
        <div class="ed-item m-50 l-30 to-center form-group">
          <label>Docente: </label>
          <label v-if="datosDocente != null">{{datosDocente.docente}}</label>
        </div>
        <div class="ed-item m-50 l-30 to-center form-group">
          <label>Jefe de Práctica: </label>
          <label>**</label>
        </div>
        <div class="ed-item l-30 to-center form-group">
          <label>Correo Electrónico: </label>
          <label v-if="datosDocente != null">{{datosDocente.email}}</label>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>II. SUMILLA</strong>
        </h3>
        <div class="ed-item form-group sep-5">
          <label>Sumilla</label>
          <textarea rows="5" disabled class="form-control" v-model="sumillaCurso.sumilla"></textarea>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>III. OBJETIVOS</strong>
        </h3>
        <div class="ed-item ed-container">
          <div class="ed-item m-70 form-group sep-5">
            <label>Descripción</label>
            <textarea v-model="gx_silabus_objetivo.objetivo" class="form-control"></textarea>
          </div>
          <div class="ed-item m-30 form-group sep-5">
            <label>Tipo Objetivo</label>
            <select v-model="gx_silabus_objetivo.tipo_obj" class="form-control">
              <option :disabled="silabusObjetivos.some(obj => obj.tipo_obj == 'G')" value="G">General</option>
              <option value="E">Específico</option>
            </select>
          </div>
        </div>
        <div class="ed-item sep-5 gr-center">
          <button :disabled="!objetivoValid" @click="agregarObjetivo" :class="['btn btn-info btn-rounded btn-hov', !objetivoValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button>
        </div>
        <div v-if="silabusObjetivos.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Descripción</th>
                <th>Tipo Objetivo</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(obj, index) in silabusObjetivos" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{obj.objetivo}}</td>
                <td v-if="obj.tipo_obj == 'G'">General</td>
                <td v-if="obj.tipo_obj == 'E'">Específico</td>
                <td @click="removerObjetivo(index, obj.id_silabus_obj)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>IV. LINEAS DE INVESTIGACIÓN EN RELACIÓN AL COMPONENTE CURRICULAR</strong>
        </h3>
        <div class="ed-item ed-container">
          <div class="ed-item m-70 form-group sep-5">
            <label>Acciones de Investigación</label>
            <textarea v-model="gx_silabus_investig.acciones_invest" class="form-control"></textarea>
          </div>
          <div class="ed-item m-30 form-group sep-5">
            <label>Nivel de Logro</label>
            <input v-model="gx_silabus_investig.nivel_logro" type="text" class="form-control">
          </div>
        </div>
        <div class="ed-item sep-5 gr-center">
          <button :disabled="!investigacionValid" @click="agregarInv" :class="['btn btn-info btn-rounded btn-hov', !investigacionValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button>
        </div>
        <div v-if="silabusInvestig.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Descripción</th>
                <th>Tipo Objetivo</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(inv, index) in silabusInvestig" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{inv.acciones_invest}}</td>
                <td>{{inv.nivel_logro}}</td>
                <td @click="removerInv(index, inv.id_silabus_investig)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>V. CRONOGRAMA Y CONTENIDOS</strong>
        </h3>

        <!-- <button @click="actualizarNombresUnidad" class="ed-item btn btn-info">Guardar pruebadfasd</button> -->

        <div class="ed-item ed-container" v-for="(unidad, index) in unidadesCurso" :key="index">
          <div class="ed-item">
            <h5>
              <strong>Unidad: {{unidad.orden}}</strong>
            </h5>
            <input type="text" v-model="unidad.unidad" class="form-control">
          </div>
          <div class="ed-item sep-5 table-content">
            <table class='table table-bordered table-responsive table-hover table-striped table-own'>
              <thead class='table-head'>
                <tr>
                  <th>Semana</th>
                  <th>%Avance</th>
                  <th>Contenido</th>
                  <th>Metas de Aprendizaje</th>
                </tr>
              </thead>
              <tbody class='table-body'>
                <tr v-if="crono.id_silabus_unidades == unidad.id_silabus_unidades" v-for="(crono, index) in silabusCronograma"
                  :key="index">
                  <td>Semana {{crono.semana}}</td>
                  <td>{{crono.porcentaje}} {{crono.porcentaje != '' ? '%' : ''}}</td>
                  <td>
                    <input type="text" v-model="crono.contenido" class="form-control">
                  </td>
                  <td v-if="crono.rowspan" :rowspan="silabusCronograma.filter(sila => sila.id_silabus_unidades == unidad.id_silabus_unidades).length">
                    <textarea v-model="crono.metas_aprendizaje" rows="5" class="form-control"></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>VI. ESTRATEGIAS METODOLOGICAS</strong>
        </h3>
        <div class="ed-item ed-container">
          <div class="ed-item m-50 sep-5 form-gr">
            <label>Nombre</label>
            <input v-model="gx_silabus_estrategia.cnombre" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 sep-5 form-gr">
            <label>Tipo</label>
            <select v-model="gx_silabus_estrategia.ctipo" class="form-control">
              <option value="E">Estrategia</option>
              <option value="T">Técnica</option>
            </select>
          </div>
          <div class="ed-item sep-5 form-gr">
            <label>Detalle</label>
            <textarea v-model="gx_silabus_estrategia.cdetalle" rows="2" class="form-control"></textarea>
          </div>
        </div>
        <div class="ed-item sep-5 gr-center">
          <button :disabled="!estrategiasValid" @click="agregarEstrategia" :class="['btn btn-info btn-rounded btn-hov', !estrategiasValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button>
        </div>
        <div v-if="silabusEstrategias.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Nombre</th>
                <th>Detalle</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(estra, index) in silabusEstrategias" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{estra.cnombre}}</td>
                <td>{{estra.cdetalle}}</td>
                <td v-if="estra.ctipo == 'E'">Estrategia</td>
                <td v-if="estra.ctipo == 'T'">Técnica</td>
                <td @click="removerEstrategia(index, estra.id_silabus_estrategias)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>VII. RECURSOS Y MATERIALES</strong>
        </h3>
        <div class="ed-item ed-container">
          <div class="ed-item m-50 sep-5 form-gr">
            <label>Detalle</label>
            <input v-model="gx_silabus_recurso.cdetalle" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 sep-5 form-gr">
            <label>Tipo</label>
            <select v-model="gx_silabus_recurso.ctipo" class="form-control">
              <option value="M">Medios y Materiales</option>
              <option value="I">Información</option>
            </select>
          </div>
        </div>
        <div class="ed-item sep-5 gr-center">
          <button :disabled="!recursosValid" @click="agregarRecurso" :class="['btn btn-info btn-rounded btn-hov', !recursosValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button>
        </div>
        <div v-if="silabusRecursos.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Detalle</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(recurso, index) in silabusRecursos" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{recurso.cdetalle}}</td>
                <td v-if="recurso.ctipo == 'M'">Medios y Materiales</td>
                <td v-if="recurso.ctipo == 'I'">Información</td>
                <td @click="removerRecurso(index, recurso.id_silabus_recursos)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>VIII. EVALUACION</strong>
        </h3>
        <div class="ed-item ed-container">
          <div class="ed-item m-50 sep-5 form-gr">
            <label>Detalle</label>
            <input v-model="gx_silabus_evaluacion.cdetalle" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 sep-5 form-gr">
            <label>Tipo</label>
            <select v-model="gx_silabus_evaluacion.ctipo" class="form-control">
              <option value="R">Requisito</option>
              <option value="P">Parcial</option>
              <option value="F">Final</option>
            </select>
          </div>
        </div>
        <div class="ed-item sep-5 gr-center">
          <button :disabled="!evaluacionValid" @click="agregarEvaluacion" :class="['btn btn-info btn-rounded btn-hov', !evaluacionValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button>
        </div>
        <div v-if="silabusEvaluacion.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Detalle</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(evaluacion, index) in silabusEvaluacion" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{evaluacion.cdetalle}}</td>
                <td v-if="evaluacion.ctipo == 'R'">Requisito</td>
                <td v-if="evaluacion.ctipo == 'P'">Parcial</td>
                <td v-if="evaluacion.ctipo == 'F'">Final</td>
                <td @click="removerEvaluacion(index, evaluacion.id_silabus_evaluacion)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>IX. REQUISITO DE APROBACIÓN</strong>
        </h3>
        <div class="ed-item gr-center">
          <p>
            <strong>Asistencia obligatoria a clases teóricas y prácticas en un mínimo de 70%</strong>
          </p>
          <p>
            <strong>Obtener nota final mínima de 10.5</strong>
          </p>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>X. FUENTES DE INFORMACIÓN O BIBLIOGRÁFICAS</strong>
        </h3>
        <div class="ed-item ed-container">
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Autor</label>
            <input v-model="gx_silabus_bibliografia.autor" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Año publicación</label>
            <input v-model="gx_silabus_bibliografia.anio_public" type="number" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Título</label>
            <input v-model="gx_silabus_bibliografia.titulo" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Lugar de publicación</label>
            <input v-model="gx_silabus_bibliografia.lugar_public" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Editorial</label>
            <input v-model="gx_silabus_bibliografia.editorial" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Descripción</label>
            <input v-model="gx_silabus_bibliografia.descripcion" type="text" class="form-control">
          </div>
        </div>
        <div class="ed-item sep-5 gr-center">
          <button :disabled="!bibliografiaValid" @click="agregarBibliografia" :class="['btn btn-info btn-rounded btn-hov', !bibliografiaValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button>
        </div>
        <div v-if="silabusBibliografia.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Autor</th>
                <th>Año de Publicación</th>
                <th>Título</th>
                <th>Lugar de Publicación</th>
                <th>Editorial</th>
                <th>Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(biblio, index) in silabusBibliografia" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{biblio.autor}}</td>
                <td>{{biblio.anio_public}}</td>
                <td>{{biblio.titulo}}</td>
                <td>{{biblio.lugar_public}}</td>
                <td>{{biblio.editorial}}</td>
                <td>{{biblio.descripcion}}</td>
                <td @click="removerBibliografia(index, biblio.id_silabus_biblio)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h3 class="ed-item sep-5">
          <strong>XI. VÍNCULOS A SITIOS DE INTERES</strong>
        </h3>
        <div class="ed-item ed-container">
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Autor</label>
            <input v-model="gx_silabus_refweb.autor" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Año publicación</label>
            <input v-model="gx_silabus_refweb.anio_public" type="number" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>Título</label>
            <input v-model="gx_silabus_refweb.titulo" type="text" class="form-control">
          </div>
          <div class="ed-item m-50 to-center sep-5 form-gr">
            <label>URL</label>
            <input v-model="gx_silabus_refweb.url" type="text" class="form-control">
          </div>
          <div class="ed-item sep-5 form-gr">
            <label>Descripción</label>
            <input v-model="gx_silabus_refweb.descripcion" type="text" class="form-control">
          </div>
        </div>
        <div class="ed-item sep-5 gr-center">
          <button :disabled="!refwebValid" @click="agregarRefweb" :class="['btn btn-info btn-rounded btn-hov', !refwebValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button>
        </div>
        <div v-if="silabusRefweb.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Autor</th>
                <th>Año de Publicación</th>
                <th>Título</th>
                <th>URL</th>
                <th>Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(ref, index) in silabusRefweb" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{ref.autor}}</td>
                <td>{{ref.anio_public}}</td>
                <td>{{ref.titulo}}</td>
                <td>{{ref.url}}</td>
                <td>{{ref.descripcion}}</td>
                <td @click="removerRefweb(index, ref.id_silabus_refweb)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </transition>


  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <template v-if="!cursoSelect">
      <div v-if="load" class="ed-item gr-center">
        <loading />
      </div>

      <div v-else class="ed-item s-95 to-center ed-container table-content">
        <table class='table table-bordered table-responsive table-hover table-striped table-own'>
          <thead class='table-head'>
            <tr>
              <th>N°</th>
              <th>Asignatura</th>
              <th>Responsable Silabus</th>
              <th>Modalidad</th>
              <th>Filial</th>
              <th></th>
            </tr>
          </thead>
          <tbody class='table-body'>
            <tr v-for="(curso, index) in cursosAsignados" :key="index">
              <td>{{index + 1 }}</td>
              <td v-if="curso.responsable_silabus == 1" @click="seleccionarAsignatura(curso)" class="pointer">
                <span class="hint--right hint--warning" aria-label="Registrar Silabus">
                  {{curso.asignatura}}
                </span>
              </td>
              <td v-else>{{curso.asignatura}}</td>
              <td>
                <i class="fas fa-check action"></i>
                <!-- <i v-else class="fas fa-times action red"></i> -->
              </td>
              <td>{{curso.modalidad}}</td>
              <td>{{curso.filial}}</td>
              <td>
                <a v-if="curso.silabus == 1" class="hint--left" aria-label="Imprimir PDF" target="_blank" :href="`${URLPdf}api/src/reportes/silabusEspecifico.php?id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_filial=${curso.id_filial}&id_modalidad=${curso.id_modalidad}&dni=${identity.dni}&id_asignatura=${curso.id_curso}`">
                  <i class="fas fa-file-pdf action pointer"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </transition>
  <div class="ed-item" v-if="cursosAsignados == null">
    <h4 class="gr-center">No tiene cursos asignados</h4>
  </div>

  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <button @click="capturarSilabus" v-show="validAllData && cursoSelect" class="float-guardar hint--left hint--success"
      aria-label="Capturar Silabus">
      <i class="fas fa-save"></i>
    </button>
  </transition>

  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <button v-show="!validAllData && cursoSelect" class="float-error hint--right hint--error hint--large hint--bounce"
      :aria-label="infoError">
      <i class="fas fa-exclamation-triangle"></i>
    </button>
  </transition>
</div>
</template>

<script>
import alertify from 'alertifyjs'

import pagination from '../templates/pagination.vue'
import loading from '../templates/loading.vue'

import moment from 'moment'

import GxSilabusObjetivo from '../../models/gx_silabus_objetivo'
import GxSilabusInvestig from '../../models/gx_silabus_investig'
import GxSilabusCronograma from '../../models/gx_silabus_cronograma'
import GxSilabusEstrategias from '../../models/gx_silabus_estrategias'
import GxSilabusRecursos from '../../models/gx_silabus_recursos'
import GxSilabusEvaluacion from '../../models/gx_silabus_evaluacion'
import GxSilabusBibliografia from '../../models/gx_silabus_bibliografia'
import GxSilabusRefweb from '../../models/gx_silabus_refweb'

export default {
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) {
        next('/')
        return
      } 
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if(!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.getIdentity()
  },

  components: {
    pagination,
    loading,
  },

  data() {
    return {
      identity: null,
      token: null,
      entorno: null,
      periodo: null,
      autho: null,

      load: false,

      cursosAsignados: null,
      cronograma: null,

      moment: moment,

      cursoSelect: false,
      datosDocente: null,
      caracterCurso: '',
      sumillaCurso: '',
      porcentajes: null,

      asigSeleccionado: null,

      gx_silabus_objetivo: new GxSilabusObjetivo(),
      silabusObjetivos: [],

      gx_silabus_investig: new GxSilabusInvestig(),
      silabusInvestig: [],

      unidadesCurso: null,

      gx_silabus_cronograma: new GxSilabusCronograma(),
      silabusCronograma: [],

      gx_silabus_estrategia: new GxSilabusEstrategias(),
      silabusEstrategias: [],

      gx_silabus_recurso: new GxSilabusRecursos(),
      silabusRecursos: [],

      gx_silabus_evaluacion: new GxSilabusEvaluacion(),
      silabusEvaluacion: [],

      gx_silabus_bibliografia: new GxSilabusBibliografia(),
      silabusBibliografia: [],

      gx_silabus_refweb: new GxSilabusRefweb(),
      silabusRefweb: [],

      loadAjax: false,

      infoError: ''
    }
  },

  computed: {
    objetivoValid: function () {
      return (
        this.gx_silabus_objetivo.objetivo != '' &&
        this.gx_silabus_objetivo.tipo_obj != ''
      )
    },

    investigacionValid: function () {
      return (
        this.gx_silabus_investig.acciones_invest != '' &&
        this.gx_silabus_investig.nivel_logro != ''
      )
    },

    estrategiasValid: function () {
      return (
        this.gx_silabus_estrategia.cnombre != '' &&
        this.gx_silabus_estrategia.cdetalle != '' &&
        this.gx_silabus_estrategia.ctipo != ''
      )
    },

    recursosValid: function () {
      return (
        this.gx_silabus_recurso.cdetalle != '' &&
        this.gx_silabus_recurso.ctipo != ''
      )
    },

    evaluacionValid: function () {
      return (
        this.gx_silabus_evaluacion.cdetalle != '' &&
        this.gx_silabus_evaluacion.ctipo != ''
      )
    },

    bibliografiaValid: function () {
      return (
        this.gx_silabus_bibliografia.autor != '' &&
        this.gx_silabus_bibliografia.anio_public != '' &&
        this.gx_silabus_bibliografia.titulo != '' &&
        this.gx_silabus_bibliografia.lugar_public != '' &&
        this.gx_silabus_bibliografia.editorial != ''
      )
    },

    refwebValid: function () {
      return (
        this.gx_silabus_refweb.autor != '' &&
        this.gx_silabus_refweb.anio_public != '' &&
        this.gx_silabus_refweb.titulo != '' &&
        this.gx_silabus_refweb.url != '' &&
        this.gx_silabus_refweb.descripcion != ''
      )
    },

    validAllData: function () {
      let objetivosvalid = false
      objetivosvalid = this.silabusObjetivos.length > 1
      let eobj = objetivosvalid ? '' : 'Ingresar un objetivo general y por lo menos un objetivo específico,'

      let estravalid = false
      estravalid = this.silabusEstrategias.length > 0
      let eestra = estravalid ? '' : 'Ingresar por lo menos una estrategia,'

      let recvalid = false
      recvalid = this.silabusRecursos.length > 0
      let erecu = recvalid ? '' : 'Ingresar por lo menos un recurso,'

      let evavalid = false
      evavalid = this.silabusEvaluacion.length > 0
      let eevalid = evavalid ? '' : 'Ingresar por lo menos una evaluación,'

      let bibliovalid = false
      bibliovalid = this.silabusBibliografia.length > 0
      let ebiblio = bibliovalid ? '' : 'Ingresar por lo menos una fuente bibliográfica,'

      let unidadesValid = false
      if (this.unidadesCurso != null) {
        unidadesValid = !this.unidadesCurso.some(unid => unid.unidad == '')
      }
      let eunid = unidadesValid ? '' : 'Colocar todos los nombres de las unidades,'

      let conteValid = false
      conteValid = !this.silabusCronograma.some(sil => sil.contenido == '')
      let econte = conteValid ? '' : 'Ingresar el contenido de todas las semanas,'

      let metaValid = false
      metaValid = this.silabusCronograma.filter(sil => sil.metas_aprendizaje != '').length >= 4
      let emeta = metaValid ? '' : 'Ingresar las metas de aprendizaje para todas las unidades,'

      this.infoError = `${eobj} ${eestra} ${erecu} ${eevalid} ${ebiblio} ${eunid} ${econte} ${emeta}`

      return (
        objetivosvalid &&
        estravalid &&
        recvalid &&
        evavalid &&
        bibliovalid &&
        unidadesValid &&
        conteValid &&
        metaValid
      )
    }
  },

  methods: {
    getIdentity() {
      if (localStorage.length > 0) {
        this.identity = JSON.parse(localStorage.getItem('identity'))
        this.entorno = JSON.parse(localStorage.getItem('entorno'))
        this.periodo = JSON.parse(localStorage.getItem('periodo'))
        this.token = JSON.parse(localStorage.getItem('token'))

        this.autho = {
          headers: {
            Authorization: this.token,
          }
        }

        this.init()
      }
    },

    init() {
      this.getCursosAsignados()
      this.getCronograma()
      this.getPorcentajes()
      // .locale('es').format('D° MMMM YYYY'))

    },

    getCursosAsignados: async function () {
      this.load = true
      await this.axios.get(`${this.URL}js-cursos-asignados/${this.identity.dni}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.cursosAsignados = res.data.data
            this.load = false
          } else {
            this.cursosAsignados = null
            this.load = false
          }
        })
        .catch(err => {
          console.dir(err)
          this.load = false
        })
        .then(() => {})

    },

    getCronograma: function () {
      this.axios.get(`${this.URL}js-cronograma-sigedo/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.cronograma = res.data.data
          } else {
            this.cronograma = null
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getDatosDocente: async function (curso) {
      await this.axios.get(`${this.URL}js-docente-silabo/${curso.id_curso}/${this.identity.dni}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.datosDocente = res.data.data
          } else {
            this.datosDocente = null
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getTipoHora: async function (curso) {
      await this.axios.get(`${this.URL}js-tipo-hora/${curso.id_curso}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.asigSeleccionado.id_filial}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.caracterCurso = ''
            res.data.data
              .forEach(el => {
                if (el.tipo_hora == 'ht') {
                  this.caracterCurso = 'Teórico'
                }

                if (el.tipo_hora == 'hp') {
                  if (this.caracterCurso == '') {
                    this.caracterCurso = 'Práctico'
                  } else {
                    this.caracterCurso += '-Práctico'
                  }
                }
              })
          } else {

          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getSumillaCurso: function (curso) {
      this.axios.get(`${this.URL}js-sumilla/${curso.id_curso}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.sumillaCurso = res.data.data
          } else {
            this.sumillaCurso = ''
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getUnidadesSilabo: function (curso) {
      this.axios.get(`${this.URL}js-unidades-silabo/${curso.id_curso}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.unidadesCurso = res.data.data

            this.silabusCronograma = []

            let uid = 0
            this.unidadesCurso.forEach((unid, index) => {

              uid += 1

              for (let i = 1; i <= unid.nro_semanas; i++) {
                let silCromograma = new GxSilabusCronograma()

                silCromograma.id_asignatura = this.asigSeleccionado.id_curso
                silCromograma.id_usuario_insert = this.identity.id_usuario
                silCromograma.id_docente = this.identity.dni
                silCromograma.id_periodo = this.periodo.id_periodo
                silCromograma.id_semestre = this.periodo.id_semestre
                silCromograma.id_modalidad = this.asigSeleccionado.id_modalidad
                silCromograma.id_filial = this.asigSeleccionado.id_filial

                silCromograma.uid = uid

                i == 1 ? silCromograma.rowspan = true : ''
                silCromograma.id_silabus_unidades = unid.id_silabus_unidades
                silCromograma.semana = i + (index * 4)

                let objPorc = this.porcentajes.filter(por => por.id_porcentaje_avanze == silCromograma.semana)[0]

                if (objPorc != undefined) {
                  silCromograma.porcentaje = parseInt(objPorc.porcentaje * 100)
                  this.silabusCronograma.push(silCromograma)
                }

              }

            })
          } else {
            this.unidadesCurso = null
          }
        })
        .catch(err => {
          console.dir(err)
        })
        .then(() => {

        })
    },

    insertarTodosCronogramas: async function () {
      let metas = ''
      this.silabusCronograma.map(cronograma => {
        let uid = cronograma.uid

        if (cronograma.metas_aprendizaje != '') {
          metas = cronograma.metas_aprendizaje
        }

        cronograma.metas_aprendizaje = metas

        this.insertarCronograma(cronograma)

        return cronograma

      })

    },

    insertarCronograma: async function (cronograma) {
      await this.axios.post(`${this.URL}js-ins-silabus-cronograma`, cronograma, this.autho)
        .then(res => {

        })
        .catch(err => {
          console.dir(err)
        })
    },

    actualizarNombresUnidad: async function () {
      this.unidadesCurso.map(unidad => {
        this.actualizarNombreUnidad(unidad)
      })
    },

    actualizarNombreUnidad: async function (unidad) {
      await this.axios.post(`${this.URL}js-upd-silabus-unidades`, unidad, this.autho)
        .then(res => {

        })
        .catch(err => {
          console.dir(err)
        })
    },

    getPorcentajes: function () {
      this.axios.get(`${this.URL}js-porcentaje-silabo`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.porcentajes = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    seleccionarAsignatura: async function (curso) {
      // if (curso.silabus != 1) {
        this.loadAjax = true
        this.cursoSelect = true
        this.asigSeleccionado = curso
        await this.getDatosDocente(curso)
        await this.getTipoHora(curso)
        await this.getSumillaCurso(curso)
        await this.getUnidadesSilabo(curso)
        await this.getObjetivosSilabus()
        await this.getInvestigacionSilabus()
        await this.getEstrategiaSilabus()
        await this.getRecursoSilabus()
        await this.getEvaluacionSilabus()
        await this.getBibliografiaSilabus()
        await this.getRefwebSilabus()
      // } else {
      //   alertify.alert('SIGEDO', 'El silabus de este curso ya fue capturado')
      // }
      this.loadAjax = false
    },

    getObjetivosSilabus: function () {
      this.silabusObjetivos = []

      this.axios.get(`${this.URL}js-silabus-objetivo/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusObjetivos = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    agregarObjetivo: async function () {
      this.loadAjax = true
      this.gx_silabus_objetivo.id_asignatura = this.asigSeleccionado.id_curso
      this.gx_silabus_objetivo.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_objetivo.id_docente = this.identity.dni
      this.gx_silabus_objetivo.id_periodo = this.periodo.id_periodo
      this.gx_silabus_objetivo.id_semestre = this.periodo.id_semestre
      this.gx_silabus_objetivo.id_modalidad = this.asigSeleccionado.id_modalidad
      this.gx_silabus_objetivo.id_filial = this.asigSeleccionado.id_filial

      await this.insertarSilabusObjetivo()
      this.loadAjax = false
    },

    insertarSilabusObjetivo: async function () {
      await this.axios.post(`${this.URL}js-ins-silabus-objetivo`, this.gx_silabus_objetivo, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_objetivo.id_silabus_obj = res.data.id
            this.silabusObjetivos.push(this.gx_silabus_objetivo)
            this.gx_silabus_objetivo = new GxSilabusObjetivo()
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    removerObjetivo: async function (index, id_silabus_obj) {
      await this.axios.delete(`${this.URL}js-del-silabus-objetivo/${id_silabus_obj}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusObjetivos = this.silabusObjetivos.filter(obj => this.silabusObjetivos.indexOf(obj) != index)
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getInvestigacionSilabus: function () {
      this.silabusInvestig = []

      this.axios.get(`${this.URL}js-silabus-investig/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusInvestig = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    agregarInv: async function () {
      this.loadAjax = true
      this.gx_silabus_investig.id_asignatura = this.asigSeleccionado.id_curso
      this.gx_silabus_investig.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_investig.id_docente = this.identity.dni
      this.gx_silabus_investig.id_periodo = this.periodo.id_periodo
      this.gx_silabus_investig.id_semestre = this.periodo.id_semestre
      this.gx_silabus_investig.id_modalidad = this.asigSeleccionado.id_modalidad
      this.gx_silabus_investig.id_filial = this.asigSeleccionado.id_filial

      await this.insertarSilabusInvestigacion()
      this.loadAjax = false
    },

    insertarSilabusInvestigacion: async function () {
      await this.axios.post(`${this.URL}js-ins-silabus-investig`, this.gx_silabus_investig, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_investig.id_silabus_investig = res.data.id
            this.silabusInvestig.push(this.gx_silabus_investig)
            this.gx_silabus_investig = new GxSilabusInvestig()
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    removerInv: function (index, id_silabus_investig) {
      this.axios.delete(`${this.URL}js-del-silabus-investig/${id_silabus_investig}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusInvestig = this.silabusInvestig.filter(inv => this.silabusInvestig.indexOf(inv) != index)
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getEstrategiaSilabus: function () {
      this.silabusEstrategias = []

      this.axios.get(`${this.URL}js-silabus-estrategias/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusEstrategias = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    agregarEstrategia: async function () {
      this.loadAjax = true
      this.gx_silabus_estrategia.id_asignatura = this.asigSeleccionado.id_curso
      this.gx_silabus_estrategia.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_estrategia.id_docente = this.identity.dni
      this.gx_silabus_estrategia.id_periodo = this.periodo.id_periodo
      this.gx_silabus_estrategia.id_semestre = this.periodo.id_semestre
      this.gx_silabus_estrategia.id_modalidad = this.asigSeleccionado.id_modalidad
      this.gx_silabus_estrategia.id_filial = this.asigSeleccionado.id_filial

      await this.insertarSilabusEstrategias()
      this.loadAjax = false
    },

    insertarSilabusEstrategias: async function () {
      await this.axios.post(`${this.URL}js-ins-silabus-estrategias`, this.gx_silabus_estrategia, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_estrategia.id_silabus_evaluacion = res.data.id
            this.silabusEstrategias.push(this.gx_silabus_estrategia)
            this.gx_silabus_estrategia = new GxSilabusEstrategias()
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },


    removerEstrategia: function (index, id_silabus_estrategias) {
      this.axios.delete(`${this.URL}js-del-silabus-estrategias/${id_silabus_estrategias}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusEstrategias = this.silabusEstrategias.filter(inv => this.silabusEstrategias.indexOf(inv) != index)
          }
        })
        .catch(err => {
          console.dir(err)
        })

    },

    getRecursoSilabus: function () {
      this.silabusRecursos = []

      this.axios.get(`${this.URL}js-silabus-recursos/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusRecursos = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    insertarSilabusRecursos: async function () {
      await this.axios.post(`${this.URL}js-ins-silabus-recursos`, this.gx_silabus_recurso, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_recurso.id_silabus_recursos = res.data.id
            this.silabusRecursos.push(this.gx_silabus_recurso)
            this.gx_silabus_recurso = new GxSilabusRecursos()
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    agregarRecurso: async function () {
      this.loadAjax = true
      this.gx_silabus_recurso.id_asignatura = this.asigSeleccionado.id_curso
      this.gx_silabus_recurso.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_recurso.id_docente = this.identity.dni
      this.gx_silabus_recurso.id_periodo = this.periodo.id_periodo
      this.gx_silabus_recurso.id_semestre = this.periodo.id_semestre
      this.gx_silabus_recurso.id_modalidad = this.asigSeleccionado.id_modalidad
      this.gx_silabus_recurso.id_filial = this.asigSeleccionado.id_filial

      await this.insertarSilabusRecursos()
      this.loadAjax = false
    },

    removerRecurso: function (index, id_silabus_recursos) {
      this.axios.delete(`${this.URL}js-del-silabus-recursos/${id_silabus_recursos}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusRecursos = this.silabusRecursos.filter(inv => this.silabusRecursos.indexOf(inv) != index)
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getEvaluacionSilabus: function () {
      this.silabusEvaluacion = []

      this.axios.get(`${this.URL}js-silabus-evaluacion/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusEvaluacion = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    insertarSilabusEvaluacion: async function () {
      await this.axios.post(`${this.URL}js-ins-silabus-evaluacion`, this.gx_silabus_evaluacion, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_evaluacion.id_silabus_evaluacion = res.data.id
            this.silabusEvaluacion.push(this.gx_silabus_evaluacion)
            this.gx_silabus_evaluacion = new GxSilabusEvaluacion()
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    agregarEvaluacion: async function () {
      this.loadAjax = true
      this.gx_silabus_evaluacion.id_asignatura = this.asigSeleccionado.id_curso
      this.gx_silabus_evaluacion.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_evaluacion.id_docente = this.identity.dni
      this.gx_silabus_evaluacion.id_periodo = this.periodo.id_periodo
      this.gx_silabus_evaluacion.id_semestre = this.periodo.id_semestre
      this.gx_silabus_evaluacion.id_modalidad = this.asigSeleccionado.id_modalidad
      this.gx_silabus_evaluacion.id_filial = this.asigSeleccionado.id_filial

      await this.insertarSilabusEvaluacion()
      this.loadAjax = false
    },

    removerEvaluacion: function (index, id_silabus_evaluacion) {
      this.axios.delete(`${this.URL}js-del-silabus-evaluacion/${id_silabus_evaluacion}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusEvaluacion = this.silabusEvaluacion.filter(inv => this.silabusEvaluacion.indexOf(inv) != index)
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getBibliografiaSilabus: function () {
      this.silabusBibliografia = []

      this.axios.get(`${this.URL}js-silabus-bibliografia/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusBibliografia = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    insertarSilabusBibliografia: async function () {
      await this.axios.post(`${this.URL}js-ins-silabus-bibliografia`, this.gx_silabus_bibliografia, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_bibliografia.id_silabus_biblio = res.data.id
            this.silabusBibliografia.push(this.gx_silabus_bibliografia)
            this.gx_silabus_bibliografia = new GxSilabusBibliografia()
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    agregarBibliografia: async function () {
      this.loadAjax = true
      this.gx_silabus_bibliografia.id_asignatura = this.asigSeleccionado.id_curso
      this.gx_silabus_bibliografia.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_bibliografia.id_docente = this.identity.dni
      this.gx_silabus_bibliografia.id_periodo = this.periodo.id_periodo
      this.gx_silabus_bibliografia.id_semestre = this.periodo.id_semestre
      this.gx_silabus_bibliografia.id_modalidad = this.asigSeleccionado.id_modalidad
      this.gx_silabus_bibliografia.id_filial = this.asigSeleccionado.id_filial

      await this.insertarSilabusBibliografia()
      this.loadAjax = false
    },

    removerBibliografia: function (index, id_silabus_biblio) {
      this.axios.delete(`${this.URL}js-del-silabus-bibliografia/${id_silabus_biblio}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusBibliografia = this.silabusBibliografia.filter(inv => this.silabusBibliografia.indexOf(inv) != index)
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getRefwebSilabus: function () {
      this.silabusRefweb = []

      this.axios.get(`${this.URL}js-silabus-refweb/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusRefweb = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    insertarSilabusRefweb: async function () {
      await this.axios.post(`${this.URL}js-ins-silabus-refweb`, this.gx_silabus_refweb, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_refweb.id_silabus_refweb = res.data.id
            this.silabusRefweb.push(this.gx_silabus_refweb)
            this.gx_silabus_refweb = new GxSilabusRefweb()
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    agregarRefweb: async function () {
      this.loadAjax = true
      this.gx_silabus_refweb.id_asignatura = this.asigSeleccionado.id_curso
      this.gx_silabus_refweb.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_refweb.id_docente = this.identity.dni
      this.gx_silabus_refweb.id_periodo = this.periodo.id_periodo
      this.gx_silabus_refweb.id_semestre = this.periodo.id_semestre
      this.gx_silabus_refweb.id_modalidad = this.asigSeleccionado.id_modalidad
      this.gx_silabus_refweb.id_filial = this.asigSeleccionado.id_filial

      await this.insertarSilabusRefweb()
      this.loadAjax = false

    },

    removerRefweb: function (index, id_silabus_refweb) {
      this.axios.delete(`${this.URL}js-del-silabus-refweb/${id_silabus_refweb}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusRefweb = this.silabusRefweb.filter(inv => this.silabusRefweb.indexOf(inv) != index)
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    guardarSilabus: async function () {


      await this.axios.post(`${this.URL}js-capturar-silabo-asigdoc/${this.asigSeleccionado.id_curso}/${this.asigSeleccionado.id_filial}/${this.asigSeleccionado.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, {}, this.autho)
        .then(res => {

        })
        .catch(err => {
          console.dir(err)
        })
    },

    capturarSilabus: async function () {
      this.loadAjax = true
      await this.actualizarNombresUnidad()
      await this.insertarTodosCronogramas()
      await this.guardarSilabus()
      this.loadAjax = false
      this.cursoSelect = false
      this.asigSeleccionado = null
      this.getCursosAsignados()
    }
  }
}
</script>

<style lang="scss" scoped>
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    input,
    select,
    option,
    label,
    textarea,
    p {
        color: #000;
    }

    .group {
        border: 1px solid #ececec;
        border-radius: 0;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
        padding: 15px;
        background: #fcfcfc;
        box-shadow: 10px 14px 5px 0px rgba(0, 0, 0, 0.75);
        .show {
            color: rgb(28, 113, 116);
        }
    }

    .loading {
        text-align: center;
    }

    .table-carga {
        max-height: 70vh;
    }

    .active {
        & a {
            background: rgb(242, 242, 242) !important;
            color: #0f6ecd !important;
        }
    }

    .float {
        position: fixed;
        width: 60px;
        height: 60px;
        bottom: 20px;
        right: 20px;
        background-color: rgb(23, 180, 228);
        color: #FFF;
        border-radius: 50px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
        transition: 1s;
        text-decoration: none;
        & i {
            font-size: 1.8em;
            text-decoration: none;
        }
        &:hover {
            box-shadow: none;
        }
    }

    .float-guardar {
        position: fixed;
        width: 60px;
        height: 60px;
        bottom: 20px;
        right: 50%;
        background-color: rgb(52, 189, 129);
        color: #FFF;
        border-radius: 50px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
        transition: 1s;
        text-decoration: none;
        & i {
            font-size: 1.8em;
            text-decoration: none;
        }
        &:hover {
            box-shadow: none;
        }
    }

    .float-error {
        position: fixed;
        width: 40px;
        height: 40px;
        top: 50%;
        left: 10px;
        background-color: rgb(243, 98, 100);
        color: #FFF;
        border-radius: 50%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
        transition: 1s;
        text-decoration: none;
        & i {
            font-size: 1.4em;
            text-decoration: none;
        }
    }

    .loader {
        color: #ffffff;
        font-size: 20px;
        margin: 100px auto;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        position: relative;
        text-indent: -9999em;
        -webkit-animation: load4 1.3s infinite linear;
        animation: load4 1.3s infinite linear;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
    }

    @-webkit-keyframes load4 {
        0%,
        100% {
            box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
        }
        12.5% {
            box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
        }
        25% {
            box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
        }
        37.5% {
            box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
        }
        50% {
            box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
        }
        62.5% {
            box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
        }
        75% {
            box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
        }
        87.5% {
            box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
        }
    }

    @keyframes load4 {
        0%,
        100% {
            box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
        }
        12.5% {
            box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
        }
        25% {
            box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
        }
        37.5% {
            box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
        }
        50% {
            box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
        }
        62.5% {
            box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
        }
        75% {
            box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
        }
        87.5% {
            box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
        }
    }
</style>

