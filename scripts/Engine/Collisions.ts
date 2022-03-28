import { Vector, Polygon, Collider2d } from 'collider2d'
import { GameObject } from '~/scripts/Engine'

export class Collider {
  public collider2d: Collider2d

  constructor() {
    this.collider2d = new Collider2d()
  }

  rectanglesSimple(r1: GameObject, r2: GameObject) {
    return r1.x < r2.x + r2.width &&
          r1.x + r1.width > r2.x &&
          r1.y < r2.y + r2.height &&
          r1.y + r1.height > r2.y
  }

  polygonFromRectangleGameObject(r: GameObject) {
    if ((r as any).collissionPolygon) {
      return new Polygon(new Vector(0, 0), (r as any).collissionPolygon.points)
        // .rotate(-r.contaner.rotation)
        .setOffset(new Vector(r.contaner.x, r.contaner.y))
    }

    return new Polygon(new Vector(0, 0), [
      (new Vector(-r.contaner.pivot.x, -r.contaner.pivot.y)),
      (new Vector(r.contaner.width - r.contaner.pivot.x, -r.contaner.pivot.y)),
      (new Vector(r.contaner.width - r.contaner.pivot.x, r.contaner.height - r.contaner.pivot.y)),
      (new Vector(-r.contaner.pivot.x, r.contaner.height - r.contaner.pivot.y))
    ])
      // .rotate(r.contaner.rotation)
      .setOffset(new Vector(r.contaner.x, r.contaner.y))
  }

  rectangles(r1: GameObject, r2: GameObject) {
    const polygon1 = this.polygonFromRectangleGameObject(r1)
    const polygon2 = this.polygonFromRectangleGameObject(r2)

    return this.collider2d.testPolygonPolygon(polygon1, polygon2, true)
  }
}
