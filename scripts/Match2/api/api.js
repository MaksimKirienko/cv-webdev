let apiAddress = 'https://brawlstars2.loy.am/api'

// dev back
if ((typeof window !== 'undefined') &&
  ((window?.location.host == 'xxx.tech') || (window?.location.hostname == 'localhost'))) {
  apiAddress = 'https://xxx/api'
}

const apiAuth = 'xxx:xxx'
const testToken = 'xxx'

function responseToLog(response) {
  let s = ''

  for (const pair of response.headers.entries()) {
    s += pair[0] + ': ' + pair[1] + '\n'
  }

  return `
    Response.ok: (${ response.ok })
    Response.headers: ${ s }
    Response.status: ${ response.status }
  `
}

async function apiGetLeaderboard(token) {
  return {
    "current": 101,
    "leaderboard": [
      {
        "id": 63,
        "username": "Конфетка",
        "nickname": "Конфетка 🍭",
        "avatar": "1#1",
        "currenciesPoint": 22189,
        "score": 22189,
        "place": 1
      },
      {
        "id": 116,
        "username": "Зайчик",
        "nickname": "Зайчик",
        "avatar": "2#2",
        "currenciesPoint": 19144,
        "score": 19144,
        "place": 2
      },
      {
        "id": 48,
        "username": "Облако",
        "nickname": "Облако",
        "avatar": "3#3",
        "currenciesPoint": 13852,
        "score": 13852,
        "place": 3
      },
      {
        "id": 5,
        "username": "Пончик",
        "nickname": "Пончик 🍩",
        "avatar": "4#4",
        "currenciesPoint": 5803,
        "score": 5803,
        "place": 4
      },
      {
        "id": 19,
        "username": "Тортик",
        "nickname": "Тортик 🍰",
        "avatar": "5#5",
        "currenciesPoint": 4039,
        "score": 4039,
        "place": 5
      },
      {
        "id": 7,
        "username": "Ракета",
        "nickname": "Ракета",
        "avatar": "0#6",
        "currenciesPoint": 4000,
        "score": 4000,
        "place": 6
      },
      {
        "id": 11,
        "username": "Шоколадка",
        "nickname": "Шоколадка",
        "avatar": "1#7",
        "currenciesPoint": 4000,
        "score": 4000,
        "place": 7
      },
      {
        "id": 14,
        "username": "Победа",
        "nickname": "Победа",
        "avatar": "2#8",
        "currenciesPoint": 4000,
        "score": 4000,
        "place": 8
      },
      {
        "id": 18,
        "username": "Незнайка",
        "nickname": "Незнайка",
        "avatar": "",
        "currenciesPoint": 4000,
        "score": 4000,
        "place": 9
      },
      {
        "id": 6,
        "username": "Пчелка",
        "nickname": "Пчелка",
        "avatar": "",
        "currenciesPoint": 3000,
        "score": 3000,
        "place": 10
      }
    ]
  }
  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + '/leaderboard', {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /laederboard (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data && (data.length || data.leaderboard)) {
  //     throw new Error(`
  //       Error fetch /leaderboard
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiGetFaq(token) {
  return [
    {
      "id": 1,
      "question": "Как играть?",
      "answer": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio."
    },
    {
      "id": 3,
      "question": "Как получать звезды и очки?",
      "answer": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio."
    },
    {
      "id": 4,
      "question": "Сколько раз можно сыграть?",
      "answer": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio."
    },
    {
      "id": 5,
      "question": "Как получить дополнительные попытки?",
      "answer": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio."
    }
  ]
  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + '/faq', {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /faq (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || !data.length) {
  //     throw new Error(`
  //       Error fetch /faq
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiGetMissions(token) {
  return [
    {
      "id": 1,
      "code": "approveemailcheck",
      "name": "Получай чеки по e-mail",
      "message": "Подтверди получение чеков по электронной почте и получи 1 дополнительную попытку в игре",
      "reward": 1,
      "buttonEventCategory": "Check",
      "again": 0,
      "btn_name": "Получать чеки по e-mail",
      "btn_link": "#",
      "done": 0,
      "event": "Check",
      "done_message": "Подтверди получение чеков по e-mail"
    },
    {
      "id": 2,
      "code": "allowpromosms",
      "name": "Акции по SMS",
      "message": "Разреши рассказывать тебе об акциях по SMS и получи 1 дополнительную попытку в игре",
      "reward": 1,
      "buttonEventCategory": "Notifications",
      "again": 0,
      "btn_name": "Получать смс",
      "btn_link": "#",
      "done": 0,
      "event": "Notifications",
      "done_message": "Разреши сообщения об акциях по СМС"
    },
    {
      "id": 3,
      "code": "allowpromoemail",
      "name": "Акции по почте",
      "message": "Разреши рассказывать тебе об акциях по электронной почте и получи 1 дополнительную попытку в игре",
      "reward": 1,
      "buttonEventCategory": "Notifications",
      "again": 0,
      "btn_name": "Узнать об акциях",
      "btn_link": "#",
      "done": 0,
      "event": "Notifications",
      "done_message": "Разреши сообщения об акциях по e-mail"
    },
    {
      "id": 4,
      "code": "allowphonenotifications",
      "name": "Уведомления по телефону",
      "message": "Разреши рассказывать тебе об акциях через телефонные звонки и получи 1 дополнительную попытку в игре",
      "reward": 1,
      "buttonEventCategory": "Notifications",
      "again": 0,
      "btn_name": "Разрешить",
      "btn_link": "#",
      "done": 0,
      "event": "Notifications",
      "done_message": "Разреши получение уведомлений в телефонных звонках"
    },
    {
      "id": 10,
      "code": "enablepushnotifications",
      "name": "Включи push-уведомления",
      "message": "Включай push-уведомления в мобильном приложении. Будь в курсе актуальных скидок и получи 1 дополнительную попытку в игре",
      "reward": 1,
      "buttonEventCategory": "Notifications",
      "again": 0,
      "btn_name": "Включить push",
      "btn_link": "#",
      "done": 0,
      "event": "Notifications",
      "done_message": "Включи push-уведомления в приложении"
    }
  ]
  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + '/missions', {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /missions (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || !data.length) {
  //     throw new Error(`
  //       Error fetch /missions
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiGetGifts(token) {
  return [
    {
      "id": 50,
      "name": "Скидка на индивидуальные занятия",
      "link": "#",
      "type": "promocode",
      "active_from": "2021-08-24 00:00:00",
      "active_to": "2021-10-15 00:00:00",
      "owner_type": "Партнерский",
      "owner": "Brand",
      "subtitle": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse",
      "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio.",
      "urinfo": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio.",
      "support": null,
      "btn_text": null,
      "logo_img": "",
      "preview_img": "/assets/i/present.jpg",
      "received": false,
      "used": false,
      "open": true,
      "coupon": "325646553434"
    },
    {
      "id": 49,
      "name": "Получайте больше баллов",
      "link": null,
      "type": "barcode",
      "active_from": "2021-08-24 00:00:00",
      "active_to": "2021-10-15 00:00:00",
      "owner_type": "Поставщики",
      "owner": "Бренд",
      "subtitle": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse",
      "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio.",
      "urinfo": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio.",
      "support": "8-800-000-00-00",
      "btn_text": "В магазин!",
      "logo_img": "",
      "preview_img": "/assets/i/present-1.jpg",
      "received": false,
      "used": false,
      "open": true,
      "format": "code128",
      "coupon": "4344545232665"
    },
    {
      "id": 48,
      "name": "Продукт",
      "link": null,
      "type": "coupon",
      "active_from": "2021-08-24 00:00:00",
      "active_to": "2021-10-04 00:00:00",
      "owner_type": "Поставщики",
      "owner": "Бренд",
      "subtitle": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse",
      "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio.",
      "urinfo": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad mollitia esse, nulla quo illum corrupti odio, voluptatum amet deserunt, suscipit ipsum quae. Consectetur perspiciatis omnis ipsum pariatur molestias distinctio.",
      "support": "8-800-000-00-00",
      "btn_text": "В магазин!",
      "logo_img": "",
      "preview_img": "/assets/i/present.jpg",
      "received": false,
      "used": false,
      "open": true,
      "coupon": "4344545232665"
    }
  ]

  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + '/gifts', {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /gifts (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data) {
  //     throw new Error(`
  //       Error fetch /gifts
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiGetGift(token, giftId) {
  return {

  }

  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + `/gifts/${ giftId }`, {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /gifts/${ giftId } (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || !data.id) {
  //     throw new Error(`
  //       Error fetch /gifts/${ giftId }
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiSuperprise(token) {
  return {

  }

  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + `/users/superprice`, {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /users/superprice (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data) {
  //     throw new Error(`
  //       Error fetch /users/superprice
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiAcceptSuperprice(token) {
  return {}

  // if (!token) {
  //   return
  // }

  // // const formData = new FormData

  // return fetch(apiAddress + '/users/superprice', {
  //   method: 'post',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error',
  //   // body: formData
  // })
  // .then(response => {
  //   // if (!response.ok) {
  //   //   throw new Error(`
  //   //     Error fetch /users/superprice (${ response.url })
  //   //     ${ responseToLog(response) }
  //   //   `)
  //   // }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data) {
  //     throw new Error(`
  //       Error fetch ​/users/superprice
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiDopgift(token) {
  return {}

  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + `/users/dopgift`, {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /users/dopgift (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data) {
  //     throw new Error(`
  //       Error fetch /users/dopgift
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiAcceptDopgift(token) {
  return {}

  // if (!token) {
  //   return
  // }

  // return fetch(apiAddress + '/users/dopgift', {
  //   method: 'post',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data) {
  //     throw new Error(`
  //       Error fetch ​/users/dopgift
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiGetLevels(token) {
  return [
    { id: 1, open: true, stars: 3, record: 0, starsToOpen: 0 },
    { id: 2, open: true, stars: 3, record: 0, starsToOpen: 1 },
    { id: 3, open: true, stars: 3, record: 0, starsToOpen: 2 },
    { id: 4, open: true, stars: 3, record: 0, starsToOpen: 3 },
    { id: 5, open: true, stars: 3, record: 0, starsToOpen: 4 },
    { id: 6, open: true, stars: 3, record: 0, starsToOpen: 5 },
    { id: 7, open: true, stars: 3, record: 0, starsToOpen: 6 },
    { id: 8, open: true, stars: 3, record: 0, starsToOpen: 7 },
    { id: 9, open: true, stars: 3, record: 0, starsToOpen: 8 },
    { id: 10, open: true, stars: 3, record: 0, starsToOpen: 9 },
    { id: 11, open: true, stars: 3, record: 0, starsToOpen: 0 },
    { id: 12, open: true, stars: 3, record: 0, starsToOpen: 1 },
    { id: 13, open: true, stars: 3, record: 0, starsToOpen: 2 },
    { id: 14, open: true, stars: 3, record: 0, starsToOpen: 3 },
    { id: 15, open: true, stars: 3, record: 0, starsToOpen: 4 },
    { id: 16, open: true, stars: 3, record: 0, starsToOpen: 5 },
    { id: 17, open: true, stars: 3, record: 0, starsToOpen: 6 },
    { id: 18, open: true, stars: 3, record: 0, starsToOpen: 7 },
    { id: 19, open: true, stars: 3, record: 0, starsToOpen: 8 },
    { id: 20, open: true, stars: 3, record: 0, starsToOpen: 9 },
    { id: 21, open: true, stars: 3, record: 0, starsToOpen: 0 },
    { id: 22, open: true, stars: 3, record: 0, starsToOpen: 1 },
    { id: 23, open: true, stars: 3, record: 0, starsToOpen: 2 },
    { id: 24, open: true, stars: 3, record: 0, starsToOpen: 3 },
    { id: 25, open: true, stars: 3, record: 0, starsToOpen: 4 },
    { id: 26, open: true, stars: 3, record: 0, starsToOpen: 5 },
    { id: 27, open: true, stars: 3, record: 0, starsToOpen: 6 },
    { id: 28, open: true, stars: 3, record: 0, starsToOpen: 7 },
    { id: 29, open: true, stars: 3, record: 0, starsToOpen: 8 },
    { id: 30, open: true, stars: 3, record: 0, starsToOpen: 9 },
    { id: 31, open: true, stars: 3, record: 0, starsToOpen: 0 },
    { id: 32, open: true, stars: 3, record: 0, starsToOpen: 1 },
    { id: 33, open: true, stars: 3, record: 0, starsToOpen: 2 },
    { id: 34, open: true, stars: 3, record: 0, starsToOpen: 3 },
    { id: 35, open: true, stars: 3, record: 0, starsToOpen: 4 },
    { id: 36, open: true, stars: 3, record: 0, starsToOpen: 5 },
    { id: 37, open: true, stars: 3, record: 0, starsToOpen: 6 },
    { id: 38, open: true, stars: 3, record: 0, starsToOpen: 7 },
    { id: 39, open: true, stars: 3, record: 0, starsToOpen: 8 },
    { id: 40, open: true, stars: 3, record: 0, starsToOpen: 9 },
    { id: 41, open: true, stars: 3, record: 0, starsToOpen: 0 },
    { id: 42, open: true, stars: 3, record: 0, starsToOpen: 1 },
    { id: 43, open: true, stars: 3, record: 0, starsToOpen: 2 },
    { id: 44, open: true, stars: 3, record: 0, starsToOpen: 3 },
    { id: 45, open: true, stars: 3, record: 0, starsToOpen: 4 },
    { id: 46, open: true, stars: 3, record: 0, starsToOpen: 5 },
    { id: 47, open: true, stars: 3, record: 0, starsToOpen: 6 },
    { id: 48, open: true, stars: 3, record: 0, starsToOpen: 7 },
    { id: 49, open: true, stars: 3, record: 0, starsToOpen: 8 },
    { id: 50, open: true, stars: 3, record: 0, starsToOpen: 9 }
  ]

  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + '/games', {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /games (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || !data.length) {
  //     throw new Error(`
  //       Error fetch /games
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiGetProfile(token) {
  return {
    level: 50,
    attempts: 17,
    stars: 99,
    email: 'demo@mail.com',
    nickname: 'Demo Player',
    points: 1727,
    avatar: '0#15'
  }

  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + '/users/current', {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   // if (!response.ok) {
  //   //   throw new Error(`
  //   //     Error fetch /users/current (${ response.url })
  //   //     ${ responseToLog(response) }
  //   //   `)
  //   // }
  //   if (response.status === '401') {
  //     return 'unauthorized'
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data) {
  //     throw new Error(`
  //       Error fetch /users/current
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiStartLevel(token, level) {
  return {}

  // if (!token) {
  //   return
  // }

  // return fetch(apiAddress + `/games/${ level }/start`, {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /games/${ level }/start (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || (!data.message === "Success") || !data.attempId) {
  //     throw new Error(`
  //       Error fetch /games/<${ level }>/start
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiEndLevel(token, level, attempId, score, stars) {
  return {}

  // if (!token) {
  //   return
  // }

  // return fetch(apiAddress + `/games/${ level }/record`, {
  //   method: 'put',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error',
  //   body: JSON.stringify({ attempId, score, stars })
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /games/${ level }/record (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || (!data.message === "Success")) {
  //     throw new Error(`
  //       Error fetch /games/<${ level }>/record
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiAddAttempts(token, count) {
  // if (!token) {
  //   return
  // }

  // const formData = new FormData
  // formData.append('count', count)
  // formData.append('description', 'Тестовое начисление попыток')

  // return fetch(apiAddress + '/users/add_attempts', {
  //   method: 'post',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error',
  //   body: formData
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /users​/add_attempts (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || !data.id) {
  //     throw new Error(`
  //       Error fetch /users/add_attempts
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiSaveProfile(token, avatar, nickname, email) {
  return {}

  // if (!token) {
  //   return
  // }

  // const formData = new FormData
  // formData.append('avatar', avatar)
  // formData.append('nickname', nickname)
  // formData.append('email', email)

  // return fetch(apiAddress + '/users/current', {
  //   method: 'post',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error',
  //   body: formData
  // })
  // .then(response => {
  //   // if (!response.ok) {
  //   //   throw new Error(`
  //   //     Error fetch /users​/current (${ response.url })
  //   //     ${ responseToLog(response) }
  //   //   `)
  //   // }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data) {
  //     throw new Error(`
  //       Error fetch /users/current
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

async function apiSendGiftUse(token, giftId) {
  return {}

  // if (!token) {
  //   return
  // }

  // return await fetch(apiAddress + `/gifts/${ giftId }/use`, {
  //   method: 'get',
  //   cache: 'no-cache',
  //   headers: new Headers({
  //     Authorization: token,
  //     Accept: 'application/json'
  //   }),
  //   redirect: 'error'
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`
  //       Error fetch /gifts/${ giftId } (${ response.url })
  //       ${ responseToLog(response) }
  //     `)
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   if (!data || !data.message || data.message !== 'Success') {
  //     throw new Error(`
  //       Error fetch /gifts/${ giftId }
  //       Data error
  //       Data: ${ JSON.stringify(data) }
  //     `)
  //   }
  //   return data
  // })
}

function apiSendError(log) {
  return true
  // stop for now

  const formData = new FormData()

  formData.append('text', log)

  fetch(apiAddress + '/error', {
    method: 'post',
    cache: 'no-cache',
    headers: new Headers({
      Authorization: 'Basic ' + btoa(apiAuth),
      Accept: 'application/json'
    }),
    redirect: 'error',
    body: formData
  })
}

export {
  testToken,
  apiGetLevels,
  apiGetProfile,
  apiStartLevel,
  apiEndLevel,
  apiAddAttempts,
  apiGetFaq,
  apiGetLeaderboard,
  apiGetMissions,
  apiGetGifts,
  apiGetGift,
  apiSaveProfile,
  apiSendGiftUse,
  apiSendError,
  apiSuperprise,
  apiAcceptSuperprice,
  apiDopgift,
  apiAcceptDopgift
}
