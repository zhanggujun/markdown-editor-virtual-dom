export const isDeep = array => array.some(item=> item instanceof Array)

export const flatten = array => {
  let resultArray = []
  array.forEach(item => resultArray = [...resultArray,null,...item])
  return resultArray.slice(1,resultArray.length)
}
