import axios from "axios";
import { getCorpAccessToken } from "./get-corp-access-token";
import { getValue, setValue, store } from "./global-store";
import { createLogger } from "./logger";
import { red } from 'chalk'
const logger = createLogger("获取jsTicket");

export const getAppJsTicket = async (corpId: string) => {
	const cached = getValue(store, `AppJsTicket:${corpId}`);
	if (cached) {
		logger.info("获取缓存应用ticket %s", cached);
		return cached;
	}
	const access_token = await getCorpAccessToken(corpId);
	//获取应用的jsapi_ticket
	//https://work.weixin.qq.com/api/doc/90001/90144/90539#%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9A%84jsapi_ticket
	const {
		data: { ticket, expires_in },
	} = await axios.get(
		// "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket",
		"https://qyapi.weixin.qq.com/cgi-bin/ticket/get",
		{
			params: {
				type: "agent_config",
				access_token: access_token,
			},
		}
	);

	logger.warn(`获取最新${red("应用")}ticket %s`, ticket);
	const v =  setValue(store, `AppJsTicket:${corpId}`, ticket, expires_in);
	return v;
};

export const getCorpJsTicket = async (corpId: string) => {
	const cached = getValue(store, `CorpJsTicket:${corpId}`);
	if (cached) {
		logger.info("获取缓存企业ticket %s", cached);
		return cached;
	}
	const access_token = await getCorpAccessToken(corpId);
	const {
		data: { ticket, expires_in },
	} = await axios.get("https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket", {
		params: {
			access_token: access_token,
		},
	});
	logger.warn(`获取最新${red("企业")}ticket %s`, ticket);
	return setValue(store, `CorpJsTicket:${corpId}`, ticket, expires_in);
};
