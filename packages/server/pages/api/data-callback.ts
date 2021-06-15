// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { green } from "chalk";
import type { NextApiRequest, NextApiResponse } from "next";
import { xml2js } from "xml-js";
import withAxiosLogger from "../../middleware/withAxiosLogger";
import {
	checkCallbackSignatureMatch,
	decryptEchoStr,
} from "../../utils/auth-utils";
import * as cmds from "../../utils/cmd-utils";
import { createLogger } from "../../utils/logger";
import { getXmlCDATA } from "../../utils/xml-utils";
const logger = createLogger("dataCallback");
/**
 * https://open.work.weixin.qq.com/api/doc/90001/90142/90595 => 数据回调URL
 * 用于接收托管企业微信应用的用户消息https://open.work.weixin.qq.com/api/doc/90001/90142/90595#12973 和用户事件https://open.work.weixin.qq.com/api/doc/90001/90142/90595#12974。
URL支持使用$CORPID$模板参数表示corpid，推送事件时企业微信会自动将其替换为授权企业的corpid。(关于如何回调，请参考接收消息https://open.work.weixin.qq.com/api/doc/90001/90142/90595#10514。注意验证时$CORPID$模板参数会替换为当前服务商的corpid，校验时也应该使用corpid初始化解密库)
 */
export default withAxiosLogger(async (req: NextApiRequest, res: NextApiResponse) => {
	const { msg_signature, timestamp, nonce, echostr } = req.query;
	logger.info("query %o, body %o", req.query, req.body);

	if (req.body) {
		const root = xml2js(req.body);

		const toUserName = getXmlCDATA(root, "ToUserName");
		const encrypt = getXmlCDATA(root, "Encrypt");
		const agentId = getXmlCDATA(root, "AgentID");

		//https://open.work.weixin.qq.com/api/doc/10514 之 使用接收消息
		if (encrypt) {
			const matched = checkCallbackSignatureMatch(
				process.env.TOKEN!,
				msg_signature.toString(),
				timestamp.toString(),
				nonce.toString(),
				encrypt
			);
			const { id, message } = decryptEchoStr(
				process.env.ENCODING_AES_KEY!,
				encrypt
			);

			const messageRoot = xml2js(message);

			const InfoType = getXmlCDATA(messageRoot, "InfoType");
			if (InfoType && cmds[InfoType]) {
				const result = await cmds[InfoType](messageRoot);
				logger.info("cmd type %s return %o", InfoType, result);

				//必须回success https://open.work.weixin.qq.com/api/doc/10982
				return res.status(200).send("success");
			} else {
				logger.warn("unhandled callback %o", messageRoot);

				return res.status(200).send("success");
			}
		}
	} else {
		//验证api 可用的相应
		if (echostr) {
			const { message } = decryptEchoStr(
				process.env.ENCODING_AES_KEY!,
				echostr.toString()
			);
			logger.info("echo message %s", message);
			//@ts-ignore
			res.status(200).send(message);
		}
	}
})
