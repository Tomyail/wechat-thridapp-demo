import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getQuery } from '../utils/get-query';
import useScript from './useScript';

// https://work.weixin.qq.com/api/doc/90001/90144/90547
const MergeApp = () => {
  const [state, setState] = useState<ReactNode>('test');
  const appStatus = useScript(
    'https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js'
  );
  const corpStatus = useScript(
    'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'
  );

  const query = getQuery(useLocation());
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOST}/api/signature`, {
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
            appJsApiList,
            corpJsApiList,
            corpid,
            corpSignature,
            appSignature,
          },
        }) => {
          //@ts-expect-error
          wx.ready(function () {
            //@ts-expect-error
            console.log(!!wx.agentConfig, Object.keys(wx).sort(),agentid);
            //@ts-expect-error
            wx.agentConfig({
              corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp, // 必填，生成签名的时间戳
              nonceStr, // 必填，生成签名的随机串
              signature: appSignature, // 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList: appJsApiList, //必填，传入需要使用的接口名称
              success: function (res: any) {
                console.log('成功' + JSON.stringify(res, null, 2));

                //@ts-expect-error
                wx.invoke('getContext', {}, function (res) {
                  console.log('getContext' + JSON.stringify(res));
                });
              },
              fail: function (res: any) {
                console.log('失败' + JSON.stringify(res, null, 2));
                // if (res.errMsg.indexOf('function not exist') > -1) {
                //   alert('版本过低请升级');
                // }
              },
            });

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            console.log('ready success');
          });

          //@ts-expect-error
          wx.config({
            beta: true,
            debug: true,
            appId: corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            // agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature: corpSignature, // 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: corpJsApiList, //必填，传入需要使用的接口名称
            success: function (res: any) {
              // 回调
              console.log('成功' + JSON.stringify(res, null, 2));
            },
            fail: function (res: any) {
              console.log('失败' + JSON.stringify(res, null, 2));
            },
          });
        }
      );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', height: '300px', wordBreak: 'break-all' }}>
      {state}
    </div>
  );
};

export default MergeApp;
