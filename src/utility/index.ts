import Axios from 'axios'
import { load as cheerioLoad } from 'cheerio'
import md5 from 'crypto-js/md5';
import getSlug from 'slug'
import { SocksProxyAgent } from 'socks-proxy-agent';

const proxyOptions = `socks5://45.77.250.86:9050`;
const httpsAgent = new SocksProxyAgent(proxyOptions);

const trimValue = s => (s || '').trim()
const getHash = s => s && md5(trimValue(s)).toString()
const axios = Axios.create({ httpsAgent, timeout: 60000 });

const forceFunction = async callback => {
  let times = 10
  while (times > 0) {
    try {
      return await callback()
    } catch (error) {
      console.log('try times', --times)
    }
  }
}

export {
  axios,
  cheerioLoad,
  trimValue,
  getHash,
  getSlug,
  forceFunction
}