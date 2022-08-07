window.onload = () => {
  //sounds//
  /**
   * erros:
   * ao mudar de task muda sessao pra zero
   * problema encontrado no define properties
   *
   * resolve:
   * deve criar uma session que não seja pra cada task mas sim
   * universal pra cada usuario onde reseta com o reset
   */
  const buttonSound = new Audio('/assets/songs/button-sound.mp3')
  const sdBtnStart = new Audio('/assets/songs/start.mp3')
  const sdBtnStop = new Audio('/assets/songs/stop.mp3')
  const sdBtnSkip = new Audio('/assets/songs/skip.wav')
  const sdComplete = new Audio('/assets/songs/complete.mp3')
  const sdChangeMode = new Audio('/assets/songs/changeMode.mp3')
  const sdEdit1 = new Audio('/assets/songs/edit1.mp3')
  const sdEdit2 = new Audio('/assets/songs/edit2.mp3')

  const btnPomodoro = document.getElementById('js-pomodoro')
  const modeButtons = document.querySelector('.js-mode-buttons')
  const modeButtons2 = document.querySelector('.js-mode-buttons2')
  const mainButton = document.querySelector('#js-btn span')
  const mainButtonBtn = document.querySelector('#js-btn')
  const skipBtn = document.getElementById('skipBtn')
  const working = document.querySelector('#working')
  const addTodayPomodorie = document.getElementById(
    'addTodayPomodorie'
  )
  const addTodayPomodorieInput = document.getElementById(
    'addTodayPomodorieInput'
  )
  const resetPomodories = document.getElementById('resetPomodories')
  const resetPomodoriesInput = document.getElementById(
    'resetPomodorieInput'
  )
  const deletePomodories = document.getElementById(
    'deletePomodories'
  )
  const deletePomodoriesInput = document.getElementById(
    'deletePomodorieInput'
  )
  const btnResetPomodories = document.getElementById(
    'btnResetPomodorie'
  )
  const tasks = document.querySelectorAll('.task')
  const workingPomodories = document.getElementById(
    'workingPomodories'
  )
  const workingRealized = document.getElementById('workingRealized')
  const workingSession = document.getElementById('workingSession')
  const timerEndIn = document.getElementById('timerEndIn')
  const timerEndInHour = document.getElementById('timerEndInHour')
  const timerEndInMinutes = document.getElementById(
    'timerEndInMinutes'
  )
  const timerEndInSession = document.getElementById(
    'timerEndInSession'
  )
  const myVideo = document.getElementById('myVideo')
  const srcBackground = document.getElementById('srcBackground')
  const containerTimer = document.getElementById('container_timer')
  const balancePostive = document.getElementById('balancePositive')
  const balanceNegative = document.getElementById('balanceNegative')
  class Pomodoro {
    interval
    timer

    constructor(
      pomodoro = 25,
      shortBreak = 5,
      longBreak = 15,
      longBreakInterval = 4,
      sessions = 0,
      dinner = 30
    ) {
      this.timer = {
        pomodoroMs: pomodoro * 60000,
        shortBreakMs: shortBreak * 60000,
        longBreakMs: longBreak * 60000,
        dinnerMs: dinner * 60000,
        pomodoro: pomodoro,
        shortBreak: shortBreak,
        longBreak: longBreak,
        dinner: dinner,
        longBreakInterval: longBreakInterval,
        sessions: sessions,
        balanceTime: {
          balance_: 0,
        },
      }
      Object.defineProperties(this.timer.balanceTime, {
        balance: {
          set: function (e) {
            if (typeof e === 'stop') {
              //iniciar relogio
            }
            if (typeof e === 'number') this.balance_ = e
            function format(n) {
              n = Number(n)
              var h = Math.floor(n / 3600)
              var m = Math.floor((n % 3600) / 60)
              var s = Math.floor((n % 3600) % 60)

              var hDisplay = h > 0 ? h + 'h' : ''
              var mDisplay = m > 0 ? m + 'm' : ''
              var sDisplay =
                s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
              return hDisplay + mDisplay
            }
            if (e > 0) {
              balancePostive.style.color =
                'rgba(105, 246, 224, 0.7)'
              balanceNegative.style.color = 'rgba(0, 0, 0, 0)'

              balancePostive.innerHTML = format(e) + '+'
            } else if (e < 0) {
              balanceNegative.style.color =
                'rgba(255, 148, 54, 0.7)'
              balancePostive.style.color = 'rgba(0, 0, 0, 0)'
              balanceNegative.innerHTML = '-' + format(Math.abs(e))
            } else {
              balanceNegative.style.color =
                'rgba(255, 148, 54, 0.7)'
              balancePostive.style.color =
                'rgba(105, 246, 224, 0.7)'
              balancePostive.innerHTML = '-'
              balanceNegative.innerHTML = '-'
            }
          },
        },
      })
      // Object.defineProperty(this.timer, 'sessions', {
      //   get: function () {
      //     if (workingSession.value) {
      //       return parseInt(workingSession.value)
      //     } else {
      //       return sessions
      //     }
      //   },
      //   set: function (e) {
      //     // if (workingSession.value) {
      //     //   const n = parseInt(workingSession.value)
      //     //   return (workingSession.value = n + 1)
      //     // } else {
      //     //   return sessions++
      //     // }
      //   },
      // })
    }

    endsIn() {
      const notCompleted = []
      let isEnd
      for (let task of tasks) {
        const idTask = task.getAttribute('_id')
        const estimed = document.getElementById(
          `tasksPomodories_${idTask}`
        )
        const realized = document.getElementById(
          `tasksRealized_${idTask}`
        )
        if (realized < estimed) notCompleted.push(idTask)
      }
      if (notCompleted.length === 1) isEnd = notCompleted[0]

      let totalMinutes = 0
      for (let task of tasks) {
        const idTask = task.getAttribute('_id')
        const estimed = parseInt(
          document.getElementById(`tasksPomodories_${idTask}`)
            .textContent
        )
        const realized = parseInt(
          document.getElementById(`tasksRealized_${idTask}`)
            .textContent
        )
        let End = false
        if (isEnd) if (isEnd === idTask) End = true
        totalMinutes =
          totalMinutes + this.calculesEnd(estimed, realized, End)
      }
      const date = new Date()

      // date.setHours(date.getHours + totalMinutes / 60)
      // date.setMinutes(date.getMinutes + (totalMinutes / 60) * 10)
      date.setTime(date.getTime() + totalMinutes * 60000)
      this.timer.endsIn = date
      this.showEndsIn()
    }
    showEndsIn(adjustTimer = 0, update, ghost) {
      let date_ = this.timer.endsIn
      let date = new Date(date_)
      if (adjustTimer !== 0) {
        date.setTime(date.getTime() + adjustTimer)
        if (update) this.timer.endsIn = date
      }
      if (ghost) return
      let hh = date.getHours()
      let mm = date.getMinutes()
      let ss = date.getSeconds()

      let sessiont = 'AM'
      if (hh == 0) {
        hh = 12
      }
      if (hh > 12) {
        hh = hh - 12
        sessiont = 'PM'
      }
      hh = hh < 10 ? '0' + hh : hh
      mm = mm < 10 ? '0' + mm : mm

      timerEndInHour.textContent = hh
      timerEndInMinutes.textContent = mm
      timerEndInSession.textContent = sessiont
    }
    calculesEnd(estimed, realized, isntLastShort) {
      const pauses = []
      let MinutoFocus = (estimed - realized) * this.timer.pomodoro

      if (MinutoFocus < 0) MinutoFocus = 0
      let estimedStops = estimed
      if (!isntLastShort) estimedStops--
      if (isntLastShort) estimedStops++
      let s = realized
      while (estimedStops > s) {
        s++
        s % this.timer.longBreakInterval
          ? pauses.push('s') // false
          : pauses.push('l') // true
      }
      let minutosStop = 0
      for (let i in pauses) {
        if (pauses[i] === 'l') minutosStop += this.timer.longBreak
        if (pauses[i] === 's') minutosStop += this.timer.shortBreak
      }
      const minutosTotal = minutosStop + MinutoFocus
      // const date = new Date()
      // date.setMinutes(date.getMinutes() + minutosTotal)
      return minutosTotal
    }
    updateEndIn() {}
    getRemainingTime(endTime) {
      const currentTime = Date.parse(new Date())
      const difference = endTime - currentTime

      const total = Number.parseInt(difference / 1000, 10)

      const minutes = Number.parseInt((total / 60) % 60, 10)
      const seconds = Number.parseInt(total % 60, 10)

      return {
        total,
        minutes,
        seconds,
      }
    }

    resetPomodories() {
      const tasksDiary = []
      const tasksCommom = []
      let isTasksDiary = false
      let isTasksCommom = false
      for (let task of tasks) {
        if (task.getAttribute('isDiary') === 'yes') {
          isTasksDiary = true
          tasksDiary.push(task.getAttribute('_id')) //db
          const realized = document.getElementById(
            `tasksRealized_${task.getAttribute('_id')}`
          )
          realized.textContent = 0
        } else if (task.getAttribute('isDiary') === 'no') {
          isTasksCommom = true
          tasksCommom.push(task.getAttribute('_id'))
        }
      }
      if (isTasksDiary) {
        resetPomodoriesInput.value = tasksDiary.join(' ')
        resetPomodories.submit()
      }
      if (isTasksCommom) {
        deletePomodoriesInput.value = tasksCommom.join(' ')
        deletePomodories.submit() //db
      }
      this.timer.balanceTime.balance = 0
      this.endsIn()
      working.textContent = ''
      workingPomodories.textContent = '>'
      workingRealized.textContent = '<'
      workingSession.value = ''
    }

    addTodayPomodorie() {
      const idTask = working.getAttribute('_id')
      if (idTask) {
        addTodayPomodorieInput.value = idTask
        addTodayPomodorie.submit() //db
        const realized = document.getElementById(
          `tasksRealized_${idTask}`
        )
        let number = realized.textContent
        number = parseInt(number)
        realized.textContent = number + 1
        workingRealized.textContent = number + 1
      }
    }
    startTimer() {
      myVideo.play()
      clearInterval(this.timer.endsInInterval)
      modeButtons.style.pointerEvents = 'none'
      modeButtons2.style.pointerEvents = 'none'

      let { total } = this.timer.remainingTime
      const endTime = Date.parse(new Date()) + total * 1000

      mainButton.dataset.action = 'stop'
      mainButton.textContent = 'stop'
      mainButton.classList.add('activeMainBtn')

      this.interval = setInterval(() => {
        this.timer.remainingTime = this.getRemainingTime(endTime)
        this.updateClock()
        total = this.timer.remainingTime.total
        if (total <= 0) {
          //pomodoro zerou
          clearInterval(this.interval)
          this.interval = null
          switch (this.timer.mode) {
            case 'pomodoro':
              console.log('session+++++')
              this.timer.sessions++
              this.addTodayPomodorie()
              containerTimer.setAttribute('breakRequired', 'true')
              if (
                this.timer.sessions %
                  this.timer.longBreakInterval ===
                0
              ) {
                this.switchMode('longBreak')
              } else {
                this.switchMode('shortBreak')
              }
              break
            default:
              this.switchMode('pomodoro')
              new Notification('Get back to work!')
              document
                .querySelector(`[data-sound="${this.timer.mode}"]`)
                .play()
              this.stopTimer()
              return
          }

          if (Notification.permission === 'granted') {
            const text =
              this.timer.mode === 'pomodoro'
                ? 'Get back to work!'
                : 'Take a break!'
            new Notification(text)
          }

          document
            .querySelector(`[data-sound="${this.timer.mode}"]`)
            .play()

          this.startTimer()
        }
      }, 1000)
      console.log('session: ', this.timer.sessions)
    }

    stopTimer() {
      modeButtons.style.pointerEvents = 'auto'
      modeButtons2.style.pointerEvents = 'auto'
      myVideo.pause()
      clearInterval(this.interval)
      this.timer.endsInInterval = setInterval(() => {
        if (!this.interval) {
          const data = new Date(this.timer.endsIn) //
          data.setTime(data.getTime() + 1000) //
          this.timer.balanceTime.balance =
            this.timer.balanceTime.balance_ - 1
          if (
            containerTimer.getAttribute('mode') !== this.timer.mode
          ) {
            this.showEndsIn(1000, true, true)
            this.showEndsIn(
              1000 +
                this.timer[
                  containerTimer.getAttribute('mode') + 'Ms'
                ]
            )
          } else {
            this.showEndsIn(1000, true)
          }
        }
      }, 1000)

      this.interval = null
      mainButton.dataset.action = 'start'
      mainButton.textContent = 'start'
      mainButton.classList.remove('activeMainBtn')
    }
    updateClock() {
      const { remainingTime } = this.timer
      const minutes = `${remainingTime.minutes}`.padStart(2, '0')
      const seconds = `${remainingTime.seconds}`.padStart(2, '0')

      const min = document.getElementById('js-minutes')
      const sec = document.getElementById('js-seconds')
      min.textContent = minutes
      sec.textContent = seconds

      const text =
        this.timer.mode === 'pomodoro'
          ? 'Get back to work!'
          : 'Take a break!'
      document.title = `${minutes}:${seconds} — ${text}`
      const tempoCorridoEmSegundos =
        this.timer[this.timer.mode] * 60 -
        this.timer.remainingTime.total
      this.timer.elapsedTimeInSeconds = tempoCorridoEmSegundos
      const progress = document.getElementById('js-progress')
      progress.value = tempoCorridoEmSegundos
    }
    switchMode(mode, update) {
      console.log('modeee', mode)
      this.timer.remainingTime = {
        total: this.timer[mode] * 60,
        minutes: this.timer[mode],
        seconds: 0,
      }
      if (!update) {
        document
          .querySelectorAll('i[data-mode]')
          .forEach((e) => e.classList.remove('active'))
        document
          .querySelector(`[data-mode="${mode}"]`)
          .classList.add('active')
        srcBackground.setAttribute(
          'src',
          `/assets/video/${mode}.mp4`
        )
        containerTimer.setAttribute('class', `timer_${mode}`)
        containerTimer.setAttribute('mode', mode)
        myVideo.load()
      } else {
        containerTimer.setAttribute('breakRequired', 'false')
        if (mode === 'pomodoro') {
          mode !== this.timer.mode
            ? this.showEndsIn(
                -Math.abs(this.timer.pomodoroMs),
                true
              )
            : this.showEndsIn()
        }
        if (mode === 'shortBreak') {
          this.showEndsIn(this.timer.shortBreakMs, true)
        }
        if (mode === 'longBreak') {
          this.showEndsIn(this.timer.longBreakMs, true)
        }
        if (mode === 'dinner') {
          this.showEndsIn(this.timer.dinnerMs, true)

          console.log('pasfsheofiusehfuoh')
        }
      }

      if (mode === 'pomodoro') {
        mainButtonBtn.style.display = 'inline-block'
        skipBtn.style.display = 'none'
      } else {
        mainButtonBtn.style.display = 'inline-block'
        skipBtn.style.display = 'inline-block'
      }

      //document.body.style.backgroundColor = `var(--${mode})`
      this.timer.mode = mode
      document
        .getElementById('js-progress')
        .setAttribute('max', this.timer.remainingTime.total)
      this.updateClock()
    }
    handleMode(event) {
      const { mode } = event.target.dataset
      if (!mode) return
      if (mode === 'pomodoro') this.showEndsIn()
      if (mode === 'shortBreak') {
        mode !== this.timer.mode
          ? this.showEndsIn(this.timer.shortBreakMs)
          : this.showEndsIn()
      }
      if (mode === 'longBreak') {
        mode !== this.timer.mode
          ? this.showEndsIn(this.timer.longBreakMs)
          : this.showEndsIn()
      }
      if (mode === 'dinner') {
        mode !== this.timer.mode
          ? this.showEndsIn(this.timer.dinnerMs)
          : this.showEndsIn()
      }
      document
        .querySelectorAll('i[data-mode]')
        .forEach((e) => e.classList.remove('active'))
      document
        .querySelector(`[data-mode="${mode}"]`)
        .classList.add('active')
      srcBackground.setAttribute('src', `/assets/video/${mode}.mp4`)
      containerTimer.setAttribute('class', `timer_${mode}`)
      containerTimer.setAttribute('mode', mode)
      myVideo.load()
      if (!this.timer.endsInInterval) this.stopTimer()
    }

    skip() {
      let msTimerSkiped
      let elapsedTime = this.timer.elapsedTimeInSeconds
      let isBreakRequired =
        containerTimer.getAttribute('breakRequired') === 'true'
      console.log(isBreakRequired)
      if (this.timer.mode === 'shortBreak') {
        if (isBreakRequired) {
          this.timer.balanceTime.balance =
            this.timer.balanceTime.balance_ +
            (this.timer.shortBreak * 60 - elapsedTime)

          msTimerSkiped = -Math.abs(elapsedTime * 1000)
        }
      } else if (this.timer.mode === 'longBreak') {
        if (isBreakRequired) {
          this.timer.balanceTime.balance =
            this.timer.balanceTime.balance_ +
            (this.timer.longBreak * 60 - elapsedTime)

          msTimerSkiped = -Math.abs(elapsedTime * 1000)
        }
      } else if (this.timer.mode === 'dinner') {
        if (isBreakRequired) {
          this.timer.balanceTime.balance =
            this.timer.balanceTime.balance_ +
            (this.timer.dinner * 60 - elapsedTime)

          msTimerSkiped = -Math.abs(elapsedTime * 1000)
        }
      }
      console.log(msTimerSkiped)
      if (msTimerSkiped) this.showEndsIn(msTimerSkiped, true)
      mainButtonBtn.style.display = 'inline-block'
      skipBtn.style.display = 'none'
      btnPomodoro.click()
      mainButton.click()
    }

    start() {
      this.endsIn()
      this.switchMode('pomodoro')
      this.stopTimer()

      mainButton.addEventListener('click', () => {
        if (
          containerTimer.getAttribute('class') !==
          `timer_${this.timer.mode}`
        ) {
          this.switchMode(containerTimer.getAttribute('mode'), true)
        }
        const { action } = mainButton.dataset
        if (action === 'start') {
          sdBtnStart.play()
          this.startTimer()
        } else {
          sdBtnStop.play()
          this.stopTimer()
        }
      })

      modeButtons.addEventListener('click', (event) => {
        this.handleMode(event)
        sdChangeMode.play()
      })
      modeButtons2.addEventListener('click', (event) => {
        this.handleMode(event)
        sdChangeMode.play()
      })
      btnResetPomodories.addEventListener('click', () => {
        this.resetPomodories()
        sdEdit2.play()
      })
      skipBtn.addEventListener('click', () => {
        sdBtnSkip.play()
        this.skip()
      })

      for (let task of tasks) {
        const idTask = task.getAttribute('_id')
        task.addEventListener('click', function (e) {
          sdEdit1.play()
          const Pomodories = document.getElementById(
            `tasksPomodories_${idTask}`
          )
          const Realized = document.getElementById(
            `tasksRealized_${idTask}`
          )
          const Session = task.getAttribute(`session_${idTask}`)
          working.innerHTML = task.firstElementChild.textContent
          working.setAttribute('_id', idTask)
          workingPomodories.textContent =
            Pomodories.textContent.replace(/\s/g, '')
          workingRealized.textContent =
            Realized.textContent.replace(/\s/g, '')
          workingSession.value = Session
        })
      }

      document.addEventListener('DOMContentLoaded', () => {
        if ('Notification' in window) {
          if (
            Notification.permission !== 'granted' &&
            Notification.permission !== 'denied'
          ) {
            Notification.requestPermission().then(function (
              permission
            ) {
              if (permission === 'granted') {
                new Notification(
                  'Awesome! You will be notified at the start of each session'
                )
              }
            })
          }
        }
      })
    }
  }

  //const pomodoro = new Pomodoro(1, 5, 15, 4)
  const pomodoro = new Pomodoro()
  pomodoro.start()
}
