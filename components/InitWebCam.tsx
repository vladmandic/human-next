import { Component } from "react";

interface Props { elementId: string };
interface State { ready: boolean };

class InitWebCam extends Component<Props, State> {
  video: HTMLVideoElement | undefined;
  stream: MediaStream | undefined;
  track: MediaStreamTrack | undefined;
  settings: MediaTrackSettings | undefined;
  constraints: MediaStreamConstraints | undefined;
  capabilities: MediaTrackCapabilities | undefined;

  constructor(props: Props) {
    super(props)
    if (typeof document === 'undefined') return;
    this.video = document.getElementById(this.props.elementId) as (HTMLVideoElement | undefined) || document.createElement('video');
    this.video.style.display = 'none';
    this.video.id = this.props.elementId;
    this.constraints = { audio: false, video: { facingMode: 'user', width: { ideal: document.body.clientWidth } } };
    navigator.mediaDevices.getUserMedia(this.constraints).then((stream: MediaStream) => {
      this.stream = stream;
      this.track = this.stream.getVideoTracks()[0];
      this.capabilities = this.track.getCapabilities ? this.track.getCapabilities() : undefined;
      this.settings = this.track.getSettings ? this.track.getSettings() : undefined;
      this.video!.onloadeddata = () => this.setState({ ready: true });
      this.video!.srcObject = this.stream;
      this.video!.play();
    })
  }

  override render(this: InitWebCam) {
    if (this && this.state && this.state.ready) console.log('video:', this.video!.videoWidth, this.video!.videoHeight, this.track!.label, { stream: this.stream, track: this.track, settings: this.settings, constraints: this.constraints, capabilities: this.capabilities })
    return null;
  }
}

export default InitWebCam;
