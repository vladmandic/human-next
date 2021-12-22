import { Component } from "react";
import type { Human, Config } from '@vladmandic/human/dist/human.esm';
import { log, status } from './logging';

const config: Partial<Config> = {
  debug: false,
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models',
  face: { enabled: true },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
}

interface Props { inputId: string, outputId: string };
interface State { ready: boolean };

class LoadHuman extends Component<Props, State> {
  HumanImport: any;
  human: Human | undefined = undefined;
  video: HTMLVideoElement | undefined = undefined;
  canvas: HTMLCanvasElement | undefined = undefined;
  timestamp = { detect: 0, draw: 0 };
  fps = { detect: 0, draw: 0 };
  
  constructor(props: Props) { // human is loaded as dynamic import in component constructor and then sets ready state
    super(props)
    if (typeof document === 'undefined') return;
    this.video = document.getElementById(this.props.inputId) as (HTMLVideoElement | undefined) || document.createElement('video');
    this.canvas = document.getElementById(this.props.outputId) as (HTMLCanvasElement | undefined) || document.createElement('canvas');
    import('@vladmandic/human/dist/human.esm').then((H) => {
      this.human = new H.default(config) as Human;
      log('human version:', this.human.version, '| tfjs version:', this.human.tf.version['tfjs-core']);
      log('platform:', this.human.env.platform, '| agent:', this.human.env.agent);
      status('loading models...');
      this.human.load().then(() => { // preload all models
        log('backend:', this.human!.tf.getBackend(), '| available:', this.human!.env.backends);
        log('loaded models:' + Object.values(this.human!.models).filter((model) => model !== null).length);
        status('initializing...');
        this.human!.warmup().then(() => { // warmup function to initialize backend for future faster detection
          this.setState({ ready: true });
          status('ready...');
        });
      });
    });
  }

  override async componentDidMount() { // add event handlers for resize and click
    if (this.video) this.video.onresize = () => {
      this.canvas!.width = this.video!.videoWidth;
      this.canvas!.height = this.video!.videoHeight; 
    }
    if (this.canvas) this.canvas.onclick = () => {
      this.video?.paused ? this.video?.play() : this.video?.pause();
    }
  }

  override render(this: LoadHuman) {
    if (this && this.state && this.state.ready) { // once component is created and human state is ready trigger detection and draw loops
      this.detectionLoop(); // start detection loop
      this.drawLoop(); // start draw loop 
    }
    return null;
  }

  async detectionLoop(this: LoadHuman) { // main detection loop
    if (!this || !this.human || !this.video || !this.canvas) return;
    await this.human.detect(this.video); // actual detection; were not capturing output in a local variable as it can also be reached via this.human.result
    const now = this.human.now();
    this.fps.detect = 1000 / (now - this.timestamp.detect);
    this.timestamp.detect = now;
    // @ts-ignore requestVideoFrameCallback is not yet defined in tslib
    this.video.requestVideoFrameCallback(() => this.detectionLoop()); // trigger detect when next frame is available
  }
  
  async drawLoop(this: LoadHuman) { // main screen refresh loop
    if (!this || !this.human || !this.video || !this.canvas) return;
    if (!this.video.paused) {
      const interpolated = await this.human.next(this.human.result); // smoothen result using last-known results
      await this.human.draw.canvas(this.video, this.canvas); // draw canvas to screen
      await this.human.draw.all(this.canvas, interpolated); // draw labels, boxes, lines, etc.
      const now = this.human.now();
      this.fps.draw = 1000 / (now - this.timestamp.draw);
      this.timestamp.draw = now;
    }
    status(this.video.paused ? 'paused' : `fps: ${this.fps.detect.toFixed(1).padStart(5, ' ')} detect | ${this.fps.draw.toFixed(1).padStart(5, ' ')} draw`); // write status
    setTimeout(() => this.drawLoop(), 30); // use to slow down refresh from max refresh rate to target of 30 fps
  } 
}

export default LoadHuman;
