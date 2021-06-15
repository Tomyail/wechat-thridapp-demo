import axios from "axios";
import getSuiteAccessToken from "./get-suite-access-token";
import getSuiteTicket from "./get-suite-ticket";
import { getValue, setValue, store } from "./global-store";
import { createLogger } from "./logger";

const logger = createLogger("获取用户信息");
//https://work.weixin.qq.com/api/doc/90001/90143/91121
// https://work.weixin.qq.com/api/doc/90001/90143/91711
export const getUserInfo = async (code: string) => {

	const suite_access_token = await getSuiteAccessToken()
	const {
		data,
	} = await axios.get(
		"https://qyapi.weixin.qq.com/cgi-bin/service/getuserinfo3rd",
		{
			params: {
				suite_access_token, code
			}
		}
	);

	return data

	// if (data.OpenId) {
	// 	logger.info('用户不属于任何企业 %s', data.OpenId)
	// 	return data;
	// }
	// else {
	// 	logger.info('用户属于某个企业 %o', data)
	// 	if (data.user_ticket) {
	// 		const {
	// 			data: userDetail,
	// 		} = await axios.post(
	// 			"https://qyapi.weixin.qq.com/cgi-bin/service/getuserinfo3rd",
	// 			{
	// 				"user_ticket": data.user_ticket,
	// 				suite_access_token
	// 			},
	// 			{
	// 				params: {
	// 					suite_access_token
	// 				}
	// 			}
	// 		);

	// 		return { data, userDetail }
	// 	}
	// }
};

export default getSuiteAccessToken;
