// http://httpbin.org/get?answer=42
// curl https://api.myip.com -x 207.148.123.54:32022
const axios = require('axios');
const responsePromise = async () => {
 const { data } = await axios.get('https://api.my-ip.io/ip', {
    proxy: {
        protocol: 'http',
        host: '207.148.123.54',
        port: 32022
    }
  });
  console.log(data)
}
responsePromise()