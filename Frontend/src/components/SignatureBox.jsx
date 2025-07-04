import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const fonts = ['Arial', 'Georgia', 'Courier New', 'Times New Roman'];

const SignatureBox = ({ onSignatureGenerated }) => {
  const [type, setType] = useState('typed');
  const [name, setName] = useState('Your Name');
  const [font, setFont] = useState(fonts[0]);

  const sigCanvas = useRef(null);

  const handleGenerate = () => {
    if (type === 'typed') {
      const signature = {
        type: 'typed',
        text: name,
        font,
      };
      onSignatureGenerated(signature);
    } else if (type === 'drawn' && sigCanvas.current) {
      const dataUrl = sigCanvas.current.toDataURL();
      onSignatureGenerated({
        type: 'drawn',
        dataUrl,
      });
    }
  };

  const clearCanvas = () => {
    sigCanvas.current?.clear();
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setType('typed')}
          className={`px-4 py-2 rounded ${type === 'typed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Typed
        </button>
        <button
          onClick={() => setType('drawn')}
          className={`px-4 py-2 rounded ${type === 'drawn' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Drawn
        </button>
      </div>

      {type === 'typed' && (
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 w-full mb-4"
          />
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="border px-4 py-2 w-full"
          >
            {fonts.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </select>
          <div className="mt-4 text-lg font-bold" style={{ fontFamily: font }}>
            {name}
          </div>
        </div>
      )}

      {type === 'drawn' && (
        <div className="mt-4">
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: 'border' }}
            ref={sigCanvas}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={clearCanvas} className="bg-yellow-500 text-white px-4 py-1 rounded">
              Clear
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Generate Signature
      </button>
    </div>
  );
};

export default SignatureBox;
