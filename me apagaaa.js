function formatDate(userDate) {
  const day = userDate.slice(0, 2)
  const mounth = userDate.slice(3, 5)
  const year = userDate.slice(6)
  return `${year}${mounth}${day}`
} //0 2//2 5// 5
//0123456789
console.log(formatDate('12/31/2014'))
