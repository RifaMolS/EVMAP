import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Thead = styled.thead`
  background-color: #f5f5f5;
`;

const Th = styled.th`
  padding: 10px;
  border: 1px solid #ccc;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 6px 12px;
  margin: 5px 0;
  border: none;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#007BFF')};
  color: white;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => !props.disabled && '#0056b3'};
  }
`;

const ReplyContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const ReplyInput = styled.input`
  padding: 6px;
  margin-right: 10px;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

function ComplaintViewReply() {
    const [complaintview, setComplaintview] = useState([]);
    const [showReplyIndex, setShowReplyIndex] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')) || {});
    const [userid] = useState(JSON.parse(localStorage.getItem('yourstorage')) || {});

    useEffect(() => {
        fetch('http://localhost:4000/ev/viewcomplaintreply')
            .then((res) => res.json())
            .then((result) => {
                setComplaintview(Array.isArray(result) ? result : []);
            })
            .catch((error) => console.error("Complaint fetch error:", error));
    }, []);

    const handleReply = (complaint) => {
        const reply = {
            complaint_id: complaint?._id || '',
            admin_id: auth?.userid || '',
            user_id: complaint.userId?._id || complaint.userId || '',
            replies: replyMessage,
        };
        fetch(`http://localhost:4000/ev/replycomplaint/${complaint._id}`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(reply)
        })
            .then((res) => res.json())
            .then((result) => {
                return fetch('http://localhost:4000/ev/addstatus', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        complaint_id: complaint._id,
                        status: 1
                    })
                });
            })
            .then(res => res && res.json ? res.json() : null)
            .then((result) => {
                if (result) {
                    console.log('Status updated', result);
                }
                setReplyMessage('');
                setShowReplyIndex(null);
            })
            .catch((error) => {
                console.error("Error sending reply or updating status:", error);
            });
    };

    return (
        <Container>
            <Title>Complaint View</Title>
            <Table>
                <Thead>
                    <tr>
                        <Th>User Name</Th>
                        <Th>Subject</Th>
                        <Th>Message</Th>
                        <Th>Status</Th>
                    </tr>
                </Thead>
                <tbody>
                    {Array.isArray(complaintview) && complaintview.map((complaint, index) => (
                        <tr key={index}>
                            <Td>{complaint.userId?.name || '-'}</Td>
                            <Td>{complaint.subject}</Td>
                            <Td>{complaint.message}</Td>
                            <Td>
                                {complaint.status === 1 ? (
                                    <Button disabled>Replied</Button>
                                ) : (
                                    <>
                                        <Button onClick={() => {
                                            setShowReplyIndex(index);
                                            setReplyMessage('');
                                        }}>
                                            Reply
                                        </Button>
                                        {showReplyIndex === index && (
                                            <ReplyContainer>
                                                <ReplyInput
                                                    type="text"
                                                    value={replyMessage}
                                                    onChange={e => setReplyMessage(e.target.value)}
                                                    placeholder="Type your reply"
                                                />
                                                <Button onClick={() => handleReply(complaint)}>Send</Button>
                                            </ReplyContainer>
                                        )}
                                    </>
                                )}
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default ComplaintViewReply;
