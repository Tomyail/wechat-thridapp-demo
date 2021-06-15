import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import VConsole from 'vconsole';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import axios from 'axios';

function MyApp({ Component, pageProps, router }: AppProps) {
  const queryClientRef = React.useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  useEffect(() => {
    axios
      .get('/api/signature', {
        params: { url: encodeURIComponent(window.location.href.split('#')[0]) },
      })
      .then((res) => {
        const { nonceStr, signature, timestamp } = res.data;
				console.log(`nonceStr: ${nonceStr}, signature: ${signature}, timestamp:${timestamp}`,)
        wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug:true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'ww21627baa170262b5', // 必填，企业微信的corpID
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: [
            'checkJsApi',
            'onMenuShareAppMessage',
            'onMenuShareWechat',
            'onMenuShareTimeline',
            'shareAppMessage',
            'shareWechatMessage',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'closeWindow',
            'scanQRCode',
            'previewFile',
            'openEnterpriseChat',
            'selectEnterpriseContact',
            'onHistoryBack',
            'openDefaultBrowser',
          ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });

        wx.ready(function () {
          console.log('ready');
          // wx.checkJsApi({
          //   jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          //   success: function (res) {
          //     console.log('checkJsApi', res);
          //     // 以键值对的形式返回，可用的api值true，不可用为false
          //     // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          //   },
          // });
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
        wx.error(function (res) {
          alert(JSON.stringify(res));
          // console.error(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      });
    // const { data } = useQuery('posts', getPosts, { initialData: props.posts })
    console.log('r', pageProps);

    // console.log('xxx', Component, wx.config);
  }, [Component]);

  useEffect(() => {}, []);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
export default MyApp;

MyApp.getInitialProps = async (ctx: any) => {
  return { foo: 'bar' };
};
