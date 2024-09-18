import axios from 'axios';

let u = {};

u.makeRequest = function(options) {
  options.headers = {authorization: user}

  return axios.request(options)
  .then(res => {
    return res;
  })
  .catch(err => {
    console.log(err);
  })
}

export default u;
