const { ReclaimProofRequest } = require('@reclaimprotocol/js-sdk')
require('dotenv').config() // Load environment variables
const winston = require('winston')


const express = require('express')
const cors = require('cors')

const app = express()
const port = 3002

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(express.json())
app.use(express.text({ type: '*/*', limit: '50mb' }));


// Route to receive proofs
app.post('/receive-proofs', (req, res) => {
  try {
    const decodedBody = decodeURIComponent(req.body);
    const proofData = JSON.parse(decodedBody);

    // TODO: Process the proof data here

    return res.sendStatus(200);
  } catch (error) {
    logger.error('Error processing proofs:', error);
    return res.status(400).json({ error: 'Invalid proofs data' });
  }
})

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // You can add more transports like File if needed
  ],
})

// Route to generate SDK configuration
app.get('/reclaim/generate-config', async (req, res) => {
  const APP_ID = '0x797cEd94485d46C69AebFAcAd788A6312bBDC23F'
  const APP_SECRET = process.env.APP_SECRET
  const PROVIDER_ID = '5eb7f8b3-cbe8-4001-848e-cb161e53fe60'

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)

    reclaimProofRequest.setAppCallbackUrl('https://d723-49-37-251-143.ngrok-free.app/receive-proofs')

    const requestUrl = await reclaimProofRequest.getRequestUrl()

    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()

    return res.json({ requestUrl, reclaimProofRequestConfig })
  } catch (error) {
    logger.error('Error generating request config:', error)
    return res.status(500).json({ error: 'Failed to generate request config' })
  }
})

// Route to receive proofs
app.post('/receive-proofs', (req, res) => {
  try {
    // const decodedBody = decodeURIComponent(req.body);
    console.log('req.body', req.body)
    const proofData = JSON.parse(req.body);
    console.log('proofData', proofData)
    logger.info('Proof data:', proofData);

    // TODO: Process the proof data here

    return res.sendStatus(200);
  } catch (error) {
    logger.error('Error processing proofs:', error);
    return res.status(400).json({ error: 'Invalid proofs data' });
  }
})

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`)
})