const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Generate Diffie-Hellman parameters
const dhParams = crypto.getDiffieHellman('modp14');
const serverPrivateKey = dhParams.generateKeys();

router.post('/', (req, res) => {
  const clientPublicKey = req.body.publicKey;
  const serverPublicKey = dhParams.getPublicKey();
  const sharedSecret = dhParams.computeSecret(clientPublicKey);

  res.json({ serverPublicKey });
});

module.exports = router;