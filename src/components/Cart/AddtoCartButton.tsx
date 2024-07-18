'use client';

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useCart } from '@/hooks/useCart';
import { Product } from '@/payload-types';

const AddtoCartButton = ({product} : {product : Product}) => {
    const { addItem } = useCart()
    const [isSuccess, setIsSucess] = useState(false);

    const btnClickHandler = () => {
        addItem(product)
        setIsSucess(true);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSucess(false)   
        }, 2000)

        return () => clearTimeout(timeout);
    }, [isSuccess])

    return (
        <Button
            onClick={btnClickHandler}
            size='lg' 
            className='w-full' >
                {isSuccess ? 'Added' : "Add to cart"}
        </Button>
  )
}

export default AddtoCartButton