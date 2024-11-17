import React, { useEffect, useState } from 'react'
import { getAllGroupInvitation } from '../../API/GroupAPI'
import { Avatar } from '../../Components';
import { Link } from 'react-router-dom';
import './GroupInvitation.scss';
const GroupInvitation = ({groupId}) => {

    const [invitations, setInvitations] = useState([]);

    const fetchGetInvitation = async (groupId) => {
        let res = await getAllGroupInvitation(groupId);
        if(res.status === 200){
            setInvitations(res.data);
        }
    }

    useEffect(() => {
        fetchGetInvitation(groupId);
    }, [groupId]);

    console.log(invitations);
  return (
    <div className='row GroupInvitation'>
        {
            invitations.map(invitation => 
                <div className='d-flex mb-2 justify-content-between col-4'>
                    <div className='d-flex align-items-center gap-2'>
                        <Link to={`../../@${invitation.invitation.id}`}>
                            <Avatar small link={invitation.invitation.avatar} />
                        </Link>
                        <p className='invitation_group_name'>{invitation.invitation.name}</p>
                    </div>
                    <div className='d-flex gap-2'>
                        <div>
                            <button className='btn btn-success'>Xác nhận</button>
                        </div>
                        <div>
                            <button className='btn btn-danger'>Hủy</button>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default GroupInvitation