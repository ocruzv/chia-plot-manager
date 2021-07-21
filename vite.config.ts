/**
 * 参考链接: https://vitejs.dev/config/
 */
import { join } from 'path';
import { UserConfig } from 'vite';
import dotenv from 'dotenv';
import vue from '@vitejs/plugin-vue';
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';

dotenv.config({ path: join(__dirname, '.env') });
const root = join(__dirname, 'src/render');

const config: UserConfig = {
  root,
  resolve: {
    alias: {
      '@': root,
    },
  },
  base: './',
  build: {
    outDir: join('../../dist/render'),
    emptyOutDir: true,
  },
  server: {
    port: +process.env.PORT,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'box-icon',
        },
      },
    }),
    ViteComponents({
      customComponentResolvers: [
        AntDesignVueResolver({
          importLess: true,
        }),
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ['electron-is-dev', 'electron-store'],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#68C60E',
        },
        javascriptEnabled: true,
      },
    },
  },
};

export default config;
