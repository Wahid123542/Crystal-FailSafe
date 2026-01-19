function TicketCard({ ticket, onClick }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'hardware':
        return '🖥️';
      case 'software':
        return '💻';
      case 'account':
        return '👤';
      case 'network':
        return '🌐';
      default:
        return '📝';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-crystal-blue p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-crystal-dark hover:text-crystal-blue transition-colors">
                {ticket.subject}
              </h3>
              <p className="text-sm text-gray-500">From: {ticket.sender}</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
              {ticket.category.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(ticket.created_at)}
            </span>
          </div>
        </div>

        <div className="ml-6 flex flex-col items-end">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)} mb-2`}></div>
          <span className="text-xs font-medium text-gray-600">
            {ticket.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;