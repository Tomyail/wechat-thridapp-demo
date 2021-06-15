import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            type="text/javascript"
            src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"
          ></script>
          <script src="https://unpkg.com/vconsole/dist/vconsole.min.js"></script>
          <script>
            // VConsole will be exported to `window.VConsole` by default. var
            vConsole = new window.VConsole();
          </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
