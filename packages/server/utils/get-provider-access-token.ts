import axios from "axios";
import getSuiteAccessToken from "./get-suite-access-token";
import { getValue, setValue, store } from "./global-store";
import { createLogger } from "./logger";
import prisma from "./prisma";

const logger = createLogger("获取服务商token");

//https://work.weixin.qq.com/api/doc/90001/90143/90604
export const getPrividerAccessToken = async (corpId: string) => {
	const cached = getValue(store, `providerAccessToken:${corpId}`);
	if (cached) {
		logger.info("获取缓存值 %s", cached);
		return cached;
	}

	const {
		data: { access_token, expires_in },
	} = await axios.post(
		"https://qyapi.weixin.qq.com/cgi-bin/service/get_provider_token",

		{ corpid: corpId, provider_secret: process.env.PROVIDER_SECRET },
	);

	logger.warn("获取最新值 %s", access_token);
	return setValue(store, `providerAccessToken:${corpId}`, access_token, expires_in);
};
