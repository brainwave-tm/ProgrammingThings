const {gen, api_responses} = require("../utilities/create_response");
const eventModel = require("../models/event.model");
const _ = require("lodash");

module.exports.post = (req, res) => {
    // Create a new event //
    let event = new eventModel(req.body);
    event.timestamp = Date.now();
    event.validate((err) => {
        if(err) return res.send(gen({code: api_responses.INVALID_BODY, message: err.message}))
        event.save()
            .then(doc => res.send(gen({payload: doc})))
            .catch(err => res.send(gen({code: api_responses.MONGODB_ERROR, message: err})));
    })
}

module.exports.get = (req, res) => {
    // Accepts pagination parameters //
    if(!req.query.offset || !req.query.limit) return res.send(gen({code: api_responses.INVALID_QUERY, message: "You must supply pagination parameters (offset/limit) with your request."}));
    eventModel.find({}, {__v: 0, _id: 0}).sort("-timestamp").then(results => {
        let results_paginated = _.take(_.drop(results, req.query.offset), req.query.limit);
        return res.send(gen({payload: results_paginated}));
    })
}

module.exports.status = (req, res) => {
    // Get latest PI_STATUS //
    eventModel.find({type: "PI_ONLINE"}, {value: 1, _id: 0}).limit(1).then(result => {
        if(result) {
            return res.send(gen({payload: result[0]}));
        } else return res.send(gen({code: api_responses.INVALID_QUERY}));
    })
}