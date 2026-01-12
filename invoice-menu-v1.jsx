import React, { useState, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  Menu, 
  Calendar, 
  ChevronDown, 
  Loader2, 
  Edit3, 
  Save, 
  X, 
  Eye,
  EyeOff,
  Minimize2,
} from 'lucide-react';

// --- Mock Data ---
const INVOICE_A_ID = 'INV-2026-001';
const INVOICE_B_ID = 'INV-2026-002';

// 명세서별 메타 데이터 (OCR 결과로 추출된 총 세액 정보 등)
const INVOICE_META = {
  [INVOICE_A_ID]: {
    hasSeparateTax: true, // 세액 별도 표기 명세서
    taxAmount: 14545      // 추출된 총 세액 (예시)
  },
  [INVOICE_B_ID]: {
    hasSeparateTax: false, // 세액 미표기/면세 등
    taxAmount: 0
  }
};

const INVOICE_IMAGE_DATA = {
  [INVOICE_A_ID]: {
    src: '/invoices/invoice-a.png',
    fileName: 'invoice-a.png',
    pageLabel: 'Page 1/2'
  },
  [INVOICE_B_ID]: {
    src: '/invoices/invoice-b.jpg',
    fileName: 'invoice-b.jpg',
    pageLabel: 'Page 2/2'
  }
};

const INITIAL_DATA = [
  {
    id: 1,
    invoiceId: INVOICE_A_ID,
    invoiceName: '비타민하우스 | 2026-001',
    status: 'completed',
    name: '단쇄지방산 SCFA455',
    standard: '1,200mgX90정',
    qty: 5,
    price: 28000, 
    lot: 'A203947',
    expiry: '2027-03-12',
    note: '',
    isLotMissing: true
  },
  {
    id: 2,
    invoiceId: INVOICE_A_ID,
    invoiceName: '비타민하우스 | 2026-001',
    status: 'completed',
    name: '미라클 프로젝트 NMN250',
    standard: '1,000mgX30정',
    qty: 5,
    price: 21000,
    lot: 'A203948',
    expiry: '2028-05-06',
    note: '',
    isLotMissing: false
  },
  {
    id: 3,
    invoiceId: INVOICE_A_ID,
    invoiceName: '비타민하우스 | 2026-001',
    status: 'completed',
    name: '위UP로 가는 SOD효소',
    standard: '2gX30포(60g)',
    qty: 5,
    price: 10500,
    lot: 'B102938',
    expiry: '2027-11-20',
    note: '',
    isLotMissing: false
  },
  {
    id: 4,
    invoiceId: INVOICE_B_ID,
    invoiceName: '(주)녹십자 | 2026-002',
    status: 'analyzing',
    name: '탁센 연질캡슐',
    standard: '10C',
    qty: 50,
    price: 2750,
    lot: 'C998877',
    expiry: '2026-12-31',
    note: '매대진열',
    isLotMissing: false
  },
  {
    id: 5,
    invoiceId: INVOICE_B_ID,
    invoiceName: '(주)녹십자 | 2026-002',
    status: 'analyzing',
    name: '비맥스 메타정',
    standard: '100T',
    qty: 20,
    price: 49500,
    lot: 'D112233',
    expiry: '2028-01-15',
    note: '',
    isLotMissing: false
  },
  {
    id: 6,
    invoiceId: INVOICE_B_ID,
    invoiceName: '(주)녹십자 | 2026-002',
    status: 'analyzing',
    name: '제놀 쿨 파스',
    standard: '5매입',
    qty: 100,
    price: 880,
    lot: 'E554433',
    expiry: '2027-06-01',
    note: '반품불가',
    isLotMissing: false
  }
];

// --- Helper Functions ---
const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(Math.round(val));
const getInvoiceImageData = (invoiceId) =>
  INVOICE_IMAGE_DATA[invoiceId] || INVOICE_IMAGE_DATA[INVOICE_A_ID];

export default function PharmxAIApp() {
  const [items, setItems] = useState(INITIAL_DATA);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeInvoiceId, setActiveInvoiceId] = useState(INVOICE_A_ID);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [editViewMode, setEditViewMode] = useState('A');
  const [isEditImageVisible, setIsEditImageVisible] = useState(true);
  const [isEditImageCollapsed, setIsEditImageCollapsed] = useState(false);
  
  // Refs for Scroll Spy
  const listContainerRef = useRef(null);
  const invoiceBRef = useRef(null);

  // Computed Values
  const isEditing = editingId !== null;
  const activeImageData = getInvoiceImageData(activeInvoiceId);
  
  // Determine height class based on state
  const imageContainerHeightClass = useMemo(() => {
    if (!isImageViewVisible) return 'h-0 border-b-0'; 
    return 'h-[45%] border-b border-gray-400'; 
  }, [isImageViewVisible]);

  // Scroll Handler
  const handleScroll = () => {
    if (listContainerRef.current && invoiceBRef.current) {
      const containerTop = listContainerRef.current.getBoundingClientRect().top;
      const invoiceBTop = invoiceBRef.current.getBoundingClientRect().top;
      if (invoiceBTop - containerTop < 200) {
        setActiveInvoiceId(INVOICE_B_ID);
      } else {
        setActiveInvoiceId(INVOICE_A_ID);
      }
    }
  };

  // --- Handlers ---
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
    setIsEditImageVisible(true);
    setIsEditImageCollapsed(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    setItems(prev => prev.map(item => item.id === editingId ? editForm : item));
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Group items
  const invoiceAGroup = items.filter(i => i.invoiceId === INVOICE_A_ID);
  const invoiceBGroup = items.filter(i => i.invoiceId === INVOICE_B_ID);

  // Calculate Totals per Invoice (Simple Sum)
  const getInvoiceTotal = (group) => {
    return group.reduce((acc, item) => acc + (item.qty * item.price), 0);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
      
      {/* 1. Global Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <h1 className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</h1>
        </div>
        <div className="flex gap-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Bell className="w-5 h-5 text-gray-500" />
          <Menu className="w-5 h-5 text-gray-500" />
        </div>
      </header>

      {/* 2. Filter Bar */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1 text-gray-700 font-medium text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>2026.01.06 (화)</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
        <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
          당일 업로드 조회
        </button>
      </div>

      {/* 3. Split View Container */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        
        {/* A. Sticky Image Viewer */}
        <div 
          className={`bg-slate-800 w-full relative transition-all duration-500 ease-in-out shrink-0 overflow-hidden flex items-center justify-center
            ${imageContainerHeightClass}`}
        >
          <img
            src={activeImageData.src}
            alt="거래명세서 이미지"
            className="absolute inset-0 h-full w-full object-contain"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
          
          {!isEditing && isImageViewVisible && (
            <button 
              onClick={() => setIsImageViewVisible(false)}
              className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 text-white/70 rounded-full transition-colors"
              title="이미지 접기"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* B. Scrollable List Area */}
        <div 
          ref={listContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth transition-all"
        >
          {/* Invoice A Section */}
          <InvoiceSection 
            invoiceId={INVOICE_A_ID}
            title="비타민하우스 | 2026-001" 
            status="completed" 
            totalAmount={getInvoiceTotal(invoiceAGroup)}
            taxAmount={INVOICE_META[INVOICE_A_ID].taxAmount}
            hasSeparateTax={INVOICE_META[INVOICE_A_ID].hasSeparateTax}
            items={invoiceAGroup}
            isEditing={isEditing}
            isImageVisible={isImageViewVisible}
            onToggleImage={() => setIsImageViewVisible(!isImageViewVisible)}
            onStartEdit={startEditing}
          />

          {/* Invoice B Section */}
          <div ref={invoiceBRef}>
            <InvoiceSection 
              invoiceId={INVOICE_B_ID}
              title="(주)녹십자 | 2026-002" 
              status="analyzing" 
              totalAmount={getInvoiceTotal(invoiceBGroup)}
              taxAmount={INVOICE_META[INVOICE_B_ID].taxAmount}
              hasSeparateTax={INVOICE_META[INVOICE_B_ID].hasSeparateTax}
              items={invoiceBGroup}
              isEditing={isEditing}
              isImageVisible={isImageViewVisible}
              onToggleImage={() => setIsImageViewVisible(!isImageViewVisible)}
              onStartEdit={startEditing}
            />
          </div>

          {/* Dynamic Bottom Spacer: Expands in edit mode to allow scrolling the last item up */}
          <div className={`transition-all duration-300 ${isEditing ? 'h-[350px]' : 'h-24'}`}></div>
        </div>

        {isEditing && (
          <EditOverlay 
            data={editForm}
            invoiceId={editForm.invoiceId}
            viewMode={editViewMode}
            onViewModeChange={setEditViewMode}
            isImageVisible={isEditImageVisible}
            onToggleImage={() => setIsEditImageVisible(prev => !prev)}
            isImageCollapsed={isEditImageCollapsed}
            onToggleImageCollapse={() => setIsEditImageCollapsed(prev => !prev)}
            onChange={handleInputChange}
            onCancel={cancelEditing}
            onSave={saveEditing}
          />
        )}

      </div>
    </div>
  );
}

// --- Invoice Section Component ---
function InvoiceSection({ 
  invoiceId,
  title, 
  status, 
  totalAmount,
  taxAmount,
  hasSeparateTax,
  items, 
  isEditing, 
  isImageVisible, 
  onToggleImage,
  onStartEdit
}) {
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': 
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">처리 완료</span>;
      case 'analyzing':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/>AI 분석중</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">대기</span>;
    }
  };

  const supplyValue = hasSeparateTax ? totalAmount - taxAmount : totalAmount;

  return (
    <div className="mb-2">
      {/* Section Header */}
      <div className="bg-white sticky top-0 z-30 px-4 py-3 border-b border-gray-100 shadow-sm flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getStatusBadge(status)}
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

        {/* Toolbar: Image Toggle Only */}
        <div className="flex justify-end border-t border-gray-50 pt-2">
          <button 
            onClick={onToggleImage}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${isImageVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            {isImageVisible ? <><Eye className="w-3 h-3" /> 거래명세서 보기 ON</> : <><EyeOff className="w-3 h-3" /> 거래명세서 보기 OFF</>}
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white divide-y divide-gray-100">
        {items.map((item) => (
          <ViewItem 
            key={item.id} 
            data={item} 
            onEdit={() => onStartEdit(item)} 
            disabled={isEditing}
          />
        ))}
      </div>
    </div>
  );
}

function EditOverlay({ 
  data, 
  invoiceId,
  viewMode,
  onViewModeChange,
  isImageVisible,
  onToggleImage,
  isImageCollapsed,
  onToggleImageCollapse,
  onChange, 
  onCancel, 
  onSave 
}) {
  const safeInvoiceId = invoiceId === INVOICE_B_ID ? INVOICE_B_ID : INVOICE_A_ID;
  const modeButtonClass = (mode) =>
    `px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
      viewMode === mode ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="absolute inset-0 z-50 bg-white">
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">편집 보기</span>
              <div className="flex rounded-full border border-gray-200 bg-gray-50 p-0.5">
                <button className={modeButtonClass('A')} onClick={() => onViewModeChange('A')}>A안</button>
                <button className={modeButtonClass('B')} onClick={() => onViewModeChange('B')}>B안</button>
                <button className={modeButtonClass('C')} onClick={() => onViewModeChange('C')}>C안</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onToggleImage}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  isImageVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                {isImageVisible ? <><Eye className="w-3 h-3" /> 거래명세서 보기 ON</> : <><EyeOff className="w-3 h-3" /> 거래명세서 보기 OFF</>}
              </button>
              {viewMode === 'B' && isImageVisible && (
                <button 
                  onClick={onToggleImageCollapse}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-600"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${isImageCollapsed ? '' : 'rotate-180'}`} />
                  {isImageCollapsed ? '이미지 펼치기' : '이미지 접기'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50">
          {viewMode === 'A' && (
            <div className="flex h-full flex-col">
              {isImageVisible && (
                <div className="shrink-0 h-[30%] border-b border-gray-300">
                  <EditImagePreview invoiceId={safeInvoiceId} />
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                <EditItem 
                  data={data} 
                  onChange={onChange} 
                  onCancel={onCancel}
                  onSave={onSave}
                />
              </div>
            </div>
          )}

          {viewMode === 'B' && (
            <div className="flex h-full flex-col">
              {isImageVisible && (
                <div className={`shrink-0 border-b border-gray-300 transition-all duration-300 ${isImageCollapsed ? 'h-12' : 'h-[30%]'}`}>
                  {isImageCollapsed ? (
                    <div className="flex h-full items-center justify-between px-4">
                      <span className="text-xs font-semibold text-gray-600">거래명세서 이미지</span>
                      <button 
                        onClick={onToggleImageCollapse}
                        className="text-xs font-semibold text-blue-600"
                      >
                        펼치기
                      </button>
                    </div>
                  ) : (
                    <EditImagePreview invoiceId={safeInvoiceId} />
                  )}
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                <EditItem 
                  data={data} 
                  onChange={onChange} 
                  onCancel={onCancel}
                  onSave={onSave}
                />
              </div>
            </div>
          )}

          {viewMode === 'C' && (
            <div className="relative h-full">
              <div className="h-full overflow-y-auto pb-32 pr-28">
                <EditItem 
                  data={data} 
                  onChange={onChange} 
                  onCancel={onCancel}
                  onSave={onSave}
                />
              </div>
              {isImageVisible && (
                <div className="absolute bottom-4 right-4 h-40 w-32 overflow-hidden rounded-xl border border-gray-300 shadow-lg">
                  <EditImagePreview invoiceId={safeInvoiceId} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditImagePreview({ invoiceId }) {
  const safeInvoiceId = invoiceId === INVOICE_B_ID ? INVOICE_B_ID : INVOICE_A_ID;
  const imageData = getInvoiceImageData(safeInvoiceId);

  return (
    <div className="relative h-full w-full bg-slate-800 overflow-hidden flex items-center justify-center">
      <img
        src={imageData.src}
        alt="거래명세서 이미지"
        className="absolute inset-0 h-full w-full object-contain"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
    </div>
  );
}

// --- Read Mode Item ---
function ViewItem({ data, onEdit, disabled }) {
  const getValueStyle = (value) => value ? 'text-gray-900' : 'text-gray-300 font-normal';
  const getDisplayValue = (value) => value || '-';

  // Simple calculation: qty * price
  const total = data.qty * data.price;

  return (
    <div className={`p-4 transition-colors ${disabled ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-gray-800 leading-snug w-3/4 break-keep">
          {data.name}
        </h3>
        <button 
          onClick={onEdit}
          className="text-gray-400 hover:text-blue-600 p-1 -mr-2"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-2 bg-gray-50 p-2 rounded border border-gray-100 text-center">
        <div className="flex flex-col justify-center">
          <div className="text-[10px] text-gray-400 mb-0.5">규격</div>
          <div className={`text-xs font-semibold truncate ${getValueStyle(data.standard)}`}>
            {getDisplayValue(data.standard)}
          </div>
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
          <span className={`truncate block ${getValueStyle(data.note)}`} title={data.note}>
            {getDisplayValue(data.note)}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Edit Mode Item ---
function EditItem({ data, onChange, onCancel, onSave }) {
  // Simple auto-calculation for display
  const total = data.qty * data.price;

  // 2. Focus Handler to scroll input into view (when keyboard pops up)
  const handleFocus = (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400); // Slightly longer delay for keyboard animation
  };

  return (
    <div className="p-4 bg-blue-50/50 border-l-4 border-blue-600 animate-fade-in scroll-mt-32">
      <div className="flex justify-between items-center mb-3 sticky top-0 z-10 bg-blue-50/95 py-2">
        <h3 className="text-sm font-bold text-gray-800 truncate pr-2">{data.name}</h3>
        <div className="flex gap-2">
          <button 
            onClick={onCancel}
            className="px-3 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm"
          >
            <X className="w-3 h-3 inline-block -mt-0.5 mr-1" />
            취소
          </button>
          <button 
            onClick={onSave}
            className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-sm"
          >
            <Save className="w-3 h-3 inline-block -mt-0.5 mr-1" />
            저장 완료
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">규격</label>
          <input 
            type="text" 
            value={data.standard}
            placeholder="-"
            onChange={(e) => onChange('standard', e.target.value)}
            onFocus={handleFocus}
            className="w-full text-center font-bold text-gray-700 text-sm border-b-2 border-gray-300 bg-white p-1 focus:outline-none focus:border-blue-500 placeholder-gray-300"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">수량</label>
          <input 
            type="number" 
            value={data.qty}
            onChange={(e) => onChange('qty', parseInt(e.target.value) || 0)}
            onFocus={handleFocus}
            className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">단가</label>
          <input 
            type="number" 
            value={data.price}
            onChange={(e) => onChange('price', parseInt(e.target.value) || 0)}
            onFocus={handleFocus}
            className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Simplified Auto Calculated Total */}
      <div className="flex justify-end items-center mb-4 px-3 py-2 bg-gray-100 rounded text-xs">
        <span className="text-[10px] text-gray-400 mr-2">=</span>
        <span className="text-[10px] text-gray-500 mr-2">금액 합계</span>
        <span className="font-bold text-blue-700 text-sm">₩{formatCurrency(total)}</span>
      </div>

      {/* Second Row Inputs */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">제조번호</label>
          <input 
            type="text" 
            value={data.lot}
            placeholder="-"
            onChange={(e) => onChange('lot', e.target.value)}
            onFocus={handleFocus}
            className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">유효기간</label>
          <input 
            type="date" 
            value={data.expiry}
            onChange={(e) => onChange('expiry', e.target.value)}
            onFocus={handleFocus}
            className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">비고</label>
          <input 
            type="text" 
            value={data.note}
            placeholder="-"
            onChange={(e) => onChange('note', e.target.value)}
            onFocus={handleFocus}
            className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
