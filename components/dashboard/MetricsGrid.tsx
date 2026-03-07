'use client';

import {
  MessageSquare,
  CheckCircle,
  Wrench,
  DollarSign,
  HardDrive,
  Activity,
} from 'lucide-react';

interface MetricCard {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const metrics: MetricCard[] = [
  {
    icon: <MessageSquare size={20} />,
    label: 'Messages',
    value: '0',
  },
  {
    icon: <CheckCircle size={20} />,
    label: 'Tasks Done',
    value: '0',
  },
  {
    icon: <Wrench size={20} />,
    label: 'Tools Used',
    value: '0',
  },
  {
    icon: <DollarSign size={20} />,
    label: 'API Cost',
    value: '$0.00',
  },
  {
    icon: <HardDrive size={20} />,
    label: 'Storage',
    value: '0.0/50 GB',
  },
  {
    icon: <Activity size={20} />,
    label: 'Status',
    value: (
      <span className="flex items-center">
        <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2" />
        Online
      </span>
    ),
  },
];

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80"
        >
          <div className="text-zinc-500 mb-2">{metric.icon}</div>
          <div className="text-sm text-zinc-400">{metric.label}</div>
          <div className="text-2xl font-bold text-white">{metric.value}</div>
        </div>
      ))}
    </div>
  );
}
