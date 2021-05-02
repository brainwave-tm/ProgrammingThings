const {gen, api_responses} = require("../utilities/create_response");
const sharp = require("sharp");
const eventModel = require("../models/event.model");
const Jimp = require("jimp");

module.exports.upload = (req, res) => {
    if(!req.files) return res.send(gen({code: api_responses.NO_FILES}));
    if(!req.files.feed) return res.send(gen({code: api_responses.INVALID_BODY, message: "You must include an image with the key 'feed' as part of your request"}));

    req.body = JSON.parse(JSON.stringify(req.body));

    // Validate the request //
    if(req.body.detected === undefined) return res.send(gen({code: api_responses.INVALID_BODY, message: "Couldn't find 'detected' in your body"}));
    
    if(req.body.detected === "true") {
        if(req.body.name === undefined) return res.send(gen({code: api_responses.INVALID_BODY, message: "Couldn't find 'name' in your body"}));
        if(req.body.coords === undefined) return res.send(gen({code: api_responses.INVALID_BODY, message: "Couldn't find 'coords' in your body"}));
    }

    // Read the image //
    const file = req.files.feed;
    
    // Resize the image to a web-friendly size //
    const sharp_image = sharp(file.data);
    sharp_image.resize({height: 480, width: 640})
    
    // Is it a detected face? If so, we need to save it elsewhere //
    if(req.body.detected.toLowerCase() === "true") {
        let filename = "detected-face-" + Date.now().valueOf() + ".jpg";
        sharp_image.toFile("./uploaded/faces/" + filename).then(() => {
            // Make a new event //
            let event = new eventModel({
                type: "DETECTED_FACE",
                timestamp: Date.now(),
                value: req.body.name,
                image: filename
            });
            event.save().then(() => {
                try {
                    editSavedImage("./uploaded/faces/" + filename, req.body.coords, req.body.name);
                } catch (err) {
                    return res.send(gen({code: api_responses.JIMP_ERROR, message: err}))
                }
                return res.send(gen({}));
            })
        });
    } else {
        sharp_image.toFile("./uploaded/feed.jpg").then(() => {
            try {
                editSavedImage("./uploaded/feed.jpg");
            } catch (err) {
                return res.send(gen({code: api_responses.JIMP_ERROR, message: err}))
            }
            return res.send(gen({}));
        });
    }   
}

const editSavedImage = (path, coords, name) => {
    Jimp.read(path, (err, img) => {
        if(err) throw err;
        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
            if(coords) {
                if(name === "Unknown") {
                    Jimp.read("./assets/rect_unrecognised.png", (rect_err, rect) => {
                        if(rect_err) throw rect_err;
                        
                        let top = eval(coords[0]);
                        let right = eval(coords[1]);
                        let bottom = eval(coords[2]);
                        let left = eval(coords[3]);
    
                        let width = right - left;
                        let height = bottom - top;
    
                        var textWidth = Jimp.measureText(font, name);
    
                        rect.resize(width, height);
                        img.blit(rect, left, top).print(font, (left + (width / 2)) - textWidth / 2, top - 40, name).write(path);
                    })
                } else {
                    Jimp.read("./assets/rect_recognised.png", (rect_err, rect) => {
                        if(rect_err) throw rect_err;
                        
                        let top = eval(coords[0]);
                        let right = eval(coords[1]);
                        let bottom = eval(coords[2]);
                        let left = eval(coords[3]);
    
                        let width = right - left;
                        let height = bottom - top;
    
                        var textWidth = Jimp.measureText(font, name);
    
                        rect.resize(width, height);
                        img.blit(rect, left, top).print(font, (left + (width / 2)) - textWidth / 2, top - 40, name).write(path);
                    })
                }
            } else {
                eventModel.findOne({type: "ARM_SYSTEM"}, {value: 1}).sort("-timestamp").then(result => {
                    if(result) {
                        if(result.value === "ARM") {
                            Jimp.read("./assets/scanning.png", (scan_err, scan) => {
                                if(scan_err) throw scan_err;
                                scan.scale(0.5);
                                img.blit(scan, 0, 0).write(path);
                            })
                        }
                    }
                })
            }
        })
    })
}