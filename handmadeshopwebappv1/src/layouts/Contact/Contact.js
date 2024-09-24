import React, { useEffect, useRef, useState } from "react";
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [clientName, setclientName] = useState("");
    const [email, setEmail] = useState("");
    const [messages, setMessages] = useState("");

    const [errClientName, setErrClientName] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errMessages, setErrMessages] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    const form = useRef();

    const handleName = (e) => {
        setclientName(e.target.value);
        setErrClientName("");
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrEmail("");
    };

    const handleMessages = (e) => {
        setMessages(e.target.value);
        setErrMessages("");
    };

    const EmailValidation = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
    };

    const handlePost = (e) => {
        e.preventDefault();

        if (!clientName) {
            setErrClientName("Enter your Name");
        }

        if (!email) {
            setErrEmail("Enter your Email");
        } else {
            if (!EmailValidation(email)) {
                setErrEmail("Enter a Valid Email");
            }
        }

        if (!messages) {
            setErrMessages("Enter your Messages");
        }

        if (clientName && email && EmailValidation(email) && messages) {
            setSuccessMsg(
                `Thank you dear ${clientName}, Your messages has been received successfully. Futher details will sent to you by your email at ${email}.`
            );
        }

        emailjs
            .sendForm('service_ygwsdij', 'template_2ztpbdi', form.current, {
                publicKey: 'KLUwmFbpjr-64wyPD',
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };

    return (
        <div className="max-w-container mx-auto px-4">
            <h1 className="text-5xl text-primeColor font-titleFont font-bold pb-20">Contact Us</h1>

            {successMsg ? (
                <p className="pb-20 w-96 font-medium text-green-500">{successMsg}</p>
            ) : (
                <form className="pb-20" ref={form}>
                    <h1 className="font-titleFont font-semibold text-3xl">
                        Fill up a Form
                    </h1>

                    <div className="w-[500px] h-auto py-6 flex flex-col gap-6">
                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Name
                            </p>

                            <input required
                                onChange={handleName}
                                value={clientName}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                type="text"
                                name="user_name"
                                placeholder="Enter your name here"
                            />

                            {errClientName && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errClientName}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Email
                            </p>

                            <input required
                                onChange={handleEmail}
                                value={email}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                type="email" name="user_email"
                                placeholder="Enter your email here"
                            />

                            {errEmail && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errEmail}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Messages
                            </p>

                            <textarea required
                                onChange={handleMessages}
                                value={messages}
                                cols="30"
                                rows="3"
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
                                type="text"
                                name="message"
                                placeholder="Enter your message here"
                            ></textarea>

                            {errMessages && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errMessages}
                                </p>
                            )}
                        </div>

                        <button onClick={handlePost} className="w-44 bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200" >
                            Send
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Contact;