"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { RxHamburgerMenu } from 'react-icons/rx'
import { SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const MobileNavbar = () => {
    const { user } = useUser();

    return (
        <div className='md:hidden fixed top-0 left-0 w-full py-5 px-6 bg-white z-50'>
            <div className='flex justify-between'>
                <Link href='/'>
                    <p className='text-sm ml-3 mr-1'>
                        <b>TAMUHack</b>
                    </p>
                </Link>
                <Sheet>
                    <SheetTrigger>
                        <RxHamburgerMenu />
                    </SheetTrigger>
                    <SheetContent side='right'>
                        <SheetHeader>
                            <SheetTitle>
                                <span className='text-sm mt-4'>
                                    TAMUHack
                                </span>
                            </SheetTitle>
                            <SheetDescription>
                                <span className='flex flex-col gap-4 mt-6'>
                                    <Link href='/'>
                                        <SheetClose>Home</SheetClose>
                                    </Link>
                                    <Link href='/dashboard'>
                                        <SheetClose>Dashboard</SheetClose>
                                    </Link>
                                    <Link href='/play'>
                                        <SheetClose>Play</SheetClose>
                                    </Link>
                                    <Link href='/create'>
                                        <SheetClose>Create</SheetClose>
                                    </Link>
                                    {!user ? (
                                        <Link href='/sign-in'>
                                            <SheetClose>Log in</SheetClose>
                                        </Link>
                                    ) : (
                                        <SignOutButton>
                                            <Link href='/'>
                                                <SheetClose>Log out</SheetClose>
                                            </Link>
                                        </SignOutButton>
                                    )}
                                </span>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default MobileNavbar