import 'web-animations-js/web-animations.min.js'

declare global {
  interface Window {
    MSStream: any
    webp: boolean
    iOS: boolean | number
    safari: boolean
    android: boolean
  }
}

function checkWebpFeature(feature: string, callback: Function) {
  const kTestImages: any = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
  }
  const img = new Image()
  img.onload = function () {
    const result = (img.width > 0) && (img.height > 0)
    callback(feature, result)
  }
  img.onerror = function () {
    callback(feature, false)
  }
  img.src = 'data:image/webp;base64,' + kTestImages[feature]
}

checkWebpFeature('lossy', function (_feature: string, isSupported: boolean) {
  if (window) {
    window.webp = isSupported
  }

  if (isSupported) {
    document.body.classList.add('webp')
  } else {
    document.body.classList.add('no-webp')
  }
})

let iOS: boolean | number = /iPad|iPhone|iPod/.test(navigator.platform) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

if (iOS) {
  const match = navigator.userAgent.match(/Version\/([0-9.]+)/)
  iOS = (match && match.length > 1) ? parseFloat(match[1]) : true
  document.body.classList.add('ios')
}

const android: boolean = /android/i.test(navigator.userAgent) && !window.MSStream
if (android) {
  document.body.classList.add('android')
}

const safari: boolean = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !window.MSStream
if (safari) {
  document.body.classList.add('safari')
}

if (window) {
  window.iOS = iOS
  window.safari = safari
  window.android = android
}
