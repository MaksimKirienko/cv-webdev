function validateEmail(email) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}

function shuffleArray(array) {
  var currentIndex = array.length, randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

function weightedRandom(options) {
  let i = 0
  const weights = []

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

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target
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

  return mergeDeep(target, ...sources);
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.top = 0
  textArea.style.left = 0
  textArea.style.opacity = 0
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    console.log(`Fallback: Copying text command was ${ successful ? 'successful' : 'unsuccessful' }`)
  } catch (e) {
    console.error('Fallback: Oops, unable to copy', e)
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator?.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }

  try {
    navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Async: Copying to clipboard was successful!')
    })
    .catch((e) => {
      console.log('Async: Could not copy text: ', e)
    })
  } catch (e) {
    console.log('Async: Could not copy text: ', e)
  }
}

function sendAppMessage(eventName) {
  console.log('App event:', eventName)

  if (window?.android) {
    try {
      window?.close?.postMessage?.(eventName)
    } catch(e) {
      // do nothing
      console.log('Error sending event:', e)
    }
  }

  if (window?.iOS) {
    try {
      window?.webkit?.messageHandlers?.close?.postMessage?.(eventName)
    } catch(e) {
      // do nothing
      console.log('Error sending event:', e)
    }
  }
}

function calcTimeDifferenceTillNow(timeTo) {
  // console.log('##diff', timeTo)

  if (!timeTo.trim()) {
    return 0
  }

  if (timeTo.indexOf('GMT') == -1) {
    timeTo += ' GMT+03:00'
  }

  const timeToUTC = new Date(new Date(timeTo.replace(/-/g, '/').replace(/(\d)T(\d)/, '$1 $2')).toISOString())
  const timeNowUTC = new Date()

  const diff = (timeToUTC.getTime() - timeNowUTC.getTime()) / 1000

  // console.log(timeTo, timeToUTC, timeNowUTC, diff)

  return diff > 0 ? diff : 0
}

export {
  shuffleArray,
  weightedRandom,
  isObject,
  mergeDeep,
  validateEmail,
  copyTextToClipboard,
  sendAppMessage,
  calcTimeDifferenceTillNow
}
