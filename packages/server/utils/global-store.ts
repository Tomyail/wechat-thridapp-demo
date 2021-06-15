import { createLogger } from "./logger";

/**
 * 单机 redis
 */
type Value = { value: any; createAt: number; expiredAt: number };
type Store = Record<string, Value>;
global.store = {};
const store = global.store
export { store  }
const isValid = (data: Value) => {
	if (data.expiredAt) {
		if (Date.now() >= data.expiredAt) {
			return false;
		}
		return false;
	}

	return true;
};
export const getValue = (store: Store, name: string) => {
	if (store[name]) {
		if (isValid(store[name])) {
			return store[name].value;
		}
		return null;
	}
	return null;
};

/**
 *
 * @param name
 * @param value
 * @param expires_in 有效时长，单位秒
 */
export const setValue = (
	store: Store,
	name: string,
	value: any,
	expires_in?: number
) => {
	const v: Value = {
		value: value,
		createAt: Date.now(),
		expiredAt: expires_in ? Date.now() + expires_in * 1000 : 0,
	};

	store[name] = v;
	global.store = store;
	return v.value;
};
