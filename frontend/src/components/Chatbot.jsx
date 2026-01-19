import { useState } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your IT Assistant. I can help you search tickets, get quick answers, or provide technical guidance. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      // TODO: Replace with actual API call to Claude/OpenAI
      // const response = await axios.post('/api/chatbot/', { message: userInput });
      
      // Smart mock responses based on user input
      setTimeout(() => {
        let botResponse = '';
        
        // Search for tickets
        if (userInput.toLowerCase().includes('search') || userInput.toLowerCase().includes('find') || userInput.toLowerCase().includes('show')) {
          if (userInput.toLowerCase().includes('printer')) {
            botResponse = "I found 1 ticket related to printers:\n\n🖥️ Ticket #3 - Printer not working in Gallery 2\nFrom: mike.wilson@crystalbridges.org\nStatus: New | Priority: Low\nCreated: 2 hours ago\n\nWould you like me to show you the full details?";
          } else if (userInput.toLowerCase().includes('password')) {
            botResponse = "I found 1 ticket related to passwords:\n\n👤 Ticket #2 - Password reset needed\nFrom: jane.smith@crystalbridges.org\nStatus: In Progress | Priority: Medium\nCreated: 1 hour ago\n\nThis ticket is currently being worked on.";
          } else if (userInput.toLowerCase().includes('john') || userInput.toLowerCase().includes('john.doe')) {
            botResponse = "I found 1 ticket from john.doe@crystalbridges.org:\n\n🖥️ Ticket #1 - Computer won't turn on\nStatus: New | Priority: High\nCreated: 15 minutes ago\nDescription: Desktop computer won't power on. Important presentation at 2 PM.\n\nThis is a high-priority ticket that needs immediate attention!";
          } else if (userInput.toLowerCase().includes('high')) {
            botResponse = "I found 1 high-priority ticket:\n\n🖥️ Ticket #1 - Computer won't turn on\nFrom: john.doe@crystalbridges.org\nStatus: New\nCreated: 15 minutes ago\n\nWould you like me to assign this ticket to someone?";
          } else {
            botResponse = "I can search for:\n• Tickets by sender (e.g., 'show tickets from john.doe')\n• Tickets by keyword (e.g., 'find printer issues')\n• Tickets by priority (e.g., 'show high priority tickets')\n• Tickets by status (e.g., 'find new tickets')\n\nWhat would you like to search for?";
          }
        } 
        // Show ticket details
        else if (userInput.toLowerCase().includes('ticket') && userInput.match(/#?\d+/)) {
          const ticketNum = userInput.match(/#?\d+/)[0].replace('#', '');
          botResponse = `Here are the details for Ticket #${ticketNum}:\n\n📧 Original Email:\nFrom: employee@crystalbridges.org\nSubject: Issue description\nDate: January 18, 2026\n\n📝 Full Description:\n[Email body would appear here]\n\nWould you like to update the status or assign this ticket?`;
        }
        // Help/capabilities
        else if (userInput.toLowerCase().includes('help') || userInput.toLowerCase().includes('what can you')) {
          botResponse = "I can help you with:\n\n🔍 Search Tickets\n• Find tickets by sender\n• Search by keywords\n• Filter by priority or status\n\n📊 Get Statistics\n• Ticket counts\n• Response times\n• Team performance\n\n📧 View Emails\n• See original emails\n• Check ticket history\n\n⚙️ Manage Tickets\n• Update status\n• Assign to team members\n• Add notes\n\nWhat would you like to do?";
        }
        // Default response
        else {
          botResponse = `I received your message: "${userInput}". Once we connect the AI backend, I'll be able to:\n\n• Search tickets by any criteria\n• Show you original emails\n• Provide ticket analytics\n• Help assign and manage tickets\n• Answer technical questions\n\nTry asking me to search for something like "find printer issues" or "show tickets from john.doe"!`;
        }
        
        const aiMsg = {
          role: 'assistant',
          content: botResponse
        };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-crystal-blue text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-3xl">🤖</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-crystal-blue to-blue-600 p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">IT Assistant</h3>
                <p className="text-xs text-blue-100">Powered by AI</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-crystal-blue text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                rows={2}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-crystal-blue focus:border-transparent resize-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-4 bg-crystal-blue text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;