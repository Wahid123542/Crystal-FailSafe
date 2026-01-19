import { useState } from 'react';

function TicketModal({ ticket, onClose, onUpdate }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // details, email, reply
  const [replyMessage, setReplyMessage] = useState('');
  const [assignedTo, setAssignedTo] = useState(ticket.assigned_to || '');

  // Mock IT staff list (will come from backend)
  const itStaff = [
    { id: '', name: 'Unassigned' },
    { id: 1, name: 'John Smith - IT Manager' },
    { id: 2, name: 'Sarah Johnson - System Admin' },
    { id: 3, name: 'Mike Davis - Network Engineer' },
    { id: 4, name: 'Emily Wilson - Help Desk' },
    { id: 5, name: 'David Brown - Security Specialist' }
  ];

  const handleUpdate = async () => {
    try {
      // TODO: API call to update ticket
      // await axios.patch(`/api/tickets/${ticket.id}/`, { status, priority, notes, assigned_to: assignedTo });
      console.log('Updating ticket:', { status, priority, notes, assigned_to: assignedTo });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleSendReply = async () => {
    try {
      // TODO: API call to send email reply
      // await axios.post(`/api/tickets/${ticket.id}/reply/`, { message: replyMessage });
      console.log('Sending reply:', replyMessage);
      alert('✅ Reply sent to ' + ticket.sender);
      setReplyMessage('');
      setActiveTab('details');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Mock original email data (will come from backend)
  const originalEmail = {
    from: ticket.sender,
    to: 'itsupport@crystalbridges.org',
    subject: ticket.subject,
    date: formatFullDate(ticket.created_at),
    body: ticket.description,
    attachments: [
      { name: 'screenshot.png', size: '245 KB', type: 'image/png' },
      { name: 'error_log.txt', size: '12 KB', type: 'text/plain' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-crystal-blue p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{ticket.subject}</h2>
              <p className="text-blue-100">Ticket #{ticket.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-600 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white sticky top-[112px] z-10">
          <div className="flex space-x-1 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'details'
                  ? 'border-b-2 border-crystal-blue text-crystal-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Ticket Details
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'email'
                  ? 'border-b-2 border-crystal-blue text-crystal-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📧 Original Email
            </button>
            <button
              onClick={() => setActiveTab('reply')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'reply'
                  ? 'border-b-2 border-crystal-blue text-crystal-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ↩️ Reply to Employee
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ticket Details Tab */}
          {activeTab === 'details' && (
            <div>
              {/* Ticket Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-semibold text-crystal-dark">{ticket.sender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-semibold text-crystal-dark">{formatFullDate(ticket.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold text-crystal-dark capitalize">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <p className="font-semibold text-crystal-dark capitalize">
                      {ticket.status.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-semibold text-crystal-dark capitalize">{ticket.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-semibold text-crystal-dark">
                      {assignedTo ? itStaff.find(s => s.id === parseInt(assignedTo))?.name : 'Unassigned'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-crystal-dark mb-3">Issue Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              {/* Update Controls */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-crystal-dark mb-4">Update Ticket</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crystal-blue focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crystal-blue focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To
                    </label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crystal-blue focus:border-transparent"
                    >
                      {itStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Internal Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes for your team (employee won't see this)..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crystal-blue focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-crystal-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Update Ticket
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Original Email Tab */}
          {activeTab === 'email' && (
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-crystal-dark mb-4">Email Headers</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-500 w-20">From:</span>
                    <span className="text-sm text-gray-800">{originalEmail.from}</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-500 w-20">To:</span>
                    <span className="text-sm text-gray-800">{originalEmail.to}</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-500 w-20">Subject:</span>
                    <span className="text-sm text-gray-800">{originalEmail.subject}</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-500 w-20">Date:</span>
                    <span className="text-sm text-gray-800">{originalEmail.date}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-crystal-dark mb-3">Email Body</h3>
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                  <p className="text-gray-800 whitespace-pre-wrap">{originalEmail.body}</p>
                </div>
              </div>

              {originalEmail.attachments && originalEmail.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-crystal-dark mb-3">Attachments ({originalEmail.attachments.length})</h3>
                  <div className="space-y-2">
                    {originalEmail.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl">
                              {file.type.includes('image') ? '🖼️' : '📄'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-crystal-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reply Tab */}
          {activeTab === 'reply' && (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">💡</span>
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Replying to Employee</p>
                    <p className="text-sm text-blue-800">
                      Your response will be sent to <span className="font-semibold">{ticket.sender}</span> via email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={`Re: ${ticket.subject}`}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={`Hi ${ticket.sender.split('@')[0]},\n\nThank you for contacting IT support. I'm working on your issue...\n\nBest regards,\nIT Support Team`}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crystal-blue focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Email Signature (Auto-added)</h4>
                <div className="text-sm text-gray-600">
                  <p>---</p>
                  <p className="font-medium">Crystal Bridges IT Support</p>
                  <p>Email: itsupport@crystalbridges.org</p>
                  <p>Phone: (479) 418-5700</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className="flex-1 bg-crystal-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Reply</span>
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketModal;