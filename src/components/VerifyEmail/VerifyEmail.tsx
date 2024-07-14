"use client";

import React from 'react'
import { trpc } from '@/trpc/client';
import { Loader2, XCircle } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface VerifyEmailProps {
    token : string 
}

const VerifyEmail = ({token} : VerifyEmailProps) => {
  const {data, isLoading, isError} = trpc.auth.verifyEmail.useQuery({
    token,
  });
  debugger;
    
    if(data?.success){
        return (<div className='flex h-full flex-col items-center justify-center'>
        <div className='relative mb-4 h-60 w-60 text-muted-foreground'>
          <Image
            src='/assets/email-verify.jpeg'
            fill
            alt='the email was sent'
          />
        </div>

        <h3 className='font-semibold text-2xl'>
          You&apos;re all set!
        </h3>
        <p className='text-muted-foreground text-center mt-1'>
          Thank you for verifying your email.
        </p>
        <Link
          className={buttonVariants({ className: 'mt-4' })}
          href='/sign-in'>
          Sign in
        </Link>
      </div>)
    }

    if(isLoading){
        return (<div className="flex flex-col items-center justify-center">
            <Loader2 className='animate-spin h-8 w-8 text-gray-500' />
            <h3 className="text-2xl font-semibold">
                Verifying ...
            </h3>
            <p className="text-muted-foreground text-center">
                This won't take much time.
            </p>
        </div>)
    }

    if(isError) {
        return (<div className="flex flex-col items-center justify-center">
            <XCircle className='h-8 w-8 text-red-600' />
            <h3 className="text-2xl font-semibold">
                There&apos;s some issue with your email verification.
            </h3>
            <p className="text-muted-foreground text-center">
                Please try again after some time.
            </p>
        </div>)
    }

}

export default VerifyEmail