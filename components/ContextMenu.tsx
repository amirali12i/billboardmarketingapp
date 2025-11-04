import React, { useEffect, useRef } from 'react';
import { 
    ClipboardDocumentIcon, ClipboardIcon, DuplicateIcon, TrashIcon, GroupIcon, UngroupIcon, 
    ArrowUpOnSquareIcon, ArrowDownOnSquareIcon, LockClosedIcon, LockOpenIcon, EyeIcon, EyeSlashIcon 
} from './icons';

interface SelectionInfo {
    count: number;
    canGroup: boolean;
    canUngroup: boolean;
    canCopy: boolean;
    canPaste: boolean;
    isLocked: boolean;
    isVisible: boolean;
}

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  selectionInfo: SelectionInfo;
  actions: {
    onCopy: () => void;
    onPaste: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onGroup: () => void;
    onUngroup: () => void;
    onBringToFront: () => void;
    onSendToBack: () => void;
    onToggleLock: () => void;
    onToggleVisibility: () => void;
  };
}

const MenuItem: React.FC<{
    label: string;
    shortcut?: string;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}> = ({ label, shortcut, icon, onClick, disabled }) => {
    const handleClick = () => {
        if (!disabled) onClick();
    };
    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-right text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-cyan-500 hover:not-disabled:text-white dark:hover:not-disabled:bg-cyan-600"
        >
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            {shortcut && <span className="text-xs text-gray-400 dark:text-gray-500">{shortcut}</span>}
        </button>
    );
};

const Divider = () => <hr className="border-gray-200 dark:border-gray-600 my-1" />;

const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, selectionInfo, actions }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const runAction = (action: () => void) => {
        action();
        onClose();
    };

    const style: React.CSSProperties = {
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 1000,
    };

    return (
        <div ref={menuRef} style={style} className="w-60 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-1.5">
            <MenuItem label="کپی" shortcut="Ctrl+C" icon={<ClipboardDocumentIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onCopy)} disabled={!selectionInfo.canCopy} />
            <MenuItem label="چسباندن" shortcut="Ctrl+V" icon={<ClipboardIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onPaste)} disabled={!selectionInfo.canPaste} />
            <MenuItem label="تکثیر" shortcut="" icon={<DuplicateIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onDuplicate)} disabled={!selectionInfo.canCopy} />
            <MenuItem label="حذف" shortcut="Del" icon={<TrashIcon className="w-5 h-5 text-red-500"/>} onClick={() => runAction(actions.onDelete)} disabled={selectionInfo.count === 0} />
            <Divider />
            <MenuItem label="گروه" shortcut="Ctrl+G" icon={<GroupIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onGroup)} disabled={!selectionInfo.canGroup} />
            <MenuItem label="بازکردن گروه" shortcut="Ctrl+Shift+G" icon={<UngroupIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onUngroup)} disabled={!selectionInfo.canUngroup} />
            <Divider />
            <MenuItem label="آوردن به رو" icon={<ArrowUpOnSquareIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onBringToFront)} disabled={selectionInfo.count === 0} />
            <MenuItem label="بردن به زیر" icon={<ArrowDownOnSquareIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onSendToBack)} disabled={selectionInfo.count === 0} />
            <Divider />
            <MenuItem label={selectionInfo.isLocked ? "باز کردن قفل" : "قفل کردن"} icon={selectionInfo.isLocked ? <LockOpenIcon className="w-5 h-5"/> : <LockClosedIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onToggleLock)} disabled={selectionInfo.count === 0} />
            <MenuItem label={selectionInfo.isVisible ? "مخفی کردن" : "نمایش دادن"} icon={selectionInfo.isVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>} onClick={() => runAction(actions.onToggleVisibility)} disabled={selectionInfo.count === 0} />
        </div>
    );
};

export default ContextMenu;
