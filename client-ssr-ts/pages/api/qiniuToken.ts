const accessKey = 'DSv5nxf6v8enlZKDekLq17e-w5Ad7aYPFLAXSvtu';
const secretKey = '7YELtmkrMYrb9g99iyXdNnEiBlmz1jzIp7aTbB7Q';
const bucket = 'justpeth';

export default (req, res) => {
  console.log(req)

  res.end(`Post: 123`)
}

// db.createUser({user: 'mewants-blog', pwd: 'mewants', roles: [{"role": "readWrite", "db": "h-blog"}]})