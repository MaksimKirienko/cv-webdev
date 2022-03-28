import { Item } from './Item'
import { GridBg } from './GridBg'
import { bottom } from '@popperjs/core'

type cellType = 'active' | 'spawner' | 'blank' | 'blank_block'

interface MatchCell {
  type: cellType
  noFill: boolean
  itemConnected: Item | null
  modifier: Item | null
}

export class MatchField {
  public grid: MatchCell[][] = []
  public gridSize: [number, number] = [0, 0]
  public gridNode: HTMLElement

  private _itemsData: any
  private _node: HTMLElement
  private _gridContainerNode: HTMLElement
  private _gridBg: GridBg

  private _cellSizePx: [number, number]

  constructor(node: HTMLElement, cellSizePx: [number, number], itemsData: any) {
    this._node = node
    this._itemsData = itemsData
    this._cellSizePx = cellSizePx

    this._gridContainerNode = document.createElement('div')
    this._gridContainerNode.classList.add('game-grid-container')
    this._node.append(this._gridContainerNode)

    this.gridNode = document.createElement('div')
    this.gridNode.classList.add('game-grid')
    this._gridContainerNode.append(this.gridNode)

    this._gridBg = new GridBg(this._gridContainerNode, this._cellSizePx)
  }

  initGrid(gridSize: [number, number], gridData: any) {
    let errorMessage = ''
    if (typeof gridSize === 'undefined') {
      errorMessage = `MatchGrid initGrid error: no grid size`
    }

    if (!Array.isArray(gridData) ||
      gridData.length != gridSize[0] ||
      gridData[0].length != gridSize[1]
    ) {
        errorMessage = `MatchGrid initGrid error: grid size don't match greed data`
    }

    if (errorMessage) {
      console.log(errorMessage)
      return false
    }

    this.gridSize = gridSize

    this.grid = new Array(this.gridSize[0])

    for (let x: number = 0; x < this.gridSize[0]; x++) {
      this.grid[x] = new Array(this.gridSize[1])

      for (let y: number = 0; y < this.gridSize[1]; y++) {
        if (gridData && gridData[x] && gridData[x][y]) {
          this.grid[x][y] = {
            type: gridData[x][y].type,
            noFill: gridData[x][y].noFill,
            itemConnected: null,
            modifier: null
          }
        } else {
          this.grid[x][y] = {
            type: 'active',
            noFill: gridData[x][y].noFill,
            itemConnected: null,
            modifier: null
          }
        }
      }
    }

    this._gridBg.generateGridBackground(this.grid, this.gridSize)
    this._updateSize()
  }

  _updateSize() {
    this.gridNode.style.width = this.gridSize[0] * this._cellSizePx[0] + 'px'
    this.gridNode.style.height = this.gridSize[1] * this._cellSizePx[1] + 'px'
    this._scale()
  }

  _scale(scaleFactor: number = 0) {
    if (!scaleFactor) {
      scaleFactor = Math.min(
        this._node.clientWidth / this._gridContainerNode.clientWidth,
        this._node.clientHeight / this._gridContainerNode.clientHeight
      )
    }

    this._gridContainerNode.style.transform = `translateX(-50%) translateY(-50%) scale(${scaleFactor})`
  }

  createItem(itemName: string, positionGrid: [number, number], createUnconnected: boolean = false) {
    const x: number = positionGrid[0]
    const y: number = positionGrid[1]
    let errorMessage: string = ''

    if ((typeof this.grid[x] == 'undefined') ||
        (typeof this.grid[x][y] == 'undefined')
    ) {
      return
    }

    if (this.grid[x][y].itemConnected && !createUnconnected) {
      errorMessage = `MatchField createItem error: can't add item to ${ x }, ${ y } - item already connected`
    }

    if (!['active', 'spawner'].includes(this.grid[x][y].type)) {
      errorMessage = `MatchField createItem error: can't add item to ${ x }, ${ y } - cell is type '${ this.grid[x][y].type }'`
    }

    if (typeof this._itemsData.items[ itemName ] === 'undefined') {
      errorMessage = `MatchField createItemm error: no item data for '${ itemName }'`
      return
    }
    if (errorMessage) {
      console.log(errorMessage)
      return false
    }

    const newItem = new Item(
      this.gridNode,
      positionGrid,
      this.gridSize,
      this._cellSizePx,
      itemName,
      this._itemsData.items[itemName],
      this._itemsData.itemTypes[this._itemsData.items[itemName].type],
      this._itemsData.sprites[this._itemsData.items[itemName].spriteImageFile]
    )

    if (!createUnconnected) {
      this.grid[x][y].itemConnected = newItem
    }
    return newItem
  }

  createModifier(modifierName: string, positionGrid: [number, number]) {
    const x: number = positionGrid[0]
    const y: number = positionGrid[1]
    let errorMessage: string = ''

    if ((typeof this.grid[x] == 'undefined') ||
        (typeof this.grid[x][y] == 'undefined')
    ) {
      errorMessage = `MatchField createModifier error: no cell ${ x }, ${ y } in grid`
    }

    if (this.grid[x][y].modifier) {
      errorMessage = `MatchField createModifier error: can't add item to ${ x }, ${ y } - item already connected`
    }

    if (!['active', 'spawner'].includes(this.grid[x][y].type)) {
      errorMessage = `MatchField createModifier error: can't add item to ${ x }, ${ y } - cell is type '${ this.grid[x][y].type }'`
    }

    if (typeof this._itemsData.modifiers[ modifierName ] === 'undefined') {
      errorMessage = `MatchField createModifier error: no item data for '${ modifierName }'`
    }
    if (errorMessage) {
      console.log(errorMessage)
      return false
    }

    const newModifier = new Item(
      this.gridNode,
      positionGrid,
      this.gridSize,
      this._cellSizePx,
      modifierName,
      this._itemsData.modifiers[modifierName],
      this._itemsData.modifiers[modifierName],
      this._itemsData.sprites[this._itemsData.modifiers[modifierName].spriteImageFile]
    )

    this.grid[x][y].modifier = newModifier
    return newModifier
  }

  unconnectItem(item: Item) {
    const cell = this.getCell(item.positionGrid)
    if (cell) {
      cell.itemConnected = null
    }
  }

  removeItemFromField(item: Item) {
    const cell = this.getCell(item.positionGrid)
    if (cell && cell.itemConnected === item) {
      cell.itemConnected = null
    }
  }

  removeModifierFromField(modifier: Item) {
    // console.log('remove modifier from grid', modifier)

    const cell = this.getCell(modifier.positionGrid)

    if (!cell?.modifier) {
      console.log('modifier already removed from grid')
      return
    }

    if (cell && cell.modifier === modifier) {
      cell.modifier = null
    } else {
      console.log('ERROR remove modifier from field - dont match', modifier, cell?.modifier)
    }
  }

  getCell(positionGrid: [number, number]) {
    const x = positionGrid[0]
    const y = positionGrid[1]

    if (this.grid && this.grid[x] && this.grid[x][y]) {
      return this.grid[x][y]
    } else {
      return null
    }
  }

  getItem(positionGrid: [number, number]) {
    const x = positionGrid[0]
    const y = positionGrid[1]

    if (this.grid && this.grid[x] && this.grid[x][y] && this.grid[x][y].itemConnected) {
      return this.grid[x][y].itemConnected
    } else {
      return null
    }
  }

  getModifier(positionGrid: [number, number]) {
    const x = positionGrid[0]
    const y = positionGrid[1]

    if (this.grid && this.grid[x] && this.grid[x][y] && this.grid[x][y].modifier) {
      return this.grid[x][y].modifier
    } else {
      return null
    }
  }

  checkItemBlocked(item: Item) {
    const modifier = this.getModifier(item.positionGrid)
    return modifier?.blockItem ? true : false
  }

  // change position on grid, don't move item itself on render
  moveItemOnGrid(item: Item, positionGrid: [number, number]) {
    const currentCell = this.getCell(item.positionGrid)
    const newCell = this.getActiveCell(positionGrid)

    if (!newCell || newCell.itemConnected || !currentCell) {
      console.log('Cant change item position on grid', !newCell, newCell?.itemConnected, !currentCell)
      return false
    }

    // console.log(`move item ${ item.name }`, item, currentCell, newCell)

    if (currentCell.itemConnected === item) {
      currentCell.itemConnected = null
    }
    newCell.itemConnected = item

    item.positionGrid = [...positionGrid]
  }

  moveModifierOnGrid(modifier: Item, positionGrid: [number, number]) {
    const currentCell = this.getCell(modifier.positionGrid)
    const newCell = this.getActiveCell(positionGrid)

    if (!newCell || !currentCell) {
      console.log('ERROR no current or new cell')
      return false
    }

    if (currentCell.modifier === modifier) {
      currentCell.modifier = null
    } else {
      console.log('ERROR cant fall modifier - cell connection broken')
    }

    if (!newCell.modifier) {
      newCell.modifier = modifier
    } else {
      console.log('ERROR cant fall modifier - new cell modifier already connected')
    }

    modifier.positionGrid = [...positionGrid]
  }

  getActiveCell(positionGrid: [number, number]) {
    const x = positionGrid[0]
    const y = positionGrid[1]

    if (
      this.grid &&
      this.grid[x] &&
      this.grid[x][y] &&
      ['active', 'spawner'].includes(this.grid[x][y].type)
    ) {
      return this.grid[x][y]
    } else {
      return null
    }
  }

  getFallPosition(positionGrid: [number, number], checkModifier: boolean) {
    const posToFall:[number, number] = [...positionGrid]
    let bottomCell = null

    while (
      (bottomCell = this.getCell([posToFall[0], posToFall[1] + 1])) &&
      !bottomCell.itemConnected &&
      !bottomCell.modifier?.blockItem &&
      (!bottomCell.modifier || !checkModifier) &&
      ['active', 'spawner', 'blank'].includes(bottomCell.type)
    ) {
      posToFall[1] += 1
    }

    // if in blank place, go back up
    while (
      (posToFall[1] !== positionGrid[1]) &&
      this.getCell(posToFall)?.type === 'blank'
    ) {
      posToFall[1] -= 1
    }

    return posToFall
  }

  getItemsInRadius(positionGrid: [number, number], radius: number = 1) {
    let item = null
    const items = []
    for (let x: number = positionGrid[0] - radius; x <= positionGrid[0] + radius; x++) {
      for (let y: number = positionGrid[1] - radius; y <= positionGrid[1] + radius; y++) {
        if (item = this.getItem([x, y])) {
          items.push(item)
        }
      }
    }
    return items
  }

  getItemsCross(positionGrid: [number, number]) {
    const x = positionGrid[0]
    const y = positionGrid[1]

    const items = []
    let item: Item | null = null

    if (item = this.getItem([x, y - 1])) {
      items.push(item)
    }
    if (item = this.getItem([x - 1, y])) {
      items.push(item)
    }
    if (item = this.getItem([x, y])) {
      items.push(item)
    }
    if (item = this.getItem([x + 1, y])) {
      items.push(item)
    }
    if (item = this.getItem([x, y + 1])) {
      items.push(item)
    }

    return items
  }

  getItemsClose(pack: Set<Item>) {
    // console.log('getItemsClose', pack)

    const closeItems: Set<Item> = new Set()

    pack.forEach(item => {
      const cross = this.getItemsCross(item.positionGrid)

      cross.forEach(nearItem => {
        if (!pack.has(nearItem)) {
          closeItems.add(nearItem)
        }
      })
    })

    // console.log('result', closeItems)
    return closeItems
  }

  getEmptySpawners() {
    const spawners:[number, number][] = []
    let cell = null

    for (let x: number = 0; x < this.gridSize[0]; x++) {
      for (let y: number = 0; y < this.gridSize[1]; y++) {
        if (
          (cell = this.getActiveCell([x, y])) &&
          cell.type === 'spawner' &&
          !cell.itemConnected
        ) {
          spawners.push([x, y])
        }
      }
    }

    return spawners
  }

  spawnerGetCells(positionGrid: [number, number]) {
    // const posToFall:[number, number] = [...positionGrid]
    const posToFall = this.getFallPosition(positionGrid, false)
    const spawnCells:[number, number][] = []

    const currentCell = this.getCell(positionGrid)

    // nothing to spawn
    if (currentCell?.itemConnected ||
      !['active', 'spawner'].includes(currentCell?.type || '')
    ) {
      return []
    }

    while ((posToFall[1] >= positionGrid[1])) {
      const cell = this.getCell(posToFall)

      if (cell && cell.type !== 'blank') {
        spawnCells.push([...posToFall])
      }
      posToFall[1] -= 1
    }

    return spawnCells.reverse()
  }
}
