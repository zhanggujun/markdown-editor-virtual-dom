export const PLATFORM = navigator.platform.toLowerCase()
export const EOL = PLATFORM === 'win32' ? '\r\n' : '\n'
export const CMD = PLATFORM.indexOf('mac') > -1 ? 'command' : 'ctrl'
export const INDENT = '  '

let ToolCode = {
  code:EOL+'```js'+EOL+EOL+'```',
  table:() => {
    let buffer = [
      'column1 | column2 | column3  ',
      '------- | ------- | -------  ',
      'column1 | column2 | column3  ',
      'column1 | column2 | column3  ',
      'column1 | column2 | column3  '
    ]
    return EOL+buffer.join(EOL)+EOL
  }
}

export const ToolLeft = [{
  icon: 'icon-redo',
  title: '撤销',
  name: 'undo',
  key:CMD+'+z'
},{
  icon: 'icon-chongzuo',
  title: '重做',
  name: 'redo',
  key: CMD+'+shift+z'
},{
  icon: 'icon-cuti',
  title: '粗体',
  code: '****',
  range: -2,
  name: 'bold',
  key: 'shift+alt+b'
},{
  icon: 'icon-xieti',
  title: '斜体',
  code: '**',
  range: -1,
  name: 'italic',
  key: 'shift+alt+i'
},{
  icon: 'icon-xiahuaxian',
  title: '下划线',
  code: '<u></u>',
  range: -4,
  name: 'underline',
  key: 'shift+alt+e'
},{
  icon: 'icon-shanchuxian',
  title: '删除线',
  code: '~~~~',
  range: -2,
  name: 'strikethrough',
  key: 'shift+alt+d'
},{
  icon: 'icon-h',
  title: 'H1',
  code: '# ',
  name: 'h1',
  key: 'shift+alt+1'
},{
  icon: 'icon-h1',
  title: 'H2',
  code: '## ',
  name: 'h2',
  key: 'shift+alt+2'
},{
  icon: 'icon-h3',
  title: 'H3',
  code: '### ',
  name: 'h3',
  key: 'shift+alt+3'
},{
  icon: 'icon-h5',
  title: 'H4',
  code: '#### ',
  name: 'h4',
  key: 'shift+alt+4'
},{
  icon: 'icon-h2',
  title: 'H5',
  code: '##### ',
  name: 'h5',
  key: 'shift+alt+5'
},{
  icon: 'icon-h4',
  title: 'H6',
  code: '###### ',
  name: 'h6',
  key: 'shift+alt+6'
},{
  icon: 'icon-yinyong',
  title: '引用',
  code: '> ',
  name: 'quote',
  key: 'shift+alt+q'
},{
  icon: 'icon-code',
  title: '代码',
  code: ToolCode.code,
  range: -4,
  name: 'code',
  key: 'shift+alt+c'
},{
  icon: 'icon-youxuliebiao',
  title: '有序列表',
  code: '1. ',
  name: 'orderedlist',
  key: 'shift+alt+o'
},{
  icon: 'icon-wuxuliebiao',
  title: '无序列表',
  code: '- ',
  name: 'unorderedlist',
  key: 'shift+alt+u'
},{
  icon: 'icon-lianjie',
  title: '链接',
  name: 'link',
  range: -3,
  code: '[]()',
  key: 'shift+alt+l'
},{
  icon: 'icon-dashujukeshihuaico-',
  title: '表格',
  name: 'table',
  code: ToolCode.table(),
  key: 'shift+alt+t'
},{
  icon: 'icon-fengexian',
  title: '分割线',
  name: 'line',
  code: '----'+EOL,
  key: 'shift+alt+h'
},{
  icon: 'icon-tupian',
  title: '图片',
  range: -3,
  code:'![]()',
  name: 'image',
  key: 'shift+alt+p'
}]

export const ToolRight = [{
  icon: 'icon-fenlan',
  title: '分屏',
  name: 'splitscreen',
  key: 'shift+alt+s'
},{
  icon: 'icon-xianshiqi',
  title: '预览',
  name: 'preview',
  key: 'shift+alt+v'
},{
  icon: 'icon-quanping',
  title: '全屏',
  name: 'fullscreen',
  key: 'shift+alt+f'
}]
