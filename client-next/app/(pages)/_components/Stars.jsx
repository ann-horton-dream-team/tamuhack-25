import React from 'react'

const Stars = () => {
    return (
        <div>
            <img src='star.svg' className="z-10 absolute top-[80px] left-[700px] w-[25px] hidden lg:block" />
            <img src='star.svg' className="z-10 absolute top-[150px] right-[200px] w-[30px]" />
            <img src='star.svg' className="z-10 absolute top-[160px] left-[180px] w-[40px]" />
        </div>
    )
}

export default Stars