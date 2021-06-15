// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import withAxiosLogger from "../../middleware/withAxiosLogger";
import { getUserInfo } from "../../utils/get-user-info";
import { createLogger } from "../../utils/logger";

const logger = createLogger("user-info");
type Data = {
	corpSignature: string;
	appSignature: string;
	nonceStr: string;
	timestamp: number;
	agentId: string;
	appJsApiList: string[];
	corpJsApiList: string[];
	corpid: string;
};


export default withAxiosLogger(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await NextCors(req, res, {
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
		origin: "*",
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	});

	logger.info("query %o, body %o", req.query, req.body);
	const { code } = req.query;

	const user = await getUserInfo(code.toString())

	res.status(200).json(user);
})
