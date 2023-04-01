function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const waitFor = async <ResType>(asyncFn: () => Promise<ResType>, condition: (res: ResType) => boolean): Promise<ResType | null> => {
  let count = 0;
  let maxTries = 10;
  while (count < maxTries) {
    try {      
      const res = await asyncFn();
      if (condition(res)) {
        return res;
      }
    } catch (error) {
      console.log(error);
    };
    await delay(3000);
    count++;
  }
  return null;
}
