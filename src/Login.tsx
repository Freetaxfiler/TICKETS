import React, { useState, useEffect } from 'react';
import { useAuth } from './auth';
import { Headphones } from 'lucide-react';
import { supabase } from './supabaseClient';

interface Organization {
  id: string;
  name: string;
  slug: string;
  theme_primary_color: string;
  theme_secondary_color: string;
  theme_accent_color: string;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { signIn } = useAuth();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to load organizations. Please try again later.');
        return;
      }

      setOrganizations(data || []);
      if (data && data.length > 0) {
        setSelectedOrg(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to load organizations. Please check your connection and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) {
      setError('Please select an organization');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      const selectedOrgData = organizations.find(org => org.id === selectedOrg);
      if (selectedOrgData) {
        window.location.href = `/${selectedOrgData.slug}`;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedOrgColors = () => {
    const org = organizations.find(o => o.id === selectedOrg);
    return {
      primary: org?.theme_primary_color || '#1a365d',
      secondary: org?.theme_secondary_color || '#2d3748',
      accent: org?.theme_accent_color || '#4299e1'
    };
  };

  const colors = getSelectedOrgColors();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-8">
          <div 
            className="flex justify-center mb-4 p-4 rounded-full w-16 h-16 mx-auto"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
            }}
          >
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
          >
            {organizations.find(org => org.id === selectedOrg)?.name || 'Help Desk Manager'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Login to your account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Select Organization
            </label>
            <div className="relative">
              <select
                id="organization"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
                style={{
                  borderColor: colors.accent + '40',
                }}
              >
                <option value="" disabled>Select an organization</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              style={{
                borderColor: colors.accent + '40',
              }}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              style={{
                borderColor: colors.accent + '40',
              }}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedOrg}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: colors.accent,
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}