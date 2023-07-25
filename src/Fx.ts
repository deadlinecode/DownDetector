class Fx {
  static instance = new Fx();
  private constructor() {}

  padTime = (text: string | number) => ("0" + text).slice(-2);

  ping = async (url: string): Promise<number> => {
    const controller = new AbortController();
    const ts = setTimeout(() => controller.abort(), 5000);
    const start = new Date().getTime();
    await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
      mode: "no-cors",
      signal: controller.signal,
    });
    clearTimeout(ts);
    return new Date().getTime() - start;
  };

  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
}

export default Fx.instance;
