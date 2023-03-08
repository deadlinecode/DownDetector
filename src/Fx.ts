class Fx {
  static instance = new Fx();
  private constructor() {}

  padTime = (text: string | number) => ("0" + text).slice(-2);

  ping = async (url: string): Promise<number> => {
    const start = new Date().getTime();
    await fetch(url, { method: "HEAD", cache: "no-cache", mode: "no-cors" });
    return new Date().getTime() - start;
  };

  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
}

export default Fx.instance;
