import sum from "../helpers/sum.helper.js";

const sumCb = (req, res) => {
  const result = sum();
  return res.json200(result);
};
const sumProcessCb = (req, res) => {
  const childProcess = fork("./src/helpers/sumProcess.helper.js");
  childProcess.send("start");
  childProcess.on("message", (result) => res.json200(result));
};
export { sumCb, sumProcessCb };
