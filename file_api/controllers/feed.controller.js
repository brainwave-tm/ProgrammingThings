const {gen, api_responses} = require("../utilities/create_response");
const fs = require("fs");
const _ = require("lodash");

module.exports.recent_faces = (req, res) => {
    if(!req.query.offset || !req.query.limit) return res.send(gen({code: api_responses.INVALID_QUERY, message: "You must supply pagination parameters (offset/limit) with your request."}))
    
    // Read all the files in the 'uploaded' folder //
    var files = fs.readdirSync("./uploaded/faces");
    files.sort().reverse(); // Since their filenames are numerical dates, calling the default sort() will sort them by date order, so we need to reverse this order //

    // Paginate and iterate over the sorted files to add the URL //
    var paginated_files = _.drop(_.take(files, req.query.limit), req.query.offset).map(file => (process.env.LOCAL === "true" ? "http://localhost:5000/uploaded/faces/" : "https://api.homesecurity.jakestringer.dev/uploaded/faces/") + file);

    return res.send(gen({payload: paginated_files}))
}