import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Battery, Signal, Home, Search, User } from 'lucide-react';
import '../index.css';

// A simple interactive dummy app to show inside the simulator if no iframeSrc is provided
const DummyApp = ({ title }) => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="dummy-app">
            {/* iOS Status Bar Mockup */}
            <div className="status-bar">
                <span className="time">9:41</span>
                <div className="status-icons">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <Battery size={14} />
                </div>
            </div>

            {/* Dynamic content based on tab */}
            <div className="app-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="tab-content"
                    >
                        {activeTab === 'home' && (
                            <>
                                <h1 style={{ color: 'black', margin: '0 0 1rem 0', fontSize: '1.5rem', fontFamily: 'Outfit' }}>{title}</h1>
                                <div className="dummy-card" style={{ background: '#007AFF' }}>
                                    <h3>Welcome Back</h3>
                                    <p>Your interactive demo is running smoothly.</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                    <div className="dummy-card small-card"></div>
                                    <div className="dummy-card small-card"></div>
                                </div>
                            </>
                        )}
                        {activeTab === 'search' && (
                            <>
                                <h1 style={{ color: 'black', margin: '0 0 1rem 0', fontSize: '1.5rem', fontFamily: 'Outfit' }}>Search</h1>
                                <div className="dummy-search-bar">Search {title}...</div>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="dummy-list-item">
                                        <div className="dummy-avatar"></div>
                                        <div className="dummy-lines">
                                            <div className="dummy-line" style={{ width: '80%' }}></div>
                                            <div className="dummy-line" style={{ width: '50%' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {activeTab === 'profile' && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <div className="dummy-profile-pic"></div>
                                <h2 style={{ color: 'black', marginTop: '1rem', fontFamily: 'Outfit' }}>User Profile</h2>
                                <p style={{ color: '#666' }}>Testing the simulator.</p>
                                <button className="dummy-btn">Edit Profile</button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <Home size={20} />
                </button>
                <button className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                    <Search size={20} />
                </button>
                <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                    <User size={20} />
                </button>
            </div>
        </div>
    );
};

export default function MobileSimulator({ project }) {
    if (!project) return null;

    return (
        <div className="mobile-device">
            {/* The Notch / Dynamic Island */}
            <div className="device-notch">
                <div className="camera"></div>
                <div className="speaker"></div>
            </div>

            <div className="device-screen">
                {project.iframeSrc ? (
                    <iframe
                        src={project.iframeSrc}
                        title={project.title}
                        frameBorder="0"
                        width="100%"
                        height="100%"
                    ></iframe>
                ) : (
                    <DummyApp title={project.title} />
                )}
            </div>
        </div>
    );
}
