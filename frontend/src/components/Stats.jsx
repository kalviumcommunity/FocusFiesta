import React from 'react';

export default function Stats({ daily, weekly }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Pomodoro Stats</h3>
      <div className="flex flex-col gap-2">
        <div>Daily Completed: <span className="font-bold">{daily}</span></div>
        <div>Weekly Completed: <span className="font-bold">{weekly}</span></div>
      </div>
    </div>
  );
}
