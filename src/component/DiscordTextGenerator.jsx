import { useState } from 'react';
import '../App.css';

const DiscordTextGenerator = () => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('31'); // Default to red
  const [copied, setCopied] = useState(false);
  const [styles, setStyles] = useState({
    bold: false,
    underline: false
  });

  const colors = [
    { code: '31', name: 'Red', hex: '#dc322f' },
    { code: '32', name: 'Green', hex: '#859900' },
    { code: '33', name: 'Yellow', hex: '#b58900' },
    { code: '34', name: 'Blue', hex: '#268bd2' },
    { code: '35', name: 'Magenta', hex: '#d33682' },
    { code: '36', name: 'Cyan', hex: '#2aa198' },
    { code: '37', name: 'White', hex: '#ffffff' }
  ];

  const generateColoredText = () => {
    const styleCodes = [];
    if (styles.bold) styleCodes.push('1');
    if (styles.underline) styleCodes.push('4');
    styleCodes.push(color);
    
    const styleString = styleCodes.join(';');
    return `\`\`\`ansi\n\x1b[${styleString}m${text}\x1b[0m\n\`\`\``;
  };

  const getPreviewStyle = () => {
    const style = {
      color: colors.find(c => c.code === color)?.hex || '#ffffff',
      fontWeight: styles.bold ? 'bold' : 'normal',
      textDecoration: styles.underline ? 'underline' : 'none'
    };
    return style;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateColoredText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const toggleStyle = (style) => {
    setStyles(prev => ({
      ...prev,
      [style]: !prev[style]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            Discord Colored Text Generator
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Create colorful text for your Discord messages
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Text
              </label>
              <textarea
                className="w-full h-32 p-3 text-gray-100 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Type your message here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Styles
              </label>
              <div className="flex gap-2 mb-4">
                <button
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    styles.bold
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => toggleStyle('bold')}
                >
                  Bold
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    styles.underline
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => toggleStyle('underline')}
                >
                  Underline
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {colors.map(({ code, name, hex }) => (
                  <button
                    key={code}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      code === color
                        ? 'ring-2 ring-blue-500 transform scale-105'
                        : 'hover:bg-gray-700'
                    }`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setColor(code)}
                  >
                    <span className="text-black font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                copied
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={copyToClipboard}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Live Preview
              </label>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div 
                  className="text-lg font-mono"
                  style={getPreviewStyle()}
                >
                  {text || 'Your text will appear here...'}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Discord Format
              </label>
              <pre className="bg-gray-700 p-4 rounded-lg text-left whitespace-pre-wrap font-mono text-sm text-gray-100 border border-gray-600">
                {generateColoredText()}
              </pre>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>Paste the copied text into Discord to see the colored message</p>
        </div>
      </div>
    </div>
  );
};

export default DiscordTextGenerator;
