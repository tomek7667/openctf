/**
 * Professional Icon Components
 *
 * A comprehensive set of SVG icons optimized for the OpenCTF platform.
 * All icons are properly typed, accessible, and optimized for performance.
 */

import React from "react";
import { clsx } from "clsx";

export interface IconProps {
	className?: undefined | string;
	size?: undefined | number | string;
	"aria-label"?: undefined | string;
	"aria-hidden"?: undefined | boolean;
}

const createIcon = (
	displayName: string,
	path: React.ReactElement | React.ReactElement[]
) => {
	const Icon = React.forwardRef<SVGSVGElement, IconProps>(
		(
			{
				className,
				size = 20,
				"aria-label": ariaLabel,
				"aria-hidden": ariaHidden,
				...props
			},
			ref
		) => (
			<svg
				ref={ref}
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={clsx("inline-block", className)}
				aria-label={ariaLabel}
				aria-hidden={ariaHidden ?? !ariaLabel}
				{...props}
			>
				{path}
			</svg>
		)
	);

	Icon.displayName = displayName;
	return Icon;
};

// Navigation & UI Icons
export const Menu = createIcon(
	"Menu",
	<>
		<line x1="4" x2="20" y1="12" y2="12" />
		<line x1="4" x2="20" y1="6" y2="6" />
		<line x1="4" x2="20" y1="18" y2="18" />
	</>
);

export const X = createIcon(
	"X",
	<>
		<path d="M18 6 6 18" />
		<path d="M6 6l12 12" />
	</>
);

export const ChevronDown = createIcon("ChevronDown", <path d="m6 9 6 6 6-6" />);

export const ChevronUp = createIcon("ChevronUp", <path d="m18 15-6-6-6 6" />);

export const ChevronLeft = createIcon(
	"ChevronLeft",
	<path d="m15 18-6-6 6-6" />
);

export const ChevronRight = createIcon(
	"ChevronRight",
	<path d="m9 18 6-6-6-6" />
);

export const ArrowLeft = createIcon(
	"ArrowLeft",
	<>
		<path d="M19 12H5" />
		<path d="M12 19l-7-7 7-7" />
	</>
);

export const ArrowRight = createIcon(
	"ArrowRight",
	<>
		<path d="M5 12h14" />
		<path d="M12 5l7 7-7 7" />
	</>
);

export const Search = createIcon(
	"Search",
	<>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.35-4.35" />
	</>
);

export const Filter = createIcon(
	"Filter",
	<polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
);

export const MoreHorizontal = createIcon(
	"MoreHorizontal",
	<>
		<circle cx="12" cy="12" r="1" />
		<circle cx="19" cy="12" r="1" />
		<circle cx="5" cy="12" r="1" />
	</>
);

export const Plus = createIcon(
	"Plus",
	<>
		<path d="M5 12h14" />
		<path d="M12 5v14" />
	</>
);

export const Minus = createIcon("Minus", <path d="M5 12h14" />);

// Authentication Icons
export const User = createIcon(
	"User",
	<>
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</>
);

export const Users = createIcon(
	"Users",
	<>
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" />
	</>
);

export const LogIn = createIcon(
	"LogIn",
	<>
		<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
		<polyline points="10,17 15,12 10,7" />
		<line x1="15" x2="3" y1="12" y2="12" />
	</>
);

export const LogOut = createIcon(
	"LogOut",
	<>
		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		<polyline points="16,17 21,12 16,7" />
		<line x1="21" x2="9" y1="12" y2="12" />
	</>
);

export const Lock = createIcon(
	"Lock",
	<>
		<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</>
);

export const Unlock = createIcon(
	"Unlock",
	<>
		<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 9.9-1" />
	</>
);

// CTF & Security Icons
export const Shield = createIcon(
	"Shield",
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);

export const ShieldCheck = createIcon(
	"ShieldCheck",
	<>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		<path d="m9 12 2 2 4-4" />
	</>
);

export const Trophy = createIcon(
	"Trophy",
	<>
		<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
		<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
		<path d="M4 22h16" />
		<path d="M10 14.66V17c0 .55.47.98.97 1.21C11.25 18.75 11.62 19 12 19s.75-.25 1.03-.79c.5-.23.97-.66.97-1.21v-2.34" />
		<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
	</>
);

export const Flag = createIcon(
	"Flag",
	<>
		<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
		<line x1="4" x2="4" y1="22" y2="15" />
	</>
);

export const Target = createIcon(
	"Target",
	<>
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="12" r="6" />
		<circle cx="12" cy="12" r="2" />
	</>
);

// Status & Feedback Icons
export const CheckCircle = createIcon(
	"CheckCircle",
	<>
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
		<polyline points="22,4 12,14.01 9,11.01" />
	</>
);

export const XCircle = createIcon(
	"XCircle",
	<>
		<circle cx="12" cy="12" r="10" />
		<path d="m15 9-6 6" />
		<path d="m9 9 6 6" />
	</>
);

export const AlertCircle = createIcon(
	"AlertCircle",
	<>
		<circle cx="12" cy="12" r="10" />
		<line x1="12" x2="12" y1="8" y2="12" />
		<line x1="12" x2="12.01" y1="16" y2="16" />
	</>
);

export const AlertTriangle = createIcon(
	"AlertTriangle",
	<>
		<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
		<line x1="12" x2="12" y1="9" y2="13" />
		<line x1="12" x2="12.01" y1="17" y2="17" />
	</>
);

export const Info = createIcon(
	"Info",
	<>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4" />
		<path d="M12 8h.01" />
	</>
);

// Trends & Analytics
export const TrendingUp = createIcon(
	"TrendingUp",
	<>
		<polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
		<polyline points="16,7 22,7 22,13" />
	</>
);

export const TrendingDown = createIcon(
	"TrendingDown",
	<>
		<polyline points="22,17 13.5,8.5 8.5,13.5 2,7" />
		<polyline points="16,17 22,17 22,11" />
	</>
);

export const BarChart = createIcon(
	"BarChart",
	<>
		<line x1="12" x2="12" y1="20" y2="10" />
		<line x1="18" x2="18" y1="20" y2="4" />
		<line x1="6" x2="6" y1="20" y2="16" />
	</>
);

export const PieChart = createIcon(
	"PieChart",
	<>
		<path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
		<path d="M22 12A10 10 0 0 0 12 2v10z" />
	</>
);

// Actions & States
export const Eye = createIcon(
	"Eye",
	<>
		<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
		<circle cx="12" cy="12" r="3" />
	</>
);

export const EyeOff = createIcon(
	"EyeOff",
	<>
		<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
		<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
		<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
		<line x1="2" x2="22" y1="2" y2="22" />
	</>
);

export const Star = createIcon(
	"Star",
	<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
);

export const Heart = createIcon(
	"Heart",
	<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
);

export const Bookmark = createIcon(
	"Bookmark",
	<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
);

export const Share = createIcon(
	"Share",
	<>
		<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
		<polyline points="16,6 12,2 8,6" />
		<line x1="12" x2="12" y1="2" y2="15" />
	</>
);

// Communication
export const MessageSquare = createIcon(
	"MessageSquare",
	<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
);

export const MessageCircle = createIcon(
	"MessageCircle",
	<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
);

export const Mail = createIcon(
	"Mail",
	<>
		<rect width="20" height="16" x="2" y="4" rx="2" />
		<path d="M22 6l-10 7L2 6" />
	</>
);

export const Phone = createIcon(
	"Phone",
	<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
);

// Media & Content
export const Image = createIcon(
	"Image",
	<>
		<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
		<circle cx="9" cy="9" r="2" />
		<path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
	</>
);

export const Video = createIcon(
	"Video",
	<>
		<path d="M23 7l-7 5 7 5V7z" />
		<rect width="15" height="9" x="1" y="8" rx="2" ry="2" />
	</>
);

export const File = createIcon(
	"File",
	<>
		<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
		<polyline points="14,2 14,8 20,8" />
	</>
);

export const Download = createIcon(
	"Download",
	<>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7,10 12,15 17,10" />
		<line x1="12" x2="12" y1="15" y2="3" />
	</>
);

export const Upload = createIcon(
	"Upload",
	<>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="17,8 12,3 7,8" />
		<line x1="12" x2="12" y1="3" y2="15" />
	</>
);

export const Link = createIcon(
	"Link",
	<>
		<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
		<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
	</>
);

export const ExternalLink = createIcon(
	"ExternalLink",
	<>
		<path d="M15 3h6v6" />
		<path d="M10 14 21 3" />
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
	</>
);

// Time & Calendar
export const Calendar = createIcon(
	"Calendar",
	<>
		<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
		<line x1="16" x2="16" y1="2" y2="6" />
		<line x1="8" x2="8" y1="2" y2="6" />
		<line x1="3" x2="21" y1="10" y2="10" />
	</>
);

export const Clock = createIcon(
	"Clock",
	<>
		<circle cx="12" cy="12" r="10" />
		<polyline points="12,6 12,12 16,14" />
	</>
);

// Settings & Configuration
export const Settings = createIcon(
	"Settings",
	<>
		<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
		<circle cx="12" cy="12" r="3" />
	</>
);

export const Cog = createIcon(
	"Cog",
	<>
		<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
		<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
		<path d="M12 2v2" />
		<path d="M12 22v-2" />
		<path d="M17 20.66l-1-1.73" />
		<path d="M11 10.27l-1 1.73" />
		<path d="M20.66 17l-1.73-1" />
		<path d="M4.27 11l1.73 1" />
		<path d="M18.36 5.64l-1.41 1.41" />
		<path d="M6.34 17.66l-1.41 1.41" />
	</>
);

// Loading & Status
export const Loader = createIcon(
	"Loader",
	<>
		<line x1="12" x2="12" y1="2" y2="6" />
		<line x1="12" x2="12" y1="18" y2="22" />
		<line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
		<line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
		<line x1="2" x2="6" y1="12" y2="12" />
		<line x1="18" x2="22" y1="12" y2="12" />
		<line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
		<line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
	</>
);

export const RefreshCw = createIcon(
	"RefreshCw",
	<>
		<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
		<path d="M21 3v5h-5" />
		<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
		<path d="M3 21v-5h5" />
	</>
);

// Navigation
export const Home = createIcon(
	"Home",
	<>
		<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		<polyline points="9,22 9,12 15,12 15,22" />
	</>
);

export const Globe = createIcon(
	"Globe",
	<>
		<circle cx="12" cy="12" r="10" />
		<line x1="2" x2="22" y1="12" y2="12" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</>
);

export const MapPin = createIcon(
	"MapPin",
	<>
		<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
		<circle cx="12" cy="10" r="3" />
	</>
);

// New icons for writeups
export const BookOpen = createIcon(
	"BookOpen",
	<>
		<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
		<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
	</>
);

export const Edit = createIcon(
	"Edit",
	<>
		<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
		<path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
	</>
);

export const Save = createIcon(
	"Save",
	<>
		<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
		<polyline points="17,21 17,13 7,13 7,21" />
		<polyline points="7,3 7,8 15,8" />
	</>
);

export const Key = createIcon(
	"Key",
	<>
		<circle cx="7.5" cy="15.5" r="5.5" />
		<path d="m21 2-9.6 9.6" />
		<path d="m15.5 7.5 3 3L22 7l-3-3" />
	</>
);

export const Bell = createIcon(
	"Bell",
	<>
		<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
		<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
	</>
);

export const Terminal = createIcon(
	"Terminal",
	<>
		<polyline points="4,17 10,11 4,5" />
		<line x1="12" x2="20" y1="19" y2="19" />
	</>
);

export const Code = createIcon(
	"Code",
	<>
		<polyline points="16,18 22,12 16,6" />
		<polyline points="8,6 2,12 8,18" />
	</>
);

export const Zap = createIcon(
	"Zap",
	<polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
);

export const Cpu = createIcon(
	"Cpu",
	<>
		<rect x="4" y="4" width="16" height="16" rx="2" />
		<rect x="9" y="9" width="6" height="6" />
		<path d="M9 1v3" />
		<path d="M15 1v3" />
		<path d="M9 20v3" />
		<path d="M15 20v3" />
		<path d="M20 9h3" />
		<path d="M20 14h3" />
		<path d="M1 9h3" />
		<path d="M1 14h3" />
	</>
);

export const Award = createIcon(
	"Award",
	<>
		<circle cx="12" cy="8" r="6" />
		<path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
	</>
);

export const PlusCircle = createIcon(
	"PlusCircle",
	<>
		<circle cx="12" cy="12" r="10" />
		<path d="M8 12h8" />
		<path d="M12 8v8" />
	</>
);

export const ThumbsUp = createIcon(
	"ThumbsUp",
	<>
		<path d="M7 10v12" />
		<path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
	</>
);

export const ThumbsDown = createIcon(
	"ThumbsDown",
	<>
		<path d="M17 14V2" />
		<path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
	</>
);

export const Copy = createIcon(
	"Copy",
	<>
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</>
);

export const Send = createIcon(
	"Send",
	<path d="M9.912 11.025 21 2l-8.975 12.088a1 1 0 0 1-.755.427H8a1 1 0 0 1-1-1V9.73a1 1 0 0 1 .438-.83Z" />
);

export const HelpCircle = createIcon(
	"HelpCircle",
	<>
		<circle cx="12" cy="12" r="10" />
		<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
		<path d="M12 17h.01" />
	</>
);

export const Trash2 = createIcon(
	"Trash2",
	<>
		<path d="M3 6h18" />
		<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
		<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
		<line x1="10" x2="10" y1="11" y2="17" />
		<line x1="14" x2="14" y1="11" y2="17" />
	</>
);

export const Github = createIcon(
	"Github",
	<>
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5 0-1.2-.5-2.4-1.3-3.4.1-.4.1-1.2-.1-2.1 0 0-1.1 0-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 7.8 5.4 7.8 5.4 7.8c-.2.9-.2 1.7-.1 2.1C4.5 10.9 4 12.1 4 13.3c0 3.5 3 5.5 6 5.5-.4.4-.7 1.1-1 1.8-.3.1-.7.1-1.1 0-.5-.1-1-.5-1.4-1.1-.4-.6-.9-.9-1.5-.9-.3 0-.1.2.1.3.3.1.6.4.8.8.2.4.6.7 1.1.8.3.1.6.1.9 0V22" />
	</>
);

export const Linkedin = createIcon(
	"Linkedin",
	<>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect width="4" height="12" x="2" y="9" />
		<circle cx="4" cy="4" r="2" />
	</>
);

export const Twitter = createIcon(
	"Twitter",
	<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
);

// Create compound icons for specific use cases
export const LoadingSpinner = createIcon(
	"LoadingSpinner",
	<>
		<path d="M21 12a9 9 0 11-6.219-8.56" />
	</>
);

// Export all icons in a convenient object
export const Icons = {
	// Navigation
	Menu,
	X,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	ArrowLeft,
	ArrowRight,
	Search,
	Filter,
	MoreHorizontal,
	Plus,
	Minus,

	// Authentication
	User,
	Users,
	LogIn,
	LogOut,
	Lock,
	Unlock,

	// CTF & Security
	Shield,
	ShieldCheck,
	Trophy,
	Flag,
	Target,

	// Status & Feedback
	CheckCircle,
	XCircle,
	AlertCircle,
	AlertTriangle,
	Info,

	// Trends & Analytics
	TrendingUp,
	TrendingDown,
	BarChart,
	PieChart,

	// Actions & States
	Eye,
	EyeOff,
	Star,
	Heart,
	Bookmark,
	Share,

	// Communication
	MessageSquare,
	MessageCircle,
	Mail,
	Phone,

	// Media & Content
	Image,
	Video,
	File,
	Download,
	Upload,
	Link,
	ExternalLink,

	// Time & Calendar
	Calendar,
	Clock,

	// Settings & Configuration
	Settings,
	Cog,

	// Loading & Status
	Loader,
	RefreshCw,
	LoadingSpinner,

	// Navigation
	Home,
	Globe,
	MapPin,

	// Content & Writing
	BookOpen,
	Edit,
	Save,
	Key,
	Bell,
	Terminal,
	Code,
	Zap,
	Cpu,
	Award,
	PlusCircle,
	ThumbsUp,
	ThumbsDown,
	Copy,
	Send,
	HelpCircle,
	Trash2,
	Github,
	Linkedin,
	Twitter,
} as const;

export default Icons;
