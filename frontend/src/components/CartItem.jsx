export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="w-full sm:w-24 flex-shrink-0">
        <img 
          src={item.image || "https://placehold.jp/200x200"} 
          alt={item.name} 
          className="w-full h-24 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 w-full pl-0 sm:pl-6 mt-4 sm:mt-0">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{item.name}</h3>
            <p className="text-gray-600 mt-1">₹ {item.price}</p>
          </div>
          
          <div className="md:hidden mt-2">
            <p className="font-bold text-gray-900">₹ {item.price * item.quantity}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="flex items-center border rounded-lg">
            <button 
              onClick={() => onUpdate(item._id, item.quantity - 1)}
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-l-lg transition disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 text-gray-800 font-medium">{item.quantity}</span>
            <button 
              onClick={() => onUpdate(item._id, item.quantity + 1)}
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-lg transition"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={() => onRemove(item._id)}
            className="flex items-center text-red-600 hover:text-red-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
      </div>
      
      <div className="hidden md:block w-24 text-right">
        <p className="font-bold text-gray-900">₹ {item.price * item.quantity}</p>
      </div>
    </div>
  );
}
