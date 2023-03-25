const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitFor = async (asyncFn, condition) => {
  let count = 0;
  let maxTries = 30;
  while (count < maxTries) {
    try {      
      const res = await asyncFn();
      if (condition(res)) {
        return res;
      }
    } catch (error) {
      console.log(error);
    };
    await delay(500);
    count++;
  }
  return null;
}

module.exports = {
  waitFor,
};
