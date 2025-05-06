export function querySelectorWait(selector: string, timeout: number, startDelay: number = 0): Promise<Element> {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector)!);
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)!) {
          observer.disconnect();
          resolve(document.querySelector(selector)!);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error('Timeout'));
      }, timeout);

    }, startDelay);
  });
}