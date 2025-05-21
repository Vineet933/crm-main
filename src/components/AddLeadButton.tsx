import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddLeadModal from './AddLeadModal';

const AddLeadButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Add new lead"
      >
        <Plus className="h-6 w-6" />
      </button>
      
      {isModalOpen && <AddLeadModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default AddLeadButton;