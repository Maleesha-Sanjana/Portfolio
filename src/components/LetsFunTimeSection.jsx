import React, { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Camera, RefreshCw, Hexagon, Star, Circle, Monitor, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SHAPES = ['circle', 'hexagon', 'star'];
const FILTERS = ['fire', 'reveal', 'mirror', 'drain', 'pixelate'];

const LetsFunTimeSection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const bgCanvasRef = useRef(null);
    
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isCamActive, setIsCamActive] = useState(false);
    
    // UI state
    const [currentShape, setCurrentShape] = useState(0);
    const [currentFilter, setCurrentFilter] = useState(0);
    const [bgCaptured, setBgCaptured] = useState(false);

    // Refs for animation loop to access fresh state
    const stateRefs = useRef({
        shape: 0,
        filter: 0,
        bgCaptured: false,
        lastVideoTime: -1
    });

    useEffect(() => {
        stateRefs.current = {
            shape: currentShape,
            filter: currentFilter,
            bgCaptured: bgCaptured
        };
    }, [currentShape, currentFilter, bgCaptured]);

    const handLandmarkerRef = useRef(null);
    const animationRef = useRef(null);
    
    // Config
    const MIN_RADIUS = 30;
    const MAX_RADIUS = 220;
    const RING_THICKNESS = 4;
    const SMOOTHING = 0.35;

    // Portal state (for 2 hands)
    const portalsRef = useRef([
        { center: null, radius: MIN_RADIUS, active: false, color: '#FFD700' }, // Gold
        { center: null, radius: MIN_RADIUS, active: false, color: '#00C8FF' }  // Cyan
    ]);

    const [modelError, setModelError] = useState(null);

    useEffect(() => {
        const initMediaPipe = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
                );
                handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                        delegate: "CPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 2,
                    minHandDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.6
                });
                setIsModelLoaded(true);
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
                setModelError(error.message || "Failed to load model");
            }
        };
        initMediaPipe();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            setModelError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: { ideal: 960 }, height: { ideal: 540 }, facingMode: "user" } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                try {
                    await videoRef.current.play();
                } catch(e) {
                    console.log("Play failed initially:", e);
                }
                
                const onLoaded = () => {
                    if (!isCamActive) {
                        setIsCamActive(true);
                    }
                };

                videoRef.current.onloadeddata = onLoaded;
                
                if (videoRef.current.readyState >= 2) {
                    onLoaded();
                }
            }
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setModelError(error.name === 'NotAllowedError' 
                ? "Camera access denied. Please grant permissions." 
                : (error.message || "Failed to access webcam."));
        }
    };

    // Start the render loop once the canvas is mounted
    useEffect(() => {
        if (isCamActive && canvasRef.current) {
            renderLoop();
        }
    }, [isCamActive]);

    const captureBackground = () => {
        if (!videoRef.current || !bgCanvasRef.current) return;
        const video = videoRef.current;
        const canvas = bgCanvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        setBgCaptured(true);
    };

    const drawHexagon = (ctx, x, y, radius, rotation) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i - 30) + rotation;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    };

    const drawStar = (ctx, x, y, radius, rotation) => {
        ctx.beginPath();
        const outer = radius;
        const inner = radius * 0.45;
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? outer : inner;
            const angle = (Math.PI / 180) * (36 * i - 90) + rotation;
            const px = x + r * Math.cos(angle);
            const py = y + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    };

    const drawCircle = (ctx, x, y, radius) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.closePath();
    };

    const renderLoop = () => {
        if (!videoRef.current || !canvasRef.current || !handLandmarkerRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video.videoWidth || !video.videoHeight) {
            animationRef.current = requestAnimationFrame(renderLoop);
            return;
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        const width = canvas.width;
        const height = canvas.height;

        let startTimeMs = performance.now();
        let results = null;
        try {
            if (video.currentTime > 0 && video.currentTime !== stateRefs.current.lastVideoTime) {
                stateRefs.current.lastVideoTime = video.currentTime;
                // Ensure strictly increasing timestamp for MediaPipe
                let mpTimestamp = performance.now();
                if (mpTimestamp <= (stateRefs.current.lastMpTime || 0)) {
                    mpTimestamp = stateRefs.current.lastMpTime + 1;
                }
                stateRefs.current.lastMpTime = mpTimestamp;
                
                results = handLandmarkerRef.current.detectForVideo(video, mpTimestamp);
            }
        } catch (e) {
            console.warn("MediaPipe detect error:", e);
        }

        // Draw flipped base video
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();

        const activePortals = [];

        if (results && results.landmarks) {
            results.landmarks.forEach((landmarks, i) => {
                if (i >= 2) return;
                
                const indexX = (1 - landmarks[8].x) * width;
                const indexY = landmarks[8].y * height;
                
                const thumbX = (1 - landmarks[4].x) * width;
                const thumbY = landmarks[4].y * height;

                const dist = Math.hypot(indexX - thumbX, indexY - thumbY);
                let targetRadius = ((dist - 20) / (200 - 20)) * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
                targetRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, targetRadius));

                const portal = portalsRef.current[i];
                if (!portal.center) {
                    portal.center = { x: indexX, y: indexY };
                } else {
                    portal.center.x += (indexX - portal.center.x) * SMOOTHING;
                    portal.center.y += (indexY - portal.center.y) * SMOOTHING;
                }
                portal.radius += (targetRadius - portal.radius) * SMOOTHING;
                portal.active = true;
                
                // Pinch gesture detection
                const PINCH_TRIGGER_DIST = 20;
                const PINCH_RELEASE_DIST = 45;

                if (dist < PINCH_TRIGGER_DIST) {
                    if (!portal.isPinched) {
                        portal.isPinched = true;
                        setCurrentFilter(prev => {
                            const next = (prev + 1) % FILTERS.length;
                            stateRefs.current.filter = next; // Update ref immediately for the loop
                            return next;
                        });
                    }
                } else if (dist > PINCH_RELEASE_DIST) {
                    portal.isPinched = false;
                }

                activePortals.push(portal);
            });
        }

        portalsRef.current.forEach((p) => {
            if (!activePortals.includes(p)) p.active = false;
        });

        const shape = SHAPES[stateRefs.current.shape];
        const filter = FILTERS[stateRefs.current.filter];
        const bgReady = stateRefs.current.bgCaptured;
        
        const t = performance.now() / 1000;
        const rotation = t * 0.6;

        activePortals.forEach(portal => {
            const { x, y } = portal.center;
            const r = portal.radius;

            ctx.save();
            
            // Create clipping path for the portal
            if (shape === 'hexagon') drawHexagon(ctx, x, y, r, rotation);
            else if (shape === 'star') drawStar(ctx, x, y, r, rotation);
            else drawCircle(ctx, x, y, r);
            
            ctx.clip();

            // Apply filter inside clipping path
            if (filter === 'fire') {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.translate(-width, 0);
                ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(-15deg) contrast(150%) brightness(120%)';
                ctx.drawImage(video, 0, 0, width, height);
                ctx.restore();
            }
            else if (filter === 'reveal' && bgReady && bgCanvasRef.current) {
                ctx.drawImage(bgCanvasRef.current, 0, 0, width, height);
            } 
            else if (filter === 'mirror') {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.translate(-width, 0);
                ctx.drawImage(video, 0, 0, width, height);
                ctx.restore();
            }
            else if (filter === 'drain') {
                ctx.filter = 'grayscale(100%)';
                ctx.save();
                ctx.scale(-1, 1);
                ctx.translate(-width, 0);
                ctx.drawImage(video, 0, 0, width, height);
                ctx.restore();
                ctx.filter = 'none';
            }
            else if (filter === 'pixelate') {
                const block = 15;
                const smallW = Math.max(1, width / block);
                const smallH = Math.max(1, height / block);
                
                const offCanvas = document.createElement('canvas');
                offCanvas.width = smallW;
                offCanvas.height = smallH;
                const offCtx = offCanvas.getContext('2d');
                offCtx.scale(-1, 1);
                offCtx.translate(-smallW, 0);
                offCtx.drawImage(video, 0, 0, smallW, smallH);
                
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(offCanvas, 0, 0, smallW, smallH, 0, 0, width, height);
                ctx.imageSmoothingEnabled = true;
            }

            ctx.restore();

            // Draw glowing ring
            ctx.save();
            const pulse = 1.0 + 0.06 * Math.sin(t * 4);
            const ringR = r * pulse;
            
            ctx.strokeStyle = portal.color;
            ctx.lineWidth = RING_THICKNESS;
            
            if (shape === 'hexagon') drawHexagon(ctx, x, y, ringR, rotation);
            else if (shape === 'star') drawStar(ctx, x, y, ringR, rotation);
            else drawCircle(ctx, x, y, ringR);
            ctx.stroke();
            
            ctx.lineWidth = Math.max(1, RING_THICKNESS - 2);
            if (shape === 'hexagon') drawHexagon(ctx, x, y, ringR * 0.85, rotation);
            else if (shape === 'star') drawStar(ctx, x, y, ringR * 0.85, rotation);
            else drawCircle(ctx, x, y, ringR * 0.85);
            ctx.stroke();

            ctx.restore();
        });

        animationRef.current = requestAnimationFrame(renderLoop);
    };

    return (
        <section className="fun-time-section interactive" id="fun-time">
            <div className="fun-time-content">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="section-header"
                >
                    <h2 className="glitch-text" data-text="Let's Fun Time">Let's Fun Time</h2>
                    <p className="subtitle">Pinch your fingers to reveal the invisibility portal. Move your hands to control it.</p>
                </motion.div>

                <div className="fun-time-container">
                    {/* Hidden elements */}
                    <video ref={videoRef} playsInline autoPlay muted style={{ position: 'absolute', left: '-9999px', width: '640px', height: '360px' }} />
                    <canvas ref={bgCanvasRef} style={{ display: 'none' }} />

                    {/* Main Viewport */}
                    <div className="canvas-wrapper">
                        {!isCamActive ? (
                            <div className="cam-placeholder">
                                <Sparkles className="icon-pulse" size={48} />
                                <p>Ready to try AI Magic?</p>
                                <button 
                                    className="start-cam-btn" 
                                    onClick={startCamera}
                                    disabled={!isModelLoaded}
                                >
                                    {modelError ? 'Error Loading Model' : isModelLoaded ? 'Start Camera' : 'Loading AI Model...'}
                                </button>
                                {modelError && <p style={{ color: '#ff4444', fontSize: '0.9rem', maxWidth: '300px' }}>{modelError}</p>}
                            </div>
                        ) : (
                            <canvas ref={canvasRef} className="main-canvas" />
                        )}

                        {/* Controls Overlay */}
                        {isCamActive && (
                            <div className="controls-overlay">
                                <div className="control-group">
                                    <button className="control-btn" onClick={() => setCurrentShape((s) => (s + 1) % SHAPES.length)}>
                                        {currentShape === 0 && <Circle size={20} />}
                                        {currentShape === 1 && <Hexagon size={20} />}
                                        {currentShape === 2 && <Star size={20} />}
                                        <span>Shape</span>
                                    </button>
                                    
                                    <button className="control-btn" onClick={() => setCurrentFilter((f) => (f + 1) % FILTERS.length)}>
                                        <Monitor size={20} />
                                        <span>{FILTERS[currentFilter]}</span>
                                    </button>

                                    {currentFilter === 0 && (
                                        <button className={`control-btn highlight ${bgCaptured ? 'active' : ''}`} onClick={captureBackground}>
                                            <ImageIcon size={20} />
                                            <span>{bgCaptured ? 'Retake BG' : 'Capture BG'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LetsFunTimeSection;
