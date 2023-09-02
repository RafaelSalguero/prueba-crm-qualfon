const forge = require("node-forge");
//********************************************************
// Código hackeado del sitio
//********************************************************

/** Este API Key es resultado de hackear su sitio (no lo mencionan en el correo) */
const apiKey = "ZEAjiEmMkcMwsn430Ia7uJmtYzHiAMHV1gZqsjSmVdiiS5aNKyOM9laNvqWYrCwH"

/** El codigo de esta función es resultado de hackear su sitio y descubrir su llave de encriptado,
 * esto no lo mencionan en el correo
*/
function encryptPassword(password) {
    const appInsightKey =
    "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbB3EU0DuclgeQc5WoDMvj/j/vl1EyPWVtdQPgJrl8ct6T7Kczj5vc/V4wEIaTcaavO5FOlns3Yx3OhhwbQxdwNXyCCCBRIZXJ9FruI1pkuvg9K2xgcJP++8Vk4ts2H6Ey0fpsH4VKOxXNqeE97ASTyOAfP8s3OBA2pj/m4CsvbQIDAQAB\n-----END PUBLIC KEY-----";
    const pubKey = forge.pki.publicKeyFromPem(appInsightKey);
    const cypher = forge.util.encode64(
        pubKey.encrypt(password, "RSAES-PKCS1-V1_5")
        );
        
        return cypher;
    }
    
//********************************************************
// Termina código hackeado del sitio
//********************************************************

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

const baseUrl = "https://cuatrocienegasservice.qualfon.com/api/";

async function login(email, password) {
    try {
        const result =  await fetch(baseUrl + "User/UserAuthentication", {
            method: "POST",
            headers: {
                ApiKey: apiKey,
                Accept: "application/json",
                "Content-Type": "application/json"
              },
            body: JSON.stringify({
                email: email,
                password: encryptPassword(password),
              }),
          })

        if(result.ok) {
            const user =  await result.json();
            const token = user.accessToken;
            if(!token) {
              throw new Error("Login failed, access token null")
            }
            return token;
        } else {
            throw new Error(result.status + " " + await result.text())
        }

        return user;
      } catch (error) {
        console.log("Couldn't log in to backend", error);
        throw error;
      }
}

(async () => {
    const prompt = require("prompt-sync")();
    const email = prompt("email?", "imonterrubio@exagono.net")
    console.log(email);

    const password = prompt("password?", "Plan2040$")
    console.log(password);


    const accessToken = await login(email, password);
    console.log("Logged in to API, accessToken:", accessToken);

})();