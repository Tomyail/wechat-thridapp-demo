import { createLogger } from "./logger";
import prisma from "./prisma";

const logger = createLogger("获取suiteTicket");

const getSuiteTicket = async () => {
  const SUITE_ID = process.env.SUITE_ID;
  const suite = await prisma.suite.findUnique({ where: { suiteId: SUITE_ID } });
  logger.info("推送的suiteTicker 为 %s", suite?.suiteTicket);
  return suite?.suiteTicket;
};

export default getSuiteTicket;
