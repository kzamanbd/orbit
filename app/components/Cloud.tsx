"use client"

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import {
    Cloud,
    HardDrive,
    FileText,
    Image as ImageIcon,
    Music,
    Video,
    Folder,
    MoreVertical,
    Search,
    Plus,
    Grid,
    List as ListIcon,
    Settings,
    LogOut,
    UploadCloud,
    CheckCircle,
    X,
    Loader,
    ArrowLeft,
    LucideIcon
} from 'lucide-react';

/**
 * ORBIT - Cloud Storage Interface
 * * NEXT.JS MIGRATION GUIDE:
 * 1. Create a new Next.js app: npx create-next-app@latest orbit
 * 2. Copy this file content into `app/page.js` (for App Router) or `pages/index.js` (for Pages Router).
 * 3. Ensure 'lucide-react' is installed: npm install lucide-react
 * 4. This component uses client-side logic, so add 'use client'; at the very top if using App Router.
 */

// --- Types ---
interface FileItem {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
}

interface User {
    name: string;
    email: string;
    picture: string;
}

interface Config {
    clientId: string;
    apiKey: string;
}

interface FolderHistoryItem {
    id: string;
    name: string;
}

// --- Mock Data for Demo Mode ---
const MOCK_FILES: FileItem[] = [
    { id: '1', name: 'Project Proposals', type: 'folder', size: '-', modified: '2023-10-24' },
    { id: '2', name: 'Orbit Design Assets', type: 'folder', size: '-', modified: '2023-11-02' },
    { id: '3', name: 'Q4 Financial Report.pdf', type: 'application/pdf', size: '2.4 MB', modified: '2023-11-10' },
    { id: '4', name: 'Launch_Campaign.jpg', type: 'image/jpeg', size: '4.1 MB', modified: '2023-11-12' },
    { id: '5', name: 'Meeting_Notes.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '14 KB', modified: '2023-11-15' },
    { id: '6', name: 'main_theme.mp3', type: 'audio/mpeg', size: '8.2 MB', modified: '2023-11-01' },
];

export default function OrbitApp() {
    // --- State ---
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState<boolean>(false);
    const [config, setConfig] = useState<Config>({ clientId: '', apiKey: '' });
    const [showConfig, setShowConfig] = useState<boolean>(false);
    const [currentFolder, setCurrentFolder] = useState<string>('root');
    const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([{ id: 'root', name: 'My Drive' }]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

    // --- Google API Refs ---
    const gapiRef = useRef<any>(null);
    const tokenClientRef = useRef<any>(null);

    // --- Initialization ---
    useEffect(() => {
        // Check if we have credentials in local storage to persist demo/config
        const storedConfig = localStorage.getItem('orbit_config');
        if (storedConfig) {
            setConfig(JSON.parse(storedConfig));
        }
    }, []);

    // --- Handlers ---

    const handleLogin = () => {
        if (!config.clientId && !config.apiKey) {
            // Enter Demo Mode
            setLoading(true);
            setTimeout(() => {
                setIsAuthenticated(true);
                setUser({ name: 'Demo User', email: 'demo@orbit.app', picture: '' });
                setFiles(MOCK_FILES);
                setLoading(false);
            }, 800);
        } else {
            // Real Google Auth would go here
            // For this single file demo, we primarily show the UI logic.
            // In a real implementation, we would load 'https://accounts.google.com/gsi/client'
            // and 'https://apis.google.com/js/api.js' here.
            alert("Live Google API connection requires a hosted environment with authorized origins. Loading Demo Mode for preview.");
            handleLogin(); // Fallback to demo for the preview
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setFiles([]);
    };

    const handleConfigSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newConfig = {
            clientId: formData.get('clientId') as string,
            apiKey: formData.get('apiKey') as string
        };
        setConfig(newConfig);
        localStorage.setItem('orbit_config', JSON.stringify(newConfig));
        setShowConfig(false);
    };

    const navigateFolder = (folderId: string, folderName?: string) => {
        if (folderId === 'back') {
            const newHistory = [...folderHistory];
            newHistory.pop();
            const prev = newHistory[newHistory.length - 1];
            setCurrentFolder(prev.id);
            setFolderHistory(newHistory);
        } else {
            if (!folderName) return;
            setCurrentFolder(folderId);
            setFolderHistory([...folderHistory, { id: folderId, name: folderName }]);
        }
        // Simulate fetch
        setLoading(true);
        setTimeout(() => setLoading(false), 400);
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            const newFile: FileItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type || 'application/octet-stream',
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                modified: new Date().toISOString().split('T')[0]
            };
            setFiles([newFile, ...files]);
            setUploading(false);
        }, 1500);
    };

    // --- Render Helpers ---

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes('folder')) return <Folder className="text-blue-500 fill-current" />;
        if (mimeType.includes('image')) return <ImageIcon className="text-purple-500" />;
        if (mimeType.includes('pdf')) return <FileText className="text-red-500" />;
        if (mimeType.includes('audio')) return <Music className="text-pink-500" />;
        if (mimeType.includes('video')) return <Video className="text-orange-500" />;
        return <FileText className="text-gray-400" />;
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Sub-Components ---

    const Sidebar = () => (
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex h-full">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Cloud className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">Orbit</span>
            </div>

            <div className="px-4 mb-6">
                <label className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl cursor-pointer transition-all shadow-md shadow-blue-200">
                    <Plus size={18} />
                    <span className="font-medium">New Upload</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <NavItem icon={HardDrive} label="My Drive" active />
                <NavItem icon={ImageIcon} label="Photos" />
                <NavItem icon={FileText} label="Documents" />
                <NavItem icon={Video} label="Media" />
                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Storage</p>
                </div>
                <div className="px-4 py-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">11.5 GB of 15 GB used</p>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );

    interface NavItemProps {
        icon: LucideIcon;
        label: string;
        active?: boolean;
    }

    const NavItem = ({ icon: Icon, label, active }: NavItemProps) => (
        <button className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-colors ${active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Icon size={18} className={active ? 'text-blue-600' : 'text-gray-400'} />
            {label}
        </button>
    );

    // --- Main Render ---

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                            <Cloud className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Orbit</h1>
                        <p className="text-gray-500 mb-8">Your minimalist gateway to the cloud.</p>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all mb-4"
                        >
                            {loading ? (
                                <Loader className="animate-spin text-gray-400" size={20} />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setShowConfig(true)}
                            className="text-sm text-gray-400 hover:text-blue-600 underline"
                        >
                            Configure API Keys
                        </button>
                    </div>
                </div>

                {/* Config Modal */}
                {showConfig && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">API Configuration</h3>
                                <button onClick={() => setShowConfig(false)}><X size={20} className="text-gray-400" /></button>
                            </div>
                            <form onSubmit={handleConfigSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Client ID</label>
                                    <input name="clientId" defaultValue={config.clientId} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="xxx.apps.googleusercontent.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                                    <input name="apiKey" defaultValue={config.apiKey} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="AIza..." />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700">Save & Connect</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- Authenticated View ---
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
                    {/* Mobile Menu Button would go here */}
                    <div className="flex items-center gap-4 flex-1">
                        {folderHistory.length > 1 && (
                            <button onClick={() => navigateFolder('back')} className="p-2 hover:bg-gray-100 rounded-full">
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                        )}
                        <div className="relative flex-1 max-w-2xl">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search in Orbit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-gray-600 hidden sm:block">
                            <Settings size={20} />
                        </button>
                        {user && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                                {user.picture ? <img src={user.picture} alt="User" className="w-full h-full rounded-full" /> : user.name[0]}
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {uploading && (
                        <div className="mb-6 bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                            <Loader className="animate-spin" size={20} />
                            <span className="font-medium text-sm">Uploading your file to Orbit...</span>
                        </div>
                    )}

                    {/* Breadcrumbs & View Toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {folderHistory[folderHistory.length - 1].name}
                        </h2>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredFiles.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UploadCloud className="text-gray-300 w-10 h-10" />
                            </div>
                            <p className="text-gray-500 font-medium">No files found</p>
                            <p className="text-gray-400 text-sm mt-1">Drag and drop files here to upload</p>
                        </div>
                    )}

                    {/* Files Grid View */}
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => file.type === 'folder' && navigateFolder(file.id, file.name)}
                                    className="group bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col"
                                >
                                    <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-50 group-hover:bg-blue-50/30 transition-colors">
                                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                                            {React.cloneElement(getFileIcon(file.type), { size: 48, strokeWidth: 1.5 })}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-700 truncate text-sm mb-1" title={file.name}>{file.name}</h3>
                                            <p className="text-xs text-gray-400">{file.size === '-' ? 'Folder' : file.size}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Files List View */}
                    {viewMode === 'list' && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3 w-32 hidden sm:table-cell">Size</th>
                                        <th className="px-6 py-3 w-40 hidden md:table-cell">Modified</th>
                                        <th className="px-6 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredFiles.map((file) => (
                                        <tr
                                            key={file.id}
                                            className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                                            onClick={() => file.type === 'folder' && navigateFolder(file.id, file.name)}
                                        >
                                            <td className="px-6 py-3.5 flex items-center gap-3 text-gray-700 font-medium">
                                                {getFileIcon(file.type)}
                                                <span className="truncate max-w-xs">{file.name}</span>
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-500 hidden sm:table-cell">{file.size}</td>
                                            <td className="px-6 py-3.5 text-gray-500 hidden md:table-cell">{file.modified}</td>
                                            <td className="px-6 py-3.5 text-right">
                                                <button className="text-gray-300 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
