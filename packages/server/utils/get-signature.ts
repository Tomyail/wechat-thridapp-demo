import { createLogger } from "./logger";

const logger = createLogger("获取signature");
export const getSignature = (
	jsTicket: string,
	nonceStr: string,
	timestamp: number,
	url: string
) => {
	// https://work.weixin.qq.com/api/jsapisign
	const crypto = require("crypto");
	const string1 = `jsapi_ticket=${jsTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
	const signature = crypto
		.createHash("sha1")
		.update(
			string1
		)
		.digest("hex");

	logger.info(
		"使用 jsticket %s, nonceStr %s, timestamp %s, url %s  的 string1: %s 得到的signature  %s, ",
		jsTicket,
		nonceStr,
		timestamp,
		url,
		string1,
		signature
	);
	return signature;
};
