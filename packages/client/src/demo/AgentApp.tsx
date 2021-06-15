import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getQuery } from '../utils/get-query';
import useScript from './useScript';

//https://work.weixin.qq.com/api/doc/90001/90144/94325
const AgentApp = () => {
  const [state, setState] = useState<ReactNode>('');
  const status = useScript(
    'https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js'
  );

  const query = getQuery(useLocation());

  useEffect(() => {
    if (status === 'ready') {
      axios
        .get(`${process.env.REACT_APP_SERVER_HOST}/api/agent-signature`, {
          params: {
            corpId: query.corpId,
            url: encodeURIComponent(window.location.href.split('#')[0]),
          },
        })
        .then(
          ({
            data: {
              agentid,
              timestamp,
              nonceStr,
              signature,
              jsApiList,
              corpid,
            },
          }) => {
            //@ts-expect-error
            wx.agentConfig({
              corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp, // 必填，生成签名的时间戳
              nonceStr, // 必填，生成签名的随机串
              signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList, //必填，传入需要使用的接口名称
              success: function (res: any) {
                setState('成功' + JSON.stringify(res, null, 2));
              },
              fail: function (res: any) {
                setState('失败' + JSON.stringify(res, null, 2));
                // if (res.errMsg.indexOf('function not exist') > -1) {
                //   alert('版本过低请升级');
                // }
              },
            });
          }
        );
    }
    if (status === 'error') {
      setState('failed to load script');
    }
  }, [status, query.corpId]);

  return <div>{state}</div>;
};

export default AgentApp;
