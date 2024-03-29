const { gen, api_responses } = require("../utilities/create_response");
const eventModel = require("../models/event.model");
const _ = require("lodash");

module.exports.get = (req, res) => {
    // Accepts pagination parameters //
    if (!req.query.offset || !req.query.limit) return res.send(gen({ code: api_responses.INVALID_QUERY, message: "You must supply pagination parameters (offset/limit) with your request." }));
    eventModel.find({}, { __v: 0, _id: 0 }).sort("-timestamp").then(results => {
        let results_paginated = _.take(_.drop(results, req.query.offset), req.query.limit);
        results_paginated.forEach(element => {
            if (element.type === "DETECTED_FACE") element.image = (process.env.LOCAL === "true" ? "http://localhost:5000/uploaded/faces/" : "https://api.homesecurity.jakestringer.dev/uploaded/faces/") + element.image;
        });
        return res.send(gen({ payload: results_paginated }));
    })
}

module.exports.status = async (req, res) => {
    // Get latest PI_STATUS and ARM_SYSTEM //
    var piStatus = await eventModel.find({ type: "PI_ONLINE" }, { value: 1, _id: 0 }).sort("-timestamp").limit(1);
    var armedStatus = await eventModel.find({ type: "ARM_SYSTEM" }, { value: 1, _id: 0 }).sort("-timestamp").limit(1);

    if (piStatus && armedStatus) {
        return res.send(gen({ payload: { piStatus: piStatus[0], armedStatus: armedStatus[0] } }));
    } else return res.send(gen({ code: api_responses.INVALID_QUERY }));
}