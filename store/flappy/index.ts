import type { MutationTree } from 'vuex'

export interface gameState {
  game: any
}

export const state = () => ({
  gameState: {} as gameState,
  stage: 'rules'
})

export type FlappyState = ReturnType<typeof state>

export const mutations: MutationTree<FlappyState> = {
  setFlappyGame(state: FlappyState, gameObject) {
    if (gameObject) {
      state.gameState.game = gameObject
    }
  },
  setStage(state: FlappyState, stage: string) {
    if (stage) {
      state.stage = stage
    }
  }
}
