import { Location } from 'history'
import qs from 'qs'
export const getQuery = (location: Location, searchFirst = true) => {
	const search = qs.parse(location.search, { ignoreQueryPrefix: true })
	const hash = qs.parse(location.hash.replace(/#\//g, "").replace(/#/g, ""), { ignoreQueryPrefix: true })
	return searchFirst ? { ...hash, ...search } : { ...search, ...hash }
}


export const nativeLocationToLib = (): Location => {
	// 微信有时候拼的 url 是这样的
	// http://localhost:3001/?code=uFjFPfYI33J6unPJdWE2S_l3E5r0qk8043MI7Zbja94&state=STATE#/?corpId=wx274afe64c460e0a1&xx=1
	const l = window.location
	return {
		hash: l.hash,
		pathname: l.pathname,
		search: l.search,
		state: {},
	}

}
