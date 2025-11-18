import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  PieChart, 
  Bell, 
  Search, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Download, 
  ChevronDown, 
  LogOut,
  Plus,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  CreditCard,
  Activity,
  Sparkles,
  Send,
  Bot,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Pie,
  Cell,
  PieChart as RePieChart
} from 'recharts';

// --- MOCK DATA ---

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const REGION_DATA = [
  { name: 'North America', sales: 4000 },
  { name: 'Europe', sales: 3000 },
  { name: 'Asia Pacific', sales: 2000 },
  { name: 'South America', sales: 2780 },
  { name: 'Middle East', sales: 1890 },
];

const DEMOGRAPHICS_DATA = [
  { name: 'Enterprise', value: 400 },
  { name: 'SME', value: 300 },
  { name: 'Startup', value: 300 },
  { name: 'Individual', value: 200 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

const USERS_DATA = Array.from({ length: 25 }, (_, i) => ({
  id: `USR-${1000 + i}`,
  name: ['Alex Morgan', 'Sarah Chen', 'Mike Ross', 'Jessica Pearson', 'Harvey Specter'][i % 5] + ` ${Math.floor(i / 5) + 1}`,
  role: ['Admin', 'Editor', 'Viewer', 'Billing'][i % 4],
  status: ['Active', 'Inactive', 'Pending'][i % 3],
  email: `user${i}@example.com`,
  lastActive: '2 mins ago'
}));

const RECENT_TRANSACTIONS = [
  { id: 'TRX-9821', user: 'Global Tech Inc', amount: '$2,400.00', status: 'Success', date: 'Today, 14:30' },
  { id: 'TRX-9822', user: 'Nebula Software', amount: '$150.00', status: 'Pending', date: 'Today, 12:10' },
  { id: 'TRX-9823', user: 'Alex Design', amount: '$850.00', status: 'Failed', date: 'Yesterday, 09:45' },
  { id: 'TRX-9824', user: 'Core Systems', amount: '$12,000.00', status: 'Success', date: 'Oct 24, 2024' },
];

// --- AI ASSISTANT COMPONENT ---

const AIChatModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'Hello! I am your AdminDash assistant. Ask me about revenue, users, or regional performance.' }
  ]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQuestion = query;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

    try {
      const apiKey = ""; // Runtime provided
      // Prepare context from dashboard data
      const contextData = JSON.stringify({
        revenue: REVENUE_DATA,
        regions: REGION_DATA,
        demographics: DEMOGRAPHICS_DATA,
        recent_transactions: RECENT_TRANSACTIONS
      });

      const systemPrompt = `You are an AI assistant for the AdminDash dashboard. 
      Analyze the following JSON data to answer user questions concisely and professionally:
      ${contextData}. 
      If the answer isn't in the data, say you don't have that information. Keep answers short (under 50 words unless detailed analysis is asked).`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Context: ${systemPrompt}\n\nUser Question: ${userQuestion}` }] }]
        })
      });

      const data = await res.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that request right now.";

      setChatHistory(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg h-[600px] flex flex-col shadow-2xl overflow-hidden border-indigo-500/30 ring-1 ring-indigo-500/20">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sparkles size={18} />
            <span>AI Insights</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
              }`}>
                {msg.role === 'user' ? <Users size={14} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-none' 
                  : 'bg-indigo-50 dark:bg-indigo-900/20 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleAskAI} className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about revenue, users, or trends..."
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white shadow-sm"
            />
            <button 
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- UTILITY COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors ${className}`}>
    {children}
  </div>
);

const Badge = ({ type, children }) => {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Inactive: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    Editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Viewer: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    Billing: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || styles.Inactive}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", icon: Icon, className = "", ...props }) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20",
    secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
    ghost: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// --- PAGE COMPONENTS ---

const DashboardHome = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* KPI Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: "Total Revenue", value: "$54,230", trend: "+12.5%", up: true, icon: CreditCard },
        { title: "Active Users", value: "2,543", trend: "+8.2%", up: true, icon: Users },
        { title: "Bounce Rate", value: "42.3%", trend: "-2.1%", up: true, icon: Activity },
        { title: "Active Regions", value: "12", trend: "+2", up: true, icon: MapPin },
      ].map((stat, idx) => (
        <Card key={idx} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
              <stat.icon size={20} />
            </div>
            <span className={`flex items-center text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
              {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {stat.trend}
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
        </Card>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue vs profit performance</p>
          </div>
          <Button variant="secondary" size="sm" icon={Download}>Export</Button>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">User Demographics</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Distribution by account type</p>
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={DEMOGRAPHICS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {DEMOGRAPHICS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }} />
            </RePieChart>
          </ResponsiveContainer>
          {/* Center Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">1.2k</span>
            <span className="text-xs text-slate-500">Total Clients</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {DEMOGRAPHICS_DATA.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white">{Math.round((item.value / 1200) * 100)}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Bottom Section: Recent Activity & Regional Map */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <Card className="lg:col-span-2 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Transaction ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {RECENT_TRANSACTIONS.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{trx.id}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{trx.user}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{trx.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{trx.amount}</td>
                  <td className="px-4 py-3">
                    <Badge type={trx.status}>{trx.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Regional Sales</h3>
           <MapPin size={18} className="text-slate-400" />
        </div>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={REGION_DATA} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:opacity-10" />
               <XAxis type="number" hide />
               <YAxis type="category" dataKey="name" tick={{fill: '#94a3b8', fontSize: 11}} width={80} />
               <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                />
               <Bar dataKey="sales" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
             </BarChart>
           </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
           <p className="text-xs text-slate-500">Top performing region: <span className="font-bold text-indigo-600">North America</span></p>
        </div>
      </Card>
    </div>
  </div>
);

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  const filteredUsers = useMemo(() => {
    return USERS_DATA.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const handleExport = () => {
    // Basic CSV export simulation
    const headers = ["ID,Name,Role,Status,Email,LastActive"];
    const rows = filteredUsers.map(u => `${u.id},${u.name},${u.role},${u.status},${u.email},${u.lastActive}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage access and permissions for your team.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Download} onClick={handleExport}>Export CSV</Button>
          <Button variant="primary" icon={Plus}>Add User</Button>
        </div>
      </div>

      <Card className="p-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Role:</span>
            <select 
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
              <option value="Billing">Billing</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><Badge type={user.role}>{user.role}</Badge></td>
                  <td className="p-4"><Badge type={user.status}>{user.status}</Badge></td>
                  <td className="p-4 text-slate-500">{user.lastActive}</td>
                  <td className="p-4">
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500">
            <span>Showing {filteredUsers.length} users</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled>Previous</Button>
              <Button variant="secondary" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const SettingsPage = ({ darkMode, toggleTheme }) => (
  <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
    
    <Card className="divide-y divide-slate-100 dark:divide-slate-700">
      <div className="p-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Appearance</h3>
        <p className="text-sm text-slate-500 mb-6">Customize how the admin dashboard looks on your device.</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-slate-500">Switch between light and dark themes.</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Notifications</h3>
        <p className="text-sm text-slate-500 mb-6">Manage your email and push notification preferences.</p>
        
        <div className="space-y-4">
          {['Email Notifications', 'Push Notifications', 'Monthly Reports', 'Security Alerts'].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">{item}</span>
              <input type="checkbox" defaultChecked={idx !== 2} className="accent-indigo-600 h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Account</h3>
        <p className="text-sm text-slate-500 mb-6">Update your personal details and password.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input type="text" defaultValue="Alex Admin" className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" defaultValue="admin@pencilandpaper.io" className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-sm" />
          </div>
        </div>
        <Button variant="primary">Save Changes</Button>
      </div>
    </Card>
  </div>
);

const LoginScreen = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              defaultValue="demo@admin.com" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              defaultValue="password" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Protected by enterprise-grade security.</p>
        </div>
      </Card>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Toggle Dark Mode Class on Body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulated initial data load
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-white' : ''} />
      <span className={`font-medium ${!isSidebarOpen && 'hidden md:hidden'} md:block`}>{label}</span>
      {activeTab === id && <div className="absolute left-0 top-0 w-1 h-full bg-indigo-400/30" />}
    </button>
  );

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans`}>
      
      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-center h-16 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <LayoutDashboard size={28} />
            {isSidebarOpen && <span>Admin<span className="text-slate-900 dark:text-white">Dash</span></span>}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="users" icon={Users} label="Users" />
          <NavItem id="analytics" icon={BarChart3} label="Analytics" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors w-full px-4 py-2">
            <LogOut size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search or type a command..." 
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-full transition-colors text-sm font-medium"
            >
              <Sparkles size={16} />
              <span className="hidden md:inline">Ask AI</span>
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Alex Morgan</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                AM
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div className="p-6">
          {loading ? (
             // Skeleton Loading State
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
               ))}
               <div className="col-span-full lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4"></div>
               <div className="col-span-full lg:col-span-1 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4"></div>
             </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardHome />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'settings' && <SettingsPage darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />}
              {activeTab === 'analytics' && <DashboardHome />} {/* Reusing Home for demo */}
            </>
          )}
        </div>
      </main>

      {/* AI Modal */}
      <AIChatModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default App;
