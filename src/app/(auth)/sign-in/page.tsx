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
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const continueAsSeller = () => {
    router.push("?as=seller");
  }

  const continueAsBuyer = () => {
    router.replace("sign-in", undefined)
  }
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<TAuthCredentialsValidator>({
    resolver : zodResolver(AuthCredentialsValidator)
  });


  const {mutate : signIn, isLoading} = trpc.auth.signIn.useMutation({
    onSuccess : () => {
        router.refresh();
        toast.success("Signed in successfully");

        if(origin){
            router.push(`/${origin}`);
            return;
        }

        if(isSeller){
            router.push("/sell");
            return;
        }

        router.push('/');
    },

    onError : (err) => {
        if(err.data?.code === "UNAUTHORIZED"){
            toast.error("Invalid email or password");
        }
    }
  });

  const onFormSubmit = ({
    email, 
    password
    } : TAuthCredentialsValidator) => {
    signIn({email, password})
  }

  return (
    <>
        <div className='container relative pt-20 flex flex-col items-center justify-center lg:px-0'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                <div className='flex flex-col items-center text-center space-y-2'>
                    <Icons.logo className='h-20 w-20' />
                    <h1 className='text-2xl font-bold'>
                        Sign in to your {isSeller ? "Seller" : null} account 
                    </h1>

                    <Link 
                        href="/sign-up" 
                        className={buttonVariants({
                        variant : 'link',
                        className: "gap-1"
                    })}>
                        Don&apos;t have an account? Sign-up
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
                            <Button className='mt-4'>Sign in</Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div 
                            aria-hidden="true" 
                            className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                or
                            </span>
                        </div>
                    </div>
                        {
                            isSeller ? (
                                <Button 
                                    onClick={continueAsBuyer}
                                    variant="secondary"
                                    disabled={isLoading}>
                                    Continue as customer
                                </Button>
                            ) : (
                                <Button
                                    onClick={continueAsSeller}
                                    variant="secondary"
                                    disabled={isLoading}>
                                    Continue as seller
                                </Button>
                            )
                        }
                    <div className='relative border-2 text-sm rounded-md text-muted-foreground p-2 '>
                        Use the below data as login details <br/>
                        Email :- abhijeet1702@gmail.com <br/>
                        Password :- 123456789
                        <div className="relative">
                            <div 
                                aria-hidden="true" 
                                className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    or
                                </span>
                            </div>
                        </div>
                        Email :- bbgiabhijeet12@gmail.components<br/>
                        Password :- 123456789
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Page