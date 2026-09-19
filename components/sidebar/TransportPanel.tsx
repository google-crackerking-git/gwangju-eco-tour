'use client';

import { useState } from 'react';
import { useEcoTourStore } from '@/store/ecoTourStore';
import RouteList from './RouteList';
import SubwayStationList from './SubwayStationList';
import type { TourismContentType, SelectedStop } from '@/types';
import { CONTENT_TYPE_ICONS, CONTENT_TYPE_LABELS } from '@/types';

type TabType = 'bus' | 'subway';

// Category filter config — order mirrors the store DEFAULT_CATEGORIES
const CATEGORY_IDS: TourismContentType[] = [12, 14, 39, 32];

interface TransportPanelProps {
  onStopSelect: (stop: SelectedStop) => void;
  mobileCompact?: boolean;
}

export default function TransportPanel({ onStopSelect, mobileCompact }: TransportPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('bus');
  const { activeCategories, toggleCategory, setTransportMode } = useEcoTourStore();

  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    setTransportMode(tab);
  }

  return (
    <div className="flex h-full flex-col">
      {/* ── Tab switcher ── */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => handleTabChange('bus')}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors"
          style={
            activeTab === 'bus'
              ? {
                  color: '#1E3A8A',
                  borderBottom: '2px solid #1E3A8A',
                }
              : { color: '#6B7280' }
          }
        >
          <span>🚌</span>
          버스
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('subway')}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors"
          style={
            activeTab === 'subway'
              ? {
                  color: '#7C3AED',
                  borderBottom: '2px solid #7C3AED',
                }
              : { color: '#6B7280' }
          }
        >
          <span>🚇</span>
          지하철
        </button>
      </div>

      {/* ── Category filter ── */}
      <div className="flex gap-1.5 border-b border-gray-100 bg-white px-3 py-2">
        {CATEGORY_IDS.map((id) => {
          const isActive = activeCategories.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleCategory(id)}
              className="flex flex-1 items-center justify-center gap-0.5 rounded-lg py-1.5 text-xs font-medium transition-all"
              style={
                isActive
                  ? {
                      backgroundColor:
                        id === 12
                          ? '#DBEAFE'
                          : id === 14
                          ? '#EDE9FE'
                          : id === 39
                          ? '#FFEDD5'
                          : '#D1FAE5',
                      color:
                        id === 12
                          ? '#1E3A8A'
                          : id === 14
                          ? '#7C3AED'
                          : id === 39
                          ? '#EA580C'
                          : '#2D7A3A',
                    }
                  : {
                      backgroundColor: '#F3F4F6',
                      color: '#9CA3AF',
                    }
              }
            >
              <span>{CONTENT_TYPE_ICONS[id]}</span>
              {CONTENT_TYPE_LABELS[id]}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === 'bus'
          ? <RouteList onStopSelect={onStopSelect} />
          : <SubwayStationList />}
      </div>
    </div>
  );
}
