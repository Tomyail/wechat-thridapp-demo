import axios from "axios";
import getSuiteAccessToken from "./get-suite-access-token";
import { createLogger } from "./logger";
import prisma from "./prisma";
import { getXmlCDATA, getXmlValue } from "./xml-utils";
const logger = createLogger("cmdUtils");

const bgRun = async (fn: any) => {
	await fn();
};
/**
 * 微信定期给过来的ticket
 * @param data
 * @returns
 */
export const suite_ticket = async (data) => {
	const suiteId = getXmlCDATA(data, "SuiteId");
	const suiteTicket = getXmlCDATA(data, "SuiteTicket");
	const timestamp = getXmlValue(data, "TimeStamp");

	const suite = await prisma.suite.upsert({
		where: { suiteId: suiteId! },
		create: { suiteTicket: suiteTicket!, suiteId: suiteId! },
		update: { suiteTicket: suiteTicket! },
	});

	logger.warn("receive new ticket %s", suiteTicket);
	return { suiteId, suiteTicket, timestamp, suite };
};

export const create_auth = async (data) => {
	const suiteId = getXmlCDATA(data, "SuiteId");
	const timestamp = getXmlValue(data, "TimeStamp");
	// AuthCode 有效期十分钟， 过期了就得重新哪
	const authCode = getXmlCDATA(data, "AuthCode");

	const suite = await prisma.suite.upsert({
		where: { suiteId: suiteId! },
		create: { suiteId: suiteId! },
		update: {},
	});

	logger.warn("收到新的授权成功通知，临时授权码为 %s", authCode);
	bgRun(async () => {
		const suite_access_token = await getSuiteAccessToken()
		const { data } = await axios.post(
			"https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code",
			{
				auth_code: authCode,
			},
			{
				params: {
					suite_access_token: suite_access_token,
				},
			}
		);

		const {
			access_token,
			expires_in,
			permanent_code,
			auth_corp_info: { corp_name, corpid, corp_full_name },
			auth_info: {
				//文档说对于新的app ，这个 agent 数组长度绝对是1. 所以0就是期望的结果
				agent: [{ agentid, auth_mode, name: agentName, privilege }],
			},
			auth_user_info: { avatar, name: authUserName, open_userid, userid },
		} = data;
		logger.warn(
			"使用临时授权码 %s 换取的永久授权码是 %s, corpId %s, agentId %s",
			authCode,
			permanent_code,
			corpid,
			agentid
		);

		await prisma.corp.upsert({
			where: { id: corpid },
			create: {
				id: corpid,
				permanentCode: permanent_code,
				name: corp_name,
				agentId: agentid.toString(),
			},
			update: {
				permanentCode: permanent_code,
				name: corp_name,
				agentId: agentid.toString(),
			}

		});

		axios.post("https://qyapi.weixin.qq.com/cgi-bin/service/set_session_info", {
			"pre_auth_code": authCode,
			"session_info":
			{
				"appid": [agentid],
				"auth_type": 0
			}
		}, {
			params: {
				suite_access_token: suite_access_token,
			},
		})
	});

	return { suiteId, timestamp, authCode, suite };
};

// 拘束需要自己调用这个对比信息
//https://open.work.weixin.qq.com/api/doc/10975#%E8%8E%B7%E5%8F%96%E4%BC%81%E4%B8%9A%E6%8E%88%E6%9D%83%E4%BF%A1%E6%81%AF
export const change_auth = async (data) => {
	const suiteId = getXmlCDATA(data, "SuiteId");
	const timestamp = getXmlValue(data, "TimeStamp");
	const authCorpId = getXmlCDATA(data, "AuthCorpId");
	return { suiteId, timestamp, authCorpId };
};

export const cancel_auth = async (data) => {
	const suiteId = getXmlCDATA(data, "SuiteId");
	const timestamp = getXmlValue(data, "TimeStamp");
	const authCorpId = getXmlCDATA(data, "AuthCorpId");
	return { suiteId, timestamp, authCorpId };
};
