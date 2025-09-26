import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import './App.css'

const strengthLevels = [
  { label: 'Weak', color: '#f64a4a' },    // Red
  { label: 'Good', color: '#f6c44a' },    // Yellow
  { label: 'Perfect', color: '#4af65b' }   // Green
];

const calculateStrength = (password) => {
  let score = 0;
  if (!password) return 0;

  // Create a set of unique character types in the password
  const charTypes = new Set();
  if (/[a-z]/.test(password)) charTypes.add('lower');
  if (/[A-Z]/.test(password)) charTypes.add('upper');
  if (/[0-9]/.test(password)) charTypes.add('number');
  if (/[^A-Za-z0-9]/.test(password)) charTypes.add('symbol');
  
  score += charTypes.size;

  // Add points for length
  if (password.length > 8) score++;
  if (password.length > 12) score++;
  
  // Determine final strength level based on score
  if (password.length < 8 || score < 3) return 0; // Weak
  if (score < 5) return 1; // Good
  return 2; // Perfect
};

// Main App Component
function App() {
  const [length, setLength] = useState(8) 
  const [numberAllowed, setNumberAllowed] = useState(false) 
  const [symbolAllowed, setSymbolAllowed] = useState(false)
  const [password, setPassword] = useState("")
  const passwordRef = useRef(null) // Ref for the password input field

  // Memoized strength calculation
  const strength = useMemo(() => {
  const score = calculateStrength(password);
  return strengthLevels[score];
  }, [password]);

  // Password generation logic
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (symbolAllowed) str += "!@#$%^&*()_+~`|}{[]:;?><,./-=" 

    // Randomly generate password
    for(let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }
    setPassword(pass)
  }  , [length, numberAllowed, symbolAllowed, setPassword])

  // Copy password to clipboard
  const copyPassToClipboard = useCallback(() => {
    passwordRef.current?.select() // Select the text field
    passwordRef.current?.setSelectionRange(0, 9999) 
    window.navigator.clipboard.writeText(password) // Copy to clipboard
  }, [password])

  // Generate password on initial render and when dependencies change
  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, symbolAllowed, passwordGenerator])


  return (
  <>
    <div className='app-container w-full max-w-md mx-auto shadow-md rounded-lg px-4 my-8 text-orange-500 bg-gray-500'>
      <h1 className='text-white font-bold text-center my-3'>Password Generator</h1> {/* Title */}
      <div className='flex shadow rounded-lg overflow-hidden mb-4'>
        {/* Password display input */}
        <input
          type="text"
          value={password}
          className='outline-none px-3 py-1 w-full'
          placeholder='Your Password'
          readOnly
          ref={passwordRef}
        />
        {/* Copy button */}
        <button
        onClick={copyPassToClipboard}
        className='copy-btn outline-none bg-blue-500 text-white px-3 py-0.5 shrink-0'
        >copy</button>
      </div>
      <div className='flex text-sm gap-x-2'>
        {/* Password length slider */}
        <div className='flex items-center gap-x-1'>
          <input
            type='range'
            min={6}
            max={100}
            value={length}
            className='cursor-pointer'
            onChange={(e) => setLength(e.target.value)}
          />
          <label>Length: {length}</label>
        </div>
        {/* Include numbers checkbox */}
        <div className='flex items-center gap-x-1'>
          <input
            type='checkbox'
            checked={numberAllowed}
            id='numbersAllowed'
            onChange={() => setNumberAllowed((prev) => !prev)}
          />
          <label>Include Numbers</label>
        </div>
        {/* Include symbols checkbox */}
        <div className='flex items-center gap-x-1'>
          <input
            type='checkbox'
            checked={symbolAllowed}
            id='symbolsAllowed'
            onChange={() => setSymbolAllowed((prev) => !prev)}
          />
          <label>Include Symbols</label>
        </div> 
      </div>
      {/* Strength meter and regenerate button */}
      {password && (
      <div className='strength-meter'>
        <div className='strength-label-group'> 
        <label>Strength:</label>
        <span style={{ color: strength.color, fontWeight: 'bold' }}>
        {strength.label}
        </span>
        </div>

        <button
        onClick={passwordGenerator}
        className='regenerate-btn'
        title="Regenerate password"
        >
        <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path 
          d="M21.5 2V8H15.5" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M3.5 12.5C3.5 7.504 7.504 3.5 12.5 3.5C14.762 3.5 16.811 4.343 18.399 5.688L21.5 8" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        </svg>
        </button>
       </div>
      )}
    </div>
  </>
)}

export default App
