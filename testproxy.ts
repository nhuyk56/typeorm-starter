// https://www.youtube.com/watch?v=6l0Ij6S-Z-Q
// http://httpbin.org/get?answer=42
// curl https://api.myip.com -x http://[2001:19f0:4400:6493:5400:04ff:fe0b:3e77]:32022
import { SocksProxyAgent } from 'socks-proxy-agent';
const proxyOptions = `socks5://45.77.250.86:9050`;
const agent = new SocksProxyAgent(proxyOptions);

const axios = require('axios');
const responsePromise = async () => {
 const { data } = await axios.get('http://httpbin.org/get?answer=42', { httpAgent: agent, httpsAgent: agent });
  console.log(data)
}
responsePromise()