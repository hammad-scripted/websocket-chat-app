function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gray-900">
      <div className="h-[80vh] w-full m-2 p-4 overflow-y-scroll"></div>
      <div className="  flex flex-row items-center justify-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="
    w-full
    bg-gray-800
    text-gray-300
    placeholder:text-gray-500
    border
    border-gray-600
    rounded-lg
    p-4
    pl-4
    pr-12
    m-2
    mb-6
    
    transition
    duration-300
    ease-in-out
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
  "
        />
        <button className="mb-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
