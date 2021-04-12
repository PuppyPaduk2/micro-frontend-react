import React, { useEffect } from 'react';

export const App: React.FC = () => {
  useEffect(() => {
    console.log("Auth");
  }, []);

  return (
    <div>Auth</div>
  );
};
