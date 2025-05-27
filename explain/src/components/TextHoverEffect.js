"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({ text, duration }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 140"
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
          <stop offset="0%" stopColor="#b2ffe7" stopOpacity="1" />
          <stop offset="40%" stopColor="#36cfa0" stopOpacity="1" />
          <stop offset="70%" stopColor="#2dd4bf" stopOpacity="1" />
          <stop offset="100%" stopColor="#b2ffe7" stopOpacity="1" />
        </linearGradient>
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="40"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
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
          strokeWidth="1.2"
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