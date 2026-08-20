import React, { useEffect, useRef, useState } from 'react';

const frameCount = 300;

// Generate image paths matching ezgif-frame-001.png to ezgif-frame-300.png
const currentFrame = (index) => {
    return `/Animation/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`;
};

export default function ScrollCanvas() {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(0);
    const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
    const [error, setError] = useState('');
    
    // We keep images in a ref so they don't trigger re-renders
    const imagesRef = useRef(new Array(frameCount));
    const frameRef = useRef({ frame: 0 });
    const tickingRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');

        const updateFrameIndex = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScrollTop > 0) {
                const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
                frameRef.current.frame = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
            } else {
                frameRef.current.frame = 0;
            }
        };

        const render = () => {
            const img = imagesRef.current[frameRef.current.frame];
            if (img && img.complete && img.naturalWidth > 0) {
                const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
                const x = (canvas.width / 2) - (img.naturalWidth / 2) * scale;
                const y = (canvas.height / 2) - (img.naturalHeight / 2) * scale;
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        updateFrameIndex();

        // 1. Load initial frame
        const initialFrameIndex = frameRef.current.frame;
        const initialImg = new Image();
        initialImg.src = currentFrame(initialFrameIndex);
        
        initialImg.onload = () => {
            imagesRef.current[initialFrameIndex] = initialImg;
            setIsFirstFrameLoaded(true);
            render();
            
            // 2. Preload remaining
            let loadedCount = 1;
            for (let i = 0; i < frameCount; i++) {
                if (i === initialFrameIndex) continue;

                const img = new Image();
                img.src = currentFrame(i);
                img.onload = () => {
                    loadedCount++;
                    setLoading(Math.round((loadedCount / frameCount) * 100));
                    
                    if (i === frameRef.current.frame) {
                        render(); 
                    }
                };
                imagesRef.current[i] = img;
            }
        };

        initialImg.onerror = () => {
            setError("Error loading images. Check console.");
        };

        const handleScroll = () => {
            if (!tickingRef.current) {
                window.requestAnimationFrame(() => {
                    updateFrameIndex();
                    render();
                    tickingRef.current = false;
                });
                tickingRef.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {!isFirstFrameLoaded && !error && (
                <div className="loading-indicator">
                    Loading... {loading}%
                </div>
            )}
            {error && (
                <div className="loading-indicator">
                    {error}
                </div>
            )}
            <canvas ref={canvasRef} id="canvas"></canvas>
        </>
    );
}
