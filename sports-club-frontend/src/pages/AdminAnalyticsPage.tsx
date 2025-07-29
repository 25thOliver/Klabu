import React from 'react';

// Simple bar chart SVG
const BarChart = ({ data, max, labelKey, valueKey }) => (
  <svg width="100%" height={data.length * 32}>
    {data.map((item, i) => (
      <g key={i} transform={`translate(0,${i * 32})`}>
        <text x={0} y={20} fontSize="14" fill="#333">{item[labelKey]}</text>
        <rect x={140} y={6} width={(item[valueKey] / max) * 200} height={20} fill="#3b82f6" rx={4} />
        <text x={150 + (item[valueKey] / max) * 200} y={20} fontSize="14" fill="#333">{item[valueKey]}</text>
      </g>
    ))}
  </svg>
);

// Simple pie chart SVG
const PieChart = ({ data, valueKey, colors, size = 120 }) => {
  const total = data.reduce((sum, d) => sum + d[valueKey], 0);
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}> 
      {data.map((d, i) => {
        const start = acc / total * 2 * Math.PI;
        acc += d[valueKey];
        const end = acc / total * 2 * Math.PI;
        const x1 = size / 2 + (size / 2 - 10) * Math.sin(start);
        const y1 = size / 2 - (size / 2 - 10) * Math.cos(start);
        const x2 = size / 2 + (size / 2 - 10) * Math.sin(end);
        const y2 = size / 2 - (size / 2 - 10) * Math.cos(end);
        const largeArc = end - start > Math.PI ? 1 : 0;
        return (
          <path
            key={i}
            d={`M${size / 2},${size / 2} L${x1},${y1} A${size / 2 - 10},${size / 2 - 10} 0 ${largeArc} 1 ${x2},${y2} Z`}
            fill={colors[i % colors.length]}
            stroke="#fff"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
};

const AdminAnalyticsPage = ({
  stats = {},
  facilityBookings = [],
  eventParticipation = [],
  pieColors = ['#3b82f6', '#f59e42', '#10b981', '#f43f5e'],
  summary = [],
}) => {
  const maxBookings = facilityBookings.length > 0 ? Math.max(...facilityBookings.map(f => f.count)) : 1;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Analytics</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <div className="text-sm text-blue-800">Total Members</div>
          <div className="text-2xl font-bold">{stats.totalMembers ?? '-'}</div>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <div className="text-sm text-green-800">Total Payments</div>
          <div className="text-2xl font-bold">KES {stats.totalPayments ? stats.totalPayments.toLocaleString() : '-'}</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <div className="text-sm text-yellow-800">Total Events</div>
          <div className="text-2xl font-bold">{stats.totalEvents ?? '-'}</div>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <div className="text-sm text-purple-800">Total Bookings</div>
          <div className="text-2xl font-bold">{stats.totalBookings ?? '-'}</div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Facility Bookings</h2>
        {facilityBookings.length > 0 ? (
          <BarChart data={facilityBookings} max={maxBookings} labelKey="name" valueKey="count" />
        ) : (
          <div className="text-gray-500">No data</div>
        )}
      </div>
      <div className="mb-8 flex gap-8 items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Event Participation</h2>
          {eventParticipation.length > 0 ? (
            <PieChart data={eventParticipation} valueKey="participants" colors={pieColors} />
          ) : (
            <div className="text-gray-500">No data</div>
          )}
        </div>
        <ul className="ml-4">
          {eventParticipation.length > 0 ? eventParticipation.map((e, i) => (
            <li key={i} className="flex items-center gap-2 mb-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: pieColors[i % pieColors.length] }}></span>
              <span>{e.name}:</span>
              <span className="font-bold">{e.participants}</span>
            </li>
          )) : <li className="text-gray-500">No data</li>}
        </ul>
      </div>
      <div className="bg-gray-100 p-4 rounded mt-8">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <ul className="list-disc ml-6">
          {summary.length > 0 ? summary.map((item, i) => <li key={i}>{item}</li>) : <li className="text-gray-500">No summary</li>}
        </ul>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
