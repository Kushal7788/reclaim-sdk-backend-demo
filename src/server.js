const express = require('express')
const { ReclaimProofRequest } = require('@reclaimprotocol/js-sdk')
const cors = require('cors')
require('dotenv').config() // Load environment variables

const app = express()
const port = 3002

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // For parsing URL-encoded bodies

// Route to generate SDK configuration
app.get('/reclaim/generate-config', async (req, res) => {
    const APP_ID = '0x797cEd94485d46C69AebFAcAd788A6312bBDC23F'
    const APP_SECRET =  process.env.APP_SECRET
    const PROVIDER_ID = '5eb7f8b3-cbe8-4001-848e-cb161e53fe60'
  
    try {
      const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)
      
      reclaimProofRequest.setAppCallbackUrl('https://reclaim-backend-demo.onrender.com/receive-proofs')
      
      const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()
  
      return res.json({ reclaimProofRequestConfig })
    } catch (error) {
      console.error('Error generating request config:', error)
      return res.status(500).json({ error: 'Failed to generate request config' })
    }
  })
  
  // Route to receive proofs
  app.post('/receive-proofs', (req, res) => {
    const proofs = req.body
    console.log('Received proofs:', proofs)
    // Process the proofs here
    return res.sendStatus(200)
  })
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })