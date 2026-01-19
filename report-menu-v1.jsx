import React, { useState } from 'react';
import { FileText, Menu } from 'lucide-react';

const PUBLISHED_REPORTS = [
  {
    id: '2026-01',
    monthLabel: '2026년 1월',
    title: '월간 매입 분석 보고서',
    period: '2026.01.01 ~ 2026.01.31',
    publishedAt: '2026.02.02',
    file: '/reports/sample-report.html',
  },
  {
    id: '2025-12',
    monthLabel: '2025년 12월',
    title: '월간 매입 분석 보고서',
    period: '2025.12.01 ~ 2025.12.31',
    publishedAt: '2026.01.03',
    file: '/reports/sample-report.html',
  },
  {
    id: '2025-11',
    monthLabel: '2025년 11월',
    title: '월간 매입 분석 보고서',
    period: '2025.11.01 ~ 2025.11.30',
    publishedAt: '2025.12.02',
    file: '/reports/sample-report.html',
  },
  {
    id: '2025-10',
    monthLabel: '2025년 10월',
    title: '월간 매입 분석 보고서',
    period: '2025.10.01 ~ 2025.10.31',
    publishedAt: '2025.11.02',
    file: '/reports/sample-report.html',
  },
  {
    id: '2025-09',
    monthLabel: '2025년 9월',
    title: '월간 매입 분석 보고서',
    period: '2025.09.01 ~ 2025.09.30',
    publishedAt: '2025.10.02',
    file: '/reports/sample-report.html',
  },
  {
    id: '2025-08',
    monthLabel: '2025년 8월',
    title: '월간 매입 분석 보고서',
    period: '2025.08.01 ~ 2025.08.31',
    publishedAt: '2025.09.02',
    file: '/reports/sample-report.html',
  },
];

export default function ReportMenuApp({ onMenuChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenuPanel = () => setIsMenuOpen((prev) => !prev);
  const closeMenuPanel = () => setIsMenuOpen(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMenuChange?.('dashboard')}
            aria-label="대시보드로 이동"
            className="rounded-lg p-1 -ml-1 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <span className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</span>
          </button>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            AI분석 보고서
          </span>
        </div>
        <button
          type="button"
          onClick={toggleMenuPanel}
          aria-label="메뉴"
          className="text-gray-500 hover:text-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
        <p className="text-[11px] text-blue-800">
          발간된 월간 분석 보고서를 리스트로 확인하고 열람할 수 있습니다.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">보고서 목록</p>
            <p className="text-[10px] text-gray-400">총 {PUBLISHED_REPORTS.length}건</p>
          </div>
        </div>

        {PUBLISHED_REPORTS.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">{report.monthLabel}</p>
                <p className="text-[11px] text-gray-500">{report.title}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-[11px] text-gray-400">분석기간: {report.period}</p>
                  <p className="text-[11px] text-gray-400">발간일: {report.publishedAt}</p>
                </div>
              </div>
              <a
                href={report.file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
              >
                <FileText className="h-4 w-4" />
                열람
              </a>
            </div>
          </div>
        ))}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/20" onClick={closeMenuPanel}>
          <div className="mx-auto flex h-full max-w-md items-start justify-end px-4 pt-16">
            <div
              className="w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              {[
                '대시보드',
                '거래명세서 관리',
                '공급사 관리',
                '유효기간 점검',
                'AI분석 보고서',
                '설정',
                '로그아웃',
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === '대시보드' && onMenuChange) {
                      onMenuChange('dashboard');
                    } else if (label === '거래명세서 관리' && onMenuChange) {
                      onMenuChange('invoice');
                    } else if (label === '공급사 관리' && onMenuChange) {
                      onMenuChange('supplier');
                    } else if (label === '유효기간 점검' && onMenuChange) {
                      onMenuChange('expiry');
                    } else if (label === 'AI분석 보고서') {
                      closeMenuPanel();
                    } else {
                      closeMenuPanel();
                    }
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    label === 'AI분석 보고서'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
