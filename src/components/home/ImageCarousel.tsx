"use client";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import {slides} from "@/lib/util/slides";
export interface Slide {
  imageUrl: string;
  label?: string;
}




export default function ImageCarousel() {
  return (
    <div className="relative w-full h-[250px]">
      {/* Swiper 캐러셀 */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{
          type: "progressbar",
          el: ".custom-progress", // 외부 진행 바 DOM 연결
        }}
        slidesPerView={1}
        loop={false}
        className="relative h-full overflow-visible rounded-xl"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              <Image
                src={slide.imageUrl}
                alt={slide.label ?? `Slide ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
              />
              {slide.label && (
                <div className="absolute bottom-8 left-6 text-white text-xl font-bold z-10 leading-snug drop-shadow-lg">
                  {slide.label.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 이전/다음 버튼 */}
      <div className="absolute bottom-9 right-1 -translate-x-1/2 z-20 flex gap-3">
        <button className="custom-prev bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button className="custom-next bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
      <div className="absolute -bottom-3 left-0 w-full h-[4px] z-5">
        <div className="custom-progress swiper-pagination-progressbar h-full bg-gray-300" />
      </div>
    </div>
  );
}
