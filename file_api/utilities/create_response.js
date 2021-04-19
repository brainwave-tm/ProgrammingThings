// Creates a standardised response to send back to the front-end //
const api_responses = require("./api_responses.json");

function generate_response({code=api_responses.OK, payload=null, message=null}) {
     // A status of 1 means a request was successful. A response with no payload may still be considered a success if the code is OK //
     const sentStatus = (payload === null) ? (code === api_responses.OK ? 1 : 0) : 1;
     const sentCode  = (payload === null) ? code.name : api_responses.OK.name;
     const sentMessage = message !== null ? message : code.detail;
 
     return {
        status: sentStatus,
        code: sentCode,
        message: sentMessage,
        payload: payload
     };
}

module.exports = {
    gen: generate_response,
    api_responses: api_responses
}