
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import CreateTweet from './CreateTweet'
import getCurrentUser from '../function/currentUser'

export default async function Sidebar() {
    const user = await getCurrentUser()
    const userButtonAppearance = {
        elements: {
            userButtonAvatarBox: "w-10 h-10", // Custom width and height
            // userButtonPopoverCard: "bg-blue-100", // Custom background for the popover card
            // userButtonPopoverActionButton: "text-red-600", // Custom text color for action buttons
        },
    }
    return (
        <div className='flex flex-col gap-4 px-3 md:pr-0 text-sm md:text-base'>
            <div className='flex gap-4 items-center'>
            <UserButton appearance={userButtonAppearance} />
                <span className='font-semibold leading-tight'> {user?.username}</span>
            </div>
            {user && <CreateTweet userId={user.id} />}
        </div >
    )
}
