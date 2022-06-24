// https://www.youtube.com/watch?v=6l0Ij6S-Z-Q
// http://httpbin.org/get?answer=42
// curl https://api.myip.com -x http://[2001:19f0:4400:6493:5400:04ff:fe0b:3e77]:32022
const axios = require('axios');
const responsePromise = async () => {
 const { data } = await axios.get('https://api.my-ip.io/ip', {
    proxy: {
        protocol: 'http',
        host: '[2001:19f0:4400:6493:5400:04ff:fe0b:3e77]',
        // host: '2001:19f0:4400:6493:5400:04ff:fe0b:3e77::1',
        port: 32022
    }
  });
  console.log(data)
}
responsePromise()