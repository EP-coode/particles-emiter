export function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout = 300
  ) {
    let timer: number | null;
  
    return (...args: Params) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func(...args);
      }, timeout);
    };
  }