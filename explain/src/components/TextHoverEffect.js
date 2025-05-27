"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({ text, duration }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: 300, cy: 70 }); // center in SVG units

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      // 600 = viewBox width, 140 = viewBox height
      const cx = ((cursor.x - svgRect.left) / svgRect.width) * 600;
      const cy = ((cursor.y - svgRect.top) / svgRect.height) * 140;
      setMaskPosition({ cx, cy });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 600 140"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#fff" />
          <stop offset="20%" stopColor="#b2ffe7" />
          <stop offset="40%" stopColor="#36cfa0" />
          <stop offset="60%" stopColor="#2dd4bf" />
          <stop offset="80%" stopColor="#36cfa0" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r={90}
          cx={maskPosition.cx}
          cy={maskPosition.cy}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      {/* Always show the outline */}
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="#fefefe"
        strokeWidth="0.7"
        fill="transparent"
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 700,
          fontSize: "7rem",
          opacity: 0.35,
          transition: "opacity 0.2s",
        }}
      >
        {text}
      </text>
      {/* Gradient stroke only where hovered */}
      {hovered && (
        <motion.text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#textGradient)"
          strokeWidth="0.9"
          fill="transparent"
          mask="url(#textMask)"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "7rem",
            opacity: 1,
          }}
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{
            strokeDashoffset: 0,
            strokeDasharray: 1000,
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>
      )}
    </svg>
  );
};
