import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  Menu, 
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Edit3, 
  Save, 
  X, 
  RefreshCw,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Minimize2,
  FileText,
  Filter,
  ArrowUpDown,
  BarChart3,
  Building2,
  XCircle
} from 'lucide-react';

// --- Mock Data: Suppliers ---
const SUPPLIERS = [
  { id: 'all', name: '전체 공급사' },
  { id: 'drs', name: '(주)디알에스' },
  { id: 'gc', name: '(주)녹십자' },
  { id: 'yuhan', name: '(주)유한양행' },
  { id: 'chong', name: '종근당' }
];

// --- Mock Data: Invoice Summaries (For List View) ---
const INVOICE_SUMMARIES = [
  {
    id: 'INV-2026-001',
    supplierId: 'drs',
    supplierName: '(주)디알에스',
    date: '2026-01-06',
    title: '낙산균(Naksan)(수출용) 외 2건',
    totalAmount: 160000,
    totalQty: 17,
    status: 'completed',
    taxType: 'separate'
  },
  {
    id: 'INV-2026-002',
    supplierId: 'gc',
    supplierName: '(주)녹십자',
    date: '2026-01-06',
    title: '탁센 연질캡슐 10C 외 2건',
    totalAmount: 245000,
    totalQty: 170,
    status: 'analyzing',
    taxType: 'none'
  },
  {
    id: 'INV-2026-003',
    supplierId: 'yuhan',
    supplierName: '(주)유한양행',
    date: '2026-01-05',
    title: '안티푸라민 로션 외 5건',
    totalAmount: 320000,
    totalQty: 50,
    status: 'completed',
    taxType: 'included'
  },
  {
    id: 'INV-2026-004',
    supplierId: 'drs',
    supplierName: '(주)디알에스',
    date: '2026-01-04',
    title: '비타민D 2000IU 외 1건',
    totalAmount: 45000,
    totalQty: 10,
    status: 'completed',
    taxType: 'separate'
  },
  {
    id: 'INV-2026-005',
    supplierId: 'chong',
    supplierName: '종근당',
    date: '2025-12-28',
    title: '벤포벨 S정 외 3건',
    totalAmount: 560000,
    totalQty: 40,
    status: 'completed',
    taxType: 'separate'
  }
];

// --- Mock Data: Invoice Details (For Detail View) ---
// Reuse existing detail data logic mapped by ID
const INVOICE_A_ID = 'INV-2026-001';
const INVOICE_B_ID = 'INV-2026-002';

const INVOICE_META = {
  [INVOICE_A_ID]: { hasSeparateTax: true, taxAmount: 14545 },
  [INVOICE_B_ID]: { hasSeparateTax: false, taxAmount: 0 },
  // Fallback for others
  'default': { hasSeparateTax: true, taxAmount: 10000 }
};

const INITIAL_DETAIL_ITEMS = [
  {
    id: 1, invoiceId: INVOICE_A_ID, invoiceName: '(주)디알에스 | 2026-001', status: 'completed',
    name: '낙산균(Naksan)(수출용)', standard: '60C', qty: 2, price: 40000, lot: '', expiry: '2027-03-12', note: '', isLotMissing: true
  },
  {
    id: 2, invoiceId: INVOICE_A_ID, invoiceName: '(주)디알에스 | 2026-001', status: 'completed',
    name: '[DRS] 초임계 rTG오메가3 POLAR', standard: '30C x 2', qty: 10, price: 40000, lot: 'A203948', expiry: '2028-05-06', note: '행사상품', isLotMissing: false
  },
  {
    id: 3, invoiceId: INVOICE_A_ID, invoiceName: '(주)디알에스 | 2026-001', status: 'completed',
    name: '루테인 지아잔틴 164', standard: '30C', qty: 5, price: 13750, lot: 'B102938', expiry: '2027-11-20', note: '', isLotMissing: false
  },
  {
    id: 4, invoiceId: INVOICE_B_ID, invoiceName: '(주)녹십자 | 2026-002', status: 'analyzing',
    name: '탁센 연질캡슐', standard: '10C', qty: 50, price: 2750, lot: 'C998877', expiry: '2026-12-31', note: '매대진열', isLotMissing: false
  },
  {
    id: 5, invoiceId: INVOICE_B_ID, invoiceName: '(주)녹십자 | 2026-002', status: 'analyzing',
    name: '비맥스 메타정', standard: '100T', qty: 20, price: 49500, lot: 'D112233', expiry: '2028-01-15', note: '', isLotMissing: false
  },
  {
    id: 6, invoiceId: INVOICE_B_ID, invoiceName: '(주)녹십자 | 2026-002', status: 'analyzing',
    name: '제놀 쿨 파스', standard: '5매입', qty: 100, price: 880, lot: 'E554433', expiry: '2027-06-01', note: '반품불가', isLotMissing: false
  }
];

// --- Helper Functions ---
const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(Math.round(val));
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')} (${days[date.getDay()]})`;
};

// =================================================================================================
// MAIN APP CONTAINER
// =================================================================================================
export default function PharmxAIApp() {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'detail'
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // --- Navigation Handlers ---
  const handleSelectInvoice = (id) => {
    setSelectedInvoiceId(id);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInvoiceId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
      
      {/* 1. Global App Header (Mode Aware) */}
      <header className="bg-white px-4 py-3 border-b border-gray-200 z-50 shadow-sm shrink-0 min-h-[56px] flex items-center transition-all duration-300">
        {viewMode === 'list' ? (
          /* List Mode Header */
          <div className="flex items-center justify-between w-full animate-fade-in">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</h1>
            </div>
            <div className="flex gap-4">
              <Search className="w-5 h-5 text-gray-500" />
              <Bell className="w-5 h-5 text-gray-500" />
              <Menu className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        ) : (
          /* Detail Mode Header (Native App Style) */
          <div className="flex items-center justify-between w-full animate-fade-in">
            <button 
              onClick={handleBackToList} 
              className="flex items-center gap-1 text-gray-600 active:text-blue-600 p-1 -ml-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 group-active:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">목록</span>
            </button>
            <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
              거래명세서 상세
            </h1>
            <div className="w-8"></div> {/* Spacer for centering title */}
          </div>
        )}
      </header>

      {/* 2. Content Area (Switch between List & Detail) */}
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        {viewMode === 'list' ? (
          <SupplierListView onSelectInvoice={handleSelectInvoice} />
        ) : (
          <InvoiceDetailView invoiceId={selectedInvoiceId} onBack={handleBackToList} />
        )}
      </div>

    </div>
  );
}

// =================================================================================================
// 1. SUPPLIER MANAGEMENT LIST VIEW
// =================================================================================================
function SupplierListView({ onSelectInvoice }) {
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [dateRangeType, setDateRangeType] = useState('month'); // 'month' | 'custom'
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-01-31');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount'
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Toggle for Filter Panel

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let data = INVOICE_SUMMARIES;

    // 1. Supplier Filter
    if (selectedSupplier !== 'all') {
      data = data.filter(item => item.supplierId === selectedSupplier);
    }

    // 2. Date Filter
    if (dateRangeType === 'month') {
      data = data.filter(item => item.date.startsWith(selectedMonth));
    } else {
      data = data.filter(item => item.date >= startDate && item.date <= endDate);
    }

    // 3. Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.supplierName.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    }

    // 4. Sort
    data = [...data].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date); // Newest first
      if (sortBy === 'amount') return b.totalAmount - a.totalAmount; // Highest amount first
      return 0;
    });

    return data;
  }, [selectedSupplier, dateRangeType, selectedMonth, startDate, endDate, searchTerm, sortBy]);

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      count: acc.count + 1,
      amount: acc.amount + curr.totalAmount,
      qty: acc.qty + curr.totalQty
    }), { count: 0, amount: 0, qty: 0 });
  }, [filteredData]);

  // Display text for the filter bar
  const currentSupplierName = SUPPLIERS.find(s => s.id === selectedSupplier)?.name || '공급사 선택';
  const currentDateText = dateRangeType === 'month' 
    ? selectedMonth.replace('-', '.') 
    : `${startDate.slice(5).replace('-', '.')}~${endDate.slice(5).replace('-', '.')}`;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* A. Compact Sticky Filter Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-40 relative">
        
        {/* Compact Bar (Always Visible) */}
        <div className="flex items-center justify-between px-4 py-3 bg-white z-50 relative">
           <div className="flex gap-2 w-full">
             {/* Supplier Trigger */}
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className="flex-1 flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm active:bg-gray-100 transition-colors"
             >
                <div className="flex items-center gap-2 overflow-hidden">
                   <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                   <span className="font-bold text-gray-800 truncate">{currentSupplierName}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
             </button>

             {/* Date Trigger */}
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className="flex-1 flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm active:bg-gray-100 transition-colors"
             >
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                   <span className="font-bold text-gray-800">{currentDateText}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
             </button>
           </div>
        </div>

        {/* Expandable Panel (Accordion) */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${isFilterOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-4 space-y-4 bg-gray-50/50">
             {/* Full Supplier Select */}
             <div>
               <label className="text-xs font-bold text-gray-500 mb-1.5 block">공급사 상세 선택</label>
               <select 
                 value={selectedSupplier}
                 onChange={(e) => setSelectedSupplier(e.target.value)}
                 className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
               >
                 {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>
             </div>

             {/* Full Date Select */}
             <div>
               <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-500">기간 상세 설정</label>
                  <div className="flex bg-gray-200 rounded p-0.5">
                    <button onClick={() => setDateRangeType('month')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${dateRangeType === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>월별</button>
                    <button onClick={() => setDateRangeType('custom')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${dateRangeType === 'custom' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>직접입력</button>
                  </div>
               </div>
               
               {dateRangeType === 'month' ? (
                 <input 
                   type="month" 
                   value={selectedMonth}
                   onChange={(e) => setSelectedMonth(e.target.value)}
                   className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm"
                 />
               ) : (
                 <div className="flex items-center gap-2">
                   <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg p-2.5 text-xs" />
                   <span className="text-gray-400">~</span>
                   <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg p-2.5 text-xs" />
                 </div>
               )}
             </div>
             
             {/* Close Button */}
             <button 
               onClick={() => setIsFilterOpen(false)}
               className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
             >
               설정 적용 및 닫기
             </button>
          </div>
        </div>
      </div>

      {/* B. Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Statistics Dashboard */}
        <div className="p-4 bg-gray-50">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
            <h3 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> 기간 내 통계
            </h3>
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-500 mb-1">총 건수</p>
                <p className="text-lg font-bold text-gray-800">{stats.count}<span className="text-xs font-normal text-gray-400 ml-0.5">건</span></p>
              </div>
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-500 mb-1">총 수량</p>
                <p className="text-lg font-bold text-gray-800">{stats.qty}<span className="text-xs font-normal text-gray-400 ml-0.5">개</span></p>
              </div>
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-500 mb-1">총 매입액</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(stats.amount)}</p>
              </div>
            </div>
          </div>

          {/* Search & Sort Toolbar */}
          <div className="flex items-center justify-between mb-3">
             <div className="relative flex-1 mr-3">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="명세서 번호, 제품명 검색" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
               />
               {searchTerm && (
                 <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                   <XCircle className="w-4 h-4" />
                 </button>
               )}
             </div>
             <button 
                onClick={() => setSortBy(prev => prev === 'date' ? 'amount' : 'date')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-full shadow-sm"
             >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortBy === 'date' ? '최신순' : '금액순'}
             </button>
          </div>

          {/* List Items */}
          <div className="space-y-3 pb-10">
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onSelectInvoice(item.id)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{item.supplierName}</span>
                      <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                    </div>
                    {item.status === 'completed' ? (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3"/> 완료
                      </span>
                    ) : (
                       <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin"/> 분석중
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-3 truncate">{item.title}</h4>
                  <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                    <span className="text-xs text-gray-400">총 {item.totalQty}개 품목</span>
                    <span className="text-lg font-bold text-gray-900">₩{formatCurrency(item.totalAmount)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">조회된 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================================================
// 2. INVOICE DETAIL VIEW (Existing Feature Refactored)
// =================================================================================================
function InvoiceDetailView({ invoiceId, onBack }) {
  // Use Passed ID or default to 'INV-2026-001' logic for demo
  const activeId = invoiceId || INVOICE_A_ID;
  
  // Find initial data that belongs to this invoice (Filtered from global mock for demo)
  const initialItems = INITIAL_DETAIL_ITEMS.filter(item => {
    if (activeId === INVOICE_A_ID) return item.invoiceId === INVOICE_A_ID;
    if (activeId === INVOICE_B_ID) return item.invoiceId === INVOICE_B_ID;
    return item.invoiceId === INVOICE_A_ID; // Fallback
  });

  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isImageViewVisible, setIsImageViewVisible] = useState(true);
  
  // Meta data
  const meta = INVOICE_META[activeId] || INVOICE_META['default'];
  const title = activeId === INVOICE_A_ID ? '(주)디알에스 | 2026-001' : '(주)녹십자 | 2026-002';
  
  // Refs & Layout Logic
  const imageContainerHeightClass = useMemo(() => {
    if (!isImageViewVisible) return 'h-0 border-b-0'; 
    if (editingId !== null) return 'h-[20%] border-b border-gray-400'; 
    return 'h-[45%] border-b border-gray-400'; 
  }, [isImageViewVisible, editingId]);

  // Calculations
  const totalAmount = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  // Handlers
  const handleEditStart = (item) => { setEditingId(item.id); setEditForm({...item}); };
  const handleEditCancel = () => { setEditingId(null); setEditForm({}); };
  const handleEditSave = () => {
    setItems(prev => prev.map(i => i.id === editingId ? editForm : i));
    setEditingId(null);
  };
  const handleInputChange = (f, v) => setEditForm(prev => ({...prev, [f]: v}));

  return (
    <div className="flex flex-col h-full bg-gray-100 animate-slide-in-right">
      
      {/* Detail Toolbar (Sub Header) */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1 text-gray-700 font-medium text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>2026.01.06 (화)</span>
        </div>
        <div className="flex gap-2">
           <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">상세조회</span>
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        
        {/* Top: Image Viewer */}
        <div className={`bg-slate-800 w-full relative transition-all duration-500 ease-in-out shrink-0 overflow-hidden flex items-center justify-center ${imageContainerHeightClass}`}>
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
          <div className="relative z-10 text-center text-white/90">
             <div className="mb-2 flex justify-center"><ImageIcon className="w-8 h-8 opacity-50" /></div>
             <p className="text-sm font-medium">원본 거래명세서</p>
             <p className="text-xs text-white/60 mt-1">{activeId}</p>
          </div>
          {!editingId && isImageViewVisible && (
            <button onClick={() => setIsImageViewVisible(false)} className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 text-white/70 rounded-full transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom: List */}
        <div className="flex-1 overflow-y-auto bg-gray-50 pb-20 scroll-smooth">
           <InvoiceSection 
             invoiceId={activeId}
             title={title}
             status="completed"
             totalAmount={totalAmount}
             taxAmount={meta.taxAmount}
             hasSeparateTax={meta.hasSeparateTax}
             items={items}
             isEditing={editingId !== null}
             editingId={editingId}
             editForm={editForm}
             isImageVisible={isImageViewVisible}
             onToggleImage={() => setIsImageViewVisible(!isImageViewVisible)}
             onStartEdit={handleEditStart}
             onCancelEdit={handleEditCancel}
             onSaveEdit={handleEditSave}
             onChange={handleInputChange}
           />
           <div className={`transition-all duration-300 ${editingId ? 'h-[350px]' : 'h-24'}`}></div>
        </div>

        {/* Edit Action Bar */}
        {editingId && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-50 flex gap-2 animate-slide-up">
            <button onClick={handleEditCancel} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg flex items-center justify-center gap-2">
              <X className="w-4 h-4" /> 취소
            </button>
            <button onClick={handleEditSave} className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-blue-200 shadow-md">
              <Save className="w-4 h-4" /> 저장 완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-using the InvoiceSection, ViewItem, EditItem components from previous iteration
// (Optimized for context)

function InvoiceSection({ title, status, totalAmount, taxAmount, hasSeparateTax, items, isEditing, editingId, editForm, isImageVisible, onToggleImage, onStartEdit, onCancelEdit, onSaveEdit, onChange }) {
  const supplyValue = hasSeparateTax ? totalAmount - taxAmount : totalAmount;
  
  return (
    <div className="mb-2">
      <div className="bg-white sticky top-0 z-30 px-4 py-3 border-b border-gray-100 shadow-sm flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">처리 완료</span>
              <span className="text-xs text-gray-400 font-medium">No. {title.split('|')[1]}</span>
            </div>
            <h2 className="text-sm font-bold text-gray-800">{title.split('|')[0]}</h2>
          </div>
          <div className="text-right">
             {hasSeparateTax && (
               <div className="flex flex-col items-end mb-1">
                 <div className="flex gap-2 text-[10px] text-gray-400">
                   <span>공급가액 {formatCurrency(supplyValue)}</span>
                   <span className="w-px h-3 bg-gray-200 inline-block"></span>
                   <span>세액 {formatCurrency(taxAmount)}</span>
                 </div>
               </div>
             )}
             <div className="flex items-center justify-end gap-1">
                <span className="text-[10px] text-gray-400">총 합계</span>
                <p className="text-sm font-bold text-gray-900">₩{formatCurrency(totalAmount)}</p>
             </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-50 pt-2">
          <button onClick={onToggleImage} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${isImageVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
            {isImageVisible ? <><Eye className="w-3 h-3" /> 이미지 ON</> : <><EyeOff className="w-3 h-3" /> 이미지 OFF</>}
          </button>
        </div>
      </div>

      <div className="bg-white divide-y divide-gray-100">
        {items.map((item) => {
          const isItemEditing = editingId === item.id;
          return isItemEditing 
            ? <EditItem key={item.id} data={editForm} onChange={onChange} />
            : <ViewItem key={item.id} data={item} onEdit={() => onStartEdit(item)} disabled={isEditing && !isItemEditing} />;
        })}
      </div>
    </div>
  );
}

function ViewItem({ data, onEdit, disabled }) {
  const getValueStyle = (value) => value ? 'text-gray-900' : 'text-gray-300 font-normal';
  const getDisplayValue = (value) => value || '-';
  const total = data.qty * data.price;

  return (
    <div className={`p-4 transition-colors ${disabled ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-gray-800 leading-snug w-3/4 break-keep">{data.name}</h3>
        <button onClick={onEdit} className="text-gray-400 hover:text-blue-600 p-1 -mr-2"><Edit3 className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2 bg-gray-50 p-2 rounded border border-gray-100 text-center">
        <div className="flex flex-col justify-center">
          <div className="text-[10px] text-gray-400 mb-0.5">규격</div>
          <div className={`text-xs font-semibold truncate ${getValueStyle(data.standard)}`}>{getDisplayValue(data.standard)}</div>
        </div>
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">수량</div>
          <div className="text-xs font-bold text-gray-900">{data.qty}</div>
        </div>
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">단가</div>
          <div className="text-xs font-semibold text-gray-900">{formatCurrency(data.price)}</div>
        </div>
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">금액</div>
          <div className="text-xs font-bold text-blue-700">{formatCurrency(total)}</div>
        </div>
      </div>
      <div className="flex gap-2 text-xs">
        <div className="flex-1 px-2 py-1.5 rounded border bg-white border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">유효기간</span>
          <span className={getValueStyle(data.expiry)}>{getDisplayValue(data.expiry)}</span>
        </div>
        <div className="flex-1 px-2 py-1.5 rounded border bg-white border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">제조번호</span>
          <span className={getValueStyle(data.lot)}>{getDisplayValue(data.lot)}</span>
        </div>
        <div className="flex-1 px-2 py-1.5 rounded border bg-gray-50 border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">비고</span>
          <span className={`truncate block ${getValueStyle(data.note)}`} title={data.note}>{getDisplayValue(data.note)}</span>
        </div>
      </div>
    </div>
  );
}

function EditItem({ data, onChange }) {
  const itemRef = useRef(null);
  const total = data.qty * data.price;

  useEffect(() => {
    if (itemRef.current) {
      setTimeout(() => itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, []);

  const handleFocus = (e) => {
    setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
  };

  return (
    <div ref={itemRef} className="p-4 bg-blue-50/50 border-l-4 border-blue-600 animate-fade-in scroll-mt-32">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-800 truncate pr-2">{data.name}</h3>
        <button className="text-[10px] flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 shadow-sm"><RefreshCw className="w-3 h-3" /> OCR 재인식</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">규격</label>
          <input type="text" value={data.standard} placeholder="-" onChange={(e) => onChange('standard', e.target.value)} onFocus={handleFocus} className="w-full text-center font-bold text-gray-700 text-sm border-b-2 border-gray-300 bg-white p-1 focus:outline-none focus:border-blue-500 placeholder-gray-300" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">수량</label>
          <input type="number" value={data.qty} onChange={(e) => onChange('qty', parseInt(e.target.value) || 0)} onFocus={handleFocus} className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">단가</label>
          <input type="number" value={data.price} onChange={(e) => onChange('price', parseInt(e.target.value) || 0)} onFocus={handleFocus} className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4 px-3 py-2 bg-gray-100 rounded text-xs">
        <span className="text-[10px] text-gray-400 mr-2">=</span><span className="text-[10px] text-gray-500 mr-2">금액 합계</span><span className="font-bold text-blue-700 text-sm">₩{formatCurrency(total)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">제조번호</label>
          <input type="text" value={data.lot} placeholder="-" onChange={(e) => onChange('lot', e.target.value)} onFocus={handleFocus} className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">유효기간</label>
          <input type="date" value={data.expiry} onChange={(e) => onChange('expiry', e.target.value)} onFocus={handleFocus} className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 text-gray-900" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">비고</label>
          <input type="text" value={data.note} placeholder="-" onChange={(e) => onChange('note', e.target.value)} onFocus={handleFocus} className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300" />
        </div>
      </div>
    </div>
  );
}