export const getQueryFromUrl = (url: string) => {
  const urlObj = new URL(url);
  const query: Record<string, any> = {};
  urlObj.searchParams.forEach(function (val, key) {
    query[key] = val;
  });

  return query;
};

export const pluralize = (num: number, word: string, plural = word + "s") =>
  [1, -1].includes(Number(num)) ? word : plural;


  export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, delay);
    };
};