import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

export const DiseaseDonut = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const data = [
    { name: 'CNV', value: 2, color: '#e63a2e' },
    { name: 'DME', value: 2, color: '#ff7733' },
    { name: 'DRUSEN', value: 0, color: '#ffaa44' },
    { name: 'NORMAL', value: 0, color: '#22c55e' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 4}
          outerRadius={outerRadius + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" className="font-bold text-[14px]">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#888" className="text-[12px] font-mono">
          {percent}%
        </text>
      </g>
    );
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-[8px] h-full flex flex-col p-6">
      <h3 className="text-[11px] font-body text-text-muted tracking-[0.08em] uppercase font-bold mb-4">
        Disease Distribution
      </h3>
      
      <div className="flex-1 min-h-[160px] relative -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data.filter(d => d.value > 0)} // Only show slices with data
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke="none"
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={800}
            >
              {data.filter(d => d.value > 0).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {total === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[12px] text-text-muted font-medium">
            No data available
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item) => {
          const percent = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.name} className="flex items-center gap-3 text-[11px]">
              <div className="w-12 font-bold uppercase tracking-wider" style={{ color: item.color }}>
                {item.name}
              </div>
              <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ width: `${percent}%`, backgroundColor: item.color }}
                ></div>
              </div>
              <div className="w-12 text-right text-text-muted">
                {item.value} scans
              </div>
              <div className="w-8 text-right font-mono text-white">
                {percent.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
