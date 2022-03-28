export class GridBg {
  public gridSize: [number, number] = [0, 0]
  private _cellSizePx: [number, number]
  private _gridBgNode: HTMLCanvasElement
  public grid: any = []

  constructor(gridContainerNode: HTMLElement, cellSizePx: [number, number]) {
    this._cellSizePx = cellSizePx

    this._gridBgNode = document.createElement('canvas')
    this._gridBgNode.classList.add('game-grid-bg')
    gridContainerNode.append(this._gridBgNode)
  }

  _checkActiveCell(x: number, y: number) {
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

  generateGridBackground(grid: any, gridSize:[number, number]) {
    this.grid = grid
    this.gridSize = gridSize

    // render on canvas once
    let canv = document.createElement('canvas')
    let ctx = canv.getContext('2d')
    const offsetX: number = 7
    const offsetY: number = 12
    const sizeX = this.gridSize[0] * this._cellSizePx[0] + offsetX * 3
    const sizeY = this.gridSize[1] * this._cellSizePx[1] + offsetY * 3

    if (!ctx) {
      return
    }

    canv.style.width = sizeX + 'px'
    canv.style.height = sizeY + 'px'
    canv.width = sizeX * 3
    canv.height = sizeY * 3

    ctx.scale(3, 3)

    ctx.lineJoin = 'round'

    // create main bg without border
    for (let x: number = 0; x < this.gridSize[0]; x++) {
      for (let y: number = 0; y < this.gridSize[1]; y++) {
        if (this._checkActiveCell(x, y)) {
          ctx.beginPath()
          ctx.lineWidth = 20
          ctx.fillStyle = 'rgba(110, 45, 187, 1)' // 'rgba(0, 0, 0, 1)'
          ctx.strokeStyle = 'rgba(110, 45, 187, 1)' // 'rgba(0, 0, 0, 1)'
          ctx.rect(
            offsetX + x * this._cellSizePx[0] + 7, offsetY + y * this._cellSizePx[1] + 2,
            this._cellSizePx[0] - 14, this._cellSizePx[1] - 8
          )
          ctx.fill()
          ctx.stroke()
          ctx.closePath()

          ctx.beginPath()
          ctx.lineWidth = 10
          ctx.fillStyle = 'transparent'
          // ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)'
          // inner arc tl
          if (!this._checkActiveCell(x + 1, y) && this._checkActiveCell(x + 1, y - 1)) {
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] - 2, offsetY + y * this._cellSizePx[1] + 14)
            ctx.quadraticCurveTo(
              offsetX + (x + 1) * this._cellSizePx[0] - 2, offsetY + y * this._cellSizePx[1] - 1,
              offsetX + (x + 1) * this._cellSizePx[0] + 13, offsetY + y * this._cellSizePx[1] - 1)
            ctx.stroke()
          }
          // inner arc tr
          if (!this._checkActiveCell(x - 1, y) && this._checkActiveCell(x - 1, y - 1)) {
            ctx.moveTo(offsetX + x * this._cellSizePx[0] - 13, offsetY + y * this._cellSizePx[1] - 1)
            ctx.quadraticCurveTo(
              offsetX + x * this._cellSizePx[0] + 2, offsetY + y * this._cellSizePx[1] - 1,
              offsetX + x * this._cellSizePx[0] + 2, offsetY + y * this._cellSizePx[1] + 14)
            ctx.stroke()
          }
          // inner arc br
          if (!this._checkActiveCell(x - 1, y) && this._checkActiveCell(x - 1, y + 1)) {
            ctx.moveTo(offsetX + x * this._cellSizePx[0] + 2, offsetY + (y + 1) * this._cellSizePx[1] - 18)
            ctx.quadraticCurveTo(
              offsetX + x * this._cellSizePx[0] + 2, offsetY + (y + 1) * this._cellSizePx[1] - 3,
              offsetX + x * this._cellSizePx[0] - 13, offsetY + (y + 1) * this._cellSizePx[1] - 3)
            ctx.stroke()
          }
          // inner arc bl
          if (!this._checkActiveCell(x + 1, y) && this._checkActiveCell(x + 1, y + 1)) {
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] + 13, offsetY + (y + 1) * this._cellSizePx[1] - 3)
            ctx.quadraticCurveTo(
              offsetX + (x + 1) * this._cellSizePx[0] - 2, offsetY + (y + 1) * this._cellSizePx[1] - 3,
              offsetX + (x + 1) * this._cellSizePx[0] - 2, offsetY + (y + 1) * this._cellSizePx[1] - 18)
            ctx.stroke()
          }
          // vertical line
          if (this._checkActiveCell(x, y + 1)) {
            ctx.moveTo(offsetX + x * this._cellSizePx[0] + 2, offsetY + (y + 1) * this._cellSizePx[1] - 15)
            ctx.lineTo(offsetX + x * this._cellSizePx[0] + 2, offsetY + (y + 1) * this._cellSizePx[1] + 15)
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] - 2, offsetY + (y + 1) * this._cellSizePx[1] - 15)
            ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] - 2, offsetY + (y + 1) * this._cellSizePx[1] + 15)
            ctx.stroke()
          }
          // horizontal line
          if (this._checkActiveCell(x + 1, y)) {
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] - 15, offsetY + y * this._cellSizePx[1] - 3)
            ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] + 15, offsetY + y * this._cellSizePx[1] - 3)
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] - 15, offsetY + (y + 1) * this._cellSizePx[1] - 1)
            ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] + 15, offsetY + (y + 1) * this._cellSizePx[1] - 1)
            ctx.stroke()
          }

          ctx.closePath()
        }
      }
    }

    // copy bg with opacity
    const destCtx = this._gridBgNode.getContext('2d')
    if (!destCtx) {
       return
    }

    this._gridBgNode.style.width = sizeX + "px";
    this._gridBgNode.style.height = sizeY + "px";
    this._gridBgNode.width = sizeX * 3
    this._gridBgNode.height = sizeY * 3
    destCtx.scale(3, 3)
    destCtx.globalAlpha = 0.65
    destCtx.drawImage(canv, 0, 0, sizeX, sizeY)
    destCtx.globalAlpha = 1

    canv = this._gridBgNode
    ctx = destCtx

    // borders
    for (let x: number = 0; x < this.gridSize[0]; x++) {
      for (let y: number = 0; y < this.gridSize[1]; y++) {
        if (this._checkActiveCell(x, y)) {
          // inner arc tl
          if (!this._checkActiveCell(x + 1, y) && this._checkActiveCell(x + 1, y - 1)) {
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + y * this._cellSizePx[1] + 13)
            ctx.quadraticCurveTo(
              offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + y * this._cellSizePx[1] + 5,
              offsetX + (x + 1) * this._cellSizePx[0] + 12, offsetY + y * this._cellSizePx[1] + 5)
          }
          // inner arc tr
          if (!this._checkActiveCell(x - 1, y) && this._checkActiveCell(x - 1, y - 1)) {
            ctx.moveTo(offsetX + x * this._cellSizePx[0] - 12, offsetY + y * this._cellSizePx[1] + 5)
            ctx.quadraticCurveTo(
              offsetX + x * this._cellSizePx[0] - 4, offsetY + y * this._cellSizePx[1] + 5,
              offsetX + x * this._cellSizePx[0] - 4, offsetY + y * this._cellSizePx[1] + 13)
            ctx.stroke()
          }
          // inner arc br
          if (!this._checkActiveCell(x - 1, y) && this._checkActiveCell(x - 1, y + 1)) {
            ctx.moveTo(offsetX + x * this._cellSizePx[0] - 4, offsetY + (y + 1) * this._cellSizePx[1] - 17)
            ctx.quadraticCurveTo(
              offsetX + x * this._cellSizePx[0] - 4, offsetY + (y + 1) * this._cellSizePx[1] - 9,
              offsetX + x * this._cellSizePx[0] - 12, offsetY + (y + 1) * this._cellSizePx[1] - 9)
            ctx.stroke()
          }
          // inner arc bl
          if (!this._checkActiveCell(x + 1, y) && this._checkActiveCell(x + 1, y + 1)) {
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] + 12, offsetY + (y + 1) * this._cellSizePx[1] - 9)
            ctx.quadraticCurveTo(
              offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + (y + 1) * this._cellSizePx[1] - 9,
              offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + (y + 1) * this._cellSizePx[1] - 17)
            ctx.stroke()
          }

          // outer arc tl
          if (!this._checkActiveCell(x - 1, y) && !this._checkActiveCell(x - 1, y - 1) && !this._checkActiveCell(x, y - 1)) {
            ctx.moveTo(offsetX + x * this._cellSizePx[0] - 4, offsetY + y * this._cellSizePx[1] + 2)
            ctx.quadraticCurveTo(
              offsetX + x * this._cellSizePx[0] - 4, offsetY + y * this._cellSizePx[1] - 9,
              offsetX + x * this._cellSizePx[0] + 7, offsetY + y * this._cellSizePx[1] - 9)
          }
          // outer arc tr
          if (!this._checkActiveCell(x + 1, y) && !this._checkActiveCell(x + 1, y - 1) && !this._checkActiveCell(x, y - 1)) {
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] - 7, offsetY + y * this._cellSizePx[1] - 9)
            ctx.quadraticCurveTo(
              offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + y * this._cellSizePx[1] - 9,
              offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + y * this._cellSizePx[1] + 2)
          }
          // outer arc br
          if (!this._checkActiveCell(x + 1, y) && !this._checkActiveCell(x + 1, y + 1) && !this._checkActiveCell(x, y + 1)) {
            ctx.moveTo(offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + (y + 1) * this._cellSizePx[1] - 6)
            ctx.quadraticCurveTo(
              offsetX + (x + 1) * this._cellSizePx[0] + 4, offsetY + (y + 1) * this._cellSizePx[1] + 5,
              offsetX + (x + 1) * this._cellSizePx[0] - 7, offsetY + (y + 1) * this._cellSizePx[1] + 5)
          }
          // outer arc bl
          if (!this._checkActiveCell(x - 1, y) && !this._checkActiveCell(x - 1, y + 1) && !this._checkActiveCell(x, y + 1)) {
            ctx.moveTo(offsetX + x * this._cellSizePx[0] + 7, offsetY + (y + 1) * this._cellSizePx[1] + 5)
            ctx.quadraticCurveTo(
              offsetX + x * this._cellSizePx[0] - 4, offsetY + (y + 1) * this._cellSizePx[1] + 5,
              offsetX + x * this._cellSizePx[0] - 4, offsetY + (y + 1) * this._cellSizePx[1] - 6)
          }

          // top line
          if (!this._checkActiveCell(x, y - 1)) {
            const py = offsetY + y * this._cellSizePx[1] - 9

            if (this._checkActiveCell(x - 1, y) && !this._checkActiveCell(x - 1, y - 1)) {
              ctx.moveTo(offsetX + x * this._cellSizePx[0] - 2, py)
            } else if (this._checkActiveCell(x - 1, y - 1)) {
              ctx.moveTo(offsetX + x * this._cellSizePx[0] + 10, py)
            } else {
              ctx.moveTo(offsetX + x * this._cellSizePx[0] + 7, py)
            }

            if (this._checkActiveCell(x + 1, y) && !this._checkActiveCell(x + 1, y - 1)) {
              // long line
              ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] - 2, py)
            } else if (this._checkActiveCell(x + 1, y - 1)) {
              // inner arc
              ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] - 12, py)
            } else {
              // outer arc
              ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] - 6, py)
            }
          }

          // right line
          if (!this._checkActiveCell(x + 1, y)) {
            const px = offsetX + (x + 1) * this._cellSizePx[0] + 4

            if (this._checkActiveCell(x, y - 1) && !this._checkActiveCell(x + 1, y - 1)) {
              ctx.moveTo(px, offsetY + y * this._cellSizePx[1] - 2)
            } else if (this._checkActiveCell(x + 1, y - 1)) {
              ctx.moveTo(px, offsetY + y * this._cellSizePx[1] + 13)
            } else {
              ctx.moveTo(px, offsetY + y * this._cellSizePx[1] + 2)
            }

            if (this._checkActiveCell(x, y + 1) && !this._checkActiveCell(x + 1, y + 1)) {
              // long right
              ctx.lineTo(px, offsetY + (y + 1) * this._cellSizePx[1] - 2)
            } else if (this._checkActiveCell(x + 1, y + 1)) {
              // inner arc
              ctx.lineTo(px, offsetY + (y + 1) * this._cellSizePx[1] - 17)
            } else {
              // outer arc
              ctx.lineTo(px, offsetY + (y + 1) * this._cellSizePx[1] - 6)
            }
          }

          // bottom line
          if (!this._checkActiveCell(x, y + 1)) {
            const py = offsetY + (y + 1) * this._cellSizePx[1] + 5

            if (this._checkActiveCell(x - 1, y) && !this._checkActiveCell(x - 1, y + 1)) {
              ctx.moveTo(offsetX + x * this._cellSizePx[0] - 2, py)
            } else if (this._checkActiveCell(x - 1, y + 1)) {
              ctx.moveTo(offsetX + x * this._cellSizePx[0] + 10, py)
            } else {
              ctx.moveTo(offsetX + x * this._cellSizePx[0] + 7, py)
            }

            if (this._checkActiveCell(x + 1, y) && !this._checkActiveCell(x + 1, y + 1)) {
              // long line
              ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] - 2, py)
            } else if (this._checkActiveCell(x + 1, y + 1)) {
              // inner arc
              ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] - 12, py)
            } else {
              // outer arc
              ctx.lineTo(offsetX + (x + 1) * this._cellSizePx[0] - 7, py)
            }
          }

          // left line
          if (!this._checkActiveCell(x - 1, y)) {
            const px = offsetX + x * this._cellSizePx[0] - 4

            if (this._checkActiveCell(x, y - 1) && !this._checkActiveCell(x - 1, y - 1)) {
              ctx.moveTo(px, offsetY + y * this._cellSizePx[1] - 2)
            } else if (this._checkActiveCell(x - 1, y - 1)) {
              ctx.moveTo(px, offsetY + y * this._cellSizePx[1] + 13)
            } else {
              ctx.moveTo(px, offsetY + y * this._cellSizePx[1] + 2)
            }

            if (this._checkActiveCell(x, y + 1) && !this._checkActiveCell(x - 1, y + 1)) {
              // long line
              ctx.lineTo(px, offsetY + (y + 1) * this._cellSizePx[1] - 2)
            } else if (this._checkActiveCell(x - 1, y + 1)) {
              // inner arc
              ctx.lineTo(px, offsetY + (y + 1) * this._cellSizePx[1] - 17)
            } else {
              ctx.lineTo(px, offsetY + (y + 1) * this._cellSizePx[1] - 6)
            }
          }
        }
      }
    }

    ctx.lineWidth = 3
    ctx.strokeStyle = '#aaa' // '#18A04E'
    ctx.stroke()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#fff' // '#1CBD5C'
    ctx.stroke()
  }
}
