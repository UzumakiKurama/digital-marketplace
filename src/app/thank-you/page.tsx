import PaymentStatus from '@/components/PaymentStatus/PaymentStatus';
import { PRODUCT_CATEGORIES } from '@/config';
import { getPayloadClient } from '@/get-payload';
import { getServerSideUser } from '@/lib/payload-utils';
import { formatPrice } from '@/lib/utils';
import { Product, ProductFile, User } from '@/payload-types';
import { cookies} from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
    searchParams : {
        [key: string] : string | string[] | undefined
    }
}

const Page = async ({searchParams} : PageProps) => {
    const orderId = searchParams.orderId;
    const nextCookies = cookies()
    const {user} = await getServerSideUser(nextCookies);
 
    const payload = await getPayloadClient();

    const { docs : orders} = await payload.find({
        collection : "orders",
        depth : 2,
        where : {
            id : {
                equals : orderId
            } 
        }
    })

    const [order] = orders;
    if(!order) return notFound();

    const orderUserId = 
        typeof order.user === 'string' 
        ? order.user 
        : order.user.id;

    if(orderUserId !== user?.id){
        return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`)
    }

    const products = order.products as Product[]

    const orderTotal = products.reduce((total, product) => {
        return total + product.price
    }, 0)

  return (
    <main className='relative lg:min-h-full'>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-26 xl:gap-x-24">
            <div className="lg:col-start-1 w-full">
                <div className="hidden lg:block h-80 lg:absolute lg:h-3/5 lg:w-1/3 lg:pr-4">
                    <Image 
                        fill
                        src="/assets/thank-you.jpeg"
                        className='object-center'
                        alt="thank-you image"
                        />
                </div>
            </div>
            <div className="lg:col-start-2">
                <h1 className="text-sm font-medium text-blue-600">
                    Order Successfull
                </h1>
                <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
                    Thanks for Ordering
                </p>
                {
                    order._isPaid ? (
                        <p className='mt-2 text-base text-muted-foreground'>
                            Your orders was processed and your assests are available to download below. We&apos;ve sent your recipt and order details to {" "}
                            {typeof order.user !== "string" ? <span>{order.user.email}</span> : null}
                        </p>) 
                        : <p className='mt-2 text-base text-muted-foreground'>
                            We appreciate your order, and we&apos;re currently processing it. So hang tight and we&apos;ll send you confirmation very soon!
                        </p>
                }

                <div className="mt-16 text-sm font-medium">
                    <div className="text-muted-foreground">Order no.</div>
                    <div className="mt-2 text-gray-900">
                        {order.id}
                    </div>
                    <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                        {
                            (order.products as Product[]).map(product => {
                                const label = PRODUCT_CATEGORIES.find(
                                    ({value}) => value === product.category
                                )?.label

                                const downloadUrl = (product.product_files as ProductFile).url as string

                                const { image } = product.images[0]

                                return (
                                    <li key={product.id} className='flex space-x-6 py-6'>
                                        <div className="relative h-24 w-24">
                                            {typeof image !== "string" && image.url ? (
                                                <Image 
                                                    fill 
                                                    src={image.url} 
                                                    alt={`${product.name} image`}
                                                    className='flex-none rounded-md bg-gray-100 object-cover object-center' />
                                            ) : null}
                                        </div>
                                        <div className="flex-auto flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <h3 className='text-gray-900'>{product.name}</h3>
                                                <p className="my-1">
                                                    Category : {label}
                                                </p>
                                            </div>
                                            {
                                                order._isPaid ? (
                                                    <a 
                                                    href={downloadUrl} 
                                                    download={product.name} 
                                                    className='text-purple-600 hover:underline underline-offset-2'> 
                                                        Download Assest
                                                    </a>
                                                ) : null
                                            }
                                        </div>
                                        <p className='flex-none font-medium text-gray-900'>
                                            {formatPrice(product.price)}
                                        </p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="space-y-6 border-t border-gray-600 pt-6 text-sm font-medium">
                        <div className="flex justify-between">
                            <p>subtotal</p>
                            <p className='text-gray-900'>{formatPrice(orderTotal)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Transaction Fee</p>
                            <p className='text-gray-900'>{formatPrice(1)}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200">
                            <p className="text-base">Total</p>
                            <p className="text-base">
                                {formatPrice(orderTotal + 1)}
                            </p>
                        </div>
                    </div>
                    <PaymentStatus 
                        isPaid={order._isPaid} 
                        orderEmail={(order.user as User).email} 
                        orderId={order.id} />
                    <div className="mt-16 border-t border-gray-200 py-6 text-right">
                        <Link href="/products" className='text-sm font-medium text-purple-700 hover:text-purple-400'>
                            Continure shopping  &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}

export default Page