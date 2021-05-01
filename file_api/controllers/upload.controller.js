const {gen, api_responses} = require("../utilities/create_response");
const sharp = require("sharp");
const eventModel = require("../models/event.model");
const Jimp = require("jimp");

module.exports.upload = (req, res) => {
    if(!req.files) return res.send(gen({code: api_responses.NO_FILES}));
    if(!req.files.feed || !req.body.detected_face) return res.send(gen({code: api_responses.INVALID_BODY, message: "You must include an image with the key 'feed' as part of your request, and a boolean value called 'detected_face'."}));

    // Read the image //
    const file = req.files.feed;
    
    // Resize the image to a web-friendly size //
    const sharp_image = sharp(file.data);
    sharp_image.resize({height: 500, width: 500})
    
    // Is it a detected face? If so, we need to save it elsewhere //
    if(req.body.detected_face.toLowerCase() === "true") {
        let filename = "detected-face-" + Date.now().valueOf() + ".jpg";
        sharp_image.toFile("./uploaded/faces/" + filename).then(() => {
            // Make a new event //
            let event = new eventModel({
                type: "DETECTED_FACE",
                timestamp: Date.now(),
                value: "TRUE",
                image: filename
            });
            event.save().then(() => {
                try {
                    editSavedImage("./uploaded/faces/" + filename, true);
                } catch (err) {
                    return res.send(gen({code: api_responses.JIMP_ERROR, message: err}))
                }
                return res.send(gen({}));
            })
        });
    } else {
        sharp_image.resize({height: 500, width: 500}).toFile("./uploaded/feed.jpg").then(() => {
            try {
                editSavedImage("./uploaded/feed.jpg", false);
            } catch (err) {
                return res.send(gen({code: api_responses.JIMP_ERROR, message: err}))
            }
            return res.send(gen({}));
        });
    }   
}

const editSavedImage = (path, detected_face) => {
    Jimp.read(path, (err, img) => {
        if(err) throw err;
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => {
            if(detected_face) {
                Jimp.read("./assets/rect.png", (rect_err, rect) => {
                    if(rect_err) throw rect_err;
                    rect.resize(150, 150);
                    img.blit(rect, 100, 150).print(font, 125, 130, "Detected Face").write(path);
                })
            } else {
                Jimp.read("./assets/scanning.png", (scan_err, scan) => {
                    if(scan_err) throw scan_err;
                    scan.scale(0.5);
                    img.blit(scan, 0, 0).write(path);
                })
            }
        })
    })
}