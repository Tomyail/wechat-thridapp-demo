import { decrypt, getSignature } from "@wecom/crypto";

/**
 * @param token 固定值，来自应用配置里面的“回调配置”的token
 * @param expectSignature 微信回调给到的签名信息
 * @param timestamp 微信回调给到的时间戳
 * @param nonce 微信回调给到的nonce
 * @param echostr 微信回调给到的加密消息
 */
export const checkCallbackSignatureMatch = (
  token: string,
  expectSignature: string,
  timestamp: string,
  nonce: string,
  echostr: string
) => {
  const dev_msg_signature = getSignature(token, timestamp, nonce, echostr);
  return dev_msg_signature === expectSignature;
};

export const decryptEchoStr = (encodingAesKey: string, echostr: string) => {
  const { id, message, random } = decrypt(encodingAesKey, echostr);
  return { id, message };
};
