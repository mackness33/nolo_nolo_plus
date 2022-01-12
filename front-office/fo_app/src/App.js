import React, { useState, useEffect, useRef } from "react";

function App() {
  const [name, setName] = useState('');

  return (<h1>
    <input type="text" onChange={(e)=>{setName(e.target.value)}} />
    <div>{name}</div>
  </h1>);
}

export default App;
