export default class NivelLogroRasgo {
  constructor (
    id,
    idCurriculoRasgo,
    idObjetivoEspecifico,
    puntaje,
    asignaturaId
  ) {
    this.id = id
    this.id_curriculo_rasgo = idCurriculoRasgo
    this.id_objetivo_especifico = idObjetivoEspecifico
    this.puntaje = puntaje
    this.asignatura_id = asignaturaId
  }

  static fromJson (json) {
    return new NivelLogroRasgo(
      json.id,
      json.id_curriculo_rasgo,
      json.id_objetivo_especifico,
      json.puntaje,
      json.asignatura_id
    )
  }

  static fromArray (arr) {
    return arr.map(a => {
      return NivelLogroRasgo.fromJson(a)
    })
  }
}