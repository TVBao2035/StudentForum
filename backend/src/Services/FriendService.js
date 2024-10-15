const { Op } = require("sequelize")
const db = require("../Models")

class FriendService{
    getFriendsByUserId(userId){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [
                            {id: userId},
                            {isDelete: false}
                        ]
                    }
                });
                if(!user ) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`
                    })
                }

                const data =  await db.Friend.findAll({
                    where: {
                        [Op.and]: [
                            { userId }, 
                            { isDelete: false }, 
                            { isAccept: true}
                        ]
                    },
                    attributes: ['id'],
                    include:[
                        {
                            model: db.User,
                            where:{
                                isDelete:false
                            },
                            attributes: ['id', 'name', 'avatar']
                        }
                    ]
                })

                resolve({
                    status: 200,
                    message: `Get Friends By User Id Succeess`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get Friends By User Id ${error}`
                })
            }
        })
    }

    getFriendInvitation(friendId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [
                            { id: friendId },
                            { isDelete: false }
                        ]
                    }
                });
                if (!user) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${friendId}`
                    })
                }

                const data = await db.Friend.findAll({
                    where: {
                        [Op.and]: [
                            { friendId },
                            { isDelete: false },
                            { isAccept: false }
                        ]
                    },
                    attributes: ['id', 'userId', 'friendId', 'createdAt']
                });
                resolve({
                    status: 200,
                    message: `Get Friend Invitation Success`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get Friend Invitation ${error}`
                })
            }
        })
    }

    createFriendInvitation({userId, friendId}){
        console.log({userId, friendId});
        return new Promise(async(resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [
                            { id: userId },
                            { isDelete: false }
                        ]
                    }
                });
                if (!user) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`
                    })
                }
                const friend = await db.User.findOne({
                    where: {
                        [Op.and]: [
                            { id: friendId },
                            { isDelete: false }
                        ]
                    }
                });
                if (!friend) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${friendId}`
                    })
                }
                
                const invitation = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            {userId}, {friendId}
                        ]
                    }
                });
                // check invitation is existing
                if(invitation && invitation.isDelete === false){
                    return resolve({
                        status: 404,
                        message: `Friend Invitation Existing`
                    }) 
                }
                // if invitation has deleted then update isDelete = false and isAccept = false;
                if(invitation && invitation.isDelete){
                    invitation.isDelete = false;
                    invitation.isAccept = false;
                    await invitation.save();
                    return resolve({
                        status: 200,
                        message: `Create Friend Invitation Success`
                    })
                }

                await db.Friend.create({
                    friendId, userId
                });
                resolve({
                    status: 200,
                    message: `Create Friend Invitation Success`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Errror Create Friend Invitation ${error}`
                })
            }
        })
    }

    acceptFriendInvitation({userId, friendId, id}){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [
                            { id: userId },
                            { isDelete: false }
                        ]
                    }
                });

                if (!user) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`
                    })
                }

                const friend = await db.User.findOne({
                    where: {
                        [Op.and]: [
                            { id: friendId },
                            { isDelete: false }
                        ]
                    }
                });

                if (!friend) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${friendId}`
                    })
                }

                const isInvitationExisting = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            { userId }, { friendId }
                        ]
                    }
                });
                // check invitation is existing
                if (isInvitationExisting && isInvitationExisting.isDelete === false) {
                    return resolve({
                        status: 404,
                        message: `Friend Invitation Existing`
                    })
                }
                // if invitation has deleted then update isDelete = false and isAccept = false;
                if (isInvitationExisting && isInvitationExisting.isDelete) {
                    isInvitationExisting.isDelete = false;
                    isInvitationExisting.isAccept = false;
                    await isInvitationExisting.save();
                    return resolve({
                        status: 200,
                        message: `Create Friend Invitation Success`
                    })
                }
                const invitation = await db.Friend.findOne({
                    where: {
                        id
                    }
                })
                if(!invitation){
                    return resolve({
                        status: 404,
                        message: `Not Found Invitation With Id: ${id}`
                    })
                }

                invitation.isAccept = true;
                await invitation.save();
                await db.Friend.create({
                    userId, friendId, 
                    isAccept: true
                });
                resolve({
                    status: 200,
                    message: `Accepting Invitation Success`,
                });
            } catch (error) {
                reject({
                    status: 400,
                    messsage: `Error Accepting Invitation ${error}`
                })
            }
        })
    }
}

module.exports = new FriendService;