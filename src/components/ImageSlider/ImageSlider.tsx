"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import type SwiperType from 'swiper';
import { Pagination } from 'swiper/modules';

import "swiper/css";
import "swiper/css/pagination";
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
    urls : string[]
}

const ImageSlider = ({urls} : ImageSliderProps) => {

    const [swiper, setSwiper] = useState<null | SwiperType>(null)
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideConfig, setSlideConfig] = useState({
        isStart : true,
        isEnd : activeIndex === (urls.length ?? 0) - 1
    })

    useEffect(() => {
        swiper?.on("slideChange", ({activeIndex}) => {
            setActiveIndex(activeIndex);
            setSlideConfig({
                isStart : activeIndex === 0,
                isEnd : activeIndex === (urls.length ?? 0) -1
            })
        })
    }, [swiper, urls])

    const activeStyles = "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300"
    const inActiveStyles = "hidden text-gray-400"
  return (
    <div className='group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl'>
        <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
            <button
                onClick={(e)=> {
                    e.preventDefault()
                    swiper?.slideNext()
                }} 
                className={cn(
                    activeStyles, 
                    "right-3 transition", 
                    { 
                        [inActiveStyles] : slideConfig.isEnd,
                        "hover:bg-primary-300 text-primary-800 opacity-100" : !slideConfig.isEnd
                    }
            )}>
                <ChevronRight className='h-4 w-4 text-zinc-400' /> {' '}
            </button>
            <button
                onClick={(e)=> {
                    e.preventDefault()
                    swiper?.slidePrev()
                }} 
                className={cn(
                    activeStyles, 
                    "left-3 transition", 
                    { 
                        [inActiveStyles] : slideConfig.isStart,
                        "hover:bg-primary-300 text-primary-800 opacity-100" : !slideConfig.isStart
                    }
            )}>
                <ChevronLeft className='h-4 w-4 text-zinc-400' /> {' '}
            </button>
        </div>
        <Swiper
            pagination={{
                renderBullet : (_, className) => {
                    return `<span class="rounded-full transition ${className} "></span>`
                }
            }} 
            onSwiper={(swiper) => setSwiper(swiper)} 
            className='h-full w-full'
            spaceBetween={50}
            slidesPerView={1}
            modules={[Pagination]}>
            {
                urls.map((url,i) => (
                    <SwiperSlide key={i} className='-z-10 relative h-full w-full'>
                        <Image 
                            fill 
                            loading='eager' 
                            className='-z-10 h-full w-full object-cover object-center'
                            alt='Product Images' 
                            src={url} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    </div>
  )
}

export default ImageSlider