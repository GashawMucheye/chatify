import React from 'react';

function UsersLoadingSkeleton() {
  return (
    <div className='space-y-4 p-4 animate-pulse'>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className='flex items-center gap-3 bg-slate-700/40 p-3 rounded-lg'
        >
          <div className='size-12 rounded-full bg-slate-600'></div>
          <div className='h-4 w-3/4 bg-slate-600 rounded'></div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;
