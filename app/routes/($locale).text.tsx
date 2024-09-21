import React from 'react';

function text() {
  console.log(
    '===== LOG START =====',
    new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
  );
  //console.log('myVariable:', JSON.stringify(myVariable, null, 4));
  return <div>=====================text</div>;
}

export default text;
