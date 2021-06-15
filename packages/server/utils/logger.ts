import logger from "pino";
import fs from "fs";
import pinoms from "pino-multi-stream";
import path from "path";
import findup from "find-up";

const pwd = findup.sync("package.json");

const logPath = path.join(path.dirname(pwd!), "./file.log");
if (!fs.existsSync(logPath)) {
  console.log("create Logger file", logPath);

  fs.writeFileSync(logPath, "", { encoding: "utf-8" });
}
const streams = [
  { stream: process.stdout },
  { stream: fs.createWriteStream(logPath, { flags: "a" }) },
];
const mainLogger = logger({}, pinoms.multistream(streams));
export const createLogger = (name: string) => {
  return mainLogger.child({ name });
};
