import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  CheckCheck,
  Briefcase,
  User,
  Clock,
  Building,
  CheckCircle,
  FileText,
  Calendar,
  ExternalLink,
  Info,
  Phone,
  Video,
  Sparkles,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

// Initial fallback mock conversation data to ensure immediate rich experience
const INITIAL_CONVERSATIONS = [
  {
    id: 'conv_1',
    partner: {
      id: 'rec_101',
      name: 'Sarah Jenkins',
      email: 'sarah.j@techcorp.io',
      role: 'recruiter',
      title: 'Senior Talent Acquisition Partner',
      company: 'TechCorp Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      online: true
    },
    job: {
      id: 'job_201',
      title: 'Senior Full Stack Engineer',
      company: 'TechCorp Inc.',
      salary: '$120,000 - $145,000 / yr',
      location: 'San Francisco, CA (Hybrid)'
    },
    applicationStatus: 'Shortlisted',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'rec_101',
        text: 'Hi there! We reviewed your profile for the Senior Full Stack Engineer role and were really impressed by your MERN project showcase.',
        timestamp: '10:15 AM',
        date: 'Today',
        read: true
      },
      {
        id: 'm2',
        senderId: 'candidate_me',
        text: 'Hello Sarah! Thank you so much for reaching out. I am very excited about TechCorp and would love to discuss how my background aligns with the team.',
        timestamp: '10:18 AM',
        date: 'Today',
        read: true
      },
      {
        id: 'm3',
        senderId: 'rec_101',
        text: 'Wonderful! Would you be available for a 30-minute introductory technical screen this Thursday around 2:00 PM EST?',
        timestamp: '10:25 AM',
        date: 'Today',
        read: false
      },
      {
        id: 'm4',
        senderId: 'rec_101',
        text: 'I have attached our technical interview guidelines document for your review.',
        timestamp: '10:26 AM',
        date: 'Today',
        read: false,
        attachment: {
          name: 'TechCorp_Interview_Guide.pdf',
          size: '1.2 MB'
        }
      }
    ]
  },
  {
    id: 'conv_2',
    partner: {
      id: 'rec_102',
      name: 'Michael Chang',
      email: 'm.chang@innovatelabs.com',
      role: 'recruiter',
      title: 'Head of Engineering Recruitment',
      company: 'InnovateLabs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      online: false
    },
    job: {
      id: 'job_202',
      title: 'Lead Frontend Developer (React / Tailwind)',
      company: 'InnovateLabs',
      salary: '$135,000 - $160,000 / yr',
      location: 'Remote'
    },
    applicationStatus: 'Interview Scheduled',
    unreadCount: 0,
    messages: [
      {
        id: 'm21',
        senderId: 'rec_102',
        text: 'Hi! Thank you for applying to the Lead Frontend Developer opening.',
        timestamp: 'Yesterday 3:40 PM',
        date: 'Yesterday',
        read: true
      },
      {
        id: 'm22',
        senderId: 'candidate_me',
        text: 'Hi Michael, thanks for following up! My resume and portfolio link are updated on my profile.',
        timestamp: 'Yesterday 4:05 PM',
        date: 'Yesterday',
        read: true
      },
      {
        id: 'm23',
        senderId: 'rec_102',
        text: 'Great, our lead architect checked your submission and we would love to move forward with round 2 next week!',
        timestamp: 'Yesterday 4:30 PM',
        date: 'Yesterday',
        read: true
      }
    ]
  },
  {
    id: 'conv_3',
    partner: {
      id: 'candidate_301',
      name: 'Alex Rivera',
      email: 'alex.rivera@devmail.io',
      role: 'candidate',
      title: 'Full Stack MERN Developer',
      company: 'Open to Opportunities',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      online: true
    },
    job: {
      id: 'job_203',
      title: 'Backend Node.js Microservices Engineer',
      company: 'CloudScale Systems',
      salary: '$110,000 - $130,000 / yr',
      location: 'Austin, TX'
    },
    applicationStatus: 'In Review',
    unreadCount: 1,
    messages: [
      {
        id: 'm31',
        senderId: 'candidate_301',
        text: 'Hello! I recently submitted my application for the Backend Node.js Microservices position and wanted to express my enthusiasm for the role.',
        timestamp: '9:05 AM',
        date: 'Today',
        read: false
      }
    ]
  }
];

const QUICK_PROMPTS = [
  'I am very interested in this role!',
  'When can we schedule a quick call?',
  'Thank you for the update!',
  'I have uploaded my latest resume.',
  'What are the next steps in the process?'
];

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('jobportal_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });
  
  const [activeConvId, setActiveConvId] = useState(() => {
    return conversations.length > 0 ? conversations[0].id : null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'unread', 'recruiters', 'candidates'
  const [showDetailDrawer, setShowDetailDrawer] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('jobportal_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Handle incoming query params or navigation state (e.g. from JobApplicants or JobDetails)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const candidateName = queryParams.get('candidateName');
    const jobTitle = queryParams.get('jobTitle');

    if (candidateName) {
      // Find or create conversation for this candidate
      const existing = conversations.find(c => 
        c.partner.name.toLowerCase().includes(candidateName.toLowerCase())
      );

      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const newConv = {
          id: `conv_${Date.now()}`,
          partner: {
            id: `usr_${Date.now()}`,
            name: candidateName,
            email: `${candidateName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            role: user?.role === 'recruiter' ? 'candidate' : 'recruiter',
            title: jobTitle ? `Applicant for ${jobTitle}` : 'Software Professional',
            company: 'Candidate',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=f9571c&color=fff`,
            online: true
          },
          job: {
            id: `job_${Date.now()}`,
            title: jobTitle || 'General Inquiry',
            company: user?.companyName || 'Our Company',
            salary: 'Competitive',
            location: 'Remote'
          },
          applicationStatus: 'In Discussion',
          unreadCount: 0,
          messages: [
            {
              id: `msg_${Date.now()}`,
              senderId: 'system',
              text: `Conversation started regarding ${jobTitle || 'job opportunity'}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: 'Today',
              read: true
            }
          ]
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(newConv.id);
      }
    }
  }, [location.search]);

  // Fetch real messages from backend API if available
  useEffect(() => {
    const fetchApiConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.success && res.data.conversations.length > 0) {
          // Merge API conversations with UI format
          const formatted = res.data.conversations.map((c, idx) => ({
            id: `api_conv_${c.user._id}`,
            partner: {
              id: c.user._id,
              name: c.user.name,
              email: c.user.email,
              role: c.user.role,
              title: c.user.tagline || `${c.user.role === 'recruiter' ? 'Hiring Manager' : 'Candidate'}`,
              company: c.user.location || 'JobPortal Platform',
              avatar: c.user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name)}&background=f9571c&color=fff`,
              online: true
            },
            job: c.lastMessage?.job ? {
              id: c.lastMessage.job._id,
              title: c.lastMessage.job.title,
              company: c.lastMessage.job.company,
              salary: 'Negotiable',
              location: 'Remote'
            } : {
              title: 'Active Job Application',
              company: 'JobPortal Network'
            },
            applicationStatus: 'Active',
            unreadCount: c.unreadCount || 0,
            messages: [
              {
                id: c.lastMessage._id,
                senderId: c.lastMessage.sender._id === user?._id ? 'candidate_me' : c.lastMessage.sender._id,
                text: c.lastMessage.content,
                timestamp: new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: 'Today',
                read: c.lastMessage.read
              }
            ]
          }));

          setConversations(formatted);
          if (formatted.length > 0) setActiveConvId(formatted[0].id);
        }
      } catch (err) {
        // Soft fallback to local state if backend API has no database messages
        console.log('Using local client state for conversations UI');
      }
    };

    fetchApiConversations();
  }, [user]);

  // Scroll message view to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const showToastNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsgText = inputText.trim();
    setInputText('');

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'candidate_me',
      text: newMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      read: true
    };

    // Update active conversation locally
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            unreadCount: 0,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    // Try posting message to backend API asynchronously
    try {
      const token = localStorage.getItem('token');
      if (token && activeConv.partner?.id && !activeConv.partner.id.startsWith('rec_')) {
        await axios.post(
          `${API_BASE_URL}/messages`,
          {
            receiverId: activeConv.partner.id,
            content: newMsgText,
            jobId: activeConv.job?.id
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.log('Saved message to local state');
    }

    // Auto-reply simulation for interactive experience if testing
    setTimeout(() => {
      const replyOptions = [
        "Thanks for your message! I have logged this update in our recruitment dashboard.",
        "Got it! Let me review this with the hiring team and I will get back to you shortly.",
        "That sounds great! I've updated your application status accordingly.",
        "Appreciate the prompt response! Let's stay in touch."
      ];
      const randomReply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

      const autoReply = {
        id: `msg_reply_${Date.now()}`,
        senderId: activeConv.partner.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        read: false
      };

      setConversations(prev =>
        prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, autoReply]
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const markConvAsRead = (id) => {
    setActiveConvId(id);
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch =
      c.partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'unread') return c.unreadCount > 0;
    if (filterType === 'recruiters') return c.partner.role === 'recruiter';
    if (filterType === 'candidates') return c.partner.role === 'candidate';
    return true;
  });

  return (
    <div className="h-[calc(100vh-100px)] min-h-[620px] bg-white rounded-3xl border border-gray-200/90 shadow-sm flex overflow-hidden">
      {/* Toast notification overlay */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-gray-800">
          <Sparkles className="w-4 h-4 text-[#f9571c]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. LEFT SIDEBAR - CONVERSATION LIST */}
      <div className="w-80 md:w-96 border-r border-gray-100 flex flex-col bg-gray-50/50 shrink-0">
        {/* Header & Search */}
        <div className="p-4 border-b border-gray-100 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#fff5ee] text-[#f9571c] flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Messages</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#f9571c]">
              {conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0)} unread
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, names, jobs..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-100/80 border border-transparent rounded-xl focus:bg-white focus:border-[#f9571c]/30 focus:outline-none focus:ring-2 focus:ring-[#f9571c]/10 font-medium text-gray-800 placeholder:text-gray-400 transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'recruiters', label: 'Recruiters' },
              { id: 'candidates', label: 'Candidates' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#f9571c] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100/60">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-gray-500">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isActive = conv.id === activeConvId;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => markConvAsRead(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white border-l-4 border-l-[#f9571c] shadow-xs'
                      : 'hover:bg-white/80'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.partner.avatar}
                      alt={conv.partner.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200"
                    />
                    {conv.partner.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Conv Preview Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                        {conv.partner.name}
                      </h4>
                      <span className="text-[10px] font-medium text-gray-400 shrink-0">
                        {lastMsg?.timestamp || ''}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-[#f9571c] truncate mb-1">
                      {conv.job?.title || 'General Chat'}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                        {lastMsg?.text || 'No messages yet'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 w-4 h-4 rounded-full bg-[#f9571c] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. MAIN CHAT AREA */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.partner.avatar}
                  alt={activeConv.partner.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                {activeConv.partner.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-gray-900">{activeConv.partner.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 capitalize">
                    {activeConv.partner.role}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
                  <span>{activeConv.partner.title}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Now
                  </span>
                </p>
              </div>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToastNotification(`Calling ${activeConv.partner.name}...`)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                title="Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToastNotification(`Starting video interview with ${activeConv.partner.name}...`)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDetailDrawer(!showDetailDrawer)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  showDetailDrawer ? 'bg-orange-50 text-[#f9571c]' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Job & Application Context"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fcfbfa]/60">
            {/* System Info Banner */}
            <div className="text-center my-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#f9571c]">
                <ShieldCheck className="w-3.5 h-3.5" /> End-to-end encrypted recruitment channel for {activeConv.job?.title}
              </span>
            </div>

            {activeConv.messages.map((msg, idx) => {
              const isMe = msg.senderId === 'candidate_me';

              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={activeConv.partner.avatar}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover mb-1 border border-gray-200"
                    />
                  )}

                  <div className={`max-w-md space-y-1.5 ${isMe ? 'items-end text-right' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-[#f9571c] text-white rounded-br-xs'
                          : 'bg-white border border-gray-200/80 text-gray-800 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Attachment Card if present */}
                      {msg.attachment && (
                        <div className={`mt-2 p-2.5 rounded-xl flex items-center justify-between gap-3 ${
                          isMe ? 'bg-white/15 text-white' : 'bg-gray-50 border border-gray-200 text-gray-800'
                        }`}>
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 shrink-0 text-[#f9571c]" />
                            <span className="truncate text-[11px] font-bold">{msg.attachment.name}</span>
                          </div>
                          <button
                            onClick={() => showToastNotification(`Downloading ${msg.attachment.name}...`)}
                            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white shrink-0 cursor-pointer"
                          >
                            Download
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center gap-1.5 text-[10px] font-medium text-gray-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Prompts */}
          <div className="px-5 py-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#f9571c]" /> Quick Replies:
            </span>
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => setInputText(prompt)}
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#f9571c] hover:border-orange-200 border border-transparent transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Composer Footer Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <button
              type="button"
              onClick={() => showToastNotification('File upload attachment ready!')}
              className="p-2 text-gray-400 hover:text-[#f9571c] hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
              title="Attach File / Resume"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type your message to ${activeConv.partner.name}...`}
                className="w-full pl-4 pr-10 py-3 text-xs bg-gray-100/70 border border-gray-200/80 rounded-2xl focus:bg-white focus:border-[#f9571c] focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 font-medium text-gray-900 placeholder:text-gray-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setInputText(prev => prev + ' 😊')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-[#f9571c] hover:bg-[#e0480e] disabled:opacity-40 text-white rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-[#f9571c] flex items-center justify-center">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Select a conversation</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Choose a contact from the left list to view your recruitment messages and active applications.
          </p>
        </div>
      )}

      {/* 3. RIGHT DETAILS DRAWER */}
      {activeConv && showDetailDrawer && (
        <div className="w-72 border-l border-gray-100 bg-white p-5 flex flex-col justify-between shrink-0 overflow-y-auto space-y-6">
          <div className="space-y-6">
            {/* Header / Close */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Context & Info</h4>
              <button
                onClick={() => setShowDetailDrawer(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="text-center space-y-2">
              <img
                src={activeConv.partner.avatar}
                alt={activeConv.partner.name}
                className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-orange-100"
              />
              <h3 className="text-sm font-extrabold text-gray-900">{activeConv.partner.name}</h3>
              <p className="text-xs font-medium text-gray-500">{activeConv.partner.title}</p>
              <p className="text-[11px] font-semibold text-[#f9571c] flex items-center justify-center gap-1">
                <Building className="w-3.5 h-3.5" /> {activeConv.partner.company}
              </p>
            </div>

            {/* Application Info Box */}
            <div className="bg-[#fff5ee] p-4 rounded-2xl border border-orange-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-gray-400">Application</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f9571c] text-white">
                  {activeConv.applicationStatus}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-gray-900 leading-snug">{activeConv.job?.title}</h4>
                <p className="text-[11px] text-gray-500 font-medium">{activeConv.job?.location}</p>
              </div>

              <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-gray-600">Offered Salary:</span>
                <span className="font-bold text-gray-900">{activeConv.job?.salary}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quick Actions</h5>
              <button
                onClick={() => navigate('/jobs')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#f9571c]" /> View Job Posting</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => showToastNotification('Resume downloaded to local storage.')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#f9571c]" /> Download Resume</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <p className="text-[10px] text-gray-400 font-medium">JobPortal Messaging v1.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
