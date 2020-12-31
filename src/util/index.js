export const PLATFORM = navigator.platform.toLowerCase()
export const EOL = PLATFORM === 'win32' ? '\r\n' : '\n'
export const CMD = PLATFORM.indexOf('mac') > -1 ? 'command' : 'ctrl'
export const INDENT = '  '

export const isDeep = array => array.some(item=> item instanceof Array)

export const flatten = array => {
  let resultArray = []
  array.forEach(item => resultArray = [...resultArray,null,...item])
  return resultArray.slice(1,resultArray.length)
}
