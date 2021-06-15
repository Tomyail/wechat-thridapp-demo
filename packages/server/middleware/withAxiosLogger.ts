import axios from 'axios';
import * as AxiosLogger from 'axios-logger';
import { createLogger } from '../utils/logger';


const logger = createLogger('axios')


//@ts-expect-error
export default next => async (req, res) => {
	if (!global.inited) {
		AxiosLogger.setGlobalConfig({
			prefixText: '',
			// dateFormat: 'HH:MM:ss',
			status: false,
			headers: true,
			logger: logger.info.bind(logger),
		});
		console.log('xxx')
		axios.interceptors.request.use(AxiosLogger.requestLogger);
		axios.interceptors.response.use(AxiosLogger.responseLogger);
		global.inited = true
	}

	return next(req, res)
}
