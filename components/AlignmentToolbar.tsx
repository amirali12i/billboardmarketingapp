import React from 'react';
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignTopIcon, AlignMiddleIcon, AlignBottomIcon, DistributeHorizontalIcon, DistributeVerticalIcon } from './icons';

type AlignType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'distribute-horizontal' | 'distribute-vertical';

interface AlignmentToolbarProps {
  onAlign: (type: AlignType) => void;
}

const AlignmentToolbar: React.FC<AlignmentToolbarProps> = ({ onAlign }) => {

  const alignmentButtons = [
    { type: 'left', icon: AlignLeftIcon, title: 'چپ چین' },
    { type: 'center', icon: AlignCenterIcon, title: 'وسط چین افقی' },
    { type: 'right', icon: AlignRightIcon, title: 'راست چین' },
    { type: 'top', icon: AlignTopIcon, title: 'تراز از بالا' },
    { type: 'middle', icon: AlignMiddleIcon, title: 'وسط چین عمودی' },
    { type: 'bottom', icon: AlignBottomIcon, title: 'تراز از پایین' },
  ] as const;
  
  const distributionButtons = [
      { type: 'distribute-horizontal', icon: DistributeHorizontalIcon, title: 'توزیع افقی' },
      { type: 'distribute-vertical', icon: DistributeVerticalIcon, title: 'توزیع عمودی' },
  ] as const;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-black/50 flex items-center gap-1 p-1.5 z-10">
      {alignmentButtons.map(({ type, icon: Icon, title }) => (
        <button
          key={type}
          onClick={() => onAlign(type)}
          title={title}
          className="p-2 rounded bg-gray-100/50 dark:bg-gray-700/50 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 transition-colors"
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      {distributionButtons.map(({ type, icon: Icon, title }) => (
        <button
          key={type}
          onClick={() => onAlign(type)}
          title={title}
          className="p-2 rounded bg-gray-100/50 dark:bg-gray-700/50 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 transition-colors"
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default AlignmentToolbar;