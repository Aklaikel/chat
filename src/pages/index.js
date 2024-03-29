import { useState, useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios';
import TypingAnimation from "../components/TypingAnimation";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }])

    sendMessage(inputValue);
    
    setInputValue('');
  }

  const sendMessage = (message) => {
    // the url of the backend
    const url = '/api/chat';
  
    // Get the last five messages
    const lastFiveMessages = chatLog.slice(Math.max(chatLog.length - 5, 0));
  
    // Create a JSON object with the last five messages and the new user message
    const data = {
      messages: [
        ...lastFiveMessages.map(msg => ({
          role: msg.type,
          content: msg.message
        })),
        { role: "user", content: message }
      ]
    };
  
    // Stringify the JSON object
    const jsonData = JSON.stringify(data);
  
    setIsLoading(true);
  
    // Send the JSON data in the request
    axios.post(url, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response);
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.choices[0].message.content }])
      setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
    });
  }

  return (
    <div className="container mx-auto max-w-[700px]">
      <div className="flex flex-col h-screen bg-gray-900">
        <h1 className="bg-gradient-to-r from-blue-500 to-blue-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">DR. Vi</h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
          {
        chatLog.map((message, index) => (
          <div key={index} className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div className={`${
              message.type === 'user' ? 'bg-blue-500' : 'bg-gray-800'
            } rounded-lg p-4 text-white max-w-sm`}>
            {message.message}
            </div>
            </div>
        ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
              </div>
            }
      </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">  
        <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-blue-600 transition-colors duration-300">Send</button>
            </div>
        </form>
        </div>
    </div>
  )
}
