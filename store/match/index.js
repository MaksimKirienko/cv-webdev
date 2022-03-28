export const state = () => ({
  condition: 'start',
  currentLevel: null,
  lastLevel: null,
  blured: false,
  blur: {
    status: false,
    handler: '',
    callback: null
  },
  preloaded: false,
  paused: false,
  sound: true,
  serverError: '',
  startLevelWnd: 0,
  attempId: false,
  token: '',
  profile: {},
  heartNoError: false,
  firstMenu: true,
  showTutorial: false,
  showGameTutorial: false,
  levels: [],
  wrongToken: false,
  leaveLink: '',
  showDraw: false,
  showP49: false
})

export const mutations = {
  setCondition(state, condition) {
    if (condition !== state.condition) {
      state.condition = condition
    }
  },
  setShowTutorial(state, show) {
    state.showTutorial = show
  },
  setShowGameTutorial(state, show) {
    state.showGameTutorial = show
  },
  setFirstMenu(state) {
    state.firstMenu = false
  },
  startLevelWnd(state, levelName) {
    state.startLevelWnd = levelName
  },
  startLevel(state, levelName) {
    if (levelName === state.currentLevel) {
      return
    }
    state.condition = 'game'
    state.currentLevel = levelName
    state.lastLevel = levelName
    state.startLevelWnd = 0
  },
  closeLevel(state) {
    state.showGameTutorial = false
    state.condition = 'main'
    state.currentLevel = null
  },
  setBlur(state, { status, handler, callback, zIndex }) {
    state.blured = status
    state.blur = { status, handler, callback, zIndex: zIndex ?? '' }
  },
  setPreloaded(state) {
    state.preloaded = true
  },
  setWrongToken(state) {
    state.wrongToken = true
    if ((state.condition !== 'preload') && (state.condition !== 'start')) {
      state.condition = 'preload'
    }
    state.preloaded = false
  },
  setPause(state, pause = 1) {
    state.paused = pause
  },
  setSound(state, sound = true) {
    if ((typeof localStorage !== 'undefined') && localStorage) {
      localStorage.setItem('sound', sound ? 1 : 0)
    }
    state.sound = sound
  },
  setProfile(state, profile) {
    profile.timestamp = Date.now()

    state.profile = profile

    if (!state.lastLevel) {
      const level = profile.level ?? 1
      state.lastLevel = level < 50 ? level : 50
    }

    if ((profile.stars == 0) && state.firstMenu && !state.showTutorial) {
      state.showTutorial = true
      state.showGameTutorial = true
    }
  },
  resetProfileTimestamp(state) {
    state.profile.timestamp = new Date(1)
  },
  setNowProfileTimestamp(state) {
    state.profile.timestamp = Date.now()
  },
  setToken(state, token) {
    if (!token) {
      return
    }

    state.token = token
    if ((typeof localStorage !== 'undefined') && localStorage) {
      localStorage.setItem('token', token)
    }
  },
  setServerError(state, serverError) {
    state.serverError = serverError
  },
  setHeartNoError(state, active) {
    state.heartNoError = active
  },
  setLevelsData(state, levels) {
    state.levels = levels
  },
  setAttempId(state, attempId) {
    state.attempId = attempId
  },
  setLeaveLink(state, link) {
    state.leaveLink = link
  },
  setShowDraw(state, status) {
    state.showDraw = status
  },
  setShowP49(state, status) {
    state.showP49 = status
  },
}
