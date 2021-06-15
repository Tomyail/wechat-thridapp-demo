import axios from "axios";
import getSuiteAccessToken from "./get-suite-access-token";
import { getValue, setValue, store } from "./global-store";
import { createLogger } from "./logger";
import prisma from "./prisma";

const logger = createLogger("获取企业授权token");

//https://work.weixin.qq.com/api/doc/90001/90143/90604
export const getCorpAccessToken = async (corpId: string) => {
  const cached = getValue(store, `corpAccessToken:${corpId}`);
  if (cached) {
    logger.info("获取缓存值 %s", cached);
    return cached;
  }

  const suiteAccessToken = await getSuiteAccessToken();
  const corp = await prisma.corp.findUnique({ where: { id: corpId } });
  const {
    data: { access_token, expires_in },
  } = await axios.post(
    "https://qyapi.weixin.qq.com/cgi-bin/service/get_corp_token",

    { auth_corpid: corpId, permanent_code: corp?.permanentCode },
    { params: { suite_access_token: suiteAccessToken } }
  );

  logger.warn("获取最新值 %s", access_token);
  return setValue(store, `corpAccessToken:${corpId}`, access_token, expires_in);
};
