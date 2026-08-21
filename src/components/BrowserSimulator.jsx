import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, RotateCw, ArrowLeft, ArrowRight, LayoutDashboard, Settings, Users, Activity } from 'lucide-react';
import '../index.css';

// A simple interactive dummy website to show inside the simulator if no iframeSrc is provided
const DummyWebsite = ({ title }) => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="dummy-website">
            <div className="dummy-sidebar">
                <div className="dummy-logo">{title.charAt(0)}</div>
                <nav className="dummy-nav">
                    <button className={`dummy-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button className={`dummy-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        <Activity size={18} /> Analytics
                    </button>
                    <button className={`dummy-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <Users size={18} /> Users
                    </button>
                    <button className={`dummy-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <Settings size={18} /> Settings
                    </button>
                </nav>
            </div>
            
            <div className="dummy-main-content">
                <header className="dummy-header">
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                    <div className="dummy-avatar-small"></div>
                </header>
                
                <div className="dummy-scroll-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="dummy-dashboard-grid"
                        >
                            {activeTab === 'dashboard' && (
                                <>
                                    <div className="dummy-stat-card">
                                        <h4>Total Views</h4>
                                        <div className="dummy-stat-value">24,592</div>
                                        <div className="dummy-stat-trend positive">+14%</div>
                                    </div>
                                    <div className="dummy-stat-card">
                                        <h4>Active Users</h4>
                                        <div className="dummy-stat-value">1,245</div>
                                        <div className="dummy-stat-trend positive">+5%</div>
                                    </div>
                                    <div className="dummy-stat-card">
                                        <h4>Revenue</h4>
                                        <div className="dummy-stat-value">$12.4k</div>
                                        <div className="dummy-stat-trend negative">-2%</div>
                                    </div>
                                    <div className="dummy-chart-card">
                                        <div className="dummy-chart-bar" style={{ height: '40%' }}></div>
                                        <div className="dummy-chart-bar" style={{ height: '70%' }}></div>
                                        <div className="dummy-chart-bar" style={{ height: '50%' }}></div>
                                        <div className="dummy-chart-bar" style={{ height: '90%' }}></div>
                                        <div className="dummy-chart-bar" style={{ height: '60%' }}></div>
                                        <div className="dummy-chart-bar" style={{ height: '80%' }}></div>
                                        <div className="dummy-chart-bar" style={{ height: '30%' }}></div>
                                    </div>
                                </>
                            )}
                            {activeTab !== 'dashboard' && (
                                <div className="dummy-generic-view">
                                    <div className="dummy-skeleton-title"></div>
                                    <div className="dummy-skeleton-line" style={{ width: '100%' }}></div>
                                    <div className="dummy-skeleton-line" style={{ width: '80%' }}></div>
                                    <div className="dummy-skeleton-line" style={{ width: '90%' }}></div>
                                    <br />
                                    <div className="dummy-skeleton-box"></div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default function BrowserSimulator({ project }) {
    if (!project) return null;

    const dummyUrl = project.link !== "#" ? project.link : `https://${project.title.toLowerCase().replace(/\s+/g, '')}.com`;

    return (
        <div className="browser-device">
            {/* macOS Style Title Bar */}
            <div className="browser-header">
                <div className="browser-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                </div>
                <div className="browser-nav-actions">
                    <ArrowLeft size={14} className="disabled" />
                    <ArrowRight size={14} className="disabled" />
                    <RotateCw size={14} />
                </div>
                <div className="browser-address-bar">
                    <Lock size={12} className="lock-icon" />
                    <span className="url">{dummyUrl}</span>
                </div>
                <div className="browser-right-actions"></div>
            </div>

            <div className="browser-screen">
                {project.iframeSrc ? (
                    <iframe
                        src={project.iframeSrc}
                        title={project.title}
                        frameBorder="0"
                        width="100%"
                        height="100%"
                    ></iframe>
                ) : (
                    <DummyWebsite title={project.title} />
                )}
            </div>
        </div>
    );
}
