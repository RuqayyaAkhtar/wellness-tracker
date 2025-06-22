import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';

export default function CircularTimer({ targetTime, color }) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const totalRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const now = moment();
      const [h, m] = targetTime.split(':').map(Number);
      let next = moment().hour(h).minute(m).second(0);
      if (next.isBefore(now)) next = next.add(1, 'day');
      const diff = next.diff(now, 'seconds');
      if (totalRef.current === null) {
        totalRef.current = diff;
      }
      setSecondsLeft(diff);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  const total = totalRef.current > 0 ? totalRef.current : 1;
  const fraction = Math.max(0, Math.min(1, secondsLeft / total));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashLength = fraction * circumference;

  return (
    <svg width={50} height={50}>
      <circle
        cx={25}
        cy={25}
        r={radius}
        stroke="#2654A2"
        strokeWidth={5}
        fill="none"
      />
      <circle
        cx={25}
        cy={25}
        r={radius}
        stroke={color}
        strokeWidth={5}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - dashLength}
        transform="rotate(-90 25 25)"
        strokeLinecap="round"
      />
    </svg>
  );
}
