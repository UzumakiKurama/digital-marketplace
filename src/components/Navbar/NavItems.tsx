"use client";

import { PRODUCT_CATEGORIES } from '@/config';
import React, { useRef, useState } from 'react'
import NavItem from './NavItem';
import { useOnClickOutside } from '@/hooks/useClickOnOutside';

const NavItems = () => {
    const [activeIndex , setActiveIndex] = useState<null | number>(null);
    const isAnyOpen = activeIndex !== null;

    const navRef = useRef(null);

    useOnClickOutside(navRef, () => setActiveIndex(null));

    return (
        <div className='flex gap-4 h-full' ref={navRef}>
            {
                PRODUCT_CATEGORIES.map((category, i) => {
                    
                    const handleOpen = () => {
                        if(activeIndex === i){
                            setActiveIndex(null)
                        } else {
                            setActiveIndex(i)
                        }
                    }

                    const isOpen = i === activeIndex;
                    
                    return (
                        <NavItem
                            key={category.value}
                            category={category}
                            handleOpen={handleOpen}
                            isOpen={isOpen}
                            isAnyOpen={isAnyOpen}
                             />
                    )
                })
            }
        </div>
    )
}

export default NavItems