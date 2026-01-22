import React from 'react';

const AdsterraBanner: React.FC = () => {
  const adCode = `
    <html>
      <head>
        <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : 'f40259ef8a0f25ba2680a0204f2c7e56',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/f40259ef8a0f25ba2680a0204f2c7e56/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="flex justify-center items-center my-4 overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30">
      <iframe 
        title="adsterra-banner"
        srcDoc={adCode}
        width="320"
        height="50"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
};

export default AdsterraBanner;