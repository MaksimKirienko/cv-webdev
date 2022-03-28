<template>
  <section class="match-task">
    <div class="match-task-round" :class="{ anycolor: task.anycolor }">
      <div ref="taskItem" class="match-task-item" :class="[`match-task-${ task.itemName }`]" />
    </div>
    <div v-if="task.count" class="match-task-count">
      {{ task.count }}
    </div>
    <div v-if="!task.count" class="match-task-star-place">
      <div class="match-task-star" />
    </div>
  </section>
</template>

<script>
import { Sprite } from '~/scripts/Match2/Sprite'

export default {
  props: {
    task: {
      type: Object,
      require: true
    },
    itemsData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      sprite: null,
      starAchived: false
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    task() {
      this.init()
    },
    count(val) {
      if (val == 0 && !this.starAchived) {
        this.starAchived = true
        gameAudio.play('star-small')
      }
    }
  },
  computed: {
    count() {
      return this.task.count
    }
  },
  methods: {
    init() {
      if (!this.itemsData || !this.task.itemName) {
        return
      }

      const itemData = this.itemsData.items[this.task.itemName] ||
        this.itemsData.modifiers[this.task.itemName]

      if (!itemData) {
        return
      }

      const spriteData = this.itemsData.sprites[itemData.spriteImageFile]

      let spriteAnimations = {}

      if (itemData.stages) {
        spriteAnimations = itemData.stages[itemData.stages.length - 1].spriteAnimations
      } else {
        spriteAnimations = itemData.spriteAnimations
      }

      this.sprite = new Sprite(
        this.$refs.taskItem,
        itemData.spriteImageFile,
        spriteData.frameSize,
        spriteData.imageSize,
        spriteAnimations
      )

      if (spriteAnimations.task) {
        this.sprite.setFrame('task')
        this.$refs.taskItem.classList.add('special')
      }
    }
  }
}
</script>

<style lang="scss">
.match-task {
  width: 48px;
  height: 48px;
  position: relative;
  padding: 7px;
  margin: 0;
}

.match-task-round {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(150deg, #26BB97 0%, #198269 100%);
  border: 3px solid #fff;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.33);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  &.anycolor::after {
    content: '';
    position: absolute;
    top: 11px;
    right: 7px;
    width: 26px;
    height: 24px;
    background-image: url('~/assets/i/match/icons/anycolor.svg?inline');
    background-repeat: no-repeat;
  }
}

.match-task-item {
  position: relative;
  top: 6%;
  width: 76%;
  height: 76%;
  image-rendering: -webkit-optimize-contrast;

  &.special {
    width: 100%;
    height: 100%;
  }
}

.match-task-count {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 26px;
  text-align: center;
  font-weight: 900;
  font-size: 22px;
  line-height: 100%;
  color: #FFCC16;
  -webkit-text-stroke: 1px #103151;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 1);
}

.match-task-star-place {
  position: absolute;
  right: 2px;
  bottom: 4px;
  width: 22px;
  height: 22px;
  background-image: url('~/assets/i/match/icons/star-g.svg?inline');
}

.match-task-star {
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform: translate(100px, -160px) scale(4.5);
  // opacity: 0;
  background-image: url('~/assets/i/match/icons/star.svg?inline');
  opacity: 1;
  animation: star-appear-score .8s cubic-bezier(0.195, 0.180, 0.775, 0.000) forwards;

  &.active {
    opacity: 1;
    animation: star-appear-score .8s cubic-bezier(0.195, 0.180, 0.775, 0.000) forwards;
  }
}

@keyframes star-appear-score {
  0% {
    transform: translate(100px, -160px) scale(5);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1));
  }
  100% {
    transform: translate(0, 0) scale(1);
    filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.5));
  }
}
</style>
