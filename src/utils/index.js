/*
 @author zhanggujun
 @date 2021-06-29 15:23
 @email zhanggujun@sina.cn
 @github https://github.com/zhanggujun
*/

export const getRandom = (min,max) => Math.floor(Math.random() * (max - min + 1) + min)

export const getSymbol = (key,min = 100,max = 200) => {
  const string = `${key}-${(new Date()).getTime()}-${getRandom(min,max)}`
  return Symbol(string)
}

// symbol provated function
export const symbolPrivatedThor = getSymbol('thor')
export const symbolPrivatedPlugins = getSymbol('plugins')

// utils function
export const initPlugins = (plugins,value) => {
  if(Array.isArray(plugins) && plugins.length){
    let i = plugins.length
    while(i){
      const plugin = plugins[plugins.length - i]
      value = plugin(value)
      i --
    }
    return value
  }else if(typeof plugins === 'function'){
    return plugins
  }else{
    return value
  }
}
