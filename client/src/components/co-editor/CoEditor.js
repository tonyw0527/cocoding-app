import React, { useState, useEffect, useRef } from 'react';
import './CoEditor.css';


const CoEditor = (props) => {
    const {socket} = props;
    const {userName, password} = props;

    const [Text, setText] = useState('');
    const [IsTutor, setIsTutor] = useState(false);
    const [IsTutorLoggedIn, setIsTutorLoggedIn] = useState(false);

    useEffect(() => {
        console.log('통과')
        socket.emit('login', { userName, password });

        socket.on('login', ({isTutor, text_cache}) => {
            setIsTutor(isTutor);
            setText(text_cache);
        });

        socket.on('tutor login', ({login}) => {
            setIsTutorLoggedIn(login);
        });

        socket.on('send text', (text) => {
            setText(text);
        });

        return () => {
            socket.off('login');
            socket.off('tutor login');
            socket.off('send text');
        }
    }, [socket])

    return (
        <div className="CoEditor-wrapper">
            <div className="CoEditor-title">
                <h1>Co-Editor</h1>
                {IsTutor ? <h3>Tutor Hi!</h3> : <h3>Tutee Hi!</h3>}
                {IsTutorLoggedIn ? <h3>Tutoring <span style={{color: "red"}}>OnAir</span></h3> : <h3>Call your Tutor</h3>}
            </div>
            <div className="CoEditor-main">
                <textarea value={Text} onChange={(e)=>{
                    const text = e.target.value;
                        setText(text);
                        socket.emit('send text', text);

                    }} placeholder="for tutor" spellCheck="false">
                </textarea>
            </div>
        </div>
    );
};

export default CoEditor;
