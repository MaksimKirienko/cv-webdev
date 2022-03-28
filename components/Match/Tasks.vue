<template>
  <section class="tasks">
    <MatchPageTop title="Мои задания">
      <div class="lives" slot="topRight">{{ attempts }}</div>
    </MatchPageTop>
    <div class="tasks-list">
      <!-- <div class="tasks-list-subtitle">Активные</div> -->
      <!-- <div class="tasks-list-subtitle">
        Задания отключены.
        <br>
        Действие акции закончилось, но по вашим просьбам мы продлили доступ к игре
      </div> -->
      <div
        v-for="t in tasks.filter(t => !t.done)"
        :key="'active-' + t.id"
        class="tasks-item"
        :class="[getColorClass(t)]"
      >
        <div class="tasks-limit" :class="[getColorClass(t)]" >
          <!-- {{ getLimitText(t) }} -->
          неактивно
        </div>
        <div class="tasks-item-content">
          <div class="tasks-item-title">{{ t.name }}</div>
          <div class="tasks-item-text" v-html="t.message" />
        </div>
        <!-- <div class="tasks-item-bottom">
          <div @click="goLink(t.btn_link, t.event)" class="btn btn-red">{{ t.btn_name }}</div>
          <div class="tasks-heart">+{{ t.reward }}</div>
        </div> -->
      </div>

      <div v-if="tasks.filter(t => t.done).length" class="tasks-list-subtitle">Завершенные</div>
      <div
        v-for="t in tasks.filter(t => t.done)"
        :key="'complete-' + t.id"
        class="tasks-item-complete"
        :class="[getColorClass(t)]"
      >
        {{ t.done_message }}
      </div>
    </div>
  </section>
</template>

<script>
import { apiGetMissions } from '~/scripts/Match2/api/api.js'
import { sendAppMessage } from '~/scripts/Match2/lib.js'

export default {
  data() {
    return {
      tasks: []
    }
  },
  // watch: {
  //   token() {
  //     if (!this.tasks || !this.tasks.length) {
  //       this.getTasks()
  //     }
  //   }
  // },
  computed: {
    attempts() {
      return this.$store.state.match.profile.attempts ?? ''
    },
    profile() {
      return this.$store.state.match.profile
    },
    token() {
      return this.$store.state.match.token
    },
    pending: {
      get() {
        return window?.pending?.tasks
      },
      set(val) {
        if (!window) {
          return false
        }
        if (typeof window.pending === 'undefined') {
          window.pending = {}
        }
        window.pending.tasks = val
      }
    }
  },
  mounted() {
    // this.$store.commit('match/resetProfileTimestamp')

    // gameAudio.play('music_menu')
    if (!this.tasks || !this.tasks.length) {
      this.getTasks()
    }
  },
  methods: {
    goLink(link, event) {
      if (event && event.trim()) {
        sendAppMessage(event.trim())
      }
      this.$store.commit('match/setLeaveLink', link)
    },
    getTasks() {
      if (!this.token || this.pending) {
        return
      }

      this.pending = true

      apiGetMissions(this.token)
      .then(data => {
        this.pending = false

        if (data && data.length) {
          this.tasks = data
        }
      })
      .catch((e) => {
        this.pending = false
        this.$store.commit('match/setServerError', e)
      })
    },
    getColorClass(task) {
      return 'gray'
      // ---
      if (task.again) {
        return 'green'
      } else {
        return 'orange'
      }
      // if (task.limit == 'nolimit' || task.limit == 'once') {
      //   return 'green'
      // } else {
      //   return 'orange'
      // }
    },
    getLimitText(task) {
      if (parseInt(task.again)) {
        return `Неограниченно`
      } else {
        return `Один раз`
      }
      // } else {
      //   return `Осталось: ${ task.limit ?? 0 } раз${ task.limit > 0 && task.limit < 5 ? 'а' : ''}`
      // }
    }
  }
}
</script>

<style lang="scss">
.tasks {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #F8F8F8;
}

// .ios {
//   .tasks {
//     height: -webkit-fill-available;
//   }
// }

.tasks-list {
  overflow: auto;
  box-sizing: border-box;
  padding: 10px 11px;
}

.tasks-list-subtitle {
  margin: 14px 0;
  font-size: 14px;
  color: #333;
}

.tasks-item {
  position: relative;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  padding: 8px 7px 7px 21px;
  box-sizing: border-box;
  margin: 9px 0;

  &.green::before, &.orange::before {
    position: absolute;
    left: 6px;
    top: 10px;
    width: 7px;
    height: calc(100% - 20px);
    content: '';
    border-radius: 37px;
  }

  &.green::before {
    background: #98C21F;
  }

  &.orange::before {
    background: #FFAD26;
  }
}

.tasks-limit {
  position: absolute;
  right: 7px;
  top: 12px;
  min-width: 90px;
  font-weight: 800;
  font-size: 9px;
  line-height: 100%;
  background: #98C21F;
  border-radius: 6px;
  color: #fff;
  padding: 3px 6px 2px 6px;
  box-sizing: border-box;
  text-align: center;

  &.gray {
    background: #c0c0c0;
  }

  &.orange {
    background: #FFAD26;
  }
}

.tasks-item-content {
  padding-right: 94px;
}

.tasks-item-title {
  font-weight: 800;
  font-size: 15px;
  color: #000;
}

.tasks-item-text {
  font-weight: 400;
  font-size: 13px;
  color: #000;
  margin-top: 4px;
}

.tasks-item-bottom {
  margin-top: 9px;

  .btn {
    min-width: 120px;
    font-size: 13px;
    padding: 7px 12px;
    border-radius: 7px;
    margin: 4px 5px 4px 0;
    box-sizing: border-box;

    &:last-child {
      margin-right: 0;
    }
  }
}

.tasks-heart {
  position: absolute;
  right: 16px;
  bottom: 10px;
  width: 30px;
  height: 25px;
  color: #fff;
  font-size: 17px;
  line-height: 100%;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.94);
  -webkit-text-stroke: 1px #000;
  background-image: url('~/assets/i/match/profile/heart.svg?inline');
  padding: 10px 0 0 14px;
  box-sizing: border-box;
  background-repeat: no-repeat;
}

.tasks-item-complete {
  position: relative;
  min-height: 54px;
  display: flex;
  align-items: center;
  margin: 5px 0;
  background: linear-gradient(150deg, #26BF0D 0%, #A7DD0F 100%);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  color: #fff;
  padding: 10px 78px 10px 14px;
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 14px;
    right: 15px;
    width: 31px;
    height: 25px;
    background: url('~/assets/i/match/icons/v.svg?inline');
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
