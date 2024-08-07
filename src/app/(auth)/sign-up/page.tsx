"use client";

import { Icons } from '@/components/Icons/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCredentialsValidator, TAuthCredentialsValidator } from '@/lib/validators/account-credentials-validators';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';

import Link from 'next/link'
import React, { useEffect } from 'react'
import { ZodError } from 'zod';
import { useRouter } from 'next/navigation';

const Page = () => {

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<TAuthCredentialsValidator>({
    resolver : zodResolver(AuthCredentialsValidator)
  });

  const router = useRouter();

  const {mutate, isLoading} = trpc.auth.createPayloadUser.useMutation({
    onError : (err) => {
        if(err?.data?.code === "CONFLICT"){
            toast.error('This email is already in use. Use sign in instead or try with diffrent email.')
            return
        }

        if(err instanceof ZodError) {
            toast.error(err.issues[0].message);
            return
        }

        toast.error("Something went wrong. Please try again");
    }, 

    onSuccess : ({sentToEmail}) => {
        toast.success(`A verification link is sent to your email ${sentToEmail}. Please click on it to verify`)
        router.push(`/verify-email?to=${sentToEmail}`);
    }
  });

  useEffect(() => {
    if(errors.password){
        if(errors.password){
            toast.error(errors.password.message);
        }
    
        if(errors.email){
            toast.error(errors.email.message);
        }
      }
  }, [errors]);

  const onFormSubmit = ({email, password} : TAuthCredentialsValidator) => {
    mutate({email, password})
  }

  return (
    <>
        <div className='container relative pt-20 flex flex-col items-center justify-center lg:px-0'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                <div className='flex flex-col items-center text-center space-y-2'>
                    <Icons.logo className='h-20 w-20' />
                    <h1 className='text-2xl font-bold'>
                        Create an account
                    </h1>

                    <Link 
                        href="/sign-in" 
                        className={buttonVariants({
                        variant : 'link',
                        className: "gap-1"
                    })}>
                        Already have an account? Sign-in 
                        <ArrowRightIcon className='h-4 w-4'  />
                    </Link>
                </div>

                <div className='grid gap-6'>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className='grid gap-1.5'>
                            <div className='flex flex-col justify-center pt-4'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    {...register("email")} 
                                    placeholder='email@example.com'
                                    className={cn('mt-2',{
                                        'focus-visible:ring-red-500' : errors.email,
                                    })} />
                            </div>
                            {
                                errors?.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )
                            }
                            <div className='flex flex-col justify-center pt-2'>
                                <Label htmlFor='password'>Password</Label>
                                <Input
                                    {...register("password")}
                                    type='password'
                                    placeholder='password'
                                    className={cn('mt-2',{
                                        'focus-visible:ring-red-500' : errors.password,
                                    })} />
                            </div>
                            {
                                errors?.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )
                            }
                            <Button className='mt-4'>Sign up</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Page