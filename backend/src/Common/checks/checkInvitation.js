const { Op } = require('sequelize');
const db = require('../../Models');

const checkInvitation = (invitationId) => {

    return new Promise(async (resolve, reject) => {
        try {
            const invitation = await db.Friend.findOne({
                where: {
                    [Op.and]: [
                        { id: invitationId }, 
                        { isDelete: false },
                        { isAccept: false}
                    ]
                }
            });
            if (!invitation) {
                return resolve({
                    status: 404,
                    message: `Không Tìm Thấy Lời Mời: ${invitationId}`
                })
            }
            return resolve(invitation)
        } catch (error) {
            reject(`Error Check Invitation ${error}`)
        }
    })
}

module.exports = checkInvitation;