"use client"

import React, { useMemo } from "react"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { BsStarHalf } from "react-icons/bs"

const Ratings = ({ rating = 0, size = 18, className = "" }) => {
  const safeRating = useMemo(() => {
    const r = Number(rating)
    if (!Number.isFinite(r)) return 0
    return Math.max(0, Math.min(5, r))
  }, [rating])

  const stars = useMemo(() => {
    const full = Math.floor(safeRating)
    const hasHalf = safeRating - full >= 0.25 && safeRating - full < 0.75
    const extraFull = safeRating - full >= 0.75 ? 1 : 0

    const result = []

    for (let i = 1; i <= 5; i++) {
      if (i <= full + extraFull) {
        result.push(<AiFillStar key={i} size={size} className="text-amber-500" />)
      } else if (i === full + 1 && hasHalf) {
        result.push(<BsStarHalf key={i} size={size - 2} className="text-amber-500" />)
      } else {
        result.push(<AiOutlineStar key={i} size={size} className="text-amber-400" />)
      }
    }

    return result
  }, [safeRating, size])

  return <div className={`flex items-center gap-1 ${className}`}>{stars}</div>
}

export default Ratings
