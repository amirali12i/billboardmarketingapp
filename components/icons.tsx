
import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement> & { path: string | string[] }> = ({ path, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {Array.isArray(path) 
        ? path.map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)
        : <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    }
  </svg>
);

export const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" {...props} />;
export const LoaderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon className="animate-spin" path="M12 6v6m0 0v6m0-6h6m-6 0H6" {...props} />;
export const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9.53 16.122a3 3 0 00-3.182 3.182l.06.06a1.5 1.5 0 002.227 2.227l.06-.06a3 3 0 003.182-3.182m0-13.5a3 3 0 00-3.182-3.182l-.06-.06a1.5 1.5 0 00-2.227 2.227l.06.06a3 3 0 003.182 3.182m0 0l.07.07a1.5 1.5 0 002.121 0l.07-.07a1.5 1.5 0 000-2.121l-.07-.07a1.5 1.5 0 00-2.121 0z" {...props} />;
export const TextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M12 12.75h.008v.008H12v-.008z" {...props} />;
export const ShapesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" {...props} />;
export const LayersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6.375 16.5c-1.232 0-2.25-1.018-2.25-2.25v-7.5c0-1.232 1.018-2.25 2.25-2.25h9.25a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-9.25zM12 4.5v1.5" {...props} />;
export const BrandKitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9.53 16.122a3 3 0 00-3.182 3.182l.06.06a1.5 1.5 0 002.227 2.227l.06-.06a3 3 0 003.182-3.182M12 12a3 3 0 11-6 0 3 3 0 016 0z" {...props} />;
export const TriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 2.25L3.75 18h16.5L12 2.25z" {...props} />;
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.027a.563.563 0 00-.182.557l1.528 4.971a.562.562 0 01-.828.61l-4.203-3.027a.563.563 0 00-.58 0l-4.203 3.027a.562.562 0 01-.828-.61l1.528-4.971a.563.563 0 00-.182-.557l-4.204-3.027a.562.562 0 01.321-.988h5.418a.563.563 0 00.475-.31l2.125-5.111z" {...props} />;
export const VectorShapeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" {...props} />;
export const PentagonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 2.25l8.25 6-3.125 10.5H6.875L3.75 8.25 12 2.25z" {...props} />;
export const HexagonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M21 12l-9-7.794L3 12l9 7.794L21 12z" {...props} />;
export const OctagonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 2.25l6.364 6.364L21 12l-2.636 6.364L12 21.75l-6.364-2.636L3 12l2.636-6.364L12 2.25z" {...props} />;
export const RhombusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 2.25L21.75 12 12 21.75 2.25 12 12 2.25z" {...props} />;
export const CrossIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 4.5v15m7.5-7.5h-15" {...props} />;
export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" {...props} />;
export const TemplatesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" {...props} />;
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 18.75a6 6 0 006-6H6a6 6 0 006 6z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" {...props} />;
export const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 002.15 2.923h12.996a2.25 2.25 0 002.15-2.923l-2.412-7.889A2.25 2.25 0 0017.088 3.75H15M12 12.75v-7.5" {...props} />;
export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" {...props} />;
export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" {...props} />;
export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 19.5L8.25 12l7.5-7.5" {...props} />;
export const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" {...props} />;
export const RedoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" {...props} />;
export const GroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6 6h6v6H6zM12 12h6v6h-6z" {...props} />;
export const UngroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6 6h1v1H6z M9 6h1v1H9z M6 9h1v1H6z M15 15h1v1h-1z M18 15h1v1h-1z M15 18h1v1h-1z" {...props} />;
export const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.678-8.121a3 3 0 00-4.136 0l-1.177 1.177a3 3 0 000 4.136l1.177 1.177a3 3 0 004.136 0l1.177-1.177a3 3 0 000-4.136l-1.177-1.177z" {...props} />;
export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" {...props} />;
export const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L6.228 6.228" {...props} />;
export const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" {...props} />;
export const LockOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m.75-3.75a3.75 3.75 0 017.5 0V10.5" {...props} />;
export const ZoomInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" {...props} />;
export const ZoomOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" {...props} />;
export const ExpandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" {...props} />;
export const AlignLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" {...props} />;
export const AlignCenterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 6.75h16.5M3.75 12h16.5M6.75 17.25h10.5" {...props} />;
export const AlignRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h12" {...props} />;
export const AlignTopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 3.75h16.5M3.75 8.25h16.5M12 12.75h-1.5m1.5 0h1.5m-1.5 0V20.25" {...props} />;
export const AlignMiddleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 6.75h16.5M3.75 12h16.5M6.75 17.25h10.5" {...props} stroke="none" fill="currentColor" />;
export const AlignBottomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M20.25 20.25H3.75m16.5-4.5H3.75m12-4.5h-1.5m1.5 0h1.5m-1.5 0V3.75" {...props} />;
export const DistributeHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M4.5 12h15M4.5 12a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 014.5 6v6zM19.5 12a1.5 1.5 0 001.5-1.5v-3A1.5 1.5 0 0019.5 6v6z" {...props} />;
export const DistributeVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 4.5v15M12 4.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0118 4.5h-6zM12 19.5a1.5 1.5 0 00-1.5 1.5h3a1.5 1.5 0 00-1.5-1.5z" {...props} />;
export const QuillIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9.53 16.122a3 3 0 00-3.182 3.182l.06.06a1.5 1.5 0 002.227 2.227l.06-.06a3 3 0 003.182-3.182M12 12a3 3 0 11-6 0 3 3 0 016 0z" {...props} />;
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 4.5v15m7.5-7.5h-15" {...props} />;
export const PagePlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" {...props} />;
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.144-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.057-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" {...props} />;
export const DuplicateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" {...props} />;
export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" {...props} />;
export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 3a9 9 0 00-9 9c0 4.968 4.032 9 9 9s9-4.032 9-9c0-4.968-4.032-9-9-9z" {...props} />;
export const BoldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6.25 3.75h4.5a3.75 3.75 0 010 7.5h-4.5v-7.5zm0 2.25v3h4.5a1.5 1.5 0 000-3h-4.5zm-1.5 7.5h5.25a3.75 3.75 0 010 7.5H4.75v-7.5zm0 2.25v3h5.25a1.5 1.5 0 000-3H4.75z" stroke="none" fill="currentColor" {...props} />;
export const ItalicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M10.5 3.75h6m-6 16.5h6M13.5 3.75L10.5 20.25" {...props} />;
export const UnderlineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6 3.75v6a3.75 3.75 0 003.75 3.75h1.5A3.75 3.75 0 0015 9.75v-6M4.5 20.25h15" {...props} />;
export const LetterCaseCapitalizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12.75 14.25V4.5m0 0h-2.25m2.25 0h2.25M6 18.75h2.25a.75.75 0 000-1.5H6a.75.75 0 000 1.5zM17.25 15v3.75" {...props} />;
export const LetterCaseResetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3 3l18 18M12 12.75h.008v.008H12v-.008zM7.5 3.75H6A2.25 2.25 0 003.75 6v1.5m13.5-3.75H18A2.25 2.25 0 0120.25 6v1.5m-3.75 12.75V18A2.25 2.25 0 0118 20.25h-1.5" {...props} />;
export const LetterCaseUppercaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3.75 3.75h16.5M6.75 3.75v16.5M10.5 3.75v16.5M17.25 3.75v16.5" {...props} />;
export const LetterCaseLowercaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M7.5 12.75h9m-9 0a3.75 3.75 0 00-3.75 3.75v3" {...props} />;
export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9.53 16.122a3 3 0 00-3.182 3.182l.06.06a1.5 1.5 0 002.227 2.227l.06-.06a3 3 0 003.182-3.182m0-13.5a3 3 0 00-3.182-3.182l-.06-.06a1.5 1.5 0 00-2.227 2.227l.06.06a3 3 0 003.182 3.182m0 0l.07.07a1.5 1.5 0 002.121 0l.07-.07a1.5 1.5 0 000-2.121l-.07-.07a1.5 1.5 0 00-2.121 0z" {...props} />;
export const AdjustmentsVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M10.5 6h3m-3 6h3m-3 6h3m-6-12h.01M6 12h.01M6 18h.01M18 6h-3.39a2.25 2.25 0 01-2.12 0H3.75M18 12h-3.39a2.25 2.25 0 01-2.12 0H3.75m12.39 6h-3.39a2.25 2.25 0 01-2.12 0H3.75" {...props} />;
export const ClipboardDocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376V11.25a2.25 2.25 0 00-2.25-2.25h-2.25a2.25 2.25 0 00-2.25 2.25v8.25" {...props} />;
export const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9 1.5H6.375a2.25 2.25 0 00-2.25 2.25v16.5a2.25 2.25 0 002.25 2.25h11.25a2.25 2.25 0 002.25-2.25V3.75a2.25 2.25 0 00-2.25-2.25H15M9 1.5v3h6v-3m-6 0v3h6m0 0H9" {...props} />;
export const ArrowUpOnSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M21 12.75v6A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75v-6M12 3v12.75m0-12.75L9 5.25M12 3l3 2.25" {...props} />;
export const ArrowDownOnSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M21 12.75v6A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75v-6M12 18.75V6m0 12.75L9 16.5m3 2.25l3-2.25" {...props} />;
export const FlipHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 15.75l-4.5-4.5 4.5-4.5M12 11.25h8.25M12 3v18" {...props} />;
export const FlipVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 12l-4.5-4.5-4.5 4.5M11.25 12v8.25M3 12h18" {...props} />;
export const PathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M19.5 12c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5c0-4.142 3.358-7.5 7.5-7.5" {...props} />;
export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" {...props} />;

const AspectRatioIcon: React.FC<React.SVGProps<SVGSVGElement> & { w: number, h: number }> = ({ w, h, ...props }) => {
  const total = w + h;
  const width = (w / total) * 18 + 3; // Scale to fit within 24x24 box
  const height = (h / total) * 18 + 3;
  const x = (24 - width) / 2;
  const y = (24 - height) / 2;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <rect x={x} y={y} width={width} height={height} rx="2" />
    </svg>
  );
};
export const AspectRatio16x9Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <AspectRatioIcon w={16} h={9} {...props} />;
export const AspectRatio1x1Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <AspectRatioIcon w={1} h={1} {...props} />;
export const AspectRatio9x16Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <AspectRatioIcon w={9} h={16} {...props} />;
export const AspectRatio4x3Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <AspectRatioIcon w={4} h={3} {...props} />;
export const AspectRatio3x4Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <AspectRatioIcon w={3} h={4} {...props} />;
