# PharmxAI UI/UX 디자인 가이드

> 본 문서는 PharmxAI 프로젝트의 UI/UX 디자인 일관성을 유지하고, 향후 신규 메뉴 개발 시 참고할 수 있도록 작성되었습니다.

---

## 목차

1. [디자인 원칙](#1-디자인-원칙)
2. [기술 스택](#2-기술-스택)
3. [레이아웃 시스템](#3-레이아웃-시스템)
4. [컬러 시스템](#4-컬러-시스템)
5. [타이포그래피](#5-타이포그래피)
6. [컴포넌트 패턴](#6-컴포넌트-패턴)
7. [아이콘 사용](#7-아이콘-사용)
8. [상태 표시](#8-상태-표시)
9. [인터랙션 패턴](#9-인터랙션-패턴)
10. [애니메이션](#10-애니메이션)
11. [모바일 최적화](#11-모바일-최적화)
12. [접근성](#12-접근성)
13. [코드 컨벤션](#13-코드-컨벤션)

---

## 1. 디자인 원칙

### 1.1 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **명확성 (Clarity)** | 정보를 직관적으로 이해할 수 있도록 구성 |
| **효율성 (Efficiency)** | 최소한의 터치로 작업 완료 가능 |
| **일관성 (Consistency)** | 동일한 패턴과 컴포넌트 재사용 |
| **피드백 (Feedback)** | 사용자 액션에 대한 즉각적인 시각적 응답 |

### 1.2 모바일 퍼스트 접근

- 최대 너비 `max-w-md` (448px) 기준 모바일 레이아웃
- 터치 친화적 인터랙션 (최소 터치 영역 44x44px)
- 스와이프, 핀치 줌 등 제스처 지원

---

## 2. 기술 스택

```json
{
  "framework": "Next.js 14.x",
  "ui": "React 18.x",
  "styling": "Tailwind CSS 3.4.x",
  "icons": "Lucide React",
  "language": "JavaScript/JSX"
}
```

### 2.1 필수 의존성

```bash
npm install next react react-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
```

---

## 3. 레이아웃 시스템

### 3.1 기본 컨테이너 구조

```jsx
<div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
  {/* Header */}
  <header className="shrink-0">...</header>
  
  {/* Filter Bar */}
  <div className="shrink-0">...</div>
  
  {/* Main Content */}
  <div className="flex-1 overflow-hidden">...</div>
</div>
```

### 3.2 스플릿 뷰 패턴

이미지와 리스트를 동시에 표시하는 분할 화면 구조:

```jsx
<div className="flex flex-col flex-1 overflow-hidden relative">
  {/* 이미지 영역 (가변 높이) */}
  <div className={`shrink-0 h-[45%] transition-all duration-500`}>
    {/* 이미지 컨텐츠 */}
  </div>
  
  {/* 스크롤 가능한 리스트 영역 */}
  <div className="flex-1 overflow-y-auto">
    {/* 리스트 컨텐츠 */}
  </div>
</div>
```

### 3.3 높이 비율 기준

| 상태 | 이미지 영역 | 리스트 영역 |
|------|-------------|-------------|
| 기본 뷰 | 45% | 55% |
| 편집 모드 | 30% | 70% |
| 이미지 접힘 | 0% | 100% |

---

## 4. 컬러 시스템

### 4.1 브랜드 컬러

```css
/* Primary - Blue */
--primary-50: #eff6ff;   /* bg-blue-50 */
--primary-100: #dbeafe;  /* bg-blue-100 */
--primary-600: #2563eb;  /* bg-blue-600 - 주요 액션 버튼 */
--primary-700: #1d4ed8;  /* bg-blue-700 - 호버 상태 */
--primary-900: #1e3a8a;  /* text-blue-900 - 브랜드 로고 */
```

### 4.2 시맨틱 컬러

| 용도 | 배경 | 텍스트 | 보더 | 사용 예시 |
|------|------|--------|------|-----------|
| **성공/완료** | `bg-green-100` | `text-green-700` | `border-green-200` | 처리 완료 상태 |
| **정보/진행** | `bg-blue-100` | `text-blue-700` | `border-blue-200` | AI 분석 중 |
| **경고/주의** | `bg-amber-50` | `text-amber-600` | `border-amber-200` | 검수 필요 |
| **오류/실패** | `bg-red-100` | `text-red-700` | `border-red-200` | 처리 실패 |

### 4.3 중립 컬러 (Gray Scale)

```css
/* 배경 */
bg-gray-50   /* 카드 배경, 입력 영역 */
bg-gray-100  /* 앱 배경 */
bg-white     /* 기본 카드, 헤더 */

/* 텍스트 */
text-gray-900  /* 제목, 강조 텍스트 */
text-gray-800  /* 일반 본문 */
text-gray-600  /* 보조 텍스트 */
text-gray-500  /* 라벨 */
text-gray-400  /* 플레이스홀더, 비활성 */
text-gray-300  /* 빈 값 표시 */

/* 보더 */
border-gray-100  /* 구분선 (약함) */
border-gray-200  /* 카드 보더 */
border-gray-300  /* 입력 필드 보더 */
border-gray-400  /* 스플릿 구분선 */
```

### 4.4 이미지 뷰어 영역

```css
bg-slate-800  /* 이미지 뷰어 배경 */
text-white/90 /* 오버레이 텍스트 */
bg-black/30   /* 반투명 오버레이 */
```

---

## 5. 타이포그래피

### 5.1 폰트 크기 체계

| 용도 | Tailwind 클래스 | 사이즈 | 사용 예시 |
|------|-----------------|--------|-----------|
| 앱 타이틀 | `text-lg` | 18px | 헤더 로고 |
| 섹션 제목 | `text-sm` | 14px | 명세서 헤더 |
| 본문 | `text-sm` | 14px | 상품명, 버튼 |
| 보조 텍스트 | `text-xs` | 12px | 라벨, 값 |
| 캡션 | `text-[10px]` | 10px | 상태 배지, 힌트 |
| 초소형 | `text-[11px]` | 11px | 알림 설명 |

### 5.2 폰트 웨이트

```css
font-bold     /* 700 - 제목, 강조 값 */
font-semibold /* 600 - 버튼, 라벨 */
font-medium   /* 500 - 일반 텍스트 */
font-normal   /* 400 - 본문 */
```

### 5.3 텍스트 스타일 조합

```jsx
/* 앱 타이틀 */
<h1 className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</h1>

/* 섹션 제목 */
<h2 className="text-sm font-bold text-gray-800">공급사명</h2>

/* 라벨 */
<label className="text-[10px] font-bold text-gray-500 mb-1 block">규격</label>

/* 값 표시 */
<span className="text-xs font-semibold text-gray-900">값</span>

/* 금액 강조 */
<span className="text-sm font-bold text-blue-700">₩{formatCurrency(amount)}</span>
```

---

## 6. 컴포넌트 패턴

### 6.1 헤더 (Global Header)

```jsx
<header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50 shadow-sm shrink-0">
  {/* 좌측: 로고/타이틀 */}
  <div className="flex items-center gap-2">
    <h1 className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</h1>
  </div>
  
  {/* 우측: 액션 버튼들 */}
  <div className="flex gap-4">
    <button className="text-gray-500 hover:text-gray-700">
      <IconComponent className="w-5 h-5" />
    </button>
  </div>
</header>
```

### 6.2 필터 바 (Filter Bar)

```jsx
<div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-100 shrink-0">
  {/* 날짜 선택기 */}
  <div className="flex items-center gap-1 text-gray-700 font-medium text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
    <Calendar className="w-4 h-4 text-gray-500" />
    <span>2026.01.06 (화)</span>
    <ChevronDown className="w-3 h-3 text-gray-400" />
  </div>
  
  {/* 필터/액션 버튼 */}
  <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
    당일 업로드 조회
  </button>
</div>
```

### 6.3 섹션 헤더 (Section Header)

스크롤 시 상단에 고정되는 Sticky 헤더:

```jsx
<div className="bg-white sticky top-0 z-30 px-4 py-3 border-b border-gray-100 shadow-sm flex flex-col gap-2">
  <div className="flex justify-between items-start">
    {/* 좌측: 상태 + 제목 */}
    <div>
      <div className="flex items-center gap-2 mb-1">
        <StatusBadge status={status} />
        <span className="text-xs text-gray-400 font-medium">No. 2026-001</span>
      </div>
      <h2 className="text-sm font-bold text-gray-800">공급사명</h2>
    </div>
    
    {/* 우측: 금액 정보 */}
    <div className="text-right">
      <p className="text-sm font-bold text-gray-900">₩{formatCurrency(total)}</p>
    </div>
  </div>
  
  {/* 툴바 영역 */}
  <div className="flex justify-end border-t border-gray-50 pt-2">
    <ToggleButton />
  </div>
</div>
```

### 6.4 카드 아이템 (View Mode)

```jsx
<div className="p-4 transition-colors hover:bg-gray-50">
  {/* 헤더: 상품명 + 편집 버튼 */}
  <div className="flex justify-between items-start mb-2">
    <h3 className="text-sm font-bold text-gray-800 leading-snug w-3/4 break-keep">
      {data.name}
    </h3>
    <button className="text-gray-400 hover:text-blue-600 p-1 -mr-2">
      <Edit3 className="w-4 h-4" />
    </button>
  </div>

  {/* 주요 정보 그리드 */}
  <div className="grid grid-cols-4 gap-2 mb-2 bg-gray-50 p-2 rounded border border-gray-100 text-center">
    <DataCell label="규격" value={data.standard} />
    <DataCell label="수량" value={data.qty} bordered />
    <DataCell label="단가" value={formatCurrency(data.price)} bordered />
    <DataCell label="금액" value={formatCurrency(total)} bordered highlight />
  </div>

  {/* 보조 정보 */}
  <div className="flex gap-2 text-xs">
    <InfoBox label="유효기간" value={data.expiry} />
    <InfoBox label="제조번호" value={data.lot} />
    <InfoBox label="비고" value={data.note} variant="muted" />
  </div>
</div>
```

### 6.5 편집 카드 (Edit Mode)

```jsx
<div className="p-4 bg-blue-50/50 border-l-4 border-blue-600 animate-fade-in">
  {/* Sticky 헤더: 제목 + 액션 버튼 */}
  <div className="flex justify-between items-center mb-3 sticky top-0 z-10 bg-blue-50/95 py-2">
    <h3 className="text-sm font-bold text-gray-800 truncate pr-2">{data.name}</h3>
    <div className="flex gap-2 shrink-0">
      <button className="px-3 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm">
        <X className="w-3 h-3 inline-block -mt-0.5 mr-1" />취소
      </button>
      <button className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-sm">
        <Save className="w-3 h-3 inline-block -mt-0.5 mr-1" />저장
      </button>
    </div>
  </div>

  {/* 입력 필드 그리드 */}
  <div className="grid grid-cols-3 gap-2 mb-3">
    <InputField label="규격" type="text" value={data.standard} />
    <InputField label="수량" type="number" value={data.qty} />
    <InputField label="단가" type="number" value={data.price} />
  </div>
</div>
```

### 6.6 모달/오버레이 패턴

```jsx
{/* 배경 딤 */}
<div 
  className="fixed inset-0 z-[55] bg-black/30"
  onClick={onClose}
>
  {/* 컨텐츠 컨테이너 */}
  <div className="mx-auto flex h-full max-w-md items-start px-4 pt-16">
    <div 
      className="w-full rounded-2xl border border-gray-200 bg-white shadow-xl animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 모달 헤더 */}
      <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-gray-900">제목</p>
          <p className="text-[10px] text-gray-400">서브 타이틀</p>
        </div>
        <button className="rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50">
          닫기
        </button>
      </div>
      
      {/* 모달 컨텐츠 */}
      <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
        {/* 컨텐츠 */}
      </div>
    </div>
  </div>
</div>
```

### 6.7 버튼 스타일

#### Primary 버튼 (주요 액션)
```jsx
<button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-sm hover:bg-blue-700 transition-colors">
  액션
</button>
```

#### Secondary 버튼 (보조 액션)
```jsx
<button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
  취소
</button>
```

#### Toggle 버튼 (On/Off 상태)
```jsx
<button className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
  isActive 
    ? 'bg-blue-50 border-blue-200 text-blue-600' 
    : 'bg-gray-50 border-gray-200 text-gray-400'
}`}>
  {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
  {isActive ? 'ON' : 'OFF'}
</button>
```

#### Pill 버튼 (필터 선택)
```jsx
<button className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
  isSelected
    ? 'border-blue-200 bg-blue-50 text-blue-600'
    : 'border-gray-200 bg-white text-gray-500'
}`}>
  라벨
</button>
```

### 6.8 입력 필드

#### 기본 텍스트 입력
```jsx
<input 
  type="text"
  placeholder="입력하세요"
  className="w-full text-sm p-2 rounded border border-gray-300 bg-white 
    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
    placeholder-gray-400"
/>
```

#### 밑줄 스타일 입력
```jsx
<input 
  type="number"
  className="w-full text-right font-bold text-gray-900 text-sm 
    border-b-2 border-blue-500 bg-white p-1 focus:outline-none"
/>
```

#### 검색 입력 (아이콘 포함)
```jsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="키워드를 입력하세요"
    className="w-full rounded-full border border-gray-200 bg-gray-50 
      py-2 pl-9 pr-10 text-sm text-gray-700 
      placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
  />
</div>
```

---

## 7. 아이콘 사용

### 7.1 아이콘 라이브러리

**Lucide React** 사용 (`lucide-react`)

```jsx
import { 
  Search, Bell, Menu, Camera, Calendar, ChevronDown,
  Edit3, Save, X, Eye, EyeOff, Minimize2,
  CheckCircle2, AlertCircle, Loader2, FileText
} from 'lucide-react';
```

### 7.2 아이콘 크기 기준

| 용도 | 크기 | 클래스 |
|------|------|--------|
| 헤더 액션 | 20px | `w-5 h-5` |
| 버튼 내 아이콘 | 14-16px | `w-3.5 h-3.5` ~ `w-4 h-4` |
| 인라인 아이콘 | 12px | `w-3 h-3` |
| 배지/상태 | 12-16px | `w-3 h-3` ~ `w-4 h-4` |
| 알림 아이콘 | 16px | `w-4 h-4` |

### 7.3 주요 아이콘 사용처

| 아이콘 | 용도 |
|--------|------|
| `Search` | 검색 |
| `Bell` | 알림 |
| `Menu` | 메뉴 열기 |
| `Camera` | 촬영/스캔 |
| `Calendar` | 날짜 선택 |
| `ChevronDown` | 드롭다운 |
| `Edit3` | 편집 |
| `Save` | 저장 |
| `X` | 닫기/취소 |
| `Eye` / `EyeOff` | 표시/숨김 토글 |
| `CheckCircle2` | 완료 상태 |
| `AlertCircle` | 경고/주의 |
| `Loader2` | 로딩 (회전 애니메이션) |

---

## 8. 상태 표시

### 8.1 상태 배지 (Status Badge)

```jsx
const getStatusBadge = (status) => {
  switch(status) {
    case 'completed': 
      return (
        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">
          처리 완료
        </span>
      );
    case 'analyzing':
      return (
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin"/>AI 분석중
        </span>
      );
    case 'failed':
      return (
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">
          처리 실패
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
          대기
        </span>
      );
  }
};
```

### 8.2 알림 배지

```jsx
{/* 미확인 알림 표시 */}
<button className="relative">
  <Bell className="w-5 h-5" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
  )}
</button>
```

### 8.3 빈 값 처리

```jsx
const getValueStyle = (value) => value ? 'text-gray-900' : 'text-gray-300 font-normal';
const getDisplayValue = (value) => value || '-';

<span className={getValueStyle(data.lot)}>
  {getDisplayValue(data.lot)}
</span>
```

### 8.4 오류 메시지

```jsx
{status === 'failed' && failureReason && (
  <div className="mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-600">
    실패 사유: {failureReason}
  </div>
)}
```

---

## 9. 인터랙션 패턴

### 9.1 스크롤 스파이 (Scroll Spy)

스크롤 위치에 따라 상단 이미지 영역의 컨텐츠를 자동 전환:

```jsx
const handleScroll = () => {
  if (listContainerRef.current && sectionBRef.current) {
    const containerTop = listContainerRef.current.getBoundingClientRect().top;
    const sectionBTop = sectionBRef.current.getBoundingClientRect().top;
    
    if (sectionBTop - containerTop < 200) {
      setActiveId(SECTION_B_ID);
    } else {
      setActiveId(SECTION_A_ID);
    }
  }
};
```

### 9.2 핀치 줌 (Pinch Zoom)

이미지 확대/축소를 위한 터치 인터랙션:

```jsx
const usePinchZoom = ({ maxScale = 4 }) => {
  // 멀티터치 포인터 추적
  // 핀치 거리 계산 → 스케일 변환
  // 더블탭 → 리셋
  return {
    containerRef,
    transform: { scale, translateX, translateY },
    onPointerDown,
    onPointerMove,
    onPointerUp,
    reset,
    isZoomed
  };
};
```

### 9.3 오버레이 닫기 패턴

배경 클릭 시 닫기, 컨텐츠 클릭 시 이벤트 전파 차단:

```jsx
<div 
  className="fixed inset-0 bg-black/30"
  onClick={onClose}
>
  <div 
    className="..."
    onClick={(e) => e.stopPropagation()}
  >
    {/* 모달 컨텐츠 */}
  </div>
</div>
```

### 9.4 편집 모드 전환

```jsx
const startEditing = (item) => {
  setEditingId(item.id);
  setEditForm({ ...item });
};

const cancelEditing = () => {
  setEditingId(null);
  setEditForm({});
};

const saveEditing = () => {
  setItems(prev => prev.map(item => 
    item.id === editingId ? editForm : item
  ));
  setEditingId(null);
  setEditForm({});
};
```

### 9.5 키보드 대응 (모바일)

모바일 키보드가 올라올 때 입력 필드가 보이도록 스크롤:

```jsx
const handleFocus = (e) => {
  setTimeout(() => {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 400);
};
```

---

## 10. 애니메이션

### 10.1 Tailwind 설정

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-in',
      },
    },
  },
}
```

### 10.2 애니메이션 사용

```jsx
{/* 페이드 인 */}
<div className="animate-fade-in">...</div>

{/* 슬라이드 업 (하단 액션바) */}
<div className="animate-slide-up">...</div>

{/* 로딩 스피너 */}
<Loader2 className="w-4 h-4 animate-spin" />

{/* 레이아웃 전환 */}
<div className="transition-all duration-500 ease-in-out">...</div>

{/* 호버 전환 */}
<button className="transition-colors hover:bg-gray-50">...</button>

{/* 회전 (드롭다운 화살표) */}
<ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
```

### 10.3 트랜지션 타이밍

| 용도 | Duration | Easing |
|------|----------|--------|
| 호버 효과 | 기본값 (150ms) | ease |
| 레이아웃 변경 | 300-500ms | ease-in-out |
| 모달 등장 | 200ms | ease-in |
| 스프링 효과 | 300ms | ease-out |

---

## 11. 모바일 최적화

### 11.1 터치 영역

최소 터치 영역 44x44px 확보:

```jsx
<button className="p-2 -mr-2">
  <Edit3 className="w-4 h-4" />
</button>
```

### 11.2 Safe Area

스크롤 영역 하단에 충분한 여백 확보:

```jsx
{/* 일반 모드 */}
<div className="h-24"></div>

{/* 편집 모드 (하단 액션바 공간) */}
<div className={`transition-all duration-300 ${isEditing ? 'h-[350px]' : 'h-24'}`}></div>
```

### 11.3 터치 액션 제어

핀치 줌 영역에서 브라우저 기본 제스처 비활성화:

```jsx
<div style={{ touchAction: 'none' }}>
  {/* 커스텀 제스처 처리 영역 */}
</div>
```

### 11.4 네이티브 컨트롤 스타일링

```jsx
{/* 날짜 입력 */}
<input 
  type="date" 
  className="text-gray-900" 
/>

{/* 숫자 입력 */}
<input 
  type="number"
  inputMode="numeric"
  pattern="[0-9]*"
/>
```

---

## 12. 접근성

### 12.1 ARIA 레이블

```jsx
<button
  type="button"
  aria-label="알림"
  className="..."
>
  <Bell className="w-5 h-5" />
</button>
```

### 12.2 포커스 관리

```jsx
{/* 모달 오픈 시 첫 입력에 자동 포커스 */}
<input
  autoFocus
  className="..."
/>
```

### 12.3 색상 대비

- 텍스트는 최소 4.5:1 대비율 유지
- 중요 상태는 색상 외에 아이콘/텍스트로도 표시

### 12.4 키보드 네비게이션

드롭다운 blur 이벤트 처리:

```jsx
<div
  tabIndex={0}
  onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }}
>
  {/* 드롭다운 컨텐츠 */}
</div>
```

---

## 13. 코드 컨벤션

### 13.1 컴포넌트 구조

```jsx
// 1. Import 문
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { IconName } from 'lucide-react';

// 2. 상수 정의
const INITIAL_DATA = [...];
const STATUS_OPTIONS = [...];

// 3. 헬퍼 함수
const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val);

// 4. 커스텀 훅
function usePinchZoom({ maxScale }) {
  // ...
}

// 5. 메인 컴포넌트
export default function MainComponent() {
  // State 선언
  const [items, setItems] = useState(INITIAL_DATA);
  
  // Refs
  const containerRef = useRef(null);
  
  // Computed Values
  const isEditing = editingId !== null;
  
  // Handlers
  const handleClick = () => {...};
  
  // Effects
  useEffect(() => {...}, []);
  
  // Render
  return (...);
}

// 6. 서브 컴포넌트
function SubComponent({ props }) {
  return (...);
}
```

### 13.2 네이밍 컨벤션

| 타입 | 컨벤션 | 예시 |
|------|--------|------|
| 컴포넌트 | PascalCase | `InvoiceSection` |
| 상수 | SCREAMING_SNAKE_CASE | `INITIAL_DATA` |
| 함수 | camelCase | `handleClick` |
| Boolean 변수 | is/has/can 접두사 | `isEditing`, `hasError` |
| 핸들러 함수 | handle/on 접두사 | `handleClick`, `onSave` |
| 상태 설정 | set 접두사 | `setItems` |

### 13.3 Props 패턴

```jsx
function Component({ 
  // 필수 props
  data,
  // 선택적 props with defaults
  variant = 'default',
  isDisabled = false,
  // 콜백 props
  onChange,
  onSave,
  onCancel,
}) {
  // ...
}
```

### 13.4 조건부 클래스

```jsx
// 삼항 연산자
className={`base-class ${condition ? 'active-class' : 'inactive-class'}`}

// 복잡한 조건
className={[
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class',
  variant === 'primary' && 'primary-class',
].filter(Boolean).join(' ')}
```

### 13.5 숫자 포맷팅

```jsx
const formatCurrency = (val) => 
  new Intl.NumberFormat('ko-KR').format(Math.round(val));

// 사용
<span>₩{formatCurrency(amount)}</span>
```

---

## 부록: Z-Index 계층 구조

| 레벨 | Z-Index | 용도 |
|------|---------|------|
| 기본 | 0 | 일반 컨텐츠 |
| 섹션 헤더 | 30 | Sticky 섹션 헤더 |
| 필터 바 | 40 | 상단 필터 영역 |
| 글로벌 헤더 | 50 | 앱 헤더 |
| 편집 오버레이 | 50 | 전체 화면 편집 모드 |
| 메뉴 패널 | 55 | 슬라이드 메뉴 |
| 검색 패널 | 56 | 검색 오버레이 |
| 카메라/모달 | 60 | 최상위 모달 |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-01-13 | 초안 작성 - 거래명세서 메뉴 기준 |

---

*본 가이드는 프로젝트 발전에 따라 지속적으로 업데이트됩니다.*
