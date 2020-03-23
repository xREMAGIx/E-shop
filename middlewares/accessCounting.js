const dns = require('dns');
const os = require('os');
const Visitor = require('../models/visitor');
const socket = require('socket.io');


module.export.counting = (req, res, next) => {
    io.on('connection', function (socket) {
        try {
            dns.lookup(os.hostname(), function (err, ip, fam) {
                if (err) throw err;
                Visitor.findOne({ ip: ip }, (err, visitor) => {
                    if (visitor) {
                        let num = visitor.visitCount;
                        const today = new Date();
                        visitor.updateOne({
                            visitCount: ++num,
                            lastVisit: Date.parse(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + "  " + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()),
                            online: "true"
                        })
                        return next();
                    } else {
                        Visitor.create({
                            ip: ip,
                            visitCount: 1,
                            lastVisit: Date.parse(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + "  " + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()),
                            online: "true"
                        })
                    }
                });

            })
        } catch (error) {
            res.sendStatus(404);
        }
        socket.on('disconnect', function () {
            Visitor.updateOne({ guestId: ip }, {
                online: "false"
            });
            return next();
        });
    });

}