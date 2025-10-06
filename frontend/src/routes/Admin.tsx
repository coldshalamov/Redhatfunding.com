import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import FormField from '@/components/FormField';

interface Lead {
  id: number;
  created_at: string;
  business_type: string;
  amount_requested: number;
  use_of_funds: string;
  start_month: string;
  start_year: string;
  has_business_account: boolean;
  company_name: string;
  industry: string;
  monthly_revenue: number;
  zipcode: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface LeadResponse {
  items: Lead[];
  total: number;
  page: number;
  page_size: number;
}

const Admin = () => {
  const [apiKey, setApiKey] = useState('');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    if (!apiKey) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get<LeadResponse>('/api/leads', {
          params: { page, page_size: pageSize, search },
          headers: { 'X-API-Key': apiKey },
          signal: controller.signal,
        });
        setLeads(response.data.items);
        setTotal(response.data.total);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        const message =
          typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string'
            ? (error as { message: string }).message
            : 'Unable to load leads';
        notify(message, 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [apiKey, page, pageSize, search, notify]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const csvContent = useMemo(() => {
    if (!leads.length) return '';
    const headers = [
      'ID',
      'Created',
      'Business Type',
      'Amount',
      'Use of Funds',
      'Company',
      'Industry',
      'Monthly Revenue',
      'ZIP',
      'Contact',
      'Email',
      'Phone',
    ];
    const rows = leads.map((lead) => [
      lead.id,
      lead.created_at,
      lead.business_type,
      lead.amount_requested,
      lead.use_of_funds,
      lead.company_name,
      lead.industry,
      lead.monthly_revenue,
      lead.zipcode,
      `${lead.first_name} ${lead.last_name}`,
      lead.email,
      lead.phone,
    ]);
    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }, [leads]);

  const downloadCsv = () => {
    if (!csvContent) {
      notify('No data to export', 'error');
      return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'redhat-funding-leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-[#f9fafc] py-12">
      <Helmet>
        <title>Admin — RedHat Funding</title>
      </Helmet>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl border border-line bg-white p-6 shadow-lift">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Lead management</h1>
            <p className="text-sm text-muted">Provide your API key to load recent submissions.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="password"
              placeholder="X-API-Key"
              className="rounded-3xl border border-line px-4 py-2 text-sm"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              aria-label="API Key"
            />
            <button type="button" className="btn-primary" onClick={() => downloadCsv()}>
              Export CSV
            </button>
          </div>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Search" htmlFor="search">
            <input
              id="search"
              type="search"
              className="w-full rounded-3xl border border-line px-4 py-2"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </FormField>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-left text-sm">
            <thead className="bg-[#f9fafc] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Use</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-brand/5">
                  <td className="px-4 py-3 text-muted">{new Date(lead.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{lead.company_name}</div>
                    <div className="text-xs text-muted">{lead.business_type}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">${lead.amount_requested.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted">{lead.use_of_funds}</td>
                  <td className="px-4 py-3 text-muted">{lead.first_name} {lead.last_name}</td>
                  <td className="px-4 py-3 text-muted">{lead.email}</td>
                  <td className="px-4 py-3 text-muted">{lead.phone}</td>
                </tr>
              ))}
              {!leads.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    {loading ? 'Loading…' : 'No leads found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between text-sm text-muted">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-full border border-line px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-full border border-line px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Admin;
