import { MatchField } from './MatchField'
import { Item } from './Item'
import { Effect } from './Effect'
import { Sprite } from './Sprite'
import { shuffleArray, weightedRandom } from '~/scripts/Match2/lib.js'

interface Task {
  itemName: string
  count: number
  anycolor: boolean
}

declare global {
  interface Window {
    gameAudio: any
  }
}

export class MatchGame {
  public itemsData: any
  public levelData: any = null

  private _score: number = 0
  private _movesLeft: number = 0
  private _scoreToWin: number = 0
  private _tasks: Array<Task> = []

  private _items: Array<Item> = []
  private _modifiers: Array<Item> = []
  private _packs: Array<Set<Item>> = []
  private _combos: Array<[Item, Item]> = []
  private _comboEffects: Array<Sprite> = []

  private _cellSizePx: [number, number] = [40, 40]
  private _gameField: MatchField

  private _blockControl: boolean = false

  private _powerCombosCount = [5, 7, 9] // rocket / bomb / disco

  constructor(node: HTMLElement, itemsData: any) {
    this.itemsData = itemsData
    this._gameField = new MatchField(node, this._cellSizePx, this.itemsData)
  }

  startLevel(levelData: any) {
    if (!levelData || !levelData.grid || !levelData.grid.length) {
      console.log(`Match Editor startLevel error: can't start level - no data`)
      return
    }
    console.log(`MatchGame start level`)
    this._setLevelData(levelData)

    this._movesLeft = levelData.winTask.movesLimit
    this._scoreToWin = parseInt(levelData.winTask.scoreToBeat)
    this._score = 0

    levelData.winTask.itemsToBlow.forEach((i: any) => {
      this._tasks.push({
        itemName: i.item,
        count: parseInt(i.count),
        anycolor: i.anycolor ?? false
      })
    })

    this._gameField.initGrid(this.levelData.gridSize, this.levelData.grid)
    this._initItems()
    this._findPacks()
  }

  getTasks() {
    if (!this._tasks) {
      return
    }
    return [...this._tasks]
  }

  getTaskByItem(item: Item) {
    if (!this._tasks) {
      return
    }

    const itemNameNoStages = item.name.replace(/_\d+$/, '')
    const itemNameNoColor = itemNameNoStages.replace(/_(green|purple|red|yellow|blue)$/, '')

    // if has color - check anycolor tasks
    if (itemNameNoColor !== itemNameNoStages) {
      const taskAnyColor = this._tasks.filter(
        i => i.anycolor &&
        i.itemName.replace(/_\d+$/, '').replace(/_(green|purple|red|yellow|blue)$/, '') === itemNameNoColor)

      if (taskAnyColor.length) {
        return taskAnyColor[0]
      }
    }

    const task = this._tasks.filter(
      i => !i.anycolor &&
      i.itemName.replace(/_\d+$/, '') === itemNameNoStages)

    if (task.length) {
      return task[0]
    }
  }

  getTaskById(taskId: number) {
    if (!this._tasks) {
      return
    }
    if (taskId < this._tasks.length){
      return this._tasks[taskId]
    }
  }

  checkTaskToLower(item: Item) {
    const task = this.getTaskByItem(item)

    if (task && task.count) {
      this._taskFlyAnimation(item)
      task.count -= 1
    }
  }

  async _taskFlyAnimation(item: Item) {
    const task = this.getTaskByItem(item)

    if (!task) {
      return
    }

    const taskEndNode = document.querySelector(`.match-task-${ task.itemName }`)
    const endPosition = taskEndNode?.getBoundingClientRect()

    if (endPosition) {
      return await item.animationFlyTask([
        ((endPosition.left + endPosition.right) / 2),
        ((endPosition.top + endPosition.bottom) / 2)
      ])
    }
  }

  getMovesLeft() {
    return this._movesLeft
  }

  getScoreToWin() {
    return this._scoreToWin
  }

  getCurrentScore() {
    return this._score
  }

  _getItemPack(item: Item) {
    for (let i = 0; i < this._packs.length; i++) {
      if (this._packs[i].has(item)) {
        return this._packs[i]
      }
    }
    return null
  }

  _findPacks() {
    this._packs = []

    // only for items canCombine
    this._items.filter(i => i.canCombine).forEach(item => {
      if (this._gameField.checkItemBlocked(item)) {
        return
      }

      //find items can connect near us
      const itemsCanConnect = this._gameField
        .getItemsCross(item.positionGrid)
        .filter(
          ni => ni.canCombine &&
          (ni !== item) &&
          (ni?.color === item.color) &&
          !(this._gameField.checkItemBlocked(ni))
        )

      // nothing to connect
      if (!itemsCanConnect.length) {
        return
      }

      // find if near items in packs
      let nearPacks: Array<Set<Item>> = []
      itemsCanConnect.forEach(ni => {
        const nearPack = this._getItemPack(ni)
        if (nearPack) {
          nearPacks.push(nearPack)
        }
      })

      // packs found, adding
      if (nearPacks && nearPacks.length) {
        if (nearPacks.length > 1) {
          // need to combine many sets

          // create new pack with all items from near packs
          const newPack: Set<Item> = new Set()
          nearPacks.forEach(np => {
            np.forEach(npi => newPack.add(npi))
          })

          // don't forget to add near items
          itemsCanConnect.forEach(ni => newPack.add(ni))

          // remove all old near packs
          this._packs = this._packs.filter(oldPack => {
            const intersection = nearPacks.filter(np => np == oldPack)
            return intersection && intersection.length ? false : true
          })

          // add new combined pack
          this._packs.push(newPack)

          return
        }

        // if near only one pack, just add into it (self and near items)
        itemsCanConnect.forEach(ni => nearPacks[0].add(ni))
        nearPacks[0].add(item)
      } else {
        // no pack, creating new
        this._packs.push(new Set([item, ...itemsCanConnect]))
      }
    })

    this._findPowerCombos()
    this._setItemIcons()
  }

  _checkItemsGridBindings() {
    this._items.forEach(i => {
      const cell = this._gameField.getCell(i.positionGrid)
      if (cell?.itemConnected !== i) {
        debugger
      }
    })

    const gridSize = this._gameField.gridSize
    const grid = this.levelData.grid

    for (let x: number = 0; x < gridSize[0]; x++) {
      for (let y: number = 0; y < gridSize[1]; y++) {
        const cell = this._gameField.getActiveCell([x, y])
        if (!cell || !cell.itemConnected) {
          continue
        }

        if (
          (cell?.itemConnected?.positionGrid[0] !== x) &&
          (cell?.itemConnected?.positionGrid[1] !== y)
        ) {
          debugger
        }
      }
    }
  }

  _getPowerCombo(powerItem: Item) {
    const rez = this._combos.filter(cb => cb[0] === powerItem || cb[1] === powerItem)

   if (rez.length) {
     return rez[0]
   } else {
     return false
   }
  }

  _clearComboEffects() {
    this._comboEffects.forEach(ce => {
      ce.stopSpriteAnimation()
      ce.nodeLink.remove()
    })
    this._comboEffects = []

    this._items.filter(i => i.typeName === 'power').forEach(i => {
      i.setHighlight(false)
    });
  }

  _findPowerCombos() {
    const combosPriority = [
      [/disco/, /disco/],
      [/disco/, 'bomb'],
      [/disco/, /rocket/],
      ['bomb', 'bomb'],
      ['bomb', /rocket/],
      [/rocket/, /rocket/],
    ]

    this._combos = []

    this._clearComboEffects()

    combosPriority.forEach(comboOption => {
      this._items.filter(i => i.name.match(comboOption[0])).forEach(item => {

        if (this._gameField.checkItemBlocked(item)) {
          return false
        }

        const nearComboItems = this._gameField
          .getItemsCross(item.positionGrid)
          .filter(i2 => i2 !== item && i2.name.match(comboOption[1]) && !this._gameField.checkItemBlocked(i2))

        nearComboItems.forEach(nc => {
          if (this._getPowerCombo(item) || this._getPowerCombo(nc)) {
            return
          }

          this._combos.push([item, nc])

          item.setHighlight(true)
          nc.setHighlight(true)

          const lightningStartPosition: [number, number] = [
            item.node.offsetLeft + item.node.clientWidth / 2,
            item.node.offsetTop + item.node.clientHeight / 2
          ]

          const lightningEndPosition: [number, number] = [
            nc.node.offsetLeft + nc.node.clientWidth / 2,
            nc.node.offsetTop + nc.node.clientHeight / 2
          ]

          this._comboEffects.push(
            Effect.comboConnect(this._gameField.gridNode, lightningEndPosition, lightningStartPosition)
          )
        })
      })
    })
  }

  async _shuffle(iteration: number = 1) {
    if (iteration > 5 || this._packs.length || this._items.filter(i => i.typeName === 'power').length) {
      return
    }

    console.log(`_shuffle iteration ${ iteration }`)
    window.gameAudio.play('shuffle')

    const moveItems = this._items.filter(i => i.canCombine && !this._gameField.checkItemBlocked(i))
    const positions: Array<[number, number]> = []
    const animations: Array<Promise<any>> = []

    // get positions in normal order
    moveItems.forEach(item => {
      positions.push(item.positionGrid)
      this._gameField.unconnectItem(item)
    })

    const shuffledItems = <Array<Item>>shuffleArray(moveItems)

    // for each position move shuffled item
    positions.forEach(pos => {
      const item = shuffledItems.pop()
      if (!item) {
        return
      }

      const startPosition = item.positionGrid
      this._gameField.moveItemOnGrid(item, pos)
      animations.push(item?.animationMoveShuffle(startPosition))
    })

    return await Promise.all(animations)
      .then((): Promise<any> => {
        this._findPacks()
        if (!this._packs.length) {
          return this._shuffle(iteration + 1)
        }
        return Promise.resolve()
      })
  }

  _setItemIcons() {
    this._items.filter(i => i.canCombine).forEach(item => {
      const pack = this._getItemPack(item)

      if (!pack) {
        item.setItemIcon(-1)
        return
      }

      let currentCombo = -1

      if (pack.size >= this._powerCombosCount[2]) {
        // disco
        currentCombo = 2
      } else if (pack.size >= this._powerCombosCount[1]) {
        // bomb
        currentCombo = 1
      } else if (pack.size >= this._powerCombosCount[0]) {
        // rocket
        currentCombo = 0
      }

      pack.forEach(item => {
        item.setItemIcon(currentCombo)
      })
    })
  }

  _setLevelData(levelData: any) {
    const newLevelData = JSON.parse(JSON.stringify(levelData))

    if (!levelData) {
      console.log(`Match Editor _setLevelData error: can't set level data - no levelData`)
      return
    }

    if (!newLevelData.grid || !newLevelData.grid.length) {
      console.log(`Match Editor _setLevelData error: can't set level data - no grid`)
      return
    }

    const gridSize = newLevelData.gridSize

    for (let x: number = 0; x < gridSize[0]; x++) {
      for (let y: number = 0; y < gridSize[1]; y++) {
        if (newLevelData.grid[x][y].type === 'active_empty') {
          newLevelData.grid[x][y].noFill = true
          newLevelData.grid[x][y].type = 'active'
        }
      }
    }

    this.levelData = newLevelData
  }

  // level start – add items on all cells
  _initItems() {
    const gridSize = this._gameField.gridSize
    const grid = this.levelData.grid

    // fill static
    for (let x: number = 0; x < gridSize[0]; x++) {
      for (let y: number = 0; y < gridSize[1]; y++) {
        const cell = this._gameField.getActiveCell([x, y])
        if (cell && !cell.noFill && grid[x][y].itemName) {
          this._addItem([x, y], grid[x][y].itemName)
        }
        if (cell && grid[x][y].modifier) {
          this._addModifier([x, y], grid[x][y].modifier)
        }
      }
    }

    // fill random
    for (let x: number = 0; x < gridSize[0]; x++) {
      for (let y: number = 0; y < gridSize[1]; y++) {
        const cell = this._gameField.getActiveCell([x, y])
        if (cell && !cell.noFill && !grid[x][y].itemName) {
          this._addItem([x, y])
        }
      }
    }

    this._blockControl = true
    this._fallAndRespawn()
      .then(() => {
        this._blockControl = false
      })
  }

  _addItem(positionGrid: [ number, number ], itemName: string = '') {
    // console.log(`MatchGame _addItem ${ itemName }`)

    if (!itemName) {
      // generate random name
      const randomList: Array<string> = this.levelData.generatorElements
      const selection: Array<Object> = []
      const maxWeight = this._items.filter(i => i.canCombine).length

      const randomBalance = this.levelData.randomBalance ?? 10

      randomList.forEach(itemName => {
        const items = this._items.filter(i => i.name === itemName)
        selection.push({
          name: itemName,
          weight: Math.max(0.05, maxWeight - items.length * (randomBalance / 10))
        })
      })

      itemName = weightedRandom(selection).name
    }

    const newItem = this._gameField.createItem(itemName, positionGrid)
    if (newItem) {
      newItem.node.addEventListener('click', () => {
        this._itemClick.call(this, newItem)
      })
      this._items.push(newItem)

      return newItem
    }

    return null
  }

  _addModifier(positionGrid: [ number, number ], modifierName: string = '') {
    const newModifier = this._gameField.createModifier(modifierName, positionGrid)
    if (newModifier) {
      this._modifiers.push(newModifier)

      return newModifier
    }
  }

  async _itemClick(item: Item) {
    console.log(`### CLICK ITEM`, item)

    if (this._blockControl) {
      console.log(`click item blocked`)
      return
    }

    if (!this._movesLeft) {
      console.log(`no moves left`)
      return
    }

    let action: Promise<any> | null = null

    this._blockControl = true

    if (item.typeName === 'item') {
      const itemPack = this._getItemPack(item)

      if (itemPack) {
        this._movesLeft -= 1
        action = this._usePack(item, itemPack)
      }
    }

    if (item.typeName === 'power') {
      this._movesLeft -= 1
      action = this._runPower(item)
    }

    if (action) {
      // this._checkItemsGridBindings()
      return await action
        .then(() => {
          return this._fallAndRespawn()
        })
        .then(() => {
          // this._checkItemsGridBindings()
          this._blockControl = false
        })
    } else {
      // this._checkItemsGridBindings()
      this._blockControl = false
    }
  }

  async _runPower(item: Item) {
    let powerAction: Promise<any> | null = null

    const combo = this._getPowerCombo(item)

    if (combo) {
      const item2 = combo[0] === item ? combo[1] : combo[0]

      if (combo[0].name.match(/rocket/) && combo[1].name.match(/rocket/)) {
        powerAction = this._runPowerRocketCombo(item, item2)
      }

      if (combo[0].name === 'bomb' && combo[1].name === 'bomb') {
        powerAction = this._runPowerBombCombo(item, item2)
      }

      if (combo[0].name === 'bomb' && combo[1].name.match(/rocket/) ||
          (combo[1].name === 'bomb' && combo[0].name.match(/rocket/))) {
        powerAction = this._runPowerBombRocketCombo(item, item2)
      }

      if (combo[0].name.match(/disco/) && combo[1].name.match(/(rocket|bomb)/) ||
          (combo[1].name.match(/disco/) && combo[0].name.match(/(rocket|bomb)/))) {
        powerAction = this._runPowerDiscoRocketBombCombo(item, item2)
      }

      if (combo[0].name.match(/disco/) && combo[1].name.match(/disco/) ||
          (combo[1].name.match(/disco/) && combo[0].name.match(/disco/))) {
        powerAction = this._runPowerDiscoDiscoCombo(item, item2)
      }

      if (powerAction) {
        this._clearComboEffects()
      }
    } else {
      if (item.name === 'rocket_h') {
        window.gameAudio.play('rocket')
        powerAction = this._runPowerRocket(item)
      }
      if (item.name === 'rocket_v') {
        window.gameAudio.play('rocket')
        powerAction = this._runPowerRocket(item)
      }
      if (item.name === 'bomb') {
        powerAction = this._runPowerBomb(item)
      }
      if (item.name.match(/disco_/)) {
        powerAction = this._runPowerDisco(item)
      }
    }

    if (powerAction) {
      return await powerAction
    }
  }

  async _runPowerDiscoDiscoCombo(item1: Item, item2: Item) {
    const blows: Array<Promise<any>> = []

    window.gameAudio.play('disco-combo')

    this._removeItem(item1, false)
    this._removeItem(item2)

    // all items not blocked
    const blowItems: Array<Item> = this._items
      .filter(i =>
        !this._gameField.checkItemBlocked(i)
      )

    blowItems.push(...this._modifiers)

    const isn = item1.node
    item1.sprite?.updateImage('disco-combo.png', [2100, 300], [300, 300])
    item1.sprite?.updateAnimationsData({
      "default": { col: 0, row: 0, steps: 8, duration: 120 }
    })
    item1.sprite?.play('default')


    const animationDuration = 2500
    let lightLimit = 30

    const growWithLights = Promise.all([
      item1.animationScaleUp(3.5, animationDuration, true)
    ])

    const lightningStartPosition: [number, number] = [
      item1.node.offsetLeft + item1.node.clientWidth / 2,
      item1.node.offsetTop + item1.node.clientHeight / 2
    ]

    blowItems.forEach(itemToBlow => {
      const lightningEndPosition: [number, number] = [
        itemToBlow.node.offsetLeft + itemToBlow.node.clientWidth / 2,
        itemToBlow.node.offsetTop + itemToBlow.node.clientHeight / 2
      ]

      blows.push(
        new Promise((resolve) => {
          setTimeout(() => {
            Promise.all([
              this._demageItem(itemToBlow, 'power'),
              (!itemToBlow.isModifier && lightLimit--) ?
                Effect.lightning(this._gameField.gridNode, lightningEndPosition, lightningStartPosition) :
                Promise.resolve()
            ]).then(() => {
              resolve('')
            })

          }, animationDuration / 6 + Math.random() * (animationDuration / 2))
        })
      )
    })

    return await Promise.all([growWithLights, ...blows])
      .then(() => {
        this._removeItem(item1, true)
      })
  }

  async _runPowerDiscoRocketBombCombo(item1: Item, item2: Item) {
    let item: Item
    let itemSecond: Item
    const blows: Array<Promise<any>> = []
    let lightLimit = 15

    if (item1.name.match(/disco/)) {
      item = item1
      itemSecond = item2
    } else {
      item = item2
      itemSecond = item1
    }

    window.gameAudio.play('disco')

    setTimeout(() => {
      if (itemSecond.name === 'bomb') {
        window.gameAudio.play('bombs')
      } else {
        window.gameAudio.play('rockets')
      }
    }, 500)

    // remove disco, stay node. Remove second total
    this._removeItem(item, false)
    this._removeItem(itemSecond)

    // colored to blow
    const blowItems = this._items
      .filter(i =>
        i.color === item.color &&
        !i.blowNear &&
        !this._gameField.checkItemBlocked(i)
      )

    const animationDuration = 1200

    const growWithLights = Promise.all([
      item.animationScaleUp(1.5, animationDuration, true)
    ])

    blowItems.forEach(itemToBlow => {
      const lightningStartPosition: [number, number] = [
        item.node.offsetLeft + item.node.clientWidth / 2,
        item.node.offsetTop + item.node.clientHeight / 2
      ]

      const lightningEndPosition: [number, number] = [
        itemToBlow.node.offsetLeft + itemToBlow.node.clientWidth / 2,
        itemToBlow.node.offsetTop + itemToBlow.node.clientHeight / 2
      ]

      blows.push(
        new Promise((resolve) => {
          setTimeout(() => {
            // add powers
            const powerName = itemSecond.name === 'bomb' ? 'bomb' :
              (Math.random() < 0.5 ? 'rocket_h' : 'rocket_v')

            const newPowerItem = this._gameField.createItem(powerName, itemToBlow.positionGrid, true)

            Promise.all([
              this._demageItem(itemToBlow, 'power'),
              (lightLimit--) ?
                Effect.lightning(this._gameField.gridNode, lightningEndPosition, lightningStartPosition) :
                Promise.resolve(),
              newPowerItem ? this._runPower(newPowerItem) : Promise.resolve()
            ]).then(() => {
              resolve('')
            })

          }, animationDuration / 6 + Math.random() * (animationDuration / 2))
        })
      )
    })

    return await Promise.all([growWithLights, ...blows])
      .then(() => {
        this._removeItem(item, true)
      })
  }

  async _runPowerBombRocketCombo(item1: Item, item2: Item) {
    // this._checkItemsGridBindings()
    // console.log('_runPowerBombRocketCombo')
    const positionGrid = item1.positionGrid

    window.gameAudio.play('rockets')

    this._removeItem(item1)
    this._removeItem(item2)

    const newItems = [
      this._gameField.createItem('rocket_h', [positionGrid[0], positionGrid[1] - 1], true),
      this._gameField.createItem('rocket_v', [positionGrid[0], positionGrid[1]], true),
      this._gameField.createItem('rocket_h', [positionGrid[0], positionGrid[1]], true),
      this._gameField.createItem('rocket_h', [positionGrid[0], positionGrid[1] + 1], true),
      this._gameField.createItem('rocket_v', [positionGrid[0] - 1, positionGrid[1]], true),
      this._gameField.createItem('rocket_v', [positionGrid[0] + 1, positionGrid[1]], true)
    ]

    const itemsToBlow = [
      this._gameField.getItem([positionGrid[0], positionGrid[1] - 1]),
      this._gameField.getItem([positionGrid[0], positionGrid[1] + 1]),
      this._gameField.getItem([positionGrid[0] - 1, positionGrid[1]]),
      this._gameField.getItem([positionGrid[0] + 1, positionGrid[1]]),
      ...newItems
    ]

    const blows: Array<Promise<any>> = []

    itemsToBlow.forEach(ni => {
      if (ni instanceof Item) {
        blows.push(this._demageItem(ni, 'power'))
      }
    })

    return Promise.all(blows)
  }

  async _runPowerBombCombo(item1: Item, item2: Item) {
    window.gameAudio.play('bomb-big')

    this._removeItem(item2)
    return await this._runPowerBomb(item1, 3)
  }

  async _runPowerRocketCombo(item1: Item, item2: Item) {
    const positionGrid = item1.positionGrid

    window.gameAudio.play('rocket')

    setTimeout(() => {
      window.gameAudio.play('rocket')
    }, 200)

    this._removeItem(item1)
    this._removeItem(item2)

    const newItem1 = this._gameField.createItem('rocket_h', positionGrid, true)
    const newItem2 = this._gameField.createItem('rocket_v', positionGrid, true)

    if (!newItem1 || !newItem2) {
      return
    }

    return Promise.all([
      this._runPowerRocket(newItem1),
      this._runPowerRocket(newItem2)
    ])
  }

  async _runPowerDisco(item: Item) {
    const blows: Array<Promise<any>> = []

    window.gameAudio.play('disco')

    // remove disco, stay node
    this._removeItem(item, false)

    const blowItems = this._items
      .filter(i =>
        i.color === item.color &&
        !i.blowNear &&
        !this._gameField.checkItemBlocked(i)
      )

    const animationDuration = 1200
    let lightLimit = 15

    const growWithLights = Promise.all([
      item.animationScaleUp(1.5, animationDuration, true)
    ])

    blowItems.forEach(itemToBlow => {
      const lightningStartPosition: [number, number] = [
        item.node.offsetLeft + item.node.clientWidth / 2,
        item.node.offsetTop + item.node.clientHeight / 2
      ]

      const lightningEndPosition: [number, number] = [
        itemToBlow.node.offsetLeft + itemToBlow.node.clientWidth / 2,
        itemToBlow.node.offsetTop + itemToBlow.node.clientHeight / 2
      ]

      blows.push(
        new Promise((resolve) => {
          setTimeout(() => {
            Promise.all([
              this._demageItem(itemToBlow, 'power'),
              (lightLimit--) ?
                Effect.lightning(this._gameField.gridNode, lightningEndPosition, lightningStartPosition) :
                Promise.resolve()
            ]).then(() => {
              resolve('')
            })

          }, animationDuration / 6 + Math.random() * (animationDuration / 2))
        })
      )
    })

    return await Promise.all([growWithLights, ...blows])
      .then(() => {
        this._removeItem(item, true)
      })
  }

  async _runPowerBomb(item: Item, bombRadius: number = 1) {
    const blows: Array<Promise<any>> = []

    window.gameAudio.play('bomb')

    // remove bomb
    this._removeItem(item, false)

    item.node.style.opacity = '0'

    const blowItems = this._gameField.getItemsInRadius(item.positionGrid, bombRadius)

    blowItems.forEach(itemToBlow => {
      const dx = itemToBlow.positionGrid[0] - item.positionGrid[0]
      const dy = itemToBlow.positionGrid[1] - item.positionGrid[1]

      blows.push(
        new Promise((resolve) => {
          setTimeout(() => {
            this._demageItem(itemToBlow, 'power')
              .then(() => {
                resolve('')
              })
          }, Math.sqrt(dx * dx + dy * dy) * 41)
        })
      )
    })

    const effectBlow = Effect.blowBomb(this._gameField.gridNode, [
        item.node.offsetLeft + item.node.clientWidth / 2,
        item.node.offsetTop + item.node.clientHeight / 2
      ],
      this._cellSizePx[0] * (bombRadius * 2 + 1)
    )

    return await Promise.all([effectBlow, ...blows])
      .then(() => {
        this._removeItem(item, true)
      })
  }

  async _runPowerRocket(item: Item) {
    // this._checkItemsGridBindings()
    // console.log('_runPowerRocket')

    const direction = item.name === 'rocket_v' ? 1 : 0
    const flySpeed: number = 700
    const gridSize = this._gameField.gridSize
    const itemPosition = item.positionGrid
    const blows: Array<Promise<any>> = []
    const positionsToBlow: Array<[number, number, number]> = []
    const flyLength =
      direction == 0 ?
        Math.max(itemPosition[0], gridSize[0] - itemPosition[0] - 1 ) :
        Math.max(itemPosition[1], gridSize[1] - itemPosition[1] - 1 )

    item.setZIndex(310)

    // get grid positions to blow with timeout
    for (let i: number = 1; i <= flyLength; i++) {
      const timeout = (i - 1) / ( flyLength + 2 ) * flySpeed

      if (direction == 0) {
        if (itemPosition[0] - i >= 0) {
          positionsToBlow.push([itemPosition[0] - i, itemPosition[1], timeout])
        }
        if (itemPosition[0] + i < gridSize[0]) {
          positionsToBlow.push([itemPosition[0] + i, itemPosition[1], timeout])
        }
      } else {
        if (itemPosition[1] - i >= 0) {
          positionsToBlow.push([itemPosition[0], itemPosition[1] - i, timeout])
        }
        if (itemPosition[1] + i < gridSize[1]) {
          positionsToBlow.push([itemPosition[0], itemPosition[1] + i, timeout])
        }
      }
    }

    positionsToBlow.forEach(posToBlow => {
      blows.push(
        new Promise((resolve) => {
          setTimeout(() => {
            const blowItem = this._gameField.getItem([posToBlow[0], posToBlow[1]])
            if (blowItem) {
              this._demageItem(blowItem, 'power')
                .then(() => {
                  resolve('')
                })
            } else {
              resolve('')
            }
          }, posToBlow[2])
        })
      )
    })

    // remove rocket, but stay node for animation
    this._removeItem(item, false)

    item.animationFlyBothSides(!direction, flyLength + 2, flySpeed)
      .then(() => {
        item._removeSelfNode()
      })

    // blows ended
    return await Promise.all(blows)
  }

  async _itemFall(item: Item) {
    if (!item.canFall) {
      return
    }

    // this._checkItemsGridBindings()
    // console.log('_itemFall')

    const modifier = this._gameField.getModifier(item.positionGrid)
    const startPosition: [number, number] = [...item.positionGrid]
    const posToFall = this._gameField.getFallPosition(item.positionGrid, modifier?.blockItem ? true : false)
    const actions: Array<Promise<any>> = []



    if (posToFall[1] != item.positionGrid[1]) {
      // change grid position, but not px
      this._gameField.moveItemOnGrid(item, posToFall)

      actions.push(
        item.animationFallToGrid(startPosition, posToFall)
      )

      if (modifier && modifier.canFall) {
        this._gameField.moveModifierOnGrid(modifier, posToFall)
        actions.push(
          modifier.animationFallToGrid(startPosition, posToFall)
        )
      }

      // change render position and item.positionGrid
      return await Promise.all(actions)
    }
  }

  async _calcFalling() {
    // this._checkItemsGridBindings()
    // console.log(`_calcFalling`)
    const gridSize = this._gameField.gridSize
    const falls: Array<Promise<any>> = []

    for (let y: number = gridSize[1] - 1; y >= 0; y--) {
      for (let x: number = 0; x < gridSize[0]; x++) {
        const item = this._gameField.getItem([x, y])
        const modifier = this._gameField.getModifier([x, y])

        if (item && item.canFall && (!this._gameField.checkItemBlocked(item) || modifier?.canFall)) {
          falls.push(this._itemFall(item))
        }
      }
    }

    return await Promise.all(falls)
      .then(() => {
        this._findPacks()
      })
  }

  async _respawn() {
    let spawners = []
    const falls: Array<Promise<any>> = []

    spawners = this._gameField.getEmptySpawners()


    if ((spawners = this._gameField.getEmptySpawners()) && spawners.length) {
      spawners.forEach(spi => {
        // how many items to respawn
        const itemsPositions = this._gameField.spawnerGetCells(spi)

        itemsPositions.forEach((newItemEndPosition, index) => {
          const newItem = this._addItem(newItemEndPosition)
          if (newItem) {
            falls.push(
              newItem.animationFallToGrid([spi[0], spi[1] - itemsPositions.length + index], newItemEndPosition)
            )
          }
        })
      })
    }

    return await Promise.all(falls)
      .then(() => {
        this._findPacks()
      })
  }

  async _fallAndRespawn() {
    console.log('Fall and respawn')

    window.gameAudio.play('fall-respawn')

    return await this._calcFalling()
      .then(() => {
        return this._respawn()
      })
      .then(() => {
        return this._shuffle()
      })
  }

  async _usePack(item: Item, itemPack: Set<Item>) {
    let action: Promise<any> | null = null

    // blow near
    const nearDamage: Array<Promise<any>> = []
    const closeItems = this._gameField.getItemsClose(itemPack)
    const color = itemPack.values()?.next()?.value?.color

    closeItems.forEach(ni => {
      const blockedItem = this._gameField.checkItemBlocked(ni)

      if (!ni.blowNear && !blockedItem) {
        return
      }

      if (!ni.color || (ni.color === color) || blockedItem) {
        nearDamage.push(this._demageItem(ni, 'near'))
      }
    })

    if (itemPack && (itemPack.size > 1) && (itemPack.size < this._powerCombosCount[0])) {
      action = this._blowPack(itemPack)
    }
    if (itemPack && (itemPack.size >= this._powerCombosCount[0])) {
      action = this._combinePack(itemPack, item.positionGrid)
    }

    if (action) {
      return Promise.all([...nearDamage, action])
    }
  }

  // blow all elements in pack
  async _blowPack(pack: Set<Item>) {
    if (!pack || pack.size < 2) {
      console.log(`ERROR can't blow empty pack`)
      return
    }

    if (pack.size >= this._powerCombosCount[0]) {
      console.log(`can't blow pack with ${ pack.size } elements`)
      return
    }

    const blows: Array<Promise<any>> = []

    window.gameAudio.play('item-blow')

    pack.forEach(item => {
      blows.push(this._demageItem(item, 'self'))
    })

    return await Promise.all(blows)
  }

  //combine into power
  async _combinePack(pack: Set<Item>, position: [number, number]) {
    let currentCombo = -1
    let itemAddName = ''

    // blow near

    if (pack.size >= this._powerCombosCount[2]) {
      // disco
      currentCombo = 2
      const color = pack.values()?.next()?.value?.color
      itemAddName = 'disco_' + color
    } else if (pack.size >= this._powerCombosCount[1]) {
      // bomb
      currentCombo = 1
      itemAddName = 'bomb'
    } else if (pack.size >= this._powerCombosCount[0]) {
      // rocket
      currentCombo = 0
      itemAddName = Math.random() < 0.5 ? 'rocket_h' : 'rocket_v'
    }

    if (currentCombo === -1) {
      return
    }

    window.gameAudio.play('combine')

    const animations: Array<Promise<any>> = []

    pack.forEach(packItem => {
      // check before removal
      this.checkTaskToLower(packItem)

      // remove from grid
      this._removeItem(packItem, false)
      this._demageItem(packItem, 'inside')


      this._score += 3

      animations.push(
        packItem.animationCombine(position, 300)
        .then(() => {
          // remove total
          this._removeItem(packItem)
        })
      )
    })

    return await Promise.all(animations)
      .then(() => {
        this._addItem(position, itemAddName)
      })
  }

  _removeItem(item: Item, nodeRemove: boolean = true) {
    // this._checkItemsGridBindings()
    // console.log('_removeItem', item, nodeRemove)

    if (item.isModifier) {
      return this._removeModifier(item)
    }
    const itemPack = this._getItemPack(item)
    if (itemPack) {
      itemPack.delete(item)

      if (itemPack.size < 2) {
        this._packs = this._packs.filter(pack => pack != itemPack)
      }
    }

    this._combos = this._combos.filter(cb => (cb[0] !== item) && (cb[1] !== item))

    this._items = this._items.filter(i => i !== item)
    this._gameField.removeItemFromField(item)

    if (nodeRemove) {
      item._removeSelfNode()
    }
  }

  _removeModifier(modifier: Item, nodeRemove: boolean = true) {
    // console.log('_removeModifier', modifier, nodeRemove)
    this._modifiers = this._modifiers.filter(i => i !== modifier)
    this._gameField.removeModifierFromField(modifier)

    if (nodeRemove) {
      modifier._removeSelfNode()
    }
  }

  async _blowItemAnimated(item: Item) {
    // create blow effect
    const effect = new Effect(
      this._gameField.gridNode,
      [
        this._cellSizePx[0] * 2,
        this._cellSizePx[1] * 2
      ])

    // don't wait blow effect finish
    effect.blow(item.getPxCenterFromGrid(), item.colorBlow ?? 'red', 400)

    if (item.typeName !== 'generator') {
      if (!item.stages || item.stageNumber === 0) {
        // check before removal
        this.checkTaskToLower(item)

        // remove but stay node
        this._removeItem(item, false)

        return await item.animationScaleDown(200)
          .then(() => {
            this._removeItem(item)
          })
      } else {
        item.lowerStage()
      }
    } else {
      this.checkTaskToLower(item)
    }
  }

  async _demageItem(item: Item, type: string = 'self') {
    // type: self / near / power / inside
    if (!item) {
      return
    }

    // this._checkItemsGridBindings()
    // console.log(`damage ${ item.name } type ${ type } at ${ item.positionGrid[0] }, ${ item.positionGrid[1] }`)

    let actions: Array<Promise<any>> = []

    if (
      ((item.blowSelf === 'hard' && type === 'power') ||
      (item.blowSelf === 'normal' && (type === 'self' || type === 'power')) ||
      (item.blowNear && type === 'near')) &&
      !this._gameField.checkItemBlocked(item)
    ) {

      if (item.typeName === 'power') {
        actions.push(this._runPower(item))
      } else {
        if (type === 'power') {
          this._score += 5
        } else {
          this._score += 3
        }

        actions.push(this._blowItemAnimated(item))
      }
    }

    const modifier = this._gameField.getModifier(item.positionGrid)
    if (
      modifier &&
      ((modifier.blowSelf === 'hard' && type === 'power') ||
      (modifier.blowSelf === 'normal' && (type === 'self' || type === 'power')) ||
      (modifier.blowNear && type === 'near') ||
      ((modifier.blowInside && (actions.length || type === 'inside'))))
    ) {
      // blow bubble only from standart items
      if (modifier.blowInside && actions.length && item.typeName !== 'item') {
        return
      }

      if (type === 'power') {
        this._score += 5
      } else {
        this._score += 3
      }

      actions.push(this._blowItemAnimated(modifier))
    }

    if (item.typeName === 'generator') {
      // generate
    }

    return await Promise.all(actions)
  }
}
