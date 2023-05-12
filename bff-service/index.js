const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

app.all('/*', async (req, res) => {
	console.log(`Requers: url - ${req.originalUrl}, method - ${req.method}, body - ${req.body}`);

	const service = req.originalUrl.split('/')[1];
	console.log('service', service);

	const serviceUrl = process.env[service];
	console.log('serviceUrl', serviceUrl);
	if (serviceUrl) {
		try {
			const result = await axios({
				method: req.method,
				url: `${req.serviceUrl}${req.originalUrl}`,
				...(Object.keys(req.body || {}).length > 0 && { data: req.body })
			})

      return res.json(result.data);
		} catch (error) {
			console.log(error);

      if(error.response) {
        const { status, data } = error.response;
        res.status(status).json(data);
      } else {
        res.status(500).json({ error: error.message })
      }
		}
	} else {
    res.status(502).json({ error: 'Unknown request' })
  }
})

app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
