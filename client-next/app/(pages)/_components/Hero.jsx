import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from 'next/link'
import Stars from "./Stars";
import Typewriter from 'typewriter-effect';
import { ArrowRight } from "lucide-react";

export const Hero = () => {
    const { user } = useUser();
    return(
        <div className="bg-black text-white bg-[linear-gradient(to_bottom,#0000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] relative overflow-clip">
            <Stars />
            <div className="flex items-center justify-center relative min-h-screen">
                {user ? (
                    <div className="text-center">

                        <div className="text-6xl font-bold text-white py-4"><Typewriter
                            options={{
                            strings: [`Hello, ${user.firstName}!`],
                            autoStart: true,
                            pauseFor: 1000000,
                            loop: true,
                        }}
                        /></div>
                        <p className="text-base">Welcome to RaceCode.</p>
                        <Link href="play">
                            <Button href='/play'className="m-8 px-12 rounded-full bg-white text-black transform hover:bg-gray-200 mx-auto mt-8">Play</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="text-center">

                        <div className="text-6xl font-bold mt-8">
                            <Typewriter
                            options={{
                            strings: ['Welcome to RaceCode.'],
                            autoStart: true,
                            pauseFor: 1000000,
                            loop: true,
                        }}
                        /></div>
                        <p className="text-base mt-6">A 1v1 LeetCode blitz interview preparation game.</p>
                        <Link href="sign-in">

                            <Button className="flex items-center justify-center py-3 px-5 bg-white text-black rounded-full hover:bg-gray-200 mx-auto mt-8 ">Get started<ArrowRight/></Button>
                        </Link>

                    </div>
                )}
            </div>
            <div className = "absolute h-[375px] w-[130%] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000000_82%,#9560EB)] top-[calc(100%-125px)]" />
        </div>
    );
};