import { Notification, MessageBox } from 'element-ui'

const errors = (err) => {
  console.dir(err)
  if (!err.response) return
  let {
    response
  } = err
  let {
    status,
    data
  } = response
  switch (status) {
    case 402:
      for (const [key, value] of Object.entries(data.errors)) {
        key
        Notification.error({
          title: 'Error',
          message: value[0]
        })
      }
      break;
    case 400:
      MessageBox.alert(data.message, '¡Peligro!', {
        confirmButtonText: 'OK',
        type: 'error'
      })
      break;

    default:
      MessageBox.alert('Error desconocido, ¡Auxilio!', '¡Peligro!', {
        confirmButtonText: 'OK',
        type: 'error'
      })
      break;
  }
}

const downloadFile = (url, name) => {
  const link = document.createElement('a')
  link.href = url
  link.download = url
  link.target = name
  link.click()
}


export default {
  errors,
  downloadFile
}
