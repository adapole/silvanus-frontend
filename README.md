# Vite Project Structure

This project uses the superfast [vite](https://vitejs.dev/) bundler. The following shows the structure of the Vite template:

* `assets/` - The asset folder contains exported assets from Unity
* `include/` - Assets and content that need to be reference/load.
* `index.html`
* `src/`
    * `main.ts` - Imports the needle-engine package
    * `src/scripts/` - Scripts
    * `src/styles/` - Stylesheets
* `vite.config` - The [vite config](https://vitejs.dev/config/). Settings for building the distribution and hosting the development server are made here.

# Prerequisites

* Node.JS version 16.4LTS or higher. Recommended Node V16 
* For production builds, installation of [`toktx`](https://github.com/KhronosGroup/KTX-Software) is required
* Get the `Avatar.glb`, `scene.glb` files from [Download](https://www.google.com/drive/)

# How to build

To build the project, follow the steps below. Start by cloning the repository, then create a folder named [`assets`](https://github.com/adapole/silvanus-frontend/blob/main/package.json#L29) within the repository. Add the downloaded files `(Avatar.glb, scene.glb)`

1. Open [`package.json`](https://github.com/adapole/silvanus-frontend/blob/main/package.json#L12) and replace dependencies with

```
"dependencies": {
    "@needle-tools/engine": "2.45.0-pre",
    "three": "^0.146.1",    
    "silvadef": "file:../silvadef~"
},
  ```
  
  2. Goto repository [`silva`](https://github.com/adapole/silvadef) and copy files to a folder outside of the current directory of [`package.json`](https://github.com/adapole/silvanus-frontend/blob/main/package.json)
 . Rename the folder to `silvadef~` or change the path of `"silvadef": ` package in [`package.json`](https://github.com/adapole/silvanus-frontend/blob/main/package.json#L15)
  
  3. Run `npm run install` or `pnpm install` on terminal
  
  4. For local build run `npm build:dev` or `pnpm build:dev`
  
  5. For production build install [`toktx`](https://github.com/KhronosGroup/KTX-Software), make sure toktx is in the environment path.
  To check if toktx is in the environment path, open cmd and run ```toktx -v```. If environment path is set correctly, expect something like `toktx v4.1.0-rc3~4`
  
       ```npm run build:production```
