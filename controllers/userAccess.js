const Visitor = require("../models/Visitor");

module.exports.getOnlines = (req, res) => {
  try {
    Visitor.find({ online: "true" }, (err, visitors) => {
      if (visitors) {
        return res.json({ online: visitors });
      }
      return res.json({ online: " NO ONE" });
    });
  } catch (error) {
    return res.sendStatus(404);
  }
};
module.exports.getAccessCount = (req, res) => {
  try {
    Visitor.find({}, (err, visitors) => {
      if (visitors) {
        let sum = 0;
        visitors.forEach(x => {
          sum += x.visitCount;
        });
        return res.json({ "Access total": sum });
      }
      return res.json({ "Access total": 00000 });
    });
  } catch (error) {
    return res.sendStatus(404);
  }
};
