const filialUserdWoSelect = state => {
  if(!state.arrFilialUser) return null
  return state.arrFilialUser.filter(fil => fil.id_filial != 0)
}

export default {
  filialUserdWoSelect
}