import React from 'react'

const FeedbackScreen = ({ feedback, setIntermission }) => {
  return (
    <div className='flex items-center justify-center h-screen text-xs'>
        <div className='flex flex-col gap-4'>
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
          <button onClick={(() => setIntermission(true))}>Continue</button>
        </div>
    </div>
  )
}

export default FeedbackScreen