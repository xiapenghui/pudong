/**
 * 加密数据
 * @param {type} data 待加密的字符串
 * @param {type} keyStr 秘钥
 * @param {type} ivStr 向量
 * @returns {unresolved} 加密后的数据
 */


var AesUtil = function(keySize, iterationCount) {
  this.keySize = keySize / 32;
  this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function(salt, passPhrase) {
  var key = CryptoJS.PBKDF2(
      passPhrase, 
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });
  return key;
}

AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
  var key = this.generateKey(salt, passPhrase);
  var encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
  var key = this.generateKey(salt, passPhrase);
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  });
  var decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

AesUtil.prototype.aesEncrypt = function(data, keyStr, ivStr) {
    var sendData = CryptoJS.enc.Utf8.parse(data);
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv  = CryptoJS.enc.Utf8.parse(ivStr);
    var encrypted = CryptoJS.AES.encrypt(sendData, key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};
/**
 * 
 * @param {type} data BASE64的数据
 * @param {type} key 解密秘钥
 * @param {type} iv 向量
 * @returns {undefined} 
 */
AesUtil.prototype.aesDecrypt = function(data, keyStr, ivStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv  = CryptoJS.enc.Utf8.parse(ivStr);
    //解密的是基于BASE64的数据，此处data是BASE64数据
    var decrypted = CryptoJS.AES.decrypt(data, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding});
    return decrypted.toString(CryptoJS.enc.Utf8);
};
