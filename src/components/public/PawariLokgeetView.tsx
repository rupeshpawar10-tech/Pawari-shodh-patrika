import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { LokgeetView } from '../sahitya/LokgeetView';

export const PawariLokgeetView: React.FC = () => {
  const { setActiveView } = useCms();

  const handleNavigateSection = (sec: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => {
    if (sec === 'hub') {
      setActiveView('books_blogs');
    } else if (sec === 'shabdkosh') {
      setActiveView('pawari_shabdkosh');
    } else if (sec === 'paheli') {
      setActiveView('pawari_paheli');
    } else if (sec === 'quiz') {
      setActiveView('pawari_quiz');
    } else if (sec === 'books' || sec === 'reviews') {
      setActiveView('books_blogs');
    }
  };

  return (
    <LokgeetView
      onNavigateSection={handleNavigateSection}
      onOpenContributeModal={() => {
        setActiveView('books_blogs');
      }}
    />
  );
};
