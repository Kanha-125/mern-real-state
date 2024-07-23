import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const data = await response.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setLandLord(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLandLord();
  }, []);

  return (
    <>
      {landLord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landLord.username}</span> for{' '}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="p-3 rounded-lg w-full border"
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
