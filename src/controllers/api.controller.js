import sendEmail from "../helpers/email.helper.js";
import sum from "../helpers/sum.helper.js";

const sumCb = (req, res) => {
  const result = sum();
  res.json200(result);
};
const sumProcessCb = (req, res) => {
  const childProcess = fork("./src/helpers/sumProcess.helper.js");
  childProcess.send("start");
  childProcess.on("message", (result) => res.json200(result));
};
const sendEmailCb = async (req, res) => {
  const { email } = req.params;
  await sendEmail(email);
  res.json200("ok");
};
export { sumCb, sumProcessCb, sendEmailCb };
