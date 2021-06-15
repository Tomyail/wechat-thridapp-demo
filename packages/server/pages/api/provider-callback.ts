// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { atob } from 'js-base64';
import { green, red } from "chalk";
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

const logger = createLogger("commonCmdCallback");

/**
 *  * https://open.work.weixin.qq.com/api/doc/90001/90142/90595 => 指令回调URL
 * 系统将会把此应用的授权变更事件以及ticket参数等推送给此URL。
(填写URL时需要正确响应企业微信验证URL的请求(https://open.work.weixin.qq.com/api/doc/10982)。请参考接收消息(https://open.work.weixin.qq.com/api/doc/10514)）
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
				process.env.PROVIDER_TOKEN!,
				msg_signature.toString(),
				timestamp.toString(),
				nonce.toString(),
				encrypt
			);
			const { id, message } = decryptEchoStr(
				process.env.PROVIDER_ENCODING_AES_KEY!,
				encrypt
			);

			const messageRoot = xml2js(message);

			const InfoType = getXmlCDATA(messageRoot, "InfoType");
			if (InfoType && cmds[InfoType]) {
				const result = await cmds[InfoType](messageRoot);
				logger.info("cmd message %o return %o",messageRoot, result);
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
				process.env.PROVIDER_ENCODING_AES_KEY!,
				echostr.toString()
			);

			logger.info("echo message %s", message);
			//@ts-ignore
			res.status(200).send(message);
		}
	}
});
