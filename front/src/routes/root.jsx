import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from "react";

export default function Root() {
    let location = useLocation();
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // size canvas to its container (landing-main)
        // declare sizing variables early so resize/setup won't hit TDZ
        let canvasWidth = 0;
        let canvasHeight = 0;

        let centerX = 0;
        let centerY = 0;

        function resize() {
            const parent = canvas.parentElement;
            const w = parent.clientWidth || window.innerWidth;
            const h = parent.clientHeight || window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            // update sizing dependent values BEFORE setup
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            centerX = canvasWidth * 0.5;
            centerY = canvasHeight * 0.5;
            // re-setup stars for new size
            setup();
        }

    // do not call resize/setup here - wait until Star class and setup are defined

        const numberOfStars = 500;
        const frames_per_second = 60;
        const interval = Math.floor(1000 / frames_per_second);

        let startTime = performance.now();
        let previousTime = startTime;
        let currentTime = 0;
        let deltaTime = 0;

        const stars = [];

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function remap(value, inMin, inMax, outMin, outMax) {
            // handle zero-length input range
            if (inMax - inMin === 0) return outMin;
            const t = (value - inMin) / (inMax - inMin);
            return outMin + t * (outMax - outMin);
        }

        class Star {
            constructor() {
                this.x = getRandomInt(-centerX, centerX);
                this.y = getRandomInt(-centerY, centerY);
                this.counter = getRandomInt(1, canvasWidth);

                this.radiusMax = 1 + Math.random() * 10;
                this.speed = getRandomInt(1, 5);
            }

            drawStar() {
                this.counter -= this.speed;

                if (this.counter < 1) {
                    this.counter = canvasWidth;
                    this.x = getRandomInt(-centerX, centerX);
                    this.y = getRandomInt(-centerY, centerY);

                    this.radiusMax = getRandomInt(1, 10);
                    this.speed = getRandomInt(1, 5);
                }

                // project x,y from a center-origin perspective so stars radiate from center
                const depth = Math.max(1, this.counter);
                const normX = this.x / depth; // roughly in range [-centerX/depth, centerX/depth]
                const normY = this.y / depth;

                const starX = centerX + normX * centerX;
                const starY = centerY + normY * centerY;

                this.radius = remap(this.counter, 0, canvasWidth, this.radiusMax, 0);

                ctx.beginPath();
                ctx.arc(starX, starY, Math.max(0.2, this.radius), 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fillStyle = "#FFF";
                ctx.fill();
            }
        }

        function setup() {
            // refresh sizing dependent values
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            centerX = canvasWidth * 0.5;
            centerY = canvasHeight * 0.5;

            stars.length = 0;
            for (let i = 0; i < numberOfStars; i++) {
                stars.push(new Star());
            }
        }

        // initialize canvas size and stars once Star and setup are defined
        resize();
        window.addEventListener("resize", resize);

        function draw(timestamp) {
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;

            if (deltaTime > interval) {
                previousTime = currentTime - (deltaTime % interval);

                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.fillStyle = "#111";
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                        for (let i = 0; i < stars.length; i++) {
                            stars[i].drawStar();
                        }
            }

            animationRef.current = requestAnimationFrame(draw);
        }

        animationRef.current = requestAnimationFrame(draw);

            return () => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                window.removeEventListener("resize", resize);
            };
    }, []);

    return (
        <div className="landing-main" id="landing-main">
            <canvas ref={canvasRef} className="outerspace" />
            
            <div className="landing-content">
                <img className="landing-logo" src="../logoT.png" alt="Stellar Resolution Logo" />
                <h1 className="landing-title">Stellar Resolution</h1>
                <p className="landing-subtitle">Your Gateway to the Stars</p>
                <button className="landing-button" onClick={() => navigate("/app")}>
                    Take-off
                </button>
            </div>
            
            <div className="landing-footer">
                <p>Explore the cosmos with advanced astronomical tools</p>
            </div>
        </div>
    );
}
