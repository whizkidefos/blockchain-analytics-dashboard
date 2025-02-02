import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  data: { price: number }[];
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, color = "#6366f1" }) => {
  const chartData = data.map((price, index) => ({
    time: index,
    value: price
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="time" hide />
        <YAxis 
          domain={['auto', 'auto']}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
          labelStyle={{ display: 'none' }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;