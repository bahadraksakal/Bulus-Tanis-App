const Message = require("../models/Message");
const User = require("../models/User");
const Friends = require("../models/Friends");


exports.createFriends = async (req, res) => {
    try {
        const friendShipExist = await Friends.findOne(
            {
                $or: [
                    { $and: [{ userMail: req.body.userMail }, { friendMail: req.body.friendMail }] },
                    { $and: [{ userMail: req.body.friendMail }, { friendMail: req.body.userMail }] }
                ]
            });
        //console.log(friendShipExist);
        if (friendShipExist) {
            res.send({
                "status": false,
                "mesaj": `Arkadaşlık zaten var: ${req.body.userMail} - ${req.body.friendMail}`
            });
            return;
        }
        const friend1 = await Friends.create({ userMail: req.body.userMail, friendMail: req.body.friendMail });
        const friend2 = await Friends.create({ userMail: req.body.friendMail, friendMail: req.body.userMail });
        const newFriendInfo = await User.findOne({ userMail: req.body.userMail });
        res.status(201).json({
            "status": true,
            "mesaj": "Başarılı! Arkadaşlık başarıyla oluşturuldu!",
            "userMail": friend1.userMail,
            "friendMail": friend1.friendMail,
            "friendInfo": newFriendInfo
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "status": false,
            "mesaj": "Sunucu hatası  friendsController - createFriends"
        });
    }
}
exports.getFriends = async (req, res) => {
    try {
        console.log(req.body);
        const friends = await Friends.find({ userMail: req.body.userMail });
        let FriendsExtended = [];

        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            //console.log(friend);
            const temp = await User.findOne({ userMail: friend.friendMail });
            //console.log(temp);
            FriendsExtended.push(temp);
        }
        //console.log(FriendsExtended);
        res.status(201).json(FriendsExtended);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "status": false,
            "mesaj": "Sunucu hatası  friendsController - getFriends"
        });
    }
};