import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getQuery } from '../utils/get-query';
import useScript from './useScript';

// https://work.weixin.qq.com/api/doc/90001/90144/90547
const ConfigApp = () => {
  const [state, setState] = useState<ReactNode>('');
  const status = useScript('https://res.wx.qq.com/open/js/jweixin-1.2.0.js');

  const query = getQuery(useLocation());
  useEffect(() => {
    if (status === 'ready') {
      axios
        .get(`${process.env.REACT_APP_SERVER_HOST}/api/config-signature`, {
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
            wx.config({
              beta: true,
              debug: true,
              appId: corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
              // agentid, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp, // 必填，生成签名的时间戳
              nonceStr, // 必填，生成签名的随机串
              signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList, //必填，传入需要使用的接口名称
              success: function (res: any) {
                // 回调
                setState('成功' + JSON.stringify(res, null, 2));
              },
              fail: function (res: any) {
                setState('失败' + JSON.stringify(res, null, 2));
              },
            });

            //@ts-expect-error
            wx.ready(function () {
              // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
              setState('ready success');

              // wx.invoke('getContext', {}, function (res) {
              // 	setState('getContext'+JSON.stringify(res));
              // });

              //@ts-expect-error
              wx.startRecord();

              setTimeout(() => {
                //@ts-expect-error
                wx.stopRecord({
                  success: function (res: any) {
                    //@ts-expect-error
                    wx.onVoicePlayEnd({
                      success: function (res: any) {
                        var localId = res.localId; // 返回音频的本地ID
                        //@ts-expect-error

                        wx.uploadVoice({
                          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                          isShowProgressTips: 1, // 默认为1，显示进度提示
                          success: function (res: any) {
                            var serverId = res.serverId; // 返回音频的服务器端ID
                            console.log('上传后的id', serverId);
                          },
                        });
                      },
                    });
                    var localId = res.localId;
                    //@ts-expect-error
                    wx.playVoice({
                      localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
                    });
                  },
                });
              }, 5000);
            });
          }
        );
    }
  }, [status, query.corpId]);

  return <div>{state}</div>;
};

export default ConfigApp;
