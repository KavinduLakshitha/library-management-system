import React, { useEffect } from 'react';
import crypto from 'crypto';
import axios from 'axios';

const DHKeyExchange = () => {
  useEffect(() => {
    const initiateDHKeyExchange = async () => {
      try {
        // Generate Diffie-Hellman parameters
        const dhParams = crypto.getDiffieHellman('modp14');
        const clientPrivateKey = dhParams.generateKeys();
        const clientPublicKey = dhParams.getPublicKey();

        // Initiate Diffie-Hellman key exchange with the server
        const response = await axios.post('http://localhost:5000/api/dh-exchange', {
          publicKey: clientPublicKey,
        });

        const serverPublicKey = response.data.serverPublicKey;
        const sharedSecret = dhParams.computeSecret(serverPublicKey);


        console.log('Diffie-Hellman key exchange completed.');
      } catch (error) {
        console.error('Failed to perform Diffie-Hellman key exchange:', error);
      }
    };

    initiateDHKeyExchange();
  }, []);

  return null;
};

export default DHKeyExchange;