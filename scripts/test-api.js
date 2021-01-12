const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const authServerUrl = 'http://localhost:8889';
const appServerUrl = 'http://localhost:8888';

const testApi = async () => {
  const username = uuidv4();
  const password = uuidv4();
  await axios.post(`${authServerUrl}/signup`, { username, password });
  const loginResponse = await axios.post(`${authServerUrl}/login`, { username, password });

  const headers = {
    Authorization: `Bearer ${loginResponse.data}`
  };
  const createResponse = await axios.post(`
  ${appServerUrl}/api/data`, { content: uuidv4() }, { headers });
  const dataResponse = await axios.get(
    `${appServerUrl}/api/data/${createResponse.data.id}`, { headers }
  );
  console.log(dataResponse.data);
};

testApi();
