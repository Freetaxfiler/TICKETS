import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../auth';
import CreateTicketModal from '../CreateTicketModal';

interface Organization {
  id: string;
  name: string;
  theme_primary_color: string;
  theme_secondary_color: string;
  theme_accent_color: string;
}

interface Ticket {
  id: string;
  ticket_no: string;
  name_of_client: string;
  issue_type: string;
  status: string;
  created_on: string;
}

export default function USeTaxFilerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', 'use-tax-filer')
        .single();

      if (error) {
        console.error('Error fetching organization:', error);
        navigate('/');
        return;
      }

      setSelectedOrg(data);
    };

    fetchOrganization();
  }, [navigate]);

  useEffect(() => {
    if (selectedOrg) {
      fetchTickets();
    }
  }, [selectedOrg, searchQuery]);

  const fetchTickets = async () => {
    try {
      let query = supabase
        .from('tickets')
        .select('*')
        .eq('organization_id', selectedOrg?.id)
        .order('created_on', { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(
          `mobile_no.ilike.%${searchQuery}%,` +
          `client_file_no.ilike.%${searchQuery}%,` +
          `name_of_client.ilike.%${searchQuery}%,` +
          `ticket_no.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Error fetching tickets');
    }
  };

  const handleChangeOrg = () => {
    localStorage.removeItem('selectedOrganization');
    signOut();
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsCreateModalOpen(true);
  };

  if (!selectedOrg) return null;

  const headerStyle = {
    background: `linear-gradient(135deg, ${selectedOrg.theme_primary_color}, ${selectedOrg.theme_secondary_color})`,
  };

  const accentStyle = {
    backgroundColor: selectedOrg.theme_accent_color,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="shadow" style={headerStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-12 h-12 text-white mr-4" />
              <div>
                <div className="text-2xl font-bold text-white">USeTaxFiler</div>
                <div className="text-sm text-white opacity-90">Help Desk Manager</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleChangeOrg}
                className="p-2 text-white rounded-full hover:bg-white/10"
                title="Change Organization"
              >
                <Building2 className="w-6 h-6" />
              </button>
              <span className="text-sm text-white">
                {user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded text-white border border-white/30 hover:bg-white/10"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              className="px-4 py-2 rounded text-white"
              style={accentStyle}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Raise new ticket
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-96"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket: Ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.ticket_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.name_of_client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.issue_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{
                          backgroundColor: selectedOrg.theme_accent_color + '20',
                          color: selectedOrg.theme_accent_color
                        }}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.created_on).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedTicket(null);
        }}
        organizationId={selectedOrg.id}
        onTicketCreated={fetchTickets}
        ticket={selectedTicket}
      />
    </div>
  );
}