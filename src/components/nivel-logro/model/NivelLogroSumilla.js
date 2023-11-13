export default class NivelLogroSumilla {
  constructor (
    id,
    idAsignaturaContenido,
    idObjetivoEspecifico,
    puntaje,
    asignaturaId
  ) {
    this.id = id
    this.id_asignatura_contenido = idAsignaturaContenido
    this.id_objetivo_especifico = idObjetivoEspecifico
    this.puntaje = puntaje
    this.asignatura_id = asignaturaId
  }

  static fromJson (json) {
    return new NivelLogroSumilla(
      json.id,
      json.id_asignatura_contenido,
      json.id_objetivo_especifico,
      json.puntaje,
      json.asignatura_id
    )
  }

  static fromArray (arr) {
    return arr.map(a => {
      return NivelLogroSumilla.fromJson(a)
    })
  }
}