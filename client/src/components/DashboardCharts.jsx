import '../styles/dashboard.css';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { GiNightSleep } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FaRegFaceGrinWink } from "react-icons/fa6";
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#ff6384'];
export default function DashboardCharts({ logs }) {
  const past7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();
  const waterData = past7Days.map(date => ({
    date,
    water: logs
      .filter(log =>
        log.type === 'daily_log' &&
        log.data?.date &&
        log.data.date.startsWith(date)
      )
      .reduce((sum, log) => sum + Number(log.data.water || 0), 0)
  }));
  const sleepData = past7Days.map(date => ({
    date,
    sleep: logs
      .filter(log =>
        log.type === 'daily_log' &&
        log.data?.date &&
        log.data.date.startsWith(date)
      )
      .reduce((sum, log) => sum + Number(log.data.sleep || 0), 0)
  }));
  const exerciseData = past7Days.map(date => ({
    date,
    exercise: logs
      .filter(log =>
        log.type === 'daily_log' &&
        log.data?.date &&
        log.data.date.startsWith(date)
      )
      .reduce((sum, log) => sum + Number(log.data.exercise || 0), 0)
  }));
  const moodCounts = logs
    .filter(log => log.type === 'daily_log')
    .reduce((acc, log) => {
      const mood = log.data.mood;
      if (mood) acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
  const moodData = Object.entries(moodCounts).map(([mood, count], i) => ({
    name: mood,
    value: count,
    color: COLORS[i % COLORS.length]
  }));
  const customColors = ['#00A2FF', '#3C39AB', '#28BE9D', '#FFAB2D', '#FD5353'];
  return (
    <div className="flex gap-6 chartmain ">
      {/* Water */}
      <div className="bg-white p-4 rounded shadow chart-d">
        <h2 className="text-lg font-semibold mb-2"><span className='icons'><MdOutlineWaterDrop /></span> Water Intake</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={waterData}>
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0092E6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#716473" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "#4D4C5B", fontSize: 12 }}
              axisLine={{ stroke: "#000000c5", strokeWidth: 1 }}
              tickLine={{ stroke: "#000000c5", strokeWidth: 1 }}
            />
            <YAxis
              tick={{ fill: "#4D4C5B", fontSize: 12 }}
              axisLine={{ stroke: "#000000c5", strokeWidth: 1 }}
              tickLine={{ stroke: "#000000c5", strokeWidth: 1 }}
            />
           <Tooltip
              contentStyle={{
                backgroundColor: '#1F1F2F',
                borderRadius: '8px',
                border: 'none',
              }}
              labelStyle={{ color: '#00A2FF', fontWeight: 'bold' }}
              itemStyle={{ color: '#2696FD' }} //item (text) color
            />
            <Bar
              dataKey="water"
              fill="url(#waterGradient)"
              radius={[10, 10, 0, 0]}
              activeBar={{
                fill: 'url(#waterGradient)',
                radius: [10, 10, 0, 0],
              }}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Sleep */}
      <div className="bg-white p-4 rounded shadow chart-d">
        <h2 className="text-lg font-semibold mb-2"><span className='icons'><GiNightSleep /></span> Sleep Hours</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={sleepData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0053D6" stopOpacity={1} />
                <stop offset="95%" stopColor="#1A184F" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "#4D4C5B", fontSize: 12 }}
              axisLine={{ stroke: "#000000c5", strokeWidth: 1 }}
              tickLine={{ stroke: "#000000c5", strokeWidth: 1 }}
            />
            <YAxis
              tick={{ fill: "#4D4C5B", fontSize: 12 }}
              axisLine={{ stroke: "#000000c5", strokeWidth: 1 }}
              tickLine={{ stroke: "#000000c5", strokeWidth: 1 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F1F2F',
                borderRadius: '8px',
                border: 'none',
              }}
              labelStyle={{ color: '#00A2FF', fontWeight: 'bold' }}
              itemStyle={{ color: '#2696FD' }} 
            />
            <Bar
              dataKey="sleep"
              fill="url(#waterGradient)"
              radius={[10, 10, 0, 0]}
              activeBar={{ fill: '#FF7F50', radius: [12, 12, 0, 0] }}
            />

            <Area
              type="linear"
              dataKey="sleep"
              stroke="#2696FD" 
              fill="url(#sleepGradient)"
              strokeWidth={5}
              dot={{ r: 4, stroke: '#2696FD', strokeWidth: 2, fill: '#2696FD' }} 
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Mood */}
      <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2 chart-d">
        <h2 className="text-lg font-semibold mb-2"><span className='icons'><FaRegFaceGrinWink /></span> Mood Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={moodData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={80}
              labelLine={false}
              label={({ cx, cy, midAngle, outerRadius, name, percent }) => {
                const RADIAN = Math.PI / 180;
                const labelRadius = outerRadius + 30; 
                const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
                const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#4D4C5B"
                    fontSize={14}
                    fontWeight="500"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {`${name} ${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {moodData.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={customColors[i % customColors.length]}
                  stroke="#000"
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F1F2F',
                borderRadius: '8px',
                border: 'none',
              }}
              labelStyle={{ color: '#00A2FF', fontWeight: 'bold' }}
              itemStyle={{ color: '#2696FD' }}
            />

          </PieChart>
        </ResponsiveContainer>
      </div>
      {/*Exercise Chart */}
      <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2 chart-d">
        <h2 className="text-lg font-semibold mb-2"><span className='icons'><FaRunning /></span> Exercise Activity</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={exerciseData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="exerciseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#2D213E" stopOpacity={0.6} />
                <stop offset="90%" stopColor="#422D38" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "#4D4C5B", fontSize: 12 }}
              axisLine={{ stroke: "#000000c5", strokeWidth: 1 }}
              tickLine={{ stroke: "#000000c5", strokeWidth: 1 }}
            />
            <YAxis
              tick={{ fill: "#4D4C5B", fontSize: 12 }}
              axisLine={{ stroke: "#000000c5", strokeWidth: 1 }}
              tickLine={{ stroke: "#000000c5", strokeWidth: 1 }}
            />
             <Tooltip
              contentStyle={{
                backgroundColor: '#1F1F2F',
                borderRadius: '8px',
                border: 'none',
              }}
              labelStyle={{ color: '#00A2FF', fontWeight: 'bold' }}
              itemStyle={{ color: '#2696FD' }} 
            />
            <Area
              type="monotone"
              dataKey="exercise"
              stroke="#28BE9D"
              fill="url(#exerciseGradient)"
              strokeWidth={1}
              dot={{ r: 5, stroke: '#28BE9D', strokeWidth: 1, fill: '#28BE9D' }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
