import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, BarChart3, Trophy, Menu, X, LogOut, User, BookOpen } from 'lucide-react';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { displayName, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Tracker', icon: BarChart3 },
        { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
        { path: '/definitions', label: 'Physics', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-surface-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-neon-blue" />
                        <span className="font-bold">EXPANSION</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-surface-100 rounded-lg"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-50 bg-black/60"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-surface-50 border-r border-surface-200 z-50
                transform transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-surface-200">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-neon-blue" />
                            <span className="font-bold">EXPANSION</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1 hover:bg-surface-100 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                                    ${isActive
                                        ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30'
                                        : 'text-gray-400 hover:bg-surface-100 hover:text-white'}
                                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-surface-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-neon-blue/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-neon-blue" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {displayName || 'User'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64">
                <div className="pt-16 md:pt-0 min-h-screen">
                    <div className="max-w-2xl mx-auto px-6 md:px-12 py-8 md:py-12">
                        <Outlet />
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Layout;
