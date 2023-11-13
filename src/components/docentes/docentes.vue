<template>
  <div class="ed-container init">
    <h3 class="ed-item m-90 to-center gr-center sep-10">
      <strong>
        DOCENTES
      </strong>
    </h3>

    <div class="ed-item ed-container">
      <div class="ed-item to-center m-10 hint--bottom hint--info" aria-label="Nuevo Docente">
        <i @click="reiniciarNuevoDocente" class="fas fa-plus-square pointer action"></i>
      </div>

      <div class="ed-item to-center m-10 hint--bottom hint--info" aria-label="Descargar Plantilla">
        <a :href="`${URLPDF}api/src/reportes/Plantilla_Docente.pdf`" download>
          <i class="far fa-file-pdf  pointer action"></i>
        </a>
      </div>
    </div>

    <div v-if="load" class="ed-item gr-center">
      <loading />
    </div>

    <div class="ed-item ed-container sep-10">
      <div class="ed-item sep-20 ed-container group">
        <h4 @click="datosPersonales = !datosPersonales" class="ed-item sep-10 l-95 to-center f-row pointer">
          <strong>
            I. DATOS PERSONALES
          </strong>
        </h4>

        <i @click="datosPersonales = !datosPersonales" v-if="datosPersonales" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="datosPersonales = !datosPersonales" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="datosPersonales" class="ed-item ed-container">
            <div class="ed-item ed-container sep-5 l-30 to-center form-group">
              <div class="ed-item form-group">
                <label :class="['hint--top hint--error', label_dni]" aria-label="El DNI debe tener 8 caracteres">DNI</label>
                <input :disabled="isEditDocente" @blur="verficarDNI" v-model="gx_docente.dni" type="number" class="form-control">
              </div>
              <div class="ed-item gr-center radio">
                <label class="radio-inline">
                  <input v-model="gx_docente.sexo" value="Masculino" type="radio"> Masculino
                </label>
                <label class="radio-inline">
                  <input v-model="gx_docente.sexo" value="Femenino" type="radio"> Femenino
                </label>
              </div>
            </div>
            <div class="ed-item sep-5 l-30 to-center form-group">
              <label>APELLIDO PATERNO</label>
              <input v-model="gx_docente.cpaterno" type="text" class="form-control">
            </div>
            <div class="ed-item sep-5 l-30 to-center form-group">
              <label>APELLIDO MATERNO</label>
              <input v-model="gx_docente.cmaterno" type="text" class="form-control">
            </div>
            <div class="ed-item sep-5 l-30 to-center form-group">
              <label>NOMBRE</label>
              <input v-model="gx_docente.cnombres" type="text" class="form-control">
            </div>
            <div class="ed-item sep-5 l-30 to-center form-group">
              <label>FECHA NACIMIENTO</label>
              <input v-model="gx_docente.fechanacimiento" type="date" class="form-control">
            </div>
            <div class="ed-item sep-5 l-30 to-center form-group">
              <label>LUGAR DE NACIMIENTO</label>
              <span @click="abrirModalPais" class="hint--top hint--bounce" aria-label="Administrar Países">
                <i class="fas fa-globe action pointer"></i>
              </span>
              <select v-model="gx_docente.id_pais_nac" class="form-control">
                <option v-for="(pais, index) in paisesActivos" :key="index" :value="pais.id_pais">
                  {{pais.cpais}}
                </option>
              </select>
            </div>
            <div v-if="isEditDocente" class="ed-item ed-container sep-5 f-row f-space-ar to-center form-group">
              <img v-if="gx_docente.img && isEditDocente" :src="`${this.URLIMAGE}uploads/docentes/${gx_docente.img}`"
                class="imgSalida ed-item sep-5 m-30 to-center">
              <img src="" id="imgSalida" class="imgSalida ed-item sep-5 m-30 to-center">
              <input @change="saveFoto" id="imgEntrada" type="file" class="form-control ed-item sep-5 m-30 to-center">
            </div>
          </div>
        </transition>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h4 @click="datosResidencia = !datosResidencia" class="ed-item sep-10 l-95 to-center pointer">
          <strong>
            II. DATOS DE RESIDENCIA
          </strong>
        </h4>

        <i @click="datosResidencia = !datosResidencia" v-if="datosResidencia" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="datosResidencia = !datosResidencia" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="datosResidencia" class="ed-item ed-container">
            <div class="ed-item ed-container">
              <div class="ed-item ed-container sep-5 l-40 to-center form-group">
                <label>Dirección</label>
                <input v-model="gx_direcciones.cdireccion" type="text" class="form-control">
              </div>
              <div class="ed-item ed-container sep-5 l-40 to-center form-group">
                <label>Departamento</label>
                <select v-model="gx_direcciones.cdepa" class="form-control">
                  <option v-for="(dep, index) in departamentos" :key="index" :value="dep.cdepartamento">
                    {{dep.cdepartamento}}
                  </option>
                </select>
              </div>
              <div class="ed-item ed-container sep-5 l-40 to-center form-group">
                <label>Provincia</label>
                <select v-model="gx_direcciones.cprov" class="form-control">
                  <option v-for="(prov, index) in provincias" :key="index" :value="prov.cprovincia">
                    {{prov.cprovincia}}
                  </option>
                </select>
              </div>
              <div class="ed-item ed-container sep-5 l-40 to-center form-group">
                <label>Distrito</label>
                <select v-model="gx_direcciones.cdist" class="form-control">
                  <option v-for="(dist, index) in distritos" :key="index" :value="dist.cdistrito">
                    {{dist.cdistrito}}
                  </option>
                </select>
              </div>
              <div class="ed-item ed-container sep-5 l-80 to-center form-group">
                <label>Referencia</label>
                <input v-model="gx_direcciones.cref" type="text" class="form-control">
              </div>
              <div class="ed-item gr-center">
                <button :disabled="!direccionValida" @click="agregarDireccion" :class="['btn btn-info btn-rounded btn-hov', !direccionValida ? 'hint--top hint--error':'']"
                  aria-label="Rellene todos los campos necesarios">
                  Agregar
                </button>
              </div>
            </div>
            <div v-if="direcciones.length > 0" class="ed-item ed-container table-content">
              <table class="table table-responsive table-striped table-bordered table-hover table-own">
                <thead class="table-head">
                  <tr>
                    <th>Dirección</th>
                    <th>Departamento</th>
                    <th>Provincia</th>
                    <th>Distrito</th>
                    <th>Referencia</th>
                    <th>Principal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(dir, index) in direcciones" :key="index">
                    <td>{{dir.cdireccion}}</td>
                    <td>{{dir.cdepa}}</td>
                    <td>{{dir.cprov}}</td>
                    <td>{{dir.cdist}}</td>
                    <td>{{dir.cref}}</td>
                    <td @click="asignarC9(index)">
                      <i v-if="dir.c9 == 1" class="far fa-check-circle action"></i>
                    </td>
                    <td @click="quitarDireccion(index)">
                      <i class="fas fa-trash-alt action red"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h4 @click="datosContacto = !datosContacto" class="ed-item sep-10 l-95 to-center pointer">
          <strong>
            III. DATOS DE CONTACTO
          </strong>
        </h4>

        <i @click="datosContacto = !datosContacto" v-if="datosContacto" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="datosContacto = !datosContacto" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="datosContacto" class="ed-item ed-container">
            <div class="ed-item ed-container sep-5 l-30 to-center form-group">
              <label>Telefono Principal</label>
              <input v-model="gx_docente.telefono" type="text" class="form-control">
            </div>

            <div class="ed-item ed-container sep-5 l-30 to-center form-group">
              <label>Celular Principal</label>
              <input v-model="gx_docente.celular" type="text" class="form-control">
            </div>

            <div class="ed-item ed-container sep-5 l-30 to-center form-group">
              <label>Email Principal</label>
              <input v-model="gx_docente.email" type="email" class="form-control">
            </div>

            <div class="ed-item sep-10 ed-container group">
              <div class="ed-item ed-container sep-5 l-40 to-center form-group">
                <label>Otros Tipos Contacto</label>
                <select v-model="gx_contacto_docente.id_tipo_contacto" class="form-control">
                  <option v-for="(tipo, index) in tipoContactos" :key="index" :value="tipo.id_tipo_contacto">
                    {{tipo.ctipocontacto}}
                  </option>
                </select>
              </div>
              <div class="ed-item ed-container sep-5 l-40 to-center form-group">
                <label>Contacto</label>
                <input v-model="gx_contacto_docente.cvalor" type="text" class="form-control">
              </div>
              <div class="ed-item gr-center">
                <button :disabled="!contactoValido" @click="agregarContacto" :class="['btn btn-info btn-rounded btn-hov', !contactoValido ? 'hint--top hint--error':'']"
                  aria-label="Rellene todos los campos necesarios">
                  Agregar
                </button>
              </div>
              <div v-if="contactos.length > 0" class="ed-item m-60 to-center ed-container table-content">
                <table class="table table-responsive table-striped table-bordered table-hover table-own">
                  <thead class="table-head">
                    <tr>
                      <th>Tipo Contacto</th>
                      <th>Contacto</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody class="table-body">
                    <tr v-for="(contacto, index) in contactos" :key="index">
                      <td>{{contacto.ctipo}}</td>
                      <td>{{contacto.cvalor}}</td>
                      <td @click="quitarContacto(index)">
                        <i class="fas fa-trash-alt action pointer red"></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h4 @click="datosIngresoUniv = !datosIngresoUniv" class="ed-item sep-10 l-95 to-center pointer">
          <strong>
            IV. DATOS DE INGRESO A LA UNIVERSIDAD
          </strong>
        </h4>

        <i @click="datosIngresoUniv = !datosIngresoUniv" v-if="datosIngresoUniv" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="datosIngresoUniv = !datosIngresoUniv" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="datosIngresoUniv" class="ed-item ed-container">
            <div class="ed-item sep-10 m-90 to-center ed-container">
              <div class="ed-item m-50 l-30 to-center gr-center sep-5 form-group">
                <label>FECHA INGRESO EN LA UNIVERSIDAD</label>
                <input v-model="gx_docente.f_ingreso" type="date" class="form-control">
              </div>
              <div class="ed-item m-50 l-70 to-center gr-center ed-container">
                <div class="checkbox ed-item sep-5">
                  <label>
                    <input v-model="ley_30220" type="checkbox"> DOCENTE UNIV. A LA ENTRADA EN VIGENCIA DE LA LEY 30220
                  </label>
                </div>
                <div class="checkbox ed-item sep-5">
                  <label>
                    <input v-model="investigador" type="checkbox"> DOCENTE INVESTIGADOR
                  </label>
                </div>
                <div class="checkbox ed-item sep-5">
                  <label>
                    <input v-model="dina" type="checkbox"> DOCENTE REGISTRADO EN DINA
                  </label>
                </div>
                <div class="checkbox ed-item sep-5">
                  <label>
                    <input v-model="regina" type="checkbox"> DOCENTE REGISTRADO EN REGINA
                  </label>
                </div>
                <div class="checkbox ed-item sep-5">
                  <label>
                    <input v-model="carpeta" type="checkbox"> CARPETA
                  </label>
                </div>
              </div>
            </div>
            <div class="ed-item sep-10 m-95 to-center ed-container">
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Cargo</label>
                <select v-model.number="gx_docente.id_cargo" class="form-control">
                  <option v-for="(cargo, index) in cargosDocente" :key="index" :value="cargo.id_cargo">
                    {{cargo.nombre}}
                  </option>
                </select>
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Didáctica Superior</label>
                <select v-model="gx_docente.didactica_superior" class="form-control">
                  <option :value="'ESTUDIO'">Estudio</option>
                  <option :value="'TITULO'">Título</option>
                </select>
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Especialización</label>
                <input v-model="gx_docente.especializacion" type="text" class="form-control">
              </div>
              <div class="ed-item l-50 to-center sep-5 form-group">
                <label>Observaciones</label>
                <textarea v-model="gx_docente.observaciones" class="form-control"></textarea>
              </div>
              <div class="ed-item l-50 to-center sep-5 form-group">
                <label>Facultad Adscrita</label>
                <select v-model.number="gx_docente.id_facultad_adscrito" class="form-control">
                  <option v-for="(facultad, index) in arrFacultades" :key="index" :value="facultad.id_facultad">
                    {{facultad.nombre}}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h4 @click="gradoAcademico = !gradoAcademico" class="ed-item sep-10 l-95 to-center pointer">
          <strong>
            V. GRADO ACADÉMICO
          </strong>
        </h4>

        <i @click="gradoAcademico = !gradoAcademico" v-if="gradoAcademico" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="gradoAcademico = !gradoAcademico" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="gradoAcademico" class="ed-item ed-container">
            <div class="ed-item ed-container">
              <div class="ed-item m-50 l-25 to-center sep-5 form-group">
                <label>Tipo</label>
                <select v-model="tipo_grado" class="form-control">
                  <option :value="0">Seleccionar</option>
                  <option :value="1">Bachiller</option>
                  <option :value="2">Maestria</option>
                  <option :value="3">Doctorado</option>
                  <option :value="4">Post Doctorado</option>
                </select>
              </div>

              <div class="ed-item m-50 l-25 to-center sep-5 form-group">
                <label>Denominación</label>
                <span @click="crud_grados = true" class="hint--top hint--bounce" aria-label="Administrar Denominaciones">
                  <i class="fas fa-graduation-cap pointer action"></i>
                </span>
                <select v-model="gx_grado_academico.id_titulo" class="form-control">
                  <option v-for="(grado, index) in grados" :key="index" :value="grado.id_titulo">
                    {{grado.nombre}}
                  </option>
                </select>
              </div>


              <div class="ed-item m-50 l-25 to-center sep-5 form-group">
                <label>Universidad</label>
                <span @click="abrirModalUni" class="hint--top hint--bounce" aria-label="Administrar Universidades">
                  <i class="fas fa-university pointer action"></i>
                </span>
                <select v-model="gx_grado_academico.id_universidad" class="form-control">
                  <option v-for="(universidad, index) in universidades" :key="index" :value="universidad.idreg">
                    {{universidad.cuniversidad}}
                  </option>
                </select>
              </div>

              <div class="ed-item m-50 l-25 to-center sep-5 form-group">
                <label>País</label>
                <select v-model="gx_grado_academico.id_pais" class="form-control">
                  <option v-for="(pais, index) in paisesActivos" :key="index" :value="pais.id_pais">
                    {{pais.cpais}}
                  </option>
                </select>
              </div>

              <div v-if="tipo_grado == 2 || tipo_grado == 3" class="ed-item m-50 l-30 to-center sep-5 form-group">
                <label>Mención en</label>
                <input v-model="gx_grado_academico.cmension" type="text" class="form-control">
              </div>


              <div class="ed-item m-50 l-30 to-center sep-5 form-group">
                <label>Fecha Inicio</label>
                <input disabled="disabled" v-model="gx_grado_academico.finicio" type="date" class="form-control">
              </div>

              <div class="ed-item m-50 l-30 to-center sep-5 form-group">
                <label>Fecha Fin</label>
                <input disabled="disabled" v-model="gx_grado_academico.ffin" type="date" class="form-control">
              </div>

              <div class="ed-item m-50 l-30 to-center sep-5 form-group">
                <label>Fecha Obtención de Grado</label>
                <input v-model="gx_grado_academico.fgrado" type="date" class="form-control">
              </div>
            </div>
            <div class="ed-item gr-center">
              <button :disabled="!gradoValido" @click="agregarGrado" :class="['btn btn-info btn-rounded btn-hov', !gradoValido ? 'hint--right hint--bounce hint--error':'']"
                aria-label="Rellene todos los campos necesarios">
                Agregar
              </button>
            </div>
            <div v-if="gradosAcemicos.length > 0" class="ed-item m-95 to-center ed-container table-content">
              <table class="table table-responsive table-striped table-bordered table-hover table-own">
                <thead class="table-head">
                  <tr>
                    <th>Título</th>
                    <th>Mención</th>
                    <th>Universidad</th>
                    <th>País</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Obtencion Grado</th>
                    <th></th>
                    <th>Mayor Grado</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(grado, index) in gradosAcemicos" :key="index">
                    <td>{{grado.ctitulo}}</td>
                    <td>{{grado.cmension}}</td>
                    <td>{{grado.cuniversidad}}</td>
                    <td>{{grado.cpais}}</td>
                    <td>{{grado.finicio}}</td>
                    <td>{{grado.ffin}}</td>
                    <td>{{grado.fgrado}}</td>
                    <td @click="quitarGrado(index)">
                      <i class="fas fa-trash-alt pointer action red"></i>
                    </td>
                    <td @click="seleccionarMayorGrado(index)">
                      <i v-if="grado.c9 == 1" class="fas fa-check-circle pointer action"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h4 @click="tipoDocente = !tipoDocente" class="ed-item sep-10 l-95 to-center pointer">
          <strong>
            VI. TIPO DOCENTE
          </strong>
        </h4>

        <i @click="tipoDocente = !tipoDocente" v-if="tipoDocente" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="tipoDocente = !tipoDocente" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="tipoDocente" class="ed-item ed-container">
            <div class="ed-item ed-container">
              <!-- <div class="ed-item l-25 to-center sep-5 form-group">
                                  <label>Modalidad en que ejerce la docencia</label>
                                  <select v-model.number="gx_docente.id_modalidad" class="form-control">
                                      <option v-for="(modalidad, index) in modalidades" :key="index" :value="modalidad.id_modalidad">
                                          {{modalidad.nombre}}
                                      </option>
                                  </select>
                              </div> -->
              <div class="ed-item l-25 to-center sep-5 form-group">
                <label>Categoría Docente</label>
                <select v-model="gx_docente.categoria" class="form-control">
                  <option v-for="(categoria, index) in categoriaDocente" :key="index" :value="categoria.ccategoria">
                    {{categoria.ccategoria}}
                  </option>
                </select>
              </div>
              <div class="ed-item l-25 to-center sep-5 form-group">
                <label>Condición Docente</label>
                <select v-model="gx_docente.condicion" class="form-control">
                  <option v-for="(condicion, index) in condicionDocente" :key="index" :value="condicion.ccondiciondoc">
                    {{condicion.ccondiciondoc}}
                  </option>
                </select>
              </div>
              <!-- <div class="ed-item l-25 to-center sep-5 form-group">
                                  <label>Régimen de dedicación Docente</label>
                                  <select v-model="gx_docente.dedicacion" class="form-control">
                                      <option v-for="(dedicacion, index) in dedicacionDocente" :key="index" :value="dedicacion.cdedicaciondoc">
                                          {{dedicacion.cdedicaciondoc}}
                                      </option>
                                  </select>
                              </div> -->
            </div>
          </div>
        </transition>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h4 @click="expDocencia = !expDocencia" class="ed-item sep-10 l-95 to-center pointer">
          <strong>
            VII. EXPERIENCIA EN DOCENCIA UNIVERSITARIA
          </strong>
        </h4>

        <i @click="expDocencia = !expDocencia" v-if="expDocencia" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="expDocencia = !expDocencia" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="expDocencia" class="ed-item ed-container">
            <div class="ed-item ed-container">
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Asignatura</label>
                <input v-model="gx_experiencia_doc.cnombreasig" type="text" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Universidad</label>
                <select v-model="gx_experiencia_doc.id_universidad" class="form-control">
                  <option v-for="(universidad, index) in universidades" :key="index" :value="universidad.idreg">
                    {{universidad.cuniversidad}}
                  </option>
                </select>
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Facultad</label>
                <input v-model="gx_experiencia_doc.cfacultad" type="text" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Escuela</label>
                <input v-model="gx_experiencia_doc.cescuela" type="text" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Fecha Inicio</label>
                <input v-model="gx_experiencia_doc.finicio" type="date" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Fecha Fin</label>
                <input v-model="gx_experiencia_doc.ffin" type="date" class="form-control">
              </div>
            </div>

            <div class="ed-item gr-center">
              <button :disabled="!validExperienciaDoc" @click="agregarExperienciaDoc" :class="['btn btn-info btn-rounded btn-hov', !validExperienciaDoc ? 'hint--right hint--bounce hint--error':'']"
                aria-label="Rellene todos los campos necesarios">
                Agregar
              </button>
            </div>

            <div v-if="experienciaDoc.length > 0" class="ed-item m-95 to-center ed-container table-content mh">
              <table class="table table-responsive table-striped table-bordered table-hover table-own">
                <thead class="table-head">
                  <tr>
                    <th>Asignatura</th>
                    <th>Universidad</th>
                    <th>Facultad</th>
                    <th>Escuela</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(exp, index) in experienciaDoc" :key="index">
                    <td>{{exp.cnombreasig}}</td>
                    <td>{{exp.cuniversidad}}</td>
                    <td>{{exp.cfacultad}}</td>
                    <td>{{exp.cescuela}}</td>
                    <td>{{exp.finicio}}</td>
                    <td>{{exp.ffin}}</td>
                    <td @click="quitarExperienciaDoc(index)">
                      <i class="fas fa-trash-alt pointer action red"></i>
                    </td>
                    <td v-if="isEditDocente">
                      <i v-if="exp.img != ''" class="fas fa-check action pointer"></i>
                      <input @change="saveEsperienciaImg($event, exp)" id="img-entrada-exp" type="file" class="form-control ed-item sep-5 m-30 to-center">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </transition>
      </div>

      <div class="ed-item sep-20 ed-container group">
        <h4 @click="expProfesional = !expProfesional" class="ed-item sep-10 l-95 to-center pointer">
          <strong>
            VII. EXPERIENCIA PROFESIONAL
          </strong>
        </h4>

        <i @click="expProfesional = !expProfesional" v-if="expProfesional" class="fas fa-angle-double-up pointer action show"></i>
        <i @click="expProfesional = !expProfesional" v-else class="fas fa-angle-double-down pointer action show"></i>

        <transition name="slide-fade">
          <div v-show="expProfesional" class="ed-item ed-container">
            <div class="ed-item ed-container">
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Centro Laboral</label>
                <input v-model="gx_experiencia_laboral.crazonsocial" type="text" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label :class="['hint--top hint--error', label_ruc]" aria-label="El RUC debe tener 11 caracteres">RUC</label>
                <input v-model="gx_experiencia_laboral.cruccentro" type="number" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Cargo</label>
                <input v-model="gx_experiencia_laboral.ccargo" type="text" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Fecha Inicio</label>
                <input v-model="gx_experiencia_laboral.finicio" type="date" class="form-control">
              </div>
              <div class="ed-item l-30 to-center sep-5 form-group">
                <label>Fecha Fin</label>
                <input v-model="gx_experiencia_laboral.ffin" type="date" class="form-control">
              </div>
            </div>

            <div class="ed-item gr-center">
              <button :disabled="!validExperienciaLaboral" @click="agregarExperienciaLaboral" :class="['btn btn-info btn-rounded btn-hov', !validExperienciaLaboral ? 'hint--right hint--bounce hint--error':'']"
                aria-label="Rellene todos los campos necesarios">
                Agregar
              </button>
            </div>

            <div v-if="experienciaLaboral.length > 0" class="ed-item m-95 to-center ed-container table-content mh">
              <table class="table table-responsive table-striped table-bordered table-hover table-own">
                <thead class="table-head">
                  <tr>
                    <th>Centro Laboral</th>
                    <th>RUC</th>
                    <th>Cargo</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(exp, index) in experienciaLaboral" :key="index">
                    <td>{{exp.crazonsocial}}</td>
                    <td>{{exp.cruccentro}}</td>
                    <td>{{exp.ccargo}}</td>
                    <td>{{exp.finicio}}</td>
                    <td>{{exp.ffin}}</td>
                    <td @click="quitarExperienciaLaboral(index)">
                      <i class="fas fa-trash-alt pointer action red"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>

    </div>

    <transition name="fade">
      <button @click="procesarDatosParaAlmacenamiento" v-show="validAllData && !isEditDocente" class="float-guardar hint--left hint--success"
        aria-label="Guardar Información">
        <i class="fas fa-save"></i>
      </button>
    </transition>

    <transition name="fade">
      <button @click="actualizarInformacion" v-show="validAllData && isEditDocente" class="float-guardar hint--left hint--success"
        aria-label="Editar Información">
        <i class="fas fa-edit"></i>
      </button>
    </transition>

    <transition name="fade">
      <button v-show="!validAllData" class="float-error hint--right hint--error hint--large hint--bounce" :aria-label="infoError">
        <i class="fas fa-exclamation-triangle"></i>
      </button>
    </transition>

    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="modalPais" class="modal">
        <paises @close="cerrarModalPais" />
      </div>
    </transition>


    <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutUp">
      <div v-if="modalListaDocentes" class="modal">
        <all-docentes @close="cerrarModalListaDocentes" @edit-docente="editarDocente" />
      </div>
    </transition>

    <div v-if="crud_grados" class="modal">
      <crud-grados @close="closeCrudGrados" />
    </div>

    <a href="" @click.prevent="abrirModalListaDocentes" class="float hint--left hint--info" aria-label="Lista de Docentes">
      <i class="fas fa-chalkboard-teacher"></i>
    </a>

    <div v-if="loadAjax" class="modal" style="display: flex;justify-content: center;align-items: center;">
      <div class="loader">Loading...</div>
    </div>

    <transition enter-active-class="animated rotateIn" leave-active-class="animated flipOutX">
      <div v-if="modalUni" class="modal">
        <universidades @close="cerrarModalUni" />
      </div>
    </transition>
  </div>
</template>

<script>
import alertify from 'alertifyjs'

import loading from '../templates/loading'

import GxDocente from '../../models/gx_docente.js'
import GxDirecciones from '../../models/gx_direcciones.js'
import GxContactoDocente from '../../models/gx_contacto_docente.js'
import GxGradoAcademico from '../../models/gx_grado_academico.js'
import GxExperienciaLaboral from '../../models/gx_experiencia_laboral.js'
import GxExperienciaDoc from '../../models/gx_experiencia_doc.js'
import GxC9 from '../../models/gx_c9.js'
import GxPostDoctorado from '../../models/gx_postdoctorado.js'

import paises from './modals/paises.vue'
import allDocentes from './modals/allDocentes.vue'
import universidades from './modals/universidades.vue'
import crudGrados from './modals/crudGrados.vue'

import GxUserEscuela from '../../models/gx_userescuela'
import GxDocenteFacultadH from '../../models/gx_docente_facultad_h'

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

    components: {
        loading,
        paises,
        allDocentes,
        universidades,
        crudGrados
    },


    mounted() {
        this.getIdentity()
    },

    data: () => ({
        identity: null, //Datos del usuario en sesión
        token: null,
        entorno: null,
        periodo: null,
        autho: null,

        idDocente: null,
        isEditDocente: false,
        modalListaDocentes: false,

        gx_docente: new GxDocente(),

        gx_direcciones: new GxDirecciones(),
        direcciones: [],

        gx_contacto_docente: new GxContactoDocente(),
        contactos: [],

        gx_grado_academico: new GxGradoAcademico(),
        gradosAcemicos: [],

        gx_experiencia_laboral: new GxExperienciaLaboral(),
        experienciaLaboral: [],

        gx_experiencia_doc: new GxExperienciaDoc(),
        experienciaDoc: [],

        tipoContactos: null,

        cargosDocente: null,

        modalidades: null,

        categoriaDocente: null,

        condicionDocente: null,

        dedicacionDocente: null,

        paises: null,
        paisesActivos: null,
        modalPais: false,

        departamentos: null,
        provincias: null,
        distritos: null,

        load: false,

        modalUni: false,

        /* Secciones */
        datosPersonales: false,
        datosResidencia: false,
        datosContacto: false,
        datosIngresoUniv: false,
        gradoAcademico: false,
        tipoDocente: false,
        expDocencia: false,
        expProfesional: false,

        /* Ingreso a la U */
        ley_30220: false,
        investigador: false,
        dina: false,
        carpeta: false,
        regina: false,

        /* Grados academicos */
        tipo_grado: 0,
        grados: null,
        universidades: null,

        infoError: '',
        isEditDocente: false,

        loadAjax: false,

        crud_grados: false,

        arrFacultades: null,

        idFacultadAdscrito: '',
    }),

    watch: {
        'gx_docente.cpaterno': function (n) {
            this.gx_docente.cpaterno = n.toUpperCase()
        },

        'gx_docente.cmaterno': function (n) {
            this.gx_docente.cmaterno = n.toUpperCase()
        },

        'gx_docente.cnombres': function (n) {
            this.gx_docente.cnombres = n.toUpperCase()
        },

        'gx_direcciones.cdireccion': function (n) {
            this.gx_direcciones.cdireccion = n.toUpperCase()
        },

        'gx_direcciones.cref': function (n) {
            this.gx_direcciones.cref = n.toUpperCase()
        },

        'gx_docente.especializacion': function (n) {
            this.gx_docente.especializacion = n.toUpperCase()
        },

        'gx_docente.observaciones': function (n) {
            this.gx_docente.observaciones = n.toUpperCase()
        },

        'gx_grado_academico.cmension': function (n) {
            this.gx_grado_academico.cmension = n.toUpperCase()
        },

        'gx_experiencia_doc.cnombreasig': function (n) {
            this.gx_experiencia_doc.cnombreasig = n.toUpperCase()
        },

        'gx_experiencia_doc.cfacultad': function (n) {
            this.gx_experiencia_doc.cfacultad = n.toUpperCase()
        },

        'gx_experiencia_doc.cescuela': function (n) {
            this.gx_experiencia_doc.cescuela = n.toUpperCase()
        },

        'gx_experiencia_laboral.crazonsocial': function (n) {
            this.gx_experiencia_laboral.crazonsocial = n.toUpperCase()
        },

        'gx_experiencia_laboral.ccargo': function (n) {
            this.gx_experiencia_laboral.ccargo = n.toUpperCase()
        },

        idDocente: function (n) {
            if (n != null) {
                this.dina = this.gx_docente.dina == 1
                this.regina = this.gx_docente.regina == 1
                this.investigador = this.gx_docente.ninvestigador == 1
                this.ley_30220 = this.gx_docente.ley_30220 == 1
                this.carpeta = this.gx_docente.carpeta == 1

                this.getDirecciones(n)
                this.getContactos(n)
                this.getGradoAcademico(n)
                this.getExperienciaDoc(n)
                this.getExperienciaLaboral(n)
            } else {
                this.gx_docente = new GxDocente()
                this.direcciones = []
                this.contactos = []
                this.gradosAcemicos = []
                this.experienciaDoc = []
                this.experienciaLaboral = []

                this.dina = false
                this.regina = false
                this.investigador = false
                this.ley_30220 = false
                this.carpeta = false
            }
        },

        'gx_docente.dni': function (n) {
            this.gx_docente.id_docente = n
        },

        'gx_docente.id_pais_nac': function (n) {
            if (this.paisesActivos.filter(p => p.id_pais == n).length > 0) {
                this.gx_docente.luganacimiento = this.paisesActivos.filter(p => p.id_pais == n)[0].cpais
                this.gx_docente.nacionalidad = this.paisesActivos.filter(p => p.id_pais == n)[0].nacionalidad
            } else {
                this.gx_docente.luganacimiento = ''
                this.gx_docente.nacionalidad = ''
            }
        },

        'gx_direcciones.cdepa': function (n) {
            this.distritos = null
            this.gx_direcciones.cdist = ''
            this.gx_direcciones.cprov = ''

            let idDep = ''
            if (this.departamentos.filter(dir => dir.cdepartamento == n).length > 0) {
                idDep = this.departamentos.filter(dir => dir.cdepartamento == n)[0].iddepartamento

                this.axios.get(`${this.URL}js-provincia/${idDep}`, this.autho)
                    .then(res => {
                        this.provincias = res.data.data
                    })
                    .catch(err => {
                        console.dir(err)
                    })
                    .then(res => {

                    })
            }

        },

        'gx_direcciones.cprov': function (n) {
            if (n != null && n != '') {
                let idProv = ''
                if (this.provincias.filter(prov => prov.cprovincia == n).length > 0) {
                    idProv = this.provincias.filter(prov => prov.cprovincia == n)[0].idprovincia

                    this.axios.get(`${this.URL}js-distrito/${idProv}`, this.autho)
                        .then(res => {
                            // 
                            this.distritos = res.data.data
                        })
                        .catch(err => {
                            console.dir(err)
                        })
                        .then(res => {

                        })
                }

            }
        },

        'gx_contacto_docente.id_tipo_contacto': function (n) {
            if (this.tipoContactos.filter(t => t.id_tipo_contacto == n).length > 0) {
                this.gx_contacto_docente.ctipo = this.tipoContactos.filter(t => t.id_tipo_contacto == n)[0].ctipocontacto
            }
        },

        dina: function (n) {
            this.gx_docente.dina = n ? 1 : 0
        },

        regina: function (n) {
            this.gx_docente.regina = n ? 1 : 0
        },

        investigador: function (n) {
            this.gx_docente.ninvestigador = n ? 1 : 0
        },

        ley_30220: function (n) {
            this.gx_docente.ley_30220 = n ? 1 : 0
        },

        carpeta: function (n) {
            this.gx_docente.carpeta = n ? 1 : 0
        },

        tipo_grado: function (n) {
            switch (n) {
                case 1:
                    this.getTitulos()
                    this.gx_docente.grado = 'Bachiller'
                    break
                case 2:
                    this.getMagister()
                    this.gx_docente.grado = 'Maestro'
                    break
                case 3:
                    this.getDoctorado()
                    this.gx_docente.grado = 'Doctor'
                    break
                case 4:
                    this.getPostDoctorado()
                    this.gx_docente.grado = 'PhD'
                    break

            }
        },

        'gx_grado_academico.id_universidad': function (n) {
            if (this.universidades.filter(u => u.idreg == n).length > 0) {
                this.gx_grado_academico.cuniversidad = this.universidades.filter(u => u.idreg == n)[0].cuniversidad
            }
        },

        'gx_grado_academico.id_titulo': function (n) {
            if (this.grados.filter(g => g.id_titulo == n).length > 0) {
                this.gx_grado_academico.ctitulo = this.grados.filter(g => g.id_titulo == n)[0].nombre
            }
        },

        'gx_grado_academico.id_pais': function (n) {
            if (this.paises.filter(p => p.id_pais == n).length > 0) {
                this.gx_grado_academico.cpais = this.paises.filter(p => p.id_pais == n)[0].cpais
            }
        },

        'gx_docente.id_cargo': function (n) {
            if (this.cargosDocente.filter(c => c.id_cargo == n).length > 0) {
                this.gx_docente.cargo = this.cargosDocente.filter(c => c.id_cargo == n)[0].nombre
            }
        },

        'gx_experiencia_doc.id_universidad': function (n) {
            if (this.universidades.filter(c => c.idreg == n).length > 0) {
                this.gx_experiencia_doc.cuniversidad = this.universidades.filter(c => c.idreg == n)[0].cuniversidad
            }
        },

        // 'gx_docente.id_modalidad': function (n) {
        //     if (this.modalidades.filter(c => c.id_modalidad == n).length > 0) {
        //         this.gx_docente.modalidad = this.modalidades.filter(c => c.id_modalidad == n)[0].nombre
        //     }
        // }
    },

    computed: {
        label_dni: function () {
            if (this.gx_docente.dni.length != 8 && this.gx_docente.dni.length > 0) {
                return 'hint--always'
            } else {
                return ''
            }
        },

        label_ruc: function () {
            if (this.gx_experiencia_laboral.cruccentro.length != 11 && this.gx_experiencia_laboral.cruccentro.length > 0) {
                return 'hint--always'
            } else {
                return ''
            }
        },

        direccionValida: function () {
            return (
                this.gx_direcciones.cdireccion != '' &&
                this.gx_direcciones.cdepa != '' &&
                this.gx_direcciones.cdist != '' &&
                this.gx_direcciones.cprov != ''
            )
        },

        contactoValido: function () {
            return (
                this.gx_contacto_docente.id_tipo_contacto != '' &&
                this.gx_contacto_docente.cvalor != ''
            )
        },

        gradoValido: function () {
            return (
                this.gx_grado_academico.id_titulo != '' &&
                this.gx_grado_academico.id_universidad != '' &&
                this.gx_grado_academico.id_pais != ''
                // && this.gx_grado_academico.id_grado != ''
                &&
                // this.gx_grado_academico.finicio != '' &&
                // this.gx_grado_academico.ffin != '' &&
                this.gx_grado_academico.fgrado != ''
            )
        },

        validExperienciaDoc: function () {
            return (
                this.gx_experiencia_doc.cnombreasig != '' &&
                this.gx_experiencia_doc.cuniversidad != '' &&
                this.gx_experiencia_doc.cfacultad != '' &&
                this.gx_experiencia_doc.finicio != '' &&
                this.gx_experiencia_doc.ffin != ''
            )
        },

        validExperienciaLaboral: function () {
            return (
                this.gx_experiencia_laboral.crazonsocial != '' &&
                this.gx_experiencia_laboral.cruccentro.length == 11 &&
                this.gx_experiencia_laboral.ccargo != '' &&
                this.gx_experiencia_laboral.finicio != '' &&
                this.gx_experiencia_laboral.ffin != ''
            )
        },

        validAllData: function () {

            let eDni = this.gx_docente.dni.length != 8 ? 'El DNI debe tener 8 caracteres,' : ''
            let eSexo = this.gx_docente.sexo != '' ? '' : 'Ingresar sexo,'
            let ecpaterno = this.gx_docente.cpaterno != '' ? '' : 'Ingresar apellido paterno,'
            let ecmaterno = this.gx_docente.cmaterno != '' ? '' : 'Ingresar apellido materno,'
            let ecnombres = this.gx_docente.cnombres != '' ? '' : 'Ingresar nombres,'
            let efechanacimiento = this.gx_docente.fechanacimiento != '' ? '' : 'Ingresar fecha de nacimiento,'
            let epais = this.gx_docente.id_pais_nac != '' ? '' : 'Seleccionar país de nacimiento,'

            let direccionesValid = false
            direccionesValid = this.direcciones.length > 0 && this.direcciones.some(d => d.c9 == 1)
            let edirlen = this.direcciones.length > 0 ? '' : 'Ingresar por lo menos una dirección,'
            let edirc9 = this.direcciones.some(d => d.c9 == 1) ? '' : 'Seleccionar una dirección como principal,'

            let gradosAcademicosValid = false
            gradosAcademicosValid = this.gradosAcemicos.length > 0 && this.gradosAcemicos.some(g => g.c9 == 1)
            let egradolen = this.gradosAcemicos.length > 0 ? '' : 'Ingrese al menos un grado académico,'
            let egradoc9 = this.gradosAcemicos.some(g => g.c9 == 1) ? '' : 'Seleccione un grado académico como el mayor grado,'

            let etelefono = this.gx_docente.telefono != '' ? '' : 'Ingrese un teléfono principal,'
            let ecelular = this.gx_docente.celular != '' ? '' : 'Ingrese un celular principal,'
            let eemail = this.gx_docente.email != '' ? '' : 'Ingrese un email principal,'
            let ecargo = this.gx_docente.id_cargo != '' ? '' : 'Ingrese un cargo,'
            // let edidacsup = this.gx_docente.didactica_superior != '' ? '' : 'Ingrese didáctica superior,' //** */
            // let eesp = this.gx_docente.especializacion != '' ? '' : 'Ingrese especialización,' /** */
            // let emodalidad = this.gx_docente.id_modalidad != '' ? '' : 'Ingrese modalidad,'
            let ecategoria = this.gx_docente.categoria != '' ? '' : 'Ingrese categoría,'
            let econdicion = this.gx_docente.condicion != '' ? '' : 'Ingrese condición,'
            // let eregimen = this.gx_docente.dedicacion != '' ? '' : 'Ingrese régimen,'

            this.infoError = `${eDni} ${eSexo} ${ecpaterno} ${ecmaterno} ${ecnombres} ${efechanacimiento} ${epais} ${edirlen} ${edirc9} ${etelefono} ${ecelular} ${eemail} ${ecargo} ${egradolen} ${egradoc9} ${ecategoria} ${econdicion}`

            return (
                this.gx_docente.dni.length == 8 &&
                this.gx_docente.sexo != '' &&
                this.gx_docente.cpaterno != '' &&
                this.gx_docente.cmaterno != '' &&
                this.gx_docente.cnombres != '' &&
                this.gx_docente.fechanacimiento != '' &&
                this.gx_docente.id_pais_nac != '' &&
                direccionesValid &&
                this.gx_docente.telefono != '' &&
                this.gx_docente.celular != '' &&
                this.gx_docente.email != '' &&
                this.gx_docente.id_cargo != '' &&
                // this.gx_docente.didactica_superior != '' &&
                // this.gx_docente.especializacion != ''
                // && this.tipo_grado != ''
                // &&
                gradosAcademicosValid &&
                // this.gx_docente.id_modalidad != '' &&
                this.gx_docente.categoria != '' &&
                this.gx_docente.condicion != ''
                // && this.gx_docente.dedicacion != ''
            )
        },


    },

    methods: {
        getIdentity() {
            if (localStorage.length > 0) {
                this.identity = JSON.parse(localStorage.getItem('identity'))
                this.token = JSON.parse(localStorage.getItem('token'))
                this.entorno = JSON.parse(localStorage.getItem('entorno'))
                this.periodo = JSON.parse(localStorage.getItem('periodo'))

                this.autho = {
                    headers: {
                        Authorization: this.token,
                    }
                }

                this.init()
            }
        },

        init() {
            this.getPaises()
            this.getDepartamentos()
            this.getTipoContacto()
            this.getUniversidades()
            this.getCargosDocentes()
            this.getModalidades()
            this.getCategoriaDocente()
            this.getCondicionDocente()
            this.getDedicacionDocente()
            this.getFacultadUser()

            this.gx_docente.id_usuario_insert = this.identity.id_usuario
            this.gx_docente.id_usuario_update = this.identity.id_usuario
            // this.gx_docente.id_facultad_adscrito = 0
        },

        getFacultadUser: async function() {
            const gxUserEscuela = new GxUserEscuela(this.URL)
            gxUserEscuela.id_usuario = this.identity.id_usuario

            const res = await gxUserEscuela.getFacultadByUser(this.autho)

            if(res.success) {
                this.arrFacultades = res.data
            } else {
                this.arrFacultades = null
            }
            
        },

        getPaises: function () {
            this.axios.get(`${this.URL}js-pais`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.paises = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(res => {
                    this.paisesActivos = this.paises.filter(p => p.cactivo == 1)
                })
        },

        getDepartamentos: function () {
            this.axios.get(`${this.URL}js-departamento`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.departamentos = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(res => {

                })
        },

        getTipoContacto: function () {
            this.axios.get(`${this.URL}js-tipo-contacto`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.tipoContactos = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getTitulos: function () {
            this.axios.get(`${this.URL}js-titulo`, this.autho)
                .then(res => {

                    if (res.data.success) {
                        this.grados = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getMagister: function () {
            this.axios.get(`${this.URL}js-magister`, this.autho)
                .then(res => {

                    if (res.data.success) {
                        this.grados = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getDoctorado: function () {
            this.axios.get(`${this.URL}js-doctorado`, this.autho)
                .then(res => {

                    if (res.data.success) {
                        this.grados = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getPostDoctorado: async function() {
            let gxPostDoctorado = new GxPostDoctorado(this.URL)

            const res = await gxPostDoctorado.getAll(this.autho)

            if(res.success) {
                this.grados = res.data
            }
        },

        getUniversidades: function () {
            this.axios.get(`${this.URL}js-universidad`, this.autho)
                .then(res => {

                    if (res.data.success) {
                        this.universidades = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getCargosDocentes: function () {
            this.axios.get(`${this.URL}js-cargo`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.cargosDocente = res.data.data
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getModalidades: function () {
            this.axios.get(`${this.URL}js-modalidad`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.modalidades = res.data.data
                    } else {
                        this.modalidades = null
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getCategoriaDocente: function () {
            this.axios.get(`${this.URL}js-categoria-docente`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.categoriaDocente = res.data.data
                    } else {
                        this.categoriaDocente = null
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getCondicionDocente: function () {
            this.axios.get(`${this.URL}js-condicion-docente`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.condicionDocente = res.data.data
                    } else {
                        this.condicionDocente = null
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        getDedicacionDocente: function () {
            this.axios.get(`${this.URL}js-dedicacion-docente`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.dedicacionDocente = res.data.data
                    } else {
                        this.dedicacionDocente = null
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        abrirModalPais: function () {
            this.modalPais = true
        },

        cerrarModalPais: function () {
            this.modalPais = false
        },

        abrirModalUni: function () {
            this.modalUni = true
        },

        cerrarModalUni: function () {
            this.modalUni = false
            this.getUniversidades()
        },

        agregarDireccion: function () {
            // this.gx_direcciones.id_docente = this.gx_docente.dni
            this.direcciones.push(this.gx_direcciones)
            this.gx_direcciones = new GxDirecciones()
        },

        quitarDireccion: function (index) {
            this.direcciones = this.direcciones.filter(d => this.direcciones.indexOf(d) != index)
        },

        // Asignar direccion para C9
        asignarC9: function (index) {
            this.direcciones = this.direcciones.map(d => {
                if (this.direcciones.indexOf(d) == index) {
                    d.c9 = 1
                } else {
                    d.c9 = 0
                }

                return d
            })
        },

        agregarContacto: function () {
            // this.gx_contacto_docente.id_docente = this.gx_docente.dni
            this.contactos.push(this.gx_contacto_docente)
            this.gx_contacto_docente = new GxContactoDocente()
        },

        quitarContacto: function (index) {
            this.contactos = this.contactos.filter(g => this.contactos.indexOf(g) != index)
        },

        agregarGrado: function () {
            if(this.tipo_grado == 1) {
                this.gx_grado_academico.ctipo = 'TITULO'
            } else if (this.tipo_grado == 2) {
                this.gx_grado_academico.ctipo = 'MAESTRIA'
            } else if (this.tipo_grado == 3) {
                this.gx_grado_academico.ctipo = 'DOCTORADO'
            } else if(this.tipo_grado = 4) {
                this.gx_grado_academico.ctipo = 'POST DOCTORADO'
            }
            this.gradosAcemicos.push(this.gx_grado_academico)
            this.gx_grado_academico = new GxGradoAcademico()
        },

        quitarGrado: function (index) {
            this.gradosAcemicos = this.gradosAcemicos.filter(g => this.gradosAcemicos.indexOf(g) != index)
        },

        seleccionarMayorGrado: function (index) {
            this.gradosAcemicos = this.gradosAcemicos.map(d => {
                if (this.gradosAcemicos.indexOf(d) == index) {
                    d.c9 = 1
                } else {
                    d.c9 = 0
                }

                return d
            })
        },

        agregarExperienciaDoc: function () {
            this.experienciaDoc.push(this.gx_experiencia_doc)
            this.gx_experiencia_doc = new GxExperienciaDoc()
        },

        quitarExperienciaDoc: function (index) {
            this.experienciaDoc = this.experienciaDoc.filter(g => this.experienciaDoc.indexOf(g) != index)
        },

        agregarExperienciaLaboral: function () {
            this.experienciaLaboral.push(this.gx_experiencia_laboral)
            this.gx_experiencia_laboral = new GxExperienciaLaboral()
        },

        quitarExperienciaLaboral: function (index) {
            this.experienciaLaboral = this.experienciaLaboral.filter(g => this.experienciaLaboral.indexOf(g) != index)
        },

        abrirModalListaDocentes: function () {
            this.modalListaDocentes = true
        },

        cerrarModalListaDocentes: function () {
            this.modalListaDocentes = false
        },

        editarDocente: function (docente) {
            this.isEditDocente = true
            this.gx_docente = docente
            this.idDocente = this.gx_docente.id_docente
            this.cerrarModalListaDocentes()
        },

        /* ***************************************************************************** */
        getDatosDocente: async function (id_docente) {
            this.loadAjax = true
            await this.axios.get(`${this.URL}js-docente/${id_docente}`, this.autho)
                .then(res => {
                    if (res.data.success) {
                        this.gx_docente = res.data.data
                        this.dina = this.gx_docente.dina == 1
                        this.regina = this.gx_docente.regina == 1
                        this.investigador = this.gx_docente.ninvestigador == 1
                        this.ley_30220 = this.gx_docente.ley_30220 == 1
                        this.carpeta = this.gx_docente.carpeta == 1
                        this.idFacultadAdscrito = this.gx_docente.id_facultad_adscrito
                    } else {
                        this.gx_docente = new GxDocente()
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(() => {})
            this.loadAjax = false
        },

        getDirecciones: function (id_docente) {
            this.axios.get(`${this.URL}js-direcciones/${id_docente}`, this.autho)
                .then(res => {
                    //    
                    if (res.data.success) {
                        this.direcciones = res.data.data
                    } else {
                        this.direcciones = []
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(() => {})
        },

        getContactos: function (id_docente) {
            this.axios.get(`${this.URL}js-contacto-docente/${id_docente}`, this.autho)
                .then(res => {
                    //    
                    if (res.data.success) {
                        this.contactos = res.data.data
                    } else {
                        this.contactos = []
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(() => {})
        },

        getGradoAcademico: function (id_docente) {
            this.axios.get(`${this.URL}js-grado-academico/${id_docente}`, this.autho)
                .then(res => {
                    //    
                    if (res.data.success) {
                        this.gradosAcemicos = res.data.data
                    } else {
                        this.gradosAcemicos = []
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(() => {})
        },

        getExperienciaDoc: function (id_docente) {
            this.axios.get(`${this.URL}js-experiencia-doc/${id_docente}`, this.autho)
                .then(res => {
                    //    
                    if (res.data.success) {
                        this.experienciaDoc = res.data.data
                    } else {
                        this.experienciaDoc = []
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(() => {})
        },

        getExperienciaLaboral: function (id_docente) {
            this.axios.get(`${this.URL}js-experiencia-laboral/${id_docente}`, this.autho)
                .then(res => {
                    //    
                    if (res.data.success) {
                        this.experienciaLaboral = res.data.data
                    } else {
                        this.experienciaLaboral = []
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
                .then(() => {})
        },

        /* *********************************************************************************** */

        reiniciarNuevoDocente: function () {
            this.isEditDocente = false

            this.idDocente = null
            this.gx_docente = new GxDocente()
            this.direcciones = []
            this.contactos = []
            this.gradosAcemicos = []
            this.experienciaDoc = []
            this.experienciaLaboral = []

            this.dina = false
            this.regina = false
            this.investigador = false
            this.ley_30220 = false
            this.carpeta = false

            this.loadAjax = false
            $('#imgSalida').attr('src', '')
            document.querySelector('#imgEntrada').value = ''

        },

        setDatosDocente: function () {
            const direccion = this.direcciones.filter(dir => dir.c9 == 1)[0]
            this.gx_docente.direccion = direccion.cdireccion
            this.gx_docente.residencia = direccion.cdepa + '-' + direccion.cprov + '-' + direccion.cdist

            const mayorGrado = this.gradosAcemicos.filter(grado => grado.c9 == 1)[0]
            this.gx_docente.mayor_grado_academico = mayorGrado.ctitulo
            this.gx_docente.titulo = mayorGrado.ctitulo
            this.gx_docente.mencion_mayor_grado_academico = mayorGrado.cmension
            this.gx_docente.pais_mayor_grado_academico = mayorGrado.cpais
            this.gx_docente.universidad_mayor_grado_academico = mayorGrado.cuniversidad

            if(this.gradosAcemicos.some(grado => grado.ctipo == 'MAESTRIA')) {
                this.gx_docente.cmaestria = 'SI'
            } else {
                this.gx_docente.cmaestria = 'NO'
            }

            if(this.gradosAcemicos.some(grado => grado.ctipo == 'DOCTORADO')) {
                this.gx_docente.cdoctorado = 'SI'
            } else {
                this.gx_docente.cdoctorado = 'NO'
            }

            this.gx_docente.nombre = `${this.gx_docente.cpaterno} ${this.gx_docente.cmaterno} ${this.gx_docente.cnombres}`
        },

        procesarDatosParaAlmacenamiento: async function () {
            this.loadAjax = true
            this.gx_docente.id_usuario_insert = this.identity.id_usuario

            await this.setDatosDocente()

            let gx_c9 = new GxC9()

            gx_c9.cdni = this.gx_docente.id_docente
            gx_c9.nombrec = this.gx_docente.nombre
            gx_c9.paterno = this.gx_docente.cpaterno
            gx_c9.materno = this.gx_docente.cmaterno
            gx_c9.nombres = this.gx_docente.cnombres
            gx_c9.nacionalidad = this.gx_docente.nacionalidad
            gx_c9.fingresou = this.gx_docente.f_ingreso
            gx_c9.ley30220 = this.gx_docente.ley_30220
            gx_c9.investigador = this.gx_docente.ninvestigador
            gx_c9.dina = this.gx_docente.dina
            gx_c9.mayorgrado = this.gx_docente.grado
            gx_c9.mayorgradodocente = this.gx_docente.mayor_grado_academico
            gx_c9.umayorgrado = this.gx_docente.universidad_mayor_grado_academico
            gx_c9.pmayorgrado = this.gx_docente.pais_mayor_grado_academico
            gx_c9.categoria = this.gx_docente.categoria
            // gx_c9.regimen = this.gx_docente.dedicacion
            gx_c9.observaciones = this.gx_docente.observaciones
            gx_c9.id_cargo = this.gx_docente.id_cargo
            gx_c9.cargo = this.gx_docente.cargo

            await this.guardarDocente()

            await this.almacenarDatosGenerales()

            await this.guardarC9(gx_c9)

            alertify.alert('<i class="fas fa-thumbs-up"></i> SIGEDO', 'DOCENTE CREADO CON EXITO')

            // this.reiniciarNuevoDocente()
            this.verficarDNI()
            this.loadAjax = false
            alertify.alert('SIGEDO', 'Para terminar suba una foto del docente por favor')
        },

        guardarDocente: async function () {
            await this.axios.post(`${this.URL}js-docentes`, this.gx_docente, this.autho)
                .then(res => {
                    //    
                    if(res.data.success) {
                        this.saveHistorial()
                    } else {
                        alertify.alert('SIGEDO', 'Error al almacenar info docente')
                    }
                })
                .catch(err => {
                    console.dir(err)
                    alertify.alert('SIGEDO', 'Error al almacenar info docente')
                })
        },

        /**
         * Almacena el historial del 
         * las fatcutlades adscritas de un docente
         */
        saveHistorial: async function() {
            const gxDocenteFacultadH = new GxDocenteFacultadH(this.URL)

            gxDocenteFacultadH.id_docente = this.gx_docente.id_docente
            gxDocenteFacultadH.id_facultad = this.gx_docente.id_facultad_adscrito
            gxDocenteFacultadH.id_usuario = this.identity.id_usuario

            const res = await gxDocenteFacultadH.insert(this.autho)
        },

        guardarDirecciones: async function (dir) {
            await this.axios.post(`${this.URL}js-direcciones`, dir, this.autho)
                .then(res => {
                    //    
                    if(res.data.success) {

                    } else {
                        alertify.alert('SIGEDO', 'Error al almacenar direcciones')
                    }
                })
                .catch(err => {
                    console.dir(err)
                    alertify.alert('SIGEDO', 'Error al almacenar direcciones')
                })
        },

        guardarContactos: async function (cont) {
            await this.axios.post(`${this.URL}js-contacto-docente-save`, cont, this.autho)
                .then(res => {
                    //    
                    if(res.data.success) {

                    } else {
                        alertify.alert('SIGEDO', 'Error al almacenar contacto docente')
                    }
                })
                .catch(err => {
                    console.dir(err)
                    alertify.alert('SIGEDO', 'Error al almacenar contacto docente')
                })
        },

        guardarGradoAcademico: async function (grado) {
            await this.axios.post(`${this.URL}js-grado-academico`, grado, this.autho)
                .then(res => {
                    //    
                    if(res.data.success) {

                    } else {
                        alertify.alert('SIGEDO', 'Error al almacenar grado academico')
                    }
                })
                .catch(err => {
                    console.dir(err)
                    alertify.alert('SIGEDO', 'Error al almacenar grado academico' + err)
                })
        },

        guardarExperienciaDoc: async function (exp) {
            await this.axios.post(`${this.URL}js-experiencia-doc`, exp, this.autho)
                .then(res => {
                    //    
                    if(res.data.success) {

                    } else {
                        alertify.alert('SIGEDO', 'Error al almacenar exp docente')
                    }
                })
                .catch(err => {
                    console.dir(err)
                    alertify.alert('SIGEDO', 'Error al almacenar exp docente')
                })
        },

        guardarExperienciaLaboral: async function (exp) {
            await this.axios.post(`${this.URL}js-experiencia-laboral`, exp, this.autho)
                .then(res => {
                    //    
                    if(res.data.success) {

                    } else {
                        alertify.alert('SIGEDO', 'Error al almacenar exp laboral')
                    }
                })
                .catch(err => {
                    console.dir(err)
                    alertify.alert('SIGEDO', 'Error al almacenar exp laboral' + err)
                })
        },

        // direccion, grados, contactos, experiencias
        almacenarDatosGenerales: async function () {
            this.direcciones = this.direcciones.map(dir => {
                dir.id_docente = this.gx_docente.id_docente
                return dir
            })

            await this.direcciones.forEach(dir => {
                dir.ccodusua = this.identity.id_usuario
                this.guardarDirecciones(dir)
            })

            this.contactos = this.contactos.map(dir => {
                dir.id_docente = this.gx_docente.id_docente
                return dir
            })

            await this.contactos.forEach(cont => {
                cont.ccodusua = this.identity.id_usuario
                this.guardarContactos(cont)
            })

            this.gradosAcemicos = this.gradosAcemicos.map(dir => {
                dir.id_docente = this.gx_docente.id_docente
                return dir
            })

            await this.gradosAcemicos.forEach(grado => {
                grado.ccodusua = this.identity.id_usuario
                this.guardarGradoAcademico(grado)
            })

            this.experienciaDoc = this.experienciaDoc.map(dir => {
                dir.id_docente = this.gx_docente.id_docente
                return dir
            })

            await this.experienciaDoc.forEach(exp => {
                exp.ccodusua = this.identity.id_usuario
                this.guardarExperienciaDoc(exp)
            })

            this.experienciaLaboral = this.experienciaLaboral.map(dir => {
                dir.id_docente = this.gx_docente.id_docente
                return dir
            })

            await this.experienciaLaboral.forEach(exp => {
                exp.ccodusua = this.identity.id_usuario
                this.guardarExperienciaLaboral(exp)
            })
        },

        guardarC9: async function (c9) {
            await this.axios.post(`${this.URL}js-c9`, c9, this.autho)
                .then(res => {
                    //    
                    if(res.data.success) {

                    } else {
                        alertify.alert('SIGEDO', 'Error al almacenar c9')
                    }
                })
                .catch(err => {
                    console.dir(err)
                    alertify.alert('SIGEDO', 'Error al almacenar c9')
                })
        },

        /* ******* */
        verficarDNI: async function () {
            if (this.gx_docente.dni.length == 8 && this.gx_docente.dni != '88888888') {
                await this.axios.get(`${this.URL}js-docente-verificar/${this.gx_docente.id_docente}`, this.autho)
                    .then(res => {
                        let reg = res.data.data.reg

                        if (reg > 0) {
                            this.idDocente = this.gx_docente.id_docente
                            this.getDatosDocente(this.idDocente)
                            this.isEditDocente = true
                        }
                    })
                    .catch(err => {
                        console.dir(err)
                    })
            }

            if(this.gx_docente.dni == '88888888') {
                alertify.alert('SIGEDO', 'El dni 88888888 esta reservado para la PLAZA DESIERTA y no puede ser usado')
                this.gx_docente.dni = ''
            }
        },

        actualizarInformacion: async function () {
            this.loadAjax = true

            await this.eliminarDirecciones(this.gx_docente.id_docente)
            await this.eliminarContactos(this.gx_docente.id_docente)
            await this.eliminarGrados(this.gx_docente.id_docente)
            await this.eliminarExperienciaDoc(this.gx_docente.id_docente)
            await this.eliminarExperienciaLaboral(this.gx_docente.id_docente)

            await this.almacenarDatosGenerales()

            await this.actualiarDocente()

            let gx_c9 = new GxC9()

            gx_c9.cdni = this.gx_docente.id_docente
            gx_c9.nombrec = this.gx_docente.nombre
            gx_c9.paterno = this.gx_docente.cpaterno
            gx_c9.materno = this.gx_docente.cmaterno
            gx_c9.nombres = this.gx_docente.cnombres
            gx_c9.nacionalidad = this.gx_docente.nacionalidad
            gx_c9.fingresou = this.gx_docente.f_ingreso
            gx_c9.ley30220 = this.gx_docente.ley_30220
            gx_c9.investigador = this.gx_docente.ninvestigador
            gx_c9.dina = this.gx_docente.dina
            gx_c9.mayorgrado = this.gx_docente.grado
            gx_c9.mayorgradodocente = this.gx_docente.mayor_grado_academico
            gx_c9.umayorgrado = this.gx_docente.universidad_mayor_grado_academico
            gx_c9.pmayorgrado = this.gx_docente.pais_mayor_grado_academico
            gx_c9.categoria = this.gx_docente.categoria
            // gx_c9.regimen = this.gx_docente.dedicacion
            gx_c9.observaciones = this.gx_docente.observaciones
            gx_c9.id_cargo = this.gx_docente.id_cargo
            gx_c9.cargo = this.gx_docente.cargo

            await this.actualizarC9(gx_c9)

            alertify.alert('<i class="fas fa-thumbs-up"></i> SIGEDO', 'DOCENTE ACTUALIZADO CON EXITO')

            this.reiniciarNuevoDocente()
        },
        /* *** */
        actualiarDocente: async function () {
            this.gx_docente.id_usuario_update = this.identity.id_usuario

            await this.setDatosDocente()

            await this.axios.post(`${this.URL}js-docentes-upd/${this.gx_docente.id_docente}`, this.gx_docente, this.autho)
                .then(res => {
                    this.idFacultadAdscrito != this.gx_docente.id_facultad_adscrito ? this.saveHistorial() : ''
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        actualizarC9: async function (c9) {
            await this.axios.post(`${this.URL}js-c9-upd/${c9.cdni}`, c9, this.autho)
                .then(res => {
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        eliminarDirecciones: async function (id_docente) {
            await this.axios.delete(`${this.URL}js-direcciones-del/${id_docente}`, this.autho)
                .then(res => {
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        eliminarContactos: async function (id_docente) {
            await this.axios.delete(`${this.URL}js-contacto-docente-del/${id_docente}`, this.autho)
                .then(res => {
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        eliminarGrados: async function (id_docente) {
            await this.axios.delete(`${this.URL}js-grado-academico-del/${id_docente}`, this.autho)
                .then(res => {
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        eliminarExperienciaDoc: async function (id_docente) {
            await this.axios.delete(`${this.URL}js-experiencia-doc-del/${id_docente}`, this.autho)
                .then(res => {
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        eliminarExperienciaLaboral: async function (id_docente) {
            await this.axios.delete(`${this.URL}js-experiencia-laboral-del/${id_docente}`, this.autho)
                .then(res => {
                })
                .catch(err => {
                    console.dir(err)
                })
        },

        saveFoto: function (event) {
            const file = event.target.files[0]

            if(file == undefined) {
                return
            }

            const imageType = /(.jpg|.jpeg|.png)$/i

            const fileSize = file.size

            if (!file.type.match(imageType)) {
                $('#imgSalida').attr('src', '')
                document.querySelector('#imgEntrada').value = ''
                alertify.alert('SIGEDO', 'Archivos válidos: .jpg; .jpeg; .png')
                return
            }

            if (fileSize > 50000) {
                $('#imgSalida').attr('src', '')
                document.querySelector('#imgEntrada').value = ''
                alertify.alert('SIGEDO', 'Archivo demasiado grande: máx 1MB')
                return
            }

            if(this.isEditDocente) {
                // 
                var data = new  FormData();
                data.append('img', file);
                // 
                this.loadAjax = true
                this.axios.post(`${this.URL}/imagenes/${this.gx_docente.id_docente}`, data, this.autho)
                .then(res => {
                    if(res.data.success) {
                        $('#imgSalida').attr('src', '')
                        document.querySelector('#imgEntrada').value = ''
                        this.verficarDNI()
                        this.loadAjax = false
                    }
                })
                .catch(err => {
                    console.dir(err)
                })
            }

            var reader = new FileReader();

            reader.onload = ev => {
                const result = ev.target.result
                $('#imgSalida').attr("src", result);
            }

            reader.readAsDataURL(file);
        },

        saveEsperienciaImg: function (event, { id_exp_doc }) {
          const file = event.target.files[0]
          if (file == undefined) {
            return
          }

          const imageType = /(.jpg|.jpeg|.png)$/i

          const fileSize = file.size

          if (!file.type.match(imageType)) {
            // $('#img-salida-exp').attr('src', '')
            // document.getElementById('img-entrada-exp').value = ''
            alertify.alert('SIGEDO', 'Archivos válidos: .jpg; .jpeg; .png')
            return
          }

          if (fileSize > 50000) {
            // $('#img-salida-exp').attr('src', '')
            // document.getElementById('img-entrada-exp').value = ''
            alertify.alert('SIGEDO', 'Archivo demasiado grande: máx 1MB')
            return
          }

          if (this.isEditDocente) {
            // 
            var data = new FormData();
            data.append('img', file);
            // 
            this.loadAjax = true
            this.axios.post(`${this.URL}/imagenes-exp/${id_exp_doc}`, data, this.autho)
              .then(res => {
                if (res.data.success) {
                  // $('#img-salida-exp').attr('src', '')
                  // document.getElementById('img-entrada-exp').value = ''
                  this.verficarDNI()
                  this.loadAjax = false
                }
              })
              .catch(err => {
                console.dir(err)
              })
          }

          var reader = new FileReader();

          reader.onload = ev => {
            const result = ev.target.result
            $('#imgSalida').attr("src", result);
          }

          reader.readAsDataURL(file);
        },

        closeCrudGrados: function () {
            this.tipo_grado = 0
            this.crud_grados = false
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
    textarea {
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

    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
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

    .imgSalida {
        max-width: 170px;
        border-radius: 50%;
    }
</style>
