import axios from "axios";
import getSuiteTicket from "./get-suite-ticket";
import { getValue, setValue, store } from "./global-store";
import { createLogger } from "./logger";

const logger = createLogger("获取第三方应用凭证");
export const getSuiteAccessToken = async () => {
  const cached = getValue(store, "suiteAccessToken");

  if (cached) {
    logger.info("使用缓存值 %s", cached);
    return cached;
  }

  const suiteTicket = await getSuiteTicket();
  if (!suiteTicket) {
    throw new Error("invalid suiteTicket");
  }
  const SUITE_ID = process.env.SUITE_ID;
  const SUITE_SECRET = process.env.SECRET;
  const {
    data: { suite_access_token, expires_in },
  } = await axios.post(
    "https://qyapi.weixin.qq.com/cgi-bin/service/get_suite_token",
    {
      suite_id: SUITE_ID,
      suite_secret: SUITE_SECRET,
      suite_ticket: suiteTicket,
    }
  );

	logger.warn("使用最新值 %s", suite_access_token);
  return setValue(store, "suiteAccessToken", suite_access_token, expires_in);
};

export default getSuiteAccessToken;
