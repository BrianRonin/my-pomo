function endsIn() {
  const pauses = []
  const pomodoro = 25
  const shortBreak = 5
  const longBreak = 15
  const interval = 6
  const session = 8
  const sessionEnd = pomodoro * 2
  const realized = 10
  const estimed = 17
  let MinutoFocus
  let s = session
  // a ultima pausa não conta
  while (sessionEnd > pauses.length) {
    s++
    // if (s % interval === 0) {
    //   pauses.push('l')
    // } else {
    //   pauses.push('s')
    // }
    s % interval ? pauses.push('l') : pauses.push('s')
  }
  pauses.pop()
  let minutosStop = 0
  for (let i in pauses) {
    if (pauses[i] === 'l') minutosStop += longBreak
    if (pauses[i] === 's') minutosStop += shortBreak
  }
  MinutoFocus = (estimed - realized) * pomodoro
  const minutosTotal = minutosStop + MinutoFocus
  const date = new Date()
  const date2 = new Date()
  date.setMinutes(date.getMinutes() + minutosTotal)
  function mostrarData(date) {
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
    ss = ss < 10 ? '0' + ss : ss

    let time = hh + ':' + mm + ':' + ss + ' ' + sessiont
    console.log(time)
  }
  mostrarData(date2)
  mostrarData(date)
  console.log(pauses)
}
//endsIn()
function test(info) {
  console.log(1 + -5)
}
test()
