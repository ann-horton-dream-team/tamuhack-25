import React from 'react'
import { Button } from "@/components/ui/button";

const FeedbackScreen = ({ feedback, setIntermission }) => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-[80%] rounded-3xl p-1 bg-gradient-to-b from-purple-600 to-purple-400">
        <div className="rounded-[calc(1.5rem-1px)] p-10 bg-white">
          <div className='flex flex-col gap-4 text-xs'>
            <div>{feedback.feedback}</div>

            <div>Time complexity: {feedback.time_complexity.score}/10</div>
            <div>{feedback.time_complexity.feedback}</div>

            <div>Space complexity: {feedback.space_complexity.score}/10</div>
            <div>{feedback.space_complexity.feedback}</div>

            <div>Use of data structures and algorithms: {feedback.dsa.score}/10</div>
            <div>{feedback.dsa.feedback}</div>

            <div>Thoroughness of response: {feedback.explanation.score}/10</div>
            <div>{feedback.explanation.feedback}</div>
            <div>Final score: {feedback.final_score}/10</div>
            <div className="flex justify-center">
              <Button className="w-[50%] bg-gray-800 text-white hover:bg-gray-900 m-5" onClick={() => setIntermission(true)}>Continue</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackScreen