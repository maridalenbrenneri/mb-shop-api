var express = require("express");
var router = express.Router();

router.get("/:id?", function (req, res) {

    var productId = req.params.id;
    var provider = req.get('X-Header-Provider');

    res.send("Hello from products route " + productId);
    // tourService.getTour(tourId, req, function (tour) {
    //     res.send(tour);
    // });
});

router.get("/", function(req, res) {
    
    res.send("All products...");

});


module.exports = router;