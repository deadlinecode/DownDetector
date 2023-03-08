import * as React from "react";
import "./App.scss";
import Fx from "./Fx";
import {
  appWindow,
  LogicalPosition,
  LogicalSize,
} from "@tauri-apps/api/window";

enum Latency {
  Good,
  Ok,
  Bad,
}

export interface IAppProps {}

export interface IAppState {
  time: string;
  ping: string;
  latency: Latency;
}

export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      time: "",
      ping: "",
      latency: Latency.Good,
    };
  }

  cycleClock = () => {
    const ts = new Date();
    this.setState(
      {
        time: [ts.getHours(), ts.getMinutes(), ts.getSeconds()]
          .map((x) => Fx.padTime(x))
          .join(":"),
      },
      () => setTimeout(() => this.cycleClock(), 1000)
    );
  };

  cyclePing = async () => {
    var ts = new Date().getTime();
    try {
      var time = await Fx.ping("https://1.1.1.1");
      this.setState({
        ping: `${time}ms`,
        latency:
          time < 800 ? Latency.Good : time < 1300 ? Latency.Ok : Latency.Bad,
      });
    } catch {
      this.setState({ ping: "Offline", latency: Latency.Bad });
    }
    ts = new Date().getTime() - ts;
    ts < 500 && (await Fx.sleep(500 - ts));
    this.cyclePing();
  };

  componentDidMount = async () => {
    await appWindow.setSize(new LogicalSize(600, 50));
    await appWindow.center();
    const pos = await appWindow.outerPosition();
    appWindow.setPosition(new LogicalPosition(pos.x, 10));
    this.cycleClock();
    this.cyclePing();
  };

  render = () => (
    <div
      data-tauri-drag-region
      id="Main"
      onContextMenu={async (ev) => {
        ev.preventDefault();
        await appWindow.setSize(new LogicalSize(600, 50));
        await appWindow.center();
        const pos = await appWindow.outerPosition();
        appWindow.setPosition(new LogicalPosition(pos.x, 10));
      }}
    >
      <div>
        <div className="clock">{this.state.time}</div>
        <div className="info">{this.state.ping}</div>
        <div
          className={`status ${
            this.state.latency === Latency.Good
              ? "green"
              : this.state.latency === Latency.Ok
              ? "yellow"
              : "red"
          }`}
        />
      </div>
    </div>
  );
}
