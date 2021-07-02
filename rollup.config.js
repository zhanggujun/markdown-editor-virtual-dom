
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import alias from '@rollup/plugin-alias'
import postcss from 'rollup-plugin-postcss'
import sass from 'node-sass'
import copy from 'rollup-plugin-copy'
import autoprefixer from 'autoprefixer'
// import { scss, postcss } from 'svelte-preprocess'
// import cssnano from 'cssnano' // 优化css

const production = !process.env.ROLLUP_WATCH

const processSass = (context,payload) => {
  return new Promise((resolve,reject) => {
    sass.render({
      file: context
    },(err,result) => {
      if(!err){
        resolve(result)
      }else{
        reject(err)
      }
    })
  })
}

const baseConfig = options => {
  const {
    input = 'index',
    name = 'Thor',
    plugins = []
  } = options || {}
  return {
    input: `src/core/${input}.js`,
    output: {
      sourcemap: false,
      format: 'umd',
      name,
      file: !production ? `public/thor/${input}.js` : `core/${input}.js`
    },
    plugins: [
      json(),
      alias({
        entries: [
          { find: '@', replacement: 'src' },
        ]
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
        dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
      }),
      commonjs(),
      postcss({
        extract: true,
        extensions:['.css', '.scss'],
        minimize: true,
        process: processSass,
        use:[
          ['sass', {
            data: '@import "./src/style/vars.scss";',
          }]
        ],
        plugins: [
          autoprefixer({
            'overrideBrowserslist': [
              'last 20 versions'
            ]
          })
        ]
      }),
      svelte(),
      babel({
        extensions: ['.js','.mjs','.html','.svelte'],
        exclude: ['node_modules/**'],
        runtimeHelpers: true,
        externalHelpers: true
      }),
      production && filesize(),
      production && terser(),
      production && uglify(),
      copy({
        targets: [{
          src:[
            './src/icon/iconfont.eot',
            './src/icon/iconfont.svg',
            './src/icon/iconfont.ttf',
            './src/icon/iconfont.woff',
            './src/icon/iconfont.woff2',
            './src/icon/iconfont.css'
          ],dest:!production ? 'public/thor/icon' : 'core/icon'},
        ]
      }),
      ...plugins
    ],
    watch: {
      clearScreen: false
    }
  }
}

export default [{
  ...baseConfig({
    plugins:[
      !production && livereload(),
      !production && serve({
        open: true,
        contentBase: 'public',
        historyApiFallback: true,
        host: 'localhost',
        port: 9988
      })
    ]
  })
},{
  ...baseConfig({
    input: 'core',
    name: 'Thor'
  })
},{
  ...baseConfig({
    input: 'marked',
    name: 'marked'
  })
}]
