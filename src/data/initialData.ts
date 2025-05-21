import { Lead, Column } from '../types';

export const initialColumns: Column[] = [
  {
    id: 'new',
    title: 'New',
    color: 'blue'
  },
  {
    id: 'contacted',
    title: 'Contacted',
    color: 'amber'
  },
  {
    id: 'converted',
    title: 'Converted',
    color: 'green'
  },
  {
    id: 'lost',
    title: 'Lost',
    color: 'red'
  }
];

export const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    company: 'TechCorp',
    status: 'new',
    linkedin: 'https://linkedin.com/in/johnsmith',
    tags: ['High Value', 'Enterprise'],
    notes: 'Met at SaaS Conference, interested in AI features',
    conversations: [
      {
        id: '1',
        type: 'meeting',
        date: '2025-03-15T10:00:00Z',
        summary: 'Initial meeting at SaaS Conference',
        outcome: 'Interested in demo'
      }
    ],
    nextFollowUp: '2025-03-22T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@innovate.io',
    company: 'Innovate IO',
    status: 'new',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    tags: ['New Lead', 'SMB']
  },
  {
    id: '3',
    name: 'Michael Wong',
    email: 'michael@datastacks.com',
    company: 'DataStacks',
    status: 'contacted',
    linkedin: 'https://linkedin.com/in/michaelwong',
    tags: ['Follow Up', 'Enterprise'],
    notes: 'Demo scheduled for next week',
    conversations: [
      {
        id: '2',
        type: 'email',
        date: '2025-03-14T15:30:00Z',
        summary: 'Sent product overview and pricing',
        outcome: 'Scheduled demo'
      },
      {
        id: '3',
        type: 'call',
        date: '2025-03-13T11:00:00Z',
        summary: 'Initial discovery call',
        outcome: 'Interested in learning more'
      }
    ],
    nextFollowUp: '2025-03-21T14:00:00Z'
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@growthmarketing.com',
    company: 'Growth Marketing',
    status: 'contacted',
    linkedin: 'https://linkedin.com/in/emilychen',
    tags: ['Meeting', 'High Value'],
    conversations: [
      {
        id: '4',
        type: 'linkedin',
        date: '2025-03-12T09:00:00Z',
        summary: 'Connected on LinkedIn, discussed potential collaboration'
      }
    ]
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david@parkventures.com',
    company: 'Park Ventures',
    status: 'contacted',
    tags: ['Urgent']
  },
  {
    id: '6',
    name: 'Lisa Rodriguez',
    email: 'lisa@cloudify.co',
    company: 'Cloudify',
    status: 'converted',
    linkedin: 'https://linkedin.com/in/lisarodriguez',
    tags: ['Enterprise'],
    conversations: [
      {
        id: '5',
        type: 'call',
        date: '2025-03-10T16:00:00Z',
        summary: 'Contract signed, discussed implementation timeline',
        outcome: 'Deal closed'
      }
    ]
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james@nextstep.io',
    company: 'NextStep',
    status: 'converted',
    tags: ['SMB']
  },
  {
    id: '8',
    name: 'Alex Tanner',
    email: 'alex@digitaledge.com',
    company: 'Digital Edge',
    status: 'lost',
    linkedin: 'https://linkedin.com/in/alextanner',
    tags: ['SMB'],
    notes: 'Budget constraints, may revisit next quarter',
    conversations: [
      {
        id: '6',
        type: 'email',
        date: '2025-03-08T10:00:00Z',
        summary: 'Received notification about budget freeze',
        outcome: 'Deal lost - budget constraints'
      }
    ]
  },
  {
    id: '9',
    name: 'Robert Lee',
    email: 'robert@futuretechnologies.com',
    company: 'Future Technologies',
    status: 'lost',
    tags: ['Enterprise']
  }
];