import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Button, Card, Tab, Tabs, Alert } from 'react-bootstrap';
import { getFriendsByUserId, getFriendInvitation, acceptFriendInvitation, deleteFriendInvitation } from '../../API/FriendAPI';
import { useSelector } from 'react-redux'; 
import { Avatar } from '../../Components';
import './MakeFriendStyle.scss';
//import moment from 'moment';
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
import { Link } from 'react-router-dom';
import timeFormat from '../../Helpers/timeFormat';

// Component cho mỗi lời mời kết bạn
function FriendInvitation({ invitation, onAccept, onCancel }) {
  return (
    <Card className="friend-invitation-card p-3 d-flex justify-content-between">
      <Row className="align-items-center w-100 ">
        <Col xs={3} className="text-center p-0">
          <Link to={`/@${invitation.user.id}`}>
            <Avatar link={invitation.user.avatar} big />
          </Link>
        </Col>
        <Col xs={4} className="text-start p-0">
          <div className="name mb-1">{invitation.user.name}</div> {/* Tên người gửi */}
          {/* <div className="time text-muted">{moment(invitation.createdAt).fromNow()}</div> Thời gian gửi */}
          <div className="time text-muted">
            {timeFormat(invitation.createdAt)}
            {/* {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true, locale: vi })}  */}
          </div>
        </Col>
        <Col xs={5} className="text-end">
          <Button variant="primary" className="btn-accept mb-1" onClick={() => onAccept(invitation.id, invitation.user.id)}>
            Chấp Nhận
          </Button>
          <Button variant="secondary" className="btn-cancel" onClick={() => onCancel(invitation.id)}>
            Hủy
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default function MakeFriend() {
  const userId = useSelector((state) => state.user.id); 
  const [invitations, setInvitations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFriendInvitation(userId);
      //console.log(response.data);
      if (response.data) {
        setInvitations(response.data);
      } else {
        setInvitations([]);
      }
    } catch (error) {
      console.error('Error while getting friend requests:', error);
      setError('Không thể tải danh sách lời mời. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFriendsByUserId(userId);
      console.log(response.data);
      if (response.data) {
        setFriends(response.data);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error('Error while getting friends:', error);
      setError('Không thể tải danh sách bạn bè. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId)
    {
      fetchInvitations(); 
      fetchFriends();
    }
    
  }, [userId, fetchInvitations, fetchFriends]);

  const handleAccept = async (invitationId, friendId) => {
    try {
      //console.log( {invitationId, friendId });
      //const res = await acceptFriendInvitation(invitationId, userId, friendId);
      //console.log(res.data);
      await acceptFriendInvitation(invitationId, userId, friendId);
      setInvitations(invitations.filter((invite) => invite.id !== invitationId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Không thể chấp nhận lời mời. Vui lòng thử lại sau.');
    }
  };

  const handleCancel = async (invitationId) => {
    try
    {
      //console.log( {invitationId} );
      //const response = await deleteFriendInvitation(invitationId);
      //console.log(response.data);
      await deleteFriendInvitation(invitationId);
      setInvitations(invitations.filter((invite) => invite.id !== invitationId));
    } catch (error) {
      console.error("Error canceling invitation:", error);
      setError('Không thể hủy lời mời. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="MakeFriend px-5 mx-5">
      <div className="container px-5 mx-5">
        <h2 className="text-center mb-4">Bạn bè</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <p className="text-center">Đang tải...</p>
        ) : (
          <Tabs defaultActiveKey="invitations" id="make-friend-tab" className="mb-3">
            <Tab eventKey="invitations" title="Lời Mời Kết Bạn">
              <Row xs={1} sm={2} md={3} className="g-3">
                {invitations.map((invite) => (
                  <Col key={invite.id}>
                  
                    <FriendInvitation 
                      invitation={invite} 
                      onAccept={handleAccept} 
                      onCancel={handleCancel} 
                    />
                  </Col>
                ))}
              </Row>
            </Tab>
            <Tab eventKey="all-friends" title="Danh Sách Bạn Bè">
              <Row xs={1} sm={2} md={3} className="g-3">
                {friends.map((friend) => (
                  <Col key={friend.id}>
                    <Card className="friend-card text-center p-3">
                      {/* <div className="avatar mb-2"></div> */}
                      <Link to={`/@${friend.yourFriend.id}`}>
                        <Avatar link={friend.yourFriend.avatar} big />
                      </Link>                      
                      <div className="name mb-2">{friend.yourFriend.name}</div>
                      <Button className="btn-message">Nhắn Tin</Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        )}
      </div>
    </div>
  );
}