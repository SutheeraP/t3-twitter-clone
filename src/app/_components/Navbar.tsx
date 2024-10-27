import { UserButton } from '@clerk/nextjs'
import React from 'react'
import CreateTweet from './CreateTweet'
import { currentUser } from '@clerk/nextjs/server'

export default async function Navbar() {
    const user = await currentUser()
    const userButtonAppearance = {
        elements: {
            userButtonAvatarBox: "w-10 h-10", // Custom width and height
            // userButtonPopoverCard: "bg-blue-100", // Custom background for the popover card
            // userButtonPopoverActionButton: "text-red-600", // Custom text color for action buttons
        },
    }
    return (
        <div className='flex flex-col gap-4 px-3 pt-2'>
            <div className='flex gap-4 items-center'>
                <span><UserButton appearance={userButtonAppearance} /></span>
                <span className='font-medium leading-tight'> {user?.username}</span>
            </div>
            <CreateTweet />
        </div >
    )
}