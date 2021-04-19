const {gen, api_responses} = require("../utilities/create_response");
const sharp = require("sharp");

module.exports.upload = (req, res) => {
    if(!req.files) return res.send(gen({code: api_responses.NO_FILES}));
    if(!req.files.feed) return res.send(gen({code: api_responses.INVALID_BODY, message: "You must include an image with the key 'feed' as part of your request."}));

    // Read the image //
    const file = req.files.feed;
    
    // Resize the image to a web-friendly size //
    const sharp_image = sharp(file.data);
    sharp_image.resize({height: 500, width: 500}).toFile("./uploaded/" + Date.now().valueOf() + ".jpg").then(() => res.send(gen({})));
}