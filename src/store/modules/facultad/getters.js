const facultaUserdWoSelect = state => {
  if(!state.arrFacultadUser) return null
  return state.arrFacultadUser.filter(fac => fac.id_facultad != 0)
}

export default {
  facultaUserdWoSelect
}