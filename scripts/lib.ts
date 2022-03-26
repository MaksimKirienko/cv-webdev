function validateEmail(email: string) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}

const shuffleArray = function(array: []) {
  let currentIndex = array.length
  let randomIndex = 0

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

function weightedRandom(options: any[]) {
  let i = 0
  const weights: number[] = []

  for (i = 0; i < options.length; i++) {
    weights[i] = options[i].weight + (weights[i - 1] || 0)
  }

  const random = Math.random() * weights[weights.length - 1]

  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) {
      return options[i]
    }
  }

  return options[0]
}

function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

function mergeDeep(target: any, ...sources: any): any {
  if (!sources.length) {
    return target
  }
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        // if (!target[key]) Object.assign(target, { [key]: {} });
        if (!target[key]) {
          Object.assign(target, { [key]: {} })
        } else {
          target[key] = Object.assign({}, target[key])
        }
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea: HTMLTextAreaElement = document.createElement('textarea')
  textArea.value = text
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.opacity = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    console.log(`Fallback: Copying text command was ${ successful ? 'successful' : 'unsuccessful' }`)
  } catch (e) {
    console.error('Fallback: Oops, unable to copy', e)
  }

  document.body.removeChild(textArea)
}

function copyTextToClipboard(text: string) {
  if (!navigator?.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }

  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!')
  }, function(err) {
    console.error('Async: Could not copy text: ', err)
  })
}

function downloadBlob(blob: Blob, fileName: string) {
  const blobUrl = URL.createObjectURL(blob)
  const linkNode = document.createElement('a')

  linkNode.href = blobUrl
  linkNode.download = fileName

  document.body.appendChild(linkNode)
  linkNode.click()

  setTimeout(() => { // clear data
    document.body.removeChild(linkNode)
    window.URL.revokeObjectURL(blobUrl)
  }, 1)
}

function downloadCanvas(canvas: HTMLCanvasElement, fileName: string) {
  canvas.toBlob(blob => {
    if (blob) {
      downloadBlob(blob, fileName)
    }
  })
}

function dateParseUTC(dateString: string) {
  if (!dateString) {
    return null
  }

  if (/\d{8}/.test(dateString)) {
    const dm = dateString.match(/(\d{4})(\d{2})(\d{2})/)
    if (dm?.length && dm.length > 3) {
      dateString = `${dm[2]}/${dm[3]}/${dm[1]}`
    }
  }

  if (dateString.substr(2, 1) === '.') {
    const dm = dateString.match(/(\d{2}).(\d{2}).(\d{4})(.*)/)
    if (dm?.length && dm.length > 4) {
      dateString = `${dm[2]}/${dm[1]}/${dm[3]}${dm[4]}`
    }
  }

  const date = new Date(dateString)

  if (!date.toUTCString().includes('00:00:00')) {
    const offset = (new Date()).getTimezoneOffset() * 60000
    // console.log('date copensated:', date.toUTCString(), offset, new Date(date.getTime() - offset).toUTCString())
    return new Date(date.getTime() - offset)
  } else {
    // console.log('date normal:', date.toUTCString())
    return date
  }
}

function dateHuman(date: Date, year: boolean = true) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

  return date.getUTCDate() + ' ' + months[date.getUTCMonth()] + (year ? ' ' + date.getUTCFullYear() : '')
}

function dateDbFormat(date: Date) {
  let day = date.getUTCDate() + ''
  let month = (date.getUTCMonth() + 1) + ''

  day = day.length === 1 ? '0' + day : day
  month = month.length === 1 ? '0' + month : month

  return `${date.getUTCFullYear()}${month}${day}`
}

function dateRussianFormat(date: Date) {
  let day = date.getUTCDate() + ''
  let month = (date.getUTCMonth() + 1) + ''

  day = day.length === 1 ? '0' + day : day
  month = month.length === 1 ? '0' + month : month

  return `${day}.${month}.${date.getUTCFullYear()}`
}

function dateUSFormat(date: Date) {
  let day = date.getUTCDate() + ''
  let month = (date.getUTCMonth() + 1) + ''

  day = day.length === 1 ? '0' + day : day
  month = month.length === 1 ? '0' + month : month

  return `${month}/${day}/${date.getUTCFullYear()}`
}

function getParameters() {
  if (typeof window === 'undefined' || !window) {
    return {}
  }
  const urlSearchParams = new URLSearchParams(window?.location.search)
  const result: any = {}

  urlSearchParams.forEach((value, key) => {
    result[key] = value
  })

  return result // Object.fromEntries(urlSearchParams.entries?.())
}

function getTranslateX(element: HTMLElement) {
  const matrix = new WebKitCSSMatrix(window.getComputedStyle(element).transform)
  return matrix.m41
}

function clearTags(str: string) {
  return str.replace(/(<([^>]+)>)/gi, '')
}

export {
  validateEmail,
  shuffleArray,
  weightedRandom,
  isObject,
  mergeDeep,
  copyTextToClipboard,
  downloadBlob,
  downloadCanvas,
  dateParseUTC,
  dateHuman,
  dateDbFormat,
  dateUSFormat,
  dateRussianFormat,
  getParameters,
  getTranslateX,
  clearTags
}
