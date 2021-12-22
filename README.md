# Human: Demo with TypeScript/ReactJS/NextJS

Project uses `Human` library with full `TypeScript` (including strict TypeChecking) support with `NextJS` framework and `ReactJS` front-end library

Project creates two self-enclosed class components:
- `components/InitWebCam.tsx`  
  - initializes WebCam using specified `HTMLVideoElement`  
- `components/RunHuman.tsx`  
   - lazy-loads `Human` library  
   - loads required `models`  
   - warms up models  
   - uses `ready` state change to trigger detection  
   - uses `frame` state change to trigger rendering  
     using specified input `HTMLVideoElement` and output `HTMLCanvasElement`  

Note: configuration in `next.config.js` is defined for deployment on [gitpages]()  

<br>

## Run

### Development

- run: `npm dev`
- navigate to: <http://localhost:3000>

### Production

- run `npm build`

      info  - Checking validity of types
      info  - Creating an optimized production build
      info  - Compiled successfully
      info  - Collecting page data
      info  - Generating static pages (3/3)
      info  - Finalizing page optimization

- run `npm export`

      info  - using build directory: /home/vlado/dev/human-next/.next
      info  - Copying "static build" directory
      info  - Launching 11 workers
      info  - Copying "public" directory
      info  - Exporting (3/3)
      Export successful. Files written to /home/vlado/dev/human-next/out
