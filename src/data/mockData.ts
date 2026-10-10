export type ClassItem = {
  id: string
  name: string
  description: string
  ageGroup: string
  timing: string
  fee: string
  accent: string
}

export type GalleryItem = {
  id: string
  title: string
  category: string
  image: string
}

export type Batch = {
  id: string
  name: string
  day: string
  timing: string
  level: string
}

export type AdmissionRecord = {
  id: string
  studentName: string
  parentName: string
  phone: string
  requestedClass: string
  batch: string
  status: 'Pending' | 'Contacted' | 'Approved' | 'Rejected'
  createdAt: string
}

export const academyConfig = {
  name: 'Feel The Dance Studio',
  wordmark: 'Feel The Dance Studio',
  phone: '(Sample) +91 98765 43210',
  whatsapp: '(Sample) +91 98765 43210',
  email: 'hello@feel-the-dance-studio.example',
  address: 'Sample address, Sector 62, Noida, Uttar Pradesh',
  mapLink: 'https://maps.google.com/?q=Noida+Sector+62',
  hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
  currency: 'INR',
  heroTitle: 'Move with confidence. Dance with purpose.',
  heroSubtitle:
    'Premium dance training for kids, teens, and adults in a vibrant, encouraging studio experience.',
  theme: {
    primary: '#f56565',
    secondary: '#f472b6',
    accent: '#fbbf24',
    surface: '#1f2937',
  },
}

export const classes: ClassItem[] = [
  {
    id: 'bollywood',
    name: 'Bollywood Groove',
    description: 'High-energy choreography inspired by the rhythm and storytelling of Bollywood.',
    ageGroup: 'Ages 7–18',
    timing: 'Tue & Thu · 5:30 PM',
    fee: '₹4,500 / month',
    accent: 'from-rose-500 to-orange-400',
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop Crew',
    description: 'Dynamic freestyle, rhythm drills, and expressive movement with confidence-building routines.',
    ageGroup: 'Ages 9–25',
    timing: 'Mon & Wed · 6:30 PM',
    fee: '₹5,000 / month',
    accent: 'from-fuchsia-500 to-pink-500',
  },
  {
    id: 'contemporary',
    name: 'Contemporary Flow',
    description: 'Fluid choreography and emotional storytelling for students who love expressive movement.',
    ageGroup: 'Ages 12+',
    timing: 'Sat · 10:00 AM',
    fee: '₹5,500 / month',
    accent: 'from-violet-500 to-indigo-500',
  },
  {
    id: 'freestyle',
    name: 'Freestyle Fusion',
    description: 'Creative movement combining musicality, improvisation, and stage awareness.',
    ageGroup: 'Ages 8–30',
    timing: 'Fri · 7:00 PM',
    fee: '₹4,800 / month',
    accent: 'from-cyan-500 to-blue-500',
  },
]

export const batches: Batch[] = [
  { id: 'batch-1', name: 'Beginner', day: 'Mon, Wed', timing: '5:00 PM', level: 'Kids' },
  { id: 'batch-2', name: 'Intermediate', day: 'Tue, Thu', timing: '6:00 PM', level: 'Teens' },
  { id: 'batch-3', name: 'Advanced Crew', day: 'Sat', timing: '9:30 AM', level: 'Adults' },
]

export const gallery = [
  { id: 'g1', title: 'Winter recital rehearsal', category: 'Studio', image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80' },
  { id: 'g2', title: 'Bollywood routine', category: 'Performance', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05f9a5f?auto=format&fit=crop&w=900&q=80' },
  { id: 'g3', title: 'Team formation class', category: 'Class', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80' },
  { id: 'g4', title: 'Contemporary training', category: 'Movement', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80' },
]

export const faqs = [
  { question: 'Do you offer trial classes?', answer: 'Yes. Trial sessions help parents and students experience the energy, coaching style, and class atmosphere.' },
  { question: 'Are there beginner-friendly batches?', answer: 'Absolutely. We structure classes to support beginners, intermediate, and performance-focused learners.' },
  { question: 'Can I apply for admission online?', answer: 'Yes. Public applications are submitted securely from the admission page and reviewed by the admin team.' },
  { question: 'Do you teach both kids and adults?', answer: 'We offer age-appropriate programmes for kids, teens, and adults across multiple dance styles.' },
]

export const admissions: AdmissionRecord[] = [
  {
    id: 'APP-1001',
    studentName: 'Aanya Sharma',
    parentName: 'Rohit Sharma',
    phone: '+91 98765 43210',
    requestedClass: 'Bollywood Groove',
    batch: 'Beginner',
    status: 'Pending',
    createdAt: '2026-10-03',
  },
  {
    id: 'APP-1002',
    studentName: 'Kabir Mehta',
    parentName: 'Neha Mehta',
    phone: '+91 90000 11122',
    requestedClass: 'Hip-Hop Crew',
    batch: 'Intermediate',
    status: 'Contacted',
    createdAt: '2026-10-04',
  },
  {
    id: 'APP-1003',
    studentName: 'Ira Singh',
    parentName: 'Vikram Singh',
    phone: '+91 99876 54123',
    requestedClass: 'Contemporary Flow',
    batch: 'Advanced Crew',
    status: 'Approved',
    createdAt: '2026-10-02',
  },
]

export const students = [
  { id: 'STD-1001', name: 'Aanya Sharma', className: 'Bollywood Groove', batch: 'Beginner', attendance: 18, feesDue: 3500 },
  { id: 'STD-1002', name: 'Kabir Mehta', className: 'Hip-Hop Crew', batch: 'Intermediate', attendance: 15, feesDue: 2100 },
  { id: 'STD-1003', name: 'Ira Singh', className: 'Contemporary Flow', batch: 'Advanced Crew', attendance: 20, feesDue: 0 },
]

export const feeSummary = [
  { name: 'Paid', value: 62 },
  { name: 'Pending', value: 26 },
  { name: 'Overdue', value: 12 },
]

export const revenueTrend = [
  { month: 'Jan', revenue: 40000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 47000 },
  { month: 'Apr', revenue: 62000 },
  { month: 'May', revenue: 69000 },
  { month: 'Jun', revenue: 72000 },
]

export const reminderLog = [
  { id: 'R-01', student: 'Aanya Sharma', channel: 'WhatsApp', status: 'Queued', scheduledAt: '2026-10-11T09:00:00Z' },
  { id: 'R-02', student: 'Kabir Mehta', channel: 'SMS', status: 'Delivered', scheduledAt: '2026-10-10T18:00:00Z' },
]
