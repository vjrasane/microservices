const axios = require('axios');
const https = require('https');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const testApi = async () => {
  const username = uuidv4();
  const password = uuidv4();

  const httpsAgent = new https.Agent({
    ca: fs.readFileSync('./volumes/certs/ssl/ca.pem')
  });

  await axios.post('https://localhost/auth/signup',
    { username, password }, { httpsAgent });
  const loginResponse = await axios.post('https://localhost/auth/login',
    { username, password }, { httpsAgent });

  const headers = {
    Authorization: `Bearer ${loginResponse.data}`
  };
  const createResponse = await axios.post(
    'https://localhost/api/data', { content: uuidv4() }, { headers, httpsAgent }
  );
  const dataResponse = await axios.get(
    `https://localhost/api/data/${createResponse.data.id}`, { headers, httpsAgent }
  );
  /* eslint-disable-next-line no-console */
  console.log(dataResponse.data);
};

testApi();
