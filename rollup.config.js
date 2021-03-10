import svelte from 'rollup-plugin-svelte';
import svelteSvg from 'rollup-plugin-svelte-svg';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import {terser} from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import htmlBundle from './plugins/htmlBundler';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process')
          .spawn('npm', ['run', 'start', '--', '--dev'], {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true,
          });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.ts',
  output: [
    {
      sourcemap: !production,
      format: 'es',
      name: 'app',
      dir: 'dist',
      entryFileNames: !production ? '[name].js' : '[name]-[hash].js',
      chunkFileNames: !production ? '[name].js' : '[name]-[hash].js',
    }
  ],
  plugins: [
    postcss(),
    svelteSvg(),
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
      moduleDirectories: ['node_modules'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    htmlBundle({
      template: 'src/index.html',
      target: 'index.html',
      attrs: ['defer', 'type="module"'],
    }),
    copy({
      targets: [
        {src: 'public/*', dest: 'dist'}
      ],
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('dist'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: true,
  },
};
