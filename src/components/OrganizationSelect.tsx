import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Organization {
  id: string;
  name: string;
  slug: string;
  theme_primary_color: string;
  theme_secondary_color: string;
  theme_accent_color: string;
  logo_url?: string;
}

export default function OrganizationSelect() {
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleSelectOrganization = async (org: Organization) => {
    try {
      localStorage.setItem('selectedOrganization', JSON.stringify(org));
      navigate(`/${org.slug}`);
    } catch (error) {
      console.error('Error selecting organization:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Building2 className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Select Your Organization
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose an organization to access its help desk system
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {organizations.map((org, index) => (
            <div
              key={org.id}
              className="relative group cursor-pointer"
              onClick={() => handleSelectOrganization(org)}
            >
              <div
                className="h-full rounded-lg p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${org.theme_primary_color}, ${org.theme_secondary_color})`,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {org.name}
                  </h3>
                  <div
                    className="inline-flex items-center text-sm px-3 py-1 rounded-full"
                    style={{ backgroundColor: org.theme_accent_color }}
                  >
                    <span className="text-white">Select</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-white" />
                  </div>
                </div>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: org.theme_accent_color }}
                >
                  <span className="text-2xl font-bold text-white">
                    {org.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}