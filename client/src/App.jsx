import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Activity, Globe, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css'

const App = () => {
  const [logs, setLogs] = useState([]);

  // useCallback prevents unnecessary re-renders and satisfies ESLint
  const fetchLogs = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/logs');
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, []);

  useEffect(() => {
  const load = async () => {
    await fetchLogs();
  };

  load();

  const interval = setInterval(load, 5000);

  return () => clearInterval(interval);
}, [fetchLogs]);


  const chartData = [...logs].reverse().slice(-10);

  return (
    <div className="min-h-screen bg-gray-50
">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" /> Edge-Alert
          </h1>
          <p className="text-gray-500">Global Infrastructure Monitoring</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          System Operational
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Regional Nodes
            </h2>
            {logs.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-semibold text-gray-700">{logs[0].region}</span>
                  {logs[0].status === "UP" ? 
                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold"><CheckCircle className="w-4 h-4" /> ONLINE</div> : 
                    <div className="flex items-center gap-1 text-red-600 text-sm font-bold"><XCircle className="w-4 h-4" /> OFFLINE</div>
                  }
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1 px-1">
                  <Clock className="w-3 h-3" /> Updated {new Date(logs[0].timestamp).toLocaleTimeString()}
                </div>
              </div>
            ) : <p className="text-gray-400 animate-pulse">Scanning network...</p>}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider">Avg Latency</h3>
            <div className="flex items-baseline gap-2 mt-2">
               <p className="text-4xl font-black">
                {logs.length > 0 ? Math.round(logs.reduce((acc, curr) => acc + curr.latency, 0) / logs.length) : 0}
               </p>
               <span className="text-blue-200 font-medium">ms</span>
            </div>
          </div>
        </div>

        {/* Right Column: Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Performance Trend</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer Table */}
      <div className="max-w-6xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Recent Event Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-100">
              {logs.slice(0, 8).map((log, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800 text-sm">{log.region}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{log.url}</td>
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">{log.latency}ms</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${log.status === 'UP' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;