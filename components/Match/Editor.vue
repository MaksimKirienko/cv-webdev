<template>
  <section class="me">
    <div ref="blocker" class="me-blocker"></div>
    <div class="container">
      <div class="me-container">
        <div class="me-left">
          <div class="me-left-levels">
            <label for="me-level-select">Level</label>
            <select
              v-if="levelsList"
              id="me-level-select"
              class="me-level-select"
              v-model="currentLevel"
            >
              <option v-for="level in levelsList" :key="level" :value="level">{{ level }}</option>
            </select>
            <button class="me-add btn btn-blue" @click="addLevel">+</button>
          </div>
          <div class="me-block">
            <div class="me-block-title">
              Параметры уровня
            </div>

            <div class="me-input-group">
              <div class="me-input-group-title">Номер уровня</div>
              <input
                type="text"
                class="w100p"
                v-model="newLevelName"
                @change="renameLevel()"
              >
            </div>
            <div class="me-input-group">
              <div class="me-input-group-title">Размер сетки</div>
              <input
                type="number"
                min="3"
                max="12"
                class="w100"
                v-model="levelData.gridSize[0]"
                @change="updateGridData(); saveLevel()"
              >
              X
              <input
                type="number"
                min="3"
                max="12"
                class="w100"
                v-model="levelData.gridSize[1]"
                @change="updateGridData(); saveLevel()"
              >
            </div>
            <div class="me-input-group">
              <div class="me-input-group-title">Бэкграунд</div>
              <select
                v-if="backgroundList"
                id="me-level-select"
                class="me-level-select w100p"
                v-model="levelData.background"
                @change="saveLevel()"
              >
                <option v-for="background in backgroundList" :key="background" :value="background">{{ background }}</option>
              </select>
            </div>
          </div>
          <div class="me-block">
            <div class="me-block-title">
              Задачи для прохождения
            </div>
            <div class="me-input-group">
              <div class="me-input-group-title">Лимит ходов*</div>
              <input
                type="number"
                class="w100p"
                v-model="levelData.winTask.movesLimit"
                @change="saveLevel()"
              >
            </div>
            <div class="me-input-group">
              <div class="me-input-group-title">Количество очков</div>
              <input
                type="number"
                class="w100p"
                v-model="levelData.winTask.scoreToBeat"
                @change="saveLevel()"
              >
            </div>
            <div v-if="levelData.winTask.itemsToBlow[0]" class="me-input-group">
              <div class="me-input-group-title">Задача 1</div>
              <div class="me-editor-list">
                <div class="me-cell me-cell-blank" @mousedown="editTask(0)">
                <div
                      v-if="levelData.winTask.itemsToBlow && levelData.winTask.itemsToBlow[0] && levelData.winTask.itemsToBlow[0].item"
                      class="me-item"
                      :style="getItemStyle(levelData.winTask.itemsToBlow[0].item)"
                    />
                </div>
                <input
                  type="number"
                  v-model="levelData.winTask.itemsToBlow[0].count"
                  @change="saveLevel()"
                >
                <div class="me-task-anycolor">
                  <input type="checkbox" id="editorTask1" v-model="levelData.winTask.itemsToBlow[0].anycolor" @change="saveLevel()">
                  <label for="editorTask1">Любой цветной</label>
                </div>
              </div>
            </div>
            <div class="me-input-group">
              <div class="me-input-group-title">Задача 2</div>
              <div class="me-editor-list">
                <div class="me-cell me-cell-blank" @mousedown="editTask(1)">
                <div
                      v-if="levelData.winTask.itemsToBlow && levelData.winTask.itemsToBlow[1] && levelData.winTask.itemsToBlow[1].item"
                      class="me-item"
                      :style="getItemStyle(levelData.winTask.itemsToBlow[1].item)"
                    />
                </div>
                <input
                  type="number"
                  v-model="levelData.winTask.itemsToBlow[1].count"
                  @change="saveLevel()"
                >
                <div class="me-task-anycolor">
                  <input type="checkbox" id="editorTask2" v-model="levelData.winTask.itemsToBlow[1].anycolor" @change="saveLevel()">
                  <label for="editorTask2">Любой цветной</label>
                </div>
              </div>
            </div>
            <div class="me-input-group">
              <div class="me-input-group-title">Баланс рандома</div>
              <input
                type="number"
                class="w100p"
                min="0"
                max="20"
                v-model="levelData.randomBalance"
                @change="saveLevel()"
              >
            </div>
          </div>
          <button class="me-remove btn" @click="removeLevel">Удалить уровень</button>
        </div>
        <div class="me-mid">
          <div class="me-mid-top">
            <div class="me-input-group-title">Элементы для генераторов</div>
            <div class="me-editor-list">
              <div
                v-for="(gen, gi) in 8"
                :key="gen"
                class="me-cell me-cell-blank"
                @mousedown="editGenerator(gi)"
              >
                <div
                    v-if="levelData.generatorElements && (typeof levelData.generatorElements[gi] !== 'undefined')"
                    class="me-item"
                    :style="getItemStyle(levelData.generatorElements[gi])"
                  />
              </div>
            </div>
          </div>
          <div class="me-mid-mid">
            <div class="me-grid-container">
              <div
                class="me-grid"
                @mousedown="drawing = true"
                @mouseup="drawing = false"
                @mouseleave="drawing = false"
              >
                <div v-for="(col, x) in levelData.grid" :key="x" class="me-col">
                  <div
                    v-for="(cell, y) in col"
                    :key="`${ x }_${ y }_${ levelData.grid[x][y].type }`"
                    class="me-cell"
                    :class="[ `me-cell-${ levelData.grid[x][y].type }` ]"
                    @mousedown="editCell(x, y)"
                    @mousemove="() => { if (drawing) { editCell(x, y) }}"
                  >
                    <div
                      v-if="levelData.grid[x][y].itemName"
                      :key="`${ x }_${ y }_${ levelData.grid[x][y].itemName }`"
                      class="me-item"
                      :style="getItemStyle(levelData.grid[x][y].itemName)"
                    />
                    <div
                      v-if="levelData.grid[x][y].modifier"
                      :key="`${ x }_${ y }_${ levelData.grid[x][y].modifier }`"
                      class="me-item"
                      :style="getModifierStyle(levelData.grid[x][y].modifier)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="me-mid-bottom">
            <div class="me-tabs me-mode-tabs">
              <div
                class="me-tab"
                :class="{ active: mode === 'grid' }"
                @click="mode = 'grid'"
              >
                Сетка
              </div>
              <div
                class="me-tab"
                :class="{ active: mode === 'items' }"
                @click="mode = 'items'"
              >
                Элементы
              </div>
              <div
                class="me-tab"
                :class="{ active: mode === 'modifiers' }"
                @click="mode = 'modifiers'"
              >
                Модификаторы
              </div>
            </div>
            <div class="me-tabs-container">
              <div
                v-if="mode === 'grid'"
                class="me-editor-grid">
                <div class="me-editor-list">
                  <div
                    v-for="(ctype, index) in cellTypes"
                    :key="index"
                    class="me-cell"
                    :class="[ `me-cell-${ ctype }`, editorActive == ctype ? 'active' : '' ]"
                    @click="editorActive = ctype"
                  />
                </div>
              </div>
              <div
                v-if="mode === 'items'"
                class="me-editor-grid">
                <div class="me-editor-list">
                  <div
                    class="me-cell me-cell-active"
                    :class="{ active: editorActive === 'delete' }"
                    @click="editorActive = 'delete'"
                  />
                </div>
                <div
                  v-for="(iTypeName, typeIndex) in Object.keys(itemsData.itemTypes)"
                  :key="typeIndex"
                  class="me-editor-list"
                >
                  <div
                    v-for="item in getItemsByType(iTypeName)"
                    :key="item.name"
                    class="me-cell"
                    :class="{ active: editorActive === item.name }"
                    @click="editorActive = item.name"
                  >
                    <div
                      class="me-item"
                      :style="getItemStyle(item.name)"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="mode === 'modifiers'"
                class="me-editor-grid">
                <div class="me-editor-list">
                  <div
                    class="me-cell me-cell-active"
                    :class="{ active: editorActive === 'delete_modifier' }"
                    @click="editorActive = 'delete_modifier'"
                  />
                  <div
                    v-for="(modifier, modifierName) in itemsData.modifiers"
                    :key="modifierName"
                    class="me-cell"
                    :class="{ active: editorActive === modifierName }"
                    @click="editorActive = modifierName"
                  >
                    <div
                      class="me-modifier"
                      :style="getModifierStyle(modifierName)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="me-right" @click="soundInit()">
          <div class="me-game-reload" @click="gameReload()"/>
          <MatchBlur v-if="blured" />
          <MatchGame v-if="levelData" :set-level-data="levelData" :key="gameComponentUpdate"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mergeDeep } from '~/scripts/Match2/lib.js'

export default {
  data() {
    return {
      api: 'http://loc.bs/api/',
      token: 'nW;u!SqW!V6GLF&p',
      levelsList: null,
      backgroundList: null,
      itemsData: [],
      defaultLevelData: {
        gridSize: [5, 5],
        background: 'lines.svg',
        generatorElements: ['bro'],
        randomBalance: 10,
        winTask: {
          scoreToBeat: 300,
          movesLimit: 30,
          itemsToBlow: [{
              item: "bro",
              count: 10
            },
            {
              item: "apple",
              count: 10
            }
          ]
        },
        grid: []
      },
      defaultGridCell: {
        type: 'active'
      },
      levelData: {},
      currentLevel: '',
      newLevelName: '',
      saveTimeout: null,
      cellTypes: ['active', 'active_empty', 'spawner', 'blank', 'blank_block'],
      mode: 'grid',
      drawing: false,
      editorActive: 'active',
      gameComponentUpdate: false
    }
  },
  watch: {
    currentLevel(newlevel) {
      console.log(`change level to ${ newlevel }`)

      this.newLevelName = newlevel
      this.loadLevel(newlevel)
    },
    sound(soundVal) {
      // watch store sound var
      if (!gameAudio) {
        return
      }
      gameAudio.mute(!soundVal)
    }
  },
  methods: {
    gameReload() {
      this.loadLevel()
    },
    getItemStyle(itemName) {
      if (!itemName || ! this.itemsData?.items || (typeof this.itemsData.items[itemName] === 'undefined')) {
        if (this.itemsData?.modifiers && (typeof this.itemsData.modifiers[itemName] !== 'undefined')) {
          return this.getModifierStyle(itemName)
        }
        return
      }

      const item = this.itemsData.items[itemName]
      const sprite = this.itemsData.sprites[ item?.spriteImageFile ]
      const anim = item.stages ? item.stages[item.stages.length - 1].spriteAnimations.default : item.spriteAnimations.default

      return {
        backgroundImage: `url('/assets/i/match/sprites/${ item.spriteImageFile }')`,
        backgroundSize: `
          ${ Math.round(sprite.imageSize[0] / sprite.frameSize[0] * 100) }%
          ${ Math.round(sprite.imageSize[1] / sprite.frameSize[1] * 100) }%`,
        backgroundPosition: `-${ anim.col * 100 }% -${ anim.row * 100 }%`
      }
    },
    getModifierStyle(modifierName) {
      if (!modifierName || !this.itemsData?.modifiers || (typeof this.itemsData.modifiers[modifierName] === 'undefined')) {
        return
      }

      const modifier = this.itemsData.modifiers[modifierName]
      const sprite = this.itemsData.sprites[ modifier.spriteImageFile ]
      const anim = modifier.stages ? modifier.stages[modifier.stages.length - 1].spriteAnimations.default : modifier.spriteAnimations.default

      return {
        backgroundImage: `url('/assets/i/match/sprites/${ modifier.spriteImageFile }')`,
        backgroundSize: `
          ${ Math.round(sprite.imageSize[0] / sprite.frameSize[0] * 100) }%
          ${ Math.round(sprite.imageSize[1] / sprite.frameSize[1] * 100) }%`,
        backgroundPosition: `-${ anim.col * 100 }% -${ anim.row * 100 }%`
      }
    },
    getItemsByType(type) {
      const items = []
      Object.keys(this.itemsData.items).forEach(itemName => {
        const item = this.itemsData.items[itemName]
        if (item.type == type) {
          item.name = itemName
          items.push(item)
        }
      })
      return items
    },
    blockControls(block = true) {
      if (!this.$refs.blocker) {
        return
      }
      if (block) {
        this.$refs.blocker.classList.add('active')
      } else {
        this.$refs.blocker.classList.remove('active')
      }
    },
    updateGridData() {
      if (!this.levelData.grid.length ||
        (this.levelData.grid.length !== this.levelData.gridSize[0]) ||
        (this.levelData.grid[0].length !== this.levelData.gridSize[1])
      ) {
        console.log(`rebuild grid data`)

        const newGrid = new Array(this.levelData.gridSize[0])

        for (let x = this.levelData.gridSize[0] - 1; x >= 0; x--) {
          newGrid[x] = new Array(this.levelData.gridSize[1])

          for (let y = this.levelData.gridSize[1] - 1; y >= 0; y--) {
            if ((typeof this.levelData.grid[x] !== 'undefined')
              && (typeof this.levelData.grid[x][y] !== 'undefined')
            ) {
              newGrid[x][y] = Object.assign({}, this.levelData.grid[x][y])
            } else {
              newGrid[x][y] = Object.assign({}, this.defaultGridCell)
            }
          }
        }

        this.$set(this.levelData, 'grid', newGrid)
      }
    },
    editGenerator(gi) {
      if (this.mode == 'items') {
        if (this.editorActive == 'delete' && this.levelData.generatorElements.length > 1) {
          this.levelData.generatorElements.splice(gi, 1)
        }

        if ((this.editorActive !== 'delete') && (this.levelData.generatorElements.indexOf(this.editorActive) == -1)) {
          this.levelData.generatorElements.push(this.editorActive)
        }
        this.$set(this.levelData.generatorElements, this.levelData.generatorElements)
        this.saveLevel()
      }
    },
    editTask(taskId) {
      if ((this.mode === 'items') || (this.mode === 'modifiers')) {
        if (this.editorActive === 'delete') {
          this.levelData.winTask.itemsToBlow[taskId].item = ''
        }

        if ((this.editorActive !== 'delete')) {
          this.levelData.winTask.itemsToBlow[taskId].item = this.editorActive.replace(/_\d+$/, '_1')
        }

        this.$set(this.levelData.winTask.itemsToBlow, this.levelData.winTask.itemsToBlow)
        this.saveLevel()
      }
    },
    editCell(x, y) {
      console.log(`set cell ${ x } ${ y } to ${ this.editorActive }`)

      if (this.mode == 'grid') {
        if (['active', 'spawner'].includes(this.editorActive)) {
          this.$set(this.levelData.grid[x], y, {
            type: this.editorActive,
            itemName: this.levelData.grid[x][y].itemName,
            modifier: this.levelData.grid[x][y].modifier
          })
        } else {
          this.$set(this.levelData.grid[x], y, {
            type: this.editorActive
          })
        }
      }

      if (this.mode == 'items') {
        if (this.editorActive == 'delete') {
          this.$set(this.levelData.grid[x], y, {
            type: this.levelData.grid[x][y].type,
            modifier: this.levelData.grid[x][y].modifier
          })
        }

        if (this.editorActive !== 'delete' &&
          ['active', 'spawner'].includes(this.levelData.grid[x][y].type)
        ) {
          this.$set(this.levelData.grid[x], y, {
            type: this.levelData.grid[x][y].type,
            modifier: this.levelData.grid[x][y].modifier,
            itemName: this.editorActive
          })
        }
      }

      if (this.mode == 'modifiers') {
        if (this.editorActive == 'delete_modifier') {
          this.$set(this.levelData.grid[x], y, {
            type: this.levelData.grid[x][y].type,
            itemName: this.levelData.grid[x][y].itemName
          })
        }

        if (this.editorActive !== 'delete_modifier' &&
          ['active', 'active_empty', 'spawner'].includes(this.levelData.grid[x][y].type)
        ) {
          this.$set(this.levelData.grid[x], y, {
            type: this.levelData.grid[x][y].type,
            itemName: this.levelData.grid[x][y].itemName,
            modifier: this.editorActive
          })
        }
      }
      this.saveLevel()
    },
    apiRequest(action, sendData = {}) {
      return fetch(this.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          Object.assign({
            token: this.token,
            action
          }, sendData)
        )
      })
      .then(response => response.json())
    },
    getLevelsList() {
      console.log(`get levels`)
      this.blockControls()

      return this.apiRequest('getLevels', {})
      .then((data) => {
        if (Array.isArray(data.levelsList) && data.levelsList.length) {
          this.levelsList = data.levelsList
        } else {
          //this.addLevel()
        }
      })
    },
    addLevel() {
      console.log(`add level`)
      this.blockControls()

      return this.apiRequest('saveLevel', {
        levelName: 'new',
        levelData: JSON.stringify(this.defaultLevelData, null, 2)
      })
      .then((data) => {
          if (data?.status == 'ok') {
            this.getLevelsList()
            .then(() => {
              this.currentLevel = 'new'
            })
          }
      })
    },
    removeLevel() {
      if (!confirm(`Удалить уровень ${this.currentLevel}?`)) {
        return
      }

      console.log(`remove level ${this.currentLevel}`)
      this.blockControls()

      return this.apiRequest('removeLevel', {
        levelName: this.currentLevel
      })
      .then((data) => {
          if (data?.status == 'ok') {
            this.getLevelsList()
            .then(() => {
              this.loadLevel()
            })
          }
      })
    },
    loadLevel(levelName) {
      if (!levelName) {
        const lsLevelName = window?.localStorage.getItem('editorLevelName')

        if (lsLevelName && this.levelsList.indexOf(lsLevelName) !== -1) {
          levelName = lsLevelName
        } else {
          levelName = this.levelsList[0]
        }
      }

      if (levelName !== this.currentLevel) {
        this.currentLevel = levelName
        return
      }

      console.log(`load level ${ levelName }`)
      this.blockControls()

      if ((typeof localStorage !== 'undefined') && localStorage) {
        localStorage.setItem('editorLevelName', levelName)
      }

      return this.apiRequest('loadLevel', {
        levelName
      })
      .then((data) => {
        if (data?.status == 'ok' && data.levelData) {
          this.newLevelName = levelName

          let newLevelDefault = JSON.parse(JSON.stringify(this.defaultLevelData))
          let newLevelData = JSON.parse(data.levelData)
          this.levelData = mergeDeep(newLevelDefault, newLevelData)

          this.gameComponentUpdate = !this.gameComponentUpdate
          // this.$set(this, 'levelData', newLevelData)

          this.updateGridData()
          this.blockControls(false)
        }
      })
    },
    renameLevel() {
      console.log(`rename level ${ this.currentLevel } to ${ this.newLevelName }`)
      this.blockControls()

      return this.apiRequest('renameLevel', {
        levelName: this.currentLevel,
        newLevelName: this.newLevelName
      })
      .then((data) => {
        if (data?.status == 'ok') {
          this.getLevelsList()
          .then(() => {
            this.currentLevel = this.newLevelName
          })
        }
      })
    },
    saveLevel(immediate = false) {
      if (immediate) {
        this.gameComponentUpdate = !this.gameComponentUpdate

        clearTimeout(this.saveTimeout)
        this.saveTimeout = null
        console.log(`save level ${ this.currentLevel }`)

        return this.apiRequest('saveLevel', {
          levelName: this.currentLevel,
          levelData: JSON.stringify(this.levelData, null, 2)
        })
        .then((data) => {
          if (data?.status !== 'ok') {
            alert('ошибка сохранения')
          }
        })
      }

      console.log(`task to save level ${ this.currentLevel }`)

      if (!immediate && !this.saveTimeout) {
        this.saveTimeout = setTimeout(() => {
          this.saveLevel(true)
        }, 5000)
      }

    },
    getBackgroundList() {
      console.log(`get backgrounds`)

      this.blockControls()
      return this.apiRequest('getBackgroundList', {})
      .then((data) => {
        if (Array.isArray(data.backgroundList) && data.backgroundList.length) {
          this.backgroundList = data.backgroundList
        } else {
          alert('No backgrounds found')
        }
      })
    },
    getItemsData() {
      console.log(`get items`)

      this.blockControls()
      return this.apiRequest('getItemsData', {})
      .then((data) => {
        if (data?.status == 'ok' && data.itemsData) {
          this.itemsData = JSON.parse(data.itemsData)
        } else {
          alert('No items loaded')
        }
      })
    },
    soundInit() {
      gameAudio.init()
    }
  },
  created() {
    this.levelData = JSON.parse(JSON.stringify(this.defaultLevelData))
  },
  mounted() {
    if (window) {
      this.api = (window.location.hostname === 'localhost') ?
        'http://loc.bs/api/' :
        `${ window.location.origin }/api/`
    }

    this.getBackgroundList()
    .then(() => {
      return this.getItemsData()
    })
    .then(() => {
      return this.getLevelsList()
    })
    .then(() => {
      this.loadLevel()
    })
  },
  computed: {
    blured() {
      return this.$store.state.match.blured
    },
    sound() {
      return this.$store.state.match.sound
    }
  }
}
</script>

<style lang="scss">
.me {
  position: relative;
  font-size: 1rem;
  height: 100vh;
  background-color: #fff;
}

.me-left, .me-mid {
  .btn {
    padding: 4px 8px;
    border-radius: 3px;
  }
  select {
    min-width: 120px;
    font-size: 1rem;
    border-radius: 3px;
    padding: 8px 15px 8px 10px;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid #CED4DA;
  }
  label {
    font-size: 1rem;
    margin-right: 30px;
  }
  .w100 {
    width: 100px;
  }
  .w100p {
    width: 100%;
  }
  input {
    font-size: 1rem;
    border-radius: 3px;
    padding: 8px 15px;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid #CED4DA;
    vertical-align: bottom;
  }
  .btn-outline-red {
    border-radius: 50px;
    background: #fff;
    color: red;
    border: 1px solid red;
  }
}

.me-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
}

.me-blocker {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;

  &.active {
    display: block;
    opacity: 1;
  }
}

.me-left {
  padding: 26px 20px 30px 0;
  width: 28%;
  min-width: 300px;
  border-right: 1px solid #6C757D;
  box-sizing: border-box;
  flex-grow: 0;
  overflow: auto;
}

.me-block {
  margin-top: 20px;
  background: #FFF;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0 16px 20px 16px;
  box-sizing: border-box;
}

.me-block-title {
  height: 48px;
  display: flex;
  align-items: center;
  margin: 0 -16px 20px -16px;
  padding: 0 16px;
  font-size: 1rem;
  color: #0D6EFD;
  background-color: #CFE2FF;
}
.me-input-group {
  margin-top: 16px;
  display: block;
}
.me-input-group-title {
  margin-bottom: 6px;
}
.me-task-anycolor {
  margin-top: 4px;
  width: 100%;
}
.me-add {
  vertical-align: middle;
  margin-left: 12px;
}
.me-remove {
  font-size: 0.9rem;
  margin-top: 20px;
  animation: none;
  box-shadow: none !important;
  background: #fff;
  color: #6C757D;
  border: 1px solid #6C757D;

  &:hover {
    color: red;
    border-color: red;
  }
}
.me-mid {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  display: flex;
  flex-direction: column;
}

.me-mid-top {
  height: 88px;
  padding: 16px 16px 8px 16px;
  flex-grow: 0;
  flex-shrink: 0;
  border-bottom: 1px solid #DEE2E6;
  box-sizing: border-box;
}

.me-mid-mid {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: start;
  overflow: hidden;
}
.me-grid-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
}
.me-grid {
  cursor: copy;
  display: flex;
  margin: 0 auto;
}
.me-col {
  display: flex;
  flex-direction: column;
}
.me-cell {
  position: relative;
  margin: 1px;
  width: 36px;
  height: 36px;
  flex-grow: 0;
  flex-shrink: 0;
  border: 1px solid transparent;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.me-cell-active {
    background: #C4CDCF;
    border-color: #C4CDCF;
  }
  &.me-cell-active_empty {
    background: #C4CDCF;
    border-color: #C4CDCF;

    &::before {
      content: 'X';
      position: absolute;
      font-size: 20px;
      line-height: 20px;
      color: #fff;
    }
  }
  &.me-cell-blank {
    background: #fff;
    border-color: #C4CDCF;
  }
  &.me-cell-blank_block {
    background: #fff;
    border-color: #C4CDCF;

    &::before {
      content: 'X';
      position: absolute;
      font-size: 40px;
      line-height: 40px;
      color: #C4CDCF;
    }
  }
  &.me-cell-spawner {
    background: #C4CDCF;
    border-color: #C4CDCF;

    &::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #42BC17;
      z-index: 2;
    }
  }
}
.me-item {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  image-rendering: -webkit-optimize-contrast;
}

.me-modifier {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.me-mid-bottom {
  flex-grow: 0;
  height: 40%;
  display: flex;
  flex-direction: column;
}

.me-tabs {
  margin: 0 0 20px 0;
  border-bottom: 1px solid #DEE2E6;
  display: flex;
}

.me-tab {
  cursor: pointer;
  position: relative;
  top: 2px;
  height: 18px;
  line-height: 18px;
  padding: 6px 12px;
  margin-left: 8px;
  color: #0D6EFD;
  font-size: 0.9rem;
  border-radius: 6px 6px 0 0;
  border: 1px solid transparent;

  &.active {
    color: #212529;
    // font-weight: 600;
    background: #fff;
    border: 1px solid #DEE2E6;
    border-bottom: none;
  }
}

.me-tabs-container {
  overflow-y: scroll;
}

.me-editor-grid {
  margin: 0 16px;
}
.me-editor-list {
  display: flex;
  flex-wrap: wrap;

  .me-cell {
    cursor: pointer;

    &.active {
      // outline: 3px solid #72BCE5;
      box-shadow: 0 0 1px 3px rgba(229, 110, 251, 1);
    }
  }
}
.me-right {
  position: relative;
  width: 360px;
  flex-shrink: 0;
  border-left: 1px solid #6C757D;
}

.me-game-reload {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 30px;
  background-color: #fff;
  z-index: 10;
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: 'X';
    font-weight: bold;
    font-size: 18px;
    line-height: 100%;
  }
}
</style>
