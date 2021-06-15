// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { encrypt } from "@wecom/crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import withAxiosLogger from "../../middleware/withAxiosLogger";
import { getAppJsTicket, getCorpJsTicket } from "../../utils/get-js-ticket";
import { getSignature } from "../../utils/get-signature";
import { createLogger } from "../../utils/logger";
import prisma from "../../utils/prisma";

const logger = createLogger("config-signature");
type Data = {
	signature: string;
	nonceStr: string;
	timestamp: number;
	agentId: string;
	jsApiList: string[];
	corpid: string;
};


export default withAxiosLogger(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await NextCors(req, res, {
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTION"],
		origin: "*",
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	});

	logger.info("query %o, body %o", req.query, req.body);
	const { url, corpId } = req.query;
	const timestamp = Date.now();
	//企业的 !!!. 不是 app 的
	const jsapi_ticket = await getCorpJsTicket(corpId.toString());
	const corp = await prisma.corp.findUnique({ where: { id: corpId.toString() } });
	const u = decodeURIComponent(url.toString());
	const noncestr = encrypt(
		process.env.ENCODING_AES_KEY!,
		u + Date.now(),
		"test"
	);

	// https://work.weixin.qq.com/api/jsapisign
	const signature = getSignature(jsapi_ticket, noncestr, timestamp, u);

	res.status(200).json({
		signature,
		nonceStr: noncestr,
		timestamp,
		agentId: corp!.agentId!,
		corpid: corpId.toString(),
		jsApiList: ["checkJsApi", 'openUserProfile', 'getContext', "selectExternalContact", "startRecord", "stopRecord", "playVoice", "uploadVoice", "downloadVoice"],
	});
})
