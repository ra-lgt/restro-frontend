import { useState } from "react";
const { Configuration, OpenAIApi } = require("openai");

const Chatbox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);

  const configuration = new Configuration({
    apiKey: "<YOUR OPENAI>",
  });

  const openai = new OpenAIApi(configuration);



  const handleGptQuery=async()=>{

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Who won the world series in 2020?" },
          { role: "assistant", content: "The Los Angeles Dodgers." },
          { role: "user", content: "Where was it played?" },
        ],
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 1,
      });
    }
    catch{

    }
  
  
  }

  const handleMessageSend = (message) => {
    setMessages([...messages, { text: message, sender: "user" }]);
    handleGptQuery()
    
    // Here you can send the message to your backend or handle it as needed
  };

  return (
    <div className="fixed bottom-20 right-5 z-20 bg-white shadow-md p-4 rounded-md w-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Chat</h3>
        <button onClick={onClose}>Minimize</button>
      </div>
      <div className="h-60 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleMessageSend(e.target.value);
            e.target.value = "";
          }
        }}
        className="w-full mt-2 border rounded px-2 py-1"
      />
    </div>
  );
};

export default Chatbox;
