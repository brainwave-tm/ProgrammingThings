const {gen, api_responses} = require("../utilities/create_response");
const sharp = require("sharp");

module.exports.upload = (req, res) => {
    if(!req.files) return res.send(gen({code: api_responses.NO_FILES}));
    if(!req.files.feed || !req.body.detected_face) return res.send(gen({code: api_responses.INVALID_BODY, message: "You must include an image with the key 'feed' as part of your request, and a boolean value called 'detected_face'."}));

    // Read the image //
    const file = req.files.feed;
    
    // Resize the image to a web-friendly size //
    const sharp_image = sharp(file.data);
    sharp_image.resize({height: 500, width: 500})
    
    // Is it a detected face? If so, we need to save it elsewhere //
    if(req.body.detected_face === "true") {
        sharp_image.toFile("./uploaded/faces/detected-face-" + Date.now().valueOf() + ".jpg").then(() => res.send(gen({})));
    } else {
        sharp_image.resize({height: 500, width: 500}).toFile("./uploaded/feed.jpg").then(() => res.send(gen({})));
    }   
}