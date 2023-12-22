import modifyCookies from "./modifyCookies.js";

const Socket = (socket) => {
  const { headers, time } = socket.handshake;

  const { host, origin, cookie } = headers;

  const cookies = modifyCookies(cookie);

  return { cookies, host, origin, time };
};

export default Socket;

// {
//     headers: {
//       host: 'localhost:8000',
//       connection: 'keep-alive',
//       'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
//       accept: '*/*',
//       dnt: '1',
//       'sec-ch-ua-mobile': '?0',
//       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//       'sec-ch-ua-platform': '"Windows"',
//       origin: 'http://localhost:5173',
//       'sec-fetch-site': 'same-site',
//       'sec-fetch-mode': 'cors',
//       'sec-fetch-dest': 'empty',
//       referer: 'http://localhost:5173/',
//       'accept-encoding': 'gzip, deflate, br',
//       'accept-language': 'en-US,en;q=0.9',
//       cookie: '_at=ksdjfdklcasdkdsa; _cta=asdnklfdasfdjncjdkscds'
//     },
//     time: 'Thu Dec 21 2023 12:06:52 GMT+0530 (India Standard Time)',
//     address: '::1',
//     xdomain: true,
//     secure: false,
//     issued: 1703140612669,
//     url: '/socket.io/?EIO=4&transport=polling&t=OoB5rcC',
//     query: [Object: null prototype] {
//       EIO: '4',
//       transport: 'polling',
//       t: 'OoB5rcC'
//     },
//     auth: {}
//   }
