// import React, { useState } from 'react';
// import Column from './Column';
// import AddLeadButton from './AddLeadButton';
// import { Lead, Column as ColumnType } from '../types';
// import { initialLeads, initialColumns } from '../data/initialData';

// const KanbanBoard: React.FC = () => {
//   const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
//   const [leads, setLeads] = useState<Lead[]>(initialLeads);
  
//   // Group leads by column
//   const leadsByColumn = columns.reduce((acc, column) => {
//     acc[column.id] = leads.filter(lead => lead.status === column.id);
//     return acc;
//   }, {} as Record<string, Lead[]>);

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Lead Pipeline</h2>
//         <div className="flex items-center space-x-2">
//           <select className="text-sm border border-gray-300 rounded-md py-1.5 px-3 bg-white">
//             <option>All Leads</option>
//             <option>My Leads</option>
//             <option>Unassigned</option>
//           </select>
//         </div>
//       </div>
      
//       <div className="flex-1 overflow-x-auto pb-4">
//         <div className="flex h-full space-x-4 min-w-max">
//           {columns.map(column => (
//             <Column 
//               key={column.id}
//               title={column.title}
//               color={column.color}
//               leads={leadsByColumn[column.id] || []}
//             />
//           ))}
//         </div>
//       </div>
      
//       <AddLeadButton />
//     </div>
//   );
// };

// export default KanbanBoard;


import React, { useState, useMemo } from 'react';
import Column from './Column';
import AddLeadButton from './AddLeadButton';
import { Lead, Column as ColumnType, Conversation } from '../types';
import { initialLeads, initialColumns } from '../data/initialData';

interface KanbanBoardProps {
  searchQuery?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ searchQuery = '' }) => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  
  // Filter leads based on search query
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    
    const query = searchQuery.toLowerCase();
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query)
    );
  }, [leads, searchQuery]);

  // Group leads by column
  const leadsByColumn = columns.reduce((acc, column) => {
    acc[column.id] = filteredLeads.filter(lead => lead.status === column.id);
    return acc;
  }, {} as Record<string, Lead[]>);

  const handleAddConversation = (leadId: string, newConversation: {
    type: 'email' | 'call' | 'linkedin' | 'meeting' | 'other';
    summary: string;
    outcome?: string;
    reminder?: Date | null;
  }) => {
    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id === leadId) {
        const conversation: Conversation = {
          id: Date.now().toString(), // Simple ID generation
          leadId,
          type: newConversation.type,
          content: newConversation.summary,
          timestamp: new Date(),
          reminder: newConversation.reminder,
        };
        return {
          ...lead,
          conversations: [conversation, ...(lead.conversations || [])]
        };
      }
      return lead;
    }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lead Pipeline</h2>
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-gray-300 rounded-md py-1.5 px-3 bg-white">
            <option>All Leads</option>
            <option>My Leads</option>
            <option>Unassigned</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full space-x-4 min-w-max">
          {columns.map(column => (
            <Column 
              key={column.id}
              title={column.title}
              color={column.color}
              leads={leadsByColumn[column.id] || []}
              onAddConversation={handleAddConversation}
            />
          ))}
        </div>
      </div>
      
      <AddLeadButton />
    </div>
  );
};

export default KanbanBoard;