import { useState, useEffect } from 'react';
import TicketCard from '../components/TicketCard';
import TicketModal from '../components/TicketModal';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tickets from backend
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/tickets/');
      // setTickets(response.data);
      
      // Mock data for now
      const mockTickets = [
        {
          id: 1,
          subject: 'Computer won\'t turn on',
          sender: 'john.doe@crystalbridges.org',
          status: 'new',
          priority: 'high',
          category: 'hardware',
          created_at: new Date().toISOString(),
          description: 'My desktop computer in the office won\'t power on. I have an important presentation at 2 PM.'
        },
        {
          id: 2,
          subject: 'Password reset needed',
          sender: 'jane.smith@crystalbridges.org',
          status: 'in_progress',
          priority: 'medium',
          category: 'account',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          description: 'I forgot my email password and need it reset as soon as possible.'
        },
        {
          id: 3,
          subject: 'Printer not working in Gallery 2',
          sender: 'mike.wilson@crystalbridges.org',
          status: 'new',
          priority: 'low',
          category: 'hardware',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          description: 'The printer in Gallery 2 is showing an error message.'
        }
      ];
      
      setTickets(mockTickets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getStatusCount = (status) => {
    return tickets.filter(t => t.status === status).length;
  };

  return (
    <div className="bg-gradient-to-br from-crystal-light to-white min-h-screen pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Tickets</p>
                <p className="text-3xl font-bold text-crystal-dark">{tickets.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">New</p>
                <p className="text-3xl font-bold text-red-500">{getStatusCount('new')}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🆕</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-yellow-500">{getStatusCount('in_progress')}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-500">{getStatusCount('resolved')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex space-x-2">
            {['all', 'new', 'in_progress', 'resolved', 'closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-crystal-blue text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crystal-blue mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <span className="text-6xl">📭</span>
              <p className="text-gray-500 mt-4 text-lg">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={fetchTickets}
        />
      )}
    </div>
  );
}

export default Dashboard;